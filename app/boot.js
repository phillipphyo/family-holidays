// Load every holiday file named in holidays/list.js, then draw the page.
// Extra photo files (name.photos-2.js and on) are big, so they wait until that holiday is opened.
(function () {
  // Closed holidays (holidays/list.js) are skipped unless the album keeper opened them on this device.
  var hash = location.hash;
  try {
    if (hash === "#show-closed") localStorage.setItem("album-show-closed", "1");
    if (hash === "#hide-closed") localStorage.removeItem("album-show-closed");
    var showClosed = localStorage.getItem("album-show-closed") === "1";
  } catch (e) { showClosed = false; }
  if (hash === "#show-closed" || hash === "#hide-closed") history.replaceState(null, "", "#home");
  window.HOLIDAY_SKIPPED = showClosed ? [] : (window.HOLIDAY_CLOSED || []).filter(function (c) { return c && c.id; });
  var files = (window.HOLIDAY_FILES || []).filter(function (name) {
    return /^[\w.-]+\.js$/.test(name) && !window.HOLIDAY_SKIPPED.some(function (c) { return name.indexOf(c.id + ".") === 0; });
  });
  window.HOLIDAY_LATER = files.filter(function (name) { return /\.(photos|thumbs|full)-\d+\.js$/.test(name); });
  files = files.filter(function (name) { return !/\.(photos|thumbs|full)-\d+\.js$/.test(name); });
  var left = files.length;
  if (!left) return HolidayAlbum.start();
  files.forEach(function (name) {
    var s = document.createElement("script");
    s.src = "holidays/" + name;
    s.onload = s.onerror = function () { if (--left === 0) HolidayAlbum.start(); };
    document.body.appendChild(s);
  });
})();
