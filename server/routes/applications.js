const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Project = require('../models/Project');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/applications
// @desc    Get all applications (filtered by user)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let query = {};

        // If student, get their applications
        if (req.user.userType === 'student') {
            query.student = req.user.id;
        }
        // If company, get applications for their projects
        else if (req.user.userType === 'company') {
            query.company = req.user.id;
        }

        const applications = await Application.find(query)
            .populate('project', 'title category requiredSkills')
            .populate('student', 'name email university studyProgram skills avatar')
            .populate('company', 'companyName location avatar')
            .sort('-createdAt');

        res.json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/applications/:id
// @desc    Get single application
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('project')
            .populate('student', 'name email university studyProgram skills bio avatar')
            .populate('company', 'companyName location website avatar');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Make sure user is authorized to view this application
        if (
            application.student._id.toString() !== req.user.id &&
            application.company._id.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this application'
            });
        }

        res.json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/applications
// @desc    Create new application
// @access  Private (Student only)
router.post('/', protect, authorize('student'), async (req, res) => {
    try {
        const { projectId, coverLetter } = req.body;

        // Check if project exists
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Check if project is still open
        if (project.status !== 'open') {
            return res.status(400).json({
                success: false,
                message: 'This project is no longer accepting applications'
            });
        }

        // Check if student already applied
        const existingApplication = await Application.findOne({
            project: projectId,
            student: req.user.id
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied to this project'
            });
        }

        // Create application
        const application = await Application.create({
            project: projectId,
            student: req.user.id,
            company: project.company,
            coverLetter
        });

        // Add student to project applicants
        project.applicants.push(req.user.id);
        await project.save();

        res.status(201).json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/applications/:id
// @desc    Update application status
// @access  Private (Company only)
router.put('/:id', protect, authorize('company'), async (req, res) => {
    try {
        let application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Make sure company owns this application
        if (application.company.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this application'
            });
        }

        application = await Application.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('student', 'name email university studyProgram');

        // If application is accepted, update project
        if (req.body.status === 'accepted') {
            await Project.findByIdAndUpdate(application.project, {
                selectedStudent: application.student._id,
                status: 'in-progress'
            });
        }

        res.json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/applications/:id
// @desc    Delete application
// @access  Private (Student owner only)
router.delete('/:id', protect, authorize('student'), async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Make sure student owns this application
        if (application.student.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this application'
            });
        }

        // Remove student from project applicants
        await Project.findByIdAndUpdate(application.project, {
            $pull: { applicants: req.user.id }
        });

        await application.deleteOne();

        res.json({
            success: true,
            message: 'Application withdrawn successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
