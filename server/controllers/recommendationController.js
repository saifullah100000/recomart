const ApiResponse = require('../utils/apiResponse');
const recommendationService = require('../services/recommendationService');

const getForYou = async (req, res, next) => {
  try {
    const products = await recommendationService.getForYou(req.user._id);

    return ApiResponse.success(res, { products }, 'Recommendations retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getSimilar = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const products = await recommendationService.getSimilar(productId);

    return ApiResponse.success(res, { products }, 'Similar products retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getTrending = async (req, res, next) => {
  try {
    const products = await recommendationService.getTrending();

    return ApiResponse.success(res, { products }, 'Trending products retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getForYou,
  getSimilar,
  getTrending
};
