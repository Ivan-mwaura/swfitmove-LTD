const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');  // Import the sequelize instance from connect.js

// Define the Booking model
const Booking = sequelize.define('Booking', {
  transportType: {
    type: DataTypes.STRING,
    allowNull: false,  // Transport type is required
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Price is required
  },
  depLocation: {
    type: DataTypes.STRING,
    allowNull: false,  // Departure location is required
  },
  arrLocation: {
    type: DataTypes.STRING,
    allowNull: false,  // Arrival location is required
  },
  baggageCost: {
    type: DataTypes.INTEGER,
    allowNull: true,  // Baggage cost is optional
  },
  confirmEmail: {
    type: DataTypes.STRING,
    allowNull: true,  // Confirmation email is optional (if the user provided one)
    validate: {
      isEmail: true,  // Validate the email format if provided
    },
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,  // Date of the booking is required
  },
  departureTime: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,  // Departure time is required
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,  // Email is required
    validate: {
      isEmail: true,  // Validate the email format
    },
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,  // Mobile number is required
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,  // Name of the passenger is required
  },
  numberPlate: {
    type: DataTypes.STRING,
    allowNull: true,  // Vehicle number plate is optional
  },
  payment: {
    type: DataTypes.STRING,
    allowNull: false,  // Payment method is required
  },
  totalCost: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Total cost is required
  },
  loyaltyPoints: {
    type: DataTypes.INTEGER,
    allowNull: true,  // Loyalty points are optional
  },
}, {
  // Additional options
  tableName: 'bookings',  // Table name where the data will be stored
  timestamps: true,        // Enable timestamps (createdAt & updatedAt)
});

module.exports = Booking;
