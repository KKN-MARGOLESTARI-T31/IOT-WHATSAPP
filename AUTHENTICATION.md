# Authentication Middleware

## How It Works

### Protected Routes (Require Login)
- `/dashboard` - Main dashboard
- `/messages` - Message history
- `/contacts` - Contact list
- `/auto-reply` - Auto-reply settings
- `/broadcast` - Broadcast messages
- `/data-source` - **Source DB interface**

**If not logged in → Redirect to `/login?redirect=/path`**

### Auth Routes (Login Page)
- `/login`

**If already logged in → Redirect to `/dashboard`**

## Flow Diagram

```
User tries to access /dashboard
  ↓
Middleware checks session_token cookie
  ↓
┌─────────────┬─────────────┐
│ Has Token?  │ No Token    │
└─────────────┴─────────────┘
       │             │
       ↓             ↓
  Call /api/auth/me  Redirect to /login?redirect=/dashboard
       │
┌──────┴────────┐
│ Valid Session? │
└──────┬────────┘
       │
   ┌───┴───┐
   │       │
   ✅      ❌
   │       │
Allow    Redirect to /login
Access
```

## Testing

### 1. Test Protection
```bash
# Without login, access dashboard
http://localhost:3001/dashboard

# Should redirect to:
http://localhost:3001/login?redirect=/dashboard
```

### 2. Test Login Flow
```bash
# Login with credentials
Email: admin@whatsappbot.com
Password: admin123

# Should redirect to /dashboard (or redirect param)
```

### 3. Test Already Logged In
```bash
# While logged in, try to access /login
http://localhost:3001/login

# Should redirect to /dashboard
```

## Implementation

File: `src/middleware.ts`

```typescript
// Checks every request to protected routes
// Verifies session via /api/auth/me
// Redirects as needed
```

## Security

- ✅ Session verified on every request
- ✅ Cookie-based authentication
- ✅ Preserves intended destination (redirect param)
- ✅ Prevents access without login
