import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CoachCard from '../components/CoachCard';
import { Search, Filter, SlidersHorizontal, Grid, List, Map, Star, Award, TrendingUp } from 'lucide-react';

export default function CoachDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<'rating' | 'price_low' | 'price_high' | 'experience'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFeatured, setShowFeatured] = useState(true);

  const coaches = useQuery(api.coaches.list);

  const specialties = ['all', 'resume', 'interview', 'career', 'negotiation', 'technical', 'leadership'];
  const industries = ['all', 'tech', 'finance', 'healthcare', 'consulting', 'marketing', 'sales'];

  let filteredCoaches = coaches?.filter(coach => {
    const matchesSearch =
      coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSpecialty =
      selectedSpecialty === 'all' ||
      coach.specialties.includes(selectedSpecialty);

    const matchesIndustry =
      selectedIndustry === 'all' ||
      coach.industries?.includes(selectedIndustry);

    const matchesRating = coach.rating >= minRating;

    return matchesSearch && matchesSpecialty && matchesIndustry && matchesRating;
  });

  // Sort coaches
  if (filteredCoaches) {
    filteredCoaches = [...filteredCoaches].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price_low':
          return a.hourlyRate - b.hourlyRate;
        case 'price_high':
          return b.hourlyRate - a.hourlyRate;
        case 'experience':
          return (b.yearsExperience || 0) - (a.yearsExperience || 0);
        default:
          return 0;
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Find a Coach</h1>
                  <p className="text-gray-400">
                    Connect with verified career coaches to accelerate your job search
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition ${
                      viewMode === 'grid'
                        ? 'bg-yellow-500 text-gray-900'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition ${
                      viewMode === 'list'
                        ? 'bg-yellow-500 text-gray-900'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`p-2 rounded-lg transition ${
                      viewMode === 'map'
                        ? 'bg-yellow-500 text-gray-900'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <Map className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Coaches Banner */}
            {showFeatured && filteredCoaches && filteredCoaches.length > 0 && (
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-6 mb-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      <Award className="w-6 h-6 text-yellow-500" />
                      Featured Coaches
                    </h2>
                    <p className="text-gray-400">Top-rated coaches recommended for you</p>
                  </div>
                  <button
                    onClick={() => setShowFeatured(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {filteredCoaches.slice(0, 3).map((coach) => (
                    <div key={coach._id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-yellow-500 transition">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-900">{coach.name[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{coach.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold">{coach.rating.toFixed(1)}</span>
                            <span className="text-xs text-gray-400">({coach.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">{coach.bio}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-yellow-500">${coach.hourlyRate}/hr</span>
                        <button className="px-3 py-1 bg-yellow-500 text-gray-900 rounded text-sm font-semibold hover:bg-yellow-400 transition">
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {/* Search */}
                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by name, specialty, or keyword..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                    />
                  </div>
                </div>

                {/* Specialty Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Specialty</label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white appearance-none"
                    >
                      {specialties.map(specialty => (
                        <option key={specialty} value={specialty}>
                          {specialty === 'all' ? 'All Specialties' : specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Industry Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Industry</label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white appearance-none"
                    >
                      {industries.map(industry => (
                        <option key={industry} value={industry}>
                          {industry === 'all' ? 'All Industries' : industry.charAt(0).toUpperCase() + industry.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium mb-2">Sort By</label>
                  <div className="relative">
                    <SlidersHorizontal className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white appearance-none"
                    >
                      <option value="rating">Highest Rating</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="experience">Most Experience</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Minimum Rating: {minRating === 0 ? 'Any' : `${minRating}+ stars`}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Results Count */}
            {filteredCoaches && (
              <p className="text-gray-400 mb-6">
                {filteredCoaches.length} {filteredCoaches.length === 1 ? 'coach' : 'coaches'} found
              </p>
            )}

            {/* Coaches Display */}
            {filteredCoaches && filteredCoaches.length > 0 ? (
              <>
                {viewMode === 'grid' && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCoaches.map((coach) => (
                      <CoachCard key={coach._id} coach={coach} />
                    ))}
                  </div>
                )}

                {viewMode === 'list' && (
                  <div className="space-y-4">
                    {filteredCoaches.map((coach) => (
                      <div key={coach._id} className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-yellow-500 transition">
                        <div className="flex items-start gap-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl font-bold text-gray-900">{coach.name[0]}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold mb-1">{coach.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="font-semibold">{coach.rating.toFixed(1)}</span>
                                    <span>({coach.reviewCount} reviews)</span>
                                  </div>
                                  {coach.yearsExperience && (
                                    <>
                                      <span>•</span>
                                      <span>{coach.yearsExperience} years experience</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-yellow-500">${coach.hourlyRate}</p>
                                <p className="text-sm text-gray-400">per hour</p>
                              </div>
                            </div>
                            <p className="text-gray-300 mb-4 line-clamp-2">{coach.bio}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-2">
                                {coach.specialties.slice(0, 3).map((specialty) => (
                                  <span
                                    key={specialty}
                                    className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs"
                                  >
                                    {specialty}
                                  </span>
                                ))}
                                {coach.specialties.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded-full text-xs">
                                    +{coach.specialties.length - 3} more
                                  </span>
                                )}
                              </div>
                              <button className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition">
                                View Profile
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {viewMode === 'map' && (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 h-96">
                      <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Map className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-400">Map view coming soon</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Interactive map to find coaches near you
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {filteredCoaches.map((coach) => (
                        <div key={coach._id} className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-yellow-500 transition cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-lg font-bold text-gray-900">{coach.name[0]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold mb-1">{coach.name}</h3>
                              <div className="flex items-center gap-2 text-sm mb-2">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-semibold">{coach.rating.toFixed(1)}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-yellow-500 font-semibold">${coach.hourlyRate}/hr</span>
                              </div>
                              <p className="text-sm text-gray-400 line-clamp-2">{coach.bio}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-lg">No coaches found.</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
