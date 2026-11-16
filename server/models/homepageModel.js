import pool from "../config/db.js";

/*
|--------------------------------------------------------------------------
| GET ACTIVE HOMEPAGE FEATURES
|--------------------------------------------------------------------------
| Used by the customer homepage.
|--------------------------------------------------------------------------
*/

export const getHomepageFeatures = async () => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      icon,
      title,
      description,
      sort_order,
      status
    FROM homepage_features
    WHERE status = 'active'
    ORDER BY sort_order ASC, id ASC
    `
  );

  return rows;
};


/*
|--------------------------------------------------------------------------
| GET ALL HOMEPAGE FEATURES
|--------------------------------------------------------------------------
| Used by admin.
|--------------------------------------------------------------------------
*/

export const getAllHomepageFeatures = async () => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      icon,
      title,
      description,
      sort_order,
      status,
      created_at,
      updated_at
    FROM homepage_features
    ORDER BY sort_order ASC, id ASC
    `
  );

  return rows;
};


/*
|--------------------------------------------------------------------------
| GET SINGLE HOMEPAGE FEATURE
|--------------------------------------------------------------------------
*/

export const getHomepageFeatureById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      icon,
      title,
      description,
      sort_order,
      status,
      created_at,
      updated_at
    FROM homepage_features
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};


/*
|--------------------------------------------------------------------------
| CREATE HOMEPAGE FEATURE
|--------------------------------------------------------------------------
*/

export const createHomepageFeature = async ({
  icon,
  title,
  description,
  sort_order = 0,
  status = "active",
}) => {
  const [result] = await pool.query(
    `
    INSERT INTO homepage_features
    (
      icon,
      title,
      description,
      sort_order,
      status
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      icon,
      title,
      description || null,
      sort_order,
      status,
    ]
  );

  return result.insertId;
};


/*
|--------------------------------------------------------------------------
| UPDATE HOMEPAGE FEATURE
|--------------------------------------------------------------------------
*/

export const updateHomepageFeature = async (
  id,
  {
    icon,
    title,
    description,
    sort_order,
    status,
  }
) => {
  const [result] = await pool.query(
    `
    UPDATE homepage_features
    SET
      icon = ?,
      title = ?,
      description = ?,
      sort_order = ?,
      status = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [
      icon,
      title,
      description || null,
      sort_order,
      status,
      id,
    ]
  );

  return result.affectedRows;
};


/*
|--------------------------------------------------------------------------
| DELETE HOMEPAGE FEATURE
|--------------------------------------------------------------------------
*/

export const deleteHomepageFeature = async (id) => {
  const [result] = await pool.query(
    `
    DELETE FROM homepage_features
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows;
};