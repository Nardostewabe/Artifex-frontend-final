import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const SellerForm = () => {
  const navigate = useNavigate();
  // 1. Added loading state here
  const [loading, setLoading] = useState(false);
  
  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [category, setCategory] = useState("");
  const [contactNumber, setContactNumber] = useState("");   

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
        const response = await fetch(`${API_BASE_URL}/api/profile/seller`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            // 2. FIXED: Added category and contactNumber to the payload
            body: JSON.stringify({
                shopName,
                description,
                businessAddress,
                category,
                contactNumber
            })
        });

        if (response.ok) {
            navigate("/login");
        } else {
            alert("Failed to create shop.");
        }
    } catch (err) {
        console.error(err);
        alert("Error connecting to server.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-purple-200 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md border border-white">
        <h2 className="text-3xl font-serif text-slate-800 mb-2 text-center">Open Your Shop</h2>
        <p className="text-slate-500 text-center mb-6">Let's get your business ready.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Shop Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/50"
              placeholder="My Awesome Store"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Shop Description</label>
            <textarea
              rows="3"
              className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/50"
              placeholder="What do you sell?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Business Address</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/50"
              placeholder="Where are you located?"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/50"
              placeholder="Electronics, Clothing, Art..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            {/* 3. FIXED: Changed type to tel and fixed placeholder */}
            <input
              type="tel"
              required
              className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/50"
              placeholder="+1 234 567 8900"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold py-3 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-md mt-4 disabled:opacity-50"
          >
            {loading ? "Creating Shop..." : "Launch Shop"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerForm;