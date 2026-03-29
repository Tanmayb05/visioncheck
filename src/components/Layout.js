import React from 'react';
import { useViewport } from '../hooks/useViewport';

export function AppShell({ children }) {
  const viewport = useViewport();
  const viewportClassName = [
    'app-frame',
    viewport.isSmallPhone ? 'viewport-small-phone' : '',
    viewport.isPhone && !viewport.isSmallPhone ? 'viewport-phone' : '',
    viewport.isTablet ? 'viewport-tablet' : '',
    viewport.isDesktop ? 'viewport-desktop' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={viewportClassName}>
      <div
        className="app-shell"
        style={{
          '--app-shell-max-width': `${viewport.shellMaxWidth}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function Screen({ children, style = {} }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function Header({ title, subtitle, onBack, step, totalSteps }) {
  return (
    <div className="app-header" style={{
      background: '#1e3a5f',
      color: '#fff',
      padding: '0.875rem var(--shell-padding-x) 1rem',
      position: 'relative',
      borderBottom: '3px solid #2c5282',
    }}>
      {onBack && (
        <button
          onClick={onBack}
          className="header-back-button"
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 4,
            padding: '0.375rem 0.75rem',
            color: '#fff',
            fontSize: '0.8125rem',
            marginBottom: '0.625rem',
            cursor: 'pointer',
            letterSpacing: 0.3,
          }}
          aria-label="Go back"
        >
          ← Back
        </button>
      )}
      {step && totalSteps && (
        <div style={{ marginBottom: '0.625rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.75rem', opacity: 0.75, letterSpacing: 0.4, textTransform: 'uppercase' }}>
            <span>Test {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 2, height: 4 }}>
            <div style={{
              background: '#90cdf4',
              width: `${(step / totalSteps) * 100}%`,
              height: '100%',
              borderRadius: 2,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      )}
      <div>
        <div className="app-header-title" style={{ fontSize: '1.0625rem', fontWeight: 600, letterSpacing: 0.2 }}>{title}</div>
        {subtitle && <div className="app-header-subtitle" style={{ fontSize: '0.8125rem', opacity: 0.7, marginTop: 3 }}>{subtitle}</div>}
      </div>
    </div>
  );
}

export function Card({ children, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 6,
        border: '1px solid #cbd5e0',
        padding: 16,
        margin: '0 0 10px 0',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function BigButton({ children, onClick, color = '#1e3a5f', textColor = '#fff', icon, disabled, style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="big-button"
      style={{
        width: '100%',
        background: disabled ? '#e2e8f0' : color,
        color: disabled ? '#a0aec0' : textColor,
        borderRadius: 6,
        padding: '0.9375rem 1.25rem',
        fontSize: '1rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.625rem',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'opacity 0.1s',
        marginBottom: '0.625rem',
        minHeight: '3.25rem',
        letterSpacing: 0.3,
        ...style,
      }}
      onTouchStart={e => { if (!disabled) e.currentTarget.style.opacity = '0.88'; }}
      onTouchEnd={e => { e.currentTarget.style.opacity = '1'; }}
    >
      {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
      {children}
    </button>
  );
}

export function DirectionButton({ direction, onClick, size = 72 }) {
  const arrows = { up: '↑', down: '↓', left: '←', right: '→' };
  const sizeFallback = `${size}px`;
  return (
    <button
      onClick={onClick}
      className="direction-button"
      style={{
        width: `var(--direction-button-size, ${sizeFallback})`,
        height: `var(--direction-button-size, ${sizeFallback})`,
        borderRadius: 6,
        background: '#f7fafc',
        border: '1.5px solid #a0aec0',
        color: '#2d3748',
        fontSize: `calc(var(--direction-button-size, ${sizeFallback}) * 0.4)`,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background 0.1s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onTouchStart={e => { e.currentTarget.style.background = '#ebf4ff'; }}
      onTouchEnd={e => { e.currentTarget.style.background = '#f7fafc'; }}
    >
      {arrows[direction]}
    </button>
  );
}

export function StatusBadge({ status, size = 'md' }) {
  const colors = {
    pass: { bg: '#f0fff4', text: '#276749', border: '#9ae6b4' },
    warn: { bg: '#fffaf0', text: '#c05621', border: '#fbd38d' },
    fail: { bg: '#fff5f5', text: '#c53030', border: '#feb2b2' },
    default: { bg: '#f7fafc', text: '#718096', border: '#cbd5e0' },
  };
  const labels = { pass: 'Normal', warn: 'Monitor', fail: 'Refer' };
  const c = colors[status] || colors.default;
  return (
    <span style={{
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
      borderRadius: 3,
      padding: size === 'sm' ? '2px 8px' : '4px 10px',
      fontSize: size === 'sm' ? '0.6875rem' : '0.8125rem',
      fontWeight: 600,
      letterSpacing: 0.3,
      textTransform: 'uppercase',
    }}>
      {labels[status] || 'Pending'}
    </span>
  );
}

export function VoiceButton({ onClick, speaking }) {
  return (
    <button
      onClick={onClick}
      className="voice-button"
      style={{
        background: speaking ? '#ebf8ff' : '#f7fafc',
        border: `1px solid ${speaking ? '#90cdf4' : '#cbd5e0'}`,
        borderRadius: 4,
        padding: '0.4375rem 0.75rem',
        fontSize: '1rem',
        cursor: 'pointer',
        color: speaking ? '#2b6cb0' : '#4a5568',
      }}
      aria-label="Play voice instructions"
    >
      {speaking ? '🔊' : '🔈'}
    </button>
  );
}

export function EyeCoverInstruction({ eye }) {
  return (
    <div className="eye-cover-instruction" style={{
      background: '#ebf8ff',
      border: '1px solid #90cdf4',
      borderRadius: 6,
      padding: '0.625rem 0.875rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.625rem',
      margin: '0 0 0.875rem 0',
    }}>
      <div style={{
        width: '2rem', height: '2rem', borderRadius: '50%',
        background: '#2b6cb0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: '1rem', flexShrink: 0,
      }}>
        {eye === 'right' ? 'R' : 'L'}
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#1a202c' }}>
          Cover your {eye === 'right' ? 'RIGHT' : 'LEFT'} eye
        </div>
        <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: 2 }}>
          Use your hand or paper. Keep both eyes open.
        </div>
      </div>
    </div>
  );
}

export function Disclaimer() {
  return (
    <div className="disclaimer" style={{
      background: '#fffaf0',
      border: '1px solid #fbd38d',
      borderRadius: 4,
      padding: '0.5625rem 0.8125rem',
      fontSize: '0.6875rem',
      color: '#744210',
      textAlign: 'center',
      letterSpacing: 0.2,
    }}>
      Screening tool only — not a substitute for professional medical diagnosis. Consult a qualified eye care provider.
    </div>
  );
}
