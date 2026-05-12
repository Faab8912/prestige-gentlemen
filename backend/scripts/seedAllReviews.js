/**
 * Script de seed étendu : ajoute des avis fictifs sur TOUS les produits.
 * Utilise le schéma Review existant : backend/schemas/Review.js
 *
 * Usage :
 *   1. Copier ce fichier dans : backend/scripts/seedAllReviews.js
 *   2. Vérifier la string MONGODB_URI dans .env (ou en dur ligne 18)
 *   3. Lancer depuis le dossier backend :
 *        node scripts/seedAllReviews.js
 *
 * Ce script SUPPRIME tous les avis existants puis les recrée.
 */

const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/prestige_gentlemen";

// Schéma identique à backend/schemas/Review.js
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

// Utilisateurs (mix des users SQL existants 2,3,4 + nouveaux pour la variété)
const reviewers = [
  { userId: 2, userName: "Pierre Dupont" },
  { userId: 3, userName: "Jean Martin" },
  { userId: 4, userName: "Marc Bernard" },
  { userId: 5, userName: "Antoine Dubois" },
  { userId: 6, userName: "Sophie Lefèvre" },
  { userId: 7, userName: "Lucas Robert" },
  { userId: 8, userName: "Thomas Lambert" },
  { userId: 9, userName: "Nicolas Garcia" },
];

// Définition des avis par produit
const reviewsByProduct = {
  // 1. Costume 3 pièces Élégance Noire
  1: [
    { reviewer: 0, rating: 5, comment: "Costume noir très élégant, coupe slim parfaite. La laine italienne fait toute la différence sur le rendu final." },
    { reviewer: 4, rating: 5, comment: "Idéal pour mon mariage. Le tissu est de très belle qualité, et le gilet ajoute une touche raffinée." },
    { reviewer: 7, rating: 4, comment: "Très satisfait. Le costume taille bien, la finition est soignée. Je conseille de prendre une retouche pour un ajustement parfait." },
  ],
  // 2. Costume 3 pièces Marine Premium
  2: [
    { reviewer: 0, rating: 5, comment: "Costume magnifique, tissu de très belle qualité. La coupe est parfaite et le bleu marine est exactement comme sur la photo." },
    { reviewer: 1, rating: 4, comment: "Très satisfait. Le costume est élégant et bien taillé. Petit bémol sur le délai de livraison qui a été un peu long." },
    { reviewer: 2, rating: 5, comment: "Achat parfait pour mon mariage. Tous mes invités ont remarqué la qualité. Le gilet assorti est un vrai plus." },
  ],
  // 3. Costume 3 pièces Gris Anthracite
  3: [
    { reviewer: 3, rating: 4, comment: "Costume polyvalent, bien adapté à la mi-saison. Le gris anthracite est élégant sans être trop strict." },
    { reviewer: 5, rating: 5, comment: "Coupe moderne très réussie. Je l'ai porté pour un mariage en automne, parfaitement adapté." },
  ],
  // 4. Smoking Classique Noir
  4: [
    { reviewer: 0, rating: 5, comment: "Smoking impeccable. Les revers en satin sont magnifiques, la finition est digne d'une grande maison." },
    { reviewer: 6, rating: 5, comment: "Pour une cérémonie chic, c'est exactement ce qu'il faut. Tissu noble, coupe traditionnelle réussie." },
    { reviewer: 4, rating: 4, comment: "Très belle pièce. Le tissu noir est profond, le tombé est parfait. À conseiller pour les soirées habillées." },
  ],
  // 5. Smoking Blanc Ivoire
  5: [
    { reviewer: 1, rating: 5, comment: "Idéal pour un mariage d'été. Le blanc ivoire est très distingué, ça change du smoking noir traditionnel." },
    { reviewer: 7, rating: 4, comment: "Pièce originale et élégante. Le tissu est de qualité, je recommande pour qui veut sortir des sentiers battus." },
  ],
  // 6. Costume Lin Beige
  6: [
    { reviewer: 2, rating: 5, comment: "Parfait pour un mariage champêtre en été. Le lin est respirant, le beige reste élégant." },
    { reviewer: 5, rating: 4, comment: "Très satisfait. Le lin se froisse un peu (c'est normal) mais ça donne un look décontracté chic." },
    { reviewer: 6, rating: 5, comment: "Très belle coupe, le tissu est doux et léger. Recommandé pour les cérémonies en extérieur." },
  ],
  // 7. Chemise Blanche Premium
  7: [
    { reviewer: 0, rating: 5, comment: "Chemise en coton égyptien d'excellente qualité. Le toucher est doux, le col tient parfaitement." },
    { reviewer: 3, rating: 4, comment: "Très bonne chemise. La coupe est ajustée, le tissu solide. Parfait avec un costume." },
  ],
  // 8. Cravate Soie Bleue
  8: [
    { reviewer: 4, rating: 5, comment: "Soie de belle qualité, le bleu marine est profond. Idéal pour aller avec un costume sombre." },
    { reviewer: 7, rating: 5, comment: "Très belle cravate, le nœud se fait facilement et tient bien. Élégante." },
    { reviewer: 1, rating: 4, comment: "Bonne cravate, la couleur est conforme à la photo. Bon rapport qualité-prix." },
  ],
  // 9. Nœud Papillon Noir Satin
  9: [
    { reviewer: 2, rating: 5, comment: "Nœud papillon de qualité, le satin a un bel éclat. Indispensable pour un smoking." },
    { reviewer: 6, rating: 4, comment: "Classique et élégant. Le système de réglage est pratique. Convient à toutes les morphologies." },
  ],
  // 10. Richelieu Cuir Noir
  10: [
    { reviewer: 0, rating: 5, comment: "Chaussures magnifiques, cuir italien souple et solide. La finition est exceptionnelle." },
    { reviewer: 3, rating: 5, comment: "Richelieu très élégantes, je les ai portées toute la journée du mariage sans inconfort." },
    { reviewer: 5, rating: 4, comment: "Belle paire, le cuir se patine joliment. Prévoir un temps d'adaptation pour les premières heures." },
  ],
};

async function seed() {
  try {
    console.log("Connexion à MongoDB :", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connecté\n");

    // Supprimer tous les avis existants
    const deleted = await Review.deleteMany({});
    console.log(`✓ ${deleted.deletedCount} ancien(s) avis supprimé(s)\n`);

    // Construction et insertion des avis
    const allReviews = [];
    const now = new Date();

    Object.entries(reviewsByProduct).forEach(([productId, reviews]) => {
      reviews.forEach((r, index) => {
        // Date échelonnée : entre il y a 2 mois et il y a 3 jours
        const daysAgo = 60 - parseInt(productId) * 5 - index * 4;
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);

        const reviewer = reviewers[r.reviewer];
        allReviews.push({
          productId: parseInt(productId),
          userId: reviewer.userId,
          userName: reviewer.userName,
          rating: r.rating,
          comment: r.comment,
          verified: true,
          createdAt: date,
        });
      });
    });

    const inserted = await Review.insertMany(allReviews);
    console.log(`✓ ${inserted.length} avis insérés sur ${Object.keys(reviewsByProduct).length} produits :\n`);

    // Récap par produit
    Object.entries(reviewsByProduct).forEach(([productId, reviews]) => {
      const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
      console.log(`  Produit #${productId} → ${reviews.length} avis, note moyenne ${avg.toFixed(1)}/5`);
    });

    console.log("\nTermine — rafraîchis n'importe quelle page produit pour voir les avis.");
    process.exit(0);
  } catch (err) {
    console.error("Erreur lors du seed :", err);
    process.exit(1);
  }
}

seed();
