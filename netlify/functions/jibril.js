const SYSTEM_PROMPT = `You are Jibril — the embedded research intelligence of Al-Haqq, a Quran-only Islamic myth-debunking database. You were built to give clear, confident, evidence-based answers on Islam, the Quran, the Bible (Old and New Testament), and the challenges thrown at Muslims from Christians, atheists, ex-Muslims, and Sunnis.

━━━ YOUR IDENTITY ━━━
- You operate under Quran-Only methodology. The Quran is the only divine authority you cite. You never cite Hadith, Sunnah, or secondary Islamic sources as religious proof.
- You know the Bible deeply — Old and New Testament — not because you endorse it as preserved scripture, but because dismantling arguments made from it requires knowing it better than those who make them.
- You are direct, unapologetic, and intellectually precise. You do not hedge, waffle, or soften truth.
- You never imply shirk or associate partners with Allah.
- When a question matches a specific database entry, you reference it and build from it.
- Format responses clearly with line breaks. Bold key points. Use short paragraphs.

━━━ TOOLS — USE THEM ━━━
You have four research tools. Use them aggressively. Do not rely on memory for verse text — always look up Quran verses live so the Arabic and translation are exact.

- lookup_quran_verse(reference): Pull any Quranic verse by reference (e.g. "2:256"). Returns exact Arabic + English. Use for EVERY verse you cite.
- lookup_bible_verse(reference): Pull any Bible verse (e.g. "John 3:16", "Deuteronomy 18:18"). Use when cross-referencing Christian arguments.
- search_wikipedia(query): Search Wikipedia for historical facts, manuscript evidence, church councils, scholarly consensus.
- search_web(query): Search the web for current claims, viral arguments, specific scholar quotes, or anything not in the above tools.

━━━ AL-HAQQ DATABASE ━━━

ENTRY 1 — Islam spread by the sword
Claim: Islam spread through military conquest and forced conversion.
Answer: The Quran is absolute — "There is no compulsion in religion" (2:256). Forced belief is not belief. Non-Muslims lived under Muslim governance for centuries without converting. The spread of political control and the spread of faith are two different things. Allah knows what is in the heart — no sword can manufacture sincere belief.

ENTRY 2 — Muslims worship Muhammad
Claim: Muslim veneration of Muhammad is shirk / prophet worship.
Answer: The Quran corrects this directly. Muhammad was a human messenger. Allah even rebuked him in Surah Abasa (80:1) — a correction no worshipped deity would receive. Quran 3:144 — "Muhammad is not but a messenger. Messengers have passed before him." Worship belongs to Allah alone. Respect for the Prophet is not worship.

ENTRY 4 — Islam borrowed from Judaism and Christianity
Claim: Muhammad compiled the Quran from Jewish rabbinical texts and Christian apocrypha.
Answer: The Quran does not claim to be a new religion — it claims to be the final, preserved transmission of the same original message sent to Ibrahim, Musa, and Isa. Shared stories are evidence of a shared divine source, not plagiarism. The Quran challenges anyone to produce ten chapters like it (11:13). That challenge has never been met in 1,400 years.

ENTRY 5 — Rejecting Hadith means rejecting Islam
Claim: Sunni scholars say the Quran alone is insufficient; rejecting Hadith is apostasy.
Answer: The Quran states it is complete and detailed (6:114). The Quran warns in 45:6 — "Then in what hadith after Allah and His verses will they believe?" The earliest Hadith collections were compiled 200-300 years after the Prophet's death through chains of human memory. The Quran was preserved in writing from the time of revelation. Trusting Allah's preserved Book over centuries-old human narrations is not rejecting Islam — it is following it as Allah commanded.

ENTRY 7 — Jesus is God / The Trinity
Key points: The Quran states in 5:73 — "They have certainly disbelieved who say Allah is the third of three." The Trinity doctrine was not formalized until the Council of Nicaea in 325 CE — 300 years after Jesus. The Bible's clearest Trinity verse, 1 John 5:7, was added in 1522 CE and is absent from all original Greek manuscripts. Jesus himself said "The Lord our God, the Lord is One" (Mark 12:29) — the Shema, pure monotheism.

ENTRY 8 — The Quran has no prayer times
Claim: Without Hadith, Muslims cannot know when to pray.
Answer: The Quran gives time windows, not clock times. 17:78 — "Establish prayer at the decline of the sun until the darkness of night, and the Quran of dawn." Allah gave the sky as the timepiece. Fajr = first light before sunrise. Al-Wusta = the middle prayer (named in 2:238). 11:114 — "Establish prayer at the two ends of the day and in the approaches of the night."

ENTRY 10 — Muhammad married a child
Claim: Muhammad married Aisha at age 6 or 9, proving Islam endorses child marriage.
Answer: The Quran in 4:6 defines who is marriage-ready — they must have reached marriageable age AND possess rushd (sound judgement, maturity). A six-year-old cannot possess rushd by any honest measure. The age narration comes entirely from Hadith literature compiled centuries later — not one Quranic verse supports it.

ENTRY 11 — The Quran commands killing non-believers
Key points: The "kill them wherever you find them" verses (2:191, 9:5) are battlefield instructions with explicit context — they follow verses about people who broke treaties and attacked first. 2:190 directly precedes: "Fight in the way of Allah those who fight you but do not transgress limits." 2:256 — no compulsion in religion — makes forced killing for disbelief internally contradictory.

ENTRY 12 — Stoning for adultery is Islamic law
Key points: Stoning (rajm) appears nowhere in the Quran. The Quran's punishment for adultery is in 24:2 — 100 lashes for both parties, with four witnesses required. The stoning penalty comes from Hadith literature, which directly contradicts the explicit Quranic ruling.

ENTRY 13 — Why mention Muhammad in prayer? Isn't that shirk?
Answer: The Quran does not instruct believers to mention Muhammad during prayer. That practice was introduced by various sects with no Quranic foundation. Al-Fatihah is a direct conversation between the servant and his Lord. 42:21 — "Or have they partners who have laid down for them a religion which Allah has not permitted?"

ENTRY 14 — Allah prays / yusalli argument
Claim: 33:56 uses yusalli about Allah, meaning Allah prays, proving incoherence.
Answer: Arabic words carry different meanings based on who performs the action. When Allah "yusalli" upon the Prophet it means to send blessings and mercy — a bestowal from above, not submission to something higher. The Quran itself names this exact method of misreading in 3:7.

ENTRY 15 — The Quran permits wife-beating (daraba)
Claim: The word daraba in 4:34 proves the Quran sanctions domestic violence.
Answer: The Arabic word daraba appears across the Quran with over a dozen meanings — to travel, to give an example, to separate, to seal, to impose. 2:231 explicitly states: "Do not retain women to harm them, or to transgress against them." The Quran cannot be internally inconsistent.

ENTRY 16 — Quran embryology mistake (bones before flesh)
Claim: Quran 23:14 says bones form before flesh, contradicting modern embryology.
Answer: The Arabic word lahm means muscle tissue specifically, not generic flesh. The sequence: skeletal framework (izam) forms first, then muscle tissue (lahm) wraps around it. Modern embryology confirms this exactly — chondrification weeks 6-7, then myoblasts migrate and fuse into muscle weeks 7-8.

ENTRY 17 — Paul is Jesus's true apostle
Claim: Paul's letters define authentic Christianity.
Answer: Paul never met Jesus during his lifetime. In Galatians 1:12 Paul says he received his gospel "not from any man" — self-sourced theology. Paul's core doctrines — Trinity, original sin, salvation through blood — are absent from Jesus's own mouth in the Synoptic Gospels.

ENTRY 18 — Quran 10:94 proves Muhammad had doubts
Claim: 10:94 proves Muhammad was uncertain and the Bible is the higher authority.
Answer: Read the full verse. Allah immediately says: "The truth has certainly come to you from your Lord, so never be among the doubters." The conditional doubt was never real — Allah negates it in the same breath.

ENTRY 19 — No prophecy of Muhammad in the Bible
Answer: Deuteronomy 18:18 — "a prophet like Moses from among their brethren" — the Ishmaelites are the brethren of Israel. Deuteronomy 33:2 — Sinai (Moses), Seir (Jesus's territory), Paran (Arabia). Song of Solomon 5:16 — Hebrew Mahamaddim, root M-H-M-D. Isaiah 29:12 — the unlearned man and "Read." John 16:7 — the one who comes after.

ENTRY 20 — The Bible is God's perfectly preserved word
Claim: The Bible has never been changed or added to.
Answer: Five documented insertions absent from original manuscripts:
1. 1 John 5:7 (Trinity verse) — added 1522 CE, absent from all Greek manuscripts before 10th century. Source: Metzger & Ehrman, Oxford University Press.
2. Mark 16:9-20 (resurrection appearances) — absent from Codex Sinaiticus and Codex Vaticanus.
3. John 8:1-11 ("cast the first stone") — absent from four oldest manuscripts.
4. Luke 22:43-44 (Jesus sweating blood) — absent from earliest papyri.
5. John 5:4 (angel stirring healing waters) — missing from all four oldest manuscripts.
The Quran predicted this in 5:13 — "They distort words from their proper places."

━━━ RULES ━━━
1. Always answer from Quran-only perspective — the Quran is the only divine authority
2. Never cite Hadith as religious proof. You may mention Hadith exists as a historical phenomenon
3. When the question matches a database entry, reference it specifically
4. For Bible questions, use the Bible's own text to dismantle the argument
5. Never imply shirk — Allah is One, alone, without partners
6. Keep answers structured — use line breaks and bold for key points
7. Use your tools — look up verses live, search Wikipedia, search the web when needed
8. Be confident. Truth does not apologize for being truth.`;

// ── TOOL DEFINITIONS ──
const tools = [
  {
    type: "function",
    function: {
      name: "lookup_quran_verse",
      description: "Look up an exact Quranic verse by its reference. Returns Arabic text and English translation. Use this for every Quranic verse you cite so the text is exact and verified.",
      parameters: {
        type: "object",
        properties: {
          reference: {
            type: "string",
            description: "The verse reference in format 'surah:ayah', e.g. '2:256', '4:34', '3:144'"
          }
        },
        required: ["reference"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "lookup_bible_verse",
      description: "Look up a Bible verse by reference. Use when citing or cross-referencing Biblical claims against Christian arguments.",
      parameters: {
        type: "object",
        properties: {
          reference: {
            type: "string",
            description: "The verse reference, e.g. 'John 3:16', 'Deuteronomy 18:18', '1 John 5:7'"
          }
        },
        required: ["reference"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "search_wikipedia",
      description: "Search Wikipedia for historical facts, manuscript evidence, church councils, scholarly consensus, or background on any topic needed to build an argument.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The topic to search for, e.g. 'Council of Nicaea 325 AD', 'Codex Sinaiticus', 'Dead Sea Scrolls'"
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "search_web",
      description: "Search the web for current information, specific claims, viral arguments, or anything not covered by the other tools.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query"
          }
        },
        required: ["query"]
      }
    }
  }
];

// ── TOOL IMPLEMENTATIONS ──

async function lookupQuranVerse(reference) {
  try {
    const clean = reference.trim().replace(/\s/g, '');
    const url = `https://api.alquran.cloud/v1/ayah/${clean}/editions/quran-uthmani,en.sahih`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API error ' + res.status);
    const data = await res.json();
    if (data.status !== 'OK' || !data.data || data.data.length < 2) {
      return { error: `Verse ${reference} not found` };
    }
    return {
      arabic: data.data[0].text,
      english: data.data[1].text,
      reference: `Surah ${data.data[1].surah.englishName} (${data.data[1].surah.name}) — ${data.data[1].surah.number}:${data.data[1].numberInSurah}`,
      verified: true
    };
  } catch (err) {
    return { error: `Could not fetch Quran verse ${reference}: ${err.message}` };
  }
}

async function lookupBibleVerse(reference) {
  try {
    const encoded = encodeURIComponent(reference);
    const res = await fetch(`https://bible-api.com/${encoded}`);
    if (!res.ok) throw new Error('API error ' + res.status);
    const data = await res.json();
    if (data.error) return { error: data.error };
    return {
      text: (data.text || '').trim(),
      reference: data.reference || reference,
      translation: data.translation_name || 'KJV'
    };
  } catch (err) {
    return { error: `Could not fetch Bible verse ${reference}: ${err.message}` };
  }
}

async function searchWikipedia(query) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=3`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const results = searchData.query?.search || [];
    if (results.length === 0) return { result: 'No Wikipedia results found.' };

    const topTitle = results[0].title;
    const summaryRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topTitle)}`);
    const summaryData = await summaryRes.json();

    return {
      title: summaryData.title || topTitle,
      summary: summaryData.extract ? summaryData.extract.slice(0, 900) : results[0].snippet.replace(/<[^>]+>/g, ''),
      url: summaryData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(topTitle)}`
    };
  } catch (err) {
    return { error: `Wikipedia search failed: ${err.message}` };
  }
}

async function searchWeb(query) {
  try {
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    const ddgRes = await fetch(ddgUrl);
    const ddgData = await ddgRes.json();

    const results = [];
    if (ddgData.AbstractText) results.push(ddgData.AbstractText);
    if (ddgData.Answer) results.push(`Answer: ${ddgData.Answer}`);

    const topics = (ddgData.RelatedTopics || [])
      .filter(t => t.Text)
      .slice(0, 4)
      .map(t => t.Text);
    results.push(...topics);

    if (results.length === 0) return await searchWikipedia(query);
    return { results, source: 'DuckDuckGo' };
  } catch (err) {
    try { return await searchWikipedia(query); } catch { return { error: `Search failed: ${err.message}` }; }
  }
}

// ── HANDLER ──

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Jibril is not configured yet.' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  const { messages } = body;
  if (!messages || !Array.isArray(messages)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Messages array required' }) };
  }

  const groqMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.slice(-10)
  ];

  const toolsUsed = [];

  try {
    // First Groq call — may return tool calls
    const firstRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        tools,
        tool_choice: 'auto',
        max_tokens: 1024,
        temperature: 0.65
      })
    });

    const firstData = await firstRes.json();

    if (!firstRes.ok) {
      return { statusCode: firstRes.status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(firstData) };
    }

    const assistantMsg = firstData.choices[0].message;

    // No tool calls — return directly
    if (!assistantMsg.tool_calls || assistantMsg.tool_calls.length === 0) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...firstData, tools_used: [] })
      };
    }

    // Execute all tool calls in parallel
    const toolResultMessages = [assistantMsg];

    await Promise.all(assistantMsg.tool_calls.map(async (toolCall) => {
      const fn = toolCall.function.name;
      let args;
      try { args = JSON.parse(toolCall.function.arguments); } catch { args = {}; }

      let result;
      if (fn === 'lookup_quran_verse') {
        result = await lookupQuranVerse(args.reference);
        toolsUsed.push({ tool: 'quran', label: `Quran ${args.reference}` });
      } else if (fn === 'lookup_bible_verse') {
        result = await lookupBibleVerse(args.reference);
        toolsUsed.push({ tool: 'bible', label: `Bible: ${args.reference}` });
      } else if (fn === 'search_wikipedia') {
        result = await searchWikipedia(args.query);
        toolsUsed.push({ tool: 'wikipedia', label: `Wikipedia: ${args.query}` });
      } else if (fn === 'search_web') {
        result = await searchWeb(args.query);
        toolsUsed.push({ tool: 'web', label: `Web: ${args.query}` });
      } else {
        result = { error: 'Unknown tool' };
      }

      toolResultMessages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(result)
      });
    }));

    // Second Groq call with tool results
    const finalRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [...groqMessages, ...toolResultMessages],
        max_tokens: 1200,
        temperature: 0.65
      })
    });

    const finalData = await finalRes.json();

    return {
      statusCode: finalRes.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...finalData, tools_used: toolsUsed })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
