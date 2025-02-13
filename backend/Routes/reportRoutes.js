// routes/reportRoutes.js
const express = require('express');
const reportController = require('../Controllers/reportController');
const router = express.Router();

// Booking Statistics
router.get('/total-bookings', reportController.getTotalBookings);
router.get('/bookings-over-time', reportController.getBookingsOverTime);
router.get('/bookings-by-location', reportController.getBookingsByLocation);

// Payment Analytics
router.get('/total-payments', reportController.getTotalPayments);
router.get('/outstanding-payments', reportController.getOutstandingPayments);
router.get('/payments-by-method', reportController.getPaymentsByMethod);

module.exports = router;
