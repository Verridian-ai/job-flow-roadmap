import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Star, Edit2, Trash2, Save, X } from 'lucide-react';

interface StarStory {
  _id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  skills: string[];
  _creationTime: number;
}

interface Props {
  story: StarStory;
}

export default function StarStoryCard({ story }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: story.title,
    situation: story.situation,
    task: story.task,
    action: story.action,
    result: story.result,
    skills: story.skills.join(', '),
  });

  const updateStory = useMutation(api.starStories.update);
  const deleteStory = useMutation(api.starStories.remove);

  const handleSave = async () => {
    await updateStory({
      id: story._id,
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this story?')) {
      await deleteStory({ id: story._id });
    }
  };

  if (isEditing) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Situation</label>
            <textarea
              value={formData.situation}
              onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Task</label>
            <textarea
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Action</label>
            <textarea
              value={formData.action}
              onChange={(e) => setFormData({ ...formData, action: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Result</label>
            <textarea
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Skills (comma-separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition inline-flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <Star className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
            <div className="flex flex-wrap gap-2">
              {story.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-yellow-500 transition"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-500 transition"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-yellow-500 mb-1">Situation</h4>
          <p className="text-gray-300">{story.situation}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-yellow-500 mb-1">Task</h4>
          <p className="text-gray-300">{story.task}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-yellow-500 mb-1">Action</h4>
          <p className="text-gray-300">{story.action}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-yellow-500 mb-1">Result</h4>
          <p className="text-gray-300">{story.result}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          Created {new Date(story._creationTime).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
