const router = require('express').Router();
const { fn, col, literal } = require('sequelize');
const User = require('../models/User');
const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/analytics', async (req, res) => {
  try {
    const [totalUsers, totalLessons, totalQuizzes, recentProgress, avgResult] = await Promise.all([
      User.count({ where: { role: 'player' } }),
      Lesson.count(),
      Quiz.count(),
      Progress.findAll({
        order: [['createdAt', 'DESC']], limit: 20,
        include: [
          { model: User, as: 'user', attributes: ['username'] },
          { model: Lesson, as: 'lesson', attributes: ['title'] },
          { model: Quiz, as: 'quiz', attributes: ['title'] },
        ],
      }),
      Progress.findAll({
        where: { type: 'quiz' },
        attributes: [[fn('AVG', col('score')), 'avg']],
        raw: true,
      }),
    ]);

    res.json({
      totalUsers, totalLessons, totalQuizzes,
      avgQuizScore: avgResult[0]?.avg ? parseFloat(avgResult[0].avg).toFixed(1) : 0,
      recentActivity: recentProgress,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/players', async (req, res) => {
  try {
    const players = await User.findAll({ where: { role: 'player' }, attributes: { exclude: ['password'] }, order: [['points', 'DESC']] });
    res.json(players);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/players/:id/progress', async (req, res) => {
  try {
    const progress = await Progress.findAll({
      where: { userId: req.params.id },
      include: [
        { model: Lesson, as: 'lesson', attributes: ['title', 'topic'] },
        { model: Quiz, as: 'quiz', attributes: ['title'] },
      ],
    });
    res.json(progress);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/players/:id/unlock', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { level, crop } = req.body;
    const levels = user.unlockedLevels;
    const crops = user.unlockedCrops;
    if (level && !levels.includes(level)) levels.push(level);
    if (crop && !crops.includes(crop)) crops.push(crop);
    await user.update({ unlockedLevels: levels, unlockedCrops: crops });
    const safe = user.toJSON();
    delete safe.password;
    res.json(safe);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
