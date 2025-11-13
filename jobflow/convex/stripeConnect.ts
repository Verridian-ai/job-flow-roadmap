/**
 * Stripe Connect Integration
 * Handles coach payouts and marketplace payments
 */

import Stripe from "stripe";
import { getStripeClient } from "./stripe";

/**
 * Create a Stripe Connect account for a coach
 */
export async function createConnectAccount(params: {
  email: string;
  country?: string;
  metadata: Record<string, string>;
}): Promise<Stripe.Account> {
  const stripe = getStripeClient();

  const account = await stripe.accounts.create({
    type: "express", // Express accounts are easier to onboard
    email: params.email,
    country: params.country || "US",
    metadata: params.metadata,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  return account;
}

/**
 * Create an account link for coach onboarding
 */
export async function createAccountLink(params: {
  accountId: string;
  refreshUrl: string;
  returnUrl: string;
}): Promise<Stripe.AccountLink> {
  const stripe = getStripeClient();

  const accountLink = await stripe.accountLinks.create({
    account: params.accountId,
    refresh_url: params.refreshUrl,
    return_url: params.returnUrl,
    type: "account_onboarding",
  });

  return accountLink;
}

/**
 * Get Connect account details
 */
export async function getConnectAccount(
  accountId: string
): Promise<Stripe.Account> {
  const stripe = getStripeClient();
  return await stripe.accounts.retrieve(accountId);
}

/**
 * Update Connect account
 */
export async function updateConnectAccount(
  accountId: string,
  metadata: Record<string, string>
): Promise<Stripe.Account> {
  const stripe = getStripeClient();
  return await stripe.accounts.update(accountId, {
    metadata,
  });
}

/**
 * Delete/Close Connect account
 */
export async function deleteConnectAccount(
  accountId: string
): Promise<Stripe.DeletedAccount> {
  const stripe = getStripeClient();
  return await stripe.accounts.del(accountId);
}

/**
 * Create a transfer to a coach's Connect account
 */
export async function createTransfer(params: {
  amount: number; // in dollars
  currency: string;
  destination: string; // Connect account ID
  description?: string;
  metadata: Record<string, string>;
}): Promise<Stripe.Transfer> {
  const stripe = getStripeClient();

  const transfer = await stripe.transfers.create({
    amount: Math.round(params.amount * 100), // Convert to cents
    currency: params.currency,
    destination: params.destination,
    description: params.description,
    metadata: params.metadata,
  });

  return transfer;
}

/**
 * Create a payout to a coach's bank account
 * This requires the coach to have completed Connect onboarding
 */
export async function createPayout(params: {
  accountId: string;
  amount: number; // in dollars
  currency: string;
  description?: string;
  metadata: Record<string, string>;
}): Promise<Stripe.Payout> {
  const stripe = getStripeClient();

  const payout = await stripe.payouts.create(
    {
      amount: Math.round(params.amount * 100), // Convert to cents
      currency: params.currency,
      description: params.description,
      metadata: params.metadata,
    },
    {
      stripeAccount: params.accountId, // Specify the Connect account
    }
  );

  return payout;
}

/**
 * Create a payment with application fee
 * This charges the customer and automatically splits payment to coach
 */
export async function createPaymentWithApplicationFee(params: {
  amount: number; // total amount in dollars
  currency: string;
  applicationFeeAmount: number; // platform fee in dollars
  destination: string; // coach's Connect account ID
  description: string;
  metadata: Record<string, string>;
}): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeClient();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(params.amount * 100),
    currency: params.currency,
    application_fee_amount: Math.round(params.applicationFeeAmount * 100),
    transfer_data: {
      destination: params.destination,
    },
    description: params.description,
    metadata: params.metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
}

/**
 * Reverse a transfer (refund to coach)
 */
export async function reverseTransfer(
  transferId: string,
  amount?: number // optional partial reversal in dollars
): Promise<Stripe.TransferReversal> {
  const stripe = getStripeClient();

  const params: Stripe.TransferReversalCreateParams = {};
  if (amount) {
    params.amount = Math.round(amount * 100);
  }

  return await stripe.transfers.createReversal(transferId, params);
}

/**
 * Get Connect account balance
 */
export async function getAccountBalance(
  accountId: string
): Promise<Stripe.Balance> {
  const stripe = getStripeClient();

  return await stripe.balance.retrieve({
    stripeAccount: accountId,
  });
}

/**
 * List transfers for an account
 */
export async function listTransfers(params: {
  destination?: string;
  limit?: number;
}): Promise<Stripe.ApiList<Stripe.Transfer>> {
  const stripe = getStripeClient();

  return await stripe.transfers.list({
    destination: params.destination,
    limit: params.limit || 100,
  });
}

/**
 * List payouts for a Connect account
 */
export async function listPayouts(params: {
  accountId: string;
  limit?: number;
}): Promise<Stripe.ApiList<Stripe.Payout>> {
  const stripe = getStripeClient();

  return await stripe.payouts.list(
    {
      limit: params.limit || 100,
    },
    {
      stripeAccount: params.accountId,
    }
  );
}

/**
 * Create login link for Connect account dashboard
 */
export async function createDashboardLink(
  accountId: string
): Promise<Stripe.LoginLink> {
  const stripe = getStripeClient();

  return await stripe.accounts.createLoginLink(accountId);
}

/**
 * Platform fee configuration
 */
export const PLATFORM_FEES = {
  // Platform takes 15% of each transaction
  MARKETPLACE_PERCENTAGE: 0.15,

  // Minimum fee
  MINIMUM_FEE: 0.5, // $0.50

  // Maximum fee (for high-value transactions)
  MAXIMUM_FEE: 100, // $100
} as const;

/**
 * Calculate platform fee for a transaction
 */
export function calculatePlatformFee(amount: number): number {
  const fee = amount * PLATFORM_FEES.MARKETPLACE_PERCENTAGE;

  // Apply min/max constraints
  if (fee < PLATFORM_FEES.MINIMUM_FEE) {
    return PLATFORM_FEES.MINIMUM_FEE;
  }

  if (fee > PLATFORM_FEES.MAXIMUM_FEE) {
    return PLATFORM_FEES.MAXIMUM_FEE;
  }

  return Math.round(fee * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate coach payout amount (after platform fee)
 */
export function calculateCoachPayout(amount: number): number {
  const platformFee = calculatePlatformFee(amount);
  return amount - platformFee;
}
