import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  Star,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  ArrowLeft,
  Award,
  BookOpen,
  Building2,
  Clock,
  CheckCircle,
  User
} from 'lucide-react';
import { useState } from 'react';

export default function CoachProfile() {
  const { coachId } = useParams<{ coachId: string }>();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'about' | 'reviews' | 'portfolio'>('about');

  const coachData = useQuery(api.coaches.getWithUser, { id: coachId as Id<"coaches"> });
  const reviews = useQuery(api.reviews.listByCoach, { coachId: coachId as Id<"coaches"> });

  const handleBookSession = () => {
    navigate(`/booking/${coachId}`);
  };

  if (!coachData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-5xl mx-auto text-center py-16">
              <p className="text-gray-400">Loading coach profile...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Helper to render star ratings
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-500 fill-yellow-500'
            : i < rating
            ? 'text-yellow-500 fill-yellow-500/50'
            : 'text-gray-600'
        }`}
      />
    ));
  };

  // Helper to format day of week
  const formatDayOfWeek = (day: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  };

  const { coach, user } = coachData;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
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
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center text-4xl font-bold text-gray-900 flex-shrink-0">
                  {user.name.charAt(0)}
                </div>

                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div className="mb-4 md:mb-0">
                      <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                      <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-3">
                        {user.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {user.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          {renderStars(coach.rating)}
                          <span className="ml-1">{coach.rating.toFixed(1)}</span>
                          <span className="text-gray-500">({coach.reviewCount} reviews)</span>
                        </span>
                      </div>

                      {/* Verification Badge */}
                      {coach.verificationStatus === 'approved' && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Verified Coach
                        </div>
                      )}
                    </div>

                    <div className="text-left md:text-right">
                      <div className="flex items-center gap-1 text-3xl font-bold text-yellow-500">
                        <DollarSign className="w-7 h-7" />
                        {coach.hourlyRate}
                      </div>
                      <p className="text-sm text-gray-400">per hour</p>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {coach.specialty.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Industries */}
                  {coach.industries.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-400 mb-2">Industries</h3>
                      <div className="flex flex-wrap gap-2">
                        {coach.industries.map((industry) => (
                          <span
                            key={industry}
                            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                          >
                            <Building2 className="w-3 h-3 inline mr-1" />
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleBookSession}
                    className="w-full md:w-auto px-8 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    Book a Session
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-700">
              <button
                onClick={() => setSelectedTab('about')}
                className={`px-4 py-2 font-medium transition ${
                  selectedTab === 'about'
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                About
              </button>
              <button
                onClick={() => setSelectedTab('reviews')}
                className={`px-4 py-2 font-medium transition ${
                  selectedTab === 'reviews'
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Reviews ({coach.reviewCount})
              </button>
              {coach.portfolio.length > 0 && (
                <button
                  onClick={() => setSelectedTab('portfolio')}
                  className={`px-4 py-2 font-medium transition ${
                    selectedTab === 'portfolio'
                      ? 'text-yellow-500 border-b-2 border-yellow-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Portfolio
                </button>
              )}
            </div>

            {/* Tab Content */}
            {selectedTab === 'about' && (
              <div className="space-y-6">
                {/* About/Bio */}
                {user.bio && (
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-yellow-500" />
                      About
                    </h2>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{user.bio}</p>
                  </div>
                )}

                {/* Experience */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-yellow-500" />
                    Experience
                  </h2>
                  <p className="text-gray-300 leading-relaxed">{coach.experience}</p>
                </div>

                {/* Certifications */}
                {coach.certifications.length > 0 && (
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      Certifications
                    </h2>
                    <div className="space-y-4">
                      {coach.certifications.map((cert, index) => (
                        <div key={index} className="border-l-2 border-yellow-500 pl-4">
                          <h3 className="font-semibold text-white">{cert.name}</h3>
                          <p className="text-gray-400 text-sm">{cert.issuer}</p>
                          <p className="text-gray-500 text-sm">{cert.date}</p>
                          {cert.url && (
                            <a
                              href={cert.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-yellow-500 hover:text-yellow-400 text-sm inline-flex items-center gap-1 mt-1"
                            >
                              View Certificate →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability */}
                {coach.availability.length > 0 && (
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      Availability
                    </h2>
                    <div className="space-y-3">
                      {coach.availability.map((slot, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
                          <span className="font-medium text-gray-300">
                            {formatDayOfWeek(slot.dayOfWeek)}
                          </span>
                          <span className="text-gray-400">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      All times are shown in your local timezone
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="space-y-4">
                {reviews && reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review._id} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-sm text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
                    <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No reviews yet</p>
                    <p className="text-gray-500 mt-2">Be the first to review this coach!</p>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'portfolio' && (
              <div className="space-y-4">
                {coach.portfolio.map((item, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-yellow-500" />
                      {item.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-3">{item.description}</p>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-500 hover:text-yellow-400 inline-flex items-center gap-1"
                      >
                        View Project →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
