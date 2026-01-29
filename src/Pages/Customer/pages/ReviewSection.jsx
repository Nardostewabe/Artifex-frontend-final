import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '../../../config'; // Ensure this path is correct for your project
import { useAuth } from '../../../context/AuthContext';
import { Pencil, Trash2, X, Check } from 'lucide-react';
import ConfirmationModal from '../../../components/ConfirmationModal';

const ReviewSection = ({ productId, onRatingUpdate }) => {
    const { token, user } = useAuth(); // Get the token to verify if they can review

    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editData, setEditData] = useState({ rating: 5, comment: '' });
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: null,
        isAlert: true
    });

    const handleOpenModal = (title, message, type = 'info', onConfirm = null, isAlert = true) => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            type,
            onConfirm,
            isAlert
        });
    };

    const handleCloseModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    // 1. Fetch Reviews & Check Permission
    useEffect(() => {
        if (reviews.length > 0 && user) {
            console.log("Review Ownership Debug:", {
                currentUser: user,
                sampleReview: reviews[0],
                userIdMatch: reviews[0].userId === user.id || reviews[0].UserId === user.Id || reviews[0].userId === user.Id || reviews[0].UserId === user.id,
                nameMatch: reviews[0].userName === user.fullName || reviews[0].userName === user.userName || reviews[0].userName === user.username
            });
        }
    }, [reviews, user]);

    useEffect(() => {
        const fetchData = async () => {
            if (!productId) return;

            try {
                // A. Get Public Reviews
                const response = await fetch(`${API_BASE_URL}/api/Reviews/${productId}`);
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);

                    // Calculate Average
                    if (data.length > 0) {
                        const sum = data.reduce((acc, r) => acc + r.rating, 0);
                        const avg = (sum / data.length).toFixed(1);
                        setAverageRating(avg);
                        if (onRatingUpdate) onRatingUpdate(avg, data.length);
                    } else {
                        setAverageRating(0);
                        if (onRatingUpdate) onRatingUpdate(0, 0);
                    }
                }

                // B. Check if Logged-in User can review (Only if they have a token)
                if (token) {
                    const permResponse = await fetch(`${API_BASE_URL}/api/Reviews/can-review/${productId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (permResponse.ok) {
                        const allowed = await permResponse.json();
                        setCanReview(allowed);
                    }
                }
            } catch (error) {
                console.error("Error loading reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productId, token]);

    // 2. Helper Functions for Edit/Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/Reviews/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setReviews(reviews.filter(r => r.id !== id));
            } else {
                handleOpenModal("Error", "Failed to delete review.", "danger");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditStart = (review) => {
        setEditingReviewId(review.id);
        setEditData({ rating: review.rating, comment: review.comment });
    };

    const handleEditSave = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/Reviews/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editData)
            });

            if (response.ok) {
                setReviews(reviews.map(r => r.id === id ? { ...r, ...editData } : r));
                setEditingReviewId(null);
            } else {
                handleOpenModal("Error", "Failed to update review.", "danger");
            }
        } catch (err) {
            console.error(err);
        }
    };

    // 3. Submit New Review
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) return handleOpenModal("Authentication Required", "You must be logged in to submit a review.", "info");

        try {
            const response = await fetch(`${API_BASE_URL}/api/Reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: productId,
                    rating: parseInt(newReview.rating),
                    comment: newReview.comment
                })
            });

            if (response.ok) {
                handleOpenModal(
                    "Success",
                    "Review submitted successfully!",
                    "success",
                    () => window.location.reload(),
                    true
                );
            } else {
                const errorMsg = await response.text();
                handleOpenModal("Error", "Error: " + errorMsg, "danger");
            }
        } catch (error) {
            console.error("Failed to submit review", error);
        }
    };

    return (
        <div className="mt-12 pt-12 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                Customer Reviews
                {reviews.length > 0 && (
                    <span className="flex items-center gap-1 text-base font-normal bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                        <Star size={16} className="fill-purple-700 text-purple-700" />
                        {averageRating} ({reviews.length})
                    </span>
                )}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* LIST REVIEWS */}
                <div className="space-y-6">
                    {loading ? (
                        <div>Loading reviews...</div>
                    ) : reviews.length === 0 ? (
                        <div className="text-gray-500 italic">No reviews yet. Be the first!</div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-gray-50 p-6 rounded-xl">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xs">
                                            {review.userName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 text-sm">{review.userName}</div>
                                            <div className="text-xs text-gray-400">{review.date}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={`${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {editingReviewId === review.id ? (
                                    <div className="space-y-4">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setEditData({ ...editData, rating: star })}
                                                    className={`p-0.5 ${editData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                                >
                                                    <Star size={16} className={editData.rating >= star ? 'fill-current' : ''} />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            value={editData.comment}
                                            onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none"
                                            rows={3}
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditSave(review.id)}
                                                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-md hover:bg-green-700"
                                            >
                                                <Check size={14} /> Save
                                            </button>
                                            <button
                                                onClick={() => setEditingReviewId(null)}
                                                className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-md hover:bg-gray-300"
                                            >
                                                <X size={14} /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                                        {/* Ownership check - robust check using both userId and userName with fallbacks */}
                                        {(
                                            (review.userId && user?.id && String(review.userId) === String(user.id)) ||
                                            (review.UserId && user?.Id && String(review.UserId) === String(user.Id)) ||
                                            (review.userId && user?.Id && String(review.userId) === String(user.Id)) ||
                                            (review.UserId && user?.id && String(review.UserId) === String(user.id)) ||
                                            (review.userName && user?.fullName && review.userName.trim().toLowerCase() === user.fullName.trim().toLowerCase()) ||
                                            (review.userName && user?.username && review.userName.trim().toLowerCase() === user.username.trim().toLowerCase()) ||
                                            (review.userName && user?.userName && review.userName.trim().toLowerCase() === user.userName.trim().toLowerCase()) ||
                                            (review.userName && user?.fullName && review.userName.trim() === user.fullName.trim())
                                        ) && (
                                                <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                                                    <button
                                                        onClick={() => handleEditStart(review)}
                                                        className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-purple-600 transition-colors"
                                                    >
                                                        <Pencil size={14} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(review.id)}
                                                        className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* ADD REVIEW FORM */}
                <div>
                    {canReview ? (
                        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                                className={`p-1 hover:scale-110 transition-transform ${newReview.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                            >
                                                <Star size={24} className={newReview.rating >= star ? 'fill-current' : ''} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                                    <textarea
                                        required
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition-all resize-none h-32"
                                        placeholder="How was the product?"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
                                >
                                    Submit Review
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl text-center">
                            <MessageSquare className="mx-auto text-blue-400 mb-2" size={32} />
                            <h3 className="font-bold text-blue-900 mb-1">Want to review?</h3>
                            <p className="text-blue-700 text-sm">
                                {token ? "You can only review products you have purchased." : "Please log in and purchase this item to leave a review."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={handleCloseModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                isAlert={modalConfig.isAlert}
            />
        </div>
    );
};

export default ReviewSection;