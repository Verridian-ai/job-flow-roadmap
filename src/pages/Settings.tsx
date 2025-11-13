import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { User, Shield, Bell, Lock, Eye, EyeOff } from 'lucide-react';

export default function Settings() {
  const { user } = useUser();
  const userSettings = useQuery(api.users.getCurrentUser);
  const updatePrivacy = useMutation(api.users.updatePrivacy);
  
  const [showEmail, setShowEmail] = useState(userSettings?.privacySettings?.showEmail ?? true);
  const [showPhone, setShowPhone] = useState(userSettings?.privacySettings?.showPhone ?? false);
  const [allowMessages, setAllowMessages] = useState(userSettings?.privacySettings?.allowMessages ?? true);
  const [saving, setSaving] = useState(false);

  const handleSavePrivacy = async () => {
    setSaving(true);
    try {
      await updatePrivacy({
        showEmail,
        showPhone,
        allowMessages,
      });
      alert('Privacy settings updated successfully!');
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      alert('Failed to update settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-gray-400">Manage your account and privacy preferences</p>
            </div>

            {/* Profile Section */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-semibold">Profile Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">Name</label>
                  <div className="px-4 py-3 bg-gray-700 rounded-lg text-gray-300">
                    {user?.firstName} {user?.lastName}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">Email</label>
                  <div className="px-4 py-3 bg-gray-700 rounded-lg text-gray-300">
                    {user?.emailAddresses[0]?.emailAddress}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">User ID</label>
                  <div className="px-4 py-3 bg-gray-700 rounded-lg text-gray-300 font-mono text-sm">
                    {user?.id}
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-semibold">Privacy Settings</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    {showEmail ? <Eye className="w-5 h-5 text-gray-400" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                    <div>
                      <p className="font-medium">Show Email to Coaches</p>
                      <p className="text-sm text-gray-400">Allow coaches to see your email address</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowEmail(!showEmail)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      showEmail ? 'bg-yellow-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        showEmail ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    {showPhone ? <Eye className="w-5 h-5 text-gray-400" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                    <div>
                      <p className="font-medium">Show Phone Number</p>
                      <p className="text-sm text-gray-400">Allow coaches to see your phone number</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPhone(!showPhone)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      showPhone ? 'bg-yellow-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        showPhone ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Allow Direct Messages</p>
                      <p className="text-sm text-gray-400">Coaches can send you messages</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAllowMessages(!allowMessages)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      allowMessages ? 'bg-yellow-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        allowMessages ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <button
                  onClick={handleSavePrivacy}
                  disabled={saving}
                  className="w-full px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Privacy Settings'}
                </button>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-semibold">Security</h2>
              </div>
              
              <p className="text-gray-400 mb-4">
                Your account is secured by Clerk. To manage your password and authentication settings,
                visit your Clerk account dashboard.
              </p>
              
              <a
                href="https://accounts.clerk.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                Manage Security Settings
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
