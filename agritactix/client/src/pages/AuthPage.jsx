import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useStore();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.username, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.overlay}>
        <h1 style={styles.title}>🌾 AgriTactix</h1>
        <p style={styles.sub}>Learn. Grow. Harvest.</p>
        <div className="card" style={styles.card}>
          <div style={styles.tabs}>
            {['login', 'register'].map((m) => (
              <button key={m} onClick={() => setMode(m)} style={{ ...styles.tab, ...(mode === m ? styles.tabActive : {}) }}>
                {m === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>
          <form onSubmit={handle} style={styles.form}>
            {mode === 'register' && (
              <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
            )}
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
              {loading ? 'Loading...' : mode === 'login' ? 'Enter Farm' : 'Start Journey'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  bg: { minHeight: '100vh', background: 'linear-gradient(135deg, #1a4a1a 0%, #2d5a1b 50%, #1a3a0a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  overlay: { textAlign: 'center', width: '100%', maxWidth: 420, padding: '1rem' },
  title: { fontSize: '1.4rem', color: '#4caf50', marginBottom: '0.5rem' },
  sub: { color: '#a5d6a7', marginBottom: '2rem', fontSize: '1rem' },
  card: { textAlign: 'left' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  tab: { flex: 1, background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '0.6rem' },
  tabActive: { background: '#4caf50' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  error: { color: '#ef9a9a', fontSize: '0.85rem' },
};
