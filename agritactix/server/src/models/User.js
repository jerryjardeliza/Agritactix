const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('player', 'admin'), defaultValue: 'player' },
  points: { type: DataTypes.INTEGER, defaultValue: 0 },
  badges: { type: DataTypes.TEXT, defaultValue: '[]', get() { return JSON.parse(this.getDataValue('badges') || '[]'); }, set(v) { this.setDataValue('badges', JSON.stringify(v)); } },
  unlockedLevels: { type: DataTypes.TEXT, defaultValue: '[1]', get() { return JSON.parse(this.getDataValue('unlockedLevels') || '[1]'); }, set(v) { this.setDataValue('unlockedLevels', JSON.stringify(v)); } },
  unlockedCrops: { type: DataTypes.TEXT, defaultValue: '[]', get() { return JSON.parse(this.getDataValue('unlockedCrops') || '[]'); }, set(v) { this.setDataValue('unlockedCrops', JSON.stringify(v)); } },
}, { tableName: 'users' });

User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.prototype.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = User;
