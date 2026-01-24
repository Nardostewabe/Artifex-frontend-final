import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '../../../config'; // Ensure this path is correct for your project
import { useAuth } from '../../../context/AuthContext'; // Ensure this path is correct

const ReviewSection = ({ productId }) => {
    const { token } = useAuth(); // Get the token to verify if they can review

    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Reviews & Check Permission
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
                        setAverageRating((sum / data.length).toFixed(1));
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

    // 2. Submit New Review
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) return alert("You must be logged in.");

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
                alert("Review submitted!");
                window.location.reload(); // Reload to show the new review
            } else {
                const errorMsg = await response.text();
                alert("Error: " + errorMsg);
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
                                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
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
        </div>
    );
};

export default ReviewSection;