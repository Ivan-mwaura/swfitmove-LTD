const express = require('express');
const router = express.Router();
const vehicleController = require('../Controllers/vehicleController');

// Get all vehicles
router.get('/vehicles', vehicleController.getAllVehicles);

// Get a vehicle by ID
router.get('/vehicles/:id', vehicleController.getVehicleById);

// Create a new vehicle
router.post('/vehicles', vehicleController.createVehicle);

// Update an existing vehicle
router.put('/vehicles/:id', vehicleController.updateVehicle);

// Delete a vehicle
router.delete('/vehicles/:id', vehicleController.deleteVehicle);

// Assign a vehicle to a booking
router.patch('/vehicles/:id/assign', vehicleController.assignVehicleToBooking);

// Get vehicle availability
router.get('/vehicles/:id/availability', vehicleController.getVehicleAvailability);

module.exports = router;
