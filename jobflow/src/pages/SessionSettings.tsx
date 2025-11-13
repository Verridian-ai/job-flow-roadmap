import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import SessionManager from "../components/auth/SessionManager";

interface SessionSettingsProps {
  userId: Id<"users">;
  currentSessionId?: string;
}

export default function SessionSettings({ userId, currentSessionId }: SessionSettingsProps) {
  const [activeTab, setActiveTab] = useState<"sessions" | "security">("sessions");
  const analytics = useQuery(api.sessionManagement.getSessionAnalytics, { userId });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Session & Security Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your active sessions and security preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("sessions")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "sessions"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Active Sessions
                {analytics && (
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                    {analytics.active}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "security"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Security Settings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "sessions" && (
              <SessionManager userId={userId} currentSessionId={currentSessionId} />
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                {/* Security Overview */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Security Overview
                  </h2>

                  {analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Device Types */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Active Devices
                        </h3>
                        <div className="space-y-2">
                          {Object.entries(analytics.deviceBreakdown).map(([type, count]) => (
                            <div key={type} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 capitalize">{type}</span>
                              <span className="text-sm font-semibold text-gray-900">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Locations */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Sign-in Locations
                        </h3>
                        <div className="space-y-2">
                          {Object.entries(analytics.locationBreakdown)
                            .slice(0, 5)
                            .map(([location, count]) => (
                              <div key={location} className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">{location}</span>
                                <span className="text-sm font-semibold text-gray-900">
                                  {count}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Activity Stats */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Recent Activity
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Active Today</span>
                            <span className="text-sm font-semibold text-green-600">
                              {analytics.recentlyActive24h}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Active This Week</span>
                            <span className="text-sm font-semibold text-blue-600">
                              {analytics.recentlyActive7d}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Sessions</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {analytics.total}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Session Settings */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Session Preferences
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Remember Me Active</span>
                            <span className="text-sm font-semibold text-purple-600">
                              {analytics.withRememberMe}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Active Sessions</span>
                            <span className="text-sm font-semibold text-blue-600">
                              {analytics.active}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Security Recommendations */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Security Recommendations
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Review Active Sessions Regularly
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Check your active sessions monthly to ensure all devices are recognized.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Use "Remember Me" Carefully
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Only enable "Remember Me" on personal devices that you trust.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-orange-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Sign Out After Public Use
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Always sign out when using public or shared computers.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Report Suspicious Activity
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Contact support immediately if you notice unrecognized sessions or locations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
