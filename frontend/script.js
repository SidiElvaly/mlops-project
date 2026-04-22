/* ============================================================
   Fraud Detection System – Script
   Multi-step wizard + mock API prediction
   ============================================================ */

'use strict';

/* ── Constants ─────────────────────────────────────────────── */

const API_ENDPOINT = '/predict';
const MODEL_VERSION = 'v1.0.4-xgboost-mock';
const FRAUD_THRESHOLD = 0.5; // probability >= 50% → fraud

/**
 * Pre-set values for the "Normal Transaction" quick-fill.
 * Based on typical safe transaction profile from credit card dataset.
 */
const NORMAL_VALUES = {
  amount: 149.62,
  time: 3600,
  V1: -1.3598, V2: -0.0728, V3: 2.5364, V4: 1.3782, V5: -0.3383,
  V6: 0.4624, V7: 0.2396, V8: 0.0987, V9: 0.3638, V10: 0.0908,
  V11: -0.5516, V12: -0.6178, V13: -0.9914, V14: -0.3112, V15: 1.4681,
  V16: -0.4704, V17: 0.2076, V18: 0.0258, V19: 0.4030, V20: 0.2514,
  V21: -0.0183, V22: 0.2778, V23: -0.1105, V24: 0.0669, V25: 0.1285,
  V26: -0.1891, V27: 0.1336, V28: -0.0210,
};

/**
 * Pre-set values for the "Fraud Example" quick-fill.
 * Based on typical fraudulent transaction profile from credit card dataset.
 */
const FRAUD_VALUES = {
  
  Time: 6986,
  V1: -15.1407250468,
  V2: 9.1068987373,
  V3: -18.6478129605,
  V4: 7.5404728167,
  V5: -13.3937902316,
  V6: -4.0169540515,
  V7: -18.3129751464,
  V8: 14.9478923144,
  V9: -9.1833829918,
  V10: -12.9081486815,
  V11: 9.1836769478,
  V12: -14.3265801858,
  V13: 0.9557998823,
  V14: -14.3143895488,
  V15: -0.4378829107,
  V16: -10.5462580902,
  V17: -17.1817502068,
  V18: -4.9995437049,
  V19: 1.6997149834,
  V20: 0.8697569824,
  V21: 2.1796497543,
  V22: -0.5912578116,
  V23: -0.5030286672,
  V24: -0.1811580519,
  V25: -0.3089635024,
  V26: 0.1175502614,
  V27: 2.1030466533,
  V28: 0.8336321791,
  Amount: 245.00
};

/* ── DOM References ────────────────────────────────────────── */

const screens = {
  welcome: document.getElementById('screen-welcome'),
  step1:   document.getElementById('screen-step1'),
  step2:   document.getElementById('screen-step2'),
  step3:   document.getElementById('screen-step3'),
  loading: document.getElementById('screen-loading'),
  safe:    document.getElementById('screen-safe'),
  fraud:   document.getElementById('screen-fraud'),
};

const toast = document.getElementById('toast');

/* ── Screen Navigation ──────────────────────────────────────── */

/**
 * Show a specific screen by ID key, hide all others.
 * @param {string} key – key in the `screens` map
 */
function showScreen(key) {
  Object.values(screens).forEach(el => el.classList.remove('active'));
  const target = screens[key];
  if (target) {
    target.classList.add('active');
    // Restart animation
    target.style.animation = 'none';
    target.offsetHeight; // reflow
    target.style.animation = '';
  }
}

/* ── Toast Notifications ────────────────────────────────────── */

let toastTimer = null;

/**
 * Display a toast message.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 * @param {number} duration – ms before auto-hide
 */
function showToast(message, type = 'info', duration = 3200) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/* ── PCA Inputs Builder ─────────────────────────────────────── */

/**
 * Generate V-input fields inside a grid element.
 * @param {string} gridId – id of the .pca-grid element
 * @param {number} from   – starting V index (inclusive)
 * @param {number} to     – ending V index (inclusive)
 */
function buildPCAGroup(gridId, from, to) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';

  for (let i = from; i <= to; i++) {
    const field = document.createElement('div');
    field.className = 'pca-field';
    field.innerHTML = `
      <label for="V${i}">V${i}</label>
      <input type="number" id="V${i}" name="V${i}" step="any" placeholder="0.0000" />
    `;
    grid.appendChild(field);
  }
}

/* ── Fill Helpers ───────────────────────────────────────────── */

/**
 * Populate all form inputs with given values object.
 * @param {Object} values – map of field name → value
 */
function fillValues(values) {
  Object.entries(values).forEach(([key, val]) => {
    const el = document.getElementById(key);
    if (el) el.value = val;
  });
}

/** Generate a random float in [min, max] rounded to 4 decimals. */
function randFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(4));
}

/** Build random values for all fields. */
function buildRandomValues() {
  const vals = {
    amount: randFloat(1, 5000),
    time:   Math.floor(Math.random() * 172800),
  };
  for (let i = 1; i <= 28; i++) {
    vals[`V${i}`] = randFloat(-5, 5);
  }
  return vals;
}

/* ── Input Validation ───────────────────────────────────────── */

/** Validate Step 1 inputs. Returns true if valid. */
function validateStep1() {
  const amount = document.getElementById('amount');
  const time   = document.getElementById('time');
  let valid = true;

  [amount, time].forEach(el => {
    el.classList.remove('error');
    if (el.value === '' || isNaN(parseFloat(el.value)) || parseFloat(el.value) < 0) {
      el.classList.add('error');
      valid = false;
    }
  });

  if (!valid) {
    showToast('Please fill in all required fields with valid values.', 'error');
  }
  return valid;
}

/** Validate Step 2: all V1–V28 must be filled. Returns true if valid. */
function validateStep2() {
  let valid = true;
  for (let i = 1; i <= 28; i++) {
    const el = document.getElementById(`V${i}`);
    if (!el) continue;
    el.classList.remove('error');
    if (el.value === '' || isNaN(parseFloat(el.value))) {
      el.classList.add('error');
      valid = false;
    }
  }
  if (!valid) {
    showToast('Please fill in all PCA variables (V1–V28).', 'error');
  }
  return valid;
}

/* ── Review Step ────────────────────────────────────────────── */

/** Update the Review screen summary with current field values. */
function updateReview() {
  const amount = parseFloat(document.getElementById('amount').value) || 0;
  const time   = parseFloat(document.getElementById('time').value)   || 0;

  document.getElementById('review-amount').textContent = `$${amount.toFixed(2)}`;
  document.getElementById('review-time').textContent   = `${time}s`;
}

/* ── Collect Payload ────────────────────────────────────────── */

/** Gather all input values into a flat object for the API. */
function collectPayload() {
  const payload = {
    Amount: parseFloat(document.getElementById('amount').value),
    Time:   parseFloat(document.getElementById('time').value),
  };
  for (let i = 1; i <= 28; i++) {
    payload[`V${i}`] = parseFloat(document.getElementById(`V${i}`).value);
  }
  return payload;
}

/* ── API Call & Mock Fallback ───────────────────────────────── */

/**
 * Post transaction data to the prediction endpoint.
 * Falls back to a mock result if the server is unavailable.
 * @param {Object} payload
 * @returns {Promise<{fraud: boolean, probability: number, model_version: string}>}
 */
async function predictFraud(payload) {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return {
      fraud:         data.fraud ?? (data.prediction === 1),
      probability:   data.probability ?? data.fraud_probability ?? 0,
      model_version: data.model_version ?? MODEL_VERSION,
    };

  } catch (err) {
    console.warn('API unavailable, using mock prediction:', err.message);

    // ── Mock prediction logic ──
    // Simple heuristic: use payload to produce a deterministic-ish result
    const v1v3sum  = (payload.V1 || 0) + (payload.V3 || 0);
    const amount   = payload.Amount || 0;
    const mockProb = Math.min(1, Math.max(0,
      0.5 - (v1v3sum * 0.04) + (amount > 1000 ? 0.1 : -0.05) + (Math.random() * 0.12 - 0.06)
    ));

    return {
      fraud:         mockProb >= FRAUD_THRESHOLD,
      probability:   mockProb,
      model_version: MODEL_VERSION,
    };
  }
}

/* ── Display Result ─────────────────────────────────────────── */

/**
 * Animate and show the result screen.
 * @param {{fraud: boolean, probability: number, model_version: string}} result
 */
function displayResult(result) {
  const pct = (result.probability * 100).toFixed(2) + '%';
  const barWidth = Math.min(100, (result.probability * 100)).toFixed(1) + '%';

  if (result.fraud) {
    document.getElementById('fraud-prob').textContent  = pct;
    document.getElementById('fraud-model').textContent = result.model_version;
    showScreen('fraud');
    // Animate bar after screen shown
    setTimeout(() => {
      document.getElementById('fraud-bar').style.width = barWidth;
    }, 60);
  } else {
    document.getElementById('safe-prob').textContent  = pct;
    document.getElementById('safe-model').textContent = result.model_version;
    showScreen('safe');
    setTimeout(() => {
      document.getElementById('safe-bar').style.width = barWidth;
    }, 60);
  }
}

/* ── PCA Group Accordion ────────────────────────────────────── */

/** Toggle open/collapsed state of a PCA group body. */
function togglePCAGroup(btn) {
  const targetId = btn.getAttribute('data-target');
  const body     = document.getElementById(targetId);
  if (!body) return;

  const isCollapsed = body.classList.contains('collapsed');
  body.classList.toggle('collapsed', !isCollapsed);
  btn.classList.toggle('open', isCollapsed);
}

/* ── Reset Form ─────────────────────────────────────────────── */

/** Clear all form fields and reset state. */
function resetForm() {
  // Reset basic fields
  ['amount', 'time'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.value = ''; el.classList.remove('error'); }
  });

  // Reset V fields
  for (let i = 1; i <= 28; i++) {
    const el = document.getElementById(`V${i}`);
    if (el) { el.value = ''; el.classList.remove('error'); }
  }

  // Reset probability bars
  document.getElementById('safe-bar').style.width  = '0%';
  document.getElementById('fraud-bar').style.width = '0%';

  // Collapse all PCA groups except first
  document.querySelectorAll('.pca-group-body').forEach((body, idx) => {
    if (idx === 0) {
      body.classList.remove('collapsed');
      const btn = body.previousElementSibling;
      if (btn) btn.classList.add('open');
    } else {
      body.classList.add('collapsed');
      const btn = body.previousElementSibling;
      if (btn) btn.classList.remove('open');
    }
  });
}

/* ── Event Listeners ────────────────────────────────────────── */

// Welcome → Step 1
document.getElementById('btn-start').addEventListener('click', () => {
  showScreen('step1');
});

// Step 1: quick-fill helpers
document.getElementById('btn-normal-1').addEventListener('click', () => {
  fillValues({ amount: NORMAL_VALUES.amount, time: NORMAL_VALUES.time });
  showToast('Normal transaction values applied.', 'success');
});
document.getElementById('btn-fraud-1').addEventListener('click', () => {
  fillValues({ amount: FRAUD_VALUES.amount, time: FRAUD_VALUES.time });
  showToast('Fraud example values applied.', 'info');
});
document.getElementById('btn-random-1').addEventListener('click', () => {
  const r = buildRandomValues();
  fillValues({ amount: r.amount, time: r.time });
  showToast('Random values applied.', 'info');
});

// Step 1 → Step 2
document.getElementById('btn-step1-next').addEventListener('click', () => {
  if (!validateStep1()) return;
  showScreen('step2');
});

// Step 2: quick-fill helpers (fill all 28 V values)
document.getElementById('btn-normal-2').addEventListener('click', () => {
  fillValues(NORMAL_VALUES);
  showToast('Normal transaction V-values applied.', 'success');
});
document.getElementById('btn-fraud-2').addEventListener('click', () => {
  fillValues(FRAUD_VALUES);
  showToast('Fraud example V-values applied.', 'info');
});
document.getElementById('btn-random-2').addEventListener('click', () => {
  fillValues(buildRandomValues());
  showToast('Random V-values applied.', 'info');
});

// PCA group accordion toggles
document.querySelectorAll('.pca-group-header').forEach(btn => {
  btn.addEventListener('click', () => togglePCAGroup(btn));
});

// Step 2 → Step 1 (back)
document.getElementById('btn-step2-back').addEventListener('click', () => {
  showScreen('step1');
});

// Step 2 → Step 3 (review)
document.getElementById('btn-step2-next').addEventListener('click', () => {
  if (!validateStep2()) return;
  updateReview();
  showScreen('step3');
});

// Step 3 → Step 2 (back)
document.getElementById('btn-step3-back').addEventListener('click', () => {
  showScreen('step2');
});

// Step 3 → Predict
document.getElementById('btn-predict').addEventListener('click', async () => {
  const payload = collectPayload();
  showScreen('loading');

  try {
    const result = await predictFraud(payload);
    displayResult(result);
  } catch (err) {
    console.error('Prediction failed:', err);
    showToast('Prediction failed. Please try again.', 'error');
    showScreen('step3');
  }
});

// Restart buttons
document.getElementById('btn-restart-safe').addEventListener('click', () => {
  resetForm();
  showScreen('welcome');
});
document.getElementById('btn-restart-fraud').addEventListener('click', () => {
  resetForm();
  showScreen('welcome');
});

/* ── Init ───────────────────────────────────────────────────── */

/** Initialize the app: build PCA grids, open first group, show welcome. */
function init() {
  buildPCAGroup('grid-a', 1,  10);
  buildPCAGroup('grid-b', 11, 20);
  buildPCAGroup('grid-c', 21, 28);

  // Open first group by default
  const firstHeader = document.querySelector('.pca-group-header');
  const firstBody   = document.getElementById('group-a');
  if (firstHeader && firstBody) {
    firstBody.classList.remove('collapsed');
    firstHeader.classList.add('open');
  }

  showScreen('welcome');
}

init();
