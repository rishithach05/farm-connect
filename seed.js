/**
 * MongoDB seed script for Farm-Connect-Share
 * Run: node seed.js
 * Requires MONGODB_URI in .env
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Fix for Node.js querySrv ECONNREFUSED error
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in .env');
  process.exit(1);
}

// ─── Schemas ────────────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema(
  { name: String, email: { type: String, unique: true }, password: String, role: { type: String, default: 'CUSTOMER' }, phone: String, location: String },
  { timestamps: true }
);
const ProductSchema = new mongoose.Schema(
  { name: String, description: String, price: Number, unit: { type: String, default: 'kg' }, quantity: Number, category: String, deliveryOption: { type: String, default: 'BOTH' }, image: String, farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } },
  { timestamps: true }
);
const ReviewSchema = new mongoose.Schema(
  { userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, rating: Number, comment: String },
  { timestamps: true }
);

const User    = mongoose.models.User    || mongoose.model('User',    UserSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Review  = mongoose.models.Review  || mongoose.model('Review',  ReviewSchema);

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('🔗 Connected to MongoDB');
  console.log('🌱 Seeding database...');

  // Clear all collections
  await Promise.all([
    mongoose.connection.db.collection('reviews').deleteMany({}),
    mongoose.connection.db.collection('wishlists').deleteMany({}),
    mongoose.connection.db.collection('orders').deleteMany({}),
    mongoose.connection.db.collection('products').deleteMany({}),
    mongoose.connection.db.collection('users').deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // Create Farmers
  const [f1, f2, f3, f4] = await User.insertMany([
    { name: 'Ramesh Singh',  email: 'ramesh@farm.com',  password: 'password123', role: 'FARMER', location: 'Manchar Village, Pune District' },
    { name: 'Suresh Patil',  email: 'suresh@farm.com',  password: 'password123', role: 'FARMER', location: 'Saswad Village, Maharashtra' },
    { name: 'Anil Kumar',    email: 'anil@farm.com',    password: 'password123', role: 'FARMER', location: 'Khed Shivapur, Pune' },
    { name: 'Rajesh Sharma', email: 'rajesh@farm.com',  password: 'password123', role: 'FARMER', location: 'Shirur Village, Maharashtra' },
  ]);
  console.log('👨‍🌾 Created 4 farmers');

  // Products data
  const allProducts = [
    // Vegetables
    { name: 'Organic Red Tomatoes',  description: 'Freshly picked, juicy red tomatoes.',           price: 40,  unit: 'kg',     quantity: 50,  category: 'vegetables', farmerId: f1._id, image: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=600&q=80' },
    { name: 'Fresh Potatoes',         description: 'Classic starchy potatoes straight from the soil.', price: 25,  unit: 'kg',     quantity: 100, category: 'vegetables', farmerId: f2._id, image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=600&q=80' },
    { name: 'Crunchy Carrots',        description: 'Orange, sweet, and crunchy farm carrots.',      price: 30,  unit: 'kg',     quantity: 80,  category: 'vegetables', farmerId: f3._id, image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=600&q=80' },
    { name: 'Red Onions',             description: 'Sharp and pungent fresh red onions.',           price: 35,  unit: 'kg',     quantity: 150, category: 'vegetables', farmerId: f4._id, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80' },
    { name: 'Green Cabbage',          description: 'Crisp green cabbage grown organically.',        price: 20,  unit: 'piece',  quantity: 40,  category: 'vegetables', farmerId: f1._id, image: '/images/cabbage.png' },
    // Fruits
    { name: 'Alphonso Mangoes',       description: 'King of mangoes from local orchards.',          price: 400, unit: 'dozen',  quantity: 30,  category: 'fruits',     farmerId: f2._id, image: '/images/mango.jpg' },
    { name: 'Red Apples',             description: 'Sweet and crisp red apples.',                   price: 150, unit: 'kg',     quantity: 60,  category: 'fruits',     farmerId: f3._id, image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&q=80' },
    { name: 'Fresh Bananas',          description: 'Robusta bananas naturally ripened.',            price: 60,  unit: 'dozen',  quantity: 120, category: 'fruits',     farmerId: f4._id, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80' },
    { name: 'Juicy Oranges',          description: 'Citrus-packed fresh oranges.',                 price: 80,  unit: 'kg',     quantity: 90,  category: 'fruits',     farmerId: f1._id, image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=600&q=80' },
    { name: 'Watermelon',             description: 'Large sweet watermelon for summer.',            price: 100, unit: 'piece',  quantity: 20,  category: 'fruits',     farmerId: f2._id, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80' },
    // Grains
    { name: 'Basmati Rice',           description: 'Aromatic long-grain basmati rice.',             price: 120, unit: 'kg',     quantity: 200, category: 'grains',     farmerId: f3._id, image: '/images/rice.png' },
    { name: 'Whole Wheat',            description: 'High-quality whole wheat grains.',              price: 45,  unit: 'kg',     quantity: 500, category: 'grains',     farmerId: f4._id, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80' },
    { name: 'Farm Corn',              description: 'Dried corn kernels perfect for flour.',         price: 30,  unit: 'kg',     quantity: 150, category: 'grains',     farmerId: f1._id, image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80' },
    { name: 'Toor Dal (Pigeon Pea)',  description: 'Unpolished protein-rich toor dal.',             price: 110, unit: 'kg',     quantity: 100, category: 'grains',     farmerId: f2._id, image: '/images/toordal.jpg' },
    { name: 'Millet (Bajra)',         description: 'Healthy and organic pearl millet.',             price: 50,  unit: 'kg',     quantity: 80,  category: 'grains',     farmerId: f3._id, image: '/images/millet_new.png' },
    // Dairy
    { name: 'Buffalo Milk',           description: 'High-fat pure buffalo milk.',                   price: 80,  unit: 'liter',  quantity: 40,  category: 'dairy',      farmerId: f1._id, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80' },
    { name: 'Desi Cow Ghee',          description: 'Traditional bilona ghee made from curd.',      price: 900, unit: 'kg',     quantity: 15,  category: 'dairy',      farmerId: f2._id, image: '/images/ghee.png' },
    { name: 'Farm Fresh Paneer',      description: 'Soft paneer made directly at the dairy farm.', price: 350, unit: 'kg',     quantity: 20,  category: 'dairy',      farmerId: f3._id, image: '/images/paneer.jpg' },
    { name: 'Homemade Curd',          description: 'Thick creamy curd in earthen pots.',           price: 60,  unit: 'kg',     quantity: 30,  category: 'dairy',      farmerId: f4._id, image: '/images/curd.jpg' },
  ];

  const createdProducts = await Product.insertMany(allProducts);
  console.log(`🌾 Created ${createdProducts.length} products`);

  // Customer + reviews
  const customer = await User.create({
    name: 'Priya Sharma', email: 'priya@test.com', password: 'pass', role: 'CUSTOMER', location: 'Pune City'
  });

  const reviews = createdProducts.map(p => ({
    userId:    customer._id,
    productId: p._id,
    rating:    5,
    comment:   'Excellent fresh quality highly recommended!',
  }));
  await Review.insertMany(reviews);
  console.log(`⭐ Created ${reviews.length} 5-star reviews`);

  console.log('\n✅ Success! 4 Farmers, 19 Products, and 1 Customer seeded!');
  console.log('\n📋 Test credentials:');
  console.log('   Farmer  → ramesh@farm.com  / password123');
  console.log('   Customer→ priya@test.com   / pass');
}

main()
  .catch(e => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(() => mongoose.disconnect());
