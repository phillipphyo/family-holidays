/* Reads one photo at a time off the main page, so the page stays responsive:
   date and place from the photo's hidden data, then a smaller copy and a preview.
   Redrawing the picture leaves the hidden data (exact GPS, phone model) behind. */
importScripts("exifr.full.umd.js");

var PICK = ["DateTimeOriginal", "CreateDate", "ModifyDate", "GPSLatitude", "GPSLongitude", "GPSLatitudeRef", "GPSLongitudeRef", "latitude", "longitude"];

function toDataUrl(blob) {
  return new FileReaderSync().readAsDataURL(blob);
}
function draw(bitmap, max, q) {
  var k = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  var c = new OffscreenCanvas(Math.round(bitmap.width * k), Math.round(bitmap.height * k));
  c.getContext("2d").drawImage(bitmap, 0, 0, c.width, c.height);
  return c.convertToBlob({ type: "image/jpeg", quality: q }).then(toDataUrl);
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
        return draw(bmp, 240, 0.7);
      }).then(function (thumb) { out.thumb = thumb; bmp.close(); });
    });
  }).catch(function () { /* the browser could not open this picture */ }).then(function () {
    self.postMessage(out);
  });
};
