// Fig 09a — a two-pan balance as a Comparator, and a rack as the TreeSet it serves.
// Run: node figure.mjs [--light]   → figure[-light].html next to this file.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL = process.env.ANATOMY_HOME ?? join(process.env.USERPROFILE ?? process.env.HOME, ".claude", "skills", "anatomy");
const load = (file) => import(pathToFileURL(join(SKILL, file)).href);
const k = await load("kit/iso-kit.mjs");
const G = await load("kit/lathe.mjs");
const { kitScript } = await load("scripts/inline-kit.mjs");

const theme = process.argv.includes("--light") ? "light" : "dark";
const WIDTH = 600;
const HEIGHT = 400;

// The model: every number the figure shows comes from here.
const UNIT = 5; // world units of block height per 1000 of salary
const SARA = { name: "Sara", salary: 5000 };
const RESIDENTS = [
  { name: "Omar", salary: 3000 },
  { name: "Ali", salary: 5000 },
  { name: "Mona", salary: 7000 },
];
const heightOf = (employee) => (employee.salary / 1000) * UNIT;
const MAX_TILT = 12; // degrees
const TILT_PER_UNIT = 1.2; // degrees per unit of height difference

const PLATE = { x: -120, y: -62, w: 240, d: 124, r: 8 };
const PLATE_H = 10;
const FOOT_H = 5;
const PED = { x: -18, y: -36, w: 36, d: 32, r: 3 };
const COLUMN = [0, -20];
const PIVOT = 88;
const ARM = 50;
const PAN_Z = 36;
const PAN_R = 15;
const YOKE_Z = 80;
const RACK = { x: 2, y: 28, w: 80, d: 24, r: 2 };
const RACK_H = 5;
const SEATS = [17, 42, 67];
const SEAT_Y = 40;
const BLOCK = 14;
const POINTER_Y = -14.6;
const POINTER_LEN = 40;
const SCALE = { x: -13, y: -16.5, w: 26, d: 1.4, r: 0.3 };

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [-ARM - 5, -20, PIVOT + 14], [ARM + 5, -20, PIVOT + 14]],
  WIDTH,
  HEIGHT,
  { pad: 34, azimuth: 45 },
);

const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 20))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  const strip = { x: -104, y: PLATE.y + PLATE.d - 15, w: 208, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  const label = { x: 68, y: -52, w: 36, d: 14, r: 1 };
  out.push(S(k.slabOf(label, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  out.push(L([4, 7, 10].map((dy, index) => k.lineOnTop([label.x + 4, label.y + dy], [label.x + label.w - (index === 2 ? 14 : 4), label.y + dy], 0.6, P)).join(""), { tone: "lo", free: true }));
  out.push(D([at([label.x + 2, label.y + 2, 0.6]), at([label.x + label.w - 2, label.y + label.d - 2, 0.6])], { size: 0.4 }));
  return out.join("");
}

// A tray of three calibration weights, front left.
function weights() {
  const tray = { x: -108, y: 20, w: 44, d: 22, r: 2 };
  const out = [S(k.slabOf(tray, 0, 3, P, 4, 0.5), { tone: "mid" })];
  out.push(L(k.planOutline(k.insetPlan(tray, 2.4), 3, P, 4), { tone: "faint" }));
  [[-97, 5.2, 9], [-84, 4.2, 7], [-73, 3.2, 5]].forEach(([x, r, h]) => {
    out.push(L(k.ring(x, 31, r + 1, 3, P, 20), { tone: "faint" }));
    out.push(S(k.cylinder(x, 31, r, 3, h, P, 28, 0.4), { tone: "mid" }));
    out.push(L(k.sideArc(x, 31, r, 3 + h * 0.45, P, 16), { tone: "faint" }));
    out.push(S(k.cylinder(x, 31, r * 0.42, 3 + h, 2, P, 16), { tone: "mid" }));
    out.push(L(k.knurl(x, 31, r * 0.42, 3 + h, 5 + h, 10, P, 0.2), { tone: "lo" }));
  });
  return out.join("");
}

function stand() {
  const out = [S(k.slabOf(PED, 0, 8, P, 5, 0.8), { tone: "mid" })];
  const upper = k.insetPlan(PED, 1);
  out.push(S(k.slabOf(upper, 8, 4, P, 5, 0.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PED, 4), 12, P, 4), { tone: "faint" }));
  out.push(D([at([PED.x + 5, PED.y + 5, 12]), at([PED.x + PED.w - 5, PED.y + 5, 12])], { size: 0.45 }));
  const level = [-10, -10];
  out.push(L(k.ring(level[0], level[1], 3.2, 12, P, 20) + k.ring(level[0], level[1], 1.3, 12, P, 12), { tone: "lo" }));
  out.push(D([at([level[0] + 0.5, level[1] - 0.3, 12])], { size: 0.45, tone: "hi" }));
  out.push(S(k.cylinder(COLUMN[0], COLUMN[1], 6, 12, 3, P, 32, 0.4), { tone: "mid" }));
  out.push(S(k.cylinder(COLUMN[0], COLUMN[1], 3.5, 15, PIVOT - 6 - 15, P, 28), { tone: "mid", crease: "none" }));
  out.push(L([30, 60].map((z) => k.sideArc(COLUMN[0], COLUMN[1], 3.5, z, P, 16)).join(""), { tone: "faint" }));
  out.push(S(k.cylinder(COLUMN[0], COLUMN[1], 5, PIVOT - 6, 2, P, 28, 0.3), { tone: "mid" }));
  out.push(S(k.slabOf({ x: -1.5, y: -23, w: 3, d: 6, r: 0.4 }, PIVOT - 4, 0.5, P, 2), { tone: "mid", crease: "none" }));
  const knob = [11, -10];
  out.push(S(k.cylinder(knob[0], knob[1], 3.6, 12, 3.4, P, 24), { tone: "mid" }));
  out.push(L(k.knurl(knob[0], knob[1], 3.6, 12, 15.4, 22, P), { tone: "lo" }));
  out.push(L(k.lineOnTop(knob, [knob[0] + 3.6, knob[1]], 15.4, P), { tone: "hi" }));
  out.push(D([at([knob[0], knob[1], 15.4])], { size: 0.45, tone: "hi" }));
  // The sign scale the pointer sweeps: negative, zero, positive.
  out.push(S(k.slabOf(SCALE, 39, 13, P, 2), { tone: "mid" }));
  const face = SCALE.y + SCALE.d;
  const ticks = k.sideTicks(-10, 10, 2, 5, face, 52, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "hi" }));
  [["−", -10], ["0", 0], ["+", 10]].forEach(([text, x]) => out.push(k.faceTextSvg(k.sideMatrix([x, face], 41, P, "left"), text, { size: 4.4, tone: "hi", anchor: "middle" })));
  out.push(D([at([SCALE.x + 1.6, face, 50.4]), at([SCALE.x + SCALE.w - 1.6, face, 50.4])], { size: 0.35 }));
  return out.join("");
}

function rack() {
  const out = [S(k.slabOf(RACK, 0, RACK_H, P, 4, 0.6), { tone: "mid" })];
  SEATS.forEach((x) => {
    const seat = { x: x - BLOCK / 2 - 1.2, y: SEAT_Y - BLOCK / 2 - 1.2, w: BLOCK + 2.4, d: BLOCK + 2.4, r: 2 };
    out.push(L(k.planOutline(seat, RACK_H, P, 3), { tone: "lo" }));
  });
  out.push(D(k.corners(RACK, 3).map(([x, y]) => at([x, y, RACK_H])), { size: 0.4 }));
  for (const x of [RACK.x - 4, RACK.x + RACK.w]) {
    out.push(S(k.slabOf({ x, y: RACK.y + 2, w: 4, d: RACK.d - 4, r: 1 }, 0, 8, P, 3, 0.4), { tone: "mid" }));
    out.push(D([at([x + 2, RACK.y + 6, 8]), at([x + 2, RACK.y + RACK.d - 6, 8])], { size: 0.4 }));
  }
  return out.join("");
}

// A block: height is the salary, one band per thousand. The letter on top is its own name.
function block(employee, cx, cy, z) {
  const plan = { x: cx - BLOCK / 2, y: cy - BLOCK / 2, w: BLOCK, d: BLOCK, r: 1.5 };
  const height = heightOf(employee);
  const bands = [];
  for (let band = UNIT; band < height - 0.1; band += UNIT) bands.push(k.sideSeam(plan, z + band, P, 3));
  return [
    S(k.slabOf(plan, z, height, P, 3, 0.5), { tone: "hi", crease: "lo", inner: L(bands.join(""), { tone: "faint" }) }),
    L(k.planOutline(k.insetPlan(plan, 2), z + height, P, 3), { tone: "faint" }),
    k.faceTextSvg(k.topMatrix([cx, cy + 2.6], z + height, P, "x"), employee.name[0], { size: 7.5, tone: "hi", anchor: "middle" }),
  ].join("");
}

// One pan assembly at rest, split so a block can be painted between its far and near halves.
function pan(px, content = "") {
  const y = COLUMN[1];
  const far = [
    L(k.rise([px - 13, y], PAN_Z, YOKE_Z, P), { tone: "mid" }),
    S(k.cylinder(px, y, 8, PAN_Z - 5, 2, P, 28), { tone: "mid" }),
    S(k.cylinder(px, y, PAN_R, PAN_Z - 3, 3, P, 56, 0.6), { tone: "mid" }),
    L(k.ring(px, y, PAN_R - 2.4, PAN_Z, P, 48), { tone: "faint" }),
    D([at([px - 13, y, PAN_Z]), at([px + 13, y, PAN_Z])], { size: 0.5 }),
  ].join("");
  const near = [
    L(k.rise([px + 13, y], PAN_Z, YOKE_Z, P), { tone: "mid" }),
    S(k.slabOf({ x: px - 14, y: y - 1, w: 28, d: 2, r: 0.6 }, YOKE_Z, 1.5, P, 2), { tone: "mid", crease: "none" }),
    L(k.rise([px, y], YOKE_Z + 1.5, PIVOT, P), { tone: "mid" }),
    D([at([px - 13, y, YOKE_Z + 1.5]), at([px + 13, y, YOKE_Z + 1.5]), at([px, y, YOKE_Z + 1.5])], { size: 0.4 }),
  ].join("");
  return { far: far + content, near };
}

// The beam turns about y, which no screen transform can do: one frame per third of a degree.
const BEAM_FRAME = G.frameOf([0, COLUMN[1], PIVOT], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
const halfHeight = (x) => (Math.abs(x) <= 8 ? 3.5 : 3.5 - ((Math.abs(x) - 8) * 2) / (ARM - 3));
const turn = ([x, z], angle) => [x * Math.cos(angle) - z * Math.sin(angle), x * Math.sin(angle) + z * Math.cos(angle)];
function beam(degrees) {
  const angle = (degrees * Math.PI) / 180;
  const outline = [[-ARM - 5, -1.5], [-8, -3.5], [8, -3.5], [ARM + 5, -1.5], [ARM + 5, 1.5], [8, 3.5], [-8, 3.5], [-ARM - 5, 1.5]];
  const front = (x, z) => { const [tx, tz] = turn([x, z], angle); return [tx, COLUMN[1] + 2.5, PIVOT + tz]; };
  const notches = [];
  for (let x = 14; x <= ARM - 6; x += 6) for (const side of [-1, 1]) notches.push(k.segment(front(side * x, -halfHeight(x)), front(side * x, halfHeight(x)), P));
  return [
    S(G.prismOf(BEAM_FRAME, outline.map((point) => turn(point, angle)), -2.5, 2.5, P), { tone: "mid" }),
    L(notches.join(""), { tone: "lo" }),
    D([at(front(-ARM, 0)), at(front(ARM, 0))], { size: 0.6, tone: "hi" }),
    D([at(front(0, 0))], { size: 0.9, tone: "hi" }),
  ].join("");
}
const FRAMES = 73;
const BEAMS = Array.from({ length: FRAMES }, (_, index) => beam(-MAX_TILT + (index * 2 * MAX_TILT) / (FRAMES - 1)));

const pointerAt = (angle) => segment([0, POINTER_Y, PIVOT], [Math.sin(angle) * POINTER_LEN, POINTER_Y, PIVOT - Math.cos(angle) * POINTER_LEN], P);

const left = pan(-ARM, block(SARA, -ARM, COLUMN[1], PAN_Z));
const right = pan(ARM);
const restTilt = MAX_TILT; // right pan empty: Sara's side is down
const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A two-pan balance on a base plate, with a rack of three blocks in front of it. Block height is salary: Omar 3000, Ali 5000, Mona 7000. A fourth block, Sara 5000, sits on the left pan. One rack block at a time moves to the right pan; the beam tilts and a pointer on the column swings to minus, zero or plus. Against Ali the pointer rests on zero.",
  body: [
    plate(),
    weights(),
    stand(),
    `<g data-part="left">${left.far}${left.near}</g>`,
    `<g data-part="right-far">${right.far}</g>`,
    rack(),
    ...RESIDENTS.map((employee, index) => `<g data-part="block" data-index="${index}">${block(employee, SEATS[index], SEAT_Y, RACK_H)}</g>`),
    `<g data-part="right-near">${right.near}</g>`,
    `<g data-part="beam">${BEAMS[FRAMES - 1]}</g>`,
    `<path data-part="pointer" class="iso-line" data-tone="lit" data-free="end" d="${k.segment([0, POINTER_Y, PIVOT], [Math.sin((restTilt * Math.PI) / 180) * POINTER_LEN, POINTER_Y, PIVOT - Math.cos((restTilt * Math.PI) / 180) * POINTER_LEN], P)}" style="stroke-width:1.2"/>`,
  ],
});

const live = `
const P = ${JSON.stringify(P)};
const BEAMS = ${JSON.stringify(BEAMS)};
const RESIDENTS = ${JSON.stringify(RESIDENTS.map((employee) => ({ ...employee, height: heightOf(employee) })))};
const SARA = ${JSON.stringify({ ...SARA, height: heightOf(SARA) })};
const SEATS = ${JSON.stringify(SEATS)};
const MAX_TILT = ${MAX_TILT}, TILT_PER_UNIT = ${TILT_PER_UNIT}, ARM = ${ARM}, PIVOT = ${PIVOT}, POINTER_Y = ${POINTER_Y}, POINTER_LEN = ${POINTER_LEN};
const SEAT_Y = ${SEAT_Y}, RACK_H = ${RACK_H}, PAN_Z = ${PAN_Z}, PAN_Y = ${COLUMN[1]};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const part = (name) => svg.querySelector('[data-part="' + name + '"]');
const leftPan = part("left"), rightFar = part("right-far"), rightNear = part("right-near"), beamEl = part("beam"), pointer = part("pointer");
const blocks = [...svg.querySelectorAll('[data-part="block"]')];
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const ease = (t) => { const c = clamp(t, 0, 1); return c * c * (3 - 2 * c); };
const pointerAt = ${pointerAt.toString()};
const SIGN = { "-1": "< 0 \\u00b7 sorts before", "0": "= 0 \\u00b7 duplicate, dropped", "1": "> 0 \\u00b7 sorts after" };
// The comparator itself: Comparator.comparingInt(Employee::salary).
const compare = (a, b) => Math.sign(a.salary - b.salary);
let chosen = 0, travel = RESIDENTS.map(() => 0), tilt = { at: MAX_TILT, rate: 0 }, shown = -1;
let frame = 0, last = 0, clock = 0, touring = true, visible = false, idleTimer = 0;
function draw() {
  const angle = tilt.at * Math.PI / 180;
  const index = Math.round((clamp(tilt.at, -MAX_TILT, MAX_TILT) + MAX_TILT) / (2 * MAX_TILT) * (BEAMS.length - 1));
  if (index !== shown) { beamEl.innerHTML = BEAMS[index]; shown = index; }
  const slip = ARM * (1 - Math.cos(angle)), drop = ARM * Math.sin(angle);
  leftPan.setAttribute("transform", translateAlong(P, [slip, 0, -drop]));
  const rightMove = [-slip, 0, drop];
  rightFar.setAttribute("transform", translateAlong(P, rightMove));
  rightNear.setAttribute("transform", translateAlong(P, rightMove));
  pointer.setAttribute("d", pointerAt(angle));
  blocks.forEach((element, i) => {
    const up = ease(travel[i] * 1.6), across = ease((travel[i] - 0.25) / 0.75);
    element.setAttribute("transform", translateAlong(P, [
      (ARM + rightMove[0] * across - SEATS[i]) * across,
      (PAN_Y - SEAT_Y) * across,
      (PAN_Z + rightMove[2] * across - RACK_H) * up + 7 * Math.sin(Math.PI * clamp(travel[i], 0, 1)),
    ]));
  });
  const on = travel.findIndex((value) => value === 1);
  const steady = Math.abs(tilt.rate) < 0.6;
  const text = on < 0 || !steady ? "weighing\\u2026" : "compare(Sara, " + RESIDENTS[on].name + ") " + SIGN[compare(SARA, RESIDENTS[on])];
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuenow", String(chosen));
  stage.setAttribute("aria-valuetext", text);
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (touring) { clock += dt; chosen = Math.floor(clock / 3.4) % RESIDENTS.length; }
  // One block on the pan at a time: the chosen one leaves the rack only once the others are home.
  const others = travel.some((value, i) => i !== chosen && value > 0.3);
  travel = travel.map((value, i) => {
    const want = i === chosen && !others ? 1 : i === chosen ? value : 0;
    return calm ? want : clamp(value + Math.sign(want - value) * dt / 0.75, 0, 1);
  });
  const on = travel.findIndex((value) => value === 1);
  const load = on < 0 ? 0 : RESIDENTS[on].height;
  const want = clamp((SARA.height - load) * TILT_PER_UNIT, -MAX_TILT, MAX_TILT);
  const stiff = 60, drag = calm ? 2 * Math.sqrt(60) : 8;
  for (let i = 0; i < 4; i++) { tilt.rate += ((want - tilt.at) * stiff - tilt.rate * drag) * dt / 4; tilt.at += tilt.rate * dt / 4; }
  if (calm) { tilt.at = want; tilt.rate = 0; }
  if (Math.abs(want - tilt.at) < 0.01 && Math.abs(tilt.rate) < 0.01) { tilt.at = want; tilt.rate = 0; }
  draw();
  const settled = !touring && tilt.at === want && tilt.rate === 0 && travel.every((value, i) => value === (i === chosen ? 1 : 0));
  frame = visible && !settled ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const pick = (index) => { touring = false; chosen = clamp(index, 0, RESIDENTS.length - 1); clearTimeout(idleTimer); idleTimer = setTimeout(() => { touring = !still.matches; clock = chosen * 3.4; run(); }, 6000); run(); };
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
if (still.matches) { touring = false; chosen = 1; }
stage.addEventListener("pointermove", (event) => {
  const box = svg.getBoundingClientRect();
  pick(Math.floor(clamp(((event.clientX - box.left) / box.width - 0.2) / 0.6, 0, 0.999) * RESIDENTS.length));
});
stage.addEventListener("keydown", (event) => {
  let to = null;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") to = chosen + 1;
  if (event.key === "ArrowLeft" || event.key === "ArrowDown") to = chosen - 1;
  if (event.key === "Home") to = 0;
  if (event.key === "End") to = RESIDENTS.length - 1;
  if (to === null) return;
  event.preventDefault();
  pick(to);
});
draw();
`;

const body = k.plateHtml({
  fig: "Fig 09a",
  title: "Comparator: a balance",
  hint: "Hover to pick a block",
  readout: "weighing…",
  keys: [
    { mark: "lit", label: "Pointer = what compare(a, b) returns" },
    { mark: "raised", label: "Block height = salary" },
  ],
  caption:
    "The balance is a Comparator: it weighs two employees and answers minus, zero or plus. Sara and Ali weigh the same, so a TreeSet sees a duplicate and drops Sara.",
  body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Balance: arrow keys choose which rack block is weighed against Sara" aria-valuemin="0" aria-valuemax="2" aria-valuenow="0">${svg}</div>`,
});

const file = theme === "light" ? "figure-light.html" : "figure.html";
writeFileSync(join(HERE, file), k.pageHtml({ title: "Comparator balance", theme, body, script: kitScript() + live }));
console.log("wrote", file);
