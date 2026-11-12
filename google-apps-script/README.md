# Google Sheets sync

`Code.gs` is a small Apps Script web app bound to the rating spreadsheet. The site
uses it to read player totals and to write a finished tournament into the sheet.
No server and no Google Cloud project are needed.

## Sheet layout it expects

| Row / column | Content |
| --- | --- |
| Row 4 | Header row: `№`, `Прізвище, імʼя`, `Total`, then one date per tournament (`10.09`, `17.09`, …) |
| Column A | Running number |
| Column B | Player name |
| Column C | Total, `=SUM(...)` over the tournament columns |
| Column D → | Points per tournament, newest on the right |

These positions are set in `CONFIG` at the top of `Code.gs` (`SHEET_GID`,
`HEADER_ROW`, `NAME_COL`, `TOTAL_COL`, `FIRST_TOURNAMENT_COL`).

## Nicknames

The script keeps an extra sheet **Ніки** (created on first save): column A is the name as
typed in n01darts (`Чубатий`), column B the player's name in the rating sheet
(`Матвійчук Олександр`). The site adds a row whenever you match an n01 name to a sheet
player, so each nickname is asked about only once. You can edit the sheet by hand.

## What saving a tournament does

1. Picks the column for the tournament, always right after the last filled tournament
   (a `dd.MM` header with points), ignoring whatever lies further right:
   - a header that already has the tournament date and no points (for example a pre-filled `22.10`);
   - otherwise the next column, if it is blank, `Стовпець N`, or a date without points (zeros count as empty);
   - otherwise a new column is inserted right after the last tournament, so tables and `SUM` ranges grow with it.
2. Writes the date (`dd.MM`) into the header and stores the tournament id, type and
   coefficient as a note on that header cell. The same tournament cannot be saved twice.
3. Writes each player's points into that column. A player missing from the sheet is
   added below the last player with the next number, and the `Total` formula is copied
   from the row above.
4. Sorts the player rows by `Total`, highest first (ties by name), and renumbers column A
   when it holds plain numbers (not formulas).
5. Checks that `Total` grew by the saved points. If the `SUM` range does not cover the
   new column, the site shows a warning with the affected players.

## Setup (once)

1. Open the spreadsheet → **Extensions → Apps Script**.
2. Replace the contents of `Code.gs` with this repository's `google-apps-script/Code.gs` and save.
3. **Project Settings → Script properties → Add property**: `WRITE_TOKEN` = any long secret phrase.
   Only people who know it can save results.
4. **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**

   Authorise the script when Google asks, then copy the **Web app URL** (`https://script.google.com/macros/s/…/exec`).
5. On the site, open **Google Таблиця** on step 1, paste the URL and the `WRITE_TOKEN`.
   Both are remembered in this browser. To give everyone the URL by default, set
   `SHEETS_DEFAULT_URL` at the top of `js/sheets.js`. Never commit the token.

After changing `Code.gs`, use **Deploy → Manage deployments → Edit → New version** so the
same URL serves the new code.

## Privacy

Anyone with the web app URL can read names and totals (the same data the sheet shows).
Writing requires the token.
