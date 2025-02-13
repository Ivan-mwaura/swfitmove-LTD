import React, { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./Dashboard.scss";

// Register required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [taskList, setTaskList] = useState([
    { id: 1, task: "Follow up with booking requests", completed: false },
    { id: 2, task: "Schedule new vehicle maintenance", completed: false },
    { id: 3, task: "Confirm vehicle availability", completed: false },
  ]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const toggleTaskCompletion = (id) => {
    setTaskList((prevList) =>
      prevList.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const user = {
    firstName: "SwiftMove",
    lastName: "Admin",
  };
  const userInitials = `${user.firstName[0]}${user.lastName[0]}`;

  const totalBookingsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Total Bookings",
        data: [50, 65, 45, 80, 100, 120],
        borderColor: "#FF6B8A",
        backgroundColor: "rgba(255, 107, 138, 0.3)",
        fill: true,
      },
    ],
  };

  const vehicleAvailabilityData = {
    labels: ["Available", "In Use", "Under Maintenance"],
    datasets: [
      {
        label: "Vehicle Status",
        data: [50, 30, 10],
        backgroundColor: ["#FF6B8A", "#FFE6EB", "#FFB6C1"],
      },
    ],
  };

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
      <div className="dashboard-header">
        <div className="user-info">
          <div className="user-initials">{userInitials}</div>
          <div className="user-welcome">
            <p>Welcome, {user.firstName} {user.lastName}</p>
          </div>
        </div>
        <h1>SwiftMove Dashboard</h1>
        <button onClick={toggleDarkMode}>
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <h2>Total Bookings</h2>
          <p>1,245</p>
        </div>
        <div className="card">
          <h2>Total Vehicles</h2>
          <p>150</p>
        </div>
        <div className="card">
          <h2>Total Revenue</h2>
          <p>$150,000</p>
        </div>
        <div className="card">
          <h2>Available Vehicles</h2>
          <p>120</p>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart">
          <h2>Total Bookings Trend</h2>
          <Line data={totalBookingsData} />
        </div>
        <div className="chart">
          <h2>Vehicle Availability</h2>
          <Bar data={vehicleAvailabilityData} />
        </div>
      </div>

      <div className="recent-activities">
        <h2>Recent Activities</h2>
        <ul>
          <li>Booking #1234 confirmed for Mary Jane</li>
          <li>Vehicle #23 scheduled for maintenance</li>
          <li>New user registered: John Doe</li>
        </ul>
      </div>

      <div className="notifications-widget">
        <h2>Notifications</h2>
        <p>2 Vehicles need urgent maintenance</p>
        <p>5 Bookings pending confirmation</p>
      </div>

      <div className="dashboard-table">
        <h2>Upcoming Bookings</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer Name</th>
              <th>Vehicle Assigned</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Replace with dynamic data */}
            <tr>
              <td>#1234</td>
              <td>Mary Jane</td>
              <td>Vehicle #12</td>
              <td>Pending</td>
            </tr>
            <tr>
              <td>#1235</td>
              <td>John Doe</td>
              <td>Vehicle #14</td>
              <td>Confirmed</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="to-do-list">
        <h2>To-Do List</h2>
        <ul>
          {taskList.map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
              />
              <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                {task.task}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
