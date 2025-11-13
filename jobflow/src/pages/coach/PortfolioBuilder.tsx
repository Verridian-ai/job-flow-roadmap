import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  Layout,
  Image as ImageIcon,
  Type,
  FileText,
  Video,
  Link as LinkIcon,
  Plus,
  Trash2,
  Eye,
  Save,
  Download,
  Share2,
  Grid,
  List,
  Settings,
  Clock,
  MessageSquare,
  Edit,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  Copy,
  Move
} from 'lucide-react';

type ComponentType = 'text' | 'image' | 'project' | 'testimonial' | 'skills' | 'video' | 'link';

interface PortfolioComponent {
  id: string;
  type: ComponentType;
  content: any;
  order: number;
}

export default function PortfolioBuilder() {
  const [portfolioName, setPortfolioName] = useState('My Career Portfolio');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');
  const [components, setComponents] = useState<PortfolioComponent[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [coachAnnotations, setCoachAnnotations] = useState<any[]>([]);
  const [clientReplies, setClientReplies] = useState<any[]>([]);

  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      preview: 'Clean and contemporary design with bold typography',
      color: 'blue'
    },
    {
      id: 'creative',
      name: 'Creative Portfolio',
      preview: 'Vibrant and expressive layout for creative professionals',
      color: 'purple'
    },
    {
      id: 'minimal',
      name: 'Minimal Elegance',
      preview: 'Sophisticated minimalist design with ample whitespace',
      color: 'gray'
    },
    {
      id: 'corporate',
      name: 'Corporate Executive',
      preview: 'Traditional and authoritative layout for executives',
      color: 'yellow'
    }
  ];

  const componentTypes = [
    {
      type: 'text' as ComponentType,
      icon: Type,
      label: 'Text Block',
      description: 'Add headings, paragraphs, or formatted text'
    },
    {
      type: 'image' as ComponentType,
      icon: ImageIcon,
      label: 'Image',
      description: 'Upload photos or graphics'
    },
    {
      type: 'project' as ComponentType,
      icon: FileText,
      label: 'Project Card',
      description: 'Showcase a project with details'
    },
    {
      type: 'testimonial' as ComponentType,
      icon: MessageSquare,
      label: 'Testimonial',
      description: 'Add client testimonials or reviews'
    },
    {
      type: 'skills' as ComponentType,
      icon: Grid,
      label: 'Skills Grid',
      description: 'Display your skills and expertise'
    },
    {
      type: 'video' as ComponentType,
      icon: Video,
      label: 'Video',
      description: 'Embed video content'
    },
    {
      type: 'link' as ComponentType,
      icon: LinkIcon,
      label: 'Link Button',
      description: 'Add external links or CTAs'
    }
  ];

  const sampleAnnotations = [
    {
      id: 1,
      componentId: 'comp-1',
      author: 'Coach',
      text: 'Consider adding more specific metrics to this project description',
      timestamp: '2024-03-20 10:30 AM',
      status: 'active',
      replies: []
    },
    {
      id: 2,
      componentId: 'comp-2',
      author: 'Coach',
      text: 'Great testimonial! This really highlights your leadership skills.',
      timestamp: '2024-03-19 3:15 PM',
      status: 'resolved',
      replies: [
        {
          id: 1,
          author: 'Client',
          text: 'Thanks! Should I add more testimonials?',
          timestamp: '2024-03-19 4:00 PM'
        }
      ]
    }
  ];

  const versions = [
    { id: 1, date: '2024-03-20', name: 'Current Draft', status: 'draft' },
    { id: 2, date: '2024-03-18', name: 'Coach Review V2', status: 'reviewed' },
    { id: 3, date: '2024-03-15', name: 'Initial Draft', status: 'archived' }
  ];

  const addComponent = (type: ComponentType) => {
    const newComponent: PortfolioComponent = {
      id: `comp-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      order: components.length
    };
    setComponents([...components, newComponent]);
    setSelectedComponent(newComponent.id);
  };

  const getDefaultContent = (type: ComponentType) => {
    switch (type) {
      case 'text':
        return { text: 'Enter your text here...', style: 'paragraph' };
      case 'image':
        return { url: '', alt: '', caption: '' };
      case 'project':
        return { title: 'Project Title', description: '', technologies: [], link: '' };
      case 'testimonial':
        return { quote: '', author: '', position: '', company: '' };
      case 'skills':
        return { skills: ['Skill 1', 'Skill 2', 'Skill 3'] };
      case 'video':
        return { url: '', title: '' };
      case 'link':
        return { text: 'Click Here', url: '', style: 'primary' };
      default:
        return {};
    }
  };

  const removeComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
  };

  const moveComponent = (id: string, direction: 'up' | 'down') => {
    const index = components.findIndex(c => c.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === components.length - 1)
    ) {
      return;
    }

    const newComponents = [...components];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newComponents[index], newComponents[targetIndex]] = [
      newComponents[targetIndex],
      newComponents[index]
    ];

    newComponents.forEach((comp, idx) => {
      comp.order = idx;
    });

    setComponents(newComponents);
  };

  const duplicateComponent = (id: string) => {
    const component = components.find(c => c.id === id);
    if (component) {
      const newComponent = {
        ...component,
        id: `comp-${Date.now()}`,
        order: components.length
      };
      setComponents([...components, newComponent]);
    }
  };

  const renderComponentEditor = (component: PortfolioComponent) => {
    const updateContent = (field: string, value: any) => {
      setComponents(
        components.map(c =>
          c.id === component.id
            ? { ...c, content: { ...c.content, [field]: value } }
            : c
        )
      );
    };

    switch (component.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Style</label>
              <select
                value={component.content.style}
                onChange={(e) => updateContent('style', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
              >
                <option value="heading">Heading</option>
                <option value="subheading">Subheading</option>
                <option value="paragraph">Paragraph</option>
                <option value="quote">Quote</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Text Content</label>
              <textarea
                value={component.content.text}
                onChange={(e) => updateContent('text', e.target.value)}
                rows={6}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none"
              />
            </div>
          </div>
        );

      case 'project':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project Title</label>
              <input
                type="text"
                value={component.content.title}
                onChange={(e) => updateContent('title', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={component.content.description}
                onChange={(e) => updateContent('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Project Link</label>
              <input
                type="url"
                value={component.content.link}
                onChange={(e) => updateContent('link', e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
              />
            </div>
          </div>
        );

      case 'testimonial':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Quote</label>
              <textarea
                value={component.content.quote}
                onChange={(e) => updateContent('quote', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Author Name</label>
                <input
                  type="text"
                  value={component.content.author}
                  onChange={(e) => updateContent('author', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Position</label>
                <input
                  type="text"
                  value={component.content.position}
                  onChange={(e) => updateContent('position', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                />
              </div>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Skills (one per line)</label>
              <textarea
                value={component.content.skills?.join('\n')}
                onChange={(e) => updateContent('skills', e.target.value.split('\n'))}
                rows={6}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white resize-none"
              />
            </div>
          </div>
        );

      default:
        return <p className="text-gray-400">Editor for {component.type}</p>;
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
              <div className="flex items-center justify-between mb-4">
                <div>
                  <input
                    type="text"
                    value={portfolioName}
                    onChange={(e) => setPortfolioName(e.target.value)}
                    className="text-3xl font-bold bg-transparent border-b-2 border-transparent hover:border-gray-700 focus:border-yellow-500 focus:outline-none transition"
                  />
                  <p className="text-gray-400 mt-2">Build your professional portfolio</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition inline-flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {previewMode ? 'Edit' : 'Preview'}
                  </button>
                  <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition inline-flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition inline-flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>

              {/* Template Selector */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Template: {templates.find(t => t.id === selectedTemplate)?.name}</h3>
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="text-yellow-500 hover:text-yellow-400 text-sm font-medium"
                  >
                    Change Template
                  </button>
                </div>
                {showTemplates && (
                  <div className="grid md:grid-cols-4 gap-4 mt-4">
                    {templates.map(template => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          setShowTemplates(false);
                        }}
                        className={`p-4 rounded-lg border-2 text-left transition ${
                          selectedTemplate === template.id
                            ? 'border-yellow-500 bg-yellow-500/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-lg bg-${template.color}-500/20 flex items-center justify-center mb-3`}>
                          <Layout className={`w-6 h-6 text-${template.color}-500`} />
                        </div>
                        <h4 className="font-semibold mb-1">{template.name}</h4>
                        <p className="text-sm text-gray-400">{template.preview}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Component Library */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sticky top-4">
                  <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-gray-400">
                    Add Components
                  </h3>
                  <div className="space-y-2">
                    {componentTypes.map(({ type, icon: Icon, label, description }) => (
                      <button
                        key={type}
                        onClick={() => addComponent(type)}
                        className="w-full p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-left"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-yellow-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm mb-1">{label}</p>
                            <p className="text-xs text-gray-400">{description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Version History */}
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-gray-400">
                      Version History
                    </h3>
                    <div className="space-y-2">
                      {versions.map(version => (
                        <div key={version.id} className="p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-sm">{version.name}</p>
                            <span className={`px-2 py-1 rounded text-xs ${
                              version.status === 'draft'
                                ? 'bg-yellow-500/20 text-yellow-500'
                                : version.status === 'reviewed'
                                ? 'bg-green-500/20 text-green-500'
                                : 'bg-gray-600/20 text-gray-400'
                            }`}>
                              {version.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">
                            {new Date(version.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Canvas / Preview */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 min-h-96">
                  {components.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Layout className="w-16 h-16 text-gray-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Start Building Your Portfolio</h3>
                      <p className="text-gray-400 mb-6">
                        Add components from the left sidebar to create your portfolio
                      </p>
                      <button
                        onClick={() => addComponent('text')}
                        className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Your First Component
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {components.map((component, index) => {
                        const Icon = componentTypes.find(ct => ct.type === component.type)?.icon || FileText;
                        const hasAnnotation = sampleAnnotations.some(a => a.componentId === component.id);

                        return (
                          <div
                            key={component.id}
                            className={`border-2 rounded-lg p-4 transition ${
                              selectedComponent === component.id
                                ? 'border-yellow-500 bg-gray-700'
                                : 'border-gray-600 hover:border-gray-500'
                            } ${hasAnnotation ? 'ring-2 ring-blue-500/50' : ''}`}
                            onClick={() => setSelectedComponent(component.id)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5 text-yellow-500" />
                                <span className="font-semibold capitalize">{component.type}</span>
                                {hasAnnotation && (
                                  <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-xs flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" />
                                    Coach Note
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveComponent(component.id, 'up');
                                  }}
                                  disabled={index === 0}
                                  className="p-1 bg-gray-600 rounded hover:bg-gray-500 transition disabled:opacity-30"
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveComponent(component.id, 'down');
                                  }}
                                  disabled={index === components.length - 1}
                                  className="p-1 bg-gray-600 rounded hover:bg-gray-500 transition disabled:opacity-30"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateComponent(component.id);
                                  }}
                                  className="p-1 bg-gray-600 rounded hover:bg-gray-500 transition"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeComponent(component.id);
                                  }}
                                  className="p-1 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Component Preview */}
                            <div className="bg-gray-800 p-4 rounded-lg">
                              {component.type === 'text' && (
                                <div>
                                  <p className={`text-gray-300 ${
                                    component.content.style === 'heading' ? 'text-2xl font-bold' :
                                    component.content.style === 'subheading' ? 'text-xl font-semibold' :
                                    component.content.style === 'quote' ? 'italic text-lg border-l-4 border-yellow-500 pl-4' :
                                    ''
                                  }`}>
                                    {component.content.text}
                                  </p>
                                </div>
                              )}
                              {component.type === 'project' && (
                                <div>
                                  <h3 className="text-xl font-bold mb-2">{component.content.title}</h3>
                                  <p className="text-gray-400">{component.content.description || 'Add project description...'}</p>
                                </div>
                              )}
                              {component.type === 'testimonial' && (
                                <div>
                                  <p className="text-gray-300 italic mb-3">"{component.content.quote || 'Add testimonial quote...'}"</p>
                                  <p className="text-sm text-gray-400">
                                    - {component.content.author || 'Author'}, {component.content.position || 'Position'}
                                  </p>
                                </div>
                              )}
                              {component.type === 'skills' && (
                                <div className="flex flex-wrap gap-2">
                                  {component.content.skills?.map((skill: string, idx: number) => (
                                    <span key={idx} className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Coach Annotations */}
                            {hasAnnotation && (
                              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                {sampleAnnotations
                                  .filter(a => a.componentId === component.id)
                                  .map(annotation => (
                                    <div key={annotation.id}>
                                      <div className="flex items-start gap-2 mb-2">
                                        <MessageSquare className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
                                        <div className="flex-1">
                                          <p className="text-sm text-gray-300">{annotation.text}</p>
                                          <p className="text-xs text-gray-500 mt-1">{annotation.timestamp}</p>
                                        </div>
                                      </div>
                                      {annotation.replies.length > 0 && (
                                        <div className="ml-6 mt-2 space-y-2">
                                          {annotation.replies.map(reply => (
                                            <div key={reply.id} className="text-sm">
                                              <p className="text-gray-400">{reply.text}</p>
                                              <p className="text-xs text-gray-500 mt-1">{reply.timestamp}</p>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      <button className="mt-2 text-xs text-blue-500 hover:text-blue-400">
                                        Reply to Coach
                                      </button>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Properties Panel */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sticky top-4">
                  <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-gray-400">
                    {selectedComponent ? 'Edit Component' : 'Properties'}
                  </h3>

                  {selectedComponent ? (
                    <div>
                      {renderComponentEditor(
                        components.find(c => c.id === selectedComponent)!
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-sm">
                        Select a component to edit its properties
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
