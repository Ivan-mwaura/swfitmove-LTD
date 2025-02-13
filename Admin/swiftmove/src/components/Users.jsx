import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify'; // Import the toast function

import './Users.scss';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [viewingUser, setViewingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3000/api/v1/users')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching users!", error);
        setLoading(false);
      });
  }, []);

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/v1/users/${id}`);
      setUsers(users.filter(user => user.id !== id)); // Remove user from state
      toast.success("✅ User Deleted");
    } catch (error) {
      console.error("Error deleting user", error);
      toast.error("❌ Deletion Failed: There was an issue deleting the user.");
    }
    setLoading(false);
  };

  const handleViewUser = (user) => {
    setViewingUser(user);
  };

  const handleCloseProfile = () => {
    setViewingUser(null);
  };

  return (
    <div className="users">
      <h1>Manage Users</h1>
      <div className="user-table-container">
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <>
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(user =>
                  user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
                ).map(user => (
                  <tr key={user.id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.location}</td>
                    <td>
                      <button onClick={() => handleViewUser(user)} className="view-button">
                        View
                      </button>
                      <button onClick={() => deleteUser(user.id)} className="delete-button">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Modal: User Profile */}
      {viewingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{viewingUser.firstName} {viewingUser.lastName}'s Profile</h2>
            <p><strong>Email:</strong> {viewingUser.email}</p>
            <p><strong>Phone:</strong> {viewingUser.phone}</p>
            <p><strong>Location:</strong> {viewingUser.location}</p>
            <button className="close-modal" onClick={handleCloseProfile}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
