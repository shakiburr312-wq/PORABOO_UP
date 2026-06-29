import fs from 'fs';
let content = fs.readFileSync('src/pages/Feed.tsx', 'utf8');

const regex = /<button \n\s*onClick=\{\(\) => fileInputRef\.current\?\.click\(\)\}[\s\S]*?<ImageIcon className="w-5 h-5" \/>\n\s*<\/button>\n\s*<input \n\s*type="file"\n\s*ref=\{fileInputRef\}\n\s*className="hidden"\n\s*accept="image\/\*"\n\s*multiple\n\s*onChange=\{handleImageSelect\}\n\s*\/>/;

const replacement = `<label className="cursor-pointer flex items-center gap-2 text-slate-400 hover:text-navy transition-colors">
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
                    </label>`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/pages/Feed.tsx', content);
