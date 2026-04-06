const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '../posts');
const TRASH_DIR = path.join(__dirname, '../posts_trash');

if (!fs.existsSync(TRASH_DIR)) {
  fs.mkdirSync(TRASH_DIR);
}

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

console.log(`Processing ${files.length} posts...`);

files.forEach(file => {
  const filePath = path.join(POSTS_DIR, file);
  const rawText = fs.readFileSync(filePath, 'utf8');
  
  // Basic Frontmatter Parser
  const fmMatch = rawText.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fmMatch) {
    console.log(`[SKIP] No frontmatter in ${file}`);
    return;
  }

  const fmRaw = fmMatch[1];
  const body = fmMatch[2];
  const data = {};
  fmRaw.split('\n').forEach(line => {
    const [key, ...val] = line.split(':');
    if (key && val.length) data[key.trim()] = val.join(':').trim();
  });

  // 1. Identification of "Junk" posts (Medium comment replies)
  const isJunk = 
    body.length < 200 || 
    body.toLowerCase().includes('replied to') || 
    body.toLowerCase().includes('in response to') ||
    (data.title && data.title.toLowerCase().startsWith('replied to'));

  if (isJunk) {
    console.log(`[TRASH] Moving junk post: ${file}`);
    fs.renameSync(filePath, path.join(TRASH_DIR, file));
    return;
  }

  // 2. Scrubbing Medium Classes and Attributes
  let newBody = body
    .replace(/<p class="graf graf--p[^"]*"[^>]*>/g, '\n\n')
    .replace(/<\/p>/g, '')
    .replace(/<h3 class="graf graf--h3[^"]*"[^>]*>/g, '\n\n### ')
    .replace(/<\/h3>/g, '')
    .replace(/<h4 class="graf graf--h4[^"]*"[^>]*>/g, '\n\n#### ')
    .replace(/<\/h4>/g, '')
    .replace(/\sname="[a-z0-9]+"/g, '')
    .replace(/\sstyle="[^"]*"/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // 3. Remove duplicate title
  if (data.title) {
    const escapedTitle = data.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const titleRegex = new RegExp(`^(#+|###|##|#)?\\s*${escapedTitle}\\s*`, 'i');
    newBody = newBody.replace(titleRegex, '').trim();
  }

  // 4. Categorization
  if (!data.category || data.category === 'Blogs') {
    const lowerBody = newBody.toLowerCase();
    if (lowerBody.includes('poem') || lowerBody.includes('verse') || lowerBody.includes('sonnet')) {
      data.category = 'Poems';
    } else if (newBody.split(' ').length > 400 || lowerBody.includes('essay') || lowerBody.includes('prose')) {
      data.category = 'Prose';
    } else {
      data.category = 'Blogs';
    }
  }

  // 5. SEO Description
  if (!data.description) {
    data.description = newBody
      .replace(/[#*`]|<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 155) + '...';
  }

  // Reconstruct Frontmatter
  const newFm = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
  const newContent = `---\n${newFm}\n---\n\n${newBody}`;
  
  fs.writeFileSync(filePath, newContent);
  console.log(`[CLEANED] ${file} -> Category: ${data.category}`);
});

console.log('Scrubbing complete.');
