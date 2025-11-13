# JobFlow Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd jobflow
npm install
```

### 2. Set Up Convex

```bash
npx convex dev
```

When prompted:
1. Visit the URL provided to log in to Convex
2. Create a new project or select an existing one
3. The CLI will automatically configure your `.env` file

### 3. Set Up Clerk Authentication

1. Go to https://clerk.com and sign up
2. Create a new application
3. Go to "API Keys" and copy your Publishable Key
4. Add to `.env`:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```

5. Configure social logins:
   - In Clerk dashboard, go to "User & Authentication" > "Social Connections"
   - Enable Google and Microsoft
   - Follow Clerk's instructions to set up OAuth apps

### 4. (Optional) Set Up Stripe Payments

1. Go to https://stripe.com and create an account
2. Get your API keys from the Stripe Dashboard
3. In Convex dashboard, go to Settings > Environment Variables
4. Add:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

5. Set up Stripe Connect for coach payouts:
   ```
   STRIPE_CONNECT_CLIENT_ID=ca_...
   ```

### 5. (Optional) Set Up OpenAI for AI Features

1. Get an API key from https://platform.openai.com
2. In Convex dashboard, add environment variable:
   ```
   OPENAI_API_KEY=sk-...
   ```

### 6. Start Development

```bash
npm run dev
```

Open http://localhost:5173

## Environment Variables

Create a `.env` file in the project root:

```bash
# Required
VITE_CONVEX_URL=https://your-project.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Optional (set in Convex dashboard, not .env)
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# OPENAI_API_KEY=sk-...
```

## Database Schema

The schema is defined in `convex/schema.ts`. It includes:

- `users` - User accounts and profiles
- `starStories` - STAR method stories
- `resumes` - Generated resumes
- `jobs` - Job postings and saved jobs
- `applications` - Job application tracking
- `coaches` - Coach profiles
- `sessions` - Coaching sessions
- `verificationTasks` - Resume verification marketplace
- `bids` - Coach bids on tasks
- `reviews` - Coach reviews
- `payments` - Payment records
- `subscriptions` - User subscriptions
- `messages` - Messaging system

## Development Workflow

### Running the App

1. Terminal 1 - Frontend:
   ```bash
   npm run dev
   ```

2. Terminal 2 - Backend:
   ```bash
   npm run convex:dev
   ```

### Making Changes

#### Backend Changes (Convex)

1. Edit files in `convex/` directory
2. Convex automatically detects and deploys changes
3. No restart needed

#### Frontend Changes

1. Edit files in `src/` directory
2. Vite hot-reloads automatically
3. No restart needed

#### Schema Changes

1. Edit `convex/schema.ts`
2. Convex validates and applies changes
3. Existing data is preserved (backward-compatible changes)
4. For breaking changes, you may need to migrate data manually

## Testing

### Manual Testing

1. Sign up as a job seeker
2. Create STAR stories
3. Generate a resume
4. Track job applications
5. Sign up as a coach (new account)
6. Browse marketplace
7. Place bids on verification tasks

### Test Accounts

Create test accounts with:
- Job seeker role
- Coach role
- Admin role (for moderation)

## Deployment

### Deploy Backend (Convex)

```bash
npx convex deploy --prod
```

This deploys:
- All backend functions
- Database schema
- Environment variables (from dashboard)

### Deploy Frontend

#### Option 1: Vercel

```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard:
- `VITE_CONVEX_URL` - Your production Convex URL
- `VITE_CLERK_PUBLISHABLE_KEY` - Your production Clerk key

#### Option 2: Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

Set environment variables in Netlify dashboard.

#### Option 3: Manual

```bash
npm run build
```

Upload the `dist/` folder to any static hosting service.

### Post-Deployment

1. Update Clerk settings:
   - Add production domain to allowed origins
   - Update redirect URLs

2. Update Stripe webhook URL:
   - Point to your production domain + `/api/webhooks/stripe`

3. Test all features in production

## Common Issues

### Convex connection errors

- Make sure `VITE_CONVEX_URL` is set correctly
- Check that `npx convex dev` is running
- Verify internet connection

### Authentication not working

- Check `VITE_CLERK_PUBLISHABLE_KEY` is correct
- Verify Clerk application is properly configured
- Make sure social login providers are enabled in Clerk

### Payment errors

- Verify Stripe keys are set in Convex dashboard
- Check Stripe webhook endpoint is configured
- Test with Stripe test cards

### Build errors

- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Convex cache: `rm -rf .convex`
- Check TypeScript errors: `npx tsc --noEmit`

## Support

- Convex docs: https://docs.convex.dev
- Clerk docs: https://clerk.com/docs
- Stripe docs: https://stripe.com/docs
- React Router docs: https://reactrouter.com

## Next Steps

1. Customize branding and colors in `tailwind.config.js`
2. Add custom domain
3. Set up analytics (Google Analytics, Mixpanel, etc.)
4. Configure email templates in Clerk
5. Set up monitoring (Sentry, LogRocket, etc.)
6. Add rate limiting for API calls
7. Implement caching strategies
8. Add comprehensive error handling
9. Write automated tests
10. Set up CI/CD pipeline

---

Last updated: November 13, 2025
