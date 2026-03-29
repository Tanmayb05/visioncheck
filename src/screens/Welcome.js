import React, { useState, useEffect } from 'react';
import { AppShell, BigButton, Disclaimer } from '../components/Layout';
import { speak } from '../utils/voice';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', native: 'English' },
  { code: 'fr', label: 'French', flag: '🇫🇷', native: 'Français' },
  { code: 'ar', label: 'Arabic', flag: '🇸🇦', native: 'العربية' },
  { code: 'sw', label: 'Swahili', flag: '🇰🇪', native: 'Kiswahili' },
];

export default function Welcome({ onStart, language, setLanguage }) {
  const [bright, setBright] = useState(null);

  useEffect(() => {
    speak('Welcome to VisionCheck. This app will test your eyes in about 10 minutes.', 'en-US');
  }, []);

  return (
    <AppShell>
      {/* Header */}
      <div style={{
        background: '#1e3a5f',
        color: '#fff',
        padding: '32px 24px 28px',
        borderBottom: '3px solid #2c5282',
      }}>
        <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.6, marginBottom: 8 }}>
          Eye Health Screening
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px', letterSpacing: 0.2 }}>
          VisionCheck
        </h1>
        <p style={{ fontSize: 14, opacity: 0.75, maxWidth: 280, margin: 0, lineHeight: 1.5 }}>
          A structured visual assessment covering 8 screening tests
        </p>
        <div style={{
          marginTop: 16,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 16,
          fontSize: 12,
          opacity: 0.65,
        }}>
          <span>Approx. 10 minutes</span>
          <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.3)' }} />
          <span>No equipment required</span>
        </div>
      </div>

      <div style={{
        padding: '20px',
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>

        {/* Language selection */}
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: '#4a5568', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Select Language
          </div>
          <div style={{ fontSize: 11, color: '#a0aec0', marginBottom: 10, fontStyle: 'italic' }}>
            Language only affects the AI summary at the end of the screening. The tests themselves are the same in all languages.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                style={{
                  padding: '12px',
                  borderRadius: 6,
                  border: `1.5px solid ${language === lang.code ? '#2c5282' : '#cbd5e0'}`,
                  background: language === lang.code ? '#ebf4ff' : '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 22 }}>{lang.flag}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#1a202c' }}>{lang.native}</div>
                  <div style={{ fontSize: 11, color: '#718096' }}>{lang.label}</div>
                </div>
                {language === lang.code && (
                  <span style={{ marginLeft: 'auto', color: '#2c5282', fontSize: 14 }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Brightness check */}
        <div style={{
          background: '#f7fafc',
          borderRadius: 6,
          padding: 14,
          border: '1px solid #cbd5e0',
        }}>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: '#2d3748' }}>
            Display Brightness Check
          </div>
          <div style={{ fontSize: 12, color: '#718096', marginBottom: 10 }}>
            For accurate results, your screen brightness should be at maximum.
          </div>
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 4,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
            fontSize: 12,
            color: '#a0aec0',
          }}>
            This area should appear clearly white
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setBright(true)}
              style={{
                flex: 1, padding: '9px 8px', borderRadius: 4,
                background: bright === true ? '#f0fff4' : '#fff',
                border: `1.5px solid ${bright === true ? '#276749' : '#cbd5e0'}`,
                fontWeight: 600, fontSize: 13, cursor: 'pointer', color: '#2d3748',
              }}
            >
              Adequate
            </button>
            <button
              onClick={() => setBright(false)}
              style={{
                flex: 1, padding: '9px 8px', borderRadius: 4,
                background: bright === false ? '#fff5f5' : '#fff',
                border: `1.5px solid ${bright === false ? '#c53030' : '#cbd5e0'}`,
                fontWeight: 600, fontSize: 13, cursor: 'pointer', color: '#2d3748',
              }}
            >
              Too Dim
            </button>
          </div>
          {bright === false && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#c05621', background: '#fffaf0', padding: '8px 10px', borderRadius: 4, border: '1px solid #fbd38d' }}>
              Please increase your screen brightness before proceeding.
            </div>
          )}
        </div>

        {/* AI summary info */}
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: 6,
          padding: '12px 14px',
          fontSize: 12,
          color: '#0369a1',
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>✨</span>
          <div>
            <strong>Powered by Google Gemini AI</strong>
            <div style={{ marginTop: 3, opacity: 0.85 }}>
              After your tests, Gemini AI analyses your results and generates a personalised clinical summary in your chosen language.
            </div>
          </div>
        </div>

        {/* Tests included */}
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: '#4a5568', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Tests Included
          </div>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
            {[
              'Visual Acuity',
              'Color Vision',
              'Astigmatism',
              'Contrast Sensitivity',
              'Near Vision',
              'Amsler Grid (Macular)',
              'Peripheral Vision',
              'Symptoms Review',
            ].map((item, i, arr) => (
              <div key={item} style={{
                padding: '9px 14px',
                fontSize: 13,
                color: '#2d3748',
                borderBottom: i < arr.length - 1 ? '1px solid #f0f4f8' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: '#fff',
              }}>
                <span style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: '#ebf4ff', color: '#2c5282',
                  fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer button — outside scroll area so it's always visible */}
      <div style={{
        padding: '12px 20px',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
        borderTop: '1px solid #e2e8f0',
        background: '#fff',
        flexShrink: 0,
      }}>
        <BigButton onClick={onStart}>
          Begin Assessment
        </BigButton>
        <Disclaimer />
      </div>
    </AppShell>
  );
}
