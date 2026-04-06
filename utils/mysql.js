const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'nnptud_c4',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT ? parseInt(process.env.DB_CONNECTION_LIMIT) : 10,
  queueLimit: 0
});

// quick test connection
pool.getConnection()
  .then(conn => { console.log('MySQL pool connected'); conn.release(); })
  .catch(err => { console.error('MySQL connection error:', err.message || err); });

module.exports = pool;
