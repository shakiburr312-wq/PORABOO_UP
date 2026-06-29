import React, { useState, useEffect } from "react";
import { Profile, supabase, isSupabaseConfigured } from "../lib/supabase";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Image as ImageIcon,
  CheckCircle2,
  Home,
  Briefcase,
  PlusCircle,
  Bell,
  User,
  Settings
} from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

interface FeedProps {
  currentUser: Profile;
  navigateTo: (route: string) => void;
}

export default function Feed({ currentUser, navigateTo }: FeedProps) {
  const { t } = useLanguage();
  const [postContent, setPostContent] = useState("");
  const [visibility, setVisibility] = useState<"public" | "tutors_only" | "guardians_only">("public");
  const [showWarning, setShowWarning] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  
  const MAX_CHARS = 500;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            profiles:author_id ( full_name, role, avatar_url )
          `)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching posts:", error);
          return;
        }

        if (data) {
          const formattedPosts = data.map((p: any) => ({
            id: p.id,
            author_id: p.author_id,
            author_name: p.profiles?.full_name || "Unknown",
            author_role: p.profiles?.role || "user",
            author_avatar: p.profiles?.avatar_url,
            content: p.content,
            media_urls: p.media_urls || [],
            created_at: p.created_at,
            likes: 0,
            comments: 0,
            isLiked: false
          }));
          setPosts(formattedPosts);
        }
      } else {
        // Dummy data if supabase is not configured
        setPosts([
          {
            id: "1",
            author_id: "user-1",
            author_name: "Rafiqul Islam",
            author_role: "tutor",
            content: "Does anyone have good math worksheets for Class 8? I'm looking for geometry specific materials.",
            media_urls: previews,
            created_at: new Date().toISOString(),
            likes: 12,
            comments: 3,
            isLiked: false
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handlePostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      setPostContent(val);
      
      // Check for phone or email
      const phoneRegex = /01[0-9]{9}/g;
      const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
      if (phoneRegex.test(val) || emailRegex.test(val)) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }
  };

  const handlePostSubmit = async () => {
    if (!postContent.trim() && images.length === 0) return;
    if (showWarning) {
      alert("Please remove contact information before posting.");
      return;
    }
    
    setIsPosting(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Block contact info
        let safeContent = postContent;
        safeContent = safeContent.replace(/01[0-9]{9}/g, "***");
        safeContent = safeContent.replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, "***");

        // Upload images
        let imageUrls: string[] = [];
        for (const file of images) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}.${fileExt}`;
          
          const { data, error } = await supabase.storage
            .from('media')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (error) {
            console.error('Upload error:', error);
            alert('ছবি আপলোড ব্যর্থ: ' + error.message);
            continue;
          }

          const { data: urlData } = supabase.storage
            .from('media')
            .getPublicUrl(data.path);
          
          imageUrls.push(urlData.publicUrl);
        }

        const { error: postError } = await supabase
          .from('posts')
          .insert([{
            author_id: user.id,
            content: safeContent,
            visibility: visibility,
            media_urls: imageUrls,
            media_type: imageUrls.length > 0 ? 'image' : null
          }]);

        if (postError) {
          console.error("Post error:", postError);
          alert('পোস্ট ব্যর্থ হয়েছে');
        } else {
          setPostContent("");
          setImages([]);
          setPreviews([]);
          alert('পোস্ট সফল হয়েছে ✓');
          fetchPosts();
        }
      } else {
        // Simulate local fallback
        const safeContent = postContent.replace(/01[0-9]{9}/g, "***").replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, "***");
        const newPost = {
          id: Math.random().toString(),
          author_id: currentUser.id,
          author_name: currentUser.full_name || "User",
          author_role: currentUser.role,
          content: safeContent,
          media_urls: previews,
          created_at: new Date().toISOString(),
          likes: 0,
          comments: 0,
          isLiked: false
        };
        
        setPosts([newPost, ...posts]);
        setPostContent("");
        setImages([]);
        setPreviews([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPosting(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length + images.length > 4) {
      alert("সর্বোচ্চ ৪টি ছবি দেওয়া যাবে");
      return;
    }
    
    setImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file as File);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          isLiked: !p.isLiked,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  
  const handleShare = async (postId: string) => {
    const url = `${window.location.origin}/#/post/${postId}`;
    await navigator.clipboard.writeText(url);
    alert('লিংক কপি হয়েছে ✓');
  };

  const [expandedCommentId, setExpandedCommentId] = useState<string | null>(null);

  const [connectRequests, setConnectRequests] = useState<string[]>([]);
  
  const handleConnect = (tutorId: string) => {
    if (!connectRequests.includes(tutorId)) {
      setConnectRequests([...connectRequests, tutorId]);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-8 pt-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* LEFT SIDEBAR (Desktop 25%) */}
        <div className="hidden md:block md:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-navy/10 rounded-full flex items-center justify-center text-navy font-bold text-2xl border-4 border-navy/5 mb-3">
                {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h2 className="font-bold text-navy text-lg">{currentUser.full_name}</h2>
              <span className="inline-block px-3 py-1 bg-yellow/20 text-yellow-800 text-xs font-bold rounded-full mt-1 uppercase tracking-wider">
                {currentUser.role}
              </span>
            </div>
            
            {currentUser.role === 'tutor' && (
              <div className="mt-6">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">{t("profile_completion")}</span>
                  <span className="text-navy font-bold">85%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-yellow h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            )}
            
            <div className="mt-8 space-y-2">
              <button onClick={() => navigateTo('profile')} className="w-full text-left px-4 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 hover:text-navy transition-colors flex items-center gap-3">
                <User className="w-5 h-5 text-slate-400" /> {t("feed_profile")}
              </button>
              <button onClick={() => navigateTo('job-board')} className="w-full text-left px-4 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 hover:text-navy transition-colors flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-slate-400" /> {t("nav_jobs")}
              </button>
              <button className="w-full text-left px-4 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 hover:text-navy transition-colors flex items-center gap-3">
                <Settings className="w-5 h-5 text-slate-400" /> Settings
              </button>
            </div>
          </div>
        </div>

        {/* CENTER FEED (Desktop 50%) */}
        <div className="col-span-1 md:col-span-6 space-y-6">
          {/* Create Post Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-navy/10 rounded-full flex items-center justify-center text-navy font-bold shrink-0">
                {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-grow">
                <textarea 
                  value={postContent}
                  onChange={handlePostChange}
                  placeholder={t("feed_placeholder")}
                  className="w-full bg-slate-50 border-none rounded-xl p-4 resize-none h-24 focus:ring-2 focus:ring-navy/20 outline-none text-slate-700"
                />
                
                {showWarning && (
                  <div className="mt-3 bg-yellow/10 border border-yellow/30 text-yellow-800 text-sm p-3 rounded-lg flex items-start gap-2 animate-fadeInUp">
                    <span className="shrink-0">⚠️</span>
                    <p className="bangla-font font-medium">{t("feed_warning")}</p>
                  </div>
                )}
                
                
                {previews.length > 0 && (
                  <div className={`grid gap-2 mt-2 ${previews.length === 1 ? 'grid-cols-1' : previews.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                    {previews.map((src, i) => (
                      <div key={i} className="relative">
                        <img src={src} className="w-full aspect-square object-cover rounded-xl" />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/70"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer flex items-center gap-2 text-slate-400 hover:text-navy transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageSelect}
                      />
                      <ImageIcon size={20} />
                      <span className="text-sm bangla-font">
                        {t('feed_add_image')}
                      </span>
                    </label>
                    <select 
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value as any)}
                      className="bg-slate-50 border-none text-xs text-slate-600 py-1.5 px-3 rounded-lg font-medium outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <option value="public">{t("feed_visibility_public")}</option>
                      <option value="tutors_only">{t("feed_visibility_tutors")}</option>
                      <option value="guardians_only">{t("feed_visibility_guardians")}</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400 font-mono">{postContent.length}/{MAX_CHARS}</span>
                    <button 
                      onClick={handlePostSubmit}
                      disabled={isPosting || (!postContent.trim() && images.length === 0) || showWarning}
                      className="bg-yellow hover:bg-yellow-400 text-navy font-bold px-6 py-2 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bangla-font active:scale-95"
                    >
                      {isPosting ? t("wait") : t("feed_post_btn")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feed Posts */}
          <div className="space-y-6">
            {loadingPosts ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-pulse">
                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/5"></div>
                  </div>
                </div>
                <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6 mb-4"></div>
                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <div className="h-5 bg-slate-200 rounded w-12"></div>
                  <div className="h-5 bg-slate-200 rounded w-12"></div>
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-100">
                <p className="text-slate-500 bangla-font">{t("no_posts")}</p>
              </div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 transition-all hover:shadow-md animate-fadeInUp">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                        {post.author_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-navy leading-tight flex items-center gap-2">
                          {post.author_name}
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase">
                            {post.author_role}
                          </span>
                        </h4>
                        <span className="text-xs text-slate-400">
                          {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-navy p-1 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed mb-4">
                    {post.content}
                  </p>
                  
                  
                  {post.media_urls && post.media_urls.length > 0 && (
                    <div className={`grid gap-2 mb-4 ${post.media_urls.length === 1 ? 'grid-cols-1' : post.media_urls.length === 2 ? 'grid-cols-2' : post.media_urls.length === 3 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                      {post.media_urls.map((url: string, idx: number) => (
                        <div key={idx} className={`rounded-xl overflow-hidden border border-slate-100 bg-slate-50 ${post.media_urls.length === 3 && idx === 0 ? 'col-span-2' : ''}`}>
                          <img src={url} alt="post media" className="w-full aspect-square object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {currentUser.role === 'tutor' && post.author_role === 'tutor' && post.author_id !== currentUser.id && (
                    <button 
                      onClick={() => handleConnect(post.author_id)}
                      className={`mb-4 px-4 py-1.5 rounded-full text-sm font-bold transition-colors flex items-center gap-1 bangla-font ${
                        connectRequests.includes(post.author_id) 
                          ? 'bg-green-50 text-green-600' 
                          : 'bg-navy/5 hover:bg-navy/10 text-navy'
                      }`}
                    >
                      {connectRequests.includes(post.author_id) ? (
                        <>{t("feed_pending")} <CheckCircle2 className="w-4 h-4" /></>
                      ) : (
                        <><PlusCircle className="w-4 h-4" /> {t("feed_connect")}</>
                      )}
                    </button>
                  )}
                  
                  <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 text-sm font-medium transition-colors ${post.isLiked ? 'text-red-500' : 'text-slate-500 hover:text-navy'}`}
                    >
                      <Heart className={`w-5 h-5 transition-transform ${post.isLiked ? 'fill-current scale-110' : 'hover:scale-110'}`} />
                      <span>{t("feed_like")} {post.likes > 0 && `(${post.likes})`}</span>
                    </button>
                    <button 
                      onClick={() => setExpandedCommentId(expandedCommentId === post.id ? null : post.id)}
                      className="flex items-center gap-2 text-sm text-slate-500 hover:text-navy font-medium transition-colors hover:scale-105"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{t("feed_comment")} {post.comments > 0 && `(${post.comments})`}</span>
                    </button>
                    <button onClick={() => handleShare(post.id)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-navy font-medium transition-colors ml-auto hover:scale-105">
                      <Share2 className="w-5 h-5" />
                      <span>{t("feed_share")}</span>
                    </button>
                  </div>
                  
                  {/* Comments Section */}
                  {expandedCommentId === post.id && (
                    <div className="mt-4 pt-4 border-t border-slate-50 space-y-4 animate-fadeIn">
                      {/* Dummy comment */}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 text-xs shrink-0">
                          S
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-3 flex-grow">
                          <h5 className="font-bold text-navy text-sm">Sadia Rahman</h5>
                          <p className="text-slate-600 text-sm mt-1">Thanks for sharing! I was looking for exactly this.</p>
                        </div>
                      </div>
                      {/* Add comment */}
                      <div className="flex gap-3 mt-4">
                        <div className="w-8 h-8 bg-navy/10 rounded-full flex items-center justify-center font-bold text-navy text-xs shrink-0">
                          {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="flex-grow flex gap-2">
                          <input 
                            type="text" 
                            placeholder={t("feed_comment") + "..."} 
                            className="w-full bg-slate-50 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-navy/20 outline-none bangla-font"
                          />
                          <button className="bg-navy text-white px-4 rounded-full text-sm font-medium hover:bg-navy-700 transition-colors bangla-font"> {t("feed_post_btn")} </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            
            {/* Infinite Scroll Loader */}
            {!loadingPosts && posts.length > 0 && (
              <div className="flex justify-center items-center py-8">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 bg-yellow rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2.5 h-2.5 bg-yellow rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2.5 h-2.5 bg-yellow rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR (Desktop 25%) */}
        <div className="hidden md:block md:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <h3 className="font-bold text-navy mb-4 bangla-font">{t("feed_recent_jobs")}</h3>
            <div className="space-y-4">
              {[
                { subj: "Physics, Math", area: "Dhanmondi", budget: "8000" },
                { subj: "English", area: "Gulshan", budget: "10000" },
                { subj: "All Subjects (Class 5)", area: "Mirpur", budget: "5000" },
              ].map((job, idx) => (
                <div key={idx} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <h4 className="font-bold text-sm text-navy">{job.subj}</h4>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>{job.area}</span>
                    <span className="font-medium text-teal">BDT {job.budget}</span>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigateTo('job-board')}
              className="w-full mt-4 py-2 text-center text-sm font-bold text-navy hover:bg-slate-50 rounded-lg transition-colors bangla-font"
            > {t("feed_see_more")} </button>
          </div>
          
          {currentUser.role === 'tutor' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-6 sticky top-[380px]">
              <h3 className="font-bold text-navy mb-4 bangla-font">{t("feed_partners")}</h3>
              <div className="space-y-4">
                {[
                  { name: "Tahmid Hasan", subj: "Chemistry" },
                  { name: "Nusrat Jahan", subj: "Biology" },
                ].map((tutor, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 text-xs">
                        <img src={(tutor as any).avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(tutor.name || "U") + "&background=1a365d&color=fff"} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-navy">{tutor.name}</h4>
                        <p className="text-xs text-slate-500">{tutor.subj}</p>
                      </div>
                    </div>
                    <button className="text-navy bg-slate-50 hover:bg-slate-100 p-1.5 rounded-full transition-colors hover:scale-110">
                      <PlusCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-navy text-white flex justify-around items-center py-3 px-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50">
        <button onClick={() => navigateTo('feed')} className="flex flex-col items-center gap-1 text-yellow transition-transform active:scale-95">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">{t("nav_feed")}</span>
        </button>
        <button onClick={() => navigateTo('job-board')} className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-transform active:scale-95">
          <Briefcase className="w-6 h-6" />
          <span className="text-[10px] font-medium">{t("nav_jobs")}</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-white/60 hover:text-white -mt-5 transition-transform active:scale-95">
          <div className="bg-yellow text-navy p-3 rounded-full shadow-lg">
            <PlusCircle className="w-6 h-6" />
          </div>
        </button>
        <button className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-transform active:scale-95">
          <Bell className="w-6 h-6" />
          <span className="text-[10px] font-medium">{t("nav_notify")}</span>
        </button>
        <button onClick={() => navigateTo('profile')} className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-transform active:scale-95">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">{t("nav_profile")}</span>
        </button>
      </div>
    </div>
  );
}
