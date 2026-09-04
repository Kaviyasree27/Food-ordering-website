const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Food = require('../models/Food');

const DELIVERY_FEE = 40;
const TAX_RATE = 0.05;

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { items, deliveryAddress, paymentMethod, notes } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }
  if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city) {
    res.status(400);
    throw new Error('Delivery address is required');
  }

  // Validate food items and compute price server-side (never trust client price)
  const orderItems = [];
  let itemsPrice = 0;

  for (const item of items) {
    const food = await Food.findById(item.food);
    if (!food || !food.isAvailable) {
      res.status(400);
      throw new Error(`Food item unavailable: ${item.name || item.food}`);
    }
    const unitPrice = food.discountPrice > 0 ? food.discountPrice : food.price;
    orderItems.push({
      food: food._id,
      name: food.name,
      image: food.image,
      price: unitPrice,
      quantity: item.quantity,
    });
    itemsPrice += unitPrice * item.quantity;
  }

  const taxPrice = Math.round(itemsPrice * TAX_RATE * 100) / 100;
  const deliveryFee = itemsPrice > 500 ? 0 : DELIVERY_FEE;
  const totalPrice = Math.round((itemsPrice + taxPrice + deliveryFee) * 100) / 100;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    deliveryAddress,
    itemsPrice,
    taxPrice,
    deliveryFee,
    totalPrice,
    paymentMethod: paymentMethod || 'cod',
    notes,
    estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000),
  });

  res.status(201).json({ success: true, data: order });
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, data: orders });
});

// @desc    Get single order (owner or admin)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, data: order });
});

// @desc    Cancel order (customer, only if pending/confirmed)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  if (!['pending', 'confirmed'].includes(order.status)) {
    res.status(400);
    throw new Error('Order can no longer be cancelled');
  }

  order.status = 'cancelled';
  order.cancelReason = req.body.reason || 'Cancelled by customer';
  order.statusHistory.push({ status: 'cancelled' });
  await order.save();

  res.json({ success: true, data: order });
});

// ---------- ADMIN ----------

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Order.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: orders.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: orders,
  });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  order.statusHistory.push({ status });
  if (status === 'delivered') {
    order.deliveredAt = new Date();
    order.isPaid = true;
    order.paidAt = order.paidAt || new Date();
  }

  const updated = await order.save();
  res.json({ success: true, data: updated });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};
