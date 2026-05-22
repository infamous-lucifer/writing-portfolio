const fs = require('fs');
let content = fs.readFileSync('writing.liquid', 'utf8');

let i = 0;
content = content.replace(/<article class="card post-preview" data-category="(.*?)">/g, (match, category) => {
  i++;
  if (i === 1 || i === 15 || i === 30) {
    return `<article class="card-feat post-preview card" data-category="${category}">`;
  } else if (i % 3 === 0) {
    return `<article class="card-min post-preview card" data-category="${category}">`;
  }
  return match;
});

fs.writeFileSync('writing.liquid', content);
console.log('Done!');
