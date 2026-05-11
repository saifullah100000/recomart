const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const cloudinaryService = require('../services/cloudinaryService');

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw ApiError.badRequest('No image file provided');
    }

    const result = await cloudinaryService.uploadImage(req.file.buffer);

    return ApiResponse.success(res, {
      url: result.url,
      publicId: result.publicId
    }, 'Image uploaded successfully');
  } catch (error) {
    next(error);
  }
};

const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw ApiError.badRequest('No image files provided');
    }

    if (req.files.length > 5) {
      throw ApiError.badRequest('Maximum 5 images allowed per upload');
    }

    const results = await cloudinaryService.uploadMultipleImages(req.files);

    return ApiResponse.success(res, {
      images: results.map(r => ({ url: r.url, publicId: r.publicId }))
    }, 'Images uploaded successfully');
  } catch (error) {
    next(error);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const publicId = req.params[0] || req.params.publicId;

    if (!publicId) {
      throw ApiError.badRequest('Public ID is required');
    }

    await cloudinaryService.deleteImage(publicId);

    return ApiResponse.success(res, {}, 'Image deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
  uploadImages,
  deleteImage
};
