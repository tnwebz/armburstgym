const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// The inline CMS script block to inject before </body>
const cmsBlock = `
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
      
      // Load Custom Images from Firebase
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
              el.style.backgroundImage = "url('" + savedUrl + "')";
            }
          }
        }
        
        if (isAdmin) {
          // Show infra admin buttons
          const infraBtns = document.querySelector('.infra-admin-btns');
          if (infraBtns) infraBtns.style.display = 'flex';
          
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
        
        const btn = document.querySelector('.edit-image-btn[data-target="' + currentEditTargetId + '"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = "\\u23F3 Uploading...";
        btn.disabled = true;

        try {
          let processedFile = file;
          if (file.size > 300 * 1024) {
             processedFile = await compressImage(file, 300 * 1024);
          }
          
          const url = "https://api.cloudinary.com/v1_1/" + CLOUD_NAME + "/image/upload";
          const fd = new FormData();
          fd.append('file', processedFile);
          fd.append('upload_preset', UPLOAD_PRESET);
          
          const res = await fetch(url, { method: 'POST', body: fd });
          const data = await res.json();
          
          if (data.secure_url) {
            if (db) {
              await setDoc(doc(db, "site_images", currentEditTargetId), { url: data.secure_url });
            } else {
              localStorage.setItem('cms_' + currentEditTargetId, data.secure_url);
            }
            
            // Update all matching images in DOM
            document.querySelectorAll('[data-editable-id="' + currentEditTargetId + '"]').forEach(el => {
              if (el.tagName === 'IMG') {
                el.src = data.secure_url;
              } else {
                el.style.backgroundImage = "url('" + data.secure_url + "')";
              }
            });
            
            alert("Image updated successfully!");
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

// Only add if not already present
if (!html.includes('inlineCmsFileInput')) {
  html = html.replace('  </body>', cmsBlock + '\r\n  </body>');
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Added inline CMS script to index.html');
} else {
  console.log('CMS script already exists in index.html');
}
