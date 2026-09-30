const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const Product = require('./models/Product');

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

const fixSlugs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const products = await Product.find({});
    console.log(`Total products: ${products.length}`);

    let updated = 0;

    for (const product of products) {
      const correctSlug = product.category
        .toLowerCase()
        .replace(/&/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\s+/g, '-');

      if (product.categorySlug !== correctSlug) {
        console.log(`Fixing: ${product.name}`);
        console.log(`  Old: ${product.categorySlug}`);
        console.log(`  New: ${correctSlug}`);

        product.categorySlug = correctSlug;
        await product.save();
        updated++;
      }
    }

    console.log(`\n✅ Fixed ${updated} products`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixSlugs();