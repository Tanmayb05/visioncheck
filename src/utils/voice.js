// Voice guidance using browser Speech Synthesis (offline fallback)
import { LANG_CODES } from './translations';

let synth = window.speechSynthesis;

export function speak(text, lang = 'en') {
  if (!synth || !text) return;
  stop();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = LANG_CODES[lang] || 'en-US';
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
