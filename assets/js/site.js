/* Renders talks, journey, organization, publications and counters from data/*.js (EN/ES) */
(function () {
  "use strict";

  var EVENTS = window.EVENTS || [];
  var PLACES = window.PLACES || {};
  var PHOTOS = window.PHOTOS || {};
  var SEMINARS = window.ORGANIZED_SEMINARS || [];
  var PUBS = window.PUBLICATIONS;
  var ME = window.ME;

  var now = new Date();
  var TODAY = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());

  // ------------------------------------------------------------ language
  var TXT = {
    en: {
      mon: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      milestone: "Milestone", stay: "Research stay", outreach: "Outreach", talk: "Talk", talks: "talks",
      poster: "Poster", posters: "posters", attended: "Attended", online: "Online", organizer: "Organizer",
      invited: "invited", plenary: "plenary", session: "session", comingSoon: "Coming soon", nextStops: "Next stops",
      officialPhotos: "Official photos ↗", photo: "Photo", photos: "Photos", officialPhoto: "Official photo", officialPhotosN: "Official photos",
      inJourney: "Photos in the journey", nothingYet: "Nothing announced yet.", nothing: "Nothing here.",
      photoOf: "Photo {n} of {name}", openPhotos: "Open photos", close: "Close", prev: "Previous", next: "Next",
      since: "since", ongoing: "ongoing", with: "with", chart: "Talks and posters per year",
      countries: { Spain: "Spain", France: "France", Switzerland: "Switzerland", Germany: "Germany", Italy: "Italy", Mexico: "Mexico" }
    },
    es: {
      mon: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      month: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
      milestone: "Hito", stay: "Estancia de investigación", outreach: "Divulgación", talk: "Charla", talks: "charlas",
      poster: "Póster", posters: "pósters", attended: "Asistencia", online: "Online", organizer: "Organización",
      invited: "invitada", plenary: "plenaria", session: "sesión", comingSoon: "Próximamente", nextStops: "Próximos destinos",
      officialPhotos: "Fotos oficiales ↗", photo: "Foto", photos: "Fotos", officialPhoto: "Foto oficial", officialPhotosN: "Fotos oficiales",
      inJourney: "Fotos en el diario", nothingYet: "Nada anunciado todavía.", nothing: "Nada por aquí.",
      photoOf: "Foto {n} de {name}", openPhotos: "Ver fotos", close: "Cerrar", prev: "Anterior", next: "Siguiente",
      since: "desde", ongoing: "en curso", with: "con", chart: "Charlas y pósters por año",
      countries: { Spain: "España", France: "Francia", Switzerland: "Suiza", Germany: "Alemania", Italy: "Italia", Mexico: "México" }
    }
  };
  function lang() { return document.documentElement.lang === "es" ? "es" : "en"; }
  function t(k) { return TXT[lang()][k]; }
  // field in the current language: obj.name_es when in Spanish (if present), else obj.name
  function loc(o, f) { return (lang() === "es" && o[f + "_es"]) || o[f]; }
  function setLang(l) {
    document.documentElement.lang = l;
    try { localStorage.setItem("lang", l); } catch (e) { /* private mode */ }
    var tt = document.body.getAttribute("data-title-" + l);
    if (tt) document.title = tt;
    renderAll();
  }

  // ------------------------------------------------------------ helpers
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function link(text, url, cls) {
    return url ? '<a href="' + esc(url) + '"' + (cls ? ' class="' + cls + '"' : "") + ' target="_blank" rel="noopener">' + esc(text) + "</a>" : esc(text);
  }

  function parts(d) { var p = String(d).split("-"); return { y: +p[0], m: +(p[1] || 0), d: +(p[2] || 0) }; }
  function key(d) { var p = parts(d); return p.y + "-" + pad(p.m) + "-" + pad(p.d); }
  function byKeyDesc(a, b) { return a < b ? 1 : a > b ? -1 : 0; }
  function lastDay(e) { var p = parts(e.end || e.start); return p.m ? p.y + "-" + pad(p.m) + "-" + pad(p.d || 31) : p.y + "-12-31"; }
  function isUpcoming(e) { return lastDay(e) >= TODAY && parts(e.end || e.start).m > 0; }
  function isPast(e) { return !isUpcoming(e); }

  function fmtNum(d) { var p = parts(d); return p.d ? pad(p.d) + "/" + pad(p.m) + "/" + p.y : p.m ? pad(p.m) + "/" + p.y : String(p.y); }
  function fmtOne(p) { return p.d ? p.d + " " + t("mon")[p.m - 1] + " " + p.y : p.m ? t("month")[p.m - 1] + " " + p.y : String(p.y); }
  function fmtRange(s, e) {
    var a = parts(s), M = t("mon");
    if (!e) return fmtOne(a);
    var b = parts(e);
    if (!a.d || !b.d) {
      if (a.y === b.y) return (a.m === b.m ? t("month")[a.m - 1] : M[a.m - 1] + " – " + M[b.m - 1]) + " " + a.y;
      return fmtOne(a) + " – " + fmtOne(b);
    }
    if (a.y === b.y && a.m === b.m) return a.d + "–" + b.d + " " + M[a.m - 1] + " " + a.y;
    if (a.y === b.y) return a.d + " " + M[a.m - 1] + " – " + b.d + " " + M[b.m - 1] + " " + a.y;
    return fmtOne(a) + " – " + fmtOne(b);
  }

  function place(e) {
    if (!e.city) return e.online ? t("online") : "";
    var c = PLACES[e.city];
    var s = e.city + (c ? ", " + (t("countries")[c[2]] || c[2]) : "");
    return e.online ? s + " (online)" : s;
  }
  // photos of an event, cover first and then the rest in folder order
  function photosOf(e) {
    var ph = e.folder ? PHOTOS[e.folder] || [] : [];
    for (var i = 1; i < ph.length; i++) {
      if (ph[i][0].split("/").pop() === e.cover) return [ph[i]].concat(ph.slice(0, i), ph.slice(i + 1));
    }
    return ph;
  }
  // downloaded official photos are named "oficial-..." in the journey folder
  function isOfficial(p) { return /^oficial-/.test(p[0].split("/").pop()); }
  function creditHtml(c) { return link(c.text, c.url) + (c.license ? " · " + link(c.license, c.licenseUrl) : ""); }
  function creditText(c) { return c.text + (c.license ? " (" + c.license + ")" : ""); }

  function sortedEvents() {
    return EVENTS.slice().sort(function (a, b) { return byKeyDesc(key(a.start), key(b.start)); });
  }
  function allTalks() {
    var out = [];
    EVENTS.forEach(function (e) { (e.talks || []).forEach(function (x) { out.push({ t: x, e: e }); }); });
    return out.sort(function (a, b) { return byKeyDesc(key(a.t.date), key(b.t.date)); });
  }
  function talkIsPast(x) { return key(x.date) <= TODAY; }

  // ------------------------------------------------------------ counters
  function counts() {
    var c = { talks: 0, posters: 0, upcomingTalks: 0 };
    allTalks().forEach(function (x) {
      if (!talkIsPast(x.t)) c.upcomingTalks++;
      else if (x.t.type === "poster") c.posters++;
      else c.talks++;
    });
    var visited = EVENTS.filter(function (e) { return isPast(e) && e.city && !e.online && PLACES[e.city] && e.kind !== "milestone"; });
    var cities = {}, countries = {};
    visited.forEach(function (e) { cities[e.city] = 1; countries[PLACES[e.city][2]] = 1; });
    c.cities = Object.keys(cities).length;
    c.countries = Object.keys(countries).length;
    c.events = EVENTS.filter(function (e) { return isPast(e) && (!e.kind || e.kind === "event"); }).length;
    c.stays = EVENTS.filter(function (e) { return isPast(e) && e.kind === "stay"; }).length;
    c.organized = EVENTS.filter(function (e) { return e.org && isPast(e); }).length;
    c.seminars = SEMINARS.length;
    c.orgTotal = c.organized + c.seminars;
    if (PUBS) {
      c.papers = PUBS.research.papers.length;
      c.preprints = PUBS.research.preprints.length;
      c.chapters = PUBS.research.chapters.length;
      c.eduPapers = PUBS.education.papers.length;
      c.books = PUBS.education.books.length;
    }
    return c;
  }
  var WORDS = { en: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"],
                es: ["cero", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez"] };
  function fillCounts(c) {
    var l = lang(), sfx = l === "es" ? "-es" : "";
    $$("[data-count]").forEach(function (el) {
      var n = c[el.getAttribute("data-count")];
      if (n == null) return;
      var one = el.getAttribute("data-one" + sfx), many = el.getAttribute("data-many" + sfx);
      var num = el.hasAttribute("data-words") && n <= 10 ? WORDS[l][n] : String(n);
      el.textContent = one ? num + " " + (n === 1 ? one : many) : num;
    });
  }

  // ------------------------------------------------------------ badges
  function badgesFor(e) {
    var b = [];
    if (e.kind === "milestone") b.push('<span class="badge milestone">' + t("milestone") + "</span>");
    if (e.kind === "stay") b.push('<span class="badge stay">' + t("stay") + "</span>");
    if (e.kind === "outreach") b.push('<span class="badge outreach">' + t("outreach") + "</span>");
    if (e.org) b.push('<span class="badge org">' + t("organizer") + "</span>");
    var nt = 0, np = 0, tags = {};
    (e.talks || []).forEach(function (x) { if (x.type === "poster") np++; else nt++; if (x.tag) tags[x.tag] = 1; });
    if (nt) b.push('<span class="badge talk">' + (nt > 1 ? nt + " " + t("talks") : t("talk")) + "</span>");
    if (np) b.push('<span class="badge poster">' + (np > 1 ? np + " " + t("posters") : t("poster")) + "</span>");
    Object.keys(tags).forEach(function (x) { b.push('<span class="badge tag">' + esc(t(x) || x) + "</span>"); });
    if (!nt && !np && !e.org && (!e.kind || e.kind === "event")) b.push('<span class="badge attended">' + t("attended") + "</span>");
    if (e.online) b.push('<span class="badge online">' + t("online") + "</span>");
    return b.join("");
  }

  // ------------------------------------------------------------ lightbox
  var lb, lbList = [], lbIdx = 0, lbCap = "", lbCredit = null;
  function lightbox(list, idx, caption, credit) {
    if (!lb) {
      lb = document.createElement("div");
      lb.className = "lb";
      lb.setAttribute("role", "dialog");
      lb.setAttribute("aria-modal", "true");
      lb.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure>' +
        '<button class="close">×</button><button class="prev">‹</button><button class="next">›</button>';
      document.body.appendChild(lb);
      lb.addEventListener("click", function (ev) {
        if (ev.target === lb || ev.target.classList.contains("close")) closeLb();
        else if (ev.target.classList.contains("prev")) stepLb(-1);
        else if (ev.target.classList.contains("next")) stepLb(1);
      });
      document.addEventListener("keydown", function (ev) {
        if (!lb.classList.contains("open")) return;
        if (ev.key === "Escape") closeLb();
        if (ev.key === "ArrowLeft") stepLb(-1);
        if (ev.key === "ArrowRight") stepLb(1);
      });
      var x0 = null;
      lb.addEventListener("touchstart", function (ev) { x0 = ev.touches[0].clientX; }, { passive: true });
      lb.addEventListener("touchend", function (ev) {
        if (x0 === null) return;
        var dx = ev.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) stepLb(dx < 0 ? 1 : -1);
        x0 = null;
      });
    }
    $(".close", lb).setAttribute("aria-label", t("close"));
    $(".prev", lb).setAttribute("aria-label", t("prev"));
    $(".next", lb).setAttribute("aria-label", t("next"));
    lbList = list; lbIdx = idx; lbCap = caption; lbCredit = credit || null;
    showLb();
    lb.classList.add("open");
    $(".close", lb).focus();
  }
  function showLb() {
    var p = lbList[lbIdx];
    var img = $("img", lb);
    img.src = p[0] + ".jpg";
    img.alt = t("photoOf").replace("{n}", lbIdx + 1).replace("{name}", lbCap);
    $("figcaption", lb).textContent = lbCap + (lbList.length > 1 ? "  ·  " + (lbIdx + 1) + " / " + lbList.length : "") +
      (lbCredit && isOfficial(p) ? "  ·  " + t("photo") + ": " + creditText(lbCredit) : "");
    $(".prev", lb).style.display = $(".next", lb).style.display = lbList.length > 1 ? "" : "none";
  }
  function stepLb(d) { lbIdx = (lbIdx + d + lbList.length) % lbList.length; showLb(); }
  function closeLb() { lb.classList.remove("open"); }

  // ------------------------------------------------------------ home
  function miniItem(e, showThumb) {
    var ph = photosOf(e), p = parts(e.start), visual;
    if (showThumb && ph.length) {
      visual = '<img class="thumb" src="' + ph[0][0] + '-t.jpg" alt="" loading="lazy">';
    } else {
      visual = '<span class="datebox">' + (p.d || "") + "<small>" + (p.m ? t("mon")[p.m - 1] : p.y) + "</small></span>";
    }
    var what = (e.talks || []).map(function (x) { return x.type === "poster" ? t("poster") : t("talk"); });
    if (e.org) what.unshift(t("organizer"));
    var meta = [fmtRange(e.start, e.end), place(e)].concat(what.length ? [what.join(" + ")] : []).filter(Boolean).join(" · ");
    return "<li>" + visual + '<div><a href="journey.html#' + esc(e.id) + '">' + esc(loc(e, "name")) + '</a><div class="meta">' + esc(meta) + "</div></div></li>";
  }
  function renderHome() {
    var up = $("#home-upcoming"), latest = $("#home-latest");
    if (up) {
      var list = EVENTS.filter(isUpcoming).sort(function (a, b) { return key(a.start) < key(b.start) ? -1 : 1; });
      up.innerHTML = list.length ? list.map(function (e) { return miniItem(e, false); }).join("") : '<li class="muted">' + t("nothingYet") + "</li>";
    }
    if (latest) {
      latest.innerHTML = sortedEvents().filter(function (e) { return isPast(e) && e.kind !== "milestone"; })
        .slice(0, 4).map(function (e) { return miniItem(e, true); }).join("");
    }
  }

  // ------------------------------------------------------------ talks page
  var CAMERA = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/></svg>';
  function sessionText(s) { return lang() === "es" ? t("session") + " " + s : s + " " + t("session"); }
  function talkItem(x) {
    var tk = x.t, e = x.e, where = [];
    if (e.kind === "stay") {
      // talks given during a research stay: show the seminar, not the stay
      where.push(link(tk.session || loc(e, "name"), tk.sessionUrl || e.url));
    } else {
      if (tk.session) where.push(tk.sessionUrl ? link(sessionText(tk.session), tk.sessionUrl) : esc(sessionText(tk.session)));
      where.push(link(loc(e, "name"), e.url));
    }
    var extra = [];
    if (tk.tag) extra.push('<span class="badge tag">' + esc(t(tk.tag) || tk.tag) + "</span>");
    if (photosOf(e).length) extra.push('<a class="cam" href="journey.html#' + esc(e.id) + '" title="' + t("inJourney") + '" aria-label="' + t("inJourney") + '">' + CAMERA + "</a>");
    return '<li><span class="d">' + fmtNum(tk.date) + "</span><div>" +
      '<div class="t">' + esc(tk.title) + (extra.length ? '<span class="extra">' + extra.join("") + "</span>" : "") + "</div>" +
      '<div class="m">' + where.join(" – ") + (place(e) ? ", " + esc(place(e)) : "") + "</div></div></li>";
  }
  function groupByYear(items, yearOf) {
    var g = {};
    items.forEach(function (x) { var y = yearOf(x); (g[y] = g[y] || []).push(x); });
    return Object.keys(g).sort(byKeyDesc).map(function (y) { return { year: y, items: g[y] }; });
  }
  function renderTalkList(el, type) {
    var items = allTalks().filter(function (x) { return talkIsPast(x.t) && (x.t.type === "poster") === (type === "poster"); });
    el.innerHTML = groupByYear(items, function (x) { return String(parts(x.t.date).y); }).map(function (g) {
      return '<div class="year"><h3>' + g.year + '</h3><span class="count">' + g.items.length + "</span></div>" +
        '<ul class="talks">' + g.items.map(talkItem).join("") + "</ul>";
    }).join("");
  }
  function renderChart(el) {
    var by = {}, minY = 9999, maxY = 0;
    allTalks().forEach(function (x) {
      if (!talkIsPast(x.t)) return;
      var y = parts(x.t.date).y;
      by[y] = by[y] || { t: 0, p: 0 };
      by[y][x.t.type === "poster" ? "p" : "t"]++;
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    });
    if (!maxY) return;
    var years = [];
    for (var y = minY; y <= maxY; y++) years.push(y);
    var max = Math.max.apply(null, years.map(function (y) { return by[y] ? by[y].t + by[y].p : 0; }));
    var W = 560, H = 150, base = 120, top = 18, slot = W / years.length, bw = Math.min(46, slot * 0.56), u = (base - top) / max;
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + t("chart") + '">';
    years.forEach(function (y, i) {
      var v = by[y] || { t: 0, p: 0 }, x = i * slot + (slot - bw) / 2, ht = v.t * u, hp = v.p * u;
      s += '<rect x="' + x + '" y="' + (base - ht) + '" width="' + bw + '" height="' + ht + '" rx="3" fill="var(--talk)"><title>' + y + ": " + v.t + " " + t("talks") + "</title></rect>";
      if (v.p) s += '<rect x="' + x + '" y="' + (base - ht - hp) + '" width="' + bw + '" height="' + Math.max(hp - 2, 1) + '" rx="3" fill="var(--poster)"><title>' + y + ": " + v.p + " " + t("posters") + "</title></rect>";
      s += '<text class="num" x="' + (x + bw / 2) + '" y="' + (base - ht - hp - 6) + '" text-anchor="middle">' + (v.t + v.p) + "</text>";
      s += '<text class="lbl" x="' + (x + bw / 2) + '" y="' + (base + 20) + '" text-anchor="middle">' + y + "</text>";
    });
    s += '<line x1="0" x2="' + W + '" y1="' + (base + 0.5) + '" y2="' + (base + 0.5) + '" stroke="var(--line)"/></svg>';
    el.innerHTML = s;
  }
  function renderTalks() {
    var tl = $("#talk-list"), pl = $("#poster-list"), ch = $("#talk-chart"), up = $("#talk-upcoming");
    if (tl) renderTalkList(tl, "talk");
    if (pl) renderTalkList(pl, "poster");
    if (ch) renderChart(ch);
    if (up) {
      var items = allTalks().filter(function (x) { return !talkIsPast(x.t); }).reverse();
      up.innerHTML = items.length ? '<div class="upcoming-box"><h2>' + t("comingSoon") + '</h2><ul class="talks">' + items.map(talkItem).join("") + "</ul></div>" : "";
    }
  }

  // ------------------------------------------------------------ organization (research page)
  function renderOrg() {
    var el = $("#org-list");
    if (!el) return;
    var items = SEMINARS.map(function (s) {
      return '<li><span class="d">' + t("since") + " " + fmtOne(parts(s.start)) + "</span><div>" +
        '<div class="t">' + link(s.name, s.url) + ' <span class="badge org">' + t("ongoing") + "</span></div>" +
        '<div class="m">' + esc(loc(s, "note")) + "</div></div></li>";
    });
    sortedEvents().filter(function (e) { return e.org && isPast(e); }).forEach(function (e) {
      var o = e.org, extra = [];
      if (o.session) extra.push(o.session + (o.with ? " (" + t("with") + " " + o.with + ")" : ""));
      items.push('<li><span class="d">' + fmtRange(e.start, e.end) + "</span><div>" +
        '<div class="t">' + link(loc(e, "name"), e.url) + "</div>" +
        '<div class="m">' + esc(loc(o, "role")) + (extra.length ? " · " + esc(extra.join(" · ")) : "") +
        (place(e) ? " · " + esc(place(e)) : "") + "</div></div></li>");
    });
    el.innerHTML = items.join("");
  }

  // ------------------------------------------------------------ journey page
  var MAX_THUMBS = 6;
  function entryHtml(e) {
    var ph = photosOf(e), name = loc(e, "name"), h = "";
    h += '<article class="entry" id="' + esc(e.id) + '">';
    h += '<div class="when">' + fmtRange(e.start, e.end) + '</div><div class="body">';
    h += "<h4>" + (e.url ? link(name, e.url) : esc(name)) + "</h4>";
    h += '<div class="where">' + (place(e) ? "<span>" + esc(place(e)) + "</span>" : "") + badgesFor(e) + "</div>";
    if (e.talks && e.talks.length) {
      h += '<ul class="tlist">' + e.talks.map(function (x) { return "<li>" + esc(x.title) + "</li>"; }).join("") + "</ul>";
    }
    if (e.org && e.org.session) h += '<p class="note">' + esc(sessionText(e.org.session)) + "</p>";
    if (e.note) h += '<p class="note">' + esc(loc(e, "note")) + "</p>";
    if (!ph.length && e.photoLink) h += '<a class="ext" href="' + esc(e.photoLink) + '" target="_blank" rel="noopener">' + t("officialPhotos") + "</a>";
    if (ph.length) {
      h += '<div class="strip">' + ph.slice(0, MAX_THUMBS).map(function (p, i) {
        var more = i === MAX_THUMBS - 1 && ph.length > MAX_THUMBS ? '<span class="more">+' + (ph.length - MAX_THUMBS + 1) + "</span>" : "";
        return '<button data-ev="' + esc(e.id) + '" data-i="' + i + '" aria-label="' + esc(t("photoOf").replace("{n}", i + 1).replace("{name}", name)) + '">' +
          '<img src="' + p[0] + '-t.jpg" alt="" loading="lazy" decoding="async">' + more + "</button>";
      }).join("") + "</div>";
      var nOff = ph.filter(isOfficial).length;
      if (e.credit && nOff) {
        var lbl = nOff === ph.length ? (nOff > 1 ? t("photos") : t("photo")) : (nOff > 1 ? t("officialPhotosN") : t("officialPhoto"));
        h += '<p class="credit">' + lbl + ": " + creditHtml(e.credit) + "</p>";
      }
    }
    return h + "</div></article>";
  }
  function matches(e, f) {
    if (f === "photos") return photosOf(e).length > 0;
    if (f === "talks") return !!(e.talks && e.talks.length);
    if (f === "milestones") return e.kind === "milestone" || e.kind === "stay" || e.kind === "outreach";
    return true;
  }
  var journeyFilter = "all";
  function renderJourney() {
    var el = $("#journey-list"), up = $("#journey-upcoming");
    if (!el) return;
    var evs = sortedEvents();
    if (up) {
      var next = evs.filter(isUpcoming).reverse();
      up.innerHTML = next.length ? '<div class="upcoming-box"><h2>' + t("nextStops") + '</h2><div class="j-list">' + next.map(entryHtml).join("") + "</div></div>" : "";
    }
    var past = evs.filter(function (e) { return isPast(e) && matches(e, journeyFilter); });
    el.innerHTML = groupByYear(past, function (e) { return String(parts(e.start).y); }).map(function (g) {
      return '<section class="j-year"><div class="year"><h3>' + g.year + '</h3><span class="count">' + g.items.length + "</span></div>" +
        '<div class="j-list">' + g.items.map(entryHtml).join("") + "</div></section>";
    }).join("") || '<p class="muted">' + t("nothing") + "</p>";
  }
  function setupJourney() {
    if (!$("#journey-list")) return;
    $$(".chip").forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".chip").forEach(function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
        journeyFilter = b.getAttribute("data-filter");
        renderJourney();
      });
    });
    document.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-ev]");
      if (!b) return;
      var e = EVENTS.filter(function (x) { return x.id === b.getAttribute("data-ev"); })[0];
      lightbox(photosOf(e), +b.getAttribute("data-i"), loc(e, "name"), e.credit);
    });
  }
  var map, markers;
  function renderMap() {
    var box = $("#journey-map");
    if (!box) return;
    if (!window.L) { box.style.display = "none"; return; }
    if (!map) {
      map = L.map(box, { scrollWheelZoom: false, worldCopyJump: true });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      markers = L.layerGroup().addTo(map);
      map.on("popupopen", function (ev) {
        $$("a", ev.popup.getElement()).forEach(function (a) {
          a.addEventListener("click", function () {
            var chip = $('.chip[data-filter="all"]');
            if (chip && chip.getAttribute("aria-pressed") !== "true") chip.click();
          });
        });
      });
    }
    markers.clearLayers();
    var accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#c2255c";
    var by = {};
    sortedEvents().forEach(function (e) {
      if (!e.city || e.online || !PLACES[e.city]) return;
      (by[e.city] = by[e.city] || []).push(e);
    });
    var pts = [];
    Object.keys(by).forEach(function (city) {
      var c = PLACES[city], list = by[city], future = list.every(isUpcoming);
      pts.push([c[0], c[1]]);
      L.circleMarker([c[0], c[1]], {
        radius: 5 + 2.2 * Math.sqrt(list.length), color: accent, weight: 2,
        fillColor: accent, fillOpacity: future ? 0.08 : 0.45, dashArray: future ? "3 3" : null
      }).addTo(markers).bindPopup("<b>" + esc(city) + "</b><ul>" + list.map(function (e) {
        return '<li><a href="#' + esc(e.id) + '">' + esc(loc(e, "name")) + "</a> · " + parts(e.start).y + "</li>";
      }).join("") + "</ul>");
    });
    if (pts.length && !map._fitted) { map.fitBounds(pts, { padding: [24, 24], maxZoom: 6 }); map._fitted = true; }
  }

  // ------------------------------------------------------------ publications page
  function pubItem(p) {
    var authors = p.authors.map(function (a) { return a === ME ? "<strong>" + esc(a) + "</strong>" : esc(a); }).join(", ");
    var venue = [p.venue ? "<em>" + esc(p.venue) + "</em>" : "", esc(loc(p, "details") || ""), p.year].filter(Boolean).join(", ");
    // the title already links to the journal/repository; arXiv gets its own button
    var btns = p.url && p.arxiv ? [link("arXiv", p.arxiv, "btn")] : [];
    return "<li>" + (p.label ? '<span class="pub-label">' + esc(loc(p, "label")) + "</span>" : "") +
      (p.url || p.arxiv ? '<a class="pub-title" href="' + esc(p.url || p.arxiv) + '" target="_blank" rel="noopener">' + esc(p.title) + "</a>" : '<span class="pub-title">' + esc(p.title) + "</span>") +
      (p.label ? "" : '<div class="pub-authors">' + authors + "</div>") +
      '<div class="pub-venue">' + venue + (btns.length ? ' <span class="btns">' + btns.join("") + "</span>" : "") + "</div></li>";
  }
  function renderPubs() {
    if (!PUBS) return;
    $$("[data-pubs]").forEach(function (el) {
      var path = el.getAttribute("data-pubs").split(".");
      el.innerHTML = (PUBS[path[0]][path[1]] || []).map(pubItem).join("");
    });
  }

  // ------------------------------------------------------------ chrome
  function setupChrome() {
    var b = $(".nav-toggle"), n = $(".nav");
    if (b && n) {
      b.addEventListener("click", function () {
        var open = n.classList.toggle("open");
        b.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    $$(".lang-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () { setLang(lang() === "es" ? "en" : "es"); });
    });
    var tt = document.body.getAttribute("data-title-" + lang());
    if (tt) document.title = tt;
  }

  function renderAll() {
    fillCounts(counts());
    renderHome();
    renderTalks();
    renderOrg();
    renderPubs();
    renderJourney();
    renderMap();
  }

  document.addEventListener("DOMContentLoaded", function () {
    $$("[data-year]").forEach(function (el) { el.textContent = now.getFullYear(); });
    setupChrome();
    setupJourney();
    renderAll();
    // a link like journey.html#2022-eaca: make sure the entry is visible
    if (location.hash && $("#journey-list")) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) setTimeout(function () { target.scrollIntoView({ block: "center" }); }, 50);
    }
  });
})();
