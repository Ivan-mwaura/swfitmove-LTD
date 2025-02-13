const express = require('express');
const bookingController = require('../Controllers/bookingsController');
const router = express.Router();

// Define the routes
router.get('/bookings', bookingController.getAllBookings);  // Get all bookings
router.get('/bookings/:id', bookingController.getBookingById);  // Get booking by ID
router.post('/bookings', bookingController.createBooking);  // Create a new booking
router.put('/bookings/:id', bookingController.updateBooking);  // Update a booking
router.delete('/bookings/:id', bookingController.cancelBooking);  // Cancel a booking
router.get('/bookings/filter', bookingController.filterBookings);  // Search/filter bookings

module.exports = router;
