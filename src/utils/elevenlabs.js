// ElevenLabs TTS integration with IndexedDB caching
// Falls back to Web Speech API if API key is missing or request fails.

const API_KEY = process.env.REACT_APP_ELEVENLABS_KEY;
const API_BASE = 'https://api.elevenlabs.io/v1';

// Voice IDs: warm, natural voices per language
// Replace these with your actual ElevenLabs voice IDs
const VOICE_IDS = {
  en: 'EXAVITQu4vr4xnSDxMaL', // Sarah — warm, clear English
  fr: 'onwK4e9ZLuTAKqWW03F9', // Daniel — French
  sw: 'EXAVITQu4vr4xnSDxMaL', // fallback to English voice; swap when Swahili voice available
  am: 'EXAVITQu4vr4xnSDxMaL', // fallback to English voice; swap when Amharic voice available
};

const MODEL_ID = 'eleven_multilingual_v2';

// --- IndexedDB cache ---

const DB_NAME = 'visioncheck-audio';
const STORE_NAME = 'clips';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

function cacheKey(text, lang) {
  // Simple deterministic key
  return `${lang}::${text}`;
}

async function getFromCache(key) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function saveToCache(key, arrayBuffer) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(arrayBuffer, key);
      tx.oncomplete = resolve;
      tx.onerror = resolve; // non-fatal
    });
  } catch {
    // cache write failure is non-fatal
  }
}

// --- Audio playback ---

let currentAudio = null;

function playArrayBuffer(arrayBuffer) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      resolve();
    };
    audio.onerror = (e) => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      reject(e);
    };
    audio.play().catch(reject);
  });
}

export function stopElevenLabs() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}

// --- Main speak function ---

/**
 * Speaks text using ElevenLabs TTS.
 * Returns true if successful, false if ElevenLabs unavailable (caller should fallback).
 */
export async function speakWithElevenLabs(text, lang = 'en') {
  if (!API_KEY || !text) return false;

  const key = cacheKey(text, lang);

  // Try cache first
  const cached = await getFromCache(key);
  if (cached) {
    try {
      await playArrayBuffer(cached);
      return true;
    } catch {
      // cached audio corrupt — fall through to fetch
    }
  }

  // Fetch from ElevenLabs
  const voiceId = VOICE_IDS[lang] || VOICE_IDS.en;
  try {
    const res = await fetch(`${API_BASE}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.2,
          use_speaker_boost: true,
        },
      }),
    });

    if (!res.ok) return false;

    const arrayBuffer = await res.arrayBuffer();
    await saveToCache(key, arrayBuffer);
    await playArrayBuffer(arrayBuffer);
    return true;
  } catch {
    return false;
  }
}

export const elevenLabsAvailable = () => Boolean(API_KEY);
