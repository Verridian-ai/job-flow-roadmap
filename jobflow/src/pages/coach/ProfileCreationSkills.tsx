import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Plus, X, Upload } from 'lucide-react';

interface Certification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

interface SkillsInfo {
  certifications: Certification[];
  skills: string[];
}

const skillSuggestions = [
  'Career Counseling',
  'Resume Optimization',
  'Interview Preparation',
  'Salary Negotiation',
  'LinkedIn Optimization',
  'Personal Branding',
  'Job Search Strategy',
  'Networking',
  'Career Transition',
  'Executive Presence',
  'Communication Skills',
  'Conflict Resolution'
];

export default function ProfileCreationSkills() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SkillsInfo>({
    certifications: [],
    skills: [],
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('coachProfileSkills');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { name: '', issuer: '', date: '' }]
    }));
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const updated = [...formData.certifications];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, certifications: updated }));
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleNext = () => {
    localStorage.setItem('coachProfileSkills', JSON.stringify(formData));
    navigate('/coach/profile-creation/preferences');
  };

  const handleBack = () => {
    localStorage.setItem('coachProfileSkills', JSON.stringify(formData));
    navigate('/coach/profile-creation/experience');
  };

  const handleSaveAndExit = () => {
    localStorage.setItem('coachProfileSkills', JSON.stringify(formData));
    navigate('/coach-dashboard');
  };

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
              <p className="mb-2 text-sm font-medium text-gray-400">Step 3 of 6</p>
              <div className="flex gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500/30"></div>
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500/30"></div>
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500"></div>
                <div className="h-1.5 flex-1 rounded-full bg-gray-700"></div>
                <div className="h-1.5 flex-1 rounded-full bg-gray-700"></div>
                <div className="h-1.5 flex-1 rounded-full bg-gray-700"></div>
              </div>
            </div>

            {/* Page Title */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white">Skills & Certifications</h1>
              <p className="mt-2 text-base text-gray-400">Showcase your credentials and areas of expertise.</p>
            </div>

            {/* Form Card */}
            <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-6 sm:p-8">
              <form className="space-y-8">
                {/* Skills */}
                <div>
                  <label className="block pb-3 text-sm font-medium text-white">
                    Your Skills
                  </label>

                  {/* Selected Skills */}
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.skills.map(skill => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:text-yellow-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Add Custom Skill */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(newSkill))}
                      placeholder="Add a skill..."
                      className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => addSkill(newSkill)}
                      className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      Add
                    </button>
                  </div>

                  {/* Skill Suggestions */}
                  <div className="flex flex-wrap gap-2">
                    {skillSuggestions
                      .filter(skill => !formData.skills.includes(skill))
                      .map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="px-3 py-1 text-sm border border-gray-700 rounded-full text-gray-400 hover:border-yellow-500 hover:text-yellow-500 transition-colors"
                        >
                          + {skill}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-white">
                      Certifications <span className="text-gray-400">(Optional)</span>
                    </label>
                    <button
                      type="button"
                      onClick={addCertification}
                      className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-yellow-500 border border-yellow-500 rounded-lg hover:bg-yellow-500/10 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Certification
                    </button>
                  </div>

                  {formData.certifications.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-gray-700 rounded-lg">
                      <Upload className="w-12 h-12 mx-auto text-gray-600 mb-2" />
                      <p className="text-sm text-gray-400">No certifications added yet</p>
                      <p className="text-xs text-gray-500 mt-1">Add certifications to boost your credibility</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.certifications.map((cert, index) => (
                        <div key={index} className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-2">
                                Certification Name*
                              </label>
                              <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => updateCertification(index, 'name', e.target.value)}
                                placeholder="e.g., Certified Career Coach"
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-2">
                                Issuer*
                              </label>
                              <input
                                type="text"
                                value={cert.issuer}
                                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                                placeholder="e.g., ICF"
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-2">
                                Date Issued*
                              </label>
                              <input
                                type="date"
                                value={cert.date}
                                onChange={(e) => updateCertification(index, 'date', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-2">
                                Credential URL
                              </label>
                              <input
                                type="url"
                                value={cert.url || ''}
                                onChange={(e) => updateCertification(index, 'url', e.target.value)}
                                placeholder="https://..."
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCertification(index)}
                            className="text-sm text-red-400 hover:text-red-300 transition-colors"
                          >
                            Remove Certification
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                    className="flex items-center gap-2 px-6 py-3 text-base font-bold text-gray-900 bg-yellow-500 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Next: Preferences
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
