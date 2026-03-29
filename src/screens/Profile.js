import React from 'react';
import { AppShell, Header, BigButton, Disclaimer } from '../components/Layout';
import { useTranslation } from '../utils/useTranslation';

export default function Profile({ profile, setProfile, onNext, onBack, language = 'en' }) {
  const t = useTranslation(language);
  const update = (key, val) => setProfile(p => ({ ...p, [key]: val }));

  const isValid = profile.ageGroup && profile.who;

  const AGE_GROUPS = [
    { id: 'child', label: t('profile.child'), sublabel: t('profile.childAge') },
    { id: 'teen', label: t('profile.teen'), sublabel: t('profile.teenAge') },
    { id: 'adult', label: t('profile.adult'), sublabel: t('profile.adultAge') },
    { id: 'elder', label: t('profile.elder'), sublabel: t('profile.elderAge') },
  ];

  const WHO_OPTIONS = [
    { id: 'myself', label: t('profile.myself') },
    { id: 'child', label: t('profile.myChild') },
    { id: 'other', label: t('profile.someoneElse') },
  ];

  return (
    <AppShell language={language}>
      <Header
        title={t('profile.title')}
        subtitle={t('profile.subtitle')}
        onBack={onBack}
        language={language}
      />

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {/* Who is being tested */}
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: '#4a5568', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {t('profile.subjectLabel')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {WHO_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => update('who', opt.id)}
                style={{
                  padding: '12px 8px',
                  borderRadius: 6,
                  border: `1.5px solid ${profile.who === opt.id ? '#2c5282' : '#cbd5e0'}`,
                  background: profile.who === opt.id ? '#ebf4ff' : '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: profile.who === opt.id ? '#2c5282' : '#2d3748' }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Age group */}
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: '#4a5568', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {t('profile.ageGroupLabel')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {AGE_GROUPS.map(ag => (
              <button
                key={ag.id}
                onClick={() => update('ageGroup', ag.id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 6,
                  border: `1.5px solid ${profile.ageGroup === ag.id ? '#2c5282' : '#cbd5e0'}`,
                  background: profile.ageGroup === ag.id ? '#ebf4ff' : '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#1a202c' }}>{ag.label}</div>
                  <div style={{ fontSize: 11, color: '#718096', marginTop: 2 }}>{ag.sublabel}</div>
                </div>
                {profile.ageGroup === ag.id && (
                  <span style={{ color: '#2c5282', fontSize: 14 }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Clinical history */}
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: '#4a5568', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {t('profile.medicalHistory')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <QuickQuestion
              question={t('profile.diabetes')}
              value={profile.diabetes}
              onChange={v => update('diabetes', v)}
              t={t}
            />
            <QuickQuestion
              question={t('profile.glasses')}
              value={profile.glasses}
              onChange={v => update('glasses', v)}
              t={t}
            />
          </div>
        </div>

      </div>

      <div style={{
        padding: '12px 20px',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
        borderTop: '1px solid #e2e8f0',
        background: '#fff',
        flexShrink: 0,
      }}>
        <BigButton onClick={onNext} disabled={!isValid}>
          {t('profile.beginTests')}
        </BigButton>
        <Disclaimer language={language} />
      </div>
    </AppShell>
  );
}

function QuickQuestion({ question, value, onChange, t }) {
  return (
    <div style={{
      background: '#f7fafc',
      borderRadius: 6,
      padding: '12px 14px',
      border: '1px solid #e2e8f0',
    }}>
      <div style={{ fontWeight: 500, fontSize: 14, color: '#2d3748', marginBottom: 10 }}>{question}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {['yes', 'no', 'unsure'].map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              flex: 1,
              padding: '8px 6px',
              borderRadius: 4,
              border: `1.5px solid ${value === opt ? '#2c5282' : '#cbd5e0'}`,
              background: value === opt ? '#ebf4ff' : '#fff',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 12,
              color: value === opt ? '#2c5282' : '#718096',
              textTransform: 'capitalize',
              letterSpacing: 0.3,
            }}
          >
            {opt === 'yes' ? t('common.yes') : opt === 'no' ? t('common.no') : t('common.unknown')}
          </button>
        ))}
      </div>
    </div>
  );
}
