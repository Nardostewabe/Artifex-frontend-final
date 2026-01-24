import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config";
import { Upload, X } from 'lucide-react';

const SellerForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [category, setCategory] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [shopLogo, setShopLogo] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShopLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

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
      const formData = new FormData();
      formData.append("shopName", shopName);
      formData.append("description", description);
      formData.append("businessAddress", businessAddress);
      formData.append("category", category);
      formData.append("contactNumber", contactNumber);

      if (shopLogo) {
        formData.append("shopLogo", shopLogo);
      }

      const response = await fetch(`${API_BASE_URL}/api/profile/seller`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
          // Note: Do NOT set Content-Type to application/json manually for FormData
        },
        body: formData
      });

      if (response.ok) {
        navigate("/waiting-approval");
      } else {
        const errorText = await response.text();
        alert(`Failed to create shop: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100 my-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Open Your Shop</h2>
        <p className="text-gray-500 text-center mb-6">Let's get your business ready.</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Logo Upload */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-purple-400 transition-colors cursor-pointer group">
              {preview ? (
                <img src={preview} alt="Logo Preview" className="w-full h-full object-cover" />
              ) : (
                <Upload className="text-gray-400 group-hover:text-purple-500" size={24} />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 -mt-4 mb-4">Upload Shop Logo</p>

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