const { pool } = require("../config/database");
const bcrypt = require("bcrypt");

class User {
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.query(
        "SELECT id, first_name, last_name, email, phone, role, created_at FROM users WHERE id = ?",
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const [result] = await pool.query(
        "INSERT INTO users (first_name, last_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)",
        [
          userData.firstName,
          userData.lastName,
          userData.email,
          hashedPassword,
          userData.phone || null,
          userData.role || "client",
        ]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async comparePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  }

  static async update(id, userData) {
    try {
      const fields = [];
      const values = [];

      if (userData.firstName) {
        fields.push("first_name = ?");
        values.push(userData.firstName);
      }
      if (userData.lastName) {
        fields.push("last_name = ?");
        values.push(userData.lastName);
      }
      if (userData.phone) {
        fields.push("phone = ?");
        values.push(userData.phone);
      }

      if (fields.length === 0) {
        return false;
      }

      values.push(id);

      const [result] = await pool.query(
        `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
        values
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const [rows] = await pool.query(
        "SELECT id, first_name, last_name, email, phone, role, created_at FROM users ORDER BY created_at DESC"
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
