# 🔧 Troubleshooting 401 Unauthorized Errors

## Quick Diagnostics Checklist

### ✅ Step 1: Check User is Logged In

Open browser console and run:

```javascript
const { data: { session } } = await supabase.auth.getSession();
console.log('Logged in:', !!session);
console.log('User:', session?.user?.email);
console.log('Token:', session?.access_token?.substring(0, 20) + '...');
```

**Expected Output**:
```
Logged in: true
User: user@example.com
Token: eyJhbGciOiJIUzI1NiIs...
```

**If `false`**: User needs to log in first!

---

### ✅ Step 2: Verify AxiosAuthProvider is Active

Check console logs on page load:

```
🔐 AxiosAuthProvider initialized - Authentication interceptors are active
```

**If missing**: Check `app/layout.tsx` includes `<AxiosAuthProvider>`

---

### ✅ Step 3: Check Token is Being Attached

When you make a favorite request, you should see:

```
✅ Auth token attached to request: /favorites
📌 Adding favorite: <coin-id>
```

**If you see**:
```
⚠️ No access token available for request: /favorites
```

**Then**: User session is missing - log in again

---

### ✅ Step 4: Verify Backend URL

Check console:

```
🌐 Backend API URL: http://localhost:3005
```

**If `undefined`**: Create `.env.local` with:
```bash
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3005
```

---

### ✅ Step 5: Test Backend Directly

Use curl or Postman to test backend endpoint:

```bash
# Get your token first (from browser console)
const { data: { session } } = await supabase.auth.getSession();
console.log(session.access_token);

# Test API call
curl -X POST http://localhost:3005/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"coin_id": "test-123"}'
```

**Expected**: 200 OK or 201 Created  
**If 401**: Backend is not verifying Supabase tokens correctly

---

### ✅ Step 6: Verify Backend Guard Implementation

Your NestJS backend needs:

```typescript
// supabase.service.ts
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabaseAdmin;

  constructor() {
    this.supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // ← Admin key, not anon key!
    );
  }

  async verifyToken(token: string) {
    const { data: { user }, error } = await this.supabaseAdmin.auth.getUser(token);
    if (error) throw new UnauthorizedException('Invalid token');
    return user;
  }
}

// supabase-auth.guard.ts
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const user = await this.supabaseService.verifyToken(token);
    
    request.user = user; // Attach user to request
    return true;
  }
}

// favorites.controller.ts
@Controller('favorites')
export class FavoritesController {
  @Post()
  @UseGuards(SupabaseAuthGuard) // ← Apply guard
  async addFavorite(@Req() req, @Body() body: { coin_id: string }) {
    const userId = req.user.id;
    // Save favorite with userId
    return { success: true };
  }

  @Delete(':coinId')
  @UseGuards(SupabaseAuthGuard) // ← Apply guard
  async removeFavorite(@Req() req, @Param('coinId') coinId: string) {
    const userId = req.user.id;
    // Remove favorite
    return { success: true };
  }
}
```

---

### ✅ Step 7: Check Backend Environment Variables

Backend `.env` must have:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ⚠️ Must use SERVICE_ROLE_KEY (from Supabase Dashboard > Settings > API)
# NOT the ANON_KEY!
```

**How to get it**:
1. Go to Supabase Dashboard
2. Settings → API
3. Copy `service_role` key (secret!)

---

### ✅ Step 8: Enable CORS on Backend

```typescript
// main.ts (NestJS)
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Frontend URLs
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(3005);
}
```

---

## 🔍 Debug Flow Diagram

```
User clicks favorite star
         ↓
Check: Is user logged in? (AuthContext)
         ├─ NO → Redirect to login
         └─ YES → Continue
                  ↓
Request sent via axiosAuth
         ↓
useAxiosAuth interceptor runs
         ↓
Check: Does session exist?
         ├─ NO → Log warning, send without token
         └─ YES → Attach token to Authorization header
                  ↓
Request sent to backend
         ↓
Backend Guard checks Authorization header
         ├─ Missing → Return 401
         ├─ Invalid → Return 401
         └─ Valid → Continue to controller
                    ↓
           Controller processes request
                    ↓
           Return success response
```

---

## 🚨 Common Error Messages

### "Missing authorization header"
**Cause**: Token not attached to request  
**Fix**: Check AxiosAuthProvider is initialized

### "Invalid token"
**Cause**: Backend can't verify token with Supabase  
**Fix**: Check backend has correct `SUPABASE_SERVICE_ROLE_KEY`

### "jwt malformed"
**Cause**: Token format is wrong  
**Fix**: Check Authorization header format: `Bearer <token>`

### "Network Error"
**Cause**: Backend not running or wrong URL  
**Fix**: Verify backend is running and `NEXT_PUBLIC_BACKEND_API_URL` is correct

---

## 🎯 Quick Test Script

Paste in browser console:

```javascript
// Test complete flow
(async () => {
  console.log('🔍 Starting diagnostics...\n');
  
  // 1. Check session
  const { data: { session } } = await supabase.auth.getSession();
  console.log('✅ Session:', session ? 'Found' : '❌ Missing');
  console.log('   User:', session?.user?.email || 'Not logged in');
  
  // 2. Check backend URL
  console.log('\n🌐 Backend URL:', process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3005');
  
  // 3. Test favorites API
  if (session) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3005'}/favorites`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        }
      });
      console.log('\n📡 API Test:', response.ok ? '✅ Success' : `❌ Failed (${response.status})`);
      console.log('   Status:', response.status, response.statusText);
    } catch (e) {
      console.log('\n❌ API Error:', e.message);
    }
  } else {
    console.log('\n⚠️ Cannot test API - not logged in');
  }
})();
```

---

## 💡 Need More Help?

1. **Share console logs** - Especially lines with 🔐, ✅, ⚠️, ❌
2. **Share backend logs** - What does NestJS log when request arrives?
3. **Share environment** - Are both frontend and backend running?
4. **Test with curl** - Does direct API call work with token?

---

## ✅ Success Indicators

When everything works correctly, you should see:

```
🔐 AxiosAuthProvider initialized - Authentication interceptors are active
🌐 Backend API URL: http://localhost:3005
✅ Auth token attached to request: /favorites
📌 Adding favorite: 123e4567-e89b-12d3-a456-426614174000
✅ Favorite added successfully: { success: true }
```

And no 401 errors! 🎉

