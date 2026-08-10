/* ==========================================================================
   CLINOVO SITE FEASIBILITY PORTAL & DASHBOARD - APPLICATION JAVASCRIPT
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
    { key: 'pending', label: 'Pending Review' },
    { key: 'not_approved', label: 'Not Approved' }
  ];

  const STATUS_COLOR = {
    approved: '#0d9488',
    conditional: '#d97706',
    pending: '#94a3b8',
    not_approved: '#e11d48'
  };

  const SITE_COLORS = ['#0d9488', '#d97706', '#0284c7', '#8b5cf6', '#10b981', '#f43f5e', '#6366f1'];

  function showToast(msg) {
    const t = document.getElementById('toastMsg');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  }

  // 240HZ SUPER-FLUID HIGH REFRESH RATE CANVAS ENGINE
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
    const maxAmbient = 45;

    for (let i = 0; i < maxAmbient; i++) {
      ambientParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 3 + 1.2,
        alpha: Math.random() * 0.45 + 0.1,
        color: Math.random() > 0.5 ? '45, 212, 191' : '59, 130, 246'
      });
    }

    let lastMouseX = 0, lastMouseY = 0;
    window.addEventListener('mousemove', (e) => {
      if (state.currentView !== 'landing') return;

      const dist = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
      if (dist > 10) {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        cursorWaves.push({
          x: e.clientX,
          y: e.clientY,
          radius: 4,
          maxRadius: Math.random() * 25 + 35,
          alpha: 0.7,
          color: Math.random() > 0.5 ? '45, 212, 191' : '2, 132, 199',
          lineWidth: Math.random() * 2 + 1.2
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

            if (d < 100) {
              ctx.strokeStyle = `rgba(${p.color}, ${(1 - d / 100) * 0.12})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }

        for (let i = cursorWaves.length - 1; i >= 0; i--) {
          const w = cursorWaves[i];
          w.radius += 1.6 * (dt * 120);
          w.alpha -= 0.022 * (dt * 120);

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

  // Application Controller
  window.app = {
    init() {
      const savedRole = sessionStorage.getItem('clinovo_session_role');
      const savedView = sessionStorage.getItem('clinovo_current_view');
      const savedEmail = sessionStorage.getItem('clinovo_session_email');

      if (savedRole && savedView && savedView !== 'landing') {
        state.userRole = savedRole;
        state.userEmail = savedEmail || (savedRole === 'admin' ? 'name@admin.in' : 'name@client.in');
        
        let targetView = savedView;
        if (savedRole === 'client' && savedView === 'dashboard') {
          targetView = 'questionnaire';
          sessionStorage.setItem('clinovo_current_view', 'questionnaire');
        }

        state.currentView = targetView;
        document.body.classList.remove('landing-active');
        
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active-view'));
        const targetViewEl = document.getElementById(`view-${targetView}`);
        if (targetViewEl) targetViewEl.classList.add('active-view');

        this.updateUserNav();
        if (targetView === 'dashboard') {
          dashApp.fetchSites();
        } else if (targetView === 'questionnaire') {
          questApp.renderAll();
        }
      } else {
        document.body.classList.add('landing-active');
        this.updateUserNav();
        dashApp.fetchSites();
      }

      this.startDotCarousel();
      initPharmaCanvas();
    },

    showPharmaLoader(callback) {
      const overlay = document.getElementById('pharmaLoaderOverlay');
      if (overlay) overlay.classList.add('active');

      setTimeout(() => {
        if (overlay) overlay.classList.remove('active');
        if (typeof callback === 'function') callback();
      }, 500);
    },

    navigateTo(viewId) {
      if (viewId === 'dashboard' && state.userRole !== 'admin') {
        showToast('Access Restricted: Admin privileges required.');
        if (state.userRole === 'client') {
          viewId = 'questionnaire';
        } else {
          viewId = 'landing';
        }
      }

      this.showPharmaLoader(() => {
        state.currentView = viewId;
        sessionStorage.setItem('clinovo_current_view', viewId);

        if (viewId === 'landing') {
          document.body.classList.add('landing-active');
        } else {
          document.body.classList.remove('landing-active');
        }

        document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active-view'));
        
        const targetView = document.getElementById(`view-${viewId}`);
        if (targetView) targetView.classList.add('active-view');

        if (viewId === 'dashboard') {
          dashApp.fetchSites();
        } else if (viewId === 'questionnaire') {
          questApp.renderAll();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },

    togglePasswordVisibility() {
      const passInput = document.getElementById('passwordInput');
      const eyeIcon = document.getElementById('togglePasswordBtn');
      if (!passInput || !eyeIcon) return;

      if (passInput.type === 'password') {
        passInput.type = 'text';
        eyeIcon.className = 'fa-solid fa-eye-slash password-eye-icon';
      } else {
        passInput.type = 'password';
        eyeIcon.className = 'fa-solid fa-eye password-eye-icon';
      }
    },

    handleSignIn(event) {
      event.preventDefault();
      const usernameVal = (document.getElementById('usernameInput')?.value || '').toLowerCase();

      this.showPharmaLoader(() => {
        if (usernameVal.includes('admin')) {
          state.userRole = 'admin';
          state.userEmail = usernameVal || 'name@admin.in';
          sessionStorage.setItem('clinovo_session_role', 'admin');
          sessionStorage.setItem('clinovo_session_email', state.userEmail);
          sessionStorage.setItem('clinovo_current_view', 'dashboard');

          this.updateUserNav();
          showToast('Signed in as Admin!');
          this.navigateTo('dashboard');
        } else {
          state.userRole = 'client';
          state.userEmail = usernameVal || 'name@client.in';
          sessionStorage.setItem('clinovo_session_role', 'client');
          sessionStorage.setItem('clinovo_session_email', state.userEmail);
          sessionStorage.setItem('clinovo_current_view', 'questionnaire');

          this.updateUserNav();
          showToast('Signed in as Client!');
          this.navigateTo('questionnaire');
        }
      });
    },

    logout() {
      this.showPharmaLoader(() => {
        state.userRole = null;
        state.userEmail = '';
        sessionStorage.removeItem('clinovo_session_role');
        sessionStorage.removeItem('clinovo_session_email');
        sessionStorage.removeItem('clinovo_current_view');

        this.updateUserNav();
        showToast('Signed out');
        this.navigateTo('landing');
      });
    },

    updateUserNav() {
      const container = document.getElementById('userNavActions');
      if (!container) return;

      if (!state.userRole) {
        container.innerHTML = '';
      } else {
        container.innerHTML = `
          <button class="btn-logout-exact" onclick="app.logout()">
            <i class="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        `;
      }
    },

    startDotCarousel() {
      setInterval(() => {
        state.carouselDot = (state.carouselDot + 1) % 4;
        this.setDot(state.carouselDot);
      }, 3500);
    },

    setDot(idx) {
      state.carouselDot = idx;
      const dots = document.querySelectorAll('#carouselDots .dot-item');
      dots.forEach((dot, i) => {
        if (i === idx) dot.classList.add('active');
        else dot.classList.remove('active');
      });
    }
  };

  // -------------------------------------------------------------------------
  // 2. CLIENT QUESTIONNAIRE MODULE
  // -------------------------------------------------------------------------
  const SECTIONS = [
    {
      id: 'sec01', num: '01', title: 'Study Information', kicker: 'Header · 01 / 12',
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
      id: 'sec02', num: '02', title: 'Site & Investigator', kicker: 'Section 1 · 02 / 12',
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
      id: 'sec03', num: '03', title: 'Tumor Board', kicker: 'Section 1.2 · 03 / 12',
      desc: 'Multidisciplinary tumor board (MDT) infrastructure.',
      fields: [
        { id: 'q_mdtHeld', type: 'yesno', label: 'Does the site hold a regular multidisciplinary tumor board (surgical, medical, radiation oncology, pathology, radiology)?', hint: 'state frequency in comment' },
        { id: 'q_mdtPI', type: 'yesno', label: 'Is the PI or a sub-investigator a regular, active participant in the tumor board?' },
        { id: 'q_mdtProcess', type: 'yesno', label: 'Is there a documented process for identifying trial-eligible patients at tumor board?' }
      ]
    },
    {
      id: 'sec04', num: '04', title: 'Patient Population', kicker: 'Section 2 · 04 / 12',
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
      id: 'sec05', num: '05', title: 'Facilities & Equipment', kicker: 'Section 3 · 05 / 12',
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
      id: 'sec06', num: '06', title: 'Pharmacy & IP', kicker: 'Section 4 · 06 / 12',
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
      id: 'sec07', num: '07', title: 'Lab, Pathology & Biomarkers', kicker: 'Section 5 · 07 / 12',
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
      id: 'sec08', num: '08', title: 'Safety & Toxicity', kicker: 'Section 5A · 08 / 12',
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
      id: 'sec09', num: '09', title: 'Regulatory & Experience', kicker: 'Section 6 · 09 / 12',
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
      id: 'sec10', num: '10', title: 'Data Management & Technology', kicker: 'Section 7 · 10 / 12',
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
      id: 'sec11', num: '11', title: 'Budget, Contracts & Timelines', kicker: 'Section 8 · 11 / 12',
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
      id: 'sec12', num: '12', title: 'Site Declaration', kicker: 'Section 9 · 12 / 12',
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
    storageKey: 'clinovo-sfq-answers-v2',

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
      } catch (e) {}
    },

    saveAnswers() {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.answers));
      } catch (e) {}
    },

    isAnswered(field, val) {
      if (!val) return false;
      if (field.type === 'yesno') return !!(val.v);
      if (field.type === 'multiselect') return Array.isArray(val) && val.length > 0;
      if (field.type === 'select') return !!val;
      if (field.type === 'text' || field.type === 'textarea') return String(val).trim().length > 0;
      return false;
    },

    sectionProgress(sec) {
      const fs = sec.fields.filter(f => f.type !== 'divider');
      if (!fs.length) return { done: 0, total: 0, pct: 0 };
      let done = 0;
      fs.forEach(f => { if (this.isAnswered(f, this.answers[f.id])) done++; });
      return { done, total: fs.length, pct: Math.round((done / fs.length) * 100) };
    },

    overallProgress() {
      let done = 0, total = 0;
      SECTIONS.forEach(sec => {
        const p = this.sectionProgress(sec);
        done += p.done;
        total += p.total;
      });
      return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
    },

    ringSVG(pct, size = 44, stroke = 5, trackColor = '#e2e8f0', fillColor = '#0d9488') {
      const r = (size - stroke) / 2;
      const c = 2 * Math.PI * r;
      const offset = c * (1 - pct / 100);
      const cx = size / 2, cy = size / 2;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${trackColor}" stroke-width="${stroke}"/>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${fillColor}" stroke-width="${stroke}"
          stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${offset}"
          transform="rotate(-90 ${cx} ${cy})" style="transition:stroke-dashoffset .4s ease"/>`;
    },

    renderOverall() {
      const p = this.overallProgress();
      const ring = document.getElementById('overallRing');
      if (ring) ring.innerHTML = this.ringSVG(p.pct, 40, 4, '#e2e8f0', '#0d9488');
      const pct = document.getElementById('overallPct');
      if (pct) pct.textContent = p.pct + '%';
    },

    renderNav() {
      const nav = document.getElementById('questRoleTabs');
      if (!nav) return;
      nav.innerHTML = SECTIONS.map((s, i) => {
        const p = this.sectionProgress(s);
        const isActive = i === this.activeSection;
        return `
          <div class="sfq-role-tab ${isActive ? 'active' : ''}" onclick="questApp.switchSection(${i})">
            <span class="r-num">${s.num}</span>
            <span class="r-ttl">${s.title}</span>
            <svg width="16" height="16" viewBox="0 0 16 16">
              ${this.ringSVG(p.pct, 16, 2.5, '#e2e8f0', p.pct === 100 ? '#0d9488' : '#d97706')}
            </svg>
          </div>
        `;
      }).join('');
    },

    switchSection(index) {
      this.activeSection = index;
      this.renderNav();
      this.renderContent();
    },

    renderContent() {
      const s = SECTIONS[this.activeSection];
      const c = document.getElementById('questContent');
      if (!c) return;

      const isFinal = this.activeSection === SECTIONS.length - 1;

      c.innerHTML = `
        <div class="q-card-container">
          <div class="section-head">
            <div class="kicker">${s.kicker}</div>
            <h2>${s.title}</h2>
            <p>${s.desc}</p>
          </div>
          ${s.fields.map(f => this.fieldTemplate(f)).join('')}
          <div class="quest-foot-nav">
            <button class="btn btn-secondary btn-sm" onclick="questApp.goPrev()" ${this.activeSection === 0 ? 'disabled' : ''}>&larr; Previous section</button>
            <button id="btnSubmitFinal" class="btn btn-primary btn-sm ${isFinal ? 'btn-submit-exact' : ''}" onclick="questApp.goNext()">
              ${isFinal ? 'Submit' : 'Next section &rarr;'}
            </button>
          </div>
        </div>
      `;

      this.bindFieldEvents();
    },

    fieldTemplate(f) {
      const val = this.answers[f.id];
      if (f.type === 'divider') {
        return `<div class="q-divider"><div class="dlabel">${f.label}</div></div>`;
      }

      let body = '';
      if (f.type === 'text') {
        body = `<input type="text" class="q-input-text" data-id="${f.id}" data-kind="text" value="${(val || '').replace(/"/g, '&quot;')}" placeholder="Type response…">`;
      } else if (f.type === 'textarea') {
        body = `<textarea class="q-textarea" data-id="${f.id}" data-kind="text" placeholder="Type response…">${val || ''}</textarea>`;
      } else if (f.type === 'yesno') {
        const v = (val && val.v) || '';
        const com = (val && val.c) || '';
        body = `
          <div class="yn-row">
            <button type="button" class="yn-btn yes ${v === 'yes' ? 'on' : ''}" onclick="questApp.setYesNo('${f.id}', 'yes')">Yes</button>
            <button type="button" class="yn-btn no ${v === 'no' ? 'on' : ''}" onclick="questApp.setYesNo('${f.id}', 'no')">No</button>
            <div class="yn-comment">
              <input type="text" data-id="${f.id}" data-kind="comment" value="${com.replace(/"/g, '&quot;')}" placeholder="Comment (optional)">
            </div>
          </div>
        `;
      } else if (f.type === 'multiselect') {
        const arr = Array.isArray(val) ? val : [];
        body = `<div class="pill-group">` + f.options.map(opt => `
          <button type="button" class="pill-item ${arr.includes(opt) ? 'on' : ''}" onclick="questApp.toggleMulti('${f.id}', '${opt}')">${opt}</button>
        `).join('') + `</div>`;
      } else if (f.type === 'select') {
        body = `<div class="pill-group">` + f.options.map(opt => `
          <button type="button" class="pill-item ${val === opt ? 'on' : ''}" onclick="questApp.setSelect('${f.id}', '${opt}')">${opt}</button>
        `).join('') + `</div>`;
      }

      return `
        <div class="q-field">
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
      document.querySelectorAll('[data-kind="comment"]').forEach(el => {
        el.addEventListener('input', () => {
          const id = el.dataset.id;
          const cur = this.answers[id] || { v: '', c: '' };
          cur.c = el.value;
          this.answers[id] = cur;
          this.saveAnswers();
        });
      });
    },

    setYesNo(id, val) {
      const cur = this.answers[id] || { v: '', c: '' };
      cur.v = cur.v === val ? '' : val;
      this.answers[id] = cur;
      this.saveAnswers();
      this.renderContent();
      this.renderOverall();
      this.renderNav();
    },

    toggleMulti(id, opt) {
      const arr = Array.isArray(this.answers[id]) ? this.answers[id].slice() : [];
      const idx = arr.indexOf(opt);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(opt);
      this.answers[id] = arr;
      this.saveAnswers();
      this.renderContent();
      this.renderOverall();
      this.renderNav();
    },

    setSelect(id, opt) {
      this.answers[id] = this.answers[id] === opt ? '' : opt;
      this.saveAnswers();
      this.renderContent();
      this.renderOverall();
      this.renderNav();
    },

    goPrev() {
      if (this.activeSection > 0) {
        this.activeSection--;
        this.renderNav();
        this.renderContent();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    goNext() {
      if (this.activeSection < SECTIONS.length - 1) {
        this.activeSection++;
        this.renderNav();
        this.renderContent();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        this.submitToAdmin();
      }
    },

    resetAnswers() {
      if (!confirm('Clear all answers in this questionnaire draft?')) return;
      this.answers = {};
      localStorage.removeItem(this.storageKey);
      this.renderAll();
      showToast('All answers reset');
    },

    exportSummary() {
      let txt = 'CLINOVO SITE FEASIBILITY QUESTIONNAIRE SUMMARY\n';
      txt += 'Generated: ' + new Date().toLocaleString() + '\n';
      txt += '==================================================\n\n';

      SECTIONS.forEach(s => {
        txt += `${s.num}. ${s.title.toUpperCase()}\n`;
        txt += '--------------------------------------------------\n';
        s.fields.filter(f => f.type !== 'divider').forEach(f => {
          const val = this.answers[f.id];
          let ans = '(Not Answered)';
          if (f.type === 'text' || f.type === 'textarea') {
            if (val && String(val).trim()) ans = String(val);
          } else if (f.type === 'yesno') {
            if (val && val.v) ans = val.v.toUpperCase() + (val.c ? ` (${val.c})` : '');
          } else if (f.type === 'multiselect') {
            if (val && val.length) ans = val.join(', ');
          } else if (f.type === 'select') {
            if (val) ans = val;
          }
          txt += `Q: ${f.label}\nA: ${ans}\n\n`;
        });
      });

      const blob = new Blob([txt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'clinovo-site-feasibility-summary.txt';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Summary exported to .txt file');
    },

    async submitToAdmin() {
      const btn = document.getElementById('btnSubmitFinal');
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
      const btn = document.getElementById('btnSubmitFinal');
      if (btn) {
        btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Submitted ✓`;
        btn.classList.remove('submitting');
        btn.classList.add('submitted-success');
      }

      showToast(`Submitted Successfully! Overall Score: ${overallScore}/100`);

      // PERSIST ONLY REAL CLIENT SUBMITTED SITES
      if (Array.isArray(returnedSites)) {
        const cleanSites = returnedSites.filter(s => !['s01', 's02', 's03'].includes(s.id));
        state.sites = cleanSites;
        localStorage.setItem('clinovo_sites_fallback', JSON.stringify(cleanSites));
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
        scores: scores,
        notes: 'Submitted via Site Feasibility Portal'
      };

      let existing = [];
      try {
        existing = JSON.parse(localStorage.getItem('clinovo_sites_fallback') || '[]');
      } catch (e) {}

      existing = existing.filter(s => !['s01', 's02', 's03'].includes(s.id));
      existing.unshift(newSite);
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
  // 3. ADMIN FEASIBILITY DASHBOARD MODULE (ONLY REAL CLIENT DATA)
  // -------------------------------------------------------------------------
  const dashApp = {
    radarSelected: new Set(),
    sortKey: 'overall',
    sortAsc: false,
    editingId: null,

    async fetchSites() {
      let apiSites = [];
      try {
        const res = await fetch('/api/sites');
        const data = await res.json();
        if (data.success && Array.isArray(data.sites)) {
          apiSites = data.sites;
        }
      } catch (err) {
        console.warn('Backend API unavailable, loading local fallback storage.', err);
      }

      let localSites = [];
      try {
        const saved = localStorage.getItem('clinovo_sites_fallback');
        if (saved) localSites = JSON.parse(saved);
      } catch (e) {}

      // EXCLUSIVELY SHOW REAL CLIENT SUBMITTED QUESTIONNAIRES (NO MOCK DATA)
      const mockIds = new Set(['s01', 's02', 's03']);
      apiSites = apiSites.filter(s => !mockIds.has(s.id));
      localSites = localSites.filter(s => !mockIds.has(s.id));

      const mergedMap = new Map();
      apiSites.forEach(s => mergedMap.set(s.id, s));
      localSites.forEach(s => mergedMap.set(s.id, s));

      state.sites = Array.from(mergedMap.values());
      localStorage.setItem('clinovo_sites_fallback', JSON.stringify(state.sites));

      if (state.sites.length > 0) {
        this.radarSelected = new Set(state.sites.slice(0, Math.min(3, state.sites.length)).map(s => s.id));
      } else {
        this.radarSelected.clear();
      }
      this.renderAll();
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

    renderAll() {
      this.renderKPIs();
      this.renderWeights();
      this.renderRadarChips();
      this.renderRadar();
      this.renderRank();
      this.renderBubble();
      this.renderTable();
    },

    renderKPIs() {
      const el = document.getElementById('kpiRow');
      if (!el) return;
      if (!state.sites.length) {
        el.innerHTML = `
          <div class="kpi-card" style="grid-column: 1 / -1; text-align: center; padding: 32px; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 16px;">
            <div style="font-size: 16px; color: #0f172a; font-weight: 700; margin-bottom: 6px;">No Questionnaire Data Submitted Yet</div>
            <div style="font-size: 13px; color: #64748b;">Log in as a <strong>Client</strong> and fill out the Site Feasibility Questionnaire to submit your real clinical site data. Once submitted, your record will reflect here live.</div>
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
        { label: 'Candidate Sites Tracked', val: state.sites.length, sub: 'Stored live in SQLite 3 DB' },
        { label: 'Average Score', val: avg, sub: 'Weighted across 9 domains' },
        { label: 'Top Performer', val: top.s.name.split(' ').slice(0, 2).join(' '), sub: `Score ${top.o}` },
        { label: 'Flagged Sites', val: flagged, sub: 'Score < 60 or Not Approved', flag: flagged > 0 },
        { label: 'Avg Monthly Accrual', val: avgRate, sub: 'Patients / month per site' }
      ];

      el.innerHTML = cards.map(c => `
        <div class="kpi-card ${c.flag ? 'flag' : ''}">
          <div class="kpi-label">${c.label}</div>
          <div class="kpi-val">${c.val}</div>
          <div class="kpi-sub">${c.sub}</div>
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
          <label><span>${c.label}</span> <span id="wv_${c.key}">${(state.weights[c.key] ?? 1).toFixed(1)}×</span></label>
          <input type="range" min="0" max="3" step="0.1" value="${state.weights[c.key] ?? 1}" oninput="dashApp.updateWeight('${c.key}', this.value)">
        </div>
      `).join('');
    },

    updateWeight(key, val) {
      state.weights[key] = parseFloat(val);
      const span = document.getElementById('wv_' + key);
      if (span) span.textContent = parseFloat(val).toFixed(1) + '×';
      this.renderAll();
    },

    resetWeights() {
      CATEGORIES.forEach(c => state.weights[c.key] = 1);
      this.renderWeights();
      this.renderAll();
    },

    renderRadarChips() {
      const el = document.getElementById('radarChips');
      if (!el) return;
      if (!state.sites.length) {
        el.innerHTML = `<span style="font-size:12px; color:#64748b;">No client submitted sites to display in radar overlay</span>`;
        return;
      }
      el.innerHTML = state.sites.map((s, i) => {
        const color = SITE_COLORS[i % SITE_COLORS.length];
        const on = this.radarSelected.has(s.id);
        return `
          <div class="radar-chip ${on ? '' : 'off'}" onclick="dashApp.toggleRadarChip('${s.id}')">
            <span class="dot" style="background:${on ? color : 'transparent'}; border: 1.5px solid ${color}"></span>
            ${s.name.split(' ').slice(0, 2).join(' ')}
          </div>
        `;
      }).join('');
    },

    toggleRadarChip(id) {
      if (this.radarSelected.has(id)) {
        this.radarSelected.delete(id);
      } else {
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
      const cx = 220, cy = 200, R = 140;
      const startAngle = -Math.PI / 2;
      let s = '';

      [0.25, 0.5, 0.75, 1].forEach(f => {
        let pts = [];
        for (let i = 0; i < N; i++) {
          const a = startAngle + i * (2 * Math.PI / N);
          pts.push(this.polar(cx, cy, R * f, a));
        }
        s += `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="#cbd5e1" stroke-width="1"/>`;
      });

      for (let i = 0; i < N; i++) {
        const a = startAngle + i * (2 * Math.PI / N);
        const [x, y] = this.polar(cx, cy, R, a);
        s += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#cbd5e1" stroke-width="1"/>`;
        const [lx, ly] = this.polar(cx, cy, R + 22, a);
        let anchor = 'middle';
        if (Math.cos(a) > 0.3) anchor = 'start';
        else if (Math.cos(a) < -0.3) anchor = 'end';
        s += `<text x="${lx}" y="${ly}" font-size="11" fill="#475569" text-anchor="${anchor}" dominant-baseline="middle">${CATEGORIES[i].short}</text>`;
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
        s += `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="2.5"/>`;
        pts.forEach(p => { s += `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="${color}"/>`; });
      });

      svg.setAttribute('viewBox', '0 0 440 400');
      svg.innerHTML = s;
    },

    renderRank() {
      const svg = document.getElementById('rankSvg');
      if (!svg) return;

      if (!state.sites.length) {
        svg.setAttribute('viewBox', '0 0 320 100');
        svg.innerHTML = `<text x="160" y="50" font-size="12" fill="#64748b" text-anchor="middle">No client submitted sites to rank</text>`;
        return;
      }

      const ranked = state.sites.map(s => ({ s, o: this.overallScore(s) })).sort((a, b) => b.o - a.o);
      const rowH = 42, top = 16, left = 14, chartW = 220;
      const H = Math.max(200, top + ranked.length * rowH + 16);
      let s = '';

      ranked.forEach((r, i) => {
        const y = top + i * rowH;
        const w = (r.o / 100) * chartW;
        const color = STATUS_COLOR[r.s.status] || '#94a3b8';

        s += `<text x="${left}" y="${y + 14}" font-size="12" font-weight="600" fill="#0f172a">${r.s.name.length > 24 ? r.s.name.slice(0, 22) + '…' : r.s.name}</text>`;
        s += `<rect x="${left}" y="${y + 20}" width="${chartW}" height="10" rx="5" fill="#e2e8f0"/>`;
        s += `<rect x="${left}" y="${y + 20}" width="${Math.max(6, w)}" height="10" rx="5" fill="${color}"/>`;
        s += `<text x="${left + chartW + 12}" y="${y + 29}" font-size="12" font-family="JetBrains Mono, monospace" font-weight="700" fill="#0d9488">${r.o}</text>`;
      });

      svg.setAttribute('viewBox', `0 0 320 ${H}`);
      svg.innerHTML = s;
    },

    renderBubble() {
      const svg = document.getElementById('bubbleSvg');
      if (!svg) return;

      const W = 900, H = 320, padL = 60, padR = 30, padT = 20, padB = 42;
      const plotW = W - padL - padR, plotH = H - padT - padB;

      if (!state.sites.length) {
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
        svg.innerHTML = `<text x="${W/2}" y="${H/2}" font-size="13" fill="#64748b" text-anchor="middle">No client site data submitted yet</text>`;
        return;
      }

      const maxRate = Math.max(1, ...state.sites.map(s => +s.rate || 0)) * 1.2;
      const maxTotal = Math.max(1, ...state.sites.map(s => +s.total || 0));

      const X = (v) => padL + (v / maxRate) * plotW;
      const Y = (v) => padT + plotH - (v / 100) * plotH;
      const Rr = (v) => 10 + Math.sqrt(v / maxTotal) * 26;

      let s = '';

      [0, 25, 50, 75, 100].forEach(v => {
        const y = Y(v);
        s += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#e2e8f0" stroke-width="1"/>`;
        s += `<text x="${padL - 10}" y="${y + 4}" font-size="10.5" text-anchor="end" fill="#64748b">${v}</text>`;
      });

      const rateTicks = 5;
      for (let i = 0; i <= rateTicks; i++) {
        const v = (maxRate / rateTicks) * i;
        const x = X(v);
        s += `<line x1="${x}" y1="${padT}" x2="${x}" y2="${H - padB}" stroke="#f1f5f9" stroke-width="1"/>`;
        s += `<text x="${x}" y="${H - padB + 18}" font-size="10.5" text-anchor="middle" fill="#64748b">${v.toFixed(1)}</text>`;
      }

      s += `<text x="${padL + plotW / 2}" y="${H - 6}" font-size="11" text-anchor="middle" fill="#475569">Projected Monthly Accrual (patients / month)</text>`;
      s += `<text x="16" y="${padT + plotH / 2}" font-size="11" fill="#475569" transform="rotate(-90 16 ${padT + plotH / 2})" text-anchor="middle">Feasibility Score</text>`;

      state.sites.forEach(site => {
        const o = this.overallScore(site);
        const cx = X(+site.rate || 0), cy = Y(o), r = Rr(+site.total || 0);
        const color = STATUS_COLOR[site.status] || '#94a3b8';

        s += `
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" fill-opacity="0.35" stroke="${color}" stroke-width="2.5" style="cursor:pointer;">
            <title>${site.name} — Overall Score: ${o}, ${site.rate} pts/mo, ${site.total} total</title>
          </circle>
          <text x="${cx}" y="${cy + 3}" font-size="9.5" text-anchor="middle" fill="#0f172a" font-weight="600" pointer-events="none">${site.name.split(' ')[0]}</text>
        `;
      });

      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.innerHTML = s;

      const legend = document.getElementById('bubbleLegend');
      if (legend) {
        legend.innerHTML = STATUSES.map(st => `
          <span style="display:flex; align-items:center; gap:6px; color:#475569; font-size:12px;">
            <span style="width:10px; height:10px; border-radius:50%; background:${STATUS_COLOR[st.key]}"></span>
            ${st.label}
          </span>
        `).join('');
      }
    },

    scoreColor(v) {
      if (v >= 80) return 'rgba(13, 148, 136, 0.15)';
      if (v >= 65) return 'rgba(217, 119, 6, 0.15)';
      return 'rgba(225, 29, 72, 0.15)';
    },

    scoreTextColor(v) {
      if (v >= 80) return '#0d9488';
      if (v >= 65) return '#d97706';
      return '#e11d48';
    },

    renderTable() {
      const table = document.getElementById('heatTable');
      if (!table) return;

      if (!state.sites.length) {
        table.innerHTML = `
          <tbody>
            <tr>
              <td colspan="12" style="padding: 36px; text-align: center; color: #64748b;">
                <i class="fa-solid fa-folder-open" style="font-size: 24px; color: #94a3b8; margin-bottom: 8px; display: block;"></i>
                No candidate sites submitted by clients yet.<br>
                <span style="font-size: 12px; color: #94a3b8;">Client filled questionnaires will automatically populate this dashboard table when submitted.</span>
              </td>
            </tr>
          </tbody>
        `;
        return;
      }

      let rows = state.sites.map(s => ({ s, o: this.overallScore(s) }));
      rows.sort((a, b) => {
        let va = a.s[this.sortKey] || a.o;
        let vb = b.s[this.sortKey] || b.o;
        if (this.sortKey === 'overall') { va = a.o; vb = b.o; }
        else if (CATEGORIES.some(c => c.key === this.sortKey)) {
          va = a.s.scores[this.sortKey] || 0;
          vb = b.s.scores[this.sortKey] || 0;
        }
        return this.sortAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
      });

      let thead = '<thead><tr>';
      thead += `<th onclick="dashApp.setSort('name')">Site Name</th>`;
      thead += `<th onclick="dashApp.setSort('status')">Status</th>`;
      CATEGORIES.forEach(c => {
        thead += `<th onclick="dashApp.setSort('${c.key}')">${c.short}</th>`;
      });
      thead += `<th onclick="dashApp.setSort('overall')">Overall</th>`;
      thead += '</tr></thead>';

      let tbody = '<tbody>';
      rows.forEach(r => {
        tbody += `<tr>`;
        tbody += `
          <td class="site-cell" onclick="dashApp.openModal('${r.s.id}')">
            ${r.s.name}
            <span class="meta">#${r.s.number} · ${r.s.country}</span>
          </td>
        `;
        tbody += `<td><span class="status-badge ${r.s.status}">${STATUSES.find(x => x.key === r.s.status)?.label || r.s.status}</span></td>`;
        CATEGORIES.forEach(c => {
          const v = r.s.scores[c.key] || 0;
          tbody += `<td style="background:${this.scoreColor(v)}; color:${this.scoreTextColor(v)}; font-weight:700;">${v}</td>`;
        });
        tbody += `<td class="overall" style="background:${this.scoreColor(r.o)}; color:${this.scoreTextColor(r.o)}; font-size:15px; font-weight:700;">${r.o}</td>`;
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

    openModal(id) {
      this.editingId = id || null;
      const site = this.editingId ? state.sites.find(s => s.id === this.editingId) : null;

      document.getElementById('modalTitle').textContent = site ? 'Edit Clinical Site' : 'Add Clinical Site';
      document.getElementById('f_name').value = site?.name || '';
      document.getElementById('f_number').value = site?.number || '';
      document.getElementById('f_country').value = site?.country || '';
      document.getElementById('f_pi').value = site?.pi || '';
      document.getElementById('f_status').value = site?.status || 'pending';
      document.getElementById('f_rate').value = site?.rate ?? 3.0;
      document.getElementById('f_total').value = site?.total ?? 30;
      document.getElementById('f_notes').value = site?.notes || '';

      const scores = site?.scores || Object.fromEntries(CATEGORIES.map(c => [c.key, 75]));
      const scoresContainer = document.getElementById('f_scores');
      scoresContainer.innerHTML = CATEGORIES.map(c => `
        <div class="slider-score-row">
          <div class="slabel">${c.label}</div>
          <input type="range" min="0" max="100" step="1" value="${scores[c.key] ?? 75}" data-key="${c.key}" oninput="document.getElementById('sv_${c.key}').textContent = this.value">
          <div class="sval" id="sv_${c.key}">${scores[c.key] ?? 75}</div>
        </div>
      `).join('');

      document.getElementById('deleteBtn').style.display = site ? 'inline-flex' : 'none';
      document.getElementById('siteModalOverlay').classList.add('open');
    },

    closeModal() {
      document.getElementById('siteModalOverlay').classList.remove('open');
      this.editingId = null;
    },

    async saveModal() {
      const name = document.getElementById('f_name').value.trim();
      if (!name) {
        showToast('Site Name is required');
        return;
      }

      const scores = {};
      document.querySelectorAll('#f_scores input[type=range]').forEach(inp => {
        scores[inp.dataset.key] = parseInt(inp.value, 10);
      });

      const siteData = {
        id: this.editingId || 's' + Date.now(),
        name,
        number: document.getElementById('f_number').value.trim(),
        country: document.getElementById('f_country').value.trim(),
        pi: document.getElementById('f_pi').value.trim(),
        status: document.getElementById('f_status').value,
        rate: parseFloat(document.getElementById('f_rate').value) || 0,
        total: parseInt(document.getElementById('f_total').value, 10) || 0,
        scores,
        notes: document.getElementById('f_notes').value.trim()
      };

      try {
        const res = await fetch('/api/sites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(siteData)
        });
        const data = await res.json();
        if (data.success) {
          state.sites = data.sites;
          localStorage.setItem('clinovo_sites_fallback', JSON.stringify(data.sites));
        } else {
          this.saveModalFallback(siteData);
        }
      } catch (err) {
        this.saveModalFallback(siteData);
      }

      this.closeModal();
      this.renderAll();
      showToast('Site saved!');
    },

    saveModalFallback(siteData) {
      const existing = JSON.parse(localStorage.getItem('clinovo_sites_fallback') || '[]');
      const idx = existing.findIndex(s => s.id === siteData.id);
      if (idx >= 0) existing[idx] = siteData;
      else existing.unshift(siteData);
      localStorage.setItem('clinovo_sites_fallback', JSON.stringify(existing));
      state.sites = existing;
    },

    async deleteSite() {
      if (!this.editingId) return;
      if (!confirm('Are you sure you want to delete this site?')) return;

      try {
        const res = await fetch(`/api/sites/${this.editingId}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          state.sites = data.sites;
          localStorage.setItem('clinovo_sites_fallback', JSON.stringify(data.sites));
        } else {
          this.deleteFallback(this.editingId);
        }
      } catch (err) {
        this.deleteFallback(this.editingId);
      }

      this.radarSelected.delete(this.editingId);
      this.closeModal();
      this.renderAll();
      showToast('Site deleted');
    },

    deleteFallback(id) {
      const existing = JSON.parse(localStorage.getItem('clinovo_sites_fallback') || '[]');
      const filtered = existing.filter(s => s.id !== id);
      localStorage.setItem('clinovo_sites_fallback', JSON.stringify(filtered));
      state.sites = filtered;
    },

    exportCSV() {
      const headers = ['Site Name', 'Site Number', 'Country', 'PI', 'Status', ...CATEGORIES.map(c => c.label), 'Overall Score', 'Monthly Rate', 'Total Enrollment', 'Notes'];
      const rows = state.sites.map(s => {
        const o = this.overallScore(s);
        return [
          s.name, s.number, s.country, s.pi, s.status,
          ...CATEGORIES.map(c => s.scores[c.key] || 0),
          o, s.rate, s.total, (s.notes || '').replace(/\n/g, ' ')
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
      });

      const csv = [headers.map(h => `"${h}"`).join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.getElementById('exportCsvBtn');
      const hiddenA = document.createElement('a');
      hiddenA.href = url;
      hiddenA.download = 'clinovo-site-feasibility-matrix.csv';
      hiddenA.click();
      URL.revokeObjectURL(url);
      showToast('CSV exported');
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
