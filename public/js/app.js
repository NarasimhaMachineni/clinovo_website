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
      }, 450);
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
        { id: 'overhead', type: 'text', label: 'Does the site require a separate institutional overhead / indirect cost rate?' },
        { id: 'startupTimeline', type: 'text', label: 'Anticipated start-up timeline (contract execution to first patient enrolled)' },
        { id: 'q_timelines', type: 'yesno', label: "Is the site able to meet the sponsor's proposed study timelines?" },
        { id: 'q_coi', type: 'yesno', label: 'Are there any anticipated conflicts of interest requiring disclosure?' },
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
        { id: 'outcome', type: 'select', label: 'Feasibility outcome', options: ['Approved', 'Approved with conditions', 'Not approved'] },
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

      if (Array.isArray(returnedSites)) {
        const cleanSites = returnedSites.filter(s => !['s01', 's02', 's03', 's1', 's2', 's3', 's4', 's5'].includes(s.id));
        state.sites = cleanSites;
        localStorage.setItem('onc-phase3-sfq:site-dashboard-v1', JSON.stringify({ sites: cleanSites, weights: state.weights }));
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
        weeks: parseInt(this.answers['sivToFPI'], 10) || 12,
        scores: scores,
        notes: 'Submitted via Client Site Feasibility Portal'
      };

      let existing = [];
      try {
        const savedDash = localStorage.getItem('onc-phase3-sfq:site-dashboard-v1');
        if (savedDash) {
          const parsed = JSON.parse(savedDash);
          existing = parsed.sites || [];
        } else {
          existing = JSON.parse(localStorage.getItem('clinovo_sites_fallback') || '[]');
        }
      } catch (e) {}

      const mockIds = new Set(['s01', 's02', 's03', 's1', 's2', 's3', 's4', 's5']);
      existing = existing.filter(s => !mockIds.has(s.id));
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
  // 3. ADMIN FEASIBILITY DASHBOARD MODULE (EXACT SPEC & REAL CLIENT DATA ONLY)
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
        const savedDash = localStorage.getItem('onc-phase3-sfq:site-dashboard-v1');
        if (savedDash) {
          const parsed = JSON.parse(savedDash);
          localSites = parsed.sites || [];
          if (parsed.weights) state.weights = parsed.weights;
        } else {
          const fallback = localStorage.getItem('clinovo_sites_fallback');
          if (fallback) localSites = JSON.parse(fallback);
        }
      } catch (e) {}

      // EXCLUSIVELY SHOW REAL CLIENT SUBMITTED QUESTIONNAIRES (ZERO MOCK DATA)
      const mockIds = new Set(['s01', 's02', 's03', 's1', 's2', 's3', 's4', 's5']);
      apiSites = apiSites.filter(s => !mockIds.has(s.id));
      localSites = localSites.filter(s => !mockIds.has(s.id));

      const mergedMap = new Map();
      apiSites.forEach(s => mergedMap.set(s.id, s));
      localSites.forEach(s => mergedMap.set(s.id, s));

      state.sites = Array.from(mergedMap.values());

      localStorage.setItem('onc-phase3-sfq:site-dashboard-v1', JSON.stringify({ sites: state.sites, weights: state.weights }));
      localStorage.setItem('clinovo_sites_fallback', JSON.stringify(state.sites));

      if (state.sites.length > 0) {
        this.radarSelected = new Set(state.sites.slice(0, Math.min(3, state.sites.length)).map(s => s.id));
      } else {
        this.radarSelected.clear();
      }
      this.renderAll();
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
            <div class="k-label">No client questionnaire data submitted yet</div>
            <div class="k-sub" style="margin-top:4px;">When a client submits a site feasibility questionnaire, their record will appear here live.</div>
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
        { label: 'Top performer', val: top.s.name.split(' ').slice(0, 2).join(' '), sub: 'score ' + top.o },
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
        el.innerHTML = `<span style="font-size:12px; color:var(--ink-soft);">No client submitted sites to compare</span>`;
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
        s += `<text x="${cx}" y="${cy}" text-anchor="middle" font-size="13" fill="#8A94A3">${state.sites.length ? 'Select sites above to compare' : 'No client site data'}</text>`;
      }

      svg.setAttribute('viewBox', '0 0 400 400');
      svg.innerHTML = s;
    },

    renderRank() {
      const svg = document.getElementById('rankSvg');
      if (!svg) return;

      if (!state.sites.length) {
        svg.setAttribute('viewBox', '0 0 320 100');
        svg.innerHTML = `<text x="160" y="50" font-size="12" fill="#8A94A3" text-anchor="middle">No client sites submitted yet</text>`;
        return;
      }

      const ranked = state.sites.map(s => ({ s, o: this.overallScore(s) })).sort((a, b) => b.o - a.o);
      const rowH = 42, top = 16, left = 14, chartW = 230, chartMaxX = left + chartW;
      const H = Math.max(200, top + ranked.length * rowH + 16);
      let s = '';

      ranked.forEach((r, i) => {
        const y = top + i * rowH;
        const w = (r.o / 100) * chartW;
        const color = STATUS_COLOR[r.s.status] || '#8A94A3';
        s += `<text x="${left}" y="${y + 14}" font-size="12" font-weight="600" fill="#16233D">${r.s.name.length > 26 ? r.s.name.slice(0, 24) + '…' : r.s.name}</text>`;
        s += `<rect x="${left}" y="${y + 20}" width="${chartW}" height="10" rx="5" fill="#EEF0F3"/>`;
        s += `<rect x="${left}" y="${y + 20}" width="${Math.max(4, w)}" height="10" rx="5" fill="${color}"/>`;
        s += `<text x="${chartMaxX + 10}" y="${y + 29}" font-size="12" font-family="ui-monospace,monospace" fill="#16233D">${r.o}</text>`;
      });

      svg.setAttribute('viewBox', `0 0 320 ${H}`);
      svg.innerHTML = s;
    },

    renderBubble() {
      const svg = document.getElementById('bubbleSvg');
      if (!svg) return;

      const W = 900, H = 320, padL = 56, padR = 30, padT = 20, padB = 42;
      const plotW = W - padL - padR, plotH = H - padT - padB;

      if (!state.sites.length) {
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
        svg.innerHTML = `<text x="${W / 2}" y="${H / 2}" font-size="13" fill="#8A94A3" text-anchor="middle">No client site data submitted yet</text>`;
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
        s += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#EAEEF2" stroke-width="1"/>`;
        s += `<text x="${padL - 10}" y="${y + 4}" font-size="10.5" text-anchor="end" fill="#8A94A3">${v}</text>`;
      });

      const rateTicks = 5;
      for (let i = 0; i <= rateTicks; i++) {
        const v = (maxRate / rateTicks) * i;
        const x = X(v);
        s += `<line x1="${x}" y1="${padT}" x2="${x}" y2="${H - padB}" stroke="#F2F4F6" stroke-width="1"/>`;
        s += `<text x="${x}" y="${H - padB + 18}" font-size="10.5" text-anchor="middle" fill="#8A94A3">${v.toFixed(1)}</text>`;
      }

      s += `<text x="${padL + plotW / 2}" y="${H - 6}" font-size="11" text-anchor="middle" fill="#4C5A73">Projected enrollment (patients / month)</text>`;
      s += `<text x="14" y="${padT + plotH / 2}" font-size="11" fill="#4C5A73" transform="rotate(-90 14 ${padT + plotH / 2})" text-anchor="middle">Overall score</text>`;

      state.sites.forEach(site => {
        const o = this.overallScore(site);
        const cx = X(+site.rate || 0), cy = Y(o), r = Rr(+site.total || 0);
        const color = STATUS_COLOR[site.status] || '#8A94A3';
        s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" fill-opacity="0.30" stroke="${color}" stroke-width="1.6">
          <title>${site.name} — score ${o}, ${site.rate}/mo, ${site.total} total, ${STATUSES.find(x => x.key === site.status)?.label || site.status}</title>
        </circle>`;
        s += `<text x="${cx}" y="${cy + 3}" font-size="9.5" text-anchor="middle" fill="#16233D" pointer-events="none">${site.name.split(' ')[0]}</text>`;
      });

      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.innerHTML = s;

      const legend = document.getElementById('bubbleLegend');
      if (legend) {
        legend.innerHTML = STATUSES.map(st => `
          <span><span class="sw" style="background:${STATUS_COLOR[st.key]}"></span>${st.label}</span>
        `).join('');
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
                No client candidate sites submitted yet.<br>
                <span style="font-size: 12px; color: var(--grey);">Client filled questionnaires will automatically populate this dashboard table when submitted.</span>
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
        if (data.success) {
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
        if (data.success) {
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
      const headers = ['Site', 'Number', 'Country', 'PI', 'Status', ...CATEGORIES.map(c => c.label), 'Overall', 'Rate/mo', 'Total enrollment', 'Activation (wks)', 'Notes'];
      const rows = state.sites.map(s => {
        const o = this.overallScore(s);
        return [
          s.name, s.number, s.country, s.pi, STATUSES.find(x => x.key === s.status)?.label || s.status,
          ...CATEGORIES.map(c => s.scores[c.key] || 0), o, s.rate, s.total, s.weeks, (s.notes || '').replace(/\n/g, ' ')
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
      });

      const csv = [headers.map(h => `"${h}"`).join(','), ...rows].join('\n');
      try {
        const blob = new Blob([text], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'site-comparison.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('CSV exported');
      } catch (e) {
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
