import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Lock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface FeatureGateProps {
  feature:
    | "starStories"
    | "resumes"
    | "jobApplications"
    | "atsScans"
    | "aiGenerations"
    | "coachingSessions"
    | "marketplaceTasks";
  currentCount: number;
  children: React.ReactNode;
  showUpgradePrompt?: boolean;
}

export function FeatureGate({
  feature,
  currentCount,
  children,
  showUpgradePrompt = true,
}: FeatureGateProps) {
  const featureAccess = useQuery(api.subscriptions.checkFeatureAccess, {
    feature,
    currentCount,
  });

  if (!featureAccess) {
    return <div className="animate-pulse bg-gray-100 h-32 rounded-lg"></div>;
  }

  if (featureAccess.hasAccess) {
    return <>{children}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  const getFeatureName = () => {
    const names: Record<typeof feature, string> = {
      starStories: "STAR Stories",
      resumes: "Resumes",
      jobApplications: "Job Applications",
      atsScans: "ATS Scans",
      aiGenerations: "AI Generations",
      coachingSessions: "Coaching Sessions",
      marketplaceTasks: "Marketplace Tasks",
    };
    return names[feature];
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-blue-100 p-4 rounded-full">
          <Lock className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">Limit Reached</h3>
      <p className="text-gray-600 mb-1">
        You've reached your limit of <strong>{featureAccess.limit}</strong> {getFeatureName()}.
      </p>
      <p className="text-gray-600 mb-6">
        Upgrade to Premium or Pro to unlock more {getFeatureName().toLowerCase()}.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/subscription"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <TrendingUp className="h-5 w-5" />
          View Plans
        </Link>
      </div>

      <div className="mt-6 pt-6 border-t border-blue-200">
        <p className="text-sm text-gray-600">
          Current usage: <strong>{featureAccess.currentCount}</strong> /{" "}
          <strong>{featureAccess.limit}</strong>
        </p>
      </div>
    </div>
  );
}

// Usage Counter Component
interface UsageCounterProps {
  feature:
    | "starStories"
    | "resumes"
    | "jobApplications"
    | "atsScans"
    | "aiGenerations"
    | "coachingSessions"
    | "marketplaceTasks";
  currentCount: number;
  showBar?: boolean;
}

export function UsageCounter({ feature, currentCount, showBar = true }: UsageCounterProps) {
  const featureAccess = useQuery(api.subscriptions.checkFeatureAccess, {
    feature,
    currentCount,
  });

  if (!featureAccess) {
    return null;
  }

  const isUnlimited = featureAccess.limit === -1;
  const percentage = isUnlimited ? 0 : (currentCount / featureAccess.limit) * 100;
  const isWarning = percentage >= 80 && percentage < 100;
  const isDanger = percentage >= 100;

  const getBarColor = () => {
    if (isDanger) return "bg-red-500";
    if (isWarning) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getTextColor = () => {
    if (isDanger) return "text-red-600";
    if (isWarning) return "text-yellow-600";
    return "text-blue-600";
  };

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between mb-1">
        <span className={`font-medium ${getTextColor()}`}>
          {isUnlimited ? (
            <>
              {currentCount} <span className="text-gray-500">(Unlimited)</span>
            </>
          ) : (
            <>
              {currentCount} / {featureAccess.limit}
            </>
          )}
        </span>
        {!isUnlimited && featureAccess.remaining > 0 && (
          <span className="text-gray-500 text-xs">{featureAccess.remaining} remaining</span>
        )}
      </div>

      {showBar && !isUnlimited && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getBarColor()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
