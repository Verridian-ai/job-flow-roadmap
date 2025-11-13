import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  Award,
  Target,
  TrendingUp,
  FileText,
  DollarSign,
  CalendarCheck,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Book,
  Calculator,
  Briefcase,
  Clock,
  User,
  Building,
  Star,
  ArrowUp,
  FileCheck,
  MessageSquare,
} from 'lucide-react';

interface PromotionData {
  // Screen 1: Current Situation
  currentRole: string;
  currentLevel: string;
  yearsInRole: string;
  department: string;
  currentSalary: string;
  recentAchievements: string;

  // Screen 2: Goals
  targetRole: string;
  targetLevel: string;
  targetSalary: string;
  timeline: string;
  motivations: string[];

  // Screen 3: Skills Gap
  requiredSkills: string[];
  currentSkillLevels: Record<string, number>;
  developmentNeeds: string[];

  // Screen 4: Action Plan
  milestones: Array<{ title: string; deadline: string; status: string }>;
  resources: string[];
  stakeholders: string[];

  // Screen 5: Negotiation Prep
  valueProposition: string;
  keyAccomplishments: string[];
  marketResearch: string;
  negotiationPoints: string[];

  // Screen 6: Follow-up
  checkInFrequency: string;
  progressMetrics: string[];
  reviewDate: string;
}

const initialData: PromotionData = {
  currentRole: '',
  currentLevel: '',
  yearsInRole: '',
  department: '',
  currentSalary: '',
  recentAchievements: '',
  targetRole: '',
  targetLevel: '',
  targetSalary: '',
  timeline: '',
  motivations: [],
  requiredSkills: [],
  currentSkillLevels: {},
  developmentNeeds: [],
  milestones: [],
  resources: [],
  stakeholders: [],
  valueProposition: '',
  keyAccomplishments: [],
  marketResearch: '',
  negotiationPoints: [],
  checkInFrequency: '',
  progressMetrics: [],
  reviewDate: '',
};

export default function PromotionCoaching() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<PromotionData>(initialData);
  const [newMilestone, setNewMilestone] = useState({ title: '', deadline: '', status: 'pending' });
  const [newSkill, setNewSkill] = useState('');
  const [newAccomplishment, setNewAccomplishment] = useState('');

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addMilestone = () => {
    if (newMilestone.title && newMilestone.deadline) {
      setData({
        ...data,
        milestones: [...data.milestones, newMilestone],
      });
      setNewMilestone({ title: '', deadline: '', status: 'pending' });
    }
  };

  const addSkill = () => {
    if (newSkill && !data.requiredSkills.includes(newSkill)) {
      setData({
        ...data,
        requiredSkills: [...data.requiredSkills, newSkill],
        currentSkillLevels: { ...data.currentSkillLevels, [newSkill]: 3 },
      });
      setNewSkill('');
    }
  };

  const addAccomplishment = () => {
    if (newAccomplishment) {
      setData({
        ...data,
        keyAccomplishments: [...data.keyAccomplishments, newAccomplishment],
      });
      setNewAccomplishment('');
    }
  };

  const updateSkillLevel = (skill: string, level: number) => {
    setData({
      ...data,
      currentSkillLevels: { ...data.currentSkillLevels, [skill]: level },
    });
  };

  const calculateSalaryIncrease = () => {
    const current = parseFloat(data.currentSalary.replace(/[^0-9.]/g, ''));
    const target = parseFloat(data.targetSalary.replace(/[^0-9.]/g, ''));
    if (current && target) {
      const increase = ((target - current) / current) * 100;
      return increase.toFixed(1);
    }
    return '0';
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {[1, 2, 3, 4, 5, 6].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                step < currentStep
                  ? 'bg-green-500 text-white'
                  : step === currentStep
                  ? 'bg-yellow-500 text-gray-900'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            {step < 6 && (
              <div
                className={`h-1 flex-1 mx-2 transition ${
                  step < currentStep ? 'bg-green-500' : 'bg-gray-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="bg-gray-800 rounded-full h-2">
        <div
          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-center text-gray-400 mt-2">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  );

  const renderScreen1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-yellow-500/20 rounded-lg">
          <User className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Current Situation Assessment</h2>
          <p className="text-gray-400">Tell us about your current position</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current Role
          </label>
          <input
            type="text"
            value={data.currentRole}
            onChange={(e) => setData({ ...data, currentRole: e.target.value })}
            placeholder="e.g., Senior Software Engineer"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current Level
          </label>
          <select
            value={data.currentLevel}
            onChange={(e) => setData({ ...data, currentLevel: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Select level</option>
            <option value="Entry">Entry Level</option>
            <option value="Mid">Mid Level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
            <option value="Principal">Principal</option>
            <option value="Director">Director</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Years in Role
          </label>
          <input
            type="number"
            value={data.yearsInRole}
            onChange={(e) => setData({ ...data, yearsInRole: e.target.value })}
            placeholder="e.g., 2.5"
            step="0.5"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Department
          </label>
          <input
            type="text"
            value={data.department}
            onChange={(e) => setData({ ...data, department: e.target.value })}
            placeholder="e.g., Engineering"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current Salary
          </label>
          <input
            type="text"
            value={data.currentSalary}
            onChange={(e) => setData({ ...data, currentSalary: e.target.value })}
            placeholder="e.g., $120,000"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Recent Key Achievements
        </label>
        <textarea
          value={data.recentAchievements}
          onChange={(e) => setData({ ...data, recentAchievements: e.target.value })}
          placeholder="Describe your most significant accomplishments in this role..."
          rows={4}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderScreen2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-yellow-500/20 rounded-lg">
          <Target className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Goal Setting & Target Position</h2>
          <p className="text-gray-400">Define your promotion goals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Target Role
          </label>
          <input
            type="text"
            value={data.targetRole}
            onChange={(e) => setData({ ...data, targetRole: e.target.value })}
            placeholder="e.g., Engineering Manager"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Target Level
          </label>
          <select
            value={data.targetLevel}
            onChange={(e) => setData({ ...data, targetLevel: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Select level</option>
            <option value="Mid">Mid Level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
            <option value="Principal">Principal</option>
            <option value="Director">Director</option>
            <option value="VP">VP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Target Salary
          </label>
          <input
            type="text"
            value={data.targetSalary}
            onChange={(e) => setData({ ...data, targetSalary: e.target.value })}
            placeholder="e.g., $160,000"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Timeline
          </label>
          <select
            value={data.timeline}
            onChange={(e) => setData({ ...data, timeline: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Select timeline</option>
            <option value="3-6 months">3-6 months</option>
            <option value="6-12 months">6-12 months</option>
            <option value="12-18 months">12-18 months</option>
            <option value="18-24 months">18-24 months</option>
          </select>
        </div>
      </div>

      {data.currentSalary && data.targetSalary && (
        <div className="bg-green-500/20 border border-green-500 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <Calculator className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-sm text-gray-400">Projected Salary Increase</p>
              <p className="text-2xl font-bold text-green-500">
                {calculateSalaryIncrease()}% increase
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          What motivates you to pursue this promotion?
        </label>
        <div className="space-y-2">
          {[
            'Career advancement',
            'Increased compensation',
            'Leadership opportunities',
            'Greater impact',
            'New challenges',
            'Team management',
          ].map((motivation) => (
            <label key={motivation} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.motivations.includes(motivation)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setData({ ...data, motivations: [...data.motivations, motivation] });
                  } else {
                    setData({
                      ...data,
                      motivations: data.motivations.filter((m) => m !== motivation),
                    });
                  }
                }}
                className="w-4 h-4 text-yellow-500 bg-gray-800 border-gray-700 rounded focus:ring-yellow-500"
              />
              <span className="text-gray-300">{motivation}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderScreen3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-yellow-500/20 rounded-lg">
          <TrendingUp className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Skills Gap Analysis</h2>
          <p className="text-gray-400">Identify skills needed for your target role</p>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Required Skills</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g., Team Leadership, Strategic Planning"
            className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          <button
            onClick={addSkill}
            className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            Add Skill
          </button>
        </div>
      </div>

      {data.requiredSkills.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Rate Your Current Skill Levels</h3>
          {data.requiredSkills.map((skill) => (
            <div key={skill} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">{skill}</span>
                <span className="text-yellow-500 font-semibold">
                  {data.currentSkillLevels[skill]}/5
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => updateSkillLevel(skill, level)}
                    className={`flex-1 py-2 rounded-lg font-semibold transition ${
                      data.currentSkillLevels[skill] >= level
                        ? 'bg-yellow-500 text-gray-900'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Key Development Needs
        </label>
        <textarea
          value={data.developmentNeeds.join('\n')}
          onChange={(e) => setData({ ...data, developmentNeeds: e.target.value.split('\n') })}
          placeholder="List specific areas where you need to develop (one per line)..."
          rows={4}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderScreen4 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-yellow-500/20 rounded-lg">
          <FileText className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Action Plan Creation</h2>
          <p className="text-gray-400">Build your roadmap to promotion</p>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Milestone</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            value={newMilestone.title}
            onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
            placeholder="Milestone title"
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          <input
            type="date"
            value={newMilestone.deadline}
            onChange={(e) => setNewMilestone({ ...newMilestone, deadline: e.target.value })}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={addMilestone}
          className="w-full px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
        >
          Add Milestone
        </button>
      </div>

      {data.milestones.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Your Milestones</h3>
          {data.milestones.map((milestone, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded">
                  <CheckCircle className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="font-medium">{milestone.title}</p>
                  <p className="text-sm text-gray-400">
                    Due: {new Date(milestone.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm">
                {milestone.status}
              </span>
            </div>
          ))}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Key Stakeholders
        </label>
        <textarea
          value={data.stakeholders.join('\n')}
          onChange={(e) => setData({ ...data, stakeholders: e.target.value.split('\n') })}
          placeholder="List people who can support your promotion (one per line)..."
          rows={3}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Resources Needed
        </label>
        <textarea
          value={data.resources.join('\n')}
          onChange={(e) => setData({ ...data, resources: e.target.value.split('\n') })}
          placeholder="List resources you need (training, mentorship, etc., one per line)..."
          rows={3}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderScreen5 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-yellow-500/20 rounded-lg">
          <DollarSign className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Negotiation Preparation</h2>
          <p className="text-gray-400">Prepare your case for promotion</p>
        </div>
      </div>

      <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Book className="w-6 h-6 text-blue-500 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-500 mb-2">Document Library</h3>
            <p className="text-sm text-gray-400 mb-3">
              Access templates, talking points, and case studies to strengthen your promotion case
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition text-sm">
                View Templates
              </button>
              <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm">
                Case Studies
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Your Value Proposition
        </label>
        <textarea
          value={data.valueProposition}
          onChange={(e) => setData({ ...data, valueProposition: e.target.value })}
          placeholder="Summarize the unique value you bring and why you deserve this promotion..."
          rows={4}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Key Accomplishments</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newAccomplishment}
            onChange={(e) => setNewAccomplishment(e.target.value)}
            placeholder="Add a key accomplishment with measurable results"
            className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          <button
            onClick={addAccomplishment}
            className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            Add
          </button>
        </div>
        {data.keyAccomplishments.length > 0 && (
          <ul className="space-y-2">
            {data.keyAccomplishments.map((accomplishment, index) => (
              <li key={index} className="flex items-start gap-2">
                <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                <span className="text-gray-300">{accomplishment}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Market Research & Salary Data
        </label>
        <textarea
          value={data.marketResearch}
          onChange={(e) => setData({ ...data, marketResearch: e.target.value })}
          placeholder="Include salary ranges for your target role in your market, industry trends, etc."
          rows={4}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Negotiation Points
        </label>
        <textarea
          value={data.negotiationPoints.join('\n')}
          onChange={(e) => setData({ ...data, negotiationPoints: e.target.value.split('\n') })}
          placeholder="List your key negotiation points (one per line)..."
          rows={4}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderScreen6 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-yellow-500/20 rounded-lg">
          <CalendarCheck className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Follow-up Tracking</h2>
          <p className="text-gray-400">Stay on track with regular check-ins</p>
        </div>
      </div>

      <div className="bg-green-500/20 border border-green-500 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h3 className="text-lg font-semibold text-green-500">Plan Complete!</h3>
        </div>
        <p className="text-gray-300">
          You've created a comprehensive promotion plan. Now it's time to execute and track your progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Check-in Frequency
          </label>
          <select
            value={data.checkInFrequency}
            onChange={(e) => setData({ ...data, checkInFrequency: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Select frequency</option>
            <option value="Weekly">Weekly</option>
            <option value="Bi-weekly">Bi-weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Next Review Date
          </label>
          <input
            type="date"
            value={data.reviewDate}
            onChange={(e) => setData({ ...data, reviewDate: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Progress Metrics
        </label>
        <textarea
          value={data.progressMetrics.join('\n')}
          onChange={(e) => setData({ ...data, progressMetrics: e.target.value.split('\n') })}
          placeholder="Define how you'll measure progress (one per line)..."
          rows={4}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Summary of Your Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-400">Target Role</p>
              <p className="font-medium">{data.targetRole || 'Not set'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-400">Timeline</p>
              <p className="font-medium">{data.timeline || 'Not set'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-400">Target Salary</p>
              <p className="font-medium">{data.targetSalary || 'Not set'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-400">Skills to Develop</p>
              <p className="font-medium">{data.requiredSkills.length} skills</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate('/sessions')}
          className="flex-1 px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center justify-center gap-2"
        >
          <CalendarCheck className="w-5 h-5" />
          Schedule Coaching Session
        </button>
        <button
          onClick={() => {
            alert('Your promotion plan has been saved!');
            navigate('/coach-dashboard');
          }}
          className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-400 transition flex items-center justify-center gap-2"
        >
          <FileCheck className="w-5 h-5" />
          Save & Complete
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Promotion Coaching</h1>
                  <p className="text-gray-400">Your structured path to career advancement</p>
                </div>
              </div>
              {renderStepIndicator()}
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
              {currentStep === 1 && renderScreen1()}
              {currentStep === 2 && renderScreen2()}
              {currentStep === 3 && renderScreen3()}
              {currentStep === 4 && renderScreen4()}
              {currentStep === 5 && renderScreen5()}
              {currentStep === 6 && renderScreen6()}

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-6 py-2 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentStep === totalSteps}
                  className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
