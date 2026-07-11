const fs = require('fs');
const path = require('path');
const dirs = ['N:/NITHISH/projects/armbust gym/armbust'];
const exts = ['.html'];

const shieldHtmlDesktop = `
      <div class="admin-shield desktop-shield" id="adminShieldDesktop" title="Admin Access">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
      </div>`;

const shieldHtmlMobile = `
        <li class="admin-shield-mobile"><a href="#" id="adminShieldMobile" title="Admin Access">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Admin Access
        </a></li>`;

function walk(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            if (!file.includes('node_modules') && !file.includes('.git')) {
                walk(file);
            }
        } else { 
            const ext = path.extname(file);
            if (exts.includes(ext)) {
                let content = fs.readFileSync(file, 'utf8');
                let updated = false;
                
                // Add desktop shield after <nav class="navbar" id="navbar">
                if (!content.includes('adminShieldDesktop') && content.includes('<nav class="navbar" id="navbar">')) {
                    content = content.replace(/<nav class="navbar" id="navbar">/, `<nav class="navbar" id="navbar">${shieldHtmlDesktop}`);
                    updated = true;
                }
                
                // Add mobile shield as last li in <ul class="nav-links">
                if (!content.includes('adminShieldMobile') && content.includes('</ul>')) {
                    content = content.replace(/<\/ul>/, `${shieldHtmlMobile}\n      </ul>`);
                    updated = true;
                }
                
                if (updated) {
                    fs.writeFileSync(file, content, 'utf8');
                    console.log('Added shield to: ' + file);
                }
            }
        }
    });
}
walk(dirs[0]);
