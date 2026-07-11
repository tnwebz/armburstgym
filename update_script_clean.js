const fs = require('fs');

let script = fs.readFileSync('script.js', 'utf8');

// The original logic block in script.js to replace:
//        const passkey = prompt("Enter Admin Passkey:");
//        if (passkey === '111') {
//          shields.forEach(s => s.classList.add('unlocked'));
//          setTimeout(() => {
//            window.location.href = 'admin.html';
//          }, 500);
//        } else if (passkey !== null) {
//          alert('Incorrect passkey.');
//        }

const originalLogic = `const passkey = prompt("Enter Admin Passkey:");
        if (passkey === '111') {
          shields.forEach(s => s.classList.add('unlocked'));
          setTimeout(() => {
            window.location.href = 'admin.html';
          }, 500);
        } else if (passkey !== null) {
          alert('Incorrect passkey.');
        }`;

const newLogic = `const isAdmin = sessionStorage.getItem("adminAuth") === "true";
        if (isAdmin) {
            sessionStorage.removeItem("adminAuth");
            window.location.reload();
        } else {
            const passkey = prompt("Enter Admin Passkey:");
            if (passkey === '111') {
              sessionStorage.setItem("adminAuth", "true");
              shields.forEach(s => s.classList.add('unlocked'));
              setTimeout(() => {
                window.location.reload();
              }, 500);
            } else if (passkey !== null) {
              alert('Incorrect passkey.');
            }
        }`;

script = script.replace(originalLogic, newLogic);

// Add the Exit Admin Mode button logic if it doesn't exist
const exitAdminLogic = `
document.addEventListener("DOMContentLoaded", () => {
  const isAdmin = sessionStorage.getItem("adminAuth") === "true";
  
  // Highlight the shield if admin
  if (isAdmin) {
    const desktopShield = document.getElementById("adminShieldDesktop");
    const mobileShield = document.getElementById("adminShieldMobile");
    if (desktopShield) desktopShield.classList.add("unlocked");
    if (mobileShield) mobileShield.classList.add("unlocked");
    
    // Add Exit button
    const exitBtn = document.createElement("button");
    exitBtn.className = "exit-admin-btn";
    exitBtn.innerHTML = "🔓 Exit Admin Mode";
    exitBtn.onclick = () => {
      sessionStorage.removeItem("adminAuth");
      window.location.reload();
    };
    document.body.appendChild(exitBtn);
  }
});
`;

if (!script.includes("exit-admin-btn")) {
  script += '\n' + exitAdminLogic;
}

fs.writeFileSync('script.js', script, 'utf8');
console.log('Successfully repaired and updated script.js');
