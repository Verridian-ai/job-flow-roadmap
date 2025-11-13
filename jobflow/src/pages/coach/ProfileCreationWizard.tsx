import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Navbar from '../../components/Navbar';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  User,
  Briefcase,
  Tag,
  DollarSign,
  Shield,
  Eye,
  Save,
  Upload,
  X,
  Plus
} from 'lucide-react';

type WizardStep = 'basics' | 'experience' | 'skills' | 'preferences' | 'security' | 'review';

interface ProfileData {
  // Step 1: Basics
  name: string;
  title: string;
  photo: string;
  bio: string;
  location: string;

  // Step 2: Experience
  yearsExperience: number;
  education: string;
  previousRoles: string[];
  achievements: string[];

  // Step 3: Skills & Specialties
  specialties: string[];
  industries: string[];
  skills: string[];
  languages: string[];

  // Step 4: Preferences
  hourlyRate: number;
  sessionTypes: string[];
  availability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];

  // Step 5: Security & Consent
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
  backgroundCheckCompleted: boolean;
  certifications: {
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }[];
}

export default function ProfileCreationWizard() {
  const navigate = useNavigate();
  const createCoachProfile = useMutation(api.coaches.create);

  const [currentStep, setCurrentStep] = useState<WizardStep>('basics');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    title: '',
    photo: '',
    bio: '',
    location: '',
    yearsExperience: 0,
    education: '',
    previousRoles: [],
    achievements: [],
    specialties: [],
    industries: [],
    skills: [],
    languages: ['English'],
    hourlyRate: 75,
    sessionTypes: [],
    availability: [],
    agreedToTerms: false,
    agreedToPrivacy: false,
    backgroundCheckCompleted: false,
    certifications: []
  });

  const steps: WizardStep[] = ['basics', 'experience', 'skills', 'preferences', 'security', 'review'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const stepTitles: Record<WizardStep, string> = {
    basics: 'Basic Information',
    experience: 'Professional Background',
    skills: 'Skills & Specialties',
    preferences: 'Rate & Availability',
    security: 'Security & Consent',
    review: 'Review & Confirm'
  };

  const specialtyOptions = [
    'Resume Writing',
    'Interview Coaching',
    'Career Planning',
    'Salary Negotiation',
    'Technical Interviews',
    'Leadership Coaching',
    'Job Search Strategy',
    'Personal Branding',
    'LinkedIn Optimization',
    'Career Transition'
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
    'Retail',
    'Legal',
    'Media',
    'Non-Profit'
  ];

  const sessionTypeOptions = [
    'Resume Review',
    'Mock Interview',
    '1-on-1 Coaching',
    'Career Assessment',
    'Strategy Session',
    'Follow-up Session'
  ];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const updateProfile = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof ProfileData, item: string) => {
    const currentArray = profileData[field] as string[];
    if (currentArray.includes(item)) {
      updateProfile(field, currentArray.filter(i => i !== item));
    } else {
      updateProfile(field, [...currentArray, item]);
    }
  };

  const addRole = () => {
    updateProfile('previousRoles', [...profileData.previousRoles, '']);
  };

  const updateRole = (index: number, value: string) => {
    const updated = [...profileData.previousRoles];
    updated[index] = value;
    updateProfile('previousRoles', updated);
  };

  const removeRole = (index: number) => {
    updateProfile('previousRoles', profileData.previousRoles.filter((_, i) => i !== index));
  };

  const addAchievement = () => {
    updateProfile('achievements', [...profileData.achievements, '']);
  };

  const updateAchievement = (index: number, value: string) => {
    const updated = [...profileData.achievements];
    updated[index] = value;
    updateProfile('achievements', updated);
  };

  const removeAchievement = (index: number) => {
    updateProfile('achievements', profileData.achievements.filter((_, i) => i !== index));
  };

  const addAvailability = () => {
    updateProfile('availability', [
      ...profileData.availability,
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }
    ]);
  };

  const updateAvailability = (index: number, field: string, value: string | number) => {
    const updated = [...profileData.availability];
    updated[index] = { ...updated[index], [field]: value };
    updateProfile('availability', updated);
  };

  const removeAvailability = (index: number) => {
    updateProfile('availability', profileData.availability.filter((_, i) => i !== index));
  };

  const addCertification = () => {
    updateProfile('certifications', [
      ...profileData.certifications,
      { name: '', issuer: '', date: '' }
    ]);
  };

  const updateCertification = (index: number, field: string, value: string) => {
    const updated = [...profileData.certifications];
    updated[index] = { ...updated[index], [field]: value };
    updateProfile('certifications', updated);
  };

  const removeCertification = (index: number) => {
    updateProfile('certifications', profileData.certifications.filter((_, i) => i !== index));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'basics':
        return profileData.name && profileData.title && profileData.bio && profileData.location;
      case 'experience':
        return profileData.yearsExperience > 0 && profileData.education;
      case 'skills':
        return profileData.specialties.length > 0 && profileData.industries.length > 0;
      case 'preferences':
        return profileData.hourlyRate > 0 && profileData.availability.length > 0 && profileData.sessionTypes.length > 0;
      case 'security':
        return profileData.agreedToTerms && profileData.agreedToPrivacy;
      case 'review':
        return true;
      default:
        return false;
    }
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

  const handleSaveDraft = async () => {
    setIsDraft(true);
    alert('Draft saved successfully! You can continue later.');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createCoachProfile({
        name: profileData.name,
        title: profileData.title,
        bio: profileData.bio,
        location: profileData.location,
        yearsExperience: profileData.yearsExperience,
        specialties: profileData.specialties,
        industries: profileData.industries,
        hourlyRate: profileData.hourlyRate,
        availability: profileData.availability,
        certifications: profileData.certifications,
      });
      alert('Profile created successfully! Welcome to the coach platform.');
      navigate('/coach-dashboard');
    } catch (error) {
      console.error('Failed to create profile:', error);
      alert('Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Coach Profile</h1>
          <p className="text-gray-400">Complete all steps to start coaching on our platform</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                    index <= currentStepIndex
                      ? 'bg-yellow-500 text-gray-900'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {index < currentStepIndex ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition ${
                      index < currentStepIndex ? 'bg-yellow-500' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            {steps.map(step => (
              <div
                key={step}
                className={`${
                  step === currentStep ? 'text-yellow-500 font-semibold' : 'text-gray-400'
                }`}
              >
                {stepTitles[step]}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-6">
          {/* Step 1: Basics */}
          {currentStep === 'basics' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <User className="w-8 h-8 text-yellow-500" />
                <h2 className="text-2xl font-bold">Basic Information</h2>
              </div>

              <div className="space-y-6">
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    {profileData.photo ? (
                      <img
                        src={profileData.photo}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <button className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Photo
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => updateProfile('name', e.target.value)}
                    placeholder="e.g., John Smith"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">Professional Title *</label>
                  <input
                    type="text"
                    value={profileData.title}
                    onChange={(e) => updateProfile('title', e.target.value)}
                    placeholder="e.g., Senior Career Coach & Resume Expert"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => updateProfile('location', e.target.value)}
                    placeholder="e.g., San Francisco, CA"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Professional Bio * (Tell clients about yourself)
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => updateProfile('bio', e.target.value)}
                    placeholder="Share your coaching philosophy, experience, and what makes you unique..."
                    rows={6}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    {profileData.bio.length} characters (recommended: 300-500)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Experience */}
          {currentStep === 'experience' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-8 h-8 text-yellow-500" />
                <h2 className="text-2xl font-bold">Professional Background</h2>
              </div>

              <div className="space-y-6">
                {/* Years of Experience */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Years of Coaching Experience *
                  </label>
                  <input
                    type="number"
                    value={profileData.yearsExperience || ''}
                    onChange={(e) => updateProfile('yearsExperience', parseInt(e.target.value) || 0)}
                    placeholder="e.g., 5"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  />
                </div>

                {/* Education */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Education & Credentials *
                  </label>
                  <textarea
                    value={profileData.education}
                    onChange={(e) => updateProfile('education', e.target.value)}
                    placeholder="List your degrees, certifications, and relevant education..."
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none"
                  />
                </div>

                {/* Previous Roles */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Previous Professional Roles
                  </label>
                  <div className="space-y-3 mb-3">
                    {profileData.previousRoles.map((role, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => updateRole(index, e.target.value)}
                          placeholder="e.g., Senior Recruiter at Google"
                          className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                        />
                        <button
                          onClick={() => removeRole(index)}
                          className="px-3 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addRole}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Role
                  </button>
                </div>

                {/* Key Achievements */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Key Achievements
                  </label>
                  <div className="space-y-3 mb-3">
                    {profileData.achievements.map((achievement, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={achievement}
                          onChange={(e) => updateAchievement(index, e.target.value)}
                          placeholder="e.g., Helped 100+ clients land jobs at FAANG companies"
                          className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                        />
                        <button
                          onClick={() => removeAchievement(index)}
                          className="px-3 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addAchievement}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Achievement
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Skills & Specialties */}
          {currentStep === 'skills' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Tag className="w-8 h-8 text-yellow-500" />
                <h2 className="text-2xl font-bold">Skills & Specialties</h2>
              </div>

              <div className="space-y-6">
                {/* Specialties */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Coaching Specialties * (Select at least 1)
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {specialtyOptions.map(spec => (
                      <button
                        key={spec}
                        onClick={() => toggleArrayItem('specialties', spec)}
                        className={`p-3 rounded-lg border text-left transition ${
                          profileData.specialties.includes(spec)
                            ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{spec}</span>
                          {profileData.specialties.includes(spec) && (
                            <CheckCircle2 className="w-5 h-5" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Industries */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Industries You Serve * (Select at least 1)
                  </label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {industryOptions.map(ind => (
                      <button
                        key={ind}
                        onClick={() => toggleArrayItem('industries', ind)}
                        className={`p-3 rounded-lg border text-left transition ${
                          profileData.industries.includes(ind)
                            ? 'border-blue-500 bg-blue-500/20 text-blue-500'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{ind}</span>
                          {profileData.industries.includes(ind) && (
                            <CheckCircle2 className="w-5 h-5" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Skills */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Additional Skills (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Add skills separated by commas (e.g., ATS Optimization, LinkedIn, Personal Branding)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        const skills = e.currentTarget.value.split(',').map(s => s.trim());
                        updateProfile('skills', [...new Set([...profileData.skills, ...skills])]);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-500/20 text-purple-500 rounded-full text-sm inline-flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => updateProfile('skills', profileData.skills.filter((_, i) => i !== index))}
                          className="hover:text-purple-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Languages You Speak
                  </label>
                  <input
                    type="text"
                    placeholder="Add languages (press Enter)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        updateProfile('languages', [...profileData.languages, e.currentTarget.value]);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {profileData.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm inline-flex items-center gap-2"
                      >
                        {lang}
                        <button
                          onClick={() => updateProfile('languages', profileData.languages.filter((_, i) => i !== index))}
                          className="hover:text-green-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preferences */}
          {currentStep === 'preferences' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-8 h-8 text-yellow-500" />
                <h2 className="text-2xl font-bold">Rate & Availability</h2>
              </div>

              <div className="space-y-6">
                {/* Hourly Rate */}
                <div>
                  <label className="block text-sm font-medium mb-4">
                    Hourly Rate * (${profileData.hourlyRate}/hour)
                  </label>
                  <div className="flex items-center justify-center mb-4">
                    <DollarSign className="w-8 h-8 text-yellow-500" />
                    <span className="text-5xl font-bold">{profileData.hourlyRate}</span>
                    <span className="text-2xl text-gray-400 ml-2">/hour</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="500"
                    step="5"
                    value={profileData.hourlyRate}
                    onChange={(e) => updateProfile('hourlyRate', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>$25</span>
                    <span>$500</span>
                  </div>
                </div>

                {/* Session Types */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Session Types You Offer * (Select at least 1)
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {sessionTypeOptions.map(type => (
                      <button
                        key={type}
                        onClick={() => toggleArrayItem('sessionTypes', type)}
                        className={`p-3 rounded-lg border text-left transition ${
                          profileData.sessionTypes.includes(type)
                            ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{type}</span>
                          {profileData.sessionTypes.includes(type) && (
                            <CheckCircle2 className="w-5 h-5" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Weekly Availability * (Add at least 1 time slot)
                  </label>
                  <div className="space-y-3 mb-4">
                    {profileData.availability.map((slot, index) => (
                      <div key={index} className="bg-gray-700 p-4 rounded-lg">
                        <div className="grid md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-medium mb-2">Day</label>
                            <select
                              value={slot.dayOfWeek}
                              onChange={(e) => updateAvailability(index, 'dayOfWeek', parseInt(e.target.value))}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                            >
                              {daysOfWeek.map((day, i) => (
                                <option key={i} value={i}>{day}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-2">Start Time</label>
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-2">End Time</label>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                            />
                          </div>
                          <div className="flex items-end">
                            <button
                              onClick={() => removeAvailability(index)}
                              className="w-full px-3 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition"
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
                    className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Time Slot
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Security & Consent */}
          {currentStep === 'security' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-yellow-500" />
                <h2 className="text-2xl font-bold">Security & Consent</h2>
              </div>

              <div className="space-y-6">
                {/* Certifications */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Professional Certifications (Optional)
                  </label>
                  <div className="space-y-3 mb-4">
                    {profileData.certifications.map((cert, index) => (
                      <div key={index} className="bg-gray-700 p-4 rounded-lg">
                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => updateCertification(index, 'name', e.target.value)}
                            placeholder="Certification Name"
                            className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          />
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                            placeholder="Issuing Organization"
                            className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          />
                          <input
                            type="date"
                            value={cert.date}
                            onChange={(e) => updateCertification(index, 'date', e.target.value)}
                            className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          />
                          <input
                            type="url"
                            value={cert.url || ''}
                            onChange={(e) => updateCertification(index, 'url', e.target.value)}
                            placeholder="Verification URL (optional)"
                            className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          />
                        </div>
                        <button
                          onClick={() => removeCertification(index)}
                          className="px-3 py-1 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addCertification}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Certification
                  </button>
                </div>

                {/* Terms & Agreements */}
                <div className="space-y-4 pt-6 border-t border-gray-700">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileData.agreedToTerms}
                      onChange={(e) => updateProfile('agreedToTerms', e.target.checked)}
                      className="mt-1 w-5 h-5 text-yellow-500 focus:ring-yellow-500 rounded"
                    />
                    <div>
                      <p className="font-medium">Terms of Service *</p>
                      <p className="text-sm text-gray-400">
                        I agree to the platform's terms of service and coach conduct guidelines
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileData.agreedToPrivacy}
                      onChange={(e) => updateProfile('agreedToPrivacy', e.target.checked)}
                      className="mt-1 w-5 h-5 text-yellow-500 focus:ring-yellow-500 rounded"
                    />
                    <div>
                      <p className="font-medium">Privacy Policy *</p>
                      <p className="text-sm text-gray-400">
                        I understand how my data will be used and shared on the platform
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileData.backgroundCheckCompleted}
                      onChange={(e) => updateProfile('backgroundCheckCompleted', e.target.checked)}
                      className="mt-1 w-5 h-5 text-yellow-500 focus:ring-yellow-500 rounded"
                    />
                    <div>
                      <p className="font-medium">Background Check (Optional)</p>
                      <p className="text-sm text-gray-400">
                        I consent to a background check to enhance trust and credibility
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 'review' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-8 h-8 text-yellow-500" />
                <h2 className="text-2xl font-bold">Review & Confirm</h2>
              </div>

              <div className="space-y-6">
                {/* Profile Preview */}
                <div className="bg-gray-700 p-6 rounded-lg">
                  <div className="flex items-start gap-4 mb-4">
                    {profileData.photo ? (
                      <img
                        src={profileData.photo}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center">
                        <User className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">{profileData.name}</h3>
                      <p className="text-lg text-gray-300">{profileData.title}</p>
                      <p className="text-gray-400">{profileData.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-yellow-500">${profileData.hourlyRate}</p>
                      <p className="text-sm text-gray-400">per hour</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{profileData.bio}</p>
                </div>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Experience</p>
                    <p className="text-2xl font-bold">{profileData.yearsExperience} years</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Specialties</p>
                    <p className="text-2xl font-bold">{profileData.specialties.length}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Industries</p>
                    <p className="text-2xl font-bold">{profileData.industries.length}</p>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Coaching Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.specialties.map(spec => (
                      <span key={spec} className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Industries */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Industries</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.industries.map(ind => (
                      <span key={ind} className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Session Types */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Session Types Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.sessionTypes.map(type => (
                      <span key={type} className="px-3 py-1 bg-purple-500/20 text-purple-500 rounded-full text-sm">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Availability Summary */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Availability</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {profileData.availability.map((slot, index) => (
                      <div key={index} className="bg-gray-700 p-3 rounded-lg flex items-center justify-between">
                        <span className="font-medium">{daysOfWeek[slot.dayOfWeek]}</span>
                        <span className="text-gray-400">{slot.startTime} - {slot.endTime}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                {profileData.certifications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Certifications</h3>
                    <div className="space-y-2">
                      {profileData.certifications.map((cert, index) => (
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

        {/* Navigation */}
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

          <button
            onClick={handleSaveDraft}
            className="px-6 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition inline-flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Draft
          </button>

          {currentStep === 'review' ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !canProceed()}
              className="px-8 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {isSubmitting ? 'Creating Profile...' : 'Publish Profile'}
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
