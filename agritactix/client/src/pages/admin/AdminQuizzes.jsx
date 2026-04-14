import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const EMPTY_Q = { question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' };
const EMPTY_QUIZ = { title: '', lessonId: '', passingScore: 70, pointsReward: 100, isPublished: false, questions: [{ ...EMPTY_Q }] };

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState(EMPTY_QUIZ);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => Promise.all([api.get('/quizzes'), api.get('/lessons')]).then(([q, l]) => { setQuizzes(q.data); setLessons(l.data); });
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (editing) await api.put(`/quizzes/${editing}`, form);
    else await api.post('/quizzes', form);
    setForm(EMPTY_QUIZ); setEditing(null); setShowForm(false); load();
  };

  const del = async (id) => { if (confirm('Delete quiz?')) { await api.delete(`/quizzes/${id}`); load(); } };

  const edit = (quiz) => {
    setForm({ title: quiz.title, lessonId: quiz.lessonId?._id || quiz.lessonId, passingScore: quiz.passingScore, pointsReward: quiz.pointsReward, isPublished: quiz.isPublished, questions: quiz.questions });
    setEditing(quiz._id); setShowForm(true);
  };

  const setQ = (i, field, val) => {
    const qs = [...form.questions];
    qs[i] = { ...qs[i], [field]: val };
    setForm({ ...form, questions: qs });
  };

  const setOpt = (qi, oi, val) => {
    const qs = [...form.questions];
    const opts = [...qs[qi].options];
    opts[oi] = val;
    qs[qi] = { ...qs[qi], options: opts };
    setForm({ ...form, questions: qs });
  };

  const addQ = () => setForm({ ...form, questions: [...form.questions, { ...EMPTY_Q, options: ['', '', '', ''] }] });
  const removeQ = (i) => setForm({ ...form, questions: form.questions.filter((_, idx) => idx !== i) });

  return (
    <div className="page">
      <div style={styles.topBar}>
        <h2 style={styles.heading}>📝 Manage Quizzes</h2>
        <button className="btn-primary" onClick={() => { setForm(EMPTY_QUIZ); setEditing(null); setShowForm(true); }}>+ New Quiz</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>{editing ? 'Edit Quiz' : 'New Quiz'}</h3>
          <form onSubmit={save} style={styles.form}>
            <input placeholder="Quiz Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <select value={form.lessonId} onChange={(e) => setForm({ ...form, lessonId: e.target.value })} required>
              <option value="">Select Lesson</option>
              {lessons.map((l) => <option key={l._id} value={l._id}>{l.title}</option>)}
            </select>
            <div style={styles.row}>
              <label>Passing Score (%) <input type="number" min={0} max={100} value={form.passingScore} onChange={(e) => setForm({ ...form, passingScore: +e.target.value })} style={{ width: 70 }} /></label>
              <label>Points <input type="number" min={0} value={form.pointsReward} onChange={(e) => setForm({ ...form, pointsReward: +e.target.value })} style={{ width: 80 }} /></label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} style={{ width: 'auto' }} />
                Published
              </label>
            </div>

            <h4 style={{ marginTop: '0.5rem' }}>Questions</h4>
            {form.questions.map((q, qi) => (
              <div key={qi} style={styles.questionBlock}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.85rem' }}>Q{qi + 1}</strong>
                  {form.questions.length > 1 && <button type="button" className="btn-danger" onClick={() => removeQ(qi)} style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>Remove</button>}
                </div>
                <input placeholder="Question text" value={q.question} onChange={(e) => setQ(qi, 'question', e.target.value)} required />
                {q.options.map((opt, oi) => (
                  <div key={oi} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="radio" name={`correct-${qi}`} checked={q.correctIndex === oi} onChange={() => setQ(qi, 'correctIndex', oi)} style={{ width: 'auto', flexShrink: 0 }} />
                    <input placeholder={`Option ${String.fromCharCode(65 + oi)}`} value={opt} onChange={(e) => setOpt(qi, oi, e.target.value)} required />
                  </div>
                ))}
                <input placeholder="Explanation (optional)" value={q.explanation} onChange={(e) => setQ(qi, 'explanation', e.target.value)} />
              </div>
            ))}
            <button type="button" onClick={addQ} style={styles.addQBtn}>+ Add Question</button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn-primary">Save Quiz</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
        {quizzes.map((q) => (
          <div key={q._id} className="card" style={styles.quizRow}>
            <div>
              <strong>{q.title}</strong>
              <span style={{ opacity: 0.5, fontSize: '0.8rem', marginLeft: '0.5rem' }}>{q.questions?.length || 0} questions</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: q.isPublished ? '#4caf50' : '#ef9a9a' }}>{q.isPublished ? '● Published' : '○ Draft'}</span>
              <button className="btn-secondary" onClick={() => edit(q)} style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>Edit</button>
              <button className="btn-danger" onClick={() => del(q._id)} style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>Delete</button>
            </div>
          </div>
        ))}
        {quizzes.length === 0 && <p style={{ opacity: 0.5, textAlign: 'center', marginTop: '2rem' }}>No quizzes yet.</p>}
      </div>
    </div>
  );
}

const styles = {
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  heading: { fontFamily: "'Press Start 2P', monospace", fontSize: '0.85rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  row: { display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' },
  questionBlock: { background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  addQBtn: { background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem', fontSize: '0.85rem', borderRadius: 8 },
  quizRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' },
};
