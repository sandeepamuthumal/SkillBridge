import mongoose from 'mongoose';
import dotenv from 'dotenv';
import JobType from '../models/JobType.js'; // Update path if needed

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const jobTypes = [
    { name: 'Full-Time', description: 'Permanent full-time employment' },
    { name: 'Part-Time', description: 'Part-time job with flexible hours' },
    { name: 'Internship', description: 'Temporary internship for students' },
    { name: 'Freelance', description: 'Freelance project-based work' },
    { name: 'Contract', description: 'Fixed-term contract work' },
    { name: 'Remote', description: 'Work from anywhere opportunities' },
    { name: 'On-site Project', description: 'Project-based on-site engagement' },
];

const seedJobTypes = async() => {
    try {
        await mongoose.connect(MONGO_URI);
        await JobType.deleteMany();
        await JobType.insertMany(jobTypes);
        console.log('✅ Job types seeded successfully');
        process.exit();
    } catch (err) {
        console.error('❌ Job type seeding failed', err);
        process.exit(1);
    }
};

seedJobTypes();