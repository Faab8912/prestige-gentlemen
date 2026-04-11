const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.get("/slug/:slug", ProductController.getProductBySlug);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  ProductController.createProduct
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  ProductController.updateProduct
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  ProductController.deleteProduct
);

module.exports = router;
