# ThesisBridge - Setup Instructions

## 🎯 Complete Application Stack

ThesisBridge is now a full-stack application with:
- **Frontend**: HTML, CSS, JavaScript (mobile-responsive)
- **Backend**: Node.js, Express, MongoDB
- **Location**: Nijmegen, Netherlands

---

## 🚀 Quick Start Guide

### 1. Install MongoDB

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Verify MongoDB is running:**
```bash
mongosh
# Should connect to MongoDB shell
```

### 2. Setup Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env if needed (defaults should work for local development)
# nano .env

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

The backend API will run on `http://localhost:5000`

### 3. Setup Frontend

```bash
# Navigate back to root directory
cd ..

# Open index.html in your browser
# You can use Live Server extension in VS Code
# Or simply open the file directly
```

For development, use a local server:
```bash
# Using Python
python3 -m http.server 3000

# Using Node.js http-server
npx http-server -p 3000
```

The frontend will be available at `http://localhost:3000`

---

## 🔐 Test Credentials

After running the seed script, use these credentials to log in:

### Students
- **Email**: `sophie.vandenberg@student.ru.nl`
- **Email**: `lars.hendriksen@student.han.nl`
- **Email**: `emma.devries@student.ru.nl`

### Companies
- **Email**: `tom@techinnovate.nl` (Tom Bach - Founder & CEO)
- **Email**: `maria@datawise.nl`
- **Email**: `jan@greentech.nl`

**Password for all accounts**: `password123`

---

## 📂 Project Structure

```
ThesisBridge/
├── server/                    # Backend API
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── models/
│   │   ├── User.js           # User model (students & companies)
│   │   ├── Project.js        # Project model
│   │   └── Application.js    # Application model
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── users.js         # User management
│   │   ├── projects.js      # Project CRUD
│   │   └── applications.js  # Application management
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── server.js            # Express server
│   ├── seed.js              # Database seeder
│   ├── package.json
│   └── README.md
│
├── index.html               # Landing page
├── browse-projects.html     # Browse projects
├── student-dashboard.html   # Student dashboard
├── company-dashboard.html   # Company dashboard
├── about.html              # About page
├── login.html              # Login page
├── signup.html             # Signup page
│
├── styles.css              # Main styles
├── dashboard.css           # Dashboard styles
├── browse.css              # Browse page styles
│
├── api.js                  # API client
├── script.js               # Main JavaScript
├── browse.js               # Browse page logic
├── dashboard.js            # Dashboard logic
├── auth.js                 # Auth page logic
│
└── README.md               # This file
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)

### Projects
- `GET /api/projects` - Get all projects (with filters)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (company only)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Applications
- `GET /api/applications` - Get applications
- `POST /api/applications` - Apply to project (student only)
- `PUT /api/applications/:id` - Update status (company only)
- `DELETE /api/applications/:id` - Withdraw application

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `DELETE /api/users/:id` - Delete account

---

## 🎨 Features

### Frontend
✅ Mobile-responsive design (hamburger menu on < 968px)
✅ Custom ThesisBridge logo with gradient animation
✅ 7 pages: Landing, Browse, Dashboards (2), About, Login, Signup
✅ Complete navigation across all pages
✅ Modern UI with smooth animations

### Backend
✅ RESTful API with Express.js
✅ MongoDB database with Mongoose ODM
✅ JWT authentication
✅ Role-based access control (student/company)
✅ Password hashing with bcrypt
✅ Input validation
✅ CORS enabled

### Database
✅ User model (students & companies)
✅ Project model with full-text search
✅ Application model with status tracking
✅ Sample data seeder

---

## 🧪 Testing the Integration

1. **Start the backend**: `cd server && npm run dev`
2. **Start the frontend**: Open index.html or use a local server
3. **Sign up** as a student or company
4. **Browse projects** - they'll load from the database
5. **Login** with seeded accounts to see sample data

---

## 🛠️ Development Tips

### Backend Development
```bash
# Watch mode (auto-reload on changes)
cd server
npm run dev

# Check database
mongosh
use thesisbridge
db.projects.find()
```

### Frontend Development
- Use browser DevTools to check API calls
- Check Console for errors
- API calls are made through `api.js`
- JWT token stored in localStorage

### Resetting Database
```bash
cd server
npm run seed
```

---

## 📍 Location Context

All data is centered around **Nijmegen, Netherlands**:
- Radboud University Nijmegen
- HAN University of Applied Sciences
- Local tech companies

---

## 🚧 Next Steps

To continue development:

1. **Add project details page**: Create `project-details.html` to show full project info
2. **Implement applications**: Add apply button functionality
3. **Dashboard data**: Load real user data in dashboards
4. **File uploads**: Add resume/document upload for students
5. **Email notifications**: Send emails for new applications
6. **Search improvements**: Add advanced filters and sorting
7. **Admin panel**: Create admin interface for moderation

---

## 🆘 Troubleshooting

**MongoDB won't start:**
```bash
brew services restart mongodb-community
```

**Port 5000 already in use:**
Change `PORT` in `server/.env` to another port (e.g., 5001)

**API calls failing:**
- Check backend is running on port 5000
- Check `API_BASE_URL` in `api.js`
- Check browser console for CORS errors

**Frontend not updating:**
- Clear browser cache
- Hard refresh (Cmd+Shift+R on Mac)
- Check if api.js is loaded before other scripts

---

## 📝 License

MIT

---

**Built by Tom Bach - ThesisBridge Founder & CEO**
*Connecting students with opportunities in Nijmegen, Netherlands* 🇳🇱
