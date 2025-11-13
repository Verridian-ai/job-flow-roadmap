import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface SessionManagerProps {
  userId: Id<"users">;
  currentSessionId?: string;
}

export default function SessionManager({ userId, currentSessionId }: SessionManagerProps) {
  const [revoking, setRevoking] = useState<Id<"authSessions"> | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);

  const sessions = useQuery(api.sessionManagement.getUserSessionsWithDetails, { userId });
  const analytics = useQuery(api.sessionManagement.getSessionAnalytics, { userId });

  const revokeSessionById = useMutation(api.sessionManagement.revokeSessionById);
  const revokeAllOtherSessions = useMutation(api.sessionManagement.revokeAllOtherSessions);
  const revokeAllSessions = useMutation(api.sessionManagement.revokeAllSessions);

  const handleRevokeSession = async (sessionId: Id<"authSessions">) => {
    if (!confirm("Are you sure you want to sign out from this device?")) {
      return;
    }

    setRevoking(sessionId);
    try {
      const result = await revokeSessionById({ sessionId, userId });
      if (result.success) {
        alert(`Signed out from ${result.deviceName}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : "Failed to revoke session"}`);
    } finally {
      setRevoking(null);
    }
  };

  const handleRevokeAllOther = async () => {
    if (!currentSessionId) {
      alert("Current session ID not available");
      return;
    }

    if (!confirm("Sign out from all other devices? You will remain signed in on this device.")) {
      return;
    }

    setRevokingAll(true);
    try {
      const result = await revokeAllOtherSessions({ userId, currentSessionId });
      alert(result.message);
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : "Failed to revoke sessions"}`);
    } finally {
      setRevokingAll(false);
    }
  };

  const handleRevokeAll = async () => {
    if (!confirm("Sign out from ALL devices including this one? You will be logged out.")) {
      return;
    }

    setRevokingAll(true);
    try {
      const result = await revokeAllSessions({ userId });
      alert(result.message);
      // Redirect to login
      window.location.href = "/login";
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : "Failed to revoke sessions"}`);
      setRevokingAll(false);
    }
  };

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType) {
      case "mobile":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        );
      case "tablet":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
    }
  };

  if (!sessions) {
    return <div className="animate-pulse">Loading sessions...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">Active Sessions</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your active sessions across all devices
          </p>
        </div>

        {/* Analytics Section */}
        {analytics && (
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{analytics.active}</div>
                <div className="text-xs text-gray-600">Active Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {analytics.recentlyActive24h}
                </div>
                <div className="text-xs text-gray-600">Active Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {analytics.withRememberMe}
                </div>
                <div className="text-xs text-gray-600">Remember Me</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {Object.keys(analytics.deviceBreakdown).length}
                </div>
                <div className="text-xs text-gray-600">Device Types</div>
              </div>
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="divide-y divide-gray-200">
          {sessions.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No active sessions found
            </div>
          ) : (
            sessions.map((session) => {
              const isCurrent = session.sessionId === currentSessionId;
              return (
                <div
                  key={session._id}
                  className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                    isCurrent ? "bg-green-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Device Icon */}
                      <div className="flex-shrink-0 mt-1">
                        <div
                          className={`p-2 rounded-full ${
                            isCurrent ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {getDeviceIcon(session.deviceType)}
                        </div>
                      </div>

                      {/* Session Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {session.deviceName || "Unknown Device"}
                          </h3>
                          {isCurrent && (
                            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                              Current Session
                            </span>
                          )}
                          {session.rememberMe && (
                            <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                              Remember Me
                            </span>
                          )}
                        </div>

                        <div className="mt-1 space-y-1">
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Browser:</span> {session.browser || "Unknown"}
                            {" · "}
                            <span className="font-medium">OS:</span> {session.os || "Unknown"}
                          </p>
                          {session.location && (
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Location:</span> {session.location}
                            </p>
                          )}
                          {session.ipAddress && (
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">IP:</span> {session.ipAddress}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            Last active: {session.lastActivityRelative}
                          </p>
                          {session.isExpiringSoon && (
                            <p className="text-xs text-orange-600 font-medium">
                              Expires in {session.daysUntilExpiry} day(s)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 ml-4">
                      <button
                        onClick={() => handleRevokeSession(session._id)}
                        disabled={revoking === session._id}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                          isCurrent
                            ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                            : "text-red-600 bg-red-50 hover:bg-red-100"
                        }`}
                      >
                        {revoking === session._id ? "Revoking..." : "Sign Out"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bulk Actions */}
        {sessions.length > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <p className="text-sm text-gray-600">
                Need to secure your account? Sign out from all devices.
              </p>
              <div className="flex space-x-3">
                {currentSessionId && (
                  <button
                    onClick={handleRevokeAllOther}
                    disabled={revokingAll}
                    className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-md hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Sign Out Other Devices
                  </button>
                )}
                <button
                  onClick={handleRevokeAll}
                  disabled={revokingAll}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sign Out All Devices
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Tips */}
        <div className="px-6 py-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Security Tips</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Check for sessions you don't recognize and sign them out immediately</li>
            <li>• Use "Remember Me" only on your personal devices</li>
            <li>• Sessions expire automatically after periods of inactivity</li>
            <li>• Contact support if you notice suspicious activity</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
