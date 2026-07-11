const fs = require('fs');

let html = fs.readFileSync('admin.html', 'utf8');

// Replace upload button with custom file input trigger
html = html.replace(
  /<button id="upload_widget" class="upload-btn">Upload Media<\/button>/,
  '<button id="custom_upload_btn" class="upload-btn">Upload Media</button>\n      <input type="file" id="mediaInput" multiple accept="image/*,video/*" style="display:none;" />'
);

// We need to replace the entire <script> section at the bottom.
// We'll cut everything from <script src="https://upload-widget.cloudinary.com/global/all.js" to </body>
const scriptStartIndex = html.indexOf('<script');
const bodyEndIndex = html.indexOf('</body>');

const newScripts = `
    <!-- Firebase SDKs -->
    <script type="module">
      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
      import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

      // TODO: Replace with your actual Firebase config
      const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
      };

      let db;
      try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
      } catch (e) {
        console.warn('Firebase not configured yet. Using localStorage fallback.');
      }

      const CLOUD_NAME = "mk5zjnak";
      const UPLOAD_PRESET = "ml_default"; // Change to your unsigned upload preset

      const uploadBtn = document.getElementById('custom_upload_btn');
      const fileInput = document.getElementById('mediaInput');
      const successMsg = document.getElementById('success-msg');
      const galleryLink = document.getElementById('gallery-link');
      const grid = document.getElementById('mediaGrid');
      const countBadge = document.getElementById('mediaCount');
      const countNumber = document.getElementById('countNumber');

      // === Toast Notification ===
      function showToast(message, type = "success") {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.className = \`toast \${type}\`;
        toast.offsetHeight;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
      }

      // === Upload Logic ===
      uploadBtn.addEventListener('click', () => fileInput.click());

      fileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const images = files.filter(f => f.type.startsWith('image/'));
        const videos = files.filter(f => f.type.startsWith('video/'));

        if (images.length > 3) {
          showToast('❌ Max 3 images allowed at a time.', 'error');
          fileInput.value = '';
          return;
        }

        if (videos.length > 1) {
          showToast('❌ Max 1 video allowed at a time.', 'error');
          fileInput.value = '';
          return;
        }

        if (videos.length === 1 && videos[0].size > 10 * 1024 * 1024) {
          showToast('❌ Video must be under 10MB.', 'error');
          fileInput.value = '';
          return;
        }

        uploadBtn.textContent = 'Uploading...';
        uploadBtn.disabled = true;

        try {
          for (let img of images) {
            let processedFile = img;
            if (img.size > 300 * 1024) {
              processedFile = await compressImage(img, 300 * 1024);
            }
            await uploadToCloudinary(processedFile, 'image');
          }

          if (videos.length === 1) {
            await uploadToCloudinary(videos[0], 'video');
          }

          successMsg.style.display = 'block';
          galleryLink.style.display = 'inline-block';
          setTimeout(() => successMsg.style.display = 'none', 5000);
          
          loadMedia();
        } catch (error) {
          console.error(error);
          showToast('❌ Upload failed.', 'error');
        } finally {
          uploadBtn.textContent = 'Upload Media';
          uploadBtn.disabled = false;
          fileInput.value = '';
        }
      });

      // Compress Image using Canvas
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
              const maxWidth = 1200; // Resize large images
              const scaleSize = maxWidth / img.width;
              canvas.width = maxWidth;
              canvas.height = img.height * scaleSize;
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              
              let quality = 0.8;
              const recursivelyCompress = (q) => {
                canvas.toBlob((blob) => {
                  if (blob.size <= maxSize || q <= 0.2) {
                    resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                  } else {
                    recursivelyCompress(q - 0.2);
                  }
                }, 'image/jpeg', q);
              };
              recursivelyCompress(quality);
            };
          };
        });
      }

      // Upload to Cloudinary Unsigned
      async function uploadToCloudinary(file, resourceType) {
        const url = \`https://api.cloudinary.com/v1_1/\${CLOUD_NAME}/\${resourceType}/upload\`;
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', UPLOAD_PRESET);
        
        const res = await fetch(url, { method: 'POST', body: fd });
        const data = await res.json();
        
        if (data.secure_url) {
          await saveToDatabase({
            public_id: data.public_id,
            secure_url: data.secure_url,
            resource_type: resourceType,
            format: data.format,
            created_at: new Date().toISOString()
          });
        }
      }

      // === Database Mock / Firebase ===
      async function saveToDatabase(mediaData) {
        if (db) {
          await addDoc(collection(db, 'gallery'), mediaData);
        } else {
          let gallery = JSON.parse(localStorage.getItem('gym_gallery') || '[]');
          gallery.push(mediaData);
          localStorage.setItem('gym_gallery', JSON.stringify(gallery));
        }
      }

      async function fetchFromDatabase() {
        if (db) {
          const q = query(collection(db, 'gallery'), orderBy('created_at', 'desc'));
          const snapshot = await getDocs(q);
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } else {
          return JSON.parse(localStorage.getItem('gym_gallery') || '[]').reverse();
        }
      }
      
      async function deleteFromDatabase(id) {
        if (db) {
          await deleteDoc(doc(db, 'gallery', id));
        } else {
          let gallery = JSON.parse(localStorage.getItem('gym_gallery') || '[]');
          gallery = gallery.filter(g => g.public_id !== id && g.id !== id);
          localStorage.setItem('gym_gallery', JSON.stringify(gallery));
        }
      }

      // === Load Media ===
      async function loadMedia() {
        grid.innerHTML = '<div class="media-loader" style="grid-column: 1 / -1;"><div class="spinner"></div><div>Loading gallery media...</div></div>';
        try {
          const allMedia = await fetchFromDatabase();
          if (allMedia.length === 0) {
            grid.innerHTML = '<div class="media-empty" style="grid-column: 1 / -1;"><div class="empty-icon">📭</div><p>No media in the gallery yet.</p></div>';
            countBadge.style.display = "none";
            return;
          }

          countNumber.textContent = allMedia.length;
          countBadge.style.display = "inline-flex";
          grid.innerHTML = "";

          allMedia.forEach((resource) => {
            const card = document.createElement("div");
            card.className = "media-card";
            
            const isVideo = resource.resource_type === 'video';
            const dbId = resource.id || resource.public_id;
            
            if (isVideo) {
              card.innerHTML = \`
                <video src="\${resource.secure_url}" muted loop playsinline></video>
                <div class="delete-overlay">
                  <button class="delete-btn" data-id="\${dbId}">🗑️ Delete</button>
                </div>
              \`;
            } else {
              card.innerHTML = \`
                <img src="\${resource.secure_url}" alt="Gallery media" loading="lazy">
                <div class="delete-overlay">
                  <button class="delete-btn" data-id="\${dbId}">🗑️ Delete</button>
                </div>
              \`;
            }
            grid.appendChild(card);
          });
          
          document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => confirmDelete(e.target.dataset.id, e.target));
          });

        } catch (error) {
          console.error(error);
        }
      }

      // === Delete Confirmation ===
      let pendingDeleteId = null;
      let pendingDeleteBtn = null;

      function confirmDelete(id, btn) {
        pendingDeleteId = id;
        pendingDeleteBtn = btn;
        document.getElementById("confirmModal").classList.add("active");
      }

      document.getElementById("cancelDeleteBtn").addEventListener("click", () => {
        document.getElementById("confirmModal").classList.remove("active");
      });

      document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
        if (!pendingDeleteId) return;
        document.getElementById("confirmModal").classList.remove("active");
        
        pendingDeleteBtn.textContent = 'Deleting...';
        await deleteFromDatabase(pendingDeleteId);
        showToast('✅ Media deleted from database.', 'success');
        loadMedia();
      });

      document.getElementById('refreshBtn').addEventListener('click', loadMedia);
      
      document.addEventListener("DOMContentLoaded", loadMedia);
    </script>
`;

const updatedHtml = html.substring(0, scriptStartIndex) + newScripts + html.substring(bodyEndIndex);
fs.writeFileSync('admin.html', updatedHtml, 'utf8');
console.log('Successfully updated admin.html');
