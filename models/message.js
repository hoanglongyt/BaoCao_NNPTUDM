const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fromId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  toId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('text', 'file'),
    defaultValue: 'text'
  },
  text: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'messages',
  timestamps: true
});

module.exports = Message;
