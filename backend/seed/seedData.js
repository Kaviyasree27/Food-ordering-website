require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Food = require('../models/Food');

const categories = [
  { name: 'Pizza', icon: '🍕' },
  { name: 'Burgers', icon: '🍔' },
  { name: 'Indian', icon: '🍛' },
  { name: 'Chinese', icon: '🥡' },
  { name: 'Desserts', icon: '🍰' },
  { name: 'Beverages', icon: '🥤' },
  { name: 'Salads', icon: '🥗' },
];

const foodByCategory = {
  Pizza: [
    [
      'Margherita Pizza',
      'Classic pizza with fresh mozzarella, tomato sauce and basil',
      249,
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600',
    ],
    [
      'Pepperoni Pizza',
      'Loaded with pepperoni and a blend of mozzarella cheese',
      349,
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600',
    ],
    [
      'Farmhouse Pizza',
      'Onion, capsicum, tomato, and mushroom on a cheesy base',
      329,
      'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=600',
    ],
  ],

  Burgers: [
    [
      'Classic Cheeseburger',
      'Juicy beef patty with cheddar, lettuce and house sauce',
      179,
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
    ],
    [
      'Crispy Chicken Burger',
      'Crispy fried chicken fillet with mayo and pickles',
      199,
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600',
    ],
    [
      'Veg Deluxe Burger',
      'Grilled veggie patty with cheese and fresh veggies',
      149,
      'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600',
    ],
  ],

  Indian: [
    [
      'Butter Chicken',
      'Creamy tomato curry with tender chicken pieces',
      289,
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600',
    ],
    [
      'Paneer Tikka Masala',
      'Grilled paneer cubes in a rich spiced curry',
      259,
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600',
    ],
    [
      'Chicken Biryani',
      'Fragrant basmati rice layered with spiced chicken',
      299,
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600',
    ],
    [
      'Dal Makhani',
      'Slow-cooked black lentils in butter and cream',
      199,
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600',
    ],
  ],

  Chinese: [
    [
      'Veg Hakka Noodles',
      'Stir-fried noodles tossed with fresh vegetables',
      189,
      'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600',
    ],
    [
      'Chicken Manchurian',
      'Crispy chicken tossed in tangy Indo-Chinese sauce',
      229,
      'https://images.unsplash.com/photo-1626776877668-e5ab8ab7b8a3?w=600',
    ],
    [
      'Spring Rolls',
      'Crispy rolls stuffed with fresh vegetables',
      149,
      'https://images.unsplash.com/photo-1548811256-1627d99ce8fe?w=600',
    ],
  ],

  Desserts: [
    [
      'Chocolate Brownie',
      'Warm fudgy brownie served with chocolate drizzle',
      129,
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600',
    ],
    [
      'New York Cheesecake',
      'Creamy classic cheesecake with berry compote',
      179,
      'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=600',
    ],
    [
      'Gulab Jamun',
      'Soft milk dumplings soaked in rose flavored syrup',
      99,
      'https://images.unsplash.com/photo-1666190092208-13cb2591b850?w=600',
    ],
  ],

  Beverages: [
    [
      'Fresh Lime Soda',
      'Refreshing lime soda, sweet or salted',
      69,
      'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600',
    ],
    [
      'Mango Smoothie',
      'Thick and creamy smoothie made with fresh mango',
      119,
      'https://images.unsplash.com/photo-1546173159-315724a31696?w=600',
    ],
    [
      'Cold Coffee',
      'Chilled coffee blended with ice cream',
      129,
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600',
    ],
  ],

  Salads: [
    [
      'Caesar Salad',
      'Crisp romaine, parmesan, croutons and Caesar dressing',
      179,
      'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600',
    ],
    [
      'Greek Salad',
      'Cucumber, olives, feta and tomato with olive oil',
      169,
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600',
    ],
  ],
};

const vegKeywords = [
  'Veg',
  'Paneer',
  'Margherita',
  'Dal',
  'Lime',
  'Mango',
  'Cheesecake',
  'Brownie',
  'Gulab',
  'Greek',
  'Caesar',
  'Cold Coffee',
  'Spring',
];

const run = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');

    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Food.deleteMany({}),
    ]);

    // ==========================================
    // CREATE STATIC ADMIN
    // ==========================================

    console.log('Creating admin user...');

    await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@tastehub.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin',
      phone: '9999999999',
    });

    // ==========================================
    // CREATE CATEGORIES
    // ==========================================

    console.log('Creating categories...');

    const createdCategories = await Category.insertMany(categories);

    const categoryMap = {};

    createdCategories.forEach((category) => {
      categoryMap[category.name] = category._id;
    });

    // ==========================================
    // CREATE FOOD ITEMS
    // ==========================================

    console.log('Creating food items...');

    const foods = [];

    Object.entries(foodByCategory).forEach(
      ([categoryName, items]) => {
        items.forEach(
          ([name, description, price, image]) => {
            foods.push({
              name,
              description,
              price,
              image,
              category: categoryMap[categoryName],
              isVeg: vegKeywords.some((keyword) =>
                name.includes(keyword)
              ),
            });
          }
        );
      }
    );

    await Food.insertMany(foods);

    // ==========================================
    // SUCCESS
    // ==========================================

    console.log('');
    console.log('======================================');
    console.log('✅ Seed data created successfully!');
    console.log('======================================');

    console.log(
      `Admin login: ${process.env.ADMIN_EMAIL || 'admin@tastehub.com'} / ${
        process.env.ADMIN_PASSWORD || 'Admin@123'
      }`
    );

    console.log('');
    console.log('Customer accounts are NOT created by seed.');
    console.log('Customers must register through the website.');
    console.log('======================================');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

run();