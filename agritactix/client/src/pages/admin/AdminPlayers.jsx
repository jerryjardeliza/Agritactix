import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminPlayers() {
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [playerProgress, setPlayerProgress] = useState([]);
  const [unlockForm, setUnlockForm] = useState({ level: '', crop: '' });

  useEffect(() => { api.get('/admin/players').then((r) => setPlayers(r.data)); }, []);

  const viewPlayer = async (player) => {
    setSelected(player);
    const { data } = await api.get(`/admin/players/${player._id}/progress`);
    setPlayerProgress(data);
  };

  const unlock = async () => {
    const body = {};
    if (unlockForm.level) body.level = +unlockForm.level;
    if (unlockForm.crop) body.crop = unlockForm.crop;
    await api.post(`/admin/players/${selected._id}/unlock`, body);
    const { data } = await api.get('/admin/players');
    setPlayers(data);
    setSelected(data.find((p) => p._id === selected._id));
    setUnlockForm({ level: '', crop: '' });
  };

  return (
    <div className="page">
      <h2 style={styles.heading}>👥 Player Analytics</h2>
      <div style={styles.layout}>
        {/* Player list */}
        <div style={styles.playerList}>
          {players.map((p) => (
            <div key={p._id} onClick={() => viewPlayer(p)} className="card" style={{ ...styles.playerRow, ...(selected?._id === p._id ? styles.playerRowActive : {}) }}>
              <span style={{ fontSize: '1.5rem' }}>🧑‍🌾</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700 }}>{p.username}</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>{p.email}</p>
              </div>
              <span style={{ color: '#ffc107', fontSize: '0.85rem' }}>⭐ {p.points}</span>
            </div>
          ))}
          {players.length === 0 && <p style={{ opacity: 0.5 }}>No players yet.</p>}
        </div>

        {/* Player detail */}
        {selected && (
          <div style={styles.detail}>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{selected.username}</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>{selected.email}</p>
              <div style={styles.detailStats}>
                <span>⭐ {selected.points} pts</span>
                <span>🏅 {selected.badges?.length || 0} badges</span>
                <span>🔓 Levels: {selected.unlockedLevels?.join(', ')}</span>
              </div>
            </div>

            <div className="card" style={{ marginBottom: '1rem' }}>
              <h4 style={{ marginBottom: '0.8rem' }}>Unlock Content</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input placeholder="Level number" value={unlockForm.level} onChange={(e) => setUnlockForm({ ...unlockForm, level: e.target.value })} style={{ width: 120 }} />
                <input placeholder="Crop name" value={unlockForm.crop} onChange={(e) => setUnlockForm({ ...unlockForm, crop: e.target.value })} style={{ width: 120 }} />
                <button className="btn-gold" onClick={unlock}>Unlock</button>
              </div>
            </div>

            <div className="card">
              <h4 style={{ marginBottom: '0.8rem' }}>Progress History</h4>
              {playerProgress.length === 0 ? (
                <p style={{ opacity: 0.5, fontSize: '0.85rem' }}>No activity yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {playerProgress.map((p) => (
                    <div key={p._id} style={styles.progressRow}>
                      <span style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'capitalize' }}>{p.type}</span>
                      <span style={{ fontSize: '0.85rem' }}>{p.lessonId?.title || p.quizId?.title || 'Simulation'}</span>
                      {p.score != null && <span style={{ color: p.score >= 70 ? '#4caf50' : '#ef9a9a', fontSize: '0.85rem' }}>{p.score}%</span>}
                      <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{p.completed ? '✅' : '⏳'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  heading: { fontFamily: "'Press Start 2P', monospace", fontSize: '0.85rem', marginBottom: '1.5rem' },
  layout: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' },
  playerList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  playerRow: { display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', transition: 'background 0.2s' },
  playerRowActive: { background: 'rgba(76,175,80,0.2)', border: '1px solid #4caf50' },
  detail: {},
  detailStats: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem', fontSize: '0.85rem' },
  progressRow: { display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.4rem', background: 'rgba(255,255,255,0.04)', borderRadius: 6, flexWrap: 'wrap' },
};
