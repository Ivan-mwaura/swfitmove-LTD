const express = require('express');
const router = express.Router();

// Import the controller

const {
     registerUser ,
     loginUser,
     forgotPassword,
     resetPassword,
     createBooking,
    getloyaltyPoints
    } = require('../Controllers/main');

    const { 
        handlePaymentRequest,
        handleCallback,
        sendSms
    } = require('../Controllers/Payments');



// Define the routes

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/bookings', createBooking);


router.route('/payment').post(handlePaymentRequest);
router.route('/callback').post(handleCallback);

router.route('/send-sms').post(sendSms);
router.route('/loyalty-points').get(getloyaltyPoints);

module.exports = router;