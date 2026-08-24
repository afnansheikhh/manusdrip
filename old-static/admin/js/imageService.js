/**
 * ManusDrip Admin - Image Service (Phase 3 Cloud Connected)
 * Reads image files, previews locally, and uploads directly to Google Drive
 */

const ImageService = {
  /**
   * Process multiple file inputs to data URLs (strings)
   * @param {FileList|Array<File>} files 
   * @returns {Promise<Array<string>>}
   */
  async processFiles(files) {
    const promises = Array.from(files).map(file => {
      return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
          return resolve(null);
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              const maxSize = 800;

              if (width > height) {
                if (width > maxSize) {
                  height = Math.round((height * maxSize) / width);
                  width = maxSize;
                }
              } else {
                if (height > maxSize) {
                  width = Math.round((width * maxSize) / height);
                  height = maxSize;
                }
              }

              canvas.width = width;
              canvas.height = height;

              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);

              // Compress to JPEG with quality 0.7 (reducing file size from Megabytes to under 60KB)
              const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
              resolve(dataUrl);
            } catch (err) {
              console.warn('Canvas resizing failed, using raw base64:', err);
              resolve(e.target.result);
            }
          };
          img.onerror = () => {
            resolve(e.target.result);
          };
          img.src = e.target.result;
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    });

    const results = await Promise.all(promises);
    return results.filter(Boolean);
  },

  /**
   * Upload image directly to Google Drive for a product
   * @param {string} productId 
   * @param {string} filename 
   * @param {string} base64 
   * @returns {Promise<string>} Direct image URL
   */
  async uploadToDrive(productId, filename, base64) {
    if (window.AdminAPI && AdminAPI.isConfigured()) {
      try {
        const res = await AdminAPI.uploadImage(productId, filename, base64);
        if (res.success && res.url) {
          return res.url;
        }
      } catch (err) {
        console.warn('Google Drive image upload failed, saving as data URL:', err);
      }
    }
    // Fallback: return base64 data URL
    return base64;
  },

  isValidImage(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return validTypes.includes(file.type);
  },

  /**
   * Normalize an image source (handle string, object with url/base64, or fallback)
   */
  normalizeImageSrc(img) {
    if (!img) return 'images/logo/logo.png';
    if (typeof img === 'string') {
      if (img === '[object Object]' || img.trim() === '') return 'images/logo/logo.png';
      return img.trim();
    }
    if (typeof img === 'object') {
      return img.url || img.base64 || img.src || 'images/logo/logo.png';
    }
    return 'images/logo/logo.png';
  }
};

window.ImageService = ImageService;
