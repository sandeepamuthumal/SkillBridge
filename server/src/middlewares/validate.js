const validateDTO = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        console.log("error", error);
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }
        next();
    };
};

export default validateDTO;