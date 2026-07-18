/* THEME ANIMATION: sunset — constellation network */
(function () {
  "use strict";
  const DSS = window.DSS, T = DSS.THEMES;
  const rgb = (v, f) => DSS.rgb(v, f);
  let dots = [];
  function seed() {
    const W = DSS.W, H = DSS.H;
    const n = Math.min(90, Math.floor((W * H) / 18000));
    dots = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H, z: Math.random() * 0.8 + 0.2,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
    }));
  }
  function draw() {
    const ctx = DSS.ctx, W = DSS.W, H = DSS.H, mx = DSS.mx, my = DSS.my;
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
  T.sunset = { seed, draw };
})();
