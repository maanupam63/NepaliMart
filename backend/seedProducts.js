const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const Product = require('./models/Product');
const User = require('./models/User');

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

const products = [
  { name: 'Fresh Apple', description: 'Fresh red apples from Mustang. 1kg pack. Rich in fiber and vitamin C.', price: 350, discountPrice: 320, discountPercent: 9, category: 'Fruits & Vegetables', brand: 'Local', stock: 100, images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300'], rating: 4.5, numReviews: 120 },
  { name: 'Fresh Banana', description: 'Ripe bananas from Chitwan. 1 dozen. Rich in potassium.', price: 180, discountPrice: 160, discountPercent: 11, category: 'Fruits & Vegetables', brand: 'Local', stock: 80, images: ['https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300'], rating: 4.3, numReviews: 85 },
  { name: 'Tomato', description: 'Fresh tomatoes from Kavre. 1kg pack.', price: 120, discountPrice: 110, discountPercent: 8, category: 'Fruits & Vegetables', brand: 'Local', stock: 150, images: ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300'], rating: 4.4, numReviews: 200 },
  { name: 'Potato', description: 'Fresh potatoes from Okhaldhunga. 2kg pack.', price: 150, discountPrice: 140, discountPercent: 7, category: 'Fruits & Vegetables', brand: 'Local', stock: 200, images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300'], rating: 4.6, numReviews: 300 },
  { name: 'Amul Taaza Milk', description: 'Fresh toned milk 1L. Rich in calcium and protein.', price: 120, discountPrice: 110, discountPercent: 8, category: 'Dairy & Breakfast', brand: 'Amul', stock: 100, images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300'], rating: 4.7, numReviews: 200 },
  { name: 'Amul Butter', description: 'Creamy butter 500g. Perfect for toast.', price: 550, discountPrice: 520, discountPercent: 5, category: 'Dairy & Breakfast', brand: 'Amul', stock: 50, images: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300'], rating: 4.8, numReviews: 400 },
  { name: 'Brown Bread', description: 'Fresh brown bread 400g. Baked daily.', price: 80, discountPrice: 75, discountPercent: 6, category: 'Dairy & Breakfast', brand: 'Local Bakery', stock: 60, images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300'], rating: 4.5, numReviews: 150 },
  { name: 'Nestle Yogurt', description: 'Fresh yogurt 500g. Creamy and delicious.', price: 180, discountPrice: 165, discountPercent: 8, category: 'Dairy & Breakfast', brand: 'Nestle', stock: 70, images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300'], rating: 4.6, numReviews: 180 },
  { name: 'Mahak Honey', description: 'Natural Shilajit Infused Honey 250g.', price: 850, discountPrice: 720, discountPercent: 15, category: 'Snacks & Beverages', brand: 'Mahak', stock: 50, images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300'], rating: 4.5, numReviews: 120 },
  { name: 'Coca-Cola', description: 'Coca-Cola 2L bottle. Chilled.', price: 200, discountPrice: 180, discountPercent: 10, category: 'Snacks & Beverages', brand: 'Coca-Cola', stock: 200, images: ['https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300'], rating: 4.4, numReviews: 500 },
  { name: 'Lays Chips', description: 'Classic salted potato chips 100g.', price: 100, discountPrice: 90, discountPercent: 10, category: 'Snacks & Beverages', brand: 'Lays', stock: 300, images: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300'], rating: 4.6, numReviews: 800 },
  { name: 'Oreo Biscuits', description: 'Oreo chocolate biscuits 120g.', price: 80, discountPrice: 75, discountPercent: 6, category: 'Snacks & Beverages', brand: 'Oreo', stock: 250, images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300'], rating: 4.5, numReviews: 600 },
  { name: 'Basmati Rice', description: 'Premium Basmati Rice 5kg. Long grain.', price: 1200, discountPrice: 1100, discountPercent: 8, category: 'Rice & Grains', brand: 'India Gate', stock: 25, images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300'], rating: 4.4, numReviews: 150 },
  { name: 'Brown Rice', description: 'Organic brown rice 2kg. Rich in fiber.', price: 600, discountPrice: 550, discountPercent: 8, category: 'Rice & Grains', brand: 'Local', stock: 40, images: ['https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300'], rating: 4.3, numReviews: 100 },
  { name: 'Wheat Flour', description: 'Whole wheat flour 5kg. Freshly milled.', price: 450, discountPrice: 420, discountPercent: 7, category: 'Rice & Grains', brand: 'Local', stock: 80, images: ['https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=300'], rating: 4.5, numReviews: 200 },
  { name: 'Fortune Sunflower Oil', description: 'Refined Sunflower Oil 1L.', price: 250, discountPrice: 230, discountPercent: 8, category: 'Oil & Masala', brand: 'Fortune', stock: 60, images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300'], rating: 4.2, numReviews: 90 },
  { name: 'Mustard Oil', description: 'Pure mustard oil 1L. Traditional.', price: 300, discountPrice: 280, discountPercent: 7, category: 'Oil & Masala', brand: 'Local', stock: 50, images: ['https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=300'], rating: 4.6, numReviews: 150 },
  { name: 'Turmeric Powder', description: 'Organic turmeric powder 200g.', price: 150, discountPrice: 135, discountPercent: 10, category: 'Oil & Masala', brand: 'Local', stock: 100, images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300'], rating: 4.7, numReviews: 300 },
  { name: 'Surf Excel Detergent', description: 'Matic Liquid Detergent 1L.', price: 350, discountPrice: 320, discountPercent: 9, category: 'Cleaning & Household', brand: 'Surf Excel', stock: 45, images: ['https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300'], rating: 4.5, numReviews: 180 },
  { name: 'Vim Dishwash Liquid', description: 'Lemon dishwash liquid 500ml.', price: 180, discountPrice: 165, discountPercent: 8, category: 'Cleaning & Household', brand: 'Vim', stock: 80, images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?w=300'], rating: 4.4, numReviews: 200 },
  { name: 'Harpic Toilet Cleaner', description: 'Toilet cleaner 500ml.', price: 220, discountPrice: 200, discountPercent: 9, category: 'Cleaning & Household', brand: 'Harpic', stock: 60, images: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300'], rating: 4.6, numReviews: 250 },
  { name: 'Colgate Toothpaste', description: 'Strong Teeth Toothpaste 200g.', price: 180, discountPrice: 160, discountPercent: 11, category: 'Personal Care', brand: 'Colgate', stock: 80, images: ['https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300'], rating: 4.6, numReviews: 300 },
  { name: 'Dove Shampoo', description: 'Dove shampoo 340ml.', price: 450, discountPrice: 420, discountPercent: 7, category: 'Personal Care', brand: 'Dove', stock: 40, images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300'], rating: 4.7, numReviews: 400 },
  { name: 'Nivea Body Lotion', description: 'Nivea body lotion 400ml.', price: 550, discountPrice: 500, discountPercent: 9, category: 'Personal Care', brand: 'Nivea', stock: 30, images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300'], rating: 4.5, numReviews: 250 },
  { name: 'Pampers Diapers', description: 'Pampers diapers M size 30 pieces.', price: 1200, discountPrice: 1100, discountPercent: 8, category: 'Baby Care', brand: 'Pampers', stock: 50, images: ['https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300'], rating: 4.8, numReviews: 500 },
  { name: 'Johnson Baby Powder', description: 'Johnson baby powder 200g.', price: 350, discountPrice: 320, discountPercent: 9, category: 'Baby Care', brand: 'Johnson', stock: 60, images: ['https://images.unsplash.com/photo-1584838717626-2c1a07cb9d47?w=300'], rating: 4.7, numReviews: 300 },
  { name: 'Cerelac Baby Food', description: 'Nestle Cerelac baby food 300g.', price: 550, discountPrice: 520, discountPercent: 5, category: 'Baby Care', brand: 'Nestle', stock: 40, images: ['https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300'], rating: 4.6, numReviews: 200 },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('❌ No admin found. Register admin first.');
      process.exit(1);
    }

    console.log(`Using admin vendor: ${admin.email}\n`);

    let added = 0;
    let skipped = 0;

    for (const p of products) {
      const exists = await Product.findOne({ name: p.name });
      if (exists) {
        console.log(`⏭️  Skipped: ${p.name}`);
        skipped++;
        continue;
      }

      const categorySlug = p.category
        .toLowerCase()
        .replace(/&/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\s+/g, '-');

      await Product.create({
        ...p,
        categorySlug,
        vendor: admin._id,
        isApproved: true,
      });
      added++;
      console.log(`✅ Added: ${p.name}`);
    }

    console.log(`\n📊 Summary: ${added} added, ${skipped} skipped`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedProducts();