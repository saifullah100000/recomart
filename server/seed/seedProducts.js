require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const VendorProfile = require('../models/VendorProfile');
const Product = require('../models/Product');
const Category = require('../models/Category');
const connectDB = require('../config/db');
const slugify = require('slugify');

const sampleProducts = [
  { title: 'iPhone 15 Pro Max 256GB', description: 'Latest Apple iPhone with A17 Pro chip, titanium design, 48MP camera system, and USB-C connectivity. Natural Titanium color.', price: 499999, category: 'Electronics', brand: 'Apple', stock: 25 },
  { title: 'Samsung Galaxy S24 Ultra', description: 'Samsung flagship with Snapdragon 8 Gen 3, 200MP camera, S Pen, and titanium frame. Phantom Black.', price: 399999, category: 'Electronics', brand: 'Samsung', stock: 30 },
  { title: 'MacBook Air M3 15-inch', description: 'Apple MacBook Air with M3 chip, 15.3-inch Liquid Retina display, 18-hour battery life. Space Gray.', price: 449999, category: 'Electronics', brand: 'Apple', stock: 15 },
  { title: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise canceling wireless headphones with exceptional sound quality and 30-hour battery life.', price: 84999, category: 'Electronics', brand: 'Sony', stock: 50 },
  { title: 'Canon EOS R6 Mark II Camera', description: 'Full-frame mirrorless camera with 24.2MP sensor, 4K 60p video, advanced subject detection AF. Body only.', price: 549999, category: 'Electronics', brand: 'Canon', stock: 10 },
  { title: 'Men Premium Cotton Polo Shirt', description: 'Classic fit polo shirt made from 100% premium cotton. Breathable fabric with ribbed collar. Available in multiple colors.', price: 2499, category: 'Clothing', brand: 'RecoMart Basics', stock: 200 },
  { title: 'Women Embroidered Lawn Suit 3-Piece', description: 'Elegant embroidered lawn suit with printed chiffon dupatta and dyed trouser. Summer collection.', price: 5999, category: 'Clothing', brand: 'Khaadi', stock: 75 },
  { title: 'Running Shoes Air Zoom Pegasus 41', description: 'Nike Air Zoom Pegasus 41 running shoes with React foam cushioning and breathable mesh upper. Perfect for daily runs.', price: 24999, category: 'Clothing', brand: 'Nike', stock: 60 },
  { title: 'Leather Crossbody Bag', description: 'Genuine leather crossbody bag with adjustable strap, multiple compartments, and premium stitching.', price: 7999, category: 'Clothing', brand: 'RecoMart Premium', stock: 45 },
  { title: 'Kids Cartoon Print T-Shirt Set', description: 'Pack of 3 cartoon print t-shirts for kids. Made from soft, skin-friendly cotton. Ages 3-10 years.', price: 1999, category: 'Clothing', brand: 'RecoMart Kids', stock: 150 },
  { title: 'Ergonomic Office Chair Pro', description: 'High-back ergonomic office chair with lumbar support, adjustable headrest, armrests, and breathable mesh back.', price: 34999, category: 'Home & Kitchen', brand: 'ComfortPro', stock: 20 },
  { title: 'Automatic Espresso Coffee Machine', description: 'Fully automatic espresso machine with built-in grinder, milk frother, and 15-bar pump pressure. Makes cappuccino, latte, and more.', price: 89999, category: 'Home & Kitchen', brand: 'DeLonghi', stock: 12 },
  { title: 'King Size Cotton Bedsheet Set', description: 'Premium 400 thread count Egyptian cotton bedsheet set. Includes 1 fitted sheet, 1 flat sheet, and 2 pillowcases.', price: 6999, category: 'Home & Kitchen', brand: 'SleepWell', stock: 80 },
  { title: 'Adjustable Dumbbell Set 24kg', description: 'Adjustable dumbbell set from 2.5kg to 24kg. Quick-change weight system. Perfect for home gym workouts.', price: 29999, category: 'Sports & Fitness', brand: 'FitGear', stock: 35 },
  { title: 'Yoga Mat Premium 6mm', description: 'Non-slip premium yoga mat with alignment lines. 6mm thick, eco-friendly TPE material. Includes carry strap.', price: 3499, category: 'Sports & Fitness', brand: 'YogaLife', stock: 100 },
  { title: 'Mountain Bike 21-Speed', description: '21-speed mountain bike with aluminum frame, dual disc brakes, front suspension fork, and 26-inch wheels.', price: 44999, category: 'Sports & Fitness', brand: 'TrailMaster', stock: 15 },
  { title: 'Vitamin C Serum 30ml', description: 'Advanced vitamin C serum with hyaluronic acid and vitamin E. Brightens skin, reduces dark spots, and boosts collagen.', price: 1999, category: 'Beauty & Personal Care', brand: 'GlowUp', stock: 200 },
  { title: 'Complete Makeup Brush Set 15-Piece', description: 'Professional 15-piece makeup brush set with synthetic bristles. Includes eye, face, and lip brushes with PU leather case.', price: 3999, category: 'Beauty & Personal Care', brand: 'BeautyPro', stock: 90 },
  { title: 'Atomic Habits by James Clear', description: 'International bestseller on building good habits and breaking bad ones. Practical strategies for habit formation.', price: 1499, category: 'Books & Stationery', brand: 'Penguin', stock: 300 },
  { title: 'Premium Notebook Set of 3', description: 'Set of 3 premium A5 notebooks with dotted, lined, and blank pages. 120gsm paper, lay-flat binding, ribbon bookmark.', price: 1299, category: 'Books & Stationery', brand: 'Papyrus', stock: 150 },
  { title: 'LEGO Technic Lamborghini', description: 'LEGO Technic Lamborghini Sian FKP 37 building set. 3696 pieces for ages 18+. Detailed replica with opening doors and engine.', price: 74999, category: 'Toys & Games', brand: 'LEGO', stock: 8 },
  { title: 'Board Game Catan', description: 'Award-winning strategy board game for 3-4 players. Trade, build, and settle the island of Catan. Ages 10+.', price: 4999, category: 'Toys & Games', brand: 'Catan Studio', stock: 40 },
  { title: 'Car Dash Camera 4K', description: 'Front and rear 4K dash camera with night vision, GPS tracking, parking mode, and 3-inch IPS display. Loop recording.', price: 12999, category: 'Automotive', brand: 'VanTrue', stock: 55 },
  { title: 'Car Seat Covers Universal Fit', description: 'Premium PU leather car seat covers. Universal fit for most 5-seat cars. Waterproof, easy to install. Set of 5.', price: 8999, category: 'Automotive', brand: 'AutoLux', stock: 70 },
  { title: 'Organic Green Tea 100 Bags', description: '100% organic green tea bags. Rich in antioxidants. No artificial flavors or preservatives. Pack of 100.', price: 999, category: 'Food & Grocery', brand: 'TeaNest', stock: 250 },
  { title: 'Premium Dry Fruit Mix 1kg', description: 'Assorted premium dry fruits including almonds, cashews, walnuts, pistachios, and raisins. 1kg gift pack.', price: 3499, category: 'Food & Grocery', brand: 'NutriBox', stock: 100 },
  { title: 'Whey Protein Isolate 2lb', description: '100% whey protein isolate with 25g protein per serving. Low carb, gluten-free. Chocolate flavor. 30 servings.', price: 7999, category: 'Health & Wellness', brand: 'MuscleTech', stock: 85 },
  { title: 'Digital Blood Pressure Monitor', description: 'Automatic upper arm blood pressure monitor with large LCD display, memory for 2 users, and irregular heartbeat detection.', price: 4999, category: 'Health & Wellness', brand: 'Omron', stock: 60 },
  { title: 'Apple Watch Series 9', description: 'Apple Watch Series 9 with S9 SiP chip, double tap gesture, bright always-on display, and blood oxygen sensor. 45mm Midnight.', price: 129999, category: 'Electronics', brand: 'Apple', stock: 20 },
  { title: 'Wireless Gaming Mouse RGB', description: 'Ultra-lightweight wireless gaming mouse with 25K DPI sensor, RGB lighting, 70-hour battery, and programmable buttons.', price: 14999, category: 'Electronics', brand: 'Logitech', stock: 75 }
];

async function seedProducts() {
  try {
    await connectDB();

    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log(`Products already seeded (${existingProducts} found). Skipping.`);
      process.exit(0);
    }

    let seller = await User.findOne({ role: 'seller' });
    if (!seller) {
      const passwordHash = await bcrypt.hash('Seller@123456', 12);
      seller = await User.create({
        fullName: 'Demo Seller',
        email: 'seller@recomart.com',
        passwordHash,
        role: 'seller',
        isActive: true,
        isEmailVerified: true
      });
      await VendorProfile.create({
        user: seller._id,
        businessName: 'RecoMart Official Store',
        shopDescription: 'Official demo store for RecoMart platform',
        status: 'approved'
      });
      console.log('Demo seller created: seller@recomart.com / Seller@123456');
    }

    const categories = await Category.find({ parent: null });
    const categoryMap = {};
    for (const cat of categories) {
      categoryMap[cat.name] = cat._id;
    }

    let created = 0;
    for (const prod of sampleProducts) {
      const categoryId = categoryMap[prod.category];
      if (!categoryId) {
        console.log(`Category not found: ${prod.category}, skipping ${prod.title}`);
        continue;
      }

      const slug = slugify(prod.title, { lower: true, strict: true }) + '-' + Date.now().toString(36);

      await Product.create({
        vendor: seller._id,
        title: prod.title,
        slug,
        description: prod.description,
        price: prod.price,
        category: categoryId,
        brand: prod.brand,
        images: [{
          url: `https://placehold.co/600x600/2563EB/FFFFFF?text=${encodeURIComponent(prod.title.slice(0, 20))}`,
          publicId: '',
          isPrimary: true
        }],
        stockQuantity: prod.stock,
        tags: prod.title.toLowerCase().split(' ').filter(w => w.length > 2),
        isApproved: true,
        isActive: true,
        rating: (3.5 + Math.random() * 1.5).toFixed(1),
        reviewCount: Math.floor(Math.random() * 50) + 5
      });
      created++;
    }

    console.log(`\nSeeded ${created} products successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('Seed products error:', error.message);
    process.exit(1);
  }
}

seedProducts();
