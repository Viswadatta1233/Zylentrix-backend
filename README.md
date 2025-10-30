Mini Task Management Backend

Node.js + Express + MongoDB + Redis backend with JWT auth, Zod validation, Winston logging, rate limiting, caching, and a cron-based deadline notifier for Flutter.

Features
- Auth: signup/login, JWT, secure routes
- Tasks: CRUD, user-scoped
- Validation: Zod
- Security: helmet, xss-clean, rate limit on login
- Caching: Redis caches GET /api/tasks, invalidated on create/update/delete
- Logging: Winston with daily rotate
- Cron: notifies a webhook for tasks nearing deadline (15 min window)

Endpoints
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

Setup
1. Create a .env file in project root using the sample below
2. Ensure Redis is running and REDIS_URL is correct
3. Start dev server: npm run dev

Sample .env
```
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
MONGODB_DB=zylentrix
JWT_SECRET=supersecret_jwt_key_change_me
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
REDIS_URL=redis://127.0.0.1:6379
NOTIFICATION_WEBHOOK_URL=
```

Notes
- Files kept <=150 lines.
- Scheduler posts to NOTIFICATION_WEBHOOK_URL your Flutter backend should handle.

Scripts
- npm run dev: nodemon
- npm test: Jest tests (skeleton)


