# JobFlow - Quick Start Guide

Get JobFlow running locally in 5 minutes!

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## Installation

```bash
cd jobflow
npm install
```

## Configuration

### 1. Convex Backend

```bash
npx convex dev
```

Follow the prompts:
1. Log in or create a Convex account
2. Create a new project
3. Your `.env` file will be auto-configured with `VITE_CONVEX_URL`

### 2. Clerk Authentication

1. Sign up at https://clerk.com
2. Create a new application
3. Copy your Publishable Key
4. Add to `.env`:
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

5. In Clerk dashboard:
   - Go to "User & Authentication" > "Social Connections"
   - Enable Google and Microsoft

## Run the App

### Terminal 1 - Frontend
```bash
npm run dev
```

### Terminal 2 - Backend
```bash
npm run convex:dev
```

Open http://localhost:5173

## First Steps

1. **Sign Up** - Create an account (job seeker or coach)
2. **Create STAR Stories** - Add your experiences
3. **Generate Resume** - Use AI to create a resume
4. **Track Jobs** - Add jobs and track applications
5. **Browse Coaches** - Find professional coaches
6. **Test Marketplace** - Create verification tasks

## Project Structure

```
jobflow/
├── convex/           # Backend (Convex functions)
├── src/
│   ├── pages/        # 12 pages
│   ├── components/   # 7 reusable components
│   ├── hooks/        # Custom hooks
│   ├── lib/          # Utilities
│   └── types/        # TypeScript types
```

## Key Features

### For Job Seekers
- ✅ STAR story management
- ✅ AI resume generation
- ✅ Job tracking (Kanban)
- ✅ Coach directory
- ✅ Coaching sessions
- ✅ Resume verification marketplace

### For Coaches
- ✅ Coach profile & portfolio
- ✅ Calendar management
- ✅ Marketplace bidding
- ✅ Client messaging
- ✅ Earnings dashboard

## Optional Setup

### Stripe (for payments)
1. Get API keys from https://stripe.com
2. In Convex dashboard, add:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

### OpenRouter AI (for AI features)
AI integration is **already configured** with OpenRouter using Moonshot AI Kimi K2 Thinking model.

**API Key**: Pre-configured in `convex/ai.ts`
- Model: `moonshotai/kimi-k2-thinking`
- Features: Resume generation, ATS scoring, STAR story extraction, cover letters, interview prep

**Optional**: To use your own OpenRouter key:
1. Get API key from https://openrouter.ai
2. Update the API key in `convex/ai.ts` line 6

## Common Commands

```bash
npm run dev              # Start frontend
npm run build            # Build for production
npm run convex:dev       # Start Convex backend
npx convex deploy --prod # Deploy to production
```

## Troubleshooting

### Convex not connecting
- Check `VITE_CONVEX_URL` in `.env`
- Ensure `npx convex dev` is running

### Auth not working
- Verify `VITE_CLERK_PUBLISHABLE_KEY` is set
- Check Clerk dashboard configuration

### Build errors
```bash
rm -rf node_modules && npm install
rm -rf .convex
```

## Next Steps

1. Read `IMPLEMENTATION_STATUS.md` for feature details
2. See `SETUP.md` for complete setup guide
3. Check `DOCUMENTATION.md` for architecture info
4. Review user stories in `../Job_Flow_Stories.md`

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Convex (serverless, real-time)
- **Auth**: Clerk (with WorkOS SSO)
- **Payments**: Stripe
- **AI**: OpenRouter (Moonshot AI Kimi K2 Thinking)

## Support

- Convex docs: https://docs.convex.dev
- Clerk docs: https://clerk.com/docs
- Component examples: `src/components/`

---

**Ready to build?** Start with `npm run dev` and explore the app!

Last updated: November 13, 2025
