# 🌉 SkillBridge

**AI-Powered Job & Internship Marketplace for Undergraduates**

https://skill-bridge-kappa-eight.vercel.app/

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-%5E18.0.0-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

> Connecting talented undergraduates with innovative startups and employers through intelligent matching algorithms.


## 🎯 Overview

SkillBridge is a modern job marketplace platform that leverages artificial intelligence to match undergraduate students with relevant internship and job opportunities. Our platform serves three main user types: **Job Seekers**, **Employers**, and **System Administrators**.

### 🔑 Key Differentiators
- **AI-Powered Matching**: Intelligent algorithms match candidates with jobs based on skills, experience, and preferences
- **Student-Focused**: Specifically designed for undergraduate students and entry-level positions
- **Startup-Friendly**: Optimized for startups and growing companies to find fresh talent
- **Comprehensive Tracking**: End-to-end application and hiring process management

## ✨ Features

### 👨‍🎓 For Job Seekers
- **Smart Profile Builder**: Create comprehensive profiles with skills, education, and projects
- **AI Job Matching**: Get personalized job recommendations based on your profile
- **Resume Management**: Upload and manage multiple versions of your resume
- **Application Tracking**: Monitor application status and interview schedules
- **Skill Assessment**: Take assessments to validate your technical skills
- **Career Insights**: Get feedback and suggestions for career growth

### 🏢 For Employers
- **Intelligent Candidate Discovery**: Find candidates that match your requirements
- **Advanced Filtering**: Search candidates by skills, education, location, and more
- **Application Management**: Streamlined hiring workflow with status tracking
- **Interview Scheduling**: Built-in tools for scheduling and managing interviews
- **Candidate Feedback**: Provide structured feedback to help students grow
- **Analytics Dashboard**: Insights into your hiring process and candidate pipeline

### 👨‍💼 For Administrators
- **User Management**: Comprehensive user and role management system
- **Content Moderation**: Review and approve job postings and user content
- **Analytics & Reporting**: Platform-wide insights and performance metrics
- **System Configuration**: Manage categories, locations, and platform settings

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hook Form** - Form handling and validation
- **Framer Motion** - Animation library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **Multer** - File upload handling
- **Nodemailer** - Email service integration


### AI/ML Services
- **Python Scripts** - FastAPI microservice for AI/NLP

### DevOps & Tools
- **Vercel** - Frontend hosting
- **Render** - Backend + AI services

## 🧑‍💼 My Role & Contributions

### **Lead Full-Stack Developer + Team Lead (5-Member Team)**  
- Led development using Agile (Jira, sprints, code reviews)  
- Designed entire system architecture (MERN + AI microservice)  
- Built all job-seeker features + core backend APIs  
- Integrated resume parsing, embedding generation & vector search  
- Set up CI/CD, production deployment, and cloud environment  
- Conducted code reviews, mentoring, and sprint planning  

---

## 📈 Impact
- Delivered a fully functional, production-ready AI recruitment platform  
- Improved team productivity through structured leadership & processes  
- Built scalable backend and AI modules that significantly improved job–candidate match accuracy  
- Strengthened real-world experience in system design, microservices, and team leadership  


## ▶️ Getting Started (Local Setup)

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/sandeepamuthumal/SkillBridge.git
cd skillbridge
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
cd server
npm install
```

#### Frontend Dependencies
```bash
cd ../client
npm install
```

#### AI Service Dependencies (Optional)
```bash
cd ../ai-service
pip install -r requirements.txt
```

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://skillbridge-backend-m4op.onrender.com/api
```

### Authentication Endpoints
```http
POST   /api/auth/register      # User registration
POST   /api/auth/login         # User login
POST   /api/auth/logout        # User logout
GET    /api/auth/me            # Get current user
PUT    /api/auth/updateprofile # Update user profile
POST   /api/auth/forgotpassword # Forgot password
PUT    /api/auth/resetpassword  # Reset password
```

### Job Seeker Endpoints
```http
GET    /api/jobseekers/profile     # Get job seeker profile
PUT    /api/jobseekers/profile     # Update job seeker profile
POST   /api/jobseekers/upload-resume # Upload resume
GET    /api/jobseekers/matches     # Get AI job matches
GET    /api/jobseekers/applications # Get applications
POST   /api/jobseekers/apply       # Apply for job
```

### Employer Endpoints
```http
GET    /api/employers/profile      # Get employer profile
PUT    /api/employers/profile      # Update employer profile
GET    /api/employers/jobs         # Get posted jobs
POST   /api/employers/jobs         # Create job posting
PUT    /api/employers/jobs/:id     # Update job posting
DELETE /api/employers/jobs/:id     # Delete job posting
GET    /api/employers/candidates   # Get candidate matches
```

### Job Endpoints
```http
GET    /api/jobs                   # Get all jobs (with filters)
GET    /api/jobs/:id               # Get specific job
GET    /api/jobs/search            # Search jobs
GET    /api/jobs/categories        # Get job categories
GET    /api/jobs/types             # Get job types
```



<div align="center">

**Made with ❤️ by the SkillBridge Team**

</div>