/* ============================================================
   THEME ANIMATION: starfield (Ad Astra) — parallax space scene
   ------------------------------------------------------------
   Twinkling parallax stars + faint constellation links, plus
   periodically launched rockets (with glowing additive trails) and
   shooting stars. Reads --rgb-cool (links) / --rgb-hot (exhaust).
   seed() sizes the starfield + arms the rocket/shooter timers;
   draw() advances everything each frame. The most "alive" theme.
   ============================================================ */
(function () {
  "use strict";
  const DSS = window.DSS, T = DSS.THEMES;
  const rgb = (v, f) => DSS.rgb(v, f);
  let stars = [], rocket = null, rocketTimer = 0, shooter = null, shooterTimer = 0;

  function seed() {
    const W = DSS.W, H = DSS.H;
    const n = Math.min(220, Math.floor((W * H) / 7000));   // density capped for perf
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      z: Math.random() * 0.9 + 0.1,                        // depth: drives parallax + brightness
      tw: Math.random() * Math.PI * 2,                     // twinkle phase
      tws: Math.random() * 0.05 + 0.01,                    // twinkle speed
    }));
    // arm the launchers with a random head-start so they don't fire in sync
    rocket = null; rocketTimer = 180 + Math.random() * 240;
    shooter = null; shooterTimer = 120 + Math.random() * 200;
  }

  // spawn a rocket off one side, aimed up-and-across the screen
  function launchRocket() {
    const W = DSS.W, H = DSS.H;
    const fromLeft = Math.random() < 0.5;
    const y = Math.random() * H * 0.6 + H * 0.1;          // upper-ish band
    rocket = {
      x: fromLeft ? -40 : W + 40, y,
      vx: (fromLeft ? 1 : -1) * (Math.random() * 2 + 3.2), // horizontal speed + direction
      vy: -(Math.random() * 0.8 + 0.3),                    // always climbing
      trail: [],
    };
  }

  // spawn a shooting star off one side, much faster than a rocket
  function launchShooter() {
    const W = DSS.W, H = DSS.H;
    const fromLeft = Math.random() < 0.5;
    const y = Math.random() * H * 0.7 + H * 0.05;
    shooter = {
      x: fromLeft ? -20 : W + 20, y,
      vx: (fromLeft ? 1 : -1) * (Math.random() * 6 + 9),  // fast streak
      vy: (Math.random() - 0.5) * 1.2,                     // slight vertical drift
      tail: 26,                                            // streak length (px)
    };
  }

  function draw() {
    const ctx = DSS.ctx, W = DSS.W, H = DSS.H, mx = DSS.mx, my = DSS.my;
    ctx.clearRect(0, 0, W, H);
    const cool = rgb("--rgb-cool", "111,168,255");
    ctx.lineWidth = 0.5;

    // --- constellation links (only between near, non-far stars; O(n^2)) ---
    for (let i = 0; i < stars.length; i++) {
      const a = stars[i]; if (a.z < 0.6) continue;        // skip far stars for the link pass
      for (let j = i + 1; j < stars.length; j++) {
        const b = stars[j]; if (b.z < 0.6) continue;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 90) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${cool},${(1 - d / 90) * 0.07})`; ctx.stroke(); }
      }
    }

    // --- stars: parallax drift + twinkle + cross "sparkle" on the nearest ---
    for (const s of stars) {
      s.x += mx * s.z * 1.2; s.y += my * s.z * 1.2; s.tw += s.tws;  // parallax scales with depth z
      if (s.x < 0) s.x += W; if (s.x > W) s.x -= W;                  // wrap
      if (s.y < 0) s.y += H; if (s.y > H) s.y -= H;
      const a = 0.4 + Math.sin(s.tw) * 0.35, r = s.z * 1.6;         // brightness oscillates; near = bigger
      ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(235,240,255,${a})`; ctx.fill();
      if (s.z > 0.75) {                                             // only the nearest stars get a sparkle cross
        ctx.strokeStyle = `rgba(235,240,255,${a * 0.5})`; ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(s.x - r * 3, s.y); ctx.lineTo(s.x + r * 3, s.y);
        ctx.moveTo(s.x, s.y - r * 3); ctx.lineTo(s.x, s.y + r * 3); ctx.stroke();
      }
    }

    // --- rocket (if active): move, record + draw fading additive trail, draw body ---
    if (rocket) {
      rocket.x += rocket.vx; rocket.y += rocket.vy;
      rocket.trail.push({ x: rocket.x, y: rocket.y, life: 1 });
      if (rocket.trail.length > 40) rocket.trail.shift();   // cap trail length
      ctx.save(); ctx.globalCompositeOperation = "lighter"; // additive = glowing exhaust
      const hot = rgb("--rgb-hot", "255,138,61");
      for (const t of rocket.trail) {
        t.life -= 0.025; if (t.life <= 0) continue;         // age each trail point
        const col = t.life > 0.6 ? "255,240,180" : hot;     // hot white near the head, orange further back
        ctx.beginPath(); ctx.arc(t.x, t.y, 4 * t.life + 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},${t.life * 0.8})`;
        ctx.shadowBlur = 12; ctx.shadowColor = `rgba(${hot},${t.life})`; ctx.fill();
      }
      ctx.restore();
      // draw the rocket body as a rotated "▲" pointing along its velocity
      const ang = Math.atan2(rocket.vy, rocket.vx);
      const nx = rocket.x + Math.cos(ang) * 11, ny = rocket.y + Math.sin(ang) * 11; // tip ahead of the trail
      ctx.save();
      ctx.translate(nx, ny); ctx.rotate(ang + Math.PI / 2);  // ▲ points up by default; align to motion
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = '20px "JetBrains Mono", monospace';
      ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillText("▲", 0, 0);   // dark outline
      ctx.fillStyle = "rgba(245,248,255,1)"; ctx.fillText("▲", 0, 0); // bright body
      ctx.restore();
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      if (rocket.x < -60 || rocket.x > W + 60 || rocket.y < -60) rocket = null; // off-screen -> retire
    } else if (--rocketTimer <= 0) {                       // no rocket -> count down to next launch
      launchRocket(); rocketTimer = 260 + Math.random() * 360;
    }

    // --- shooting star (if active): fast streak with a gradient tail ---
    if (shooter) {
      shooter.x += shooter.vx; shooter.y += shooter.vy;
      const tx = shooter.x - shooter.vx * 2.4, ty = shooter.y - shooter.vy * 2.4; // tail end = behind motion
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      const g = ctx.createLinearGradient(shooter.x, shooter.y, tx, ty);
      g.addColorStop(0, "rgba(220,230,255,0.9)"); g.addColorStop(1, "rgba(220,230,255,0)"); // bright head -> clear tail
      ctx.strokeStyle = g; ctx.lineWidth = 1; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(shooter.x, shooter.y); ctx.lineTo(tx, ty); ctx.stroke();
      ctx.fillStyle = "rgba(240,245,255,0.95)"; ctx.beginPath();
      ctx.arc(shooter.x, shooter.y, 1.4, 0, Math.PI * 2); ctx.fill();   // bright head dot
      ctx.restore();
      if (shooter.x < -30 || shooter.x > W + 30) shooter = null;       // off-screen -> retire
    } else if (--shooterTimer <= 0) {                      // no shooter -> count down to next launch
      launchShooter(); shooterTimer = 160 + Math.random() * 280;
    }
  }
  T.starfield = { seed, draw };
})();
