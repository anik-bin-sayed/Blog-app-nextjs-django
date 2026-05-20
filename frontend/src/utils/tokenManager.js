import Cookies from "js-cookie";
import { clientCookieOptions } from "@/utils/cookieOptions";

/**
 * Secure Token Manager
 * Handles all token operations with proper expiry management
 */
const TokenManager = {
  /**
   * Token keys
   */
  KEYS: {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    ACCESS_TOKEN_EXPIRY: "access_token_expiry",
  },

  /**
   * Cookie options for secure storage
   */
  COOKIE_OPTIONS: clientCookieOptions,

  /**
   * Set access token with expiry
   * @param {string} token - The access token
   * @param {number} expiresIn - Time in seconds until expiry
   */
  setAccessToken(token, expiresIn = 3600) {
    if (!token) return;
    const expiryTime = Date.now() + expiresIn * 1000;
    Cookies.set(this.KEYS.ACCESS_TOKEN, token, this.COOKIE_OPTIONS);
    Cookies.set(this.KEYS.ACCESS_TOKEN_EXPIRY, expiryTime.toString(), {
      ...this.COOKIE_OPTIONS,
      // Don't expose expiry time in client JS if possible
      secure: true,
    });
  },

  /**
   * Set refresh token
   * @param {string} token - The refresh token
   */
  setRefreshToken(token) {
    if (!token) return;
    Cookies.set(this.KEYS.REFRESH_TOKEN, token, this.COOKIE_OPTIONS);
  },

  /**
   * Set tokens from auth response
   * @param {object} response - Response containing access, refresh, and expires_in
   */
  setTokens(response) {
    if (response?.access) {
      this.setAccessToken(response.access, response.expires_in || 3600);
    }
    if (response?.refresh) {
      this.setRefreshToken(response.refresh);
    }
  },

  /**
   * Get access token
   */
  getAccessToken() {
    return Cookies.get(this.KEYS.ACCESS_TOKEN);
  },

  /**
   * Get refresh token
   */
  getRefreshToken() {
    return Cookies.get(this.KEYS.REFRESH_TOKEN);
  },

  /**
   * Check if access token exists
   */
  hasAccessToken() {
    return !!this.getAccessToken();
  },

  /**
   * Check if refresh token exists
   */
  hasRefreshToken() {
    return !!this.getRefreshToken();
  },

  /**
   * Get token expiry time in milliseconds
   */
  getTokenExpiry() {
    const expiry = Cookies.get(this.KEYS.ACCESS_TOKEN_EXPIRY);
    return expiry ? parseInt(expiry) : null;
  },

  /**
   * Get time until token expiry in milliseconds
   */
  getTimeUntilExpiry() {
    const expiry = this.getTokenExpiry();
    if (!expiry) return null;
    return expiry - Date.now();
  },

  /**
   * Check if access token is expired
   */
  isAccessTokenExpired() {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    return Date.now() > expiry;
  },

  /**
   * Check if token is valid (not expired)
   */
  isTokenValid() {
    return this.hasAccessToken() && !this.isAccessTokenExpired();
  },

  /**
   * Check if token should be refreshed proactively
   * @param {number} bufferMs - Buffer time before expiry in milliseconds (default 5 min)
   */
  shouldRefreshToken(bufferMs = 5 * 60 * 1000) {
    const timeUntilExpiry = this.getTimeUntilExpiry();
    if (timeUntilExpiry === null) return true;
    return timeUntilExpiry < bufferMs;
  },

  /**
   * Whether the user has an active session (auth cookie from login flow)
   */
  isAuthenticated() {
    return Cookies.get("auth") === "true";
  },

  /**
   * Only refresh when logged in and token is missing expiry or near expiry
   */
  shouldAttemptRefresh(bufferMs = 5 * 60 * 1000) {
    if (!this.isAuthenticated()) return false;
    return this.shouldRefreshToken(bufferMs);
  },

  /**
   * Backend sets httpOnly access_token; track expiry client-side only
   */
  markAccessTokenRefreshed(expiresIn = 15 * 60) {
    const expiryTime = Date.now() + expiresIn * 1000;
    Cookies.set(
      this.KEYS.ACCESS_TOKEN_EXPIRY,
      expiryTime.toString(),
      this.COOKIE_OPTIONS,
    );
  },

  /**
   * Clear access token
   */
  clearAccessToken() {
    Cookies.remove(this.KEYS.ACCESS_TOKEN, { path: "/" });
    Cookies.remove(this.KEYS.ACCESS_TOKEN_EXPIRY, { path: "/" });
  },

  /**
   * Clear refresh token
   */
  clearRefreshToken() {
    Cookies.remove(this.KEYS.REFRESH_TOKEN, { path: "/" });
  },

  /**
   * Clear all tokens
   */
  clearAllTokens() {
    this.clearAccessToken();
    this.clearRefreshToken();
  },

  /**
   * Get detailed token info (for debugging)
   */
  getTokenInfo() {
    const expiry = this.getTokenExpiry();
    return {
      hasAccessToken: this.hasAccessToken(),
      hasRefreshToken: this.hasRefreshToken(),
      isExpired: this.isAccessTokenExpired(),
      expiryTime: expiry ? new Date(expiry).toISOString() : null,
      timeUntilExpiry: this.getTimeUntilExpiry(),
      shouldRefresh: this.shouldRefreshToken(),
    };
  },

  /**
   * Validate token before use
   */
  validateToken() {
    if (!this.hasAccessToken()) {
      return { valid: false, reason: "No access token" };
    }

    if (this.isAccessTokenExpired()) {
      return { valid: false, reason: "Token expired" };
    }

    return { valid: true, reason: "Token is valid" };
  },
};

export default TokenManager;
