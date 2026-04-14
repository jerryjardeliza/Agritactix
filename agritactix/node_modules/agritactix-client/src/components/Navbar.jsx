import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

export default function Navbar() {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/auth'); };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🌾 AgriTactix</Link>
      <div style={styles.links}>
        <Link to="/lessons" style={styles.link}>Lessons</Link>
        <Link to="/simulation" style={styles.link}>Simulation</Link>
        {user?.role === 'admin' && <Link to="/admin" style={styles.link}>Admin</Link>}
        <Link to="/profile" style={styles.link}>
          <span style={styles.points}>⭐ {user?.points || 0}</span>
          {user?.username}
        </Link>
        <button onClick={handleLogout} className="btn-danger" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 2rem', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: 0, zIndex: 100 },
  brand: { fontFamily: "'Press Start 2P', monospace", fontSize: '1rem', color: '#4caf50', textDecoration: 'none' },
  links: { display: 'flex', alignItems: 'center', gap: '1.2rem' },
  link: { color: '#f9fbe7', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.85 },
  points: { color: '#ffc107', marginRight: '0.4rem', fontSize: '0.85rem' },
};
