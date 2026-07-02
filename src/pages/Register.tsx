import { useNavigate } from "react-router-dom";
import { useState, useRef, FormEvent, useEffect, KeyboardEvent } from "react";
import { GraduationCap, Users, ShieldCheck, Check, ArrowRight, ArrowLeft, Phone, Mail, MapPin, KeyRound, Eye, EyeOff, Lock } from "lucide-react";
import { supabase } from '@/lib/supabase';
import LoadingSpinner from "../components/LoadingSpinner";

const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"role" | "form" | "otp">("role");
  const [role, setRole] = useState<"tutor" | "guardian" | null>(null);
  
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [nid, setNid] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [otp, setOtp] = useState(['','','','','','']);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (step === 'otp' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  const showError = (msg: string) => setErrorMsg(msg);
  
  const googleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/#/auth/callback` }
    });
  };

  const handleNextRole = () => {
    if (!role) return;
    setStep("form");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!fullName || !phone || !email || !password || !confirmPassword) return showError("সব তথ্য দিন");
    if (role === 'guardian' && (!address || !nid)) return showError("সব তথ্য দিন");
    if (password.length < 6) return showError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে");
    if (password !== confirmPassword) return showError("পাসওয়ার্ড মিলছে না");

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { full_name: fullName, role, phone }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) showError('এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে');
      else showError(error.message);
      setLoading(false);
      return;
    }

    sessionStorage.setItem('poraboo_reg', JSON.stringify({
      email, full_name: fullName, role, phone, nid: nid || null, address: address || null
    }));
    
    setStep('otp');
    setCountdown(60);
    setLoading(false);
  };

  const onChangeOtp = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) refs.current[i+1]?.focus();
    if (next.every(Boolean)) verify(next.join(''));
  };

  const onKeyDownOtp = (i: number, e: KeyboardEvent) => {
    if (e.key==='Backspace' && !otp[i] && i > 0) {
      refs.current[i-1]?.focus();
    }
  };

  const verify = async (code: string) => {
    setLoading(true);
    const reg = JSON.parse(sessionStorage.getItem('poraboo_reg') || '{}');
    const { data, error } = await supabase.auth.verifyOtp({
      email: reg.email,
      token: code,
      type: 'signup'
    });

    if (error) {
      showError('কোডটি সঠিক নয়। আবার চেষ্টা করুন।');
      setOtp(['','','','','','']);
      refs.current[0]?.focus();
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: reg.full_name,
        role: reg.role,
        phone: reg.phone || null,
        email: reg.email,
        nid_number: reg.nid || null,
        present_address: reg.address || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    sessionStorage.removeItem('poraboo_reg');
    if (reg.role === 'tutor') navigate('/tutor/onboarding');
    else navigate('/feed');
    setLoading(false);
  };

  const resend = async () => {
    const reg = JSON.parse(sessionStorage.getItem('poraboo_reg') || '{}');
    await supabase.auth.resend({ type: 'signup', email: reg.email });
    setCountdown(60);
    setOtp(['','','','','','']);
    refs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col justify-center items-center px-4 pt-20 pb-16 relative select-none">
      <button onClick={() => navigate("/")} className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-yellow transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-navy/5">
        <ArrowLeft className="w-4 h-4" /> <span>হোমে ফিরুন</span>
      </button>

      <div className="w-full max-w-[420px] bg-white rounded-[20px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] relative z-10 animate-fadeInUp">
        <h1 className="text-3xl font-logo text-navy text-center mb-6">PORABOO</h1>
        
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-md">
            {errorMsg}
          </div>
        )}

        {step === "role" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-navy text-center font-bangla mb-4">অ্যাকাউন্টের ধরন বেছে নিন</h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setRole("tutor")} className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${role === "tutor" ? "border-yellow bg-yellow/5" : "border-gray-200"}`}>
                <GraduationCap className={`w-8 h-8 mb-2 ${role === "tutor" ? "text-navy" : "text-gray-400"}`} />
                <span className="font-bangla font-semibold">আমি একজন<br/>টিউটর</span>
                {role === "tutor" && <Check className="w-5 h-5 text-navy absolute top-2 right-2" />}
              </button>
              <button onClick={() => setRole("guardian")} className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${role === "guardian" ? "border-yellow bg-yellow/5" : "border-gray-200"}`}>
                <Users className={`w-8 h-8 mb-2 ${role === "guardian" ? "text-teal" : "text-gray-400"}`} />
                <span className="font-bangla font-semibold">আমি একজন<br/>Guardian</span>
                {role === "guardian" && <Check className="w-5 h-5 text-teal absolute top-2 right-2" />}
              </button>
            </div>
            <button onClick={handleNextRole} disabled={!role} className="w-full bg-yellow hover:bg-yellow-400 text-navy font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              পরবর্তী <ArrowRight className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-500 px-2 font-bangla">অথবা Google দিয়ে</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            
            <button onClick={googleLogin} className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-gray-200 rounded-full hover:border-navy transition-all font-medium text-navy shadow-sm">
              <GoogleIcon /> Google দিয়ে যোগ দিন
            </button>
          </div>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4 font-bangla">
            <h2 className="text-xl font-bold text-navy text-center mb-4">রেজিস্ট্রেশন করুন</h2>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none" placeholder="আপনার পুরো নাম" required />
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none" placeholder="ফোন নম্বর (01XXXXXXXXX)" required />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none" placeholder="ইমেইল অ্যাড্রেস" required />
            
            {role === "guardian" && (
              <>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none" placeholder="বর্তমান ঠিকানা" required />
                <input type="text" value={nid} onChange={e => setNid(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none" placeholder="এনআইডি নম্বর" required />
              </>
            )}
            
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none" placeholder="পাসওয়ার্ড" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <div className="relative">
              <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy outline-none" placeholder="পাসওয়ার্ড নিশ্চিত করুন" required />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setStep("role")} className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-full transition-colors">ফিরে যান</button>
              <button type="submit" disabled={loading} className="flex-1 bg-yellow hover:bg-yellow-400 text-navy font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2">
                {loading ? <LoadingSpinner size={24} color="navy" /> : "রেজিস্ট্রেশন করুন"}
              </button>
            </div>
          </form>
        )}

        {step === "otp" && (
          <div className="text-center font-bangla space-y-6">
            <div className="w-16 h-16 bg-teal/10 text-teal rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-navy">কোড যাচাই করুন</h2>
            <p className="text-gray-500 text-sm">
              <span className="font-semibold text-gray-700">{JSON.parse(sessionStorage.getItem('poraboo_reg')||'{}').email}</span>-এ একটি ৬ সংখ্যার কোড পাঠানো হয়েছে
            </p>
            
            <div className="flex justify-center gap-2 my-8">
              {otp.map((v, i) => (
                <input
                  key={i}
                  ref={el => refs.current[i] = el}
                  type="text"
                  maxLength={1}
                  value={v}
                  onChange={e => onChangeOtp(i, e.target.value)}
                  onKeyDown={e => onKeyDownOtp(i, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-[#D1D9F0] rounded-xl focus:border-yellow focus:ring-2 focus:ring-yellow/20 outline-none transition-all"
                />
              ))}
            </div>
            
            {loading ? <div className="flex justify-center"><LoadingSpinner size={24} color="navy" /></div> : (
              countdown > 0 ? (
                <p className="text-gray-500 text-sm">{countdown} সেকেন্ড পর পুনরায় পাঠান</p>
              ) : (
                <button onClick={resend} className="text-navy font-bold hover:text-yellow transition-colors underline">কোড পাননি? আবার পাঠান</button>
              )
            )}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500 font-bangla">
          ইতিমধ্যেই অ্যাকাউন্ট আছে? 
          <button onClick={() => navigate("/login")} className="ml-1 text-navy font-bold hover:text-yellow transition-colors">লগইন করুন</button>
        </div>
      </div>
    </div>
  );
}
