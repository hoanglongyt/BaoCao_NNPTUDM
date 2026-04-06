const pool = require("../utils/postgres");

const createRole = async (name, slug) => {
  const result = await pool.query(
    `INSERT INTO roles (name, slug) VALUES ($1, $2) RETURNING *`,
    [name, slug]
  );
  return result.rows[0];
};

const getRoles = async () => {
  const result = await pool.query(`SELECT * FROM roles ORDER BY name`);
  return result.rows;
};

const getRoleById = async (id) => {
  const result = await pool.query(`SELECT * FROM roles WHERE id = $1`, [id]);
  return result.rows[0];
};

module.exports = {
  createRole,
  getRoles,
  getRoleById
};
