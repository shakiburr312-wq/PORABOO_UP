import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Users, ArrowRight } from "lucide-react";
import { supabase } from '@/lib/supabase';
import LoadingSpinner from "../components/LoadingSpinner";

export default function SelectRole() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"tutor" | "guardian" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!selectedRole) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    await supabase.from('profiles').upsert({
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      email: user.email!,
      role: selectedRole,
      avatar_url: user.user_metadata?.avatar_url || null
    });

    if (selectedRole === 'tutor') {
      navigate('/tutor/onboarding');
    } else {
      navigate('/feed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-center text-navy mb-8 font-bangla">আপনি কে?</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => setSelectedRole("tutor")}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
              selectedRole === "tutor" 
                ? "border-yellow bg-yellow/5 text-navy shadow-sm" 
                : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <GraduationCap className={`w-10 h-10 mb-3 ${selectedRole === "tutor" ? "text-navy" : "text-gray-400"}`} />
            <span className="font-bangla font-semibold text-lg">আমি একজন<br/>টিউটর</span>
          </button>
          
          <button 
            onClick={() => setSelectedRole("guardian")}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
              selectedRole === "guardian" 
                ? "border-yellow bg-yellow/5 text-navy shadow-sm" 
                : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Users className={`w-10 h-10 mb-3 ${selectedRole === "guardian" ? "text-teal" : "text-gray-400"}`} />
            <span className="font-bangla font-semibold text-lg">আমি একজন<br/>Guardian</span>
          </button>
        </div>

        <button 
          onClick={handleNext}
          disabled={!selectedRole || loading}
          className="w-full flex items-center justify-center gap-2 py-4 bg-yellow hover:bg-yellow-hover text-navy font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bangla text-lg"
        >
          {loading ? <LoadingSpinner size={24} color="#1B2F6E" /> : (
            <>পরবর্তী <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </div>
    </div>
  );
}
