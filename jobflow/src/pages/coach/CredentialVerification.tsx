import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, CheckCircle, Clock, XCircle, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Navbar from '../../components/Navbar';

interface Credential {
  id: string;
  type: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  status: 'pending' | 'verified' | 'rejected';
  documentUrl?: string;
  rejectionReason?: string;
}

export default function CredentialVerification() {
  const [credentials, setCredentials] = useState<Credential[]>([
    {
      id: '1',
      type: 'Certification',
      title: 'Certified Career Coach (CCC)',
      issuer: 'International Coach Federation',
      issueDate: '2023-01-15',
      credentialId: 'ICF-2023-12345',
      status: 'verified'
    },
    {
      id: '2',
      type: 'Degree',
      title: 'Master of Business Administration',
      issuer: 'Stanford University',
      issueDate: '2020-06-15',
      status: 'verified'
    },
    {
      id: '3',
      type: 'Certification',
      title: 'Professional Resume Writer',
      issuer: 'Professional Association of Resume Writers',
      issueDate: '2024-03-20',
      expiryDate: '2026-03-20',
      status: 'pending'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCredential, setNewCredential] = useState({
    type: 'Certification',
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: ''
  });

  const handleFileUpload = (credentialId: string, file: File) => {
    // TODO: Implement file upload to storage
    console.log('Uploading file for credential:', credentialId, file);
    alert('File upload would be implemented here');
  };

  const handleAddCredential = () => {
    if (!newCredential.title || !newCredential.issuer || !newCredential.issueDate) {
      alert('Please fill in all required fields');
      return;
    }

    const credential: Credential = {
      id: Date.now().toString(),
      ...newCredential,
      status: 'pending'
    };

    setCredentials([...credentials, credential]);
    setNewCredential({
      type: 'Certification',
      title: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: ''
    });
    setShowAddModal(false);
  };

  const handleDeleteCredential = (id: string) => {
    if (confirm('Are you sure you want to delete this credential?')) {
      setCredentials(credentials.filter(c => c.id !== id));
    }
  };

  const getStatusBadge = (status: Credential['status']) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-full">
            <CheckCircle className="w-4 h-4" />
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-semibold rounded-full">
            <Clock className="w-4 h-4" />
            Pending Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 text-sm font-semibold rounded-full">
            <XCircle className="w-4 h-4" />
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Back Link */}
        <Link
          to="/coach/onboarding"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile Setup
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Credential Verification</h1>
          <p className="text-gray-400">
            Upload and verify your professional certifications, degrees, and licenses to build trust with clients
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8">
          <div className="flex gap-3">
            <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-400 font-semibold mb-1">Why verify credentials?</p>
              <p className="text-gray-300">
                Verified credentials appear on your public profile with a verification badge, helping clients trust
                your expertise. We typically review submissions within 2-3 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Add Credential Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Credential
          </button>
        </div>

        {/* Credentials List */}
        <div className="space-y-4">
          {credentials.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 border border-gray-700 rounded-lg">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No credentials added yet</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                Add Your First Credential
              </button>
            </div>
          ) : (
            credentials.map((credential) => (
              <div key={credential.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="text-xl font-bold">{credential.title}</h3>
                      {getStatusBadge(credential.status)}
                    </div>
                    <p className="text-gray-400 mb-1">{credential.issuer}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>
                        Issued: {new Date(credential.issueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      {credential.expiryDate && (
                        <span>
                          Expires: {new Date(credential.expiryDate).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                    {credential.credentialId && (
                      <p className="text-sm text-gray-500 mt-1">
                        Credential ID: {credential.credentialId}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteCredential(credential.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {credential.status === 'rejected' && credential.rejectionReason && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded p-3 mb-4">
                    <p className="text-sm text-red-400">
                      <strong>Rejection Reason:</strong> {credential.rejectionReason}
                    </p>
                  </div>
                )}

                {credential.status === 'pending' && (
                  <div className="mt-4">
                    <label className="block">
                      <div className="flex items-center gap-2 px-4 py-3 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg hover:border-yellow-500 cursor-pointer transition">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-300">
                          {credential.documentUrl ? 'Replace document' : 'Upload supporting document (PDF, JPG, PNG)'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(credential.id, file);
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Credential Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Add Credential</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <select
                  value={newCredential.type}
                  onChange={(e) => setNewCredential({ ...newCredential, type: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                >
                  <option value="Certification">Certification</option>
                  <option value="Degree">Degree</option>
                  <option value="License">License</option>
                  <option value="Training">Training</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={newCredential.title}
                  onChange={(e) => setNewCredential({ ...newCredential, title: e.target.value })}
                  placeholder="e.g., Certified Professional Coach"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Issuing Organization *</label>
                <input
                  type="text"
                  value={newCredential.issuer}
                  onChange={(e) => setNewCredential({ ...newCredential, issuer: e.target.value })}
                  placeholder="e.g., International Coach Federation"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white placeholder-gray-400"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Issue Date *</label>
                  <input
                    type="date"
                    value={newCredential.issueDate}
                    onChange={(e) => setNewCredential({ ...newCredential, issueDate: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date (optional)</label>
                  <input
                    type="date"
                    value={newCredential.expiryDate}
                    onChange={(e) => setNewCredential({ ...newCredential, expiryDate: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Credential ID (optional)</label>
                <input
                  type="text"
                  value={newCredential.credentialId}
                  onChange={(e) => setNewCredential({ ...newCredential, credentialId: e.target.value })}
                  placeholder="e.g., ICF-2023-12345"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCredential}
                className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                Add Credential
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
