const User = require('./models/User');
const Project = require('./models/Project');
const connectDB = require('./config/database');
require('dotenv').config();

// Sample data
const users = [
    // Students
    {
        name: 'Sophie van der Berg',
        email: 'sophie.vandenberg@student.ru.nl',
        password: 'password123',
        userType: 'student',
        university: 'Radboud University Nijmegen',
        studyProgram: 'Artificial Intelligence',
        studyYear: 3,
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis'],
        bio: 'Passionate AI student looking for challenging thesis projects in machine learning.',
        location: 'Nijmegen, Netherlands'
    },
    {
        name: 'Lars Hendriksen',
        email: 'lars.hendriksen@student.han.nl',
        password: 'password123',
        userType: 'student',
        university: 'HAN University of Applied Sciences',
        studyProgram: 'Software Engineering',
        studyYear: 4,
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        bio: 'Full-stack developer interested in web development thesis opportunities.',
        location: 'Nijmegen, Netherlands'
    },
    {
        name: 'Emma de Vries',
        email: 'emma.devries@student.ru.nl',
        password: 'password123',
        userType: 'student',
        university: 'Radboud University Nijmegen',
        studyProgram: 'Data Science',
        studyYear: 2,
        skills: ['R', 'Python', 'Statistics', 'SQL'],
        bio: 'Data science enthusiast seeking real-world data analysis projects.',
        location: 'Nijmegen, Netherlands'
    },
    // Companies
    {
        name: 'Tom Bach',
        email: 'tom@techinnovate.nl',
        password: 'password123',
        userType: 'company',
        companyName: 'TechInnovate NL',
        industry: 'Technology',
        companySize: '11-50',
        website: 'https://techinnovate.nl',
        location: 'Nijmegen, Netherlands',
        description: 'Leading technology company in Nijmegen specializing in AI and machine learning solutions.'
    },
    {
        name: 'Maria Santos',
        email: 'maria@datawise.nl',
        password: 'password123',
        userType: 'company',
        companyName: 'DataWise Analytics',
        industry: 'Data Analytics',
        companySize: '51-200',
        website: 'https://datawise.nl',
        location: 'Nijmegen, Netherlands',
        description: 'Data analytics consultancy helping businesses make data-driven decisions.'
    },
    {
        name: 'Jan Bakker',
        email: 'jan@greentech.nl',
        password: 'password123',
        userType: 'company',
        companyName: 'GreenTech Solutions',
        industry: 'Sustainability',
        companySize: '1-10',
        website: 'https://greentech.nl',
        location: 'Nijmegen, Netherlands',
        description: 'Sustainable technology startup focused on environmental solutions.'
    }
];

const projects = [
    {
        title: 'AI-Powered Customer Service Chatbot',
        description: 'Develop an intelligent chatbot using natural language processing to improve customer service efficiency. The system should handle common queries, escalate complex issues, and learn from interactions.',
        category: 'Machine Learning',
        requiredSkills: ['Python', 'NLP', 'Machine Learning', 'TensorFlow'],
        duration: '6 months',
        startDate: new Date('2025-02-01'),
        location: 'Nijmegen, Netherlands',
        remote: true,
        compensation: 'Paid',
        tags: ['AI', 'NLP', 'Chatbot', 'Customer Service']
    },
    {
        title: 'E-commerce Platform Development',
        description: 'Build a modern e-commerce platform with real-time inventory management, payment integration, and responsive design. Focus on scalability and user experience.',
        category: 'Web Development',
        requiredSkills: ['React', 'Node.js', 'MongoDB', 'REST API'],
        duration: '9 months',
        startDate: new Date('2025-03-01'),
        location: 'Nijmegen, Netherlands',
        remote: false,
        compensation: 'Paid',
        tags: ['E-commerce', 'Full Stack', 'Web Development']
    },
    {
        title: 'Predictive Analytics for Energy Consumption',
        description: 'Create predictive models to forecast energy consumption patterns in commercial buildings. Help optimize energy usage and reduce costs.',
        category: 'Data Analysis',
        requiredSkills: ['Python', 'R', 'Statistics', 'Data Visualization'],
        duration: '6 months',
        startDate: new Date('2025-02-15'),
        location: 'Nijmegen, Netherlands',
        remote: true,
        compensation: 'Negotiable',
        tags: ['Predictive Analytics', 'Energy', 'Sustainability']
    },
    {
        title: 'IoT Smart Agriculture System',
        description: 'Design and implement an IoT-based system for monitoring soil conditions, weather, and crop health. Focus on helping farmers make data-driven decisions.',
        category: 'IoT',
        requiredSkills: ['Arduino', 'Python', 'Cloud Computing', 'Sensors'],
        duration: '9 months',
        startDate: new Date('2025-04-01'),
        location: 'Nijmegen, Netherlands',
        remote: false,
        compensation: 'Unpaid',
        tags: ['IoT', 'Agriculture', 'Sensors', 'Smart Farming']
    },
    {
        title: 'Blockchain Supply Chain Tracker',
        description: 'Develop a blockchain-based solution for tracking products through the supply chain, ensuring transparency and authenticity.',
        category: 'Blockchain',
        requiredSkills: ['Blockchain', 'Solidity', 'Smart Contracts', 'JavaScript'],
        duration: '12 months',
        startDate: new Date('2025-05-01'),
        location: 'Nijmegen, Netherlands',
        remote: true,
        compensation: 'Paid',
        tags: ['Blockchain', 'Supply Chain', 'Ethereum']
    },
    {
        title: 'Mobile Health Tracking Application',
        description: 'Create a cross-platform mobile app for tracking health metrics, integrating with wearable devices, and providing personalized health insights.',
        category: 'Mobile Development',
        requiredSkills: ['React Native', 'Mobile Development', 'API Integration'],
        duration: '6 months',
        startDate: new Date('2025-03-15'),
        location: 'Nijmegen, Netherlands',
        remote: true,
        compensation: 'Paid',
        tags: ['Mobile', 'Health', 'Fitness', 'Wearables']
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany();
        await Project.deleteMany();

        // Create users
        console.log('👥 Creating users...');
        const createdUsers = await User.create(users);
        console.log(`✅ Created ${createdUsers.length} users`);

        // Get company users for projects
        const companies = createdUsers.filter(u => u.userType === 'company');

        // Add company references to projects
        const projectsWithCompanies = projects.map((project, index) => {
            const company = companies[index % companies.length];
            return {
                ...project,
                company: company._id,
                companyName: company.companyName
            };
        });

        // Create projects
        console.log('📋 Creating projects...');
        const createdProjects = await Project.create(projectsWithCompanies);
        console.log(`✅ Created ${createdProjects.length} projects`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Students: ${createdUsers.filter(u => u.userType === 'student').length}`);
        console.log(`   Companies: ${companies.length}`);
        console.log(`   Projects: ${createdProjects.length}`);
        console.log('\n🔐 Login credentials (all users):');
        console.log('   Password: password123');
        console.log('\n📧 Sample emails:');
        console.log('   Student: sophie.vandenberg@student.ru.nl');
        console.log('   Company: tom@techinnovate.nl');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
