const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Food = require('../models/Food');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalOrders, totalUsers, totalFoods, orders] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Food.countDocuments(),
    Order.find({ status: { $ne: 'cancelled' } }),
  ]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  const statusCounts = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const pendingOrders = await Order.countDocuments({
    status: { $in: ['pending', 'confirmed', 'preparing', 'out_for_delivery'] },
  });

  // Sales over last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const salesTrend = await Order.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const topFoods = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.food',
        name: { $first: '$items.name' },
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  res.json({
    success: true,
    data: {
      totalOrders,
      totalUsers,
      totalFoods,
      totalRevenue,
      pendingOrders,
      statusCounts,
      salesTrend,
      topFoods,
    },
  });
});

// @desc    Get all customers (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'customer' }).sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users });
});

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
// @access  Private/Admin
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, data: user });
});

module.exports = { getDashboardStats, getAllUsers, toggleUserStatus };
