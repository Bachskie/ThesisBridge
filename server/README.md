# ThesisBridge Backend API

Backend server for ThesisBridge - connecting university students in Nijmegen with thesis project opportunities.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/thesisbridge
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

5. Seed the database with sample data:
```bash
npm run seed
```

6. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be running at `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (student or company)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Users
- `GET /api/users` - Get all users (filterable by type)
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user (requires auth)
- `DELETE /api/users/:id` - Delete user (requires auth)

### Projects
- `GET /api/projects` - Get all projects (with filtering & search)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (company only)
- `PUT /api/projects/:id` - Update project (company owner only)
- `DELETE /api/projects/:id` - Delete project (company owner only)
- `GET /api/projects/company/:companyId` - Get projects by company

### Applications
- `GET /api/applications` - Get applications (filtered by user)
- `GET /api/applications/:id` - Get single application
- `POST /api/applications` - Create application (student only)
- `PUT /api/applications/:id` - Update application status (company only)
- `DELETE /api/applications/:id` - Withdraw application (student only)

## 🔐 Sample Login Credentials

After running the seed script:

**Students:**
- Email: `sophie.vandenberg@student.ru.nl`
- Email: `lars.hendriksen@student.han.nl`
- Email: `emma.devries@student.ru.nl`

**Companies:**
- Email: `tom@techinnovate.nl`
- Email: `maria@datawise.nl`
- Email: `jan@greentech.nl`

**Password for all:** `password123`

## 📦 Database Models

### User
- Supports both students and companies
- Student fields: university, studyProgram, studyYear, skills
- Company fields: companyName, industry, companySize, website
- Password hashing with bcrypt
- JWT authentication

### Project
- Belongs to a company
- Categories: ML, Web Dev, Data Analysis, Mobile, etc.
- Status: open, in-progress, completed, closed
- Full-text search on title, description, tags
- Tracks views and applicants

### Application
- Links student to project
- Statuses: pending, reviewed, accepted, rejected
- Prevents duplicate applications
- Automatically updates project status when accepted

## 🛠️ Technology Stack

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Validator** - Input validation
- **CORS** - Cross-origin requests

## 📍 Location

All data is centered around **Nijmegen, Netherlands** - home to Radboud University and HAN University of Applied Sciences.

## 🔧 Development

- Uses nodemon for auto-reload in development
- Comprehensive error handling
- Input validation on all routes
- Role-based access control (student/company)

## 📝 Notes

- JWT tokens expire in 7 days (configurable)
- Passwords must be at least 6 characters
- All routes return JSON responses
- Database indexes for optimized search performance

---

Built with ❤️ for ThesisBridge - Nijmegen, Netherlands
