import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';

export default function ForgotPassword() {
  const { signIn, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    if (!email) {
      setError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });

      setSuccess(true);
    } catch (error: any) {
      setError(error.errors?.[0]?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#f8f8f5] dark:bg-[#221f10] p-4">
        <div className="flex w-full max-w-md flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Check Your Email
            </h1>
          </div>

          <div className="w-full text-center">
            <p className="text-gray-600 dark:text-[#bab59c] text-base font-normal leading-normal">
              We've sent a password reset link to <strong>{email}</strong>.
              Please check your inbox and follow the instructions to reset your password.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <Link
              to="/login"
              className="flex h-12 w-full items-center justify-center rounded-lg bg-[#f2d00d] px-6 text-base font-bold text-[#221f10] transition-colors hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-[#f2d00d] focus:ring-offset-2 focus:ring-offset-[#221f10]"
            >
              Back to Log In
            </Link>

            <button
              onClick={() => setSuccess(false)}
              className="text-gray-600 dark:text-[#bab59c] text-sm font-normal leading-normal hover:text-gray-900 dark:hover:text-white hover:underline"
            >
              Didn't receive the email? Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#f8f8f5] dark:bg-[#221f10] p-4">
      <div className="layout-container flex h-full w-full max-w-md flex-col items-center justify-center gap-8">
        {/* Logo Component */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 bg-[#f2d00d] rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-[#221f10]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            CareerForge AI
          </h1>
        </div>

        {/* Page Heading */}
        <div className="flex w-full flex-col gap-3 text-center">
          <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            Forgot Password?
          </p>
          <p className="text-gray-600 dark:text-[#bab59c] text-base font-normal leading-normal">
            Enter your email address and we'll send you a link to get back into your account.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="flex w-full flex-col gap-2">
            <label className="flex flex-col flex-1">
              <p className="text-gray-900 dark:text-white text-base font-medium leading-normal pb-2">
                Email Address
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className={`w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border ${
                  error ? 'border-red-500' : 'border-gray-300 dark:border-[#54503b]'
                } bg-white dark:bg-[#27251b] p-[15px] text-base font-normal leading-normal text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-[#bab59c] focus:border-[#f2d00d] focus:outline-0 focus:ring-1 focus:ring-[#f2d00d] h-14`}
                maxLength={254}
                placeholder="Enter your email"
              />
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex w-full">
            <button
              type="submit"
              disabled={loading}
              className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 flex-1 bg-[#f2d00d] text-[#221f10] text-base font-bold leading-normal tracking-[0.015em] hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-[#f2d00d] focus:ring-offset-2 focus:ring-offset-[#f8f8f5] dark:focus:ring-offset-[#221f10] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="truncate">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </span>
            </button>
          </div>
        </form>

        {/* Back to Login Link */}
        <Link
          to="/login"
          className="text-gray-600 dark:text-[#bab59c] text-sm font-normal leading-normal hover:text-gray-900 dark:hover:text-white hover:underline"
        >
          Back to Log In
        </Link>
      </div>
    </div>
  );
}
