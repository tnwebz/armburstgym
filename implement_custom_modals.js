const fs = require('fs');

// 1. Add CSS
const cssCode = `
/* Custom Modal */
.custom-modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}
.custom-modal-overlay.active {
  opacity: 1;
  visibility: visible;
}
.custom-modal-box {
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  min-width: 300px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  transform: translateY(20px);
  transition: all 0.3s ease;
}
.custom-modal-overlay.active .custom-modal-box {
  transform: translateY(0);
}
.custom-modal-msg {
  color: #ff0000;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 20px;
}
.custom-modal-input {
  width: 90%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 20px;
  font-family: 'Inter', sans-serif;
  color: #333;
  outline: none;
  font-size: 1rem;
  text-align: center;
}
.custom-modal-input:focus {
  border-color: #ff0000;
}
.custom-modal-btns {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.custom-modal-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  background: #ff0000;
  color: white;
  transition: all 0.2s;
}
.custom-modal-btn.cancel {
  background: #ccc;
  color: #333;
}
.custom-modal-btn:hover {
  opacity: 0.8;
}
`;

let css = fs.readFileSync('styles.css', 'utf8');
if (!css.includes('.custom-modal-overlay')) {
  fs.appendFileSync('styles.css', cssCode);
}

// 2. Add Modal JS to script.js
const jsModalCode = `
window.customAlert = function(msg, callback) {
  createModal(msg, false, callback);
};
window.customPrompt = function(msg, callback) {
  createModal(msg, true, callback);
};

function createModal(msg, isPrompt, callback) {
  const overlay = document.createElement('div');
  overlay.className = 'custom-modal-overlay';
  
  let inputHtml = isPrompt ? '<input type="password" class="custom-modal-input" id="customModalInput" />' : '';
  let cancelBtnHtml = isPrompt ? '<button class="custom-modal-btn cancel" id="customModalCancel">Cancel</button>' : '';

  overlay.innerHTML = \`
    <div class="custom-modal-box">
      <div class="custom-modal-msg">\${msg}</div>
      \${inputHtml}
      <div class="custom-modal-btns">
        <button class="custom-modal-btn" id="customModalOk">OK</button>
        \${cancelBtnHtml}
      </div>
    </div>
  \`;
  document.body.appendChild(overlay);

  setTimeout(() => overlay.classList.add('active'), 10);

  const okBtn = overlay.querySelector('#customModalOk');
  const cancelBtn = overlay.querySelector('#customModalCancel');
  const inputEl = overlay.querySelector('#customModalInput');

  if (inputEl) inputEl.focus();

  function close(val) {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
    if (callback) callback(val);
  }

  okBtn.onclick = () => close(isPrompt ? inputEl.value : true);
  if (cancelBtn) cancelBtn.onclick = () => close(null);
  
  if (inputEl) {
    inputEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') close(inputEl.value);
    });
  }
}
`;

let scriptJs = fs.readFileSync('script.js', 'utf8');
if (!scriptJs.includes('window.customAlert')) {
  scriptJs += jsModalCode;
  
  // Replace prompt logic in script.js
  const oldPromptLogic = `const passkey = prompt("Enter Admin Passkey:");
        if (passkey === '111') {
          sessionStorage.setItem('adminAuth', 'true');
          shields.forEach(s => s.classList.add('unlocked'));
          window.location.reload();
        } else if (passkey !== null) {
          alert('Incorrect passkey.');
        }`;
        
  const newPromptLogic = `window.customPrompt("Enter Admin Passkey:", (passkey) => {
          if (passkey === '111') {
            sessionStorage.setItem('adminAuth', 'true');
            shields.forEach(s => s.classList.add('unlocked'));
            window.location.reload();
          } else if (passkey !== null) {
            window.customAlert('Incorrect passkey.');
          }
        });`;
        
  scriptJs = scriptJs.replace(oldPromptLogic, newPromptLogic);
  fs.writeFileSync('script.js', scriptJs);
}

// 3. Replace alert() in index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/alert\(/g, 'window.customAlert(');
fs.writeFileSync('index.html', indexHtml);

// 4. Replace alert() in gallery.html
let galleryHtml = fs.readFileSync('gallery.html', 'utf8');
galleryHtml = galleryHtml.replace(/alert\(/g, 'window.customAlert(');
fs.writeFileSync('gallery.html', galleryHtml);

console.log("Custom modal implementation complete.");
