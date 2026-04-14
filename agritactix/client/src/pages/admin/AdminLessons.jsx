import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const TOPICS = ['crop_management', 'soil_health', 'irrigation', 'pest_control', 'resource_management'];
const EMPTY = { title: '', topic: 'crop_management', content: '', level: 1, order: 0, pointsReward: 50, isPublished: false };

export default function AdminLessons() {
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/lessons').then((r) => setLessons(r.data));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (editing) await api.put(`/lessons/${editing}`, form);
    else await api.post('/lessons', form);
    setForm(EMPTY); setEditing(null); setShowForm(false); load();
  };

  const del = async (id) => { if (confirm('Delete this lesson?')) { await api.delete(`/lessons/${id}`); load(); } };

  const edit = (lesson) => { setForm({ ...lesson }); setEditing(lesson._id); setShowForm(true); };

  return (
    <div className="page">
      <div style={styles.topBar}>
        <h2 style={styles.heading}>📚 Manage Lessons</h2>
        <button className="btn-primary" onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }}>+ New Lesson</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>{editing ? 'Edit Lesson' : 'New Lesson'}</h3>
          <form onSubmit={save} style={styles.form}>
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
              {TOPICS.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
            </select>
            <textarea placeholder="Content (markdown supported)" rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            <div style={styles.row}>
              <label>Level <input type="number" min={1} value={form.level} onChange={(e) => setForm({ ...form, level: +e.target.value })} style={{ width: 70 }} /></label>
              <label>Points <input type="number" min={0} value={form.pointsReward} onChange={(e) => setForm({ ...form, pointsReward: +e.target.value })} style={{ width: 80 }} /></label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} style={{ width: 'auto' }} />
                Published
              </label>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
        {lessons.map((l) => (
          <div key={l._id} className="card" style={styles.lessonRow}>
            <div>
              <span className="badge" style={{ marginRight: '0.5rem' }}>Lv {l.level}</span>
              <strong>{l.title}</strong>
              <span style={{ opacity: 0.5, fontSize: '0.8rem', marginLeft: '0.5rem' }}>{l.topic.replace('_', ' ')}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: l.isPublished ? '#4caf50' : '#ef9a9a' }}>{l.isPublished ? '● Published' : '○ Draft'}</span>
              <button className="btn-secondary" onClick={() => edit(l)} style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>Edit</button>
              <button className="btn-danger" onClick={() => del(l._id)} style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>Delete</button>
            </div>
          </div>
        ))}
        {lessons.length === 0 && <p style={{ opacity: 0.5, textAlign: 'center', marginTop: '2rem' }}>No lessons yet. Create one above.</p>}
      </div>
    </div>
  );
}

const styles = {
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  heading: { fontFamily: "'Press Start 2P', monospace", fontSize: '0.85rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  row: { display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' },
  lessonRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' },
};
