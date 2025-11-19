const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a project title'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a project description'],
        maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: [true, 'Please specify a category'],
        enum: [
            'Machine Learning',
            'Web Development',
            'Data Analysis',
            'Mobile Development',
            'Blockchain',
            'IoT',
            'Cybersecurity',
            'AI',
            'Cloud Computing',
            'Other'
        ]
    },
    requiredSkills: {
        type: [String],
        required: true,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'Please provide at least one required skill'
        }
    },
    duration: {
        type: String,
        required: [true, 'Please specify project duration'],
        enum: ['3 months', '6 months', '9 months', '12 months']
    },
    startDate: {
        type: Date,
        required: [true, 'Please specify a start date']
    },
    location: {
        type: String,
        default: 'Nijmegen, Netherlands'
    },
    remote: {
        type: Boolean,
        default: false
    },
    compensation: {
        type: String,
        enum: ['Unpaid', 'Paid', 'Negotiable'],
        default: 'Unpaid'
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'completed', 'closed'],
        default: 'open'
    },
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    selectedStudent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    views: {
        type: Number,
        default: 0
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for search
projectSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Project', projectSchema);
