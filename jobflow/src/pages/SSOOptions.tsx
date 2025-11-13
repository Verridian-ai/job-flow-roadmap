import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';

export default function SSOOptions() {
  const { signIn, isLoaded } = useSignIn();
  const [error, setError] = useState<string | null>(null);

  const handleSSOLogin = async (provider: 'oauth_google' | 'oauth_microsoft' | 'oauth_apple') => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (error: any) {
      setError(error.errors?.[0]?.message || `Authentication with ${provider.replace('oauth_', '')} failed. Please try again.`);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f8f8f5] dark:bg-[#221f10]">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 flex flex-1 justify-center items-center py-10">
          <div className="layout-content-container flex flex-col w-full max-w-md flex-1">
            {/* Error Message Alert */}
            {error && (
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400 w-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Page Heading */}
            <div className="flex flex-col items-center gap-3 p-4 text-center">
              <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Welcome Back
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
                Sign in quickly with your preferred service.
              </p>
            </div>

            {/* SSO Button Group */}
            <div className="flex justify-center mt-4">
              <div className="flex w-full flex-col items-stretch gap-3 px-4 py-3">
                {/* Google SSO */}
                <button
                  onClick={() => handleSSOLogin('oauth_google')}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-lg h-12 px-5 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white text-base font-bold leading-normal tracking-[0.015em] w-full border border-transparent hover:border-[#f2d00d] focus:border-[#f2d00d] focus:outline-none focus:ring-2 focus:ring-[#f2d00d]/50 transition-colors"
                >
                  <img
                    alt="Google logo"
                    className="h-6 w-6"
                    src="https://www.google.com/favicon.ico"
                  />
                  <span className="truncate">Continue with Google</span>
                </button>

                {/* Microsoft SSO */}
                <button
                  onClick={() => handleSSOLogin('oauth_microsoft')}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-lg h-12 px-5 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white text-base font-bold leading-normal tracking-[0.015em] w-full border border-transparent hover:border-[#f2d00d] focus:border-[#f2d00d] focus:outline-none focus:ring-2 focus:ring-[#f2d00d]/50 transition-colors"
                >
                  <img
                    alt="Microsoft logo"
                    className="h-6 w-6"
                    src="https://www.microsoft.com/favicon.ico"
                  />
                  <span className="truncate">Continue with Microsoft</span>
                </button>

                {/* Apple SSO */}
                <button
                  onClick={() => handleSSOLogin('oauth_apple')}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-lg h-12 px-5 bg-gray-900 dark:bg-white text-white dark:text-black text-base font-bold leading-normal tracking-[0.015em] w-full border border-transparent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#f2d00d]/50 transition-opacity"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  <span className="truncate">Continue with Apple</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 px-4 py-3">
              <hr className="w-full border-gray-200 dark:border-white/10" />
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal text-center">
                or
              </p>
              <hr className="w-full border-gray-200 dark:border-white/10" />
            </div>

            {/* Alternative Action Link */}
            <div className="flex justify-center pb-3 pt-1 px-4">
              <Link
                to="/login"
                className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal text-center underline hover:text-[#f2d00d] dark:hover:text-[#f2d00d] transition-colors"
              >
                Log in with your email
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
