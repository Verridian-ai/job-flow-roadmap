import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { DollarSign, Clock, FileText, AlertCircle } from "lucide-react";

interface CreateTaskFormProps {
  onSuccess?: (taskId: Id<"verificationTasks">) => void;
  onCancel?: () => void;
}

export function CreateTaskForm({ onSuccess, onCancel }: CreateTaskFormProps) {
  const [resumeId, setResumeId] = useState<Id<"resumes"> | "">("");
  const [taskType, setTaskType] = useState<"resume_review_quick" | "resume_review_full" | "cover_letter_review">("resume_review_quick");
  const [urgency, setUrgency] = useState<"urgent" | "standard" | "flexible">("standard");
  const [suggestedPrice, setSuggestedPrice] = useState("50");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resumes = useQuery(api.resumes.list);
  const createTask = useMutation(api.marketplace.createTask);

  const getPriceRecommendation = () => {
    switch (taskType) {
      case "resume_review_quick":
        return { min: 25, max: 50, recommended: 35 };
      case "resume_review_full":
        return { min: 50, max: 150, recommended: 75 };
      case "cover_letter_review":
        return { min: 30, max: 75, recommended: 45 };
      default:
        return { min: 25, max: 150, recommended: 50 };
    }
  };

  const priceRec = getPriceRecommendation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!resumeId) {
        throw new Error("Please select a resume");
      }

      const taskId = await createTask({
        resumeId: resumeId as Id<"resumes">,
        taskType,
        urgency,
        suggestedPrice: parseFloat(suggestedPrice),
      });

      if (onSuccess) {
        onSuccess(taskId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Verification Task</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Resume Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Resume *
          </label>
          <select
            value={resumeId}
            onChange={(e) => setResumeId(e.target.value as any)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Choose a resume...</option>
            {resumes?.map((resume) => (
              <option key={resume._id} value={resume._id}>
                {resume.title}
              </option>
            ))}
          </select>
        </div>

        {/* Task Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline h-4 w-4 mr-1" />
            Task Type *
          </label>
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="taskType"
                value="resume_review_quick"
                checked={taskType === "resume_review_quick"}
                onChange={(e) => setTaskType(e.target.value as any)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Quick Review</p>
                <p className="text-sm text-gray-600">
                  Basic review of formatting, grammar, and ATS compatibility (30-45 min)
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="taskType"
                value="resume_review_full"
                checked={taskType === "resume_review_full"}
                onChange={(e) => setTaskType(e.target.value as any)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Full Review</p>
                <p className="text-sm text-gray-600">
                  Comprehensive review with detailed feedback and suggestions (1-2 hours)
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="taskType"
                value="cover_letter_review"
                checked={taskType === "cover_letter_review"}
                onChange={(e) => setTaskType(e.target.value as any)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Cover Letter Review</p>
                <p className="text-sm text-gray-600">
                  Review and optimize cover letter for specific job (45-60 min)
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="inline h-4 w-4 mr-1" />
            Urgency *
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setUrgency("flexible")}
              className={`p-4 border-2 rounded-lg text-center transition ${
                urgency === "flexible"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <p className="font-semibold text-gray-900">Flexible</p>
              <p className="text-sm text-gray-600">3-5 days</p>
            </button>

            <button
              type="button"
              onClick={() => setUrgency("standard")}
              className={`p-4 border-2 rounded-lg text-center transition ${
                urgency === "standard"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <p className="font-semibold text-gray-900">Standard</p>
              <p className="text-sm text-gray-600">1-2 days</p>
            </button>

            <button
              type="button"
              onClick={() => setUrgency("urgent")}
              className={`p-4 border-2 rounded-lg text-center transition ${
                urgency === "urgent"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <p className="font-semibold text-gray-900">Urgent</p>
              <p className="text-sm text-gray-600">24 hours</p>
            </button>
          </div>
        </div>

        {/* Suggested Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="inline h-4 w-4 mr-1" />
            Suggested Price *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              value={suggestedPrice}
              onChange={(e) => setSuggestedPrice(e.target.value)}
              min={priceRec.min}
              max={priceRec.max}
              step="5"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Recommended: ${priceRec.recommended} (Range: ${priceRec.min} - ${priceRec.max})
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">How It Works</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Post your task with a suggested price</li>
            <li>Coaches will bid on your task</li>
            <li>Review bids and select the best coach</li>
            <li>Payment is held in escrow until completion</li>
            <li>Receive your verified resume</li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating Task..." : "Post Task"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
