import React, { useState, useEffect } from 'react';
import { AppShell, Header, BigButton, EyeCoverInstruction } from '../components/Layout';
import { speak } from '../utils/voice';
import { useTranslation } from '../utils/useTranslation';

function AmslerGrid({ markedAreas, onMark, size = 280 }) {
  const cells = 10;
  const cellSize = size / cells;

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    const key = `${row}-${col}`;
    onMark(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleTouch = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    const key = `${row}-${col}`;
    onMark(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        onClick={handleClick}
        onTouchEnd={handleTouch}
        style={{ display: 'block', cursor: 'crosshair', border: '2px solid #e5e7eb', borderRadius: 4 }}
      >
        {/* Grid lines */}
        {Array.from({ length: cells + 1 }, (_, i) => (
          <g key={i}>
            <line x1={i * cellSize} y1={0} x2={i * cellSize} y2={size} stroke="#000" strokeWidth={0.5} />
            <line x1={0} y1={i * cellSize} x2={size} y2={i * cellSize} stroke="#000" strokeWidth={0.5} />
          </g>
        ))}

        {/* Marked cells */}
        {Array.from(markedAreas).map(key => {
          const [row, col] = key.split('-').map(Number);
          return (
            <rect
              key={key}
              x={col * cellSize}
              y={row * cellSize}
              width={cellSize}
              height={cellSize}
              fill="rgba(231,76,60,0.4)"
            />
          );
        })}

        {/* Center fixation dot */}
        <circle cx={size / 2} cy={size / 2} r={6} fill="#1e3a5f" />
        <circle cx={size / 2} cy={size / 2} r={3} fill="#fff" />
      </svg>
    </div>
  );
}

export default function AmslerTest({ onComplete, onBack, step, totalSteps, language = 'en' }) {
  const t = useTranslation(language);
  const [phase, setPhase] = useState('right'); // right | left
  const [rightResult, setRightResult] = useState({ wavy: null, marked: new Set() });
  const [leftResult, setLeftResult] = useState({ wavy: null, marked: new Set() });

  const currentResult = phase === 'right' ? rightResult : leftResult;
  const setCurrentResult = phase === 'right' ? setRightResult : setLeftResult;

  useEffect(() => {
    speak(t('amsler.voice'), language);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMark = (updater) => {
    setCurrentResult(prev => ({ ...prev, marked: updater(prev.marked) }));
  };

  const handleWavy = (val) => {
    setCurrentResult(prev => ({ ...prev, wavy: val }));
  };

  const handleNext = () => {
    if (phase === 'right') {
      setPhase('left');
    } else {
      onComplete({
        right: {
          wavy: rightResult.wavy === true,
          missing: rightResult.marked.size > 0,
        },
        left: {
          wavy: leftResult.wavy === true,
          missing: leftResult.marked.size > 0,
        },
      });
    }
  };

  const canProceed = currentResult.wavy !== null;

  return (
    <AppShell language={language}>
      <Header
        title={t('amsler.title')}
        subtitle={phase === 'right' ? t('amsler.rightEyeMacular') : t('amsler.leftEyeMacular')}
        onBack={onBack}
        step={step}
        totalSteps={totalSteps}
        language={language}
      />

      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <EyeCoverInstruction eye={phase === 'right' ? 'left' : 'right'} language={language} />

        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12, textAlign: 'center' }}>
          {t('amsler.instructions')}
        </div>

        <AmslerGrid
          markedAreas={currentResult.marked}
          onMark={handleMark}
          size={Math.min(280, window.innerWidth - 60)}
        />

        {currentResult.marked.size > 0 && (
          <div style={{
            marginTop: 10, fontSize: 12, color: '#b91c1c',
            background: '#fef2f2', border: '1px solid #fca5a5',
            borderRadius: 8, padding: '6px 12px',
          }}>
            {t('amsler.areasMarked')(currentResult.marked.size)}
          </div>
        )}

        {/* Wavy question */}
        <div style={{ marginTop: 16, width: '100%' }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, textAlign: 'center' }}>
            {t('amsler.question')}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => handleWavy(false)}
              style={{
                flex: 1, padding: '14px', borderRadius: 12,
                background: currentResult.wavy === false ? '#ebf4ff' : '#f9fafb',
                border: `2px solid ${currentResult.wavy === false ? '#276749' : '#e5e7eb'}`,
                fontWeight: 700, fontSize: 15, cursor: 'pointer',
                color: currentResult.wavy === false ? '#15803d' : '#374151',
              }}
            >
              {t('amsler.yesStraight')}
            </button>
            <button
              onClick={() => handleWavy(true)}
              style={{
                flex: 1, padding: '14px', borderRadius: 12,
                background: currentResult.wavy === true ? '#fff3f3' : '#f9fafb',
                border: `2px solid ${currentResult.wavy === true ? '#e74c3c' : '#e5e7eb'}`,
                fontWeight: 700, fontSize: 15, cursor: 'pointer',
                color: currentResult.wavy === true ? '#b91c1c' : '#374151',
              }}
            >
              {t('amsler.noWavy')}
            </button>
          </div>
        </div>

        <div style={{ width: '100%', marginTop: 16 }}>
          <BigButton onClick={handleNext} disabled={!canProceed}>
            {phase === 'right' ? t('amsler.testLeftEye') : t('common.nextTest')}
          </BigButton>
        </div>
      </div>
    </AppShell>
  );
}
