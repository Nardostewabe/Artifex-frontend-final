import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Tag, Edit3, Store, Loader2, Camera, Save, X } from 'lucide-react';
import { API_BASE_URL } from '../../../config';
import { useAuth } from '../../../context/AuthContext';

const SellerProfile = () => {
    const { token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        shopName: '',
        description: '',
        category: '',
        contactNumber: '',
        address: '',
        shopLogo: null
    });
    const [isSaving, setIsSaving] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/Profile/seller`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                    setEditData({
                        shopName: data.shopName || '',
                        description: data.description || '',
                        category: data.category || '',
                        contactNumber: data.contactNumber || '',
                        address: data.address || '',
                        shopLogo: null
                    });
                }
            } catch (error) {
                console.error("Error fetching seller profile:", error);
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
            formData.append('shopName', editData.shopName);
            formData.append('description', editData.description);
            formData.append('category', editData.category);
            formData.append('contactNumber', editData.contactNumber);
            formData.append('address', editData.address);
            if (editData.shopLogo) {
                formData.append('shopLogo', editData.shopLogo);
            }

            const response = await fetch(`${API_BASE_URL}/api/Profile/seller`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                // Refresh profile data
                const updatedRes = await fetch(`${API_BASE_URL}/api/Profile/seller`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (updatedRes.ok) {
                    const updatedData = await updatedRes.json();
                    setProfile(updatedData);
                }
                setIsEditing(false);
            } else {
                alert("Failed to update shop profile.");
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
            setEditData({ ...editData, shopLogo: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    if (loading) return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-[#f8fafc]">
            <Loader2 className="animate-spin text-[#8b5cf6]" size={40} />
        </div>
    );
    if (!profile) return (
        <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gray-50 text-gray-400">
            <Store size={48} className="mb-4" />
            <p className="font-bold uppercase tracking-wider text-xs">Profile not found.</p>
        </div>
    );

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] pt-32 pb-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="h-40 bg-gradient-to-r from-[#f3e8ff] to-[#e0f2fe] relative border-b border-purple-100">
                        {/* Banner - could be dynamic later */}
                        <div className="absolute -bottom-10 left-8">
                            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                                <div className="w-full h-full rounded-xl overflow-hidden bg-purple-50 border border-purple-100 flex items-center justify-center">
                                    {profile.shopLogo ? (
                                        <img src={profile.shopLogo} alt={profile.shopName} className="w-full h-full object-cover" />
                                    ) : (
                                        <Store size={32} className="text-purple-600" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 px-8 pb-8">
                        {isEditing ? (
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg -mt-20 group relative">
                                        <div className="w-full h-full rounded-xl overflow-hidden bg-purple-50 border border-purple-100 flex items-center justify-center relative">
                                            {previewUrl || profile.shopLogo ? (
                                                <img src={previewUrl || profile.shopLogo} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <Store size={32} className="text-purple-600" />
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
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
                                        >
                                            <X size={16} /> Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-lg shadow-purple-100"
                                        >
                                            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                            Save Changes
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Shop Name</label>
                                            <input
                                                type="text"
                                                value={editData.shopName}
                                                onChange={(e) => setEditData({ ...editData, shopName: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-purple-50 focus:ring-2 focus:ring-purple-200 outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                            <input
                                                type="text"
                                                value={editData.category}
                                                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-purple-50 focus:ring-2 focus:ring-purple-200 outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Number</label>
                                            <input
                                                type="text"
                                                value={editData.contactNumber}
                                                onChange={(e) => setEditData({ ...editData, contactNumber: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-purple-50 focus:ring-2 focus:ring-purple-200 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                            <textarea
                                                value={editData.description}
                                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-purple-50 focus:ring-2 focus:ring-purple-200 outline-none resize-none h-24"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address / Location</label>
                                            <textarea
                                                value={editData.address || editData.location || ''}
                                                onChange={(e) => setEditData({ ...editData, address: e.target.value, location: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-purple-50 focus:ring-2 focus:ring-purple-200 outline-none resize-none h-24"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{profile.shopName}</h1>
                                        <p className="text-sm text-purple-600 font-bold uppercase">@{profile.category}</p>
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        <Edit3 size={16} /> Edit Profile
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">About the Shop</h3>
                                            <p className="text-gray-600 leading-relaxed text-sm">
                                                {profile.description || "No description provided."}
                                            </p>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <Phone size={18} className="text-purple-400" />
                                                <span className="text-sm font-medium">{profile.contactNumber || "Not set"}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <MapPin size={18} className="text-purple-400" />
                                                <span className="text-sm font-medium">{profile.address || profile.location || "Not set"}</span>
                                            </div>
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

export default SellerProfile;
