const fs = require('fs');

// ============================================================
// FIX 1: index.html — Fix founders carousel image wrapping
// The editable-wrappers broke the absolute positioning.
// Solution: Make wrappers position:absolute too, so the
// .founders-carousel-img inside can be position:absolute inset:0
// ============================================================
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Replace the two editable-wrapper divs in founders carousel
// to use proper absolute positioning instead of inline-block
indexHtml = indexHtml.replace(
  '<div class="editable-wrapper" style="display: inline-block;">\n              <img src="images/img_2.png"',
  '<div class="editable-wrapper" style="position: absolute; inset: 0;">\n              <img src="images/img_2.png"'
);

indexHtml = indexHtml.replace(
  '<div class="editable-wrapper" style="display: inline-block;">\n              <img src="images/p1.png"',
  '<div class="editable-wrapper" style="position: absolute; inset: 0;">\n              <img src="images/p1.png"'
);

// Also add the infrastructure section images as editable
// (the infra-slider images d1, d2, d3)
// These are already in the infra-slider-track - let's add editable IDs to them
indexHtml = indexHtml.replace(
  '<img\r\n            src="images/d1.png"\r\n            alt="Premium weight training equipment at ARMBURST GYM Thimmavaram Chengalpattu"\r\n          />',
  '<img\r\n            src="images/d1.png"\r\n            alt="Premium weight training equipment at ARMBURST GYM Thimmavaram Chengalpattu"\r\n            data-editable-id="infra_1"\r\n          />'
);

indexHtml = indexHtml.replace(
  '<img\r\n            src="images/d2.png"\r\n            alt="State-of-the-art cardio zone at ARMBURST GYM Gym Chengalpattu"\r\n          />',
  '<img\r\n            src="images/d2.png"\r\n            alt="State-of-the-art cardio zone at ARMBURST GYM Gym Chengalpattu"\r\n            data-editable-id="infra_2"\r\n          />'
);

indexHtml = indexHtml.replace(
  '<img\r\n            src="images/d3.png"\r\n            alt="Functional training area at the best gym in Chengalpattu ARMBURST GYM"\r\n          />',
  '<img\r\n            src="images/d3.png"\r\n            alt="Functional training area at the best gym in Chengalpattu ARMBURST GYM"\r\n            data-editable-id="infra_3"\r\n          />'
);

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('[index.html] Fixed founders wrapper positioning + added infra editable IDs');


// ============================================================
// FIX 2: gallery.html — Add admin upload logic script
// The upload buttons exist but there's no JS to show them
// or handle uploads when in admin mode.
// ============================================================
let galleryHtml = fs.readFileSync('gallery.html', 'utf8');

const galleryAdminScript = `
    <script type="module">
      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
      import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

      const CLOUD_NAME = "mk5zjnak";
      const UPLOAD_PRESET = "ml_default";

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
      } catch(e) { console.warn("Firebase init skipped on gallery"); }

      document.addEventListener("DOMContentLoaded", () => {
        const isAdmin = sessionStorage.getItem("adminAuth") === "true";
        if (!isAdmin) return;

        // Show upload buttons
        const photoTools = document.getElementById("admin-photo-tools");
        const videoTools = document.getElementById("admin-video-tools");
        if (photoTools) photoTools.style.display = "block";
        if (videoTools) videoTools.style.display = "block";

        // Add Exit Admin button
        const exitBtn = document.createElement("button");
        exitBtn.className = "exit-admin-btn";
        exitBtn.innerHTML = "\\u{1F513} Exit Admin Mode";
        exitBtn.style.cssText = "position:fixed;bottom:20px;right:20px;z-index:9999;padding:12px 24px;background:#ff4444;color:#fff;border:none;border-radius:50px;cursor:pointer;font-weight:700;font-size:0.9rem;box-shadow:0 4px 15px rgba(255,0,0,0.3);";
        exitBtn.onclick = () => {
          sessionStorage.removeItem("adminAuth");
          window.location.reload();
        };
        document.body.appendChild(exitBtn);

        const fileInput = document.getElementById("inlineGalleryFileInput");
        let uploadType = "image";

        document.getElementById("upload-photo-btn").addEventListener("click", () => {
          uploadType = "image";
          fileInput.accept = "image/*";
          fileInput.click();
        });

        document.getElementById("upload-video-btn").addEventListener("click", () => {
          uploadType = "video";
          fileInput.accept = "video/*";
          fileInput.click();
        });

        fileInput.addEventListener("change", async (e) => {
          const file = e.target.files[0];
          if (!file) return;

          const btn = uploadType === "image"
            ? document.getElementById("upload-photo-btn")
            : document.getElementById("upload-video-btn");
          const originalText = btn.innerHTML;
          btn.innerHTML = "\\u23F3 Uploading...";
          btn.disabled = true;

          try {
            const resourceType = uploadType === "video" ? "video" : "image";
            const url = "https://api.cloudinary.com/v1_1/" + CLOUD_NAME + "/" + resourceType + "/upload";

            const fd = new FormData();
            fd.append("file", file);
            fd.append("upload_preset", UPLOAD_PRESET);

            const res = await fetch(url, { method: "POST", body: fd });
            const data = await res.json();

            if (data.secure_url) {
              const newDoc = {
                url: data.secure_url,
                type: uploadType,
                public_id: data.public_id,
                timestamp: Date.now()
              };

              if (db) {
                await addDoc(collection(db, "gallery"), newDoc);
              } else {
                let localGal = JSON.parse(localStorage.getItem("cms_gallery") || "[]");
                localGal.push(newDoc);
                localStorage.setItem("cms_gallery", JSON.stringify(localGal));
              }

              alert("Uploaded successfully! Reloading...");
              window.location.reload();
            }
          } catch (err) {
            console.error(err);
            alert("Upload failed.");
          } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
            fileInput.value = "";
          }
        });
      });
    </script>`;

// Insert before </body>
if (!galleryHtml.includes('admin-photo-tools') || !galleryHtml.includes('CLOUD_NAME')) {
  // Only add the script if the upload logic doesn't already exist
  if (!galleryHtml.includes('CLOUD_NAME')) {
    galleryHtml = galleryHtml.replace('</body>', galleryAdminScript + '\n  </body>');
    console.log('[gallery.html] Added admin upload logic script');
  } else {
    console.log('[gallery.html] Upload logic already exists, skipping');
  }
} else {
  console.log('[gallery.html] All gallery admin features already present');
}

// Style for upload buttons
const uploadBtnStyle = `
    <style>
      .inline-upload-btn {
        padding: 14px 32px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: #fff;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        font-size: 1rem;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 20px rgba(118, 75, 162, 0.4);
        transition: all 0.3s ease;
      }
      .inline-upload-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(118, 75, 162, 0.5);
      }
      .inline-upload-btn:disabled {
        opacity: 0.6;
        cursor: wait;
      }
    </style>`;

if (!galleryHtml.includes('inline-upload-btn')) {
  galleryHtml = galleryHtml.replace('</head>', uploadBtnStyle + '\n  </head>');
  console.log('[gallery.html] Added upload button styles');
}

fs.writeFileSync('gallery.html', galleryHtml, 'utf8');


// ============================================================
// FIX 3: styles.css — Fix editable-wrapper positioning for
// the founders carousel + add edit-image-btn + exit-admin-btn
// ============================================================
let css = fs.readFileSync('styles.css', 'utf8');

const adminCSS = `

/* ===== ADMIN INLINE CMS STYLES ===== */
.editable-wrapper {
  position: relative;
}

.edit-image-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 20;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.edit-image-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.exit-admin-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 99999;
  padding: 12px 24px;
  background: #ff4444;
  color: #fff;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.exit-admin-btn:hover {
  background: #cc0000;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 0, 0, 0.4);
}
`;

if (!css.includes('exit-admin-btn')) {
  css += adminCSS;
  console.log('[styles.css] Added admin CMS styles');
} else {
  console.log('[styles.css] Admin styles already exist');
}

fs.writeFileSync('styles.css', css, 'utf8');


// ============================================================
// FINAL VERIFICATION
// ============================================================
const finalScript = fs.readFileSync('script.js', 'utf8');
const finalGallery = fs.readFileSync('gallery.html', 'utf8');

console.log('\n=== FINAL VERIFICATION ===');
console.log('script.js has admin.html?', finalScript.includes('admin.html') ? 'YES (BAD!)' : 'NO (GOOD!)');
console.log('gallery.html has admin.html?', finalGallery.includes('admin.html') ? 'YES (BAD!)' : 'NO (GOOD!)');
console.log('gallery.html has upload logic?', finalGallery.includes('CLOUD_NAME') ? 'YES (GOOD!)' : 'NO (BAD!)');
console.log('gallery.html has upload buttons?', finalGallery.includes('admin-photo-tools') ? 'YES (GOOD!)' : 'NO (BAD!)');

try {
  require('child_process').execSync('node -c script.js', { stdio: 'pipe' });
  console.log('script.js syntax: OK');
} catch(e) {
  console.error('script.js syntax: ERROR');
}
