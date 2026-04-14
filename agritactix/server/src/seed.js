require('dotenv').config();
const sequelize = require('./db');
require('./models/Lesson');
require('./models/Quiz');
const User = require('./models/User');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');

const LESSONS = [
  { title: 'Introduction to Crop Management', topic: 'crop_management', level: 1, order: 1, pointsReward: 50, isPublished: true, content: `Crop management is the practice of growing and nurturing crops to maximize yield and quality.\n\nKey principles:\n- Crop rotation: Alternating crops each season to maintain soil health\n- Planting density: Spacing plants correctly for optimal growth\n- Harvest timing: Picking crops at peak ripeness\n\nCrop rotation prevents soil depletion and reduces pest buildup. A common rotation is: Legumes → Cereals → Root vegetables → Fallow.` },
  { title: 'Soil Health Fundamentals', topic: 'soil_health', level: 1, order: 2, pointsReward: 50, isPublished: true, content: `Healthy soil is the foundation of successful farming.\n\nSoil composition:\n- 45% minerals\n- 25% water\n- 25% air\n- 5% organic matter\n\nKey indicators of healthy soil:\n- pH between 6.0–7.0 for most crops\n- Rich in earthworms and microorganisms\n- Good water retention and drainage\n\nImproving soil health:\n- Add compost and organic matter\n- Avoid over-tilling\n- Use cover crops during off-seasons` },
  { title: 'Irrigation Techniques', topic: 'irrigation', level: 1, order: 3, pointsReward: 50, isPublished: true, content: `Water management is critical for crop survival and yield.\n\nIrrigation methods:\n1. Drip irrigation: Water delivered directly to roots — most efficient (90% efficiency)\n2. Sprinkler systems: Mimics rainfall — good for large fields\n3. Flood irrigation: Traditional method — low cost but high water waste\n4. Furrow irrigation: Water flows along crop rows\n\nBest practices:\n- Water in the early morning to reduce evaporation\n- Monitor soil moisture before irrigating\n- Use mulch to retain soil moisture` },
  { title: 'Pest Control Strategies', topic: 'pest_control', level: 2, order: 1, pointsReward: 75, isPublished: true, content: `Pests can devastate crops if not managed properly.\n\nIntegrated Pest Management (IPM):\n1. Prevention: Crop rotation, resistant varieties\n2. Monitoring: Regular field scouting\n3. Biological control: Introduce natural predators (ladybugs for aphids)\n4. Chemical control: Use pesticides as a last resort\n\nCommon pests:\n- Aphids: Suck plant sap, spread viruses\n- Caterpillars: Eat leaves and stems\n- Nematodes: Attack roots underground\n\nOrganic options: Neem oil, diatomaceous earth, companion planting` },
  { title: 'Resource Management on the Farm', topic: 'resource_management', level: 2, order: 2, pointsReward: 75, isPublished: true, content: `Efficient resource management ensures farm profitability and sustainability.\n\nKey resources to manage:\n- Water: Use drip irrigation, collect rainwater\n- Energy: Solar panels, efficient machinery\n- Labor: Plan tasks seasonally, use automation where possible\n- Finances: Track input costs vs. crop revenue\n\nSustainability practices:\n- Reduce chemical inputs\n- Compost farm waste\n- Maintain biodiversity with hedgerows and wildflower strips\n- Keep detailed farm records for planning` },
];

async function seed() {
  await sequelize.sync({ force: true }); // drops & recreates tables
  console.log('Tables created');

  await User.create({ username: 'Admin', email: 'admin@agritactix.com', password: 'admin123', role: 'admin', unlockedLevels: [1, 2, 3] });
  await User.create({ username: 'FarmerJoe', email: 'player@agritactix.com', password: 'player123', role: 'player', unlockedLevels: [1] });
  console.log('Users created');

  const lessons = await Lesson.bulkCreate(LESSONS);
  console.log(`${lessons.length} lessons created`);

  await Quiz.bulkCreate([
    {
      lessonId: lessons[0].id, title: 'Crop Management Quiz', passingScore: 70, pointsReward: 100, isPublished: true,
      questions: [
        { question: 'What is crop rotation?', options: ['Growing the same crop every year', 'Alternating crops each season', 'Rotating irrigation systems', 'Changing farm ownership'], correctIndex: 1, explanation: 'Crop rotation alternates crops each season to maintain soil health and reduce pests.' },
        { question: 'What is the main benefit of crop rotation?', options: ['Increases water usage', 'Reduces soil depletion and pest buildup', 'Requires more fertilizer', 'Decreases yield'], correctIndex: 1, explanation: 'Rotating crops prevents soil nutrient depletion and breaks pest cycles.' },
        { question: 'When should you harvest crops?', options: ['As early as possible', 'At peak ripeness', 'After the first frost', 'When leaves turn yellow'], correctIndex: 1, explanation: 'Harvesting at peak ripeness ensures maximum quality and yield.' },
      ],
    },
    {
      lessonId: lessons[1].id, title: 'Soil Health Quiz', passingScore: 70, pointsReward: 100, isPublished: true,
      questions: [
        { question: 'What is the ideal soil pH for most crops?', options: ['4.0–5.0', '6.0–7.0', '8.0–9.0', '3.0–4.0'], correctIndex: 1, explanation: 'Most crops thrive in slightly acidic to neutral soil (pH 6.0–7.0).' },
        { question: 'What percentage of healthy soil is organic matter?', options: ['25%', '45%', '5%', '15%'], correctIndex: 2, explanation: 'Organic matter makes up about 5% of healthy soil but is crucial for fertility.' },
        { question: 'Which practice helps improve soil health?', options: ['Over-tilling', 'Adding compost', 'Using only chemical fertilizers', 'Removing all earthworms'], correctIndex: 1, explanation: 'Compost adds organic matter and beneficial microorganisms to soil.' },
      ],
    },
    {
      lessonId: lessons[2].id, title: 'Irrigation Techniques Quiz', passingScore: 70, pointsReward: 100, isPublished: true,
      questions: [
        { question: 'Which irrigation method is most water-efficient?', options: ['Flood irrigation', 'Furrow irrigation', 'Drip irrigation', 'Sprinkler systems'], correctIndex: 2, explanation: 'Drip irrigation delivers water directly to roots with ~90% efficiency.' },
        { question: 'When is the best time to water crops?', options: ['Midday', 'Late evening', 'Early morning', 'During rain'], correctIndex: 2, explanation: 'Early morning watering reduces evaporation and fungal disease risk.' },
        { question: 'What does mulch help with?', options: ['Increasing pests', 'Retaining soil moisture', 'Reducing soil nutrients', 'Blocking sunlight completely'], correctIndex: 1, explanation: 'Mulch reduces evaporation and helps maintain consistent soil moisture.' },
      ],
    },
  ]);
  console.log('Quizzes created');

  console.log('\n✅ Seed complete!');
  console.log('Admin: admin@agritactix.com / admin123');
  console.log('Player: player@agritactix.com / player123');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
