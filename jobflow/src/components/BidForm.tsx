import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { DollarSign, Clock, MessageSquare, AlertCircle, TrendingDown } from "lucide-react";

interface BidFormProps {
  taskId: Id<"verificationTasks">;
  suggestedPrice: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BidForm({ taskId, suggestedPrice, onSuccess, onCancel }: BidFormProps) {
  const [price, setPrice] = useState(suggestedPrice.toString());
  const [estimatedTime, setEstimatedTime] = useState("60");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createBid = useMutation(api.marketplace.createBid);
  const existingBids = useQuery(api.bids.listByTask, { taskId });

  const lowestBid = existingBids?.length
    ? Math.min(...existingBids.map((b) => b.price))
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const priceNum = parseFloat(price);
      const timeNum = parseInt(estimatedTime);

      if (priceNum <= 0) {
        throw new Error("Price must be greater than 0");
      }

      if (timeNum <= 0) {
        throw new Error("Estimated time must be greater than 0");
      }

      await createBid({
        taskId,
        price: priceNum,
        estimatedTime: timeNum,
        message: message.trim() || undefined,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit bid");
    } finally {
      setLoading(false);
    }
  };

  const getSavingsPercentage = () => {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum >= suggestedPrice) return 0;
    return Math.round(((suggestedPrice - priceNum) / suggestedPrice) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit Your Bid</h2>
      <p className="text-gray-600 mb-6">
        Make a competitive offer to win this verification task
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Competition Info */}
      {existingBids && existingBids.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <TrendingDown className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">
                {existingBids.length} {existingBids.length === 1 ? "bid" : "bids"} already
                submitted
              </p>
              <p className="text-sm text-yellow-800 mt-1">
                Lowest bid: <strong>${lowestBid?.toFixed(2)}</strong> - Be competitive to win!
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="inline h-4 w-4 mr-1" />
            Your Bid Price *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="1"
              step="1"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-center justify-between mt-2 text-sm">
            <span className="text-gray-600">
              Suggested: <strong>${suggestedPrice.toFixed(2)}</strong>
            </span>
            {getSavingsPercentage() > 0 && (
              <span className="text-green-600 font-medium">
                {getSavingsPercentage()}% below suggested
              </span>
            )}
          </div>
        </div>

        {/* Estimated Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="inline h-4 w-4 mr-1" />
            Estimated Time (minutes) *
          </label>
          <input
            type="number"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            min="15"
            step="15"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-sm text-gray-600 mt-2">
            {parseInt(estimatedTime) >= 60
              ? `${Math.floor(parseInt(estimatedTime) / 60)}h ${
                  parseInt(estimatedTime) % 60
                }m`
              : `${estimatedTime}m`}
          </p>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MessageSquare className="inline h-4 w-4 mr-1" />
            Message to Client (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Tell the client why you're the best fit for this task..."
          />
          <p className="text-sm text-gray-600 mt-2">
            Highlight your experience and what makes your bid competitive
          </p>
        </div>

        {/* Bid Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-3">Bid Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-800">Your Bid:</span>
              <span className="font-bold text-blue-900">${parseFloat(price).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Time Commitment:</span>
              <span className="font-bold text-blue-900">
                {parseInt(estimatedTime) >= 60
                  ? `${Math.floor(parseInt(estimatedTime) / 60)}h ${
                      parseInt(estimatedTime) % 60
                    }m`
                  : `${estimatedTime}m`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Effective Rate:</span>
              <span className="font-bold text-blue-900">
                ${((parseFloat(price) / parseInt(estimatedTime)) * 60).toFixed(2)}/hr
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Your bid is binding. If selected, you'll be expected to
            complete the task at the price and timeline you've proposed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting Bid..." : "Submit Bid"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
