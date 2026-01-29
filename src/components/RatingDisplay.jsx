import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { API_BASE_URL } from '../config';

/**
 * A reusable component to display product ratings.
 * If initialRating is provided and valid, it uses it.
 * Otherwise, it fetches reviews for the productId and calculates the average.
 */
const RatingDisplay = ({ productId, initialRating, className = "" }) => {
    const [rating, setRating] = useState(initialRating);
    const [loading, setLoading] = useState(!initialRating && initialRating !== 0);

    useEffect(() => {
        // If we already have a rating (from product list), don't fetch
        if (initialRating !== undefined && initialRating !== null && initialRating > 0) {
            setRating(initialRating);
            setLoading(false);
            return;
        }

        const fetchRating = async () => {
            if (!productId) return;
            try {
                const response = await fetch(`${API_BASE_URL}/api/Reviews/${productId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        const sum = data.reduce((acc, r) => acc + r.rating, 0);
                        setRating((sum / data.length).toFixed(1));
                    } else {
                        setRating(0); // Mark as new/no reviews
                    }
                }
            } catch (error) {
                console.error("Error fetching rating for product:", productId, error);
            } finally {
                setLoading(false);
            }
        };

        fetchRating();
    }, [productId, initialRating]);

    if (loading) return (
        <div className={`flex items-center text-gray-400 text-xs animate-pulse ${className}`}>
            <Star className="w-3 h-3 fill-current mr-1" />
            Loading...
        </div>
    );

    return (
        <div className={`flex items-center text-yellow-500 text-sm ${className}`}>
            <Star className={`w-4 h-4 ${rating > 0 ? 'fill-current' : 'text-gray-300'}`} />
            <span className="ml-1 text-gray-600">
                {rating > 0 ? rating : "New"}
            </span>
        </div>
    );
};

export default RatingDisplay;
