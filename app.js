// ===== BTS SPY BATTLE - COMPLETE FIXED APP.JS =====

// ==================== CONFIGURATION ====================
const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbx5ArHi5Ws0NxMa9nhORy6bZ7ZYpW4urPIap24tax9H1HLuGQxYRCgTVwDaKOMrZ7JOGA/exec',
    
    // Admin Settings
    ADMIN_AGENT_NO: 'AGENT001',
    ADMIN_PASSWORD: 'BTSSPYADMIN2024',
    
    TEAMS: {
        'Indigo': { color: '#4cc9f0', album: 'Indigo' },
        'Echo': { color: '#f72585', album: 'Echo' },
        'Agust D': { color: '#ff9500', album: 'Agust D' },
        'JITB': { color: '#7209b7', album: 'Jack In The Box' }
    },
    
    TEAM_ALBUM_TRACKS: {
        "Indigo": [
            "Yun (with Erykah Badu)",
            "Still Life (with Anderson .Paak)",
            "All Day (with Tablo)",
            "Forg_tful (with Kim Sawol)",
            "Closer (with Paul Blanco, Mahalia)",
            "Change pt.2",
            "Lonely",
            "Hectic (with Colde)",
            "Wild Flower (with youjeen)",
            "No.2 (with parkjiyoon)"
        ],
        "Echo": [
            "Don't Say You Love Me",
            "Nothing Without Your Love",
            "Loser (feat. YENA)",
            "Rope It",
            "With the Clouds",
            "To Me, Today"
        ],
        "Agust D": [
            "Intro : Dt sugA",
            "Agust D",
            "Skit",
            "So far away (feat. Suran)",
            "140503 at Dawn",
            "Tony Montana",
            "give it to me",
            "Interlude : Dream, Reality",
            "The Last",
            "724148"
        ],
        "JITB": [
            "Intro",
            "Pandora's Box",
            "MORE",
            "STOP",
            "= (Equal Sign)",
            "Music Box : Reflection",
            "What if...",
            "Safety Zone",
            "Future",
            "Arson"
        ]
    },
    
    TEAM_PFPS: {
        "Indigo": "https://i.ibb.co/4g9KWg3/team-Indigo.png",
        "Echo": "https://i.ibb.co/7xdY9xC/Team-Echo.png",
        "Agust D": "https://i.ibb.co/BVc11nz/Team-agustd.png",
        "JITB": "https://i.ibb.co/FbdLFwh/Team-jitb.png"
    },
    
    SECRET_MISSIONS: {
        xpPerMission: 5,
        maxMissionsPerTeam: 5,
        maxTeamBonus: 25
    },
    
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
    displayWeek: null,
    weeks: [],
    data: null,
    allAgents: [],
    page: 'home',
    charts: {},
    isLoading: false,
    isAdmin: false,
    adminSession: null,
    lastUpdated: null // Track last data update time
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
        if (isNaN(date.getTime())) return dateStr; // Return as-is if not valid date
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateStr;
    }
}

function showToast(msg, type = 'info') {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}</span>
        <span class="toast-msg">${sanitize(msg)}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function showResult(msg, isError) {
    const el = $('find-result');
    if (!el) return;
    
    el.innerHTML = `<span style="margin-right:8px;">${isError ? '⚠️' : '✅'}</span>${msg}`;
    el.className = `result-box show ${isError ? 'error' : 'success'}`;
    
    if (!isError) {
        setTimeout(() => el.classList.remove('show'), 8000);
    }
}

function updateTime() {
    const el = $('last-update');
    if (el) {
        if (STATE.lastUpdated) {
            el.textContent = `Updated: ${formatLastUpdated(STATE.lastUpdated)}`;
        } else {
            el.textContent = new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', minute: '2-digit' 
            });
        }
    }
}

// ==================== DATE/WEEK HELPERS ====================
function isSunday() {
    return new Date().getDay() === 0;
}

function getDaysUntilSunday() {
    const now = new Date();
    const day = now.getDay();
    return day === 0 ? 0 : 7 - day;
}

function getDisplayWeek(weeks, currentWeek) {
    if (!weeks || weeks.length === 0) return currentWeek;
    
    if (isSunday()) {
        const currentIndex = weeks.indexOf(currentWeek);
        if (currentIndex > 0) {
            return weeks[currentIndex - 1];
        } else if (currentIndex === 0 && weeks.length > 1) {
            return currentWeek;
        }
    }
    return currentWeek;
}

function isResultsDay() {
    return isSunday();
}

// ==================== API ====================
async function api(action, params = {}) {
    const url = new URL(CONFIG.API_URL);
    url.searchParams.set('action', action);
    
    Object.entries(params).forEach(([k, v]) => {
        if (v != null) {
            url.searchParams.set(k, typeof v === 'object' ? JSON.stringify(v) : v);
        }
    });
    
    console.log('📡 API:', action, params);
    
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        
        const text = await res.text();
        let data;
        
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            console.error('JSON Parse Error:', text.substring(0, 500));
            throw new Error('Invalid response from server');
        }
        
        console.log('✅ Response:', action, data);
        
        // Extract lastUpdated if present
        if (data.lastUpdated) {
            STATE.lastUpdated = data.lastUpdated;
            updateTime();
        }
        
        if (data.error) throw new Error(data.error);
        return data;
    } catch (e) {
        console.error('❌ API Error:', e);
        if (e.name === 'AbortError') {
            throw new Error('Request timed out. Please try again.');
        }
        throw e;
    }
}

// ==================== INITIALIZATION ====================
function initApp() {
    console.log('🚀 Starting BTS Spy Battle app...');
    
    loadAllAgents();
    
    const saved = localStorage.getItem('spyAgent');
    if (saved) {
        STATE.agentNo = saved;
        checkAdminStatus();
        loadDashboard();
        return;
    }
    
    setupLoginListeners();
}

function setupLoginListeners() {
    const loginBtn = $('login-btn');
    const findBtn = $('find-btn');
    const agentInput = $('agent-input');
    const instagramInput = $('instagram-input');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    
    if (findBtn) {
        findBtn.addEventListener('click', handleFind);
    }
    
    if (agentInput) {
        agentInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') handleLogin();
        });
        setTimeout(() => agentInput.focus(), 100);
    }
    
    if (instagramInput) {
        instagramInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') handleFind();
        });
    }
}

async function loadAllAgents() {
    try {
        const res = await api('getAllAgents');
        STATE.allAgents = res.agents || [];
        console.log(`📋 Loaded ${STATE.allAgents.length} agents for lookup`);
    } catch (e) {
        console.error('Failed to load agents:', e);
        STATE.allAgents = [];
    }
}

// ==================== LOGIN HANDLER ====================
async function handleLogin() {
    if (STATE.isLoading) return;
    
    const agentInput = $('agent-input');
    const agentNo = agentInput?.value.trim().toUpperCase();
    
    if (!agentNo) {
        showResult('Please enter your Agent Number', true);
        agentInput?.focus();
        return;
    }
    
    const loginBtn = $('login-btn');
    const originalText = loginBtn?.textContent;
    
    try {
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.textContent = 'Authenticating...';
        }
        loading(true);
        
        if (STATE.allAgents.length === 0) {
            await loadAllAgents();
        }
        
        const found = STATE.allAgents.find(a => 
            String(a.agentNo).trim().toUpperCase() === agentNo
        );
        
        if (!found) {
            showResult('Agent not found. Check your number or use "Find My Agent ID" below.', true);
            return;
        }
        
        localStorage.setItem('spyAgent', found.agentNo);
        STATE.agentNo = found.agentNo;
        
        checkAdminStatus();
        await loadDashboard();
        
    } catch (e) {
        showResult('Login failed: ' + e.message, true);
    } finally {
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.textContent = originalText || 'Login';
        }
        loading(false);
    }
}

// ==================== FIND AGENT HANDLER ====================
async function handleFind() {
    if (STATE.isLoading) return;
    
    const instagramInput = $('instagram-input');
    const instagram = instagramInput?.value.trim().toLowerCase().replace('@', '');
    
    if (!instagram) {
        showResult('Please enter your Instagram handle', true);
        instagramInput?.focus();
        return;
    }
    
    const findBtn = $('find-btn');
    const originalText = findBtn?.textContent;
    
    try {
        if (findBtn) {
            findBtn.disabled = true;
            findBtn.textContent = 'Searching...';
        }
        loading(true);
        
        if (STATE.allAgents.length === 0) {
            await loadAllAgents();
        }
        
        const found = STATE.allAgents.find(a => {
            const name = String(a.name || '').trim().toLowerCase().replace('@', '');
            return name === instagram || name.includes(instagram);
        });
        
        if (!found) {
            showResult(`No agent found with "@${instagram}". Please check spelling or contact admin.`, true);
            return;
        }
        
        showResult(`Found! Your Agent ID is: <strong>${found.agentNo}</strong> (Team ${found.team})`, false);
        
        const agentInput = $('agent-input');
        if (agentInput) {
            agentInput.value = found.agentNo;
            agentInput.focus();
        }
        
    } catch (e) {
        showResult('Search failed: ' + e.message, true);
    } finally {
        if (findBtn) {
            findBtn.disabled = false;
            findBtn.textContent = originalText || 'Find My ID';
        }
        loading(false);
    }
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
        console.log('🔓 Admin session restored');
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
    if (!isAdminAgent()) {
        showToast('Access denied. You are not authorized.', 'error');
        return;
    }
    
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'admin-modal';
    modal.innerHTML = `
        <div class="modal admin-modal">
            <div class="modal-header">
                <h3>🔐 Admin Access</h3>
                <button class="modal-close" onclick="closeAdminModal()">×</button>
            </div>
            <div class="modal-body">
                <div class="admin-welcome">
                    <p>Welcome, Agent ${STATE.agentNo}</p>
                    <p class="admin-note">Enter your admin password to access Mission Control.</p>
                </div>
                <div class="terminal-style">
                    <div class="terminal-line">> Authorization required...</div>
                    <div class="form-group">
                        <label class="terminal-label">> PASSWORD:</label>
                        <input type="password" id="admin-password" class="terminal-input form-input" 
                               placeholder="Enter admin password" autocomplete="off">
                    </div>
                    <div id="admin-error" class="admin-error"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button onclick="closeAdminModal()" class="btn-secondary">Cancel</button>
                <button onclick="verifyAdminPassword()" class="btn-primary" id="admin-verify-btn">
                    <span>Authenticate</span>
                    <span>🔓</span>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    setTimeout(() => {
        const pwInput = $('admin-password');
        if (pwInput) {
            pwInput.focus();
            pwInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') verifyAdminPassword();
            });
        }
    }, 100);
}

function closeAdminModal() {
    const modal = $('admin-modal');
    if (modal) {
        modal.classList.add('closing');
        setTimeout(() => modal.remove(), 300);
    }
}

async function verifyAdminPassword() {
    const passwordInput = $('admin-password');
    const password = passwordInput?.value;
    const errorEl = $('admin-error');
    const verifyBtn = $('admin-verify-btn');
    
    if (!password) {
        if (errorEl) {
            errorEl.textContent = '⚠️ Please enter your password';
            errorEl.classList.add('show');
        }
        return;
    }
    
    if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.innerHTML = '<span>Verifying...</span>';
    }
    
    try {
        let verified = false;
        
        try {
            const result = await api('verifyAdmin', {
                agentNo: STATE.agentNo,
                password: password
            });
            
            if (result.success) {
                verified = true;
                STATE.adminSession = result.sessionToken || generateSessionToken();
            }
        } catch (apiError) {
            console.log('Server verification not available, using client-side fallback');
            
            if (password === CONFIG.ADMIN_PASSWORD) {
                verified = true;
                STATE.adminSession = generateSessionToken();
            }
        }
        
        if (verified) {
            STATE.isAdmin = true;
            
            localStorage.setItem('adminSession', STATE.adminSession);
            localStorage.setItem('adminExpiry', String(Date.now() + (24 * 60 * 60 * 1000)));
            
            closeAdminModal();
            addAdminIndicator();
            showAdminPanel();
            
            showToast('Admin access granted!', 'success');
            console.log('🔓 Admin access granted');
        } else {
            if (errorEl) {
                errorEl.textContent = '❌ Invalid password';
                errorEl.classList.add('show');
            }
            if (passwordInput) {
                passwordInput.value = '';
                passwordInput.focus();
            }
        }
    } catch (e) {
        if (errorEl) {
            errorEl.textContent = '❌ Verification failed: ' + e.message;
            errorEl.classList.add('show');
        }
    } finally {
        if (verifyBtn) {
            verifyBtn.disabled = false;
            verifyBtn.innerHTML = '<span>Authenticate</span><span>🔓</span>';
        }
    }
}

function generateSessionToken() {
    return 'admin_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
}

function addAdminIndicator() {
    document.querySelector('.admin-indicator')?.remove();
    
    const indicator = document.createElement('div');
    indicator.className = 'admin-indicator';
    indicator.innerHTML = `
        <span class="admin-badge" onclick="showAdminPanel()" title="Open Admin Panel">
            🔐 ADMIN
        </span>
        <button class="admin-exit" onclick="exitAdminMode()" title="Exit Admin Mode">×</button>
    `;
    document.body.appendChild(indicator);
}

function exitAdminMode() {
    if (confirm('Exit admin mode?')) {
        STATE.isAdmin = false;
        STATE.adminSession = null;
        localStorage.removeItem('adminSession');
        localStorage.removeItem('adminExpiry');
        document.querySelector('.admin-indicator')?.remove();
        document.querySelector('.admin-panel')?.remove();
        showToast('Admin mode deactivated', 'info');
        console.log('🔒 Admin mode deactivated');
    }
}

// ==================== ADMIN PANEL ====================
function showAdminPanel() {
    if (!STATE.isAdmin) {
        showAdminLogin();
        return;
    }
    
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
            <button class="admin-tab" data-tab="active">Active (0)</button>
            <button class="admin-tab" data-tab="history">History</button>
        </div>
        
        <div class="admin-panel-content">
            <div id="admin-tab-create" class="admin-tab-content active">
                ${renderCreateMissionForm()}
            </div>
            <div id="admin-tab-active" class="admin-tab-content">
                <div class="loading-text">Loading...</div>
            </div>
            <div id="admin-tab-history" class="admin-tab-content">
                <div class="loading-text">Loading...</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    panel.querySelectorAll('.admin-tab').forEach(tab => {
        tab.onclick = () => switchAdminTab(tab.dataset.tab);
    });
    
    setupMissionFormListeners();
    loadActiveTeamMissions();
    loadMissionHistory();
}

function closeAdminPanel() {
    const panel = document.querySelector('.admin-panel');
    if (panel) {
        panel.classList.add('closing');
        setTimeout(() => panel.remove(), 300);
    }
}

function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
    
    document.querySelector(`.admin-tab[data-tab="${tabName}"]`)?.classList.add('active');
    $(`admin-tab-${tabName}`)?.classList.add('active');
}

function renderCreateMissionForm() {
    return `
        <div class="create-mission-form">
            <div class="form-section">
                <h4>📋 Mission Type</h4>
                <div class="mission-type-grid">
                    ${Object.entries(CONFIG.MISSION_TYPES).map(([key, m], i) => `
                        <div class="mission-type-option ${i === 0 ? 'selected' : ''}" 
                             data-type="${key}" onclick="selectMissionType('${key}')">
                            <span class="type-icon">${m.icon}</span>
                            <span class="type-name">${m.name}</span>
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
                            <span class="checkbox-custom"></span>
                            <span class="team-name">${team}</span>
                        </label>
                    `).join('')}
                </div>
                <label class="select-all-teams">
                    <input type="checkbox" id="all-teams" onchange="toggleAllTeams(this.checked)">
                    <span>All Teams (Alliance Mission)</span>
                </label>
            </div>
            
            <div class="form-section">
                <h4>📝 Mission Details</h4>
                
                <div class="form-group">
                    <label>Mission Title *</label>
                    <input type="text" id="mission-title" class="form-input" placeholder="e.g., Operation Moonlight">
                </div>
                
                <div class="form-group">
                    <label>Mission Briefing *</label>
                    <textarea id="mission-briefing" class="form-textarea" rows="3" 
                        placeholder="Describe the mission objective..."></textarea>
                </div>
                
                <div class="form-group">
                    <label>Target Track/Album</label>
                    <input type="text" id="target-track" class="form-input" placeholder="e.g., DSLYM">
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Goal Type</label>
                        <select id="goal-type" class="form-select">
                            <option value="combined_streams">Combined Streams</option>
                            <option value="each_agent_streams">Each Agent Streams X</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Target Number</label>
                        <input type="number" id="goal-target" class="form-input" value="100" min="1">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Deadline (Optional)</label>
                    <input type="datetime-local" id="mission-deadline" class="form-input">
                </div>
            </div>
            
            <div class="form-actions">
                <button onclick="createTeamMission()" class="btn-primary btn-large">
                    🚀 Deploy Mission
                </button>
            </div>
            
            <div id="create-result" class="create-result"></div>
        </div>
    `;
}

function selectMissionType(type) {
    document.querySelectorAll('.mission-type-option').forEach(el => {
        el.classList.remove('selected');
    });
    document.querySelector(`.mission-type-option[data-type="${type}"]`)?.classList.add('selected');
    $('selected-mission-type').value = type;
}

function toggleAllTeams(checked) {
    document.querySelectorAll('input[name="target-teams"]').forEach(cb => {
        cb.checked = checked;
    });
}

function setupMissionFormListeners() {
    // Add any needed listeners
}

async function createTeamMission() {
    const type = $('selected-mission-type')?.value;
    const title = $('mission-title')?.value.trim();
    const briefing = $('mission-briefing')?.value.trim();
    const targetTeams = Array.from(document.querySelectorAll('input[name="target-teams"]:checked')).map(cb => cb.value);
    const targetTrack = $('target-track')?.value.trim();
    const goalType = $('goal-type')?.value;
    const goalTarget = parseInt($('goal-target')?.value) || 100;
    const deadline = $('mission-deadline')?.value;
    
    if (!title) {
        showCreateResult('Please enter a mission title', true);
        return;
    }
    if (targetTeams.length === 0) {
        showCreateResult('Please select at least one team', true);
        return;
    }
    if (!briefing) {
        showCreateResult('Please enter mission briefing', true);
        return;
    }
    
    loading(true);
    
    try {
        const result = await api('createTeamMission', {
            type, 
            title, 
            briefing, 
            targetTeams: JSON.stringify(targetTeams), 
            targetTrack, 
            goalType, 
            goalTarget, 
            deadline,
            week: STATE.week,
            agentNo: STATE.agentNo,
            sessionToken: STATE.adminSession
        });
        
        if (result.success) {
            showCreateResult(`✅ Mission deployed! ID: ${result.missionId}`, false);
            
            $('mission-title').value = '';
            $('mission-briefing').value = '';
            $('target-track').value = '';
            document.querySelectorAll('input[name="target-teams"]').forEach(cb => cb.checked = false);
            $('all-teams').checked = false;
            
            loadActiveTeamMissions();
        } else {
            showCreateResult('❌ ' + (result.error || 'Failed to create mission'), true);
        }
    } catch (e) {
        showCreateResult('❌ Error: ' + e.message, true);
    } finally {
        loading(false);
    }
}

function showCreateResult(msg, isError) {
    const el = $('create-result');
    if (!el) return;
    el.textContent = msg;
    el.className = `create-result show ${isError ? 'error' : 'success'}`;
    if (!isError) {
        setTimeout(() => el.classList.remove('show'), 5000);
    }
}

async function loadActiveTeamMissions() {
    const container = $('admin-tab-active');
    if (!container) return;
    
    try {
        const result = await api('getTeamMissions', { status: 'active', week: STATE.week });
        const missions = result.missions || [];
        
        const tab = document.querySelector('.admin-tab[data-tab="active"]');
        if (tab) tab.textContent = `Active (${missions.length})`;
        
        if (missions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">📭</span>
                    <p>No active missions</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = missions.map(m => `
            <div class="admin-mission-card">
                <div class="amc-header">
                    <span>${CONFIG.MISSION_TYPES[m.type]?.icon || '📋'} ${sanitize(m.title)}</span>
                    <span class="amc-id">${m.id}</span>
                </div>
                <div class="amc-teams">${(m.targetTeams || []).join(', ')}</div>
                <div class="amc-actions">
                    <button onclick="adminCompleteMission('${m.id}')" class="btn-sm btn-success">Complete</button>
                    <button onclick="adminCancelMission('${m.id}')" class="btn-sm btn-danger">Cancel</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = `<div class="error-state">Failed to load: ${e.message}</div>`;
    }
}

async function adminCompleteMission(missionId) {
    const team = prompt('Enter team name to mark as complete:');
    if (!team || !CONFIG.TEAMS[team]) {
        if (team) alert('Invalid team name');
        return;
    }
    
    loading(true);
    try {
        const result = await api('completeTeamMission', { 
            missionId, 
            team,
            agentNo: STATE.agentNo,
            sessionToken: STATE.adminSession
        });
        if (result.success) {
            showToast(`${team} completed mission! +${result.xpAwarded || 5} XP`, 'success');
            loadActiveTeamMissions();
        } else {
            alert('Failed: ' + (result.error || 'Unknown error'));
        }
    } catch (e) {
        alert('Error: ' + e.message);
    } finally {
        loading(false);
    }
}

async function adminCancelMission(missionId) {
    if (!confirm('Cancel this mission?')) return;
    
    loading(true);
    try {
        await api('cancelTeamMission', { 
            missionId,
            agentNo: STATE.agentNo,
            sessionToken: STATE.adminSession
        });
        loadActiveTeamMissions();
        showToast('Mission cancelled', 'info');
    } catch (e) {
        alert('Error: ' + e.message);
    } finally {
        loading(false);
    }
}

async function loadMissionHistory() {
    const container = $('admin-tab-history');
    if (!container) return;
    
    try {
        const result = await api('getTeamMissions', { status: 'all' });
        const missions = (result.missions || []).filter(m => m.status !== 'active');
        
        if (missions.length === 0) {
            container.innerHTML = `<div class="empty-state"><span class="empty-icon">📜</span><p>No history yet</p></div>`;
            return;
        }
        
        container.innerHTML = `
            <div class="history-list">
                ${missions.map(m => `
                    <div class="history-item ${m.status}">
                        <span>${sanitize(m.title)}</span>
                        <span class="status-badge">${m.status}</span>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="error-state">Failed: ${e.message}</div>`;
    }
}

// ==================== DASHBOARD ====================
async function loadDashboard() {
    console.log('🏠 Loading dashboard...');
    loading(true);
    
    try {
        const weeksRes = await api('getAvailableWeeks');
        STATE.weeks = weeksRes.weeks || [];
        STATE.week = weeksRes.current || STATE.weeks[0];
        STATE.displayWeek = getDisplayWeek(STATE.weeks, STATE.week);
        
        if (!STATE.week) throw new Error('No weeks available');
        
        console.log(`📅 Current week: ${STATE.week}, Display week: ${STATE.displayWeek}, Is Sunday: ${isSunday()}`);
        
        STATE.data = await api('getAgentData', {
            agentNo: STATE.agentNo,
            week: STATE.week
        });
        
        // Store lastUpdated from agent data
        if (STATE.data?.lastUpdated) {
            STATE.lastUpdated = STATE.data.lastUpdated;
        }
        
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
        
        if (STATE.isAdmin) {
            addAdminIndicator();
        }
        
    } catch (e) {
        console.error('Dashboard error:', e);
        showToast('Failed to load: ' + e.message, 'error');
        logout();
    } finally {
        loading(false);
    }
}

function setupDashboard() {
    const p = STATE.data?.profile;
    
    if (p) {
        const color = teamColor(p.team);
        const pfp = teamPfp(p.team);
        const initial = (p.name || 'A')[0].toUpperCase();
        
        const avatar = $('agent-avatar');
        if (avatar) {
            if (pfp) {
                avatar.innerHTML = `<img src="${pfp}" alt="${p.team}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
            } else {
                avatar.textContent = initial;
                avatar.style.background = color;
            }
        }
        
        if ($('agent-name')) $('agent-name').textContent = p.name || 'Agent';
        if ($('agent-team')) {
            $('agent-team').textContent = p.team || 'Team';
            $('agent-team').style.color = color;
        }
        if ($('agent-id')) $('agent-id').textContent = 'ID: ' + STATE.agentNo;
        
        const pAvatar = $('profile-avatar');
        if (pAvatar) {
            if (pfp) {
                pAvatar.innerHTML = `<img src="${pfp}" alt="${p.team}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
            } else {
                pAvatar.textContent = initial;
                pAvatar.style.background = color;
            }
        }
        if ($('profile-name')) $('profile-name').textContent = p.name || 'Agent';
        if ($('profile-team')) {
            $('profile-team').textContent = p.team || 'Team';
            $('profile-team').style.color = color;
        }
        if ($('profile-id')) $('profile-id').textContent = 'Agent ID: ' + STATE.agentNo;
    }
    
    const select = $('week-select');
    if (select && STATE.weeks.length) {
        select.innerHTML = STATE.weeks.map(w => 
            `<option value="${w}" ${w === STATE.week ? 'selected' : ''}>${w}</option>`
        ).join('');
        
        select.onchange = async () => {
            const previousWeek = STATE.week;
            loading(true);
            try {
                STATE.data = await api('getAgentData', {
                    agentNo: STATE.agentNo,
                    week: select.value
                });
                STATE.week = select.value;
                STATE.displayWeek = getDisplayWeek(STATE.weeks, STATE.week);
                
                if (STATE.data?.lastUpdated) {
                    STATE.lastUpdated = STATE.data.lastUpdated;
                    updateTime();
                }
                
                await loadPage(STATE.page);
            } catch (e) {
                select.value = previousWeek;
                showToast('Failed to load week', 'error');
            } finally {
                loading(false);
            }
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
    
    if (isAdminAgent()) {
        addAdminNavLink();
    }
    
    $('menu-btn')?.addEventListener('click', () => $('sidebar')?.classList.add('open'));
    $('close-sidebar')?.addEventListener('click', closeSidebar);
    $('logout-btn')?.addEventListener('click', logout);
    
    updateTime();
    setInterval(updateTime, 60000);
}

function addAdminNavLink() {
    const nav = document.querySelector('.nav-links');
    if (!nav || nav.querySelector('.admin-nav-link')) return;
    
    const link = document.createElement('a');
    link.href = '#';
    link.className = 'nav-link admin-nav-link';
    link.innerHTML = '<span class="nav-icon">🎛️</span><span>Admin</span>';
    link.onclick = (e) => {
        e.preventDefault();
        if (STATE.isAdmin) {
            showAdminPanel();
        } else {
            showAdminLogin();
        }
        closeSidebar();
    };
    nav.appendChild(link);
}

function closeSidebar() {
    $('sidebar')?.classList.remove('open');
}

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
    console.log('📄 Loading:', page);
    STATE.page = page;
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
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
            case 'team-charts': await renderTeamCharts(); break;
            case 'agent-charts': await renderAgentCharts(); break;
            case 'comparison': await renderComparison(); break;
            case 'summary': await renderSummary(); break;
            case 'drawer': await renderDrawer(); break;
            case 'announcements': await renderAnnouncements(); break;
            case 'secret-missions': await renderSecretMissions(); break;
            default:
                console.warn('Unknown page:', page);
        }
    } catch (e) {
        console.error('Page error:', e);
        if (el) {
            el.innerHTML = `
                <div class="error-page">
                    <div class="error-icon">⚠️</div>
                    <h3>Failed to load ${page}</h3>
                    <p>${sanitize(e.message)}</p>
                    <button onclick="loadPage('${page}')" class="btn-primary">Retry</button>
                </div>
            `;
        }
    } finally {
        loading(false);
    }
}

// ==================== HOME PAGE ====================
async function renderHome() {
    const weekToShow = isResultsDay() ? STATE.displayWeek : STATE.week;
    const weekDisplay = $('current-week');
    if (weekDisplay) {
        weekDisplay.textContent = `Week: ${weekToShow}${isResultsDay() ? ' (Results)' : ''}`;
    }
    
    try {
        const [summary, rankings, goals] = await Promise.all([
            api('getWeeklySummary', { week: weekToShow }),
            api('getRankings', { week: weekToShow, limit: 5 }),
            api('getGoalsProgress', { week: weekToShow })
        ]);
        
        // Update lastUpdated from any response that has it
        if (summary.lastUpdated) {
            STATE.lastUpdated = summary.lastUpdated;
            updateTime();
        }
        
        const team = STATE.data?.profile?.team;
        const teamData = summary.teams?.[team] || {};
        const myStats = STATE.data?.stats || {};
        const sunday = isResultsDay();
        const daysLeft = getDaysUntilSunday();
        
        // Quick Stats Card
        const quickStatsEl = document.querySelector('.quick-stats-section');
        if (quickStatsEl) {
            quickStatsEl.innerHTML = `
                <div class="card quick-stats-card" style="border-color:${teamColor(team)}40;background:linear-gradient(135deg, ${teamColor(team)}11, var(--bg-card));">
                    <div class="card-body">
                        <div class="quick-header">
                            ${teamPfp(team) ? `<img src="${teamPfp(team)}" class="quick-pfp" style="border-color:${teamColor(team)}">` : ''}
                            <div class="quick-info">
                                <div class="quick-name">Welcome, ${sanitize(STATE.data?.profile?.name)}!</div>
                                <div class="quick-team" style="color:${teamColor(team)}">Team ${team} • Rank #${STATE.data?.rank || 'N/A'}</div>
                            </div>
                        </div>
                        
                        <div class="quick-stats-grid">
                            <div class="quick-stat">
                                <div class="quick-stat-value">${fmt(myStats.totalXP)}</div>
                                <div class="quick-stat-label">XP</div>
                            </div>
                            <div class="quick-stat">
                                <div class="quick-stat-value">${fmt(myStats.trackScrobbles || 0)}</div>
                                <div class="quick-stat-label">Tracks</div>
                            </div>
                            <div class="quick-stat">
                                <div class="quick-stat-value">${fmt(myStats.albumScrobbles || 0)}</div>
                                <div class="quick-stat-label">Albums</div>
                            </div>
                        </div>
                        
                        <div class="battle-timer ${sunday ? 'ended' : ''}">
                            ${sunday ? '🏆 Results Are In!' : `⏰ ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
                        </div>
                        
                        ${STATE.lastUpdated ? `<div class="last-updated-mini">Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}
                    </div>
                </div>
            `;
        }
        
        // Get track and album goals for this team
        const trackGoals = goals.trackGoals || {};
        const albumGoals = goals.albumGoals || {};
        
        const trackGoalsList = Object.entries(trackGoals).map(([trackName, info]) => {
            const tp = info.teams?.[team] || {};
            const current = tp.current || 0;
            const goal = info.goal || 0;
            const done = tp.status === 'Completed' || current >= goal;
            const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
            
            return { name: trackName, current, goal, done, pct };
        });
        
        const albumGoalsList = Object.entries(albumGoals).map(([albumName, info]) => {
            const ap = info.teams?.[team] || {};
            const current = ap.current || 0;
            const goal = info.goal || 0;
            const done = ap.status === 'Completed' || current >= goal;
            const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
            
            return { name: albumName, current, goal, done, pct };
        });
        
        const album2xStatus = STATE.data?.album2xStatus || {};
        const teamTracks = CONFIG.TEAM_ALBUM_TRACKS[team] || [];
        const userTracksFor2x = album2xStatus.tracks || {};
        const tracksCompleted2x = teamTracks.filter(t => (userTracksFor2x[t] || 0) >= 2).length;
        const albumName2x = CONFIG.TEAMS[team]?.album || team;

        const missionCardsContainer = document.querySelector('.missions-grid');
        if (missionCardsContainer) {
            missionCardsContainer.innerHTML = `
                <!-- Track Goals Card -->
                <div class="mission-card expanded" onclick="loadPage('goals')">
                    <div class="mission-icon">🎵</div>
                    <h3>Track Goals</h3>
                    <div class="mission-status ${teamData.trackGoalPassed ? 'complete' : ''}">
                        ${teamData.trackGoalPassed ? '✅ Complete' : '⏳ In Progress'}
                    </div>
                    <div class="goals-list">
                        ${trackGoalsList.length ? trackGoalsList.map(g => `
                            <div class="goal-mini ${g.done ? 'done' : ''}">
                                <span class="goal-name" title="${sanitize(g.name)}">${sanitize(g.name.length > 25 ? g.name.substring(0, 22) + '...' : g.name)}</span>
                                <span class="goal-progress">${fmt(g.current)}/${fmt(g.goal)} ${g.done ? '✅' : ''}</span>
                            </div>
                        `).join('') : '<p class="no-goals">No track goals set</p>'}
                    </div>
                </div>
                
                <!-- Album Goals Card -->
                <div class="mission-card expanded" onclick="loadPage('goals')">
                    <div class="mission-icon">💿</div>
                    <h3>Album Goals</h3>
                    <div class="mission-status ${teamData.albumGoalPassed ? 'complete' : ''}">
                        ${teamData.albumGoalPassed ? '✅ Complete' : '⏳ In Progress'}
                    </div>
                    <div class="goals-list">
                        ${albumGoalsList.length ? albumGoalsList.map(g => `
                            <div class="goal-mini ${g.done ? 'done' : ''}">
                                <span class="goal-name" title="${sanitize(g.name)}">${sanitize(g.name.length > 25 ? g.name.substring(0, 22) + '...' : g.name)}</span>
                                <span class="goal-progress">${fmt(g.current)}/${fmt(g.goal)} ${g.done ? '✅' : ''}</span>
                            </div>
                        `).join('') : '<p class="no-goals">No album goals set</p>'}
                    </div>
                </div>
                
                <!-- Album 2X Card -->
                <div class="mission-card" onclick="loadPage('album2x')">
                    <div class="mission-icon">✨</div>
                    <h3>Album 2X</h3>
                    <div class="mission-subtitle">${sanitize(albumName2x)}</div>
                    <div class="mission-status ${album2xStatus.passed ? 'complete' : ''}">
                        ${album2xStatus.passed ? '✅ Complete' : '⏳ In Progress'}
                    </div>
                    <div class="mission-progress">
                        <div class="progress-bar">
                            <div class="progress-fill ${album2xStatus.passed ? 'complete' : ''}" 
                                 style="width:${teamTracks.length ? (tracksCompleted2x/teamTracks.length*100) : 0}%">
                            </div>
                        </div>
                        <span>${tracksCompleted2x}/${teamTracks.length} tracks</span>
                    </div>
                </div>
                
                <!-- Secret Missions Card -->
                <div class="mission-card secret" onclick="loadPage('secret-missions')">
                    <div class="mission-icon">🔒</div>
                    <h3>Secret Missions</h3>
                    <div class="mission-status">🕵️ Classified</div>
                    <div class="mission-hint">Tap to view team missions</div>
                </div>
            `;
        }
        
        // Top Agents
        const rankList = rankings.rankings || [];
        const topAgentsEl = $('home-top-agents');
        if (topAgentsEl) {
            topAgentsEl.innerHTML = rankList.length ? rankList.slice(0, 5).map((r, i) => {
                const isMe = String(r.agentNo) === String(STATE.agentNo);
                return `
                    <div class="rank-item ${isMe ? 'highlight' : ''}" onclick="loadPage('rankings')">
                        <div class="rank-num">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</div>
                        <div class="rank-info">
                            <div class="rank-name">${sanitize(r.name)}${isMe ? ' (You)' : ''}</div>
                            <div class="rank-team" style="color:${teamColor(r.team)}">${r.team}</div>
                        </div>
                        <div class="rank-xp">${fmt(r.totalXP)} XP</div>
                    </div>
                `;
            }).join('') : '<p class="empty-text">No data</p>';
        }
        
        // Team Standings
        const teams = summary.teams || {};
        const sortedTeams = Object.keys(teams).sort((a, b) => (teams[b].teamXP || 0) - (teams[a].teamXP || 0));
        
        const standingsEl = $('home-standings');
        if (standingsEl) {
            standingsEl.innerHTML = sortedTeams.length ? `
                <div class="standings-header">
                    <span class="standings-badge ${sunday ? 'final' : ''}">${sunday ? '🏆 Final Results' : '⏳ Live Battle'}</span>
                </div>
                ${sortedTeams.map((t, i) => {
                    const td = teams[t];
                    const isMyTeam = t === team;
                    const showTrophy = sunday && i === 0;
                    
                    return `
                        <div class="standing-item ${isMyTeam ? 'my-team' : ''}" onclick="loadPage('team-level')" style="--team-color:${teamColor(t)}">
                            <div class="standing-rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</div>
                            ${teamPfp(t) ? `<img src="${teamPfp(t)}" class="standing-pfp">` : ''}
                            <div class="standing-info">
                                <div class="standing-name" style="color:${teamColor(t)}">${t}${isMyTeam ? ' ⭐' : ''}${showTrophy ? ' 🏆' : ''}</div>
                                <div class="standing-xp">${fmt(td.teamXP)} XP</div>
                            </div>
                            <div class="standing-missions">
                                ${td.trackGoalPassed ? '🎵✅' : '🎵❌'}
                                ${td.albumGoalPassed ? '💿✅' : '💿❌'}
                                ${td.album2xPassed ? '✨✅' : '✨❌'}
                            </div>
                        </div>
                    `;
                }).join('')}
            ` : '<p class="empty-text">No data</p>';
        }
        
    } catch (e) {
        console.error('Home error:', e);
        showToast('Failed to load home data', 'error');
    }
}

// ==================== PROFILE PAGE ====================
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
        Object.entries(trackContributions).sort((a, b) => b[1] - a[1]).map(([t, c]) => `
            <div class="contrib-item"><span>${sanitize(t)}</span><span>${fmt(c)}</span></div>
        `).join('') : '<p class="empty-text">No track data</p>';
    
    $('profile-albums').innerHTML = Object.keys(albumContributions).length ?
        Object.entries(albumContributions).sort((a, b) => b[1] - a[1]).map(([a, c]) => `
            <div class="contrib-item"><span>${sanitize(a)}</span><span>${fmt(c)}</span></div>
        `).join('') : '<p class="empty-text">No album data</p>';
    
    try {
        const badgesData = await api('getBadges', { agentNo: STATE.agentNo });
        $('profile-badges').innerHTML = (badgesData.badges || []).length ? 
            `<div class="badges-grid">${badgesData.badges.map(b => `
                <div class="badge-item">
                    <div class="badge-icon">${b.imageUrl ? `<img src="${b.imageUrl}">` : '🎖️'}</div>
                    <div class="badge-name">${sanitize(b.name)}</div>
                </div>
            `).join('')}</div>` : '<p class="empty-text">No badges yet</p>';
    } catch (e) {
        $('profile-badges').innerHTML = '<p class="empty-text">No badges</p>';
    }
}

// ==================== RANKINGS PAGE ====================
async function renderRankings() {
    try {
        const data = await api('getRankings', { week: STATE.week, limit: 100 });
        
        if (data.lastUpdated) {
            STATE.lastUpdated = data.lastUpdated;
        }
        
        const rankingsHtml = (data.rankings || []).map((r, i) => {
            const isMe = String(r.agentNo) === String(STATE.agentNo);
            return `
                <div class="rank-item ${isMe ? 'highlight' : ''}">
                    <div class="rank-num">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</div>
                    <div class="rank-info">
                        <div class="rank-name">${sanitize(r.name)}${isMe ? ' (You)' : ''}</div>
                        <div class="rank-team" style="color:${teamColor(r.team)}">${r.team}</div>
                    </div>
                    <div class="rank-xp">${fmt(r.totalXP)} XP</div>
                </div>
            `;
        }).join('') || '<p class="empty-text">No data</p>';
        
        $('rankings-list').innerHTML = `
            ${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Data updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}
            ${rankingsHtml}
        `;
    } catch (e) {
        $('rankings-list').innerHTML = '<p class="error-text">Failed to load rankings</p>';
    }
}

// ==================== GOALS PAGE ====================
async function renderGoals() {
    const container = $('goals-content');
    const team = STATE.data?.profile?.team;
    
    try {
        const data = await api('getGoalsProgress', { week: STATE.week });
        
        if (data.lastUpdated) {
            STATE.lastUpdated = data.lastUpdated;
        }
        
        let html = `<div class="last-updated-banner">📊 Data updated: ${formatLastUpdated(STATE.lastUpdated || 'recently')}</div>`;
        
        // Track Goals
        const trackGoals = data.trackGoals || {};
        if (Object.keys(trackGoals).length) {
            html += `
                <div class="card">
                    <div class="card-header">
                        <h3>🎵 Track Goals</h3>
                        <span class="team-badge" style="background:${teamColor(team)}22;color:${teamColor(team)}">${team}</span>
                    </div>
                    <div class="card-body">
            `;
            
            for (const [track, info] of Object.entries(trackGoals)) {
                const tp = info.teams?.[team] || {};
                const current = tp.current || 0;
                const goal = info.goal || 0;
                const done = tp.status === 'Completed' || current >= goal;
                const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
                
                html += `
                    <div class="goal-item ${done ? 'completed' : ''}">
                        <div class="goal-header">
                            <span class="goal-name">${sanitize(track)}</span>
                            <span class="goal-status ${done ? 'complete' : ''}">${fmt(current)}/${fmt(goal)} ${done ? '✅' : ''}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${done ? 'complete' : ''}" style="width:${pct}%"></div>
                        </div>
                    </div>
                `;
            }
            html += '</div></div>';
        }
        
        // Album Goals
        const albumGoals = data.albumGoals || {};
        if (Object.keys(albumGoals).length) {
            html += `
                <div class="card">
                    <div class="card-header">
                        <h3>💿 Album Goals</h3>
                        <span class="team-badge" style="background:${teamColor(team)}22;color:${teamColor(team)}">${team}</span>
                    </div>
                    <div class="card-body">
            `;
            
            for (const [album, info] of Object.entries(albumGoals)) {
                const ap = info.teams?.[team] || {};
                const current = ap.current || 0;
                const goal = info.goal || 0;
                const done = ap.status === 'Completed' || current >= goal;
                const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
                
                html += `
                    <div class="goal-item ${done ? 'completed' : ''}">
                        <div class="goal-header">
                            <span class="goal-name">${sanitize(album)}</span>
                            <span class="goal-status ${done ? 'complete' : ''}">${fmt(current)}/${fmt(goal)} ${done ? '✅' : ''}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${done ? 'complete' : ''}" style="width:${pct}%"></div>
                        </div>
                    </div>
                `;
            }
            html += '</div></div>';
        }
        
        container.innerHTML = html || '<div class="card"><div class="card-body"><p class="empty-text">No goals set for this week</p></div></div>';
    } catch (e) {
        console.error('Goals error:', e);
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load goals</p></div></div>';
    }
}

// ==================== ALBUM 2X PAGE ====================
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
    
    container.innerHTML = `
        <div class="card" style="border-color:${allComplete ? 'var(--success)' : teamColor(team)}">
            <div class="card-body" style="text-align:center;padding:30px;">
                <div style="font-size:56px;margin-bottom:16px;">${allComplete ? '🎉' : '⏳'}</div>
                ${teamPfp(team) ? `<img src="${teamPfp(team)}" style="width:80px;height:80px;border-radius:50%;border:3px solid ${teamColor(team)};margin:16px auto;">` : ''}
                <h2 style="color:${teamColor(team)};margin-bottom:8px;">${sanitize(albumName)}</h2>
                <p style="color:var(--text-dim);margin-bottom:20px;">Stream every track at least 2 times</p>
                <div style="font-size:48px;font-weight:700;color:${allComplete ? 'var(--success)' : 'var(--purple-glow)'}">${completedCount}/${trackResults.length}</div>
                <p style="color:var(--text-dim);">Tracks completed</p>
                <div class="progress-bar" style="margin:20px auto;max-width:300px;height:12px;">
                    <div class="progress-fill ${allComplete ? 'complete' : ''}" style="width:${pct}%;background:${allComplete ? 'var(--success)' : teamColor(team)}"></div>
                </div>
                <p style="color:${allComplete ? 'var(--success)' : teamColor(team)};font-weight:600;">${allComplete ? '🎊 Challenge Complete!' : `${pct}% Progress`}</p>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3>📋 Track Checklist</h3>
            </div>
            <div class="card-body">
                ${trackResults.map((t, i) => `
                    <div class="track-item ${t.passed ? 'passed' : 'pending'}" style="border-left-color:${t.passed ? 'var(--success)' : 'var(--danger)'}">
                        <span class="track-num">${i + 1}</span>
                        <span class="track-name">${sanitize(t.name)}</span>
                        <span class="track-status ${t.passed ? 'pass' : 'fail'}">
                            ${t.count}/2 ${t.passed ? '✅' : '❌'}
                        </span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ==================== TEAM LEVEL PAGE ====================
async function renderTeamLevel() {
    const container = $('team-level-content');
    const weekToShow = isResultsDay() ? STATE.displayWeek : STATE.week;
    
    try {
        const summary = await api('getWeeklySummary', { week: weekToShow });
        const teams = summary.teams || {};
        const myTeam = STATE.data?.profile?.team;
        
        if (summary.lastUpdated) {
            STATE.lastUpdated = summary.lastUpdated;
        }
        
        const sortedTeams = Object.entries(teams).sort((a, b) => (b[1].teamXP || 0) - (a[1].teamXP || 0));
        
        container.innerHTML = `
            <div class="team-level-header">
                <h2>Team Levels</h2>
                <span class="week-badge">${weekToShow}${isResultsDay() ? ' (Final)' : ''}</span>
            </div>
            
            ${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}
            
            <div class="team-level-grid">
                ${sortedTeams.map(([t, info], index) => {
                    const isMyTeam = t === myTeam;
                    const missions = (info.trackGoalPassed ? 1 : 0) + (info.albumGoalPassed ? 1 : 0) + (info.album2xPassed ? 1 : 0);
                    const isWinner = index === 0 && isResultsDay();
                    
                    return `
                        <div class="team-level-card ${isMyTeam ? 'my-team' : ''} ${isWinner ? 'winner' : ''}" style="border-color:${teamColor(t)}">
                            ${isMyTeam ? '<div class="my-team-badge">Your Team</div>' : ''}
                            ${isWinner ? '<div class="winner-badge">🏆 Winner</div>' : ''}
                            ${teamPfp(t) ? `<img src="${teamPfp(t)}" class="team-level-pfp" style="border-color:${teamColor(t)}">` : ''}
                            <div class="team-level-name" style="color:${teamColor(t)}">${t}</div>
                            <div class="team-level-num">${info.level || 1}</div>
                            <div class="team-level-label">LEVEL</div>
                            <div class="team-level-xp">${fmt(info.teamXP)} XP</div>
                            <div class="team-level-missions">
                                <div class="mission-check" title="Track Goals">${info.trackGoalPassed ? '🎵✅' : '🎵❌'}</div>
                                <div class="mission-check" title="Album Goals">${info.albumGoalPassed ? '💿✅' : '💿❌'}</div>
                                <div class="mission-check" title="Album 2X">${info.album2xPassed ? '✨✅' : '✨❌'}</div>
                            </div>
                            <div class="team-level-status ${missions === 3 ? 'complete' : ''}">${missions}/3 missions</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } catch (e) {
        console.error('Team level error:', e);
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load team levels</p></div></div>';
    }
}

// ==================== COMPARISON PAGE ====================
async function renderComparison() {
    const container = $('comparison-content');
    if (!container) return;
    
    const weekToShow = isResultsDay() ? STATE.displayWeek : STATE.week;
    
    try {
        const [comparison, goals, summary] = await Promise.all([
            api('getTeamComparison', { week: weekToShow }),
            api('getGoalsProgress', { week: weekToShow }),
            api('getWeeklySummary', { week: weekToShow })
        ]);
        
        if (comparison.lastUpdated) {
            STATE.lastUpdated = comparison.lastUpdated;
        }
        
        const teams = (comparison.comparison || []).sort((a, b) => (b.teamXP || 0) - (a.teamXP || 0));
        const maxXP = teams[0]?.teamXP || 1;
        const trackGoals = goals.trackGoals || {};
        const albumGoals = goals.albumGoals || {};
        const teamNames = Object.keys(CONFIG.TEAMS);
        
        container.innerHTML = `
            ${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}
            
            <!-- XP Standings -->
            <div class="card">
                <div class="card-header">
                    <h3>⚔️ Battle Standings</h3>
                    <span class="week-badge">${weekToShow}</span>
                </div>
                <div class="card-body">
                    ${teams.map((t, i) => `
                        <div class="comparison-item">
                            <span class="comparison-rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
                            ${teamPfp(t.team) ? `<img src="${teamPfp(t.team)}" class="comparison-pfp">` : ''}
                            <span class="comparison-name" style="color:${teamColor(t.team)}">${t.team}</span>
                            <div class="comparison-bar-container">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width:${(t.teamXP/maxXP)*100}%;background:${teamColor(t.team)}"></div>
                                </div>
                            </div>
                            <span class="comparison-xp">${fmt(t.teamXP)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Track Goals Progress by Team -->
            <div class="card">
                <div class="card-header">
                    <h3>🎵 Track Goals Progress</h3>
                </div>
                <div class="card-body comparison-goals-section">
                    ${Object.keys(trackGoals).length ? Object.entries(trackGoals).map(([trackName, info]) => {
                        const goal = info.goal || 0;
                        
                        return `
                            <div class="goal-comparison-block">
                                <div class="goal-comparison-header">
                                    <span class="goal-track-name">🎵 ${sanitize(trackName)}</span>
                                    <span class="goal-target">Goal: ${fmt(goal)}</span>
                                </div>
                                <div class="goal-team-progress">
                                    ${teamNames.map(teamName => {
                                        const tp = info.teams?.[teamName] || {};
                                        const current = tp.current || 0;
                                        const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
                                        const done = current >= goal;
                                        
                                        return `
                                            <div class="team-progress-row ${done ? 'complete' : ''}">
                                                <span class="team-name-small" style="color:${teamColor(teamName)}">${teamName}</span>
                                                <div class="progress-bar-small">
                                                    <div class="progress-fill ${done ? 'complete' : ''}" 
                                                         style="width:${pct}%;background:${teamColor(teamName)}"></div>
                                                </div>
                                                <span class="progress-text">${fmt(current)}/${fmt(goal)} ${done ? '✅' : ''}</span>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    }).join('') : '<p class="empty-text">No track goals set</p>'}
                </div>
            </div>
            
            <!-- Album Goals Progress by Team -->
            <div class="card">
                <div class="card-header">
                    <h3>💿 Album Goals Progress</h3>
                </div>
                <div class="card-body comparison-goals-section">
                    ${Object.keys(albumGoals).length ? Object.entries(albumGoals).map(([albumName, info]) => {
                        const goal = info.goal || 0;
                        
                        return `
                            <div class="goal-comparison-block">
                                <div class="goal-comparison-header">
                                    <span class="goal-track-name">💿 ${sanitize(albumName)}</span>
                                    <span class="goal-target">Goal: ${fmt(goal)}</span>
                                </div>
                                <div class="goal-team-progress">
                                    ${teamNames.map(teamName => {
                                        const ap = info.teams?.[teamName] || {};
                                        const current = ap.current || 0;
                                        const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
                                        const done = current >= goal;
                                        
                                        return `
                                            <div class="team-progress-row ${done ? 'complete' : ''}">
                                                <span class="team-name-small" style="color:${teamColor(teamName)}">${teamName}</span>
                                                <div class="progress-bar-small">
                                                    <div class="progress-fill ${done ? 'complete' : ''}" 
                                                         style="width:${pct}%;background:${teamColor(teamName)}"></div>
                                                </div>
                                                <span class="progress-text">${fmt(current)}/${fmt(goal)} ${done ? '✅' : ''}</span>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    }).join('') : '<p class="empty-text">No album goals set</p>'}
                </div>
            </div>
            
            <!-- Mission Status Table -->
            <div class="card">
                <div class="card-header">
                    <h3>📊 Mission Status Overview</h3>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="comparison-table">
                            <thead>
                                <tr>
                                    <th>Team</th>
                                    <th>Level</th>
                                    <th>XP</th>
                                    <th>🎵 Tracks</th>
                                    <th>💿 Albums</th>
                                    <th>✨ 2X</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${teams.map(t => {
                                    const summaryTeam = summary.teams?.[t.team] || {};
                                    return `
                                        <tr>
                                            <td style="color:${teamColor(t.team)};font-weight:600;">${t.team}</td>
                                            <td>${t.level || summaryTeam.level || 1}</td>
                                            <td>${fmt(t.teamXP)}</td>
                                            <td>${summaryTeam.trackGoalPassed || t.missions?.tracks ? '✅' : '❌'}</td>
                                            <td>${summaryTeam.albumGoalPassed || t.missions?.albums ? '✅' : '❌'}</td>
                                            <td>${summaryTeam.album2xPassed || t.missions?.album2x ? '✅' : '❌'}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } catch (e) {
        console.error('Comparison error:', e);
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load comparison data</p></div></div>';
    }
}

// ==================== SUMMARY PAGE ====================
async function renderSummary() {
    const container = $('summary-content');
    
    const weekToShow = isResultsDay() ? STATE.displayWeek : STATE.week;
    
    if (!isResultsDay()) {
        const days = getDaysUntilSunday();
        container.innerHTML = `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:60px 20px;">
                    <div style="font-size:64px;margin-bottom:20px;">🔒</div>
                    <h2>Summary Locked</h2>
                    <p style="color:var(--text-dim);margin:16px 0;">Final results revealed every Sunday!</p>
                    <div class="countdown-box">
                        <div class="countdown-value">${days}</div>
                        <div class="countdown-label">day${days !== 1 ? 's' : ''} until results</div>
                    </div>
                    <p style="margin-top:20px;font-size:14px;color:var(--text-dim);">
                        Current battle: <strong>${STATE.week}</strong>
                    </p>
                </div>
            </div>
        `;
        return;
    }
    
    try {
        const [summary, winners] = await Promise.all([
            api('getWeeklySummary', { week: weekToShow }),
            api('getWeeklyWinners').catch(() => ({ winners: [] }))
        ]);
        
        if (summary.lastUpdated) {
            STATE.lastUpdated = summary.lastUpdated;
        }
        
        const teams = summary.teams || {};
        const winner = summary.winner;
        const sorted = Object.entries(teams).sort((a, b) => (b[1].teamXP || 0) - (a[1].teamXP || 0));
        
        const actualWinner = sorted[0]?.[0] || winner;
        
        container.innerHTML = `
            <div class="summary-week-header">
                <h2>📊 ${weekToShow} Results</h2>
                <p class="results-date">Battle concluded - Final standings</p>
            </div>
            
            ${actualWinner ? `
                <div class="card winner-card" style="border-color:${teamColor(actualWinner)}">
                    <div class="card-body" style="text-align:center;padding:40px;">
                        <div style="font-size:64px;margin-bottom:16px;">🏆</div>
                        ${teamPfp(actualWinner) ? `<img src="${teamPfp(actualWinner)}" style="width:100px;height:100px;border-radius:50%;border:4px solid ${teamColor(actualWinner)};margin-bottom:16px;">` : ''}
                        <h2 style="color:${teamColor(actualWinner)};font-size:28px;">Team ${actualWinner} WINS!</h2>
                        <p style="font-size:32px;color:var(--purple-glow);margin:16px 0;">${fmt(teams[actualWinner]?.teamXP)} XP</p>
                        <div class="winner-missions">
                            <span>${teams[actualWinner]?.trackGoalPassed ? '🎵✅' : '🎵❌'} Tracks</span>
                            <span>${teams[actualWinner]?.albumGoalPassed ? '💿✅' : '💿❌'} Albums</span>
                            <span>${teams[actualWinner]?.album2xPassed ? '✨✅' : '✨❌'} 2X</span>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <div class="card">
                <div class="card-header"><h3>📊 Final Standings</h3></div>
                <div class="card-body">
                    ${sorted.map(([t, info], i) => `
                        <div class="final-standing ${i === 0 ? 'winner' : ''}" style="border-left-color:${teamColor(t)}">
                            <span class="standing-pos">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
                            ${teamPfp(t) ? `<img src="${teamPfp(t)}" class="standing-pfp-sm">` : ''}
                            <div class="standing-details">
                                <div style="color:${teamColor(t)};font-weight:600;">${t}${i === 0 ? ' 🏆' : ''}</div>
                                <div style="font-size:12px;color:var(--text-dim);">Level ${info.level || 1}</div>
                            </div>
                            <div class="standing-missions-mini">
                                ${info.trackGoalPassed ? '🎵' : ''}
                                ${info.albumGoalPassed ? '💿' : ''}
                                ${info.album2xPassed ? '✨' : ''}
                            </div>
                            <div class="standing-xp-final">${fmt(info.teamXP)} XP</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="card">
                <div class="card-header"><h3>📈 Battle Stats</h3></div>
                <div class="card-body">
                    <div class="summary-stats-grid">
                        <div class="summary-stat">
                            <div class="stat-value">${Object.values(teams).reduce((sum, t) => sum + (t.teamXP || 0), 0).toLocaleString()}</div>
                            <div class="stat-label">Total XP Earned</div>
                        </div>
                        <div class="summary-stat">
                            <div class="stat-value">${Object.values(teams).filter(t => t.trackGoalPassed).length}/${Object.keys(teams).length}</div>
                            <div class="stat-label">Track Goals Passed</div>
                        </div>
                        <div class="summary-stat">
                            <div class="stat-value">${Object.values(teams).filter(t => t.albumGoalPassed).length}/${Object.keys(teams).length}</div>
                            <div class="stat-label">Album Goals Passed</div>
                        </div>
                        <div class="summary-stat">
                            <div class="stat-value">${Object.values(teams).filter(t => t.album2xPassed).length}/${Object.keys(teams).length}</div>
                            <div class="stat-label">2X Challenges Passed</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (e) {
        console.error('Summary error:', e);
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load summary</p></div></div>';
    }
}

// ==================== TEAM CHARTS PAGE ====================
async function renderTeamCharts() {
    const container = $('team-charts-content');
    if (!container) return;
    
    try {
        const summary = await api('getWeeklySummary', { week: STATE.week });
        const teams = summary.teams || {};
        const teamNames = Object.keys(teams);
        
        if (STATE.charts.teamXP) {
            STATE.charts.teamXP.destroy();
            STATE.charts.teamXP = null;
        }
        
        container.innerHTML = `
            <div class="card">
                <div class="card-header"><h3>📊 Team XP Comparison</h3></div>
                <div class="card-body">
                    <canvas id="chart-team-xp" height="300"></canvas>
                </div>
            </div>
        `;
        
        const ctx = $('chart-team-xp')?.getContext('2d');
        if (ctx && typeof Chart !== 'undefined') {
            STATE.charts.teamXP = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: teamNames,
                    datasets: [{
                        label: 'XP',
                        data: teamNames.map(t => teams[t].teamXP || 0),
                        backgroundColor: teamNames.map(t => teamColor(t)),
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                        legend: { display: false } 
                    },
                    scales: {
                        y: { 
                            beginAtZero: true, 
                            ticks: { color: '#888' },
                            grid: { color: '#333' }
                        },
                        x: { 
                            ticks: { color: '#888' },
                            grid: { display: false }
                        }
                    }
                }
            });
        } else if (typeof Chart === 'undefined') {
            container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Chart library not loaded</p></div></div>';
        }
    } catch (e) {
        console.error('Team charts error:', e);
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load charts</p></div></div>';
    }
}

// ==================== AGENT CHARTS PAGE ====================
async function renderAgentCharts() {
    const container = $('agent-charts-content');
    if (!container) return;
    
    const trackContributions = STATE.data?.trackContributions || {};
    const albumContributions = STATE.data?.albumContributions || {};
    
    if (STATE.charts.agentTracks) {
        STATE.charts.agentTracks.destroy();
        STATE.charts.agentTracks = null;
    }
    if (STATE.charts.agentAlbums) {
        STATE.charts.agentAlbums.destroy();
        STATE.charts.agentAlbums = null;
    }
    
    const hasTrackData = Object.keys(trackContributions).length > 0;
    const hasAlbumData = Object.keys(albumContributions).length > 0;
    
    container.innerHTML = `
        <div class="card">
            <div class="card-header"><h3>🎵 Your Top Tracks</h3></div>
            <div class="card-body">
                ${hasTrackData ? '<canvas id="chart-agent-tracks" height="300"></canvas>' : '<p class="empty-text">No track data yet</p>'}
            </div>
        </div>
        
        <div class="card">
            <div class="card-header"><h3>💿 Your Album Breakdown</h3></div>
            <div class="card-body">
                ${hasAlbumData ? '<canvas id="chart-agent-albums" height="300"></canvas>' : '<p class="empty-text">No album data yet</p>'}
            </div>
        </div>
    `;
    
    if (typeof Chart === 'undefined') return;
    
    const ctx1 = $('chart-agent-tracks')?.getContext('2d');
    if (ctx1 && hasTrackData) {
        const sorted = Object.entries(trackContributions).sort((a, b) => b[1] - a[1]).slice(0, 10);
        STATE.charts.agentTracks = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: sorted.map(([k]) => k.length > 20 ? k.substring(0, 17) + '...' : k),
                datasets: [{ 
                    data: sorted.map(([, v]) => v), 
                    backgroundColor: '#7b2cbf',
                    borderRadius: 4
                }]
            },
            options: { 
                responsive: true, 
                indexAxis: 'y', 
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#888' }, grid: { color: '#333' } },
                    y: { ticks: { color: '#888' }, grid: { display: false } }
                }
            }
        });
    }
    
    const ctx2 = $('chart-agent-albums')?.getContext('2d');
    if (ctx2 && hasAlbumData) {
        STATE.charts.agentAlbums = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: Object.keys(albumContributions),
                datasets: [{ 
                    data: Object.values(albumContributions), 
                    backgroundColor: ['#7b2cbf', '#9d4edd', '#c77dff', '#4cc9f0', '#f72585', '#ff9500'] 
                }]
            },
            options: { 
                responsive: true, 
                plugins: { 
                    legend: { 
                        position: 'bottom', 
                        labels: { color: '#e0e0f0' } 
                    } 
                } 
            }
        });
    }
}

// ==================== DRAWER PAGE ====================
async function renderDrawer() {
    const container = $('drawer-content');
    const profile = STATE.data?.profile || {};
    const stats = STATE.data?.stats || {};
    
    try {
        const [badges, winners] = await Promise.all([
            api('getBadges', { agentNo: STATE.agentNo }),
            api('getWeeklyWinners').catch(() => ({ winners: [] }))
        ]);
        
        const myWins = (winners.winners || []).filter(w => w.team === profile.team);
        
        container.innerHTML = `
            <div class="card">
                <div class="card-header"><h3>📋 Agent Profile</h3></div>
                <div class="card-body">
                    <div class="drawer-header">
                        ${teamPfp(profile.team) ? `<img src="${teamPfp(profile.team)}" class="drawer-pfp" style="border-color:${teamColor(profile.team)}">` : ''}
                        <div class="drawer-info">
                            <div class="drawer-name">${sanitize(profile.name)}</div>
                            <div class="drawer-team" style="color:${teamColor(profile.team)}">Team ${profile.team}</div>
                            <div class="drawer-id">Agent #${STATE.agentNo}</div>
                        </div>
                    </div>
                    <div class="drawer-stats">
                        <div class="drawer-stat">
                            <span class="value">${fmt(stats.totalXP)}</span>
                            <span class="label">Total XP</span>
                        </div>
                        <div class="drawer-stat">
                            <span class="value">#${STATE.data?.rank || 'N/A'}</span>
                            <span class="label">Global Rank</span>
                        </div>
                        <div class="drawer-stat">
                            <span class="value">${(badges.badges || []).length}</span>
                            <span class="label">Badges</span>
                        </div>
                        <div class="drawer-stat">
                            <span class="value">${myWins.length}</span>
                            <span class="label">Team Wins</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header"><h3>🎖️ Badges Earned</h3></div>
                <div class="card-body">
                    ${(badges.badges || []).length ? `
                        <div class="badges-showcase">
                            ${badges.badges.map(b => `
                                <div class="badge-showcase-item">
                                    <div class="badge-icon-lg">${b.imageUrl ? `<img src="${b.imageUrl}">` : '🎖️'}</div>
                                    <div class="badge-name">${sanitize(b.name)}</div>
                                    ${b.description ? `<div class="badge-desc">${sanitize(b.description)}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : '<p class="empty-text">No badges earned yet. Keep streaming!</p>'}
                </div>
            </div>
            
            ${myWins.length ? `
                <div class="card">
                    <div class="card-header"><h3>🏆 Team Victories</h3></div>
                    <div class="card-body">
                        ${myWins.map(w => `
                            <div class="victory-item">
                                <span class="victory-week">${w.week}</span>
                                <span class="victory-xp" style="color:var(--success)">🏆 ${fmt(w.teamXP)} XP</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    } catch (e) {
        console.error('Drawer error:', e);
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load profile data</p></div></div>';
    }
}

// ==================== ANNOUNCEMENTS PAGE ====================
async function renderAnnouncements() {
    const container = $('announcements-content');
    
    try {
        const data = await api('getAnnouncements', { week: STATE.week });
        const list = data.announcements || [];
        
        container.innerHTML = list.length ? list.map(a => `
            <div class="card announcement ${a.priority === 'high' ? 'urgent' : ''}">
                <div class="card-body">
                    <div class="announcement-header">
                        <span class="announcement-date">${a.created ? new Date(a.created).toLocaleDateString() : ''}</span>
                        ${a.priority === 'high' ? '<span class="urgent-badge">⚠️ IMPORTANT</span>' : ''}
                    </div>
                    <h3>${sanitize(a.title)}</h3>
                    <p>${sanitize(a.message)}</p>
                </div>
            </div>
        `).join('') : `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:40px;">
                    <div style="font-size:48px;margin-bottom:16px;">📢</div>
                    <p style="color:var(--text-dim);">No announcements at this time</p>
                </div>
            </div>
        `;
    } catch (e) {
        console.error('Announcements error:', e);
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load announcements</p></div></div>';
    }
}

// ==================== SECRET MISSIONS PAGE ====================
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
        
        container.innerHTML = `
            <!-- Team Status Card -->
            <div class="card secret-header-card" style="border-color:${teamColor(myTeam)}">
                <div class="card-body">
                    <div class="secret-header">
                        ${teamPfp(myTeam) ? `<img src="${teamPfp(myTeam)}" class="secret-team-pfp" style="border-color:${teamColor(myTeam)}">` : ''}
                        <div class="secret-header-info">
                            <div class="secret-team-name" style="color:${teamColor(myTeam)}">Team ${myTeam}</div>
                            <div class="secret-label">SECRET MISSION BONUS</div>
                        </div>
                        <div class="secret-xp-display">
                            <div class="secret-xp-value">+${myStats.secretXP || 0}</div>
                            <div class="secret-xp-max">/ ${CONFIG.SECRET_MISSIONS.maxTeamBonus} max XP</div>
                        </div>
                    </div>
                    
                    <div class="secret-stats-row">
                        <div class="secret-stat">
                            <span class="stat-value">${myStats.completed || 0}</span>
                            <span class="stat-label">Completed</span>
                        </div>
                        <div class="secret-stat">
                            <span class="stat-value">${activeMissions.length}</span>
                            <span class="stat-label">Active</span>
                        </div>
                        <div class="secret-stat">
                            <span class="stat-value">${CONFIG.SECRET_MISSIONS.maxMissionsPerTeam}</span>
                            <span class="stat-label">Max/Week</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Your Assigned Missions -->
            ${myAssigned.length ? `
                <div class="card urgent-card">
                    <div class="card-header">
                        <h3>🎯 Your Assigned Missions</h3>
                        <span class="urgent-badge">Action Required</span>
                    </div>
                    <div class="card-body">
                        ${myAssigned.map(m => renderSecretMissionCard(m, myTeam, true)).join('')}
                    </div>
                </div>
            ` : ''}
            
            <!-- Active Team Missions -->
            <div class="card">
                <div class="card-header">
                    <h3>🔒 Active Team Missions</h3>
                </div>
                <div class="card-body">
                    ${activeMissions.length ? activeMissions.map(m => renderSecretMissionCard(m, myTeam, false)).join('') : `
                        <div class="empty-missions">
                            <div class="empty-icon">📭</div>
                            <p>No active secret missions</p>
                            <p class="empty-hint">Stand by for orders, Agent.</p>
                        </div>
                    `}
                </div>
            </div>
            
            <!-- All Teams Intel -->
            <div class="card">
                <div class="card-header">
                    <h3>📊 Team Intelligence Report</h3>
                </div>
                <div class="card-body">
                    <div class="intel-grid">
                        ${Object.keys(CONFIG.TEAMS).map(t => {
                            const tStats = stats[t] || {};
                            const isMyTeam = t === myTeam;
                            return `
                                <div class="intel-card ${isMyTeam ? 'my-team' : ''}" style="border-color:${teamColor(t)}">
                                    ${teamPfp(t) ? `<img src="${teamPfp(t)}" class="intel-pfp">` : ''}
                                    <div class="intel-name" style="color:${teamColor(t)}">${t}</div>
                                    <div class="intel-xp">+${tStats.secretXP || 0} XP</div>
                                    <div class="intel-missions">${tStats.completed || 0}/${CONFIG.SECRET_MISSIONS.maxMissionsPerTeam} missions</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Completed Missions -->
            ${completedMissions.length ? `
                <div class="card">
                    <div class="card-header"><h3>✅ Completed Missions</h3></div>
                    <div class="card-body">
                        ${completedMissions.map(m => `
                            <div class="completed-mission">
                                <span class="completed-icon">${CONFIG.MISSION_TYPES[m.type]?.icon || '✅'}</span>
                                <div class="completed-info">
                                    <div class="completed-title">${sanitize(m.title)}</div>
                                    <div class="completed-date">${m.completedAt ? new Date(m.completedAt).toLocaleDateString() : ''}</div>
                                </div>
                                <span class="completed-xp">+${m.xpReward || CONFIG.SECRET_MISSIONS.xpPerMission} XP</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
        
    } catch (e) {
        console.error('Secret missions error:', e);
        container.innerHTML = `
            <div class="card">
                <div class="card-body error-state">
                    <p>Failed to load secret missions.</p>
                    <button onclick="loadPage('secret-missions')" class="btn-primary">Retry</button>
                </div>
            </div>
        `;
    }
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
            
            <div class="smc-header">
                <span class="smc-icon">${missionInfo.icon}</span>
                <div class="smc-title-section">
                    <div class="smc-type">${missionInfo.name}</div>
                    <div class="smc-title">${sanitize(mission.title)}</div>
                </div>
            </div>
            
            ${mission.assignedAgents?.length ? `
                <div class="smc-agents">
                    <div class="agents-label">Assigned Agents:</div>
                    <div class="agents-list">
                        ${mission.assignedAgents.map(a => {
                            const isMe = String(a.agentNo) === String(STATE.agentNo);
                            return `<span class="agent-tag ${isMe ? 'is-me' : ''}" style="color:${teamColor(a.team)}">${isMe ? '👤 YOU' : `#${a.agentNo}`}</span>`;
                        }).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="smc-briefing">${sanitize(mission.briefing || '')}</div>
            
            ${mission.targetTrack ? `
                <div class="smc-target">
                    <span class="target-label">TARGET:</span>
                    <span class="target-track">${sanitize(mission.targetTrack)}</span>
                    <span class="target-goal">${goalTarget} streams</span>
                </div>
            ` : ''}
            
            <div class="smc-progress">
                <div class="progress-header">
                    <span>Team Progress</span>
                    <span>${myProgress}/${goalTarget}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill ${isComplete ? 'complete' : ''}" style="width:${pct}%;background:${teamColor(myTeam)}"></div>
                </div>
                ${isComplete ? 
                    `<div class="progress-complete">✅ Mission Complete! +${mission.xpReward || CONFIG.SECRET_MISSIONS.xpPerMission} XP</div>` : 
                    `<div class="progress-remaining">${goalTarget - myProgress} more streams needed</div>`
                }
            </div>
            
            ${mission.deadline ? `<div class="smc-deadline">⏰ Deadline: ${new Date(mission.deadline).toLocaleString()}</div>` : ''}
            
            <div class="smc-footer">
                <span class="smc-reward">⭐ +${mission.xpReward || CONFIG.SECRET_MISSIONS.xpPerMission} XP</span>
                <span class="smc-id">${mission.id}</span>
            </div>
        </div>
    `;
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', initApp);

// Global exports for onclick handlers
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

console.log('🎮 BTS Spy Battle v2.1 Loaded - With Last Updated Support');
