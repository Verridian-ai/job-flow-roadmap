import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Shield, CheckCircle2, ExternalLink } from 'lucide-react';

interface SecurityInfo {
  stripeConnected: boolean;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  coachCodeAccepted: boolean;
  backgroundCheckConsent: boolean;
}

export default function ProfileCreationSecurity() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SecurityInfo>({
    stripeConnected: false,
    termsAccepted: false,
    privacyAccepted: false,
    coachCodeAccepted: false,
    backgroundCheckConsent: false,
  });
  const [isConnectingStripe, setIsConnectingStripe] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('coachProfileSecurity');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleStripeConnect = async () => {
    setIsConnectingStripe(true);
    // In production, this would redirect to Stripe Connect OAuth
    // For now, simulate the connection
    setTimeout(() => {
      setFormData(prev => ({ ...prev, stripeConnected: true }));
      setIsConnectingStripe(false);
    }, 1500);
  };

  const handleCheckboxChange = (field: keyof SecurityInfo) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleNext = () => {
    localStorage.setItem('coachProfileSecurity', JSON.stringify(formData));
    navigate('/coach/profile-creation/review');
  };

  const handleBack = () => {
    localStorage.setItem('coachProfileSecurity', JSON.stringify(formData));
    navigate('/coach/profile-creation/preferences');
  };

  const handleSaveAndExit = () => {
    localStorage.setItem('coachProfileSecurity', JSON.stringify(formData));
    navigate('/coach-dashboard');
  };

  const isValid = formData.stripeConnected && formData.termsAccepted && formData.privacyAccepted && formData.coachCodeAccepted;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between py-6 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 text-yellow-500">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fillRule="evenodd"></path>
                <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight">CareerDev AI</h2>
          </div>
          <button
            onClick={handleSaveAndExit}
            className="px-4 py-2 text-sm font-medium text-gray-400 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 hover:text-white transition-colors"
          >
            Save and exit
          </button>
        </header>

        {/* Main Content */}
        <main className="py-8">
          <div className="max-w-2xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-10">
              <p className="mb-2 text-sm font-medium text-gray-400">Step 5 of 6</p>
              <div className="flex gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500/30"></div>
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500/30"></div>
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500/30"></div>
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500/30"></div>
                <div className="h-1.5 flex-1 rounded-full bg-yellow-500"></div>
                <div className="h-1.5 flex-1 rounded-full bg-gray-700"></div>
              </div>
            </div>

            {/* Page Title */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white">Security & Consent</h1>
              <p className="mt-2 text-base text-gray-400">Set up payment processing and review important agreements.</p>
            </div>

            {/* Form Card */}
            <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-6 sm:p-8">
              <form className="space-y-8">
                {/* Stripe Connect */}
                <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">Connect Stripe Account</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        To receive payments from your clients, you need to connect a Stripe account. Stripe is a secure payment processor that handles all transactions.
                      </p>
                      {formData.stripeConnected ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="text-sm font-medium">Stripe account connected</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleStripeConnect}
                          disabled={isConnectingStripe}
                          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isConnectingStripe ? 'Connecting...' : 'Connect with Stripe'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Legal Agreements */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Legal Agreements*</h3>
                  <p className="text-sm text-gray-400">
                    Please review and accept the following agreements to continue.
                  </p>

                  {/* Terms of Service */}
                  <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={() => handleCheckboxChange('termsAccepted')}
                        className="mt-1 h-4 w-4 rounded border-gray-600 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-gray-900 bg-gray-800"
                      />
                      <label htmlFor="termsAccepted" className="flex-1 text-sm">
                        <span className="text-white">I accept the </span>
                        <a href="#" className="text-yellow-500 hover:text-yellow-400 inline-flex items-center gap-1">
                          Terms of Service
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </label>
                    </div>
                  </div>

                  {/* Privacy Policy */}
                  <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="privacyAccepted"
                        checked={formData.privacyAccepted}
                        onChange={() => handleCheckboxChange('privacyAccepted')}
                        className="mt-1 h-4 w-4 rounded border-gray-600 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-gray-900 bg-gray-800"
                      />
                      <label htmlFor="privacyAccepted" className="flex-1 text-sm">
                        <span className="text-white">I accept the </span>
                        <a href="#" className="text-yellow-500 hover:text-yellow-400 inline-flex items-center gap-1">
                          Privacy Policy
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </label>
                    </div>
                  </div>

                  {/* Coach Code of Conduct */}
                  <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="coachCodeAccepted"
                        checked={formData.coachCodeAccepted}
                        onChange={() => handleCheckboxChange('coachCodeAccepted')}
                        className="mt-1 h-4 w-4 rounded border-gray-600 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-gray-900 bg-gray-800"
                      />
                      <label htmlFor="coachCodeAccepted" className="flex-1 text-sm">
                        <span className="text-white">I accept the </span>
                        <a href="#" className="text-yellow-500 hover:text-yellow-400 inline-flex items-center gap-1">
                          Coach Code of Conduct
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <p className="text-gray-500 mt-1 text-xs">
                          This includes maintaining professional boundaries, confidentiality, and ethical coaching practices.
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Background Check Consent (Optional) */}
                  <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="backgroundCheckConsent"
                        checked={formData.backgroundCheckConsent}
                        onChange={() => handleCheckboxChange('backgroundCheckConsent')}
                        className="mt-1 h-4 w-4 rounded border-gray-600 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-gray-900 bg-gray-800"
                      />
                      <label htmlFor="backgroundCheckConsent" className="flex-1 text-sm">
                        <span className="text-white">I consent to a background check </span>
                        <span className="text-gray-400">(Optional, but recommended)</span>
                        <p className="text-gray-500 mt-1 text-xs">
                          Background-checked coaches receive a verified badge and typically attract more clients.
                        </p>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Information Box */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-400 mb-1">Your data is secure</h4>
                      <p className="text-xs text-gray-400">
                        We use industry-standard encryption and security practices to protect your information. Your payment details are securely stored by Stripe and never touch our servers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isValid}
                    className="flex items-center gap-2 px-6 py-3 text-base font-bold text-gray-900 bg-yellow-500 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next: Review & Confirm
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
