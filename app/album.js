/*
  Family Holiday Album.
  Draws the album from the holiday files in holidays/. You should not need to
  change this file to add a holiday.
*/
(function () {
  "use strict";

  var holidays = [];
  var TYPE_LABEL = { sight: "Sight", food: "Food", shopping: "Shopping", hotel: "Stay", station: "Station", airport: "Airport", nature: "Nature" };

  // Famous places and cities, used to name photos that have a location.
  // Places from every holiday file are added to this list too.
  var GAZETTEER = [
    ["Singapore", 1.2903, 103.8519], ["Changi Airport", 1.3644, 103.9915], ["Marina Bay Sands", 1.2834, 103.8607], ["Sentosa", 1.2494, 103.8303],
    ["Kuala Lumpur", 3.1390, 101.6869], ["Penang", 5.4141, 100.3288], ["Malacca", 2.1896, 102.2501], ["Langkawi", 6.3500, 99.8000],
    ["Bangkok", 13.7563, 100.5018], ["Phuket", 7.8804, 98.3923], ["Chiang Mai", 18.7883, 98.9853], ["Bali", -8.4095, 115.1889],
    ["Jakarta", -6.2088, 106.8456], ["Yangon", 16.8409, 96.1735], ["Mandalay", 21.9588, 96.0891], ["Bagan", 21.1717, 94.8585],
    ["Hanoi", 21.0278, 105.8342], ["Ho Chi Minh City", 10.8231, 106.6297], ["Siem Reap", 13.3671, 103.8448], ["Manila", 14.5995, 120.9842],
    ["Hong Kong", 22.3193, 114.1694], ["Macau", 22.1987, 113.5439], ["Taipei", 25.0330, 121.5654], ["Seoul", 37.5665, 126.9780],
    ["Busan", 35.1796, 129.0756], ["Jeju", 33.4996, 126.5312], ["Beijing", 39.9042, 116.4074], ["Shanghai", 31.2304, 121.4737],
    ["Tokyo", 35.6762, 139.6503], ["Osaka", 34.6937, 135.5023], ["Kyoto", 35.0116, 135.7681], ["Nara", 34.6851, 135.8048],
    ["Kobe", 34.6901, 135.1955], ["Hakone", 35.2324, 139.1069], ["Nagoya", 35.1815, 136.9066], ["Hiroshima", 34.3853, 132.4553],
    ["Fukuoka", 33.5904, 130.4017], ["Sapporo", 43.0618, 141.3545], ["Hokkaido", 43.2203, 142.8635], ["Okinawa", 26.2124, 127.6809],
    ["Mount Fuji", 35.3606, 138.7274], ["Kawaguchiko", 35.5167, 138.7500], ["Yokohama", 35.4437, 139.6380], ["Kamakura", 35.3192, 139.5467],
    ["Sydney", -33.8688, 151.2093], ["Melbourne", -37.8136, 144.9631], ["Perth", -31.9505, 115.8605], ["Gold Coast", -28.0167, 153.4000],
    ["Auckland", -36.8485, 174.7633], ["Queenstown", -45.0312, 168.6626], ["London", 51.5072, -0.1276], ["Paris", 48.8566, 2.3522],
    ["Rome", 41.9028, 12.4964], ["Barcelona", 41.3874, 2.1686], ["Zurich", 47.3769, 8.5417], ["Amsterdam", 52.3676, 4.9041],
    ["Dubai", 25.2048, 55.2708], ["Istanbul", 41.0082, 28.9784], ["New York", 40.7128, -74.0060], ["Los Angeles", 34.0522, -118.2437],
    ["San Francisco", 37.7749, -122.4194], ["Vancouver", 49.2827, -123.1207], ["Maldives", 3.2028, 73.2207], ["Delhi", 28.6139, 77.2090]
  ];

  // ---------- small helpers ----------
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  // Only allow web links, embedded pictures and files inside this website.
  function safeUrl(u) { u = String(u == null ? "" : u).trim(); return /^(https:\/\/|data:image\/(jpeg|png|webp|gif);base64,|blob:)/i.test(u) || /^[\w.\-\/%]+$/.test(u) ? u : "#"; }
  function u(x) { return esc(safeUrl(x)); }
  function q(s) { return encodeURIComponent(s).replace(/%20/g, "+"); }
  function parseDate(s) { var p = String(s).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function nice(s, withDay) { var d = parseDate(s); return (withDay ? WD[d.getDay()] + " " : "") + d.getDate() + " " + MON[d.getMonth()] + " " + d.getFullYear(); }
  function niceShort(s) { var d = parseDate(s); return d.getDate() + " " + MON[d.getMonth()]; }
  function daysBetween(a, b) { return Math.round((parseDate(b) - parseDate(a)) / 86400000); }
  function today() { return iso(new Date()); }
  function mapUrl(p) { return "https://www.google.com/maps/search/?api=1&query=" + q(p.mapQuery || p.name); }
  function photosUrl(p) { return p.photosUrl || "https://www.google.com/search?tbm=isch&q=" + q(p.photos || p.name); }
  function videosUrl(p) { return p.videosUrl || "https://www.youtube.com/results?search_query=" + q(p.videos || p.photos || p.name); }
  function distKm(a, b, c, d) {
    var R = 6371, r = Math.PI / 180, dl = (c - a) * r, dn = (d - b) * r;
    var x = Math.sin(dl / 2) * Math.sin(dl / 2) + Math.cos(a * r) * Math.cos(c * r) * Math.sin(dn / 2) * Math.sin(dn / 2);
    return 2 * R * Math.asin(Math.sqrt(x));
  }
  function tone(type) { return "var(--t-" + (TYPE_LABEL[type] ? type : "sight") + ")"; }
  function store(key, val) { try { if (val === undefined) return JSON.parse(localStorage.getItem(key) || "null"); localStorage.setItem(key, JSON.stringify(val)); } catch (e) { return null; } }

  function status(h) {
    var t = today();
    if (t < h.start) { var n = daysBetween(t, h.start); return { cls: "", text: n === 1 ? "Tomorrow" : n + " days to go" }; }
    if (t <= h.end) return { cls: "", text: "Happening now" };
    return { cls: "memory", text: "Memory" };
  }

  // ---------- pictures ----------
  // A picture frame shows, in order: your own photo, a photo saved with the
  // website, or a picture from the place's Wikipedia page. If none can load,
  // it shows a patterned tile with the place name.
  var wikiCache = store("album-wiki-images") || {};
  var wikiWanted = {};
  function creditText(cr, lead) {
    return (lead || "Photo") + (cr.by ? " by " + cr.by : " from Wikipedia") + (cr.licence ? " · " + cr.licence : "");
  }
  function pic(opts) {
    var src = opts.image || (opts.wiki && (window.ALBUM_IMAGES || {})[opts.wiki]) || "";
    var wiki = !src && opts.wiki ? opts.wiki : "";
    if (wiki && wikiCache[wiki]) src = wikiCache[wiki];
    if (wiki && !wikiCache[wiki]) wikiWanted[wiki] = true;
    var credit = opts.wiki ? '<a class="credit" href="https://en.wikipedia.org/wiki/' + esc(encodeURIComponent(opts.wiki.replace(/ /g, "_"))) + '" target="_blank" rel="noopener noreferrer">Photo from Wikipedia</a>' : "";
    var alt = opts.area || (opts.decorative ? "" : opts.name || "");
    return '<div class="pic' + (opts.cls ? " " + opts.cls : "") + '" style="--tone:' + tone(opts.type) + '" data-wiki="' + esc(wiki) + '" data-area="' + esc(opts.area || "") + '">' +
      '<div class="ph" aria-hidden="true"><small>' + esc(opts.label || TYPE_LABEL[opts.type] || "") + '</small>' + esc(opts.name || "") + '</div>' +
      (src ? '<img src="' + u(src) + '" alt="' + esc(alt) + '" loading="lazy">' : "") +
      (opts.area ? '<span class="pic-tag" aria-hidden="true">' + esc(opts.area) + '</span>' : "") +
      (src && !opts.image && opts.wiki && !opts.inLink ? credit : "") +
      (opts.credit && opts.inLink ? '<span class="credit">' + esc(creditText(opts.credit)) + '</span>' : "") +
      (opts.credit && !opts.inLink ? '<a class="credit" href="' + u(opts.credit.url) + '" target="_blank" rel="noopener noreferrer" title="Who took this photo">' + esc(creditText(opts.credit)) + '</a>' : "") + '</div>';
  }
  function wirePics(root) {
    root.querySelectorAll(".pic img").forEach(function (img) {
      var box = img.parentNode;
      function ok() { box.classList.add("loaded"); }
      function bad() { img.remove(); }
      if (img.complete && img.naturalWidth) ok(); else { img.addEventListener("load", ok); img.addEventListener("error", bad); }
    });
    var titles = Object.keys(wikiWanted);
    wikiWanted = {};
    for (var i = 0; i < titles.length; i += 20) fetchWiki(titles.slice(i, i + 20), root);
  }
  function fetchWiki(titles, root) {
    var url = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=1000&titles=" +
      titles.map(encodeURIComponent).join("|");
    fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      var back = {};
      titles.forEach(function (t) { back[t] = t; });
      ((data.query || {}).normalized || []).forEach(function (n) { back[n.to] = back[n.from] || n.from; });
      ((data.query || {}).redirects || []).forEach(function (n) { back[n.to] = back[n.from] || n.from; });
      var pages = (data.query || {}).pages || {};
      Object.keys(pages).forEach(function (k) {
        var pg = pages[k], asked = back[pg.title] || pg.title;
        if (pg.thumbnail && pg.thumbnail.source) wikiCache[asked] = pg.thumbnail.source;
      });
      store("album-wiki-images", wikiCache);
      root.querySelectorAll(".pic[data-wiki]").forEach(function (box) {
        var t = box.getAttribute("data-wiki");
        if (!t || !wikiCache[t] || box.querySelector("img") || box.closest("a")) return;
        var img = new Image();
        img.alt = box.getAttribute("data-area") || t; img.loading = "lazy";
        img.onload = function () { box.classList.add("loaded"); };
        img.onerror = function () { img.remove(); };
        img.src = safeUrl(wikiCache[t]);
        box.appendChild(img);
        box.insertAdjacentHTML("beforeend", '<a class="credit" href="https://en.wikipedia.org/wiki/' + encodeURIComponent(t.replace(/ /g, "_")) + '" target="_blank" rel="noopener noreferrer">Photo from Wikipedia</a>');
      });
    }).catch(function () { /* No internet or blocked: the patterned tiles stay. */ });
  }

  // "Why we picked it" and "Photo spots" open in a pop-up over the page.
  var moreList = [];
  function moreButton(p, city) {
    var out = "";
    if (p.more) { moreList.push({ p: p, kind: "why", city: city }); out += '<button class="more-btn why" type="button" aria-haspopup="dialog" data-more="' + (moreList.length - 1) + '"><span aria-hidden="true">✦</span>Why we picked it</button>'; }
    if (p.spots) { moreList.push({ p: p, kind: "spots", city: city }); out += '<button class="more-btn spots" type="button" aria-haspopup="dialog" data-more="' + (moreList.length - 1) + '"><span aria-hidden="true">◎</span>Photo spots</button>'; }
    return out ? '<div class="more-bar">' + out + '</div>' : "";
  }
  function closeMore(d) {
    if (!d.open || d.classList.contains("closing")) return;
    d.inert = true;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { d.close(); return; }
    d.classList.add("closing");
    setTimeout(function () { d.close(); }, 180);
  }
  function moreDialog() {
    var d = document.getElementById("more-dialog");
    if (d) return d;
    d = document.createElement("dialog"); d.id = "more-dialog"; d.className = "more";
    d.setAttribute("aria-labelledby", "more-title");
    d.setAttribute("aria-describedby", "more-lead");
    document.body.appendChild(d);
    d.addEventListener("click", function (e) { if (e.target === d || e.target.closest("[data-close]")) closeMore(d); });
    d.addEventListener("cancel", function (e) { e.preventDefault(); closeMore(d); });
    d.addEventListener("close", function () {
      d.classList.remove("closing"); d.inert = false;
      document.documentElement.classList.remove("more-open");
      if (d._opener && d._opener.isConnected) d._opener.focus();
    });
    return d;
  }
  function openMore(entry) {
    var p = entry.p, spots = entry.kind === "spots", d = moreDialog();
    d._opener = document.activeElement;
    var m = spots ? p.spots : p.more, hotel = !!(p.nights || p.type === "hotel");
    var row = function (label, text, cls) { return text ? '<div class="more-row' + (cls ? " " + cls : "") + '"><h3 class="more-label">' + label + '</h3><p>' + esc(text) + '</p></div>' : ""; };
    // A hotel shows a photo here only when it is the hotel itself, never an area view.
    var img = "", cr = null;
    if (spots && m.image) { img = m.image; cr = m.credit; }
    else if (!hotel || p.hotelPhoto) {
      img = p.image || (p.wiki && ((window.ALBUM_IMAGES || {})[p.wiki] || wikiCache[p.wiki])) || "";
      cr = p.image ? p.credit : null;
    }
    var credit = !img ? "" : cr ? '<a class="credit" href="' + u(cr.url) + '" target="_blank" rel="noopener noreferrer">' + esc(creditText(cr, spots && m.image ? "Example photo" : "Photo")) + '</a>'
      : p.wiki ? '<a class="credit" href="https://en.wikipedia.org/wiki/' + esc(encodeURIComponent(p.wiki.replace(/ /g, "_"))) + '" target="_blank" rel="noopener noreferrer">Photo from Wikipedia</a>' : "";
    var where = (p.nights ? [p.city, p.nights] : [p.city || entry.city, TYPE_LABEL[p.type]]).filter(Boolean).join(" · ");
    var note = hotel && !img ? '<span class="more-note">No free photo of this hotel yet. Tap Photos below to see it.</span>' : "";
    var lead = function (label, text) { return text ? '<div class="more-row first">' + (label ? '<h3 class="more-label">' + label + '</h3>' : "") + '<p class="more-lead" id="more-lead">' + esc(text) + '</p></div>' : ""; };
    var body = spots
      ? lead("Where to stand", m.spots) + row("Poses to try", m.poses) + row("Camera angle", m.angles) + row("Best light", m.light) + row("Beat the crowds", m.crowds)
      : lead("", m.why) + row(hotel ? "Best time to arrive" : "Best time to go", m.best) + row("Good to know", m.tips) + row("Skip it if", m.skip, "skip");
    var foot = spots
      ? '<div class="links seg"><a class="btn" href="' + u("https://www.google.com/search?tbm=isch&q=" + q(p.name + " best photo spot")) + '" target="_blank" rel="noopener noreferrer">More example photos</a>' +
        (m.tag ? '<a class="btn" href="' + u("https://www.instagram.com/explore/tags/" + encodeURIComponent(m.tag) + "/") + '" target="_blank" rel="noopener noreferrer">#' + esc(m.tag) + ' on Instagram</a>' : "") + '</div>'
      : linkRow(p, { primaryPhotos: !!note }) + infoLink(p);
    d.innerHTML = '<div class="more-box' + (spots ? " is-spots" : "") + '">' +
      '<button class="more-close" type="button" data-close aria-label="Close"><span aria-hidden="true">✕</span></button>' +
      '<div class="more-scroll"><header class="more-hero' + (img ? "" : " no-pic") + '" style="--tone:' + tone(p.type || "hotel") + '">' +
        (img ? '<img src="' + u(img) + '" alt="' + esc(spots && m.image ? "Example photo taken at " + p.name : p.name) + '">' : "") + credit +
        '<div class="more-title"><span class="more-kicker">' + (spots ? "Photo spots" : "Why we picked it") + '</span><h2 id="more-title">' + esc(p.name) + '</h2>' +
        (where ? '<span class="more-where">' + esc(where) + '</span>' : "") + note + '</div></header>' +
      '<div class="more-body">' + body + '</div></div><footer class="more-foot">' + foot + '</footer></div>';
    var hi = d.querySelector(".more-hero img");
    if (hi) hi.addEventListener("error", function () {
      var h = hi.parentNode; h.classList.add("no-pic"); hi.remove();
      var c = h.querySelector(".credit"); if (c) c.remove();
    });
    document.documentElement.classList.add("more-open");
    if (d.showModal) d.showModal(); else d.setAttribute("open", "");
    d.querySelector(".more-scroll").scrollTop = 0;
    d.querySelector("[data-close]").focus();
  }
  function wireMore(root) {
    root.querySelectorAll("[data-more]").forEach(function (b) {
      b.addEventListener("click", function () { openMore(moreList[+b.getAttribute("data-more")]); });
    });
  }

  // Photos | Videos | Map as one joined bar. primaryPhotos fills the Photos cell.
  function linkRow(p, opts) {
    var ext = '" target="_blank" rel="noopener noreferrer">';
    return '<div class="links seg">' +
      '<a class="btn' + (opts && opts.primaryPhotos ? " is-primary" : "") + '" href="' + u(photosUrl(p)) + ext + 'Photos</a>' +
      '<a class="btn" href="' + u(videosUrl(p)) + ext + 'Videos</a>' +
      '<a class="btn" href="' + u(mapUrl(p)) + ext + 'Map</a></div>';
  }
  function infoLink(p) {
    return p.infoUrl ? '<a class="info-link" href="' + u(p.infoUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(p.infoLabel || "More info") + ' <span aria-hidden="true">↗</span></a>' : "";
  }
  function dayRouteUrl(day) {
    var pts = (day.places || []).filter(function (p) { return p.lat != null && !p.noRoute; });
    if (pts.length < 2) return "";
    var ll = function (p) { return p.lat + "," + p.lon; };
    var mid = pts.slice(1, -1).slice(0, 8).map(ll).join("|");
    return "https://www.google.com/maps/dir/?api=1&origin=" + ll(pts[0]) + "&destination=" + ll(pts[pts.length - 1]) + (mid ? "&waypoints=" + encodeURIComponent(mid) : "") + "&travelmode=driving";
  }

  // ---------- page frame ----------
  function frame(active, inner) {
    return '<header class="bar"><div class="wrap">' +
      '<a class="brand" href="#home"><span class="seal" aria-hidden="true">旅</span>Our Holiday Album</a>' +
      '<nav class="nav" aria-label="Pages">' +
      '<a href="#home"' + (active === "home" ? ' aria-current="page"' : "") + '>Holidays</a>' +
      '<a href="#rebuild"' + (active === "rebuild" ? ' aria-current="page"' : "") + '>Rebuild from photos</a>' +
      (unlockedKey ? '<button class="btn small" type="button" data-action="lock">Lock</button>' : "") +
      '</nav></div></header><main class="wrap">' + inner + '</main>' +
      '<footer class="wrap">Each photo credit links to where the picture came from. Our own photos are kept inside the locked holiday files.</footer>';
  }

  // ---------- home ----------
  function homeView() {
    var sorted = holidays.slice().sort(function (a, b) { return a.start < b.start ? 1 : -1; });
    var cards = sorted.map(function (h) {
      var st = status(h);
      var cover = h.memories && h.memories[0] && !h.cover.image ? { image: h.memories[0].image } : {};
      return '<a class="trip-card" href="#' + esc(h.id) + '">' +
        pic({ image: cover.image || h.cover.image, wiki: h.cover.wiki, credit: cover.image ? null : h.cover.credit, inLink: true, name: h.title, label: h.subtitle }) +
        '<div class="body"><span class="status ' + st.cls + '">' + esc(st.text) + '</span>' +
        '<h3>' + esc(h.title) + '</h3><p class="muted">' + esc(h.subtitle) + '</p>' +
        '<p class="eyebrow">' + esc(niceShort(h.start)) + ' to ' + esc(nice(h.end)) + ' · ' + (daysBetween(h.start, h.end) + 1) + ' days</p></div></a>';
    }).join("");
    cards += '<a class="trip-card add" href="#rebuild"><span class="eyebrow">Past holidays</span><h3>Rebuild a holiday from your photos</h3>' +
      '<p class="muted">Choose old photos. The album reads when and where each was taken, sorts them into days and suggests the place names.</p></a>';
    return frame("home",
      '<div class="intro"><span class="eyebrow">Family album</span><h1>Every trip, day by day</h1>' +
      '<p>Plans for the trips ahead and memories of the ones behind us. Tap a holiday to see where we go each day, with pictures, videos and map pins.</p></div>' +
      '<div class="shelf">' + cards + '</div>');
  }

  // ---------- one holiday ----------
  function holidayView(h) {
    var st = status(h);
    var nDays = daysBetween(h.start, h.end) + 1;
    var nights = nDays - 1;
    var cities = (h.route || []).filter(function (r, i, a) { return r.nights != null; }).length;
    var placeCount = (h.days || []).reduce(function (n, d) { return n + (d.places || []).length; }, 0);
    var byDate = {};
    (h.memories || []).forEach(function (m) { (byDate[m.date] = byDate[m.date] || []).push(m); });

    var html = '<section class="cover">' + pic({ image: h.cover.image, wiki: h.cover.wiki, credit: h.cover.credit, name: h.title }) +
      '<div class="shade"></div><div class="text"><span class="status ' + st.cls + '">' + esc(st.text) + '</span>' +
      '<h1>' + esc(h.title) + '</h1><p class="sub">' + esc(h.subtitle) + ' · ' + esc(nice(h.start, true)) + ' to ' + esc(nice(h.end, true)) + '</p></div></section>' +
      '<div class="facts">' +
      '<div><span class="eyebrow">Days</span><b>' + nDays + '</b></div>' +
      '<div><span class="eyebrow">Nights</span><b>' + nights + '</b></div>' +
      (cities ? '<div><span class="eyebrow">Places we sleep</span><b>' + (h.stays || []).length + '</b></div>' : "") +
      '<div><span class="eyebrow">Stops</span><b>' + placeCount + '</b></div>' +
      ((h.memories || []).length ? '<div><span class="eyebrow">Photos</span><b>' + h.memories.length + '</b></div>' : "") + '</div>' +
      (h.walkingTotal ? '<p class="muted walk-total">' + esc(h.walkingTotal) + '</p>' : "") +
      ((h.journeyTips || []).length ? '<div class="tipbox"><h4><span aria-hidden="true">🚆</span> Getting around, every day</h4><ul>' + h.journeyTips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join("") + '</ul>' +
        (h.journeyNote ? '<p class="muted">' + esc(h.journeyNote) + '</p>' : "") + '</div>' : "") +
      '<div class="summary">' + (h.travellers ? '<p class="eyebrow">' + esc(h.travellers) + '</p>' : "") + (h.summary ? '<p>' + esc(h.summary) + '</p>' : "") +
      ((h.links || []).length ? '<div class="links">' + h.links.map(function (l, i) { return '<a class="btn' + (i ? "" : " primary") + '" href="' + u(l.url) + '" target="_blank" rel="noopener noreferrer">' + esc(l.label) + '</a>'; }).join("") + '</div>' : "") + '</div>';

    if ((h.route || []).length) {
      html += '<section><div class="section-head"><h2>The route</h2><span class="eyebrow">City by city</span></div><div class="route">' +
        h.route.map(function (r) {
          return '<div class="stop"><span class="dot"></span><h3>' + esc(r.city) + '</h3>' +
            '<p class="n">' + (r.nights ? r.nights + (r.nights === 1 ? " night" : " nights") : r.nights === 0 ? "Day trip" : "Home") + '</p>' +
            (r.how ? '<p class="how">' + esc(r.how) + '</p>' : "") + '</div>';
        }).join("") + '</div></section>';
    }

    if ((h.stays || []).length) {
      html += '<section><div class="section-head"><h2>Where we stay</h2><span class="eyebrow">And why we chose it</span></div><div class="stays">' +
        h.stays.map(function (s) {
          return '<article class="stay">' + pic({ image: s.image, wiki: s.wiki, credit: s.credit, name: s.name, type: "hotel", label: s.city, area: s.areaPhoto, decorative: true }) +
            '<div class="body"><span class="eyebrow">' + esc(s.city) + ' · ' + esc(s.nights) + '</span><h3>' + esc(s.name) + '</h3>' +
            (s.why ? '<p class="muted">' + esc(s.why) + '</p>' : "") + infoLink(s) + '<div class="card-actions">' + moreButton(s) + linkRow(s) + '</div></div></article>';
        }).join("") + '</div></section>';
    }

    html += '<section><div class="section-head"><h2>Day by day</h2><span class="eyebrow">Each day, then its stops in order</span></div>';
    (h.days || []).forEach(function (d, i) {
      var dd = parseDate(d.date), route = dayRouteUrl(d), mem = byDate[d.date] || [];
      delete byDate[d.date];
      html += '<article class="day" id="' + esc(h.id + "-day" + (i + 1)) + '"><div class="ticket">' +
        '<div class="stub"><span class="d">Day ' + (i + 1) + '</span><span class="big">' + dd.getDate() + '</span><span class="d">' + WD[dd.getDay()] + ' ' + MON[dd.getMonth()] + '</span></div>' +
        '<div class="main"><h3>' + esc(d.title || d.city || "") + '</h3>' +
        '<div class="meta">' + (d.city ? '<span>In <b>' + esc(d.city) + '</b></span>' : "") + (d.sleep ? '<span>Sleep at <b>' + esc(d.sleep) + '</b></span>' : "") + '</div>' +
        (d.travel ? '<p class="travel">' + esc(d.travel) + '</p>' : "") +
        (d.walk || d.ifTired ? '<div class="walk">' + (d.walk ? '<span><b>Walking</b> ' + esc(d.walk) + '</span>' : "") + (d.ifTired ? '<span><b>If tired</b> ' + esc(d.ifTired) + '</span>' : "") + '</div>' : "") +
        journeyList(d.journeys) +
        (route ? '<div class="links"><a class="btn small" href="' + u(route) + '" target="_blank" rel="noopener noreferrer">Today\'s stops in Google Maps</a></div>' : "") +
        '</div></div>';
      if ((d.places || []).length) {
        html += '<div class="places">' + d.places.map(function (p) {
          return '<div class="place">' + pic({ image: p.image, wiki: p.wiki, credit: p.credit, name: p.name, type: p.type, area: p.areaPhoto, decorative: true }) +
            '<div class="body"><div class="top"><span class="chip" style="color:' + tone(p.type) + '">' + esc(TYPE_LABEL[p.type] || "Place") + '</span>' +
            (p.time ? '<span class="time">' + esc(p.time) + '</span>' : "") + '</div>' +
            '<h4>' + esc(p.name) + '</h4>' + (p.note ? '<p class="note">' + esc(p.note) + '</p>' : "") + infoLink(p) + '<div class="card-actions">' + moreButton(p, d.city) + linkRow(p) + '</div></div></div>';
        }).join("") + '</div>';
      }
      if (mem.length) html += memoryGrid(mem);
      html += '</article>';
    });
    var extra = Object.keys(byDate).sort();
    extra.forEach(function (date) {
      html += '<article class="day"><div class="ticket"><div class="stub"><span class="d">Extra</span><span class="big">' + parseDate(date).getDate() + '</span><span class="d">' + niceShort(date) + '</span></div>' +
        '<div class="main"><h3>More photos</h3></div></div>' + memoryGrid(byDate[date]) + '</article>';
    });
    html += '</section>';

    if (h.overviewImage || (h.links || []).length) {
      var mapLink = (h.links || []).filter(function (l) { return /maps/.test(l.url); })[0];
      html += '<section><div class="section-head"><h2>Whole trip on one map</h2></div><div class="mapbox">' +
        (h.overviewImage ? '<img src="' + u(h.overviewImage) + '" alt="Map of every stop on the trip, coloured by day">' : "") +
        '<div class="body"><p class="muted">Every stop, coloured by day. Stars are where we sleep.</p>' +
        (mapLink ? '<a class="btn primary" href="' + u(mapLink.url) + '" target="_blank" rel="noopener noreferrer">Open the live map</a>' : "") + '</div></div></section>';
    }

    if (!(h.memories || []).length) {
      html += '<section><div class="section-head"><h2>Our photos</h2></div><div class="empty"><b>No photos yet.</b>' +
        '<p>After the trip, open <a href="#rebuild">Rebuild from photos</a>, choose "Add to: ' + esc(h.title) + '" and pick your photos. Each photo goes under the day it was taken, next to the nearest stop.</p></div></section>';
    }
    return frame(h.id, html);
  }
  // Each ride as "how: time, how often, cost", with the part before the first colon in bold.
  function journeyList(list) {
    if (!(list || []).length) return "";
    return '<div class="journeys"><h4><span aria-hidden="true">🚆</span> Journeys</h4><ul>' + list.map(function (j) {
      var i = j.indexOf(": ");
      return '<li>' + (i > 0 ? '<b>' + esc(j.slice(0, i + 1)) + '</b> ' + esc(j.slice(i + 2)) : esc(j)) + '</li>';
    }).join("") + '</ul></div>';
  }
  function memoryGrid(list) {
    return '<div class="memories">' + list.map(function (m) {
      return '<figure>' + pic({ image: m.image, name: m.place || m.caption || "", type: "sight" }) +
        '<figcaption>' + esc(m.caption || m.place || "") + (m.place && m.caption ? " · " + esc(m.place) : "") + '</figcaption></figure>';
    }).join("") + '</div>';
  }

  // ---------- rebuild from photos ----------
  var rb = { photos: [], target: "new" };

  function knownPlaces() {
    var list = [];
    holidays.forEach(function (h) {
      (h.days || []).forEach(function (d) { (d.places || []).forEach(function (p) { if (p.lat != null) list.push({ name: p.name, lat: p.lat, lon: p.lon, near: true }); }); });
      (h.stays || []).forEach(function (s) { if (s.lat != null) list.push({ name: s.name, lat: s.lat, lon: s.lon, near: true }); });
    });
    GAZETTEER.forEach(function (g) { list.push({ name: g[0], lat: g[1], lon: g[2] }); });
    return list;
  }
  function suggestPlace(lat, lon) {
    var best = null, bestD = 1e9, city = null, cityD = 1e9;
    knownPlaces().forEach(function (p) {
      var d = distKm(lat, lon, p.lat, p.lon);
      if (p.near && d < bestD) { best = p; bestD = d; }
      if (!p.near && d < cityD) { city = p; cityD = d; }
      if (p.near && d < cityD && d < 1.5) { /* a named stop also counts as the area */ }
    });
    if (best && bestD <= 1.2) return { name: best.name, how: "Near " + best.name + " (" + bestD.toFixed(1) + " km)" };
    if (city && cityD <= 60) return { name: city.name, how: "Around " + city.name + " (" + Math.round(cityD) + " km)" };
    return { name: "", how: "Place not known yet. Type a name, or use Look up place names." };
  }

  function rebuildView() {
    var opts = '<option value="new">A new holiday</option>' + holidays.map(function (h) {
      return '<option value="' + esc(h.id) + '"' + (rb.target === h.id ? " selected" : "") + '>Add to: ' + esc(h.title) + ' (' + esc(niceShort(h.start)) + ' to ' + esc(nice(h.end)) + ')</option>';
    }).join("");
    var html = '<div class="intro"><span class="eyebrow">Past holidays</span><h1>Rebuild a holiday from your photos</h1>' +
      '<p>Pick photos from a past trip. The album reads the date and the place saved inside each photo by your phone or camera, sorts the photos into days, and suggests a place name for each.</p></div>' +
      '<div class="steps"><div><b>Choose photos</b><p class="muted">Drop them in the box or tap to pick. They stay on your device. Nothing is uploaded.</p></div>' +
      '<div><b>Check the names</b><p class="muted">Each group is one stop on one day. Change any name or add a note.</p></div>' +
      '<div><b>Save the holiday</b><p class="muted">Save the locked holiday file with the trip and its photos (a big holiday saves as a few files), then put it in the website folder. The steps are shown below.</p></div></div>' +
      '<div class="form"><label for="rb-target">What are these photos for?<select id="rb-target">' + opts + '</select></label>' +
      '<label for="rb-title">Holiday name<input id="rb-title" type="text" placeholder="For example: Bangkok with Grandma" value="' + esc(rb.title || "") + '"></label>' +
      '<label for="rb-sub">Cities or one line about it<input id="rb-sub" type="text" placeholder="For example: Bangkok and Hua Hin" value="' + esc(rb.sub || "") + '"></label></div>' +
      '<label class="drop" id="rb-drop" for="rb-files"><b>Drop photos here, or tap to choose</b><span class="muted">JPG, PNG and iPhone HEIC photos. You can add more at any time.</span>' +
      '<input id="rb-files" type="file" accept="image/*,.heic,.heif" multiple></label>' +
      '<div id="rb-out"></div>';
    return frame("rebuild", html);
  }

  function wireRebuild(root) {
    var drop = root.querySelector("#rb-drop"), input = root.querySelector("#rb-files");
    root.querySelector("#rb-target").addEventListener("change", function (e) { rb.target = e.target.value; drawGroups(); });
    root.querySelector("#rb-title").addEventListener("input", function (e) { rb.title = e.target.value; refreshFile(); });
    root.querySelector("#rb-sub").addEventListener("input", function (e) { rb.sub = e.target.value; refreshFile(); });
    input.addEventListener("change", function () { addFiles(input.files); input.value = ""; });
    ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("over"); }); });
    ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("over"); }); });
    drop.addEventListener("drop", function (e) { addFiles(e.dataTransfer.files); });
    drawGroups();
  }

  // Read photos a few at a time, so thousands of photos don't freeze the browser,
  // and show how far along it is. Stop keeps the photos read so far.
  function addFiles(files) {
    var list = Array.prototype.slice.call(files || []).filter(function (f) { return /^image\//.test(f.type) || /\.(heic|heif|jpe?g|png|webp)$/i.test(f.name); });
    if (!list.length || rb.busy) return;
    var out = document.getElementById("rb-out");
    var total = list.length, done = 0, started = Date.now(), items = [], next = 0, running = 0;
    var size = photoSize(rb.photos.length + total);
    rb.busy = { stop: false };
    out.insertAdjacentHTML("afterbegin", '<div class="notice busy" id="rb-busy" role="status" aria-live="polite"><div class="row"><span id="rb-busy-text">Reading ' + total + ' photos…</span>' +
      '<button class="btn small" type="button" id="rb-stop">Stop and keep these</button></div><div class="bar-track" aria-hidden="true"><span id="rb-busy-bar"></span></div></div>');
    document.getElementById("rb-stop").addEventListener("click", function () { if (rb.busy) rb.busy.stop = true; });
    function show() {
      var txt = document.getElementById("rb-busy-text"), bar = document.getElementById("rb-busy-bar");
      if (!txt) return;
      var left = done ? Math.round((Date.now() - started) / done * (total - done) / 1000) : 0;
      txt.textContent = "Reading " + done + " of " + total + " photos" + (done > 5 && left > 5 ? ", about " + (left < 90 ? left + " seconds" : Math.round(left / 60) + " minutes") + " left" : "") + "…";
      if (bar) bar.style.width = Math.round(done / total * 100) + "%";
    }
    function finish() {
      rb.busy = null;
      rb.photos = rb.photos.concat(items).sort(function (a, b) { return a.when < b.when ? -1 : 1; });
      drawGroups();
    }
    function pump() {
      if (rb.busy && rb.busy.stop) { if (!running) finish(); return; }
      while (running < 3 && next < total) {
        running++;
        readPhoto(list[next++], size).then(function (item) {
          items.push(item); running--; done++; show();
          if (next >= total && !running) finish(); else setTimeout(pump, 0);
        });
      }
    }
    pump();
  }
  // Smaller copies when there are many photos, so the holiday files stay a size GitHub accepts.
  function photoSize(n) { return n > 1500 ? { max: 960, q: 0.68 } : n > 400 ? { max: 1200, q: 0.72 } : { max: 1400, q: 0.8 }; }

  // Redraw each photo at a sensible size, plus a small preview. Redrawing removes
  // the hidden data inside the file (exact GPS place, phone model, and so on).
  function shrinkPhoto(file, size) {
    var url = URL.createObjectURL(file);
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        var w = img.naturalWidth, h = img.naturalHeight, draw = function (max, q) {
          var k = Math.min(1, max / Math.max(w, h)), c = document.createElement("canvas");
          c.width = Math.round(w * k); c.height = Math.round(h * k);
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          var s = c.toDataURL("image/jpeg", q); c.width = c.height = 0; return s;
        };
        var res = null;
        try { res = { data: draw(size.max, size.q), thumb: draw(240, 0.7) }; } catch (e) { res = null; }
        URL.revokeObjectURL(url); img.src = "";
        resolve(res);
      };
      img.onerror = function () { URL.revokeObjectURL(url); resolve(null); };
      img.src = url;
    });
  }

  function readPhoto(file, size) {
    var item = { name: file.name, heic: /\.(heic|heif)$/i.test(file.name) || /hei[cf]/.test(file.type) };
    var lib = window.exifr;
    var parse = lib ? lib.parse(file, { gps: true, tiff: true, exif: true, pick: ["DateTimeOriginal", "CreateDate", "ModifyDate", "GPSLatitude", "GPSLongitude", "GPSLatitudeRef", "GPSLongitudeRef", "latitude", "longitude"] }).catch(function () { return null; }) : Promise.resolve(null);
    return parse.then(function (tags) {
      var dt = tags && (tags.DateTimeOriginal || tags.CreateDate || tags.ModifyDate);
      if (dt instanceof Date && !isNaN(dt)) { item.when = dt.toISOString(); item.date = iso(dt); item.time = String(dt.getHours()).padStart(2, "0") + ":" + String(dt.getMinutes()).padStart(2, "0"); }
      else { var d = new Date(file.lastModified || Date.now()); item.when = d.toISOString(); item.date = iso(d); item.guessDate = true; }
      if (tags && typeof tags.latitude === "number" && typeof tags.longitude === "number") { item.lat = +tags.latitude.toFixed(5); item.lon = +tags.longitude.toFixed(5); }
      return item.heic ? null : shrinkPhoto(file, size);
    }).then(function (res) {
      if (res) { item.data = res.data; item.thumb = res.thumb; }
      return item;
    }, function () { return item; });
  }

  // Group photos: same day, and within about 1 km of the group's first photo.
  function groups() {
    var out = [];
    rb.photos.forEach(function (p) {
      var g = out.filter(function (g) {
        if (g.date !== p.date) return false;
        if (g.lat == null || p.lat == null) return g.lat == null && p.lat == null;
        return distKm(g.lat, g.lon, p.lat, p.lon) < 1;
      })[0];
      if (!g) {
        g = { key: p.date + "|" + (p.lat != null ? p.lat.toFixed(2) + "," + p.lon.toFixed(2) : "none"), date: p.date, lat: p.lat, lon: p.lon, photos: [] };
        var s = p.lat != null ? suggestPlace(p.lat, p.lon) : { name: "", how: "This photo has no place saved in it. Type where it was taken." };
        g.suggest = s;
        out.push(g);
      }
      g.photos.push(p);
    });
    rb.names = rb.names || {};
    rb.notes = rb.notes || {};
    out.forEach(function (g) { if (rb.names[g.key] == null) rb.names[g.key] = (rb.online && rb.online[g.key]) || g.suggest.name; });
    return out;
  }

  var SHOW_THUMBS = 24;
  function drawGroups() {
    var out = document.getElementById("rb-out");
    if (!out) return;
    if (!rb.photos.length) {
      out.innerHTML = '<div class="empty" style="margin-top:18px"><b>No photos chosen yet.</b><p>Tip: photos straight from your phone keep their date and place. Photos sent through WhatsApp or downloaded from Facebook usually lose them, so use the originals from your phone or Google Photos ("Download" keeps them).</p></div>';
      return;
    }
    var gs = groups();
    var withGps = rb.photos.filter(function (p) { return p.lat != null; }).length;
    var guessed = rb.photos.filter(function (p) { return p.guessDate; }).length;
    var first = rb.photos[0].date, last = rb.photos[rb.photos.length - 1].date;
    var target = holidays.filter(function (h) { return h.id === rb.target; })[0];
    var html = '<div class="notice" style="margin-top:18px">' + rb.photos.length + ' photos from ' + esc(nice(first)) + ' to ' + esc(nice(last)) + '. ' +
      withGps + ' have a place saved in them. ' + (guessed ? guessed + ' have no date inside, so we used the file date, which may be wrong. ' : "") +
      (target && (first < target.start || last > target.end) ? '<b>Some photos fall outside ' + esc(target.title) + ' (' + esc(niceShort(target.start)) + ' to ' + esc(nice(target.end)) + ').</b> They will show as extra days.' : "") + '</div>' +
      '<div class="row" style="margin-top:12px"><button class="btn" id="rb-lookup" type="button">Look up place names online</button>' +
      '<button class="btn" id="rb-clear" type="button">Start again</button><span class="tag" id="rb-lookup-msg"></span></div>';
    var lastDate = "";
    gs.forEach(function (g, i) {
      if (g.date !== lastDate) { html += '<h3 style="margin-top:26px;font-size:22px">' + esc(nice(g.date, true)) + '</h3>'; lastDate = g.date; }
      html += '<div class="group"><div class="head"><input type="text" id="rb-name-' + i + '" data-key="' + esc(g.key) + '" class="rb-name" value="' + esc(rb.names[g.key] || "") + '" placeholder="Place name" aria-label="Place name">' +
        '<span class="tag">' + esc(g.suggest.how) + (g.lat != null ? ' · <a href="https://www.google.com/maps/search/?api=1&query=' + g.lat + ',' + g.lon + '" target="_blank" rel="noopener noreferrer">see on map</a>' : "") + '</span></div>' +
        '<input type="text" id="rb-note-' + i + '" data-key="' + esc(g.key) + '" class="rb-note" value="' + esc(rb.notes[g.key] || "") + '" placeholder="A note, for example: Ice cream by the river" aria-label="Note">' +
        '<div class="thumbs">' + g.photos.slice(0, SHOW_THUMBS).map(function (p) {
          return '<div>' + (p.thumb ? '<div class="pic loaded"><img src="' + u(p.thumb) + '" alt="' + esc(p.name) + '" loading="lazy"></div>' : '<div class="pic"><div class="ph"><small>' + (p.heic ? "iPhone photo" : "Can't show") + '</small>' + esc(p.name) + '</div></div>') +
            '<span class="tag">' + esc(p.time || "") + ' ' + esc(p.name) + '</span></div>';
        }).join("") + '</div>' + (g.photos.length > SHOW_THUMBS ? '<p class="tag">and ' + (g.photos.length - SHOW_THUMBS) + ' more photos in this group, all included</p>' : "") + '</div>';
    });
    html += '<section style="margin-top:36px"><div class="section-head"><h2>Save it to the album</h2></div>' +
      '<div class="steps" id="rb-save-steps"></div>' +
      '<label for="rb-file" class="eyebrow">Holiday file</label><textarea id="rb-file" readonly></textarea>' +
      '<div class="row" style="margin-top:10px"><button class="btn primary" type="button" id="rb-save">Save holiday file</button><button class="btn" type="button" id="rb-copy">Copy holiday file</button><span class="tag" id="rb-copy-msg"></span></div></section>';
    out.innerHTML = html;
    out.querySelectorAll(".rb-name").forEach(function (el) { el.addEventListener("input", function () { rb.names[el.dataset.key] = el.value; refreshFile(); }); });
    out.querySelectorAll(".rb-note").forEach(function (el) { el.addEventListener("input", function () { rb.notes[el.dataset.key] = el.value; refreshFile(); }); });
    out.querySelector("#rb-clear").addEventListener("click", function () { rb.photos = []; rb.names = {}; rb.notes = {}; rb.online = {}; drawGroups(); });
    out.querySelector("#rb-lookup").addEventListener("click", function () { lookupOnline(gs); });
    out.querySelector("#rb-save").addEventListener("click", function () {
      var msg = document.getElementById("rb-copy-msg");
      buildFiles(msg).then(function (files) {
        files.forEach(function (f, i) {
          setTimeout(function () {
            var a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([f.text], { type: "text/javascript" }));
            a.download = f.name; document.body.appendChild(a); a.click(); a.remove();
            setTimeout(function () { URL.revokeObjectURL(a.href); }, 60000);
          }, i * 1500);
        });
        msg.textContent = files.length === 1 ? "Saved " + files[0].name + " to your Downloads folder."
          : "Saving " + files.length + " files to your Downloads folder. If the browser asks, allow it to download multiple files.";
      }, function () { msg.textContent = "This browser could not lock the file. Open the album from the website (https) and try again."; });
    });
    out.querySelector("#rb-copy").addEventListener("click", function () {
      var ta = document.getElementById("rb-file"), msg = document.getElementById("rb-copy-msg");
      buildFiles(msg).then(function (files) {
        if (files.length > 1 || files[0].text.length > 1500000) { msg.textContent = "Too big to copy. Use Save holiday file instead."; return; }
        ta.value = files[0].text;
        var done = function () { msg.textContent = "Copied. Paste it into Notepad and save it as described above."; };
        try { navigator.clipboard.writeText(files[0].text).then(done, function () { ta.select(); msg.textContent = "Press Ctrl+C (or Cmd+C) to copy the selected text."; }); }
        catch (e) { ta.select(); msg.textContent = "Press Ctrl+C (or Cmd+C) to copy the selected text."; }
      }, function () { msg.textContent = "This browser could not lock the file. Open the album from the website (https) and try again."; });
    });
    refreshFile();
  }

  // Ask OpenStreetMap for the name of each place, one every 1.2 seconds (their rule).
  function lookupOnline(gs) {
    var msg = document.getElementById("rb-lookup-msg");
    var todo = gs.filter(function (g) { return g.lat != null; });
    if (!todo.length) { msg.textContent = "None of these photos has a place saved in it."; return; }
    rb.online = rb.online || {};
    var i = 0, failed = 0;
    (function next() {
      if (i >= todo.length) { msg.textContent = failed === todo.length ? "Could not reach OpenStreetMap from here. Open the album from your computer or the website to use this." : "Place names updated. Check them below."; drawGroups(); return; }
      var g = todo[i++];
      msg.textContent = "Looking up " + i + " of " + todo.length + "…";
      fetch("https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=17&accept-language=en&lat=" + g.lat + "&lon=" + g.lon)
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var a = d.address || {};
          var name = d.name || a.tourism || a.attraction || a.amenity || a.leisure || a.shop || a.road || "";
          var area = a.suburb || a.city_district || a.city || a.town || a.village || a.county || "";
          var full = [name, area].filter(Boolean).join(", ");
          if (full) { rb.online[g.key] = full; if (!rb.names[g.key] || rb.names[g.key] === g.suggest.name) rb.names[g.key] = full; }
        })
        .catch(function () { failed++; })
        .then(function () { setTimeout(next, 1200); });
    })();
  }

  function slug(s) { return String(s || "holiday").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "holiday"; }

  function refreshFile() {
    var ta = document.getElementById("rb-file");
    if (!ta || !rb.photos.length) return;
    var gs = groups();
    var target = holidays.filter(function (h) { return h.id === rb.target; })[0];
    var first = rb.photos[0].date, last = rb.photos[rb.photos.length - 1].date;
    var id = target ? target.id : slug((rb.title || "holiday") + (String(rb.title || "").indexOf(first.slice(0, 4)) >= 0 ? "" : "-" + first.slice(0, 4)));
    var folder = "photos/" + id + "/";
    var memories = [];
    gs.forEach(function (g) {
      g.photos.forEach(function (p) {
        if (!p.data) return;
        var m = { date: p.date, file: p.name, image: p.data, place: rb.names[g.key] || "" };
        if (rb.notes[g.key]) m.caption = rb.notes[g.key];
        if (p.time) m.time = p.time;
        if (p.lat != null) { m.lat = +p.lat.toFixed(3); m.lon = +p.lon.toFixed(3); }
        memories.push(m);
      });
    });
    var steps = document.getElementById("rb-save-steps");
    var hol, isNew = !target;
    if (target) {
      // The whole holiday again, with the new photos added (same file name replaces the old one).
      hol = Object.assign({}, target, { memories: target.memories.slice() });
      var have = {};
      hol.memories.forEach(function (m) { have[m.date + "|" + (m.file || m.image)] = true; });
      memories.forEach(function (m) { if (!have[m.date + "|" + m.file]) hol.memories.push(m); });
      hol.memories.sort(function (a, b) { return (a.date + (a.time || "")) < (b.date + (b.time || "")) ? -1 : 1; });
    } else {
      // A new holiday: days come from the photo groups.
      var byDay = {};
      gs.forEach(function (g) { (byDay[g.date] = byDay[g.date] || []).push(g); });
      var days = Object.keys(byDay).sort().map(function (date) {
        var places = byDay[date].map(function (g) {
          var p = { name: rb.names[g.key] || "Somewhere nice", type: "sight" };
          if (g.lat != null) { p.lat = +g.lat.toFixed(3); p.lon = +g.lon.toFixed(3); }
          if (rb.notes[g.key]) p.note = rb.notes[g.key];
          return p;
        });
        var names = places.map(function (p) { return p.name; });
        return { date: date, title: names.slice(0, 2).join(" and "), places: places };
      });
      hol = {
        id: id, title: rb.title || "Our holiday", subtitle: rb.sub || "", start: first, end: last,
        cover: { image: memories[0] ? memories[0].image : "" }, summary: "", days: days, memories: memories
      };
    }
    // Big holidays are split into parts of about 30 MB of photos (about 40 MB once locked), well under GitHub's 100 MB limit.
    var parts = [[]], size = 0, LIMIT = 30 * 1048576;
    hol.memories.forEach(function (m) {
      var n = (m.image || "").length;
      if (size + n > LIMIT && parts[parts.length - 1].length) { parts.push([]); size = 0; }
      parts[parts.length - 1].push(m); size += n;
    });
    var names = parts.map(function (x, i) { return i ? id + ".photos-" + (i + 1) + ".js" : id + ".js"; });
    rb.plan = { hol: hol, parts: parts, names: names, id: id };
    rb.built = null;
    var listLine = names.map(function (n) { return '"' + esc(n) + '",'; }).join("</code> <code>");
    var skipped = rb.photos.filter(function (p) { return !p.data; }).length;
    steps.innerHTML = '<div><b>Save the holiday ' + (names.length > 1 ? names.length + ' files' : 'file') + '</b><p class="muted">Press <b>Save holiday file</b> below. Your photos are inside, locked with your passkey, with their hidden phone data removed.' +
      (names.length > 1 ? ' There are ' + hol.memories.length + ' photos, so they are split into ' + names.length + ' files.' : '') +
      (skipped ? ' ' + skipped + ' photos could not be added (iPhone HEIC photos, or files the browser could not open). Change them to JPG first.' : '') + '</p></div>' +
      '<div><b>Put it in the website</b><p class="muted">Move the saved ' + (names.length > 1 ? 'files' : 'file') + ' into the <code>holidays</code> folder' + (isNew ? '' : ', replacing the old ones') + ': <code>' + names.map(esc).join('</code>, <code>') + '</code>.</p></div>' +
      '<div><b>Add it to the list</b><p class="muted">Open <code>holidays/list.js</code> and add <code>' + listLine + '</code>' + (isNew ? '' : ' (any names not there yet)') + '. Then open index.html.</p></div>' +
      '<div><b>Or ask Claude</b><p class="muted">Send Claude the saved ' + (names.length > 1 ? 'files' : 'file') + ', and it will put them in the album for you.</p></div>';
    ta.value = hol.memories.length + " photos ready. Press Save holiday file to lock them with your passkey and save.";
  }
  // Lock each part with the passkey, one after another, showing progress.
  function buildFiles(msg) {
    var plan = rb.plan;
    if (!plan) return Promise.reject();
    if (rb.built && rb.built.plan === plan) return Promise.resolve(rb.built.files);
    var files = [], stamp = today();
    return plan.parts.reduce(function (chain, mems, i) {
      return chain.then(function () {
        if (msg) msg.textContent = "Locking " + (plan.parts.length > 1 ? "file " + (i + 1) + " of " + plan.parts.length : "the holiday file") + "…";
        var body = i ? { partOf: plan.id, part: i + 1, memories: mems } : Object.assign({}, plan.hol, { memories: mems, photoParts: plan.parts.length });
        return lockHoliday(body, unlockedKey).then(function (box) {
          files.push({ name: plan.names[i], text: "/* " + plan.hol.title + (i ? ", photos part " + (i + 1) : "") + ". Holiday file made by Rebuild from photos on " + stamp + ". Locked with the album passkey. Save as holidays/" + plan.names[i] + " */\nHolidayAlbum.addLocked(" + JSON.stringify(box) + ");\n" });
        });
      });
    }, Promise.resolve()).then(function () { rb.built = { plan: plan, files: files }; return files; });
  }
  var refreshSeq = 0;

  // ---------- passkey lock ----------
  // Holiday files are locked (encrypted) with the album passkey, so anyone who
  // opens the files on GitHub sees only scrambled text. The passkey itself is
  // never saved in the website; the right passkey is the only thing that can
  // turn the files back into trips.
  var locked = [], unlockedKey = "";
  function b64(buf) { var s = "", a = new Uint8Array(buf); for (var i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000)); return btoa(s); }
  function unb64(s) { var bin = atob(s), a = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return a; }
  function deriveKey(pass, salt, iter) {
    var enc = new TextEncoder();
    return crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]).then(function (base) {
      return crypto.subtle.deriveKey({ name: "PBKDF2", salt: salt, iterations: iter, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    });
  }
  function lockHoliday(h, pass) {
    var salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12)), iter = 600000;
    return deriveKey(pass, salt, iter).then(function (key) {
      return crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, new TextEncoder().encode(JSON.stringify(h)));
    }).then(function (data) { return { v: 1, iter: iter, salt: b64(salt), iv: b64(iv), data: b64(data) }; });
  }
  function openBox(box, pass) {
    return deriveKey(pass, unb64(box.salt), box.iter).then(function (key) {
      return crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(box.iv) }, key, unb64(box.data));
    }).then(function (plain) { return JSON.parse(new TextDecoder().decode(plain)); });
  }
  function tryUnlock(pass) {
    return Promise.all(locked.map(function (box) { return openBox(box, pass); })).then(function (list) {
      list.forEach(function (h) { HolidayAlbum.add(h); });
      locked = [];
      unlockedKey = pass;
    });
  }
  function savedPass() { try { return sessionStorage.getItem("album-pass") || localStorage.getItem("album-pass") || ""; } catch (e) { return ""; } }
  function rememberPass(pass, always) { try { sessionStorage.setItem("album-pass", pass); if (always) localStorage.setItem("album-pass", pass); } catch (e) { } }
  function forgetPass() { try { sessionStorage.removeItem("album-pass"); localStorage.removeItem("album-pass"); } catch (e) { } }

  function gateView() {
    return '<div class="gate"><div class="gate-card"><span class="seal big" aria-hidden="true">旅</span>' +
      '<h1>Our Holiday Album</h1><p class="muted">This album is for our family. Enter the passkey to open it.</p>' +
      '<form id="gate-form" autocomplete="off"><label for="gate-pass" class="eyebrow">Passkey</label>' +
      '<input id="gate-pass" type="password" autocomplete="current-password" required>' +
      '<label class="check" for="gate-remember"><input id="gate-remember" type="checkbox"> Remember on this device</label>' +
      '<button class="btn primary" type="submit" id="gate-go">Open the album</button>' +
      '<p class="gate-msg" id="gate-msg" role="status"></p></form></div></div>';
  }
  function showGate() {
    var root = document.getElementById("app");
    root.innerHTML = gateView();
    document.title = "Family Holiday Album";
    var form = root.querySelector("#gate-form"), input = root.querySelector("#gate-pass"), msg = root.querySelector("#gate-msg"), go = root.querySelector("#gate-go");
    input.focus();
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var pass = input.value;
      if (!window.crypto || !crypto.subtle) { msg.textContent = "This browser can't open locked files. Try Chrome, Edge or Safari."; return; }
      go.disabled = true; msg.textContent = "Opening…";
      tryUnlock(pass).then(function () {
        rememberPass(pass, root.querySelector("#gate-remember").checked);
        begin();
      }, function () {
        go.disabled = false; input.select();
        msg.textContent = "That passkey doesn't match. Check the spelling and try again.";
      });
    });
  }
  function begin() {
    if (!begun) { begun = true; window.addEventListener("hashchange", render); }
    render();
  }
  var begun = false;

  // ---------- start ----------
  // Photo part files (holiday.photos-2.js and on) join their holiday; a repeated photo is kept once.
  var photoParts = [];
  function mergeParts() {
    photoParts.splice(0).forEach(function (part) {
      var h = holidays.filter(function (x) { return x.id === part.partOf; })[0];
      if (!h) return;
      var have = {};
      h.memories.forEach(function (m) { have[m.date + "|" + (m.file || m.image)] = true; });
      (part.memories || []).forEach(function (m) { if (!have[m.date + "|" + (m.file || m.image)]) h.memories.push(m); });
      h.memories.sort(function (a, b) { return (a.date + (a.time || "")) < (b.date + (b.time || "")) ? -1 : 1; });
    });
  }
  function render() {
    var id = (location.hash || "#home").slice(1);
    mergeParts();
    var root = document.getElementById("app");
    var h = holidays.filter(function (x) { return x.id === id; })[0];
    moreList = [];
    if (id === "rebuild") { root.innerHTML = rebuildView(); wireRebuild(root); }
    else if (h) root.innerHTML = holidayView(h);
    else if (id.indexOf("-day") > 0 && holidays.some(function (x) { return id.indexOf(x.id + "-day") === 0; })) return;
    else root.innerHTML = homeView();
    wireMore(root);
    var lockBtn = root.querySelector('[data-action="lock"]');
    if (lockBtn) lockBtn.addEventListener("click", function () { HolidayAlbum.lock(); });
    wirePics(root);
    if (!/-day\d+$/.test(id)) window.scrollTo(0, 0);
    document.title = (h ? h.title + " · " : id === "rebuild" ? "Rebuild from photos · " : "") + "Family Holiday Album";
  }

  window.HolidayAlbum = {
    add: function (h) {
      if (h.partOf) { photoParts.push(h); return; }
      h.cover = h.cover || {}; h.memories = h.memories || []; holidays.push(h);
    },
    addLocked: function (box) { locked.push(box); },
    lock: function () { forgetPass(); location.hash = "#home"; location.reload(); },
    start: function () {
      if (!locked.length) return begin();
      var pass = savedPass();
      if (!pass) return showGate();
      tryUnlock(pass).then(begin, function () { forgetPass(); showGate(); });
    }
  };
})();
