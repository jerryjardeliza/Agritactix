import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const CROP_COLORS = { wheat: '#f9a825', corn: '#ffeb3b', tomato: '#e53935', carrot: '#ff7043', potato: '#8d6e63' };
const STAGE_HEIGHTS = [0.1, 0.3, 0.5, 0.8, 1.2];

function CropMesh({ crop, stage, health }) {
  const meshRef = useRef();
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.3;
  });
  const color = health < 30 ? '#795548' : health < 60 ? '#cddc39' : CROP_COLORS[crop] || '#4caf50';
  const h = STAGE_HEIGHTS[Math.min(stage, 4)];
  return (
    <mesh ref={meshRef} position={[0, h / 2, 0]} castShadow>
      <cylinderGeometry args={[0.05, 0.1, h, 6]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function FarmPlot({ plot, position, selected, onClick }) {
  const [x, z] = position;
  const isHarvestReady = plot.crop && plot.stage >= 4;

  return (
    <group position={[x, 0, z]} onClick={onClick}>
      {/* Soil */}
      <mesh receiveShadow position={[0, -0.05, 0]}>
        <boxGeometry args={[1.8, 0.1, 1.8]} />
        <meshStandardMaterial color={selected ? '#a5d6a7' : plot.watered ? '#5d4037' : '#8d6e63'} />
      </mesh>
      {/* Border */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.8, 0.12, 1.8)]} />
        <lineBasicMaterial color={selected ? '#4caf50' : '#4a3728'} />
      </lineSegments>
      {/* Crop */}
      {plot.crop && <CropMesh crop={plot.crop} stage={plot.stage} health={plot.health} />}
      {/* Harvest indicator */}
      {isHarvestReady && (
        <mesh position={[0, 1.8, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#ffc107" emissive="#ffc107" emissiveIntensity={0.5} />
        </mesh>
      )}
      {/* Plot number */}
      <Text position={[0, 0.1, 0.8]} fontSize={0.2} color="#fff" anchorX="center" anchorY="middle">
        {plot.id + 1}
      </Text>
    </group>
  );
}

export default function FarmScene({ plots, selectedPlot, onSelectPlot, season }) {
  const skyColor = { Spring: '#87ceeb', Summer: '#64b5f6', Autumn: '#ff8f00', Winter: '#b0bec5' };

  return (
    <group>
      {/* Ground */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color={season === 'Winter' ? '#e0e0e0' : '#388e3c'} />
      </mesh>

      {/* Farm plots in 3x3 grid */}
      {plots.map((plot, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = (col - 1) * 2.2;
        const z = (row - 1) * 2.2;
        return (
          <FarmPlot
            key={plot.id}
            plot={plot}
            position={[x, z]}
            selected={selectedPlot === plot.id}
            onClick={(e) => { e.stopPropagation(); onSelectPlot(plot.id); }}
          />
        );
      })}

      {/* Barn */}
      <group position={[6, 0, 0]}>
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[2.5, 2, 2]} />
          <meshStandardMaterial color="#8d1a1a" />
        </mesh>
        <mesh position={[0, 2.3, 0]} castShadow>
          <coneGeometry args={[1.8, 1, 4]} />
          <meshStandardMaterial color="#5d1010" />
        </mesh>
      </group>

      {/* Water tank */}
      <group position={[-6, 0, 0]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.6, 1.6, 12]} />
          <meshStandardMaterial color="#1565c0" />
        </mesh>
      </group>

      {/* Trees */}
      {[[-8, -6], [8, -6], [-8, 6], [8, 6]].map(([tx, tz], i) => (
        <group key={i} position={[tx, 0, tz]}>
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 1.6, 6]} />
            <meshStandardMaterial color="#5d4037" />
          </mesh>
          <mesh position={[0, 2, 0]}>
            <sphereGeometry args={[0.8, 8, 8]} />
            <meshStandardMaterial color={season === 'Autumn' ? '#e65100' : season === 'Winter' ? '#78909c' : '#2e7d32'} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
