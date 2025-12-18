import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config"; 
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            UsernameOrEmail: username, 
            Password: password 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token || data.Token; 

        if (token) {
           // 1. Save Data
           login(token, data.user);
           localStorage.setItem("token", token);
           localStorage.setItem("user", JSON.stringify(data.user));
           
           console.log("FULL BACKEND DATA:", data.user);

           // ---------------------------------------------------------
           // THE FIX: NORMALIZE DATA BEFORE CHECKING
           // ---------------------------------------------------------

           // 1. Force Role to String (Safety check)
           const role = String(data.user.role); 

           // 2. Use the correct field name from your console log (.isApproved)
           const rawApproved = data.user.isApproved; 
           
           // 3. Robust check: handles true, "true", 1, "1"
           const isSellerApproved = rawApproved === true || rawApproved === "true" || rawApproved === 1 || rawApproved === "1";

           console.log("NAVIGATION DEBUG:", { role, isSellerApproved, rawValue: rawApproved });

           // 4. Navigate based on normalized data
           if (role === "1") {
               navigate("/customer-home");
           }
           else if (role === "2") {
               if (isSellerApproved) {
                   console.log("Seller is approved. Going to dashboard.");
                   navigate("/seller-home");
               } else {
                   console.log("Seller NOT approved. Going to waiting room.");
                   navigate("/waiting-approval");
               }
           }
           else if (role === "3") {
               navigate("/ContentAdmin-dashboard");
           }
           else if (role === "4") {
               navigate("/PlatformAdmin-dashboard");
           }
           else {
               console.warn("Unknown Role:", role);
               setError("User role not recognized.");
               navigate("/");
           }
           
        } else {
            setError("Login succeeded but no token was returned.");
        }

      } else {
        const errorText = await response.text();
        setError(errorText || "Invalid username or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-purple-200 to-blue-200 flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
              {error}
            </div>
        )}

        <input
          type="text"
          placeholder="Enter username or email"
          className="w-full mb-3 px-3 py-2 border rounded"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full mb-3 px-3 py-2 border rounded"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div
          className="text-sm text-right text-blue-500 mb-4 cursor-pointer hover:underline"
          onClick={handleForgotPassword}
        >
          Forgot password?
        </div>

        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 underline">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;