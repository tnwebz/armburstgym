const fs = require('fs');

function addLazyLoading(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Add loading="lazy" to all img tags that don't already have it
    // But skip logo images (e.g. ones with class "logo-img") if possible, though lazy loading logo isn't terrible if we are aggressive.
    // Let's just be careful and replace <img (unless it already has loading=)
    html = html.replace(/<img(?![^>]*loading=)[^>]*>/gi, (match) => {
        // If it's a logo or hero image, we might want to skip, but let's just add it to all images except maybe the logo
        if (match.includes('logo-img')) {
            return match; // Skip logo for immediate load
        }
        return match.replace('<img', '<img loading="lazy"');
    });

    // Add preload="none" to video tags
    html = html.replace(/<video(?![^>]*preload=)[^>]*>/gi, (match) => {
        return match.replace('<video', '<video preload="none"');
    });

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Lazy loading applied to ${filePath}`);
}

addLazyLoading('index.html');
addLazyLoading('gallery.html');
