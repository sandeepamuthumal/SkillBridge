export const globalErrorHandler = (err, req, res, next) => {
    console.error(err);
    switch (err.name) {
        case 'ValidationError':
            return res.status(400).json({ success: false, message: err.message }).send();
        case 'NotFoundError':
            return res.status(404).json({ success: false, message: err.message }).send();
        default:
            return res.status(500).json({ success: false, message: err.message }).send();
    }
}