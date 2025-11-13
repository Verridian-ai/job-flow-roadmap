import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate, useSearchParams } from "react-router-dom";

/**
 * SSO Login Component
 *
 * Provides Google and Microsoft SSO login buttons and handles
 * the OAuth callback flow with WorkOS.
 */

interface SSOLoginProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function SSOLogin({ onSuccess, redirectTo = "/dashboard" }: SSOLoginProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const getAuthUrl = useMutation(api.auth.getAuthorizationUrl);
  const authenticateWithCode = useMutation(api.auth.authenticateWithCode);

  // Handle OAuth callback
  const handleCallback = async (code: string) => {
    try {
      setLoading("callback");
      const result = await authenticateWithCode({ code });

      if (result.userId) {
        // Store session info
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("userId", result.userId);

        if (onSuccess) {
          onSuccess();
        }

        navigate(redirectTo);
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(null);
    }
  };

  // Check for OAuth callback code in URL
  const code = searchParams.get("code");
  if (code && !loading) {
    handleCallback(code);
  }

  const handleSSOLogin = async (provider: "GoogleOAuth" | "MicrosoftOAuth") => {
    try {
      setLoading(provider);
      setError(null);

      const redirectUri = `${window.location.origin}/auth/callback`;
      const state = JSON.stringify({ redirectTo });

      const result = await getAuthUrl({
        provider,
        redirectUri,
        state,
      });

      if (result.url) {
        // Redirect to WorkOS authorization URL
        window.location.href = result.url;
      }
    } catch (err) {
      console.error("SSO login error:", err);
      setError(err instanceof Error ? err.message : "Failed to initiate SSO login");
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <button
          onClick={() => handleSSOLogin("GoogleOAuth")}
          disabled={loading !== null}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "GoogleOAuth" ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            Continue with Google
          </span>
        </button>

        <button
          onClick={() => handleSSOLogin("MicrosoftOAuth")}
          disabled={loading !== null}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "MicrosoftOAuth" ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#f25022" d="M1 1h10v10H1z" />
              <path fill="#00a4ef" d="M13 1h10v10H13z" />
              <path fill="#7fba00" d="M1 13h10v10H1z" />
              <path fill="#ffb900" d="M13 13h10v10H13z" />
            </svg>
          )}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            Continue with Microsoft
          </span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {loading === "callback" && (
        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          <span>Completing sign in...</span>
        </div>
      )}
    </div>
  );
}
