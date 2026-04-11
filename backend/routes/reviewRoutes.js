const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/ReviewController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/", authMiddleware, ReviewController.createReview);
router.get("/product/:productId", ReviewController.getProductReviews);
router.delete("/:id", authMiddleware, ReviewController.deleteReview);

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  ReviewController.getAllReviews
);

module.exports = router;
