const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const matter = require('gray-matter');

const postsDir = path.join(process.cwd(), 'posts');
const files = fs.readdirSync(postsDir);

let errors = 0;

files.forEach(file => {
  if (file.endsWith('.md')) {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    try {
      matter(content);
      console.log(`✅ ${file} is valid`);
    } catch (e) {
      console.error(`❌ ${file} has an error: ${e.message}`);
      errors++;
    }
  }
});

if (errors > 0) {
  process.exit(1);
} else {
  console.log('All posts are valid!');
}
