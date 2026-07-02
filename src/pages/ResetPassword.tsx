import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { supabase } from '@/lib/supabase';
import LoadingSpinner from "../components/LoadingSpinner";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const showError = (msg: string) => setErrorMsg(msg);

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      showError('পাসওয়ার্ড মিলছে না');
      return;
    }
    if (newPass.length < 6) {
      showError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });

    if (error) {
      showError(error.message);
      setLoading(false);
      return;
    }

    alert('পাসওয়ার্ড পরিবর্তন সফল হয়েছে! ✓');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col justify-center items-center px-4 pt-20 pb-16 relative select-none">
      <div className="w-full max-w-[420px] bg-white rounded-[20px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] relative z-10 animate-fadeInUp">
        <h1 className="text-3xl font-logo text-navy text-center mb-6">PORABOO</h1>
        
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-md">
            {errorMsg}
          </div>
        )}

        <form onSubmit={resetPassword} className="space-y-4 font-bangla">
          <h2 className="text-xl font-bold text-navy text-center mb-4">নতুন পাসওয়ার্ড সেট করুন</h2>
          
          <div className="relative">
            <input type={showPassword ? "text" : "password"} value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none" placeholder="নতুন পাসওয়ার্ড" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <div className="relative">
            <input type={showConfirmPassword ? "text" : "password"} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none" placeholder="পাসওয়ার্ড নিশ্চিত করুন" required />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy">
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-yellow hover:bg-yellow-400 text-navy font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2 mt-4">
            {loading ? <LoadingSpinner size={24} color="navy" /> : "পাসওয়ার্ড সেভ করুন"}
          </button>
        </form>
      </div>
    </div>
  );
}
