import Joi from 'joi';

// DTO for updating user status by admin
const updateUserStatusDTO = Joi.object({
    status: Joi.string()
        .valid('active', 'inactive', 'suspended') // 'suspended' is a possible future status
        .required()
        .messages({
            'any.only': 'Status must be one of "active", "inactive", or "suspended"',
            'any.required': 'Status is required'
        })
});

// DTO for admin resetting a user's password
const adminResetPasswordDTO = Joi.object({
    newPassword: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
            'string.min': 'New password must be at least 8 characters',
            'string.pattern.base': 'New password must contain uppercase, lowercase, number and special character',
            'any.required': 'New password is required'
        }),
});

export {
    updateUserStatusDTO,
    adminResetPasswordDTO
};