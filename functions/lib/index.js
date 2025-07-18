"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submit = exports.getSubmissions = exports.helloWorld = void 0;
const v2_1 = require("firebase-functions/v2");
const https_1 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const utils_1 = require("./utils");
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)();
(0, v2_1.setGlobalOptions)({ maxInstances: 10 });
exports.helloWorld = (0, https_1.onRequest)((request, response) => {
    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});
exports.getSubmissions = (0, https_1.onRequest)({ cors: true }, async (request, response) => {
    // const offset = request.body.offset;
    const limit = request.body.limit || 10;
    const res = await db.collection("submissions").limit(limit).orderBy("submitTime", "desc").get();
    const submissions = [];
    console.log("res.docs");
    console.log(res.docs.length);
    res.docs.forEach(async (doc) => {
        console.log("doc1");
        submissions.push(new Promise(async (resolve) => {
            console.log(doc.data().user);
            const snapshot = await doc.data().user.get();
            resolve({
                submission: doc.data(),
                user: snapshot.data()
            });
        }));
    });
    response.send({
        response: await Promise.all(submissions)
    });
});
exports.submit = (0, https_1.onCall)(async (request) => {
    const uid = request.auth.uid;
    const language = request.data.language;
    const submission = request.data.submission;
    const problemId = request.data.problemId;
    if (!uid) {
        return {
            message: "Unauthorized"
        };
    }
    if (!utils_1.SUPPORTED_LANGUAGES.includes(language)) {
        return {
            message: "Language not supported"
        };
    }
    const problem = await db.collection("problems").doc(problemId === null || problemId === void 0 ? void 0 : problemId.toString()).get();
    if (!problem.exists) {
        return {
            message: "Problem Doesnt exist"
        };
    }
    const doc = await db.collection("submissions").add({
        language,
        submission,
        problemId,
        userId: uid,
        submitTime: new Date(),
        workerTryCount: 0,
        status: "PENDING"
    });
    return {
        message: "Submission done",
        id: doc.id
    };
});
//# sourceMappingURL=index.js.map