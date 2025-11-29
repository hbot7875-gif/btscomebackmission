// ===== BTS SPY BATTLE - COMPLETE APP.JS WITH TEAM SECRET MISSIONS =====

// ==================== CONFIGURATION ====================
const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbx5ArHi5Ws0NxMa9nhORy6bZ7ZYpW4urPIap24tax9H1HLuGQxYRCgTVwDaKOMrZ7JOGA/exec',
    
    // Admin Settings
    ADMIN_AGENT_NO: '001',  // Agent 001 is admin
    
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
    
    // Secret Mission Settings
    SECRET_MISSIONS: {
        xpPerMission: 5,
        maxMissionsPerTeam: 5,
        maxTeamBonus: 25
    },
    
    // Mission Types
    MISSION_TYPES: {
        'joint_op': {
            name: 'Joint Operation',
            icon: '🤝',
            description: 'Agents from different teams collaborate'
        },
        'decode': {
            name: 'Decode Mission',
            icon: '🔐',
            description: 'Solve cipher to reveal target'
        },
        'coordinate': {
            name: 'Coordinate Strike',
            icon: '⚡',
            description: 'Multiple agents stream together'
        },
        'stealth': {
            name: 'Stealth Mission',
            icon: '🥷',
            description: 'Covert streaming task'
        },
        'chain': {
            name: 'Chain Reaction',
            icon: '🔗',
            description: 'Sequential team task'
        },
        'hidden': {
            name: 'Hidden Target',
            icon: '🎯',
            description: 'Clue-based target discovery'
        },
        'alliance': {
            name: 'Alliance Mission',
            icon: '🌐',
            description: 'All teams work together'
        }
    }
};

// ==================== STATE ====================
const STATE = {
    agentNo: null,
    week: null,
    weeks: [],
    data: null,
    page: 'home',
    charts: {},
    isLoading: false,
    
    // Admin state
    isAdmin: false,
    adminSession: null
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
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '&': '&amp;'
    })[char] || char);
}

function showResult(msg, isError) {
    const el = $('find-result');
    if (!el) return;
    
    el.innerHTML = `
        <span style="margin-right:8px;">${isError ? '⚠️' : '✅'}</span>
        ${msg}
    `;
    el.className = `result-box show ${isError ? 'error' : 'success'}`;
    
    if (!isError) {
        setTimeout(() => el.classList.remove('show'), 5000);
    }
}

function updateTime() {
    const el = $('last-update');
    if (el) {
        el.textContent = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

function getDaysUntilSunday() {
    const now = new Date();
    const day = now.getDay();
    return day === 0 ? 0 : 7 - day;
}

function isSunday() {
    return new Date().getDay() === 0;
}

// ==================== API ====================
async function api(action, params = {}) {
    const url = new URL(CONFIG.API_URL);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([k, v]) => {
        if (v != null) {
            if (typeof v === 'object') {
                url.searchParams.set(k, JSON.stringify(v));
            } else {
                url.searchParams.set(k, v);
            }
        }
    });
    
    console.log('📡 API:', action, params);
    
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        
        const text = await res.text();
        const data = JSON.parse(text);
        
        console.log('✅ Response:', action, data);
        
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
    
    const saved = localStorage.getItem('spyAgent');
    if (saved) {
        STATE.agentNo = saved;
        checkAdminStatus();
        loadDashboard();
        return;
    }
    
    // Setup login event listeners
    $('login-btn')?.addEventListener('click', handleLogin);
    $('find-btn')?.addEventListener('click', handleFind);
    
    $('agent-input')?.addEventListener('keypress', e => {
        if (e.key === 'Enter') handleLogin();
    });
    
    $('instagram-input')?.addEventListener('keypress', e => {
        if (e.key === 'Enter') handleFind();
    });
    
    setTimeout(() => $('agent-input')?.focus(), 100);
}

// --- Corrected handleLogin Logic (Conceptual) ---
async function handleLogin() {
    // ... (Input checking and disabling button) ...
    
    try {
        // 1. Verify Agent Existence (as you currently do)
        const res = await api('getAllAgents');
        const agents = res.agents || [];
        const found = agents.find(a => String(a.agentNo).trim() === agentNo);
        
        if (!found) {
            // ... (Handle not found) ...
            return;
        }
        
        localStorage.setItem('spyAgent', agentNo);
        STATE.agentNo = agentNo;
        
        // --- START CRITICAL ADMIN LOGIC ---
        if (String(agentNo) === String(CONFIG.ADMIN_AGENT_NO)) {
            // If this agent is the admin, we must call verifyAdmin using the hardcoded password
            console.log('Admin agent detected. Attempting authentication...');
            
            const adminRes = await api('verifyAdmin', {
                agentNo: agentNo,
                password: CONFIG.ADMIN_PASSWORD // Use the password defined in CONFIG
            });
            
            if (adminRes.success) {
                STATE.isAdmin = true;
                STATE.adminSession = adminRes.sessionToken;
                localStorage.setItem('adminSession', adminRes.sessionToken);
                localStorage.setItem('adminExpiry', Date.now() + (adminRes.expiresIn * 1000));
            } else {
                throw new Error(adminRes.error || "Admin authentication failed.");
            }
        }
        // --- END CRITICAL ADMIN LOGIC ---
        
        // Check if this agent is admin (This should now correctly reflect the stored state)
        checkAdminStatus(); // This function checks localStorage/STATE
        
        await loadDashboard();
        
    } catch (e) {
        loading(false);
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
        showResult('Login failed: ' + e.message, true);
    }
}

// ==================== ADMIN FUNCTIONS ====================
function checkAdminStatus() {
    // Check if current agent is admin
    if (String(STATE.agentNo) === String(CONFIG.ADMIN_AGENT_NO)) {
        // Check for existing session
        const savedSession = localStorage.getItem('adminSession');
        const savedExpiry = localStorage.getItem('adminExpiry');
        
        if (savedSession && savedExpiry && Date.now() < parseInt(savedExpiry)) {
            STATE.isAdmin = true;
            STATE.adminSession = savedSession;
            console.log('🔓 Admin session restored');
        }
    }
}

function isAdminAgent() {
    return String(STATE.agentNo) === String(CONFIG.ADMIN_AGENT_NO);
}

function showAdminLogin() {
    if (!isAdminAgent()) {
        alert('Access denied. You are not authorized.');
        return;
    }
    
    // Remove existing modal
    $('admin-modal')?.remove();
    
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
                        <input type="password" id="admin-password" class="terminal-input" 
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
    
    setTimeout(() => $('admin-password')?.focus(), 100);
    
    $('admin-password')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifyAdminPassword();
    });
}

function closeAdminModal() {
    const modal = $('admin-modal');
    if (modal) {
        modal.classList.add('closing');
        setTimeout(() => modal.remove(), 300);
    }
}

async function verifyAdminPassword() {
    const password = $('admin-password')?.value;
    const errorEl = $('admin-error');
    const verifyBtn = $('admin-verify-btn');
    
    if (!password) {
        if (errorEl) {
            errorEl.textContent = '⚠️ Enter your password';
            errorEl.classList.add('show');
        }
        return;
    }
    
    if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.innerHTML = '<span>Verifying...</span>';
    }
    
    try {
        const result = await api('verifyAdmin', {
            agentNo: STATE.agentNo,
            password: password
        });
        
        if (result.success) {
            STATE.isAdmin = true;
            STATE.adminSession = result.sessionToken;
            
            // Store session
            localStorage.setItem('adminSession', result.sessionToken);
            localStorage.setItem('adminExpiry', Date.now() + (result.expiresIn * 1000));
            
            closeAdminModal();
            addAdminIndicator();
            showAdminPanel();
            
            console.log('🔓 Admin access granted');
        } else {
            if (errorEl) {
                errorEl.textContent = '❌ ' + (result.error || 'Invalid password');
                errorEl.classList.add('show');
            }
            $('admin-password').value = '';
            $('admin-password')?.focus();
        }
    } catch (e) {
        if (errorEl) {
            errorEl.textContent = '❌ Verification failed: ' + e.message;
            errorEl.classList.add('show');
        }
    }
    
    if (verifyBtn) {
        verifyBtn.disabled = false;
        verifyBtn.innerHTML = '<span>Authenticate</span><span>🔓</span>';
    }
}

function addAdminIndicator() {
    document.querySelector('.admin-indicator')?.remove();
    
    const indicator = document.createElement('div');
    indicator.className = 'admin-indicator';
    indicator.innerHTML = `
        <span class="admin-badge" onclick="showAdminPanel()">
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
    
    // Setup tabs
    panel.querySelectorAll('.admin-tab').forEach(tab => {
        tab.onclick = () => switchAdminTab(tab.dataset.tab);
    });
    
    // Setup form listeners
    setupMissionFormListeners();
    
    // Load data
    loadActiveTeamMissions();
    loadMissionHistory();
}

function closeAdminPanel() {
    document.querySelector('.admin-panel')?.remove();
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
            <!-- Mission Type -->
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
            
            <!-- Target Teams -->
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
            
            <!-- Assigned Agents -->
            <div class="form-section">
                <h4>🕵️ Assigned Agents (Optional)</h4>
                <p class="form-hint">Specify agents for joint operations, or leave empty for team-wide missions.</p>
                <div id="agent-rows" class="agent-rows">
                    <div class="agent-input-group">
                        <select class="agent-team-select form-select">
                            <option value="">Team</option>
                            ${Object.keys(CONFIG.TEAMS).map(t => `<option value="${t}">${t}</option>`).join('')}
                        </select>
                        <input type="text" class="agent-number-input form-input" placeholder="Agent #">
                    </div>
                </div>
                <button type="button" onclick="addAgentRow()" class="btn-sm btn-secondary">
                    + Add Agent
                </button>
                
                <div class="form-group" style="margin-top:16px;">
                    <label>Or require any agents from team:</label>
                    <div class="any-agents-input">
                        <span>Any</span>
                        <input type="number" id="any-agents-count" min="0" max="20" value="0" class="form-input" style="width:60px;">
                        <span>agents from selected team(s)</span>
                    </div>
                </div>
            </div>
            
            <!-- Mission Details -->
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
                
                <div class="form-group decode-fields" style="display:none;">
                    <label>🔐 Encoded Clue (for decode missions)</label>
                    <input type="text" id="encoded-clue" class="form-input" placeholder="e.g., YTNUOB">
                    <label style="margin-top:12px;">Answer (hidden from agents)</label>
                    <input type="text" id="decode-answer" class="form-input" placeholder="e.g., BOUNTY">
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
            
            <!-- Preview -->
            <div class="form-section">
                <h4>👁️ Preview</h4>
                <div id="mission-preview" class="mission-preview">
                    ${renderMissionPreview()}
                </div>
            </div>
            
            <!-- Submit -->
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
    
    // Show/hide decode fields
    const decodeFields = document.querySelector('.decode-fields');
    if (decodeFields) {
        decodeFields.style.display = type === 'decode' ? 'block' : 'none';
    }
    
    updateMissionPreview();
}

function toggleAllTeams(checked) {
    document.querySelectorAll('input[name="target-teams"]').forEach(cb => {
        cb.checked = checked;
    });
    updateMissionPreview();
}

function addAgentRow() {
    const container = $('agent-rows');
    const row = document.createElement('div');
    row.className = 'agent-input-group';
    row.innerHTML = `
        <select class="agent-team-select form-select">
            <option value="">Team</option>
            ${Object.keys(CONFIG.TEAMS).map(t => `<option value="${t}">${t}</option>`).join('')}
        </select>
        <input type="text" class="agent-number-input form-input" placeholder="Agent #">
        <button type="button" class="remove-agent-btn" onclick="this.parentElement.remove();updateMissionPreview();">×</button>
    `;
    container.appendChild(row);
}

function setupMissionFormListeners() {
    const inputs = ['mission-title', 'mission-briefing', 'target-track', 'goal-target', 'goal-type', 'any-agents-count'];
    inputs.forEach(id => {
        $(id)?.addEventListener('input', updateMissionPreview);
    });
    
    document.querySelectorAll('input[name="target-teams"]').forEach(cb => {
        cb.addEventListener('change', updateMissionPreview);
    });
}

function renderMissionPreview() {
    const type = $('selected-mission-type')?.value || 'joint_op';
    const missionInfo = CONFIG.MISSION_TYPES[type] || {};
    const title = $('mission-title')?.value || 'Operation [Codename]';
    const briefing = $('mission-briefing')?.value || 'Mission briefing...';
    const targetTeams = Array.from(document.querySelectorAll('input[name="target-teams"]:checked')).map(cb => cb.value);
    const goalTarget = $('goal-target')?.value || '100';
    const targetTrack = $('target-track')?.value || '[Target]';
    
    return `
        <div class="team-mission-card preview">
            <div class="tmc-stamp">CLASSIFIED</div>
            <div class="tmc-header">
                <span class="tmc-icon">${missionInfo.icon || '🔒'}</span>
                <span class="tmc-type-name">${missionInfo.name || 'Mission'}</span>
            </div>
            <div class="tmc-title">${sanitize(title)}</div>
            <div class="tmc-teams">
                ${targetTeams.length ? targetTeams.map(t => `
                    <span class="tmc-team-badge" style="background:${teamColor(t)}22;color:${teamColor(t)};border:1px solid ${teamColor(t)}">
                        ${t}
                    </span>
                `).join('') : '<span class="tmc-no-teams">Select teams...</span>'}
            </div>
            <div class="tmc-briefing">${sanitize(briefing)}</div>
            <div class="tmc-objective">
                <span class="objective-label">OBJECTIVE:</span>
                <span>${sanitize(targetTrack)} → ${goalTarget} streams</span>
            </div>
            <div class="tmc-reward">
                ⭐ +${CONFIG.SECRET_MISSIONS.xpPerMission} XP per team
            </div>
        </div>
    `;
}

function updateMissionPreview() {
    const preview = $('mission-preview');
    if (preview) {
        preview.innerHTML = renderMissionPreview();
    }
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
    const encodedClue = $('encoded-clue')?.value.trim();
    const decodeAnswer = $('decode-answer')?.value.trim();
    const anyAgentsCount = parseInt($('any-agents-count')?.value) || 0;
    
    // Get assigned agents
    const assignedAgents = [];
    document.querySelectorAll('.agent-input-group').forEach(row => {
        const team = row.querySelector('.agent-team-select')?.value;
        const agentNo = row.querySelector('.agent-number-input')?.value?.trim();
        if (team && agentNo) {
            assignedAgents.push({ team, agentNo });
        }
    });
    
    // Validation
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
            targetTeams,
            assignedAgents,
            anyAgentsCount,
            targetTrack,
            goalType,
            goalTarget,
            deadline,
            encodedClue,
            decodeAnswer
        });
        
        loading(false);
        
        if (result.success) {
            showCreateResult(`✅ Mission deployed! ID: ${result.missionId}`, false);
            
            // Clear form
            $('mission-title').value = '';
            $('mission-briefing').value = '';
            $('target-track').value = '';
            document.querySelectorAll('input[name="target-teams"]').forEach(cb => cb.checked = false);
            $('all-teams').checked = false;
            
            // Refresh
            loadActiveTeamMissions();
            updateMissionPreview();
        } else {
            showCreateResult('❌ ' + (result.error || 'Failed to create mission'), true);
        }
    } catch (e) {
        loading(false);
        showCreateResult('❌ Error: ' + e.message, true);
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

// ==================== ADMIN: LOAD MISSIONS ====================
async function loadActiveTeamMissions() {
    const container = $('admin-tab-active');
    if (!container) return;
    
    try {
        const result = await api('getTeamMissions', { status: 'active', week: STATE.week });
        const missions = result.missions || [];
        
        // Update tab badge
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
        
        container.innerHTML = missions.map(m => renderAdminMissionCard(m)).join('');
        
    } catch (e) {
        container.innerHTML = `<div class="error-state">Failed to load: ${e.message}</div>`;
    }
}

function renderAdminMissionCard(mission) {
    const missionInfo = CONFIG.MISSION_TYPES[mission.type] || {};
    
    return `
        <div class="admin-mission-card">
            <div class="amc-header">
                <span class="amc-type">${missionInfo.icon} ${missionInfo.name}</span>
                <span class="amc-id">${mission.id}</span>
            </div>
            <div class="amc-title">${sanitize(mission.title)}</div>
            <div class="amc-teams">
                ${mission.targetTeams.map(t => `
                    <span class="team-badge ${mission.completedTeams?.includes(t) ? 'completed' : ''}" 
                          style="color:${teamColor(t)}">
                        ${t} ${mission.completedTeams?.includes(t) ? '✅' : ''}
                    </span>
                `).join('')}
            </div>
            
            <div class="amc-progress">
                ${mission.targetTeams.map(t => {
                    const progress = mission.progress?.[t] || 0;
                    const pct = Math.min((progress / mission.goalTarget) * 100, 100);
                    return `
                        <div class="progress-row">
                            <span style="color:${teamColor(t)}">${t}</span>
                            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${teamColor(t)}"></div></div>
                            <span>${progress}/${mission.goalTarget}</span>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="amc-actions">
                <button onclick="adminCompleteMission('${mission.id}')" class="btn-sm btn-success">✅ Complete Team</button>
                <button onclick="adminCancelMission('${mission.id}')" class="btn-sm btn-danger">❌ Cancel</button>
            </div>
        </div>
    `;
}

async function adminCompleteMission(missionId) {
    const team = prompt('Enter team name to mark as complete:');
    if (!team || !CONFIG.TEAMS[team]) {
        if (team) alert('Invalid team name');
        return;
    }
    
    loading(true);
    try {
        const result = await api('completeTeamMission', { missionId, team });
        loading(false);
        
        if (result.success) {
            alert(`✅ ${team} completed! +${result.xpAwarded} XP awarded`);
            loadActiveTeamMissions();
        } else {
            alert('Failed: ' + (result.error || 'Unknown error'));
        }
    } catch (e) {
        loading(false);
        alert('Error: ' + e.message);
    }
}

async function adminCancelMission(missionId) {
    if (!confirm('Cancel this mission?')) return;
    
    loading(true);
    try {
        await api('cancelTeamMission', { missionId });
        loading(false);
        loadActiveTeamMissions();
    } catch (e) {
        loading(false);
        alert('Error: ' + e.message);
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
            <table class="admin-table">
                <thead>
                    <tr><th>ID</th><th>Title</th><th>Teams</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                    ${missions.map(m => `
                        <tr>
                            <td><code>${m.id}</code></td>
                            <td>${sanitize(m.title)}</td>
                            <td>${m.targetTeams.join(', ')}</td>
                            <td><span class="status-${m.status}">${m.status}</span></td>
                            <td>${new Date(m.createdAt).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
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
        
        if (!STATE.week) throw new Error('No weeks available');
        
        STATE.data = await api('getAgentData', {
            agentNo: STATE.agentNo,
            week: STATE.week
        });
        
        // Hide login, show dashboard
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
        loading(false);
        
        // Show admin indicator if admin
        if (STATE.isAdmin) {
            addAdminIndicator();
        }
        
    } catch (e) {
        console.error('Dashboard error:', e);
        loading(false);
        alert('Failed to load: ' + e.message);
        logout();
    }
}

function setupDashboard() {
    const p = STATE.data?.profile;
    
    if (p) {
        const color = teamColor(p.team);
        const pfp = teamPfp(p.team);
        const initial = (p.name || 'A')[0].toUpperCase();
        
        // Avatar
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
        
        // Profile avatar
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
    
    // Week selector
    const select = $('week-select');
    if (select && STATE.weeks.length) {
        select.innerHTML = STATE.weeks.map(w => 
            `<option value="${w}" ${w === STATE.week ? 'selected' : ''}>${w}</option>`
        ).join('');
        
        select.onchange = async () => {
            STATE.week = select.value;
            loading(true);
            try {
                STATE.data = await api('getAgentData', {
                    agentNo: STATE.agentNo,
                    week: STATE.week
                });
                await loadPage(STATE.page);
            } catch (e) {
                alert('Failed to load week');
            }
            loading(false);
        };
    }
    
    // Navigation
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
    
    // Add admin nav link if admin agent
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
        }
    } catch (e) {
        console.error('Page error:', e);
    }
    
    loading(false);
}

// ==================== HOME PAGE ====================
async function renderHome() {
    $('current-week').textContent = 'Week: ' + STATE.week;
    
    try {
        const [summary, rankings, goals] = await Promise.all([
            api('getWeeklySummary', { week: STATE.week }),
            api('getRankings', { week: STATE.week, limit: 5 }),
            api('getGoalsProgress', { week: STATE.week })
        ]);
        
        const team = STATE.data?.profile?.team;
        const teamData = summary.teams?.[team] || {};
        const myStats = STATE.data?.stats || {};
        const sunday = isSunday();
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
                    </div>
                </div>
            `;
        }
        
        // Mission Cards
        const trackGoals = goals.trackGoals || {};
        const albumGoals = goals.albumGoals || {};
        const teamTracks = CONFIG.TEAM_ALBUM_TRACKS[team] || [];
        
        const trackComplete = Object.values(trackGoals).filter(g => g.teams?.[team]?.status === 'Completed').length;
        const albumComplete = Object.values(albumGoals).filter(g => g.teams?.[team]?.status === 'Completed').length;
        
        const album2xStatus = STATE.data?.album2xStatus || {};
        const userTracksFor2x = album2xStatus.tracks || {};
        const tracksCompleted2x = teamTracks.filter(t => (userTracksFor2x[t] || 0) >= 2).length;

        const missionCardsContainer = document.querySelector('.missions-grid');
        if (missionCardsContainer) {
            missionCardsContainer.innerHTML = `
                <div class="mission-card" onclick="loadPage('goals')">
                    <div class="mission-icon">🎵</div>
                    <h3>Track Goals</h3>
                    <div class="mission-status ${teamData.trackGoalPassed ? 'complete' : ''}">
                        ${teamData.trackGoalPassed ? '✅ Complete' : '⏳ In Progress'}
                    </div>
                    <div class="mission-progress">
                        <div class="progress-bar"><div class="progress-fill ${teamData.trackGoalPassed ? 'complete' : ''}" style="width:${Object.keys(trackGoals).length ? (trackComplete/Object.keys(trackGoals).length*100) : 0}%"></div></div>
                        <span>${trackComplete}/${Object.keys(trackGoals).length}</span>
                    </div>
                </div>
                
                <div class="mission-card" onclick="loadPage('goals')">
                    <div class="mission-icon">💿</div>
                    <h3>Album Goals</h3>
                    <div class="mission-status ${teamData.albumGoalPassed ? 'complete' : ''}">
                        ${teamData.albumGoalPassed ? '✅ Complete' : '⏳ In Progress'}
                    </div>
                    <div class="mission-progress">
                        <div class="progress-bar"><div class="progress-fill ${teamData.albumGoalPassed ? 'complete' : ''}" style="width:${Object.keys(albumGoals).length ? (albumComplete/Object.keys(albumGoals).length*100) : 0}%"></div></div>
                        <span>${albumComplete}/${Object.keys(albumGoals).length}</span>
                    </div>
                </div>
                
                <div class="mission-card" onclick="loadPage('album2x')">
                    <div class="mission-icon">✨</div>
                    <h3>Album 2X</h3>
                    <div class="mission-status ${album2xStatus.passed ? 'complete' : ''}">
                        ${album2xStatus.passed ? '✅ Complete' : '⏳ In Progress'}
                    </div>
                    <div class="mission-progress">
                        <div class="progress-bar"><div class="progress-fill ${album2xStatus.passed ? 'complete' : ''}" style="width:${teamTracks.length ? (tracksCompleted2x/teamTracks.length*100) : 0}%"></div></div>
                        <span>${tracksCompleted2x}/${teamTracks.length}</span>
                    </div>
                </div>
                
                <div class="mission-card secret" onclick="loadPage('secret-missions')">
                    <div class="mission-icon">🔒</div>
                    <h3>Secret Missions</h3>
                    <div class="mission-status">
                        🕵️ Classified
                    </div>
                    <div class="mission-hint">Tap to view team missions</div>
                </div>
            `;
        }
        
        // Top Agents
        const rankList = rankings.rankings || [];
        $('home-top-agents').innerHTML = rankList.length ? rankList.slice(0, 5).map((r, i) => {
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
        
        // Team Standings
        const teams = summary.teams || {};
        const sortedTeams = Object.keys(teams).sort((a, b) => (teams[b].teamXP || 0) - (teams[a].teamXP || 0));
        const maxXP = teams[sortedTeams[0]]?.teamXP || 1;
        
        $('home-standings').innerHTML = sortedTeams.length ? `
            <div class="standings-header">
                <span class="standings-badge ${sunday ? 'final' : ''}">${sunday ? '🏆 Final' : '⏳ Live'}</span>
            </div>
            ${sortedTeams.map((t, i) => {
                const td = teams[t];
                const isMyTeam = t === team;
                const barWidth = ((td.teamXP || 0) / maxXP) * 100;
                const showTrophy = sunday && td.isWinner;
                
                return `
                    <div class="standing-item ${isMyTeam ? 'my-team' : ''}" onclick="loadPage('team-level')" style="--team-color:${teamColor(t)}">
                        <div class="standing-rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</div>
                        ${teamPfp(t) ? `<img src="${teamPfp(t)}" class="standing-pfp">` : ''}
                        <div class="standing-info">
                            <div class="standing-name" style="color:${teamColor(t)}">${t}${isMyTeam ? ' ⭐' : ''}${showTrophy ? ' 🏆' : ''}</div>
                            <div class="standing-xp">${fmt(td.teamXP)} XP ${td.secretXP ? `<span class="secret-bonus">(+${td.secretXP} secret)</span>` : ''}</div>
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
        
    } catch (e) {
        console.error('Home error:', e);
    }
}

// ==================== SECRET MISSIONS PAGE ====================
async function renderSecretMissions() {
    const container = $('secret-missions-content');
    if (!container) return;
    
    const myTeam = STATE.data?.profile?.team;
    
    container.innerHTML = '<div class="loading-skeleton"></div>';
    
    try {
        const [missionsData, statsData] = await Promise.all([
            api('getTeamSecretMissions', { team: myTeam, agentNo: STATE.agentNo, week: STATE.week }),
            api('getTeamSecretStats', { week: STATE.week })
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
                            <div class="secret-team-name" style="color:${teamColor(myTeam)}">${myTeam}</div>
                            <div class="secret-label">SECRET MISSION BONUS</div>
                        </div>
                        <div class="secret-xp-display">
                            <div class="secret-xp-value">+${myStats.secretXP || 0}</div>
                            <div class="secret-xp-max">/ ${CONFIG.SECRET_MISSIONS.maxTeamBonus} max</div>
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
                        <h3>🎯 Your Missions</h3>
                        <span class="urgent-badge">Action Required</span>
                    </div>
                    <div class="card-body">
                        ${myAssigned.map(m => renderMissionCard(m, myTeam, true)).join('')}
                    </div>
                </div>
            ` : ''}
            
            <!-- Active Team Missions -->
            <div class="card">
                <div class="card-header">
                    <h3>🔒 Team Missions</h3>
                </div>
                <div class="card-body">
                    ${activeMissions.length ? activeMissions.map(m => renderMissionCard(m, myTeam, false)).join('') : `
                        <div class="empty-missions">
                            <div class="empty-icon">📭</div>
                            <p>No active missions</p>
                            <p class="empty-hint">Stand by for orders, Agent.</p>
                        </div>
                    `}
                </div>
            </div>
            
            <!-- All Teams Intel -->
            <div class="card">
                <div class="card-header">
                    <h3>📊 Intel Report</h3>
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
                                    <div class="intel-missions">${tStats.completed || 0}/${CONFIG.SECRET_MISSIONS.maxMissionsPerTeam}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Completed -->
            ${completedMissions.length ? `
                <div class="card">
                    <div class="card-header"><h3>✅ Completed</h3></div>
                    <div class="card-body">
                        ${completedMissions.map(m => `
                            <div class="completed-mission">
                                <span class="completed-icon">${CONFIG.MISSION_TYPES[m.type]?.icon || '✅'}</span>
                                <div class="completed-info">
                                    <div class="completed-title">${sanitize(m.title)}</div>
                                    <div class="completed-date">${new Date(m.createdAt).toLocaleDateString()}</div>
                                </div>
                                <span class="completed-xp">+${m.xpReward}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
        
    } catch (e) {
        console.error('Secret missions error:', e);
        container.innerHTML = `<div class="card"><div class="card-body error-state">Failed to load. <a href="#" onclick="loadPage('secret-missions')">Retry</a></div></div>`;
    }
}

function renderMissionCard(mission, myTeam, isAssigned) {
    const missionInfo = CONFIG.MISSION_TYPES[mission.type] || {};
    const myProgress = mission.progress?.[myTeam] || 0;
    const pct = Math.min((myProgress / mission.goalTarget) * 100, 100);
    const isComplete = mission.completedTeams?.includes(myTeam);
    
    return `
        <div class="secret-mission-card ${isAssigned ? 'assigned' : ''} ${isComplete ? 'complete' : ''}">
            <div class="smc-stamp">${isAssigned ? 'YOUR MISSION' : 'CLASSIFIED'}</div>
            
            <div class="smc-header">
                <span class="smc-icon">${missionInfo.icon || '🔒'}</span>
                <div class="smc-title-section">
                    <div class="smc-type">${missionInfo.name}</div>
                    <div class="smc-title">${sanitize(mission.title)}</div>
                </div>
            </div>
            
            ${mission.assignedAgents?.length ? `
                <div class="smc-agents">
                    <div class="agents-label">Assigned:</div>
                    <div class="agents-list">
                        ${mission.assignedAgents.map(a => {
                            const isMe = String(a.agentNo) === String(STATE.agentNo);
                            return `<span class="agent-tag ${isMe ? 'is-me' : ''}" style="color:${teamColor(a.team)}">${isMe ? '👤 YOU' : `#${a.agentNo}`} (${a.team})</span>`;
                        }).join(' + ')}
                    </div>
                </div>
            ` : ''}
            
            <div class="smc-briefing">${sanitize(mission.briefing)}</div>
            
            ${mission.type === 'decode' && mission.encodedClue ? `
                <div class="smc-decode">
                    <div class="decode-label">🔐 DECODE:</div>
                    <div class="decode-clue">${sanitize(mission.encodedClue)}</div>
                </div>
            ` : ''}
            
            ${mission.targetTrack ? `
                <div class="smc-target">
                    <span class="target-label">TARGET:</span>
                    <span class="target-track">${sanitize(mission.targetTrack)}</span>
                    <span class="target-goal">${mission.goalTarget} streams</span>
                </div>
            ` : ''}
            
            <div class="smc-progress">
                <div class="progress-header">
                    <span>Progress</span>
                    <span>${myProgress}/${mission.goalTarget}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill ${isComplete ? 'complete' : ''}" style="width:${pct}%;background:${teamColor(myTeam)}"></div>
                </div>
                ${isComplete ? `<div class="progress-complete">✅ +${mission.xpReward} XP earned!</div>` : `<div class="progress-remaining">${mission.goalTarget - myProgress} more needed</div>`}
            </div>
            
            ${mission.deadline ? `<div class="smc-deadline">⏰ ${new Date(mission.deadline).toLocaleString()}</div>` : ''}
            
            <div class="smc-footer">
                <span class="smc-reward">⭐ +${mission.xpReward} XP</span>
                <span class="smc-id">${mission.id}</span>
            </div>
        </div>
    `;
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
        `).join('') : '<p class="empty-text">No data</p>';
    
    $('profile-albums').innerHTML = Object.keys(albumContributions).length ?
        Object.entries(albumContributions).sort((a, b) => b[1] - a[1]).map(([a, c]) => `
            <div class="contrib-item"><span>${sanitize(a)}</span><span>${fmt(c)}</span></div>
        `).join('') : '<p class="empty-text">No data</p>';
    
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
        $('rankings-list').innerHTML = (data.rankings || []).map((r, i) => {
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
    } catch (e) {
        $('rankings-list').innerHTML = '<p class="error-text">Failed to load</p>';
    }
}

// ==================== GOALS PAGE ====================
async function renderGoals() {
    const container = $('goals-content');
    try {
        const data = await api('getGoalsProgress', { week: STATE.week });
        const team = STATE.data?.profile?.team;
        
        let html = '';
        
        // Track Goals
        const trackGoals = data.trackGoals || {};
        if (Object.keys(trackGoals).length) {
            html += '<div class="card"><div class="card-header"><h3>🎵 Track Goals</h3></div><div class="card-body">';
            for (const [track, info] of Object.entries(trackGoals)) {
                const tp = info.teams?.[team] || {};
                const done = tp.status === 'Completed';
                html += `
                    <div class="goal-item">
                        <div class="goal-header">
                            <span>${sanitize(track)}</span>
                            <span class="${done ? 'complete' : ''}">${fmt(tp.current || 0)}/${fmt(info.goal)} ${done ? '✅' : ''}</span>
                        </div>
                        <div class="progress-bar"><div class="progress-fill ${done ? 'complete' : ''}" style="width:${Math.min(100, tp.percentage || 0)}%"></div></div>
                    </div>
                `;
            }
            html += '</div></div>';
        }
        
        // Album Goals
        const albumGoals = data.albumGoals || {};
        if (Object.keys(albumGoals).length) {
            html += '<div class="card"><div class="card-header"><h3>💿 Album Goals</h3></div><div class="card-body">';
            for (const [album, info] of Object.entries(albumGoals)) {
                const ap = info.teams?.[team] || {};
                const done = ap.status === 'Completed';
                html += `
                    <div class="goal-item">
                        <div class="goal-header">
                            <span>${sanitize(album)}</span>
                            <span class="${done ? 'complete' : ''}">${fmt(ap.current || 0)}/${fmt(info.goal)} ${done ? '✅' : ''}</span>
                        </div>
                        <div class="progress-bar"><div class="progress-fill ${done ? 'complete' : ''}" style="width:${Math.min(100, ap.percentage || 0)}%"></div></div>
                    </div>
                `;
            }
            html += '</div></div>';
        }
        
        container.innerHTML = html || '<div class="card"><div class="card-body"><p class="empty-text">No goals</p></div></div>';
    } catch (e) {
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load</p></div></div>';
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
    
    const allComplete = completedCount === trackResults.length;
    const pct = trackResults.length ? Math.round((completedCount / trackResults.length) * 100) : 0;
    
    container.innerHTML = `
        <div class="card" style="border-color:${allComplete ? 'var(--success)' : 'var(--purple-main)'}">
            <div class="card-body" style="text-align:center;padding:30px;">
                <div style="font-size:56px;margin-bottom:16px;">${allComplete ? '🎉' : '⏳'}</div>
                <div style="font-size:32px;font-weight:700;color:${allComplete ? 'var(--success)' : 'var(--purple-glow)'}">${completedCount}/${trackResults.length}</div>
                <p style="color:var(--text-dim);">Tracks with 2+ streams</p>
                <div class="progress-bar" style="margin:20px auto;max-width:300px;height:12px;">
                    <div class="progress-fill ${allComplete ? 'complete' : ''}" style="width:${pct}%"></div>
                </div>
                <p style="color:${allComplete ? 'var(--success)' : 'var(--purple-light)'}">${allComplete ? '🎊 Complete!' : `${pct}%`}</p>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header"><h3>💿 ${sanitize(albumName)}</h3></div>
            <div class="card-body">
                ${trackResults.map((t, i) => `
                    <div class="track-item" style="border-left-color:${t.passed ? 'var(--success)' : 'var(--danger)'}">
                        <span class="track-num">${i + 1}</span>
                        <span class="track-name">${sanitize(t.name)}</span>
                        <span class="track-status ${t.passed ? 'pass' : 'fail'}">${t.count}/2 ${t.passed ? '✅' : '❌'}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ==================== TEAM LEVEL PAGE ====================
async function renderTeamLevel() {
    const container = $('team-level-content');
    try {
        const summary = await api('getWeeklySummary', { week: STATE.week });
        const teams = summary.teams || {};
        const myTeam = STATE.data?.profile?.team;
        
        container.innerHTML = `
            <div class="team-level-grid">
                ${Object.entries(teams).sort((a, b) => (b[1].teamXP || 0) - (a[1].teamXP || 0)).map(([t, info]) => {
                    const isMyTeam = t === myTeam;
                    const missions = (info.trackGoalPassed ? 1 : 0) + (info.albumGoalPassed ? 1 : 0) + (info.album2xPassed ? 1 : 0);
                    
                    return `
                        <div class="team-level-card ${isMyTeam ? 'my-team' : ''}" style="border-color:${teamColor(t)}">
                            ${isMyTeam ? '<div class="my-team-badge">Your Team</div>' : ''}
                            ${teamPfp(t) ? `<img src="${teamPfp(t)}" class="team-level-pfp" style="border-color:${teamColor(t)}">` : ''}
                            <div class="team-level-name" style="color:${teamColor(t)}">${t}</div>
                            <div class="team-level-num">${info.level || 1}</div>
                            <div class="team-level-label">LEVEL</div>
                            <div class="team-level-xp">${fmt(info.teamXP)} XP</div>
                            ${info.secretXP ? `<div class="team-level-secret">+${info.secretXP} secret</div>` : ''}
                            <div class="team-level-missions">
                                <div class="mission-check">${info.trackGoalPassed ? '🎵✅' : '🎵❌'}</div>
                                <div class="mission-check">${info.albumGoalPassed ? '💿✅' : '💿❌'}</div>
                                <div class="mission-check">${info.album2xPassed ? '✨✅' : '✨❌'}</div>
                            </div>
                            <div class="team-level-status ${missions === 3 ? 'complete' : ''}">${missions}/3 missions</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } catch (e) {
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load</p></div></div>';
    }
}

// ==================== COMPARISON PAGE ====================
async function renderComparison() {
    const container = $('comparison-content');
    try {
        const [comparison, goals] = await Promise.all([
            api('getTeamComparison', { week: STATE.week }),
            api('getGoalsProgress', { week: STATE.week })
        ]);
        
        const teams = (comparison.comparison || []).sort((a, b) => (b.teamXP || 0) - (a.teamXP || 0));
        const maxXP = teams[0]?.teamXP || 1;
        
        container.innerHTML = `
            <div class="card">
                <div class="card-header"><h3>⚔️ Battle Standings</h3></div>
                <div class="card-body">
                    ${teams.map((t, i) => `
                        <div class="comparison-item">
                            <span class="comparison-rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
                            ${teamPfp(t.team) ? `<img src="${teamPfp(t.team)}" class="comparison-pfp">` : ''}
                            <span class="comparison-name" style="color:${teamColor(t.team)}">${t.team}</span>
                            <div class="comparison-bar-container">
                                <div class="progress-bar"><div class="progress-fill" style="width:${(t.teamXP/maxXP)*100}%;background:${teamColor(t.team)}"></div></div>
                            </div>
                            <span class="comparison-xp">${fmt(t.teamXP)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="card">
                <div class="card-header"><h3>📊 Mission Status</h3></div>
                <div class="card-body">
                    <table class="comparison-table">
                        <thead><tr><th>Team</th><th>Lv</th><th>🎵</th><th>💿</th><th>✨</th></tr></thead>
                        <tbody>
                            ${teams.map(t => `
                                <tr>
                                    <td style="color:${teamColor(t.team)}">${t.team}</td>
                                    <td>${t.level}</td>
                                    <td>${t.missions?.tracks ? '✅' : '❌'}</td>
                                    <td>${t.missions?.albums ? '✅' : '❌'}</td>
                                    <td>${t.missions?.album2x ? '✅' : '❌'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load</p></div></div>';
    }
}

// ==================== SUMMARY PAGE ====================
async function renderSummary() {
    const container = $('summary-content');
    
    if (!isSunday()) {
        const days = getDaysUntilSunday();
        container.innerHTML = `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:60px 20px;">
                    <div style="font-size:64px;margin-bottom:20px;">🔒</div>
                    <h2>Summary Locked</h2>
                    <p style="color:var(--text-dim);margin:16px 0;">Results available on Sunday</p>
                    <div class="countdown-box">
                        <div class="countdown-value">${days}</div>
                        <div class="countdown-label">day${days !== 1 ? 's' : ''} left</div>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    try {
        const [summary, winners] = await Promise.all([
            api('getWeeklySummary', { week: STATE.week }),
            api('getWeeklyWinners').catch(() => ({ winners: [] }))
        ]);
        
        const teams = summary.teams || {};
        const winner = summary.winner;
        const sorted = Object.entries(teams).sort((a, b) => b[1].teamXP - a[1].teamXP);
        
        container.innerHTML = `
            ${winner ? `
                <div class="card winner-card" style="border-color:${teamColor(winner)}">
                    <div class="card-body" style="text-align:center;padding:40px;">
                        <div style="font-size:64px;margin-bottom:16px;">🏆</div>
                        ${teamPfp(winner) ? `<img src="${teamPfp(winner)}" style="width:80px;height:80px;border-radius:50%;border:3px solid ${teamColor(winner)};margin-bottom:16px;">` : ''}
                        <h2 style="color:${teamColor(winner)}">${winner} WINS!</h2>
                        <p style="font-size:24px;color:var(--purple-glow)">${fmt(teams[winner]?.teamXP)} XP</p>
                    </div>
                </div>
            ` : ''}
            
            <div class="card">
                <div class="card-header"><h3>📊 Final Standings</h3></div>
                <div class="card-body">
                    ${sorted.map(([t, info], i) => `
                        <div class="final-standing" style="border-left-color:${teamColor(t)}">
                            <span class="standing-pos">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
                            ${teamPfp(t) ? `<img src="${teamPfp(t)}" class="standing-pfp-sm">` : ''}
                            <div class="standing-details">
                                <div style="color:${teamColor(t)};font-weight:600;">${t}</div>
                                <div style="font-size:12px;color:var(--text-dim);">Level ${info.level}</div>
                            </div>
                            <div class="standing-xp-final">${fmt(info.teamXP)} XP</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load</p></div></div>';
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
                <div class="card-header"><h3>📋 Agent Summary</h3></div>
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
                        <div class="drawer-stat"><span class="value">${fmt(stats.totalXP)}</span><span class="label">XP</span></div>
                        <div class="drawer-stat"><span class="value">#${STATE.data?.rank || 'N/A'}</span><span class="label">Rank</span></div>
                        <div class="drawer-stat"><span class="value">${(badges.badges || []).length}</span><span class="label">Badges</span></div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header"><h3>🎖️ Badges</h3></div>
                <div class="card-body">
                    ${(badges.badges || []).length ? `
                        <div class="badges-showcase">
                            ${badges.badges.map(b => `
                                <div class="badge-showcase-item">
                                    <div class="badge-icon-lg">${b.imageUrl ? `<img src="${b.imageUrl}">` : '🎖️'}</div>
                                    <div class="badge-name">${sanitize(b.name)}</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<p class="empty-text">No badges yet</p>'}
                </div>
            </div>
            
            ${myWins.length ? `
                <div class="card">
                    <div class="card-header"><h3>🏆 Team Victories</h3></div>
                    <div class="card-body">
                        ${myWins.map(w => `
                            <div class="victory-item">
                                <span>${w.week}</span>
                                <span style="color:var(--success)">🏆 ${fmt(w.teamXP)} XP</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    } catch (e) {
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load</p></div></div>';
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
                        ${a.priority === 'high' ? '<span class="urgent-badge">IMPORTANT</span>' : ''}
                    </div>
                    <h3>${sanitize(a.title)}</h3>
                    <p>${sanitize(a.message)}</p>
                </div>
            </div>
        `).join('') : `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:40px;">
                    <div style="font-size:48px;margin-bottom:16px;">📢</div>
                    <p style="color:var(--text-dim);">No announcements</p>
                </div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load</p></div></div>';
    }
}

// ==================== CHARTS ====================
async function renderTeamCharts() {
    try {
        const summary = await api('getWeeklySummary', { week: STATE.week });
        const teams = summary.teams || {};
        const teamNames = Object.keys(teams);
        
        if (STATE.charts.teamXP) STATE.charts.teamXP.destroy();
        
        const ctx = $('chart-team-xp')?.getContext('2d');
        if (ctx) {
            STATE.charts.teamXP = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: teamNames,
                    datasets: [{
                        label: 'XP',
                        data: teamNames.map(t => teams[t].teamXP || 0),
                        backgroundColor: teamNames.map(t => teamColor(t))
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, ticks: { color: '#888' } },
                        x: { ticks: { color: '#888' } }
                    }
                }
            });
        }
    } catch (e) {
        console.error('Charts error:', e);
    }
}

async function renderAgentCharts() {
    const trackContributions = STATE.data?.trackContributions || {};
    const albumContributions = STATE.data?.albumContributions || {};
    
    if (STATE.charts.agentTracks) STATE.charts.agentTracks.destroy();
    if (STATE.charts.agentAlbums) STATE.charts.agentAlbums.destroy();
    
    const ctx1 = $('chart-agent-tracks')?.getContext('2d');
    if (ctx1 && Object.keys(trackContributions).length) {
        const sorted = Object.entries(trackContributions).sort((a, b) => b[1] - a[1]).slice(0, 10);
        STATE.charts.agentTracks = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: sorted.map(([k]) => k.length > 20 ? k.substring(0, 20) + '...' : k),
                datasets: [{ data: sorted.map(([, v]) => v), backgroundColor: '#7b2cbf' }]
            },
            options: { responsive: true, indexAxis: 'y', plugins: { legend: { display: false } } }
        });
    }
    
    const ctx2 = $('chart-agent-albums')?.getContext('2d');
    if (ctx2 && Object.keys(albumContributions).length) {
        STATE.charts.agentAlbums = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: Object.keys(albumContributions),
                datasets: [{ data: Object.values(albumContributions), backgroundColor: ['#7b2cbf', '#9d4edd', '#c77dff', '#4cc9f0', '#f72585'] }]
            },
            options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#e0e0f0' } } } }
        });
    }
}

// ==================== START ====================
document.addEventListener('DOMContentLoaded', initApp);

// Global exports
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
window.addAgentRow = addAgentRow;
window.updateMissionPreview = updateMissionPreview;
window.createTeamMission = createTeamMission;
window.adminCompleteMission = adminCompleteMission;
window.adminCancelMission = adminCancelMission;
window.switchAdminTab = switchAdminTab;

console.log('🎮 BTS Spy Battle Loaded');
