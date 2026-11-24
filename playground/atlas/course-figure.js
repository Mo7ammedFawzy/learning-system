// The dashboard's side of every figure. A page opened from disk cannot reach into its iframes, so the
// course look, zoom, popovers and the link to the page live here and talk over postMessage.
// Inert unless the dashboard opens the figure with #course: a figure opened alone looks as it always did.
// dashboard.mjs adds the script tag to each figure.
//
// Part popovers (spec decision 18): a figure gives its parts text with
//   <script type="application/json" id="part-text">{"drum":{"name":"Drum","text":"One sentence."}}</script>
// keyed by data-part. A part without an entry shows no popover.
(() => {
  if (location.hash !== '#course' || parent === window) return;

  const CSS = `html .iso[data-theme="light"], html [data-theme="light"] .iso {
  --anatomy-page:#f4ebe0;--anatomy-card:#f7efe4;--anatomy-paper:#f7efe4;--anatomy-text:#4a453f;--anatomy-strong:#1d1b18;--anatomy-muted:#6f6961;
  --anatomy-face:#fbf5ec;--anatomy-top:#fbf5ec;--anatomy-lit-top:#fffaf2;--anatomy-lit-shade:#f1e7da;
  --anatomy-shade-0:#e3d6c4;--anatomy-shade-1:#eadfcf;--anatomy-shade-2:#f0e6d8;--anatomy-shade-3:#f5ede2;
  --anatomy-hi:#1d1b18;--anatomy-mid:#46413b;--anatomy-lo:#8a7f72;--anatomy-faint:#ddd3c5;--anatomy-lit:#1d1b18;
  --anatomy-halo:#a08c70;--anatomy-halo-opacity:.28;--anatomy-dot:#46413b;
  --anatomy-red:#d0683a;--anatomy-green:#5f8f3a;--anatomy-blue:#7a5fb5;
  --anatomy-mono:"JetBrains Mono",ui-monospace,Consolas,monospace;--anatomy-weight:1.2px;
  --anatomy-lift:inset 0 1px 0 #ffffffa6,0 0 0 1.2px #ddd3c5,0 10px 22px -16px rgba(80,60,35,.35); }
html, body { height:100%; overflow:hidden !important; margin:0 !important; background:transparent !important; color-scheme:light !important; }
.ar-summary, .iso-plate-corners, .iso-caption { display:none !important; }
.iso-page { height:100%; display:flex; gap:16px; align-items:stretch; padding:0 !important; margin:0 !important; max-width:none !important; width:100% !important; box-sizing:border-box; background:transparent !important; }
.iso-figure { flex:1; min-width:0; min-height:0; margin:0 !important; display:flex !important; flex-direction:column; max-width:none !important; width:auto !important; }
.iso-plate > :not(.iso-stage):not(.iso-plate-corners) { flex:none; }
.fx-sidecol { display:grid !important; grid-template-columns:minmax(0,1fr) 360px; grid-auto-rows:min-content; column-gap:16px; row-gap:6px; align-content:center;
  flex:1 1 0 !important; min-height:0; height:100%; width:100% !important; max-width:none !important; margin:0 !important; }
.fx-sidecol > .iso-stage { grid-column:1; grid-row:1 / span 20; align-self:stretch; height:100%; }
.fx-sidecol > :not(.iso-stage):not(.iso-plate-corners) { grid-column:2; }
.iso-plate { flex:1; min-height:0; display:flex; flex-direction:column; gap:6px; background:transparent !important; border:0 !important; box-shadow:none !important; padding:0 !important; margin:0 !important; aspect-ratio:auto !important; }
.iso-stage { flex:1; min-height:0; display:flex; overflow:hidden !important; cursor:grab; touch-action:none; }
.iso-stage.panning { cursor:grabbing; }
.iso-stage svg { width:100% !important; height:100% !important; max-width:none !important; max-height:none !important; transform-origin:0 0; }
.iso-legend { flex:none; margin:6px 0 0 !important; padding:0 !important; border:0 !important; font:11.5px "JetBrains Mono",ui-monospace,monospace !important; color:#6f6961 !important; }
.iso-keys { display:flex !important; flex-wrap:wrap; gap:4px 18px; }
.fx-side div, .fx-side section { flex-wrap:wrap !important; min-width:0; max-width:100%; }
.fx-side { gap:6px !important; } .fx-side > * + * { margin-top:6px !important; }
.fx-side select { max-width:100%; }
.iso-page > :not(.iso-figure):not(.ar-summary):not(style):not(script) { flex:0 0 360px; max-width:360px; align-self:center; max-height:100%; overflow-x:hidden !important; overflow-y:auto; font-size:12px; }
.fx-side { margin:0 !important; padding:12px !important; box-sizing:border-box; background:#f7efe4 !important; border:1.2px solid #ddd3c5 !important; border-radius:12px !important;
  box-shadow:inset 0 1px 0 #ffffffa6, 0 10px 22px -16px rgba(80,60,35,.35) !important; font-family:"JetBrains Mono",ui-monospace,monospace !important; color:#1d1b18; }
body *:not(svg):not(svg *):not(.iso-stage) { overflow-x:clip !important; } /* clip, not hidden: hidden would turn every box into a vertical scroller */
pre, code, li { white-space:pre-wrap !important; word-break:break-word !important; overflow-wrap:anywhere; text-overflow:clip !important; }
pre { background:#fffaf2 !important; border:1.2px solid #ddd3c5 !important; border-radius:8px !important; box-shadow:none !important; padding:6px 9px !important; margin:0 !important; color:#6f6961 !important; font-size:11px !important; line-height:1.5 !important; }
pre [data-on], pre .on { color:#1d1b18 !important; font-weight:700; }
.fx-side ol { display:grid !important; gap:4px !important; margin:0 0 8px !important; }
.fx-side li { display:block !important; padding:5px 10px !important; border:1.2px solid transparent !important; border-radius:8px !important; color:#6f6961 !important; font-size:12px !important; line-height:1.5 !important; transition:background .15s, transform .08s; }
.fx-side li::before { color:#b5aa9a !important; }
.fx-side li:hover { background:#0000000a !important; }
.fx-side li[data-on] { color:#1d1b18 !important; font-weight:600; background:#cfe3b2 !important; border-color:#46413b !important; box-shadow:inset 0 1px 0 #fff8, 1.5px 2.5px 0 #1d1b18 !important; }
.fx-side li code { display:block; }
.fx-side p { margin:6px 0 0 !important; padding:6px 10px !important; background:#fffaf2 !important; border:1.2px solid #46413b !important; border-radius:10px !important; box-shadow:1.5px 2.5px 0 #1d1b18 !important;
  font:12.5px/1.55 Inter,system-ui,sans-serif !important; color:#1d1b18 !important; }
button:not(svg *), select:not(svg *) { font:500 11.5px "JetBrains Mono",ui-monospace,monospace !important; color:#1d1b18 !important; background:#f7efe4 !important; border:1.2px solid #46413b !important; border-radius:8px !important;
  box-shadow:inset 0 1px 0 #fff8, 1.5px 2.5px 0 #1d1b18 !important; height:auto !important; padding:5px 9px !important; text-transform:none !important; letter-spacing:0 !important; outline:none !important; cursor:pointer; }
button[aria-pressed="true"], button[data-on], button.on { background:#cfe3b2 !important; }
button:active:not(svg *) { transform:translate(1px,2px); box-shadow:none !important; }
button:disabled { opacity:.45; box-shadow:none !important; }
[class$="-label"], [class*="-row-label"] { color:#6f6961 !important; }
.fx-side.fx-tight { padding:8px !important; font-size:11px !important; line-height:1.35 !important; }
.fx-tight > * + * { margin-top:3px !important; }
.fx-tight li { padding:2px 8px !important; font-size:11px !important; line-height:1.35 !important; }
.fx-tight p { padding:4px 8px !important; font-size:11.5px !important; line-height:1.35 !important; }
.fx-tight pre { padding:4px 7px !important; font-size:10.5px !important; line-height:1.35 !important; }
#fx-pop { position:fixed; z-index:50; max-width:260px; padding:7px 11px; background:#fffaf2; border:1.2px solid #1d1b18; border-radius:10px; box-shadow:1.5px 2.5px 0 #1d1b18; pointer-events:none; font:12.5px/1.45 Inter,system-ui,sans-serif; color:#1d1b18; }
#fx-pop b { display:block; font:700 12px "JetBrains Mono",ui-monospace,monospace; }`;

  const style = document.createElement('style');
  style.textContent = `@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap");\n${CSS}`;
  document.head.appendChild(style);

  const $ = s => document.querySelector(s);
  const post = m => parent.postMessage(m, '*'); // '*': a page opened from disk has no origin to name
  const stage = $('.iso-stage'), svg = $('.iso-stage svg'), plate = $('.iso-plate');

  // Whatever sits beside the drawing becomes a side panel; tall extras under it move to a side column.
  document.querySelectorAll('.iso-page > :not(.iso-figure):not(.ar-summary):not(style):not(script)').forEach(el => el.classList.add('fx-side'));
  const holder = stage?.parentElement;
  const under = holder ? [...holder.children].filter(c => !c.matches('.iso-stage,.iso-plate-corners')) : [];
  if (under.reduce((h, c) => h + c.getBoundingClientRect().height, 0) > plate?.clientHeight / 3) {
    holder.classList.add('fx-sidecol'); holder.classList.remove('fx-side'); under.forEach(c => c.classList.add('fx-side'));
  }

  // A side panel a little taller than the frame tightens up instead of scrolling.
  const tighten = () => document.querySelectorAll('.fx-side').forEach(el => {
    el.classList.remove('fx-tight');
    if (el.scrollHeight > el.clientHeight + 1) el.classList.add('fx-tight');
  });
  tighten(); addEventListener('resize', tighten);

  // Same-size parts share a colour; the base board stays paper. Light to dark: top face, then shades.
  const HUES = [
    ['#e2efcf', '#cfe3b2', '#bed796', '#a9c97b', '#93b862'], ['#efe7f9', '#e7ddf5', '#d9c9f0', '#c8b3e7', '#b39cdb'],
    ['#fee8d3', '#fcdcbd', '#f8cb9f', '#f2b882', '#e9a466'], ['#e3edf9', '#d3e3f7', '#bfd4f1', '#a9c4ea', '#91b1df'],
    ['#e9f5e8', '#dff0de', '#cbe5c9', '#b4d8b1', '#9ccb98'],
  ];
  const tints = new Map();
  function colourParts() {
    if (!svg) return;
    const vb = svg.viewBox.baseVal, area = (vb && vb.width * vb.height) || 1;
    for (const g of svg.querySelectorAll('g.iso-solid:not([data-tint])')) {
      let b; try { b = g.getBBox(); } catch { continue; }
      if (b.width * b.height > area * .18) { g.dataset.tint = 'base'; continue; }
      // ponytail: same bounding-box size = same role. A per-figure role map would be exact.
      const k = Math.round(b.width / 6) + 'x' + Math.round(b.height / 6);
      if (!tints.has(k)) tints.set(k, HUES[tints.size % HUES.length]);
      const h = tints.get(k); g.dataset.tint = k;
      g.style.cssText += `;--anatomy-top:${h[0]};--anatomy-lit-top:${h[0]};--anatomy-face:${h[0]};--anatomy-paper:${h[1]};--anatomy-lit-shade:${h[2]};--anatomy-shade-3:${h[1]};--anatomy-shade-2:${h[2]};--anatomy-shade-1:${h[3]};--anatomy-shade-0:${h[4]}`;
    }
  }
  colourParts();
  let queued = false;
  if (stage) new MutationObserver(() => {
    if (queued) return; queued = true;
    requestAnimationFrame(() => { queued = false; colourParts(); });
  }).observe(stage, { childList: true, subtree: true });

  // ◀ ▶: the figure's own arrow keys; a figure without them steps through its buttons; else no arrows.
  const code = [...document.scripts].map(s => s.textContent).join('\n');
  const upDown = !/["']ArrowRight["']/.test(code) && /["']ArrowDown["']/.test(code); // figure 05b steps up and down
  const hasKeys = /["']keydown["']/.test(code) && (upDown || /["']ArrowRight["']/.test(code));
  const steps = () => [...document.querySelectorAll('.iso-page button:not(:disabled)')];
  let stepAt = -1; // action buttons show no pressed state, so remember which one ran last
  function press(key) {
    if (hasKeys) {
      const target = stage || document.body;
      const sent = upDown ? (key === 'ArrowRight' ? 'ArrowDown' : 'ArrowUp') : key;
      target.dispatchEvent(new KeyboardEvent('keydown', { key: sent, bubbles: true, cancelable: true }));
      return;
    }
    const list = steps(); if (!list.length) return;
    const pressed = list.findIndex(b => b.matches('[aria-pressed="true"],[data-on],.on'));
    const at = pressed >= 0 ? pressed : stepAt;
    const d = key === 'ArrowRight' ? 1 : -1;
    stepAt = at < 0 ? (d > 0 ? 0 : list.length - 1) : (at + d + list.length) % list.length;
    list[stepAt].click();
  }

  // Zoom and pan: a CSS transform on the drawing, no redraw.
  let z = 1, x = 0, y = 0;
  const paint = () => { if (svg) svg.style.transform = z === 1 && !x && !y ? '' : `translate(${x}px,${y}px) scale(${z})`; post({ course: 'zoom', z }); };
  function zoomAt(factor, cx, cy) {
    const next = Math.min(4, Math.max(.5, z * factor));
    x = cx - (cx - x) * next / z; y = cy - (cy - y) * next / z; z = next; paint();
  }
  const reset = () => { z = 1; x = 0; y = 0; paint(); };
  if (stage) {
    stage.addEventListener('wheel', e => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const r = stage.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
    let drag = null, moved = false;
    stage.addEventListener('pointerdown', e => { if (e.button === 0) { drag = { px: e.clientX, py: e.clientY, x, y, id: e.pointerId }; moved = false; } });
    stage.addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = e.clientX - drag.px, dy = e.clientY - drag.py;
      if (!moved && Math.hypot(dx, dy) < 4) return; // a press without movement stays a click on the part
      if (!moved) { moved = true; stage.setPointerCapture(drag.id); stage.classList.add('panning'); hidePop(); }
      x = drag.x + dx; y = drag.y + dy; paint();
    });
    const end = () => { drag = null; stage.classList.remove('panning'); };
    stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
    stage.addEventListener('click', e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  }

  // Popovers: only for parts the figure wrote text for.
  let partText = {};
  try { partText = JSON.parse($('#part-text')?.textContent || '{}'); } catch {}
  let pop = null;
  function hidePop() { pop?.remove(); pop = null; }
  if (stage) {
    stage.addEventListener('mousemove', e => {
      if (stage.classList.contains('panning')) return;
      const info = partText[e.target.closest?.('[data-part]')?.dataset.part];
      if (!info) return hidePop();
      if (!pop) { pop = document.createElement('div'); pop.id = 'fx-pop'; pop.append(document.createElement('b'), document.createElement('span')); document.body.appendChild(pop); }
      pop.firstChild.textContent = info.name; pop.lastChild.textContent = info.text;
      pop.style.left = Math.min(e.clientX + 14, innerWidth - pop.offsetWidth - 8) + 'px';
      pop.style.top = Math.max(8, e.clientY - pop.offsetHeight - 12) + 'px';
    });
    stage.addEventListener('mouseleave', hidePop);
  }

  addEventListener('message', e => {
    if (e.source !== parent) return;
    const m = e.data || {};
    if (m.course === 'key') press(m.key);
    if (m.course === 'zoom') {
      if (!m.dir) return reset();
      const r = stage.getBoundingClientRect();
      zoomAt(m.dir > 0 ? 1.25 : 1 / 1.25, r.width / 2, r.height / 2);
    }
  });
  // Focus sits inside the iframe after a click, so Ctrl K has to be passed up.
  addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); post({ course: 'search' }); }
  });

  const corner = k => $(`[data-corner="${k}"]`);
  const ro = corner('readout');
  if (ro) new MutationObserver(() => post({ course: 'readout', text: ro.textContent }))
    .observe(ro, { childList: true, characterData: true, subtree: true });
  const ar = $('.ar-summary')?.cloneNode(true);
  ar?.querySelector('strong')?.remove();
  post({
    course: 'ready',
    title: corner('title')?.textContent || '',
    hint: corner('hint')?.textContent || '',
    readout: ro?.textContent || '',
    ar: ar?.innerHTML || '',
    caption: $('.iso-caption')?.textContent || '',
    nav: hasKeys || steps().length > 0,
  });
})();
