const express = require('express');
require('dotenv').config();  // Load environment variables
const { connectDB } = require('./db/connect');  // Import the connectDB function to establish DB connection
const userRoutes = require('./Routes/userRoutes');  // Import the user routes
const authRoutes = require('./Routes/routes');  // Import the authentication routes
const bookingRoutes = require('./Routes/bookingRoutes');  // Import the booking routes
const vehicleRoutes = require('./Routes/vehicleRoutes');  // Import the vehicle routes
const reportRoutes = require('./Routes/reportRoutes');  // Import the report routes
const routePricingRoutes = require('./Routes/RoutePricingRoutes')
const adminRoutes = require('./Routes/adminLogin');  // Import the admin routes
const cors = require('cors');  // Enable Cross-Origin Resource Sharing (CORS)


const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());  // Parse incoming JSON requests
app.use(cors());  // Enable CORS for all routes

// Routes
app.use('/api/v1', authRoutes);  // Use authentication routes for the `/api/auth` endpoint
app.use('/api/v1', userRoutes);  // Use user routes for the `/api/users` endpoint
app.use('/api/v1', bookingRoutes);  // Use booking routes for the `/api/bookings` endpoint
app.use('/api/v1', vehicleRoutes);  // Use vehicle routes for the `/api/vehicles` endpoint
app.use('/api/v1/reports', reportRoutes);  // Use report routes for the `/api/reports` endpoint
app.use('/api/v1', routePricingRoutes);  // Use route pricing routes for the `/api/routes` endpoint
app.use('/api/v1', adminRoutes);  // Use admin routes for the `/api/admin` endpoint


// Start the server and connect to MySQL
const start = async () => {
  try {
    // Connect to the MySQL database
    const sequelize = await connectDB();  // This will return the sequelize instance

    console.log('Database connected successfully!');

    // Sync models (creates tables if they don't exist)
    await sequelize.sync({ force: false });  // `force: false` will not drop existing tables
    console.log('Models synchronized with the database.');

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

// Call the start function to initialize the app
start();
