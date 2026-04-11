const Order = require("../models/OrderModel");

class OrderController {
  static async createOrder(req, res) {
    try {
      const {
        items,
        shippingAddress,
        shippingCity,
        shippingPostalCode,
        shippingCountry,
        paymentMethod,
        notes,
      } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Le panier est vide",
        });
      }

      if (!shippingAddress || !shippingCity || !shippingPostalCode) {
        return res.status(400).json({
          success: false,
          message: "Adresse de livraison incomplète",
        });
      }

      const totalAmount = items.reduce(
        (total, item) =>
          total + parseFloat(item.price) * parseInt(item.quantity),
        0
      );
      const orderData = {
        userId: req.userId,
        items,
        totalAmount,
        shippingAddress,
        shippingCity,
        shippingPostalCode,
        shippingCountry,
        paymentMethod,
        notes,
      };

      const { orderId, orderNumber } = await Order.create(orderData);

      const order = await Order.getById(orderId);

      res.status(201).json({
        success: true,
        message: "Commande créée avec succès",
        order: {
          id: order.id,
          orderNumber: order.order_number,
          totalAmount: order.total_amount,
          status: order.status,
        },
      });
    } catch (error) {
      console.error("Erreur createOrder:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la création de la commande",
      });
    }
  }

  static async getOrderById(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.getById(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Commande non trouvée",
        });
      }

      if (order.user_id !== req.userId && req.userRole !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Accès non autorisé",
        });
      }

      res.json({
        success: true,
        order,
      });
    } catch (error) {
      console.error("Erreur getOrderById:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération de la commande",
      });
    }
  }

  static async getUserOrders(req, res) {
    try {
      const orders = await Order.getByUserId(req.userId);

      res.json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      console.error("Erreur getUserOrders:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des commandes",
      });
    }
  }

  static async getAllOrders(req, res) {
    try {
      const orders = await Order.getAll();

      res.json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      console.error("Erreur getAllOrders:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des commandes",
      });
    }
  }

  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Statut invalide",
        });
      }

      const updated = await Order.updateStatus(id, status);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Commande non trouvée",
        });
      }

      res.json({
        success: true,
        message: "Statut mis à jour avec succès",
      });
    } catch (error) {
      console.error("Erreur updateOrderStatus:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour du statut",
      });
    }
  }

  static async getOrderStats(req, res) {
    try {
      const stats = await Order.getOrderStats();

      res.json({
        success: true,
        stats,
      });
    } catch (error) {
      console.error("Erreur getOrderStats:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des statistiques",
      });
    }
  }
}

module.exports = OrderController;
