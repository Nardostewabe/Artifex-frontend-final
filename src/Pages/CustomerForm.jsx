import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const CustomerForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    
    if (!token) {
        alert("Session expired. Please login/signup again.");
        navigate("/login");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/profile/customer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Attach Token
            },
            body: JSON.stringify({
                fullName: name,
                phoneNumber: phone,
                shippingAddress: address
            })
        });

        if (response.ok) {
            navigate("/login");
        } else {
            alert("Failed to save profile.");
        }
    } catch (err) {
        console.error(err);
        alert("Error connecting to server.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md border border-white">
        <h2 className="text-3xl font-serif text-slate-800 mb-2 text-center">Customer Profile</h2>
        <p className="text-slate-500 text-center mb-6">Tell us where to send your goodies.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/50"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                type="tel"
                required
                className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/50"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Shipping Address</label>
                <textarea
                required
                rows="3"
                className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/50"
                placeholder="Street, City, Zip Code"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-400 to-blue-400 text-white font-semibold py-3 rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all shadow-md mt-4"
            >
                {loading ? "Saving..." : "Complete Setup"}
            </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;