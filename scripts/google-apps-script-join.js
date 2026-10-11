/**
 * NERO – website sign-ups → Google Sheet (bound to the sheet; appends rows only).
 *   type=join        → tab "Join requests"  ("Join the renaissance" flow)
 *   type=newsletter  → tab "Newsletter"     (newsletter boxes, explicit consent required)
 * Sends no email and returns no data.
 *
 * Setup: Extensions → Apps Script → paste this file → Save → Deploy → Web app
 *   (Execute as: Me · Access: Anyone) → put the URL into index.html: <meta name="nero-join-endpoint">.
 * After editing: Deploy → Manage deployments → edit → Version: New version → Deploy (URL stays the same).
 */
const TABS = {
  join: {
    name: 'Join requests',
    header: ['Time', 'How to get involved', 'Spaces of interest', 'Name', 'Email', 'Message', 'Newsletter', 'Page', 'Done'],
    row: (p) => [new Date(), clean_(p.roles, 200), clean_(p.spaces, 400), clean_(p.name, 120), clean_(p.email, 200),
      clean_(p.message, 2000), p.updates === 'yes' ? 'yes' : 'no', clean_(p.page, 300), false],
  },
  newsletter: {
    name: 'Newsletter',
    header: ['Time', 'Name', 'Email', 'Consent', 'Page', 'Unsubscribed'],
    row: (p) => [new Date(), clean_(p.name, 120), clean_(p.email, 200), 'yes', clean_(p.page, 300), false],
  },
};

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.website) return ok_(); // honeypot
  const tab = TABS[p.type === 'newsletter' ? 'newsletter' : 'join'];
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean_(p.email, 200))) return ok_();
  if (tab === TABS.newsletter && p.consent !== 'yes') return ok_(); // no consent, no entry

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(tab.name) || ss.insertSheet(tab.name);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(tab.header);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, tab.header.length).setFontWeight('bold');
    }
    sheet.appendRow(tab.row(p));
    sheet.getRange(sheet.getLastRow(), tab.header.length).insertCheckboxes();
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

// Run once in the editor (testEntry) to grant permissions and check the sheet.
function testEntry() {
  doPost({ parameter: { type: 'newsletter', name: 'Test (delete me)', email: 'test@example.com', consent: 'yes', page: 'Apps Script editor' } });
}

function ok_() {
  return ContentService.createTextOutput('ok');
}
