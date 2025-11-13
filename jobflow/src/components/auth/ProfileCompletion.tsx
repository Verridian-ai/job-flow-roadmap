import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface ProfileCompletionProps {
  userId: Id<"users">;
  onComplete?: () => void;
}

export default function ProfileCompletion({ userId, onComplete }: ProfileCompletionProps) {
  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    phone: "",
    profilePhoto: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const completeProfile = useMutation(api.registration.completeProfile);
  const registrationStatus = useQuery(api.registration.getRegistrationStatus, { userId });

  useEffect(() => {
    // If profile is already complete, call onComplete
    if (registrationStatus?.profileComplete && onComplete) {
      onComplete();
    }
  }, [registrationStatus, onComplete]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (!formData.bio || formData.bio.trim().length < 20) {
      setError("Bio must be at least 20 characters");
      return;
    }

    if (!formData.location || formData.location.trim().length < 2) {
      setError("Please enter your location");
      return;
    }

    setLoading(true);
    try {
      await completeProfile({
        userId,
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone || undefined,
        profilePhoto: formData.profilePhoto || undefined,
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const skipProfile = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Complete Your Profile
        </h2>
        <p className="text-gray-600">
          Tell us a bit more about yourself to help others get to know you better.
        </p>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Step 3 of 3</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Profile Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Photo (Optional)
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {formData.profilePhoto ? (
                <img
                  src={formData.profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <input
                type="url"
                value={formData.profilePhoto}
                onChange={(e) => handleInputChange("profilePhoto", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/photo.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a URL to your profile photo
              </p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio *
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={
              registrationStatus?.role === "coach"
                ? "Share your coaching experience, specialties, and what makes you a great career coach..."
                : "Tell employers about your background, skills, and career goals..."
            }
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500">
              Minimum 20 characters
            </p>
            <p
              className={`text-xs ${
                formData.bio.length >= 20 ? "text-green-600" : "text-gray-500"
              }`}
            >
              {formData.bio.length}/500
            </p>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="San Francisco, CA"
          />
          <p className="text-xs text-gray-500 mt-1">
            City, State or City, Country
          </p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+1 (555) 123-4567"
          />
          <p className="text-xs text-gray-500 mt-1">
            Your phone number will be kept private unless you choose to share it
          </p>
        </div>

        {/* Role-specific tips */}
        {registrationStatus?.role && (
          <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              {registrationStatus.role === "coach" ? "Coach Tips:" : "Job Seeker Tips:"}
            </h3>
            <ul className="text-xs text-blue-700 space-y-1">
              {registrationStatus.role === "coach" ? (
                <>
                  <li>• Highlight your coaching certifications and experience</li>
                  <li>• Mention your specialties (e.g., resume review, interview prep)</li>
                  <li>• Share your success stories and approach</li>
                </>
              ) : (
                <>
                  <li>• Mention your current role and years of experience</li>
                  <li>• Highlight key skills and technologies</li>
                  <li>• Share what you're looking for in your next opportunity</li>
                </>
              )}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Saving..." : "Complete Profile"}
          </button>
          <button
            type="button"
            onClick={skipProfile}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Skip for Now
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          You can always update your profile later from your settings
        </p>
      </form>
    </div>
  );
}
