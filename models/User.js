const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    lowercase: true
  },
  fullName: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  avatarUrl: {
    type: DataTypes.STRING,
    defaultValue: 'https://i.sstatic.net/l60Hf.png'
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Roles',
      key: 'id'
    }
  },
  loginCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 }
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lockTime: DataTypes.DATE,
  forgotPasswordToken: DataTypes.STRING,
  forgotPasswordTokenExp: DataTypes.DATE
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
  defaultScope: {
    where: { isDeleted: false }
  }
});

User.prototype.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
