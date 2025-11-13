import { Link } from 'react-router-dom';
import { Star, MapPin, DollarSign, Briefcase } from 'lucide-react';

interface Coach {
  _id: string;
  name: string;
  bio: string;
  specialties: string[];
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  location?: string;
  yearsExperience?: number;
}

interface Props {
  coach: Coach;
}

export default function CoachCard({ coach }: Props) {
  return (
    <Link
      to={`/coaches/${coach._id}`}
      className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-yellow-500 transition block"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-2xl font-bold text-gray-900">
          {coach.name.charAt(0)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {coach.name}
                {coach.verified && (
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                )}
              </h3>
              {coach.location && (
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {coach.location}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{coach.rating.toFixed(1)}</span>
              <span>({coach.reviewCount})</span>
            </div>
            {coach.yearsExperience && (
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                <span>{coach.yearsExperience} years</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-4 line-clamp-3">
        {coach.bio}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {coach.specialties.slice(0, 3).map((specialty) => (
          <span
            key={specialty}
            className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-full"
          >
            {specialty}
          </span>
        ))}
        {coach.specialties.length > 3 && (
          <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded-full">
            +{coach.specialties.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center gap-1 text-yellow-500 font-semibold">
          <DollarSign className="w-5 h-5" />
          <span>{coach.hourlyRate}/hr</span>
        </div>
        <span className="text-sm text-gray-400">View Profile →</span>
      </div>
    </Link>
  );
}
