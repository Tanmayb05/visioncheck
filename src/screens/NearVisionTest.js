import React, { useState, useEffect } from 'react';
import { AppShell, Header } from '../components/Layout';
import { speak } from '../utils/voice';
import { useTranslation } from '../utils/useTranslation';

// Near vision text sizes — progressively smaller
const TEXT_LEVELS = [
  { size: 28, label: 'N36', text: 'The quick brown fox jumps over the lazy dog.' },
  { size: 22, label: 'N24', text: 'Vision is precious — take care of your eyes.' },
  { size: 18, label: 'N18', text: 'A regular eye check can prevent vision loss.' },
  { size: 14, label: 'N14', text: 'Glasses can correct most common vision problems easily.' },
  { size: 11, label: 'N10', text: 'Even small text can be seen with healthy near vision at reading distance.' },
  { size: 9,  label: 'N8',  text: 'This very small text tests whether your eyes can focus at reading distance without strain.' },
];

export default function NearVisionTest({ onComplete, onBack, step, totalSteps, language = 'en' }) {
  const t = useTranslation(language);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    speak(t('nearVision.voice'), language);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (canRead) => {
    if (canRead) {
      if (level + 1 >= TEXT_LEVELS.length) {
        onComplete({ lastSize: level });
      } else {
        setLevel(l => l + 1);
      }
    } else {
      onComplete({ lastSize: Math.max(0, level - 1) });
    }
  };

  const current = TEXT_LEVELS[level];

  return (
    <AppShell language={language}>
      <Header
        title={t('nearVision.title')}
        subtitle={t('nearVision.levelOf')(level + 1, TEXT_LEVELS.length, current.label)}
        onBack={onBack}
        step={step}
        totalSteps={totalSteps}
        language={language}
      />

      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          background: '#eff6ff',
          border: '1.5px solid #93c5fd',
          borderRadius: 12,
          padding: '10px 16px',
          marginBottom: 16,
          fontSize: 13,
          color: '#1e40af',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ fontSize: 20 }}>📏</span>
          {t('nearVision.holdPhone')}
        </div>

        {/* Text display */}
        <div style={{
          flex: 1,
          background: '#ffffff',
          border: '2px solid #e5e7eb',
          borderRadius: 6,
          padding: '24px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}>
          <p style={{
            fontSize: current.size,
            lineHeight: 1.6,
            color: '#000',
            margin: 0,
            textAlign: 'center',
            fontFamily: 'serif',
            transition: 'font-size 0.3s',
          }}>
            {current.text}
          </p>
        </div>

        <div style={{ fontSize: 15, fontWeight: 600, textAlign: 'center', marginBottom: 16, color: '#374151' }}>
          {t('nearVision.question')}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => handleAnswer(true)}
            style={{
              flex: 1,
              padding: '18px',
              borderRadius: 6,
              background: '#ebf4ff',
              border: '2px solid #276749',
              color: '#15803d',
              fontSize: 17,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {t('nearVision.yesButton')}
          </button>
          <button
            onClick={() => handleAnswer(false)}
            style={{
              flex: 1,
              padding: '18px',
              borderRadius: 6,
              background: '#fef2f2',
              border: '2px solid #e74c3c',
              color: '#b91c1c',
              fontSize: 17,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {t('nearVision.noButton')}
          </button>
        </div>

        {/* Size progression indicator */}
        <div style={{ marginTop: 16, display: 'flex', gap: 4, justifyContent: 'center' }}>
          {TEXT_LEVELS.map((_, i) => (
            <div key={i} style={{
              width: 28,
              height: 6,
              borderRadius: 3,
              background: i === level ? '#1e3a5f' : i < level ? '#9ae6b4' : '#e5e7eb',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
