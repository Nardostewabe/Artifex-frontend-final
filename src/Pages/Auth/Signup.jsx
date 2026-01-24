import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../../supabaseClient";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setMsg(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Gatekeeper Step 1: Trigger Supabase Verification Email
      const { data, error: supabaseError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username // Save username to metadata for later retrieval
          },
          emailRedirectTo: `${window.location.origin}/complete-signup`
        }
      });

      if (supabaseError) {
        throw supabaseError;
      }

      // Success!
      setMsg("Please check your email to verify your account. You will be redirected to complete your registration after verification.");

      // Optional: Clear form
      // setUsername("");
      // setEmail("");
      // setPassword("");
      // setConfirmPassword("");

    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Unable to start registration.");
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

        {msg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {msg}
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
          {loading ? "Sending Verification..." : "Signup"}
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