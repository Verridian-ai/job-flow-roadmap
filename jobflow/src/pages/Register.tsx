import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import EmailVerification from "../components/auth/EmailVerification";
import ProfileCompletion from "../components/auth/ProfileCompletion";
import { Id } from "../../convex/_generated/dataModel";

type RegistrationStep = "register" | "verify" | "profile" | "complete";

export default function Register() {
  const [step, setStep] = useState<RegistrationStep>("register");
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const navigate = useNavigate();

  const handleRegistrationSuccess = (newUserId: Id<"users">) => {
    setUserId(newUserId);
    setStep("verify");
  };

  const handleEmailVerified = () => {
    setStep("profile");
  };

  const handleProfileComplete = () => {
    setStep("complete");
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  const handleSwitchToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Job Flow
          </h1>
          <p className="text-gray-600">
            Your AI-powered career companion
          </p>
        </div>

        {/* Step Indicator */}
        {step !== "complete" && (
          <div className="mb-8">
            <div className="flex justify-center items-center space-x-4">
              {/* Step 1: Register */}
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === "register"
                      ? "bg-blue-600 text-white"
                      : step === "verify" || step === "profile"
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step === "verify" || step === "profile" ? "✓" : "1"}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Register
                </span>
              </div>

              <div className="w-16 h-1 bg-gray-300"></div>

              {/* Step 2: Verify */}
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === "verify"
                      ? "bg-blue-600 text-white"
                      : step === "profile"
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step === "profile" ? "✓" : "2"}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Verify Email
                </span>
              </div>

              <div className="w-16 h-1 bg-gray-300"></div>

              {/* Step 3: Profile */}
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === "profile"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Complete Profile
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mt-8">
          {step === "register" && (
            <RegisterForm
              onSuccess={handleRegistrationSuccess}
              onSwitchToLogin={handleSwitchToLogin}
            />
          )}

          {step === "verify" && userId && (
            <EmailVerification
              userId={userId}
              onVerified={handleEmailVerified}
            />
          )}

          {step === "profile" && userId && (
            <ProfileCompletion
              userId={userId}
              onComplete={handleProfileComplete}
            />
          )}

          {step === "complete" && (
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-8 w-8 text-green-600"
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome to Job Flow!
                </h2>
                <p className="text-gray-600 mb-4">
                  Your account is all set up. Redirecting you to your dashboard...
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            By registering, you agree to our{" "}
            <a href="/terms" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
