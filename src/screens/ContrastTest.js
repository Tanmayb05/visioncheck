import React, { useState, useEffect, useCallback } from 'react';
import { AppShell, Header } from '../components/Layout';
import { speak } from '../utils/voice';
import { useTranslation } from '../utils/useTranslation';

// 8 contrast levels from high to very low
const LEVELS = [
  { opacity: 1.0,   label: '100%' },
  { opacity: 0.75,  label: '75%' },
  { opacity: 0.55,  label: '55%' },
  { opacity: 0.40,  label: '40%' },
  { opacity: 0.28,  label: '28%' },
  { opacity: 0.18,  label: '18%' },
  { opacity: 0.10,  label: '10%' },
  { opacity: 0.05,  label: '5%' },
];

const DIRECTIONS = ['up', 'down', 'left', 'right'];

function LandoltC({ direction, opacity, size = 140 }) {
  const gapAngle = {
    up: 270,
    right: 0,
    down: 90,
    left: 180,
  }[direction];

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.32;
  const stroke = size * 0.12;

  // Calculate gap in the arc
  const gapDeg = 30;
  const startDeg = gapAngle + gapDeg / 2;
  const endDeg = gapAngle + 360 - gapDeg / 2;

  const toRad = d => (d * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startDeg));
  const y1 = cy + r * Math.sin(toRad(startDeg));
  const x2 = cx + r * Math.cos(toRad(endDeg));
  const y2 = cy + r * Math.sin(toRad(endDeg));

  const largeArc = (360 - gapDeg) > 180 ? 1 : 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'block', margin: '0 auto' }}
    >
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
        fill="none"
        stroke={`rgba(0,0,0,${opacity})`}
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ContrastTest({ onComplete, onBack, step, totalSteps, language = 'en' }) {
  const t = useTranslation(language);
  const [level, setLevel] = useState(0);
  const [direction, setDirection] = useState('right');
  const [fails, setFails] = useState(0);

  const randomDir = useCallback(() => {
    return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
  }, []);

  useEffect(() => {
    setDirection(randomDir());
  }, [level, randomDir]);

  useEffect(() => {
    speak(t('contrast.voice'), language);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (answer) => {
    if (answer === direction) {
      // Correct — advance
      if (level + 1 >= LEVELS.length) {
        onComplete({ lastLevel: level });
      } else {
        setLevel(l => l + 1);
        setFails(0);
      }
    } else {
      const newFails = fails + 1;
      if (newFails >= 2) {
        onComplete({ lastLevel: Math.max(0, level - 1) });
      } else {
        setFails(newFails);
        setDirection(randomDir());
      }
    }
  };

  const current = LEVELS[level];

  return (
    <AppShell language={language}>
      <Header
        title={t('contrast.title')}
        subtitle={t('contrast.levelOf')(level + 1, LEVELS.length)}
        onBack={onBack}
        step={step}
        totalSteps={totalSteps}
        language={language}
      />

      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          fontSize: 13, color: '#6b7280', marginBottom: 16, textAlign: 'center',
        }}>
          {t('contrast.question')}
        </div>

        {/* C display */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          border: '2px solid #e5e7eb',
          borderRadius: 6,
          width: '100%',
          marginBottom: 20,
          minHeight: 180,
        }}>
          <LandoltC
            direction={direction}
            opacity={current.opacity}
            size={Math.min(160, window.innerWidth - 80)}
          />
        </div>

        {/* Direction buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <button onClick={() => handleAnswer('up')} style={dirBtnStyle}>↑</button>
          <div style={{ display: 'flex', gap: 20 }}>
            <button onClick={() => handleAnswer('left')} style={dirBtnStyle}>←</button>
            <div style={{ width: 64, height: 64 }} />
            <button onClick={() => handleAnswer('right')} style={dirBtnStyle}>→</button>
          </div>
          <button onClick={() => handleAnswer('down')} style={dirBtnStyle}>↓</button>
        </div>

        <button
          onClick={() => onComplete({ lastLevel: Math.max(0, level - 1) })}
          style={{
            padding: '14px 20px',
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
          {t('contrast.cantSee')}
        </button>

        {/* Contrast level indicator */}
        <div style={{ marginTop: 16, width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
            <span>{t('contrast.highContrast')}</span>
            <span>{t('contrast.lowContrast')}</span>
          </div>
          <div style={{ background: '#f3f4f6', borderRadius: 4, height: 6, overflow: 'hidden' }}>
            <div style={{
              background: 'linear-gradient(90deg, #1e3a5f, #f59e0b)',
              width: `${((level + 1) / LEVELS.length) * 100}%`,
              height: '100%',
              borderRadius: 4,
              transition: 'width 0.3s',
            }} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

const dirBtnStyle = {
  width: 64,
  height: 64,
  borderRadius: 6,
  border: '2px solid #1e3a5f',
  background: '#ebf4ff',
  color: '#1e3a5f',
  fontSize: 26,
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
