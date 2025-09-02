// AdminJobController.js
import JobPost from '../models/JobPost.js';
import Employer from '../models/Employer.js'; 
import JobCategory from '../models/JobCategory.js';
import JobType from '../models/JobType.js';
import City from '../models/City.js';
import { NotFoundError } from '../errors/not-found-error.js';
import { ValidationError } from '../errors/validation-error.js';

export const getAllJobPostsAdmin = async (req, res, next) => {
    console.log('--- SERVER: Inside getAllJobPostsAdmin controller ---');
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const statusFilterParam = req.query.status;

        console.log(`SERVER: Received frontend query params: page=${page}, limit=${limit}, statusFilterParam='${statusFilterParam}'`);

        const query = {};
        query.isActive = true; // Default to true for `isActive`

        if (statusFilterParam) {
            if (statusFilterParam === 'pending') {
                query.isApproved = false;
                query.status = { $in: ['Draft', 'Paused'] };
                console.log('SERVER: Filter applied: Pending Approval (isApproved:false, status:{ $in: [\'Draft\', \'Paused\']})');
            } else if (statusFilterParam === 'Closed') {
                query.status = statusFilterParam;
                query.isActive = false; // Override isActive to show inactive 'Closed' posts
                console.log('SERVER: Filter applied: Closed (isActive:false, status:Closed)');
            } else {
                query.status = statusFilterParam;
                console.log(`SERVER: Filter applied: Specific status='${statusFilterParam}'`);
            }
        } else {
            console.log('SERVER: No specific status filter param. Fetching all isActive: true posts.');
        }

        console.log('SERVER: Final Mongoose Query Object for JobPost.find():', JSON.stringify(query)); // Log the exact query

        const totalJobPosts = await JobPost.countDocuments(query);
        const totalPages = Math.ceil(totalJobPosts / limit);

        console.log(`SERVER: JobPost.countDocuments result: ${totalJobPosts} total posts matching query.`);
        console.log(`SERVER: Calculated total pages: ${totalPages}`);

        const jobPosts = await JobPost.find(query)
            .populate('employerId', 'companyName')
            .populate('categoryId', 'name')
            .populate('typeId', 'name')
            .populate('cityId', 'name country')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        console.log(`SERVER: JobPost.find() result: Fetched ${jobPosts.length} job posts.`);
        // console.log('SERVER: Fetched Job Posts raw data (first 2):', JSON.stringify(jobPosts.slice(0, 2))); // 

        const formattedJobPosts = jobPosts.map(job => ({
            ...job,
            employerName: job.employerId ? job.employerId.companyName : 'N/A',
            categoryName: job.categoryId ? job.categoryId.name : 'N/A',
            typeName: job.typeId ? job.typeId.name : 'N/A',
            cityName: job.cityId ? job.cityId.name : 'N/A',
            cityCountry: job.cityId ? job.cityId.country : 'N/A',
        }));

        console.log(`SERVER: Sending successful response with ${formattedJobPosts.length} formatted job posts.`);
        res.status(200).json({
            success: true,
            message: 'Job posts fetched successfully',
            jobPosts: formattedJobPosts,
            currentPage: page,
            totalPages,
            totalJobPosts,
        });
    } catch (error) {
        console.error('SERVER: CRITICAL ERROR in getAllJobPostsAdmin:', error);
        if (error.stack) {
            console.error('SERVER: Stack Trace:', error.stack);
        }
        next(error);
    }
};


export const getJobPostByIdAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const jobPost = await JobPost.findById(id)
            .populate('employerId', 'companyName companyWebsite logoUrl industry companySize contactPersonName contactInfo socialLinks')
            .populate('categoryId', 'name')
            .populate('typeId', 'name')
            .populate('cityId', 'name country')
            .lean();

        if (!jobPost) {
            throw new NotFoundError('Job post not found');
        }

        const formattedJobPost = {
            ...jobPost,
            employerName: jobPost.employerId ? jobPost.employerId.companyName : 'N/A',
            categoryName: jobPost.categoryId ? jobPost.categoryId.name : 'N/A',
            typeName: jobPost.typeId ? jobPost.typeId.name : 'N/A',
            cityName: jobPost.cityId ? jobPost.cityId.name : 'N/A',
            cityCountry: jobPost.cityId ? jobPost.cityId.country : 'N/A',
        };

        res.status(200).json({
            success: true,
            message: 'Job post details fetched successfully',
            jobPost: formattedJobPost,
        });
    } catch (error) {
        console.error('Error in getJobPostByIdAdmin:', error);
        next(error);
    }
};

export const approveJobPost = async (req, res, next) => {
    try {
        const { id } = req.params;

        const jobPost = await JobPost.findById(id);
        if (!jobPost) {
            throw new NotFoundError('Job post not found');
        }

        if (jobPost.isApproved && jobPost.status === 'Published') {
            throw new ValidationError('Job post is already approved and published.');
        }

        jobPost.isApproved = true;
        jobPost.approvedBy = req.user.id;
        jobPost.approvedAt = Date.now();
        jobPost.status = 'Published';

        await jobPost.save();

        res.status(200).json({
            success: true,
            message: 'Job post approved and published successfully!',
        });
    } catch (error) {
        console.error('Error in approveJobPost:', error);
        next(error);
    }
};

export const deleteJobPostAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;

        const jobPost = await JobPost.findById(id);
        if (!jobPost) {
            throw new NotFoundError('Job post not found');
        }

        jobPost.status = 'Closed';
        jobPost.isActive = false;
        await jobPost.save();

        res.status(200).json({
            success: true,
            message: 'Job post moved to Closed status successfully (soft deleted).',
        });
    } catch (error) {
        console.error('Error in deleteJobPostAdmin:', error);
        next(error);
    }
};