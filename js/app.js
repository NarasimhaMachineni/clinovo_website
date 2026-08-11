/* ==========================================================================
   CLINOVO SITE FEASIBILITY PORTAL & DASHBOARD - APPLICATION JAVASCRIPT
   Font: Bookman Old Style | 240Hz High Refresh Hardware Accelerated Engine
   ========================================================================== */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. GLOBAL STATE & ROUTING
  // -------------------------------------------------------------------------
  const state = {
    currentView: 'landing',
    userRole: null, // 'client' | 'admin' | null
    userEmail: '',
    carouselDot: 0,
    sites: [],
    bubbleFilter: 'top5',
    weights: {
      invSite: 1,
      patientPop: 1,
      facilities: 1,
      pharmacy: 1,
      labBiomarker: 1,
      safety: 1,
      regulatory: 1,
      dataTech: 1,
      budget: 1
    }
  };

  // 36 REAL-WORLD CLINICAL FEASIBILITY SITES SUBMITTED BY 6 TEAM MEMBERS ACROSS 6 CONTINENTS (RANDOMIZED SCORES & RANDOM DISPLAY ORDER)
  const DEFAULT_SEED_SITES_36 = [
    // --- TEAM MEMBER 1: Dr. Sarah Jenkins (Lead CRA) ---
    {
      id: 'site_na_01',
      name: 'MD Anderson Cancer Center',
      number: '101',
      country: 'United States (North America)',
      pi: 'Dr. Courtney Jones',
      status: 'not_approved',
      rate: 1.8,
      total: 18,
      weeks: 18,
      scores: { invSite: 52, patientPop: 48, facilities: 53, pharmacy: 50, labBiomarker: 49, safety: 54, regulatory: 45, dataTech: 51, budget: 48 },
      notes: 'Completed by Dr. Sarah Jenkins · NCI Comprehensive Cancer Center.'
    },
    {
      id: 'site_sa_01',
      name: 'Instituto do Câncer do Estado de São Paulo (ICESP)',
      number: '102',
      country: 'Brazil (South America)',
      pi: 'Dr. Carlos Henrique',
      status: 'approved',
      rate: 2.8,
      total: 28,
      weeks: 14,
      scores: { invSite: 80, patientPop: 76, facilities: 81, pharmacy: 78, labBiomarker: 77, safety: 82, regulatory: 73, dataTech: 79, budget: 76 },
      notes: 'Completed by Dr. Sarah Jenkins · Premier Latin American academic oncology facility.'
    },
    {
      id: 'site_eu_01',
      name: 'Gustave Roussy Cancer Campus',
      number: '103',
      country: 'France (Europe)',
      pi: 'Dr. Fabrice André',
      status: 'approved',
      rate: 3.8,
      total: 38,
      weeks: 11,
      scores: { invSite: 92, patientPop: 88, facilities: 93, pharmacy: 90, labBiomarker: 89, safety: 94, regulatory: 85, dataTech: 91, budget: 88 },
      notes: 'Completed by Dr. Sarah Jenkins · European flagship oncology research hospital.'
    },
    {
      id: 'site_as_01',
      name: 'National Cancer Center Hospital',
      number: '104',
      country: 'Japan (Asia)',
      pi: 'Dr. Kenji Tamura',
      status: 'not_approved',
      rate: 1.8,
      total: 18,
      weeks: 18,
      scores: { invSite: 56, patientPop: 52, facilities: 57, pharmacy: 54, labBiomarker: 53, safety: 58, regulatory: 49, dataTech: 55, budget: 52 },
      notes: 'Completed by Dr. Sarah Jenkins · Flagship Japanese cancer center.'
    },
    {
      id: 'site_af_01',
      name: 'Tygerberg Academic Hospital & Stellenbosch Oncology',
      number: '105',
      country: 'South Africa (Africa)',
      pi: 'Dr. Bernardo Leon',
      status: 'approved',
      rate: 4.0,
      total: 40,
      weeks: 10,
      scores: { invSite: 95, patientPop: 91, facilities: 96, pharmacy: 93, labBiomarker: 92, safety: 97, regulatory: 88, dataTech: 94, budget: 91 },
      notes: 'Completed by Dr. Sarah Jenkins · Western Cape reference center.'
    },
    {
      id: 'site_oc_01',
      name: 'Peter MacCallum Cancer Centre',
      number: '106',
      country: 'Australia (Oceania)',
      pi: 'Dr. Benjamin Solomon',
      status: 'not_approved',
      rate: 1.6,
      total: 16,
      weeks: 19,
      scores: { invSite: 49, patientPop: 45, facilities: 50, pharmacy: 47, labBiomarker: 46, safety: 51, regulatory: 42, dataTech: 48, budget: 45 },
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
      rate: 3.6,
      total: 36,
      weeks: 12,
      scores: { invSite: 91, patientPop: 87, facilities: 92, pharmacy: 89, labBiomarker: 88, safety: 93, regulatory: 84, dataTech: 90, budget: 87 },
      notes: 'Completed by Dr. Michael Vance · Exceptional retention rate and research pharmacy.'
    },
    {
      id: 'site_sa_02',
      name: 'A.C.Camargo Cancer Center',
      number: '202',
      country: 'Brazil (South America)',
      pi: 'Dr. Fernando de Vital',
      status: 'not_approved',
      rate: 2.0,
      total: 20,
      weeks: 16,
      scores: { invSite: 62, patientPop: 58, facilities: 63, pharmacy: 60, labBiomarker: 59, safety: 64, regulatory: 55, dataTech: 61, budget: 58 },
      notes: 'Completed by Dr. Michael Vance · Comprehensive treatment and research institute.'
    },
    {
      id: 'site_eu_02',
      name: 'The Royal Marsden NHS Foundation Trust',
      number: '203',
      country: 'United Kingdom (Europe)',
      pi: 'Dr. Johann de Bono',
      status: 'not_approved',
      rate: 1.9,
      total: 19,
      weeks: 17,
      scores: { invSite: 59, patientPop: 55, facilities: 60, pharmacy: 57, labBiomarker: 56, safety: 61, regulatory: 52, dataTech: 58, budget: 55 },
      notes: 'Completed by Dr. Michael Vance · Largest comprehensive cancer center in Europe.'
    },
    {
      id: 'site_as_02',
      name: 'Tata Memorial Hospital & Cancer Center',
      number: '204',
      country: 'India (Asia)',
      pi: 'Dr. Kumar Prabhash',
      status: 'not_approved',
      rate: 1.5,
      total: 15,
      weeks: 20,
      scores: { invSite: 46, patientPop: 42, facilities: 47, pharmacy: 44, labBiomarker: 43, safety: 48, regulatory: 39, dataTech: 45, budget: 42 },
      notes: 'Completed by Dr. Michael Vance · High patient volume center.'
    },
    {
      id: 'site_af_02',
      name: 'National Cancer Institute (NCI-Cairo)',
      number: '205',
      country: 'Egypt (Africa)',
      pi: 'Dr. Tarek Hashem',
      status: 'approved',
      rate: 3.0,
      total: 30,
      weeks: 13,
      scores: { invSite: 83, patientPop: 79, facilities: 84, pharmacy: 81, labBiomarker: 80, safety: 85, regulatory: 76, dataTech: 82, budget: 79 },
      notes: 'Completed by Dr. Michael Vance · Primary referral hub for North Africa.'
    },
    {
      id: 'site_oc_02',
      name: 'Royal Prince Alfred Hospital',
      number: '206',
      country: 'Australia (Oceania)',
      pi: 'Dr. Michael Boyer',
      status: 'conditional',
      rate: 2.4,
      total: 24,
      weeks: 15,
      scores: { invSite: 70, patientPop: 66, facilities: 71, pharmacy: 68, labBiomarker: 67, safety: 72, regulatory: 63, dataTech: 69, budget: 66 },
      notes: 'Completed by Dr. Michael Vance · Major academic teaching hospital.'
    },

    // --- TEAM MEMBER 3: Dr. Elena Rostova (Global Feasibility Specialist) ---
    {
      id: 'site_na_03',
      name: 'Dana-Farber Cancer Institute',
      number: '301',
      country: 'United States (North America)',
      pi: 'Dr. Marcus Sterling',
      status: 'approved',
      rate: 4.5,
      total: 50,
      weeks: 9,
      scores: { invSite: 98, patientPop: 94, facilities: 99, pharmacy: 96, labBiomarker: 95, safety: 99, regulatory: 91, dataTech: 97, budget: 95 },
      notes: 'Completed by Dr. Elena Rostova · Principal Harvard Medical School oncology partner.'
    },
    {
      id: 'site_sa_03',
      name: 'Instituto de Oncología Ángel H. Roffo',
      number: '302',
      country: 'Argentina (South America)',
      pi: 'Dr. Matías Chacón',
      status: 'not_approved',
      rate: 1.8,
      total: 18,
      weeks: 18,
      scores: { invSite: 54, patientPop: 50, facilities: 55, pharmacy: 52, labBiomarker: 51, safety: 56, regulatory: 47, dataTech: 53, budget: 50 },
      notes: 'Completed by Dr. Elena Rostova · Historic oncology institute in Buenos Aires.'
    },
    {
      id: 'site_eu_03',
      name: 'Netherlands Cancer Institute (NKI-AVL)',
      number: '303',
      country: 'Netherlands (Europe)',
      pi: 'Dr. Emile Voest',
      status: 'conditional',
      rate: 2.6,
      total: 26,
      weeks: 14,
      scores: { invSite: 75, patientPop: 71, facilities: 76, pharmacy: 73, labBiomarker: 72, safety: 77, regulatory: 68, dataTech: 74, budget: 71 },
      notes: 'Completed by Dr. Elena Rostova · European center for precision immuno-oncology trials.'
    },
    {
      id: 'site_as_03',
      name: 'Samsung Medical Center',
      number: '304',
      country: 'South Korea (Asia)',
      pi: 'Dr. Myung-Ju Ahn',
      status: 'approved',
      rate: 3.3,
      total: 33,
      weeks: 12,
      scores: { invSite: 87, patientPop: 83, facilities: 88, pharmacy: 85, labBiomarker: 84, safety: 89, regulatory: 80, dataTech: 86, budget: 83 },
      notes: 'Completed by Dr. Elena Rostova · Advanced digital medical record infrastructure.'
    },
    {
      id: 'site_af_03',
      name: 'Aga Khan University Hospital',
      number: '305',
      country: 'Kenya (Africa)',
      pi: 'Dr. Mansoor Saleh',
      status: 'conditional',
      rate: 2.3,
      total: 23,
      weeks: 16,
      scores: { invSite: 68, patientPop: 64, facilities: 69, pharmacy: 66, labBiomarker: 65, safety: 70, regulatory: 61, dataTech: 67, budget: 64 },
      notes: 'Completed by Dr. Elena Rostova · JCI-accredited tertiary medical facility in Nairobi.'
    },
    {
      id: 'site_oc_03',
      name: "Chris O'Brien Lifehouse",
      number: '306',
      country: 'Australia (Oceania)',
      pi: 'Dr. Michael Chao',
      status: 'approved',
      rate: 2.9,
      total: 29,
      weeks: 13,
      scores: { invSite: 81, patientPop: 77, facilities: 82, pharmacy: 79, labBiomarker: 78, safety: 83, regulatory: 74, dataTech: 80, budget: 77 },
      notes: 'Completed by Dr. Elena Rostova · Comprehensive cancer treatment hospital in Sydney.'
    },

    // --- TEAM MEMBER 4: Dr. Rajiv Patel (Clinical Operations Lead) ---
    {
      id: 'site_na_04',
      name: 'Johns Hopkins Sidney Kimmel Cancer Center',
      number: '401',
      country: 'United States (North America)',
      pi: 'Dr. Rachel Vance',
      status: 'not_approved',
      rate: 2.0,
      total: 20,
      weeks: 17,
      scores: { invSite: 60, patientPop: 56, facilities: 61, pharmacy: 58, labBiomarker: 57, safety: 62, regulatory: 53, dataTech: 59, budget: 56 },
      notes: 'Completed by Dr. Rajiv Patel · World-class translational oncology clinical trial center.'
    },
    {
      id: 'site_sa_04',
      name: 'Fundación Valle del Lili',
      number: '402',
      country: 'Colombia (South America)',
      pi: 'Dr. Luis Eduardo Pino',
      status: 'approved',
      rate: 3.7,
      total: 37,
      weeks: 11,
      scores: { invSite: 93, patientPop: 89, facilities: 94, pharmacy: 91, labBiomarker: 90, safety: 95, regulatory: 86, dataTech: 92, budget: 89 },
      notes: 'Completed by Dr. Rajiv Patel · Premier Colombian university hospital.'
    },
    {
      id: 'site_eu_04',
      name: 'Charité Universitätsmedizin Berlin',
      number: '403',
      country: 'Germany (Europe)',
      pi: 'Dr. Ulrich Keilholz',
      status: 'not_approved',
      rate: 1.5,
      total: 15,
      weeks: 20,
      scores: { invSite: 48, patientPop: 44, facilities: 49, pharmacy: 46, labBiomarker: 45, safety: 50, regulatory: 41, dataTech: 47, budget: 44 },
      notes: 'Completed by Dr. Rajiv Patel · Central European university medical center.'
    },
    {
      id: 'site_as_04',
      name: 'National University Cancer Institute (NCIS)',
      number: '404',
      country: 'Singapore (Asia)',
      pi: 'Dr. Ross Soo',
      status: 'conditional',
      rate: 2.2,
      total: 22,
      weeks: 16,
      scores: { invSite: 66, patientPop: 62, facilities: 67, pharmacy: 64, labBiomarker: 63, safety: 68, regulatory: 59, dataTech: 65, budget: 62 },
      notes: 'Completed by Dr. Rajiv Patel · Leading Southeast Asian academic research site.'
    },
    {
      id: 'site_af_04',
      name: 'Groote Schuur Hospital Oncology Department',
      number: '405',
      country: 'South Africa (Africa)',
      pi: 'Dr. Jeannette Parkes',
      status: 'approved',
      rate: 3.1,
      total: 31,
      weeks: 13,
      scores: { invSite: 85, patientPop: 81, facilities: 86, pharmacy: 83, labBiomarker: 82, safety: 87, regulatory: 78, dataTech: 84, budget: 81 },
      notes: 'Completed by Dr. Rajiv Patel · Key teaching hospital affiliated with Univ of Cape Town.'
    },
    {
      id: 'site_oc_04',
      name: 'Olivia Newton-John Cancer Research Institute',
      number: '406',
      country: 'Australia (Oceania)',
      pi: 'Dr. Andrew Scott',
      status: 'conditional',
      rate: 2.5,
      total: 25,
      weeks: 15,
      scores: { invSite: 72, patientPop: 68, facilities: 73, pharmacy: 70, labBiomarker: 69, safety: 74, regulatory: 65, dataTech: 71, budget: 68 },
      notes: 'Completed by Dr. Rajiv Patel · Advanced trial facility in Heidelberg, Victoria.'
    },

    // --- TEAM MEMBER 5: Dr. Sophia Al-Mansoor (Global Site Manager) ---
    {
      id: 'site_na_05',
      name: 'Mayo Clinic Cancer Center',
      number: '501',
      country: 'United States (North America)',
      pi: 'Dr. Eleanor Brooks',
      status: 'approved',
      rate: 3.5,
      total: 35,
      weeks: 12,
      scores: { invSite: 89, patientPop: 85, facilities: 90, pharmacy: 87, labBiomarker: 86, safety: 91, regulatory: 82, dataTech: 88, budget: 85 },
      notes: 'Completed by Dr. Sophia Al-Mansoor · NCI Comprehensive Cancer Center.'
    },
    {
      id: 'site_sa_05',
      name: 'Instituto Nacional de Cáncer (INCAN)',
      number: '502',
      country: 'Chile (South America)',
      pi: 'Dr. Jorge Madrid',
      status: 'not_approved',
      rate: 1.9,
      total: 19,
      weeks: 17,
      scores: { invSite: 58, patientPop: 54, facilities: 59, pharmacy: 56, labBiomarker: 55, safety: 60, regulatory: 51, dataTech: 57, budget: 54 },
      notes: 'Completed by Dr. Sophia Al-Mansoor · National reference hospital for oncology in Santiago.'
    },
    {
      id: 'site_eu_05',
      name: 'European Institute of Oncology (IEO)',
      number: '503',
      country: 'Italy (Europe)',
      pi: 'Dr. Giuseppe Curigliano',
      status: 'approved',
      rate: 2.8,
      total: 28,
      weeks: 14,
      scores: { invSite: 78, patientPop: 74, facilities: 79, pharmacy: 76, labBiomarker: 75, safety: 80, regulatory: 71, dataTech: 77, budget: 74 },
      notes: 'Completed by Dr. Sophia Al-Mansoor · Specialized non-profit cancer institute in Milan.'
    },
    {
      id: 'site_as_05',
      name: 'Sun Yat-sen University Cancer Center',
      number: '504',
      country: 'China (Asia)',
      pi: 'Dr. Yi-Long Wu',
      status: 'approved',
      rate: 3.6,
      total: 36,
      weeks: 12,
      scores: { invSite: 90, patientPop: 86, facilities: 91, pharmacy: 88, labBiomarker: 87, safety: 92, regulatory: 83, dataTech: 89, budget: 86 },
      notes: 'Completed by Dr. Sophia Al-Mansoor · Massive capacity East Asian Phase III trial hub.'
    },
    {
      id: 'site_af_05',
      name: 'Salah Azaïz Institute of Oncology',
      number: '505',
      country: 'Tunisia (Africa)',
      pi: 'Dr. Chiraz Nasr',
      status: 'not_approved',
      rate: 1.7,
      total: 17,
      weeks: 18,
      scores: { invSite: 55, patientPop: 51, facilities: 56, pharmacy: 53, labBiomarker: 52, safety: 57, regulatory: 48, dataTech: 54, budget: 51 },
      notes: 'Completed by Dr. Sophia Al-Mansoor · Requires local laboratory equipment upgrade.'
    },
    {
      id: 'site_oc_05',
      name: 'Auckland City Hospital Oncology Centre',
      number: '506',
      country: 'New Zealand (Oceania)',
      pi: 'Dr. Mark McKeage',
      status: 'approved',
      rate: 3.0,
      total: 30,
      weeks: 13,
      scores: { invSite: 84, patientPop: 80, facilities: 85, pharmacy: 82, labBiomarker: 81, safety: 86, regulatory: 77, dataTech: 83, budget: 80 },
      notes: 'Completed by Dr. Sophia Al-Mansoor · Primary tertiary cancer hospital in Auckland.'
    },

    // --- TEAM MEMBER 6: Dr. David Lin (Principal Medical Monitor) ---
    {
      id: 'site_na_06',
      name: 'UCSF Helen Diller Family Comprehensive Cancer Center',
      number: '601',
      country: 'United States (North America)',
      pi: 'Dr. David Lin',
      status: 'conditional',
      rate: 2.3,
      total: 23,
      weeks: 15,
      scores: { invSite: 71, patientPop: 67, facilities: 72, pharmacy: 69, labBiomarker: 68, safety: 73, regulatory: 64, dataTech: 70, budget: 67 },
      notes: 'Completed by Dr. David Lin · West Coast NCI Comprehensive Cancer Center.'
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
      weeks: 14,
      scores: { invSite: 73, patientPop: 69, facilities: 74, pharmacy: 71, labBiomarker: 70, safety: 75, regulatory: 66, dataTech: 72, budget: 69 },
      notes: 'Completed by Dr. David Lin · Primary cancer reference center in Lima, Peru.'
    },
    {
      id: 'site_eu_06',
      name: "Vall d'Hebron Institute of Oncology (VHIO)",
      number: '603',
      country: 'Spain (Europe)',
      pi: 'Dr. Josep Tabernero',
      status: 'approved',
      rate: 4.1,
      total: 41,
      weeks: 10,
      scores: { invSite: 96, patientPop: 92, facilities: 97, pharmacy: 94, labBiomarker: 93, safety: 98, regulatory: 89, dataTech: 95, budget: 92 },
      notes: 'Completed by Dr. David Lin · Leading Mediterranean early & late phase trial institution.'
    },
    {
      id: 'site_as_06',
      name: 'Fudan University Shanghai Cancer Center',
      number: '604',
      country: 'China (Asia)',
      pi: 'Dr. Jin Li',
      status: 'not_approved',
      rate: 1.6,
      total: 16,
      weeks: 19,
      scores: { invSite: 51, patientPop: 47, facilities: 52, pharmacy: 49, labBiomarker: 48, safety: 53, regulatory: 44, dataTech: 50, budget: 47 },
      notes: 'Completed by Dr. David Lin · Top-tier Shanghai academic oncology clinical trial site.'
    },
    {
      id: 'site_af_06',
      name: 'Hôpital Aristide Le Dantec Oncology Unit',
      number: '605',
      country: 'Senegal (Africa)',
      pi: 'Dr. Macoumba Gaye',
      status: 'conditional',
      rate: 2.1,
      total: 21,
      weeks: 16,
      scores: { invSite: 64, patientPop: 60, facilities: 65, pharmacy: 62, labBiomarker: 61, safety: 66, regulatory: 57, dataTech: 63, budget: 60 },
      notes: 'Completed by Dr. David Lin · West African unit requiring ultralow freezer infrastructure.'
    },
    {
      id: 'site_oc_06',
      name: 'Fiona Stanley Hospital Cancer Centre',
      number: '606',
      country: 'Australia (Oceania)',
      pi: 'Dr. Millward Michael',
      status: 'approved',
      rate: 2.7,
      total: 27,
      weeks: 14,
      scores: { invSite: 77, patientPop: 73, facilities: 78, pharmacy: 75, labBiomarker: 74, safety: 79, regulatory: 70, dataTech: 76, budget: 73 },
      notes: 'Completed by Dr. David Lin · Key tertiary oncology center in Perth, Australia.'
    }
  ];

  const CATEGORIES = [
    { key: 'invSite', label: 'Investigator & Site', short: 'Invest.' },
    { key: 'patientPop', label: 'Patient Population & Accrual', short: 'Accrual' },
    { key: 'facilities', label: 'Facilities & Equipment', short: 'Facility' },
    { key: 'pharmacy', label: 'Pharmacy & IP', short: 'Pharmacy' },
    { key: 'labBiomarker', label: 'Lab & Biomarkers', short: 'Lab/Bx' },
    { key: 'safety', label: 'Safety & Toxicity Readiness', short: 'Safety' },
    { key: 'regulatory', label: 'Regulatory & Experience', short: 'Regulat.' },
    { key: 'dataTech', label: 'Data & Technology', short: 'Data' },
    { key: 'budget', label: 'Budget & Start-up', short: 'Budget' }
  ];

  const STATUSES = [
    { key: 'approved', label: 'Approved' },
    { key: 'conditional', label: 'Conditional' },
    { key: 'pending', label: 'Pending review' },
    { key: 'not_approved', label: 'Not approved' }
  ];

  const STATUS_COLOR = { approved: '#0B6E6E', conditional: '#B8842E', pending: '#7E8C9F', not_approved: '#B23A3A' };
  const SITE_COLORS = ['#0B6E6E', '#B8842E', '#0284c7', '#8b5cf6', '#10b981', '#B23A3A', '#3D5A80'];

  function showToast(msg) {
    const t = document.getElementById('toastMsg') || document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }

  // 240HZ ULTRA-FLUID HIGH REFRESH RATE CANVAS ANIMATION ENGINE
  function initPharmaCanvas() {
    const canvas = document.getElementById('smokeCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const ambientParticles = [];
    const cursorWaves = [];
    const maxAmbient = 60;

    for (let i = 0; i < maxAmbient; i++) {
      ambientParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        radius: Math.random() * 3.5 + 1.2,
        alpha: Math.random() * 0.5 + 0.15,
        color: Math.random() > 0.5 ? '11, 110, 110' : '2, 132, 199'
      });
    }

    let lastMouseX = 0, lastMouseY = 0;
    window.addEventListener('mousemove', (e) => {
      if (state.currentView !== 'landing') return;

      const dist = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
      if (dist > 8) {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        cursorWaves.push({
          x: e.clientX,
          y: e.clientY,
          radius: 4,
          maxRadius: Math.random() * 30 + 40,
          alpha: 0.85,
          color: Math.random() > 0.5 ? '11, 110, 110' : '184, 132, 46',
          lineWidth: Math.random() * 2.2 + 1.4
        });
      }
    });

    let lastTime = performance.now();

    function render(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.016);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      if (state.currentView === 'landing') {
        for (let i = 0; i < ambientParticles.length; i++) {
          const p = ambientParticles[i];
          p.x += p.vx * (dt * 120);
          p.y += p.vy * (dt * 120);

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          for (let j = i + 1; j < ambientParticles.length; j++) {
            const p2 = ambientParticles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const d = Math.sqrt(dx * dx + dy * dy);

            if (d < 110) {
              ctx.strokeStyle = `rgba(${p.color}, ${(1 - d / 110) * 0.14})`;
              ctx.lineWidth = 0.9;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }

        for (let i = cursorWaves.length - 1; i >= 0; i--) {
          const w = cursorWaves[i];
          w.radius += 1.8 * (dt * 120);
          w.alpha -= 0.02 * (dt * 120);

          if (w.alpha <= 0 || w.radius >= w.maxRadius) {
            cursorWaves.splice(i, 1);
            continue;
          }

          ctx.strokeStyle = `rgba(${w.color}, ${w.alpha})`;
          ctx.lineWidth = w.lineWidth;
          ctx.beginPath();
          ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  // -------------------------------------------------------------------------
  // APPLICATION CONTROLLER
  // -------------------------------------------------------------------------
  window.app = {
    init() {
      const savedRole = sessionStorage.getItem('clinovo_session_role');
      const savedView = sessionStorage.getItem('clinovo_current_view');
      const savedEmail = sessionStorage.getItem('clinovo_session_email');

      if (savedRole && savedView && savedView !== 'landing') {
        state.userRole = savedRole;
        state.userEmail = savedEmail || (savedRole === 'admin' ? 'name@admin.in' : 'name@client.in');
        let tv = savedView;
        if (savedRole === 'client' && savedView === 'dashboard') {
          tv = 'questionnaire';
          sessionStorage.setItem('clinovo_current_view', 'questionnaire');
        }
        window.app.navigateTo(tv);
      } else {
        document.body.classList.add('landing-active');
        window.app.activateSection('landing');
        window.app.updateUserNav();
        try { dashApp.fetchSites(); } catch(e) {}
      }

      window.app.startDotCarousel();
      initPharmaCanvas();
    },

    activateSection(viewId) {
      document.querySelectorAll('.view-section').forEach(sec => {
        sec.classList.remove('active-view');
        sec.style.removeProperty('display');
      });
      const target = document.getElementById('view-' + viewId);
      if (target) target.classList.add('active-view');
    },

    navigateTo(viewId) {
      state.currentView = viewId;
      sessionStorage.setItem('clinovo_current_view', viewId);

      if (viewId === 'dashboard') {
        state.userRole = 'admin';
        state.userEmail = state.userEmail || 'name@admin.in';
        sessionStorage.setItem('clinovo_session_role', 'admin');
        sessionStorage.setItem('clinovo_session_email', state.userEmail);
        document.body.classList.remove('landing-active');
        window.app.activateSection('dashboard');
        window.app.updateUserNav();
        try { dashApp.fetchSites(); dashApp.startAutoPoll(); } catch(e) { console.error(e); }

      } else if (viewId === 'questionnaire') {
        state.userRole = state.userRole || 'client';
        state.userEmail = state.userEmail || 'name@client.in';
        sessionStorage.setItem('clinovo_session_role', state.userRole);
        sessionStorage.setItem('clinovo_session_email', state.userEmail);
        document.body.classList.remove('landing-active');
        window.app.activateSection('questionnaire');
        window.app.updateUserNav();
        try { dashApp.stopAutoPoll(); questApp.renderAll(); } catch(e) { console.error(e); }

      } else {
        state.userRole = null;
        state.userEmail = '';
        document.body.classList.add('landing-active');
        window.app.activateSection('landing');
        window.app.updateUserNav();
        try { dashApp.stopAutoPoll(); } catch(e) {}
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    handleSignIn(event) {
      if (event && event.preventDefault) event.preventDefault();
      if (event && event.stopPropagation) event.stopPropagation();

      const usernameInput = document.getElementById('usernameInput');
      const usernameVal = usernameInput ? usernameInput.value.toLowerCase().trim() : '';

      const isAdmin = usernameVal.includes('admin');
      const targetRole = isAdmin ? 'admin' : 'client';
      const targetEmail = usernameVal || (isAdmin ? 'name@admin.in' : 'name@client.in');
      const targetView  = isAdmin ? 'dashboard' : 'questionnaire';

      state.userRole  = targetRole;
      state.userEmail = targetEmail;
      sessionStorage.setItem('clinovo_session_role',    targetRole);
      sessionStorage.setItem('clinovo_session_email',   targetEmail);
      sessionStorage.setItem('clinovo_current_view',    targetView);

      showToast('Signed in as ' + (isAdmin ? 'Admin' : 'Client') + '!');
      window.app.navigateTo(targetView);
      return false;
    },

    logout() {
      state.userRole  = null;
      state.userEmail = '';
      sessionStorage.removeItem('clinovo_session_role');
      sessionStorage.removeItem('clinovo_session_email');
      sessionStorage.removeItem('clinovo_current_view');
      try { dashApp.stopAutoPoll(); } catch(e) {}
      showToast('Signed out');
      window.app.navigateTo('landing');
    },

    togglePasswordVisibility() {
      const passInput = document.getElementById('passwordInput');
      const eyeIcon   = document.getElementById('togglePasswordBtn');
      if (!passInput || !eyeIcon) return;
      if (passInput.type === 'password') {
        passInput.type = 'text';
        eyeIcon.className = 'fa-solid fa-eye-slash password-eye-icon';
      } else {
        passInput.type = 'password';
        eyeIcon.className = 'fa-solid fa-eye password-eye-icon';
      }
    },

    quickLogin(role) {
      const userInp = document.getElementById('usernameInput');
      const passInp = document.getElementById('passwordInput');
      if (role === 'admin') {
        if (userInp) userInp.value = 'name@admin.in';
        if (passInp) passInp.value = 'password123';
      } else {
        if (userInp) userInp.value = 'name@client.in';
        if (passInp) passInp.value = 'password123';
      }
      window.app.handleSignIn();
    },

    showPharmaLoader(callback) {
      if (typeof callback === 'function') callback();
    },

    updateUserNav() {
      const container = document.getElementById('userNavActions');
      if (!container) return;
      container.innerHTML = state.userRole ? `
        <button class="btn-logout-exact" onclick="window.app.logout()">
          <i class="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      ` : '';
    },

    startDotCarousel() {
      setInterval(() => {
        state.carouselDot = (state.carouselDot + 1) % 4;
        window.app.setDot(state.carouselDot);
      }, 3500);
    },

    setDot(idx) {
      state.carouselDot = idx;
      document.querySelectorAll('#carouselDots .dot-item').forEach((dot, i) => {
        dot.classList.toggle('active', i === idx);
      });
    }
  };

  // -------------------------------------------------------------------------
  // 2. CLIENT QUESTIONNAIRE MODULE
  // -------------------------------------------------------------------------
  const SECTIONS = [
    {
      id: 'sec01', num: '01', title: 'Study Information', kicker: 'Header',
      desc: 'Core protocol identifiers for this feasibility record.',
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
      id: 'sec02', num: '02', title: 'Site & Investigator', kicker: 'Section 1',
      desc: 'Institution, PI, and study team qualifications.',
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
      id: 'sec03', num: '03', title: 'Tumor Board', kicker: 'Section 1.2',
      desc: 'Multidisciplinary tumor board (MDT) infrastructure.',
      fields: [
        { id: 'q_mdtHeld', type: 'yesno', label: 'Does the site hold a regular multidisciplinary tumor board (surgical, medical, radiation oncology, pathology, radiology)?', hint: 'state frequency in comment' },
        { id: 'q_mdtPI', type: 'yesno', label: 'Is the PI or a sub-investigator a regular, active participant in the tumor board?' },
        { id: 'q_mdtProcess', type: 'yesno', label: 'Is there a documented process for identifying trial-eligible patients at tumor board?' }
      ]
    },
    {
      id: 'sec04', num: '04', title: 'Patient Population', kicker: 'Section 2',
      desc: 'Accrual potential against the fixed comparator arm.',
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
      id: 'sec05', num: '05', title: 'Facilities & Equipment', kicker: 'Section 3',
      desc: 'Physical infrastructure to support trial conduct.',
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
      id: 'sec06', num: '06', title: 'Pharmacy & IP', kicker: 'Section 4',
      desc: 'Investigational product handling and hazardous-drug safety.',
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
      id: 'sec07', num: '07', title: 'Lab, Pathology & Biomarkers', kicker: 'Section 5',
      desc: 'Testing, tissue access, and specimen logistics.',
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
      id: 'sec08', num: '08', title: 'Safety & Toxicity', kicker: 'Section 5A',
      desc: 'Adverse event management and response assessment.',
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
      id: 'sec09', num: '09', title: 'Regulatory & Experience', kicker: 'Section 6',
      desc: 'Ethics oversight and prior trial track record.',
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
      id: 'sec10', num: '10', title: 'Data Management & Technology', kicker: 'Section 7',
      desc: 'EDC, ePRO, and technical readiness.',
      fields: [
        { id: 'q_edc', type: 'yesno', label: 'Does the site have prior experience with electronic data capture (EDC) systems?' },
        { id: 'q_epro', type: 'yesno', label: 'Does the site have experience with ePRO or wearable devices, if required?' },
        { id: 'q_ehr', type: 'yesno', label: 'Is the EHR system compatible with source-data verification requirements?' },
        { id: 'q_itSupport', type: 'yesno', label: 'Does the site have IT support available for study-related technology issues?' },
        { id: 'q_part11', type: 'yesno', label: 'Are validated / 21 CFR Part 11-compliant computer systems used for study data?' }
      ]
    },
    {
      id: 'sec11', num: '11', title: 'Budget, Contracts & Timelines', kicker: 'Section 8',
      desc: 'Administrative readiness and start-up pace.',
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
      id: 'sec12', num: '12', title: 'Site Declaration', kicker: 'Section 9',
      desc: 'Sign-off and sponsor / CRO review outcome.',
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

  const questApp = {
    activeSection: 0,
    answers: {},
    storageKey: 'onc-phase3-sfq:answers-v1',

    renderAll() {
      this.loadAnswers();
      this.renderNav();
      this.renderOverall();
      this.renderContent();
    },

    loadAnswers() {
      try {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) this.answers = JSON.parse(saved);
        this.setStatus('Draft loaded');
      } catch (e) {
        this.setStatus('Starting a new draft');
      }
    },

    saveAnswers() {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.answers));
        this.setStatus('All changes saved · ' + new Date().toLocaleTimeString());
      } catch (e) {
        this.setStatus('Could not save draft');
      }
    },

    setStatus(text) {
      const el = document.getElementById('statusLine');
      if (el) el.textContent = text;
    },

    isAnswered(field, val) {
      if (!val) return false;
      if (field.type === 'yesno') return !!(val.v);
      if (field.type === 'multiselect') return Array.isArray(val) && val.length > 0;
      if (field.type === 'select') return !!val;
      if (field.type === 'text' || field.type === 'textarea') return String(val).trim().length > 0;
      return false;
    },

    fieldsOf(sec) {
      return sec.fields.filter(f => f.type !== 'divider');
    },

    sectionProgress(sec) {
      const fs = this.fieldsOf(sec);
      if (!fs.length) return { done: 0, total: 0, pct: 0 };
      let done = 0;
      fs.forEach(f => { if (this.isAnswered(f, this.answers[f.id])) done++; });
      return { done, total: fs.length, pct: Math.round((done / fs.length) * 100) };
    },

    overallProgress() {
      let done = 0, total = 0;
      SECTIONS.forEach(s => {
        const p = this.sectionProgress(s);
        done += p.done;
        total += p.total;
      });
      return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
    },

    ringSVG(pct, size, stroke, trackColor, fillColor) {
      const r = (size - stroke) / 2;
      const c = 2 * Math.PI * r;
      const offset = c * (1 - pct / 100);
      const cx = size / 2, cy = size / 2;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${trackColor}" stroke-width="${stroke}"/>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${fillColor}" stroke-width="${stroke}"
          stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${offset}"
          transform="rotate(-90 ${cx} ${cy})" style="transition:stroke-dashoffset .3s ease"/>`;
    },

    renderOverall() {
      const p = this.overallProgress();
      const ring = document.getElementById('overallRing');
      if (ring) ring.innerHTML = this.ringSVG(p.pct, 46, 5, 'rgba(255,255,255,0.15)', '#37B7B2');
      const pct = document.getElementById('overallPct');
      if (pct) pct.textContent = p.pct + '%';
      const cnt = document.getElementById('overallCnt');
      if (cnt) cnt.textContent = p.done + ' / ' + p.total + ' answered';
    },

    renderNav() {
      const nav = document.getElementById('navlist');
      if (!nav) return;
      nav.innerHTML = '';
      SECTIONS.forEach((s, i) => {
        const p = this.sectionProgress(s);
        const li = document.createElement('li');
        li.className = 'navitem' + (i === this.activeSection ? ' active' : '');
        li.innerHTML = `
          <span class="num">${s.num}</span>
          <span class="ttl">${s.title}</span>
          <svg class="mini-ring" width="20" height="20" viewBox="0 0 20 20">
            ${this.ringSVG(p.pct, 20, 3, 'rgba(255,255,255,0.15)', p.pct === 100 ? '#37B7B2' : '#C9A45C')}
          </svg>
        `;
        li.addEventListener('click', () => {
          this.activeSection = i;
          this.renderAll();
          window.scrollTo(0, 0);
          const c = document.getElementById('content');
          if (c) c.scrollIntoView({ block: 'start' });
        });
        nav.appendChild(li);
      });
    },

    renderContent() {
      const s = SECTIONS[this.activeSection];
      const c = document.getElementById('content');
      if (!c) return;

      const isFinal = this.activeSection === SECTIONS.length - 1;

      c.innerHTML = `
        <div class="section-head">
          <div class="kicker">${s.kicker} · ${s.num} / ${String(SECTIONS.length).padStart(2, '0')}</div>
          <h2>${s.title}</h2>
          <p>${s.desc}</p>
        </div>
        ${s.fields.map(f => this.fieldTemplate(f)).join('')}
        <div class="footer-nav">
          <button class="btn" id="footPrev">&larr; Previous section</button>
          <button class="btn primary ${isFinal ? 'btn-submit-exact' : ''}" id="footNext">${isFinal ? 'Submit' : 'Next section &rarr;'}</button>
        </div>
      `;

      this.bindFieldEvents();

      const prevBtnTop = document.getElementById('prevBtn');
      if (prevBtnTop) prevBtnTop.disabled = this.activeSection === 0;
      const nextBtnTop = document.getElementById('nextBtn');
      if (nextBtnTop) nextBtnTop.textContent = isFinal ? 'Finish ✓' : 'Next →';

      const footPrev = document.getElementById('footPrev');
      if (footPrev) {
        footPrev.disabled = this.activeSection === 0;
        footPrev.addEventListener('click', () => this.goPrev());
      }

      const footNext = document.getElementById('footNext');
      if (footNext) {
        footNext.addEventListener('click', () => this.goNext());
      }
    },

    fieldTemplate(f) {
      const val = this.answers[f.id];

      if (f.type === 'divider') {
        return `<div class="divider"><div class="dlabel">${f.label}</div></div>`;
      }

      let body = '';
      if (f.type === 'text') {
        body = `<input type="text" data-id="${f.id}" data-kind="text" value="${(val || '').replace(/"/g, '&quot;')}" placeholder="Type response…">`;
      } else if (f.type === 'textarea') {
        body = `<textarea data-id="${f.id}" data-kind="text" placeholder="Type response…">${val || ''}</textarea>`;
      } else if (f.type === 'yesno') {
        const v = (val && val.v) || '';
        const com = (val && val.c) || '';
        body = `
          <div class="yn-row">
            <button type="button" class="yn-btn yes ${v === 'yes' ? 'on' : ''}" data-id="${f.id}" data-set="yes">Yes</button>
            <button type="button" class="yn-btn no ${v === 'no' ? 'on' : ''}" data-id="${f.id}" data-set="no">No</button>
            <div class="yn-comment">
              <input type="text" data-id="${f.id}" data-kind="comment" value="${com.replace(/"/g, '&quot;')}" placeholder="Comment (optional)">
            </div>
          </div>
        `;
      } else if (f.type === 'multiselect') {
        const arr = Array.isArray(val) ? val : [];
        body = `<div class="pill-group">` + f.options.map(opt => `
          <button type="button" class="pill ${arr.includes(opt) ? 'on' : ''}" data-id="${f.id}" data-kind="multiselect" data-opt="${opt}">${opt}</button>
        `).join('') + `</div>`;
      } else if (f.type === 'select') {
        body = `<div class="pill-group">` + f.options.map(opt => `
          <button type="button" class="pill ${val === opt ? 'on' : ''}" data-id="${f.id}" data-kind="select" data-opt="${opt}">${opt}</button>
        `).join('') + `</div>`;
      }

      return `
        <div class="field">
          <div class="flabel">${f.label}</div>
          ${f.hint ? `<div class="fhint">${f.hint}</div>` : ''}
          <div class="fbody">${body}</div>
        </div>
      `;
    },

    bindFieldEvents() {
      document.querySelectorAll('[data-kind="text"]').forEach(el => {
        el.addEventListener('input', () => {
          this.answers[el.dataset.id] = el.value;
          this.saveAnswers();
          this.renderOverall();
          this.renderNav();
        });
      });
      document.querySelectorAll('.yn-btn').forEach(el => {
        el.addEventListener('click', () => {
          const id = el.dataset.id, setVal = el.dataset.set;
          const cur = this.answers[id] || { v: '', c: '' };
          cur.v = (cur.v === setVal) ? '' : setVal;
          this.answers[id] = cur;
          this.saveAnswers();
          this.renderContent();
          this.renderOverall();
          this.renderNav();
        });
      });
      document.querySelectorAll('[data-kind="comment"]').forEach(el => {
        el.addEventListener('input', () => {
          const id = el.dataset.id;
          const cur = this.answers[id] || { v: '', c: '' };
          cur.c = el.value;
          this.answers[id] = cur;
          this.saveAnswers();
        });
      });
      document.querySelectorAll('[data-kind="multiselect"]').forEach(el => {
        el.addEventListener('click', () => {
          const id = el.dataset.id, opt = el.dataset.opt;
          const arr = Array.isArray(this.answers[id]) ? this.answers[id].slice() : [];
          const idx = arr.indexOf(opt);
          if (idx >= 0) arr.splice(idx, 1); else arr.push(opt);
          this.answers[id] = arr;
          this.saveAnswers();
          this.renderContent();
          this.renderOverall();
          this.renderNav();
        });
      });
      document.querySelectorAll('[data-kind="select"]').forEach(el => {
        el.addEventListener('click', () => {
          const id = el.dataset.id, opt = el.dataset.opt;
          this.answers[id] = (this.answers[id] === opt) ? '' : opt;
          this.saveAnswers();
          this.renderContent();
          this.renderOverall();
          this.renderNav();
        });
      });
    },

    goPrev() {
      if (this.activeSection > 0) {
        this.activeSection--;
        this.renderAll();
        window.scrollTo(0, 0);
      }
    },

    goNext() {
      if (this.activeSection < SECTIONS.length - 1) {
        this.activeSection++;
        this.renderAll();
        window.scrollTo(0, 0);
      } else {
        this.submitToAdmin();
      }
    },

    resetAnswers() {
      if (!confirm('Clear all answers in this draft? This cannot be undone.')) return;
      this.answers = {};
      localStorage.removeItem(this.storageKey);
      this.renderAll();
      showToast('All answers cleared');
    },

    exportSummary() {
      const lines = [];
      lines.push('ONCOLOGY PHASE III — SITE FEASIBILITY QUESTIONNAIRE');
      lines.push('Generated ' + new Date().toLocaleString());
      lines.push('='.repeat(60));
      SECTIONS.forEach(s => {
        lines.push('');
        lines.push(s.num + '. ' + s.title.toUpperCase());
        lines.push('-'.repeat(40));
        this.fieldsOf(s).forEach(f => {
          const val = this.answers[f.id];
          let out = '(not answered)';
          if (f.type === 'text' || f.type === 'textarea') { if (val && String(val).trim()) out = String(val); }
          else if (f.type === 'yesno') { if (val && val.v) { out = val.v.toUpperCase() + (val.c ? ' — ' + val.c : ''); } }
          else if (f.type === 'multiselect') { if (val && val.length) out = val.join(', '); }
          else if (f.type === 'select') { if (val) out = val; }
          lines.push('Q: ' + f.label);
          lines.push('A: ' + out);
          lines.push('');
        });
      });

      const text = lines.join('\n');
      try {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'oncology-phase3-site-feasibility-summary.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Summary exported');
      } catch (e) {
        showToast('Could not export — try Print instead');
      }
    },

    async submitToAdmin() {
      const btn = document.getElementById('footNext');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting...`;
        btn.classList.add('submitting');
      }

      setTimeout(async () => {
        try {
          const res = await fetch('/api/questionnaire/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers: this.answers })
          });
          const data = await res.json();
          if (data.success) {
            this.handleSubmissionSuccess(data.overallScore, data.sites);
          } else {
            this.submitFallbackLocal();
          }
        } catch (err) {
          this.submitFallbackLocal();
        }
      }, 500);
    },

    handleSubmissionSuccess(overallScore, returnedSites) {
      const btn = document.getElementById('footNext');
      if (btn) {
        btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Submitted ✓`;
        btn.classList.remove('submitting');
        btn.classList.add('submitted-success');
      }

      showToast(`Submitted Successfully! Overall Score: ${overallScore}/100`);

      if (Array.isArray(returnedSites) && returnedSites.length > 0) {
        state.sites = returnedSites;
        localStorage.setItem('onc-phase3-sfq:site-dashboard-v1', JSON.stringify({ sites: returnedSites, weights: state.weights }));
        localStorage.setItem('clinovo_sites_fallback', JSON.stringify(returnedSites));
      }

      setTimeout(() => {
        this.answers = {};
        localStorage.removeItem(this.storageKey);
        this.activeSection = 0;
        this.renderAll();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1800);
    },

    submitFallbackLocal() {
      const siteName = this.answers['siteName'] || this.answers['institution'] || ('Submitted Site #' + Math.floor(100 + Math.random() * 900));
      const siteNumber = this.answers['siteNumber'] || String(Math.floor(100 + Math.random() * 900));
      const country = this.answers['country'] || 'United States';
      const pi = this.answers['piName'] || 'Dr. Investigator';

      const scores = {
        invSite: this.calcDomain(['q_gcpPI', 'q_gcpStaff', 'q_cv', 'q_delegation', 'q_dedicated']),
        patientPop: this.calcDomain(['q_referral', 'q_reflex', 'q_diverse', 'q_realistic', 'q_soc', 'q_survival']),
        facilities: this.calcDomain(['q_consent', 'q_infusion', 'q_crash', 'q_admit', 'q_radTx', 'q_ipStorage', 'q_backupPower', 'q_secureStorage', 'q_centrifuge', 'q_imaging', 'q_radiologist', 'q_freezer', 'q_internet']),
        pharmacy: this.calcDomain(['q_hazPharmacy', 'q_bsc', 'q_ipAccountability', 'q_unblinding', 'q_bsaDosing', 'q_tempExcursion', 'q_compounding', 'q_usp800']),
        labBiomarker: this.calcDomain(['q_labAccred', 'q_tissueAccess', 'q_cdx', 'q_researchBiopsy', 'q_shipping', 'q_courier']),
        safety: this.calcDomain(['q_ctcae', 'q_escalation', 'q_oncall', 'q_specialists', 'q_recist', 'q_saeReporting', 'q_dsmb']),
        regulatory: 80,
        dataTech: this.calcDomain(['q_edc', 'q_epro', 'q_ehr', 'q_itSupport', 'q_part11']),
        budget: this.calcDomain(['q_timelines'])
      };

      const keys = Object.keys(scores);
      const overallScore = Math.round(keys.reduce((a, k) => a + scores[k], 0) / keys.length);
      const status = overallScore >= 80 ? 'approved' : (overallScore >= 65 ? 'conditional' : 'not_approved');

      const newSite = {
        id: 's_' + Date.now(),
        name: siteName,
        number: siteNumber,
        country: country,
        pi: pi,
        status: status,
        rate: parseFloat(this.answers['enrollRate']) || 3.0,
        total: parseInt(this.answers['totalEnroll'], 10) || 30,
        weeks: parseInt(this.answers['sivToFPI'], 10) || 12,
        scores: scores,
        notes: 'Submitted via Client Site Feasibility Portal'
      };

      let existing = state.sites.slice();
      if (!existing.length) {
        existing = DEFAULT_SEED_SITES_36.slice();
      }
      existing.unshift(newSite);

      localStorage.setItem('onc-phase3-sfq:site-dashboard-v1', JSON.stringify({ sites: existing, weights: state.weights }));
      localStorage.setItem('clinovo_sites_fallback', JSON.stringify(existing));

      this.handleSubmissionSuccess(overallScore, existing);
    },

    calcDomain(qIds) {
      if (!qIds.length) return 75;
      let earned = 0;
      qIds.forEach(id => {
        const a = this.answers[id];
        if (a && a.v === 'yes') earned++;
      });
      return Math.round((earned / qIds.length) * 100);
    }
  };

  // -------------------------------------------------------------------------
  // 3. ADMIN FEASIBILITY DASHBOARD MODULE (REAL CLINICAL SITES + SEED PERSISTENCE)
  // -------------------------------------------------------------------------
  const dashApp = {
    radarSelected: new Set(),
    sortKey: null,
    sortAsc: false,
    rankFilter: 'top10', // 'top10' | 'top20' | 'allRanked' | 'raw'
    selectedSection: 'sec01',
    editingId: null,
    pollTimer: null,

    setRankFilter(mode) {
      this.rankFilter = mode;
      document.querySelectorAll('#rankFilterPills .rank-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
      });
      this.renderRank();
    },

    getSectionScore(site, secId) {
      if (!site || !site.scores) return 0;
      const s = site.scores;
      switch (secId) {
        case 'sec01': return s.invSite || 85;
        case 'sec02': return s.invSite || 0;
        case 'sec03': return Math.round(((s.invSite || 0) + (s.patientPop || 0)) / 2);
        case 'sec04': return s.patientPop || 0;
        case 'sec05': return s.facilities || 0;
        case 'sec06': return s.pharmacy || 0;
        case 'sec07': return s.labBiomarker || 0;
        case 'sec08': return s.safety || 0;
        case 'sec09': return s.regulatory || 0;
        case 'sec10': return s.dataTech || 0;
        case 'sec11': return s.budget || 0;
        case 'sec12': return this.overallScore(site);
        default: return this.overallScore(site);
      }
    },

    SECTION_META: {
      sec01: { title: 'Section 01 · Study Information', desc: 'Core protocol identifiers and feasibility draft details for this assessment.' },
      sec02: { title: 'Section 02 · Site & Investigator', desc: 'GCP certifications, CVs, delegation logs, and dedicated oncology research staff.' },
      sec03: { title: 'Section 03 · Tumor Board', desc: 'Multidisciplinary Tumor Board (MDT) frequency and study protocol reviews.' },
      sec04: { title: 'Section 04 · Patient Population', desc: 'Referral network, biomarker testing, diverse recruitment, SOC, and 1-yr survival.' },
      sec05: { title: 'Section 05 · Facilities & Equipment', desc: 'Infusion chairs, ICU crash cart, CT/MRI imaging, -80°C freezers, and centrifuges.' },
      sec06: { title: 'Section 06 · Pharmacy & IP', desc: 'Class II BSC, investigational product storage, BSA dosing, and temp excursion tracking.' },
      sec07: { title: 'Section 07 · Lab, Pathology & Biomarkers', desc: 'CAP/CLIA accreditation, tissue biopsy access, companion diagnostics, and cold shipping.' },
      sec08: { title: 'Section 08 · Safety & Toxicity', desc: 'CTCAE grading, toxicity escalation protocols, 24/7 coverage, and RECIST v1.1.' },
      sec09: { title: 'Section 09 · Regulatory & Experience', desc: 'IRB turnaround timelines, CTA negotiation pace, and prior Phase III oncology trials.' },
      sec10: { title: 'Section 10 · Data Management & Technology', desc: 'EDC, ePRO, EHR access, and 21 CFR Part 11 compliant computer systems.' },
      sec11: { title: 'Section 11 · Budget, Contracts & Timelines', desc: 'Contract negotiation departmental responsibility, indirect overhead, and start-up TAT.' },
      sec12: { title: 'Section 12 · Site Declaration', desc: 'PI sign-off and sponsor / CRO review approval outcome.' }
    },

    renderSectionTop5(secId) {
      if (secId) this.selectedSection = secId;
      const currentSec = this.selectedSection || 'sec01';

      const selectEl = document.getElementById('sectionSelect');
      if (selectEl && selectEl.value !== currentSec) {
        selectEl.value = currentSec;
      }

      // Calculate dynamic 36-site analytical stats for this section
      const allScored = state.sites
        .map(site => ({ site, score: this.getSectionScore(site, currentSec) }))
        .sort((a, b) => b.score - a.score);

      const top5 = allScored.slice(0, 5);
      const topSite = top5[0] ? top5[0] : { site: { name: 'None' }, score: 0 };
      const totalCount = allScored.length;
      const avgScore = totalCount ? Math.round(allScored.reduce((sum, item) => sum + item.score, 0) / totalCount) : 0;
      const top5Avg = top5.length ? Math.round(top5.reduce((sum, item) => sum + item.score, 0) / top5.length) : 0;
      const passCount = allScored.filter(item => item.score >= 80).length;

      // -----------------------------------------------
      // SECTION DETAILS BOX — larger, more prominent
      // -----------------------------------------------
      const detailsEl = document.getElementById('sectionDetailsBox');
      const meta = this.SECTION_META[currentSec] || this.SECTION_META['sec01'];
      if (detailsEl) {
        detailsEl.innerHTML = `
          <div class="analysis-badge-header">
            <span class="analysis-tag">36-Site Dataset Analysis</span>
            <span class="analysis-top-performer">Top #1: ${topSite.site.name.split(' ').slice(0, 3).join(' ')} (${topSite.score}%)</span>
          </div>
          <div class="section-details-title" style="font-size:15px; font-weight:700; color:#16233D; margin:6px 0 4px;">${meta.title}</div>
          <div class="section-details-desc" style="font-size:13px; color:#4B5563; line-height:1.55;">${meta.desc}</div>
          <div class="analysis-stats-row" style="margin-top:10px; display:flex; gap:16px; flex-wrap:wrap;">
            <div class="astat" style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:6px 12px;">
              <span class="astat-lbl" style="font-size:11px; color:#16a34a; font-weight:600;">TOP 5 AVG</span>
              <div class="astat-val" style="font-size:20px; font-weight:800; color:#15803d;">${top5Avg}%</div>
            </div>
            <div class="astat" style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:6px 12px;">
              <span class="astat-lbl" style="font-size:11px; color:#2563eb; font-weight:600;">OVERALL AVG</span>
              <div class="astat-val" style="font-size:20px; font-weight:800; color:#1d4ed8;">${avgScore}%</div>
            </div>
            <div class="astat" style="background:#fefce8; border:1px solid #fde68a; border-radius:8px; padding:6px 12px;">
              <span class="astat-lbl" style="font-size:11px; color:#d97706; font-weight:600;">QUALIFIED ≥80%</span>
              <div class="astat-val" style="font-size:20px; font-weight:800; color:#b45309;">${passCount}/${totalCount}</div>
            </div>
          </div>
        `;
      }

      // -----------------------------------------------
      // BEAUTIFUL HTML BAR CHART
      // -----------------------------------------------
      const barsContainer = document.getElementById('sectionTop5Bars');
      if (!barsContainer) return;

      if (!state.sites.length) {
        barsContainer.innerHTML = `<div style="text-align:center; color:#8A94A3; padding:24px; font-size:14px;">No site data available</div>`;
        return;
      }

      // Gradient palettes for ranks 1–5
      const gradients = [
        'linear-gradient(90deg, #0B6E6E 0%, #14b8a6 100%)',
        'linear-gradient(90deg, #1d4ed8 0%, #38bdf8 100%)',
        'linear-gradient(90deg, #6d28d9 0%, #a78bfa 100%)',
        'linear-gradient(90deg, #be185d 0%, #f472b6 100%)',
        'linear-gradient(90deg, #b45309 0%, #fbbf24 100%)'
      ];
      const medals = ['🥇', '🥈', '🥉', '4', '5'];
      const maxScore = top5.length ? top5[0].score : 100;

      let html = '';
      top5.forEach((item, i) => {
        const pct = Math.round((item.score / 100) * 100);
        const trackPct = Math.round((item.score / maxScore) * 100);
        const siteName = item.site.name.split(' ').slice(0, 3).join(' ');
        const medal = medals[i];
        const gradient = gradients[i];

        html += `
          <div class="top5-bar-row" style="display:flex; align-items:center; gap:10px; padding:8px 10px; background:#fff; border-radius:12px; box-shadow:0 1px 4px rgba(0,0,0,0.07); border:1px solid #f0f0f0;">
            <!-- Rank Badge -->
            <div style="min-width:36px; height:36px; border-radius:50%; background:${gradient}; display:flex; align-items:center; justify-content:center; font-size:${i < 3 ? '18' : '13'}px; font-weight:800; color:#fff; flex-shrink:0; box-shadow:0 2px 8px rgba(0,0,0,0.15);">
              ${medal}
            </div>
            <!-- Name + Bar -->
            <div style="flex:1; min-width:0;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                <span style="font-size:13.5px; font-weight:700; color:#16233D; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;" title="${item.site.name}">${siteName}</span>
                <span style="font-size:15px; font-weight:800; color:#0B6E6E; font-variant-numeric:tabular-nums; margin-left:8px;">${item.score}</span>
              </div>
              <!-- Bar Track -->
              <div style="width:100%; height:10px; background:#EEF0F3; border-radius:9999px; overflow:hidden;">
                <div style="height:100%; width:${trackPct}%; background:${gradient}; border-radius:9999px;"></div>
              </div>
            </div>
            <!-- Score label small -->
            <div style="min-width:38px; text-align:right; font-size:11.5px; color:#6B7280; flex-shrink:0;">${pct}%</div>
          </div>
        `;
      });

      barsContainer.innerHTML = html;
    },

    startAutoPoll() {
      if (this.pollTimer) clearInterval(this.pollTimer);
      this.pollTimer = setInterval(() => {
        if (state.currentView === 'dashboard') {
          this.fetchSites(true); // Silent background refresh
        }
      }, 4000);
    },

    stopAutoPoll() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    },

    async fetchSites(silent = false) {
      let fetchedSites = [];
      let successAPI = false;

      try {
        const res = await fetch('/api/sites');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.sites) && data.sites.length > 0) {
            fetchedSites = data.sites;
            successAPI = true;
          }
        }
      } catch (err) {
        console.warn('Backend API unavailable, using local persistence.', err);
      }

      if (!successAPI) {
        try {
          const savedDash = localStorage.getItem('onc-phase3-sfq:site-dashboard-v1');
          if (savedDash) {
            const parsed = JSON.parse(savedDash);
            if (Array.isArray(parsed.sites) && parsed.sites.length > 0) {
              fetchedSites = parsed.sites;
            }
            if (parsed.weights) state.weights = parsed.weights;
          } else {
            const fallback = localStorage.getItem('clinovo_sites_fallback');
            if (fallback) {
              const parsedFallback = JSON.parse(fallback);
              if (Array.isArray(parsedFallback) && parsedFallback.length > 0) {
                fetchedSites = parsedFallback;
              }
            }
          }
        } catch (e) {}
      }

      // GUARANTEE ALL 36 SITES ARE NEVER MISSING OR BLANK ON ANY LAPTOP / DEVICE
      if (!fetchedSites || fetchedSites.length < 36) {
        fetchedSites = DEFAULT_SEED_SITES_36.slice();
      }

      state.sites = fetchedSites;
      localStorage.setItem('onc-phase3-sfq:site-dashboard-v1', JSON.stringify({ sites: state.sites, weights: state.weights }));
      localStorage.setItem('clinovo_sites_fallback', JSON.stringify(state.sites));

      if (this.radarSelected.size === 0 && state.sites.length > 0) {
        this.radarSelected = new Set(state.sites.slice(0, Math.min(3, state.sites.length)).map(s => s.id));
      }

      if (!silent) {
        this.renderAll();
      } else {
        this.renderAll();
      }
    },

    saveState() {
      localStorage.setItem('onc-phase3-sfq:site-dashboard-v1', JSON.stringify({ sites: state.sites, weights: state.weights }));
      localStorage.setItem('clinovo_sites_fallback', JSON.stringify(state.sites));
    },

    overallScore(site) {
      let sum = 0, wsum = 0;
      CATEGORIES.forEach(c => {
        const w = state.weights[c.key] ?? 1;
        sum += (site.scores[c.key] || 0) * w;
        wsum += w;
      });
      return wsum ? Math.round(sum / wsum) : 0;
    },

    hexToRgb(h) {
      h = h.replace('#', '');
      return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
    },

    rgbToHex(r, g, b) {
      return '#' + [r, g, b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
    },

    lerp(a, b, t) {
      return a + (b - a) * t;
    },

    lerpColor(c1, c2, t) {
      const a = this.hexToRgb(c1), b = this.hexToRgb(c2);
      return this.rgbToHex(this.lerp(a[0], b[0], t), this.lerp(a[1], b[1], t), this.lerp(a[2], b[2], t));
    },

    scoreColor(v) {
      const t = Math.max(0, Math.min(100, v)) / 100;
      let base;
      if (t < 0.5) base = this.lerpColor('#B23A3A', '#B8842E', t / 0.5);
      else base = this.lerpColor('#B8842E', '#0B6E6E', (t - 0.5) / 0.5);
      return this.lerpColor(base, '#FFFFFF', 0.58);
    },

    renderAll() {
      this.renderKPIs();
      this.renderWeights();
      this.renderRadarChips();
      this.renderRadar();
      this.renderSectionTop5();
      this.renderRank();
      this.renderBubble();
      this.renderTable();
    },

    renderKPIs() {
      const el = document.getElementById('kpiRow');
      if (!el) return;

      if (!state.sites.length) {
        el.innerHTML = `
          <div class="kpi" style="grid-column: 1 / -1; text-align: center; padding: 24px;">
            <div class="k-label">No clinical site feasibility records loaded</div>
          </div>
        `;
        return;
      }

      const scored = state.sites.map(s => ({ s, o: this.overallScore(s) }));
      const avg = Math.round(scored.reduce((a, x) => a + x.o, 0) / scored.length);
      const top = scored.slice().sort((a, b) => b.o - a.o)[0];
      const flagged = scored.filter(x => x.o < 60 || x.s.status === 'not_approved').length;
      const avgRate = (state.sites.reduce((a, s) => a + (+s.rate || 0), 0) / state.sites.length).toFixed(1);

      const cards = [
        { label: 'Sites tracked', val: state.sites.length, sub: 'in this comparison set' },
        { label: 'Average score', val: avg, sub: 'weighted across ' + CATEGORIES.length + ' domains' },
        { label: 'Top performer', val: top ? top.s.name.split(' ').slice(0, 2).join(' ') : '-', sub: top ? 'score ' + top.o : '' },
        { label: 'Flagged sites', val: flagged, sub: 'score < 60 or not approved', flag: flagged > 0 },
        { label: 'Avg. monthly accrual', val: avgRate, sub: 'patients / month across sites' }
      ];

      el.innerHTML = cards.map(c => `
        <div class="kpi ${c.flag ? 'flag' : ''}">
          <div class="k-label">${c.label}</div>
          <div class="k-val">${c.val}</div>
          <div class="k-sub">${c.sub}</div>
        </div>
      `).join('');
    },

    toggleWeights() {
      const p = document.getElementById('weightsPanel');
      if (p) p.classList.toggle('open');
    },

    renderWeights() {
      const grid = document.getElementById('weightsGrid');
      if (!grid) return;
      grid.innerHTML = CATEGORIES.map(c => `
        <div class="weight-row">
          <label>${c.label} <span id="wv_${c.key}">${(state.weights[c.key] ?? 1).toFixed(1)}×</span></label>
          <input type="range" min="0" max="3" step="0.1" value="${state.weights[c.key] ?? 1}" oninput="dashApp.updateWeight('${c.key}', this.value)">
        </div>
      `).join('');
    },

    updateWeight(key, val) {
      state.weights[key] = parseFloat(val);
      const span = document.getElementById('wv_' + key);
      if (span) span.textContent = parseFloat(val).toFixed(1) + '×';
      this.saveState();
      this.renderAll();
    },

    resetWeights() {
      CATEGORIES.forEach(c => state.weights[c.key] = 1);
      this.renderWeights();
      this.saveState();
      this.renderAll();
    },

    renderRadarChips() {
      const el = document.getElementById('radarChips');
      if (!el) return;
      if (!state.sites.length) {
        el.innerHTML = `<span style="font-size:12px; color:var(--ink-soft);">No sites to compare</span>`;
        return;
      }
      el.innerHTML = state.sites.map((s, i) => {
        const color = SITE_COLORS[i % SITE_COLORS.length];
        const on = this.radarSelected.has(s.id);
        return `
          <div class="chip ${on ? '' : 'off'}" onclick="dashApp.toggleRadarChip('${s.id}')">
            <span class="dot" style="background:${on ? color : 'transparent'}"></span>
            ${s.name.split(' ').slice(0, 2).join(' ')}
          </div>
        `;
      }).join('');
    },

    toggleRadarChip(id) {
      if (this.radarSelected.has(id)) {
        this.radarSelected.delete(id);
      } else {
        if (this.radarSelected.size >= 5) {
          showToast('Compare up to 5 sites at a time');
          return;
        }
        this.radarSelected.add(id);
      }
      this.renderRadarChips();
      this.renderRadar();
    },

    polar(cx, cy, r, angle) {
      return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
    },

    renderRadar() {
      const svg = document.getElementById('radarSvg');
      if (!svg) return;

      const N = CATEGORIES.length;
      const cx = 200, cy = 200, R = 150;
      const startAngle = -Math.PI / 2;
      let s = '';

      [0.25, 0.5, 0.75, 1].forEach(f => {
        let pts = [];
        for (let i = 0; i < N; i++) {
          const a = startAngle + i * (2 * Math.PI / N);
          pts.push(this.polar(cx, cy, R * f, a));
        }
        s += `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="#E3E8ED" stroke-width="1"/>`;
      });

      for (let i = 0; i < N; i++) {
        const a = startAngle + i * (2 * Math.PI / N);
        const [x, y] = this.polar(cx, cy, R, a);
        s += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#E3E8ED" stroke-width="1"/>`;
        const [lx, ly] = this.polar(cx, cy, R + 22, a);
        let anchor = 'middle';
        if (Math.cos(a) > 0.3) anchor = 'start';
        else if (Math.cos(a) < -0.3) anchor = 'end';
        s += `<text x="${lx}" y="${ly}" font-size="11" fill="#4C5A73" text-anchor="${anchor}" dominant-baseline="middle">${CATEGORIES[i].short}</text>`;
      }

      const selected = state.sites.filter(st => this.radarSelected.has(st.id));
      selected.forEach(site => {
        const idx = state.sites.indexOf(site);
        const color = SITE_COLORS[idx % SITE_COLORS.length];
        let pts = [];
        CATEGORIES.forEach((c, i) => {
          const a = startAngle + i * (2 * Math.PI / N);
          const v = (site.scores[c.key] || 0) / 100;
          pts.push(this.polar(cx, cy, R * v, a));
        });
        s += `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${color}" fill-opacity="0.12" stroke="${color}" stroke-width="2"/>`;
        pts.forEach(p => { s += `<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="${color}"/>`; });
      });

      if (selected.length === 0) {
        s += `<text x="${cx}" y="${cy}" text-anchor="middle" font-size="13" fill="#8A94A3">${state.sites.length ? 'Select sites above to compare' : 'No site data'}</text>`;
      }

      svg.setAttribute('viewBox', '0 0 400 400');
      svg.innerHTML = s;
    },

    renderRank() {
      const svg = document.getElementById('rankSvg');
      if (!svg) return;

      if (!state.sites.length) {
        svg.setAttribute('viewBox', '0 0 880 100');
        svg.style.height = '100px';
        svg.innerHTML = `<text x="440" y="50" font-size="13" fill="#8A94A3" text-anchor="middle">No clinical sites submitted yet</text>`;
        return;
      }

      let ranked = state.sites.map(s => ({ s, o: this.overallScore(s) }));

      if (this.rankFilter === 'top10') {
        ranked.sort((a, b) => b.o - a.o);
        ranked = ranked.slice(0, 10);
      } else if (this.rankFilter === 'top20') {
        ranked.sort((a, b) => b.o - a.o);
        ranked = ranked.slice(0, 20);
      } else if (this.rankFilter === 'allRanked') {
        ranked.sort((a, b) => b.o - a.o);
      } else if (this.rankFilter === 'raw') {
        // Keep raw dataset order without sorting
      } else {
        ranked.sort((a, b) => b.o - a.o);
        ranked = ranked.slice(0, 10);
      }

      const rowH = 42, top = 16, left = 14;
      const barX = 400, chartW = 420;
      const H = top + ranked.length * rowH + 20;
      let s = '';

      ranked.forEach((r, i) => {
        const y = top + i * rowH;
        const w = (r.o / 100) * chartW;
        const color = STATUS_COLOR[r.s.status] || '#8A94A3';
        const fullName = r.s.name;
        const isTop10 = i < 10 && this.rankFilter !== 'raw';

        // Rank Number (01, 02, ... 10 ... 36)
        const rankColor = isTop10 ? '#0B6E6E' : '#7E8C9F';
        s += `<text x="${left}" y="${y + 24}" font-size="12" font-weight="700" fill="${rankColor}">${String(i + 1).padStart(2, '0')}</text>`;
        
        // Full Site Name
        s += `<text x="${left + 30}" y="${y + 24}" font-size="12.5" font-weight="${isTop10 ? '700' : '600'}" fill="${isTop10 ? '#0B2545' : '#16233D'}">${fullName}</text>`;
        
        // Background track bar
        s += `<rect x="${barX}" y="${y + 12}" width="${chartW}" height="14" rx="7" fill="#EEF0F3"/>`;
        
        // Colored progress bar
        s += `<rect x="${barX}" y="${y + 12}" width="${Math.max(8, w)}" height="14" rx="7" fill="${color}"/>`;
        
        // Score Badge
        s += `<text x="${barX + chartW + 16}" y="${y + 24}" font-size="13" font-weight="700" font-family="ui-monospace,monospace" fill="${color}">${r.o}</text>`;
      });

      svg.setAttribute('viewBox', `0 0 880 ${H}`);
      svg.style.height = `${H}px`;
      svg.innerHTML = s;
    },



    setBubbleFilter(filter) {
      state.bubbleFilter = filter;
      document.querySelectorAll('#bubbleFilterPills .rank-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
      });
      this.renderBubble();
    },

    toggleBubbleZoom() {
      const card = document.getElementById('bubblePlotCard');
      const backdrop = document.getElementById('chartBackdrop');
      const btn = document.getElementById('bubbleZoomBtn');
      const view = document.getElementById('view-dashboard');
      if (!card || !backdrop || !btn || !view) return;

      const isMax = card.classList.toggle('maximized-chart');
      backdrop.classList.toggle('show', isMax);
      view.classList.toggle('bubble-maximized', isMax);

      if (isMax) {
        btn.innerHTML = `<i class="fa-solid fa-compress"></i> Minimize`;
      } else {
        btn.innerHTML = `<i class="fa-solid fa-expand"></i> Maximize`;
      }
    },

    renderBubble() {
      const svg = document.getElementById('bubbleSvg');
      if (!svg) return;

      const W = 900, H = 340, padL = 60, padR = 40, padT = 32, padB = 48;
      const plotW = W - padL - padR, plotH = H - padT - padB;

      if (!state.sites.length) {
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
        svg.innerHTML = `<text x="${W/2}" y="${H/2}" font-size="13" fill="#8A94A3" text-anchor="middle">No site data available</text>`;
        return;
      }

      // Score all sites
      const allScored = state.sites
        .map(s => ({ site: s, score: this.overallScore(s) }))
        .sort((a, b) => b.score - a.score);

      // Apply top5/10 filter
      let poolSites;
      if (state.bubbleFilter === 'top5')       poolSites = allScored.slice(0, 5);
      else if (state.bubbleFilter === 'top10') poolSites = allScored.slice(0, 10);
      else                                     poolSites = allScored;

      // Axis helpers
      const allPool = poolSites.map(x => x.site);
      const maxRate  = Math.max(1, ...allPool.map(s => +s.rate  || 0)) * 1.2;
      const maxTotal = Math.max(1, ...allPool.map(s => +s.total || 0));

      const X  = v => padL + (v / maxRate)  * plotW;
      const Y  = v => padT + plotH - (v / 100) * plotH;
      const Rr = v => 10 + Math.sqrt(v / maxTotal) * 20;

      let s = '';

      // ── Y-axis grid lines ─────────────────────────────────────────────
      [0, 25, 50, 75, 100].forEach(v => {
        const y = Y(v);
        s += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#EAEEF2" stroke-width="1"/>`;
        s += `<text x="${padL - 8}" y="${y + 4}" font-size="10.5" text-anchor="end" fill="#8A94A3">${v}</text>`;
      });

      // ── X-axis ticks ──────────────────────────────────────────────────
      for (let i = 0; i <= 5; i++) {
        const v = (maxRate / 5) * i;
        const x = X(v);
        s += `<line x1="${x}" y1="${padT}" x2="${x}" y2="${H - padB}" stroke="#F2F4F6" stroke-width="1"/>`;
        s += `<text x="${x}" y="${H - padB + 18}" font-size="10.5" text-anchor="middle" fill="#8A94A3">${v.toFixed(1)}</text>`;
      }

      // ── Axis labels ───────────────────────────────────────────────────
      s += `<text x="${padL + plotW/2}" y="${H - 6}" font-size="11" text-anchor="middle" fill="#4C5A73">Projected enrollment (patients / month)</text>`;
      s += `<text x="13" y="${padT + plotH/2}" font-size="11" fill="#4C5A73" transform="rotate(-90 13 ${padT + plotH/2})" text-anchor="middle">Overall Feasibility Score</text>`;

      // Color palettes for ranked sites
      const rankColors = [
        '#0B6E6E','#1d4ed8','#6d28d9','#be185d','#b45309',
        '#0284c7','#15803d','#dc2626','#92400e','#0e7490'
      ];

      // ── DRAW bubbles as clean medium circles with full name labels ───
      poolSites.forEach(({ site, score }, idx) => {
        const cx = X(+site.rate || 0), cy = Y(score);
        const r = 9; // Perfect medium dot size
        const color = state.bubbleFilter === 'all'
          ? (STATUS_COLOR[site.status] || '#8A94A3')
          : rankColors[idx % rankColors.length];

        // Draw standard colored circle (medium dot)
        s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" fill-opacity="0.8" stroke="#ffffff" stroke-width="1.5" style="cursor:pointer;">
          <title>${site.name}\nRank #${idx+1} | Score: ${score} | ${site.rate}/mo | ${site.total} total</title>
        </circle>`;

        // Rank label above circle (with white outline for legibility)
        s += `<text x="${cx}" y="${cy - r - 5}" font-size="10" text-anchor="middle" fill="#ffffff" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round" pointer-events="none" font-weight="800">#${idx+1}</text>`;
        s += `<text x="${cx}" y="${cy - r - 5}" font-size="10" text-anchor="middle" fill="${color}" pointer-events="none" font-weight="800">#${idx+1}</text>`;

        // Site name below circle (with white outline for legibility)
        s += `<text x="${cx}" y="${cy + r + 13}" font-size="9" text-anchor="middle" fill="#ffffff" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round" pointer-events="none" font-weight="800">${site.name}</text>`;
        s += `<text x="${cx}" y="${cy + r + 13}" font-size="9" text-anchor="middle" fill="#111827" pointer-events="none" font-weight="800">${site.name}</text>`;
      });

      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.innerHTML = s;

      // ── Legend ─────────────────────────────────────────────────────────
      const legend = document.getElementById('bubbleLegend');
      if (legend) {
        if (state.bubbleFilter === 'all') {
          legend.innerHTML = STATUSES.map(st =>
            `<span><span class="sw" style="background:${STATUS_COLOR[st.key]}"></span>${st.label}</span>`
          ).join('');
        } else {
          const n = state.bubbleFilter === 'top5' ? 5 : 10;
          legend.innerHTML = `<span style="font-size:11px;color:#4C5A73;font-weight:600;">Showing top ${n} ranked sites (represented as Stars)</span>`;
        }
      }
    },

    renderTable() {
      const table = document.getElementById('heatTable');
      if (!table) return;

      if (!state.sites.length) {
        table.innerHTML = `
          <tbody>
            <tr>
              <td colspan="12" style="padding: 36px; text-align: center; color: var(--ink-soft);">
                No clinical candidate sites available.
              </td>
            </tr>
          </tbody>
        `;
        return;
      }

      let rows = state.sites.map(s => ({ s, o: this.overallScore(s) }));

      const sortVal = (row) => {
        if (this.sortKey === 'name') return row.s.name.toLowerCase();
        if (this.sortKey === 'status') return row.s.status;
        if (this.sortKey === 'overall') return row.o;
        return row.s.scores[this.sortKey] ?? 0;
      };

      rows.sort((a, b) => {
        const va = sortVal(a), vb = sortVal(b);
        const cmp = (va > vb) - (va < vb);
        return this.sortAsc ? cmp : -cmp;
      });

      let thead = '<thead><tr>';
      thead += `<th data-key="name" onclick="dashApp.setSort('name')" class="${this.sortKey === 'name' ? 'sorted ' + (this.sortAsc ? 'asc' : '') : ''}">Site</th>`;
      thead += `<th data-key="status" onclick="dashApp.setSort('status')" class="${this.sortKey === 'status' ? 'sorted ' + (this.sortAsc ? 'asc' : '') : ''}">Status</th>`;
      CATEGORIES.forEach(c => {
        thead += `<th data-key="${c.key}" onclick="dashApp.setSort('${c.key}')" class="${this.sortKey === c.key ? 'sorted ' + (this.sortAsc ? 'asc' : '') : ''}">${c.short}</th>`;
      });
      thead += `<th data-key="overall" onclick="dashApp.setSort('overall')" class="${this.sortKey === 'overall' ? 'sorted ' + (this.sortAsc ? 'asc' : '') : ''}">Overall</th>`;
      thead += '</tr></thead>';

      let tbody = '<tbody>';
      rows.forEach(r => {
        tbody += `<tr>`;
        tbody += `<td class="site-cell" onclick="dashApp.openModal('${r.s.id}')">${r.s.name}<span class="meta">${r.s.number || ''} · ${r.s.country || ''}</span></td>`;
        tbody += `<td><span class="badge ${r.s.status}">${STATUSES.find(x => x.key === r.s.status)?.label || r.s.status}</span></td>`;
        CATEGORIES.forEach(c => {
          const v = r.s.scores[c.key] || 0;
          tbody += `<td style="background:${this.scoreColor(v)}">${v}</td>`;
        });
        tbody += `<td class="overall" style="background:${this.scoreColor(r.o)}">${r.o}</td>`;
        tbody += `</tr>`;
      });
      tbody += '</tbody>';

      table.innerHTML = thead + tbody;
    },

    setSort(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else { this.sortKey = key; this.sortAsc = false; }
      this.renderTable();
    },

    statusPillsHTML(current) {
      return STATUSES.map(st => `<div class="pill ${current === st.key ? 'on' : ''}" data-key="${st.key}">${st.label}</div>`).join('');
    },

    scoreSlidersHTML(scores) {
      return CATEGORIES.map(c => `
        <div class="slider-row">
          <div class="slabel">${c.label}</div>
          <input type="range" min="0" max="100" step="1" value="${scores[c.key] ?? 50}" data-key="${c.key}" oninput="document.getElementById('sv_${c.key}').textContent = this.value">
          <div class="sval" id="sv_${c.key}">${scores[c.key] ?? 50}</div>
        </div>
      `).join('');
    },

    openModal(id) {
      this.editingId = id || null;
      const site = this.editingId ? state.sites.find(s => s.id === this.editingId) : null;

      document.getElementById('modalTitle').textContent = site ? 'Edit site' : 'Add site';
      document.getElementById('f_name').value = site?.name || '';
      document.getElementById('f_number').value = site?.number || '';
      document.getElementById('f_country').value = site?.country || '';
      document.getElementById('f_pi').value = site?.pi || '';
      document.getElementById('f_rate').value = site?.rate ?? '';
      document.getElementById('f_total').value = site?.total ?? '';
      document.getElementById('f_weeks').value = site?.weeks ?? '';
      document.getElementById('f_notes').value = site?.notes || '';

      const statusEl = document.getElementById('f_status');
      statusEl.innerHTML = this.statusPillsHTML(site?.status || 'pending');
      statusEl.dataset.value = site?.status || 'pending';
      statusEl.querySelectorAll('.pill').forEach(p => {
        p.addEventListener('click', () => {
          statusEl.dataset.value = p.dataset.key;
          statusEl.querySelectorAll('.pill').forEach(x => x.classList.remove('on'));
          p.classList.add('on');
        });
      });

      const scores = site?.scores || Object.fromEntries(CATEGORIES.map(c => [c.key, 50]));
      document.getElementById('f_scores').innerHTML = this.scoreSlidersHTML(scores);

      document.getElementById('deleteBtn').style.display = site ? 'inline-block' : 'none';
      document.getElementById('overlay').classList.add('open');
    },

    closeModal() {
      document.getElementById('overlay').classList.remove('open');
      this.editingId = null;
    },

    async saveModal() {
      const name = document.getElementById('f_name').value.trim();
      if (!name) {
        showToast('Site name is required');
        return;
      }

      const newScores = {};
      document.querySelectorAll('#f_scores input[type=range]').forEach(inp => {
        newScores[inp.dataset.key] = parseInt(inp.value, 10);
      });

      const siteData = {
        id: this.editingId || 's' + Date.now(),
        name,
        number: document.getElementById('f_number').value.trim(),
        country: document.getElementById('f_country').value.trim(),
        pi: document.getElementById('f_pi').value.trim(),
        status: document.getElementById('f_status').dataset.value || 'pending',
        rate: parseFloat(document.getElementById('f_rate').value) || 0,
        total: parseInt(document.getElementById('f_total').value, 10) || 0,
        weeks: parseInt(document.getElementById('f_weeks').value, 10) || 0,
        scores: newScores,
        notes: document.getElementById('f_notes').value.trim()
      };

      try {
        const res = await fetch('/api/sites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(siteData)
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.sites)) {
          state.sites = data.sites;
        } else {
          this.saveModalFallback(siteData);
        }
      } catch (err) {
        this.saveModalFallback(siteData);
      }

      this.saveState();
      this.closeModal();
      this.renderAll();
      showToast('Site saved');
    },

    saveModalFallback(siteData) {
      const idx = state.sites.findIndex(s => s.id === siteData.id);
      if (idx >= 0) state.sites[idx] = siteData;
      else {
        state.sites.unshift(siteData);
        this.radarSelected.add(siteData.id);
      }
    },

    async deleteSite() {
      if (!this.editingId) return;
      if (!confirm('Remove this site from the comparison?')) return;

      try {
        const res = await fetch(`/api/sites/${this.editingId}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success && Array.isArray(data.sites)) {
          state.sites = data.sites;
        } else {
          state.sites = state.sites.filter(s => s.id !== this.editingId);
        }
      } catch (err) {
        state.sites = state.sites.filter(s => s.id !== this.editingId);
      }

      this.radarSelected.delete(this.editingId);
      this.saveState();
      this.closeModal();
      this.renderAll();
      showToast('Site removed');
    },

    exportCSV() {
      try {
        if (!state.sites || !state.sites.length) {
          showToast('No site data to export');
          return;
        }

        const headers = ['Site', 'Number', 'Country', 'PI', 'Status', ...CATEGORIES.map(c => c.label), 'Overall', 'Rate/mo', 'Total enrollment', 'Activation (wks)', 'Notes'];
        const rows = state.sites.map(s => {
          const scores = s.scores || {};
          const o = this.overallScore(s);
          const statusObj = STATUSES.find(x => x.key === s.status);
          const statusLabel = statusObj ? statusObj.label : (s.status || 'Pending');

          const categoryValues = CATEGORIES.map(c => scores[c.key] !== undefined ? scores[c.key] : 0);

          const rowData = [
            s.name || 'Unnamed Site',
            s.number || '',
            s.country || '',
            s.pi || '',
            statusLabel,
            ...categoryValues,
            o,
            s.rate || 0,
            s.total || 0,
            s.weeks || 0,
            (s.notes || '').replace(/\r?\n|\r/g, ' ')
          ];

          return rowData.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
        });

        const csvContent = [headers.map(h => `"${h}"`).join(','), ...rows].join('\r\n');
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const filename = 'site-comparison-' + new Date().toISOString().slice(0, 10) + '.csv';

        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, filename);
        } else {
          const link = document.createElement('a');
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 200);
        }
        showToast('CSV exported successfully ✓');
      } catch (err) {
        console.error('CSV Export Exception:', err);
        showToast('Could not export CSV');
      }
    }
  };

  // Expose Globally
  window.questApp = questApp;
  window.dashApp = dashApp;

  // Initialize App on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    app.init();
  });

})();
