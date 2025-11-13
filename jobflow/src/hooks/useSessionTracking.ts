import { useEffect, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Hook for tracking session activity automatically
 *
 * This hook will:
 * - Track user activity every 5 minutes
 * - Update session's lastActivityAt timestamp
 * - Handle session expiration
 */
export function useSessionTracking(sessionId: string | null, enabled: boolean = true) {
  const trackActivity = useMutation(api.sessionManagement.trackSessionActivity);

  const updateActivity = useCallback(async () => {
    if (!sessionId || !enabled) return;

    try {
      await trackActivity({ sessionId });
    } catch (error) {
      console.error("Failed to track session activity:", error);
    }
  }, [sessionId, enabled, trackActivity]);

  useEffect(() => {
    if (!enabled || !sessionId) return;

    // Track immediately on mount
    updateActivity();

    // Then track every 5 minutes
    const interval = setInterval(updateActivity, 5 * 60 * 1000);

    // Track on user interaction (debounced)
    const events = ["click", "keydown", "scroll", "mousemove"];
    let debounceTimer: NodeJS.Timeout;

    const handleActivity = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updateActivity, 30000); // 30 seconds debounce
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      clearInterval(interval);
      clearTimeout(debounceTimer);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [enabled, sessionId, updateActivity]);
}

/**
 * Get device information from browser
 */
export function getDeviceInfo() {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;

  return {
    userAgent,
    platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

/**
 * Get approximate location from browser (requires permissions)
 */
export async function getApproximateLocation(): Promise<string | undefined> {
  try {
    // Try to get timezone-based location
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // This is a simple approximation - in production, you'd use a geolocation API
    return timezone;
  } catch (error) {
    console.error("Failed to get location:", error);
    return undefined;
  }
}
