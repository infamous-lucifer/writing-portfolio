const fs = require('fs');
const cheerio = require('cheerio');

const filePath = '/Users/lucifer/Library/CloudStorage/GoogleDrive-bikshat062@gmail.com/Other computers/My Computer/Downloads/medium-export/posts/2025-01-15_The-Illusion-of-Freedom--How-Society-Traps-Us-in-Legalized-Labor-79914e6fafd8.html';
const html = fs.readFileSync(filePath, 'utf8');
const $ = cheerio.load(html);

console.log("Title tag:", $('title').text());
console.log("h1.p-name:", $('h1.p-name').text());
console.log("Number of .section-inner:", $('.section-inner').length);
console.log("Number of .e-content:", $('.e-content').length);

console.log("\n--- Section 1 HTML (truncated) ---");
console.log($('.section-inner').eq(0).html().substring(0, 500));

if ($('.section-inner').length > 1) {
    console.log("\n--- Section 2 HTML (truncated) ---");
    console.log($('.section-inner').eq(1).html().substring(0, 1000));
}
