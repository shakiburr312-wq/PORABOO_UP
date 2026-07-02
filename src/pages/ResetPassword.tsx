import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle2, ShieldAlert, RefreshCw, KeyRound, Eye, EyeOff } from "lucide-react";
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from "../hooks/useLanguage";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (newPassword.length < 6) {
      setErrorMsg("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("পাসওয়ার্ড মিলছে না");
      return;
    }

    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        setErrorMsg("সার্ভার সংযোগ ব্যর্থ হয়েছে");
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      setSuccessMsg("পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "কিছু ভুল হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen form-page-bg flex flex-col justify-center items-center px-4 pt-20 pb-16 relative select-none">
      <div className="w-full max-w-md glass-card p-8 sm:p-10 relative z-10 animate-fadeInUp">
        <div className="text-center mb-8">
          <span className="logo-font text-3xl tracking-wider text-navy block mb-1">
            PORABOO
          </span>
          <span className="text-xs font-bold text-yellow bg-yellow/15 px-3 py-1 rounded-full uppercase inline-block">
            নতুন পাসওয়ার্ড
          </span>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-green-50 border border-green-200 text-xs text-green-700 flex items-start gap-2 text-left">
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">{t("password") || "নতুন পাসওয়ার্ড"}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none transition-all text-sm font-medium placeholder:font-normal"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-navy transition-all duration-200 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">{t("confirm_pass") || "পাসওয়ার্ড নিশ্চিত করুন"}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <KeyRound className="w-5 h-5" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none transition-all text-sm font-medium placeholder:font-normal"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-navy transition-all duration-200 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!successMsg}
            className="w-full py-3.5 bg-yellow hover:bg-yellow-400 text-navy font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>পরিবর্তন হচ্ছে...</span>
              </>
            ) : (
              <span>পাসওয়ার্ড পরিবর্তন করুন</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
