# Darts Rank Counter

Darts Rank Counter is a responsive, client-side tournament rating calculator
for the Ukrainian darts community. Its visual system and project structure are
aligned with the companion [Randomizer](https://saprik13.github.io/randomizer/)
project.

## Features

- Double Elimination scoring for tournaments with 7–12+ players
- Multiple-group and playoff scoring for tournaments with 3–12+ players
- Single-group scoring for tournaments with up to 7 players
- Manual player entry or import from Google Sheets, tab-separated data, or plain text
- Ukrainian and English interfaces
- Automatic rating recalculation and ranking
- CSV, Excel, and clipboard-ready result export
- Responsive layouts for phones, tablets, and desktop screens
- Fully client-side processing with no data uploads

## How to use

1. Select the tournament format and number of players.
2. Add players manually or paste names and ratings from Google Sheets or a text document.
3. Import the list and assign each player a finishing place.
4. Calculate the updated rating.
5. Export the result as CSV or copy it to the clipboard.

## Run locally

Serve the repository root with any static HTTP server. For example:

```powershell
npx --yes http-server . -p 8000
```

Then open `http://localhost:8000/`.

## Project structure

```text
css/             Shared and responsive styles
images/logo.svg  Randomizer-style dartboard mark and favicon
js/app.js        Rating logic, rendering, import, export, and localization
index.html       Application markup
```

## Validation

Run the JavaScript syntax check:

```powershell
npm test
```

The responsive interface is manually verified at common phone widths, as well
as tablet and desktop viewport sizes.

## Privacy

All player data is processed in the browser. The application does not send
names, ratings, or tournament results to a server.
