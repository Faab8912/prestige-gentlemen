const { pool } = require("../config/database");

class Product {
  static async getAll(filters = {}) {
    try {
      let query = `
                SELECT 
                    p.*,
                    c.name as category_name,
                    c.slug as category_slug,
                    MIN(v.stock_quantity) as min_stock,
                    COUNT(DISTINCT v.id) as variant_count
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN variants v ON p.id = v.product_id
                WHERE p.is_active = 1
            `;

      const params = [];

      if (filters.categoryId) {
        query += " AND p.category_id = ?";
        params.push(filters.categoryId);
      }

      if (filters.featured) {
        query += " AND p.is_featured = 1";
      }

      query += " GROUP BY p.id ORDER BY p.created_at DESC";

      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [products] = await pool.query(
        `SELECT 
                    p.*,
                    c.name as category_name,
                    c.slug as category_slug
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.id = ? AND p.is_active = 1`,
        [id]
      );

      if (products.length === 0) {
        return null;
      }

      const product = products[0];

      const [variants] = await pool.query(
        "SELECT * FROM variants WHERE product_id = ? ORDER BY size, color",
        [id]
      );

      product.variants = variants;

      return product;
    } catch (error) {
      throw error;
    }
  }

  static async getBySlug(slug) {
    try {
      const [products] = await pool.query(
        `SELECT 
                    p.*,
                    c.name as category_name,
                    c.slug as category_slug
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.slug = ? AND p.is_active = 1`,
        [slug]
      );

      if (products.length === 0) {
        return null;
      }

      const product = products[0];

      const [variants] = await pool.query(
        "SELECT * FROM variants WHERE product_id = ? ORDER BY size, color",
        [product.id]
      );

      product.variants = variants;

      return product;
    } catch (error) {
      throw error;
    }
  }

  static async create(productData) {
    try {
      const [result] = await pool.query(
        `INSERT INTO products 
                (category_id, name, slug, description, base_price, image_url, is_featured, is_active) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productData.categoryId,
          productData.name,
          productData.slug,
          productData.description,
          productData.basePrice,
          productData.imageUrl || null,
          productData.isFeatured || false,
          productData.isActive !== undefined ? productData.isActive : true,
        ]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, productData) {
    try {
      const fields = [];
      const values = [];

      if (productData.name) {
        fields.push("name = ?");
        values.push(productData.name);
      }
      if (productData.description !== undefined) {
        fields.push("description = ?");
        values.push(productData.description);
      }
      if (productData.basePrice) {
        fields.push("base_price = ?");
        values.push(productData.basePrice);
      }
      if (productData.imageUrl !== undefined) {
        fields.push("image_url = ?");
        values.push(productData.imageUrl);
      }
      if (productData.isFeatured !== undefined) {
        fields.push("is_featured = ?");
        values.push(productData.isFeatured);
      }
      if (productData.isActive !== undefined) {
        fields.push("is_active = ?");
        values.push(productData.isActive);
      }

      if (fields.length === 0) {
        return false;
      }

      values.push(id);

      const [result] = await pool.query(
        `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
        values
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query(
        "UPDATE products SET is_active = 0 WHERE id = ?",
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getVariantById(variantId) {
    try {
      const [rows] = await pool.query("SELECT * FROM variants WHERE id = ?", [
        variantId,
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateStock(variantId, quantity) {
    try {
      const [result] = await pool.query(
        "UPDATE variants SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?",
        [quantity, variantId, quantity]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product;
