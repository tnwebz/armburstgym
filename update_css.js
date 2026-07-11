const fs = require('fs');

let css = fs.readFileSync('styles.css', 'utf8');

const inlineCss = `
/* ===== INLINE CMS STYLES ===== */
.exit-admin-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: red;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
  z-index: 9999;
  box-shadow: 0 4px 15px rgba(255,0,0,0.4);
  transition: transform 0.2s;
}

.exit-admin-btn:hover {
  transform: scale(1.05);
}

.editable-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
}

.edit-image-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 2px solid white;
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.editable-wrapper:hover .edit-image-btn {
  opacity: 1;
  pointer-events: auto;
}

.edit-image-btn:hover {
  background: rgba(255, 0, 0, 0.8);
  border-color: red;
}

.inline-upload-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  padding: 10px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
}

.inline-upload-btn {
  background: red;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255,0,0,0.3);
}

.inline-upload-btn:hover {
  background: darkred;
}
`;

if (!css.includes("INLINE CMS STYLES")) {
  css += '\n' + inlineCss;
}

fs.writeFileSync('styles.css', css, 'utf8');
console.log('styles.css updated.');
