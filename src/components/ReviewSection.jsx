import React, { useState, useEffect } from 'react';
import { Star, User, MessageSquare } from 'lucide-react';
import { hasPurchased } from '../services/purchaseService';

const ReviewSection = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [averageRating, setAverageRating] = useState(0);

    // Load reviews and check purchase status
    useEffect(() => {
        // 1. Load Reviews
        const loadReviews = () => {
            try {
                const stored = localStorage.getItem(`reviews_${productId}`);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setReviews(parsed);

                    // Calculate Average
                    if (parsed.length > 0) {
                        const sum = parsed.reduce((acc, r) => acc + r.rating, 0);
                        setAverageRating((sum / parsed.length).toFixed(1));
                    }
                }
            } catch (error) {
                console.error("Failed to load reviews", error);
            }
        };

        // 2. Check Permission
        const checkPermission = async () => {
            const purchased = await hasPurchased(productId);
            setCanReview(purchased);
        };

        if (productId) {
            loadReviews();
            checkPermission();
        }
    }, [productId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const review = {
            id: Date.now(),
            user: "Verified Buyer", // Mock User
            date: new Date().toLocaleDateString(),
            rating: parseInt(newReview.rating),
            comment: newReview.comment
        };

        const updatedReviews = [review, ...reviews];

        // Save to LocalStorage
        localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));

        setReviews(updatedReviews);
        setNewReview({ rating: 5, comment: '' }); // Reset form

        // Recalculate Average
        const sum = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
        setAverageRating((sum / updatedReviews.length).toFixed(1));
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
                    {reviews.length === 0 ? (
                        <div className="text-gray-500 italic">No reviews yet.</div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-gray-50 p-6 rounded-xl">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xs">
                                            {review.user.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 text-sm">{review.user}</div>
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
                                                className={`p-1 hover:scale-110 transition-transform ${newReview.rating >= star ? 'text-yellow-400' : 'text-gray-300'
                                                    }`}
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
                            <h3 className="font-bold text-blue-900 mb-1">Have you bought this?</h3>
                            <p className="text-blue-700 text-sm">Purchase this item to leave a review.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;
