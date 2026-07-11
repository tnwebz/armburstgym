const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix founders wrapper positioning (inline-block -> absolute)
html = html.replace(
  '<div class="editable-wrapper" style="display: inline-block;">\n              <img src="images/img_2.png"',
  '<div class="editable-wrapper" style="position: absolute; inset: 0;">\n              <img src="images/img_2.png"'
);
html = html.replace(
  '<div class="editable-wrapper" style="display: inline-block;">\n              <img src="images/p1.png"',
  '<div class="editable-wrapper" style="position: absolute; inset: 0;">\n              <img src="images/p1.png"'
);

// 2. Add data-editable-id to infrastructure images
html = html.replace(
  'src="images/d1.png"\r\n            alt="Premium weight training equipment at ARMBURST GYM Thimmavaram Chengalpattu"\r\n          />',
  'src="images/d1.png"\r\n            alt="Premium weight training equipment at ARMBURST GYM Thimmavaram Chengalpattu"\r\n            data-editable-id="infra_1"\r\n          />'
);
html = html.replace(
  'src="images/d2.png"\r\n            alt="State-of-the-art cardio zone at ARMBURST GYM Gym Chengalpattu"\r\n          />',
  'src="images/d2.png"\r\n            alt="State-of-the-art cardio zone at ARMBURST GYM Gym Chengalpattu"\r\n            data-editable-id="infra_2"\r\n          />'
);
html = html.replace(
  'src="images/d3.png"\r\n            alt="Functional training area at the best gym in Chengalpattu ARMBURST GYM"\r\n          />',
  'src="images/d3.png"\r\n            alt="Functional training area at the best gym in Chengalpattu ARMBURST GYM"\r\n            data-editable-id="infra_3"\r\n          />'
);

// 3. Add "Change Photo" buttons inside the infra-content div, after the Get Started button
const infraBtns = `\r\n        <!-- Admin: Change Infrastructure Photos -->\r\n        <div class="infra-admin-btns" style="display: none;">\r\n          <button class="edit-image-btn infra-edit-btn" data-target="infra_1">\u{1F4F7} Photo 1</button>\r\n          <button class="edit-image-btn infra-edit-btn" data-target="infra_2">\u{1F4F7} Photo 2</button>\r\n          <button class="edit-image-btn infra-edit-btn" data-target="infra_3">\u{1F4F7} Photo 3</button>\r\n        </div>`;

html = html.replace(
  '<a href="#contact" class="infra-btn">Get Started</a>\r\n      </div>\r\n    </section>',
  '<a href="#contact" class="infra-btn">Get Started</a>' + infraBtns + '\r\n      </div>\r\n    </section>'
);

// 4. Update the inline CMS script to also handle infra-admin-btns visibility
// Find the admin check block and add infra buttons visibility
html = html.replace(
  "if (isAdmin) {\n          document.querySelectorAll('.edit-image-btn').forEach(btn => {",
  "if (isAdmin) {\n          // Show infra admin buttons\n          const infraBtns = document.querySelector('.infra-admin-btns');\n          if (infraBtns) infraBtns.style.display = 'flex';\n          \n          document.querySelectorAll('.edit-image-btn').forEach(btn => {"
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated with infra change-photo buttons');

// 5. Add CSS for the infra admin buttons
let css = fs.readFileSync('styles.css', 'utf8');

const infraAdminCSS = `
/* Infra Admin Change Photo Buttons */
.infra-admin-btns {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
}

.infra-edit-btn {
  position: relative !important;
  top: auto !important;
  right: auto !important;
  padding: 10px 20px !important;
  background: rgba(255, 255, 255, 0.15) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  color: #fff !important;
  backdrop-filter: blur(10px) !important;
  font-size: 0.85rem !important;
}

.infra-edit-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  border-color: rgba(255, 255, 255, 0.6) !important;
}
`;

if (!css.includes('infra-admin-btns')) {
  css += infraAdminCSS;
  fs.writeFileSync('styles.css', css, 'utf8');
  console.log('styles.css updated with infra admin button styles');
}
