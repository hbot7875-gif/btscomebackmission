// ===== BTS SPY BATTLE - PURPLE CYBER THEME =====

const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbx5ArHi5Ws0NxMa9nhORy6bZ7ZYpW4urPIap24tax9H1HLuGQxYRCgTVwDaKOMrZ7JOGA/exec',
    TEAMS: {
        'Indigo': { color: '#4cc9f0', album: 'Indigo' },
        'Echo': { color: '#f72585', album: 'Echo' },
        'Agust D': { color: '#ff9500', album: 'D-Day' },
        'JITB': { color: '#7209b7', album: 'Jack In The Box' }
    }
};

const STATE = {
    agentNo: null,
    week: null,
    weeks: [],
    data: null,
    page: 'home',
    charts: {}
};

// ===== HELPERS =====
const $ = id => document.getElementById(id);
const teamColor = team => CONFIG.TEAMS[team]?.color || '#7b2cbf';

function loading(show) {
    const el = $('loading');
    if (el) {
        el.classList.toggle('active', show);
    }
}

function fmt(n) {
    return Number(n || 0).toLocaleString();
}

function showResult(msg, isError) {
    const el = $('find-result');
    if (!el) return;
    el.textContent = msg;
    el.className = `result-box show ${isError ? 'error' : 'success'}`;
}

function updateTime() {
    const el = $('last-update');
    if (el) {
        el.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
}

// ===== API =====
async function api(action, params = {}) {
    const url = new URL(CONFIG.API_URL);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([k, v]) => {
        if (v != null) url.searchParams.set(k, v);
    });
    
    console.log('📡 API:', action);
    
    try {
        const res = await fetch(url);
        const text = await res.text();
        const data = JSON.parse(text);
        
        console.log('✅ Response:', action, data);
        
        if (data.error) throw new Error(data.error);
        return data;
    } catch (e) {
        console.error('❌ API Error:', e);
        throw e;
    }
}

// ===== LOGIN =====
function initApp() {
    console.log('🚀 Starting app...');
    
    const saved = localStorage.getItem('spyAgent');
    if (saved) {
        STATE.agentNo = saved;
        loadDashboard();
        return;
    }
    
    // Login handlers
    $('login-btn')?.addEventListener('click', handleLogin);
    $('find-btn')?.addEventListener('click', handleFind);
    
    $('agent-input')?.addEventListener('keypress', e => {
        if (e.key === 'Enter') handleLogin();
    });
    
    $('instagram-input')?.addEventListener('keypress', e => {
        if (e.key === 'Enter') handleFind();
    });
}

async function handleLogin() {
    const agentNo = $('agent-input')?.value.trim();
    
    if (!agentNo) {
        showResult('Please enter your Agent Number', true);
        return;
    }
    
    loading(true);
    
    try {
        const res = await api('getAllAgents');
        const agents = res.agents || [];
        const found = agents.find(a => String(a.agentNo).trim() === agentNo);
        
        if (!found) {
            loading(false);
            showResult('Agent not found. Check your number.', true);
            return;
        }
        
        localStorage.setItem('spyAgent', agentNo);
        STATE.agentNo = agentNo;
        await loadDashboard();
        
    } catch (e) {
        loading(false);
        showResult('Login failed: ' + e.message, true);
    }
}

async function handleFind() {
    const insta = $('instagram-input')?.value.trim();
    
    if (!insta) {
        showResult('Please enter Instagram username', true);
        return;
    }
    
    loading(true);
    
    try {
        const res = await api('getAgentByInstagram', { instagram: insta });
        loading(false);
        
        if (res.result?.includes('Agent Number is:')) {
            const num = res.result.split(':')[1].trim();
            $('agent-input').value = num;
            showResult('Found! Your Agent Number: ' + num, false);
        } else {
            showResult(res.result || 'Not found', true);
        }
    } catch (e) {
        loading(false);
        showResult('Search failed', true);
    }
}

// ===== DASHBOARD =====
async function loadDashboard() {
    console.log('🏠 Loading dashboard...');
    loading(true);
    
    try {
        // Get weeks
        const weeksRes = await api('getAvailableWeeks');
        STATE.weeks = weeksRes.weeks || [];
        STATE.week = weeksRes.current || STATE.weeks[0];
        
        if (!STATE.week) throw new Error('No weeks available');
        
        // Get agent data
        STATE.data = await api('getAgentData', {
            agentNo: STATE.agentNo,
            week: STATE.week
        });
        
        // Switch screens
        $('login-screen').classList.remove('active');
        $('login-screen').style.display = 'none';
        $('dashboard-screen').classList.add('active');
        $('dashboard-screen').style.display = 'flex';
        
        setupDashboard();
        await loadPage('home');
        loading(false);
        
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
        const initial = (p.name || 'A')[0].toUpperCase();
        
        // Sidebar
        const avatar = $('agent-avatar');
        if (avatar) {
            avatar.textContent = initial;
            avatar.style.background = color;
        }
        
        if ($('agent-name')) $('agent-name').textContent = p.name || 'Agent';
        if ($('agent-team')) {
            $('agent-team').textContent = p.team || 'Team';
            $('agent-team').style.color = color;
        }
        if ($('agent-id')) $('agent-id').textContent = 'ID: ' + STATE.agentNo;
        
        // Profile page
        const pAvatar = $('profile-avatar');
        if (pAvatar) {
            pAvatar.textContent = initial;
            pAvatar.style.background = color;
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
    
    // Mobile
    $('menu-btn')?.addEventListener('click', () => $('sidebar')?.classList.add('open'));
    $('close-sidebar')?.addEventListener('click', closeSidebar);
    $('logout-btn')?.addEventListener('click', logout);
    
    updateTime();
    setInterval(updateTime, 60000);
}

function closeSidebar() {
    $('sidebar')?.classList.remove('open');
}

function logout() {
    localStorage.removeItem('spyAgent');
    location.reload();
}

// ===== PAGE ROUTER =====
async function loadPage(page) {
    console.log('📄 Loading:', page);
    STATE.page = page;
    
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
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
        }
    } catch (e) {
        console.error('Page error:', e);
    }
    
    loading(false);
}

// ===== HOME PAGE =====
async function renderHome() {
    $('current-week').textContent = 'Week: ' + STATE.week;
    
    try {
        const [summary, rankings] = await Promise.all([
            api('getWeeklySummary', { week: STATE.week }),
            api('getRankings', { week: STATE.week, limit: 5 })
        ]);
        
        const team = STATE.data?.profile?.team;
        const teamData = summary.teams?.[team] || summary[team] || {};
        
        // Mission status
        setStatus('home-track-status', teamData.trackGoalPassed);
        setStatus('home-album-status', teamData.albumGoalPassed);
        setStatus('home-2x-status', teamData.album2xPassed);
        
        // Top agents
        const list = rankings.rankings || rankings || [];
        $('home-top-agents').innerHTML = list.slice(0, 5).map((r, i) => `
            <div class="rank-item">
                <div class="rank-num">${i + 1}</div>
                <div class="rank-info">
                    <div class="rank-name">${r.name || r.agentName || 'Agent'}</div>
                    <div class="rank-team" style="color:${teamColor(r.team)}">${r.team || 'Team'}</div>
                </div>
                <div class="rank-xp">${fmt(r.totalXP || r.xp || 0)} XP</div>
            </div>
        `).join('') || '<p>No data</p>';
        
        // Team standings
        const teams = summary.teams || summary;
        const teamNames = ['Indigo', 'Echo', 'Agust D', 'JITB'];
        
        $('home-standings').innerHTML = `
            <div class="stats-grid">
                ${teamNames.filter(t => teams[t]).map(t => `
                    <div class="stat-box" style="border-top: 3px solid ${teamColor(t)}">
                        <div style="color:${teamColor(t)};font-weight:600;margin-bottom:8px;">${t}</div>
                        <div class="stat-value">${fmt(teams[t].teamXP || teams[t].xp || 0)}</div>
                        <div class="stat-label">Level ${teams[t].level || 0}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
    } catch (e) {
        console.error('Home error:', e);
    }
}

function setStatus(id, passed) {
    const el = $(id);
    if (!el) return;
    el.textContent = passed ? '✅ Complete' : '⏳ In Progress';
    el.className = 'mission-status ' + (passed ? 'complete' : 'pending');
}

// ===== PROFILE PAGE =====
async function renderProfile() {
    const s = STATE.data?.stats || {};
    
    $('profile-stats').innerHTML = `
        <div class="stat-box">
            <div class="stat-value">${fmt(s.totalXP || 0)}</div>
            <div class="stat-label">Total XP</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">#${s.rank || 'N/A'}</div>
            <div class="stat-label">Global Rank</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${fmt(s.totalStreams || 0)}</div>
            <div class="stat-label">Total Streams</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${s.level || 1}</div>
            <div class="stat-label">Level</div>
        </div>
    `;
    
    // Tracks
    const tracks = s.tracks || s.trackStreams || {};
    $('profile-tracks').innerHTML = Object.keys(tracks).length ? 
        Object.entries(tracks).map(([t, c]) => `
            <div style="display:flex;justify-content:space-between;padding:12px;background:var(--bg-dark);border-radius:8px;margin-bottom:8px;">
                <span>${t}</span>
                <span style="font-weight:600;color:var(--purple-glow);">${fmt(c)}</span>
            </div>
        `).join('') : '<p style="color:var(--text-dim)">No track data yet</p>';
    
    // Albums
    const albums = s.albums || s.albumStreams || {};
    $('profile-albums').innerHTML = Object.keys(albums).length ?
        Object.entries(albums).map(([a, c]) => `
            <div style="display:flex;justify-content:space-between;padding:12px;background:var(--bg-dark);border-radius:8px;margin-bottom:8px;">
                <span>${a}</span>
                <span style="font-weight:600;color:var(--purple-glow);">${fmt(c)}</span>
            </div>
        `).join('') : '<p style="color:var(--text-dim)">No album data yet</p>';
}

// ===== RANKINGS PAGE =====
async function renderRankings() {
    try {
        const data = await api('getRankings', { week: STATE.week, limit: 100 });
        const list = data.rankings || data || [];
        
        $('rankings-list').innerHTML = list.length ? list.map((r, i) => {
            const isMe = String(r.agentNo) === String(STATE.agentNo);
            return `
                <div class="rank-item ${isMe ? 'highlight' : ''}">
                    <div class="rank-num">${i + 1}</div>
                    <div class="rank-info">
                        <div class="rank-name">${r.name || r.agentName}${isMe ? ' (You)' : ''}</div>
                        <div class="rank-team" style="color:${teamColor(r.team)}">${r.team}</div>
                    </div>
                    <div class="rank-xp">${fmt(r.totalXP || r.xp)} XP</div>
                </div>
            `;
        }).join('') : '<p>No rankings available</p>';
        
    } catch (e) {
        $('rankings-list').innerHTML = '<p>Failed to load rankings</p>';
    }
}

// ===== GOALS PAGE =====
async function renderGoals() {
    try {
        const data = await api('getGoalsProgress', { week: STATE.week });
        const team = STATE.data?.profile?.team;
        
        let html = '';
        
        // Track goals
        const trackGoals = data.trackGoals || data.tracks || {};
        if (Object.keys(trackGoals).length) {
            html += '<div class="card"><div class="card-header"><h3>🎵 Track Goals</h3></div><div class="card-body">';
            
            for (const [track, info] of Object.entries(trackGoals)) {
                const current = info.teams?.[team]?.current || info[team]?.current || info.current || 0;
                const goal = info.goal || info.target || 100;
                const pct = Math.min(100, (current / goal) * 100);
                const done = current >= goal;
                
                html += `
                    <div style="margin-bottom:16px;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                            <span>${track}</span>
                            <span style="color:${done ? 'var(--success)' : 'var(--text-dim)'}">${fmt(current)}/${fmt(goal)} ${done ? '✅' : ''}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${pct}%;${done ? 'background:var(--success);' : ''}"></div>
                        </div>
                    </div>
                `;
            }
            html += '</div></div>';
        }
        
        // Album goals
        const albumGoals = data.albumGoals || data.albums || {};
        if (Object.keys(albumGoals).length) {
            html += '<div class="card"><div class="card-header"><h3>💿 Album Goals</h3></div><div class="card-body">';
            
            for (const [album, info] of Object.entries(albumGoals)) {
                const current = info.teams?.[team]?.current || info[team]?.current || info.current || 0;
                const goal = info.goal || info.target || 100;
                const pct = Math.min(100, (current / goal) * 100);
                const done = current >= goal;
                
                html += `
                    <div style="margin-bottom:16px;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                            <span>${album}</span>
                            <span style="color:${done ? 'var(--success)' : 'var(--text-dim)'}">${fmt(current)}/${fmt(goal)} ${done ? '✅' : ''}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${pct}%;${done ? 'background:var(--success);' : ''}"></div>
                        </div>
                    </div>
                `;
            }
            html += '</div></div>';
        }
        
        $('goals-content').innerHTML = html || '<p>No goals data available</p>';
        
    } catch (e) {
        $('goals-content').innerHTML = '<p>Failed to load goals</p>';
    }
}

// ===== ALBUM 2X PAGE =====
async function renderAlbum2x() {
    const container = $('album2x-content');
    
    try {
        const data = await api('getAlbum2xProgress', { week: STATE.week });
        const s = STATE.data?.stats || {};
        const tracks = data.tracks || data.albums || [];
        
        if (!tracks.length) {
            container.innerHTML = '<div class="card"><div class="card-body"><p>No 2x data available</p></div></div>';
            return;
        }
        
        let done = 0;
        let html = '';
        
        tracks.forEach(t => {
            const name = t.name || t.track || t;
            const count = s.album2x?.[name] || s.trackStreams?.[name] || 0;
            const passed = count >= 2;
            if (passed) done++;
            
            html += `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:14px;background:var(--bg-dark);border-radius:10px;margin-bottom:10px;border-left:3px solid ${passed ? 'var(--success)' : 'var(--danger)'}">
                    <span>${name}</span>
                    <span style="color:${passed ? 'var(--success)' : 'var(--danger)'}">
                        ${count}/2 ${passed ? '✅' : '❌'}
                    </span>
                </div>
            `;
        });
        
        container.innerHTML = `
            <div class="card">
                <div class="card-body" style="text-align:center;">
                    <div style="font-size:48px;margin-bottom:12px;">${done === tracks.length ? '🎉' : '⏳'}</div>
                    <div style="font-size:28px;font-weight:700;color:${done === tracks.length ? 'var(--success)' : 'var(--purple-glow)'}">
                        ${done}/${tracks.length} Complete
                    </div>
                    <p style="color:var(--text-dim);margin-top:8px;">
                        ${done === tracks.length ? 'Mission Complete!' : 'Keep streaming!'}
                    </p>
                </div>
            </div>
            <div class="card">
                <div class="card-body">${html}</div>
            </div>
        `;
        
    } catch (e) {
        container.innerHTML = '<div class="card"><div class="card-body"><p>Failed to load 2x data</p></div></div>';
    }
}

// ===== TEAM LEVEL PAGE =====
async function renderTeamLevel() {
    try {
        const data = await api('getTeamLevels', { week: STATE.week });
        const teams = data.teams || data;
        const teamNames = ['Indigo', 'Echo', 'Agust D', 'JITB'];
        
        $('team-level-content').innerHTML = `
            <div class="stats-grid">
                ${teamNames.filter(t => teams[t]).map(t => {
                    const info = teams[t];
                    return `
                        <div class="card" style="border-top:3px solid ${teamColor(t)}">
                            <div class="card-body" style="text-align:center;">
                                <div style="color:${teamColor(t)};font-weight:600;font-size:18px;margin-bottom:12px;">${t}</div>
                                <div style="font-size:48px;font-weight:700;margin-bottom:8px;">Lv ${info.level || 0}</div>
                                <div style="color:var(--text-dim);">${fmt(info.xp || info.teamXP || 0)} XP</div>
                                <div class="progress-bar" style="margin-top:16px;">
                                    <div class="progress-fill" style="width:${info.progress || 0}%;background:${teamColor(t)};"></div>
                                </div>
                                <div style="font-size:11px;margin-top:8px;color:var(--text-dim);">${info.progress || 0}% to next</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
    } catch (e) {
        $('team-level-content').innerHTML = '<p>Failed to load team levels</p>';
    }
}

// ===== TEAM CHARTS =====
async function renderTeamCharts() {
    try {
        const data = await api('getWeeklySummary', { week: STATE.week });
        const teams = data.teams || data;
        const teamNames = ['Indigo', 'Echo', 'Agust D', 'JITB'];
        const filtered = teamNames.filter(t => teams[t]);
        
        // Team XP Chart
        if (STATE.charts.teamXP) STATE.charts.teamXP.destroy();
        const ctx1 = $('chart-team-xp')?.getContext('2d');
        if (ctx1) {
            STATE.charts.teamXP = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: filtered,
                    datasets: [{
                        label: 'Team XP',
                        data: filtered.map(t => teams[t].teamXP || teams[t].xp || 0),
                        backgroundColor: filtered.map(t => teamColor(t)),
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, ticks: { color: '#888' }, grid: { color: '#2a2a4a' } },
                        x: { ticks: { color: '#888' }, grid: { display: false } }
                    }
                }
            });
        }
        
        // Team Levels Chart
        if (STATE.charts.teamLevels) STATE.charts.teamLevels.destroy();
        const ctx2 = $('chart-team-levels')?.getContext('2d');
        if (ctx2) {
            STATE.charts.teamLevels = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: filtered,
                    datasets: [{
                        data: filtered.map(t => teams[t].level || 0),
                        backgroundColor: filtered.map(t => teamColor(t))
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#e0e0f0' } }
                    }
                }
            });
        }
        
    } catch (e) {
        console.error('Charts error:', e);
    }
}

// ===== AGENT CHARTS =====
async function renderAgentCharts() {
    const s = STATE.data?.stats || {};
    const tracks = s.tracks || s.trackStreams || {};
    const albums = s.albums || s.albumStreams || {};
    
    // Track chart
    if (STATE.charts.agentTracks) STATE.charts.agentTracks.destroy();
    const ctx1 = $('chart-agent-tracks')?.getContext('2d');
    if (ctx1 && Object.keys(tracks).length) {
        STATE.charts.agentTracks = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: Object.keys(tracks),
                datasets: [{
                    label: 'Streams',
                    data: Object.values(tracks),
                    backgroundColor: '#7b2cbf',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: {
                    x: { beginAtZero: true, ticks: { color: '#888' }, grid: { color: '#2a2a4a' } },
                    y: { ticks: { color: '#888' }, grid: { display: false } }
                }
            }
        });
    }
    
    // Album chart
    if (STATE.charts.agentAlbums) STATE.charts.agentAlbums.destroy();
    const ctx2 = $('chart-agent-albums')?.getContext('2d');
    if (ctx2 && Object.keys(albums).length) {
        STATE.charts.agentAlbums = new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: Object.keys(albums),
                datasets: [{
                    data: Object.values(albums),
                    backgroundColor: ['#7b2cbf', '#9d4edd', '#c77dff', '#4cc9f0', '#f72585']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#e0e0f0' } }
                }
            }
        });
    }
}

// ===== COMPARISON PAGE =====
async function renderComparison() {
    try {
        const data = await api('getTeamComparison', { week: STATE.week });
        const teams = data.teams || data;
        const teamNames = ['Indigo', 'Echo', 'Agust D', 'JITB'];
        
        $('comparison-content').innerHTML = `
            <div class="card">
                <div class="card-body">
                    <table style="width:100%;border-collapse:collapse;">
                        <thead>
                            <tr style="border-bottom:1px solid var(--border);">
                                <th style="padding:12px;text-align:left;">Team</th>
                                <th style="padding:12px;text-align:right;">XP</th>
                                <th style="padding:12px;text-align:right;">Level</th>
                                <th style="padding:12px;text-align:right;">Members</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${teamNames.filter(t => teams[t]).map(t => `
                                <tr style="border-bottom:1px solid var(--border);">
                                    <td style="padding:12px;color:${teamColor(t)};font-weight:600;">${t}</td>
                                    <td style="padding:12px;text-align:right;">${fmt(teams[t].totalXP || teams[t].teamXP || 0)}</td>
                                    <td style="padding:12px;text-align:right;">${teams[t].level || 0}</td>
                                    <td style="padding:12px;text-align:right;">${teams[t].members || 0}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
    } catch (e) {
        $('comparison-content').innerHTML = '<p>Failed to load comparison</p>';
    }
}

// ===== SUMMARY PAGE =====
async function renderSummary() {
    // Check if it's Sunday
    const now = new Date();
    const day = now.getDay();
    
    if (day !== 0) {
        $('summary-content').innerHTML = `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:60px 20px;">
                    <div style="font-size:64px;margin-bottom:20px;">🔒</div>
                    <h2 style="margin-bottom:12px;">Summary Locked</h2>
                    <p style="color:var(--text-dim);">Weekly summary will be available on Sunday at midnight.</p>
                    <p style="color:var(--text-dim);margin-top:8px;">Battle ends Saturday 11:55 PM</p>
                </div>
            </div>
        `;
        return;
    }
    
    try {
        const data = await api('getWeeklySummary', { week: STATE.week });
        const teams = data.teams || data;
        const teamNames = ['Indigo', 'Echo', 'Agust D', 'JITB'];
        const winner = Object.entries(teams).find(([t, d]) => d.isWinner);
        
        $('summary-content').innerHTML = `
            ${winner ? `
                <div class="card" style="background:linear-gradient(135deg, ${teamColor(winner[0])}22, var(--bg-card));border:2px solid ${teamColor(winner[0])};">
                    <div class="card-body" style="text-align:center;padding:40px;">
                        <div style="font-size:72px;margin-bottom:16px;">🏆</div>
                        <h2 style="color:${teamColor(winner[0])};font-size:28px;margin-bottom:12px;">${winner[0]} WINS!</h2>
                        <p style="font-size:24px;">${fmt(winner[1].teamXP || winner[1].xp)} XP</p>
                    </div>
                </div>
            ` : ''}
            
            <div class="stats-grid">
                ${teamNames.filter(t => teams[t]).map(t => `
                    <div class="stat-box" style="border-top:3px solid ${teamColor(t)}">
                        <div style="color:${teamColor(t)};font-weight:600;margin-bottom:8px;">${t}</div>
                        <div class="stat-value">${fmt(teams[t].teamXP || teams[t].xp || 0)}</div>
                        <div class="stat-label">Total XP</div>
                    </div>
                `).join('')}
            </div>
        `;
        
    } catch (e) {
        $('summary-content').innerHTML = '<p>Failed to load summary</p>';
    }
}

// ===== DRAWER PAGE =====
async function renderDrawer() {
    try {
        const data = await api('getDrawerData', { agentNo: STATE.agentNo });
        const badges = data.badges || [];
        const wins = data.wins || [];
        
        $('drawer-content').innerHTML = `
            <div class="card">
                <div class="card-header"><h3>🎖️ Badges</h3></div>
                <div class="card-body">
                    ${badges.length ? `
                        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:16px;">
                            ${badges.map(b => `
                                <div style="text-align:center;">
                                    <div style="width:60px;height:60px;border-radius:50%;background:var(--purple-main);margin:0 auto 8px;display:flex;align-items:center;justify-content:center;font-size:28px;">
                                        ${b.icon || '🎖️'}
                                    </div>
                                    <div style="font-size:11px;color:var(--text-dim);">${b.name || 'Badge'}</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<p style="color:var(--text-dim)">No badges earned yet. Keep streaming!</p>'}
                </div>
            </div>
            
            <div class="card">
                <div class="card-header"><h3>🏆 Win History</h3></div>
                <div class="card-body">
                    ${wins.length ? wins.map(w => `
                        <div style="padding:12px;background:var(--bg-dark);border-radius:8px;margin-bottom:8px;">
                            <div style="font-weight:600;">${w.week || 'Week'}</div>
                            <div style="font-size:12px;color:var(--text-dim);">${w.achievement || 'Winner'}</div>
                        </div>
                    `).join('') : '<p style="color:var(--text-dim)">No wins yet. Keep going!</p>'}
                </div>
            </div>
        `;
        
    } catch (e) {
        $('drawer-content').innerHTML = `
            <div class="card">
                <div class="card-body"><p style="color:var(--text-dim)">Your badges and achievements will appear here.</p></div>
            </div>
        `;
    }
}

// ===== ANNOUNCEMENTS PAGE =====
async function renderAnnouncements() {
    try {
        const data = await api('getAnnouncements');
        const list = data.announcements || [];
        
        $('announcements-content').innerHTML = list.length ? list.map(a => `
            <div class="card">
                <div class="card-body">
                    <div style="font-size:11px;color:var(--purple-light);margin-bottom:8px;">${a.date || ''}</div>
                    <h3 style="margin-bottom:12px;">${a.title || 'Announcement'}</h3>
                    <p style="color:var(--text-dim);line-height:1.6;">${a.content || ''}</p>
                </div>
            </div>
        `).join('') : `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:60px 20px;">
                    <div style="font-size:48px;margin-bottom:16px;">📢</div>
                    <p style="color:var(--text-dim);">No announcements at this time.</p>
                </div>
            </div>
        `;
        
    } catch (e) {
        $('announcements-content').innerHTML = '<p>Failed to load announcements</p>';
    }
}

// ===== START =====
document.addEventListener('DOMContentLoaded', initApp);
