const Category = require('../models/Category');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const slugify = require('slugify');

const getCategories = async (req, res, next) => {
  try {
    // ✅ GET ACTIVE CATEGORIES
    const categories = await Category.find({ isActive: true }).lean();

    // ✅ GET PRODUCT COUNTS
    const productCounts = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // ✅ CREATE COUNT MAP
    const countMap = {};

    productCounts.forEach((item) => {
      countMap[item._id?.toString()] = item.count;
    });

    const categoryMap = {};
    const roots = [];

    // ✅ ADD CHILDREN + PRODUCT COUNT
    for (const cat of categories) {
      cat.children = [];

      // ✅ THIS FIXES "0 PRODUCTS"
      cat.productCount = countMap[cat._id.toString()] || 0;

      categoryMap[cat._id.toString()] = cat;
    }

    // ✅ BUILD TREE
    for (const cat of categories) {
      if (cat.parent) {
        const parentId = cat.parent.toString();

        if (categoryMap[parentId]) {
          categoryMap[parentId].children.push(cat);
        }
      } else {
        roots.push(cat);
      }
    }

    return ApiResponse.success(
      res,
      { categories: roots },
      'Categories retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug }).populate('parent', 'name slug');

    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    return ApiResponse.success(res, { category }, 'Category retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, parent } = req.body;

    if (!name) {
      throw ApiError.badRequest('Category name is required');
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      throw ApiError.conflict('A category with this name already exists');
    }

    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        throw ApiError.notFound('Parent category not found');
      }
    }

    const slug = slugify(name, { lower: true, strict: true });

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || '',
      parent: parent || null
    });

    return ApiResponse.created(res, { category }, 'Category created successfully');
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    const allowedFields = ['name', 'description', 'image', 'parent', 'isActive'];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.name && updates.name !== category.name) {
      const existingCategory = await Category.findOne({ name: updates.name, _id: { $ne: id } });
      if (existingCategory) {
        throw ApiError.conflict('A category with this name already exists');
      }
      updates.slug = slugify(updates.name, { lower: true, strict: true });
    }

    if (updates.parent) {
      if (updates.parent.toString() === id) {
        throw ApiError.badRequest('A category cannot be its own parent');
      }
      const parentCategory = await Category.findById(updates.parent);
      if (!parentCategory) {
        throw ApiError.notFound('Parent category not found');
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    return ApiResponse.success(res, { category: updatedCategory }, 'Category updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      throw ApiError.badRequest(
        `Cannot delete category. ${productCount} product(s) are assigned to this category. Reassign or remove them first.`
      );
    }

    const childCount = await Category.countDocuments({ parent: id });
    if (childCount > 0) {
      throw ApiError.badRequest(
        `Cannot delete category. ${childCount} subcategory(ies) exist under this category. Remove them first.`
      );
    }

    await Category.findByIdAndDelete(id);

    return ApiResponse.success(res, {}, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
};
