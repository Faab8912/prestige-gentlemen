/**
 * Script de seed v2 : ajoute des avis fictifs sur TOUS les produits réels.
 * Utilise le schéma Review existant : backend/schemas/Review.js
 *
 * Usage :
 *   1. Copier ce fichier dans : backend/scripts/seedAllReviewsV2.js
 *   2. Lancer depuis le dossier backend :
 *        node scripts/seedAllReviewsV2.js
 *
 * Ce script SUPPRIME tous les avis existants puis les recrée
 * pour les 12 produits actuels (IDs : 1-10, 12, 14).
 */

const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/prestige_gentlemen";

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

const reviewers = [
  { userId: 2, userName: "Pierre Dupont" },
  { userId: 3, userName: "Jean Martin" },
  { userId: 4, userName: "Marc Bernard" },
  { userId: 5, userName: "Antoine Dubois" },
  { userId: 6, userName: "Sophie Lefèvre" },
  { userId: 7, userName: "Lucas Robert" },
  { userId: 8, userName: "Thomas Lambert" },
  { userId: 9, userName: "Nicolas Garcia" },
  { userId: 10, userName: "Julien Moreau" },
];

// Définition des avis par produit (adapté aux NOMS RÉELS de ta BDD)
const reviewsByProduct = {
  // 1. Costume 3 pièces Élégance Noire
  1: [
    { reviewer: 0, rating: 5, comment: "Costume noir très élégant, coupe slim parfaite. La laine italienne fait toute la différence sur le rendu final." },
    { reviewer: 4, rating: 5, comment: "Idéal pour mon mariage. Le tissu est de très belle qualité et le gilet ajoute une touche raffinée." },
    { reviewer: 7, rating: 4, comment: "Très satisfait. Le costume taille bien, la finition est soignée. Je conseille de prendre une retouche pour un ajustement parfait." },
  ],
  // 2. Costume Élégance Marine
  2: [
    { reviewer: 0, rating: 5, comment: "Costume magnifique, tissu de très belle qualité. La coupe est parfaite et le bleu marine est exactement comme sur la photo." },
    { reviewer: 1, rating: 4, comment: "Très satisfait. Le costume est élégant et bien taillé. Petit bémol sur le délai de livraison qui a été un peu long." },
    { reviewer: 2, rating: 5, comment: "Achat parfait pour mon mariage. Tous mes invités ont remarqué la qualité. Le bleu marine est intemporel." },
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
  // 5. Costume Élégance Vert
  5: [
    { reviewer: 1, rating: 5, comment: "Couleur originale et raffinée, parfaite pour se démarquer sans excès. La coupe est très bien réalisée." },
    { reviewer: 8, rating: 4, comment: "Très satisfait, le vert est subtil et le tissu de qualité. Idéal pour un mariage en pleine nature." },
  ],
  // 6. Costume Élégance Bleu Foncé
  6: [
    { reviewer: 2, rating: 5, comment: "Excellent rapport qualité-prix. Le bleu foncé tombe très bien et passe partout." },
    { reviewer: 5, rating: 4, comment: "Costume sobre et élégant. La coupe ajustée flatte la silhouette, je recommande." },
    { reviewer: 6, rating: 5, comment: "Très satisfait, livraison rapide et tissu agréable au toucher. Belle alternative au noir classique." },
  ],
  // 7. Chemise Blanche Premium
  7: [
    { reviewer: 0, rating: 5, comment: "Chemise en coton égyptien d'excellente qualité. Le toucher est doux, le col tient parfaitement." },
    { reviewer: 3, rating: 4, comment: "Très bonne chemise. La coupe est ajustée, le tissu solide. Parfait avec un costume." },
  ],
  // 8. Cravate Soie Collection
  8: [
    { reviewer: 4, rating: 5, comment: "Soie de belle qualité, finition soignée. Idéale pour aller avec un costume sombre." },
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
  // 12. Costume Élégance Blanc
  12: [
    { reviewer: 8, rating: 5, comment: "Costume blanc d'une grande élégance, parfait pour un mariage estival ou en bord de mer. La coupe est moderne et flatteuse." },
    { reviewer: 1, rating: 5, comment: "Pièce originale qui fait son effet. Le blanc reste classieux, je l'ai porté à mon mariage et tout le monde l'a remarqué." },
    { reviewer: 4, rating: 4, comment: "Très belle qualité. Petit bémol : le blanc est plus salissant qu'un costume sombre, mais c'est inhérent à la couleur." },
  ],
  // 14. Costume Élégance Bleu Roi
  14: [
    { reviewer: 7, rating: 5, comment: "Couleur magnifique, le bleu roi est éclatant sans être criard. Parfait pour un événement formel ou un mariage." },
    { reviewer: 2, rating: 4, comment: "Très satisfait. La coupe moderne est bien réalisée, le tissu est agréable. Une couleur qui change du noir habituel." },
    { reviewer: 5, rating: 5, comment: "Costume original et élégant. Il attire les regards à coup sûr, idéal pour qui veut sortir des sentiers battus." },
  ],
};

async function seed() {
  try {
    console.log("Connexion à MongoDB :", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connecté\n");

    const deleted = await Review.deleteMany({});
    console.log(`✓ ${deleted.deletedCount} ancien(s) avis supprimé(s)\n`);

    const allReviews = [];
    const now = new Date();

    Object.entries(reviewsByProduct).forEach(([productId, reviews]) => {
      reviews.forEach((r, index) => {
        const daysAgo = 60 - parseInt(productId) * 4 - index * 3;
        const date = new Date(now);
        date.setDate(date.getDate() - Math.max(daysAgo, 1));

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

    Object.entries(reviewsByProduct).forEach(([productId, reviews]) => {
      const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
      console.log(`  Produit #${productId.padStart(2)} → ${reviews.length} avis, note moyenne ${avg.toFixed(1)}/5`);
    });

    console.log("\nTermine — rafraîchis n'importe quelle page produit pour voir les avis.");
    process.exit(0);
  } catch (err) {
    console.error("Erreur lors du seed :", err);
    process.exit(1);
  }
}

seed();
