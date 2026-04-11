const Product = require("../models/ProductModel");

class ProductController {
  static async getAllProducts(req, res) {
    try {
      const { categoryId, featured } = req.query;

      const filters = {};
      if (categoryId) filters.categoryId = categoryId;
      if (featured === "true") filters.featured = true;

      const products = await Product.getAll(filters);

      res.json({
        success: true,
        count: products.length,
        products,
      });
    } catch (error) {
      console.error("Erreur getAllProducts:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des produits",
      });
    }
  }

  static async getProductById(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.getById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Produit non trouvé",
        });
      }

      res.json({
        success: true,
        product,
      });
    } catch (error) {
      console.error("Erreur getProductById:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération du produit",
      });
    }
  }

  static async getProductBySlug(req, res) {
    try {
      const { slug } = req.params;

      const product = await Product.getBySlug(slug);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Produit non trouvé",
        });
      }

      res.json({
        success: true,
        product,
      });
    } catch (error) {
      console.error("Erreur getProductBySlug:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération du produit",
      });
    }
  }

  static async createProduct(req, res) {
    try {
      const {
        categoryId,
        name,
        slug,
        description,
        basePrice,
        imageUrl,
        isFeatured,
      } = req.body;

      if (!categoryId || !name || !slug || !basePrice) {
        return res.status(400).json({
          success: false,
          message: "Champs obligatoires manquants",
        });
      }

      const productId = await Product.create({
        categoryId,
        name,
        slug,
        description,
        basePrice,
        imageUrl,
        isFeatured,
      });

      const product = await Product.getById(productId);

      res.status(201).json({
        success: true,
        message: "Produit créé avec succès",
        product,
      });
    } catch (error) {
      console.error("Erreur createProduct:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la création du produit",
      });
    }
  }

  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const productData = req.body;

      const updated = await Product.update(id, productData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Produit non trouvé ou aucune modification",
        });
      }

      const product = await Product.getById(id);

      res.json({
        success: true,
        message: "Produit mis à jour avec succès",
        product,
      });
    } catch (error) {
      console.error("Erreur updateProduct:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour du produit",
      });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      const deleted = await Product.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Produit non trouvé",
        });
      }

      res.json({
        success: true,
        message: "Produit désactivé avec succès",
      });
    } catch (error) {
      console.error("Erreur deleteProduct:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression du produit",
      });
    }
  }
}

module.exports = ProductController;
