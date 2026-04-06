const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: ['https://i.imgur.com/R3iobJA.jpeg']
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id'
    }
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'products',
  timestamps: true,
  defaultScope: {
    where: { isDeleted: false }
  }
});

module.exports = Product;
