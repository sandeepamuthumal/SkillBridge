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
        title: 'UI/UX Design Intern',
        description: 'Looking for a creative UI/UX Design Intern to join our product team and help create amazing user experiences for our mobile and web applications.',
        responsibilities: [
            'Create wireframes and prototypes for new features',
            'Conduct user research and usability testing',
            'Design user interfaces for web and mobile platforms',
            'Collaborate with developers to ensure design implementation'
        ],
        requirements: [
            'Portfolio showcasing design projects',
            'Proficiency in Figma or Adobe XD',
            'Understanding of design principles',
            'Strong communication skills'
        ],
        preferredSkills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
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
        benefits: ['Creative freedom', 'Portfolio building', 'Design tools access'],
        workArrangement: 'Remote',
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
        title: 'Marketing Assistant',
        description: 'Join our marketing team as a part-time Marketing Assistant to help with digital marketing campaigns, content creation, and social media management.',
        responsibilities: [
            'Assist in creating marketing content',
            'Manage social media accounts',
            'Support email marketing campaigns',
            'Analyze marketing metrics and prepare reports'
        ],
        requirements: [
            'Strong written communication skills',
            'Basic knowledge of social media platforms',
            'Interest in digital marketing',
            'Ability to work independently'
        ],
        preferredSkills: ['Canva', 'Google Analytics', 'Content Writing', 'Social Media'],
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
        benefits: ['Flexible schedule', 'Marketing training', 'Performance bonus'],
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


// Insert
await JobPost.insertMany(jobPosts);
console.log('Job posts seeded successfully');

mongoose.connection.close();