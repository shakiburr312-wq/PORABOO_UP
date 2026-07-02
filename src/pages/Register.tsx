import { useAuth } from "../lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, FormEvent } from "react";
import { GraduationCap, Users, ShieldCheck, Check, ArrowRight, ArrowLeft, Phone, Mail, MapPin, KeyRound, Eye, EyeOff, Lock } from "lucide-react";
import { supabase } from "../lib/supabase";

import LoadingSpinner from "../components/LoadingSpinner";
import { useLanguage } from "../hooks/useLanguage";

interface RegisterProps {
  
  
  
}

export default function Register({  }: RegisterProps) {
  const navigate = useNavigate();
  const { currentUser, logout: onLogout } = useAuth();
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"tutor" | "guardian" | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const hashParts = window.location.hash.split('?');
    if (hashParts.length > 1) {
      const queryParams = new URLSearchParams(hashParts[1]);
      const r = queryParams.get('role');
      if (r === 'tutor' || r === 'guardian') {
        setRole(r);
        setStep(2);
      }
    }
  }, []);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [nid, setNid] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleNextStep = () => {
    if (!role) {
      setErrorMsg(t("select_acc_type"));
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const handleSubmitRegistration = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (!fullName.trim()) { setErrorMsg(t("enter_full_name") || "সম্পূর্ণ নাম দিন"); return; }
    if (!phone.trim()) { setErrorMsg(t("enter_valid_phone") || "সঠিক ফোন নম্বর দিন"); return; }
    if (!email.trim() || !email.includes("@")) { setErrorMsg(t("enter_valid_email") || "সঠিক ইমেইল দিন"); return; }
    
    if (role === "guardian") {
      if (!address.trim()) { setErrorMsg(t("enter_current_address") || "বর্তমান ঠিকানা দিন"); return; }
      if (!nid.trim() || nid.length < 10) { setErrorMsg(t("enter_valid_nid") || "সঠিক NID দিন"); return; }
    }
    
    if (!password) { setErrorMsg(t("pass_required") || "পাসওয়ার্ড দিন"); return; }
    if (password.length < 6) { setErrorMsg(t("pass_min_6") || "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"); return; }
    if (password !== confirmPassword) { setErrorMsg(t("pass_mismatch") || "পাসওয়ার্ড মিলছে না"); return; }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            role: role,
            present_address: role === "guardian" ? address : undefined,
            nid_number: role === "guardian" ? nid : undefined 
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered') || signUpError.message.includes('already been registered')) {
          setErrorMsg(t('email_already_exists') || "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে");
        } else {
          setErrorMsg(signUpError.message);
        }
        return;
      }

      if (!data.user) {
        setErrorMsg("রেজিস্ট্রেশন ব্যর্থ হয়েছে");
        return;
      }

      // Step 2: Save to profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          full_name: fullName.trim(),
          role: role,
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile save error:', profileError);
      }

      // Step 3: Auto login after register
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (loginError) {
        navigate('/login');
        return;
      }

      if (role === 'tutor') {
        navigate('/tutor/onboarding');
      } else {
        navigate('/feed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || t("error") || "কিছু ভুল হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="register-container" className="min-h-screen form-page-bg flex flex-col justify-center items-center px-4 pt-20 pb-16 relative select-none">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-yellow transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-navy/5 z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t("back_to_home")}</span>
      </button>

      <div id="register-card" className="w-full max-w-xl glass-card p-8 sm:p-10 relative z-10 animate-fadeInUp">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-navy">{t("create_account")}</h2>
            <p className="text-sm text-text-muted mt-1">{step === 1 ? t("step_1_desc") : t("step_2_desc")}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${step === 1 ? "bg-yellow" : "bg-navy/20"}`}></div>
            <div className={`w-2.5 h-2.5 rounded-full ${step === 2 ? "bg-yellow" : "bg-navy/20"}`}></div>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-md animate-shake">
            {errorMsg}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setRole("tutor")}
                className={`relative cursor-pointer rounded-xl border-2 p-6 flex flex-col items-center text-center transition-all duration-200 ${
                  role === "tutor"
                    ? "border-navy bg-navy/5 shadow-md scale-[1.02]"
                    : "border-gray-200 hover:border-navy/30 hover:bg-gray-50"
                }`}
              >
                {role === "tutor" && (
                  <div className="absolute top-3 right-3 bg-navy text-white rounded-full p-1">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${role === "tutor" ? "bg-navy text-white" : "bg-gray-100 text-gray-500"}`}>
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h3 className={`text-lg font-bold ${role === "tutor" ? "text-navy" : "text-gray-700"}`}>{t("i_am_tutor")}</h3>
                <p className="text-xs text-text-muted mt-2">{t("tutor_desc")}</p>
              </div>

              <div
                onClick={() => setRole("guardian")}
                className={`relative cursor-pointer rounded-xl border-2 p-6 flex flex-col items-center text-center transition-all duration-200 ${
                  role === "guardian"
                    ? "border-navy bg-navy/5 shadow-md scale-[1.02]"
                    : "border-gray-200 hover:border-navy/30 hover:bg-gray-50"
                }`}
              >
                {role === "guardian" && (
                  <div className="absolute top-3 right-3 bg-navy text-white rounded-full p-1">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${role === "guardian" ? "bg-navy text-white" : "bg-gray-100 text-gray-500"}`}>
                  <Users className="w-7 h-7" />
                </div>
                <h3 className={`text-lg font-bold ${role === "guardian" ? "text-navy" : "text-gray-700"}`}>{t("i_am_guardian")}</h3>
                <p className="text-xs text-text-muted mt-2">{t("guardian_desc")}</p>
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full bg-yellow hover:bg-yellow-400 text-navy font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 mt-4"
            >
              <span>{t("continue")}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitRegistration} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">{t("full_name")}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Users className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none transition-all text-sm font-medium placeholder:font-normal"
                  placeholder={t("full_name_ph")}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">{t("phone_label")}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none transition-all text-sm font-medium placeholder:font-normal"
                  placeholder="01XXXXXXXXX"
                />
              </div>
            </div>

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

            {role === "guardian" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1.5">{t("present_address")}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none transition-all text-sm font-medium placeholder:font-normal"
                      placeholder={t("present_address_ph")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-1.5">{t("nid_number")}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={nid}
                      onChange={(e) => setNid(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none transition-all text-sm font-medium placeholder:font-normal"
                      placeholder={t("nid_number_ph")}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">{t("password")}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none transition-all text-sm font-medium placeholder:font-normal"
                  placeholder="••••••••"
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
            
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">{t("confirm_pass")}</label>
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
                  <div className="relative w-5 h-5">
                    <Eye 
                      size={20} 
                      className={`absolute inset-0 transition-all duration-300 ${showConfirmPassword ? 'opacity-0 scale-75 rotate-12' : 'opacity-100 scale-100 rotate-0'}`}
                    />
                    <EyeOff 
                      size={20}
                      className={`absolute inset-0 transition-all duration-300 ${showConfirmPassword ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-12'}`}
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                {t("back")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-yellow hover:bg-yellow-400 text-navy font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <LoadingSpinner size="sm" color="navy" /> : t("create_acc_btn")}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-text-muted">
          {t("already_have_acc")}
          <button
            onClick={() => navigate("/login")}
            className="ml-1 text-navy font-bold hover:text-yellow transition-colors"
          >
            {t("nav_login")}
          </button>
        </div>
      </div>
    </div>
  );
}
