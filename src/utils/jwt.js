/**
 * Decodes a JWT token manually to avoid external dependencies.
 * @param {string} token - The JWT token to decode.
 * @returns {object|null} - The decoded payload or null if invalid.
 */
export const decodeToken = (token) => {
    try {
        if (!token) return null;

        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid token format');
        }

        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // Decode base64
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};
