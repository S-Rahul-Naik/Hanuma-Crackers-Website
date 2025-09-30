const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

// Load models
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('Data destroyed...');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@hanuma.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      phone: '+919876543210',
      address: {
        street: '123 Admin Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      role: 'admin'
    });

    // Create sample users
    const users = await User.create([
      {
  name: 'Rajesh Kumar',
  email: 'rajesh@email.com',
  password: 'password123',
  phone: '+919876543210',
  address: {
          street: '123 MG Road',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          country: 'India'
        },
        totalOrders: 12,
        totalSpent: 8450,
        lastOrderDate: new Date('2024-01-15')
      },
      {
  name: 'Priya Sharma',
  email: 'priya@email.com',
  password: 'password123',
  phone: '+918765432109',
  address: {
          street: '456 Park Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India'
        },
        totalOrders: 8,
        totalSpent: 5200,
        lastOrderDate: new Date('2024-01-14')
      },
      {
  name: 'Amit Patel',
  email: 'amit@email.com',
  password: 'password123',
  phone: '+917654321098',
  address: {
          street: '789 Gandhi Nagar',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380001',
          country: 'India'
        },
        totalOrders: 15,
        totalSpent: 12300,
        lastOrderDate: new Date('2024-01-13')
      }
    ]);

    console.log('Users created...');

    // Create sample products
    const products = await Product.create([
      {
        name: 'Premium Flower Pots',
        description: 'Beautiful flower pot crackers with vibrant colors and spectacular effects',
        category: 'Flower Pots',
        price: 150,
        discountPrice: 135,
        stock: 45,
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=colorful%20flower%20pot%20fireworks%20crackers%20with%20bright%20sparks%20and%20beautiful%20patterns%20against%20dark%20background%2C%20traditional%20indian%20festival%20celebration&width=300&height=300&seq=1&orientation=squarish',
            altText: 'Premium Flower Pots Crackers'
          }
        ],
        specifications: {
          weight: '50g',
          dimensions: '5cm x 3cm',
          duration: '30 seconds',
          effects: 'Colorful sparks and patterns',
          safetyRating: 5
        },
        isFeatured: true,
        tags: ['colorful', 'safe', 'premium'],
        averageRating: 4.5,
        numReviews: 23,
        totalSales: 245
      },
      {
        name: 'Sky Rockets',
        description: 'High-flying rockets with spectacular effects that light up the night sky',
        category: 'Rockets',
        price: 80,
        stock: 32,
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=rocket%20fireworks%20shooting%20into%20night%20sky%20with%20bright%20trails%20and%20colorful%20explosions%2C%20festival%20celebration%20crackers&width=300&height=300&seq=2&orientation=squarish',
            altText: 'Sky Rockets Fireworks'
          }
        ],
        specifications: {
          weight: '25g',
          dimensions: '15cm x 2cm',
          duration: '5 seconds',
          effects: 'High altitude burst with colors',
          safetyRating: 4
        },
        isFeatured: true,
        tags: ['high-flying', 'colorful', 'exciting'],
        averageRating: 4.2,
        numReviews: 18,
        totalSales: 189
      },
      {
        name: 'Ground Spinners',
        description: 'Spinning crackers with amazing ground effects and bright sparks',
        category: 'Ground Spinners',
        price: 60,
        stock: 28,
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=ground%20spinner%20fireworks%20rotating%20with%20bright%20sparks%20and%20colorful%20lights%20on%20ground%2C%20traditional%20festival%20crackers&width=300&height=300&seq=3&orientation=squarish',
            altText: 'Ground Spinners Crackers'
          }
        ],
        specifications: {
          weight: '30g',
          dimensions: '4cm x 4cm',
          duration: '20 seconds',
          effects: 'Spinning motion with sparks',
          safetyRating: 5
        },
        tags: ['spinning', 'ground-effect', 'safe'],
        averageRating: 4.0,
        numReviews: 15,
        totalSales: 167
      },
      {
        name: 'Premium Sparklers Pack',
        description: 'Long-lasting sparklers perfect for celebrations and photography',
        category: 'Sparklers',
        price: 120,
        discountPrice: 100,
        stock: 60,
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=beautiful%20premium%20sparklers%20crackers%20fireworks%20golden%20sparks%20festive%20celebration%20diwali%20traditional%20indian%20colorful%20bright%20lights&width=300&height=300&seq=4&orientation=squarish',
            altText: 'Premium Sparklers Pack'
          }
        ],
        specifications: {
          weight: '200g',
          dimensions: '30cm length',
          duration: '90 seconds each',
          effects: 'Golden sparks',
          safetyRating: 5
        },
        isFeatured: true,
        tags: ['long-lasting', 'golden', 'premium', 'safe'],
        averageRating: 4.7,
        numReviews: 45,
        totalSales: 320
      },
      {
        name: 'Chakra Wheels',
        description: 'Traditional spinning wheels with multi-colored effects',
        category: 'Chakras',
        price: 90,
        stock: 25,
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=chakra%20wheel%20fireworks%20spinning%20with%20multicolor%20effects%20traditional%20indian%20crackers%20festival%20celebration&width=300&height=300&seq=5&orientation=squarish',
            altText: 'Chakra Wheels Fireworks'
          }
        ],
        specifications: {
          weight: '40g',
          dimensions: '6cm diameter',
          duration: '25 seconds',
          effects: 'Multi-colored spinning wheel',
          safetyRating: 4
        },
        tags: ['traditional', 'spinning', 'colorful'],
        averageRating: 4.3,
        numReviews: 12,
        totalSales: 98
      },
      {
        name: 'Eco-Friendly Green Crackers',
        description: 'Environment-friendly crackers with reduced pollution',
        category: 'Eco-friendly',
        price: 200,
        discountPrice: 180,
        stock: 40,
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=eco%20friendly%20green%20crackers%20fireworks%20environmentally%20safe%20low%20smoke%20festival%20celebration&width=300&height=300&seq=6&orientation=squarish',
            altText: 'Eco-Friendly Green Crackers'
          }
        ],
        specifications: {
          weight: '100g',
          dimensions: 'Varies',
          duration: 'Mixed',
          effects: 'Low smoke, bright colors',
          safetyRating: 5
        },
        isFeatured: true,
        tags: ['eco-friendly', 'low-smoke', 'safe', 'green'],
        averageRating: 4.8,
        numReviews: 32,
        totalSales: 156
      }
    ]);

    console.log('Products created...');

    // Create sample orders
    const sampleOrders = [
      {
        orderNumber: 'ORD1001',
        user: users[0]._id,
        items: [
          {
            product: products[0]._id,
            name: products[0].name,
            price: products[0].effectivePrice,
            quantity: 2,
            image: products[0].images[0].url
          },
          {
            product: products[3]._id,
            name: products[3].name,
            price: products[3].effectivePrice,
            quantity: 1,
            image: products[3].images[0].url
          }
        ],
        shippingAddress: {
          name: users[0].name,
          phone: users[0].phone,
          street: users[0].address.street,
          city: users[0].address.city,
          state: users[0].address.state,
          pincode: users[0].address.pincode,
          country: users[0].address.country
        },
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'paid',
        itemsPrice: 370,
        taxPrice: 37,
        shippingPrice: 50,
        totalPrice: 457,
        status: 'delivered'
      },
      {
        orderNumber: 'ORD1002',
        user: users[1]._id,
        items: [
          {
            product: products[1]._id,
            name: products[1].name,
            price: products[1].price,
            quantity: 3,
            image: products[1].images[0].url
          }
        ],
        shippingAddress: {
          name: users[1].name,
          phone: users[1].phone,
          street: users[1].address.street,
          city: users[1].address.city,
          state: users[1].address.state,
          pincode: users[1].address.pincode,
          country: users[1].address.country
        },
        paymentMethod: 'upi',
        paymentStatus: 'paid',
        itemsPrice: 240,
        taxPrice: 24,
        shippingPrice: 50,
        totalPrice: 314,
        status: 'processing'
      }
    ];

    await Order.create(sampleOrders);
    console.log('Orders created...');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Admin Login:');
    console.log(`Email: ${process.env.ADMIN_EMAIL || 'admin@hanuma.com'}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();