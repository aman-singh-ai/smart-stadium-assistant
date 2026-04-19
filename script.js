/* ==========================================================
   PSIS — Predictive Stadium Intelligence System
   script.js — All interactive logic
   ========================================================== */

// =========================================================
// 1. PARTICLE BACKGROUND
// =========================================================
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.5 + 0.4;
      this.a  = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,180,255,${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,140,255,${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(draw);
  }
  draw();
})();

// =========================================================
// 2. LIVE MATCH TIMER
// =========================================================
(function matchTimer() {
  const el = document.getElementById('match-time');
  if (!el) return;
  let mins = 88, secs = 23;
  setInterval(() => {
    secs++;
    if (secs >= 60) { secs = 0; mins++; }
    el.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  }, 1000);
})();

// =========================================================
// 3. LIVE DATA INDICATORS
// =========================================================
const LIVE_UPDATE_TEXTS = [
  'Crowd data updating…',
  'Scanning all gates…',
  'AI prediction running…',
  'Refreshing live stats…',
  'Gate sensors active…',
  'Processing crowd flow…'
];
let liveTextIdx = 0;
setInterval(() => {
  const el = document.getElementById('live-update-text');
  if (!el) return;
  liveTextIdx = (liveTextIdx + 1) % LIVE_UPDATE_TEXTS.length;
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = LIVE_UPDATE_TEXTS[liveTextIdx];
    el.style.opacity = '1';
    el.style.transition = 'opacity 0.4s';
  }, 300);
}, 3500);

// =========================================================
// 4. LIVE STATS AUTO-UPDATE
// =========================================================
function randomBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

setInterval(() => {
  const capacity = randomBetween(72, 92);
  const wait     = randomBetween(3, 9);
  const crowd    = (randomBetween(38, 47)) + 'k';
  document.getElementById('stat-capacity').innerHTML = `${capacity}<span class="stat-pct">%</span>`;
  document.getElementById('stat-wait').innerHTML     = `${wait}<span class="stat-pct">m</span>`;
  document.getElementById('stat-crowd').textContent  = crowd;
}, 6000);

// =========================================================
// 5. CROWD PREDICTION ENGINE
// =========================================================
const CROWD_PREDICTIONS = [
  { gate: 'Gate 2 (East)', msg: 'Crowd surge expected in ~5 min', level: 'high',   conf: 87, color: '#ff4a4a' },
  { gate: 'Gate 3 (South)', msg: 'Moderate flow, slight increase', level: 'medium', conf: 74, color: '#ffbe00' },
  { gate: 'Gate 4 (West)',  msg: 'Optimal exit — stays clear',    level: 'low',    conf: 91, color: '#00e67a' },
  { gate: 'Gate 1 (North)', msg: 'Light crowd, safe in 10 min',   level: 'low',    conf: 68, color: '#00e67a' },
];

function renderPredictions() {
  const list = document.getElementById('predictions-list');
  if (!list) return;
  list.innerHTML = '';
  CROWD_PREDICTIONS.forEach((pred, i) => {
    // slight random variance on conf
    const conf = Math.min(99, pred.conf + randomBetween(-4, 4));
    const item = document.createElement('div');
    item.className = 'pred-item';
    item.style.animationDelay = `${i * 0.08}s`;
    item.innerHTML = `
      <div class="pred-left">
        <span class="pred-gate">${pred.gate}</span>
        <span class="pred-msg">${pred.msg}</span>
      </div>
      <div class="pred-right">
        <span class="pred-conf" style="color:${pred.color}">${conf}%</span>
        <div class="conf-bar-track">
          <div class="conf-bar-fill" style="width:0%;background:${pred.color}" data-width="${conf}"></div>
        </div>
      </div>
    `;
    list.appendChild(item);
  });
  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.conf-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
  }, 120);
}
renderPredictions();
setInterval(renderPredictions, 8000);

// =========================================================
// 6. GATE MAP INTERACTION
// =========================================================
const GATE_DATA = {
  1: { level: 'low',    badge: 'LOW',    color: '#00e67a', desc: 'North Gate — very low traffic. Safe to use.' },
  2: { level: 'high',   badge: 'HIGH',   color: '#ff4a4a', desc: 'East Gate — heavily crowded. Avoid if possible. Use Gate 4.' },
  3: { level: 'medium', badge: 'MED',    color: '#ffbe00', desc: 'South Gate — moderate crowd. 3-min wait estimated.' },
  4: { level: 'low',    badge: 'LOW',    color: '#00e67a', desc: 'West Gate — clear! Recommended exit.' },
};

function selectGate(num) {
  const data    = GATE_DATA[num];
  const tooltip = document.getElementById('gate-tooltip');
  document.getElementById('gt-name').textContent   = `Gate ${num}`;
  document.getElementById('gt-desc').textContent   = data.desc;
  const badge = document.getElementById('gt-badge');
  badge.textContent  = data.badge;
  badge.className    = `gt-badge ${data.level}`;
  tooltip.style.display = 'block';

  // hide after 5s
  clearTimeout(window._gateTooltipTimer);
  window._gateTooltipTimer = setTimeout(() => {
    tooltip.style.display = 'none';
  }, 5000);
}

// =========================================================
// 7. PERSONALIZED NAVIGATION
// =========================================================
function navigateSeat() {
  const input = document.getElementById('seat-input').value.trim();
  if (!input) {
    shakeInput('seat-input');
    return;
  }

  const seatUpper = input.toUpperCase();
  const resultEl  = document.getElementById('nav-result');
  resultEl.style.display = 'block';

  // Parse section letter from seat (e.g. B-12 → section B)
  const match   = seatUpper.match(/^([A-Z])/);
  const section = match ? match[1] : 'B';

  const routes = {
    A: { path: ['Enter via Gate 1 (North)', 'Turn right past concourse', 'Section A — rows 1–20'], food: 'Gate 1 Food Court', wash: 'NW Washroom Block' },
    B: { path: ['Enter via Gate 4 (West)',  'Follow left corridor',      'Section B — find your row'], food: 'Gate 3 Stall B', wash: 'Gate 2 Washroom' },
    C: { path: ['Enter via Gate 3 (South)', 'Take central ramp up',      'Section C — upper tier'],    food: 'South Food Hub',  wash: 'South Washroom' },
    D: { path: ['Enter via Gate 2 (East)',  'Use right stairwell',        'Section D — east stand'],    food: 'East Snack Bar',  wash: 'East Washroom' },
  };
  const route = routes[section] || routes['B'];

  resultEl.innerHTML = `
    <div style="margin-bottom:10px;font-size:0.72rem;font-weight:700;color:var(--neon);letter-spacing:0.06em;text-transform:uppercase;">Route to Seat ${seatUpper}</div>
    ${route.path.map((step, i) => `
      <div class="nav-step">
        <div class="nav-step-num">${i + 1}</div>
        <span>${step}</span>
      </div>
    `).join('')}
    <div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(0,180,255,0.15);display:flex;gap:12px;font-size:0.72rem;color:var(--text-s);">
      <span>🍔 ${route.food}</span>
      <span>🚻 ${route.wash}</span>
    </div>
  `;
}

function shakeInput(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.animation = 'none';
  el.style.borderColor = 'var(--red)';
  el.style.boxShadow  = '0 0 0 3px rgba(255,74,74,0.2)';
  setTimeout(() => { el.style.borderColor = ''; el.style.boxShadow = ''; }, 1000);
}

// Enter key for seat input
document.getElementById('seat-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') navigateSeat();
});

// =========================================================
// 8. QUICK ACTIONS (Dashboard)
// =========================================================
const QUICK_RESPONSES = {
  food:    { icon: '🍔', text: 'Nearest food stall: Gate 3 — current wait ~5 min. Grab your burger before half-time ends!' },
  toilet:  { icon: '🚻', text: 'Washroom near Gate 2 is clean and available. Less than 60 seconds away from Section B.' },
  exit:    { icon: '🚪', text: 'Best exit: Gate 4 (West) — least congested. Estimated gate clearance: 3 minutes.' },
  seat:    { icon: '💺', text: 'Use left corridor → follow blue signage → Section B → Row 5. Staff available to assist.' },
  crowd:   { icon: '👥', text: 'Gate 2 is at 91% capacity. Gate 4 is clear. AI recommends using the West exit path.' },
  default: { icon: '🤖', text: 'I\'m your Stadium AI. Ask about food, washrooms, exits, crowd, or enter your seat number above.' },
};

function triggerQuickAction(type) {
  const btn  = document.getElementById('qb-' + (type === 'toilet' ? 'wash' : type));
  const data = QUICK_RESPONSES[type] || QUICK_RESPONSES.default;
  const card = document.getElementById('response-card');
  const icon = document.getElementById('rc-icon');
  const text = document.getElementById('rc-text');

  // Button pop animation
  if (btn) {
    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 400);
  }

  card.style.display = 'none';
  setTimeout(() => {
    icon.textContent = data.icon;
    text.textContent = data.text;
    card.style.display = 'flex';
  }, 180);
}

function closeResponseCard() {
  document.getElementById('response-card').style.display = 'none';
}

// =========================================================
// 9. FLOATING CHAT PANEL
// =========================================================
let chatOpen = false;

function toggleChat() {
  chatOpen = !chatOpen;
  const panel = document.getElementById('chat-panel');
  const fab   = document.getElementById('fab-btn');
  panel.classList.toggle('open', chatOpen);
  panel.setAttribute('aria-hidden', String(!chatOpen));
  fab.classList.toggle('open', chatOpen);
  if (chatOpen) document.getElementById('cp-input').focus();
}

const AI_KNOWLEDGE = {
  food:    { icon: '🍔', text: 'Nearest food stall is Gate 3. Estimated wait: 5 minutes. Today\'s special: Loaded Nachos & Hot Dogs!' },
  eat:     { icon: '🍕', text: 'Food options: Gate 3 (burgers, hot dogs) — Gate 1 (pizza, wraps). Gate 3 is quickest right now.' },
  hungry:  { icon: '🌮', text: 'Head to Gate 3 Food Court — shortest queue currently (5 min). Gate 1 is also open.' },
  snack:   { icon: '🍿', text: 'Snacks available at all gate kiosks. Gate 4 kiosk has the shortest line right now.' },
  toilet:  { icon: '🚻', text: 'Washroom near Gate 2 — clean and available. Also one near Gate 4 (less crowded).' },
  washroom:{ icon: '🚻', text: 'Nearest clean washroom: Gate 2 (North section). Gate 4 washroom is even less busy.' },
  bathroom:{ icon: '🚽', text: 'Washroom near Gate 2 is your best bet — clean and just a 1-min walk from any central section.' },
  exit:    { icon: '🚪', text: 'Best exit: Gate 4 (West) — minimal crowd. Gate 1 (North) is also fairly clear. Avoid Gate 2.' },
  leave:   { icon: '🚶', text: 'I recommend leaving via Gate 4. Our AI detects it\'s 73% less crowded than Gate 2 right now.' },
  seat:    { icon: '💺', text: 'To find your seat: enter your seat number in the navigation panel above! I\'ll generate your custom route.' },
  section: { icon: '🗺️', text: 'Sections A, B, C are in the lower tier. D, E, F are upper. Enter your seat above for a custom route!' },
  crowd:   { icon: '👥', text: 'Gate 2 is heavily crowded (91%). Gate 4 is clear (18% capacity). AI predicts Gate 2 gets worse in 5 min.' },
  busy:    { icon: '⚠️', text: 'The most congested area right now is Gate 2. Gate 4 (West) and Gate 1 (North) are your best alternatives.' },
  parking: { icon: '🚗', text: 'Parking lot A (West) is 40% full. Lot B (East) is 85% full. Recommend West exit → Lot A.' },
  medical: { icon: '🏥', text: 'Medical station is near Gate 1 (South-West corner). Staff on duty. Emergency: dial stadium ext. 999.' },
  help:    { icon: '🤖', text: 'I can help with: 🍔 Food locations, 🚻 Washrooms, 🚪 Exits, 💺 Seating, 👥 Crowd status, 🚗 Parking.' },
  hi:      { icon: '👋', text: 'Hey there! I\'m your PSIS Stadium AI. Ask me about food, washrooms, exits, seating, or crowd status!' },
  hello:   { icon: '🙌', text: 'Hello! Welcome to the Smart Stadium. I can guide you to food, your seat, washrooms, or exits. What do you need?' },
};

function getAIReply(input) {
  const lower = input.toLowerCase().trim();
  for (const [keyword, data] of Object.entries(AI_KNOWLEDGE)) {
    if (lower.includes(keyword)) return data;
  }
  return { icon: '🤖', text: 'I\'m your Stadium AI! Ask about food stalls, washrooms, exits, crowd status, or your seat navigation.' };
}

function appendChatMsg(sender, text, type = 'ai') {
  const box    = document.getElementById('cp-messages');
  const msgEl  = document.createElement('div');
  msgEl.className = `cp-msg ${type}`;
  msgEl.innerHTML = `
    <div class="cp-sender">${sender === 'You' ? 'You' : 'Stadium AI'}</div>
    <div class="cp-bubble">${text}</div>
  `;
  box.appendChild(msgEl);
  box.scrollTop = box.scrollHeight;
}

function showTypingDots() {
  const box = document.getElementById('cp-messages');
  const el  = document.createElement('div');
  el.className = 'cp-msg ai';
  el.id = 'typing-indicator';
  el.innerHTML = `
    <div class="cp-sender">Stadium AI</div>
    <div class="cp-bubble typing-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  box.appendChild(el);
  box.scrollTop = box.scrollHeight;
}

function removeTypingDots() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

function chatSend() {
  const inputEl = document.getElementById('cp-input');
  const text    = inputEl.value.trim();
  if (!text) return;

  appendChatMsg('You', text, 'user');
  inputEl.value = '';
  inputEl.focus();

  showTypingDots();
  const reply = getAIReply(text);

  setTimeout(() => {
    removeTypingDots();
    appendChatMsg('AI', `${reply.icon} ${reply.text}`, 'ai');
    document.getElementById('cp-status').textContent = 'Online — ready';
  }, 800 + Math.random() * 400);
}

function chatKey(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    chatSend();
  }
}

function chatQuick(type) {
  const labels = { food: 'Food nearby?', toilet: 'Washroom?', exit: 'Best exit?', crowd: 'Crowd status?' };
  const inputEl = document.getElementById('cp-input');
  inputEl.value = labels[type] || type;
  chatSend();
}

function clearChatPanel() {
  const box = document.getElementById('cp-messages');
  box.innerHTML = '';
  appendChatMsg('AI', '🤖 Chat cleared! Ask me anything about the stadium — food, exits, washrooms, crowd, or your seat!', 'ai');
}

// =========================================================
// 10. VOICE INPUT (Web Speech API)
// =========================================================
let recognition = null;
let voiceActive = false;

function toggleVoice() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    appendChatMsg('AI', '⚠️ Voice input is not supported in this browser. Try Chrome for the best experience!', 'ai');
    if (!chatOpen) toggleChat();
    return;
  }

  if (voiceActive) {
    stopVoice();
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onstart = () => {
    voiceActive = true;
    document.getElementById('voice-banner').style.display = 'flex';
    document.getElementById('cp-mic-btn').classList.add('listening');
    document.getElementById('cp-status').textContent = '🎤 Listening…';
  };

  recognition.onresult = e => {
    const transcript = e.results[0][0].transcript;
    document.getElementById('cp-input').value = transcript;
    stopVoice();
    if (!chatOpen) toggleChat();
    setTimeout(chatSend, 300);
  };

  recognition.onerror = () => { stopVoice(); };
  recognition.onend   = () => { stopVoice(); };
  recognition.start();
}

function stopVoice() {
  voiceActive = false;
  if (recognition) { try { recognition.stop(); } catch(e){} recognition = null; }
  document.getElementById('voice-banner').style.display = 'none';
  document.getElementById('cp-mic-btn').classList.remove('listening');
  document.getElementById('cp-status').textContent = 'Online — ready';
}

// =========================================================
// 11. EMERGENCY MODE
// =========================================================
let emergencyActive = false;

function activateEmergency() {
  emergencyActive = true;
  document.getElementById('emg-overlay').style.display = 'flex';
  document.getElementById('emg-btn').textContent = '🚨 ACTIVE';

  // Start evacuation countdown
  let totalSecs = 260; // 4 min 20 sec
  const etaEl = document.getElementById('emg-eta-val');
  window._emgTimer = setInterval(() => {
    totalSecs--;
    if (totalSecs <= 0) { clearInterval(window._emgTimer); etaEl.textContent = 'EVACUATED'; return; }
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    etaEl.textContent = `${m} min ${String(s).padStart(2, '0')} sec`;
  }, 1000);

  // Also highlight Gate 2 on map as red pulsing
  const g2 = document.getElementById('gate-2');
  if (g2) g2.style.filter = 'drop-shadow(0 0 12px #ff4a4a)';
}

function cancelEmergency() {
  emergencyActive = false;
  document.getElementById('emg-overlay').style.display = 'none';
  document.getElementById('emg-btn').textContent = 'ACTIVATE';
  clearInterval(window._emgTimer);
  const g2 = document.getElementById('gate-2');
  if (g2) g2.style.filter = '';
}

// =========================================================
// 12. AI TIPS (rotating)
// =========================================================
const AI_TIPS = [
  { icon: '⚡', text: 'Gate 4 is currently the fastest exit. Save 4+ minutes vs Gate 2.' },
  { icon: '🍔', text: 'Food at Gate 3 has the shortest queue. 5-min wait vs. 14 min at Gate 2.' },
  { icon: '📱', text: 'Download the official app for push crowd alerts directly to your phone.' },
  { icon: '♿', text: 'Accessible entrances are available at Gate 1 and Gate 4 (West side).' },
  { icon: '🚗', text: 'Parking Lot A (West) is 40% full — head there after the final whistle.' },
  { icon: '💊', text: 'Medical station is near Gate 1. Staff on duty throughout the match.' },
  { icon: '🛡️', text: 'Lost something? Visit the Lost & Found desk near Gate 3 Info Point.' },
  { icon: '🧭', text: 'Use the Personalized Navigation panel to get a custom route to your seat.' },
];

function renderTips() {
  const list = document.getElementById('tips-list');
  if (!list) return;
  list.innerHTML = '';
  const shuffled = [...AI_TIPS].sort(() => Math.random() - 0.5).slice(0, 3);
  shuffled.forEach((tip, i) => {
    const el = document.createElement('div');
    el.className = 'tip-item';
    el.style.animationDelay = `${i * 0.1}s`;
    el.innerHTML = `<em>${tip.icon}</em><span>${tip.text}</span>`;
    list.appendChild(el);
  });
}
renderTips();

document.getElementById('tips-refresh-icon').addEventListener('click', () => {
  const icon = document.getElementById('tips-refresh-icon');
  icon.style.transform = 'rotate(360deg)';
  setTimeout(() => { icon.style.transform = ''; renderTips(); }, 500);
});
setInterval(renderTips, 18000);

// =========================================================
// 13. INIT — Welcome chat message
// =========================================================
window.addEventListener('DOMContentLoaded', () => {
  appendChatMsg('AI', '🏟️ Welcome to Smart Stadium Assistant! I\'m your AI guide — ask me about food, washrooms, exits, crowd status, or enter your seat number for a custom route!', 'ai');
  document.getElementById('cp-input').focus();
});

// =========================================================
// 14. QUICK BADGE LIVE UPDATES
// =========================================================
setInterval(() => {
  const waits = [3,4,5,6,7,8];
  const wait  = waits[Math.floor(Math.random() * waits.length)];
  const foodBadge = document.getElementById('qb-food-badge');
  if (foodBadge) foodBadge.textContent = `~${wait}m wait`;

  const washStatuses = ['Clean ✓', 'Available', 'Clear'];
  const washBadge = document.getElementById('qb-wash-badge');
  if (washBadge) washBadge.textContent = washStatuses[Math.floor(Math.random() * washStatuses.length)];

  const exitGates = ['Gate 4 ✓', 'Gate 1', 'West'];
  const exitBadge = document.getElementById('qb-exit-badge');
  if (exitBadge) exitBadge.textContent = exitGates[Math.floor(Math.random() * exitGates.length)];

  const crowdBadge = document.getElementById('qb-crowd-badge');
  const crowdLevels = ['G2 Crowded', 'Updating…', 'G4 Clear'];
  if (crowdBadge) crowdBadge.textContent = crowdLevels[Math.floor(Math.random() * crowdLevels.length)];
}, 5000);
// =========================================================
// 15. THEME TOGGLE
// =========================================================
function toggleTheme() {
  const isLight = document.body.classList.toggle('light');
  const label   = document.getElementById('theme-toggle-label');
  if (label) label.textContent = isLight ? 'Light' : 'Dark';
  localStorage.setItem('psis-theme', isLight ? 'light' : 'dark');
}

// Load saved theme on startup
(function loadTheme() {
  const saved = localStorage.getItem('psis-theme');
  if (saved === 'light') {
    document.body.classList.add('light');
    const label = document.getElementById('theme-toggle-label');
    if (label) label.textContent = 'Light';
  }
})();
