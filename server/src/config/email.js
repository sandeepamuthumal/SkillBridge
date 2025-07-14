// config/email.js
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

// Create transporter based on environment
const createTransporter = () => {
    console.log('Loaded Email ENV:', {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    });

    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

const transporter = createTransporter();
const templatesPath = resolve(__dirname, '../email-templates');

// Configure handlebars for email templates
const handlebarOptions = {
    viewEngine: {
        extName: '.hbs',
        partialsDir: templatesPath,
        defaultLayout: false,
    },
    viewPath: templatesPath,
    extName: '.hbs',
};

transporter.use('compile', hbs(handlebarOptions));

export default transporter;