import { NavLink } from "react-router-dom";
import "./Sidebar.scss";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/swiftmove.jpeg" alt="logo" />
        <h2 className="sidebar-title">Swiftmove Portal</h2>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
             Manage users
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/booking"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Booking
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/vehicles"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              manage vehicles
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reporting"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Reporting Analytics
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/route-pricing"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Create Pricings
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
