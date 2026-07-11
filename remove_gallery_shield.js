const fs = require('fs');
let html = fs.readFileSync('gallery.html', 'utf8');

// 1. Remove Desktop Shield
html = html.replace(
  /<div\s+class="admin-shield desktop-shield"[\s\S]*?id="adminShieldDesktop"[\s\S]*?>[\s\S]*?<\/div>/g,
  ''
);

// Remove the older secret-shield just in case
html = html.replace(
  /<!-- ===== SECRET SHIELD ENTRANCE \(DESKTOP\) ===== -->[\s\S]*?<div\s+class="secret-shield desktop-shield"[\s\S]*?>[\s\S]*?<\/div>/g,
  ''
);

// 2. Remove Mobile Shield
html = html.replace(
  /<li class="admin-shield-mobile">[\s\S]*?id="adminShieldMobile"[\s\S]*?<\/li>/g,
  ''
);

// 3. Remove Passkey Modal
html = html.replace(
  /<!-- Passkey Modal for Shield -->[\s\S]*?<div id="passkey-modal" class="passkey-modal">[\s\S]*?<\/div>\s*<\/div>/g,
  ''
);

// 4. Remove the script block handling the shield triple tap
// Look for the block we repaired earlier
const shieldScriptRegex = /<script>\s*document\.addEventListener\("DOMContentLoaded", \(\) => {[\s\S]*?let clickCount = 0;[\s\S]*?modal\.classList\.remove\("active"\);\s*passkeyInput\.value = "";\s*}\s*}\);\s*}\s*<\/script>/g;

html = html.replace(shieldScriptRegex, '');

// Also remove the standalone `<script> ... shield.addEventListener ... </script>` if it's there
const standaloneScriptRegex = /<script>\s*document\.addEventListener\("DOMContentLoaded", \(\) => {[\s\S]*?const modal = document\.getElementById\("passkey-modal"\);[\s\S]*?<\/script>/g;
html = html.replace(standaloneScriptRegex, '');


fs.writeFileSync('gallery.html', html, 'utf8');
console.log('Removed shields from gallery.html');
