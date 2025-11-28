// ===== SPY BATTLE - CLEAN VERSION =====

const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbx5ArHi5Ws0NxMa9nhORy6bZ7ZYpW4urPIap24tax9H1HLuGQxYRCgTVwDaKOMrZ7JOGA/exec',
    TEAMS: {
        'Indigo': { color: '#4cc9f0', pfp: 'https://i.ibb.co/V0124fWL/team-indigoo.png' },
        'Echo': { color: '#f72585', pfp: 'https://i.ibb.co/xwYRSyx/Team-Echo.png' },
        'Agust D': { color: '#ff9500', pfp: 'https://i.ibb.co/BVc11nz9/Team-agustd.png' },
        'JITB': { color: '#7209b7', pfp: 'https://i.ibb.co/FbdLFwhv/Team-jitb.png' }
    }
};

const STATE = {
    agentNo: null,
    week: null,
    weeks: [],
    data: null,
    page: 'home'
};

// ===== HELPERS =====
const $ = id => document.getElementById(id);
const show = el => el && (el.style.display = 'flex');
const hide = el => el && (el.style.display = 'none');

function loading(on) {
    const el = $('loading-overlay');
    if (el) {
        el.classList.toggle('active', on);
    }
}

function teamColor(team) {
    return CONFIG.TEAMS[team]?.color || '#ffd700';
}

function teamPfp(team) {
    return CONFIG.TEAMS[team]?.pfp || '';
}

function fmt(n) {
    return Number(n || 0).toLocaleString();
}

function showResult(msg, isError) {
    const el = $('find-result');
    if (!el) return;
    el.textContent = msg;
    el.className = 'show ' + (isError ? 'error' : 'success');
    el.style.display = 'block';
}

// ===== API =====
async function api(action, params = {}) {
    const url = new URL(CONFIG.API_URL);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([k, v]) => {
        if (v != null) url.searchParams.set(k, v);
    });
    
    console.log('API:', action, params);
    
    const res = await fetch(url);
    const text = await res.text();
    
    console.log('Response:', text.substring(0, 200));
    
    try {
        const data = JSON.parse(text);
        if (data.error) throw new Error(data.error);
        return data;
    } catch (e) {
        console.error('Parse error:', e);
        throw new Error('Invalid response');
    }
}

// ===== LOGIN =====
function initLogin() {
    console.log('Init login');
    
    const saved = localStorage.getItem('spyAgent');
    if (saved) {
        STATE.agentNo = saved;
        loadDashboard();
        return;
    }
    
    $('login-btn')?.addEventListener('click', doLogin);
    $('find-agent-btn')?.addEventListener('click', doFind);
    
    $('agent-input')?.addEventListener('keypress', e => {
        if (e.key === 'Enter') doLogin();
    });
    
    $('instagram-input')?.addEventListener('keypress', e => {
        if (e.key === 'Enter') doFind();
    });
}

async function doLogin() {
    const input = $('agent-input');
    const agentNo = input?.value.trim();
    
    if (!agentNo) {
        showResult('Enter your agent number', true);
        return;
    }
    
    loading(true);
    
    try {
        const res = await api('getAllAgents');
        const agents = res.agents || [];
        
        const found = agents.find(a => String(a.agentNo).trim() === agentNo);
        
        if (!found) {
            loading(false);
            showResult('Agent not found', true);
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

async function doFind() {
    const input = $('instagram-input');
    const insta = input?.value.trim();
    
    if (!insta) {
        showResult('Enter Instagram username', true);
        return;
    }
    
    loading(true);
    
    try {
        const res = await api('getAgentByInstagram', { instagram: insta });
        loading(false);
        
        if (res.result?.includes('Agent Number is:')) {
            const num = res.result.split(':')[1].trim();
            $('agent-input').value = num;
            showResult(res.result, false);
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
    console.log('Loading dashboard for:', STATE.agentNo);
    loading(true);
    
    try {
        // Get weeks
        const weeksRes = await api('getAvailableWeeks');
        STATE.weeks = weeksRes.weeks || [];
        STATE.week = weeksRes.current || STATE.weeks[0];
        
        if (!STATE.week) throw new Error('No weeks');
        
        // Get agent data
        STATE.data = await api('getAgentData', {
            agentNo: STATE.agentNo,
            week: STATE.week
        });
        
        // Switch screens
        $('login-screen').classList.remove('active');
        hide($('login-screen'));
        
        $('dashboard-screen').classList.add('active');
        show($('dashboard-screen'));
        
        // Setup
        setupDashboard();
        await showPage('home');
        
        loading(false);
        
    } catch (e) {
        console.error('Dashboard error:', e);
        loading(false);
        alert('Failed to load: ' + e.message);
        logout();
    }
}

function setupDashboard() {
    // Agent info
    const p = STATE.data?.profile;
    if (p) {
        const color = teamColor(p.team);
        const pfp = teamPfp(p.team);
        
        // Sidebar
        const avatar = $('agent-avatar');
        if (avatar) {
            if (pfp) {
                avatar.innerHTML = `<img src="${pfp}" alt="${p.team}">`;
            } else {
                avatar.textContent = (p.name || 'A')[0];
                avatar.style.background = color;
            }
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
            if (pfp) {
                pAvatar.innerHTML = `<img src="${pfp}" alt="${p.team}">`;
            } else {
                pAvatar.textContent = (p.name || 'A')[0];
                pAvatar.style.background = color;
            }
        }
        
        if ($('profile-name')) $('profile-name').textContent = p.name || 'Agent';
        if ($('profile-team')) {
            $('profile-team').textContent = p.team || 'Team';
            $('profile-team').style.color = color;
        }
        if ($('profile-id')) $('profile-id').textContent = 'ID: ' + STATE.agentNo;
    }
    
    // Week selector
    const select = $('week-select');
    if (select) {
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
                await showPage(STATE.page);
            } catch (e) {
                alert('Failed to load week');
            }
            loading(false);
        };
    }
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(link => {
        link.onclick = e => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) {
                document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                showPage(page);
                closeSidebar();
            }
        };
    });
    
    // Mobile menu
    $('mobile-menu-btn')?.addEventListener('click', () => {
        $('sidebar')?.classList.add('open');
    });
    
    $('sidebar-close')?.addEventListener('click', closeSidebar);
    
    // Logout
    $('logout-btn')?.addEventListener('click', logout);
}

function closeSidebar() {
    $('sidebar')?.classList.remove('open');
}

function logout() {
    localStorage.removeItem('spyAgent');
    location.reload();
}

// ===== PAGES =====
async function showPage(page) {
    STATE.page = page;
    
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });
    
    const el = $('page-' + page);
    if (el) {
        el.classList.add('active');
        el.style.display = 'block';
    }
    
    loading(true);
    
    try {
        switch(page) {
            case 'home': await loadHome(); break;
            case 'profile': await loadProfile(); break;
            case 'rankings': await loadRankings(); break;
            case 'goals': await loadGoals(); break;
            case 'album2x': await loadAlbum2x(); break;
            case 'team-level': await loadTeamLevel(); break;
            case 'summary': await loadSummary(); break;
        }
    } catch (e) {
        console.error('Page error:', e);
    }
    
    loading(false);
}

async function loadHome() {
    $('current-week-display').textContent = 'Week: ' + STATE.week;
    
    const [summary, rankings] = await Promise.all([
        api('getWeeklySummary', { week: STATE.week }),
        api('getRankings', { week: STATE.week, limit: 5 })
    ]);
    
    const team = STATE.data?.profile?.team;
    const teamData = summary.teams?.[team] || {};
    
    // Status
    $('home-track-status').innerHTML = teamData.trackGoalPassed 
        ? '<span class="status-complete">✅ Complete</span>' 
        : '<span class="status-pending">⏳ In Progress</span>';
    
    $('home-album-status').innerHTML = teamData.albumGoalPassed 
        ? '<span class="status-complete">✅ Complete</span>' 
        : '<span class="status-pending">⏳ In Progress</span>';
    
    $('home-2x-status').innerHTML = teamData.album2xPassed 
        ? '<span class="status-complete">✅ Complete</span>' 
        : '<span class="status-pending">⏳ In Progress</span>';
    
    // Top performers
    const list = rankings.rankings || [];
    $('home-top-performers').innerHTML = list.map((r, i) => `
        <div class="rank-item">
            <div class="rank-num">#${i + 1}</div>
            <div class="rank-info">
                <div class="rank-name">${r.name}</div>
                <div class="rank-team" style="color:${teamColor(r.team)}">${r.team}</div>
            </div>
            <div class="rank-xp">${fmt(r.totalXP)} XP</div>
        </div>
    `).join('') || 'No data';
    
    // Team standings
    const teams = Object.entries(summary.teams || {});
    $('home-team-standings').innerHTML = `
        <div class="stats-grid">
            ${teams.map(([t, d]) => `
                <div class="stat-box" style="border-left: 3px solid ${teamColor(t)}">
                    <div style="color:${teamColor(t)};font-weight:600;margin-bottom:8px;">${t}</div>
                    <div class="stat-value">${fmt(d.teamXP)}</div>
                    <div class="stat-label">Level ${d.level || 0}</div>
                </div>
            `).join('')}
        </div>
    `;
}

async function loadProfile() {
    const s = STATE.data?.stats;
    if (!s) return;
    
    $('profile-stats').innerHTML = `
        <div class="stat-box">
            <div class="stat-value">${fmt(s.totalXP)}</div>
            <div class="stat-label">Total XP</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">#${s.rank || 'N/A'}</div>
            <div class="stat-label">Rank</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${fmt(s.totalStreams)}</div>
            <div class="stat-label">Streams</div>
        </div>
    `;
    
    // Tracks
    $('profile-tracks').innerHTML = Object.entries(s.tracks || {}).map(([t, c]) => `
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
            <span>${t}</span><span>${fmt(c)}</span>
        </div>
    `).join('') || 'No data';
    
    // Albums
    $('profile-albums').innerHTML = Object.entries(s.albums || {}).map(([a, c]) => `
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
            <span>${a}</span><span>${fmt(c)}</span>
        </div>
    `).join('') || 'No data';
}

async function loadRankings() {
    const data = await api('getRankings', { week: STATE.week, limit: 100 });
    const list = data.rankings || [];
    
    $('rankings-list').innerHTML = list.map((r, i) => {
        const isMe = String(r.agentNo) === String(STATE.agentNo);
        return `
            <div class="rank-item ${isMe ? 'highlight' : ''}">
                <div class="rank-num">#${i + 1}</div>
                <div class="rank-info">
                    <div class="rank-name">${r.name}${isMe ? ' (You)' : ''}</div>
                    <div class="rank-team" style="color:${teamColor(r.team)}">${r.team}</div>
                </div>
                <div class="rank-xp">${fmt(r.totalXP)} XP</div>
            </div>
        `;
    }).join('') || 'No rankings';
}

async function loadGoals() {
    const data = await api('getGoalsProgress', { week: STATE.week });
    const team = STATE.data?.profile?.team;
    
    let html = '<h3 style="margin-bottom:16px">🎵 Track Goals</h3>';
    
    Object.entries(data.trackGoals || {}).forEach(([track, info]) => {
        const t = info.teams?.[team] || { current: 0 };
        const pct = Math.min(100, (t.current / info.goal) * 100);
        const done = t.current >= info.goal;
        
        html += `
            <div style="margin-bottom:16px">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                    <span>${track}</span>
                    <span style="color:${done ? 'var(--success)' : 'inherit'}">${fmt(t.current)}/${fmt(info.goal)} ${done ? '✅' : ''}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width:${pct}%;background:${done ? 'var(--success)' : 'var(--primary)'}"></div>
                </div>
            </div>
        `;
    });
    
    html += '<h3 style="margin:24px 0 16px">💿 Album Goals</h3>';
    
    Object.entries(data.albumGoals || {}).forEach(([album, info]) => {
        const t = info.teams?.[team] || { current: 0 };
        const pct = Math.min(100, (t.current / info.goal) * 100);
        const done = t.current >= info.goal;
        
        html += `
            <div style="margin-bottom:16px">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                    <span>${album}</span>
                    <span style="color:${done ? 'var(--success)' : 'inherit'}">${fmt(t.current)}/${fmt(info.goal)} ${done ? '✅' : ''}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width:${pct}%;background:${done ? 'var(--success)' : 'var(--primary)'}"></div>
                </div>
            </div>
        `;
    });
    
    $('goals-content').innerHTML = html;
}

async function loadAlbum2x() {
    try {
        const data = await api('getAlbum2xProgress', { week: STATE.week });
        const s = STATE.data?.stats;
        const tracks = data.tracks || [];
        
        let done = 0;
        let html = '';
        
        tracks.forEach(t => {
            const count = s?.album2x?.[t.name] || 0;
            const passed = count >= 2;
            if (passed) done++;
            
            html += `
                <div style="display:flex;justify-content:space-between;padding:12px;background:var(--bg);border-radius:8px;margin-bottom:8px;border-left:3px solid ${passed ? 'var(--success)' : 'var(--danger)'}">
                    <span>${t.name}</span>
                    <span style="color:${passed ? 'var(--success)' : 'var(--danger)'}">${count}/2 ${passed ? '✅' : '❌'}</span>
                </div>
            `;
        });
        
        $('album2x-content').innerHTML = `
            <div style="text-align:center;padding:24px;background:var(--bg);border-radius:12px;margin-bottom:16px">
                <div style="font-size:36px;margin-bottom:8px">${done === tracks.length ? '🎉' : '⏳'}</div>
                <div style="font-size:20px;font-weight:700;color:${done === tracks.length ? 'var(--success)' : 'var(--primary)'}">${done}/${tracks.length} Complete</div>
            </div>
            ${html}
        `;
    } catch (e) {
        $('album2x-content').innerHTML = 'Failed to load';
    }
}

async function loadTeamLevel() {
    try {
        const data = await api('getTeamLevels', { week: STATE.week });
        const teams = data.teams || {};
        
        $('team-level-content').innerHTML = `
            <div class="stats-grid">
                ${Object.entries(teams).map(([t, info]) => `
                    <div class="stat-box" style="border-top:3px solid ${teamColor(t)}">
                        <div style="color:${teamColor(t)};font-weight:600;margin-bottom:12px">${t}</div>
                        <div class="stat-value">Lv ${info.level || 0}</div>
                        <div class="stat-label">${fmt(info.xp)} XP</div>
                        <div class="progress-bar" style="margin-top:12px">
                            <div class="progress-fill" style="width:${info.progress || 0}%;background:${teamColor(t)}"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (e) {
        $('team-level-content').innerHTML = 'Failed to load';
    }
}

async function loadSummary() {
    try {
        const data = await api('getWeeklySummary', { week: STATE.week });
        const teams = data.teams || {};
        const winner = Object.entries(teams).find(([_, t]) => t.isWinner);
        
        $('summary-content').innerHTML = `
            ${winner ? `
                <div style="text-align:center;padding:32px;background:${teamColor(winner[0])}22;border-radius:12px;margin-bottom:24px;border:2px solid ${teamColor(winner[0])}">
                    <div style="font-size:48px">🏆</div>
                    <h2 style="color:${teamColor(winner[0])};margin:16px 0">${winner[0]} Wins!</h2>
                    <p>${fmt(winner[1].teamXP)} XP</p>
                </div>
            ` : ''}
            <div class="stats-grid">
                ${Object.entries(teams).map(([t, info]) => `
                    <div class="stat-box" style="border-left:3px solid ${teamColor(t)}">
                        <div style="color:${teamColor(t)};font-weight:600">${t}</div>
                        <div class="stat-value">${fmt(info.teamXP)}</div>
                        <div class="stat-label">Total XP</div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (e) {
        $('summary-content').innerHTML = 'Failed to load';
    }
}

// ===== START =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('App starting...');
    initLogin();
});
