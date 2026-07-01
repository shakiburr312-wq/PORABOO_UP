import { useAuth } from "../lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import { Mail, ArrowLeft, Send, CheckCircle2, ShieldAlert, RefreshCw } from "lucide-react";

import { useLanguage } from "../hooks/useLanguage";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg(t("enter_valid_email"));
      return;
    }

    setLoading(true);

    // Simulated email password reset link
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg(t("pass_reset_link_sent"));
      setEmail("");
    }, 1500);
  };

  return (
    <div id="forgot-password-container" className="min-h-screen form-page-bg flex flex-col justify-center items-center px-4 pt-20 pb-16 relative select-none">
      {/* Back button */}
      <button
        onClick={() => navigate("/login")}
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-yellow transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-navy/5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t("back_to_login_page")}</span>
      </button>

      {/* Main card */}
      <div
        id="forgot-password-card"
        className="w-full max-w-md glass-card p-8 sm:p-10 relative z-10 animate-fadeInUp"
      >
        <div className="text-center mb-8">
          <span className="logo-font text-3xl tracking-wider text-navy block mb-1">
            PORABOO
          </span>
          <span className="text-xs font-bold text-yellow bg-yellow/15 px-3 py-1 rounded-full uppercase inline-block">
            {t("pass_recovery")}
          </span>
        </div>

        <h3 className="text-xl font-bold text-navy mb-2">{t("forgot_password")}</h3>
        <p className="text-xs sm:text-sm text-text-muted mb-6 leading-relaxed">
          {t("enter_email_pass_rec")}
        </p>

        {/* Feedback Messages */}
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

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy uppercase block text-left">{t("reg_email_addr")}</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
              <input
                type="email"
                required
                placeholder={t("ex_email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-navy-bg border border-navy/10 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-yellow text-navy font-bold rounded-xl text-sm shadow-md hover:bg-yellow/90 hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t("sending_reset_link")}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{t("send_reset_link")}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-navy/10">
          <p className="text-xs text-text-muted">
            {t("remembered_pass")}{" "}
            <button
              onClick={() => navigate("/login")}
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
