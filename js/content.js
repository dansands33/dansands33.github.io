/* ============================================================
   DAN SANDS // signal — content.js (data module)
   ------------------------------------------------------------
   Defines window.DSS + DSS.THEMES (primed empty; js/themes/*.js
   fill it) and exposes window.DSS.content for the runtime:
     - I18N            EN/ES hero copy + rotating #rotor phrases
     - RAIN_LINES(_ES) aurelius "chapters" text (drifts down in canvas)
     - CRESTS          inline ASCII hero crests (per-theme) — instant
                       fallback; overridden by css/themes/<name>.txt once
                       those fetch (see CRESTS_READY below)
     - EMAIL_PARTS     email split to dodge scrapers (joined at runtime)
     - LINKS           LinkedIn / GitHub URLs
   Also kicks off the async fetch of the generated crest .txt files.
   This is content only — no DOM, no canvas. (Exploration phase 01.)
   ============================================================ */
(function () {
  "use strict";
  window.DSS = window.DSS || {};
  // theme-animation registry — populated by js/themes/*.js, read by shared.js
  window.DSS.THEMES = window.DSS.THEMES || {};

  // ---------- i18n (hero copy + rotating subline) ----------
  const I18N = {
    en: {
      eyebrow: "incoming transmission",
      tagline_pre: "I help teams turn",
      tagline_hot: "chaos",
      tagline_mid: "into",
      tagline_cool: "clear, working systems",
      open_channel: "open channel",
      wip_pre: "this signal is under construction",
      wip_post: "phase 01 of many.",
      phrases: [
        "product operations · ai workflows · internal tools",
        "8+ years turning ambiguity into roadmaps",
        "distributed teams · latam ⇄ north america",
        "quality, clarity, and momentum — by design",
        "how could I help you?",
      ],
    },
    es: {
      eyebrow: "transmisión entrante",
      tagline_pre: "Ayudo a equipos a convertir",
      tagline_hot: "el caos",
      tagline_mid: "en",
      tagline_cool: "sistemas claros y funcionales",
      open_channel: "abrir canal",
      wip_pre: "esta señal está en construcción",
      wip_post: "fase 01 de varias.",
      phrases: [
        "operaciones de producto · flujos de ia · herramientas internas",
        "8+ años convirtiendo ambigüedad en hojas de ruta",
        "equipos distribuidos · latam ⇄ norteamérica",
        "calidad, claridad y momentum — por diseño",
        "¿cómo podría ayudarte?",
      ],
    },
  };

  // ---------- theme-specific copy ----------
  // aurelius shows slow-falling "chapters" of who I am; visible text only.
  const RAIN_LINES = [
    "clarity is a kindness",
    "ship small, learn fast",
    "the best system is the one people actually use",
    "i turn chaos into clear working systems",
    "distributed teams across latam and north america",
    "ai should remove friction, not add theater",
    "listen first, build second",
    "momentum beats perfection",
    "bridging tech and the humans it serves",
    "every roadmap is a story we agree to tell",
    "quality is not a phase, it is a stance",
    "lead with context, not control",
  ];
  const RAIN_LINES_ES = [
    "la claridad es una amabilidad",
    "entrega pequeño, aprende rápido",
    "el mejor sistema es el que la gente usa",
    "convierto el caos en sistemas claros",
    "equipos distribuidos por latam y norteamérica",
    "la ia debe quitar fricción, no poner teatro",
    "escucha primero, construye después",
    "el momentum vence a la perfección",
    "unir la tecnología con quien la usa",
    "cada roadmap es una historia que acordamos",
    "la calidad no es una fase, es una postura",
    "lidera con contexto, no con control",
  ];

  // ---------- contact channels (email assembled at runtime; never in HTML source) ----------
  const EMAIL_PARTS = ["DanSands", ".Pro", "@", "gmail", ".", "com"];
  const LINKS = {
    linkedin: "https://www.linkedin.com/in/DanDataDrivenDreamer",
    github:   "https://github.com/dansands33",
  };

  // ---------- per-theme hero crests (a unique ASCII icon per theme) ----------
  const CRESTS = {
    // aurelius — Greek head / classical bust
    aurelius: [
      "      .-\"\"\"\"-.",
      "     /  .--.  \\",
      "    |  | () |  |",
      "    |   \\__/   |",
      "     \\        /",
      "    __\\'    '/__",
      "   /  _      _  \\",
      "  |  (_)    (_)  |",
      "   \\   '----'   /",
      "    '----------'",
    ],
    // starfield (Ad Astra) — astronaut helmet
    starfield: [
      "       .------.",
      "      /  .--.  \\",
      "     |  /    \\  |",
      "     | |  /\\  | |",
      "     | | (  ) | |",
      "     |  \\    /  |",
      "      \\  '--'  /",
      "       '------'",
      "        |    |",
    ],
    // forge — shield with crossed swords
    forge: [
      "        \\     /",
      "         \\   /",
      "       ---(+)",
      "         /   \\",
      "        /     \\",
      "       /_____\\",
      "      |         |",
      "      |  .---.  |",
      "      | (     ) |",
      "      |  '---'  |",
      "       \\_______/",
    ],
    // mist (Misty Forest) — a stand of pines
    mist: [
      "        /\\      /\\",
      "       /  \\    /  \\",
      "      /    \\  /    \\",
      "     /  /\\  \\/  /\\  \\",
      "    /  /  \\    /  \\  \\",
      "   /__/    \\  /    \\__\\",
      "  |  |      \\/      |  |",
      "  \\__/                \\__/",
      "     |        |        |",
      "     |        |        |",
    ],
    // sunset — cyberpunk sun on the horizon
    sunset: [
      "        .   .   .",
      "      _ ___________ _",
      "     / \\___________/ \\",
      "    |  .  .   .  .  |",
      "    | .   .   .   . |",
      "     \\__ _ _ _ _ __/",
      "    ~~~~~  ~~~~  ~~~~",
      "   --  --  --  --  --",
    ],
    // dawn — cup of coffee with steam
    dawn: [
      "         )  (  )",
      "        (    )",
      "       .-\"\"\"\"\"\"-.",
      "      /  ______  \\",
      "     |  /      \\  |",
      "     | |  ~~~~  | |",
      "     |  \\______/  |",
      "      \\________/",
      "       |      |",
      "       |______|",
    ],
    // sahira — persian cat (white · brown · copper)
    sahira: [
      "                /\\        /\\",
      "               /  \\      /  \\",
      "              /    \\    /    \\",
      "             |      \\  /      |",
      "             |       \\/       |",
      "              \\      ||      /",
      "               \\  _  ||  _  /",
      "                \\/ \\ || / \\/",
      "               /     ||     \\",
      "              |  .------.   |",
      "              | /  /\\   \\   |",
      "              | \\ (  )  /   |",
      "               \\  \\____/    /",
      "                \\   ||    /",
      "                 \\  ||   /",
      "                  \\ ||  /",
      "                   \\|| /",
      "                    \\/",
      "        /\\          /    \\          /\\",
      "       /  \\        /      \\        /  \\",
      "      | () |      |        |      | () |",
      "       \\__/        \\      /        \\__/",
      "                    \\____/",
    ],
  };

  window.DSS.content = {
    I18N,
    RAIN_LINES,
    RAIN_LINES_ES,
    CRESTS,
    EMAIL_PARTS,
    LINKS,
    email: () => EMAIL_PARTS.join(""),
  };

  // ---------- load per-theme ASCII crests from css/themes/<name>.txt ----------
  // Inline CRESTS above is the synchronous fallback (renders instantly); once the
  // .txt files load we override each entry with the file's exact contents.
  const content = window.DSS.content;
  const CREST_FILES = ["aurelius","starfield","forge","mist","sunset","dawn","sahira"];
  const CRESTS_READY = Promise.all(
    CREST_FILES.map((name) =>
      fetch(`css/themes/${name}.txt`)
        .then((r) => (r.ok ? r.text() : Promise.reject()))
        .then((txt) => { content.CRESTS[name] = txt.replace(/\r\n/g, "\n").replace(/\n+$/,"").split("\n"); })
        .catch(() => { /* keep inline fallback for this theme */ })
    )
  );
  window.DSS.content.CRESTS_READY = CRESTS_READY;
})();
