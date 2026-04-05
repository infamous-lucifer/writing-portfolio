const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../posts');

const categories = {
  Poems: [
    'verses', 'poem', 'poetry', 'rhyme', 'staring', 'shadow', 'silent', 'echo', 'beautiful'
  ],
  Prose: [
    'letter', 'essay', 'reflection', 'thought', 'story', 'becoming', 'man', 'boy', 'understood', 'live', 'way'
  ],
  Blogs: [
    'psychology', 'strategy', 'intent', 'metric', 'content', 'seo', 'optimization', 'marketing', 'agency', 'growth'
  ]
};

function getCategory(filename, title) {
  const content = (filename + ' ' + title).toLowerCase();
  
  if (categories.Poems.some(k => content.includes(k))) return 'Poems';
  if (categories.Prose.some(k => content.includes(k))) return 'Prose';
  if (categories.Blogs.some(k => content.includes(k))) return 'Blogs';
  
  return 'Blogs'; // Default
}

fs.readdirSync(postsDir).forEach(file => {
  if (!file.endsWith('.md')) return;
  
  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Extract Title from filename or content
  const titleMatch = content.match(/title: (.*)/);
  const title = titleMatch ? titleMatch[1] : file;
  
  const category = getCategory(file, title);
  
  // Update category in frontmatter
  const newContent = content.replace(/category: .*/, `category: ${category}`);
  
  fs.writeFileSync(filePath, newContent);
  console.log(`Categorized: ${file} -> ${category}`);
});
