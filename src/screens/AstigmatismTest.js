import React, { useState, useEffect } from 'react';
import { AppShell, Header, BigButton } from '../components/Layout';
import { speak } from '../utils/voice';

const NUM_LINES = 12;

function RadialDial({ selectedLines, onToggle, size = 260 }) {
  const center = size / 2;
  const outerR = size / 2 - 10;
  const innerR = size / 2 - 50;

  const lines = Array.from({ length: NUM_LINES }, (_, i) => {
    const angle = (i * Math.PI) / NUM_LINES;
    const x1 = center + innerR * Math.cos(angle);
    const y1 = center + innerR * Math.sin(angle);
    const x2 = center + outerR * Math.cos(angle);
    const y2 = center + outerR * Math.sin(angle);
    const x3 = center - innerR * Math.cos(angle);
    const y3 = center - innerR * Math.sin(angle);
    const x4 = center - outerR * Math.cos(angle);
    const y4 = center - outerR * Math.sin(angle);
    return { i, x1, y1, x2, y2, x3, y3, x4, y4 };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
    >
      {/* Background circle */}
      <circle cx={center} cy={center} r={size / 2 - 4} fill="#fff" stroke="#e5e7eb" strokeWidth={2} />

      {lines.map(({ i, x1, y1, x2, y2, x3, y3, x4, y4 }) => {
        const sel = selectedLines.includes(i);
        return (
          <g key={i} onClick={() => onToggle(i)} style={{ cursor: 'pointer' }}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={sel ? '#e74c3c' : '#1a1a2e'} strokeWidth={sel ? 3 : 2} />
            <line x1={x3} y1={y3} x2={x4} y2={y4} stroke={sel ? '#e74c3c' : '#1a1a2e'} strokeWidth={sel ? 3 : 2} />
            {/* Hit area */}
            <line x1={x1} y1={y1} x2={x4} y2={y4} stroke="transparent" strokeWidth={20} />
          </g>
        );
      })}

      {/* Center dot */}
      <circle cx={center} cy={center} r={6} fill="#1e3a5f" />
    </svg>
  );
}

export default function AstigmatismTest({ onComplete, onBack, step, totalSteps }) {
  const [selectedLines, setSelectedLines] = useState([]);
  const [allSame, setAllSame] = useState(false);

  useEffect(() => {
    speak('Look at the center dot. Do all the lines around it look equally dark and sharp? Tap any lines that look different, blurry, or darker than the others.');
  }, []);

  const toggleLine = (i) => {
    if (allSame) setAllSame(false);
    setSelectedLines(prev =>
      prev.includes(i) ? prev.filter(l => l !== i) : [...prev, i]
    );
  };

  const handleAllSame = () => {
    setSelectedLines([]);
    setAllSame(true);
  };

  const handleSubmit = () => {
    onComplete({ affectedLines: selectedLines, allSame });
  };

  const canSubmit = allSame || selectedLines.length > 0;

  return (
    <AppShell>
      <Header
        title="Astigmatism Test"
        subtitle="Radial Line Dial"
        
        onBack={onBack}
        step={step}
        totalSteps={totalSteps}
      />

      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          background: '#eff6ff',
          border: '1.5px solid #93c5fd',
          borderRadius: 12,
          padding: '10px 16px',
          marginBottom: 16,
          fontSize: 13,
          color: '#1e40af',
          textAlign: 'center',
          width: '100%',
        }}>
          👁️ Focus on the <strong>center dot</strong>. Tap any lines that look darker, blurrier, or different from the rest.
        </div>

        <div style={{
          background: '#fffbeb',
          border: '1.5px solid #fcd34d',
          borderRadius: 12,
          padding: '10px 16px',
          marginBottom: 16,
          fontSize: 12,
          color: '#92400e',
          textAlign: 'center',
          width: '100%',
        }}>
          Tip: The lines are thin — tap <strong>directly on the line</strong> itself, not near it, for accurate selection.
        </div>

        <div style={{ marginBottom: 20, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <RadialDial
            selectedLines={selectedLines}
            onToggle={toggleLine}
            size={Math.min(270, window.innerWidth - 60)}
          />
        </div>

        {selectedLines.length > 0 && (
          <div style={{
            background: '#fff3f3',
            border: '1.5px solid #fca5a5',
            borderRadius: 12,
            padding: '10px 16px',
            marginBottom: 12,
            fontSize: 13,
            color: '#b91c1c',
            width: '100%',
            textAlign: 'center',
          }}>
            {selectedLines.length} line{selectedLines.length !== 1 ? 's' : ''} selected — tap again to deselect
          </div>
        )}

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
          <button
            onClick={handleAllSame}
            style={{
              padding: '16px',
              borderRadius: 6,
              background: allSame ? '#ebf4ff' : '#f9fafb',
              border: `2px solid ${allSame ? '#276749' : '#e5e7eb'}`,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              color: allSame ? '#15803d' : '#374151',
            }}
          >
            {allSame ? '✓ ' : ''}All lines look the same
          </button>
          <BigButton
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Next Test →
          </BigButton>
        </div>
      </div>
    </AppShell>
  );
}
