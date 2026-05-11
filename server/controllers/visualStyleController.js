const Product =
  require('../models/Product');

const {
  generateEmbedding
} = require(
  '../services/clipService'
);

const visualRoomRecommendation =
  async (
    req,
    res,
    next
  ) => {

    try {

      if (!req.file) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              'Image is required'
          });
      }

      console.log(
        '\n========== VISUAL STYLE =========='
      );

      console.log(
        'Generating embedding...'
      );

      const embedding =
        await generateEmbedding(

          req.file.path
        );

      console.log(
        'Embedding generated'
      );

      // ✅ FAST VECTOR SEARCH
      const products =
        await Product.aggregate([

          {
            $vectorSearch: {

              index:
                'vector_index',

              path:
                'embedding',

              queryVector:
                embedding,

              numCandidates:
                150,

              limit:
                20
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

              from:
                'categories',

              localField:
                'category',

              foreignField:
                '_id',

              as:
                'category'
            }
          },

          {
            $unwind: {

              path:
                '$category',

              preserveNullAndEmptyArrays:
                true
            }
          },

          {
            $project: {

              title: 1,

              slug: 1,

              price: 1,

              images: 1,

              category: {

                name:
                  '$category.name',

                slug:
                  '$category.slug'
              },

              similarity: {

                $meta:
                  'vectorSearchScore'
              }
            }
          }
        ]);

      console.log(
        `Found ${products.length} matching products`
      );

      console.log(
        'Visual style completed'
      );

      console.log(
        '=================================\n'
      );

      return res.json({

        success: true,

        products
      });

    } catch (error) {

      console.log(error);

      next(error);
    }
  };

module.exports = {
  visualRoomRecommendation
};