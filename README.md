# 🌉 SkillBridge

**AI-Powered Job & Internship Marketplace for Undergraduates**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-%5E18.0.0-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

> Connecting talented undergraduates with innovative startups and employers through intelligent matching algorithms.

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [Team](#-team)
- [License](#-license)

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
- **OpenAI API** - Natural language processing
- **TensorFlow.js** - Machine learning in JavaScript
- **Python Scripts** - Advanced ML algorithms for matching

### DevOps & Tools
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **AWS S3** - File storage
- **Cloudinary** - Image management

## 📁 Project Structure

```
skillbridge/
├── 📁 ai-service/                 # AI/ML microservice
│   ├── 📁 models/                 # ML models and algorithms
│   ├── 📁 services/               # AI matching services
│   └── 📄 requirements.txt        # Python dependencies
├── 📁 client/                     # React frontend
│   ├── 📁 public/                 # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/         # Reusable UI components
│   │   ├── 📁 pages/             # Page components
│   │   ├── 📁 hooks/             # Custom React hooks
│   │   ├── 📁 services/          # API service functions
│   │   ├── 📁 utils/             # Utility functions
│   │   ├── 📁 context/           # React context providers
│   │   └── 📄 App.jsx            # Main App component
│   ├── 📄 package.json
│   ├── 📄 vite.config.js
│   └── 📄 tailwind.config.js
└── 📁 server/                     # Node.js backend
    ├── 📁 src/
    │   ├── 📁 config/             # Database and app configuration
    │   ├── 📁 controllers/        # Route controllers
    │   ├── 📁 middleware/         # Custom middleware
    │   ├── 📁 models/             # Mongoose schemas
    │   ├── 📁 routes/             # API routes
    │   ├── 📁 services/           # Business logic services
    │   ├── 📁 utils/              # Utility functions
    │   └── 📄 app.js              # Express app setup
    ├── 📁 uploads/                # File upload directory
    ├── 📄 package.json
    └── 📄 .env.example
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **MongoDB** (v5.0 or higher)
- **Git** (latest version)
- **Python** (v3.8+ for AI services)

### System Requirements
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: At least 5GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux Ubuntu 18.04+

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/skillbridge.git
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

### 3. Database Setup

#### Local MongoDB
```bash
# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

#### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Whitelist your IP address

## ⚙️ Environment Setup

### Backend Environment (.env)
Create `server/.env` file:
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/skillbridge
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillbridge

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AI Services
OPENAI_API_KEY=your-openai-api-key

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

### Frontend Environment (.env)
Create `client/.env` file:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Feature Flags
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_CHAT=true

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=your-ga-id
```

## 🏃‍♂️ Usage

### Development Mode

#### Start Backend Server
```bash
cd server
npm run dev
```
Server will run on `http://localhost:5000`

#### Start Frontend Development Server
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:3000`

#### Start AI Service (Optional)
```bash
cd ai-service
python app.py
```
AI service will run on `http://localhost:8000`

### Production Mode

#### Build Frontend
```bash
cd client
npm run build
```

#### Start Production Server
```bash
cd server
npm start
```

### Using Docker (Alternative)
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
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

For complete API documentation, visit `/api/docs` when the server is running.

## 🧪 Testing

### Run Backend Tests
```bash
cd server
npm test
```

### Run Frontend Tests
```bash
cd client
npm test
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:coverage
```

## 🤝 Contributing

We welcome contributions from the community! Please read our contributing guidelines before submitting PRs.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Ensure tests pass**
   ```bash
   npm test
   ```
6. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
7. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Create a Pull Request**

### Code Style Guidelines

- Use **ESLint** and **Prettier** for code formatting
- Follow **conventional commits** for commit messages
- Write **meaningful comments** for complex logic
- Maintain **test coverage** above 80%
- Use **TypeScript** for type safety (where applicable)

### Commit Message Format
```
<type>(<scope>): <subject>

Examples:
feat(auth): add OAuth integration
fix(jobs): resolve search filter bug
docs(readme): update installation guide
```

## 👥 Team

### Core Development Team

| Role | Name | GitHub | Email |
|------|------|--------|-------|
| **Project Lead & Full-Stack Developer** | [Your Name] | [@yourusername](https://github.com/yourusername) | your.email@example.com |
| **Frontend Developer** | [Team Member 2] | [@teammate2](https://github.com/teammate2) | teammate2@example.com |
| **Backend Developer** | [Team Member 3] | [@teammate3](https://github.com/teammate3) | teammate3@example.com |
| **AI/ML Developer** | [Team Member 4] | [@teammate4](https://github.com/teammate4) | teammate4@example.com |

### Contributors
Thanks to all the amazing contributors who have helped make SkillBridge possible!

<!-- This will be populated automatically -->
<a href="https://github.com/yourusername/skillbridge/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=yourusername/skillbridge" />
</a>

## 📈 Roadmap

### Phase 1 - MVP (Current)
- [x] User authentication system
- [x] Basic profile management
- [x] Job posting and application system
- [ ] AI-powered job matching
- [ ] Application tracking dashboard

### Phase 2 - Enhanced Features
- [ ] Real-time messaging system
- [ ] Advanced search and filtering
- [ ] Interview scheduling
- [ ] Mobile application (React Native)

### Phase 3 - AI & Analytics
- [ ] Advanced ML matching algorithms
- [ ] Predictive analytics for hiring
- [ ] Resume parsing and skill extraction
- [ ] Career path recommendations

### Phase 4 - Enterprise Features
- [ ] Multi-company support
- [ ] Advanced reporting and analytics
- [ ] Integration with HR systems
- [ ] White-label solutions

## 🐛 Issues & Bug Reports

Found a bug or have a feature request? Please check our [issues page](https://github.com/yourusername/skillbridge/issues) first, then create a new issue if needed.

### Bug Report Template
```markdown
**Bug Description**
A clear description of the bug

**Steps to Reproduce**
1. Step one
2. Step two
3. Step three

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 91]
- Node.js version: [e.g., 16.14.0]
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MongoDB University** - For database design patterns
- **React Team** - For the amazing React framework
- **OpenAI** - For AI/ML capabilities
- **Tailwind CSS** - For the utility-first CSS framework
- **All Contributors** - For making this project possible

## 📞 Support

Need help? Reach out to us:

- **Email**: support@skillbridge.com
- **Documentation**: [docs.skillbridge.com](https://docs.skillbridge.com)
- **Discord**: [Join our community](https://discord.gg/skillbridge)
- **GitHub Discussions**: [Community forum](https://github.com/yourusername/skillbridge/discussions)

---

<div align="center">

**Made with ❤️ by the SkillBridge Team**

[Website](https://skillbridge.com) • [Documentation](https://docs.skillbridge.com) • [API](https://api.skillbridge.com) • [Status](https://status.skillbridge.com)

</div>