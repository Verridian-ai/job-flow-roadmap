import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ExperienceInfo {
  yearsOfExperience: string;
  specialties: string[];
  industries: string[];
}

const specialtyOptions = [
  'Resume Writing',
  'Interview Coaching',
  'Career Planning',
  'Negotiation',
  'Technical Interviews',
  'Leadership Coaching',
  'Job Search Strategy',
  'Personal Branding',
  'Career Transition',
  'Executive Coaching'
];

const industryOptions = [
  'Technology',
  'Finance',
  'Healthcare',
  'Consulting',
  'Marketing',
  'Sales',
  'Education',
  'Manufacturing',
  'Legal',
  'Media & Entertainment',
  'Real Estate',
  'Retail'
];

export default function ProfileCreationExperience() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ExperienceInfo>({
    yearsOfExperience: '',
    specialties: [],
    industries: [],
  });

  useEffect(() => {
    const saved = localStorage.getItem('coachProfileExperience');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const toggleIndustry = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter(i => i !== industry)
        : [...prev.industries, industry]
    }));
  };

  const handleNext = () => {
    localStorage.setItem('coachProfileExperience', JSON.stringify(formData));
    navigate('/coach/profile-creation/skills');
  };

  const handleBack = () => {
    localStorage.setItem('coachProfileExperience', JSON.stringify(formData));
    navigate('/coach/profile-creation/basics');
  };

  const handleSaveAndExit = () => {
    localStorage.setItem('coachProfileExperience', JSON.stringify(formData));
    navigate('/coach-dashboard');
  };

  const isValid = formData.yearsOfExperience && formData.specialties.length > 0 && formData.industries.length > 0;

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
              <p className="mb-2 text-sm font-medium text-gray-400">Step 2 of 6</p>
              <div className="flex gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500/30"></div>
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500"></div>
                <div className="h-1.5 flex-1 rounded-full bg-gray-700"></div>
                <div className="h-1.5 flex-1 rounded-full bg-gray-700"></div>
                <div className="h-1.5 flex-1 rounded-full bg-gray-700"></div>
                <div className="h-1.5 flex-1 rounded-full bg-gray-700"></div>
              </div>
            </div>

            {/* Page Title */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white">Your Experience</h1>
              <p className="mt-2 text-base text-gray-400">Tell us about your coaching expertise and background.</p>
            </div>

            {/* Form Card */}
            <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-6 sm:p-8">
              <form className="space-y-8">
                {/* Years of Experience */}
                <div>
                  <label htmlFor="yearsOfExperience" className="block pb-2 text-sm font-medium text-white">
                    Years of Coaching Experience*
                  </label>
                  <input
                    type="number"
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                    min="0"
                    max="50"
                    placeholder="e.g., 5"
                    className="w-full px-3 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50"
                  />
                </div>

                {/* Specialties */}
                <div>
                  <label className="block pb-3 text-sm font-medium text-white">
                    Select Your Specialties* <span className="text-gray-400">(Choose at least one)</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {specialtyOptions.map(specialty => (
                      <button
                        key={specialty}
                        type="button"
                        onClick={() => toggleSpecialty(specialty)}
                        className={`p-3 rounded-lg border text-left transition ${
                          formData.specialties.includes(specialty)
                            ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500'
                            : 'border-gray-700 hover:border-gray-600 text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{specialty}</span>
                          {formData.specialties.includes(specialty) && (
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    {formData.specialties.length} selected
                  </p>
                </div>

                {/* Industries */}
                <div>
                  <label className="block pb-3 text-sm font-medium text-white">
                    Industries You Serve* <span className="text-gray-400">(Choose at least one)</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {industryOptions.map(industry => (
                      <button
                        key={industry}
                        type="button"
                        onClick={() => toggleIndustry(industry)}
                        className={`p-3 rounded-lg border text-left transition ${
                          formData.industries.includes(industry)
                            ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500'
                            : 'border-gray-700 hover:border-gray-600 text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{industry}</span>
                          {formData.industries.includes(industry) && (
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    {formData.industries.length} selected
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isValid}
                    className="flex items-center gap-2 px-6 py-3 text-base font-bold text-gray-900 bg-yellow-500 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next: Skills & Certifications
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
