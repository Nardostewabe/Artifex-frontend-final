import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Edit3 } from 'lucide-react';
import { API_BASE_URL } from '../../../config';
import { useAuth } from '../../../context/AuthContext';

const MyProfile = () => {
    const { token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/Profile/customer`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                }
            } catch (error) {
                console.error("Error fetching customer profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

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
                            <button className="mb-2 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
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
                                    <p className="font-medium text-gray-900">{profile.phoneNumber}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Shipping Address</p>
                                    <p className="font-medium text-gray-900">{profile.shippingAddress}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
