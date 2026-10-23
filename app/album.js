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
    ["San Francisco", 37.7749, -122.4194], ["Vancouver", 49.2827, -123.1207], ["Maldives", 3.2028, 73.2207], ["Delhi", 28.6139, 77.2090],
    ["Berlin", 52.5200, 13.4050], ["Munich", 48.1351, 11.5820], ["Frankfurt", 50.1109, 8.6821], ["Cologne", 50.9375, 6.9603], ["Hamburg", 53.5511, 9.9937],
    ["Milan", 45.4642, 9.1900], ["Venice", 45.4408, 12.3155], ["Florence", 43.7696, 11.2558], ["Pisa", 43.7228, 10.4017], ["Naples", 40.8518, 14.2681],
    ["Lake Como", 45.9937, 9.2575], ["Prague", 50.0755, 14.4378], ["Vienna", 48.2082, 16.3738], ["Salzburg", 47.8095, 13.0550], ["Hallstatt", 47.5622, 13.6493],
    ["Innsbruck", 47.2692, 11.4041], ["Budapest", 47.4979, 19.0402], ["Krakow", 50.0647, 19.9450], ["Lucerne", 47.0502, 8.3093], ["Interlaken", 46.6863, 7.8632],
    ["Zermatt", 46.0207, 7.7491], ["Geneva", 46.2044, 6.1432], ["Brussels", 50.8503, 4.3517], ["Bruges", 51.2093, 3.2247], ["Luxembourg", 49.6116, 6.1319],
    ["Lisbon", 38.7223, -9.1393], ["Porto", 41.1579, -8.6291], ["Madrid", 40.4168, -3.7038], ["Seville", 37.3891, -5.9845], ["Nice", 43.7102, 7.2620],
    ["Monaco", 43.7384, 7.4246], ["Lyon", 45.7640, 4.8357], ["Copenhagen", 55.6761, 12.5683], ["Stockholm", 59.3293, 18.0686], ["Oslo", 59.9139, 10.7522],
    ["Edinburgh", 55.9533, -3.1883], ["Dublin", 53.3498, -6.2603], ["Athens", 37.9838, 23.7275], ["Santorini", 36.3932, 25.4615], ["Dubrovnik", 42.6507, 18.0944],
    ["Reykjavik", 64.1466, -21.9426], ["Helsinki", 60.1699, 24.9384], ["Warsaw", 52.2297, 21.0122], ["Strasbourg", 48.5734, 7.7521], ["Heidelberg", 49.3988, 8.6724]
  ];

  // ---------- small helpers ----------
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  // Only allow web links, embedded pictures and files inside this website.
  function safeMedia(v) { return /^data:video\/(webm|mp4);base64,/i.test(String(v || "")) ? v : ""; }
  // YouTube links: only a checked 11-character video id is ever kept or put into a player address.
  var YT_RE = /^(?:https?:\/\/)?(?:www\.|m\.|music\.)?(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#\s]*&)?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?=$|[?&#\/\s])/i;
  function ytToken(s) { s = String(s || ""); var m = s.match(/https?:\/\/\S+/i) || s.match(/(?:www\.|m\.|youtu)\S*\/\S+/i); return m ? m[0] : ""; }
  function ytId(s) {
    var t = ytToken(s);
    if (!t || /^(?:https?:\/\/)?(?:www\.)?google\.[a-z.]+\/url/i.test(t)) return "";
    var m = t.match(YT_RE); return m ? m[1] : "";
  }
  function ytStart(s) { var m = String(s || "").match(/[?&#](?:t|start)=(\d+)s?(?:$|[&#])/); return m ? Math.min(86400, parseInt(m[1], 10)) : 0; }
  function okYt(id) { return /^[A-Za-z0-9_-]{11}$/.test(String(id || "")); }
  function ytWatch(id) { return "https://www.youtube.com/watch?v=" + id; }
  function ytKind(s) {
    s = String(s || "").trim();
    if (!s) return "empty";
    if (ytId(s)) return "ok";
    if (/youtu/i.test(s) && /[?&]list=/.test(s)) return "playlist";
    return "bad";
  }
  function canClip() { return !!(window.MediaRecorder && HTMLCanvasElement.prototype.captureStream); }
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
      var shots = {};
      mem.forEach(function (m) { if (m.stop) shots[m.stop] = (shots[m.stop] || 0) + 1; });
      if ((d.places || []).length) {
        html += '<div class="places">' + d.places.map(function (p) {
          return '<div class="place">' + pic({ image: p.image, wiki: p.wiki, credit: p.credit, name: p.name, type: p.type, area: p.areaPhoto, decorative: true }) +
            '<div class="body"><div class="top"><span class="chip" style="color:' + tone(p.type) + '">' + esc(TYPE_LABEL[p.type] || "Place") + '</span>' +
            (p.time ? '<span class="time">' + esc(p.time) + '</span>' : "") + (shots[p.name] ? '<span class="time">📷 ' + shots[p.name] + '</span>' : "") + '</div>' +
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
  // The YouTube player only appears after a tap, one at a time, built from the checked video id.
  var ytOpen = null;
  function closeYt(refocus) {
    if (!ytOpen) return;
    var o = ytOpen; ytOpen = null;
    o.box.replaceWith(o.was); o.fig.classList.remove("playing");
    if (refocus && o.btn.isConnected) o.btn.focus();
  }
  function openYt(btn) {
    closeYt(false);
    var id = btn.getAttribute("data-yt"), start = parseInt(btn.getAttribute("data-start"), 10) || 0;
    if (!okYt(id)) return;
    var fig = btn.closest("figure"); if (!fig) return;
    fig.querySelectorAll("video").forEach(function (v) { v.pause(); });
    document.querySelectorAll("figure.vid video").forEach(function (v) { v.pause(); });
    var was = btn.classList.contains("yt-full") ? (fig.querySelector(".pic") || btn) : btn;
    var box = document.createElement("div"); box.className = "yt-box";
    var f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&playsinline=1" + (start ? "&start=" + start : "");
    f.title = "Video: " + (btn.getAttribute("data-title") || "");
    f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen = true;
    var close = document.createElement("button"); close.type = "button"; close.className = "btn small yt-close"; close.textContent = "Close video";
    close.addEventListener("click", function () { closeYt(true); });
    box.appendChild(f); box.appendChild(close);
    was.replaceWith(box); fig.classList.add("playing");
    ytOpen = { box: box, was: was, fig: fig, btn: btn };
    f.focus();
  }
  // A day's photos, under a small heading for each stop. Big days are drawn only when they come near
  // the screen, each stop shows a first page of photos, and the pictures are set from script, so the
  // page never parses megabytes of image text. Tapping a photo opens the photo viewer.
  var memReg = [], gridReg = [], gridSeen = null;
  function pageSize() { return window.matchMedia && matchMedia("(max-width: 600px)").matches ? 12 : 24; }
  function memoryGrid(list) {
    var k = gridReg.push(list) - 1;
    return '<div class="mem-lazy" data-grid="' + k + '" style="min-height:' + Math.min(2400, 120 + Math.ceil(list.length / 4) * 180) + 'px"></div>';
  }
  function memoryGridNow(list) {
    var fig = function (m) {
      var mid = memReg.push(m) - 1;
      if (m.kind === "video") {
        var yid = okYt(m.yt) ? m.yt : ytId(m.link), st = Math.max(0, Math.floor(+m.ytStart || 0)) || 0;
        var label = m.caption || m.place || "video", data = ' data-yt="' + esc(yid) + '" data-start="' + st + '" data-title="' + esc(label) + '"';
        var cap = '<figcaption>' + esc(m.caption || m.place || "") + (m.duration ? ' · ' + mmss(m.duration) + ' video' : ' · video') +
          (yid ? ' · <a href="' + u(ytWatch(yid)) + '" target="_blank" rel="noopener noreferrer">Open on YouTube</a><span class="yt-note">If the video will not play, open it on YouTube.</span>'
            : m.link ? ' · <a href="' + u(m.link) + '" target="_blank" rel="noopener noreferrer">Full video</a>' : "") + '</figcaption>';
        var still = '<img data-mid="' + mid + '" alt="" decoding="async"><span class="vid-badge" aria-hidden="true">▶ ' + mmss(m.duration) + '</span>';
        if (m.clip) return '<figure class="vid"><div class="pic loaded"><video controls playsinline preload="none" data-mid="' + mid + '" src="' + safeMedia(m.clip) + '" aria-label="20-second clip: ' + esc(label) + '"></video></div>' +
          (yid ? '<button type="button" class="btn small yt-full"' + data + '>Watch full video</button>' : "") + cap + '</figure>';
        if (yid) return '<figure class="vid"><button type="button" class="pic loaded vid-poster yt-play"' + data + ' aria-label="Play video: ' + esc(label) + (m.duration ? ", " + mmss(m.duration) : "") + '">' + still + '</button>' + cap + '</figure>';
        return '<figure class="vid"><div class="pic loaded vid-poster">' + still.replace('alt=""', 'alt="Video at ' + esc(m.place || "") + '"') + '</div>' + cap + '</figure>';
      }
      return '<figure><button type="button" class="pic photo-open" data-open="' + mid + '" aria-label="Open photo: ' + esc(m.caption || m.place || "photo") + '"><img data-mid="' + mid + '" alt="" decoding="async"></button>' +
        '<figcaption>' + esc(m.caption || m.place || "") + (m.place && m.caption ? " · " + esc(m.place) : "") + '</figcaption></figure>';
    };
    var order = [], by = {};
    list.forEach(function (m) { var k = m.stop || m.place || ""; if (!by[k]) { by[k] = []; order.push(k); } by[k].push(m); });
    var page = pageSize();
    var block = function (items, k) {
      var first = items.slice(0, page), more = items.length - first.length;
      var j = gridReg.push(items.slice(page)) - 1;
      return '<div class="memories">' + first.map(fig).join("") + '</div>' +
        (more > 0 ? '<button type="button" class="btn small mem-more" data-rest="' + j + '">Show all ' + items.length + ' photos' + (k ? ' from ' + esc(k) : '') + '</button>' : "");
    };
    if (order.length < 2 && !list.some(function (m) { return m.stop; })) return block(list, "");
    return order.map(function (k) {
      return '<div class="mem-group"><h4><span aria-hidden="true">📷</span> ' + esc(k || "Other photos") + ' <span class="muted">' + by[k].length + '</span></h4>' + block(by[k], k) + '</div>';
    }).join("");
  }
  function fillPics(box) {
    box.querySelectorAll("img[data-mid]").forEach(function (img) {
      var m = memReg[+img.getAttribute("data-mid")]; if (!m) return;
      var src = m.thumb || m.image;
      if (/^data:image\/(jpeg|png|webp);base64,/i.test(src || "")) img.src = src;
      img.removeAttribute("data-mid");
      var box2 = img.closest(".pic"); if (box2) box2.classList.add("loaded");
    });
    box.querySelectorAll("video[data-mid]").forEach(function (v) {
      var m = memReg[+v.getAttribute("data-mid")]; if (m && /^data:image\//.test(m.image || "")) v.poster = m.image; v.removeAttribute("data-mid");
    });
  }
  function drawGrid(el) {
    var list = gridReg[+el.getAttribute("data-grid")]; if (!list) return;
    el.removeAttribute("data-grid"); el.style.minHeight = ""; el.classList.add("drawn");
    el.innerHTML = memoryGridNow(list); fillPics(el);
  }
  function wireGrids(root) {
    if (gridSeen) gridSeen.disconnect();
    var els = root.querySelectorAll(".mem-lazy[data-grid]");
    if (!("IntersectionObserver" in window)) { els.forEach(drawGrid); return; }
    gridSeen = new IntersectionObserver(function (list) {
      list.forEach(function (e) { if (e.isIntersecting) { gridSeen.unobserve(e.target); drawGrid(e.target); } });
    }, { rootMargin: "1500px 0px" });
    els.forEach(function (el) { gridSeen.observe(el); });
  }
  function showMore(btn) {
    var rest = gridReg[+btn.getAttribute("data-rest")] || [], grid = btn.previousElementSibling;
    var next = rest.splice(0, 60), tmp = document.createElement("div");
    tmp.innerHTML = memoryGridNow(next);
    var add = tmp.querySelector(".memories");
    if (add && grid) { var firstNew = add.firstElementChild; while (add.firstChild) grid.appendChild(add.firstChild); fillPics(grid); if (firstNew) { var b = firstNew.querySelector("button, video"); if (b) b.focus(); } }
    if (!rest.length) btn.remove();
    else btn.textContent = "Show " + Math.min(60, rest.length) + " more (" + rest.length + " left)";
  }

  // ---------- photo viewer ----------
  // Full screen, one photo at a time: arrows or swipe for next and previous, Esc or Close to go back.
  function viewer() {
    var d = document.getElementById("photo-viewer");
    if (d) return d;
    d = document.createElement("dialog"); d.id = "photo-viewer"; d.className = "lightbox"; d.setAttribute("aria-label", "Photo viewer");
    d.innerHTML = '<div class="lb-stage"><img class="lb-img" alt=""></div>' +
      '<div class="lb-bar"><button type="button" class="lb-btn" data-lb="prev" aria-label="Previous photo">‹</button>' +
      '<p class="lb-cap" role="status" aria-live="polite"></p>' +
      '<button type="button" class="lb-btn" data-lb="zoom" aria-label="Zoom in" aria-pressed="false">⤢</button>' +
      '<button type="button" class="lb-btn" data-lb="next" aria-label="Next photo">›</button>' +
      '<button type="button" class="lb-btn lb-close" data-lb="close" aria-label="Close">✕</button></div>';
    document.body.appendChild(d);
    d.addEventListener("click", function (e) {
      var b = e.target.closest("[data-lb]"); if (!b) { if (e.target === d) d.close(); return; }
      var k = b.getAttribute("data-lb");
      if (k === "close") d.close(); else if (k === "prev") stepPhoto(-1); else if (k === "next") stepPhoto(1);
      else if (k === "zoom") { var z = d.classList.toggle("zoomed"); b.setAttribute("aria-pressed", z ? "true" : "false"); b.setAttribute("aria-label", z ? "Zoom out" : "Zoom in"); }
    });
    d.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") { stepPhoto(-1); e.preventDefault(); } else if (e.key === "ArrowRight") { stepPhoto(1); e.preventDefault(); } });
    var x0 = null, y0 = 0;
    d.addEventListener("pointerdown", function (e) { if (d.classList.contains("zoomed")) return; x0 = e.clientX; y0 = e.clientY; });
    d.addEventListener("pointerup", function (e) {
      if (x0 == null) return; var dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) stepPhoto(dx < 0 ? 1 : -1);
    });
    d.addEventListener("close", function () {
      d.classList.remove("zoomed"); d.querySelector(".lb-img").removeAttribute("src");
      document.documentElement.classList.remove("more-open");
      if (d._opener && d._opener.isConnected) d._opener.focus();
    });
    return d;
  }
  var lbList = [], lbAt = 0;
  function showPhoto() {
    var d = viewer(), m = lbList[lbAt]; if (!m) return;
    var img = d.querySelector(".lb-img"), src = m.image || m.thumb;
    img.alt = m.caption || m.place || "Photo";
    if (m.thumb && m.thumb !== src) img.src = m.thumb;
    var full = new Image(); full.src = src;
    (full.decode ? full.decode() : Promise.resolve()).then(function () { if (lbList[lbAt] === m) img.src = src; }, function () { if (lbList[lbAt] === m) img.src = src; });
    d.querySelector(".lb-cap").textContent = (m.caption || m.place || "") + (m.time ? " · " + m.time : "") + " · Photo " + (lbAt + 1) + " of " + lbList.length;
    d.querySelector('[data-lb="prev"]').disabled = lbAt === 0;
    d.querySelector('[data-lb="next"]').disabled = lbAt === lbList.length - 1;
  }
  function stepPhoto(n) { var k = lbAt + n; if (k < 0 || k >= lbList.length) return; lbAt = k; viewer().classList.remove("zoomed"); showPhoto(); }
  function openPhoto(mid, opener) {
    var m = memReg[mid]; if (!m) return;
    var h = holidays.filter(function (x) { return x.memories && x.memories.indexOf(m) >= 0; })[0];
    lbList = (h ? h.memories : memReg).filter(function (x) { return x.kind !== "video"; });
    lbAt = Math.max(0, lbList.indexOf(m));
    var d = viewer(); d._opener = opener;
    showPhoto();
    if (!d.open) { d.showModal(); document.documentElement.classList.add("more-open"); }
    d.querySelector('[data-lb="close"]').focus();
  }

  // ---------- rebuild from photos ----------
  var rb = { photos: [], mode: "", target: "" };

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

  function rbTarget() { return rb.mode === "add" ? holidays.filter(function (h) { return h.id === rb.target; })[0] || holidays[0] : null; }
  function rebuildView() {
    if (!rb.mode) rb.mode = "past";
    if (rb.mode === "add" && !holidays.length) rb.mode = "past";
    var add = rb.mode === "add", t = rbTarget();
    var opts = holidays.map(function (h) {
      return '<option value="' + esc(h.id) + '"' + (t && t.id === h.id ? " selected" : "") + '>' + esc(h.title) + ' (' + esc(niceShort(h.start)) + ' to ' + esc(nice(h.end)) + ')</option>';
    }).join("");
    var choice = function (mode, title, text) {
      return '<button type="button" class="rb-mode" role="radio" aria-checked="' + (rb.mode === mode) + '" data-mode="' + mode + '"' + (mode === "add" && !holidays.length ? " disabled" : "") + '>' +
        '<span class="rb-dot" aria-hidden="true"></span><b>' + title + '</b><span class="muted">' + text + '</span></button>';
    };
    var html = '<div class="intro"><span class="eyebrow">Photos and memories</span><h1>Add your photos to the album</h1>' +
      '<p>The album reads the date and the place saved inside each photo by your phone or camera, then puts every photo in the right day and place. Your photos stay on your device until you save.</p></div>' +
      '<h2 class="rb-q" id="rb-q">What are these photos for?</h2>' +
      '<div class="rb-modes" role="radiogroup" aria-labelledby="rb-q">' +
      choice("add", "A trip already in the album", "For example, our Japan trip once we're back. Each photo is matched to the stop planned for that day, such as Fushimi Inari on Day 2.") +
      choice("past", "A past trip with no plan", "For example, Europe 2022. The album builds the days, the stops and the route from where and when each photo was taken.") + '</div>' +
      '<div class="form">' + (add
        ? '<label for="rb-target">Which trip?<select id="rb-target">' + opts + '</select></label>'
        : '<label for="rb-title">Holiday name<input id="rb-title" type="text" placeholder="For example: Europe 2022" value="' + esc(rb.title || "") + '"></label>' +
          '<label for="rb-sub">Cities or one line about it<input id="rb-sub" type="text" placeholder="Left empty, the cities are filled in from the photos" value="' + esc(rb.sub || "") + '"></label>') + '</div>' +
      '<div class="steps">' + (add
        ? '<div><b>Choose photos</b><p class="muted">Pick every photo from the trip. Photos from before or after the trip dates are shown apart, and you choose whether to keep them.</p></div>' +
          '<div><b>Check the matches</b><p class="muted">Each day lists its planned stops and how many photos landed at each. Photos taken somewhere else get their own group to name.</p></div>'
        : '<div><b>Choose photos</b><p class="muted">Pick every photo from the trip. Thousands are fine. They stay on your device.</p></div>' +
          '<div><b>Check the stops</b><p class="muted">Photos taken close together on the same day become one stop. Each day gets its city. Rename any stop or add a note.</p></div>') +
      '<div><b>Save</b><p class="muted">Save the locked holiday file (a big holiday saves as a few files) and put it in the website folder. The steps are shown below.</p></div></div>' +
      '<label class="drop" id="rb-drop" for="rb-files"><b>Drop photos here, or tap to choose</b><span class="muted">Photos (JPG, PNG, iPhone HEIC) and videos (MP4, MOV). You can add more at any time.</span>' +
      '<input id="rb-files" type="file" accept="image/*,.heic,.heif,video/*,.mov,.mp4,.m4v" multiple></label>' +
      '<div id="rb-out"></div>';
    return frame("rebuild", html);
  }

  function wireRebuild(root) {
    var drop = root.querySelector("#rb-drop"), input = root.querySelector("#rb-files");
    root.querySelectorAll(".rb-mode").forEach(function (b) {
      b.addEventListener("click", function () {
        if (rb.mode === b.dataset.mode) return;
        rb.mode = b.dataset.mode; rb.names = {}; rb.online = {};
        render();
        var again = document.querySelector('.rb-mode[data-mode="' + rb.mode + '"]'); if (again) again.focus();
      });
    });
    var tsel = root.querySelector("#rb-target");
    if (tsel) { rb.target = tsel.value; tsel.addEventListener("change", function (e) { rb.target = e.target.value; rb.names = {}; drawGroups(); }); }
    var ti = root.querySelector("#rb-title"), su = root.querySelector("#rb-sub");
    if (ti) ti.addEventListener("input", function (e) { rb.title = e.target.value; refreshFile(); });
    if (su) su.addEventListener("input", function (e) { rb.sub = e.target.value; refreshFile(); });
    input.addEventListener("change", function () { addFiles(input.files); input.value = ""; });
    ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("over"); }); });
    ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("over"); }); });
    drop.addEventListener("drop", function (e) { addFiles(e.dataTransfer.files); });
    drawGroups();
  }

  // Read photos a few at a time, so thousands of photos don't freeze the browser,
  // and show how far along it is. Stop keeps the photos read so far.
  function addFiles(files) {
    var list = Array.prototype.slice.call(files || []).filter(function (f) { return /^image\//.test(f.type) || /\.(heic|heif|jpe?g|png|webp)$/i.test(f.name) || isVideo(f); });
    if (!list.length || rb.busy) return;
    var out = document.getElementById("rb-out");
    var total = list.length, done = 0, started = Date.now(), items = [], next = 0, running = 0;
    var size = photoSize(rb.photos.length + total), lanes = workerPool() ? pool.length : 3;
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
      tidy();
      drawGroups();
    }
    function pump() {
      if (rb.busy && rb.busy.stop) { if (!running) finish(); return; }
      while (running < lanes && next < total) {
        running++;
        readAny(list[next++], size).then(function (item) {
          items.push(item); running--; done++; show();
          if (next >= total && !running) finish(); else setTimeout(pump, 0);
        });
      }
    }
    pump();
  }
  // ---------- videos ----------
  // Phone videos keep their date and place in the "moov" part of the file (MP4 and MOV).
  // We read just that part: the creation time, and the place written as "+48.8584+002.2945/".
  function isVideo(f) { return /^video\//.test(f.type) || /\.(mp4|mov|m4v|webm|3gp)$/i.test(f.name); }
  function videoMeta(file) {
    var read = function (from, len) { return file.slice(from, from + len).arrayBuffer(); };
    function walk(pos) {
      if (pos + 8 > file.size) return Promise.resolve(null);
      return read(pos, 16).then(function (b) {
        var v = new DataView(b), size = v.getUint32(0), type = String.fromCharCode(v.getUint8(4), v.getUint8(5), v.getUint8(6), v.getUint8(7));
        if (size === 1) size = v.getUint32(8) * 4294967296 + v.getUint32(12);
        else if (size === 0) size = file.size - pos;
        if (size < 8) return null;
        if (type === "moov") return read(pos, Math.min(size, 16 * 1048576));
        return walk(pos + size);
      });
    }
    return walk(0).then(function (buf) {
      if (!buf) return {};
      var a = new Uint8Array(buf), out = {}, v = new DataView(buf);
      for (var i = 4; i < a.length - 24; i++) {
        if (!out.dt && a[i] === 0x6d && a[i + 1] === 0x76 && a[i + 2] === 0x68 && a[i + 3] === 0x64) { // "mvhd"
          var ver = a[i + 4], secs = ver === 1 ? v.getUint32(i + 8) * 4294967296 + v.getUint32(i + 12) : v.getUint32(i + 8);
          if (secs > 0) out.dt = (secs - 2082844800) * 1000;
          var scale = ver === 1 ? v.getUint32(i + 24) : v.getUint32(i + 16), dur = ver === 1 ? v.getUint32(i + 28) * 4294967296 + v.getUint32(i + 32) : v.getUint32(i + 20);
          if (scale) out.duration = dur / scale;
        }
      }
      var text = new TextDecoder("latin1").decode(a), m = text.match(/([+-]\d{1,2}\.\d{2,})([+-]\d{1,3}\.\d{2,})/);
      if (m) { out.lat = parseFloat(m[1]); out.lon = parseFloat(m[2]); }
      var apple = text.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:?\d{2})/); // Apple's local creation date, best when present
      if (apple) { var t = Date.parse(apple[1].replace(/([+-]\d{2})(\d{2})$/, "$1:$2")); if (!isNaN(t)) out.dt = t; }
      return out;
    }).catch(function () { return {}; });
  }
  // A still picture from about one second in, with the hidden data left behind.
  function videoPoster(file) {
    return new Promise(function (resolve) {
      var url = URL.createObjectURL(file), vid = document.createElement("video"), done = false;
      var finish = function (res) { if (done) return; done = true; vid.removeAttribute("src"); vid.load(); URL.revokeObjectURL(url); resolve(res); };
      vid.muted = true; vid.playsInline = true; vid.preload = "auto";
      vid.onloadedmetadata = function () { vid.currentTime = Math.min(1, (vid.duration || 2) / 3); };
      vid.onseeked = function () {
        try {
          var draw = function (max, q) {
            var k = Math.min(1, max / Math.max(vid.videoWidth, vid.videoHeight)), c = document.createElement("canvas");
            c.width = Math.round(vid.videoWidth * k); c.height = Math.round(vid.videoHeight * k);
            c.getContext("2d").drawImage(vid, 0, 0, c.width, c.height);
            var s = c.toDataURL("image/jpeg", q); c.width = c.height = 0; return s;
          };
          finish({ data: draw(960, 0.72), thumb: draw(240, 0.7), duration: vid.duration });
        } catch (e) { finish(null); }
      };
      vid.onerror = function () { finish(null); };
      setTimeout(function () { finish(null); }, 20000);
      vid.src = url;
    });
  }
  function videoStandIn(name) {
    var c = document.createElement("canvas"); c.width = 640; c.height = 360;
    var g = c.getContext("2d"), grad = g.createLinearGradient(0, 0, 640, 360);
    grad.addColorStop(0, "#2a3a8f"); grad.addColorStop(1, "#10162a"); g.fillStyle = grad; g.fillRect(0, 0, 640, 360);
    g.fillStyle = "rgba(255,255,255,.9)"; g.beginPath(); g.moveTo(296, 150); g.lineTo(296, 210); g.lineTo(348, 180); g.closePath(); g.fill();
    g.font = "500 20px sans-serif"; g.textAlign = "center"; g.fillText(String(name).slice(0, 40), 320, 260);
    return c.toDataURL("image/jpeg", 0.8);
  }
  function readVideo(file) {
    var item = { name: file.name, video: true, file: file };
    return videoMeta(file).then(function (meta) {
      var dt = meta.dt ? new Date(meta.dt) : null;
      if (dt && !isNaN(dt)) { item.when = dt.toISOString(); item.date = iso(dt); item.time = String(dt.getHours()).padStart(2, "0") + ":" + String(dt.getMinutes()).padStart(2, "0"); }
      else { var d = new Date(file.lastModified || Date.now()); item.when = d.toISOString(); item.date = iso(d); item.guessDate = true; }
      if (meta.lat != null && Math.abs(meta.lat) <= 90 && Math.abs(meta.lon) <= 180) { item.lat = +meta.lat.toFixed(5); item.lon = +meta.lon.toFixed(5); }
      item.duration = meta.duration || 0;
      return videoPoster(file);
    }).then(function (res) {
      if (res) { item.data = res.data; item.thumb = res.thumb; item.duration = res.duration || item.duration; }
      else { var still = videoStandIn(file.name); item.data = still; item.thumb = still; item.noStill = true; } // this browser can't open the video, so it gets a plain tile
      return item;
    });
  }
  // A short clip (20 seconds, about 640 px) of a favourite video, made by playing it once
  // silently in the background and recording a smaller copy. About 1 to 2 MB each.
  function makeClip(file, seconds) {
    return new Promise(function (resolve) {
      if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) return resolve(null);
      var url = URL.createObjectURL(file), vid = document.createElement("video"), stop = null;
      vid.playsInline = true; vid.preload = "auto"; vid.src = url;
      var types = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "video/mp4"];
      var type = types.filter(function (t) { return MediaRecorder.isTypeSupported(t); })[0];
      if (!type) { URL.revokeObjectURL(url); return resolve(null); }
      vid.onloadedmetadata = function () {
        var k = Math.min(1, 640 / Math.max(vid.videoWidth, vid.videoHeight)), c = document.createElement("canvas");
        c.width = Math.round(vid.videoWidth * k / 2) * 2; c.height = Math.round(vid.videoHeight * k / 2) * 2;
        var ctx = c.getContext("2d"), stream = c.captureStream(30);
        try {
          var ac = new (window.AudioContext || window.webkitAudioContext)(), src = ac.createMediaElementSource(vid), dest = ac.createMediaStreamDestination();
          src.connect(dest); dest.stream.getAudioTracks().forEach(function (t) { stream.addTrack(t); });
        } catch (e) { vid.muted = true; }
        var rec = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 600000, audioBitsPerSecond: 64000 }), parts = [];
        rec.ondataavailable = function (e) { if (e.data.size) parts.push(e.data); };
        rec.onstop = function () {
          URL.revokeObjectURL(url); vid.removeAttribute("src"); vid.load();
          var blob = new Blob(parts, { type: type.split(";")[0] }), fr = new FileReader();
          fr.onload = function () { resolve(fr.result); }; fr.onerror = function () { resolve(null); }; fr.readAsDataURL(blob);
        };
        var paint = function () { if (rec.state !== "recording") return; ctx.drawImage(vid, 0, 0, c.width, c.height); requestAnimationFrame(paint); };
        stop = function () { if (rec.state === "recording") rec.stop(); vid.pause(); };
        vid.onended = stop;
        rec.start(1000);
        vid.play().then(paint, function () { stop(); });
        setTimeout(stop, Math.min(seconds, vid.duration || seconds) * 1000 + 300);
      };
      vid.onerror = function () { URL.revokeObjectURL(url); resolve(null); };
    });
  }

  // Background helpers (web workers) read photos side by side without freezing the page.
  // If the browser can't run them (old browser, or index.html opened as a file), the page reads them itself.
  var pool = null, poolBroken = false, jobs = {}, jobSeq = 0;
  function workerPool() {
    if (pool || poolBroken) return pool;
    if (!window.Worker || !window.OffscreenCanvas || !window.createImageBitmap || location.protocol === "file:") { poolBroken = true; return null; }
    try {
      var n = Math.max(2, Math.min(6, (navigator.hardwareConcurrency || 4) - 1));
      pool = [];
      for (var i = 0; i < n; i++) {
        var w = new Worker("app/photo-worker.js");
        w.busy = false;
        w.onmessage = function (e) { var j = jobs[e.data.id]; delete jobs[e.data.id]; this.busy = false; if (j) j.done(e.data); };
        w.onerror = function () { poolBroken = true; var me = this; Object.keys(jobs).forEach(function (k) { if (jobs[k].w === me) { var j = jobs[k]; delete jobs[k]; j.fail(); } }); };
        pool.push(w);
      }
    } catch (e) { pool = null; poolBroken = true; }
    return pool;
  }
  function readAny(file, size) {
    return readAny2(file, size).then(function (item) { item.bytes = file.size; return item; });
  }
  function readAny2(file, size) {
    if (isVideo(file)) return readVideo(file);
    var free = !poolBroken && pool && pool.filter(function (w) { return !w.busy; })[0];
    if (!free) return readPhoto(file, size);
    var item = { name: file.name, heic: /\.(heic|heif)$/i.test(file.name) || /hei[cf]/.test(file.type) };
    return new Promise(function (resolve) {
      var id = ++jobSeq;
      free.busy = true;
      jobs[id] = { w: free, fail: function () { resolve(readPhoto(file, size)); }, done: function (r) {
        var dt = r.dt != null ? new Date(r.dt) : null;
        if (dt) { item.when = dt.toISOString(); item.date = iso(dt); item.time = String(dt.getHours()).padStart(2, "0") + ":" + String(dt.getMinutes()).padStart(2, "0"); }
        else { var d = new Date(file.lastModified || Date.now()); item.when = d.toISOString(); item.date = iso(d); item.guessDate = true; }
        if (r.lat != null) { item.lat = +r.lat.toFixed(5); item.lon = +r.lon.toFixed(5); }
        if (r.data) { item.data = r.data; item.thumb = r.thumb; item.sharp = r.sharp; item.hash = r.hash; }
        resolve(item);
      } };
      free.postMessage({ id: id, file: file, heic: item.heic, max: size.max, q: size.q });
    });
  }
  // How sharp a picture is, and a tiny fingerprint of how it looks (same as in photo-worker.js).
  function looks(img) {
    var w = img.width, h = img.height, d = img.data, gray = new Float32Array(w * h), i, x, y;
    for (i = 0; i < w * h; i++) gray[i] = d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114;
    var sum = 0, sq = 0, n = 0;
    for (y = 1; y < h - 1; y++) for (x = 1; x < w - 1; x++) {
      i = y * w + x; var l = gray[i - 1] + gray[i + 1] + gray[i - w] + gray[i + w] - 4 * gray[i];
      sum += l; sq += l * l; n++;
    }
    var sharp = n ? sq / n - (sum / n) * (sum / n) : 0, cells = [], hash = "";
    for (y = 0; y < 8; y++) for (x = 0; x < 9; x++) {
      var x0 = Math.floor(x * w / 9), x1 = Math.max(x0 + 1, Math.floor((x + 1) * w / 9)), y0 = Math.floor(y * h / 8), y1 = Math.max(y0 + 1, Math.floor((y + 1) * h / 8)), t = 0, c = 0;
      for (var yy = y0; yy < y1; yy++) for (var xx = x0; xx < x1; xx++) { t += gray[yy * w + xx]; c++; }
      cells.push(t / c);
    }
    for (y = 0; y < 8; y++) { var nib = 0; for (x = 0; x < 8; x++) { nib = nib * 2 + (cells[y * 9 + x] > cells[y * 9 + x + 1] ? 1 : 0); if (x === 3 || x === 7) { hash += nib.toString(16); nib = 0; } } }
    return { sharp: Math.round(sharp), hash: hash };
  }
  function hamming(a, b) {
    var n = 0;
    for (var i = 0; i < 16; i++) { var x = parseInt(a[i], 16) ^ parseInt(b[i], 16); while (x) { n += x & 1; x >>= 1; } }
    return n;
  }
  // Tidy-up: set aside blurry photos, repeats, and bursts of nearly the same shot (keeping the sharpest).
  // Nothing is thrown away: set-aside photos are listed so they can be kept with one tick.
  function tidy() {
    var ph = rb.photos.filter(function (p) { return !p.video && p.hash; });
    rb.photos.forEach(function (p) { delete p.tidy; delete p.twin; });
    var seen = {};
    rb.photos.forEach(function (p) {
      var k = p.name + "|" + (p.bytes || "") + "|" + (p.when || "");
      if (seen[k]) { p.tidy = "repeat"; p.twin = seen[k]; } else seen[k] = p;
    });
    var sharpList = ph.map(function (p) { return p.sharp; }).sort(function (a, b) { return a - b; });
    var median = sharpList.length ? sharpList[Math.floor(sharpList.length / 2)] : 0, blurLine = Math.max(12, median * 0.18);
    var t = function (p) { return p.guessDate ? null : Date.parse(p.when); };
    for (var i = 0; i < ph.length; i++) {
      var a = ph[i];
      if (a.tidy) continue;
      for (var j = i + 1; j < ph.length; j++) {
        var b = ph[j];
        if (b.tidy) continue;
        var ta = t(a), tb = t(b);
        if (ta != null && tb != null && tb - ta > 120000) break;
        var d = hamming(a.hash, b.hash);
        var same = d <= 2 && (ta == null || tb == null || Math.abs(tb - ta) < 3600000), near = d <= 10 && ta != null && tb != null && Math.abs(tb - ta) <= 120000;
        if (!same && !near) continue;
        var lose = b.sharp > a.sharp ? a : b, win = lose === a ? b : a;
        lose.tidy = same ? (lose.sharp < win.sharp * 0.5 ? "blur" : "repeat") : "similar"; lose.twin = win;
        if (lose === a) a = b;
      }
    }
    ph.forEach(function (p) { if (!p.tidy && p.sharp < blurLine) p.tidy = "blur"; });
    var T = rb.mode === "add" && rbTarget();
    if (T) {
      var have = {};
      (T.memories || []).forEach(function (m) { have[m.date + "|" + (m.time || "") + "|" + (m.file || "")] = true; });
      rb.photos.forEach(function (p) { if (have[p.date + "|" + (p.time || "") + "|" + p.name]) p.tidy = "already"; });
    }
  }
  // Turn a picture a quarter turn to the right (for photos whose camera didn't save which way up it was held).
  function turnPic(src) {
    return new Promise(function (resolve) {
      if (!src) return resolve(src);
      var img = new Image();
      img.onload = function () {
        var c = document.createElement("canvas"); c.width = img.naturalHeight; c.height = img.naturalWidth;
        var g = c.getContext("2d"); g.translate(c.width, 0); g.rotate(Math.PI / 2); g.drawImage(img, 0, 0);
        var out = c.toDataURL("image/jpeg", 0.85); c.width = c.height = 0; resolve(out);
      };
      img.onerror = function () { resolve(src); };
      img.src = src;
    });
  }
  function turnItem(p) {
    return Promise.all([turnPic(p.data), turnPic(p.thumb)]).then(function (r) { p.data = r[0]; p.thumb = r[1]; p.turned = ((p.turned || 0) + 1) % 4; });
  }
  function leftOutNote() {
    var n = rb.photos.filter(function (p) { return p.out; }).length;
    return n ? '<div class="notice rb-left-out" role="status">' + countText(rb.photos.filter(function (p) { return p.out; })) + ' left out by you. They won\'t go in the album. <button class="btn small" type="button" id="rb-put-back">Put them all back</button></div>' : "";
  }
  function kept(p) { return !p.out && (rb.noTidy || !p.tidy || p.keep); }
  function tidyPanel() {
    if (rb.noTidy && !rb.photos.some(function (p) { return p.tidy; })) return "";
    var by = { blur: [], repeat: [], similar: [], already: [] };
    rb.photos.forEach(function (p) { if (p.tidy) by[p.tidy].push(p); });
    var n = by.blur.length + by.repeat.length + by.similar.length + by.already.length;
    if (!n) return '<div class="rb-tidy"><p class="tag">Tidy-up: no blurry photos, repeats or near-same shots found.</p></div>';
    var left = rb.photos.filter(function (p) { return p.tidy && !p.keep; }).length;
    var sect = function (key, title, text) {
      var list = by[key]; if (!list.length) return "";
      return '<div class="rb-tidy-sec"><h4>' + title + ' <span class="muted">' + list.length + '</span></h4><p class="tag">' + text + '</p><div class="thumbs">' +
        list.slice(0, 120).map(function (p) {
          var i = rb.photos.indexOf(p);
          return '<label class="rb-tidy-pic' + (p.keep ? " kept" : "") + '">' + (p.thumb ? '<img src="' + u(p.thumb) + '" alt="' + esc(p.name) + '" loading="lazy">' : '<span class="ph"><small>' + esc(p.name) + '</small></span>') +
            '<span class="check"><input type="checkbox" class="rb-keep" data-i="' + i + '"' + (p.keep ? " checked" : "") + '> Keep</span></label>';
        }).join("") + '</div>' + (list.length > 120 ? '<p class="tag">and ' + (list.length - 120) + ' more like these.</p>' : "") +
        '<button class="btn small rb-keep-all" type="button" data-kind="' + key + '">Keep all of these</button></div>';
    };
    return '<div class="rb-tidy"><h3>Tidy-up</h3><p>' + (rb.noTidy ? "Tidy-up is off, so every photo goes in the album. " :
      'We set aside ' + left + (left < n ? ' of ' + n : '') + ' photos so the album only has the good ones: ' +
      [by.already.length ? by.already.length + " already in the album" : "", by.blur.length ? by.blur.length + " blurry" : "", by.repeat.length ? by.repeat.length + " repeats" : "", by.similar.length ? by.similar.length + " nearly the same as another shot (we kept the sharpest)" : ""].filter(Boolean).join(", ") +
      '. Nothing is deleted from your device. Tick Keep on any you want back.') + '</p>' +
      '<details><summary>Look at the photos set aside</summary>' +
      sect("already", "Already in the album", "Same date, time and file name as a photo already in this trip, so it would show twice.") +
      sect("blur", "Blurry", "Out of focus or shaky, or a blurrier copy of a shot we kept. Very plain photos (sky, a wall) can show up here too.") +
      sect("repeat", "Repeats", "The same photo added twice, or a copy of one already in the list.") +
      sect("similar", "Nearly the same", "Taken within two minutes and looking almost the same as a sharper shot we kept.") +
      '</details><label class="check"><input type="checkbox" id="rb-notidy"' + (rb.noTidy ? " checked" : "") + '> Turn tidy-up off and keep every photo</label></div>';
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
        try {
          res = { data: draw(size.max, size.q) };
          var k = Math.min(1, 240 / Math.max(w, h)), c = document.createElement("canvas"), g;
          c.width = Math.round(w * k); c.height = Math.round(h * k); g = c.getContext("2d"); g.drawImage(img, 0, 0, c.width, c.height);
          var f = looks(g.getImageData(0, 0, c.width, c.height)); res.sharp = f.sharp; res.hash = f.hash;
          res.thumb = c.toDataURL("image/jpeg", 0.7); c.width = c.height = 0;
        } catch (e) { res = null; }
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
      if (res) { item.data = res.data; item.thumb = res.thumb; item.sharp = res.sharp; item.hash = res.hash; }
      return item;
    }, function () { return item; });
  }

  // Group photos into stops. Adding to a trip: a photo within 1.5 km of a stop planned that day
  // (or 1 km of any stop on the trip) joins that stop. Everything else: same day, within about
  // 1 km of the group's first photo.
  function nearestStop(list, lat, lon, km) {
    var best = null, bd = km;
    list.forEach(function (s) { if (s.lat == null) return; var d = distKm(lat, lon, s.lat, s.lon); if (d < bd) { bd = d; best = s; } });
    return best ? { stop: best, km: bd } : null;
  }
  function groups() {
    var out = [], T = rbTarget(), dayOf = {}, all = [];
    if (T) {
      (T.days || []).forEach(function (d, i) { dayOf[d.date] = { day: d, n: i + 1 }; (d.places || []).forEach(function (p) { all.push({ name: p.name, lat: p.lat, lon: p.lon, dayN: i + 1 }); }); });
      (T.stays || []).forEach(function (s) { all.push({ name: s.name, lat: s.lat, lon: s.lon, stay: true }); });
    }
    rb.photos.filter(kept).forEach(function (p) {
      var info = T && dayOf[p.date], anchor = null, how = "";
      if (T && p.lat != null) {
        var m = info && nearestStop((info.day.places || []).map(function (x) { return { name: x.name, lat: x.lat, lon: x.lon }; }), p.lat, p.lon, 1.5);
        if (m) { anchor = m.stop.name; how = "Planned stop for this day"; }
        else {
          m = nearestStop(all, p.lat, p.lon, 1);
          if (m) { anchor = m.stop.name; how = m.stop.stay ? "At our hotel" : "Near a stop planned for Day " + m.stop.dayN; }
        }
      }
      var g = out.filter(function (g) {
        if (g.date !== p.date) return false;
        if (anchor || g.anchor) return g.anchor === anchor;
        if (g.lat == null || p.lat == null) return g.lat == null && p.lat == null;
        return distKm(g.lat, g.lon, p.lat, p.lon) < 1;
      })[0];
      if (!g) {
        g = { key: p.date + "|" + (anchor ? "@" + anchor : p.lat != null ? p.lat.toFixed(2) + "," + p.lon.toFixed(2) : "none"), date: p.date, lat: p.lat, lon: p.lon, photos: [], anchor: anchor, inTrip: !T || !!info };
        g.suggest = anchor ? { name: anchor, how: how } : p.lat != null ? suggestPlace(p.lat, p.lon) : { name: "", how: "No place saved in these photos. Type where they were taken." };
        out.push(g);
      }
      g.photos.push(p);
    });
    rb.names = rb.names || {};
    rb.notes = rb.notes || {};
    out.forEach(function (g) { if (rb.names[g.key] == null) rb.names[g.key] = (rb.online && rb.online[g.key]) || g.suggest.name; });
    return out;
  }
  // Rebuilding a past trip: the city for each day is the known city nearest to most of that day's photos.
  function cityOf(lat, lon) {
    var best = null, bd = 80;
    GAZETTEER.forEach(function (c) { var d = distKm(lat, lon, c[1], c[2]); if (d < bd) { bd = d; best = c[0]; } });
    return best;
  }
  function dayCities(gs) {
    var votes = {};
    gs.forEach(function (g) {
      if (g.lat == null) return;
      var c = cityOf(g.lat, g.lon); if (!c) return;
      var v = votes[g.date] = votes[g.date] || {};
      v[c] = (v[c] || 0) + g.photos.length;
    });
    var out = {};
    Object.keys(votes).forEach(function (d) { out[d] = Object.keys(votes[d]).sort(function (a, b) { return votes[d][b] - votes[d][a]; })[0]; });
    return out;
  }

  var SHOW_THUMBS = 24;
  function groupCard(g, i) {
    var fixed = !!g.anchor;
    return '<div class="group' + (fixed ? " matched" : "") + '"><div class="head">' +
      (fixed ? '<h4 class="rb-stop"><span class="rb-pin" aria-hidden="true">✓</span>' + esc(g.anchor) + '</h4>'
             : '<input type="text" id="rb-name-' + i + '" data-key="' + esc(g.key) + '" class="rb-name" value="' + esc(rb.names[g.key] || "") + '" placeholder="Place name" aria-label="Place name">') +
      '<button class="btn small rb-out-stop" type="button" data-key="' + esc(g.key) + '">Leave out this stop</button>' +
      '<span class="tag">' + countText(g.photos) + ' · ' + esc(g.suggest.how) +
      (g.lat != null ? ' · <a href="https://www.google.com/maps/search/?api=1&query=' + g.lat + ',' + g.lon + '" target="_blank" rel="noopener noreferrer">see on map</a>' : "") + '</span></div>' +
      '<input type="text" id="rb-note-' + i + '" data-key="' + esc(g.key) + '" class="rb-note" value="' + esc(rb.notes[g.key] || "") + '" placeholder="A note, for example: Ice cream by the river" aria-label="Note for ' + esc(rb.names[g.key] || "this stop") + '">' +
      videoRow(g) +
      '<div class="thumbs">' + g.photos.filter(function (p) { return !p.video; }).slice(0, SHOW_THUMBS).map(function (p) {
        return '<div class="rb-thumb"><button class="rb-x" type="button" data-i="' + rb.photos.indexOf(p) + '" aria-label="Leave out ' + esc(p.name) + '" title="Leave out this photo">×</button>' +
          (p.thumb ? '<button class="rb-rot" type="button" data-i="' + rb.photos.indexOf(p) + '" aria-label="Turn ' + esc(p.name) + ' a quarter turn to the right" title="Turn it the right way up">↻</button>' : "") + (p.thumb ? '<div class="pic loaded"><img src="' + u(p.thumb) + '" alt="' + esc(p.name) + '" loading="lazy"></div>' : '<div class="pic"><div class="ph"><small>' + (p.heic ? "iPhone photo" : "Can't show") + '</small>' + esc(p.name) + '</div></div>') +
          '<span class="tag">' + esc(p.time || "") + ' ' + esc(p.name) + '</span></div>';
      }).join("") + '</div>' + (g.photos.filter(function (p) { return !p.video; }).length > SHOW_THUMBS ? '<p class="tag">and ' + (g.photos.filter(function (p) { return !p.video; }).length - SHOW_THUMBS) + ' more photos in this group, all included</p>' : "") + '</div>';
  }
  function countText(list) {
    var v = list.filter(function (p) { return p.video; }).length, ph = list.length - v, bits = [];
    if (ph || !v) bits.push(ph + (ph === 1 ? " photo" : " photos"));
    if (v) bits.push(v + (v === 1 ? " video" : " videos"));
    return bits.join(" and ");
  }
  function mmss(sec) { sec = Math.round(sec || 0); return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0"); }
  // Videos in a stop: a still picture each, a tick for a 20-second clip, and a box for a link to the full video.
  function ytStatus(link) {
    var k = ytKind(link);
    if (k === "ok") return '<span class="ok"><span aria-hidden="true">✓</span> YouTube video found · <a href="' + u(ytWatch(ytId(link))) + '" target="_blank" rel="noopener noreferrer">Open to check</a></span>';
    if (k === "playlist") return '<span class="bad">That looks like a playlist. Please open one video and copy its link.</span>';
    if (k === "bad") return '<span class="bad"><span aria-hidden="true">✗</span> This does not look like a YouTube link. It should start with youtube.com or youtu.be</span>';
    return "";
  }
  // Paste many links at once: a link naming a file (IMG_4821) goes to that video, the rest go in order.
  function matchLinks(text, newestFirst) {
    var vids = rb.photos.filter(function (p) { return p.video; });
    var links = String(text || "").split(/\r?\n/).map(function (l) { return { line: l, id: ytId(l) }; }).filter(function (l) { return l.id; });
    var rest = [];
    links.forEach(function (l) {
      var hit = vids.filter(function (p) { var base = p.name.replace(/\.[^.]+$/, "").toLowerCase(); return base.length > 2 && l.line.toLowerCase().indexOf(base) >= 0 && !p._matched; })[0];
      if (hit) { hit.link = ytWatch(l.id) + (ytStart(l.line) ? "&t=" + ytStart(l.line) : ""); hit._matched = true; } else rest.push(l);
    });
    if (newestFirst) rest.reverse();
    var open = vids.filter(function (p) { return !p._matched && !ytId(p.link); });
    rest.forEach(function (l, n) { if (open[n]) open[n].link = ytWatch(l.id) + (ytStart(l.line) ? "&t=" + ytStart(l.line) : ""); });
    vids.forEach(function (p) { delete p._matched; });
    var used = links.length - Math.max(0, rest.length - open.length);
    return !links.length ? "No YouTube links found in what you pasted."
      : used < links.length ? "You pasted " + links.length + " links for " + vids.length + " videos. The first " + used + " were matched; the rest were left out."
      : rest.length < open.length ? "You pasted " + links.length + " links. " + (open.length - rest.length) + " videos still have no link."
      : "All " + links.length + " links matched. Check each still picture below shows the right video.";
  }
  function ytHelpPanel() {
    var n = rb.photos.filter(function (p) { return p.video; }).length;
    if (!n) return "";
    return '<div class="rb-yt-help card-ish"><h3>Your ' + (n === 1 ? "video" : n + " videos") + '</h3>' +
      '<p>For each video you can: 1. Keep a short 20-second clip inside the album. 2. Add a YouTube link so the whole video can be watched. Upload the videos to YouTube first, then paste the links here.</p>' +
      '<details><summary>How do I put my videos on YouTube?</summary><ol>' +
      '<li>On a computer go to studio.youtube.com and press Create, then Upload videos. On a phone open the YouTube app and press +.</li>' +
      '<li>For visibility choose <b>Unlisted</b> (only people with the link can watch). Private videos will not play in the album. Never choose Public.</li>' +
      '<li>For audience choose "No, it\'s not made for kids". In Studio, turn comments off, keep "Allow embedding" ticked and leave "Video location" empty.</li>' +
      '<li>Keep titles plain, with no names. If you keep the phone\'s file name (for example IMG_4821) as the title, the album can match links by name.</li>' +
      '<li>Wait for "Processing finished", then open each video, press Share and Copy, and paste the link here.</li>' +
      '<li>Ask the girls before their videos go on YouTube. Anyone given an Unlisted link can watch it and pass it on, and YouTube keeps the original file with where and when it was filmed.</li></ol></details>' +
      '<label class="rb-yt-label" for="rb-yt-all">Paste all your YouTube links (one per line)</label>' +
      '<textarea id="rb-yt-all" rows="4" spellcheck="false" autocapitalize="off" placeholder="https://youtu.be/…"></textarea>' +
      '<div class="row"><label class="check"><input type="checkbox" id="rb-yt-newest"> My list is newest first</label><button class="btn" type="button" id="rb-yt-match">Match links</button></div>' +
      '<p class="tag" id="rb-yt-msg" role="status" aria-live="polite"></p></div>';
  }
  function videoRow(g) {
    var vids = g.photos.filter(function (p) { return p.video; });
    if (!vids.length) return "";
    return '<div class="rb-videos">' + vids.map(function (p) {
      var i = rb.photos.indexOf(p);
      return '<div class="rb-video"><div class="pic loaded vid-poster">' + (p.thumb ? '<img src="' + u(p.thumb) + '" alt="' + esc(p.name) + '" loading="lazy">' : "") +
        '<span class="vid-badge" aria-hidden="true">▶ ' + mmss(p.duration) + '</span></div>' +
        '<span class="tag">' + esc(p.time || "") + ' ' + esc(p.name) + '</span>' +
        (canClip() ? '<label class="check"><input type="checkbox" class="rb-fav" data-i="' + i + '"' + (p.fav ? " checked" : "") + '> Keep a 20-second clip' + (p.clip ? " · Clip ready" : "") + '</label><span class="tag">Plays inside the album, no YouTube needed</span>'
          : '<label class="check"><input type="checkbox" disabled> Keep a 20-second clip</label><span class="tag">Not possible in this browser</span>') +
        '<label class="rb-yt-label" for="rb-link-' + i + '">YouTube link (optional)</label>' +
        '<input type="text" class="rb-link" id="rb-link-' + i + '" data-i="' + i + '" value="' + esc(p.link || "") + '" placeholder="Paste the link from YouTube" inputmode="url" autocomplete="off" autocapitalize="off" spellcheck="false" aria-describedby="rb-yt-st-' + i + '"' + (ytKind(p.link) === "bad" || ytKind(p.link) === "playlist" ? ' aria-invalid="true"' : "") + '>' +
        '<span class="rb-yt-st" id="rb-yt-st-' + i + '" role="status" aria-live="polite">' + ytStatus(p.link) + '</span></div>';
    }).join("") + '</div>';
  }
  function drawGroups() {
    var out = document.getElementById("rb-out");
    if (!out) return;
    if (!rb.photos.length) {
      out.innerHTML = '<div class="empty" style="margin-top:18px"><b>No photos chosen yet.</b><p>Tip: photos straight from your phone keep their date and place. Photos sent through WhatsApp or downloaded from Facebook usually lose them, so use the originals from your phone or Google Photos ("Download" keeps them).</p></div>';
      return;
    }
    var gs = rb.gs = groups(), T = rbTarget();
    var withGps = rb.photos.filter(function (p) { return p.lat != null; }).length;
    var guessed = rb.photos.filter(function (p) { return p.guessDate; }).length;
    var first = rb.photos[0].date, last = rb.photos[rb.photos.length - 1].date;
    var outside = gs.filter(function (g) { return !g.inTrip; });
    var html = '<div class="notice" style="margin-top:18px">' + countText(rb.photos) + ' from ' + esc(nice(first)) + ' to ' + esc(nice(last)) + '. ' +
      withGps + ' have a place saved in them. ' + (guessed ? guessed + ' have no date inside, so we used the file date, which may be wrong. ' : "") +
      (T ? gs.filter(function (g) { return g.anchor; }).reduce(function (n, g) { return n + g.photos.length; }, 0) + ' matched a planned stop.' : gs.length + ' stops over ' + Object.keys(gs.reduce(function (o, g) { o[g.date] = 1; return o; }, {})).length + ' days.') + '</div>' +
      '<div class="row" style="margin-top:12px"><button class="btn" id="rb-lookup" type="button">Look up place names online</button>' +
      '<button class="btn" id="rb-clear" type="button">Start again</button><span class="tag" id="rb-lookup-msg"></span></div>' + leftOutNote() + tidyPanel() + ytHelpPanel();
    var cities = T ? {} : dayCities(gs);
    if (T) {
      (T.days || []).forEach(function (d, n) {
        var mine = gs.filter(function (g) { return g.date === d.date; });
        var count = function (name) { return mine.filter(function (g) { return g.anchor === name; }).reduce(function (k, g) { return k.concat(g.photos); }, []); };
        html += '<div class="rb-day"><h3>Day ' + (n + 1) + ' · ' + esc(nice(d.date, true)) + '</h3><p class="muted">' + esc(d.title || d.city || "") + '</p>' +
          '<ul class="rb-plan">' + (d.places || []).map(function (p) { var k = count(p.name); return '<li class="' + (k.length ? "has" : "none") + '"><b>' + esc(p.name) + '</b> ' + (k.length ? countText(k) : "no photos") + '</li>'; }).join("") + '</ul>' +
          (mine.length ? "" : '<p class="tag">No photos for this day yet.</p>') + '</div>';
        mine.forEach(function (g) { html += groupCard(g, gs.indexOf(g)); });
      });
      if (outside.length) {
        html += '<div class="rb-day"><h3>Outside the trip dates</h3><p class="muted">' + outside.reduce(function (k, g) { return k + g.photos.length; }, 0) + ' photos were taken before or after ' + esc(T.title) + ' (' + esc(niceShort(T.start)) + ' to ' + esc(nice(T.end)) + ').</p>' +
          '<label class="check"><input type="checkbox" id="rb-outside"' + (rb.skipOutside ? "" : " checked") + '> Keep them, as extra days at the end of the trip</label></div>';
        outside.forEach(function (g) { html += groupCard(g, gs.indexOf(g)); });
      }
    } else {
      var lastDate = "", dn = 0;
      gs.forEach(function (g, i) {
        if (g.date !== lastDate) { dn++; html += '<div class="rb-day"><div class="row"><h3>Day ' + dn + ' · ' + esc(nice(g.date, true)) + '</h3><button class="btn small rb-out-day" type="button" data-date="' + esc(g.date) + '">Leave out this day</button></div>' + (cities[g.date] ? '<p class="muted">In ' + esc(cities[g.date]) + '</p>' : "") + '</div>'; lastDate = g.date; }
        html += groupCard(g, i);
      });
    }
    html += '<section style="margin-top:36px"><div class="section-head"><h2>Save it to the album</h2></div>' +
      '<div class="steps" id="rb-save-steps"></div>' +
      '<label for="rb-file" class="eyebrow">Holiday file</label><textarea id="rb-file" readonly></textarea>' +
      '<div class="row" style="margin-top:10px"><button class="btn primary" type="button" id="rb-save">Save holiday file</button><button class="btn" type="button" id="rb-copy">Copy holiday file</button><span class="tag" id="rb-copy-msg"></span></div></section>';
    out.innerHTML = html;
    out.querySelectorAll(".rb-fav").forEach(function (el) { el.addEventListener("change", function () { rb.photos[+el.dataset.i].fav = el.checked; refreshFile(); }); });
    var linkTimer = null, linkEl = null;
    var flushLink = function () {
      clearTimeout(linkTimer); linkTimer = null; if (!linkEl) return;
      var el = linkEl, p = rb.photos[+el.dataset.i], k = ytKind(p.link); linkEl = null;
      var st = document.getElementById("rb-yt-st-" + el.dataset.i); if (st) st.innerHTML = ytStatus(p.link);
      if (k === "bad" || k === "playlist") el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
      refreshFile();
    };
    out.querySelectorAll(".rb-link").forEach(function (el) {
      el.addEventListener("input", function () { rb.photos[+el.dataset.i].link = el.value.trim(); if (linkEl && linkEl !== el) flushLink(); linkEl = el; clearTimeout(linkTimer); linkTimer = setTimeout(flushLink, 300); });
      el.addEventListener("change", flushLink); el.addEventListener("blur", flushLink);
    });
    out.querySelectorAll(".rb-keep").forEach(function (el) { el.addEventListener("change", function () { rb.photos[+el.dataset.i].keep = el.checked; drawGroups(); }); });
    out.querySelectorAll(".rb-keep-all").forEach(function (el) { el.addEventListener("click", function () { rb.photos.forEach(function (p) { if (p.tidy === el.dataset.kind) p.keep = true; }); drawGroups(); }); });
    out.querySelectorAll(".rb-rot").forEach(function (el) { el.addEventListener("click", function () {
      el.disabled = true;
      var p = rb.photos[+el.dataset.i];
      turnItem(p).then(function () { var im = el.parentNode.querySelector("img"); if (im) im.src = p.thumb; el.disabled = false; refreshFile(); });
    }); });
    out.querySelectorAll(".rb-x").forEach(function (el) { el.addEventListener("click", function () { rb.photos[+el.dataset.i].out = true; drawGroups(); }); });
    out.querySelectorAll(".rb-out-stop").forEach(function (el) { el.addEventListener("click", function () { var g = gs.filter(function (x) { return x.key === el.dataset.key; })[0]; if (g) g.photos.forEach(function (p) { p.out = true; }); drawGroups(); }); });
    out.querySelectorAll(".rb-out-day").forEach(function (el) { el.addEventListener("click", function () { rb.photos.forEach(function (p) { if (p.date === el.dataset.date) p.out = true; }); drawGroups(); }); });
    var pb = out.querySelector("#rb-put-back");
    if (pb) pb.addEventListener("click", function () { rb.photos.forEach(function (p) { delete p.out; }); drawGroups(); });
    var nt = out.querySelector("#rb-notidy");
    if (nt) nt.addEventListener("change", function () { rb.noTidy = nt.checked; drawGroups(); });
    var ytMatch = out.querySelector("#rb-yt-match");
    if (ytMatch) ytMatch.addEventListener("click", function () {
      var msg = matchLinks(out.querySelector("#rb-yt-all").value, out.querySelector("#rb-yt-newest").checked);
      drawGroups(); refreshFile();
      var m2 = document.getElementById("rb-yt-msg"); if (m2) m2.textContent = msg;
    });
    var ob = out.querySelector("#rb-outside");
    if (ob) ob.addEventListener("change", function () { rb.skipOutside = !ob.checked; refreshFile(); });
    out.querySelectorAll(".rb-name").forEach(function (el) { el.addEventListener("input", function () { rb.names[el.dataset.key] = el.value; refreshFile(); }); });
    out.querySelectorAll(".rb-note").forEach(function (el) { el.addEventListener("input", function () { rb.notes[el.dataset.key] = el.value; refreshFile(); }); });
    out.querySelector("#rb-clear").addEventListener("click", function () { rb.photos = []; rb.names = {}; rb.notes = {}; rb.online = {}; drawGroups(); });
    out.querySelector("#rb-lookup").addEventListener("click", function () { lookupOnline(gs); });
    out.querySelector("#rb-save").addEventListener("click", function () {
      flushLink();
      var msg = document.getElementById("rb-copy-msg");
      if (rb.mode === "add" && rb.target && (partsFailed[rb.target] || []).length) {
        msg.textContent = "A photos file didn't load (" + partsFailed[rb.target].join(", ") + "). Saving now would leave out the photos in that file, so we stopped. Reload the page and try again.";
        return;
      }
      if (rb.mode === "add" && rb.target && (laterFor(rb.target).length || partsBusy[rb.target])) {
        msg.textContent = "Still loading this trip's photos. Wait a moment and press Save again, so none of them are lost.";
        loadParts(rb.target); return;
      }
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
      flushLink();
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
    var todo = gs.filter(function (g) { return g.lat != null && !g.anchor; });
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
    var gs = rb.gs || groups();
    var target = rbTarget();
    var keep = gs.filter(function (g) { return !(target && !g.inTrip && rb.skipOutside); });
    var dates = keep.map(function (g) { return g.date; }).sort();
    var first = dates[0] || rb.photos[0].date, last = dates[dates.length - 1] || first;
    var id = target ? target.id : slug((rb.title || "holiday") + (String(rb.title || "").indexOf(first.slice(0, 4)) >= 0 ? "" : "-" + first.slice(0, 4)));
    var memories = [];
    keep.forEach(function (g) {
      g.photos.forEach(function (p) {
        if (!p.data) return;
        var m = { date: p.date, file: p.name, image: p.data, place: g.anchor || rb.names[g.key] || "" };
        if (p.thumb && p.thumb !== p.data) m.thumb = p.thumb;
        if (g.anchor) m.stop = g.anchor;
        if (p.video) {
          m.kind = "video"; if (p.duration) m.duration = Math.round(p.duration);
          if (p.fav && p.clip) m.clip = p.clip;
          var yid = ytId(p.link);
          if (okYt(yid)) { m.yt = yid; var yst = ytStart(p.link); if (yst) m.ytStart = yst; m.link = ytWatch(yid); }
          else if (/^https:\/\//i.test(p.link || "")) m.link = p.link;
        }
        if (rb.notes[g.key]) m.caption = rb.notes[g.key];
        if (p.time) m.time = p.time;
        if (p.lat != null) { m.lat = +p.lat.toFixed(3); m.lon = +p.lon.toFixed(3); }
        memories.push(m);
      });
    });
    var steps = document.getElementById("rb-save-steps");
    var hol, isNew = !target;
    if (target) {
      // The whole trip again, with the new photos added (the same file names replace the old ones).
      hol = Object.assign({}, target, { memories: target.memories.slice() });
      memories.forEach(function (m) { hol.memories.push(m); });
      hol.memories.sort(function (a, b) { return (a.date + (a.time || "")) < (b.date + (b.time || "")) ? -1 : 1; });
    } else {
      // A past trip: days, stops, cities and the route all come from the photos.
      var byDay = {}, cities = dayCities(keep);
      keep.forEach(function (g) { (byDay[g.date] = byDay[g.date] || []).push(g); });
      var days = Object.keys(byDay).sort().map(function (date) {
        var places = byDay[date].map(function (g) {
          var p = { name: rb.names[g.key] || "Somewhere nice", type: "sight" };
          if (g.lat != null) { p.lat = +g.lat.toFixed(3); p.lon = +g.lon.toFixed(3); }
          if (rb.notes[g.key]) p.note = rb.notes[g.key];
          p.note = (p.note ? p.note + " · " : "") + countText(g.photos);
          return p;
        });
        var seen = {};
        places.forEach(function (p) { seen[p.name] = (seen[p.name] || 0) + 1; if (seen[p.name] > 1) p.name += ", stop " + seen[p.name]; });
        var names = places.map(function (p) { return p.name; }).filter(function (n) { return n !== "Somewhere nice"; });
        var city = cities[date] || "";
        return { date: date, city: city, title: city || names[0] || "A day out", places: places };
      });
      var route = [];
      days.forEach(function (d) {
        var lastR = route[route.length - 1];
        if (d.city && lastR && lastR.city === d.city) lastR.days++;
        else if (d.city) route.push({ city: d.city, days: 1 });
      });
      route = route.map(function (r, i) { return { city: r.city, nights: i === route.length - 1 ? Math.max(r.days - 1, 0) : r.days }; });
      var cityList = route.map(function (r) { return r.city; }).filter(function (c, i, a) { return a.indexOf(c) === i; });
      hol = {
        id: id, title: rb.title || "Our holiday", subtitle: rb.sub || cityList.slice(0, 5).join(", "), start: first, end: last,
        cover: { image: memories[0] ? memories[Math.floor(memories.length / 3)].image : "" },
        summary: days.length + " days and " + countText(memories.map(function (m) { return { video: m.kind === "video" }; })) + (cityList.length ? ", from " + cityList.slice(0, 6).join(" to ") : "") + ".",
        route: route, days: days, memories: memories
      };
    }
    // Big holidays are split into parts of about 30 MB of photos (about 40 MB once locked), well under GitHub's 100 MB limit.
    var parts = [[]], size = 0, LIMIT = 30 * 1048576;
    hol.memories.forEach(function (m) {
      var n = (m.image || "").length + (m.clip || "").length + (m.thumb || "").length;
      if (size + n > LIMIT && parts[parts.length - 1].length) { parts.push([]); size = 0; }
      parts[parts.length - 1].push(m); size += n;
    });
    var names = parts.map(function (x, i) { return i ? id + ".photos-" + (i + 1) + ".js" : id + ".js"; });
    rb.plan = { hol: hol, parts: parts, names: names, id: id };
    rb.built = null;
    var listLine = names.map(function (n) { return '"' + esc(n) + '",'; }).join("</code> <code>").replace(/,$/, "");
    var skipped = rb.photos.filter(function (p) { return kept(p) && !p.data; }).length;
    steps.innerHTML = '<div><b>Save the ' + (names.length > 1 ? names.length + ' holiday files' : 'holiday file') + '</b><p class="muted">Press <b>Save holiday file</b> below. Your photos are inside, locked with your passkey, with their hidden phone data removed.' +
      (names.length > 1 ? ' There are ' + hol.memories.length + ' photos, so they are split into ' + names.length + ' files.' : '') +
      (skipped ? ' ' + skipped + ' photos could not be added (iPhone HEIC photos, or files the browser could not open). Change them to JPG first.' : '') + '</p></div>' +
      '<div><b>Put it in the website</b><p class="muted">Move the saved ' + (names.length > 1 ? 'files' : 'file') + ' into the <code>holidays</code> folder' + (isNew ? '' : ', replacing the old ones') + ': <code>' + names.map(esc).join('</code>, <code>') + '</code>.</p></div>' +
      '<div><b>Add it to the list</b><p class="muted">Open <code>holidays/list.js</code> and add <code>' + listLine + '</code>' + (isNew ? '' : ' (any names not there yet)') + '. Then open index.html.</p></div>' +
      '<div><b>Or ask Claude</b><p class="muted">Send Claude the saved ' + (names.length > 1 ? 'files' : 'file') + ', and it will put them in the album for you.</p></div>';
    ta.value = hol.memories.length + " photos ready. Press Save holiday file to lock them with your passkey and save.";
  }
  // Lock each part with the passkey, one after another, showing progress.
  function buildFiles(msg) {
    var todo = rb.photos.filter(function (p) { return kept(p) && p.video && p.fav && !p.clip && p.file; });
    if (todo.length) {
      return todo.reduce(function (chain, p, i) {
        return chain.then(function () {
          if (msg) msg.textContent = "Making clip " + (i + 1) + " of " + todo.length + " (" + p.name + "). Each takes about 20 seconds…";
          return makeClip(p.file, 20).then(function (clip) { p.clip = clip || ""; });
        });
      }, Promise.resolve()).then(function () { refreshFile(); return lockFiles(msg); });
    }
    return lockFiles(msg);
  }
  function lockFiles(msg) {
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
  var locked = [], unlockedKey = "", badFiles = 0;
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
    var boxes = locked.slice();
    return Promise.all(boxes.map(function (box) { return openBox(box, pass).then(function (h) { return { h: h }; }, function () { return null; }); })).then(function (list) {
      var ok = list.filter(Boolean);
      if (!ok.length) throw new Error("wrong passkey");
      ok.forEach(function (r) { HolidayAlbum.add(r.h); });
      badFiles = list.length - ok.length;
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
      '<div class="pass-row"><input id="gate-pass" type="password" autocomplete="current-password" required spellcheck="false" autocapitalize="off">' +
      '<button class="pass-eye" type="button" id="gate-eye" aria-controls="gate-pass" aria-pressed="false" aria-label="Show passkey" title="Show passkey"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path class="eye-slash" d="M4 4l16 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button></div>' +
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
    // The eye button shows or hides the typed passkey. It sits beside the box, not inside it,
    // so a password manager's own icon at the box's edge never covers it.
    var eye = root.querySelector("#gate-eye");
    eye.addEventListener("click", function () {
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      eye.setAttribute("aria-pressed", String(show));
      eye.setAttribute("aria-label", show ? "Hide passkey" : "Show passkey");
      eye.title = show ? "Hide passkey" : "Show passkey";
      var end = input.value.length; input.focus();
      try { input.setSelectionRange(end, end); } catch (e) { /* some input types refuse */ }
    });
    form.addEventListener("submit", function (e) {
      input.type = "password"; eye.setAttribute("aria-pressed", "false");
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
    if (!begun) {
      begun = true; window.addEventListener("hashchange", render);
      document.getElementById("app").addEventListener("click", function (e) {
        var b = e.target.closest && e.target.closest(".yt-play, .yt-full");
        if (b) openYt(b);
        var o = e.target.closest && e.target.closest(".photo-open");
        if (o) openPhoto(+o.getAttribute("data-open"), o);
        var rt = e.target.closest && e.target.closest("[data-retry]");
        if (rt) retryParts(rt.getAttribute("data-retry"));
        var mm = e.target.closest && e.target.closest(".mem-more");
        if (mm) showMore(mm);
      });
    }
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
      // Every photo in a part is kept, even when two photos share a file name (two phones can both make IMG_1234).
      (part.memories || []).forEach(function (m) { h.memories.push(m); });
      h.memories.sort(function (a, b) { return (a.date + (a.time || "")) < (b.date + (b.time || "")) ? -1 : 1; });
    });
  }
  // Photo files that wait until their holiday is opened (see boot.js), loaded one at a time.
  var partsBusy = {};
  function laterFor(id) { return (window.HOLIDAY_LATER || []).filter(function (n) { return n.replace(/\.photos-\d+\.js$/, "") === id; }); }
  function loadScript(name) {
    return new Promise(function (resolve) {
      var s = document.createElement("script"); s.src = "holidays/" + name;
      s.onload = function () { s.remove(); resolve(true); };
      s.onerror = function () { s.remove(); resolve(false); };
      document.body.appendChild(s);
    });
  }
  function loadParts(id, onStep) {
    if (partsBusy[id]) return partsBusy[id];
    var names = laterFor(id), n = 0;
    window.HOLIDAY_LATER = (window.HOLIDAY_LATER || []).filter(function (x) { return names.indexOf(x) < 0; });
    partsBusy[id] = names.reduce(function (chain, name) {
      return chain.then(function () { return loadScript(name); }).then(function (ok) {
        if (!ok) { (partsFailed[id] = partsFailed[id] || []).push(name); return; }
        var boxes = locked.splice(0);
        return Promise.all(boxes.map(function (box) { return openBox(box, unlockedKey).then(HolidayAlbum.add, function () { }); }));
      }).then(function () { n++; if (onStep) onStep(n, names.length); });
    }, Promise.resolve()).then(function () { delete partsBusy[id]; partsDone[id] = true; });
    return partsBusy[id];
  }
  var partsDone = {}, partsFailed = {};
  function retryParts(id) {
    var names = partsFailed[id] || []; delete partsFailed[id];
    window.HOLIDAY_LATER = (window.HOLIDAY_LATER || []).concat(names);
    keepPlace(render);
  }
  function partsNotice(id) {
    var left = laterFor(id).length;
    if ((partsFailed[id] || []).length && !left && !partsBusy[id])
      return '<div class="notice" id="parts-note" role="alert">Some photos couldn\'t load (' + esc(partsFailed[id].join(", ")) + '). Check your internet and <button class="btn small" type="button" data-retry="' + esc(id) + '">Try again</button></div>';
    return left || partsBusy[id] ? '<div class="notice busy" id="parts-note" role="status" aria-live="polite">Loading the rest of the photos…</div>' : "";
  }
  function keepPlace(fn) { var y = window.scrollY; fn(); window.scrollTo(0, y); }
  function render() {
    closeYt(false);
    memReg = []; gridReg = [];
    var id = (location.hash || "#home").slice(1);
    var waitFor = id === "rebuild" ? holidays.map(function (x) { return x.id; }) : [id.replace(/-day\d+$/, "")];
    waitFor.forEach(function (hid) {
      if (!laterFor(hid).length) return;
      loadParts(hid, function (n, total) {
        var note = document.getElementById("parts-note");
        if (note) note.textContent = "Loading the rest of the photos (" + n + " of " + total + ")…";
      }).then(function () {
        var now = (location.hash || "#home").slice(1);
        if (now === "rebuild" ? !rb.photos.length : now.replace(/-day\d+$/, "") === hid) keepPlace(render);
      });
    });
    mergeParts();
    var root = document.getElementById("app");
    var h = holidays.filter(function (x) { return x.id === id; })[0];
    moreList = [];
    if (id === "rebuild") { root.innerHTML = rebuildView(); wireRebuild(root); }
    else if (h) {
      root.innerHTML = holidayView(h);
      var pn = partsNotice(h.id), cov = root.querySelector("section.cover");
      if (pn && cov) cov.insertAdjacentHTML("afterend", pn);
    }
    else if (id.indexOf("-day") > 0 && holidays.some(function (x) { return id.indexOf(x.id + "-day") === 0; })) return;
    else root.innerHTML = homeView();
    if (badFiles && id === "home") { var mainEl = root.querySelector("main"); if (mainEl) mainEl.insertAdjacentHTML("afterbegin", '<div class="notice" role="alert" style="margin-top:18px">' + (badFiles === 1 ? "One holiday file" : badFiles + " holiday files") + ' couldn\'t be opened, so that trip is missing. The file may be damaged or only half uploaded.</div>'); }
    wireMore(root);
    wireGrids(root);
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
    _t: { ytId: ytId, ytStart: ytStart, okYt: okYt, ytKind: ytKind },
    lock: function () { closeYt(false); forgetPass(); location.hash = "#home"; location.reload(); },
    start: function () {
      if (!locked.length) return begin();
      var pass = savedPass();
      if (!pass) return showGate();
      tryUnlock(pass).then(begin, function () { forgetPass(); showGate(); });
    }
  };
})();
