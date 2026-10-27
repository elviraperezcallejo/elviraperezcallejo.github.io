/*
  EVENTS: everything that appears in "Talks & posters", "Journey" and "Organization".
  One entry per event or trip. If you attended AND gave a talk/poster AND organised it,
  it is still ONE entry.

  Fields
    id        short unique slug (used in links: journey.html#id)
    start     "YYYY-MM-DD" (or "YYYY-MM" / "YYYY" if the exact day is unknown)
    end       optional, last day
    name      event name (name_es: Spanish version, only if it should change)
    url       event web page
    city      must exist in PLACES below (for the map)    online: true if online
    kind      "event" (default) | "seminar" | "stay" | "milestone" | "outreach"
    talks     [{ type: "talk"|"poster", title, date, session?, sessionUrl?, tag? }]
              A talk with a date in the future appears as "Coming soon" and moves
              to the list of given talks by itself once the date has passed.
    org       if you organised it: { role, role_es, session?, with? }
    folder    photo folder (or single photo) of the journey photos
              (run the update script afterwards to generate the web copies)
    cover     file name of the cover photo, lower-case, without extension,
              spaces/dots as "-" (default: first photo)
    photoLink page with the official photos of the event (if we have none)
    credit    for downloaded official photos (files named "oficial-..." in the folder):
              { text, url, license?, licenseUrl? }, shown under the photos
    note      short text shown in Journey (note_es: Spanish version)
*/

window.PLACES = {
  "Valladolid": [41.6523, -4.7245, "Spain"],
  "Castellón de la Plana": [39.9864, -0.0513, "Spain"],
  "Madrid": [40.4168, -3.7038, "Spain"],
  "San Lorenzo de El Escorial": [40.5914, -4.1474, "Spain"],
  "Barcelona": [41.3874, 2.1686, "Spain"],
  "Ciudad Real": [38.9848, -3.9274, "Spain"],
  "Lille": [50.6292, 3.0573, "France"],
  "Sevilla": [37.3891, -5.9845, "Spain"],
  "Morelia": [19.7060, -101.1950, "Mexico"],
  "Bilbao": [43.2630, -2.9350, "Spain"],
  "León": [42.5987, -5.5671, "Spain"],
  "San Cristóbal de La Laguna": [28.4874, -16.3159, "Spain"],
  "Jaca": [42.5700, -0.5490, "Spain"],
  "Granada": [37.1773, -3.5986, "Spain"],
  "Pamplona": [42.8125, -1.6458, "Spain"],
  "Badajoz": [38.8794, -6.9707, "Spain"],
  "Valencia": [39.4699, -0.3763, "Spain"],
  "Marseille": [43.2316, 5.4386, "France"],
  "Basel": [47.5596, 7.5886, "Switzerland"],
  "Oberwolfach": [48.3297, 8.2236, "Germany"],
  "Alicante": [38.3452, -0.4810, "Spain"],
  "Trento": [46.0748, 11.1217, "Italy"],
  "Zaragoza": [41.6488, -0.8891, "Spain"],
  "Jerez de la Frontera": [36.6850, -6.1261, "Spain"]
};

// Seminars I organise (shown under "Organization"; `end` empty = ongoing)
window.ORGANIZED_SEMINARS = [
  { start: "2024-10-15", name: "Seminario de Geometría Algebraica y Singularidades (GAS)",
    url: "http://www.singacom.uva.es/ES/SeminarGAS.php", city: "Valladolid",
    note: "Monthly seminar of the SINGACOM group, Universidad de Valladolid.",
    note_es: "Seminario mensual del grupo SINGACOM, Universidad de Valladolid." }
];

window.EVENTS = [
  // ---------------------------------------------------------------- 2019-2020
  { id: "2019-graduation", kind: "milestone", start: "2019-07", city: "Valladolid",
    name: "Graduation — Degree in Mathematics, Universidad de Valladolid",
    name_es: "Graduación — Grado en Matemáticas, Universidad de Valladolid",
    note: "Final degree project: “Descomposición de ideales monomiales vía grafos y complejos simpliciales”.",
    note_es: "Trabajo de Fin de Grado: «Descomposición de ideales monomiales vía grafos y complejos simpliciales».",
    folder: "2019 - tfg", cover: "img-20190706-wa0013" },

  { id: "2020-eaca-school", start: "2020-02-27", end: "2020-02-28", city: "Bilbao",
    name: "5th EACA International School on Computer Algebra and its Applications (BCAM)",
    url: "https://www.bcamath.org/en/5th-eaca-international-school-computer-algebra-and-its-applications",
    folder: "2020 - 02 - eaca" },

  { id: "2020-master", kind: "milestone", start: "2020-07", city: "Valladolid",
    name: "Master’s thesis defence — Universidad de Valladolid",
    name_es: "Defensa del Trabajo de Fin de Máster — Universidad de Valladolid",
    note: "“Diagramas de Betti de ideales de aristas” (defended online).",
    note_es: "«Diagramas de Betti de ideales de aristas» (defensa online).",
    folder: "2020 - 07 -tfm" },

  { id: "2020-phd", kind: "milestone", start: "2020-10", city: "Castellón de la Plana",
    name: "Starting my PhD at Universitat Jaume I",
    name_es: "Empiezo el doctorado en la Universitat Jaume I",
    folder: "2020 -10 -phd start", cover: "img-20201013-wa0003" },

  // ---------------------------------------------------------------- 2021
  { id: "2021-imuva", kind: "stay", start: "2021-01-18", end: "2021-03-05", city: "Valladolid",
    name: "Research stay at IMUVa, Universidad de Valladolid",
    name_es: "Estancia de investigación en el IMUVa, Universidad de Valladolid",
    note: "Working with Philippe Gimenez and Félix Delgado.",
    note_es: "Trabajando con Philippe Gimenez y Félix Delgado." },

  { id: "2021-inlaplana5", start: "2021-01-20", end: "2021-01-21", city: "Castellón de la Plana", online: true,
    name: "Fifth Mini-Workshop IMAC-SINGACOM in La Plana: Research topics in algebraic geometry and singularities",
    url: "https://www.commalg.uji.es/2021/index.html",
    org: { role: "Co-organizer", role_es: "Coorganizadora" },
    talks: [{ type: "talk", date: "2021-01-20", title: "First integrals of foliations on Hirzebruch surfaces" }] },

  { id: "2021-imac-seminar", kind: "seminar", start: "2021-10-19", city: "Castellón de la Plana",
    name: "Seminario IMAC sobre Estructuras Algebraicas y teoría de códigos correctores de errores",
    url: "https://www.uji.es/institucional/estructura/instituts/imac/base/activitats/seminaris/seminariestructuresalgebraiques/",
    talks: [{ type: "talk", date: "2021-10-19", title: "Necessary conditions for algebraic integrability of plane foliations" }] },

  { id: "2021-iberosing", start: "2021-10-27", city: "Madrid", online: true,
    name: "Iberoamerican Webinar of Young Researchers in Singularity Theory and related topics — Sesión especial de doctorandos IberoSing",
    url: "https://eventos.ucm.es/72976/detail/",
    talks: [{ type: "talk", date: "2021-10-27", title: "Necessary conditions for algebraic integrability of plane foliations" }],
    folder: "2021 - 10 - iberosing" },

  { id: "2021-jjdga", start: "2021-11-04", end: "2021-11-05", city: "Barcelona",
    name: "Jornadas de Jóvenes Doctores en Geometría Algebraica" },

  { id: "2021-imac-day", start: "2021-12-14", city: "Castellón de la Plana", online: true,
    name: "Fifth IMAC and Singacom Day on Algebraic Applications to Information Theory" },

  { id: "2021-gas", kind: "seminar", start: "2021-12-17", city: "Valladolid",
    name: "Seminario de Geometría Algebraica y Singularidades (GAS)",
    url: "http://www.singacom.uva.es/ES/SeminarGAS.php?Curso=2021",
    talks: [{ type: "talk", date: "2021-12-17", tag: "invited",
              title: "Study of the algebraic integrability of plane foliations by their extension to Hirzebruch surfaces" }] },

  // ---------------------------------------------------------------- 2022
  { id: "2022-imuva", kind: "stay", start: "2022-01-10", end: "2022-01-14", city: "Valladolid",
    name: "Research stay at IMUVa, Universidad de Valladolid",
    name_es: "Estancia de investigación en el IMUVa, Universidad de Valladolid",
    note: "Working with Carlos-Jesús Moreno-Ávila.",
    note_es: "Trabajando con Carlos-Jesús Moreno-Ávila." },

  { id: "2022-rsme", start: "2022-01-17", end: "2022-01-21", city: "Ciudad Real",
    name: "Congreso Bienal de la Real Sociedad Matemática Española (RSME 2022)" },

  { id: "2022-lille", kind: "stay", start: "2022-03-21", end: "2022-06-22", city: "Lille",
    name: "Research stay at the Laboratoire Paul Painlevé, Université de Lille",
    name_es: "Estancia de investigación en el Laboratoire Paul Painlevé, Université de Lille",
    note: "International stay for the PhD, hosted by Patrick Popescu-Pampu. Two talks at the Séminaire Géométrie des espaces singuliers.",
    note_es: "Estancia internacional del doctorado, con Patrick Popescu-Pampu. Dos charlas en el Séminaire Géométrie des espaces singuliers.",
    url: "https://pro.univ-lille.fr/patrick-popescu-pampu/responsabilites/",
    talks: [
      { type: "talk", date: "2022-03-22", tag: "invited", session: "Séminaire Géométrie des espaces singuliers",
        title: "Extension to Hirzebruch surfaces of plane foliations to study algebraic integrability" },
      { type: "talk", date: "2022-05-31", tag: "invited", session: "Séminaire Géométrie des espaces singuliers",
        title: "Introduction to Betti numbers of monomial ideals. Implementation of Taylor’s resolution and a pruning algorithm on it" }],
    folder: "2022 -lille" },

  { id: "2022-eaca", start: "2022-06-20", end: "2022-06-22", city: "Castellón de la Plana",
    name: "XVII Encuentro de Álgebra Computacional y Aplicaciones (EACA 2022)",
    url: "https://www.fue.uji.es/eaca2022",
    org: { role: "Organizing collaborator", role_es: "Colaboradora en la organización" },
    talks: [{ type: "talk", date: "2022-06-20", title: "Pruning algorithm of Taylor’s resolution, an implementation" }],
    folder: "2022 - 06 - eaca" },

  { id: "2022-8imm", start: "2022-10-05", city: "Sevilla",
    name: "8th Iberian Mathematical Meeting",
    url: "https://congreso.us.es/sevilla8imm/",
    talks: [{ type: "poster", date: "2022-10-05",
              title: "Extension to Hirzebruch surfaces of planar polynomial vector fields. A necessary condition for their algebraic integrability" }],
    folder: "2022 - 10 - sevilla" },

  { id: "2022-iberosing", start: "2022-10-24", end: "2022-10-27", city: "Madrid",
    name: "IberoSing International Workshop 2022",
    url: "https://eventos.ucm.es/86046/detail/iberosing-international-workshop-2022.html",
    talks: [{ type: "talk", date: "2022-10-26", title: "Algebraic integrability of given genus" }],
    folder: "2022 - 10 - iberosing", cover: "group-photo" },

  { id: "2022-morelia", start: "2022-11-25", city: "Morelia", online: true,
    name: "One Day on Algebraic Geometry. Graphs Algebra and Combinatorics",
    url: "https://sites.google.com/umich.mx/lahyane-aggacom25112022/forward",
    talks: [{ type: "talk", date: "2022-11-25",
              title: "Computing rational first integrals with fixed genus of foliations on Hirzebruch surfaces" }] },

  { id: "2022-morelia-2", start: "2022-12-08", end: "2022-12-09", city: "Morelia", online: true,
    name: "Workshop “Commutative Algebra, Algebraic Geometry and Related Topics”" },

  { id: "2022-inlaplana6", start: "2022-12-15", end: "2022-12-16", city: "Castellón de la Plana",
    name: "Sixth Mini-Workshop IMAC-SINGACOM in La Plana: Research topics in Singularities and Algebraic geometry",
    org: { role: "Co-organizer", role_es: "Coorganizadora" } },

  // ---------------------------------------------------------------- 2023
  { id: "2023-imuva", kind: "stay", start: "2023-01-09", end: "2023-02-10", city: "Valladolid",
    name: "Research stay at IMUVa, Universidad de Valladolid",
    name_es: "Estancia de investigación en el IMUVa, Universidad de Valladolid",
    note: "Hosted by Philippe Gimenez.", note_es: "Con Philippe Gimenez.",
    talks: [{ type: "talk", date: "2023-02-03", tag: "invited",
              session: "Seminario de Geometría Algebraica y Singularidades (GAS)",
              sessionUrl: "http://www.singacom.uva.es/ES/SeminarGAS.php?Curso=2022",
              title: "Computation of a rational first integral of given genus of a foliation on a Hirzebruch surface" }] },

  { id: "2023-rgas", start: "2023-01-10", end: "2023-01-13", city: "Bilbao",
    name: "7th annual Meeting of the Spanish Network for Algebraic Geometry and Singularity Theory (BCAM)",
    url: "https://sites.google.com/bcamath.org/rgasmeeting/home",
    talks: [{ type: "talk", date: "2023-01-10",
              title: "Algebraic integrability of foliations on Hirzebruch surfaces: An algorithm for the existence and computation of rational first integrals of fixed genus" }] },

  { id: "2023-rsme-jovenes", start: "2023-02-06", end: "2023-02-10", city: "León",
    name: "VI Congreso de Jóvenes Investigadores de la RSME",
    url: "https://rsmejovenes23.unileon.es/",
    folder: "2023 - 02 - leon rsme jovenes",
    credit: { text: "Real Sociedad Matemática Española", url: "https://rsme.es/impulso-a-la-carrera-cientifica-en-el-vi-congreso-de-jovenes-investigadores/" },
    talks: [{ type: "talk", date: "2023-02-07", session: "Teoría de Singularidades",
              title: "Study of algebraic integrability of foliations on Hirzebruch surfaces. An algorithm of computation depending on the genus" }] },

  { id: "2023-minisimposio", start: "2023-02-22", city: "San Cristóbal de La Laguna",
    name: "Minisimposio Iberoamericano de Álgebra, Geometría Algebraica y Singularidades" },

  { id: "2023-jaca", start: "2023-06-12", end: "2023-06-16", city: "Jaca",
    name: "115AM — Algebraic and topological interplay of algebraic varieties",
    url: "https://riemann.unizar.es/115AM/registration.html",
    talks: [{ type: "poster", date: "2023-06-12",
              title: "Some algorithms for computing a rational first integral of foliations on Hirzebruch surfaces" }],
    folder: "2023 - 06 - jaca", cover: "whatsapp-image-2024-07-10-at-13-03-04" },

  { id: "2023-imuva-2", kind: "stay", start: "2023-09-29", end: "2023-10-30", city: "Valladolid",
    name: "Research stay at IMUVa, Universidad de Valladolid",
    name_es: "Estancia de investigación en el IMUVa, Universidad de Valladolid",
    note: "Hosted by Diego Ruano (SINGACOM).", note_es: "Con Diego Ruano (SINGACOM).",
    talks: [{ type: "talk", date: "2023-10-20", tag: "invited",
              session: "Seminario de Geometría Algebraica y Singularidades (GAS)",
              sessionUrl: "http://www.singacom.uva.es/ES/SeminarGAS.php?Curso=2023",
              title: "Rational first integrals of polynomial foliations and asymptotic approach to bounded negativity on rational surfaces" }] },

  { id: "2023-jorge", start: "2023-10-30", end: "2023-10-31", city: "Barcelona",
    name: "JORGE II — Jornadas de Jóvenes Doctores en Geometría Algebraica II",
    url: "https://www.ub.edu/grega/JORGE-II/index.html",
    talks: [{ type: "talk", date: "2023-10-30",
              title: "Algebraic integrability of planar polynomial vector fields and bounded negativity on rational surfaces" }] },

  { id: "2023-iberosing", start: "2023-11-06", end: "2023-11-10", city: "Granada",
    name: "IberoSing International Workshop 2023: Mirror symmetry & Hodge ideals",
    url: "https://iberosing.github.io/IW23/",
    talks: [{ type: "poster", date: "2023-11-06",
              title: "New algorithms for algebraic integrability of foliations on Hirzebruch surfaces" }],
    folder: "2023 - 11 - iberosing" },

  { id: "2023-inlaplana7", start: "2023-11-30", end: "2023-12-01", city: "Castellón de la Plana",
    name: "Seventh Mini-Workshop IMAC-SINGACOM in La Plana: Topics in singularities and algebraic geometry",
    url: "https://www.commalg.uji.es/2023/index.html",
    org: { role: "Co-organizer", role_es: "Coorganizadora" },
    talks: [{ type: "talk", date: "2023-11-30", tag: "invited",
              title: "A lower bound on the degree of curves of the projective plane with prescribed multiplicities" }] },

  { id: "2023-phd-defence", kind: "milestone", start: "2023-12-21", city: "Castellón de la Plana",
    name: "PhD defence (international mention) — Universitat Jaume I",
    name_es: "Defensa de la tesis doctoral (mención internacional) — Universitat Jaume I",
    note: "“Algebraic integrability of foliations by extension to Hirzebruch surfaces. Applications to bounded negativity”, supervised by Carlos Galindo and Francisco Monserrat.",
    note_es: "«Algebraic integrability of foliations by extension to Hirzebruch surfaces. Applications to bounded negativity», dirigida por Carlos Galindo y Francisco Monserrat.",
    url: "https://www.tdx.cat/handle/10803/689627" },

  // ---------------------------------------------------------------- 2024
  { id: "2024-imuva", kind: "stay", start: "2024-01-08", end: "2024-01-29", city: "Valladolid",
    name: "Research stay at IMUVa, Universidad de Valladolid",
    name_es: "Estancia de investigación en el IMUVa, Universidad de Valladolid",
    note: "Hosted by Diego Ruano (SINGACOM).", note_es: "Con Diego Ruano (SINGACOM)." },

  { id: "2024-rsme", start: "2024-01-22", end: "2024-01-26", city: "Pamplona",
    name: "Congreso Bienal de la Real Sociedad Matemática Española (RSME 2024)",
    url: "https://2024.bienalrsme.com/",
    talks: [{ type: "talk", date: "2024-01-22", session: "Álgebra Computacional y Aplicaciones",
              title: "An algorithm to compute rational first integrals of polynomial foliations" }],
    folder: "2024-01-Pamplona RSME" },

  { id: "2024-rtns", start: "2024-01-29", city: "Badajoz",
    name: "Recent Trends in Nonlinear Sciences 2024",
    url: "https://eventos.unex.es/104172/detail/rtns-recent-trends-in-nonlinear-science.html",
    talks: [{ type: "poster", date: "2024-01-29",
              title: "Computation of rational first integrals of polynomial foliations by means of algebraic geometry" }] },

  { id: "2023-cangur", kind: "outreach", start: "2023",
    name: "Cangur — Mathematical Kangaroo", name_es: "Cangur — Canguro Matemático",
    folder: "2023-cangur.jpg" },

  { id: "2024-cangur", kind: "outreach", start: "2024",
    name: "Cangur — Mathematical Kangaroo", name_es: "Cangur — Canguro Matemático",
    folder: "2024-cangur.jpg" },

  { id: "2024-probemos", kind: "outreach", start: "2024-04-24", city: "Castellón de la Plana",
    name: "Coloquio Probemos (IMAC, Universitat Jaume I)",
    url: "https://www.uji.es/institucional/estructura/instituts/imac/base/activitats/conferencies/",
    talks: [{ type: "talk", date: "2024-04-24",
              title: "EXPLOTA EXPLÓTAME EXPLÓ: Introducción a la resolución de singularidades" }] },

  { id: "2024-minisimposio", start: "2024-06-06", end: "2024-06-07", city: "San Cristóbal de La Laguna",
    name: "II Minisimposio Iberoamericano de Álgebra, Geometría Algebraica y Singularidades",
    folder: "2024 - 06 canarias" },

  { id: "2024-eaca", start: "2024-06-24", end: "2024-06-26", city: "San Lorenzo de El Escorial",
    name: "XVIII Meeting on Computer Algebra and Applications (EACA 2024)",
    url: "https://eventos.ucm.es/104844/detail/eaca2024.html",
    talks: [{ type: "talk", date: "2024-06-24", title: "Exploring the dicritical configurations of extended planar foliations" }],
    folder: "2024 - 06 - eaca" },

  { id: "2024-rsme-smm", start: "2024-07-01", end: "2024-07-05", city: "Valencia",
    name: "VI Encuentro Conjunto RSME-SMM",
    url: "https://rsme-smm-vi.webs.upv.es/",
    folder: "2024 - 07 - valencia rsme-smm",
    credit: { text: "Real Sociedad Matemática Española", url: "https://rsme.es/el-cimat-de-merida-mexico-albergara-el-vii-encuentro-conjunto-rsme-smm/" },
    talks: [
      { type: "talk", date: "2024-07-01",
        title: "Estudio de la integrabilidad algebraica de foliaciones planas a través de su extensión a superficies de Hirzebruch" },
      { type: "poster", date: "2024-07-01", title: "Integrabilidad algebraica de foliaciones polinómicas" }] },

  { id: "2024-end-of-year", kind: "milestone", start: "2024-07-17",
    name: "End of the 2023/24 academic year", name_es: "Fin del curso 2023/24",
    folder: "2024 - 07 - Fin Curso" },

  { id: "2024-worksing", start: "2024-07-21", end: "2024-07-26", city: "Valencia",
    name: "18th International Workshop on Real and Complex Singularities" },

  { id: "2024-matsi", start: "2024-10-15", end: "2024-10-16", city: "Castellón de la Plana",
    name: "MatSI, IMAC and Singacom Day on Algebraic Applications to Information Theory",
    url: "https://codingtheory.uji.es/2024/",
    org: { role: "Organizing committee", role_es: "Comité organizador" } },

  { id: "2024-iberosing", start: "2024-11-25", end: "2024-11-29", city: "Madrid",
    name: "IberoSing International Workshop 2024",
    url: "https://iberosing.github.io/IW24/",
    folder: "2024 - 11 - iberosing",
    credit: { text: "IberoSing 2024 organisers", url: "https://iberosing.github.io/IW24/sections/participants.html" } },

  // ---------------------------------------------------------------- 2025
  { id: "2025-rsme-jovenes", start: "2025-01-13", end: "2025-01-17", city: "Bilbao",
    name: "VII Congreso de Jóvenes Investigadores de la RSME",
    url: "https://jovenes2025.rsme.es/",
    org: { role: "Session organizer", role_es: "Organizadora de sesión",
           session: "AL05: Applied Nonlinear Algebra", with: "Carles Checa, Rodrigo Iglesias, Pablo Mazón" },
    talks: [
      { type: "talk", date: "2025-01-14", session: "Combinatorial Algebra and Geometry",
        sessionUrl: "https://jovenes2025.rsme.es/paralelaOT02.html",
        title: "Some results on bounded negativity conjecture" },
      { type: "talk", date: "2025-01-16", session: "Singularity Theory",
        sessionUrl: "https://jovenes2025.rsme.es/paralelaAL07.html",
        title: "Foliations with a given set of singular points" }] },

  { id: "2025-cirm", start: "2025-02-03", end: "2025-02-07", city: "Marseille",
    name: "Foliations, birational geometry and applications (CIRM) — Thematic month “Singularities, differential equations, transcendence”",
    url: "https://conferences.cirm-math.fr/3268.html",
    talks: [{ type: "poster", date: "2025-02-03", title: "Bounded negativity on rational surfaces" }],
    folder: "2025 - 02 - Marsella" },

  { id: "2025-minisimposio", start: "2025-03-13", end: "2025-03-14", city: "San Cristóbal de La Laguna",
    name: "III Minisimposio Iberoamericano de Álgebra, Geometría Algebraica y Singularidades",
    url: "https://gasiull.webs.ull.es/web-Minisimposio-2025/index.html",
    talks: [{ type: "talk", date: "2025-03-14", tag: "invited", title: "Sobre la negatividad acotada" }] },

  { id: "2025-singacom", start: "2025-09-02", end: "2025-09-05", city: "Granada",
    name: "Encuentro SINGACOM 2025",
    url: "http://www.singacom.uva.es/EncuentroUGR2025/",
    folder: "2025 - 09 - granada singacom",
    credit: { text: "SINGACOM 2025 organisers", url: "http://www.singacom.uva.es/EncuentroUGR2025/" },
    talks: [{ type: "talk", date: "2025-09-03", title: "Computing rational first integrals under some constraints" }] },

  { id: "2025-inlaplana8", start: "2025-11-13", end: "2025-11-14", city: "Castellón de la Plana",
    name: "Eighth Mini-Workshop IMAC-SINGACOM in La Plana: Current directions in Singularities and Algebraic geometry",
    org: { role: "Co-organizer", role_es: "Coorganizadora" } },

  { id: "2025-basel", kind: "stay", start: "2025-11-17", end: "2025-11-21", city: "Basel",
    name: "Research stay at the Universität Basel",
    name_es: "Estancia de investigación en la Universität Basel",
    note: "Working with Susanna Zimmermann.", note_es: "Trabajando con Susanna Zimmermann.",
    talks: [{ type: "talk", date: "2025-11-18", tag: "invited",
              session: "Seminar Algebra und Geometrie, Universität Basel",
              sessionUrl: "https://dmi.unibas.ch/en/news-events/past-events/detail/seminar-algebra-and-geometry-elvira-perez-callejo-universidad-de-valladolid/",
              title: "Calculation of polynomial first integrals of genus g≠1 in plane foliations" }] },

  { id: "2025-oberwolfach", start: "2025-12-07", end: "2025-12-12", city: "Oberwolfach",
    name: "Oberwolfach Mini-Workshop “Algebraic Foliations: Analytic and Birational Viewpoint”",
    note: "Invited participant.", note_es: "Participante invitada.",
    folder: "2025 - 12 - oberwolfach",
    credit: { text: "Marlene Ruf, Archives of the Mathematisches Forschungsinstitut Oberwolfach",
              url: "https://opc.mfo.de/detail?photo_id=27636",
              license: "CC BY-SA 2.0 DE", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/de/deed.en" } },

  // ---------------------------------------------------------------- 2026
  { id: "2026-rsme", start: "2026-01-19", end: "2026-01-23", city: "Alicante",
    name: "Congreso Bienal de la Real Sociedad Matemática Española (RSME 2026)",
    url: "https://2026.bienalrsme.com/",
    folder: "2026 - 01 - alicante rsme",
    credit: { text: "Congreso Bienal RSME 2026", url: "https://2026.bienalrsme.com/galeria" },
    talks: [{ type: "talk", date: "2026-01-19", session: "Geometría Algebraica Aplicada y Computacional",
              sessionUrl: "https://2026.bienalrsme.com/sites/default/files/Geometria_Algebraica_Aplicada_y_Computacional.pdf",
              title: "An effective algorithm for algebraic integrability of polynomial foliations with bounded genus" }] },

  { id: "2026-trento", start: "2026-05-25", end: "2026-05-29", city: "Trento",
    name: "Trento SinG 2026 — Birational Geometry of Foliations",
    url: "https://sites.google.com/unitn.it/sing-trento",
    folder: "2026 - 05 - trento",
    credit: { text: "SinG-Trento 2026", url: "https://sites.google.com/unitn.it/sing-trento/photo-2026" } },

  { id: "2026-iberosing", start: "2026-06-29", end: "2026-07-03", city: "Zaragoza",
    name: "IberoSing International Workshop 2026",
    url: "https://iberosing.github.io/IW26/index.html",
    talks: [{ type: "talk", date: "2026-06-29", tag: "plenary",
              title: "Explicit cones and Cox rings for surfaces from pencils at infinity" }] },

  { id: "2026-singacom", start: "2026-09-02", end: "2026-09-04", city: "Jerez de la Frontera",
    name: "Encuentro SINGACOM 2026",
    talks: [{ type: "talk", date: "2026-09-02", title: "Geometría algebraica y Foliaciones" }] },

  // ---------------------------------------------------------------- upcoming
  { id: "2027-rgas", start: "2027-01-11", end: "2027-01-13", city: "Sevilla",
    name: "11th RGAS meeting (IMUS)",
    url: "https://sites.google.com/view/rgas27-narvaez70/11th-rgas-meeting",
    talks: [{ type: "talk", date: "2027-01-11",
              title: "Polyhedral cones and Cox rings for rational surfaces built from pencils at infinity" }] }
];
