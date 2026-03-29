const fs = require('fs');
const path = require('path');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

async function main() {
  loadEnvFile(path.resolve(__dirname, '..', '.env.local'));

  const apiKey = process.env.GEMINI_API_KEY || process.env.REACT_APP_GEMINI_KEY;
  const modelName = process.env.GEMINI_MODEL || process.env.REACT_APP_GEMINI_MODEL || 'gemini-2.5-flash';

  if (!apiKey) {
    console.error('Missing Gemini API key. Set GEMINI_API_KEY or REACT_APP_GEMINI_KEY in visioncheck/.env.local.');
    process.exit(1);
  }

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: modelName });

  try {
    const result = await model.generateContent('Reply with exactly: Gemini API OK');
    const text = result.response.text().trim();

    console.log('Gemini request succeeded.');
    console.log(`Model: ${modelName}`);
    console.log(`Response: ${text}`);
  } catch (error) {
    console.error('Gemini request failed.');
    console.error(error.message || error);
    process.exit(1);
  }
}

main();
