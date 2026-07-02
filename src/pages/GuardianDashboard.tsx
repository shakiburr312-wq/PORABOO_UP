import { useAuth } from "../lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Profile } from '@/lib/supabase';
import { Home, ClipboardList, Bell, Settings, LogOut, PlusCircle, Users } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

interface GuardianDashboardProps {
  
  
  
}

export default function GuardianDashboard({   }: GuardianDashboardProps) {
  const navigate = useNavigate();
  const { currentUser, logout: onLogout } = useAuth();
  const [activeTab, setActiveTab] = useState<"home" | "posts" | "notifications" | "settings">("home");
  const { t, language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 pt-20 pb-24 flex flex-col md:flex-row gap-6 animate-fadeIn">
      {/* Sidebar for Desktop / Bottom Nav for Mobile */}
      <aside className="md:w-64 flex-shrink-0">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 md:sticky md:top-24 hidden md:block">
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab("home")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'home' ? 'bg-navy/5 text-navy' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Home className="w-5 h-5" /> {t("dashboard")}
            </button>
            <button 
              onClick={() => setActiveTab("posts")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'posts' ? 'bg-navy/5 text-navy' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <ClipboardList className="w-5 h-5" /> {t("my_posts")}
            </button>
            <button 
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'notifications' ? 'bg-navy/5 text-navy' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Bell className="w-5 h-5" /> {t("notifications")}
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'settings' ? 'bg-navy/5 text-navy' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Settings className="w-5 h-5" /> {t("settings")}
            </button>
            <div className="h-px bg-slate-100 my-4"></div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" /> {t("logout")}
            </button>
          </nav>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex justify-around p-2 pb-safe">
          <button onClick={() => setActiveTab("home")} className={`p-3 flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-navy' : 'text-slate-400'}`}>
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-bold">{t("home_nav")}</span>
          </button>
          <button onClick={() => setActiveTab("posts")} className={`p-3 flex flex-col items-center gap-1 ${activeTab === 'posts' ? 'text-navy' : 'text-slate-400'}`}>
            <ClipboardList className="w-6 h-6" />
            <span className="text-[10px] font-bold">{t("posts_nav")}</span>
          </button>
          <button onClick={() => setActiveTab("notifications")} className={`p-3 flex flex-col items-center gap-1 ${activeTab === 'notifications' ? 'text-navy' : 'text-slate-400'}`}>
            <Bell className="w-6 h-6" />
            <span className="text-[10px] font-bold">{t("alerts_nav")}</span>
          </button>
          <button onClick={() => setActiveTab("settings")} className={`p-3 flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-navy' : 'text-slate-400'}`}>
            <Settings className="w-6 h-6" />
            <span className="text-[10px] font-bold">{t("settings_nav")}</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 space-y-6">
        {activeTab === "home" && (
          <>
            {/* Welcome Card */}
            <div className="bg-navy rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-center gap-6 shadow-lg shadow-navy/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
              <div className="relative z-10 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold bangla-font mb-2">{t("welcome")}, {currentUser.full_name}!</h1>
                <p className="text-white/80 bangla-font text-sm sm:text-base">{t("find_tutor")}</p>
              </div>
              <button 
                onClick={() => navigate("/guardian/post/new")}
                className="relative z-10 bg-yellow text-navy hover:bg-yellow/90 font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                <PlusCircle className="w-5 h-5" />
                {t("post_job")}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 sm:p-6 border border-slate-100 rounded-3xl text-center shadow-sm">
                <div className="text-3xl sm:text-4xl font-bold text-navy mb-1 bangla-font">{language === 'en' ? '0' : '০'}</div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">{t("total_posts")}</div>
              </div>
              <div className="bg-white p-4 sm:p-6 border border-slate-100 rounded-3xl text-center shadow-sm">
                <div className="text-3xl sm:text-4xl font-bold text-teal mb-1 bangla-font">{language === 'en' ? '0' : '০'}</div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">{t("active_posts")}</div>
              </div>
              <div className="bg-white p-4 sm:p-6 border border-slate-100 rounded-3xl text-center shadow-sm">
                <div className="text-3xl sm:text-4xl font-bold text-yellow mb-1 bangla-font">{language === 'en' ? '0' : '০'}</div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">{t("assigned")}</div>
              </div>
            </div>

            {/* Recent Applicants Preview */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-yellow" /> {t("recent_applicants")}
              </h3>
              
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                <Users className="w-12 h-12 mb-3 text-slate-200" />
                <p className="bangla-font text-sm">{t("no_applicants")}</p>
              </div>
              
              {/* Future applicant row structure */}
              {/* <div className="border-b border-slate-50 py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-navy">Shakibur Rahman</h4>
                  <p className="text-sm text-slate-500">Applied for: Class 9-10 (Mathematics)</p>
                </div>
                <button className="text-sm text-teal font-bold bg-teal/10 px-4 py-2 rounded-lg hover:bg-teal/20 transition-colors">
                  View Profile
                </button>
              </div> */}
            </div>
          </>
        )}

        {activeTab === "posts" && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm min-h-[400px]">
            <h2 className="text-xl font-bold text-navy mb-6 bangla-font">{t("my_posts")}</h2>
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
              <ClipboardList className="w-16 h-16 mb-4 text-slate-200" />
              <p className="bangla-font text-slate-500 mb-6">{t("no_posts")}</p>
              <button 
                onClick={() => navigate("/guardian/post/new")}
                className="bg-navy text-white hover:bg-navy/90 font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-colors"
              >
                <PlusCircle className="w-5 h-5" /> {t("create_first_post")}
              </button>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm min-h-[400px]">
             <h2 className="text-xl font-bold text-navy mb-6 bangla-font">{t("notifications")}</h2>
             <div className="text-center py-20 text-slate-400 bangla-font">
               {t("no_notifications")}
             </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm min-h-[400px]">
             <h2 className="text-xl font-bold text-navy mb-6 bangla-font">{t("settings")}</h2>
             <div className="space-y-4 max-w-md">
               <div>
                 <label className="block text-sm font-medium text-slate-600 mb-1">{t("full_name")}</label>
                 <input type="text" readOnly value={currentUser.full_name || ""} className="w-full p-3 border-2 border-slate-100 rounded-xl bg-slate-50 text-slate-500" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-600 mb-1">{t("contact_number")}</label>
                 <input type="text" readOnly value={currentUser.phone || ""} className="w-full p-3 border-2 border-slate-100 rounded-xl bg-slate-50 text-slate-500" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-600 mb-1">{t("present_address")}</label>
                 <input type="text" readOnly value={currentUser.present_address || ""} className="w-full p-3 border-2 border-slate-100 rounded-xl bg-slate-50 text-slate-500" />
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
