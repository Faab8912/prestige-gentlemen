const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    index: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      "login",
      "logout",
      "register",
      "order_created",
      "order_updated",
      "product_viewed",
      "cart_updated",
      "profile_updated",
    ],
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

logSchema.index({ userId: 1, createdAt: -1 });
logSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model("Log", logSchema);
