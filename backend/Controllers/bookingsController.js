const Booking = require('../Models/booking');

// 1. Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// 2. Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

// 3. Create a new booking
exports.createBooking = async (req, res) => {
  const { transportType, price, depLocation, arrLocation, baggageCost, confirmEmail, date, departureTime, email, mobile, name, numberPlate, payment, totalCost, loyaltyPoints } = req.body;

  try {
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
      loyaltyPoints
    });
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// 4. Update an existing booking (confirm payment, change status)
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const { status, paymentStatus, numberPlate, confirmationEmail } = req.body;
    await booking.update({ status, paymentStatus, numberPlate, confirmationEmail });
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

// 5. Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.update({ status: 'Cancelled' });
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

// 6. Search/filter bookings (by date, customer, vehicle, or status)
exports.filterBookings = async (req, res) => {
  const { searchTerm, date, status, customerName, vehicleNumber } = req.query;

  try {
    const bookings = await Booking.findAll({
      where: {
        ...(searchTerm && {
          [Op.or]: [
            { name: { [Op.like]: `%${searchTerm}%` } },
            { email: { [Op.like]: `%${searchTerm}%` } },
            { mobile: { [Op.like]: `%${searchTerm}%` } },
          ]
        }),
        ...(date && { date: date }),
        ...(status && { status: status }),
        ...(customerName && { name: { [Op.like]: `%${customerName}%` } }),
        ...(vehicleNumber && { numberPlate: { [Op.like]: `%${vehicleNumber}%` } }),
      }
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error filtering bookings:', error);
    res.status(500).json({ error: 'Failed to filter bookings' });
  }
};

//get Boookings for a specific user
// Get bookings for a specific user by their email
exports.getBookingsByEmail = async (req, res) => {
  const { email } = req.body;  // Get email from the request body

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const bookings = await Booking.findAll({
      where: {
        confirmEmail: email,
      },
    });

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this email' });
    }

    res.status(200).json(bookings);  // Return the bookings as a response
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

