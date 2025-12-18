import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage.jsx';
import Shop from './Pages/Shop.jsx';
import Signup from './Pages/Signup.jsx';
import Login from './Pages/Login.jsx';
import Role from './Pages/RoleSelection.jsx';
import SellerForm from './Pages/SellerForm.jsx';
import CustomerForm from './Pages/CustomerForm.jsx';
import CustomerHome from './Pages/Customer/pages/HomePage.jsx';
import SellerHome from './Pages/Seller/pages/HomePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import PlatformAdminLayout from './layouts/PlatformAdminLayout.jsx';
import Dashboard from './Pages/PlatformAdmin/pages/Dashboard.jsx';
import UserMonitoring from "./Pages/PlatformAdmin/pages/UserMonitoring";
import SellerManagement from "./Pages/PlatformAdmin/pages/SellerManagement";
import AdminManagement from "./Pages/PlatformAdmin/pages/AdminManagement";
import Reports from "./Pages/PlatformAdmin/pages/Reports";
import SystemLogs from "./Pages/PlatformAdmin/pages/SystemLogs";
import SellerApproval from './Pages/PlatformAdmin/pages/SellerApproval.jsx';
import WaitingApproval from './Pages/Seller/pages/WaitingApproval.jsx';
import AddProduct from './Pages/Seller/pages/AddProducts.jsx'; 

const App = () => {
  return (
    <>
    <AuthProvider>
            <Router>
        <div className="font-sans text-gray-900">

            {/* ======================================================= */}
            {/* WORLD 1: PUBLIC / CUSTOMER / SELLER (Has Top Navbar)    */}
            {/* ======================================================= */}

          <Routes>
            <Route element={<PublicLayout />}>
            {/* =========================================
               1. PUBLIC ROUTES (No Token Required)
               ========================================= */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/collections" element={<div className="pt-32 text-center">Collections Page Coming Soon</div>} />
            <Route path="/about" element={<div className="pt-32 text-center">About Page Coming Soon</div>} />
            <Route path="/contact" element={<div className="pt-32 text-center">Contact Page Coming Soon</div>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* =========================================
               2. LOGGED IN ROUTES (Token Required)
               These pages need a user to be signed in, 
               but they haven't picked a role yet or are setting up.
               ========================================= */}
            <Route element={<ProtectedRoute />}> 
              <Route path="/roles" element={<Role />} />
              <Route path="/setup-seller" element={<SellerForm />} />
              <Route path="/setup-customer" element={<CustomerForm />} />
            </Route>

            {/* =========================================
               3. CUSTOMER ONLY ROUTES
               Requires Token + Role '1' or 'Customer'
               ========================================= */}
            <Route element={<ProtectedRoute allowedRoles={[1, "Customer"]} />}>
              <Route path="/customer-home" element={<CustomerHome />} />
            </Route>

            {/* =========================================
               4. SELLER ONLY ROUTES
               Requires Token + Role '2' or 'Seller'
               ========================================= */}
            <Route element={<ProtectedRoute allowedRoles={[2, "Seller"]} />}>
              <Route path="/seller-home" element={<SellerHome />} />
              <Route path="/waiting-approval" element={<WaitingApproval />} />
              <Route path="/seller-home/add-product" element={<AddProduct />}/>
            </Route>
            </Route>
            {/* ======================================================= */}
            {/* WORLD 2: PLATFORM ADMIN (Has Sidebar Navigation)       */}
            {/* ======================================================= */}

            <Route element={<ProtectedRoute allowedRoles={[4, "PlatformAdmin"]} />}>
              <Route element={<PlatformAdminLayout />}>
                <Route path="/PlatformAdmin-dashboard" element={<Dashboard />} />
                <Route path="/users" element={<UserMonitoring />} />
                <Route path="/sellers" element={<SellerManagement />} />
                <Route path="/admins" element={<AdminManagement />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/logs" element={<SystemLogs />} />
                <Route path="/sellers-approval" element={<SellerApproval />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>  
     </AuthProvider> 
    </>
  );
}

export default App;