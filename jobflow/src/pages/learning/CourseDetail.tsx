import { useUser } from '@clerk/clerk-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Star, Clock, Users, Award, BookOpen, PlayCircle, CheckCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CourseDetail() {
  const { user } = useUser();
  const { courseId } = useParams();
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  // Mock course data
  const course = {
    id: courseId || '1',
    title: 'AWS Certified Solutions Architect - Professional',
    provider: 'A Cloud Guru',
    instructor: {
      name: 'Ryan Kroonenburg',
      title: 'Cloud Solutions Architect',
      bio: 'Ryan is a Solutions Architect with over 15 years of experience in cloud computing and has trained over 500,000 students.',
      courses: 12,
      students: 500000,
      rating: 4.8,
    },
    description: 'The AWS Certified Solutions Architect - Professional certification is for individuals who perform a solutions architect role with two or more years of hands-on experience managing and operating systems on AWS.',
    longDescription: 'This course will prepare you for the AWS Certified Solutions Architect - Professional exam. You will learn advanced AWS concepts including designing and deploying dynamically scalable, highly available, fault-tolerant, and reliable applications on AWS. The course covers best practices for designing and operating secure, robust, and cost-optimized infrastructure.',
    duration: '40 hours',
    level: 'Advanced',
    price: '$299',
    originalPrice: '$399',
    rating: 4.8,
    reviewCount: 12500,
    students: 50000,
    lastUpdated: 'January 2024',
    language: 'English',
    subtitles: ['English', 'Spanish', 'French'],
    certificate: true,
    skillsLearned: [
      'Design and deploy scalable, highly available systems',
      'Implement cost-control strategies',
      'Data migration and database services',
      'Networking and content delivery',
      'Security best practices',
      'Disaster recovery and business continuity',
    ],
    requirements: [
      'AWS Certified Solutions Architect - Associate certification recommended',
      'At least 2 years of hands-on experience with AWS',
      'Understanding of networking concepts',
      'Basic understanding of security principles',
    ],
    outcomes: [
      'Pass the AWS Solutions Architect Professional exam',
      'Design enterprise-scale AWS architectures',
      'Implement advanced security measures',
      'Optimize costs for large-scale deployments',
      'Build disaster recovery solutions',
    ],
    syllabus: [
      {
        id: 1,
        title: 'Introduction & Exam Overview',
        duration: '2 hours',
        lectures: 8,
        preview: true,
        topics: [
          'Course introduction',
          'Exam format and structure',
          'Study strategies',
          'AWS account setup',
        ],
      },
      {
        id: 2,
        title: 'Identity & Federation',
        duration: '4 hours',
        lectures: 12,
        preview: false,
        topics: [
          'IAM deep dive',
          'AWS Organizations',
          'Identity Federation',
          'AWS Directory Service',
          'AWS Single Sign-On',
        ],
      },
      {
        id: 3,
        title: 'Networking & Content Delivery',
        duration: '6 hours',
        lectures: 18,
        preview: false,
        topics: [
          'VPC advanced concepts',
          'Direct Connect',
          'Route 53 advanced routing',
          'CloudFront optimization',
          'AWS Global Accelerator',
        ],
      },
      {
        id: 4,
        title: 'Data Storage & Management',
        duration: '5 hours',
        lectures: 15,
        preview: false,
        topics: [
          'S3 advanced features',
          'Storage Gateway',
          'AWS Backup',
          'Data migration strategies',
          'Snowball and Snowmobile',
        ],
      },
      {
        id: 5,
        title: 'Database Services',
        duration: '5 hours',
        lectures: 14,
        preview: false,
        topics: [
          'RDS Multi-AZ and Read Replicas',
          'Aurora advanced features',
          'DynamoDB performance',
          'ElastiCache strategies',
          'Redshift optimization',
        ],
      },
      {
        id: 6,
        title: 'Compute & Orchestration',
        duration: '6 hours',
        lectures: 16,
        preview: false,
        topics: [
          'EC2 advanced features',
          'Auto Scaling strategies',
          'ECS and EKS',
          'Lambda optimization',
          'Step Functions',
        ],
      },
      {
        id: 7,
        title: 'Security & Compliance',
        duration: '4 hours',
        lectures: 12,
        preview: false,
        topics: [
          'Security best practices',
          'AWS Shield and WAF',
          'Secrets Manager',
          'Compliance frameworks',
          'Audit and logging',
        ],
      },
      {
        id: 8,
        title: 'Disaster Recovery',
        duration: '4 hours',
        lectures: 10,
        preview: false,
        topics: [
          'Backup strategies',
          'Multi-region architectures',
          'RTO and RPO planning',
          'Pilot light and warm standby',
          'DR testing',
        ],
      },
      {
        id: 9,
        title: 'Cost Optimization',
        duration: '2 hours',
        lectures: 8,
        preview: false,
        topics: [
          'Cost allocation tags',
          'Reserved Instances strategies',
          'Spot Instances',
          'AWS Cost Explorer',
          'Billing alarms',
        ],
      },
      {
        id: 10,
        title: 'Practice Exams',
        duration: '2 hours',
        lectures: 3,
        preview: false,
        topics: [
          'Practice exam 1',
          'Practice exam 2',
          'Final review',
        ],
      },
    ],
    reviews: [
      {
        id: 1,
        author: 'John Smith',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Excellent course! Passed the exam on my first try. The practice exams were very similar to the actual exam.',
        helpful: 45,
      },
      {
        id: 2,
        author: 'Sarah Johnson',
        rating: 5,
        date: '1 month ago',
        comment: 'Very comprehensive and well-structured. Ryan explains complex concepts in an easy-to-understand way.',
        helpful: 32,
      },
      {
        id: 3,
        author: 'Mike Chen',
        rating: 4,
        date: '2 months ago',
        comment: 'Great content overall. Some sections could use more hands-on labs, but the theory is solid.',
        helpful: 18,
      },
    ],
  };

  const toggleSection = (sectionId: number) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Course Header */}
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/50 rounded-lg p-8 mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-yellow-500 text-gray-900 rounded text-sm font-bold">
                      BESTSELLER
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded text-sm font-semibold">
                      {course.level}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-3">{course.title}</h1>
                  <p className="text-gray-300 mb-4">{course.description}</p>

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-white font-semibold">{course.rating}</span>
                      <span className="text-gray-400 text-sm">({course.reviewCount.toLocaleString()} ratings)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{course.students.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor.name)}&background=3B82F6&color=fff`}
                      alt={course.instructor.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="text-white font-semibold">{course.instructor.name}</p>
                      <p className="text-gray-400 text-sm">{course.instructor.title}</p>
                    </div>
                  </div>
                </div>

                {/* Course Card */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-4xl font-bold text-white">{course.price}</span>
                    <span className="text-gray-400 line-through">{course.originalPrice}</span>
                  </div>

                  <button className="w-full mb-3 px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition font-bold text-lg">
                    Enroll Now
                  </button>
                  <button className="w-full mb-6 px-6 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg hover:bg-gray-600 transition font-semibold">
                    Add to Wishlist
                  </button>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Practice exams included</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* What You'll Learn */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">What You'll Learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.skillsLearned.map((skill, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Content */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Course Content</h2>
                  <p className="text-gray-400 mb-6">
                    {course.syllabus.length} sections • {course.syllabus.reduce((sum, s) => sum + s.lectures, 0)} lectures • {course.duration} total length
                  </p>
                  <div className="space-y-2">
                    {course.syllabus.map((section) => (
                      <div key={section.id} className="bg-gray-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-600 transition"
                        >
                          <div className="flex items-center gap-3">
                            {expandedSection === section.id ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                            <div className="text-left">
                              <p className="text-white font-semibold">{section.title}</p>
                              <p className="text-gray-400 text-sm">{section.lectures} lectures • {section.duration}</p>
                            </div>
                          </div>
                          {section.preview && (
                            <span className="text-yellow-500 text-sm font-semibold">Preview</span>
                          )}
                        </button>
                        {expandedSection === section.id && (
                          <div className="px-4 pb-4 border-t border-gray-600">
                            <ul className="space-y-2 mt-4">
                              {section.topics.map((topic, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-gray-300">
                                  <PlayCircle className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm">{topic}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {course.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-300">
                        <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Reviews */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Student Reviews</h2>
                  <div className="space-y-6">
                    {course.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-700 pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.author)}&background=random`}
                            alt={review.author}
                            className="w-12 h-12 rounded-full flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="text-white font-semibold">{review.author}</p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-gray-400 text-sm">{review.date}</span>
                            </div>
                            <p className="text-gray-300 mb-3">{review.comment}</p>
                            <button className="text-gray-400 text-sm hover:text-gray-300">
                              Helpful ({review.helpful})
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Instructor */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Instructor</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor.name)}&background=3B82F6&color=fff&size=64`}
                      alt={course.instructor.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <p className="text-white font-bold">{course.instructor.name}</p>
                      <p className="text-gray-400 text-sm">{course.instructor.title}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{course.instructor.bio}</p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-700 rounded p-3">
                      <p className="text-2xl font-bold text-white">{course.instructor.courses}</p>
                      <p className="text-gray-400 text-xs">Courses</p>
                    </div>
                    <div className="bg-gray-700 rounded p-3">
                      <p className="text-2xl font-bold text-white">{(course.instructor.students / 1000).toFixed(0)}K+</p>
                      <p className="text-gray-400 text-xs">Students</p>
                    </div>
                  </div>
                </div>

                {/* Course Info */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Course Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Level</span>
                      <span className="text-white font-semibold">{course.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white font-semibold">{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Language</span>
                      <span className="text-white font-semibold">{course.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Updated</span>
                      <span className="text-white font-semibold">{course.lastUpdated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Provider</span>
                      <span className="text-white font-semibold">{course.provider}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
