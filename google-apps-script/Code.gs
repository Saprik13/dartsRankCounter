/** @OnlyCurrentDoc */
/**
 * Darts Rank Counter — Google Sheets bridge (Apps Script web app).
 *
 * Sheet layout (one row per player):
 *   column B — player name, column C — total points (the rating),
 *   columns to the right — points per tournament, one column per tournament, date in the header row.
 *
 * GET  <url>  → { ok, players:[{ name, rating }], lastDate:'dd.MM', savedDates:[...], aliases:[{ alias, name }] }
 * POST <url>  (Content-Type text/plain, JSON body)
 *   { token, tournament:{ id, date, typeLabel, playerCount, coefficient },
 *     results:[{ name, rating, place, points, newRating }] }
 *   → { ok, saved, matched, added, column, totalsNotUpdated:[names] } | { ok:false, error }
 *
 * Setup: see google-apps-script/README.md.
 */

const CONFIG = {
  SHEET_GID: 1932316403,        // gid from the sheet URL (#gid=...)
  HEADER_ROW: 4,                // row with tournament dates; players start below it
  NUMBER_COL: 1,                // A — running number, filled for new players
  NAME_COL: 2,                  // B
  TOTAL_COL: 3,                 // C
  FIRST_TOURNAMENT_COL: 4,      // D
  DATE_LABEL: 'dd.MM',          // how tournament dates are written in the header row
  ALIAS_SHEET: 'Ніки',          // created automatically: A = name in n01darts, B = name in the rating sheet
  PLACEHOLDER_HEADER: /^(стовпець|column)(\s|\d|$)/i  // empty table columns that can be reused
};

function doGet() {
  try {
    const sheet = getSheet_();
    const players = readPlayers_(sheet).map(p => ({ name: p.name, rating: p.total }));
    const savedDates = savedDates_(sheet);
    return json_({
      ok: true, players: players, savedDates: savedDates,
      lastDate: savedDates.length ? savedDates[savedDates.length - 1] : '',
      aliases: readAliases_()
    });
  } catch (error) {
    return json_({ ok: false, error: errorText_(error) });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const expectedToken = PropertiesService.getScriptProperties().getProperty('WRITE_TOKEN');
    if (!expectedToken) return json_({ ok: false, error: 'token_not_configured' });
    if (body.token !== expectedToken) return json_({ ok: false, error: 'bad_token' });

    const tournament = body.tournament || {};
    const results = (Array.isArray(body.results) ? body.results : [])
      .map(r => ({ name: String(r.name || '').trim(), points: num_(r.points) }))
      .filter(r => r.name);
    if (!tournament.id || results.length === 0) return json_({ ok: false, error: 'bad_request' });

    const sheet = getSheet_();
    if (findTournamentColumn_(sheet, tournament.id)) return json_({ ok: false, error: 'duplicate' });

    const totalIsFormula = hasTotalFormula_(sheet);
    const before = {};
    readPlayers_(sheet).forEach(p => { before[key_(p.name)] = p.total; });

    // 1. Column for the tournament: an existing empty column with the same date,
    //    else the first empty placeholder column ("Стовпець N" / blank), else a new column on the right.
    const dateLabel = formatDateLabel_(tournament.date);
    const pick = pickTournamentColumn_(sheet, dateLabel);
    if (pick.column < 0) return json_({ ok: false, error: 'date_column_has_data', column: dateLabel });
    const column = pick.column;
    if (pick.insert) {
      // Insert inside the existing block so tables and SUM ranges grow with it.
      sheet.insertColumnBefore(column);
    } else if (column > sheet.getMaxColumns()) {
      sheet.insertColumnAfter(sheet.getMaxColumns());
    }
    const lastRow = lastDataRow_(sheet);
    if (lastRow > CONFIG.HEADER_ROW) {
      // Placeholder columns can hold stray zeros; start the tournament column clean.
      sheet.getRange(CONFIG.HEADER_ROW + 1, column, lastRow - CONFIG.HEADER_ROW, 1).clearContent();
    }
    const header = sheet.getRange(CONFIG.HEADER_ROW, column);
    header.setNumberFormat('@').setValue(dateLabel);
    header.setNote([
      'id: ' + tournament.id,
      tournament.typeLabel ? 'Тип: ' + tournament.typeLabel : '',
      tournament.playerCount ? 'Учасників: ' + tournament.playerCount : '',
      tournament.coefficient ? 'Коефіцієнт: ×' + tournament.coefficient : ''
    ].filter(String).join('\n'));

    // 2. Points per player (existing rows, then new players at the bottom).
    const rows = rowsByName_(sheet);
    let matched = 0;
    const added = [];
    results.forEach(r => {
      let row = rows[key_(r.name)];
      if (row) {
        matched++;
      } else {
        row = lastDataRow_(sheet) + 1;
        sheet.getRange(row, CONFIG.NAME_COL).setValue(r.name);
        const previousNumber = sheet.getRange(row - 1, CONFIG.NUMBER_COL).getValue();
        if (typeof previousNumber === 'number') sheet.getRange(row, CONFIG.NUMBER_COL).setValue(previousNumber + 1);
        if (totalIsFormula) {
          sheet.getRange(row - 1, CONFIG.TOTAL_COL).copyTo(sheet.getRange(row, CONFIG.TOTAL_COL));
        }
        rows[key_(r.name)] = row;
        added.push(r.name);
      }
      sheet.getRange(row, column).setValue(r.points);
      if (!totalIsFormula) {
        const totalCell = sheet.getRange(row, CONFIG.TOTAL_COL);
        totalCell.setValue(num_(totalCell.getValue()) + r.points);
      }
    });

    // 3. Check that totals really changed (a SUM range may not cover the new column).
    SpreadsheetApp.flush();
    const after = {};
    readPlayers_(sheet).forEach(p => { after[key_(p.name)] = p.total; });
    const totalsNotUpdated = results
      .filter(r => r.points !== 0)
      .filter(r => Math.abs((after[key_(r.name)] || 0) - ((before[key_(r.name)] || 0) + r.points)) > 1e-6)
      .map(r => r.name);

    sortByTotal_(sheet);
    saveAliases_(Array.isArray(body.aliases) ? body.aliases : []);

    return json_({
      ok: true, saved: results.length, matched: matched, added: added.length,
      column: columnLetter_(column), totalsNotUpdated: totalsNotUpdated
    });
  } catch (error) {
    return json_({ ok: false, error: errorText_(error) });
  } finally {
    try { lock.releaseLock(); } catch (ignored) {}
  }
}

function getSheet_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()
    .find(s => s.getSheetId() === CONFIG.SHEET_GID);
  if (!sheet) throw new Error('sheet_not_found');
  return sheet;
}

function lastDataRow_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= CONFIG.HEADER_ROW) return CONFIG.HEADER_ROW;
  const names = sheet.getRange(CONFIG.HEADER_ROW + 1, CONFIG.NAME_COL, lastRow - CONFIG.HEADER_ROW, 1).getValues();
  for (let i = names.length - 1; i >= 0; i--) {
    if (String(names[i][0]).trim()) return CONFIG.HEADER_ROW + 1 + i;
  }
  return CONFIG.HEADER_ROW;
}

function readPlayers_(sheet) {
  const last = lastDataRow_(sheet);
  if (last <= CONFIG.HEADER_ROW) return [];
  const width = CONFIG.TOTAL_COL - CONFIG.NAME_COL + 1;
  return sheet.getRange(CONFIG.HEADER_ROW + 1, CONFIG.NAME_COL, last - CONFIG.HEADER_ROW, width).getValues()
    .map((row, index) => ({
      name: String(row[0]).trim(),
      total: num_(row[CONFIG.TOTAL_COL - CONFIG.NAME_COL]),
      row: CONFIG.HEADER_ROW + 1 + index
    }))
    .filter(p => p.name);
}

function rowsByName_(sheet) {
  const map = {};
  readPlayers_(sheet).forEach(p => { if (!map[key_(p.name)]) map[key_(p.name)] = p.row; });
  return map;
}

/** Sorts player rows by Total, highest first (Z→A), and renumbers column A if it holds plain numbers. */
function sortByTotal_(sheet) {
  const last = lastDataRow_(sheet);
  const count = last - CONFIG.HEADER_ROW;
  if (count < 2) return;
  const rows = sheet.getRange(CONFIG.HEADER_ROW + 1, 1, count, sheet.getLastColumn());
  rows.sort([{ column: CONFIG.TOTAL_COL, ascending: false }, { column: CONFIG.NAME_COL, ascending: true }]);
  const numbers = sheet.getRange(CONFIG.HEADER_ROW + 1, CONFIG.NUMBER_COL, count, 1);
  const numberFormulas = numbers.getFormulas();
  const values = numbers.getValues();
  if (numberFormulas.some(row => row[0])) return;
  if (!values.every(row => row[0] === '' || typeof row[0] === 'number')) return;
  numbers.setValues(values.map((row, index) => [index + 1]));
  SpreadsheetApp.flush();
}

function hasTotalFormula_(sheet) {
  const last = lastDataRow_(sheet);
  if (last <= CONFIG.HEADER_ROW) return false;
  return sheet.getRange(CONFIG.HEADER_ROW + 1, CONFIG.TOTAL_COL, last - CONFIG.HEADER_ROW, 1).getFormulas()
    .some(row => row[0]);
}

function findTournamentColumn_(sheet, id) {
  const lastColumn = sheet.getLastColumn();
  if (lastColumn < CONFIG.FIRST_TOURNAMENT_COL) return 0;
  const notes = sheet.getRange(CONFIG.HEADER_ROW, CONFIG.FIRST_TOURNAMENT_COL, 1, lastColumn - CONFIG.FIRST_TOURNAMENT_COL + 1).getNotes()[0];
  const index = notes.findIndex(note => String(note).split('\n')[0] === 'id: ' + id);
  return index < 0 ? 0 : CONFIG.FIRST_TOURNAMENT_COL + index;
}

/**
 * The tournament goes right after the last filled tournament column (a dd.MM header with points),
 * whatever is further right in the sheet.
 *  - a column with the same date and no points → reuse it;
 *  - the next column is blank / "Стовпець N" / another date without points → reuse it;
 *  - otherwise a new column is inserted right after the last tournament.
 * Returns { column, insert } or { column: -1 } when the date is already filled.
 */
function pickTournamentColumn_(sheet, dateLabel) {
  const lastColumn = sheet.getLastColumn();
  const last = lastDataRow_(sheet);
  if (lastColumn < CONFIG.FIRST_TOURNAMENT_COL) return { column: CONFIG.FIRST_TOURNAMENT_COL, insert: false };
  const width = lastColumn - CONFIG.FIRST_TOURNAMENT_COL + 1;
  const headers = sheet.getRange(CONFIG.HEADER_ROW, CONFIG.FIRST_TOURNAMENT_COL, 1, width).getDisplayValues()[0]
    .map(value => String(value).trim());
  const data = last > CONFIG.HEADER_ROW
    ? sheet.getRange(CONFIG.HEADER_ROW + 1, CONFIG.FIRST_TOURNAMENT_COL, last - CONFIG.HEADER_ROW, width).getValues()
    : [];
  // Zeros do not count as points: placeholder columns are sometimes pre-filled with 0.
  const hasPoints = index => data.some(row => row[index] !== '' && row[index] !== null && row[index] !== 0);
  const isDate = header => DATE_HEADER.test(header);

  const sameDate = headers.indexOf(dateLabel);
  if (sameDate >= 0) {
    return hasPoints(sameDate) ? { column: -1 } : { column: CONFIG.FIRST_TOURNAMENT_COL + sameDate, insert: false };
  }

  let lastTournament = -1;
  headers.forEach((header, index) => { if (isDate(header) && hasPoints(index)) lastTournament = index; });
  const next = lastTournament + 1;
  if (next >= headers.length) return { column: lastColumn + 1, insert: false };
  const header = headers[next];
  const free = !hasPoints(next) && (!header || CONFIG.PLACEHOLDER_HEADER.test(header) || isDate(header));
  return { column: CONFIG.FIRST_TOURNAMENT_COL + next, insert: !free };
}

const DATE_HEADER = /^\d{1,2}\.\d{1,2}$/;

function formatDateLabel_(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const date = match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date();
  return Utilities.formatDate(date, Session.getScriptTimeZone(), CONFIG.DATE_LABEL);
}

function savedDates_(sheet) {
  const lastColumn = sheet.getLastColumn();
  const last = lastDataRow_(sheet);
  if (lastColumn < CONFIG.FIRST_TOURNAMENT_COL || last <= CONFIG.HEADER_ROW) return [];
  const width = lastColumn - CONFIG.FIRST_TOURNAMENT_COL + 1;
  const headers = sheet.getRange(CONFIG.HEADER_ROW, CONFIG.FIRST_TOURNAMENT_COL, 1, width).getDisplayValues()[0];
  const data = sheet.getRange(CONFIG.HEADER_ROW + 1, CONFIG.FIRST_TOURNAMENT_COL, last - CONFIG.HEADER_ROW, width).getValues();
  return headers
    .map((header, index) => ({ header: String(header).trim(), used: data.some(row => row[index] !== '' && row[index] !== null) }))
    .filter(column => column.used && column.header)
    .map(column => column.header);
}

function aliasSheet_(create) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(CONFIG.ALIAS_SHEET);
  if (!sheet && create) {
    sheet = book.insertSheet(CONFIG.ALIAS_SHEET);
    sheet.getRange(1, 1, 1, 2).setValues([['Нік у n01darts', 'Гравець у рейтингу']]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function readAliases_() {
  const sheet = aliasSheet_(false);
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues()
    .map(row => ({ alias: String(row[0]).trim(), name: String(row[1]).trim() }))
    .filter(row => row.alias && row.name);
}

function saveAliases_(aliases) {
  const clean = aliases
    .map(a => ({ alias: String(a.alias || '').trim(), name: String(a.name || '').trim() }))
    .filter(a => a.alias && a.name);
  if (!clean.length) return;
  const existing = {};
  readAliases_().forEach(a => { existing[key_(a.alias)] = true; });
  const rows = clean.filter(a => !existing[key_(a.alias)]).map(a => [a.alias, a.name]);
  if (!rows.length) return;
  const sheet = aliasSheet_(true);
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 2).setValues(rows);
}

function columnLetter_(column) {
  let name = '';
  for (let value = column; value > 0; value = Math.floor((value - 1) / 26)) {
    name = String.fromCharCode(65 + ((value - 1) % 26)) + name;
  }
  return name;
}

function num_(value) {
  if (typeof value === 'number') return value;
  const parsed = parseFloat(String(value || '').replace(/\s/g, '').replace(',', '.'));
  return isNaN(parsed) ? 0 : parsed;
}

function key_(name) { return String(name).trim().toLowerCase().replace(/\s+/g, ' '); }

function errorText_(error) { return String((error && error.message) || error); }

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
