import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import StarStories from './pages/StarStories';
import ResumeBuilder from './pages/ResumeBuilder';
import Resumes from './pages/Resumes';
import ResumeRefinement from './pages/ResumeRefinement';
import ResumeTemplates from './pages/ResumeTemplates';
import ResumeVersions from './pages/ResumeVersions';
import ATSOptimization from './pages/ATSOptimization';
import Jobs from './pages/Jobs';
import JobTracking from './pages/JobTracking';
import JobMatchExplorer from './pages/JobMatchExplorer';
import ApplicationDetail from './pages/ApplicationDetail';
import CoverLetterGenerator from './pages/CoverLetterGenerator';
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
import AIResumeChat from './pages/AIResumeChat';
import STARMemoryBank from './pages/STARMemoryBank';
import AutomatedResumeGen from './pages/AutomatedResumeGen';
import AIInterviewPrep from './pages/AIInterviewPrep';
import HelpCenter from './pages/HelpCenter';
import VideoTutorials from './components/VideoTutorials';
import BillingPortal from './pages/BillingPortal';
import PaymentReceipt from './pages/PaymentReceipt';
import PrivacyDashboard from './pages/PrivacyDashboard';
import CredentialVerification from './pages/coach/CredentialVerification';
import DigitalIDVerification from './pages/coach/DigitalIDVerification';
import ProfileCreationWizard from './pages/coach/ProfileCreationWizard';
import CoachProfileEditor from './pages/coach/CoachProfileEditor';
import ClientOverview from './pages/coach/ClientOverview';
import SharedWorkspace from './pages/coach/SharedWorkspace';
import PortfolioBuilder from './pages/coach/PortfolioBuilder';
import PromotionCoaching from './pages/coaching/PromotionCoaching';
import SalaryNegotiator from './pages/coaching/SalaryNegotiator';
import SessionBooking from './pages/SessionBooking';
import SessionPrep from './pages/SessionPrep';
import SessionFollowup from './pages/SessionFollowup';
import NetworkingHub from './pages/networking/NetworkingHub';
import MyNetwork from './pages/networking/MyNetwork';
import ConnectionRequests from './pages/networking/ConnectionRequests';
import SocialFeed from './pages/networking/SocialFeed';
import CreatePost from './pages/networking/CreatePost';
import Groups from './pages/networking/Groups';function App() {
import KnowledgeHub from './pages/knowledge/KnowledgeHub';
import NotesHub from './pages/knowledge/NotesHub';
import DocumentManager from './pages/knowledge/DocumentManager';
import KnowledgeGraph from './pages/knowledge/KnowledgeGraph';
import AICommandCenter from './pages/admin/AICommandCenter';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import Roadmap from './pages/Roadmap';
function App() {  return (
// Career Development Pages
import CareerInsights from './pages/career/CareerInsights';
import CareerTimeline from './pages/career/CareerTimeline';
import Certificates from './pages/career/Certificates';
import SkillGapAnalysis from './pages/career/SkillGapAnalysis';
import SkillProgression from './pages/career/SkillProgression';
// Learning Pages
import LearningJourney from './pages/learning/LearningJourney';
import RecommendedPaths from './pages/learning/RecommendedPaths';
import CourseDetail from './pages/learning/CourseDetail';
import CourseProgress from './pages/learning/CourseProgress';
function App() {
return (    <Routes>
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
        path="/resume-refinement"
        element={
          <>
            <SignedIn>
              <ResumeRefinement />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/resume-templates"
        element={
          <>
            <SignedIn>
              <ResumeTemplates />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/resume-versions"
        element={
          <>
            <SignedIn>
              <ResumeVersions />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/ats-optimization"
        element={
          <>
            <SignedIn>
              <ATSOptimization />
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
        path="/jobs/tracking"
        element={
          <>
            <SignedIn>
              <JobTracking />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/jobs/explore"
        element={
          <>
            <SignedIn>
              <JobMatchExplorer />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/jobs/:jobId"
        element={
          <>
            <SignedIn>
              <ApplicationDetail />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/cover-letter"
        element={
          <>
            <SignedIn>
              <CoverLetterGenerator />
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
        path="/coach/profile-wizard"
        element={
          <>
            <SignedIn>
              <ProfileCreationWizard />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/coach/profile-editor"
        element={
          <>
            <SignedIn>
              <CoachProfileEditor />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/coach/clients/:clientId"
        element={
          <>
            <SignedIn>
              <ClientOverview />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/coach/workspace/:workspaceId"
        element={
          <>
            <SignedIn>
              <SharedWorkspace />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/coach/portfolio-builder"
        element={
          <>
            <SignedIn>
              <PortfolioBuilder />
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

<Route
path="/ai-resume-chat"
        element={
          <>
            <SignedIn>
              <AIResumeChat />

path="/coaching/promotion"
        element={
          <>
            <SignedIn>
              <PromotionCoaching />            </SignedIn>

path="/knowledge"
        element={
          <>
            <SignedIn>
              <KnowledgeHub />
            </SignedIn>            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
path="/star-memory-bank"
        element={
          <>
            <SignedIn>
              <STARMemoryBank />

path="/coaching/salary-negotiation"
        element={
          <>
            <SignedIn>
              <SalaryNegotiator />            </SignedIn>

path="/knowledge/notes"
        element={
          <>
            <SignedIn>
              <NotesHub />
            </SignedIn>            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
path="/resume-generator"
        element={
          <>
            <SignedIn>
              <AutomatedResumeGen />

path="/session-booking"
        element={
          <>
            <SignedIn>
              <SessionBooking />            </SignedIn>

path="/knowledge/notes/new"
        element={
          <>
            <SignedIn>
              <NotesHub />
            </SignedIn>            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
path="/interview-prep"
        element={
          <>
            <SignedIn>
              <AIInterviewPrep />

path="/session-prep"
        element={
          <>
            <SignedIn>
              <SessionPrep />            </SignedIn>

path="/knowledge/documents"
        element={
          <>
            <SignedIn>
              <DocumentManager />
            </SignedIn>            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
path="/help"
        element={
          <>
            <SignedIn>
              <HelpCenter />

path="/networking"
        element={
          <>
            <SignedIn>
              <NetworkingHub />            </SignedIn>

path="/knowledge/graph"
        element={
          <>
            <SignedIn>
              <KnowledgeGraph />
            </SignedIn>            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
path="/help/videos"
        element={
          <>
            <SignedIn>
              <VideoTutorials />

path="/networking/my-network"
        element={
          <>
            <SignedIn>
              <MyNetwork />            </SignedIn>

path="/admin"
        element={
          <>
            <SignedIn>
              <AdminDashboard />
            </SignedIn>            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
path="/billing"
        element={
          <>
            <SignedIn>
              <BillingPortal />

path="/networking/requests"
        element={
          <>
            <SignedIn>
              <ConnectionRequests />            </SignedIn>

path="/admin/ai-command"
        element={
          <>
            <SignedIn>
              <AICommandCenter />
            </SignedIn>            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
path="/receipt/:receiptId"
        element={
          <>
            <SignedIn>
              <PaymentReceipt />

path="/networking/feed"
        element={
          <>
            <SignedIn>
              <SocialFeed />            </SignedIn>

path="/admin/users"
        element={
          <>
            <SignedIn>
              <UserManagement />
            </SignedIn>            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
path="/privacy"
        element={
          <>
            <SignedIn>
              <PrivacyDashboard />

path="/networking/create-post"
        element={
          <>
            <SignedIn>
              <CreatePost />            </SignedIn>

path="/roadmap"
        element={
          <>
            <SignedIn>
              <Roadmap />
            </SignedIn>            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

<Route
path="/coach/credentials"
        element={
          <>
            <SignedIn>
              <CredentialVerification />

path="/networking/groups"
        element={
          <>
            <SignedIn>
              <Groups />            </SignedIn>

{/* Career Development Routes */}
      <Route
        path="/career/insights"
        element={
          <>
            <SignedIn>
              <CareerInsights />
            </SignedIn>            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

<<<<<<< HEAD
      <Route
        path="/coach/verify-id"
        element={
          <>
            <SignedIn>
              <DigitalIDVerification />

path="/session-followup"
        element={
          <>
            <SignedIn>
              <SessionFollowup />            </SignedIn>

<Route
        path="/career/timeline"
        element={
          <>
            <SignedIn>
              <CareerTimeline />
            </SignedIn>            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

>>>>>>> d6f06c33 (feat: UI Sprint 2 - Professional Networking & Social Features (P2))
=======      <Route path="*" element={<Navigate to="/" replace />} />

<Route
        path="/career/certificates"
        element={
          <>
            <SignedIn>
              <Certificates />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/career/skill-gap"
        element={
          <>
            <SignedIn>
              <SkillGapAnalysis />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/career/skills"
        element={
          <>
            <SignedIn>
              <SkillProgression />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      {/* Learning Routes */}
      <Route
        path="/learning"
        element={
          <>
            <SignedIn>
              <LearningJourney />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/learning/paths"
        element={
          <>
            <SignedIn>
              <RecommendedPaths />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/learning/course/:courseId"
        element={
          <>
            <SignedIn>
              <CourseDetail />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/learning/course/:courseId/progress"
        element={
          <>
            <SignedIn>
              <CourseProgress />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />    </Routes>
  );
}

export default App;
