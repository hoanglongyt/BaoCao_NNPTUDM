const pool = require("../utils/postgres");

const createMessage = async (fromId, toId, text, type = 'text') => {
  const result = await pool.query(
    `INSERT INTO messages ("fromId", "toId", type, text) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [fromId, toId, type, text]
  );
  return result.rows[0];
};

const getMessagesByUser = async (toId, limit = 50) => {
  const result = await pool.query(
    `SELECT m.*, u1.username as "fromUsername", u2.username as "toUsername"
     FROM messages m
     JOIN users u1 ON m."fromId" = u1.id
     JOIN users u2 ON m."toId" = u2.id
     WHERE m."toId" = $1 OR m."fromId" = $1
     ORDER BY m."createdAt" DESC
     LIMIT $2`,
    [toId, limit]
  );
  return result.rows;
};

const getConversation = async (user1Id, user2Id, limit = 50) => {
  const result = await pool.query(
    `SELECT * FROM messages 
     WHERE ("fromId" = $1 AND "toId" = $2) OR ("fromId" = $2 AND "toId" = $1)
     ORDER BY "createdAt" ASC
     LIMIT $3`,
    [user1Id, user2Id, limit]
  );
  return result.rows;
};

module.exports = {
  createMessage,
  getMessagesByUser,
  getConversation
};
