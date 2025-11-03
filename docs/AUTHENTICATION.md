# 🔐 Authentication Architecture

This document explains the complete authentication system implemented in the Meillor frontend application.

## 🏗️ Overview

The application uses **Supabase Auth** for authentication with a Next.js frontend. The architecture follows best practices for security, scalability, and maintainability.

## 📁 File Structure

```
/
├── middleware.ts                    # Next.js middleware for route protection
├── contexts/
│   └── AuthContext.tsx             # Global authentication state management
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   └── server.ts               # Server Supabase client
│   ├── hooks/
│   │   └── useAxiosAuth.ts         # Axios interceptor for JWT tokens
│   └── utils/
│       └── auth.ts                 # Auth utility functions
├── components/
│   └── ProtectedRoute.tsx          # Route protection component
└── app/
    ├── login/
    │   └── page.tsx                # Login page
    └── register/
        └── page.tsx                # Registration page
```

## 🔄 Authentication Flow

### 1. User Registration/Login

```
User submits credentials
    ↓
AuthContext.signUp() or signIn()
    ↓
Supabase Auth API
    ↓
Session created & JWT stored in cookies
    ↓
User redirected to dashboard
```

### 2. Protected Routes

```
User navigates to /dashboard
    ↓
middleware.ts checks session
    ↓
No session? → Redirect to /login
Has session? → Allow access
    ↓
ProtectedRoute component confirms user
    ↓
Render protected content
```

### 3. API Requests with JWT

```
Component makes API call
    ↓
useAxiosAuth interceptor adds JWT
    ↓
Request sent with Authorization: Bearer <token>
    ↓
Backend validates JWT
    ↓
401 Unauthorized? → Refresh token & retry
Success? → Return data
```

## 🛡️ Security Features

### 1. Middleware Protection (`middleware.ts`)

- Automatically protects routes that start with `/dashboard` or `/coins`
- Redirects unauthenticated users to `/login`
- Prevents authenticated users from accessing `/auth/login` or `/auth/register`
- Automatically refreshes expired sessions

```typescript
// Example usage - already configured
const isProtectedRoute = pathname.startsWith('/dashboard');
if (isProtectedRoute && !user) {
  return NextResponse.redirect(new URL('/login', request.url));
}
```

### 2. Automatic Token Refresh

The axios interceptor automatically handles token refresh:

- Detects 401 Unauthorized responses
- Attempts to refresh the session
- Retries the original request with new token
- Queues multiple requests during refresh to avoid race conditions
- Redirects to login if refresh fails

```typescript
// Use in components
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';

const axiosAuth = useAxiosAuth();
// All requests now include JWT and handle refresh automatically
```

### 3. Session Management

- Sessions stored in secure HTTP-only cookies
- Automatic session refresh before expiration
- Clean sign-out with session invalidation

## 🎯 Usage Guide

### Using Authentication in Components

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, session, signOut, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Making Authenticated API Calls

```typescript
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';

function MyComponent() {
  const axiosAuth = useAxiosAuth();
  
  const fetchData = async () => {
    try {
      const response = await axiosAuth.get('/api/protected-endpoint');
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return <button onClick={fetchData}>Fetch Data</button>;
}
```

### Protecting Routes

Two methods available:

#### Method 1: Using Middleware (Automatic)

Routes starting with `/dashboard` or `/coins` are automatically protected by middleware.

#### Method 2: Using ProtectedRoute Component

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Protected content here</div>
    </ProtectedRoute>
  );
}
```

### Manual Session Check

```typescript
import { isAuthenticated, getCurrentUser } from '@/lib/utils/auth';

// Check if user is authenticated
const authStatus = await isAuthenticated();

// Get current user
const user = await getCurrentUser();
```

## 🔧 Configuration

### Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3005  # Your Nest.js backend URL
```

### Customizing Protected Routes

Edit `middleware.ts` to add/remove protected routes:

```typescript
const isProtectedRoute = 
  pathname.startsWith('/dashboard') || 
  pathname.startsWith('/admin') ||     // Add your routes
  pathname.startsWith('/profile');     // Add your routes
```

## 🚀 Features

### ✅ Implemented

- [x] Email/password authentication
- [x] JWT-based authorization
- [x] Automatic token refresh
- [x] Route protection via middleware
- [x] Protected component wrapper
- [x] Session persistence
- [x] Secure sign-out
- [x] Auto-redirect for auth pages
- [x] Error handling and user feedback

### 🔜 Future Enhancements

- [ ] OAuth providers (Google, GitHub, etc.)
- [ ] Magic link authentication
- [ ] Role-based access control (RBAC)
- [ ] Two-factor authentication (2FA)
- [ ] Rate limiting
- [ ] Session timeout warnings

## 🧪 Testing

### Manual Testing Checklist

1. **Login Flow**
   - [ ] Login with valid credentials
   - [ ] Login with invalid credentials shows error
   - [ ] Redirect to dashboard on success

2. **Registration Flow**
   - [ ] Register with valid email/password
   - [ ] Password mismatch shows error
   - [ ] Redirect to login on success

3. **Protected Routes**
   - [ ] Access `/dashboard` without login → redirects to `/login`
   - [ ] Access `/dashboard` with login → shows dashboard
   - [ ] Auth state persists on page refresh

4. **Token Refresh**
   - [ ] Make API call with valid token → succeeds
   - [ ] Token expires → auto-refreshes and retries
   - [ ] Failed refresh → redirects to login

5. **Sign Out**
   - [ ] Sign out clears session
   - [ ] Sign out redirects to login
   - [ ] Cannot access protected routes after sign out

## 🐛 Troubleshooting

### Issue: "No token provided" error

**Solution**: Ensure `useAxiosAuth` hook is used in the component making the request.

### Issue: Session not persisting

**Solution**: Check that Supabase cookies are set correctly and not blocked by browser settings.

### Issue: Infinite redirect loop

**Solution**: Clear cookies and restart the dev server. Check middleware configuration.

### Issue: 401 errors on API calls

**Solution**: 
1. Verify JWT is being sent: Check Network tab in DevTools
2. Ensure backend is properly configured to verify Supabase JWT
3. Check that `SUPABASE_URL` and keys are correct

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Middleware](https://nextjs.org/docs/advanced-features/middleware)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 🤝 Contributing

When adding new authentication features:

1. Update this documentation
2. Add tests for new functionality
3. Update the TODO list above
4. Ensure backward compatibility



