import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const MENU_ITEMS = [
  { icon: '📚', label: 'Lessons Mode', desc: 'Structured agricultural topics', path: '/lessons', color: '#2d7a2d' },
  { icon: '📝', label: 'Quiz Mode', desc: 'Test your knowledge', path: '/lessons', color: '#795548' },
  { icon: '🌍', label: '3D Simulation', desc: 'Immersive farming experience', path: '/simulation', color: '#1565c0' },
];

export default function MainMenu() {
  const user = useStore((s) => s.user);
  const navigate = useNavigate();

  return (
    <div className="page" style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Welcome back,<br /><span style={{ color: '#4caf50' }}>{user?.username}</span></h1>
        <div style={styles.statsRow}>
          <Stat icon="⭐" label="Points" value={user?.points || 0} />
          <Stat icon="🏅" label="Badges" value={user?.badges?.length || 0} />
          <Stat icon="🔓" label="Levels" value={user?.unlockedLevels?.length || 0} />
        </div>
      </div>

      <h2 style={styles.menuTitle}>Choose Your Mode</h2>
      <div style={styles.menuGrid}>
        {MENU_ITEMS.map((item) => (
          <button key={item.label} onClick={() => navigate(item.path)} style={{ ...styles.menuCard, borderTop: `4px solid ${item.color}` }}>
            <span style={styles.menuIcon}>{item.icon}</span>
            <h3 style={styles.menuLabel}>{item.label}</h3>
            <p style={styles.menuDesc}>{item.desc}</p>
          </button>
        ))}
      </div>

      {user?.role === 'admin' && (
        <div style={styles.adminBanner}>
          <span>🛠 Admin Panel</span>
          <button className="btn-gold" onClick={() => navigate('/admin')}>Open Dashboard</button>
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div style={styles.stat}>
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      <span style={{ fontSize: '1.4rem', fontWeight: 700 }}>{value}</span>
      <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{label}</span>
    </div>
  );
}

const styles = {
  page: { paddingTop: '3rem' },
  hero: { textAlign: 'center', marginBottom: '3rem' },
  title: { fontFamily: "'Press Start 2P', monospace", fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1.5rem' },
  statsRow: { display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', background: 'rgba(255,255,255,0.08)', padding: '1rem 1.5rem', borderRadius: 12 },
  menuTitle: { fontFamily: "'Press Start 2P', monospace", fontSize: '0.85rem', marginBottom: '1.5rem', opacity: 0.7 },
  menuGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  menuCard: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '2rem 1.5rem', textAlign: 'center', color: '#f9fbe7', cursor: 'pointer', transition: 'transform 0.2s, background 0.2s' },
  menuIcon: { fontSize: '3rem', display: 'block', marginBottom: '1rem' },
  menuLabel: { fontFamily: "'Press Start 2P', monospace", fontSize: '0.7rem', marginBottom: '0.8rem' },
  menuDesc: { fontSize: '0.9rem', opacity: 0.7 },
  adminBanner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,193,7,0.15)', border: '1px solid #ffc107', borderRadius: 12, padding: '1rem 1.5rem', marginTop: '1rem' },
};
