const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  tableName: 'carts',
  timestamps: true
});

module.exports = Cart;
