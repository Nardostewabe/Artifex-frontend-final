import React, { useState } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch(`${API_BASE_URL}/api/Auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                setStatus('success');
                setMessage('If an account exists with that email, we have sent a password reset link.');
            } else {
                setStatus('error');
                setMessage('Failed to send request. Please try again.');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Network error. Please check your connection.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative">
                {/* Header Decoration */}
                <div className="h-32 bg-purple-600 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/20"></div>
                    <button
                        onClick={() => navigate('/login')}
                        className="absolute top-4 left-4 text-black/80 hover:bg-black/80 hover:text-white flex items-center gap-2 font-bold text-sm transition-colors z-10"
                    >
                        <ArrowLeft size={16} /> Back to Login
                    </button>
                    <div className="absolute -bottom-10 -right-10 text-white/10">
                        <Mail size={150} />
                    </div>
                </div>

                <div className="px-8 pb-8 pt-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Forgot Password?</h1>
                        <p className="text-gray-500 text-sm mt-2">Enter your email address and we'll send you a link to reset your password.</p>
                    </div>

                    {status === 'success' ? (
                        <div className="bg-green-50 rounded-xl p-6 text-center border border-green-100">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Send size={24} />
                            </div>
                            <h3 className="font-bold text-green-800 mb-1">Check your inbox</h3>
                            <p className="text-green-700 text-sm">{message}</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="mt-4 text-green-700 font-bold text-sm hover:underline"
                            >
                                Return to Login
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-medium text-gray-800"
                                        placeholder="you@example.com"
                                    />
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                            </div>

                            {status === 'error' && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium border border-red-100">
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                                {!status === 'loading' && <Send size={18} />}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
