const cloudinary = require('cloudinary').v2;

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: 'mk5zjnak',
  api_key: '634238361547686',
  api_secret: '-Nftg8-hyuUnHFhsAL9Gg4ft4uQ'
});

async function run() {
  try {
    // 2. Upload an image
    console.log('Uploading image...');
    const uploadResult = await cloudinary.uploader.upload('https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', {
      public_id: 'sample_upload'
    });
    
    console.log('--- Upload Successful ---');
    console.log('Secure URL:', uploadResult.secure_url);
    console.log('Public ID:', uploadResult.public_id);
    
    // 3. Get image details
    console.log('\n--- Image Metadata ---');
    console.log('Width:', uploadResult.width);
    console.log('Height:', uploadResult.height);
    console.log('Format:', uploadResult.format);
    console.log('File size (bytes):', uploadResult.bytes);
    
    // 4. Transform the image
    // f_auto: Automatically converts the image to the most efficient format (e.g., WebP/AVIF) for the requesting browser.
    // q_auto: Automatically adjusts compression to minimize file size without visible degradation.
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto'
    });
    
    console.log('\n--- Transformation ---');
    console.log('Done! Click link below to see optimized version of the image. Check the size and the format.');
    console.log(transformedUrl);
    
  } catch (error) {
    console.error('Error during Cloudinary integration:', error);
  }
}

run();
