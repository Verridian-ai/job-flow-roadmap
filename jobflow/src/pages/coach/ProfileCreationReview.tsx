import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MapPin, DollarSign, Clock, Award, Briefcase } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ProfileCreationReview() {
  const navigate = useNavigate();
  const createCoachProfile = useMutation(api.coaches.create);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [basics, setBasics] = useState<any>(null);
  const [experience, setExperience] = useState<any>(null);
  const [skills, setSkills] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [security, setSecurity] = useState<any>(null);

  useEffect(() => {
    const basicsData = localStorage.getItem('coachProfileBasics');
    const experienceData = localStorage.getItem('coachProfileExperience');
    const skillsData = localStorage.getItem('coachProfileSkills');
    const preferencesData = localStorage.getItem('coachProfilePreferences');
    const securityData = localStorage.getItem('coachProfileSecurity');

    if (basicsData) setBasics(JSON.parse(basicsData));
    if (experienceData) setExperience(JSON.parse(experienceData));
    if (skillsData) setSkills(JSON.parse(skillsData));
    if (preferencesData) setPreferences(JSON.parse(preferencesData));
    if (securityData) setSecurity(JSON.parse(securityData));
  }, []);

  const handleBack = () => {
    navigate('/coach/profile-creation/security');
  };

  const handleSubmit = async () => {
    if (!experience || !preferences) {
      alert('Missing required profile information');
      return;
    }

    setIsSubmitting(true);
    try {
      await createCoachProfile({
        specialty: experience.specialties || [],
        industries: experience.industries || [],
        experience: experience.yearsOfExperience || '0',
        certifications: skills?.certifications || [],
        portfolio: [],
        hourlyRate: preferences.hourlyRate || 50,
        availability: preferences.availability || [],
        stripeAccountId: security?.stripeConnected ? 'stripe_connected' : undefined,
      });

      // Clear localStorage
      localStorage.removeItem('coachProfileBasics');
      localStorage.removeItem('coachProfileExperience');
      localStorage.removeItem('coachProfileSkills');
      localStorage.removeItem('coachProfilePreferences');
      localStorage.removeItem('coachProfileSecurity');

      alert('Coach profile created successfully!');
      navigate('/coach-dashboard');
    } catch (error) {
      console.error('Failed to create coach profile:', error);
      alert('Failed to create coach profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!basics || !experience || !skills || !preferences || !security) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading profile data...</p>
      </div>
    );
  }

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
        </header>

        {/* Main Content */}
        <main className="py-8">
          <div className="max-w-3xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-10">
              <p className="mb-2 text-sm font-medium text-gray-400">Step 6 of 6</p>
              <div className="flex gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500/30"></div>
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500/30"></div>
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500/30"></div>
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500/30"></div>
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500/30"></div>
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500"></div>
              </div>
            </div>

            {/* Page Title */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white">Review & Confirm</h1>
              <p className="mt-2 text-base text-gray-400">Review your profile before publishing.</p>
            </div>

            {/* Profile Preview */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-6">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold text-yellow-500">
                    {basics.firstName?.[0]}{basics.lastName?.[0]}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white">
                      {basics.firstName} {basics.lastName}
                    </h2>
                    <div className="flex items-center gap-2 mt-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{basics.city}, {basics.country}</span>
                    </div>
                    {basics.bio && (
                      <p className="mt-3 text-sm text-gray-300">{basics.bio}</p>
                    )}
                  </div>
                </div>

                {(basics.linkedinUrl || basics.websiteUrl) && (
                  <div className="flex gap-3 pt-4 border-t border-gray-700">
                    {basics.linkedinUrl && (
                      <a href={basics.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-yellow-500 hover:text-yellow-400">
                        LinkedIn
                      </a>
                    )}
                    {basics.websiteUrl && (
                      <a href={basics.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-yellow-500 hover:text-yellow-400">
                        Website
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Experience Summary */}
              <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Experience</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
                    <Briefcase className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-xs text-gray-400">Years of Experience</p>
                      <p className="text-lg font-bold text-white">{experience.yearsOfExperience}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
                    <DollarSign className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-xs text-gray-400">Hourly Rate</p>
                      <p className="text-lg font-bold text-white">${preferences.hourlyRate}/hr</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {experience.specialties.map((spec: string) => (
                        <span key={spec} className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Industries</h4>
                    <div className="flex flex-wrap gap-2">
                      {experience.industries.map((ind: string) => (
                        <span key={ind} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills & Certifications */}
              {(skills.skills.length > 0 || skills.certifications.length > 0) && (
                <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Skills & Certifications</h3>

                  {skills.skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {skills.skills.map((skill: string) => (
                          <span key={skill} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {skills.certifications.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Certifications</h4>
                      <div className="space-y-2">
                        {skills.certifications.map((cert: any, index: number) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-gray-900 rounded-lg">
                            <Award className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-white">{cert.name}</p>
                              <p className="text-sm text-gray-400">{cert.issuer} - {cert.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Availability */}
              {preferences.availability.length > 0 && (
                <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    Availability
                  </h3>
                  <div className="space-y-2">
                    {preferences.availability.map((slot: any, index: number) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-900 rounded-lg">
                        <span className="font-medium text-white min-w-[100px]">{daysOfWeek[slot.dayOfWeek]}</span>
                        <span className="text-gray-400">{slot.startTime} - {slot.endTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Preferences */}
              {(preferences.coachingStyle.length > 0 || preferences.sessionTypes.length > 0) && (
                <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Preferences</h3>

                  {preferences.coachingStyle.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Coaching Style</h4>
                      <div className="flex flex-wrap gap-2">
                        {preferences.coachingStyle.map((style: string) => (
                          <span key={style} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                            {style}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {preferences.sessionTypes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Session Types</h4>
                      <div className="flex flex-wrap gap-2">
                        {preferences.sessionTypes.map((type: string) => (
                          <span key={type} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Security Status */}
              <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Security & Verification</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm">Stripe account connected</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm">Legal agreements accepted</span>
                  </div>
                  {security.backgroundCheckConsent && (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm">Background check authorized</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8">
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
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 text-base font-bold text-gray-900 bg-yellow-500 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Profile'}
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
