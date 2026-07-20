/* ============================================================
   THEME ANIMATION: sahira — soft watercolor blooms (warm light)
   ------------------------------------------------------------
   Like dawn but copper/amber/brown: large transparent radial motes on
   source-over blend so they show on the LIGHT sahira bg. Reads
   --rgb-hot / --rgb-gold. seed() sizes the motes; draw() drifts +
   wraps them each frame. The "persian warmth" mood.
   ============================================================ */
(function () {
  "use strict";
  const DSS = window.DSS, T = DSS.THEMES;
  const rgb = (v, f) => DSS.rgb(v, f);
  let motes = [];

  function seed() {
    const W = DSS.W, H = DSS.H;
    // count scales with area, capped at 46 so the pale bg never muddies
    const n = Math.min(46, Math.floor((W * H) / 30000));
    motes = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 120 + 50,                 // big soft blobs
      vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.14, // very slow drift
      a: Math.random() * 0.05 + 0.025,             // tiny alpha -> watercolor wash
      hue: Math.random(),                          // picks which copper tone below
    }));
  }

  function draw() {
    const ctx = DSS.ctx, W = DSS.W, H = DSS.H, mx = DSS.mx, my = DSS.my;
    ctx.clearRect(0, 0, W, H);
    // source-over (NOT additive): additive would wash out on a light bg
    ctx.globalCompositeOperation = "source-over";
    const copper = rgb("--rgb-hot", "176,106,51"),
          brown  = rgb("--rgb-cool2", "122,77,44"),
          amber  = rgb("--rgb-gold", "199,127,62");
    for (const m of motes) {
      // drift + mouse parallax
      m.x += m.vx + mx * 0.2; m.y += m.vy + my * 0.16;
      // wrap around edges (including the blob radius so it never pops)
      if (m.x < -m.r) m.x = W + m.r; if (m.x > W + m.r) m.x = -m.r;
      if (m.y < -m.r) m.y = H + m.r; if (m.y > H + m.r) m.y = -m.r;
      // two-thirds copper, then amber, then brown
      const col = m.hue < 0.5 ? copper : (m.hue < 0.8 ? amber : brown);
      // radial gradient: solid-ish center fading to transparent edge = bloom
      const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r);
      g.addColorStop(0, `rgba(${col},${m.a})`);
      g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); ctx.fill();
    }
  }
  T.sahira = { seed, draw };
})();
