# Our Holiday Album

A family website for our holidays: the trips we are planning, and the memories of the ones we've already been on. Each holiday has its own page. It shows a cover picture, the route, where we stay and why, a day-by-day plan with a picture of every stop, and buttons that open photos, videos and a Google Maps pin for that place.

Live website (once GitHub Pages is on): https://phillipphyo.github.io/family-holidays/

## What is in the folder

| Folder or file | What it holds |
| --- | --- |
| `index.html` | The website. Open it in any web browser. |
| `holidays/` | One file per holiday, for example `japan-2026.js`. |
| `holidays/list.js` | The list of holiday files the album shows. |
| `images/` | Other pictures, such as the trip overview map. |
| `app/` | The parts that draw the website. You don't need to change these. |

## The passkey

The album opens with a passkey box. Each holiday file is locked (encrypted) with the passkey, so anyone who opens the files on GitHub sees only scrambled text. The passkey is not written anywhere in the website.

Our own photos are kept inside the locked holiday files too, with the hidden phone data (exact GPS place, phone model) removed. What the lock does not cover: the website's design files, and the fact that this album exists. Anyone can see those.

Use a long passkey. The lock is only as strong as the passkey: someone with a copy of the files can try guesses on their own computer as fast as it allows, and the album makes each guess slow on purpose (600,000 rounds), but a short or common passkey can still be guessed.

To change the passkey, ask Claude to lock the holiday files again with the new one. Everyone then uses the new passkey.

## Adding a holiday we are planning

Ask Claude: "add our Bali trip to the holiday album" and paste the plan. Claude writes the holiday file, locks it with the passkey and adds it to `holidays/list.js`.

The plain (unlocked) copies of the holiday files are kept outside this repository, in the project folder `holiday-album/source/`, so they never become public.

## Rebuilding a past holiday from photos

1. Open the website and press **Rebuild from photos**.
2. Choose the photos (or drop them into the box). They stay on your computer. Nothing is uploaded.
3. The page reads the date and place saved in each photo, puts the photos into days, and suggests a place name for each group. Press **Look up place names online** for street-level names from OpenStreetMap.
4. Fix any names, add a note, then press **Save holiday file** and follow the steps on the page. The file holds the photos too, already locked with the passkey.

To add photos to a holiday that is already in the album (for example after the Japan trip), choose "Add to: Japan in autumn" at the top.

Good to know:

- Photos straight from a phone or camera keep their date and place. Photos sent through WhatsApp, or saved from Facebook or Instagram, usually lose both. Use the originals.
- iPhone HEIC photos are read for date and place, but most browsers can't show them. Change them to JPG first if you want to see them in the album (on iPhone: Settings, Camera, Formats, Most Compatible).
- The album shows each photo's place only to about 100 metres, inside the locked file.

## Pictures

Each stop shows a photo from Wikimedia Commons or Wikipedia, labelled with who took it and its licence. The photos are saved inside the locked holiday file.

## Security

- Holiday files are encrypted (AES-GCM, key made from the passkey with PBKDF2-SHA256, 600,000 rounds).
- The page only runs its own scripts (a Content Security Policy blocks everything else), opens outside links without passing on where you came from, and asks search engines not to list it (`robots.txt` and a no-index tag).
- "Remember on this device" keeps the passkey in that browser until you press Lock. Use it only on your own devices.

The photo reader is [exifr](https://github.com/MikeKovarik/exifr) (MIT licence), saved in `app/`.
