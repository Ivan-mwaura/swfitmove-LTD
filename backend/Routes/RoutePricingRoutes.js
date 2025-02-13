const express = require('express');
const router = express.Router();
const {
  createRouteWithPricing,
  getAllRoutesWithPricingAndVehicles,
  updateRoutePricing,
  deleteRoutePricing
} = require('../Controllers/RoutePricing');

// POST: Create a new route with pricing and vehicle details
router.post('/routes', createRouteWithPricing);

// GET: Get all routes with pricing and vehicle details
router.get('/routes', getAllRoutesWithPricingAndVehicles);

// PUT: Update an existing route with pricing and vehicle details
router.put('/routes', updateRoutePricing);

// DELETE: Delete a route with pricing and vehicle details
router.delete('/routes/:id', deleteRoutePricing);

module.exports = router;
