import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Edit3, Camera, Save, X, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../../config';
import { useAuth } from '../../../context/AuthContext';

const MyProfile = () => {
    const { token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        fullName: '',
        phoneNumber: '',
        shippingAddress: '',
        profilePicture: null
    });
    const [isSaving, setIsSaving] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/Profile/customer`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                    setEditData({
                        fullName: data.fullName || '',
                        phoneNumber: data.phoneNumber || '',
                        shippingAddress: data.shippingAddress || '',
                        profilePicture: null
                    });
                }
            } catch (error) {
                console.error("Error fetching customer profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('fullName', editData.fullName);
            formData.append('phoneNumber', editData.phoneNumber);
            formData.append('shippingAddress', editData.shippingAddress);
            if (editData.profilePicture) {
                formData.append('profilePicture', editData.profilePicture);
            }

            const response = await fetch(`${API_BASE_URL}/api/Profile/customer`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                // Refresh profile data
                const updatedRes = await fetch(`${API_BASE_URL}/api/Profile/customer`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (updatedRes.ok) {
                    const updatedData = await updatedRes.json();
                    setProfile(updatedData);
                }
                setIsEditing(false);
            } else {
                alert("Failed to update profile.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditData({ ...editData, profilePicture: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    if (loading) return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
            <div className="text-gray-500">Loading profile...</div>
        </div>
    );

    if (!profile) return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
            <div className="text-gray-500">Profile not found.</div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 bg-gray-50">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500 relative"></div>

                    <div className="px-8 pb-8">
                        {isEditing ? (
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="relative -mt-12 mb-6 flex justify-between items-end">
                                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg group relative">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center relative">
                                            {previewUrl || profile.profilePictureUrl ? (
                                                <img src={previewUrl || profile.profilePictureUrl} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={32} className="text-gray-400" />
                                            )}
                                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <Camera size={20} />
                                                <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => { setIsEditing(false); setPreviewUrl(null); }}
                                            className="mb-2 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                                        >
                                            <X size={16} /> Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="mb-2 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                                        >
                                            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                            Save Changes
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={editData.fullName}
                                            onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                            placeholder="Your full name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Phone Number</label>
                                        <input
                                            type="text"
                                            value={editData.phoneNumber}
                                            onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                            placeholder="Phone number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Shipping Address</label>
                                        <textarea
                                            value={editData.shippingAddress}
                                            onChange={(e) => setEditData({ ...editData, shippingAddress: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none h-24"
                                            placeholder="Shipping address"
                                        />
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="relative -mt-12 mb-6 flex justify-between items-end">
                                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                                            {profile.profilePictureUrl ? (
                                                <img src={profile.profilePictureUrl} alt={profile.fullName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <User size={32} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="mb-2 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        <Edit3 size={16} /> Edit
                                    </button>
                                </div>

                                <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.fullName}</h1>
                                <p className="text-gray-500 text-sm mb-6">Valued Customer</p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold">Phone Number</p>
                                            <p className="font-medium text-gray-900">{profile.phoneNumber || "Not set"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold">Shipping Address</p>
                                            <p className="font-medium text-gray-900">{profile.shippingAddress || "Not set"}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
