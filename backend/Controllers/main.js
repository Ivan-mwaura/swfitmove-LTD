const bcrypt = require('bcrypt');  // For password hashing
const User = require('../Models/users');  // Import the User model (adjust path if necessary)
const Booking = require('../Models/booking');  // Import the Booking model (adjust path if necessary)
const nodemailer = require('nodemailer');  // For sending emails
const { Op } = require('sequelize');  // Sequelize operators


// Handle user registration
const registerUser = async (req, res) => {
  const { firstName, lastName, email, phone, location, password, confirmPassword } = req.body;

  // Step 1: Validate the incoming data
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Step 2: Check if the email already exists
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Step 3: Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 4: Create the new user with default values for resetPasswordToken and resetPasswordExpires
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      location,
      password: hashedPassword,  // Save the hashed password
      resetPasswordToken: null,  // Set resetPasswordToken as null
      resetPasswordExpires: null,  // Set resetPasswordExpires as null
    });

    // Step 5: Send a success response
    return res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        location: newUser.location,
      },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// Handle user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Step 1: Validate the incoming data
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Step 2: Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // If the user doesn't exist, return an error message
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Step 3: Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // If the password doesn't match, return an error message
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Step 4: Return a success response with user data (excluding password)
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        location: user.location,
      },
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// Function to send the reset code via email
const sendResetCodeEmail = async (email, code) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "evanjustin31@gmail.com",  // Your Gmail address
        pass: 'bnnr nnlu omuz gnhu',  // Your Gmail app password
      },
    });
  
    const resetMessage = `Your password reset code is: ${code}. It will expire in 10 minutes.`;
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      text: resetMessage,  // Plain text message with the reset code
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Password reset code sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  
  // Handle Forgot Password Request
  const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    // Step 1: Validate the email
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    console.log(email);
  
    try {
      // Step 2: Check if the user exists
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(400).json({ message: 'No user found with this email' });
      }
  
      // Step 3: Generate a unique reset code (6 digits)
      // Step 3: Generate a unique reset code (6 digits)
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  
      // Step 4: Set expiration time for the reset code (10 minutes)
      const codeExpiry = Date.now() + 600000;  // 10 minutes from now
  
      // Step 5: Save the reset code and its expiration time to the user's record
      user.resetPasswordToken = resetCode;
      user.resetPasswordExpires = codeExpiry;
      await user.save();
  
      // Step 6: Send the reset code via email
      await sendResetCodeEmail(email, resetCode);
  
      return res.status(200).json({
        message: 'Password reset code sent. Please check your email.',
      });
    } catch (error) {
      console.error('Error in forgotPassword controller:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Handle Reset Password Request
  const resetPassword = async (req, res) => {
    const { email, resetCode, newPassword } = req.body;
  
    // Step 1: Validate the email, reset code, and new password
    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({ message: 'Email, reset code, and new password are required' });
    }
  
    try {
      // Step 2: Find the user by email and reset code
      const user = await User.findOne({
        where: {
          email,
          resetPasswordToken: resetCode,
          resetPasswordExpires: { [Op.gt]: Date.now() },  // Token must not be expired
        },
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset code' });
      }
  
      // Step 3: Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Step 4: Update the user's password and clear the reset code
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
  
      return res.status(200).json({ message: 'Password has been updated successfully' });
    } catch (error) {
      console.error('Error in resetPassword controller:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };


// Controller function to handle booking creation
const createBooking = async (req, res) => {
  try {
    // Extract the booking data from the request body
    const {
      transportType,
      price,
      depLocation,
      arrLocation,
      baggageCost,
      confirmEmail,
      date,
      departureTime,
      email,
      mobile,
      name,
      numberPlate,
      payment,
      totalCost,
      loyaltyPoints,
      pointsToRedeem,
      paidWithPoints,
    } = req.body;

    console.log(req.body);


    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Ensure the emails match
    if (email !== confirmEmail) {
      return res.status(400).json({ message: 'Emails do not match' });
    }

    // Check if user exists and update loyalty points
    if (loyaltyPoints > 0) {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
      }

      user.loyaltyPoints += loyaltyPoints;
      await user.save();
    }

    if(paidWithPoints) {

      const user = await User.findOne({ where: { email } });

      if (!user) {

        return res.status(400).json({ message: 'User does not exist' });

      }

      if (user.loyaltyPoints < pointsToRedeem) {
          
          return res.status(400).json({ message: 'Insufficient loyalty points' });
  
        } else {

          user.loyaltyPoints -= pointsToRedeem;
          await user.save();
        }

    }


    // Create the booking record
    const newBooking = await Booking.create({
      transportType,
      price,
      depLocation,
      arrLocation,
      baggageCost,
      confirmEmail,
      date,
      departureTime,
      email,
      mobile,
      name,
      numberPlate,
      payment,
      totalCost,
      loyaltyPoints,
    });

    // Send success response
    return res.status(201).json({ message: 'You have successfully booked your ride', booking: newBooking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// Get loyalty points
const getloyaltyPoints = async (req, res) => {
  try {
    const { email } = req.query; // Use query params for GET requests

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    return res.status(200).json({ loyaltyPoints: user.loyaltyPoints });
  } catch (error) {
    console.error('Error getting loyalty points:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Redeem loyalty points
const redeemLoyaltyPoints = async (req, res) => {
  try {
    const { email, pointsToRedeem } = req.body;

    if (pointsToRedeem <= 0) {
      return res.status(400).json({ message: 'Invalid points to redeem' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.loyaltyPoints < pointsToRedeem) {
      return res.status(400).json({ message: 'Insufficient loyalty points' });
    }

    // Deduct the redeemed points from the user's record
    user.loyaltyPoints -= pointsToRedeem;
    await user.save();

    return res.status(200).json({ message: 'Loyalty points redeemed successfully' });
  } catch (error) {
    console.error('Error redeeming loyalty points:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

  


module.exports = { 
    registerUser, 
    loginUser,
    forgotPassword,
    resetPassword,
    createBooking,
    getloyaltyPoints,
    redeemLoyaltyPoints


};  // Ensure to export only registerUser
