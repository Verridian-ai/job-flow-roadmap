import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Plus, X, DollarSign } from 'lucide-react';

interface TimeSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface PreferencesInfo {
  hourlyRate: number;
  availability: TimeSlot[];
  coachingStyle: string[];
  sessionTypes: string[];
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const coachingStyleOptions = [
  'Directive',
  'Facilitative',
  'Transformational',
  'Solution-Focused',
  'Strengths-Based',
  'Holistic'
];

const sessionTypeOptions = [
  'One-on-one Sessions',
  'Group Coaching',
  'Workshop Facilitation',
  'Email Coaching',
  'Phone Coaching',
  'Video Coaching'
];

export default function ProfileCreationPreferences() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PreferencesInfo>({
    hourlyRate: 50,
    availability: [],
    coachingStyle: [],
    sessionTypes: [],
  });

  useEffect(() => {
    const saved = localStorage.getItem('coachProfilePreferences');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      availability: [...prev.availability, { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }]
    }));
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string | number) => {
    const updated = [...formData.availability];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, availability: updated }));
  };

  const removeTimeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };

  const toggleCoachingStyle = (style: string) => {
    setFormData(prev => ({
      ...prev,
      coachingStyle: prev.coachingStyle.includes(style)
        ? prev.coachingStyle.filter(s => s !== style)
        : [...prev.coachingStyle, style]
    }));
  };

  const toggleSessionType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      sessionTypes: prev.sessionTypes.includes(type)
        ? prev.sessionTypes.filter(t => t !== type)
        : [...prev.sessionTypes, type]
    }));
  };

  const handleNext = () => {
    localStorage.setItem('coachProfilePreferences', JSON.stringify(formData));
    navigate('/coach/profile-creation/security');
  };

  const handleBack = () => {
    localStorage.setItem('coachProfilePreferences', JSON.stringify(formData));
    navigate('/coach/profile-creation/skills');
  };

  const handleSaveAndExit = () => {
    localStorage.setItem('coachProfilePreferences', JSON.stringify(formData));
    navigate('/coach-dashboard');
  };

  const isValid = formData.hourlyRate > 0 && formData.availability.length > 0;

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
              <p className="mb-2 text-sm font-medium text-gray-400">Step 4 of 6</p>
              <div className="flex gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500/30"></div>
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500/30"></div>
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500/30"></div>
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500"></div>
                <div className="h-1.5 flex-1 rounded-full bg-gray-700"></div>
                <div className="h-1.5 flex-1 rounded-full bg-gray-700"></div>
              </div>
            </div>

            {/* Page Title */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white">Your Preferences</h1>
              <p className="mt-2 text-base text-gray-400">Set your rates, availability, and coaching style.</p>
            </div>

            {/* Form Card */}
            <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-6 sm:p-8">
              <form className="space-y-8">
                {/* Hourly Rate */}
                <div>
                  <label className="block pb-3 text-sm font-medium text-white">
                    Hourly Rate*
                  </label>
                  <div className="max-w-md mx-auto">
                    <div className="flex items-center justify-center mb-4">
                      <DollarSign className="w-12 h-12 text-yellow-500" />
                      <span className="text-5xl font-bold">{formData.hourlyRate}</span>
                      <span className="text-2xl text-gray-400 ml-2">/hour</span>
                    </div>
                    <input
                      type="range"
                      min="25"
                      max="500"
                      step="5"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>$25</span>
                      <span>$500</span>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg mt-4">
                      <p className="text-sm text-gray-300">
                        <strong>Tip:</strong> Set a competitive rate based on your experience. You can always adjust this later in your settings.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-white">
                      Availability* <span className="text-gray-400">(Add at least one time slot)</span>
                    </label>
                    <button
                      type="button"
                      onClick={addTimeSlot}
                      className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-yellow-500 border border-yellow-500 rounded-lg hover:bg-yellow-500/10 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Time Slot
                    </button>
                  </div>

                  {formData.availability.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-gray-700 rounded-lg">
                      <p className="text-sm text-gray-400">No availability set yet</p>
                      <p className="text-xs text-gray-500 mt-1">Add your available time slots</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.availability.map((slot, index) => (
                        <div key={index} className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-2">Day</label>
                              <select
                                value={slot.dayOfWeek}
                                onChange={(e) => updateTimeSlot(index, 'dayOfWeek', parseInt(e.target.value))}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                              >
                                {daysOfWeek.map((day, i) => (
                                  <option key={i} value={i}>{day}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-2">Start Time</label>
                              <input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-2">End Time</label>
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                              />
                            </div>
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() => removeTimeSlot(index)}
                                className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                              >
                                <X className="w-5 h-5 mx-auto" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Coaching Style */}
                <div>
                  <label className="block pb-3 text-sm font-medium text-white">
                    Coaching Style <span className="text-gray-400">(Optional)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {coachingStyleOptions.map(style => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => toggleCoachingStyle(style)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          formData.coachingStyle.includes(style)
                            ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500'
                            : 'bg-gray-700 text-gray-300 border border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Session Types */}
                <div>
                  <label className="block pb-3 text-sm font-medium text-white">
                    Session Types You Offer <span className="text-gray-400">(Optional)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sessionTypeOptions.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleSessionType(type)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          formData.sessionTypes.includes(type)
                            ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500'
                            : 'bg-gray-700 text-gray-300 border border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
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
                    className="flex items-center gap-2 px-6 py-3 text-base font-bold text-gray-900 bg-yellow-500 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next: Security & Consent
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
