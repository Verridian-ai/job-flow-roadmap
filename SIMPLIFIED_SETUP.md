# JobFlow - Simplified Setup (Google Sign-In Only)

## ✅ Current Status

Your JobFlow app is running with:
- ✅ **Google Sign-In** (simplified authentication)
- ✅ **No phone number required** (Australia not supported removed)
- ✅ **Beautiful UI** with dark theme
- ✅ **Dev server running** on http://localhost:5175

---

## 🔐 Authentication Setup

### What's Configured
- **Clerk** with Google OAuth only
- **No SMS/phone verification** needed
- **Simple email + Google** sign-in flow

### How It Works
1. User clicks **"Get Started"** or **"Sign In"**
2. Clerk modal opens with options:
   - Continue with Google (recommended)
   - Sign up with Email
3. User authenticates
4. Redirected to Dashboard

---

## 🚀 Quick Start Guide

### 1. View the Landing Page
```
✅ Already done! You're seeing it at http://localhost:5175
```

### 2. Sign Up with Google
1. Click **"Get Started"** button
2. Click **"Continue with Google"**
3. Choose your Google account
4. Grant permissions
5. ✅ You're in!

### 3. Set Up Convex (For Full Features)
```bash
# Run this to get your Convex backend
npx convex dev
```

**What happens**:
- Opens browser for Convex login
- Creates/selects a project
- Generates API files
- Shows your Convex URL

**Copy the URL** and update `.env`:
```bash
VITE_CONVEX_URL=https://your-actual-deployment.convex.cloud
```

### 4. Start Convex Backend
```bash
# In a new terminal
npm run convex:dev
```

Keep this running while developing.

---

## 📱 Authentication Flow (Simplified)

### Sign Up Flow
```
1. Click "Get Started"
   ↓
2. Choose "Continue with Google"
   ↓
3. Google OAuth (no phone needed!)
   ↓
4. Account created automatically
   ↓
5. Redirected to Dashboard
```

### What's Removed
- ❌ Phone number verification
- ❌ SMS codes
- ❌ Country selection
- ❌ Mobile number field

### What's Available
- ✅ Google Sign-In (one click!)
- ✅ Email/Password Sign-In (traditional)
- ✅ Email verification
- ✅ Password reset

---

## 🎯 Using the App

### After Signing In
You'll see the **Dashboard** with:
- Quick stats
- Recent applications
- Quick action buttons

### Available Features
1. **STAR Stories** (`/star-stories`)
   - Create achievement stories
   - Organize by category
   - Use in resumes

2. **Resume Builder** (`/resume-builder`)
   - AI-powered generation
   - Select STAR stories
   - Paste job description
   - Get tailored resume

3. **Job Tracking** (`/jobs`)
   - Kanban board view
   - Track applications
   - Follow-up reminders

4. **Coach Directory** (`/coaches`)
   - Browse expert coaches
   - Filter by specialty
   - Book sessions

5. **Settings** (`/settings`)
   - Update profile
   - Privacy settings
   - Notification preferences

---

## 🔧 Development Workflow

### Running the App
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend (after Convex setup)
npm run convex:dev
```

### Making Changes
- **Frontend**: Edit files in `src/` - auto-reloads
- **Backend**: Edit files in `convex/` - auto-deploys
- **Styles**: Tailwind classes apply instantly

### Testing Auth
1. Sign out: Click user avatar → Sign Out
2. Sign in again: Click "Sign In"
3. Test Google flow
4. Test email/password flow

---

## 📊 Feature Availability

### ✅ Works Now (No Convex Needed)
- Landing page
- Sign up / Sign in with Google
- User profile (from Clerk)
- Navigation
- UI/UX

### ⚠️ Needs Convex Setup
- Creating STAR stories
- Generating resumes
- Tracking jobs
- Messaging coaches
- Marketplace features

---

## 🎨 UI Features

### Current Theme
- **Dark mode**: Gray-900 background
- **Accent color**: Yellow-500 (JobFlow brand)
- **Typography**: Professional, readable
- **Responsive**: Works on all devices

### Components Styled
- ✅ Navigation bar
- ✅ Buttons (hover effects)
- ✅ Cards and panels
- ✅ Forms and inputs
- ✅ Modals and dialogs

---

## 🐛 Troubleshooting

### "Continue with Google" Not Working
1. Check Clerk dashboard
2. Verify Google OAuth is enabled
3. Check allowed domains include `localhost:5175`

### Can't Sign In
1. Clear browser cache
2. Try incognito mode
3. Check browser console (F12) for errors

### Styles Not Loading
1. Hard refresh: `Ctrl+Shift+R`
2. Clear cache
3. Restart dev server

### Convex Errors
1. Make sure `npx convex dev` ran successfully
2. Check `.env` has correct Convex URL
3. Restart `npm run convex:dev`

---

## 📝 Environment Variables

### Current .env
```bash
# Clerk (Already set)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_aW5maW5pdGUtY2hpY2tlbi0yNi5jbGVyay5hY2NvdW50cy5kZXYk

# Convex (Update after running npx convex dev)
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

### Optional (Set in Convex Dashboard Later)
```bash
STRIPE_SECRET_KEY=sk_test_... # For payments
OPENAI_API_KEY=sk-...        # For AI features
```

---

## ✅ Simplified Checklist

- [x] App running on http://localhost:5175
- [x] Google Sign-In configured
- [x] Phone verification removed
- [x] Beautiful UI with dark theme
- [x] Clerk authentication working
- [ ] Convex backend set up (run `npx convex dev`)
- [ ] Full features enabled

---

## 🎉 You're Ready!

Your JobFlow app is:
- ✅ **Running smoothly**
- ✅ **Looking beautiful**
- ✅ **Easy to sign in** (just Google!)
- ✅ **No phone hassles** (removed)

### Next Step
**Sign in with Google** and explore the dashboard!

Click **"Get Started"** → **"Continue with Google"** → Start using JobFlow! 🚀

---

**Current URL**: http://localhost:5175  
**Auth Method**: Google Sign-In (simplified)  
**Status**: Ready to use! ✨
