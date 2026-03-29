// Voice guidance using browser Speech Synthesis (offline fallback)
// ElevenLabs integration can replace this with API calls

let synth = window.speechSynthesis;

export function speak(text, lang = 'en-US') {
  if (!synth) return;
  stop();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = 0.9;
  utter.pitch = 1.0;
  utter.volume = 1.0;
  synth.speak(utter);
}

export function stop() {
  if (synth && synth.speaking) {
    synth.cancel();
  }
}

export const LANG_CODES = {
  en: 'en-US',
  fr: 'fr-FR',
  es: 'es-ES',
  hi: 'hi-IN',
  ar: 'ar-SA',
  pt: 'pt-BR',
  sw: 'sw-KE',
  am: 'am-ET',
};

export const VOICE_SCRIPTS = {
  en: {
    welcome: 'Welcome to VisionCheck. This app will test your eyes. It takes about 10 minutes. Hold the phone at arm\'s length.',
    profile: 'First, tell us a little about yourself.',
    acuity: 'Cover your left eye. Look at the letter on screen. Which direction is it pointing? Swipe or tap the arrow.',
    acuity_left: 'Now cover your right eye. Which direction is the letter pointing?',
    color: 'What number do you see in the circle of dots? Tap the number, or tap the X if you cannot see one.',
    astigmatism: 'Look at the center dot. Do all the lines around it look the same? Tap any lines that look different.',
    contrast: 'Can you see the letter C? Which way is the opening pointing?',
    near: 'Hold the phone at reading distance. Can you clearly read the text?',
    amsler: 'Look at the center dot. Do all the lines look straight? Tap any areas that look wavy, blurry, or missing.',
    peripheral: 'Keep looking at the center dot. Tap the screen when you see a dot appear anywhere else.',
    symptoms: 'We will ask you some questions about your eyes. Answer yes, no, or not sure.',
    results: 'Your eye screening is complete. Here are your results.',
    disclaimer: 'This is a screening tool, not a diagnosis. Please see a doctor if you have concerns.',
  },
  fr: {
    welcome: 'Bienvenue sur VisionCheck. Cette application va tester vos yeux. Cela prend environ 10 minutes.',
    profile: 'D\'abord, parlez-nous un peu de vous.',
    acuity: 'Couvrez votre œil gauche. Regardez la lettre à l\'écran. Dans quelle direction pointe-t-elle?',
    color: 'Quel nombre voyez-vous dans le cercle de points?',
    astigmatism: 'Regardez le point central. Toutes les lignes semblent-elles identiques?',
    contrast: 'Pouvez-vous voir la lettre C? De quel côté est l\'ouverture?',
    near: 'Tenez le téléphone à distance de lecture. Pouvez-vous lire le texte clairement?',
    amsler: 'Regardez le point central. Toutes les lignes semblent-elles droites?',
    peripheral: 'Continuez à regarder le point central. Appuyez quand vous voyez un point apparaître.',
    symptoms: 'Nous allons vous poser quelques questions sur vos yeux.',
    results: 'Votre examen de vision est terminé. Voici vos résultats.',
    disclaimer: 'Ceci est un outil de dépistage, pas un diagnostic.',
  },
};

export function getScript(lang, key) {
  return VOICE_SCRIPTS[lang]?.[key] || VOICE_SCRIPTS.en[key] || '';
}
