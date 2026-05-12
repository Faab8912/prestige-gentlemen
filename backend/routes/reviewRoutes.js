const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/ReviewController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Route publique — stats agrégées de TOUS les produits (note moyenne + nb d'avis)
router.get("/stats", ReviewController.getStatsByProduct);

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
