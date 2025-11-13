/**
 * Stripe Webhook Handlers
 * Processes webhook events from Stripe
 */

import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { verifyWebhookSignature } from "./stripe";

/**
 * Main webhook handler endpoint
 * Stripe will POST events to this endpoint
 */
export const handleWebhook = httpAction(async (ctx, request) => {
  // Get raw body and signature
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  try {
    // Verify webhook signature
    const event = verifyWebhookSignature(body, signature, webhookSecret);

    // Handle different event types
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(ctx, event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(ctx, event.data.object);
        break;

      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(ctx, event.data.object);
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(ctx, event.data.object);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(ctx, event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(ctx, event.data.object);
        break;

      case "charge.refunded":
        await handleChargeRefunded(ctx, event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      { status: 400 }
    );
  }
});

/**
 * Handle successful payment intent
 */
async function handlePaymentIntentSucceeded(ctx: any, paymentIntent: any) {
  const { id: paymentIntentId, metadata } = paymentIntent;

  // Find payment record by Stripe payment intent ID
  const payments = await ctx.runQuery(api.payments.list, {});
  const payment = payments.find(
    (p: any) => p.stripePaymentIntentId === paymentIntentId
  );

  if (!payment) {
    console.error(`Payment not found for intent: ${paymentIntentId}`);
    return;
  }

  // Update payment status
  await ctx.runMutation(api.payments.updateStatus, {
    id: payment._id,
    status: "succeeded",
  });

  // Handle post-payment actions based on type
  if (metadata.taskId && payment.type === "verification") {
    // Update verification task status to in_progress
    await ctx.runMutation(api.marketplace.updateTaskStatus, {
      taskId: metadata.taskId,
      status: "in_progress",
    });
  }

  if (metadata.sessionId && payment.type === "session") {
    // Confirm coaching session
    await ctx.runMutation(api.sessions.confirmPayment, {
      sessionId: metadata.sessionId,
    });
  }
}

/**
 * Handle failed payment intent
 */
async function handlePaymentIntentFailed(ctx: any, paymentIntent: any) {
  const { id: paymentIntentId } = paymentIntent;

  // Find payment record
  const payments = await ctx.runQuery(api.payments.list, {});
  const payment = payments.find(
    (p: any) => p.stripePaymentIntentId === paymentIntentId
  );

  if (!payment) {
    console.error(`Payment not found for intent: ${paymentIntentId}`);
    return;
  }

  // Update payment status
  await ctx.runMutation(api.payments.updateStatus, {
    id: payment._id,
    status: "failed",
  });
}

/**
 * Handle completed checkout session
 */
async function handleCheckoutSessionCompleted(ctx: any, session: any) {
  const { metadata, customer, subscription, payment_intent } = session;

  if (session.mode === "subscription") {
    // Handle subscription checkout
    if (subscription && metadata.userId) {
      await ctx.runMutation(api.subscriptions.create, {
        userId: metadata.userId,
        plan: metadata.plan,
        stripeSubscriptionId: subscription,
        stripeCustomerId: customer,
      });
    }
  } else if (session.mode === "payment") {
    // Handle one-time payment checkout
    if (payment_intent && metadata.userId) {
      // Payment record should already exist, just update it
      const payments = await ctx.runQuery(api.payments.list, {});
      const payment = payments.find(
        (p: any) => p.stripePaymentIntentId === payment_intent
      );

      if (payment) {
        await ctx.runMutation(api.payments.updateStatus, {
          id: payment._id,
          status: "succeeded",
        });
      }
    }
  }
}

/**
 * Handle subscription created
 */
async function handleSubscriptionCreated(ctx: any, subscription: any) {
  const { id: subscriptionId, customer, metadata, current_period_start, current_period_end } = subscription;

  if (metadata.userId) {
    await ctx.runMutation(api.subscriptions.create, {
      userId: metadata.userId,
      plan: metadata.plan,
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: customer,
      currentPeriodStart: current_period_start * 1000,
      currentPeriodEnd: current_period_end * 1000,
    });
  }
}

/**
 * Handle subscription updated
 */
async function handleSubscriptionUpdated(ctx: any, subscription: any) {
  const { id: subscriptionId, current_period_start, current_period_end, status } = subscription;

  // Find subscription by Stripe ID
  const subscriptions = await ctx.runQuery(api.subscriptions.list, {});
  const sub = subscriptions.find(
    (s: any) => s.stripeSubscriptionId === subscriptionId
  );

  if (!sub) {
    console.error(`Subscription not found: ${subscriptionId}`);
    return;
  }

  // Update subscription
  await ctx.runMutation(api.subscriptions.update, {
    id: sub._id,
    currentPeriodStart: current_period_start * 1000,
    currentPeriodEnd: current_period_end * 1000,
    status: status === "active" ? "active" : "cancelled",
  });
}

/**
 * Handle subscription deleted/cancelled
 */
async function handleSubscriptionDeleted(ctx: any, subscription: any) {
  const { id: subscriptionId } = subscription;

  // Find subscription by Stripe ID
  const subscriptions = await ctx.runQuery(api.subscriptions.list, {});
  const sub = subscriptions.find(
    (s: any) => s.stripeSubscriptionId === subscriptionId
  );

  if (!sub) {
    console.error(`Subscription not found: ${subscriptionId}`);
    return;
  }

  // Update subscription status
  await ctx.runMutation(api.subscriptions.updateStatus, {
    id: sub._id,
    status: "cancelled",
  });
}

/**
 * Handle refunded charge
 */
async function handleChargeRefunded(ctx: any, charge: any) {
  const { payment_intent: paymentIntentId } = charge;

  if (!paymentIntentId) {
    return;
  }

  // Find payment record
  const payments = await ctx.runQuery(api.payments.list, {});
  const payment = payments.find(
    (p: any) => p.stripePaymentIntentId === paymentIntentId
  );

  if (!payment) {
    console.error(`Payment not found for intent: ${paymentIntentId}`);
    return;
  }

  // Update payment status
  await ctx.runMutation(api.payments.updateStatus, {
    id: payment._id,
    status: "refunded",
  });
}
