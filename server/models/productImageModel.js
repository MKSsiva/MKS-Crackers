import pool from "../config/db.js";

export const createProductImage = async ({
  product_id,
  image_url,
  public_id,
  is_primary = 0,
  sort_order = 0,
}) => {
  const [result] = await pool.query(
    `
    INSERT INTO product_images
    (product_id, image_url, public_id, is_primary, sort_order)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      product_id,
      image_url,
      public_id,
      is_primary,
      sort_order,
    ]
  );

  return result.insertId;
};

export const getProductImages = async (productId) => {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM product_images
    WHERE product_id = ?
    ORDER BY is_primary DESC, sort_order ASC, id ASC
    `,
    [productId]
  );

  return rows;
};

export const getProductImageById = async (imageId) => {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM product_images
    WHERE id = ?
    LIMIT 1
    `,
    [imageId]
  );

  return rows[0];
};

export const setPrimaryImage = async (imageId, productId) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      `
      UPDATE product_images
      SET is_primary = 0
      WHERE product_id = ?
      `,
      [productId]
    );

    await connection.query(
      `
      UPDATE product_images
      SET is_primary = 1
      WHERE id = ?
      AND product_id = ?
      `,
      [imageId, productId]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const deleteProductImage = async (imageId) => {
  const [result] = await pool.query(
    `
    DELETE FROM product_images
    WHERE id = ?
    `,
    [imageId]
  );

  return result.affectedRows;
};