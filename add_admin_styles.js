const fs = require('fs');
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
  z-index: 9999;
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

if (!css.includes('.edit-image-btn')) {
  css += adminCSS;
  fs.writeFileSync('styles.css', css, 'utf8');
  console.log('Added .edit-image-btn styles to styles.css');
}
