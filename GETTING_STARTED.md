# JobFlow - Complete Setup Guide (Step-by-Step)

Follow these steps to get JobFlow running on your local machine.

---

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A code editor (VS Code recommended)

---

## Step 1: Install Dependencies

```bash
cd jobflow
npm install
```

This will install all required packages including:
- React, TypeScript, Vite
- Clerk for authentication
- Convex for backend
- Tailwind CSS for styling

---

## Step 2: Set up Convex Backend

### 2a. Initialize Convex

```bash
npx convex dev
```

**What happens**:
1. You'll be prompted to log in to Convex (or create an account)
2. Visit the URL shown in your terminal
3. Create a new project or select an existing one
4. The CLI will automatically:
   - Generate the `convex/_generated` files
   - Create a `.env.local` file with your Convex URL
   - Start watching for backend changes

### 2b. Copy Convex URL

After `npx convex dev` completes, it will show your Convex URL. Copy it.

### 2c. Update .env file

Edit `.env` and add your Convex URL:

```bash
VITE_CONVEX_URL=https://your-actual-deployment.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_aW5maW5pdGUtY2hpY2tlbi0yNi5jbGVyay5hY2NvdW50cy5kZXYk
```

**Note**: The Clerk key is already set in the `.env` file. If you need to use a different Clerk account, replace it with your own key.

---

## Step 3: Set up Clerk Authentication

### 3a. Create Clerk Account (If you haven't already)

1. Go to https://clerk.com
2. Sign up for a free account
3. Create a new application
4. Name it "JobFlow" or whatever you prefer

### 3b. Get your Publishable Key

1. In your Clerk Dashboard, go to **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_`)
3. Paste it in your `.env` file:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

**Note**: A Clerk key is already provided in `.env` for testing. You can use it or replace with your own.

### 3c. Enable Social Logins (Optional but recommended)

1. In Clerk Dashboard, go to **User & Authentication** → **Social Connections**
2. Enable **Google** and **Microsoft**
3. Follow Clerk's setup instructions for each provider

### 3d. Configure Allowed Origins

1. In Clerk Dashboard, go to **Settings** → **Allowed Origins**
2. Add: `http://localhost:5173`
3. Add any other domains where you'll deploy the app

---

## Step 4: Start the Development Server

### 4a. Start Convex Backend (Terminal 1)

```bash
npm run convex:dev
```

**Keep this running** - it watches for backend changes.

### 4b. Start Frontend Dev Server (Terminal 2)

Open a new terminal and run:

```bash
npm run dev
```

**Keep this running** - it serves your React app.

---

## Step 5: Open the Application

Visit http://localhost:5173 in your browser.

You should see:
- The JobFlow landing page
- A "Sign In" or "Get Started" button
- Clicking it opens the Clerk authentication modal

---

## Step 6: Create Your First User

1. Click **"Sign In"** or **"Get Started"**
2. Choose one of:
   - **Continue with Google** (if enabled)
   - **Continue with Microsoft** (if enabled)
   - **Sign up with Email** (enter email and password)
3. Complete the sign-up process
4. You'll be redirected to the Dashboard

---

## Verification Checklist

✅ Dependencies installed (`npm install`)  
✅ Convex running (`npm run convex:dev`)  
✅ Frontend running (`npm run dev`)  
✅ `.env` file has both keys  
✅ Can access http://localhost:5173  
✅ Can see Clerk sign-in button  
✅ Can sign up/sign in  
✅ Redirected to dashboard after login  

---

## Troubleshooting

### "Missing Publishable Key" Error

**Problem**: You see an error about missing Clerk publishable key.

**Solution**: 
1. Check that `.env` file exists in the `jobflow` directory
2. Verify `VITE_CLERK_PUBLISHABLE_KEY` is set
3. Restart the dev server (`Ctrl+C` then `npm run dev`)

### "Failed to resolve import convex/_generated/api"

**Problem**: Import errors for Convex generated files.

**Solution**:
1. Make sure `npx convex dev` is running in a separate terminal
2. Check that `convex/_generated/` directory exists
3. If not, run `npx convex dev` first

### Convex Authentication Errors

**Problem**: "Unauthorized" errors when using the app.

**Solution**:
1. Make sure you're signed in to Clerk
2. Verify Convex is running (`npm run convex:dev`)
3. Check that both terminals are active

### Port 5173 Already in Use

**Problem**: Dev server can't start because port is in use.

**Solution**:
```bash
# Kill the process using the port (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- --port 3000
```

### Styles Not Loading

**Problem**: Tailwind CSS styles not working.

**Solution**:
1. Check that `postcss.config.js` exists
2. Verify `tailwind.config.js` exists
3. Restart dev server
4. Hard refresh browser (Ctrl+Shift+R)

---

## Optional: Set up Additional Features

### Stripe (for Payments)

1. Create account at https://stripe.com
2. Get your API keys from Dashboard → Developers → API Keys
3. In **Convex Dashboard** → Settings → Environment Variables, add:
   ```
   STRIPE_SECRET_KEY=sk_test_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_secret
   STRIPE_CONNECT_CLIENT_ID=ca_your_client_id
   ```

### OpenAI (for AI Features)

1. Get API key from https://platform.openai.com
2. In **Convex Dashboard** → Settings → Environment Variables, add:
   ```
   OPENAI_API_KEY=sk-your_openai_key
   ```

---

## Development Workflow

### Daily Development

1. Open two terminals
2. Terminal 1: `npm run convex:dev`
3. Terminal 2: `npm run dev`
4. Code, test, repeat!

### Making Changes

**Backend Changes** (`convex/` folder):
- Convex auto-detects changes
- No restart needed
- Changes apply immediately

**Frontend Changes** (`src/` folder):
- Vite hot-reloads automatically
- Changes appear in browser instantly

**Schema Changes** (`convex/schema.ts`):
- Convex validates and applies
- Existing data preserved (if compatible)
- May need data migration for breaking changes

---

## Next Steps

1. ✅ App is running locally
2. ✅ Sign up and explore features
3. ✅ Create STAR stories
4. ✅ Generate a resume
5. ✅ Track job applications
6. ✅ Browse coach directory

### Ready to Deploy?

See **Deployment Guide** in `CHECKLIST.md`

---

## Common Commands

```bash
# Development
npm run dev              # Start frontend
npm run convex:dev       # Start backend
npm run build            # Build for production

# Deployment
npx convex deploy --prod # Deploy backend
vercel                   # Deploy frontend (if using Vercel)

# Utilities
npm run lint             # Run ESLint
npm install              # Install/update dependencies
```

---

## Environment Variables Summary

```bash
# Required
VITE_CONVEX_URL=https://your-deployment.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key

# Optional (set in Convex Dashboard, not .env)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_CONNECT_CLIENT_ID=ca_your_connect_id
OPENAI_API_KEY=sk-your_openai_key
```

---

## Support Resources

- **Convex Docs**: https://docs.convex.dev
- **Clerk Docs**: https://clerk.com/docs
- **Vite Docs**: https://vite.dev
- **React Docs**: https://react.dev
- **Troubleshooting**: See `TROUBLESHOOTING.md`

---

**You're all set! Happy coding!** 🚀

Last updated: November 13, 2025
