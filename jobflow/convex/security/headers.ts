/**
 * Security Headers Configuration
 * Provides recommended security headers for HTTP responses
 */

export interface SecurityHeaders {
  "X-Content-Type-Options": string;
  "X-Frame-Options": string;
  "X-XSS-Protection": string;
  "Strict-Transport-Security": string;
  "Content-Security-Policy": string;
  "Referrer-Policy": string;
  "Permissions-Policy": string;
}

/**
 * Get recommended security headers
 */
export function getSecurityHeaders(): SecurityHeaders {
  return {
    // Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",

    // Prevent clickjacking
    "X-Frame-Options": "DENY",

    // Enable XSS filter
    "X-XSS-Protection": "1; mode=block",

    // Enforce HTTPS
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

    // Content Security Policy
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://*.clerk.accounts.dev",
      "frame-src 'self' https://*.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),

    // Referrer policy
    "Referrer-Policy": "strict-origin-when-cross-origin",

    // Permissions policy (formerly Feature-Policy)
    "Permissions-Policy": [
      "geolocation=(self)",
      "microphone=()",
      "camera=()",
      "payment=(self)",
      "usb=()",
      "magnetometer=()",
      "gyroscope=()",
      "accelerometer=()",
    ].join(", "),
  };
}

/**
 * Get CORS headers for API responses
 */
export function getCorsHeaders(allowedOrigins: string[]): Record<string, string> {
  return {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    // Note: Access-Control-Allow-Origin should be set dynamically based on request origin
  };
}

/**
 * Validate origin for CORS
 */
export function isAllowedOrigin(origin: string, allowedOrigins: string[]): boolean {
  return allowedOrigins.includes(origin) || allowedOrigins.includes("*");
}

/**
 * Generate CSP nonce for inline scripts
 */
export function generateCspNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Security headers middleware configuration for Vite
 */
export const viteSecurityHeaders = {
  headers: [
    {
      source: "/(.*)",
      headers: Object.entries(getSecurityHeaders()).map(([key, value]) => ({
        key,
        value,
      })),
    },
  ],
};
