/* THEME ANIMATION: aurelius — slow "chapters being written" (sentences drift down) */
(function () {
  "use strict";
  const DSS = window.DSS, T = DSS.THEMES;
  const rgb = (v, f) => DSS.rgb(v, f);
  let cols = [], fsize = 15;
  function spawnCol(init) {
    const W = DSS.W, H = DSS.H;
    const set = (DSS.lang === "es") ? DSS.content.RAIN_LINES_ES : DSS.content.RAIN_LINES;
    const line = set[(Math.random() * set.length) | 0];
    return {
      y: init ? Math.random() * -H : -40 - Math.random() * 200,
      sp: Math.random() * 0.06 + 0.03,
      line, head: -3,
    };
  }
  function seed() {
    const W = DSS.W;
    fsize = 15; const n = Math.ceil(W / (fsize * 1.6));
    cols = Array.from({ length: n }, () => spawnCol(true));
  }
  function draw() {
    const ctx = DSS.ctx, W = DSS.W, H = DSS.H, mx = DSS.mx;
    ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, W, H);
    ctx.font = `${fsize}px "JetBrains Mono", monospace`;
    const gold = rgb("--rgb-gold", "232,195,104");
    for (let i = 0; i < cols.length; i++) {
      const c = cols[i], x = i * fsize * 1.6 + mx * 2;
      c.y += fsize * c.sp;
      if (Math.random() < 0.10) c.head += 1;
      const len = c.line.length;
      for (let k = 0; k < len; k++) {
        const ch = c.line[k]; if (ch === " ") continue;
        const py = c.y + k * fsize;
        let col = "rgba(26,26,26,0.9)";
        const d = c.head - k;
        if (d === 0)            col = `rgba(${gold},0.95)`;
        else if (d === 1)       col = `rgba(${gold},0.55)`;
        else if (d === 2)       col = "rgba(200,205,215,0.7)";
        ctx.fillStyle = col;
        ctx.fillText(ch, x, py);
      }
      if (c.head > len + 3 && c.y - len * fsize > H + 40) cols[i] = spawnCol(false);
    }
  }
  T.aurelius = { seed, draw };
})();
