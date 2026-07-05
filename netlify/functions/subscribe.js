// ── CORS — only allow requests from the two Al-Haqq domains ──
const ALLOWED_ORIGINS = [
  'https://alhaqq.it.com',
  'https://alhaqq-truth.netlify.app'
];

function getCorsOrigin(event) {
  const origin = (event.headers && (event.headers.origin || event.headers.Origin)) || '';
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── HANDLER ──
exports.handler = async function(event) {
  const corsOrigin = getCorsOrigin(event);

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
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

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': corsOrigin,
    'Vary': 'Origin'
  };

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false }) };
  }

  const email = (body.email || '').trim().toLowerCase();
  const source = (body.source || 'site').toString().slice(0, 60);

  if (!email || !EMAIL_RE.test(email)) {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false }) };
  }

  const brevoKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);

  if (!brevoKey || !listId) {
    console.log('subscribe: Brevo not configured');
    return { statusCode: 502, headers, body: JSON.stringify({ ok: false }) };
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': brevoKey
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,
        attributes: { SOURCE: source }
      })
    });

    if (res.status === 201 || res.status === 204) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    console.log('subscribe: Brevo error status', res.status);
    return { statusCode: 502, headers, body: JSON.stringify({ ok: false }) };
  } catch (err) {
    console.log('subscribe: request failed');
    return { statusCode: 502, headers, body: JSON.stringify({ ok: false }) };
  }
};
