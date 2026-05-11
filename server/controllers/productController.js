const Product = require('../models/Product');
const Category = require('../models/Category');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const slugify = require('slugify');

const { generateEmbedding } = require('../services/clipService');

const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort,
      minPrice,
      maxPrice,
      category,
      brand,
      rating,
      search
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {
      isApproved: true,
      isActive: true
    };

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = parseFloat(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = parseFloat(maxPrice);
      }
    }

    if (category) {
      const categoryDoc = await Category.findOne({
        slug: category
      });

      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }

    if (brand) {
      filter.brand = {
        $regex: brand,
        $options: 'i'
      };
    }

    if (rating) {
      filter.rating = {
        $gte: parseFloat(rating)
      };
    }

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          brand: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          description: {
            $regex: search,
            $options: 'i'
          }
        }
      ];
    }

    let sortOption = {
      createdAt: -1
    };

    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;

      case 'price_desc':
        sortOption = { price: -1 };
        break;

      case 'rating':
        sortOption = { rating: -1 };
        break;

      case 'newest':
        sortOption = { createdAt: -1 };
        break;
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .populate('category', 'name slug'),

      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return ApiResponse.success(
      res,
      {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      },
      'Products retrieved successfully'
    );

  } catch (error) {
    next(error);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug })
      .populate('category')
      .populate('vendor', 'fullName avatar businessName');

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    return ApiResponse.success(
      res,
      { product },
      'Product retrieved successfully'
    );

  } catch (error) {
    next(error);
  }
};

const getProductsByCategory = async (req, res, next) => {
  try {
    const { categorySlug } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const category = await Category.findOne({
      slug: categorySlug
    });

    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    const filter = {
      category: category._id,
      isApproved: true,
      isActive: true
    };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('category', 'name slug'),

      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return ApiResponse.success(
      res,
      {
        category,
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      },
      'Products retrieved successfully'
    );

  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      compareAtPrice,
      category,
      brand,
      images,
      stockQuantity,
      specifications,
      tags
    } = req.body;

    if (!title || !description || price === undefined || !category) {
      throw ApiError.badRequest(
        'Title, description, price, and category are required'
      );
    }

    const categoryDoc = await Category.findById(category);

    if (!categoryDoc) {
      throw ApiError.notFound('Category not found');
    }

    const slug = slugify(title, {
      lower: true,
      strict: true
    });

    const existingProduct = await Product.findOne({ slug });

    let finalSlug = slug;

    if (existingProduct) {
      finalSlug = `${slug}-${Date.now()}`;
    }

    // GENERATE CLIP EMBEDDING
    let embedding = [];

    try {
      if (
        Array.isArray(images) &&
        images.length > 0 &&
        images[0]?.url
      ) {
        const imageUrl = images[0].url;

        embedding = await generateEmbedding(imageUrl);

        console.log('CLIP embedding generated successfully');
      }
    } catch (embeddingError) {
      console.error(
        'Embedding generation failed:',
        embeddingError.message
      );
    }

    const product = await Product.create({
      vendor: req.user._id,

      title,

      slug: finalSlug,

      description,

      price,

      compareAtPrice: compareAtPrice || null,

      category,

      brand: brand || '',

      images: images || [],

      // VECTOR STORED HERE
      embedding,

      stockQuantity: stockQuantity || 0,

      specifications: specifications || {},

      tags: tags || [],

      aiCategory: '',

      aiConfidence: 0,

      isApproved: false
    });

    return ApiResponse.created(
      res,
      { product },
      'Product created successfully. Awaiting admin approval.'
    );

  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    if (
      product.vendor.toString() !==
      req.user._id.toString()
    ) {
      throw ApiError.forbidden(
        'You are not authorized to update this product'
      );
    }

    const allowedFields = [
      'title',
      'description',
      'price',
      'compareAtPrice',
      'category',
      'brand',
      'images',
      'stockQuantity',
      'specifications',
      'tags',
      'isActive'
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.title && updates.title !== product.title) {
      const slug = slugify(updates.title, {
        lower: true,
        strict: true
      });

      const existingProduct = await Product.findOne({
        slug,
        _id: {
          $ne: id
        }
      });

      updates.slug = existingProduct
        ? `${slug}-${Date.now()}`
        : slug;
    }

    if (updates.category) {
      const categoryDoc = await Category.findById(
        updates.category
      );

      if (!categoryDoc) {
        throw ApiError.notFound('Category not found');
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    return ApiResponse.success(
      res,
      { product: updatedProduct },
      'Product updated successfully'
    );

  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    if (
      product.vendor.toString() !==
      req.user._id.toString()
    ) {
      throw ApiError.forbidden(
        'You are not authorized to delete this product'
      );
    }

    await Product.findByIdAndDelete(id);

    return ApiResponse.success(
      res,
      {},
      'Product deleted successfully'
    );

  } catch (error) {
    next(error);
  }
};
const getSellerProducts = async (req, res, next) => {
  try {

    const {
      page = 1,
      limit = 12,
      search,
      status
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

    /* ── FILTER ── */
    const filter = {
      vendor: req.user._id
    };

    /* ── SEARCH FILTER ── */
    if (search) {

      filter.$or = [

        {
          title: {
            $regex: search,
            $options: 'i'
          }
        },

        {
          brand: {
            $regex: search,
            $options: 'i'
          }
        },

        {
          description: {
            $regex: search,
            $options: 'i'
          }
        }
      ];
    }

    /* ── STATUS FILTER ── */
    if (status) {

      if (status === 'approved') {
        filter.isApproved = true;
      }

      else if (status === 'pending') {
        filter.isApproved = false;
      }

      else if (status === 'rejected') {
        filter.rejectionReason = {
          $exists: true,
          $ne: ''
        };
      }
    }

    /* ── FETCH PRODUCTS ── */
    const [products, total] =
      await Promise.all([

        Product.find(filter)
          .sort({ createdAt: -1 })
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

      'Seller products retrieved successfully'
    );

  } catch (error) {

    next(error);
  }
};
module.exports = {
  getProducts,
  getProductBySlug,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts
};