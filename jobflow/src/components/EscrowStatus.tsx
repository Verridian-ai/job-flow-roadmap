import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";

interface EscrowStatusProps {
  taskId: Id<"verificationTasks">;
}

export function EscrowStatus({ taskId }: EscrowStatusProps) {
  const escrowStatus = useQuery(api.escrow.getEscrowStatus, { taskId });

  if (!escrowStatus) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (!escrowStatus.hasEscrow) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-900">No Escrow Payment</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Payment has not been placed in escrow yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (escrowStatus.status) {
      case "held_in_escrow":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "released":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "refunded":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (escrowStatus.status) {
      case "held_in_escrow":
        return "bg-blue-50 border-blue-200";
      case "released":
        return "bg-green-50 border-green-200";
      case "refunded":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusText = () => {
    switch (escrowStatus.status) {
      case "held_in_escrow":
        return "Payment Held in Escrow";
      case "released":
        return "Payment Released to Coach";
      case "refunded":
        return "Payment Refunded";
      default:
        return "Unknown Status";
    }
  };

  const getStatusDescription = () => {
    switch (escrowStatus.status) {
      case "held_in_escrow":
        return "Your payment is securely held until the task is completed.";
      case "released":
        return "Payment has been transferred to the coach's account.";
      case "refunded":
        return "Payment has been refunded to your account.";
      default:
        return "";
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
      <div className="flex items-start gap-3">
        {getStatusIcon()}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">{getStatusText()}</h3>
            <span className="text-lg font-bold text-gray-900">
              ${escrowStatus.amount?.toFixed(2)} {escrowStatus.currency?.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-700 mt-1">{getStatusDescription()}</p>

          <div className="mt-3 space-y-1 text-xs text-gray-600">
            {escrowStatus.escrowHeldAt && (
              <div>
                <span className="font-medium">Held on:</span>{" "}
                {formatDate(escrowStatus.escrowHeldAt)}
              </div>
            )}
            {escrowStatus.escrowReleasedAt && (
              <div>
                <span className="font-medium">Released on:</span>{" "}
                {formatDate(escrowStatus.escrowReleasedAt)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
