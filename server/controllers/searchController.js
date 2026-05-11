const Product = require('../models/Product');
const Category = require('../models/Category');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

const {
  generateEmbedding
} = require('../services/clipService');

const cosineSimilarity = require(
  '../utils/cosineSimilarity'
);

const search = async (req, res, next) => {
  try {

    const {
      q,
      page = 1,
      limit = 12
    } = req.query;

    const pageNum =
      Math.max(1, parseInt(page));

    const limitNum =
      Math.max(
        1,
        Math.min(50, parseInt(limit))
      );

    const skip =
      (pageNum - 1) * limitNum;

    const filter = {};

    if (q) {

      const searchWords =
        q.trim().split(/\s+/);

      filter.$and =
        searchWords.map(word => ({

          $or: [

            {
              title: {
                $regex: word,
                $options: 'i'
              }
            },

            {
              description: {
                $regex: word,
                $options: 'i'
              }
            }

          ]
        }));

    } else {

      throw ApiError.badRequest(
        'Search query is required'
      );
    }

    const [products, total] =
      await Promise.all([

        Product.find(filter)

          .sort({
            createdAt: -1
          })

          .skip(skip)

          .limit(limitNum)

          .populate(
            'category',
            'name slug'
          ),

        Product.countDocuments(filter)
      ]);

    const totalPages =
      Math.ceil(total / limitNum);

    return ApiResponse.success(

      res,

      {
        products,

        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,

          hasNextPage:
            pageNum < totalPages,

          hasPrevPage:
            pageNum > 1
        }

      },

      'Search results retrieved successfully'
    );

  } catch (error) {

    next(error);
  }
};

const imageSearch = async (
  req,
  res,
  next
) => {

  try {

    // CHECK IMAGE
    if (!req.file) {

      throw ApiError.badRequest(
        'Image file is required'
      );
    }

    console.log(
      '\n========== IMAGE SEARCH =========='
    );

    // GENERATE SEARCH EMBEDDING
    console.log(
      'Generating search embedding...'
    );

    const searchEmbedding =
      await generateEmbedding(
        req.file.path
      );

    console.log(
      'Search embedding generated'
    );

    // ✅ FAST VECTOR SEARCH
    const topProducts =
      await Product.aggregate([

        {
          $vectorSearch: {

            index: 'vector_index',

            path: 'embedding',

            queryVector:
              searchEmbedding,

            numCandidates: 100,

            limit: 20
          }
        },

        {
          $match: {

            isApproved: true,

            isActive: true
          }
        },

        {
          $lookup: {

            from: 'categories',

            localField: 'category',

            foreignField: '_id',

            as: 'category'
          }
        },

        {
          $unwind: {
            path: '$category',
            preserveNullAndEmptyArrays: true
          }
        },
{
  $project: {

    title: 1,
    slug: 1,
    price: 1,
    images: 1,
    brand: 1,
    rating: 1,

    category: {
      name: '$category.name',
      slug: '$category.slug'
    },

    similarity: {
      $meta:
        'vectorSearchScore'
    }
  }
}
      ]);

    console.log(
      `Found ${topProducts.length} similar products`
    );

    console.log(
      'Image search completed'
    );

    console.log(
      '=================================\n'
    );

    return ApiResponse.success(

      res,

      {
        products: topProducts
      },

      'Image search results retrieved successfully'
    );

  } catch (error) {

    next(error);
  }
};

const getSuggestions = async (
  req,
  res,
  next
) => {

  try {

    const { q } = req.query;

    if (
      !q ||
      q.trim().length === 0
    ) {

      return ApiResponse.success(

        res,

        {
          suggestions: []
        },

        'Suggestions retrieved successfully'
      );
    }

    const products =
      await Product.find({

        title: {
          $regex: q,
          $options: 'i'
        }

      })

        .select('title slug')

        .limit(10);

    const suggestions =
      products.map((product) => ({

        title: product.title,

        slug: product.slug
      }));

    return ApiResponse.success(

      res,

      {
        suggestions
      },

      'Suggestions retrieved successfully'
    );

  } catch (error) {

    next(error);
  }
};

module.exports = {
  search,
  imageSearch,
  getSuggestions
};