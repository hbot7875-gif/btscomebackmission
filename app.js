// ===== APP.JS - FULLY FIXED VERSION =====

// ==================== CONFIGURATION ====================
const CONFIG = {
    API_BASE_URL: 'https://script.google.com/macros/s/AKfycbx5ArHi5Ws0NxMa9nhORy6bZ7ZYpW4urPIap24tax9H1HLuGQxYRCgTVwDaKOMrZ7JOGA/exec',

    TEAM_COLORS: {
        'Indigo': '#6366f1',
        'Echo': '#ec4899',
        'Agust D': '#f97316',
        'JITB': '#10b981'
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
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.toggle('active', show);
    }
}

function showAlert(message, type = 'info') {
    const container = document.getElementById('alert-container');
    if (!container) return;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `<span>⚠️</span><span>${message}</span>`;
    container.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
}

function updateLastUpdate() {
    const el = document.getElementById('last-update');
    if (!el) return;
    
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    el.textContent = time;
}

function getTeamColor(team) {
    return CONFIG.TEAM_COLORS[team] || '#d4af37';
}

function getTeamPFP(team) {
    return CONFIG.TEAM_PFPS[team] || '';
}

function getTeamClass(team) {
    return team.toLowerCase().replace(/\s+/g, '-');
}

function formatNumber(num) {
    return Number(num).toLocaleString();
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

    console.log('API Call:', url.toString());

    try {
        const res = await fetch(url.toString());
        const data = await res.json();

        console.log('API Response:', data);

        if (data.error) throw new Error(data.error);
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ==================== LOGIN ====================
function initLogin() {
    console.log('Initializing login...');

    const saved = localStorage.getItem('spyBattleAgent');
    if (saved) {
        console.log('Found saved agent:', saved);
        STATE.agentNo = saved;
        showDashboard();
        return;
    }

    const loginBtn = document.getElementById('login-btn');
    const findBtn = document.getElementById('find-agent-btn');
    const agentInput = document.getElementById('agent-input');
    const instaInput = document.getElementById('instagram-input');

    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }

    if (findBtn) {
        findBtn.addEventListener('click', handleFindAgent);
    }

    if (agentInput) {
        agentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
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
}

async function handleLogin() {
    console.log('Login button clicked');
    
    const agentInput = document.getElementById('agent-input');
    const agentNo = agentInput.value.trim();
    
    console.log('Agent input value:', agentNo);

    if (!agentNo) {
        showFindResult('Please enter your Agent Number', 'error');
        return;
    }

    showLoading(true);

    try {
        console.log('Fetching all agents...');
        const allAgents = await apiCall('getAllAgents');
        console.log('All agents response:', allAgents);

        const exists = allAgents.agents.some(a => a.agentNo.toString().trim() === agentNo);
        
        console.log('Agent exists:', exists);

        if (!exists) {
            showLoading(false);
            showFindResult('Agent Number not found. Please check and try again.', 'error');
            return;
        }

        localStorage.setItem('spyBattleAgent', agentNo);
        STATE.agentNo = agentNo;

        console.log('Agent saved, showing dashboard...');
        await showDashboard();

    } catch (err) {
        console.error('Login error:', err);
        showLoading(false);
        showFindResult(err.message || 'Login failed. Please try again.', 'error');
    }
}

async function handleFindAgent() {
    console.log('Find agent button clicked');
    
    const instaInput = document.getElementById('instagram-input');
    const instagram = instaInput.value.trim();
    
    console.log('Instagram input value:', instagram);

    if (!instagram) {
        showFindResult('Please enter your Instagram username', 'error');
        return;
    }

    showLoading(true);

    try {
        console.log('Calling getAgentByInstagram...');
        const res = await apiCall('getAgentByInstagram', { instagram: instagram });
        console.log('Find agent response:', res);

        showLoading(false);

        if (res.result && res.result.includes('Your Agent Number is:')) {
            const agentNo = res.result.split(':')[1].trim();
            document.getElementById('agent-input').value = agentNo;
            showFindResult(res.result, 'success');
        } else {
            showFindResult(res.result || 'Instagram username not found', 'error');
        }
    } catch (err) {
        console.error('Find agent error:', err);
        showLoading(false);
        showFindResult('Search failed. Please try again.', 'error');
    }
}

function showFindResult(msg, type) {
    const el = document.getElementById('find-result');
    if (!el) return;
    
    el.textContent = msg;
    el.className = `find-result show ${type}`;
}

// ==================== DASHBOARD INIT ====================
async function showDashboard() {
    console.log('showDashboard called, agentNo:', STATE.agentNo);
    
    showLoading(true);

    try {
        console.log('Fetching available weeks...');
        const weeksData = await apiCall('getAvailableWeeks');
        console.log('Weeks data:', weeksData);

        STATE.allWeeks = weeksData.weeks || [];
        STATE.currentWeek = weeksData.current || STATE.allWeeks[0];

        console.log('Fetching agent data...');
        const agentData = await apiCall('getAgentData', {
            agentNo: STATE.agentNo,
            week: STATE.currentWeek
        });
        console.log('Agent data:', agentData);

        STATE.agentData = agentData;

        // CRITICAL: Hide login, show dashboard
        const loginScreen = document.getElementById('login-screen');
        const dashboardScreen = document.getElementById('dashboard-screen');

        console.log('Login screen element:', loginScreen);
        console.log('Dashboard screen element:', dashboardScreen);

        if (loginScreen) {
            loginScreen.classList.remove('active');
            loginScreen.style.display = 'none'; // Force hide
        }

        if (dashboardScreen) {
            dashboardScreen.classList.add('active');
            dashboardScreen.style.display = 'block'; // Force show
        }

        console.log('Initializing dashboard components...');
        initDashboard();
        
        console.log('Loading home page...');
        await loadPage('home');
        
        showLoading(false);
        console.log('Dashboard fully loaded');

    } catch (err) {
        console.error('Dashboard error:', err);
        showLoading(false);
        showAlert('Failed to load dashboard. Please try again.', 'danger');
        logout();
    }
}

function initDashboard() {
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

// ==================== FIXED: Single updateAgentInfo function ====================
function updateAgentInfo() {
    const p = STATE.agentData?.profile;
    if (!p) return;

    const color = getTeamColor(p.team);
    const initial = p.name.charAt(0).toUpperCase();
    const pfp = getTeamPFP(p.team);
    const teamClass = 'team-' + getTeamClass(p.team);

    // Update sidebar avatar
    const agentAvatar = document.getElementById('agent-avatar');
    if (agentAvatar) {
        agentAvatar.className = `agent-avatar ${teamClass}`;
        
        if (pfp) {
            agentAvatar.innerHTML = `<img src="${pfp}" alt="${p.team} team" onerror="this.style.display='none'; this.parentElement.innerHTML='<span>${initial}</span>';">`;
        } else {
            agentAvatar.innerHTML = `<span>${initial}</span>`;
            agentAvatar.style.background = `linear-gradient(135deg, ${color}, ${color}dd)`;
        }
    }

    const agentName = document.getElementById('agent-name');
    if (agentName) agentName.textContent = p.name;

    const agentTeam = document.getElementById('agent-team');
    if (agentTeam) {
        agentTeam.textContent = p.team;
        agentTeam.style.color = color;
    }

    const agentId = document.getElementById('agent-id');
    if (agentId) agentId.textContent = `ID: ${STATE.agentNo}`;

    // Update profile page avatar
    const profileAvatar = document.getElementById('profile-avatar');
    if (profileAvatar) {
        profileAvatar.className = `profile-avatar ${teamClass}`;
        
        if (pfp) {
            profileAvatar.innerHTML = `<img src="${pfp}" alt="${p.team} team" onerror="this.style.display='none'; this.parentElement.innerHTML='<span>${initial}</span>';">`;
        } else {
            profileAvatar.innerHTML = `<span>${initial}</span>`;
            profileAvatar.style.background = `linear-gradient(135deg, ${color}, ${color}dd)`;
        }
    }

    const profileName = document.getElementById('profile-name');
    if (profileName) profileName.textContent = p.name;

    const profileTeam = document.getElementById('profile-team');
    if (profileTeam) {
        profileTeam.textContent = p.team;
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
    if (sidebar) {
        sidebar.classList.remove('open');
    }
}

function logout() {
    localStorage.removeItem('spyBattleAgent');
    location.reload();
}

// ==================== PAGE LOADER ====================
async function loadPage(page) {
    STATE.currentPage = page;
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    showLoading(true);

    try {
        const loaders = {
            home: loadHomePage,
            profile: loadProfilePage,
            rankings: loadRankingsPage,
            goals: loadGoalsPage,
            album2x: loadAlbum2xPage,
            'team-level': loadTeamLevelPage,
            'team-charts': loadTeamChartsPage,
            'team-comparison': loadTeamComparisonPage,
            summary: loadSummaryPage,
            drawer: loadDrawerPage,
            announcements: loadAnnouncementsPage
        };
        
        if (loaders[page]) {
            await loaders[page]();
        }
    } catch (err) {
        console.error('Page load error:', err);
        showAlert('Failed to load page data', 'danger');
    } finally {
        showLoading(false);
    }
}

// ==================== HOME PAGE ====================
async function loadHomePage() {
    const currentWeekDisplay = document.getElementById('current-week-display');
    if (currentWeekDisplay) {
        currentWeekDisplay.textContent = `Active Week: ${STATE.currentWeek}`;
    }

    const summary = await apiCall('getWeeklySummary', { week: STATE.currentWeek });
    const rankings = await apiCall('getRankings', { week: STATE.currentWeek, limit: 5 });
    const goalsData = await apiCall('getGoalsProgress', { week: STATE.currentWeek });

    const team = STATE.agentData.profile.team;
    const teamInfo = summary.teams[team] || {};

    updateMissionStatus('home-track-status', teamInfo.trackGoalPassed);
    updateMissionStatus('home-album-status', teamInfo.albumGoalPassed);
    updateMissionStatus('home-2x-status', teamInfo.album2xPassed);

    // Show team goals in mission cards
    let trackGoalsText = '';
    let albumGoalsText = '';

    Object.entries(goalsData.trackGoals || {}).forEach(([track, data]) => {
        if (data.teams[team]) {
            const t = data.teams[team];
            trackGoalsText += `${track}: ${t.current}/${data.goal}<br>`;
        }
    });

    Object.entries(goalsData.albumGoals || {}).forEach(([album, data]) => {
        if (data.teams[team]) {
            const t = data.teams[team];
            albumGoalsText += `${album}: ${t.current}/${data.goal}<br>`;
        }
    });

    const cards = document.querySelectorAll('.mission-card');
    if (cards[0]) {
        const desc = cards[0].querySelector('.mission-desc');
        if (desc) desc.innerHTML = trackGoalsText || 'Complete team track targets';
    }
    if (cards[1]) {
        const desc = cards[1].querySelector('.mission-desc');
        if (desc) desc.innerHTML = albumGoalsText || 'Complete team album targets';
    }

    // Top performers
    const performersHTML = rankings.rankings.map((r, i) => `
        <div class="stat-box">
            <div class="rank-badge">${i + 1}</div>
            <div style="margin-top: 12px; font-size: 14px; font-weight: bold;">${r.name}</div>
            <div class="team-badge ${getTeamClass(r.team)}" style="margin-top: 8px; color: ${getTeamColor(r.team)};">${r.team}</div>
            <div style="color: var(--primary); font-weight: bold; margin-top: 8px;">${r.totalXP} XP</div>
        </div>
    `).join('');

    const topPerformersEl = document.getElementById('home-top-performers');
    if (topPerformersEl) {
        topPerformersEl.innerHTML = `<div class="stats-grid">${performersHTML}</div>`;
    }

    // Team standings with auto-resized PFPs
    const teams = Object.keys(summary.teams);
    const standingsHTML = teams.map(t => {
        const data = summary.teams[t];
        const pfp = getTeamPFP(t);
        const teamClass = 'team-' + getTeamClass(t);
        
        return `
            <div class="stat-box" style="border-color: ${getTeamColor(t)};">
                ${pfp 
                    ? `<div class="team-pfp-container ${teamClass}">
                           <img src="${pfp}" 
                                alt="${t} team" 
                                onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\"font-size:24px;\\">🎭</div>';">
                       </div>` 
                    : `<div style="font-size: 24px; margin-bottom: 8px;">🎭</div>`
                }
                <div style="color: ${getTeamColor(t)}; font-weight: bold; font-size: 16px;">${t}</div>
                <div style="margin-top: 8px; font-size: 12px; color: var(--text-secondary);">
                    Level ${data.level}
                </div>
                <div style="color: var(--primary); font-weight: bold; margin-top: 8px;">
                    ${data.teamXP} XP
                </div>
                ${data.isWinner ? '<div style="margin-top: 8px;">🏆 Winner</div>' : ''}
            </div>
        `;
    }).join('');

    const standingsEl = document.getElementById('home-team-standings');
    if (standingsEl) {
        standingsEl.innerHTML = `<div class="stats-grid">${standingsHTML}</div>`;
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

// Placeholder loaders for other pages (keep your existing implementations)
async function loadProfilePage() {
    console.log('Loading profile page...');
    // Keep your existing implementation
}

async function loadRankingsPage() {
    console.log('Loading rankings page...');
    // Keep your existing implementation
}

async function loadGoalsPage() {
    console.log('Loading goals page...');
    // Keep your existing implementation
}

async function loadAlbum2xPage() {
    console.log('Loading album2x page...');
    // Keep your existing implementation
}

async function loadTeamLevelPage() {
    console.log('Loading team level page...');
    // Keep your existing implementation
}

async function loadTeamChartsPage() {
    console.log('Loading team charts page...');
    // Keep your existing implementation
}

async function loadTeamComparisonPage() {
    console.log('Loading team comparison page...');
    // Keep your existing implementation
}

async function loadSummaryPage() {
    console.log('Loading summary page...');
    // Keep your existing implementation
}

async function loadDrawerPage() {
    console.log('Loading drawer page...');
    // Keep your existing implementation
}

async function loadAnnouncementsPage() {
    console.log('Loading announcements page...');
    // Keep your existing implementation
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    initLogin();
});
