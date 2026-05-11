const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');

require('dotenv').config();

const Product = require('../models/Product');
const Category = require('../models/Category');

const { generateEmbedding } = require('../services/clipService');

// CONNECT MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    importProducts();
  })
  .catch((err) => {
    console.error(err);
  });

const importProducts = async () => {
  try {

    const results = [];

    // CSV FILE PATH
    const csvPath = path.join(
      __dirname,
      '../daraz_products_fixed_vectors.csv'
    );

    fs.createReadStream(csvPath)
      .pipe(csv())

      .on('data', (data) => {
        results.push(data);
      })

      .on('end', async () => {

        console.log(`Found ${results.length} products`);

        // GET ANY CATEGORY FROM DATABASE
        const categoryDoc = await Category.findOne();

        if (!categoryDoc) {
          console.log('No category found in database');
          process.exit();
        }

        // TEST WITH FIRST 20 PRODUCTS
        for (const item of results.slice(6950, 7500)) {

          try {

            console.log(`Processing: ${item.title}`);

            // IMAGE URL FROM CSV
            const imageUrl = item.image;

            if (!imageUrl) {
              console.log('No image found');
              continue;
            }

            // GENERATE CLIP EMBEDDING
            const embedding =
              await generateEmbedding(imageUrl);

            // SAFE TITLE
            const safeTitle =
              (item.title || 'Untitled Product')
                .substring(0, 200);

            // CREATE PRODUCT
            await Product.create({

              // REAL SELLER ID
              vendor:
                '69f83957b0a9a951b00c429c',

              title:
                safeTitle,

              slug:
                safeTitle
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^\w\-]+/g, '')
                  + '-' + Date.now(),

              // FIX REQUIRED DESCRIPTION
              description:
                safeTitle ||
                'No description available',

              price:
                Number(item.price) || 0,

              category:
                categoryDoc._id,

              brand:
                item.brand || '',

              images: [
                {
                  url: imageUrl,
                  publicId: '',
                  isPrimary: true
                }
              ],

              // SAVE VECTOR
              embedding,

              stockQuantity: 100,

              specifications: {},

              tags: [],

              aiCategory: '',

              aiConfidence: 0,

              isApproved: true,

              isActive: true
            });

            console.log(
              `Imported: ${safeTitle}`
            );

          } catch (error) {

            console.error(
              `Failed: ${item.title}`,
              error.message
            );
          }
        }

        console.log('Import Completed');

        process.exit();
      });

  } catch (error) {

    console.error(error);

    process.exit();
  }
};