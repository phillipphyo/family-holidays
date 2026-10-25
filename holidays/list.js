/*
  The list of holiday files the album shows, newest first.
  To add a holiday: put its file in this folder and add its name here.
*/
window.HOLIDAY_FILES = [
  "japan-2026.js",
  "europe-2022.js",
  "europe-2022.photos-2.js",
  "europe-2022.photos-3.js",
  "europe-2022.photos-4.js",
  "europe-2022.photos-5.js",
  "europe-2022.photos-6.js",
  "europe-2022.photos-7.js",
  "europe-2022.photos-8.js",
  "europe-2022.photos-9.js",
  "europe-2022.info.js"
];

/*
  Holidays closed for now: their files stay here but are not downloaded, and the home page shows a closed card.
  The album keeper can open them on one device by visiting the page with #show-closed (and #hide-closed to close again).
*/
window.HOLIDAY_CLOSED = [
  { id: "europe-2022", title: "Europe trip 2022", why: "Its full-size photos are very large (about 340 MB), so it doesn't open here for now." }
];
