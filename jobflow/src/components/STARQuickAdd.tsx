import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface STARQuickAddProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function STARQuickAdd({ isOpen, onClose, onSuccess }: STARQuickAddProps) {
  const [title, setTitle] = useState('');
  const [situation, setSituation] = useState('');
  const [task, setTask] = useState('');
  const [action, setAction] = useState('');
  const [result, setResult] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [category, setCategory] = useState('General');
  const [hasQuantifiableResults, setHasQuantifiableResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createStory = useMutation(api.starStories.create);

  if (!isOpen) return null;

  const addSkill = (skill: string) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      setSkills([...skills, skill.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSkillInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !situation || !task || !action || !result) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await createStory({
        title,
        situation,
        task,
        action,
        result,
        skills,
        category,
      });

      // Reset form
      setTitle('');
      setSituation('');
      setTask('');
      setAction('');
      setResult('');
      setSkills([]);
      setSkillInput('');
      setCategory('General');
      setHasQuantifiableResults(false);

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Failed to create story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl">
        {/* Toolbar */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
          <div />
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 md:p-12 max-h-[80vh] overflow-y-auto">
          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-white tracking-tight text-3xl font-bold leading-tight">Add a New STAR Story</h1>
            <p className="text-zinc-400 mt-2">Capture your career highlights quickly and efficiently.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Title */}
            <div>
              <label className="block text-white text-base font-medium pb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Led Q3 Product Launch"
                className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-zinc-700 bg-zinc-950 p-4 text-base placeholder:text-zinc-500 transition-colors"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-white text-base font-medium pb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-zinc-700 bg-zinc-950 p-4 text-base"
              >
                <option value="General">General</option>
                <option value="Leadership">Leadership</option>
                <option value="Technical">Technical</option>
                <option value="Problem Solving">Problem Solving</option>
                <option value="Communication">Communication</option>
                <option value="Project Management">Project Management</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Situation */}
              <div className="flex flex-col">
                <label className="text-white text-base font-medium pb-2">
                  Situation <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder="Describe the context and background."
                  className="flex-1 w-full resize-y rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-zinc-700 bg-zinc-950 min-h-36 placeholder:text-zinc-500 p-4 text-base transition-colors"
                  required
                />
              </div>

              {/* Task */}
              <div className="flex flex-col">
                <label className="text-white text-base font-medium pb-2">
                  Task <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="What was your specific role or goal?"
                  className="flex-1 w-full resize-y rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-zinc-700 bg-zinc-950 min-h-36 placeholder:text-zinc-500 p-4 text-base transition-colors"
                  required
                />
              </div>

              {/* Action */}
              <div className="flex flex-col">
                <label className="text-white text-base font-medium pb-2">
                  Action <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  placeholder="What specific steps did you take?"
                  className="flex-1 w-full resize-y rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-zinc-700 bg-zinc-950 min-h-36 placeholder:text-zinc-500 p-4 text-base transition-colors"
                  required
                />
              </div>

              {/* Result */}
              <div className="flex flex-col">
                <label className="text-white text-base font-medium pb-2">
                  Result <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  placeholder="What were the outcomes of your actions?"
                  className="flex-1 w-full resize-y rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-zinc-700 bg-zinc-950 min-h-36 placeholder:text-zinc-500 p-4 text-base transition-colors"
                  required
                />
              </div>
            </div>

            {/* Quantifiable Results Toggle */}
            <div className="flex items-center justify-between mt-2">
              <label className="text-white text-base font-medium">Quantifiable Results Included?</label>
              <button
                type="button"
                onClick={() => setHasQuantifiableResults(!hasQuantifiableResults)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                  hasQuantifiableResults ? 'bg-yellow-400' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    hasQuantifiableResults ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Skills Tag Input */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-base font-medium">Skills Involved (Optional)</label>
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950 p-2 focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-yellow-400 transition-colors">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-center gap-2 rounded-full bg-yellow-400/20 px-3 py-1 text-sm text-yellow-400">
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-yellow-400 hover:text-white"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleSkillInputKeyPress}
                  onBlur={() => addSkill(skillInput)}
                  placeholder="Add a skill..."
                  className="min-w-[100px] flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none p-1"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row-reverse items-center gap-4 mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-yellow-400 px-6 py-3 text-base font-bold text-zinc-900 hover:bg-yellow-300 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Story'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto text-center rounded-lg px-6 py-3 text-base font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
