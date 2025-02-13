// controllers/reportController.js
const { Op } = require('sequelize');
const Booking = require('../Models/booking');  // Adjust import as needed
const sequelize = require('sequelize');

// Total Bookings
exports.getTotalBookings = async (req, res) => {
  try {
    const totalBookings = await Booking.count();
    res.status(200).json({ totalBookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total bookings", error });
  }
};

// Bookings Over Time (By Date)
exports.getBookingsOverTime = async (req, res) => {
  try {
    const bookingsOverTime = await Booking.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('date')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: [sequelize.fn('DATE', sequelize.col('date'))],
      order: [[sequelize.fn('DATE', sequelize.col('date')), 'ASC']],
    });
    res.status(200).json(bookingsOverTime);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings over time", error });
  }
};

// Bookings by Location
exports.getBookingsByLocation = async (req, res) => {
  try {
    const bookingsByLocation = await Booking.findAll({
      attributes: ['depLocation', 'arrLocation', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['depLocation', 'arrLocation'],
    });
    res.status(200).json(bookingsByLocation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings by location", error });
  }
};


// controllers/reportController.js (Continued)

// Total Payments
exports.getTotalPayments = async (req, res) => {
    try {
      const totalPayments = await Booking.sum('totalCost', {
        where: {
          payment: { [Op.not]: null },  // Filter bookings with a valid payment
        },
      });
      res.status(200).json({ totalPayments });
    } catch (error) {
      res.status(500).json({ message: "Error fetching total payments", error });
    }
  };
  
  // Outstanding Payments (Bookings with no confirmed payment)
  exports.getOutstandingPayments = async (req, res) => {
    try {
      const outstandingPayments = await Booking.sum('totalCost', {
        where: {
          payment: null,  // Filter bookings with no confirmed payment
        },
      });
      res.status(200).json({ outstandingPayments });
    } catch (error) {
      res.status(500).json({ message: "Error fetching outstanding payments", error });
    }
  };
  
  // Payments by Method
  exports.getPaymentsByMethod = async (req, res) => {
    try {
      const paymentsByMethod = await Booking.findAll({
        attributes: ['payment', [sequelize.fn('SUM', sequelize.col('totalCost')), 'totalAmount']],
        group: ['payment'],
      });
      res.status(200).json(paymentsByMethod);
    } catch (error) {
      res.status(500).json({ message: "Error fetching payments by method", error });
    }
  };
  
