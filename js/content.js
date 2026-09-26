/* ============================================================
   DAN SANDS // signal — content.js (data module)
   ------------------------------------------------------------
   Defines window.DSS + DSS.THEMES (primed empty; js/themes/*.js
   fill it) and exposes window.DSS.content for the runtime:
     - I18N            EN/ES hero copy + rotating #rotor phrases
     - RAIN_LINES(_ES) aurelius "chapters" text (drifts down in canvas)
     - CRESTS          ASCII art loaded from css/themes/<name>.txt
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
      exp_eyebrow: "career record // 2014—now",
      exp_title: "Experience",
      exp_lede: "I connect product intent with engineering delivery—bringing structure to complex work, building reliable systems, and helping teams move with clarity.",
      exp_snapshot: "Career snapshot",
      exp_selected_work: "Selected experience",
      exp_scope: "Scope",
      exp_impact: "Impact",
      exp_approach: "How I work",
      exp_approach_copy: "I start by making the work visible: clarify the goal, surface risks, and give people a shared path to delivery. Then I improve the workflow around the team—using automation and AI where they remove real friction, with quality and usability built in.",
      exp_contact_title: "Have a complex delivery problem?",
      exp_contact_copy: "Let’s talk about making the work clearer and the systems stronger.",
      exp_contact: "Connect on LinkedIn",
      exp_resume: "Download resume (PDF)",
      exp_home: "Back to home",
      exp_nav_home: "Home",
      exp_nav_more: "More",
      exp_role_current_title: "Engineering Project Manager",
      exp_role_manager_title: "Software Engineering Manager",
      exp_role_qa_team_leader: "Quality Assurance Team Leader",
      exp_role_qa_associate_manager: "Quality Assurance Associate Manager",
      exp_role_qa_manager_title: "Quality Assurance Manager",
      exp_global_label: "Global",
      exp_role_bsa_title: "Business Systems Analyst (Co-op)",
      exp_qa_team_leader_period: "Sep 2020—Jan 2021 · 4 months",
      exp_qa_associate_period: "Jan 2021—Jul 2021 · 6 months",
      exp_qa_manager_period: "Jul 2021—Feb 2024",
      exp_bsa_period: "Sep 2023—Dec 2023 · 4-month co-op · concurrent with QA Manager role",
      exp_bsa_snapshot: "Venturit · Sep 2023—Dec 2023",
      exp_qa_team_leader_snapshot: "Venturit · Sep 2020—Jan 2021",
      exp_qa_associate_snapshot: "Venturit · Jan 2021—Jul 2021",
      exp_qa_manager_snapshot: "Venturit · Jul 2021—Feb 2024",
      exp_qa_progression_note: "Career progression: Promoted from QA Team Leader to Associate Manager, then Quality Assurance Manager with global team responsibility.",
      exp_qa_team_leader_summary: "Joined to strengthen client relationships and establish Venturit’s Eastern QA team. Recruited and trained engineers, improved QA processes, and carried out manual testing and release approvals.",
      exp_qa_team_leader_impact: "Improved requirement gathering and QA methods, strengthened sprint-progress metrics, and earned positive feedback from demanding clients during the first months.",
      exp_qa_associate_summary: "Promoted in January 2021 to continue growing the team, report to senior leadership, and coordinate quality work with developers, product owners, and engineering managers.",
      exp_qa_associate_impact: "Introduced ISTQB-aligned standards, improved documentation and confidentiality practices, recruited and mentored 6 engineers across Eastern and Western time zones, and delivered automation and Jira/Xray improvements across 5 projects.",
      exp_qa_manager_summary: "Led QA across the company, managing the team across 3 time zones and reporting directly to the C-suite.",
      exp_qa_manager_impact: "Managed and mentored 16+ onshore and offshore engineers across multiple projects; allocated resources across 5+ projects; opened Venturit’s Canadian QA branch and hired 5 engineers; strengthened privacy, reporting, automation, and release controls.",
      exp_bsa_summary: "Completed a four-month Business Systems Analyst co-op focused on data governance, integrity, and compliance across client departments.",
      exp_bsa_impact: "Reported 229+ anomalies across 8 business systems, surfaced accounting-related legal and financial risks, and delivered weekly dashboard reports with actionable insights. Clients recognized the contribution to their 2023 and 2024 financial goals.",
      exp_role_founder_title: "Digital Services Manager / Founder",
      exp_role_monitor_title: "Programming Monitor",
      exp_location_remote: "Canada · Colombia · Remote",
      exp_location_cali: "Cali, Colombia · On-site",
      exp_location_icesi: "Valle del Cauca, Colombia",
      exp_present: "Present",
      exp_role_current_scope: "Leads engineering delivery, product operations, software quality, workflow improvement, and cross-functional execution.",
      exp_role_current_impact: "Turns ambiguous requirements and delivery risks into execution plans, documented workflows, and dependable product outcomes; builds automation frameworks and tests across manual, API, and performance layers.",
      exp_role_manager_scope: "Led additional engineering teams while retaining QA leadership, and supported team operations across Canada and Colombia.",
      exp_role_manager_impact: "Improved resource allocation and security practices, led client proposals, and recovered projects facing management constraints or development issues.",
      exp_role_founder_scope: "Founded and ran a digital-services business spanning design, software development, and marketing.",
      exp_role_founder_impact: "Built brand identities, websites, sales funnels, and business models for 3 companies; automated quoting and assembled project teams for clients in Colombia and Mexico.",
      exp_role_monitor_scope: "Supported Interactive Media Design and Industrial Design students learning programming.",
      exp_role_monitor_impact: "Tutored algorithms, HCI, web development, Arduino, and IoT through in-class and extracurricular learning.",
      exp_education: "Education",
      exp_education_1: "Business Insights & Analytics · Humber College · 2022–2023 · Dean’s Honour List · GPA 89%",
      exp_education_2: "Interactive Media Design · Icesi University · 2013–2019 · Cum Laude · GPA 87%",
      exp_education_3: "Telematics Engineering · Icesi University · 2014–2017",
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
      exp_eyebrow: "trayectoria // 2014—hoy",
      exp_title: "Experiencia",
      exp_lede: "Conecto la intención del producto con la entrega de ingeniería: doy estructura al trabajo complejo, construyo sistemas confiables y ayudo a los equipos a avanzar con claridad.",
      exp_snapshot: "Trayectoria en breve",
      exp_selected_work: "Experiencia destacada",
      exp_scope: "Alcance",
      exp_impact: "Impacto",
      exp_approach: "Cómo trabajo",
      exp_approach_copy: "Empiezo haciendo visible el trabajo: aclaro el objetivo, expongo los riesgos y doy al equipo un camino compartido hacia la entrega. Después mejoro el flujo alrededor del equipo, usando automatización e IA cuando eliminan fricción real, con calidad y usabilidad desde el inicio.",
      exp_contact_title: "¿Tienes un reto complejo de entrega?",
      exp_contact_copy: "Conversemos sobre cómo hacer el trabajo más claro y los sistemas más sólidos.",
      exp_contact: "Conectar en LinkedIn",
      exp_resume: "Descargar hoja de vida (PDF)",
      exp_home: "Volver al inicio",
      exp_nav_home: "Inicio",
      exp_nav_more: "Más",
      exp_role_current_title: "Gerente de Proyecto de Ingeniería",
      exp_role_manager_title: "Gerente de Ingeniería de Software",
      exp_role_qa_team_leader: "Líder del Equipo de Aseguramiento de Calidad",
      exp_role_qa_associate_manager: "Gerente Asociado de Aseguramiento de Calidad",
      exp_role_qa_manager_title: "Gerente de Aseguramiento de Calidad",
      exp_global_label: "Global",
      exp_role_bsa_title: "Analista de Sistemas de Negocio (práctica co-op)",
      exp_qa_team_leader_period: "Sep. 2020—ene. 2021 · 4 meses",
      exp_qa_associate_period: "Ene. 2021—jul. 2021 · 6 meses",
      exp_qa_manager_period: "Jul. 2021—feb. 2024",
      exp_bsa_period: "Sep. 2023—dic. 2023 · práctica co-op de 4 meses · en paralelo al rol de QA Manager",
      exp_bsa_snapshot: "Venturit · sep. 2023—dic. 2023",
      exp_qa_team_leader_snapshot: "Venturit · sep. 2020—ene. 2021",
      exp_qa_associate_snapshot: "Venturit · ene. 2021—jul. 2021",
      exp_qa_manager_snapshot: "Venturit · jul. 2021—feb. 2024",
      exp_qa_progression_note: "Progresión profesional: Ascendió de Líder del Equipo de Aseguramiento de Calidad a Gerente Asociado y luego a Gerente de Aseguramiento de Calidad con responsabilidad global sobre el equipo.",
      exp_qa_team_leader_summary: "Ingresó para fortalecer las relaciones con clientes y establecer el equipo de QA de Venturit en la zona Este. Reclutó y capacitó ingenieros, mejoró procesos de QA y realizó pruebas manuales y aprobaciones de releases.",
      exp_qa_team_leader_impact: "Mejoró el levantamiento de requisitos y los métodos de QA, fortaleció las métricas de avance de sprints y recibió comentarios positivos de clientes exigentes durante los primeros meses.",
      exp_qa_associate_summary: "Fue promovido en enero de 2021 para seguir haciendo crecer el equipo, reportar a la alta gerencia y coordinar la calidad con desarrolladores, product owners y gerentes de ingeniería.",
      exp_qa_associate_impact: "Introdujo estándares alineados con ISTQB, mejoró la documentación y la gestión de información confidencial, reclutó y mentoró a 6 ingenieros en las zonas Este y Oeste e impulsó la automatización y mejoras de Jira/Xray en 5 proyectos.",
      exp_qa_manager_summary: "Lideró QA en toda la empresa, gestionó al equipo en 3 zonas horarias y reportó directamente a la alta dirección ejecutiva.",
      exp_qa_manager_impact: "Gestionó y mentoró a más de 16 ingenieros onshore y offshore en varios proyectos; asignó recursos en más de 5 proyectos; abrió la sede de QA de Venturit en Canadá y contrató a 5 ingenieros; fortaleció la privacidad, los reportes, la automatización y los controles de release.",
      exp_bsa_summary: "Realizó una práctica co-op de cuatro meses como Analista de Sistemas de Negocio, enfocada en gobierno e integridad de datos y cumplimiento entre áreas de clientes.",
      exp_bsa_impact: "Reportó más de 229 anomalías en 8 sistemas de negocio, detectó riesgos legales y financieros asociados a cálculos contables y entregó reportes semanales con dashboards e información accionable. Los clientes reconocieron su aporte a sus metas financieras de 2023 y 2024.",
      exp_role_founder_title: "Gerente de Servicios Digitales / Fundador",
      exp_role_monitor_title: "Monitor de Programación",
      exp_location_remote: "Canadá · Colombia · Remoto",
      exp_location_cali: "Cali, Colombia · Presencial",
      exp_location_icesi: "Valle del Cauca, Colombia",
      exp_present: "Presente",
      exp_role_current_scope: "Lidera la entrega de ingeniería, las operaciones de producto, la calidad de software, la mejora de flujos y la ejecución interfuncional.",
      exp_role_current_impact: "Convierte requisitos ambiguos y riesgos de entrega en planes de ejecución, flujos documentados y resultados confiables; construye frameworks de automatización y realiza pruebas manuales, de API y de rendimiento.",
      exp_role_manager_scope: "Amplió el liderazgo a más equipos de ingeniería mientras mantenía el liderazgo de QA y apoyaba las operaciones entre Canadá y Colombia.",
      exp_role_manager_impact: "Mejoró la asignación de recursos y las prácticas de seguridad, lideró propuestas para clientes y recuperó proyectos con restricciones de gestión o imprevistos de desarrollo.",
      exp_role_founder_scope: "Fundó y dirigió un negocio de servicios digitales de diseño, desarrollo de software y marketing.",
      exp_role_founder_impact: "Creó identidades de marca, sitios web, embudos de venta y modelos de negocio para 3 empresas; automatizó cotizaciones y formó equipos por proyecto para clientes en Colombia y México.",
      exp_role_monitor_scope: "Apoyó a estudiantes de Diseño de Medios Interactivos y Diseño Industrial en su aprendizaje de programación.",
      exp_role_monitor_impact: "Enseñó algoritmos, HCI, desarrollo web, Arduino e IoT en espacios curriculares y extracurriculares.",
      exp_education: "Formación",
      exp_education_1: "Business Insights & Analytics · Humber College · 2022–2023 · Dean’s Honour List · GPA 89%",
      exp_education_2: "Diseño de Medios Interactivos · Universidad Icesi · 2013–2019 · Cum Laude · GPA 87%",
      exp_education_3: "Ingeniería Telemática · Universidad Icesi · 2014–2017",
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

  // ---------- per-theme hero crests (loaded from CSS-adjacent text files) ----------
  const CREST_FILES = ["aurelius", "starfield", "forge", "mist", "sunset", "dawn", "sahira"];
  const CRESTS = Object.create(null);


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
  // The text files are authoritative. Reject missing/empty files instead of
  // showing stale inline art or silently hiding deployment problems.
  const content = window.DSS.content;
  const CRESTS_READY = Promise.all(
    CREST_FILES.map((name) =>
      fetch(`css/themes/${name}.txt`)
        .then((response) => {
          if (!response.ok) throw new Error(`Could not load ${name} crest (${response.status})`);
          return response.text();
        })
        .then((text) => {
          const normalized = text.replace(/\r\n/g, "\n").replace(/\n+$/, "");
          if (!normalized) throw new Error(`Crest file for ${name} is empty`);
          content.CRESTS[name] = normalized.split("\n");
        })
    )
  );
  window.DSS.content.CRESTS_READY = CRESTS_READY;
})();
