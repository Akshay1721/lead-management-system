Lead Management System - Frontend
A comprehensive React.js frontend application for managing leads with JWT authentication, CRUD operations, and advanced filtering capabilities.

🚀 Live Demo
Frontend: https://lead-management-system-tan.vercel.app/
Backend API: https://lead-management-system-12dk.onrender.com/


Features
JWT Authentication: Secure authentication using httpOnly cookies (no localStorage)

Lead Management: Full CRUD operations for lead data

AG Grid Integration: Advanced data grid with sorting, filtering, and pagination

Server-side Pagination: Efficient handling of large datasets (150 sample leads included)

Advanced Filtering: Multiple filter operators for different data types

Responsive Design: Mobile-friendly interface

Real-time Updates: Immediate UI updates after operations

Error Handling: Comprehensive error handling with user feedback

Production Ready: Fully deployed and operational

Technology Stack
React 18: Modern React with Hooks

React Router v6: Client-side routing

AG Grid Community: Advanced data grid

Axios: HTTP client for API calls

React Toastify: Toast notifications

CSS3: Modern styling with Flexbox/Grid

Deployment: Vercel (Frontend) + Render (Backend)

Prerequisites
Node.js 16+ and npm

Backend API (deployed at https://lead-management-system-12dk.onrender.com/)

Installation
Clone the repository:

bash
git clone https://github.com/Akshay1721/lead-management-system.git
cd client
Install dependencies:

bash
npm install
Create environment file:

bash
cp .env.example .env
Configure environment variables in .env:

text
REACT_APP_API_URL=https://lead-management-system-12dk.onrender.com/api
Start the development server:

bash
npm start
The application will open at http://localhost:3000

File Structure
text
src/
├── components/
│   ├── Auth/              # Authentication components
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── Leads/             # Lead management components
│   │   ├── LeadsList.jsx
│   │   ├── LeadForm.jsx
│   │   └── LeadFilters.jsx
│   ├── Layout/            # Layout components
│   │   ├── Header.jsx
│   │   └── Layout.jsx
│   └── Common/            # Shared components
│       ├── LoadingSpinner.jsx
│       └── ProtectedRoute.jsx
├── contexts/              # React Context providers
│   └── AuthContext.jsx
├── services/              # API service layer
│   ├── api.js
│   ├── authService.js
│   └── leadService.js
├── utils/                 # Utility functions and constants
│   └── constants.js
├── App.jsx                # Main app component
├── App.css                # Global styles
└── index.js               # App entry point
Component Architecture
File Extensions
.jsx - React components that contain JSX syntax

.js - Utilities, services, contexts, and entry points

.css - Styling files

Key Components
App.jsx: Main application component with routing

AuthContext.jsx: Global authentication state management

LeadsList.jsx: AG Grid-powered leads table with filtering

LeadForm.jsx: Create/edit lead form with validation

ProtectedRoute.jsx: Authentication-based route protection

Authentication
The app uses JWT tokens stored in httpOnly cookies for security:

No localStorage usage

Automatic token refresh handling

Protected route components

Automatic logout on token expiration

Cross-origin cookie support for production

Lead Management Features
Data Grid (AG Grid)
Server-side pagination (20 items per page, max 100)

Column sorting and filtering

Colored status badges for visual clarity

Inline action buttons (edit/delete)

Responsive column sizing

Real-time data updates

Filtering System
String fields (email, company, city): equals, contains

Enum fields (status, source): equals, in

Number fields (score, lead_value): equals, greater than, less than, between

Date fields (created_at, last_activity_at): on, before, after, between

Boolean fields (is_qualified): equals

Lead Fields
Personal: first_name, last_name, email, phone

Business: company, city, state

Tracking: source, status, score (0-100), lead_value, is_qualified

Timestamps: created_at, updated_at, last_activity_at

Available Scripts
npm start: Start development server

npm build: Build for production

npm test: Run test suite

npm eject: Eject from Create React App

API Integration
The frontend integrates with the following backend endpoints:

Authentication
POST /api/auth/register - User registration

POST /api/auth/login - User login

POST /api/auth/logout - User logout

GET /api/auth/me - Get current user

Leads
GET /api/leads - Get leads with pagination and filters

POST /api/leads - Create new lead

GET /api/leads/:id - Get single lead

PUT /api/leads/:id - Update lead

DELETE /api/leads/:id - Delete lead

Environment Configuration
Development
text
REACT_APP_API_URL=http://localhost:5000/api
Production (Current Deployment)
text
REACT_APP_API_URL=https://lead-management-system-12dk.onrender.com/api
Deployment
Current Deployment Stack
Frontend: Vercel (https://lead-management-system-tan.vercel.app/)

Backend: Render (https://lead-management-system-12dk.onrender.com/)

Database: MongoDB Atlas

Authentication: JWT with httpOnly cookies

CORS: Configured for cross-origin requests

Deploy Your Own Instance
Frontend (Vercel)
Fork the repository

Connect to Vercel

Set environment variables:

text
REACT_APP_API_URL=your-backend-url/api
Deploy

Backend (Render)
Deploy backend to Render

Set environment variables (MongoDB URI, JWT Secret, etc.)

Update CORS settings to include your frontend domain

Building for Production
Build the application:

bash
npm run build
The build folder contains the production-ready files

Deploy to Vercel, Netlify, or your preferred hosting service

Ensure your backend API is accessible from the production domain

Production Features
✅ Fully Deployed: Both frontend and backend live

✅ 150 Sample Leads: Pre-seeded data for testing

✅ HTTPS Support: Secure connections

✅ CORS Configured: Cross-origin requests handled

✅ Error Handling: Production-ready error management

✅ Performance Optimized: Fast loading and responsive

Testing the Live Application
Visit: https://lead-management-system-tan.vercel.app/

Login with demo credentials (provided above)

Explore features:

View leads list with pagination

Use advanced filters

Create/edit/delete leads

Test authentication (logout/login)

Deployment Checklist
 Backend API deployed and accessible

 Environment variables configured

 CORS settings configured on backend

 Production build created and tested

 SSL certificate configured (https)

 Sample data seeded

 Authentication working in production

 All CRUD operations tested

Repository
GitHub: https://github.com/Akshay1721/lead-management-system

Contributing
Fork the repository

Create a feature branch

Make your changes with proper .jsx extensions for React components

Test thoroughly (both locally and against production API)

Submit a pull request

License
This project is available for educational and portfolio purposes.

Live Demo: https://lead-management-system-tan.vercel.app/

Author: Akshay1721

Tech Stack: React.js + Express.js + MongoDB + JWT Authentication
