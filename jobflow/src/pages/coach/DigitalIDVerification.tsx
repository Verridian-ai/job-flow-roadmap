import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Shield, CheckCircle, Clock, XCircle, ArrowLeft, AlertCircle, Camera } from 'lucide-react';
import Navbar from '../../components/Navbar';

interface IDVerification {
  status: 'not_started' | 'pending' | 'verified' | 'rejected';
  documentType?: 'passport' | 'drivers_license' | 'national_id';
  submittedDate?: string;
  verifiedDate?: string;
  rejectionReason?: string;
  documentFrontUrl?: string;
  documentBackUrl?: string;
}

export default function DigitalIDVerification() {
  const [verification, setVerification] = useState<IDVerification>({
    status: 'not_started'
  });

  const [selectedDocType, setSelectedDocType] = useState<'passport' | 'drivers_license' | 'national_id'>('drivers_license');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleFrontFileUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    setFrontFile(file);
  };

  const handleBackFileUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    setBackFile(file);
  };

  const handleSubmitVerification = () => {
    if (!frontFile) {
      alert('Please upload the front of your ID document');
      return;
    }

    if (selectedDocType !== 'passport' && !backFile) {
      alert('Please upload the back of your ID document');
      return;
    }

    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    // TODO: Implement actual ID verification submission
    console.log('Submitting ID verification:', {
      documentType: selectedDocType,
      frontFile,
      backFile
    });

    setVerification({
      status: 'pending',
      documentType: selectedDocType,
      submittedDate: new Date().toISOString()
    });

    alert('ID verification submitted! We will review it within 24-48 hours.');
  };

  const getStatusBadge = () => {
    switch (verification.status) {
      case 'verified':
        return (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-400 mb-1">Identity Verified</p>
              <p className="text-sm text-gray-300">
                Your identity was verified on{' '}
                {verification.verifiedDate &&
                  new Date(verification.verifiedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
              </p>
            </div>
          </div>
        );
      case 'pending':
        return (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
            <Clock className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-400 mb-1">Verification Pending</p>
              <p className="text-sm text-gray-300">
                We're reviewing your documents. This typically takes 24-48 hours. We'll email you once complete.
              </p>
            </div>
          </div>
        );
      case 'rejected':
        return (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
            <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-400 mb-1">Verification Rejected</p>
              <p className="text-sm text-gray-300 mb-2">
                {verification.rejectionReason || 'Unable to verify your identity with the provided documents.'}
              </p>
              <button
                onClick={() => setVerification({ status: 'not_started' })}
                className="text-sm text-red-400 hover:text-red-300 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8 max-w-4xl">
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
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-10 h-10 text-yellow-500" />
            <h1 className="text-4xl font-bold">Identity Verification</h1>
          </div>
          <p className="text-gray-400">
            Verify your identity to build trust with clients and unlock all coach features
          </p>
        </div>

        {/* Status Banner */}
        {verification.status !== 'not_started' && (
          <div className="mb-8">{getStatusBadge()}</div>
        )}

        {/* Why Verify Section */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-8">
          <div className="flex gap-3">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">Why verify your identity?</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Increase client trust with a verified badge on your profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Access higher earning potential with premium client features</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Comply with platform security and regulatory requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>All information is encrypted and handled securely</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Verification Form */}
        {verification.status === 'not_started' && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Submit Verification Documents</h2>

            {/* Document Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Select Document Type</label>
              <div className="grid md:grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedDocType('drivers_license')}
                  className={`p-4 rounded-lg border-2 transition ${
                    selectedDocType === 'drivers_license'
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <Camera className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p className="font-medium text-sm">Driver's License</p>
                </button>
                <button
                  onClick={() => setSelectedDocType('passport')}
                  className={`p-4 rounded-lg border-2 transition ${
                    selectedDocType === 'passport'
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <Camera className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p className="font-medium text-sm">Passport</p>
                </button>
                <button
                  onClick={() => setSelectedDocType('national_id')}
                  className={`p-4 rounded-lg border-2 transition ${
                    selectedDocType === 'national_id'
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <Camera className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p className="font-medium text-sm">National ID</p>
                </button>
              </div>
            </div>

            {/* Front Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                {selectedDocType === 'passport' ? 'Passport Photo Page' : 'Front of Document'}
              </label>
              <label className="block">
                <div className={`p-8 rounded-lg border-2 border-dashed transition cursor-pointer ${
                  frontFile
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-gray-600 hover:border-yellow-500'
                }`}>
                  <div className="text-center">
                    {frontFile ? (
                      <>
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                        <p className="font-medium text-green-400 mb-1">File uploaded</p>
                        <p className="text-sm text-gray-400">{frontFile.name}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setFrontFile(null);
                          }}
                          className="text-sm text-red-400 hover:text-red-300 mt-2"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="font-medium mb-1">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-400">PNG, JPG or PDF (max 10MB)</p>
                      </>
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFrontFileUpload(file);
                  }}
                />
              </label>
            </div>

            {/* Back Upload (not for passport) */}
            {selectedDocType !== 'passport' && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Back of Document</label>
                <label className="block">
                  <div className={`p-8 rounded-lg border-2 border-dashed transition cursor-pointer ${
                    backFile
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-600 hover:border-yellow-500'
                  }`}>
                    <div className="text-center">
                      {backFile ? (
                        <>
                          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                          <p className="font-medium text-green-400 mb-1">File uploaded</p>
                          <p className="text-sm text-gray-400">{backFile.name}</p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setBackFile(null);
                            }}
                            className="text-sm text-red-400 hover:text-red-300 mt-2"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="font-medium mb-1">Click to upload or drag and drop</p>
                          <p className="text-sm text-gray-400">PNG, JPG or PDF (max 10MB)</p>
                        </>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleBackFileUpload(file);
                    }}
                  />
                </label>
              </div>
            )}

            {/* Terms Agreement */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-700 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-gray-900"
                />
                <span className="text-sm text-gray-300">
                  I certify that the information provided is accurate and I consent to Jobflow verifying my identity.
                  I understand that my data will be processed securely in accordance with our{' '}
                  <a href="#" className="text-yellow-500 hover:text-yellow-400">Privacy Policy</a>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmitVerification}
                disabled={!frontFile || (!backFile && selectedDocType !== 'passport') || !agreeToTerms}
                className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit for Verification
              </button>
            </div>
          </div>
        )}

        {/* Security Info */}
        <div className="mt-8 text-sm text-gray-400 text-center">
          <Shield className="w-5 h-5 inline mr-2 text-gray-500" />
          Your documents are encrypted and stored securely. We use industry-standard verification processes.
        </div>
      </div>
    </div>
  );
}
