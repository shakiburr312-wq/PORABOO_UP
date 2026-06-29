import { useState, useEffect, FormEvent } from "react";
import { GraduationCap, Users, ShieldCheck, Check, ArrowRight, ArrowLeft, Phone, Mail, MapPin, KeyRound, Eye, Lock } from "lucide-react";
import { Profile, supabase, isSupabaseConfigured } from "../lib/supabase";

import LoadingSpinner from "../components/LoadingSpinner";
import { useLanguage } from "../hooks/useLanguage";

interface RegisterProps {
  onBackToHome: () => void;
  navigateTo: (route: string) => void;
  onInitiateOtpVerify: (payload: {
    role: "tutor" | "guardian";
    full_name: string;
    phone: string;
    email: string;
    present_address?: string;
    nid_number?: string;
    password?: string;
  }) => void;
}

export default function Register({ onBackToHome, navigateTo, onInitiateOtpVerify }: RegisterProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"tutor" | "guardian" | null>(null);
  const [loading, setLoading] = useState(false);

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

    // Validation
    if (!fullName.trim()) {
      setErrorMsg(t("enter_full_name"));
      return;
    }
    if (!phone.trim()) {
      setErrorMsg(t("enter_valid_phone"));
      return;
    }
    const cleanPhone = phone.replace(/[\s-+]/g, "");
    if (cleanPhone.length < 11) {
      setErrorMsg(t("phone_11_digit"));
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg(t("enter_valid_email"));
      return;
    }
    if (role === "guardian") {
      if (!address.trim()) {
        setErrorMsg(t("enter_current_address"));
        return;
      }
      if (!nid.trim() || nid.length < 10) {
        setErrorMsg(t("enter_valid_nid"));
        return;
      }
    }
    if (!password) {
      setErrorMsg(t("pass_required"));
      return;
    }
    if (password.length < 6) {
      setErrorMsg(t("pass_min_6"));
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(t("pass_mismatch"));
      return;
    }

    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            role: role,
            present_address: role === "guardian" ? address : undefined,
            nid_number: role === "guardian" ? nid : undefined,
          }
        }
      });

      setLoading(false);
      if (error) {
        setErrorMsg(error.message);
        return;
      }
    } else {
      setLoading(false);
    }

    // Passed all validations, let's go to OTP verify passing the details
    onInitiateOtpVerify({
      role: role!,
      full_name: fullName,
      phone,
      email,
      present_address: role === "guardian" ? address : undefined,
      nid_number: role === "guardian" ? nid : undefined,
      password
    });
  };

  return (
    <div id="register-container" className="min-h-screen form-page-bg flex flex-col justify-center items-center px-4 pt-20 pb-16 relative select-none">
      {/* Back to Home Link */}
      <button
        onClick={onBackToHome}
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-yellow transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-navy/5 z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t("back_to_home")}</span>
      </button>

      {/* Main card */}
      <div
        id="register-card"
        className="w-full max-w-xl glass-card p-8 sm:p-10 relative z-10 animate-fadeInUp"
      >
        {/* Progress header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="logo-font text-2xl tracking-wider text-navy">
              PORABOO
            </span>
            <p className="text-xs font-semibold text-text-muted mt-0.5">{t("reg_profile_create")}</p>
          </div>
          {/* Progress pill indicator */}
          <div className="flex gap-1">
            <span className={`w-8 h-2 rounded-full transition-all duration-300 ${step >= 1 ? "bg-yellow" : "bg-navy/10"}`}></span>
            <span className={`w-8 h-2 rounded-full transition-all duration-300 ${step >= 2 ? "bg-yellow" : "bg-navy/10"}`}></span>
          </div>
        </div>

        {/* STEP 1: CHOOSE ROLE */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-navy">{t("what_acc_create")}</h3>
              <p className="text-sm text-text-muted">{t("select_role_desc")}</p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Tutor Card */}
              <div
                onClick={() => {
                  setRole("tutor");
                  setErrorMsg(null);
                }}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between items-start text-left gap-6 relative group ${
                  role === "tutor"
                    ? "border-yellow bg-navy/5 shadow-md"
                    : "border-navy/15 bg-white hover:border-navy hover:shadow-sm"
                }`}
              >
                {role === "tutor" && (
                  <span className="absolute top-4 right-4 p-1 rounded-full bg-yellow text-navy">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
                <div className="p-3 bg-navy/10 text-navy rounded-xl group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-navy mb-1.5">{t("i_am_tutor_reg")}</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {t("tutor_reg_desc")}
                  </p>
                </div>
              </div>

              {/* Guardian Card */}
              <div
                onClick={() => {
                  setRole("guardian");
                  setErrorMsg(null);
                }}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between items-start text-left gap-6 relative group ${
                  role === "guardian"
                    ? "border-yellow bg-teal/5 shadow-md"
                    : "border-navy/15 bg-white hover:border-navy hover:shadow-sm"
                }`}
              >
                {role === "guardian" && (
                  <span className="absolute top-4 right-4 p-1 rounded-full bg-yellow text-navy">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
                <div className="p-3 bg-teal/10 text-teal rounded-xl group-hover:scale-105 transition-transform">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-navy mb-1.5">{t("i_am_guardian_reg")}</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {t("guardian_reg_desc")}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full py-3.5 bg-yellow text-navy font-bold rounded-xl text-sm shadow-md hover:bg-yellow/90 hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              <span>{t("next_step")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: REGISTRATION FORM */}
        {step === 2 && (
          <form onSubmit={handleSubmitRegistration} className={`space-y-5 transition-opacity duration-300 ${loading ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
            <div className="flex items-center gap-2 pb-2 border-b border-navy/10">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setStep(1);
                }}
                className="p-1 rounded-full text-text-muted hover:bg-navy/5 hover:text-navy transition-colors pointer-events-auto"
                title={t("return_role_sel")}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="text-lg font-bold text-navy">
                  {role === "tutor" ? t("tutor_reg_form") : t("guardian_reg_form")}
                </h3>
                <p className="text-xs text-text-muted">{t("fill_correct_info")}</p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 animate-pulse">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy uppercase block">{t("full_name")}</label>
                <input
                  type="text"
                  required
                  placeholder={t("ex_name")}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-navy-bg border border-navy/10 rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow transition-all"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy uppercase block">{t("mobile_otp")}</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="tel"
                    required
                    placeholder={t("ex_phone")}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-navy-bg border border-navy/10 rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-navy uppercase block">{t("email")}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    required
                    placeholder={t("ex_email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-navy-bg border border-navy/10 rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow transition-all"
                  />
                </div>
              </div>

              {/* Guardian specific: address and NID */}
              {role === "guardian" && (
                <>
                  {/* Address */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-navy uppercase block">{t("current_address")}</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
                      <textarea
                        required
                        placeholder={t("ex_address")}
                        value={address}
                        rows={2}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-navy-bg border border-navy/10 rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* NID */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-navy uppercase block">{t("nid_label")}</label>
                    <input
                      type="text"
                      required
                      placeholder={t("nid_placeholder")}
                      value={nid}
                      onChange={(e) => setNid(e.target.value)}
                      className="w-full bg-navy-bg border border-navy/10 rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow transition-all"
                    />
                  </div>
                </>
              )}

              {/* Passwords */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy uppercase block">{t("password")}</label>
                <input
                  type="password"
                  required
                  placeholder={t("pass_placeholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-navy-bg border border-navy/10 rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy uppercase block">{t("confirm_pass")}</label>
                <input
                  type="password"
                  required
                  placeholder={t("reenter_pass")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-navy-bg border border-navy/10 rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-yellow text-navy font-bold rounded-xl text-sm shadow-md hover:bg-yellow/90 hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <LoadingSpinner text={t("wait")} color="navy" />
              ) : (
                <span>{role === "tutor" ? t("next_otp") : t("complete_reg_otp")}</span>
              )}
            </button>
          </form>
        )}

        {/* Existing account redirect */}
        <div className="text-center mt-6 pt-6 border-t border-navy/10">
          <p className="text-xs text-text-muted">
            {t("already_have_acc")}{" "}
            <button
              onClick={() => navigateTo("login")}
              className="font-bold text-blue hover:underline ml-1"
            >
              {t("login_now")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
