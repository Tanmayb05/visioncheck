import React, { useState, useEffect } from 'react';
import { AppShell, StatusBadge, Disclaimer } from '../components/Layout';
import {
  scoreAcuity, scoreColorVision, scoreAstigmatism, scoreContrast,
  scoreNearVision, scoreAmsler, scorePeripheral, scoreSymptoms,
  computeOverallUrgency,
} from '../utils/scoring';
import { analyzeResults } from '../utils/gemini';
import { speak } from '../utils/voice';
import { useTranslation } from '../utils/useTranslation';

function UrgencyBanner({ urgency, t }) {
  const URGENCY_CONFIG = {
    routine: { color: '#276749', bg: '#f0fff4', border: '#9ae6b4' },
    soon:    { color: '#c05621', bg: '#fffaf0', border: '#fbd38d' },
    urgent:  { color: '#c53030', bg: '#fff5f5', border: '#feb2b2' },
    emergency: { color: '#742a2a', bg: '#fff5f5', border: '#fc8181' },
  };
  const cfg = URGENCY_CONFIG[urgency] || URGENCY_CONFIG.routine;
  const label = t(`results.urgency.${urgency}.label`) || t('results.urgency.routine.label');
  const sub   = t(`results.urgency.${urgency}.sub`)   || t('results.urgency.routine.sub');
  return (
    <div style={{
      background: cfg.bg,
      border: `1.5px solid ${cfg.border}`,
      borderRadius: 6,
      padding: '14px 16px',
      marginBottom: 18,
      borderLeft: `4px solid ${cfg.color}`,
    }}>
      <div style={{ fontWeight: 700, fontSize: 15, color: cfg.color, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, color: cfg.color, opacity: 0.85, lineHeight: 1.5 }}>{sub}</div>
    </div>
  );
}

function AcuityExplanation({ va, label, t }) {
  const info = va ? t('results.acuityDescriptions')[va] : null;
  if (!info) return null;
  return (
    <div style={{
      marginTop: 6,
      background: '#f7fafc',
      borderRadius: 4,
      padding: '8px 10px',
      fontSize: 12,
      color: '#4a5568',
      lineHeight: 1.5,
    }}>
      <span style={{ fontWeight: 600, color: '#2d3748' }}>{label} ({va}) — {info.short}:</span> {info.plain}
    </div>
  );
}

function TestCard({ id, score, t, language }) {
  const [expanded, setExpanded] = useState(false);
  const testLabel = t(`results.testLabels.${id}`);
  const testDesc  = t(`results.testLabels.${id}Desc`);
  if (!testLabel || !score) return null;

  return (
    <div
      onClick={() => setExpanded(e => !e)}
      style={{
        background: '#fff',
        borderRadius: 6,
        border: '1px solid #e2e8f0',
        borderLeft: `3px solid ${score.status === 'fail' ? '#c53030' : score.status === 'warn' ? '#c05621' : '#276749'}`,
        padding: '12px 14px',
        marginBottom: 8,
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#1a202c' }}>{testLabel}</div>
          <div style={{ fontSize: 12, color: '#718096', marginTop: 2 }}>{testDesc}</div>
        </div>
        <StatusBadge status={score.status} size="sm" language={language} />
        <span style={{ color: '#a0aec0', fontSize: 11, marginLeft: 4 }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: '1px solid #f0f4f8',
          fontSize: 13,
          color: '#4a5568',
          lineHeight: 1.6,
        }}>
          {id === 'acuity' && (
            <div>
              <div>{t('results.details.rightEye')}: <strong>{score.right?.va || '—'}</strong></div>
              <div>{t('results.details.leftEye')}: <strong>{score.left?.va || '—'}</strong></div>
              <AcuityExplanation va={score.right?.va} label={t('results.details.rightEye')} t={t} />
              <AcuityExplanation va={score.left?.va} label={t('results.details.leftEye')} t={t} />
              {score.status !== 'pass' && <div style={{ color: '#c05621', marginTop: 6 }}>{t('results.details.acuityWarn')}</div>}
            </div>
          )}
          {id === 'color' && (
            <div>
              <div>{t('results.details.colorPlates')(score.correct, score.total)}</div>
              {score.status !== 'pass' && <div style={{ color: '#c05621', marginTop: 6 }}>{t('results.details.colorWarn')}</div>}
            </div>
          )}
          {id === 'astigmatism' && (
            <div>
              {score.allSame
                ? t('results.details.astigmatismNone')
                : t('results.details.astigmatismFound')(score.affected)}
              {score.status !== 'pass' && <div style={{ color: '#c05621', marginTop: 6 }}>{t('results.details.astigmatismWarn')}</div>}
            </div>
          )}
          {id === 'contrast' && (
            <div>
              <div>{t('results.details.contrastPassed')(score.level + 1)}</div>
              {score.status !== 'pass' && <div style={{ color: '#c05621', marginTop: 6 }}>{t('results.details.contrastWarn')}</div>}
            </div>
          )}
          {id === 'near' && (
            <div>
              {score.status === 'pass' ? t('results.details.nearPass') : t('results.details.nearFail')}
              {score.status !== 'pass' && <div style={{ color: '#c05621', marginTop: 6 }}>{t('results.details.nearWarn')}</div>}
            </div>
          )}
          {id === 'amsler' && (
            <div>
              {score.rightIssues && <div>{t('results.details.amslerRightIssue')}</div>}
              {score.leftIssues && <div>{t('results.details.amslerLeftIssue')}</div>}
              {!score.rightIssues && !score.leftIssues && <div>{t('results.details.amslerNone')}</div>}
              {(score.rightIssues || score.leftIssues) && (
                <div style={{ color: '#c53030', marginTop: 6, fontWeight: 600 }}>
                  {t('results.details.amslerWarn')}
                </div>
              )}
            </div>
          )}
          {id === 'peripheral' && (
            <div>
              <div>{t('results.details.peripheralDetected')(score.total - score.missed, score.total)}</div>
              {score.status !== 'pass' && <div style={{ color: '#c05621', marginTop: 6 }}>{t('results.details.peripheralWarn')}</div>}
            </div>
          )}
          {id === 'symptoms' && (
            <div>
              {score.hasUrgent?.length > 0 && (
                <div style={{ color: '#c53030', fontWeight: 600 }}>
                  {t('results.details.symptomsUrgent')(score.hasUrgent.join(', '))}
                </div>
              )}
              {score.hasSoon?.length > 0 && (
                <div style={{ color: '#c05621' }}>
                  {t('results.details.symptomsSoon')(score.hasSoon.join(', '))}
                </div>
              )}
              {score.status === 'pass' && <div>{t('results.details.symptomsNone')}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Results({ testData, profile, language, geminiKey, onRetake }) {
  const t = useTranslation(language);
  const [aiSummary, setAiSummary] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const scores = {
    acuity: testData.acuity ? scoreAcuity(testData.acuity) : null,
    color: testData.color ? scoreColorVision(testData.color) : null,
    astigmatism: testData.astigmatism ? scoreAstigmatism(testData.astigmatism) : null,
    contrast: testData.contrast ? scoreContrast(testData.contrast) : null,
    near: testData.near ? scoreNearVision(testData.near) : null,
    amsler: testData.amsler ? scoreAmsler(testData.amsler) : null,
    peripheral: testData.peripheral ? scorePeripheral(testData.peripheral) : null,
    symptoms: testData.symptoms ? scoreSymptoms(testData.symptoms) : null,
  };

  const validScores = Object.fromEntries(Object.entries(scores).filter(([, v]) => v !== null));
  const overallUrgency = computeOverallUrgency(validScores);

  // Local summary from translations
  const localSummary = t('results.localSummary')[overallUrgency] || t('results.localSummary.routine');

  useEffect(() => {
    speak(t('results.voice'), language);

    if (geminiKey) {
      setLoadingAI(true);
      analyzeResults(validScores, profile, geminiKey, language)
        .then(s => { setAiSummary(s); setLoadingAI(false); })
        .catch(() => setLoadingAI(false));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const urgencyLabel = t(`results.urgency.${overallUrgency}.label`) || t('results.urgency.routine.label');

  const handleShare = () => {
    const lines = [
      t('results.shareHeader'),
      '─────────────────────────────────',
      ...Object.entries(scores)
        .filter(([, v]) => v)
        .map(([k, v]) => `${t(`results.testLabels.${k}`)}: ${v.status?.toUpperCase()}`),
      '─────────────────────────────────',
      `${t('results.urgency.routine.label').split(' ')[0]}: ${urgencyLabel}`,
      '',
      t('results.shareDisclaimer1'),
      t('results.shareDisclaimer2'),
    ];
    const text = lines.join('\n');

    if (navigator.share) {
      navigator.share({ title: 'OptiVision Results', text });
    } else {
      navigator.clipboard?.writeText(text);
      alert(t('results.resultsCopied'));
    }
  };

  const handleWhatsApp = () => {
    const lines = [
      `*${t('results.shareHeader')}*`,
      Object.entries(scores)
        .filter(([, v]) => v)
        .map(([k, v]) => `${t(`results.testLabels.${k}`)}: *${v.status?.toUpperCase()}*`)
        .join('\n'),
      `\nOverall: *${urgencyLabel}*`,
      `\n${t('results.whatsappDisclaimer')}`,
    ].join('\n');
    window.open(`https://wa.me/?text=${encodeURIComponent(lines)}`);
  };

  const handleFindClinics = () => {
    window.open('https://www.google.com/maps/search/eye+clinic+near+me', '_blank');
  };

  return (
    <AppShell language={language}>
      {/* Header */}
      <div style={{
        background: '#1e3a5f',
        color: '#fff',
        padding: '20px 20px 18px',
        borderBottom: '3px solid #2c5282',
      }}>
        <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.6, marginBottom: 6 }}>
          {t('results.assessmentComplete')}
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>{t('results.screeningReport')}</h1>
        <p style={{ fontSize: 13, opacity: 0.65, margin: 0 }}>
          {t('results.testsCompleted')(Object.values(scores).filter(Boolean).length)}
        </p>
      </div>

      <div style={{ padding: '18px 16px', overflowY: 'auto', flex: 1 }}>
        {/* Urgency banner */}
        <UrgencyBanner urgency={overallUrgency} t={t} />

        {/* Summary */}
        <div style={{
          background: '#f7fafc',
          borderRadius: 6,
          padding: '14px',
          marginBottom: 18,
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#2d3748', display: 'flex', alignItems: 'center', gap: 6 }}>
            {geminiKey ? t('results.clinicalSummaryAI') : t('results.summary')}
            {loadingAI && <span style={{ fontSize: 11, color: '#718096', fontWeight: 400 }}>{t('results.analyzing')}</span>}
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: '#4a5568', margin: 0 }}>
            {aiSummary || localSummary}
          </p>
        </div>

        {/* Per-test results */}
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: '#4a5568', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {t('results.individualResults')}
        </div>
        {Object.entries(scores).map(([id, score]) =>
          score ? <TestCard key={id} id={id} score={score} t={t} language={language} /> : null
        )}

        {/* Find Eye Clinics */}
        <button
          onClick={handleFindClinics}
          style={{
            marginTop: 18,
            width: '100%',
            padding: '14px',
            borderRadius: 6,
            background: '#276749',
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            letterSpacing: 0.2,
          }}
        >
          {t('results.findClinics')}
        </button>

        {/* Share buttons */}
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: '#4a5568', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {t('results.shareReport')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button onClick={handleWhatsApp} style={shareBtnStyle('#25d366', '#fff')}>
              {t('results.whatsapp')}
            </button>
            <button onClick={handleShare} style={shareBtnStyle('#2c5282', '#fff')}>
              {t('results.share')}
            </button>
          </div>
        </div>

        {/* Disclaimer + retake */}
        <div style={{ marginTop: 18 }}>
          <Disclaimer language={language} />
          <button
            onClick={onRetake}
            style={{
              width: '100%',
              marginTop: 10,
              padding: '12px',
              borderRadius: 6,
              background: '#f7fafc',
              border: '1px solid #cbd5e0',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              color: '#4a5568',
              letterSpacing: 0.2,
            }}
          >
            {t('results.repeatAssessment')}
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function shareBtnStyle(bg, color) {
  return {
    padding: '12px',
    borderRadius: 6,
    background: bg,
    color: color,
    fontSize: 14,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    letterSpacing: 0.2,
  };
}
