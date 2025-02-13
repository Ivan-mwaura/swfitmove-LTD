const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');  // Import the sequelize instance from connect.js
const Vehicle = require('./vehicle');  // Import the Vehicle model

// Define the combined RoutePricing model
const RoutePricing = sequelize.define('RoutePricing', {
  source: {
    type: DataTypes.STRING,
    allowNull: false,  // Source station is required
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false,  // Destination station is required
  },
  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Vehicle ID is required
  },
  departureTime: {
    type: DataTypes.STRING,
    allowNull: false,  // Departure time is required
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Price is required
  },
  vehicleType: {
    type: DataTypes.STRING,
    allowNull: false,  // Vehicle type is required
  },
  numberPlate: {
    type: DataTypes.STRING,
    allowNull: false,  // Number plate is required
  },
  assignedDriver: {
    type: DataTypes.STRING,
    allowNull: true,  // Assigned driver is optional
  },
}, {
  tableName: 'route_pricing',  // Table name for the combined model
  timestamps: true,           // Enable timestamps (createdAt & updatedAt)
});

RoutePricing.belongsTo(Vehicle, {
  foreignKey: 'vehicleId',
  as: 'vehicle',  // This can be the alias to reference the vehicle association
});

module.exports = RoutePricing;
