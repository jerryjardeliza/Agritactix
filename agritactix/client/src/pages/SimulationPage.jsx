import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Text } from '@react-three/drei';
import FarmScene from '../components/simulation/FarmScene';
import SimHUD from '../components/simulation/SimHUD';
import api from '../api/axios';
import useStore from '../store/useStore';

const INITIAL_STATE = {
  water: 80,
  nutrients: 70,
  pestLevel: 0,
  day: 1,
  season: 'Spring',
  plots: Array(9).fill(null).map((_, i) => ({ id: i, crop: null, stage: 0, health: 100, watered: false, fertilized: false })),
  points: 0,
  events: [],
  gameOver: false,
};

export default function SimulationPage() {
  const [state, setState] = useState(INITIAL_STATE);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [selectedTool, setSelectedTool] = useState('plant');
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const { refreshUser } = useStore();
  const sessionStart = useRef(Date.now());

  // Advance day simulation
  const advanceDay = () => {
    setState((prev) => {
      if (prev.gameOver) return prev;
      const newDay = prev.day + 1;
      const events = [];
      let water = Math.max(0, prev.water - 10);
      let nutrients = Math.max(0, prev.nutrients - 5);
      let pestLevel = Math.min(100, prev.pestLevel + (Math.random() > 0.7 ? 15 : 0));

      const plots = prev.plots.map((p) => {
        if (!p.crop) return p;
        let health = p.health;
        let stage = p.stage;
        if (!p.watered) { health -= 15; events.push(`Plot ${p.id + 1}: Crop wilting - needs water!`); }
        if (pestLevel > 50) { health -= 10; events.push(`Plot ${p.id + 1}: Pest damage!`); }
        if (p.watered && health > 60 && stage < 4) stage += 1;
        return { ...p, health: Math.max(0, Math.min(100, health)), stage, watered: false, fertilized: false };
      });

      const season = newDay <= 30 ? 'Spring' : newDay <= 60 ? 'Summer' : newDay <= 90 ? 'Autumn' : 'Winter';
      const gameOver = water === 0 && plots.every((p) => !p.crop || p.health === 0);

      return { ...prev, day: newDay, water, nutrients, pestLevel, plots, season, events: events.slice(-5), gameOver };
    });
  };

  const applyTool = (plotId) => {
    setState((prev) => {
      const plots = prev.plots.map((p) => {
        if (p.id !== plotId) return p;
        switch (selectedTool) {
          case 'plant': return p.crop ? p : { ...p, crop: selectedCrop, stage: 0, health: 100 };
          case 'water': return { ...p, watered: true, health: Math.min(100, p.health + 10) };
          case 'fertilize': return { ...p, fertilized: true, health: Math.min(100, p.health + 15) };
          case 'pesticide': return p;
          case 'harvest':
            if (p.stage >= 4) {
              return { ...p, crop: null, stage: 0, health: 100 };
            }
            return p;
          default: return p;
        }
      });

      let pestLevel = prev.pestLevel;
      if (selectedTool === 'pesticide') pestLevel = Math.max(0, pestLevel - 30);

      const harvestedPlot = prev.plots.find((p) => p.id === plotId && p.stage >= 4 && selectedTool === 'harvest');
      const newPoints = prev.points + (harvestedPlot ? 50 : selectedTool === 'water' ? 2 : selectedTool === 'fertilize' ? 3 : 0);

      return { ...prev, plots, pestLevel, points: newPoints };
    });
  };

  const saveSession = async () => {
    const timeSpent = Math.round((Date.now() - sessionStart.current) / 1000);
    await api.post('/progress/simulation', { simulationData: { day: state.day, points: state.points, season: state.season }, timeSpent });
    refreshUser();
    alert(`Session saved! You earned ${state.points} simulation points.`);
  };

  const reset = () => { setState(INITIAL_STATE); sessionStart.current = Date.now(); };

  return (
    <div style={styles.container}>
      <div style={styles.canvasWrap}>
        <Canvas camera={{ position: [0, 8, 12], fov: 55 }} shadows>
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <FarmScene plots={state.plots} selectedPlot={selectedPlot} onSelectPlot={(id) => { setSelectedPlot(id); applyTool(id); }} season={state.season} />
          <OrbitControls maxPolarAngle={Math.PI / 2.2} minDistance={5} maxDistance={25} />
        </Canvas>
      </div>

      <SimHUD
        state={state}
        selectedTool={selectedTool}
        selectedCrop={selectedCrop}
        onSelectTool={setSelectedTool}
        onSelectCrop={setSelectedCrop}
        onAdvanceDay={advanceDay}
        onSave={saveSession}
        onReset={reset}
      />
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden' },
  canvasWrap: { flex: 1, position: 'relative' },
};
