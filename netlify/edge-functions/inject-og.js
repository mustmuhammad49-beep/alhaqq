// Al-Haqq — OG Meta Tag Injector (Netlify Edge Function)
// Intercepts page requests and injects per-entry Open Graph tags
// so shared links render rich previews on WhatsApp, Twitter, Discord, etc.

const BASE_URL = 'https://alhaqq.it.com';

const SOURCE_LABEL = {
  christian:    'Christian Claim — Debunked',
  sunni:        'Sunni Challenge — Answered',
  secular:      'Secular Critique — Dismantled',
  orientalist:  'Orientalist Argument — Refuted',
};

// Entry metadata only — no rebuttals needed here
const ENTRIES = [
  { id: 1,  myth: "Islam was spread by the sword — Muslims forced people to convert",                                                        source: "christian"   },
  { id: 2,  myth: "Muslims worship Muhammad — Islam is no different from prophet worship",                                                   source: "christian"   },
  { id: 4,  myth: "Islam borrowed everything from Judaism and Christianity — it's not an original revelation",                               source: "orientalist" },
  { id: 5,  myth: "Rejecting Hadith means rejecting Islam itself — you cannot be Muslim without Hadith",                                     source: "sunni"       },
  { id: 6,  myth: "The Quran endorses slavery — Islam is incompatible with human rights",                                                    source: "secular"     },
  { id: 7,  myth: "Jesus is God — the Trinity is found in the original scriptures",                                                          source: "christian"   },
  { id: 8,  myth: "The Quran has no prayer times — you need Hadith to know when to pray",                                                    source: "sunni"       },
  { id: 9,  myth: "Women in Islam are worth half of men — the religion institutionalises inequality",                                        source: "secular"     },
  { id: 10, myth: "Muhammad married a child — Islam condones child marriage",                                                                source: "christian"   },
  { id: 11, myth: "The Quran commands Muslims to kill all non-believers",                                                                    source: "christian"   },
  { id: 12, myth: "Stoning for adultery is an Islamic law — the Quran endorses capital punishment for sin",                                  source: "sunni"       },
  { id: 13, myth: "Why do Muslims mention Muhammad in their prayer? Doesn't that contradict monotheism?",                                    source: "christian"   },
  { id: 14, myth: "The Quran says Allah prays — doesn't that prove Islam is incoherent?",                                                    source: "christian"   },
  { id: 15, myth: "The Quran permits men to beat their wives — the word daraba proves it",                                                   source: "secular"     },
  { id: 16, myth: "The Quran makes a scientific mistake about embryology — bones don't form before flesh",                                   source: "secular"     },
  { id: 17, myth: "Paul is Jesus's true apostle — his letters define authentic Christianity",                                                source: "christian"   },
  { id: 18, myth: "There is no prophecy of Muhammad in the Bible — every Muslim claim is just Islamic interpretation",                      source: "christian"   },
  { id: 19, myth: "Quran 10:94 proves Muhammad had doubts — Allah told him to ask Jews and Christians for confirmation",                     source: "christian"   },
  { id: 20, myth: "The Bible is God's perfectly preserved Word — it has never been changed or added to",                                     source: "christian"   },
];

function escAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default async (request, context) => {
  const url = new URL(request.url);
  const mythId = parseInt(url.searchParams.get('myth') || '0', 10);

  // Fetch the original HTML
  const response = await context.next();

  // Only process HTML responses
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const html = await response.text();

  let title, description, canonical;

  if (mythId) {
    const entry = ENTRIES.find(e => e.id === mythId);
    if (entry) {
      const label = SOURCE_LABEL[entry.source] || 'Myth Debunked';
      title       = `${entry.myth} | Al-Haqq`;
      description = `${label} with the Quran alone. No Hadith. No conjecture. Just the words of Allah.`;
      canonical   = `${BASE_URL}/?myth=${mythId}`;
    }
  }

  // Default (homepage)
  if (!title) {
    title       = 'Al-Haqq — Islamic Myth Debunk Database';
    description = 'The most comprehensive database of Islamic myth rebuttals, grounded exclusively in the words of Allah. Every lie answered. Every myth dismantled. Quran-only.';
    canonical   = BASE_URL;
  }

  const ogImage = `${BASE_URL}/og-image.png`;

  const injected = `
  <!-- Dynamic SEO — injected by Al-Haqq edge function -->
  <meta name="description" content="${escAttr(description)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${escAttr(canonical)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Al-Haqq · الحق">
  <meta property="og:url" content="${escAttr(canonical)}">
  <meta property="og:title" content="${escAttr(title)}">
  <meta property="og:description" content="${escAttr(description)}">
  <meta property="og:image" content="${escAttr(ogImage)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="en_US">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@AlHaqqDB">
  <meta name="twitter:title" content="${escAttr(title)}">
  <meta name="twitter:description" content="${escAttr(description)}">
  <meta name="twitter:image" content="${escAttr(ogImage)}">`;

  const newHtml = html.replace('</head>', injected + '\n</head>');

  return new Response(newHtml, {
    status: response.status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'x-al-haqq-og': mythId ? `entry-${mythId}` : 'default',
    }
  });
};
