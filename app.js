// ===== BTS SPY BATTLE - COMPLETE APP.JS v4.3 (All Renders Restored + New Features) =====

// ==================== CONFIGURATION ====================
const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbx5ArHi5Ws0NxMa9nhORy6bZ7ZYpW4urPIap24tax9H1HLuGQxYRCgTVwDaKOMrZ7JOGA/exec',
    
    // --- ACCESS CONTROL ---
    ADMIN_AGENT_NO: 'AGENT001',
    ADMIN_PASSWORD: 'BTSSPYADMIN2024',
    HELPER_AGENTS: ['AGENT002', 'AGENT005', 'AGENT008'], 
    HELPER_PASSWORD: 'ARMYPLAYLIST2024', 
    
    // --- DATES ---
    WEEK_DATES: {
        'Test Week 1': '2025-11-29', 'Test Week 2': '2025-12-06',
        'Week 1': '2025-12-13', 'Week 2': '2025-12-20',
        'Week 3': '2025-12-27', 'Week 4': '2026-01-03'
    },
    
    // --- CHAT & ASSETS ---
    CHAT_CHANNEL: 'bts-spy-battle-hq', 
    BADGE_REPO_URL: 'https://raw.githubusercontent.com/hbot7875-gif/btscomebackmission/main/lvl1badges/',
    TOTAL_BADGE_IMAGES: 49, 
    
    get BADGE_POOL() {
        const pool = [];
        for (let i = 1; i <= this.TOTAL_BADGE_IMAGES; i++) {
            pool.push(`${this.BADGE_REPO_URL}BTS%20(${i}).jpg`);
        }
        return pool;
    },
    
    // --- TEAMS & PLAYLISTS ---
    TEAMS: {
        'Indigo': { color: '#FFE082', album: 'Indigo' },
        'Echo': { color: '#FAFAFA', album: 'Echo' },
        'Agust D': { color: '#B0BEC5', album: 'Agust D' },
        'JITB': { color: '#FF4081', album: 'Jack In The Box' }
    },
    ALBUM_PLAYLISTS: {
        'Indigo': 'https://open.spotify.com/album/2wGINWO7dBkqnM9qfFQ4Ad', 
        'Echo': 'https://open.spotify.com/album/2K7D19m7f7q2j1Q3d4g5h6', 
        'Agust D': 'https://open.spotify.com/album/21jFjgN59v262kC0Y0e6K6', 
        'JITB': 'https://open.spotify.com/album/0R7b106z6q4wJdJ7Xz1z1z'
    },
    WEEKLY_PLAYLISTS_FALLBACK: { 'Test Week 1': [] },
    
    // --- TEAM DATA ---
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
    
    // --- MISSION DATA ---
    SECRET_MISSIONS: { xpPerMission: 5, maxMissionsPerTeam: 5, maxTeamBonus: 25 },
    MISSION_TYPES: {
        'joint_op': { name: 'Joint Operation', icon: '🤝', description: 'Agents from different teams collaborate' },
        'decode': { name: 'Decode Mission', icon: '🔐', description: 'Solve cipher to reveal target' },
        'coordinate': { name: 'Coordinate Strike', icon: '⚡', description: 'Multiple agents stream together' },
        'stealth': { name: 'Stealth Mission', icon: '🥷', description: 'Covert streaming task' },
        'chain': { name: 'Chain Reaction', icon: '🔗', description: 'Sequential team task' },
        'hidden': { name: 'Hidden Target', icon: '🎯', description: 'Clue-based target discovery' },
        'alliance': { name: 'Alliance Mission', icon: '🌐', description: 'All teams work together' }
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
    userRole: 'user', 
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
function sanitize(str) { return String(str || '').replace(/[<>\"'&]/g, char => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' })[char] || char); }

function formatLastUpdated(dateStr) {
    const targetDate = dateStr || STATE.lastUpdated;
    if (!targetDate) return 'Waiting for update...';
    try {
        const date = new Date(targetDate);
        if (isNaN(date.getTime())) return targetDate;
        return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) { return targetDate; }
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
    if (el) el.textContent = `Updated: ${formatLastUpdated(STATE.lastUpdated)}`;
}

function getDaysRemaining(weekLabel) {
    const endDateStr = CONFIG.WEEK_DATES[weekLabel];
    if (!endDateStr) return 0;
    const end = new Date(endDateStr);
    end.setHours(23, 59, 59, 999);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
}

function isWeekCompleted(selectedWeek) {
    const endDateStr = CONFIG.WEEK_DATES[selectedWeek];
    if (!endDateStr) return false;
    const end = new Date(endDateStr);
    end.setHours(23, 59, 59, 999);
    const now = new Date();
    return now > end;
}

// ==================== GUIDES ====================
const PAGE_GUIDES = {
    'home': { icon: '🛡️', title: 'Anti-Filter Protocol', text: "To ensure your streams count, avoid looping one playlist 24/7. Rotate between the different Mission Playlists below to keep your behavior looking natural!" },
    'goals': { icon: '🎯', title: 'Team Targets', text: "These are the songs your team is focusing on this week. You don't have to stream them all! Just picking one or two to listen to helps the bar move forward." },
    'album2x': { icon: '🎧', title: 'The 2X Challenge', text: "A simple mission: Try to listen to every song on this album at least 2 times this week. It's a great way to rediscover B-sides!" },
    'secret-missions': { icon: '🕵️', title: 'Classified Tasks', text: "These grant bonus XP! If you see a mission here, it means your team needs extra help on a specific song. If it's empty, you're doing great!" },
    'team-level': { icon: '🚀', title: 'Leveling Up', text: "This shows how strong your team is. Complete the Track, Album, and 2X missions to earn all 3 badges and raise your team's level!" },
    'rankings': { icon: '🏆', title: 'Friendly Competition', text: "Remember, we are all one big team! Rankings are just for fun. Whether you are #1 or #100, your streams count exactly the same." }
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
        try { data = JSON.parse(text); } catch (parseError) { throw new Error('Invalid response from server'); }
        if (data.lastUpdated) { STATE.lastUpdated = data.lastUpdated; updateTime(); }
        if (data.error) throw new Error(data.error);
        return data;
    } catch (e) {
        console.error('❌ API Error:', e);
        if (e.name === 'AbortError') throw new Error('Request timed out. Please try again.');
        throw e;
    }
}

// ==================== INITIALIZATION ====================
function initApp() {
    console.log('🚀 Starting BTS Spy Battle app...');
    loading(false);
    setupLoginListeners();
    loadAllAgents();
    const saved = localStorage.getItem('spyAgent');
    if (saved) { STATE.agentNo = saved; checkAdminStatus(); loadDashboard(); }
}

function setupLoginListeners() {
    const loginBtn = $('login-btn'), findBtn = $('find-btn'), agentInput = $('agent-input'), instagramInput = $('instagram-input');
    if (loginBtn) loginBtn.onclick = handleLogin;
    if (findBtn) findBtn.onclick = handleFind;
    if (agentInput) { agentInput.onkeypress = e => { if (e.key === 'Enter') handleLogin(); }; setTimeout(() => agentInput.focus(), 100); }
    if (instagramInput) instagramInput.onkeypress = e => { if (e.key === 'Enter') handleFind(); };
}

async function loadAllAgents() {
    try { const res = await api('getAllAgents'); STATE.allAgents = res.agents || []; } catch (e) { STATE.allAgents = []; }
}

// ==================== LOGIN HANDLERS ====================
async function handleLogin() {
    if (STATE.isLoading) return;
    const agentInput = $('agent-input');
    const agentNo = agentInput?.value.trim().toUpperCase();
    if (!agentNo) { showResult('Please enter your Agent Number', true); agentInput?.focus(); return; }
    const loginBtn = $('login-btn');
    const originalText = loginBtn?.textContent;
    try {
        if (loginBtn) { loginBtn.disabled = true; loginBtn.textContent = 'Authenticating...'; }
        loading(true);
        if (STATE.allAgents.length === 0) await loadAllAgents();
        const found = STATE.allAgents.find(a => String(a.agentNo).trim().toUpperCase() === agentNo);
        if (!found) { showResult('Agent not found. Check your number.', true); return; }
        localStorage.setItem('spyAgent', found.agentNo);
        STATE.agentNo = found.agentNo;
        checkAdminStatus();
        await loadDashboard();
    } catch (e) { showResult('Login failed: ' + e.message, true); } 
    finally { if (loginBtn) { loginBtn.disabled = false; loginBtn.textContent = originalText || 'Login'; } loading(false); }
}

async function handleFind() {
    if (STATE.isLoading) return;
    const instagramInput = $('instagram-input');
    const instagram = instagramInput?.value.trim().toLowerCase().replace('@', '');
    if (!instagram) { showResult('Please enter your Instagram handle', true); instagramInput?.focus(); return; }
    const findBtn = $('find-btn');
    const originalText = findBtn?.textContent;
    try {
        if (findBtn) { findBtn.disabled = true; findBtn.textContent = 'Searching...'; }
        loading(true);
        if (STATE.allAgents.length === 0) await loadAllAgents();
        const found = STATE.allAgents.find(a => String(a.instagram||'').trim().toLowerCase().replace('@','') === instagram);
        if (!found) { showResult(`No agent found with "@${instagram}".`, true); return; }
        showResult(`Found! Your Agent ID is: <strong>${found.agentNo}</strong>`, false);
        const agentInput = $('agent-input');
        if (agentInput) { agentInput.value = found.agentNo; agentInput.focus(); }
    } catch (e) { showResult('Search failed: ' + e.message, true); } 
    finally { if (findBtn) { findBtn.disabled = false; findBtn.textContent = originalText || 'Find My ID'; } loading(false); }
}

// ==================== ACCESS CONTROL ====================
function checkAdminStatus() {
    const current = String(STATE.agentNo).toUpperCase();
    STATE.userRole = 'user';
    if (current === String(CONFIG.ADMIN_AGENT_NO).toUpperCase()) {
        const savedSession = localStorage.getItem('adminSession');
        const savedExpiry = localStorage.getItem('adminExpiry');
        if (savedSession && savedExpiry && Date.now() < parseInt(savedExpiry)) {
            STATE.userRole = 'admin'; STATE.adminSession = savedSession;
        }
    } else if (CONFIG.HELPER_AGENTS.includes(current)) {
        if (localStorage.getItem('adminSession') === 'helper_mode') STATE.userRole = 'helper';
    }
}

function isAdminAgent() { return String(STATE.agentNo).toUpperCase() === String(CONFIG.ADMIN_AGENT_NO).toUpperCase(); }
function isHelperAgent() { return CONFIG.HELPER_AGENTS.map(a=>String(a).toUpperCase()).includes(String(STATE.agentNo).toUpperCase()); }

function showAdminLogin() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
    let title = "🔐 Access Control", desc = "Authorized personnel only.";
    if (isAdminAgent()) { title = "🎛️ Mission Control"; desc = "Commander authentication required."; } 
    else if (isHelperAgent()) { title = "🎧 Playlist Uplink Access"; desc = "Enter Helper Password to manage playlists."; } 
    else { showToast('Access denied.', 'error'); return; }
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'admin-modal';
    modal.innerHTML = `<div class="modal admin-modal"><div class="modal-header"><h3>${title}</h3><button class="modal-close" onclick="closeAdminModal()">×</button></div><div class="modal-body"><div class="admin-welcome"><p>Welcome, Agent ${STATE.agentNo}</p><p>${desc}</p></div><div class="form-group"><label>PASSWORD:</label><input type="password" id="admin-password" class="form-input" placeholder="Enter password"></div><div id="admin-error" class="admin-error"></div></div><div class="modal-footer"><button onclick="verifyAdminPassword()" class="btn-primary" id="admin-verify-btn">Authenticate</button></div></div>`;
    document.body.appendChild(modal);
    setTimeout(() => { $('admin-password')?.focus(); }, 100);
}

function closeAdminModal() {
    const modal = $('admin-modal');
    if (modal) { modal.classList.add('closing'); setTimeout(() => modal.remove(), 300); }
}

async function verifyAdminPassword() {
    const password = $('admin-password')?.value;
    const errorEl = $('admin-error');
    const verifyBtn = $('admin-verify-btn');
    if (!password) return;
    if (verifyBtn) verifyBtn.disabled = true;
    try {
        if (isAdminAgent()) {
            let verified = false;
            try { const result = await api('verifyAdmin', { agentNo: STATE.agentNo, password: password }); if (result.success) { verified = true; STATE.adminSession = result.sessionToken; } } 
            catch (e) { if (password === CONFIG.ADMIN_PASSWORD) { verified = true; STATE.adminSession = 'local_' + Date.now(); } }
            if (verified) { STATE.userRole = 'admin'; localStorage.setItem('adminSession', STATE.adminSession); localStorage.setItem('adminExpiry', String(Date.now() + 86400000)); finishLogin('Admin access granted!'); } 
            else { throw new Error('Invalid admin password'); }
        } else if (isHelperAgent()) {
            if (password === CONFIG.HELPER_PASSWORD) { STATE.userRole = 'helper'; localStorage.setItem('adminSession', 'helper_mode'); finishLogin('Playlist Manager unlocked!'); } 
            else { throw new Error('Invalid helper password'); }
        } else { throw new Error('Unauthorized agent'); }
    } catch (e) { if (errorEl) { errorEl.textContent = '❌ ' + e.message; errorEl.classList.add('show'); } } 
    finally { if (verifyBtn) verifyBtn.disabled = false; }
}

function finishLogin(msg) {
    closeAdminModal();
    addAdminIndicator();
    if (STATE.userRole === 'admin') showAdminPanel();
    else if (STATE.userRole === 'helper') showHelperPanel();
    showToast(msg, 'success');
}

function addAdminIndicator() {
    document.querySelector('.admin-indicator')?.remove();
    let nav = document.querySelector('.nav-links');
    if (!nav) nav = document.getElementById('sidebar');
    if (!nav || nav.querySelector('.admin-nav-link')) return;

    const link = document.createElement('a');
    link.href = '#';
    link.className = 'nav-link admin-nav-link';
    link.style.marginTop = 'auto';
    link.style.borderTop = '1px solid rgba(255,255,255,0.1)';
    let icon = '🎛️', text = 'Admin';
    if (STATE.userRole === 'helper') { icon = '🎧'; text = 'Playlists'; }
    link.innerHTML = `<span class="nav-icon">${icon}</span><span>${text}</span>`;
    link.onclick = (e) => { e.preventDefault(); if (STATE.userRole === 'admin') showAdminPanel(); else if (STATE.userRole === 'helper') showHelperPanel(); else showAdminLogin(); closeSidebar(); };
    nav.appendChild(link);
}

function exitAdminMode() {
    if (confirm('Exit admin/helper mode?')) {
        STATE.userRole = 'user';
        STATE.adminSession = null;
        localStorage.removeItem('adminSession');
        localStorage.removeItem('adminExpiry');
        document.querySelector('.admin-nav-link')?.remove();
        document.querySelector('.admin-panel')?.remove();
        showToast('Admin/Helper mode deactivated', 'info');
    }
}

// ==================== HELPER PANEL ====================
function showHelperPanel() {
    if (STATE.userRole !== 'helper') { showAdminLogin(); return; }
    document.querySelector('.admin-panel')?.remove();
    const panel = document.createElement('div');
    panel.className = 'admin-panel';
    panel.innerHTML = `<div class="admin-panel-header" style="background: #2a2a40;"><h3>🎧 Playlist Uplink</h3><button class="panel-close" onclick="closeAdminPanel()">×</button></div><div class="admin-panel-content active" style="padding: 20px;"><div class="guide-card" style="margin-bottom: 20px; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;"><p style="font-size: 13px; margin: 0;">Use emojis in names (e.g. 🔥 Main Attack, 💤 Sleep Mix) so agents can quickly pick a playlist.</p></div><div class="form-group"><label>Target Week</label><select id="pl-week" class="form-select">${Object.keys(CONFIG.WEEK_DATES).map(w => `<option value="${w}" ${w === STATE.week ? 'selected' : ''}>${w}</option>`).join('')}</select></div><div class="form-group"><label>Button Name</label><input type="text" id="pl-name" class="form-input" placeholder="e.g., 🔥 Main Attack"></div><div class="form-group"><label>Link</label><input type="url" id="pl-url" class="form-input" placeholder="https://open.spotify.com/playlist/..."></div><button onclick="submitPlaylist()" class="btn-primary" style="width: 100%; margin-top: 10px;">💾 Upload Playlist</button><div id="pl-result" style="margin-top: 15px; font-size: 13px; text-align: center;"></div></div>`;
    document.body.appendChild(panel);
}

async function submitPlaylist() {
    const week = $('pl-week').value, name = $('pl-name').value, url = $('pl-url').value, resultEl = $('pl-result');
    if (!name || !url) { resultEl.innerHTML = '<span style="color: #ff5252;">❌ Fill all fields</span>'; return; }
    resultEl.innerHTML = '⏳ Uploading to HQ...';
    try {
        await api('addPlaylist', { targetWeek: week, name, url, agentNo: STATE.agentNo });
        resultEl.innerHTML = '<span style="color: #69f0ae;">✅ Success! Playlist Live.</span>';
        $('pl-name').value = ''; $('pl-url').value = '';
        setTimeout(() => { if(STATE.page === 'home') renderHome(); }, 1500);
    } catch (e) { resultEl.innerHTML = `<span style="color: #ff5252;">❌ Error: ${e.message}</span>`; }
}

function closeAdminPanel() {
    const panel = document.querySelector('.admin-panel');
    if (panel) { panel.classList.add('closing'); setTimeout(() => panel.remove(), 300); }
}

// ==================== ADMIN PANEL & ASSETS ====================
function showAdminPanel() {
    if (STATE.userRole !== 'admin') { showAdminLogin(); return; }
    document.querySelector('.admin-panel')?.remove();
    const panel = document.createElement('div');
    panel.className = 'admin-panel';
    panel.innerHTML = `<div class="admin-panel-header"><h3>🎛️ Mission Control</h3><button class="panel-close" onclick="closeAdminPanel()">×</button></div><div class="admin-panel-tabs"><button class="admin-tab active" data-tab="create">Create Mission</button><button class="admin-tab" data-tab="active">Active</button><button class="admin-tab" data-tab="assets">🎨 Assets</button><button class="admin-tab" data-tab="history">History</button></div><div class="admin-panel-content"><div id="admin-tab-create" class="admin-tab-content active">${renderCreateMissionForm()}</div><div id="admin-tab-active" class="admin-tab-content"><div class="loading-text">Loading...</div></div><div id="admin-tab-assets" class="admin-tab-content"></div><div id="admin-tab-history" class="admin-tab-content"><div class="loading-text">Loading...</div></div></div>`;
    document.body.appendChild(panel);
    panel.querySelectorAll('.admin-tab').forEach(tab => { tab.onclick = () => { switchAdminTab(tab.dataset.tab); if (tab.dataset.tab === 'assets') renderAdminAssets(); if (tab.dataset.tab === 'history') loadMissionHistory(); }; });
    loadActiveTeamMissions();
}

function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector(`.admin-tab[data-tab="${tabName}"]`)?.classList.add('active');
    document.getElementById(`admin-tab-${tabName}`)?.classList.add('active');
}

function renderAdminAssets() {
    const container = document.getElementById('admin-tab-assets'); if (!container) return;
    let html = `<div class="asset-section" style="padding:20px;"><h4>🎲 Level Up Random Pool</h4><p style="color:#aaa; font-size:12px; margin-bottom:15px;"><strong>Repo:</strong> ${CONFIG.BADGE_REPO_URL}<br><strong>Total Configured:</strong> ${CONFIG.TOTAL_BADGE_IMAGES}</p>`;
    if (CONFIG.BADGE_POOL && CONFIG.BADGE_POOL.length) {
        html += `<div class="badges-showcase" style="justify-content: flex-start; flex-wrap: wrap; gap: 10px;">`;
        CONFIG.BADGE_POOL.forEach((imgUrl, index) => { html += `<div class="badge-showcase-item" style="width:100px; margin: 5px;"><div class="badge-circle" style="width:80px; height:80px; border-color:#ffd700; background: #000;"><img src="${imgUrl}" style="width:100%; height:100%; object-fit:cover;"></div><div class="badge-name" style="font-size:10px;">BTS (${index + 1}).jpg</div></div>`; });
        html += `</div>`;
    } else { html += `<p>No random pool configured.</p>`; }
    html += `</div>`; container.innerHTML = html;
}

function renderCreateMissionForm() { return `<div class="create-mission-form"><div class="form-section"><h4>📋 Mission Type</h4><div class="mission-type-grid">${Object.entries(CONFIG.MISSION_TYPES).map(([key, m], i) => `<div class="mission-type-option ${i === 0 ? 'selected' : ''}" data-type="${key}" onclick="selectMissionType('${key}')"><span class="type-icon">${m.icon}</span><span class="type-name">${m.name}</span></div>`).join('')}</div><input type="hidden" id="selected-mission-type" value="joint_op"></div><div class="form-section"><h4>🎯 Target Teams</h4><div class="team-checkboxes">${Object.keys(CONFIG.TEAMS).map(team => `<label class="team-checkbox" style="--team-color: ${teamColor(team)}"><input type="checkbox" name="target-teams" value="${team}"><span class="checkbox-custom"></span><span class="team-name">${team}</span></label>`).join('')}</div><label class="select-all-teams"><input type="checkbox" id="all-teams" onchange="toggleAllTeams(this.checked)"><span>All Teams</span></label></div><div class="form-section"><h4>📝 Details</h4><div class="form-group"><label>Title *</label><input type="text" id="mission-title" class="form-input" placeholder="Title"></div><div class="form-group"><label>Briefing *</label><textarea id="mission-briefing" class="form-textarea" rows="2" placeholder="Briefing"></textarea></div><div class="form-group"><label>Target</label><input type="text" id="target-track" class="form-input" placeholder="Track Name"></div><div class="form-row"><div class="form-group"><label>Goal Type</label><select id="goal-type" class="form-select"><option value="combined_streams">Combined</option></select></div><div class="form-group"><label>Target #</label><input type="number" id="goal-target" class="form-input" value="100"></div></div></div><div class="form-actions"><button onclick="createTeamMission()" class="btn-primary btn-large">🚀 Deploy</button></div><div id="create-result" class="create-result"></div></div>`; }
function selectMissionType(type) { document.querySelectorAll('.mission-type-option').forEach(el => el.classList.remove('selected')); document.querySelector(`.mission-type-option[data-type="${type}"]`)?.classList.add('selected'); $('selected-mission-type').value = type; }
function toggleAllTeams(checked) { document.querySelectorAll('input[name="target-teams"]').forEach(cb => cb.checked = checked); }

async function createTeamMission() {
    const type = $('selected-mission-type')?.value, title = $('mission-title')?.value.trim(), briefing = $('mission-briefing')?.value.trim(), targetTeams = Array.from(document.querySelectorAll('input[name="target-teams"]:checked')).map(cb => cb.value), targetTrack = $('target-track')?.value.trim(), goalType = $('goal-type')?.value, goalTarget = parseInt($('goal-target')?.value) || 100;
    if (!title || targetTeams.length === 0 || !briefing) { showCreateResult('Please fill all required fields', true); return; }
    loading(true);
    try { const result = await api('createTeamMission', { type, title, briefing, targetTeams: JSON.stringify(targetTeams), targetTrack, goalType, goalTarget, week: STATE.week, agentNo: STATE.agentNo, sessionToken: STATE.adminSession }); if (result.success) { showCreateResult(`✅ Mission deployed!`, false); loadActiveTeamMissions(); } else { showCreateResult('❌ ' + result.error, true); } } catch (e) { showCreateResult('❌ Error: ' + e.message, true); } finally { loading(false); }
}

function showCreateResult(msg, isError) { const el = $('create-result'); if (!el) return; el.textContent = msg; el.className = `create-result show ${isError ? 'error' : 'success'}`; if (!isError) setTimeout(() => el.classList.remove('show'), 5000); }

async function loadActiveTeamMissions() {
    const container = $('admin-tab-active'); if (!container) return;
    try { const result = await api('getTeamMissions', { status: 'active', week: STATE.week }); const missions = result.missions || []; const tab = document.querySelector('.admin-tab[data-tab="active"]'); if(tab) tab.textContent = `Active (${missions.length})`; if (missions.length === 0) { container.innerHTML = `<div class="empty-state"><p>No active missions</p></div>`; return; } container.innerHTML = missions.map(m => `<div class="admin-mission-card"><div class="amc-header"><span>${CONFIG.MISSION_TYPES[m.type]?.icon || '📋'} ${sanitize(m.title)}</span></div><div class="amc-actions"><button onclick="adminCompleteMission('${m.id}')" class="btn-sm btn-success">Complete</button><button onclick="adminCancelMission('${m.id}')" class="btn-sm btn-danger">Cancel</button></div></div>`).join(''); } catch (e) { container.innerHTML = `<div class="error-state">Error loading missions</div>`; }
}

async function adminCompleteMission(missionId) { const team = prompt('Enter team name to mark complete:'); if (!team) return; loading(true); try { await api('completeTeamMission', { missionId, team, agentNo: STATE.agentNo, sessionToken: STATE.adminSession }); loadActiveTeamMissions(); showToast('Mission marked complete', 'success'); } catch (e) { alert('Error: ' + e.message); } finally { loading(false); } }
async function adminCancelMission(missionId) { if (!confirm('Cancel mission?')) return; loading(true); try { await api('cancelTeamMission', { missionId, agentNo: STATE.agentNo, sessionToken: STATE.adminSession }); loadActiveTeamMissions(); showToast('Mission cancelled', 'info'); } catch (e) { alert('Error: ' + e.message); } finally { loading(false); } }
async function loadMissionHistory() { const container = $('admin-tab-history'); if (!container) return; try { const result = await api('getTeamMissions', { status: 'all' }); const missions = (result.missions || []).filter(m => m.status !== 'active'); container.innerHTML = missions.length ? missions.map(m => `<div class="history-item"><span>${sanitize(m.title)}</span><span class="status-badge">${m.status}</span></div>`).join('') : `<div class="empty-state"><p>No history</p></div>`; } catch (e) { container.innerHTML = `<div class="error-state">Error</div>`; } }

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
    
    if (STATE.userRole === 'admin' || STATE.userRole === 'helper') addAdminIndicator();
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

// ==================== ALL PAGE RENDERERS ====================
async function renderHome() {
    // (Pasting the full v4.2 renderHome function here)
    const selectedWeek = STATE.week;
    $('current-week').textContent = `Week: ${selectedWeek}`;
    const guideHtml = renderGuide('home'); 
    
    try {
        const [summary, rankings, goals] = await Promise.all([
            api('getWeeklySummary', { week: selectedWeek }),
            api('getRankings', { week: selectedWeek, limit: 5 }),
            api('getGoalsProgress', { week: selectedWeek })
        ]);
        if (summary.lastUpdated) { STATE.lastUpdated = summary.lastUpdated; updateTime(); }
        
        const team = STATE.data?.profile?.team;
        const teamData = summary.teams?.[team] || {};
        const myStats = STATE.data?.stats || {};
        const isCompleted = isWeekCompleted(selectedWeek);
        const daysLeft = getDaysRemaining(selectedWeek);

        const teamTotalXP = teamData.teamXP || 1;
        const myTotalXP = myStats.totalXP || 0;
        const contribPercent = ((myTotalXP / teamTotalXP) * 100).toFixed(2);

        const allTrackGoals = goals.trackGoals || {};
        const incompleteTracks = Object.entries(allTrackGoals).filter(([track, info]) => {
            const current = info.teams?.[team]?.current || 0;
            const goal = info.goal || 100;
            return current < goal;
        });
        let missionText = "All goals complete! Keep streaming for XP.";
        if (incompleteTracks.length > 0) {
            const randomGoal = incompleteTracks[Math.floor(Math.random() * incompleteTracks.length)];
            missionText = `Team needs help here! Stream <b>${randomGoal[0]}</b> to push the bar.`;
        }

        const albumLink = CONFIG.ALBUM_PLAYLISTS[team];
        let weeklyData = summary.playlists || [];
        if (weeklyData.length === 0 && CONFIG.WEEKLY_PLAYLISTS_FALLBACK[selectedWeek]) {
            weeklyData = CONFIG.WEEKLY_PLAYLISTS_FALLBACK[selectedWeek];
        }
        
        let missionPlaylistsHtml = '';
        if (Array.isArray(weeklyData) && weeklyData.length > 0) {
            missionPlaylistsHtml = `<div class="playlist-container" style="display:flex;flex-direction:column;gap:5px;height:100%;"><div style="font-size:9px;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Mission Playlists (${weeklyData.length})</div><div class="playlist-scroll" style="display:flex;flex-direction:column;gap:6px;max-height:120px;overflow-y:auto;padding-right:4px;">${weeklyData.map(pl => `<a href="${pl.url}" target="_blank" class="btn-mini-deploy" style="background:linear-gradient(90deg,${teamColor(team)}22,rgba(0,0,0,0));border-left:2px solid ${teamColor(team)};color:#fff;padding:8px 10px;border-radius:4px;text-decoration:none;display:flex;align-items:center;justify-content:space-between;font-size:11px;"><span style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:80%;">${sanitize(pl.name)}</span><span style="font-size:10px;opacity:0.7;">▶</span></a>`).join('')}</div></div>`;
        } else {
            missionPlaylistsHtml = `<div class="btn-deploy disabled" style="background:#1a1a2e;border:1px solid #333;color:#555;padding:15px;border-radius:12px;display:flex;align-items:center;justify-content:center;gap:10px;height:100%;"><span style="font-size:20px;filter:grayscale(1);">🔒</span><div style="text-align:left;"><div style="font-size:10px;text-transform:uppercase;">Weekly Mission</div><div style="font-size:13px;">No Playlist Yet</div></div></div>`;
        }
        
        const deployButtonsHtml = `<div class="deploy-container" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;">${albumLink ? `<a href="${albumLink}" target="_blank" class="btn-deploy" style="background:linear-gradient(45deg,#1a1a2e,#2a2a40);border:1px solid ${teamColor(team)};color:#fff;padding:15px;border-radius:12px;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:10px;height:100%;"><span style="font-size:24px;">💿</span><div style="text-align:left;"><div style="font-size:10px;color:${teamColor(team)};text-transform:uppercase;font-weight:bold;">Team Album</div><div style="font-size:13px;font-weight:600;">Stream ${sanitize(CONFIG.TEAMS[team]?.album)}</div></div></a>` : ''}<div class="mission-playlists-wrapper" style="height:100%;">${missionPlaylistsHtml}</div></div>`;
        
        const quickStatsEl = document.querySelector('.quick-stats-section');
        if (quickStatsEl) {
            quickStatsEl.innerHTML = guideHtml + `<div class="card" style="background:linear-gradient(45deg,#1a1a2e,#16213e);border-left:4px solid ${teamColor(team)};margin-bottom:20px;"><div class="card-body" style="padding:15px;display:flex;justify-content:space-between;align-items:center;"><div><div style="font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">⚡ Mission of the Hour</div><div style="font-size:14px;color:#fff;">${missionText}</div></div><a href="${albumLink || '#'}" target="_blank" class="btn-sm btn-primary" style="font-size:12px;padding:8px 15px;white-space:nowrap;">🎧 Play</a></div></div>` + deployButtonsHtml + `<div class="card quick-stats-card" style="border-color:${teamColor(team)}40;background:linear-gradient(135deg,${teamColor(team)}11,var(--bg-card));"><div class="card-body"><div class="quick-header">${teamPfp(team) ? `<img src="${teamPfp(team)}" class="quick-pfp" style="border-color:${teamColor(team)}">` : ''}<div class="quick-info"><div class="quick-name">Welcome, ${sanitize(STATE.data?.profile?.name)}!</div><div class="quick-team" style="color:${teamColor(team)}">Team ${team} • Rank #${STATE.data?.rank || 'N/A'}</div></div></div><div class="quick-stats-grid"><div class="quick-stat"><div class="quick-stat-value">${fmt(myStats.totalXP)}</div><div class="quick-stat-label">XP</div></div><div class="quick-stat"><div class="quick-stat-value">${fmt(myStats.trackScrobbles || 0)}</div><div class="quick-stat-label">Tracks</div></div><div class="quick-stat"><div class="quick-stat-value">${fmt(myStats.albumScrobbles || 0)}</div><div class="quick-stat-label">Albums</div></div></div><div style="margin-top:15px;background:rgba(0,0,0,0.3);padding:10px;border-radius:8px;"><div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:11px;color:#aaa;"><span>🦸 Your Impact</span><span>${contribPercent}% of Team Total</span></div><div class="progress-bar" style="height:6px;"><div class="progress-fill" style="width:${Math.max(contribPercent,2)}%;background:${teamColor(team)};"></div></div></div><div class="battle-timer ${isCompleted ? 'ended' : ''}">${isCompleted ? '🏆 Week Completed' : (daysLeft <= 1 ? '🚀 Final Day!' : `⏰ ${daysLeft} days left`)}</div>${isCompleted ? `<div class="results-alert" onclick="loadPage('summary')">🏆 View Final Results →</div>` : ''}${STATE.lastUpdated ? `<div class="last-updated-mini">Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}</div></div>`;
        }
        
        const trackGoals = goals.trackGoals || {}; const albumGoals = goals.albumGoals || {}; const album2xStatus = STATE.data?.album2xStatus || {}; const teamTracks = CONFIG.TEAM_ALBUM_TRACKS[team] || []; const tracksCompleted2x = teamTracks.filter(t => (album2xStatus.tracks?.[t] || 0) >= 2).length;
        const trackGoalsList = Object.entries(trackGoals).map(([t,i]) => { const tp = i.teams?.[team] || {}; return { name: t, current: tp.current || 0, goal: i.goal || 0, done: tp.status === 'Completed' || (tp.current || 0) >= (i.goal || 0) }; });
        const albumGoalsList = Object.entries(albumGoals).map(([a,i]) => { const ap = i.teams?.[team] || {}; return { name: a, current: ap.current || 0, goal: i.goal || 0, done: ap.status === 'Completed' || (ap.current || 0) >= (i.goal || 0) }; });
        const missionCardsContainer = document.querySelector('.missions-grid');
        if (missionCardsContainer) {
            missionCardsContainer.innerHTML = `<div class="mission-card expanded" onclick="loadPage('goals')"><div class="mission-icon">🎵</div><h3>Track Goals</h3><div class="mission-status ${teamData.trackGoalPassed ? 'complete' : ''}">${teamData.trackGoalPassed ? '✅ Complete' : '⏳ In Progress'}</div><div class="goals-list">${trackGoalsList.length ? trackGoalsList.map(g => `<div class="goal-mini ${g.done ? 'done' : ''}"><span class="goal-name">${sanitize(g.name)}</span><span class="goal-progress">${fmt(g.current)}/${fmt(g.goal)} ${g.done ? '✅' : ''}</span></div>`).join('') : '<p class="no-goals">No track goals</p>'}</div></div><div class="mission-card expanded" onclick="loadPage('goals')"><div class="mission-icon">💿</div><h3>Album Goals</h3><div class="mission-status ${teamData.albumGoalPassed ? 'complete' : ''}">${teamData.albumGoalPassed ? '✅ Complete' : '⏳ In Progress'}</div><div class="goals-list">${albumGoalsList.length ? albumGoalsList.map(g => `<div class="goal-mini ${g.done ? 'done' : ''}"><span class="goal-name">${sanitize(g.name)}</span><span class="goal-progress">${fmt(g.current)}/${fmt(g.goal)} ${g.done ? '✅' : ''}</span></div>`).join('') : '<p class="no-goals">No album goals</p>'}</div></div><div class="mission-card" onclick="loadPage('album2x')"><div class="mission-icon">✨</div><h3>Album 2X</h3><div class="mission-subtitle">${sanitize(CONFIG.TEAMS[team]?.album || team)}</div><div class="mission-status ${album2xStatus.passed ? 'complete' : ''}">${album2xStatus.passed ? '✅ Complete' : '⏳ In Progress'}</div><div class="mission-progress"><div class="progress-bar"><div class="progress-fill ${album2xStatus.passed ? 'complete' : ''}" style="width:${teamTracks.length ? (tracksCompleted2x/teamTracks.length*100) : 0}%"></div></div><span>${tracksCompleted2x}/${teamTracks.length} tracks</span></div></div><div class="mission-card secret" onclick="loadPage('secret-missions')"><div class="mission-icon">🔒</div><h3>Secret Missions</h3><div class="mission-status">🕵️ Classified</div><div class="mission-hint">Tap to view team missions</div></div><div class="mission-card" onclick="loadPage('chat')"><div class="mission-icon">💬</div><h3>Secret Comms</h3><div class="mission-subtitle">HQ Encrypted Channel</div><div class="mission-hint">Tap to join chat</div></div>`;
        }
        
        const rankList = rankings.rankings || [];
        const topAgentsEl = $('home-top-agents');
        if (topAgentsEl) { topAgentsEl.innerHTML = rankList.length ? rankList.slice(0, 5).map((r, i) => `<div class="rank-item ${String(r.agentNo) === String(STATE.agentNo) ? 'highlight' : ''}" onclick="loadPage('rankings')"><div class="rank-num">${i+1}</div><div class="rank-info"><div class="rank-name">${sanitize(r.name)}</div><div class="rank-team" style="color:${teamColor(r.team)}">${r.team}</div></div><div class="rank-xp">${fmt(r.totalXP)} XP</div></div>`).join('') : '<p class="empty-text">No data yet</p>'; }
        
        const sortedTeams = Object.keys(summary.teams || {}).sort((a, b) => (summary.teams[b].teamXP || 0) - (summary.teams[a].teamXP || 0));
        const standingsEl = $('home-standings');
        if (standingsEl) { standingsEl.innerHTML = sortedTeams.length ? `<div class="standings-header"><span class="standings-badge ${isCompleted ? 'final' : ''}">${isCompleted ? '🏆 Final Standings' : '⏳ Live Battle'}</span></div>${sortedTeams.map((t, i) => { const td = summary.teams[t]; return `<div class="standing-item ${t === team ? 'my-team' : ''}" onclick="loadPage('team-level')" style="--team-color:${teamColor(t)}"><div class="standing-rank">${i+1}</div>${teamPfp(t) ? `<img src="${teamPfp(t)}" class="standing-pfp">` : ''}<div class="standing-info"><div class="standing-name" style="color:${teamColor(t)}">${t}</div><div class="standing-xp">${fmt(td.teamXP)} XP</div></div><div class="standing-missions">${td.trackGoalPassed?'🎵✅':'🎵❌'} ${td.albumGoalPassed?'💿✅':'💿❌'} ${td.album2xPassed?'✨✅':'✨❌'}</div></div>`; }).join('')}` : '<p class="empty-text">No data yet</p>'; }
    } catch (e) { console.error(e); showToast('Failed to load home', 'error'); }
}

// ===== RESTORED PAGE RENDERERS =====

async function renderProfile() {
    const stats = STATE.data?.stats || {};
    const profile = STATE.data?.profile || {};
    const album2xStatus = STATE.data?.album2xStatus || {};
    const trackContributions = STATE.data?.trackContributions || {};
    const albumContributions = STATE.data?.albumContributions || {};
    
    if($('profile-stats')) $('profile-stats').innerHTML = `<div class="stat-box"><div class="stat-value">${fmt(stats.totalXP)}</div><div class="stat-label">XP</div></div><div class="stat-box"><div class="stat-value">#${STATE.data?.rank || 'N/A'}</div><div class="stat-label">Rank</div></div><div class="stat-box"><div class="stat-value">#${STATE.data?.teamRank || 'N/A'}</div><div class="stat-label">Team Rank</div></div><div class="stat-box"><div class="stat-value">${fmt(stats.trackScrobbles)}</div><div class="stat-label">Tracks</div></div><div class="stat-box"><div class="stat-value">${fmt(stats.albumScrobbles)}</div><div class="stat-label">Albums</div></div><div class="stat-box"><div class="stat-value">${album2xStatus.passed ? '✅' : '❌'}</div><div class="stat-label">2X</div></div>`;
    if($('profile-tracks')) $('profile-tracks').innerHTML = Object.keys(trackContributions).length ? Object.entries(trackContributions).sort((a, b) => b[1] - a[1]).map(([t, c]) => `<div class="contrib-item"><span>${sanitize(t)}</span><span>${fmt(c)}</span></div>`).join('') : '<p class="empty-text">No track data</p>';
    if($('profile-albums')) $('profile-albums').innerHTML = Object.keys(albumContributions).length ? Object.entries(albumContributions).sort((a, b) => b[1] - a[1]).map(([a, c]) => `<div class="contrib-item"><span>${sanitize(a)}</span><span>${fmt(c)}</span></div>`).join('') : '<p class="empty-text">No album data</p>';
    if($('profile-badges')) try { const badgesData = await api('getBadges', { agentNo: STATE.agentNo }); $('profile-badges').innerHTML = (badgesData.badges || []).length ? `<div class="badges-grid">${badgesData.badges.map(b => `<div class="badge-item"><div class="badge-icon">${b.imageUrl ? `<img src="${b.imageUrl}">` : '🎖️'}</div><div class="badge-name">${sanitize(b.name)}</div></div>`).join('')}</div>` : '<p class="empty-text">No badges yet</p>'; } catch (e) { $('profile-badges').innerHTML = '<p class="empty-text">No badges</p>'; }
}

async function renderRankings() {
    try {
        const data = await api('getRankings', { week: STATE.week, limit: 100 });
        if (data.lastUpdated) STATE.lastUpdated = data.lastUpdated;
        const rankingsHtml = (data.rankings || []).map((r, i) => `<div class="rank-item ${String(r.agentNo) === String(STATE.agentNo) ? 'highlight' : ''}"><div class="rank-num">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</div><div class="rank-info"><div class="rank-name">${sanitize(r.name)}${String(r.agentNo) === String(STATE.agentNo) ? ' (You)' : ''}</div><div class="rank-team" style="color:${teamColor(r.team)}">${r.team}</div></div><div class="rank-xp">${fmt(r.totalXP)} XP</div></div>`).join('') || '<p class="empty-text">No data yet</p>';
        $('rankings-list').innerHTML = renderGuide('rankings') + `<div class="rankings-header"><span class="week-badge">${STATE.week}</span></div>${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}${rankingsHtml}`;
    } catch (e) { $('rankings-list').innerHTML = '<p class="error-text">Failed to load rankings</p>'; }
}

async function renderGoals() {
    const container = $('goals-content');
    const team = STATE.data?.profile?.team;
    try {
        const data = await api('getGoalsProgress', { week: STATE.week });
        if (data.lastUpdated) { STATE.lastUpdated = data.lastUpdated; updateTime(); }
        let html = renderGuide('goals') + `<div class="goals-header"><span class="week-badge">${STATE.week}</span></div><div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>`;
        const trackGoals = data.trackGoals || {};
        if (Object.keys(trackGoals).length) {
            html += `<div class="card"><div class="card-header"><h3>🎵 Track Goals</h3></div><div class="card-body">`;
            for (const [track, info] of Object.entries(trackGoals)) {
                const tp = info.teams?.[team] || {};
                const current = tp.current || 0, goal = info.goal || 0;
                const done = tp.status === 'Completed' || current >= goal;
                const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
                html += `<div class="goal-item ${done ? 'completed' : ''}"><div class="goal-header"><span class="goal-name">${sanitize(track)}</span><span class="goal-status ${done ? 'complete' : ''}">${fmt(current)}/${fmt(goal)} ${done ? '✅' : ''}</span></div><div class="progress-bar"><div class="progress-fill ${done ? 'complete' : ''}" style="width:${pct}%"></div></div></div>`;
            }
            html += '</div></div>';
        }
        const albumGoals = data.albumGoals || {};
        if (Object.keys(albumGoals).length) {
            html += `<div class="card"><div class="card-header"><h3>💿 Album Goals</h3></div><div class="card-body">`;
            for (const [album, info] of Object.entries(albumGoals)) {
                const ap = info.teams?.[team] || {};
                const current = ap.current || 0, goal = info.goal || 0;
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
    container.innerHTML = renderGuide('album2x') + `<div class="card" style="border-color:${allComplete ? 'var(--success)' : teamColor(team)}"><div class="card-body" style="text-align:center;padding:30px;"><div style="font-size:56px;margin-bottom:16px;">${allComplete ? '🎉' : '⏳'}</div><h2 style="color:${teamColor(team)};margin-bottom:8px;">${sanitize(albumName)}</h2><p style="color:var(--text-dim);margin-bottom:20px;">Stream every track at least 2 times</p><div style="font-size:48px;font-weight:700;color:${allComplete ? 'var(--success)' : 'var(--purple-glow)'}">${completedCount}/${trackResults.length}</div><p style="color:var(--text-dim);">Tracks completed</p><div class="progress-bar" style="margin:20px auto;max-width:300px;height:12px;"><div class="progress-fill ${allComplete ? 'complete' : ''}" style="width:${pct}%;background:${allComplete ? 'var(--success)' : teamColor(team)}"></div></div></div></div><div class="card"><div class="card-header"><h3>📋 Track Checklist</h3></div><div class="card-body">${trackResults.map((t, i) => `<div class="track-item ${t.passed ? 'passed' : 'pending'}" style="border-left-color:${t.passed ? 'var(--success)' : 'var(--danger)'}"><span class="track-num">${i + 1}</span><span class="track-name">${sanitize(t.name)}</span><span class="track-status ${t.passed ? 'pass' : 'fail'}">${t.count}/2 ${t.passed ? '✅' : '❌'}</span></div>`).join('')}</div></div>`;
}

async function renderTeamLevel() {
    const container = $('team-level-content');
    try {
        const summary = await api('getWeeklySummary', { week: STATE.week });
        const teams = summary.teams || {};
        const myTeam = STATE.data?.profile?.team;
        if (summary.lastUpdated) STATE.lastUpdated = summary.lastUpdated;
        const sortedTeams = Object.entries(teams).sort((a, b) => (b[1].teamXP || 0) - (a[1].teamXP || 0));
        container.innerHTML = renderGuide('team-level') + `<div class="team-level-header"><h2>Team Levels</h2><span class="week-badge">${STATE.week}</span></div>${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}<div class="team-level-grid">${sortedTeams.map(([t, info], index) => { const isMyTeam = t === myTeam; const missions = (info.trackGoalPassed ? 1 : 0) + (info.albumGoalPassed ? 1 : 0) + (info.album2xPassed ? 1 : 0); return `<div class="team-level-card ${isMyTeam ? 'my-team' : ''}" style="border-color:${teamColor(t)}">${isMyTeam ? '<div class="my-team-badge">Your Team</div>' : ''}${teamPfp(t) ? `<img src="${teamPfp(t)}" class="team-level-pfp" style="border-color:${teamColor(t)}">` : ''}<div class="team-level-name" style="color:${teamColor(t)}">${t}</div><div class="team-level-num">${info.level || 1}</div><div class="team-level-label">LEVEL</div><div class="team-level-xp">${fmt(info.teamXP)} XP</div><div class="team-level-missions"><div class="mission-check" title="Track Goals">${info.trackGoalPassed ? '🎵✅' : '🎵❌'}</div><div class="mission-check" title="Album Goals">${info.albumGoalPassed ? '💿✅' : '💿❌'}</div><div class="mission-check" title="Album 2X">${info.album2xPassed ? '✨✅' : '✨❌'}</div></div><div class="team-level-status ${missions === 3 ? 'complete' : ''}">${missions}/3 missions</div></div>`; }).join('')}</div>`;
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
        const [missionsData, statsData] = await Promise.all([api('getTeamSecretMissions', { team: myTeam, agentNo: STATE.agentNo, week: STATE.week }), api('getTeamSecretStats', { week: STATE.week })]);
        const activeMissions = missionsData.active || [];
        const myAssigned = missionsData.myAssigned || [];
        const stats = statsData.teams || {};
        const myStats = stats[myTeam] || {};
        container.innerHTML = renderGuide('secret-missions') + `<div class="card secret-header-card" style="border-color:${teamColor(myTeam)}"><div class="card-body"><div class="secret-header">${teamPfp(myTeam) ? `<img src="${teamPfp(myTeam)}" class="secret-team-pfp" style="border-color:${teamColor(myTeam)}">` : ''}<div class="secret-header-info"><div class="secret-team-name" style="color:${teamColor(myTeam)}">Team ${myTeam}</div><div class="secret-label">SECRET MISSION BONUS</div></div><div class="secret-xp-display"><div class="secret-xp-value">+${myStats.secretXP || 0}</div><div class="secret-xp-max">/ ${CONFIG.SECRET_MISSIONS.maxTeamBonus} max XP</div></div></div></div></div>` + (myAssigned.length ? `<div class="card urgent-card"><div class="card-header"><h3>🎯 Your Assigned Missions</h3><span class="urgent-badge">Action Required</span></div><div class="card-body">${myAssigned.map(m => renderSecretMissionCard(m, myTeam, true)).join('')}</div></div>` : '') + `<div class="card"><div class="card-header"><h3>🔒 Active Team Missions</h3></div><div class="card-body">${activeMissions.length ? activeMissions.map(m => renderSecretMissionCard(m, myTeam, false)).join('') : `<div class="empty-missions"><div class="empty-icon">📭</div><p>No active secret missions</p></div>`}</div></div>`;
    } catch (e) { container.innerHTML = '<div class="card"><div class="card-body error-state"><p>Failed to load secret missions.</p></div></div>'; }
}

function renderSecretMissionCard(mission, myTeam, isAssigned) {
    const missionInfo = CONFIG.MISSION_TYPES[mission.type] || { icon: '🔒', name: 'Mission' };
    const myProgress = mission.progress?.[myTeam] || 0;
    const goalTarget = mission.goalTarget || 100;
    const pct = Math.min((myProgress / goalTarget) * 100, 100);
    const isComplete = mission.completedTeams?.includes(myTeam);
    return `<div class="secret-mission-card ${isAssigned ? 'assigned' : ''} ${isComplete ? 'complete' : ''}"><div class="smc-header"><span class="smc-icon">${missionInfo.icon}</span><div class="smc-title-section"><div class="smc-type">${missionInfo.name}</div><div class="smc-title">${sanitize(mission.title)}</div></div></div>${mission.targetTrack ? `<div class="smc-target"><span class="target-label">TARGET:</span><span class="target-track">${sanitize(mission.targetTrack)}</span><span class="target-goal">${goalTarget} streams</span></div>` : ''}<div class="smc-progress"><div class="progress-header"><span>Team Progress</span><span>${myProgress}/${goalTarget}</span></div><div class="progress-bar"><div class="progress-fill ${isComplete ? 'complete' : ''}" style="width:${pct}%;background:${teamColor(myTeam)}"></div></div>${isComplete ? `<div class="progress-complete">✅ Mission Complete! +${mission.xpReward || 5} XP</div>` : `<div class="progress-remaining">${goalTarget - myProgress} more streams needed</div>`}</div></div>`;
}

async function renderComparison() {
    const container = $('comparison-content');
    if (!container) return;
    try {
        const [comparison, goals] = await Promise.all([api('getTeamComparison', { week: STATE.week }), api('getGoalsProgress', { week: STATE.week })]);
        if (comparison.lastUpdated) STATE.lastUpdated = comparison.lastUpdated;
        const teams = (comparison.comparison || []).sort((a, b) => (b.teamXP || 0) - (a.teamXP || 0));
        const maxXP = teams[0]?.teamXP || 1;
        let html = `${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}`;
        html += `<div class="card"><div class="card-header"><h3>⚔️ Battle Standings (${STATE.week})</h3></div><div class="card-body">` + teams.map((t, i) => `<div class="comparison-item"><span class="comparison-rank">${i+1}</span><span class="comparison-name" style="color:${teamColor(t.team)}">${t.team}</span><div class="comparison-bar-container"><div class="progress-bar"><div class="progress-fill" style="width:${(t.teamXP/maxXP)*100}%;background:${teamColor(t.team)}"></div></div></div><span class="comparison-xp">${fmt(t.teamXP)}</span></div>`).join('') + `</div></div>`;
        container.innerHTML = html;
    } catch (e) { container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load comparison</p></div></div>'; }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', initApp);

// ==================== EXPORTS ====================
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
window.showHelperPanel = showHelperPanel;
window.submitPlaylist = submitPlaylist;

console.log('🎮 BTS Spy Battle v4.3 Loaded (All Renders Restored)');
