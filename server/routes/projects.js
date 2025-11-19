const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/projects
// @desc    Get all projects with filtering & search
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, search, status, remote, sortBy } = req.query;
        let query = {};

        // Filter by category
        if (category && category !== 'All Categories') {
            query.category = category;
        }

        // Filter by status
        if (status) {
            query.status = status;
        } else {
            query.status = 'open'; // Default to open projects
        }

        // Filter by remote
        if (remote !== undefined) {
            query.remote = remote === 'true';
        }

        // Search in title, description, and tags
        if (search) {
            query.$text = { $search: search };
        }

        // Build query
        let projectsQuery = Project.find(query).populate('company', 'companyName location avatar');

        // Sort
        if (sortBy === 'newest') {
            projectsQuery = projectsQuery.sort('-createdAt');
        } else if (sortBy === 'oldest') {
            projectsQuery = projectsQuery.sort('createdAt');
        } else if (sortBy === 'popular') {
            projectsQuery = projectsQuery.sort('-views -applicants');
        }

        const projects = await projectsQuery;

        res.json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('company', 'companyName location website description avatar')
            .populate('applicants', 'name email university studyProgram avatar');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Increment views
        project.views += 1;
        await project.save();

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Company only)
router.post('/', protect, authorize('company'), async (req, res) => {
    try {
        // Add company info to project
        req.body.company = req.user.id;
        req.body.companyName = req.user.companyName;

        const project = await Project.create(req.body);

        res.status(201).json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Company owner only)
router.put('/:id', protect, authorize('company'), async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Make sure user is project owner
        if (project.company.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this project'
            });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Company owner only)
router.delete('/:id', protect, authorize('company'), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Make sure user is project owner
        if (project.company.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this project'
            });
        }

        await project.deleteOne();

        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/projects/company/:companyId
// @desc    Get all projects by company
// @access  Public
router.get('/company/:companyId', async (req, res) => {
    try {
        const projects = await Project.find({ company: req.params.companyId });

        res.json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
