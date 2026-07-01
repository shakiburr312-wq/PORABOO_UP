import { useAuth } from "../lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import { Profile, supabase, isSupabaseConfigured } from "../lib/supabase";
import { SUBJECTS_OPTIONS, CLASS_LEVELS, MEDIUM_OPTIONS, DAYS_PER_WEEK, TIME_PREFERENCES, DHAKA_LOCATIONS, GENDER_PREFERENCES } from "../lib/constants";
import { ArrowLeft, RefreshCw, Search, Check, X, MapPin } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

interface JobPostCreateProps {
  
  
}

export default function JobPostCreate({  }: JobPostCreateProps) {
  const navigate = useNavigate();
  const { currentUser, logout: onLogout } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    subjects: [] as string[],
    classLevel: "",
    medium: "",
    daysPerWeek: "",
    timePreference: [] as string[],
    thana: "",
    subArea: "",
    budgetMin: 2000,
    budgetMax: 5000,
    genderPreference: "No preference",
    notes: ""
  });

  const [budgetMinFocused, setBudgetMinFocused] = useState(false);
  const [budgetMaxFocused, setBudgetMaxFocused] = useState(false);

  const [thanaSearchQuery, setThanaSearchQuery] = useState("");
  const [isThanaDropdownOpen, setIsThanaDropdownOpen] = useState(false);

  const toggleArrayItem = (item: string, array: string[], setArray: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.subjects.length === 0) {
      setErrorMsg(t("select_sub_error"));
      return;
    }
    if (!formData.classLevel || !formData.medium || !formData.daysPerWeek || !formData.thana) {
      setErrorMsg(t("fill_req_error"));
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('job_posts').insert([{
        guardian_id: currentUser.id,
        subjects: formData.subjects,
        class_level: formData.classLevel,
        medium: formData.medium,
        days_per_week: formData.daysPerWeek,
        time_preference: formData.timePreference,
        thana: formData.thana,
        sub_area: formData.subArea || null,
        budget_min: formData.budgetMin,
        budget_max: formData.budgetMax,
        notes: formData.notes,
        gender_preference: formData.genderPreference,
        status: 'open'
      }]);

      if (error) {
        setErrorMsg(t("failed_create_post") + error.message);
        setLoading(false);
        return;
      }
    } else {
      // Simulate delay
      await new Promise(r => setTimeout(r, 1000));
    }

    setLoading(false);
    navigate("/job-board");
  };

  return (
    <div className="form-page-bg min-h-screen">
      <div className="max-w-3xl mx-auto p-4 sm:p-8 pt-20 pb-24 animate-fadeInUp">
        <button 
          onClick={() => navigate("/guardian/dashboard")}
          className="flex items-center gap-2 text-slate-500 hover:text-navy font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> {t("back_to_dash")}
        </button>

        <div className="glass-card p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-2 bangla-font">{t("new_tutor_post")}</h1>
          <p className="text-text-muted mb-8 bangla-font">{t("post_job_desc")}</p>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Subjects */}
          <div>
            <label className="bangla-font font-bold text-navy block mb-3">{t("subjects_needed")} <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS_OPTIONS.map(sub => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => toggleArrayItem(sub, formData.subjects, (arr) => setFormData({...formData, subjects: arr}))}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${formData.subjects.includes(sub) ? 'bg-teal/10 border-teal text-teal font-semibold' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Class Level */}
            <div className="input-group">
              <label className="bangla-font font-bold text-navy">{t("class_level")} <span className="text-red-500">*</span></label>
              <select required value={formData.classLevel} onChange={e => setFormData({...formData, classLevel: e.target.value})} className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-yellow bg-white appearance-none">
                <option value="" disabled>{t("select_class")}</option>
                {CLASS_LEVELS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            {/* Medium */}
            <div>
              <label className="bangla-font font-bold text-navy block mb-3">{t("medium")} <span className="text-red-500">*</span></label>
              <div className="flex flex-col gap-2">
                {MEDIUM_OPTIONS.map(med => (
                  <label key={med} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      required
                      type="radio" 
                      name="medium" 
                      checked={formData.medium === med} 
                      onChange={() => setFormData({...formData, medium: med})} 
                      className="text-navy focus:ring-navy"
                    />
                    <span className="text-sm text-slate-700">{med}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Days per week */}
            <div>
              <label className="bangla-font font-bold text-navy block mb-3">{t("days_per_week")} <span className="text-red-500">*</span></label>
              <div className="flex flex-col gap-2">
                {DAYS_PER_WEEK.map(days => (
                  <label key={days} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      required
                      type="radio" 
                      name="days" 
                      checked={formData.daysPerWeek === days} 
                      onChange={() => setFormData({...formData, daysPerWeek: days})} 
                      className="text-navy focus:ring-navy"
                    />
                    <span className="text-sm text-slate-700">{days}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Preference */}
            <div>
              <label className="bangla-font font-bold text-navy block mb-3">{t("time_pref")}</label>
              <div className="flex flex-wrap gap-2">
                {TIME_PREFERENCES.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => toggleArrayItem(time, formData.timePreference, (arr) => setFormData({...formData, timePreference: arr}))}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${formData.timePreference.includes(time) ? 'bg-blue/10 border-blue text-blue font-semibold' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="bangla-font font-bold text-navy block mb-3">{t("location")} <span className="text-red-500">*</span></label>
            
            {/* Thana Selection */}
            {!formData.thana ? (
              <div className="relative mb-4">
                <div className="flex items-center border-2 border-slate-200 rounded-xl bg-white overflow-hidden focus-within:border-yellow transition-colors">
                  <Search className="w-5 h-5 text-slate-400 ml-3" />
                  <input 
                    type="text" 
                    placeholder={t("search_thana")} 
                    value={thanaSearchQuery}
                    onChange={(e) => {
                      setThanaSearchQuery(e.target.value);
                      setIsThanaDropdownOpen(true);
                    }}
                    onFocus={() => setIsThanaDropdownOpen(true)}
                    className="w-full p-3 outline-none"
                  />
                </div>
                
                {isThanaDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    <div className="p-2 flex justify-end sticky top-0 bg-white border-b border-slate-100">
                      <button type="button" onClick={() => setIsThanaDropdownOpen(false)} className="text-slate-400 hover:text-navy p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {Object.keys(DHAKA_LOCATIONS).filter(thana => thana.toLowerCase().includes(thanaSearchQuery.toLowerCase())).map(thana => (
                      <div 
                        key={thana}
                        className="px-4 py-3 cursor-pointer border-b border-slate-50 hover:bg-yellow/5 hover:text-navy transition-colors text-slate-700"
                        onClick={() => {
                          setFormData({...formData, thana, subArea: ""});
                          setIsThanaDropdownOpen(false);
                          setThanaSearchQuery("");
                        }}
                      >
                        {thana}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-navy">
                  <MapPin className="w-5 h-5 text-yellow" /> {formData.thana}
                </div>
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, thana: "", subArea: ""})}
                  className="text-sm text-red-500 hover:underline"
                >
                  {t("change_thana")}
                </button>
              </div>
            )}

            {/* Sub-area Selection */}
            {formData.thana && DHAKA_LOCATIONS[formData.thana]?.length > 0 && (
              <div className="input-group">
                <label className="bangla-font font-medium">{t("specific_area")}</label>
                <select 
                  value={formData.subArea} 
                  onChange={e => setFormData({...formData, subArea: e.target.value})} 
                  className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-yellow bg-white appearance-none"
                >
                  <option value="">{t("anywhere_in")} {formData.thana}</option>
                  {DHAKA_LOCATIONS[formData.thana].map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Budget */}
          <div>
            <label className="bangla-font font-bold text-navy block mb-3">{t("monthly_budget")}</label>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="input-group">
                <label className="text-xs text-slate-500">{t("minimum")}</label>
                <div className="relative mt-1">
                  {!budgetMinFocused && formData.budgetMin > 0 && (
                    <span className="absolute inset-0 flex items-center px-4 text-teal font-medium pointer-events-none">
                      ৳{parseInt(String(formData.budgetMin)).toLocaleString('en-IN')}/মাস
                    </span>
                  )}
                  <input 
                    type="number"
                    min="0"
                    value={formData.budgetMin || ''} 
                    onChange={e => setFormData({...formData, budgetMin: parseInt(e.target.value) || 0})}
                    onFocus={() => setBudgetMinFocused(true)}
                    onBlur={() => setBudgetMinFocused(false)}
                    placeholder="e.g. 2,000"
                    className={`input-field ${!budgetMinFocused && formData.budgetMin > 0 ? 'text-transparent' : ''}`}
                    style={{ 
                      color: (!budgetMinFocused && formData.budgetMin > 0) ? 'transparent' : '#1B2F6E', 
                      WebkitTextFillColor: (!budgetMinFocused && formData.budgetMin > 0) ? 'transparent' : '#1B2F6E' 
                    }}
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="text-xs text-slate-500">{t("maximum")}</label>
                <div className="relative mt-1">
                  {!budgetMaxFocused && formData.budgetMax > 0 && (
                    <span className="absolute inset-0 flex items-center px-4 text-teal font-medium pointer-events-none">
                      ৳{parseInt(String(formData.budgetMax)).toLocaleString('en-IN')}/মাস
                    </span>
                  )}
                  <input 
                    type="number"
                    min="0" 
                    value={formData.budgetMax || ''} 
                    onChange={e => setFormData({...formData, budgetMax: parseInt(e.target.value) || 0})} 
                    onFocus={() => setBudgetMaxFocused(true)}
                    onBlur={() => setBudgetMaxFocused(false)}
                    placeholder="e.g. 5,000"
                    className={`input-field ${!budgetMaxFocused && formData.budgetMax > 0 ? 'text-transparent' : ''}`}
                    style={{ 
                      color: (!budgetMaxFocused && formData.budgetMax > 0) ? 'transparent' : '#1B2F6E', 
                      WebkitTextFillColor: (!budgetMaxFocused && formData.budgetMax > 0) ? 'transparent' : '#1B2F6E' 
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Simple Slider */}
            <div className="mt-6 px-2">
              <input 
                type="range" 
                min="2000" 
                max="20000" 
                step="500" 
                value={formData.budgetMax} 
                onChange={e => setFormData({...formData, budgetMax: parseInt(e.target.value), budgetMin: Math.min(formData.budgetMin, parseInt(e.target.value))})} 
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-yellow"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>৳2,000</span>
                <span>৳20,000+</span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Gender Preference */}
            <div>
              <label className="bangla-font font-bold text-navy block mb-3">{t("tutor_gender_pref")}</label>
              <div className="flex flex-col gap-2">
                {GENDER_PREFERENCES.map(gender => (
                  <label key={gender} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="gender" 
                      checked={formData.genderPreference === gender} 
                      onChange={() => setFormData({...formData, genderPreference: gender})} 
                      className="text-navy focus:ring-navy"
                    />
                    <span className="text-sm text-slate-700">{gender}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="input-group">
              <label className="bangla-font font-bold text-navy flex justify-between">
                {t("additional_notes")}
                <span className="text-xs text-slate-400 font-normal">{formData.notes.length}/200</span>
              </label>
              <textarea 
                value={formData.notes} 
                onChange={e => setFormData({...formData, notes: e.target.value.slice(0, 200)})} 
                placeholder={t("specific_req_placeholder")} 
                rows={4}
                className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-yellow resize-none"
              ></textarea>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 rounded-full font-bold text-lg bg-yellow text-white hover:bg-yellow/90 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : t("post_button")}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}
