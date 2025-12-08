import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navigationbar from './components/Navigationbar.jsx';
import HomePage from './Pages/HomePage.jsx';
import Shop from './Pages/Shop.jsx';
import Signup from './Pages/Signup.jsx';
import Login from './Pages/Login.jsx';
import Role from './Pages/RoleSelection.jsx';
import SellerForm from './Pages/SellerForm.jsx';
import CustomerForm from './Pages/CustomerForm.jsx';
import CustomerHome from './Pages/Customer/HomePage.jsx'
import SellerHome from './Pages/Seller/HomePage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx';

const App = () => {
  return(
    <>
      <Router>
        <div className="font-sans text-gray-900">
        
        {/* Navbar stays at the top of all pages */}
        <Navigationbar />

        {/* PUBLIC ROUTES */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/collections" element={<div className="pt-32 text-center">Collections Page Coming Soon</div>} />
          <Route path="/about" element={<div className="pt-32 text-center">About Page Coming Soon</div>} />
          <Route path="/contact" element={<div className="pt-32 text-center">Contact Page Coming Soon</div>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/roles" element={<Role />} />
          <Route path="/setup-seller" element={<SellerForm />} />
          <Route path="/setup-customer" element={<CustomerForm />} />

          {/* PROTECTED CUSTOMER ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={[1, "Customer"]} />}>
          console.log("successfully entered protected zone");
            <Route path="/customer-home" element={<CustomerHome />} />
          </Route>
          {/* PROTECTED SELLER ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={[2, "Seller"]} />}>
            <Route path="/seller-home" element={<SellerHome />} />
          </Route>
        </Routes>

        </div>
      </Router>  
    </>
  );
}

export default App;