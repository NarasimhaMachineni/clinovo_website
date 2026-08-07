const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db', 'feasibility.db');
const sqlDumpPath = path.join(__dirname, 'db', 'feasibility_dump.sql');

const db = new sqlite3.Database(dbPath);

let sqlOutput = `-- ==========================================================================\n`;
sqlOutput += `-- CLINOVO SITE FEASIBILITY PORTAL - SQLITE 3 DATABASE DUMP\n`;
sqlOutput += `-- Generated: ${new Date().toISOString()}\n`;
sqlOutput += `-- ==========================================================================\n\n`;

sqlOutput += `BEGIN TRANSACTION;\n\n`;

// 1. DDL Statements
sqlOutput += `-- -------------------------------------------------------------------------\n`;
sqlOutput += `-- TABLE: sites\n`;
sqlOutput += `-- -------------------------------------------------------------------------\n`;
sqlOutput += `CREATE TABLE IF NOT EXISTS sites (\n`;
sqlOutput += `  id TEXT PRIMARY KEY,\n`;
sqlOutput += `  name TEXT NOT NULL,\n`;
sqlOutput += `  number TEXT,\n`;
sqlOutput += `  country TEXT,\n`;
sqlOutput += `  pi TEXT,\n`;
sqlOutput += `  status TEXT DEFAULT 'pending',\n`;
sqlOutput += `  rate REAL DEFAULT 3.0,\n`;
sqlOutput += `  total INTEGER DEFAULT 30,\n`;
sqlOutput += `  weeks INTEGER DEFAULT 12,\n`;
sqlOutput += `  scores_json TEXT,\n`;
sqlOutput += `  notes TEXT,\n`;
sqlOutput += `  created_at DATETIME DEFAULT CURRENT_TIMESTAMP\n`;
sqlOutput += `);\n\n`;

sqlOutput += `-- -------------------------------------------------------------------------\n`;
sqlOutput += `-- TABLE: questionnaires\n`;
sqlOutput += `-- -------------------------------------------------------------------------\n`;
sqlOutput += `CREATE TABLE IF NOT EXISTS questionnaires (\n`;
sqlOutput += `  id TEXT PRIMARY KEY,\n`;
sqlOutput += `  site_id TEXT,\n`;
sqlOutput += `  protocol_number TEXT,\n`;
sqlOutput += `  protocol_title TEXT,\n`;
sqlOutput += `  sponsor TEXT,\n`;
sqlOutput += `  tumor_type TEXT,\n`;
sqlOutput += `  line_of_therapy TEXT,\n`;
sqlOutput += `  answers_json TEXT,\n`;
sqlOutput += `  scores_json TEXT,\n`;
sqlOutput += `  overall_score INTEGER,\n`;
sqlOutput += `  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP\n`;
sqlOutput += `);\n\n`;

sqlOutput += `-- -------------------------------------------------------------------------\n`;
sqlOutput += `-- TABLE: questionnaire_modules\n`;
sqlOutput += `-- -------------------------------------------------------------------------\n`;
sqlOutput += `CREATE TABLE IF NOT EXISTS questionnaire_modules (\n`;
sqlOutput += `  module_number TEXT PRIMARY KEY,\n`;
sqlOutput += `  module_title TEXT NOT NULL,\n`;
sqlOutput += `  kicker TEXT,\n`;
sqlOutput += `  description TEXT,\n`;
sqlOutput += `  fields_json TEXT NOT NULL\n`;
sqlOutput += `);\n\n`;

function escapeSQL(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  return `'${String(val).replace(/'/g, "''")}'`;
}

db.serialize(() => {
  // Dump questionnaire_modules
  db.all('SELECT * FROM questionnaire_modules ORDER BY module_number ASC', [], (err, rows) => {
    sqlOutput += `-- -------------------------------------------------------------------------\n`;
    sqlOutput += `-- DATA: questionnaire_modules (12 Roles & Questions)\n`;
    sqlOutput += `-- -------------------------------------------------------------------------\n`;
    if (rows && rows.length) {
      rows.forEach(r => {
        sqlOutput += `INSERT INTO questionnaire_modules (module_number, module_title, kicker, description, fields_json) VALUES (${escapeSQL(r.module_number)}, ${escapeSQL(r.module_title)}, ${escapeSQL(r.kicker)}, ${escapeSQL(r.description)}, ${escapeSQL(r.fields_json)});\n`;
      });
    }
    sqlOutput += `\n`;

    // Dump sites
    db.all('SELECT * FROM sites ORDER BY created_at ASC', [], (err2, siteRows) => {
      sqlOutput += `-- -------------------------------------------------------------------------\n`;
      sqlOutput += `-- DATA: sites\n`;
      sqlOutput += `-- -------------------------------------------------------------------------\n`;
      if (siteRows && siteRows.length) {
        siteRows.forEach(r => {
          sqlOutput += `INSERT INTO sites (id, name, number, country, pi, status, rate, total, weeks, scores_json, notes, created_at) VALUES (${escapeSQL(r.id)}, ${escapeSQL(r.name)}, ${escapeSQL(r.number)}, ${escapeSQL(r.country)}, ${escapeSQL(r.pi)}, ${escapeSQL(r.status)}, ${escapeSQL(r.rate)}, ${escapeSQL(r.total)}, ${escapeSQL(r.weeks)}, ${escapeSQL(r.scores_json)}, ${escapeSQL(r.notes)}, ${escapeSQL(r.created_at)});\n`;
        });
      }
      sqlOutput += `\n`;

      // Dump questionnaires
      db.all('SELECT * FROM questionnaires ORDER BY submitted_at ASC', [], (err3, qRows) => {
        sqlOutput += `-- -------------------------------------------------------------------------\n`;
        sqlOutput += `-- DATA: questionnaires\n`;
        sqlOutput += `-- -------------------------------------------------------------------------\n`;
        if (qRows && qRows.length) {
          qRows.forEach(r => {
            sqlOutput += `INSERT INTO questionnaires (id, site_id, protocol_number, protocol_title, sponsor, tumor_type, line_of_therapy, answers_json, scores_json, overall_score, submitted_at) VALUES (${escapeSQL(r.id)}, ${escapeSQL(r.site_id)}, ${escapeSQL(r.protocol_number)}, ${escapeSQL(r.protocol_title)}, ${escapeSQL(r.sponsor)}, ${escapeSQL(r.tumor_type)}, ${escapeSQL(r.line_of_therapy)}, ${escapeSQL(r.answers_json)}, ${escapeSQL(r.scores_json)}, ${escapeSQL(r.overall_score)}, ${escapeSQL(r.submitted_at)});\n`;
          });
        }
        sqlOutput += `\nCOMMIT;\n`;

        fs.writeFileSync(sqlDumpPath, sqlOutput, 'utf8');
        console.log(`Successfully generated SQL dump file at: ${sqlDumpPath}`);
        db.close();
      });
    });
  });
});
