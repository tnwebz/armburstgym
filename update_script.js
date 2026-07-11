const fs = require('fs');

let script = fs.readFileSync('script.js', 'utf8');

// 1. Update the redirection
script = script.replace(
  /window\.location\.href\s*=\s*"admin\.html";/g,
  `window.location.reload();`
);

// 2. Add Exit Admin Mode button logic
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
console.log('script.js updated.');
