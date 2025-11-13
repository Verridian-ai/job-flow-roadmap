import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CheckCircle, Clock, DollarSign, XCircle } from "lucide-react";
import { useState } from "react";

interface EscrowPaymentsListProps {
  role?: "client" | "coach";
}

export function EscrowPaymentsList({ role }: EscrowPaymentsListProps) {
  const [selectedRole, setSelectedRole] = useState<"client" | "coach" | undefined>(role);
  const payments = useQuery(api.escrow.listEscrowPayments, { role: selectedRole });

  if (!payments) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      held_in_escrow: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: <Clock className="h-4 w-4" />,
        label: "In Escrow",
      },
      released: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <CheckCircle className="h-4 w-4" />,
        label: "Released",
      },
      refunded: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <XCircle className="h-4 w-4" />,
        label: "Refunded",
      },
    };

    const badge = badges[status as keyof typeof badges] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      icon: <DollarSign className="h-4 w-4" />,
      label: status,
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
      >
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {!role && (
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedRole(undefined)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedRole === undefined
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Payments
          </button>
          <button
            onClick={() => setSelectedRole("client")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedRole === "client"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            As Client
          </button>
          <button
            onClick={() => setSelectedRole("coach")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedRole === "coach"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            As Coach
          </button>
        </div>
      )}

      {payments.length === 0 ? (
        <div className="text-center py-12">
          <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Escrow Payments</h3>
          <p className="text-gray-600">
            {selectedRole === "coach"
              ? "You haven't received any escrow payments yet."
              : "You haven't made any escrow payments yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                    </h3>
                    {getStatusBadge(payment.status)}
                  </div>
                  <p className="text-sm text-gray-600">
                    Payment for{" "}
                    {payment.type === "verification"
                      ? "resume verification"
                      : payment.type === "session"
                      ? "coaching session"
                      : "subscription"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600">
                  <span className="font-medium">Created:</span> {formatDate(payment.createdAt)}
                </div>
                {payment.escrowHeldAt && (
                  <div className="text-gray-600">
                    <span className="font-medium">Held:</span> {formatDate(payment.escrowHeldAt)}
                  </div>
                )}
                {payment.escrowReleasedAt && (
                  <div className="text-gray-600">
                    <span className="font-medium">Released:</span>{" "}
                    {formatDate(payment.escrowReleasedAt)}
                  </div>
                )}
              </div>

              {payment.stripePaymentIntentId && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Payment ID: {payment.stripePaymentIntentId}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
