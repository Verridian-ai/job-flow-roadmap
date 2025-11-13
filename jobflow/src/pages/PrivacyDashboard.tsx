import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Download, Trash2, Eye, EyeOff, Lock, ArrowLeft, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';

interface PermissionSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export default function PrivacyDashboard() {
  const [permissions, setPermissions] = useState<PermissionSetting[]>([
    {
      id: 'ai_access',
      name: 'AI Access',
      description: 'Allow AI to access your data for resume optimization and job matching',
      enabled: true
    },
    {
      id: 'coach_access',
      name: 'Coach Access',
      description: 'Allow coaches to access your data for personalized feedback and guidance',
      enabled: true
    },
    {
      id: 'community_insights',
      name: 'Anonymized Community Insights',
      description: 'Contribute to anonymized community insights to improve the platform',
      enabled: false
    },
    {
      id: 'analytics',
      name: 'Usage Analytics',
      description: 'Help us improve by sharing anonymous usage data',
      enabled: true
    }
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [anonymousContribution, setAnonymousContribution] = useState(false);

  const togglePermission = (id: string) => {
    setPermissions(permissions.map(p =>
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const handleExportData = async () => {
    // TODO: Implement actual data export via API
    console.log('Exporting user data...');
    alert('Your data export has been requested. You will receive a download link via email within 24 hours.');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    console.log('Deleting account...');
    setShowDeleteModal(false);
    alert('Account deletion initiated. You will receive a confirmation email.');
  };

  const dataInventory = [
    {
      category: 'Profile Information',
      description: 'Includes your name, contact details, work experience, and skills',
      icon: <Eye className="w-5 h-5" />
    },
    {
      category: 'STAR Stories',
      description: 'Your collection of STAR stories used for resume and interview preparation',
      icon: <Eye className="w-5 h-5" />
    },
    {
      category: 'Application History',
      description: 'Records of your job applications, including target roles and companies',
      icon: <Eye className="w-5 h-5" />
    },
    {
      category: 'Generated Resumes',
      description: 'All resumes created using the AI Resume Builder',
      icon: <Eye className="w-5 h-5" />
    },
    {
      category: 'Coach Sessions',
      description: 'Session history, notes, and feedback from career coaches',
      icon: <Eye className="w-5 h-5" />
    },
    {
      category: 'Payment Information',
      description: 'Billing history and payment methods (securely stored by Stripe)',
      icon: <Lock className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Back Link */}
        <Link
          to="/settings"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-10 h-10 text-yellow-500" />
            <h1 className="text-4xl font-bold">Data Privacy Dashboard</h1>
          </div>
          <p className="text-gray-400">
            Control how your data is used and access your privacy rights
          </p>
        </div>

        {/* GDPR Notice */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-400 font-semibold mb-1">Your Privacy Rights</p>
              <p className="text-gray-300">
                In compliance with GDPR and CCPA, you have the right to access, export, and delete your personal data.
                We are committed to protecting your privacy and giving you full control over your information.
              </p>
            </div>
          </div>
        </div>

        {/* Data Inventory */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Data Inventory</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            {dataInventory.map((item, index) => (
              <div
                key={index}
                className={`p-6 flex items-start gap-4 ${
                  index !== dataInventory.length - 1 ? 'border-b border-gray-700' : ''
                }`}
              >
                <div className="text-gray-400 mt-1">{item.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{item.category}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Granular Permissions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Privacy Permissions</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg">
            {permissions.map((permission, index) => (
              <div
                key={permission.id}
                className={`p-6 flex items-center justify-between ${
                  index !== permissions.length - 1 ? 'border-b border-gray-700' : ''
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{permission.name}</h3>
                  <p className="text-sm text-gray-400">{permission.description}</p>
                </div>
                <button
                  onClick={() => togglePermission(permission.id)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    permission.enabled ? 'bg-yellow-500' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      permission.enabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Anonymous Contribution */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Community Contribution</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={anonymousContribution}
                onChange={(e) => setAnonymousContribution(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-700 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-gray-900"
              />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Use my data for insights but keep me anonymous</h3>
                <p className="text-sm text-gray-400">
                  Help improve the platform by contributing to aggregated, anonymized insights about job search trends,
                  resume effectiveness, and career outcomes. Your identity will never be revealed.
                </p>
              </div>
            </label>
          </div>
        </section>

        {/* Data Management Actions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Data Management</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Export Data */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <Download className="w-8 h-8 text-yellow-500 mb-3" />
              <h3 className="font-bold mb-2">Export All My Data</h3>
              <p className="text-sm text-gray-400 mb-4">
                Download a complete copy of your data in JSON format. Includes all your STAR stories, resumes,
                applications, and profile information.
              </p>
              <button
                onClick={handleExportData}
                className="w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                Export Data
              </button>
            </div>

            {/* Delete Account */}
            <div className="bg-gray-800 border border-red-500/30 rounded-lg p-6">
              <Trash2 className="w-8 h-8 text-red-400 mb-3" />
              <h3 className="font-bold mb-2">Delete My Account</h3>
              <p className="text-sm text-gray-400 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
                You will receive a confirmation email first.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </section>

        {/* Security Transparency */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Security & Transparency</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Lock className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold mb-2">How We Protect Your Data</h3>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>SOC 2 Type II compliant infrastructure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Servers located in secure facilities in North America</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Regular security audits and penetration testing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Payment data handled exclusively by Stripe (PCI DSS Level 1)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>No sale of personal data to third parties</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                <strong>Last Security Audit:</strong> November 2025
                {' • '}
                <Link to="/privacy-policy" className="text-yellow-500 hover:text-yellow-400">
                  Privacy Policy
                </Link>
                {' • '}
                <Link to="/terms" className="text-yellow-500 hover:text-yellow-400">
                  Terms of Service
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">Delete Account?</h3>
                <p className="text-gray-400 text-sm mb-4">
                  This will permanently delete your account and all associated data, including:
                </p>
                <ul className="text-sm text-gray-400 space-y-1 mb-4 ml-2">
                  <li>• All STAR stories and resumes</li>
                  <li>• Job application tracking history</li>
                  <li>• Coach session records</li>
                  <li>• Profile and settings</li>
                </ul>
                <p className="text-gray-400 text-sm font-semibold">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
