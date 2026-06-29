import { useState, FormEvent } from "react";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { Profile, isSupabaseConfigured, setLocalCurrentUser, supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import { useLanguage } from "../hooks/useLanguage";

interface LoginProps {
  onBackToHome: () => void;
  navigateTo: (route: string) => void;
  onLoginSuccess: (user: Profile) => void;
}

export default function Login({ onBackToHome, navigateTo, onLoginSuccess }: LoginProps) {
  const { t } = useLanguage();
  
  // Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State indicators
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    
    // Simple Validation
    if (!email.trim()) {
      setErrorMsg(t("enter_email_err"));
      return;
    }
    if (!password) {
      setErrorMsg(t("enter_pass_err"));
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (authError) {
          if (authError.message.includes("Invalid")) {
            setErrorMsg("ইমেইল বা পাসওয়ার্ড সঠিক নয়");
          } else if (authError.message.includes("Email not confirmed")) {
            setErrorMsg("আপনার ইমেইল যাচাই করুন। ইনবক্স চেক করুন।");
          } else {
            setErrorMsg("লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
          }
          setLoading(false);
          return;
        }

        if (authData.user) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authData.user.id)
            .single();

          if (profileError || !profileData) {
            setErrorMsg(t("profile_load_err"));
            setLoading(false);
            return;
          }

          setLocalCurrentUser(profileData);
          setLoading(false);
          onLoginSuccess(profileData);
          return;
        }
      } else {
        // High-fidelity local simulation if Supabase is not configured
        setTimeout(() => {
          const simulatedUser: Profile = {
            id: `simulated-user-${Date.now()}`,
            role: "tutor",
            full_name: "Demo User",
            phone: "01700000000",
            email: email,
            phone_verified: true,
            created_at: new Date().toISOString()
          };
          setLocalCurrentUser(simulatedUser);
          setLoading(false);
          onLoginSuccess(simulatedUser);
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || t("login_err"));
      setLoading(false);
    }
  };

  return (
    <div id="login-container" className="min-h-screen form-page-bg flex flex-col justify-center items-center px-4 pt-20 pb-16 relative">
      {/* Floating Back to Home Link */}
      <button
        onClick={onBackToHome}
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-yellow transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-navy/5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t("back_to_home")}</span>
      </button>

      {/* Main Login Card */}
      <div id="login-card" className="w-full max-w-md glass-card p-8 sm:p-10 relative z-10 animate-fadeInUp">
        {/* Header Logo */}
        <div className="text-center mb-8">
          <span className="logo-font text-3xl tracking-wider text-navy block mb-1">
            PORABOO
          </span>
          <span className="text-xs font-semibold text-text-muted bg-navy/5 px-2.5 py-1 rounded-full uppercase">
            {t("login_portal")}
          </span>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-md animate-shake">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">{t("email")}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none transition-all text-sm font-medium placeholder:font-normal"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">{t("password")}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none transition-all text-sm font-medium placeholder:font-normal"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => navigateTo("forgot-password")}
              className="text-sm font-medium text-text-muted hover:text-navy transition-colors"
            >
              {t("forgot_pass")}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow hover:bg-yellow-400 text-navy font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <LoadingSpinner size="sm" color="navy" /> : t("nav_login")}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-text-muted">
          {t("dont_have_acc")}
          <button
            onClick={() => navigateTo("register")}
            className="ml-1 text-navy font-bold hover:text-yellow transition-colors"
          >
            {t("create_account")}
          </button>
        </div>
      </div>
    </div>
  );
}
