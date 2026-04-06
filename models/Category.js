const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    unique: true
  },
  description: DataTypes.TEXT,
  image: DataTypes.STRING,
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'categories',
  timestamps: true,
  defaultScope: {
    where: { isDeleted: false }
  }
});

module.exports = Category;
