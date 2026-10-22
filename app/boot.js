// Load every holiday file named in holidays/list.js, then draw the page.
(function () {
  var files = window.HOLIDAY_FILES || [];
  var left = files.length;
  if (!left) return HolidayAlbum.start();
  files.forEach(function (name) {
    if (!/^[\w.-]+\.js$/.test(name)) { if (--left === 0) HolidayAlbum.start(); return; }
    var s = document.createElement("script");
    s.src = "holidays/" + name;
    s.onload = s.onerror = function () { if (--left === 0) HolidayAlbum.start(); };
    document.body.appendChild(s);
  });
})();
