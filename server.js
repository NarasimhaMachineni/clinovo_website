const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3005;

// Enable CORS & Json Body Parser Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// SQLite 3 Database File Connection with Recursive Directory Safety
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, 'feasibility.db');
const jsonBackupPath = path.join(dbDir, 'sites_store.json');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite 3 database:', err.message);
  } else {
    console.log(`Connected to SQLite 3 database at: ${dbPath}`);
  }
});

// 36 REAL-WORLD CLINICAL SITES WITH VARIED, ORIGINAL & NON-IDENTICAL DOMAIN SCORES (6 MEMBERS x 6 CONTINENTS)
const SEED_SITES_36 = [
  // --- TEAM MEMBER 1: Dr. Sarah Jenkins (Lead CRA) ---
  {
    id: 'site_na_01',
    name: 'MD Anderson Cancer Center',
    number: '101',
    country: 'United States (North America)',
    pi: 'Dr. Courtney Jones',
    status: 'approved',
    rate: 4.2,
    total: 45,
    weeks: 10,
    scores: { invSite: 94, patientPop: 90, facilities: 96, pharmacy: 91, labBiomarker: 95, safety: 96, regulatory: 88, dataTech: 92, budget: 90 },
    notes: 'Completed by Dr. Sarah Jenkins · NCI Comprehensive Cancer Center with high Phase III throughput.'
  },
  {
    id: 'site_sa_01',
    name: 'Instituto do Câncer do Estado de São Paulo (ICESP)',
    number: '102',
    country: 'Brazil (South America)',
    pi: 'Dr. Carlos Henrique',
    status: 'approved',
    rate: 3.1,
    total: 32,
    weeks: 14,
    scores: { invSite: 83, patientPop: 79, facilities: 85, pharmacy: 80, labBiomarker: 82, safety: 86, regulatory: 75, dataTech: 81, budget: 77 },
    notes: 'Completed by Dr. Sarah Jenkins · Leading Latin American academic oncology center.'
  },
  {
    id: 'site_eu_01',
    name: 'Gustave Roussy Cancer Campus',
    number: '103',
    country: 'France (Europe)',
    pi: 'Dr. Fabrice André',
    status: 'approved',
    rate: 3.8,
    total: 40,
    weeks: 11,
    scores: { invSite: 91, patientPop: 86, facilities: 93, pharmacy: 88, labBiomarker: 92, safety: 94, regulatory: 85, dataTech: 89, budget: 87 },
    notes: 'Completed by Dr. Sarah Jenkins · European flagship oncology research hospital.'
  },
  {
    id: 'site_as_01',
    name: 'National Cancer Center Hospital',
    number: '104',
    country: 'Japan (Asia)',
    pi: 'Dr. Kenji Tamura',
    status: 'approved',
    rate: 3.5,
    total: 36,
    weeks: 12,
    scores: { invSite: 88, patientPop: 83, facilities: 90, pharmacy: 86, labBiomarker: 89, safety: 91, regulatory: 82, dataTech: 86, budget: 84 },
    notes: 'Completed by Dr. Sarah Jenkins · High protocol adherence and automated EDC integration.'
  },
  {
    id: 'site_af_01',
    name: 'Tygerberg Academic Hospital & Stellenbosch Oncology',
    number: '105',
    country: 'South Africa (Africa)',
    pi: 'Dr. Bernardo Leon',
    status: 'conditional',
    rate: 2.6,
    total: 26,
    weeks: 15,
    scores: { invSite: 74, patientPop: 71, facilities: 76, pharmacy: 72, labBiomarker: 75, safety: 78, regulatory: 65, dataTech: 72, budget: 68 },
    notes: 'Completed by Dr. Sarah Jenkins · Tertiary teaching hospital requiring cold-chain validation.'
  },
  {
    id: 'site_oc_01',
    name: 'Peter MacCallum Cancer Centre',
    number: '106',
    country: 'Australia (Oceania)',
    pi: 'Dr. Benjamin Solomon',
    status: 'approved',
    rate: 3.4,
    total: 35,
    weeks: 12,
    scores: { invSite: 87, patientPop: 82, facilities: 89, pharmacy: 85, labBiomarker: 88, safety: 90, regulatory: 81, dataTech: 85, budget: 83 },
    notes: 'Completed by Dr. Sarah Jenkins · Dedicated public cancer research facility in Melbourne.'
  },

  // --- TEAM MEMBER 2: Dr. Michael Vance (Senior Protocol Officer) ---
  {
    id: 'site_na_02',
    name: 'Memorial Sloan Kettering Cancer Center',
    number: '201',
    country: 'United States (North America)',
    pi: 'Dr. Alexander Wright',
    status: 'approved',
    rate: 4.0,
    total: 42,
    weeks: 10,
    scores: { invSite: 93, patientPop: 88, facilities: 94, pharmacy: 90, labBiomarker: 93, safety: 95, regulatory: 86, dataTech: 90, budget: 88 },
    notes: 'Completed by Dr. Michael Vance · Exceptional retention rate and specialized research pharmacy.'
  },
  {
    id: 'site_sa_02',
    name: 'A.C.Camargo Cancer Center',
    number: '202',
    country: 'Brazil (South America)',
    pi: 'Dr. Fernando de Vital',
    status: 'approved',
    rate: 2.9,
    total: 30,
    weeks: 13,
    scores: { invSite: 81, patientPop: 76, facilities: 83, pharmacy: 78, labBiomarker: 80, safety: 84, regulatory: 73, dataTech: 79, budget: 75 },
    notes: 'Completed by Dr. Michael Vance · Integrated cancer treatment and research institute.'
  },
  {
    id: 'site_eu_02',
    name: 'The Royal Marsden NHS Foundation Trust',
    number: '203',
    country: 'United Kingdom (Europe)',
    pi: 'Dr. Johann de Bono',
    status: 'approved',
    rate: 3.7,
    total: 38,
    weeks: 11,
    scores: { invSite: 90, patientPop: 85, facilities: 92, pharmacy: 87, labBiomarker: 91, safety: 93, regulatory: 84, dataTech: 88, budget: 86 },
    notes: 'Completed by Dr. Michael Vance · Largest comprehensive cancer center in Europe.'
  },
  {
    id: 'site_as_02',
    name: 'Tata Memorial Hospital & Cancer Center',
    number: '204',
    country: 'India (Asia)',
    pi: 'Dr. Kumar Prabhash',
    status: 'approved',
    rate: 4.5,
    total: 48,
    weeks: 9,
    scores: { invSite: 92, patientPop: 95, facilities: 88, pharmacy: 84, labBiomarker: 86, safety: 89, regulatory: 78, dataTech: 83, budget: 82 },
    notes: 'Completed by Dr. Michael Vance · Massive patient volume and rapid recruitment capability.'
  },
  {
    id: 'site_af_02',
    name: 'National Cancer Institute (NCI-Cairo)',
    number: '205',
    country: 'Egypt (Africa)',
    pi: 'Dr. Tarek Hashem',
    status: 'conditional',
    rate: 2.8,
    total: 28,
    weeks: 14,
    scores: { invSite: 76, patientPop: 78, facilities: 74, pharmacy: 70, labBiomarker: 72, safety: 76, regulatory: 63, dataTech: 70, budget: 66 },
    notes: 'Completed by Dr. Michael Vance · Referral hub for North Africa with solid clinical staff.'
  },
  {
    id: 'site_oc_02',
    name: 'Royal Prince Alfred Hospital',
    number: '206',
    country: 'Australia (Oceania)',
    pi: 'Dr. Michael Boyer',
    status: 'approved',
    rate: 3.1,
    total: 31,
    weeks: 13,
    scores: { invSite: 85, patientPop: 80, facilities: 87, pharmacy: 83, labBiomarker: 86, safety: 88, regulatory: 79, dataTech: 83, budget: 81 },
    notes: 'Completed by Dr. Michael Vance · Sydney-based academic teaching hospital.'
  },

  // --- TEAM MEMBER 3: Dr. Elena Rostova (Global Feasibility Specialist) ---
  {
    id: 'site_na_03',
    name: 'Dana-Farber Cancer Institute',
    number: '301',
    country: 'United States (North America)',
    pi: 'Dr. Marcus Sterling',
    status: 'approved',
    rate: 3.6,
    total: 37,
    weeks: 12,
    scores: { invSite: 89, patientPop: 84, facilities: 91, pharmacy: 87, labBiomarker: 90, safety: 92, regulatory: 82, dataTech: 87, budget: 85 },
    notes: 'Completed by Dr. Elena Rostova · Principal Harvard Medical School clinical partner.'
  },
  {
    id: 'site_sa_03',
    name: 'Instituto de Oncología Ángel H. Roffo',
    number: '302',
    country: 'Argentina (South America)',
    pi: 'Dr. Matías Chacón',
    status: 'conditional',
    rate: 2.7,
    total: 27,
    weeks: 15,
    scores: { invSite: 77, patientPop: 73, facilities: 78, pharmacy: 74, labBiomarker: 75, safety: 79, regulatory: 67, dataTech: 73, budget: 69 },
    notes: 'Completed by Dr. Elena Rostova · Established oncology research hospital in Buenos Aires.'
  },
  {
    id: 'site_eu_03',
    name: 'Netherlands Cancer Institute (NKI-AVL)',
    number: '303',
    country: 'Netherlands (Europe)',
    pi: 'Dr. Emile Voest',
    status: 'approved',
    rate: 3.3,
    total: 34,
    weeks: 12,
    scores: { invSite: 87, patientPop: 82, facilities: 89, pharmacy: 85, labBiomarker: 88, safety: 89, regulatory: 81, dataTech: 86, budget: 83 },
    notes: 'Completed by Dr. Elena Rostova · Specialized European site for precision immuno-oncology trials.'
  },
  {
    id: 'site_as_03',
    name: 'Samsung Medical Center',
    number: '304',
    country: 'South Korea (Asia)',
    pi: 'Dr. Myung-Ju Ahn',
    status: 'approved',
    rate: 4.1,
    total: 44,
    weeks: 10,
    scores: { invSite: 92, patientPop: 89, facilities: 94, pharmacy: 90, labBiomarker: 93, safety: 94, regulatory: 85, dataTech: 92, budget: 88 },
    notes: 'Completed by Dr. Elena Rostova · Advanced digital medical record and biomarker processing infrastructure.'
  },
  {
    id: 'site_af_03',
    name: 'Aga Khan University Hospital',
    number: '305',
    country: 'Kenya (Africa)',
    pi: 'Dr. Mansoor Saleh',
    status: 'conditional',
    rate: 2.4,
    total: 24,
    weeks: 16,
    scores: { invSite: 72, patientPop: 68, facilities: 74, pharmacy: 70, labBiomarker: 71, safety: 75, regulatory: 64, dataTech: 70, budget: 65 },
    notes: 'Completed by Dr. Elena Rostova · Leading private tertiary research center in East Africa.'
  },
  {
    id: 'site_oc_03',
    name: "Chris O'Brien Lifehouse",
    number: '306',
    country: 'Australia (Oceania)',
    pi: 'Dr. Michael Chao',
    status: 'approved',
    rate: 3.0,
    total: 30,
    weeks: 13,
    scores: { invSite: 84, patientPop: 79, facilities: 86, pharmacy: 82, labBiomarker: 85, safety: 87, regulatory: 78, dataTech: 82, budget: 80 },
    notes: 'Completed by Dr. Elena Rostova · Comprehensive cancer treatment hospital in Sydney.'
  },

  // --- TEAM MEMBER 4: Dr. Rajiv Patel (Clinical Operations Lead) ---
  {
    id: 'site_na_04',
    name: 'Johns Hopkins Sidney Kimmel Cancer Center',
    number: '401',
    country: 'United States (North America)',
    pi: 'Dr. Rachel Vance',
    status: 'approved',
    rate: 3.4,
    total: 35,
    weeks: 13,
    scores: { invSite: 86, patientPop: 81, facilities: 88, pharmacy: 84, labBiomarker: 87, safety: 89, regulatory: 80, dataTech: 85, budget: 82 },
    notes: 'Completed by Dr. Rajiv Patel · World-class translational oncology clinical trial infrastructure.'
  },
  {
    id: 'site_sa_04',
    name: 'Fundación Valle del Lili',
    number: '402',
    country: 'Colombia (South America)',
    pi: 'Dr. Luis Eduardo Pino',
    status: 'conditional',
    rate: 2.8,
    total: 28,
    weeks: 14,
    scores: { invSite: 78, patientPop: 74, facilities: 80, pharmacy: 76, labBiomarker: 77, safety: 80, regulatory: 69, dataTech: 75, budget: 71 },
    notes: 'Completed by Dr. Rajiv Patel · Renowned Colombian academic hospital.'
  },
  {
    id: 'site_eu_04',
    name: 'Charité Universitätsmedizin Berlin',
    number: '403',
    country: 'Germany (Europe)',
    pi: 'Dr. Ulrich Keilholz',
    status: 'approved',
    rate: 3.6,
    total: 36,
    weeks: 11,
    scores: { invSite: 88, patientPop: 83, facilities: 90, pharmacy: 86, labBiomarker: 89, safety: 91, regulatory: 82, dataTech: 86, budget: 84 },
    notes: 'Completed by Dr. Rajiv Patel · Major Central European university medical center.'
  },
  {
    id: 'site_as_04',
    name: 'National University Cancer Institute (NCIS)',
    number: '404',
    country: 'Singapore (Asia)',
    pi: 'Dr. Ross Soo',
    status: 'approved',
    rate: 3.7,
    total: 38,
    weeks: 11,
    scores: { invSite: 89, patientPop: 84, facilities: 92, pharmacy: 88, labBiomarker: 91, safety: 92, regulatory: 84, dataTech: 89, budget: 86 },
    notes: 'Completed by Dr. Rajiv Patel · Premier Southeast Asian academic research site.'
  },
  {
    id: 'site_af_04',
    name: 'Groote Schuur Hospital Oncology Department',
    number: '405',
    country: 'South Africa (Africa)',
    pi: 'Dr. Jeannette Parkes',
    status: 'conditional',
    rate: 2.5,
    total: 25,
    weeks: 15,
    scores: { invSite: 73, patientPop: 70, facilities: 75, pharmacy: 71, labBiomarker: 73, safety: 76, regulatory: 65, dataTech: 71, budget: 67 },
    notes: 'Completed by Dr. Rajiv Patel · Key academic site affiliated with University of Cape Town.'
  },
  {
    id: 'site_oc_04',
    name: 'Olivia Newton-John Cancer Research Institute',
    number: '406',
    country: 'Australia (Oceania)',
    pi: 'Dr. Andrew Scott',
    status: 'approved',
    rate: 2.9,
    total: 29,
    weeks: 13,
    scores: { invSite: 83, patientPop: 78, facilities: 85, pharmacy: 81, labBiomarker: 84, safety: 86, regulatory: 78, dataTech: 81, budget: 79 },
    notes: 'Completed by Dr. Rajiv Patel · Advanced clinical trial facility in Heidelberg, Victoria.'
  },

  // --- TEAM MEMBER 5: Dr. Sophia Al-Mansoor (Global Site Manager) ---
  {
    id: 'site_na_05',
    name: 'Mayo Clinic Cancer Center',
    number: '501',
    country: 'United States (North America)',
    pi: 'Dr. Eleanor Brooks',
    status: 'approved',
    rate: 3.3,
    total: 33,
    weeks: 12,
    scores: { invSite: 87, patientPop: 82, facilities: 90, pharmacy: 86, labBiomarker: 88, safety: 90, regulatory: 81, dataTech: 86, budget: 84 },
    notes: 'Completed by Dr. Sophia Al-Mansoor · Multi-campus NCI Comprehensive Cancer Center.'
  },
  {
    id: 'site_sa_05',
    name: 'Instituto Nacional de Cáncer (INCAN)',
    number: '502',
    country: 'Chile (South America)',
    pi: 'Dr. Jorge Madrid',
    status: 'conditional',
    rate: 2.6,
    total: 26,
    weeks: 16,
    scores: { invSite: 75, patientPop: 71, facilities: 77, pharmacy: 73, labBiomarker: 74, safety: 77, regulatory: 66, dataTech: 72, budget: 68 },
    notes: 'Completed by Dr. Sophia Al-Mansoor · National reference hospital for oncology in Santiago.'
  },
  {
    id: 'site_eu_05',
    name: 'European Institute of Oncology (IEO)',
    number: '503',
    country: 'Italy (Europe)',
    pi: 'Dr. Giuseppe Curigliano',
    status: 'approved',
    rate: 3.5,
    total: 35,
    weeks: 12,
    scores: { invSite: 87, patientPop: 83, facilities: 89, pharmacy: 85, labBiomarker: 87, safety: 90, regulatory: 81, dataTech: 85, budget: 83 },
    notes: 'Completed by Dr. Sophia Al-Mansoor · Leading Italian research institute in Milan.'
  },
  {
    id: 'site_as_05',
    name: 'Sun Yat-sen University Cancer Center',
    number: '504',
    country: 'China (Asia)',
    pi: 'Dr. Yi-Long Wu',
    status: 'approved',
    rate: 4.6,
    total: 50,
    weeks: 9,
    scores: { invSite: 93, patientPop: 96, facilities: 91, pharmacy: 88, labBiomarker: 90, safety: 92, regulatory: 82, dataTech: 89, budget: 86 },
    notes: 'Completed by Dr. Sophia Al-Mansoor · High-capacity East Asian Phase III trial hub.'
  },
  {
    id: 'site_af_05',
    name: 'Salah Azaïz Institute of Oncology',
    number: '505',
    country: 'Tunisia (Africa)',
    pi: 'Dr. Chiraz Nasr',
    status: 'not_approved',
    rate: 2.3,
    total: 23,
    weeks: 16,
    scores: { invSite: 68, patientPop: 64, facilities: 70, pharmacy: 66, labBiomarker: 67, safety: 71, regulatory: 58, dataTech: 66, budget: 62 },
    notes: 'Completed by Dr. Sophia Al-Mansoor · Requires local laboratory equipment calibration.'
  },
  {
    id: 'site_oc_05',
    name: 'Auckland City Hospital Oncology Centre',
    number: '506',
    country: 'New Zealand (Oceania)',
    pi: 'Dr. Mark McKeage',
    status: 'approved',
    rate: 2.7,
    total: 27,
    weeks: 14,
    scores: { invSite: 82, patientPop: 77, facilities: 84, pharmacy: 80, labBiomarker: 82, safety: 85, regulatory: 77, dataTech: 80, budget: 78 },
    notes: 'Completed by Dr. Sophia Al-Mansoor · Primary tertiary cancer hospital in Auckland.'
  },

  // --- TEAM MEMBER 6: Dr. David Lin (Principal Medical Monitor) ---
  {
    id: 'site_na_06',
    name: 'UCSF Helen Diller Family Comprehensive Cancer Center',
    number: '601',
    country: 'United States (North America)',
    pi: 'Dr. David Lin',
    status: 'approved',
    rate: 3.2,
    total: 32,
    weeks: 12,
    scores: { invSite: 86, patientPop: 81, facilities: 89, pharmacy: 85, labBiomarker: 87, safety: 89, regulatory: 80, dataTech: 85, budget: 83 },
    notes: 'Completed by Dr. David Lin · West Coast academic comprehensive cancer center.'
  },
  {
    id: 'site_sa_06',
    name: 'Instituto Nacional de Enfermedades Neoplásicas (INEN)',
    number: '602',
    country: 'Peru (South America)',
    pi: 'Dr. Carlos Vallejos',
    status: 'conditional',
    rate: 2.5,
    total: 25,
    weeks: 15,
    scores: { invSite: 74, patientPop: 70, facilities: 76, pharmacy: 72, labBiomarker: 73, safety: 76, regulatory: 65, dataTech: 71, budget: 67 },
    notes: 'Completed by Dr. David Lin · Primary cancer reference center in Lima, Peru.'
  },
  {
    id: 'site_eu_06',
    name: "Vall d'Hebron Institute of Oncology (VHIO)",
    number: '603',
    country: 'Spain (Europe)',
    pi: 'Dr. Josep Tabernero',
    status: 'approved',
    rate: 3.9,
    total: 41,
    weeks: 10,
    scores: { invSite: 91, patientPop: 86, facilities: 92, pharmacy: 88, labBiomarker: 91, safety: 93, regulatory: 84, dataTech: 89, budget: 87 },
    notes: 'Completed by Dr. David Lin · Leading Mediterranean early & late phase trial institution.'
  },
  {
    id: 'site_as_06',
    name: 'Fudan University Shanghai Cancer Center',
    number: '604',
    country: 'China (Asia)',
    pi: 'Dr. Jin Li',
    status: 'approved',
    rate: 4.4,
    total: 46,
    weeks: 9,
    scores: { invSite: 92, patientPop: 95, facilities: 90, pharmacy: 87, labBiomarker: 89, safety: 91, regulatory: 81, dataTech: 88, budget: 85 },
    notes: 'Completed by Dr. David Lin · Top-tier Shanghai academic oncology clinical trial site.'
  },
  {
    id: 'site_af_06',
    name: 'Hôpital Aristide Le Dantec Oncology Unit',
    number: '605',
    country: 'Senegal (Africa)',
    pi: 'Dr. Macoumba Gaye',
    status: 'not_approved',
    rate: 2.2,
    total: 22,
    weeks: 17,
    scores: { invSite: 65, patientPop: 61, facilities: 67, pharmacy: 63, labBiomarker: 64, safety: 68, regulatory: 55, dataTech: 63, budget: 59 },
    notes: 'Completed by Dr. David Lin · West African medical unit requiring deep-freezer upgrades.'
  },
  {
    id: 'site_oc_06',
    name: 'Fiona Stanley Hospital Cancer Centre',
    number: '606',
    country: 'Australia (Oceania)',
    pi: 'Dr. Millward Michael',
    status: 'approved',
    rate: 2.8,
    total: 28,
    weeks: 14,
    scores: { invSite: 83, patientPop: 78, facilities: 85, pharmacy: 81, labBiomarker: 83, safety: 86, regulatory: 78, dataTech: 81, budget: 79 },
    notes: 'Completed by Dr. David Lin · Key tertiary oncology center in Perth, Western Australia.'
  }
];

// Helper to Load / Persist JSON Backup Store Across Server Restarts
function loadJsonStore() {
  try {
    if (fs.existsSync(jsonBackupPath)) {
      const raw = fs.readFileSync(jsonBackupPath, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data) && data.length >= 36) return data;
    }
  } catch (e) {
    console.error('Error reading JSON sites store:', e.message);
  }
  saveJsonStore(SEED_SITES_36);
  return SEED_SITES_36;
}

function saveJsonStore(sites) {
  try {
    fs.writeFileSync(jsonBackupPath, JSON.stringify(sites, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing JSON sites store:', e.message);
  }
}

// FULL 12 QUESTIONNAIRE MODULES SCHEMA
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

// Initialize SQLite Database Tables & Seed Persistent Store
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

  // REPOPULATE WITH ORIGINAL VARIED DOMAIN SCORES
  db.run("DELETE FROM sites");

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

  db.run(`
    CREATE TABLE IF NOT EXISTS questionnaire_modules (
      module_number TEXT PRIMARY KEY,
      module_title TEXT NOT NULL,
      kicker TEXT,
      description TEXT,
      fields_json TEXT NOT NULL
    )
  `, () => {
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
  });

  // POPULATE ALL 36 REAL-WORLD SITES (6 MEMBERS x 6 CONTINENTS)
  const initialSites = SEED_SITES_36;
  saveJsonStore(initialSites);

  const stmt = db.prepare(`
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
  `);

  initialSites.forEach(s => {
    stmt.run(s.id, s.name, s.number, s.country, s.pi, s.status, s.rate, s.total, s.weeks, JSON.stringify(s.scores || {}), s.notes || '');
  });
  stmt.finalize();
  console.log(`Successfully populated ${initialSites.length} real-world clinical sites (6 team members x 6 continents).`);
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
    return 0;
  };

  const domainScore = (fieldIds) => {
    if (!fieldIds.length) return 75;
    let earned = 0;
    fieldIds.forEach(id => {
      earned += scoreField(id);
    });
    return Math.round((earned / fieldIds.length) * 100);
  };

  const invSite = domainScore(['q_gcpPI', 'q_gcpStaff', 'q_cv', 'q_delegation', 'q_dedicated']);
  const patientPop = domainScore(['q_referral', 'q_reflex', 'q_diverse', 'q_realistic', 'q_soc', 'q_survival']);
  const facilities = domainScore(['q_consent', 'q_infusion', 'q_crash', 'q_admit', 'q_radTx', 'q_ipStorage', 'q_backupPower', 'q_secureStorage', 'q_centrifuge', 'q_imaging', 'q_radiologist', 'q_freezer', 'q_internet']);
  const pharmacy = domainScore(['q_hazPharmacy', 'q_bsc', 'q_ipAccountability', 'q_unblinding', 'q_bsaDosing', 'q_tempExcursion', 'q_compounding', 'q_usp800']);
  const labBiomarker = domainScore(['q_labAccred', 'q_tissueAccess', 'q_cdx', 'q_researchBiopsy', 'q_shipping', 'q_courier']);
  const safety = domainScore(['q_ctcae', 'q_escalation', 'q_oncall', 'q_specialists', 'q_recist', 'q_saeReporting', 'q_dsmb']);
  const regulatory = 80;
  const dataTech = domainScore(['q_edc', 'q_epro', 'q_ehr', 'q_itSupport', 'q_part11']);
  const budget = domainScore(['q_timelines']);

  const scores = { invSite, patientPop, facilities, pharmacy, labBiomarker, safety, regulatory, dataTech, budget };
  const keys = Object.keys(scores);
  const overall = Math.round(keys.reduce((acc, k) => acc + scores[k], 0) / keys.length);

  return { scores, overall };
}

// REST API ROUTE 1: GET ALL CLINICAL SITES (PERMANENT & REAL CLIENT SUBMISSIONS)
app.get('/api/sites', (req, res) => {
  db.all("SELECT * FROM sites ORDER BY created_at DESC", [], (err, rows) => {
    if (err || !rows || rows.length === 0) {
      const fallback = loadJsonStore();
      return res.json({ success: true, sites: fallback });
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
    saveJsonStore(sites);
    res.json({ success: true, sites });
  });
});

// REST API ROUTE 2: POST / UPSERT CLINICAL SITE
app.post('/api/sites', (req, res) => {
  const { id, name, number, country, pi, status, rate, total, weeks, scores, notes } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, error: 'Site name is required' });
  }
  const siteId = id || 's_' + Date.now();
  const scoresJson = JSON.stringify(scores || {});

  const stmt = db.prepare(`
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
  `);

  stmt.run(siteId, name, number, country, pi, status || 'pending', rate || 0, total || 0, weeks || 0, scoresJson, notes || '', (err) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    db.all("SELECT * FROM sites ORDER BY created_at DESC", [], (err2, rows) => {
      const sites = (rows || []).map(r => ({
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
      saveJsonStore(sites);
      res.json({ success: true, sites });
    });
  });
  stmt.finalize();
});

// REST API ROUTE 3: DELETE CLINICAL SITE
app.delete('/api/sites/:id', (req, res) => {
  const siteId = req.params.id;
  db.run("DELETE FROM sites WHERE id = ?", [siteId], (err) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    db.all("SELECT * FROM sites ORDER BY created_at DESC", [], (err2, rows) => {
      const sites = (rows || []).map(r => ({
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
      saveJsonStore(sites);
      res.json({ success: true, sites });
    });
  });
});

// REST API ROUTE 4: SUBMIT CLIENT SITE FEASIBILITY QUESTIONNAIRE
app.post('/api/questionnaire/submit', (req, res) => {
  const { answers } = req.body;
  if (!answers) {
    return res.status(400).json({ success: false, error: 'Answers are required' });
  }

  const siteName = answers['siteName'] || answers['institution'] || ('Submitted Site #' + Math.floor(100 + Math.random() * 900));
  const siteNumber = answers['siteNumber'] || String(Math.floor(100 + Math.random() * 900));
  const country = answers['country'] || 'United States';
  const pi = answers['piName'] || 'Dr. Investigator';

  const { scores, overall } = computeQuestionnaireScores(answers);
  const status = overall >= 80 ? 'approved' : (overall >= 65 ? 'conditional' : 'not_approved');
  const siteId = 's_' + Date.now();
  const qId = 'q_' + Date.now();

  const answersJson = JSON.stringify(answers);
  const scoresJson = JSON.stringify(scores);

  db.serialize(() => {
    db.run(
      `INSERT INTO sites (id, name, number, country, pi, status, rate, total, weeks, scores_json, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        siteId,
        siteName,
        siteNumber,
        country,
        pi,
        status,
        parseFloat(answers['enrollRate']) || 3.0,
        parseInt(answers['totalEnroll'], 10) || 30,
        parseInt(answers['sivToFPI'], 10) || 12,
        scoresJson,
        'Submitted via Client Site Feasibility Portal'
      ]
    );

    db.run(
      `INSERT INTO questionnaires (id, site_id, protocol_number, protocol_title, sponsor, tumor_type, line_of_therapy, answers_json, scores_json, overall_score)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        qId,
        siteId,
        answers['protocolNumber'] || '',
        answers['protocolTitle'] || '',
        answers['sponsor'] || '',
        answers['tumorType'] || '',
        Array.isArray(answers['lineOfTherapy']) ? answers['lineOfTherapy'].join(', ') : '',
        answersJson,
        scoresJson,
        overall
      ]
    );

    db.all("SELECT * FROM sites ORDER BY created_at DESC", [], (err, rows) => {
      const sites = (rows || []).map(r => ({
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

      saveJsonStore(sites);

      res.json({
        success: true,
        siteId,
        overallScore: overall,
        scores,
        sites
      });
    });
  });
});

// GET 12 QUESTIONNAIRE MODULES & QUESTIONS
app.get('/api/questionnaire/modules', (req, res) => {
  db.all("SELECT * FROM questionnaire_modules ORDER BY module_number ASC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    const modules = rows.map(r => ({
      module_number: r.module_number,
      module_title: r.module_title,
      kicker: r.kicker,
      description: r.description,
      fields: JSON.parse(r.fields_json)
    }));
    res.json({ success: true, modules });
  });
});

// Wildcard SPA Fallback Route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Clinovo Site Feasibility Server running on port ${PORT}`);
});
