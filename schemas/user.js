const pool = require("../utils/postgres");

const createUser = async (username, password, email, fullName, roleId) => {
  const result = await pool.query(
    `INSERT INTO users (username, password, email, "fullName", "roleId") 
     VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, "fullName", "roleId", "createdAt"`,
    [username, password, email, fullName || '', roleId]
  );
  return result.rows[0];
};

const getUsers = async () => {
  const result = await pool.query(
    `SELECT id, username, email, "fullName", "avatarUrl", status, "roleId", "createdAt" 
     FROM users WHERE "isDeleted" = false`
  );
  return result.rows;
};

const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, username, email, "fullName", "avatarUrl", status, "roleId", "loginCount" 
     FROM users WHERE id = $1 AND "isDeleted" = false`,
    [id]
  );
  return result.rows[0];
};

const getUserByUsername = async (username) => {
  const result = await pool.query(
    `SELECT id, username, email, password, "fullName", "roleId" 
     FROM users WHERE username = $1 AND "isDeleted" = false`,
    [username]
  );
  return result.rows[0];
};

const updateUser = async (id, data) => {
  const fields = [];
  const values = [];
  let index = 1;
  
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) {
      fields.push(`"${key}" = $${index}`);
      values.push(value);
      index++;
    }
  }
  values.unshift(id);
  
  const result = await pool.query(
    `UPDATE users SET ${fields.join(', ')}, "updatedAt" = CURRENT_TIMESTAMP 
     WHERE id = $1 AND "isDeleted" = false RETURNING *`,
    values
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByUsername,
  updateUser
};
