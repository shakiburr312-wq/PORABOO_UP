import { useAuth } from "../lib/AuthContext";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { User, Shield, Bell, Lock, Globe, Camera, Eye, EyeOff } from "lucide-react";
import { Profile } from "../lib/supabase";
import { useLanguage } from "../hooks/useLanguage";

interface SettingsPageProps {
  
  
}

export default function SettingsPage({  }: SettingsPageProps) {
  const navigate = useNavigate();
  const { currentUser, logout: onLogout } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("account");
  const { language, toggleLanguage } = useLanguage();
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const tabs = [
    { id: "account", label: t("settings_account"), icon: <User className="w-4 h-4" /> },
    { id: "security", label: t("settings_security"), icon: <Shield className="w-4 h-4" /> },
    { id: "notifications", label: t("settings_notifications"), icon: <Bell className="w-4 h-4" /> },
    { id: "privacy", label: t("settings_privacy"), icon: <Lock className="w-4 h-4" /> },
    { id: "language", label: t("settings_language"), icon: <Globe className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">{t("settings_title")}</h2>
            </div>
            <div className="flex flex-row md:flex-col overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-navy/5 text-[#1B2F6E] border-l-4 border-[#1B2F6E]"
                      : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[400px]">
            {activeTab === "account" && (
              <div className="max-w-md">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t("settings_account")}</h3>
                
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={(currentUser as any).avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(currentUser.full_name) + "&background=1a365d&color=fff"} 
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                    <button className="absolute bottom-0 right-0 bg-[#1B2F6E] text-white p-1.5 rounded-full shadow-md hover:bg-navy-800">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t("profile_picture")}</p>
                    <p className="text-sm text-gray-500">{t("image_upload_hint")}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t("full_name_label")}</label>
                    <input type="text" defaultValue={currentUser.full_name} className="w-full border border-gray-300 rounded-md p-2 text-[15px] focus:ring-1 focus:ring-[#1B2F6E] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t("email_label")}</label>
                    <input type="email" defaultValue={currentUser.email || "user@example.com"} readOnly className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-[15px] text-gray-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t("phone_label")}</label>
                    <input type="text" defaultValue={currentUser.phone} className="w-full border border-gray-300 rounded-md p-2 text-[15px] focus:ring-1 focus:ring-[#1B2F6E] focus:outline-none" />
                  </div>
                  <button className="mt-4 bg-[#F5A623] hover:bg-yellow-500 text-[#1B2F6E] font-bold py-2.5 px-6 rounded-md transition-colors">
                    সংরক্ষণ করুন
                  </button>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="max-w-md">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t("settings_security")}</h3>
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t("settings_current_pass")}</label>
                    <div className="relative">
                      <input type={showCurrentPassword ? "text" : "password"} placeholder="••••••••" className="w-full border border-gray-300 rounded-md p-2 pr-10 text-[15px] focus:ring-1 focus:ring-[#1B2F6E] focus:outline-none" />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-all duration-200 focus:outline-none"
                      >
                        <div className="relative w-4 h-4">
                          <Eye size={16} className={`absolute inset-0 transition-all duration-300 ${showCurrentPassword ? 'opacity-0 scale-75 rotate-12' : 'opacity-100 scale-100 rotate-0'}`} />
                          <EyeOff size={16} className={`absolute inset-0 transition-all duration-300 ${showCurrentPassword ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-12'}`} />
                        </div>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t("settings_new_pass")}</label>
                    <div className="relative">
                      <input type={showNewPassword ? "text" : "password"} placeholder="••••••••" className="w-full border border-gray-300 rounded-md p-2 pr-10 text-[15px] focus:ring-1 focus:ring-[#1B2F6E] focus:outline-none" />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-all duration-200 focus:outline-none"
                      >
                        <div className="relative w-4 h-4">
                          <Eye size={16} className={`absolute inset-0 transition-all duration-300 ${showNewPassword ? 'opacity-0 scale-75 rotate-12' : 'opacity-100 scale-100 rotate-0'}`} />
                          <EyeOff size={16} className={`absolute inset-0 transition-all duration-300 ${showNewPassword ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-12'}`} />
                        </div>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t("settings_confirm_pass")}</label>
                    <div className="relative">
                      <input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className="w-full border border-gray-300 rounded-md p-2 pr-10 text-[15px] focus:ring-1 focus:ring-[#1B2F6E] focus:outline-none" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-all duration-200 focus:outline-none"
                      >
                        <div className="relative w-4 h-4">
                          <Eye size={16} className={`absolute inset-0 transition-all duration-300 ${showConfirmPassword ? 'opacity-0 scale-75 rotate-12' : 'opacity-100 scale-100 rotate-0'}`} />
                          <EyeOff size={16} className={`absolute inset-0 transition-all duration-300 ${showConfirmPassword ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-12'}`} />
                        </div>
                      </button>
                    </div>
                  </div>
                  <button className="bg-[#1B2F6E] hover:bg-navy-800 text-white font-semibold py-2.5 px-6 rounded-md transition-colors">
                    পাসওয়ার্ড পরিবর্তন করুন
                  </button>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-red-600 mb-2">{t("settings_delete_acc")}</h4>
                  <p className="text-sm text-gray-600 mb-3">একবার ডিলিট করলে আর ফিরে পাওয়া যাবে না।</p>
                  <button className="border border-red-200 text-red-600 hover:bg-red-50 font-semibold py-2 px-4 rounded-md transition-colors text-sm">
                    অ্যাকাউন্ট মুছুন
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="max-w-md">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t("settings_notifications")}</h3>
                <div className="space-y-5">
                  {["নতুন assignment", "Job application", "নতুন connection request", "পোস্টে like/comment", "Admin notification"].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="font-semibold text-gray-700 text-[15px]">{item}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={i !== 4} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B2F6E]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="max-w-md">
                <h3 className="text-xl font-bold text-gray-900 mb-6">গোপনীয়তা</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">কে আমার প্রোফাইল দেখতে পারবে?</label>
                    <select className="w-full border border-gray-300 rounded-md p-2 text-[15px] focus:ring-1 focus:ring-[#1B2F6E] focus:outline-none bg-white">
                      <option>সবাই (Everyone)</option>
                      <option>শুধুমাত্র টিউটররা</option>
                      <option>শুধুমাত্র অভিভাবকরা</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">কে আমার সাথে যুক্ত হতে পারবে?</label>
                    <select className="w-full border border-gray-300 rounded-md p-2 text-[15px] focus:ring-1 focus:ring-[#1B2F6E] focus:outline-none bg-white">
                      <option>সবাই (Everyone)</option>
                      <option>কেউ না (No one)</option>
                    </select>
                  </div>
                  <button className="bg-[#1B2F6E] hover:bg-navy-800 text-white font-semibold py-2.5 px-6 rounded-md transition-colors">
                    সংরক্ষণ করুন
                  </button>
                </div>
              </div>
            )}

            {activeTab === "language" && (
              <div className="max-w-md">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t("settings_language")}</h3>
                <div className="flex gap-4">
                  <button 
                    onClick={() => language !== 'bn' && toggleLanguage()}
                    className={`flex-1 py-3 border-2 font-bold rounded-md transition-colors ${language === 'bn' ? 'border-[#1B2F6E] bg-navy/5 text-[#1B2F6E]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                  >
                    বাংলা
                  </button>
                  <button 
                    onClick={() => language !== 'en' && toggleLanguage()}
                    className={`flex-1 py-3 border-2 font-bold rounded-md transition-colors ${language === 'en' ? 'border-[#1B2F6E] bg-navy/5 text-[#1B2F6E]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                  >
                    English
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
