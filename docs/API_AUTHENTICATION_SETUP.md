# 🔐 API Authentication Setup - Complete Guide

## ✅ Current Configuration

All API calls now include the user's access token automatically when they are logged in.

---

## 📋 Authentication Flow

### 1. User Logs In

**File**: `contexts/AuthContext.tsx`

```typescript
const signIn = async (email: string, password: string) => {
  const supabase = getSupabaseFrontendClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error ? new Error(error.message) : null };
};
```

**What happens**:
- User enters credentials
- Supabase validates and returns session with `access_token`
- Session stored automatically by Supabase

---

### 2. AxiosAuth Interceptor Attaches Token

**File**: `lib/hooks/useAxiosAuth.ts`

```typescript
const requestIntercept = axiosAuth.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('session', session); // Debug log
    const accessToken = session?.access_token;

    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
      console.log('✅ Auth token attached to request:', config.url);
    } else {
      console.warn('⚠️ No access token available for request:', config.url);
    }
    return config;
  }
);
```

**What happens**:
- Before every API request using `axiosAuth`
- Gets current session from Supabase
- Extracts access token
- Attaches as `Authorization: Bearer <token>` header
- Logs success or warning

---

### 3. All API Calls Use axiosAuth

#### **Coins API** (`lib/api/coins.ts`)

```typescript
import { axiosAuth } from '../axios' // ✅ Using authenticated instance

export const coinsApi = {
  async getCoins(params: CoinsParams = {}): Promise<CoinsResponse> {
    console.log('🪙 Fetching coins with params:', params);
    const response = await axiosAuth.get('/coins', { params });
    console.log('✅ Coins fetched successfully:', response.data.pagination);
    return response.data;
  },

  async getCoinById(id: string): Promise<Coin> {
    console.log('🪙 Fetching coin by ID:', id);
    const response = await axiosAuth.get(`/coins/${id}`);
    console.log('✅ Coin fetched successfully:', response.data.name);
    return response.data;
  }
}
```

#### **Favorites API** (`lib/api/favorites.ts`)

```typescript
import { axiosAuth } from '../axios' // ✅ Using authenticated instance

export const favoritesApi = {
  async addFavorite(coinId: string): Promise<void> {
    console.log('📌 Adding favorite:', coinId);
    const response = await axiosAuth.post('/favorites', { coin_id: coinId });
    console.log('✅ Favorite added successfully:', response.data);
    return response.data;
  },

  async removeFavorite(coinId: string): Promise<void> {
    console.log('📌 Removing favorite:', coinId);
    const response = await axiosAuth.delete(`/favorites/${coinId}`);
    console.log('✅ Favorite removed successfully:', response.data);
    return response.data;
  }
}
```

---

## 🔄 Complete Request Flow

```
User visits page
      ↓
AxiosAuthProvider initialized (app/layout.tsx)
      ↓
useAxiosAuth hook sets up interceptors
      ↓
User logs in → Supabase stores session
      ↓
Component calls coinsApi.getCoins()
      ↓
Request interceptor runs:
  - Gets session from Supabase
  - Extracts access_token
  - Attaches Authorization: Bearer <token>
      ↓
Request sent to backend with token
      ↓
Backend verifies token with Supabase
      ↓
If valid → returns data with is_favorite field
      ↓
If 401 → interceptor refreshes token automatically
```

---

## 🎯 What Changed

### Before ❌
```typescript
// lib/api/coins.ts
import axiosInstance from '../axios' // Public instance (no auth)

const response = await axiosInstance.get('/coins') // No token sent
```

### After ✅
```typescript
// lib/api/coins.ts
import { axiosAuth } from '../axios' // Authenticated instance

const response = await axiosAuth.get('/coins') // Token automatically attached!
```

---

## 🔍 How to Verify It's Working

### 1. Open Browser Console

After logging in, you should see:

```
🔐 AxiosAuthProvider initialized - Authentication interceptors are active
session { access_token: "eyJhbGciOiJIUzI1NiIs...", user: {...}, ... }
```

### 2. When Fetching Coins

```
🪙 Fetching coins with params: { page: 1, limit: 25 }
✅ Auth token attached to request: /coins
✅ Coins fetched successfully: { page: 1, limit: 25, total: 100, totalPages: 4 }
```

### 3. When Toggling Favorites

```
📌 Adding favorite: 123e4567-e89b-12d3-a456-426614174000
✅ Auth token attached to request: /favorites
✅ Favorite added successfully: { success: true }
```

### 4. Check Network Tab

Open DevTools → Network → Select any request to `/coins` or `/favorites`:

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## 🌐 Backend Integration

Your NestJS backend should:

### 1. Extract Token from Header

```typescript
const authHeader = request.headers['authorization'];
const token = authHeader.replace('Bearer ', '');
```

### 2. Verify with Supabase

```typescript
const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
if (error) throw new UnauthorizedException('Invalid token');
```

### 3. Use User ID

```typescript
// Now you know which user is making the request
const userId = user.id;

// Return personalized data
const coins = await getCoinsWithFavorites(userId);
```

---

## 🚨 Troubleshooting

### No Token Attached?

Check console:
```
⚠️ No access token available for request: /coins
```

**Solution**: User needs to log in first!

```javascript
// Check login status
const { data: { session } } = await supabase.auth.getSession();
console.log('Logged in:', !!session);
```

### 401 Error?

**Possible causes**:
1. Backend not verifying token correctly
2. Token expired (should auto-refresh)
3. Wrong `SUPABASE_SERVICE_ROLE_KEY` on backend

**Check backend logs** to see what error it's returning.

### Token Refreshing on 401

The interceptor automatically handles this:

```typescript
// In useAxiosAuth.ts
if (error.response?.status === 401) {
  const { data: { session } } = await supabase.auth.refreshSession();
  // Retry request with new token
  return axiosAuth(originalRequest);
}
```

---

## 📊 Console Log Reference

| Log | Meaning |
|-----|---------|
| 🔐 AxiosAuthProvider initialized | Auth interceptors are active |
| 🌐 Backend API URL: ... | Backend URL being used |
| session { access_token: ... } | Session retrieved successfully |
| ✅ Auth token attached to request | Token added to request |
| ⚠️ No access token available | User not logged in |
| 🪙 Fetching coins | Coins API called |
| 📌 Adding favorite | Favorites API called |
| ✅ Coins fetched successfully | API response received |
| ❌ Error fetching coins | API call failed |

---

## 🎯 Key Points

✅ **All API calls** now use `axiosAuth` (authenticated)  
✅ **Token automatically attached** to every request  
✅ **Token auto-refreshes** on 401 errors  
✅ **Backend receives** `Authorization: Bearer <token>` header  
✅ **User-specific data** (like favorites) can be returned  
✅ **Comprehensive logging** for easy debugging  

---

## 📁 File Summary

| File | Purpose | Status |
|------|---------|--------|
| `lib/axios.ts` | Axios instances (public & auth) | ✅ |
| `lib/hooks/useAxiosAuth.ts` | Token interceptors | ✅ |
| `components/AxiosAuthProvider.tsx` | Global auth setup | ✅ |
| `lib/api/coins.ts` | Coins API (authenticated) | ✅ |
| `lib/api/favorites.ts` | Favorites API (authenticated) | ✅ |
| `contexts/AuthContext.tsx` | Auth state management | ✅ |

---

## 🚀 Next Steps

1. **Test the flow**: Log in and check console logs
2. **Verify backend**: Ensure it receives and validates tokens
3. **Check favorites**: Ensure `is_favorite` field is returned correctly
4. **Monitor errors**: Watch for any 401 errors in console

Your authentication is now fully set up! 🎉

