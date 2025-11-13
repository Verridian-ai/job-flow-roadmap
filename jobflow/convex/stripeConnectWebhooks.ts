/**
 * Stripe Connect Webhook Handlers
 * Processes webhook events for Connect accounts
 */

import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { verifyWebhookSignature } from "./stripe";

/**
 * Connect webhook handler
 * Separate endpoint from main webhooks for Connect events
 */
export const handleConnectWebhook = httpAction(async (ctx, request) => {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_CONNECT_WEBHOOK_SECRET not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  try {
    const event = verifyWebhookSignature(body, signature, webhookSecret);

    // Handle Connect-specific event types
    switch (event.type) {
      case "account.updated":
        await handleAccountUpdated(ctx, event.data.object);
        break;

      case "account.external_account.created":
        await handleExternalAccountCreated(ctx, event.data.object);
        break;

      case "account.external_account.updated":
        await handleExternalAccountUpdated(ctx, event.data.object);
        break;

      case "account.external_account.deleted":
        await handleExternalAccountDeleted(ctx, event.data.object);
        break;

      case "capability.updated":
        await handleCapabilityUpdated(ctx, event.data.object);
        break;

      case "transfer.created":
        await handleTransferCreated(ctx, event.data.object);
        break;

      case "transfer.updated":
        await handleTransferUpdated(ctx, event.data.object);
        break;

      case "transfer.reversed":
        await handleTransferReversed(ctx, event.data.object);
        break;

      case "payout.created":
        await handlePayoutCreated(ctx, event.data.object);
        break;

      case "payout.updated":
        await handlePayoutUpdated(ctx, event.data.object);
        break;

      case "payout.paid":
        await handlePayoutPaid(ctx, event.data.object);
        break;

      case "payout.failed":
        await handlePayoutFailed(ctx, event.data.object);
        break;

      default:
        console.log(`Unhandled Connect event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Connect webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      { status: 400 }
    );
  }
});

/**
 * Handle Connect account updated
 */
async function handleAccountUpdated(ctx: any, account: any) {
  const { id: accountId, charges_enabled, payouts_enabled, details_submitted } = account;

  // Find coach by Stripe account ID
  const coaches = await ctx.runQuery(api.coaches.list, {});
  const coach = coaches.find((c: any) => c.stripeAccountId === accountId);

  if (!coach) {
    console.error(`Coach not found for account: ${accountId}`);
    return;
  }

  // If account is fully onboarded, update coach verification status
  if (charges_enabled && payouts_enabled && details_submitted) {
    // Coach account is ready to receive payments
    console.log(`Coach ${coach._id} Connect account is fully onboarded`);
    // Could send notification to coach here
  }
}

/**
 * Handle external account created (bank account added)
 */
async function handleExternalAccountCreated(ctx: any, externalAccount: any) {
  const { account: accountId } = externalAccount;

  console.log(`External account created for Connect account: ${accountId}`);
  // Coach has added their bank account
  // Could send confirmation notification
}

/**
 * Handle external account updated
 */
async function handleExternalAccountUpdated(ctx: any, externalAccount: any) {
  const { account: accountId } = externalAccount;

  console.log(`External account updated for Connect account: ${accountId}`);
}

/**
 * Handle external account deleted
 */
async function handleExternalAccountDeleted(ctx: any, externalAccount: any) {
  const { account: accountId } = externalAccount;

  console.log(`External account deleted for Connect account: ${accountId}`);
  // Could notify coach that they need to add a new bank account
}

/**
 * Handle capability updated
 */
async function handleCapabilityUpdated(ctx: any, capability: any) {
  const { account: accountId, id: capabilityId, status } = capability;

  console.log(`Capability ${capabilityId} for account ${accountId} is now ${status}`);

  if (status === "active") {
    // Capability is now active (e.g., card_payments, transfers)
    console.log(`Capability activated for account ${accountId}`);
  } else if (status === "inactive" || status === "disabled") {
    // Capability has been disabled
    console.log(`Capability disabled for account ${accountId}`);
    // Could notify coach of the issue
  }
}

/**
 * Handle transfer created
 */
async function handleTransferCreated(ctx: any, transfer: any) {
  const { id: transferId, destination, amount, metadata } = transfer;

  console.log(`Transfer ${transferId} created for ${amount / 100} to ${destination}`);

  // If transfer has task or session metadata, update payout status
  if (metadata.taskId || metadata.sessionId) {
    const payouts = await ctx.runQuery(api.payouts.listByCoach, {
      coachId: metadata.coachId,
    });

    const payout = payouts.find(
      (p: any) => p.stripeTransferId === transferId
    );

    if (payout) {
      await ctx.runMutation(api.payouts.updateStatus, {
        id: payout._id,
        status: "paid",
      });
    }
  }
}

/**
 * Handle transfer updated
 */
async function handleTransferUpdated(ctx: any, transfer: any) {
  const { id: transferId, destination, status } = transfer;

  console.log(`Transfer ${transferId} updated with status ${status}`);
}

/**
 * Handle transfer reversed (refund)
 */
async function handleTransferReversed(ctx: any, transfer: any) {
  const { id: transferId, metadata } = transfer;

  console.log(`Transfer ${transferId} reversed`);

  // Update payout status to cancelled
  if (metadata.coachId) {
    const payouts = await ctx.runQuery(api.payouts.listByCoach, {
      coachId: metadata.coachId,
    });

    const payout = payouts.find(
      (p: any) => p.stripeTransferId === transferId
    );

    if (payout) {
      await ctx.runMutation(api.payouts.updateStatus, {
        id: payout._id,
        status: "cancelled",
      });
    }
  }
}

/**
 * Handle payout created
 */
async function handlePayoutCreated(ctx: any, payout: any) {
  const { id: payoutId, amount, destination, metadata } = payout;

  console.log(`Payout ${payoutId} created for ${amount / 100} to ${destination}`);
}

/**
 * Handle payout updated
 */
async function handlePayoutUpdated(ctx: any, payout: any) {
  const { id: payoutId, status } = payout;

  console.log(`Payout ${payoutId} updated with status ${status}`);
}

/**
 * Handle payout paid (successfully sent to bank)
 */
async function handlePayoutPaid(ctx: any, payout: any) {
  const { id: payoutId, amount, arrival_date } = payout;

  console.log(
    `Payout ${payoutId} paid: ${amount / 100} arriving on ${new Date(
      arrival_date * 1000
    )}`
  );

  // Could notify coach that payout is on the way
}

/**
 * Handle payout failed
 */
async function handlePayoutFailed(ctx: any, payout: any) {
  const { id: payoutId, failure_message, metadata } = payout;

  console.error(`Payout ${payoutId} failed: ${failure_message}`);

  // Update payout status in database
  if (metadata.payoutId) {
    await ctx.runMutation(api.payouts.updateStatus, {
      id: metadata.payoutId,
      status: "failed",
    });
  }

  // Notify coach of payout failure and required actions
}
