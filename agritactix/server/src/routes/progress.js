const router = require('express').Router();
const Progress = require('../models/Progress');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const { protect } = require('../middleware/auth');

router.get('/me', protect, async (req, res) => {
  try {
    const progress = await Progress.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Lesson, as: 'lesson', attributes: ['title', 'topic', 'level'] },
        { model: Quiz, as: 'quiz', attributes: ['title'] },
      ],
    });
    const user = await User.findByPk(req.user.id);
    res.json({ progress, stats: { points: user.points, badges: user.badges, unlockedLevels: user.unlockedLevels, unlockedCrops: user.unlockedCrops } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/simulation', protect, async (req, res) => {
  try {
    const { simulationData, timeSpent } = req.body;
    const entry = await Progress.create({ userId: req.user.id, type: 'simulation', completed: true, timeSpent, simulationData });
    await User.increment('points', { by: 25, where: { id: req.user.id } });
    res.status(201).json({ entry, pointsEarned: 25 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
