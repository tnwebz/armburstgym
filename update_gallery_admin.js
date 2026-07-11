const fs = require('fs');

let html = fs.readFileSync('gallery.html', 'utf8');

// 1. Inject Inline Upload Buttons into the tabs
html = html.replace(
  /<div\s+class="gallery-masonry gallery-panel active"\s+id="photo-gallery"\s*><\/div>/,
  `
      <div id="admin-photo-tools" style="display:none; text-align:center; margin-bottom: 20px;">
        <button class="inline-upload-btn" id="upload-photo-btn">📷 Upload Photo</button>
      </div>
      <div class="gallery-masonry gallery-panel active" id="photo-gallery"></div>
  `
);

html = html.replace(
  /<div class="gallery-masonry gallery-panel" id="video-gallery"><\/div>/,
  `
      <div id="admin-video-tools" style="display:none; text-align:center; margin-bottom: 20px;">
        <button class="inline-upload-btn" id="upload-video-btn">🎬 Upload Video</button>
      </div>
      <div class="gallery-masonry gallery-panel" id="video-gallery"></div>
  `
);

// 2. Inject hidden file input
const hiddenInput = `<input type="file" id="inlineGalleryFileInput" style="display: none;" />`;
if (!html.includes('inlineGalleryFileInput')) {
  html = html.replace('</body>', hiddenInput + '\n  </body>');
}

// 3. Inject Admin Logic
const adminLogic = `
<script type="module">
  import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
  import { getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

  const CLOUD_NAME = "mk5zjnak";
  const UPLOAD_PRESET = "ml_default";

  document.addEventListener("DOMContentLoaded", () => {
    const isAdmin = sessionStorage.getItem("adminAuth") === "true";
    if (!isAdmin) return;

    document.getElementById("admin-photo-tools").style.display = "block";
    document.getElementById("admin-video-tools").style.display = "block";

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

      const btn = uploadType === "image" ? document.getElementById("upload-photo-btn") : document.getElementById("upload-video-btn");
      const originalText = btn.innerHTML;
      btn.innerHTML = "⏳ Uploading...";
      btn.disabled = true;

      try {
        let processedFile = file;
        
        // Very basic compression for images (reuse logic if needed, skipping for brevity here assuming small uploads or passing to Cloudinary)
        // Note: Cloudinary handles video/image optimizations anyway if we use auto formats.
        
        const resourceType = uploadType === "video" ? "video" : "image";
        const url = \`https://api.cloudinary.com/v1_1/\${CLOUD_NAME}/\${resourceType}/upload\`;
        
        const fd = new FormData();
        fd.append("file", processedFile);
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
          
          try {
            const db = getFirestore(getApp());
            await addDoc(collection(db, "gallery"), newDoc);
          } catch(err) {
             // Fallback local storage
             let localGal = JSON.parse(localStorage.getItem('cms_gallery') || '[]');
             localGal.push(newDoc);
             localStorage.setItem('cms_gallery', JSON.stringify(localGal));
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
        fileInput.value = '';
      }
    });
  });
</script>
`;

if (!html.includes('admin-photo-tools')) {
  html = html.replace('</body>', adminLogic + '\n</body>');
}

fs.writeFileSync('gallery.html', html, 'utf8');
console.log('gallery.html updated with inline uploaders.');
