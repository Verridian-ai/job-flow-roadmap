import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CoachCard from '../components/CoachCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

export default function CoachDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<'rating' | 'price_low' | 'price_high' | 'experience'>('rating');

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
              <h1 className="text-3xl font-bold mb-2">Find a Coach</h1>
              <p className="text-gray-400">
                Connect with verified career coaches to accelerate your job search
              </p>
            </div>

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

            {/* Coaches Grid */}
            {filteredCoaches && filteredCoaches.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCoaches.map((coach) => (
                  <CoachCard key={coach._id} coach={coach} />
                ))}
              </div>
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
