// Import the function correctly
const imageSize = require('image-size');
const fs = require('fs');
const path = require('path');

const blogDir = 'public/blog';

try {
  const files = fs.readdirSync(blogDir);
  const imageFiles = files.filter(file => /\.(jpg|png|webp)$/i.test(file));
  
  console.log(`Found ${imageFiles.length} image files`);
  
  imageFiles.forEach(file => {
    try {
      const filePath = path.join(blogDir, file);
      const dimensions = imageSize(filePath);
      console.log(`${file}: ${dimensions.width}x${dimensions.height} (${dimensions.type})`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  });
} catch (err) {
  console.error('Error reading directory:', err.message);
}
