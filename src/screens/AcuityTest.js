import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppShell, Header, DirectionButton, EyeCoverInstruction } from '../components/Layout';
import { useViewport } from '../hooks/useViewport';
import { speak } from '../utils/voice';
import { useTranslation } from '../utils/useTranslation';

// Snellen-equivalent lines: index = line number, value = denominator (20/X)
const LINES = [200, 100, 70, 50, 40, 30, 25, 20, 15];
const DIRECTIONS = ['up', 'down', 'left', 'right'];

// Size in vw for each line (decreasing)
const SIZES = [22, 18, 15, 12, 10, 8, 6.5, 5.5, 4.5];

function TumblingE({ direction, size }) {
  // E faces right at 0°; rotate so the open side (lines) point in the given direction
  const rotations = { right: 0, down: 90, left: 180, up: 270 };
  return (
    <div className="tumbling-e" style={{
      fontSize: `min(${size}vw, calc(var(--app-shell-max-width, 480px) * ${size / 100}))`,
      fontWeight: 900,
      fontFamily: 'monospace',
      userSelect: 'none',
      lineHeight: 1,
      transform: `rotate(${rotations[direction]}deg)`,
      transition: 'font-size 0.3s',
      color: '#000',
      display: 'inline-block',
    }}>
      E
    </div>
  );
}

export default function AcuityTest({ onComplete, onBack, step, totalSteps, language = 'en' }) {
  const viewport = useViewport();
  const t = useTranslation(language);
  const [phase, setPhase] = useState('right'); // 'right' | 'left' | 'done'
  const [lineIdx, setLineIdx] = useState(0);
  const [direction, setDirection] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [results, setResults] = useState({ right: null, left: null });
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const touchStart = useRef(null);

  const randomDir = useCallback(() => {
    return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
  }, []);

  useEffect(() => {
    setDirection(randomDir());
    const msg = phase === 'right'
      ? t('acuity.voiceRight')
      : t('acuity.voiceLeft');
    speak(msg, language);
  }, [phase, randomDir]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setDirection(randomDir());
  }, [lineIdx, randomDir]);

  const handleAnswer = useCallback((answer) => {
    const correct = answer === direction;
    setFeedback(correct ? 'correct' : 'wrong');

    setTimeout(() => {
      setFeedback(null);
      if (correct) {
        const nextLine = lineIdx + 1;
        if (nextLine >= LINES.length) {
          // Reached max — record best
          finishEye(lineIdx);
        } else {
          setLineIdx(nextLine);
          setAttempts(0);
        }
      } else {
        const newAttempts = attempts + 1;
        if (newAttempts >= 2) {
          // Failed twice at this line
          finishEye(lineIdx - 1);
        } else {
          setAttempts(newAttempts);
          setDirection(randomDir());
        }
      }
    }, 600);
  }, [direction, lineIdx, attempts, randomDir]); // eslint-disable-line react-hooks/exhaustive-deps

  const finishEye = useCallback((lastGoodLine) => {
    const finalLine = Math.max(0, lastGoodLine);
    if (phase === 'right') {
      setResults(r => ({ ...r, right: finalLine }));
      setPhase('left');
      setLineIdx(0);
      setAttempts(0);
    } else {
      const finalResults = { right: results.right, left: finalLine };
      setPhase('done');
      onComplete(finalResults);
    }
  }, [phase, results.right, onComplete]);

  // Swipe detection
  const handleTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      handleAnswer(dx > 0 ? 'right' : 'left');
    } else {
      handleAnswer(dy > 0 ? 'down' : 'up');
    }
    touchStart.current = null;
  };

  const size = SIZES[Math.min(lineIdx, SIZES.length - 1)];
  const vaLine = LINES[lineIdx];
  const vaLabel = `20/${vaLine}`;
  const directionButtonSize = viewport.isSmallPhone ? 64 : viewport.isTablet ? 88 : viewport.isDesktop ? 96 : 72;

  return (
    <AppShell language={language}>
      <Header
        title={t('acuity.title')}
        subtitle={`${phase === 'right' ? t('acuity.rightEye') : t('acuity.leftEye')} — ${vaLabel}`}
        onBack={onBack}
        step={step}
        totalSteps={totalSteps}
        language={language}
      />

      <div className="acuity-screen" style={{ padding: '1rem var(--shell-padding-x)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <EyeCoverInstruction eye={phase === 'right' ? 'left' : 'right'} language={language} />

        <div className="acuity-instructions" style={{
          fontSize: '0.8125rem',
          color: '#6b7280',
          marginBottom: '0.75rem',
          textAlign: 'center',
        }}>
          {t('acuity.instructions')}
        </div>

        {/* E display area */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="acuity-display"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            border: `3px solid ${feedback === 'correct' ? '#276749' : feedback === 'wrong' ? '#e74c3c' : '#e5e7eb'}`,
            borderRadius: 6,
            marginBottom: '1.25rem',
            minHeight: viewport.isSmallPhone ? 180 : viewport.isTablet ? 320 : 200,
            transition: 'border-color 0.3s',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <TumblingE direction={direction} size={size} />
          {feedback && (
            <div style={{
              position: 'absolute',
              top: 12,
              right: 12,
              fontSize: 28,
              animation: 'fadeIn 0.2s',
            }}>
              {feedback === 'correct' ? '✓' : '✗'}
            </div>
          )}
        </div>

        {/* Direction buttons */}
        <div
          className="acuity-controls"
          style={{
            '--direction-button-size': `${directionButtonSize}px`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.625rem',
            marginBottom: '1rem',
          }}
        >
          <DirectionButton direction="up" onClick={() => handleAnswer('up')} size={directionButtonSize} />
          <div style={{ display: 'flex', gap: viewport.isSmallPhone ? 16 : 20 }}>
            <DirectionButton direction="left" onClick={() => handleAnswer('left')} size={directionButtonSize} />
            <div style={{ width: directionButtonSize, height: directionButtonSize }} />
            <DirectionButton direction="right" onClick={() => handleAnswer('right')} size={directionButtonSize} />
          </div>
          <DirectionButton direction="down" onClick={() => handleAnswer('down')} size={directionButtonSize} />
        </div>

        {/* Progress for this eye */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.8125rem',
          color: '#6b7280',
        }}>
          {t('acuity.lineOf')(lineIdx + 1, LINES.length, vaLabel)}
        </div>
      </div>
    </AppShell>
  );
}
