import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { DollarSign, Clock, Star, MessageSquare, TrendingUp } from "lucide-react";

interface BidComparisonProps {
  taskId: Id<"verificationTasks">;
  onSelectBid?: (bidId: Id<"bids">) => void;
}

export function BidComparison({ taskId, onSelectBid }: BidComparisonProps) {
  const bids = useQuery(api.bids.listByTask, { taskId });

  if (!bids) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
        <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bids Yet</h3>
        <p className="text-gray-600">
          This task hasn't received any bids yet. Check back later.
        </p>
      </div>
    );
  }

  const sortedBids = [...bids].sort((a, b) => a.price - b.price);
  const lowestBid = sortedBids[0];
  const averagePrice = bids.reduce((sum, bid) => sum + bid.price, 0) / bids.length;

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Bids</p>
          <p className="text-2xl font-bold text-gray-900">{bids.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Lowest Bid</p>
          <p className="text-2xl font-bold text-green-600">${lowestBid.price.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Average Bid</p>
          <p className="text-2xl font-bold text-blue-600">${averagePrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Bids List */}
      <div className="space-y-4">
        {sortedBids.map((bid, index) => (
          <div
            key={bid._id}
            className={`bg-white rounded-lg shadow-sm border-2 p-6 transition-all ${
              bid._id === lowestBid._id
                ? "border-green-500"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            {/* Bid Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {bid._id === lowestBid._id && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      LOWEST BID
                    </span>
                  )}
                  {index === 0 && bid._id !== lowestBid._id && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      BEST VALUE
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8</span>
                  <span className="text-sm">(124 reviews)</span>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-3xl font-bold text-gray-900 mb-1">
                  <DollarSign className="h-7 w-7" />
                  {bid.price.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">
                  ${((bid.price / bid.estimatedTime) * 60).toFixed(2)}/hr
                </p>
              </div>
            </div>

            {/* Bid Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-5 w-5 text-gray-400" />
                <span>Estimated Time: {formatTime(bid.estimatedTime)}</span>
              </div>
            </div>

            {/* Message */}
            {bid.message && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2 mb-2">
                  <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5" />
                  <p className="font-medium text-gray-900">Coach's Message</p>
                </div>
                <p className="text-gray-700 text-sm">{bid.message}</p>
              </div>
            )}

            {/* Status & Action */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  bid.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : bid.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {bid.status.toUpperCase()}
              </span>

              {bid.status === "pending" && onSelectBid && (
                <button
                  onClick={() => onSelectBid(bid._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Select This Bid
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
