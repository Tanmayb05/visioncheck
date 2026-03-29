import React, { useState, useEffect } from 'react';
import { AppShell, Header } from '../components/Layout';
import { speak } from '../utils/voice';
import { useTranslation } from '../utils/useTranslation';

export default function SymptomsTest({ onComplete, onBack, step, totalSteps, language = 'en' }) {
  const t = useTranslation(language);
  const SYMPTOMS = t('symptoms.questions');

  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});

  const symptom = SYMPTOMS[questionIdx];

  useEffect(() => {
    speak(symptom.question, language);
  }, [questionIdx, symptom.question]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (val) => {
    const newAnswers = { ...answers, [symptom.id]: val };
    setAnswers(newAnswers);

    if (questionIdx + 1 >= SYMPTOMS.length) {
      onComplete(newAnswers);
    } else {
      setQuestionIdx(i => i + 1);
    }
  };

  const progress = ((questionIdx) / SYMPTOMS.length) * 100;

  return (
    <AppShell language={language}>
      <Header
        title={t('symptoms.title')}
        subtitle={t('symptoms.questionOf')(questionIdx + 1, SYMPTOMS.length)}
        onBack={onBack}
        step={step}
        totalSteps={totalSteps}
        language={language}
      />

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Progress */}
        <div style={{ background: '#f3f4f6', borderRadius: 4, height: 6, marginBottom: 24 }}>
          <div style={{
            background: 'linear-gradient(90deg, #1e3a5f, #2c5282)',
            width: `${progress}%`,
            height: '100%',
            borderRadius: 4,
            transition: 'width 0.4s ease',
          }} />
        </div>

        {/* Question card */}
        <div style={{
          background: '#fff',
          borderRadius: 6,
          padding: '28px 20px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a202c', lineHeight: 1.4, marginBottom: 12 }}>
            {symptom.question}
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
            {symptom.hint}
          </div>
          {symptom.condition && (
            <div style={{
              marginTop: 14,
              fontSize: 11,
              color: '#9ca3af',
              background: '#f9fafb',
              borderRadius: 8,
              padding: '6px 12px',
            }}>
              {symptom.condition}
            </div>
          )}
        </div>

        {/* Answer buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => handleAnswer('yes')}
            style={{
              padding: '18px',
              borderRadius: 6,
              background: '#f0fff4',
              border: '1.5px solid #9ae6b4',
              color: '#276749',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            {t('symptoms.yes')}
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => handleAnswer('no')}
              style={{
                flex: 1,
                padding: '18px',
                borderRadius: 6,
                background: '#f9fafb',
                border: '2px solid #e5e7eb',
                color: '#374151',
                fontSize: 17,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {t('symptoms.no')}
            </button>
            <button
              onClick={() => handleAnswer('unsure')}
              style={{
                flex: 1,
                padding: '18px',
                borderRadius: 6,
                background: '#f9fafb',
                border: '2px solid #e5e7eb',
                color: '#374151',
                fontSize: 17,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {t('symptoms.unsure')}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
