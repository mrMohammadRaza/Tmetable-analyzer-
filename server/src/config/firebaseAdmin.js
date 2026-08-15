const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let firebaseAdmin = null;

try {
  if (!admin.apps.length) {
    firebaseAdmin = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'timetable-analyzer',
    });
    console.log('[Firebase Admin] Initialized successfully for project timetable-analyzer');
  } else {
    firebaseAdmin = admin.app();
  }
} catch (err) {
  console.warn('[Firebase Admin Warning] Could not initialize Firebase Admin SDK:', err.message);
}

module.exports = firebaseAdmin;
