import { Route, Routes} from "react-router-dom";
import Layout from "./components/Layout/layout";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import Booking from "./components/Bookings";
import VehicleManagement from "./components/VehicleManagement";
import Reporting from "./components/Reporting";
import RoutePricing from "./components/RoutePricing";


import "./main.scss";



const App = () => {

 

  return (
    <Layout>
      {/* Only show the CircularProgress inside the main content */}
      <div className="main-content">

        <Routes>
          
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/vehicles" element={<VehicleManagement />} />
          <Route path="/reporting" element={<Reporting />} />
          <Route path="/route-pricing" element={<RoutePricing />} />

          
        
        </Routes>
        
      </div> 
    </Layout>
  );
};

export default App;
