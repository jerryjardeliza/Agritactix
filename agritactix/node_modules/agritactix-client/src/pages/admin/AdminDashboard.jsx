import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => { api.get('/admin/analytics').then((r) => setAnalytics(r.data)); }, []);

  if (!analytics) return <div className="page flex-center" style={{ minHeight: '60vh' }}>Loading analytics...</div>;

  return (
    <div className="page">
      <h2 style={styles.heading}>🛠 Admin Dashboard</h2>

      <div style={styles.statsGrid}>
        <StatCard icon="👥" label="Total Players" value={analytics.totalUsers} color="#1565c0" />
        <StatCard icon="📚" label="Lessons" value={analytics.totalLessons} color="#2d7a2d" />
        <StatCard icon="📝" label="Quizzes" value={analytics.totalQuizzes} color="#795548" />
        <StatCard icon="📊" label="Avg Quiz Score" value={`${analytics.avgQuizScore}%`} color="#e65100" />
      </div>

      <div style={styles.navGrid}>
        {[
          { to: '/admin/lessons', icon: '📚', label: 'Manage Lessons', desc: 'Create, edit, publish lessons' },
          { to: '/admin/quizzes', icon: '📝', label: 'Manage Quizzes', desc: 'Build quiz questions' },
          { to: '/admin/players', icon: '👥', label: 'Player Analytics', desc: 'Track player progress' },
        ].map((item) => (
          <Link key={item.to} to={item.to} style={styles.navCard}>
            <span style={{ fontSize: '2.5rem' }}>{item.icon}</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0.5rem 0 0.3rem' }}>{item.label}</h3>
            <p style={{ opacity: 0.6, fontSize: '0.85rem' }}>{item.desc}</p>
          </Link>
        ))}
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Recent Activity</h3>
        {analytics.recentActivity.length === 0 ? (
          <p style={{ opacity: 0.5 }}>No activity yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {analytics.recentActivity.map((a) => (
              <div key={a._id} style={styles.activityRow}>
                <span>👤 {a.userId?.username || 'Unknown'}</span>
                <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>{a.type}</span>
                <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>{a.lessonId?.title || a.quizId?.title || 'Simulation'}</span>
                {a.score != null && <span style={{ color: '#ffc107' }}>{a.score}%</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="card" style={{ textAlign: 'center', borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: '2rem' }}>{icon}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.3rem 0' }}>{value}</div>
      <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{label}</div>
    </div>
  );
}

const styles = {
  heading: { fontFamily: "'Press Start 2P', monospace", fontSize: '0.9rem', marginBottom: '1.5rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  navGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' },
  navCard: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '1.5rem', textDecoration: 'none', color: '#f9fbe7', display: 'block', transition: 'background 0.2s' },
  activityRow: { display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: 6, fontSize: '0.85rem', flexWrap: 'wrap' },
};
