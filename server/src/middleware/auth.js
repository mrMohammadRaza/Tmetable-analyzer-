const jwt = require('jsonwebtoken');
const User = require('../models/User');
const admin = require('firebase-admin');

// Initialize Firebase Admin if not initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'timetable-analyzer',
    });
  } catch (err) {
    console.warn('[Firebase Admin Warning]', err.message);
  }
}

// Protect routes - Hybrid Firebase ID Token & JWT Verification
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route (Missing Token)',
    });
  }

  try {
    // 1. Try Firebase ID Token Verification first
    try {
      const decodedFirebase = await admin.auth().verifyIdToken(token);
      let user = await User.findOne({ email: decodedFirebase.email });
      if (!user) {
        // Create user record for Firebase authenticated user if not exists
        user = await User.create({
          name: decodedFirebase.name || decodedFirebase.email.split('@')[0],
          email: decodedFirebase.email,
          password: 'FirebaseAuthenticatedUser@123',
          role: 'admin',
          organizationId: '65f000000000000000000001', // Default Org ID
        });
      }
      req.user = user;
      return next();
    } catch (firebaseErr) {
      // Fallback to standard JWT verification
    }

    // 2. Standard JWT Verification fallback
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'classflow_super_secret_jwt_key_2026');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is inactive or no longer exists',
      });
    }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'guest'}' is not authorized to perform this action`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
