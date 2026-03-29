// Google Gemini API integration for AI-powered results analysis

const GEMINI_MODEL = 'gemini-1.5-flash';

export async function analyzeResults(testResults, profile, apiKey, language = 'en') {
  if (!apiKey) return null;

  const langNames = { en: 'English', fr: 'French', es: 'Spanish', hi: 'Hindi', ar: 'Arabic', pt: 'Portuguese', sw: 'Swahili', am: 'Amharic' };
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
    es: {
      emergency: '⚠️ Algunas de sus respuestas sugieren que puede necesitar atención ocular urgente. Por favor, consulte a un médico lo antes posible.',
      urgent: 'Algunos resultados de sus pruebas requieren atención. Recomendamos visitar a un profesional de la salud ocular pronto.',
      soon: 'Su examen muestra algunas áreas que podrían beneficiarse de una revisión ocular. Considere consultar a un oftalmólogo.',
      routine: '¡Sus resultados de examen ocular se ven bien! Continúe protegiendo sus ojos y realícese chequeos regulares.',
    },
    hi: {
      emergency: '⚠️ आपके कुछ उत्तर बताते हैं कि आपको तत्काल नेत्र देखभाल की आवश्यकता हो सकती है। कृपया जल्द से जल्द डॉक्टर से मिलें।',
      urgent: 'आपके कुछ परीक्षण परिणामों पर ध्यान देने की आवश्यकता है। हम जल्द ही किसी नेत्र विशेषज्ञ से मिलने की सलाह देते हैं।',
      soon: 'आपकी जांच में कुछ ऐसे क्षेत्र दिखे हैं जिनसे नेत्र जांच फायदेमंद हो सकती है। एक नेत्र चिकित्सक से मिलें।',
      routine: 'आपके नेत्र जांच के परिणाम अच्छे हैं! अपनी आँखों की देखभाल जारी रखें और नियमित जांच करवाएं।',
    },
    ar: {
      emergency: '⚠️ تشير بعض إجاباتك إلى أنك قد تحتاج إلى رعاية عاجلة للعيون. يرجى زيارة الطبيب في أقرب وقت ممكن.',
      urgent: 'تستدعي بعض نتائج اختباراتك الاهتمام. نوصي بزيارة أخصائي رعاية العيون قريباً.',
      soon: 'يُظهر فحصك بعض المجالات التي قد تستفيد من فحص العيون. فكر في زيارة طبيب عيون.',
      routine: 'تبدو نتائج فحص عيونك جيدة! استمر في حماية عيونك وإجراء فحوصات منتظمة.',
    },
    pt: {
      emergency: '⚠️ Algumas de suas respostas sugerem que você pode precisar de cuidados oculares urgentes. Por favor, consulte um médico o mais rápido possível.',
      urgent: 'Alguns resultados de seus testes precisam de atenção. Recomendamos visitar um profissional de saúde ocular em breve.',
      soon: 'Seu exame mostra algumas áreas que podem se beneficiar de uma consulta ocular. Considere visitar um oftalmologista.',
      routine: 'Seus resultados de exame ocular parecem bons! Continue protegendo seus olhos e faça exames regulares.',
    },
  };

  const msgs = messages[language] || messages.en;
  if (hasEmergency) return msgs.emergency;
  if (hasUrgent) return msgs.urgent;
  if (hasSoon) return msgs.soon;
  return msgs.routine;
}
