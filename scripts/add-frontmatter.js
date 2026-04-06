const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../posts');
const files = fs.readdirSync(postsDir);

files.forEach(file => {
  if (!file.endsWith('.md')) return;

  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.startsWith('---')) return;

  // Attempt to extract title from first heading
  let title = file.replace(/-/g, ' ').replace('.md', '');
  const headingMatch = content.match(/^# (.*)/m);
  if (headingMatch) {
    title = headingMatch[1].trim();
    // Remove the heading from content if we want it in frontmatter only
    content = content.replace(/^# .*\r?\n/, '');
  }

  // Clean title
  title = title.replace(/"/g, '\\"');

  // Dummy date based on file stat
  const stats = fs.statSync(filePath);
  const date = stats.mtime.toISOString().split('T')[0];

  const frontmatter = `---
layout: post.liquid
title: "${title}"
date: ${date}
category: Blogs
---

`;

  fs.writeFileSync(filePath, frontmatter + content);
});
