import fs from 'fs';

let content = fs.readFileSync('src/pages/Feed.tsx', 'utf8');

// Add text to Like, Comment, Share buttons if not already there
content = content.replace(
  /<Heart className=\{`w-5 h-5 transition-transform \$\{post.isLiked \? 'fill-current scale-110' : 'hover:scale-110'\}`\} \/>\s*\{post\.likes > 0 && post\.likes\}/,
  `<Heart className={\`w-5 h-5 transition-transform \${post.isLiked ? 'fill-current scale-110' : 'hover:scale-110'}\`} />
                      <span>{t("feed_like")} {post.likes > 0 && \`(\${post.likes})\`}</span>`
);

content = content.replace(
  /<MessageCircle className="w-5 h-5" \/>\s*\{post\.comments > 0 && post\.comments\}/,
  `<MessageCircle className="w-5 h-5" />
                      <span>{t("feed_comment")} {post.comments > 0 && \`(\${post.comments})\`}</span>`
);

content = content.replace(
  /<Share2 className="w-5 h-5" \/>/,
  `<Share2 className="w-5 h-5" />
                      <span>{t("feed_share")}</span>`
);

fs.writeFileSync('src/pages/Feed.tsx', content);
console.log('Action text added');
