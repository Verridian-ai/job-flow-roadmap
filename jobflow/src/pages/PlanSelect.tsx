import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  features: string[];
  popular?: boolean;
  stripePriceId?: string;
}

const PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'year',
    features: [
      '1 Resume Scan',
      'Basic STAR Analysis',
      'Limited Revisions',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 199,
    period: 'year',
    features: [
      'Unlimited AI Resume Reviews',
      'Full STAR Method Analysis',
      'Cover Letter Generation',
      'Priority Support',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 399,
    period: 'year',
    popular: true,
    features: [
      'All Premium Features',
      'Advanced Career Analytics',
      'LinkedIn Profile Review',
      'Interview Prep Module',
    ],
  },
  {
    id: 'coaching',
    name: 'Coaching',
    price: 999,
    period: 'year',
    features: [
      'All Professional Features',
      'Two 1-on-1 Coaching Sessions',
      'Personalized Career Plan',
      'Direct Coach Messaging',
    ],
  },
];

export default function PlanSelect() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPlan = async (plan: PricingPlan) => {
    if (plan.id === 'free') {
      navigate('/dashboard');
      return;
    }

    setLoading(plan.id);
    setError(null);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          billingCycle,
        }),
      });

      const session = await response.json();

      if (session.error) {
        throw new Error(session.error);
      }

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process payment. Please try again.');
      setLoading(null);
    }
  };

  const getPriceForCycle = (basePrice: number) => {
    if (billingCycle === 'monthly') {
      return Math.round(basePrice / 12);
    }
    return basePrice;
  };

  return (
    <div className="bg-[#181711] min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Header */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#393728] px-4 sm:px-10 py-3">
            <div className="flex items-center gap-4 text-white">
              <div className="w-5 h-5">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                AI Resume Agent
              </h2>
            </div>
            <div className="hidden md:flex flex-1 justify-end gap-8">
              <div className="flex items-center gap-9">
                <a className="text-white text-sm font-medium leading-normal hover:text-[#f2d00d]" href="/">
                  Features
                </a>
                <a className="text-white text-sm font-medium leading-normal hover:text-[#f2d00d]" href="/pricing">
                  Pricing
                </a>
                <a className="text-white text-sm font-medium leading-normal hover:text-[#f2d00d]" href="/about">
                  About Us
                </a>
                <a className="text-white text-sm font-medium leading-normal hover:text-[#f2d00d]" href="/login">
                  Login
                </a>
              </div>
              <button
                onClick={() => navigate('/register')}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f2d00d] text-[#181711] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-yellow-400 transition-colors"
              >
                <span className="truncate">Sign Up</span>
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow py-12 md:py-20 px-4 sm:px-10 md:px-20 lg:px-40">
            <div className="flex flex-col items-center gap-8 max-w-[1100px] mx-auto">
              {/* Page Heading */}
              <div className="flex flex-col gap-3 text-center px-4">
                <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                  Choose the Plan That's Right For You
                </h1>
                <p className="text-[#bab59c] text-base font-normal leading-normal">
                  Switch to annual billing and save 20%.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="w-full max-w-md bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Billing Cycle Toggle */}
              <div className="flex px-4 py-3 justify-center w-full max-w-sm">
                <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#393728] p-1">
                  <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 has-[:checked]:bg-[#181711] has-[:checked]:shadow-[0_0_4px_rgba(0,0,0,0.1)] has-[:checked]:text-white text-[#bab59c] text-sm font-medium leading-normal">
                    <span className="truncate">Monthly</span>
                    <input
                      type="radio"
                      name="billing-cycle"
                      value="monthly"
                      checked={billingCycle === 'monthly'}
                      onChange={() => setBillingCycle('monthly')}
                      className="invisible w-0"
                    />
                  </label>
                  <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 has-[:checked]:bg-[#181711] has-[:checked]:shadow-[0_0_4px_rgba(0,0,0,0.1)] has-[:checked]:text-white text-[#bab59c] text-sm font-medium leading-normal">
                    <span className="truncate">Annually</span>
                    <input
                      type="radio"
                      name="billing-cycle"
                      value="annually"
                      checked={billingCycle === 'annually'}
                      onChange={() => setBillingCycle('annually')}
                      className="invisible w-0"
                    />
                  </label>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid w-full grid-cols-1 gap-4 px-4 py-3 md:grid-cols-2 lg:grid-cols-4">
                {PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className={`flex flex-1 flex-col justify-between gap-6 rounded-xl p-6 ${
                      plan.popular
                        ? 'border-2 border-solid border-[#f2d00d] bg-[#27251b] relative'
                        : 'border border-solid border-[#54503b] bg-[#27251b] hover:border-[#f2d00d]'
                    } transition-colors duration-300`}
                  >
                    {plan.popular && (
                      <p className="absolute -top-3 left-1/2 -translate-x-1/2 text-[#181711] text-xs font-medium leading-normal tracking-[0.015em] rounded-full bg-[#f2d00d] px-3 py-[3px] text-center whitespace-nowrap">
                        Most Popular
                      </p>
                    )}

                    <div className="flex flex-col gap-4">
                      {/* Plan Header */}
                      <div className="flex flex-col gap-1">
                        <h2 className="text-white text-base font-bold leading-tight">
                          {plan.name}
                        </h2>
                        <p className="flex items-baseline gap-1 text-white">
                          <span
                            className={`${
                              plan.popular ? 'text-[#f2d00d]' : 'text-white'
                            } text-4xl font-black leading-tight tracking-[-0.033em]`}
                          >
                            £{getPriceForCycle(plan.price)}
                          </span>
                          <span className="text-[#bab59c] text-base font-bold leading-tight">
                            /{billingCycle === 'monthly' ? 'month' : 'year'}
                          </span>
                        </p>
                      </div>

                      {/* Features List */}
                      <div className="flex flex-col gap-2">
                        {plan.features.map((feature, index) => (
                          <div
                            key={index}
                            className="text-[13px] font-normal leading-normal flex gap-3 text-[#bab59c] items-center"
                          >
                            <svg className="w-4 h-4 text-[#f2d00d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={loading === plan.id}
                      className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        plan.popular || plan.id !== 'free'
                          ? 'bg-[#f2d00d] text-[#181711] hover:brightness-110'
                          : 'bg-[#393728] text-white hover:bg-[#f2d00d] hover:text-[#181711]'
                      }`}
                    >
                      <span className="truncate">
                        {loading === plan.id
                          ? 'Processing...'
                          : plan.id === 'free'
                          ? 'Get Started'
                          : 'Choose Plan'}
                      </span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer Links */}
              <div className="flex justify-center gap-6 pt-8">
                <a
                  className="text-[#bab59c] text-sm font-normal leading-normal px-4 text-center underline hover:text-white"
                  href="/terms"
                >
                  Terms of Service
                </a>
                <a
                  className="text-[#bab59c] text-sm font-normal leading-normal px-4 text-center underline hover:text-white"
                  href="/refund"
                >
                  Refund Policy
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
