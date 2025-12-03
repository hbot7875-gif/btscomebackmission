// ===== BTS SPY BATTLE - COMPLETE APP.JS v4.0 (Login & Admin Fixed) =====

// ==================== CONFIGURATION ====================
const CONFIG = {
    // YOUR GOOGLE SCRIPT URL
    API_URL: 'https://script.google.com/macros/s/AKfycbx5ArHi5Ws0NxMa9nhORy6bZ7ZYpW4urPIap24tax9H1HLuGQxYRCgTVwDaKOMrZ7JOGA/exec',
    
    // Admin Settings
    ADMIN_AGENT_NO: 'AGENT001',
    ADMIN_PASSWORD: 'BTSSPYADMIN2024', 
    
    // End Dates (YYYY-MM-DD)
    WEEK_DATES: {
        'Test Week 1': '2025-11-29',
        'Test Week 2': '2025-12-06',
        'Week 1': '2025-12-13',
        'Week 2': '2025-12-20',
        'Week 3': '2025-12-27',
        'Week 4': '2026-01-03'
    },
    
    // Chat Settings
    CHAT_CHANNEL: 'bts-comeback-mission-hq', 

    // ===== BADGE CONFIGURATION =====
    BADGE_REPO_URL: 'https://raw.githubusercontent.com/hbot7875-gif/btscomebackmission/main/lvl1badges/',
    TOTAL_BADGE_IMAGES: 49, 
    
    get BADGE_POOL() {
        const pool = [];
        for (let i = 1; i <= this.TOTAL_BADGE_IMAGES; i++) {
            pool.push(`${this.BADGE_REPO_URL}BTS%20(${i}).jpg`);
        }
        return pool;
    },
    
    TEAMS: {
        'Indigo': { color: '#FFE082', album: 'Indigo' },   // Warm Sand
        'Echo': { color: '#FAFAFA', album: 'Echo' },       // Optical White
        'Agust D': { color: '#B0BEC5', album: 'Agust D' }, // Glitch Steel
        'JITB': { color: '#FF4081', album: 'Jack In The Box' } // Electric Magenta
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
const STATE = {
    agentNo: null,
    week: null,
    weeks: [],
    data: null,
    allAgents: [],
    page: 'home',
    isLoading: false,
    isAdmin: false,
    adminSession: null,
    lastUpdated: null
};

// ==================== HELPERS ====================
const $ = id => document.getElementById(id);
const teamColor = team => CONFIG.TEAMS[team]?.color || '#7b2cbf';
const teamPfp = team => CONFIG.TEAM_PFPS[team] || '';

function loading(show) {
    STATE.isLoading = show;
    const el = $('loading');
    if (el) el.classList.toggle('active', show);
}

function fmt(n) { return Number(n || 0).toLocaleString(); }

function sanitize(str) {
    if (!str) return '';
    return String(str).replace(/[<>\"'&]/g, char => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' })[char] || char);
}

function formatLastUpdated(dateStr) {
    if (!dateStr) return 'Unknown';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) { return dateStr; }
}

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
    if (el) {
        if (STATE.lastUpdated) el.textContent = `Updated: ${formatLastUpdated(STATE.lastUpdated)}`;
        else el.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
}

function getDaysRemaining(weekLabel) {
    const endDateStr = CONFIG.WEEK_DATES[weekLabel];
    if (!endDateStr) return 0;
    const end = new Date(endDateStr);
    end.setHours(23, 59, 59, 999);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
}

function isWeekCompleted(selectedWeek) {
    const endDateStr = CONFIG.WEEK_DATES[selectedWeek];
    if (!endDateStr) return false;
    const end = new Date(endDateStr);
    end.setHours(23, 59, 59, 999);
    return new Date() > end;
}

// ==================== GUIDES ====================
const PAGE_GUIDES = {
    'home': { icon: '👋', title: 'Welcome to HQ!', text: "Comeback is real. Stream like your life depends on it." },
    'goals': { icon: '🎯', title: 'Team Targets', text: "Focus on these tracks. Don't loop one track." },
    'album2x': { icon: '🎧', title: 'The 2X Challenge', text: "Listen to every song on this album at least 2 times." },
    'secret-missions': { icon: '🕵️', title: 'Classified Tasks', text: "Bonus XP tasks. If empty, you're doing great!" },
    'team-level': { icon: '🚀', title: 'Leveling Up', text: "Complete Track, Album, and 2X missions to earn badges." },
    'rankings': { icon: '🏆', title: 'Friendly Competition', text: "We are one big team. Rankings are for fun." }
};

function renderGuide(pageName) {
    const guide = PAGE_GUIDES[pageName];
    if (!guide) return '';
    return `<div class="card guide-card" style="background: rgba(255,255,255,0.03); border-left: 3px solid #7b2cbf; margin-bottom: 20px;"><div class="card-body" style="display: flex; gap: 15px; align-items: flex-start; padding: 15px;"><div style="font-size: 24px;">${guide.icon}</div><div><h4 style="margin: 0 0 5px 0; color: #fff; font-size: 14px;">${guide.title}</h4><p style="margin: 0; color: #aaa; font-size: 13px; line-height: 1.4;">${guide.text}</p></div></div></div>`;
}

// ==================== API ====================
async function api(action, params = {}) {
    const url = new URL(CONFIG.API_URL);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([k, v]) => { if (v != null) url.searchParams.set(k, typeof v === 'object' ? JSON.stringify(v) : v); });
    console.log('📡 API:', action, params);
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch (e) { throw new Error('Invalid JSON response'); }
        if (data.lastUpdated) { STATE.lastUpdated = data.lastUpdated; updateTime(); }
        if (data.error) throw new Error(data.error);
        return data;
    } catch (e) {
        console.error('API Error:', e);
        throw e;
    }
}

// ==================== INITIALIZATION ====================
function initApp() {
    console.log('🚀 Starting App v4.0...');
    injectAdminStyles(); 
    loading(false);
    setupLoginListeners();
    loadAllAgents(); // Try to load, but don't block
    
    const saved = localStorage.getItem('spyAgent');
    if (saved) {
        STATE.agentNo = saved;
        checkAdminStatus();
        loadDashboard();
    }
}

// FORCE CSS FOR ADMIN PANEL
function injectAdminStyles() {
    if (document.getElementById('admin-styles')) return;
    const style = document.createElement('style');
    style.id = 'admin-styles';
    style.textContent = `
        .admin-panel { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0a0a0f; z-index: 9999; display: flex; flex-direction: column; padding: 0; overflow: hidden; }
        .admin-panel-header { display: flex; justify-content: space-between; padding: 15px; background: #1a1a2e; border-bottom: 1px solid #333; }
        .admin-panel-tabs { display: flex; gap: 10px; padding: 10px; background: #12121a; overflow-x: auto; }
        .admin-tab { padding: 8px 16px; background: transparent; border: 1px solid #333; color: #888; border-radius: 20px; cursor: pointer; }
        .admin-tab.active { background: #7b2cbf; color: #fff; border-color: #7b2cbf; }
        .admin-panel-content { flex: 1; overflow-y: auto; padding: 20px; position: relative; }
        .admin-tab-content { display: none; }
        .admin-tab-content.active { display: block; }
        .create-mission-form { max-width: 600px; margin: 0 auto; }
        .form-section { margin-bottom: 25px; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 8px; }
        .mission-type-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px; margin-top: 10px; }
        .mission-type-option { border: 1px solid #333; padding: 10px; text-align: center; border-radius: 8px; cursor: pointer; transition: 0.2s; }
        .mission-type-option.selected { border-color: #7b2cbf; background: rgba(123, 44, 191, 0.2); }
        .admin-mission-card { background: #1a1a2e; padding: 15px; margin-bottom: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
    `;
    document.head.appendChild(style);
}

function setupLoginListeners() {
    const loginBtn = $('login-btn');
    const findBtn = $('find-btn');
    const agentInput = $('agent-input');
    const instagramInput = $('instagram-input');
    if (loginBtn) loginBtn.onclick = handleLogin;
    if (findBtn) findBtn.onclick = handleFind;
    if (agentInput) agentInput.onkeypress = e => { if (e.key === 'Enter') handleLogin(); };
    if (instagramInput) instagramInput.onkeypress = e => { if (e.key === 'Enter') handleFind(); };
}

async function loadAllAgents() {
    try { STATE.allAgents = (await api('getAllAgents')).agents || []; } catch (e) { STATE.allAgents = []; }
}

async function handleLogin() {
    if (STATE.isLoading) return;
    const agentNo = $('agent-input')?.value.trim().toUpperCase();
    if (!agentNo) return showResult('Enter Agent Number', true);
    
    loading(true);
    try {
        // Optimistic Login: If List isn't loaded, just try to load dashboard with ID
        if (STATE.allAgents.length > 0) {
            const found = STATE.allAgents.find(a => String(a.agentNo).trim().toUpperCase() === agentNo);
            if (!found) throw new Error('Agent not found in list');
        }
        
        // If we are here, either found in list OR list is empty so we try blindly
        localStorage.setItem('spyAgent', agentNo);
        STATE.agentNo = agentNo;
        checkAdminStatus();
        await loadDashboard();
        
    } catch (e) {
        // If local list check failed, try server check one last time before giving up
        try {
            const check = await api('getAgentData', { agentNo: agentNo, week: 'Check' });
            if (check.profile) {
                localStorage.setItem('spyAgent', agentNo);
                STATE.agentNo = agentNo;
                checkAdminStatus();
                await loadDashboard();
                return;
            }
        } catch (err) {}
        
        showResult('Login failed: Agent not found', true); 
        loading(false);
    } 
}

async function handleFind() {
    if (STATE.isLoading) return;
    const handle = $('instagram-input')?.value.trim().toLowerCase().replace('@', '');
    if (!handle) return showResult('Enter Instagram', true);
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
    if (savedSession && savedExpiry && Date.now() < parseInt(savedExpiry)) {
        STATE.isAdmin = true;
        STATE.adminSession = savedSession;
        localStorage.setItem('adminExpiry', String(Date.now() + 86400000));
    } else {
        STATE.isAdmin = false;
    }
}

function showAdminLogin() {
    if (String(STATE.agentNo).toUpperCase() !== String(CONFIG.ADMIN_AGENT_NO).toUpperCase()) return showToast('Access Denied', 'error');
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'admin-modal';
    modal.innerHTML = `
        <div class="modal admin-modal">
            <div class="modal-header"><h3>🔐 Admin Access</h3><button class="modal-close" onclick="closeAdminModal()">×</button></div>
            <div class="modal-body">
                <div class="form-group"><label>PASSWORD:</label><input type="password" id="admin-password" class="form-input"></div>
                <div id="admin-error" class="admin-error"></div>
            </div>
            <div class="modal-footer"><button onclick="verifyAdminPassword()" class="btn-primary" id="admin-verify-btn">Authenticate</button></div>
        </div>`;
    document.body.appendChild(modal);
    setTimeout(() => $('admin-password')?.focus(), 100);
}

function closeAdminModal() {
    const modal = $('admin-modal');
    if (modal) { modal.classList.add('closing'); setTimeout(() => modal.remove(), 300); }
}

async function verifyAdminPassword() {
    const password = $('admin-password')?.value;
    const errorEl = $('admin-error');
    if (!password) return;
    
    let verified = false;
    // 1. HARDCODED CHECK
    if (password === CONFIG.ADMIN_PASSWORD) {
        verified = true;
        STATE.adminSession = 'local_override_' + Date.now();
    } else {
        // 2. SERVER CHECK
        const btn = $('admin-verify-btn');
        if(btn) btn.disabled = true;
        try {
            const result = await api('verifyAdmin', { agentNo: STATE.agentNo, password });
            if (result.success) { verified = true; STATE.adminSession = result.sessionToken; }
        } catch (e) { console.error(e); }
        if(btn) btn.disabled = false;
    }

    if (verified) {
        STATE.isAdmin = true;
        localStorage.setItem('adminSession', STATE.adminSession);
        localStorage.setItem('adminExpiry', String(Date.now() + 86400000));
        closeAdminModal();
        addAdminIndicator();
        if (!STATE.week) { try { const w = await api('getAvailableWeeks'); STATE.week = w.current || w.weeks?.[0]; } catch(e) {} }
        showToast('Access Granted', 'success');
        setTimeout(showAdminPanel, 100);
    } else {
        if(errorEl) { errorEl.textContent = '❌ Invalid password'; errorEl.classList.add('show'); }
    }
}

function addAdminIndicator() {
    document.querySelector('.admin-indicator')?.remove();
    let nav = document.querySelector('.nav-links');
    if (!nav) nav = document.getElementById('sidebar');
    if (!nav) return;
    if (!nav.querySelector('.admin-nav-link')) {
        const link = document.createElement('a');
        link.href = '#';
        link.className = 'nav-link admin-nav-link';
        link.style.marginTop = 'auto';
        link.style.borderTop = '1px solid rgba(255,255,255,0.1)';
        link.innerHTML = '<span class="nav-icon">🎛️</span><span>Admin</span>';
        link.onclick = (e) => { e.preventDefault(); STATE.isAdmin ? showAdminPanel() : showAdminLogin(); closeSidebar(); };
        nav.appendChild(link);
    }
}

function showAdminPanel() {
    if (!STATE.isAdmin) return showAdminLogin();
    document.querySelector('.admin-panel')?.remove();
    const panel = document.createElement('div');
    panel.className = 'admin-panel';
    panel.innerHTML = `
        <div class="admin-panel-header"><h3>🎛️ Mission Control (${STATE.week})</h3><button class="panel-close" onclick="closeAdminPanel()">×</button></div>
        <div class="admin-panel-tabs">
            <button class="admin-tab active" data-tab="create">Create Mission</button>
            <button class="admin-tab" data-tab="active">Active</button>
            <button class="admin-tab" data-tab="assets">Assets</button>
            <button class="admin-tab" data-tab="history">History</button>
        </div>
        <div class="admin-panel-content">
            <div id="admin-tab-create" class="admin-tab-content active">${renderCreateMissionForm()}</div>
            <div id="admin-tab-active" class="admin-tab-content"><div class="loading-text">Load...</div></div>
            <div id="admin-tab-assets" class="admin-tab-content"><div class="loading-text">Load...</div></div>
            <div id="admin-tab-history" class="admin-tab-content"><div class="loading-text">Load...</div></div>
        </div>`;
    document.body.appendChild(panel);
    panel.querySelectorAll('.admin-tab').forEach(tab => { 
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            switchAdminTab(tab.dataset.tab);
            if (tab.dataset.tab === 'active') loadActiveTeamMissions();
            if (tab.dataset.tab === 'assets') renderAdminAssets();
            if (tab.dataset.tab === 'history') loadMissionHistory();
        });
    });
}

function closeAdminPanel() { document.querySelector('.admin-panel')?.remove(); }
function exitAdminMode() { STATE.isAdmin=false; localStorage.removeItem('adminSession'); location.reload(); }

function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector(`.admin-tab[data-tab="${tabName}"]`)?.classList.add('active');
    document.getElementById(`admin-tab-${tabName}`)?.classList.add('active');
}

function renderCreateMissionForm() {
    return `
        <div class="create-mission-form">
            <div class="form-section"><h4>Type</h4><div class="mission-type-grid">${Object.entries(CONFIG.MISSION_TYPES).map(([key, m], i) => `<div class="mission-type-option ${i === 0 ? 'selected' : ''}" data-type="${key}" onclick="selectMissionType('${key}')"><span>${m.icon}</span> <span>${m.name}</span></div>`).join('')}</div><input type="hidden" id="selected-mission-type" value="switch_app"></div>
            <div class="form-section"><h4>Target</h4><div class="team-checkboxes">${Object.keys(CONFIG.TEAMS).map(team => `<label class="team-checkbox"><input type="checkbox" name="target-teams" value="${team}"> <span class="team-name" style="color:${teamColor(team)}">${team}</span></label>`).join('')}</div><label><input type="checkbox" onchange="toggleAllTeams(this.checked)"> All</label></div>
            <div class="form-section"><h4>Details</h4><input type="text" id="mission-title" class="form-input" placeholder="Title"><textarea id="mission-briefing" class="form-textarea" placeholder="Briefing"></textarea><input type="text" id="target-track" class="form-input" placeholder="Target Track"><input type="number" id="goal-target" class="form-input" value="100" placeholder="Goal #"></div>
            <div class="form-actions"><button onclick="createTeamMission()" class="btn-primary">🚀 Deploy</button></div><div id="create-result"></div>
        </div>`;
}

function selectMissionType(type) {
    document.querySelectorAll('.mission-type-option').forEach(el => el.classList.remove('selected'));
    document.querySelector(`.mission-type-option[data-type="${type}"]`)?.classList.add('selected');
    $('selected-mission-type').value = type;
}

function toggleAllTeams(checked) { document.querySelectorAll('input[name="target-teams"]').forEach(cb => cb.checked = checked); }

async function createTeamMission() {
    const type = $('selected-mission-type')?.value;
    const title = $('mission-title')?.value.trim();
    const briefing = $('mission-briefing')?.value.trim();
    const targetTeams = Array.from(document.querySelectorAll('input[name="target-teams"]:checked')).map(cb => cb.value);
    const targetTrack = $('target-track')?.value.trim();
    const goalTarget = parseInt($('goal-target')?.value) || 100;
    if (!title || targetTeams.length === 0 || !briefing) return showCreateResult('Missing Fields', true);
    loading(true);
    try {
        const res = await api('createTeamMission', { type, title, briefing, targetTeams: JSON.stringify(targetTeams), targetTrack, goalTarget, week: STATE.week, agentNo: STATE.agentNo, sessionToken: STATE.adminSession });
        if (res.success) { showCreateResult('Deployed!', false); loadActiveTeamMissions(); } else { showCreateResult(res.error, true); }
    } catch (e) { showCreateResult(e.message, true); } finally { loading(false); }
}

function showCreateResult(msg, isError) {
    const el = $('create-result');
    if(el) { el.textContent = msg; el.style.color = isError ? 'red' : 'green'; }
}

async function loadActiveTeamMissions() {
    const container = $('admin-tab-active');
    if (!container) return;
    loading(true);
    try {
        const res = await api('getTeamMissions', { status: 'active', week: STATE.week });
        const missions = res.missions || [];
        container.innerHTML = missions.length ? missions.map(m => `<div class="admin-mission-card"><div>${m.title}</div><div><button onclick="adminCompleteMission('${m.id}')" class="btn-sm btn-success">Complete</button> <button onclick="adminCancelMission('${m.id}')" class="btn-sm btn-danger">Cancel</button></div></div>`).join('') : '<p>No active missions</p>';
    } catch (e) { container.innerHTML = 'Error'; } finally { loading(false); }
}

async function loadMissionHistory() {
    const container = $('admin-tab-history');
    if (!container) return;
    loading(true);
    try {
        const res = await api('getTeamMissions', { status: 'all', week: STATE.week });
        const missions = (res.missions || []).filter(m => m.status !== 'active');
        container.innerHTML = missions.length ? missions.map(m => `<div class="history-item"><span>${m.title}</span> <span>${m.status}</span></div>`).join('') : '<p>No history</p>';
    } catch (e) { container.innerHTML = 'Error'; } finally { loading(false); }
}

function renderAdminAssets() {
    const container = $('admin-tab-assets');
    if(container) container.innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:5px;">${CONFIG.BADGE_POOL.map(url => `<img src="${url}" style="width:50px;height:50px;object-fit:cover;border:1px solid #333;">`).join('')}</div>`;
}

async function adminCompleteMission(id) {
    const team = prompt('Team Name to Complete:');
    if (!team) return;
    loading(true);
    await api('completeTeamMission', { missionId: id, team, agentNo: STATE.agentNo, sessionToken: STATE.adminSession });
    loading(false); loadActiveTeamMissions();
}

async function adminCancelMission(id) {
    if (!confirm('Cancel?')) return;
    loading(true);
    await api('cancelTeamMission', { missionId: id, agentNo: STATE.agentNo, sessionToken: STATE.adminSession });
    loading(false); loadActiveTeamMissions();
}

// ==================== DASHBOARD & ROUTES ====================
async function loadDashboard() {
    console.log('Loading Dashboard...');
    loading(true);
    try {
        // 1. Load Weeks
        const w = await api('getAvailableWeeks');
        STATE.weeks = w.weeks || [];
        STATE.week = w.current || STATE.weeks[0];
        
        // 2. Load Agent Data
        STATE.data = await api('getAgentData', { agentNo: STATE.agentNo, week: STATE.week });
        
        // 3. SWITCH SCREENS MANUALLY & EXPLICITLY
        const loginScreen = $('login-screen');
        const dashboardScreen = $('dashboard-screen');
        
        if (loginScreen) {
            loginScreen.classList.remove('active');
            loginScreen.style.display = 'none';
        }
        if (dashboardScreen) {
            dashboardScreen.classList.add('active');
            dashboardScreen.style.display = 'flex';
        }
        
        setupDashboard();
        await loadPage('home');
        
        setTimeout(() => { if (typeof NOTIFICATIONS !== 'undefined') NOTIFICATIONS.checkUpdates(); }, 1000);
    } catch (e) {
        console.error('Dashboard Load Error:', e);
        showToast('Error loading dashboard. Retrying...', 'error');
        // Only logout if it's a fatal auth error, otherwise stay to allow retry
        if (e.message.includes('Agent not found')) logout();
    } finally { 
        loading(false); 
    }
}

function setupDashboard() {
    const p = STATE.data?.profile || {};
    if ($('agent-name')) $('agent-name').textContent = p.name || 'Agent';
    if ($('agent-id')) $('agent-id').textContent = 'ID: ' + STATE.agentNo;
    const select = $('week-select');
    if (select && STATE.weeks.length) {
        select.innerHTML = STATE.weeks.map(w => `<option value="${w}" ${w === STATE.week ? 'selected' : ''}>${w}</option>`).join('');
        select.onchange = async () => {
            loading(true);
            STATE.week = select.value;
            STATE.data = await api('getAgentData', { agentNo: STATE.agentNo, week: STATE.week });
            await loadPage(STATE.page);
            loading(false);
        };
    }
    document.querySelectorAll('.nav-link').forEach(l => l.onclick = e => {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(x => x.classList.remove('active'));
        l.classList.add('active');
        loadPage(l.dataset.page);
        closeSidebar();
    });
    if (isAdminAgent()) addAdminIndicator();
    $('menu-btn')?.addEventListener('click', () => $('sidebar')?.classList.add('open'));
    $('close-sidebar')?.addEventListener('click', closeSidebar);
    $('logout-btn')?.addEventListener('click', logout);
}

function closeSidebar() { $('sidebar')?.classList.remove('open'); }
function logout() { localStorage.removeItem('spyAgent'); location.reload(); }

async function loadPage(page) {
    STATE.page = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    if (page === 'chat' && !$('page-chat')) {
        const main = document.querySelector('.pages-wrapper') || document.querySelector('main');
        const chat = document.createElement('section');
        chat.id = 'page-chat'; chat.className = 'page';
        chat.innerHTML = '<div id="chat-content"></div>';
        main.appendChild(chat);
    }
    $('page-' + page)?.classList.add('active');
    
    loading(true);
    try {
        if(page==='home') await renderHome();
        if(page==='profile') await renderProfile();
        if(page==='rankings') await renderRankings();
        if(page==='goals') await renderGoals();
        if(page==='album2x') await renderAlbum2x();
        if(page==='team-level') await renderTeamLevel();
        if(page==='comparison') await renderComparison();
        if(page==='summary') await renderSummary();
        if(page==='drawer') await renderDrawer();
        if(page==='announcements') await renderAnnouncements();
        if(page==='secret-missions') await renderSecretMissions();
        if(page==='chat') await renderChat();
    } catch (e) {} finally { loading(false); }
}

// ==================== PAGE RENDERERS ====================
async function renderHome() {
    const d = STATE.data;
    const [sum, ranks, goals] = await Promise.all([api('getWeeklySummary', {week:STATE.week}), api('getRankings', {week:STATE.week, limit:5}), api('getGoalsProgress', {week:STATE.week})]);
    if ($('home-top-agents')) $('home-top-agents').innerHTML = ranks.rankings.map((r,i) => `<div class="rank-item"><div class="rank-num">${i+1}</div><div>${sanitize(r.name)} <small style="color:${teamColor(r.team)}">${r.team}</small></div><div>${fmt(r.totalXP)}</div></div>`).join('');
    const missionsDiv = document.querySelector('.missions-grid');
    if(missionsDiv) missionsDiv.innerHTML = `
        <div class="mission-card expanded" onclick="loadPage('goals')"><div class="mission-icon">🎵</div><h3>Track Goals</h3></div>
        <div class="mission-card expanded" onclick="loadPage('goals')"><div class="mission-icon">💿</div><h3>Album Goals</h3></div>
        <div class="mission-card" onclick="loadPage('album2x')"><div class="mission-icon">✨</div><h3>2X Challenge</h3></div>
        <div class="mission-card secret" onclick="loadPage('secret-missions')"><div class="mission-icon">🔒</div><h3>Secret</h3></div>
    `;
    const quickStatsEl = document.querySelector('.quick-stats-section');
    if (quickStatsEl) {
        const team = d.profile?.team;
        quickStatsEl.innerHTML = renderGuide('home') + `<div class="card quick-stats-card" style="border-color:${teamColor(team)}40;background:linear-gradient(135deg, ${teamColor(team)}11, var(--bg-card));"><div class="card-body"><div class="quick-header">${teamPfp(team) ? `<img src="${teamPfp(team)}" class="quick-pfp" style="border-color:${teamColor(team)}">` : ''}<div class="quick-info"><div class="quick-name">Welcome, ${sanitize(d.profile?.name)}!</div><div class="quick-team" style="color:${teamColor(team)}">Team ${team}</div></div></div><div class="quick-stats-grid"><div class="quick-stat"><div class="quick-stat-value">${fmt(d.stats.totalXP)}</div><div class="quick-stat-label">XP</div></div><div class="quick-stat"><div class="quick-stat-value">${fmt(d.stats.trackScrobbles)}</div><div class="quick-stat-label">Tracks</div></div></div></div></div>`;
    }
}

async function renderChat() {
    const c = $('chat-content');
    if(c) c.innerHTML = `<div class="card"><div class="card-body" style="text-align:center;padding:40px;"><a href="https://tlk.io/${CONFIG.CHAT_CHANNEL}" target="_blank" onclick="window.open(this.href,'chat','width=500,height=700');return false;" class="btn-primary">🚀 Open Chat</a></div></div>`;
}

async function renderProfile() {
    $('profile-stats').innerHTML = `<div class="stat-box"><div class="stat-value">${fmt(STATE.data.stats.totalXP)}</div><div class="stat-label">XP</div></div><div class="stat-box"><div class="stat-value">${fmt(STATE.data.stats.trackScrobbles)}</div><div class="stat-label">Tracks</div></div>`;
}

async function renderRankings() {
    const c = $('rankings-list');
    c.innerHTML = `${renderGuide('rankings')}<div class="ranking-tabs"><button id="tab-all" class="ranking-tab active">Overall</button><button id="tab-team" class="ranking-tab">Team</button></div><div id="rank-cont"></div>`;
    const renderList = (list) => list.map((r,i)=>`<div class="rank-item">#${i+1} ${r.name} (${r.team}) - ${r.totalXP} XP</div>`).join('');
    $('tab-all').onclick = async () => { c.querySelector('#rank-cont').innerHTML = 'Loading...'; c.querySelector('#rank-cont').innerHTML = renderList((await api('getRankings', {week:STATE.week,limit:100})).rankings); };
    $('tab-team').onclick = async () => { c.querySelector('#rank-cont').innerHTML = 'Loading...'; c.querySelector('#rank-cont').innerHTML = renderList((await api('getTeamRankings', {week:STATE.week,team:STATE.data.profile.team})).rankings); };
    $('tab-all').click();
}

async function renderGoals() { 
    $('goals-content').innerHTML = 'Loading...'; 
    const g = await api('getGoalsProgress', {week:STATE.week}); 
    const team = STATE.data.profile.team;
    $('goals-content').innerHTML = `
        ${renderGuide('goals')}
        <div class="card"><div class="card-body"><h3>🎵 Track Goals</h3>${Object.entries(g.trackGoals).map(([k,v]) => {
            const cur = v.teams[team]?.current||0; const goal = v.goal; const pct = Math.min((cur/goal)*100, 100);
            return `<div><div style="display:flex;justify-content:space-between"><span>${k}</span><span>${cur}/${goal}</span></div><div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div></div>`;
        }).join('')}</div></div>
        <div class="card"><div class="card-body"><h3>💿 Album Goals</h3>${Object.entries(g.albumGoals).map(([k,v]) => {
            const cur = v.teams[team]?.current||0; const goal = v.goal; const pct = Math.min((cur/goal)*100, 100);
            return `<div><div style="display:flex;justify-content:space-between"><span>${k}</span><span>${cur}/${goal}</span></div><div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div></div>`;
        }).join('')}</div></div>`; 
}

async function renderAlbum2x() { 
    $('album2x-content').innerHTML = 'Loading...'; 
    const team = STATE.data.profile.team;
    const tracks = CONFIG.TEAM_ALBUM_TRACKS[team] || [];
    const userTracks = STATE.data.album2xStatus.tracks || {};
    $('album2x-content').innerHTML = renderGuide('album2x') + `<div class="card"><div class="card-body"><h3>${team} Album 2X</h3>${tracks.map(t => {
        const count = userTracks[t] || 0; const done = count >= 2;
        return `<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #333;"><span>${t}</span><span style="color:${done?'lightgreen':'white'}">${count}/2 ${done?'✅':''}</span></div>`;
    }).join('')}</div></div>`; 
}

async function renderTeamLevel() { 
    $('team-level-content').innerHTML = 'Loading...'; 
    const s = await api('getWeeklySummary', {week:STATE.week}); 
    $('team-level-content').innerHTML = renderGuide('team-level') + `<div class="team-level-grid">${Object.entries(s.teams).map(([k,v])=>`<div class="team-level-card" style="border-color:${teamColor(k)}">${k}<br><b>${fmt(v.teamXP)} XP</b></div>`).join('')}</div>`; 
}

async function renderComparison() { $('comparison-content').innerHTML = 'Loading...'; const c = await api('getTeamComparison', {week:STATE.week}); $('comparison-content').innerHTML = `<div class="card"><div class="card-body">${c.comparison.map(t=>`<div>${t.team}: ${t.teamXP} XP</div>`).join('')}</div></div>`; }
async function renderSummary() { $('summary-content').innerHTML = 'Check back later.'; }

async function renderDrawer() { 
    const pool = CONFIG.BADGE_POOL;
    const xp = STATE.data.stats.totalXP;
    const level = Math.floor(xp/100);
    let badgesHtml = '';
    for(let i=1; i<=level; i++) {
        // Deterministic random image based on ID + Level
        let seed = 0; const str = String(STATE.agentNo); for(let j=0;j<str.length;j++) seed += str.charCodeAt(j);
        const img = pool[(seed + i*137) % pool.length];
        badgesHtml += `<div style="text-align:center;"><img src="${img}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:2px solid gold;"><br>Lvl ${i}</div>`;
    }
    $('drawer-content').innerHTML = `<div class="card"><div class="card-body"><h3>Agent #${STATE.agentNo}</h3><p>XP: ${xp}</p>${STATE.isAdmin ? '<button onclick="showAdminLogin()" class="btn-primary">Admin</button>' : ''}</div></div><div class="card"><div class="card-header"><h3>Badges</h3></div><div class="card-body" style="display:flex;flex-wrap:wrap;gap:10px;">${badgesHtml || 'No badges yet'}</div></div>`; 
}

async function renderAnnouncements() { $('announcements-content').innerHTML = 'Loading...'; const a = await api('getAnnouncements', {week:STATE.week}); $('announcements-content').innerHTML = a.announcements.map(x=>`<div class="card"><div class="card-body"><b>${x.title}</b><p>${x.message}</p></div></div>`).join(''); }

async function renderSecretMissions() { 
    const c = $('secret-missions-content'); 
    c.innerHTML = 'Loading...'; 
    const m = await api('getTeamSecretMissions', {team:STATE.data.profile.team, agentNo:STATE.agentNo, week:STATE.week});
    const activeHtml = (m.active||[]).map(x => `
        <div class="secret-mission-card">
            <div style="font-weight:bold;">${x.title}</div>
            <div>${x.briefing}</div>
            <div class="progress-bar"><div class="progress-fill" style="width:${Math.min(((x.progress?.[STATE.data.profile.team]||0)/x.goalTarget)*100,100)}%"></div></div>
        </div>`).join('') || 'No active missions';
    c.innerHTML = renderGuide('secret-missions') + `<div class="card"><div class="card-body"><h3>Active Missions</h3>${activeHtml}</div></div>`;
}

// ==================== NOTIFICATIONS ====================
const NOTIFICATIONS = {
    checkUpdates: function() { /* Logic to show dots */ }
};

document.addEventListener('DOMContentLoaded', initApp);
console.log('v4.0 Loaded');

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

console.log('🎮 BTS Spy Battle v3.8 Loaded (Fixed)');
