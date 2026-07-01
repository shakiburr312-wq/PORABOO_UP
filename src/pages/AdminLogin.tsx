import { useAuth } from "../lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";
import { Profile, isSupabaseConfigured, setLocalCurrentUser, supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import { useLanguage } from "../hooks/useLanguage";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (currentUser && currentUser.role === "admin") {
    navigate("/admin");
    return null;
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setErrorMsg(t("invalid_creds"));
          setLoading(false);
          return;
        }

        if (data.user) {
          const { data: p } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (p) {
            if (p.role !== 'admin') {
              await supabase.auth.signOut();
              setErrorMsg("Access denied. Admin only.");
              setLoading(false);
              return;
            }
            setLocalCurrentUser(p as Profile);
            window.location.href = "/admin";
          }
        }
      } catch (err: any) {
        setErrorMsg(err.message || t("error"));
        setLoading(false);
      }
    } else {
      // Offline fallback
      setTimeout(() => {
        setLoading(false);
        const adminProfile: Profile = {
          id: "admin-id",
          full_name: "Admin User",
          role: "admin",
          email: email,
          created_at: new Date().toISOString()
        };
        setLocalCurrentUser(adminProfile);
        window.location.href = "/admin";
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1B2F6E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-[#1B2F6E]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1B2F6E]">Admin Portal</h1>
          <p className="text-gray-500 mt-2">Sign in to access the PORABOO admin dashboard</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#1B2F6E] mb-1.5">{t("email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1B2F6E] focus:border-[#1B2F6E] outline-none transition-all text-sm font-medium"
              placeholder={t("email_placeholder")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1B2F6E] mb-1.5">{t("password_label")}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1B2F6E] focus:border-[#1B2F6E] outline-none transition-all text-sm font-medium"
                placeholder={t("password_placeholder")}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B2F6E] transition-all duration-200 focus:outline-none"
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

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-[#1B2F6E] hover:bg-[#1B2F6E]/90 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center disabled:opacity-70 mt-6"
          >
            {loading ? <LoadingSpinner size="sm" color="white" /> : "Admin Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
