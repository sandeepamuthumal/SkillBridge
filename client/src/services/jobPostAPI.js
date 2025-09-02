import api from "./api";

export const jobPostAPI = {

    getAllJobs: async(filters = {}) => {
        try {
            const query = new URLSearchParams(filters).toString();
            const response = await api.get(`/jobs?${query}`);
            return {
                success: true,
                data: response.data.data,
            };
        } catch (error) {
            console.error("Error fetching all jobs:", error);
            return {
                success: false,
                error: error.response ?
                    error.response.data.message :
                    "An unexpected error occurred",
            };
        }
    },

    getJobById: async(jobId) => {
        try {
            const response = await api.get(`/jobs/${jobId}`);
            return {
                success: true,
                data: response.data.data,
            };
        } catch (error) {
            console.error(`Error fetching job with ID ${jobId}:`, error);
            return {
                success: false,
                error: error.response ?
                    error.response.data.message :
                    "An unexpected error occurred",
            };
        }
    },

    saveJobPost: async(jobId) => {
        try {
            const response = await api.post(`/jobs/save/${jobId}`);
            return {
                success: true,
                message: response.data.message,
            };
        } catch (error) {
            console.error(`Error saving job with ID ${jobId}:`, error);
            return {
                success: false,
                error: error.response ?
                    error.response.data.message :
                    "An unexpected error occurred",
            };
        }
    },

    unsaveJobPost: async(jobId) => {
        try {
            const response = await api.delete(`/jobs/save/${jobId}`);
            return {
                success: true,
                message: response.data.message,
            };
        } catch (error) {
            console.error(`Error unsaving job with ID ${jobId}:`, error);
            return {
                success: false,
                error: error.response ?
                    error.response.data.message :
                    "An unexpected error occurred",
            };
        }
    },

    getSavedJobs: async() => {
        try {
            const response = await api.get("/jobs/saved");
            return {
                success: true,
                data: response.data.data,
            };
        } catch (error) {
            console.error("Error fetching saved jobs:", error);
            return {
                success: false,
                error: error.response ?
                    error.response.data.message :
                    "An unexpected error occurred",
            };
        }
    },

    getRecommendedJobs: async() => {
        try {
            const response = await api.get("/jobseeker/jobs/recommended");
            return {
                success: true,
                data: response.data.data,
            };
        } catch (error) {
            console.error("Error fetching recommended jobs:", error);
            return {
                success: false,
                error: error.response ?
                    error.response.data.message :
                    "An unexpected error occurred",
            };
        }
    },
    createJobPost: async(jobPost) => {
        try {
            const response = await api.post("/jobpost", jobPost);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error) {
            console.error("Error creating job post:", error.response.data.message);
            return {
                success: false,
                error: error.response ?
                    error.response.data.message :
                    "An unexpected error occurred",
            };
        }
    },

    updateJobPost: async(jobId, jobPost) => {
        try {
            console.log("Updating job post with ID:", jobId, "Data:", jobPost);
            const response = await api.post(`/jobpost/update/${jobId}`, jobPost);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            }
        } catch (error) {
            console.error('Error updating job post:', error.response.data.message);
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    },

    getEmployerJobPosts: async() => { // Get all job posts for a specific employer
        try {
            const response = await api.get(`/jobpost/employer`);
            console.log("Employer Job Posts Response:", response);
            return {
                success: true,
                data: response.data.data
            }
        } catch (error) {
            console.error('Error fetching job posts by employer:', error);
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    },

    // Delete Job Post
    deleteJobPost: async(jobPostId) => {
        try {
            const response = await api.post(`jobpost/${jobPostId}`);
            if (response.status === 200) {
                return { success: true, message: response.data.message };
            } else {
                return { success: false, error: response.data.message || "Failed to delete job post" };
            }
        } catch (error) {
            return { success: false, error: error.response ? error.response.data.message : 'An unexpected error occurred' };
        }
    },

    // Inactive Job Post
    inactiveJobPost: async(jobPostId) => {
        try {
            const response = await api.post(`jobpost/inactive/${jobPostId}`);
            if (response.status === 200) {
                return { success: true, message: response.data.message };
            } else {
                return { success: false, error: response.data.message || "Failed to inactive job post" };
            }
        } catch (error) {
            return { success: false, error: error.response ? error.response.data.message : 'An unexpected error occurred' };
        }
    },

    getSeekerSuggestions: async(jobPostId) => {
        try {
            const response = await api.get(`/employer/jobseeker/suggestions/${jobPostId}`);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    }
}