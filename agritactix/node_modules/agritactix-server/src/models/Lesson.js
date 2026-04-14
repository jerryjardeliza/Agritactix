const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Lesson = sequelize.define('Lesson', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  topic: { type: DataTypes.ENUM('crop_management', 'soil_health', 'irrigation', 'pest_control', 'resource_management'), allowNull: false },
  content: { type: DataTypes.TEXT('long'), allowNull: false },
  level: { type: DataTypes.INTEGER, defaultValue: 1 },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  pointsReward: { type: DataTypes.INTEGER, defaultValue: 50 },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'lessons' });

module.exports = Lesson;
