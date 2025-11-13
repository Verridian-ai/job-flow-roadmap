import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowRight } from 'lucide-react';

interface BasicInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  city: string;
  linkedinUrl: string;
  websiteUrl: string;
  bio: string;
  profilePhoto?: File;
}

export default function ProfileCreationBasics() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BasicInfo>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    country: 'United States',
    city: '',
    linkedinUrl: '',
    websiteUrl: '',
    bio: '',
  });
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePhoto: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    // Save to localStorage for multi-step flow
    localStorage.setItem('coachProfileBasics', JSON.stringify(formData));
    navigate('/coach/profile-creation/experience');
  };

  const handleSaveAndExit = () => {
    localStorage.setItem('coachProfileBasics', JSON.stringify(formData));
    navigate('/coach-dashboard');
  };

  const isValid = formData.firstName && formData.lastName && formData.phoneNumber && formData.country && formData.city;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between py-6 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 text-yellow-500">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fillRule="evenodd"></path>
                <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight">CareerDev AI</h2>
          </div>
          <button
            onClick={handleSaveAndExit}
            className="px-4 py-2 text-sm font-medium text-gray-400 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 hover:text-white transition-colors"
          >
            Save and exit
          </button>
        </header>

        {/* Main Content */}
        <main className="py-8">
          <div className="max-w-2xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-10">
              <p className="mb-2 text-sm font-medium text-gray-400">Step 1 of 6</p>
              <div className="flex gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500"></div>
                <div className="h-1.5 flex-1 rounded-full bg-gray-700"></div>
                <div className="h-1.5 flex-1 rounded-full bg-gray-700"></div>
                <div className="h-1.5 flex-1 rounded-full bg-gray-700"></div>
                <div className="h-1.5 flex-1 rounded-full bg-gray-700"></div>
                <div className="h-1.5 flex-1 rounded-full bg-gray-700"></div>
              </div>
            </div>

            {/* Page Title */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white">Let's start with the basics</h1>
              <p className="mt-2 text-base text-gray-400">This information helps us create your professional coach profile.</p>
            </div>

            {/* Form Card */}
            <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-6 sm:p-8">
              <form className="space-y-6">
                {/* Profile Photo */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600">
                        <Upload className="w-12 h-12 text-gray-500" />
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 bg-yellow-500 p-2 rounded-full cursor-pointer hover:bg-yellow-400 transition-colors">
                      <Upload className="w-5 h-5 text-gray-900" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">Upload your profile photo</p>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block pb-2 text-sm font-medium text-white">
                      First Name*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      maxLength={50}
                      placeholder="Enter your first name"
                      className="w-full px-3 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block pb-2 text-sm font-medium text-white">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      maxLength={50}
                      placeholder="Enter your last name"
                      className="w-full px-3 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block pb-2 text-sm font-medium text-white">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    maxLength={20}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50"
                  />
                  <p className="mt-1.5 text-xs text-gray-400">E.164 format recommended</p>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="country" className="block pb-2 text-sm font-medium text-white">
                      Country of Residence*
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 appearance-none"
                    >
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>France</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="city" className="block pb-2 text-sm font-medium text-white">
                      City*
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      maxLength={50}
                      placeholder="Enter your city"
                      className="w-full px-3 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block pb-2 text-sm font-medium text-white">
                    Professional Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    maxLength={500}
                    placeholder="Tell us about your coaching philosophy and approach..."
                    className="w-full px-3 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 resize-none"
                  />
                  <p className="mt-1.5 text-xs text-gray-400">{formData.bio.length}/500 characters</p>
                </div>

                {/* LinkedIn URL */}
                <div>
                  <label htmlFor="linkedinUrl" className="block pb-2 text-sm font-medium text-white">
                    LinkedIn Profile URL <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    id="linkedinUrl"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    placeholder="https://www.linkedin.com/in/yourprofile"
                    className="w-full px-3 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50"
                  />
                </div>

                {/* Website URL */}
                <div>
                  <label htmlFor="websiteUrl" className="block pb-2 text-sm font-medium text-white">
                    Personal Website/Portfolio URL <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    id="websiteUrl"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-3 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50"
                  />
                </div>

                {/* Next Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isValid}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 text-base font-bold text-gray-900 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next: Your Experience
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
