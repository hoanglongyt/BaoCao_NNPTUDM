const pool = require("../utils/postgres");

const createOrder = async (userId, total) => {
  const result = await pool.query(
    `INSERT INTO orders ("userId", total, status) VALUES ($1, $2, $3) RETURNING *`,
    [userId, total, "created"]
  );
  return result.rows[0];
};

const getOrders = async () => {
  const result = await pool.query(`SELECT * FROM orders ORDER BY "createdAt" DESC`);
  return result.rows;
};

const getOrderById = async (id) => {
  const result = await pool.query(`SELECT * FROM orders WHERE id = $1`, [id]);
  return result.rows[0];
};

const getOrdersByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM orders WHERE "userId" = $1 ORDER BY "createdAt" DESC`, 
    [userId]
  );
  return result.rows;
};

const updateOrderStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE orders SET status = $2, "updatedAt" = CURRENT_TIMESTAMP 
     WHERE id = $1 RETURNING *`,
    [id, status]
  );
  return result.rows[0];
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus
};
