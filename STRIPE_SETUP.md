# Stripe Integration Setup Guide

This document provides instructions for setting up Stripe integration for JobFlow's payment system.

## Overview

The Stripe integration handles:
- One-time payments for verification tasks and coaching sessions
- Subscription management (Free, Premium, Pro plans)
- Payment intents and checkout sessions
- Webhook event processing
- Refunds and payment history

## Environment Variables

Add the following environment variables to your `.env` file:

### Required Variables

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...           # Your Stripe secret key (test or live)
STRIPE_WEBHOOK_SECRET=whsec_...         # Webhook signing secret

# Subscription Price IDs
STRIPE_PREMIUM_PRICE_ID=price_...       # Premium plan price ID
STRIPE_PRO_PRICE_ID=price_...           # Pro plan price ID

# Application URLs
SITE_URL=http://localhost:3000          # Your application URL
```

## Getting Your Stripe Keys

### 1. Get API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** > **API keys**
3. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)
4. Add to `.env` as `STRIPE_SECRET_KEY`

### 2. Create Products and Prices

#### Premium Plan ($9.99/month)
1. Go to **Products** in Stripe Dashboard
2. Click **Add product**
3. Fill in:
   - Name: "JobFlow Premium"
   - Description: "Premium subscription with enhanced features"
   - Pricing: $9.99 USD, Recurring monthly
4. Copy the **Price ID** (starts with `price_`)
5. Add to `.env` as `STRIPE_PREMIUM_PRICE_ID`

#### Pro Plan ($29.99/month)
1. Create another product
2. Fill in:
   - Name: "JobFlow Pro"
   - Description: "Pro subscription with unlimited features"
   - Pricing: $29.99 USD, Recurring monthly
3. Copy the **Price ID**
4. Add to `.env` as `STRIPE_PRO_PRICE_ID`

### 3. Set Up Webhooks

1. Go to **Developers** > **Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL:
   - Local development: Use [Stripe CLI](https://stripe.com/docs/stripe-cli) for testing
   - Production: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `charge.refunded`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to `.env` as `STRIPE_WEBHOOK_SECRET`

## Testing with Stripe CLI

For local development, use Stripe CLI to forward webhook events:

```bash
# Install Stripe CLI
# Visit: https://stripe.com/docs/stripe-cli#install

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This will give you a webhook signing secret for local testing.

## Test Card Numbers

Use these test card numbers in development:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

Use any future expiry date and any 3-digit CVC.

## Pricing Structure

### Verification Tasks
- Quick Review: $29.99
- Full Review: $49.99
- Cover Letter Review: $19.99

### Subscription Plans
- **Free**: $0/month
  - 3 resumes
  - 5 AI generations
  - 10 job tracking entries

- **Premium**: $9.99/month
  - 10 resumes
  - 50 AI generations
  - 100 job tracking entries
  - Email support
  - Coaching discount

- **Pro**: $29.99/month
  - Unlimited resumes
  - Unlimited AI generations
  - Unlimited job tracking
  - Priority support
  - Included coaching sessions
  - Marketplace priority

### Coaching Sessions
- Base rate: $50/hour minimum
- Actual rates set by individual coaches

## API Endpoints

### Payment Actions

```typescript
// Create payment intent for verification
api.stripeActions.createVerificationPaymentIntent({
  taskId: Id<"verificationTasks">,
  taskType: "resume_review_quick" | "resume_review_full" | "cover_letter_review"
})

// Create payment intent for session
api.stripeActions.createSessionPaymentIntent({
  sessionId: Id<"sessions">,
  amount: number
})

// Create subscription checkout
api.stripeActions.createSubscriptionCheckout({
  plan: "premium" | "pro"
})

// Create payment checkout (one-time)
api.stripeActions.createPaymentCheckout({
  type: "verification" | "session",
  amount: number,
  description: string,
  taskId?: Id<"verificationTasks">,
  sessionId?: Id<"sessions">
})

// Process refund
api.stripeActions.processRefund({
  paymentId: Id<"payments">,
  reason?: "duplicate" | "fraudulent" | "requested_by_customer",
  amount?: number
})

// Cancel subscription
api.stripeActions.cancelUserSubscription({
  subscriptionId: Id<"subscriptions">
})

// Get customer portal URL
api.stripeActions.createCustomerPortalSession()
```

### Subscription Queries

```typescript
// Get current subscription
api.subscriptions.getCurrent()

// Check if has active subscription
api.subscriptions.hasActiveSubscription()

// Get features for a plan
api.subscriptions.getFeatures({ plan: "free" | "premium" | "pro" })

// Check feature access
api.subscriptions.canAccessFeature({ feature: "unlimited_resumes" })
```

### Payment Queries

```typescript
// List payments
api.payments.list({
  type?: "verification" | "session" | "subscription",
  status?: "pending" | "succeeded" | "failed" | "refunded"
})

// Get payment by ID
api.payments.get({ id: Id<"payments"> })
```

## Webhook Flow

1. **Payment Intent Succeeded**
   - Updates payment status to "succeeded"
   - For verification tasks: Updates task status to "in_progress"
   - For sessions: Confirms session booking

2. **Payment Intent Failed**
   - Updates payment status to "failed"

3. **Checkout Session Completed**
   - For subscriptions: Creates subscription record
   - For one-time payments: Updates payment status

4. **Subscription Events**
   - Creates/updates subscription records
   - Handles subscription lifecycle (active, cancelled, expired)

5. **Charge Refunded**
   - Updates payment status to "refunded"

## Security Best Practices

1. **Never expose secret keys**
   - Keep `STRIPE_SECRET_KEY` server-side only
   - Use environment variables, never commit to git

2. **Verify webhook signatures**
   - Always verify webhook signatures using `STRIPE_WEBHOOK_SECRET`
   - Prevents unauthorized webhook spoofing

3. **Use HTTPS in production**
   - Stripe requires HTTPS for webhooks in production
   - Use SSL certificates for your domain

4. **Implement idempotency**
   - Handle duplicate webhook events gracefully
   - Check payment status before processing

5. **Test thoroughly**
   - Use test mode extensively before going live
   - Test all payment flows and edge cases

## Going Live

Before switching to production:

1. ✅ Test all payment flows in test mode
2. ✅ Set up production webhook endpoints
3. ✅ Replace test keys with live keys
4. ✅ Update price IDs to production prices
5. ✅ Configure production SITE_URL
6. ✅ Enable HTTPS on your domain
7. ✅ Test with real cards (small amounts)
8. ✅ Set up monitoring and alerts

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Convex Documentation](https://docs.convex.dev/)

## Troubleshooting

### Webhook not receiving events
- Check webhook URL is correct and accessible
- Verify HTTPS is enabled (production)
- Check Stripe Dashboard webhook logs
- Ensure signing secret is correct

### Payment fails immediately
- Check API keys are valid
- Verify test card numbers
- Check Stripe Dashboard for error details

### Subscription not updating
- Verify price IDs are correct
- Check webhook events are being received
- Review subscription status in Stripe Dashboard
