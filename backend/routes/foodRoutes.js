const express = require('express');
const router = express.Router();
const {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  getCategories,
  createCategory,
  deleteCategory,
} = require('../controllers/foodController');
const { protect, admin } = require('../middleware/auth');

router.get('/categories/all', getCategories);
router.post('/categories', protect, admin, createCategory);
router.delete('/categories/:id', protect, admin, deleteCategory);

router.get('/', getFoods);
router.get('/:id', getFoodById);
router.post('/', protect, admin, createFood);
router.put('/:id', protect, admin, updateFood);
router.delete('/:id', protect, admin, deleteFood);

module.exports = router;
