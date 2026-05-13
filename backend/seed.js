require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const products = [
  { name: 'NextGen Pro Headphones', description: 'Immersive noise-cancelling audio with 40hr battery life and premium drivers.', price: 299.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', stock: 50, rating: 4.8, reviews: 312 },
  { name: 'Minimalist Mechanical Keyboard', description: 'Tactile switches, aluminium frame, RGB backlighting with hot-swap support.', price: 189.00, category: 'Electronics', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', stock: 35, rating: 4.7, reviews: 201 },
  { name: 'Ergonomic Office Chair', description: 'Lumbar support, adjustable armrests, breathable mesh — designed for long sessions.', price: 549.00, category: 'Furniture', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400', stock: 20, rating: 4.6, reviews: 89 },
  { name: 'Ultra-wide Monitor 34"', description: 'WQHD curved IPS panel, 144Hz, 1ms response — the creator\'s display.', price: 749.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', stock: 15, rating: 4.9, reviews: 445 },
  { name: 'Smart Water Bottle', description: 'Tracks hydration, glows to remind you to drink, 24hr temperature control.', price: 59.99, category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', stock: 100, rating: 4.3, reviews: 567 },
  { name: 'Premium Leather Backpack', description: 'Full-grain leather, laptop compartment, TSA-friendly — built to last decades.', price: 219.00, category: 'Accessories', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', stock: 40, rating: 4.5, reviews: 134 },
  { name: 'Wireless Charging Pad', description: '15W fast wireless charging, works with all Qi devices, slim profile.', price: 39.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400', stock: 200, rating: 4.2, reviews: 890 },
  { name: 'Stainless Steel Desk Lamp', description: 'Touch-dimming, 3 colour temperatures, USB-C charging port built in.', price: 89.00, category: 'Furniture', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', stock: 60, rating: 4.4, reviews: 203 },
  { name: 'Running Sneakers X9', description: 'Carbon-infused plate, energy-return foam, ultralight mesh upper.', price: 165.00, category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', stock: 80, rating: 4.7, reviews: 677 },
  { name: 'Portable SSD 2TB', description: 'USB-C, 1050MB/s read speeds, drop-proof up to 2m, tiny form factor.', price: 139.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', stock: 75, rating: 4.8, reviews: 321 },
  { name: 'Bamboo Standing Desk', description: 'Electric height adjustment, memory presets, solid bamboo surface 160x80cm.', price: 689.00, category: 'Furniture', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400', stock: 10, rating: 4.6, reviews: 55 },
  { name: 'Sunglasses Titanium Frame', description: 'Polarised UV400 lenses, featherlight titanium, handmade in Italy.', price: 285.00, category: 'Accessories', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', stock: 30, rating: 4.5, reviews: 112 },
];

const statuses = ['pending', 'processing', 'shipped', 'delivered'];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing
  await Promise.all([User.deleteMany(), Product.deleteMany(), Order.deleteMany()]);

  // Create admin
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@nextgen.com',
    password: 'admin123',
    role: 'admin'
  });
  console.log('Admin created: admin@nextgen.com / admin123');

  // Create sample users
  const users = [];
  const names = ['Alice Johnson', 'Bob Smith', 'Carol White', 'David Lee', 'Emma Brown', 'Frank Davis', 'Grace Kim', 'Henry Wilson'];
  for (const name of names) {
    const u = await User.create({
      name,
      email: name.toLowerCase().replace(' ', '.') + '@example.com',
      password: 'password123',
      role: 'user'
    });
    users.push(u);
  }

  // Create products
  const createdProducts = await Product.insertMany(products);
  console.log(`${createdProducts.length} products created`);

  // Create orders (spread over last 6 months)
  const orders = [];
  for (let i = 0; i < 40; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
    const qty = Math.ceil(Math.random() * 3);
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    orders.push({
      customerName: user.name,
      email: user.email,
      products: [{ product: product._id, name: product.name, quantity: qty, price: product.price }],
      total: +(product.price * qty).toFixed(2),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: date
    });
  }
  await Order.insertMany(orders);
  console.log(`${orders.length} orders created`);

  console.log('Seeding complete!');
  await mongoose.disconnect();
}

seed().catch(console.error);
