import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import useStore from '../store/useStore';

export default function ProfilePage() {
  const user = useStore((s) => s.user);
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/progress/me').then((r) => { setProgress(r.data.progress); setStats(r.data.stats); });
  }, []);

  const lessons = progress.filter((p) => p.type === 'lesson' && p.completed);
  const quizzes = progress.filter((p) => p.type === 'quiz' && p.completed);
  const simulations = progress.filter((p) => p.type === 'simulation');
  const avgScore = quizzes.length ? Math.round(quizzes.reduce((a, q) => a + (q.score || 0), 0) / quizzes.length) : 0;

  return (
    <div className="page" style={{ maxWidth: 800 }}>
      <div className="card" style={styles.profileCard}>
        <div style={styles.avatar}>🧑‍🌾</div>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{user?.username}</h2>
          <p style={{ opacity: 0.6, fontSize: '0.85rem' }}>{user?.email}</p>
          <span className="badge" style={{ marginTop: '0.4rem' }}>{user?.role}</span>
        </div>
        <div style={styles.pointsDisplay}>
          <span style={{ fontSize: '2rem', fontWeight: 700, color: '#ffc107' }}>⭐ {stats?.points || 0}</span>
          <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>Total Points</span>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <StatCard icon="📚" label="Lessons Done" value={lessons.length} />
        <StatCard icon="📝" label="Quizzes Passed" value={quizzes.length} />
        <StatCard icon="📊" label="Avg Quiz Score" value={`${avgScore}%`} />
        <StatCard icon="🌍" label="Simulations" value={simulations.length} />
      </div>

      {stats?.badges?.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 style={styles.sectionTitle}>🏅 Badges</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.8rem' }}>
            {stats.badges.map((b, i) => <span key={i} className="badge">{b.replace('quiz_master_', 'Quiz Master #')}</span>)}
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={styles.sectionTitle}>🔓 Unlocked Levels</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
          {(stats?.unlockedLevels || []).map((l) => (
            <span key={l} style={styles.levelBadge}>Level {l}</span>
          ))}
        </div>
      </div>

      {quizzes.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 style={styles.sectionTitle}>📝 Quiz History</h3>
          <div style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {quizzes.map((q) => (
              <div key={q._id} style={styles.historyRow}>
                <span>{q.quizId?.title || 'Quiz'}</span>
                <span style={{ color: q.score >= 70 ? '#4caf50' : '#ef9a9a' }}>{q.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem' }}>{icon}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.3rem 0' }}>{value}</div>
      <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{label}</div>
    </div>
  );
}

const styles = {
  profileCard: { display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' },
  avatar: { fontSize: '4rem' },
  pointsDisplay: { marginLeft: 'auto', textAlign: 'right', display: 'flex', flexDirection: 'column' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginTop: '1.5rem' },
  sectionTitle: { fontSize: '1rem', fontWeight: 700 },
  levelBadge: { background: '#1565c0', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem' },
  historyRow: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: 6, fontSize: '0.9rem' },
};
