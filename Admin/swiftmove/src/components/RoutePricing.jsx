import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RoutePricing.scss";

const RoutePricing = () => {
  const [routePricings, setRoutePricings] = useState([]);
  const [viewingPricing, setViewingPricing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [routeForm, setRouteForm] = useState({
    source: "",
    destination: "",
    vehicleId: "",
    departureTime: "",
    price: "",
  });
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // Fetch route pricing data
    axios
      .get("http://localhost:3000/api/v1/routes")
      .then((response) => {
        setRoutePricings(response.data.routes);
      })
      .catch((error) => {
        console.error("Error fetching route pricing", error);
      });

    // Fetch vehicle data for the dropdown
    axios
      .get("http://localhost:3000/api/v1/vehicles")
      .then((response) => {
        setVehicles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching vehicles", error);
      });
  }, []);

  const handleViewPricing = (pricing) => {
    setViewingPricing(pricing);
    setRouteForm({
      source: pricing.source,
      destination: pricing.destination,
      vehicleId: pricing.vehicleId,
      departureTime: pricing.departureTime,
      price: pricing.price,
    });
  };

  const handleCloseProfile = () => {
    setViewingPricing(null);
    setShowModal(false);
  };

  const handleDeletePricing = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/routes/${id}`);
      setRoutePricings(routePricings.filter((pricing) => pricing.id !== id));
    } catch (error) {
      console.error("Error deleting pricing", error);
    }
  };

  const handleAddPricing = () => {
    setShowModal(true);
    setViewingPricing(null);
    setRouteForm({
      source: "",
      destination: "",
      vehicleId: "",
      departureTime: "",
      price: "",
    });
  };

  const handleEditPricing = (pricing) => {
    setShowModal(true);
    setViewingPricing(pricing);
    setRouteForm({
      source: pricing.source,
      destination: pricing.destination,
      vehicleId: pricing.vehicleId,
      departureTime: pricing.departureTime,
      price: pricing.price,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRouteForm({ ...routeForm, [name]: value });
  };

  const handleSavePricing = async () => {
    const { source, destination, vehicleId, departureTime, price } = routeForm;
    try {
      if (viewingPricing) {
        await axios.put(`http://localhost:3000/api/v1/routes`, {
          id: viewingPricing.id,
          source,
          destination,
          vehicleId,
          departureTime,
          price,
        });
        setRoutePricings(
          routePricings.map((pricing) =>
            pricing.id === viewingPricing.id
              ? { ...pricing, ...routeForm }
              : pricing
          )
        );
      } else {
        await axios.post("http://localhost:3000/api/v1/routes", {
          source,
          destination,
          vehicleId,
          departureTime,
          price,
        });
        setRoutePricings([
          ...routePricings,
          { source, destination, vehicleId, departureTime, price },
        ]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving pricing", error);
    }
  };

  return (
    <div className="route-pricing">
      <h2>Manage Route Pricing</h2>

      <button className="add-button" onClick={handleAddPricing}>
        Add Route Pricing
      </button>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by route"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>Destination</th>
            <th>Price</th>
            <th>VehicleType</th>
            <th>Number Plate</th>
            <th>Departure Time</th>

            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routePricings.map((pricing) => (
            <tr key={pricing.id}>
              <td>{pricing.source}</td>
              <td>{pricing.destination}</td>
              <td>{pricing.price}</td>
              <td>{pricing.vehicleType}</td>
              <td>{pricing.numberPlate}</td>
              <td>{pricing.departureTime}</td>
              <td>
                <button onClick={() => handleViewPricing(pricing)}>View</button>
                <button onClick={() => handleEditPricing(pricing)}>Edit</button>
                <button onClick={() => handleDeletePricing(pricing.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{viewingPricing ? "Edit Route Pricing" : "Add Route Pricing"}</h2>
            <div className="modal-form">
              <label>
                Source:
                <input
                  type="text"
                  name="source"
                  value={routeForm.source}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Destination:
                <input
                  type="text"
                  name="destination"
                  value={routeForm.destination}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Vehicle:
                <select
                  name="vehicleId"
                  value={routeForm.vehicleId}
                  onChange={handleInputChange}
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.numberPlate} ({vehicle.type})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Departure Time:
                <input
                  type="time"
                  name="departureTime"
                  value={routeForm.departureTime}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Price:
                <input
                  type="number"
                  name="price"
                  value={routeForm.price}
                  onChange={handleInputChange}
                />
              </label>

              <button onClick={handleSavePricing}>
                {viewingPricing ? "Save Changes" : "Add Pricing"}
              </button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutePricing;
