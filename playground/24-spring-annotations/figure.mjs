// A printer's type cabinet: one drawer per Spring annotation family, one stamp per annotation.
// Picking a stamp pulls its drawer and moves the carriage to the phase where Spring acts on it.
// Build: node playground/24-spring-annotations/figure.mjs   (always light)
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../.claude/skills/anatomy/kit/iso-kit.mjs";
import * as G from "../../.claude/skills/anatomy/kit/lathe.mjs";
import { kitScript } from "../../.claude/skills/anatomy/scripts/inline-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------- the truth: what each annotation is, when it acts, who reads it ----------------
const PHASES = ["Scan", "Define", "Wire", "Proxy", "Call"];
const PHASE_NOTE = ["find classes", "register bean definitions", "create and inject", "wrap in a proxy", "handle each request or call"];
const a = (n, p, by, does, vs, code) => ({ n, p, by, does, vs, code });
const FAMILIES = [
  ["Boot", [
    a("@SpringBootApplication", 0, "ConfigurationClassPostProcessor", "One shortcut for @SpringBootConfiguration + @EnableAutoConfiguration + @ComponentScan.", "@Configuration only declares beans. It neither scans nor auto-configures.", "@SpringBootApplication\nclass App { }"),
    a("@EnableAutoConfiguration", 1, "AutoConfigurationImportSelector", "Imports Boot's auto-configurations, each kept only if its conditions pass.", "@ComponentScan finds your classes. This brings in Boot's.", "@EnableAutoConfiguration(\n  exclude = DataSourceAutoConfiguration.class)"),
    a("@ComponentScan", 0, "ConfigurationClassParser", "Searches packages for classes marked @Component.", "@Import names exact classes, with no searching.", "@ComponentScan(\"com.shop\")"),
  ]],
  ["Stereotype", [
    a("@Component", 0, "ClassPathBeanDefinitionScanner", "Marks your class as a bean. The base of all the stereotypes.", "@Bean marks a factory method, for classes you cannot annotate.", "@Component\nclass Clock { }"),
    a("@Service", 0, "ClassPathBeanDefinitionScanner", "A @Component that names the business layer. It adds no behaviour.", "@Repository adds behaviour. @Service only documents intent.", "@Service\nclass OrderService { }"),
    a("@Repository", 3, "PersistenceExceptionTranslationPostProcessor", "Scanned like @Component, then proxied so database errors become DataAccessException.", "@Service gets no exception translation.", "@Repository\nclass OrderDao { }"),
    a("@Controller", 4, "RequestMappingHandlerMapping", "A web handler. A returned String is normally a view name.", "@RestController writes the return value to the body.", "@Controller\nclass Page {\n  @GetMapping(\"/\") String home() { return \"home\"; }\n}"),
    a("@RestController", 4, "RequestMappingHandlerMapping", "@Controller + @ResponseBody: return values become JSON.", "@Controller would look for a view with that name.", "@RestController\nclass Api {\n  @GetMapping(\"/x\") Dto x() { ... }\n}"),
  ]],
  ["Beans", [
    a("@Configuration", 1, "ConfigurationClassPostProcessor", "Holds @Bean methods. Its proxy makes calls between them return the same bean.", "@Bean inside a plain @Component: such a call creates a new object.", "@Configuration\nclass Cfg { @Bean Clock c() { ... } }"),
    a("@Bean", 1, "ConfigurationClassPostProcessor", "The object this method returns becomes a bean. Made for third-party classes.", "@Component goes on a class. @Bean goes on a method.", "@Bean ObjectMapper mapper() {\n  return new ObjectMapper();\n}"),
    a("@Import", 1, "ConfigurationClassParser", "Adds named classes to the context directly.", "@ComponentScan discovers classes by package.", "@Import(SecurityCfg.class)"),
    a("@Scope", 1, "AnnotationScopeMetadataResolver", "Sets how many instances exist: singleton, prototype, request, session.", "@Lazy changes when a bean is made, not how many.", "@Scope(\"prototype\")\n@Component class Job { }"),
  ]],
  ["Injection", [
    a("@Autowired", 2, "AutowiredAnnotationBeanPostProcessor", "Injects a bean by type. Optional on a single constructor.", "@Value injects a config value, not a bean.", "@Autowired\nOrderService(Repo repo) { ... }"),
    a("@Qualifier", 2, "QualifierAnnotationAutowireCandidateResolver", "Picks one bean by qualifier at this injection point.", "@Primary is a global default. @Qualifier overrides it here.", "Svc(@Qualifier(\"stripe\") Pay p)"),
    a("@Primary", 2, "DefaultListableBeanFactory", "The default winner when several beans match a type.", "@Qualifier decides per injection point.", "@Primary @Bean Pay stripe() { ... }"),
    a("@Lazy", 2, "ContextAnnotationAutowireCandidateResolver", "Delays creation until first use. At an injection point it injects a proxy.", "@Scope sets how many instances. @Lazy sets when.", "Svc(@Lazy Heavy heavy)"),
  ]],
  ["Config", [
    a("@Value", 2, "AutowiredAnnotationBeanPostProcessor", "Injects one property or SpEL result.", "@ConfigurationProperties binds a whole prefix, typed and validated.", "@Value(\"${app.size:10}\") int size;"),
    a("@ConfigurationProperties", 2, "ConfigurationPropertiesBindingPostProcessor", "Binds a property prefix onto a typed object.", "@Value reads single keys, with no relaxed binding.", "@ConfigurationProperties(\"app\")\nrecord AppProps(int size) { }"),
    a("@Profile", 1, "ProfileCondition", "Registers the bean only when a named profile is active.", "@ConditionalOn* tests classes, beans or properties.", "@Profile(\"dev\")\n@Bean Mail fakeMail() { ... }"),
    a("@ConditionalOnMissingBean", 1, "OnBeanCondition", "Registers this bean only if no such bean exists. How auto-config backs off.", "@Profile tests the environment, not other beans.", "@ConditionalOnMissingBean\n@Bean Mail mail() { ... }"),
  ]],
  ["Web", [
    a("@RequestMapping", 4, "RequestMappingHandlerMapping", "Maps a URL to a handler. Matches every HTTP method unless told otherwise.", "@GetMapping is this, fixed to GET.", "@RequestMapping(\"/orders\")\nclass OrderApi { }"),
    a("@GetMapping", 4, "RequestMappingHandlerMapping", "@RequestMapping(method = GET). @PostMapping and friends do the same.", "@RequestMapping alone accepts all methods.", "@GetMapping(\"/{id}\")\nDto one(@PathVariable long id)"),
    a("@PathVariable", 4, "PathVariableMethodArgumentResolver", "Reads a value from the URL path: /orders/42.", "@RequestParam reads the query string.", "@GetMapping(\"/orders/{id}\")\nDto one(@PathVariable long id)"),
    a("@RequestParam", 4, "RequestParamMethodArgumentResolver", "Reads a query or form value: ?page=2.", "@PathVariable reads the path itself.", "list(@RequestParam(\n  defaultValue = \"0\") int page)"),
    a("@RequestBody", 4, "RequestResponseBodyMethodProcessor", "Converts the incoming body (JSON) into an object.", "@ResponseBody is the opposite direction.", "@PostMapping\nDto add(@RequestBody NewOrder o)"),
    a("@ResponseBody", 4, "RequestResponseBodyMethodProcessor", "Writes the return value to the response body.", "@RequestBody reads in. This writes out.", "@ResponseBody @GetMapping(\"/x\")\nDto x() { ... }"),
  ]],
  ["Errors", [
    a("@ExceptionHandler", 4, "ExceptionHandlerExceptionResolver", "A method that handles a thrown exception.", "Alone it covers one controller. @ControllerAdvice makes it global.", "@ExceptionHandler(NotFound.class)\nErr onMissing(NotFound e) { ... }"),
    a("@ControllerAdvice", 4, "ExceptionHandlerExceptionResolver", "Shares its handlers across all controllers.", "@RestControllerAdvice also writes results as JSON.", "@ControllerAdvice\nclass Errors { }"),
    a("@RestControllerAdvice", 4, "ExceptionHandlerExceptionResolver", "@ControllerAdvice + @ResponseBody.", "Plain @ControllerAdvice would resolve a view.", "@RestControllerAdvice\nclass ApiErrors { }"),
    a("@ResponseStatus", 4, "ResponseStatusExceptionResolver", "Fixes the HTTP status of a handler or exception.", "ResponseEntity chooses the status per call.", "@ResponseStatus(HttpStatus.CREATED)\n@PostMapping Dto add(...)"),
  ]],
  ["Proxy", [
    a("@Transactional", 3, "TransactionInterceptor", "Wraps the call in a transaction. Rolls back on RuntimeException and Error.", "@Cacheable may skip the method. This always runs it.", "@Transactional\nvoid pay(Order o) { ... }"),
    a("@Cacheable", 3, "CacheInterceptor", "On a cache hit, returns the stored value and skips the method.", "@Transactional never skips the method.", "@Cacheable(\"users\")\nUser find(long id) { ... }"),
    a("@Async", 3, "AsyncAnnotationBeanPostProcessor", "Runs the method on another thread.", "@Transactional stays on the caller's thread, so it does not follow @Async.", "@Async\nCompletableFuture<R> send() { ... }"),
    a("@PreAuthorize", 3, "AuthorizationManagerBeforeMethodInterceptor", "Checks a SpEL permission before the method runs.", "@Secured takes role names only, no expressions.", "@PreAuthorize(\"hasRole('ADMIN')\")\nvoid wipe() { ... }"),
  ]],
];
const ALL = FAMILIES.flatMap(([family, list], f) => list.map((item, s) => ({ ...item, family, f, s })));

// ---------------- the world ----------------
const WIDTH = 820, HEIGHT = 640;
const DH = 13, TH = 10.8, TOP = 8 * DH + 7;
const BASE = { x: -152, y: -76, w: 304, d: 244, r: 8 };
const BODY = { x: -132, y: -60, w: 264, d: 120, r: 3 };
const FRONT = BODY.y + BODY.d, DEPTH = 92, PULL = 80;
const TX = BODY.x + 5, TW = BODY.w - 10;
const zOf = (f) => 4 + (7 - f) * DH;
const STOPS = [-96, -48, 0, 48, 96];
const P = k.fitProjection([...k.boxCorners(BASE, -14, 0), ...k.boxCorners(BODY, 0, TOP + 26), ...k.boxCorners({ ...BODY, y: FRONT, d: PULL + 4 }, 0, TOP - 6)], WIDTH, HEIGHT, { pad: 22, azimuth: 60 });
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const box = (plan, z, h, style = { tone: "mid" }, steps = 3, bevel = 0.4) => S(k.slabOf(plan, z, h, P, steps, bevel), style);
const poly = (pts) => "M" + pts.map((p) => at(p).map((v) => v.toFixed(1)).join(" ")).join("L") + "Z";
function hull(points) {
  const pts = points.map(at).sort((u, v) => u[0] - v[0] || u[1] - v[1]);
  const half = (list) => { const out = []; for (const p of list) { while (out.length > 1) { const [o, q] = [out[out.length - 2], out[out.length - 1]]; if ((q[0] - o[0]) * (p[1] - o[1]) - (q[1] - o[1]) * (p[0] - o[0]) > 0) break; out.pop(); } out.push(p); } out.pop(); return out; };
  return "M" + [...half(pts), ...half([...pts].reverse())].map((p) => p.map((v) => v.toFixed(1)).join(" ")).join("L") + "Z";
}
const part = (name, inner, extra = "") => `<g data-part="${name}"${extra}>${inner}</g>`;

function bench() {
  const out = [`<path class="iso-halo" d="${k.haloOf(BASE, -14, 10, P)}"/>`];
  const feet = k.corners(BASE, 20).sort((u, v) => k.depthOf([u[0], u[1], 0], P) - k.depthOf([v[0], v[1], 0], P));
  for (const [x, y] of feet) {
    out.push(S(k.cylinder(x, y, 8, -14, 2, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 6, -12, 3, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(BASE, -9, 9, P, 8, 1.4), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(BASE, 5), 0, P), { tone: "faint" }));
  const screws = k.corners(BASE, 11);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.4, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  const strip = { x: BASE.x + 22, y: BASE.y + BASE.d - 16, w: BASE.w - 44, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  // the drawer runners' floor guides
  for (const x of [TX + 6, TX + TW - 10]) {
    out.push(box({ x, y: FRONT + 2, w: 4, d: PULL + 6, r: 1 }, 0, 1, { tone: "lo", crease: "none" }, 2, 0));
    out.push(D([at([x + 2, FRONT + 8, 1]), at([x + 2, FRONT + PULL, 1])], { size: 0.4 }));
  }
  return part("bench", out.join(""));
}

function cabinet() {
  const out = [box({ ...k.insetPlan(BODY, -3) }, 0, 3, { tone: "mid" }, 4, 0.6)];
  const seams = [];
  for (let f = 0; f <= 8; f++) seams.push(k.sideSeam(BODY, 5 + f * DH - 1.1, P, 3));
  const faces = k.slabOf(BODY, 3, TOP - 3, P, 3, 0.8);
  out.push(S(faces, { tone: "mid", inner: L(seams.join(""), { tone: "faint" }) }));
  // drawer openings
  for (let f = 0; f < 8; f++) {
    const z = zOf(f);
    out.push(`<path d="${poly([[TX, FRONT, z], [TX + TW, FRONT, z], [TX + TW, FRONT, z + TH + 0.8], [TX, FRONT, z + TH + 0.8]])}" style="fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.6"/>`);
  }
  // side plate on the +x face: rivets and vent slots
  const sx = BODY.x + BODY.w;
  const vents = [];
  for (let i = 0; i < 9; i++) { const y = -36 + i * 9; vents.push(poly([[sx, y, TOP - 34], [sx, y + 2.2, TOP - 34], [sx, y + 2.2, TOP - 72], [sx, y, TOP - 72]])); }
  out.push(L(vents.join(""), { tone: "lo" }));
  const rivets = [];
  for (const y of [BODY.y + 8, FRONT - 8]) for (const z of [12, TOP / 2, TOP - 10]) rivets.push(at([sx, y, z]));
  out.push(D(rivets, { size: 0.55 }));
  out.push(L(k.planOutline(k.insetPlan(BODY, 4), TOP, P), { tone: "faint" }));
  const corners = k.corners(BODY, 9);
  out.push(L(corners.map(([x, y]) => k.ring(x, y, 2, TOP, P, 14)).join(""), { tone: "lo" }));
  out.push(D(corners.map(([x, y]) => at([x, y, TOP])), { size: 0.45 }));
  return part("cabinet", out.join(""));
}

const CELL = (n) => (TW - 6) / n;
function stamp(item, cx, cw, z, lit) {
  const plan = { x: cx - cw / 2 + 2.4, y: FRONT - DEPTH + 10, w: cw - 4.8, d: 70, r: 1.4 };
  const style = lit ? { tone: "hi", lit: true } : { tone: "hi", crease: "lo" };
  const top = z + 5;
  const size = Math.min(7, 50 / (item.n.length * 0.6));
  // five pips along the stamp's near edge: the filled one is the phase Spring acts in
  const pipY = plan.y + plan.d - 7, pipX = (i) => cx + (i - 2) * Math.min(7, (plan.w - 10) / 4);
  const pips = PHASES.map((_, i) => k.ring(pipX(i), pipY, 1.7, top, P, 12)).join("");
  const filled = `<path d="${k.ring(pipX(item.p), pipY, 1.7, top, P, 12)}" style="fill:var(--anatomy-hi);stroke:var(--anatomy-hi);stroke-width:.5"/>`;
  return box(plan, z, 2.8, { tone: "mid" }, 3, 0.4)
    + box(k.insetPlan(plan, 1), z + 2.8, 2.2, style, 3, 0.5)
    + L(k.planOutline(k.insetPlan(plan, 2.6), top, P, 3), { tone: "faint" })
    + D(k.corners(plan, 4.6).map(([x, y]) => at([x, y, top])), { size: 0.35 })
    + L(pips, { tone: "lo" }) + filled
    + k.faceTextSvg(k.topMatrix([cx + size * 0.36, plan.y + 34], top, P, "y"), item.n, { size, tone: "hi", anchor: "middle" })
    + S(k.cylinder(cx, plan.y + 7, 3, top, 1.3, P, 18), { tone: "mid" })
    + S(k.cylinder(cx, plan.y + 7, 1.9, top + 1.3, 2, P, 16), style)
    + D([at([cx, plan.y + 7, top + 3.3])], { size: 0.4, tone: "hi" });
}

function tray(f) {
  const [family, list] = FAMILIES[f], z = zOf(f), y0 = FRONT - DEPTH, cw = CELL(list.length), out = [];
  const items = [];
  const put = (x, y, zz, svg) => items.push([k.depthOf([x, y, zz], P), svg]);
  out.push(box({ x: TX, y: y0, w: TW, d: DEPTH, r: 1 }, z, 1.4, { tone: "lo" }, 2, 0));
  put(TX + TW / 2, y0, z, box({ x: TX, y: y0, w: TW, d: 1.6, r: 0.4 }, z + 1.4, 8, { tone: "mid" }, 2, 0));
  put(TX, y0 + DEPTH / 2, z, box({ x: TX, y: y0, w: 1.6, d: DEPTH, r: 0.4 }, z + 1.4, 8, { tone: "mid" }, 2, 0));
  for (let i = 1; i < list.length; i++) {
    const x = TX + 3 + cw * i;
    put(x, y0 + DEPTH / 2, z, box({ x: x - 0.5, y: y0 + 1.6, w: 1, d: DEPTH - 4, r: 0.2 }, z + 1.4, 5.4, { tone: "lo" }, 2, 0));
  }
  list.forEach((item, s) => {
    const cx = TX + 3 + cw * (s + 0.5);
    put(cx, y0 + 45, z + 1, `<g data-stamp="${f}:${s}" data-part="s-${item.n.slice(1)}" style="cursor:pointer">${stamp(item, cx, cw, z + 1.4, false)}</g>`);
  });
  put(TX + TW, y0 + DEPTH / 2, z, box({ x: TX + TW - 1.6, y: y0, w: 1.6, d: DEPTH, r: 0.4 }, z + 1.4, 8, { tone: "mid" }, 2, 0));
  items.sort((u, v) => u[0] - v[0]);
  out.push(...items.map((i) => i[1]));
  // the front panel with its label holder and cup pull
  const panel = { x: TX - 1, y: FRONT - 1.4, w: TW + 2, d: 2.4, r: 0.5 };
  const fy = FRONT + 1;
  const holder = [[TX + 12, fy, z + 2.4], [TX + 78, fy, z + 2.4], [TX + 78, fy, z + 9], [TX + 12, fy, z + 9]];
  const cup = { x: TX + TW / 2 - 15, y: fy, w: 30, d: 3, r: 1.2 };
  out.push(`<g data-drawer="${f}" style="cursor:pointer">`
    + box(panel, z, TH, { tone: "hi", crease: "lo" }, 2, 0.3)
    + `<path d="${poly(holder)}" style="fill:var(--anatomy-lit-top);stroke:var(--anatomy-mid);stroke-width:.7"/>`
    + D([[TX + 9.6, z + 5.7], [TX + 80.4, z + 5.7]].map(([x, zz]) => at([x, fy, zz])), { size: 0.45 })
    + k.faceTextSvg(k.sideMatrix([TX + 45, fy], z + 3.9, P, "left"), family, { size: 5, tone: "hi", anchor: "middle" })
    + box(cup, z + 2.8, 4.6, { tone: "mid" }, 3, 0.4)
    + D([cup.x + 3, cup.x + cup.w - 3].map((x) => at([x, fy + 3, z + 5.1])), { size: 0.4 })
    + L([-34, -30].map((dx) => poly([[TX + TW + dx, fy, z + 3], [TX + TW + dx + 1.6, fy, z + 3], [TX + TW + dx + 1.6, fy, z + 8.4], [TX + TW + dx, fy, z + 8.4]])).join(""), { tone: "lo" })
    + `</g>`);
  const clip = hull([TX - 2, TX + TW + 2].flatMap((x) => [FRONT - 0.1, FRONT + PULL + 3].flatMap((y) => [z - 0.4, z + TH + 0.5].map((zz) => [x, y, zz]))));
  return `<clipPath id="tray-${f}"><path d="${clip}"/></clipPath><g clip-path="url(#tray-${f})"><g data-tray="${f}" data-part="d-${family}">${out.join("")}</g></g>`;
}

function lifted() {
  return ALL.map((item) => {
    const cw = CELL(FAMILIES[item.f][1].length), cx = TX + 3 + cw * (item.s + 0.5);
    return `<g data-lift="${item.f}:${item.s}" style="display:none">${stamp(item, cx, cw, zOf(item.f) + 1.4, true)}</g>`;
  }).join("");
}

// the phase rail on top of the cabinet
const RY = [-34, -6], SCREW_Y = -20, RULE = { x: -116, y: 14, w: 232, d: 26, r: 1.4 };
function rail() {
  const out = [];
  out.push(box(RULE, TOP, 1.2, { tone: "mid" }, 3, 0.4));
  const ticks = k.topTicks(RULE.x + 4, RULE.x + RULE.w - 4, 4, 6, RULE.y + 0.6, TOP + 1.2, [1.8, 3.4], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  STOPS.forEach((x, i) => {
    out.push(S(k.cylinder(x, RULE.y + 10, 2.6, TOP + 1.2, 1, P, 16), { tone: "hi", crease: "lo" }));
    out.push(D([at([x, RULE.y + 10, TOP + 2.2])], { size: 0.45 }));
    out.push(k.faceTextSvg(k.topMatrix([x, RULE.y + 21], TOP + 1.2, P, "x"), PHASES[i], { size: 6, tone: "hi", anchor: "middle" }));
  });
  for (const y of RY) {
    out.push(box({ x: -122, y, w: 244, d: 5, r: 1 }, TOP, 3, { tone: "mid" }, 3, 0.4));
    out.push(D([-114, 114].map((x) => at([x, y + 2.5, TOP + 3])), { size: 0.4 }));
  }
  for (const x of [-127, 122]) {
    out.push(box({ x, y: -38, w: 5, d: 40, r: 1.2 }, TOP, 11, { tone: "mid" }, 3, 0.5));
    out.push(D([-33, -7].map((y) => at([x + 2.5, y, TOP + 11])), { size: 0.45 }));
  }
  const F = G.frameAlong([-122, SCREW_Y, TOP + 6.5], [1, 0, 0]);
  const threads = [];
  for (let s = 3; s < 243; s += 3) threads.push(G.arcOf(F, s, 2.5, P));
  out.push(S(G.disc(0, 244, 2.5, F, P), { tone: "hi", crease: "lo", inner: L(threads.join(""), { tone: "lo" }) }));
  const K = G.frameAlong([127, SCREW_Y, TOP + 6.5], [1, 0, 0]);
  out.push(S(G.disc(0, 2, 3, K, P), { tone: "mid" }));
  const ribs = G.ribsOf(K, 2, 10, 7, 34, P, { fade: [0.05, 0.45], seams: true });
  out.push(S(G.disc(2, 10, 7, K, P), { tone: "mid", inner: k.fadedSvg ? k.fadedSvg(ribs, { tone: "lo" }) : "" }));
  return part("rail", out.join(""));
}

function carriage() {
  const plan = { x: -20, y: -38, w: 40, d: 37, r: 2.4 };
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(plan, 3), TOP + 3, 0.1, P)}" style="filter:blur(3px)"/>`];
  for (const x of [-20, 16]) for (const y of RY) out.push(box({ x, y: y - 1.4, w: 4, d: 7.8, r: 1 }, TOP + 2.4, 3.6, { tone: "lo" }, 2, 0));
  out.push(box(plan, TOP + 5, 9, { tone: "mid" }, 4, 0.7));
  out.push(L(k.planOutline(k.insetPlan(plan, 3), TOP + 14, P, 3), { tone: "faint" }));
  out.push(D(k.corners(plan, 5).map(([x, y]) => at([x, y, TOP + 14])), { size: 0.45 }));
  // the arm reaches over the ruler; its tip is the one lit part
  out.push(box({ x: -4, y: -4, w: 8, d: 23, r: 1.2 }, TOP + 11, 2.6, { tone: "mid" }, 3, 0.4));
  out.push(S(k.cylinder(0, 24, 1.3, TOP + 2.4, 11, P, 14), { tone: "hi", lit: true, crease: "none" }));
  out.push(S(k.cylinder(0, 24, 3.6, TOP + 11, 3, P, 18), { tone: "hi", lit: true }));
  out.push(S(k.cylinder(0, -18, 6, TOP + 14, 2, P, 22), { tone: "mid" }));
  out.push(L(k.knurl(0, -18, 6, TOP + 14, TOP + 16, 24, P), { tone: "lo" }));
  return part("carriage", out.join(""), ` data-carriage`);
}

const first = ALL[0];
const svg = k.figureSvg({
  width: WIDTH, height: HEIGHT,
  label: "A printer's type cabinet with eight drawers, one per Spring annotation family. Each stamp in a drawer is one annotation. A carriage on a rail above the cabinet moves to the phase in which Spring acts on the chosen annotation: scan, define, wire, proxy or call.",
  body: [bench(), cabinet(), ...[7, 6, 5, 4, 3, 2, 1, 0].map(tray), lifted(), rail(), carriage()],
});

const PART_TEXT = {
  bench: { name: "Bench", text: "Your Spring Boot application: everything below happens on it." },
  cabinet: { name: "Type cabinet", text: "The annotations you can use, sorted into eight families by purpose." },
  rail: { name: "Phase rail", text: "Spring's order of work, from scanning classes at startup to handling each call." },
  carriage: { name: "Carriage", text: "Stops at the phase where Spring acts on the chosen annotation." },
};
FAMILIES.forEach(([family, list]) => { PART_TEXT[`d-${family}`] = { name: `${family} drawer`, text: `Holds ${list.length} annotations: ${list.map((x) => x.n).join(", ")}.` }; });
ALL.forEach((x) => { PART_TEXT[`s-${x.n.slice(1)}`] = { name: x.n, text: x.does }; });

const css = `
.sa-grid{display:grid;grid-template-columns:minmax(0,1fr) 350px;gap:16px;width:min(1200px,100% - 32px)!important;align-items:start}
.sa-grid>.ar-summary{grid-column:1/-1;width:100%;max-width:none!important;margin:0!important}
@media (max-width:920px){.sa-grid{grid-template-columns:minmax(0,1fr)}}
.sa-panel{display:flex;flex-direction:column;gap:7px;padding:12px;border:1px solid var(--anatomy-faint);border-radius:10px;background:var(--anatomy-card);font-size:12.5px;line-height:1.45;color:var(--anatomy-text);min-width:0}
.sa-row{display:flex;flex-wrap:wrap;gap:4px}
.sa-row button{font:500 11px var(--anatomy-mono);padding:3px 7px;border:1px solid var(--anatomy-faint);border-radius:6px;background:none;color:var(--anatomy-text);cursor:pointer}
.sa-row button[aria-pressed="true"]{background:var(--anatomy-strong);color:var(--anatomy-card)}
.sa-name{font:700 15px var(--anatomy-mono);color:var(--anatomy-strong);overflow-wrap:anywhere}
.sa-steps{display:grid;grid-template-columns:repeat(5,1fr);gap:3px;font:500 10px var(--anatomy-mono);text-align:center}
.sa-steps span{padding:3px 0;border-radius:4px;background:var(--anatomy-shade-2);color:var(--anatomy-muted)}
.sa-steps span[data-on]{background:#cfe3b2;color:#1d1b18;font-weight:700}
.sa-k{font:500 10px var(--anatomy-mono);color:var(--anatomy-muted);text-transform:uppercase;margin-bottom:1px}
.sa-by{font:500 11px var(--anatomy-mono);overflow-wrap:anywhere}
.sa-panel pre{margin:0;padding:6px 8px;border-radius:6px;background:var(--anatomy-page);font:11px/1.45 var(--anatomy-mono);white-space:pre-wrap;overflow-wrap:anywhere;color:var(--anatomy-strong)}
.sa-panel p{margin:0}
[data-stamp]:hover .iso-top{filter:brightness(.96)}`;

const panel = `<section class="sa-panel" aria-live="polite">
  <div class="sa-row" id="sa-fam">${FAMILIES.map(([family], f) => `<button type="button" data-fam="${f}">${family}</button>`).join("")}</div>
  <div class="sa-row" id="sa-items"></div>
  <div class="sa-name" id="sa-name"></div>
  <div class="sa-steps" id="sa-steps">${PHASES.map((x) => `<span>${x}</span>`).join("")}</div>
  <div><div class="sa-k">What it does</div><div id="sa-does"></div></div>
  <p><b>Not the same as:</b> <span id="sa-vs"></span></p>
  <div><div class="sa-k">Read by</div><div class="sa-by" id="sa-by"></div></div>
  <pre id="sa-code"></pre>
</section>`;

const summary = `<aside class="ar-summary" dir="rtl" lang="ar" style="max-width:880px;margin:0 auto 16px;padding:12px 18px;border-radius:10px;background:rgba(0,0,0,.035);border:1px solid rgba(0,0,0,.09);font:15px/1.85 'Segoe UI',Tahoma,system-ui,sans-serif;color:#1f2328;text-align:right"><strong style="display:block;margin-bottom:2px">باختصار</strong><p style="margin:0">دي خزانة حروف مطبعة: كل درج عيلة من الـ <bdi dir="ltr">annotations</bdi>، وكل ختم جواه <bdi dir="ltr">annotation</bdi> واحدة.</p><p style="margin:0">اختار ختم، الدرج يتفتح والعربية اللي فوق تقف عند المرحلة اللي <bdi dir="ltr">Spring</bdi> بيشتغل عليه فيها: <bdi dir="ltr">Scan</bdi> ثم <bdi dir="ltr">Define</bdi> ثم <bdi dir="ltr">Wire</bdi> ثم <bdi dir="ltr">Proxy</bdi> ثم <bdi dir="ltr">Call</bdi>.</p><p style="margin:0">الفرق الحقيقي بينهم هو إمتى بيشتغلوا ومين بيقراهم.</p></aside>`;

// in a block: the inlined kit already declares names like rise and at
const live = `{
const P = ${JSON.stringify(P)}, PULL = ${PULL}, STOPS = ${JSON.stringify(STOPS)}, ALL = ${JSON.stringify(ALL)}, FAMILIES = ${JSON.stringify(FAMILIES.map(([name]) => name))}, PHASES = ${JSON.stringify(PHASES)};
const stage = document.querySelector(".iso-stage"), svg = stage.querySelector("svg"), readout = document.querySelector("[data-readout]");
if (location.hash !== "#course") document.querySelector(".iso-page").classList.add("sa-grid");
const $ = (id) => document.getElementById(id), still = matchMedia("(prefers-reduced-motion: reduce)");
const trays = FAMILIES.map((_, f) => svg.querySelector('[data-tray="' + f + '"]')), carriage = svg.querySelector("[data-carriage]");
const lifts = new Map(ALL.map((x) => [x.f + ":" + x.s, svg.querySelector('[data-lift="' + x.f + ":" + x.s + '"]')]));
const rest = new Map(ALL.map((x) => [x.f + ":" + x.s, svg.querySelector('[data-stamp="' + x.f + ":" + x.s + '"]')]));
const pull = FAMILIES.map(() => 0);
let at = 0, cx = STOPS[ALL[0].p], rise = 0, shown = null, frame = 0, last = 0, visible = false, touring = !still.matches, tourTimer = 0, idle = 0;
function panel() {
  const x = ALL[at];
  document.querySelectorAll("[data-fam]").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.fam === x.f)));
  $("sa-items").innerHTML = ALL.filter((y) => y.f === x.f).map((y) => '<button type="button" data-item="' + ALL.indexOf(y) + '" aria-pressed="' + (y === x) + '">' + y.n.replace(/&/g, "&amp;") + "</button>").join("");
  $("sa-name").textContent = x.n; $("sa-does").textContent = x.does; $("sa-vs").textContent = x.vs; $("sa-by").textContent = x.by; $("sa-code").textContent = x.code;
  [...$("sa-steps").children].forEach((el, i) => i === x.p ? el.setAttribute("data-on", "") : el.removeAttribute("data-on"));
  readout.textContent = x.n + " · family " + x.family + " · acts at " + PHASES[x.p];
  stage.setAttribute("aria-valuenow", String(at)); stage.setAttribute("aria-valuetext", x.n + ", acts at " + PHASES[x.p]);
}
function showLift(x) {
  const id = x.f + ":" + x.s;
  if (shown === id) return;
  if (shown) { lifts.get(shown).style.display = "none"; rest.get(shown).style.display = ""; }
  shown = id; lifts.get(id).style.display = ""; rest.get(id).style.display = "none"; rise = 0;
}
function draw() {
  const x = ALL[at];
  trays.forEach((g, f) => g.setAttribute("transform", translateAlong(P, [0, pull[f], 0])));
  carriage.setAttribute("transform", translateAlong(P, [cx, 0, 0]));
  lifts.get(shown).setAttribute("transform", translateAlong(P, [0, pull[x.f], rise]));
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60; last = now;
  const x = ALL[at], calm = still.matches, ease = (v, to, s) => calm ? to : Math.abs(to - v) < 0.02 ? to : v + (to - v) * (1 - Math.exp(-dt / s));
  pull.forEach((v, f) => { pull[f] = ease(v, f === x.f ? PULL : 0, 0.16); });
  cx = ease(cx, STOPS[x.p], 0.2);
  rise = ease(rise, pull[x.f] > PULL * 0.7 ? 15 : 0, 0.12);
  draw();
  const settled = cx === STOPS[x.p] && rise === 15 && pull.every((v, f) => v === (f === x.f ? PULL : 0));
  frame = visible && !settled ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
function go(i) { at = (i + ALL.length) % ALL.length; showLift(ALL[at]); panel(); run(); }
function tour() { clearTimeout(tourTimer); if (touring && !still.matches) tourTimer = setTimeout(() => { if (visible) go(at + 1); tour(); }, 3200); }
function user(i) { touring = false; clearTimeout(tourTimer); clearTimeout(idle); go(i); idle = setTimeout(() => { touring = !still.matches; tour(); }, 12000); }
document.addEventListener("click", (e) => {
  const item = e.target.closest?.("[data-item]"), fam = e.target.closest?.("[data-fam]"), st = e.target.closest?.("[data-stamp]"), dr = e.target.closest?.("[data-drawer]");
  if (item) return user(+item.dataset.item);
  const inFam = (f, s = 0) => ALL.findIndex((y) => y.f === f && y.s === s);
  if (fam) return user(inFam(+fam.dataset.fam));
  if (st) { const [f, s] = st.dataset.stamp.split(":").map(Number); return user(inFam(f, s)); }
  if (dr) return user(inFam(+dr.dataset.drawer));
});
stage.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") { e.preventDefault(); user(at + 1); }
  if (e.key === "ArrowLeft") { e.preventDefault(); user(at - 1); }
});
new IntersectionObserver((es) => { visible = es[es.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
showLift(ALL[0]); panel(); draw(); tour();
}`;

const plate = k.plateHtml({
  fig: "Fig 24", title: "Spring annotation cabinet", hint: "Pick a stamp · ← →",
  readout: `${first.n} · family ${first.family} · acts at ${PHASES[first.p]}`,
  keys: [
    { mark: "lit", label: "The chosen stamp and the carriage tip" },
    { mark: "raised", label: "Filled dot = its phase" },
  ],
  caption: `${ALL.length} annotations in ${FAMILIES.length} families. Many look alike; what separates them is when Spring acts on them and which class reads them. The rail's phases: ${PHASES.map((x, i) => `${x} (${PHASE_NOTE[i]})`).join(", ")}. Proxy annotations are wrapped at startup and act on each call from another bean, so a call from inside the same class skips them.`,
  body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Spring annotations: arrow keys move from stamp to stamp" aria-valuemin="0" aria-valuemax="${ALL.length - 1}" aria-valuenow="0">${svg}</div>`,
});

const script = `<script type="application/json" id="part-text">${JSON.stringify(PART_TEXT).replace(/</g, "\\u003c")}</script>`;
const html = k.pageHtml({ title: "Spring annotation cabinet", theme: "light", width: 1200, body: `<style>${css}</style>${summary}${plate}${panel}${script}`, script: kitScript() + live });
writeFileSync(join(HERE, "figure.html"), html);
console.log(`wrote figure.html: ${ALL.length} annotations, ${(html.length / 1024) | 0} KB`);
