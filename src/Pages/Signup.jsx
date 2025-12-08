import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_BASE_URL } from "../config"; 

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
  e.preventDefault(); 
  setError(null);

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      
      // --- DEBUGGING LOG ---
      console.log("Signup Response from Backend:", data);

      // 1. EXTRACT TOKEN (Handle both lowercase 'token' and uppercase 'Token')
      const token = data.token || data.Token;

      if (token) {
          // 2. SAVE TOKEN TO LOCAL STORAGE
          localStorage.setItem("token", token);
          
          console.log("Token saved successfully:", token);

          // 3. Navigate to the next step
          navigate("/roles"); 
      } else {
          console.error("Signup succeeded, but NO token was found in the response.");
          setError("Account created, but automatic login failed. Please try logging in.");
      }

    } else {
      const errorText = await response.text();
      setError(errorText || "Registration failed.");
    }
  } catch (err) {
    console.error("Network error:", err);
    setError("Unable to connect to the server.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-purple-200 to-blue-200 flex items-center justify-center">
      <form onSubmit={handleSignup} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4 text-center">Signup</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 px-3 py-2 border rounded"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-3 py-2 border rounded"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 px-3 py-2 border rounded"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-4 px-3 py-2 border rounded"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Signup"}
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;