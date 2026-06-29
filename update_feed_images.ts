import fs from 'fs';

let content = fs.readFileSync('src/pages/Feed.tsx', 'utf8');

// Add states for image upload
content = content.replace(
  /const \[isPosting, setIsPosting\] = useState\(false\);/,
  `const [isPosting, setIsPosting] = useState(false);\n  const [selectedImages, setSelectedImages] = useState<string[]>([]);\n  const [uploadingImages, setUploadingImages] = useState(false);`
);

// Add clear images after post submit
content = content.replace(
  /setPostContent\(""\);\s*\n/g,
  `setPostContent("");\n          setSelectedImages([]);\n`
);

content = content.replace(
  /const handleLike = \(id: string\) => \{/,
  `const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      if (selectedImages.length + files.length > 4) {
        alert("Maximum 4 images allowed");
        return;
      }
      
      const newImages = files.map(file => URL.createObjectURL(file));
      setSelectedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleLike = (id: string) => {`
);

// Add images in submit payload
content = content.replace(
  /visibility: visibility\n\s*\}\]\)/,
  `visibility: visibility,\n            media_urls: selectedImages\n          }])`
);
content = content.replace(
  /media_urls: \[\]/,
  `media_urls: selectedImages` // local fallback part
);

// Replace the button for upload
const uploadButtonReplacement = `<button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={selectedImages.length >= 4}
                      className="p-2 text-slate-400 hover:text-navy hover:bg-slate-50 rounded-full transition-colors tooltip-trigger disabled:opacity-50 disabled:cursor-not-allowed" 
                      title="Upload Image"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />`;

content = content.replace(/<button className="p-2 text-slate-400 hover:text-navy hover:bg-slate-50 rounded-full transition-colors tooltip-trigger" title="Upload Image">[\s\S]*?<ImageIcon className="w-5 h-5" \/>\s*<\/button>/, uploadButtonReplacement);


// Add image preview before the button bar
const imagePreviewCode = `
                {selectedImages.length > 0 && (
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
                )}
`;

content = content.replace(/<div className="flex items-center justify-between mt-3">/, imagePreviewCode + '\n                <div className="flex items-center justify-between mt-3">');

// Add images display in post rendering
const postImagesRender = `
                  {post.media_urls && post.media_urls.length > 0 && (
                    <div className={\`grid gap-2 mb-4 \${post.media_urls.length === 1 ? 'grid-cols-1' : post.media_urls.length === 2 ? 'grid-cols-2' : post.media_urls.length === 3 ? 'grid-cols-2' : 'grid-cols-2'}\`}>
                      {post.media_urls.map((url: string, idx: number) => (
                        <div key={idx} className={\`rounded-xl overflow-hidden border border-slate-100 bg-slate-50 \${post.media_urls.length === 3 && idx === 0 ? 'col-span-2' : ''}\`}>
                          <img src={url} alt="post media" className="w-full h-48 object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {currentUser.role === 'tutor' && post.author_role === 'tutor'`;

content = content.replace(/{currentUser\.role === 'tutor' && post\.author_role === 'tutor'/g, postImagesRender);

fs.writeFileSync('src/pages/Feed.tsx', content);
console.log('Image upload logic added');
