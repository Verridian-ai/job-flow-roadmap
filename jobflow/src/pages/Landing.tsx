import { SignInButton, SignUpButton, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Briefcase, Target, FileText, Users, Sparkles, ArrowRight, Star, CheckCircle, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

export default function Landing() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

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

      {/* Hero Section - AI-Focused */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-semibold text-yellow-500">Powered by Advanced AI</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Your AI Career Coach,
            <br />
            <span className="text-yellow-500">Working 24/7 for Your Success</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Transform your job search with AI that writes compelling resumes, tracks every application,
            and connects you with expert coaches. Land your dream job faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <button className="px-8 py-4 bg-yellow-500 text-gray-900 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition inline-flex items-center justify-center gap-2">
                Start Free Today
                <ArrowRight className="w-5 h-5" />
              </button>
            </SignUpButton>
            <a
              href="#how-it-works"
              className="px-8 py-4 bg-gray-800 text-white rounded-lg font-semibold text-lg hover:bg-gray-700 transition inline-flex items-center justify-center gap-2 border border-gray-700"
            >
              See How It Works
            </a>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span><strong className="text-white">4.9/5</strong> from 2,000+ users</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span><strong className="text-white">10,000+</strong> resumes generated</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span><strong className="text-white">500+</strong> verified coaches</span>
            </div>
          </div>
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

      {/* Testimonials */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex gap-1 mb-4">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <p className="text-gray-300 mb-4">
              "The AI resume builder is incredible! It helped me land 3 interviews in the first week.
              The STAR method made it so easy to showcase my achievements."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div>
                <p className="font-semibold">Sarah Johnson</p>
                <p className="text-sm text-gray-400">Product Manager</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex gap-1 mb-4">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <p className="text-gray-300 mb-4">
              "The coach directory connected me with an amazing career advisor who helped me negotiate
              a 30% salary increase. Worth every penny!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div>
                <p className="font-semibold">Michael Chen</p>
                <p className="text-sm text-gray-400">Software Engineer</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex gap-1 mb-4">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <p className="text-gray-300 mb-4">
              "Job tracking keeps me organized and the AI suggestions are spot-on. I finally feel
              in control of my job search instead of overwhelmed."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div>
                <p className="font-semibold">Emily Rodriguez</p>
                <p className="text-sm text-gray-400">Marketing Specialist</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {[
            {
              question: "How does the AI resume builder work?",
              answer: "Our AI analyzes your STAR stories and the job description to create a tailored resume that highlights your most relevant achievements. It optimizes for ATS systems and uses proven formatting that recruiters love."
            },
            {
              question: "Is Jobflow really free?",
              answer: "Yes! Our core features including STAR stories, resume builder, and job tracking are completely free. We offer a Pro plan for advanced features like unlimited AI generations and priority coach access."
            },
            {
              question: "What is the STAR method?",
              answer: "STAR stands for Situation, Task, Action, Result. It's a structured way to document your achievements that makes it easy to create compelling resumes and ace behavioral interviews."
            },
            {
              question: "How are coaches verified?",
              answer: "All coaches go through a rigorous verification process including credential checks, background verification, and client reviews. We only accept experienced professionals with proven track records."
            },
            {
              question: "Can I export my data?",
              answer: "Absolutely! You have full control over your data. Export everything at any time from your Privacy Dashboard. We believe your career data belongs to you."
            }
          ].map((faq, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-750 transition text-left"
              >
                <span className="font-semibold">{faq.question}</span>
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
