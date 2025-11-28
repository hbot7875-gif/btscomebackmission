// ===== SPY BATTLE APP.JS - COMPLETE VERSION =====

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

// ==================== UTILITY FUNCTIONS ====================
function showLoading(show = true) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        if (show) {
            overlay.classList.add('active');
            overlay.style.display = 'flex';
        } else {
            overlay.classList.remove('active');
            overlay.style.display = 'none';
        }
    }
}

function showAlert(message, type = 'info') {
    console.log('Alert:', type, message);
    const container = document.getElementById('alert-container');
    if (!container) {
        alert(message);
        return;
    }
    
    const alertEl = document.createElement('div');
    alertEl.className = `alert alert-${type}`;
    alertEl.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()">✕</button>`;
    alertEl.style.cssText = 'padding: 12px 16px; margin-bottom: 8px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; background: var(--glass-bg); border: 1px solid var(--glass-border);';
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

    console.log('🌐 API Call:', action);

    try {
        const res = await fetch(url.toString());
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const text = await res.text();
        
        let data;
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            throw new Error('Invalid response from server');
        }

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
    console.log('🚀 Initializing app...');
    
    // Check for saved session
    const saved = localStorage.getItem('spyBattleAgent');
    if (saved) {
        console.log('Found saved agent:', saved);
        STATE.agentNo = saved;
        showDashboard();
        return;
    }

    // Setup login button
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    // Setup find button
    const findBtn = document.getElementById('find-agent-btn');
    if (findBtn) {
        findBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleFindAgent();
        });
    }

    // Setup enter key for inputs
    const agentInput = document.getElementById('agent-input');
    if (agentInput) {
        agentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleLogin();
            }
        });
    }

    const instaInput = document.getElementById('instagram-input');
    if (instaInput) {
        instaInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleFindAgent();
            }
        });
    }
    
    console.log('✅ Login initialized');
}

async function handleLogin() {
    console.log('Login attempt...');
    
    const agentInput = document.getElementById('agent-input');
    if (!agentInput) {
        showAlert('Error: Input not found', 'error');
        return;
    }
    
    const agentNo = agentInput.value.trim();

    if (!agentNo) {
        showFindResult('Please enter your Agent Number', 'error');
        return;
    }

    showLoading(true);

    try {
        const allAgents = await apiCall('getAllAgents');

        if (!allAgents || !allAgents.agents) {
            showLoading(false);
            showFindResult('Server error: Invalid response', 'error');
            return;
        }

        // Find matching agent
        const matchingAgent = allAgents.agents.find(a => {
            return String(a.agentNo || '').trim() === String(agentNo).trim();
        });

        if (!matchingAgent) {
            showLoading(false);
            showFindResult('Agent Number not found. Please check and try again.', 'error');
            return;
        }

        // Save and proceed
        localStorage.setItem('spyBattleAgent', agentNo);
        STATE.agentNo = agentNo;
        await showDashboard();

    } catch (err) {
        console.error('Login error:', err);
        showLoading(false);
        showFindResult('Login failed: ' + (err.message || 'Unknown error'), 'error');
    }
}

async function handleFindAgent() {
    const instaInput = document.getElementById('instagram-input');
    if (!instaInput) return;
    
    const instagram = instaInput.value.trim();

    if (!instagram) {
        showFindResult('Please enter your Instagram username', 'error');
        return;
    }

    showLoading(true);

    try {
        const res = await apiCall('getAgentByInstagram', { instagram: instagram });
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
        showFindResult('Search failed: ' + err.message, 'error');
    }
}

function showFindResult(msg, type) {
    const el = document.getElementById('find-result');
    if (el) {
        el.textContent = msg;
        el.className = `find-result show ${type}`;
        el.style.display = 'block';
        el.style.padding = '12px';
        el.style.marginTop = '12px';
        el.style.borderRadius = '8px';
        el.style.background = type === 'success' ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)';
        el.style.border = type === 'success' ? '1px solid #00ff00' : '1px solid #ff0000';
        el.style.color = type === 'success' ? '#00ff00' : '#ff6b6b';
    }
}

// ==================== DASHBOARD FUNCTIONS ====================
async function showDashboard() {
    console.log('Loading dashboard...');
    showLoading(true);

    try {
        // Get weeks
        const weeksData = await apiCall('getAvailableWeeks');
        STATE.allWeeks = weeksData.weeks || [];
        STATE.currentWeek = weeksData.current || STATE.allWeeks[0];

        if (!STATE.currentWeek) {
            throw new Error('No weeks available');
        }

        // Get agent data
        const agentData = await apiCall('getAgentData', {
            agentNo: STATE.agentNo,
            week: STATE.currentWeek
        });
        STATE.agentData = agentData;

        // Switch screens
        const loginScreen = document.getElementById('login-screen');
        const dashboardScreen = document.getElementById('dashboard-screen');

        if (loginScreen) {
            loginScreen.style.display = 'none';
            loginScreen.classList.remove('active');
        }

        if (dashboardScreen) {
            dashboardScreen.style.display = 'block';
            dashboardScreen.classList.add('active');
        }

        // Initialize
        initDashboard();
        await loadPage('home');
        
        showLoading(false);
        console.log('✅ Dashboard loaded');

    } catch (err) {
        console.error('Dashboard error:', err);
        showLoading(false);
        showAlert('Failed to load: ' + err.message, 'danger');
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
    if (!p) return;

    const color = getTeamColor(p.team);
    const initial = (p.name || 'A').charAt(0).toUpperCase();
    const pfp = getTeamPFP(p.team);

    // Sidebar avatar
    const agentAvatar = document.getElementById('agent-avatar');
    if (agentAvatar) {
        if (pfp) {
            agentAvatar.innerHTML = `<img src="${pfp}" alt="${p.team}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        } else {
            agentAvatar.innerHTML = `<span>${initial}</span>`;
            agentAvatar.style.background = `linear-gradient(135deg, ${color}, ${color}aa)`;
        }
    }

    // Sidebar info
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
        if (pfp) {
            profileAvatar.innerHTML = `<img src="${pfp}" alt="${p.team}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        } else {
            profileAvatar.innerHTML = `<span>${initial}</span>`;
            profileAvatar.style.background = `linear-gradient(135deg, ${color}, ${color}aa)`;
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
            showAlert('Failed to load week', 'danger');
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
    localStorage.removeItem('spyBattleAgent');
    STATE.agentNo = null;
    STATE.agentData = null;
    location.reload();
}

// ==================== PAGE LOADER ====================
async function loadPage(page) {
    console.log('Loading page:', page);
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
        }
    } catch (err) {
        console.error('Page error:', err);
        showAlert('Failed to load page', 'danger');
    } finally {
        showLoading(false);
    }
}

// ==================== PAGE: HOME ====================
async function loadHomePage() {
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
            <div style="display:flex;align-items:center;padding:12px;background:var(--glass-bg);border-radius:8px;margin-bottom:8px;border-left:3px solid ${getTeamColor(r.team)}">
                <div style="width:32px;height:32px;background:var(--primary);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;margin-right:12px;">${i + 1}</div>
                <div style="flex:1;">
                    <div style="font-weight:bold;">${r.name || 'Unknown'}</div>
                    <div style="font-size:12px;color:${getTeamColor(r.team)}">${r.team}</div>
                </div>
                <div style="font-weight:bold;color:var(--primary);">${formatNumber(r.totalXP)} XP</div>
            </div>
        `).join('');

        const topPerformersEl = document.getElementById('home-top-performers');
        if (topPerformersEl) {
            topPerformersEl.innerHTML = performersHTML || '<p>No data available</p>';
        }

        // Team standings
        const teams = Object.keys(summary.teams || {});
        const standingsHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;">
            ${teams.map(t => {
                const data = summary.teams[t];
                const pfp = getTeamPFP(t);
                return `
                    <div style="background:var(--glass-bg);border-radius:12px;padding:16px;text-align:center;border:1px solid ${getTeamColor(t)}40;">
                        ${pfp ? `<img src="${pfp}" style="width:48px;height:48px;border-radius:50%;margin-bottom:8px;">` : ''}
                        <div style="color:${getTeamColor(t)};font-weight:bold;">${t}</div>
                        <div style="font-size:12px;opacity:0.7;">Level ${data.level || 0}</div>
                        <div style="font-size:18px;font-weight:bold;color:var(--primary);margin-top:8px;">${formatNumber(data.teamXP)} XP</div>
                        ${data.isWinner ? '<div style="margin-top:8px;">🏆</div>' : ''}
                    </div>
                `;
            }).join('')}
        </div>`;

        const standingsEl = document.getElementById('home-team-standings');
        if (standingsEl) {
            standingsEl.innerHTML = standingsHTML;
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
        element.textContent = '✅ COMPLETED';
        element.style.color = '#00ff88';
    } else {
        element.textContent = '⏳ IN PROGRESS';
        element.style.color = '#ffd93d';
    }
}

// ==================== PAGE: PROFILE ====================
async function loadProfilePage() {
    const p = STATE.agentData?.profile;
    const s = STATE.agentData?.stats;
    if (!p || !s) return;

    const statsContainer = document.getElementById('profile-stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:16px;">
                <div style="background:var(--glass-bg);padding:20px;border-radius:12px;text-align:center;">
                    <div style="font-size:28px;font-weight:bold;color:var(--primary);">${formatNumber(s.totalXP)}</div>
                    <div style="font-size:12px;opacity:0.7;margin-top:4px;">Total XP</div>
                </div>
                <div style="background:var(--glass-bg);padding:20px;border-radius:12px;text-align:center;">
                    <div style="font-size:28px;font-weight:bold;color:var(--primary);">#${s.rank || 'N/A'}</div>
                    <div style="font-size:12px;opacity:0.7;margin-top:4px;">Rank</div>
                </div>
                <div style="background:var(--glass-bg);padding:20px;border-radius:12px;text-align:center;">
                    <div style="font-size:28px;font-weight:bold;color:var(--primary);">${formatNumber(s.totalStreams || 0)}</div>
                    <div style="font-size:12px;opacity:0.7;margin-top:4px;">Streams</div>
                </div>
            </div>
        `;
    }

    // Track contributions
    const profileTracks = document.getElementById('profile-tracks');
    if (profileTracks && s.tracks) {
        profileTracks.innerHTML = Object.entries(s.tracks || {}).map(([track, count]) => `
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--glass-border);">
                <span>${track}</span>
                <span style="font-weight:bold;">${formatNumber(count)}</span>
            </div>
        `).join('') || '<p>No track data</p>';
    }

    // Album contributions
    const profileAlbums = document.getElementById('profile-albums');
    if (profileAlbums && s.albums) {
        profileAlbums.innerHTML = Object.entries(s.albums || {}).map(([album, count]) => `
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--glass-border);">
                <span>${album}</span>
                <span style="font-weight:bold;">${formatNumber(count)}</span>
            </div>
        `).join('') || '<p>No album data</p>';
    }
}

// ==================== PAGE: RANKINGS ====================
async function loadRankingsPage() {
    const data = await apiCall('getRankings', { week: STATE.currentWeek, limit: 100 });
    const container = document.getElementById('rankings-list');
    if (!container) return;

    const rankings = data.rankings || [];
    
    if (rankings.length === 0) {
        container.innerHTML = '<p>No rankings available</p>';
        return;
    }

    container.innerHTML = rankings.map((r, i) => {
        const isMe = String(r.agentNo) === String(STATE.agentNo);
        return `
            <div style="display:flex;align-items:center;padding:12px;background:${isMe ? 'rgba(212,175,55,0.2)' : 'var(--glass-bg)'};border-radius:8px;margin-bottom:8px;border-left:3px solid ${getTeamColor(r.team)}">
                <div style="width:40px;font-weight:bold;color:var(--primary);">#${i + 1}</div>
                <div style="flex:1;">
                    <div style="font-weight:bold;">${r.name}${isMe ? ' (You)' : ''}</div>
                    <div style="font-size:12px;color:${getTeamColor(r.team)}">${r.team}</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-weight:bold;">${formatNumber(r.totalXP)} XP</div>
                    <div style="font-size:12px;opacity:0.7;">${formatNumber(r.totalStreams || 0)} streams</div>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== PAGE: GOALS ====================
async function loadGoalsPage() {
    const data = await apiCall('getGoalsProgress', { week: STATE.currentWeek });
    const team = STATE.agentData?.profile?.team;
    const container = document.getElementById('goals-content');
    if (!container) return;

    let html = '<h3 style="margin-bottom:16px;color:var(--primary);">🎵 Track Goals</h3>';
    
    Object.entries(data.trackGoals || {}).forEach(([track, info]) => {
        const teamData = info.teams?.[team] || { current: 0 };
        const progress = Math.min(100, (teamData.current / info.goal) * 100);
        const passed = teamData.current >= info.goal;
        
        html += `
            <div style="margin-bottom:16px;padding:12px;background:var(--glass-bg);border-radius:8px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                    <span>${track}</span>
                    <span style="color:${passed ? '#00ff88' : 'var(--primary)'};">${formatNumber(teamData.current)}/${formatNumber(info.goal)} ${passed ? '✅' : ''}</span>
                </div>
                <div style="background:rgba(255,255,255,0.1);border-radius:4px;height:8px;overflow:hidden;">
                    <div style="background:${passed ? '#00ff88' : 'var(--primary)'};height:100%;width:${progress}%;transition:width 0.3s;"></div>
                </div>
            </div>
        `;
    });

    html += '<h3 style="margin:24px 0 16px;color:var(--primary);">💿 Album Goals</h3>';
    
    Object.entries(data.albumGoals || {}).forEach(([album, info]) => {
        const teamData = info.teams?.[team] || { current: 0 };
        const progress = Math.min(100, (teamData.current / info.goal) * 100);
        const passed = teamData.current >= info.goal;
        
        html += `
            <div style="margin-bottom:16px;padding:12px;background:var(--glass-bg);border-radius:8px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                    <span>${album}</span>
                    <span style="color:${passed ? '#00ff88' : 'var(--primary)'};">${formatNumber(teamData.current)}/${formatNumber(info.goal)} ${passed ? '✅' : ''}</span>
                </div>
                <div style="background:rgba(255,255,255,0.1);border-radius:4px;height:8px;overflow:hidden;">
                    <div style="background:${passed ? '#00ff88' : 'var(--primary)'};height:100%;width:${progress}%;transition:width 0.3s;"></div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ==================== PAGE: ALBUM 2X ====================
async function loadAlbum2xPage() {
    const container = document.getElementById('album2x-content');
    if (!container) return;

    try {
        const data = await apiCall('getAlbum2xProgress', { week: STATE.currentWeek });
        
        if (!data || !data.tracks) {
            container.innerHTML = '<p>No 2x album data available</p>';
            return;
        }

        const s = STATE.agentData?.stats;
        const tracks = data.tracks || [];
        
        let passedCount = 0;
        let html = '<div style="display:grid;gap:12px;">';
        
        tracks.forEach(track => {
            const myCount = s?.album2x?.[track.name] || 0;
            const passed = myCount >= 2;
            if (passed) passedCount++;
            
            html += `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:var(--glass-bg);border-radius:8px;border-left:3px solid ${passed ? '#00ff88' : '#ff6b6b'};">
                    <span>${track.name}</span>
                    <span style="color:${passed ? '#00ff88' : '#ff6b6b'};">${myCount}/2 ${passed ? '✅' : '❌'}</span>
                </div>
            `;
        });
        
        html += '</div>';
        
        const allPassed = passedCount === tracks.length;
        container.innerHTML = `
            <div style="text-align:center;padding:20px;background:var(--glass-bg);border-radius:12px;margin-bottom:20px;">
                <div style="font-size:48px;margin-bottom:12px;">${allPassed ? '🎉' : '⏳'}</div>
                <div style="font-size:24px;font-weight:bold;color:${allPassed ? '#00ff88' : 'var(--primary)'};">
                    ${passedCount}/${tracks.length} Tracks Complete
                </div>
                <div style="margin-top:8px;opacity:0.7;">
                    ${allPassed ? 'Mission Accomplished!' : 'Keep streaming!'}
                </div>
            </div>
            ${html}
        `;
    } catch (err) {
        container.innerHTML = '<p>Failed to load 2x data</p>';
    }
}

// ==================== PAGE: TEAM LEVEL ====================
async function loadTeamLevelPage() {
    const container = document.getElementById('team-level-content');
    if (!container) return;

    try {
        const data = await apiCall('getTeamLevels', { week: STATE.currentWeek });
        const teams = data.teams || {};
        
        container.innerHTML = `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;">
                ${Object.entries(teams).map(([team, info]) => `
                    <div style="background:var(--glass-bg);border-radius:16px;padding:24px;text-align:center;border:2px solid ${getTeamColor(team)}40;">
                        <img src="${getTeamPFP(team)}" style="width:64px;height:64px;border-radius:50%;margin-bottom:12px;" onerror="this.style.display='none'">
                        <div style="color:${getTeamColor(team)};font-weight:bold;font-size:18px;">${team}</div>
                        <div style="font-size:48px;font-weight:bold;margin:16px 0;">Level ${info.level || 0}</div>
                        <div style="font-size:14px;opacity:0.7;">${formatNumber(info.xp || 0)} XP</div>
                        <div style="margin-top:16px;background:rgba(255,255,255,0.1);border-radius:4px;height:8px;overflow:hidden;">
                            <div style="background:${getTeamColor(team)};height:100%;width:${info.progress || 0}%;"></div>
                        </div>
                        <div style="font-size:12px;margin-top:8px;opacity:0.7;">${info.progress || 0}% to next level</div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (err) {
        container.innerHTML = '<p>Failed to load team levels</p>';
    }
}

// ==================== PAGE: TEAM CHARTS ====================
async function loadTeamChartsPage() {
    const container = document.getElementById('team-charts-content');
    if (!container) return;
    
    try {
        const data = await apiCall('getTeamChartData', { week: STATE.currentWeek });
        
        // Destroy existing chart
        if (STATE.charts.teamXP) {
            STATE.charts.teamXP.destroy();
        }
        
        const ctx = document.getElementById('team-xp-chart');
        if (!ctx) return;
        
        const teams = Object.keys(data.teams || {});
        const xpData = teams.map(t => data.teams[t].totalXP || 0);
        const colors = teams.map(t => getTeamColor(t));
        
        STATE.charts.teamXP = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: teams,
                datasets: [{
                    label: 'Total XP',
                    data: xpData,
                    backgroundColor: colors,
                    borderColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    } catch (err) {
        container.innerHTML = '<p>Failed to load chart data</p>';
    }
}

// ==================== PAGE: TEAM COMPARISON ====================
async function loadTeamComparisonPage() {
    const container = document.getElementById('team-comparison-content');
    if (!container) return;

    try {
        const data = await apiCall('getTeamComparison', { week: STATE.currentWeek });
        const teams = data.teams || {};
        
        container.innerHTML = `
            <div style="overflow-x:auto;">
                <table style="width:100%;border-collapse:collapse;">
                    <thead>
                        <tr style="border-bottom:2px solid var(--glass-border);">
                            <th style="padding:12px;text-align:left;">Team</th>
                            <th style="padding:12px;text-align:right;">Members</th>
                            <th style="padding:12px;text-align:right;">Total XP</th>
                            <th style="padding:12px;text-align:right;">Avg XP</th>
                            <th style="padding:12px;text-align:right;">Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(teams).map(([team, info]) => `
                            <tr style="border-bottom:1px solid var(--glass-border);">
                                <td style="padding:12px;color:${getTeamColor(team)};font-weight:bold;">${team}</td>
                                <td style="padding:12px;text-align:right;">${info.members || 0}</td>
                                <td style="padding:12px;text-align:right;">${formatNumber(info.totalXP || 0)}</td>
                                <td style="padding:12px;text-align:right;">${formatNumber(info.avgXP || 0)}</td>
                                <td style="padding:12px;text-align:right;">${info.level || 0}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (err) {
        container.innerHTML = '<p>Failed to load comparison</p>';
    }
}

// ==================== PAGE: SUMMARY ====================
async function loadSummaryPage() {
    const container = document.getElementById('summary-content');
    if (!container) return;

    try {
        const data = await apiCall('getWeeklySummary', { week: STATE.currentWeek });
        const teams = data.teams || {};
        const winner = Object.entries(teams).find(([_, t]) => t.isWinner);
        
        container.innerHTML = `
            ${winner ? `
                <div style="text-align:center;padding:32px;background:linear-gradient(135deg,${getTeamColor(winner[0])}22,transparent);border-radius:16px;margin-bottom:24px;border:2px solid ${getTeamColor(winner[0])};">
                    <div style="font-size:64px;">🏆</div>
                    <h2 style="color:${getTeamColor(winner[0])};margin:16px 0;">${winner[0]} WINS!</h2>
                    <p style="font-size:24px;">${formatNumber(winner[1].teamXP)} Total XP</p>
                </div>
            ` : '<p>No winner declared yet</p>'}
            
            <h3 style="margin-bottom:16px;">All Teams</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;">
                ${Object.entries(teams).map(([team, info]) => `
                    <div style="background:var(--glass-bg);padding:20px;border-radius:12px;text-align:center;border-left:3px solid ${getTeamColor(team)};">
                        <div style="color:${getTeamColor(team)};font-weight:bold;">${team}</div>
                        <div style="font-size:24px;font-weight:bold;margin-top:8px;">${formatNumber(info.teamXP || 0)}</div>
                        <div style="font-size:12px;opacity:0.7;">XP</div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (err) {
        container.innerHTML = '<p>Failed to load summary</p>';
    }
}

// ==================== PAGE: DRAWER ====================
async function loadDrawerPage() {
    const container = document.getElementById('drawer-content');
    if (!container) return;

    try {
        const data = await apiCall('getDrawerEligible', { week: STATE.currentWeek });
        const eligible = data.eligible || [];
        
        if (eligible.length === 0) {
            container.innerHTML = '<p style="text-align:center;padding:40px;">No eligible agents for drawer this week</p>';
            return;
        }

        container.innerHTML = `
            <div style="text-align:center;padding:20px;background:var(--glass-bg);border-radius:12px;margin-bottom:20px;">
                <div style="font-size:48px;">🎖️</div>
                <div style="font-size:24px;font-weight:bold;margin-top:12px;">${eligible.length} Agents Eligible</div>
            </div>
            <div style="display:grid;gap:8px;">
                ${eligible.map(agent => `
                    <div style="display:flex;align-items:center;padding:12px;background:var(--glass-bg);border-radius:8px;border-left:3px solid ${getTeamColor(agent.team)};">
                        <div style="flex:1;font-weight:bold;">${agent.name}</div>
                        <div style="color:${getTeamColor(agent.team)};">${agent.team}</div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (err) {
        container.innerHTML = '<p>Failed to load drawer data</p>';
    }
}

// ==================== PAGE: ANNOUNCEMENTS ====================
async function loadAnnouncementsPage() {
    const container = document.getElementById('announcements-content');
    if (!container) return;

    try {
        const data = await apiCall('getAnnouncements');
        const announcements = data.announcements || [];
        
        if (announcements.length === 0) {
            container.innerHTML = '<p style="text-align:center;padding:40px;">No announcements at this time</p>';
            return;
        }

        container.innerHTML = announcements.map(a => `
            <div style="padding:20px;background:var(--glass-bg);border-radius:12px;margin-bottom:16px;border-left:3px solid var(--primary);">
                <div style="font-size:12px;color:var(--primary);margin-bottom:8px;">${a.date || ''}</div>
                <h3 style="margin-bottom:12px;">${a.title || ''}</h3>
                <p style="opacity:0.8;line-height:1.6;">${a.content || ''}</p>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = '<p>Failed to load announcements</p>';
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 App starting...');
    initLogin();
});

// Backup init for cached pages
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initLogin, 100);
}
