const fs = require('fs');

let html = fs.readFileSync('admin.html', 'utf8');

// Replace the video size error block with compression logic
html = html.replace(
  /if \(videos\.length === 1 && videos\[0\]\.size > 10 \* 1024 \* 1024\) \{[\s\S]*?return;\s*\}/,
  `let processedVideo = videos.length === 1 ? videos[0] : null;
        if (processedVideo && processedVideo.size > 10 * 1024 * 1024) {
          showToast('⏳ Video > 10MB. Compressing in browser...', 'success');
          try {
            processedVideo = await compressVideo(processedVideo, 10 * 1024 * 1024);
          } catch (err) {
            console.error('Video compression failed:', err);
            showToast('❌ Video compression failed. Try a smaller file.', 'error');
            fileInput.value = '';
            uploadBtn.textContent = 'Upload Media';
            uploadBtn.disabled = false;
            return;
          }
        }`
);

// Replace the video upload call
html = html.replace(
  /if \(videos\.length === 1\) \{\s*await uploadToCloudinary\(videos\[0\], 'video'\);\s*\}/,
  `if (processedVideo) {
            await uploadToCloudinary(processedVideo, 'video');
          }`
);

const compressFunc = `
      // Compress Video using MediaRecorder and Canvas
      function compressVideo(file, targetSizeInBytes) {
        return new Promise((resolve, reject) => {
          const video = document.createElement('video');
          video.src = URL.createObjectURL(file);
          video.muted = true;
          video.playsInline = true;
          
          video.onloadedmetadata = () => {
            const duration = video.duration;
            if (!duration || !isFinite(duration)) {
               return reject(new Error('Invalid video duration'));
            }
            
            let targetBitrate = Math.floor((targetSizeInBytes * 8 * 0.9) / duration);
            if (targetBitrate < 500000) targetBitrate = 500000;
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            let width = video.videoWidth;
            let height = video.videoHeight;
            const MAX_DIM = 720;
            if (width > MAX_DIM || height > MAX_DIM) {
              if (width > height) {
                height = Math.floor(height * (MAX_DIM / width));
                width = MAX_DIM;
              } else {
                width = Math.floor(width * (MAX_DIM / height));
                height = MAX_DIM;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            let stream;
            try {
              stream = canvas.captureStream(30);
            } catch (e) {
              return reject(e);
            }
            
            let options = { mimeType: 'video/webm; codecs=vp9' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              options = { mimeType: 'video/webm; codecs=vp8' };
              if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options = { mimeType: 'video/webm' };
              }
            }
            options.videoBitsPerSecond = targetBitrate;
            
            let recorder;
            try {
              recorder = new MediaRecorder(stream, options);
            } catch (e) {
              return reject(e);
            }
            
            const chunks = [];
            recorder.ondataavailable = e => {
              if (e.data.size > 0) chunks.push(e.data);
            };
            
            recorder.onstop = () => {
              const compressedBlob = new Blob(chunks, { type: options.mimeType || 'video/webm' });
              const compressedFile = new File([compressedBlob], file.name.split('.')[0] + '.webm', { type: options.mimeType || 'video/webm' });
              URL.revokeObjectURL(video.src);
              resolve(compressedFile);
            };
            
            video.onplay = () => {
              const fps = 30;
              const interval = 1000 / fps;
              const drawFrame = () => {
                if (video.paused || video.ended) return;
                ctx.drawImage(video, 0, 0, width, height);
                setTimeout(drawFrame, interval);
              };
              drawFrame();
            };
            
            video.onended = () => {
              recorder.stop();
            };
            
            recorder.start();
            video.play().catch(reject);
          };
          
          video.onerror = reject;
        });
      }
`;

// Insert the compressFunc before function compressImage
html = html.replace(
  /\/\/ Compress Image using Canvas/,
  compressFunc + '\n      // Compress Image using Canvas'
);

fs.writeFileSync('admin.html', html, 'utf8');
console.log('Updated admin.html with video compression logic.');
