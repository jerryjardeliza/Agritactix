const router = require('express').Router();
const { Op } = require('sequelize');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const lessons = await Lesson.findAll({ where: { isPublished: true }, order: [['level', 'ASC'], ['order', 'ASC']] });
    res.json(lessons);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json(lesson);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/complete', protect, async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    const [, created] = await Progress.findOrCreate({
      where: { userId: req.user.id, lessonId: lesson.id, type: 'lesson' },
      defaults: { completed: true, timeSpent: req.body.timeSpent || 0 },
    });
    if (created) await User.increment('points', { by: lesson.pointsReward, where: { id: req.user.id } });
    res.json({ message: 'Lesson completed', pointsEarned: created ? lesson.pointsReward : 0 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin CRUD
router.post('/', protect, adminOnly, async (req, res) => {
  try { res.status(201).json(await Lesson.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Not found' });
    await lesson.update(req.body);
    res.json(lesson);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Lesson.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Lesson deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
