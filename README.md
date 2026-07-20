# Interview AI - AI-Powered Interview Preparation Platform

A full-stack web application that uses AI to generate personalized interview preparation plans based on resumes and job descriptions.

## Architecture

### Backend (Node.js/Express)
- **Server**: Express.js with CORS, cookie-parser, and file upload middleware
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication with token blacklist for logout
- **AI Integration**: Google GenAI (Gemini Flash) for generating interview reports
- **File Processing**: PDF parsing for resume extraction

### Frontend (React/Vite)
- **Framework**: React 19 with React Router v8
- **State Management**: Context API for auth and interview state
- **HTTP Client**: Axios with cookie support for authenticated requests
- **Build Tool**: Vite

## Project Structure

```
gen-AI_project/
├── Backend/
│   ├── src/
│   │   ├── app.js                 # Express app configuration
│   │   ├── server.js              # Server entry point (port 3000)
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js # User registration, login, logout
│   │   │   └── interview.controller.js # Report generation and retrieval
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js # JWT authentication
│   │   │   └── file.middleware.js # Multer for file uploads
│   │   ├── models/
│   │   │   ├── user.model.js      # User schema
│   │   │   ├── blacklist.model.js # Token blacklist for logout
│   │   │   └── interviewreport.model.js # Interview report schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js     # Auth endpoints
│   │   │   └── interview.routes.js # Interview endpoints
│   │   └── services/
│   │       └── ai.service.js      # Google GenAI integration
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── main.jsx               # React entry point
│   │   ├── App.jsx                # App component with providers
│   │   ├── app.routes.jsx         # React Router configuration
│   │   ├── style.scss             # Global styles
│   │   └── features/
│   │       ├── auth/
│   │       │   ├── auth.context.jsx
│   │       │   ├── hooks/useAuth.js
│   │       │   ├── services/auth.api.js
│   │       │   ├── components/Protected.jsx
│   │       │   └── pages/Login.jsx, Register.jsx
│   │       └── interview/
│   │           ├── interview.context.jsx
│   │           ├── hooks/useInterview.js
│   │           ├── services/interview.api.js
│   │           └── pages/Home.jsx, Interview.jsx
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | User login |
| GET | /api/auth/logout | User logout |
| GET | /api/auth/get-me | Get current user |

### Interview
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/interview | Generate interview report (supports PDF upload) |
| GET | /api/interview | Get all user's reports |
| GET | /api/interview/report/:interviewId | Get specific report |

## Environment Variables

### Backend (.env)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
```

## Setup

### Backend
```bash
cd Backend
npm install
npm run dev  # Development (nodemon)
npm start    # Production
```

### Frontend
```bash
cd Frontend
npm install
npm run dev  # Start Vite dev server (port 5173)
npm run build # Build for production
```

## Features

- **User Authentication**: Register, login, logout with JWT tokens
- **Resume Upload**: PDF parsing and extraction
- **AI Interview Generation**: Generates technical questions, behavioral questions, skill gaps, and preparation roadmap
- **Match Score**: AI-calculated compatibility score (0-100)
- **Interview Reports**: Save and retrieve past interview plans
- **Protected Routes**: Authentication-gated pages

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express, MongoDB, Mongoose |
| AI | Google GenAI (Gemini Flash) |
| Frontend | React 19, React Router, Vite, Axios |
| Auth | JWT, bcrypt, cookie-parser |
| File Upload | Multer, pdf-parse |
| Validation | Zod, zod-to-json-schema |