const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
    index: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

reviewSchema.index({ productId: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
