import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { SUPPORTED_LANGUAGES } from "./utils";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

setGlobalOptions({ maxInstances: 10 });

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  next();
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Server error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// Export the Express app as a Firebase Function
export const api = onRequest((req, res) => {
  return app(req, res);
});

export const getSubmissions = onRequest({
    cors: ['http://localhost:5173', 'https://getsubmissions-jpzo5bevwq-uc.a.run.app']
}, async (request, response) => {

export const submit = onCall(async (request) => {
    const uid = request.auth.uid;
    const language = request.data.language;
    const submission = request.data.submission;
    const problemId = request.data.problemId;

    if (!uid) {
        return {
            message: "Unauthorized"
        }
    }

    if (!SUPPORTED_LANGUAGES.includes(language)) {
        return {
            message: "Language not supported"
        }
    }

    const problem = await db.collection("problems").doc(problemId?.toString()).get();

    if (!problem.exists) {
        return {
            message: "Problem Doesnt exist"
        }
    }

    const doc = await db.collection("submissions").add({
        language,
        submission,
        problemId,
        userId: uid,
        submitTime: new Date(),
        workerTryCount: 0,
        status: "PENDING"
    })

    return {
        message: "Submission done",
        id: doc.id
    }
})