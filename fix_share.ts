import fs from 'fs';

let content = fs.readFileSync('src/pages/Feed.tsx', 'utf8');

const handleShareStr = `
  const handleShare = async (postId: string) => {
    const url = \`\${window.location.origin}/#/post/\${postId}\`;
    await navigator.clipboard.writeText(url);
    alert('লিংক কপি হয়েছে ✓');
  };

  const [expandedCommentId, setExpandedCommentId] = useState<string | null>(null);
`;

content = content.replace(
  /const \[expandedCommentId, setExpandedCommentId\] = useState<string \| null>\(null\);/,
  handleShareStr
);

content = content.replace(
  /<button className="flex items-center gap-2 text-sm text-slate-500 hover:text-navy font-medium transition-colors ml-auto hover:scale-105">/,
  `<button onClick={() => handleShare(post.id)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-navy font-medium transition-colors ml-auto hover:scale-105">`
);

fs.writeFileSync('src/pages/Feed.tsx', content);
console.log('Share logic added');
