/* THEME ANIMATION: starfield (Ad Astra) — parallax stars + constellation + rockets + shooting stars */
(function () {
  "use strict";
  const DSS = window.DSS, T = DSS.THEMES;
  const rgb = (v, f) => DSS.rgb(v, f);
  let stars = [], rocket = null, rocketTimer = 0, shooter = null, shooterTimer = 0;
  function seed() {
    const W = DSS.W, H = DSS.H;
    const n = Math.min(220, Math.floor((W * H) / 7000));
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      z: Math.random() * 0.9 + 0.1,
      tw: Math.random() * Math.PI * 2,
      tws: Math.random() * 0.05 + 0.01,
    }));
    rocket = null; rocketTimer = 180 + Math.random() * 240;
    shooter = null; shooterTimer = 120 + Math.random() * 200;
  }
  function launchRocket() {
    const W = DSS.W, H = DSS.H;
    const fromLeft = Math.random() < 0.5;
    const y = Math.random() * H * 0.6 + H * 0.1;
    rocket = {
      x: fromLeft ? -40 : W + 40, y,
      vx: (fromLeft ? 1 : -1) * (Math.random() * 2 + 3.2),
      vy: -(Math.random() * 0.8 + 0.3), trail: [],
    };
  }
  function launchShooter() {
    const W = DSS.W, H = DSS.H;
    const fromLeft = Math.random() < 0.5;
    const y = Math.random() * H * 0.7 + H * 0.05;
    shooter = {
      x: fromLeft ? -20 : W + 20, y,
      vx: (fromLeft ? 1 : -1) * (Math.random() * 6 + 9),
      vy: (Math.random() - 0.5) * 1.2, tail: 26,
    };
  }
  function draw() {
    const ctx = DSS.ctx, W = DSS.W, H = DSS.H, mx = DSS.mx, my = DSS.my;
    ctx.clearRect(0, 0, W, H);
    const cool = rgb("--rgb-cool", "111,168,255");
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
    for (const s of stars) {
      s.x += mx * s.z * 1.2; s.y += my * s.z * 1.2; s.tw += s.tws;
      if (s.x < 0) s.x += W; if (s.x > W) s.x -= W; if (s.y < 0) s.y += H; if (s.y > H) s.y -= H;
      const a = 0.4 + Math.sin(s.tw) * 0.35, r = s.z * 1.6;
      ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(235,240,255,${a})`; ctx.fill();
      if (s.z > 0.75) {
        ctx.strokeStyle = `rgba(235,240,255,${a * 0.5})`; ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(s.x - r * 3, s.y); ctx.lineTo(s.x + r * 3, s.y);
        ctx.moveTo(s.x, s.y - r * 3); ctx.lineTo(s.x, s.y + r * 3); ctx.stroke();
      }
    }
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
      const ang = Math.atan2(rocket.vy, rocket.vx);
      const nx = rocket.x + Math.cos(ang) * 11, ny = rocket.y + Math.sin(ang) * 11;
      ctx.save();
      ctx.translate(nx, ny); ctx.rotate(ang + Math.PI / 2);
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = '20px "JetBrains Mono", monospace';
      ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillText("▲", 0, 0);
      ctx.fillStyle = "rgba(245,248,255,1)"; ctx.fillText("▲", 0, 0);
      ctx.restore();
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      if (rocket.x < -60 || rocket.x > W + 60 || rocket.y < -60) rocket = null;
    } else if (--rocketTimer <= 0) {
      launchRocket(); rocketTimer = 260 + Math.random() * 360;
    }
    if (shooter) {
      shooter.x += shooter.vx; shooter.y += shooter.vy;
      const tx = shooter.x - shooter.vx * 2.4, ty = shooter.y - shooter.vy * 2.4;
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
  T.starfield = { seed, draw };
})();
