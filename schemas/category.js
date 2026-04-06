const pool = require("../utils/postgres");

const createCategory = async (name, slug, description, image) => {
  const result = await pool.query(
    `INSERT INTO categories (name, slug, description, image) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, slug, description || '', image || '']
  );
  return result.rows[0];
};

const getCategories = async () => {
  const result = await pool.query(
    `SELECT * FROM categories WHERE "isDeleted" = false`
  );
  return result.rows;
};

const getCategoryById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM categories WHERE id = $1 AND "isDeleted" = false`,
    [id]
  );
  return result.rows[0];
};

const getCategoryBySlug = async (slug) => {
  const result = await pool.query(
    `SELECT * FROM categories WHERE slug = $1 AND "isDeleted" = false`,
    [slug]
  );
  return result.rows[0];
};

const updateCategory = async (id, data) => {
  const fields = [];
  const values = [];
  let index = 1;
  
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
  }
  values.unshift(id);
  
  const result = await pool.query(
    `UPDATE categories SET ${fields.join(', ')}, "updatedAt" = CURRENT_TIMESTAMP 
     WHERE id = $1 AND "isDeleted" = false RETURNING *`,
    values
  );
  return result.rows[0];
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory
};
