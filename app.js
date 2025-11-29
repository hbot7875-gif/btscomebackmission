// ===== BTS SPY BATTLE - COMPLETE FIXED APP.JS =====

const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbx5ArHi5Ws0NxMa9nhORy6bZ7ZYpW4urPIap24tax9H1HLuGQxYRCgTVwDaKOMrZ7JOGA/exec',
    
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
    
    // FIXED: Corrected image URLs
    TEAM_PFPS: {
        "Indigo": "https://i.ibb.co/4g9KWg3/team-Indigo.png",
        "Echo": "https://i.ibb.co/7xdY9xC/Team-Echo.png",
        "Agust D": "https://i.ibb.co/BVc11nz/Team-agustd.png",
        "JITB": "https://i.ibb.co/FbdLFwh/Team-jitb.png"
    }
};

const STATE = {
    agentNo: null,
    week: null,
    weeks: [],
    data: null,
    page: 'home',
    charts: {},
    isLoading: false
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

function showResult(msg, isError) {
    const el = $('find-result');
    if (!el) return;
    
    el.innerHTML = `
        <span style="margin-right:8px;">${isError ? '⚠️' : '✅'}</span>
        ${msg}
    `;
    el.className = `result-box show ${isError ? 'error' : 'success'}`;
    
    // Auto-hide success messages after 5 seconds
    if (!isError) {
        setTimeout(() => {
            el.classList.remove('show');
        }, 5000);
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

// Sanitize input to prevent XSS
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

// Get days until Sunday
function getDaysUntilSunday() {
    const now = new Date();
    const day = now.getDay();
    return day === 0 ? 0 : 7 - day;
}

// Check if it's Sunday
function isSunday() {
    return new Date().getDay() === 0;
}

// ==================== API ====================
async function api(action, params = {}) {
    const url = new URL(CONFIG.API_URL);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([k, v]) => {
        if (v != null) url.searchParams.set(k, v);
    });
    
    console.log('📡 API:', action, params);
    
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout
        
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

// ==================== LOGIN ====================
function initApp() {
    console.log('🚀 Starting BTS Spy Battle app...');
    
    const saved = localStorage.getItem('spyAgent');
    if (saved) {
        STATE.agentNo = saved;
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
    
    // Focus on agent input
    setTimeout(() => $('agent-input')?.focus(), 100);
}

async function handleLogin() {
    const agentInput = $('agent-input');
    const agentNo = agentInput?.value.trim();
    
    if (!agentNo) {
        showResult('Please enter your Agent Number', true);
        agentInput?.focus();
        return;
    }
    
    const loginBtn = $('login-btn');
    if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';
    }
    
    loading(true);
    
    try {
        const res = await api('getAllAgents');
        const agents = res.agents || [];
        const found = agents.find(a => String(a.agentNo).trim() === agentNo);
        
        if (!found) {
            loading(false);
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.textContent = 'Login';
            }
            showResult('Agent not found. Check your number or use "Find My ID" below.', true);
            return;
        }
        
        localStorage.setItem('spyAgent', agentNo);
        STATE.agentNo = agentNo;
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

async function handleFind() {
    const instaInput = $('instagram-input');
    let insta = instaInput?.value.trim().toLowerCase();
    
    if (!insta) {
        showResult('Please enter Instagram username', true);
        instaInput?.focus();
        return;
    }
    
    // Remove @ if user includes it
    insta = insta.replace(/^@/, '');
    
    const findBtn = $('find-btn');
    if (findBtn) {
        findBtn.disabled = true;
        findBtn.textContent = 'Searching...';
    }
    
    loading(true);
    
    try {
        const res = await api('getAgentByInstagram', { instagram: insta });
        loading(false);
        
        if (findBtn) {
            findBtn.disabled = false;
            findBtn.textContent = 'Find My ID';
        }
        
        // Handle different response formats
        if (res.found && res.agentNo) {
            $('agent-input').value = res.agentNo;
            showResult(`Found! Your Agent Number: ${res.agentNo}`, false);
            setTimeout(() => $('login-btn')?.focus(), 300);
        } else if (res.result && res.result.includes('Agent Number is:')) {
            const num = res.result.split(':')[1].trim();
            $('agent-input').value = num;
            showResult(`Found! Your Agent Number: ${num}`, false);
            setTimeout(() => $('login-btn')?.focus(), 300);
        } else if (res.agentNo) {
            $('agent-input').value = res.agentNo;
            showResult(`Found! Your Agent Number: ${res.agentNo}`, false);
            setTimeout(() => $('login-btn')?.focus(), 300);
        } else {
            showResult(res.message || res.result || 'Username not found. Check spelling or register first.', true);
        }
    } catch (e) {
        loading(false);
        if (findBtn) {
            findBtn.disabled = false;
            findBtn.textContent = 'Find My ID';
        }
        showResult('Search failed. Please try again.', true);
        console.error('Find error:', e);
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
        
        console.log('📦 Agent Data:', STATE.data);
        
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
        
    } catch (e) {
        console.error('Dashboard error:', e);
        loading(false);
        alert('Failed to load dashboard: ' + e.message);
        logout();
    }
}

function setupDashboard() {
    const p = STATE.data?.profile;
    
    if (p) {
        const color = teamColor(p.team);
        const pfp = teamPfp(p.team);
        const initial = (p.name || 'A')[0].toUpperCase();
        
        // Sidebar avatar
        const avatar = $('agent-avatar');
        if (avatar) {
            if (pfp) {
                avatar.innerHTML = `<img src="${pfp}" alt="${sanitize(p.team)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.parentElement.textContent='${initial}'">`;
            } else {
                avatar.textContent = initial;
                avatar.style.background = color;
            }
        }
        
        // Sidebar info
        if ($('agent-name')) $('agent-name').textContent = sanitize(p.name) || 'Agent';
        if ($('agent-team')) {
            $('agent-team').textContent = sanitize(p.team) || 'Team';
            $('agent-team').style.color = color;
        }
        if ($('agent-id')) $('agent-id').textContent = 'ID: ' + STATE.agentNo;
        
        // Profile page avatar
        const pAvatar = $('profile-avatar');
        if (pAvatar) {
            if (pfp) {
                pAvatar.innerHTML = `<img src="${pfp}" alt="${sanitize(p.team)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.parentElement.textContent='${initial}'">`;
            } else {
                pAvatar.textContent = initial;
                pAvatar.style.background = color;
            }
        }
        if ($('profile-name')) $('profile-name').textContent = sanitize(p.name) || 'Agent';
        if ($('profile-team')) {
            $('profile-team').textContent = sanitize(p.team) || 'Team';
            $('profile-team').style.color = color;
        }
        if ($('profile-id')) $('profile-id').textContent = 'Agent ID: ' + STATE.agentNo;
    }
    
    // Week selector
    const select = $('week-select');
    if (select && STATE.weeks.length) {
        select.innerHTML = STATE.weeks.map(w => 
            `<option value="${sanitize(w)}" ${w === STATE.week ? 'selected' : ''}>${sanitize(w)}</option>`
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
                alert('Failed to load week: ' + e.message);
            }
            loading(false);
        };
    }
    
    // Navigation links
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
    
    // Menu button
    $('menu-btn')?.addEventListener('click', () => {
        $('sidebar')?.classList.add('open');
    });
    
    // Close sidebar
    $('close-sidebar')?.addEventListener('click', closeSidebar);
    
    // Logout button
    $('logout-btn')?.addEventListener('click', logout);
    
    // Close sidebar on outside click
    document.addEventListener('click', (e) => {
        const sidebar = $('sidebar');
        const menuBtn = $('menu-btn');
        if (sidebar?.classList.contains('open') && 
            !sidebar.contains(e.target) && 
            !menuBtn?.contains(e.target)) {
            closeSidebar();
        }
    });
    
    // Update time
    updateTime();
    setInterval(updateTime, 60000);
}

function closeSidebar() {
    $('sidebar')?.classList.remove('open');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('spyAgent');
        location.reload();
    }
}

// ==================== PAGE ROUTER ====================
async function loadPage(page) {
    console.log('📄 Loading page:', page);
    STATE.page = page;
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show target page
    const el = $('page-' + page);
    if (el) el.classList.add('active');
    
    // Scroll to top
    el?.scrollTo(0, 0);
    
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
            default:
                console.warn('Unknown page:', page);
        }
    } catch (e) {
        console.error('Page error:', e);
        if (el) {
            el.innerHTML = `
                <div class="card">
                    <div class="card-body" style="text-align:center;padding:40px;">
                        <div style="font-size:48px;margin-bottom:16px;">⚠️</div>
                        <h3>Failed to load page</h3>
                        <p style="color:var(--text-dim);margin:12px 0;">${sanitize(e.message)}</p>
                        <button onclick="loadPage('${page}')" style="background:var(--purple-main);color:white;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;">
                            Try Again
                        </button>
                    </div>
                </div>
            `;
        }
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
        
        console.log('📊 Summary:', summary);
        console.log('🏆 Rankings:', rankings);
        console.log('🎯 Goals:', goals);
        
        const team = STATE.data?.profile?.team;
        const teamData = summary.teams?.[team] || {};
        const myStats = STATE.data?.stats || {};
        const sunday = isSunday();
        const daysLeft = getDaysUntilSunday();
        
        // ========== QUICK STATS SECTION ==========
        renderQuickStats(team, myStats, sunday, daysLeft);
        
        // ========== MISSION CARDS ==========
        renderMissionCards(team, teamData, goals);
        
        // ========== TOP AGENTS ==========
        renderTopAgents(rankings);
        
        // ========== TEAM STANDINGS ==========
        renderTeamStandings(summary, team, sunday);
        
    } catch (e) {
        console.error('Home error:', e);
        $('home-top-agents').innerHTML = '<p style="color:var(--danger);">Failed to load data. <a href="#" onclick="loadPage(\'home\')">Retry</a></p>';
    }
}

function renderQuickStats(team, myStats, sunday, daysLeft) {
    const mainContent = $('page-home');
    if (!mainContent) return;
    
    // Remove existing quick stats
    const existing = mainContent.querySelector('.quick-stats-card');
    if (existing) existing.remove();
    
    const quickStatsHtml = `
        <div class="card quick-stats-card" style="margin-bottom:20px;background:linear-gradient(135deg, ${teamColor(team)}22, var(--bg-card));border:1px solid ${teamColor(team)}44;">
            <div class="card-body">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
                    ${teamPfp(team) ? `<img src="${teamPfp(team)}" style="width:48px;height:48px;border-radius:50%;border:2px solid ${teamColor(team)};" onerror="this.style.display='none'">` : ''}
                    <div>
                        <div style="font-weight:600;color:var(--text-bright);">Welcome back, ${sanitize(STATE.data?.profile?.name) || 'Agent'}!</div>
                        <div style="font-size:12px;color:${teamColor(team)};">Team ${sanitize(team)} • Rank #${STATE.data?.rank || 'N/A'}</div>
                    </div>
                </div>
                
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;">
                    <div style="padding:12px;background:var(--bg-dark);border-radius:10px;">
                        <div style="font-size:24px;font-weight:700;color:var(--purple-glow);">${fmt(myStats.totalXP)}</div>
                        <div style="font-size:11px;color:var(--text-dim);">My XP</div>
                    </div>
                    <div style="padding:12px;background:var(--bg-dark);border-radius:10px;">
                        <div style="font-size:24px;font-weight:700;color:var(--success);">${fmt(myStats.trackScrobbles || 0)}</div>
                        <div style="font-size:11px;color:var(--text-dim);">Tracks</div>
                    </div>
                    <div style="padding:12px;background:var(--bg-dark);border-radius:10px;">
                        <div style="font-size:24px;font-weight:700;color:var(--purple-light);">${fmt(myStats.albumScrobbles || 0)}</div>
                        <div style="font-size:11px;color:var(--text-dim);">Albums</div>
                    </div>
                </div>
                
                <div style="margin-top:16px;padding:12px;background:var(--bg-dark);border-radius:10px;text-align:center;">
                    ${sunday ? `
                        <div style="color:var(--success);font-weight:600;">🏆 Results Are In!</div>
                        <div style="font-size:12px;color:var(--text-dim);">Check Weekly Summary for final standings</div>
                    ` : `
                        <div style="color:var(--warning);font-weight:600;">⏰ ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left in battle</div>
                        <div style="font-size:12px;color:var(--text-dim);">Battle ends Saturday 11:55 PM</div>
                    `}
                </div>
            </div>
        </div>
    `;
    
    const quickStatsDiv = document.createElement('div');
    quickStatsDiv.innerHTML = quickStatsHtml;
    
    const firstSection = mainContent.querySelector('h2')?.parentElement || mainContent.firstChild;
    if (firstSection) {
        mainContent.insertBefore(quickStatsDiv.firstChild, firstSection.nextSibling);
    }
}

function renderMissionCards(team, teamData, goals) {
    const trackGoals = goals.trackGoals || {};
    const albumGoals = goals.albumGoals || {};
    const teamTracks = CONFIG.TEAM_ALBUM_TRACKS[team] || [];
    const albumName = CONFIG.TEAMS[team]?.album || team;
    
    // Calculate progress
    const trackCount = Object.keys(trackGoals).length;
    const trackComplete = Object.values(trackGoals).filter(g => g.teams?.[team]?.status === 'Completed').length;
    
    const albumCount = Object.keys(albumGoals).length;
    const albumComplete = Object.values(albumGoals).filter(g => g.teams?.[team]?.status === 'Completed').length;
    
    const album2xStatus = STATE.data?.album2xStatus || {};
    const userTracksFor2x = album2xStatus.tracks || {};
    const tracksCompleted2x = teamTracks.filter(t => (userTracksFor2x[t] || 0) >= 2).length;

    const missionCardsContainer = document.querySelector('.missions-grid');
    if (!missionCardsContainer) return;
    
    missionCardsContainer.innerHTML = `
        <!-- Track Goals Card -->
        <div class="mission-card" onclick="loadPage('goals')" style="cursor:pointer;">
            <div class="mission-icon">🎵</div>
            <h3>Track Goals</h3>
            <div class="mission-status ${teamData.trackGoalPassed ? 'complete' : 'pending'}">
                ${teamData.trackGoalPassed ? '✅ Complete' : '⏳ In Progress'}
            </div>
            <div style="margin-top:12px;">
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
                    <span style="color:var(--text-dim);">Team Progress</span>
                    <span style="color:var(--purple-light);">${trackComplete}/${trackCount}</span>
                </div>
                <div style="background:var(--bg-dark);border-radius:6px;height:8px;overflow:hidden;">
                    <div style="background:${teamData.trackGoalPassed ? 'var(--success)' : 'var(--purple-main)'};height:100%;width:${trackCount ? (trackComplete/trackCount*100) : 0}%;transition:width 0.3s;"></div>
                </div>
            </div>
            <div style="font-size:11px;color:var(--text-dim);margin-top:8px;">
                Tap to view all tracks →
            </div>
        </div>
        
        <!-- Album Goals Card -->
        <div class="mission-card" onclick="loadPage('goals')" style="cursor:pointer;">
            <div class="mission-icon">💿</div>
            <h3>Album Goals</h3>
            <div class="mission-status ${teamData.albumGoalPassed ? 'complete' : 'pending'}">
                ${teamData.albumGoalPassed ? '✅ Complete' : '⏳ In Progress'}
            </div>
            <div style="margin-top:12px;">
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
                    <span style="color:var(--text-dim);">Team Progress</span>
                    <span style="color:var(--purple-light);">${albumComplete}/${albumCount}</span>
                </div>
                <div style="background:var(--bg-dark);border-radius:6px;height:8px;overflow:hidden;">
                    <div style="background:${teamData.albumGoalPassed ? 'var(--success)' : 'var(--purple-main)'};height:100%;width:${albumCount ? (albumComplete/albumCount*100) : 0}%;transition:width 0.3s;"></div>
                </div>
            </div>
            <div style="font-size:11px;color:var(--text-dim);margin-top:8px;">
                Tap to view all albums →
            </div>
        </div>
        
        <!-- Album 2X Card -->
        <div class="mission-card" onclick="loadPage('album2x')" style="cursor:pointer;">
            <div class="mission-icon">✨</div>
            <h3>Album 2X Mission</h3>
            <div class="mission-status ${album2xStatus.passed ? 'complete' : 'pending'}">
                ${album2xStatus.passed ? '✅ Complete' : '⏳ In Progress'}
            </div>
            <div style="margin-top:12px;">
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
                    <span style="color:var(--text-dim);">Your Progress</span>
                    <span style="color:var(--purple-light);">${tracksCompleted2x}/${teamTracks.length}</span>
                </div>
                <div style="background:var(--bg-dark);border-radius:6px;height:8px;overflow:hidden;">
                    <div style="background:${album2xStatus.passed ? 'var(--success)' : 'var(--purple-main)'};height:100%;width:${teamTracks.length ? (tracksCompleted2x/teamTracks.length*100) : 0}%;transition:width 0.3s;"></div>
                </div>
            </div>
            <div style="font-size:11px;color:var(--text-dim);margin-top:8px;">
                📀 ${sanitize(albumName)} • Stream 2× each →
            </div>
        </div>
    `;
}

function renderTopAgents(rankings) {
    const rankList = rankings.rankings || [];
    const myAgentNo = STATE.agentNo;
    
    const container = $('home-top-agents');
    if (!container) return;
    
    container.innerHTML = rankList.length ? `
        ${rankList.slice(0, 5).map((r, i) => {
            const isMe = String(r.agentNo) === String(myAgentNo);
            return `
                <div class="rank-item ${isMe ? 'highlight' : ''}" style="cursor:pointer;" onclick="loadPage('rankings')">
                    <div class="rank-num" style="font-size:${i < 3 ? '20px' : '16px'};">
                        ${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : r.rank || i + 1}
                    </div>
                    <div class="rank-info">
                        <div class="rank-name">${sanitize(r.name) || 'Agent'}${isMe ? ' (You)' : ''}</div>
                        <div class="rank-team" style="color:${teamColor(r.team)}">${sanitize(r.team) || 'Team'}</div>
                    </div>
                    <div class="rank-xp">${fmt(r.totalXP)} XP</div>
                </div>
            `;
        }).join('')}
        <div style="text-align:center;margin-top:12px;">
            <button onclick="loadPage('rankings')" class="btn-secondary">
                View All Rankings →
            </button>
        </div>
    ` : '<p style="text-align:center;color:var(--text-dim);">No rankings available</p>';
}

function renderTeamStandings(summary, myTeam, sunday) {
    const teams = summary.teams || {};
    const teamNames = Object.keys(teams);
    const sortedTeams = teamNames.sort((a, b) => (teams[b].teamXP || 0) - (teams[a].teamXP || 0));
    const maxXP = teams[sortedTeams[0]]?.teamXP || 1;
    
    const container = $('home-standings');
    if (!container) return;
    
    container.innerHTML = teamNames.length ? `
        <div style="text-align:center;margin-bottom:16px;">
            <span style="font-size:12px;padding:6px 16px;background:${sunday ? 'rgba(74,222,128,0.1)' : 'rgba(251,191,36,0.1)'};border:1px solid ${sunday ? 'var(--success)' : 'var(--warning)'};border-radius:20px;color:${sunday ? 'var(--success)' : 'var(--warning)'};">
                ${sunday ? '🏆 Final Results' : '⏳ Battle in Progress'}
            </span>
        </div>
        
        ${sortedTeams.map((t, i) => {
            const td = teams[t];
            const isMyTeam = t === myTeam;
            const barWidth = ((td.teamXP || 0) / maxXP) * 100;
            const showTrophy = sunday && td.isWinner;
            const missionsComplete = (td.trackGoalPassed ? 1 : 0) + (td.albumGoalPassed ? 1 : 0) + (td.album2xPassed ? 1 : 0);
            
            return `
                <div class="team-standing-card ${isMyTeam ? 'my-team' : ''}" style="margin-bottom:16px;padding:16px;background:${isMyTeam ? teamColor(t) + '11' : 'var(--bg-dark)'};border-radius:12px;border:${isMyTeam ? '2px solid ' + teamColor(t) : '1px solid var(--border)'};cursor:pointer;" onclick="loadPage('team-level')">
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
                        <span style="font-size:20px;width:28px;">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}</span>
                        ${teamPfp(t) ? `<img src="${teamPfp(t)}" style="width:36px;height:36px;border-radius:50%;" onerror="this.style.display='none'">` : ''}
                        <div style="flex:1;">
                            <div style="color:${teamColor(t)};font-weight:600;">${sanitize(t)}${isMyTeam ? ' ⭐' : ''}${showTrophy ? ' 🏆' : ''}</div>
                            <div style="font-size:11px;color:var(--text-dim);">Level ${td.level || 0}</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-weight:700;color:var(--purple-glow);">${fmt(td.teamXP)}</div>
                            <div style="font-size:11px;color:var(--text-dim);">XP</div>
                        </div>
                    </div>
                    
                    <div style="background:var(--bg-card);border-radius:6px;height:8px;overflow:hidden;margin-bottom:10px;">
                        <div style="background:${teamColor(t)};height:100%;width:${barWidth}%;transition:width 0.5s;"></div>
                    </div>
                    
                    <div style="display:flex;justify-content:space-between;font-size:12px;">
                        <div style="display:flex;gap:8px;">
                            <span title="Track Goals">${td.trackGoalPassed ? '🎵✅' : '🎵❌'}</span>
                            <span title="Album Goals">${td.albumGoalPassed ? '💿✅' : '💿❌'}</span>
                            <span title="Album 2X">${td.album2xPassed ? '✨✅' : '✨❌'}</span>
                        </div>
                        <span style="color:var(--text-dim);">${missionsComplete}/3 missions</span>
                    </div>
                </div>
            `;
        }).join('')}
    ` : '<p>No team data available</p>';
}

// ==================== PROFILE PAGE ====================
async function renderProfile() {
    const stats = STATE.data?.stats || {};
    const profile = STATE.data?.profile || {};
    const rank = STATE.data?.rank;
    const teamRank = STATE.data?.teamRank;
    const trackContributions = STATE.data?.trackContributions || {};
    const albumContributions = STATE.data?.albumContributions || {};
    const album2xStatus = STATE.data?.album2xStatus || {};
    
    console.log('👤 Profile data:', STATE.data);
    
    // Stats grid
    const statsContainer = $('profile-stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-box">
                <div class="stat-value">${fmt(stats.totalXP)}</div>
                <div class="stat-label">Total XP</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">#${rank || 'N/A'}</div>
                <div class="stat-label">Global Rank</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">#${teamRank || 'N/A'}</div>
                <div class="stat-label">Team Rank</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${fmt(stats.trackScrobbles)}</div>
                <div class="stat-label">Track Streams</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${fmt(stats.albumScrobbles)}</div>
                <div class="stat-label">Album Streams</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${album2xStatus.passed ? '✅' : '❌'}</div>
                <div class="stat-label">Album 2X</div>
            </div>
        `;
    }
    
    // Track contributions
    const tracksContainer = $('profile-tracks');
    if (tracksContainer) {
        const trackEntries = Object.entries(trackContributions).sort((a, b) => b[1] - a[1]);
        tracksContainer.innerHTML = trackEntries.length ? 
            trackEntries.map(([t, c]) => `
                <div class="contribution-item">
                    <span class="contribution-name">${sanitize(t)}</span>
                    <span class="contribution-value">${fmt(c)}</span>
                </div>
            `).join('') 
        : '<p style="color:var(--text-dim);text-align:center;">No track data yet</p>';
    }
    
    // Album contributions
    const albumsContainer = $('profile-albums');
    if (albumsContainer) {
        const albumEntries = Object.entries(albumContributions).sort((a, b) => b[1] - a[1]);
        albumsContainer.innerHTML = albumEntries.length ?
            albumEntries.map(([a, c]) => `
                <div class="contribution-item">
                    <span class="contribution-name">${sanitize(a)}</span>
                    <span class="contribution-value">${fmt(c)}</span>
                </div>
            `).join('')
        : '<p style="color:var(--text-dim);text-align:center;">No album data yet</p>';
    }
    
    // Badges
    try {
        const badgesData = await api('getBadges', { agentNo: STATE.agentNo });
        const badges = badgesData.badges || [];
        
        const badgesContainer = $('profile-badges');
        if (badgesContainer) {
            badgesContainer.innerHTML = badges.length ? `
                <div class="badges-grid">
                    ${badges.map(b => `
                        <div class="badge-item">
                            <div class="badge-icon">
                                ${b.imageUrl ? `<img src="${b.imageUrl}" alt="${sanitize(b.name)}" onerror="this.parentElement.innerHTML='🎖️'">` : '🎖️'}
                            </div>
                            <div class="badge-name">${sanitize(b.name) || 'Badge'}</div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p style="color:var(--text-dim);text-align:center;">No badges earned yet. Complete missions to earn badges!</p>';
        }
    } catch (e) {
        const badgesContainer = $('profile-badges');
        if (badgesContainer) {
            badgesContainer.innerHTML = '<p style="color:var(--text-dim);text-align:center;">Could not load badges</p>';
        }
    }
}

// ==================== RANKINGS PAGE ====================
async function renderRankings() {
    const container = $('rankings-list');
    if (!container) return;
    
    container.innerHTML = '<div class="loading-skeleton"></div>';
    
    try {
        const data = await api('getRankings', { week: STATE.week, limit: 100 });
        const list = data.rankings || [];
        
        console.log('🏆 Full rankings:', list);
        
        container.innerHTML = list.length ? list.map((r, i) => {
            const isMe = String(r.agentNo) === String(STATE.agentNo);
            return `
                <div class="rank-item ${isMe ? 'highlight' : ''}">
                    <div class="rank-num">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : r.rank || i + 1}</div>
                    <div class="rank-info">
                        <div class="rank-name">${sanitize(r.name)}${isMe ? ' (You)' : ''}</div>
                        <div class="rank-team" style="color:${teamColor(r.team)}">${sanitize(r.team)}</div>
                    </div>
                    <div style="text-align:right;">
                        <div class="rank-xp">${fmt(r.totalXP)} XP</div>
                        <div style="font-size:11px;color:var(--text-dim);">${fmt((r.trackScrobbles || 0) + (r.albumScrobbles || 0))} streams</div>
                    </div>
                </div>
            `;
        }).join('') : '<p style="text-align:center;color:var(--text-dim);">No rankings available</p>';
        
    } catch (e) {
        container.innerHTML = `<p style="color:var(--danger);">Failed to load rankings. <a href="#" onclick="loadPage('rankings')">Retry</a></p>`;
    }
}

// ==================== GOALS PAGE ====================
async function renderGoals() {
    const container = $('goals-content');
    if (!container) return;
    
    container.innerHTML = '<div class="loading-skeleton"></div>';
    
    try {
        const data = await api('getGoalsProgress', { week: STATE.week });
        const team = STATE.data?.profile?.team;
        
        console.log('🎯 Goals data:', data);
        
        let html = '';
        
        // Track goals
        const trackGoals = data.trackGoals || {};
        if (Object.keys(trackGoals).length) {
            html += `
                <div class="card">
                    <div class="card-header"><h3>🎵 Track Goals</h3></div>
                    <div class="card-body">
            `;
            
            for (const [track, info] of Object.entries(trackGoals)) {
                const teamProgress = info.teams?.[team] || {};
                const current = teamProgress.current || 0;
                const goal = info.goal || 100;
                const pct = teamProgress.percentage || 0;
                const status = teamProgress.status || 'Behind';
                const done = status === 'Completed';
                
                html += `
                    <div class="goal-item">
                        <div class="goal-header">
                            <span class="goal-name">${sanitize(track)}</span>
                            <span class="goal-progress ${done ? 'complete' : ''}">${fmt(current)}/${fmt(goal)} ${done ? '✅' : ''}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${done ? 'complete' : ''}" style="width:${Math.min(100, pct)}%;"></div>
                        </div>
                        <div class="goal-status">${status} - ${pct.toFixed(1)}%</div>
                    </div>
                `;
            }
            html += '</div></div>';
        }
        
        // Album goals
        const albumGoals = data.albumGoals || {};
        if (Object.keys(albumGoals).length) {
            html += `
                <div class="card">
                    <div class="card-header"><h3>💿 Album Goals</h3></div>
                    <div class="card-body">
            `;
            
            for (const [album, info] of Object.entries(albumGoals)) {
                const teamProgress = info.teams?.[team] || {};
                const current = teamProgress.current || 0;
                const goal = info.goal || 100;
                const pct = teamProgress.percentage || 0;
                const status = teamProgress.status || 'Behind';
                const done = status === 'Completed';
                
                html += `
                    <div class="goal-item">
                        <div class="goal-header">
                            <span class="goal-name">${sanitize(album)}</span>
                            <span class="goal-progress ${done ? 'complete' : ''}">${fmt(current)}/${fmt(goal)} ${done ? '✅' : ''}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${done ? 'complete' : ''}" style="width:${Math.min(100, pct)}%;"></div>
                        </div>
                        <div class="goal-status">${status} - ${pct.toFixed(1)}%</div>
                    </div>
                `;
            }
            html += '</div></div>';
        }
        
        container.innerHTML = html || `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:40px;">
                    <div style="font-size:48px;margin-bottom:16px;">🎯</div>
                    <p style="color:var(--text-dim);">No goals data available for this week</p>
                </div>
            </div>
        `;
        
    } catch (e) {
        console.error('Goals error:', e);
        container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <p style="color:var(--danger);">Failed to load goals. <a href="#" onclick="loadPage('goals')">Retry</a></p>
                </div>
            </div>
        `;
    }
}

// ==================== ALBUM 2X PAGE ====================
async function renderAlbum2x() {
    const container = $('album2x-content');
    if (!container) return;
    
    const team = STATE.data?.profile?.team;
    const album2xStatus = STATE.data?.album2xStatus || {};
    const userTracks = album2xStatus.tracks || {};
    const teamTracks = CONFIG.TEAM_ALBUM_TRACKS[team] || [];
    const albumName = CONFIG.TEAMS[team]?.album || team;
    
    console.log('💿 Album 2X - Team:', team);
    console.log('💿 Album 2X - User tracks:', userTracks);
    
    if (teamTracks.length === 0) {
        container.innerHTML = `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:40px;">
                    <div style="font-size:48px;margin-bottom:16px;">💿</div>
                    <h3>Album 2X Mission</h3>
                    <p style="color:var(--text-dim);">No album tracks configured for team ${sanitize(team)}</p>
                </div>
            </div>
        `;
        return;
    }
    
    let completedCount = 0;
    const trackResults = teamTracks.map(track => {
        const count = userTracks[track] || 0;
        const trackPassed = count >= 2;
        if (trackPassed) completedCount++;
        return { name: track, count, passed: trackPassed };
    });
    
    const allComplete = completedCount === trackResults.length;
    const pct = Math.round((completedCount / trackResults.length) * 100);
    
    container.innerHTML = `
        <!-- Progress Overview -->
        <div class="card" style="border: 2px solid ${allComplete ? 'var(--success)' : 'var(--purple-main)'};">
            <div class="card-body" style="text-align:center;padding:30px;">
                <div style="font-size:56px;margin-bottom:16px;">${allComplete ? '🎉' : '⏳'}</div>
                <div style="font-size:32px;font-weight:700;color:${allComplete ? 'var(--success)' : 'var(--purple-glow)'};">
                    ${completedCount} / ${trackResults.length}
                </div>
                <p style="color:var(--text-dim);margin:12px 0;">Tracks Completed (2+ streams each)</p>
                
                <div style="background:var(--bg-dark);border-radius:10px;height:16px;overflow:hidden;margin:20px auto;max-width:300px;">
                    <div style="background:${allComplete ? 'var(--success)' : 'linear-gradient(90deg, var(--purple-main), var(--purple-glow))'};height:100%;width:${pct}%;transition:width 0.5s;border-radius:10px;"></div>
                </div>
                <p style="color:${allComplete ? 'var(--success)' : 'var(--purple-light)'};">
                    ${allComplete ? '🎊 Mission Complete!' : `${pct}% Complete - Keep streaming!`}
                </p>
            </div>
        </div>
        
        <!-- Track List -->
        <div class="card">
            <div class="card-header"><h3>💿 ${sanitize(albumName)} - Track Status</h3></div>
            <div class="card-body">
                ${trackResults.map((t, i) => `
                    <div class="track-status-item" style="border-left-color:${t.passed ? 'var(--success)' : 'var(--danger)'};">
                        <span class="track-number">${i + 1}</span>
                        <span class="track-name">${sanitize(t.name)}</span>
                        <span class="track-count ${t.passed ? 'complete' : 'incomplete'}">
                            ${t.count}/2 ${t.passed ? '✅' : '❌'}
                        </span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Team Status -->
        <div class="card">
            <div class="card-header"><h3>👥 Team Album 2X Status</h3></div>
            <div class="card-body" id="team-2x-status">
                <div class="loading-skeleton"></div>
            </div>
        </div>
    `;
    
    // Load team status
    try {
        const team2xData = await api('getAlbum2xStatus', { week: STATE.week, team: team });
        const teamStatus = team2xData.teams?.[team] || {};
        const members = teamStatus.members || [];
        
        const teamStatusContainer = $('team-2x-status');
        if (teamStatusContainer) {
            teamStatusContainer.innerHTML = `
                <div class="team-2x-summary">
                    <div class="team-2x-stat">
                        <div class="stat-value" style="color:var(--success);">${teamStatus.passed || 0}</div>
                        <div class="stat-label">Completed</div>
                    </div>
                    <div class="team-2x-stat">
                        <div class="stat-value" style="color:var(--danger);">${teamStatus.failed || 0}</div>
                        <div class="stat-label">Incomplete</div>
                    </div>
                    <div class="team-2x-stat">
                        <div class="stat-value">${teamStatus.totalMembers || 0}</div>
                        <div class="stat-label">Total</div>
                    </div>
                </div>
                
                <div class="team-members-list">
                    ${members.map(m => `
                        <div class="member-status-item" style="border-left-color:${m.passed ? 'var(--success)' : 'var(--danger)'};">
                            <span>${sanitize(m.name)}</span>
                            <span>${m.passed ? '✅' : '❌'}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } catch (e) {
        const teamStatusContainer = $('team-2x-status');
        if (teamStatusContainer) {
            teamStatusContainer.innerHTML = '<p style="color:var(--text-dim);">Could not load team status</p>';
        }
    }
}

// ==================== TEAM LEVEL PAGE ====================
async function renderTeamLevel() {
    const container = $('team-level-content');
    if (!container) return;
    
    container.innerHTML = '<div class="loading-skeleton"></div>';
    
    try {
        const summary = await api('getWeeklySummary', { week: STATE.week });
        const teams = summary.teams || {};
        const myTeam = STATE.data?.profile?.team;
        
        console.log('📊 Team levels:', teams);
        
        const getLevelProgress = (xp, level) => {
            const xpPerLevel = 500;
            const xpInCurrentLevel = xp % xpPerLevel;
            return Math.round((xpInCurrentLevel / xpPerLevel) * 100);
        };
        
        container.innerHTML = `
            <div class="card" style="margin-bottom:24px;">
                <div class="card-header">
                    <h3>📈 Team Progression Overview</h3>
                </div>
                <div class="card-body">
                    <p style="color:var(--text-dim);margin-bottom:16px;">
                        Teams level up by completing all 3 weekly missions: Track Goals, Album Goals, and Album 2X.
                    </p>
                </div>
            </div>
            
            <div class="stats-grid team-level-grid">
                ${Object.entries(teams).sort((a, b) => (b[1].teamXP || 0) - (a[1].teamXP || 0)).map(([t, info]) => {
                    const progress = getLevelProgress(info.teamXP || 0, info.level || 1);
                    const isMyTeam = t === myTeam;
                    const missionsCompleted = (info.trackGoalPassed ? 1 : 0) + (info.albumGoalPassed ? 1 : 0) + (info.album2xPassed ? 1 : 0);
                    
                    return `
                        <div class="card team-level-card ${isMyTeam ? 'my-team' : ''}" style="border:2px solid ${isMyTeam ? teamColor(t) : 'var(--border)'};${isMyTeam ? 'box-shadow:0 0 20px ' + teamColor(t) + '33;' : ''}">
                            <div class="card-body" style="text-align:center;">
                                ${isMyTeam ? '<div class="my-team-badge">Your Team</div>' : ''}
                                
                                ${teamPfp(t) ? `<img src="${teamPfp(t)}" class="team-avatar" style="border-color:${teamColor(t)};" onerror="this.style.display='none'">` : ''}
                                
                                <div style="color:${teamColor(t)};font-weight:700;font-size:20px;margin-bottom:8px;">${sanitize(t)}</div>
                                
                                <div class="level-display">
                                    ${info.level || 1}
                                </div>
                                <div class="level-label">LEVEL</div>
                                
                                <div class="xp-display">
                                    <div class="xp-value">${fmt(info.teamXP)}</div>
                                    <div class="xp-label">Total XP</div>
                                </div>
                                
                                <!-- Level Progress Bar -->
                                <div class="level-progress">
                                    <div class="progress-header">
                                        <span>Progress to Level ${(info.level || 1) + 1}</span>
                                        <span>${progress}%</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="background:${teamColor(t)};width:${progress}%;"></div>
                                    </div>
                                </div>
                                
                                <!-- Missions Status -->
                                <div class="missions-status">
                                    <div class="missions-header">Weekly Missions: ${missionsCompleted}/3</div>
                                    
                                    <div class="mission-item">
                                        <span>🎵 Track Goals</span>
                                        <span>${info.trackGoalPassed ? '✅' : '❌'}</span>
                                    </div>
                                    <div class="mission-item">
                                        <span>💿 Album Goals</span>
                                        <span>${info.albumGoalPassed ? '✅' : '❌'}</span>
                                    </div>
                                    <div class="mission-item">
                                        <span>✨ Album 2X</span>
                                        <span>${info.album2xPassed ? '✅' : '❌'}</span>
                                    </div>
                                    
                                    ${missionsCompleted === 3 ? `
                                        <div class="missions-complete-badge">
                                            🎉 All Missions Complete! Level Up Earned!
                                        </div>
                                    ` : `
                                        <div class="missions-pending-badge">
                                            ⏳ ${3 - missionsCompleted} mission${3 - missionsCompleted > 1 ? 's' : ''} remaining
                                        </div>
                                    `}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
    } catch (e) {
        console.error('Team level error:', e);
        container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <p style="color:var(--danger);">Failed to load team levels. <a href="#" onclick="loadPage('team-level')">Retry</a></p>
                </div>
            </div>
        `;
    }
}

// ==================== TEAM CHARTS PAGE ====================
async function renderTeamCharts() {
    try {
        const team = STATE.data?.profile?.team;
        const [chartData, summary] = await Promise.all([
            api('getTeamChartData', { team: team }),
            api('getWeeklySummary', { week: STATE.week })
        ]);
        
        const teams = summary.teams || {};
        const teamNames = Object.keys(teams);
        
        // Destroy existing charts
        if (STATE.charts.teamXP) {
            STATE.charts.teamXP.destroy();
            STATE.charts.teamXP = null;
        }
        if (STATE.charts.teamLevels) {
            STATE.charts.teamLevels.destroy();
            STATE.charts.teamLevels = null;
        }
        
        // Team XP Bar Chart
        const ctx1 = $('chart-team-xp')?.getContext('2d');
        if (ctx1) {
            STATE.charts.teamXP = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: teamNames,
                    datasets: [{
                        label: 'Team XP',
                        data: teamNames.map(t => teams[t].teamXP || 0),
                        backgroundColor: teamNames.map(t => teamColor(t)),
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                        legend: { display: false },
                        title: { display: true, text: 'Team XP Comparison', color: '#c77dff' }
                    },
                    scales: {
                        y: { beginAtZero: true, ticks: { color: '#888' }, grid: { color: '#2a2a4a' } },
                        x: { ticks: { color: '#888' }, grid: { display: false } }
                    }
                }
            });
        }
        
        // Team XP Over Time Line Chart
        const ctx2 = $('chart-team-levels')?.getContext('2d');
        if (ctx2 && chartData.weeks?.length) {
            STATE.charts.teamLevels = new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: chartData.weeks,
                    datasets: [{
                        label: `${team} XP Growth`,
                        data: chartData.teamXP,
                        borderColor: teamColor(team),
                        backgroundColor: teamColor(team) + '33',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: { display: true, text: `${team} XP Over Time`, color: '#c77dff' }
                    },
                    scales: {
                        y: { beginAtZero: true, ticks: { color: '#888' }, grid: { color: '#2a2a4a' } },
                        x: { ticks: { color: '#888' }, grid: { display: false } }
                    }
                }
            });
        }
        
    } catch (e) {
        console.error('Team charts error:', e);
    }
}

// ==================== AGENT CHARTS PAGE ====================
async function renderAgentCharts() {
    try {
        const chartData = await api('getAgentChartData', { agentNo: STATE.agentNo });
        const trackContributions = STATE.data?.trackContributions || {};
        const albumContributions = STATE.data?.albumContributions || {};
        
        // Destroy existing charts
        if (STATE.charts.agentTracks) {
            STATE.charts.agentTracks.destroy();
            STATE.charts.agentTracks = null;
        }
        if (STATE.charts.agentAlbums) {
            STATE.charts.agentAlbums.destroy();
            STATE.charts.agentAlbums = null;
        }
        
        // Top Tracks Bar Chart
        const ctx1 = $('chart-agent-tracks')?.getContext('2d');
        if (ctx1 && Object.keys(trackContributions).length) {
            const sorted = Object.entries(trackContributions).sort((a, b) => b[1] - a[1]).slice(0, 10);
            
            STATE.charts.agentTracks = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: sorted.map(([k]) => k.length > 25 ? k.substring(0, 25) + '...' : k),
                    datasets: [{
                        label: 'Streams',
                        data: sorted.map(([, v]) => v),
                        backgroundColor: '#7b2cbf',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { beginAtZero: true, ticks: { color: '#888' }, grid: { color: '#2a2a4a' } },
                        y: { ticks: { color: '#888', font: { size: 10 } }, grid: { display: false } }
                    }
                }
            });
        }
        
        // Album Distribution Doughnut Chart
        const ctx2 = $('chart-agent-albums')?.getContext('2d');
        if (ctx2 && Object.keys(albumContributions).length) {
            STATE.charts.agentAlbums = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(albumContributions),
                    datasets: [{
                        data: Object.values(albumContributions),
                        backgroundColor: ['#7b2cbf', '#9d4edd', '#c77dff', '#4cc9f0', '#f72585', '#ff9500', '#06d6a0']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#e0e0f0', padding: 15 } }
                    }
                }
            });
        }
        
    } catch (e) {
        console.error('Agent charts error:', e);
    }
}

// ==================== COMPARISON PAGE ====================
async function renderComparison() {
    const container = $('comparison-content');
    if (!container) return;
    
    container.innerHTML = '<div class="loading-skeleton"></div>';
    
    try {
        const [comparison, goals] = await Promise.all([
            api('getTeamComparison', { week: STATE.week }),
            api('getGoalsProgress', { week: STATE.week })
        ]);
        
        const teams = comparison.comparison || [];
        const trackGoals = goals.trackGoals || {};
        const albumGoals = goals.albumGoals || {};
        
        console.log('⚔️ Comparison:', comparison);
        
        // Sort by XP
        teams.sort((a, b) => (b.teamXP || 0) - (a.teamXP || 0));
        
        container.innerHTML = `
            <!-- XP Leaderboard -->
            <div class="card">
                <div class="card-header">
                    <h3>⚔️ XP Battle Standings</h3>
                </div>
                <div class="card-body">
                    ${teams.map((t, i) => {
                        const maxXP = teams[0]?.teamXP || 1;
                        const barWidth = ((t.teamXP || 0) / maxXP) * 100;
                        
                        return `
                            <div class="comparison-team-item">
                                <div class="comparison-team-header">
                                    <span class="comparison-rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}</span>
                                    ${teamPfp(t.team) ? `<img src="${teamPfp(t.team)}" class="comparison-team-pfp" onerror="this.style.display='none'">` : ''}
                                    <span class="comparison-team-name" style="color:${teamColor(t.team)}">${sanitize(t.team)}</span>
                                    <span class="comparison-team-xp">${fmt(t.teamXP)} XP</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="background:${teamColor(t.team)};width:${barWidth}%;"></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <!-- Mission Comparison Table -->
            <div class="card">
                <div class="card-header">
                    <h3>📊 Mission Status Comparison</h3>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="comparison-table">
                            <thead>
                                <tr>
                                    <th>Team</th>
                                    <th>Level</th>
                                    <th>🎵</th>
                                    <th>💿</th>
                                    <th>✨</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${teams.map(t => {
                                    const missions = t.missions || {};
                                    const completed = (missions.tracks ? 1 : 0) + (missions.albums ? 1 : 0) + (missions.album2x ? 1 : 0);
                                    
                                    return `
                                        <tr>
                                            <td>
                                                <div class="table-team-cell">
                                                    ${teamPfp(t.team) ? `<img src="${teamPfp(t.team)}" class="table-team-pfp" onerror="this.style.display='none'">` : ''}
                                                    <span style="color:${teamColor(t.team)};font-weight:600;">${sanitize(t.team)}</span>
                                                </div>
                                            </td>
                                            <td style="font-weight:600;">${t.level}</td>
                                            <td>${missions.tracks ? '✅' : '❌'}</td>
                                            <td>${missions.albums ? '✅' : '❌'}</td>
                                            <td>${missions.album2x ? '✅' : '❌'}</td>
                                            <td>
                                                <span class="missions-badge ${completed === 3 ? 'complete' : ''}">
                                                    ${completed}/3
                                                </span>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- Track Goals Comparison -->
            ${Object.keys(trackGoals).length ? `
                <div class="card">
                    <div class="card-header">
                        <h3>🎵 Track Goals by Team</h3>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="comparison-table">
                                <thead>
                                    <tr>
                                        <th>Track</th>
                                        <th>Goal</th>
                                        ${teams.map(t => `<th style="color:${teamColor(t.team)};">${sanitize(t.team)}</th>`).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${Object.entries(trackGoals).map(([track, info]) => `
                                        <tr>
                                            <td class="track-name-cell">${sanitize(track)}</td>
                                            <td style="color:var(--purple-light);">${fmt(info.goal)}</td>
                                            ${teams.map(t => {
                                                const teamProgress = info.teams?.[t.team] || {};
                                                const current = teamProgress.current || 0;
                                                const done = current >= info.goal;
                                                return `
                                                    <td style="color:${done ? 'var(--success)' : 'var(--text-dim)'};">
                                                        ${fmt(current)}${done ? ' ✅' : ''}
                                                    </td>
                                                `;
                                            }).join('')}
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <!-- Album Goals Comparison -->
            ${Object.keys(albumGoals).length ? `
                <div class="card">
                    <div class="card-header">
                        <h3>💿 Album Goals by Team</h3>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="comparison-table">
                                <thead>
                                    <tr>
                                        <th>Album</th>
                                        <th>Goal</th>
                                        ${teams.map(t => `<th style="color:${teamColor(t.team)};">${sanitize(t.team)}</th>`).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${Object.entries(albumGoals).map(([album, info]) => `
                                        <tr>
                                            <td class="track-name-cell">${sanitize(album)}</td>
                                            <td style="color:var(--purple-light);">${fmt(info.goal)}</td>
                                            ${teams.map(t => {
                                                const teamProgress = info.teams?.[t.team] || {};
                                                const current = teamProgress.current || 0;
                                                const done = current >= info.goal;
                                                return `
                                                    <td style="color:${done ? 'var(--success)' : 'var(--text-dim)'};">
                                                        ${fmt(current)}${done ? ' ✅' : ''}
                                                    </td>
                                                `;
                                            }).join('')}
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
        
    } catch (e) {
        console.error('Comparison error:', e);
        container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <p style="color:var(--danger);">Failed to load comparison. <a href="#" onclick="loadPage('comparison')">Retry</a></p>
                </div>
            </div>
        `;
    }
}

// ==================== SUMMARY PAGE (CONTINUED) ====================
async function renderSummary() {
    const container = $('summary-content');
    if (!container) return;
    
    const now = new Date();
    const day = now.getDay();
    
    // Lock until Sunday
    if (day !== 0) {
        const daysUntilSunday = getDaysUntilSunday();
        
        container.innerHTML = `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:60px 20px;">
                    <div style="font-size:80px;margin-bottom:24px;">🔒</div>
                    <h2 style="margin-bottom:16px;color:var(--text-bright);">Weekly Summary Locked</h2>
                    <p style="color:var(--text-dim);margin-bottom:24px;">
                        The battle is still in progress! Results will be revealed on <strong style="color:var(--purple-light);">Sunday at 12:00 AM</strong>.
                    </p>
                    
                    <div style="background:var(--bg-dark);border-radius:16px;padding:24px;max-width:300px;margin:0 auto;">
                        <div style="font-size:14px;color:var(--text-dim);margin-bottom:8px;">Battle ends in</div>
                        <div style="font-size:48px;font-weight:700;color:var(--purple-glow);">${daysUntilSunday}</div>
                        <div style="font-size:16px;color:var(--text-dim);">day${daysUntilSunday !== 1 ? 's' : ''}</div>
                        <div style="font-size:12px;color:var(--text-dim);margin-top:8px;">Saturday 11:55 PM</div>
                    </div>
                    
                    <div style="margin-top:32px;padding:16px;background:rgba(123,44,191,0.1);border:1px solid var(--purple-main);border-radius:12px;max-width:400px;margin-left:auto;margin-right:auto;">
                        <div style="font-size:24px;margin-bottom:8px;">⏳</div>
                        <p style="font-size:13px;color:var(--purple-light);">
                            Keep streaming to help your team win! Every stream counts.
                        </p>
                    </div>
                    
                    <div style="margin-top:24px;">
                        <button onclick="loadPage('home')" class="btn-primary">
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    // Sunday - Show results
    container.innerHTML = '<div class="loading-skeleton"></div>';
    
    try {
        const [summary, winnersData] = await Promise.all([
            api('getWeeklySummary', { week: STATE.week }),
            api('getWeeklyWinners').catch(() => ({ winners: [] }))
        ]);
        
        const teams = summary.teams || {};
        const winner = summary.winner;
        const winners = winnersData.winners || [];
        
        // Sort teams by XP
        const sortedTeams = Object.entries(teams).sort((a, b) => (b[1].teamXP || 0) - (a[1].teamXP || 0));
        
        container.innerHTML = `
            <!-- Winner Announcement -->
            ${winner ? `
                <div class="card winner-card" style="background:linear-gradient(135deg, ${teamColor(winner)}33, var(--bg-card));border:3px solid ${teamColor(winner)};margin-bottom:24px;">
                    <div class="card-body" style="text-align:center;padding:48px 24px;">
                        <div class="winner-trophy">🏆</div>
                        <div style="font-size:14px;color:var(--text-dim);text-transform:uppercase;letter-spacing:3px;margin-bottom:8px;">This Week's Champion</div>
                        <h2 style="color:${teamColor(winner)};font-size:36px;margin-bottom:16px;font-family:'Orbitron',monospace;">${sanitize(winner)}</h2>
                        ${teamPfp(winner) ? `<img src="${teamPfp(winner)}" style="width:80px;height:80px;border-radius:50%;border:3px solid ${teamColor(winner)};margin-bottom:16px;" onerror="this.style.display='none'">` : ''}
                        <div style="font-size:28px;font-weight:700;color:var(--purple-glow);">${fmt(teams[winner]?.teamXP)} XP</div>
                        <div style="margin-top:16px;font-size:14px;color:var(--text-dim);">
                            Level ${teams[winner]?.level || 1} • 
                            ${teams[winner]?.trackGoalPassed && teams[winner]?.albumGoalPassed && teams[winner]?.album2xPassed ? 'All missions completed ✅' : 'Some missions pending'}
                        </div>
                    </div>
                </div>
            ` : `
                <div class="card" style="margin-bottom:24px;">
                    <div class="card-body" style="text-align:center;padding:40px;">
                        <div style="font-size:48px;margin-bottom:16px;">🤝</div>
                        <h3>No Winner This Week</h3>
                        <p style="color:var(--text-dim);">It's a tie or results are still being calculated.</p>
                    </div>
                </div>
            `}
            
            <!-- Final Standings -->
            <div class="card">
                <div class="card-header">
                    <h3>📊 Final Standings - ${sanitize(STATE.week)}</h3>
                </div>
                <div class="card-body">
                    ${sortedTeams.map(([t, info], i) => `
                        <div class="final-standing-item" style="border-left-color:${teamColor(t)};">
                            <div class="standing-rank">
                                ${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                            </div>
                            ${teamPfp(t) ? `<img src="${teamPfp(t)}" class="standing-pfp" onerror="this.style.display='none'">` : ''}
                            <div class="standing-info">
                                <div style="color:${teamColor(t)};font-weight:700;font-size:18px;">${sanitize(t)}</div>
                                <div style="font-size:12px;color:var(--text-dim);">Level ${info.level || 1}</div>
                            </div>
                            <div class="standing-stats">
                                <div style="font-size:20px;font-weight:700;color:var(--purple-glow);">${fmt(info.teamXP)} XP</div>
                                <div style="font-size:11px;color:var(--text-dim);">
                                    ${info.trackGoalPassed ? '🎵✅' : '🎵❌'}
                                    ${info.albumGoalPassed ? '💿✅' : '💿❌'}
                                    ${info.album2xPassed ? '✨✅' : '✨❌'}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Historical Winners -->
            ${winners.length > 0 ? `
                <div class="card">
                    <div class="card-header">
                        <h3>🏆 All-Time Winners</h3>
                    </div>
                    <div class="card-body">
                        <div class="winners-grid">
                            ${winners.map(w => `
                                <div class="winner-item" style="border-left-color:${teamColor(w.team)};">
                                    <div class="winner-week">${sanitize(w.week)}</div>
                                    <div class="winner-team" style="color:${teamColor(w.team)};">${sanitize(w.team)}</div>
                                    <div class="winner-xp">${fmt(w.teamXP)} XP</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <!-- Share Card -->
            <div class="card">
                <div class="card-header">
                    <h3>📱 Share Results</h3>
                </div>
                <div class="card-body" style="text-align:center;">
                    <p style="color:var(--text-dim);margin-bottom:16px;">Share this week's results!</p>
                    <div class="share-preview">
                        <div style="font-size:12px;color:var(--purple-light);margin-bottom:8px;">BTS Spy Battle - ${sanitize(STATE.week)}</div>
                        ${winner ? `
                            <div style="font-size:16px;margin-bottom:4px;">🏆 Winner: <span style="color:${teamColor(winner)}">${sanitize(winner)}</span></div>
                            <div style="font-size:14px;color:var(--purple-glow);">${fmt(teams[winner]?.teamXP)} XP</div>
                        ` : '<div>Results calculating...</div>'}
                    </div>
                    <button onclick="shareResults()" class="btn-primary" style="margin-top:16px;">
                        📤 Share
                    </button>
                </div>
            </div>
        `;
        
    } catch (e) {
        console.error('Summary error:', e);
        container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <p style="color:var(--danger);">Failed to load summary. <a href="#" onclick="loadPage('summary')">Retry</a></p>
                </div>
            </div>
        `;
    }
}

// Share results function
function shareResults() {
    const text = `🎮 BTS Spy Battle - ${STATE.week}\n\nCheck out the results!\n\n#BTSSpyBattle #BTS`;
    
    if (navigator.share) {
        navigator.share({
            title: 'BTS Spy Battle Results',
            text: text,
            url: window.location.href
        }).catch(() => {});
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            alert('Results copied to clipboard!');
        }).catch(() => {
            alert('Could not share. Please copy manually.');
        });
    }
}

// ==================== DRAWER PAGE ====================
async function renderDrawer() {
    const container = $('drawer-content');
    if (!container) return;
    
    container.innerHTML = '<div class="loading-skeleton"></div>';
    
    try {
        const badgesData = await api('getBadges', { agentNo: STATE.agentNo });
        const badges = badgesData.badges || [];
        
        let winnersHtml = '';
        try {
            const winnersData = await api('getWeeklyWinners');
            const winners = winnersData.winners || [];
            const myTeam = STATE.data?.profile?.team;
            const myWins = winners.filter(w => w.team === myTeam);
            
            if (myWins.length > 0) {
                winnersHtml = `
                    <div class="card">
                        <div class="card-header"><h3>🏆 Team Victories</h3></div>
                        <div class="card-body">
                            <div style="text-align:center;margin-bottom:16px;">
                                <span style="font-size:48px;">${myWins.length}</span>
                                <div style="color:var(--text-dim);font-size:14px;">Total Wins</div>
                            </div>
                            ${myWins.map(w => `
                                <div class="victory-item">
                                    <span class="victory-week">${sanitize(w.week)}</span>
                                    <div class="victory-info">
                                        <span style="color:var(--success);">🏆 Winner</span>
                                        <span style="font-size:12px;color:var(--text-dim);">${fmt(w.teamXP)} XP</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        } catch (e) {
            console.log('Could not load winners:', e);
        }
        
        // Stats summary
        const stats = STATE.data?.stats || {};
        const profile = STATE.data?.profile || {};
        
        container.innerHTML = `
            <!-- Agent Summary Card -->
            <div class="card">
                <div class="card-header"><h3>📋 Agent Summary</h3></div>
                <div class="card-body">
                    <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid var(--border);">
                        ${teamPfp(profile.team) ? `<img src="${teamPfp(profile.team)}" style="width:60px;height:60px;border-radius:50%;border:3px solid ${teamColor(profile.team)};" onerror="this.style.display='none'">` : ''}
                        <div>
                            <div style="font-size:18px;font-weight:600;color:var(--text-bright);">${sanitize(profile.name)}</div>
                            <div style="color:${teamColor(profile.team)};font-size:14px;">Team ${sanitize(profile.team)}</div>
                            <div style="font-size:12px;color:var(--text-dim);">Agent #${STATE.agentNo}</div>
                        </div>
                    </div>
                    
                    <div class="drawer-stats-grid">
                        <div class="drawer-stat">
                            <div class="drawer-stat-value">${fmt(stats.totalXP)}</div>
                            <div class="drawer-stat-label">Total XP</div>
                        </div>
                        <div class="drawer-stat">
                            <div class="drawer-stat-value">#${STATE.data?.rank || 'N/A'}</div>
                            <div class="drawer-stat-label">Global Rank</div>
                        </div>
                        <div class="drawer-stat">
                            <div class="drawer-stat-value">${fmt((stats.trackScrobbles || 0) + (stats.albumScrobbles || 0))}</div>
                            <div class="drawer-stat-label">Total Streams</div>
                        </div>
                        <div class="drawer-stat">
                            <div class="drawer-stat-value">${badges.length}</div>
                            <div class="drawer-stat-label">Badges</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Badges Card -->
            <div class="card">
                <div class="card-header"><h3>🎖️ My Badges</h3></div>
                <div class="card-body">
                    ${badges.length ? `
                        <div class="badges-showcase">
                            ${badges.map(b => `
                                <div class="badge-showcase-item">
                                    <div class="badge-showcase-icon">
                                        ${b.imageUrl ? `<img src="${b.imageUrl}" alt="${sanitize(b.name)}" onerror="this.parentElement.innerHTML='🎖️'">` : '🎖️'}
                                    </div>
                                    <div class="badge-showcase-name">${sanitize(b.name)}</div>
                                    <div class="badge-showcase-week">${sanitize(b.weekEarned) || ''}</div>
                                    ${b.description ? `<div class="badge-showcase-desc">${sanitize(b.description)}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div style="text-align:center;padding:40px;">
                            <div style="font-size:64px;margin-bottom:16px;opacity:0.5;">🎖️</div>
                            <p style="color:var(--text-dim);margin-bottom:8px;">No badges earned yet</p>
                            <p style="font-size:12px;color:var(--purple-light);">Complete missions and help your team win to earn badges!</p>
                        </div>
                    `}
                </div>
            </div>
            
            ${winnersHtml}
            
            <!-- Quick Links -->
            <div class="card">
                <div class="card-header"><h3>🔗 Quick Links</h3></div>
                <div class="card-body">
                    <div class="quick-links-grid">
                        <button onclick="loadPage('profile')" class="quick-link-btn">
                            <span>👤</span>
                            <span>Profile</span>
                        </button>
                        <button onclick="loadPage('rankings')" class="quick-link-btn">
                            <span>🏆</span>
                            <span>Rankings</span>
                        </button>
                        <button onclick="loadPage('goals')" class="quick-link-btn">
                            <span>🎯</span>
                            <span>Goals</span>
                        </button>
                        <button onclick="loadPage('comparison')" class="quick-link-btn">
                            <span>⚔️</span>
                            <span>Battle</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
    } catch (e) {
        console.error('Drawer error:', e);
        container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <p style="color:var(--danger);">Failed to load drawer. <a href="#" onclick="loadPage('drawer')">Retry</a></p>
                </div>
            </div>
        `;
    }
}

// ==================== ANNOUNCEMENTS PAGE ====================
async function renderAnnouncements() {
    const container = $('announcements-content');
    if (!container) return;
    
    container.innerHTML = '<div class="loading-skeleton"></div>';
    
    try {
        const data = await api('getAnnouncements', { week: STATE.week });
        const list = data.announcements || [];
        
        container.innerHTML = list.length ? `
            ${list.map(a => `
                <div class="card announcement-card ${a.priority === 'high' ? 'high-priority' : ''}">
                    <div class="card-body">
                        <div class="announcement-header">
                            <span class="announcement-date">${a.created ? new Date(a.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                            ${a.priority === 'high' ? '<span class="priority-badge">IMPORTANT</span>' : ''}
                        </div>
                        <h3 class="announcement-title">${sanitize(a.title)}</h3>
                        <p class="announcement-message">${sanitize(a.message)}</p>
                        ${a.week !== 'all' ? `<div class="announcement-week">📅 Week: ${sanitize(a.week)}</div>` : ''}
                    </div>
                </div>
            `).join('')}
        ` : `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:60px 20px;">
                    <div style="font-size:64px;margin-bottom:16px;opacity:0.5;">📢</div>
                    <h3 style="margin-bottom:12px;">No Announcements</h3>
                    <p style="color:var(--text-dim);">Check back later for updates from mission control!</p>
                </div>
            </div>
        `;
        
    } catch (e) {
        console.error('Announcements error:', e);
        container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <p style="color:var(--danger);">Failed to load announcements. <a href="#" onclick="loadPage('announcements')">Retry</a></p>
                </div>
            </div>
        `;
    }
}

// ==================== UTILITY FUNCTIONS ====================

// Refresh current page data
async function refreshData() {
    if (STATE.isLoading) return;
    
    loading(true);
    
    try {
        STATE.data = await api('getAgentData', {
            agentNo: STATE.agentNo,
            week: STATE.week
        });
        
        await loadPage(STATE.page);
        updateTime();
        
    } catch (e) {
        console.error('Refresh error:', e);
        alert('Failed to refresh data: ' + e.message);
    }
    
    loading(false);
}

// Export data for debugging
function exportDebugData() {
    const debugData = {
        state: STATE,
        config: CONFIG,
        timestamp: new Date().toISOString()
    };
    
    console.log('📦 Debug Data:', debugData);
    
    const blob = new Blob([JSON.stringify(debugData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spy-battle-debug-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Check for app updates (placeholder)
function checkForUpdates() {
    console.log('🔄 Checking for updates...');
    // Add your update logic here
}

// Handle visibility change (refresh when tab becomes visible)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && STATE.agentNo && !STATE.isLoading) {
        // Auto-refresh after 5 minutes of being hidden
        const lastUpdate = localStorage.getItem('lastUpdate');
        const now = Date.now();
        
        if (!lastUpdate || now - parseInt(lastUpdate) > 300000) {
            refreshData();
            localStorage.setItem('lastUpdate', now.toString());
        }
    }
});

// Handle online/offline
window.addEventListener('online', () => {
    console.log('🌐 Back online');
    if (STATE.agentNo) {
        refreshData();
    }
});

window.addEventListener('offline', () => {
    console.log('📴 Offline');
    // Show offline indicator
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Only when dashboard is active
    if (!STATE.agentNo) return;
    
    // R to refresh
    if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            refreshData();
        }
    }
    
    // Escape to close sidebar
    if (e.key === 'Escape') {
        closeSidebar();
    }
});

// ==================== INITIALIZE APP ====================
document.addEventListener('DOMContentLoaded', initApp);

// Also initialize if DOM is already ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initApp, 0);
}

// Export functions for global access
window.loadPage = loadPage;
window.logout = logout;
window.refreshData = refreshData;
window.shareResults = shareResults;
window.exportDebugData = exportDebugData;

console.log('🎮 BTS Spy Battle App Loaded');
console.log('📌 Version: 2.0.0');
console.log('🔧 Debug: Call exportDebugData() to export debug info');
