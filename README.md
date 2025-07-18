# LeetCode Clone Backend

Firebase Cloud Functions backend for the LeetCode Clone project, providing serverless functionality for problem management, code execution, and user data handling.

## Features

- Serverless architecture with Firebase Cloud Functions
- TypeScript support
- Secure API endpoints
- Code execution environment
- User submission handling
- Problem management
- Activity tracking

## Prerequisites

- Node.js (v14 or higher)
- Firebase CLI
- Firebase project setup

## Getting Started

1. Install dependencies
```bash
cd backend/functions
npm install
```

2. Set up Firebase
```bash
npm install -g firebase-tools
firebase login
firebase init
```

3. Configure Firebase project
Make sure your Firebase project is set up with:
- Authentication
- Cloud Functions
- Firestore Database

4. Run locally
```bash
npm run serve
```

## Project Structure

- `src/` - TypeScript source files
- `lib/` - Compiled JavaScript files
- `src/index.ts` - Main entry point and function definitions
- `src/utils.ts` - Utility functions

## Available Scripts

- `npm run build` - Build TypeScript files
- `npm run serve` - Run functions locally
- `npm run shell` - Start Firebase Functions shell
- `npm run deploy` - Deploy to Firebase
- `npm run logs` - View Firebase logs
- `npm run test` - Run tests

## API Endpoints

The backend provides several Cloud Functions endpoints:

- User management
- Problem CRUD operations
- Code execution
- Submission handling
- Activity tracking

## Deployment

To deploy the functions to Firebase:

```bash
npm run build
firebase deploy --only functions
```

## Environment Variables

Create a `.env` file in the functions directory with necessary configuration:

```
PROJECT_ID=your_project_id
REGION=your_region
```

## Security

- All endpoints are protected with Firebase Authentication
- Data access is controlled through Firebase Security Rules
- Input validation on all endpoints

## Tech Stack

- Firebase Cloud Functions
- TypeScript
- Node.js
- Firebase Admin SDK
- Firebase Auth
- Firestore
# leetcode-backend
