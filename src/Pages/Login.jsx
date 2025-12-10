import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config"; // Make sure this path is correct
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const { login } = useAuth();
  const navigate = useNavigate();

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
        // Match the C# DTO property: public string UsernameOrEmail { get; set; }
        body: JSON.stringify({ 
            UsernameOrEmail: username, 
            Password: password 
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // 1. Save the token
        const token = data.token || data.Token; // Handle capitalization safety
        if (token) {
            login(token, data.user);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(data.user));
            
            console.log("Login successful",data.user.role);

            const userRole = data.user.role;
            if (userRole == "1") {
                navigate("/customer-home");
                console.log("Login successful",data.user.role);
            }
            else if (userRole == "2") {
                navigate("/seller-home");
            }
            else if (userRole == "3") {
                navigate("/ContentAdmin-dashboard");
            }
            else if (userRole == "4") {
                navigate("/PlatformAdmin-dashboard");
            }
            else {
              setError("User has not registered as a seller or a customer.");
              navigate("/");
            }
            
        } else {
            setError("Login succeeded but no token was returned.");
        }

      } else {
        // Handle 401 Unauthorized or 400 Bad Request
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
    // Implement logic later
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