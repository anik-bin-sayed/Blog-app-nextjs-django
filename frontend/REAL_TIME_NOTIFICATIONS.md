# Real-Time Notifications - Frontend Implementation Guide

## 🚀 Setup

### Environment Variables

Create a `.env.local` file in the `frontend/` folder with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://127.0.0.1:8000
```

**For Production:**

```env
NEXT_PUBLIC_API_URL=https://your-api-domain/api
NEXT_PUBLIC_WS_URL=wss://your-api-domain
```

_Note: Use `wss://` (WebSocket Secure) for HTTPS production environments_

---

## 📦 Architecture

### Components

#### 1. **useNotifications Hook**

Location: `src/hooks/useNotifications.js`

**Features:**

- Establishes WebSocket connection
- Auto-reconnection with exponential backoff (1s → 30s)
- Heartbeat mechanism (every 30 seconds) to prevent stale connections
- Max 10 reconnection attempts
- Connection state callbacks

**Usage:**

```javascript
const { reconnect } = useNotifications(
  userId,
  setNotifications,
  onConnectionChange,
);

// onConnectionChange callback receives:
// { connected: boolean, error: null | Error }
```

#### 2. **NotificationContext**

Location: `src/hooks/NotificationContext.js`

**Global state management for:**

- Connection state
- Unread count
- Notifications list
- Methods: addNotification, markAsRead, markAllAsRead, deleteNotification

**Usage:**

```javascript
import { useNotificationContext } from "@/hooks/NotificationContext";

function MyComponent() {
  const { connectionState, unreadCount, addNotification } =
    useNotificationContext();
  // ...
}
```

#### 3. **Notifications Page**

Location: `src/app/notifications/page.jsx`

**Features:**

- Real-time notification display
- Connection status indicator
- Filter by read/unread
- Infinite scroll pagination
- Bulk actions (mark all, delete all)
- Admin-only route

---

## 🔄 Real-Time Flow

```
Backend (Django Channels)
    ↓
Notification Created → push_notification()
    ↓
Broadcast to channel group: notifications_{user_id}
    ↓
Frontend WebSocket
    ↓
useNotifications Hook receives message
    ↓
onmessage handler prepends to notifications array
    ↓
Component re-renders with new notification
```

---

## ⚙️ Reconnection Logic

**Exponential Backoff Strategy:**

- Attempt 1: Wait 1 second
- Attempt 2: Wait 1.5 seconds
- Attempt 3: Wait 2.25 seconds
- ...
- Attempt 10: Wait ~30 seconds (max)

**After 10 failed attempts:**

- Stops retrying
- Displays error message in UI
- User must refresh page to manually reconnect

---

## 🛠️ REST API Endpoints

All endpoints require authentication:

| Method | Endpoint                                       | Purpose                      |
| ------ | ---------------------------------------------- | ---------------------------- |
| GET    | `/api/notifications/`                          | List paginated notifications |
| GET    | `/api/notifications/unread-count/`             | Get unread count             |
| PATCH  | `/api/notifications/mark-all-as-read/`         | Mark all as read             |
| PATCH  | `/api/notifications/{id}/mark-as-read/`        | Mark single as read          |
| DELETE | `/api/notifications/{id}/delete-notification/` | Delete single                |
| DELETE | `/api/notifications/delete-all-notifications/` | Delete all                   |

---

## 🧪 Testing

### 1. Local Development

```bash
# Terminal 1: Backend
cd backend
python manage.py runserver

# Terminal 2: Redis (required for Channels)
redis-cli

# Terminal 3: Frontend
cd frontend
npm run dev
```

### 2. Docker

```bash
docker-compose up
```

### 3. Manual Testing

1. Open `/notifications` in browser (admin-only)
2. Create a blog/comment that triggers notifications
3. Verify real-time update appears instantly
4. Disconnect internet → verify reconnection attempts
5. Check browser console for connection logs

---

## 🐛 Troubleshooting

### "WebSocket connection failed"

- **Check:** Backend is running on `localhost:8000`
- **Check:** Django Channels is properly configured
- **Check:** `NEXT_PUBLIC_WS_URL` matches backend URL

### Real-time updates not working

- **Check:** User is authenticated
- **Check:** User ID is properly set in Redux store
- **Check:** Backend WebSocket consumer is receiving connections
- **Log:** Check browser console for connection errors

### Reconnection stuck

- **Check:** Max 10 attempts reached → requires page refresh
- **Solution:** User should refresh page to reset
- **Better UX:** Consider "Reconnect" button in error state

---

## 🚀 Features Added

✅ **Auto-Reconnection**

- Exponential backoff
- Max 10 attempts
- Configurable via `RECONNECT_CONFIG`

✅ **Heartbeat**

- 30-second interval
- Prevents connection timeout
- Automatic cleanup

✅ **Connection Status UI**

- Shows green indicator when connected
- Shows warning when disconnected
- Shows error when reconnection fails

✅ **Error Handling**

- Graceful fallback to polling (via REST API)
- Clear error messages
- Console logging for debugging

✅ **Global State**

- NotificationContext for app-wide access
- Unread count management
- Bulk operations

---

## 📝 Future Enhancements

- [ ] Sound notifications
- [ ] Browser notifications (Push API)
- [ ] Cross-tab synchronization
- [ ] Notification persistence (localStorage)
- [ ] Manual reconnect button
- [ ] Retry counter display
- [ ] Badge with unread count in header (already have this via Redux)

---

## 🔗 Related Files

- Backend WebSocket: `backend/blog_app/blog/consumers.py`
- Backend Real-time: `backend/blog_app/blog/realtime.py`
- Django Channels Config: `backend/blog_app/blog_app/settings/base.py`
- Redux Notification API: `frontend/src/redux/services/blogs/notification.js`
- Middleware Auth: `frontend/src/middleware.js`
