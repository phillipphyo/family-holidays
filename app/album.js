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
      (src ? '<img src="' + u(src) + '" alt="' + esc(alt) + '" loading="lazy">' : opts.vk ? '<img data-vk="' + esc(opts.vk) + '" alt="' + esc(alt) + '">' : "") +
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
  function moreButton(p, city, past) {
    var out = "";
    if (past) {
      if (p.info) { moreList.push({ p: p, kind: "info", city: city, past: past }); out += '<button class="more-btn why" type="button" aria-haspopup="dialog" data-more="' + (moreList.length - 1) + '"><span aria-hidden="true">✦</span>Location\'s information</button>'; }
      out += past.photos || "";
      return out ? '<div class="more-bar">' + out + '</div>' : "";
    }
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
    var p = entry.p, spots = entry.kind === "spots", info = entry.kind === "info", d = moreDialog();
    d._opener = document.activeElement;
    var m = spots ? p.spots : info ? p.info : p.more, hotel = !!(p.nights || p.type === "hotel");
    var row = function (label, text, cls) { return text ? '<div class="more-row' + (cls ? " " + cls : "") + '"><h3 class="more-label">' + label + '</h3><p>' + esc(text) + '</p></div>' : ""; };
    // A hotel shows a photo here only when it is the hotel itself, never an area view.
    var img = "", cr = null;
    if (info && entry.past.pic) { img = entry.past.pic.image || entry.past.pic.thumb; }
    else if (spots && m.image) { img = m.image; cr = m.credit; }
    else if (!hotel || p.hotelPhoto) {
      img = p.image || (p.wiki && ((window.ALBUM_IMAGES || {})[p.wiki] || wikiCache[p.wiki])) || "";
      cr = p.image ? p.credit : null;
    }
    var credit = !img || (info && entry.past.pic) ? "" : cr ? '<a class="credit" href="' + u(cr.url) + '" target="_blank" rel="noopener noreferrer">' + esc(creditText(cr, spots && m.image ? "Example photo" : "Photo")) + '</a>'
      : p.wiki ? '<a class="credit" href="https://en.wikipedia.org/wiki/' + esc(encodeURIComponent(p.wiki.replace(/ /g, "_"))) + '" target="_blank" rel="noopener noreferrer">Photo from Wikipedia</a>' : "";
    var where = (p.nights ? [p.city, p.nights] : [p.city || entry.city, TYPE_LABEL[p.type]]).filter(Boolean).join(" · ");
    var note = hotel && !img ? '<span class="more-note">No free photo of this hotel yet. Tap Photos below to see it.</span>' : "";
    var lead = function (label, text) { return text ? '<div class="more-row first">' + (label ? '<h3 class="more-label">' + label + '</h3>' : "") + '<p class="more-lead" id="more-lead">' + esc(text) + '</p></div>' : ""; };
    var body = spots
      ? lead("Where to stand", m.spots) + row("Poses to try", m.poses) + row("Camera angle", m.angles) + row("Best light", m.light) + row("Beat the crowds", m.crowds)
      : info ? lead("", m.lead) + row("What it is", m.what) + row("When we were there", entry.past.visit) + row("Best time to go", m.best) + row("Good to know", m.tips) + row("If we go again", m.again) + row("Places we saved here", (m.pins || []).join(" · "))
      : lead("", m.why) + (p.nights && p.why && p.why !== m.why ? row("About our stay", p.why) : "") + row(hotel ? "Best time to arrive" : "Best time to go", m.best) + row("Good to know", m.tips) + row("Skip it if", m.skip, "skip");
    var foot = spots
      ? '<div class="links seg"><a class="btn" href="' + u("https://www.google.com/search?tbm=isch&q=" + q(p.name + " best photo spot")) + '" target="_blank" rel="noopener noreferrer">More example photos</a>' +
        (m.tag ? '<a class="btn" href="' + u("https://www.instagram.com/explore/tags/" + encodeURIComponent(m.tag) + "/") + '" target="_blank" rel="noopener noreferrer">#' + esc(m.tag) + ' on Instagram</a>' : "") + '</div>'
      : linkRow(p, { primaryPhotos: !!note }) + (info && m.wiki ? '<a class="info-link" href="https://en.wikipedia.org/wiki/' + esc(encodeURIComponent(m.wiki.replace(/ /g, "_"))) + '" target="_blank" rel="noopener noreferrer">More on Wikipedia <span aria-hidden="true">↗</span></a>' : infoLink(p));
    d.innerHTML = '<div class="more-box' + (spots ? " is-spots" : "") + '">' +
      '<button class="more-close" type="button" data-close aria-label="Close"><span aria-hidden="true">✕</span></button>' +
      '<div class="more-scroll"><header class="more-hero' + (img ? "" : " no-pic") + '" style="--tone:' + tone(p.type || "hotel") + '">' +
        (img ? '<img src="' + u(img) + '" alt="' + esc(spots && m.image ? "Example photo taken at " + p.name : p.name) + '">' : "") + credit +
        '<div class="more-title"><span class="more-kicker">' + (spots ? "Photo spots" : info ? "Location's information" : "Why we picked it") + '</span><h2 id="more-title">' + esc(p.name) + '</h2>' +
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
      '<a href="#rebuild"' + (active === "rebuild" ? ' aria-current="page"' : "") + '>Add your photos</a>' +
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
    cards += '<a class="trip-card add" href="#rebuild"><span class="eyebrow">Past holidays</span><h3>Add your photos</h3>' +
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
    var byDate = {}, past = isPastTrip(h), visits = past ? visitsFor(h) : {}, fold = foldGet(h);
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
      dayChips(h, fold) +
      ((h.journeyTips || []).length ? '<details class="tipbox fold" data-fold="tips"' + (fold.tips ? " open" : "") + '><summary><h4><span aria-hidden="true">🚆</span> Getting around: ' + h.journeyTips.length + (h.journeyTips.length === 1 ? " tip" : " tips") + '</h4><span class="fold-hint" aria-hidden="true"></span></summary><ul>' + h.journeyTips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join("") + '</ul>' +
        (h.journeyNote ? '<p class="muted">' + esc(h.journeyNote) + '</p>' : "") + '</details>' : "") + (quickBox(h) ? '<p class="notice keeper-note">This trip opens slowly on phones. <button class="btn small keeper-open" type="button">Fix it at the bottom of the page</button></p>' : "") +
      '<div class="summary">' + (h.travellers ? '<p class="eyebrow">' + esc(h.travellers) + '</p>' : "") + summaryText(h.summary) +
      ((h.links || []).length ? '<div class="links">' + h.links.map(function (l, i) { return '<a class="btn' + (i ? "" : " primary") + '" href="' + u(l.url) + '" target="_blank" rel="noopener noreferrer">' + esc(l.label) + '</a>'; }).join("") + '</div>' : "") + '</div>';

    if ((h.route || []).length) {
      html += '<section><div class="section-head"><h2>The route</h2><span class="eyebrow">City by city</span></div><div class="route">' +
        h.route.map(function (r) {
          return '<div class="stop"><span class="dot"></span><h3>' + esc(r.city) + '</h3>' +
            '<p class="n">' + (r.nights ? r.nights + (r.nights === 1 ? " night" : " nights") : r.nights === 0 ? "Day trip" : "Home") + '</p>' +
            (r.how ? '<p class="how">' + esc(r.how) + '</p>' : "") + '</div>';
        }).join("") + '</div></section>';
    }

    var stays = (h.stays || []).length ? h.stays : past ? pastStays(h, visits) : [];
    if (stays.length) {
      html += '<section><div class="section-head"><h2>' + (past ? "Where we stayed" : "Where we stay") + '</h2><span class="eyebrow">' + (past ? "Night by night" : "And why we chose it") + '</span></div><div class="stays">' +
        stays.map(function (s) {
          var tm = stayTimes(s), toBook = /to book/i.test(s.nights || ""), short = !s.past && s.more;
          return '<article class="stay">' + pic({ image: s.image, vk: s.vk, wiki: s.wiki, credit: s.credit, name: s.name, type: "hotel", label: s.city, area: s.areaPhoto, decorative: true }) +
            '<div class="body"><span class="eyebrow">' + esc(s.city) + ' · ' + esc(String(s.nights || "").replace(/\s*\((booked|chosen, to book|to book)\)/i, "")) + '</span><h3>' + esc(s.name) + '</h3>' +
            (/\(booked\)/i.test(s.nights || "") ? '<span class="stay-status ok">Booked</span>' : toBook ? '<span class="stay-status warn">Still to book</span>' : "") +
            (tm ? '<p class="stay-times">' + esc(tm) + '</p>' : "") +
            (s.why && !short ? '<p class="muted">' + esc(s.why) + '</p>' : "") +
            ((s.proof || []).length ? '<ul class="stay-proof">' + s.proof.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul>' : "") + infoLink(s) + '<div class="card-actions">' + moreButton(s, null, s.past) + linkRow(s) + '</div></div></article>';
        }).join("") + '</div></section>';
    }

    html += '<section><div class="section-head"><h2>Day by day</h2><span class="eyebrow">Tap a day to see its trains, tips and stops</span>' +
      ((h.days || []).length > 1 ? '<button class="btn small days-all" type="button" data-h="' + esc(h.id) + '">' + (fold.days.length >= h.days.length ? "Close all days" : "Open all days") + '</button>' : "") + '</div>';
    (h.days || []).forEach(function (d, i) {
      var dd = parseDate(d.date), route = dayRouteUrl(d), mem = byDate[d.date] || [];
      delete byDate[d.date];
      var n = i + 1, names = (d.places || []).map(function (p) { return p.name; }), isOpen = fold.days.indexOf(n) >= 0;
      var ci = checkInFor(h, stays, i), photosN = past ? mem.length : 0;
      html += '<details class="day" id="' + esc(h.id + "-day" + n) + '" data-h="' + esc(h.id) + '" data-day="' + n + '"' + (isOpen ? " open" : "") + '><summary class="day-sum"><div class="ticket">' +
        '<div class="stub" aria-hidden="true"><span class="d">Day ' + n + '</span><span class="big">' + dd.getDate() + '</span><span class="d">' + WD[dd.getDay()] + ' ' + MON[dd.getMonth()] + '</span></div>' +
        '<div class="main"><h3><span class="sr-only">Day ' + n + ', ' + WD[dd.getDay()] + ' ' + dd.getDate() + ' ' + MON[dd.getMonth()] + ': </span>' + esc(d.title || d.city || "") + '</h3>' +
        '<div class="meta">' + (d.city ? '<span>In <b>' + esc(d.city) + '</b></span>' : "") + (d.sleep ? '<span>Sleep at <b>' + esc(d.sleep) + '</b>' + (ci ? ' · check-in ' + esc(ci) : "") + '</span>' : "") + '</div>' +
        (names.length ? '<p class="day-stops">' + esc(names.slice(0, 3).join(" · ")) + (names.length > 3 ? ' <span class="muted">+' + (names.length - 3) + ' more</span>' : "") + '</p>' : "") +
        (photosN ? '<p class="day-photos"><span aria-hidden="true">📷</span> ' + photosN + (photosN === 1 ? " photo" : " photos") + '</p>' : "") +
        '<span class="day-toggle" aria-hidden="true"><span class="t-show">Show the day</span><span class="t-hide">Hide the day</span><span class="chev" aria-hidden="true"></span></span>' +
        '</div></div></summary><div class="day-body"><div class="day-info">' +
        (route ? '<div class="links"><a class="btn small" href="' + u(route) + '" target="_blank" rel="noopener noreferrer">Today\'s stops in Google Maps</a></div>' : "") +
        (d.travel ? '<p class="travel">' + esc(d.travel) + '</p>' : "") +
        (d.walk || d.ifTired ? '<div class="walk">' + (d.walk ? '<span><b>Walking</b> ' + esc(d.walk) + '</span>' : "") + (d.ifTired ? '<span><b>If tired</b> ' + esc(d.ifTired) + '</span>' : "") + '</div>' : "") +
        (past && !(d.journeys || []).length ? guessJourneys(likelyJourneys(h, i)) : journeyList(d.journeys)) +
        '</div>';
      var shots = {};
      mem.forEach(function (m) { if (m.stop) shots[m.stop] = (shots[m.stop] || 0) + 1; });
      var used = [];
      if (past && (d.places || []).length) {
        html += '<div class="stop-list">' + d.places.map(function (p, pi) {
          var v = visits[(i + 1) + "." + (pi + 1)], card = placeCardPast(h, d, p, i, pi, v);
          if (v) used = used.concat(v.mems);
          var tonight = d.sleep && p.name.toLowerCase().indexOf(d.sleep.split(",")[0].toLowerCase()) === 0;
          return '<div class="stop-block' + (tonight || p.type === "hotel" ? " is-hotel" : "") + '">' + card +
            (v && v.mems.length ? '<div class="stop-strip">' + memoryGrid(v.mems.slice(0, 4), true) +
              (v.mems.length > 4 && stills(v.mems) ? '<button class="btn small place-photos see-all" type="button" data-h="' + esc(h.id) + '" data-k="' + n + '.' + (pi + 1) + '">See all ' + countWord(stills(v.mems), "photo") + '</button>' : "") + '</div>'
              : '<p class="muted stop-none">No photos at this stop.</p>') + '</div>';
        }).join("") + '</div>';
        var left = mem.filter(function (m) { return used.indexOf(m) < 0; });
        if (left.length) html += '<div class="stop-left"><h4><span aria-hidden="true">📷</span> Other photos this day <span class="muted">' + left.length + '</span></h4><div class="stop-strip">' + memoryGrid(left.slice(0, 4), true) +
          (left.length > 4 && stills(left) ? '<button class="btn small left-photos see-all" type="button" data-left="' + (leftReg.push(left) - 1) + '">See all ' + countWord(stills(left), "photo") + '</button>' : "") + '</div></div>';
        mem = [];
      } else if ((d.places || []).length) {
        html += '<div class="places">' + d.places.map(function (p, pi) {
          var vk = (i + 1) + "." + (pi + 1), v = past && visits[vk], own = v && v.pic;
          return '<div class="place">' + pic({ image: p.image, wiki: p.wiki, credit: p.credit, name: p.name, type: p.type, area: p.areaPhoto, decorative: true }) +
            '<div class="body"><div class="top"><span class="chip" style="color:' + tone(p.type) + '">' + esc(TYPE_LABEL[p.type] || "Place") + '</span>' +
            (p.time ? '<span class="time">' + esc(p.time) + '</span>' : "") + (shots[p.name] ? '<span class="time">📷 ' + shots[p.name] + '</span>' : "") + '</div>' +
            '<h4>' + esc(p.name) + '</h4>' + (p.note ? '<p class="note">' + esc(p.note) + '</p>' : "") + infoLink(p) + '<div class="card-actions">' + moreButton(p, d.city) + linkRow(p) + '</div></div></div>';
        }).join("") + '</div>';
      }
      if (mem.length) html += memoryGrid(mem);
      html += '<p class="day-end"><button class="btn small day-hide" type="button" data-day="' + n + '">Hide Day ' + n + '</button></p></div></details>';
    });
    var extra = Object.keys(byDate).sort();
    extra.forEach(function (date) {
      html += '<details class="day extra" id="' + esc(h.id + "-extra-" + date) + '"><summary class="day-sum"><div class="ticket"><div class="stub" aria-hidden="true"><span class="d">Extra</span><span class="big">' + parseDate(date).getDate() + '</span><span class="d">' + niceShort(date) + '</span></div>' +
        '<div class="main"><h3><span class="sr-only">Extra day, ' + esc(niceShort(date)) + ': </span>More photos</h3><p class="day-photos"><span aria-hidden="true">📷</span> ' + byDate[date].length + ' photos</p><span class="day-toggle" aria-hidden="true"><span class="t-show">Show the day</span><span class="t-hide">Hide the day</span><span class="chev" aria-hidden="true"></span></span></div></div></summary><div class="day-body">' + memoryGrid(byDate[date]) + '</div></details>';
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
        '<p>After the trip, open <a href="#rebuild">Add your photos</a>, choose "Add to: ' + esc(h.title) + '" and pick your photos. Each photo goes under the day it was taken, next to the nearest stop.</p></div></section>';
    }
    var keep = (past ? infoBox(h) : planBox(h)) + quickBox(h);
    if (keep) html += '<section><details class="keeper" id="keeper"' + (fold.keeper ? " open" : "") + ' data-fold="keeper"><summary><h2>For the album keeper</h2><span class="fold-hint" aria-hidden="true"></span></summary>' + keep + '</details></section>';
    return frame(h.id, html);
  }
  // A stop card on a past trip: our own photo, the times we were there, and the information.
  function placeCardPast(h, d, p, i, pi, v) {
    var vk = (i + 1) + "." + (pi + 1), own = v && v.pic;
    return '<div class="place">' + pic({ image: own ? own.thumb || own.image : p.image, vk: own && !own.thumb && !own.image ? h.id + ":" + own.k : "", wiki: own ? "" : p.wiki, name: p.name, type: p.type, decorative: true }) +
            '<div class="body"><div class="top"><span class="chip" style="color:' + tone(p.type) + '">' + esc(TYPE_LABEL[p.type] || "Place") + '</span>' +
            (v && v.first ? '<span class="time">' + esc(v.first + (v.last && v.last !== v.first ? " to " + v.last : "")) + '</span>' : "") + (v ? '<span class="time">📷 ' + v.mems.length + '</span>' : "") + '</div>' +
            '<h4>' + esc(p.name) + '</h4>' + (p.info && p.info.lead ? '<p class="note">' + esc(p.info.lead) + '</p>' : "") +
            '<div class="card-actions">' + moreButton(p, d.city, { visit: visitText(d, v), pic: own, photos: "" }) + linkRow(p) + '</div></div></div>';
  }
  // Each ride as "how: time, how often, cost", with the part before the first colon in bold.
  function journeyList(list, title) {
    if (!(list || []).length) return "";
    return '<div class="journeys"><h4><span aria-hidden="true">🚆</span> ' + esc(title || "Journeys") + '</h4><ul>' + list.map(function (j) {
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
  function memoryGrid(list, flat) {
    if (flat) list.flat = true;
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
    list.forEach(function (m) { var k = m.label || m.stop || m.place || ""; if (!by[k]) { by[k] = []; order.push(k); } by[k].push(m); });
    var page = pageSize();
    var block = function (items, k) {
      var first = items.slice(0, page), more = items.length - first.length;
      var j = gridReg.push(items.slice(page)) - 1;
      return '<div class="memories">' + first.map(fig).join("") + '</div>' +
        (more > 0 ? '<button type="button" class="btn small mem-more" data-rest="' + j + '">Show all ' + items.length + ' photos' + (k ? ' from ' + esc(k) : '') + '</button>' : "");
    };
    if (list.flat || (order.length < 2 && !list.some(function (m) { return m.stop; }))) return block(list, "");
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
    var need = v2Need(list, "thumbs");
    if (need) { el.removeAttribute("data-grid"); el.innerHTML = '<p class="tag mem-wait">Loading photos…</p>'; need.then(function () { el.setAttribute("data-grid", gridReg.indexOf(list)); drawGrid(el); }); return; }
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
    var vks = root.querySelectorAll("img[data-vk]");
    if (vks.length) {
      var want = function (img) {
        var x = String(img.getAttribute("data-vk") || "").split(":"), h = holidays.filter(function (y) { return y.id === x[0]; })[0], m = h && byK(h)[x[1]];
        if (m) v2Need([m], "thumbs");
      };
      if (!("IntersectionObserver" in window)) vks.forEach(want);
      else { var io = new IntersectionObserver(function (list) { list.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); want(e.target); } }); }, { rootMargin: "800px 0px" }); vks.forEach(function (img) { io.observe(img); }); }
    }
  }
  function showMore(btn) {
    var rest = gridReg[+btn.getAttribute("data-rest")] || [], grid = btn.previousElementSibling;
    var need = v2Need(rest.slice(0, 60), "thumbs");
    if (need) { btn.disabled = true; need.then(function () { btn.disabled = false; showMore(btn); }); return; }
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
    if (!m.image && m.fp) { var w = v2Need([m], "full"); if (w) w.then(function () { if (lbList[lbAt] === m) showPhoto(); }); }
    var img = d.querySelector(".lb-img"), src = m.image || m.thumb || "";
    img.alt = m.caption || m.place || "Photo";
    if (m.thumb && m.thumb !== src) img.src = m.thumb;
    if (!src) return;
    var full = new Image(); full.src = src;
    (full.decode ? full.decode() : Promise.resolve()).then(function () { if (lbList[lbAt] === m) img.src = src; }, function () { if (lbList[lbAt] === m) img.src = src; });
    d.querySelector(".lb-cap").textContent = (m.caption || m.place || "") + (m.time ? " · " + m.time : "") + " · Photo " + (lbAt + 1) + " of " + lbList.length;
    d.querySelector('[data-lb="prev"]').disabled = lbAt === 0;
    d.querySelector('[data-lb="next"]').disabled = lbAt === lbList.length - 1;
  }
  function stepPhoto(n) { var k = lbAt + n; if (k < 0 || k >= lbList.length) return; lbAt = k; viewer().classList.remove("zoomed"); showPhoto(); }
  function openPhoto(mid, opener) { if (memReg[mid]) openPhotoMem(memReg[mid], opener); }
  function openPhotoMem(m, opener, only) {
    var h = holidays.filter(function (x) { return x.memories && x.memories.indexOf(m) >= 0; })[0];
    lbList = (only || (h ? h.memories : memReg)).filter(function (x) { return x.kind !== "video"; });
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
  // ---------- Add your photos: five steps ----------
  // Every choice is kept in rb, so going Back and Next never loses anything.
  function rbSteps() {
    var add = rb.mode === "add";
    var s = [
      { k: "choose", t: "Choose photos", why: "The album reads the date and the place saved inside each photo, so it can sort them for you. Your photos stay on your device until you save." },
      { k: "check", t: add ? "Check the matches" : "Check days and places", why: add ? "Each photo is matched to the stop planned for that day. Photos taken somewhere else need a name, so they show up in the right place." : "Photos taken close together on the same day become one stop. A good name makes the album easy to read later." },
      { k: "tidy", t: "Tidy up", why: "Blurry photos, repeats and near-same shots make the album long and slow to scroll. We set them aside, and you can bring any of them back." }
    ];
    if (rb.photos.some(function (p) { return p.video && !p.out; })) s.push({ k: "videos", t: "Videos", why: "A short clip plays inside the album. A YouTube link lets the family watch the whole video without making the album files huge." });
    s.push({ k: "save", t: "Save", why: "Saving locks the photos with the family passkey, so only the family can see them on the website." });
    return s;
  }
  function rbStepAt() {
    var list = rbSteps(), i = 0;
    list.forEach(function (x, n) { if (x.k === rb.step) i = n; });
    if (rb.step === "videos" && list[i].k !== "videos") i = list.length - 1;
    if (!rb.photos.length) i = 0;
    return { list: list, i: i, step: list[i] };
  }
  function stepNav() {
    var at = rbStepAt(), ready = rb.photos.length && !rb.busy;
    return '<nav class="rb-progress" id="rb-progress" aria-label="Steps"><ol>' + at.list.map(function (s, n) {
      return '<li class="' + (n < at.i ? "done" : n === at.i ? "now" : "") + '"><button type="button" data-go="' + s.k + '"' + (n === at.i ? ' aria-current="step"' : "") + (!ready && n ? " disabled" : "") + '>' +
        '<span class="rb-num" aria-hidden="true">' + (n < at.i ? "✓" : n + 1) + '</span><span class="rb-step-t">' + esc(s.t) + '</span></button></li>';
    }).join("") + '</ol></nav>';
  }
  function stepFoot() {
    var at = rbStepAt(), ready = rb.photos.length && !rb.busy, next = at.list[at.i + 1];
    return '<div class="rb-foot" id="rb-foot"><span class="tag">Step ' + (at.i + 1) + ' of ' + at.list.length + '</span><span class="rb-foot-btns">' +
      (at.i ? '<button class="btn" type="button" data-go="' + at.list[at.i - 1].k + '">Back</button>' : "") +
      (next ? '<button class="btn primary" type="button" id="rb-next" data-go="' + next.k + '"' + (ready ? "" : " disabled") + '>Next: ' + esc(next.t) + '</button>' : "") + '</span></div>';
  }
  function updateChrome() {
    var a = document.getElementById("rb-progress"), b = document.getElementById("rb-foot");
    if (a) a.outerHTML = stepNav();
    if (b) b.outerHTML = stepFoot();
  }
  function goStep(k) {
    flushLink();
    rb.step = k; rb.needs = false;
    render();
    var h = document.getElementById("rb-step-h"); if (h) h.focus({ preventScroll: true });
  }
  // One quiet message for screen readers, plus a short note on screen with Undo when it helps.
  function say(text, undo) {
    var live = document.getElementById("rb-live"); if (live) live.textContent = text;
    var t = document.getElementById("rb-toast");
    if (!t) return;
    clearTimeout(rb.toastTimer);
    if (!undo) { t.hidden = true; rb.undo = null; return; }
    rb.undo = undo;
    t.innerHTML = '<span>' + esc(text) + '</span><button class="btn small" type="button" id="rb-undo">Undo</button>';
    t.hidden = false;
    rb.toastTimer = setTimeout(function () { t.hidden = true; rb.undo = null; }, 9000);
  }

  function rebuildView() {
    if (!rb.mode) rb.mode = "past";
    if (rb.mode === "add" && !holidays.length) rb.mode = "past";
    if (!rb.step) rb.step = "choose";
    var at = rbStepAt(), add = rb.mode === "add", t = rbTarget();
    var html = '<div id="rb-wrap"><div class="intro rb-intro"><span class="eyebrow">Photos and memories</span><h1>Add your photos to the album</h1></div>' + stepNav() +
      '<h2 class="rb-step-h" id="rb-step-h" tabindex="-1">Step ' + (at.i + 1) + ' of ' + at.list.length + ': ' + esc(at.step.t) + '</h2>' +
      '<p class="rb-why"><b>Why:</b> ' + esc(at.step.why) + '</p>';
    if (at.step.k === "choose") {
      var opts = holidays.map(function (h) {
        return '<option value="' + esc(h.id) + '"' + (t && t.id === h.id ? " selected" : "") + '>' + esc(h.title) + ' (' + esc(niceShort(h.start)) + ' to ' + esc(nice(h.end)) + ')</option>';
      }).join("");
      var choice = function (mode, title, text) {
        return '<button type="button" class="rb-mode" role="radio" aria-checked="' + (rb.mode === mode) + '" data-mode="' + mode + '"' + (mode === "add" && !holidays.length ? " disabled" : "") + '>' +
          '<span class="rb-dot" aria-hidden="true"></span><b>' + title + '</b><span class="muted">' + text + '</span></button>';
      };
      html += '<h3 class="rb-q" id="rb-q">What are these photos for?</h3>' +
        '<div class="rb-modes" role="radiogroup" aria-labelledby="rb-q">' +
        choice("add", "A trip already in the album", "For example, our Japan trip once we're back. Each photo is matched to the stop planned for that day, such as Fushimi Inari on Day 2.") +
        choice("past", "A past trip with no plan", "For example, Europe 2022. The album builds the days, the stops and the route from where and when each photo was taken.") + '</div>' +
        '<div class="form">' + (add
          ? '<label for="rb-target">Which trip?<select id="rb-target">' + opts + '</select></label>'
          : '<label for="rb-title">Holiday name<input id="rb-title" type="text" placeholder="For example: Europe 2022" value="' + esc(rb.title || "") + '"></label>' +
            '<label for="rb-sub">Cities or one line about it<input id="rb-sub" type="text" placeholder="Left empty, the cities are filled in from the photos" value="' + esc(rb.sub || "") + '"></label>') + '</div>' +
        '<label class="drop" id="rb-drop" for="rb-files"><b>Drop photos here, or tap to choose</b><span class="muted">Photos (JPG, PNG, iPhone HEIC) and videos (MP4, MOV). Thousands are fine. You can add more at any time.</span>' +
        '<input id="rb-files" type="file" accept="image/*,.heic,.heif,video/*,.mov,.mp4,.m4v" multiple></label>';
    }
    html += '<div id="rb-out"></div><div id="rb-live" class="sr-only" aria-live="polite"></div><div class="rb-toast" id="rb-toast" role="status" hidden></div>' + stepFoot() + '</div>';
    return frame("rebuild", html);
  }

  function wireRebuild(root) {
    var wrap = root.querySelector("#rb-wrap"), drop = root.querySelector("#rb-drop"), input = root.querySelector("#rb-files");
    root.querySelectorAll(".rb-mode").forEach(function (b) {
      b.addEventListener("click", function () {
        if (rb.mode === b.dataset.mode) return;
        rb.mode = b.dataset.mode; rb.names = {}; rb.online = {};
        tidy(); render();
        var again = document.querySelector('.rb-mode[data-mode="' + rb.mode + '"]'); if (again) again.focus();
      });
    });
    var tsel = root.querySelector("#rb-target");
    if (tsel) { rb.target = tsel.value; tsel.addEventListener("change", function (e) { rb.target = e.target.value; rb.names = {}; tidy(); drawGroups(); }); }
    var ti = root.querySelector("#rb-title"), su = root.querySelector("#rb-sub");
    if (ti) ti.addEventListener("input", function (e) { rb.title = e.target.value; rb.titleAuto = false; });
    if (su) su.addEventListener("input", function (e) { rb.sub = e.target.value; });
    if (input) input.addEventListener("change", function () { addFiles(input.files); input.value = ""; });
    if (drop) {
      ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("over"); }); });
      ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("over"); }); });
      drop.addEventListener("drop", function (e) { addFiles(e.dataTransfer.files); });
    }
    wrap.addEventListener("click", rbClick);
    wrap.addEventListener("input", rbInput);
    wrap.addEventListener("change", rbChange);
    wrap.addEventListener("toggle", rbToggle, true);
    wrap.addEventListener("blur", function (e) { if (e.target.classList && e.target.classList.contains("rb-link")) flushLink(); }, true);
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
    out.insertAdjacentHTML("afterbegin", '<div class="notice busy" id="rb-busy"><div class="row"><span id="rb-busy-text">Reading ' + total + ' photos…</span>' +
      '<button class="btn small" type="button" id="rb-stop">Stop and keep these</button></div><div class="bar-track" id="rb-busy-track" role="progressbar" aria-label="Reading photos" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span id="rb-busy-bar"></span></div></div>');
    updateChrome(); say("Reading " + total + " photos.");
    var said = 0;
    document.getElementById("rb-stop").addEventListener("click", function () { if (rb.busy) rb.busy.stop = true; });
    function show() {
      var txt = document.getElementById("rb-busy-text"), bar = document.getElementById("rb-busy-bar");
      if (!txt) return;
      var left = done ? Math.round((Date.now() - started) / done * (total - done) / 1000) : 0;
      txt.textContent = "Reading " + done + " of " + total + " photos" + (done > 5 && left > 5 ? ", about " + (left < 90 ? left + " seconds" : Math.round(left / 60) + " minutes") + " left" : "") + "…";
      var pc = Math.round(done / total * 100), track = document.getElementById("rb-busy-track");
      if (bar) bar.style.width = pc + "%";
      if (track) track.setAttribute("aria-valuenow", pc);
      if (pc >= said + 10 && done < total) { said = pc - pc % 10; say(said + "% read."); }
    }
    function finish() {
      rb.busy = null;
      rb.photos = rb.photos.concat(items).sort(function (a, b) { return a.when < b.when ? -1 : 1; });
      tidy();
      if (rb.mode !== "add" && (!rb.title || rb.titleAuto)) {
        var votes = {};
        rb.photos.forEach(function (p) { var c = p.lat != null && cityOf(p.lat, p.lon); if (c) votes[c] = (votes[c] || 0) + 1; });
        var top = Object.keys(votes).sort(function (a, b) { return votes[b] - votes[a]; })[0], yr = rb.photos[0].date.slice(0, 4);
        rb.title = (top ? top + " " : "Holiday ") + yr; rb.titleAuto = true;
        var ti = document.getElementById("rb-title"); if (ti) ti.value = rb.title;
      }
      drawGroups();
      say("Done. " + countText(items) + " read. Press Next to check the days and places.");
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
    var k = rbStepAt().step.k;
    rb.gs = rb.photos.length ? groups() : [];
    out.innerHTML = k === "choose" ? chooseBody() : k === "check" ? checkBody() : k === "tidy" ? tidyPanel() : k === "videos" ? videoBody() : saveBody();
    if (k === "save") refreshFile();
    updateChrome();
  }
  function redraw() { keepPlace(drawGroups); }

  // Step 1: what was read.
  function chooseBody() {
    if (!rb.photos.length) return '<div class="empty" style="margin-top:18px"><b>No photos chosen yet.</b><p>Tip: photos straight from your phone keep their date and place. Photos sent through WhatsApp or downloaded from Facebook usually lose them, so use the originals from your phone or Google Photos ("Download" keeps them).</p></div>';
    var gs = rb.gs, T = rbTarget();
    var withGps = rb.photos.filter(function (p) { return p.lat != null; }).length;
    var guessed = rb.photos.filter(function (p) { return p.guessDate; }).length;
    var first = rb.photos[0].date, last = rb.photos[rb.photos.length - 1].date;
    return '<div class="notice" style="margin-top:18px">' + countText(rb.photos) + ' from ' + esc(nice(first)) + ' to ' + esc(nice(last)) + '. ' +
      withGps + ' have a place saved in them. ' + (guessed ? guessed + ' have no date inside, so we used the file date, which may be wrong. ' : "") +
      (T ? gs.filter(function (g) { return g.anchor; }).reduce(function (n, g) { return n + g.photos.length; }, 0) + ' matched a planned stop.' : gs.length + ' stops over ' + Object.keys(gs.reduce(function (o, g) { o[g.date] = 1; return o; }, {})).length + ' days.') + '</div>' +
      '<div class="row" style="margin-top:12px"><button class="btn" id="rb-clear" type="button">Start again</button></div>' + leftOutNote();
  }

  // Step 2: days fold to one line each. A day's photos are only drawn when it is opened.
  function rbDays() {
    var gs = rb.gs, T = rbTarget(), days = [];
    if (T) {
      (T.days || []).forEach(function (d, n) { days.push({ id: d.date, label: "Day " + (n + 1) + " · " + nice(d.date, true), sub: d.title || d.city || "", plan: d.places || [], gs: gs.filter(function (g) { return g.inTrip && g.date === d.date; }) }); });
      var outside = gs.filter(function (g) { return !g.inTrip; });
      if (outside.length) days.push({ id: "outside", label: "Outside the trip dates", sub: "", outside: true, gs: outside });
    } else {
      var cities = dayCities(gs), order = [];
      gs.forEach(function (g) { if (order.indexOf(g.date) < 0) order.push(g.date); });
      order.forEach(function (date, n) { days.push({ id: date, label: "Day " + (n + 1) + " · " + nice(date, true), sub: cities[date] || "", gs: gs.filter(function (g) { return g.date === date; }), canDrop: true }); });
    }
    return days;
  }
  function needsName(g) { return !g.anchor && !String(rb.names[g.key] || "").trim(); }
  function dayOpen(d, total) { rb.open = rb.open || {}; return rb.needs || (rb.open[d.id] != null ? rb.open[d.id] : d.gs.length > 0 && total <= 3); }
  function dayLine(d) {
    var ph = d.gs.reduce(function (k, g) { return k.concat(g.photos); }, []);
    var lo = d.outside ? 0 : rb.photos.filter(function (p) { return p.out && p.date === d.id; }).length;
    return '<b>' + esc(d.label) + '</b>' + (d.sub ? ' · ' + esc(d.sub) : "") + ' <span class="muted">· ' + (d.gs.length ? d.gs.length + (d.gs.length === 1 ? " stop" : " stops") + ' · ' + countText(ph) : "no photos yet") + (lo ? ' · ' + lo + ' left out' : "") + '</span>';
  }
  function checkBody() {
    var days = rbDays(), need = rb.gs.filter(needsName).length, withPics = days.filter(function (d) { return d.gs.length; }).length;
    if (rb.needs && !need) rb.needs = false;
    var html = '<div class="row rb-tools"><button class="btn" id="rb-lookup" type="button">Look up place names online</button>' +
      (need || rb.needs ? '<button class="btn" type="button" id="rb-needs" aria-pressed="' + !!rb.needs + '">' + (rb.needs ? "Show every stop" : "Needs a name (" + need + ")") + '</button>' : "") +
      '<span class="tag" id="rb-lookup-msg" role="status"></span></div>' +
      '<p class="tag">Look up sends the rough spot of each stop (to about 100 metres) to OpenStreetMap to find its name. Nothing else is sent.</p>' + leftOutNote();
    days.forEach(function (d) {
      if (rb.needs && !d.gs.some(needsName)) return;
      var open = dayOpen(d, withPics);
      html += '<details class="rb-day" data-day="' + esc(d.id) + '"' + (open ? " open" : "") + '><summary>' + dayLine(d) + '</summary><div class="rb-day-body">' + (open ? dayBody(d) : "") + '</div></details>';
    });
    return html;
  }
  function dayBody(d) {
    var T = rbTarget(), html = "";
    if (d.plan) {
      var count = function (name) { return d.gs.filter(function (g) { return g.anchor === name; }).reduce(function (k, g) { return k.concat(g.photos); }, []); };
      html += '<ul class="rb-plan" aria-label="Planned stops">' + d.plan.map(function (p) { var k = count(p.name); return '<li class="' + (k.length ? "has" : "none") + '"><b>' + esc(p.name) + '</b> ' + (k.length ? countText(k) : "no photos") + '</li>'; }).join("") + '</ul>';
    }
    if (d.outside) html += '<p class="muted">' + d.gs.reduce(function (k, g) { return k + g.photos.length; }, 0) + ' photos were taken before or after ' + esc(T.title) + ' (' + esc(niceShort(T.start)) + ' to ' + esc(nice(T.end)) + ').</p>' +
      '<label class="check"><input type="checkbox" id="rb-outside"' + (rb.skipOutside ? "" : " checked") + '> Keep them, as extra days at the end of the trip</label>';
    if (d.canDrop) html += '<div class="row"><button class="btn small rb-out-day" type="button" data-date="' + esc(d.id) + '">Leave out this day</button></div>';
    if (!d.gs.length) html += '<p class="tag">No photos for this day yet.</p>';
    d.gs.forEach(function (g) { if (!rb.needs || needsName(g)) html += groupCard(g, rb.gs.indexOf(g)); });
    return html;
  }
  // Up to 3 names to pick with one tap: from OpenStreetMap, the nearest known place, and the stop before.
  function nameIdeas(g, i) {
    var have = String(rb.names[g.key] || "").trim(), out = [], prev = null;
    for (var j = i - 1; j >= 0 && !prev; j--) { var n = rb.gs[j].anchor || String(rb.names[rb.gs[j].key] || "").trim(); if (n) prev = n; }
    [[rb.online && rb.online[g.key], ""], [g.suggest.name, ""], [prev, "Same as the stop before: "]].forEach(function (x) {
      if (x[0] && x[0] !== have && !out.some(function (o) { return o.name === x[0]; })) out.push({ name: x[0], label: x[1] + x[0] });
    });
    return out.slice(0, 3);
  }
  function tile(p) {
    var i = rb.photos.indexOf(p);
    return '<div class="rb-thumb"><button class="rb-x" type="button" data-i="' + i + '" aria-label="Leave out ' + esc(p.name) + '" title="Leave out this photo">×</button>' +
      (p.thumb ? '<button class="rb-rot" type="button" data-i="' + i + '" aria-label="Turn ' + esc(p.name) + ' a quarter turn to the right" title="Turn it the right way up">↻</button><div class="pic loaded"><img src="' + u(p.thumb) + '" alt="' + esc(p.name) + '" loading="lazy"></div>'
        : '<div class="pic"><div class="ph"><small>' + (p.heic ? "iPhone photo" : "Can't show") + '</small>' + esc(p.name) + '</div></div>') +
      '<span class="tag">' + esc(p.time || "") + ' ' + esc(p.name) + '</span></div>';
  }
  function groupCard(g, i) {
    var fixed = !!g.anchor, pics = g.photos.filter(function (p) { return !p.video; }), vids = g.photos.length - pics.length;
    rb.more = rb.more || {};
    var show = rb.more[g.key] || 8, note = rb.notes[g.key] || "", name = rb.names[g.key] || "";
    var ideas = fixed ? [] : nameIdeas(g, i);
    return '<section class="group' + (fixed ? " matched" : "") + (needsName(g) ? " needs" : "") + '" data-key="' + esc(g.key) + '" aria-label="' + esc(fixed ? g.anchor : name || "A stop with no name yet") + '"><div class="head">' +
      (fixed ? '<h4 class="rb-stop"><span class="rb-pin" aria-hidden="true">✓</span>' + esc(g.anchor) + '</h4>'
             : '<input type="text" id="rb-name-' + i + '" data-key="' + esc(g.key) + '" class="rb-name" value="' + esc(name) + '" placeholder="Place name" aria-label="Place name">') +
      '<button class="btn small rb-out-stop" type="button" data-key="' + esc(g.key) + '">Leave out this stop</button>' +
      '<span class="tag">' + countText(g.photos) + ' · ' + esc(g.suggest.how) +
      (g.lat != null ? ' · <a href="https://www.google.com/maps/search/?api=1&query=' + g.lat + ',' + g.lon + '" target="_blank" rel="noopener noreferrer">see on map</a>' : "") + '</span></div>' +
      (ideas.length ? '<div class="rb-ideas" role="group" aria-label="Name ideas">' + ideas.map(function (x) { return '<button class="btn small rb-idea" type="button" data-key="' + esc(g.key) + '" data-name="' + esc(x.name) + '">' + esc(x.label) + '</button>'; }).join("") + '</div>' : "") +
      '<details class="rb-note-box"' + (note ? " open" : "") + '><summary>' + (note ? "Note" : "Add a note") + '</summary>' +
      '<input type="text" id="rb-note-' + i + '" data-key="' + esc(g.key) + '" class="rb-note" value="' + esc(note) + '" placeholder="For example: Ice cream by the river" aria-label="Note for ' + esc(fixed ? g.anchor : name || "this stop") + '"></details>' +
      '<div class="thumbs">' + pics.slice(0, show).map(tile).join("") + '</div>' +
      (pics.length > show ? '<button class="btn small rb-showall" type="button" data-key="' + esc(g.key) + '">' + (pics.length - show > 60 ? "Show 60 more (" + (pics.length - show) + " not shown)" : "Show all " + pics.length) + '</button>' : "") +
      (vids ? '<p class="tag">And ' + countText(g.photos.filter(function (p) { return p.video; })) + ', set up in the Videos step.</p>' : "") + '</section>';
  }
  function cardFor(key) {
    var el = null;
    document.querySelectorAll("#rb-out section.group").forEach(function (s) { if (s.dataset.key === key) el = s; });
    return el;
  }

  // Step 3: what tidy-up set aside, each next to the photo we kept.
  function tidyWhy(p) {
    if (p.tidy === "already") return "Already in this trip in the album, with the same date, time and file name.";
    if (p.tidy === "repeat") return "The same photo as the one we kept.";
    if (p.tidy === "blur") return p.twin ? "A blurrier copy of the one we kept." : "Looks out of focus or shaky. Very plain photos (sky, a wall) can show up here too.";
    var s = p.twin ? Math.round(Math.abs(Date.parse(p.twin.when) - Date.parse(p.when)) / 1000) : 0;
    return "Taken " + (s ? s + (s === 1 ? " second" : " seconds") + " apart" : "at almost the same moment") + ", and the one we kept is sharper.";
  }
  function tidyPanel() {
    var by = { already: [], blur: [], repeat: [], similar: [] };
    rb.photos.forEach(function (p) { if (p.tidy && !p.out) by[p.tidy].push(p); });
    var n = by.blur.length + by.repeat.length + by.similar.length + by.already.length;
    var going = rb.photos.filter(kept).length, outN = rb.photos.filter(function (p) { return p.out; }).length;
    var aside = rb.noTidy ? 0 : rb.photos.filter(function (p) { return !p.out && p.tidy && !p.keep; }).length;
    rb.tidyOk = rb.tidyOk || {}; rb.tidyMore = rb.tidyMore || {};
    var html = '<p class="rb-total" id="rb-total"><b>Going in the album: ' + going + ' of ' + rb.photos.length + '</b>' + (outN ? ' <span class="muted">(' + outN + ' left out by you)</span>' : "") + '</p>';
    if (!n) return html + '<p>No blurry photos, repeats or near-same shots found. Nothing to do here, so go on to the next step.</p>';
    html += '<p>' + (rb.noTidy ? "Tidy-up is off, so every photo goes in the album." :
      'We set aside ' + aside + (aside < n ? ' of ' + n : "") + ' photos: ' +
      [by.already.length ? by.already.length + " already in the album" : "", by.blur.length ? by.blur.length + " blurry" : "", by.repeat.length ? by.repeat.length + " repeats" : "", by.similar.length ? by.similar.length + " nearly the same as another shot" : ""].filter(Boolean).join(", ") +
      '. Nothing is deleted from your device. Tick "Keep this one too" on any you want back.') + '</p>';
    var sect = function (key, title) {
      var list = by[key]; if (!list.length) return "";
      var shown = rb.tidyMore[key] || 24, ok = rb.tidyOk[key];
      return '<details class="rb-tidy-sec"' + (ok ? "" : " open") + '><summary><b>' + title + '</b> <span class="muted">' + list.length + (ok ? " · you said this looks right" : "") + '</span></summary>' +
        '<div class="rb-pairs">' + list.slice(0, shown).map(function (p) {
          var i = rb.photos.indexOf(p), w = p.twin;
          var fig = function (x, cap) { return '<figure>' + (x.thumb ? '<img src="' + u(x.thumb) + '" alt="' + esc(x.name) + '" loading="lazy">' : '<span class="ph"><small>' + esc(x.name) + '</small></span>') + '<figcaption>' + cap + '</figcaption></figure>'; };
          return '<div class="rb-pair' + (p.keep ? " kept" : "") + '">' + (w ? fig(w, "We kept") : "") + fig(p, p.keep ? "Kept too" : "Set aside") +
            '<p class="tag">' + esc(tidyWhy(p)) + '</p><label class="check"><input type="checkbox" class="rb-keep" data-i="' + i + '"' + (p.keep ? " checked" : "") + '> Keep this one too</label></div>';
        }).join("") + '</div>' +
        (list.length > shown ? '<button class="btn small rb-tidy-more" type="button" data-kind="' + key + '">Show ' + Math.min(60, list.length - shown) + ' more</button>' : "") +
        '<div class="row"><button class="btn small rb-tidy-ok" type="button" data-kind="' + key + '">Looks right</button><button class="btn small rb-keep-all" type="button" data-kind="' + key + '">Keep all of these</button></div></details>';
    };
    return '<div class="rb-tidy">' + html +
      sect("already", "Already in the album") + sect("blur", "Blurry") + sect("repeat", "Repeats") + sect("similar", "Nearly the same") +
      '<label class="check"><input type="checkbox" id="rb-notidy"' + (rb.noTidy ? " checked" : "") + '> Turn tidy-up off and keep every photo</label></div>';
  }

  // Step 4: videos, stop by stop.
  function videoBody() {
    var html = ytHelpPanel();
    rb.gs.forEach(function (g) {
      if (!g.photos.some(function (p) { return p.video; })) return;
      var name = g.anchor || rb.names[g.key] || "A stop with no name yet";
      html += '<section class="group" aria-label="' + esc(name) + '"><h4 class="rb-stop">' + esc(name) + ' <span class="tag">' + esc(nice(g.date, true)) + '</span></h4>' + videoRow(g) + '</section>';
    });
    return html;
  }

  // Step 5: what will be saved, the cover, then one Save button and the files in upload order.
  function coverIdeas() {
    var list = rb.photos.filter(function (p) { return kept(p) && !p.video && p.thumb && p.data; });
    var sharp = list.slice().sort(function (a, b) { return (b.sharp || 0) - (a.sharp || 0); }).slice(0, 60);
    sharp.sort(function (a, b) { return a.when < b.when ? -1 : 1; });
    var out = [];
    for (var k = 0; k < 12 && k < sharp.length; k++) out.push(sharp[Math.floor(k * sharp.length / Math.min(12, sharp.length))]);
    return out.filter(function (p, k, a) { return a.indexOf(p) === k; });
  }
  function saveBody() {
    var T = rbTarget(), html = '<div id="rb-sum"></div>';
    if (!T) {
      var ideas = coverIdeas();
      if (ideas.length) html += '<h3>Cover photo</h3><p class="tag">The big picture on the home page. Pick one, or leave the one we chose.</p><div class="rb-covers" role="group" aria-label="Cover photo">' +
        '<button class="rb-cover auto" type="button" data-i="" aria-pressed="' + (rb.cover == null) + '"><span>Let the album choose</span></button>' +
        ideas.map(function (p) { var i = rb.photos.indexOf(p); return '<button class="rb-cover" type="button" data-i="' + i + '" aria-pressed="' + (rb.cover === i) + '"><img src="' + u(p.thumb) + '" alt="' + esc(p.name) + '" loading="lazy"></button>'; }).join("") + '</div>';
    }
    return html + '<div class="rb-save-box"><div class="row"><button class="btn primary" id="rb-save" type="button">Save my holiday</button>' +
      (window.showDirectoryPicker ? '<button class="btn" id="rb-save-dir" type="button">Save straight into the holidays folder</button>' : "") + '</div>' +
      '<div class="bar-track" id="rb-save-bar" role="progressbar" aria-label="Saving" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" hidden><span></span></div>' +
      '<p class="tag" id="rb-copy-msg" role="status" aria-live="polite"></p></div>' +
      '<h3>Upload them in this order</h3><p class="tag">The photo files go first and the main file last, so the album never points at a file that isn\'t there yet.</p><ol class="rb-filelist" id="rb-filelist"></ol>' +
      '<div class="steps" id="rb-save-steps"></div>' +
      '<details class="rb-more-opts"><summary>More options</summary><div id="rb-more-body"></div></details>' +
      '<h3>How to check it worked</h3><ol class="rb-check-list"><li>Wait about two minutes after uploading, then open the website and reload the page.</li>' +
      '<li>Unlock it with the family passkey. The holiday should be on the home page.</li>' +
      '<li>Open it and look at a few days. If a note says some photos "couldn\'t load", a file is missing or has a different name: upload it again with the exact name shown above.</li></ol>';
  }
  function uploadOrder(names) { return names.slice(1).concat(names.slice(0, 1)); }
  function mb(n) { return n >= 1048576 ? (n / 1048576).toFixed(n < 10485760 ? 1 : 0) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB"; }
  function partBytes(mems) { return Math.round(mems.reduce(function (n, m) { return n + (m.image || "").length + (m.thumb || "").length + (m.clip || "").length + 300; }, 2000) * 1.37); }
  // The list of holiday files with this trip's files in place, keeping the other trips and their order (newest first).
  function listJs(plan) {
    var out = (window.HOLIDAY_FILES || []).filter(function (n) { return n !== plan.names[0] && !partName(plan.id, n); }), at = out.length;
    for (var k = 0; k < out.length; k++) {
      var h = holidays.filter(function (x) { return x.id + ".js" === out[k]; })[0];
      if (h && h.start < plan.hol.start) { at = k; break; }
    }
    out.splice.apply(out, [at, 0].concat(plan.names));
    return "/*\n  The list of holiday files the album shows, newest first.\n  To add a holiday: put its file in this folder and add its name here.\n*/\nwindow.HOLIDAY_FILES = [\n" + out.map(function (n) { return '  "' + n + '"'; }).join(",\n") + "\n];\n";
  }
  function giveFile(name, text) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/javascript" }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 60000);
  }
  function markSaved(name) {
    rb.saved = rb.saved || {}; rb.saved[name] = true;
    document.querySelectorAll("#rb-filelist li").forEach(function (li) { if (li.dataset.name === name) li.classList.add("saved"); });
  }
  function saveGuard(msg) {
    if (rb.mode === "add" && rb.target && (partsFailed[rb.target] || []).length) {
      msg.textContent = "A photos file didn't load (" + partsFailed[rb.target].join(", ") + "). Saving now would leave out the photos in that file, so we stopped. Reload the page and try again.";
      return false;
    }
    var T2 = rb.mode === "add" && rbTarget();
    if (T2 && T2.v2 && !v2Ready(T2)) {
      msg.textContent = "Loading all of this trip's photos first, so none are lost…";
      loadAllV2(T2, function (n, all) { msg.textContent = "Loading this trip's photos (" + n + " of " + all + ")…"; }).then(function (ok) {
        msg.textContent = ok ? "Ready. Press Save again." : "Some photo files didn't load. Reload the page and try again.";
        if (ok) refreshFile();
      });
      return false;
    }
    if (rb.mode === "add" && rb.target && (laterFor(rb.target).length || partsBusy[rb.target])) {
      msg.textContent = "Still loading this trip's photos. Wait a moment and press Save again, so none of them are lost.";
      loadParts(rb.target); return false;
    }
    return true;
  }
  function saveAll(toFolder) {
    flushLink(); refreshFile();
    var msg = document.getElementById("rb-copy-msg");
    if (!saveGuard(msg)) return;
    var pick = toFolder ? window.showDirectoryPicker({ mode: "readwrite", id: "holidays" }) : Promise.resolve(null);
    pick.then(function (dir) {
      return buildFiles(msg).then(function (files) {
        var byName = {}; files.forEach(function (f) { byName[f.name] = f; });
        var order = uploadOrder(rb.plan.names).map(function (n) { return byName[n]; });
        if (dir) {
          return order.reduce(function (chain, f) {
            return chain.then(function () {
              return dir.getFileHandle(f.name, { create: true }).then(function (fh) { return fh.createWritable(); })
                .then(function (w) { return w.write(f.text).then(function () { return w.close(); }); }).then(function () { markSaved(f.name); });
            });
          }, Promise.resolve()).then(function () {
            msg.textContent = "Saved " + order.length + (order.length === 1 ? " file" : " files") + " into the folder " + dir.name + "." + (dir.name === "holidays" ? "" : " Check that this is the website's holidays folder.") + " Now update list.js (under More options) if the names are new.";
            say("Saved.");
          });
        }
        order.forEach(function (f, i) { setTimeout(function () { giveFile(f.name, f.text); markSaved(f.name); if (i === order.length - 1) say("All files saved."); }, i * 1500); });
        msg.textContent = order.length === 1 ? "Saved " + order[0].name + " to your Downloads folder."
          : "Saving " + order.length + " files to your Downloads folder, in upload order. If the browser asks, allow it to download multiple files.";
      });
    }).catch(function (e) {
      if (e && e.name === "AbortError") { msg.textContent = "No folder chosen, so nothing was saved."; return; }
      msg.textContent = "This browser could not lock the files. Open the album from the website (https) and try again.";
    });
  }

  // YouTube links save a moment after typing stops, and at once on leaving the box or on Save.
  var linkTimer = null, linkEl = null;
  function flushLink() {
    clearTimeout(linkTimer); linkTimer = null; if (!linkEl) return;
    var el = linkEl, p = rb.photos[+el.dataset.i], k = ytKind(p.link); linkEl = null;
    var st = document.getElementById("rb-yt-st-" + el.dataset.i); if (st) st.innerHTML = ytStatus(p.link);
    if (k === "bad" || k === "playlist") el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
  }
  function stopName(g) { return g ? g.anchor || String(rb.names[g.key] || "").trim() || "this stop" : "this stop"; }
  function leaveOut(list, text, focusKey, focusI) {
    list.forEach(function (p) { p.out = true; });
    redraw();
    say(text, function () { list.forEach(function (p) { delete p.out; }); redraw(); say("Put back."); });
    var f = focusI != null && document.querySelector('#rb-out .rb-x[data-i="' + focusI + '"]');
    if (!f && focusKey) { var c = cardFor(focusKey); f = c && (c.querySelector(".rb-x") || c.querySelector("input, button")); }
    if (!f) f = document.getElementById("rb-step-h");
    if (f) f.focus({ preventScroll: true });
  }
  function rbClick(e) {
    var b = e.target.closest && e.target.closest("button");
    if (!b || b.disabled) return;
    var d = b.dataset, id = b.id;
    if (d.go) return goStep(d.go);
    if (id === "rb-undo") { var fn = rb.undo; rb.undo = null; document.getElementById("rb-toast").hidden = true; if (fn) fn(); return; }
    if (b.classList.contains("rb-x")) {
      var p = rb.photos[+d.i], g = rb.gs.filter(function (x) { return x.photos.indexOf(p) >= 0; })[0];
      var tiles = Array.prototype.slice.call(b.closest(".thumbs").querySelectorAll(".rb-x")), at = tiles.indexOf(b);
      var nb = tiles[at + 1] || tiles[at - 1], left = g ? g.photos.length - 1 : 0;
      return leaveOut([p], p.name + " left out, " + left + " left in " + stopName(g) + ".", g && g.key, nb ? nb.dataset.i : null);
    }
    if (b.classList.contains("rb-rot")) {
      b.disabled = true;
      var rp = rb.photos[+d.i];
      turnItem(rp).then(function () { var im = b.parentNode.querySelector("img"); if (im) im.src = rp.thumb; b.disabled = false; say(rp.name + " turned."); });
      return;
    }
    if (b.classList.contains("rb-out-stop")) {
      var sg = rb.gs.filter(function (x) { return x.key === d.key; })[0];
      if (sg) leaveOut(sg.photos.slice(), stopName(sg) + " left out (" + countText(sg.photos) + ").");
      return;
    }
    if (b.classList.contains("rb-out-day")) {
      var dl = rb.photos.filter(function (x) { return !x.out && x.date === d.date; });
      return leaveOut(dl, nice(d.date, true) + " left out (" + countText(dl) + ").");
    }
    if (b.classList.contains("rb-showall")) {
      rb.more = rb.more || {};
      var was = rb.more[d.key] || 8, cg = rb.gs.filter(function (x) { return x.key === d.key; })[0], card = cardFor(d.key);
      rb.more[d.key] = was + 60;
      if (cg && card) {
        card.outerHTML = groupCard(cg, rb.gs.indexOf(cg));
        var nc = cardFor(d.key), first = nc && nc.querySelectorAll(".rb-x")[was];
        if (first) first.focus();
        say("Showing " + Math.min(rb.more[d.key], cg.photos.length) + " photos.");
      }
      return;
    }
    if (b.classList.contains("rb-idea")) {
      rb.names[d.key] = d.name;
      var c2 = cardFor(d.key), inp = c2 && c2.querySelector(".rb-name");
      if (inp) { inp.value = d.name; inp.focus(); }
      b.parentNode.querySelectorAll(".rb-idea").forEach(function (x) { if (x.dataset.name === d.name) x.remove(); });
      updateNeeds(); say("Named " + d.name + ".");
      return;
    }
    if (id === "rb-needs") { rb.needs = !rb.needs; drawGroups(); var nb2 = document.getElementById("rb-needs"); if (nb2) nb2.focus(); return; }
    if (id === "rb-lookup") return lookupOnline(rb.gs);
    if (id === "rb-clear") { rb.photos = []; rb.names = {}; rb.notes = {}; rb.online = {}; rb.more = {}; rb.cover = null; if (rb.titleAuto) rb.title = ""; return goStep("choose"); }
    if (id === "rb-put-back") { var back = rb.photos.filter(function (x) { return x.out; }); back.forEach(function (x) { delete x.out; }); redraw(); say(countText(back) + " put back."); return; }
    if (b.classList.contains("rb-keep-all")) {
      var kl = rb.photos.filter(function (x) { return x.tidy === d.kind && !x.keep && !x.out; });
      kl.forEach(function (x) { x.keep = true; }); redraw();
      say(countText(kl) + " kept.", function () { kl.forEach(function (x) { delete x.keep; }); redraw(); say("Set aside again."); });
      return;
    }
    if (b.classList.contains("rb-tidy-ok")) { rb.tidyOk[d.kind] = true; redraw(); say("Done. That group is folded away."); return; }
    if (b.classList.contains("rb-tidy-more")) { rb.tidyMore[d.kind] = (rb.tidyMore[d.kind] || 24) + 60; redraw(); return; }
    if (id === "rb-yt-match") {
      var m = matchLinks(document.getElementById("rb-yt-all").value, document.getElementById("rb-yt-newest").checked);
      redraw(); var m2 = document.getElementById("rb-yt-msg"); if (m2) m2.textContent = m;
      return;
    }
    if (b.classList.contains("rb-cover")) {
      rb.cover = d.i === "" ? null : +d.i;
      document.querySelectorAll(".rb-cover").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      refreshFile(); return;
    }
    if (id === "rb-save") return saveAll(false);
    if (id === "rb-save-dir") return saveAll(true);
    if (b.classList.contains("rb-again")) {
      var f = rb.built && rb.built.files.filter(function (x) { return x.name === d.name; })[0];
      if (f) giveFile(f.name, f.text); else saveAll(false);
      return;
    }
    if (id === "rb-list-js") return giveFile("list.js", listJs(rb.plan));
    if (id === "rb-copy") {
      flushLink();
      var ta = document.getElementById("rb-file"), msg = document.getElementById("rb-copy-msg");
      if (!saveGuard(msg)) return;
      buildFiles(msg).then(function (files) {
        if (files.length > 1 || files[0].text.length > 1500000) { msg.textContent = "Too big to copy. Use Save my holiday instead."; return; }
        ta.value = files[0].text;
        var done = function () { msg.textContent = "Copied. Paste it into Notepad and save it with the name shown above."; };
        try { navigator.clipboard.writeText(files[0].text).then(done, function () { ta.select(); msg.textContent = "Press Ctrl+C (or Cmd+C) to copy the selected text."; }); }
        catch (err) { ta.select(); msg.textContent = "Press Ctrl+C (or Cmd+C) to copy the selected text."; }
      }, function () { msg.textContent = "This browser could not lock the file. Open the album from the website (https) and try again."; });
    }
  }
  function updateNeeds() {
    var nb = document.getElementById("rb-needs"); if (!nb || rb.needs) return;
    nb.textContent = "Needs a name (" + rb.gs.filter(needsName).length + ")";
    document.querySelectorAll("#rb-out section.group").forEach(function (s) {
      var g = rb.gs.filter(function (x) { return x.key === s.dataset.key; })[0];
      if (g) s.classList.toggle("needs", needsName(g));
    });
  }
  function rbInput(e) {
    var el = e.target, c = el.classList;
    if (c.contains("rb-name")) { rb.names[el.dataset.key] = el.value; updateNeeds(); }
    else if (c.contains("rb-note")) rb.notes[el.dataset.key] = el.value;
    else if (c.contains("rb-link")) { rb.photos[+el.dataset.i].link = el.value.trim(); if (linkEl && linkEl !== el) flushLink(); linkEl = el; clearTimeout(linkTimer); linkTimer = setTimeout(flushLink, 300); }
  }
  function rbChange(e) {
    var el = e.target, c = el.classList;
    if (c.contains("rb-link")) flushLink();
    else if (c.contains("rb-fav")) rb.photos[+el.dataset.i].fav = el.checked;
    else if (c.contains("rb-keep")) {
      var p = rb.photos[+el.dataset.i]; p.keep = el.checked;
      var pair = el.closest(".rb-pair"); if (pair) { pair.classList.toggle("kept", el.checked); var cap = pair.querySelectorAll("figcaption"); cap[cap.length - 1].textContent = el.checked ? "Kept too" : "Set aside"; }
      var tot = document.getElementById("rb-total"); if (tot) tot.querySelector("b").textContent = "Going in the album: " + rb.photos.filter(kept).length + " of " + rb.photos.length;
    }
    else if (el.id === "rb-notidy") { rb.noTidy = el.checked; redraw(); }
    else if (el.id === "rb-outside") rb.skipOutside = !el.checked;
  }
  // A day's photos are drawn when it is opened, and cleared when it is closed, so long trips stay quick.
  function rbToggle(e) {
    var d = e.target;
    if (!d.classList || !d.classList.contains("rb-day")) return;
    rb.open = rb.open || {}; rb.open[d.dataset.day] = d.open;
    var body = d.querySelector(".rb-day-body");
    if (!d.open) { body.innerHTML = ""; return; }
    if (body.innerHTML) return;
    var day = rbDays().filter(function (x) { return x.id === d.dataset.day; })[0];
    if (day) body.innerHTML = dayBody(day);
  }

  // Ask OpenStreetMap for the name of each place, one every 1.2 seconds (their rule).
  function lookupOnline(gs) {
    var msg = document.getElementById("rb-lookup-msg");
    var todo = gs.filter(function (g) { return g.lat != null && !g.anchor; });
    if (!todo.length) { msg.textContent = "None of these photos has a place saved in it."; return; }
    rb.online = rb.online || {};
    var i = 0, failed = 0;
    (function next() {
      if (i >= todo.length) {
        var end = failed === todo.length ? "Could not reach OpenStreetMap from here. Open the album from your computer or the website to use this." : "Place names updated. Check them below, and tap a name idea to use it.";
        redraw(); var m2 = document.getElementById("rb-lookup-msg"); if (m2) m2.textContent = end; say(end); return;
      }
      var g = todo[i++];
      msg = document.getElementById("rb-lookup-msg") || msg;
      if (msg) msg.textContent = "Looking up " + i + " of " + todo.length + "…";
      fetch("https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=17&accept-language=en&lat=" + g.lat.toFixed(3) + "&lon=" + g.lon.toFixed(3))
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
    if (!rb.photos.length) return;
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
        cover: { image: rb.cover != null && rb.photos[rb.cover] && kept(rb.photos[rb.cover]) && rb.photos[rb.cover].data ? rb.photos[rb.cover].data : memories[0] ? memories[Math.floor(memories.length / 3)].image : "" },
        summary: days.length + " days and " + countText(memories.map(function (m) { return { video: m.kind === "video" }; })) + (cityList.length ? ", from " + cityList.slice(0, 6).join(" to ") : "") + ".",
        route: route, days: days, memories: memories
      };
    }
    var plan = planV2(hol, id), names = plan.names;
    rb.plan = plan;
    rb.built = null; rb.saved = {};
    var sum = document.getElementById("rb-sum");
    if (!sum) return;
    var sizes = plan.sizes, total = 0;
    names.forEach(function (n) { total += sizes[n]; });
    var newMems = memories.length, vids = memories.filter(function (m) { return m.kind === "video"; }), clips = rb.photos.filter(function (p) { return kept(p) && p.video && p.fav; }).length;
    var skipped = rb.photos.filter(function (p) { return kept(p) && !p.data; }).length, aside = rb.photos.length - rb.photos.filter(kept).length;
    var pct = Math.min(100, Math.round(total / 1073741824 * 100));
    sum.innerHTML = '<div class="rb-sum"><p><b>' + (isNew ? esc(hol.title) : "Adding to " + esc(hol.title)) + '</b>: ' + countText(memories.map(function (m) { return { video: m.kind === "video" }; })) +
      (isNew ? ' over ' + hol.days.length + (hol.days.length === 1 ? " day" : " days") + ' and ' + hol.days.reduce(function (n, d) { return n + d.places.length; }, 0) + ' stops' : ' (the trip will then have ' + hol.memories.length + ' in all)') + '.' +
      (clips ? ' ' + clips + (clips === 1 ? " video gets" : " videos get") + ' a 20-second clip.' : "") + (vids.filter(function (m) { return m.yt; }).length ? ' ' + vids.filter(function (m) { return m.yt; }).length + ' linked to YouTube.' : "") +
      (aside ? ' ' + aside + ' set aside or left out.' : "") + (skipped ? ' ' + skipped + ' could not be added (iPhone HEIC photos, or files the browser could not open). Change them to JPG first.' : "") + '</p>' +
      '<p>This saves ' + (names.length === 1 ? "1 file" : names.length + " files") + ', about ' + mb(total) + ' in all.</p>' +
      '<div class="rb-meter" aria-hidden="true"><span style="width:' + Math.max(1, pct) + '%"></span></div>' +
      '<p class="tag">GitHub Pages allows about 1 GB for the whole website, and this holiday uses ' + (pct < 1 ? "less than 1%" : "about " + pct + "%") + ' of it. Every save also stays in GitHub\'s history, so save a big trip once rather than many times.</p></div>';
    document.getElementById("rb-filelist").innerHTML = uploadOrder(names).map(function (n, k) {
      return '<li data-name="' + esc(n) + '"' + (rb.saved[n] ? ' class="saved"' : "") + '><span class="rb-tick" aria-hidden="true"></span><code>' + esc(n) + '</code> <span class="tag">about ' + mb(sizes[n]) + (k === names.length - 1 && names.length > 1 ? ", the main file, last" : "") + '</span>' +
        '<button class="btn small rb-again" type="button" data-name="' + esc(n) + '">Download again</button></li>';
    }).join("");
    document.getElementById("rb-save-steps").innerHTML = '<div><b>Save</b><p class="muted">Press <b>Save my holiday</b>. Your photos are inside, locked with your passkey, with their hidden phone data removed.</p></div>' +
      '<div><b>Put them in the website</b><p class="muted">Move the saved ' + (names.length > 1 ? 'files' : 'file') + ' into the <code>holidays</code> folder' + (isNew ? '' : ', replacing the old ones') + ', in the order above.</p></div>' +
      '<div><b>Update the list</b><p class="muted">' + (listJs(rb.plan) === listJsNow() ? 'The list already has these names, so there is nothing to change.' : 'Download the new <code>list.js</code> under More options and put it in the same folder, replacing the old one.') + '</p></div>' +
      '<div><b>Or ask Claude</b><p class="muted">Send Claude the saved ' + (names.length > 1 ? 'files' : 'file') + ', and it will put them in the album for you.</p></div>';
    var small = names.length === 1 && total < 1500000;
    document.getElementById("rb-more-body").innerHTML = '<div class="row"><button class="btn" type="button" id="rb-list-js">Download the new list.js</button><span class="tag">Keeps the other trips and their order.</span></div>' +
      (small ? '<label for="rb-file" class="eyebrow">Holiday file as text</label><textarea id="rb-file" readonly placeholder="Press Copy to lock it and show it here"></textarea><div class="row"><button class="btn" type="button" id="rb-copy">Copy holiday file</button></div>' : "");
  }
  function listJsNow() {
    return "/*\n  The list of holiday files the album shows, newest first.\n  To add a holiday: put its file in this folder and add its name here.\n*/\nwindow.HOLIDAY_FILES = [\n" + (window.HOLIDAY_FILES || []).map(function (n) { return '  "' + n + '"'; }).join(",\n") + "\n];\n";
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
    var n = plan.bodies.length;
    return plan.bodies.reduce(function (chain, body, i) {
      return chain.then(function () {
        if (msg) msg.textContent = "Locking " + (n > 1 ? "file " + (i + 1) + " of " + n : "the holiday file") + "…";
        var bar = document.getElementById("rb-save-bar") || document.getElementById("v2-bar");
        if (bar) { var pc = Math.round(i / n * 100); bar.hidden = false; bar.setAttribute("aria-valuenow", pc); bar.firstChild.style.width = pc + "%"; }
        return lockHoliday(body, unlockedKey).then(function (box) {
          files.push({ name: plan.names[i], text: "/* " + plan.hol.title + (i ? ", " + (body.kind === "thumbs" ? "small photos" : "full photos") + " part " + body.part : "") + ". Holiday file made on " + stamp + ". Locked with the album passkey. Save as holidays/" + plan.names[i] + " */\nHolidayAlbum.addLocked(" + JSON.stringify(box) + ");\n" });
        });
      });
    }, Promise.resolve()).then(function () {
      var bar = document.getElementById("rb-save-bar") || document.getElementById("v2-bar");
      if (bar) { bar.setAttribute("aria-valuenow", 100); bar.firstChild.style.width = "100%"; }
      rb.built = { plan: plan, files: files }; return files;
    });
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
        var ib = e.target.closest && e.target.closest(".info-copy, .info-check, .info-save, .info-list");
        if (ib) infoClick(ib);
        if (foldClick(e)) return;
        var pb = e.target.closest && e.target.closest(".plan-save");
        if (pb && !pb.disabled) planSave(pb);
        var qg = e.target.closest && e.target.closest(".quick-go");
        if (qg && !qg.disabled) quickGo(qg);
        var sp = e.target.closest && e.target.closest(".place-photos");
        if (sp) openStopPhotos(sp);
      });
      document.addEventListener("change", function (e) { if (e.target.classList && e.target.classList.contains("plan-file")) planPick(e.target); });
      document.addEventListener("toggle", function (e) {
        var t = e.target; if (!t.matches || !t.matches("details.day, details[data-fold]")) return;
        var hid = t.dataset.h || ((document.querySelector("details.day[data-h]") || {}).dataset || {}).h;
        if (hid) foldRead(hid);
      }, true);
    }
    render();
  }
  var begun = false;

  // ---------- Location's information (past trips built from photos) ----------
  // A past trip has no plan, so each stop's facts come from our photos (when we were there, how we likely got there)
  // and from an information file Claude writes, locked like the photos (holidays/<id>.info.js).
  var infoPacks = [], infoDraft = null;
  var INFO_FIELDS = ["name", "lead", "what", "best", "tips", "again", "wiki"];
  function isPastTrip(h) {
    return (h.memories || []).length > 0 && !(h.days || []).some(function (d) { return (d.places || []).some(function (p) { return p.more; }); });
  }
  // Which of our photos belong to which stop: same name first (a repeated name has ", stop 2" added), then the nearest stop.
  function visitsFor(h) {
    if (h._visits && h._visits.n === h.memories.length) return h._visits.map;
    var map = {};
    (h.days || []).forEach(function (d, di) {
      var mems = h.memories.filter(function (m) { return m.date === d.date; });
      mems.forEach(function (m) {
        var best = -1, bd = 1e9;
        (d.places || []).forEach(function (p, pi) {
          var pn = p._orig || p.name, named = m.place && (pn === m.place || pn.indexOf(m.place + ", stop ") === 0);
          var km = p.lat != null && m.lat != null ? distKm(p.lat, p.lon, m.lat, m.lon) : named ? 0 : 1e6;
          var score = named ? km : km + 1000;
          if (score < bd && (named || km < 2)) { bd = score; best = pi; }
        });
        if (best < 0) return;
        var k = (di + 1) + "." + (best + 1), v = map[k] = map[k] || { mems: [], first: "", last: "" };
        v.mems.push(m); m.label = d.places[best].name;
        if (m.time && (!v.first || m.time < v.first)) v.first = m.time;
        if (m.time && m.time > v.last) v.last = m.time;
        if (!v.pic && m.kind !== "video" && (m.thumb || m.image || m.tp)) v.pic = m;
      });
    });
    h._visits = { n: h.memories.length, map: map };
    return map;
  }
  // Each night's hotel, from the days' "sleep", joined when we stayed more than one night.
  function pastStays(h, vs) {
    var out = [];
    (h.days || []).forEach(function (d, di) {
      if (!d.sleep || /plane/i.test(d.sleep)) return;
      var last = out[out.length - 1];
      if (last && last.name === d.sleep && last.lastDay === di - 1) { last.n++; last.lastDay = di; last.to = d.date; return; }
      out.push({ name: d.sleep, city: d.city || "", n: 1, from: d.date, to: d.date, lastDay: di, firstDay: di });
    });
    // For each night: the day's last photo and the next morning's first photo, and how far each was from the hotel.
    var timed = function (di) { var d = (h.days || [])[di]; return d ? h.memories.filter(function (m) { return m.date === d.date && m.time && m.lat != null; }).sort(function (a, b) { return a.time < b.time ? -1 : 1; }) : []; };
    var far = function (m, p) { var km = distKm(p.lat, p.lon, m.lat, m.lon); return km < 1 ? "at the hotel" : km < 10 ? km.toFixed(1) + " km away" : Math.round(km) + " km away"; };
    return out.map(function (s) {
      var key = s.name.split(",")[0].toLowerCase(), own = null, k = null, vk = "", count = 0;
      (h.days || []).forEach(function (d, di) { (d.places || []).forEach(function (p, pi) {
        var v = vs[(di + 1) + "." + (pi + 1)];
        if (!v || p.name.toLowerCase().indexOf(key) !== 0) return;
        count += v.mems.length;
        if (!own && v.pic) { own = v.pic; k = v.pic.k; vk = (di + 1) + "." + (pi + 1); }
      }); });
      var spot = null;
      (h.days || []).forEach(function (d) { (d.places || []).forEach(function (p) { if (!spot && p.lat != null && p.name.toLowerCase().indexOf(key) === 0) spot = p; }); });
      var proof = [];
      for (var di = s.firstDay; di <= s.lastDay; di++) {
        var eve = timed(di).pop(), morn = timed(di + 1)[0], bits = [];
        if (spot && eve) bits.push("last photo " + eve.time + ", " + far(eve, spot));
        if (spot && morn) bits.push("first photo next morning " + morn.time + ", " + far(morn, spot));
        if (bits.length) proof.push(niceShort(h.days[di].date) + ": " + bits.join("; ") + ".");
      }
      return { name: s.name, city: s.city, type: "hotel", nights: niceShort(s.from) + (s.n > 1 ? " to " + niceShort(s.to) : "") + " · " + s.n + (s.n === 1 ? " night" : " nights"),
        why: count ? count + (count === 1 ? " photo" : " photos") + " taken here." : "No photos taken at the hotel itself.", proof: proof,
        image: own ? own.thumb || own.image : "", vk: own && !own.thumb && !own.image && k != null ? h.id + ":" + k : "", mapQuery: s.name,
        past: own ? { photos: '<button class="more-btn spots place-photos" type="button" data-h="' + esc(h.id) + '" data-k="' + vk + '"><span aria-hidden="true">◎</span>Our photos here</button>' } : null };
    });
  }
  function visitText(d, v) {
    if (!v) return "";
    return nice(d.date, true) + (v.first ? ", " + v.first + (v.last && v.last !== v.first ? " to " + v.last : "") : "") + " · " + countText(v.mems.map(function (m) { return { video: m.kind === "video" }; }));
  }
  // Our best guess of how we got from one stop to the next, from the distance and the time between photos.
  function likelyJourneys(h, di) {
    var d = h.days[di], vs = visitsFor(h), out = [];
    var stops = (d.places || []).map(function (p, pi) { return { p: p, v: vs[(di + 1) + "." + (pi + 1)] }; }).filter(function (s) { return s.p.lat != null && s.v; });
    stops.sort(function (a, b) { return (a.v.first || "") < (b.v.first || "") ? -1 : 1; });
    var mins = function (t) { var x = String(t || "").split(":"); return x.length > 1 ? +x[0] * 60 + +x[1] : null; };
    for (var i = 1; i < stops.length; i++) {
      var a = stops[i - 1], b = stops[i], km = distKm(a.p.lat, a.p.lon, b.p.lat, b.p.lon) * 1.3;
      if (km < 0.3) continue;
      var t0 = mins(a.v.last), t1 = mins(b.v.first), gap = t0 != null && t1 != null && t1 > t0 ? t1 - t0 : null;
      var speed = gap ? km / (gap / 60) : null;
      var how = speed != null ? (speed < 6 ? "On foot" : speed < 40 ? "By metro, tram or bus" : speed < 200 ? "By car or train" : "By plane")
        : (km < 2 ? "On foot" : km < 15 ? "By metro, tram or bus" : km < 400 ? "By car or train" : "By plane");
      out.push("Likely " + how.toLowerCase() + ", " + a.p.name + " to " + b.p.name + ": about " + (km < 10 ? km.toFixed(1) : Math.round(km)) + " km" +
        (gap ? ", " + (gap < 90 ? gap + " minutes" : Math.round(gap / 6) / 10 + " hours") + " between the last photo at one and the first at the next" : "") + ".");
    }
    return out;
  }
  function cleanInfo(x) {
    var o = {};
    if (!x || typeof x !== "object") return null;
    INFO_FIELDS.forEach(function (f) { if (x[f] != null && String(x[f]).trim()) o[f] = String(x[f]).trim().slice(0, f === "wiki" || f === "name" ? 120 : 700); });
    if (Array.isArray(x.pins)) { var pins = x.pins.slice(0, 8).map(function (t) { return String(t).trim().slice(0, 80); }).filter(Boolean); if (pins.length) o.pins = pins; }
    if (TYPE_LABEL[x.type]) o.type = x.type;
    return Object.keys(o).length ? o : null;
  }
  function applyInfo(h, pack) {
    var n = 0;
    Object.keys(pack.places || {}).forEach(function (k) {
      var m = /^(\d+)\.(\d+)$/.exec(k), info = cleanInfo(pack.places[k]);
      if (!m || !info) return;
      var d = (h.days || [])[+m[1] - 1], p = d && (d.places || [])[+m[2] - 1];
      if (!p) return;
      if (info.type) { p.type = info.type; delete info.type; }
      if (info.wiki && !p.wiki) p.wiki = info.wiki;
      if (info.name) { p._orig = p._orig || p.name; p.name = info.name; }
      p.info = info; n++;
    });
    Object.keys(pack.days || {}).forEach(function (k) {
      var d = (h.days || [])[+k - 1], t = pack.days[k] && pack.days[k].title, z = pack.days[k] && pack.days[k].sleep;
      if (d && t) d.title = String(t).trim().slice(0, 120);
      if (d && z) d.sleep = String(z).trim().slice(0, 120);
    });
    h._info = pack; h._visits = null;
    return n;
  }
  function mergeInfo() {
    infoPacks.splice(0).forEach(function (pack) {
      var h = holidays.filter(function (x) { return x.id === pack.infoFor; })[0];
      if (h) applyInfo(h, pack); else infoPacks.push(pack);
    });
  }
  function placeList(h) {
    var vs = visitsFor(h), rows = [];
    (h.days || []).forEach(function (d, di) {
      (d.places || []).forEach(function (p, pi) {
        var k = (di + 1) + "." + (pi + 1), v = vs[k];
        rows.push({ key: k, date: d.date, city: d.city || "", name: p.name, near: p.lat != null ? p.lat.toFixed(3) + "," + p.lon.toFixed(3) : "", when: v ? visitText(d, v) : "" });
      });
    });
    return "Please write Location's information for each stop of our past trip \"" + h.title + "\", in plain simple English, in the same style as our Japan plan. " +
      "If a name is \"Somewhere nice\" or a street, work out the place from the city and the rough spot, and say so in lead. " +
      "Reply with JSON only, shaped like this:\n" +
      '{"days":{"1":{"title":"A short title for the day"}},"places":{"1.1":{"type":"sight|food|shopping|nature|hotel|station|airport","lead":"One or two sentences: what this place is.","what":"What there is to see or do.","best":"Best time to go.","tips":"Good to know.","again":"If we go again.","wiki":"English Wikipedia page title"}}}\n\n' +
      "The stops (key, date, city, name, rough spot, when we were there):\n" + JSON.stringify(rows, null, 1);
  }
  function infoBox(h) {
    var all = 0, have = 0;
    (h.days || []).forEach(function (d) { (d.places || []).forEach(function (p) { all++; if (p.info) have++; }); });
    if (!all) return "";
    return '<div class="tipbox info-box" data-h="' + esc(h.id) + '"><h4><span aria-hidden="true">✦</span> Location\'s information</h4>' +
      '<p>' + (have ? have + ' of ' + all + ' stops have it. Tap <b>Location\'s information</b> on a stop to read it.' : 'None of the ' + all + ' stops have it yet. Claude can write it, like the Japan plan: what each place is, the best time to go, and tips for next time.') + '</p>' +
      '<details><summary>' + (have ? "Update it with Claude" : "Add it with Claude") + '</summary><ol class="info-steps">' +
      '<li><button class="btn small info-copy" type="button">Copy the stop list for Claude</button> Then paste it to Claude. It has the stop names, dates and rough spots, and no photos.</li>' +
      '<li><label for="info-in">Paste Claude\'s reply here</label><textarea id="info-in" rows="5" spellcheck="false" placeholder="{&quot;places&quot;: …}"></textarea><button class="btn small info-check" type="button">Add it to the page</button></li>' +
      '<li><button class="btn small info-save" type="button" disabled>Save the information file</button> <button class="btn small info-list" type="button" disabled>Download the new list.js</button> Put both in the website\'s <code>holidays</code> folder.</li></ol>' +
      '<p class="tag info-msg" role="status" aria-live="polite"></p></details></div>';
  }
  function infoClick(b) {
    var box = b.closest(".info-box"), h = holidays.filter(function (x) { return x.id === box.dataset.h; })[0], msg = box.querySelector(".info-msg");
    if (!h) return;
    if (b.classList.contains("info-copy")) {
      if (laterFor(h.id).length || partsBusy[h.id]) { loadParts(h.id); msg.textContent = "Still loading this trip's photos, so the times aren't ready yet. Press Copy again in a moment."; return; }
      var text = placeList(h), ta = box.querySelector("#info-in");
      var fail = function () { ta.value = text; ta.select(); msg.textContent = "Press Ctrl+C (or Cmd+C) to copy the selected text, then clear the box before pasting Claude's reply."; };
      try { navigator.clipboard.writeText(text).then(function () { msg.textContent = "Copied. Paste it to Claude, then paste the reply in the box below."; }, fail); } catch (e) { fail(); }
      return;
    }
    if (b.classList.contains("info-check")) {
      var raw = box.querySelector("#info-in").value, s = raw.indexOf("{"), e2 = raw.lastIndexOf("}"), pack;
      try { pack = JSON.parse(raw.slice(s, e2 + 1)); } catch (err) { msg.textContent = "That doesn't look like Claude's reply. Paste the whole reply, starting with {."; return; }
      if (!pack || typeof pack.places !== "object") { msg.textContent = "The reply has no places in it. Ask Claude again with the stop list."; return; }
      var clean = { infoFor: h.id, made: today(), places: {}, days: {} };
      Object.keys(pack.places).forEach(function (k) { var c = cleanInfo(pack.places[k]); if (c && /^\d+\.\d+$/.test(k)) { if (TYPE_LABEL[pack.places[k].type]) c.type = pack.places[k].type; clean.places[k] = c; } });
      Object.keys(pack.days || {}).forEach(function (k) {
        var dk = pack.days[k]; if (!/^\d+$/.test(k) || !dk) return;
        var c2 = {}; if (dk.title) c2.title = String(dk.title).slice(0, 120); if (dk.sleep) c2.sleep = String(dk.sleep).slice(0, 120);
        if (c2.title || c2.sleep) clean.days[k] = c2;
      });
      var n = applyInfo(h, JSON.parse(JSON.stringify(clean)));
      infoDraft = clean;
      keepPlace(render);
      var nb = document.querySelector(".info-box");
      if (nb) {
        nb.querySelector("details").open = true;
        nb.querySelector(".info-save").disabled = nb.querySelector(".info-list").disabled = false;
        nb.querySelector(".info-msg").textContent = "Added to " + n + " stops on this page. Now save the information file, so it stays.";
      }
      return;
    }
    if (b.classList.contains("info-save")) {
      if (!infoDraft || infoDraft.infoFor !== h.id) return;
      lockHoliday(infoDraft, unlockedKey).then(function (lockedBox) {
        giveFile(h.id + ".info.js", "/* " + h.title + ", location's information, made " + today() + ". Locked with the album passkey. Save as holidays/" + h.id + ".info.js */\nHolidayAlbum.addLocked(" + JSON.stringify(lockedBox) + ");\n");
        msg.textContent = "Saved " + h.id + ".info.js. Put it in the holidays folder" + ((window.HOLIDAY_FILES || []).indexOf(h.id + ".info.js") < 0 ? ", and replace list.js with the new one." : ", replacing the old one.");
      }, function () { msg.textContent = "This browser could not lock the file. Open the album from the website (https) and try again."; });
      return;
    }
    if (b.classList.contains("info-list")) {
      var list = (window.HOLIDAY_FILES || []).slice(), name = h.id + ".info.js";
      if (list.indexOf(name) < 0) {
        var at = list.indexOf(h.id + ".js");
        while (at >= 0 && at + 1 < list.length && list[at + 1].indexOf(h.id + ".photos-") === 0) at++;
        list.splice(at < 0 ? list.length : at + 1, 0, name);
      }
      giveFile("list.js", "/*\n  The list of holiday files the album shows, newest first.\n  To add a holiday: put its file in this folder and add its name here.\n*/\nwindow.HOLIDAY_FILES = [\n" + list.map(function (n) { return '  "' + n + '"'; }).join(",\n") + "\n];\n");
    }
  }
  // "Our photos here" opens the photo viewer at the first photo we took at that stop.
  function openStopPhotos(b) {
    var h = holidays.filter(function (x) { return x.id === b.dataset.h; })[0], v = h && visitsFor(h)[b.dataset.k];
    var m = v && v.mems.filter(function (x) { return x.kind !== "video"; })[0];
    if (m) openPhotoMem(m, b, b.classList.contains("see-all") ? v.mems : null);
  }

  // ---------- folding ----------
  // Each day is a fold. We remember which days are open (and the tips and keeper folds) per trip,
  // so a redraw keeps them, and today's day always opens on a new day of the trip.
  var foldMem = {}, leftReg = [];
  function todayDay(h) { var t = today(), k = -1; (h.days || []).forEach(function (d, i) { if (d.date === t) k = i + 1; }); return k; }
  function foldGet(h) {
    var f = foldMem[h.id], t = todayDay(h);
    if (!f) {
      try { f = JSON.parse(sessionStorage.getItem("album-open:" + h.id) || "null"); } catch (e) { f = null; }
      if (!f || !Array.isArray(f.days)) f = { days: [t > 0 ? t : 1], tips: false, keeper: false, date: today() };
      foldMem[h.id] = f;
    }
    if (f.date !== today()) { if (t > 0 && f.days.indexOf(t) < 0) f.days.push(t); f.date = today(); foldSave(h.id); }
    return f;
  }
  function foldSave(id) { try { sessionStorage.setItem("album-open:" + id, JSON.stringify(foldMem[id])); } catch (e) { } }
  function foldRead(id) {
    var f = foldMem[id]; if (!f) return;
    f.days = [].map.call(document.querySelectorAll('details.day[data-h="' + id + '"][open]'), function (d) { return +d.dataset.day; });
    var t = document.querySelector('details[data-fold="tips"]'), k = document.querySelector('details[data-fold="keeper"]');
    if (t) f.tips = t.open; if (k) f.keeper = k.open;
    foldSave(id);
    var all = document.querySelector(".days-all"), n = document.querySelectorAll('details.day[data-h="' + id + '"]').length;
    if (all) all.textContent = f.days.length >= n ? "Close all days" : "Open all days";
  }
  function openDay(id, n, scroll) {
    var d = document.getElementById(id + "-day" + n); if (!d) return false;
    d.open = true; foldRead(id);
    if (scroll) d.scrollIntoView({ block: "start" });
    return true;
  }
  function dayChips(h, fold) {
    if ((h.days || []).length < 5) return "";
    var t = todayDay(h);
    return '<nav class="day-chips" aria-label="Jump to a day">' + h.days.map(function (d, i) {
      return '<button class="day-chip" type="button" data-h="' + esc(h.id) + '" data-day="' + (i + 1) + '">Day ' + (i + 1) + (t === i + 1 ? ' · Today' : "") + '</button>';
    }).join("") + '</nav>';
  }
  // The first two sentences show; the rest folds under "Read more".
  function summaryText(t) {
    if (!t) return "";
    var parts = String(t).split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/);
    if (parts.length <= 2) return '<p>' + esc(t) + '</p>';
    return '<p>' + esc(parts.slice(0, 2).join(" ").trim()) + '</p><details class="fold more-text"><summary>Read more</summary><p>' + esc(parts.slice(2).join(" ").trim()) + '</p></details>';
  }
  // Check-in and check-out times, taken from the hotel's own words.
  function stayTimes(s) {
    var w = String(s.why || "") + " " + String((s.more || {}).tips || ""), a = w.match(/check-in (?:is )?(?:from )?(\d{1,2}:\d{2})/i), b = w.match(/check-out (?:is )?(?:by )?(\d{1,2}:\d{2})/i);
    return a || b ? (a ? "Check-in " + a[1] : "") + (a && b ? " · " : "") + (b ? "Check-out " + b[1] : "") : "";
  }
  // On the first night at a hotel, the day's headline shows its check-in time.
  function checkInFor(h, stays, i) {
    var d = h.days[i], prev = h.days[i - 1]; if (!d.sleep || (prev && prev.sleep === d.sleep)) return "";
    var key = d.sleep.split(",")[0].toLowerCase(), s = (stays || []).filter(function (x) { return String(x.name).toLowerCase().indexOf(key) === 0; })[0];
    var m = s && (String(s.why || "") + " " + String((s.more || {}).tips || "")).match(/check-in (?:is )?(?:from )?(\d{1,2}:\d{2})/i);
    return m ? m[1] : "";
  }
  function stills(list) { return list.filter(function (m) { return m.kind !== "video"; }).length; }
  function countWord(n, w) { return n + " " + w + (n === 1 ? "" : "s"); }
  function guessJourneys(list) {
    if (!(list || []).length) return "";
    return '<details class="fold guess"><summary><span aria-hidden="true">🚆</span> Journeys, our best guess from the photos</summary>' + journeyList(list) + '</details>';
  }
  function foldClick(e) {
    var c = e.target.closest && e.target.closest(".day-chip");
    if (c) { openDay(c.dataset.h, c.dataset.day, true); var cs = document.querySelector('details.day[data-h="' + c.dataset.h + '"][data-day="' + c.dataset.day + '"] > summary'); if (cs) cs.focus({ preventScroll: true }); return true; }
    var a = e.target.closest && e.target.closest(".days-all");
    if (a) {
      var ds = document.querySelectorAll('details.day[data-h="' + a.dataset.h + '"]'), open = a.textContent.indexOf("Open") === 0;
      ds.forEach(function (d) { d.open = open; }); foldRead(a.dataset.h); return true;
    }
    var x = e.target.closest && e.target.closest(".day-hide");
    if (x) {
      var day = x.closest("details.day"), sm = day && day.querySelector("summary");
      if (day) { day.open = false; foldRead(day.dataset.h); sm.focus({ preventScroll: true }); if (sm.getBoundingClientRect().top < 0) day.scrollIntoView({ block: "start" }); }
      return true;
    }
    var l = e.target.closest && e.target.closest(".left-photos");
    if (l) { var list = leftReg[+l.dataset.left] || [], m = list.filter(function (x) { return x.kind !== "video"; })[0]; if (m) openPhotoMem(m, l, list); return true; }
    var k = e.target.closest && e.target.closest(".keeper-open");
    if (k) { var kp = document.getElementById("keeper"); if (kp) { kp.open = true; kp.scrollIntoView({ block: "start" }); kp.querySelector("summary").focus({ preventScroll: true }); } return true; }
    return false;
  }

  // ---------- update a plan from a file ----------
  // Claude sends a new plan as a plain .json file. This box locks it with the passkey you unlocked with
  // and saves it as holidays/<id>.js, so the plan never sits unlocked on the website.
  var planDraft = null;
  function planBox(h) {
    if (!h.days || !h.days.length) return "";
    return '<details class="tipbox plan-box" data-h="' + esc(h.id) + '"><summary><span aria-hidden="true">✎</span> Update this plan from a file Claude made</summary>' +
      '<ol class="info-steps"><li><label for="plan-file-' + esc(h.id) + '">Pick the plan file (it ends in <code>.plan.json</code>)</label> <input type="file" class="plan-file" id="plan-file-' + esc(h.id) + '" accept=".json,application/json"></li>' +
      '<li><button class="btn small plan-save" type="button" disabled>Lock it and save</button> Save it in the website\'s <code>holidays</code> folder, replacing <code>' + esc(h.id) + '.js</code>.</li></ol>' +
      '<p class="tag plan-msg" role="status" aria-live="polite"></p></details>';
  }
  function planPick(input) {
    var box = input.closest(".plan-box"), msg = box.querySelector(".plan-msg"), btn = box.querySelector(".plan-save"), id = box.dataset.h;
    planDraft = null; btn.disabled = true;
    var f = input.files && input.files[0]; if (!f) return;
    f.text().then(function (t) {
      var h = JSON.parse(t);
      if (!h || h.id !== id || !Array.isArray(h.days) || !h.days.length) throw new Error("This file is for a different trip, or it is not a plan file.");
      var stops = 0; h.days.forEach(function (d) { stops += (d.places || []).length; });
      planDraft = h; btn.disabled = false;
      msg.textContent = "Ready: " + h.title + ", " + niceShort(h.start) + " to " + niceShort(h.end) + ", " + h.days.length + " days, " + stops + " stops, " + (h.stays || []).length + " hotels. Press Lock it and save.";
    }).catch(function (e) { msg.textContent = "That file can't be used. " + (e && e.message && !/JSON/.test(e.message) ? e.message : "It is not a plan file from Claude."); });
  }
  function planSave(btn) {
    var box = btn.closest(".plan-box"), msg = box.querySelector(".plan-msg"), h = planDraft;
    if (!h || !unlockedKey) { msg.textContent = "Lock the album and open it again with the passkey, then try again."; return; }
    btn.disabled = true; msg.textContent = "Locking…";
    lockHoliday(h, unlockedKey).then(function (lockedBox) {
      var text = "/* Locked holiday file. Open the album and enter the passkey to see it. */\nHolidayAlbum.addLocked(" + JSON.stringify(lockedBox) + ");\n", name = h.id + ".js";
      var done = function (how) {
        msg.textContent = how + " Then tell Claude \"plan saved\".";
        holidays = holidays.filter(function (x) { return x.id !== h.id; }); HolidayAlbum.add(h); var keep = msg.textContent; keepPlace(render); var m2 = document.querySelector(".plan-box .plan-msg"); if (m2) { m2.textContent = keep; m2.closest("details.plan-box").open = true; var kp = document.getElementById("keeper"); if (kp) kp.open = true; }
      };
      if (window.showDirectoryPicker) {
        return window.showDirectoryPicker({ id: "holidays", mode: "readwrite" }).then(function (dir) {
          return dir.getFileHandle(name, { create: true }).then(function (fh) { return fh.createWritable(); }).then(function (w) { return w.write(text).then(function () { return w.close(); }); });
        }).then(function () { done("Saved " + name + " in the folder you picked."); }, function (e) {
          if (e && e.name === "AbortError") { btn.disabled = false; msg.textContent = "Nothing saved. Press Lock it and save again and pick the holidays folder."; return; }
          giveFile(name, text); done("Downloaded " + name + ". Move it into the holidays folder, replacing the old one.");
        });
      }
      giveFile(name, text); done("Downloaded " + name + ". Move it into the holidays folder, replacing the old one.");
    }).catch(function () { btn.disabled = false; msg.textContent = "Locking didn't work. Try again."; });
  }

  // ---------- small and full photo files ----------
  // A trip saves its photos twice: small previews (<id>.thumbs-N.js, about 4 MB each) and full photos
  // (<id>.full-N.js, about 8 MB each). The main file keeps only where each photo belongs, so opening a trip
  // downloads the previews a day at a time, and a full photo only when it is opened.
  var v2Parts = [], v2Done = {}, v2Chain = Promise.resolve(), v2Wait = {};
  function partName(id, n) { return n.indexOf(id + ".") === 0 && /\.(photos|thumbs|full)-\d+\.js$/.test(n.slice(id.length)); }
  function planV2(hol, id) {
    var TH = 4 * 1048576, FU = 8 * 1048576, thumbs = [], full = [], ts = TH, fs = FU, sizes = {};
    var put = function (list, cap, used, key, val) {
      if (used + val.length > cap || !list.length) { list.push({}); used = 0; }
      list[list.length - 1][key] = val; return used + val.length;
    };
    var index = hol.memories.map(function (m, k) {
      var e = {};
      Object.keys(m).forEach(function (x) { if (!/^(image|thumb|clip|label|k|tp|fp|hasClip)$/.test(x) && x[0] !== "_") e[x] = m[x]; });
      e.k = k;
      var t = m.thumb || (m.kind === "video" ? m.image : "") || "";
      if (t || m.clip) {
        if (t) { ts = put(thumbs, TH, ts, k, t); e.tp = thumbs.length; }
        if (m.clip) { ts = put(thumbs, TH, ts, "c" + k, m.clip); e.tp = thumbs.length; e.hasClip = 1; }
      }
      if (m.image && m.kind !== "video") { fs = put(full, FU, fs, k, m.image); e.fp = full.length; }
      return e;
    });
    var main = Object.assign({}, hol, { memories: index, v2: { thumbs: thumbs.length, full: full.length } });
    delete main.photoParts; delete main._visits; delete main._info; delete main._byK;
    var names = [id + ".js"], bodies = [main];
    thumbs.forEach(function (items, i) { names.push(id + ".thumbs-" + (i + 1) + ".js"); bodies.push({ partOf: id, kind: "thumbs", part: i + 1, items: items }); });
    full.forEach(function (items, i) { names.push(id + ".full-" + (i + 1) + ".js"); bodies.push({ partOf: id, kind: "full", part: i + 1, items: items }); });
    var len = function (o) { return Object.keys(o).reduce(function (n, k) { return n + String(o[k]).length + 12; }, 0); };
    sizes[names[0]] = Math.round((JSON.stringify(index).length + (hol.cover && hol.cover.image ? hol.cover.image.length : 0) + 4000) * 1.37);
    bodies.forEach(function (b, i) { if (i) sizes[names[i]] = Math.round(len(b.items) * 1.37); });
    return { hol: hol, id: id, names: names, bodies: bodies, sizes: sizes };
  }
  function byK(h) {
    if (!h._byK) { h._byK = {}; h.memories.forEach(function (m) { if (m.k != null) h._byK[m.k] = m; }); }
    return h._byK;
  }
  function applyV2() {
    v2Parts.splice(0).forEach(function (part) {
      var h = holidays.filter(function (x) { return x.id === part.partOf; })[0];
      if (!h) return;
      var map = byK(h);
      Object.keys(part.items || {}).forEach(function (key) {
        var clip = key[0] === "c", m = map[clip ? key.slice(1) : key], val = part.items[key];
        if (!m) return;
        if (clip) m.clip = val;
        else if (part.kind === "thumbs") { if (m.kind === "video") m.image = val; else m.thumb = val; }
        else m.image = val;
      });
      v2Done[part.partOf + "." + part.kind + "-" + part.part + ".js"] = true;
      document.querySelectorAll('img[data-vk^="' + part.partOf + ':"]').forEach(function (img) {
        var m = map[img.getAttribute("data-vk").split(":")[1]];
        if (m && (m.thumb || m.image)) { img.src = m.thumb || m.image; img.removeAttribute("data-vk"); }
      });
    });
  }
  // One file at a time, so each file's photos are in place before the next starts.
  function loadV2(name) {
    if (v2Done[name]) return Promise.resolve(true);
    if (v2Wait[name]) return v2Wait[name];
    window.HOLIDAY_LATER = (window.HOLIDAY_LATER || []).filter(function (x) { return x !== name; });
    return (v2Wait[name] = v2Chain = v2Chain.then(function () {
      return loadScript(name).then(function (ok) {
        if (!ok) { delete v2Wait[name]; return false; }
        var boxes = locked.splice(0);
        return Promise.all(boxes.map(function (box) { return openBox(box, unlockedKey).then(HolidayAlbum.add, function () { }); }))
          .then(function () { applyV2(); v2Done[name] = true; return true; });
      });
    }));
  }
  // The files a list of photos still needs, loaded; or null when nothing is missing.
  function v2Need(list, kind) {
    var want = {};
    list.forEach(function (m) {
      var h = m._h; if (!h) return;
      if (kind === "thumbs" && m.tp && !(m.kind === "video" ? m.image && (!m.hasClip || m.clip) : m.thumb)) want[h + ".thumbs-" + m.tp + ".js"] = 1;
      if (kind === "full" && m.fp && !m.image) want[h + ".full-" + m.fp + ".js"] = 1;
    });
    var names = Object.keys(want).filter(function (n) { return !v2Done[n]; });
    return names.length ? Promise.all(names.map(loadV2)) : null;
  }
  function v2Ready(h) {
    if (!h || !h.v2) return true;
    for (var i = 1; i <= h.v2.thumbs; i++) if (!v2Done[h.id + ".thumbs-" + i + ".js"]) return false;
    for (var j = 1; j <= h.v2.full; j++) if (!v2Done[h.id + ".full-" + j + ".js"]) return false;
    return true;
  }
  function loadAllV2(h, onStep) {
    var names = [], n = 0;
    for (var i = 1; i <= h.v2.thumbs; i++) names.push(h.id + ".thumbs-" + i + ".js");
    for (var j = 1; j <= h.v2.full; j++) names.push(h.id + ".full-" + j + ".js");
    return Promise.all(names.map(function (x) { return loadV2(x).then(function (ok) { n++; if (onStep) onStep(n, names.length); return ok; }); }))
      .then(function (oks) { return oks.every(Boolean); });
  }
  function tagV2() { holidays.forEach(function (h) { if (h.v2) h.memories.forEach(function (m) { m._h = h.id; }); }); }

  // "Make this trip quicker to open": an older trip (one big photo per memory) is saved again as previews and full photos.
  function quickBox(h) {
    if (h.v2 || !(h.memories || []).some(function (m) { return m.image; })) return "";
    return '<div class="tipbox quick-box" data-h="' + esc(h.id) + '"><h4><span aria-hidden="true">⚡</span> Make this trip quicker to open</h4>' +
      '<p>Right now a phone downloads every full-size photo of this trip before showing it. Saving it again in the new way splits each photo into a small preview and the full photo, so the trip opens fast and a full photo downloads only when it is tapped.</p>' +
      '<div class="row"><button class="btn primary quick-go" type="button">Make it quicker</button>' + (window.showDirectoryPicker ? '<span class="tag">You choose the website\'s holidays folder, and the new files are saved straight into it.</span>' : '<span class="tag">The new files download one by one.</span>') + '</div>' +
      '<div class="bar-track" id="v2-bar" role="progressbar" aria-label="Making the new files" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" hidden><span></span></div>' +
      '<p class="tag quick-msg" role="status" aria-live="polite"></p></div>';
  }
  function smallCopy(src) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        var sc = Math.min(1, 320 / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(img.naturalWidth * sc)); c.height = Math.max(1, Math.round(img.naturalHeight * sc));
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        var out = c.toDataURL("image/jpeg", 0.6); c.width = c.height = 0; resolve(out);
      };
      img.onerror = function () { resolve(""); };
      img.src = src;
    });
  }
  function quickGo(b) {
    var box = b.closest(".quick-box"), h = holidays.filter(function (x) { return x.id === box.dataset.h; })[0], msg = box.querySelector(".quick-msg");
    if (!h) return;
    var bar = box.querySelector("#v2-bar"), setBar = function (pc) { bar.hidden = false; bar.setAttribute("aria-valuenow", pc); bar.firstChild.style.width = pc + "%"; };
    var pick = window.showDirectoryPicker ? window.showDirectoryPicker({ mode: "readwrite", id: "holidays" }) : Promise.resolve(null);
    b.disabled = true;
    pick.then(function (dir) {
      msg.textContent = "Loading all of this trip's photos…";
      return (laterFor(h.id).length || partsBusy[h.id] ? loadParts(h.id) : Promise.resolve()).then(function () {
        mergeParts();
        if ((partsFailed[h.id] || []).length) throw new Error("A photos file didn't load (" + partsFailed[h.id].join(", ") + "). Reload the page and try again.");
        var todo = h.memories.filter(function (m) { return m.image && !m.thumb && m.kind !== "video"; }), done = 0;
        return todo.reduce(function (chain, m) {
          return chain.then(function () {
            return smallCopy(m.image).then(function (t) {
              if (t) m.thumb = t; done++;
              if (done % 20 === 0 || done === todo.length) { msg.textContent = "Making small previews: " + done + " of " + todo.length + "…"; setBar(Math.round(done / todo.length * 50)); }
            });
          });
        }, Promise.resolve()).then(function () {
          var before = h.memories.length, photos = h.memories.filter(function (m) { return m.image; }).length;
          var copy = Object.assign({}, h, { memories: h.memories.slice() });
          var plan = planV2(copy, h.id), placed = 0;
          plan.bodies.forEach(function (bd) { if (bd.kind === "full") placed += Object.keys(bd.items).length; });
          if (plan.bodies[0].memories.length !== before || placed !== h.memories.filter(function (m) { return m.image && m.kind !== "video"; }).length) throw new Error("The new files didn't hold every photo, so nothing was saved.");
          rb.plan = plan; rb.built = null;
          return lockFiles(msg).then(function (files) {
            var byName = {}; files.forEach(function (f) { byName[f.name] = f; });
            var order = uploadOrder(plan.names).map(function (n) { return byName[n]; });
            var list = { name: "list.js", text: listJs(plan) };
            var old = (window.HOLIDAY_FILES || []).filter(function (n) { return partName(h.id, n) && plan.names.indexOf(n) < 0; });
            var end = function (where) {
              msg.textContent = "Done: " + photos + " photos in " + order.length + " new files" + where + "." + (old.length ? " Next, delete the old files " + old.join(", ") + " from the holidays folder." : "") + " Then upload the folder, or ask Claude to do it.";
              say("Done.");
            };
            if (dir) {
              return order.concat([list]).reduce(function (chain, f, i) {
                return chain.then(function () {
                  msg.textContent = "Saving file " + (i + 1) + " of " + (order.length + 1) + " into " + dir.name + "…";
                  return dir.getFileHandle(f.name, { create: true }).then(function (fh) { return fh.createWritable(); }).then(function (w) { return w.write(f.text).then(function () { return w.close(); }); });
                });
              }, Promise.resolve()).then(function () { end(" (and list.js) in the folder " + dir.name); });
            }
            order.concat([list]).forEach(function (f, i) { setTimeout(function () { giveFile(f.name, f.text); if (i === order.length) end(" (and list.js) in your Downloads folder"); }, i * 1500); });
          });
        });
      });
    }).catch(function (e) {
      b.disabled = false;
      msg.textContent = e && e.name === "AbortError" ? "No folder chosen, so nothing was saved." : e && e.message && !/^Failed|lock/i.test(e.message) ? e.message : "This browser could not make the files. Open the album from the website (https) on a computer and try again.";
    });
  }

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
    var id = (location.hash || "#home").slice(1), dm = id.match(/^(.*)-day(\d+)$/), dayN = 0;
    if (dm && holidays.some(function (x) { return x.id === dm[1]; })) {
      if (document.getElementById(id) && document.querySelector('details.day[data-h="' + dm[1] + '"]')) { openDay(dm[1], dm[2], true); return; }
      id = dm[1]; dayN = +dm[2];
      var f0 = foldGet(holidays.filter(function (x) { return x.id === id; })[0]); if (f0.days.indexOf(dayN) < 0) f0.days.push(dayN);
    }
    closeYt(false);
    memReg = []; gridReg = []; leftReg = [];
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
    mergeParts(); applyV2(); tagV2(); mergeInfo();
    var root = document.getElementById("app");
    var h = holidays.filter(function (x) { return x.id === id; })[0];
    moreList = [];
    if (id === "rebuild") { root.innerHTML = rebuildView(); wireRebuild(root); }
    else if (h) {
      root.innerHTML = holidayView(h);
      var pn = partsNotice(h.id), cov = root.querySelector("section.cover");
      if (pn && cov) cov.insertAdjacentHTML("afterend", pn);
    }
    else root.innerHTML = homeView();
    if (badFiles && id === "home") { var mainEl = root.querySelector("main"); if (mainEl) mainEl.insertAdjacentHTML("afterbegin", '<div class="notice" role="alert" style="margin-top:18px">' + (badFiles === 1 ? "One holiday file" : badFiles + " holiday files") + ' couldn\'t be opened, so that trip is missing. The file may be damaged or only half uploaded.</div>'); }
    wireMore(root);
    wireGrids(root);
    var lockBtn = root.querySelector('[data-action="lock"]');
    if (lockBtn) lockBtn.addEventListener("click", function () { HolidayAlbum.lock(); });
    wirePics(root);
    if (dayN) { var dEl = document.getElementById(id + "-day" + dayN); if (dEl) dEl.scrollIntoView({ block: "start" }); }
    else window.scrollTo(0, 0);
    document.title = (h ? h.title + " · " : id === "rebuild" ? "Add your photos · " : "") + "Family Holiday Album";
  }

  window.HolidayAlbum = {
    add: function (h) {
      if (h.partOf && h.kind) { v2Parts.push(h); return; }
      if (h.partOf) { photoParts.push(h); return; }
      if (h.infoFor) { infoPacks.push(h); return; }
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
