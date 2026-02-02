import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const prevUserRef = useRef(user);

    // Initial Load based on User
    useEffect(() => {
        const storageKey = user ? `cartItems_${user.id || user.uid}` : 'cartItems_guest';
        try {
            const stored = localStorage.getItem(storageKey);
            setCartItems(stored ? JSON.parse(stored) : []);
        } catch (error) {
            console.error("Failed to load cart", error);
            setCartItems([]);
        }
    }, [user?.id, user?.uid]);

    // Save on Change
    useEffect(() => {
        const storageKey = user ? `cartItems_${user.id || user.uid}` : 'cartItems_guest';
        if (cartItems.length > 0 || localStorage.getItem(storageKey)) {
            localStorage.setItem(storageKey, JSON.stringify(cartItems));
        }
    }, [cartItems, user?.id, user?.uid]);

    // Handle Login Migration and Logout Clear
    useEffect(() => {
        // Transition from Guest to User (Login)
        if (!prevUserRef.current && user) {
            const guestCart = JSON.parse(localStorage.getItem('cartItems_guest') || '[]');
            if (guestCart.length > 0) {
                setCartItems(prev => {
                    // Merge guest cart into user cart, avoiding duplicates
                    const merged = [...prev];
                    guestCart.forEach(guestItem => {
                        const existingIdx = merged.findIndex(item =>
                            item.id === guestItem.id &&
                            item.selectedColor === guestItem.selectedColor &&
                            item.selectedSize === guestItem.selectedSize
                        );
                        if (existingIdx > -1) {
                            merged[existingIdx].quantity += guestItem.quantity;
                        } else {
                            merged.push(guestItem);
                        }
                    });
                    return merged;
                });
                // Optional: Clear guest cart after migration
                localStorage.removeItem('cartItems_guest');
            }
        }

        // Transition from User to Guest (Logout)
        if (prevUserRef.current && !user) {
            setCartItems([]); // Clear in-memory cart
        }

        prevUserRef.current = user;
    }, [user]);

    const addToCart = (product, selectedColor = null, selectedSize = null, quantity = 1) => {
        setCartItems(prev => {
            // Create a unique key based on product ID and customization options
            const existing = prev.find(item =>
                item.id === product.id &&
                item.selectedColor === selectedColor &&
                item.selectedSize === selectedSize
            );

            if (existing) {
                // If exact match (same product with same customizations), increase quantity
                return prev.map(item =>
                    item.id === product.id &&
                        item.selectedColor === selectedColor &&
                        item.selectedSize === selectedSize
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            // Add as new item with customization options
            return [...prev, {
                ...product,
                quantity,
                selectedColor,
                selectedSize,
                // Create a unique cart item ID for items with different customizations
                cartItemId: `${product.id}-${selectedColor || 'none'}-${selectedSize || 'none'}-${Date.now()}`
            }];
        });
    };

    const removeFromCart = (cartItemId) => {
        setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
    };

    const updateQuantity = (cartItemId, quantity) => {
        if (quantity < 1) return;
        setCartItems(prev => prev.map(item =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
