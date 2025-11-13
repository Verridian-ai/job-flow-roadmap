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
import CoachProfileBuilder from './pages/CoachProfileBuilder';
import Marketplace from './pages/Marketplace';
import Sessions from './pages/Sessions';
import Settings from './pages/Settings';
import CoachDashboard from './pages/CoachDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      
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
        path="/coach/profile-builder"
        element={
          <>
            <SignedIn>
              <CoachProfileBuilder />
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
