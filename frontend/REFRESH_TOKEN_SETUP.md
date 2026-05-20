# Refresh Token System - Setup & Integration Checklist

## ✅ Completed Changes

- [x] **fetchBaseQueryWithReauth.js** - Implemented proactive token refresh with exponential backoff
- [x] **authSlice.js** - Enhanced Redux state with loading/error states and proper cleanup
- [x] **authApi.js** - Added token handling in mutation callbacks with secure cookie options
- [x] **useAutoRefresh.js** - Smart token refresh based on expiry with tab visibility handling
- [x] **useSessionManagement.js** - Inactivity tracking and auto-logout (30 min default)
- [x] **tokenManager.js** - Utility for all token operations with validation
- [x] **middleware.js** - Updated with token expiry checking on server side
- [x] **REFRESH_TOKEN_GUIDE.md** - Complete documentation with examples

## 📋 Integration Steps

### Step 1: Verify Your Backend Returns Token Expiry ✅

**Required Response Format for Login/Refresh:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "expires_in": 3600
}
```

**Check your backend:**
```bash
# Test login endpoint
curl -X POST http://localhost:8000/api/accounts/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Should return above format
```

### Step 2: Enable Auto Refresh in Your Layout ✅

**File:** `src/app/layout.js`

```javascript
import AutoRefreshProvider from "@/hooks/AutoRefreshProvider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AutoRefreshProvider>
          {/* Your app components */}
          {children}
        </AutoRefreshProvider>
      </body>
    </html>
  );
}
```

**What this does:**
- Monitors token expiry
- Auto-refreshes 5 minutes before expiry
- Handles tab visibility changes
- Auto-logs out on refresh failure

### Step 3: Add Session Management (Optional) ✅

**File:** `src/app/dashboard/layout.js` (or any protected page)

```javascript
"use client";

import useSessionManagement from "@/hooks/useSessionManagement";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }) {
  const { extendSession } = useSessionManagement({
    inactivityTimeout: 30 * 60 * 1000,  // 30 minutes
    warningTime: 5 * 60 * 1000,         // Warn 5 min before logout
  });

  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const handleWarning = (event) => {
      setShowWarning(true);
      console.log("Session expiring soon due to inactivity");
    };

    window.addEventListener("sessionWarning", handleWarning);
    return () => window.removeEventListener("sessionWarning", handleWarning);
  }, []);

  return (
    <>
      {showWarning && (
        <div className="session-warning-modal">
          <div className="warning-content">
            <p>Your session is about to expire due to inactivity.</p>
            <button 
              onClick={() => {
                extendSession();
                setShowWarning(false);
              }}
              className="btn-primary"
            >
              Stay Logged In
            </button>
            <button 
              onClick={() => window.location.href = "/login"}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
```

### Step 4: Update Your Login Component ✅

**File:** `src/app/login/page.jsx` (example)

```javascript
"use client";

import { useLoginMutation } from "@/redux/services/auth/authApi";
import { useDispatch } from "react-redux";
import { setAuth, setUserId, setRole } from "@/redux/services/auth/authSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await login({
        email: e.target.email.value,
        password: e.target.password.value,
      }).unwrap();

      // Set Redux state (tokens are handled automatically)
      dispatch(setAuth(true));
      dispatch(setUserId(response.user.id));
      dispatch(setRole(response.user.role));

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      // Show error to user
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      {error && <p className="error">{error.data?.detail}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

### Step 5: Update Your Logout Component ✅

**File:** `src/components/Header.jsx` (example)

```javascript
"use client";

import { useLogoutMutation } from "@/redux/services/auth/authApi";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/redux/services/auth/authSlice";
import { useRouter } from "next/navigation";

export default function Header() {
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call logout endpoint
      await logout().unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear Redux state (tokens cleared by API callback)
      dispatch(logoutUser());
      
      // Redirect to login
      router.push("/login");
    }
  };

  return (
    <header>
      {/* Your header content */}
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
}
```

## 🧪 Testing Checklist

### Test 1: Basic Login/Logout Flow
- [ ] User can login successfully
- [ ] Tokens are stored in cookies
- [ ] User can access protected pages
- [ ] User can logout successfully
- [ ] Tokens are cleared on logout
- [ ] User redirected to login page

### Test 2: Automatic Token Refresh
- [ ] Open DevTools → Application → Cookies
- [ ] Note the `access_token_expiry` time
- [ ] Wait for token to get close to expiry
- [ ] Check Network tab for `/accounts/refresh` request
- [ ] Token should be refreshed before expiry
- [ ] User stays logged in without manual action

### Test 3: Tab Switching
- [ ] Login and keep app open in Tab A
- [ ] Switch to Tab B for 5+ minutes
- [ ] Switch back to Tab A
- [ ] App should still work without logout
- [ ] Check if new token was fetched on tab focus

### Test 4: Inactivity Timeout
- [ ] Login successfully
- [ ] Don't interact with app for 5 minutes
- [ ] Should see session warning
- [ ] Don't interact for 30 minutes total
- [ ] Should be automatically logged out

### Test 5: Manual Refresh Trigger
- [ ] Add debug button to manually call `refresh()`
- [ ] Click it and verify new token received
- [ ] Check that token expiry was updated
- [ ] Verify no errors in console

### Test 6: Error Handling
- [ ] Invalidate refresh token on backend
- [ ] Make a request that triggers refresh
- [ ] Verify user is logged out
- [ ] Verify redirected to login page

### Test 7: Multiple Requests
- [ ] While token is refreshing, make 3-4 API requests
- [ ] All requests should be queued
- [ ] After refresh, all requests should succeed
- [ ] No duplicate requests should be made

## 🔍 Debugging Commands

### Check Token Status
```javascript
// In browser console
import TokenManager from "@/utils/tokenManager";
TokenManager.getTokenInfo();
```

Output example:
```javascript
{
  hasAccessToken: true,
  hasRefreshToken: true,
  isExpired: false,
  expiryTime: "2024-05-17T16:30:00.000Z",
  timeUntilExpiry: 1800000,
  shouldRefresh: false
}
```

### Monitor Refresh Events
```javascript
// In browser console
const originalWarn = console.warn;
window.addEventListener("beforeunload", () => {
  console.log("Current token status:", TokenManager.getTokenInfo());
});
```

### Check Cookies
```javascript
// In browser console
document.cookie
// Output: "access_token=...; refresh_token=...; access_token_expiry=..."
```

### Monitor Network Requests
1. Open DevTools → Network tab
2. Filter by `/refresh` endpoint
3. You should see periodic refresh requests
4. Check response contains new `access` token

## 📊 Common Issues & Solutions

### Issue: "Still getting logged out after 30 minutes"

**Solution 1: Check expires_in**
```javascript
// In login API response, verify:
{
  "access": "...",
  "expires_in": 3600  // Must be present
}
```

**Solution 2: Verify hook is active**
```javascript
// In layout.js
import AutoRefreshProvider from "@/hooks/AutoRefreshProvider";

export default function RootLayout({ children }) {
  return (
    <AutoRefreshProvider>  {/* Add this if missing */}
      {children}
    </AutoRefreshProvider>
  );
}
```

### Issue: "Refresh requests happening too frequently"

**Solution:**
- This might be normal if token lifetime is short
- Check backend `expires_in` value
- Increase to 1-2 hours if appropriate
- Check if 5-minute buffer is too aggressive

### Issue: "Tokens lost after page refresh"

**Solution:**
- This is expected - user needs to login again
- Tokens are stored in cookies which are persistent
- Might indicate cookies aren't being saved
- Check cookie settings in localStorage/sessionStorage

### Issue: "Getting 401 errors after refresh"

**Solution:**
- Check backend `/accounts/refresh` endpoint
- Verify it returns valid `access` token
- Check CORS settings if making cross-origin requests
- Verify refresh token hasn't expired

## 🚀 Advanced Configuration

### Adjust Refresh Buffer Time
**File:** `src/hooks/useAutoRefresh.js`

```javascript
// Refresh 3 minutes before expiry instead of 5
const refreshTime = Math.max(timeUntilExpiry - 3 * 60 * 1000, 60 * 1000);
```

### Adjust Inactivity Timeout
**File:** Where you use `useSessionManagement`

```javascript
useSessionManagement({
  inactivityTimeout: 60 * 60 * 1000,  // 1 hour
  warningTime: 10 * 60 * 1000,        // Warn 10 min before
  checkInterval: 30 * 1000,           // Check every 30 sec
});
```

### Custom Token Validation
**File:** Create `src/utils/tokenValidator.js`

```javascript
import TokenManager from "@/utils/tokenManager";

export function canMakeRequest() {
  const validation = TokenManager.validateToken();
  
  if (!validation.valid) {
    console.warn("Token invalid:", validation.reason);
    return false;
  }
  
  return true;
}

// Use in protected API calls
if (canMakeRequest()) {
  // Make API call
}
```

## 📝 Backend Requirements

Your backend must implement:

### 1. Login Endpoint
```
POST /accounts/login
Body: { email, password }
Response: { access, refresh, expires_in, user }
```

### 2. Refresh Endpoint
```
POST /accounts/refresh
Cookie: refresh_token=<value>
Response: { access, refresh, expires_in }
```

### 3. Logout Endpoint
```
POST /accounts/logout
Cookie: refresh_token=<value>
Response: { success: true }
```

### 4. Profile Endpoint (Protected)
```
GET /accounts/profile
Headers: Authorization: Bearer <access_token>
Response: { user }
```

## ✨ What's New

| Feature | Before | After |
|---------|--------|-------|
| Token Refresh | Only on 401 error | Proactive (5 min before expiry) |
| Expiry Tracking | ❌ None | ✅ Automatic tracking |
| Tab Switching | ❌ Could lose session | ✅ Seamless handling |
| Inactivity Logout | ❌ Never auto-logout | ✅ After 30 min (configurable) |
| Error Recovery | ❌ Stuck state | ✅ Auto-logout on failure |
| Race Conditions | ❌ Multiple refreshes | ✅ Queue requests during refresh |
| User Experience | Sudden logouts | Seamless sessions |

## 📞 Support

If you encounter issues:

1. Check [REFRESH_TOKEN_GUIDE.md](./REFRESH_TOKEN_GUIDE.md) for detailed docs
2. Review your backend endpoint responses
3. Check browser console for error messages
4. Verify cookies are being set in Application tab
5. Monitor Network tab for refresh requests

## 🎯 Next Steps

1. ✅ Integrate with your login page
2. ✅ Test automatic token refresh
3. ✅ Add session warning modal
4. ✅ Monitor logs in production
5. ✅ Adjust timeouts based on user feedback

---

**Status:** Ready to use  
**Last Updated:** May 17, 2026  
**Version:** 1.0.0
