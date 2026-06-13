const crypto = require('crypto');

// ── TOKEN HELPER ──
function makeToken(email) {
  const secret = process.env.SUBSCRIBER_SECRET;
  if (!secret) throw new Error('SUBSCRIBER_SECRET env var is not set');
  return crypto
    .createHmac('sha256', secret)
    .update(email.toLowerCase().trim())
    .digest('hex')
    .slice(0, 40);
}

// ── STRIPE FETCH HELPER ──
async function stripeFetch(path, stripeKey) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return res.json();
}

// ── CORS — only allow requests from the two Al-Haqq domains ──
const ALLOWED_ORIGINS = [
  'https://alhaqq.it.com',
  'https://alhaqq-truth.netlify.app'
];

function getCorsOrigin(event) {
  const origin = (event.headers && (event.headers.origin || event.headers.Origin)) || '';
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

// ── HANDLER ──
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

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Subscription verification is not configured yet.' })
    };
  }

  if (!process.env.SUBSCRIBER_SECRET) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Token signing is not configured yet.' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request.' }) };
  }

  const email = (body.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'A valid email address is required.' })
    };
  }

  // ── OWNER SHORTCUT ──
  // Owner bypasses Stripe check entirely
  const ownerEmail = process.env.OWNER_EMAIL || 'must.muhammad49@gmail.com';
  if (email === ownerEmail.toLowerCase()) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access: 'owner', token: makeToken(email) })
    };
  }

  try {
    // ── STEP 1: Find Stripe customer by email ──
    const custData = await stripeFetch(
      `/customers?email=${encodeURIComponent(email)}&limit=10`,
      stripeKey
    );

    if (!custData.data || custData.data.length === 0) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'No account found with that email. Use the exact email you subscribed with.'
        })
      };
    }

    // ── STEP 2: Check each customer for an active subscription ──
    for (const customer of custData.data) {
      const subData = await stripeFetch(
        `/subscriptions?customer=${customer.id}&status=active&limit=1`,
        stripeKey
      );

      if (subData.data && subData.data.length > 0) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access: 'subscriber',
            token: makeToken(email)
          })
        };
      }

      // Also check trialing subscriptions (free trial period)
      const trialData = await stripeFetch(
        `/subscriptions?customer=${customer.id}&status=trialing&limit=1`,
        stripeKey
      );

      if (trialData.data && trialData.data.length > 0) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access: 'subscriber',
            token: makeToken(email)
          })
        };
      }
    }

    // Customer exists but no active subscription
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'No active subscription found. If you just subscribed, wait a moment and try again — or contact support.'
      })
    };

  } catch (err) {
    console.error('verify-subscriber error:', err.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Verification failed. Please try again.' })
    };
  }
};
