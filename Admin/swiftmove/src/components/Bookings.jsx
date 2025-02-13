import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Bookings.scss";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [viewingBooking, setViewingBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    // Fetch bookings from the API
    axios
      .get("http://localhost:3000/api/v1/bookings")
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching bookings!", error);
      });
  }, []);

  const handleViewBooking = (booking) => {
    setViewingBooking(booking);
  };

  const handleCloseProfile = () => {
    setViewingBooking(null);
  };

  const handleCancelBooking = async (id) => {
    // Cancel the booking via API
    try {
      await axios.patch(`http://localhost:3000/api/v1/bookings/${id}/cancel`);
      setBookings(bookings.filter((booking) => booking.id !== id)); // Remove the canceled booking from state
    } catch (error) {
      console.error("Error canceling booking!", error);
    }
  };

  const filteredBookings = bookings
    .filter((booking) => booking.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((booking) => statusFilter === "All" || booking.status === statusFilter);

  return (
    <div className="bookings">
      <h2>Manage Bookings</h2>

      {/* Search and Filter */}
      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search by customer name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Booking Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Transport Type</th>
            <th>Departure Location</th>
            <th>Arrival Location</th>
            <th>Total Cost</th>
            <th>Payment Method</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.name}</td>
              <td>{booking.transportType}</td>
              <td>{booking.depLocation}</td>
              <td>{booking.arrLocation}</td>
              <td>${booking.totalCost}</td>
              <td>{booking.payment}</td>
              <td>
                <button onClick={() => handleViewBooking(booking)} className="view-btn">
                  View
                </button>
                {booking.status !== "Cancelled" && (
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal: Booking Profile */}
      {viewingBooking && (
        <div className="modal">
          <div className="modal-content">
            <h2>Booking Details</h2>
            <p><strong>Customer Name:</strong> {viewingBooking.name}</p>
            <p><strong>Email:</strong> {viewingBooking.email}</p>
            <p><strong>Phone:</strong> {viewingBooking.mobile}</p>
            <p><strong>Transport Type:</strong> {viewingBooking.transportType}</p>
            <p><strong>Departure Location:</strong> {viewingBooking.depLocation}</p>
            <p><strong>Arrival Location:</strong> {viewingBooking.arrLocation}</p>
            <p><strong>Baggage Cost:</strong> ${viewingBooking.baggageCost || "N/A"}</p>
            <p><strong>Confirmation Email:</strong> {viewingBooking.confirmEmail || "N/A"}</p>
            <p><strong>Booking Date:</strong> {viewingBooking.date}</p>
            <p><strong>Departure Time:</strong> {viewingBooking.departureTime}</p>
            <p><strong>Payment Method:</strong> {viewingBooking.payment}</p>
            <p><strong>Total Cost:</strong> ${viewingBooking.totalCost}</p>
            <p><strong>Loyalty Points:</strong> {viewingBooking.loyaltyPoints || "N/A"}</p>
            <button onClick={handleCloseProfile}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
