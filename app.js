// ===== APP.JS - DEBUG VERSION =====

// ==================== CONFIGURATION ====================
const CONFIG = {
    API_BASE_URL: 'https://script.google.com/macros/s/AKfycbx5ArHi5Ws0NxMa9nhORy6bZ7ZYpW4urPIap24tax9H1HLuGQxYRCgTVwDaKOMrZ7JOGA/exec',

    TEAM_COLORS: {
        'Indigo': '#4cc9f0',
        'Echo': '#f72585',
        'Agust D': '#ff9500',
        'JITB': '#7209b7'
    },

    TEAM_PFPS: {
        'Indigo': 'https://i.ibb.co/V0124fWL/team-indigoo.png',
        'Echo': 'https://i.ibb.co/xwYRSyx/Team-Echo.png',
        'Agust D': 'https://i.ibb.co/BVc11nz9/Team-agustd.png',
        'JITB': 'https://i.ibb.co/FbdLFwhv/Team-jitb.png'
    }
};

// ==================== STATE ====================
const STATE = {
    agentNo: null,
    currentWeek: null,
    currentPage: 'home',
    agentData: null,
    allWeeks: [],
    charts: {}
};

// ==================== UTILS ====================
function showLoading(show = true) {
    console.log('showLoading:', show);
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        if (show) {
            overlay.classList.add('active');
            overlay.style.display = 'flex';
        } else {
            overlay.classList.remove('active');
            overlay.style.display = 'none';
        }
    } else {
        console.warn('Loading overlay not found!');
    }
}

function showAlert(message, type = 'info') {
    console.log('Alert:', type, message);
    const container = document.getElementById('alert-container');
    if (!container) {
        alert(message); // Fallback to browser alert
        return;
    }
    
    const alertEl = document.createElement('div');
    alertEl.className = `alert alert-${type}`;
    alertEl.innerHTML = `<span>⚠️</span><span>${message}</span>`;
    container.appendChild(alertEl);
    setTimeout(() => alertEl.remove(), 5000);
}

function getTeamColor(team) {
    return CONFIG.TEAM_COLORS[team] || '#d4af37';
}

function getTeamPFP(team) {
    return CONFIG.TEAM_PFPS[team] || '';
}

function getTeamClass(team) {
    if (!team) return '';
    return team.toLowerCase().replace(/\s+/g, '-');
}

function formatNumber(num) {
    return Number(num || 0).toLocaleString();
}

function updateLastUpdate() {
    const el = document.getElementById('last-update');
    if (el) {
        el.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
}

// ==================== API CALL ====================
async function apiCall(action, params = {}) {
    const url = new URL(CONFIG.API_BASE_URL);
    url.searchParams.set('action', action);
    
    Object.entries(params).forEach(([k, v]) => {
        if (v !== null && v !== undefined) {
            url.searchParams.set(k, v);
        }
    });

    console.log('🌐 API Call:', action, params);
    console.log('🔗 Full URL:', url.toString());

    try {
        const res = await fetch(url.toString());
        console.log('📡 Response status:', res.status);
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const text = await res.text();
        console.log('📄 Raw response:', text.substring(0, 500));
        
        let data;
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            console.error('❌ JSON parse error:', parseError);
            throw new Error('Invalid JSON response from server');
        }

        console.log('✅ API Response:', action, data);

        if (data.error) {
            throw new Error(data.error);
        }
        
        return data;
    } catch (error) {
        console.error('❌ API Error:', error);
        throw error;
    }
}

// ==================== LOGIN ====================
function initLogin() {
    console.log('🚀 Initializing login...');
    
    // Check for saved session
    const saved = localStorage.getItem('spyBattleAgent');
    console.log('💾 Saved agent:', saved);
    
    if (saved) {
        STATE.agentNo = saved;
        showDashboard();
        return;
    }

    // Get elements
    const loginBtn = document.getElementById('login-btn');
    const findBtn = document.getElementById('find-agent-btn');
    const agentInput = document.getElementById('agent-input');
    const instaInput = document.getElementById('instagram-input');

    console.log('🔍 Elements found:', {
        loginBtn: !!loginBtn,
        findBtn: !!findBtn,
        agentInput: !!agentInput,
        instaInput: !!instaInput
    });

    // Add event listeners
    if (loginBtn) {
        console.log('✅ Adding click listener to login button');
        loginBtn.addEventListener('click', function(e) {
            console.log('🖱️ Login button clicked!');
            e.preventDefault();
            handleLogin();
        });
    } else {
        console.error('❌ Login button not found!');
    }

    if (findBtn) {
        findBtn.addEventListener('click', function(e) {
            console.log('🖱️ Find button clicked!');
            e.preventDefault();
            handleFindAgent();
        });
    }

    if (agentInput) {
        agentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('⌨️ Enter pressed in agent input');
                e.preventDefault();
                handleLogin();
            }
        });
    }

    if (instaInput) {
        instaInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleFindAgent();
            }
        });
    }
    
    console.log('✅ Login initialization complete');
}

async function handleLogin() {
    console.log('========== LOGIN STARTED ==========');
    
    const agentInput = document.getElementById('agent-input');
    if (!agentInput) {
        console.error('❌ Agent input field not found!');
        showAlert('Error: Input field not found', 'error');
        return;
    }
    
    const agentNo = agentInput.value.trim();
    console.log('📝 Agent number entered:', agentNo);

    if (!agentNo) {
        console.log('⚠️ Empty agent number');
        showFindResult('Please enter your Agent Number', 'error');
        return;
    }

    showLoading(true);

    try {
        console.log('📡 Fetching all agents...');
        const allAgents = await apiCall('getAllAgents');
        console.log('📋 All agents response:', allAgents);

        if (!allAgents || !allAgents.agents) {
            console.error('❌ Invalid response - no agents array');
            showLoading(false);
            showFindResult('Server error: Invalid response', 'error');
            return;
        }

        console.log('👥 Total agents:', allAgents.agents.length);
        
        // Find matching agent
        const matchingAgent = allAgents.agents.find(a => {
            const agentNoStr = String(a.agentNo || '').trim();
            const inputStr = String(agentNo).trim();
            console.log(`Comparing: "${agentNoStr}" with "${inputStr}"`);
            return agentNoStr === inputStr;
        });
        
        console.log('🔍 Matching agent:', matchingAgent);

        if (!matchingAgent) {
            console.log('❌ Agent not found');
            showLoading(false);
            showFindResult('Agent Number not found. Please check and try again.', 'error');
            return;
        }

        console.log('✅ Agent found! Saving to localStorage...');
        localStorage.setItem('spyBattleAgent', agentNo);
        STATE.agentNo = agentNo;

        console.log('🏠 Loading dashboard...');
        await showDashboard();

    } catch (err) {
        console.error('❌ Login error:', err);
        showLoading(false);
        showFindResult('Login failed: ' + (err.message || 'Unknown error'), 'error');
    }
}

async function handleFindAgent() {
    console.log('========== FIND AGENT STARTED ==========');
    
    const instaInput = document.getElementById('instagram-input');
    if (!instaInput) {
        showAlert('Error: Input field not found', 'error');
        return;
    }
    
    const instagram = instaInput.value.trim();
    console.log('📝 Instagram entered:', instagram);

    if (!instagram) {
        showFindResult('Please enter your Instagram username', 'error');
        return;
    }

    showLoading(true);

    try {
        const res = await apiCall('getAgentByInstagram', { instagram: instagram });
        console.log('📋 Find result:', res);

        showLoading(false);

        if (res.result && res.result.includes('Your Agent Number is:')) {
            const agentNo = res.result.split(':')[1].trim();
            const agentInput = document.getElementById('agent-input');
            if (agentInput) agentInput.value = agentNo;
            showFindResult(res.result, 'success');
        } else {
            showFindResult(res.result || 'Instagram username not found', 'error');
        }
    } catch (err) {
        console.error('❌ Find agent error:', err);
        showLoading(false);
        showFindResult('Search failed: ' + err.message, 'error');
    }
}

function showFindResult(msg, type) {
    console.log('📢 Find result:', type, msg);
    const el = document.getElementById('find-result');
    if (el) {
        el.textContent = msg;
        el.className = `find-result show ${type}`;
        el.style.display = 'block';
    } else {
        console.warn('Find result element not found');
        showAlert(msg, type);
    }
}

// ==================== DASHBOARD ====================
async function showDashboard() {
    console.log('========== LOADING DASHBOARD ==========');
    console.log('Agent No:', STATE.agentNo);
    
    showLoading(true);

    try {
        // Get weeks
        console.log('📅 Fetching weeks...');
        const weeksData = await apiCall('getAvailableWeeks');
        console.log('📅 Weeks:', weeksData);

        STATE.allWeeks = weeksData.weeks || [];
        STATE.currentWeek = weeksData.current || STATE.allWeeks[0];

        if (!STATE.currentWeek) {
            throw new Error('No weeks available');
        }

        // Get agent data
        console.log('👤 Fetching agent data...');
        const agentData = await apiCall('getAgentData', {
            agentNo: STATE.agentNo,
            week: STATE.currentWeek
        });
        console.log('👤 Agent data:', agentData);

        STATE.agentData = agentData;

        // Switch screens
        console.log('🔄 Switching to dashboard screen...');
        
        const loginScreen = document.getElementById('login-screen');
        const dashboardScreen = document.getElementById('dashboard-screen');

        console.log('Elements:', {
            loginScreen: !!loginScreen,
            dashboardScreen: !!dashboardScreen
        });

        if (loginScreen) {
            loginScreen.style.display = 'none';
            loginScreen.classList.remove('active');
        }

        if (dashboardScreen) {
            dashboardScreen.style.display = 'block';
            dashboardScreen.classList.add('active');
        }

        // Initialize dashboard
        console.log('🎛️ Initializing dashboard...');
        initDashboard();
        
        // Load home page
        console.log('🏠 Loading home page...');
        await loadPage('home');
        
        showLoading(false);
        console.log('✅ Dashboard loaded successfully!');

    } catch (err) {
        console.error('❌ Dashboard error:', err);
        showLoading(false);
        showAlert('Failed to load dashboard: ' + err.message, 'danger');
        
        // Clear saved data and show login
        localStorage.removeItem('spyBattleAgent');
        STATE.agentNo = null;
        
        const loginScreen = document.getElementById('login-screen');
        const dashboardScreen = document.getElementById('dashboard-screen');
        
        if (loginScreen) {
            loginScreen.style.display = 'flex';
            loginScreen.classList.add('active');
        }
        if (dashboardScreen) {
            dashboardScreen.style.display = 'none';
            dashboardScreen.classList.remove('active');
        }
    }
}

function initDashboard() {
    console.log('Initializing dashboard components...');
    
    updateAgentInfo();
    populateWeekSelector();
    setupNavigation();
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = logout;
    }
    
    setupMobileMenu();
    updateLastUpdate();
    setInterval(updateLastUpdate, 60000);
}

function updateAgentInfo() {
    const p = STATE.agentData?.profile;
    if (!p) {
        console.warn('No profile data');
        return;
    }

    console.log('Updating agent info:', p);

    const color = getTeamColor(p.team);
    const initial = (p.name || 'A').charAt(0).toUpperCase();
    const pfp = getTeamPFP(p.team);
    const teamClass = 'team-' + getTeamClass(p.team);

    // Sidebar
    const agentAvatar = document.getElementById('agent-avatar');
    if (agentAvatar) {
        agentAvatar.className = `agent-avatar ${teamClass}`;
        if (pfp) {
            agentAvatar.innerHTML = `<img src="${pfp}" alt="${p.team}" onerror="this.parentElement.innerHTML='<span>${initial}</span>'">`;
        } else {
            agentAvatar.innerHTML = `<span>${initial}</span>`;
            agentAvatar.style.background = `linear-gradient(135deg, ${color}, ${color}dd)`;
        }
    }

    const agentName = document.getElementById('agent-name');
    if (agentName) agentName.textContent = p.name || 'Agent';

    const agentTeam = document.getElementById('agent-team');
    if (agentTeam) {
        agentTeam.textContent = p.team || 'Unknown';
        agentTeam.style.color = color;
    }

    const agentId = document.getElementById('agent-id');
    if (agentId) agentId.textContent = `ID: ${STATE.agentNo}`;

    // Profile page
    const profileAvatar = document.getElementById('profile-avatar');
    if (profileAvatar) {
        profileAvatar.className = `profile-avatar ${teamClass}`;
        if (pfp) {
            profileAvatar.innerHTML = `<img src="${pfp}" alt="${p.team}" onerror="this.parentElement.innerHTML='<span>${initial}</span>'">`;
        } else {
            profileAvatar.innerHTML = `<span>${initial}</span>`;
            profileAvatar.style.background = `linear-gradient(135deg, ${color}, ${color}dd)`;
        }
    }

    const profileName = document.getElementById('profile-name');
    if (profileName) profileName.textContent = p.name || 'Agent';

    const profileTeam = document.getElementById('profile-team');
    if (profileTeam) {
        profileTeam.textContent = p.team || 'Unknown';
        profileTeam.style.color = color;
    }

    const profileId = document.getElementById('profile-id');
    if (profileId) profileId.textContent = `ID: ${STATE.agentNo}`;
}

function populateWeekSelector() {
    const select = document.getElementById('week-select');
    if (!select) return;

    select.innerHTML = STATE.allWeeks.map(w =>
        `<option value="${w}" ${w === STATE.currentWeek ? 'selected' : ''}>${w}</option>`
    ).join('');

    select.onchange = async () => {
        STATE.currentWeek = select.value;
        showLoading(true);
        
        try {
            STATE.agentData = await apiCall('getAgentData', {
                agentNo: STATE.agentNo,
                week: STATE.currentWeek
            });
            await loadPage(STATE.currentPage);
        } catch (err) {
            console.error('Week change error:', err);
            showAlert('Failed to load week data', 'danger');
        } finally {
            showLoading(false);
        }
    };
}

function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) {
                loadPage(page);
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                closeMobileMenu();
            }
        };
    });

    document.querySelectorAll('.mission-card').forEach(card => {
        card.onclick = () => {
            const nav = card.dataset.nav;
            if (nav) {
                const navLink = document.querySelector(`.nav-link[data-page="${nav}"]`);
                if (navLink) navLink.click();
            }
        };
    });
}

function setupMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const closeBtn = document.getElementById('sidebar-close');

    if (menuBtn && sidebar) {
        menuBtn.onclick = () => sidebar.classList.add('open');
    }
    if (closeBtn) {
        closeBtn.onclick = closeMobileMenu;
    }
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('open');
}

function logout() {
    console.log('Logging out...');
    localStorage.removeItem('spyBattleAgent');
    STATE.agentNo = null;
    STATE.agentData = null;
    location.reload();
}

// ==================== PAGE LOADER ====================
async function loadPage(page) {
    console.log('📄 Loading page:', page);
    STATE.currentPage = page;
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });
    
    // Show target page
    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.style.display = 'block';
    }

    showLoading(true);

    try {
        switch(page) {
            case 'home': await loadHomePage(); break;
            case 'profile': await loadProfilePage(); break;
            case 'rankings': await loadRankingsPage(); break;
            case 'goals': await loadGoalsPage(); break;
            case 'album2x': await loadAlbum2xPage(); break;
            case 'team-level': await loadTeamLevelPage(); break;
            case 'team-charts': await loadTeamChartsPage(); break;
            case 'team-comparison': await loadTeamComparisonPage(); break;
            case 'summary': await loadSummaryPage(); break;
            case 'drawer': await loadDrawerPage(); break;
            case 'announcements': await loadAnnouncementsPage(); break;
            default: console.warn('Unknown page:', page);
        }
    } catch (err) {
        console.error('Page load error:', err);
        showAlert('Failed to load page: ' + err.message, 'danger');
    } finally {
        showLoading(false);
    }
}

// ==================== HOME PAGE ====================
async function loadHomePage() {
    console.log('Loading home page...');
    
    const currentWeekDisplay = document.getElementById('current-week-display');
    if (currentWeekDisplay) {
        currentWeekDisplay.textContent = `Active Week: ${STATE.currentWeek}`;
    }

    try {
        const [summary, rankings, goalsData] = await Promise.all([
            apiCall('getWeeklySummary', { week: STATE.currentWeek }),
            apiCall('getRankings', { week: STATE.currentWeek, limit: 5 }),
            apiCall('getGoalsProgress', { week: STATE.currentWeek })
        ]);

        const team = STATE.agentData?.profile?.team;
        const teamInfo = summary.teams?.[team] || {};

        // Update mission status
        updateMissionStatus('home-track-status', teamInfo.trackGoalPassed);
        updateMissionStatus('home-album-status', teamInfo.albumGoalPassed);
        updateMissionStatus('home-2x-status', teamInfo.album2xPassed);

        // Top performers
        const rankingsList = rankings.rankings || [];
        const performersHTML = rankingsList.map((r, i) => `
            <div class="stat-box">
                <div class="rank-badge">${i + 1}</div>
                <div style="margin-top: 12px; font-size: 14px; font-weight: bold;">${r.name || 'Unknown'}</div>
                <div style="margin-top: 8px; color: ${getTeamColor(r.team)};">${r.team || 'Unknown'}</div>
                <div style="color: var(--primary); font-weight: bold; margin-top: 8px;">${formatNumber(r.totalXP)} XP</div>
            </div>
        `).join('');

        const topPerformersEl = document.getElementById('home-top-performers');
        if (topPerformersEl) {
            topPerformersEl.innerHTML = performersHTML 
                ? `<div class="stats-grid">${performersHTML}</div>`
                : '<p>No rankings available</p>';
        }

        // Team standings
        const teams = Object.keys(summary.teams || {});
        const standingsHTML = teams.map(t => {
            const data = summary.teams[t];
            const pfp = getTeamPFP(t);
            
            return `
                <div class="stat-box" style="border-color: ${getTeamColor(t)};">
                    ${pfp ? `<img src="${pfp}" alt="${t}" style="width: 48px; height: 48px; border-radius: 50%; margin-bottom: 8px;">` : ''}
                    <div style="color: ${getTeamColor(t)}; font-weight: bold;">${t}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Level ${data.level || 0}</div>
                    <div style="color: var(--primary); font-weight: bold; margin-top: 8px;">${formatNumber(data.teamXP)} XP</div>
                    ${data.isWinner ? '<div style="margin-top: 8px;">🏆</div>' : ''}
                </div>
            `;
        }).join('');

        const standingsEl = document.getElementById('home-team-standings');
        if (standingsEl) {
            standingsEl.innerHTML = standingsHTML 
                ? `<div class="stats-grid">${standingsHTML}</div>`
                : '<p>No team data available</p>';
        }
        
    } catch (err) {
        console.error('Home page error:', err);
        throw err;
    }
}

function updateMissionStatus(elementId, passed) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (passed) {
        element.textContent = '✅ Completed';
        element.className = 'mission-status completed';
    } else {
        element.textContent = '⏳ In Progress';
        element.className = 'mission-status behind';
    }
}

// ==================== OTHER PAGES ====================
async function loadProfilePage() {
    const p = STATE.agentData?.profile;
    const s = STATE.agentData?.stats;
    if (!p || !s) return;

    const statsContainer = document.getElementById('profile-stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-box"><div class="stat-value">${formatNumber(s.totalXP)}</div><div class="stat-label">Total XP</div></div>
            <div class="stat-box"><div class="stat-value">#${s.rank || 'N/A'}</div><div class="stat-label">Rank</div></div>
            <div class="stat-box"><div class="stat-value">${formatNumber(s.trackCount || 0)}</div><div class="stat-label">Tracks</div></div>
            <div class="stat-box"><div class="stat-value">${formatNumber(s.albumCount || 0)}</div><div class="stat-label">Albums</div></div>
        `;
    }
}

async function loadRankingsPage() {
    const data = await apiCall('getRankings', { week: STATE.currentWeek, limit: 100 });
    const container = document.getElementById('rankings-list');
    if (!container) return;

    const rankings = data.rankings || [];
    container.innerHTML = rankings.length ? rankings.map((r, i) => `
        <div class="ranking-item ${r.agentNo == STATE.agentNo ? 'highlight' : ''}" style="display: flex; align-items: center; padding: 12px; background: var(--glass-bg); border-radius: 8px; margin-bottom: 8px;">
            <div style="width: 40px; font-weight: bold; color: var(--primary);">#${i + 1}</div>
            <div style="flex: 1;"><div style="font-weight: bold;">${r.name}</div><div style="color: ${getTeamColor(r.team)}; font-size: 12px;">${r.team}</div></div>
            <div style="font-weight: bold;">${formatNumber(r.totalXP)} XP</div>
        </div>
    `).join('') : '<p>No rankings available</p>';
}

async function loadGoalsPage() {
    const data = await apiCall('getGoalsProgress', { week: STATE.currentWeek });
    const team = STATE.agentData?.profile?.team;
    const container = document.getElementById('goals-content');
    if (!container) return;

    let html = '<h3>Track Goals</h3>';
    Object.entries(data.trackGoals || {}).forEach(([track, info]) => {
        const teamData = info.teams?.[team] || { current: 0 };
        const progress = Math.min(100, (teamData.current / info.goal) * 100);
        html += `<div style="margin-bottom: 16px;"><div style="display: flex; justify-content: space-between;"><span>${track}</span><span>${teamData.current}/${info.goal}</span></div><div style="background: var(--glass-bg); border-radius: 4px; height: 8px; margin-top: 4px;"><div style="background: var(--primary); height: 100%; border-radius: 4px; width: ${progress}%;"></div></div></div>`;
    });

    html += '<h3 style="margin-top: 24px;">Album Goals</h3>';
    Object.entries(data.albumGoals || {}).forEach(([album, info]) => {
        const teamData = info.teams?.[team] || { current: 0 };
        const progress = Math.min(100, (teamData.current / info.goal) * 100);
        html += `<div style="margin-bottom: 16px;"><div style="display: flex; justify-content: space-between;"><span>${album}</span><span>${teamData.current}/${info.goal}</span></div><div style="background: var(--glass-bg); border-radius: 4px; height: 8px; margin-top: 4px;"><div style="background: var(--primary); height: 100%; border-radius: 4px; width: ${progress}%;"></div></div></div>`;
    });

    container.innerHTML = html;
}

async function loadAlbum2xPage() {
    const data = await apiCall('getAlbum2xProgress', { week: STATE.currentWeek });
    const container = document.getElementById('album2x-content');
    if (!container) return;
    container.innerHTML = '<p>Album 2x data loaded</p>';
}

async function loadTeamLevelPage() {
    const data = await apiCall('getTeamLevels', { week: STATE.currentWeek });
    const container = document.getElementById('team-level-content');
    if (!container) return;
    container.innerHTML = '<p>Team levels loaded</p>';
}

async function loadTeamChartsPage() {
    const container = document.getElementById('team-charts-content');
    if (container) container.innerHTML = '<p>Charts coming soon</p>';
}

async function loadTeamComparisonPage() {
    const data = await apiCall('getTeamComparison', { week: STATE.currentWeek });
    const container = document.getElementById('team-comparison-content');
    if (!container) return;
    container.innerHTML = '<p>Team comparison loaded</p>';
}

async function loadSummaryPage() {
    const data = await apiCall('getWeeklySummary', { week: STATE.currentWeek });
    const container = document.getElementById('summary-content');
    if (!container) return;
    container.innerHTML = '<p>Summary loaded</p>';
}

async function loadDrawerPage() {
    const data = await apiCall('getDrawerEligible', { week: STATE.currentWeek });
    const container = document.getElementById('drawer-content');
    if (!container) return;
    container.innerHTML = '<p>Drawer data loaded</p>';
}

async function loadAnnouncementsPage() {
    const data = await apiCall('getAnnouncements');
    const container = document.getElementById('announcements-content');
    if (!container) return;
    container.innerHTML = '<p>Announcements loaded</p>';
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 DOM loaded, starting app...');
    console.log('📍 Current URL:', window.location.href);
    
    // Debug: List all important elements
    const elements = {
        'login-screen': document.getElementById('login-screen'),
        'dashboard-screen': document.getElementById('dashboard-screen'),
        'login-btn': document.getElementById('login-btn'),
        'agent-input': document.getElementById('agent-input'),
        'loading-overlay': document.getElementById('loading-overlay')
    };
    
    console.log('🔍 Important elements:', Object.fromEntries(
        Object.entries(elements).map(([k, v]) => [k, !!v])
    ));
    
    initLogin();
});

// Also try to init if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('🎮 DOM already ready, initializing...');
    setTimeout(initLogin, 100);
}
