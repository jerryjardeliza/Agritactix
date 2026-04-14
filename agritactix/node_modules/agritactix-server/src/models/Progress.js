const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Lesson = require('./Lesson');
const Quiz = require('./Quiz');

const Progress = sequelize.define('Progress', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  lessonId: { type: DataTypes.INTEGER, allowNull: true },
  quizId: { type: DataTypes.INTEGER, allowNull: true },
  type: { type: DataTypes.ENUM('lesson', 'quiz', 'simulation'), allowNull: false },
  score: { type: DataTypes.INTEGER, allowNull: true },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  timeSpent: { type: DataTypes.INTEGER, defaultValue: 0 },
  simulationData: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() { const v = this.getDataValue('simulationData'); return v ? JSON.parse(v) : null; },
    set(v) { this.setDataValue('simulationData', v ? JSON.stringify(v) : null); },
  },
}, { tableName: 'progress' });

Progress.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Progress.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' });
Progress.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });

module.exports = Progress;
