/**
 * sanitize-posts.js v2
 * 
 * The key insight: Medium exports use UNCLOSED HTML tags.
 * A <p id="..."> tag is never closed with </p>.
 * An <h3> is never closed. Everything after it is parsed
 * as a child of the h3 by standard HTML parsers.
 * 
 * Strategy: Use regex-based pre-processing to insert closing
 * tags BEFORE feeding to cheerio, then clean up attributes.
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const POSTS_DIR = path.join(__dirname, '..', 'posts');

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return null;
  return { frontmatter: match[1], body: match[2].trim() };
}

function hasBodyContent(body) {
  // Posts with body content have <p id="..." tags beyond just title/image
  const pCount = (body.match(/<p\s+id="/g) || []).length;
  const bqCount = (body.match(/<blockquote/g) || []).length;
  // Also check for graf--trailing which marks title+image-only posts
  const isTrailingOnly = /graf--trailing/.test(body);
  // If only has graf--trailing and no real paragraphs
  if (isTrailingOnly && pCount === 0 && bqCount === 0) return false;
  return (pCount + bqCount) > 0;
}

function isAlreadyClean(body) {
  // Check if this post is already in clean markdown (like idealism post)
  return !body.includes('class="graf') && !body.includes('graf--');
}

/**
 * Pre-process Medium HTML to insert closing tags.
 * Medium format: <tag id="..." class="graf...">content<tag id="..." class="graf...">content
 * We need:       <tag id="..." class="graf...">content</tag><tag id="..." class="graf...">content</tag>
 */
function preProcessMediumHTML(html) {
  // Strategy: Split by Medium's graf elements and reconstruct
  // Each graf element starts with <(p|h3|h4|blockquote|figure) id="..." class="graf
  
  // First, handle the self-closing <br> and <img> tags to be safe
  let result = html;
  
  // Insert closing tags before each new graf element
  // Match the start of a new graf element
  // The pattern: unclosed tag followed by next tag
  
  // Step 1: Insert </p> before each new <p that's a graf
  result = result.replace(/<p\s+id="([^"]*?)"\s+class="graf\s+graf--p/g, (match, id) => {
    return '</p><p id="' + id + '" class="graf graf--p';
  });
  
  // Step 2: Insert closing </h3> before any <p, <h4, <figure, <blockquote that follows an h3
  result = result.replace(/<h3\s+[^>]*class="graf[^"]*"[^>]*>(.*?)(?=<(?:p|h4|figure|blockquote)\s)/gs, (match) => {
    return match + '</h3>';
  });
  
  // Step 3: Insert closing </h4> before any element that follows an h4
  result = result.replace(/<h4\s+[^>]*class="graf[^"]*"[^>]*>(.*?)(?=<(?:p|h3|figure|blockquote)\s)/gs, (match) => {
    return match + '</h4>';
  });
  
  // Step 4: Handle blockquotes similarly
  result = result.replace(/<blockquote\s+id="([^"]*?)"\s+class="graf/g, (match, id) => {
    return '</blockquote><blockquote id="' + id + '" class="graf';
  });
  
  // Clean up any spurious closing tags at the start
  result = result.replace(/^<\/p>/, '');
  result = result.replace(/^<\/blockquote>/, '');
  
  return result;
}

function sanitizePost(body) {
  // Pre-process to fix unclosed tags
  let processed = preProcessMediumHTML(body);
  
  const $ = cheerio.load(processed, { decodeEntities: false });
  
  // 1. Remove the first h3 (title — already rendered by the template)
  const firstH3 = $('h3').first();
  if (firstH3.length && firstH3.hasClass('graf--title')) {
    firstH3.remove();
  }
  
  // 2. Remove h4 subtitle elements
  $('h4').each(function() {
    if ($(this).hasClass('graf--subtitle') || $(this).attr('class')?.includes('graf--subtitle')) {
      $(this).remove();
    }
  });
  
  // 3. Clean up figure/figcaption
  $('figure').each(function() {
    const img = $(this).find('img');
    const caption = $(this).find('figcaption');
    if (img.length) {
      const src = img.attr('src') || '';
      const alt = img.attr('alt') || '';
      let cleanHtml = `<figure>\n<img src="${src}" alt="${alt}" loading="lazy">\n`;
      if (caption.length && caption.text().trim()) {
        // Clean the caption text
        let capText = caption.text().trim();
        cleanHtml += `<figcaption>${capText}</figcaption>\n`;
      }
      cleanHtml += `</figure>`;
      $(this).replaceWith(cleanHtml);
    }
  });
  
  // 4. Clean paragraph elements
  $('p').each(function() {
    $(this).removeAttr('id');
    $(this).removeAttr('class');
    $(this).removeAttr('name');
    
    let html = $(this).html();
    if (html) {
      html = html.replace(/&nbsp;/g, ' ').replace(/\u00a0/g, ' ');
      $(this).html(html);
    }
  });
  
  // 5. Clean blockquote elements
  $('blockquote').each(function() {
    $(this).removeAttr('id');
    $(this).removeAttr('class');
    $(this).removeAttr('name');
  });
  
  // 6. Clean emphasis/strong
  $('em, strong').each(function() {
    $(this).removeAttr('class');
  });
  
  // 7. Clean links
  $('a').each(function() {
    $(this).removeAttr('data-href');
    $(this).removeAttr('class');
    // Keep target="_blank" for external links
    const href = $(this).attr('href') || '';
    if (href.includes('utm_source=medium') || href.includes('utm_medium=referral')) {
      try {
        const url = new URL(href);
        url.searchParams.delete('utm_source');
        url.searchParams.delete('utm_medium');
        url.searchParams.delete('utm_content');
        const cleaned = url.toString();
        $(this).attr('href', cleaned);
      } catch(e) {}
    }
  });
  
  let result = $('body').html() || '';
  
  // Final cleanup
  result = result
    .replace(/&nbsp;/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<html><head><\/head><body>([\s\S]*)<\/body><\/html>/, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  return result;
}

// Main
const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
let processed = 0;
let skipped = 0;

files.forEach(filename => {
  const filepath = path.join(POSTS_DIR, filename);
  const content = fs.readFileSync(filepath, 'utf8');
  const parsed = extractFrontmatter(content);
  
  if (!parsed) {
    console.log(`⚠ SKIP (no frontmatter): ${filename}`);
    skipped++;
    return;
  }
  
  if (isAlreadyClean(parsed.body)) {
    console.log(`○ SKIP (already clean): ${filename}`);
    skipped++;
    return;
  }
  
  if (!hasBodyContent(parsed.body)) {
    console.log(`⊘ SKIP (no body content): ${filename}`);
    skipped++;
    return;
  }
  
  const cleaned = sanitizePost(parsed.body);
  
  // Sanity check: don't write if output is too short compared to input
  if (cleaned.length < parsed.body.length * 0.3) {
    console.log(`✗ ABORT (output too short, ${cleaned.length} vs ${parsed.body.length}): ${filename}`);
    skipped++;
    return;
  }
  
  const output = `---\n${parsed.frontmatter}\n---\n\n${cleaned}\n`;
  fs.writeFileSync(filepath, output, 'utf8');
  console.log(`✓ Sanitized: ${filename} (${parsed.body.length} → ${cleaned.length} chars)`);
  processed++;
});

console.log(`\nDone. Processed: ${processed}, Skipped: ${skipped}, Total: ${files.length}`);
