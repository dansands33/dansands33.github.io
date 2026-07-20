/* ============================================================
   DAN SANDS // signal — shared.js (the runtime)
   ------------------------------------------------------------
   Boots the stage and owns everything shared:
     - window.DSS            the single global state bag
         DSS.canvas/DSS.ctx  the one <canvas#bg-field> 2D context
         DSS.W/DSS.H         viewport size (resized on load + resize)
         DSS.mx/DSS.my       normalized mouse parallax (-0.3..0.3)
         DSS.THEMES          registry filled by js/themes/*.js BEFORE this runs
     - the rAF loop          calls DSS.THEMES[mode].draw() + click sparks
     - i18n                  data-i18n fill + rotor (typed/erased subline)
     - selectors             EN/ES language + 7-theme palette (persisted)
     - contact modal         obfuscated email (reveal+click-to-copy), LinkedIn, GitHub
     - boot sequence         faux terminal, fades into #stage
     - title glitch          scramble-on-hover
   Loaded LAST so DSS.THEMES is already populated. Exploration-grade
   code: one canvas, one loop, themes just swap the paint.
   ============================================================ */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DSS = window.DSS = window.DSS || {};
  // theme animation registry — populated by js/themes/*.js before this runs
  DSS.THEMES = DSS.THEMES || {};

  /* ---------- shared state exposed to theme animations ---------- */
  const canvas = document.getElementById("bg-field");
  const ctx = canvas.getContext("2d");
  DSS.canvas = canvas; DSS.ctx = ctx;
  DSS.W = 0; DSS.H = 0; DSS.mx = 0; DSS.my = 0;
  DSS.lang = "en";
  DSS.rgb = (v, f) => (getComputedStyle(document.documentElement).getPropertyValue(v).trim() || f);
  const DEFAULT_THEME = "aurelius";   // opening theme for first-time visitors

  const content = DSS.content;
  let mode = DEFAULT_THEME;
  function resize() { DSS.W = canvas.width = innerWidth; DSS.H = canvas.height = innerHeight; }

  function reseed() { (DSS.THEMES[mode] || { seed(){} }).seed(); if (mode === "aurelius") ctx.clearRect(0, 0, DSS.W, DSS.H); }
  function loop() { (DSS.THEMES[mode] || { draw(){} }).draw(); drawSparks(); requestAnimationFrame(loop); }
  function setMode(m) { mode = m; ctx.clearRect(0, 0, DSS.W, DSS.H); reseed(); }
  function startField() {
    if (reduce) return;
    resize(); reseed(); loop();
    addEventListener("resize", () => { resize(); reseed(); });
    addEventListener("mousemove", (e) => { DSS.mx = (e.clientX / DSS.W - 0.5) * 0.6; DSS.my = (e.clientY / DSS.H - 0.5) * 0.6; });
  }
  DSS.setMode = setMode;

  /* ---------- i18n ---------- */
  let lang = "en";
  let phrases = content.I18N[lang].phrases;
  function applyLang(l) {
    lang = content.I18N[l] ? l : "en";
    DSS.lang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (content.I18N[lang][key]) el.textContent = content.I18N[lang][key];
    });
    document.querySelectorAll(".lang-btn").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    phrases = content.I18N[lang].phrases;
    restartRotor();
    try { localStorage.setItem("dss-lang", lang); } catch (_) {}
  }

  /* ---------- rotating subline ---------- */
  const rotor = document.getElementById("rotor");
  let rotorTimer = null;   // most recently scheduled timeout (immediate cleanup hook)
  let rotorGen = 0;        // generation token — invalidates stale loops after a lang switch
  function typeLoop() {
    if (reduce) { rotor.textContent = phrases[phrases.length - 1]; return; }
    const gen = ++rotorGen;                  // this run's generation
    const alive = () => gen === rotorGen;    // true only while this loop is the current one
    let pi = 0;
    const show = (t) => { if (alive()) rotor.textContent = t; };
    function typePhrase() {
      if (!alive()) return;
      const txt = phrases[pi]; let ci = 0;
      (function type() {
        if (!alive()) return;
        show(txt.slice(0, ci));
        if (ci < txt.length) { ci++; rotorTimer = setTimeout(type, 34); }
        else { rotorTimer = setTimeout(erase, 2200); }
      })();
      function erase() {
        if (!alive()) return;
        (function del() {
          if (!alive()) return;
          ci--;
          show(txt.slice(0, Math.max(ci, 0)));
          if (ci > 0) { rotorTimer = setTimeout(del, 16); }
          else { show(""); pi = (pi + 1) % phrases.length; rotorTimer = setTimeout(typePhrase, 320); }
        })();
      }
    }
    typePhrase();
  }
  function restartRotor() {
    rotorGen++;                              // invalidate any in-flight loop from the old language
    if (rotorTimer) clearTimeout(rotorTimer);
    rotor.textContent = "";
    typeLoop();
  }

  /* ---------- clock ---------- */
  function tickClock() {
    const el = document.getElementById("clock");
    if (!el) return;
    el.textContent = new Date().toISOString().slice(11, 19) + " UTC";
  }
  setInterval(tickClock, 1000); tickClock();
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- boot sequence ---------- */
  const bootEl = document.getElementById("boot");
  const bootText = document.getElementById("boot-text");
  const stage = document.getElementById("stage");
  const bootLines = [
    "> initializing signal…",
    "> loading identity :: DAN.SANDS",
    "> mounting HUD ................ <span class='ok'>ok</span>",
    "> privacy shield :: no-trackers <span class='ok'>ok</span>",
    "> parallax field :: <span class='ok'>online</span>",
    "> decrypting mission ......... <span class='ok'>done</span>",
    "> <span class='warn'>welcome, operator.</span>",
  ];
  function runBoot() {
    if (reduce) { bootEl.classList.add("hidden"); stage.classList.remove("hidden"); return; }
    let i = 0, buf = "";
    (function next() {
      if (i >= bootLines.length) {
        setTimeout(() => {
          bootEl.style.transition = "opacity .5s ease";
          bootEl.style.opacity = "0";
          setTimeout(() => { bootEl.classList.add("hidden"); stage.classList.remove("hidden"); }, 500);
        }, 420);
        return;
      }
      buf += bootLines[i] + "\n";
      bootText.innerHTML = buf;
      i++;
      setTimeout(next, 260 + Math.random() * 180);
    })();
  }

  /* ---------- title glitch on hover ---------- */
  const titleLine = document.querySelector(".title .line");
  if (titleLine && !reduce) {
    const original = titleLine.textContent;
    const glyphs = "!<>-_\\/[]{}—=+*^?#________";
    titleLine.addEventListener("mouseenter", () => {
      let frame = 0; const total = 14;
      const iv = setInterval(() => {
        titleLine.textContent = original.split("").map((ch, i) => {
          if (ch === " ") return " ";
          return frame > i ? original[i] : glyphs[Math.floor(Math.random() * glyphs.length)];
        }).join("");
        frame++;
        if (frame > total) { clearInterval(iv); titleLine.textContent = original; }
      }, 30);
    });
  }

  /* ---------- contact modal ---------- */
  function buildModal() {
    const modal = document.createElement("div");
    modal.id = "contact-modal";
    modal.innerHTML = `
      <div class="modal-card" role="dialog" aria-modal="true" aria-label="Contact channels">
        <button class="modal-close" aria-label="close">✕</button>
        <h2>Open a channel</h2>
        <p class="sub">// work + online only · no phone · privacy-first</p>
        <a class="chan" id="email-chan" href="#"><span class="ico">✉</span> <span id="email-text">reveal email</span> <small>click to copy</small></a>
        <a class="chan" href="${content.LINKS.linkedin}" target="_blank" rel="noopener noreferrer"><span class="ico">in</span> LinkedIn <small>DanDataDrivenDreamer</small></a>
        <a class="chan" href="${content.LINKS.github}" target="_blank" rel="noopener noreferrer"><span class="ico">⌥</span> GitHub <small>@dansands33</small></a>
        <div id="copy-toast"></div>
      </div>`;
    document.body.appendChild(modal);
    const close = () => modal.classList.remove("open");
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    modal.querySelector(".modal-close").addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    const emailChan = modal.querySelector("#email-chan");
    const emailText = modal.querySelector("#email-text");
    const toast = modal.querySelector("#copy-toast");
    let revealed = false;
    emailChan.addEventListener("click", (e) => {
      e.preventDefault();
      const addr = content.email();
      if (!revealed) { emailText.textContent = addr; emailChan.href = "mailto:" + addr; revealed = true; return; }
      navigator.clipboard?.writeText(addr).then(() => {
        toast.textContent = "copied ✓ — or click again to open mail";
        setTimeout(() => (toast.textContent = ""), 2600);
      });
    });
    return modal;
  }
  const modal = buildModal();
  document.getElementById("contact-btn").addEventListener("click", (e) => {
    e.preventDefault(); modal.classList.add("open");
  });

  /* ---------- palette selector (persisted, order from HTML) ---------- */
  const swatches = document.querySelectorAll(".swatch");
  const crestEl = document.querySelector(".ascii-crest");
  function setCrest(name) {
    if (crestEl && DSS.content.CRESTS[name]) crestEl.textContent = DSS.content.CRESTS[name].join("\n");
  }
  function applyTheme(name) {
    const known = [...swatches].map((s) => s.dataset.set);
    if (!known.includes(name)) name = "sunset";
    document.documentElement.setAttribute("data-theme", name);
    swatches.forEach((s) => s.setAttribute("aria-pressed", String(s.dataset.set === name)));
    setCrest(name);
    if (typeof setMode === "function") setMode(name);
    try { localStorage.setItem("dss-theme", name); } catch (_) {}
  }
  swatches.forEach((s) => s.addEventListener("click", () => applyTheme(s.dataset.set)));
  // once the .txt crests finish loading, re-render the current theme from file
  if (DSS.content.CRESTS_READY) DSS.content.CRESTS_READY.then(() => setCrest(document.documentElement.getAttribute("data-theme")));

  /* ---------- language selector (persisted, default EN) ---------- */
  const langBtns = document.querySelectorAll(".lang-btn");
  langBtns.forEach((b) => b.addEventListener("click", () => applyLang(b.dataset.lang)));

  /* ---------- click sparks (drawn by loop) ---------- */
  let sparks = [];
  function burstSparks(x, y) {
    if (reduce) return;
    const gold = DSS.rgb("--rgb-gold", "255,210,63"), hot = DSS.rgb("--rgb-hot", "255,106,31");
    for (let i = 0; i < 14; i++) {
      const ang = Math.random() * Math.PI * 2, sp = Math.random() * 4 + 1.5;
      sparks.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 1, life: 1, col: Math.random() < 0.5 ? gold : hot });
    }
  }
  function drawSparks() {
    if (!sparks.length) return;
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    for (const p of sparks) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.vx *= 0.97; p.life -= 0.035;
      if (p.life <= 0) continue;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2 * p.life + 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col},${p.life})`;
      ctx.shadowBlur = 8; ctx.shadowColor = `rgba(${p.col},${p.life})`; ctx.fill();
    }
    ctx.restore();
    sparks = sparks.filter((p) => p.life > 0);
  }
  document.querySelectorAll(".btn, .swatch").forEach((el) => {
    el.addEventListener("click", (e) => burstSparks(e.clientX, e.clientY));
  });

  /* ---------- go ---------- */
  let savedLang = "en"; try { savedLang = localStorage.getItem("dss-lang") || "en"; } catch (_) {}
  applyLang(savedLang);
  let savedTheme = DEFAULT_THEME; try { savedTheme = localStorage.getItem("dss-theme") || DEFAULT_THEME; } catch (_) {}
  applyTheme(savedTheme);   // also seeds the canvas for the saved theme
  runBoot();
  startField();
  // NOTE: the rotor is started by applyLang()→restartRotor() above, so do NOT start a
  // second loop here — doing so made two competing loops write to #rotor at once.
})();
