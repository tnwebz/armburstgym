const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The exact HTML block for the Founders carousel images
const oldFoundersImages = `<img
              src="images/img_2.png"
              alt="Mr. DINESH, Founder and Head Coach at ARMBURST GYM Gym Chengalpattu"
              class="founders-carousel-img"
              data-index="0"
            />
            <img
              src="images/p1.png"
              alt="Strategic Lead and Co-founder at ARMBURST GYM unisex gym Chengalpattu"
              class="founders-carousel-img"
              data-index="1"
            />`;
const newFoundersImages = `<div class="editable-wrapper" style="position: absolute; inset: 0;">
              <img src="images/img_2.png" alt="Mr. DINESH, Founder and Head Coach at ARMBURST GYM Gym Chengalpattu" class="founders-carousel-img" data-index="0" data-editable-id="founder_1" />
              <button class="edit-image-btn" data-target="founder_1" style="display:none;">📷 Change Image</button>
            </div>
            <div class="editable-wrapper" style="position: absolute; inset: 0;">
              <img src="images/p1.png" alt="Strategic Lead and Co-founder at ARMBURST GYM unisex gym Chengalpattu" class="founders-carousel-img" data-index="1" data-editable-id="founder_2" />
              <button class="edit-image-btn" data-target="founder_2" style="display:none;">📷 Change Image</button>
            </div>`;
html = html.replace(oldFoundersImages, newFoundersImages);

// The exact HTML block for the Classes Cardio image
const oldCardioImage = `<div class="classes-img-wrap">
            <img
              src="images/c1.png"
              alt="Cardio training class at ARMBURST GYM gym near Thimmavaram Chengalpattu"
            />
          </div>`;
const newCardioImage = `<div class="classes-img-wrap">
            <div class="editable-wrapper" style="display: block; width: 100%; height: 100%;">
              <img src="images/c1.png" alt="Cardio training class at ARMBURST GYM gym near Thimmavaram Chengalpattu" data-editable-id="classes_cardio" style="width: 100%; height: 100%; object-fit: cover;" />
              <button class="edit-image-btn" data-target="classes_cardio" style="display:none;">📷 Change Image</button>
            </div>
          </div>`;
html = html.replace(oldCardioImage, newCardioImage);

// The exact HTML block for the Classes Strength image
const oldStrengthImage = `<div class="classes-img-wrap">
            <img
              src="images/s1.png"
              alt="Strength and weight training session at ARMBURST GYM gym Chengalpattu"
            />
          </div>`;
const newStrengthImage = `<div class="classes-img-wrap">
            <div class="editable-wrapper" style="display: block; width: 100%; height: 100%;">
              <img src="images/s1.png" alt="Strength and weight training session at ARMBURST GYM gym Chengalpattu" data-editable-id="classes_strength" style="width: 100%; height: 100%; object-fit: cover;" />
              <button class="edit-image-btn" data-target="classes_strength" style="display:none;">📷 Change Image</button>
            </div>
          </div>`;
html = html.replace(oldStrengthImage, newStrengthImage);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Restored edit image buttons for founders and classes via exact string replacement.');
