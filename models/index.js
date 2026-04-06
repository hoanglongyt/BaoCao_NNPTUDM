'use strict';

const fs = require('fs');
const path = require('path');
const sequelize = require('../utils/sequelize');
const basename = path.basename(__filename);
const modelFiles = {};

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') > 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const DataTypes = require('sequelize').DataTypes;
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    modelFiles[model.name] = model;
  });

Object.keys(modelFiles).forEach(modelName => {
  if (modelFiles[modelName].associate) {
    modelFiles[modelName].associate(modelFiles);
  }
});

module.exports = modelFiles;
module.exports.sequelize = sequelize;
