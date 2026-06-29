import fs from 'fs';

let content = fs.readFileSync('src/pages/Feed.tsx', 'utf8');

// Replace states
content = content.replace(
  /const \[selectedImages, setSelectedImages\] = useState<string\[\]>\(\[\]\);\n  const \[uploadingImages, setUploadingImages\] = useState\(false\);/,
  `const [images, setImages] = useState<File[]>([]);\n  const [previews, setPreviews] = useState<string[]>([]);`
);

// Replace handleImageUpload
content = content.replace(
  /const handleImageUpload = \(e: React.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?const handleLike = \(id: string\) => \{/,
  `const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
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
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleLike = (id: string) => {`
);

// Update file input inside JSX
content = content.replace(
  /<input \n\s*type="file"\n\s*ref=\{fileInputRef\}\n\s*className="hidden"\n\s*accept="image\/\*"\n\s*multiple\n\s*onChange=\{handleImageUpload\}\n\s*\/>/m,
  `<input 
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                    />`
);

// Update button disabled state
content = content.replace(
  /disabled=\{selectedImages\.length >= 4\}/,
  `disabled={images.length >= 4}`
);

// Update preview section in JSX
const oldPreviewCode = `{selectedImages.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {selectedImages.map((img, idx) => (
                      <div key={idx} className="relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}`;

const newPreviewCode = `{previews.length > 0 && (
                  <div className={\`grid gap-2 mt-2 \${previews.length === 1 ? 'grid-cols-1' : previews.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}\`}>
                    {previews.map((src, i) => (
                      <div key={i} className="relative">
                        <img src={src} className="w-full h-32 object-cover rounded-lg" />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/70"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}`;
content = content.replace(oldPreviewCode, newPreviewCode);

// Add uploadImages function
content = content.replace(
  /const handlePostSubmit = async \(\) => \{/,
  `const uploadImages = async (files: File[]) => {
    const urls: string[] = [];
    if (!supabase) return urls;
    for (const file of files) {
      const fileName = \`posts/\${Date.now()}_\${file.name}\`;
      const { data, error } = await supabase.storage.from('Media').upload(fileName, file);
      if (!error && data) {
        const { data: urlData } = supabase.storage.from('Media').getPublicUrl(data.path);
        urls.push(urlData.publicUrl);
      }
    }
    return urls;
  };

  const handlePostSubmit = async () => {`
);

// Update handlePostSubmit to use images and upload them
// Need to find the supabase insert part
const replacePostSubmit = `let safeContent = postContent;
        const phoneRegex = /01[0-9]{9}/g;
        const emailRegex = /[^\\s@]+@[^\\s@]+\\.[^\\s@]+/g;
        safeContent = safeContent.replace(phoneRegex, "***");
        safeContent = safeContent.replace(emailRegex, "***");

        const imageUrls = images.length > 0 ? await uploadImages(images) : [];

        const { data, error } = await supabase
          .from('posts')
          .insert([{
            author_id: currentUser.id,
            content: safeContent,
            visibility: visibility,
            media_urls: imageUrls,
            media_type: imageUrls.length > 0 ? 'image' : null
          }])`;

content = content.replace(/let safeContent = postContent;[\s\S]*?media_urls: selectedImages\n\s*\}\]\)/, replacePostSubmit);

content = content.replace(
  /media_urls: selectedImages/g,
  `media_urls: previews`
);

content = content.replace(
  /setSelectedImages\(\[\]\);/g,
  `setImages([]);\n          setPreviews([]);`
);

fs.writeFileSync('src/pages/Feed.tsx', content);
console.log('Image upload fixed');
