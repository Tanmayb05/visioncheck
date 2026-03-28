import React from 'react';

export function AppShell({ children }) {
  return (
    <div style={{
      maxWidth: 480,
      margin: '0 auto',
      height: '100dvh',
      minHeight: '100dvh',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'hidden',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      {children}
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
    <div style={{
      background: '#1e3a5f',
      color: '#fff',
      padding: '14px 20px 16px',
      position: 'relative',
      borderBottom: '3px solid #2c5282',
    }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 4,
            padding: '6px 12px',
            color: '#fff',
            fontSize: 13,
            marginBottom: 10,
            cursor: 'pointer',
            letterSpacing: 0.3,
          }}
          aria-label="Go back"
        >
          ← Back
        </button>
      )}
      {step && totalSteps && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12, opacity: 0.75, letterSpacing: 0.4, textTransform: 'uppercase' }}>
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
        <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: 0.2 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, opacity: 0.7, marginTop: 3 }}>{subtitle}</div>}
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
      style={{
        width: '100%',
        background: disabled ? '#e2e8f0' : color,
        color: disabled ? '#a0aec0' : textColor,
        borderRadius: 6,
        padding: '15px 20px',
        fontSize: 16,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'opacity 0.1s',
        marginBottom: 10,
        minHeight: 52,
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
  return (
    <button
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        background: '#f7fafc',
        border: '1.5px solid #a0aec0',
        color: '#2d3748',
        fontSize: size * 0.4,
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
      fontSize: size === 'sm' ? 11 : 13,
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
      style={{
        background: speaking ? '#ebf8ff' : '#f7fafc',
        border: `1px solid ${speaking ? '#90cdf4' : '#cbd5e0'}`,
        borderRadius: 4,
        padding: '7px 12px',
        fontSize: 16,
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
    <div style={{
      background: '#ebf8ff',
      border: '1px solid #90cdf4',
      borderRadius: 6,
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      margin: '0 0 14px 0',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: '#2b6cb0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 16, flexShrink: 0,
      }}>
        {eye === 'right' ? 'R' : 'L'}
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 13, color: '#1a202c' }}>
          Cover your {eye === 'right' ? 'RIGHT' : 'LEFT'} eye
        </div>
        <div style={{ fontSize: 12, color: '#718096', marginTop: 2 }}>
          Use your hand or paper. Keep both eyes open.
        </div>
      </div>
    </div>
  );
}

export function Disclaimer() {
  return (
    <div style={{
      background: '#fffaf0',
      border: '1px solid #fbd38d',
      borderRadius: 4,
      padding: '9px 13px',
      fontSize: 11,
      color: '#744210',
      textAlign: 'center',
      letterSpacing: 0.2,
    }}>
      Screening tool only — not a substitute for professional medical diagnosis. Consult a qualified eye care provider.
    </div>
  );
}
