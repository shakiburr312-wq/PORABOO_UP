import { useAuth } from "../lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Profile, isSupabaseConfigured, setLocalCurrentUser, supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import { useLanguage } from "../hooks/useLanguage";

interface LoginProps {
  
  
  onLoginSuccess: (user: Profile) => void;
}

export default function Login() {
  const navigate = useNavigate();
  const { currentUser, logout: onLogout } = useAuth();
  const { t } = useLanguage();
  
  // Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
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
            setErrorMsg(t("login_error_invalid"));
          } else if (authError.message.includes("Email not confirmed")) {
            setErrorMsg(t("login_error_unverified"));
          } else {
            setErrorMsg(t("login_error_general"));
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
          if (profileData.role === 'tutor') {
            navigate('/tutor/onboarding');
          } else {
            navigate('/feed');
          }
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
          navigate('/tutor/onboarding');
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
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-yellow transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-navy/5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t("back_to_home")}</span>
      </button>

      {/* Main Login Card */}
      <div id="login-card" className="w-full max-w-md glass-card p-8 sm:p-10 relative z-10 animate-fadeInUp">
        {/* Header Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy block mb-1">{t("login_title")}</h1>
          <span className="text-xs font-semibold text-text-muted bg-navy/5 px-2.5 py-1 rounded-full uppercase">
            {t("login_subtitle")}
          </span>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-md animate-shake">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">{t("email_label")}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none transition-all text-sm font-medium placeholder:font-normal"
                placeholder={t("email_placeholder")}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">{t("password_label")}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none transition-all text-sm font-medium placeholder:font-normal"
                placeholder={t("password_placeholder")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-navy transition-all duration-200 focus:outline-none"
              >
                <div className="relative w-5 h-5">
                  <Eye 
                    size={20} 
                    className={`absolute inset-0 transition-all duration-300 ${showPassword ? 'opacity-0 scale-75 rotate-12' : 'opacity-100 scale-100 rotate-0'}`}
                  />
                  <EyeOff 
                    size={20}
                    className={`absolute inset-0 transition-all duration-300 ${showPassword ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-12'}`}
                  />
                </div>
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
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
            {loading ? <LoadingSpinner size="sm" color="navy" /> : t("login_btn")}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-text-muted">
          {t("dont_have_acc")}
          <button
            onClick={() => navigate("/register")}
            className="ml-1 text-navy font-bold hover:text-yellow transition-colors"
          >
            {t("create_account")}
          </button>
        </div>
      </div>
    </div>
  );
}
