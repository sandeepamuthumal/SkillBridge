import mongoose from 'mongoose';
import dotenv from 'dotenv';
import JobCategory from '../models/JobCategory.js'; // Update path if needed

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const jobCategories = [{
        name: 'Software Development',
        description: 'Jobs related to web, mobile, and software engineering',
        icon: '💻',
        skillKeywords: ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'MongoDB'],
    },
    {
        name: 'Design & UI/UX',
        description: 'Graphic, UI, and product design roles',
        icon: '🎨',
        skillKeywords: ['Figma', 'Adobe XD', 'Photoshop', 'Wireframes', 'Prototyping'],
    },
    {
        name: 'Marketing & Sales',
        description: 'Marketing, digital campaigns, SEO, and sales',
        icon: '📈',
        skillKeywords: ['SEO', 'Marketing', 'Sales', 'Social Media', 'Analytics'],
    },
    {
        name: 'Data & AI',
        description: 'Roles in data science, ML, and analytics',
        icon: '📊',
        skillKeywords: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis'],
    },
    {
        name: 'Content & Writing',
        description: 'Copywriting, technical writing, and blogs',
        icon: '📝',
        skillKeywords: ['Writing', 'Editing', 'Blogs', 'Proofreading'],
    },
    {
        name: 'Business & Management',
        description: 'Project management, product ownership, business analysis',
        icon: '📋',
        skillKeywords: ['Scrum', 'Agile', 'PM', 'Business Analysis', 'Leadership'],
    },
    {
        name: 'Finance & Accounting',
        description: 'Jobs in finance, accounting, and bookkeeping',
        icon: '💰',
        skillKeywords: ['Excel', 'Finance', 'Bookkeeping', 'Accounting'],
    },
    {
        name: 'Human Resources',
        description: 'Recruitment, HRM, and employee engagement',
        icon: '🧑‍💼',
        skillKeywords: ['HR', 'Recruitment', 'Payroll', 'Employee Management'],
    },
];

const seedJobCategories = async() => {
    try {
        await mongoose.connect(MONGO_URI);
        await JobCategory.deleteMany();
        await JobCategory.insertMany(jobCategories);
        console.log('✅ Job categories seeded successfully');
        process.exit();
    } catch (err) {
        console.error('❌ Job category seeding failed', err);
        process.exit(1);
    }
};

seedJobCategories();