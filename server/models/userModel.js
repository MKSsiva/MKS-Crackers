import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, name, email, phone, role, status, email_verified_at, last_login_at, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );

  return rows[0];
};

export const createUser = async ({
  name,
  email,
  phone,
  password,
}) => {
  const [result] = await pool.query(
    `INSERT INTO users
      (name, email, phone, password)
     VALUES (?, ?, ?, ?)`,
    [name, email, phone || null, password]
  );

  return result.insertId;
};

export const updateLastLogin = async (userId) => {
  await pool.query(
    "UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?",
    [userId]
  );
};