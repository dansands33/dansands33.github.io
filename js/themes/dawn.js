/* ============================================================
   THEME ANIMATION: dawn (light) — silky curtains in a breeze
   ------------------------------------------------------------
   Long, overlapping cream "silk" veils that snake sideways as if
   caught in a draft. Each veil is a closed path spanning the full
   viewport height whose left/right edges are displaced by stacked
   sine waves (two harmonics) so the sheet billows rather than slides.
   A multi-stop horizontal gradient fakes a pleated fold: shaded
   shadow valleys -> near-white cream ridges -> shaded again, so the
   cloth reads as 3D volume on the pale dawn ground. Veils overlap
   with low alpha (source-over, NOT additive) so intersections glow
   like layered fabric.
   Reads --rgb-* only loosely; the silk tones are creamy off-whites
   (warm sand / cool pearl / mauve mist) kept just tinted enough to
   be visible against the #fbf3ea bg. seed() sizes the veil count;
   draw() paints one frame. Mouse parallax via DSS.mx. The "calm
   morning with curtains drifting" mood.
   ============================================================ */
(function () {
  "use strict";
  const DSS = window.DSS, T = DSS.THEMES;
  const TAU = Math.PI * 2;

  /* creamy silk tones — hi = ridge highlight (near pure white), sh = shadow
     valley (deeper, more saturated for fold definition), lo = mid fold */
  const TONES = [
    { hi: [255, 252, 248], sh: [196, 173, 146], lo: [224, 205, 180] }, // warm sand
    { hi: [252, 250, 246], sh: [186, 182, 199], lo: [215, 212, 226] }, // cool pearl
    { hi: [255, 251, 248], sh: [197, 173, 184], lo: [221, 201, 209] }, // mauve mist
  ];

  let veils = [];

  function seed() {
    const W = DSS.W, H = DSS.H;
    // 12..22 veils based on area — enough to layer, not so many it's busy
    const n = Math.max(12, Math.min(22, Math.floor((W * H) / 90000)));
    veils = Array.from({ length: n }, (_, i) => {
      const r = Math.random;
      const w = (0.34 + r() * 0.56) * W;                       // veil width (fraction of W)
      const x0 = -0.15 * W + (i / (n - 1)) * 1.30 * W;         // spread across + overflow both sides
      const k = 0.003 + r() * 0.006;                          // long vertical wavelength (1st harmonic)
      return {
        x0, w,
        amp: 42 + r() * 92, amp2: 0, k, k2: k * 1.7,          // 2nd harmonic = 1.7x freq, set below
        sp: 0.12 + r() * 0.26, sp2: 0,                        // wave speeds (2nd set below)
        ph: r() * TAU, ph2: r() * TAU,                        // random phase offsets
        tone: TONES[(Math.random() * TONES.length) | 0],
        a: 0.09 + r() * 0.10,                                 // low-ish alpha -> glow on overlap but visible
      };
    });
    // set second-harmonic amplitudes/speeds after creation (depends on amp)
    for (const v of veils) { v.amp2 = v.amp * 0.42; v.sp2 = v.sp * 0.8; }
  }

  // vertical displacement of a veil's edge at height y, time t.
  // Sum of two sine harmonics => the edge "billows" instead of sliding as one line.
  function wave(y, v, t) {
    return v.amp * Math.sin(y * v.k + t * v.sp + v.ph)
         + v.amp2 * Math.sin(y * v.k2 - t * v.sp2 + v.ph2);
  }

  function draw() {
    const ctx = DSS.ctx, W = DSS.W, H = DSS.H;
    const t = performance.now() * 0.001;
    const par = DSS.mx * 130;          // gentle mouse breeze (left/right)
    const myBreeze = DSS.my * 26;      // subtle vertical draft via mouse Y
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";

    const step = 26;                   // vertical sampling resolution for the veil path
    for (const v of veils) {
      const cx = v.x0 + par;           // veil center, shifted by mouse parallax
      const lt = v.tone;
      // horizontal gradient across the veil = fake pleated fold:
      // shadow valley -> cream ridge -> mid fold -> cream ridge -> mid -> shadow
      const g = ctx.createLinearGradient(cx - v.w / 2, 0, cx + v.w / 2, 0);
      const a = v.a;
      g.addColorStop(0.00, `rgba(${lt.sh[0]},${lt.sh[1]},${lt.sh[2]},${a * 0.95})`);
      g.addColorStop(0.20, `rgba(${lt.hi[0]},${lt.hi[1]},${lt.hi[2]},${a * 1.15})`);
      g.addColorStop(0.40, `rgba(${lt.lo[0]},${lt.lo[1]},${lt.lo[2]},${a * 0.95})`);
      g.addColorStop(0.60, `rgba(${lt.hi[0]},${lt.hi[1]},${lt.hi[2]},${a * 1.10})`);
      g.addColorStop(0.80, `rgba(${lt.lo[0]},${lt.lo[1]},${lt.lo[2]},${a * 0.85})`);
      g.addColorStop(1.00, `rgba(${lt.sh[0]},${lt.sh[1]},${lt.sh[2]},${a * 0.95})`);

      ctx.beginPath();
      // left edge top -> bottom
      let y = 0;
      ctx.moveTo(cx - v.w / 2 + wave(y, v, t) + myBreeze, y);
      for (y = step; y <= H; y += step) ctx.lineTo(cx - v.w / 2 + wave(y, v, t) + myBreeze, y);
      // right edge bottom -> top (closes the shape so it fills as a sheet)
      for (y = H; y >= 0; y -= step) ctx.lineTo(cx + v.w / 2 + wave(y, v, t) + myBreeze, y);
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
    }
  }

  T.dawn = { seed, draw };
})();
