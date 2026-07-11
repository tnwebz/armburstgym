const fs = require('fs');

let html = fs.readFileSync('gallery.html', 'utf8');

// Use a regex to replace the entire DOMContentLoaded block for loading media
const regex = /document\.addEventListener\(\s*"DOMContentLoaded"\s*,\s*async\s*\(\)\s*=>\s*\{[\s\S]*?catch\s*\(\s*error\s*\)\s*\{[\s\S]*?\}\s*\}\s*\)\s*;/m;

const newScript = `document.addEventListener("DOMContentLoaded", async () => {
          const photoGallery = document.getElementById("photo-gallery");
          const videoGallery = document.getElementById("video-gallery");
          const loader = document.getElementById("gallery-loader");

          try {
            loader.style.display = "block";
            
            // Firebase setup (using module import)
            const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
            const { getFirestore, collection, getDocs, query, orderBy } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
            
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
              console.warn('Firebase not configured. Using localStorage fallback.');
            }

            let allMedia = [];
            if (db) {
              const q = query(collection(db, 'gallery'), orderBy('created_at', 'desc'));
              const snapshot = await getDocs(q);
              allMedia = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } else {
              allMedia = JSON.parse(localStorage.getItem('gym_gallery') || '[]').reverse();
            }

            loader.style.display = "none";

            if (allMedia.length === 0) {
              if (photoGallery) photoGallery.innerHTML = '<div class="gallery-empty"><div class="empty-icon">📷</div><p>No photos available yet.</p></div>';
              if (videoGallery) videoGallery.innerHTML = '<div class="gallery-empty"><div class="empty-icon">🎥</div><p>No videos available yet.</p></div>';
              return;
            }

            let photoCount = 0;
            let videoCount = 0;

            allMedia.forEach((resource) => {
              const card = document.createElement("div");
              card.className = "gallery-item-card";
              const isVideo = resource.resource_type === 'video';

              if (isVideo && videoGallery) {
                const video = document.createElement("video");
                video.src = resource.secure_url;
                video.controls = true;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.preload = "metadata";
                card.appendChild(video);
                videoGallery.appendChild(card);
                videoCount++;
              } else if (photoGallery) {
                const img = document.createElement("img");
                img.src = resource.secure_url;
                img.alt = "ARMBURST GYM Gallery Media";
                img.loading = "lazy";
                img.addEventListener("click", () => openLightbox(resource.secure_url));
                card.appendChild(img);
                photoGallery.appendChild(card);
                photoCount++;
              }
            });

            if (photoCount === 0 && photoGallery) {
              photoGallery.innerHTML = '<div class="gallery-empty"><div class="empty-icon">📷</div><p>No photos available yet.</p></div>';
            }
            if (videoCount === 0 && videoGallery) {
              videoGallery.innerHTML = '<div class="gallery-empty"><div class="empty-icon">🎥</div><p>No videos available yet.</p></div>';
            }
          } catch (error) {
            console.error(error);
            loader.style.display = "none";
            if (photoGallery) photoGallery.innerHTML = '<div class="gallery-empty"><div class="empty-icon">⚠️</div><p>Unable to load photos at this time.</p></div>';
            if (videoGallery) videoGallery.innerHTML = '<div class="gallery-empty"><div class="empty-icon">⚠️</div><p>Unable to load videos at this time.</p></div>';
          }
        });`;

if (regex.test(html)) {
  html = html.replace(regex, newScript);
  
  // Convert <script> to <script type="module"> if needed because of await import()
  // Search backwards from newScript location to find the enclosing <script>
  // A simpler way is just to add type="module" to all scripts in the file that lack it, but we only want to change the one at the bottom.
  html = html.replace(/<script>\s*\n\s*\/\/\s*Tab Switching/, '<script type="module">\n      // Tab Switching');
  
  fs.writeFileSync('gallery.html', html, 'utf8');
  console.log('Successfully updated gallery.html fetching logic via regex.');
} else {
  console.log('Regex did not match.');
}
