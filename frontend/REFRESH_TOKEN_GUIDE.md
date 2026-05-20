# Refresh Token & Session Management Documentation

## Overview

Your application now has a production-grade refresh token system with automatic token management, session handling, and inactivity timeouts. This prevents unexpected logouts and improves user experience.

## What Was Fixed

### 1. **Proactive Token Refresh** ✅
- **Before**: Only refreshed on 401 errors (reactive)
- **Now**: Automatically refreshes 5 minutes before token expiry (proactive)
- **Benefit**: Users stay logged in seamlessly

### 2. **Token Expiry Tracking** ✅
- **Before**: No expiry information stored
- **Now**: Stores expiry timestamp with every token
- **Benefit**: System knows exactly when tokens will expire

### 3. **Automatic Session Management** ✅
- **Before**: No inactivity timeout
- **Now**: Auto-logout after 30 minutes of inactivity (configurable)
- **Benefit**: Better security, prevents unauthorized access

### 4. **Tab Visibility Awareness** ✅
- **Before**: No handling when tab becomes active
- **Now**: Checks token freshness when user switches tabs
- **Benefit**: Handles multi-tab scenarios gracefully

### 5. **Proper Error Handling** ✅
- **Before**: Refresh failures weren't logged out
- **Now**: Auto-logout on refresh failure
- **Benefit**: Prevents stuck authentication states

## Architecture

```
┌─────────────────────────────────────────┐
│         User Makes API Request          │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│   fetchBaseQueryWithReauth Interceptor  │
│   ✓ Check if token needs refresh        │
│   ✓ Proactively refresh if <5min left   │
│   ✓ Handle 401 errors with retry        │
└─────────────────┬───────────────────────┘
                  │
          ┌───────┴────────┐
          ▼                ▼
    TOKEN VALID    NEEDS REFRESH
          │             │
          │             ▼
          │      ┌──────────────────┐
          │      │ TokenManager API │
          │      │ • setAccessToken │
          │      │ • refresh logic  │
          │      └────────┬─────────┘
          │               │
          ▼               ▼
    ┌─────────────────────────────┐
    │   Make API Request          │
    │   (with valid token)        │
    └─────────────────────────────┘
```

## Key Components

### 1. **TokenManager** (`src/utils/tokenManager.js`)
Utility for token operations with built-in validation and expiry checks.

```javascript
import TokenManager from "@/utils/tokenManager";

// Check if token is valid
TokenManager.isTokenValid(); // true/false

// Get time until expiry
TokenManager.getTimeUntilExpiry(); // milliseconds

// Check if refresh needed
TokenManager.shouldRefreshToken(); // true/false

// Set tokens from auth response
TokenManager.setTokens(response); // Handles both access & refresh

// Clear tokens on logout
TokenManager.clearAllTokens();
```

### 2. **Auto Refresh Hook** (`src/hooks/useAutoRefresh.js`)
Handles periodic token refresh based on expiry time.

```javascript
import useAutoRefresh from "@/hooks/useAutoRefresh";

// Use in your layout or provider
export default function RootLayout({ children }) {
  useAutoRefresh(); // Automatically refreshes tokens as needed
  return <>{children}</>;
}
```

**Features:**
- ✅ Refreshes 5 minutes before token expires
- ✅ Respects tab visibility (only checks when tab is active)
- ✅ Handles multiple tab scenarios
- ✅ Auto-logs out on refresh failure

### 3. **Session Management Hook** (`src/hooks/useSessionManagement.js`)
Tracks user activity and auto-logs out after inactivity.

```javascript
import useSessionManagement from "@/hooks/useSessionManagement";

export default function Dashboard() {
  const { extendSession, getTimeUntilLogout } = useSessionManagement({
    inactivityTimeout: 30 * 60 * 1000, // 30 minutes
    warningTime: 5 * 60 * 1000,        // Warn 5 min before logout
  });

  // Listen for session warning
  useEffect(() => {
    const handleWarning = (e) => {
      showModal("Your session is about to expire. Click to stay logged in.");
    };
    window.addEventListener("sessionWarning", handleWarning);
    return () => window.removeEventListener("sessionWarning", handleWarning);
  }, []);

  return <div>Dashboard</div>;
}
```

### 4. **Updated Auth Slice** (`src/redux/services/auth/authSlice.js`)
Enhanced Redux state management for authentication.

```javascript
import { logoutUser, setAuthLoading, setAuthError } from "@/redux/services/auth/authSlice";

// Dispatch actions
dispatch(logoutUser());           // Complete logout + token cleanup
dispatch(setAuthError("Invalid")); // Show errors to user
dispatch(clearAuthError());        // Clear error messages
```

### 5. **Fetch Base Query** (`src/redux/services/fetchBaseQueryWithReauth.js`)
The core interceptor that handles all API requests with token management.

**What it does:**
- ✅ Proactively refreshes tokens before expiry
- ✅ Retries failed requests after refresh
- ✅ Handles race conditions (multiple requests triggering refresh)
- ✅ Queues pending requests during refresh
- ✅ Auto-logs out on refresh failure
- ✅ Skips token handling for auth endpoints

## Token Flow Diagram

```
LOGIN
  │
  ├─► API returns: { access, refresh, expires_in }
  │
  ├─► TokenManager.setTokens(response)
  │     ├─ Stores access token in cookie
  │     ├─ Calculates expiry: now + expires_in
  │     └─ Stores expiry timestamp
  │
  ├─► useAutoRefresh hook activated
  │     └─ Calculates refresh time = expiry - 5 minutes
  │
  └─► User is authenticated ✓

DURING SESSION
  │
  ├─ User makes API requests
  │   └─► fetchBaseQueryWithReauth checks:
  │       ├─ Is token expired?
  │       ├─ Is token expiring soon (<5 min)?
  │       └─ If yes → call /accounts/refresh
  │
  ├─ Token refresh triggers
  │   └─► API returns new { access, refresh }
  │       └─► TokenManager updates tokens
  │           └─► Original request retried with new token ✓
  │
  └─ Tab visibility changes
      └─► Check token freshness on tab focus
          ├─ If expired → log out
          └─ If expiring soon → refresh now

LOGOUT
  │
  ├─► useLogoutMutation() called
  │   ├─ Calls /accounts/logout endpoint
  │   └─ TokenManager.clearAllTokens()
  │
  ├─► logoutUser() action dispatched
  │   ├─ Clears Redux auth state
  │   └─ Removes all auth cookies
  │
  └─► User redirected to /login ✓
```

## Configuration

### Token Expiry Time
In your backend response, include `expires_in` (seconds):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "expires_in": 3600
}
```

### Refresh Timeout
Edit `src/hooks/useAutoRefresh.js`:
```javascript
const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, ...);
//                              ↑ Change 5 min to desired buffer
```

### Inactivity Timeout
Edit where you use `useSessionManagement`:
```javascript
useSessionManagement({
  inactivityTimeout: 30 * 60 * 1000,  // 30 minutes
  warningTime: 5 * 60 * 1000,         // Warn 5 min before
  checkInterval: 60 * 1000,           // Check every 1 min
});
```

## Usage Examples

### Example 1: Complete Login Flow
```javascript
import { useLoginMutation } from "@/redux/services/auth/authApi";
import TokenManager from "@/utils/tokenManager";

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (credentials) => {
    try {
      const response = await login(credentials).unwrap();
      // TokenManager automatically sets tokens via onQueryStarted
      // useAutoRefresh hook is automatically monitoring
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin(formData);
    }}>
      {/* Login form */}
    </form>
  );
}
```

### Example 2: Protected Component with Session Warning
```javascript
import useSessionManagement from "@/hooks/useSessionManagement";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { extendSession, getTimeUntilLogout } = useSessionManagement();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const handleWarning = (event) => {
      setShowWarning(true);
      // Warn user that session is expiring
    };
    
    window.addEventListener("sessionWarning", handleWarning);
    return () => window.removeEventListener("sessionWarning", handleWarning);
  }, []);

  const handleStayLoggedIn = () => {
    extendSession();
    setShowWarning(false);
  };

  return (
    <div>
      {showWarning && (
        <Modal>
          <p>Your session is about to expire.</p>
          <button onClick={handleStayLoggedIn}>Stay Logged In</button>
          <button onClick={() => logout()}>Logout</button>
        </Modal>
      )}
      {/* Dashboard content */}
    </div>
  );
}
```

### Example 3: Token Debugging
```javascript
import TokenManager from "@/utils/tokenManager";

// Check token status anytime
const tokenInfo = TokenManager.getTokenInfo();
console.log(tokenInfo);
// {
//   hasAccessToken: true,
//   hasRefreshToken: true,
//   isExpired: false,
//   expiryTime: "2024-05-17T15:30:00.000Z",
//   timeUntilExpiry: 1800000,
//   shouldRefresh: false
// }

// Validate before use
const validation = TokenManager.validateToken();
console.log(validation);
// { valid: true, reason: "Token is valid" }
```

## Testing the Refresh Token System

### Test 1: Proactive Refresh
1. Log in to your app
2. Open browser DevTools → Application → Cookies
3. Note the `access_token_expiry` value
4. Wait (or modify expiry to test sooner)
5. Check network tab - should see automatic refresh request
6. ✅ If refresh happens before expiry → working correctly

### Test 2: Tab Switching
1. Log in and keep app open
2. Switch to another tab for 5+ minutes
3. Switch back to your app tab
4. Check if token is fresh in cookies
5. ✅ If fresh token exists → tab visibility handling works

### Test 3: Inactivity Timeout
1. Log in to your app
2. Don't interact (no mouse/keyboard) for 30 minutes
3. After 5 minutes should get warning (event)
4. After 30 minutes should be logged out
5. ✅ If auto-logged out → inactivity handling works

### Test 4: Refresh Failure
1. Log in successfully
2. Invalidate refresh token on backend (test endpoint)
3. Wait for token to expire or trigger refresh
4. Check if user is logged out
5. ✅ If logged out on refresh failure → error handling works

## Backend Requirements

Your backend `/accounts/refresh` endpoint should:

```python
# Expected request
POST /accounts/refresh
Cookie: refresh_token=<value>

# Expected response (success)
{
  "access": "new_access_token",
  "refresh": "new_refresh_token",  # Optional
  "expires_in": 3600
}

# Expected response (failure)
HTTP 401
```

Ensure:
- ✅ Refresh token is sent/expected via cookies (httpOnly recommended)
- ✅ Returns new access token in response
- ✅ Returns expiry time in seconds
- ✅ Returns 401 if refresh token is invalid/expired
- ✅ Rotates refresh token for security

## Security Best Practices

1. **Use httpOnly Cookies** (Backend)
   ```python
   response.set_cookie('refresh_token', token, httpOnly=True, secure=True)
   ```

2. **Enable CSRF Protection** (Backend)
   ```python
   # Include CSRF token in login response
   csrf_token = generate_csrf_token()
   ```

3. **Set Secure Cookie Flags** (Frontend - automatic)
   - `secure=true` (HTTPS only)
   - `sameSite=Lax` (CSRF protection)
   - `path=/` (all paths)

4. **Token Rotation**
   - Backend rotates refresh token on each refresh
   - Invalidates old token to prevent replay attacks

5. **Short Access Token Lifetime**
   - Set to 1 hour (3600 seconds)
   - Reduces damage if token is compromised

## Troubleshooting

### Issue: Still getting logged out
**Solution:**
- Check if `expires_in` is returned from backend
- Verify token expiry is being stored correctly:
  ```javascript
  console.log(TokenManager.getTokenInfo());
  ```
- Check if refresh endpoint is responding correctly

### Issue: Constant refresh requests
**Solution:**
- Increase `expires_in` from backend
- Check if refresh endpoint is failing (should see 401 errors)
- Verify backend is returning valid tokens

### Issue: Lost tokens on page refresh
**Solution:**
- This is normal - tokens are in cookies which persist
- If lost, user needs to login again
- Check if cookies are being set with correct flags

### Issue: Multiple tabs causing issues
**Solution:**
- Already handled by new system
- Each tab independently manages its own refresh
- No coordination needed between tabs

## Monitoring & Logging

The system logs important events:

```javascript
// Token auto-refresh successful
"✓ Token auto-refreshed successfully"

// Token refresh failed (will logout)
"✗ Auto-refresh failed: [error]"

// Session warning (inactivity approaching)
window.dispatchEvent(new CustomEvent("sessionWarning", ...))
```

Monitor these in your error tracking service (Sentry, LogRocket, etc.)

## Migration from Old System

If you were manually handling tokens:

**Old way:**
```javascript
// Manual refresh handling
const handleResponse = (response) => {
  if (response.status === 401) {
    // Manually refresh...
  }
};
```

**New way:**
```javascript
// Automatic - just add hook to layout
import useAutoRefresh from "@/hooks/useAutoRefresh";

export default function RootLayout() {
  useAutoRefresh(); // That's it!
  return <>{children}</>;
}
```

## Additional Resources

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Session Handling Security](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/README)
- [Redux Toolkit Query Docs](https://redux-toolkit.js.org/rtk-query/overview)

---

**Last Updated:** May 17, 2026  
**Status:** Production Ready ✅
