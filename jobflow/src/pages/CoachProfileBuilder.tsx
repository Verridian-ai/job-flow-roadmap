import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  User,
  Briefcase,
  Award,
  BookOpen,
  Building2,
  DollarSign,
  Clock,
  Save,
  Plus,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

interface PortfolioItem {
  title: string;
  description: string;
  url?: string;
}

export default function CoachProfileBuilder() {
  const navigate = useNavigate();

  const user = useQuery(api.users.current);
  const coachProfile = useQuery(api.coaches.getByCurrentUser);
  const updateCoach = useMutation(api.coaches.update);
  const createCoach = useMutation(api.coaches.create);

  const [activeTab, setActiveTab] = useState<'profile' | 'availability' | 'pricing'>('profile');
  const [isSaving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Profile fields
  const [specialty, setSpecialty] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [industries, setIndustries] = useState<string[]>([]);
  const [newIndustry, setNewIndustry] = useState('');
  const [experience, setExperience] = useState('');
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  // Availability fields
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);

  // Pricing fields
  const [hourlyRate, setHourlyRate] = useState<number>(0);

  // Load existing data
  useEffect(() => {
    if (coachProfile) {
      setSpecialty(coachProfile.specialty || []);
      setIndustries(coachProfile.industries || []);
      setExperience(coachProfile.experience || '');
      setCertifications(coachProfile.certifications || []);
      setPortfolio(coachProfile.portfolio || []);
      setAvailability(coachProfile.availability || []);
      setHourlyRate(coachProfile.hourlyRate || 0);
    }
  }, [coachProfile]);

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !specialty.includes(newSpecialty.trim())) {
      setSpecialty([...specialty, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (item: string) => {
    setSpecialty(specialty.filter((s) => s !== item));
  };

  const handleAddIndustry = () => {
    if (newIndustry.trim() && !industries.includes(newIndustry.trim())) {
      setIndustries([...industries, newIndustry.trim()]);
      setNewIndustry('');
    }
  };

  const handleRemoveIndustry = (item: string) => {
    setIndustries(industries.filter((i) => i !== item));
  };

  const handleAddCertification = () => {
    setCertifications([
      ...certifications,
      { name: '', issuer: '', date: '', url: '' },
    ]);
  };

  const handleUpdateCertification = (index: number, field: keyof Certification, value: string) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };

  const handleRemoveCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleAddPortfolio = () => {
    setPortfolio([...portfolio, { title: '', description: '', url: '' }]);
  };

  const handleUpdatePortfolio = (index: number, field: keyof PortfolioItem, value: string) => {
    const updated = [...portfolio];
    updated[index] = { ...updated[index], [field]: value };
    setPortfolio(updated);
  };

  const handleRemovePortfolio = (index: number) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  const handleAddAvailability = () => {
    setAvailability([
      ...availability,
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
    ]);
  };

  const handleUpdateAvailability = (
    index: number,
    field: keyof AvailabilitySlot,
    value: string | number
  ) => {
    const updated = [...availability];
    updated[index] = { ...updated[index], [field]: value };
    setAvailability(updated);
  };

  const handleRemoveAvailability = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Filter out empty certifications and portfolio items
      const validCertifications = certifications.filter(
        (cert) => cert.name && cert.issuer && cert.date
      );
      const validPortfolio = portfolio.filter((item) => item.title && item.description);

      const profileData = {
        specialty,
        industries,
        experience,
        certifications: validCertifications,
        portfolio: validPortfolio,
        hourlyRate,
        availability,
      };

      if (coachProfile) {
        // Update existing profile
        await updateCoach({
          id: coachProfile._id,
          ...profileData,
        });
      } else {
        // Create new profile
        await createCoach(profileData);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const getDayName = (day: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-6xl mx-auto text-center py-16">
              <p className="text-gray-400">Loading...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (user.role !== 'coach') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-2xl mx-auto text-center py-16">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
              <p className="text-gray-400">
                This page is only accessible to users with coach role.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Coach Profile Builder</h1>
              <p className="text-gray-400">Manage your coaching profile and availability</p>
            </div>

            {/* Save Status Messages */}
            {saveSuccess && (
              <div className="mb-6 bg-green-500/20 border border-green-500 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-green-500 font-medium">Profile saved successfully!</p>
              </div>
            )}

            {saveError && (
              <div className="mb-6 bg-red-500/20 border border-red-500 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-500 font-medium">{saveError}</p>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-700">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === 'profile'
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <User className="w-5 h-5 inline mr-2" />
                Profile Info
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === 'availability'
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Clock className="w-5 h-5 inline mr-2" />
                Availability
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === 'pricing'
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-5 h-5 inline mr-2" />
                Pricing
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'profile' && (
                <>
                  {/* Specialties */}
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-yellow-500" />
                      Specialties
                    </h2>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSpecialty}
                          onChange={(e) => setNewSpecialty(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddSpecialty()}
                          placeholder="Add a specialty (e.g., Resume Writing)"
                          className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                        />
                        <button
                          onClick={handleAddSpecialty}
                          className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {specialty.map((item) => (
                          <span
                            key={item}
                            className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm font-medium flex items-center gap-2"
                          >
                            {item}
                            <button
                              onClick={() => handleRemoveSpecialty(item)}
                              className="hover:text-yellow-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Industries */}
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-yellow-500" />
                      Industries
                    </h2>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newIndustry}
                          onChange={(e) => setNewIndustry(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddIndustry()}
                          placeholder="Add an industry (e.g., Technology)"
                          className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                        />
                        <button
                          onClick={handleAddIndustry}
                          className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {industries.map((item) => (
                          <span
                            key={item}
                            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium flex items-center gap-2"
                          >
                            {item}
                            <button
                              onClick={() => handleRemoveIndustry(item)}
                              className="hover:text-blue-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h2 className="text-xl font-semibold mb-4">Experience</h2>
                    <textarea
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="Describe your professional coaching experience..."
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none"
                    />
                  </div>

                  {/* Certifications */}
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        Certifications
                      </h2>
                      <button
                        onClick={handleAddCertification}
                        className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition text-sm flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Certification
                      </button>
                    </div>
                    <div className="space-y-4">
                      {certifications.map((cert, index) => (
                        <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-3">
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleRemoveCertification(index)}
                              className="text-gray-400 hover:text-red-500 transition"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) =>
                              handleUpdateCertification(index, 'name', e.target.value)
                            }
                            placeholder="Certification Name"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          />
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) =>
                              handleUpdateCertification(index, 'issuer', e.target.value)
                            }
                            placeholder="Issuing Organization"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          />
                          <input
                            type="text"
                            value={cert.date}
                            onChange={(e) =>
                              handleUpdateCertification(index, 'date', e.target.value)
                            }
                            placeholder="Date (e.g., June 2024)"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          />
                          <input
                            type="url"
                            value={cert.url || ''}
                            onChange={(e) =>
                              handleUpdateCertification(index, 'url', e.target.value)
                            }
                            placeholder="Certificate URL (optional)"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          />
                        </div>
                      ))}
                      {certifications.length === 0 && (
                        <p className="text-gray-500 text-center py-8">
                          No certifications added yet
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Portfolio */}
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-yellow-500" />
                        Portfolio
                      </h2>
                      <button
                        onClick={handleAddPortfolio}
                        className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition text-sm flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Project
                      </button>
                    </div>
                    <div className="space-y-4">
                      {portfolio.map((item, index) => (
                        <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-3">
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleRemovePortfolio(index)}
                              className="text-gray-400 hover:text-red-500 transition"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdatePortfolio(index, 'title', e.target.value)}
                            placeholder="Project Title"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          />
                          <textarea
                            value={item.description}
                            onChange={(e) =>
                              handleUpdatePortfolio(index, 'description', e.target.value)
                            }
                            placeholder="Project Description"
                            rows={3}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none"
                          />
                          <input
                            type="url"
                            value={item.url || ''}
                            onChange={(e) => handleUpdatePortfolio(index, 'url', e.target.value)}
                            placeholder="Project URL (optional)"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                          />
                        </div>
                      ))}
                      {portfolio.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No portfolio items added yet</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'availability' && (
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      Weekly Availability
                    </h2>
                    <button
                      onClick={handleAddAvailability}
                      className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition text-sm flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Time Slot
                    </button>
                  </div>
                  <div className="space-y-4">
                    {availability.map((slot, index) => (
                      <div
                        key={index}
                        className="border border-gray-700 rounded-lg p-4 grid md:grid-cols-4 gap-4 items-center"
                      >
                        <select
                          value={slot.dayOfWeek}
                          onChange={(e) =>
                            handleUpdateAvailability(index, 'dayOfWeek', parseInt(e.target.value))
                          }
                          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                        >
                          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                            <option key={day} value={day}>
                              {getDayName(day)}
                            </option>
                          ))}
                        </select>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) =>
                            handleUpdateAvailability(index, 'startTime', e.target.value)
                          }
                          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                        />
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) =>
                            handleUpdateAvailability(index, 'endTime', e.target.value)
                          }
                          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                        />
                        <button
                          onClick={() => handleRemoveAvailability(index)}
                          className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {availability.length === 0 && (
                      <p className="text-gray-500 text-center py-8">
                        No availability slots added yet. Add time slots to let clients book sessions.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-yellow-500" />
                    Hourly Rate
                  </h2>
                  <div className="max-w-md">
                    <label className="block text-sm font-medium mb-2">
                      Set your hourly coaching rate
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                        $
                      </span>
                      <input
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="5"
                        className="w-full pl-8 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white text-lg"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        / hour
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      This is the base rate for your coaching sessions. Clients will see pricing
                      based on session duration.
                    </p>
                    {hourlyRate > 0 && (
                      <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                        <h3 className="font-semibold mb-3">Pricing Preview</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">30 minutes:</span>
                            <span className="font-medium">${(hourlyRate * 0.5).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">60 minutes:</span>
                            <span className="font-medium">${hourlyRate.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">90 minutes:</span>
                            <span className="font-medium">${(hourlyRate * 1.5).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
                <button
                  onClick={() => navigate('/coach-dashboard')}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                    isSaving
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
                  }`}
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
