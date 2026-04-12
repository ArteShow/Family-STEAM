/**
 * ─────────────────────────────────────────────────────────────────────────
 * Cookie Management Utilities
 * Production-ready cookie helper for Family STEAM
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * Usage:
 *   CookieManager.set('name', 'value', 365)  → sets cookie for 365 days
 *   CookieManager.get('name')                 → retrieves cookie value
 *   CookieManager.remove('name')              → removes cookie
 *   CookieManager.exists('name')              → checks if cookie exists
 */

window.CookieManager = {
    /**
     * Set a cookie with optional expiry in days and optional path
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value (will be URL encoded)
     * @param {number} days - Expiry in days (default: 365)
     * @param {string} path - Cookie path (default: '/')
     */
    set: function (name, value, days, path) {
        if (typeof document === 'undefined') return; // SSR check

        days = days || 365;
        path = path || '/';

        try {
            var expiryDate = new Date();
            expiryDate.setTime(expiryDate.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = 'expires=' + expiryDate.toUTCString();
            var encodedValue = encodeURIComponent(value);
            document.cookie = name + '=' + encodedValue + '; ' + expires + '; path=' + path + '; SameSite=Lax';

            if (window.__DEV__) {
                console.log('[CookieManager] Set cookie:', { name: name, value: value, days: days });
            }
        } catch (e) {
            console.error('[CookieManager] Error setting cookie:', e);
        }
    },

    /**
     * Get cookie value by name
     * @param {string} name - Cookie name
     * @returns {string|null} Cookie value or null if not found
     */
    get: function (name) {
        if (typeof document === 'undefined') return null; // SSR check

        try {
            var nameEQ = name + '=';
            var cookies = document.cookie.split(';');

            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.indexOf(nameEQ) === 0) {
                    var value = cookie.substring(nameEQ.length);
                    return decodeURIComponent(value);
                }
            }
            return null;
        } catch (e) {
            console.error('[CookieManager] Error reading cookie:', e);
            return null;
        }
    },

    /**
     * Remove a cookie
     * @param {string} name - Cookie name
     */
    remove: function (name) {
        if (typeof document === 'undefined') return; // SSR check

        try {
            this.set(name, '', -1);
            if (window.__DEV__) {
                console.log('[CookieManager] Removed cookie:', name);
            }
        } catch (e) {
            console.error('[CookieManager] Error removing cookie:', e);
        }
    },

    /**
     * Check if a cookie exists
     * @param {string} name - Cookie name
     * @returns {boolean} True if cookie exists
     */
    exists: function (name) {
        return this.get(name) !== null;
    },

    /**
     * Clear all cookies (careful!)
     */
    clearAll: function () {
        if (typeof document === 'undefined') return; // SSR check

        try {
            document.cookie.split(';').forEach(function (c) {
                var nameEQ = c.split('=')[0].trim() + '=';
                CookieManager.remove(nameEQ.slice(0, -1));
            });
        } catch (e) {
            console.error('[CookieManager] Error clearing all cookies:', e);
        }
    }
};

// Debug mode for development (set window.__DEV__ = true in console)
if (typeof window !== 'undefined' && !window.__DEV__) {
    window.__DEV__ = false;
}
