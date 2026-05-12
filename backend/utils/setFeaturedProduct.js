// Script utilitaire : marque un produit comme "featured" (Recommandé)
// Usage : node utils/setFeaturedProduct.js <id> [0|1]
// Exemple : node utils/setFeaturedProduct.js 12 1

require("dotenv").config({ path: __dirname + "/../.env" });
const { pool } = require("../config/database");

const productId = parseInt(process.argv[2], 10);
const featured = parseInt(process.argv[3] ?? "1", 10);

if (!productId || isNaN(productId)) {
  console.error("Usage : node utils/setFeaturedProduct.js <id> [0|1]");
  process.exit(1);
}

(async () => {
  try {
    const [result] = await pool.query(
      "UPDATE products SET is_featured = ? WHERE id = ?",
      [featured, productId]
    );

    if (result.affectedRows === 0) {
      console.error(`Aucun produit trouvé avec l'id ${productId}.`);
      process.exit(1);
    }

    const [rows] = await pool.query(
      "SELECT id, name, is_featured FROM products WHERE id = ?",
      [productId]
    );

    console.log("Produit mis à jour :");
    console.log(rows[0]);
    process.exit(0);
  } catch (err) {
    console.error("Erreur :", err.message);
    process.exit(1);
  }
})();
