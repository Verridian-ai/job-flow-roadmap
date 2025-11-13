import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  MessageSquare,
  DollarSign,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Book,
  PlayCircle,
  RotateCcw,
  Award,
  Briefcase,
  User,
  Bot,
  Sparkles,
  BarChart,
} from 'lucide-react';

interface Message {
  role: 'user' | 'employer';
  content: string;
  timestamp: Date;
}

interface NegotiationScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  context: string;
  employerProfile: string;
  targetSalary: number;
  minAcceptable: number;
  maxOffer: number;
}

interface NegotiationResult {
  success: boolean;
  finalOffer: number;
  targetMet: boolean;
  feedback: string[];
  score: number;
}

const scenarios: NegotiationScenario[] = [
  {
    id: 'entry-level',
    title: 'Entry Level Position',
    description: 'Negotiating your first job offer',
    difficulty: 'Easy',
    context: 'You received an offer for a Junior Software Engineer position at a tech startup.',
    employerProfile: 'Recruiter is friendly but budget-conscious',
    targetSalary: 75000,
    minAcceptable: 70000,
    maxOffer: 78000,
  },
  {
    id: 'mid-level',
    title: 'Mid-Career Switch',
    description: 'Moving to a new company with more responsibility',
    difficulty: 'Medium',
    context: 'You have 5 years experience and are negotiating a Senior role.',
    employerProfile: 'Hiring manager values experience and results',
    targetSalary: 140000,
    minAcceptable: 130000,
    maxOffer: 145000,
  },
  {
    id: 'executive',
    title: 'Executive Position',
    description: 'C-level negotiation with equity considerations',
    difficulty: 'Hard',
    context: 'VP of Engineering role with stock options and benefits package.',
    employerProfile: 'CEO is results-driven and values strategic thinking',
    targetSalary: 250000,
    minAcceptable: 230000,
    maxOffer: 270000,
  },
  {
    id: 'internal-promotion',
    title: 'Internal Promotion',
    description: 'Negotiating a raise with current employer',
    difficulty: 'Medium',
    context: 'You are being promoted from Senior to Lead Engineer.',
    employerProfile: 'Manager is supportive but constrained by budget cycles',
    targetSalary: 165000,
    minAcceptable: 155000,
    maxOffer: 170000,
  },
];

export default function SalaryNegotiator() {
  const [selectedScenario, setSelectedScenario] = useState<NegotiationScenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<number>(0);
  const [turnCount, setTurnCount] = useState(0);
  const [result, setResult] = useState<NegotiationResult | null>(null);
  const [showStrategy, setShowStrategy] = useState(false);

  const startNegotiation = (scenario: NegotiationScenario) => {
    setSelectedScenario(scenario);
    setIsNegotiating(true);
    setMessages([]);
    setUserInput('');
    setTurnCount(0);
    setResult(null);
    setCurrentOffer(scenario.targetSalary * 0.85); // Start with 85% of target

    const initialMessage: Message = {
      role: 'employer',
      content: `Welcome! We're excited to offer you the position. Based on our budget and your qualifications, we'd like to offer you $${(scenario.targetSalary * 0.85).toLocaleString()} annually. What are your thoughts?`,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  };

  const generateEmployerResponse = (userMessage: string, scenario: NegotiationScenario): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Analyze user's approach
    const hasResearch = lowerMessage.includes('market') || lowerMessage.includes('industry') || lowerMessage.includes('data');
    const showsValue = lowerMessage.includes('experience') || lowerMessage.includes('skills') || lowerMessage.includes('achieve');
    const isAggressive = lowerMessage.includes('need') || lowerMessage.includes('expect') || lowerMessage.includes('must');
    const isCollaborative = lowerMessage.includes('understand') || lowerMessage.includes('together') || lowerMessage.includes('fair');

    let newOffer = currentOffer;
    let response = '';

    // Determine offer adjustment
    if (hasResearch && showsValue && isCollaborative) {
      // Best approach - significant increase
      newOffer = Math.min(currentOffer * 1.08, scenario.maxOffer);
      response = `I appreciate your thorough research and the clear value you bring. Let me see what I can do. I can increase our offer to $${newOffer.toLocaleString()}. `;
    } else if (showsValue) {
      // Good approach - moderate increase
      newOffer = Math.min(currentOffer * 1.05, scenario.maxOffer);
      response = `I hear you on the value you bring. Let me propose $${newOffer.toLocaleString()}. `;
    } else if (isAggressive && !showsValue) {
      // Poor approach - small or no increase
      newOffer = Math.min(currentOffer * 1.02, scenario.maxOffer);
      response = `I understand you have expectations, but we need to work within our budget. The best I can do right now is $${newOffer.toLocaleString()}. `;
    } else if (isCollaborative) {
      // Neutral approach - small increase
      newOffer = Math.min(currentOffer * 1.03, scenario.maxOffer);
      response = `I appreciate your collaborative approach. Let's try $${newOffer.toLocaleString()}. `;
    } else {
      // Unclear approach - minimal change
      newOffer = Math.min(currentOffer * 1.01, scenario.maxOffer);
      response = `Let me see what flexibility we have. I can offer $${newOffer.toLocaleString()}. `;
    }

    setCurrentOffer(newOffer);

    // Add context based on progress
    if (newOffer >= scenario.maxOffer) {
      response += 'This is really the maximum I can approve. Does this work for you?';
    } else if (newOffer >= scenario.targetSalary) {
      response += 'This is a strong offer that reflects your value. What do you think?';
    } else {
      response += 'Can you help me understand what would make this offer work for you?';
    }

    return response;
  };

  const handleSendMessage = () => {
    if (!userInput.trim() || !selectedScenario) return;

    const userMessage: Message = {
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setTurnCount(turnCount + 1);

    // Check if user is accepting
    const isAccepting = userInput.toLowerCase().includes('accept') ||
                       userInput.toLowerCase().includes('yes') ||
                       userInput.toLowerCase().includes('agree');

    if (isAccepting) {
      concludeNegotiation(true);
      return;
    }

    // Check if user is declining
    const isDeclining = userInput.toLowerCase().includes('decline') ||
                       userInput.toLowerCase().includes('no thank') ||
                       userInput.toLowerCase().includes('pass');

    if (isDeclining) {
      concludeNegotiation(false);
      return;
    }

    // Generate employer response
    setTimeout(() => {
      const employerResponse = generateEmployerResponse(userInput, selectedScenario);
      const employerMessage: Message = {
        role: 'employer',
        content: employerResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, employerMessage]);
    }, 1000);

    setUserInput('');
  };

  const concludeNegotiation = (accepted: boolean) => {
    if (!selectedScenario) return;

    const targetMet = currentOffer >= selectedScenario.targetSalary;
    const minMet = currentOffer >= selectedScenario.minAcceptable;

    let score = 0;
    let feedback: string[] = [];

    if (accepted) {
      if (targetMet) {
        score = 95;
        feedback.push('Excellent! You met or exceeded your target salary.');
      } else if (minMet) {
        score = 75;
        feedback.push('Good job! You negotiated above your minimum acceptable offer.');
      } else {
        score = 50;
        feedback.push('You accepted below your minimum target. Consider your walk-away point next time.');
      }

      // Analyze turn efficiency
      if (turnCount <= 3) {
        score += 5;
        feedback.push('Great efficiency - you reached agreement quickly.');
      } else if (turnCount > 6) {
        score -= 5;
        feedback.push('The negotiation took many rounds. Try to be more direct with your value proposition.');
      }

      // Analyze conversation content
      const allUserMessages = messages.filter(m => m.role === 'user').map(m => m.content.toLowerCase()).join(' ');

      if (allUserMessages.includes('market') || allUserMessages.includes('research')) {
        score += 5;
        feedback.push('You backed up your request with market data - excellent strategy.');
      }

      if (allUserMessages.includes('value') || allUserMessages.includes('achieve')) {
        score += 5;
        feedback.push('You effectively communicated your value proposition.');
      }

      if (allUserMessages.includes('need') && !allUserMessages.includes('understand')) {
        score -= 5;
        feedback.push('Try to avoid language like "I need" - instead focus on value and collaboration.');
      }

    } else {
      score = 30;
      feedback.push('You walked away from the negotiation. Make sure this aligns with your career goals.');
    }

    const negotiationResult: NegotiationResult = {
      success: accepted && minMet,
      finalOffer: currentOffer,
      targetMet,
      feedback,
      score: Math.max(0, Math.min(100, score)),
    };

    setResult(negotiationResult);
    setIsNegotiating(false);
  };

  const resetNegotiation = () => {
    setSelectedScenario(null);
    setIsNegotiating(false);
    setMessages([]);
    setUserInput('');
    setCurrentOffer(0);
    setTurnCount(0);
    setResult(null);
  };

  const strategyTips = [
    {
      icon: <Target className="w-5 h-5" />,
      title: 'Research Market Rates',
      description: 'Know the salary range for your role in your market before negotiating.',
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: 'Quantify Your Value',
      description: 'Use specific examples and metrics to demonstrate your worth.',
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: 'Be Collaborative',
      description: 'Frame negotiation as working together to find a fair solution.',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Start Higher',
      description: 'Your first counter should be above your target to leave room for negotiation.',
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: 'Know Your Walk-Away Point',
      description: 'Decide your minimum acceptable offer before you start negotiating.',
    },
  ];

  if (!selectedScenario && !result) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <DollarSign className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Salary Negotiation Simulator</h1>
                    <p className="text-gray-400">Practice your negotiation skills with AI-powered scenarios</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-semibold mb-4">Choose a Scenario</h2>
                  <div className="space-y-4">
                    {scenarios.map((scenario) => (
                      <div
                        key={scenario.id}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-yellow-500 transition cursor-pointer"
                        onClick={() => startNegotiation(scenario)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Briefcase className="w-6 h-6 text-yellow-500" />
                            <div>
                              <h3 className="text-lg font-semibold">{scenario.title}</h3>
                              <p className="text-gray-400 text-sm">{scenario.description}</p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              scenario.difficulty === 'Easy'
                                ? 'bg-green-500/20 text-green-500'
                                : scenario.difficulty === 'Medium'
                                ? 'bg-yellow-500/20 text-yellow-500'
                                : 'bg-red-500/20 text-red-500'
                            }`}
                          >
                            {scenario.difficulty}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-400">
                          <p>{scenario.context}</p>
                          <div className="flex items-center gap-4 mt-4">
                            <div>
                              <span className="text-gray-500">Target:</span>
                              <span className="ml-2 text-green-500 font-semibold">
                                ${scenario.targetSalary.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Range:</span>
                              <span className="ml-2 text-gray-300">
                                ${scenario.minAcceptable.toLocaleString()} - ${scenario.maxOffer.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="mt-4 w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center justify-center gap-2">
                          <PlayCircle className="w-5 h-5" />
                          Start Scenario
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Book className="w-5 h-5 text-yellow-500" />
                      <h3 className="font-semibold">Negotiation Strategy Tips</h3>
                    </div>
                    <button
                      onClick={() => setShowStrategy(!showStrategy)}
                      className="w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
                    >
                      {showStrategy ? 'Hide Tips' : 'Show Tips'}
                    </button>
                    {showStrategy && (
                      <div className="mt-4 space-y-4">
                        {strategyTips.map((tip, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="p-2 bg-yellow-500/20 rounded-lg h-fit">
                              {tip.icon}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{tip.title}</p>
                              <p className="text-xs text-gray-400">{tip.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-blue-500" />
                      <h3 className="font-semibold text-blue-500">AI-Powered Practice</h3>
                    </div>
                    <p className="text-sm text-gray-300">
                      Our AI employer adapts to your negotiation style, providing realistic responses
                      and valuable feedback to help you improve.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
                <div className="text-center mb-8">
                  <div
                    className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      result.success ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}
                  >
                    {result.success ? (
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    ) : (
                      <XCircle className="w-10 h-10 text-red-500" />
                    )}
                  </div>
                  <h2 className="text-3xl font-bold mb-2">
                    {result.success ? 'Negotiation Successful!' : 'Negotiation Ended'}
                  </h2>
                  <p className="text-gray-400">Here's your performance summary</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-900 rounded-lg p-6 text-center">
                    <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 mb-1">Final Offer</p>
                    <p className="text-2xl font-bold">${result.finalOffer.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-6 text-center">
                    <Target className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 mb-1">Target Met</p>
                    <p className="text-2xl font-bold">{result.targetMet ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-6 text-center">
                    <BarChart className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 mb-1">Performance Score</p>
                    <p className="text-2xl font-bold">{result.score}/100</p>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-yellow-500" />
                    Performance Feedback
                  </h3>
                  <ul className="space-y-3">
                    {result.feedback.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={resetNegotiation}
                    className="flex-1 px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Try Another Scenario
                  </button>
                  <button
                    onClick={() => {
                      if (selectedScenario) {
                        startNegotiation(selectedScenario);
                      }
                    }}
                    className="flex-1 px-6 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-5 h-5" />
                    Retry This Scenario
                  </button>
                </div>
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
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <button
                onClick={resetNegotiation}
                className="text-gray-400 hover:text-white transition flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Scenarios
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">{selectedScenario?.title}</h2>
                      <p className="text-sm text-gray-400">{selectedScenario?.context}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedScenario?.difficulty === 'Easy'
                          ? 'bg-green-500/20 text-green-500'
                          : selectedScenario?.difficulty === 'Medium'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {selectedScenario?.difficulty}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 h-[500px] flex flex-col">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === 'user' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                          }`}
                        >
                          {message.role === 'user' ? (
                            <User className="w-5 h-5 text-yellow-500" />
                          ) : (
                            <Bot className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <div
                          className={`flex-1 p-4 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-yellow-500/20 border border-yellow-500'
                              : 'bg-gray-700'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your response..."
                      className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!userInput.trim()}
                      className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Negotiation Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Current Offer</span>
                        <span className="font-semibold text-green-500">
                          ${currentOffer.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Your Target</span>
                        <span className="font-semibold">
                          ${selectedScenario?.targetSalary.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Minimum</span>
                        <span className="font-semibold text-red-500">
                          ${selectedScenario?.minAcceptable.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <p className="text-sm text-gray-400 mb-1">Progress to Target</p>
                      <div className="bg-gray-700 rounded-full h-2 mb-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              selectedScenario
                                ? ((currentOffer - selectedScenario.minAcceptable) /
                                    (selectedScenario.targetSalary - selectedScenario.minAcceptable)) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">Turns: {turnCount}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-blue-500">Quick Tips</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Reference market data to support your ask</li>
                    <li>• Emphasize the value you bring to the role</li>
                    <li>• Be collaborative, not confrontational</li>
                    <li>• Listen to the employer's constraints</li>
                    <li>• Type "accept" to accept the current offer</li>
                    <li>• Type "decline" to end the negotiation</li>
                  </ul>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">Employer Profile</h3>
                  <p className="text-sm text-gray-400">{selectedScenario?.employerProfile}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
