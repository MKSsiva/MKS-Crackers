import pool from "../config/db.js";

export const createProduct = async ({
  category_id,
  name,
  slug,
  sku,
  description,
  price,
  sale_price,
  stock_quantity,
  unit,
  weight,
  status,
  featured,
}) => {
  const [result] = await pool.query(
    `
    INSERT INTO products
    (
      category_id,
      name,
      slug,
      sku,
      description,
      price,
      sale_price,
      stock_quantity,
      unit,
      weight,
      status,
      featured
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      category_id,
      name,
      slug,
      sku,
      description || null,
      price,
      sale_price ?? null,
      stock_quantity ?? 0,
      unit || null,
      weight ?? null,
      status || "active",
      featured ?? 0,
    ]
  );

  return result.insertId;
};


export const getAllProducts = async () => {
  const [rows] = await pool.query(
    `
    SELECT
      p.*,
      c.name AS category_name
    FROM products p
    LEFT JOIN categories c
      ON p.category_id = c.id
    ORDER BY p.id DESC
    `
  );

  return rows;
};


export const getProductById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT
      p.*,
      c.name AS category_name
    FROM products p
    LEFT JOIN categories c
      ON p.category_id = c.id
    WHERE p.id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};


export const updateProduct = async (
  id,
  {
    category_id,
    name,
    slug,
    sku,
    description,
    price,
    sale_price,
    stock_quantity,
    unit,
    weight,
    status,
    featured,
  }
) => {
  const [result] = await pool.query(
    `
    UPDATE products
    SET
      category_id = ?,
      name = ?,
      slug = ?,
      sku = ?,
      description = ?,
      price = ?,
      sale_price = ?,
      stock_quantity = ?,
      unit = ?,
      weight = ?,
      status = ?,
      featured = ?
    WHERE id = ?
    `,
    [
      category_id,
      name,
      slug,
      sku,
      description || null,
      price,
      sale_price ?? null,
      stock_quantity ?? 0,
      unit || null,
      weight ?? null,
      status || "active",
      featured ?? 0,
      id,
    ]
  );

  return result.affectedRows;
};


export const deleteProduct = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM products WHERE id = ?",
    [id]
  );

  return result.affectedRows;
};