const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = require('../models/User');
const Category = require('../models/Category');
const Food = require('../models/Food');

dotenv.config();

const categories = [
  {
    name: 'Pizza',
    description: 'Freshly baked pizzas with delicious toppings',
  },
  {
    name: 'Burgers',
    description: 'Juicy burgers made fresh to order',
  },
  {
    name: 'Indian',
    description: 'Authentic and flavorful Indian dishes',
  },
  {
    name: 'Chinese',
    description: 'Popular Chinese favorites prepared fresh',
  },
  {
    name: 'Desserts',
    description: 'Sweet treats to finish your meal',
  },
  {
    name: 'Beverages',
    description: 'Refreshing drinks and cool beverages',
  },
  {
    name: 'Salads',
    description: 'Fresh and healthy salads',
  },
];

const foodByCategory = {
  Pizza: [
    [
      'Margherita Pizza',
      'Classic pizza with tomato sauce, mozzarella and fresh basil.',
      249,
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'Farmhouse Pizza',
      'Loaded pizza with fresh vegetables, mushrooms and mozzarella.',
      329,
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'Pepperoni Pizza',
      'Cheesy pizza topped with spicy pepperoni and herbs.',
      379,
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
      false,
    ],
    [
      'Veggie Supreme Pizza',
      'A colorful pizza loaded with peppers, onions, olives and mushrooms.',
      349,
      'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'BBQ Chicken Pizza',
      'Smoky BBQ chicken, onions and mozzarella on a crispy crust.',
      399,
      'https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?auto=format&fit=crop&w=800&q=80',
      false,
    ],
    [
      'Four Cheese Pizza',
      'Rich and creamy pizza made with four different cheeses.',
      389,
      'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'Mushroom Pizza',
      'Creamy mushroom and mozzarella pizza with Italian herbs.',
      299,
      'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'Chicken Tikka Pizza',
      'Indian-style pizza topped with chicken tikka and onions.',
      389,
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
      false,
    ],
  ],

  Burgers: [
    [
      'Classic Chicken Burger',
      'Crispy chicken patty with lettuce, tomato and creamy sauce.',
      229,
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      false,
    ],
    [
      'Cheese Burger',
      'Juicy burger with melted cheese, lettuce and fresh vegetables.',
      249,
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
      false,
    ],
    [
      'Double Beef Burger',
      'Two juicy beef patties layered with cheese and fresh toppings.',
      399,
      'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80',
      false,
    ],
    [
      'Crispy Chicken Burger',
      'Golden crispy chicken fillet with lettuce and special sauce.',
      269,
      'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80',
      false,
    ],
    [
      'BBQ Chicken Burger',
      'Grilled chicken burger with smoky BBQ sauce and cheese.',
      289,
      'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
      false,
    ],
    [
      'Mushroom Swiss Burger',
      'Juicy burger topped with mushrooms and melted Swiss cheese.',
      319,
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
      false,
    ],
    [
      'Veggie Burger',
      'Crispy vegetable patty with lettuce, tomato and creamy dressing.',
      219,
      'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80',
      true,
    ],
  ],

  Indian: [
    [
      'Butter Chicken',
      'Tender chicken cooked in a rich, creamy tomato and butter gravy.',
      349,
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
      false,
    ],
    [
      'Tandoori Chicken',
      'Juicy chicken marinated with Indian spices and roasted to perfection.',
      329,
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
      false,
    ],
    [
      'Paneer Tikka',
      'Grilled paneer cubes marinated with yogurt, peppers and spices.',
      279,
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'Jeera Rice',
      'Fragrant basmati rice flavored with roasted cumin seeds.',
      149,
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
      true,
    ],
  ],

  Chinese: [
    [
      'Chicken Fried Rice',
      'Wok-fried rice with chicken, vegetables, egg and aromatic sauces.',
      219,
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
      false,
    ],
    [
      'Chicken Dumplings',
      'Steamed dumplings filled with seasoned chicken and vegetables.',
      249,
      'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
      false,
    ],
    [
      'Veg Fried Rice',
      'Flavorful fried rice with fresh vegetables and Chinese sauces.',
      189,
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'Chicken Noodles',
      'Stir-fried noodles with tender chicken and fresh vegetables.',
      239,
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
      false,
    ],
  ],

  Desserts: [
    [
      'Chocolate Brownie',
      'Warm chocolate brownie with a rich fudgy center.',
      149,
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'Cheesecake',
      'Creamy classic cheesecake with a buttery biscuit base.',
      199,
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'Chocolate Cake',
      'Moist chocolate cake covered with smooth chocolate frosting.',
      179,
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'Tiramisu',
      'Classic Italian dessert with coffee-soaked layers and mascarpone.',
      229,
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'Pancakes',
      'Fluffy pancakes served with syrup and fresh fruit.',
      189,
      'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'Waffles',
      'Crispy golden waffles served with syrup and fresh berries.',
      199,
      'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'Ice Cream Sundae',
      'Creamy vanilla ice cream topped with chocolate sauce and nuts.',
      169,
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'Fruit Tart',
      'Buttery pastry filled with cream and topped with fresh fruits.',
      199,
      'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80',
      true,
    ],
  ],

  Beverages: [
    [
      'Iced Coffee',
      'Cold creamy coffee served over ice.',
      129,
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'Fresh Orange Juice',
      'Refreshing juice made from freshly squeezed oranges.',
      119,
      'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'Mango Smoothie',
      'Thick and refreshing smoothie made with ripe mangoes.',
      159,
      'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'Lemon Mojito',
      'Refreshing lemon and mint drink served chilled.',
      139,
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'Strawberry Smoothie',
      'Fresh strawberry smoothie blended until perfectly creamy.',
      169,
      'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'Masala Chai',
      'Traditional Indian tea brewed with aromatic spices.',
      99,
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
      true,
    ],
  ],

  Salads: [
    [
      'Pasta Salad',
      'Cold pasta tossed with fresh vegetables and a creamy dressing.',
      219,
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80',
      true,
    ],
    [
      'Caesar Salad',
      'Crisp lettuce, parmesan, croutons and creamy Caesar dressing.',
      209,
      'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80',
      true,
    ],
  ],
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected');

    // Delete all food and categories.
    // Only admin users are deleted.
    // Existing customer accounts are preserved.
    await Promise.all([
      Category.deleteMany({}),
      Food.deleteMany({}),
      User.deleteMany({ role: 'admin' }),
    ]);

    // Create admin account
    const admin = await User.create({
      name: 'TasteHub Admin',
      email: process.env.ADMIN_EMAIL || 'admin@tastehub.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin',
      phone: '',
    });

    console.log(`Admin created: ${admin.email}`);

    // Create categories
    const createdCategories = await Category.insertMany(categories);

    const categoryMap = {};

    createdCategories.forEach((category) => {
      categoryMap[category.name] = category._id;
    });

    // Create food documents
    const foods = [];

    Object.entries(foodByCategory).forEach(([categoryName, items]) => {
      items.forEach(([name, description, price, image, isVeg]) => {
        foods.push({
          name,
          description,
          price,
          image,
          isVeg,
          category: categoryMap[categoryName],
          prepTime: Math.floor(Math.random() * 16) + 15,
          isAvailable: true,
          rating: {
            average: Number((4 + Math.random() * 0.9).toFixed(1)),
            count: Math.floor(Math.random() * 150) + 20,
          },
        });
      });
    });

    const createdFoods = await Food.insertMany(foods);

    console.log('');
    console.log('====================================');
    console.log('       SEED DATA CREATED');
    console.log('====================================');
    console.log(`🍽️ Total food items: ${createdFoods.length}`);
    console.log(`📂 Total categories: ${createdCategories.length}`);
    console.log('');
    console.log(
      `🔐 Admin login: ${
        process.env.ADMIN_EMAIL || 'admin@tastehub.com'
      } / ${process.env.ADMIN_PASSWORD || 'Admin@123'}`
    );
    console.log('');
    console.log('✅ Existing customer accounts were preserved.');
    console.log('✅ Customers can continue using their existing accounts.');
    console.log('====================================');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();