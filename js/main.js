/* ============================================================
   DAN SANDS // signal — Phase 01 interactions
   ============================================================ */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- obfuscated contact (never in plain HTML source) ---------- */
  // Assembled at runtime so scrapers reading the static file get nothing.
  const P = ["DanSands", ".Pro", "@", "gmail", ".", "com"];
  const email = () => P.join("");
  const LINKS = {
    linkedin: "https://www.linkedin.com/in/DanDataDrivenDreamer",
    github:   "https://github.com/dansands33",
  };

  /* ---------- boot sequence ---------- */
  const bootEl = document.getElementById("boot");
  const bootText = document.getElementById("boot-text");
  const stage = document.getElementById("stage");
  const bootLines = [
    "> initializing signal…",
    "> loading identity :: DAN.SANDS",
    "> mounting HUD ................ <span class='ok'>ok</span>",
    "> privacy shield :: no-trackers <span class='ok'>ok</span>",
    "> parallax field :: <span class='ok'>online</span>",
    "> decrypting mission ......... <span class='ok'>done</span>",
    "> <span class='warn'>welcome, operator.</span>",
  ];

  function runBoot() {
    if (reduce) { bootEl.classList.add("hidden"); stage.classList.remove("hidden"); return; }
    let i = 0, buf = "";
    (function next() {
      if (i >= bootLines.length) {
        setTimeout(() => {
          bootEl.style.transition = "opacity .5s ease";
          bootEl.style.opacity = "0";
          setTimeout(() => { bootEl.classList.add("hidden"); stage.classList.remove("hidden"); }, 500);
        }, 420);
        return;
      }
      buf += bootLines[i] + "\n";
      bootText.innerHTML = buf;
      i++;
      setTimeout(next, 260 + Math.random() * 180);
    })();
  }

  /* ---------- i18n ---------- */
  const I18N = {
    en: {
      eyebrow: "incoming transmission",
      tagline_pre: "I help teams turn",
      tagline_hot: "chaos",
      tagline_mid: "into",
      tagline_cool: "clear, working systems",
      open_channel: "open channel",
      wip: "this signal is under construction — phase 01 of many.",
      phrases: [
        "product operations · ai workflows · internal tools",
        "8+ years turning ambiguity into roadmaps",
        "distributed teams · latam ⇄ north america",
        "quality, clarity, and momentum — by design",
        "how could I help you?",
      ],
    },
    es: {
      eyebrow: "transmisión entrante",
      tagline_pre: "Ayudo a equipos a convertir",
      tagline_hot: "el caos",
      tagline_mid: "en",
      tagline_cool: "sistemas claros y funcionales",
      open_channel: "abrir canal",
      wip: "esta señal está en construcción — fase 01 de varias.",
      phrases: [
        "operaciones de producto · flujos de ia · herramientas internas",
        "8+ años convirtiendo ambigüedad en hojas de ruta",
        "equipos distribuidos · latam ⇄ norteamérica",
        "calidad, claridad y momentum — por diseño",
        "¿cómo podría ayudarte?",
      ],
    },
  };
  let lang = "en";
  function applyLang(l) {
    lang = I18N[l] ? l : "en";
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (I18N[lang][key]) el.textContent = I18N[lang][key];
    });
    document.querySelectorAll(".lang-btn").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    phrases = I18N[lang].phrases;
    restartRotor();
    try { localStorage.setItem("dss-lang", lang); } catch (_) {}
  }

  /* ---------- rotating subline ---------- */
  let phrases = I18N[lang].phrases;
  const rotor = document.getElementById("rotor");
  let rotorTimer = null;
  function typeLoop() {
    if (reduce) { rotor.textContent = phrases[phrases.length - 1]; return; }
    let pi = 0;
    const show = (t) => { rotor.textContent = t; };
    function typePhrase() {
      const txt = phrases[pi]; let ci = 0;
      (function type() {
        show(txt.slice(0, ci));
        if (ci < txt.length) { ci++; rotorTimer = setTimeout(type, 34); }
        else { rotorTimer = setTimeout(erase, 2200); }
      })();
      function erase() {
        (function del() {
          ci--;                                           // shrink first, then render
          show(txt.slice(0, Math.max(ci, 0)));
          if (ci > 0) { rotorTimer = setTimeout(del, 16); }
          else {
            show("");                                     // GUARANTEE empty during the sentence transition
            pi = (pi + 1) % phrases.length;
            rotorTimer = setTimeout(typePhrase, 320);
          }
        })();
      }
    }
    typePhrase();
  }
  function restartRotor() {
    if (rotorTimer) clearTimeout(rotorTimer);
    rotor.textContent = "";
    typeLoop();
  }

  /* ---------- clock ---------- */
  function tickClock() {
    const el = document.getElementById("clock");
    if (!el) return;
    const now = new Date();
    el.textContent = now.toISOString().slice(11, 19) + " UTC";
  }
  setInterval(tickClock, 1000); tickClock();
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- background field :: one animation per theme ---------- */
  const canvas = document.getElementById("bg-field");
  const ctx = canvas.getContext("2d");
  let W, H, mx = 0, my = 0, raf, mode = "sunset";
  const rgb = (v, f) => (getComputedStyle(document.documentElement).getPropertyValue(v).trim() || f);
  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }

  // --- sunset: constellation network ---
  let dots = [];
  function seedDots() {
    const n = Math.min(90, Math.floor((W * H) / 18000));
    dots = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H, z: Math.random() * 0.8 + 0.2,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
    }));
  }
  function drawSunset() {
    ctx.clearRect(0, 0, W, H);
    const c1 = rgb("--rgb-cool", "56,225,255"), c2 = rgb("--rgb-cool2", "108,123,255");
    for (const d of dots) {
      d.x += d.vx + mx * d.z * 0.6; d.y += d.vy + my * d.z * 0.6;
      if (d.x < 0) d.x = W; if (d.x > W) d.x = 0; if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.z * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c1},${0.15 + d.z * 0.35})`; ctx.fill();
    }
    for (let i = 0; i < dots.length; i++)
      for (let j = i + 1; j < dots.length; j++) {
        const a = dots[i], b = dots[j], dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 120) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${c2},${(1 - dist / 120) * 0.12})`; ctx.lineWidth = 0.6; ctx.stroke();
        }
      }
  }

  // --- forge: base fountain + random mid-screen floating sparks ---
  let fire = [], wisps = [];
  function spawnFire() {
    return {
      x: Math.random() * W, y: H + Math.random() * 60, r: Math.random() * 2.6 + 0.8,
      vy: -(Math.random() * 1.1 + 0.7), drift: (Math.random() - 0.5) * 0.5,
      life: 1, decay: Math.random() * 0.0014 + 0.0007, hue: Math.random(),
    };
  }
  function spawnWisp() {
    // appears randomly anywhere on screen, floats up
    return {
      x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2.2 + 0.6,
      vy: -(Math.random() * 0.9 + 0.4), drift: (Math.random() - 0.5) * 0.7,
      life: 1, decay: Math.random() * 0.0022 + 0.0011, hue: Math.random(),
    };
  }
  function seedFire() {
    fire = Array.from({ length: Math.min(150, Math.floor(W / 6)) }, () => spawnFire());
    wisps = Array.from({ length: Math.min(70, Math.floor(W / 16)) }, () => spawnWisp());
  }
  function drawFire() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    const red = rgb("--rgb-cool", "255,59,31"), orange = rgb("--rgb-hot", "255,106,31"), yellow = rgb("--rgb-gold", "255,210,63");
    const colorFor = (life) => life > 0.66 ? yellow : (life > 0.33 ? orange : red);
    for (let i = 0; i < fire.length; i++) {
      const p = fire[i];
      p.y += p.vy; p.x += p.drift + mx * 0.5; p.life -= p.decay; p.vy *= 0.999;
      if (p.y < -30 || p.life <= 0) { fire[i] = spawnFire(); continue; }
      const col = colorFor(p.life);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},${p.life * 0.7})`;
      ctx.shadowBlur = 12; ctx.shadowColor = `rgba(${col},${p.life})`; ctx.fill();
    }
    // random floating sparks anywhere on screen
    for (let i = 0; i < wisps.length; i++) {
      const p = wisps[i];
      p.y += p.vy; p.x += p.drift + mx * 0.6; p.life -= p.decay;
      if (p.y < -20 || p.life <= 0 || p.x < -20 || p.x > W + 20) { wisps[i] = spawnWisp(); continue; }
      const col = colorFor(p.life);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},${p.life * 0.6})`;
      ctx.shadowBlur = 10; ctx.shadowColor = `rgba(${col},${p.life})`; ctx.fill();
    }
    ctx.shadowBlur = 0; ctx.globalCompositeOperation = "source-over";
  }

  // --- dawn: soft slow-drifting light motes (calm morning) ---
  let motes = [];
  function seedMotes() {
    const n = Math.min(60, Math.floor((W * H) / 26000));
    motes = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: Math.random() * 22 + 8,
      vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.1,
      a: Math.random() * 0.05 + 0.02, hue: Math.random(),
    }));
  }
  function drawDawn() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    const warm = rgb("--rgb-hot", "255,158,109"), rose = rgb("--rgb-cool2", "199,155,255"), blue = rgb("--rgb-cool", "137,167,255");
    for (const m of motes) {
      m.x += m.vx + mx * 0.15; m.y += m.vy + my * 0.12;
      if (m.x < -m.r) m.x = W + m.r; if (m.x > W + m.r) m.x = -m.r;
      if (m.y < -m.r) m.y = H + m.r; if (m.y > H + m.r) m.y = -m.r;
      const col = m.hue < 0.5 ? warm : (m.hue < 0.8 ? rose : blue);
      const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r);
      g.addColorStop(0, `rgba(${col},${m.a})`); g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  // --- mist: top-down ASCII forest (small trees) + a FIXED gentle river near the top (no branch) ---
  let fog = [], trees = [];
  // fixed river geometry (no time term → path never moves)
  const RIVER_HW = () => W * 0.04;                 // half-width = 4% of viewport → river is 8% wide (80% of prior)
  function mainY(x) { return H * 0.14 + Math.sin(x * 2 * Math.PI / W) * H * 0.13; } // sits near the top, ONE gentle meander
  function inRiver(x, y, clear = 0) {
    const hw = RIVER_HW() + clear;
    return Math.abs(y - mainY(x)) <= hw;
  }
  const TREE = "^"; // tiny top-down canopy
  let ripples = []; // horizontally-flowing ~ particles, vertically scattered within the river
  function seedFog() {
    fog = Array.from({ length: 11 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H, r: Math.random() * 240 + 160,
      vx: (Math.random() - 0.5) * 0.308, vy: (Math.random() - 0.5) * 0.198, // +10% speed
      a: (i < 7 ? Math.random() * 0.08 + 0.10 : Math.random() * 0.05 + 0.04), // much fainter
    }));
    // dense grid of small trees covering the whole screen — but NONE inside the (fixed) river
    const step = 26;
    trees = [];
    for (let y = step / 2; y < H; y += step)
      for (let x = step / 2; x < W; x += step) {
        if (inRiver(x, y, 32)) continue; // keep the channel (+glyph clearance) clear of trees
        trees.push({ x: x + (Math.random() - 0.5) * 8, y: y + (Math.random() - 0.5) * 8, s: Math.random() * 0.5 + 0.8, tone: Math.random() });
      }
    // ~ ripples that flow horizontally downstream along the river line, scattered vertically
    ripples = Array.from({ length: Math.ceil(W / 52) }, () => ({   // half the previous count
      x: Math.random() * W, phase: Math.random() * Math.PI * 2, sp: 0.2 + Math.random() * 0.25,  // half speed
      vf: (Math.random() * 2 - 1) * 0.7, // vertical fraction within [-0.7, 0.7] of half-width
    }));
  }
  function drawMist() {
    ctx.clearRect(0, 0, W, H);
    const blue = rgb("--rgb-cool", "143,208,230"), green = rgb("--rgb-cool2", "63,122,88");
    ctx.textAlign = "center"; ctx.font = `15px "JetBrains Mono", monospace`;
    const t = performance.now() * 0.0016; // time only for the moving ~ waves, NOT the path
    const hw = RIVER_HW();
    // --- bank glyph by local slope of the centerline ---
    const bankGlyph = (x, fn) => {
      const slope = (fn(x + 2) - fn(x - 2)) / 4;
      if (slope > 0.5) return "/";
      if (slope < -0.5) return "\\";
      if (Math.abs(slope) < 0.12) return "_";
      return "-";
    };
    const drawBanks = (fn, half) => {
      for (let x = 6; x < W; x += 9) {
        const yc = fn(x);
        ctx.fillStyle = `rgba(${blue},0.10)`; // banks faint (10% opacity)
        ctx.fillText(bankGlyph(x, fn), x, yc - half);
        ctx.fillText(bankGlyph(x, fn), x, yc + half);
      }
    };
    // --- FIXED path: banks for the single river channel (no motion, no branch) ---
    drawBanks(mainY, hw);
    // --- ~ ripples flow HORIZONTALLY downstream, vertically scattered but INSIDE the banks ---
    for (const rp of ripples) {
      rp.x += rp.sp; if (rp.x > W + 10) rp.x = -10;        // flow left→right, wrap around
      const yc = mainY(rp.x) + rp.vf * hw;                 // random vertical offset within the channel
      const a = 0.10 + 0.14 * (0.5 + 0.5 * Math.sin(rp.phase + t * 1.4)); // fade in/out as waves
      ctx.fillStyle = `rgba(${blue},${a})`;
      ctx.fillText("~", rp.x, yc);
    }
    // top-down canopy: small trees everywhere EXCEPT inside the river
    for (const tr of trees) {
      const x = tr.x, y = tr.y;
      const col = tr.tone < 0.5 ? green : "79,174,109";
      ctx.fillStyle = `rgba(${col},${0.06 + tr.s * 0.10})`;
      ctx.font = `${Math.round(13 * tr.s)}px "JetBrains Mono", monospace`;
      ctx.fillText(TREE, x, y);
    }
    ctx.textAlign = "start"; ctx.font = "";
    // fog on top (subtle)
    ctx.globalCompositeOperation = "lighter";
    const white = rgb("--mist-white", "235,242,236"), g2 = rgb("--rgb-hot", "79,174,109"),
          blue2 = rgb("--rgb-cool", "143,208,230"), wood = rgb("--mist-wood", "74,54,38");
    const pal = [white, white, white, white, g2, blue2, white, wood, g2];
    for (let i = 0; i < fog.length; i++) {
      const f = fog[i];
      f.x += f.vx + mx * 0.3; f.y += f.vy + my * 0.2;
      if (f.x < -f.r) f.x = W + f.r; if (f.x > W + f.r) f.x = -f.r;
      if (f.y < -f.r) f.y = H + f.r; if (f.y > H + f.r) f.y = -f.r;
      const col = pal[i % pal.length];
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
      g.addColorStop(0, `rgba(${col},${f.a})`);
      g.addColorStop(0.35, `rgba(${col},${f.a * 0.5})`);
      g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  // --- Ad Astra: parallax stars + constellation lines + rockets + thin shooting stars ---
  let stars = [], rocket = null, rocketTimer = 0, shooter = null, shooterTimer = 0;
  function seedStars() {
    const n = Math.min(220, Math.floor((W * H) / 7000));
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      z: Math.random() * 0.9 + 0.1,                 // depth → parallax + size
      tw: Math.random() * Math.PI * 2,              // twinkle phase
      tws: Math.random() * 0.05 + 0.01,
    }));
    rocket = null; rocketTimer = 180 + Math.random() * 240;
    shooter = null; shooterTimer = 120 + Math.random() * 200;
  }
  function launchRocket() {
    const fromLeft = Math.random() < 0.5;
    const y = Math.random() * H * 0.6 + H * 0.1;
    rocket = {
      x: fromLeft ? -40 : W + 40, y,
      vx: (fromLeft ? 1 : -1) * (Math.random() * 2 + 3.2),
      vy: -(Math.random() * 0.8 + 0.3), trail: [],
    };
  }
  function launchShooter() {
    const fromLeft = Math.random() < 0.5;
    const y = Math.random() * H * 0.7 + H * 0.05;
    shooter = {
      x: fromLeft ? -20 : W + 20, y,
      vx: (fromLeft ? 1 : -1) * (Math.random() * 6 + 9),   // much faster than the rocket
      vy: (Math.random() - 0.5) * 1.2, tail: 26,            // thin, line-like tail length
    };
  }
  function drawStarfield() {
    ctx.clearRect(0, 0, W, H);
    const cool = rgb("--rgb-cool", "111,168,255");
    // constellation lines (only bright/near stars)
    ctx.lineWidth = 0.5;
    for (let i = 0; i < stars.length; i++) {
      const a = stars[i]; if (a.z < 0.6) continue;
      for (let j = i + 1; j < stars.length; j++) {
        const b = stars[j]; if (b.z < 0.6) continue;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 90) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${cool},${(1 - d / 90) * 0.07})`; ctx.stroke(); }
      }
    }
    // stars (parallax drift + twinkle, 4-point sparkle for the big ones)
    for (const s of stars) {
      s.x += mx * s.z * 1.2; s.y += my * s.z * 1.2; s.tw += s.tws;
      if (s.x < 0) s.x += W; if (s.x > W) s.x -= W; if (s.y < 0) s.y += H; if (s.y > H) s.y -= H;
      const a = 0.4 + Math.sin(s.tw) * 0.35, r = s.z * 1.6;
      ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(235,240,255,${a})`; ctx.fill();
      if (s.z > 0.75) { // sparkle cross
        ctx.strokeStyle = `rgba(235,240,255,${a * 0.5})`; ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(s.x - r * 3, s.y); ctx.lineTo(s.x + r * 3, s.y);
        ctx.moveTo(s.x, s.y - r * 3); ctx.lineTo(s.x, s.y + r * 3); ctx.stroke();
      }
    }
    // rocket + fiery exhaust
    if (rocket) {
      rocket.x += rocket.vx; rocket.y += rocket.vy;
      rocket.trail.push({ x: rocket.x, y: rocket.y, life: 1 });
      if (rocket.trail.length > 40) rocket.trail.shift();
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      const hot = rgb("--rgb-hot", "255,138,61");
      for (const t of rocket.trail) {
        t.life -= 0.025; if (t.life <= 0) continue;
        const col = t.life > 0.6 ? "255,240,180" : hot;
        ctx.beginPath(); ctx.arc(t.x, t.y, 4 * t.life + 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},${t.life * 0.8})`;
        ctx.shadowBlur = 12; ctx.shadowColor = `rgba(${hot},${t.life})`; ctx.fill();
      }
      ctx.restore();
      // rocket head: ASCII ▲ nose, drawn AHEAD of the fiery trail (in travel direction) so it isn't washed out by the fire
      const ang = Math.atan2(rocket.vy, rocket.vx);
      const nx = rocket.x + Math.cos(ang) * 11, ny = rocket.y + Math.sin(ang) * 11; // 11px ahead of the flame
      ctx.save();
      ctx.translate(nx, ny); ctx.rotate(ang + Math.PI / 2);
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = '20px "JetBrains Mono", monospace';
      // faint dark halo so the glyph reads against the bright trail
      ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillText("▲", 0, 0);
      ctx.fillStyle = "rgba(245,248,255,1)"; ctx.fillText("▲", 0, 0); // solid bright nose
      ctx.restore();
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      if (rocket.x < -60 || rocket.x > W + 60 || rocket.y < -60) rocket = null;
    } else if (--rocketTimer <= 0) {
      launchRocket(); rocketTimer = 260 + Math.random() * 360;
    }
    // thin, fast silver shooting star (line-like, not a rocket)
    if (shooter) {
      shooter.x += shooter.vx; shooter.y += shooter.vy;
      const tx = shooter.x - shooter.vx * 2.4, ty = shooter.y - shooter.vy * 2.4; // tail point
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      const g = ctx.createLinearGradient(shooter.x, shooter.y, tx, ty);
      g.addColorStop(0, "rgba(220,230,255,0.9)"); g.addColorStop(1, "rgba(220,230,255,0)");
      ctx.strokeStyle = g; ctx.lineWidth = 1; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(shooter.x, shooter.y); ctx.lineTo(tx, ty); ctx.stroke();
      ctx.fillStyle = "rgba(240,245,255,0.95)"; ctx.beginPath();
      ctx.arc(shooter.x, shooter.y, 1.4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      if (shooter.x < -30 || shooter.x > W + 30) shooter = null;
    } else if (--shooterTimer <= 0) {
      launchShooter(); shooterTimer = 160 + Math.random() * 280;
    }
  }

  // --- aurelius: slow "chapters being written" — sentences hint at who I am ---
  const RAIN_LINES = [
    "clarity is a kindness",
    "ship small, learn fast",
    "the best system is the one people actually use",
    "i turn chaos into clear working systems",
    "distributed teams across latam and north america",
    "ai should remove friction, not add theater",
    "listen first, build second",
    "momentum beats perfection",
    "bridging tech and the humans it serves",
    "every roadmap is a story we agree to tell",
    "quality is not a phase, it is a stance",
    "lead with context, not control",
  ];
  const RAIN_LINES_ES = [
    "la claridad es una amabilidad",
    "entrega pequeño, aprende rápido",
    "el mejor sistema es el que la gente usa",
    "convierto el caos en sistemas claros",
    "equipos distribuidos por latam y norteamérica",
    "la ia debe quitar fricción, no poner teatro",
    "escucha primero, construye después",
    "el momentum vence a la perfección",
    "unir la tecnología con quien la usa",
    "cada roadmap es una historia que acordamos",
    "la calidad no es una fase, es una postura",
    "lidera con contexto, no con control",
  ];
  let cols = [], fsize = 15;
  function seedRain() {
    fsize = 15; const n = Math.ceil(W / (fsize * 1.6));
    cols = Array.from({ length: n }, () => spawnCol(true));
  }
  function spawnCol(init) {
    const set = (lang === "es" && typeof lang !== "undefined") ? RAIN_LINES_ES : RAIN_LINES;
    const line = set[(Math.random() * set.length) | 0];
    return {
      y: init ? Math.random() * -H : -40 - Math.random() * 200,
      sp: Math.random() * 0.06 + 0.03,           // slow fall of the whole line (words drift down gently)
      line, head: -3,                            // drop position (char index); sweeps top→bottom
    };
  }
  function drawRain() {
    ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, W, H); // true black each frame — no leftover marks
    ctx.font = `${fsize}px "JetBrains Mono", monospace`;
    const gold = rgb("--rgb-gold", "232,195,104");
    for (let i = 0; i < cols.length; i++) {
      const c = cols[i], x = i * fsize * 1.6 + mx * 2;
      c.y += fsize * c.sp;
      // the colored "drop" sweeps down through the already-written sentence, top→bottom (drop speed unchanged)
      if (Math.random() < 0.10) c.head += 1;
      const len = c.line.length;
      // draw the FULL sentence (base dim color); the drop recolors chars as it passes
      for (let k = 0; k < len; k++) {
        const ch = c.line[k]; if (ch === " ") continue;
        const py = c.y + k * fsize;             // char 0 at TOP, last at BOTTOM → reads top→bottom, drop falls down
        let col = "rgba(26,26,26,0.9)";         // base: dark grey, always visible
        const d = c.head - k;                   // distance of this char from the drop head
        if (d === 0)            col = `rgba(${gold},0.95)`;   // leading drop: bright gold
        else if (d === 1)       col = `rgba(${gold},0.55)`;   // dimmer gold
        else if (d === 2)       col = "rgba(200,205,215,0.7)"; // silver trail
        ctx.fillStyle = col;
        ctx.fillText(ch, x, py);
      }
      // respawn once the drop has swept past the end and the line has fallen off-screen
      if (c.head > len + 3 && c.y - len * fsize > H + 40) cols[i] = spawnCol(false);
    }
  }

  const RENDER = { sunset: drawSunset, forge: drawFire, dawn: drawDawn, mist: drawMist, starfield: drawStarfield, aurelius: drawRain };
  const SEED = { sunset: seedDots, forge: seedFire, dawn: seedMotes, mist: seedFog, starfield: seedStars, aurelius: seedRain };
  function reseed() { (SEED[mode] || seedDots)(); if (mode === "aurelius") ctx.clearRect(0, 0, W, H); }
  function loop() { (RENDER[mode] || drawSunset)(); drawSparks(); raf = requestAnimationFrame(loop); }
  function setMode(m) { mode = m; ctx.clearRect(0, 0, W, H); reseed(); }
  function startField() {
    if (reduce) return;
    resize(); reseed(); loop();
    addEventListener("resize", () => { resize(); reseed(); });
    addEventListener("mousemove", (e) => { mx = (e.clientX / W - 0.5) * 0.6; my = (e.clientY / H - 0.5) * 0.6; });
  }

  /* ---------- title glitch on hover ---------- */
  const titleLine = document.querySelector(".title .line");
  if (titleLine && !reduce) {
    const original = titleLine.textContent;
    const glyphs = "!<>-_\\/[]{}—=+*^?#________";
    titleLine.addEventListener("mouseenter", () => {
      let frame = 0;
      const total = 14;
      const iv = setInterval(() => {
        titleLine.textContent = original.split("").map((ch, i) => {
          if (ch === " ") return " ";
          return frame > i ? original[i] : glyphs[Math.floor(Math.random() * glyphs.length)];
        }).join("");
        frame++;
        if (frame > total) { clearInterval(iv); titleLine.textContent = original; }
      }, 30);
    });
  }

  /* ---------- contact modal ---------- */
  function buildModal() {
    const modal = document.createElement("div");
    modal.id = "contact-modal";
    modal.innerHTML = `
      <div class="modal-card" role="dialog" aria-modal="true" aria-label="Contact channels">
        <button class="modal-close" aria-label="close">✕</button>
        <h2>Open a channel</h2>
        <p class="sub">// work + online only · no phone · privacy-first</p>
        <a class="chan" id="email-chan" href="#"><span class="ico">✉</span> <span id="email-text">reveal email</span> <small>click to copy</small></a>
        <a class="chan" href="${LINKS.linkedin}" target="_blank" rel="noopener noreferrer"><span class="ico">in</span> LinkedIn <small>DanDataDrivenDreamer</small></a>
        <a class="chan" href="${LINKS.github}" target="_blank" rel="noopener noreferrer"><span class="ico">⌥</span> GitHub <small>@dansands33</small></a>
        <div id="copy-toast"></div>
      </div>`;
    document.body.appendChild(modal);

    const close = () => modal.classList.remove("open");
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    modal.querySelector(".modal-close").addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

    const emailChan = modal.querySelector("#email-chan");
    const emailText = modal.querySelector("#email-text");
    const toast = modal.querySelector("#copy-toast");
    let revealed = false;
    emailChan.addEventListener("click", (e) => {
      e.preventDefault();
      const addr = email();
      if (!revealed) { emailText.textContent = addr; emailChan.href = "mailto:" + addr; revealed = true; return; }
      navigator.clipboard?.writeText(addr).then(() => {
        toast.textContent = "copied ✓ — or click again to open mail";
        setTimeout(() => (toast.textContent = ""), 2600);
      });
    });
    return modal;
  }
  const modal = buildModal();
  document.getElementById("contact-btn").addEventListener("click", (e) => {
    e.preventDefault(); modal.classList.add("open");
  });

  /* ---------- palette selector (persisted) ---------- */
  const THEMES = ["sunset", "forge", "dawn", "mist", "starfield", "aurelius"];
  const swatches = document.querySelectorAll(".swatch");
  function applyTheme(name) {
    if (!THEMES.includes(name)) name = "sunset";
    document.documentElement.setAttribute("data-theme", name);
    swatches.forEach((s) => s.setAttribute("aria-pressed", String(s.dataset.set === name)));
    if (typeof setMode === "function") setMode(name);
    try { localStorage.setItem("dss-theme", name); } catch (_) {}
  }
  swatches.forEach((s) => s.addEventListener("click", () => applyTheme(s.dataset.set)));
  let saved = "sunset";
  try { saved = localStorage.getItem("dss-theme") || "sunset"; } catch (_) {}
  applyTheme(saved);

  /* ---------- language selector (persisted, default EN) ---------- */
  const langBtns = document.querySelectorAll(".lang-btn");
  langBtns.forEach((b) => b.addEventListener("click", () => applyLang(b.dataset.lang)));
  let savedLang = "en";
  try { savedLang = localStorage.getItem("dss-lang") || "en"; } catch (_) {}
  applyLang(savedLang);

  /* ---------- click sparks (drawn by main loop so they persist) ---------- */
  let sparks = [];
  function burstSparks(x, y) {
    if (reduce) return;
    const gold = rgb("--rgb-gold", "255,210,63"), hot = rgb("--rgb-hot", "255,106,31");
    for (let i = 0; i < 14; i++) {
      const ang = Math.random() * Math.PI * 2, sp = Math.random() * 4 + 1.5;
      sparks.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 1, life: 1, col: Math.random() < 0.5 ? gold : hot });
    }
  }
  function drawSparks() {
    if (!sparks.length) return;
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    for (const p of sparks) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.vx *= 0.97; p.life -= 0.035;
      if (p.life <= 0) continue;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2 * p.life + 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col},${p.life})`;
      ctx.shadowBlur = 8; ctx.shadowColor = `rgba(${p.col},${p.life})`; ctx.fill();
    }
    ctx.restore();
    sparks = sparks.filter((p) => p.life > 0);
  }
  document.querySelectorAll(".btn, .swatch").forEach((el) => {
    el.addEventListener("click", (e) => burstSparks(e.clientX, e.clientY));
  });

  /* ---------- go ---------- */
  runBoot();
  typeLoop();
  startField();
})();
