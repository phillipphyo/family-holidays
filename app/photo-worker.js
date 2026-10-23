/* Reads one photo at a time off the main page, so the page stays responsive:
   date and place from the photo's hidden data, then a smaller copy and a preview.
   Redrawing the picture leaves the hidden data (exact GPS, phone model) behind. */
importScripts("exifr.full.umd.js");

var PICK = ["DateTimeOriginal", "CreateDate", "ModifyDate", "GPSLatitude", "GPSLongitude", "GPSLatitudeRef", "GPSLongitudeRef", "latitude", "longitude"];

function toDataUrl(blob) {
  return new FileReaderSync().readAsDataURL(blob);
}
function draw(bitmap, max, q, out) {
  var k = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  var c = new OffscreenCanvas(Math.round(bitmap.width * k), Math.round(bitmap.height * k)), g = c.getContext("2d");
  g.drawImage(bitmap, 0, 0, c.width, c.height);
  if (out) { var f = looks(g.getImageData(0, 0, c.width, c.height)); out.sharp = f.sharp; out.hash = f.hash; }
  return c.convertToBlob({ type: "image/jpeg", quality: q }).then(toDataUrl);
}
/* Same as looks() in album.js: how sharp the picture is, and a tiny fingerprint of how it looks
   (64 brighter/darker steps) so repeats and near-same shots can be found. */
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

self.onmessage = function (e) {
  var job = e.data, file = job.file, out = { id: job.id };
  self.exifr.parse(file, { gps: true, tiff: true, exif: true, pick: PICK }).catch(function () { return null; }).then(function (tags) {
    var dt = tags && (tags.DateTimeOriginal || tags.CreateDate || tags.ModifyDate);
    if (dt instanceof Date && !isNaN(dt)) out.dt = dt.getTime();
    if (tags && typeof tags.latitude === "number" && typeof tags.longitude === "number") { out.lat = tags.latitude; out.lon = tags.longitude; }
    if (job.heic) return null;
    return createImageBitmap(file).then(function (bmp) {
      return draw(bmp, job.max, job.q).then(function (data) {
        out.data = data;
        return draw(bmp, 240, 0.7, out);
      }).then(function (thumb) { out.thumb = thumb; bmp.close(); });
    });
  }).catch(function () { /* the browser could not open this picture */ }).then(function () {
    self.postMessage(out);
  });
};
