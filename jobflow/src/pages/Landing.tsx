import { SignInButton, SignUpButton, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Briefcase, Target, FileText, Users, Sparkles, ArrowRight } from 'lucide-react';

export default function Landing() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-yellow-500" />
            <span className="text-2xl font-bold">Jobflow</span>
          </div>
          <div className="flex items-center gap-4">
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-gray-300 hover:text-white transition">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition">
                Get Started
              </button>
            </SignUpButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Land Your Dream Job with
            <span className="text-yellow-500"> AI-Powered Tools</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Build compelling resumes, track applications, and connect with expert coaches
            to accelerate your career journey.
          </p>
          <SignUpButton mode="modal">
            <button className="px-8 py-4 bg-yellow-500 text-gray-900 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition inline-flex items-center gap-2">
              Start Free Today
              <ArrowRight className="w-5 h-5" />
            </button>
          </SignUpButton>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Succeed</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <Sparkles className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Resume Builder</h3>
            <p className="text-gray-400">
              Generate tailored resumes for each job application using AI and your STAR stories.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <FileText className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">STAR Stories</h3>
            <p className="text-gray-400">
              Document your achievements in the STAR format to build a powerful portfolio.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <Target className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Job Tracking</h3>
            <p className="text-gray-400">
              Organize your job search with a Kanban board to track every application.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <Users className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expert Coaches</h3>
            <p className="text-gray-400">
              Connect with verified career coaches for personalized guidance and support.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Job Search?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of job seekers who have found success with Jobflow.
          </p>
          <SignUpButton mode="modal">
            <button className="px-8 py-4 bg-yellow-500 text-gray-900 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition">
              Create Free Account
            </button>
          </SignUpButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2025 Jobflow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
