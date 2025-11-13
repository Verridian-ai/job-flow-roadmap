import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, ChevronDown, ChevronUp, Send, PlayCircle, Book, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs: FAQItem[] = [
    {
      question: 'How do I use the AI Resume Writer?',
      answer: 'The AI Resume Writer helps you create tailored resumes by analyzing your STAR stories and the job description. Simply select a job, choose relevant stories, and let our AI generate a professional resume optimized for that specific role.'
    },
    {
      question: 'What is the STAR method?',
      answer: 'STAR stands for Situation, Task, Action, Result. It\'s a structured way to describe your achievements. Situation: Set the scene. Task: Describe your responsibility. Action: Explain what you did. Result: Share the outcome and impact.'
    },
    {
      question: 'How can I improve my resume\'s impact?',
      answer: 'Use action verbs, quantify achievements with numbers, tailor content to each job, focus on results rather than duties, and keep it concise (1-2 pages). Our AI Resume Writer automatically optimizes these elements for you.'
    },
    {
      question: 'How do I track my job applications?',
      answer: 'Use the Jobs page to track applications in a Kanban board format. You can move jobs through stages: Saved, Applied, Interview, Offer, and Rejected. Add notes, deadlines, and documents to each application.'
    },
    {
      question: 'Can I book sessions with career coaches?',
      answer: 'Yes! Browse our verified coaches in the Coach Directory, view their profiles, expertise, and rates, then book a session directly through the platform. Sessions can be for resume reviews, interview prep, or career strategy.'
    },
    {
      question: 'Is my data secure and private?',
      answer: 'Absolutely. Your data is encrypted in transit and at rest. We are SOC 2 compliant, follow GDPR standards, and give you full control over your data through the Privacy Dashboard in Settings.'
    }
  ];

  const knowledgeBaseArticles = [
    {
      icon: <Book className="w-6 h-6" />,
      title: 'Getting Started with Jobflow',
      description: 'Learn the basics of using our platform to accelerate your job search.'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Writing Effective STAR Stories',
      description: 'A comprehensive guide to documenting your achievements.'
    },
    {
      icon: <PlayCircle className="w-6 h-6" />,
      title: 'AI Resume Optimization Tips',
      description: 'Best practices for creating high-impact resumes with AI.'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Interview Preparation Guide',
      description: 'Master your next interview with our expert strategies.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', contactForm);
    alert('Thank you for contacting us! We\'ll respond within 24 hours.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
          <p className="text-gray-400">Find answers, get help, and learn how to make the most of Jobflow</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search FAQs, articles, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Link
            to="/help/videos"
            className="flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-yellow-500 transition"
          >
            <PlayCircle className="w-6 h-6 text-yellow-500" />
            <div>
              <h3 className="font-semibold">Video Tutorials</h3>
              <p className="text-sm text-gray-400">Watch and learn</p>
            </div>
          </Link>
          <a
            href="#contact"
            className="flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-yellow-500 transition"
          >
            <MessageCircle className="w-6 h-6 text-yellow-500" />
            <div>
              <h3 className="font-semibold">Contact Support</h3>
              <p className="text-sm text-gray-400">Get help from our team</p>
            </div>
          </a>
          <a
            href="#knowledge-base"
            className="flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-yellow-500 transition"
          >
            <Book className="w-6 h-6 text-yellow-500" />
            <div>
              <h3 className="font-semibold">Knowledge Base</h3>
              <p className="text-sm text-gray-400">Read detailed guides</p>
            </div>
          </a>
        </div>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-750 transition"
                >
                  <span className="font-medium text-left">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4 text-gray-400">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
          {filteredFAQs.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              No FAQs found matching your search. Try different keywords or contact support.
            </p>
          )}
        </section>

        {/* Knowledge Base */}
        <section id="knowledge-base" className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Knowledge Base</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {knowledgeBaseArticles.map((article, index) => (
              <a
                key={index}
                href="#"
                className="flex gap-4 p-6 bg-gray-800 border border-gray-700 rounded-lg hover:border-yellow-500 transition"
              >
                <div className="text-yellow-500 flex-shrink-0">
                  {article.icon}
                </div>
                <div>
                  <h3 className="font-bold mb-1">{article.title}</h3>
                  <p className="text-sm text-gray-400">{article.description}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Contact Support Form */}
        <section id="contact" className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Contact Support</h2>
          <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="Your Name"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="your.email@example.com"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                required
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="How can we help?"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                required
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Please describe your issue or question in detail..."
                rows={6}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white placeholder-gray-400 resize-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit
              </button>
            </div>
          </form>
        </section>

        {/* System Status */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">System Status</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium">All Systems Operational</p>
                <p className="text-sm text-gray-400">No known issues at this time.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
