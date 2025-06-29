module.exports = async function resizeImage(payload) {
  const { image_url, size } = payload;

  console.log(`🖼 Resizing image: ${image_url} to ${size}`);
  await new Promise(res => setTimeout(res, 1500));

  if (Math.random() < 0.2) {
    throw new Error('Image resize failed');
  }

  console.log(`✅ Image resized successfully`);
};
