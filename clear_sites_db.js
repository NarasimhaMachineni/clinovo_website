const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'db', 'feasibility.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run('DELETE FROM sites;', (err) => {
    if (err) console.error('Error clearing sites:', err);
    else console.log('Successfully cleared sites table in SQLite 3 DB.');
  });
  db.run('DELETE FROM questionnaires;', (err) => {
    if (err) console.error('Error clearing questionnaires:', err);
    else console.log('Successfully cleared questionnaires table in SQLite 3 DB.');
  });
  db.close();
});
