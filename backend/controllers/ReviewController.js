const Review = require("../schemas/Review");

class ReviewController {
  static async createReview(req, res) {
    try {
      const { productId, rating, comment } = req.body;

      if (!productId || !rating || !comment) {
        return res.status(400).json({
          success: false,
          message: "Produit, note et commentaire requis",
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "La note doit être entre 1 et 5",
        });
      }

      const review = new Review({
        productId,
        userId: req.userId,
        userName: `${req.userEmail.split("@")[0]}`,
        rating,
        comment,
        verified: false,
      });

      await review.save();

      res.status(201).json({
        success: true,
        message: "Avis créé avec succès",
        review,
      });
    } catch (error) {
      console.error("Erreur createReview:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la création de l'avis",
      });
    }
  }

  static async getProductReviews(req, res) {
    try {
      const { productId } = req.params;

      const reviews = await Review.find({ productId })
        .sort({ createdAt: -1 })
        .limit(50);

      const stats = await Review.aggregate([
        { $match: { productId: parseInt(productId) } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
            rating5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
            rating4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
            rating3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
            rating2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
            rating1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
          },
        },
      ]);

      res.json({
        success: true,
        reviews,
        stats: stats[0] || {
          averageRating: 0,
          totalReviews: 0,
          rating5: 0,
          rating4: 0,
          rating3: 0,
          rating2: 0,
          rating1: 0,
        },
      });
    } catch (error) {
      console.error("Erreur getProductReviews:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des avis",
      });
    }
  }

  static async deleteReview(req, res) {
    try {
      const { id } = req.params;

      const review = await Review.findById(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Avis non trouvé",
        });
      }

      if (review.userId !== req.userId && req.userRole !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Accès non autorisé",
        });
      }

      await Review.findByIdAndDelete(id);

      res.json({
        success: true,
        message: "Avis supprimé avec succès",
      });
    } catch (error) {
      console.error("Erreur deleteReview:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression de l'avis",
      });
    }
  }

  static async getAllReviews(req, res) {
    try {
      const reviews = await Review.find().sort({ createdAt: -1 }).limit(100);

      res.json({
        success: true,
        count: reviews.length,
        reviews,
      });
    } catch (error) {
      console.error("Erreur getAllReviews:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des avis",
      });
    }
  }
}

module.exports = ReviewController;
