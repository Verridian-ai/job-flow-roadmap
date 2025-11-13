import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  Clock,
  DollarSign,
  User,
  Calendar,
  AlertCircle,
  FileText,
  TrendingUp,
} from "lucide-react";

interface TaskDetailViewProps {
  taskId: Id<"verificationTasks">;
  onClose?: () => void;
}

export function TaskDetailView({ taskId, onClose }: TaskDetailViewProps) {
  const task = useQuery(api.marketplace.listTasks, { forCoaches: true });
  const bids = useQuery(api.bids.listByTask, { taskId });

  const currentTask = task?.find((t) => t._id === taskId);

  if (!currentTask) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "bidding":
        return "bg-blue-100 text-blue-800";
      case "assigned":
        return "bg-purple-100 text-purple-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "standard":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "flexible":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatTaskType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(currentTask.status)}`}>
                {currentTask.status.replace("_", " ").toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(currentTask.urgency)}`}>
                {currentTask.urgency.toUpperCase()}
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-2">{formatTaskType(currentTask.taskType)}</h2>
            <p className="text-blue-100">Posted {formatDate(currentTask.createdAt)}</p>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 text-4xl font-bold mb-1">
              <DollarSign className="h-10 w-10" />
              {currentTask.finalPrice || currentTask.suggestedPrice}
            </div>
            <p className="text-sm text-blue-100">
              {currentTask.finalPrice ? "Final Price" : "Suggested Price"}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Task Type</p>
              <p className="font-semibold text-gray-900">{formatTaskType(currentTask.taskType)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Urgency</p>
              <p className="font-semibold text-gray-900 capitalize">{currentTask.urgency}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Posted</p>
              <p className="font-semibold text-gray-900">
                {new Date(currentTask.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Task Details */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Task Details</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700">
              This is a <strong>{formatTaskType(currentTask.taskType)}</strong> task with{" "}
              <strong>{currentTask.urgency}</strong> priority.
            </p>
            <p className="text-gray-700 mt-2">
              The client has set a suggested price of{" "}
              <strong>${currentTask.suggestedPrice}</strong> for this task.
            </p>
          </div>
        </div>

        {/* Bidding Info */}
        {(currentTask.status === "open" || currentTask.status === "bidding") && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Ready to Bid?</h3>
                <p className="text-blue-800 mb-4">
                  This task is accepting bids. Submit your competitive offer to be selected by the
                  client.
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-blue-700">Current Bids</p>
                    <p className="text-2xl font-bold text-blue-900">{bids?.length || 0}</p>
                  </div>
                  {bids && bids.length > 0 && (
                    <div>
                      <p className="text-sm text-blue-700">Lowest Bid</p>
                      <p className="text-2xl font-bold text-blue-900">
                        ${Math.min(...bids.map((b) => b.price))}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assigned Coach Info */}
        {currentTask.assignedCoachId && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <User className="h-6 w-6 text-purple-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-2">Task Assigned</h3>
                <p className="text-purple-800">This task has been assigned to a coach.</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {(currentTask.status === "open" || currentTask.status === "bidding") && (
            <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Place Bid
            </button>
          )}
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            View Resume
          </button>
        </div>
      </div>
    </div>
  );
}
