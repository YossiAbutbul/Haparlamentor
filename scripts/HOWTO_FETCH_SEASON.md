# Fetch shorts metadata for a new season

Mako blocks server-side fetches (Radware bot shield). Steps below run entirely in a logged-in browser.

## 1. Find the Next.js build ID

Open any page on `mako.co.il/mako-vod-keshet/...` in browser. View source (Ctrl+U). Search for:

```
/mako-vod/_next/static/<BUILD_ID>/_buildManifest.js
```

Copy `<BUILD_ID>` (e.g. `7.11.0`).

## 2. Construct the season's shorts JSON URL

Pattern:

```
https://www.mako.co.il/mako-vod/_next/data/<BUILD_ID>/<channel-path>/shorts.json
```

Examples:

- s1: `https://www.mako.co.il/mako-vod/_next/data/7.11.0/mako-vod-keshet/parliament-s1/shorts.json`
- s2: `https://www.mako.co.il/mako-vod/_next/data/7.11.0/mako-vod-keshet/parliament-s2/shorts.json`
- s0: `https://www.mako.co.il/mako-vod/_next/data/7.11.0/mako-vod-keshet/parliament-s0/shorts.json`

Open the URL in a normal browser tab.

## 3. Save the JSON

Browser shows raw JSON. Right-click → Save As → `shorts-s<N>.json`. Drop into `~/Downloads/` or anywhere local.

If the page renders the season landing instead of JSON, the build ID changed — refetch step 1.

## 4. Hand it to Claude / next session

Reference the saved file (full path) and ask Claude to:

1. Extract clean shorts metadata
2. Save to `data/s<N>/shorts.json` with shape `[{ vcmId, title, url, duration }]`
3. Create empty `data/s<N>/transcripts/` directory
4. Run `python scripts/build_db.py` to refresh `public/data/db.json`

The exact `jq` command used for s1:

```bash
jq '[.. | objects
     | select(.pageUrl // "" | test("shorts/Video-"))
     | {vcmId: (.itemVcmId // ""),
        title: (.title // ""),
        url:   ("https://www.mako.co.il" + .pageUrl),
        duration: (.duration // "")}]
    | unique_by(.url)' shorts-sN.json > data/sN/shorts.json
```

## 5. Transcribe

For each short, download MP3 manually → drop in `scripts/audio/<anything>.mp3` → run:

```
python scripts/transcribe.py <vcmId> scripts/audio/<file>.mp3
```

Then:

```
python scripts/build_db.py
```

App auto-reloads.
