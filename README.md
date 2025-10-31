Mini Task Management Backend

Node.js + Express + MongoDB + **Redis(caching)** backend with JWT auth, Zod validation, Winston logging, rate limiting, caching, and a cron-based deadline notifier for Flutter.

## Enhanced Features
- Redis caching for faster reads on `GET /api/tasks`
- Security hardening with **Helmet, CORS, input validation (Zod), and JWT**
- Rate limiting on login to mitigate brute-force attempts (highlighted below)
- Structured logging with Winston + daily rotation
- Cron-based notifier for tasks nearing deadlines (15 min window)

## Features
- Auth: signup/login, JWT, secure routes
- Tasks: CRUD, user-scoped
- Validation: Zod
- Security: helmet,  rate limit on login
- Caching: Redis caches GET /api/tasks, invalidated on create/update/delete
- Logging: Winston with daily rotate
- Cron: notifies a webhook for tasks nearing deadline (15 min window)

## Rate Limiting (Important)
- Applied to `POST /api/auth/login` to prevent brute-force attacks
- Default policy: small burst with short window (see middleware). Adjust as needed for your traffic
- If you hit 429 Too Many Requests during testing, slow down consecutive login attempts or temporarily relax the limits

## Endpoints
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

## API Reference

### POST /api/auth/signup
Headers:
- Content-Type: application/json

Request body (JSON):
```
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "StrongPassw0rd!"
}
```

Success response (201):
```
{
  "message": "Signup successful",
  "user": { "id": "<mongoId>", "name": "Alice", "email": "alice@example.com" }
}
```

Errors:
- 400 Validation error
- 409 Email already in use

### POST /api/auth/login
Headers:
- Content-Type: application/json

Request body (JSON):
```
{
  "email": "alice@example.com",
  "password": "StrongPassw0rd!"
}
```

Success response (200):
```
{
  "token": "<jwt>",
  "user": { "id": "<mongoId>", "name": "Alice", "email": "alice@example.com" }
}
```

Errors:
- 400 Validation error
- 401 Invalid credentials
- 429 Too Many Requests (rate limited)

### GET /api/tasks
Headers:
- Authorization: Bearer <jwt>

Response (200):
```
[
  {
    "id": "<mongoId>",
    "title": "Finish report",
    "description": "Summarize Q3 numbers",
    "deadline": "2025-10-30T17:00:00.000Z",
    "completed": false,
    "createdAt": "2025-10-29T12:34:56.000Z",
    "updatedAt": "2025-10-29T12:34:56.000Z"
  }
]
**    "cached": true**
```

Notes:
- Response may be served from Redis cache on cache hit. Cache is invalidated on create/update/delete

Errors:
- 401 Unauthorized

### POST /api/tasks
Headers:
- Content-Type: application/json
- Authorization: Bearer <jwt>

Request body (JSON):
```
{
  "title": "Finish report",
  "description": "Summarize Q3 numbers",
  "deadline": "2025-10-30T17:00:00.000Z"
}
```

Success response (201):
```
{
  "id": "<mongoId>",
  "title": "Finish report",
  "description": "Summarize Q3 numbers",
  "deadline": "2025-10-30T17:00:00.000Z",
  "completed": false,
  "createdAt": "2025-10-29T12:34:56.000Z",
  "updatedAt": "2025-10-29T12:34:56.000Z"
}
```

Errors:
- 400 Validation error
- 401 Unauthorized

### PUT /api/tasks/:id
Headers:
- Content-Type: application/json
- Authorization: Bearer <jwt>

Request body (JSON) – any updatable fields:
```
{
  "title": "Finish report (v2)",
  "description": "Add revenue appendix",
  "deadline": "2025-10-30T18:00:00.000Z",
  "completed": true
}
```

Success response (200):
```
{
  "id": "<mongoId>",
  "title": "Finish report (v2)",
  "description": "Add revenue appendix",
  "deadline": "2025-10-30T18:00:00.000Z",
  "completed": true,
  "createdAt": "2025-10-29T12:34:56.000Z",
  "updatedAt": "2025-10-29T13:00:00.000Z"
}
```

Errors:
- 400 Validation error
- 401 Unauthorized
- 404 Task not found

### DELETE /api/tasks/:id
Headers:
- Authorization: Bearer <jwt>

Success response (200):
```
{ "message": "Task deleted" }
```

Errors:
- 401 Unauthorized
- 404 Task not found

## Setup
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
REDIS_URL=redis:url:6379

```


Scripts
- npm run dev: nodemon


## Docker-Setup
Build image:
```bash
docker build -t zylentrix-api:latest .
```

Run with environment file and mapped port:
```bash
docker run --name zylentrix-api \
  --env-file .env \
  -p 4000:4000 \
  --restart unless-stopped \
  zylentrix-api:latest
```

Notes:
**-Be careful and make sure that the app inside the container should be able to communicate with redis, for deployment I have created a seperate Redis Instance in render only which will support the internal network communication between the render-backend+render-redis instances.**
- Ensure your MongoDB and Redis are reachable from inside the container (use host networking or proper URIs)
- Set `CORS_ORIGIN` to your frontend origin(s) or `*` for development


