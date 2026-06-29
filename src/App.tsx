import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import HowItWorksSection from "./components/HowItWorksSection";
import RevenueSection from "./components/RevenueSection";
import LegalModal from "./components/LegalModal";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import TutorOnboarding from "./pages/TutorOnboarding";
import GuardianDashboard from "./pages/GuardianDashboard";
import JobPostCreate from "./pages/JobPostCreate";
import JobBoard from "./pages/JobBoard";
import Feed from "./pages/Feed";
import ProfilePage from "./pages/ProfilePage";

// Supabase helper
import { Profile, getLocalCurrentUser, setLocalCurrentUser, isSupabaseConfigured } from "./lib/supabase";
import { Info, HelpCircle, AlertCircle, X } from "lucide-react";
import { LanguageProvider, useLanguage } from "./hooks/useLanguage";
import LanguageSwitcher from "./components/LanguageSwitcher";
import PageLoader from "./components/PageLoader";

export default function App() {
  // Routes can be: 'home' | 'login' | 'register' | 'verify-otp' | 'forgot-password' | 'dashboard'
  const [currentRoute, setCurrentRoute] = useState<string>("home");
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  
  // Registration payload passed onto OTP Verify
  const [regPayload, setRegPayload] = useState<any | null>(null);
  
  // Legal terms modals
  const [activeLegal, setActiveLegal] = useState<"privacy" | "terms" | "refund" | null>(null);
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  const { t } = useLanguage();

  // Load user session on mount
  useEffect(() => {
    const user = getLocalCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    // Sync state with URL hash
    const handleHashChange = () => {
      const hashFull = window.location.hash;
      const hash = hashFull.split('?')[0];
      
      if (hash === "#/login") {
        setCurrentRoute("login");
      } else if (hash === "#/register") {
        setCurrentRoute("register");
      } else if (hash === "#/verify-otp") {
        setCurrentRoute("verify-otp");
      } else if (hash === "#/forgot-password") {
        setCurrentRoute("forgot-password");
      } else if (hash === "#/job-board") {
        const u = getLocalCurrentUser();
        if (u) setCurrentUser(u);
        setCurrentRoute("job-board");
      } else if (hash === "#/dashboard" || hash === "#/feed" || hash === "#/tutor/onboarding" || hash === "#/guardian/dashboard" || hash === "#/guardian/post/new" || hash.startsWith("#/profile")) {
        const u = getLocalCurrentUser();
        if (u) {
          setCurrentUser(u);
          if (hash === "#/feed") setCurrentRoute("feed");
          else if (hash === "#/tutor/onboarding") setCurrentRoute("tutor/onboarding");
          else if (hash.startsWith("#/profile")) setCurrentRoute(hash.replace("#/", ""));
          else if (hash === "#/guardian/dashboard") setCurrentRoute("guardian/dashboard");
          else if (hash === "#/guardian/post/new") setCurrentRoute("guardian/post/new");
          else setCurrentRoute("dashboard");
        } else {
          setCurrentRoute("login");
        }
      } else {
        setCurrentRoute("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    // Trigger once on load
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (routePath: string) => {
    const route = routePath.split('?')[0];
    setCurrentRoute(route);
    // Update window hash
    if (routePath === "home") {
      window.location.hash = "/";
    } else {
      window.location.hash = `#/${routePath}`;
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    setLocalCurrentUser(null);
    setCurrentUser(null);
    navigateTo("home");
  };

  const handleLoginSuccess = (user: Profile) => {
    setCurrentUser(user);
    if (user.role === 'tutor') {
      navigateTo("tutor/onboarding");
    } else {
      navigateTo("guardian/dashboard");
    }
  };

  const handleInitiateOtpVerify = (payload: any) => {
    setRegPayload(payload);
    navigateTo("verify-otp");
  };

  const handleVerifySuccess = (user: Profile) => {
    setCurrentUser(user);
    if (user.role === 'tutor') {
      navigateTo("tutor/onboarding");
    } else {
      navigateTo("guardian/dashboard");
    }
  };

  return (
    <div className="relative min-h-screen bg-navy-bg text-navy flex flex-col justify-between selection:bg-yellow/30 selection:text-navy">
      <PageLoader />
      <LanguageSwitcher />
      {/* Dynamic Demo Mode Ribbon Banner (Polite and helpful indicator) */}
      {!isSupabaseConfigured && showDemoBanner && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 max-w-sm bg-navy border-2 border-yellow text-white rounded-2xl p-4 shadow-2xl z-50 flex items-start gap-3 animate-fadeInUp">
          <div className="p-1.5 rounded-lg bg-yellow/10 text-yellow mt-0.5 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <strong className="text-yellow text-xs font-bold uppercase tracking-wider">{t("demo_title")}</strong>
              <button
                onClick={() => setShowDemoBanner(false)}
                className="text-white/60 hover:text-white p-0.5"
                title={t("hide_banner")}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-white/80 leading-relaxed">
              {t("demo_desc")}
            </p>
          </div>
        </div>
      )}

      {/* Main Page Rendering Router */}
      {currentRoute === "home" && (
        <>
          <Navbar
            currentRoute={currentRoute}
            navigateTo={navigateTo}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
          
          <main className="flex-grow pt-16">
            <HeroSection
              onJoinAsTutor={() => navigateTo("register?role=tutor")}
              onSearchTutor={() => navigateTo("register?role=guardian")}
            />
            <StatsSection />
            <HowItWorksSection />
            <RevenueSection />
          </main>

          <Footer onShowModal={(type) => setActiveLegal(type)} />
        </>
      )}

      {currentRoute === "login" && (
        <Login
          onBackToHome={() => navigateTo("home")}
          navigateTo={navigateTo}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentRoute === "register" && (
        <Register
          onBackToHome={() => navigateTo("home")}
          navigateTo={navigateTo}
          onInitiateOtpVerify={handleInitiateOtpVerify}
        />
      )}

      {currentRoute === "verify-otp" && (
        <VerifyOtp
          onBackToRegister={() => navigateTo("register")}
          navigateTo={navigateTo}
          userPayload={regPayload}
          onVerifySuccess={handleVerifySuccess}
        />
      )}

      {currentRoute === "forgot-password" && (
        <ForgotPassword
          onBackToLogin={() => navigateTo("login")}
          navigateTo={navigateTo}
        />
      )}

      {currentRoute === "job-board" && (
        <>
          <Navbar
            currentRoute={currentRoute}
            navigateTo={navigateTo}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
          <main className="flex-grow pt-16">
            <JobBoard 
              currentUser={currentUser} 
              navigateTo={navigateTo} 
            />
          </main>
          <Footer onShowModal={(type) => setActiveLegal(type)} />
        </>
      )}

      {(currentRoute === "dashboard" || currentRoute === "feed" || currentRoute === "tutor/onboarding" || currentRoute === "guardian/dashboard" || currentRoute === "guardian/post/new" || currentRoute.startsWith("profile")) && currentUser && (
        <>
          <Navbar
            currentRoute={currentRoute}
            navigateTo={navigateTo}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
          <main className="flex-grow pt-16">
            {currentRoute === "tutor/onboarding" ? (
              <TutorOnboarding 
                currentUser={currentUser}
                onComplete={() => navigateTo("job-board")}
              />
            ) : currentRoute === "feed" ? (
              <Feed 
                currentUser={currentUser}
                navigateTo={navigateTo}
              />
            ) : currentRoute === "guardian/dashboard" ? (
              <GuardianDashboard 
                currentUser={currentUser}
                navigateTo={navigateTo}
                onLogout={handleLogout}
              />
            ) : currentRoute.startsWith("profile") ? (
              <ProfilePage
                currentUser={currentUser}
                profileId={currentRoute.split("/")[1] || currentUser.id}
                onLogout={handleLogout}
                onUserUpdate={setCurrentUser}
              />
            ) : currentRoute === "guardian/post/new" ? (
              <JobPostCreate 
                currentUser={currentUser}
                navigateTo={navigateTo}
              />
            ) : (
              <Dashboard
                currentUser={currentUser}
                onLogout={handleLogout}
                navigateTo={navigateTo}
              />
            )}
          </main>
          <Footer onShowModal={(type) => setActiveLegal(type)} />
        </>
      )}

      {/* Legal Terms Modal Pop-up */}
      <LegalModal
        type={activeLegal}
        onClose={() => setActiveLegal(null)}
      />
    </div>
  );
}
