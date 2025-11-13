import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Star, MapPin, Briefcase, DollarSign, Calendar, ArrowLeft } from 'lucide-react';

export default function CoachProfile() {
  const { coachId } = useParams<{ coachId: string }>();
  const coach = useQuery(api.coaches.getById, { id: coachId || '' });
  const reviews = useQuery(api.reviews.getByCoach, { coachId: coachId || '' });
  const requestSession = useMutation(api.sessions.request);

  const handleBookSession = async () => {
    if (!coachId) return;
    
    try {
      await requestSession({
        coachId,
        type: 'consultation',
        duration: 60,
      });
      alert('Session request sent! The coach will review and respond soon.');
    } catch (error) {
      console.error('Failed to request session:', error);
      alert('Failed to send session request. Please try again.');
    }
  };

  if (!coach) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto text-center py-16">
              <p className="text-gray-400">Loading coach profile...</p>
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
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
              to="/coaches"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Directory
            </Link>

            {/* Profile Header */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-6">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center text-3xl font-bold text-gray-900">
                  {coach.name.charAt(0)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{coach.name}</h1>
                      <div className="flex items-center gap-4 text-gray-400">
                        {coach.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {coach.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {coach.rating.toFixed(1)} ({coach.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-2xl font-bold text-yellow-500">
                        <DollarSign className="w-6 h-6" />
                        {coach.hourlyRate}
                      </div>
                      <p className="text-sm text-gray-400">per hour</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {coach.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={handleBookSession}
                    className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    Book a Session
                  </button>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-gray-300 leading-relaxed">{coach.bio}</p>
            </div>

            {/* Experience */}
            {coach.yearsExperience && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-yellow-500" />
                  Experience
                </h2>
                <p className="text-gray-300">
                  {coach.yearsExperience} years of professional coaching experience
                </p>
              </div>
            )}

            {/* Verification Status */}
            {coach.verified && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-2 text-green-500">
                  <Star className="w-5 h-5" />
                  <span className="font-semibold">Verified Coach</span>
                </div>
                <p className="text-gray-300 mt-2">
                  This coach has been verified through our marketplace and meets our quality standards.
                </p>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">Reviews ({coach.reviewCount})</h2>

              {reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold text-gray-900">
                          {review.userName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{review.userName}</h3>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-gray-300 text-sm">{review.comment}</p>
                          )}
                          <p className="text-gray-500 text-xs mt-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No reviews yet.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
