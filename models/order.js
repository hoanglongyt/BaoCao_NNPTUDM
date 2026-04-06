const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'created'
  }
}, {
  tableName: 'orders',
  timestamps: true
});

module.exports = Order;
