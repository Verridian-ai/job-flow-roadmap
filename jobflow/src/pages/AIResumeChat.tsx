import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ExtractedStory {
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  skills: string[];
}

export default function AIResumeChat() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Resume Agent. Tell me about a time you faced a challenge at work, accomplished something significant, or demonstrated a key skill. I'll help you capture it as a STAR story.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [extractedStory, setExtractedStory] = useState<ExtractedStory | null>(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const createStory = useMutation(api.starStories.create);
  const extractStory = useMutation(api.ai.actions.extractStarStory);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Call AI to extract STAR story
      const result = await extractStory({ userInput: input.trim() });

      if (result.isStory) {
        // Show extracted story for review
        setExtractedStory(result.story);
        setShowStoryModal(true);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Great! I've detected a STAR story in your response. I've broken it down into the STAR format. Would you like to review and save it?",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Ask follow-up questions
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.followUpQuestion || "Could you provide more details? I'm looking for specific examples of challenges you faced, actions you took, and the results you achieved.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error('Error extracting STAR story:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSaveStory = async () => {
    if (!extractedStory) return;

    try {
      await createStory({
        title: extractedStory.title,
        situation: extractedStory.situation,
        task: extractedStory.task,
        action: extractedStory.action,
        result: extractedStory.result,
        skills: extractedStory.skills,
        category: 'General',
      });

      setShowStoryModal(false);
      setExtractedStory(null);

      const successMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Perfect! Your STAR story has been saved. Would you like to share another achievement or experience?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);
    } catch (error) {
      console.error('Error saving story:', error);
      alert('Failed to save story. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 lg:px-10 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-yellow-400 hover:text-yellow-300">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
            </svg>
          </Link>
          <h2 className="text-white text-xl font-bold tracking-tight">AI Resume Agent</h2>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/star-stories"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 transition-colors text-sm font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            View Memory Bank
          </Link>
          <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                {user?.firstName?.[0] || 'U'}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-hidden flex flex-col max-w-5xl w-full mx-auto">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-yellow-400/20 p-2 text-yellow-400">
                  <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
                  </svg>
                </div>
              )}
              <div
                className={`flex flex-col max-w-2xl ${
                  message.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-bold ${message.role === 'user' ? 'text-white' : 'text-yellow-400'}`}>
                    {message.role === 'user' ? 'You' : 'Agent'}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div
                  className={`rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-yellow-400/10 text-white'
                      : 'bg-zinc-800 text-white'
                  }`}
                >
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
              {message.role === 'user' && (
                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-zinc-700 overflow-hidden">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="You" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
                      {user?.firstName?.[0] || 'U'}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4 justify-start">
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-yellow-400/20 p-2 text-yellow-400">
                <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
                </svg>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-4">
          <div className="max-w-5xl mx-auto flex gap-4 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share a work achievement, challenge you overcame, or skill you demonstrated..."
                className="w-full bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none p-4 pr-12 resize-none min-h-[56px] max-h-[200px] placeholder:text-zinc-500"
                rows={1}
                disabled={isTyping}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="h-14 w-14 flex items-center justify-center rounded-lg bg-yellow-400 text-zinc-900 transition-all hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Story Review Modal */}
      {showStoryModal && extractedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-xl bg-zinc-900 border border-zinc-700 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white">Review Your STAR Story</h3>
                <p className="text-zinc-400 mt-1">Here's a summary of the story we detected. Review and save it to your profile.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-yellow-400">Title</label>
                  <p className="mt-1 text-white rounded-lg bg-zinc-800 p-3">{extractedStory.title}</p>
                </div>
                <div>
                  <label className="text-sm font-bold text-yellow-400">Situation</label>
                  <p className="mt-1 text-white/90 rounded-lg bg-zinc-800 p-3">{extractedStory.situation}</p>
                </div>
                <div>
                  <label className="text-sm font-bold text-yellow-400">Task</label>
                  <p className="mt-1 text-white/90 rounded-lg bg-zinc-800 p-3">{extractedStory.task}</p>
                </div>
                <div>
                  <label className="text-sm font-bold text-yellow-400">Action</label>
                  <p className="mt-1 text-white/90 rounded-lg bg-zinc-800 p-3">{extractedStory.action}</p>
                </div>
                <div>
                  <label className="text-sm font-bold text-yellow-400">Result</label>
                  <p className="mt-1 text-white/90 rounded-lg bg-zinc-800 p-3">{extractedStory.result}</p>
                </div>
                {extractedStory.skills.length > 0 && (
                  <div>
                    <label className="text-sm font-bold text-yellow-400">Detected Skills</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {extractedStory.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-400 text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-2 flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowStoryModal(false);
                    setExtractedStory(null);
                  }}
                  className="flex h-12 min-w-[120px] items-center justify-center rounded-lg bg-zinc-700 px-6 text-base font-bold text-white transition-colors hover:bg-zinc-600"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveStory}
                  className="flex h-12 min-w-[120px] items-center justify-center rounded-lg bg-yellow-400 px-6 text-base font-bold text-zinc-900 transition-opacity hover:opacity-90"
                >
                  Save Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
