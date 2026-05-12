/**
 * Script de seed : ajoute des avis fictifs en MongoDB pour la démo.
 * Utilise le schéma Review existant : backend/schemas/Review.js
 *
 * Usage :
 *   1. Copier ce fichier dans : backend/scripts/seedReviews.js
 *   2. Vérifier la string MONGODB_URI dans ton .env ou ton config/mongodb.js
 *   3. Lancer depuis le dossier backend :
 *        node scripts/seedReviews.js
 */

const mongoose = require("mongoose");
require("dotenv").config(); // charge .env si présent

// Si MONGODB_URI n'est pas dans .env, mets-la en dur ici :
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/prestige_gentlemen";

// Schéma Review (identique à backend/schemas/Review.js)
const reviewSchema = new mongoose.Schema({
  productId: { type: Number, required: true, index: true },
  userId:    { type: Number, required: true },
  userName:  { type: String, required: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, required: true, maxlength: 1000 },
  verified:  { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
const Review = mongoose.model("Review", reviewSchema);

// 3 avis variés sur le Costume Marine Premium (productId = 2)
const reviewsToInsert = [
  {
    productId: 2,
    userId: 2,
    userName: "Pierre Dupont",
    rating: 5,
    comment:
      "Costume magnifique, tissu de très belle qualité. La coupe est parfaite et le bleu marine est exactement comme sur la photo. Reçu rapidement et bien emballé. Je recommande vivement Prestige Gentlemen pour un mariage.",
    verified: true,
    createdAt: new Date("2026-04-22T10:30:00Z"),
  },
  {
    productId: 2,
    userId: 3,
    userName: "Jean Martin",
    rating: 4,
    comment:
      "Très satisfait de mon achat. Le costume est élégant et bien taillé. Petit bémol sur le délai de livraison qui a été un peu long, mais le service client a été à l'écoute. Le tissu premium se sent au toucher.",
    verified: true,
    createdAt: new Date("2026-04-28T14:15:00Z"),
  },
  {
    productId: 2,
    userId: 4,
    userName: "Marc Bernard",
    rating: 5,
    comment:
      "Achat parfait pour mon mariage. Tous mes invités ont remarqué la qualité du costume. Le gilet assorti est un vrai plus. Service de retouches recommandé pour un ajustement impeccable.",
    verified: true,
    createdAt: new Date("2026-05-02T09:00:00Z"),
  },
];

async function seed() {
  try {
    console.log("Connexion à MongoDB :", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connecté");

    // Optionnel : nettoyer les avis existants pour productId=2
    const deleted = await Review.deleteMany({ productId: 2 });
    console.log(`✓ ${deleted.deletedCount} ancien(s) avis supprimé(s) pour productId=2`);

    // Insertion des nouveaux avis
    const inserted = await Review.insertMany(reviewsToInsert);
    console.log(`✓ ${inserted.length} avis insérés avec succès`);

    inserted.forEach((r) => {
      console.log(`  - ${r.userName} : ${r.rating}/5`);
    });

    console.log("\nTermine — tu peux maintenant rafraîchir la page produit /products/2");
    process.exit(0);
  } catch (err) {
    console.error("Erreur lors du seed :", err);
    process.exit(1);
  }
}

seed();
