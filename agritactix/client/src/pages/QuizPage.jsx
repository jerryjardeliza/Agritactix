import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useStore from '../store/useStore';

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useStore();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    api.get(`/quizzes/${id}`).then((r) => {
      setQuiz(r.data);
      setAnswers(new Array(r.data.questions.length).fill(null));
    });
  }, [id]);

  const select = (optIdx) => {
    const updated = [...answers];
    updated[current] = optIdx;
    setAnswers(updated);
  };

  const submit = async () => {
    const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
    const { data } = await api.post(`/quizzes/${id}/submit`, { answers, timeSpent });
    setResult(data);
    setSubmitted(true);
    refreshUser();
  };

  if (!quiz) return <div className="page flex-center" style={{ minHeight: '60vh' }}>Loading quiz...</div>;

  if (submitted && result) return <QuizResult result={result} quiz={quiz} onBack={() => navigate('/lessons')} />;

  const q = quiz.questions[current];
  const progress = ((current + 1) / quiz.questions.length) * 100;

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <button onClick={() => navigate('/lessons')} style={styles.back}>← Back</button>
      <h2 style={styles.quizTitle}>{quiz.title}</h2>

      <div style={styles.progressWrap}>
        <span style={styles.progressLabel}>Question {current + 1} / {quiz.questions.length}</span>
        <div className="progress-bar-wrap" style={{ flex: 1 }}>
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="card" style={styles.questionCard}>
        <p style={styles.questionText}>{q.question}</p>
        <div style={styles.options}>
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => select(i)} style={{ ...styles.option, ...(answers[current] === i ? styles.optionSelected : {}) }}>
              <span style={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.nav}>
        <button onClick={() => setCurrent((c) => c - 1)} disabled={current === 0} style={styles.navBtn}>← Prev</button>
        {current < quiz.questions.length - 1 ? (
          <button className="btn-primary" onClick={() => setCurrent((c) => c + 1)} disabled={answers[current] === null}>
            Next →
          </button>
        ) : (
          <button className="btn-gold" onClick={submit} disabled={answers.includes(null)}>
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}

function QuizResult({ result, quiz, onBack }) {
  const passed = result.passed;
  return (
    <div className="page" style={{ maxWidth: 700, textAlign: 'center' }}>
      <div className="card" style={styles.resultCard}>
        <div style={{ fontSize: '4rem' }}>{passed ? '🏆' : '📖'}</div>
        <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.9rem', margin: '1rem 0', color: passed ? '#4caf50' : '#ef9a9a' }}>
          {passed ? 'Passed!' : 'Keep Practicing!'}
        </h2>
        <p style={{ fontSize: '2rem', fontWeight: 700 }}>{result.score}%</p>
        <p style={{ opacity: 0.7, marginBottom: '1rem' }}>{result.correct} / {result.total} correct</p>
        {result.pointsEarned > 0 && <p style={{ color: '#ffc107' }}>+{result.pointsEarned} points earned!</p>}
      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
        <h3 style={{ marginBottom: '1rem', opacity: 0.8 }}>Review Answers</h3>
        {result.feedback.map((f, i) => (
          <div key={i} className="card" style={{ ...styles.feedbackCard, borderLeft: `4px solid ${f.isCorrect ? '#4caf50' : '#e53935'}` }}>
            <p style={{ fontWeight: 600 }}>{i + 1}. {f.question}</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.4rem', color: f.isCorrect ? '#a5d6a7' : '#ef9a9a' }}>
              {f.isCorrect ? '✅ Correct' : `❌ Your answer: ${f.selected !== null ? String.fromCharCode(65 + f.selected) : 'None'} · Correct: ${String.fromCharCode(65 + f.correctIndex)}`}
            </p>
            {f.explanation && <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.3rem' }}>{f.explanation}</p>}
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={onBack} style={{ marginTop: '1.5rem', padding: '0.8rem 2rem' }}>
        Back to Lessons
      </button>
    </div>
  );
}

const styles = {
  back: { background: 'transparent', color: '#a5d6a7', fontSize: '0.9rem', padding: '0.4rem 0', marginBottom: '1rem' },
  quizTitle: { fontFamily: "'Press Start 2P', monospace", fontSize: '0.85rem', marginBottom: '1.2rem' },
  progressWrap: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  progressLabel: { fontSize: '0.8rem', opacity: 0.7, whiteSpace: 'nowrap' },
  questionCard: { marginBottom: '1.5rem' },
  questionText: { fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.2rem', lineHeight: 1.6 },
  options: { display: 'flex', flexDirection: 'column', gap: '0.7rem' },
  option: { background: 'rgba(255,255,255,0.08)', color: '#f9fbe7', textAlign: 'left', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '0.8rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 },
  optionSelected: { background: 'rgba(76,175,80,0.3)', border: '1px solid #4caf50' },
  optionLetter: { background: 'rgba(255,255,255,0.15)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem', fontWeight: 700 },
  nav: { display: 'flex', justifyContent: 'space-between' },
  navBtn: { background: 'rgba(255,255,255,0.1)', color: '#fff' },
  resultCard: { textAlign: 'center', padding: '2rem' },
  feedbackCard: { marginBottom: '0.8rem' },
};
