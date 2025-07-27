import mongoose from 'mongoose';
import dotenv from 'dotenv';
import JobPost from '../models/JobPost.js';
import Employer from '../models/Employer.js';
import JobCategory from '../models/JobCategory.js';
import JobType from '../models/JobType.js';
import City from '../models/City.js';

dotenv.config();

// Connect to DB
const MONGO_URI = process.env.MONGODB_URI;
await mongoose.connect(MONGO_URI);
console.log('MongoDB connected');

// Fetch necessary IDs
const employer = await Employer.findOne(); // or use a specific _id
const category = await JobCategory.findOne();
const type = await JobType.findOne();
const city = await City.findOne();

if (!employer || !category || !type || !city) {
    console.error('Missing required referenced documents.');
    process.exit(1);
}

// Sample job post data
const jobPosts = [{
        employerId: employer._id,
        title: 'Full Stack Developer',
        description: 'Develop scalable web applications.',
        responsibilities: [
            'Build front-end interfaces',
            'Design and consume REST APIs',
            'Collaborate with product teams'
        ],
        requirements: [
            'Strong knowledge of JavaScript',
            'Experience with MongoDB and Node.js'
        ],
        preferredSkills: ['React', 'TypeScript', 'Docker'],
        experienceLevel: 'Mid Level',
        experienceYears: { min: 2, max: 5 },
        categoryId: category._id,
        typeId: type._id,
        cityId: city._id,
        salaryRange: {
            min: 60000,
            max: 90000,
            currency: 'USD',
            negotiable: true
        },
        benefits: ['Health insurance', 'Flexible hours'],
        workArrangement: 'Hybrid',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'Published',
        isApproved: true,
        approvedBy: employer._id,
        approvedAt: new Date(),
        maxApplications: 200,
        featured: true,
        tags: ['fullstack', 'remote', 'javascript']
    },
    {
        employerId: employer._id,
        title: 'Frontend Developer Intern',
        description: 'Join our dynamic startup as a Frontend Developer Intern and gain hands-on experience building modern web applications using React, TypeScript, and cutting-edge technologies.',
        responsibilities: [
            'Develop responsive web applications using React and TypeScript',
            'Collaborate with design team to implement UI/UX designs',
            'Write clean, maintainable code following best practices',
            'Participate in code reviews and team meetings'
        ],
        requirements: [
            'Currently pursuing Computer Science or related degree',
            'Basic knowledge of HTML, CSS, and JavaScript',
            'Familiarity with React framework',
            'Strong problem-solving skills'
        ],
        preferredSkills: ['TypeScript', 'Tailwind CSS', 'Git', 'Figma'],
        experienceLevel: 'Entry Level',
        experienceYears: { min: 0, max: 1 },
        categoryId: category._id,
        typeId: type._id,
        cityId: city._id,
        salaryRange: {
            min: 25000,
            max: 35000,
            currency: 'LKR',
            negotiable: false
        },
        benefits: ['Flexible hours', 'Learning opportunities', 'Mentorship'],
        workArrangement: 'Hybrid',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'Published',
        isApproved: true,
        approvedBy: employer._id,
        approvedAt: new Date(),
        maxApplications: 200,
        featured: true,
        tags: ['React', 'JavaScript', 'Internship'],
    }
];

await JobPost.deleteMany();
// Insert
await JobPost.insertMany(jobPosts);
console.log('Job posts seeded successfully');

mongoose.connection.close();