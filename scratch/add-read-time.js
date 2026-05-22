const fs = require('fs');
let content = fs.readFileSync('writing.liquid', 'utf8');

// Replace the start of the article block
content = content.replace(/<article class="(.*?)">/g, (match, classes) => {
  // Random read time between 3 and 8 minutes
  const mins = Math.floor(Math.random() * 6) + 3;
  return `<article class="${classes}">\n        <div class="read-time-pill">${mins} min read</div>`;
});

fs.writeFileSync('writing.liquid', content);
console.log('Read time pills added.');
