const pool = require("../utils/postgres");

const createCart = async (userId) => {
  const result = await pool.query(
    `INSERT INTO carts ("userId") VALUES ($1) RETURNING *`,
    [userId]
  );
  return result.rows[0];
};

const getCartByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT c.*, 
     json_agg(json_build_object('id', ci.id, 'productId', ci."productId", 'quantity', ci.quantity, 
                               'price', p.price, 'title', p.title)) as items
     FROM carts c
     LEFT JOIN "CartItems" ci ON c.id = ci."cartId"
     LEFT JOIN products p ON ci."productId" = p.id
     WHERE c."userId" = $1
     GROUP BY c.id`,
    [userId]
  );
  return result.rows[0];
};

const addToCart = async (userId, productId, quantity = 1) => {
  // Tạo cart nếu chưa có
  let cartResult = await pool.query(`SELECT id FROM carts WHERE "userId" = $1`, [userId]);
  let cartId;
  if (cartResult.rows.length === 0) {
    const newCart = await createCart(userId);
    cartId = newCart.id;
  } else {
    cartId = cartResult.rows[0].id;
  }
  
  // Upsert cart item
  const result = await pool.query(
    `INSERT INTO "CartItems" ("cartId", "productId", quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT ("cartId", "productId") 
     DO UPDATE SET quantity = "CartItems".quantity + $3
     RETURNING *`,
    [cartId, productId, quantity]
  );
  return result.rows[0];
};

const updateCartItem = async (cartId, productId, quantity) => {
  const result = await pool.query(
    `UPDATE "CartItems" 
     SET quantity = $3 
     WHERE "cartId" = $1 AND "productId" = $2 
     RETURNING *`,
    [cartId, productId, quantity]
  );
  return result.rows[0];
};

const removeFromCart = async (cartId, productId) => {
  const result = await pool.query(
    `DELETE FROM "CartItems" 
     WHERE "cartId" = $1 AND "productId" = $2 
     RETURNING *`,
    [cartId, productId]
  );
  return result.rows[0];
};

module.exports = {
  createCart,
  getCartByUserId,
  addToCart,
  updateCartItem,
  removeFromCart
};
