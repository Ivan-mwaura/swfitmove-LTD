import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./Reporting.scss";

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Reporting = () => {
  const [totalBookings, setTotalBookings] = useState(null);
  const [bookingsOverTime, setBookingsOverTime] = useState([]);
  const [bookingsByLocation, setBookingsByLocation] = useState([]);
  const [totalPayments, setTotalPayments] = useState(null);
  const [outstandingPayments, setOutstandingPayments] = useState(null);
  const [paymentsByMethod, setPaymentsByMethod] = useState([]);

  // Fetch Booking Statistics
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/reports/total-bookings")
      .then((response) => setTotalBookings(response.data.totalBookings));
    axios
      .get("http://localhost:3000/api/v1/reports/bookings-over-time")
      .then((response) => setBookingsOverTime(response.data));
    axios
      .get("http://localhost:3000/api/v1/reports/bookings-by-location")
      .then((response) => setBookingsByLocation(response.data));
  }, []);

  // Fetch Payment Analytics
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/reports/total-payments")
      .then((response) => setTotalPayments(response.data.totalPayments));
    axios
      .get("http://localhost:3000/api/v1/reports/outstanding-payments")
      .then((response) => setOutstandingPayments(response.data.outstandingPayments));
    axios
      .get("http://localhost:3000/api/v1/reports/payments-by-method")
      .then((response) => setPaymentsByMethod(response.data));
  }, []);

  //sample data for bookingsOverTime starting february 8 2025

  const bookingsOverTimeDatas = [
    { date: "2025-02-08", count: 10 },
    { date: "2025-02-09", count: 20 },
    { date: "2025-02-10", count: 30 },
    { date: "2025-02-11", count: 40 },
    { date: "2025-02-12", count: 50 },
    { date: "2025-02-13", count: 60 },
    { date: "2025-02-14", count: 70 },


  ];

  // Booking Statistics Over Time - Line Chart
  const bookingsOverTimeData = {

    
    labels: bookingsOverTimeDatas.map((item) => item.date),
    datasets: [
      {
        label: "Bookings Over Time",
        data: bookingsOverTimeDatas.map((item) => item.count),
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  };

  // Bookings by Location - Bar Chart
  const bookingsByLocationData = {
    labels: bookingsByLocation.map((item) => `${item.depLocation} -> ${item.arrLocation}`),
    datasets: [
      {
        label: "Bookings by Location",
        data: bookingsByLocation.map((item) => item.count),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Payment Analytics - Bar Chart
  const paymentsByMethodData = {
    labels: paymentsByMethod.map((item) => item.payment),
    datasets: [
      {
        label: "Payments by Method",
        data: paymentsByMethod.map((item) => item.totalAmount),
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="reporting">
      <h1>Reporting & Analytics</h1>

      <div className="statistics">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p>{totalBookings}</p>
        </div>

        <div className="payment-card">
          <h3>Total Payments</h3>
          <p>{totalPayments}</p>
        </div>



        <div className="stat-card">
          <h3>Bookings by Location</h3>
          <Bar data={bookingsByLocationData} />
        </div>
      </div>

      <div className="payment-analytics">

      <div className="stat-card">
          <h3>Bookings Over Time</h3>
          <Line data={bookingsOverTimeData} />
        </div>

        <div className="payment-card">
          <h3>Payments by Method</h3>
          <Bar data={paymentsByMethodData} />
        </div>
      </div>
    </div>
  );
};

export default Reporting;
