/* THEME ANIMATION: dawn — soft slow-drifting light motes (calm morning) */
(function () {
  "use strict";
  const DSS = window.DSS, T = DSS.THEMES;
  const rgb = (v, f) => DSS.rgb(v, f);
  let motes = [];
  function seed() {
    const W = DSS.W, H = DSS.H;
    const n = Math.min(60, Math.floor((W * H) / 26000));
    motes = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: Math.random() * 22 + 8,
      vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.1,
      a: Math.random() * 0.05 + 0.02, hue: Math.random(),
    }));
  }
  function draw() {
    const ctx = DSS.ctx, W = DSS.W, H = DSS.H, mx = DSS.mx, my = DSS.my;
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
  T.dawn = { seed, draw };
})();
