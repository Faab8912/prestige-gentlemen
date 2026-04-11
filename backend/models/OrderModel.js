const { pool } = require("../config/database");

class Order {
  static async create(orderData) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const orderNumber = "PG" + Date.now() + Math.floor(Math.random() * 1000);

      const [orderResult] = await connection.query(
        `INSERT INTO orders 
                (user_id, order_number, total_amount, status, shipping_address, shipping_city, 
                shipping_postal_code, shipping_country, payment_method, payment_status, notes) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderData.userId,
          orderNumber,
          orderData.totalAmount,
          "pending",
          orderData.shippingAddress,
          orderData.shippingCity,
          orderData.shippingPostalCode,
          orderData.shippingCountry || "France",
          orderData.paymentMethod,
          "pending",
          orderData.notes || null,
        ]
      );

      const orderId = orderResult.insertId;

      for (const item of orderData.items) {
        const unitPrice = parseFloat(item.price);
        const subtotal = unitPrice * parseInt(item.quantity);

        await connection.query(
          `INSERT INTO order_items 
                        (order_id, variant_id, product_name, size, color, quantity, unit_price, subtotal) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.variantId,
            item.productName,
            item.size,
            item.color,
            item.quantity,
            unitPrice,
            subtotal,
          ]
        );

        await connection.query(
          "UPDATE variants SET stock_quantity = stock_quantity - ? WHERE id = ?",
          [item.quantity, item.variantId]
        );
      }

      await connection.commit();

      return { orderId, orderNumber };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getById(id) {
    try {
      const [orders] = await pool.query(
        `SELECT o.*, u.first_name, u.last_name, u.email, u.phone
                FROM orders o
                LEFT JOIN users u ON o.user_id = u.id
                WHERE o.id = ?`,
        [id]
      );

      if (orders.length === 0) {
        return null;
      }

      const order = orders[0];

      const [items] = await pool.query(
        "SELECT * FROM order_items WHERE order_id = ?",
        [id]
      );

      order.items = items;

      return order;
    } catch (error) {
      throw error;
    }
  }

  static async getByUserId(userId) {
    try {
      const [orders] = await pool.query(
        "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
      );

      return orders;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const [orders] = await pool.query(
        `SELECT o.*, u.first_name, u.last_name, u.email
                FROM orders o
                LEFT JOIN users u ON o.user_id = u.id
                ORDER BY o.created_at DESC`
      );

      return orders;
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const [result] = await pool.query(
        "UPDATE orders SET status = ? WHERE id = ?",
        [status, id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async updatePaymentStatus(id, paymentStatus) {
    try {
      const [result] = await pool.query(
        "UPDATE orders SET payment_status = ? WHERE id = ?",
        [paymentStatus, id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getOrderStats() {
    try {
      const [stats] = await pool.query(
        `SELECT 
                    COUNT(*) as total_orders,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
                    SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_orders,
                    SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END) as shipped_orders,
                    SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
                    SUM(total_amount) as total_revenue
                FROM orders`
      );

      return stats[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Order;
