# ThesisBridge Landing Page

A modern, fully-functional website for ThesisBridge - connecting university students with companies for thesis research and product development opportunities. Based in Nijmegen, Netherlands.

## 🚀 Features

### Complete Multi-Page Website
- **Landing Page**: Compelling home page with hero section, how it works, benefits, testimonials, and contact form
- **Browse Projects**: Searchable project listings with advanced filters and pagination
- **Student Dashboard**: Personalized dashboard for students with applications, recommendations, and activity tracking
- **Company Dashboard**: Company interface for managing projects, reviewing candidates, and tracking applications
- **About Page**: Company story, mission, values, team profiles, and location information
- **Authentication**: Full login and signup flows for both students and companies

### Interactive Elements
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Custom Logo Design**: Eye-catching animated logo with gradient text effects
- **Smart Navigation**: Sticky navigation with hamburger menu for mobile
- **Advanced Filtering**: Multi-criteria filtering for project browsing
- **Real-time Search**: Live search functionality with instant results
- **Tab Interfaces**: Dynamic tabs for different user types and content
- **Animated Statistics**: Counter animations and scroll-triggered effects
- **Form Validation**: Real-time validation with password strength indicators
- **Social Login**: Google and LinkedIn integration UI
- **Notification System**: Toast notifications for user actions

### Dashboard Features
- **Stats Overview**: Key metrics and performance indicators
- **Project Recommendations**: AI-matched opportunities based on profile
- **Application Tracking**: Monitor application status and progress
- **Message Center**: Communication with companies/students
- **Event Calendar**: Upcoming interviews and important dates
- **Quick Actions**: Fast access to common tasks

## 📁 Project Structure

```
ThesisBridge/
├── index.html              # Main landing page
├── browse-projects.html    # Project browsing and search
├── student-dashboard.html  # Student dashboard
├── company-dashboard.html  # Company dashboard
├── about.html             # About us page
├── login.html             # Login page
├── signup.html            # Sign up page
├── styles.css             # Main styles and components
├── dashboard.css          # Dashboard-specific styles
├── browse.css             # Browse page styles
├── auth.css               # Authentication page styles
├── script.js              # Main JavaScript functionality
├── dashboard.js           # Dashboard interactivity
├── browse.js              # Browse page functionality
├── auth.js                # Authentication logic
└── README.md             # This file
```

## 🎨 Design System

### Colors
- **Primary**: #6366f1 (Indigo) - Main brand color
- **Secondary**: #ec4899 (Pink) - Accent color
- **Accent**: #fbbf24 (Amber) - Highlights
- **Success**: #10b981 (Green) - Positive actions
- **Text Dark**: #1f2937
- **Text Gray**: #6b7280
- **Background**: #f9fafb

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: 800 weight, varied sizes
- **Body**: 400-600 weight, 1rem base

### Logo
- Custom designed with animated graduation cap icon
- Gradient split: "Thesis" (purple gradient) + "Bridge" (pink gradient)
- Floating animation on hover

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: ES6+ features, no dependencies
- **Google Fonts**: Inter font family

## 🌐 Getting Started

### View Locally

1. **Clone or navigate to the repository**
   ```bash
   cd ThesisBridge
   ```

2. **Open in browser**
   ```bash
   # macOS
   open index.html
   
   # Or use a local server (recommended)
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```

### Navigation Structure

- **Public Pages**:
  - Landing: `index.html`
  - Browse: `browse-projects.html`
  - About: `about.html`
  - Login: `login.html`
  - Signup: `signup.html`

- **Protected Pages** (require login):
  - Student Dashboard: `student-dashboard.html`
  - Company Dashboard: `company-dashboard.html`

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 968px  
- **Desktop**: > 968px

## ✨ Key Features Explained

### Landing Page (index.html)
- Hero section with animated gradient background
- Live statistics with counter animations
- Tabbed "How It Works" section for students/companies
- Benefits grid with hover effects
- Testimonial cards
- Contact form with validation
- Comprehensive footer

### Browse Projects (browse-projects.html)
- Advanced search with keyword filtering
- Multi-criteria sidebar filters (field, location, duration, compensation, company type)
- Sorting options (recent, relevant, popular, compensation)
- Featured project highlighting
- Save/favorite functionality
- Pagination
- Responsive project cards

### Student Dashboard (student-dashboard.html)
- Personalized welcome message
- Stats overview (applications, interviews, conversations, profile completion)
- Recommended projects based on profile
- Application tracking table
- Upcoming events calendar
- Recent activity feed
- Quick actions menu

### Company Dashboard (company-dashboard.html)
- Active project management
- Candidate browsing and matching
- Application statistics per project
- Top matched candidates
- Interview scheduling
- Project editing capabilities

### About Page (about.html)
- Company origin story
- Mission and vision statements
- Core values showcase
- Impact statistics
- Team member profiles
- Location information (Nijmegen, Netherlands)
- Call-to-action sections

### Authentication (login.html, signup.html)
- Dual-panel layout with benefits sidebar
- Account type selection (student/company)
- Real-time form validation
- Password strength indicator
- Social login options (Google, LinkedIn)
- Responsive design
- Remember me functionality

## 🔧 Customization

### Update Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #ec4899;
    /* ... */
}
```

### Update Content
- Company info: Edit contact section in `index.html`
- Team members: Modify team section in `about.html`
- Projects: Update project cards in `browse-projects.html`
- Location: Already set to Nijmegen, Netherlands

### Add Features
- Backend integration: Connect forms to API endpoints
- Database: Store user data and projects
- Authentication: Implement real OAuth and JWT
- Email notifications: Set up email service
- Analytics: Add Google Analytics or similar

## 🎯 Future Enhancements

Potential improvements:
- Real-time messaging system
- Video interview integration
- Advanced analytics dashboard
- Mobile app (React Native/Flutter)
- AI-powered matching algorithm
- Document upload and management
- Calendar integration
- Payment processing for compensated projects
- Multi-language support (Dutch/English)
- Dark mode toggle
- Accessibility improvements (ARIA labels, keyboard navigation)

## 📍 Location

**Headquarters**: Nijmegen, Gelderland, Netherlands  
**Serving**: Netherlands and beyond  
**Universities**: Radboud University, HAN, TU Delft, UvA, and more

## 📄 License

This project is open source and available for use.

## 📞 Contact

- **Email**: hello@thesisbridge.com
- **Phone**: +31 (555) 123-4567
- **Location**: Nijmegen, Netherlands

---

Built with ❤️ in Nijmegen for ThesisBridge
