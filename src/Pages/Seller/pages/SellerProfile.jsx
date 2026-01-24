import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Tag, Edit3, Store, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../../config';
import { useAuth } from '../../../context/AuthContext';

const SellerProfile = () => {
    const { token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/Profile/seller`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                }
            } catch (error) {
                console.error("Error fetching seller profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    if (!profile) return <div className="p-8 text-center text-gray-500">Profile not found.</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600 relative">
                {/* Banner - could be dynamic later */}
                <div className="absolute -bottom-10 left-8">
                    <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                        <div className="w-full h-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                            {profile.shopLogo ? (
                                <img src={profile.shopLogo} alt={profile.shopName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Store size={32} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-12 px-8 pb-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{profile.shopName}</h1>
                        <p className="text-sm text-gray-500 font-medium">@{profile.category}</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        <Edit3 size={16} /> Edit Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About the Shop</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {profile.description || "No description provided."}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-purple-600 shadow-sm">
                                    <MapPin size={16} />
                                </div>
                                <span>{profile.address}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm">
                                    <Phone size={16} />
                                </div>
                                <span>{profile.contactNumber}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-orange-600 shadow-sm">
                                    <Tag size={16} />
                                </div>
                                <span>{profile.category}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerProfile;
