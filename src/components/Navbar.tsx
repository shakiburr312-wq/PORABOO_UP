import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import React, { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut, User, ShieldCheck, Bell, Settings, Home, Briefcase } from "lucide-react";
import { Profile } from "../lib/supabase";
import { useLanguage } from "../hooks/useLanguage";

interface NavbarProps {
  
  
  
  
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentRoute = location.pathname.substring(1) || 'home';
  const { currentUser, logout: onLogout } = useAuth();
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // For unauthenticated users: standard navbar
  if (!currentUser) {
    return (
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-md border-b border-navy/10 py-3" : "bg-white py-5"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer group">
              <span className="logo-font text-2xl tracking-wider text-[#1B2F6E] transition-colors">PORABOO</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => navigate("/")} className={`text-sm font-medium ${currentRoute === "home" ? "text-[#1B2F6E] font-semibold" : "text-gray-500 hover:text-[#1B2F6E]"}`}>{t("nav_home")}</button>
              <div className="h-4 w-[1px] bg-[#1B2F6E]/20"></div>
              <div className="flex items-center gap-3">
                <button onClick={() => navigate("/login")} className="px-5 py-2 text-sm font-medium border border-[#1B2F6E] text-[#1B2F6E] rounded-full hover:bg-navy/5">{t("nav_login")}</button>
                <button onClick={() => navigate("/register")} className="px-6 py-2 text-sm font-semibold bg-[#F5A623] text-[#1B2F6E] rounded-full hover:shadow-lg">{t("nav_get_started")}</button>
              </div>
            </div>
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-[#1B2F6E]">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-navy/10 shadow-lg px-4 py-6 flex flex-col gap-4">
             <button onClick={() => { setIsMobileMenuOpen(false); navigate("/"); }} className="text-left py-2 font-medium">Home</button>
             <button onClick={() => { setIsMobileMenuOpen(false); navigate("/login"); }} className="px-5 py-3 text-center border border-[#1B2F6E] text-[#1B2F6E] font-medium rounded-xl">Login</button>
             <button onClick={() => { setIsMobileMenuOpen(false); navigate("/register"); }} className="px-5 py-3 text-center bg-[#F5A623] text-[#1B2F6E] font-bold rounded-xl">Get Started</button>
          </div>
        )}
      </nav>
    );
  }

  // Authenticated Navbar
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-sm transition-all duration-300 py-2.5 px-4 md:px-8 border-b border-gray-200`}>
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          
          {/* LEFT: Logo */}
          <div onClick={() => navigate("/feed")} className="cursor-pointer">
            <span className="logo-font text-2xl tracking-wider text-[#1B2F6E]">PORABOO</span>
          </div>

          {/* CENTER: Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => navigate("/feed")} 
              className={`font-semibold text-[15px] transition-colors ${currentRoute === "feed" ? "text-[#1B2F6E]" : "text-gray-500 hover:text-[#1B2F6E]"}`}
            >
              ফিড
            </button>
            <button 
              onClick={() => navigate("/job-board")} 
              className={`font-semibold text-[15px] transition-colors ${currentRoute === "job-board" ? "text-[#1B2F6E]" : "text-gray-500 hover:text-[#1B2F6E]"}`}
            >
              জব বোর্ড
            </button>
          </div>

          {/* RIGHT: Notifications & Profile */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
              <Bell className="w-5 h-5" />
            </button>

            <div className="relative" ref={dropdownRef}>
              <div 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 cursor-pointer p-1 pr-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <img 
                  src={(currentUser as any).avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(currentUser.full_name) + "&background=1a365d&color=fff"} 
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  alt={currentUser.full_name}
                />
                <span className="hidden md:block text-sm font-semibold text-gray-800">{currentUser.full_name.split(' ')[0]}</span>
              </div>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                  <div className="p-3 border-b border-gray-100 flex items-center gap-3">
                     <img 
                      src={(currentUser as any).avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(currentUser.full_name) + "&background=1a365d&color=fff"} 
                      className="w-10 h-10 rounded-full object-cover"
                      alt={currentUser.full_name}
                    />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{currentUser.full_name}</p>
                      <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                    </div>
                  </div>
                  <div className="p-1">
                    <button onClick={() => { setIsProfileDropdownOpen(false); navigate("/profile"); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                      <User className="w-4 h-4" /> আমার প্রোফাইল
                    </button>
                    <button onClick={() => { setIsProfileDropdownOpen(false); navigate("/settings"); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                      <Settings className="w-4 h-4" /> সেটিংস
                    </button>
                    <div className="h-[1px] bg-gray-100 my-1"></div>
                    <button onClick={() => { setIsProfileDropdownOpen(false); onLogout(); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">
                      <LogOut className="w-4 h-4" /> লগআউট
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1B2F6E] text-white z-50 flex justify-around items-center h-16 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] rounded-t-xl px-2">
        <button 
          onClick={() => navigate("/feed")} 
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${currentRoute === "feed" ? "text-[#F5A623]" : "text-white/70 hover:text-white"}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">ফিড</span>
        </button>
        <button 
          onClick={() => navigate("/job-board")} 
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${currentRoute === "job-board" ? "text-[#F5A623]" : "text-white/70 hover:text-white"}`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-[10px] font-medium">জব বোর্ড</span>
        </button>
        <button 
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors text-white/70 hover:text-white`}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[10px] font-medium">নোটিফিকেশন</span>
        </button>
        <button 
          onClick={() => navigate("/profile")} 
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${currentRoute.startsWith("profile") ? "text-[#F5A623]" : "text-white/70 hover:text-white"}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">প্রোফাইল</span>
        </button>
        <button 
          onClick={() => navigate("/settings")} 
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${currentRoute === "settings" ? "text-[#F5A623]" : "text-white/70 hover:text-white"}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium">সেটিংস</span>
        </button>
      </div>
    </>
  );
}
