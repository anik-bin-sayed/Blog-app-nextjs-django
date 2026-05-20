# Blog Application

A full-stack blogging platform with user authentication, admin dashboard, comments, saved blogs, real-time notifications (WebSocket + Redis), and an AI chatbot on blog posts.

| Layer     | Stack                                                   |
| --------- | ------------------------------------------------------- |
| Frontend  | Next.js 16, React 19, Redux Toolkit, Tailwind CSS       |
| Backend   | Django 6, Django REST Framework, JWT (httpOnly cookies) |
| Real-time | Django Channels, Daphne, Redis                          |
| Media     | Cloudinary                                              |
| Email     | Gmail SMTP (account activation)                         |

---

## Features

- **Users:** Register (full name, username, email), email activation, login/logout
- **Blogs:** Public listing, search/filter, single post, categories, featured & recent
- **Comments:** Authenticated users can comment; blog authors get notifications
- **Saved blogs:** Logged-in users can save posts
- **Admin dashboard:** Manage blogs, categories, users, analytics
- **Notifications:** Admin sees all comment notifications; real-time updates via WebSocket
- **AI:** Groq-powered chatbot on blog detail pages (admin / logged-in flows)

---

## Prerequisites

Install before you start:

1. **Node.js** 18+ and **npm**
2. **Python** 3.11+ (3.13 recommended)
3. **Redis** 7+ (local install or Docker)
4. **Cloudinary** account (for image uploads)
5. **Gmail** app password (for activation emails) — optional for local API testing without email
6. **Groq API key** — optional (only for chatbot)

---

## Quick start (local development)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd blog-application
```

### 2. Backend setup

```bash
cd backend
python -m venv env

# Windows
env\Scripts\activate

# macOS / Linux
source env/bin/activate

pip install -r requirements.txt
```

Create environment file:

```bash
cd blog_app
copy .env.example .env    # Windows
# cp .env.example .env    # macOS / Linux
```

Edit `backend/blog_app/.env` — at minimum set `SECRET_KEY`. Add Cloudinary, email, and Groq keys when you need those features.

Run migrations:

```bash
python manage.py migrate
```

Create a superuser (use this account as **admin** — set `role` to admin in Django admin or shell):

```bash
python manage.py createsuperuser
```

To mark a user as admin after creation:

```bash
python manage.py shell
```

```python
from account.models import User
u = User.objects.get(email="admin@example.com")
u.role = "admin"
u.is_verified = True
u.save()
```

### 3. Start Redis

**Option A — Docker:**

```bash
docker run -d --name redis_container -p 6379:6379 redis:7-alpine
```

**Option B — installed locally** on port `6379`.

### 4. Start backend (Daphne — required for WebSockets)

From `backend/blog_app`:

```bash
# Windows (venv at backend/env)
..\env\Scripts\daphne.exe -b 127.0.0.1 -p 8000 blog_app.asgi:application

# macOS / Linux
daphne -b 127.0.0.1 -p 8000 blog_app.asgi:application
```

> Use **Daphne**, not `runserver`, if you want real-time notifications.  
> API base URL: `http://localhost:8000/api`

### 5. Frontend setup

Open a **new terminal**:

```bash
cd frontend
npm install
copy .env.example .env.local   # Windows
# cp .env.example .env.local     # macOS / Linux
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Docker

### Production (`docker-compose.yml`)

```bash
cp .env.docker.example .env
# Edit .env — SECRET_KEY, FRONTEND_URL, NEXT_PUBLIC_* for your domain
docker compose up -d --build
```

| Service  | URL |
| -------- | --- |
| Frontend | http://localhost:3000 (`next start`, built image) |
| Backend  | http://localhost:8000 (Daphne, auto-migrate on start) |
| Redis    | internal network only |

- Production images (no source bind mounts).
- SQLite persisted in volume `django_db`.
- Behind HTTPS: set `COOKIE_SECURE=true`, `USE_X_FORWARDED_HOST=true` in `.env`.

### Development (`docker-compose.dev.yml`)

```bash
docker compose -f docker-compose.dev.yml up --build
```

Hot reload with `npm run dev` and mounted `./backend` / `./frontend` folders.

---

## Environment variables

### Backend (`backend/blog_app/.env`)

| Variable                                  | Description                                     |
| ----------------------------------------- | ----------------------------------------------- |
| `SECRET_KEY`                              | Django secret key (required)                    |
| `ENV`                                     | `development` or `production`                   |
| `REDIS_HOST`                              | `127.0.0.1` locally, `redis` in Docker          |
| `REDIS_PORT`                              | Default `6379`                                  |
| `FRONTEND_URL`                            | e.g. `http://localhost:3000` (activation links) |
| `CLOUDINARY_*`                            | Cloud name, API key, secret                     |
| `EMAIL_HOST_USER` / `EMAIL_HOST_PASSWORD` | Gmail SMTP                                      |
| `groq_api_key`                            | Groq API for chatbot                            |

See `backend/blog_app/.env.example`.

### Frontend (`frontend/.env.local`)

| Variable              | Description                         |
| --------------------- | ----------------------------------- |
| `NEXT_PUBLIC_API_URL` | Default `http://localhost:8000/api` |
| `NEXT_PUBLIC_WS_URL`  | Default `ws://127.0.0.1:8000`       |

See `frontend/.env.example`.

---

## How authentication works

1. User logs in → backend sets **httpOnly** cookies: `access_token`, `refresh_token`.
2. Frontend calls APIs with `credentials: "include"`.
3. Client cookies `auth`, `role`, `vo__c` are set after profile load (for middleware & UI).
4. Token refresh: `POST /api/accounts/refresh` (cookie-based).

**First-time user flow:** Register → check email → open activation link → login.

---

## Main URLs (frontend)

| Path                      | Access                                    |
| ------------------------- | ----------------------------------------- |
| `/`                       | Public                                    |
| `/blogs`                  | Public                                    |
| `/blogs/[slug]`           | Public (partial content if not logged in) |
| `/login`, `/register`     | Guest                                     |
| `/activate/[uid]/[token]` | Guest (email link)                        |
| `/saved-blog`             | Logged-in user                            |
| `/dashboard`              | Admin only                                |
| `/notifications`          | Admin only                                |

---

## API overview

| Prefix                                            | Purpose                                                    |
| ------------------------------------------------- | ---------------------------------------------------------- |
| `/api/accounts/`                                  | Register, login, logout, refresh, profile, users, activity |
| `/api/blogs/`                                     | CRUD, list, featured, recent, saved                        |
| `/api/comment/`                                   | Create/delete comments                                     |
| `/api/notifications/`                             | Admin notifications                                        |
| WebSocket `ws://HOST/ws/notifications/<user_id>/` | Real-time notifications                                    |

---

## Project structure

```
blog-application/
├── backend/
│   ├── requirements.txt
│   └── blog_app/              # Django project (manage.py here)
│       ├── account/           # User, auth, email activation
│       ├── blog/              # Blogs, comments, notifications, WS
│       └── blog_app/          # Settings, asgi, urls
├── frontend/
│   └── src/
│       ├── app/               # Next.js pages
│       ├── components/
│       └── redux/             # API + auth state
├── docker-compose.yml
└── README.md
```

---

## Common issues

| Problem                     | Solution                                                           |
| --------------------------- | ------------------------------------------------------------------ |
| Notifications not live      | Run **Daphne**, not `runserver`; ensure Redis is running           |
| Redis monitor empty         | Traffic only appears when the app uses Redis (WS, cache)           |
| Registration email fails    | Set `EMAIL_HOST_USER` / `EMAIL_HOST_PASSWORD` (Gmail app password) |
| Images not uploading        | Configure Cloudinary in `.env`                                     |
| Login works but UI glitches | Clear cookies; use latest code (no `reload()` after login)         |
| `full_name` DB error        | Run `python manage.py migrate`                                     |
| CORS errors                 | Frontend must be `http://localhost:3000` in `development.py`       |

---

## Scripts

**Frontend**

```bash
npm run dev      # development
npm run build    # production build
npm run start    # production server
npm run lint     # ESLint
```

**Backend**

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver          # HTTP only
daphne -b 127.0.0.1 -p 8000 blog_app.asgi:application   # HTTP + WebSocket
```

---

## Contributing

1. Fork the repo
2. Create a branch
3. Copy `.env.example` files and never commit real secrets
4. Run backend + Redis + frontend locally before opening a PR
