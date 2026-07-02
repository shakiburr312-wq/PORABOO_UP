import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { supabase } from '@/lib/supabase';
import LoadingSpinner from "../components/LoadingSpinner";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const showError = (msg: string) => setErrorMsg(msg);

  const forgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showError('ইমেইল দিন');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/#/reset-password` }
    );

    if (error) {
      showError(error.message);
      setLoading(false);
      return;
    }

    setEmailSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col justify-center items-center px-4 pt-20 pb-16 relative select-none">
      <button onClick={() => navigate("/login")} className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-yellow transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-navy/5">
        <ArrowLeft className="w-4 h-4" /> <span>ফিরে যান</span>
      </button>

      <div className="w-full max-w-[420px] bg-white rounded-[20px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] relative z-10 animate-fadeInUp">
        <h1 className="text-3xl font-logo text-navy text-center mb-6">PORABOO</h1>
        
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-md">
            {errorMsg}
          </div>
        )}

        {emailSent ? (
          <div className="text-center font-bangla space-y-4">
            <div className="w-16 h-16 bg-teal/10 text-teal rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-navy">রিসেট লিংক পাঠানো হয়েছে!</h2>
            <p className="text-gray-500 text-sm">
              <span className="font-semibold text-gray-700">{email}</span>-এ পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। Spam folder চেক করুন।
            </p>
            <button onClick={() => navigate("/login")} className="w-full bg-yellow hover:bg-yellow-400 text-navy font-bold py-3.5 rounded-full transition-all mt-6">
              লগইন পেজে যান
            </button>
          </div>
        ) : (
          <form onSubmit={forgotPassword} className="space-y-4 font-bangla">
            <h2 className="text-xl font-bold text-navy text-center mb-4">পাসওয়ার্ড রিসেট</h2>
            <p className="text-center text-sm text-gray-500 mb-6">আপনার অ্যাকাউন্টের ইমেইল দিন, আমরা একটি রিসেট লিংক পাঠাবো।</p>
            
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none" placeholder="ইমেইল অ্যাড্রেস" required />
            
            <button type="submit" disabled={loading} className="w-full bg-yellow hover:bg-yellow-400 text-navy font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2 mt-4">
              {loading ? <LoadingSpinner size={24} color="navy" /> : "লিংক পাঠান"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
