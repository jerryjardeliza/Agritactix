import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useStore from '../store/useStore';

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useStore();
  const [lesson, setLesson] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [msg, setMsg] = useState('');
  const startTime = useRef(Date.now());

  useEffect(() => {
    api.get(`/lessons/${id}`).then((r) => setLesson(r.data));
    api.get(`/quizzes?lessonId=${id}`).then((r) => { if (r.data[0]) setQuiz(r.data[0]); });
  }, [id]);

  const handleComplete = async () => {
    const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
    const { data } = await api.post(`/lessons/${id}/complete`, { timeSpent });
    setCompleted(true);
    setMsg(data.pointsEarned > 0 ? `+${data.pointsEarned} points earned!` : 'Already completed.');
    refreshUser();
  };

  if (!lesson) return <div className="page flex-center" style={{ minHeight: '60vh' }}>Loading...</div>;

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <button onClick={() => navigate('/lessons')} style={styles.back}>← Back to Lessons</button>
      <div className="card" style={styles.header}>
        <span className="badge">Level {lesson.level}</span>
        <h1 style={styles.title}>{lesson.title}</h1>
        <p style={styles.topic}>{lesson.topic.replace('_', ' ')} · ⭐ {lesson.pointsReward} pts</p>
      </div>

      <div className="card" style={styles.content}>
        {/* Render content as plain text; in production use a markdown renderer */}
        <div style={styles.contentText}>{lesson.content}</div>
      </div>

      <div style={styles.actions}>
        {!completed ? (
          <button className="btn-primary" onClick={handleComplete} style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
            ✅ Mark as Complete
          </button>
        ) : (
          <p style={styles.successMsg}>🎉 {msg}</p>
        )}
        {quiz && (
          <button className="btn-gold" onClick={() => navigate(`/quiz/${quiz._id}`)} style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
            📝 Take Quiz
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  back: { background: 'transparent', color: '#a5d6a7', fontSize: '0.9rem', padding: '0.4rem 0', marginBottom: '1rem' },
  header: { marginBottom: '1rem' },
  title: { fontSize: '1.3rem', fontWeight: 700, margin: '0.5rem 0' },
  topic: { opacity: 0.6, fontSize: '0.85rem', textTransform: 'capitalize' },
  content: { lineHeight: 1.8, fontSize: '1rem' },
  contentText: { whiteSpace: 'pre-wrap' },
  actions: { display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' },
  successMsg: { color: '#a5d6a7', fontSize: '1rem', padding: '0.8rem 0' },
};
