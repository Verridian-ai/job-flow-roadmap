import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, isLoaded } = useSignIn();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (result.status === 'complete') {
        await signIn.setActive({ session: result.createdSessionId });
        navigate('/dashboard');
      }
    } catch (error: any) {
      setErrors({
        form: error.errors?.[0]?.message || 'Login failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSSOLogin = async (provider: 'oauth_google' | 'oauth_microsoft' | 'oauth_apple') => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (error: any) {
      setErrors({
        form: error.errors?.[0]?.message || 'SSO login failed. Please try again.',
      });
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center p-4 bg-[#121212] text-[#E0E0E0]">
      <div className="layout-container flex h-full w-full max-w-md flex-col items-center justify-center">
        <div className="w-full rounded-xl bg-[#1f1f1f] p-8 shadow-lg border border-[#333333]">
          {/* Logo and Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-[#f2d00d] rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-[#121212]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-[#E0E0E0] text-2xl font-bold leading-tight text-center">
              Welcome Back
            </h1>
            <p className="text-[#A0A0A0] text-sm mt-1">
              Log in to continue your career journey.
            </p>
          </div>

          {/* Error Message */}
          {errors.form && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded">
              {errors.form}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <label className="flex flex-col w-full">
              <p className="text-[#E0E0E0] text-sm font-medium leading-normal pb-2">
                Email Address
              </p>
              <div className="relative flex w-full items-center">
                <svg
                  className="absolute left-3 w-5 h-5 text-[#A0A0A0]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full h-12 py-2 pr-3 pl-10 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-[#333333]'
                  } bg-[#2A2A2A] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#f2d00d]/50`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </label>

            {/* Password Field */}
            <div className="flex flex-col w-full">
              <label className="flex flex-col">
                <p className="text-[#E0E0E0] text-sm font-medium leading-normal pb-2">
                  Password
                </p>
                <div className="relative flex w-full items-center">
                  <svg
                    className="absolute left-3 w-5 h-5 text-[#A0A0A0]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full h-12 py-2 pr-10 pl-10 rounded-lg border ${
                      errors.password ? 'border-red-500' : 'border-[#333333]'
                    } bg-[#2A2A2A] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#f2d00d]/50`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#A0A0A0] hover:text-[#E0E0E0]"
                  >
                    {showPassword ? (
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
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </label>
              <div className="flex justify-end w-full">
                <Link
                  to="/forgot-password"
                  className="text-[#f2d00d]/80 hover:text-[#f2d00d] text-sm font-normal leading-normal pt-2 underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-lg bg-[#f2d00d] px-6 text-base font-bold text-[#121212] transition-colors hover:bg-[#f2d00d]/90 focus:outline-none focus:ring-2 focus:ring-[#f2d00d]/50 focus:ring-offset-2 focus:ring-offset-[#1f1f1f] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute w-full border-t border-[#333333]"></div>
            <span className="relative bg-[#1f1f1f] px-2 text-sm text-[#A0A0A0]">
              OR
            </span>
          </div>

          {/* SSO Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleSSOLogin('oauth_google')}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-[#333333] bg-[#333333] px-4 text-sm font-medium text-[#E0E0E0] transition-colors hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-[#f2d00d]/50 focus:ring-offset-2 focus:ring-offset-[#1f1f1f]"
            >
              <img
                alt="Google logo"
                className="h-5 w-5"
                src="https://www.google.com/favicon.ico"
              />
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => handleSSOLogin('oauth_microsoft')}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-[#333333] bg-[#333333] px-4 text-sm font-medium text-[#E0E0E0] transition-colors hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-[#f2d00d]/50 focus:ring-offset-2 focus:ring-offset-[#1f1f1f]"
            >
              <img
                alt="Microsoft logo"
                className="h-5 w-5"
                src="https://www.microsoft.com/favicon.ico"
              />
              <span>Continue with Microsoft</span>
            </button>

            <button
              onClick={() => handleSSOLogin('oauth_apple')}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-[#333333] bg-[#333333] px-4 text-sm font-medium text-[#E0E0E0] transition-colors hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-[#f2d00d]/50 focus:ring-offset-2 focus:ring-offset-[#1f1f1f]"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-[#A0A0A0] pt-6">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-[#f2d00d]/80 hover:text-[#f2d00d] underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
