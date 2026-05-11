const cloudinary = require('../config/cloudinary');

class CloudinaryService {
  async uploadImage(fileBuffer, folder = 'recomart') {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 1000, height: 1000, crop: 'limit', quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  async uploadMultipleImages(files, folder = 'recomart') {
    const uploadPromises = files.map(file => this.uploadImage(file.buffer, folder));
    return Promise.all(uploadPromises);
  }

  async deleteImage(publicId) {
    return cloudinary.uploader.destroy(publicId);
  }

  async deleteMultipleImages(publicIds) {
    const deletePromises = publicIds.map(id => this.deleteImage(id));
    return Promise.all(deletePromises);
  }
}

module.exports = new CloudinaryService();
