const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function replaceLenient(text, target, replacement) {
    // Remove all whitespace for both target and text and search
    // This is dangerous, so instead we just do a more lenient regex
}

// Let's just find the index of the elements and slice the string.

// 1. Founder 1
let f1Idx = html.indexOf('<img\r\n              src="images/img_2.png"');
if (f1Idx !== -1) {
  let f1End = html.indexOf('/>', f1Idx) + 2;
  html = html.substring(0, f1Idx) + 
         '<div class="editable-wrapper" style="position: absolute; inset: 0;">\n              <img src="images/img_2.png" alt="Mr. DINESH, Founder and Head Coach at ARMBURST GYM Gym Chengalpattu" class="founders-carousel-img" data-index="0" data-editable-id="founder_1" />\n              <button class="edit-image-btn" data-target="founder_1" style="display:none;">📷 Change Image</button>\n            </div>' + 
         html.substring(f1End);
}

// 2. Founder 2
let f2Idx = html.indexOf('<img\r\n              src="images/p1.png"');
if (f2Idx !== -1) {
  let f2End = html.indexOf('/>', f2Idx) + 2;
  html = html.substring(0, f2Idx) + 
         '<div class="editable-wrapper" style="position: absolute; inset: 0;">\n              <img src="images/p1.png" alt="Strategic Lead and Co-founder at ARMBURST GYM unisex gym Chengalpattu" class="founders-carousel-img" data-index="1" data-editable-id="founder_2" />\n              <button class="edit-image-btn" data-target="founder_2" style="display:none;">📷 Change Image</button>\n            </div>' + 
         html.substring(f2End);
}

// 3. Classes Cardio
let c1Idx = html.indexOf('<img\r\n              src="images/c1.png"');
if (c1Idx !== -1) {
  let c1End = html.indexOf('/>', c1Idx) + 2;
  html = html.substring(0, c1Idx) + 
         '<div class="editable-wrapper" style="display: block; width: 100%; height: 100%;">\n              <img src="images/c1.png" alt="Cardio training class" data-editable-id="classes_cardio" style="width: 100%; height: 100%; object-fit: cover;" />\n              <button class="edit-image-btn" data-target="classes_cardio" style="display:none;">📷 Change Image</button>\n            </div>' + 
         html.substring(c1End);
}

// 4. Classes Strength
let s1Idx = html.indexOf('<img\r\n              src="images/s1.png"');
if (s1Idx !== -1) {
  let s1End = html.indexOf('/>', s1Idx) + 2;
  html = html.substring(0, s1Idx) + 
         '<div class="editable-wrapper" style="display: block; width: 100%; height: 100%;">\n              <img src="images/s1.png" alt="Strength training class" data-editable-id="classes_strength" style="width: 100%; height: 100%; object-fit: cover;" />\n              <button class="edit-image-btn" data-target="classes_strength" style="display:none;">📷 Change Image</button>\n            </div>' + 
         html.substring(s1End);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Restored edit image buttons for founders and classes via index manipulation.');
