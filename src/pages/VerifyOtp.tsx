import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { ArrowLeft, RefreshCw, CheckCircle2, ShieldAlert } from "lucide-react";
import { Profile, saveLocalProfile, setLocalCurrentUser, supabase, isSupabaseConfigured } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import { useLanguage } from "../hooks/useLanguage";

interface VerifyOtpProps {
  onBackToRegister: () => void;
  navigateTo: (route: string) => void;
  userPayload: {
    role: "tutor" | "guardian";
    full_name: string;
    phone: string;
    email: string;
    present_address?: string;
    nid_number?: string;
    password?: string;
  } | null;
  onVerifySuccess: (user: Profile) => void;
}

export default function VerifyOtp({ onBackToRegister, navigateTo, userPayload, onVerifySuccess }: VerifyOtpProps) {
  const { t } = useLanguage();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(90);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  // 90-second countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Handle auto-submit when 6 digits are complete
  useEffect(() => {
    const isComplete = otp.every((val) => val !== "" && /[0-9]/.test(val));
    if (isComplete) {
      handleVerify(otp.join(""));
    }
  }, [otp]);

  const handleChange = (value: string, index: number) => {
    if (!/[0-9]/.test(value) && value !== "") return; // Only allow digits

    const newOtp = [...otp];
    // Take only the last character if pasted or typed
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Focus previous input if current is empty and backspace pressed
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleResend = () => {
    setSecondsLeft(90);
    setOtp(new Array(6).fill(""));
    setErrorMsg(null);
    setSuccessMsg(t("otp_resend_msg"));
    inputRefs.current[0]?.focus();
  };

  const handleVerify = async (otpCode: string) => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (isSupabaseConfigured && supabase && userPayload?.email) {
      const { data, error } = await supabase.auth.verifyOtp({
        email: userPayload.email,
        token: otpCode,
        type: 'signup'
      });

      if (error) {
        setErrorMsg(t("otp_invalid"));
        setLoading(false);
        return;
      }

      if (data.session) {
        // Insert into public.profiles
        const newProfile: Profile = {
          id: data.user!.id,
          role: userPayload.role,
          full_name: userPayload.full_name,
          phone: userPayload.phone,
          email: userPayload.email,
          phone_verified: true,
          present_address: userPayload.present_address,
          nid_number: userPayload.nid_number,
          created_at: new Date().toISOString()
        };

        await supabase.from('profiles').upsert([newProfile]);
        
        setSuccessMsg(t("otp_success"));
        
        setTimeout(() => {
          setLoading(false);
          setLocalCurrentUser(newProfile);
          onVerifySuccess(newProfile);
        }, 1500);
        return;
      }
    }

    // Simulated fallback behavior
    setTimeout(() => {
      const isOtpValid = otpCode.length === 6;

      if (!isOtpValid) {
        setErrorMsg(t("otp_invalid"));
        setLoading(false);
        return;
      }

      // Create new profile
      const newProfile: Profile = {
        id: `user-${userPayload?.role || "tutor"}-${Date.now()}`,
        role: userPayload?.role || "tutor",
        full_name: userPayload?.full_name || "ভেরিফাইড ইউজার",
        phone: userPayload?.phone || "01700000000",
        email: userPayload?.email || "verified@poraboo.com",
        phone_verified: true,
        present_address: userPayload?.present_address,
        nid_number: userPayload?.nid_number,
        created_at: new Date().toISOString()
      };

      // Save to local profile database
      saveProfileToDb(newProfile);

      setSuccessMsg(t("otp_success"));
      
      setTimeout(() => {
        setLoading(false);
        onVerifySuccess(newProfile);
      }, 1500);

    }, 1500);
  };

  const saveProfileToDb = (profile: Profile) => {
    // Save to our simulated localStorage db
    saveLocalProfile(profile);
    setLocalCurrentUser(profile);
  };

  // Format countdown seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Helper to convert English digits to Bangla
  const toBanglaDigits = (str: string) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return str.replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit, 10)]);
  };

  return (
    <div id="otp-container" className="min-h-screen form-page-bg flex flex-col justify-center items-center px-4 pt-20 pb-16 relative">
      {/* Back link */}
      <button
        onClick={onBackToRegister}
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-yellow transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-navy/5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t("back_to_prev")}</span>
      </button>

      {/* Verification Card */}
      <div
        id="otp-card"
        className="w-full max-w-md glass-card p-8 sm:p-10 relative z-10 text-center animate-fadeInUp"
      >
        <div className="mb-6">
          <span className="logo-font text-3xl tracking-wider text-navy block mb-1">
            PORABOO
          </span>
          <span className="text-xs font-bold text-teal bg-teal/10 px-3 py-1 rounded-full uppercase inline-block">
            {t("mobile_verification")}
          </span>
        </div>

        <h3 className="text-xl font-bold text-navy mb-2">{t("enter_6_digit_otp")}</h3>
        <p className="text-xs sm:text-sm text-text-muted mb-6 leading-relaxed">
          {t("otp_sent_to")} <strong className="text-navy font-bold">{userPayload?.phone || "০১৭XXXXXXXX"}</strong>-এ পাঠানো কোডটি নিচে দিন।
        </p>

        {/* Feedback States */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3 rounded-xl bg-green-50 border border-green-200 text-xs text-green-700 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Digit Inputs Row */}
        <div className={`flex justify-between gap-2.5 max-w-sm mx-auto mb-8 transition-opacity duration-300 ${loading ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el as HTMLInputElement)}
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-extrabold text-navy bg-navy-bg border border-navy/15 rounded-xl focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow focus:bg-white transition-all shadow-inner"
            />
          ))}
        </div>

        {/* Action Spinner */}
        {loading && (
          <div className="mb-6">
            <LoadingSpinner text={t("verifying_code")} color="navy" />
          </div>
        )}

        {/* Resend & Timer Area */}
        <div className="space-y-4 pt-4 border-t border-navy/10">
          {secondsLeft > 0 ? (
            <p className="text-xs sm:text-sm font-semibold text-text-muted">
              {t("resend_otp_in")}{" "}
              <span className="text-yellow font-extrabold font-mono">
                {toBanglaDigits(formatTime(secondsLeft))}
              </span>{" "}
              {t("seconds")}
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-text-muted">{t("did_not_get_otp")}</p>
              <button
                onClick={handleResend}
                className="px-5 py-2 text-xs font-bold text-navy bg-yellow rounded-full hover:shadow-md hover:bg-yellow/90 transition-all cursor-pointer"
              >
                {t("resend_code")}
              </button>
            </div>
          )}
        </div>

        {/* Demo Hint */}
        <div className="mt-6 p-2.5 bg-navy-bg border border-navy/10 rounded-xl text-[10px] sm:text-xs text-text-muted">
          <span className="font-bold text-navy">{t("test_guide")}</span> {t("test_guide_desc")}
        </div>
      </div>
    </div>
  );
}
