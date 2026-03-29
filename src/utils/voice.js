// Voice guidance — ElevenLabs TTS with Web Speech API fallback
import { LANG_CODES } from './translations';
import { speakWithElevenLabs, stopElevenLabs } from './elevenlabs';

let synth = window.speechSynthesis;

function speakWithWebSpeech(text, lang) {
  if (!synth || !text) return;
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = LANG_CODES[lang] || 'en-US';
  utter.rate = 0.9;
  utter.pitch = 1.0;
  utter.volume = 1.0;
  synth.speak(utter);
}

export async function speak(text, lang = 'en') {
  if (!text) return;
  stop();
  const success = await speakWithElevenLabs(text, lang);
  if (!success) {
    speakWithWebSpeech(text, lang);
  }
}

export function stop() {
  stopElevenLabs();
  if (synth && synth.speaking) {
    synth.cancel();
  }
}
