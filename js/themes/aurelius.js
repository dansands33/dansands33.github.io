/* ============================================================
   THEME ANIMATION: aurelius — slow "chapters being written"
   ------------------------------------------------------------
   Sentences from DSS.content.RAIN_LINES(_ES) drift downward like
   rain, each glyph lit gold as a "head" passes (matrix-style tail).
   Reads --rgb-gold for the lit head. seed() lays out one column per
   ~24px of width; draw() paints black bg + the falling text.

   LIFECYCLE (per "chapter", shared by EVERY sentence at once):
     1. IN    - text is stationary and fades in: opacity 0 -> 1
                (eased). Sentences begin entering from the top and
                keep spawning in, staggered, across DROP+HOLD.
     2. DROP  - full opacity; columns FALL and keep falling
                (recycling to the top when they exit the bottom, so
                the motion never stops).
     3. HOLD  - drop keeps going for 5s; text stays at full
                opacity, still falling.
     4. OUT   - fades back to fully transparent (1 -> 0, eased)
                while still falling.
   The fade envelope is a single value shared by all glyphs of all
   sentences, so every character of each sentence fades in/out
   simultaneously, and all sentences do so at the same time.

   POINTER SPEED: while the mouse is moving the fall SLOWS; once the
   pointer is idle for >1s the speed ramps back to default.
   ============================================================ */
(function () {
  "use strict";
  const DSS = window.DSS, T = DSS.THEMES;
  const rgb = (v, f) => DSS.rgb(v, f);

  /* ---------- chapter lifecycle envelope ---------- */
  const FADE_IN = 1200;   // ms: opacity 0 -> 1 (no movement yet)
  const DROP_DUR = 5000;  // ms: full opacity, columns fall
  const HOLD = 5000;      // ms: keep falling at full opacity for 5s
  const FADE_OUT = 1200;  // ms: opacity 1 -> 0
  const ENTER_MS = 4000;  // min full-opacity time a recycled column needs to scroll fully in
  const PH = { IN: "in", DROP: "drop", HOLD: "hold", OUT: "out" };

  // easeInOutSine — smooth fade, no harsh linear ramp
  const easeIO = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

  /* ---------- pointer speed modulation ---------- */
  const SLOW = 0.2;       // fall-speed multiplier while pointer moves
  const RAMP = 0.06;      // smoothing toward the target speed per frame
  let lastMove = -1e9;    // performance.now() of last pointer movement
  let speedFactor = 1;    // smoothed multiplier (1 = default speed)
  window.addEventListener("mousemove", () => { lastMove = performance.now(); }, { passive: true });

  let phase = PH.IN, pt = 0, lastT = 0, env = 0, chapterT = 0;
  let cols = [], fsize = 15;

  // a column waiting to "spawn" later in the chapter, at a random time, so
  // sentences rain in staggered instead of all appearing at once.
  function makePending() {
    const span = DROP_DUR + HOLD - ENTER_MS;   // last safe spawn (still time to read)
    return { active: false, activateAt: Math.random() * span, line: null, head: -3, y: 0, sp: 0 };
  }

  // turn a (pending or recycled) column into an active sentence entering from
  // just above the top edge (BOUNDED offset -> scrolls in within ~1-3s).
  function activate(c) {
    const set = (DSS.lang === "es") ? DSS.content.RAIN_LINES_ES : DSS.content.RAIN_LINES;
    c.line = set[(Math.random() * set.length) | 0];
    c.active = true;
    c.y = -fsize * 2 - Math.random() * fsize * 4;
    c.sp = Math.random() * 0.06 + 0.03;
    c.head = -3;
  }

  function seed() {
    const W = DSS.W;
    fsize = 15;
    const n = Math.ceil(W / (fsize * 1.6));   // one column per ~24px of width
    cols = Array.from({ length: n }, () => makePending());  // spawn in staggered
    phase = PH.IN; pt = 0; env = 0; lastT = performance.now(); chapterT = 0;
  }

  // advance the IN->DROP->HOLD->OUT state machine using real elapsed time (dt, ms)
  function advancePhase(dt) {
    pt += dt; chapterT += dt;
    if (phase === PH.IN) {
      env = easeIO(Math.min(1, pt / FADE_IN));       // 0 -> 1 ease
      if (pt >= FADE_IN) { phase = PH.DROP; pt = 0; env = 1; }
    } else if (phase === PH.DROP) {
      env = 1;
      if (pt >= DROP_DUR) { phase = PH.HOLD; pt = 0; }
    } else if (phase === PH.HOLD) {
      env = 1;
      if (pt >= HOLD) { phase = PH.OUT; pt = 0; }
    } else { // OUT
      env = 1 - easeIO(Math.min(1, pt / FADE_OUT));  // 1 -> 0 ease
      if (pt >= FADE_OUT) {
        // chapter complete -> fresh chapter: columns spawn in STAGGERED over the
        // next chapter (random activateAt per column), not all at once.
        cols = cols.map(() => makePending());
        phase = PH.IN; pt = 0; env = 0; chapterT = 0;
      }
    }
  }

  // ms of full-opacity remaining before the OUT fade begins (0 during IN/OUT),
  // so we never birth a column that would fade out before it can scroll in
  function msUntilOut() {
    if (phase === PH.DROP) return (DROP_DUR - pt) + HOLD;
    if (phase === PH.HOLD) return HOLD - pt;
    return 0;
  }

  function draw() {
    const ctx = DSS.ctx, W = DSS.W, H = DSS.H, mx = DSS.mx;
    const now = performance.now();
    const dt = lastT ? Math.min(64, now - lastT) : 16; // clamp tab-switch jumps
    lastT = now;
    advancePhase(dt);

    // pointer speed: slow while moving, ramp back to default after >1s idle
    const idle = (now - lastMove) > 1000;
    const target = idle ? 1 : SLOW;
    speedFactor += (target - speedFactor) * RAMP;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);
    if (env <= 0.001) return; // fully transparent: nothing to paint

    ctx.font = `${fsize}px "JetBrains Mono", monospace`;
    const gp = rgb("--rgb-gold", "232,195,104").split(",").map((s) => parseInt(s, 10));
    const gr = gp[0], gg = gp[1], gb = gp[2];
    const moving = (phase !== PH.IN);   // stationary only during the IN fade-in

    for (let i = 0; i < cols.length; i++) {
      const c = cols[i], x = i * fsize * 1.6 + mx * 2;   // column x (+ tiny parallax)
      // not spawned yet this chapter? wait, then activate (enter from top) at its
      // random time so sentences rain in staggered instead of all at once.
      if (!c.active) {
        if (c.activateAt <= chapterT) activate(c);
        else continue;
      }
      if (moving) {
        c.y += fsize * c.sp * speedFactor;               // fall (pointer-modulated)
        // recycle to the top once fully past the bottom — motion never stops.
        // BUT only birth a fresh column when the chapter still has >=ENTER_MS of
        // full-opacity left; otherwise it would fade out before scrolling in.
        if (c.y - c.line.length * fsize > H + 40) {
          if (msUntilOut() >= ENTER_MS) activate(cols[i]);
          continue; // else: leave empty (off-screen) until next chapter seeds it
        }
      }
      if (Math.random() < 0.10) c.head += 1; // matrix head keeps shimmering
      const len = c.line.length;
      for (let k = 0; k < len; k++) {
        const ch = c.line[k]; if (ch === " ") continue;
        const py = c.y + k * fsize;
        if (py < -fsize || py > H + fsize) continue;     // cull off-screen glyphs
        let r = 26, g = 26, b = 26, a = 0.9;             // dim base
        const d = c.head - k;
        if (d === 0)            { r = gr; g = gg; b = gb; a = 0.95; } // head: bright gold
        else if (d === 1)       { r = gr; g = gg; b = gb; a = 0.55; } // just behind: gold, dimmer
        else if (d === 2)       { r = 200; g = 205; b = 215; a = 0.7; } // silver afterglow
        // env = shared fade envelope (IN/OUT); multiplies every glyph's alpha
        ctx.fillStyle = `rgba(${r},${g},${b},${a * env})`;
        ctx.fillText(ch, x, py);
      }
    }
  }
  T.aurelius = { seed, draw };
})();
