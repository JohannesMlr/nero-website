/**
 * NERO – "Join the renaissance" requests → Google Sheet.
 * (Same pattern as the Startkapital site; not served publicly, see .vercelignore.)
 *
 * Setup (~5 minutes):
 * 1. Create a Google Sheet, e.g. "NERO – Join requests".
 * 2. Extensions → Apps Script → paste this file → Save.
 * 3. Deploy → New deployment → type "Web app"
 *      Execute as: Me   ·   Who has access: Anyone
 *    → authorise, copy the web-app URL.
 * 4. Paste the URL into index.html: <meta name="nero-join-endpoint" content="…">
 *
 * The script only appends rows. It sends no email and returns no data.
 */
const SHEET_NAME = 'Join requests';
const HEADER = ['Time', 'How to get involved', 'Spaces of interest', 'Name', 'Email', 'Message', 'Newsletter', 'Page', 'Done'];

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.website) return ok_(); // honeypot

  const email = clean_(p.email, 200);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return ok_();

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADER);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADER.length).setFontWeight('bold');
    }
    sheet.appendRow([
      new Date(), clean_(p.roles, 200), clean_(p.spaces, 400), clean_(p.name, 120), email,
      clean_(p.message, 2000), p.updates === 'yes' ? 'yes' : 'no', clean_(p.page, 300), false,
    ]);
    sheet.getRange(sheet.getLastRow(), HEADER.length).insertCheckboxes();
  } finally {
    lock.releaseLock();
  }
  return ok_();
}

// Truncates input and stops text from being evaluated as a spreadsheet formula.
function clean_(value, max) {
  const s = String(value || '').trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// Run once in the editor (▶ testEntry) to grant permissions and check the sheet.
function testEntry() {
  doPost({ parameter: { roles: 'Contributor', spaces: 'Technology, Energy', name: 'Test (delete me)', email: 'test@example.com', message: 'Hello', updates: 'yes', page: 'Apps Script editor' } });
}

function ok_() {
  return ContentService.createTextOutput('ok');
}
