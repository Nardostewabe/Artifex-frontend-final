/**
 * Purchase Service
 * 
 * This service handles tracking which products a user has purchased.
 * currently it uses localStorage to simulate a database.
 * 
 * TO CONNECT TO A REAL DATABASE:
 * 1. Modify `recordPurchase` to send a POST request to your backend (e.g., /api/orders/record).
 * 2. Modify `hasPurchased` to send a GET request to check purchase status (e.g., /api/orders/check-purchase/:productId).
 */

const STORAGE_KEY = 'artifex_purchased_products';

/**
 * Records a purchase for a list of product IDs.
 * @param {string[]} productIds - Array of product IDs purchased.
 */
export const recordPurchase = async (productIds) => {
    // SIMULATION: Saving to localStorage
    // In a real app, this would be an API call like:
    // await fetch('/api/purchases', { method: 'POST', body: JSON.stringify({ productIds }) });

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const purchased = stored ? JSON.parse(stored) : [];

        // Add new IDs without duplicates
        const updated = [...new Set([...purchased, ...productIds])];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        console.log("Purchase recorded locally:", updated);
    } catch (error) {
        console.error("Failed to record purchase locally", error);
    }
};

/**
 * Checks if a specific product has been purchased by the current user.
 * @param {string} productId - The ID of the product to check.
 * @returns {Promise<boolean>} - True if purchased, false otherwise.
 */
export const hasPurchased = async (productId) => {
    // SIMULATION: Checking localStorage
    // In a real app, this would be an API call.

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return false;

        const purchased = JSON.parse(stored);
        return purchased.includes(productId);
    } catch (error) {
        console.error("Failed to check purchase status locally", error);
        return false;
    }
};
