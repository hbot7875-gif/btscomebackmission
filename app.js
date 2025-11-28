// ===== APP.JS - FIXED VERSION =====

// ==================== CONFIGURATION ====================
const CONFIG = {
    // ⚠️ UPDATE THIS WITH YOUR ACTUAL APPS SCRIPT URL
    API_BASE_URL: 'https://script.google.com/macros/s/AKfycby2u2Y1KEQazjmTnQBlYaX7Tap4GIiH0_iGs4VqgoVlkT0FO_1tTRLc399QcSl6mw89sw/exec',

    TEAM_COLORS: {
        'Indigo': '#6366f1',      // Bluish
        'Echo': '#ec4899',        // Pinkish
        'Agust D': '#f97316',     // Orange
        'JITB': '#10b981'         // Green
    },

    TEAM_PFPS: {
        'Indigo': 'https://i.ibb.co/4g9KWg3/team-Indigo.png',
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
    document.getElementById('loading-overlay').classList.toggle('active', show);
}

function showAlert(message, type = 'info') {
    const container = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `<span>⚠️</span><span>${message}</span>`;
    container.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
}

function updateLastUpdate() {
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('last-update').textContent = time;
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
    Object.entries(params).forEach(([k, v]) => v !== null && v !== undefined && url.searchParams.set(k, v));

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) throw new Error(data.error);
    return data;
}

// ==================== LOGIN ====================
function initLogin() {
    const saved = localStorage.getItem('spyBattleAgent');
    if (saved) {
        STATE.agentNo = saved;
        showDashboard();
        return;
    }

    document.getElementById('login-btn').onclick = handleLogin;
    document.getElementById('find-agent-btn').onclick = handleFindAgent;

    document.getElementById('agent-input').addEventListener('keypress', e => {
        if (e.key === 'Enter') handleLogin();
    });

    document.getElementById('instagram-input').addEventListener('keypress', e => {
        if (e.key === 'Enter') handleFindAgent();
    });
}

async function handleLogin() {
    const agentNo = document.getElementById('agent-input').value.trim();
    if (!agentNo) return showFindResult('Enter Agent Number', 'error');

    showLoading(true);
    try {
        const allAgents = await apiCall('getAllAgents');
        const exists = allAgents.agents.some(a => a.agentNo === agentNo);
        if (!exists) {
            showLoading(false);
            return showFindResult('Agent not found', 'error');
        }

        localStorage.setItem('spyBattleAgent', agentNo);
        STATE.agentNo = agentNo;
        await showDashboard();
    } catch (err) {
        showLoading(false);
        showFindResult(err.message || 'Login failed', 'error');
    }
}

async function handleFindAgent() {
    const instagram = document.getElementById('instagram-input').value.trim();
    if (!instagram) return showFindResult('Enter Instagram username', 'error');

    showLoading(true);
    try {
        const res = await apiCall('getAgentByInstagram', { instagram });
        showLoading(false);
        
        if (res.result && res.result.includes('Your Agent Number is:')) {
            const agentNo = res.result.split(':')[1].trim();
            document.getElementById('agent-input').value = agentNo;
            showFindResult(res.result, 'success');
        } else {
            showFindResult(res.result || 'Not found', 'error');
        }
    } catch (err) {
        showLoading(false);
        showFindResult('Search failed', 'error');
    }
}

function showFindResult(msg, type) {
    const el = document.getElementById('find-result');
    el.textContent = msg;
    el.className = `find-result show ${type}`;
}

// ==================== DASHBOARD INIT ====================
async function showDashboard() {
    showLoading(true);
    try {
        const weeksData = await apiCall('getAvailableWeeks');
        STATE.allWeeks = weeksData.weeks || [];
        STATE.currentWeek = weeksData.current || STATE.allWeeks[0];

        const agentData = await apiCall('getAgentData', { 
            agentNo: STATE.agentNo, 
            week: STATE.currentWeek 
        });
        STATE.agentData = agentData;

        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('dashboard-screen').classList.add('active');

        initDashboard();
        await loadPage('home');
        showLoading(false);
    } catch (err) {
        console.error(err);
        showLoading(false);
        showAlert('Failed to load dashboard', 'danger');
        logout();
    }
}

function initDashboard() {
    updateAgentInfo();
    populateWeekSelector();
    setupNavigation();
    document.getElementById('logout-btn').onclick = logout;
    setupMobileMenu();
    updateLastUpdate();
    setInterval(updateLastUpdate, 60000);
}

function updateAgentInfo() {
    const p = STATE.agentData.profile;
    if (!p) return;

    const color = getTeamColor(p.team);
    const initial = p.name.charAt(0).toUpperCase();
    const pfp = getTeamPFP(p.team);

    // Sidebar
    if (pfp) {
        document.getElementById('agent-avatar').innerHTML = `<img src="${pfp}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    } else {
        document.getElementById('agent-avatar').innerHTML = `<span id="agent-initial">${initial}</span>`;
        document.getElementById('agent-avatar').style.background = `linear-gradient(135deg, ${color}, ${color}dd)`;
    }
    document.getElementById('agent-name').textContent = p.name;
    document.getElementById('agent-team').textContent = p.team;
    document.getElementById('agent-team').style.color = color;
    document.getElementById('agent-id').textContent = `ID: ${STATE.agentNo}`;

    // Profile page
    if (pfp) {
        document.getElementById('profile-avatar').innerHTML = `<img src="${pfp}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    } else {
        document.getElementById('profile-avatar').innerHTML = `<span id="profile-initial">${initial}</span>`;
        document.getElementById('profile-avatar').style.background = `linear-gradient(135deg, ${color}, ${color}dd)`;
    }
    document.getElementById('profile-name').textContent = p.name;
    document.getElementById('profile-team').textContent = p.team;
    document.getElementById('profile-team').style.color = color;
    document.getElementById('profile-id').textContent = `ID: ${STATE.agentNo}`;
}

function populateWeekSelector() {
    const select = document.getElementById('week-select');
    select.innerHTML = STATE.allWeeks.map(w =>
        `<option value="${w}" ${w === STATE.currentWeek ? 'selected' : ''}>${w}</option>`
    ).join('');

    select.onchange = async () => {
        STATE.currentWeek = select.value;
        showLoading(true);
        STATE.agentData = await apiCall('getAgentData', { 
            agentNo: STATE.agentNo, 
            week: STATE.currentWeek 
        });
        await loadPage(STATE.currentPage);
        showLoading(false);
    };
}

function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = e => {
            e.preventDefault();
            const page = link.dataset.page;
            loadPage(page);
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            closeMobileMenu();
        };
    });

    document.querySelectorAll('.mission-card').forEach(card => {
        card.onclick = () => {
            const nav = card.dataset.nav;
            if (nav) {
                document.querySelector(`.nav-link[data-page="${nav}"]`).click();
            }
        };
    });
}

function setupMobileMenu() {
    document.getElementById('mobile-menu-btn').onclick = () => 
        document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebar-close').onclick = closeMobileMenu;
}

function closeMobileMenu() {
    document.getElementById('sidebar').classList.remove('open');
}

function logout() {
    localStorage.removeItem('spyBattleAgent');
    location.reload();
}

// ==================== PAGE LOADER ====================
async function loadPage(page) {
    STATE.currentPage = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');

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
        if (loaders[page]) await loaders[page]();
    } catch (err) {
        console.error(err);
        showAlert('Failed to load page', 'danger');
    } finally {
        showLoading(false);
    }
}

// ==================== HOME PAGE ====================
async function loadHomePage() {
    document.getElementById('current-week-display').textContent = `Active Week: ${STATE.currentWeek}`;

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

    // Update mission card descriptions
    const cards = document.querySelectorAll('.mission-card');
    if (cards[0]) cards[0].querySelector('.mission-desc').innerHTML = trackGoalsText || 'Complete team track targets';
    if (cards[1]) cards[1].querySelector('.mission-desc').innerHTML = albumGoalsText || 'Complete team album targets';
    if (cards[2]) cards[2].querySelector('.mission-desc').innerHTML = 'Each member must stream their team album 2× minimum';

    // Top performers
    const performersHTML = rankings.rankings.map((r, i) => `
        <div class="stat-box">
            <div class="rank-badge">${i + 1}</div>
            <div style="margin-top: 12px; font-size: 14px; font-weight: bold;">${r.name}</div>
            <div class="team-badge ${getTeamClass(r.team)}" style="margin-top: 8px; color: ${getTeamColor(r.team)};">${r.team}</div>
            <div style="color: var(--primary); font-weight: bold; margin-top: 8px;">${r.totalXP} XP</div>
        </div>
    `).join('');

    document.getElementById('home-top-performers').innerHTML = 
        `<div class="stats-grid">${performersHTML}</div>`;

    // Team standings with PFPs
    const teams = Object.keys(summary.teams);
    const standingsHTML = teams.map(t => {
        const data = summary.teams[t];
        const pfp = getTeamPFP(t);
        return `
            <div class="stat-box" style="border-color: ${getTeamColor(t)};">
                ${pfp ? `<img src="${pfp}" style="width:60px;height:60px;border-radius:50%;margin-bottom:8px;object-fit:cover;">` : `<div style="font-size: 24px; margin-bottom: 8px;">🎭</div>`}
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

    document.getElementById('home-team-standings').innerHTML = 
        `<div class="stats-grid">${standingsHTML}</div>`;
}

function updateMissionStatus(elementId, passed) {
    const element = document.getElementById(elementId);
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
    const { stats, trackContributions, albumContributions, album2xStatus } = STATE.agentData;

    const statsHTML = `
        <div class="stat-box">
            <div class="stat-icon">🎵</div>
            <div class="stat-label">Track Streams</div>
            <div class="stat-value">${formatNumber(stats.trackScrobbles)}</div>
        </div>
        <div class="stat-box">
            <div class="stat-icon">💿</div>
            <div class="stat-label">Album Streams</div>
            <div class="stat-value">${formatNumber(stats.albumScrobbles)}</div>
        </div>
        <div class="stat-box">
            <div class="stat-icon">⚡</div>
            <div class="stat-label">Track XP</div>
            <div class="stat-value">${stats.trackXP}</div>
        </div>
        <div class="stat-box">
            <div class="stat-icon">💎</div>
            <div class="stat-label">Album XP</div>
            <div class="stat-value">${stats.albumXP}</div>
        </div>
        <div class="stat-box" style="grid-column: span 2;">
            <div class="stat-icon">🏆</div>
            <div class="stat-label">Total XP</div>
            <div class="stat-value" style="font-size: 48px;">${stats.totalXP}</div>
        </div>
        <div class="stat-box">
            <div class="stat-icon">🌍</div>
            <div class="stat-label">Overall Rank</div>
            <div class="stat-value">#${STATE.agentData.rank || 'N/A'}</div>
        </div>
        <div class="stat-box">
            <div class="stat-icon">👥</div>
            <div class="stat-label">Team Rank</div>
            <div class="stat-value">#${STATE.agentData.teamRank || 'N/A'}</div>
        </div>
    `;

    document.getElementById('profile-stats').innerHTML = statsHTML;

    const tracksHTML = Object.keys(trackContributions).length > 0 
        ? `<div class="table-wrapper"><table class="data-table">
            <thead><tr><th>Track</th><th>Your Streams</th><th>XP Earned</th></tr></thead>
            <tbody>
                ${Object.entries(trackContributions).map(([track, count]) => `
                    <tr>
                        <td>${track}</td>
                        <td style="color: var(--primary); font-weight: bold;">${formatNumber(count)}</td>
                        <td>${Math.floor(count / 10)} XP</td>
                    </tr>
                `).join('')}
            </tbody>
        </table></div>`
        : '<p class="text-center text-secondary" style="padding: 20px;">No track contributions this week</p>';

    document.getElementById('profile-tracks').innerHTML = tracksHTML;

    const albumsHTML = Object.keys(albumContributions).length > 0 
        ? `<div class="table-wrapper"><table class="data-table">
            <thead><tr><th>Album</th><th>Your Streams</th><th>XP Earned</th></tr></thead>
            <tbody>
                ${Object.entries(albumContributions).map(([album, count]) => `
                    <tr>
                        <td>${album}</td>
                        <td style="color: var(--primary); font-weight: bold;">${formatNumber(count)}</td>
                        <td>${Math.floor(count / 10)} XP</td>
                    </tr>
                `).join('')}
            </tbody>
        </table></div>`
        : '<p class="text-center text-secondary" style="padding: 20px;">No album contributions this week</p>';

    document.getElementById('profile-albums').innerHTML = albumsHTML;

    const album2xHTML = album2xStatus && album2xStatus.tracks 
        ? `
            <div style="text-align: center; padding: 20px; background: ${album2xStatus.passed ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)'}; border-radius: 8px; margin-bottom: 20px;">
                <div style="font-size: 48px; margin-bottom: 10px;">
                    ${album2xStatus.passed ? '✅' : '⏳'}
                </div>
                <div style="font-size: 18px; font-weight: bold; color: ${album2xStatus.passed ? '#2ecc71' : '#e74c3c'};">
                    ${album2xStatus.passed ? 'Completed' : 'Not Completed'}
                </div>
            </div>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead><tr><th>Team Album Track</th><th>Your Streams</th><th>Status</th></tr></thead>
                    <tbody>
                        ${Object.entries(album2xStatus.tracks).map(([track, count]) => `
                            <tr>
                                <td>${track}</td>
                                <td style="color: var(--primary); font-weight: bold;">${count || 0}</td>
                                <td>
                                    <span class="status-badge ${count >= 2 ? 'passed' : 'failed'}">
                                        ${count >= 2 ? 'Completed' : `Not Completed (${2 - count} needed)`}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `
        : '<p class="text-center text-secondary" style="padding: 20px;">No 2X data available</p>';

    document.getElementById('profile-2x').innerHTML = album2xHTML;
}

// ==================== RANKINGS PAGE ====================
async function loadRankingsPage() {
    const rankings = await apiCall('getRankings', { week: STATE.currentWeek, limit: 100 });

    const legendHTML = Object.entries(CONFIG.TEAM_COLORS).map(([team, color]) => `
        <div class="team-legend-item">
            <div class="team-legend-color" style="background: ${color};"></div>
            <div class="team-legend-name">${team}</div>
        </div>
    `).join('');

    document.getElementById('team-legend').innerHTML = legendHTML;

    const tableHTML = rankings.rankings.map(r => `
        <tr ${r.agentNo === STATE.agentNo ? 'style="background: rgba(212, 175, 55, 0.1);"' : ''}>
            <td><div class="rank-badge">${r.rank}</div></td>
            <td>
                <strong>${r.name}</strong>
                <div style="font-size: 12px; color: var(--text-secondary); font-family: monospace;">
                    ${r.agentNo}
                </div>
            </td>
            <td>
                <span class="team-badge ${getTeamClass(r.team)}" style="color: ${getTeamColor(r.team)};">
                    ${r.team}
                </span>
            </td>
            <td>${formatNumber(r.trackScrobbles + r.albumScrobbles)}</td>
            <td style="color: var(--primary); font-weight: bold; font-size: 18px;">
                ${r.totalXP}
            </td>
            <td>
                ${r.agentNo === STATE.agentNo 
                    ? '<span class="status-badge passed">You</span>' 
                    : ''}
            </td>
        </tr>
    `).join('');

    document.getElementById('rankings-body').innerHTML = tableHTML;

    const searchInput = document.getElementById('rank-search');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#rankings-body tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
        });
    });
}

// ==================== GOALS PAGE ====================
async function loadGoalsPage() {
    const goalsData = await apiCall('getGoalsProgress', { week: STATE.currentWeek });
    const teams = ['Indigo', 'Echo', 'Agust D', 'JITB'];

    const html = teams.map(team => {
        const teamColor = getTeamColor(team);

        let trackGoalsHTML = '';
        Object.entries(goalsData.trackGoals || {}).forEach(([track, data]) => {
            if (data.teams[team]) {
                const t = data.teams[team];
                const percentage = Math.min(100, (t.current / data.goal) * 100);

                trackGoalsHTML += `
                    <div class="goal-item">
                        <div class="goal-info">
                            <span class="goal-name">${track}</span>
                            <span class="goal-progress">${t.current} / ${data.goal}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%; background: ${teamColor};"></div>
                        </div>
                    </div>
                `;
            }
        });

        let albumGoalsHTML = '';
        Object.entries(goalsData.albumGoals || {}).forEach(([album, data]) => {
            if (data.teams[team]) {
                const t = data.teams[team];
                const percentage = Math.min(100, (t.current / data.goal) * 100);

                albumGoalsHTML += `
                    <div class="goal-item">
                        <div class="goal-info">
                            <span class="goal-name">${album}</span>
                            <span class="goal-progress">${t.current} / ${data.goal}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%; background: ${teamColor};"></div>
                        </div>
                    </div>
                `;
            }
        });

        return `
            <div class="team-goals-card" style="border-left-color: ${teamColor};">
                <div class="team-goals-header" style="color: ${teamColor};">
                    ${team}
                </div>

                <div class="goal-section">
                    <div class="goal-section-title">🎵 Track Goals</div>
                    ${trackGoalsHTML || '<p class="text-secondary">No track goals</p>'}
                </div>

                <div class="goal-section">
                    <div class="goal-section-title">💿 Album Goals</div>
                    ${albumGoalsHTML || '<p class="text-secondary">No album goals</p>'}
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('goals-container').innerHTML = html;
}

// ==================== ALBUM 2X PAGE ====================
async function loadAlbum2xPage() {
    const album2xData = await apiCall('getAlbum2xStatus', { week: STATE.currentWeek });

    const html = Object.entries(album2xData.teams).map(([team, data]) => {
        const teamColor = getTeamColor(team);

        const membersHTML = data.members.map(m => `
            <div class="team-2x-member">
                <span class="team-2x-member-name">${m.name} (${m.agentNo})</span>
                <span class="status-badge ${m.passed ? 'passed' : 'failed'}">
                    ${m.passed ? 'Completed' : 'Not Completed'}
                </span>
            </div>
        `).join('');

        return `
            <div class="team-2x-card">
                <div class="team-2x-header">
                    <div class="team-2x-name" style="color: ${teamColor};">${team}</div>
                    <div class="team-2x-stats">
                        <div class="team-2x-stat">
                            <div class="team-2x-stat-label">Completed</div>
                            <div class="team-2x-stat-value" style="color: #2ecc71;">${data.passed}</div>
                        </div>
                        <div class="team-2x-stat">
                            <div class="team-2x-stat-label">Not Completed</div>
                            <div class="team-2x-stat-value" style="color: #e74c3c;">${data.failed}</div>
                        </div>
                        <div class="team-2x-stat">
                            <div class="team-2x-stat-label">Total</div>
                            <div class="team-2x-stat-value">${data.totalMembers}</div>
                        </div>
                    </div>
                </div>
                <div class="team-2x-members">
                    ${membersHTML}
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('album2x-container').innerHTML = html;
}

// ==================== TEAM LEVEL PAGE ====================
async function loadTeamLevelPage() {
    const teams = ['Indigo', 'Echo', 'Agust D', 'JITB'];

    const htmlPromises = teams.map(async team => {
        const teamData = await apiCall('getTeamData', { team, week: STATE.currentWeek });
        const teamColor = getTeamColor(team);

        return `
            <div class="team-level-card" style="border-left-color: ${teamColor};">
                <div class="team-level-header">
                    <div class="team-level-title" style="color: ${teamColor};">${team}</div>
                    <div class="team-level-badge">Level ${teamData.level}</div>
                </div>

                <div class="team-level-section">
                    <div class="team-level-section-title">📊 Team Stats</div>
                    <div class="team-level-info">
                        <div class="team-level-info-item">
                            <span class="team-level-info-label">Total Members</span>
                            <span class="team-level-info-value">${teamData.members.length}</span>
                        </div>
                        <div class="team-level-info-item">
                            <span class="team-level-info-label">Team XP</span>
                            <span class="team-level-info-value" style="color: var(--primary);">${teamData.teamXP}</span>
                        </div>
                        <div class="team-level-info-item">
                            <span class="team-level-info-label">Current Level</span>
                            <span class="team-level-info-value">${teamData.level}</span>
                        </div>
                        <div class="team-level-info-item">
                            <span class="team-level-info-label">Weekly Winner</span>
                            <span class="team-level-info-value">${teamData.winner ? '🏆 Yes' : 'No'}</span>
                        </div>
                    </div>
                </div>

                <div class="team-level-section">
                    <div class="team-level-section-title">🎯 Mission Status</div>
                    <div class="team-level-info">
                        <div class="team-level-info-item">
                            <span class="team-level-info-label">Track Goals</span>
                            <span class="team-level-info-value" 
                                  style="color: ${teamData.missions.tracksPassed ? '#2ecc71' : '#e74c3c'};">
                                ${teamData.missions.tracksPassed ? 'Completed' : 'Not Completed'}
                            </span>
                        </div>
                        <div class="team-level-info-item">
                            <span class="team-level-info-label">Album Goals</span>
                            <span class="team-level-info-value" 
                                  style="color: ${teamData.missions.albumsPassed ? '#2ecc71' : '#e74c3c'};">
                                ${teamData.missions.albumsPassed ? 'Completed' : 'Not Completed'}
                            </span>
                        </div>
                        <div class="team-level-info-item">
                            <span class="team-level-info-label">Album 2X</span>
                            <span class="team-level-info-value" 
                                  style="color: ${teamData.missions.album2xPassed ? '#2ecc71' : '#e74c3c'};">
                                ${teamData.missions.album2xPassed ? 'Completed' : 'Not Completed'}
                            </span>
                        </div>
                        <div class="team-level-info-item">
                            <span class="team-level-info-label">Level Progress</span>
                            <span class="team-level-info-value" 
                                  style="color: ${teamData.missions.levelUp ? '#2ecc71' : '#f39c12'};">
                                ${teamData.missions.levelUp ? '⬆️ Level Up' : '⏸️ Hold'}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="team-level-section">
                    <div class="team-level-section-title">👥 Top Contributors</div>
                    <div class="team-level-info">
                        ${teamData.members.slice(0, 5).map((m, i) => `
                            <div class="team-level-info-item">
                                <span class="team-level-info-label">${i + 1}. ${m.name}</span>
                                <span class="team-level-info-value" style="color: var(--primary);">${m.totalXP} XP</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    });

    const html = await Promise.all(htmlPromises);
    document.getElementById('team-level-container').innerHTML = html.join('');
}

// ==================== TEAM CHARTS PAGE ====================
async function loadTeamChartsPage() {
    const teams = ['Indigo', 'Echo', 'Agust D', 'JITB'];

    const buttonsHTML = teams.map(team => `
        <button class="team-button ${team === teams[0] ? 'active' : ''}" 
                data-team="${team}"
                style="border-color: ${getTeamColor(team)};">
            ${team}
        </button>
    `).join('');

    document.getElementById('team-chart-buttons').innerHTML = buttonsHTML;

    await renderTeamCharts(teams[0]);

    document.querySelectorAll('.team-button').forEach(btn => {
        btn.addEventListener('click', async () => {
            document.querySelectorAll('.team-button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const team = btn.getAttribute('data-team');
            await renderTeamCharts(team);
        });
    });
}

async function renderTeamCharts(team) {
    const chartData = await apiCall('getTeamChartData', { team });

    if (STATE.charts.teamXP) STATE.charts.teamXP.destroy();
    if (STATE.charts.teamMissions) STATE.charts.teamMissions.destroy();

    const xpCtx = document.getElementById('team-xp-chart').getContext('2d');
    STATE.charts.teamXP = new Chart(xpCtx, {
        type: 'line',
        data: {
            labels: chartData.weeks,
            datasets: [{
                label: `${team} XP Over Time`,
                data: chartData.teamXP,
                borderColor: getTeamColor(team),
                backgroundColor: `${getTeamColor(team)}33`,
                tension: 0.4,
                fill: true
            }]
        },
        options: getChartOptions(`${team} XP Growth - Shows how your team's total XP increases each week`)
    });

    const missionsCtx = document.getElementById('team-missions-chart').getContext('2d');
    STATE.charts.teamMissions = new Chart(missionsCtx, {
        type: 'bar',
        data: {
            labels: chartData.weeks,
            datasets: [{
                label: 'Missions Completed (out of 3)',
                data: chartData.missionsPassed,
                backgroundColor: getTeamColor(team),
                borderRadius: 8
            }]
        },
        options: {
            ...getChartOptions(`${team} Weekly Mission Completion - Bar height shows missions completed (max 3)`),
            scales: {
                y: {
                    beginAtZero: true,
                    max: 3,
                    ticks: {
                        stepSize: 1,
                        color: '#999'
                    },
                    grid: {
                        color: 'rgba(212, 175, 55, 0.1)'
                    }
                },
                x: {
                    ticks: { color: '#999' },
                    grid: { display: false }
                }
            }
        }
    });
}

// ==================== TEAM COMPARISON PAGE ====================
async function loadTeamComparisonPage() {
    const comparison = await apiCall('getTeamComparison', { week: STATE.currentWeek });

    const rankingsHTML = `
        <div class="stats-grid">
            ${comparison.comparison.map((t, i) => {
                const pfp = getTeamPFP(t.team);
                return `
                <div class="stat-box" style="border-color: ${getTeamColor(t.team)};">
                    <div class="rank-badge">${i + 1}</div>
                    ${pfp ? `<img src="${pfp}" style="width:60px;height:60px;border-radius:50%;margin:15px 0;object-fit:cover;">` : ''}
                    <div style="margin-top: 15px; font-size: 18px; font-weight: bold; color: ${getTeamColor(t.team)};">
                        ${t.team}
                    </div>
                    <div style="margin-top: 8px; color: var(--text-secondary);">Level ${t.level}</div>
                    <div style="margin-top: 8px; color: var(--primary); font-weight: bold; font-size: 24px;">
                        ${t.teamXP} XP
                    </div>
                    ${t.winner ? '<div style="margin-top: 8px; font-size: 24px;">🏆</div>' : ''}
                </div>
            `;
            }).join('')}
        </div>
    `;

    document.getElementById('comparison-rankings').innerHTML = rankingsHTML;

    if (STATE.charts.comparisonXP) STATE.charts.comparisonXP.destroy();

    const xpCtx = document.getElementById('comparison-xp-chart').getContext('2d');
    STATE.charts.comparisonXP = new Chart(xpCtx, {
        type: 'bar',
        data: {
            labels: comparison.comparison.map(t => t.team),
            datasets: [{
                label: 'Team XP',
                data: comparison.comparison.map(t => t.teamXP),
                backgroundColor: comparison.comparison.map(t => getTeamColor(t.team)),
                borderRadius: 8
            }]
        },
        options: getChartOptions('Team XP Comparison - Higher bar = more XP earned this week')
    });

    // Remove radar chart container if it exists
    const radarContainer = document.getElementById('comparison-radar-chart');
    if (radarContainer && radarContainer.parentElement) {
        radarContainer.parentElement.parentElement.remove();
    }
}

// ==================== SUMMARY PAGE ====================
async function loadSummaryPage() {
    const summary = await apiCall('getWeeklySummary', { week: STATE.currentWeek });
    
    // Check if week is locked (not Saturday midnight yet)
    const isLocked = isWeekLocked(STATE.currentWeek);
    
    if (isLocked) {
        document.getElementById('winner-card').innerHTML = `
            <div class="winner-content">
                <div style="font-size: 80px; margin-bottom: 20px;">🔒</div>
                <div class="winner-title">Results Locked</div>
                <div style="color: var(--text-secondary); margin-top: 10px;">
                    Results will be revealed on Sunday at 12:00 AM
                </div>
                <div style="margin-top: 20px; padding: 20px; background: rgba(212, 175, 55, 0.1); border-radius: 8px;">
                    <div style="font-size: 16px; color: var(--primary);">Calculating...</div>
                    <div style="font-size: 14px; color: var(--text-secondary); margin-top: 8px;">
                        Battle ends Saturday 11:59 PM
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('summary-grid').innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">⏳</div>
                <div style="font-size: 18px; color: var(--text-secondary);">
                    Team results will be available after the week ends
                </div>
            </div>
        `;
        return;
    }

    const winnerHTML = summary.winner 
        ? `
            <div class="winner-content">
                <div class="winner-title">Week Winner</div>
                <div class="winner-team" style="color: ${getTeamColor(summary.winner)};">
                    ${summary.winner}
                </div>
                <div class="winner-xp">${summary.teams[summary.winner].teamXP} XP</div>
            </div>
        `
        : '<div class="winner-content"><p class="text-secondary">No winner declared yet</p></div>';

    document.getElementById('winner-card').innerHTML = winnerHTML;

    const gridHTML = Object.entries(summary.teams).map(([team, data]) => {
        const allPassed = data.trackGoalPassed && data.albumGoalPassed && data.album2xPassed;

        return `
            <div class="summary-team-card" style="border-left: 4px solid ${getTeamColor(team)};">
                <div class="summary-team-header">
                    <div class="summary-team-name" style="color: ${getTeamColor(team)};">${team}</div>
                    <div class="summary-team-level">Level ${data.level}</div>
                </div>

                <div class="summary-missions">
                    <div class="summary-mission-item">
                        <span class="summary-mission-label">Track Goals</span>
                        <span class="summary-mission-value" style="color: ${data.trackGoalPassed ? '#2ecc71' : '#e74c3c'};">
                            ${data.trackGoalPassed ? 'Completed' : 'Not Completed'}
                        </span>
                    </div>
                    <div class="summary-mission-item">
                        <span class="summary-mission-label">Album Goals</span>
                        <span class="summary-mission-value" style="color: ${data.albumGoalPassed ? '#2ecc71' : '#e74c3c'};">
                            ${data.albumGoalPassed ? 'Completed' : 'Not Completed'}
                        </span>
                    </div>
                    <div class="summary-mission-item">
                        <span class="summary-mission-label">Album 2X</span>
                        <span class="summary-mission-value" style="color: ${data.album2xPassed ? '#2ecc71' : '#e74c3c'};">
                            ${data.album2xPassed ? 'Completed' : 'Not Completed'}
                        </span>
                    </div>
                    <div class="summary-mission-item">
                        <span class="summary-mission-label">Team XP</span>
                        <span class="summary-mission-value" style="color: var(--primary);">
                            ${data.teamXP}
                        </span>
                    </div>
                </div>

                <div class="summary-team-status ${allPassed ? 'level-up' : 'hold'}">
                    ${allPassed ? '⬆️ LEVEL UP' : '⏸️ HOLD'}
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('summary-grid').innerHTML = gridHTML;
}

function isWeekLocked(weekLabel) {
    // Get week end time
    const info = getWeekEndTime(weekLabel);
    if (!info) return false;
    
    const now = new Date();
    const weekEnd = new Date(info.endTime);
    
    // Add 5 minutes buffer after Saturday 11:59 PM
    weekEnd.setMinutes(weekEnd.getMinutes() + 5);
    
    return now < weekEnd;
}

function getWeekEndTime(weekLabel) {
    // This should match your week detection logic
    if (weekLabel === 'Test Week 1') {
        return { endTime: '2025-11-29T23:59:59+05:30' };
    } else if (weekLabel === 'Test Week 2') {
        return { endTime: '2025-12-06T23:59:59+05:30' };
    }
    // Add logic for real weeks if needed
    return null;
}

// ==================== DRAWER PAGE ====================
async function loadDrawerPage() {
    const badges = await apiCall('getBadges', { agentNo: STATE.agentNo });
    const winners = await apiCall('getWeeklyWinners');

    const badgesHTML = badges.badges.length > 0
        ? `<div class="badges-grid">
            ${badges.badges.map(b => `
                <div class="badge-item">
                    <div class="badge-image">
                        ${b.imageUrl ? `<img src="${b.imageUrl}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">` : '🏅'}
                    </div>
                    <div class="badge-name">${b.name}</div>
                    <div class="badge-week">${b.weekEarned}</div>
                </div>
            `).join('')}
        </div>`
        : `<div class="empty-state">
            <div class="empty-state-icon">🎖️</div>
            <div class="empty-state-text">No badges earned yet. Keep streaming!</div>
        </div>`;

    document.getElementById('badges-container').innerHTML = badgesHTML;

    const myTeam = STATE.agentData.profile.team;
    const myWins = winners.winners.filter(w => w.team === myTeam);

    const winsHTML = myWins.length > 0
        ? `<div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Week</th>
                        <th>Team</th>
                        <th>Team XP</th>
                        <th>Level</th>
                    </tr>
                </thead>
                <tbody>
                    ${myWins.map(w => `
                        <tr>
                            <td><strong>${w.week}</strong></td>
                            <td>
                                <span class="team-badge ${getTeamClass(w.team)}" 
                                      style="color: ${getTeamColor(w.team)};">
                                    ${w.team}
                                </span>
                            </td>
                            <td style="color: var(--primary); font-weight: bold;">${w.teamXP} XP</td>
                            <td>Level ${w.level}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`
        : `<div class="empty-state">
            <div class="empty-state-icon">🏆</div>
            <div class="empty-state-text">Your team hasn't won a week yet. Keep pushing!</div>
        </div>`;

    document.getElementById('wins-container').innerHTML = winsHTML;
}

// ==================== ANNOUNCEMENTS PAGE ====================
async function loadAnnouncementsPage() {
    const announcements = await apiCall('getAnnouncements', { week: STATE.currentWeek });

    const html = announcements.announcements.length > 0
        ? announcements.announcements.map(a => `
            <div class="announcement-item">
                <div class="announcement-header">
                    <div class="announcement-title">${a.title}</div>
                    <div class="announcement-priority ${a.priority}">${a.priority}</div>
                </div>
                <div class="announcement-message">${a.message}</div>
                <div class="announcement-date">
                    ${new Date(a.created).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                    })}
                </div>
            </div>
        `).join('')
        : `<div class="empty-state">
            <div class="empty-state-icon">📢</div>
            <div class="empty-state-text">No announcements at this time</div>
        </div>`;

    document.getElementById('announcements-container').innerHTML = html;
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initLogin();
});
