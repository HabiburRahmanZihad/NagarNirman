// Image Upload Utility for ImgBB
import fetch from 'node-fetch';

/**
 * Upload image to ImgBB
 * @param {string} base64Image - Base64 encoded image string (with or without data:image prefix)
 * @param {string} imageName - Name for the image
 * @returns {Promise<Object>} - Object containing image URL and other details
 */
export const uploadToImgBB = async (base64Image, imageName = 'image') => {
  try {
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error('ImgBB API key is not configured');
    }

    // Remove data:image prefix if present
    let base64Data = base64Image;
    if (base64Image.includes('base64,')) {
      base64Data = base64Image.split('base64,')[1];
    }

    // Create form data
    const formData = new URLSearchParams();
    formData.append('key', apiKey);
    formData.append('image', base64Data);
    formData.append('name', imageName);

    // Upload to ImgBB
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to upload image to ImgBB');
    }

    // Return useful image data
    return {
      url: result.data.url,
      displayUrl: result.data.display_url,
      thumbUrl: result.data.thumb?.url,
      deleteUrl: result.data.delete_url,
      size: result.data.size,
      title: result.data.title,
    };
  } catch (error) {
    console.error('ImgBB upload error:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};




/**
 * Upload multiple images to ImgBB
 * @param {Array<string>} base64Images - Array of base64 encoded images
 * @param {string} prefix - Prefix for image names
 * @returns {Promise<Array<Object>>} - Array of uploaded image details
 */
export const uploadMultipleToImgBB = async (base64Images, prefix = 'image') => {
  try {
    const uploadPromises = base64Images.map((image, index) =>
      uploadToImgBB(image, `${prefix}_${index + 1}`)
    );

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw new Error(`Failed to upload images: ${error.message}`);
  }
};





/**
 * Validate image size and format
 * @param {string} base64Image - Base64 encoded image
 * @param {number} maxSizeMB - Maximum size in MB (default 5MB)
 * @returns {boolean}
 */
export const validateImage = (base64Image, maxSizeMB = 5) => {
  try {
    // Remove data:image prefix if present
    let base64Data = base64Image;
    if (base64Image.includes('base64,')) {
      base64Data = base64Image.split('base64,')[1];
    }

    // Calculate size in bytes
    const sizeInBytes = (base64Data.length * 3) / 4;
    const sizeInMB = sizeInBytes / (1024 * 1024);

    if (sizeInMB > maxSizeMB) {
      throw new Error(`Image size exceeds ${maxSizeMB}MB limit`);
    }

    // Check if it's a valid base64 image
    const validImagePrefixes = ['data:image/jpeg', 'data:image/jpg', 'data:image/png'];
    const hasValidPrefix = validImagePrefixes.some(prefix =>
      base64Image.startsWith(prefix)
    );

    if (base64Image.includes('data:') && !hasValidPrefix) {
      throw new Error('Invalid image format. Only JPEG, JPG, and PNG are allowed');
    }

    return true;
  } catch (error) {
    throw error;
  }
};
