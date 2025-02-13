// In vehicle.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');  // Import the sequelize instance

const Vehicle = sequelize.define('Vehicle', {
  type: {
    type: DataTypes.STRING,
    allowNull: false,  // Vehicle type is required
  },
  numberPlate: {
    type: DataTypes.STRING,
    allowNull: false,  // Number plate is required
    unique: true,  // Ensure unique number plates
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Capacity is required
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,  // Vehicle status is required
    defaultValue: "available",  // Default status is "available"
    validate: {
      isIn: [["available", "booked", "under maintenance"]],  // Validate status options
    },
  },
  lastMaintenanceDate: {
    type: DataTypes.DATE,
    allowNull: true,  // Last maintenance date is optional
  },
  assignedDriver: {
    type: DataTypes.STRING,
    allowNull: true,  // Assigned driver is optional
  },
}, {
  tableName: 'vehicles',  // Table name where the data will be stored
  timestamps: true,       // Enable timestamps (createdAt & updatedAt)
});



// Export the Vehicle model
module.exports = Vehicle;
