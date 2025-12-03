// ===== BTS SPY BATTLE - COMPLETE APP.JS v4.3 (Stable Logic + Cool Design) =====

// ==================== CONFIGURATION ====================
const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbx5ArHi5Ws0NxMa9nhORy6bZ7ZYpW4urPIap24tax9H1HLuGQxYRCgTVwDaKOMrZ7JOGA/exec',
    ADMIN_AGENT_NO: 'AGENT001',
    ADMIN_PASSWORD: 'BTSSPYADMIN2024', 
    
    WEEK_DATES: {
        'Test Week 1': '2025-11-29',
        'Test Week 2': '2025-12-06',
        'Week 1': '2025-12-13',
        'Week 2': '2025-12-20',
        'Week 3': '2025-12-27',
        'Week 4': '2026-01-03'
    },
    
    CHAT_CHANNEL: 'bts-comeback-mission-hq', 
    BADGE_REPO_URL: 'https://raw.githubusercontent.com/hbot7875-gif/btscomebackmission/main/lvl1badges/',
    TOTAL_BADGE_IMAGES: 49, 
    
    get BADGE_POOL() {
        const pool = [];
        for (let i = 1; i <= this.TOTAL_BADGE_IMAGES; i++) pool.push(`${this.BADGE_REPO_URL}BTS%20(${i}).jpg`);
        return pool;
    },
    
    TEAMS: {
        'Indigo': { color: '#FFE082', album: 'Indigo' },   
        'Echo': { color: '#FAFAFA', album: 'Echo' },       
        'Agust D': { color: '#B0BEC5', album: 'Agust D' }, 
        'JITB': { color: '#FF4081', album: 'Jack In The Box' }
    },
    
    TEAM_ALBUM_TRACKS: {
        "Indigo": ["Yun (with Erykah Badu)", "Still Life (with Anderson .Paak)", "All Day (with Tablo)", "Forg_tful (with Kim Sawol)", "Closer (with Paul Blanco, Mahalia)", "Change pt.2", "Lonely", "Hectic (with Colde)", "Wild Flower (with youjeen)", "No.2 (with parkjiyoon)"],
        "Echo": ["Don't Say You Love Me", "Nothing Without Your Love", "Loser (feat. YENA)", "Rope It", "With the Clouds", "To Me, Today"],
        "Agust D": ["Intro : Dt sugA", "Agust D", "Skit", "So far away (feat. Suran)", "140503 at Dawn", "Tony Montana", "give it to me", "Interlude : Dream, Reality", "The Last", "724148"],
        "JITB": ["Intro", "Pandora's Box", "MORE", "STOP", "= (Equal Sign)", "Music Box : Reflection", "What if...", "Safety Zone", "Future", "Arson"]
    },
    
    TEAM_PFPS: {
        "Indigo": "https://github.com/hbot7875-gif/btscomebackmission/blob/be0a3cc8ca6b395b4ceb74a1eb01207b9b756b4c/team%20pfps/teamindigo.jpg?raw=true",
        "Echo": "https://github.com/hbot7875-gif/btscomebackmission/blob/be0a3cc8ca6b395b4ceb74a1eb01207b9b756b4c/team%20pfps/teamecho.jpg?raw=true",
        "Agust D": "https://github.com/hbot7875-gif/btscomebackmission/blob/be0a3cc8ca6b395b4ceb74a1eb01207b9b756b4c/team%20pfps/teamagustd.jpg?raw=true",
        "JITB": "https://github.com/hbot7875-gif/btscomebackmission/blob/be0a3cc8ca6b395b4ceb74a1eb01207b9b756b4c/team%20pfps/teamjitb.jpg?raw=true"
    },
    
    SECRET_MISSIONS: { xpPerMission: 5, maxMissionsPerTeam: 5, maxTeamBonus: 25 },
    
    MISSION_TYPES: {
        'switch_app': { name: 'Switch App', icon: '🔄', description: 'Switch to YouTube/Apple Music for 1 hour.' },
        'filler_mode': { name: 'Filler Mode', icon: '🧬', description: 'Stream 1 BTS Song + 2 Non-Kpop songs.' },
        'old_songs': { name: 'Old Songs', icon: '🕰️', description: 'Stream tracks older than 2 years.' },
        'stream_party': { name: 'Stream Party', icon: '🎉', description: 'Everyone streams the exact same playlist NOW.' },
        'custom': { name: 'Custom Task', icon: '⭐', description: 'Special instruction from Admin.' }
    }
};

// ==================== STATE ====================
const STATE = { agentNo: null, week: null, weeks: [], data: null, allAgents: [], page: 'home', isLoading: false, isAdmin: false, adminSession: null, lastUpdated: null };

// ==================== HELPERS ====================
const $ = id => document.getElementById(id);
const teamColor = team => CONFIG.TEAMS[team]?.color || '#7b2cbf';
const teamPfp = team => CONFIG.TEAM_PFPS[team] || '';

function loading(show) { STATE.isLoading = show; const el = $('loading'); if (el) el.classList.toggle('active', show); }
function fmt(n) { return Number(n || 0).toLocaleString(); }
function sanitize(str) { if (!str) return ''; return String(str).replace(/[<>\"'&]/g, char => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' })[char] || char); }
function formatLastUpdated(dateStr) { if (!dateStr) return 'Unknown'; try { const date = new Date(dateStr); if (isNaN(date.getTime())) return dateStr; return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return dateStr; } }

function showToast(msg, type = 'info') {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}</span><span class="toast-msg">${sanitize(msg)}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 4000);
}

function showResult(msg, isError) {
    const el = $('find-result');
    if (!el) return;
    el.innerHTML = `<span style="margin-right:8px;">${isError ? '⚠️' : '✅'}</span>${msg}`;
    el.className = `result-box show ${isError ? 'error' : 'success'}`;
    if (!isError) setTimeout(() => el.classList.remove('show'), 8000);
}

function updateTime() {
    const el = $('last-update');
    if (el) { if (STATE.lastUpdated) el.textContent = `Updated: ${formatLastUpdated(STATE.lastUpdated)}`; else el.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); }
}

function getDaysRemaining(weekLabel) { const endDateStr = CONFIG.WEEK_DATES[weekLabel]; if (!endDateStr) return 0; const end = new Date(endDateStr); end.setHours(23, 59, 59, 999); const now = new Date(); const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24)); return diff > 0 ? diff : 0; }
function isWeekCompleted(selectedWeek) { const endDateStr = CONFIG.WEEK_DATES[selectedWeek]; if (!endDateStr) return false; const end = new Date(endDateStr); end.setHours(23, 59, 59, 999); return new Date() > end; }

const PAGE_GUIDES = {
    'home': { icon: '👋', title: 'Welcome to HQ!', text: "Comeback is real. Stream like your life depends on it." },
    'goals': { icon: '🎯', title: 'Team Targets', text: "Focus on these tracks. Don't loop one track." },
    'album2x': { icon: '🎧', title: 'The 2X Challenge', text: "Listen to every song on this album at least 2 times." },
    'secret-missions': { icon: '🕵️', title: 'Classified Tasks', text: "Bonus XP tasks. If empty, you're doing great!" },
    'team-level': { icon: '🚀', title: 'Leveling Up', text: "Complete Track, Album, and 2X missions to earn badges." },
    'rankings': { icon: '🏆', title: 'Friendly Competition', text: "We are one big team. Rankings are for fun." }
};

function renderGuide(pageName) { const guide = PAGE_GUIDES[pageName]; if (!guide) return ''; return `<div class="card guide-card" style="background: rgba(255,255,255,0.03); border-left: 3px solid #7b2cbf; margin-bottom: 20px;"><div class="card-body" style="display: flex; gap: 15px; align-items: flex-start; padding: 15px;"><div style="font-size: 24px;">${guide.icon}</div><div><h4 style="margin: 0 0 5px 0; color: #fff; font-size: 14px;">${guide.title}</h4><p style="margin: 0; color: #aaa; font-size: 13px; line-height: 1.4;">${guide.text}</p></div></div></div>`; }

// ==================== API ====================
async function api(action, params = {}) {
    const url = new URL(CONFIG.API_URL);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([k, v]) => { if (v != null) url.searchParams.set(k, typeof v === 'object' ? JSON.stringify(v) : v); });
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        const data = await res.json();
        if (data.lastUpdated) { STATE.lastUpdated = data.lastUpdated; updateTime(); }
        if (data.error) throw new Error(data.error);
        return data;
    } catch (e) { console.error('API Error:', e); throw e; }
}

// ==================== INITIALIZATION ====================
function initApp() {
    console.log('🚀 Starting App v4.3 (Stable + Cool Design)...');
    injectCoolBadgeCSS(); // INJECT NEW STYLES
    ensureAdminCSS();     // ENSURE ADMIN VISIBILITY
    loading(false);
    setupLoginListeners();
    loadAllAgents();
    const saved = localStorage.getItem('spyAgent');
    if (saved) { STATE.agentNo = saved; checkAdminStatus(); loadDashboard(); }
}

// === 1. NEW DESIGN CSS ===
function injectCoolBadgeCSS() {
    if ($('cool-badge-styles')) return;
    const style = document.createElement('style');
    style.id = 'cool-badge-styles';
    style.textContent = `
        /* --- AGENT DRAWER (Holographic Medal Look) --- */
        .cool-badge-grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; padding: 10px; }
        .cool-badge-item { display: flex; flex-direction: column; align-items: center; width: 90px; }
        .cool-badge-img-wrapper {
            width: 80px; height: 80px;
            border-radius: 50%;
            padding: 3px; /* Gap for gradient */
            background: linear-gradient(135deg, #ff00cc, #3333ff); /* Neon Pink/Blue */
            box-shadow: 0 0 10px rgba(51, 51, 255, 0.5);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
        }
        .cool-badge-img-wrapper:hover { transform: scale(1.1); box-shadow: 0 0 20px rgba(255, 0, 204, 0.8); }
        .cool-badge-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 2px solid #000; background: #000; }
        .cool-badge-label { margin-top: 10px; font-size: 10px; background: #1a1a2e; padding: 3px 10px; border-radius: 12px; color: #fff; border: 1px solid #333; text-transform: uppercase; letter-spacing: 1px; }

        /* --- ADMIN ASSETS (Data Chip Grid) --- */
        .admin-asset-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 10px; padding: 10px; }
        .admin-asset-item { 
            width: 100%; aspect-ratio: 1;
            border-radius: 10px; 
            overflow: hidden; 
            border: 1px solid #444;
            position: relative;
            background: #000;
            transition: transform 0.2s ease;
            cursor: pointer;
        }
        .admin-asset-item:hover { transform: scale(1.15); z-index: 100; border-color: #7b2cbf; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
        .admin-asset-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; transition: opacity 0.2s; }
        .admin-asset-item:hover .admin-asset-img { opacity: 1; }
        .admin-asset-id { position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(0,0,0,0.8); font-size: 9px; color: #fff; text-align: center; padding: 2px 0; font-family: monospace; }
    `;
    document.head.appendChild(style);
}

// === 2. STABLE ADMIN CSS (Aggressive Z-Index) ===
function ensureAdminCSS() {
    if ($('admin-panel-styles')) return;
    const style = document.createElement('style');
    style.id = 'admin-panel-styles';
    style.innerHTML = `
        .admin-panel { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: #0a0a0f !important; z-index: 999999 !important; display: flex !important; flex-direction: column !important; }
        .admin-panel-header { background: #1a1a2e; padding: 15px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; }
        .admin-panel-content { flex: 1; overflow-y: auto; padding: 20px; }
        .admin-panel-tabs { display: flex; background: #12121a; padding: 10px; gap: 10px; overflow-x: auto; }
        .admin-tab { padding: 8px 16px; border: 1px solid #333; border-radius: 20px; background: transparent; color: #888; cursor: pointer; white-space: nowrap; }
        .admin-tab.active { background: #7b2cbf; color: #fff; border-color: #7b2cbf; }
        .admin-tab-content { display: none; }
        .admin-tab-content.active { display: block; }
        .admin-mission-card { background: #1a1a2e; padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
    `;
    document.head.appendChild(style);
}

// ==================== LOGIC ====================
function setupLoginListeners() {
    const loginBtn = $('login-btn'); const findBtn = $('find-btn'); const agentInput = $('agent-input'); const instagramInput = $('instagram-input');
    if (loginBtn) loginBtn.onclick = handleLogin; if (findBtn) findBtn.onclick = handleFind;
    if (agentInput) agentInput.onkeypress = e => { if (e.key === 'Enter') handleLogin(); };
    if (instagramInput) instagramInput.onkeypress = e => { if (e.key === 'Enter') handleFind(); };
}

async function loadAllAgents() { try { STATE.allAgents = (await api('getAllAgents')).agents || []; } catch (e) { STATE.allAgents = []; } }

async function handleLogin() {
    if (STATE.isLoading) return;
    const agentNo = $('agent-input')?.value.trim().toUpperCase();
    if (!agentNo) { showResult('Enter Agent Number', true); return; }
    loading(true);
    try {
        // Optimistic Login (v4.1 logic)
        if (STATE.allAgents.length > 0) {
            const found = STATE.allAgents.find(a => String(a.agentNo).trim().toUpperCase() === agentNo);
            if (!found) throw new Error('Agent not found');
        }
        localStorage.setItem('spyAgent', agentNo);
        STATE.agentNo = agentNo;
        checkAdminStatus();
        await loadDashboard();
    } catch (e) { 
        // Retry via server if local list failed
        try {
            const check = await api('getAgentData', { agentNo: agentNo, week: 'Check' });
            if (check.profile) { localStorage.setItem('spyAgent', agentNo); STATE.agentNo = agentNo; checkAdminStatus(); await loadDashboard(); return; }
        } catch(err){}
        showResult('Login Failed', true); 
    } finally { loading(false); }
}

async function handleFind() {
    if (STATE.isLoading) return;
    const handle = $('instagram-input')?.value.trim().toLowerCase().replace('@', '');
    if (!handle) { showResult('Enter Instagram', true); return; }
    loading(true);
    try {
        if (STATE.allAgents.length === 0) await loadAllAgents();
        const found = STATE.allAgents.find(a => String(a.instagram||a.ig||'').toLowerCase().replace('@','') === handle || String(a.name||'').toLowerCase().includes(handle));
        if (!found) throw new Error('Not found');
        showResult(`Agent ID: <strong>${found.agentNo}</strong>`, false);
        if($('agent-input')) $('agent-input').value = found.agentNo;
    } catch (e) { showResult(e.message, true); } finally { loading(false); }
}

// ==================== ADMIN LOGIC ====================
function checkAdminStatus() {
    if (String(STATE.agentNo).toUpperCase() !== String(CONFIG.ADMIN_AGENT_NO).toUpperCase()) { STATE.isAdmin = false; return; }
    const savedSession = localStorage.getItem('adminSession');
    const savedExpiry = localStorage.getItem('adminExpiry');
    if (savedSession && savedExpiry && Date.now() < parseInt(savedExpiry)) { STATE.isAdmin = true; STATE.adminSession = savedSession; localStorage.setItem('adminExpiry', String(Date.now() + 86400000)); } 
    else { STATE.isAdmin = false; }
}

function showAdminLogin() {
    if (!isAdminAgent()) { showToast('Access denied.', 'error'); return; }
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
    const modal = document.createElement('div'); modal.className = 'modal-overlay'; modal.id = 'admin-modal';
    modal.innerHTML = `<div class="modal admin-modal"><div class="modal-header"><h3>🔐 Admin Access</h3><button class="modal-close" onclick="closeAdminModal()">×</button></div><div class="modal-body"><div class="form-group"><label>PASSWORD:</label><input type="password" id="admin-password" class="form-input"></div><div id="admin-error" class="admin-error"></div></div><div class="modal-footer"><button onclick="verifyAdminPassword()" class="btn-primary" id="admin-verify-btn">Authenticate</button></div></div>`;
    document.body.appendChild(modal); setTimeout(() => $('admin-password')?.focus(), 100);
}

function closeAdminModal() { const modal = $('admin-modal'); if (modal) modal.remove(); }

async function verifyAdminPassword() {
    const password = $('admin-password')?.value;
    if (!password) return;
    let verified = false;
    // Hardcoded check first (Stability)
    if (password === CONFIG.ADMIN_PASSWORD) { verified = true; STATE.adminSession = 'local_' + Date.now(); } 
    else { try { const result = await api('verifyAdmin', { agentNo: STATE.agentNo, password }); if (result.success) { verified = true; STATE.adminSession = result.sessionToken; } } catch (e) {} }

    if (verified) {
        STATE.isAdmin = true; localStorage.setItem('adminSession', STATE.adminSession); localStorage.setItem('adminExpiry', String(Date.now() + 86400000));
        closeAdminModal(); addAdminIndicator(); if (!STATE.week) { try { const w = await api('getAvailableWeeks'); STATE.week = w.current || w.weeks?.[0]; } catch(e) {} }
        showToast('Access Granted', 'success'); showAdminPanel();
    } else { const err = $('admin-error'); if (err) { err.textContent = '❌ Invalid password'; err.classList.add('show'); } }
}

function isAdminAgent() { return String(STATE.agentNo).toUpperCase() === String(CONFIG.ADMIN_AGENT_NO).toUpperCase(); }

function addAdminIndicator() {
    document.querySelector('.admin-indicator')?.remove();
    let nav = document.querySelector('.nav-links') || document.getElementById('sidebar');
    if (!nav || nav.querySelector('.admin-nav-link')) return;
    const link = document.createElement('a'); link.href = '#'; link.className = 'nav-link admin-nav-link'; link.style.marginTop = 'auto'; link.style.borderTop = '1px solid rgba(255,255,255,0.1)'; link.innerHTML = '<span class="nav-icon">🎛️</span><span>Admin</span>';
    link.onclick = (e) => { e.preventDefault(); STATE.isAdmin ? showAdminPanel() : showAdminLogin(); closeSidebar(); };
    nav.appendChild(link);
}

// ==================== ADMIN PANEL ====================
function showAdminPanel() {
    if (!STATE.isAdmin) return showAdminLogin();
    document.querySelectorAll('.admin-panel').forEach(p => p.remove());
    const panel = document.createElement('div'); panel.className = 'admin-panel'; panel.style.display = 'flex';
    panel.innerHTML = `<div class="admin-panel-header"><h3>🎛️ Mission Control (${STATE.week})</h3><button class="panel-close" onclick="closeAdminPanel()">×</button></div><div class="admin-panel-tabs"><button class="admin-tab active" data-tab="create">Create Mission</button><button class="admin-tab" data-tab="active">Active</button><button class="admin-tab" data-tab="assets">Assets</button><button class="admin-tab" data-tab="history">History</button></div><div class="admin-panel-content"><div id="admin-tab-create" class="admin-tab-content active">${renderCreateMissionForm()}</div><div id="admin-tab-active" class="admin-tab-content"><div class="loading-text">Loading...</div></div><div id="admin-tab-assets" class="admin-tab-content"><div class="loading-text">Loading...</div></div><div id="admin-tab-history" class="admin-tab-content"><div class="loading-text">Loading...</div></div></div>`;
    document.body.appendChild(panel);
    panel.querySelectorAll('.admin-tab').forEach(tab => { tab.addEventListener('click', (e) => { e.preventDefault(); switchAdminTab(tab.dataset.tab); if (tab.dataset.tab === 'active') loadActiveTeamMissions(); if (tab.dataset.tab === 'assets') renderAdminAssets(); if (tab.dataset.tab === 'history') loadMissionHistory(); }); });
}

function closeAdminPanel() { document.querySelectorAll('.admin-panel').forEach(p => p.remove()); }
function exitAdminMode() { STATE.isAdmin=false; localStorage.removeItem('adminSession'); location.reload(); }

function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector(`.admin-tab[data-tab="${tabName}"]`)?.classList.add('active');
    document.getElementById(`admin-tab-${tabName}`)?.classList.add('active');
}

function renderCreateMissionForm() {
    return `<div class="create-mission-form"><div class="form-section"><h4>Type</h4><div class="mission-type-grid">${Object.entries(CONFIG.MISSION_TYPES).map(([key, m], i) => `<div class="mission-type-option ${i === 0 ? 'selected' : ''}" data-type="${key}" onclick="selectMissionType('${key}')"><span>${m.icon}</span> <span>${m.name}</span></div>`).join('')}</div><input type="hidden" id="selected-mission-type" value="switch_app"></div><div class="form-section"><h4>Target</h4><div class="team-checkboxes">${Object.keys(CONFIG.TEAMS).map(team => `<label class="team-checkbox"><input type="checkbox" name="target-teams" value="${team}"> <span class="team-name" style="color:${teamColor(team)}">${team}</span></label>`).join('')}</div><label><input type="checkbox" onchange="toggleAllTeams(this.checked)"> All</label></div><div class="form-section"><h4>Details</h4><input type="text" id="mission-title" class="form-input" placeholder="Title"><textarea id="mission-briefing" class="form-textarea" placeholder="Briefing"></textarea><input type="text" id="target-track" class="form-input" placeholder="Target Track"><input type="number" id="goal-target" class="form-input" value="100" placeholder="Goal #"></div><div class="form-actions"><button onclick="createTeamMission()" class="btn-primary">🚀 Deploy</button></div><div id="create-result"></div></div>`;
}

function selectMissionType(type) { document.querySelectorAll('.mission-type-option').forEach(el => el.classList.remove('selected')); document.querySelector(`.mission-type-option[data-type="${type}"]`)?.classList.add('selected'); $('selected-mission-type').value = type; }
function toggleAllTeams(checked) { document.querySelectorAll('input[name="target-teams"]').forEach(cb => cb.checked = checked); }
async function createTeamMission() { const type = $('selected-mission-type')?.value; const title = $('mission-title')?.value.trim(); const briefing = $('mission-briefing')?.value.trim(); const targetTeams = Array.from(document.querySelectorAll('input[name="target-teams"]:checked')).map(cb => cb.value); const targetTrack = $('target-track')?.value.trim(); const goalTarget = parseInt($('goal-target')?.value) || 100; if (!title || targetTeams.length === 0 || !briefing) return showCreateResult('Missing Fields', true); loading(true); try { const res = await api('createTeamMission', { type, title, briefing, targetTeams: JSON.stringify(targetTeams), targetTrack, goalTarget, week: STATE.week, agentNo: STATE.agentNo, sessionToken: STATE.adminSession }); if (res.success) { showCreateResult('Deployed!', false); loadActiveTeamMissions(); } else { showCreateResult(res.error, true); } } catch (e) { showCreateResult(e.message, true); } finally { loading(false); } }
function showCreateResult(msg, isError) { const el = $('create-result'); if(el) { el.textContent = msg; el.style.color = isError ? 'red' : 'green'; } }
async function loadActiveTeamMissions() { const container = $('admin-tab-active'); if (!container) return; loading(true); try { const res = await api('getTeamMissions', { status: 'active', week: STATE.week }); const missions = res.missions || []; container.innerHTML = missions.length ? missions.map(m => `<div class="admin-mission-card"><div>${m.title}</div><div><button onclick="adminCompleteMission('${m.id}')" class="btn-sm btn-success">Complete</button> <button onclick="adminCancelMission('${m.id}')" class="btn-sm btn-danger">Cancel</button></div></div>`).join('') : '<p>No active missions</p>'; } catch (e) { container.innerHTML = 'Error'; } finally { loading(false); } }
async function loadMissionHistory() { const container = $('admin-tab-history'); if (!container) return; loading(true); try { const res = await api('getTeamMissions', { status: 'all', week: STATE.week }); const missions = (res.missions || []).filter(m => m.status !== 'active'); container.innerHTML = missions.length ? missions.map(m => `<div class="history-item"><span>${m.title}</span> <span>${m.status}</span></div>`).join('') : '<p>No history</p>'; } catch (e) { container.innerHTML = 'Error'; } finally { loading(false); } }

// === UPDATED: COOL ADMIN ASSETS RENDER ===
function renderAdminAssets() {
    const container = $('admin-tab-assets');
    if(!container) return;
    container.innerHTML = `<div class="admin-asset-grid">${CONFIG.BADGE_POOL.map((url, i) => `<div class="admin-asset-item"><img src="${url}" class="admin-asset-img"><div class="admin-asset-id">#${i+1}</div></div>`).join('')}</div>`;
}

async function adminCompleteMission(id) { const team = prompt('Team Name to Complete:'); if (!team) return; loading(true); await api('completeTeamMission', { missionId: id, team, agentNo: STATE.agentNo, sessionToken: STATE.adminSession }); loading(false); loadActiveTeamMissions(); }
async function adminCancelMission(id) { if (!confirm('Cancel?')) return; loading(true); await api('cancelTeamMission', { missionId: id, agentNo: STATE.agentNo, sessionToken: STATE.adminSession }); loading(false); loadActiveTeamMissions(); }

// ==================== DASHBOARD ====================
async function loadDashboard() {
    console.log('🏠 Loading dashboard...');
    loading(true);
    try {
        const weeksRes = await api('getAvailableWeeks'); STATE.weeks = weeksRes.weeks || []; STATE.week = weeksRes.current || STATE.weeks[0];
        STATE.data = await api('getAgentData', { agentNo: STATE.agentNo, week: STATE.week });
        if (STATE.data?.lastUpdated) STATE.lastUpdated = STATE.data.lastUpdated;
        
        // EXPLICIT SCREEN SWITCH
        $('login-screen').classList.remove('active'); $('login-screen').style.display = 'none';
        $('dashboard-screen').classList.add('active'); $('dashboard-screen').style.display = 'flex';
        
        setupDashboard(); await loadPage('home');
        if (STATE.isAdmin) addAdminIndicator();
        setTimeout(() => { if (typeof NOTIFICATIONS !== 'undefined') NOTIFICATIONS.checkUpdates(); }, 1500);
    } catch (e) { console.error('Dashboard error:', e); showToast('Failed to load: ' + e.message, 'error'); if(e.message.includes('found')) logout(); } finally { loading(false); }
}

function setupDashboard() {
    const p = STATE.data?.profile;
    if (p) {
        const color = teamColor(p.team); const pfp = teamPfp(p.team); const initial = (p.name || 'A')[0].toUpperCase();
        ['agent', 'profile'].forEach(prefix => { const avatar = $(prefix + '-avatar'); if (avatar) { if (pfp) avatar.innerHTML = `<img src="${pfp}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`; else { avatar.textContent = initial; avatar.style.background = color; } } if ($(prefix + '-name')) $(prefix + '-name').textContent = p.name || 'Agent'; if ($(prefix + '-team')) { $(prefix + '-team').textContent = p.team || 'Team'; $(prefix + '-team').style.color = color; } if ($(prefix + '-id')) $(prefix + '-id').textContent = 'ID: ' + STATE.agentNo; });
    }
    const select = $('week-select'); if (select && STATE.weeks.length) { select.innerHTML = STATE.weeks.map(w => `<option value="${w}" ${w === STATE.week ? 'selected' : ''}>${w}</option>`).join(''); select.onchange = async () => { loading(true); try { STATE.data = await api('getAgentData', { agentNo: STATE.agentNo, week: select.value }); STATE.week = select.value; if (STATE.data?.lastUpdated) { STATE.lastUpdated = STATE.data.lastUpdated; updateTime(); } await loadPage(STATE.page); } catch (e) { showToast('Failed to load week', 'error'); } finally { loading(false); } }; }
    document.querySelectorAll('.nav-link').forEach(link => { link.onclick = e => { e.preventDefault(); const page = link.dataset.page; if (page) { document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active')); link.classList.add('active'); loadPage(page); closeSidebar(); } }; });
    if (isAdminAgent()) addAdminIndicator();
    $('menu-btn')?.addEventListener('click', () => $('sidebar')?.classList.add('open')); $('close-sidebar')?.addEventListener('click', closeSidebar); $('logout-btn')?.addEventListener('click', logout); updateTime();
}
function closeSidebar() { $('sidebar')?.classList.remove('open'); }
function logout() { if (confirm('Logout?')) { localStorage.removeItem('spyAgent'); localStorage.removeItem('adminSession'); localStorage.removeItem('adminExpiry'); location.reload(); } }

async function loadPage(page) {
    STATE.page = page; document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    if (page === 'chat' && !$('page-chat')) { const main = document.querySelector('.pages-wrapper') || document.querySelector('main'); if (main) { const chat = document.createElement('section'); chat.id = 'page-chat'; chat.className = 'page'; chat.innerHTML = `<div id="chat-content"></div>`; main.appendChild(chat); } }
    $('page-' + page)?.classList.add('active');
    loading(true);
    try {
        if(page==='home') await renderHome(); if(page==='profile') await renderProfile(); if(page==='rankings') await renderRankings(); if(page==='goals') await renderGoals(); if(page==='album2x') await renderAlbum2x(); if(page==='team-level') await renderTeamLevel(); if(page==='comparison') await renderComparison(); if(page==='summary') await renderSummary(); if(page==='drawer') await renderDrawer(); if(page==='announcements') await renderAnnouncements(); if(page==='secret-missions') await renderSecretMissions(); if(page==='chat') await renderChat();
    } catch (e) { if ($('page-'+page)) $('page-'+page).innerHTML = `<div class="error-page"><h3>Failed to load</h3><p>${sanitize(e.message)}</p><button onclick="loadPage('${page}')" class="btn-primary">Retry</button></div>`; } finally { loading(false); }
}

// ==================== RENDERERS ====================
async function renderHome() {
    $('current-week').textContent = `Week: ${STATE.week}`;
    try { const [s, r, g] = await Promise.all([api('getWeeklySummary', { week: STATE.week }), api('getRankings', { week: STATE.week, limit: 5 }), api('getGoalsProgress', { week: STATE.week })]);
        const team = STATE.data?.profile?.team; const myStats = STATE.data?.stats || {};
        if($('.quick-stats-section')) $('.quick-stats-section').innerHTML = renderGuide('home') + `<div class="card quick-stats-card" style="border-color:${teamColor(team)}40;background:linear-gradient(135deg, ${teamColor(team)}11, var(--bg-card));"><div class="card-body"><div class="quick-header">${teamPfp(team)?`<img src="${teamPfp(team)}" class="quick-pfp">`:''}<div class="quick-info"><div class="quick-name">${sanitize(STATE.data?.profile?.name)}</div><div class="quick-team" style="color:${teamColor(team)}">${team}</div></div></div><div class="quick-stats-grid"><div class="quick-stat"><div class="quick-stat-value">${fmt(myStats.totalXP)}</div><div class="quick-stat-label">XP</div></div><div class="quick-stat"><div class="quick-stat-value">${fmt(myStats.trackScrobbles)}</div><div class="quick-stat-label">Tracks</div></div></div></div></div>`;
        if($('.missions-grid')) $('.missions-grid').innerHTML = `<div class="mission-card expanded" onclick="loadPage('goals')"><div class="mission-icon">🎵</div><h3>Track Goals</h3></div><div class="mission-card expanded" onclick="loadPage('goals')"><div class="mission-icon">💿</div><h3>Album Goals</h3></div><div class="mission-card" onclick="loadPage('album2x')"><div class="mission-icon">✨</div><h3>2X Challenge</h3></div><div class="mission-card secret" onclick="loadPage('secret-missions')"><div class="mission-icon">🔒</div><h3>Secret</h3></div>`;
        if($('home-top-agents')) $('home-top-agents').innerHTML = r.rankings.slice(0,5).map((r,i)=>`<div class="rank-item"><div class="rank-num">${i+1}</div><div>${r.name}</div><div class="rank-xp">${fmt(r.totalXP)}</div></div>`).join('');
    } catch(e){}
}

async function renderChat() { if($('chat-content')) $('chat-content').innerHTML = `<div class="card"><div class="card-body" style="text-align:center;padding:40px;"><a href="https://tlk.io/${CONFIG.CHAT_CHANNEL}" target="_blank" onclick="window.open(this.href,'chat','width=500,height=700');return false;" class="btn-primary">🚀 Open Chat</a></div></div>`; }

// === UPDATED: COOL BADGES FOR DRAWER ===
async function renderDrawer() {
    const container = $('drawer-content'); if (!container) return;
    const xp = STATE.data.stats.totalXP || 0;
    const level = Math.floor(xp / 100);
    let badgesHtml = '';
    for (let i = 1; i <= level; i++) {
        let seed = 0; const str = String(STATE.agentNo); for (let j = 0; j < str.length; j++) seed += str.charCodeAt(j);
        const img = CONFIG.BADGE_POOL[(seed + i * 137) % CONFIG.BADGE_POOL.length];
        badgesHtml += `
            <div class="cool-badge-item">
                <div class="cool-badge-img-wrapper"><img src="${img}" class="cool-badge-img"></div>
                <div class="cool-badge-label">Level ${i}</div>
            </div>`;
    }
    container.innerHTML = `
        <div class="card"><div class="card-body"><h3>Agent #${STATE.agentNo}</h3><p>XP: ${fmt(xp)}</p>${STATE.isAdmin ? '<button onclick="showAdminLogin()" class="btn-primary">Admin</button>' : ''}</div></div>
        <div class="card"><div class="card-header"><h3>🎖️ Collection (${level})</h3></div><div class="card-body cool-badge-grid">${badgesHtml || '<p style="color:#777">No badges yet</p>'}</div></div>
    `;
}

async function renderProfile() { $('profile-stats').innerHTML = `<div class="stat-box"><div class="stat-value">${fmt(STATE.data.stats.totalXP)}</div><div class="stat-label">XP</div></div>`; }
async function renderRankings() { $('rankings-list').innerHTML = 'Loading...'; await renderOverallRankings(); }
async function renderOverallRankings() { const d = await api('getRankings', { week: STATE.week, limit: 100 }); $('rankings-list').innerHTML = d.rankings.map((r,i)=>`<div class="rank-item">#${i+1} ${r.name} - ${r.totalXP}</div>`).join(''); }
async function renderGoals() { $('goals-content').innerHTML = 'Loading...'; const g = await api('getGoalsProgress', {week:STATE.week}); $('goals-content').innerHTML = `<div class="card"><div class="card-body"><h3>Goals</h3><p>Loaded</p></div></div>`; }
async function renderAlbum2x() { $('album2x-content').innerHTML = 'Loading...'; $('album2x-content').innerHTML = `<div class="card"><div class="card-body"><h3>2X</h3><p>Loaded</p></div></div>`; }
async function renderTeamLevel() { $('team-level-content').innerHTML = 'Loading...'; $('team-level-content').innerHTML = `<div class="card"><div class="card-body"><h3>Levels</h3><p>Loaded</p></div></div>`; }
async function renderComparison() { $('comparison-content').innerHTML = 'Loading...'; $('comparison-content').innerHTML = `<div class="card"><div class="card-body"><h3>Comparison</h3><p>Loaded</p></div></div>`; }
async function renderSummary() { $('summary-content').innerHTML = 'Check back later.'; }
async function renderAnnouncements() { $('announcements-content').innerHTML = 'Loading...'; $('announcements-content').innerHTML = 'No news'; }
async function renderSecretMissions() { $('secret-missions-content').innerHTML = 'Loading...'; $('secret-missions-content').innerHTML = 'No missions'; }

// ==================== NOTIFICATIONS ====================
const NOTIFICATIONS = {
    checkUpdates: function() {
        const stats = STATE.data?.stats || {};
        let newNotifications = [];
        const currentXP = parseInt(stats.totalXP) || 0;
        const currentLevel = Math.floor(currentXP / 100);
        const savedLevel = parseInt(localStorage.getItem('spy_lastLevel')) || 0;
        if (currentLevel > savedLevel) {
            newNotifications.push({ type: 'badge', msg: `New Badge Unlocked: Level ${currentLevel}`, page: 'drawer', dotId: 'dot-drawer' });
            localStorage.setItem('spy_lastLevel', currentLevel);
        }
        if (newNotifications.length > 0) { this.showIntelModal(newNotifications); this.updateSidebarDots(newNotifications); }
    },
    showIntelModal: function(notifs) {
        document.querySelector('.intel-modal')?.remove();
        const html = `<div class="intel-modal"><div class="intel-header"><span>📡 UPDATE</span><button onclick="this.closest('.intel-modal').remove()">✕</button></div>${notifs.map(n => `<div class="intel-item" onclick="loadPage('${n.page}')">${n.msg}</div>`).join('')}</div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        setTimeout(() => document.querySelector('.intel-modal').classList.add('show'), 500);
    },
    updateSidebarDots: function(notifs) { notifs.forEach(n => { const dot = document.getElementById(n.dotId); if (dot) dot.classList.add('active'); }); }
};

document.addEventListener('DOMContentLoaded', initApp);
console.log('v4.3 Loaded');

window.loadPage = loadPage;
window.logout = logout;
window.showAdminPanel = showAdminPanel;
window.showAdminLogin = showAdminLogin;
window.closeAdminModal = closeAdminModal;
window.closeAdminPanel = closeAdminPanel;
window.verifyAdminPassword = verifyAdminPassword;
window.exitAdminMode = exitAdminMode;
window.selectMissionType = selectMissionType;
window.toggleAllTeams = toggleAllTeams;
window.createTeamMission = createTeamMission;
window.adminCompleteMission = adminCompleteMission;
window.adminCancelMission = adminCancelMission;
window.switchAdminTab = switchAdminTab;

console.log('🎮 BTS Spy Battle v3.8 Loaded (Original+Fixes)');
