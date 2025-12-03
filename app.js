This sounds like a **CSS Layering (Z-Index) issue** or a **CSS Animation conflict**. The panel is likely opening, but getting hidden immediately behind the dashboard or fading out because of a transition bug.

Here is **v4.1**. I have stripped out the "fancy" close animations and forced the Admin Panel to sit on top of **everything** with aggressive CSS.

### 🔧 Changes in this version:
1.  **Forced Visibility:** Added `!important` to the Admin Panel CSS to ensure nothing overrides it.
2.  **Removed Animations:** The panel now opens/closes instantly to prevent it from getting stuck in a "fading out" state.
3.  **Z-Index Boost:** Increased Z-Index to `999999` to ensure it's above the loading screen and dashboard.
4.  **Direct Cleanup:** The `closeAdminPanel` function now deletes the element immediately, preventing ghost elements.

### 📋 Copy & Paste Full Code:

```javascript
// ===== BTS SPY BATTLE - COMPLETE APP.JS v4.1 (Stability Fix) =====

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
    console.log('🚀 Starting App v4.1 (Stability Fix)...');
    ensureAdminCSS(); 
    loading(false);
    setupLoginListeners();
    loadAllAgents();

    const saved = localStorage.getItem('spyAgent');
    if (saved) {
        STATE.agentNo = saved;
        checkAdminStatus();
        loadDashboard();
    }
}

// === AGGRESSIVE ADMIN CSS ===
function ensureAdminCSS() {
    if (document.getElementById('admin-panel-styles')) return;
    const style = document.createElement('style');
    style.id = 'admin-panel-styles';
    style.innerHTML = `
        .admin-panel { 
            position: fixed !important; 
            top: 0 !important; 
            left: 0 !important; 
            width: 100vw !important; 
            height: 100vh !important; 
            background: #0a0a0f !important; 
            z-index: 999999 !important; 
            display: flex !important; 
            flex-direction: column !important;
            opacity: 1 !important;
            transform: none !important;
        }
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
    const agentInput = $('agent-input');
    const agentNo = agentInput?.value.trim().toUpperCase();
    if (!agentNo) { showResult('Enter Agent Number', true); return; }
    loading(true);
    try {
        if (STATE.allAgents.length === 0) await loadAllAgents();
        const found = STATE.allAgents.find(a => String(a.agentNo).trim().toUpperCase() === agentNo);
        if (!found) throw new Error('Agent not found');
        localStorage.setItem('spyAgent', found.agentNo);
        STATE.agentNo = found.agentNo;
        checkAdminStatus();
        await loadDashboard();
    } catch (e) { showResult(e.message, true); } finally { loading(false); }
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
    if (savedSession && savedExpiry && Date.now() < parseInt(savedExpiry)) {
        STATE.isAdmin = true;
        STATE.adminSession = savedSession;
        localStorage.setItem('adminExpiry', String(Date.now() + 86400000));
    } else {
        STATE.isAdmin = false;
    }
}

function showAdminLogin() {
    if (!isAdminAgent()) { showToast('Access denied.', 'error'); return; }
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
    // REMOVED ANIMATION TO PREVENT GLITCHES
    if (modal) modal.remove();
}

async function verifyAdminPassword() {
    const password = $('admin-password')?.value;
    if (!password) return;
    
    let verified = false;
    // 1. Instant Check
    if (password === CONFIG.ADMIN_PASSWORD) {
        verified = true;
        STATE.adminSession = 'local_' + Date.now();
    } else {
        try {
            const result = await api('verifyAdmin', { agentNo: STATE.agentNo, password });
            if (result.success) { verified = true; STATE.adminSession = result.sessionToken; }
        } catch (e) {}
    }

    if (verified) {
        STATE.isAdmin = true;
        localStorage.setItem('adminSession', STATE.adminSession);
        localStorage.setItem('adminExpiry', String(Date.now() + 86400000));
        closeAdminModal();
        addAdminIndicator();
        if (!STATE.week) { try { const w = await api('getAvailableWeeks'); STATE.week = w.current || w.weeks?.[0]; } catch(e) {} }
        showToast('Access Granted', 'success');
        
        // Force open without delay
        showAdminPanel();
    } else {
        const err = $('admin-error');
        if (err) { err.textContent = '❌ Invalid password'; err.classList.add('show'); }
    }
}

function isAdminAgent() {
    return String(STATE.agentNo).toUpperCase() === String(CONFIG.ADMIN_AGENT_NO).toUpperCase();
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

// ==================== ADMIN PANEL (FIXED) ====================
function showAdminPanel() {
    if (!STATE.isAdmin) return showAdminLogin();
    
    // Force cleanup
    document.querySelectorAll('.admin-panel').forEach(p => p.remove());

    const panel = document.createElement('div');
    panel.className = 'admin-panel';
    // Explicitly set display to ensure visibility
    panel.style.display = 'flex';
    
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
            <div id="admin-tab-active" class="admin-tab-content"><div class="loading-text">Loading...</div></div>
            <div id="admin-tab-assets" class="admin-tab-content"><div class="loading-text">Loading...</div></div>
            <div id="admin-tab-history" class="admin-tab-content"><div class="loading-text">Loading...</div></div>
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

function closeAdminPanel() { 
    // IMMEDIATE REMOVAL NO ANIMATION
    document.querySelectorAll('.admin-panel').forEach(p => p.remove()); 
}

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

// ==================== DASHBOARD ====================
async function loadDashboard() {
    console.log('🏠 Loading dashboard...');
    loading(true);
    try {
        const weeksRes = await api('getAvailableWeeks');
        STATE.weeks = weeksRes.weeks || [];
        STATE.week = weeksRes.current || STATE.weeks[0];
        
        STATE.data = await api('getAgentData', { agentNo: STATE.agentNo, week: STATE.week });
        if (STATE.data?.lastUpdated) STATE.lastUpdated = STATE.data.lastUpdated;
        
        $('login-screen').classList.remove('active');
        $('login-screen').style.display = 'none';
        $('dashboard-screen').classList.add('active');
        $('dashboard-screen').style.display = 'flex';
        
        setupDashboard();
        await loadPage('home');
        
        if (STATE.isAdmin) addAdminIndicator();
        setTimeout(() => { if (typeof NOTIFICATIONS !== 'undefined') NOTIFICATIONS.checkUpdates(); }, 1500); 
    } catch (e) {
        console.error('Dashboard error:', e);
        showToast('Failed to load: ' + e.message, 'error');
        logout();
    } finally { loading(false); }
}

function setupDashboard() {
    const p = STATE.data?.profile;
    if (p) {
        const color = teamColor(p.team);
        const pfp = teamPfp(p.team);
        const initial = (p.name || 'A')[0].toUpperCase();
        ['agent', 'profile'].forEach(prefix => {
            const avatar = $(prefix + '-avatar');
            if (avatar) {
                if (pfp) avatar.innerHTML = `<img src="${pfp}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
                else { avatar.textContent = initial; avatar.style.background = color; }
            }
            if ($(prefix + '-name')) $(prefix + '-name').textContent = p.name || 'Agent';
            if ($(prefix + '-team')) { $(prefix + '-team').textContent = p.team || 'Team'; $(prefix + '-team').style.color = color; }
            if ($(prefix + '-id')) $(prefix + '-id').textContent = 'ID: ' + STATE.agentNo;
        });
    }
    
    const select = $('week-select');
    if (select && STATE.weeks.length) {
        select.innerHTML = STATE.weeks.map(w => `<option value="${w}" ${w === STATE.week ? 'selected' : ''}>${w}</option>`).join('');
        select.onchange = async () => {
            loading(true);
            try {
                STATE.data = await api('getAgentData', { agentNo: STATE.agentNo, week: select.value });
                STATE.week = select.value;
                if (STATE.data?.lastUpdated) { STATE.lastUpdated = STATE.data.lastUpdated; updateTime(); }
                await loadPage(STATE.page);
            } catch (e) { showToast('Failed to load week', 'error'); } finally { loading(false); }
        };
    }
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = e => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                loadPage(page);
                closeSidebar();
            }
        };
    });
    
    if (isAdminAgent()) addAdminIndicator();
    $('menu-btn')?.addEventListener('click', () => $('sidebar')?.classList.add('open'));
    $('close-sidebar')?.addEventListener('click', closeSidebar);
    $('logout-btn')?.addEventListener('click', logout);
    updateTime();
}

function closeSidebar() { $('sidebar')?.classList.remove('open'); }

function logout() {
    if (confirm('Logout?')) {
        localStorage.removeItem('spyAgent');
        localStorage.removeItem('adminSession');
        localStorage.removeItem('adminExpiry');
        location.reload();
    }
}

// ==================== PAGE ROUTER ====================
async function loadPage(page) {
    STATE.page = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    if (page === 'chat' && !$('page-chat')) {
        const mainContent = document.querySelector('.pages-wrapper') || document.querySelector('main');
        if (mainContent) {
            const chatPage = document.createElement('section');
            chatPage.id = 'page-chat';
            chatPage.className = 'page';
            chatPage.innerHTML = `<div id="chat-content"></div>`;
            mainContent.appendChild(chatPage);
        }
    }

    const el = $('page-' + page);
    if (el) el.classList.add('active');
    
    loading(true);
    try {
        switch(page) {
            case 'home': await renderHome(); break;
            case 'profile': await renderProfile(); break;
            case 'rankings': await renderRankings(); break;
            case 'goals': await renderGoals(); break;
            case 'album2x': await renderAlbum2x(); break;
            case 'team-level': await renderTeamLevel(); break;
            case 'comparison': await renderComparison(); break;
            case 'summary': await renderSummary(); break;
            case 'drawer': await renderDrawer(); break;
            case 'announcements': await renderAnnouncements(); break;
            case 'secret-missions': await renderSecretMissions(); break;
            case 'chat': await renderChat(); break;
        }
    } catch (e) {
        if (el) el.innerHTML = `<div class="error-page"><h3>Failed to load</h3><p>${sanitize(e.message)}</p><button onclick="loadPage('${page}')" class="btn-primary">Retry</button></div>`;
    } finally { loading(false); }
}

// ==================== RENDERERS ====================
async function renderChat() {
    const container = document.getElementById('chat-content');
    if (!container) return;
    const team = STATE.data?.profile?.team || 'Unknown';
    const name = sanitize(STATE.data?.profile?.name) || 'Agent';
    const color = teamColor(team);
    const chatUrl = `https://tlk.io/${CONFIG.CHAT_CHANNEL}`;
    container.innerHTML = `<div class="card" style="height: 100%; display: flex; flex-direction: column; margin-bottom: 0;"><div class="card-header" style="border-bottom: 1px solid var(--border);"><h3>💬 Secret Comms Channel</h3><div class="mission-hint">Encrypted Channel • Logged in as <span style="color:${color}">${name}</span></div></div><div class="card-body" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; background: radial-gradient(circle at center, #1a1a2e 0%, #0a0a0f 100%);"><div style="font-size: 60px; margin-bottom: 20px; animation: float 3s ease-in-out infinite;">🛰️</div><h2 style="color: var(--text-bright); margin-bottom: 10px;">Secure Link Established</h2><p style="color: var(--text-dim); max-width: 400px; margin-bottom: 30px; font-size: 14px;">To bypass ad-blockers and ensure transmission security, the comms channel must be opened in a secure popup link.</p><a href="${chatUrl}" target="_blank" onclick="window.open(this.href, 'bts_chat', 'width=500,height=700'); return false;" class="btn-primary" style="padding: 15px 30px; font-size: 16px; border: 1px solid var(--purple-glow); box-shadow: 0 0 20px rgba(123, 44, 191, 0.3);">🚀 LAUNCH COMMS CHANNEL</a><div style="margin-top: 30px; font-size: 11px; color: var(--text-muted);">Status: <span style="color: var(--success);">ONLINE</span> • Encryption: <span style="color: var(--success);">ACTIVE</span></div></div></div>`;
}

async function renderHome() {
    const selectedWeek = STATE.week;
    $('current-week').textContent = `Week: ${selectedWeek}`;
    const guideHtml = renderGuide('home'); 
    try {
        const [summary, rankings, goals] = await Promise.all([api('getWeeklySummary', { week: selectedWeek }), api('getRankings', { week: selectedWeek, limit: 5 }), api('getGoalsProgress', { week: selectedWeek })]);
        if (summary.lastUpdated) { STATE.lastUpdated = summary.lastUpdated; updateTime(); }
        const team = STATE.data?.profile?.team;
        const teamData = summary.teams?.[team] || {};
        const myStats = STATE.data?.stats || {};
        const isCompleted = isWeekCompleted(selectedWeek);
        const daysLeft = getDaysRemaining(selectedWeek);
        
        const quickStatsEl = document.querySelector('.quick-stats-section');
        if (quickStatsEl) {
            quickStatsEl.innerHTML = guideHtml + `<div class="card quick-stats-card" style="border-color:${teamColor(team)}40;background:linear-gradient(135deg, ${teamColor(team)}11, var(--bg-card));"><div class="card-body"><div class="quick-header">${teamPfp(team) ? `<img src="${teamPfp(team)}" class="quick-pfp" style="border-color:${teamColor(team)}">` : ''}<div class="quick-info"><div class="quick-name">Welcome, ${sanitize(STATE.data?.profile?.name)}!</div><div class="quick-team" style="color:${teamColor(team)}">Team ${team} • Rank #${STATE.data?.rank || 'N/A'}</div></div></div><div class="quick-stats-grid"><div class="quick-stat"><div class="quick-stat-value">${fmt(myStats.totalXP)}</div><div class="quick-stat-label">XP</div></div><div class="quick-stat"><div class="quick-stat-value">${fmt(myStats.trackScrobbles || 0)}</div><div class="quick-stat-label">Tracks</div></div><div class="quick-stat"><div class="quick-stat-value">${fmt(myStats.albumScrobbles || 0)}</div><div class="quick-stat-label">Albums</div></div></div><div class="battle-timer ${isCompleted ? 'ended' : ''}">${isCompleted ? '🏆 Week Completed' : (daysLeft <= 1 ? '🚀 Final Day!' : `⏰ ${daysLeft} days left`)}</div>${isCompleted ? `<div class="results-alert" onclick="loadPage('summary')">🏆 View Final Results →</div>` : ''}${STATE.lastUpdated ? `<div class="last-updated-mini">Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}</div></div>`;
        }
        
        const trackGoals = goals.trackGoals || {};
        const albumGoals = goals.albumGoals || {};
        const album2xStatus = STATE.data?.album2xStatus || {};
        const teamTracks = CONFIG.TEAM_ALBUM_TRACKS[team] || [];
        const tracksCompleted2x = teamTracks.filter(t => (album2xStatus.tracks?.[t] || 0) >= 2).length;
        
        const trackGoalsList = Object.entries(trackGoals).map(([trackName, info]) => {
            const tp = info.teams?.[team] || {};
            return { name: trackName, current: tp.current || 0, goal: info.goal || 0, done: tp.status === 'Completed' || (tp.current || 0) >= (info.goal || 0) };
        });
        const albumGoalsList = Object.entries(albumGoals).map(([albumName, info]) => {
            const ap = info.teams?.[team] || {};
            return { name: albumName, current: ap.current || 0, goal: info.goal || 0, done: ap.status === 'Completed' || (ap.current || 0) >= (info.goal || 0) };
        });

        const missionCardsContainer = document.querySelector('.missions-grid');
        if (missionCardsContainer) {
            missionCardsContainer.innerHTML = `
                <div class="mission-card expanded" onclick="loadPage('goals')"><div class="mission-icon">🎵</div><h3>Track Goals</h3><div class="mission-status ${teamData.trackGoalPassed ? 'complete' : ''}">${teamData.trackGoalPassed ? '✅ Complete' : '⏳ In Progress'}</div><div class="goals-list">${trackGoalsList.length ? trackGoalsList.map(g => `<div class="goal-mini ${g.done ? 'done' : ''}"><span class="goal-name">${sanitize(g.name)}</span><span class="goal-progress">${fmt(g.current)}/${fmt(g.goal)} ${g.done ? '✅' : ''}</span></div>`).join('') : '<p class="no-goals">No track goals</p>'}</div></div>
                <div class="mission-card expanded" onclick="loadPage('goals')"><div class="mission-icon">💿</div><h3>Album Goals</h3><div class="mission-status ${teamData.albumGoalPassed ? 'complete' : ''}">${teamData.albumGoalPassed ? '✅ Complete' : '⏳ In Progress'}</div><div class="goals-list">${albumGoalsList.length ? albumGoalsList.map(g => `<div class="goal-mini ${g.done ? 'done' : ''}"><span class="goal-name">${sanitize(g.name)}</span><span class="goal-progress">${fmt(g.current)}/${fmt(g.goal)} ${g.done ? '✅' : ''}</span></div>`).join('') : '<p class="no-goals">No album goals</p>'}</div></div>
                <div class="mission-card" onclick="loadPage('album2x')"><div class="mission-icon">✨</div><h3>Album 2X</h3><div class="mission-subtitle">${sanitize(CONFIG.TEAMS[team]?.album || team)}</div><div class="mission-status ${album2xStatus.passed ? 'complete' : ''}">${album2xStatus.passed ? '✅ Complete' : '⏳ In Progress'}</div><div class="mission-progress"><div class="progress-bar"><div class="progress-fill ${album2xStatus.passed ? 'complete' : ''}" style="width:${teamTracks.length ? (tracksCompleted2x/teamTracks.length*100) : 0}%"></div></div><span>${tracksCompleted2x}/${teamTracks.length} tracks</span></div></div>
                <div class="mission-card secret" onclick="loadPage('secret-missions')"><div class="mission-icon">🔒</div><h3>Secret Missions</h3><div class="mission-status">🕵️ Classified</div><div class="mission-hint">Tap to view team missions</div></div>
                <div class="mission-card" onclick="loadPage('chat')"><div class="mission-icon">💬</div><h3>Secret Comms</h3><div class="mission-subtitle">HQ Encrypted Channel</div><div class="mission-hint">Tap to join chat</div></div>
            `;
        }
        
        const rankList = rankings.rankings || [];
        const topAgentsEl = $('home-top-agents');
        if (topAgentsEl) {
            topAgentsEl.innerHTML = rankList.length ? rankList.slice(0, 5).map((r, i) => `<div class="rank-item ${String(r.agentNo) === String(STATE.agentNo) ? 'highlight' : ''}" onclick="loadPage('rankings')"><div class="rank-num">${i+1}</div><div class="rank-info"><div class="rank-name">${sanitize(r.name)}</div><div class="rank-team" style="color:${teamColor(r.team)}">${r.team}</div></div><div class="rank-xp">${fmt(r.totalXP)} XP</div></div>`).join('') : '<p class="empty-text">No data yet</p>';
        }
        
        const sortedTeams = Object.keys(summary.teams || {}).sort((a, b) => (summary.teams[b].teamXP || 0) - (summary.teams[a].teamXP || 0));
        const standingsEl = $('home-standings');
        if (standingsEl) {
            standingsEl.innerHTML = sortedTeams.length ? `
                <div class="standings-header"><span class="standings-badge ${isCompleted ? 'final' : ''}">${isCompleted ? '🏆 Final Standings' : '⏳ Live Battle'}</span></div>
                ${sortedTeams.map((t, i) => {
                    const td = summary.teams[t];
                    return `<div class="standing-item ${t === team ? 'my-team' : ''}" onclick="loadPage('team-level')" style="--team-color:${teamColor(t)}"><div class="standing-rank">${i+1}</div>${teamPfp(t) ? `<img src="${teamPfp(t)}" class="standing-pfp">` : ''}<div class="standing-info"><div class="standing-name" style="color:${teamColor(t)}">${t}</div><div class="standing-xp">${fmt(td.teamXP)} XP</div></div><div class="standing-missions">${td.trackGoalPassed?'🎵✅':'🎵❌'} ${td.albumGoalPassed?'💿✅':'💿❌'} ${td.album2xPassed?'✨✅':'✨❌'}</div></div>`;
                }).join('')}
                <div class="standings-footer"><button class="btn-secondary" onclick="loadPage('comparison')">View Battle Details →</button></div>
            ` : '<p class="empty-text">No data yet</p>';
        }
    } catch (e) { console.error(e); showToast('Failed to load home', 'error'); }
}

async function renderSummary() {
    const container = $('summary-content');
    const selectedWeek = STATE.week;
    const isCompleted = isWeekCompleted(selectedWeek);
    if (!isCompleted) {
        const days = getDaysRemaining(selectedWeek);
        container.innerHTML = `<div class="card"><div class="card-body" style="text-align:center;padding:60px 20px;"><div style="font-size:64px;margin-bottom:20px;">🔒</div><h2>Summary Locked</h2><p style="color:var(--text-dim);margin:16px 0;">Results for <strong>${selectedWeek}</strong> are not yet final.</p><div class="countdown-box"><div class="countdown-value">${days}</div><div class="countdown-label">day${days !== 1 ? 's' : ''} until results</div></div><button onclick="loadPage('home')" class="btn-primary" style="margin-top:20px;">View Live Progress →</button></div></div>`;
        return;
    }
    try {
        const [summary, winners] = await Promise.all([api('getWeeklySummary', { week: selectedWeek }), api('getWeeklyWinners').catch(() => ({ winners: [] }))]);
        const teams = summary.teams || {};
        const sorted = Object.entries(teams).sort((a, b) => (b[1].teamXP || 0) - (a[1].teamXP || 0));
        const actualWinner = sorted[0]?.[0] || summary.winner;
        container.innerHTML = `<div class="summary-week-header"><h2>📊 ${selectedWeek} Results</h2><p class="results-date">${isCompleted ? 'Battle Concluded' : 'Provisional Results'}</p></div>${actualWinner ? `<div class="card winner-card" style="border-color:${teamColor(actualWinner)}"><div class="card-body" style="text-align:center;padding:40px;"><div style="font-size:64px;margin-bottom:16px;">🏆</div><h2 style="color:${teamColor(actualWinner)}">Team ${actualWinner} WINS!</h2><p style="font-size:32px;color:var(--purple-glow);">${fmt(teams[actualWinner]?.teamXP)} XP</p></div></div>` : ''}<div class="card"><div class="card-header"><h3>📊 Final Standings</h3></div><div class="card-body">${sorted.map(([t, info], i) => `<div class="final-standing ${i===0?'winner':''}" style="border-left-color:${teamColor(t)}"><span class="standing-pos">${i+1}</span><div class="standing-details"><div style="color:${teamColor(t)};font-weight:600;">${t}</div></div><div class="standing-xp-final">${fmt(info.teamXP)} XP</div></div>`).join('')}</div></div>`;
    } catch (e) { container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load summary</p></div></div>'; }
}

async function renderDrawer() {
    const container = $('drawer-content');
    if (!container) return;
    const profile = STATE.data?.profile || {};
    const stats = STATE.data?.stats || {};
    const currentXP = stats.totalXP || 0;
    function getLevelBadges(agentNo, totalXP) {
        const pool = CONFIG.BADGE_POOL;
        if (!pool || pool.length === 0) return [];
        const xp = parseInt(totalXP) || 0;
        const currentLevel = Math.floor(xp / 100);
        const badges = [];
        for (let level = 1; level <= currentLevel; level++) {
            let seed = 0;
            const str = String(agentNo).toUpperCase();
            for (let i = 0; i < str.length; i++) seed += str.charCodeAt(i);
            seed += (level * 137);
            const index = seed % pool.length;
            badges.push({ name: `Level ${level}`, description: `Unlocked at ${level * 100} XP`, imageUrl: pool[index], isLevelBadge: true });
        }
        return badges.reverse();
    }
    const levelBadges = getLevelBadges(STATE.agentNo, currentXP);
    const allBadges = levelBadges;
    const isAdmin = String(STATE.agentNo).toUpperCase() === String(CONFIG.ADMIN_AGENT_NO).toUpperCase();
    container.innerHTML = `
        <div class="card"><div class="card-body"><div class="drawer-header">${teamPfp(profile.team) ? `<img src="${teamPfp(profile.team)}" class="drawer-pfp" style="border-color:${teamColor(profile.team)}">` : ''}<div class="drawer-info"><div class="drawer-name">${sanitize(profile.name)}</div><div class="drawer-team" style="color:${teamColor(profile.team)}">Team ${profile.team}</div><div class="drawer-id">Agent #${STATE.agentNo}</div></div></div>${isAdmin ? `<button onclick="showAdminLogin()" class="btn-primary" style="width:100%; margin: 10px 0;">🔐 Access Mission Control</button>` : ''}<div class="drawer-stats"><div class="drawer-stat"><span class="value">${fmt(currentXP)}</span><span class="label">Total XP</span></div><div class="drawer-stat"><span class="value">${allBadges.length}</span><span class="label">Badges</span></div></div></div></div>
        <div class="card"><div class="card-header"><h3>🎖️ Collection (${allBadges.length})</h3><div style="font-size:11px; color:var(--text-dim)">Next Reward: ${(Math.floor(currentXP/100) + 1) * 100} XP</div></div><div class="card-body">${allBadges.length ? `<div class="badges-showcase">${allBadges.map(b => `<div class="badge-showcase-item"><div class="badge-circle" style="${b.isLevelBadge ? 'border-color:#ffd700;' : ''}"><img src="${b.imageUrl}" onerror="this.style.display='none';this.parentElement.innerHTML='❓';"></div><div class="badge-name">${sanitize(b.name)}</div><div class="badge-desc">${sanitize(b.description)}</div></div>`).join('')}</div>` : `<div class="empty-state" style="text-align:center; padding:20px; color:#777;"><div style="font-size:40px; margin-bottom:10px;">🔒</div>Earn 100 XP to unlock your first random badge!</div>`}</div></div>
    `;
}

async function renderProfile() {
    const stats = STATE.data?.stats || {};
    const album2xStatus = STATE.data?.album2xStatus || {};
    const trackContributions = STATE.data?.trackContributions || {};
    const albumContributions = STATE.data?.albumContributions || {};
    $('profile-stats').innerHTML = `<div class="stat-box"><div class="stat-value">${fmt(stats.totalXP)}</div><div class="stat-label">XP</div></div><div class="stat-box"><div class="stat-value">#${STATE.data?.rank || 'N/A'}</div><div class="stat-label">Rank</div></div><div class="stat-box"><div class="stat-value">#${STATE.data?.teamRank || 'N/A'}</div><div class="stat-label">Team Rank</div></div><div class="stat-box"><div class="stat-value">${fmt(stats.trackScrobbles)}</div><div class="stat-label">Tracks</div></div><div class="stat-box"><div class="stat-value">${fmt(stats.albumScrobbles)}</div><div class="stat-label">Albums</div></div><div class="stat-box"><div class="stat-value">${album2xStatus.passed ? '✅' : '❌'}</div><div class="stat-label">2X</div></div>`;
    $('profile-tracks').innerHTML = Object.keys(trackContributions).length ? Object.entries(trackContributions).sort((a, b) => b[1] - a[1]).map(([t, c]) => `<div class="contrib-item"><span>${sanitize(t)}</span><span>${fmt(c)}</span></div>`).join('') : '<p class="empty-text">No track data</p>';
    $('profile-albums').innerHTML = Object.keys(albumContributions).length ? Object.entries(albumContributions).sort((a, b) => b[1] - a[1]).map(([a, c]) => `<div class="contrib-item"><span>${sanitize(a)}</span><span>${fmt(c)}</span></div>`).join('') : '<p class="empty-text">No album data</p>';
    try {
        const badgesData = await api('getBadges', { agentNo: STATE.agentNo });
        $('profile-badges').innerHTML = (badgesData.badges || []).length ? `<div class="badges-grid">${badgesData.badges.map(b => `<div class="badge-item"><div class="badge-icon">${b.imageUrl ? `<img src="${b.imageUrl}">` : '🎖️'}</div><div class="badge-name">${sanitize(b.name)}</div></div>`).join('')}</div>` : '<p class="empty-text">No badges yet</p>';
    } catch (e) { $('profile-badges').innerHTML = '<p class="empty-text">No badges</p>'; }
}

async function renderRankings() {
    const container = $('rankings-list');
    if (!container) return;
    const myTeam = STATE.data?.profile?.team || 'Team';
    const tColor = teamColor(myTeam);
    container.innerHTML = `${renderGuide('rankings')}<div class="ranking-tabs"><button id="rank-tab-overall" class="ranking-tab active">🏆 Overall</button><button id="rank-tab-team" class="ranking-tab" style="--team-color: ${tColor};">${myTeam}</button></div><div id="rankings-content-container"><div class="loading-skeleton"><div class="skeleton-card"></div><div class="skeleton-card"></div></div></div>`;
    $('rank-tab-overall').onclick = () => switchRankingTab('overall');
    $('rank-tab-team').onclick = () => switchRankingTab('team');
    await renderOverallRankings();
}

async function switchRankingTab(tab) {
    const overallTab = $('rank-tab-overall');
    const teamTab = $('rank-tab-team');
    const contentContainer = $('rankings-content-container');
    if (!overallTab || !teamTab || !contentContainer) return;
    contentContainer.innerHTML = `<div class="loading-skeleton"><div class="skeleton-card"></div><div class="skeleton-card"></div></div>`;
    loading(true);
    if (tab === 'overall') { overallTab.classList.add('active'); teamTab.classList.remove('active'); await renderOverallRankings(); } 
    else { overallTab.classList.remove('active'); teamTab.classList.add('active'); await renderMyTeamRankings(); }
    loading(false);
}

async function renderOverallRankings() {
    const container = $('rankings-content-container');
    if (!container) return;
    try {
        const data = await api('getRankings', { week: STATE.week, limit: 100 });
        if (data.lastUpdated) STATE.lastUpdated = data.lastUpdated;
        const rankingsHtml = (data.rankings || []).map((r, i) => `<div class="rank-item ${String(r.agentNo) === String(STATE.agentNo) ? 'highlight' : ''}"><div class="rank-num">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</div><div class="rank-info"><div class="rank-name">${sanitize(r.name)}${String(r.agentNo) === String(STATE.agentNo) ? ' (You)' : ''}</div><div class="rank-team" style="color:${teamColor(r.team)}">${r.team}</div></div><div class="rank-xp">${fmt(r.totalXP)} XP</div></div>`).join('') || '<p class="empty-text">No ranking data yet</p>';
        container.innerHTML = `<div class="rankings-header"><span class="week-badge">${STATE.week}</span></div>${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}${rankingsHtml}`;
    } catch (e) { container.innerHTML = '<p class="error-text">Failed to load overall rankings</p>'; }
}

async function renderMyTeamRankings() {
    const container = $('rankings-content-container');
    if (!container) return;
    const myTeam = STATE.data?.profile?.team;
    if (!myTeam) { container.innerHTML = '<p class="error-text">Could not identify your team.</p>'; return; }
    try {
        const data = await api('getTeamRankings', { week: STATE.week, team: myTeam });
        if (data.lastUpdated) STATE.lastUpdated = data.lastUpdated;
        const rankingsHtml = (data.rankings || []).map((r, i) => `<div class="rank-item ${String(r.agentNo) === String(STATE.agentNo) ? 'highlight' : ''}" style="border-left-color: ${teamColor(myTeam)}"><div class="rank-num">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</div><div class="rank-info"><div class="rank-name">${sanitize(r.name)}${String(r.agentNo) === String(STATE.agentNo) ? ' (You)' : ''}</div><div class="rank-team" style="color:${teamColor(r.team)}">${r.team} Agent</div></div><div class="rank-xp">${fmt(r.totalXP)} XP</div></div>`).join('') || '<p class="empty-text">No team ranking data yet</p>';
        container.innerHTML = `<div class="rankings-header"><span class="week-badge" style="background-color: ${teamColor(myTeam)}">${myTeam} Leaderboard</span></div>${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}${rankingsHtml}`;
    } catch (e) { container.innerHTML = '<p class="error-text">Failed to load team rankings.</p>'; }
}

async function renderGoals() {
    const container = $('goals-content');
    const team = STATE.data?.profile?.team;
    try {
        const data = await api('getGoalsProgress', { week: STATE.week });
        if (data.lastUpdated) STATE.lastUpdated = data.lastUpdated;
        let html = renderGuide('goals') + `<div class="goals-header"><span class="week-badge">${STATE.week}</span></div><div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated || 'recently')}</div>`;
        const trackGoals = data.trackGoals || {};
        if (Object.keys(trackGoals).length) {
            html += `<div class="card"><div class="card-header"><h3>🎵 Track Goals</h3><span class="team-badge" style="background:${teamColor(team)}22;color:${teamColor(team)}">${team}</span></div><div class="card-body">`;
            for (const [track, info] of Object.entries(trackGoals)) {
                const tp = info.teams?.[team] || {};
                const current = tp.current || 0; const goal = info.goal || 0;
                const done = tp.status === 'Completed' || current >= goal;
                const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
                html += `<div class="goal-item ${done ? 'completed' : ''}"><div class="goal-header"><span class="goal-name">${sanitize(track)}</span><span class="goal-status ${done ? 'complete' : ''}">${fmt(current)}/${fmt(goal)} ${done ? '✅' : ''}</span></div><div class="progress-bar"><div class="progress-fill ${done ? 'complete' : ''}" style="width:${pct}%"></div></div></div>`;
            }
            html += '</div></div>';
        }
        const albumGoals = data.albumGoals || {};
        if (Object.keys(albumGoals).length) {
            html += `<div class="card"><div class="card-header"><h3>💿 Album Goals</h3><span class="team-badge" style="background:${teamColor(team)}22;color:${teamColor(team)}">${team}</span></div><div class="card-body">`;
            for (const [album, info] of Object.entries(albumGoals)) {
                const ap = info.teams?.[team] || {};
                const current = ap.current || 0; const goal = info.goal || 0;
                const done = ap.status === 'Completed' || current >= goal;
                const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
                html += `<div class="goal-item ${done ? 'completed' : ''}"><div class="goal-header"><span class="goal-name">${sanitize(album)}</span><span class="goal-status ${done ? 'complete' : ''}">${fmt(current)}/${fmt(goal)} ${done ? '✅' : ''}</span></div><div class="progress-bar"><div class="progress-fill ${done ? 'complete' : ''}" style="width:${pct}%"></div></div></div>`;
            }
            html += '</div></div>';
        }
        container.innerHTML = html || '<div class="card"><div class="card-body"><p class="empty-text">No goals set for this week</p></div></div>';
    } catch (e) { container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load goals</p></div></div>'; }
}

async function renderAlbum2x() {
    const container = $('album2x-content');
    const team = STATE.data?.profile?.team;
    const album2xStatus = STATE.data?.album2xStatus || {};
    const userTracks = album2xStatus.tracks || {};
    const teamTracks = CONFIG.TEAM_ALBUM_TRACKS[team] || [];
    const albumName = CONFIG.TEAMS[team]?.album || team;
    let completedCount = 0;
    const trackResults = teamTracks.map(track => {
        const count = userTracks[track] || 0;
        const passed = count >= 2;
        if (passed) completedCount++;
        return { name: track, count, passed };
    });
    const allComplete = completedCount === trackResults.length && trackResults.length > 0;
    const pct = trackResults.length ? Math.round((completedCount / trackResults.length) * 100) : 0;
    container.innerHTML = renderGuide('album2x') + `
        <div class="card" style="border-color:${allComplete ? 'var(--success)' : teamColor(team)}"><div class="card-body" style="text-align:center;padding:30px;"><div style="font-size:56px;margin-bottom:16px;">${allComplete ? '🎉' : '⏳'}</div><h2 style="color:${teamColor(team)};margin-bottom:8px;">${sanitize(albumName)}</h2><p style="color:var(--text-dim);margin-bottom:20px;">Stream every track at least 2 times</p><div style="font-size:48px;font-weight:700;color:${allComplete ? 'var(--success)' : 'var(--purple-glow)'}">${completedCount}/${trackResults.length}</div><p style="color:var(--text-dim);">Tracks completed</p><div class="progress-bar" style="margin:20px auto;max-width:300px;height:12px;"><div class="progress-fill ${allComplete ? 'complete' : ''}" style="width:${pct}%;background:${allComplete ? 'var(--success)' : teamColor(team)}"></div></div></div></div>
        <div class="card"><div class="card-header"><h3>📋 Track Checklist</h3></div><div class="card-body">${trackResults.map((t, i) => `<div class="track-item ${t.passed ? 'passed' : 'pending'}" style="border-left-color:${t.passed ? 'var(--success)' : 'var(--danger)'}"><span class="track-num">${i + 1}</span><span class="track-name">${sanitize(t.name)}</span><span class="track-status ${t.passed ? 'pass' : 'fail'}">${t.count}/2 ${t.passed ? '✅' : '❌'}</span></div>`).join('')}</div></div>
    `;
}

async function renderTeamLevel() {
    const container = $('team-level-content');
    try {
        const summary = await api('getWeeklySummary', { week: STATE.week });
        const teams = summary.teams || {};
        const myTeam = STATE.data?.profile?.team;
        if (summary.lastUpdated) STATE.lastUpdated = summary.lastUpdated;
        const sortedTeams = Object.entries(teams).sort((a, b) => (b[1].teamXP || 0) - (a[1].teamXP || 0));
        container.innerHTML = renderGuide('team-level') + `
            <div class="team-level-header"><h2>Team Levels</h2><span class="week-badge">${STATE.week}</span></div>${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}
            <div class="team-level-grid">${sortedTeams.map(([t, info], index) => { 
                    const isMyTeam = t === myTeam; 
                    const tColor = teamColor(t);
                    const missions = (info.trackGoalPassed ? 1 : 0) + (info.albumGoalPassed ? 1 : 0) + (info.album2xPassed ? 1 : 0); 
                    return `<div class="team-level-card ${isMyTeam ? 'my-team' : ''}" style="border-color:${tColor}">${isMyTeam ? '<div class="my-team-badge">Your Team</div>' : ''}${teamPfp(t) ? `<img src="${teamPfp(t)}" class="team-level-pfp" style="border-color:${tColor}">` : ''}<div class="team-level-name" style="color:${tColor}">${t}</div><div class="team-level-num">${info.level || 1}</div><div class="team-level-label">LEVEL</div><div class="team-level-xp">${fmt(info.teamXP)} XP</div><div class="team-level-missions"><div class="mission-check" title="Track Goals">${info.trackGoalPassed ? '🎵✅' : '🎵❌'}</div><div class="mission-check" title="Album Goals">${info.albumGoalPassed ? '💿✅' : '💿❌'}</div><div class="mission-check" title="Album 2X">${info.album2xPassed ? '✨✅' : '✨❌'}</div></div><div class="team-level-status ${missions === 3 ? 'complete' : ''}">${missions}/3 missions</div></div>`; 
                }).join('')}</div>
        `;
    } catch (e) { container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load team levels</p></div></div>'; }
}

async function renderAnnouncements() {
    const container = $('announcements-content');
    try {
        const data = await api('getAnnouncements', { week: STATE.week });
        const list = data.announcements || [];
        container.innerHTML = list.length ? list.map(a => `<div class="card announcement ${a.priority === 'high' ? 'urgent' : ''}"><div class="card-body"><div class="announcement-header"><span class="announcement-date">${a.created ? new Date(a.created).toLocaleDateString() : ''}</span>${a.priority === 'high' ? '<span class="urgent-badge">⚠️ IMPORTANT</span>' : ''}</div><h3>${sanitize(a.title)}</h3><p>${sanitize(a.message)}</p></div></div>`).join('') : `<div class="card"><div class="card-body" style="text-align:center;padding:40px;"><div style="font-size:48px;margin-bottom:16px;">📢</div><p style="color:var(--text-dim);">No announcements at this time</p></div></div>`;
    } catch (e) { container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load announcements</p></div></div>'; }
}

async function renderSecretMissions() {
    const container = $('secret-missions-content');
    if (!container) return;
    const myTeam = STATE.data?.profile?.team;
    container.innerHTML = '<div class="loading-skeleton"><div class="skeleton-card"></div><div class="skeleton-card"></div></div>';
    try {
        const [missionsData, statsData] = await Promise.all([api('getTeamSecretMissions', { team: myTeam, agentNo: STATE.agentNo, week: STATE.week }).catch(() => ({ active: [], completed: [], myAssigned: [] })), api('getTeamSecretStats', { week: STATE.week }).catch(() => ({ teams: {} }))]);
        const activeMissions = missionsData.active || [];
        const completedMissions = missionsData.completed || [];
        const myAssigned = missionsData.myAssigned || [];
        const stats = statsData.teams || {};
        const myStats = stats[myTeam] || {};
        
        container.innerHTML = renderGuide('secret-missions') + `
            <div class="card secret-header-card" style="border-color:${teamColor(myTeam)}"><div class="card-body"><div class="secret-header">${teamPfp(myTeam) ? `<img src="${teamPfp(myTeam)}" class="secret-team-pfp" style="border-color:${teamColor(myTeam)}">` : ''}<div class="secret-header-info"><div class="secret-team-name" style="color:${teamColor(myTeam)}">Team ${myTeam}</div><div class="secret-label">SECRET MISSION BONUS</div></div><div class="secret-xp-display"><div class="secret-xp-value">+${myStats.secretXP || 0}</div><div class="secret-xp-max">/ ${CONFIG.SECRET_MISSIONS.maxTeamBonus} max XP</div></div></div><div class="secret-stats-row"><div class="secret-stat"><span class="stat-value">${myStats.completed || 0}</span><span class="stat-label">Completed</span></div><div class="secret-stat"><span class="stat-value">${activeMissions.length}</span><span class="stat-label">Active</span></div><div class="secret-stat"><span class="stat-value">${CONFIG.SECRET_MISSIONS.maxMissionsPerTeam}</span><span class="stat-label">Max/Week</span></div></div></div></div>
            ${myAssigned.length ? `<div class="card urgent-card"><div class="card-header"><h3>🎯 Your Assigned Missions</h3><span class="urgent-badge">Action Required</span></div><div class="card-body">${myAssigned.map(m => renderSecretMissionCard(m, myTeam, true)).join('')}</div></div>` : ''}
            <div class="card"><div class="card-header"><h3>🔒 Active Team Missions</h3></div><div class="card-body">${activeMissions.length ? activeMissions.map(m => renderSecretMissionCard(m, myTeam, false)).join('') : `<div class="empty-missions"><div class="empty-icon">📭</div><p>No active secret missions</p></div>`}</div></div>
            <div class="card"><div class="card-header"><h3>📊 Team Intelligence Report</h3></div><div class="card-body"><div class="intel-grid">${Object.keys(CONFIG.TEAMS).map(t => { const tStats = stats[t] || {}; const isMyTeam = t === myTeam; return `<div class="intel-card ${isMyTeam ? 'my-team' : ''}" style="border-color:${teamColor(t)}">${teamPfp(t) ? `<img src="${teamPfp(t)}" class="intel-pfp">` : ''}<div class="intel-name" style="color:${teamColor(t)}">${t}</div><div class="intel-xp">+${tStats.secretXP || 0} XP</div><div class="intel-missions">${tStats.completed || 0}/${CONFIG.SECRET_MISSIONS.maxMissionsPerTeam} missions</div></div>`; }).join('')}</div></div></div>
            ${completedMissions.length ? `<div class="card"><div class="card-header"><h3>✅ Completed Missions</h3></div><div class="card-body">${completedMissions.map(m => `<div class="completed-mission"><span class="completed-icon">${CONFIG.MISSION_TYPES[m.type]?.icon || '✅'}</span><div class="completed-info"><div class="completed-title">${sanitize(m.title)}</div></div><span class="completed-xp">+${m.xpReward || CONFIG.SECRET_MISSIONS.xpPerMission} XP</span></div>`).join('')}</div></div>` : ''}
        `;
    } catch (e) { container.innerHTML = '<div class="card"><div class="card-body error-state"><p>Failed to load secret missions.</p></div></div>'; }
}

function renderSecretMissionCard(mission, myTeam, isAssigned) {
    const missionInfo = CONFIG.MISSION_TYPES[mission.type] || { icon: '🔒', name: 'Mission' };
    const myProgress = mission.progress?.[myTeam] || 0;
    const goalTarget = mission.goalTarget || 100;
    const pct = Math.min((myProgress / goalTarget) * 100, 100);
    const isComplete = mission.completedTeams?.includes(myTeam);
    return `
        <div class="secret-mission-card ${isAssigned ? 'assigned' : ''} ${isComplete ? 'complete' : ''}">
            <div class="smc-stamp">${isAssigned ? '🎯 YOUR MISSION' : '🔒 CLASSIFIED'}</div>
            <div class="smc-header"><span class="smc-icon">${missionInfo.icon}</span><div class="smc-title-section"><div class="smc-type">${missionInfo.name}</div><div class="smc-title">${sanitize(mission.title)}</div></div></div>
            ${mission.assignedAgents?.length ? `<div class="smc-agents"><div class="agents-label">Assigned Agents:</div><div class="agents-list">${mission.assignedAgents.map(a => `<span class="agent-tag ${String(a.agentNo) === String(STATE.agentNo) ? 'is-me' : ''}" style="color:${teamColor(a.team)}">${String(a.agentNo) === String(STATE.agentNo) ? '👤 YOU' : `#${a.agentNo}`}</span>`).join('')}</div></div>` : ''}
            <div class="smc-briefing">${sanitize(mission.briefing || '')}</div>
            ${mission.targetTrack ? `<div class="smc-target"><span class="target-label">TARGET:</span><span class="target-track">${sanitize(mission.targetTrack)}</span><span class="target-goal">${goalTarget} streams</span></div>` : ''}
            <div class="smc-progress"><div class="progress-header"><span>Team Progress</span><span>${myProgress}/${goalTarget}</span></div><div class="progress-bar"><div class="progress-fill ${isComplete ? 'complete' : ''}" style="width:${pct}%;background:${teamColor(myTeam)}"></div></div>${isComplete ? `<div class="progress-complete">✅ Mission Complete! +${mission.xpReward || 5} XP</div>` : `<div class="progress-remaining">${goalTarget - myProgress} more streams needed</div>`}</div>
            <div class="smc-footer"><span class="smc-reward">⭐ +${mission.xpReward || 5} XP</span></div>
        </div>
    `;
}

async function renderComparison() {
    const container = $('comparison-content');
    if (!container) return;
    const weekToShow = STATE.week;
    try {
        const [comparison, goals, summary] = await Promise.all([api('getTeamComparison', { week: weekToShow }), api('getGoalsProgress', { week: weekToShow }), api('getWeeklySummary', { week: weekToShow })]);
        if (comparison.lastUpdated) STATE.lastUpdated = comparison.lastUpdated;
        const teams = (comparison.comparison || []).sort((a, b) => (b.teamXP || 0) - (a.teamXP || 0));
        const maxXP = teams[0]?.teamXP || 1;
        const trackGoals = goals.trackGoals || {};
        const albumGoals = goals.albumGoals || {};
        const teamNames = Object.keys(CONFIG.TEAMS);
        
        container.innerHTML = `${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}<div class="card"><div class="card-header"><h3>⚔️ Battle Standings (${STATE.week})</h3></div><div class="card-body">${teams.map((t, i) => `<div class="comparison-item"><span class="comparison-rank">${i+1}</span><span class="comparison-name" style="color:${teamColor(t.team)}">${t.team}</span><div class="comparison-bar-container"><div class="progress-bar"><div class="progress-fill" style="width:${(t.teamXP/maxXP)*100}%;background:${teamColor(t.team)}"></div></div></div><span class="comparison-xp">${fmt(t.teamXP)}</span></div>`).join('')}</div></div>`;
        
        if (Object.keys(trackGoals).length) {
            container.innerHTML += `<div class="card"><div class="card-header"><h3>🎵 Track Goals</h3></div><div class="card-body comparison-goals-section">${Object.entries(trackGoals).map(([trackName, info]) => {
                const goal = info.goal || 0;
                return `<div class="goal-comparison-block"><div class="goal-comparison-header"><span class="goal-track-name">${sanitize(trackName)}</span><span class="goal-target">Goal: ${fmt(goal)}</span></div><div class="goal-team-progress">${teamNames.map(teamName => {
                    const tp = info.teams?.[teamName] || {};
                    const current = tp.current || 0;
                    const pct = goal > 0 ? Math.min((current/goal)*100, 100) : 0;
                    const done = current >= goal;
                    return `<div class="team-progress-row ${done ? 'complete' : ''}"><span class="team-name-small" style="color:${teamColor(teamName)}">${teamName}</span><div class="progress-bar-small"><div class="progress-fill ${done ? 'complete' : ''}" style="width:${pct}%;background:${teamColor(teamName)}"></div></div><span class="progress-text">${fmt(current)}/${fmt(goal)}</span></div>`;
                }).join('')}</div></div>`;
            }).join('')}</div></div>`;
        }
        if (Object.keys(albumGoals).length) {
            container.innerHTML += `<div class="card"><div class="card-header"><h3>💿 Album Goals</h3></div><div class="card-body comparison-goals-section">${Object.entries(albumGoals).map(([albumName, info]) => {
                const goal = info.goal || 0;
                return `<div class="goal-comparison-block"><div class="goal-comparison-header"><span class="goal-track-name">${sanitize(albumName)}</span><span class="goal-target">Goal: ${fmt(goal)}</span></div><div class="goal-team-progress">${teamNames.map(teamName => {
                    const ap = info.teams?.[teamName] || {};
                    const current = ap.current || 0;
                    const pct = goal > 0 ? Math.min((current/goal)*100, 100) : 0;
                    const done = current >= goal;
                    return `<div class="team-progress-row ${done ? 'complete' : ''}"><span class="team-name-small" style="color:${teamColor(teamName)}">${teamName}</span><div class="progress-bar-small"><div class="progress-fill ${done ? 'complete' : ''}" style="width:${pct}%;background:${teamColor(teamName)}"></div></div><span class="progress-text">${fmt(current)}/${fmt(goal)}</span></div>`;
                }).join('')}</div></div>`;
            }).join('')}</div></div>`;
        }
    } catch (e) { container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load comparison</p></div></div>'; }
}

// ==================== NOTIFICATION SYSTEM ====================
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
        const lastWeekCheck = localStorage.getItem('spy_lastWeekCheck');
        const isWeekComplete = isWeekCompleted(STATE.week);
        if (isWeekComplete && lastWeekCheck !== STATE.week) {
             newNotifications.push({ type: 'result', msg: `Week Results are Finalized`, page: 'summary', dotId: 'dot-summary' });
             localStorage.setItem('spy_lastWeekCheck', STATE.week);
        }
        const missionCount = STATE.data?.secretMissionCount || 0;
        const savedMissionCount = parseInt(localStorage.getItem('spy_lastMissionCount')) || 0;
        if (missionCount > savedMissionCount) {
             newNotifications.push({ type: 'mission', msg: 'New Secret Mission Assigned', page: 'secret-missions', dotId: 'dot-mission' });
             localStorage.setItem('spy_lastMissionCount', missionCount);
        }
        const latestAnnounceID = STATE.data?.latestAnnouncementID || 0; 
        const savedAnnounceID = parseInt(localStorage.getItem('spy_lastAnnounceID')) || 0;
        if (latestAnnounceID > savedAnnounceID) {
            newNotifications.push({ type: 'announce', msg: 'New Priority Announcement', page: 'announcements', dotId: 'dot-announce' });
            localStorage.setItem('spy_lastAnnounceID', latestAnnounceID);
        }
        if (newNotifications.length > 0) { this.showIntelModal(newNotifications); this.updateSidebarDots(newNotifications); }
    },

    showIntelModal: function(notifs) {
        document.querySelector('.intel-modal')?.remove();
        const html = `
            <div class="intel-modal"><div class="intel-header"><span>📡 INTELLIGENCE UPDATE</span><button onclick="this.closest('.intel-modal').classList.remove('show')" style="background:none;border:none;color:#fff;">✕</button></div>
                ${notifs.map(n => `<div class="intel-item" onclick="loadPage('${n.page}'); this.closest('.intel-modal').classList.remove('show');"><span class="intel-icon">${this.getIcon(n.type)}</span><span>${n.msg}</span></div>`).join('')}
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
        setTimeout(() => document.querySelector('.intel-modal').classList.add('show'), 500);
        setTimeout(() => document.querySelector('.intel-modal')?.classList.remove('show'), 8000);
    },

    updateSidebarDots: function(notifs) {
        notifs.forEach(n => { const dot = document.getElementById(n.dotId); if (dot) dot.classList.add('active'); });
    },

    getIcon: function(type) {
        switch(type) { case 'badge': return '🎖️'; case 'mission': return '🕵️'; case 'result': return '🏆'; case 'announce': return '📢'; default: return 'ℹ️'; }
    }
};

const originalLoadPage = window.loadPage;
window.loadPage = async function(page) {
    const map = { 'drawer': 'dot-drawer', 'secret-missions': 'dot-mission', 'summary': 'dot-summary', 'announcements': 'dot-announce' };
    if (map[page]) document.getElementById(map[page])?.classList.remove('active');
    if(originalLoadPage) await originalLoadPage(page);
};

// ==================== EXPORTS & INIT ====================
document.addEventListener('DOMContentLoaded', initApp);

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
```
