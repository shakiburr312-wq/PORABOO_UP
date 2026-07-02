import { useEffect } from "react";
import { supabase } from '@/lib/supabase';
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handle = async () => {
      await new Promise(r => setTimeout(r, 1000));
      
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile) {
        // New Google user — select role
        navigate('/select-role');
        return;
      }

      if (profile.role === 'admin') navigate('/admin');
      else navigate('/feed');
    };
    handle();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F2F5] gap-4">
      <span className="font-logo text-4xl text-navy animate-pulse">PORABOO</span>
      <LoadingSpinner size={32} color="#1B2F6E" />
      <p className="font-bangla text-gray-500">যাচাই করা হচ্ছে...</p>
    </div>
  );
}
