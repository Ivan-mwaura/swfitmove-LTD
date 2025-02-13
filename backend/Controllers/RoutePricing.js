const RoutePricing = require('../Models/RoutePricing');
const Vehicle = require('../Models/vehicle');


// CREATE: Add a new route with pricing and vehicle assignment
const createRouteWithPricing = async (req, res) => {
  const { source, destination, vehicleId, departureTime, price } = req.body;
  
  try {
    const vehicle = await Vehicle.findByPk(vehicleId);  // Get vehicle details
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Create a new route with pricing and vehicle assignment
    const newRoutePricing = await RoutePricing.create({
      source,
      destination,
      vehicleId: vehicle.id,
      departureTime,
      price,
      vehicleType: vehicle.type,
      numberPlate: vehicle.numberPlate,
      assignedDriver: vehicle.assignedDriver,
    });

    res.status(201).json({ message: 'Route and pricing created successfully', newRoutePricing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating route with pricing and vehicle', error });
  }
};

// READ: Get all routes with pricing and vehicle details
const getAllRoutesWithPricingAndVehicles = async (req, res) => {
  try {
    const routes = await RoutePricing.findAll({
      include: {
        model: Vehicle,
        as: 'vehicle',  // Use the alias defined in the association
        attributes: ['type', 'numberPlate', 'capacity', 'assignedDriver'],  // Specify the fields to include
      },
    });

    res.status(200).json({ routes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching routes with pricing and vehicles' });
  }
};

// UPDATE: Update an existing route with new pricing and vehicle assignment
const updateRoutePricing = async (req, res) => {
  const { id, source, destination, vehicleId, departureTime, price } = req.body;

  try {
    const routePricing = await RoutePricing.findByPk(id);  // Find the route by ID
    if (!routePricing) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Update vehicle details if a new vehicle ID is provided
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    routePricing.source = source;
    routePricing.destination = destination;
    routePricing.vehicleId = vehicle.id;
    routePricing.departureTime = departureTime;
    routePricing.price = price;
    routePricing.vehicleType = vehicle.type;
    routePricing.numberPlate = vehicle.numberPlate;

    await routePricing.save();  // Save updated route

    res.status(200).json({ message: 'Route pricing updated successfully', routePricing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating route pricing' });
  }
};

// DELETE: Delete a route with pricing and vehicle details
const deleteRoutePricing = async (req, res) => {
  const { id } = req.params;

  try {
    const routePricing = await RoutePricing.findByPk(id);
    if (!routePricing) {
      return res.status(404).json({ message: 'Route not found' });
    }

    await routePricing.destroy();  // Delete route

    res.status(200).json({ message: 'Route pricing deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting route pricing' });
  }
};

module.exports = {
  createRouteWithPricing,
  getAllRoutesWithPricingAndVehicles,
  updateRoutePricing,
  deleteRoutePricing,
};
