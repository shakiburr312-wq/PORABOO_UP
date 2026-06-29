import fs from 'fs';

let content = fs.readFileSync('src/pages/Feed.tsx', 'utf8');

// Replace uploadImages and handlePostSubmit
content = content.replace(
  /const uploadImages = async \([\s\S]*?const handleImageSelect = \(/,
  `const handlePostSubmit = async () => {
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
        safeContent = safeContent.replace(/[^\\s@]+@[^\\s@]+\\.[^\\s@]+/g, "***");

        // Upload images
        let imageUrls: string[] = [];
        for (const file of images) {
          const fileExt = file.name.split('.').pop();
          const fileName = \`\${user.id}/\${Date.now()}.\${fileExt}\`;
          
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
        const safeContent = postContent.replace(/01[0-9]{9}/g, "***").replace(/[^\\s@]+@[^\\s@]+\\.[^\\s@]+/g, "***");
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

  const handleImageSelect = (`
);

fs.writeFileSync('src/pages/Feed.tsx', content);
console.log('Feed.tsx fixed');
