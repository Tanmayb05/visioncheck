// Google Gemini API integration for AI-powered results analysis

const GEMINI_MODEL = 'gemini-1.5-flash';

export async function analyzeResults(testResults, profile, apiKey, language = 'en') {
  if (!apiKey) return null;

  const langNames = { en: 'English', fr: 'French', sw: 'Swahili', am: 'Amharic' };
  const langName = langNames[language] || 'English';

  const prompt = `You are a compassionate health screening assistant. A patient just completed a basic eye screening on their smartphone. Analyze these results and provide a clear, simple summary in ${langName}.

Patient Profile:
- Age group: ${profile?.ageGroup || 'adult'}
- Has diabetes: ${profile?.diabetes ? 'yes' : 'no'}
- Wears glasses: ${profile?.glasses || 'unknown'}

Test Results:
${JSON.stringify(testResults, null, 2)}

Please provide:
1. A brief, reassuring 2-3 sentence summary of overall findings in simple language (avoid medical jargon)
2. The most important next step (one sentence)
3. Any urgent warning if applicable

Important:
- Always remind them this is a SCREENING, not a diagnosis
- Be warm, not scary
- Use simple words a non-medical person can understand
- If results look normal, be reassuring
- If issues found, be calm and encouraging about seeking help

Respond in ${langName} only. Keep total response under 150 words.`;

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    console.error('Gemini API error:', e);
    return null;
  }
}

export function getLocalSummary(scores, language = 'en') {
  const urgencies = Object.values(scores).map(s => s?.urgency).filter(Boolean);
  const hasEmergency = urgencies.includes('emergency');
  const hasUrgent = urgencies.includes('urgent');
  const hasSoon = urgencies.includes('soon');

  const messages = {
    en: {
      emergency: '⚠️ Some of your answers suggest you may need urgent eye care. Please see a doctor or go to a clinic as soon as possible.',
      urgent: 'Some of your test results need attention. We recommend visiting an eye care professional soon.',
      soon: 'Your screening shows some areas that may benefit from an eye check. Consider seeing an eye doctor.',
      routine: 'Your eye screening results look good! Continue to protect your eyes and get regular check-ups.',
    },
    fr: {
      emergency: '⚠️ Certaines de vos réponses suggèrent que vous pourriez avoir besoin de soins oculaires urgents.',
      urgent: 'Certains résultats de vos tests nécessitent attention. Nous vous recommandons de consulter un professionnel.',
      soon: 'Votre dépistage montre des domaines qui pourraient bénéficier d\'un examen oculaire.',
      routine: 'Vos résultats de dépistage semblent bons! Continuez à protéger vos yeux.',
    },
  };

  const msgs = messages[language] || messages.en;
  if (hasEmergency) return msgs.emergency;
  if (hasUrgent) return msgs.urgent;
  if (hasSoon) return msgs.soon;
  return msgs.routine;
}
