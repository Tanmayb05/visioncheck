import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppShell, Header } from '../components/Layout';
import { speak } from '../utils/voice';

const TOTAL_DOTS = 15;
const DOT_DURATION = 1200; // ms each dot is visible
const PAUSE_BETWEEN = 800;

export default function PeripheralTest({ onComplete, onBack, step, totalSteps }) {
  const [phase, setPhase] = useState('intro'); // intro | running | done
  const [currentDot, setCurrentDot] = useState(null);
  const [tapped, setTapped] = useState(false);
  const [results, setResults] = useState({ seen: 0, missed: 0, total: 0 });
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const dotIndexRef = useRef(0);

  useEffect(() => {
    speak('Keep looking at the center dot. Tap the screen as soon as you see any dot appear anywhere else on the screen.');
  }, []);

  const showNextDot = useCallback(() => {
    if (dotIndexRef.current >= TOTAL_DOTS) {
      setCurrentDot(null);
      setPhase('done');
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const w = container.offsetWidth;
    const h = container.offsetHeight;
    const margin = 40;
    const centerX = w / 2;
    const centerY = h / 2;
    const minDist = 80;

    // Place dot away from center
    let x, y, dist;
    do {
      x = margin + Math.random() * (w - 2 * margin);
      y = margin + Math.random() * (h - 2 * margin);
      dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    } while (dist < minDist);

    const dot = { x, y, id: dotIndexRef.current };
    dotIndexRef.current++;
    setCurrentDot(dot);
    setTapped(false);

    timerRef.current = setTimeout(() => {
      setResults(prev => ({ ...prev, missed: prev.missed + 1, total: prev.total + 1 }));
      setCurrentDot(null);
      timerRef.current = setTimeout(showNextDot, PAUSE_BETWEEN);
    }, DOT_DURATION);
  }, []);

  const handleStart = () => {
    setPhase('running');
    dotIndexRef.current = 0;
    timerRef.current = setTimeout(showNextDot, 1000);
  };

  const handleTap = useCallback(() => {
    if (phase !== 'running' || !currentDot || tapped) return;
    clearTimeout(timerRef.current);
    setTapped(true);
    setResults(prev => ({ ...prev, seen: prev.seen + 1, total: prev.total + 1 }));
    setCurrentDot(null);
    timerRef.current = setTimeout(showNextDot, PAUSE_BETWEEN);
  }, [phase, currentDot, tapped, showNextDot]);

  useEffect(() => {
    if (phase === 'done') {
      clearTimeout(timerRef.current);
      onComplete({ missed: results.missed, total: results.total || TOTAL_DOTS });
    }
  }, [phase, results, onComplete]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const progress = Math.round((results.total / TOTAL_DOTS) * 100);

  return (
    <AppShell>
      <Header
        title="Peripheral Vision"
        subtitle="Keep focus on the center"
        
        onBack={onBack}
        step={step}
        totalSteps={totalSteps}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {phase === 'intro' ? (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              background: '#fffbeb',
              border: '1.5px solid #fcd34d',
              borderRadius: 6,
              padding: 16,
              fontSize: 14,
              color: '#92400e',
            }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Instructions:</div>
              <ol style={{ paddingLeft: 20, lineHeight: 1.8 }}>
                <li>Stare at the <strong>green center dot</strong></li>
                <li>Keep your eyes focused there — don't look away</li>
                <li>Tap the screen when you see a <strong>red dot appear</strong> anywhere</li>
                <li>Try to tap it before it disappears</li>
              </ol>
            </div>
            <button
              onClick={handleStart}
              style={{
                padding: '18px',
                borderRadius: 6,
                background: '#1e3a5f',
                color: '#fff',
                fontSize: 18,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ▶ Start Test
            </button>
          </div>
        ) : (
          <div
            ref={containerRef}
            onClick={handleTap}
            style={{
              flex: 1,
              background: '#f9fafb',
              position: 'relative',
              cursor: 'crosshair',
              userSelect: 'none',
            }}
          >
            {/* Progress bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 4,
              background: '#e5e7eb',
            }}>
              <div style={{
                height: '100%',
                background: '#1e3a5f',
                width: `${progress}%`,
                transition: 'width 0.3s',
              }} />
            </div>

            {/* Center fixation dot */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: '#1e3a5f',
              border: '3px solid #fff',
              boxShadow: '0 0 0 2px #1e3a5f',
              zIndex: 10,
            }} />

            {/* Peripheral dot */}
            {currentDot && (
              <div style={{
                position: 'absolute',
                left: currentDot.x - 14,
                top: currentDot.y - 14,
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#e74c3c',
                boxShadow: '0 0 8px rgba(231,76,60,0.5)',
                animation: 'fadeIn 0.1s',
              }} />
            )}

            {/* Stats overlay */}
            <div style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(255,255,255,0.9)',
              borderRadius: 10,
              padding: '6px 12px',
              fontSize: 12,
              color: '#6b7280',
              fontWeight: 600,
            }}>
              {results.total}/{TOTAL_DOTS}
            </div>

            <div style={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 12,
              color: '#9ca3af',
              textAlign: 'center',
              pointerEvents: 'none',
            }}>
              Tap when you see a red dot
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
