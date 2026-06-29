import { useState, useEffect, FormEvent } from "react";
import { GraduationCap, MapPin, BookOpen, CircleDollarSign, PlusCircle, CheckCircle2, ListFilter, ClipboardList, Send, LogOut, FileCheck2, Users, Search, HelpCircle, ShieldCheck } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { Profile, saveLocalProfile } from "../lib/supabase";
import { SUBJECTS_OPTIONS, DHAKA_LOCATIONS } from "../lib/constants";

interface DashboardProps {
  currentUser: Profile;
  onLogout: () => void;
  navigateTo: (route: string) => void;
}

interface TuitionJob {
  id: string;
  subject: string;
  className: string;
  location: string;
  salary: string;
  daysPerWeek: string;
  postedBy: string;
  applied?: boolean;
}

export default function Dashboard({ currentUser, onLogout, navigateTo }: DashboardProps) {
  const { t } = useLanguage();
  // Tutor profile setup state
  const [university, setUniversity] = useState("");
  const [degree, setDegree] = useState("");
  const [hscGpa, setHscGpa] = useState("");
  const [preferredSubjects, setPreferredSubjects] = useState<string[]>([]);
  const [preferredAreas, setPreferredAreas] = useState<string[]>([]);
  const [expectedSalary, setExpectedSalary] = useState("৫০০০");
  const [profileSaved, setProfileSaved] = useState(false);

  // Guardian post tuition state
  const [subjectInput, setSubjectInput] = useState("");
  const [classInput, setClassInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [salaryInput, setSalaryInput] = useState("");
  const [daysInput, setDaysInput] = useState("৩ দিন");
  const [postSuccess, setPostSuccess] = useState(false);

  // Live Job Board list (seeded with authentic local requests)
  const [jobs, setJobs] = useState<TuitionJob[]>([
    {
      id: "job-1",
      subject: "গণিত ও পদার্থবিজ্ঞান (বাংলা মাধ্যম)",
      className: "দশম শ্রেণী",
      location: "মিরপুর-১২, ঢাকা",
      salary: "৭,০০০ টাকা / মাস",
      daysPerWeek: "৩ দিন / সপ্তাহ",
      postedBy: "কামরুল ইসলাম"
    },
    {
      id: "job-2",
      subject: "English Medium All Subjects",
      className: "Class 7",
      location: "উত্তরা সেক্টর ৪, ঢাকা",
      salary: "১০,০০০ টাকা / মাস",
      daysPerWeek: "৪ দিন / সপ্তাহ",
      postedBy: "ফারহানা চৌধুরী"
    },
    {
      id: "job-3",
      subject: "রসায়ন ও জীববিজ্ঞান",
      className: "একাদশ শ্রেণী",
      location: "লালখান বাজার, চট্টগ্রাম",
      salary: "৮,৫০০ টাকা / মাস",
      daysPerWeek: "৩ দিন / সপ্তাহ",
      postedBy: "মাহমুদ হাসান"
    }
  ]);

  const handleApply = (jobId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === jobId ? { ...job, applied: true } : job))
    );
  };

  const handleSaveTutorProfile = (e: FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);

    // Save extended profile data into simulated localStorage db
    const updatedProfile: Profile = {
      ...currentUser,
      full_name: currentUser.full_name,
      updated_at: new Date().toISOString()
    };
    saveLocalProfile(updatedProfile);

    setTimeout(() => {
      setProfileSaved(false);
    }, 3000);
  };

  const handlePostTuition = (e: FormEvent) => {
    e.preventDefault();
    if (!subjectInput || !classInput || !locationInput || !salaryInput) return;

    const newJob: TuitionJob = {
      id: `job-custom-${Date.now()}`,
      subject: subjectInput,
      className: classInput,
      location: locationInput,
      salary: `${salaryInput} টাকা / মাস`,
      daysPerWeek: `${daysInput} / সপ্তাহ`,
      postedBy: currentUser.full_name
    };

    setJobs((prev) => [newJob, ...prev]);
    setPostSuccess(true);
    
    // Clear form
    setSubjectInput("");
    setClassInput("");
    setLocationInput("");
    setSalaryInput("");

    setTimeout(() => {
      setPostSuccess(false);
    }, 3000);
  };

  const toggleSubject = (sub: string) => {
    if (preferredSubjects.includes(sub)) {
      setPreferredSubjects(preferredSubjects.filter((s) => s !== sub));
    } else {
      setPreferredSubjects([...preferredSubjects, sub]);
    }
  };

  const toggleArea = (area: string) => {
    if (preferredAreas.includes(area)) {
      setPreferredAreas(preferredAreas.filter((a) => a !== area));
    } else {
      setPreferredAreas([...preferredAreas, area]);
    }
  };

  const availableSubjectsList = SUBJECTS_OPTIONS;
  const availableAreasList = Object.keys(DHAKA_LOCATIONS).sort();

  return (
    <div className="min-h-screen bg-navy-bg pt-28 pb-16 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-navy/5 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-32 h-full bg-linear-to-l from-yellow/5 to-transparent pointer-events-none"></div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3.5 bg-navy text-white rounded-2xl">
              {currentUser.role === "tutor" ? (
                <GraduationCap className="w-8 h-8 text-yellow" />
              ) : (
                <Users className="w-8 h-8 text-yellow" />
              )}
            </div>
            <div>
              <span className="text-xs font-bold text-teal tracking-wider uppercase block bg-teal/10 px-2.5 py-0.5 rounded-full w-fit mb-1">
                {currentUser.role === "tutor" ? t("tutor_account") : t("guardian_account")}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-navy">
                {t("assalamualaikum")} {currentUser.full_name}
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                {currentUser.role === "tutor" 
                  ? t("tutor_welcome_desc") 
                  : t("guardian_welcome_desc")
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-text-muted block">{t("mobile_number")}</span>
              <strong className="text-sm text-navy">{currentUser.phone || "০১৭XXXXXXXX"}</strong>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t("logout")}</span>
            </button>
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Profile Setup / Post Request */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* TUTOR CASE: PROFILE SETUP FORM (Section 2) */}
            {currentUser.role === "tutor" && (
              <div className="bg-white rounded-3xl border border-navy/5 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 pb-4 border-b border-navy/10 mb-6">
                  <FileCheck2 className="w-5 h-5 text-teal" />
                  <h3 className="text-lg font-bold text-navy">{t("tutor_profile_setup")}</h3>
                </div>

                {profileSaved && (
                  <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-xs text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>{t("profile_update_success")}</span>
                  </div>
                )}

                <form onSubmit={handleSaveTutorProfile} className="space-y-5">
                  {/* University */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy uppercase block">{t("college_uni")}</label>
                    <input
                      type="text"
                      placeholder={t("college_uni_ph")}
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="w-full bg-navy-bg border border-navy/10 rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-yellow transition-all"
                    />
                  </div>

                  {/* Degree */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy uppercase block">{t("degree_subject")}</label>
                    <input
                      type="text"
                      placeholder={t("degree_subject_ph")}
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full bg-navy-bg border border-navy/10 rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-yellow transition-all"
                    />
                  </div>

                  {/* High School HSC GPA */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy uppercase block">{t("hsc_gpa")}</label>
                    <input
                      type="text"
                      placeholder={t("hsc_gpa_ph")}
                      value={hscGpa}
                      onChange={(e) => setHscGpa(e.target.value)}
                      className="w-full bg-navy-bg border border-navy/10 rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-yellow transition-all"
                    />
                  </div>

                  {/* Preferred Subjects */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-navy uppercase block">{t("pref_subjects")}</label>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {availableSubjectsList.map((sub) => {
                        const isSelected = preferredSubjects.includes(sub);
                        return (
                          <button
                            type="button"
                            key={sub}
                            onClick={() => toggleSubject(sub)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                              isSelected
                                ? "bg-teal text-white border-teal"
                                : "bg-navy/5 text-text-muted border-transparent hover:bg-navy/10"
                            }`}
                          >
                            {sub}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preferred Areas */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-navy uppercase block">{t("tuition_area")}</label>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {availableAreasList.map((area) => {
                        const isSelected = preferredAreas.includes(area);
                        return (
                          <button
                            type="button"
                            key={area}
                            onClick={() => toggleArea(area)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                              isSelected
                                ? "bg-yellow text-navy border-yellow"
                                : "bg-navy/5 text-text-muted border-transparent hover:bg-navy/10"
                            }`}
                          >
                            {area}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expected Salary */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy uppercase block">{t("exp_salary_label")}</label>
                    <select
                      value={expectedSalary}
                      onChange={(e) => setExpectedSalary(e.target.value)}
                      className="w-full bg-navy-bg border border-navy/10 rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-yellow transition-all"
                    >
                      <option value="৪০০০">৪,০০০ টাকা / মাস</option>
                      <option value="৫০০০">৫,০০০ টাকা / মাস</option>
                      <option value="৬০০০">৬,০০০ টাকা / মাস</option>
                      <option value="৮০০০">৮,০০০ টাকা / মাস</option>
                      <option value="১০০০০">১০,০০০+ টাকা / মাস</option>
                    </select>
                  </div>

                  {/* Submit updates */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-yellow text-navy font-bold rounded-xl text-xs sm:text-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    {t("save")}
                  </button>
                </form>
              </div>
            )}

            {/* GUARDIAN CASE: POST NEW TUITION REQUEST */}
            {currentUser.role === "guardian" && (
              <div className="bg-white rounded-3xl border border-navy/5 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 pb-4 border-b border-navy/10 mb-6">
                  <PlusCircle className="w-5 h-5 text-teal" />
                  <h3 className="text-lg font-bold text-navy">{t("post_tuition_req")}</h3>
                </div>

                {postSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-xs text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>{t("tuition_post_success")}</span>
                  </div>
                )}

                <form onSubmit={handlePostTuition} className="space-y-4">
                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy uppercase block">{t("subjects_label")}</label>
                    <div className="relative">
                      <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="text"
                        required
                        placeholder={t("subjects_ph")}
                        value={subjectInput}
                        onChange={(e) => setSubjectInput(e.target.value)}
                        className="w-full bg-navy-bg border border-navy/10 rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:border-yellow transition-all"
                      />
                    </div>
                  </div>

                  {/* Class */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy uppercase block">{t("class_medium")}</label>
                    <input
                      type="text"
                      required
                      placeholder={t("class_medium_ph")}
                      value={classInput}
                      onChange={(e) => setClassInput(e.target.value)}
                      className="w-full bg-navy-bg border border-navy/10 rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-yellow transition-all"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy uppercase block">{t("loc_area")}</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="text"
                        required
                        placeholder={t("loc_area_ph")}
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        className="w-full bg-navy-bg border border-navy/10 rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:border-yellow transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Salary */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy uppercase block">{t("monthly_budget")}</label>
                      <div className="relative">
                        <CircleDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                          type="text"
                          required
                          placeholder={t("monthly_budget_ph")}
                          value={salaryInput}
                          onChange={(e) => setSalaryInput(e.target.value)}
                          className="w-full bg-navy-bg border border-navy/10 rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:border-yellow transition-all"
                        />
                      </div>
                    </div>

                    {/* Days per week */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy uppercase block">{t("days_week")}</label>
                      <select
                        value={daysInput}
                        onChange={(e) => setDaysInput(e.target.value)}
                        className="w-full bg-navy-bg border border-navy/10 rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-yellow transition-all"
                      >
                        <option value="২ দিন">২ দিন / সপ্তাহ</option>
                        <option value="৩ দিন">৩ দিন / সপ্তাহ</option>
                        <option value="৪ দিন">৪ দিন / সপ্তাহ</option>
                        <option value="৫ দিন">৫ দিন / সপ্তাহ</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-yellow text-navy font-bold rounded-xl text-xs sm:text-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t("post_request_btn")}</span>
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Live Job Board Feed (Matching Section 4 Step 2) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-navy/5 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-navy/10 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-teal" />
                  <div>
                    <h3 className="text-lg font-bold text-navy">{t("live_job_board")}</h3>
                    <p className="text-xs text-text-muted">{t("live_job_desc")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-navy/5 text-navy rounded-full text-xs font-bold">
                  <Search className="w-3.5 h-3.5 text-teal" />
                  <span>{t("dhaka_other_dist")}</span>
                </div>
              </div>

              {/* Jobs List */}
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 rounded-2xl border border-navy/10 hover:border-yellow/50 bg-navy-bg/50 hover:bg-white hover:shadow-md transition-all space-y-3 relative overflow-hidden"
                  >
                    {/* Subject & Class */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="text-base sm:text-lg font-bold text-navy leading-tight">
                        {job.subject}
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-teal/10 text-teal border border-teal/20 text-xs font-bold w-fit">
                        {job.className}
                      </span>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                      <div className="flex items-center gap-1.5 text-xs text-text-muted">
                        <MapPin className="w-3.5 h-3.5 text-navy shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-text-muted font-semibold text-navy">
                        <CircleDollarSign className="w-3.5 h-3.5 text-teal shrink-0" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-text-muted col-span-2 sm:col-span-1">
                        <ClipboardList className="w-3.5 h-3.5 text-yellow shrink-0" />
                        <span>{job.daysPerWeek}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-navy/5 flex items-center justify-between text-xs text-text-muted gap-4">
                      <span>{t("posted_by")} <strong className="text-navy">{job.postedBy}</strong></span>
                      
                      {currentUser.role === "tutor" ? (
                        job.applied ? (
                          <span className="px-4 py-1.5 rounded-lg bg-teal text-white font-bold inline-flex items-center gap-1 text-[11px] sm:text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t("applied_admin")}</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApply(job.id)}
                            className="px-4 py-1.5 rounded-lg bg-yellow hover:bg-yellow/90 text-navy font-bold shadow-sm hover:shadow-md transition-all text-[11px] sm:text-xs cursor-pointer"
                          >
                            {t("apply")}
                          </button>
                        )
                      ) : (
                        <span className="text-[10px] text-teal font-semibold italic">{t("reg_guardian_view")}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety rules block */}
            <div className="p-5 rounded-2xl bg-teal/5 border border-teal/10 space-y-2">
              <div className="flex items-center gap-1.5 text-teal font-bold text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{t("poraboo_safety")}</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                {t("poraboo_safety_desc")}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
