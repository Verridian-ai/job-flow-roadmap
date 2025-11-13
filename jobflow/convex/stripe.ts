/**
 * Stripe Integration Helper Functions
 * Handles Stripe API interactions for payments, subscriptions, and Connect
 */

import Stripe from "stripe";

// Initialize Stripe with API key from environment
// Note: This should be called from Convex actions (not mutations/queries)
export function getStripeClient(): Stripe {
  const apiKey = process.env.STRIPE_SECRET_KEY;

  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }

  return new Stripe(apiKey, {
    apiVersion: "2024-11-20.acacia",
    typescript: true,
  });
}

/**
 * Create a payment intent for one-time payments
 */
export async function createPaymentIntent(
  amount: number,
  currency: string,
  metadata: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeClient();

  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

/**
 * Create a checkout session for payments
 */
export async function createCheckoutSession(params: {
  customerId?: string;
  customerEmail?: string;
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
  mode: "payment" | "subscription";
  successUrl: string;
  cancelUrl: string;
  metadata: Record<string, string>;
}): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeClient();

  return await stripe.checkout.sessions.create({
    customer: params.customerId,
    customer_email: params.customerEmail,
    line_items: params.lineItems,
    mode: params.mode,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
  });
}

/**
 * Retrieve a payment intent by ID
 */
export async function retrievePaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeClient();
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}

/**
 * Update payment intent metadata
 */
export async function updatePaymentIntent(
  paymentIntentId: string,
  metadata: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeClient();
  return await stripe.paymentIntents.update(paymentIntentId, {
    metadata,
  });
}

/**
 * Create a customer in Stripe
 */
export async function createCustomer(
  email: string,
  name: string,
  metadata: Record<string, string>
): Promise<Stripe.Customer> {
  const stripe = getStripeClient();

  return await stripe.customers.create({
    email,
    name,
    metadata,
  });
}

/**
 * Retrieve a customer by ID
 */
export async function retrieveCustomer(
  customerId: string
): Promise<Stripe.Customer> {
  const stripe = getStripeClient();
  return await stripe.customers.retrieve(customerId) as Stripe.Customer;
}

/**
 * Create a subscription
 */
export async function createSubscription(params: {
  customerId: string;
  priceId: string;
  metadata: Record<string, string>;
}): Promise<Stripe.Subscription> {
  const stripe = getStripeClient();

  return await stripe.subscriptions.create({
    customer: params.customerId,
    items: [{ price: params.priceId }],
    metadata: params.metadata,
  });
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  const stripe = getStripeClient();
  return await stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Create a refund
 */
export async function createRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: Stripe.RefundCreateParams.Reason
): Promise<Stripe.Refund> {
  const stripe = getStripeClient();

  const params: Stripe.RefundCreateParams = {
    payment_intent: paymentIntentId,
  };

  if (amount) {
    params.amount = Math.round(amount * 100);
  }

  if (reason) {
    params.reason = reason;
  }

  return await stripe.refunds.create(params);
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Stripe.Event {
  const stripe = getStripeClient();
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

/**
 * Price configuration for different service types
 */
export const PRICING = {
  VERIFICATION: {
    QUICK_REVIEW: 2999, // $29.99
    FULL_REVIEW: 4999, // $49.99
    COVER_LETTER: 1999, // $19.99
  },
  SUBSCRIPTION: {
    FREE: 0,
    PREMIUM: 999, // $9.99/month
    PRO: 2999, // $29.99/month
  },
  COACHING: {
    BASE_RATE: 5000, // $50/hour minimum
  },
} as const;
