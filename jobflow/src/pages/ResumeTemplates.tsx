import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  FileText,
  Palette,
  Eye,
  Check,
  Sparkles,
  Briefcase,
  Code,
  GraduationCap,
  Rocket,
  TrendingUp,
  Building,
  Lightbulb,
  UserCircle,
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'creative' | 'executive' | 'technical' | 'academic' | 'minimal' | 'corporate' | 'startup';
  icon: any;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  preview: string;
  features: string[];
}

const templates: Template[] = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean and contemporary design perfect for most industries',
    category: 'modern',
    icon: Briefcase,
    colors: {
      primary: '#3B82F6',
      secondary: '#1F2937',
      accent: '#F59E0B',
    },
    preview: 'A sleek two-column layout with bold section headers and ample white space',
    features: ['Two-column layout', 'Bold typography', 'Icon accents', 'ATS-friendly'],
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    description: 'Stand out with a unique design for creative professionals',
    category: 'creative',
    icon: Palette,
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#14B8A6',
    },
    preview: 'Dynamic layout with creative color blocks and modern typography',
    features: ['Asymmetric layout', 'Color blocks', 'Portfolio section', 'Visual hierarchy'],
  },
  {
    id: 'executive-leadership',
    name: 'Executive Leadership',
    description: 'Professional and authoritative for senior-level positions',
    category: 'executive',
    icon: TrendingUp,
    colors: {
      primary: '#1F2937',
      secondary: '#6B7280',
      accent: '#D97706',
    },
    preview: 'Classic single-column layout emphasizing experience and achievements',
    features: ['Traditional format', 'Achievement-focused', 'Professional tone', 'Clean design'],
  },
  {
    id: 'technical-engineering',
    name: 'Technical/Engineering',
    description: 'Structured format ideal for tech and engineering roles',
    category: 'technical',
    icon: Code,
    colors: {
      primary: '#10B981',
      secondary: '#064E3B',
      accent: '#34D399',
    },
    preview: 'Grid-based layout with sections for skills, projects, and certifications',
    features: ['Skills matrix', 'Project highlights', 'Technical stack', 'Certification badges'],
  },
  {
    id: 'academic-research',
    name: 'Academic Research',
    description: 'Comprehensive format for academic and research positions',
    category: 'academic',
    icon: GraduationCap,
    colors: {
      primary: '#1E40AF',
      secondary: '#475569',
      accent: '#60A5FA',
    },
    preview: 'Detailed CV format with publications, research, and teaching experience',
    features: ['Publication list', 'Research focus', 'Teaching experience', 'Academic honors'],
  },
  {
    id: 'minimalist-clean',
    name: 'Minimalist Clean',
    description: 'Simple and elegant with focus on content',
    category: 'minimal',
    icon: FileText,
    colors: {
      primary: '#000000',
      secondary: '#6B7280',
      accent: '#FFFFFF',
    },
    preview: 'Ultra-clean design with minimal decoration and maximum readability',
    features: ['Minimal design', 'High readability', 'Content-focused', 'Timeless style'],
  },
  {
    id: 'corporate-traditional',
    name: 'Corporate Traditional',
    description: 'Conservative and professional for corporate environments',
    category: 'corporate',
    icon: Building,
    colors: {
      primary: '#1F2937',
      secondary: '#374151',
      accent: '#9CA3AF',
    },
    preview: 'Traditional business format with clear structure and professional appearance',
    features: ['Standard format', 'Business-focused', 'Conservative design', 'Easy to scan'],
  },
  {
    id: 'startup-innovative',
    name: 'Startup Innovative',
    description: 'Modern and bold for startup and innovation roles',
    category: 'startup',
    icon: Rocket,
    colors: {
      primary: '#F59E0B',
      secondary: '#DC2626',
      accent: '#8B5CF6',
    },
    preview: 'Energetic design with bold colors and modern layout',
    features: ['Bold colors', 'Modern layout', 'Impact-focused', 'Personality showcase'],
  },
];

export default function ResumeTemplates() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('id') as Id<'resumes'> | null;
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const resume = useQuery(api.resumes.getById, resumeId ? { id: resumeId } : 'skip');
  const applyTemplate = useMutation(api.resumes.applyTemplate);

  const categories = [
    { id: 'all', name: 'All Templates', icon: FileText },
    { id: 'modern', name: 'Modern', icon: Sparkles },
    { id: 'creative', name: 'Creative', icon: Palette },
    { id: 'executive', name: 'Executive', icon: TrendingUp },
    { id: 'technical', name: 'Technical', icon: Code },
    { id: 'academic', name: 'Academic', icon: GraduationCap },
    { id: 'minimal', name: 'Minimal', icon: FileText },
    { id: 'corporate', name: 'Corporate', icon: Building },
    { id: 'startup', name: 'Startup', icon: Rocket },
  ];

  const filteredTemplates =
    selectedCategory === 'all'
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  const handleApplyTemplate = async (templateId: string) => {
    if (!resumeId) {
      alert('Please select a resume first');
      return;
    }

    try {
      await applyTemplate({
        resumeId,
        templateId,
      });
      alert('Template applied successfully!');
      navigate(`/resume-refinement?id=${resumeId}`);
    } catch (error) {
      console.error('Failed to apply template:', error);
      alert('Failed to apply template. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Palette className="w-8 h-8 text-yellow-500" />
                Resume Template Gallery
              </h1>
              <p className="text-gray-400">
                Choose from professional templates designed to make your resume stand out
              </p>
              {resume && (
                <p className="text-sm text-yellow-500 mt-2">
                  Applying template to: {resume.title}
                </p>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg font-semibold transition inline-flex items-center gap-2 ${
                        selectedCategory === category.id
                          ? 'bg-yellow-500 text-gray-900'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <div
                    key={template.id}
                    className={`bg-gray-800 rounded-lg border overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 ${
                      selectedTemplate === template.id
                        ? 'border-yellow-500 ring-2 ring-yellow-500'
                        : 'border-gray-700'
                    }`}
                  >
                    {/* Template Preview */}
                    <div
                      className="h-64 bg-gradient-to-br p-6 flex items-center justify-center relative"
                      style={{
                        background: `linear-gradient(135deg, ${template.colors.primary}20 0%, ${template.colors.secondary}20 100%)`,
                      }}
                    >
                      <div className="absolute top-4 right-4">
                        <Icon
                          className="w-8 h-8"
                          style={{ color: template.colors.primary }}
                        />
                      </div>
                      <div className="text-center">
                        <UserCircle
                          className="w-20 h-20 mx-auto mb-4"
                          style={{ color: template.colors.primary }}
                        />
                        <div
                          className="h-3 w-32 mx-auto mb-2 rounded"
                          style={{ backgroundColor: template.colors.primary }}
                        />
                        <div
                          className="h-2 w-24 mx-auto mb-4 rounded"
                          style={{ backgroundColor: template.colors.secondary }}
                        />
                        <div className="space-y-2">
                          <div
                            className="h-2 w-40 mx-auto rounded"
                            style={{ backgroundColor: template.colors.accent }}
                          />
                          <div
                            className="h-2 w-36 mx-auto rounded"
                            style={{ backgroundColor: template.colors.accent }}
                          />
                          <div
                            className="h-2 w-44 mx-auto rounded"
                            style={{ backgroundColor: template.colors.accent }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Template Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-400 mb-4">{template.description}</p>

                      {/* Features */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {template.features.map((feature, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-700 text-xs rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Color Swatches */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-gray-400">Colors:</span>
                        <div className="flex gap-2">
                          <div
                            className="w-6 h-6 rounded-full border-2 border-gray-700"
                            style={{ backgroundColor: template.colors.primary }}
                          />
                          <div
                            className="w-6 h-6 rounded-full border-2 border-gray-700"
                            style={{ backgroundColor: template.colors.secondary }}
                          />
                          <div
                            className="w-6 h-6 rounded-full border-2 border-gray-700"
                            style={{ backgroundColor: template.colors.accent }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPreviewTemplate(template)}
                          className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition inline-flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTemplate(template.id);
                            handleApplyTemplate(template.id);
                          }}
                          className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredTemplates.length === 0 && (
              <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No templates found in this category.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{previewTemplate.name}</h2>
                  <p className="text-gray-400">{previewTemplate.description}</p>
                </div>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Full Preview */}
              <div
                className="bg-white rounded-lg p-12 mb-6"
                style={{
                  minHeight: '600px',
                  background: `linear-gradient(to bottom, ${previewTemplate.colors.primary}10, white)`,
                }}
              >
                <div className="max-w-2xl mx-auto">
                  <h3
                    className="text-4xl font-bold mb-2"
                    style={{ color: previewTemplate.colors.primary }}
                  >
                    John Doe
                  </h3>
                  <p
                    className="text-xl mb-6"
                    style={{ color: previewTemplate.colors.secondary }}
                  >
                    {previewTemplate.category.charAt(0).toUpperCase() +
                      previewTemplate.category.slice(1)}{' '}
                    Professional
                  </p>
                  <div className="mb-8">
                    <h4
                      className="text-2xl font-bold mb-4 border-b-2 pb-2"
                      style={{
                        color: previewTemplate.colors.primary,
                        borderColor: previewTemplate.colors.accent,
                      }}
                    >
                      Professional Summary
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {previewTemplate.preview}
                    </p>
                  </div>
                  <div className="mb-8">
                    <h4
                      className="text-2xl font-bold mb-4 border-b-2 pb-2"
                      style={{
                        color: previewTemplate.colors.primary,
                        borderColor: previewTemplate.colors.accent,
                      }}
                    >
                      Experience
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-xl font-semibold text-gray-900">
                          Senior Position
                        </h5>
                        <p
                          className="text-lg mb-2"
                          style={{ color: previewTemplate.colors.secondary }}
                        >
                          Company Name | 2020 - Present
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          <li>Achievement with measurable impact</li>
                          <li>Led team of professionals to success</li>
                          <li>Implemented innovative solutions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setSelectedTemplate(previewTemplate.id);
                    handleApplyTemplate(previewTemplate.id);
                    setPreviewTemplate(null);
                  }}
                  className="flex-1 px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Apply This Template
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
