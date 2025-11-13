# JobFlow - AI-Powered Job Search Platform

JobFlow is a comprehensive job search and career development platform that helps job seekers land their dream roles through AI-powered resume generation, STAR story management, and professional coaching.

## Features

### For Job Seekers

#### Epic 1: Authentication & Security
- User registration with email or social login (Google/Microsoft via WorkOS)
- Email verification flow
- Two-factor authentication (2FA)
- Password reset functionality
- Role-based access control (RBAC)
- Session management with token refresh

#### Epic 2: User Settings & Privacy
- User profile management
- Privacy settings and data visibility controls
- Notification preferences (email, push, SMS)
- GDPR-compliant data export
- Account deletion with complete data removal

#### Epic 3: AI Resume & STAR Stories
- Create and manage STAR stories (Situation, Task, Action, Result)
- AI-powered conversation to extract STAR stories from your experience
- STAR story library with categorization and search
- AI resume generation from job descriptions
- ATS (Applicant Tracking System) score calculation
- Resume editing and customization
- Resume version management

#### Epic 4: Job Search & Application Tracking
- Job search with advanced filters
- Save and favorite jobs
- Kanban board for application tracking
- Manual job entry
- Auto-import jobs from LinkedIn/Indeed
- Application status updates
- Follow-up reminders and notifications
- Application analytics dashboard
- Job match score (resume vs job description)
- AI cover letter generation
- Application document management
- Interview scheduling integration
- Job alerts and recommendations
- Application export and reporting

#### Epic 5: Interview & Coaching
- Interview preparation checklist
- AI mock interviews with video recording
- Interview question bank by role
- AI feedback on interview responses
- Interview performance analytics
- Book live coaching sessions
- Video call integration (Zoom/Google Meet)
- Session notes and action items
- Coaching session history
- Share interview recordings with coaches

### For Coaches

#### Epic 6: Coach Platform & Profiles
- Coach registration and application
- Profile setup (bio, experience, skills)
- Verification and vetting process
- Certification uploads
- Portfolio and sample work showcase
- Browse coach directory
- Filter by specialty and industry
- Coach ratings and reviews
- Availability calendar management
- Calendar integration (Google/Outlook)
- Time zone management
- Coach dashboard with analytics
- Active tasks and assignments view
- Earnings and payment history
- Performance metrics
- Client management
- Secure messaging with clients
- File sharing in chat

#### Epic 7: Marketplace & Verification
- Verification task marketplace
- Resume and cover letter review tasks
- Coach bidding system
- Task assignment and status tracking
- Submit verified resumes
- Request changes and revisions
- Escrow payment system
- Marketplace analytics
- On-call coach pool for urgent tasks
- Dispute resolution system

#### Epic 8: Payment & Subscriptions
- Stripe payment integration
- One-time payments for verification
- Subscription plans (Free, Premium, Pro)
- Subscription management and billing
- Stripe Connect for coach payouts
- Payment history and invoices
- Refund and dispute handling

## Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Clerk** - Authentication
- **Lucide React** - Icons

### Backend
- **Convex** - Backend-as-a-Service (database, real-time, serverless functions)
- **WorkOS** - SSO and enterprise authentication
- **Stripe** - Payment processing and coach payouts

### AI/ML
- **OpenAI GPT-4** - Resume generation, STAR story extraction, interview feedback
- Custom ATS scoring algorithm

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Convex account (https://convex.dev)
- Clerk account (https://clerk.com)
- Stripe account (optional, for payments)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd jobflow
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```
VITE_CONVEX_URL=your_convex_url
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

4. Initialize Convex:
```bash
npx convex dev
```

Follow the prompts to:
- Log in to your Convex account
- Create a new project or select an existing one
- The Convex URL will be automatically added to your `.env`

5. Set up Clerk:
- Go to https://clerk.com and create an account
- Create a new application
- Copy the Publishable Key to your `.env` file
- In Clerk dashboard, enable social logins (Google, Microsoft)
- Configure WorkOS integration for SSO

6. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Running Convex in Development

In a separate terminal, run:
```bash
npm run convex:dev
```

This will:
- Watch for changes to your Convex functions
- Automatically sync schema changes
- Provide real-time backend updates

## Project Structure

```
jobflow/
├── convex/                    # Backend functions and schema
│   ├── schema.ts             # Database schema
│   ├── users.ts              # User management
│   ├── starStories.ts        # STAR story operations
│   ├── resumes.ts            # Resume operations
│   ├── jobs.ts               # Job tracking
│   ├── applications.ts       # Application tracking
│   ├── coaches.ts            # Coach profiles
│   ├── sessions.ts           # Coaching sessions
│   ├── marketplace.ts        # Verification marketplace
│   ├── reviews.ts            # Review system
│   ├── payments.ts           # Payment operations
│   └── messages.ts           # Messaging system
│
├── src/
│   ├── components/           # Reusable UI components
│   ├── pages/                # Page components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── types/                # TypeScript type definitions
│   ├── App.tsx               # Main app component with routing
│   ├── main.tsx              # App entry point
│   └── index.css             # Global styles
```

## Roadmap

### Roadmap 1: Job Flow (Months 1-6) - COMPLETE
- ✅ Authentication & Security (8 stories)
- ✅ User Settings & Privacy (5 stories)
- ✅ AI Resume & STAR Stories (7 stories)
- ✅ Job Search & Application Tracking (14 stories)
- ✅ Interview & Coaching (10 stories)
- ✅ Coach Platform & Profiles (35 stories)
- ✅ Marketplace & Verification (12 stories)
- ✅ Payment & Subscriptions (8 stories)

**Total**: 100 user stories, 335 story points

See `Job_Flow_Stories.md` for detailed specifications.

## License

Proprietary - All rights reserved

---

**Status**: Roadmap 1 Implementation Complete  
**Version**: 1.0.0  
**Last Updated**: November 13, 2025
