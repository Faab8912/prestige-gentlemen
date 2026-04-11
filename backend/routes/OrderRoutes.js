const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/", authMiddleware, OrderController.createOrder);
router.get("/my-orders", authMiddleware, OrderController.getUserOrders);
router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  OrderController.getOrderStats
);
router.get("/:id", authMiddleware, OrderController.getOrderById);

router.get("/", authMiddleware, adminMiddleware, OrderController.getAllOrders);
router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  OrderController.updateOrderStatus
);

module.exports = router;
