const fs = require('fs');
const content = fs.readFileSync('styles.css', 'utf8');
const regex = /url\(['"]?([^'")]+)['"]?\)/g;
let match;
const links = new Set();
while ((match = regex.exec(content)) !== null) {
  links.add(match[1]);
}
for (const link of links) {
  if (!link.startsWith('http') && !link.startsWith('data:')) {
    const path = link.split('?')[0].split('#')[0];
    try {
      fs.accessSync(path);
    } catch(e) {
      console.log('MISSING:', link);
    }
  }
}
