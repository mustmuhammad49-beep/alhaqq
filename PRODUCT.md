# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three overlapping audiences, all Muslims:
- People in a live argument (comment section, DM, in-person conversation) who need a fast, citable rebuttal to a specific attack on Islam.
- People doing personal study/research to build their own understanding of objections to Islam and their Quran-based answers, outside of active debate.
- Da'wah content creators (video/post/thread makers) who need sourced material they can cite in their own content.

## Product Purpose

Al-Haqq is a database of rebuttals to attacks/myths about Islam, plus interactive tools (debate simulator, cross-examination, prophecy tree) for exploring and rehearsing those arguments. Success means a user can find or construct a well-sourced, defensible answer to a specific attack quickly enough to use it in the moment it's needed.

## Positioning

Quran-only, no hadith: every rebuttal is sourced strictly from the Quran itself, deliberately excluding hadith and scholarly opinion as the basis of an argument. This is the mechanism a hadith-reliant apologetics resource could not truthfully claim.

## Operating Context

- Static, multi-page site (PWA): `index.html` is the main myth/rebuttal database; `landing.html` is the marketing entry point; `alhaqq-debate-simulator.html`, `cross-examination.html`, and `prophecy-tree-v5.html` are standalone interactive tools; `top10.html` lists the top 10 attacks and answers.
- Deployed via Netlify; installable as a PWA (`manifest.json`, `sw.js`).

## Capabilities and Constraints

- Rebuttals must be strictly factual — grounded in either direct Quranic verses or well-studied/well-researched historical and situational context. No hadith-based argumentation, no invented statistics, testimonials, or unverified claims.
- Quran-only sourcing is the core integrity claim of the product and must never be silently diluted with hadith or unsourced opinion presented as the primary basis for a rebuttal.
- Freemium subscription model: a limited set of entries is free to browse; full database access, unlimited debate-simulator practice, and new entries as they're added require a paid subscription via Stripe. Founding-member rate is $2.99/mo, locked for life, capped at the first 1,000 subscribers; rate rises to $6.99/mo after. This pricing mechanism and Stripe checkout link are a fixed point — future work should design around it, not replace it, unless the user explicitly changes pricing strategy.

## Brand Commitments

- Name: Al-Haqq ("The Truth"). Theme color gold (`#c9a84c`) on near-black (`#0d0d0f`), per `manifest.json`.

## Evidence on Hand

- Existing rebuttal database content in `index.html` (see project memory for entry ID/overlay conventions).
- Real, live pricing/offer: $2.99/mo founding rate (rising to $6.99/mo after 1,000 spots), Stripe checkout at the link in `landing.html`. This is a genuine commercial claim, not a placeholder — treat the numbers as real and do not alter them without the user's direction.
- No testimonials, customer counts, or third-party endorsements exist yet — do not fabricate any.

## Product Principles

1. Quran-only sourcing is non-negotiable — it is the product's differentiator, not a style choice.
2. Speed to a usable, citable answer matters more than exhaustive scholarly nuance, since the primary use case is a live exchange.
3. Factual integrity over persuasive flourish: never invent evidence to win an argument.
4. Serve study/research and content-creation use just as well as live-debate use — the same rebuttal content should work across all three contexts.
