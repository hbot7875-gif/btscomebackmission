// ===== APP.JS - FULLY FIXED VERSION =====

// ==================== CONFIGURATION ====================
const CONFIG = {
    API_BASE_URL: 'https://script.google.com/macros/s/AKfycbx5ArHi5Ws0NxMa9nhORy6bZ7ZYpW4urPIap24tax9H1HLuGQxYRCgTVwDaKOMrZ7JOGA/exec',

    TEAM_COLORS: {
        'Indigo': '#4cc9f0',
        'Echo': '#f72585',
        'Agust D': '#ff9500',
        'JITB': '#7209b7'
    }, // ✅ ADDED COMMA

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
    if (!team) return '';
    return team.toLowerCase().replace(/\s+/g, '-');
}

function formatNumber(num) {
    return Number(num || 0).toLocaleString();
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

    console.log('API Call:', action, params);

    try {
        const res = await fetch(url.toString());
        const data = await res.json();

        console.log('API Response:', action, data);

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
    const agentNo = agentInput ? agentInput.value.trim() : '';
    
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

        const agents = allAgents.agents || [];
        const exists = agents.some(a => a.agentNo && a.agentNo.toString().trim() === agentNo);
        
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
    const instagram = instaInput ? instaInput.value.trim() : '';
    
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
            const agentInput = document.getElementById('agent-input');
            if (agentInput) agentInput.value = agentNo;
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

        if (!STATE.currentWeek) {
            throw new Error('No weeks available');
        }

        console.log('Fetching agent data for week:', STATE.currentWeek);
        const agentData = await apiCall('getAgentData', {
            agentNo: STATE.agentNo,
            week: STATE.currentWeek
        });
        console.log('Agent data:', agentData);

        STATE.agentData = agentData;

        // Hide login, show dashboard
        const loginScreen = document.getElementById('login-screen');
        const dashboardScreen = document.getElementById('dashboard-screen');

        console.log('Login screen element:', loginScreen);
        console.log('Dashboard screen element:', dashboardScreen);

        if (loginScreen) {
            loginScreen.classList.remove('active');
            loginScreen.style.display = 'none';
        }

        if (dashboardScreen) {
            dashboardScreen.classList.add('active');
            dashboardScreen.style.display = 'block';
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
        showAlert('Failed to load dashboard: ' + err.message, 'danger');
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

function updateAgentInfo() {
    const p = STATE.agentData?.profile;
    if (!p) {
        console.warn('No profile data available');
        return;
    }

    const color = getTeamColor(p.team);
    const initial = p.name ? p.name.charAt(0).toUpperCase() : '?';
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
    if (agentName) agentName.textContent = p.name || 'Agent';

    const agentTeam = document.getElementById('agent-team');
    if (agentTeam) {
        agentTeam.textContent = p.team || 'Unknown';
        agentTeam.style.color = color;
    }

    const agentId = document.getElementById('agent-id');
    if (agentId) agentId.textContent = `ID: ${STATE.agentNo}`;

    // Update profile page elements if they exist
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
    if (sidebar) {
        sidebar.classList.remove('open');
    }
}

function logout() {
    localStorage.removeItem('spyBattleAgent');
    STATE.agentNo = null;
    STATE.agentData = null;
    location.reload();
}

// ==================== PAGE LOADER ====================
async function loadPage(page) {
    console.log('Loading page:', page);
    STATE.currentPage = page;
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    showLoading(true);

    try {
        switch(page) {
            case 'home':
                await loadHomePage();
                break;
            case 'profile':
                await loadProfilePage();
                break;
            case 'rankings':
                await loadRankingsPage();
                break;
            case 'goals':
                await loadGoalsPage();
                break;
            case 'album2x':
                await loadAlbum2xPage();
                break;
            case 'team-level':
                await loadTeamLevelPage();
                break;
            case 'team-charts':
                await loadTeamChartsPage();
                break;
            case 'team-comparison':
                await loadTeamComparisonPage();
                break;
            case 'summary':
                await loadSummaryPage();
                break;
            case 'drawer':
                await loadDrawerPage();
                break;
            case 'announcements':
                await loadAnnouncementsPage();
                break;
            default:
                console.warn('Unknown page:', page);
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
    console.log('Loading home page data...');
    
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

        updateMissionStatus('home-track-status', teamInfo.trackGoalPassed);
        updateMissionStatus('home-album-status', teamInfo.albumGoalPassed);
        updateMissionStatus('home-2x-status', teamInfo.album2xPassed);

        // Show team goals in mission cards
        let trackGoalsText = '';
        let albumGoalsText = '';

        if (goalsData.trackGoals) {
            Object.entries(goalsData.trackGoals).forEach(([track, data]) => {
                if (data.teams && data.teams[team]) {
                    const t = data.teams[team];
                    trackGoalsText += `${track}: ${t.current}/${data.goal}<br>`;
                }
            });
        }

        if (goalsData.albumGoals) {
            Object.entries(goalsData.albumGoals).forEach(([album, data]) => {
                if (data.teams && data.teams[team]) {
                    const t = data.teams[team];
                    albumGoalsText += `${album}: ${t.current}/${data.goal}<br>`;
                }
            });
        }

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
        const rankingsList = rankings.rankings || [];
        const performersHTML = rankingsList.map((r, i) => `
            <div class="stat-box">
                <div class="rank-badge">${i + 1}</div>
                <div style="margin-top: 12px; font-size: 14px; font-weight: bold;">${r.name || 'Unknown'}</div>
                <div class="team-badge ${getTeamClass(r.team)}" style="margin-top: 8px; color: ${getTeamColor(r.team)};">${r.team || 'Unknown'}</div>
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
                        Level ${data.level || 0}
                    </div>
                    <div style="color: var(--primary); font-weight: bold; margin-top: 8px;">
                        ${formatNumber(data.teamXP)} XP
                    </div>
                    ${data.isWinner ? '<div style="margin-top: 8px;">🏆 Winner</div>' : ''}
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
        console.error('Error loading home page:', err);
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

// ==================== PROFILE PAGE ====================
async function loadProfilePage() {
    console.log('Loading profile page...');
    
    const p = STATE.agentData?.profile;
    const s = STATE.agentData?.stats;
    
    if (!p || !s) {
        console.warn('No profile/stats data');
        return;
    }

    // Update profile stats
    const statsContainer = document.getElementById('profile-stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-box">
                <div class="stat-value">${formatNumber(s.totalXP)}</div>
                <div class="stat-label">Total XP</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">#${s.rank || 'N/A'}</div>
                <div class="stat-label">Rank</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${formatNumber(s.trackCount)}</div>
                <div class="stat-label">Tracks</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${formatNumber(s.albumCount)}</div>
                <div class="stat-label">Albums</div>
            </div>
        `;
    }
}

// ==================== RANKINGS PAGE ====================
async function loadRankingsPage() {
    console.log('Loading rankings page...');
    
    try {
        const data = await apiCall('getRankings', { week: STATE.currentWeek, limit: 100 });
        const rankings = data.rankings || [];
        
        const container = document.getElementById('rankings-list');
        if (!container) return;

        if (rankings.length === 0) {
            container.innerHTML = '<p>No rankings available</p>';
            return;
        }

        container.innerHTML = rankings.map((r, i) => `
            <div class="ranking-item ${r.agentNo == STATE.agentNo ? 'highlight' : ''}">
                <div class="rank">#${i + 1}</div>
                <div class="info">
                    <div class="name">${r.name || 'Unknown'}</div>
                    <div class="team" style="color: ${getTeamColor(r.team)}">${r.team || 'Unknown'}</div>
                </div>
                <div class="xp">${formatNumber(r.totalXP)} XP</div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Rankings error:', err);
        throw err;
    }
}

// ==================== GOALS PAGE ====================
async function loadGoalsPage() {
    console.log('Loading goals page...');
    
    try {
        const data = await apiCall('getGoalsProgress', { week: STATE.currentWeek });
        const team = STATE.agentData?.profile?.team;
        
        const container = document.getElementById('goals-content');
        if (!container) return;

        let html = '<h3>Track Goals</h3>';
        
        if (data.trackGoals) {
            Object.entries(data.trackGoals).forEach(([track, info]) => {
                const teamData = info.teams?.[team] || { current: 0 };
                const progress = Math.min(100, (teamData.current / info.goal) * 100);
                
                html += `
                    <div class="goal-item">
                        <div class="goal-header">
                            <span>${track}</span>
                            <span>${teamData.current}/${info.goal}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                `;
            });
        }

        html += '<h3 style="margin-top: 24px;">Album Goals</h3>';
        
        if (data.albumGoals) {
            Object.entries(data.albumGoals).forEach(([album, info]) => {
                const teamData = info.teams?.[team] || { current: 0 };
                const progress = Math.min(100, (teamData.current / info.goal) * 100);
                
                html += `
                    <div class="goal-item">
                        <div class="goal-header">
                            <span>${album}</span>
                            <span>${teamData.current}/${info.goal}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML = html;
    } catch (err) {
        console.error('Goals error:', err);
        throw err;
    }
}

// ==================== ALBUM 2X PAGE ====================
async function loadAlbum2xPage() {
    console.log('Loading album 2x page...');
    
    try {
        const data = await apiCall('getAlbum2xProgress', { week: STATE.currentWeek });
        
        const container = document.getElementById('album2x-content');
        if (!container) return;

        const albums = data.albums || [];
        
        if (albums.length === 0) {
            container.innerHTML = '<p>No 2x album data available</p>';
            return;
        }

        container.innerHTML = albums.map(album => `
            <div class="album-2x-item">
                <h4>${album.name}</h4>
                <div class="stats-grid">
                    ${Object.entries(album.teams || {}).map(([team, count]) => `
                        <div class="stat-box" style="border-color: ${getTeamColor(team)}">
                            <div style="color: ${getTeamColor(team)}">${team}</div>
                            <div class="stat-value">${formatNumber(count)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Album 2x error:', err);
        throw err;
    }
}

// ==================== TEAM LEVEL PAGE ====================
async function loadTeamLevelPage() {
    console.log('Loading team level page...');
    
    try {
        const data = await apiCall('getTeamLevels', { week: STATE.currentWeek });
        
        const container = document.getElementById('team-level-content');
        if (!container) return;

        const teams = data.teams || {};
        
        container.innerHTML = `
            <div class="stats-grid">
                ${Object.entries(teams).map(([team, info]) => `
                    <div class="stat-box" style="border-color: ${getTeamColor(team)}">
                        <div style="color: ${getTeamColor(team)}; font-weight: bold; font-size: 18px;">${team}</div>
                        <div class="stat-value" style="font-size: 32px;">Level ${info.level || 0}</div>
                        <div class="stat-label">${formatNumber(info.xp || 0)} XP</div>
                        <div class="progress-bar" style="margin-top: 12px;">
                            <div class="progress-fill" style="width: ${info.progress || 0}%; background: ${getTeamColor(team)}"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (err) {
        console.error('Team level error:', err);
        throw err;
    }
}

// ==================== TEAM CHARTS PAGE ====================
async function loadTeamChartsPage() {
    console.log('Loading team charts page...');
    
    const container = document.getElementById('team-charts-content');
    if (container) {
        container.innerHTML = '<p>Charts coming soon...</p>';
    }
}

// ==================== TEAM COMPARISON PAGE ====================
async function loadTeamComparisonPage() {
    console.log('Loading team comparison page...');
    
    try {
        const data = await apiCall('getTeamComparison', { week: STATE.currentWeek });
        
        const container = document.getElementById('team-comparison-content');
        if (!container) return;

        const teams = data.teams || {};
        
        container.innerHTML = `
            <div class="comparison-table">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="padding: 12px; text-align: left;">Team</th>
                            <th style="padding: 12px; text-align: right;">Total XP</th>
                            <th style="padding: 12px; text-align: right;">Members</th>
                            <th style="padding: 12px; text-align: right;">Avg XP</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(teams).map(([team, info]) => `
                            <tr style="border-top: 1px solid var(--glass-border);">
                                <td style="padding: 12px; color: ${getTeamColor(team)}; font-weight: bold;">${team}</td>
                                <td style="padding: 12px; text-align: right;">${formatNumber(info.totalXP || 0)}</td>
                                <td style="padding: 12px; text-align: right;">${info.members || 0}</td>
                                <td style="padding: 12px; text-align: right;">${formatNumber(info.avgXP || 0)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (err) {
        console.error('Team comparison error:', err);
        throw err;
    }
}

// ==================== SUMMARY PAGE ====================
async function loadSummaryPage() {
    console.log('Loading summary page...');
    
    try {
        const data = await apiCall('getWeeklySummary', { week: STATE.currentWeek });
        
        const container = document.getElementById('summary-content');
        if (!container) return;

        const teams = data.teams || {};
        const winner = Object.entries(teams).find(([_, t]) => t.isWinner);
        
        container.innerHTML = `
            ${winner ? `
                <div class="winner-banner" style="text-align: center; padding: 24px; background: var(--glass-bg); border-radius: 12px; margin-bottom: 24px;">
                    <div style="font-size: 48px;">🏆</div>
                    <h2 style="color: ${getTeamColor(winner[0])}; margin: 12px 0;">${winner[0]} Wins!</h2>
                    <p>${formatNumber(winner[1].teamXP)} Total XP</p>
                </div>
            ` : ''}
            
            <div class="stats-grid">
                ${Object.entries(teams).map(([team, info]) => `
                    <div class="stat-box" style="border-color: ${getTeamColor(team)}">
                        <div style="color: ${getTeamColor(team)}; font-weight: bold;">${team}</div>
                        <div class="stat-value">${formatNumber(info.teamXP || 0)}</div>
                        <div class="stat-label">Total XP</div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (err) {
        console.error('Summary error:', err);
        throw err;
    }
}

// ==================== DRAWER PAGE ====================
async function loadDrawerPage() {
    console.log('Loading drawer page...');
    
    try {
        const data = await apiCall('getDrawerEligible', { week: STATE.currentWeek });
        
        const container = document.getElementById('drawer-content');
        if (!container) return;

        const eligible = data.eligible || [];
        
        if (eligible.length === 0) {
            container.innerHTML = '<p>No eligible agents for drawer this week</p>';
            return;
        }

        container.innerHTML = `
            <p style="margin-bottom: 16px;">${eligible.length} agents eligible for the drawer</p>
            <div class="eligible-list">
                ${eligible.map(agent => `
                    <div class="eligible-item" style="padding: 12px; background: var(--glass-bg); border-radius: 8px; margin-bottom: 8px;">
                        <span style="font-weight: bold;">${agent.name}</span>
                        <span style="color: ${getTeamColor(agent.team)}; margin-left: 12px;">${agent.team}</span>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (err) {
        console.error('Drawer error:', err);
        throw err;
    }
}

// ==================== ANNOUNCEMENTS PAGE ====================
async function loadAnnouncementsPage() {
    console.log('Loading announcements page...');
    
    try {
        const data = await apiCall('getAnnouncements');
        
        const container = document.getElementById('announcements-content');
        if (!container) return;

        const announcements = data.announcements || [];
        
        if (announcements.length === 0) {
            container.innerHTML = '<p>No announcements at this time</p>';
            return;
        }

        container.innerHTML = announcements.map(a => `
            <div class="announcement-item" style="padding: 16px; background: var(--glass-bg); border-radius: 12px; margin-bottom: 16px;">
                <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">${a.date || ''}</div>
                <h3 style="margin-bottom: 8px;">${a.title || ''}</h3>
                <p style="color: var(--text-secondary);">${a.content || ''}</p>
            </div>
        `).join('');
    } catch (err) {
        console.error('Announcements error:', err);
        throw err;
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    initLogin();
});
