import { useState, useEffect } from "react";
import { Menu, X, LogOut, User, ShieldCheck } from "lucide-react";
import { Profile } from "../lib/supabase";
import { useLanguage } from "../hooks/useLanguage";

interface NavbarProps {
  currentRoute: string;
  navigateTo: (route: string) => void;
  currentUser: Profile | null;
  onLogout: () => void;
}

export default function Navbar({ currentRoute, navigateTo, currentUser, onLogout }: NavbarProps) {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      id="poraboo-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-navy/10 py-3"
          : "bg-white py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            id="navbar-logo-container"
            onClick={() => navigateTo("home")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span id="navbar-logo" className="logo-font text-2xl tracking-wider text-navy transition-colors">
              PORABOO
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-medium bg-teal/10 text-teal rounded-full">
              {t("nav_badge")}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div id="navbar-desktop-menu" className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigateTo("home")}
              className={`text-sm font-medium transition-colors ${
                currentRoute === "home" ? "text-navy font-semibold" : "text-text-muted hover:text-navy"
              }`}
            >
              {t("nav_home")}
            </button>
            <button
              onClick={() => navigateTo("feed")}
              className={`text-sm font-medium transition-colors ${
                currentRoute === "feed" ? "text-navy font-semibold" : "text-text-muted hover:text-navy"
              }`}
            >{t("nav_feed")}</button>
            <a
              href="#how-it-works"
              onClick={(e) => {
                if (currentRoute !== "home") {
                  e.preventDefault();
                  navigateTo("home");
                  setTimeout(() => {
                    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              }}
              className="text-sm font-medium text-text-muted hover:text-navy transition-colors"
            >
              {t("nav_how_it_works")}
            </a>
            <a
              href="#revenue-model"
              onClick={(e) => {
                if (currentRoute !== "home") {
                  e.preventDefault();
                  navigateTo("home");
                  setTimeout(() => {
                    document.getElementById("revenue-model")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              }}
              className="text-sm font-medium text-text-muted hover:text-navy transition-colors"
            >
              {t("nav_model")}
            </a>

            <div className="h-4 w-[1px] bg-navy/20"></div>

            {currentUser ? (
              <div className="flex items-center gap-4">
                <div 
                  onClick={() => navigateTo(currentUser.role === 'tutor' ? 'tutor/onboarding' : 'guardian/dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy/5 text-navy border border-navy/10 hover:bg-navy/10 transition-all cursor-pointer"
                >
                  <User className="w-4 h-4 text-navy" />
                  <span className="text-xs font-semibold">{currentUser.full_name}</span>
                  <span className="text-[9px] bg-teal text-white px-1.5 py-0.2 rounded-full uppercase">
                    {currentUser.role === "tutor" ? t("nav_tutor") : t("nav_guardian")}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  title={t("nav_logout")}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  id="nav-btn-login"
                  onClick={() => navigateTo("login")}
                  className="px-5 py-2 text-sm font-medium border border-navy text-navy rounded-full hover:bg-navy/5 transition-all duration-200"
                >
                  {t("nav_login")}
                </button>
                <button
                  id="nav-btn-register"
                  onClick={() => navigateTo("register")}
                  className="px-6 py-2 text-sm font-semibold bg-yellow text-navy rounded-full hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  {t("nav_get_started")}
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center">
            {currentUser && (
              <div className="mr-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy/5 text-navy text-xs border border-navy/10">
                <span className="max-w-[70px] truncate font-medium">{currentUser.full_name}</span>
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-navy hover:bg-navy-bg rounded-lg focus:outline-none transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="navbar-mobile-menu" className="md:hidden bg-white border-t border-navy/10 animate-fadeInUp">
          <div className="px-4 pt-2 pb-6 space-y-3 shadow-inner">
            <button
              onClick={() => {
                navigateTo("home");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-navy hover:bg-navy-bg"
            >
              {t("nav_home")}
            </button>
            <button
              onClick={() => {
                navigateTo("feed");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-text-muted hover:bg-navy-bg hover:text-navy"
            >{t("nav_feed")}</button>
            <a
              href="#how-it-works"
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                if (currentRoute !== "home") {
                  e.preventDefault();
                  navigateTo("home");
                  setTimeout(() => {
                    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              }}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-text-muted hover:bg-navy-bg hover:text-navy"
            >
              {t("nav_how_it_works")}
            </a>
            <a
              href="#revenue-model"
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                if (currentRoute !== "home") {
                  e.preventDefault();
                  navigateTo("home");
                  setTimeout(() => {
                    document.getElementById("revenue-model")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              }}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-text-muted hover:bg-navy-bg hover:text-navy"
            >
              {t("nav_model")}
            </a>

            <div className="h-[1px] bg-navy/10 my-2"></div>

            {currentUser ? (
              <div className="space-y-3 pt-1">
                <button
                  onClick={() => {
                    navigateTo(currentUser.role === 'tutor' ? 'tutor/onboarding' : 'guardian/dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg bg-navy/5 text-navy font-semibold text-sm"
                >
                  <User className="w-4 h-4" />
                  <span>{t("nav_my_dashboard")} ({currentUser.role === "tutor" ? t("nav_tutor") : t("nav_guardian")})</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 font-medium text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t("nav_logout")}</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    navigateTo("login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center font-medium border border-navy text-navy rounded-full hover:bg-navy/5 transition-all"
                >
                  {t("nav_login")}
                </button>
                <button
                  onClick={() => {
                    navigateTo("register");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center font-semibold bg-yellow text-navy rounded-full shadow-md hover:bg-yellow/90 transition-all"
                >
                  {t("nav_get_started")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
