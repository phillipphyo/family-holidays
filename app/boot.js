// Load every holiday file named in holidays/list.js, then draw the page.
// Extra photo files (name.photos-2.js and on) are big, so they wait until that holiday is opened.
(function () {
  var files = (window.HOLIDAY_FILES || []).filter(function (name) { return /^[\w.-]+\.js$/.test(name); });
  window.HOLIDAY_LATER = files.filter(function (name) { return /\.photos-\d+\.js$/.test(name); });
  files = files.filter(function (name) { return !/\.photos-\d+\.js$/.test(name); });
  var left = files.length;
  if (!left) return HolidayAlbum.start();
  files.forEach(function (name) {
    var s = document.createElement("script");
    s.src = "holidays/" + name;
    s.onload = s.onerror = function () { if (--left === 0) HolidayAlbum.start(); };
    document.body.appendChild(s);
  });
})();
