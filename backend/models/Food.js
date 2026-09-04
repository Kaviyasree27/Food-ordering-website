const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
      maxlength: 80,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 500,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      required: true,
      default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [{ type: String, trim: true }],
    rating: {
      average: { type: Number, default: 4.2, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    prepTime: {
      type: Number, // minutes
      default: 20,
    },
    calories: {
      type: Number,
      default: 0,
    },
    spiceLevel: {
      type: String,
      enum: ['mild', 'medium', 'hot', 'none'],
      default: 'none',
    },
    stockQuantity: {
      type: Number,
      default: 999,
    },
  },
  { timestamps: true }
);

foodSchema.index({ name: 'text', description: 'text', tags: 'text' });

foodSchema.virtual('finalPrice').get(function () {
  return this.discountPrice > 0 ? this.discountPrice : this.price;
});

foodSchema.set('toJSON', { virtuals: true });
foodSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Food', foodSchema);
