const asyncHandler = require('express-async-handler');
const Food = require('../models/Food');
const Category = require('../models/Category');

// @desc    Get all foods with filters, search, pagination
// @route   GET /api/foods
// @access  Public
const getFoods = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    isVeg,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 12,
    featured,
  } = req.query;

  const query = { isAvailable: true };

  if (search) {
    query.$text = { $search: search };
  }
  if (category) query.category = category;
  if (isVeg !== undefined) query.isVeg = isVeg === 'true';
  if (featured === 'true') query.isFeatured = true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'rating') sortOption = { 'rating.average': -1 };
  if (sort === 'popular') sortOption = { 'rating.count': -1 };

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const [foods, total] = await Promise.all([
    Food.find(query)
      .populate('category', 'name icon')
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Food.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: foods.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: foods,
  });
});

// @desc    Get single food
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id).populate('category', 'name icon');
  if (!food) {
    res.status(404);
    throw new Error('Food item not found');
  }
  res.json({ success: true, data: food });
});

// @desc    Create food item
// @route   POST /api/foods
// @access  Private/Admin
const createFood = asyncHandler(async (req, res) => {
  const food = await Food.create(req.body);
  res.status(201).json({ success: true, data: food });
});

// @desc    Update food item
// @route   PUT /api/foods/:id
// @access  Private/Admin
const updateFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) {
    res.status(404);
    throw new Error('Food item not found');
  }
  Object.assign(food, req.body);
  const updated = await food.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete food item
// @route   DELETE /api/foods/:id
// @access  Private/Admin
const deleteFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) {
    res.status(404);
    throw new Error('Food item not found');
  }
  await food.deleteOne();
  res.json({ success: true, message: 'Food item removed' });
});

// @desc    Get all categories
// @route   GET /api/foods/categories/all
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('name');
  res.json({ success: true, data: categories });
});

// @desc    Create category
// @route   POST /api/foods/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

// @desc    Delete category
// @route   DELETE /api/foods/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  await category.deleteOne();
  res.json({ success: true, message: 'Category removed' });
});

module.exports = {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  getCategories,
  createCategory,
  deleteCategory,
};
