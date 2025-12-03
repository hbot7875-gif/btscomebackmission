// ===== BTS SPY BATTLE - COMPLETE APP.JS v4.0 (Playlists & Focus Update) =====

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

    // ===== PLAYLISTS CONFIGURATION (NEW) =====
    PLAYLISTS: [
        { title: "Warm Up: Road to 1B", platform: "Spotify", url: "https://open.spotify.com/playlist/YOUR_LINK_HERE", desc: "Old hits close to 1 Billion" },
        { title: "Hyung Line Focus", platform: "Spotify", url: "https://open.spotify.com/playlist/YOUR_LINK_HERE", desc: "Indigo, Echo, D-Day, JITB" },
        { title: "YouTube Streaming", platform: "YouTube", url: "https://youtube.com/playlist/YOUR_LINK_HERE", desc: "Official MV Rotation" },
        { title: "Sleep Playlist", platform: "Apple Music", url: "https://music.apple.com/YOUR_LINK_HERE", desc: "Long playlist for overnight" }
    ],

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
        'Indigo': { color: '#5DADE2', album: 'Indigo' },   // Denim Blue
        'Echo': { color: '#E0E0E0', album: 'Echo' },       // Platinum Silver
        'Agust D': { color: '#FF6B00', album: 'Agust D' }, // Blaze Orange
        'JITB': { color: '#DE38C6', album: 'Jack In The Box' } // Neon Magenta
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
        'switch_app': { name: 'Switch App', icon: '🔄', description: 'Stop Spotify. Switch to YouTube/Apple Music for 1 hour.' },
        'filler_mode': { name: 'Filler Mode', icon: '🧬', description: 'Stream 1 BTS Song + 2 Non-Kpop songs to look human.' },
        'old_songs': { name: 'Old Songs', icon: '🕰️', description: 'Stream tracks older than 2 years (Road to 1B).' },
        'stream_party': { name: 'Stream Party', icon: '🎉', description: 'Everyone streams the exact same playlist NOW.' },
        'custom': { name: 'Custom Task', icon: '⭐', description: 'Special instruction from Admin. Read briefing carefully.' }
    }
};

// ==================== STATE ====================
const STATE = {
    agentNo: null, week: null, weeks: [], data: null, allAgents: [],
    page: 'home', isLoading: false, isAdmin: false, adminSession: null, lastUpdated: null
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
    return String(str).replace(/[<>\"'&]/g, char => ({
        '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;'
    })[char] || char);
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
        if (STATE.lastUpdated) {
            el.textContent = `Updated: ${formatLastUpdated(STATE.lastUpdated)}`;
        } else {
            el.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
    }
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
    'home': { icon: '👋', title: 'Welcome to HQ!', text: "Comeback is real. Stream smart, stay human, and win." },
    'goals': { icon: '🎯', title: 'Team Targets', text: "Focus on these tracks. Mix in filler songs to avoid bot detection." },
    'album2x': { icon: '🎧', title: 'The 2X Challenge', text: "Listen to every song on the album at least 2 times this week." },
    'secret-missions': { icon: '🕵️', title: 'Classified Tasks', text: "Special operations like 'Switch App' or 'Old Songs' appear here." },
    'team-level': { icon: '🚀', title: 'Leveling Up', text: "Complete missions to raise your Team Level." },
    'rankings': { icon: '🏆', title: 'Competition', text: "Friendly competition. Every stream counts." },
    'playlists': { icon: '🎧', title: 'Streaming Arsenal', text: "Use these playlists to maximize impact. Don't forget to switch platforms occasionally!" }
};

function renderGuide(pageName) {
    const guide = PAGE_GUIDES[pageName];
    if (!guide) return '';
    return `
        <div class="card guide-card" style="background: rgba(255,255,255,0.03); border-left: 3px solid #7b2cbf; margin-bottom: 20px;">
            <div class="card-body" style="display: flex; gap: 15px; align-items: flex-start; padding: 15px;">
                <div style="font-size: 24px;">${guide.icon}</div>
                <div>
                    <h4 style="margin: 0 0 5px 0; color: #fff; font-size: 14px;">${guide.title}</h4>
                    <p style="margin: 0; color: #aaa; font-size: 13px; line-height: 1.4;">${guide.text}</p>
                </div>
            </div>
        </div>
    `;
}

// ==================== API ====================
async function api(action, params = {}) {
    const url = new URL(CONFIG.API_URL);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([k, v]) => {
        if (v != null) url.searchParams.set(k, typeof v === 'object' ? JSON.stringify(v) : v);
    });
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch (e) { throw new Error('Invalid response'); }
        if (data.lastUpdated) { STATE.lastUpdated = data.lastUpdated; updateTime(); }
        if (data.error) throw new Error(data.error);
        return data;
    } catch (e) { console.error('API Error:', e); throw e; }
}

// ==================== INITIALIZATION ====================
function initApp() {
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

function setupLoginListeners() {
    const loginBtn = $('login-btn');
    const findBtn = $('find-btn');
    if (loginBtn) loginBtn.onclick = handleLogin;
    if (findBtn) findBtn.onclick = handleFind;
    $('agent-input')?.addEventListener('keypress', e => { if(e.key === 'Enter') handleLogin(); });
    $('instagram-input')?.addEventListener('keypress', e => { if(e.key === 'Enter') handleFind(); });
}

async function loadAllAgents() {
    try { const res = await api('getAllAgents'); STATE.allAgents = res.agents || []; } catch (e) {}
}

async function handleLogin() {
    if (STATE.isLoading) return;
    const agentNo = $('agent-input')?.value.trim().toUpperCase();
    if (!agentNo) return showResult('Enter Agent Number', true);
    loading(true);
    try {
        if (STATE.allAgents.length === 0) await loadAllAgents();
        const found = STATE.allAgents.find(a => String(a.agentNo).trim().toUpperCase() === agentNo);
        if (!found) { showResult('Agent not found', true); return; }
        localStorage.setItem('spyAgent', found.agentNo);
        STATE.agentNo = found.agentNo;
        checkAdminStatus();
        await loadDashboard();
    } catch (e) { showResult('Login failed', true); } 
    finally { loading(false); }
}

async function handleFind() {
    if (STATE.isLoading) return;
    const instagram = $('instagram-input')?.value.trim().toLowerCase().replace('@', '');
    if (!instagram) return showResult('Enter IG Handle', true);
    loading(true);
    try {
        if (STATE.allAgents.length === 0) await loadAllAgents();
        const found = STATE.allAgents.find(a => {
            const ig = String(a.instagram || a.ig || '').trim().toLowerCase().replace('@', '');
            return ig === instagram;
        });
        if (!found) return showResult('No agent found', true);
        showResult(`Your Agent ID: <strong>${found.agentNo}</strong>`, false);
        $('agent-input').value = found.agentNo;
    } catch (e) { showResult('Search failed', true); } 
    finally { loading(false); }
}

// ==================== ADMIN FUNCTIONS ====================
function checkAdminStatus() {
    if (String(STATE.agentNo).toUpperCase() !== String(CONFIG.ADMIN_AGENT_NO).toUpperCase()) {
        STATE.isAdmin = false; return;
    }
    const savedSession = localStorage.getItem('adminSession');
    const savedExpiry = localStorage.getItem('adminExpiry');
    if (savedSession && savedExpiry && Date.now() < parseInt(savedExpiry)) {
        STATE.isAdmin = true; STATE.adminSession = savedSession;
    } else {
        STATE.isAdmin = false;
    }
}

function isAdminAgent() { return String(STATE.agentNo).toUpperCase() === String(CONFIG.ADMIN_AGENT_NO).toUpperCase(); }

function showAdminLogin() {
    if (!isAdminAgent()) return showToast('Access denied.', 'error');
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
            <div class="modal-footer"><button onclick="verifyAdminPassword()" class="btn-primary">Authenticate</button></div>
        </div>`;
    document.body.appendChild(modal);
}

function closeAdminModal() {
    const modal = $('admin-modal');
    if (modal) { modal.classList.add('closing'); setTimeout(() => modal.remove(), 300); }
}

async function verifyAdminPassword() {
    const password = $('admin-password')?.value;
    const errorEl = $('admin-error');
    if (!password) return;
    try {
        let verified = false;
        try {
            const result = await api('verifyAdmin', { agentNo: STATE.agentNo, password });
            if (result.success) { verified = true; STATE.adminSession = result.sessionToken; }
        } catch (e) { if (password === CONFIG.ADMIN_PASSWORD) { verified = true; STATE.adminSession = 'local_' + Date.now(); } }
        
        if (verified) {
            STATE.isAdmin = true;
            localStorage.setItem('adminSession', STATE.adminSession);
            localStorage.setItem('adminExpiry', String(Date.now() + 86400000));
            addAdminIndicator();
            closeAdminModal();
            showToast('Admin access granted!', 'success');
            setTimeout(() => showAdminPanel(), 300);
        } else { if (errorEl) { errorEl.textContent = '❌ Invalid password'; errorEl.classList.add('show'); } }
    } catch (e) { if (errorEl) { errorEl.textContent = '❌ Error'; errorEl.classList.add('show'); } }
}

function addAdminIndicator() {
    let container = document.getElementById('nav-admin-container');
    if (!container) container = document.querySelector('.nav-links');
    if (!container) return;
    if (document.querySelector('.admin-nav-link')) return;

    const link = document.createElement('a');
    link.href = '#';
    link.className = 'nav-link admin-nav-link';
    link.style.color = '#ff4757'; 
    link.style.marginTop = '10px';
    link.style.borderTop = '1px solid rgba(255,255,255,0.1)';
    link.innerHTML = '<span class="nav-icon">🎛️</span><span class="nav-text">Admin Panel</span>';
    
    link.onclick = (e) => { 
        e.preventDefault(); 
        STATE.isAdmin ? showAdminPanel() : showAdminLogin(); 
        closeSidebar(); 
    };
    
    container.appendChild(link);
}

// ==================== ADMIN PANEL ====================
function showAdminPanel() {
    if (!STATE.isAdmin) { showAdminLogin(); return; }
    document.querySelector('.admin-panel')?.remove();
    
    const panel = document.createElement('div');
    panel.className = 'admin-panel';
    panel.innerHTML = `
        <div class="admin-panel-header"><h3>🎛️ Mission Control</h3><button class="panel-close" onclick="closeAdminPanel()">×</button></div>
        <div class="admin-panel-tabs">
            <button class="admin-tab active" data-tab="create">Create Mission</button>
            <button class="admin-tab" data-tab="active">Active</button>
            <button class="admin-tab" data-tab="assets">🎨 Assets</button>
            <button class="admin-tab" data-tab="history">History</button>
        </div>
        <div class="admin-panel-content">
            <div id="admin-tab-create" class="admin-tab-content active">${renderCreateMissionForm()}</div>
            <div id="admin-tab-active" class="admin-tab-content"><div class="loading-text">Loading...</div></div>
            <div id="admin-tab-assets" class="admin-tab-content"></div>
            <div id="admin-tab-history" class="admin-tab-content"><div class="loading-text">Loading...</div></div>
        </div>
    `;
    document.body.appendChild(panel);
    panel.querySelectorAll('.admin-tab').forEach(tab => { 
        tab.onclick = () => {
            switchAdminTab(tab.dataset.tab);
            if (tab.dataset.tab === 'assets') renderAdminAssets();
            if (tab.dataset.tab === 'history') loadMissionHistory();
        };
    });
    loadActiveTeamMissions();
}

function closeAdminPanel() {
    const panel = document.querySelector('.admin-panel');
    if (panel) { panel.classList.add('closing'); setTimeout(() => panel.remove(), 300); }
}

function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector(`.admin-tab[data-tab="${tabName}"]`)?.classList.add('active');
    $(`admin-tab-${tabName}`)?.classList.add('active');
}

function renderAdminAssets() {
    const container = $('admin-tab-assets');
    if (!container) return;
    let html = `<div class="asset-section" style="padding:20px;"><h4>🎲 Level Up Badge Pool</h4><div class="badges-showcase" style="flex-wrap:wrap; gap:10px;">`;
    CONFIG.BADGE_POOL.forEach((img, i) => {
        html += `<div style="width:80px;text-align:center;"><div class="badge-circle" style="margin:0 auto;"><img src="${img}" onerror="this.style.display='none';this.parentNode.style.background='red'"></div><div style="font-size:10px;margin-top:5px;">BTS (${i+1})</div></div>`;
    });
    html += `</div></div>`;
    container.innerHTML = html;
}

function renderCreateMissionForm() {
    return `
        <div class="create-mission-form">
            <div class="form-section"><h4>Mission Type</h4><div class="mission-type-grid">
                ${Object.entries(CONFIG.MISSION_TYPES).map(([key, m], i) => 
                    `<div class="mission-type-option ${i===0?'selected':''}" onclick="selectMissionType('${key}')" data-type="${key}"><span>${m.icon} ${m.name}</span></div>`
                ).join('')}
            </div><input type="hidden" id="selected-mission-type" value="switch_app"></div>
            <div class="form-section"><h4>Teams</h4><div class="team-checkboxes">
                ${Object.keys(CONFIG.TEAMS).map(t => `<label><input type="checkbox" name="target-teams" value="${t}"> ${t}</label>`).join('')}
            </div></div>
            <div class="form-section"><h4>Details</h4>
                <input type="text" id="mission-title" class="form-input" placeholder="Title">
                <textarea id="mission-briefing" class="form-textarea" placeholder="Briefing"></textarea>
                <input type="number" id="goal-target" class="form-input" value="100" placeholder="Target">
            </div>
            <button onclick="createTeamMission()" class="btn-primary">Deploy</button>
            <div id="create-result"></div>
        </div>
    `;
}

function selectMissionType(type) {
    document.querySelectorAll('.mission-type-option').forEach(e => e.classList.remove('selected'));
    document.querySelector(`[data-type="${type}"]`)?.classList.add('selected');
    $('selected-mission-type').value = type;
}

async function createTeamMission() {
    const type = $('selected-mission-type').value;
    const title = $('mission-title').value;
    const briefing = $('mission-briefing').value;
    const teams = Array.from(document.querySelectorAll('input[name="target-teams"]:checked')).map(c => c.value);
    const target = $('goal-target').value;
    
    if (!title || teams.length === 0) return showToast('Missing fields', 'error');
    
    loading(true);
    try {
        await api('createTeamMission', { type, title, briefing, targetTeams: JSON.stringify(teams), goalTarget: target, week: STATE.week, agentNo: STATE.agentNo, sessionToken: STATE.adminSession });
        showToast('Mission Deployed!', 'success');
        loadActiveTeamMissions();
    } catch(e) { showToast(e.message, 'error'); }
    loading(false);
}

async function loadActiveTeamMissions() {
    try {
        const res = await api('getTeamMissions', { status: 'active', week: STATE.week });
        const container = $('admin-tab-active');
        if(res.missions.length === 0) container.innerHTML = '<p>No active missions</p>';
        else container.innerHTML = res.missions.map(m => `
            <div class="admin-mission-card" style="background:#222;padding:10px;margin-bottom:10px;border-radius:5px;">
                <div><strong>${m.title}</strong> (${m.type})</div>
                <div style="font-size:12px;color:#aaa;">${m.briefing}</div>
                <button onclick="adminCancelMission('${m.id}')" class="btn-sm btn-danger" style="margin-top:5px;">End Mission</button>
            </div>
        `).join('');
    } catch(e) {}
}

async function adminCancelMission(id) {
    if(!confirm('End mission?')) return;
    loading(true);
    await api('cancelTeamMission', { missionId: id, agentNo: STATE.agentNo, sessionToken: STATE.adminSession });
    loadActiveTeamMissions();
    loading(false);
}

// ==================== DASHBOARD ====================
async function loadDashboard() {
    loading(true);
    try {
        const weeks = await api('getAvailableWeeks');
        STATE.weeks = weeks.weeks; STATE.week = weeks.current;
        STATE.data = await api('getAgentData', { agentNo: STATE.agentNo, week: STATE.week });
        
        $('login-screen').classList.remove('active');
        $('dashboard-screen').classList.add('active');
        $('dashboard-screen').style.display = 'flex';
        
        setupDashboard();
        await loadPage('home');
        if (STATE.isAdmin) addAdminIndicator();
        setTimeout(() => NOTIFICATIONS.checkUpdates(), 1500);
    } catch (e) { logout(); } 
    finally { loading(false); }
}

function setupDashboard() {
    const p = STATE.data?.profile;
    if (p) {
        $('agent-name').textContent = p.name;
        $('agent-team').textContent = p.team;
        $('agent-id').textContent = STATE.agentNo;
        const pfp = teamPfp(p.team);
        $('agent-avatar').innerHTML = pfp ? `<img src="${pfp}">` : p.team[0];
    }
    const sel = $('week-select');
    sel.innerHTML = STATE.weeks.map(w => `<option ${w===STATE.week?'selected':''}>${w}</option>`).join('');
    sel.onchange = () => { STATE.week = sel.value; loadDashboard(); };
    
    document.querySelectorAll('.nav-link').forEach(l => {
        l.onclick = e => { 
            e.preventDefault(); 
            document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
            l.classList.add('active');
            loadPage(l.dataset.page);
            closeSidebar();
        };
    });
    
    $('menu-btn').onclick = () => $('sidebar').classList.add('open');
    $('close-sidebar').onclick = closeSidebar;
    $('logout-btn').onclick = logout;
}

function logout() {
    localStorage.removeItem('spyAgent');
    localStorage.removeItem('adminSession');
    location.reload();
}

// ==================== ROUTER ====================
async function loadPage(page) {
    STATE.page = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Dynamic Page Creation for Playlists if missing
    if (page === 'playlists' && !$('page-playlists')) {
        const main = document.querySelector('.pages-wrapper');
        const section = document.createElement('section');
        section.id = 'page-playlists';
        section.className = 'page';
        section.innerHTML = '<div class="page-header"><h1>Streaming Playlists</h1></div><div id="playlists-content"></div>';
        main.appendChild(section);
    }
    if (page === 'chat' && !$('chat-content')) {
        const main = document.querySelector('.pages-wrapper');
        const section = document.createElement('section');
        section.id = 'page-chat';
        section.className = 'page';
        section.innerHTML = '<div id="chat-content"></div>';
        main.appendChild(section);
    }

    $('page-'+page)?.classList.add('active');
    
    loading(true);
    try {
        if (page === 'home') await renderHome();
        else if (page === 'playlists') renderPlaylists();
        else if (page === 'rankings') await renderRankings();
        else if (page === 'drawer') await renderDrawer();
        else if (page === 'goals') await renderGoals();
        else if (page === 'album2x') await renderAlbum2x();
        else if (page === 'secret-missions') await renderSecretMissions();
        else if (page === 'team-level') await renderTeamLevel();
        else if (page === 'comparison') await renderComparison();
        else if (page === 'summary') await renderSummary();
        else if (page === 'announcements') await renderAnnouncements();
        else if (page === 'profile') await renderProfile();
        else if (page === 'chat') await renderChat();
    } catch(e) { console.log(e); }
    loading(false);
}

// ==================== PAGES ====================
function renderPlaylists() {
    const container = $('playlists-content');
    if (!container) return;
    container.innerHTML = renderGuide('playlists') + `
        <div style="display:grid; gap:15px;">
            ${CONFIG.PLAYLISTS.map(p => `
                <div class="card" style="display:flex; align-items:center; padding:15px; background:rgba(255,255,255,0.05);">
                    <div style="font-size:24px; margin-right:15px;">${p.platform==='Spotify'?'🟢':p.platform==='YouTube'?'🔴':'🎵'}</div>
                    <div style="flex:1;">
                        <div style="font-weight:bold; color:#fff;">${sanitize(p.title)}</div>
                        <div style="font-size:12px; color:#aaa;">${sanitize(p.desc)}</div>
                    </div>
                    <a href="${p.url}" target="_blank" class="btn-sm btn-primary">OPEN</a>
                </div>
            `).join('')}
        </div>
    `;
}

async function renderHome() {
    const guide = renderGuide('home');
    
    // Safety check: Ensure data exists before rendering
    if (!STATE.data || !STATE.data.stats) return;

    const stats = STATE.data.stats;
    const team = STATE.data.profile.team;
    
    // Get Goals for Focus Track
    let focusSong = "Loading...";
    try {
        const goalsData = await api('getGoalsProgress', { week: STATE.week });
        const teamGoals = goalsData.trackGoals;
        if(teamGoals && Object.keys(teamGoals).length > 0) {
            focusSong = Object.keys(teamGoals)[0]; // Pick first track
        } else {
            focusSong = "No active targets";
        }
    } catch(e) {}

    // 👇 FIX: Use document.querySelector for classes instead of $
    const statsContainer = document.querySelector('.quick-stats-section');
    if (statsContainer) {
        statsContainer.innerHTML = guide + `
            <!-- FOCUS SONG BANNER -->
            <div style="background:linear-gradient(90deg, #ff0055 0%, #ff0000 100%); padding:10px 15px; border-radius:8px; margin-bottom:10px; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:14px; box-shadow:0 0 15px rgba(255,0,0,0.4);">
                <span style="margin-right:8px;">🎯 TEAM PRIORITY:</span> ${sanitize(focusSong)}
            </div>

            <!-- MY CONTRIBUTION BAR -->
            <div style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); padding:10px 15px; border-radius:8px; margin-bottom:20px; font-size:13px; display:flex; justify-content:space-between;">
                <span style="color:#aaa;">👤 Your Contribution:</span>
                <span style="color:#fff; font-weight:bold;">${fmt(stats.trackScrobbles)} streams</span>
            </div>

            <div class="card quick-stats-card" style="background:linear-gradient(135deg, ${teamColor(team)}22, #1a1a2e);">
                <div class="card-body">
                    <h3>Welcome, Agent ${STATE.data.profile.name}</h3>
                    <div class="quick-stats-grid">
                        <div>${fmt(stats.totalXP)} XP</div>
                        <div>${fmt(stats.trackScrobbles)} Tracks</div>
                    </div>
                </div>
            </div>`;
    }
        
    // 👇 FIX: Use document.querySelector here too
    const missionsContainer = document.querySelector('.missions-grid');
    if (missionsContainer) {
        missionsContainer.innerHTML = `
            <div class="mission-card" onclick="loadPage('goals')"><div>🎵</div><h3>Track Goals</h3></div>
            <div class="mission-card" onclick="loadPage('album2x')"><div>💿</div><h3>Album 2X</h3></div>
            <div class="mission-card secret" onclick="loadPage('secret-missions')"><div>🔒</div><h3>Secret Ops</h3></div>
        `;
    }
}
        
// ==================== DRAWER (BADGES) ====================
async function renderDrawer() {
    const container = $('drawer-content');
    if (!container) return;
    
    const xp = STATE.data.stats.totalXP || 0;
    const level = Math.floor(xp / 100);
    let badgesHtml = '';
    
    for(let i=1; i<=level; i++) {
        let seed = 0;
        const str = String(STATE.agentNo);
        for(let j=0; j<str.length; j++) seed += str.charCodeAt(j);
        seed += (i * 137);
        const img = CONFIG.BADGE_POOL[seed % CONFIG.TOTAL_BADGE_IMAGES];
        badgesHtml += `
            <div class="badge-showcase-item">
                <div class="badge-circle"><img src="${img}"></div>
                <div class="badge-name">Level ${i}</div>
            </div>`;
    }
    
    container.innerHTML = `
        <div class="card"><div class="card-body" style="text-align:center;">
            <h3>Agent Level ${level}</h3>
            <p>${fmt(xp)} XP Total</p>
        </div></div>
        <div class="card"><div class="card-header"><h3>Collection</h3></div>
        <div class="card-body"><div class="badges-showcase">${badgesHtml || 'No badges yet.'}</div></div></div>
    `;
}

// ==================== RANKINGS (TABS) ====================
async function renderRankings() {
    const container = $('rankings-list');
    if (!container) return;
    const myTeam = STATE.data.profile.team;
    
    container.innerHTML = `
        ${renderGuide('rankings')}
        <div class="ranking-tabs">
            <button id="tab-overall" class="ranking-tab active" onclick="switchRank('overall')">Overall</button>
            <button id="tab-team" class="ranking-tab" onclick="switchRank('team')" style="--team-color:${teamColor(myTeam)}">${myTeam}</button>
        </div>
        <div id="rank-content"><p>Loading...</p></div>
    `;
    window.switchRank = async (type) => {
        document.querySelectorAll('.ranking-tab').forEach(t => t.classList.remove('active'));
        document.getElementById(`tab-${type}`).classList.add('active');
        const res = await api(type === 'team' ? 'getTeamRankings' : 'getRankings', { week: STATE.week, team: myTeam });
        document.getElementById('rank-content').innerHTML = res.rankings.map((r, i) => `
            <div class="rank-item ${r.agentNo===STATE.agentNo?'highlight':''}">
                <div class="rank-num">${i+1}</div>
                <div>${r.name}</div>
                <div class="rank-xp">${fmt(r.totalXP)}</div>
            </div>`).join('');
    };
    window.switchRank('overall');
}

// ==================== NOTIFICATIONS ====================
const NOTIFICATIONS = {
    checkUpdates: function() {
        const xp = STATE.data?.stats?.totalXP || 0;
        const lvl = Math.floor(xp/100);
        const oldLvl = parseInt(localStorage.getItem('lastLvl')||0);
        if(lvl > oldLvl) {
            showToast(`New Badge Unlocked: Level ${lvl}`, 'success');
            localStorage.setItem('lastLvl', lvl);
            document.getElementById('dot-drawer')?.classList.add('active');
        }
    }
};

// Init
document.addEventListener('DOMContentLoaded', initApp);
// Exports
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

console.log('🎮 BTS Spy Battle v3.8 Loaded (Strategic Update)');
