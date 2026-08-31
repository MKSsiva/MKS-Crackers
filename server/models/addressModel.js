import pool from "../config/db.js";

export const createAddress = async ({
  userId,
  name,
  phone,
  address_line1,
  address_line2,
  city,
  state,
  pincode,
  landmark,
  address_type,
  is_default,
}) => {
  const [result] = await pool.query(
    `
    INSERT INTO addresses
    (
      user_id,
      name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      landmark,
      address_type,
      is_default
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      userId,
      name,
      phone,
      address_line1,
      address_line2 || null,
      city,
      state,
      pincode,
      landmark || null,
      address_type || "home",
      is_default ? 1 : 0,
    ]
  );

  return result.insertId;
};

export const getAddressesByUserId = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM addresses
    WHERE user_id = ?
    ORDER BY is_default DESC, id DESC
    `,
    [userId]
  );

  return rows;
};

export const getAddressById = async (id, userId) => {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM addresses
    WHERE id = ? AND user_id = ?
    LIMIT 1
    `,
    [id, userId]
  );

  return rows[0];
};

export const updateAddress = async ({
  id,
  userId,
  name,
  phone,
  address_line1,
  address_line2,
  city,
  state,
  pincode,
  landmark,
  address_type,
}) => {
  const [result] = await pool.query(
    `
    UPDATE addresses
    SET
      name = ?,
      phone = ?,
      address_line1 = ?,
      address_line2 = ?,
      city = ?,
      state = ?,
      pincode = ?,
      landmark = ?,
      address_type = ?
    WHERE id = ? AND user_id = ?
    `,
    [
      name,
      phone,
      address_line1,
      address_line2 || null,
      city,
      state,
      pincode,
      landmark || null,
      address_type || "home",
      id,
      userId,
    ]
  );

  return result.affectedRows;
};

export const deleteAddress = async (id, userId) => {
  const [result] = await pool.query(
    `
    DELETE FROM addresses
    WHERE id = ? AND user_id = ?
    `,
    [id, userId]
  );

  return result.affectedRows;
};

export const clearDefaultAddress = async (userId) => {
  await pool.query(
    `
    UPDATE addresses
    SET is_default = 0
    WHERE user_id = ?
    `,
    [userId]
  );
};

export const setDefaultAddress = async (id, userId) => {
  await clearDefaultAddress(userId);

  const [result] = await pool.query(
    `
    UPDATE addresses
    SET is_default = 1
    WHERE id = ? AND user_id = ?
    `,
    [id, userId]
  );

  return result.affectedRows;
};