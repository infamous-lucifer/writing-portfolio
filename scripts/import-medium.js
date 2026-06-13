const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const TurndownService = require('turndown');
const https = require('https');

const EXPORT_DIR = '/Users/lucifer/Library/CloudStorage/GoogleDrive-bikshat062@gmail.com/Other computers/My Computer/Downloads/medium-export/posts/';
const OUTPUT_DIR = path.join(__dirname, '../posts');
const IMAGES_DIR = path.join(__dirname, '../assets/images/posts');

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
});

// Remove messy medium figures and just extract the image and caption
turndownService.addRule('medium-images', {
    filter: ['figure'],
    replacement: function (content, node) {
        const img = node.querySelector('img');
        const caption = node.querySelector('figcaption');
        if (img) {
            const altText = caption ? caption.textContent.trim() : '';
            return `\n![${altText}](${img.getAttribute('src')})\n`;
        }
        return content;
    }
});

// Download image helper
async function downloadImage(url, destPath) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to download ${url}: ${res.statusText}`);
    }
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buffer));
}

async function processFile(filePath) {
    const filename = path.basename(filePath);
    if (filename.startsWith('draft_')) return; // skip drafts

    const html = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(html);

    // Heuristic for actual articles: they usually have a graf--title or at least a section.
    // Comments usually just have a p-name that matches the long filename.
    const titleNode = $('.graf--title');
    if (titleNode.length === 0 && !$('.section-inner').text()) {
        return; // skip if it doesn't look like an article
    }

    // Try to get title from graf--title, fallback to h1.p-name
    let title = titleNode.text().trim();
    if (!title) {
        title = $('h1.p-name').text().trim();
    }

    // If title is super long, it's probably a comment.
    if (title.length > 100) return;

    // Get date
    const dateStr = $('time.dt-published').attr('datetime');
    const date = dateStr ? new Date(dateStr).toISOString().split('T')[0] : '2025-01-01';

    // Get body content. The actual content is usually inside .section-inner
    let contentHtml = '';
    $('.section-inner').each((i, el) => {
        contentHtml += $(el).html();
    });

    if (!contentHtml) return;

    // Load content into cheerio to manipulate it
    const $content = cheerio.load(contentHtml, null, false);

    // Remove the title and subtitle from the body so it's not duplicated
    $content('.graf--title').remove();
    $content('.graf--subtitle').remove();

    // Process images: download them and update src
    const imgPromises = [];
    $content('img').each((i, el) => {
        const src = $(el).attr('src');
        if (src && src.startsWith('http')) {
            // Ignore tiny tracking pixels
            if (src.includes('stat?event=post.clientViewed')) {
                $(el).remove();
                return;
            }

            const urlParts = new URL(src);
            let imgName = path.basename(urlParts.pathname);
            if (!imgName || imgName.length < 5) {
                imgName = `img-${Date.now()}-${i}.jpg`;
            } else {
                imgName = imgName + '.jpg'; // ensure extension
            }

            const localImgPath = path.join(IMAGES_DIR, imgName);
            const relativeImgPath = `/assets/images/posts/${imgName}`;
            
            $(el).attr('src', relativeImgPath);
            imgPromises.push(downloadImage(src, localImgPath));
        }
    });

    await Promise.all(imgPromises);

    // Convert to markdown
    const markdown = turndownService.turndown($content.html());

    // Generate output filename
    const outFilename = filename
        .replace(/^\d{4}-\d{2}-\d{2}_/, '') // remove date prefix
        .replace(/-[a-f0-9]{12}\.html$/, '') // remove medium hash
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + '.md';

    const outPath = path.join(OUTPUT_DIR, outFilename);

    // Write Frontmatter
    const frontmatter = `---
layout: post
title: "${title.replace(/"/g, '\\"')}"
date: ${date}
tags: ["posts"]
category: blogs
---

${markdown}
`;

    fs.writeFileSync(outPath, frontmatter, 'utf8');
    console.log(`Processed: ${title}`);
}

async function main() {
    const files = fs.readdirSync(EXPORT_DIR).filter(f => f.endsWith('.html'));
    
    // Wipe existing posts to ensure clean slate, except case-study
    const existingPosts = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.md'));
    for (const post of existingPosts) {
        if (post !== 'case-study-building-this-portfolio.md') {
            fs.unlinkSync(path.join(OUTPUT_DIR, post));
        }
    }

    console.log(`Found ${files.length} HTML files. Processing...`);
    for (const file of files) {
        await processFile(path.join(EXPORT_DIR, file));
    }
    console.log("Done!");
}

main().catch(console.error);
