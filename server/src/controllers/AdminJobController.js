// AdminJobController.js
import JobPost from '../models/JobPost.js';
import Employer from '../models/Employer.js'; 
import JobCategory from '../models/JobCategory.js';
import JobType from '../models/JobType.js';
import City from '../models/City.js';
import { NotFoundError } from '../errors/not-found-error.js';
import { ValidationError } from '../errors/validation-error.js';

export const getAllJobPostsAdmin = async (req, res, next) => {
    
    console.log('--- SERVER: Inside getAllJobPostsAdmin controller ---'); // Log controller entry
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;

        console.log('SERVER: Query Params - page:', page, 'limit:', limit, 'status filter:', status);

        const query = {};
        query.isActive = true;
        if (status) {
            if (status === 'pending') { // Match the 'pending' string sent from frontend URL
                query.isApproved = false;
                query.status = 'Draft';
                console.log('SERVER: Applying filter: Pending Approval (isApproved:false, status:Draft)');
            }
            else if (status === 'Closed') {
                query.status = status;
                query.isActive = false;
            }
            
            else {
                // For other direct statuses like 'Draft', 'Published', 'Paused', etc.
                query.status = status;
                console.log('SERVER: Applying filter: status:', status);
            }
        } else {
            console.log('SERVER: No status filter applied, fetching all.');
        }

        console.log('SERVER: Mongoose Query object:', query);

        const totalJobPosts = await JobPost.countDocuments(query);
        const totalPages = Math.ceil(totalJobPosts / limit);

        console.log('SERVER: Total Job Posts matching query:', totalJobPosts);
        console.log('SERVER: Total Pages:', totalPages);

        const jobPosts = await JobPost.find(query)
            .populate('employerId', 'companyName') // Simpler populate
            .populate('categoryId', 'name')
            .populate('typeId', 'name')
            .populate('cityId', 'name country')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

         console.log('SERVER: Fetched Job Posts count:', jobPosts.length);
        if (jobPosts.length > 0) {
            console.log('SERVER: First fetched job post (partial):', jobPosts[0].title, jobPosts[0].employerId ? jobPosts[0].employerId.companyName : 'N/A'); // Log first entry for sanity check
        }
        const formattedJobPosts = jobPosts.map(job => ({
            ...job,
            employerName: job.employerId ? job.employerId.companyName : 'N/A',
            categoryName: job.categoryId ? job.categoryId.name : 'N/A',
            typeName: job.typeId ? job.typeId.name : 'N/A',
            cityName: job.cityId ? job.cityId.name : 'N/A',
            cityCountry: job.cityId ? job.cityId.country : 'N/A',
        }));

        res.status(200).json({
            success: true,
            message: 'Job posts fetched successfully',
            jobPosts: formattedJobPosts,
            currentPage: page,
            totalPages,
            totalJobPosts,
        });
    } catch (error) {
        // Keep logging here for debugging data issues later
        console.error('Error in getAllJobPostsAdmin:', error);
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