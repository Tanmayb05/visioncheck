import React, { useState, useEffect } from 'react';
import { AppShell, Header } from '../components/Layout';
import { speak } from '../utils/voice';

// Ishihara-style plates rendered with SVG dot patterns
// Each plate: number visible to normal vision, number visible to color-blind, or none
const PLATES = [
  { id: 1, normal: 12, colorBlind: 12, type: 'control', description: 'Control plate - both normal and colorblind should see 12' },
  { id: 2, normal: 8,  colorBlind: 3,  type: 'red-green', description: 'Red-green deficiency' },
  { id: 3, normal: 6,  colorBlind: 5,  type: 'red-green', description: 'Red-green deficiency' },
  { id: 4, normal: 29, colorBlind: 70, type: 'red-green', description: 'Red-green deficiency' },
  { id: 5, normal: 57, colorBlind: 35, type: 'red-green', description: 'Red-green deficiency' },
  { id: 6, normal: 5,  colorBlind: null, type: 'vanishing', description: 'Vanishing - colorblind see nothing' },
];

function IshiharaPlate({ plate, size = 280, sessionSeed = 1 }) {
  // Generate pseudo-random dot positions using plate id + session seed
  const dots = generateDots(plate.id, size, sessionSeed);
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ borderRadius: '50%', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', display: 'block', margin: '0 auto' }}
    >
      {/* Background dots */}
      {dots.bg.map((d, i) => (
        <circle key={`bg-${i}`} cx={d.x} cy={d.y} r={d.r} fill={d.color} opacity={0.9} />
      ))}
      {/* Number dots */}
      {dots.num.map((d, i) => (
        <circle key={`num-${i}`} cx={d.x} cy={d.y} r={d.r} fill={d.color} opacity={0.95} />
      ))}
    </svg>
  );
}

function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateDots(plateId, size, sessionSeed = 1) {
  const rand = seededRandom(plateId * 12345 + sessionSeed * 7);
  const center = size / 2;
  const radius = size / 2 - 4;

  // Number digit pixel maps (simplified 5x7 font patterns)
  const DIGIT_PIXELS = {
    0: [[1,0,1,1,1],[1,1,0,0,1],[1,1,0,0,1],[1,1,0,0,1],[1,0,1,1,1]],
    1: [[0,1,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,1,1,1,0]],
    2: [[1,1,1,1,0],[0,0,0,1,1],[0,1,1,1,0],[1,1,0,0,0],[1,1,1,1,1]],
    3: [[1,1,1,1,0],[0,0,0,1,1],[0,1,1,1,0],[0,0,0,1,1],[1,1,1,1,0]],
    5: [[1,1,1,1,1],[1,1,0,0,0],[1,1,1,1,0],[0,0,0,1,1],[1,1,1,1,0]],
    6: [[0,1,1,1,1],[1,1,0,0,0],[1,1,1,1,0],[1,1,0,0,1],[0,1,1,1,0]],
    7: [[1,1,1,1,1],[0,0,0,1,1],[0,0,1,1,0],[0,0,1,0,0],[0,0,1,0,0]],
    8: [[0,1,1,1,0],[1,1,0,1,1],[0,1,1,1,0],[1,1,0,1,1],[0,1,1,1,0]],
    9: [[0,1,1,1,0],[1,1,0,1,1],[0,1,1,1,1],[0,0,0,1,1],[0,1,1,1,0]],
  };

  const numColors = {
    1: ['#c0392b', '#e74c3c', '#c0392b'],
    2: ['#c0392b', '#e74c3c', '#922b21'],
    3: ['#276749', '#2ecc71', '#1e8449'],
    4: ['#c0392b', '#e74c3c', '#c0392b'],
    5: ['#c0392b', '#e74c3c', '#c0392b'],
    6: ['#276749', '#2ecc71', '#1e8449'],
  };

  const bgPalette = [
    '#f0e68c', '#daa520', '#f4d03f', '#d4ac0d',
    '#b7950b', '#f7dc6f', '#e8d5b7', '#f5cba7',
  ];

  // Place background dots filling circle
  const bg = [];
  for (let i = 0; i < 600; i++) {
    const angle = rand() * Math.PI * 2;
    const r2 = Math.sqrt(rand()) * radius;
    const x = center + r2 * Math.cos(angle);
    const y = center + r2 * Math.sin(angle);
    const dotR = 4 + rand() * 7;
    bg.push({ x, y, r: dotR, color: bgPalette[Math.floor(rand() * bgPalette.length)] });
  }

  // Place number dots
  const num = [];
  const numStr = String(plateId <= 1 ? 12 : [8,6,29,57,5][plateId - 2] || 8);
  const nColors = numColors[plateId] || numColors[1];

  const cellSize = size * 0.07;
  const totalW = numStr.length * 5 * cellSize;
  const startX = center - totalW / 2;
  const startY = center - 3.5 * cellSize;

  for (let ci = 0; ci < numStr.length; ci++) {
    const d = parseInt(numStr[ci]);
    const pixels = DIGIT_PIXELS[d] || DIGIT_PIXELS[8];
    for (let row = 0; row < pixels.length; row++) {
      for (let col = 0; col < pixels[row].length; col++) {
        if (pixels[row][col]) {
          const cx = startX + ci * 5 * cellSize + col * cellSize + rand() * cellSize * 0.3;
          const cy = startY + row * cellSize + rand() * cellSize * 0.3;
          const dr = 4 + rand() * 5;
          num.push({ x: cx, y: cy, r: dr, color: nColors[Math.floor(rand() * nColors.length)] });
        }
      }
    }
  }

  return { bg, num };
}

// Generate a random session seed once per test session
function makeSessionSeed() {
  return Math.floor(Math.random() * 99999) + 1;
}

export default function ColorTest({ onComplete, onBack, step, totalSteps }) {
  const [plateIdx, setPlateIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionSeed] = useState(makeSessionSeed);

  const plate = PLATES[plateIdx];

  useEffect(() => {
    speak('What number do you see in the circle of dots? Tap the number, or tap X if you cannot see one.');
  }, [plateIdx]);

  const handleSubmit = (val) => {
    const answer = val === 'none' ? null : parseInt(val);
    const correct = plate.type === 'control'
      ? (answer === plate.normal)
      : (answer === plate.normal);

    const result = { plate: plate.id, answer, correct, type: plate.type };
    const newAnswers = [...answers, result];

    setInput('');
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      if (plateIdx + 1 >= PLATES.length) {
        onComplete(newAnswers);
      } else {
        setPlateIdx(p => p + 1);
        setAnswers(newAnswers);
      }
    }, 500);
  };

  return (
    <AppShell>
      <Header
        title="Color Vision"
        subtitle={`Plate ${plateIdx + 1} of ${PLATES.length}`}
        
        onBack={onBack}
        step={step}
        totalSteps={totalSteps}
      />

      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16, textAlign: 'center' }}>
          What number do you see in the dots?
        </div>

        {/* Plate */}
        <div style={{
          marginBottom: 24,
          filter: showFeedback ? 'brightness(0.85)' : 'none',
          transition: 'filter 0.3s',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <IshiharaPlate plate={plate} size={Math.min(280, window.innerWidth - 60)} sessionSeed={sessionSeed} />
        </div>

        {/* Number pad */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
          width: '100%',
          maxWidth: 320,
          marginBottom: 12,
        }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button
              key={n}
              onClick={() => setInput(prev => prev.length < 3 ? prev + n : prev)}
              style={{
                padding: '18px',
                borderRadius: 6,
                border: '2px solid #e5e7eb',
                background: '#f9fafb',
                fontSize: 22,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Input display + controls */}
        <div style={{ width: '100%', maxWidth: 320, display: 'flex', gap: 10, marginBottom: 12 }}>
          <div style={{
            flex: 1,
            padding: '14px 16px',
            borderRadius: 6,
            border: '2px solid #e5e7eb',
            background: '#fff',
            fontSize: 24,
            fontWeight: 700,
            textAlign: 'center',
            minHeight: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: input ? '#1a1a2e' : '#d1d5db',
          }}>
            {input || '?'}
          </div>
          <button
            onClick={() => setInput(p => p.slice(0, -1))}
            style={{
              padding: '14px 16px',
              borderRadius: 6,
              border: '2px solid #e5e7eb',
              background: '#f9fafb',
              fontSize: 18,
              cursor: 'pointer',
            }}
          >
            ⌫
          </button>
        </div>

        <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => input && handleSubmit(input)}
            disabled={!input}
            style={{
              padding: '16px',
              borderRadius: 6,
              background: input ? '#1e3a5f' : '#d1d5db',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              border: 'none',
              cursor: input ? 'pointer' : 'not-allowed',
              width: '100%',
            }}
          >
            Submit Answer
          </button>
          <button
            onClick={() => handleSubmit('none')}
            style={{
              padding: '14px',
              borderRadius: 6,
              background: '#f9fafb',
              border: '2px solid #e5e7eb',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              color: '#6b7280',
              width: '100%',
            }}
          >
            ✗ I can't see a number
          </button>
        </div>
      </div>
    </AppShell>
  );
}
