import mongoose from "mongoose";
import Product from "./models/Product.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const products = [
  {
    name: "Wireless Headphones",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life."
  },
  {
    name: "Smart Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    description: "Feature-packed smartwatch with fitness tracking, heart rate monitor, and GPS."
  },
  {
    name: "Laptop Backpack",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    description: "Durable laptop backpack with multiple compartments and USB charging port."
  },
  {
    name: "Portable Speaker",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    description: "Waterproof Bluetooth speaker with 360-degree sound and 12-hour playtime."
  },
  {
    name: "Digital Camera",
    price: 449.99,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop",
    description: "Professional mirrorless camera with 4K video recording and WiFi connectivity."
  },
  {
    name: "Fitness Tracker",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop",
    description: "Advanced fitness tracker with sleep monitoring, heart rate tracking, and waterproof design."
  },
  {
    name: "Sunglasses",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    description: "Premium polarized sunglasses with UV protection and stylish design."
  },
  {
    name: "Running Shoes",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    description: "Comfortable running shoes with responsive cushioning and breathable mesh upper."
  },
  {
    name: "Coffee Maker",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop",
    description: "Programmable coffee maker with thermal carafe and auto-brew feature."
  },
  {
    name: "Yoga Mat",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop",
    description: "Non-slip yoga mat with extra cushioning and carrying strap included."
  },
  {
    name: "Desk Lamp",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop",
    description: "LED desk lamp with adjustable brightness and color temperature settings."
  },
  {
    name: "Water Bottle",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
    description: "Insulated stainless steel water bottle that keeps drinks cold for 24 hours."
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Seed products
    await Product.insertMany(products);
    console.log("Seeded database with products");

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: "admin@example.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin"
      });
      console.log("Created admin user (email: admin@example.com, password: admin123)");
    } else {
      console.log("Admin user already exists");
    }

    // Create regular user if doesn't exist
    const userExists = await User.findOne({ email: "user@example.com" });
    if (!userExists) {
      const hashedPassword = await bcrypt.hash("user123", 10);
      await User.create({
        name: "Test User",
        email: "user@example.com",
        password: hashedPassword,
        role: "user"
      });
      console.log("Created test user (email: user@example.com, password: user123)");
    } else {
      console.log("Test user already exists");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
