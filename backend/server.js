const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const { testConnection } = require("./config/database");
const connectMongoDB = require("./config/mongodb");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/api", (req, res) => {
  res.json({
    message: "API Prestige Gentlemen fonctionnelle",
    version: "1.0.0",
  });
});

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

// Gestion erreur 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée",
  });
});

// Test connexion base de données
testConnection();
// Connexion MongoDB
connectMongoDB();

// Démarrage du serveur
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV}`);
});
