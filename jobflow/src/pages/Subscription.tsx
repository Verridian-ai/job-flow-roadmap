import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SubscriptionPlans } from "../components/SubscriptionPlans";
import { AlertCircle, Calendar, CreditCard, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function Subscription() {
  const currentSubscription = useQuery(api.subscriptions.getCurrentSubscription);
  const subscriptionHistory = useQuery(api.subscriptions.getSubscriptionHistory);
  const cancelSubscription = useMutation(api.subscriptions.cancelSubscription);
  const downgradeToFree = useMutation(api.subscriptions.downgradeToFree);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    try {
      if (currentSubscription?.plan === "free") {
        await downgradeToFree();
      } else {
        await cancelSubscription();
      }
      setShowCancelModal(false);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      alert("Failed to cancel subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Current Subscription Overview */}
        {currentSubscription && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Subscription</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Plan</p>
                  <p className="text-xl font-bold text-gray-900 capitalize">
                    {currentSubscription.plan}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Cost</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${currentSubscription.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Renews On</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatDate(currentSubscription.currentPeriodEnd)}
                  </p>
                </div>
              </div>
            </div>

            {currentSubscription.plan !== "free" && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Cancel Subscription
                </button>
              </div>
            )}
          </div>
        )}

        {/* Usage Overview */}
        {currentSubscription && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Plan Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">STAR Stories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentSubscription.features.starStories === -1
                    ? "Unlimited"
                    : currentSubscription.features.starStories}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Resumes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentSubscription.features.resumes === -1
                    ? "Unlimited"
                    : currentSubscription.features.resumes}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">ATS Scans</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentSubscription.features.atsScans === -1
                    ? "Unlimited"
                    : currentSubscription.features.atsScans}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">AI Generations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentSubscription.features.aiGenerations === -1
                    ? "Unlimited"
                    : currentSubscription.features.aiGenerations}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="mb-8">
          <SubscriptionPlans />
        </div>

        {/* Subscription History */}
        {subscriptionHistory && subscriptionHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription History</h2>
            <div className="space-y-4">
              {subscriptionHistory.map((sub) => (
                <div
                  key={sub._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900 capitalize">
                      {sub.planDetails.name} Plan
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(sub.currentPeriodStart)} -{" "}
                      {formatDate(sub.currentPeriodEnd)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${sub.planDetails.price.toFixed(2)}/month
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        sub.status === "active"
                          ? "bg-green-100 text-green-800"
                          : sub.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Cancel Subscription?
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to cancel your subscription? You'll lose access to premium
                  features at the end of your billing period.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={loading}
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                disabled={loading}
              >
                {loading ? "Cancelling..." : "Cancel Subscription"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
