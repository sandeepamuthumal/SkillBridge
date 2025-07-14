import transporter from "../config/email.js";
import path from "path";

class EmailService {

    constructor() {
        console.log("EmailService initialized", process.env.FROM_EMAIL, process.env.CLIENT_URL);
        this.from = process.env.FROM_EMAIL || 'no-reply@skillbridge.lk';
        this.baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    }

    async sendEmailVerification(user, token) {
        const verificationUrl = `${this.baseUrl}/auth/verify-email?token=${token}&email=${encodeURIComponent(user.email)}`;

        const mailOptions = {
            from: this.from,
            to: user.email,
            subject: 'Verify Your SkillBridge Account',
            template: 'email-verification',
            context: {
                name: user.role === 'Job Seeker' ? `${user.firstName} ${user.lastName}` : user.contactPersonName,
                verificationUrl,
                userType: user.role === 'Job Seeker' ? 'Student' : 'Employer',
                expiresIn: '24 hours'
            }
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Verification email sent to ${user.email}`);
        } catch (error) {
            console.error('Email sending failed:', error);
            throw new Error('Failed to send verification email');
        }
    }

    async sendPasswordReset(user, token) {
        const resetUrl = `${this.baseUrl}/auth/reset-password?token=${token}`;

        const mailOptions = {
            from: this.from,
            to: user.email,
            subject: 'Reset Your SkillBridge Password',
            template: 'password-reset',
            context: {
                name: user.role === 'Job Seeker' ? `${user.firstName} ${user.lastName}` : user.contactPersonName,
                resetUrl,
                expiresIn: '15 minutes'
            }
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Password reset email sent to ${user.email}`);
        } catch (error) {
            console.error('Password reset email failed:', error);
            throw new Error('Failed to send password reset email');
        }
    }

    async sendWelcomeEmail(user) {
        const loginUrl = `${this.baseUrl}/signin`;

        const mailOptions = {
            from: this.from,
            to: user.email,
            subject: 'Welcome to SkillBridge!',
            template: 'welcome',
            context: {
                name: user.role === 'Job Seeker' ? `${user.firstName} ${user.lastName}` : user.contactPersonName,
                userType: user.role === 'Job Seeker' ? 'Student' : 'Employer',
                loginUrl,
                dashboardUrl: `${this.baseUrl}/dashboard`
            }
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Welcome email sent to ${user.email}`);
        } catch (error) {
            console.error('Welcome email failed:', error);
            // Don't throw error for welcome emails
        }
    }

    async sendAccountSuspension(user, reason) {
        const mailOptions = {
            from: this.from,
            to: user.email,
            subject: 'Account Suspended - SkillBridge',
            template: 'account-suspended',
            context: {
                name: user.role === 'Job Seeker' ? `${user.firstName} ${user.lastName}` : user.contactPersonName,
                reason,
                supportEmail: process.env.SUPPORT_EMAIL || 'support@skillbridge.com'
            }
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Account suspension email sent to ${user.email}`);
        } catch (error) {
            console.error('Account suspension email failed:', error);
        }
    }
}

export default new EmailService();