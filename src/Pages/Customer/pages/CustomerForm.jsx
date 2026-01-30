import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config";
import { useModal } from "../../../context/ModalContext";
import { Upload, User } from 'lucide-react';

const CustomerForm = () => {
    const navigate = useNavigate();
    const { showAlert } = useModal();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
            await showAlert("Session expired. Please login/signup again.", "Session Expired", "warning");
            navigate("/login");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("fullName", name);
            formData.append("phoneNumber", phone);
            formData.append("shippingAddress", address);

            if (profilePicture) {
                formData.append("profilePicture", profilePicture);
            }

            const response = await fetch(`${API_BASE_URL}/api/profile/customer`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                    // Note: Content-Type header auto-set for FormData
                },
                body: formData
            });

            if (response.ok) {
                navigate("/login");
            } else {
                const errorText = await response.text();
                showAlert(`Failed to save profile: ${errorText}`, "Error", "danger");
            }
        } catch (err) {
            console.error(err);
            showAlert("Error connecting to server.", "Connection Error", "danger");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md border border-white my-8">
                <h2 className="text-3xl font-serif text-slate-800 mb-2 text-center">Customer Profile</h2>
                <p className="text-slate-500 text-center mb-6">Tell us where to send your goodies.</p>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Profile Picture Upload */}
                    <div className="flex justify-center mb-6">
                        <div className="relative w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-blue-400 transition-colors cursor-pointer group">
                            {preview ? (
                                <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                            ) : (
                                <User className="text-gray-400 group-hover:text-blue-500" size={24} />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                    <p className="text-center text-xs text-slate-500 -mt-4 mb-4">Upload Profile Picture</p>


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