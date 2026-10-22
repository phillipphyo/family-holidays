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
  function pic(opts) {
    var src = opts.image || (opts.wiki && (window.ALBUM_IMAGES || {})[opts.wiki]) || "";
    var wiki = !src && opts.wiki ? opts.wiki : "";
    if (wiki && wikiCache[wiki]) src = wikiCache[wiki];
    if (wiki && !wikiCache[wiki]) wikiWanted[wiki] = true;
    var credit = opts.wiki ? '<a class="credit" href="https://en.wikipedia.org/wiki/' + esc(encodeURIComponent(opts.wiki.replace(/ /g, "_"))) + '" target="_blank" rel="noopener noreferrer">Wikipedia</a>' : "";
    return '<div class="pic' + (opts.cls ? " " + opts.cls : "") + '" style="--tone:' + tone(opts.type) + '" data-wiki="' + esc(wiki) + '">' +
      '<div class="ph"><small>' + esc(opts.label || TYPE_LABEL[opts.type] || "") + '</small>' + esc(opts.name || "") + '</div>' +
      (src ? '<img src="' + u(src) + '" alt="' + esc(opts.name || "") + '" loading="lazy">' : "") +
      (src && !opts.image && opts.wiki && !opts.inLink ? credit : "") +
      (opts.credit && opts.inLink ? '<span class="credit">' + esc("Photo" + (opts.credit.by ? ": " + opts.credit.by : ": Wikipedia") + (opts.credit.licence ? " · " + opts.credit.licence : "")) + '</span>' : "") +
      (opts.credit && !opts.inLink ? '<a class="credit" href="' + u(opts.credit.url) + '" target="_blank" rel="noopener noreferrer" title="Who took this photo">' +
        esc("Photo" + (opts.credit.by ? ": " + opts.credit.by : ": Wikipedia") + (opts.credit.licence ? " · " + opts.credit.licence : "")) + '</a>' : "") + '</div>';
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
        img.alt = t; img.loading = "lazy";
        img.onload = function () { box.classList.add("loaded"); };
        img.onerror = function () { img.remove(); };
        img.src = safeUrl(wikiCache[t]);
        box.appendChild(img);
        box.insertAdjacentHTML("beforeend", '<a class="credit" href="https://en.wikipedia.org/wiki/' + encodeURIComponent(t.replace(/ /g, "_")) + '" target="_blank" rel="noopener noreferrer">Wikipedia</a>');
      });
    }).catch(function () { /* No internet or blocked: the patterned tiles stay. */ });
  }

  function linkRow(p, small) {
    var c = "btn" + (small ? " small" : "");
    return '<div class="links">' +
      '<a class="' + c + '" href="' + u(photosUrl(p)) + '" target="_blank" rel="noopener noreferrer">Photos</a>' +
      '<a class="' + c + '" href="' + u(videosUrl(p)) + '" target="_blank" rel="noopener noreferrer">Videos</a>' +
      '<a class="' + c + '" href="' + u(mapUrl(p)) + '" target="_blank" rel="noopener noreferrer">Map pin</a>' +
      (p.infoUrl ? '<a class="' + c + '" href="' + u(p.infoUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(p.infoLabel || "More info") + '</a>' : "") + '</div>';
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
      '<footer class="wrap">Pictures marked Wikipedia come from that place\'s Wikipedia page. Our own photos are kept inside the locked holiday files.</footer>';
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
      '<div><span class="eyebrow">Photos</span><b>' + (h.memories || []).length + '</b></div></div>' +
      (h.walkingTotal ? '<p class="muted walk-total">' + esc(h.walkingTotal) + '</p>' : "") +
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
          return '<article class="stay">' + pic({ image: s.image, wiki: s.wiki, credit: s.credit, name: s.name, type: "hotel", label: s.city }) +
            '<div class="body"><span class="eyebrow">' + esc(s.city) + ' · ' + esc(s.nights) + '</span><h3>' + esc(s.name) + '</h3>' +
            (s.why ? '<p class="muted">' + esc(s.why) + '</p>' : "") + linkRow(s) + '</div></article>';
        }).join("") + '</div></section>';
    }

    html += '<section><div class="section-head"><h2>Day by day</h2><span class="eyebrow">Tap Photos, Videos or Map pin on any stop</span></div>';
    (h.days || []).forEach(function (d, i) {
      var dd = parseDate(d.date), route = dayRouteUrl(d), mem = byDate[d.date] || [];
      delete byDate[d.date];
      html += '<article class="day" id="' + esc(h.id + "-day" + (i + 1)) + '"><div class="ticket">' +
        '<div class="stub"><span class="d">Day ' + (i + 1) + '</span><span class="big">' + dd.getDate() + '</span><span class="d">' + WD[dd.getDay()] + ' ' + MON[dd.getMonth()] + '</span></div>' +
        '<div class="main"><h3>' + esc(d.title || d.city || "") + '</h3>' +
        '<div class="meta">' + (d.city ? '<span>In <b>' + esc(d.city) + '</b></span>' : "") + (d.sleep ? '<span>Sleep at <b>' + esc(d.sleep) + '</b></span>' : "") + '</div>' +
        (d.travel ? '<p class="travel">' + esc(d.travel) + '</p>' : "") +
        (d.walk || d.ifTired ? '<div class="walk">' + (d.walk ? '<span><b>Walking</b> ' + esc(d.walk) + '</span>' : "") + (d.ifTired ? '<span><b>If tired</b> ' + esc(d.ifTired) + '</span>' : "") + '</div>' : "") +
        (route ? '<div class="links"><a class="btn small" href="' + u(route) + '" target="_blank" rel="noopener noreferrer">Today\'s stops in Google Maps</a></div>' : "") +
        '</div></div>';
      if ((d.places || []).length) {
        html += '<div class="places">' + d.places.map(function (p) {
          return '<div class="place">' + pic({ image: p.image, wiki: p.wiki, credit: p.credit, name: p.name, type: p.type }) +
            '<div class="body"><div class="top"><span class="chip" style="color:' + tone(p.type) + '">' + esc(TYPE_LABEL[p.type] || "Place") + '</span>' +
            (p.time ? '<span class="time">' + esc(p.time) + '</span>' : "") + '</div>' +
            '<h4>' + esc(p.name) + '</h4>' + (p.note ? '<p class="note">' + esc(p.note) + '</p>' : "") + linkRow(p, true) + '</div></div>';
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
      '<div><b>Save the holiday</b><p class="muted">Save one locked file that holds the trip and its photos, then put it in the website folder. The steps are shown below.</p></div></div>' +
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

  function addFiles(files) {
    var list = Array.prototype.slice.call(files || []).filter(function (f) { return /^image\//.test(f.type) || /\.(heic|heif|jpe?g|png|webp)$/i.test(f.name); });
    if (!list.length) return;
    var out = document.getElementById("rb-out");
    out.insertAdjacentHTML("afterbegin", '<p class="notice" id="rb-busy">Reading ' + list.length + ' photos…</p>');
    Promise.all(list.map(readPhoto)).then(function (items) {
      rb.photos = rb.photos.concat(items).sort(function (a, b) { return a.when < b.when ? -1 : 1; });
      drawGroups();
    });
  }

  // Redraw each photo at a sensible size. Redrawing removes the hidden data
  // inside the file (exact GPS place, phone model, and so on).
  function shrinkPhoto(file) {
    var url = URL.createObjectURL(file);
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        var max = 1400, w = img.naturalWidth, h = img.naturalHeight, k = Math.min(1, max / Math.max(w, h));
        var c = document.createElement("canvas"); c.width = Math.round(w * k); c.height = Math.round(h * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        try { resolve(c.toDataURL("image/jpeg", 0.8)); } catch (e) { resolve(null); }
      };
      img.onerror = function () { URL.revokeObjectURL(url); resolve(null); };
      img.src = url;
    });
  }

  function readPhoto(file) {
    var item = { file: file, name: file.name, url: URL.createObjectURL(file), heic: /\.(heic|heif)$/i.test(file.name) || /hei[cf]/.test(file.type) };
    var lib = window.exifr;
    var parse = lib ? lib.parse(file, { gps: true, tiff: true, exif: true, pick: ["DateTimeOriginal", "CreateDate", "ModifyDate", "GPSLatitude", "GPSLongitude", "GPSLatitudeRef", "GPSLongitudeRef", "latitude", "longitude"] }).catch(function () { return null; }) : Promise.resolve(null);
    return parse.then(function (tags) {
      var dt = tags && (tags.DateTimeOriginal || tags.CreateDate || tags.ModifyDate);
      if (dt instanceof Date && !isNaN(dt)) { item.when = dt.toISOString(); item.date = iso(dt); item.time = String(dt.getHours()).padStart(2, "0") + ":" + String(dt.getMinutes()).padStart(2, "0"); }
      else { var d = new Date(file.lastModified || Date.now()); item.when = d.toISOString(); item.date = iso(d); item.guessDate = true; }
      if (tags && typeof tags.latitude === "number" && typeof tags.longitude === "number") { item.lat = +tags.latitude.toFixed(5); item.lon = +tags.longitude.toFixed(5); }
      return item.heic ? null : shrinkPhoto(file);
    }).then(function (data) {
      item.data = data;
      return item;
    });
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
        '<div class="thumbs">' + g.photos.map(function (p) {
          return '<div>' + (p.heic ? '<div class="pic"><div class="ph"><small>iPhone photo</small>' + esc(p.name) + '</div></div>' : '<div class="pic loaded"><img src="' + p.url + '" alt="' + esc(p.name) + '"></div>') +
            '<span class="tag">' + esc(p.time || "") + ' ' + esc(p.name) + '</span></div>';
        }).join("") + '</div></div>';
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
      if (!rb.fileText) { msg.textContent = "Still locking the file. Try again in a moment."; return; }
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([rb.fileText], { type: "text/javascript" }));
      a.download = rb.fileName; document.body.appendChild(a); a.click(); a.remove();
      msg.textContent = "Saved " + rb.fileName + " to your Downloads folder.";
    });
    out.querySelector("#rb-copy").addEventListener("click", function () {
      var ta = document.getElementById("rb-file"), msg = document.getElementById("rb-copy-msg");
      var done = function () { msg.textContent = "Copied. Paste it into Notepad and save it as described above."; };
      try { navigator.clipboard.writeText(rb.fileText || ta.value).then(done, function () { ta.select(); msg.textContent = "Press Ctrl+C (or Cmd+C) to copy the selected text."; }); }
      catch (e) { ta.select(); msg.textContent = "Press Ctrl+C (or Cmd+C) to copy the selected text."; }
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
    var id = target ? target.id : slug((rb.title || "holiday") + "-" + first.slice(0, 4));
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
      hol = JSON.parse(JSON.stringify(target));
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
    var skipped = rb.photos.filter(function (p) { return !p.data; }).length;
    steps.innerHTML = '<div><b>Save the holiday file</b><p class="muted">Press <b>Save holiday file</b> below. Your photos are inside it, locked with your passkey, with their hidden phone data removed.' +
      (skipped ? ' ' + skipped + ' iPhone HEIC photos could not be added. Change them to JPG first.' : '') + '</p></div>' +
      '<div><b>Put it in the website</b><p class="muted">Move the saved file into the <code>holidays</code> folder as <code>' + esc(id) + '.js</code>' + (isNew ? '' : ', replacing the old one') + '.</p></div>' +
      (isNew ? '<div><b>Add it to the list</b><p class="muted">Open <code>holidays/list.js</code> and add <code>"' + esc(id) + '.js",</code> on a new line. Then open index.html.</p></div>'
             : '<div><b>Open the album</b><p class="muted">Open index.html again. Each photo now shows under its day.</p></div>') +
      '<div><b>Or ask Claude</b><p class="muted">Send Claude the saved file, and it will put it in the album for you.</p></div>';
    var mine = ++refreshSeq;
    ta.value = "Locking the holiday file…";
    lockHoliday(hol, unlockedKey).then(function (box) {
      if (mine !== refreshSeq) return;
      var text = "/* " + hol.title + ". Holiday file made by Rebuild from photos on " + today() + ". Locked with the album passkey. Save as holidays/" + id + ".js */\nHolidayAlbum.addLocked(" + JSON.stringify(box) + ");\n";
      rb.fileText = text; rb.fileName = id + ".js";
      ta.value = text.length < 1500000 ? text : "The file is " + Math.round(text.length / 1048576) + " MB, too big to show here. Use Save holiday file.";
    }, function () { ta.value = "This browser could not lock the file. Open the album from the website (https) and try again."; });
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
  function render() {
    var id = (location.hash || "#home").slice(1);
    var root = document.getElementById("app");
    var h = holidays.filter(function (x) { return x.id === id; })[0];
    if (id === "rebuild") { root.innerHTML = rebuildView(); wireRebuild(root); }
    else if (h) root.innerHTML = holidayView(h);
    else if (id.indexOf("-day") > 0 && holidays.some(function (x) { return id.indexOf(x.id + "-day") === 0; })) return;
    else root.innerHTML = homeView();
    var lockBtn = root.querySelector('[data-action="lock"]');
    if (lockBtn) lockBtn.addEventListener("click", function () { HolidayAlbum.lock(); });
    wirePics(root);
    if (!/-day\d+$/.test(id)) window.scrollTo(0, 0);
    document.title = (h ? h.title + " · " : id === "rebuild" ? "Rebuild from photos · " : "") + "Family Holiday Album";
  }

  window.HolidayAlbum = {
    add: function (h) { h.cover = h.cover || {}; h.memories = h.memories || []; holidays.push(h); },
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
