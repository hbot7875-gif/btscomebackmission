// ===== BTS SPY BATTLE - COMPLETE APP.JS v3.6 (Team Ranking Link Added) =====

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

function fmt(n) {
    return Number(n || 0).toLocaleString();
}

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

// ==================== GUIDES / INSTRUCTIONS ====================
const PAGE_GUIDES = {
    'home': {
        icon: '👋',
        title: 'Welcome to HQ!',
        text: "Don't stress about the numbers! Every single song you listen to helps your team. Just relax, stream your favorite tracks, and watch your XP grow naturally."
    },
    'goals': {
        icon: '🎯',
        title: 'Team Targets',
        text: "These are the songs your team is focusing on this week. You don't have to stream them all! Just picking one or two to listen to helps the bar move forward."
    },
    'album2x': {
        icon: '🎧',
        title: 'The 2X Challenge',
        text: "A simple mission: Try to listen to every song on this album at least 2 times this week. It's a great way to rediscover B-sides!"
    },
    'secret-missions': {
        icon: '🕵️',
        title: 'Classified Tasks',
        text: "These grant bonus XP! If you see a mission here, it means your team needs extra help on a specific song. If it's empty, you're doing great!"
    },
    'team-level': {
        icon: '🚀',
        title: 'Leveling Up',
        text: "This shows how strong your team is. Complete the Track, Album, and 2X missions to earn all 3 badges and raise your team's level!"
    },
    'rankings': {
        icon: '🏆',
        title: 'Friendly Competition',
        text: "Remember, we are all one big team! Rankings are just for fun. Whether you are #1 or #100, your streams count exactly the same."
    }
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
    console.log('📡 API:', action, params);
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } 
        catch (parseError) { throw new Error('Invalid response from server'); }
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
    console.log('🚀 Starting BTS COMEBACK MISSION app...');
    loading(false);
    setupLoginListeners();
    loadAllAgents();

    // Auto-login if session exists
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
    const agentInput = $('agent-input');
    const instagramInput = $('instagram-input');
    
    if (loginBtn) loginBtn.onclick = handleLogin;
    if (findBtn) findBtn.onclick = handleFind;
    
    if (agentInput) {
        agentInput.onkeypress = e => { if (e.key === 'Enter') handleLogin(); };
        setTimeout(() => agentInput.focus(), 100);
    }
    if (instagramInput) {
        instagramInput.onkeypress = e => { if (e.key === 'Enter') handleFind(); };
    }
}

async function loadAllAgents() {
    try {
        const res = await api('getAllAgents');
        STATE.allAgents = res.agents || [];
    } catch (e) {
        STATE.allAgents = [];
    }
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
        const found = STATE.allAgents.find(a => {
            const igHandle = String(a.instagram || a.Instagram || a.ig || a.IG || '').trim().toLowerCase().replace('@', '');
            if (igHandle === instagram) return true;
            const name = String(a.name || a.Name || '').trim().toLowerCase();
            return name === instagram || name.includes(instagram);
        });
        if (!found) { showResult(`No agent found with "@${instagram}".`, true); return; }
        showResult(`Found! Your Agent ID is: <strong>${found.agentNo}</strong>`, false);
        const agentInput = $('agent-input');
        if (agentInput) { agentInput.value = found.agentNo; agentInput.focus(); }
    } catch (e) { showResult('Search failed: ' + e.message, true); } 
    finally { if (findBtn) { findBtn.disabled = false; findBtn.textContent = originalText || 'Find My ID'; } loading(false); }
}

// ==================== ADMIN FUNCTIONS ====================
function checkAdminStatus() {
    if (String(STATE.agentNo).toUpperCase() !== String(CONFIG.ADMIN_AGENT_NO).toUpperCase()) {
        STATE.isAdmin = false;
        return;
    }
    const savedSession = localStorage.getItem('adminSession');
    const savedExpiry = localStorage.getItem('adminExpiry');
    if (savedSession && savedExpiry && Date.now() < parseInt(savedExpiry)) {
        STATE.isAdmin = true;
        STATE.adminSession = savedSession;
    } else {
        localStorage.removeItem('adminSession');
        localStorage.removeItem('adminExpiry');
        STATE.isAdmin = false;
    }
}

function isAdminAgent() {
    return String(STATE.agentNo).toUpperCase() === String(CONFIG.ADMIN_AGENT_NO).toUpperCase();
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
                <div class="admin-welcome"><p>Welcome, Agent ${STATE.agentNo}</p></div>
                <div class="form-group"><label>PASSWORD:</label><input type="password" id="admin-password" class="form-input" placeholder="Enter admin password"></div>
                <div id="admin-error" class="admin-error"></div>
            </div>
            <div class="modal-footer"><button onclick="verifyAdminPassword()" class="btn-primary" id="admin-verify-btn">Authenticate</button></div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => { const pw = $('admin-password'); if (pw) pw.focus(); }, 100);
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
        let verified = false;
        try {
            const result = await api('verifyAdmin', { agentNo: STATE.agentNo, password: password });
            if (result.success) { verified = true; STATE.adminSession = result.sessionToken; }
        } catch (e) { if (password === CONFIG.ADMIN_PASSWORD) { verified = true; STATE.adminSession = 'local_' + Date.now(); } }
        
        if (verified) {
            STATE.isAdmin = true;
            localStorage.setItem('adminSession', STATE.adminSession);
            localStorage.setItem('adminExpiry', String(Date.now() + 86400000));
            closeAdminModal();
            addAdminIndicator();
            showAdminPanel();
            showToast('Admin access granted!', 'success');
        } else {
            if (errorEl) { errorEl.textContent = '❌ Invalid password'; errorEl.classList.add('show'); }
        }
    } catch (e) {
        if (errorEl) { errorEl.textContent = '❌ Error: ' + e.message; errorEl.classList.add('show'); }
    } finally { if (verifyBtn) verifyBtn.disabled = false; }
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

function exitAdminMode() {
    if (confirm('Exit admin mode?')) {
        STATE.isAdmin = false;
        STATE.adminSession = null;
        localStorage.removeItem('adminSession');
        localStorage.removeItem('adminExpiry');
        document.querySelector('.admin-nav-link')?.remove();
        document.querySelector('.admin-panel')?.remove();
        showToast('Admin mode deactivated', 'info');
    }
}

// ==================== ADMIN PANEL & ASSETS ====================
function showAdminPanel() {
    if (!STATE.isAdmin) { showAdminLogin(); return; }
    
    document.querySelector('.admin-panel')?.remove();
    
    const panel = document.createElement('div');
    panel.className = 'admin-panel';
    panel.innerHTML = `
        <div class="admin-panel-header">
            <h3>🎛️ Mission Control</h3>
            <button class="panel-close" onclick="closeAdminPanel()">×</button>
        </div>
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
    
    // Add click listeners
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
    
    const selectedTab = document.querySelector(`.admin-tab[data-tab="${tabName}"]`);
    const selectedContent = document.getElementById(`admin-tab-${tabName}`);
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedContent) selectedContent.classList.add('active');
}

function renderAdminAssets() {
    const container = document.getElementById('admin-tab-assets');
    if (!container) return;
    
    let html = `<div class="asset-section" style="padding:20px;">`;
    
    // Debug Info
    html += `<h4>🎲 Level Up Random Pool</h4>`;
    html += `<p style="color:#aaa; font-size:12px; margin-bottom:15px;">
        <strong>Repo:</strong> ${CONFIG.BADGE_REPO_URL}<br>
        <strong>Total Configured:</strong> ${CONFIG.TOTAL_BADGE_IMAGES}<br>
        If images are broken, check if your GitHub filenames match exactly: "BTS (1).jpg", "BTS (2).jpg", etc. (Case sensitive, spaces matter).
    </p>`;
    
    if (CONFIG.BADGE_POOL && CONFIG.BADGE_POOL.length) {
        html += `<div class="badges-showcase" style="justify-content: flex-start; flex-wrap: wrap; gap: 10px;">`;
        
        CONFIG.BADGE_POOL.forEach((imgUrl, index) => {
            const filename = `BTS (${index + 1}).jpg`;
            
            html += `
                <div class="badge-showcase-item" style="width:100px; margin: 5px;">
                    <div class="badge-circle" style="width:80px; height:80px; border-color:#ffd700; background: #000; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                        <img src="${imgUrl}" 
                             style="width:100%; height:100%; object-fit:cover;"
                             onload="this.style.opacity=1"
                             onerror="this.style.display='none'; this.parentNode.innerHTML='❌ Broken'; this.parentNode.style.fontSize='10px'; this.parentNode.style.color='red';">
                    </div>
                    <div class="badge-name" style="font-size:10px; margin-top:5px; word-break:break-all;">${filename}</div>
                    <a href="${imgUrl}" target="_blank" style="font-size:9px; color:#4cc9f0;">Open Link</a>
                </div>
            `;
        });
        html += `</div>`;
    } else {
        html += `<p>No random pool configured.</p>`;
    }
    
    html += `</div>`;
    container.innerHTML = html;
}

function renderCreateMissionForm() {
    return `
        <div class="create-mission-form">
            <div class="form-section">
                <h4>📋 Mission Type</h4>
                <div class="mission-type-grid">
                    ${Object.entries(CONFIG.MISSION_TYPES).map(([key, m], i) => `
                        <div class="mission-type-option ${i === 0 ? 'selected' : ''}" data-type="${key}" onclick="selectMissionType('${key}')">
                            <span class="type-icon">${m.icon}</span><span class="type-name">${m.name}</span>
                        </div>
                    `).join('')}
                </div>
                <input type="hidden" id="selected-mission-type" value="joint_op">
            </div>
            <div class="form-section">
                <h4>🎯 Target Teams</h4>
                <div class="team-checkboxes">
                    ${Object.keys(CONFIG.TEAMS).map(team => `
                        <label class="team-checkbox" style="--team-color: ${teamColor(team)}">
                            <input type="checkbox" name="target-teams" value="${team}">
                            <span class="checkbox-custom"></span><span class="team-name">${team}</span>
                        </label>
                    `).join('')}
                </div>
                <label class="select-all-teams"><input type="checkbox" id="all-teams" onchange="toggleAllTeams(this.checked)"><span>All Teams</span></label>
            </div>
            <div class="form-section">
                <h4>📝 Details</h4>
                <div class="form-group"><label>Title *</label><input type="text" id="mission-title" class="form-input" placeholder="Title"></div>
                <div class="form-group"><label>Briefing *</label><textarea id="mission-briefing" class="form-textarea" rows="2" placeholder="Briefing"></textarea></div>
                <div class="form-group"><label>Target</label><input type="text" id="target-track" class="form-input" placeholder="Track Name"></div>
                <div class="form-row">
                    <div class="form-group"><label>Goal Type</label><select id="goal-type" class="form-select"><option value="combined_streams">Combined</option></select></div>
                    <div class="form-group"><label>Target #</label><input type="number" id="goal-target" class="form-input" value="100"></div>
                </div>
            </div>
            <div class="form-actions"><button onclick="createTeamMission()" class="btn-primary btn-large">🚀 Deploy</button></div>
            <div id="create-result" class="create-result"></div>
        </div>
    `;
}

function selectMissionType(type) {
    document.querySelectorAll('.mission-type-option').forEach(el => el.classList.remove('selected'));
    document.querySelector(`.mission-type-option[data-type="${type}"]`)?.classList.add('selected');
    $('selected-mission-type').value = type;
}

function toggleAllTeams(checked) {
    document.querySelectorAll('input[name="target-teams"]').forEach(cb => cb.checked = checked);
}

async function createTeamMission() {
    const type = $('selected-mission-type')?.value;
    const title = $('mission-title')?.value.trim();
    const briefing = $('mission-briefing')?.value.trim();
    const targetTeams = Array.from(document.querySelectorAll('input[name="target-teams"]:checked')).map(cb => cb.value);
    const targetTrack = $('target-track')?.value.trim();
    const goalType = $('goal-type')?.value;
    const goalTarget = parseInt($('goal-target')?.value) || 100;
    
    if (!title || targetTeams.length === 0 || !briefing) { showCreateResult('Please fill all required fields', true); return; }
    
    loading(true);
    try {
        const result = await api('createTeamMission', {
            type, title, briefing, targetTeams: JSON.stringify(targetTeams), targetTrack, goalType, goalTarget, week: STATE.week, agentNo: STATE.agentNo, sessionToken: STATE.adminSession
        });
        if (result.success) {
            showCreateResult(`✅ Mission deployed!`, false);
            loadActiveTeamMissions();
        } else {
            showCreateResult('❌ ' + result.error, true);
        }
    } catch (e) { showCreateResult('❌ Error: ' + e.message, true); } finally { loading(false); }
}

function showCreateResult(msg, isError) {
    const el = $('create-result');
    if (!el) return;
    el.textContent = msg;
    el.className = `create-result show ${isError ? 'error' : 'success'}`;
    if (!isError) setTimeout(() => el.classList.remove('show'), 5000);
}

async function loadActiveTeamMissions() {
    const container = $('admin-tab-active');
    if (!container) return;
    try {
        const result = await api('getTeamMissions', { status: 'active', week: STATE.week });
        const missions = result.missions || [];
        const tab = document.querySelector('.admin-tab[data-tab="active"]');
        if (tab) tab.textContent = `Active (${missions.length})`;
        if (missions.length === 0) { container.innerHTML = `<div class="empty-state"><p>No active missions</p></div>`; return; }
        container.innerHTML = missions.map(m => `
            <div class="admin-mission-card"><div class="amc-header"><span>${CONFIG.MISSION_TYPES[m.type]?.icon || '📋'} ${sanitize(m.title)}</span></div><div class="amc-actions"><button onclick="adminCompleteMission('${m.id}')" class="btn-sm btn-success">Complete</button><button onclick="adminCancelMission('${m.id}')" class="btn-sm btn-danger">Cancel</button></div></div>
        `).join('');
    } catch (e) { container.innerHTML = `<div class="error-state">Error loading missions</div>`; }
}

async function adminCompleteMission(missionId) {
    const team = prompt('Enter team name to mark complete:');
    if (!team) return;
    loading(true);
    try {
        await api('completeTeamMission', { missionId, team, agentNo: STATE.agentNo, sessionToken: STATE.adminSession });
        loadActiveTeamMissions();
        showToast('Mission marked complete', 'success');
    } catch (e) { alert('Error: ' + e.message); } finally { loading(false); }
}

async function adminCancelMission(missionId) {
    if (!confirm('Cancel mission?')) return;
    loading(true);
    try {
        await api('cancelTeamMission', { missionId, agentNo: STATE.agentNo, sessionToken: STATE.adminSession });
        loadActiveTeamMissions();
        showToast('Mission cancelled', 'info');
    } catch (e) { alert('Error: ' + e.message); } finally { loading(false); }
}

async function loadMissionHistory() {
    const container = $('admin-tab-history');
    if (!container) return;
    try {
        const result = await api('getTeamMissions', { status: 'all' });
        const missions = (result.missions || []).filter(m => m.status !== 'active');
        container.innerHTML = missions.length ? missions.map(m => `<div class="history-item"><span>${sanitize(m.title)}</span><span class="status-badge">${m.status}</span></div>`).join('') : `<div class="empty-state"><p>No history</p></div>`;
    } catch (e) { container.innerHTML = `<div class="error-state">Error</div>`; }
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

        setTimeout(() => {
            if (typeof NOTIFICATIONS !== 'undefined') {
                NOTIFICATIONS.checkUpdates();
            }
        }, 1500); 
        
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
    
    if (isAdminAgent()) addAdminNavLink();
    $('menu-btn')?.addEventListener('click', () => $('sidebar')?.classList.add('open'));
    $('close-sidebar')?.addEventListener('click', closeSidebar);
    $('logout-btn')?.addEventListener('click', logout);
    updateTime();
}

function addAdminNavLink() {
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
    
    // Ensure chat container exists dynamically if not present
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

// ==================== CHAT (LAUNCH PAD) ====================
async function renderChat() {
    const container = document.getElementById('chat-content');
    if (!container) return;

    const team = STATE.data?.profile?.team || 'Unknown';
    const name = sanitize(STATE.data?.profile?.name) || 'Agent';
    const color = teamColor(team);
    const chatUrl = `https://tlk.io/${CONFIG.CHAT_CHANNEL}`;

    container.innerHTML = `
        <div class="card" style="height: 100%; display: flex; flex-direction: column; margin-bottom: 0;">
            <div class="card-header" style="border-bottom: 1px solid var(--border);">
                <h3>💬 Secret Comms Channel</h3>
                <div class="mission-hint">Encrypted Channel • Logged in as <span style="color:${color}">${name}</span></div>
            </div>
            
            <div class="card-body" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; background: radial-gradient(circle at center, #1a1a2e 0%, #0a0a0f 100%);">
                
                <div style="font-size: 60px; margin-bottom: 20px; animation: float 3s ease-in-out infinite;">🛰️</div>
                
                <h2 style="color: var(--text-bright); margin-bottom: 10px;">Secure Link Established</h2>
                <p style="color: var(--text-dim); max-width: 400px; margin-bottom: 30px; font-size: 14px;">
                    To bypass ad-blockers and ensure transmission security, the comms channel must be opened in a secure popup link.
                </p>

                <a href="${chatUrl}" target="_blank" onclick="window.open(this.href, 'bts_chat', 'width=500,height=700'); return false;" 
                   class="btn-primary" style="padding: 15px 30px; font-size: 16px; border: 1px solid var(--purple-glow); box-shadow: 0 0 20px rgba(123, 44, 191, 0.3);">
                    🚀 LAUNCH COMMS CHANNEL
                </a>

                <div style="margin-top: 30px; font-size: 11px; color: var(--text-muted);">
                    Status: <span style="color: var(--success);">ONLINE</span> • Encryption: <span style="color: var(--success);">ACTIVE</span>
                </div>

            </div>
        </div>
    `;
}

// ==================== HOME PAGE ====================
async function renderHome() {
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
        
        const quickStatsEl = document.querySelector('.quick-stats-section');
        if (quickStatsEl) {
            quickStatsEl.innerHTML = guideHtml + `
                <div class="card quick-stats-card" style="border-color:${teamColor(team)}40;background:linear-gradient(135deg, ${teamColor(team)}11, var(--bg-card));">
                    <div class="card-body">
                        <div class="quick-header">
                            ${teamPfp(team) ? `<img src="${teamPfp(team)}" class="quick-pfp" style="border-color:${teamColor(team)}">` : ''}
                            <div class="quick-info"><div class="quick-name">Welcome, ${sanitize(STATE.data?.profile?.name)}!</div><div class="quick-team" style="color:${teamColor(team)}">Team ${team} • Rank #${STATE.data?.rank || 'N/A'}</div></div>
                        </div>
                        <div class="quick-stats-grid">
                            <div class="quick-stat"><div class="quick-stat-value">${fmt(myStats.totalXP)}</div><div class="quick-stat-label">XP</div></div>
                            <div class="quick-stat"><div class="quick-stat-value">${fmt(myStats.trackScrobbles || 0)}</div><div class="quick-stat-label">Tracks</div></div>
                            <div class="quick-stat"><div class="quick-stat-value">${fmt(myStats.albumScrobbles || 0)}</div><div class="quick-stat-label">Albums</div></div>
                        </div>
                        <div class="battle-timer ${isCompleted ? 'ended' : ''}">
                            ${isCompleted ? '🏆 Week Completed' : (daysLeft <= 1 ? '🚀 Final Day!' : `⏰ ${daysLeft} days left`)}
                        </div>
                        ${isCompleted ? `<div class="results-alert" onclick="loadPage('summary')">🏆 View Final Results →</div>` : ''}
                        ${STATE.lastUpdated ? `<div class="last-updated-mini">Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}
                    </div>
                </div>
            `;
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
                <div class="mission-card expanded" onclick="loadPage('goals')">
                    <div class="mission-icon">🎵</div><h3>Track Goals</h3>
                    <div class="mission-status ${teamData.trackGoalPassed ? 'complete' : ''}">${teamData.trackGoalPassed ? '✅ Complete' : '⏳ In Progress'}</div>
                    <div class="goals-list">
                        ${trackGoalsList.length ? trackGoalsList.map(g => `<div class="goal-mini ${g.done ? 'done' : ''}"><span class="goal-name">${sanitize(g.name)}</span><span class="goal-progress">${fmt(g.current)}/${fmt(g.goal)} ${g.done ? '✅' : ''}</span></div>`).join('') : '<p class="no-goals">No track goals</p>'}
                    </div>
                </div>
                <div class="mission-card expanded" onclick="loadPage('goals')">
                    <div class="mission-icon">💿</div><h3>Album Goals</h3>
                    <div class="mission-status ${teamData.albumGoalPassed ? 'complete' : ''}">${teamData.albumGoalPassed ? '✅ Complete' : '⏳ In Progress'}</div>
                    <div class="goals-list">
                        ${albumGoalsList.length ? albumGoalsList.map(g => `<div class="goal-mini ${g.done ? 'done' : ''}"><span class="goal-name">${sanitize(g.name)}</span><span class="goal-progress">${fmt(g.current)}/${fmt(g.goal)} ${g.done ? '✅' : ''}</span></div>`).join('') : '<p class="no-goals">No album goals</p>'}
                    </div>
                </div>
                <div class="mission-card" onclick="loadPage('album2x')">
                    <div class="mission-icon">✨</div><h3>Album 2X</h3><div class="mission-subtitle">${sanitize(CONFIG.TEAMS[team]?.album || team)}</div>
                    <div class="mission-status ${album2xStatus.passed ? 'complete' : ''}">${album2xStatus.passed ? '✅ Complete' : '⏳ In Progress'}</div>
                    <div class="mission-progress">
                        <div class="progress-bar"><div class="progress-fill ${album2xStatus.passed ? 'complete' : ''}" style="width:${teamTracks.length ? (tracksCompleted2x/teamTracks.length*100) : 0}%"></div></div>
                        <span>${tracksCompleted2x}/${teamTracks.length} tracks</span>
                    </div>
                </div>
                <div class="mission-card secret" onclick="loadPage('secret-missions')">
                    <div class="mission-icon">🔒</div><h3>Secret Missions</h3><div class="mission-status">🕵️ Classified</div><div class="mission-hint">Tap to view team missions</div>
                </div>
                <!-- CHAT SHORTCUT -->
                <div class="mission-card" onclick="loadPage('chat')">
                    <div class="mission-icon">💬</div><h3>Secret Comms</h3><div class="mission-subtitle">HQ Encrypted Channel</div>
                    <div class="mission-hint">Tap to join chat</div>
                </div>
            `;
        }
        
        const rankList = rankings.rankings || [];
        const topAgentsEl = $('home-top-agents');
        if (topAgentsEl) {
            topAgentsEl.innerHTML = rankList.length ? rankList.slice(0, 5).map((r, i) => `
                <div class="rank-item ${String(r.agentNo) === String(STATE.agentNo) ? 'highlight' : ''}" onclick="loadPage('rankings')">
                    <div class="rank-num">${i+1}</div>
                    <div class="rank-info"><div class="rank-name">${sanitize(r.name)}</div><div class="rank-team" style="color:${teamColor(r.team)}">${r.team}</div></div>
                    <div class="rank-xp">${fmt(r.totalXP)} XP</div>
                </div>
            `).join('') : '<p class="empty-text">No data yet</p>';
        }
        
        const sortedTeams = Object.keys(summary.teams || {}).sort((a, b) => (summary.teams[b].teamXP || 0) - (summary.teams[a].teamXP || 0));
        const standingsEl = $('home-standings');
        if (standingsEl) {
            // ▼▼▼ FIX: ADDED BUTTON TO ACCESS THE 'comparison' PAGE FOR DETAILED TEAM RANKINGS ▼▼▼
            standingsEl.innerHTML = sortedTeams.length ? `
                <div class="standings-header"><span class="standings-badge ${isCompleted ? 'final' : ''}">${isCompleted ? '🏆 Final Standings' : '⏳ Live Battle'}</span></div>
                ${sortedTeams.map((t, i) => {
                    const td = summary.teams[t];
                    return `<div class="standing-item ${t === team ? 'my-team' : ''}" onclick="loadPage('team-level')" style="--team-color:${teamColor(t)}">
                        <div class="standing-rank">${i+1}</div>${teamPfp(t) ? `<img src="${teamPfp(t)}" class="standing-pfp">` : ''}
                        <div class="standing-info"><div class="standing-name" style="color:${teamColor(t)}">${t}</div><div class="standing-xp">${fmt(td.teamXP)} XP</div></div>
                        <div class="standing-missions">${td.trackGoalPassed?'🎵✅':'🎵❌'} ${td.albumGoalPassed?'💿✅':'💿❌'} ${td.album2xPassed?'✨✅':'✨❌'}</div>
                    </div>`;
                }).join('')}
                <div class="standings-footer">
                    <button class="btn-secondary" onclick="loadPage('comparison')">View Battle Details →</button>
                </div>
            ` : '<p class="empty-text">No data yet</p>';
            // ▲▲▲ END OF FIX ▲▲▲
        }
    } catch (e) { console.error(e); showToast('Failed to load home', 'error'); }
}

// ==================== SUMMARY PAGE ====================
async function renderSummary() {
    const container = $('summary-content');
    const selectedWeek = STATE.week;
    const isCompleted = isWeekCompleted(selectedWeek);
    
    if (!isCompleted) {
        const days = getDaysRemaining(selectedWeek);
        container.innerHTML = `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:60px 20px;">
                    <div style="font-size:64px;margin-bottom:20px;">🔒</div>
                    <h2>Summary Locked</h2>
                    <p style="color:var(--text-dim);margin:16px 0;">Results for <strong>${selectedWeek}</strong> are not yet final.</p>
                    <div class="countdown-box"><div class="countdown-value">${days}</div><div class="countdown-label">day${days !== 1 ? 's' : ''} until results</div></div>
                    <button onclick="loadPage('home')" class="btn-primary" style="margin-top:20px;">View Live Progress →</button>
                </div>
            </div>
        `;
        return;
    }
    
    try {
        const [summary, winners] = await Promise.all([
            api('getWeeklySummary', { week: selectedWeek }),
            api('getWeeklyWinners').catch(() => ({ winners: [] }))
        ]);
        const teams = summary.teams || {};
        const winner = summary.winner;
        const sorted = Object.entries(teams).sort((a, b) => (b[1].teamXP || 0) - (a[1].teamXP || 0));
        const actualWinner = sorted[0]?.[0] || winner;
        
        container.innerHTML = `
            <div class="summary-week-header"><h2>📊 ${selectedWeek} Results</h2><p class="results-date">${isCompleted ? 'Battle Concluded' : 'Provisional Results'}</p></div>
            ${actualWinner ? `<div class="card winner-card" style="border-color:${teamColor(actualWinner)}"><div class="card-body" style="text-align:center;padding:40px;"><div style="font-size:64px;margin-bottom:16px;">🏆</div><h2 style="color:${teamColor(actualWinner)}">Team ${actualWinner} WINS!</h2><p style="font-size:32px;color:var(--purple-glow);">${fmt(teams[actualWinner]?.teamXP)} XP</p></div></div>` : ''}
            <div class="card"><div class="card-header"><h3>📊 Final Standings</h3></div><div class="card-body">${sorted.map(([t, info], i) => `<div class="final-standing ${i===0?'winner':''}" style="border-left-color:${teamColor(t)}"><span class="standing-pos">${i+1}</span><div class="standing-details"><div style="color:${teamColor(t)};font-weight:600;">${t}</div></div><div class="standing-xp-final">${fmt(info.teamXP)} XP</div></div>`).join('')}</div></div>
        `;
    } catch (e) { container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load summary</p></div></div>'; }
}

// ==================== DRAWER PAGE (UPDATED) ====================
async function renderDrawer() {
    const container = $('drawer-content');
    if (!container) return;

    const profile = STATE.data?.profile || {};
    const stats = STATE.data?.stats || {};
    const currentXP = stats.totalXP || 0;

    // 1. CALCULATE LEVEL BADGES
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
            const imageUrl = pool[index];
            
            badges.push({
                name: `Level ${level}`,
                description: `Unlocked at ${level * 100} XP`,
                imageUrl: imageUrl,
                isLevelBadge: true
            });
        }
        return badges.reverse();
    }

    const levelBadges = getLevelBadges(STATE.agentNo, currentXP);

    // 2. FIXED BADGES (Optional)
    const fixedBadges = [];
    // If you add CONFIG.BADGES later, they will merge here.
    
    const allBadges = [...fixedBadges, ...levelBadges];
    const isAdmin = String(STATE.agentNo).toUpperCase() === String(CONFIG.ADMIN_AGENT_NO).toUpperCase();
    
    container.innerHTML = `
        <div class="card">
            <div class="card-body">
                <div class="drawer-header">
                    ${teamPfp(profile.team) ? `<img src="${teamPfp(profile.team)}" class="drawer-pfp" style="border-color:${teamColor(profile.team)}">` : ''}
                    <div class="drawer-info">
                        <div class="drawer-name">${sanitize(profile.name)}</div>
                        <div class="drawer-team" style="color:${teamColor(profile.team)}">Team ${profile.team}</div>
                        <div class="drawer-id">Agent #${STATE.agentNo}</div>
                    </div>
                </div>
                ${isAdmin ? `<button onclick="showAdminLogin()" class="btn-primary" style="width:100%; margin: 10px 0;">🔐 Access Mission Control</button>` : ''}
                <div class="drawer-stats">
                    <div class="drawer-stat"><span class="value">${fmt(currentXP)}</span><span class="label">Total XP</span></div>
                    <div class="drawer-stat"><span class="value">${allBadges.length}</span><span class="label">Badges</span></div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>🎖️ Collection (${allBadges.length})</h3>
                <div style="font-size:11px; color:var(--text-dim)">Next Reward: ${(Math.floor(currentXP/100) + 1) * 100} XP</div>
            </div>
            <div class="card-body">
                ${allBadges.length ? 
                    `<div class="badges-showcase">
                        ${allBadges.map(b => `
                            <div class="badge-showcase-item">
                                <div class="badge-circle" style="${b.isLevelBadge ? 'border-color:#ffd700;' : ''}">
                                    <img src="${b.imageUrl}" onerror="this.style.display='none';this.parentElement.innerHTML='❓';">
                                </div>
                                <div class="badge-name">${sanitize(b.name)}</div>
                                <div class="badge-desc">${sanitize(b.description)}</div>
                            </div>
                        `).join('')}
                    </div>` 
                    : `<div class="empty-state" style="text-align:center; padding:20px; color:#777;">
                        <div style="font-size:40px; margin-bottom:10px;">🔒</div>
                        Earn 100 XP to unlock your first random badge!
                       </div>`
                }
            </div>
        </div>
    `;
}

// ==================== OTHER PAGES ====================
async function renderProfile() {
    const stats = STATE.data?.stats || {};
    const profile = STATE.data?.profile || {};
    const album2xStatus = STATE.data?.album2xStatus || {};
    const trackContributions = STATE.data?.trackContributions || {};
    const albumContributions = STATE.data?.albumContributions || {};
    
    $('profile-stats').innerHTML = `
        <div class="stat-box"><div class="stat-value">${fmt(stats.totalXP)}</div><div class="stat-label">XP</div></div>
        <div class="stat-box"><div class="stat-value">#${STATE.data?.rank || 'N/A'}</div><div class="stat-label">Rank</div></div>
        <div class="stat-box"><div class="stat-value">#${STATE.data?.teamRank || 'N/A'}</div><div class="stat-label">Team Rank</div></div>
        <div class="stat-box"><div class="stat-value">${fmt(stats.trackScrobbles)}</div><div class="stat-label">Tracks</div></div>
        <div class="stat-box"><div class="stat-value">${fmt(stats.albumScrobbles)}</div><div class="stat-label">Albums</div></div>
        <div class="stat-box"><div class="stat-value">${album2xStatus.passed ? '✅' : '❌'}</div><div class="stat-label">2X</div></div>
    `;
    
    $('profile-tracks').innerHTML = Object.keys(trackContributions).length ? 
        Object.entries(trackContributions).sort((a, b) => b[1] - a[1]).map(([t, c]) => `<div class="contrib-item"><span>${sanitize(t)}</span><span>${fmt(c)}</span></div>`).join('') : '<p class="empty-text">No track data</p>';
    
    $('profile-albums').innerHTML = Object.keys(albumContributions).length ?
        Object.entries(albumContributions).sort((a, b) => b[1] - a[1]).map(([a, c]) => `<div class="contrib-item"><span>${sanitize(a)}</span><span>${fmt(c)}</span></div>`).join('') : '<p class="empty-text">No album data</p>';
    
    try {
        // Backup API call for fixed badges
        const badgesData = await api('getBadges', { agentNo: STATE.agentNo });
        $('profile-badges').innerHTML = (badgesData.badges || []).length ? 
            `<div class="badges-grid">${badgesData.badges.map(b => `<div class="badge-item"><div class="badge-icon">${b.imageUrl ? `<img src="${b.imageUrl}">` : '🎖️'}</div><div class="badge-name">${sanitize(b.name)}</div></div>`).join('')}</div>` : '<p class="empty-text">No badges yet</p>';
    } catch (e) { $('profile-badges').innerHTML = '<p class="empty-text">No badges</p>'; }
}

async function renderRankings() {
    try {
        const data = await api('getRankings', { week: STATE.week, limit: 100 });
        if (data.lastUpdated) STATE.lastUpdated = data.lastUpdated;
        const rankingsHtml = (data.rankings || []).map((r, i) => `
            <div class="rank-item ${String(r.agentNo) === String(STATE.agentNo) ? 'highlight' : ''}">
                <div class="rank-num">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</div>
                <div class="rank-info"><div class="rank-name">${sanitize(r.name)}${String(r.agentNo) === String(STATE.agentNo) ? ' (You)' : ''}</div><div class="rank-team" style="color:${teamColor(r.team)}">${r.team}</div></div>
                <div class="rank-xp">${fmt(r.totalXP)} XP</div>
            </div>
        `).join('') || '<p class="empty-text">No data yet</p>';
        $('rankings-list').innerHTML = renderGuide('rankings') + `<div class="rankings-header"><span class="week-badge">${STATE.week}</span></div>${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}${rankingsHtml}`;
    } catch (e) { $('rankings-list').innerHTML = '<p class="error-text">Failed to load rankings</p>'; }
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
            <div class="team-level-header"><h2>Team Levels</h2><span class="week-badge">${STATE.week}</span></div>
            ${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}
            
            <div class="team-level-grid">
                ${sortedTeams.map(([t, info], index) => { 
                    const isMyTeam = t === myTeam; 
                    const tColor = teamColor(t);
                    const missions = (info.trackGoalPassed ? 1 : 0) + (info.albumGoalPassed ? 1 : 0) + (info.album2xPassed ? 1 : 0); 
                    
                    return `
                    <div class="team-level-card ${isMyTeam ? 'my-team' : ''}" style="border-color:${tColor}">
                        ${isMyTeam ? '<div class="my-team-badge">Your Team</div>' : ''}
                        
                        ${teamPfp(t) ? `<img src="${teamPfp(t)}" class="team-level-pfp" style="border-color:${tColor}">` : ''}
                        
                        <div class="team-level-name" style="color:${tColor}">${t}</div>
                        <div class="team-level-num">${info.level || 1}</div>
                        <div class="team-level-label">LEVEL</div>
                        <div class="team-level-xp">${fmt(info.teamXP)} XP</div>
                        
                        <div class="team-level-missions">
                            <div class="mission-check" title="Track Goals">${info.trackGoalPassed ? '🎵✅' : '🎵❌'}</div>
                            <div class="mission-check" title="Album Goals">${info.albumGoalPassed ? '💿✅' : '💿❌'}</div>
                            <div class="mission-check" title="Album 2X">${info.album2xPassed ? '✨✅' : '✨❌'}</div>
                        </div>
                        
                        <div class="team-level-status ${missions === 3 ? 'complete' : ''}">
                            ${missions}/3 missions
                        </div>
                    </div>`; 
                }).join('')}
            </div>
        `;
    } catch (e) { 
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load team levels</p></div></div>'; 
    }
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
        const [missionsData, statsData] = await Promise.all([
            api('getTeamSecretMissions', { team: myTeam, agentNo: STATE.agentNo, week: STATE.week }).catch(() => ({ active: [], completed: [], myAssigned: [] })),
            api('getTeamSecretStats', { week: STATE.week }).catch(() => ({ teams: {} }))
        ]);
        
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
        const [comparison, goals, summary] = await Promise.all([
            api('getTeamComparison', { week: weekToShow }),
            api('getGoalsProgress', { week: weekToShow }),
            api('getWeeklySummary', { week: weekToShow })
        ]);
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
    // Run this function at the end of loadDashboard()
    checkUpdates: function() {
        const stats = STATE.data?.stats || {};
        const profile = STATE.data?.profile || {};
        const summary = STATE.data?.weeklySummary || {}; // You might need to fetch this if not in data
        
        let newNotifications = [];

        // 1. CHECK BADGES
        const currentXP = parseInt(stats.totalXP) || 0;
        const currentLevel = Math.floor(currentXP / 100);
        const savedLevel = parseInt(localStorage.getItem('spy_lastLevel')) || 0;

        if (currentLevel > savedLevel) {
            newNotifications.push({ type: 'badge', msg: `New Badge Unlocked: Level ${currentLevel}`, page: 'drawer', dotId: 'dot-drawer' });
            localStorage.setItem('spy_lastLevel', currentLevel);
        }

        // 2. CHECK WEEKLY RESULTS
        // We assume STATE.lastUpdated or a specific flag indicates a new result
        const lastWeekCheck = localStorage.getItem('spy_lastWeekCheck');
        const isWeekComplete = isWeekCompleted(STATE.week); // Uses your existing helper
        
        if (isWeekComplete && lastWeekCheck !== STATE.week) {
             newNotifications.push({ type: 'result', msg: `Week Results are Finalized`, page: 'summary', dotId: 'dot-summary' });
             localStorage.setItem('spy_lastWeekCheck', STATE.week);
        }

        // 3. CHECK SECRET MISSIONS (Requires checking API data or estimating)
        // We store the count of missions seen
        const missionCount = STATE.data?.secretMissionCount || 0; // *You need to ensure your API returns this count
        const savedMissionCount = parseInt(localStorage.getItem('spy_lastMissionCount')) || 0;
        
        if (missionCount > savedMissionCount) {
             newNotifications.push({ type: 'mission', msg: 'New Secret Mission Assigned', page: 'secret-missions', dotId: 'dot-mission' });
             localStorage.setItem('spy_lastMissionCount', missionCount);
        }

        // 4. CHECK ANNOUNCEMENTS (Simulated check)
        // Check if there is a high priority announcement we haven't seen
        const latestAnnounceID = STATE.data?.latestAnnouncementID || 0; 
        const savedAnnounceID = parseInt(localStorage.getItem('spy_lastAnnounceID')) || 0;

        if (latestAnnounceID > savedAnnounceID) {
            newNotifications.push({ type: 'announce', msg: 'New Priority Announcement', page: 'announcements', dotId: 'dot-announce' });
            localStorage.setItem('spy_lastAnnounceID', latestAnnounceID);
        }

        // EXECUTE NOTIFICATIONS
        if (newNotifications.length > 0) {
            this.showIntelModal(newNotifications);
            this.updateSidebarDots(newNotifications);
        }
    },

    showIntelModal: function(notifs) {
        // Remove existing modal
        document.querySelector('.intel-modal')?.remove();

        const html = `
            <div class="intel-modal">
                <div class="intel-header">
                    <span>📡 INTELLIGENCE UPDATE</span>
                    <button onclick="this.closest('.intel-modal').classList.remove('show')" style="background:none;border:none;color:#fff;">✕</button>
                </div>
                ${notifs.map(n => `
                    <div class="intel-item" onclick="loadPage('${n.page}'); this.closest('.intel-modal').classList.remove('show');">
                        <span class="intel-icon">${this.getIcon(n.type)}</span>
                        <span>${n.msg}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
        
        // Animate in
        setTimeout(() => document.querySelector('.intel-modal').classList.add('show'), 500);
        
        // Auto hide after 8 seconds
        setTimeout(() => document.querySelector('.intel-modal')?.classList.remove('show'), 8000);
    },

    updateSidebarDots: function(notifs) {
        // Clear all dots first (optional, or keep them persistent until clicked)
        // document.querySelectorAll('.notification-dot').forEach(d => d.classList.remove('active'));

        notifs.forEach(n => {
            const dot = document.getElementById(n.dotId);
            if (dot) dot.classList.add('active');
        });
    },

    getIcon: function(type) {
        switch(type) {
            case 'badge': return '🎖️';
            case 'mission': return '🕵️';
            case 'result': return '🏆';
            case 'announce': return '📢';
            default: return 'ℹ️';
        }
    }
};

// Helper to clear dots when page is visited
const originalLoadPage = window.loadPage;
window.loadPage = async function(page) {
    // Hide dot for this page
    const map = {
        'drawer': 'dot-drawer',
        'secret-missions': 'dot-mission',
        'summary': 'dot-summary',
        'announcements': 'dot-announce'
    };
    if (map[page]) {
        document.getElementById(map[page])?.classList.remove('active');
    }
    
    // Call original function
    await originalLoadPage(page);
};
// ==================== INITIALIZATION ====================
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

console.log('🎮 BTS Spy Battle v3.6 Loaded (Team Ranking Link Added)');
