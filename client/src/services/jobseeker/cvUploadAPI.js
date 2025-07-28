import api from '../api';

export const cvUploadAPI = {
    /**
     * Upload and parse CV file
     * @param {File} file - The CV file to upload
     * @param {Function} onProgress - Progress callback function
     * @returns {Promise} API response
     */
    uploadAndParseCV: async(file, onProgress) => {
        const formData = new FormData();
        formData.append('cv', file);

        try {
            const response = await api.post('/jobseeker/upload-cv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onProgress(progress);
                    }
                },
                timeout: 60000, // 60 second timeout for CV processing
            });

            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            console.error('CV Upload API Error:', error);

            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || 'Server error occurred',
                    error: error.response.data.error
                };
            } else if (error.request) {
                return {
                    success: false,
                    message: 'Network error - please check your connection'
                };
            } else {
                return {
                    success: false,
                    message: error.message || 'An unexpected error occurred'
                };
            }
        }
    },

    /**
     * Remove existing CV
     * @returns {Promise} API response
     */
    removeCV: async() => {
        try {
            const response = await api.delete('/jobseeker/remove-cv');
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            console.error('Remove CV API Error:', error);
            return {
                success: false,
                message: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    },

    /**
     * Check CV parsing status
     * @returns {Promise} API response
     */
    checkParsingStatus: async() => {
        try {
            const response = await api.get('/cv/parser-status');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('CV Parser Status Error:', error);
            return {
                success: false,
                message: 'Failed to check parser status'
            };
        }
    },

    /**
     * Download sample CV template
     * @returns {Promise} Blob response
     */
    downloadSampleCV: async() => {
        try {
            const response = await api.get('/jobseeker/sample-cv-template', {
                responseType: 'blob'
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'sample-cv-template.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            return {
                success: true,
                message: 'Sample CV template downloaded'
            };
        } catch (error) {
            console.error('Download Sample CV Error:', error);
            return {
                success: false,
                message: 'Failed to download sample CV template'
            };
        }
    }
};