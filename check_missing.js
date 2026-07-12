const fs = require('fs');
['index.html', 'gallery.html', 'instagram.html'].forEach(file => {
  console.log('Checking:', file);
  const content = fs.readFileSync(file, 'utf8');
  const regex = /(?:src|href)="([^"]+)"/g;
  let match;
  const links = new Set();
  while ((match = regex.exec(content)) !== null) {
    links.add(match[1]);
  }
  for (const link of links) {
    if (!link.startsWith('http') && !link.startsWith('#') && !link.startsWith('mailto:') && !link.startsWith('tel:')) {
      // remove query params or hash if any
      const path = link.split('?')[0].split('#')[0];
      try {
        fs.accessSync(path);
      } catch (e) {
        console.log('  MISSING:', link);
      }
    }
  }
});
