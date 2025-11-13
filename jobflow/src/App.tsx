import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import StarStories from './pages/StarStories';
import ResumeBuilder from './pages/ResumeBuilder';
import Resumes from './pages/Resumes';
import Jobs from './pages/Jobs';
import CoachDirectory from './pages/CoachDirectory';
import CoachProfile from './pages/CoachProfile';
import CoachOnboarding from './pages/CoachOnboarding';
import Marketplace from './pages/Marketplace';
import Sessions from './pages/Sessions';
import Settings from './pages/Settings';
import CoachDashboard from './pages/CoachDashboard';
import Login from './pages/Login';
import SSOOptions from './pages/SSOOptions';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PlanSelect from './pages/PlanSelect';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/sso-options" element={<SSOOptions />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Pricing & Payment Routes */}
      <Route path="/pricing" element={<PlanSelect />} />

      <Route
        path="/dashboard"
        element={
          <>
            <SignedIn>
              <Dashboard />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      
      <Route
        path="/coach-dashboard"
        element={
          <>
            <SignedIn>
              <CoachDashboard />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      
      <Route
        path="/star-stories"
        element={
          <>
            <SignedIn>
              <StarStories />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      
      <Route
        path="/resume-builder"
        element={
          <>
            <SignedIn>
              <ResumeBuilder />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      
      <Route
        path="/resumes"
        element={
          <>
            <SignedIn>
              <Resumes />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      
      <Route
        path="/jobs"
        element={
          <>
            <SignedIn>
              <Jobs />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      
      <Route
        path="/coaches"
        element={
          <>
            <SignedIn>
              <CoachDirectory />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      
      <Route
        path="/coaches/:coachId"
        element={
          <>
            <SignedIn>
              <CoachProfile />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/coach/onboarding"
        element={
          <>
            <SignedIn>
              <CoachOnboarding />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/marketplace"
        element={
          <>
            <SignedIn>
              <Marketplace />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      
      <Route
        path="/sessions"
        element={
          <>
            <SignedIn>
              <Sessions />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      
      <Route
        path="/settings"
        element={
          <>
            <SignedIn>
              <Settings />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
