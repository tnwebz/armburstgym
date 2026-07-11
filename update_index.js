const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Hero Background
html = html.replace(
  /<div class="hero-bg"><\/div>/,
  `<div class="editable-wrapper" style="position: absolute; inset: 0;">
        <div class="hero-bg" data-editable-id="hero_bg" style="width: 100%; height: 100%;"></div>
        <button class="edit-image-btn" data-target="hero_bg" style="display:none;">📷 Change Image</button>
      </div>`
);

// 2. Founder 1 (img_2.png)
html = html.replace(
  /<img\s+src="images\/img_2\.png"\s+alt="Mr Owner, Founder and Head Coach at ARMBURST GYM Gym Chengalpattu"\s+class="founders-carousel-img"\s+data-index="0"\s+\/>/g,
  `<div class="editable-wrapper" style="display: inline-block;">
              <img src="images/img_2.png" alt="Mr Owner, Founder and Head Coach at ARMBURST GYM Gym Chengalpattu" class="founders-carousel-img" data-index="0" data-editable-id="founder_1" />
              <button class="edit-image-btn" data-target="founder_1" style="display:none;">📷 Change Image</button>
            </div>`
);

// 3. Founder 2 (p1.png)
html = html.replace(
  /<img\s+src="images\/p1\.png"\s+alt="Strategic Lead and Co-founder at ARMBURST GYM unisex gym Chengalpattu"\s+class="founders-carousel-img"\s+data-index="1"\s+\/>/g,
  `<div class="editable-wrapper" style="display: inline-block;">
              <img src="images/p1.png" alt="Strategic Lead and Co-founder at ARMBURST GYM unisex gym Chengalpattu" class="founders-carousel-img" data-index="1" data-editable-id="founder_2" />
              <button class="edit-image-btn" data-target="founder_2" style="display:none;">📷 Change Image</button>
            </div>`
);

// 4. Classes 1 (c1.png)
html = html.replace(
  /<img\s+src="images\/c1\.png"\s+alt="Cardio training class at ARMBURST GYM gym near Thimmavaram Chengalpattu"\s+\/>/g,
  `<div class="editable-wrapper" style="display: block; width: 100%; height: 100%;">
              <img src="images/c1.png" alt="Cardio training class at ARMBURST GYM gym near Thimmavaram Chengalpattu" data-editable-id="classes_cardio" style="width: 100%; height: 100%; object-fit: cover;" />
              <button class="edit-image-btn" data-target="classes_cardio" style="display:none;">📷 Change Image</button>
            </div>`
);

// 5. Classes 2 (s1.png)
html = html.replace(
  /<img\s+src="images\/s1\.png"\s+alt="Strength and weight training session at ARMBURST GYM gym Chengalpattu"\s+\/>/g,
  `<div class="editable-wrapper" style="display: block; width: 100%; height: 100%;">
              <img src="images/s1.png" alt="Strength and weight training session at ARMBURST GYM gym Chengalpattu" data-editable-id="classes_strength" style="width: 100%; height: 100%; object-fit: cover;" />
              <button class="edit-image-btn" data-target="classes_strength" style="display:none;">📷 Change Image</button>
            </div>`
);

// 6. Schedule Modal (sh.png)
html = html.replace(
  /<img\s+src="images\/sh\.png"\s+alt="ARMBURST GYM Gym Chengalpattu class schedule and training timetable"\s+\/>/g,
  `<div class="editable-wrapper" style="display: inline-block;">
          <img src="images/sh.png" alt="ARMBURST GYM Gym Chengalpattu class schedule and training timetable" data-editable-id="pricing_schedule" />
          <button class="edit-image-btn" data-target="pricing_schedule" style="display:none;">📷 Change Image</button>
        </div>`
);

// Now insert the main logic script before </body>
const inlineCmsScript = `
    <!-- ===== INLINE CMS CORE LOGIC ===== -->
    <input type="file" id="inlineCmsFileInput" accept="image/*" style="display: none;" />
    
    <script type="module">
      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
      import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

      const firebaseConfig = {
        apiKey: "AIzaSyCGfLqqpSlet-jUtvQIGNwRFCR24iHhOUw",
        authDomain: "armburst-7c92c.firebaseapp.com",
        projectId: "armburst-7c92c",
        storageBucket: "armburst-7c92c.firebasestorage.app",
        messagingSenderId: "365920014049",
        appId: "1:365920014049:web:7dd3e1923dd66d04d471a0"
      };

      let db;
      try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
      } catch (e) {
        console.warn('Firebase init failed.');
      }

      const CLOUD_NAME = "mk5zjnak";
      const UPLOAD_PRESET = "ml_default";

      const isAdmin = sessionStorage.getItem("adminAuth") === "true";
      const fileInput = document.getElementById("inlineCmsFileInput");
      let currentEditTargetId = null;
      
      // Load Custom Images
      async function loadSiteImages() {
        const editables = document.querySelectorAll('[data-editable-id]');
        
        for (let el of editables) {
          const id = el.getAttribute('data-editable-id');
          
          let savedUrl = null;
          if (db) {
            try {
              const docSnap = await getDoc(doc(db, "site_images", id));
              if (docSnap.exists()) {
                savedUrl = docSnap.data().url;
              }
            } catch(e) {}
          } else {
            savedUrl = localStorage.getItem('cms_' + id);
          }
          
          if (savedUrl) {
            if (el.tagName === 'IMG') {
              el.src = savedUrl;
            } else {
              el.style.backgroundImage = \`url('\${savedUrl}')\`;
            }
          }
        }
        
        if (isAdmin) {
          document.querySelectorAll('.edit-image-btn').forEach(btn => {
            btn.style.display = 'block';
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              currentEditTargetId = btn.getAttribute('data-target');
              fileInput.click();
            });
          });
        }
      }

      document.addEventListener("DOMContentLoaded", loadSiteImages);

      // Handle Image Upload
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file || !currentEditTargetId) return;
        
        // Show loading state on button
        const btn = document.querySelector(\`.edit-image-btn[data-target="\${currentEditTargetId}"]\`);
        const originalText = btn.innerHTML;
        btn.innerHTML = "⏳ Uploading...";
        btn.disabled = true;

        try {
          // Compress
          let processedFile = file;
          if (file.size > 300 * 1024) {
             processedFile = await compressImage(file, 300 * 1024);
          }
          
          // Upload to Cloudinary
          const url = \`https://api.cloudinary.com/v1_1/\${CLOUD_NAME}/image/upload\`;
          const fd = new FormData();
          fd.append('file', processedFile);
          fd.append('upload_preset', UPLOAD_PRESET);
          
          const res = await fetch(url, { method: 'POST', body: fd });
          const data = await res.json();
          
          if (data.secure_url) {
            // Save to Firebase
            if (db) {
              await setDoc(doc(db, "site_images", currentEditTargetId), { url: data.secure_url });
            } else {
              localStorage.setItem('cms_' + currentEditTargetId, data.secure_url);
            }
            
            // Update DOM instantly
            const el = document.querySelector(\`[data-editable-id="\${currentEditTargetId}"]\`);
            if (el) {
              if (el.tagName === 'IMG') {
                el.src = data.secure_url;
              } else {
                el.style.backgroundImage = \`url('\${data.secure_url}')\`;
              }
            }
          }
        } catch(err) {
          console.error(err);
          alert("Upload failed.");
        } finally {
          btn.innerHTML = originalText;
          btn.disabled = false;
          fileInput.value = '';
          currentEditTargetId = null;
        }
      });
      
      function compressImage(file, maxSize) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              const maxWidth = 1920; 
              const scaleSize = Math.min(maxWidth / img.width, 1);
              canvas.width = img.width * scaleSize;
              canvas.height = img.height * scaleSize;
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              
              let quality = 0.8;
              const recursivelyCompress = (q) => {
                canvas.toBlob((blob) => {
                  if (blob.size <= maxSize || q <= 0.2) {
                    resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                  } else {
                    recursivelyCompress(q - 0.1);
                  }
                }, 'image/jpeg', q);
              };
              recursivelyCompress(quality);
            };
          };
        });
      }
    </script>
`;

if (!html.includes('INLINE CMS CORE LOGIC')) {
  html = html.replace('</body>', inlineCmsScript + '\n  </body>');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated with inline CMS.');
