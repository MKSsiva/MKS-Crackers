import pool from "../config/db.js";

export const getAllCategories = async () => {
  const [rows] = await pool.query(`
    SELECT
      id,
      name,
      slug,
      description,
      image,
      status,
      created_at,
      updated_at
    FROM categories
    ORDER BY id DESC
  `);

  return rows;
};

export const getCategoryById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      name,
      slug,
      description,
      image,
      status,
      created_at,
      updated_at
    FROM categories
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};

export const getCategoryBySlug = async (slug) => {
  const [rows] = await pool.query(
    `
    SELECT id
    FROM categories
    WHERE slug = ?
    LIMIT 1
    `,
    [slug]
  );

  return rows[0];
};

export const createCategory = async ({
  name,
  slug,
  description,
  image,
  status,
}) => {
  const [result] = await pool.query(
    `
    INSERT INTO categories
      (name, slug, description, image, status)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      name,
      slug,
      description || null,
      image || null,
      status || "active",
    ]
  );

  return result.insertId;
};

export const updateCategory = async (
  id,
  {
    name,
    slug,
    description,
    image,
    status,
  }
) => {
  const [result] = await pool.query(
    `
    UPDATE categories
    SET
      name = ?,
      slug = ?,
      description = ?,
      image = ?,
      status = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [
      name,
      slug,
      description || null,
      image || null,
      status || "active",
      id,
    ]
  );

  return result.affectedRows;
};

export const deleteCategory = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM categories WHERE id = ?",
    [id]
  );

  return result.affectedRows;
};