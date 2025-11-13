import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * OAuth Callback Handler
 *
 * This page handles the OAuth callback from WorkOS after user
 * authenticates with Google or Microsoft.
 */

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Processing authentication...");

  const authenticateWithCode = useMutation(api.auth.authenticateWithCode);

  useEffect(() => {
    const handleCallback = async () => {
      // Get code and state from URL parameters
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");
      const state = searchParams.get("state");

      // Handle OAuth errors
      if (error) {
        setError(errorDescription || `Authentication error: ${error}`);
        setStatus("Authentication failed");
        return;
      }

      // Validate code
      if (!code) {
        setError("No authorization code received");
        setStatus("Authentication failed");
        return;
      }

      try {
        setStatus("Authenticating with WorkOS...");

        // Exchange code for user session
        const result = await authenticateWithCode({ code });

        if (result.userId) {
          setStatus("Authentication successful! Redirecting...");

          // Store session information
          localStorage.setItem("accessToken", result.accessToken);
          localStorage.setItem("userId", result.userId);

          // Parse state to get redirect URL
          let redirectTo = "/dashboard";
          if (state) {
            try {
              const stateData = JSON.parse(state);
              redirectTo = stateData.redirectTo || redirectTo;
            } catch {
              // Invalid state, use default
            }
          }

          // Redirect after short delay
          setTimeout(() => {
            navigate(redirectTo);
          }, 1000);
        } else {
          setError("Failed to create user session");
          setStatus("Authentication failed");
        }
      } catch (err) {
        console.error("Authentication error:", err);
        setError(err instanceof Error ? err.message : "Authentication failed");
        setStatus("Authentication failed");
      }
    };

    handleCallback();
  }, [searchParams, authenticateWithCode, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center space-y-4">
          {/* Logo or App Name */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Status Message */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error ? "Authentication Failed" : "Signing You In"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{status}</p>
          </div>

          {/* Loading Spinner or Error */}
          {!error ? (
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>

              <button
                onClick={() => navigate("/login")}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}

          {/* Additional Info */}
          {!error && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Please wait while we complete your authentication...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
