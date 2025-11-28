// ===== APP.JS - Main Application Logic =====

// ==================== CONFIGURATION ====================
const CONFIG = {
    // IMPORTANT: Replace this with your actual Apps Script deployment URL
    API_BASE_URL: 'https://script.google.com/macros/s/AKfycby2u2Y1KEQazjmTnQBlYaX7Tap4GIiH0_iGs4VqgoVlkT0FO_1tTRLc399QcSl6mw89sw/exec',
    
    TEAM_COLORS: {
        'Indigo': '#5b61d4',
        'Echo': '#e74c3c',
        'Agust D': '#f39c12',
        'JITB': '#9b59b6'
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

// ==================== UTILITY FUNCTIONS ====================
function showLoading(show = true) {
    const overlay = document.getElementById('loading-overlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

function showAlert(message, type = 'info') {
    const container = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span>⚠️</span>
        <span>${message}</span>
    `;
    container.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function updateLastUpdate() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    document.getElementById('last-update').textContent = timeStr;
}

function getTeamColor(team) {
    return CONFIG.TEAM_COLORS[team] || '#d4af37';
}

function getTeamClass(team) {
    return team.toLowerCase().replace(/\s+/g, '');
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ==================== API CALLS ====================
async function apiCall(action, params = {}) {
    const url = new URL(CONFIG.API_BASE_URL);
    url.searchParams.append('action', action);
    
    Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
            url.searchParams.append(key, params[key]);
        }
    });
    
    try {
        const response = await fetch(url.toString());
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ==================== LOGIN FUNCTIONS ====================
function initLogin() {
    const loginBtn = document.getElementById('login-btn');
    const findAgentBtn = document.getElementById('find-agent-btn');
    const agentInput = document.getElementById('agent-input');
    const instaInput = document.getElementById('instagram-input');
    
    // Handle Enter key in agent input
    agentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
    
    // Handle Enter key in Instagram input
    instaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleFindAgent();
        }
    });
    
    loginBtn.addEventListener('click', handleLogin);
    findAgentBtn.addEventListener('click', handleFindAgent);
    
    // Check if already logged in
    const savedAgent = localStorage.getItem('spyBattleAgent');
    if (savedAgent) {
        STATE.agentNo = savedAgent;
        showDashboard();
    }
}

async function handleLogin() {
    const agentInput = document.getElementById('agent-input');
    const agentNo = agentInput.value.trim();
    
    if (!agentNo) {
        showFindResult('Please enter your Agent Number', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        // Verify agent exists
        const allAgents = await apiCall('getAllAgents');
        const agentExists = allAgents.agents.some(a => a.agentNo === agentNo);
        
        if (!agentExists) {
            showFindResult('Agent Number not found. Please check and try again.', 'error');
            showLoading(false);
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('spyBattleAgent', agentNo);
        STATE.agentNo = agentNo;
        
        // Show dashboard
        showDashboard();
        
    } catch (error) {
        console.error('Login error:', error);
        showFindResult('Login failed. Please try again.', 'error');
        showLoading(false);
    }
}

async function handleFindAgent() {
    const instaInput = document.getElementById('instagram-input');
    const instagram = instaInput.value.trim();
    
    if (!instagram) {
        showFindResult('Please enter your Instagram username', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        const result = await apiCall('getAgentByInstagram', { instagram });
        
        if (result.result && result.result.includes('Your Agent Number is:')) {
            const agentNo = result.result.split(':')[1].trim();
            document.getElementById('agent-input').value = agentNo;
            showFindResult(result.result, 'success');
        } else {
            showFindResult(result.result || 'Instagram username not found', 'error');
        }
        
    } catch (error) {
        console.error('Find agent error:', error);
        showFindResult('Search failed. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

function showFindResult(message, type) {
    const resultDiv = document.getElementById('find-result');
    resultDiv.textContent = message;
    resultDiv.className = `find-result show ${type}`;
}

// ==================== DASHBOARD FUNCTIONS ====================
async function showDashboard() {
    showLoading(true);
    
    try {
        // Get available weeks
        const weeksData = await apiCall('getAvailableWeeks');
        STATE.allWeeks = weeksData.weeks || [];
        STATE.currentWeek = weeksData.current || 'Test Week 1';
        
        // Get agent data
        const agentData = await apiCall('getAgentData', {
            agentNo: STATE.agentNo,
            week: STATE.currentWeek
        });
        
        STATE.agentData = agentData;
        
        // Hide login, show dashboard
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('dashboard-screen').classList.add('active');
        
        // Initialize dashboard
        initDashboard();
        
        // Load initial page
        await loadPage('home');
        
        showLoading(false);
        
    } catch (error) {
        console.error('Dashboard error:', error);
        showAlert('Failed to load dashboard. Please try again.', 'danger');
        logout();
    }
}

function initDashboard() {
    // Update sidebar agent info
    updateAgentInfo();
    
    // Populate week selector
    populateWeekSelector();
    
    // Setup navigation
    setupNavigation();
    
    // Setup logout
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Update time
    updateLastUpdate();
    setInterval(updateLastUpdate, 60000); // Update every minute
}

function updateAgentInfo() {
    const { profile } = STATE.agentData;
    
    if (!profile || !profile.name) return;
    
    const initial = profile.name.charAt(0).toUpperCase();
    const teamColor = getTeamColor(profile.team);
    
    // Sidebar
    document.getElementById('agent-initial').textContent = initial;
    document.getElementById('agent-name').textContent = profile.name;
    document.getElementById('agent-team').textContent = profile.team;
    document.getElementById('agent-team').style.color = teamColor;
    document.getElementById('agent-id').textContent = `ID: ${STATE.agentNo}`;
    document.getElementById('agent-avatar').style.background = 
        `linear-gradient(135deg, ${teamColor}, ${teamColor}dd)`;
    
    // Profile page
    document.getElementById('profile-initial').textContent = initial;
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-team').textContent = profile.team;
    document.getElementById('profile-team').style.color = teamColor;
    document.getElementById('profile-id').textContent = `ID: ${STATE.agentNo}`;
    document.getElementById('profile-avatar').style.background = 
        `linear-gradient(135deg, ${teamColor}, ${teamColor}dd)`;
}

function populateWeekSelector() {
    const select = document.getElementById('week-select');
    select.innerHTML = '';
    
    STATE.allWeeks.forEach(week => {
        const option = document.createElement('option');
        option.value = week;
        option.textContent = week;
        if (week === STATE.currentWeek) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    select.addEventListener('change', async (e) => {
        STATE.currentWeek = e.target.value;
        showLoading(true);
        
        try {
            const agentData = await apiCall('getAgentData', {
                agentNo: STATE.agentNo,
                week: STATE.currentWeek
            });
            STATE.agentData = agentData;
            
            await loadPage(STATE.currentPage);
            
        } catch (error) {
            console.error('Week change error:', error);
            showAlert('Failed to load week data', 'danger');
        } finally {
            showLoading(false);
        }
    });
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page) {
                loadPage(page);
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close mobile menu
                closeMobileMenu();
            }
        });
    });
    
    // Mission cards navigation
    document.querySelectorAll('.mission-card').forEach(card => {
        card.addEventListener('click', () => {
            const nav = card.getAttribute('data-nav');
            if (nav) {
                loadPage(nav);
                document.querySelector(`.nav-link[data-page="${nav}"]`).click();
            }
        });
    });
}

function setupMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const closeBtn = document.getElementById('sidebar-close');
    
    menuBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
    });
    
    closeBtn.addEventListener('click', closeMobileMenu);
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('open') && 
            !sidebar.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    document.getElementById('sidebar').classList.remove('open');
}

function logout() {
    localStorage.removeItem('spyBattleAgent');
    STATE.agentNo = null;
    STATE.agentData = null;
    
    document.getElementById('dashboard-screen').classList.remove('active');
    document.getElementById('login-screen').classList.add('active');
    
    // Reset form
    document.getElementById('agent-input').value = '';
    document.getElementById('instagram-input').value = '';
}

// ==================== PAGE LOADING ====================
async function loadPage(pageName) {
    STATE.currentPage = pageName;
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Load page data
    showLoading(true);
    
    try {
        switch(pageName) {
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
        }
    } catch (error) {
        console.error('Page load error:', error);
        showAlert('Failed to load page data', 'danger');
    } finally {
        showLoading(false);
    }
}

// ==================== HOME PAGE ====================
async function loadHomePage() {
    document.getElementById('current-week-display').textContent = `Active Week: ${STATE.currentWeek}`;
    
    const summary = await apiCall('getWeeklySummary', { week: STATE.currentWeek });
    const rankings = await apiCall('getRankings', { week: STATE.currentWeek, limit: 5 });
    
    // Update mission status
    const team = STATE.agentData.profile.team;
    const teamInfo = summary.teams[team] || {};
    
    updateMissionStatus('home-track-status', teamInfo.trackGoalPassed);
    updateMissionStatus('home-album-status', teamInfo.albumGoalPassed);
    updateMissionStatus('home-2x-status', teamInfo.album2xPassed);
    
    // Top performers
    const performersHTML = rankings.rankings.map((r, i) => `
        <div class="stat-box">
            <div class="rank-badge">${i + 1}</div>
            <div style="margin-top: 12px; font-size: 14px; font-weight: bold;">${r.name}</div>
            <div class="team-badge ${getTeamClass(r.team)}" style="margin-top: 8px;">${r.team}</div>
            <div style="color: var(--primary); font-weight: bold; margin-top: 8px;">${r.totalXP} XP</div>
        </div>
    `).join('');
    
    document.getElementById('home-top-performers').innerHTML = 
        `<div class="stats-grid">${performersHTML}</div>`;
    
    // Team standings
    const teams = Object.keys(summary.teams);
    const standingsHTML = teams.map(t => {
        const data = summary.teams[t];
        return `
            <div class="stat-box" style="border-color: ${getTeamColor(t)};">
                <div style="font-size: 24px; margin-bottom: 8px;">🎭</div>
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
    
    // Stats grid
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
    
    // Track contributions
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
    
    // Album contributions
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
    
    // Album 2X status
    const album2xHTML = album2xStatus && album2xStatus.tracks 
        ? `
            <div style="text-align: center; padding: 20px; background: ${album2xStatus.passed ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)'}; border-radius: 8px; margin-bottom: 20px;">
                <div style="font-size: 48px; margin-bottom: 10px;">
                    ${album2xStatus.passed ? '✅' : '❌'}
                </div>
                <div style="font-size: 18px; font-weight: bold; color: ${album2xStatus.passed ? '#2ecc71' : '#e74c3c'};">
                    ${album2xStatus.passed ? 'Mission Complete!' : 'Mission Incomplete'}
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
                                        ${count >= 2 ? '✅ Pass' : '❌ Need ' + (2 - count)}
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
    
    // Team legend
    const legendHTML = Object.entries(CONFIG.TEAM_COLORS).map(([team, color]) => `
        <div class="team-legend-item">
            <div class="team-legend-color" style="background: ${color};"></div>
            <div class="team-legend-name">${team}</div>
        </div>
    `).join('');
    
    document.getElementById('team-legend').innerHTML = legendHTML;
    
    // Rankings table
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
    
    // Search functionality
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
                            <div class="progress-fill" style="width: ${percentage}%;"></div>
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
                            <div class="progress-fill" style="width: ${percentage}%;"></div>
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
                    ${m.passed ? '✅ Pass' : '❌ Fail'}
                </span>
            </div>
        `).join('');
        
        return `
            <div class="team-2x-card">
                <div class="team-2x-header">
                    <div class="team-2x-name" style="color: ${teamColor};">${team}</div>
                    <div class="team-2x-stats">
                        <div class="team-2x-stat">
                            <div class="team-2x-stat-label">Passed</div>
                            <div class="team-2x-stat-value" style="color: #2ecc71;">${data.passed}</div>
                        </div>
                        <div class="team-2x-stat">
                            <div class="team-2x-stat-label">Failed</div>
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
                            <span class="team-level-info-value ${teamData.missions.tracksPassed ? 'text-primary' : ''}" 
                                  style="color: ${teamData.missions.tracksPassed ? '#2ecc71' : '#e74c3c'};">
                                ${teamData.missions.tracksPassed ? '✅ Passed' : '❌ Failed'}
                            </span>
                        </div>
                        <div class="team-level-info-item">
                            <span class="team-level-info-label">Album Goals</span>
                            <span class="team-level-info-value" 
                                  style="color: ${teamData.missions.albumsPassed ? '#2ecc71' : '#e74c3c'};">
                                ${teamData.missions.albumsPassed ? '✅ Passed' : '❌ Failed'}
                            </span>
                        </div>
                        <div class="team-level-info-item">
                            <span class="team-level-info-label">Album 2X</span>
                            <span class="team-level-info-value" 
                                  style="color: ${teamData.missions.album2xPassed ? '#2ecc71' : '#e74c3c'};">
                                ${teamData.missions.album2xPassed ? '✅ Passed' : '❌ Failed'}
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
    
    // Create team selector buttons
    const buttonsHTML = teams.map(team => `
        <button class="team-button ${team === teams[0] ? 'active' : ''}" 
                data-team="${team}"
                style="border-color: ${getTeamColor(team)};">
            ${team}
        </button>
    `).join('');
    
    document.getElementById('team-chart-buttons').innerHTML = buttonsHTML;
    
    // Load first team by default
    await renderTeamCharts(teams[0]);
    
    // Setup button listeners
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
    
    // Destroy existing charts
    if (STATE.charts.teamXP) STATE.charts.teamXP.destroy();
    if (STATE.charts.teamMissions) STATE.charts.teamMissions.destroy();
    
    // Team XP Chart
    const xpCtx = document.getElementById('team-xp-chart').getContext('2d');
    STATE.charts.teamXP = new Chart(xpCtx, {
        type: 'line',
        data: {
            labels: chartData.weeks,
            datasets: [{
                label: 'Team XP',
                data: chartData.teamXP,
                borderColor: getTeamColor(team),
                backgroundColor: `${getTeamColor(team)}33`,
                tension: 0.4,
                fill: true
            }]
        },
        options: getChartOptions('Team XP Growth')
    });
    
    // Missions Chart
    const missionsCtx = document.getElementById('team-missions-chart').getContext('2d');
    STATE.charts.teamMissions = new Chart(missionsCtx, {
        type: 'bar',
        data: {
            labels: chartData.weeks,
            datasets: [{
                label: 'Missions Passed',
                data: chartData.missionsPassed,
                backgroundColor: getTeamColor(team),
                borderRadius: 8
            }]
        },
        options: {
            ...getChartOptions('Weekly Missions Completed'),
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
    
    // Rankings
    const rankingsHTML = `
        <div class="stats-grid">
            ${comparison.comparison.map((t, i) => `
                <div class="stat-box" style="border-color: ${getTeamColor(t.team)};">
                    <div class="rank-badge">${i + 1}</div>
                    <div style="margin-top: 15px; font-size: 18px; font-weight: bold; color: ${getTeamColor(t.team)};">
                        ${t.team}
                    </div>
                    <div style="margin-top: 8px; color: var(--text-secondary);">Level ${t.level}</div>
                    <div style="margin-top: 8px; color: var(--primary); font-weight: bold; font-size: 24px;">
                        ${t.teamXP} XP
                    </div>
                    ${t.winner ? '<div style="margin-top: 8px; font-size: 24px;">🏆</div>' : ''}
                </div>
            `).join('')}
        </div>
    `;
    
    document.getElementById('comparison-rankings').innerHTML = rankingsHTML;
    
    // Destroy existing charts
    if (STATE.charts.comparisonXP) STATE.charts.comparisonXP.destroy();
    if (STATE.charts.comparisonRadar) STATE.charts.comparisonRadar.destroy();
    
    // XP Comparison Chart
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
        options: getChartOptions('Team XP Comparison')
    });
    
    // Mission Success Radar
    const radarCtx = document.getElementById('comparison-radar-chart').getContext('2d');
    STATE.charts.comparisonRadar = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: comparison.comparison.map(t => t.team),
            datasets: [
                {
                    label: 'Track Goals',
                    data: comparison.comparison.map(t => t.missions.tracks ? 100 : 0),
                    borderColor: '#d4af37',
                    backgroundColor: 'rgba(212, 175, 55, 0.2)'
                },
                {
                    label: 'Album Goals',
                    data: comparison.comparison.map(t => t.missions.albums ? 100 : 0),
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)'
                },
                {
                    label: 'Album 2X',
                    data: comparison.comparison.map(t => t.missions.album2x ? 100 : 0),
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.2)'
                }
            ]
        },
        options: {
            ...getChartOptions('Mission Success Rate'),
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 25,
                        color: '#999',
                        backdropColor: 'transparent'
                    },
                    grid: {
                        color: 'rgba(212, 175, 55, 0.1)'
                    },
                    pointLabels: {
                        color: '#d4af37',
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

// ==================== SUMMARY PAGE ====================
async function loadSummaryPage() {
    const summary = await apiCall('getWeeklySummary', { week: STATE.currentWeek });
    
    // Winner card
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
    
    // Summary grid
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
                            ${data.trackGoalPassed ? '✅ Pass' : '❌ Fail'}
                        </span>
                    </div>
                    <div class="summary-mission-item">
                        <span class="summary-mission-label">Album Goals</span>
                        <span class="summary-mission-value" style="color: ${data.albumGoalPassed ? '#2ecc71' : '#e74c3c'};">
                            ${data.albumGoalPassed ? '✅ Pass' : '❌ Fail'}
                        </span>
                    </div>
                    <div class="summary-mission-item">
                        <span class="summary-mission-label">Album 2X</span>
                        <span class="summary-mission-value" style="color: ${data.album2xPassed ? '#2ecc71' : '#e74c3c'};">
                            ${data.album2xPassed ? '✅ Pass' : '❌ Fail'}
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

// ==================== DRAWER PAGE ====================
async function loadDrawerPage() {
    const badges = await apiCall('getBadges', { agentNo: STATE.agentNo });
    const winners = await apiCall('getWeeklyWinners');
    
    // Badges
    const badgesHTML = badges.badges.length > 0
        ? `<div class="badges-grid">
            ${badges.badges.map(b => `
                <div class="badge-item">
                    <div class="badge-image">
                        ${b.imageUrl ? `<img src="${b.imageUrl}" style="width: 100%; height: 100%; border-radius: 50%;">` : '🏅'}
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
    
    // Wins
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
