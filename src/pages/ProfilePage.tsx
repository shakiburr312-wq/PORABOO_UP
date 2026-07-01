import { useAuth } from "../lib/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { Camera, MapPin, GraduationCap, Briefcase, BookOpen, Layers, Globe, DollarSign, Edit2, Link as LinkIcon, Edit, Users, X, Plus } from "lucide-react";
import { isSupabaseConfigured, supabase, Profile } from "../lib/supabase";
import { useLanguage } from "../hooks/useLanguage";
import BounceDots from "../components/BounceDots";
import Navbar from "../components/Navbar";

interface ProfilePageProps {
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, logout: onLogout, updateProfile } = useAuth();
  
  const profileId = id || (currentUser ? currentUser.id : "");
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [tutorData, setTutorData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "info" | "connections" | "photos">("posts");
  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [savingEdit, setSavingEdit] = useState(false);

  // Post Creator State
  const [postContent, setPostContent] = useState("");

  const isOwnProfile = currentUser.id === profileId;
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfileData();
  }, [profileId]);

  const fetchProfileData = async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      // 1. Fetch public.profiles
      const { data: pData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();
      
      setProfileData(pData || null);

      if (pData) {
        setBioInput(pData.bio || "");
      }

      // 2. Fetch tutor_profiles
      const { data: tData } = await supabase
        .from('tutor_profiles')
        .select('*')
        .eq('id', profileId)
        .single();
      
      setTutorData(tData || null);

      if (tData && !pData?.bio) {
         setBioInput(tData.bio || "");
      }

      // 3. Fetch Posts
      const { data: postData } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id ( full_name, role, avatar_url )
        `)
        .eq('author_id', profileId)
        .order('created_at', { ascending: false });

      if (postData) {
        setPosts(postData.map(p => ({
          ...p,
          author_name: p.profiles?.full_name || "Unknown",
          author_role: p.profiles?.role || "user",
          author_avatar: p.profiles?.avatar_url
        })));
      }
    }
    setLoading(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingAvatar(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const fileExt = file.name.split('.').pop();
        const fileName = `profile.jpg`; 
        const filePath = `${profileId}/${fileName}?t=${Date.now()}`;
        
        const { data, error } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { upsert: true });

        if (!error && data) {
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(data.path);
          
          await supabase.from('profiles').update({ avatar_url: urlData.publicUrl }).eq('id', profileId);
          setProfileData({ ...profileData, avatar_url: urlData.publicUrl });
          if (isOwnProfile) {
            ({ ...currentUser, avatar_url: urlData.publicUrl } as Profile);
            const local = localStorage.getItem("poraboo_current_user");
            if (local) {
              const parsed = JSON.parse(local);
              parsed.avatar_url = urlData.publicUrl;
              localStorage.setItem("poraboo_current_user", JSON.stringify(parsed));
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
    setUploadingAvatar(false);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingCover(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const filePath = `${profileId}/cover.jpg?t=${Date.now()}`;
        
        const { data, error } = await supabase.storage
          .from('covers')
          .upload(filePath, file, { upsert: true });

        if (!error && data) {
          const { data: urlData } = supabase.storage.from('covers').getPublicUrl(data.path);
          
          await supabase.from('profiles').update({ cover_url: urlData.publicUrl }).eq('id', profileId);
          setProfileData({ ...profileData, cover_url: urlData.publicUrl });
        }
      }
    } catch (err) {
      console.error(err);
    }
    setUploadingCover(false);
  };

  const handleSaveBio = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('profiles').update({ bio: bioInput }).eq('id', profileId);
      await supabase.from('tutor_profiles').update({ bio: bioInput }).eq('id', profileId);
      setProfileData({ ...profileData, bio: bioInput });
      setEditingBio(false);
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = () => {
    setEditForm({
      bio: profileData?.bio || tutorData?.bio || "",
      education_qualification: tutorData?.education_qualification || "",
      college_university: tutorData?.college_university || "",
      experience: tutorData?.experience || "",
      present_address: tutorData?.present_address || "",
      subjects: tutorData?.subjects ? tutorData.subjects.join(", ") : "",
      class_levels: tutorData?.class_levels ? tutorData.class_levels.join(", ") : "",
      demo_class_link: tutorData?.demo_class_link || ""
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfileInfo = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    setSavingEdit(true);
    try {
      // Update profiles (bio, living_area if needed)
      await supabase.from('profiles').update({
        bio: editForm.bio
      }).eq('id', profileId);

      // Update tutor_profiles
      const subjectsArray = editForm.subjects.split(",").map((s:string) => s.trim()).filter((s:string) => s);
      const classLevelsArray = editForm.class_levels.split(",").map((s:string) => s.trim()).filter((s:string) => s);

      await supabase.from('tutor_profiles').update({
        bio: editForm.bio,
        education_qualification: editForm.education_qualification,
        college_university: editForm.college_university,
        experience: editForm.experience,
        present_address: editForm.present_address,
        subjects: subjectsArray,
        class_levels: classLevelsArray,
        demo_class_link: editForm.demo_class_link
      }).eq('id', profileId);

      setProfileData({ ...profileData, bio: editForm.bio });
      setTutorData({ 
        ...tutorData, 
        bio: editForm.bio,
        education_qualification: editForm.education_qualification,
        college_university: editForm.college_university,
        experience: editForm.experience,
        present_address: editForm.present_address,
        subjects: subjectsArray,
        class_levels: classLevelsArray,
        demo_class_link: editForm.demo_class_link
      });

      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
    }
    setSavingEdit(false);
  };

  const handlePostSubmit = async () => {
    if (!postContent.trim()) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('posts').insert([{
          author_id: currentUser.id,
          content: postContent,
          visibility: 'public'
        }]);
        if (!error) {
          setPostContent("");
          fetchProfileData(); // Refresh posts
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F2F5]">
        <div className="pt-24 flex justify-center items-center h-64">
          <BounceDots />
        </div>
      </div>
    );
  }

  const avatarUrl = profileData?.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(profileData?.full_name || "User") + "&background=1a365d&color=fff";
  const coverUrl = profileData?.cover_url;
  const role = profileData?.role || "user";
  const isTutor = role === "tutor";
  const isGuardianViewingTutor = currentUser.role === "guardian" && role === "tutor";
  const connectionCount = 0; // Replace with actual connection count if implemented

  // Photo grid images from posts
  const photoUrls = posts.flatMap(p => p.media_urls || []).slice(0, 9);

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20 font-sans">
      
      {/* Profile Header Area */}
      <div className="bg-white shadow-sm mb-4 pt-14">
        <div className="max-w-[1000px] mx-auto">
          {/* Cover Photo */}
          <div className="relative w-full h-[200px] md:h-[350px] bg-gradient-to-br from-[#1B2F6E] to-[#0F7B6C] rounded-b-lg overflow-hidden group">
            {coverUrl && <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />}
            {isOwnProfile && (
              <div className="absolute bottom-4 right-4">
                <button 
                  onClick={() => coverInputRef.current?.click()} 
                  className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1.5 px-3 rounded-md shadow flex items-center gap-2 text-sm transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span className="hidden md:inline">কভার ফটো পরিবর্তন করুন</span>
                </button>
                <input type="file" ref={coverInputRef} accept="image/*" className="hidden" onChange={handleCoverUpload} />
              </div>
            )}
            {uploadingCover && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <BounceDots />
              </div>
            )}
          </div>

          {/* Profile Header Info */}
          <div className="px-4 md:px-8 pb-4 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between md:mb-4 gap-4">
              {/* Avatar and Details */}
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 mt-[-60px] md:mt-0 relative z-10">
                <div className="relative md:absolute md:bottom-[-20px] md:left-0 shrink-0 group">
                  <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="w-[100px] h-[100px] md:w-[168px] md:h-[168px] rounded-full object-cover border-4 border-white shadow-[0_2px_8px_rgba(0,0,0,0.2)] bg-white"
                  />
                  {isOwnProfile && (
                    <button 
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white border-4 border-transparent"
                    >
                      <Camera className="w-8 h-8" />
                    </button>
                  )}
                  <input type="file" ref={avatarInputRef} accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center z-20 border-4 border-white">
                      <BounceDots />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left md:pl-[180px] md:pb-4">
                  <h1 className="text-2xl md:text-[32px] font-bold text-[#1B2F6E] flex items-center justify-center md:justify-start gap-2 leading-tight">
                    {profileData?.full_name}
                  </h1>
                  <div className="mt-1 flex flex-col md:flex-row items-center gap-2">
                    <span className="font-semibold text-[15px] text-[#65676B]">
                      {connectionCount} সংযোগ
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-sm text-white uppercase ${role === "tutor" ? "bg-[#F5A623]" : "bg-[#0F7B6C]"}`}>
                      {role === "tutor" ? "TUTOR" : "GUARDIAN"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center md:justify-end md:pb-4 shrink-0 w-full md:w-auto">
                {isOwnProfile ? (
                  <button 
                    onClick={openEditModal}
                    className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-md transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    প্রোফাইল সম্পাদনা করুন
                  </button>
                ) : isGuardianViewingTutor ? (
                  <button className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2 bg-[#F5A623] hover:bg-yellow-500 text-[#1B2F6E] font-bold rounded-md transition-all shadow-sm">
                    নিয়োগ করুন
                  </button>
                ) : (
                  <button className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2 bg-[#1B2F6E] hover:bg-navy-800 text-white font-semibold rounded-md transition-all shadow-sm">
                    <Users className="w-4 h-4" />
                    সংযুক্ত হন
                  </button>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mt-2 md:pl-[180px] text-center md:text-left md:-mt-2 mb-2">
              {editingBio ? (
                <div className="max-w-[400px] mx-auto md:mx-0">
                  <textarea 
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value.slice(0, 101))}
                    className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-[15px] focus:outline-none focus:ring-1 focus:ring-[#1B2F6E] min-h-[80px] resize-none text-center md:text-left bangla-font"
                    placeholder="আপনার সম্পর্কে কিছু লিখুন..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{101 - bioInput.length} character(s) remaining</span>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingBio(false)} className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors font-semibold">{t("profile_cancel")}</button>
                      <button onClick={handleSaveBio} className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-md transition-colors font-semibold">{t("profile_save")}</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative group inline-block">
                  {(profileData?.bio || tutorData?.bio) ? (
                    <p className="text-[#333333] text-[15px] whitespace-pre-wrap bangla-font">
                      {profileData?.bio || tutorData?.bio}
                    </p>
                  ) : isOwnProfile ? (
                    <button onClick={() => setEditingBio(true)} className="text-[#1B2F6E] text-[15px] font-semibold hover:underline cursor-pointer">
                      + বায়ো যোগ করুন
                    </button>
                  ) : null}
                  {isOwnProfile && (profileData?.bio || tutorData?.bio) && (
                    <button 
                      onClick={() => setEditingBio(true)}
                      className="absolute -right-6 top-0 p-1 bg-gray-100 shadow-sm rounded-full text-gray-600 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-300 w-full" />

          {/* Tabs */}
          <div className="flex px-4 md:px-8 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-4 text-[15px] font-semibold whitespace-nowrap transition-colors border-b-[3px] ${activeTab === "posts" ? "border-[#1B2F6E] text-[#1B2F6E]" : "border-transparent text-[#65676B] hover:bg-gray-100 rounded-t-md"}`}
            >
              পোস্টসমূহ
            </button>
            <button 
              onClick={() => setActiveTab("info")}
              className={`px-4 py-4 text-[15px] font-semibold whitespace-nowrap transition-colors border-b-[3px] ${activeTab === "info" ? "border-[#1B2F6E] text-[#1B2F6E]" : "border-transparent text-[#65676B] hover:bg-gray-100 rounded-t-md"}`}
            >
              তথ্য
            </button>
            <button 
              onClick={() => setActiveTab("connections")}
              className={`px-4 py-4 text-[15px] font-semibold whitespace-nowrap transition-colors border-b-[3px] ${activeTab === "connections" ? "border-[#1B2F6E] text-[#1B2F6E]" : "border-transparent text-[#65676B] hover:bg-gray-100 rounded-t-md"}`}
            >
              সংযোগ
            </button>
            <button 
              onClick={() => setActiveTab("photos")}
              className={`px-4 py-4 text-[15px] font-semibold whitespace-nowrap transition-colors border-b-[3px] ${activeTab === "photos" ? "border-[#1B2F6E] text-[#1B2F6E]" : "border-transparent text-[#65676B] hover:bg-gray-100 rounded-t-md"}`}
            >
              ছবি
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1000px] mx-auto px-0 md:px-4 flex flex-col md:flex-row gap-4">
        
        {/* LEFT COLUMN (37% on desktop) */}
        <div className="w-full md:w-[360px] flex flex-col gap-4 px-2 md:px-0">
          
          {/* Intro Card */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">পরিচিতি</h2>
            <div className="space-y-4">
              {tutorData?.education_qualification && (
                <div className="flex gap-3 items-start">
                  <GraduationCap className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                  <p className="text-[15px] text-[#333333]">
                    <span className="font-semibold">{tutorData.education_qualification}</span> पढ़ेছেন {tutorData.college_university && <span className="font-semibold">{tutorData.college_university}</span>}
                  </p>
                </div>
              )}
              {tutorData?.experience && (
                <div className="flex gap-3 items-start">
                  <Briefcase className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                  <p className="text-[15px] text-[#333333]">
                    <span className="font-semibold">{tutorData.experience}</span> অভিজ্ঞতা
                  </p>
                </div>
              )}
              {tutorData?.present_address && (
                <div className="flex gap-3 items-start">
                  <MapPin className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                  <p className="text-[15px] text-[#333333]">
                    <span className="font-semibold">{tutorData.present_address.split(",")[0] || tutorData.present_address}</span> এলাকায় থাকেন
                  </p>
                </div>
              )}
              {tutorData?.subjects && tutorData.subjects.length > 0 && (
                <div className="flex gap-3 items-start">
                  <BookOpen className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                  <p className="text-[15px] text-[#333333]">
                    বিষয়: <span className="font-semibold">{tutorData.subjects.join(", ")}</span>
                  </p>
                </div>
              )}
              {tutorData?.class_levels && tutorData.class_levels.length > 0 && (
                <div className="flex gap-3 items-start">
                  <Layers className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                  <p className="text-[15px] text-[#333333]">
                    ক্লাস: <span className="font-semibold">{tutorData.class_levels.join(", ")}</span>
                  </p>
                </div>
              )}
              
              {tutorData?.expected_salary && (
                <div className="flex gap-3 items-start">
                  <DollarSign className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                  <p className="text-[15px] text-[#333333]">
                    {isOwnProfile || currentUser.role === 'admin' || (currentUser.role === 'guardian' && false) ? (
                      <>প্রত্যাশিত বেতন: <span className="font-semibold">৳ {tutorData.expected_salary}</span></>
                    ) : (
                      <>প্রত্যাশিত বেতন: <span className="text-gray-500 italic">🔒 লুকানো আছে</span></>
                    )}
                  </p>
                </div>
              )}

              {tutorData?.demo_class_link && (
                <div className="flex gap-3 items-start">
                  <LinkIcon className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                  <a href={tutorData.demo_class_link} target="_blank" rel="noopener noreferrer" className="text-[#1B2F6E] hover:underline text-[15px] break-all">
                    ডেমো ক্লাস লিংক
                  </a>
                </div>
              )}
            </div>

            {isOwnProfile && (
              <button 
                onClick={openEditModal}
                className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-md transition-colors"
              >
                তথ্য সম্পাদনা করুন
              </button>
            )}
          </div>

          {/* Photos Card (Thumbnails) */}
          {photoUrls.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">ছবি</h2>
                <button onClick={() => setActiveTab("photos")} className="text-[#1B2F6E] hover:bg-gray-100 px-2 py-1 rounded-md text-[15px]">
                  সব ছবি দেখুন
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden">
                {photoUrls.map((url, i) => (
                  <img key={i} src={url} alt="Post media" className="w-full aspect-square object-cover" />
                ))}
              </div>
            </div>
          )}

          {/* Connections Card */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">সংযোগ</h2>
              <button onClick={() => setActiveTab("connections")} className="text-[#1B2F6E] hover:bg-gray-100 px-2 py-1 rounded-md text-[15px]">
                সব দেখুন
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {/* Dummy data for layout presentation */}
              <div className="text-center">
                 <img src="https://ui-avatars.com/api/?name=F&background=1a365d&color=fff" className="w-full aspect-square rounded-md object-cover mb-1" />
                 <span className="text-xs font-semibold text-gray-800">Faisal</span>
              </div>
              <div className="text-center">
                 <img src="https://ui-avatars.com/api/?name=R&background=0F7B6C&color=fff" className="w-full aspect-square rounded-md object-cover mb-1" />
                 <span className="text-xs font-semibold text-gray-800">Rahim</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (63% on desktop) */}
        <div className="flex-1 flex flex-col gap-4 px-2 md:px-0">
          
          {/* Active Tab Content */}
          {activeTab === "posts" && (
            <>
              {/* Post Creator Box */}
              {isOwnProfile && (
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex gap-2 items-center mb-3">
                    <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                    <button 
                      onClick={() => window.location.hash = "#/feed"}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-500 text-left px-4 py-2.5 rounded-full flex-1 text-[15px] transition-colors"
                    >
                      {profileData?.full_name?.split(" ")[0]}, আপনার কী মনে আছে?
                    </button>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex">
                    <button onClick={() => window.location.hash = "#/feed"} className="flex-1 flex justify-center items-center gap-2 text-gray-600 hover:bg-gray-100 py-2 rounded-md font-semibold text-[15px]">
                      <Camera className="w-6 h-6 text-green-500" />
                      ছবি যোগ করুন
                    </button>
                  </div>
                </div>
              )}

              {/* Feed */}
              <div className="space-y-4">
                {posts.length > 0 ? posts.map(post => (
                  <div key={post.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <img src={post.author_avatar || "https://ui-avatars.com/api/?name=U&background=1a365d&color=fff"} className="w-10 h-10 rounded-full object-cover" alt="" />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-[15px]">{post.author_name}</h4>
                        <p className="text-[13px] text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {post.content && (
                      <p className="text-[#333333] text-[15px] mb-3 whitespace-pre-wrap bangla-font">{post.content}</p>
                    )}
                    {post.media_urls && post.media_urls.length > 0 && (
                      <div className={`grid gap-1 -mx-4 -mb-4 ${post.media_urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {post.media_urls.map((url: string, i: number) => (
                          <img key={i} src={url} className="w-full aspect-square object-cover" alt="Post" />
                        ))}
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
                    <p className="text-gray-500 font-semibold">কোনো পোস্ট নেই</p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "info" && (
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 text-center py-10">
               <p className="text-gray-500 font-semibold">বিস্তারিত তথ্য এই মুহূর্তে উপলব্ধ নয়</p>
            </div>
          )}

          {activeTab === "photos" && (
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
               <h2 className="text-xl font-bold text-gray-900 mb-4">আপনার ছবিসমূহ</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                 {photoUrls.map((url, i) => (
                    <img key={i} src={url} alt="Photo" className="w-full aspect-square object-cover rounded-md" />
                 ))}
                 {photoUrls.length === 0 && <p className="text-gray-500 col-span-4 text-center py-10">কোনো ছবি নেই</p>}
               </div>
            </div>
          )}
          
          {activeTab === "connections" && (
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 text-center py-10">
               <p className="text-gray-500 font-semibold">কোনো সংযোগ নেই</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[700px] h-full sm:h-auto sm:max-h-[90vh] rounded-lg shadow-xl flex flex-col z-10 border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{t("profile_edit")}</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">বায়ো (সর্বোচ্চ ১০১ অক্ষর)</label>
                  <textarea 
                    value={editForm.bio}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value.slice(0, 101)})}
                    className="w-full bg-gray-50 border border-gray-300 rounded-md p-3 text-[15px] focus:outline-none focus:ring-1 focus:ring-[#1B2F6E]"
                    rows={2}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">{editForm.bio?.length || 0}/101</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t("profile_education")}</label>
                    <input 
                      type="text" 
                      value={editForm.education_qualification}
                      onChange={(e) => setEditForm({...editForm, education_qualification: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-300 rounded-md p-3 text-[15px] focus:outline-none focus:ring-1 focus:ring-[#1B2F6E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">প্রতিষ্ঠান</label>
                    <input 
                      type="text" 
                      value={editForm.college_university}
                      onChange={(e) => setEditForm({...editForm, college_university: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-300 rounded-md p-3 text-[15px] focus:outline-none focus:ring-1 focus:ring-[#1B2F6E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t("profile_experience")}</label>
                  <input 
                    type="text" 
                    value={editForm.experience}
                    onChange={(e) => setEditForm({...editForm, experience: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-300 rounded-md p-3 text-[15px] focus:outline-none focus:ring-1 focus:ring-[#1B2F6E]"
                    placeholder="যেমন: ৩ বছর"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t("profile_area")}</label>
                  <input 
                    type="text" 
                    value={editForm.present_address}
                    onChange={(e) => setEditForm({...editForm, present_address: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-300 rounded-md p-3 text-[15px] focus:outline-none focus:ring-1 focus:ring-[#1B2F6E]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t("profile_subjects")}</label>
                  <input 
                    type="text" 
                    value={editForm.subjects}
                    onChange={(e) => setEditForm({...editForm, subjects: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-300 rounded-md p-3 text-[15px] focus:outline-none focus:ring-1 focus:ring-[#1B2F6E]"
                    placeholder="বাংলা, ইংরেজি, গণিত"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ক্লাস (কমা দিয়ে আলাদা করুন)</label>
                  <input 
                    type="text" 
                    value={editForm.class_levels}
                    onChange={(e) => setEditForm({...editForm, class_levels: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-300 rounded-md p-3 text-[15px] focus:outline-none focus:ring-1 focus:ring-[#1B2F6E]"
                    placeholder="১ম - ৫ম, ৬ষ্ঠ - ৮ম"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ডেমো ক্লাস লিংক (YouTube/Drive)</label>
                  <input 
                    type="url" 
                    value={editForm.demo_class_link}
                    onChange={(e) => setEditForm({...editForm, demo_class_link: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-300 rounded-md p-3 text-[15px] focus:outline-none focus:ring-1 focus:ring-[#1B2F6E]"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
              >
                {t("profile_cancel")}
              </button>
              <button 
                onClick={handleSaveProfileInfo}
                disabled={savingEdit}
                className="px-8 py-2.5 text-sm font-bold bg-[#1B2F6E] hover:bg-navy-800 text-white rounded-md transition-colors flex items-center justify-center min-w-[120px]"
              >
                {savingEdit ? <BounceDots /> : "সংরক্ষণ করুন"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
