# Stripe Connect Setup Guide

This document explains how to set up and use Stripe Connect for coach payouts in the JobFlow marketplace.

## Overview

Stripe Connect enables the marketplace payment model where:
1. Customers pay JobFlow for verification tasks and coaching sessions
2. JobFlow automatically splits payments with coaches
3. Coaches receive payouts directly to their bank accounts
4. Platform takes a 15% fee on each transaction

## Architecture

### Payment Flow
```
Customer Payment ($100)
    ↓
JobFlow Platform
    ├─→ Platform Fee (15%): $15
    └─→ Coach Payout (85%): $85
            ↓
        Coach's Bank Account
```

### Connect Account Types

We use **Express** accounts for coaches because:
- Easier onboarding (Stripe-hosted forms)
- Faster setup process
- Stripe handles compliance and verification
- Coaches get Stripe Express dashboard

## Environment Variables

Add these to your `.env` file:

```bash
# From STRIPE_SETUP.md
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Additional for Connect
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_...  # Separate webhook for Connect events
SITE_URL=http://localhost:3000
```

## Setting Up Connect

### 1. Enable Connect in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Connect** > **Settings**
3. Click **Get started** if not already enabled
4. Configure platform settings:
   - Name: "JobFlow"
   - Support email: your-support@email.com
   - Brand icon/logo (optional)

### 2. Configure Connect Settings

Under **Connect** > **Settings**:

- **Account types**: Enable "Express" accounts
- **Branding**: Upload your logo and colors
- **Public details**: Add company information
- **Redirect URIs**: Add your return and refresh URLs:
  - `http://localhost:3000/coach/onboarding/complete`
  - `http://localhost:3000/coach/onboarding/refresh`

### 3. Set Up Connect Webhooks

1. Go to **Developers** > **Webhooks**
2. Click **Add endpoint**
3. Enter webhook URL:
   - Local: Use Stripe CLI
   - Production: `https://yourdomain.com/api/stripe/connect/webhook`
4. Select Connect events:
   - `account.updated`
   - `account.external_account.created`
   - `account.external_account.updated`
   - `account.external_account.deleted`
   - `capability.updated`
   - `transfer.created`
   - `transfer.updated`
   - `transfer.reversed`
   - `payout.created`
   - `payout.updated`
   - `payout.paid`
   - `payout.failed`
5. Copy **Signing secret** → `STRIPE_CONNECT_WEBHOOK_SECRET`

## Coach Onboarding Flow

### 1. Create Connect Account

```typescript
// Coach initiates onboarding
const result = await ctx.action(api.stripeConnectActions.createCoachConnectAccount, {
  coachId: coachId,
});

// Returns:
// {
//   accountId: "acct_...",
//   detailsSubmitted: false,
//   chargesEnabled: false,
//   payoutsEnabled: false
// }
```

### 2. Generate Onboarding Link

```typescript
const onboarding = await ctx.action(
  api.stripeConnectActions.getCoachOnboardingLink,
  {
    coachId: coachId,
  }
);

// Redirect coach to onboarding.url
window.location.href = onboarding.url;
```

### 3. Coach Completes Onboarding

Coach is redirected to Stripe-hosted onboarding form where they:
1. Provide business information
2. Add bank account details
3. Verify identity
4. Accept Stripe Terms of Service

### 4. Return to Platform

After completion, coach is redirected to:
- Success: `/coach/onboarding/complete`
- Refresh needed: `/coach/onboarding/refresh`

### 5. Check Account Status

```typescript
const status = await ctx.action(
  api.stripeConnectActions.getCoachAccountStatus,
  {
    coachId: coachId,
  }
);

// Returns:
// {
//   hasAccount: true,
//   accountId: "acct_...",
//   detailsSubmitted: true,
//   chargesEnabled: true,
//   payoutsEnabled: true,
//   country: "US",
//   email: "coach@example.com"
// }
```

## Processing Payouts

### Automatic Payout Flow

Payouts are automatically processed when:
1. Verification task is completed
2. Coaching session is completed
3. Customer payment has succeeded

### Task Payout Example

```typescript
// After task completion and payment success
const payout = await ctx.action(api.stripeConnectActions.processTaskPayout, {
  taskId: taskId,
  paymentId: paymentId,
});

// Returns:
// {
//   transferId: "tr_...",
//   amount: 42.49,      // Coach receives 85%
//   platformFee: 7.50,  // Platform keeps 15%
//   status: "paid"
// }
```

### Session Payout Example

```typescript
const payout = await ctx.action(api.stripeConnectActions.processSessionPayout, {
  sessionId: sessionId,
  paymentId: paymentId,
});
```

## Platform Fee Structure

### Default Configuration

```typescript
PLATFORM_FEES = {
  MARKETPLACE_PERCENTAGE: 0.15,  // 15%
  MINIMUM_FEE: 0.50,             // $0.50 minimum
  MAXIMUM_FEE: 100,              // $100 maximum
}
```

### Fee Calculation Examples

| Amount | Platform Fee (15%) | Coach Payout (85%) |
|--------|-------------------|-------------------|
| $10    | $1.50             | $8.50            |
| $50    | $7.50             | $42.50           |
| $100   | $15.00            | $85.00           |
| $500   | $75.00            | $425.00          |
| $1000  | $100 (max)        | $900.00          |

### Calculate Fee Estimate

```typescript
const estimate = await ctx.action(
  api.stripeConnectActions.calculateFeeEstimate,
  {
    amount: 100,
  }
);

// Returns:
// {
//   amount: 100,
//   platformFee: 15,
//   coachPayout: 85,
//   feePercentage: 15
// }
```

## Coach Dashboard & Analytics

### Get Balance

```typescript
const balance = await ctx.action(api.stripeConnectActions.getCoachBalance, {
  coachId: coachId,
});

// Returns:
// {
//   available: 250.50,  // Available for payout
//   pending: 100.00,    // Processing
//   currency: "usd"
// }
```

### Payout History

```typescript
const payouts = await ctx.action(api.stripeConnectActions.getCoachPayouts, {
  coachId: coachId,
  limit: 20,
});

// Returns array of:
// {
//   id: "po_...",
//   amount: 85.00,
//   currency: "usd",
//   status: "paid",
//   arrivalDate: 1234567890,
//   description: "Payout for task...",
//   created: 1234567890
// }
```

### Transfer History

```typescript
const transfers = await ctx.action(api.stripeConnectActions.getCoachTransfers, {
  coachId: coachId,
  limit: 20,
});
```

### Earnings Summary

```typescript
const summary = await ctx.runQuery(api.payouts.getEarningsSummary, {
  coachId: coachId,
});

// Returns:
// {
//   totalEarnings: 5000,
//   totalPlatformFees: 882,
//   totalPaid: 4500,
//   totalPending: 500,
//   totalFailed: 0,
//   totalPayouts: 50,
//   paidCount: 45,
//   pendingCount: 5,
//   failedCount: 0,
//   monthlyBreakdown: { "2025-01": 1500, "2025-02": 1800, ... },
//   averagePayoutAmount: 100
// }
```

### Stripe Express Dashboard

Coaches can access their full Stripe dashboard:

```typescript
const dashboard = await ctx.action(
  api.stripeConnectActions.getCoachDashboardLink,
  {
    coachId: coachId,
  }
);

// Redirect to dashboard.url
window.location.href = dashboard.url;
```

The dashboard provides:
- Detailed transaction history
- Payout schedule
- Bank account management
- Tax documents
- Support contact

## Payout Database Tracking

### Payout Record Structure

```typescript
{
  _id: Id<"payouts">,
  coachId: Id<"coaches">,
  taskId?: Id<"verificationTasks">,
  sessionId?: Id<"sessions">,
  amount: number,              // Coach payout amount
  platformFee: number,         // Platform fee
  status: "pending" | "paid" | "failed" | "cancelled",
  stripeTransferId?: string,
  stripePayoutId?: string,
  createdAt: number,
  paidAt?: number
}
```

### Query Payouts

```typescript
// List by coach
const payouts = await ctx.runQuery(api.payouts.listByCoach, {
  coachId: coachId,
  status: "paid", // optional filter
});

// Get by task
const payout = await ctx.runQuery(api.payouts.getByTask, {
  taskId: taskId,
});

// Get by session
const payout = await ctx.runQuery(api.payouts.getBySession, {
  sessionId: sessionId,
});
```

## Admin Platform Analytics

For platform administrators:

```typescript
// Platform-wide fee statistics
const stats = await ctx.runQuery(api.payouts.getPlatformStats, {});

// Returns:
// {
//   totalPlatformFees: 15000,
//   totalPayouts: 85000,
//   totalGrossRevenue: 100000,
//   averagePlatformFee: 15,
//   feePercentage: 15,
//   totalTransactions: 1000
// }
```

## Testing

### Test Bank Accounts

Use these test bank account numbers:

**Success (US)**
- Routing: `110000000`
- Account: `000123456789`

**Requires Verification**
- Routing: `110000000`
- Account: `000111111116`

**Failure (Incorrect Account)**
- Routing: `110000000`
- Account: `000111111113`

### Test with Stripe CLI

```bash
# Forward Connect webhooks
stripe listen --forward-to localhost:3000/api/stripe/connect/webhook \\
  --events account.updated,transfer.created,payout.paid

# Trigger test events
stripe trigger account.updated
stripe trigger transfer.created
stripe trigger payout.paid
```

### Manual Testing Flow

1. Create coach account
2. Get onboarding link
3. Complete onboarding with test data
4. Create verification task
5. Make payment
6. Complete task
7. Process payout
8. Check coach balance
9. Verify transfer in Stripe Dashboard

## Payout Schedule

### Stripe's Default Schedule

- **Daily**: Payouts every business day
- **Weekly**: Payouts once per week
- **Monthly**: Payouts once per month

### Payout Timing

- Funds are typically available 2-7 business days after transfer
- Varies by country and bank
- First payout may take longer (up to 14 days)

### Balance Availability

- Payments are held for 2 days before becoming available
- Protects against fraud and chargebacks
- Can be customized per account

## Security Best Practices

1. **Verify Coach Identity**
   - Stripe handles KYC/AML verification
   - Check `details_submitted` before enabling payouts

2. **Validate Payouts**
   - Only process payouts for completed tasks/sessions
   - Verify payment succeeded before payout
   - Track all payouts in database

3. **Handle Failures**
   - Monitor webhook events for failures
   - Notify coaches of issues
   - Provide clear resolution steps

4. **Rate Limiting**
   - Don't create multiple accounts for same coach
   - Limit onboarding link generation
   - Cache account status

5. **Audit Trail**
   - Log all payout operations
   - Store Stripe IDs for reference
   - Track platform fee calculations

## Troubleshooting

### Coach Can't Receive Payouts

1. Check account status: `getCoachAccountStatus`
2. Verify `payoutsEnabled: true`
3. Confirm bank account added
4. Check for Stripe restrictions
5. Review webhook events for errors

### Transfer Failed

1. Check account balance
2. Verify account not restricted
3. Confirm bank account valid
4. Review transfer in Stripe Dashboard
5. Check webhook logs

### Onboarding Link Expired

1. Generate new link (expires after 1 hour)
2. Use refresh URL to continue onboarding
3. Don't create duplicate accounts

## Going Live

Before production:

1. ✅ Complete platform onboarding in Stripe
2. ✅ Verify business information
3. ✅ Test full payment flow
4. ✅ Set up Connect webhooks
5. ✅ Configure payout schedules
6. ✅ Review fee structure
7. ✅ Update environment variables
8. ✅ Test with real bank accounts (small amounts)
9. ✅ Set up monitoring and alerts
10. ✅ Prepare coach support documentation

## Resources

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Express Accounts Guide](https://stripe.com/docs/connect/express-accounts)
- [Testing Connect](https://stripe.com/docs/connect/testing)
- [Connect Webhooks](https://stripe.com/docs/connect/webhooks)

## Support

For issues or questions:
- Stripe Support: [support.stripe.com](https://support.stripe.com/)
- Stripe API Reference: [stripe.com/docs/api](https://stripe.com/docs/api)
- Connect Community: [stripe.com/connect/community](https://stripe.com/connect/community)
