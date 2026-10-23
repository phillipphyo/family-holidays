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

## Adding your photos (five steps)

Open the website and press **Add your photos**. The page walks through five steps, with Back and Next at the bottom. Nothing is lost when you go back.

1. **Choose photos.** Say what they are for, then choose the photos (or drop them in the box). They stay on your computer until you save. For a past trip, the name is filled in from the main city and year, and you can change it.
2. **Check days and places.** Each day is one line, for example "Day 3 · Sat 12 Jul · Paris · 5 stops · 148 photos". Open a day to name its stops. Tap a name idea, press **Needs a name** to see only the stops with no name, or **Look up place names online** (it sends only the rough spot, to about 100 metres, to OpenStreetMap). × leaves a photo out and ↻ turns it. Undo appears for a few seconds after each change.
3. **Tidy up.** Each photo set aside is shown next to the one we kept, with the reason. Tick "Keep this one too", or "Keep all of these".
4. **Videos** (only when there are videos). Keep a 20-second clip, or paste YouTube links.
5. **Save.** Check the summary and the cover, then press **Save my holiday**. The files are listed in upload order: photo files first, the main file last. Under **More options** there is a new `list.js` that keeps the other trips in order. Every save also stays in GitHub's history, so save a big trip once rather than many times.

Thousands of photos are fine. The page reads them a few at a time and shows how far along it is, with a Stop button that keeps the photos read so far. A big holiday is saved as a few files (for example `europe-2022.js`, `europe-2022.photos-2.js`), each well under GitHub's 100 MB limit. Put all of them in `holidays/` and list all of them in `holidays/list.js`. The album loads the extra photo files only when that holiday is opened, so the home page stays quick.

At the top, say what the photos are for. **A trip already in the album** matches each photo to the stop planned for that day (for example Fushimi Inari on Day 2). **A past trip with no plan** builds the days, stops and route from where and when each photo was taken.

### Tidy-up

After reading, the page sets aside blurry photos, repeats (the same photo added twice, or a copy), and bursts of nearly the same shot taken within two minutes, keeping the sharpest. Nothing is deleted. Open **Look at the photos set aside** and tick **Keep** on any you want back, or turn tidy-up off.

### Videos

- Every video (MP4 or MOV) gets a still picture in its day and stop.
- Tick **Keep a 20-second clip** on your favourites. The clip is made when you save and plays inside the album.
- Optional: put the full videos on YouTube as **Unlisted** (YouTube app or studio.youtube.com), then paste each link under its video, or paste them all at once in **Paste all your YouTube links**. Tapping the still in the album then plays the full video. Private videos will not play in the album.

Good to know:

- Photos straight from a phone or camera keep their date and place. Photos sent through WhatsApp, or saved from Facebook or Instagram, usually lose both. Use the originals.
- iPhone HEIC photos are read for date and place, but most browsers can't show them. Change them to JPG first if you want to see them in the album (on iPhone: Settings, Camera, Formats, Most Compatible).
- The album shows each photo's place only to about 100 metres, inside the locked file.

## Pictures

Each stop shows a photo from Wikimedia Commons or Wikipedia, labelled with who took it and its licence. The photos are saved inside the locked holiday file.

## Security

- Holiday files are encrypted (AES-GCM, key made from the passkey with PBKDF2-SHA256, 600,000 rounds).
- The page only runs its own scripts (a Content Security Policy blocks everything else), opens outside links without passing on where you came from, and asks search engines not to list it (`robots.txt` and a no-index tag).
- The only outside site the album may show inside the page is youtube-nocookie.com, and only after you tap play on a video. Google then sees the viewer's internet address and which video was played.
- YouTube videos are kept by YouTube, not the album. The passkey hides the links, but anyone given an Unlisted link can watch it. YouTube also keeps the original file, with where and when it was filmed. Deleting a video on YouTube breaks the full video, not the still or the clip.
- "Remember on this device" keeps the passkey in that browser until you press Lock. Use it only on your own devices.

The photo reader is [exifr](https://github.com/MikeKovarik/exifr) (MIT licence), saved in `app/`.
