// src/routes/enrollment.routes.js
const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollment.controller');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

// PROTECTED: Only a logged-in STUDENT can get their own enrollments.
router.get(
  '/me',
  [verifyToken, checkRole(['STUDENT'])],
  enrollmentController.getMyEnrollments
);

// PROTECTED: Only a logged-in STUDENT can enroll in a course.
router.post(
  '/',
  [verifyToken, checkRole(['STUDENT'])],
  enrollmentController.create
);

module.exports = router;