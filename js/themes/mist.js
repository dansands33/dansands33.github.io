/* THEME ANIMATION: mist (Misty Forest) — top-down ASCII forest + a fixed gentle river */
(function () {
  "use strict";
  const DSS = window.DSS, T = DSS.THEMES;
  const rgb = (v, f) => DSS.rgb(v, f);
  let fog = [], trees = [], ripples = [];
  // half-width scaled by viewport AREA (√W·H) instead of width alone, so the
  // channel stays readable on tall/narrow (mobile) viewports where W-based
  // scaling collapsed it to a hairline. ≈77px on 1080p, ≈31px on a phone.
  const RIVER_HW = () => Math.sqrt(DSS.W * DSS.H) * 0.053;
  function mainY(x) { return DSS.H * 0.14 + Math.sin(x * 2 * Math.PI / DSS.W) * DSS.H * 0.13; }
  function inRiver(x, y, clear = 0) { return Math.abs(y - mainY(x)) <= RIVER_HW() + clear; }
  const TREE = "^";
  function seed() {
    const W = DSS.W, H = DSS.H;
    fog = Array.from({ length: 11 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H, r: Math.random() * 240 + 160,
      vx: (Math.random() - 0.5) * 0.308, vy: (Math.random() - 0.5) * 0.198,
      a: (i < 7 ? Math.random() * 0.08 + 0.10 : Math.random() * 0.05 + 0.04),
    }));
    const step = 26;
    trees = [];
    for (let y = step / 2; y < H; y += step)
      for (let x = step / 2; x < W; x += step) {
        if (inRiver(x, y, 32)) continue;
        trees.push({ x: x + (Math.random() - 0.5) * 8, y: y + (Math.random() - 0.5) * 8, s: Math.random() * 0.5 + 0.8, tone: Math.random() });
      }
    ripples = Array.from({ length: Math.ceil(W / 52) }, () => ({
      x: Math.random() * W, phase: Math.random() * Math.PI * 2, sp: 0.2 + Math.random() * 0.25,
      vf: (Math.random() * 2 - 1) * 0.7,
    }));
  }
  function draw() {
    const ctx = DSS.ctx, W = DSS.W, H = DSS.H, mx = DSS.mx, my = DSS.my;
    ctx.clearRect(0, 0, W, H);
    const blue = rgb("--rgb-cool", "143,208,230"), green = rgb("--rgb-cool2", "63,122,88");
    ctx.textAlign = "center"; ctx.font = `15px "JetBrains Mono", monospace`;
    const t = performance.now() * 0.0016;
    const hw = RIVER_HW();
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
        ctx.fillStyle = `rgba(${blue},0.10)`;
        ctx.fillText(bankGlyph(x, fn), x, yc - half);
        ctx.fillText(bankGlyph(x, fn), x, yc + half);
      }
    };
    drawBanks(mainY, hw);
    for (const rp of ripples) {
      rp.x += rp.sp; if (rp.x > W + 10) rp.x = -10;
      const yc = mainY(rp.x) + rp.vf * hw;
      const a = 0.10 + 0.14 * (0.5 + 0.5 * Math.sin(rp.phase + t * 1.4));
      ctx.fillStyle = `rgba(${blue},${a})`;
      ctx.fillText("~", rp.x, yc);
    }
    for (const tr of trees) {
      const x = tr.x, y = tr.y;
      const col = tr.tone < 0.5 ? green : "79,174,109";
      ctx.fillStyle = `rgba(${col},${0.06 + tr.s * 0.10})`;
      ctx.font = `${Math.round(13 * tr.s)}px "JetBrains Mono", monospace`;
      ctx.fillText(TREE, x, y);
    }
    ctx.textAlign = "start"; ctx.font = "";
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
  T.mist = { seed, draw };
})();
