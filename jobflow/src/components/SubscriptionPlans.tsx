import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Check, Zap, Crown, Star } from "lucide-react";
import { useState } from "react";

export function SubscriptionPlans() {
  const plans = useQuery(api.subscriptions.getAvailablePlans);
  const currentSubscription = useQuery(api.subscriptions.getCurrentSubscription);
  const createOrUpgrade = useMutation(api.subscriptions.createOrUpgradeSubscription);
  const [loading, setLoading] = useState<string | null>(null);

  if (!plans || !currentSubscription) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const handleSubscribe = async (planId: string) => {
    if (planId === "free") return;

    setLoading(planId);
    try {
      // In a real implementation, you would:
      // 1. Create a Stripe checkout session
      // 2. Redirect to Stripe
      // 3. Handle the webhook callback
      // For now, we'll just create the subscription
      await createOrUpgrade({
        plan: planId as "premium" | "pro",
        stripeSubscriptionId: `sub_${Date.now()}`,
      });
    } catch (error) {
      console.error("Failed to subscribe:", error);
      alert("Failed to subscribe. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "free":
        return <Star className="h-8 w-8 text-gray-400" />;
      case "premium":
        return <Zap className="h-8 w-8 text-blue-500" />;
      case "pro":
        return <Crown className="h-8 w-8 text-purple-500" />;
      default:
        return null;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case "free":
        return "border-gray-300";
      case "premium":
        return "border-blue-500 ring-2 ring-blue-500";
      case "pro":
        return "border-purple-500 ring-2 ring-purple-500";
      default:
        return "border-gray-300";
    }
  };

  const formatFeatureValue = (value: number | string) => {
    if (value === -1) return "Unlimited";
    if (typeof value === "number") return value.toString();
    return value;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
        <p className="text-lg text-gray-600">
          Select the plan that best fits your job search needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isCurrentPlan = currentSubscription.plan === plan.id;
          const isPopular = plan.id === "premium";

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg p-8 border-2 transition-all hover:shadow-xl ${getPlanColor(
                plan.id
              )}`}
            >
              {isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">{getPlanIcon(plan.id)}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price.toFixed(2)}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>{formatFeatureValue(plan.features.starStories)}</strong> STAR stories
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>{formatFeatureValue(plan.features.resumes)}</strong> resumes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>{formatFeatureValue(plan.features.jobApplications)}</strong> job
                    applications
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>{formatFeatureValue(plan.features.atsScans)}</strong> ATS scans
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>{formatFeatureValue(plan.features.aiGenerations)}</strong> AI
                    generations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>{formatFeatureValue(plan.features.coachingSessions)}</strong> coaching
                    sessions
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>{formatFeatureValue(plan.features.marketplaceTasks)}</strong>{" "}
                    marketplace tasks
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>{plan.features.support}</strong> support
                  </span>
                </li>
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrentPlan || loading === plan.id || plan.id === "free"}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isCurrentPlan
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : plan.id === "premium"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : plan.id === "pro"
                    ? "bg-purple-500 text-white hover:bg-purple-600"
                    : "bg-gray-200 text-gray-700 cursor-not-allowed"
                }`}
              >
                {loading === plan.id
                  ? "Processing..."
                  : isCurrentPlan
                  ? "Current Plan"
                  : plan.id === "free"
                  ? "Free Forever"
                  : "Upgrade Now"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
