import { useState, useEffect } from "react";
import { Profile, supabase, isSupabaseConfigured } from "../lib/supabase";
import { Search, MapPin, Clock, Calendar, GraduationCap, DollarSign, Filter, ChevronDown, UserRound } from "lucide-react";
import { SUBJECTS_OPTIONS, DHAKA_LOCATIONS, CLASS_LEVELS } from "../lib/constants";
import { useLanguage } from "../hooks/useLanguage";
import SkeletonCard from "../components/SkeletonCard";
import LoadingSpinner from "../components/LoadingSpinner";

interface JobBoardProps {
  currentUser: Profile | null;
  navigateTo: (route: string) => void;
}

export default function JobBoard({ currentUser, navigateTo }: JobBoardProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);

  // Filters
  const [filterSubject, setFilterSubject] = useState("");
  const [filterThana, setFilterThana] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterBudget, setFilterBudget] = useState(20000);
  const [budgetFocused, setBudgetFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Application logic
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [coverNote, setCoverNote] = useState("");
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
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
        // Mock data if no Supabase
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
            budget_max: 7000,
            gender_preference: "Male",
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
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
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
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
    
    if (diffInSeconds < 60) return t("just_now");
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} ${t("minutes_ago")}`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ${t("hours_ago")}`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${t("days_ago")}`;
  };

  const handleApply = async (jobId: string) => {
    if (!currentUser) return;
    setApplyingTo(jobId);
    
    if (isSupabaseConfigured && supabase) {
      await supabase.from('job_applications').insert([{
        job_id: jobId,
        tutor_id: currentUser.id,
        cover_note: coverNote || null,
        status: 'pending'
      }]);
    }
    
    // Optimistic update
    setAppliedJobs(prev => new Set(prev).add(jobId));
    setApplyingTo(null);
    setCoverNote("");
  };

  const filteredJobs = jobs.filter(job => {
    if (filterSubject && !job.subjects.includes(filterSubject)) return false;
    if (filterThana && job.thana !== filterThana) return false;
    if (filterClass && job.class_level !== filterClass) return false;
    if (job.budget_max > filterBudget) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 pt-20 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-2 bangla-font">{t("job_board")}</h1>
          <p className="text-text-muted bangla-font">{t("find_tutor_jobs")}</p>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium"
        >
          <Filter className="w-4 h-4" /> {t("filters")}
        </button>
      </div>

      {/* Filters (Desktop / Toggleable Mobile) */}
      <div className={`bg-white border border-slate-100 rounded-2xl p-4 sm:p-6 mb-8 shadow-sm ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("subject_label")}</label>
            <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="w-full p-2.5 border-2 border-slate-100 rounded-xl outline-none focus:border-yellow bg-slate-50">
              <option value="">{t("all_subjects")}</option>
              {SUBJECTS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("area_thana_label")}</label>
            <select value={filterThana} onChange={e => setFilterThana(e.target.value)} className="w-full p-2.5 border-2 border-slate-100 rounded-xl outline-none focus:border-yellow bg-slate-50">
              <option value="">{t("all_areas")}</option>
              {Object.keys(DHAKA_LOCATIONS).sort().map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t("class_level_label")}</label>
            <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="w-full p-2.5 border-2 border-slate-100 rounded-xl outline-none focus:border-yellow bg-slate-50">
              <option value="">{t("all_levels")}</option>
              {CLASS_LEVELS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {t("max_budget_label")}
            </label>
            <div className="relative mt-1">
              {!budgetFocused && filterBudget > 0 && (
                <span className="absolute inset-0 flex items-center px-4 text-teal font-medium pointer-events-none">
                  ৳{parseInt(String(filterBudget)).toLocaleString('en-IN')}/মাস
                </span>
              )}
              <input 
                type="number"
                min="0"
                value={filterBudget || ''}
                onChange={e => setFilterBudget(parseInt(e.target.value) || 0)}
                onFocus={() => setBudgetFocused(true)}
                onBlur={() => setBudgetFocused(false)}
                placeholder="e.g. 5,000"
                className={`input-field ${!budgetFocused && filterBudget > 0 ? 'text-transparent' : ''}`}
                style={{ 
                  color: (!budgetFocused && filterBudget > 0) ? 'transparent' : '#1B2F6E', 
                  WebkitTextFillColor: (!budgetFocused && filterBudget > 0) ? 'transparent' : '#1B2F6E' 
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1,2,3,4].map(n => (
            <div key={n} className="bg-white border border-slate-100 rounded-3xl p-6 h-64 animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                <div className="h-4 bg-slate-100 rounded w-4/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
          <Search className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-navy mb-2 bangla-font">{t("no_jobs")}</h3>
          <p className="text-slate-500 bangla-font">{t("try_adjusting")}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredJobs.map((job, idx) => (
            <div 
              key={job.id} 
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow animate-fadeInUp flex flex-col h-full relative overflow-hidden group"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-teal opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-navy leading-tight">
                  {job.subjects.join(", ")}
                </h3>
                <span className="bg-slate-100 text-slate-500 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ml-3">
                  {timeAgo(job.created_at)}
                </span>
              </div>
              
              <div className="text-sm font-medium text-teal mb-4 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                {job.class_level} • {job.medium}
              </div>

              <div className="space-y-3 mb-8 flex-grow">
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <div className="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-navy" />
                  </div>
                  <div>
                    <span className="block font-medium">{t("area_label")}</span>
                    <span className="text-navy font-bold">{job.thana}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <div className="w-8 h-8 rounded-full bg-yellow/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 text-yellow" />
                  </div>
                  <div>
                    <span className="block font-medium">{t("budget_label")}</span>
                    <span className="text-navy font-bold">৳{job.budget_min} - {job.budget_max}/{t("month_label")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue/5 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-blue" />
                  </div>
                  <div>
                    <span className="block font-medium">{t("schedule_label")}</span>
                    <span className="text-slate-700">{job.days_per_week} • {job.time_preference?.join(", ")}</span>
                  </div>
                </div>
                
                {job.gender_preference && job.gender_preference !== "No preference" && (
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <UserRound className="w-4 h-4 text-purple-500" />
                    </div>
                    <div>
                      <span className="block font-medium">{t("tutor_pref_label")}</span>
                      <span className="text-slate-700">{job.gender_preference} {t("only")}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col justify-between items-center gap-3">
                {currentUser?.id === job.guardian_id ? (
                  <button 
                    onClick={() => navigateTo("guardian/dashboard")}
                    className="w-full py-3 rounded-xl font-bold text-navy bg-navy/5 hover:bg-navy/10 transition-colors"
                  >
                    {t("view_applicants")}
                  </button>
                ) : currentUser?.role === "tutor" ? (
                  appliedJobs.has(job.id) ? (
                    <button disabled className="w-full py-3 rounded-xl font-bold text-teal bg-teal/10 cursor-not-allowed">
                      {t("applied")}
                    </button>
                  ) : applyingTo === job.id ? (
                    <div className="w-full space-y-3">
                      <textarea
                        value={coverNote}
                        onChange={e => setCoverNote(e.target.value)}
                        placeholder={t("optional_cover")}
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setApplyingTo(null); setCoverNote(""); }}
                          className="flex-1 py-2 rounded-xl font-bold text-slate-500 bg-slate-100"
                        >
                          {t("cancel")}
                        </button>
                        <button 
                          onClick={() => handleApply(job.id)}
                          className="flex-1 py-2 rounded-xl font-bold text-white bg-teal"
                        >
                          {t("confirm")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setApplyingTo(job.id)}
                      className="w-full py-3 rounded-xl font-bold text-white bg-yellow hover:bg-yellow/90 shadow-md hover:shadow-lg transition-all"
                    >
                      {t("apply")}
                    </button>
                  )
                ) : !currentUser ? (
                  <button 
                    onClick={() => navigateTo("login")}
                    className="w-full py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    {t("login_to_apply")}
                  </button>
                ) : (
                  <div className="w-full text-center py-3 text-sm text-slate-400 font-medium">
                    {t("only_tutors_apply")}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
