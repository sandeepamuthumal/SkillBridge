import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { globalErrorHandler } from './middlewares/global-error-handler.js';
import authRouter from './routes/auth.js';
import apiRouter from './routes/api.js';
import jobseekerRouter from './routes/jobseeker.js';
import professionalsRoutes from './routes/professionals.js';
import adminRouter from './routes/admin.js';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
    setHeaders: (res, path) => {
        res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads/profiles'), {
    setHeaders: (res, path) => {
        res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));


// Routes
app.use('/api', apiRouter);
app.use("/api/auth", authRouter);
app.use("/api/jobseeker", jobseekerRouter);
app.use("/api/professionals", professionalsRoutes);
app.use("/api/admin", adminRouter);

app.use(globalErrorHandler);

export { app };