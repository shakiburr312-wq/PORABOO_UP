import { useEffect } from "react";
import { supabase, setLocalCurrentUser } from "../lib/supabase";
import PageLoader from "../components/PageLoader";

export default function AuthCallback() {
  useEffect(() => {
    const handleAuth = async () => {
      // Supabase automatically handles the session on this route if tokens are in URL
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch profile to know role
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
          
        if (profile) {
          setLocalCurrentUser(profile);
          if (profile.role === 'tutor') {
            window.location.hash = "#/tutor/onboarding";
          } else {
            window.location.hash = "#/feed";
          }
        } else {
          window.location.hash = "#/login";
        }
      } else {
        // Give it a brief moment in case the onAuthStateChange is still processing
        setTimeout(() => {
          window.location.hash = "#/login";
        }, 1500);
      }
    };
    
    handleAuth();
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center">
      <PageLoader />
      <p className="mt-4 text-[#1B2F6E] font-semibold animate-pulse">লগইন করা হচ্ছে...</p>
    </div>
  );
}
