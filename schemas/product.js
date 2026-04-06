const pool = require("../utils/postgres");

const createProduct = async (sku, title, slug, price, description, images, categoryId) => {
  const result = await pool.query(
    `INSERT INTO products (sku, title, slug, price, description, images, "categoryId") 
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [sku, title, slug, price, description || '', images || ['https://i.imgur.com/R3iobJA.jpeg'], categoryId]
  );
  return result.rows[0];
};

const getProducts = async () => {
  const result = await pool.query(
    `SELECT p.*, c.name as "categoryName" 
     FROM products p 
     LEFT JOIN categories c ON p."categoryId" = c.id 
     WHERE p."isDeleted" = false`
  );
  return result.rows;
};

const getProductById = async (id) => {
  const result = await pool.query(
    `SELECT p.*, c.name as "categoryName" 
     FROM products p 
     LEFT JOIN categories c ON p."categoryId" = c.id 
     WHERE p.id = $1 AND p."isDeleted" = false`,
    [id]
  );
  return result.rows[0];
};

const getProductsByCategory = async (categoryId) => {
  const result = await pool.query(
    `SELECT * FROM products WHERE "categoryId" = $1 AND "isDeleted" = false`,
    [categoryId]
  );
  return result.rows;
};

const updateProduct = async (id, data) => {
  const fields = [];
  const values = [];
  let index = 1;
  
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) {
      fields.push(`${key === 'categoryId' ? '"categoryId"' : key} = $${index}`);
      values.push(value);
      index++;
    }
  }
  values.unshift(id);
  
  const result = await pool.query(
    `UPDATE products SET ${fields.join(', ')}, "updatedAt" = CURRENT_TIMESTAMP 
     WHERE id = $1 AND "isDeleted" = false RETURNING *`,
    values
  );
  return result.rows[0];
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getProductsByCategory,
  updateProduct
};
