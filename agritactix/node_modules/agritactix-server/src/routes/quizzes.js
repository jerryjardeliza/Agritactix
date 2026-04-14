const router = require('express').Router();
const Quiz = require('../models/Quiz');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const where = { isPublished: true };
    if (req.query.lessonId) where.lessonId = req.query.lessonId;
    const quizzes = await Quiz.findAll({ where, include: [{ model: Lesson, as: 'lesson', attributes: ['title', 'topic'] }] });
    res.json(quizzes);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, { include: [{ model: Lesson, as: 'lesson', attributes: ['title', 'topic'] }] });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    if (req.user.role !== 'admin') {
      const safe = quiz.toJSON();
      safe.questions = safe.questions.map(({ question, options, explanation }) => ({ question, options, explanation }));
      return res.json(safe);
    }
    res.json(quiz);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/submit', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const { answers } = req.body;
    const questions = quiz.questions;
    let correct = 0;
    const feedback = questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctIndex;
      if (isCorrect) correct++;
      return { question: q.question, selected: answers[i], correctIndex: q.correctIndex, isCorrect, explanation: q.explanation };
    });

    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= quiz.passingScore;

    const existing = await Progress.findOne({ where: { userId: req.user.id, quizId: quiz.id, type: 'quiz' } });
    let pointsEarned = 0;

    if (!existing) {
      await Progress.create({ userId: req.user.id, quizId: quiz.id, type: 'quiz', score, completed: passed, timeSpent: req.body.timeSpent || 0 });
      if (passed) {
        pointsEarned = quiz.pointsReward;
        await User.increment('points', { by: pointsEarned, where: { id: req.user.id } });
        // Add badge
        const user = await User.findByPk(req.user.id);
        const badges = user.badges;
        const badge = `quiz_master_${quiz.id}`;
        if (!badges.includes(badge)) {
          badges.push(badge);
          await user.update({ badges });
        }
      }
    } else if (score > (existing.score || 0)) {
      await existing.update({ score, completed: passed });
    }

    res.json({ score, passed, correct, total: questions.length, feedback, pointsEarned });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try { res.status(201).json(await Quiz.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Not found' });
    await quiz.update(req.body);
    res.json(quiz);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Quiz.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Quiz deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
