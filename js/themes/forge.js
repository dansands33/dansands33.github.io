/* ============================================================
   THEME ANIMATION: forge — ember fountain + floating wisps
   ------------------------------------------------------------
   Two particle systems on additive ("lighter") blend: a base fountain
   of embers rising from the bottom edge, and slower free-floating
   wisps. Color ramps yellow→orange→red by remaining life, reading
   --rgb-hot / --rgb-gold. seed() fills both pools; draw() runs them
   every frame. The "blacksmith's hearth" mood.
   ============================================================ */
(function () {
  "use strict";
  const DSS = window.DSS, T = DSS.THEMES;
  const rgb = (v, f) => DSS.rgb(v, f);
  let fire = [], wisps = [];

  // A single ember: spawned just below the bottom edge, rises, then recycled.
  function spawnFire() {
    const W = DSS.W, H = DSS.H;
    return {
      x: Math.random() * W,
      y: H + Math.random() * 60,                  // start below screen so it rises into view
      r: Math.random() * 2.6 + 0.8,               // base radius (shrinks with life)
      vy: -(Math.random() * 1.1 + 0.7),           // upward velocity (negative = up)
      drift: (Math.random() - 0.5) * 0.5,         // gentle horizontal sway
      life: 1,                                    // 1 -> 0
      decay: Math.random() * 0.0014 + 0.0007,     // how fast it dies (varied per ember)
      hue: Math.random(),
    };
  }

  // A free-floating wisp: born anywhere on screen, slower, longer-lived.
  function spawnWisp() {
    const W = DSS.W, H = DSS.H;
    return {
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2.2 + 0.6,
      vy: -(Math.random() * 0.9 + 0.4),
      drift: (Math.random() - 0.5) * 0.7,
      life: 1, decay: Math.random() * 0.0022 + 0.0011,
      hue: Math.random(),
    };
  }

  function seed() {
    const W = DSS.W;
    // counts scale with width; capped so it stays performant
    fire  = Array.from({ length: Math.min(150, Math.floor(W / 6)) },  () => spawnFire());
    wisps = Array.from({ length: Math.min(70,  Math.floor(W / 16)) }, () => spawnWisp());
  }

  function draw() {
    const ctx = DSS.ctx, W = DSS.W, mx = DSS.mx;
    ctx.clearRect(0, 0, W, DSS.H);
    // additive blending: overlapping embers sum to brighter hotspots (fire glow)
    ctx.globalCompositeOperation = "lighter";
    // flame ramp by remaining life: young = yellow, mid = orange, old = red
    const red = rgb("--rgb-cool", "255,59,31"), orange = rgb("--rgb-hot", "255,106,31"),
          yellow = rgb("--rgb-gold", "255,210,63");
    const colorFor = (life) => life > 0.66 ? yellow : (life > 0.33 ? orange : red);

    // --- ember fountain (rises from the bottom) ---
    for (let i = 0; i < fire.length; i++) {
      const p = fire[i];
      p.y += p.vy;                         // rise
      p.x += p.drift + mx * 0.5;           // sway + mouse push
      p.life -= p.decay;                   // age
      p.vy *= 0.999;                       // slight slowdown as it climbs
      if (p.y < -30 || p.life <= 0) { fire[i] = spawnFire(); continue; } // recycle when spent
      const col = colorFor(p.life);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2); // radius shrinks with life
      ctx.fillStyle = `rgba(${col},${p.life * 0.7})`;
      ctx.shadowBlur = 12; ctx.shadowColor = `rgba(${col},${p.life})`; ctx.fill();
    }

    // --- floating wisps (drift anywhere) ---
    for (let i = 0; i < wisps.length; i++) {
      const p = wisps[i];
      p.y += p.vy; p.x += p.drift + mx * 0.6; p.life -= p.decay;
      // recycle when it drifts off any edge or dies
      if (p.y < -20 || p.life <= 0 || p.x < -20 || p.x > W + 20) { wisps[i] = spawnWisp(); continue; }
      const col = colorFor(p.life);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},${p.life * 0.6})`;
      ctx.shadowBlur = 10; ctx.shadowColor = `rgba(${col},${p.life})`; ctx.fill();
    }

    // reset canvas state for the next theme / next frame
    ctx.shadowBlur = 0; ctx.globalCompositeOperation = "source-over";
  }
  T.forge = { seed, draw };
})();
