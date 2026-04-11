const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

class AuthController {
  static async register(req, res) {
    try {
      const { firstName, lastName, email, password, phone } = req.body;

      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
          message: "Tous les champs obligatoires doivent être remplis",
        });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          message: "Cet email est déjà utilisé",
        });
      }

      const userId = await User.create({
        firstName,
        lastName,
        email,
        password,
        phone,
        role: "client",
      });

      const user = await User.findById(userId);

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(201).json({
        message: "Compte créé avec succès",
        token,
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Erreur register:", error);
      res.status(500).json({
        message: "Erreur lors de la création du compte",
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Email et mot de passe requis",
        });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          message: "Email ou mot de passe incorrect",
        });
      }

      const isPasswordValid = await User.comparePassword(
        password,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Email ou mot de passe incorrect",
        });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        message: "Connexion réussie",
        token,
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Erreur login:", error);
      res.status(500).json({
        message: "Erreur lors de la connexion",
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          message: "Utilisateur non trouvé",
        });
      }

      res.json({
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          createdAt: user.created_at,
        },
      });
    } catch (error) {
      console.error("Erreur getProfile:", error);
      res.status(500).json({
        message: "Erreur lors de la récupération du profil",
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { firstName, lastName, phone } = req.body;

      const updated = await User.update(req.userId, {
        firstName,
        lastName,
        phone,
      });

      if (!updated) {
        return res.status(400).json({
          message: "Aucune modification effectuée",
        });
      }

      const user = await User.findById(req.userId);

      res.json({
        message: "Profil mis à jour avec succès",
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Erreur updateProfile:", error);
      res.status(500).json({
        message: "Erreur lors de la mise à jour du profil",
      });
    }
  }
}

module.exports = AuthController;
