import React, { useState, useEffect } from "react";
import axios from "axios";
import "./VehicleManagement.scss";

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [vehicleForm, setVehicleForm] = useState({
    type: "",
    numberPlate: "",
    capacity: "",
    status: "available",
    lastMaintenanceDate: "",
    assignedDriver: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/vehicles")
      .then((response) => {
        setVehicles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching vehicles", error);
      });
  }, []);

  const handleViewVehicle = (vehicle) => {
    setViewingVehicle(vehicle);
  };

  const handleCloseProfile = () => {
    setViewingVehicle(null);
    setShowModal(false);
  };

  const handleDeleteVehicle = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/vehicles/${id}`);
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
    } catch (error) {
      console.error("Error deleting vehicle", error);
    }
  };

  const handleAddVehicle = () => {
    setShowModal(true);
    setViewingVehicle(null);  // Reset viewing vehicle
    setVehicleForm({
      type: "",
      numberPlate: "",
      capacity: "",
      status: "available",
      assignedDriver: "",
      lastMaintenanceDate: "",
    });
  };

  const handleEditVehicle = (vehicle) => {
    setShowModal(true);
    setViewingVehicle(vehicle);
    setVehicleForm({
      type: vehicle.type,
      numberPlate: vehicle.numberPlate,
      capacity: vehicle.capacity,
      status: vehicle.status,
      assignedDriver: vehicle.assignedDriver,
      lastMaintenanceDate: vehicle.lastMaintenanceDate,

    });
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleForm({ ...vehicleForm, [name]: value });
  };

  const handleSaveVehicle = async () => {
    const { type, numberPlate, capacity, status, assignedDriver, lastMaintenanceDate } = vehicleForm;
    try {
      if (viewingVehicle) {
        await axios.put(`http://localhost:3000/api/v1/vehicles/${viewingVehicle.id}`, {
          type,
          numberPlate,
          capacity,
          status,
          assignedDriver,
          lastMaintenanceDate,
        });
        // Update the vehicles list in state
        setVehicles(vehicles.map(vehicle =>
          vehicle.id === viewingVehicle.id ? { ...vehicle, ...vehicleForm } : vehicle
        ));
      } else {
        await axios.post("http://localhost:3000/api/v1/vehicles", {
          type,
          numberPlate,
          capacity,
          status,
          assignedDriver,
          lastMaintenanceDate,
        });
        // Add new vehicle to the list in state
        setVehicles([...vehicles, { type, numberPlate, capacity, status,assignedDriver, lastMaintenanceDate }]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving vehicle", error);
    }
  };

  return (
    <div className="vehicle-management">
      <h2>Manage Vehicles</h2>

      <button className="add-button" onClick={handleAddVehicle}>
        Add Vehicle
      </button>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by number plate"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="under maintenance">Under Maintenance</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Number Plate</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Assigned Driver</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.numberPlate}</td>
              <td>{vehicle.type}</td>
              <td>{vehicle.capacity}</td>
              <td>{vehicle.status}</td>
              <td>{vehicle.assignedDriver}</td>
              <td>
                <button onClick={() => handleViewVehicle(vehicle)}>View</button>
                <button onClick={() => handleEditVehicle(vehicle)}>Edit</button>
                <button onClick={() => handleDeleteVehicle(vehicle.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{viewingVehicle ? "Edit Vehicle" : "Add Vehicle"}</h2>
            <div className="modal-form">
              <label>
                Vehicle Type:
                <input
                  type="text"
                  name="type"
                  value={vehicleForm.type}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Number Plate:
                <input
                  type="text"
                  name="numberPlate"
                  value={vehicleForm.numberPlate}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Capacity:
                <input
                  type="number"
                  name="capacity"
                  value={vehicleForm.capacity}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Status:
                <select
                  name="status"
                  value={vehicleForm.status}
                  onChange={handleInputChange}
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="under maintenance">Under Maintenance</option>
                </select>
              </label>
              <label>
                Assigned Driver:
                <input
                  type="text"
                  name="assignedDriver"
                  value={vehicleForm.assignedDriver}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Last Maintenance Date:
                <input
                  type="date"
                  name="lastMaintenanceDate"
                  value={vehicleForm.lastMaintenanceDate}
                  onChange={handleInputChange}
                />
              </label>

              <button onClick={handleSaveVehicle}>
                {viewingVehicle ? "Save Changes" : "Add Vehicle"}
              </button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
