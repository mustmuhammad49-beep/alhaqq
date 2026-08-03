import * as THREE from 'three';

const GOLD = 0xc9a84c, GOLD_LIGHT = 0xe8c97a;
const PARCH = '#f5f0e8';

const CATS = [
  { key:'christian',   title:'CHRISTIAN CLAIMS',   sub:'The Trinity, the Gospels, preservation', leather:'#2b3d57', accent:'#7a9ec9' },
  { key:'sunni',       title:'SUNNI CHALLENGES',   sub:'Hadith, salah, the Book fully detailed', leather:'#54262c', accent:'#c97a7a' },
  { key:'secular',     title:'SECULAR CRITIQUES',  sub:'Science, women, slavery, preservation',  leather:'#1d2a1e', accent:'#9ec97a' },
  { key:'orientalist', title:'ORIENTALIST',        sub:'Borrowing, authorship, late antiquity',  leather:'#4a4126', accent:'#c9b87a' },
  { key:'foundation',  title:'FOUNDATIONS',        sub:'What the Quran is, and how it is read',  leather:'#3a2a12', accent:'#c9a84c' },
];
const ENTRIES = window.ALHAQQ_ENTRIES || [];
const byCat = k => ENTRIES.filter(e => e.source === k);
const PER_PAGE = 5;

function isOwner(){ try { return localStorage.getItem('alhaqq_owner') === '1'; } catch (e) { return false; } }
function isSubscriber(){ try { return !!localStorage.getItem('alhaqq_sub_token'); } catch (e) { return false; } }
function hasAccess(){ return isOwner() || isSubscriber(); }
window.hasAccess = hasAccess;

/* ─────────────────────────── canvas texture helpers ─────────────────────────── */
function cv(w, h){ const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function tex(canvas){
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.needsUpdate = true; return t;
}
function grain(ctx, w, h, a){
  for (let i = 0; i < w * h / 26; i++){
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * a})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  }
}
function wrap(ctx, text, x, y, maxW, lh, max){
  const words = String(text).split(' '); let line = '', n = 0;
  for (const w of words){
    const t = line ? line + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && line){
      ctx.fillText(line, x, y); y += lh; line = w; n++;
      if (max && n >= max){ ctx.fillText('…', x, y); return y; }
    } else line = t;
  }
  ctx.fillText(line, x, y);
  return y + lh;
}
function lines(ctx, text, maxW, max){
  const words = String(text).split(' '); const out = []; let line = '';
  for (const w of words){
    const t = line ? line + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && line){ out.push(line); line = w; if (max && out.length === max - 1){} }
    else line = t;
  }
  out.push(line);
  if (max && out.length > max){ const cut = out.slice(0, max); cut[max - 1] = cut[max - 1].replace(/\s+\S*$/, '') + ' …'; return cut; }
  return out;
}
function ornateFrame(ctx, x, y, w, h, color){
  ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, h);
  ctx.lineWidth = 1; ctx.strokeRect(x + 9, y + 9, w - 18, h - 18);
  const c = 26;
  [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(([cx, cy, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(cx + sx * c, cy + sy * 4); ctx.lineTo(cx + sx * 4, cy + sy * 4); ctx.lineTo(cx + sx * 4, cy + sy * c);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + sx * 16, cy + sy * 16); ctx.lineTo(cx + sx * 22, cy + sy * 10);
    ctx.lineTo(cx + sx * 28, cy + sy * 16); ctx.lineTo(cx + sx * 22, cy + sy * 22); ctx.closePath();
    ctx.stroke();
  });
}
function diamond(ctx, x, y, r, color){
  ctx.strokeStyle = color; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y); ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - r * 1.8, y); ctx.lineTo(x - r * 0.5, y); ctx.moveTo(x + r * 0.5, y); ctx.lineTo(x + r * 1.8, y); ctx.stroke();
}

/* ── procedural morocco-leather: albedo + height, same grain on both ── */
function rng(seed){ let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
function leatherPair(hex, W, H, seed){
  const a = cv(W, H), ac = a.getContext('2d');
  const b = cv(W, H), bc = b.getContext('2d');
  const R = rng(seed);
  ac.fillStyle = hex; ac.fillRect(0, 0, W, H);
  bc.fillStyle = '#8a8a8a'; bc.fillRect(0, 0, W, H);
  // broad dye mottling — uneven vat colouring
  for (let i = 0; i < 260; i++){
    const x = R() * W, y = R() * H, r = 30 + R() * 190, up = R() < .5;
    const g = ac.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, up ? 'rgba(255,236,205,0.07)' : 'rgba(0,0,0,0.09)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ac.fillStyle = g; ac.beginPath(); ac.arc(x, y, r, 0, 7); ac.fill();
  }
  // pebbled grain — each cell lit top-left, shadowed bottom-right
  const cells = Math.round(W * H / 46);
  for (let i = 0; i < cells; i++){
    const x = R() * W, y = R() * H, r = 2.2 + R() * 5.4, o = r * .34;
    ac.strokeStyle = 'rgba(0,0,0,0.20)'; ac.lineWidth = 1.4;
    ac.beginPath(); ac.arc(x + o * .4, y + o * .4, r, 0.5, 3.1); ac.stroke();
    ac.strokeStyle = 'rgba(255,238,208,0.13)'; ac.lineWidth = 1.1;
    ac.beginPath(); ac.arc(x - o * .3, y - o * .3, r * .9, 3.5, 6.1); ac.stroke();
    bc.strokeStyle = 'rgba(0,0,0,0.34)'; bc.lineWidth = 1.6;
    bc.beginPath(); bc.arc(x + o * .4, y + o * .4, r, 0.5, 3.1); bc.stroke();
    bc.strokeStyle = 'rgba(255,255,255,0.30)'; bc.lineWidth = 1.2;
    bc.beginPath(); bc.arc(x - o * .3, y - o * .3, r * .9, 3.5, 6.1); bc.stroke();
  }
  // creases and hide-fibre streaks
  for (let i = 0; i < 70; i++){
    const x = R() * W, y = R() * H, len = 40 + R() * 260, ang = R() * Math.PI;
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    const cx = (x + x2) / 2 + (R() - .5) * 60, cy = (y + y2) / 2 + (R() - .5) * 60;
    [[ac, 'rgba(0,0,0,0.13)'], [bc, 'rgba(0,0,0,0.22)']].forEach(([c2, col]) => {
      c2.strokeStyle = col; c2.lineWidth = .8 + R() * 1.6;
      c2.beginPath(); c2.moveTo(x, y); c2.quadraticCurveTo(cx, cy, x2, y2); c2.stroke();
    });
  }
  // scuffed, lighter wear along the outer margin
  const vg = ac.createLinearGradient(0, 0, 0, H);
  vg.addColorStop(0, 'rgba(255,240,214,0.06)'); vg.addColorStop(.5, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.16)');
  ac.fillStyle = vg; ac.fillRect(0, 0, W, H);
  return { albedo: a, height: b };
}
const leatherCache = {};
function leatherMaps(cat){
  if (leatherCache[cat.key]) return leatherCache[cat.key];
  const p = leatherPair(cat.leather, 700, 700, cat.key.length * 7919 + 13);
  const map = tex(p.albedo), bump = new THREE.CanvasTexture(p.height);
  bump.anisotropy = 8;
  [map, bump].forEach(t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; });
  return (leatherCache[cat.key] = { map, bump, src: p });
}

/* foil-stamped emblem per category */
const SYMBOLS = {
  christian(cx, x, y, s){
    cx.lineWidth = s * .22; cx.lineCap = 'square';
    cx.beginPath();
    cx.moveTo(x, y - s); cx.lineTo(x, y + s);
    cx.moveTo(x - s * .60, y - s * .28); cx.lineTo(x + s * .60, y - s * .28);
    cx.stroke();
  },
  sunni(cx, x, y, s){
    cx.beginPath();
    cx.arc(x - s * .12, y, s * .92, 0, Math.PI * 2, false);
    cx.arc(x + s * .26, y, s * .76, 0, Math.PI * 2, true);
    cx.fill();
    // five-pointed star in the opening
    cx.beginPath();
    for (let i = 0; i < 10; i++){
      const a = -Math.PI / 2 + i * Math.PI / 5, r = (i % 2 ? s * .13 : s * .30);
      const px = x + s * .52 + Math.cos(a) * r, py = y - s * .30 + Math.sin(a) * r;
      i ? cx.lineTo(px, py) : cx.moveTo(px, py);
    }
    cx.closePath(); cx.fill();
  },
  secular(cx, x, y, s){
    cx.font = '700 ' + Math.round(s * 2.1) + 'px Cinzel, serif';
    cx.textAlign = 'center'; cx.textBaseline = 'alphabetic';
    cx.fillText('A', x, y + s * .78);
    cx.textBaseline = 'alphabetic';
  },
  orientalist(cx, x, y, s){
    cx.lineWidth = s * .09;
    cx.beginPath(); cx.arc(x, y, s * .92, 0, Math.PI * 2); cx.stroke();
    cx.lineWidth = s * .07;
    [.32, .66].forEach(k => {
      cx.beginPath(); cx.ellipse(x, y, s * .92 * k, s * .92, 0, 0, Math.PI * 2); cx.stroke();
    });
    cx.beginPath(); cx.moveTo(x - s * .92, y); cx.lineTo(x + s * .92, y); cx.stroke();
    [-.48, .48].forEach(k => {
      const w = s * .92 * Math.cos(Math.asin(k));
      cx.beginPath(); cx.moveTo(x - w, y + s * .92 * k); cx.lineTo(x + w, y + s * .92 * k); cx.stroke();
    });
  },
  foundation(cx, x, y, s){
    // classical pediment on columns
    cx.beginPath();
    cx.moveTo(x - s, y - s * .30); cx.lineTo(x, y - s * .92); cx.lineTo(x + s, y - s * .30);
    cx.closePath(); cx.fill();
    cx.fillRect(x - s * .96, y - s * .20, s * 1.92, s * .13);
    [-.66, -.22, .22, .66].forEach(k => cx.fillRect(x + s * k - s * .10, y - s * .04, s * .20, s * .78));
    cx.fillRect(x - s * .96, y + s * .76, s * 1.92, s * .16);
  },
};

/* floating glass bubble medallion that hovers over each volume */
function medallionTexture(cat){
  const S = 512, c = cv(S, S), ctx = c.getContext('2d');
  const X = S / 2, Y = S / 2, R = S * .33;

  const glow = ctx.createRadialGradient(X, Y, R * .85, X, Y, S * .5);
  glow.addColorStop(0, 'rgba(232,201,122,0.42)');
  glow.addColorStop(.4, 'rgba(232,201,122,0.13)');
  glow.addColorStop(1, 'rgba(232,201,122,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, S, S);

  // glass body
  ctx.save();
  ctx.beginPath(); ctx.arc(X, Y, R, 0, Math.PI * 2); ctx.clip();
  const body = ctx.createRadialGradient(X - R * .34, Y - R * .44, R * .08, X, Y, R * 1.2);
  body.addColorStop(0, 'rgba(44,35,66,0.94)');
  body.addColorStop(.55, 'rgba(20,15,34,0.93)');
  body.addColorStop(1, 'rgba(7,5,16,0.96)');
  ctx.fillStyle = body; ctx.fillRect(0, 0, S, S);
  const inner = ctx.createRadialGradient(X, Y, R * .1, X, Y, R);
  inner.addColorStop(0, `${cat.accent}2e`); inner.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = inner; ctx.fillRect(0, 0, S, S);
  ctx.restore();

  // emblem, glowing gold
  ctx.save();
  ctx.strokeStyle = '#f6e3ae'; ctx.fillStyle = '#f6e3ae';
  ctx.shadowColor = 'rgba(255,222,140,0.95)'; ctx.shadowBlur = 22;
  SYMBOLS[cat.key](ctx, X, Y, R * .46);
  ctx.restore();

  // metal rim
  const rim = ctx.createLinearGradient(X - R, Y - R, X + R, Y + R);
  rim.addColorStop(0, '#fbeec0'); rim.addColorStop(.32, '#c9a84c');
  rim.addColorStop(.6, '#7d5f22'); rim.addColorStop(.85, '#dcbe72');
  ctx.lineWidth = R * .085; ctx.strokeStyle = rim;
  ctx.beginPath(); ctx.arc(X, Y, R - ctx.lineWidth / 2, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = R * .02; ctx.strokeStyle = 'rgba(255,238,190,0.55)';
  ctx.beginPath(); ctx.arc(X, Y, R * .86, 0, Math.PI * 2); ctx.stroke();

  // bubble sheen + specular
  ctx.save();
  ctx.beginPath(); ctx.arc(X, Y, R * .93, 0, Math.PI * 2); ctx.clip();
  const sheen = ctx.createLinearGradient(0, Y - R, 0, Y + R * .25);
  sheen.addColorStop(0, 'rgba(255,255,255,0.30)'); sheen.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.beginPath(); ctx.ellipse(X, Y - R * .40, R * .70, R * .40, 0, 0, Math.PI * 2); ctx.fill();
  const spec = ctx.createRadialGradient(X - R * .38, Y - R * .46, 0, X - R * .38, Y - R * .46, R * .26);
  spec.addColorStop(0, 'rgba(255,255,255,0.85)'); spec.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = spec; ctx.fillRect(0, 0, S, S);
  ctx.restore();
  return tex(c);
}

function coverTexture(cat, count){
  const W = 620, H = 868;
  const p = leatherPair(cat.leather, W, H, cat.key.length * 104729 + 7);
  const c = p.albedo, ctx = c.getContext('2d');
  const hc = p.height, hx = hc.getContext('2d');
  const g = ctx.createRadialGradient(W * .42, H * .3, 30, W * .5, H * .5, H * .85);
  g.addColorStop(0, 'rgba(255,246,222,0.10)'); g.addColorStop(.6, 'rgba(0,0,0,0.18)'); g.addColorStop(1, 'rgba(0,0,0,0.52)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // blind-tooled (debossed) double rule — dark groove with a lit lower lip
  const deboss = (x, y, w, h, lw) => {
    ctx.lineWidth = lw; ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.strokeRect(x, y, w, h);
    ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,236,200,0.16)'; ctx.strokeRect(x + 1.2, y + 1.2, w, h);
    hx.lineWidth = lw + 1; hx.strokeStyle = 'rgba(0,0,0,0.85)'; hx.strokeRect(x, y, w, h);
  };
  deboss(30, 30, W - 60, H - 60, 5);

  // gold-foil frame, stamped with wear
  const foil = (draw, alpha) => {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 5; ctx.shadowOffsetY = 2;
    ctx.strokeStyle = `rgba(214,180,96,${alpha})`; ctx.fillStyle = `rgba(214,180,96,${alpha})`;
    draw(ctx);
    ctx.restore();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(255,236,178,0.5)'; ctx.fillStyle = 'rgba(255,236,178,0.42)';
    ctx.translate(-0.9, -1.1); draw(ctx); ctx.restore();
  };
  foil(cx => ornateFrame(cx, 46, 46, W - 92, H - 92, cx.strokeStyle), 1);
  hx.save(); hx.strokeStyle = 'rgba(255,255,255,0.7)';
  ornateFrame(hx, 46, 46, W - 92, H - 92, 'rgba(255,255,255,0.7)'); hx.restore();

  // title, foil-stamped: pressed shadow, gold body, raised highlight
  const words = cat.title.split(' ');
  ctx.textAlign = 'center'; hx.textAlign = 'center';
  let y = H * .42 - (words.length - 1) * 30;
  words.forEach(w => {
    ctx.font = '700 52px Cinzel, serif'; hx.font = '700 52px Cinzel, serif';
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillText(w, W / 2 + 2, y + 3);
    ctx.fillStyle = '#c8a24e'; ctx.fillText(w, W / 2, y);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgba(255,238,186,0.55)'; ctx.fillText(w, W / 2 - 1, y - 1.4); ctx.restore();
    hx.fillStyle = 'rgba(255,255,255,0.85)'; hx.fillText(w, W / 2, y);
    y += 62;
  });
  foil(cx => diamond(cx, W / 2, y + 26, 15, cx.strokeStyle), 1);
  ctx.font = '400 22px Cinzel, serif';
  const countLabel = count + (count === 1 ? ' ENTRY' : ' ENTRIES');
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillText(countLabel, W / 2 + 1, H - 95);
  ctx.fillStyle = 'rgba(200,162,78,0.9)'; ctx.fillText(countLabel, W / 2, H - 96);

  // rubbed-away foil: erase specks so the stamping looks handled
  ctx.save(); ctx.globalCompositeOperation = 'destination-out';
  const R = rng(cat.key.length * 31 + 5);
  for (let i = 0; i < 900; i++){
    ctx.fillStyle = `rgba(0,0,0,${.10 + R() * .3})`;
    ctx.fillRect(R() * W, R() * H, 1 + R() * 2, 1 + R() * 2);
  }
  ctx.restore();
  // worn, darkened corners
  [[0, 0], [W, 0], [0, H], [W, H]].forEach(([x, yy]) => {
    const cg = ctx.createRadialGradient(x, yy, 6, x, yy, 150);
    cg.addColorStop(0, 'rgba(0,0,0,0.42)'); cg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = cg; ctx.fillRect(0, 0, W, H);
  });
  const bump = new THREE.CanvasTexture(hc); bump.anisotropy = 8;
  return { map: tex(c), bump };
}

/* fore-edge: hundreds of individual leaves */
function pageEdgeTexture(seed, vertical){
  const W = 512, H = 512, c = cv(W, H), ctx = c.getContext('2d');
  const R = rng(seed);
  ctx.fillStyle = '#e9dfc6'; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 460; i++){
    const p = R() * (vertical ? H : W);
    ctx.fillStyle = `rgba(${R() < .35 ? '120,100,66' : '168,146,104'},${.10 + R() * .38})`;
    if (vertical) ctx.fillRect(0, p, W, .6 + R() * 1.5);
    else ctx.fillRect(p, 0, .6 + R() * 1.5, H);
  }
  for (let i = 0; i < 40; i++){
    const x = R() * W, y = R() * H, r = 20 + R() * 90;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(146,118,72,${.05 + R() * .1})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const sh = ctx.createLinearGradient(0, 0, vertical ? W : 0, vertical ? 0 : H);
  sh.addColorStop(0, 'rgba(60,44,20,0.30)'); sh.addColorStop(.35, 'rgba(0,0,0,0)');
  ctx.fillStyle = sh; ctx.fillRect(0, 0, W, H);
  return tex(c);
}

/* ── open-book spread: draws a page and records clickable regions ── */
const SW = 2048, SH = 1400, SS = 1;
function texSharp(canvas){
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.generateMipmaps = false;
  t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter;
  t.anisotropy = 16; t.needsUpdate = true; return t;
}
const INK = '#0a0805', INK_SOFT = 'rgba(16,11,5,0.97)', GOLD_INK = '#3a2708';
function spreadCanvas(){
  const c = cv(SW * SS, SH * SS), ctx = c.getContext('2d');
  ctx.scale(SS, SS);
  ctx.fillStyle = '#faf6ee'; ctx.fillRect(0, 0, SW, SH);
  const g = ctx.createLinearGradient(0, 0, SW, 0);
  g.addColorStop(0, 'rgba(120,100,70,0.16)'); g.addColorStop(.44, 'rgba(120,100,70,0)');
  g.addColorStop(.5, 'rgba(90,72,44,0.30)'); g.addColorStop(.56, 'rgba(120,100,70,0)');
  g.addColorStop(1, 'rgba(120,100,70,0.16)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, SW, SH);
  const v = ctx.createRadialGradient(SW / 2, SH / 2, SH * .45, SW / 2, SH / 2, SH * 1.05);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(80,62,34,0.16)');
  ctx.fillStyle = v; ctx.fillRect(0, 0, SW, SH);
  grain(ctx, SW, SH, .035);
  // thicken glyph mass so type survives minification on the page plane
  const rawFill = ctx.fillText.bind(ctx);
  ctx.fillText = (t, x, y) => {
    ctx.save();
    ctx.lineWidth = 1.15; ctx.lineJoin = 'round'; ctx.miterLimit = 2;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.strokeText(t, x, y);
    ctx.restore();
    rawFill(t, x, y);
  };
  return { c, ctx };
}
function glow(ctx, color, blur, draw){
  ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = blur;
  draw(); draw(); ctx.restore();
}
function hRule(ctx, x1, x2, y, alpha){
  ctx.strokeStyle = `rgba(96,74,26,${alpha})`; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
}

function tocTexture(cat, page, hover){
  const { c, ctx } = spreadCanvas();
  const list = byCat(cat.key), pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const regions = [];
  ctx.textAlign = 'left';

  // ── left page: volume plate
  ctx.textAlign = 'center';
  ctx.fillStyle = GOLD_INK; ctx.font = '700 32px Cinzel, serif';
  ctx.fillText('VOLUME ' + (CATS.indexOf(cat) + 1) + ' OF 5', 512, 300);
  ctx.fillStyle = INK; ctx.font = '700 72px Cinzel, serif';
  let ty = 424;
  cat.title.split(' ').forEach(w => { ctx.fillText(w, 512, ty); ty += 82; });
  diamond(ctx, 512, ty + 10, 18, 'rgba(122,95,34,0.95)');
  ctx.fillStyle = INK_SOFT; ctx.font = 'italic 36px Lora, serif';
  ctx.textAlign = 'center'; wrap(ctx, cat.sub, 512, ty + 100, 660, 48);
  hRule(ctx, 240, 784, ty + 190, .5);
  ctx.fillStyle = GOLD_INK; ctx.font = '700 30px Cinzel, serif';
  ctx.fillText(list.length + (list.length === 1 ? ' ENTRY' : ' ENTRIES') + ' · QURAN-ONLY', 512, ty + 250);
  ctx.fillStyle = 'rgba(12,8,3,0.95)'; ctx.font = 'italic 36px Lora, serif';
  wrap(ctx, 'Every rebuttal in this volume is sourced from the Quran itself. No hadith. No opinion.', 512, ty + 330, 660, 50);

  // ── right page: contents
  const X = 1180, X2 = 1900;
  ctx.textAlign = 'left';
  ctx.fillStyle = GOLD_INK; ctx.font = '700 34px Cinzel, serif';
  ctx.fillText('TABLE OF CONTENTS', X, 190);
  hRule(ctx, X, X2, 222, .7);
  const slice = list.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  let y = 285;
  slice.forEach((e, i) => {
    const n = page * PER_PAGE + i + 1;
    ctx.font = '700 36px Lora, serif';
    const ls = lines(ctx, e.myth, X2 - X - 250, 3);
    const rowH = ls.length * 50 + 56;
    const rowY = y - 48;
    const hot = hover === 'row' + i;
    if (hot){
      const rg = ctx.createLinearGradient(X - 26, 0, X2 + 26, 0);
      rg.addColorStop(0, 'rgba(201,168,76,0.34)'); rg.addColorStop(.75, 'rgba(201,168,76,0.12)');
      rg.addColorStop(1, 'rgba(201,168,76,0.03)');
      ctx.fillStyle = rg; ctx.fillRect(X - 26, rowY, X2 - X + 52, rowH);
      glow(ctx, 'rgba(201,168,76,0.95)', 26, () => {
        ctx.fillStyle = '#c9a84c'; ctx.fillRect(X - 26, rowY, 7, rowH);
      });
    }
    ctx.fillStyle = GOLD_INK; ctx.font = '700 30px Cinzel, serif';
    ctx.fillText(String(n).padStart(2, '0'), X, y);
    ctx.fillStyle = hot ? '#000000' : INK;
    ctx.font = '700 36px Lora, serif';
    ls.forEach((l, k) => ctx.fillText(l, X + 76, y + k * 50));
    ctx.textAlign = 'right';
    const rowLocked = e.locked && !hasAccess();
    ctx.fillStyle = rowLocked ? '#4a3408' : INK;
    ctx.font = '700 25px Cinzel, serif';
    ctx.fillText(rowLocked ? '✦ LOCKED' : e.difficulty.toUpperCase(), X2, y);
    ctx.textAlign = 'left';
    hRule(ctx, X, X2, rowY + rowH - 8, hot ? .45 : .22);
    regions.push({ x: X - 26, y: rowY, w: X2 - X + 52, h: rowH, id: 'row' + i, entry: e });
    y += rowH;
  });
  // pagination
  if (pages > 1){
    ctx.fillStyle = GOLD_INK; ctx.font = '700 28px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText('PAGE ' + (page + 1) + ' / ' + pages, (X + X2) / 2, 1352);
    ctx.textAlign = 'left';
    if (page > 0){
      ctx.fillStyle = hover === 'prev' ? INK : GOLD_INK;
      if (hover === 'prev') glow(ctx, 'rgba(201,168,76,0.9)', 20, () => ctx.fillText('← PREVIOUS', X, 1352));
      ctx.fillText('← PREVIOUS', X, 1352);
      regions.push({ x: X - 20, y: 1302, w: 300, h: 74, id: 'prev' });
    }
    if (page < pages - 1){
      ctx.textAlign = 'right';
      ctx.fillStyle = hover === 'next' ? INK : GOLD_INK;
      if (hover === 'next') glow(ctx, 'rgba(201,168,76,0.9)', 20, () => ctx.fillText('NEXT PAGE →', X2, 1352));
      ctx.fillText('NEXT PAGE →', X2, 1352);
      regions.push({ x: X2 - 300, y: 1302, w: 320, h: 74, id: 'next' });
    }
  }
  return { texture: texSharp(c), regions };
}

function entryTexture(cat, entry, hover){
  const { c, ctx } = spreadCanvas();
  const regions = [];
  const locked = entry.locked && !hasAccess();
  const L = 140, L2 = 900, R = 1180, R2 = 1900;
  ctx.textAlign = 'left';

  /* left page — the claim */
  ctx.fillStyle = GOLD_INK; ctx.font = '700 30px Cinzel, serif';
  ctx.fillText('THE CLAIM', L, 190);
  hRule(ctx, L, L2, 222, .55);
  ctx.fillStyle = INK; ctx.font = '600 42px Cinzel, serif';
  let y = 300;
  lines(ctx, entry.myth, L2 - L, 5).forEach(l => { ctx.fillText(l, L, y); y += 56; });
  diamond(ctx, L + 22, y + 22, 12, 'rgba(122,95,34,0.9)');
  y += 82;
  ctx.fillStyle = INK_SOFT; ctx.font = 'italic 36px Lora, serif';
  lines(ctx, entry.claim || '', L2 - L, 8).forEach(l => { ctx.fillText(l, L, y); y += 50; });
  ctx.fillStyle = GOLD_INK; ctx.font = '700 25px Cinzel, serif';
  ctx.fillText(cat.title + ' · ' + entry.difficulty.toUpperCase() + ' · ENTRY ' + String(entry.id).padStart(2, '0'), L, 1300);
  ctx.font = '700 28px Cinzel, serif';
  if (hover === 'back'){
    ctx.fillStyle = '#c9a84c';
    glow(ctx, 'rgba(201,168,76,0.95)', 22, () => ctx.fillText('← CONTENTS', L, 1370));
    ctx.fillStyle = INK;
  } else ctx.fillStyle = GOLD_INK;
  ctx.fillText('← CONTENTS', L, 1370);
  regions.push({ x: L - 20, y: 1324, w: 320, h: 70, id: 'back' });

  /* right page — the answer */
  ctx.fillStyle = GOLD_INK; ctx.font = '700 30px Cinzel, serif';
  ctx.fillText(locked ? 'SEALED' : 'THE ANSWER', R, 190);
  hRule(ctx, R, R2, 222, .55);
  let ry = 296;
  if (locked){
    ctx.fillStyle = INK_SOFT; ctx.font = 'italic 36px Lora, serif';
    lines(ctx, 'This rebuttal is held in the full database. Founding members read every entry, every verse, and every new drop as it lands.', R2 - R, 6)
      .forEach(l => { ctx.fillText(l, R, ry); ry += 50; });
  } else {
    ctx.fillStyle = INK; ctx.font = '500 36px Lora, serif';
    const previewText = entry.quickAnswer
      || (entry.interactive
        ? (entry.interactiveSubtitle || 'Tap to open the interactive walkthrough →')
        : String(entry.rebuttal || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    lines(ctx, previewText, R2 - R, 8).forEach(l => { ctx.fillText(l, R, ry); ry += 50; });
  }
  if (entry.verse){
    ry = Math.max(ry + 40, 700);
    hRule(ctx, R, R2, ry, .4); ry += 76;
    ctx.save();
    ctx.direction = 'rtl'; ctx.textAlign = 'right';
    ctx.fillStyle = '#4a3408'; ctx.font = '400 48px Amiri, serif';
    lines(ctx, entry.verse.arabic || '', R2 - R, 3).forEach(l => { ctx.fillText(l, R2, ry); ry += 68; });
    ctx.restore();
    ctx.textAlign = 'left';
    ry += 14;
    ctx.fillStyle = 'rgba(12,8,3,0.96)'; ctx.font = 'italic 34px Lora, serif';
    lines(ctx, '“' + (entry.verse.translation || '') + '”', R2 - R, 4).forEach(l => { ctx.fillText(l, R, ry); ry += 46; });
    ctx.fillStyle = GOLD_INK; ctx.font = '700 24px Cinzel, serif';
    lines(ctx, (entry.verse.ref || '').toUpperCase(), R2 - R, 2).forEach(l => { ctx.fillText(l, R, ry + 16); ry += 30; });
  }
  const bw = 470, bh = 84, bx = R, by = 1230;
  if (hover === 'open'){
    glow(ctx, 'rgba(201,168,76,0.9)', 30, () => { ctx.fillStyle = '#a3822f'; ctx.fillRect(bx, by, bw, bh); });
    ctx.fillStyle = '#8a6620'; ctx.fillRect(bx, by, bw, bh);
  } else {
    ctx.fillStyle = 'rgba(138,111,46,0.12)'; ctx.fillRect(bx, by, bw, bh);
  }
  ctx.strokeStyle = hover === 'open' ? '#c9a84c' : '#7a5f22'; ctx.lineWidth = 2.5; ctx.strokeRect(bx, by, bw, bh);
  ctx.fillStyle = hover === 'open' ? '#fbf6ea' : GOLD_INK;
  ctx.font = '700 30px Cinzel, serif'; ctx.textAlign = 'center';
  ctx.fillText(locked ? 'UNLOCK THE DATABASE' : 'READ THE FULL ENTRY', bx + bw / 2, by + 53);
  regions.push({ x: bx, y: by, w: bw, h: bh, id: 'open', entry });
  ctx.textAlign = 'left';
  return { texture: texSharp(c), regions };
}

function tableTexture(){
  const S = 1600, c = cv(S, S), ctx = c.getContext('2d');
  ctx.fillStyle = '#120d09'; ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 220; i++){
    ctx.strokeStyle = `rgba(${60 + Math.random() * 30},${42 + Math.random() * 20},${24 + Math.random() * 14},.5)`;
    ctx.lineWidth = 1 + Math.random() * 3;
    ctx.beginPath(); ctx.moveTo(0, Math.random() * S); ctx.bezierCurveTo(S * .3, Math.random() * S, S * .7, Math.random() * S, S, Math.random() * S); ctx.stroke();
  }
  const cx = S / 2;
  for (let i = 1; i <= 9; i++){
    ctx.strokeStyle = `rgba(201,168,76,${0.22 + (i % 3 === 0 ? .34 : .10)})`;
    ctx.lineWidth = i % 3 === 0 ? 4 : 2;
    ctx.beginPath(); ctx.arc(cx, cx, i * 74, 0, Math.PI * 2); ctx.stroke();
  }
  for (let i = 0; i < 48; i++){
    const a = i / 48 * Math.PI * 2;
    ctx.strokeStyle = `rgba(201,168,76,${i % 4 === 0 ? .40 : .14})`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * 150, cx + Math.sin(a) * 150);
    ctx.lineTo(cx + Math.cos(a) * 666, cx + Math.sin(a) * 666); ctx.stroke();
  }
  for (let r = 2; r <= 8; r += 2){
    for (let i = 0; i < 24; i++){
      const a = (i + .5) / 24 * Math.PI * 2, rr = r * 74;
      ctx.strokeStyle = 'rgba(201,168,76,0.34)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx + Math.cos(a) * rr, cx + Math.sin(a) * rr, 22, 0, Math.PI * 2); ctx.stroke();
    }
  }
  const g = ctx.createRadialGradient(cx, cx, 40, cx, cx, S * .52);
  g.addColorStop(0, 'rgba(232,201,122,0.40)'); g.addColorStop(.35, 'rgba(201,168,76,0.14)'); g.addColorStop(1, 'rgba(0,0,0,0.42)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  return tex(c);
}

function shaftTexture(){
  const W = 256, H = 512, c = cv(W, H), ctx = c.getContext('2d');
  const v = ctx.createLinearGradient(0, 0, 0, H);
  v.addColorStop(0, 'rgba(255,248,225,0.0)'); v.addColorStop(.28, 'rgba(255,248,225,0.42)');
  v.addColorStop(.62, 'rgba(232,201,122,0.22)'); v.addColorStop(1, 'rgba(232,201,122,0)');
  ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  const hg = ctx.createLinearGradient(0, 0, W, 0);
  hg.addColorStop(0, 'rgba(0,0,0,0)'); hg.addColorStop(.32, 'rgba(0,0,0,0.22)');
  hg.addColorStop(.5, 'rgba(0,0,0,1)'); hg.addColorStop(.68, 'rgba(0,0,0,0.22)');
  hg.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = hg; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';
  return tex(c);
}
function radialSprite(inner, outer, stops){
  const S = 512, c = cv(S, S), ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(S / 2, S / 2, inner, S / 2, S / 2, outer);
  stops.forEach(([o, col]) => g.addColorStop(o, col));
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  return tex(c);
}
/* the figure is a cutout of the reference art — see angel-figure.png */

/* ─────────────────────────── scene ─────────────────────────── */
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05060b, 0.030);
const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 600);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.06;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0x9fb6ff, 0x110c06, 0.55));
const key = new THREE.DirectionalLight(0xfff0cf, 1.15);
key.position.set(4, 9, 5); key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.left = -8; key.shadow.camera.right = 8;
key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
scene.add(key);
const rim = new THREE.DirectionalLight(0x7aa2ff, 0.5); rim.position.set(-6, 4, -6); scene.add(rim);
const jibrilLight = new THREE.PointLight(0xffe9b0, 26, 16, 2); jibrilLight.position.set(0, 1.9, 0); scene.add(jibrilLight);
const readLight = new THREE.PointLight(0xfff2d4, 0, 9, 2); readLight.position.set(0, 2.9, 4.5); scene.add(readLight);

/* stars */
(() => {
  const N = 2600, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), siz = new Float32Array(N);
  const c1 = new THREE.Color(0xffffff), c2 = new THREE.Color(0x9fc4ff), c3 = new THREE.Color(0xe8c97a);
  for (let i = 0; i < N; i++){
    const r = 26 + Math.random() * 48, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = Math.abs(r * Math.cos(ph)) * 0.85 - 4;
    pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    const c = Math.random() < .12 ? c3 : (Math.random() < .35 ? c2 : c1);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    siz[i] = Math.random() < .05 ? 0.5 : 0.16;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('size', new THREE.BufferAttribute(siz, 1));
  const m = new THREE.PointsMaterial({ size: 0.3, vertexColors: true, transparent: true, opacity: .9, depthWrite: false, sizeAttenuation: true, fog: false });
  const stars = new THREE.Points(g, m); stars.name = 'stars'; scene.add(stars);
  // distant nebulae
  const neb = radialSprite(0, 256, [[0, 'rgba(120,90,200,0.55)'], [.45, 'rgba(60,80,180,0.22)'], [1, 'rgba(0,0,0,0)']]);
  [[-24, 12, -30, 26, 0x7a6cc9], [26, 15, -28, 22, 0xc97a9e], [0, 20, 34, 30, 0x4a6fc9]].forEach(([x, y, z, s, tint]) => {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: neb, color: tint, transparent: true, opacity: .5, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    sp.position.set(x, y, z); sp.scale.setScalar(s); scene.add(sp);
  });
})();

/* ─────────────────────── solar system ───────────────────────
   Planets live on their own render layer, lit only by the sun, so the
   terminator stays crisp and scene lighting on the table is untouched. */
const SKY = 2;
camera.layers.enable(SKY);
const solar = new THREE.Group();
solar.rotation.set(-0.30, 0.4, 0.10);           // ecliptic tilt
scene.add(solar);
const planets = [];
{
  const wrapBlob = (x, W, cx, cy, r, col) => {
    [-W, 0, W].forEach(off => {
      const g = x.createRadialGradient(cx + off, cy, 0, cx + off, cy, r);
      g.addColorStop(0, col); g.addColorStop(1, col.replace(/[\d.]+\)$/, '0)'));
      x.fillStyle = g; x.beginPath(); x.arc(cx + off, cy, r, 0, Math.PI * 2); x.fill();
    });
  };
  const polarCaps = (x, W, H, strength) => {
    [[0, -1], [H, 1]].forEach(([y, dir]) => {
      const g = x.createLinearGradient(0, y, 0, y + dir * -H * .16);
      g.addColorStop(0, `rgba(255,255,255,${strength})`); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.fillRect(0, Math.min(y, y - H * .16 * dir), W, H * .17);
    });
  };
  const latitudeShade = (x, W, H) => {          // subtle limb/latitude falloff for depth
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, 'rgba(0,0,0,0.30)'); g.addColorStop(.5, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.34)');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
  };

  function planetTexture(p){
    const W = 1024, H = 512, c = cv(W, H), x = c.getContext('2d'), R = rng(p.seed);
    x.fillStyle = p.base; x.fillRect(0, 0, W, H);

    if (p.type === 'gas' || p.type === 'ice'){
      // banded atmosphere: stacked stripes of uneven height, then sheared turbulence
      let y = 0;
      while (y < H){
        const h = (p.type === 'gas' ? 8 + R() * 26 : 18 + R() * 48);
        x.fillStyle = p.pal[Math.floor(R() * p.pal.length)];
        x.globalAlpha = .35 + R() * .45; x.fillRect(0, y, W, h + 1); y += h;
      }
      x.globalAlpha = 1;
      const swirls = p.type === 'gas' ? 420 : 120;
      for (let i = 0; i < swirls; i++){
        const cy = R() * H, rw = 40 + R() * 260, rh = 3 + R() * (p.type === 'gas' ? 11 : 20);
        x.globalAlpha = .10 + R() * .22;
        x.fillStyle = p.pal[Math.floor(R() * p.pal.length)];
        x.beginPath(); x.ellipse(R() * W, cy, rw, rh, 0, 0, Math.PI * 2); x.fill();
      }
      x.globalAlpha = 1;
      if (p.spot){
        x.save(); x.translate(W * .62, H * .62);
        const g = x.createRadialGradient(0, 0, 4, 0, 0, 70);
        g.addColorStop(0, 'rgba(186,90,58,0.95)'); g.addColorStop(.6, 'rgba(150,72,48,0.7)'); g.addColorStop(1, 'rgba(150,72,48,0)');
        x.fillStyle = g; x.beginPath(); x.ellipse(0, 0, 70, 34, 0, 0, Math.PI * 2); x.fill(); x.restore();
      }
    } else if (p.type === 'earth'){
      const oc = x.createLinearGradient(0, 0, 0, H);
      oc.addColorStop(0, '#183a63'); oc.addColorStop(.5, '#12559a'); oc.addColorStop(1, '#173b66');
      x.fillStyle = oc; x.fillRect(0, 0, W, H);
      for (let i = 0; i < 190; i++){                     // land masses
        const cx = R() * W, cy = H * .12 + R() * H * .76, r = 14 + R() * 62;
        const cols = ['rgba(64,92,48,0.92)', 'rgba(94,110,56,0.9)', 'rgba(122,104,64,0.85)', 'rgba(52,78,44,0.9)'];
        wrapBlob(x, W, cx, cy, r, cols[Math.floor(R() * cols.length)]);
      }
      polarCaps(x, W, H, .92);
      for (let i = 0; i < 150; i++)                       // weather
        wrapBlob(x, W, R() * W, R() * H, 16 + R() * 54, `rgba(255,255,255,${.18 + R() * .3})`);
    } else if (p.type === 'clouds'){
      for (let i = 0; i < 260; i++){
        x.globalAlpha = .12 + R() * .3;
        x.fillStyle = p.pal[Math.floor(R() * p.pal.length)];
        x.beginPath(); x.ellipse(R() * W, R() * H, 60 + R() * 200, 10 + R() * 34, (R() - .5) * .5, 0, Math.PI * 2); x.fill();
      }
      x.globalAlpha = 1;
    } else {                                             // rocky
      for (let i = 0; i < 240; i++){                      // mottling
        x.globalAlpha = .10 + R() * .25;
        x.fillStyle = p.pal[Math.floor(R() * p.pal.length)];
        x.beginPath(); x.arc(R() * W, R() * H, 12 + R() * 70, 0, Math.PI * 2); x.fill();
      }
      x.globalAlpha = 1;
      for (let i = 0; i < (p.craters || 0); i++){          // craters: rim light, floor shadow
        const cx = R() * W, cy = R() * H, r = 3 + R() * 16;
        x.strokeStyle = 'rgba(255,244,224,0.20)'; x.lineWidth = 1.4;
        x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.stroke();
        x.fillStyle = 'rgba(0,0,0,0.24)';
        x.beginPath(); x.arc(cx + r * .18, cy + r * .18, r * .82, 0, Math.PI * 2); x.fill();
      }
      if (p.caps) polarCaps(x, W, H, .55);
    }
    latitudeShade(x, W, H);
    return tex(c);
  }

  function ringTexture(seed){
    const W = 512, H = 8, c = cv(W, H), x = c.getContext('2d'), R = rng(seed);
    x.clearRect(0, 0, W, H);
    for (let i = 0; i < W; i++){
      const t = i / W;
      let a = .06 + Math.pow(Math.sin(t * Math.PI), .6) * .55;
      a *= .55 + R() * .55;
      if (t > .60 && t < .655) a *= .12;                  // Cassini division
      if (t < .10) a *= t / .10;
      const l = 190 + R() * 55;
      x.fillStyle = `rgba(${l + 22},${l + 4},${l - 32},${Math.min(.92, a)})`;
      x.fillRect(i, 0, 1, H);
    }
    const t2 = new THREE.CanvasTexture(c);
    t2.colorSpace = THREE.SRGBColorSpace; t2.anisotropy = 8;
    return t2;
  }

  const SPECS = [
    { name: 'Mercury', r: 0.95, orbit: 27,  spin: 0.05, speed: 0.86, inc: 0.12, axis: 0.01, type: 'rocky',  base: '#8a8378', pal: ['#6b655c', '#a49b8d', '#585249'], craters: 90, seed: 11 },
    { name: 'Venus',   r: 1.55, orbit: 35,  spin: 0.03, speed: 0.62, inc: -0.06, axis: 0.04, type: 'clouds', base: '#cbb083', pal: ['#f2ddb0', '#bd9f6e', '#e6cf9c', '#a98a5c'], seed: 23 },
    { name: 'Earth',   r: 1.65, orbit: 44,  spin: 0.14, speed: 0.50, inc: 0.03, axis: 0.41,  type: 'earth',  base: '#12559a', pal: [], seed: 37, moon: true, air: '#7fb4ff' },
    { name: 'Mars',    r: 1.15, orbit: 53,  spin: 0.13, speed: 0.40, inc: 0.09, axis: 0.44,  type: 'rocky',  base: '#a4522e', pal: ['#7c3a1f', '#c47040', '#8d4526', '#6a3018'], craters: 55, caps: true, seed: 53 },
    { name: 'Jupiter', r: 3.70, orbit: 66,  spin: 0.34, speed: 0.24, inc: -0.04, axis: 0.05, type: 'gas',    base: '#c8ac83', pal: ['#e6d6b8', '#b28a5e', '#f0e4cc', '#8f6b47', '#d8bf95'], spot: true, seed: 71 },
    { name: 'Saturn',  r: 3.10, orbit: 80,  spin: 0.31, speed: 0.18, inc: 0.07, axis: 0.47,  type: 'gas',    base: '#d8c39a', pal: ['#eddcb6', '#c1a479', '#f4e8ca', '#ab8c5c'], rings: true, seed: 89 },
    { name: 'Uranus',  r: 2.20, orbit: 93,  spin: 0.20, speed: 0.13, inc: -0.10, axis: 1.44, type: 'ice',    base: '#9fd2d9', pal: ['#b9e2e8', '#84bec8', '#a9d8de'], seed: 97 },
    { name: 'Neptune', r: 2.10, orbit: 105, spin: 0.21, speed: 0.10, inc: 0.05, axis: 0.49,  type: 'ice',    base: '#3d63bd', pal: ['#5b83d8', '#2f4d9c', '#4a6fc9'], seed: 103 },
  ];

  SPECS.forEach((p, i) => {
    const pivot = new THREE.Group();
    pivot.rotation.set(p.inc, Math.random() * Math.PI * 2, 0);
    solar.add(pivot);
    const holder = new THREE.Group(); holder.position.x = p.orbit; pivot.add(holder);

    const mesh = new THREE.Mesh(new THREE.SphereGeometry(p.r, 48, 32), new THREE.MeshStandardMaterial({
      map: planetTexture(p), roughness: p.type === 'gas' || p.type === 'ice' ? .85 : 1,
      metalness: 0, fog: false,
    }));
    mesh.rotation.z = p.axis; holder.add(mesh);

    if (p.air){                                          // thin atmospheric limb
      const air = new THREE.Mesh(new THREE.SphereGeometry(p.r * 1.045, 40, 26), new THREE.MeshBasicMaterial({
        color: p.air, transparent: true, opacity: .12, blending: THREE.AdditiveBlending,
        side: THREE.BackSide, depthWrite: false, fog: false,
      }));
      holder.add(air);
    }
    if (p.moon){
      const mp = new THREE.Group(); mp.rotation.x = 0.18; holder.add(mp);
      const moon = new THREE.Mesh(new THREE.SphereGeometry(p.r * .27, 32, 20), new THREE.MeshStandardMaterial({
        map: planetTexture({ type: 'rocky', base: '#9a958c', pal: ['#7d786f', '#b3ada2', '#66625b'], craters: 120, seed: 211 }),
        roughness: 1, metalness: 0, fog: false,
      }));
      moon.position.x = p.r * 2.6; mp.add(moon);
      p._moonPivot = mp;
    }
    if (p.rings){
      const rg = new THREE.RingGeometry(p.r * 1.35, p.r * 2.35, 128, 1);
      // remap uv across the ring width so the band texture runs radially
      const pos = rg.attributes.position, uv = rg.attributes.uv, v = new THREE.Vector3();
      const r0 = p.r * 1.35, r1 = p.r * 2.35;
      for (let k = 0; k < pos.count; k++){
        v.fromBufferAttribute(pos, k);
        uv.setXY(k, (v.length() - r0) / (r1 - r0), 0.5);
      }
      const ring = new THREE.Mesh(rg, new THREE.MeshBasicMaterial({
        map: ringTexture(p.seed + 5), transparent: true, side: THREE.DoubleSide, depthWrite: false, fog: false,
      }));
      ring.rotation.x = -Math.PI / 2 + 0.06; ring.rotation.z = p.axis; holder.add(ring);
    }
    planets.push({ pivot, mesh, spec: p, a: Math.random() * Math.PI * 2 });
  });

  // the sun, far off and low so it swings through frame as the table turns.
  // Anchored in world space (not the tilted ecliptic) to keep it in the visible band.
  const SUN = new THREE.Vector3(185, -42, 95);
  const sunGroup = new THREE.Group(); sunGroup.position.copy(SUN); scene.add(sunGroup);
  sunGroup.add(new THREE.Mesh(new THREE.SphereGeometry(7.5, 40, 26),
    new THREE.MeshBasicMaterial({ color: 0xfff6e2, fog: false })));
  [[34, 'rgba(255,246,214,0.95)', .9], [86, 'rgba(255,214,140,0.5)', .55], [190, 'rgba(255,178,96,0.22)', .35]]
    .forEach(([s, col, op]) => {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({
        map: radialSprite(0, 250, [[0, col], [.3, col.replace(/[\d.]+\)$/, '0.35)')], [1, col.replace(/[\d.]+\)$/, '0)')]]),
        transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
      }));
      sp.scale.setScalar(s); sunGroup.add(sp);
    });

  const sunLight = new THREE.DirectionalLight(0xfff4dd, 3.1);
  sunLight.position.copy(SUN); scene.add(sunLight);
  const skyFill = new THREE.AmbientLight(0x2a3a63, 0.30); solar.add(skyFill);
  solar.traverse(o => o.layers.set(SKY));
  sunGroup.traverse(o => o.layers.set(SKY));
  sunLight.layers.set(SKY);
}

/* table */
const TABLE_TOP = 0.0;
const tableGroup = new THREE.Group(); scene.add(tableGroup);
{
  const topMat = new THREE.MeshStandardMaterial({ map: tableTexture(), roughness: .62, metalness: .22, color: 0xffffff });
  const sideMat = new THREE.MeshStandardMaterial({ color: 0x1a120b, roughness: .8, metalness: .1 });
  const top = new THREE.Mesh(new THREE.CylinderGeometry(3.7, 3.7, 0.34, 96), [sideMat, topMat, sideMat]);
  top.position.y = TABLE_TOP - 0.17; top.receiveShadow = true; tableGroup.add(top);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(3.7, 0.07, 16, 120), new THREE.MeshStandardMaterial({ color: 0xc9a84c, roughness: .34, metalness: .95 }));
  lip.rotation.x = Math.PI / 2; lip.position.y = TABLE_TOP - 0.03; tableGroup.add(lip);
  const skirt = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 2.9, 0.7, 64), sideMat);
  skirt.position.y = TABLE_TOP - 0.66; tableGroup.add(skirt);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.5, 2.1, 48), sideMat);
  stem.position.y = TABLE_TOP - 2.0; tableGroup.add(stem);
  const glowRing = new THREE.Mesh(new THREE.RingGeometry(0.55, 3.55, 96),
    new THREE.MeshBasicMaterial({ map: radialSprite(60, 250, [[0, 'rgba(232,201,122,0.0)'], [.5, 'rgba(232,201,122,0.30)'], [1, 'rgba(232,201,122,0)']]), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  glowRing.rotation.x = -Math.PI / 2; glowRing.position.y = TABLE_TOP + 0.012; tableGroup.add(glowRing);
}

/* Jibril */
const jibril = new THREE.Group(); jibril.position.y = TABLE_TOP; scene.add(jibril);
{
  const beam = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 8.2),
    new THREE.MeshBasicMaterial({ map: shaftTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  beam.position.set(0, 4.0, -0.9); beam.material.opacity = 0.5;
  beam.material.depthTest = false; beam.renderOrder = 4; beam.name = 'beam'; jibril.add(beam);
  const figTex = new THREE.TextureLoader().load('angel-figure.png');
  figTex.colorSpace = THREE.SRGBColorSpace; figTex.anisotropy = 8;
  const figure = new THREE.Mesh(new THREE.PlaneGeometry(2.85, 3.65),
    new THREE.MeshBasicMaterial({ map: figTex, transparent: true, depthWrite: false, depthTest: false }));
  figure.renderOrder = 6;
  figure.position.y = 2.28; figure.name = 'figure'; jibril.add(figure);
  // wings: the source image split down the middle so each half can be pushed
  // outward, leaving a clear gap for the robe and hood
  const wings = new THREE.Group();
  wings.position.set(0, 2.92, -0.18); wings.name = 'wings'; jibril.add(wings);
  [-1, 1].forEach(sd => {
    const t = new THREE.TextureLoader().load('uploads/angel%20wings.webp');
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    t.repeat.set(0.5, 1); t.offset.set(sd > 0 ? 0.5 : 0, 0);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 2.7),
      new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0.88, depthWrite: false, depthTest: false, side: THREE.DoubleSide }));
    m.renderOrder = 5;
    m.position.x = sd * (0.675 + 0.26);
    wings.add(m);
  });
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialSprite(0, 200, [[0, 'rgba(255,255,255,0.95)'], [.22, 'rgba(255,240,200,0.45)'], [1, 'rgba(232,201,122,0)']]), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  halo.position.y = 3.95; halo.scale.setScalar(0.8); halo.name = 'halo'; jibril.add(halo);
  const floor = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialSprite(0, 220, [[0, 'rgba(255,244,214,0.7)'], [.4, 'rgba(232,201,122,0.22)'], [1, 'rgba(232,201,122,0)']]), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  floor.position.y = 0.12; floor.scale.setScalar(3.2); jibril.add(floor);
  // motes
  const N = 260, pos = new Float32Array(N * 3), seed = [];
  for (let i = 0; i < N; i++){
    const a = Math.random() * Math.PI * 2, r = Math.random() * 1.5;
    pos[i * 3] = Math.cos(a) * r; pos[i * 3 + 1] = Math.random() * 4.2; pos[i * 3 + 2] = Math.sin(a) * r;
    seed.push({ a, r, sp: .18 + Math.random() * .5, y: pos[i * 3 + 1] });
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const motes = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffe9b0, size: 0.05, transparent: true, opacity: .85, blending: THREE.AdditiveBlending, depthWrite: false }));
  motes.name = 'motes'; motes.userData.seed = seed; jibril.add(motes);
}

/* books */
const BW = 1.62, BD = 2.24, BT = 0.36, HW = BW / 2;
const parchMat = new THREE.MeshStandardMaterial({ color: 0xe6dabf, roughness: .95, metalness: 0 });
const edgeSide = new THREE.MeshStandardMaterial({ map: pageEdgeTexture(11, false), roughness: .92, metalness: .04 });
const edgeFront = new THREE.MeshStandardMaterial({ map: pageEdgeTexture(29, true), roughness: .92, metalness: .04 });
const gildMat = new THREE.MeshStandardMaterial({ color: 0xb99442, roughness: .38, metalness: .85 });
const books = [];
CATS.forEach((cat, i) => {
  const list = byCat(cat.key);
  const angle = -Math.PI / 2 + i / CATS.length * Math.PI * 2;
  const R = 2.35;
  const g = new THREE.Group();
  g.position.set(Math.cos(angle) * R, TABLE_TOP + 0.02, Math.sin(angle) * R);
  g.rotation.y = -angle + Math.PI / 2;
  scene.add(g);

  const lm = leatherMaps(cat);
  const leather = new THREE.MeshStandardMaterial({
    map: lm.map, bumpMap: lm.bump, bumpScale: 0.035,
    color: 0xffffff, roughness: .82, metalness: .06
  });
  const back = new THREE.Mesh(new THREE.BoxGeometry(BW, 0.07, BD), leather);
  back.position.y = 0.035; back.castShadow = true; back.receiveShadow = true; g.add(back);

  // text block — gilded head, leaved fore-edge
  const pgH = BT - 0.14;
  const pagesClosed = new THREE.Mesh(new THREE.BoxGeometry(BW - 0.1, pgH, BD - 0.08),
    [edgeFront, edgeFront, gildMat, edgeSide, edgeSide, edgeSide]);
  pagesClosed.position.set(0.02, 0.07 + pgH / 2, 0); pagesClosed.castShadow = true; g.add(pagesClosed);
  // squares: the cover overhangs, so the block sits slightly proud of nothing — add headbands
  [-1, 1].forEach(s => {
    const hb = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, BW - 0.24, 10),
      new THREE.MeshStandardMaterial({ color: 0xa8813c, roughness: .7 }));
    hb.rotation.z = Math.PI / 2;
    hb.position.set(0.02, 0.07 + pgH - 0.012, s * (BD / 2 - 0.06));
    g.add(hb);
  });

  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.1, BT, BD), leather);
  spine.position.set(-HW + 0.03, BT / 2, 0); spine.castShadow = true; g.add(spine);
  // raised bands across the spine
  [-0.72, -0.24, 0.24, 0.72].forEach(z => {
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, BT + 0.02, 12, 1, false, 0, Math.PI), leather);
    band.rotation.z = Math.PI / 2; band.rotation.y = Math.PI / 2;
    band.position.set(-HW - 0.005, BT / 2, z * (BD / 2.2));
    band.castShadow = true; g.add(band);
  });
  // gold fillets flanking the bands
  [-0.48, 0.48].forEach(z => {
    const f = new THREE.Mesh(new THREE.BoxGeometry(0.012, BT - 0.02, 0.012), gildMat);
    f.position.set(-HW - 0.018, BT / 2, z * (BD / 2.2)); g.add(f);
  });

  const coverPivot = new THREE.Group();
  coverPivot.position.set(-HW + 0.06, BT - 0.02, 0); g.add(coverPivot);
  const cover = new THREE.Mesh(new THREE.BoxGeometry(BW, 0.07, BD), leather);
  cover.position.set(BW / 2, 0, 0); cover.castShadow = true; coverPivot.add(cover);
  const ct = coverTexture(cat, list.length);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(BW - 0.02, BD - 0.02),
    new THREE.MeshStandardMaterial({ map: ct.map, bumpMap: ct.bump, bumpScale: 0.03, roughness: .74, metalness: .18 }));
  face.rotation.x = -Math.PI / 2; face.position.set(BW / 2, 0.037, 0); coverPivot.add(face);
  // brass corner protectors
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    const cp = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.018, 0.17), gildMat);
    cp.position.set(BW / 2 + sx * (BW / 2 - 0.075), 0.036, sz * (BD / 2 - 0.075));
    cp.castShadow = true; coverPivot.add(cp);
  });

  const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.006, 0.34),
    new THREE.MeshStandardMaterial({ color: 0x4b2a28, roughness: .88 }));
  ribbon.position.set(HW - 0.34, 0.07 + pgH - 0.004, BD / 2 - 0.1);
  ribbon.rotation.y = 0.06; ribbon.castShadow = true; g.add(ribbon);

  // open rig (hidden until opened) — centred at x = -(BW/2 - 0.03)
  const rig = new THREE.Group(); rig.position.set(-(BW / 2 - 0.03), 0, 0); rig.visible = false; g.add(rig);
  const halfW = BW - 0.06;
  [-1, 1].forEach(s => {
    const blk = new THREE.Mesh(new THREE.BoxGeometry(halfW, 0.20, BD - 0.06),
      [edgeFront, edgeFront, parchMat, edgeSide, edgeSide, edgeSide]);
    blk.position.set(s * (halfW / 2 + 0.005), 0.1 + BT - 0.02, 0); blk.castShadow = true; blk.receiveShadow = true; rig.add(blk);
  });
  const spread = new THREE.Mesh(new THREE.PlaneGeometry(halfW * 2, BD - 0.06), new THREE.MeshStandardMaterial({ roughness: .96, metalness: 0, color: 0xffffff, emissive: 0xffffff, emissiveIntensity: .13 }));
  spread.rotation.x = -Math.PI / 2; spread.position.y = 0.201 + BT - 0.02; spread.name = 'spread'; rig.add(spread);
  const flipPivot = new THREE.Group(); flipPivot.position.y = 0.205 + BT - 0.02; rig.add(flipPivot);
  const flipGeo = new THREE.PlaneGeometry(halfW, BD - 0.08, 26, 8);
  const flipPage = new THREE.Mesh(flipGeo, new THREE.MeshStandardMaterial({
    color: 0xf3ecdc, roughness: .96, metalness: 0, side: THREE.DoubleSide,
    emissive: 0xffffff, emissiveIntensity: .07
  }));
  flipPage.rotation.x = -Math.PI / 2;
  flipPage.position.x = halfW / 2; flipPage.castShadow = true;
  flipPage.userData.base = Float32Array.from(flipGeo.attributes.position.array);
  flipPage.userData.hw = halfW;
  flipPivot.add(flipPage); flipPivot.visible = false;

  // floating emblem bubble above the volume
  const med = new THREE.Sprite(new THREE.SpriteMaterial({
    map: medallionTexture(cat), transparent: true, depthWrite: false, opacity: 0,
  }));
  med.scale.setScalar(1.15); med.position.set(0, 1.30, 0); med.name = 'medallion';
  med.renderOrder = 8; g.add(med);

  books.push({ cat, group: g, coverPivot, rig, spread, flipPivot, flipPage, list, med,
    home: g.position.clone(), homeRotY: g.rotation.y, angle,
    hoverT: 0, openT: 0, page: 0, view: 'toc', entry: null, regions: [], hover: null, phase: 0 });
});

/* ─────────────────────────── state & interaction ─────────────────────────── */
let mode = 'hub';            // 'hub' | 'opening' | 'reading' | 'closing'
let active = null;
let orbit = 0.6, orbitTarget = 0.6, dragging = false, lastX = 0, dragVel = 0;
let camPitch = 0.62;
const ray = new THREE.Raycaster(), pointer = new THREE.Vector2();
const el = renderer.domElement;
const tip = document.getElementById('booktip');
const hint = document.getElementById('hint');
const backBtn = document.getElementById('back');
const jLabel = document.getElementById('jibrilLabel');
const veil = document.getElementById('veil');
const readVeil = document.getElementById('readveil');

const READ_POS = new THREE.Vector3(0, TABLE_TOP + 0.95, 3.3);

function setSpread(book){
  const r = book.view === 'toc' ? tocTexture(book.cat, book.page, book.hover)
                                : entryTexture(book.cat, book.entry, book.hover);
  if (book.spread.material.map) book.spread.material.map.dispose();
  book.spread.material.map = r.texture;
  book.spread.material.emissiveMap = r.texture;
  book.spread.material.needsUpdate = true;
  book.regions = r.regions;
}

function openBook(book){
  if (mode !== 'hub') return;
  active = book; mode = 'opening'; book.phase = 0;
  book.view = 'toc'; book.page = 0; book.hover = null; book.entry = null;
  setSpread(book);
  hint.style.opacity = 0; jLabel.style.opacity = 0; tip.style.opacity = 0;
  backBtn.classList.add('show');
}
function closeBook(){
  if (!active) return;
  mode = 'closing'; backBtn.classList.remove('show');
  hint.textContent = 'Drag to turn the table · choose a volume';
}
backBtn.onclick = closeBook;

function openReadPanel(entry, cat){
  document.getElementById('readEyebrow').textContent =
    cat.title + ' · ' + entry.difficulty.toUpperCase() + ' · ENTRY ' + String(entry.id).padStart(2, '0');
  document.getElementById('readMyth').textContent = entry.myth;
  document.getElementById('readBody').innerHTML = window.buildEntryBodyHTML(entry);

  const gameBtn = document.getElementById('gameBubbleBtn');
  if (gameBtn) gameBtn.style.display = entry.game ? 'flex' : 'none';

  document.getElementById('readpanel').scrollTop = 0;
  readVeil.classList.add('show');
}
function closeReadPanel(){
  readVeil.classList.remove('show');
  if (typeof window.stopReader === 'function') window.stopReader();
}
document.getElementById('readclose').onclick = closeReadPanel;
readVeil.addEventListener('pointerdown', e => { if (e.target === readVeil) closeReadPanel(); });

function applyTheme(theme){
  const isWhite = theme === 'white';
  if (isWhite) document.documentElement.setAttribute('data-theme', 'white');
  else document.documentElement.removeAttribute('data-theme');
  const btn = document.getElementById('themeToggleBtn');
  if (btn){
    btn.textContent = isWhite ? '☾' : '☀';
    btn.title = isWhite ? 'Switch to gold theme' : 'Switch to high-contrast white theme';
  }
}
function toggleTheme(){
  const current = document.documentElement.getAttribute('data-theme') === 'white' ? 'white' : 'gold';
  const next = current === 'white' ? 'gold' : 'white';
  try { localStorage.setItem('alhaqq-theme', next); } catch (e) {}
  applyTheme(next);
}
document.getElementById('themeToggleBtn').onclick = toggleTheme;
applyTheme(document.documentElement.getAttribute('data-theme') === 'white' ? 'white' : 'gold');

const signVeil = document.getElementById('signveil');
const signPill = document.getElementById('signPill');

function applyAccessState(){
  if (isOwner()) signPill.textContent = '👑 Owner';
  else if (isSubscriber()) signPill.textContent = '★ Member';
  else signPill.textContent = 'Sign In';
  if (active) setSpread(active);
}

function openSignIn(){
  if (isOwner()){
    if (confirm('Signed in as site owner. Sign out?')){
      localStorage.removeItem('alhaqq_owner');
      location.reload();
    }
    return;
  }
  if (isSubscriber()){
    if (confirm('You are signed in as a subscriber. Sign out?')){
      localStorage.removeItem('alhaqq_sub_token');
      localStorage.removeItem('alhaqq_sub_email');
      location.reload();
    }
    return;
  }
  document.getElementById('signTitle').textContent = 'MEMBER ACCESS';
  document.getElementById('signDesc').textContent = 'Enter the email you used to subscribe. Your access unlocks instantly.';
  signVeil.classList.add('show');
  setTimeout(() => document.getElementById('signEmail').focus(), 150);
}
function closeSignIn(){
  signVeil.classList.remove('show');
  document.getElementById('signEmail').value = '';
  document.getElementById('signErr').textContent = '';
  const btn = document.getElementById('signBtn');
  btn.textContent = 'UNLOCK MY ACCESS'; btn.disabled = false; btn.style.opacity = '1';
}
async function submitSignIn(){
  const email = document.getElementById('signEmail').value.trim().toLowerCase();
  const errEl = document.getElementById('signErr');
  const btn = document.getElementById('signBtn');
  if (!email || !email.includes('@')){ errEl.textContent = 'Please enter a valid email address.'; return; }
  btn.textContent = 'Verifying…'; btn.disabled = true; btn.style.opacity = '0.7'; errEl.textContent = '';
  try {
    const res = await fetch('/.netlify/functions/verify-subscriber', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (res.ok && data.access){
      if (data.access === 'owner') localStorage.setItem('alhaqq_owner', '1');
      else { localStorage.setItem('alhaqq_sub_token', data.token); localStorage.setItem('alhaqq_sub_email', email); }
      closeSignIn();
      applyAccessState();
    } else {
      errEl.textContent = data.error || 'Sign in failed. Please try again.';
      btn.textContent = 'UNLOCK MY ACCESS'; btn.disabled = false; btn.style.opacity = '1';
    }
  } catch (err){
    errEl.textContent = 'Could not connect. Check your internet and try again.';
    btn.textContent = 'UNLOCK MY ACCESS'; btn.disabled = false; btn.style.opacity = '1';
  }
}
signPill.onclick = openSignIn;
document.getElementById('signclose').onclick = closeSignIn;
signVeil.addEventListener('pointerdown', e => { if (e.target === signVeil) closeSignIn(); });
document.getElementById('signBtn').onclick = submitSignIn;
document.getElementById('signEmail').addEventListener('keydown', e => { if (e.key === 'Enter') submitSignIn(); });

function checkSignInRedirect(){
  const params = new URLSearchParams(location.search);
  if (params.get('signin') === '1' && !hasAccess()){
    history.replaceState({}, '', location.pathname);
    openSignIn();
  }
}
function checkSubscribeRedirect(){
  const params = new URLSearchParams(location.search);
  if (params.get('subscribed') === '1'){
    history.replaceState({}, '', location.pathname);
    document.getElementById('signTitle').textContent = '🎉 PAYMENT SUCCESSFUL';
    document.getElementById('signDesc').textContent = 'Enter the email you used at checkout to unlock all entries now.';
    signVeil.classList.add('show');
    setTimeout(() => document.getElementById('signEmail').focus(), 150);
  }
}
applyAccessState();

function pointerFromEvent(e){
  pointer.x = (e.clientX / innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / innerHeight) * 2 + 1;
}
function hitSpread(){
  if (!active) return null;
  ray.setFromCamera(pointer, camera);
  const hits = ray.intersectObject(active.spread, false);
  if (!hits.length || !hits[0].uv) return null;
  const px = hits[0].uv.x * SW, py = (1 - hits[0].uv.y) * SH;
  return active.regions.find(r => px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) || null;
}
function hitBook(){
  ray.setFromCamera(pointer, camera);
  for (const b of books){
    const hits = ray.intersectObject(b.group, true);
    if (hits.length) return b;
  }
  return null;
}

let hoveredBook = null;
el.addEventListener('pointermove', e => {
  pointerFromEvent(e);
  if (dragging){
    const dx = e.clientX - lastX; lastX = e.clientX;
    orbitTarget -= dx * 0.006; dragVel = -dx * 0.0009;
    return;
  }
  if (mode === 'hub'){
    const b = hitBook();
    if (b !== hoveredBook){
      hoveredBook = b;
      el.style.cursor = b ? 'pointer' : 'grab';
      if (b){
        tip.innerHTML = b.cat.title + '<small>' + b.list.length + (b.list.length === 1 ? ' entry · ' : ' entries · ') + b.cat.sub + '</small>';
        tip.style.opacity = 1;
      } else tip.style.opacity = 0;
    }
    if (b){ tip.style.left = e.clientX + 'px'; tip.style.top = e.clientY + 'px'; }
  } else if (mode === 'reading'){
    const r = hitSpread();
    const id = r ? r.id : null;
    el.style.cursor = id ? 'pointer' : 'default';
    if (id !== active.hover){ active.hover = id; setSpread(active); }
  }
});
el.addEventListener('pointerdown', e => {
  pointerFromEvent(e);
  if (mode === 'hub'){ dragging = true; lastX = e.clientX; el.setPointerCapture(e.pointerId); el.style.cursor = 'grabbing'; }
});
el.addEventListener('pointerup', e => {
  const wasDrag = Math.abs(dragVel) > 0.0025;
  dragging = false; el.style.cursor = 'grab';
  pointerFromEvent(e);
  if (mode === 'hub' && !wasDrag){
    const b = hitBook();
    if (b) openBook(b);
  } else if (mode === 'reading'){
    const r = hitSpread();
    if (!r) return;
    if (r.id === 'next'){ active.page++; active.hover = null; flipTo(); }
    else if (r.id === 'prev'){ active.page--; active.hover = null; flipTo(); }
    else if (r.id === 'back'){ active.view = 'toc'; active.hover = null; flipTo(); }
    else if (r.id === 'open'){
      if (r.entry.locked && !hasAccess()) window.open('https://alhaqq.it.com/landing.html#pricing', '_blank', 'noopener');
      else openReadPanel(r.entry, active.cat);
    }
    else if (r.entry){ active.view = 'entry'; active.entry = r.entry; active.hover = null; flipTo(); }
  }
});

/* page-turn animation */
let flip = 0, flipping = false, flipSwapped = false;
function flipTo(){ flipping = true; flip = 0; flipSwapped = false; active.flipPivot.visible = true; }
function curlPage(mesh, p){
  const pos = mesh.geometry.attributes.position, base = mesh.userData.base, hw = mesh.userData.hw;
  const A = Math.sin(Math.PI * Math.min(1, p));
  for (let i = 0; i < pos.count; i++){
    const x = base[i * 3], y = base[i * 3 + 1];
    const u = (x + hw / 2) / hw;                       // 0 spine → 1 free edge
    const v = y / (BD - 0.08);                          // -.5 → .5 across the leaf
    const bow = Math.sin(Math.PI * u) * 0.075;          // sheet bows as it lifts
    const droop = Math.pow(u, 3) * 0.055;               // weight pulls the tip down
    const wave = Math.cos(v * Math.PI) * 0.16 + 0.84;   // slight cross-wise waviness
    pos.array[i * 3]     = x - u * hw * 0.055 * A;      // chord shortens as it curves
    pos.array[i * 3 + 1] = y;
    pos.array[i * 3 + 2] = (bow - droop) * wave * A;
  }
  pos.needsUpdate = true; mesh.geometry.computeVertexNormals();
}

jLabel.onclick = () => veil.classList.add('show');
window.openVolume = i => openBook(books[i]);
window.selectRow = n => { active.view = 'entry'; active.entry = active.list[n]; active.hover = null; flipTo(); };
document.getElementById('jclose').onclick = () => veil.classList.remove('show');
document.getElementById('jsend').onclick = () => {
  const q = document.getElementById('jinput').value.trim();
  window.open('https://alhaqq.it.com/' + (q ? '?ask=' + encodeURIComponent(q) : ''), '_blank', 'noopener');
};
document.getElementById('jinput').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('jsend').click(); });
addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (readVeil.classList.contains('show')) closeReadPanel();
  else if (signVeil.classList.contains('show')) closeSignIn();
  else { veil.classList.remove('show'); if (mode === 'reading') closeBook(); }
});

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

/* ─────────────────────────── loop ─────────────────────────── */
const clock = new THREE.Clock();
const camPos = new THREE.Vector3(), camLook = new THREE.Vector3(0, TABLE_TOP + 0.5, 0);
const tmpV = new THREE.Vector3();
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const angLerp = (cur, target, k) => {
  let d = ((target - cur + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
  return cur + d * k;
};

function tick(){
  const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;

  if (mode === 'hub' && !dragging){ orbitTarget += dt * 0.045 + dragVel; dragVel *= 0.94; }
  orbit += (orbitTarget - orbit) * Math.min(1, dt * 6);

  // camera
  let targetPos, targetLook, targetPitch;
  if (mode === 'hub'){
    const r = 8.4;
    targetPos = tmpV.set(Math.cos(orbit) * r, 5.0, Math.sin(orbit) * r).clone();
    targetLook = new THREE.Vector3(0, TABLE_TOP + 1.05, 0);
  } else {
    targetPos = new THREE.Vector3(0, READ_POS.y + 3.45, READ_POS.z + 1.7);
    targetLook = new THREE.Vector3(0, READ_POS.y + 0.28, READ_POS.z - 0.05);
  }
  const k = Math.min(1, dt * (mode === 'hub' ? 2.2 : 2.6));
  camPos.lerp(targetPos, k); camLook.lerp(targetLook, k);
  camera.position.copy(camPos); camera.lookAt(camLook);

  // jibril breathing
  const beam = jibril.getObjectByName('beam'), figure = jibril.getObjectByName('figure'), halo = jibril.getObjectByName('halo');
  jibril.getObjectByName('motes').userData.seed.forEach((s, i) => {
    const arr = jibril.getObjectByName('motes').geometry.attributes.position.array;
    s.y += dt * s.sp; if (s.y > 4.4) s.y = 0;
    arr[i * 3] = Math.cos(s.a + t * 0.3) * s.r; arr[i * 3 + 1] = s.y; arr[i * 3 + 2] = Math.sin(s.a + t * 0.3) * s.r;
  });
  jibril.getObjectByName('motes').geometry.attributes.position.needsUpdate = true;
  const pulse = 0.9 + Math.sin(t * 1.15) * 0.09;
  halo.scale.setScalar(0.8 * pulse); halo.material.opacity = 0.17 * pulse;
  jibrilLight.intensity = 24 * pulse;
  figure.position.y = 2.28 + Math.sin(t * 0.8) * 0.05;
  figure.scale.setScalar(1 + Math.sin(t * 0.7) * 0.012);
  beam.material.opacity = 0.62 + Math.sin(t * 0.6) * 0.10;
  const wings = jibril.getObjectByName('wings');
  [beam, figure, wings].forEach(o => o.quaternion.copy(camera.quaternion));
  wings.position.y = 2.92 + Math.sin(t * 0.8) * 0.045;
  wings.scale.setScalar(1 + Math.sin(t * 0.55) * 0.014);
  const dim = mode === 'hub' ? 1 : 0.42;
  const fade = c => { if (c.material && c.material.opacity !== undefined) c.material.opacity += ((c.userData.base ?? (c.userData.base = c.material.opacity)) * dim - c.material.opacity) * dt * 3; };
  const depth = mode !== 'hub';
  const setDepth = c => { if (c.material && c.material.depthTest !== undefined && c.name !== 'halo') c.material.depthTest = depth; };
  jibril.children.forEach(c => { fade(c); setDepth(c); c.children.forEach(o => { fade(o); setDepth(o); }); });

  // solar system: orbital revolution + axial spin
  planets.forEach(pl => {
    pl.a += dt * pl.spec.speed * 0.055;
    pl.pivot.rotation.y = pl.a;
    pl.mesh.rotation.y += dt * pl.spec.spin;
    if (pl.spec._moonPivot) pl.spec._moonPivot.rotation.y += dt * 0.42;
  });

  // books
  books.forEach(b => {
    const isActive = b === active;
    const hovered = mode === 'hub' && b === hoveredBook;
    b.hoverT += ((hovered ? 1 : 0) - b.hoverT) * Math.min(1, dt * 8);

    let openTarget = 0;
    if (isActive && (mode === 'opening' || mode === 'reading')) openTarget = 1;
    b.openT += (openTarget - b.openT) * Math.min(1, dt * 2.6);
    if (mode === 'opening' && b.openT > 0.985){ mode = 'reading'; }
    if (mode === 'closing' && active === b && b.openT < 0.02){ mode = 'hub'; active = null; b.rig.visible = false; }

    const o = ease(Math.min(1, b.openT));
    b.rig.visible = o > 0.02;
    b.coverPivot.rotation.z = Math.PI * o;
    b.spread.material.opacity = 1;
    b.rig.scale.setScalar(0.001 + o);

    if (o > 0.01){
      b.group.rotation.y = angLerp(b.group.rotation.y, 0, Math.min(1, dt * 5));
      const target = new THREE.Vector3(READ_POS.x + (BW / 2 - 0.03), READ_POS.y, READ_POS.z);
      b.group.position.lerpVectors(b.home, target, o);
      b.group.position.y += Math.sin(o * Math.PI) * 0.9;
    } else {
      b.group.rotation.y = angLerp(b.group.rotation.y, Math.atan2(camPos.x - b.home.x, camPos.z - b.home.z), Math.min(1, dt * 4));
      b.group.position.copy(b.home);
      b.group.position.y += b.hoverT * 0.16 + Math.sin(t * 0.7 + b.angle * 2) * 0.02;
      b.group.rotation.z = b.hoverT * 0.02;
    }
    // other books recede while reading
    const away = (mode !== 'hub' && !isActive) ? 1 : 0;
    b.group.userData.away = (b.group.userData.away ?? 0) + (away - (b.group.userData.away ?? 0)) * Math.min(1, dt * 3);
    if (!isActive){
      const a = b.group.userData.away;
      b.group.position.y -= a * 0.6;
      b.group.scale.setScalar(1 - a * 0.35);
    } else b.group.scale.setScalar(1);

    // bubble: bob, swell on hover, vanish when the volume opens or recedes
    const vis = (1 - o) * (1 - (b.group.userData.away ?? 0));
    b.med.material.opacity += (vis * (0.85 + b.hoverT * 0.15) - b.med.material.opacity) * Math.min(1, dt * 6);
    b.med.position.y = 1.30 + Math.sin(t * 1.1 + b.angle * 3) * 0.075 + b.hoverT * 0.10;
    b.med.scale.setScalar((1.15 + b.hoverT * 0.22) * (1 + Math.sin(t * 1.6 + b.angle) * 0.018));
    b.med.visible = vis > 0.01;
  });

  // page flip
  if (flipping && active){
    flip += dt * 1.35;
    const r = Math.min(1, flip);
    const e = r < .5 ? 2 * r * r : 1 - Math.pow(-2 * r + 2, 2) / 2;   // ease-in-out: heavy leaf
    active.flipPivot.rotation.z = Math.PI * e;
    curlPage(active.flipPage, r);
    if (e > 0.52 && !flipSwapped){ flipSwapped = true; setSpread(active); }
    if (flip >= 1){
      flipping = false; active.flipPivot.visible = false; active.flipPivot.rotation.z = 0;
      curlPage(active.flipPage, 0);
    }
  }

  // jibril label position
  const jp = new THREE.Vector3(0, TABLE_TOP + 4.55, 0).project(camera);
  jLabel.style.left = (jp.x * 0.5 + 0.5) * innerWidth + 'px';
  jLabel.style.top = Math.max(10, (-jp.y * 0.5 + 0.5) * innerHeight) + 'px';
  jLabel.style.opacity = mode === 'hub' ? 1 : 0;
  jLabel.style.pointerEvents = mode === 'hub' ? 'auto' : 'none';
  hint.style.opacity = mode === 'hub' ? 1 : 0;

  const stars = scene.getObjectByName('stars'); if (stars) stars.rotation.y = t * 0.006;

  readLight.intensity += ((mode === 'hub' ? 0 : 18) - readLight.intensity) * Math.min(1, dt * 3);
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

camPos.set(Math.cos(orbit) * 9.5, 6.4, Math.sin(orbit) * 9.5);
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
  books.forEach(b => { setSpread(b); });
  setTimeout(() => document.getElementById('loader').classList.add('gone'), 260);
  tick();
  setTimeout(() => { checkSignInRedirect(); checkSubscribeRedirect(); }, 500);
});
