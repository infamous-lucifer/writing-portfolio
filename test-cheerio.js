const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

console.log("Analyzing all posts for paragraph counts and sizes:\n");

files.forEach(file => {
  const filePath = path.join(postsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fmMatch) {
    console.log(`[SKIP] No frontmatter: ${file}`);
    return;
  }
  
  const body = fmMatch[2].trim();
  const $ = cheerio.load(body);
  
  const flatElements = [];
  function traverse(node) {
    if (!node) return;
    const tagName = node.tagName;
    if (tagName && ['h3', 'h4', 'p', 'figure', 'blockquote', 'ul', 'ol', 'li'].includes(tagName)) {
      const $el = $(node);
      if (tagName === 'figure') {
        flatElements.push({ tag: 'figure' });
        return;
      }
      const cleanHtml = $el.clone().children('h3, h4, p, figure, blockquote, ul, ol, li').remove().end().html();
      if (cleanHtml && cleanHtml.trim() !== '') {
        flatElements.push({ tag: tagName });
      }
    }
    if (node.children) {
      node.children.forEach(child => traverse(child));
    }
  }
  
  traverse($('body')[0]);
  
  const pCount = flatElements.filter(e => e.tag === 'p').length;
  const h3Count = flatElements.filter(e => e.tag === 'h3').length;
  const figureCount = flatElements.filter(e => e.tag === 'figure').length;
  
  console.log(`${file.padEnd(70)} Size: ${content.length} bytes, P: ${pCount}, H3: ${h3Count}, Fig: ${figureCount}`);
});
