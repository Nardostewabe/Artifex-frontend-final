
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { API_BASE_URL } from "../../config";

const CompleteSignup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [password, setPassword] = useState("");

    useEffect(() => {
        // 1. Verify we have a Supabase session (meaning they clicked the email link)
        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error || !session) {
                    console.error("No session found:", error);
                    setError("Verification link invalid or expired. Please try signing up again.");
                    setLoading(false);
                    return;
                }

                console.log("Supabase Verification Success:", session.user);
                setUserData(session.user);

                // Optional: If you want to auto-fill or check if user already exists in your backend
                // (But we will just wait for password confirmation)

            } catch (err) {
                console.error("Session check error:", err);
                setError("An error occurred verifying your email.");
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const handleCompleteRegistration = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        if (!userData) return;

        try {
            // 2. Call YOUR BACKEND with the original Register API
            // We use the email/username from Supabase, and the CONFIRMED password from this form
            // NOTE: The backend will create its own independent user record/token.

            const payload = {
                username: userData.user_metadata?.username || userData.email.split('@')[0], // Fallback if no username
                email: userData.email,
                password: password
            };

            console.log("Sending to Backend:", payload);

            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Backend Registration Success:", data);

                const token = data.token || data.Token;
                if (token) {
                    // Save YOUR BACKEND token
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(data.user || {})); // Save user object if needed

                    // Cleanup Supabase session (Optional, but good if you want to strictly use your backend token)
                    await supabase.auth.signOut();

                    // Navigate to Role Selection
                    navigate("/roles");
                } else {
                    setError("Account created, but no login token received. Please try logging in manually.");
                }

            } else {
                const errorText = await response.text();
                // Handle "User already exists" gracefully
                if (errorText.includes("already exists")) {
                    // Since they verified email, maybe just redirect to login?
                    setError("This email is already registered in our system. Please login.");
                } else {
                    setError(errorText || "Registration failed on server.");
                }
            }

        } catch (err) {
            console.error("Registration error:", err);
            setError("Unable to connect to the backend server.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-gray-600">Verifying your email...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
                <div className="bg-white p-8 rounded shadow text-center max-w-md">
                    <h2 className="text-2xl text-red-600 mb-4">Verification Error</h2>
                    <p className="mb-6 text-gray-700">{error}</p>
                    <button onClick={() => navigate("/signup")} className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
                        Back to Signup
                    </button>
                    <div className="mt-4">
                        <button onClick={() => navigate("/login")} className="text-blue-600 underline">
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-screen bg-gradient-to-r from-green-200 to-blue-200 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Email Verified!</h2>
                <p className="text-center text-gray-600 mb-6">
                    Welcome, <span className="font-semibold text-purple-600">{userData?.email}</span>.
                    <br />Please confirm your password to complete setup.
                </p>

                <form onSubmit={handleCompleteRegistration}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="Re-enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Use the same password you entered during signup.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-blue-700 transition"
                    >
                        {submitting ? "Finishing Setup..." : "Complete Registration"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteSignup;
