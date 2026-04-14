const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Lesson = require('./Lesson');

const Quiz = sequelize.define('Quiz', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  lessonId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'lessons', key: 'id' } },
  title: { type: DataTypes.STRING, allowNull: false },
  // questions stored as JSON text: [{question, options:[], correctIndex, explanation}]
  questions: {
    type: DataTypes.TEXT('long'),
    defaultValue: '[]',
    get() { return JSON.parse(this.getDataValue('questions') || '[]'); },
    set(v) { this.setDataValue('questions', JSON.stringify(v)); },
  },
  passingScore: { type: DataTypes.INTEGER, defaultValue: 70 },
  pointsReward: { type: DataTypes.INTEGER, defaultValue: 100 },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'quizzes' });

Quiz.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' });
Lesson.hasMany(Quiz, { foreignKey: 'lessonId', as: 'quizzes' });

module.exports = Quiz;
