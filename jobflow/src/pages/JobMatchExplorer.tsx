import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  Heart,
  X,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Star,
  TrendingUp,
  Award,
} from 'lucide-react';

interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  matchScore: number;
  skills: string[];
  industry: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  postedDate: string;
  companyLogo?: string;
  jobUrl: string;
}

// Mock data for demonstration
const MOCK_JOBS: JobMatch[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA (Remote)',
    salary: '$140k - $180k',
    description: 'We are looking for an experienced Frontend Developer to join our growing team. You will work on building scalable web applications using modern technologies.',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'State management (Redux/Zustand)', 'RESTful APIs'],
    benefits: ['Health Insurance', 'Stock Options', '401k Match', 'Unlimited PTO', 'Remote Work'],
    matchScore: 95,
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    industry: 'Technology',
    jobType: 'Full-time',
    postedDate: '2 days ago',
    jobUrl: 'https://example.com/job1',
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    salary: '$120k - $160k',
    description: 'Join our innovative startup as a Full Stack Engineer. Build features end-to-end and shape our product direction.',
    requirements: ['React & Node.js experience', 'Database design', 'AWS/GCP knowledge', 'Agile methodology'],
    benefits: ['Equity Package', 'Health & Dental', 'Gym Membership', 'Learning Budget'],
    matchScore: 88,
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    industry: 'Fintech',
    jobType: 'Full-time',
    postedDate: '1 week ago',
    jobUrl: 'https://example.com/job2',
  },
  {
    id: '3',
    title: 'React Developer',
    company: 'Digital Agency Co.',
    location: 'Remote',
    salary: '$100k - $130k',
    description: 'Work with top-tier clients building beautiful, responsive web applications. Great work-life balance.',
    requirements: ['3+ years React', 'Responsive design', 'CSS frameworks', 'Git workflow'],
    benefits: ['Remote First', 'Flexible Hours', 'Health Insurance', 'Annual Bonus'],
    matchScore: 82,
    skills: ['React', 'CSS', 'JavaScript', 'Figma'],
    industry: 'Marketing',
    jobType: 'Remote',
    postedDate: '3 days ago',
    jobUrl: 'https://example.com/job3',
  },
  {
    id: '4',
    title: 'Software Engineer II',
    company: 'Enterprise Solutions',
    location: 'Boston, MA',
    salary: '$110k - $145k',
    description: 'Help build enterprise software solutions for Fortune 500 companies. Stable, established company.',
    requirements: ['React experience', 'Java backend', 'Microservices', 'Docker/Kubernetes'],
    benefits: ['Great Benefits', 'Pension Plan', 'Training Budget', '4 weeks PTO'],
    matchScore: 78,
    skills: ['React', 'Java', 'Spring Boot', 'Docker'],
    industry: 'Enterprise Software',
    jobType: 'Full-time',
    postedDate: '5 days ago',
    jobUrl: 'https://example.com/job4',
  },
];

export default function JobMatchExplorer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    minMatchScore: 70,
    industry: 'all',
    jobType: 'all',
    salaryMin: 0,
  });
  const [showFilters, setShowFilters] = useState(false);

  const createJob = useMutation(api.jobs.create);
  const currentJob = MOCK_JOBS[currentIndex];
  const remainingJobs = MOCK_JOBS.length - currentIndex;

  const handleSwipe = async (direction: 'left' | 'right') => {
    setSwipeDirection(direction);

    if (direction === 'right' && currentJob) {
      // Save job
      await createJob({
        title: currentJob.title,
        company: currentJob.company,
        location: currentJob.location,
        jobUrl: currentJob.jobUrl,
        description: currentJob.description,
        salary: currentJob.salary,
        status: 'saved',
        source: 'other',
      });
      setSavedJobs([...savedJobs, currentJob.id]);
    }

    // Animate and move to next job
    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex((prev) => Math.min(prev + 1, MOCK_JOBS.length));
    }, 300);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    handleSwipe('left');
  };

  const handleSave = () => {
    handleSwipe('right');
  };

  if (currentIndex >= MOCK_JOBS.length) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto text-center py-20">
              <div className="mb-6">
                <Award className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              </div>
              <h1 className="text-4xl font-bold mb-4">You've Reviewed All Matches!</h1>
              <p className="text-gray-400 mb-8">
                Great job! You've gone through all {MOCK_JOBS.length} job matches.
                <br />
                We'll notify you when new matches are available.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setCurrentIndex(0)}
                  className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
                >
                  Review Again
                </button>
                <button
                  onClick={() => window.location.href = '/jobs/tracking'}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  View Saved Jobs
                </button>
              </div>
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
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Job Match Explorer</h1>
                <p className="text-gray-400">
                  Swipe right to save, left to skip • {remainingJobs} matches remaining
                </p>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition inline-flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
                <h3 className="font-semibold mb-4">Filter Jobs</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Minimum Match Score: {filters.minMatchScore}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.minMatchScore}
                      onChange={(e) => setFilters({ ...filters, minMatchScore: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <select
                      value={filters.industry}
                      onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                    >
                      <option value="all">All Industries</option>
                      <option value="technology">Technology</option>
                      <option value="fintech">Fintech</option>
                      <option value="marketing">Marketing</option>
                      <option value="enterprise">Enterprise Software</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Job Type</label>
                    <select
                      value={filters.jobType}
                      onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                    >
                      <option value="all">All Types</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Min Salary: ${filters.salaryMin}k
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="10"
                      value={filters.salaryMin}
                      onChange={(e) => setFilters({ ...filters, salaryMin: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Job Card */}
            {currentJob && (
              <div
                className={`bg-gray-800 rounded-xl border border-gray-700 overflow-hidden transition-transform duration-300 ${
                  swipeDirection === 'left' ? 'transform -translate-x-full opacity-0' :
                  swipeDirection === 'right' ? 'transform translate-x-full opacity-0' : ''
                }`}
              >
                {/* Match Score Badge */}
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-4 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-5 h-5 text-white fill-white" />
                        <span className="text-2xl font-bold text-white">
                          {currentJob.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-yellow-100 text-sm">
                        Based on your skills and experience
                      </p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-white opacity-50" />
                  </div>
                </div>

                <div className="p-6">
                  {/* Job Header */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">{currentJob.title}</h2>
                    <p className="text-xl text-gray-300 mb-4">{currentJob.company}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {currentJob.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {currentJob.salary}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {currentJob.jobType}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Posted {currentJob.postedDate}
                      </div>
                    </div>
                  </div>

                  {/* Skills Match */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-yellow-500">Your Matching Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentJob.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">About the Role</h3>
                    <p className="text-gray-300 leading-relaxed">{currentJob.description}</p>
                  </div>

                  {/* Requirements */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      {currentJob.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-300">
                          <span className="text-yellow-500 mt-1">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Benefits</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentJob.benefits.map((benefit) => (
                        <span
                          key={benefit}
                          className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* View Original Posting */}
                  <a
                    href={currentJob.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Original Posting
                  </a>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="p-4 bg-gray-800 rounded-full hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                className="p-6 bg-red-500 rounded-full hover:bg-red-400 transition shadow-lg hover:shadow-red-500/50"
              >
                <X className="w-8 h-8" />
              </button>

              <button
                onClick={handleSave}
                className="p-6 bg-green-500 rounded-full hover:bg-green-400 transition shadow-lg hover:shadow-green-500/50"
              >
                <Heart className="w-8 h-8" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex >= MOCK_JOBS.length - 1}
                className="p-4 bg-gray-800 rounded-full hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="text-center mt-6 text-gray-400 text-sm">
              <p>
                Use arrow keys: ← Skip • → Save • ↓ Next
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
