// Returns the real active subscriber count from Stripe
// Called on page load to power the "founding spots remaining" counter
// Simple in-memory cache: re-fetches at most once every 5 minutes

let _cache = null;
let _cacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const ALLOWED_ORIGINS = [
  'https://alhaqq.it.com',
  'https://alhaqq-truth.netlify.app'
];

exports.handler = async function(event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const origin = (event.headers && (event.headers.origin || event.headers.Origin)) || '';
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': corsOrigin,
    'Vary': 'Origin',
    'Cache-Control': 'public, max-age=300' // browsers can also cache for 5 min
  };

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return { statusCode: 200, headers, body: JSON.stringify({ count: 0, cached: false }) };
  }

  // Serve from in-memory cache if fresh
  const now = Date.now();
  if (_cache !== null && now - _cacheTime < CACHE_TTL_MS) {
    return { statusCode: 200, headers, body: JSON.stringify({ count: _cache, cached: true }) };
  }

  try {
    // Fetch active + trialing subscriptions (both count as founding members)
    let count = 0;
    let startingAfter = null;
    let hasMore = true;

    while (hasMore) {
      const qs = new URLSearchParams({ status: 'active', limit: '100' });
      if (startingAfter) qs.set('starting_after', startingAfter);

      const res = await fetch(`https://api.stripe.com/v1/subscriptions?${qs}`, {
        headers: { Authorization: `Bearer ${stripeKey}` }
      });
      const data = await res.json();

      if (!data.data) break;

      count += data.data.length;
      hasMore = data.has_more;
      if (hasMore && data.data.length > 0) {
        startingAfter = data.data[data.data.length - 1].id;
      }
    }

    // Also count trialing
    let trialStartingAfter = null;
    let trialHasMore = true;
    while (trialHasMore) {
      const qs = new URLSearchParams({ status: 'trialing', limit: '100' });
      if (trialStartingAfter) qs.set('starting_after', trialStartingAfter);

      const res = await fetch(`https://api.stripe.com/v1/subscriptions?${qs}`, {
        headers: { Authorization: `Bearer ${stripeKey}` }
      });
      const data = await res.json();

      if (!data.data) break;
      count += data.data.length;
      trialHasMore = data.has_more;
      if (trialHasMore && data.data.length > 0) {
        trialStartingAfter = data.data[data.data.length - 1].id;
      }
    }

    _cache = count;
    _cacheTime = now;

    return { statusCode: 200, headers, body: JSON.stringify({ count, cached: false }) };
  } catch (err) {
    // On error return cached value if we have one, otherwise 0
    const fallback = _cache !== null ? _cache : 0;
    return { statusCode: 200, headers, body: JSON.stringify({ count: fallback, cached: true, error: err.message }) };
  }
};
