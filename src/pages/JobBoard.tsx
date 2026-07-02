import { useAuth } from "../lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Profile, supabase } from '@/lib/supabase';
import { Search, MapPin, Clock, Calendar, GraduationCap, DollarSign, Filter, ChevronDown, UserRound } from "lucide-react";
import { SUBJECTS_OPTIONS, DHAKA_LOCATIONS, CLASS_LEVELS } from "../lib/constants";
import { useLanguage } from "../hooks/useLanguage";
import SkeletonCard from "../components/SkeletonCard";
import LoadingSpinner from "../components/LoadingSpinner";

interface JobBoardProps {
  
  
}

export default function JobBoard({  }: JobBoardProps) {
  const navigate = useNavigate();
  const { currentUser, logout: onLogout } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);

  // Filters
  const [filterSubject, setFilterSubject] = useState("");
  const [filterThana, setFilterThana] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterBudget, setFilterBudget] = useState(0);

  // Application logic
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('job_posts')
          .select('*')
          .eq('status', 'open')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setJobs(data || []);

        if (currentUser?.role === 'tutor') {
          const { data: apps } = await supabase
            .from('job_applications')
            .select('job_id')
            .eq('tutor_id', currentUser.id);
          
          if (apps) {
            setAppliedJobs(new Set(apps.map(a => a.job_id)));
          }
        }
      } else {
        // Mock data
        setJobs([
          {
            id: "1",
            guardian_id: "g1",
            subjects: ["Mathematics", "Physics"],
            class_level: "Class 9-10",
            medium: "Bangla Medium",
            days_per_week: "3 days",
            time_preference: ["Evening"],
            thana: "Dhanmondi",
            sub_area: "Road 15",
            budget_min: 5000,
            budget_max: 8000,
            gender_preference: "Male",
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "2",
            guardian_id: "g2",
            subjects: ["English", "Science"],
            class_level: "Class 6-8",
            medium: "English Medium",
            days_per_week: "4 days",
            time_preference: ["Afternoon"],
            thana: "Gulshan",
            sub_area: "Gulshan 2",
            budget_min: 8000,
            budget_max: 10000,
            gender_preference: "Female",
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "মাত্র";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} মিনিট আগে`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ঘন্টা আগে`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} দিন আগে`;
  };

  const handleApply = async (jobId: string) => {
    if (!currentUser) return;
    
    if (supabase) {
      await supabase.from('job_applications').insert([{
        job_id: jobId,
        tutor_id: currentUser.id,
        status: 'pending'
      }]);
    }
    
    setAppliedJobs(prev => new Set(prev).add(jobId));
  };

  const filteredJobs = jobs.filter(job => {
    if (filterSubject && !job.subjects.includes(filterSubject)) return false;
    if (filterThana && job.thana !== filterThana) return false;
    if (filterClass && job.class_level !== filterClass) return false;
    if (filterBudget > 0 && job.budget_max < filterBudget) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-24 font-sans">
      
      {/* Top Bar (Title & Actions) */}
      <div className="bg-white px-4 py-4 md:px-8 flex justify-between items-center shadow-sm">
        <h1 className="text-xl md:text-2xl font-bold text-[#1B2F6E]">জব বোর্ড</h1>
        {currentUser?.role === 'guardian' ? (
          <button 
            onClick={() => navigate('/guardian/post/new')}
            className="bg-[#F5A623] hover:bg-yellow-500 text-[#1B2F6E] font-bold py-2 px-4 rounded-md shadow-sm transition-colors text-sm md:text-base flex items-center gap-1"
          >
            নতুন পোস্ট করুন +
          </button>
        ) : currentUser?.role === 'tutor' ? (
          <button className="border-2 border-[#1B2F6E] text-[#1B2F6E] font-semibold py-1.5 px-4 rounded-md hover:bg-navy/5 transition-colors text-sm md:text-base">
            আমার আবেদনসমূহ
          </button>
        ) : null}
      </div>

      {/* Filter Bar (Sticky) */}
      <div className="sticky top-[60px] z-40 bg-white border-b border-gray-200 shadow-sm mb-6 w-full">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="bg-gray-100 border-none text-gray-700 text-sm font-medium py-2 px-3 rounded-md outline-none min-w-[120px]">
            <option value="">বিষয় ▼</option>
            {SUBJECTS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <select value={filterThana} onChange={e => setFilterThana(e.target.value)} className="bg-gray-100 border-none text-gray-700 text-sm font-medium py-2 px-3 rounded-md outline-none min-w-[120px]">
            <option value="">এলাকা ▼</option>
            {Object.keys(DHAKA_LOCATIONS).sort().map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="bg-gray-100 border-none text-gray-700 text-sm font-medium py-2 px-3 rounded-md outline-none min-w-[120px]">
            <option value="">ক্লাস ▼</option>
            {CLASS_LEVELS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <select value={filterBudget} onChange={e => setFilterBudget(Number(e.target.value))} className="bg-gray-100 border-none text-gray-700 text-sm font-medium py-2 px-3 rounded-md outline-none min-w-[120px]">
            <option value="0">বাজেট ▼</option>
            <option value="5000">৫,০০০+ ৳</option>
            <option value="8000">৮,০০০+ ৳</option>
            <option value="12000">১২,০০০+ ৳</option>
          </select>
          {(filterSubject || filterThana || filterClass || filterBudget > 0) && (
            <button 
              onClick={() => { setFilterSubject(""); setFilterThana(""); setFilterClass(""); setFilterBudget(0); }}
              className="text-red-500 font-semibold text-sm whitespace-nowrap px-2"
            >
              রিসেট
            </button>
          )}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(n => (
              <div key={n} className="bg-white rounded-xl p-6 h-48 animate-pulse shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-2">কোনো জব পোস্ট নেই।</h3>
            <p className="text-gray-500">পরে আবার চেক করুন অথবা ফিল্টার পরিবর্তন করুন।</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 flex flex-col justify-between transition-all hover:shadow-md border border-gray-100">
                
                <div>
                  <div className="flex gap-2 text-sm font-semibold text-[#1B2F6E] mb-3">
                    <span className="bg-[#1B2F6E]/10 px-2 py-1 rounded-md">{job.subjects.join(", ")}</span>
                  </div>
                  
                  <div className="space-y-1.5 mb-4">
                    <p className="text-[15px] text-gray-700 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{job.class_level}</span> • {job.medium}
                    </p>
                    <p className="text-[15px] text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{job.thana}</span>
                    </p>
                    <p className="text-[15px] text-gray-700 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">৳{job.budget_min} - {job.budget_max}</span>/মাস
                    </p>
                    <p className="text-[15px] text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {job.days_per_week} • {job.time_preference?.join(", ")}
                    </p>
                    {job.gender_preference && job.gender_preference !== "No preference" && (
                      <p className="text-[15px] text-gray-700 flex items-center gap-2">
                        <UserRound className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">{job.gender_preference} টিউটর পছন্দ</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {timeAgo(job.created_at)}
                  </span>
                  
                  {currentUser?.role === 'tutor' ? (
                    appliedJobs.has(job.id) ? (
                      <button disabled className="bg-gray-100 text-gray-500 font-semibold py-1.5 px-4 rounded-md text-sm flex items-center gap-1 cursor-not-allowed">
                        আবেদন করা হয়েছে ✓
                      </button>
                    ) : (
                      <button onClick={() => handleApply(job.id)} className="bg-[#1B2F6E] hover:bg-navy-800 text-white font-semibold py-1.5 px-4 rounded-md text-sm transition-colors">
                        আবেদন করুন
                      </button>
                    )
                  ) : currentUser?.id === job.guardian_id ? (
                    <button onClick={() => navigate('/guardian/dashboard')} className="border border-[#1B2F6E] text-[#1B2F6E] font-semibold py-1.5 px-4 rounded-md text-sm hover:bg-navy/5 transition-colors">
                      আবেদনকারী দেখুন
                    </button>
                  ) : !currentUser ? (
                     <button onClick={() => navigate("/login")} className="bg-gray-100 text-gray-700 font-semibold py-1.5 px-4 rounded-md text-sm hover:bg-gray-200 transition-colors">
                      লগইন করুন
                     </button>
                  ) : (
                     <span className="text-xs text-gray-400">শুধুমাত্র টিউটররা আবেদন করতে পারবেন</span>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
