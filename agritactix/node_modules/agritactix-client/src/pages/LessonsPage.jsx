import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const TOPIC_COLORS = {
  crop_management: '#4caf50',
  soil_health: '#795548',
  irrigation: '#1e88e5',
  pest_control: '#e53935',
  resource_management: '#ffc107',
};

const TOPIC_ICONS = {
  crop_management: '🌱',
  soil_health: '🪱',
  irrigation: '💧',
  pest_control: '🐛',
  resource_management: '⚙️',
};

export default function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get('/lessons'), api.get('/quizzes')]).then(([l, q]) => {
      setLessons(l.data);
      setQuizzes(q.data);
      setLoading(false);
    });
  }, []);

  const topics = ['all', ...new Set(lessons.map((l) => l.topic))];
  const filtered = filter === 'all' ? lessons : lessons.filter((l) => l.topic === filter);

  const getQuiz = (lessonId) => quizzes.find((q) => q.lessonId?._id === lessonId || q.lessonId === lessonId);

  if (loading) return <div className="page flex-center" style={{ minHeight: '60vh' }}>Loading lessons...</div>;

  return (
    <div className="page">
      <h2 style={styles.heading}>📚 Learning Modules</h2>

      <div style={styles.filters}>
        {topics.map((t) => (
          <button key={t} onClick={() => setFilter(t)} style={{ ...styles.filterBtn, ...(filter === t ? styles.filterActive : {}) }}>
            {t === 'all' ? '🌾 All' : `${TOPIC_ICONS[t] || ''} ${t.replace('_', ' ')}`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ opacity: 0.6, textAlign: 'center', marginTop: '3rem' }}>No lessons available yet.</p>
      ) : (
        <div className="grid-2">
          {filtered.map((lesson) => {
            const quiz = getQuiz(lesson._id);
            const color = TOPIC_COLORS[lesson.topic] || '#4caf50';
            return (
              <div key={lesson._id} className="card" style={{ ...styles.card, borderLeft: `4px solid ${color}` }}>
                <div style={styles.cardTop}>
                  <span style={{ fontSize: '2rem' }}>{TOPIC_ICONS[lesson.topic] || '📖'}</span>
                  <span className="badge" style={{ background: color }}>Level {lesson.level}</span>
                </div>
                <h3 style={styles.cardTitle}>{lesson.title}</h3>
                <p style={styles.cardTopic}>{lesson.topic.replace('_', ' ')}</p>
                <p style={styles.cardPoints}>⭐ +{lesson.pointsReward} pts</p>
                <div style={styles.cardActions}>
                  <button className="btn-primary" onClick={() => navigate(`/lessons/${lesson._id}`)}>
                    Start Lesson
                  </button>
                  {quiz && (
                    <button className="btn-secondary" onClick={() => navigate(`/quiz/${quiz._id}`)}>
                      Take Quiz
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  heading: { fontFamily: "'Press Start 2P', monospace", fontSize: '0.9rem', marginBottom: '1.5rem' },
  filters: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' },
  filterBtn: { background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: 20 },
  filterActive: { background: '#4caf50' },
  card: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: '1rem', fontWeight: 700 },
  cardTopic: { fontSize: '0.8rem', opacity: 0.6, textTransform: 'capitalize' },
  cardPoints: { fontSize: '0.85rem', color: '#ffc107' },
  cardActions: { display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' },
};
