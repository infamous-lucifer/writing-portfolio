const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const slugify = require('slugify');

const inputDir = 'C:\\Users\\arpit\\Downloads\\medium-export\\posts';
const outputDir = path.join(__dirname, '..', 'posts');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    let importedCount = 0;

    files.forEach(file => {
        // Skip drafts
        if (file.startsWith('draft_')) {
            console.log(`Skipped draft: ${file}`);
            return;
        }

        const filePath = path.join(inputDir, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isFile() && path.extname(file) === '.html') {
            const html = fs.readFileSync(filePath, 'utf8');
            const $ = cheerio.load(html);

            // Extract Data
            const title = $('h1.p-name').text().trim() || $('title').text().trim() || 'Untitled';
            const dateStr = $('time.dt-published').attr('datetime');
            const date = dateStr ? new Date(dateStr).toISOString().split('T')[0] : '2026-01-01';
            
            // Clean up the body content
            // Remove the hardcoded title h1 and author footer that Medium injects inside
            let bodyContent = $('.section-inner').html() || $('.e-content').html() || '';
            
            // Basic logic: if the word count is very short (less than 50 words) and it has no title tag inside, it's likely a reply, but we'll import it as "Poetry" just in case.
            const plainText = $('.e-content').text();
            let category = plainText.length > 1500 ? 'Blogs' : 'Poems';

            // Sanitize Title
            const cleanTitle = title.replace(/"/g, "'");

            // Format frontmatter
            const frontmatter = `---
layout: post.liquid
title: "${cleanTitle}"
date: ${date}
category: ${category}
tags: ["posts"]
---

${bodyContent}
`;

            const slug = slugify(title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
            let outPath = path.join(outputDir, `${slug}.md`);

            // Check if post already exists (handle duplicate names)
            let counter = 1;
            while(fs.existsSync(outPath)) {
                outPath = path.join(outputDir, `${slug}-${counter}.md`);
                counter++;
            }

            fs.writeFileSync(outPath, frontmatter);
            console.log(`Imported: ${cleanTitle}`);
            importedCount++;
        }
    });

    console.log(`\nImport complete! Successfully migrated ${importedCount} posts.`);
});
