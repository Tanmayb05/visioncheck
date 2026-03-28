import React, { useState, useEffect } from 'react';
import { AppShell, StatusBadge, Disclaimer } from '../components/Layout';
import {
  scoreAcuity, scoreColorVision, scoreAstigmatism, scoreContrast,
  scoreNearVision, scoreAmsler, scorePeripheral, scoreSymptoms,
  computeOverallUrgency,
} from '../utils/scoring';
import { analyzeResults, getLocalSummary } from '../utils/gemini';
import { speak } from '../utils/voice';

const TEST_LABELS = {
  acuity: { label: 'Visual Acuity', desc: 'Distance vision clarity' },
  color: { label: 'Color Vision', desc: 'Color discrimination ability' },
  astigmatism: { label: 'Astigmatism', desc: 'Corneal shape regularity' },
  contrast: { label: 'Contrast Sensitivity', desc: 'Detection of subtle luminance differences' },
  near: { label: 'Near Vision', desc: 'Reading and close-range vision' },
  amsler: { label: 'Macular Health', desc: 'Central vision and grid distortion' },
  peripheral: { label: 'Peripheral Vision', desc: 'Visual field (side vision)' },
  symptoms: { label: 'Symptoms Review', desc: 'Self-reported visual concerns' },
};

const URGENCY_CONFIG = {
  routine: {
    color: '#276749', bg: '#f0fff4', border: '#9ae6b4',
    label: 'No Significant Findings',
    sub: 'Results are within normal range. Routine annual check recommended.',
  },
  soon: {
    color: '#c05621', bg: '#fffaf0', border: '#fbd38d',
    label: 'Follow-Up Recommended',
    sub: 'Schedule an appointment with an eye care provider within the next few months.',
  },
  urgent: {
    color: '#c53030', bg: '#fff5f5', border: '#feb2b2',
    label: 'Clinical Evaluation Advised',
    sub: 'We recommend seeing an eye doctor within 1–2 weeks.',
  },
  emergency: {
    color: '#742a2a', bg: '#fff5f5', border: '#fc8181',
    label: 'Seek Immediate Care',
    sub: 'Please proceed to a clinic or emergency eye care facility promptly.',
  },
};

function UrgencyBanner({ urgency }) {
  const cfg = URGENCY_CONFIG[urgency] || URGENCY_CONFIG.routine;
  return (
    <div style={{
      background: cfg.bg,
      border: `1.5px solid ${cfg.border}`,
      borderRadius: 6,
      padding: '14px 16px',
      marginBottom: 18,
      borderLeft: `4px solid ${cfg.color}`,
    }}>
      <div style={{ fontWeight: 700, fontSize: 15, color: cfg.color, marginBottom: 4 }}>{cfg.label}</div>
      <div style={{ fontSize: 13, color: cfg.color, opacity: 0.85, lineHeight: 1.5 }}>{cfg.sub}</div>
    </div>
  );
}

function TestCard({ id, score }) {
  const [expanded, setExpanded] = useState(false);
  const meta = TEST_LABELS[id];
  if (!meta || !score) return null;

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
          <div style={{ fontWeight: 600, fontSize: 14, color: '#1a202c' }}>{meta.label}</div>
          <div style={{ fontSize: 12, color: '#718096', marginTop: 2 }}>{meta.desc}</div>
        </div>
        <StatusBadge status={score.status} size="sm" />
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
              <div>Right eye: <strong>{score.right?.va || '—'}</strong></div>
              <div>Left eye: <strong>{score.left?.va || '—'}</strong></div>
              {score.status !== 'pass' && <div style={{ color: '#c05621', marginTop: 6 }}>Visual acuity below 20/40. Corrective lenses may be indicated.</div>}
            </div>
          )}
          {id === 'color' && (
            <div>
              <div>{score.correct} of {score.total} plates identified correctly</div>
              {score.status !== 'pass' && <div style={{ color: '#c05621', marginTop: 6 }}>Color vision deficiency detected. Typically hereditary; advise ophthalmology review.</div>}
            </div>
          )}
          {id === 'astigmatism' && (
            <div>
              {score.allSame ? 'No astigmatism detected.' :
                `${score.affected} unequal meridian${score.affected !== 1 ? 's' : ''} detected.`}
              {score.status !== 'pass' && <div style={{ color: '#c05621', marginTop: 6 }}>Astigmatism may produce blurred or distorted vision. Correctable with cylindrical lenses.</div>}
            </div>
          )}
          {id === 'contrast' && (
            <div>
              <div>Passed {score.level + 1} of 8 contrast levels.</div>
              {score.status !== 'pass' && <div style={{ color: '#c05621', marginTop: 6 }}>Reduced contrast sensitivity may indicate early cataract, glaucoma, or macular pathology.</div>}
            </div>
          )}
          {id === 'near' && (
            <div>
              {score.status === 'pass' ? 'Near vision within normal range.' : 'Near vision difficulty detected.'}
              {score.status !== 'pass' && <div style={{ color: '#c05621', marginTop: 6 }}>Reading glasses may be required. Presbyopia is common after age 40.</div>}
            </div>
          )}
          {id === 'amsler' && (
            <div>
              {score.rightIssues && <div>Right eye: Grid distortion or scotoma detected.</div>}
              {score.leftIssues && <div>Left eye: Grid distortion or scotoma detected.</div>}
              {!score.rightIssues && !score.leftIssues && <div>No macular distortion detected.</div>}
              {(score.rightIssues || score.leftIssues) && (
                <div style={{ color: '#c53030', marginTop: 6, fontWeight: 600 }}>
                  Possible macular pathology (AMD, macular edema). Ophthalmology referral advised.
                </div>
              )}
            </div>
          )}
          {id === 'peripheral' && (
            <div>
              <div>Detected {score.total - score.missed} of {score.total} peripheral stimuli.</div>
              {score.status !== 'pass' && <div style={{ color: '#c05621', marginTop: 6 }}>Peripheral field loss may indicate glaucoma. Clinical visual field testing recommended.</div>}
            </div>
          )}
          {id === 'symptoms' && (
            <div>
              {score.hasUrgent?.length > 0 && (
                <div style={{ color: '#c53030', fontWeight: 600 }}>
                  Urgent symptoms reported: {score.hasUrgent.join(', ')}
                </div>
              )}
              {score.hasSoon?.length > 0 && (
                <div style={{ color: '#c05621' }}>
                  Notable symptoms: {score.hasSoon.join(', ')}
                </div>
              )}
              {score.status === 'pass' && <div>No significant symptoms reported.</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Results({ testData, profile, language, geminiKey, onRetake }) {
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
  const localSummary = getLocalSummary(validScores, language);

  useEffect(() => {
    speak('Your eye screening is complete. Here are your results.');

    if (geminiKey) {
      setLoadingAI(true);
      analyzeResults(validScores, profile, geminiKey, language)
        .then(s => { setAiSummary(s); setLoadingAI(false); })
        .catch(() => setLoadingAI(false));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleShare = () => {
    const lines = [
      'VisionCheck — Eye Screening Report',
      '─────────────────────────────────',
      ...Object.entries(scores)
        .filter(([, v]) => v)
        .map(([k, v]) => `${TEST_LABELS[k]?.label}: ${v.status?.toUpperCase()}`),
      '─────────────────────────────────',
      `Overall: ${URGENCY_CONFIG[overallUrgency]?.label}`,
      '',
      'This is a screening tool, not a medical diagnosis.',
      'Please consult a qualified eye care provider.',
    ];
    const text = lines.join('\n');

    if (navigator.share) {
      navigator.share({ title: 'VisionCheck Results', text });
    } else {
      navigator.clipboard?.writeText(text);
      alert('Results copied to clipboard.');
    }
  };

  const handleWhatsApp = () => {
    const lines = [
      '*VisionCheck — Eye Screening Report*',
      Object.entries(scores)
        .filter(([, v]) => v)
        .map(([k, v]) => `${TEST_LABELS[k]?.label}: *${v.status?.toUpperCase()}*`)
        .join('\n'),
      `\nOverall: *${URGENCY_CONFIG[overallUrgency]?.label}*`,
      '\n_Screening tool only — not a medical diagnosis._',
    ].join('\n');
    window.open(`https://wa.me/?text=${encodeURIComponent(lines)}`);
  };

  return (
    <AppShell>
      {/* Header */}
      <div style={{
        background: '#1e3a5f',
        color: '#fff',
        padding: '20px 20px 18px',
        borderBottom: '3px solid #2c5282',
      }}>
        <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.6, marginBottom: 6 }}>
          Assessment Complete
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>Screening Report</h1>
        <p style={{ fontSize: 13, opacity: 0.65, margin: 0 }}>
          {Object.values(scores).filter(Boolean).length} of 8 tests completed
        </p>
      </div>

      <div style={{ padding: '18px 16px', overflowY: 'auto', flex: 1 }}>
        {/* Urgency banner */}
        <UrgencyBanner urgency={overallUrgency} />

        {/* Summary */}
        <div style={{
          background: '#f7fafc',
          borderRadius: 6,
          padding: '14px',
          marginBottom: 18,
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#2d3748', display: 'flex', alignItems: 'center', gap: 6 }}>
            {geminiKey ? 'Clinical Summary (AI)' : 'Summary'}
            {loadingAI && <span style={{ fontSize: 11, color: '#718096', fontWeight: 400 }}>Analyzing...</span>}
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: '#4a5568', margin: 0 }}>
            {aiSummary || localSummary}
          </p>
        </div>

        {/* Per-test results */}
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: '#4a5568', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Individual Test Results
        </div>
        {Object.entries(scores).map(([id, score]) =>
          score ? <TestCard key={id} id={id} score={score} /> : null
        )}

        {/* Share buttons */}
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: '#4a5568', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Share Report
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button onClick={handleWhatsApp} style={shareBtnStyle('#25d366', '#fff')}>
              WhatsApp
            </button>
            <button onClick={handleShare} style={shareBtnStyle('#2c5282', '#fff')}>
              Share
            </button>
          </div>
        </div>

        {/* Disclaimer + retake */}
        <div style={{ marginTop: 18 }}>
          <Disclaimer />
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
            Repeat Assessment
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
