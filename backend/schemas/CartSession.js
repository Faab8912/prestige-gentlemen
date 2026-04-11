const mongoose = require("mongoose");

const cartSessionSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    index: true,
  },
  items: [
    {
      productId: {
        type: Number,
        required: true,
      },
      variantId: {
        type: Number,
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      unitPrice: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: ["active", "abandoned", "converted"],
    default: "active",
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

cartSessionSchema.index({ userId: 1, status: 1 });
cartSessionSchema.index({ lastModified: -1 });

module.exports = mongoose.model("CartSession", cartSessionSchema);
