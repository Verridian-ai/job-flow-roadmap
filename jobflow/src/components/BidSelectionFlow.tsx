import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Clock,
  User,
  Bell,
  ArrowRight,
} from "lucide-react";

interface BidSelectionFlowProps {
  taskId: Id<"verificationTasks">;
  onComplete?: () => void;
}

export function BidSelectionFlow({ taskId, onComplete }: BidSelectionFlowProps) {
  const [selectedBidId, setSelectedBidId] = useState<Id<"bids"> | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const task = useQuery(api.marketplace.listTasks, { forCoaches: false });
  const bids = useQuery(api.bids.listByTask, { taskId });
  const acceptBid = useMutation(api.marketplace.acceptBid);
  const holdPayment = useMutation(api.escrow.holdPaymentInEscrow);

  const currentTask = task?.find((t) => t._id === taskId);
  const selectedBid = bids?.find((b) => b._id === selectedBidId);

  const handleSelectBid = (bidId: Id<"bids">) => {
    setSelectedBidId(bidId);
    setShowConfirmation(true);
    setError("");
  };

  const handleConfirmSelection = async () => {
    if (!selectedBidId || !selectedBid) return;

    setLoading(true);
    setError("");

    try {
      // Step 1: Accept the bid
      await acceptBid({ bidId: selectedBidId });

      // Step 2: Hold payment in escrow
      // In production, this would create a Stripe payment intent first
      const mockPaymentIntentId = `pi_${Date.now()}`;
      await holdPayment({
        taskId,
        bidId: selectedBidId,
        paymentIntentId: mockPaymentIntentId,
      });

      // Success!
      setShowConfirmation(false);
      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to select bid");
    } finally {
      setLoading(false);
    }
  };

  if (!currentTask || !bids) {
    return (
      <div className="bg-white rounded-lg p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  const pendingBids = bids.filter((b) => b.status === "pending");
  const acceptedBid = bids.find((b) => b.status === "accepted");

  if (acceptedBid) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-green-900 mb-2">Bid Accepted!</h3>
            <p className="text-green-800 mb-4">
              You've successfully selected a coach for this task. Payment has been securely held
              in escrow and will be released upon task completion.
            </p>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Accepted Bid:</span>
                <span className="text-2xl font-bold text-gray-900">
                  ${acceptedBid.price.toFixed(2)}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    Estimated completion:{" "}
                    {acceptedBid.estimatedTime >= 60
                      ? `${Math.floor(acceptedBid.estimatedTime / 60)}h ${
                          acceptedBid.estimatedTime % 60
                        }m`
                      : `${acceptedBid.estimatedTime}m`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pendingBids.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
        <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bids Available</h3>
        <p className="text-gray-600">
          This task hasn't received any bids yet. Coaches will be notified about your task.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Coach</h2>
        <p className="text-gray-600">
          Review the bids below and choose the coach you'd like to work with. Payment will be
          held securely in escrow.
        </p>
      </div>

      {/* Bids */}
      <div className="space-y-4">
        {pendingBids.map((bid) => (
          <div
            key={bid._id}
            className={`bg-white rounded-lg shadow-sm border-2 p-6 transition-all cursor-pointer ${
              selectedBidId === bid._id
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => setSelectedBidId(bid._id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Experienced Coach</p>
                    <p className="text-sm text-gray-600">4.8★ (124 reviews)</p>
                  </div>
                </div>

                {bid.message && (
                  <p className="text-gray-700 mb-3 italic">"{bid.message}"</p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {bid.estimatedTime >= 60
                        ? `${Math.floor(bid.estimatedTime / 60)}h ${bid.estimatedTime % 60}m`
                        : `${bid.estimatedTime}m`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>${((bid.price / bid.estimatedTime) * 60).toFixed(2)}/hr</span>
                  </div>
                </div>
              </div>

              <div className="text-right ml-6">
                <div className="flex items-center gap-1 text-3xl font-bold text-gray-900 mb-1">
                  <DollarSign className="h-7 w-7" />
                  {bid.price.toFixed(2)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectBid(bid._id);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Select Coach
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedBid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Confirm Your Selection</h3>

            {/* Selection Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Selected Coach</p>
                  <p className="text-xl font-bold text-gray-900">Experienced Coach</p>
                  <p className="text-sm text-gray-600">4.8★ (124 reviews)</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Bid Amount</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${selectedBid.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="border-t border-blue-200 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Estimated Time:</span>
                  <span className="font-medium text-gray-900">
                    {selectedBid.estimatedTime >= 60
                      ? `${Math.floor(selectedBid.estimatedTime / 60)}h ${
                          selectedBid.estimatedTime % 60
                        }m`
                      : `${selectedBid.estimatedTime}m`}
                  </span>
                </div>
              </div>
            </div>

            {/* Process Steps */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">What happens next:</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">1. Payment Held in Escrow</p>
                    <p className="text-sm text-gray-600">
                      ${selectedBid.price.toFixed(2)} will be securely held until work is complete
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">2. Coach Notified</p>
                    <p className="text-sm text-gray-600">
                      The selected coach will be notified and can start working
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <XCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">3. Other Bids Rejected</p>
                    <p className="text-sm text-gray-600">
                      All other coaches will be notified their bids weren't selected
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <ArrowRight className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">4. Task Assigned</p>
                    <p className="text-sm text-gray-600">
                      Task status will update to "assigned" and work begins
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleConfirmSelection}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Processing..." : `Confirm & Pay $${selectedBid.price.toFixed(2)}`}
              </button>
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setSelectedBidId(null);
                }}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
