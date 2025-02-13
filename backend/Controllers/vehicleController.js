const Vehicle = require('../Models/vehicle');

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
};

// Get vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
};

// Create a new vehicle
exports.createVehicle = async (req, res) => {
  const { type, numberPlate, capacity, status, lastMaintenanceDate,  assignedDriver } = req.body;

  try {
    const newVehicle = await Vehicle.create({
      type,
      numberPlate,
      capacity,
      status,
      lastMaintenanceDate,
      assignedDriver
    });
    res.status(201).json(newVehicle);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
};

// Update an existing vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const { type, numberPlate, capacity, status, lastMaintenanceDate,  assignedDriver } = req.body;
    await vehicle.update({
      type,
      numberPlate,
      capacity,
      status,
      lastMaintenanceDate,
      assignedDriver
    });
    res.status(200).json(vehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
};

// Delete a vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await vehicle.destroy();
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
};

// Assign a vehicle to a booking
exports.assignVehicleToBooking = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const { bookingId } = req.body;  // Assuming the bookingId is passed in the request body
    vehicle.bookingId = bookingId;
    await vehicle.save();
    res.status(200).json({ message: 'Vehicle assigned to booking' });
  } catch (error) {
    console.error('Error assigning vehicle to booking:', error);
    res.status(500).json({ error: 'Failed to assign vehicle to booking' });
  }
};

// Track vehicle availability
exports.getVehicleAvailability = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ availability: vehicle.status });
  } catch (error) {
    console.error('Error fetching vehicle availability:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle availability' });
  }
};
