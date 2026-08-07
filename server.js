const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Create DB Directory if missing
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'feasibility.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite 3 database at:', dbPath);
  }
});

// FULL 12-MODULE QUESTIONNAIRE DEFINITION ARRAY FOR SQLITE 3 DATABASE
const QUESTIONNAIRE_MODULES_SCHEMA = [
  {
    module_number: '01',
    module_title: 'Study Information',
    kicker: 'Header · 01 / 12',
    description: 'Core protocol identifiers for this feasibility record.',
    fields: [
      { id: 'protocolNumber', type: 'text', label: 'Protocol number' },
      { id: 'protocolTitle', type: 'text', label: 'Protocol title' },
      { id: 'sponsor', type: 'text', label: 'Sponsor / CRO' },
      { id: 'tumorType', type: 'text', label: 'Tumor type / indication' },
      { id: 'lineOfTherapy', type: 'multiselect', label: 'Line of therapy', options: ['1L', '2L', '3L+', 'Adjuvant', 'Neoadjuvant', 'Maintenance'] },
      { id: 'blinding', type: 'select', label: 'Randomization / design', options: ['Open-label', 'Single-blind', 'Double-blind'] },
      { id: 'arms', type: 'text', label: 'Number of treatment arms' },
      { id: 'siteName', type: 'text', label: 'Site name' },
      { id: 'siteNumber', type: 'text', label: 'Site number' },
      { id: 'country', type: 'text', label: 'Country' },
      { id: 'completedBy', type: 'text', label: 'Completed by (name / role)' }
    ]
  },
  {
    module_number: '02',
    module_title: 'Site & Investigator',
    kicker: 'Section 1 · 02 / 12',
    description: 'Institution, PI, and study team qualifications.',
    fields: [
      { id: 'institution', type: 'text', label: 'Institution / site name and address' },
      { id: 'siteType', type: 'text', label: 'Site type', hint: 'e.g., academic medical center, community hospital, dedicated research site' },
      { id: 'piName', type: 'text', label: 'Principal Investigator (PI) name and specialty' },
      { id: 'piLicense', type: 'text', label: 'PI medical license / registration number and expiry' },
      { id: 'piBoard', type: 'text', label: 'PI board certification', hint: 'e.g., Medical Oncology, Hematology-Oncology, Surgical Oncology, Radiation Oncology' },
      { id: 'subInv', type: 'text', label: 'Sub-investigator(s) name(s) and specialty' },
      { id: 'coordinators', type: 'text', label: 'Study coordinator(s) / CRC(s) name(s)' },
      { id: 'pharmacist', type: 'text', label: 'Pharmacist responsible for investigational product (IP)' },
      { id: 'primaryContact', type: 'text', label: 'Primary contact name, phone, and email' },
      { id: 'piYears', type: 'text', label: 'Years PI has been in independent clinical practice' },
      { id: 'piTrials', type: 'text', label: 'Number of clinical trials PI has conducted as PI (total / active)' },
      { id: 'piPhase3Onc', type: 'text', label: 'Number of Phase III oncology trials PI has conducted as PI' },
      { type: 'divider', label: 'Investigator & staff qualifications' },
      { id: 'q_gcpPI', type: 'yesno', label: 'Does the PI hold current Good Clinical Practice (GCP) training/certification?' },
      { id: 'q_gcpStaff', type: 'yesno', label: 'Do all sub-investigators and coordinators hold current GCP certification?' },
      { id: 'q_cv', type: 'yesno', label: "Is the PI's CV current, signed, and dated within the last 2 years?" },
      { id: 'q_delegation', type: 'yesno', label: 'Does the site have documented delegation-of-duties procedures?' },
      { id: 'q_dedicated', type: 'yesno', label: 'Is dedicated research staff (not solely clinical staff) available for this study?' },
      { id: 'q_audit', type: 'yesno', label: 'Has the PI or site been the subject of a regulatory audit finding, warning letter, or debarment action?', hint: 'if yes, explain in comment' }
    ]
  },
  {
    module_number: '03',
    module_title: 'Tumor Board',
    kicker: 'Section 1.2 · 03 / 12',
    description: 'Multidisciplinary tumor board (MDT) infrastructure.',
    fields: [
      { id: 'q_mdtHeld', type: 'yesno', label: 'Does the site hold a regular multidisciplinary tumor board (surgical, medical, radiation oncology, pathology, radiology)?', hint: 'state frequency in comment' },
      { id: 'q_mdtPI', type: 'yesno', label: 'Is the PI or a sub-investigator a regular, active participant in the tumor board?' },
      { id: 'q_mdtProcess', type: 'yesno', label: 'Is there a documented process for identifying trial-eligible patients at tumor board?' }
    ]
  },
  {
    module_number: '04',
    module_title: 'Patient Population',
    kicker: 'Section 2 · 04 / 12',
    description: 'Accrual potential against the fixed comparator arm.',
    fields: [
      { id: 'newDx', type: 'text', label: 'Estimated number of new patients diagnosed with this tumor type per year at this site' },
      { id: 'eligibleMonth', type: 'text', label: 'Estimated number of patients per month meeting the line-of-therapy / disease-stage criteria' },
      { id: 'biomarkerPrev', type: 'text', label: 'Estimated prevalence of required biomarker(s) in the local population', hint: 'e.g., % PD-L1+, HER2+, EGFR-mutant, MSI-H' },
      { id: 'screenFail', type: 'text', label: 'Anticipated screen-failure rate and primary reasons' },
      { id: 'enrollRate', type: 'text', label: 'Projected enrollment rate (patients per month)' },
      { id: 'totalEnroll', type: 'text', label: 'Total projected enrollment over the recruitment period' },
      { id: 'idSource', type: 'text', label: 'Primary source(s) of patient identification', hint: 'e.g., tumor board, referral network, molecular tumor board, registry' },
      { id: 'competing', type: 'text', label: 'Competing trials currently enrolling in the same tumor type / line of therapy at this site' },
      { id: 'retention', type: 'text', label: 'Historical retention rate for long-term oncology follow-up (survival, PFS) at this site' },
      { type: 'divider', label: 'Recruitment capability' },
      { id: 'q_referral', type: 'yesno', label: 'Does the site have an established referral network feeding this indication?' },
      { id: 'q_reflex', type: 'yesno', label: 'Is local or reflex biomarker/companion diagnostic testing available to pre-screen patients?' },
      { id: 'q_diverse', type: 'yesno', label: 'Does the site have experience recruiting from diverse or underrepresented populations, if required?' },
      { id: 'q_realistic', type: 'yesno', label: "Is there a realistic plan to reach the enrollment target within the sponsor's competitive-enrollment timeline?" },
      { id: 'q_soc', type: 'yesno', label: 'Does the site routinely use the comparator / standard-of-care regimen specified in the protocol?' },
      { id: 'q_survival', type: 'yesno', label: 'Does the site have a process for capturing long-term survival status after discontinuation or study closure?' }
    ]
  },
  {
    module_number: '05',
    module_title: 'Facilities & Equipment',
    kicker: 'Section 3 · 05 / 12',
    description: 'Physical infrastructure to support trial conduct.',
    fields: [
      { id: 'q_consent', type: 'yesno', label: 'Does the site have adequate private space for informed consent discussions?' },
      { id: 'q_infusion', type: 'yesno', label: 'Does the site have a dedicated infusion suite with sufficient chair/bed capacity for added study volume?', hint: 'state number of chairs/beds in comment' },
      { id: 'q_crash', type: 'yesno', label: 'Is emergency resuscitation equipment (crash cart / AED) available on-site or immediately accessible?' },
      { id: 'q_admit', type: 'yesno', label: 'Is there rapid access to emergency care and inpatient admission for treatment-related toxicity?' },
      { id: 'q_radTx', type: 'yesno', label: 'Does the site have on-site or rapidly accessible radiation therapy, if required by protocol?' },
      { id: 'q_ipStorage', type: 'yesno', label: 'Does the site have refrigerated/frozen storage with continuous temperature monitoring for IP?' },
      { id: 'q_backupPower', type: 'yesno', label: 'Does the site have back-up power supply for storage equipment (e.g., generator)?' },
      { id: 'q_secureStorage', type: 'yesno', label: 'Does the site have secure, locked storage for IP and study documents?' },
      { id: 'q_centrifuge', type: 'yesno', label: 'Is a centrifuge and appropriate equipment available for biomarker/PK sample processing?' },
      { id: 'q_imaging', type: 'yesno', label: 'Does the site have CT, MRI, and/or PET capability meeting RECIST 1.1 requirements on-site?', hint: 'specify modalities in comment' },
      { id: 'q_radiologist', type: 'yesno', label: 'Is there a dedicated or trained radiologist for independent tumor response assessment, if required?' },
      { id: 'q_freezer', type: 'yesno', label: 'Is a -20°C / -70°C freezer available on-site for biomarker/translational sample storage?' },
      { id: 'q_internet', type: 'yesno', label: 'Does the site have reliable internet connectivity for EDC and central imaging upload systems?' }
    ]
  },
  {
    module_number: '06',
    module_title: 'Pharmacy & IP',
    kicker: 'Section 4 · 06 / 12',
    description: 'Investigational product handling and hazardous-drug safety.',
    fields: [
      { id: 'q_hazPharmacy', type: 'yesno', label: 'Does the site have a licensed oncology/research pharmacy with hazardous-drug (cytotoxic) handling certification?' },
      { id: 'q_bsc', type: 'yesno', label: 'Does the pharmacy have a certified biological safety cabinet (Class II) for hazardous drug compounding?' },
      { id: 'q_ipAccountability', type: 'yesno', label: 'Is IP accountability (receipt, dispensing, return, destruction) managed per GCP and sponsor requirements?' },
      { id: 'q_unblinding', type: 'yesno', label: 'Does the pharmacy have experience with randomized / blinded study drug procedures and unblinding SOPs?' },
      { id: 'q_bsaDosing', type: 'yesno', label: 'Does the pharmacy have experience with weight- or BSA-based dosing and dose modifications for toxicity?' },
      { id: 'q_tempExcursion', type: 'yesno', label: 'Is there a validated process for temperature excursion reporting and deviation management?' },
      { id: 'q_compounding', type: 'yesno', label: 'Does the site have capability for IP compounding, reconstitution, or infusion admixture, if required?' },
      { id: 'q_usp800', type: 'yesno', label: 'Is pharmacy staff trained in USP <800> or equivalent hazardous drug safe-handling standards?' }
    ]
  },
  {
    module_number: '07',
    module_title: 'Lab, Pathology & Biomarkers',
    kicker: 'Section 5 · 07 / 12',
    description: 'Testing, tissue access, and specimen logistics.',
    fields: [
      { id: 'localLab', type: 'text', label: 'Local laboratory name and CLIA / accreditation number (or equivalent)' },
      { id: 'centralLab', type: 'text', label: 'Central laboratory experience', hint: 'name central labs previously used, if any' },
      { id: 'pathLab', type: 'text', label: 'On-site or affiliated pathology laboratory name and accreditation' },
      { id: 'sampleHandling', type: 'text', label: 'Sample processing, storage, and shipping capabilities', hint: 'blood, tissue, FFPE blocks' },
      { id: 'safetyTAT', type: 'text', label: 'Turnaround time for local safety labs' },
      { id: 'biomarkerTAT', type: 'text', label: 'Turnaround time for local biomarker/companion diagnostic testing, if applicable' },
      { type: 'divider', label: 'Tissue & testing capability' },
      { id: 'q_labAccred', type: 'yesno', label: 'Does the local laboratory hold current accreditation/certification?' },
      { id: 'q_tissueAccess', type: 'yesno', label: 'Does the site have access to archival or fresh tumor tissue meeting protocol specimen requirements?' },
      { id: 'q_cdx', type: 'yesno', label: 'Is central or local biomarker/companion diagnostic testing available for required stratification factors?' },
      { id: 'q_researchBiopsy', type: 'yesno', label: 'Does the site have experience obtaining pre-treatment and on-treatment research biopsies, if required?' },
      { id: 'q_shipping', type: 'yesno', label: 'Does the site have experience shipping tissue and blood samples to a central laboratory (dry ice / ambient)?' },
      { id: 'q_courier', type: 'yesno', label: 'Is a 24-hour or rapid courier service available for sample shipment, if required?' }
    ]
  },
  {
    module_number: '08',
    module_title: 'Safety & Toxicity',
    kicker: 'Section 5A · 08 / 12',
    description: 'Adverse event management and response assessment.',
    fields: [
      { id: 'q_ctcae', type: 'yesno', label: 'Is staff trained in CTCAE grading and management of study-drug-related toxicities (e.g., irAEs, infusion reactions)?' },
      { id: 'q_escalation', type: 'yesno', label: 'Does the site have a documented escalation pathway for Grade 3+ adverse events, including after-hours coverage?' },
      { id: 'q_oncall', type: 'yesno', label: 'Is a 24/7 on-call PI or sub-investigator available for urgent safety issues?' },
      { id: 'q_specialists', type: 'yesno', label: 'Does the site have access to specialists for anticipated toxicities (e.g., endocrinology, pulmonology, cardiology)?' },
      { id: 'q_recist', type: 'yesno', label: 'Does the site have experience conducting tumor response assessments per RECIST 1.1 or protocol-specified criteria?' },
      { id: 'q_saeReporting', type: 'yesno', label: 'Is there a defined process for expedited SAE / SUSAR reporting to sponsor and IRB/IEC within required timelines?' },
      { id: 'q_dsmb', type: 'yesno', label: 'Does the site have experience with studies overseen by a DSMB / IDMC, including interim analyses?' }
    ]
  },
  {
    module_number: '09',
    module_title: 'Regulatory & Experience',
    kicker: 'Section 6 · 09 / 12',
    description: 'Ethics oversight and prior trial track record.',
    fields: [
      { id: 'irb', type: 'text', label: 'IRB / Independent Ethics Committee (IEC) of record' },
      { id: 'irbTAT', type: 'text', label: 'Typical IRB/IEC initial review turnaround time' },
      { id: 'oncTrials3y', type: 'text', label: 'Number of industry-sponsored oncology trials conducted in the last 3 years' },
      { id: 'phase3Trials3y', type: 'text', label: 'Number of Phase III randomized oncology trials conducted in the last 3 years' },
      { id: 'tumorTrials3y', type: 'text', label: 'Number of trials in this specific tumor type conducted in the last 3 years' },
      { id: 'priorSponsors', type: 'text', label: 'Names of sponsors/CROs the site has worked with previously' },
      { id: 'sivToFPI', type: 'text', label: 'Average time from Site Initiation Visit to first patient enrolled (historical)' }
    ]
  },
  {
    module_number: '10',
    module_title: 'Data Management & Technology',
    kicker: 'Section 7 · 10 / 12',
    description: 'EDC, ePRO, and technical readiness.',
    fields: [
      { id: 'q_edc', type: 'yesno', label: 'Does the site have prior experience with electronic data capture (EDC) systems?' },
      { id: 'q_epro', type: 'yesno', label: 'Does the site have experience with ePRO or wearable devices, if required?' },
      { id: 'q_ehr', type: 'yesno', label: 'Is the EHR system compatible with source-data verification requirements?' },
      { id: 'q_itSupport', type: 'yesno', label: 'Does the site have IT support available for study-related technology issues?' },
      { id: 'q_part11', type: 'yesno', label: 'Are validated / 21 CFR Part 11-compliant computer systems used for study data?' }
    ]
  },
  {
    module_number: '11',
    module_title: 'Budget, Contracts & Timelines',
    kicker: 'Section 8 · 11 / 12',
    description: 'Administrative readiness and start-up pace.',
    fields: [
      { id: 'contractOwner', type: 'text', label: 'Institution / department responsible for contract and budget negotiation' },
      { id: 'contractTAT', type: 'text', label: 'Typical timeline for contract execution once terms are agreed' },
      { id: 'indirectCost', type: 'text', label: 'Does the site require a separate institutional overhead / indirect cost rate?' },
      { id: 'startupTimeline', type: 'text', label: 'Anticipated start-up timeline (contract execution to first patient enrolled)' },
      { id: 'q_timelines', type: 'yesno', label: "Is the site able to meet the sponsor's proposed study timelines?" },
      { id: 'q_conflict', type: 'yesno', label: 'Are there any anticipated conflicts of interest requiring disclosure?' },
      { id: 'additionalComments', type: 'textarea', label: 'Additional comments' }
    ]
  },
  {
    module_number: '12',
    module_title: 'Site Declaration',
    kicker: 'Section 9 · 12 / 12',
    description: 'Sign-off and sponsor / CRO review outcome.',
    fields: [
      { id: 'declPI', type: 'text', label: 'Principal Investigator name' },
      { id: 'declSignature', type: 'text', label: 'Signature', hint: 'type name to represent signature in this draft; obtain a wet or e-signature on the final copy' },
      { id: 'declDate', type: 'text', label: 'Date' },
      { type: 'divider', label: 'For sponsor / CRO use only' },
      { id: 'sponsorOutcome', type: 'select', label: 'Feasibility outcome', options: ['Approved', 'Approved with conditions', 'Not approved'] },
      { id: 'reviewedBy', type: 'text', label: 'Reviewed by' },
      { id: 'reviewDate', type: 'text', label: 'Date' }
    ]
  }
];

// Initialize SQLite Database Tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS sites (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      number TEXT,
      country TEXT,
      pi TEXT,
      status TEXT DEFAULT 'pending',
      rate REAL DEFAULT 3.0,
      total INTEGER DEFAULT 30,
      weeks INTEGER DEFAULT 12,
      scores_json TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS questionnaires (
      id TEXT PRIMARY KEY,
      site_id TEXT,
      protocol_number TEXT,
      protocol_title TEXT,
      sponsor TEXT,
      tumor_type TEXT,
      line_of_therapy TEXT,
      answers_json TEXT,
      scores_json TEXT,
      overall_score INTEGER,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // CREATE TABLE FOR 12 QUESTIONNAIRE MODULES & QUESTIONS
  db.run(`
    CREATE TABLE IF NOT EXISTS questionnaire_modules (
      module_number TEXT PRIMARY KEY,
      module_title TEXT NOT NULL,
      kicker TEXT,
      description TEXT,
      fields_json TEXT NOT NULL
    )
  `, () => {
    // Upsert all 12 modules and questions into SQLite 3
    const stmt = db.prepare(`
      INSERT INTO questionnaire_modules (module_number, module_title, kicker, description, fields_json)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(module_number) DO UPDATE SET
        module_title=excluded.module_title,
        kicker=excluded.kicker,
        description=excluded.description,
        fields_json=excluded.fields_json
    `);

    QUESTIONNAIRE_MODULES_SCHEMA.forEach(mod => {
      stmt.run(mod.module_number, mod.module_title, mod.kicker, mod.description, JSON.stringify(mod.fields));
    });
    stmt.finalize();
    console.log('Successfully updated all 12 questionnaire modules & questions in SQLite 3 database.');
  });
});

// ACCURATE SCORING ALGORITHM MATCHING QUESTIONNAIRE DATA (YES = 1, NO = 0)
function computeQuestionnaireScores(answers) {
  const scoreField = (id) => {
    const val = answers[id];
    if (!val) return 0;
    if (typeof val === 'object' && val.v) {
      return val.v === 'yes' ? 1 : 0;
    }
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (!trimmed) return 0;
      if (trimmed.toLowerCase() === 'yes') return 1;
      if (trimmed.toLowerCase() === 'no') return 0;
      return 1;
    }
    if (Array.isArray(val)) return val.length > 0 ? 1 : 0;
    return 0;
  };

  const calcCategoryScore = (fieldIds) => {
    if (!fieldIds || fieldIds.length === 0) return 0;
    let sum = 0;
    fieldIds.forEach(id => {
      sum += scoreField(id);
    });
    return Math.round((sum / fieldIds.length) * 100);
  };

  const scores = {
    invSite: calcCategoryScore(['q_gcpPI', 'q_gcpStaff', 'q_cv', 'q_delegation', 'q_dedicated', 'q_mdtHeld', 'q_mdtPI', 'q_mdtProcess', 'piName', 'institution']),
    patientPop: calcCategoryScore(['q_referral', 'q_reflex', 'q_diverse', 'q_realistic', 'q_soc', 'q_survival', 'eligibleMonth', 'enrollRate', 'totalEnroll']),
    facilities: calcCategoryScore(['q_consent', 'q_infusion', 'q_crash', 'q_admit', 'q_radTx', 'q_ipStorage', 'q_backupPower', 'q_secureStorage', 'q_centrifuge', 'q_imaging', 'q_radiologist', 'q_freezer', 'q_internet']),
    pharmacy: calcCategoryScore(['q_hazPharmacy', 'q_bsc', 'q_ipAccountability', 'q_unblinding', 'q_bsaDosing', 'q_tempExcursion', 'q_compounding', 'q_usp800']),
    labBiomarker: calcCategoryScore(['q_labAccred', 'q_tissueAccess', 'q_cdx', 'q_researchBiopsy', 'q_shipping', 'q_courier', 'localLab', 'pathLab']),
    safety: calcCategoryScore(['q_ctcae', 'q_escalation', 'q_oncall', 'q_specialists', 'q_recist', 'q_saeReporting', 'q_dsmb']),
    regulatory: calcCategoryScore(['irb', 'irbTAT', 'oncTrials3y', 'phase3Trials3y', 'sivToFPI']),
    dataTech: calcCategoryScore(['q_edc', 'q_epro', 'q_ehr', 'q_itSupport', 'q_part11']),
    budget: calcCategoryScore(['q_timelines', 'contractOwner', 'contractTAT', 'startupTimeline'])
  };

  let sumAll = 0;
  const cats = Object.keys(scores);
  cats.forEach(c => sumAll += scores[c]);
  const overallScore = Math.round(sumAll / cats.length);

  return { scores, overallScore };
}

// REST API ROUTES
app.get('/api/questionnaire/modules', (req, res) => {
  db.all('SELECT * FROM questionnaire_modules ORDER BY module_number ASC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    const modules = rows.map(r => ({
      num: r.module_number,
      title: r.module_title,
      kicker: r.kicker,
      desc: r.description,
      fields: r.fields_json ? JSON.parse(r.fields_json) : []
    }));
    res.json({ success: true, modules });
  });
});

app.get('/api/sites', (req, res) => {
  db.all('SELECT * FROM sites ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    const sites = rows.map(r => ({
      id: r.id,
      name: r.name,
      number: r.number,
      country: r.country,
      pi: r.pi,
      status: r.status,
      rate: r.rate,
      total: r.total,
      weeks: r.weeks,
      scores: r.scores_json ? JSON.parse(r.scores_json) : {},
      notes: r.notes
    }));
    res.json({ success: true, sites });
  });
});

app.post('/api/sites', (req, res) => {
  const newSite = req.body;
  if (!newSite || !newSite.name) {
    return res.status(400).json({ success: false, message: 'Site name is required.' });
  }

  const siteId = newSite.id || 's' + Date.now();
  const scoresJson = JSON.stringify(newSite.scores || {});

  db.run(`
    INSERT INTO sites (id, name, number, country, pi, status, rate, total, weeks, scores_json, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      number=excluded.number,
      country=excluded.country,
      pi=excluded.pi,
      status=excluded.status,
      rate=excluded.rate,
      total=excluded.total,
      weeks=excluded.weeks,
      scores_json=excluded.scores_json,
      notes=excluded.notes
  `, [siteId, newSite.name, newSite.number, newSite.country, newSite.pi, newSite.status || 'pending', newSite.rate || 3.0, newSite.total || 30, newSite.weeks || 12, scoresJson, newSite.notes || ''], (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    db.all('SELECT * FROM sites ORDER BY created_at DESC', [], (err2, rows) => {
      const sites = rows ? rows.map(r => ({
        id: r.id, name: r.name, number: r.number, country: r.country, pi: r.pi,
        status: r.status, rate: r.rate, total: r.total, weeks: r.weeks,
        scores: r.scores_json ? JSON.parse(r.scores_json) : {}, notes: r.notes
      })) : [];
      res.json({ success: true, site: newSite, sites });
    });
  });
});

app.delete('/api/sites/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM sites WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    db.all('SELECT * FROM sites ORDER BY created_at DESC', [], (err2, rows) => {
      const sites = rows ? rows.map(r => ({
        id: r.id, name: r.name, number: r.number, country: r.country, pi: r.pi,
        status: r.status, rate: r.rate, total: r.total, weeks: r.weeks,
        scores: r.scores_json ? JSON.parse(r.scores_json) : {}, notes: r.notes
      })) : [];
      res.json({ success: true, sites });
    });
  });
});

app.post('/api/questionnaire/submit', (req, res) => {
  const { answers } = req.body;
  if (!answers) {
    return res.status(400).json({ success: false, message: 'Answers payload is required.' });
  }

  const { scores, overallScore } = computeQuestionnaireScores(answers);

  const qId = 'q' + Date.now();
  const siteId = 's' + Date.now();
  const siteName = answers.siteName || answers.institution || 'Submitted Clinical Site';
  const siteNumber = answers.siteNumber || String(Math.floor(100 + Math.random() * 900));
  const country = answers.country || 'United States';
  const piName = answers.piName || answers.completedBy || 'Dr. Submitting PI';

  // Compute status based strictly on scoring algorithm
  let statusVal = 'pending';
  if (overallScore >= 80) statusVal = 'approved';
  else if (overallScore >= 65) statusVal = 'conditional';
  else statusVal = 'not_approved';

  const answersJson = JSON.stringify(answers);
  const scoresJson = JSON.stringify(scores);

  db.serialize(() => {
    db.run(`
      INSERT INTO questionnaires (id, site_id, protocol_number, protocol_title, sponsor, tumor_type, line_of_therapy, answers_json, scores_json, overall_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [qId, siteId, answers.protocolNumber || '', answers.protocolTitle || '', answers.sponsor || '', answers.tumorType || '', JSON.stringify(answers.lineOfTherapy || []), answersJson, scoresJson, overallScore]);

    const notesStr = `Submitted via Client Site Feasibility Questionnaire on ${new Date().toLocaleDateString()}. Overall Score: ${overallScore}/100.`;
    const rateVal = parseFloat(answers.enrollRate || answers.eligibleMonth || 3.0) || 3.0;
    const totalVal = parseInt(answers.totalEnroll || 30, 10) || 30;

    db.run(`
      INSERT INTO sites (id, name, number, country, pi, status, rate, total, weeks, scores_json, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [siteId, siteName, siteNumber, country, piName, statusVal, rateVal, totalVal, 12, scoresJson, notesStr], (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      db.all('SELECT * FROM sites ORDER BY created_at DESC', [], (err2, rows) => {
        const sites = rows ? rows.map(r => ({
          id: r.id, name: r.name, number: r.number, country: r.country, pi: r.pi,
          status: r.status, rate: r.rate, total: r.total, weeks: r.weeks,
          scores: r.scores_json ? JSON.parse(r.scores_json) : {}, notes: r.notes
        })) : [];

        res.json({
          success: true,
          message: 'Questionnaire submitted and scored in SQLite 3 database!',
          qId,
          siteId,
          scores,
          overallScore,
          sites
        });
      });
    });
  });
});

// Fallback to SPA index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Clinovo Site Feasibility Portal running on http://localhost:${PORT}`);
});
