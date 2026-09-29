# FitWise Backend — Fix: "Sign in" should NOT create accounts

> Copy everything below the line and give it to your AI coding assistant.

---

## Problem

The frontend has two flows:
- **"Get started"** (onboarding) → should CREATE a new account
- **"Sign in"** (login) → should ONLY work for EXISTING accounts

Currently, both use `supabase.auth.signInWithOAuth({ provider: 'google' })`, which **always creates an account** if one doesn't exist. We need "Sign in" to fail for new users instead of creating an account.

## Solution

### 1. Supabase Dashboard (configuration)
- Go to **Authentication → Providers → Google**
- **Disable "Enable Signups"** (or set "Disable signups" to ON)
- This makes `signInWithOAuth` fail for new users (they get an error instead of an account)

### 2. Add a backend endpoint for user creation (onboarding only)

Add `POST /api/auth/create-user` that creates a user during onboarding:

```typescript
// POST /api/auth/create-user
// Body: { code: string }  // Google OAuth authorization code from the URL

import { OAuth2Client } from 'google-auth-library' // or use fetch to Google's token endpoint

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.FRONTEND_URL}/signup` // must match the redirect URI
)

export async function createUser(req: Request, res: Response) {
  const { code } = req.body
  if (!code) return res.status(400).json({ error: 'Missing code' })

  try {
    // Exchange the code for Google tokens
    const { tokens } = await client.getToken(code)
    const idToken = tokens.id_token

    if (!idToken) return res.status(400).json({ error: 'No id token' })

    // Verify the token and get user info
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    if (!payload) return res.status(400).json({ error: 'Invalid token' })

    const { email, name, sub: googleId } = payload

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingUser) {
      return res.status(409).json({ error: 'Account already exists. Please sign in.' })
    }

    // Create the user using Supabase Admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email!,
      email_confirm: true,
      user_metadata: { name, google_id: googleId, provider: 'google' },
    })

    if (authError) return res.status(500).json({ error: authError.message })

    // Create the auth session (sign in the user)
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email!,
    })

    // Return success — the frontend will handle the session
    return res.json({
      success: true,
      user: authData.user,
      message: 'Account created successfully',
    })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create account' })
  }
}
```

### 3. Environment variables needed
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FRONTEND_URL=http://localhost:5173
```

### 4. How the frontend will use this
- **Onboarding ("Get started")**: 
  1. User clicks "Continue with Google"
  2. Google redirects back with `?code=...` in the URL
  3. Frontend detects no Supabase session (signups disabled)
  4. Frontend calls `POST /api/auth/create-user` with the code
  5. Backend creates the user and returns success
  6. Frontend signs in the user (via Supabase session or refresh)

- **Sign in ("Sign in")**:
  1. User clicks "Continue with Google"
  2. Google redirects back
  3. If no session (new user), show error: "No account found. Please sign up."
  4. If session exists, go to dashboard

## Alternative (simpler, no backend code)

If you don't want to write a backend endpoint, you can:
1. **Disable signups** in Supabase
2. **Manually create users** in the Supabase dashboard for testing
3. The frontend "Sign in" will fail for new users (which is the desired behavior)

But this means you can't create new accounts through the app — you'd need to create them manually in the dashboard.

## Recommendation

Implement the backend endpoint approach (#2) so the onboarding flow can still create accounts while the sign-in flow cannot.
