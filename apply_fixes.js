const fs = require('fs');

// --- 1. Modify index.html ---
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Update "Mr Owner" to "Mr. DINESH"
indexHtml = indexHtml.replace(
  'alt="Mr Owner, Founder and Head Coach',
  'alt="Mr. DINESH, Founder and Head Coach'
);
indexHtml = indexHtml.replace(
  '<h3 class="founders-name" id="foundersName">Mr Owner</h3>',
  '<h3 class="founders-name" id="foundersName">Mr. DINESH</h3>'
);

// Update Instagram Follow link
const igUrl = "https://www.instagram.com/armburst_gym_official?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";
indexHtml = indexHtml.replace(
  '<a\r\n          href="#"\r\n          target="_blank"\r\n          rel="noopener noreferrer"\r\n          class="home-instagram-follow"\r\n          >Follow Us ↗</a>',
  `<a\r\n          href="${igUrl}"\r\n          target="_blank"\r\n          rel="noopener noreferrer"\r\n          class="home-instagram-follow"\r\n          >Follow Us ↗</a>`
);
// Fallback if formatting differs
indexHtml = indexHtml.replace(
  'class="home-instagram-follow"\r\n          >Follow Us ↗</a\r\n        >',
  `href="${igUrl}"\r\n          target="_blank"\r\n          rel="noopener noreferrer"\r\n          class="home-instagram-follow"\r\n          >Follow Us ↗</a\r\n        >`
);

// Inject Elfsight Instagram Widget
const widgetHtml = `
      <div class="home-instagram-embed reveal" style="display: flex; justify-content: center; width: 100%; margin-top: 30px;">
        <!-- Elfsight Instagram Feed | Untitled Instagram Feed -->
        <script src="https://elfsightcdn.com/platform.js" async></script>
        <div class="elfsight-app-b7b24720-ea2f-41c4-b0b1-49a1686c983b" data-elfsight-app-lazy></div>
      </div>`;
indexHtml = indexHtml.replace(
  '<div class="home-instagram-embed reveal">\r\n        <!-- Widget removed. User will provide new link later. -->\r\n      </div>',
  widgetHtml
);
indexHtml = indexHtml.replace(
  '<div class="home-instagram-embed reveal">\n        <!-- Widget removed. User will provide new link later. -->\n      </div>',
  widgetHtml
);

// Update footer Instagram link
indexHtml = indexHtml.replace(
  '<a\r\n            href="#"\r\n            target="_blank"\r\n            aria-label="Instagram"\r\n            style="color: #fff; text-decoration: none"\r\n            >📷</a\r\n          >',
  `<a\r\n            href="${igUrl}"\r\n            target="_blank"\r\n            aria-label="Instagram"\r\n            style="color: #fff; text-decoration: none"\r\n            >📷</a\r\n          >`
);


// Add Floating WhatsApp Icon before </body>
const whatsappHtml = `
    <!-- Floating WhatsApp Icon -->
    <a href="https://wa.me/919786095401" target="_blank" class="whatsapp-float" aria-label="Chat on WhatsApp">
      <svg viewBox="0 0 32 32" width="32" height="32" fill="currentColor">
        <path d="M16.05 2.1c-7.7 0-13.9 6.2-13.9 13.9 0 2.45.65 4.8 1.85 6.9l-2 7.35 7.5-1.95c2 .1 4.1.75 6.2.75 7.7 0 13.9-6.2 13.9-13.9 0-7.7-6.2-13.9-13.9-13.9zm0 25.5c-2.1 0-4.1-.55-5.9-1.55l-.4-.25-4.4 1.15 1.15-4.3-.3-.45c-1.15-1.8-1.75-3.9-1.75-6 0-6.45 5.25-11.7 11.7-11.7s11.7 5.25 11.7 11.7c-.05 6.4-5.3 11.65-11.75 11.65zm6.4-8.5c-.35-.2-2.1-1.05-2.4-1.15-.35-.15-.6-.2-.85.15s-1 1.15-1.2 1.4c-.2.25-.4.3-.75.15-.35-.2-1.5-.55-2.85-1.75-1.05-.95-1.8-2.1-2-2.45-.2-.35-.05-.55.15-.7.15-.15.35-.35.5-.55.15-.2.2-.35.3-.55.1-.2.05-.4-.05-.55-.1-.2-.85-2.1-1.15-2.85-.3-.75-.65-.65-.85-.65h-.75c-.3 0-.75.1-1.15.55-.35.4-1.4 1.35-1.4 3.3s1.4 3.8 1.6 4.1c.2.25 2.8 4.25 6.8 5.95.95.4 1.7.65 2.3.85.95.3 1.8.25 2.5.15.75-.1 2.1-.85 2.4-1.7.3-.85.3-1.55.2-1.7-.1-.1-.35-.15-.7-.35z"></path>
      </svg>
    </a>
`;
if (!indexHtml.includes('whatsapp-float')) {
  indexHtml = indexHtml.replace('</body>', whatsappHtml + '</body>');
}

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Updated index.html');


// --- 2. Modify script.js ---
let scriptJs = fs.readFileSync('script.js', 'utf8');
scriptJs = scriptJs.replace(
  'name: "Mr Owner",',
  'name: "Mr. DINESH",'
);
fs.writeFileSync('script.js', scriptJs, 'utf8');
console.log('Updated script.js');


// --- 3. Modify gallery.html ---
let galleryHtml = fs.readFileSync('gallery.html', 'utf8');
if (!galleryHtml.includes('whatsapp-float')) {
  galleryHtml = galleryHtml.replace('</body>', whatsappHtml + '</body>');
}
galleryHtml = galleryHtml.replace(
  '<a\r\n            href="#"\r\n            target="_blank"\r\n            aria-label="Instagram"\r\n            style="color: #fff; text-decoration: none"\r\n            >📷</a\r\n          >',
  `<a\r\n            href="${igUrl}"\r\n            target="_blank"\r\n            aria-label="Instagram"\r\n            style="color: #fff; text-decoration: none"\r\n            >📷</a\r\n          >`
);
fs.writeFileSync('gallery.html', galleryHtml, 'utf8');
console.log('Updated gallery.html');


// --- 4. Modify styles.css ---
let css = fs.readFileSync('styles.css', 'utf8');
const whatsappCss = `
/* Floating WhatsApp Icon */
.whatsapp-float {
  position: fixed;
  bottom: 25px;
  left: 25px;
  width: 55px;
  height: 55px;
  background-color: #25d366;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
  z-index: 1000;
  transition: all 0.3s ease;
  text-decoration: none;
}

.whatsapp-float:hover {
  transform: scale(1.1) translateY(-3px);
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
  background-color: #20b858;
}

.whatsapp-float svg {
  width: 32px;
  height: 32px;
}
`;
if (!css.includes('.whatsapp-float')) {
  css += whatsappCss;
  fs.writeFileSync('styles.css', css, 'utf8');
  console.log('Updated styles.css');
}
