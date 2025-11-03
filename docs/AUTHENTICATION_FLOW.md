# Authentication Flow Documentation

## 🔐 Supabase + NestJS Authentication Architecture

This document explains how authentication works between the Next.js frontend (Supabase Auth) and NestJS backend.

---

## 📋 Architecture Overview

```
┌─────────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Next.js       │      │   Supabase   │      │   NestJS        │
│   Frontend      │─────▶│   Auth       │◀─────│   Backend       │
└─────────────────┘      └──────────────┘      └─────────────────┘
        │                        │                       │
        │  1. Login              │                       │
        │───────────────────────▶│                       │
        │                        │                       │
        │  2. Access Token       │                       │
        │◀───────────────────────│                       │
        │                        │                       │
        │  3. API Request + Token                        │
        │───────────────────────────────────────────────▶│
        │                        │                       │
        │                        │  4. Verify Token      │
        │                        │◀──────────────────────│
        │                        │                       │
        │                        │  5. User Data         │
        │                        │──────────────────────▶│
        │                        │                       │
        │  6. API Response                               │
        │◀───────────────────────────────────────────────│
```

---

## 🔄 Step-by-Step Workflow

### 1️⃣ **User Login (Frontend)**

**File**: `contexts/AuthContext.tsx`

```typescript
const signIn = async (email: string, password: string) => {
  const supabase = getSupabaseFrontendClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { error: error ? new Error(error.message) : null };
};
```

**What happens**:
- User enters credentials in login form
- Supabase Auth validates credentials
- Returns session with `access_token` and `refresh_token`

---

### 2️⃣ **Token Storage (Frontend)**

**File**: `contexts/AuthContext.tsx`

```typescript
// Supabase automatically stores tokens in localStorage
// Session is managed by Supabase client
const { data: { session } } = await supabase.auth.getSession();
```

**What happens**:
- Supabase stores tokens securely in browser
- Session is automatically managed (refresh, expire, etc.)
- Tokens are accessible via `supabase.auth.getSession()`

---

### 3️⃣ **Request Interceptor (Frontend)**

**File**: `lib/hooks/useAxiosAuth.ts`

```typescript
const requestIntercept = axiosAuth.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  }
);
```

**What happens**:
- Before every API request to NestJS backend
- Gets current session from Supabase
- Attaches `Authorization: Bearer <token>` header
- Sends request to backend

---

### 4️⃣ **Token Verification (Backend)**

**Expected NestJS Implementation**:

```typescript
// Backend Guard (NestJS)
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) throw new UnauthorizedException('Missing auth header');
    
    const token = authHeader.split(' ')[1];
    
    // Verify token with Supabase Admin
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error) throw new UnauthorizedException('Invalid token');
    
    req.user = user; // Attach user to request
    return true;
  }
}
```

**What happens**:
- Backend extracts `Authorization` header
- Validates token using Supabase Admin API
- Attaches verified user to request object
- Allows or denies request based on validity

---

### 5️⃣ **Token Refresh (Frontend)**

**File**: `lib/hooks/useAxiosAuth.ts`

```typescript
const responseIntercept = axiosAuth.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Token expired - refresh it
      const { data: { session } } = await supabase.auth.refreshSession();
      
      // Retry original request with new token
      originalRequest.headers['Authorization'] = `Bearer ${session.access_token}`;
      return axiosAuth(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

**What happens**:
- If backend returns 401 (token expired)
- Frontend automatically refreshes the token
- Retries the original request with new token
- If refresh fails, redirects to login

---

## 🗂️ File Structure

```
r_maillor_frontend/
├── app/
│   └── layout.tsx                    # Root layout with providers
├── components/
│   └── AxiosAuthProvider.tsx         # Initializes auth interceptors
├── contexts/
│   └── AuthContext.tsx               # Manages auth state & login/logout
├── lib/
│   ├── axios.ts                      # Axios instances (base & auth)
│   ├── hooks/
│   │   └── useAxiosAuth.ts          # Request/response interceptors
│   ├── supabase/
│   │   └── client.ts                # Supabase client configuration
│   └── api/
│       ├── coins.ts                  # Public API calls
│       └── favorites.ts              # Protected API calls (requires auth)
```

---

## 🔧 Implementation Details

### **AxiosAuthProvider Setup**

**File**: `app/layout.tsx`

```typescript
<AuthProvider>
  <AxiosAuthProvider>  {/* ← Initializes interceptors globally */}
    <Header />
    <main>{children}</main>
    <Footer />
  </AxiosAuthProvider>
</AuthProvider>
```

**Why**: Ensures auth interceptors are active for all protected routes.

---

### **Protected API Calls**

**File**: `lib/api/favorites.ts`

```typescript
import { axiosAuth } from '../axios' // ← Uses authenticated instance

export const favoritesApi = {
  async addFavorite(coinId: string): Promise<void> {
    await axiosAuth.post('/favorites', { coin_id: coinId })
  },
  
  async removeFavorite(coinId: string): Promise<void> {
    await axiosAuth.delete(`/favorites/${coinId}`)
  }
}
```

**Key Points**:
- Always use `axiosAuth` (not default axios) for protected routes
- Token is automatically attached by interceptor
- No manual token management needed

---

## 🐛 Debugging & Troubleshooting

### Check Console Logs

The implementation includes comprehensive logging:

```
🌐 Backend API URL: http://localhost:3005
🔐 AxiosAuthProvider initialized - Authentication interceptors are active
✅ Auth token attached to request: /favorites
📌 Adding favorite: 123e4567-e89b-12d3-a456-426614174000
✅ Favorite added successfully: {...}
```

### Common Issues & Solutions

#### ❌ 401 Unauthorized Error

**Possible Causes**:

1. **User Not Logged In**
   ```bash
   ⚠️ No access token available for request: /favorites
   ```
   **Solution**: Ensure user is logged in via AuthContext

2. **Token Not Attached**
   ```bash
   # Missing this log:
   ✅ Auth token attached to request: /favorites
   ```
   **Solution**: Check AxiosAuthProvider is wrapping your app

3. **Backend Not Verifying Token**
   - Backend returns 401 even with valid token
   **Solution**: Verify NestJS Guard implementation

4. **Wrong Backend URL**
   ```bash
   🌐 Backend API URL: undefined
   ```
   **Solution**: Set `NEXT_PUBLIC_BACKEND_API_URL` in `.env.local`

#### ❌ Session Not Found

**Check**:
```typescript
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

**Solution**: User needs to log in first

#### ❌ CORS Issues

**Backend Setup Required**:
```typescript
// main.ts (NestJS)
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

---

## ✅ Environment Variables

Create `.env.local` in frontend root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Backend API
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3005
```

---

## 🧪 Testing the Flow

### 1. **Test Login**
```typescript
// In browser console
const { data: { session } } = await supabase.auth.getSession();
console.log('Token:', session?.access_token);
```

### 2. **Test API Call**
```typescript
// Watch console for:
✅ Auth token attached to request: /favorites
📌 Adding favorite: <coin_id>
✅ Favorite added successfully
```

### 3. **Verify Backend Receives Token**
```typescript
// Backend logs should show:
Authorization: Bearer eyJhbGciOiJIUzI1...
```

---

## 🎯 Summary

✅ **Frontend** → Gets token from Supabase  
✅ **Interceptor** → Attaches token to all `axiosAuth` requests  
✅ **Backend** → Verifies token with Supabase Admin  
✅ **Auto-refresh** → Handles token expiration automatically  
✅ **Error handling** → Redirects to login if refresh fails  

---

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [NestJS Guards](https://docs.nestjs.com/guards)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)

