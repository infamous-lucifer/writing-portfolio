const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'posts');
const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

let updated = 0;

files.forEach(filename => {
  const filepath = path.join(POSTS_DIR, filename);
  let content = fs.readFileSync(filepath, 'utf8');

  // Replace the first instance of loading="lazy" in an img tag with fetchpriority="high"
  const imgRegex = /<img\s+src="[^"]+"\s+alt="[^"]*"\s+(loading="lazy")\s*>/i;
  
  if (imgRegex.test(content)) {
    content = content.replace(imgRegex, (match, lazyPart) => {
      return match.replace(lazyPart, 'fetchpriority="high"');
    });
    fs.writeFileSync(filepath, content, 'utf8');
    updated++;
  }
});

console.log(`Updated ${updated} posts.`);
