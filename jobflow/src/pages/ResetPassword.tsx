import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';

interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, isLoaded } = useSignIn();

  const [passwords, setPasswords] = useState({
    new: '',
    confirm: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });

  const [requirements, setRequirements] = useState<PasswordRequirements>({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [code] = useState(searchParams.get('code') || '');

  useEffect(() => {
    const password = passwords.new;
    setRequirements({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [passwords.new]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    const newErrors: Record<string, string> = {};

    if (!passwords.new) {
      newErrors.new = 'Password is required';
    } else if (!Object.values(requirements).every(Boolean)) {
      newErrors.new = 'Password does not meet all requirements';
    }

    if (!passwords.confirm) {
      newErrors.confirm = 'Please confirm your password';
    } else if (passwords.new !== passwords.confirm) {
      newErrors.confirm = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code,
        password: passwords.new,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setErrors({
        form: error.errors?.[0]?.message || 'Failed to reset password. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#f8f8f5] dark:bg-[#221f10] p-4">
        <div className="flex w-full max-w-lg flex-col items-center gap-6">
          <div className="flex w-full items-center gap-3 rounded-lg bg-green-500/10 p-4 text-green-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">
              Success! Your password has been updated. You can now log in.
            </p>
          </div>
          <p className="text-center text-gray-600 dark:text-[#bab59c]">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#f8f8f5] dark:bg-[#221f10] p-4">
        <div className="flex w-full max-w-lg flex-col items-center gap-6">
          <div className="flex w-full items-center gap-3 rounded-lg bg-red-500/10 p-4 text-red-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">
              Link is expired or invalid. Please request a new one.
            </p>
          </div>
          <button
            onClick={() => navigate('/forgot-password')}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-[#f2d00d] px-6 text-base font-bold text-[#221f10] transition-colors hover:bg-yellow-400"
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#f8f8f5] dark:bg-[#221f10] p-4">
      <div className="layout-container flex w-full max-w-lg flex-col items-center gap-8">
        {/* Page Heading */}
        <div className="w-full text-center">
          <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">
            Reset Your Password
          </h1>
          <p className="mt-3 text-base font-normal leading-normal text-gray-600 dark:text-gray-400">
            Please enter and confirm your new password below.
          </p>
        </div>

        {/* Main Form Container */}
        <div className="flex w-full flex-col gap-6 rounded-xl bg-white dark:bg-[#181711] p-6 sm:p-8 border border-gray-200 dark:border-[#54503b]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Error Message */}
            {errors.form && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 px-4 py-3 rounded-lg">
                {errors.form}
              </div>
            )}

            {/* New Password Field */}
            <div className="flex flex-col gap-2">
              <label
                className="text-base font-medium leading-normal text-gray-900 dark:text-white"
                htmlFor="new-password"
              >
                New Password
              </label>
              <div className="relative flex w-full items-center">
                <input
                  id="new-password"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwords.new}
                  onChange={(e) => {
                    setPasswords({ ...passwords, new: e.target.value });
                    if (errors.new) {
                      setErrors({ ...errors, new: '' });
                    }
                  }}
                  className={`w-full flex-1 resize-none overflow-hidden rounded-lg border ${
                    errors.new ? 'border-red-500' : 'border-gray-300 dark:border-[#54503b]'
                  } bg-white dark:bg-[#27251b] p-4 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-[#bab59c] focus:border-[#f2d00d] focus:ring-0`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-4 text-gray-500 dark:text-[#bab59c] focus:outline-none focus:ring-2 focus:ring-[#f2d00d] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#27251b] rounded-full"
                >
                  {showPasswords.new ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.new && (
                <p className="text-sm font-normal leading-normal text-red-500">{errors.new}</p>
              )}
            </div>

            {/* Password Requirements Checklist */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
              <label className="flex items-center gap-x-3">
                <input
                  type="checkbox"
                  checked={requirements.minLength}
                  disabled
                  className="h-5 w-5 rounded border-2 border-gray-300 dark:border-[#54503b] bg-transparent text-[#f2d00d] checked:border-[#f2d00d] checked:bg-[#f2d00d] focus:ring-0 focus:ring-offset-0 disabled:opacity-50"
                />
                <p className="text-sm font-normal leading-normal text-gray-900 dark:text-white">
                  Minimum 8 characters
                </p>
              </label>
              <label className="flex items-center gap-x-3">
                <input
                  type="checkbox"
                  checked={requirements.hasUppercase}
                  disabled
                  className="h-5 w-5 rounded border-2 border-gray-300 dark:border-[#54503b] bg-transparent text-[#f2d00d] checked:border-[#f2d00d] checked:bg-[#f2d00d] focus:ring-0 focus:ring-offset-0 disabled:opacity-50"
                />
                <p className="text-sm font-normal leading-normal text-gray-900 dark:text-white">
                  One uppercase letter
                </p>
              </label>
              <label className="flex items-center gap-x-3">
                <input
                  type="checkbox"
                  checked={requirements.hasNumber}
                  disabled
                  className="h-5 w-5 rounded border-2 border-gray-300 dark:border-[#54503b] bg-transparent text-[#f2d00d] checked:border-[#f2d00d] checked:bg-[#f2d00d] focus:ring-0 focus:ring-offset-0 disabled:opacity-50"
                />
                <p className="text-sm font-normal leading-normal text-gray-900 dark:text-white">
                  One number
                </p>
              </label>
              <label className="flex items-center gap-x-3">
                <input
                  type="checkbox"
                  checked={requirements.hasSpecialChar}
                  disabled
                  className="h-5 w-5 rounded border-2 border-gray-300 dark:border-[#54503b] bg-transparent text-[#f2d00d] checked:border-[#f2d00d] checked:bg-[#f2d00d] focus:ring-0 focus:ring-offset-0 disabled:opacity-50"
                />
                <p className="text-sm font-normal leading-normal text-gray-900 dark:text-white">
                  One special character
                </p>
              </label>
            </div>

            {/* Confirm New Password Field */}
            <div className="flex flex-col gap-2">
              <label
                className="text-base font-medium leading-normal text-gray-900 dark:text-white"
                htmlFor="confirm-password"
              >
                Confirm New Password
              </label>
              <div className="relative flex w-full items-center">
                <input
                  id="confirm-password"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwords.confirm}
                  onChange={(e) => {
                    setPasswords({ ...passwords, confirm: e.target.value });
                    if (errors.confirm) {
                      setErrors({ ...errors, confirm: '' });
                    }
                  }}
                  className={`w-full flex-1 resize-none overflow-hidden rounded-lg border ${
                    errors.confirm ? 'border-red-500' : 'border-gray-300 dark:border-[#54503b]'
                  } bg-white dark:bg-[#27251b] p-4 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-[#bab59c] focus:border-[#f2d00d] focus:ring-0`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-4 text-gray-500 dark:text-[#bab59c] focus:outline-none focus:ring-2 focus:ring-[#f2d00d] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#27251b] rounded-full"
                >
                  {showPasswords.confirm ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirm && (
                <p className="text-sm font-normal leading-normal text-red-500">{errors.confirm}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-14 w-full items-center justify-center rounded-lg bg-[#f2d00d] px-4 py-2 text-base font-bold text-black transition-colors hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-[#f2d00d] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#221f10] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
