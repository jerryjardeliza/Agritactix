import React from 'react';

const TOOLS = [
  { id: 'plant', icon: '🌱', label: 'Plant' },
  { id: 'water', icon: '💧', label: 'Water' },
  { id: 'fertilize', icon: '🌿', label: 'Fertilize' },
  { id: 'pesticide', icon: '🧪', label: 'Pesticide' },
  { id: 'harvest', icon: '🌾', label: 'Harvest' },
];

const CROPS = ['wheat', 'corn', 'tomato', 'carrot', 'potato'];

export default function SimHUD({ state, selectedTool, selectedCrop, onSelectTool, onSelectCrop, onAdvanceDay, onSave, onReset }) {
  const { water, nutrients, pestLevel, day, season, points, events, gameOver } = state;

  return (
    <div style={styles.hud}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.dayBadge}>Day {day} · {season}</span>
        <span style={{ color: '#ffc107', fontWeight: 700 }}>⭐ {points} pts</span>
      </div>

      {/* Resource bars */}
      <div style={styles.section}>
        <ResourceBar label="💧 Water" value={water} color="#1e88e5" />
        <ResourceBar label="🌿 Nutrients" value={nutrients} color="#43a047" />
        <ResourceBar label="🐛 Pest Level" value={pestLevel} color="#e53935" invert />
      </div>

      {/* Tools */}
      <div style={styles.section}>
        <p style={styles.sectionLabel}>Tools</p>
        <div style={styles.toolGrid}>
          {TOOLS.map((t) => (
            <button key={t.id} onClick={() => onSelectTool(t.id)} style={{ ...styles.toolBtn, ...(selectedTool === t.id ? styles.toolActive : {}) }}>
              <span style={{ fontSize: '1.3rem' }}>{t.icon}</span>
              <span style={{ fontSize: '0.65rem' }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Crop selector (only when planting) */}
      {selectedTool === 'plant' && (
        <div style={styles.section}>
          <p style={styles.sectionLabel}>Crop</p>
          <div style={styles.cropGrid}>
            {CROPS.map((c) => (
              <button key={c} onClick={() => onSelectCrop(c)} style={{ ...styles.cropBtn, ...(selectedCrop === c ? styles.cropActive : {}) }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Events log */}
      {events.length > 0 && (
        <div style={styles.section}>
          <p style={styles.sectionLabel}>Events</p>
          <div style={styles.eventLog}>
            {events.map((e, i) => <p key={i} style={styles.event}>{e}</p>)}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={styles.actions}>
        <button className="btn-primary" onClick={onAdvanceDay} disabled={gameOver} style={{ flex: 1 }}>
          Next Day →
        </button>
        <button className="btn-secondary" onClick={onSave} style={{ flex: 1 }}>
          💾 Save
        </button>
      </div>
      <button onClick={onReset} style={styles.resetBtn}>↺ Reset Farm</button>

      {gameOver && (
        <div style={styles.gameOver}>
          <p>🌵 Farm failed! Reset to try again.</p>
        </div>
      )}
    </div>
  );
}

function ResourceBar({ label, value, color, invert }) {
  const fill = invert ? value : value;
  const barColor = invert ? (value > 60 ? '#e53935' : value > 30 ? '#ffc107' : '#4caf50') : (value < 30 ? '#e53935' : value < 60 ? '#ffc107' : color);
  return (
    <div style={{ marginBottom: '0.6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px' }}>
        <span>{label}</span><span>{value}%</span>
      </div>
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${fill}%`, background: barColor }} />
      </div>
    </div>
  );
}

const styles = {
  hud: { width: 260, background: 'rgba(10,30,10,0.95)', borderLeft: '1px solid rgba(255,255,255,0.1)', padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  dayBadge: { background: '#2d7a2d', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem' },
  section: { background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '0.7rem' },
  sectionLabel: { fontSize: '0.7rem', opacity: 0.6, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: 1 },
  toolGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.3rem' },
  toolBtn: { background: 'rgba(255,255,255,0.08)', color: '#fff', padding: '0.4rem 0.2rem', borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '0.7rem' },
  toolActive: { background: '#2d7a2d', border: '1px solid #4caf50' },
  cropGrid: { display: 'flex', flexWrap: 'wrap', gap: '0.3rem' },
  cropBtn: { background: 'rgba(255,255,255,0.08)', color: '#fff', padding: '0.3rem 0.6rem', borderRadius: 6, fontSize: '0.75rem', textTransform: 'capitalize' },
  cropActive: { background: '#795548' },
  eventLog: { maxHeight: 80, overflowY: 'auto' },
  event: { fontSize: '0.72rem', color: '#ffcc80', marginBottom: '0.2rem' },
  actions: { display: 'flex', gap: '0.5rem' },
  resetBtn: { background: 'transparent', color: '#ef9a9a', fontSize: '0.8rem', padding: '0.3rem', textAlign: 'center' },
  gameOver: { background: 'rgba(229,57,53,0.2)', border: '1px solid #e53935', borderRadius: 8, padding: '0.7rem', textAlign: 'center', fontSize: '0.85rem', color: '#ef9a9a' },
};
