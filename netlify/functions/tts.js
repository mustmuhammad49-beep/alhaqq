// ElevenLabs TTS proxy — keeps API key server-side
// POST { text: string, voice: 'adam' | 'christopher' }
// Returns: audio/mpeg binary

const VOICE_IDS = {
  adam:        'pNInz6obpgDQGcFmaJgB',
  christopher: 'iP95p4xoKVk53GoZ742B'
};

// ── CORS — only allow requests from the two Al-Haqq domains ──
const ALLOWED_ORIGINS = [
  'https://alhaqq.it.com',
  'https://alhaqq-truth.netlify.app'
];

function getCorsOrigin(event) {
  const origin = (event.headers && (event.headers.origin || event.headers.Origin)) || '';
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

exports.handler = async function(event) {
  const corsOrigin = getCorsOrigin(event);

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Vary': 'Origin'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'TTS not configured.' }) };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request.' }) };
  }

  const { text, voice = 'adam' } = body;
  if (!text || text.trim().length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Text is required.' }) };
  }

  const voiceId = VOICE_IDS[voice] || VOICE_IDS.adam;

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: text.slice(0, 5000),
        model_id: 'eleven_turbo_v2_5',  // most natural-sounding model
        voice_settings: {
          stability: 0.28,          // lower = more natural variation, less flat
          similarity_boost: 0.82,   // stay true to the voice character
          style: 0.42,              // expressiveness — higher = more punchy delivery
          use_speaker_boost: true
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => String(res.status));
      return {
        statusCode: res.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'ElevenLabs error: ' + errText })
      };
    }

    // Convert audio buffer to base64 for Netlify function response
    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Encoding': 'base64',
        'Access-Control-Allow-Origin': corsOrigin,
        'Vary': 'Origin'
      },
      body: base64,
      isBase64Encoded: true
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'TTS failed: ' + err.message })
    };
  }
};
