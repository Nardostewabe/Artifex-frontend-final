import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/Public/HomePage.jsx';
import Shop from './Pages/Public/Shop.jsx';
import Signup from './Pages/Auth/Signup.jsx';
import CompleteSignup from './Pages/Auth/CompleteSignup.jsx';
import Login from './Pages/Auth/Login.jsx';
import Role from './Pages/Auth/RoleSelection.jsx';
import SellerForm from './Pages/Seller/pages/SellerForm.jsx';
import CustomerForm from './Pages/Customer/pages/CustomerForm.jsx';
import CustomerHome from './Pages/Customer/pages/HomePage.jsx';
import SellerHome from './Pages/Seller/pages/HomePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import PlatformAdminLayout from './layouts/PlatformAdminLayout.jsx';
import SellerLayout from './layouts/SellerLayout.jsx';
import Dashboard from './Pages/PlatformAdmin/pages/Dashboard.jsx';
import UserMonitoring from "./Pages/PlatformAdmin/pages/UserMonitoring";
import SellerManagement from "./Pages/PlatformAdmin/pages/SellerManagement";
import AdminManagement from "./Pages/PlatformAdmin/pages/AdminManagement";
import Reports from "./Pages/PlatformAdmin/pages/Reports";
import SellerApproval from './Pages/PlatformAdmin/pages/SellerApproval.jsx';
import WaitingApproval from './Pages/Seller/pages/WaitingApproval.jsx';
import AddProduct from './Pages/Seller/pages/AddProducts.jsx';
import SellerShop from './Pages/Seller/pages/SellerShop.jsx';
import SellerInventory from './Pages/Seller/pages/SellerInventory.jsx';
import EditProduct from './Pages/Seller/pages/EditProducts.jsx';
import CHomepage from "./Pages/Customer/pages/HomePage.jsx";
import ProductDetails from './Pages/Seller/pages/ProductDetails.jsx';
import CustomerCollection from './Pages/Customer/pages/CustomerCollection.jsx';
import CustomerProduct from './Pages/Customer/pages/CustomerProduct.jsx';
import CartPage from './Pages/Customer/pages/CartPage.jsx';
import MyProfile from './Pages/Customer/pages/MyProfile.jsx';
import SellerProfile from './Pages/Seller/pages/SellerProfile.jsx';
import ContentAdminDashboard from './Pages/ContentAdmin/index.jsx';
import SellerOrders from './Pages/Seller/pages/SellerOrders.jsx';
import PublicSellerShop from './Pages/Public/PublicSellerShop.jsx';
import Favorites from './Pages/Customer/pages/Favorites.jsx';
import CustomerOrders from './Pages/Customer/pages/CustomerOrders.jsx';
import ForgotPassword from './Pages/Public/ForgotPassword.jsx';
import ResetPassword from './Pages/Public/ResetPassword.jsx';
import About from './Pages/Public/About.jsx';
import Contact from './Pages/Public/Contact.jsx';
import PaymentForm from './Pages/Customer/pages/PaymentForm.jsx';
import PaymentSuccess from './Pages/Customer/pages/PaymentSuccess.jsx';

const App = () => {
  return (
    <>
      <AuthProvider>
        <CartProvider>
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
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/collections" element={<CustomerCollection />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/complete-signup" element={<CompleteSignup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  <Route path="/chomepage" element={<CHomepage />} />
                  <Route path="/seller-shop/:sellerId" element={<PublicSellerShop />} />

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
                    <Route path="/collections/:category" element={<CustomerCollection />} />
                    <Route path="/collection/:category" element={<CustomerCollection />} />
                    <Route path="/collection" element={<CustomerCollection />} />
                    <Route path="customer/product/:id" element={<CustomerProduct />} />
                    <Route path="/my-profile" element={<MyProfile />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/orders" element={<CustomerOrders />} />
                   <Route path="/payment" element={<PaymentForm />} />
<Route path="/payment/success" element={<PaymentSuccess />} />
                  </Route>

                </Route>

                {/* =========================================
               4. SELLER ONLY ROUTES
               Requires Token + Role '2' or 'Seller'
               ========================================= */}
                <Route element={<ProtectedRoute allowedRoles={[2, "Seller"]} />}>
                  <Route element={<SellerLayout />}>
                    <Route path="/seller-home" element={<SellerHome />} />
                    <Route path="/waiting-approval" element={<WaitingApproval />} />
                    <Route path="/add-product" element={<AddProduct />} />
                    <Route path="/seller-inventory" element={<SellerInventory />} />
                    <Route path="/seller-shop" element={<SellerShop />} />
                    <Route path="/product/edit/:id" element={<EditProduct />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/seller-orders" element={<SellerOrders />} />
                    <Route path="/seller-profile" element={<SellerProfile />} />
                  </Route>
                </Route>

                {/* ======================================================= */}
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
                    <Route path="/sellers-approval" element={<SellerApproval />} />
                  </Route>
                </Route>

                {/* =========================================
                5. CONTENT ADMIN ROUTES
                Requires Token + Role '3' or 'ContentAdmin'
                ========================================= */}
                <Route element={<ProtectedRoute allowedRoles={[3, "ContentAdmin"]} />}>
                  <Route path="/ContentAdmin-dashboard" element={<ContentAdminDashboard />} />
                </Route>
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;