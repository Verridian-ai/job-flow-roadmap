import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  User,
  Briefcase,
  DollarSign,
  Calendar,
  Palette,
  Eye,
  Save,
  Upload,
  X,
  Plus,
  CheckCircle2,
  Edit2
} from 'lucide-react';

type EditorSection = 'basics' | 'professional' | 'services' | 'availability' | 'branding' | 'review';

export default function CoachProfileEditor() {
  const coachProfile = useQuery(api.coaches.getCurrentCoach);
  const updateProfile = useMutation(api.coaches.update);

  const [activeSection, setActiveSection] = useState<EditorSection>('basics');
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Form state (initialized from existing profile)
  const [formData, setFormData] = useState({
    name: coachProfile?.name || '',
    title: coachProfile?.title || '',
    photo: coachProfile?.photo || '',
    bio: coachProfile?.bio || '',
    location: coachProfile?.location || '',
    yearsExperience: coachProfile?.yearsExperience || 0,
    education: coachProfile?.education || '',
    specialties: coachProfile?.specialties || [],
    industries: coachProfile?.industries || [],
    skills: coachProfile?.skills || [],
    hourlyRate: coachProfile?.hourlyRate || 75,
    sessionTypes: coachProfile?.sessionTypes || [],
    availability: coachProfile?.availability || [],
    certifications: coachProfile?.certifications || [],
    accentColor: coachProfile?.accentColor || '#EAB308',
    tagline: coachProfile?.tagline || '',
    videoIntroUrl: coachProfile?.videoIntroUrl || ''
  });

  const sections: EditorSection[] = ['basics', 'professional', 'services', 'availability', 'branding', 'review'];

  const sectionInfo: Record<EditorSection, { title: string; icon: any; description: string }> = {
    basics: {
      title: 'Basic Information',
      icon: User,
      description: 'Name, photo, location, and bio'
    },
    professional: {
      title: 'Professional Details',
      icon: Briefcase,
      description: 'Experience, education, and certifications'
    },
    services: {
      title: 'Services & Pricing',
      icon: DollarSign,
      description: 'Rates, specialties, and session types'
    },
    availability: {
      title: 'Availability',
      icon: Calendar,
      description: 'Set your coaching schedule'
    },
    branding: {
      title: 'Branding',
      icon: Palette,
      description: 'Colors, tagline, and video intro'
    },
    review: {
      title: 'Review & Publish',
      icon: Eye,
      description: 'Preview and save changes'
    }
  };

  const specialtyOptions = [
    'Resume Writing',
    'Interview Coaching',
    'Career Planning',
    'Salary Negotiation',
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

  const sessionTypeOptions = [
    'Resume Review',
    'Mock Interview',
    '1-on-1 Coaching',
    'Career Assessment',
    'Strategy Session',
    'Follow-up Session'
  ];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: string, item: string) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    if (currentArray.includes(item)) {
      updateField(field, currentArray.filter(i => i !== item));
    } else {
      updateField(field, [...currentArray, item]);
    }
  };

  const addAvailability = () => {
    updateField('availability', [
      ...formData.availability,
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }
    ]);
  };

  const updateAvailabilitySlot = (index: number, field: string, value: string | number) => {
    const updated = [...formData.availability];
    updated[index] = { ...updated[index], [field]: value };
    updateField('availability', updated);
  };

  const removeAvailability = (index: number) => {
    updateField('availability', formData.availability.filter((_, i) => i !== index));
  };

  const addCertification = () => {
    updateField('certifications', [
      ...formData.certifications,
      { name: '', issuer: '', date: '' }
    ]);
  };

  const updateCertification = (index: number, field: string, value: string) => {
    const updated = [...formData.certifications];
    updated[index] = { ...updated[index], [field]: value };
    updateField('certifications', updated);
  };

  const removeCertification = (index: number) => {
    updateField('certifications', formData.certifications.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        profileId: coachProfile?._id,
        updates: formData
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const SectionIcon = sectionInfo[activeSection].icon;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Edit Coach Profile</h1>
                <p className="text-gray-400">Update your profile to attract more clients</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition inline-flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? 'Hide' : 'Show'} Preview
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 inline-flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Section Navigation */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sticky top-4">
                  <h3 className="font-semibold mb-4 text-gray-400 text-sm uppercase tracking-wide">
                    Sections
                  </h3>
                  <div className="space-y-2">
                    {sections.map((section) => {
                      const Icon = sectionInfo[section].icon;
                      return (
                        <button
                          key={section}
                          onClick={() => setActiveSection(section)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition ${
                            activeSection === section
                              ? 'bg-yellow-500 text-gray-900'
                              : 'hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{sectionInfo[section].title}</p>
                              <p className={`text-xs truncate ${
                                activeSection === section ? 'text-gray-800' : 'text-gray-400'
                              }`}>
                                {sectionInfo[section].description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Live Preview Panel */}
                {showPreview && (
                  <div className="bg-gray-800 rounded-lg border border-yellow-500 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">Live Preview</h3>
                      <button
                        onClick={() => setShowPreview(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="bg-gray-700 p-6 rounded-lg">
                      <div className="flex items-start gap-4 mb-4">
                        {formData.photo ? (
                          <img
                            src={formData.photo}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center">
                            <User className="w-10 h-10 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold">{formData.name || 'Your Name'}</h3>
                          <p className="text-lg text-gray-300">{formData.title || 'Your Title'}</p>
                          <p className="text-gray-400">{formData.location || 'Your Location'}</p>
                          {formData.tagline && (
                            <p className="text-sm italic text-yellow-500 mt-2">{formData.tagline}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold" style={{ color: formData.accentColor }}>
                            ${formData.hourlyRate}
                          </p>
                          <p className="text-sm text-gray-400">per hour</p>
                        </div>
                      </div>
                      <p className="text-gray-300">{formData.bio || 'Your bio will appear here...'}</p>
                    </div>
                  </div>
                )}

                {/* Editor Content */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <SectionIcon className="w-8 h-8 text-yellow-500" />
                    <div>
                      <h2 className="text-2xl font-bold">{sectionInfo[activeSection].title}</h2>
                      <p className="text-gray-400 text-sm">{sectionInfo[activeSection].description}</p>
                    </div>
                  </div>

                  {/* Basics Section */}
                  {activeSection === 'basics' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Profile Photo</label>
                        <div className="flex items-center gap-4">
                          {formData.photo ? (
                            <img
                              src={formData.photo}
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
                            Change Photo
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => updateField('name', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Professional Title</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => updateField('title', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Location</label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => updateField('location', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Professional Bio</label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => updateField('bio', e.target.value)}
                          rows={6}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none"
                        />
                        <p className="text-sm text-gray-400 mt-2">
                          {formData.bio.length} characters
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Professional Section */}
                  {activeSection === 'professional' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Years of Experience</label>
                        <input
                          type="number"
                          value={formData.yearsExperience}
                          onChange={(e) => updateField('yearsExperience', parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Education & Credentials</label>
                        <textarea
                          value={formData.education}
                          onChange={(e) => updateField('education', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-3">Professional Certifications</label>
                        <div className="space-y-3 mb-4">
                          {formData.certifications.map((cert, index) => (
                            <div key={index} className="bg-gray-700 p-4 rounded-lg">
                              <div className="grid md:grid-cols-2 gap-3 mb-3">
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
                    </div>
                  )}

                  {/* Services Section */}
                  {activeSection === 'services' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-4">
                          Hourly Rate: ${formData.hourlyRate}/hour
                        </label>
                        <input
                          type="range"
                          min="25"
                          max="500"
                          step="5"
                          value={formData.hourlyRate}
                          onChange={(e) => updateField('hourlyRate', parseInt(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-400 mt-2">
                          <span>$25</span>
                          <span>$500</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-3">Coaching Specialties</label>
                        <div className="grid md:grid-cols-2 gap-3">
                          {specialtyOptions.map(spec => (
                            <button
                              key={spec}
                              onClick={() => toggleArrayItem('specialties', spec)}
                              className={`p-3 rounded-lg border text-left transition ${
                                formData.specialties.includes(spec)
                                  ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500'
                                  : 'border-gray-600 hover:border-gray-500'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{spec}</span>
                                {formData.specialties.includes(spec) && (
                                  <CheckCircle2 className="w-5 h-5" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-3">Industries</label>
                        <div className="grid md:grid-cols-3 gap-3">
                          {industryOptions.map(ind => (
                            <button
                              key={ind}
                              onClick={() => toggleArrayItem('industries', ind)}
                              className={`p-3 rounded-lg border text-left transition ${
                                formData.industries.includes(ind)
                                  ? 'border-blue-500 bg-blue-500/20 text-blue-500'
                                  : 'border-gray-600 hover:border-gray-500'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{ind}</span>
                                {formData.industries.includes(ind) && (
                                  <CheckCircle2 className="w-5 h-5" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-3">Session Types</label>
                        <div className="grid md:grid-cols-2 gap-3">
                          {sessionTypeOptions.map(type => (
                            <button
                              key={type}
                              onClick={() => toggleArrayItem('sessionTypes', type)}
                              className={`p-3 rounded-lg border text-left transition ${
                                formData.sessionTypes.includes(type)
                                  ? 'border-purple-500 bg-purple-500/20 text-purple-500'
                                  : 'border-gray-600 hover:border-gray-500'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{type}</span>
                                {formData.sessionTypes.includes(type) && (
                                  <CheckCircle2 className="w-5 h-5" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Availability Section */}
                  {activeSection === 'availability' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-3">Weekly Availability</label>
                        <div className="space-y-3 mb-4">
                          {formData.availability.map((slot, index) => (
                            <div key={index} className="bg-gray-700 p-4 rounded-lg">
                              <div className="grid md:grid-cols-4 gap-4">
                                <div>
                                  <label className="block text-xs font-medium mb-2">Day</label>
                                  <select
                                    value={slot.dayOfWeek}
                                    onChange={(e) => updateAvailabilitySlot(index, 'dayOfWeek', parseInt(e.target.value))}
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
                                    onChange={(e) => updateAvailabilitySlot(index, 'startTime', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium mb-2">End Time</label>
                                  <input
                                    type="time"
                                    value={slot.endTime}
                                    onChange={(e) => updateAvailabilitySlot(index, 'endTime', e.target.value)}
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
                  )}

                  {/* Branding Section */}
                  {activeSection === 'branding' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Accent Color</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="color"
                            value={formData.accentColor}
                            onChange={(e) => updateField('accentColor', e.target.value)}
                            className="w-20 h-12 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData.accentColor}
                            onChange={(e) => updateField('accentColor', e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Tagline</label>
                        <input
                          type="text"
                          value={formData.tagline}
                          onChange={(e) => updateField('tagline', e.target.value)}
                          placeholder="A catchy one-liner about your coaching"
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Video Introduction URL</label>
                        <input
                          type="url"
                          value={formData.videoIntroUrl}
                          onChange={(e) => updateField('videoIntroUrl', e.target.value)}
                          placeholder="https://youtube.com/..."
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                        />
                        <p className="text-sm text-gray-400 mt-2">
                          A short video introducing yourself can help build trust with potential clients
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Review Section */}
                  {activeSection === 'review' && (
                    <div className="space-y-6">
                      <div className="bg-gray-700 p-6 rounded-lg">
                        <div className="flex items-start gap-4 mb-4">
                          {formData.photo ? (
                            <img
                              src={formData.photo}
                              alt="Profile"
                              className="w-20 h-20 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center">
                              <User className="w-10 h-10 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold">{formData.name}</h3>
                            <p className="text-lg text-gray-300">{formData.title}</p>
                            <p className="text-gray-400">{formData.location}</p>
                            {formData.tagline && (
                              <p className="text-sm italic mt-2" style={{ color: formData.accentColor }}>
                                {formData.tagline}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold" style={{ color: formData.accentColor }}>
                              ${formData.hourlyRate}
                            </p>
                            <p className="text-sm text-gray-400">per hour</p>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4">{formData.bio}</p>

                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-400 mb-2">Specialties</p>
                            <div className="flex flex-wrap gap-2">
                              {formData.specialties.map(spec => (
                                <span
                                  key={spec}
                                  className="px-3 py-1 rounded-full text-sm"
                                  style={{ backgroundColor: `${formData.accentColor}20`, color: formData.accentColor }}
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-gray-400 mb-2">Industries</p>
                            <div className="flex flex-wrap gap-2">
                              {formData.industries.map(ind => (
                                <span key={ind} className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm">
                                  {ind}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-green-500">Profile Complete</p>
                            <p className="text-sm text-gray-300 mt-1">
                              Your profile looks great! Click "Save Changes" to publish your updates.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Navigation */}
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={() => {
                      const currentIndex = sections.indexOf(activeSection);
                      if (currentIndex > 0) {
                        setActiveSection(sections[currentIndex - 1]);
                      }
                    }}
                    disabled={sections.indexOf(activeSection) === 0}
                    className="px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous Section
                  </button>
                  <button
                    onClick={() => {
                      const currentIndex = sections.indexOf(activeSection);
                      if (currentIndex < sections.length - 1) {
                        setActiveSection(sections[currentIndex + 1]);
                      }
                    }}
                    disabled={sections.indexOf(activeSection) === sections.length - 1}
                    className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Section
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
