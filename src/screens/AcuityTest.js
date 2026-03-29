import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppShell, Header, DirectionButton, EyeCoverInstruction } from '../components/Layout';
import { speak } from '../utils/voice';

// Snellen-equivalent lines: index = line number, value = denominator (20/X)
const LINES = [200, 100, 70, 50, 40, 30, 25, 20, 15];
const DIRECTIONS = ['up', 'down', 'left', 'right'];

// Plain-English context for each VA level
const VA_CONTEXT = {
  200: 'Legal blindness threshold — can see at 20 ft what normal vision sees at 200 ft',
  100: 'Severe impairment — large signs only',
  70:  'Significant blur — large print only',
  50:  'Moderate blur — standard print is difficult',
  40:  'Borderline — DMV limit in many regions',
  30:  'Mildly reduced vision',
  25:  'Near-normal vision',
  20:  'Normal (20/20)',
  15:  'Better than average vision',
};

// Size in vw for each line (decreasing)
const SIZES = [22, 18, 15, 12, 10, 8, 6.5, 5.5, 4.5];

function TumblingE({ direction, size }) {
  const rotations = { up: 0, right: 90, down: 180, left: 270 };
  return (
    <div style={{
      fontSize: `${size}vw`,
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

export default function AcuityTest({ onComplete, onBack, step, totalSteps }) {
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
      ? 'Cover your LEFT eye. Look at the E and swipe which direction it points.'
      : 'Now cover your RIGHT eye. Which direction does the E point?';
    speak(msg);
  }, [phase, randomDir]);

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
  const vaContext = VA_CONTEXT[vaLine];

  return (
    <AppShell>
      <Header
        title="Visual Acuity"
        subtitle={`${phase === 'right' ? 'Right Eye' : 'Left Eye'} — ${vaLabel}`}
        
        onBack={onBack}
        step={step}
        totalSteps={totalSteps}
      />

      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <EyeCoverInstruction eye={phase === 'right' ? 'left' : 'right'} />

        <div style={{
          fontSize: 13,
          color: '#6b7280',
          marginBottom: 12,
          textAlign: 'center',
        }}>
          Swipe the direction the E is pointing, or tap an arrow below
        </div>

        {/* E display area */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            border: `3px solid ${feedback === 'correct' ? '#276749' : feedback === 'wrong' ? '#e74c3c' : '#e5e7eb'}`,
            borderRadius: 6,
            marginBottom: 20,
            minHeight: 200,
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <DirectionButton direction="up" onClick={() => handleAnswer('up')} />
          <div style={{ display: 'flex', gap: 20 }}>
            <DirectionButton direction="left" onClick={() => handleAnswer('left')} />
            <div style={{ width: 72, height: 72 }} />
            <DirectionButton direction="right" onClick={() => handleAnswer('right')} />
          </div>
          <DirectionButton direction="down" onClick={() => handleAnswer('down')} />
        </div>

        {/* Progress for this eye */}
        <div style={{
          textAlign: 'center',
          fontSize: 13,
          color: '#6b7280',
        }}>
          Line {lineIdx + 1} of {LINES.length} · {vaLabel}
        </div>
        {vaContext && (
          <div style={{
            marginTop: 6,
            textAlign: 'center',
            fontSize: 11,
            color: '#9ca3af',
            fontStyle: 'italic',
            paddingBottom: 4,
          }}>
            {vaContext}
          </div>
        )}
      </div>
    </AppShell>
  );
}
