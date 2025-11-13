import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  DollarSign,
  Calendar,
  Award,
  FileText
} from 'lucide-react';

type OnboardingStep = 'welcome' | 'experience' | 'pricing' | 'availability' | 'certifications' | 'review';

interface Certification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

interface Portfolio {
  title: string;
  description: string;
  url?: string;
}

interface Availability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export default function CoachOnboarding() {
  const navigate = useNavigate();
  const createCoachProfile = useMutation(api.coaches.create);

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [specialty, setSpecialty] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [hourlyRate, setHourlyRate] = useState(50);
  const [availability, setAvailability] = useState<Availability[]>([]);

  const steps: OnboardingStep[] = ['welcome', 'experience', 'pricing', 'availability', 'certifications', 'review'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const specialtyOptions = [
    'Resume Writing',
    'Interview Coaching',
    'Career Planning',
    'Negotiation',
    'Technical Interviews',
    'Leadership Coaching',
    'Job Search Strategy',
    'Personal Branding'
  ];

  const industryOptions = [
    'Technology',
    'Finance',
    'Healthcare',
    'Consulting',
    'Marketing',
    'Sales',
    'Education',
    'Manufacturing'
  ];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const toggleSpecialty = (spec: string) => {
    if (specialty.includes(spec)) {
      setSpecialty(specialty.filter(s => s !== spec));
    } else {
      setSpecialty([...specialty, spec]);
    }
  };

  const toggleIndustry = (ind: string) => {
    if (industries.includes(ind)) {
      setIndustries(industries.filter(i => i !== ind));
    } else {
      setIndustries([...industries, ind]);
    }
  };

  const addCertification = () => {
    setCertifications([...certifications, { name: '', issuer: '', date: '' }]);
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const addAvailability = () => {
    setAvailability([...availability, { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }]);
  };

  const updateAvailability = (index: number, field: keyof Availability, value: string | number) => {
    const updated = [...availability];
    updated[index] = { ...updated[index], [field]: value };
    setAvailability(updated);
  };

  const removeAvailability = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createCoachProfile({
        specialty,
        industries,
        experience,
        certifications,
        portfolio,
        hourlyRate,
        availability,
      });
      alert('Coach profile created successfully!');
      navigate('/coach/dashboard');
    } catch (error) {
      console.error('Failed to create coach profile:', error);
      alert('Failed to create coach profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'welcome':
        return true;
      case 'experience':
        return specialty.length > 0 && industries.length > 0 && experience;
      case 'pricing':
        return hourlyRate > 0;
      case 'availability':
        return availability.length > 0;
      case 'certifications':
        return true; // Optional
      case 'review':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Coach Onboarding</h1>
            <span className="text-sm text-gray-400">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-6">
          {currentStep === 'welcome' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-gray-900" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Welcome to the Coach Platform!</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                We're excited to have you join our community of career coaches. This onboarding process will help you set up your coach profile and start helping job seekers achieve their goals.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <Briefcase className="w-8 h-8 text-yellow-500 mb-2" />
                  <h3 className="font-semibold mb-1">Share Your Expertise</h3>
                  <p className="text-sm text-gray-400">Tell us about your specialties and experience</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <DollarSign className="w-8 h-8 text-yellow-500 mb-2" />
                  <h3 className="font-semibold mb-1">Set Your Rates</h3>
                  <p className="text-sm text-gray-400">Choose your hourly pricing</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <Calendar className="w-8 h-8 text-yellow-500 mb-2" />
                  <h3 className="font-semibold mb-1">Manage Availability</h3>
                  <p className="text-sm text-gray-400">Set your coaching schedule</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'experience' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Your Experience</h2>

              {/* Specialties */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">
                  Select Your Specialties (Choose at least one)
                </label>
                <div className="grid md:grid-cols-2 gap-2">
                  {specialtyOptions.map(spec => (
                    <button
                      key={spec}
                      onClick={() => toggleSpecialty(spec)}
                      className={`p-3 rounded-lg border text-left transition ${
                        specialty.includes(spec)
                          ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{spec}</span>
                        {specialty.includes(spec) && <CheckCircle2 className="w-5 h-5" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Industries */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">
                  Select Industries You Serve (Choose at least one)
                </label>
                <div className="grid md:grid-cols-2 gap-2">
                  {industryOptions.map(ind => (
                    <button
                      key={ind}
                      onClick={() => toggleIndustry(ind)}
                      className={`p-3 rounded-lg border text-left transition ${
                        industries.includes(ind)
                          ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{ind}</span>
                        {industries.includes(ind) && <CheckCircle2 className="w-5 h-5" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Years of Experience */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Years of Coaching Experience
                </label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g., 5"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>
          )}

          {currentStep === 'pricing' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Set Your Hourly Rate</h2>
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <DollarSign className="w-12 h-12 text-yellow-500" />
                    <span className="text-5xl font-bold">{hourlyRate}</span>
                    <span className="text-2xl text-gray-400 ml-2">/hour</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="500"
                    step="5"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>$25</span>
                    <span>$500</span>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-300">
                    <strong>Tip:</strong> Set a competitive rate based on your experience. You can always adjust this later.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'availability' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Set Your Availability</h2>

              <div className="space-y-4 mb-6">
                {availability.map((slot, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Day</label>
                        <select
                          value={slot.dayOfWeek}
                          onChange={(e) => updateAvailability(index, 'dayOfWeek', parseInt(e.target.value))}
                          className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:border-yellow-500"
                        >
                          {daysOfWeek.map((day, i) => (
                            <option key={i} value={i}>{day}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Start Time</label>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">End Time</label>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:border-yellow-500"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => removeAvailability(index)}
                          className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition w-full"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addAvailability}
                className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                Add Time Slot
              </button>
            </div>
          )}

          {currentStep === 'certifications' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Certifications & Portfolio (Optional)</h2>

              <div className="space-y-4 mb-6">
                {certifications.map((cert, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Certification Name</label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => updateCertification(index, 'name', e.target.value)}
                          placeholder="e.g., Certified Career Coach"
                          className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Issuer</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                          placeholder="e.g., ICF"
                          className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Date</label>
                        <input
                          type="date"
                          value={cert.date}
                          onChange={(e) => updateCertification(index, 'date', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">URL (Optional)</label>
                        <input
                          type="url"
                          value={cert.url || ''}
                          onChange={(e) => updateCertification(index, 'url', e.target.value)}
                          placeholder="https://..."
                          className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:border-yellow-500"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeCertification(index)}
                      className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition text-sm"
                    >
                      Remove Certification
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addCertification}
                className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                <Award className="w-5 h-5 inline mr-2" />
                Add Certification
              </button>
            </div>
          )}

          {currentStep === 'review' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Review Your Profile</h2>

              <div className="space-y-6">
                {/* Specialties */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {specialty.map(spec => (
                      <span key={spec} className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Industries */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Industries</h3>
                  <div className="flex flex-wrap gap-2">
                    {industries.map(ind => (
                      <span key={ind} className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience & Rate */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Experience</h3>
                    <p className="text-2xl font-bold text-yellow-500">{experience} years</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Hourly Rate</h3>
                    <p className="text-2xl font-bold text-yellow-500">${hourlyRate}/hour</p>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Availability</h3>
                  <div className="space-y-2">
                    {availability.map((slot, index) => (
                      <div key={index} className="bg-gray-700 p-3 rounded-lg flex items-center gap-4">
                        <span className="font-medium">{daysOfWeek[slot.dayOfWeek]}</span>
                        <span className="text-gray-400">{slot.startTime} - {slot.endTime}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                {certifications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Certifications</h3>
                    <div className="space-y-2">
                      {certifications.map((cert, index) => (
                        <div key={index} className="bg-gray-700 p-3 rounded-lg">
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-sm text-gray-400">{cert.issuer} - {cert.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className={`px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition ${
              currentStepIndex === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          {currentStep === 'review' ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !canProceed()}
              className="px-8 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {isSubmitting ? 'Creating Profile...' : 'Complete Onboarding'}
              <CheckCircle2 className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
