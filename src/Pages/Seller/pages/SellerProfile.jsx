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
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{profile.shopName}</h1>
                                <p className="text-sm text-purple-600 font-bold uppercase">@{profile.category}</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerProfile;
