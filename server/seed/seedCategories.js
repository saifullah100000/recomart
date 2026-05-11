require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const Category = require('../models/Category');
const connectDB = require('../config/db');
const slugify = require('slugify');

const categoriesData = [
  {
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Headphones', 'Cameras', 'Smart Watches', 'Accessories']
  },
  {
    name: 'Clothing',
    description: 'Fashion and apparel',
    subcategories: ['Men', 'Women', 'Kids', 'Shoes', 'Bags']
  },
  {
    name: 'Home & Kitchen',
    description: 'Home furnishing and kitchen essentials',
    subcategories: ['Furniture', 'Kitchen Appliances', 'Bedding', 'Decor', 'Storage']
  },
  {
    name: 'Sports & Fitness',
    description: 'Sports equipment and fitness gear',
    subcategories: ['Exercise Equipment', 'Sportswear', 'Outdoor', 'Cycling']
  },
  {
    name: 'Beauty & Personal Care',
    description: 'Beauty products and personal care items',
    subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances']
  },
  {
    name: 'Books & Stationery',
    description: 'Books, stationery, and educational materials',
    subcategories: ['Fiction', 'Non-Fiction', 'Educational', 'Stationery']
  },
  {
    name: 'Toys & Games',
    description: 'Toys, games, and entertainment',
    subcategories: ['Action Figures', 'Board Games', 'Educational Toys', 'Outdoor Play']
  },
  {
    name: 'Automotive',
    description: 'Automotive parts and accessories',
    subcategories: ['Car Accessories', 'Motorcycle', 'Tools', 'Car Electronics']
  },
  {
    name: 'Food & Grocery',
    description: 'Food items and grocery essentials',
    subcategories: ['Snacks', 'Beverages', 'Cooking Essentials', 'Organic']
  },
  {
    name: 'Health & Wellness',
    description: 'Health supplements and wellness products',
    subcategories: ['Supplements', 'Medical Devices', 'Personal Care', 'Fitness Trackers']
  }
];

async function seedCategories() {
  try {
    await connectDB();

    const existingCount = await Category.countDocuments();
    if (existingCount > 0) {
      console.log(`Categories already seeded (${existingCount} found). Skipping.`);
      process.exit(0);
    }

    for (const cat of categoriesData) {
      const parent = await Category.create({
        name: cat.name,
        slug: slugify(cat.name, { lower: true, strict: true }),
        description: cat.description,
        isActive: true
      });

      for (const subName of cat.subcategories) {
        await Category.create({
          name: subName,
          slug: slugify(`${cat.name}-${subName}`, { lower: true, strict: true }),
          description: `${subName} under ${cat.name}`,
          parent: parent._id,
          isActive: true
        });
      }

      console.log(`Created: ${cat.name} with ${cat.subcategories.length} subcategories`);
    }

    const total = await Category.countDocuments();
    console.log(`\nSeeding complete! Total categories: ${total}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed categories error:', error.message);
    process.exit(1);
  }
}

seedCategories();
