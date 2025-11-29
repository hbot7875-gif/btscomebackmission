// ===== BTS SPY BATTLE - OPTIMIZED APP.JS =====

const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbx5ArHi5Ws0NxMa9nhORy6bZ7ZYpW4urPIap24tax9H1HLuGQxYRCgTVwDaKOMrZ7JOGA/exec',
    CACHE_DURATION: 60000 * 5, // 5 Minutes Caching
    
    TEAMS: {
        'Indigo': { color: '#4cc9f0', album: 'Indigo' },
        'Echo': { color: '#f72585', album: 'Echo' },
        'Agust D': { color: '#ff9500', album: 'Agust D' },
        'JITB': { color: '#7209b7', album: 'Jack In The Box' }
    },
    
    // Keep your existing track lists here...
    TEAM_ALBUM_TRACKS: {
        "Indigo": ["Yun (with Erykah Badu)", "Still Life (with Anderson .Paak)", "All Day (with Tablo)", "Forg_tful (with Kim Sawol)", "Closer (with Paul Blanco, Mahalia)", "Change pt.2", "Lonely", "Hectic (with Colde)", "Wild Flower (with youjeen)", "No.2 (with parkjiyoon)"],
        "Echo": ["Don't Say You Love Me", "Nothing Without Your Love", "Loser (feat. YENA)", "Rope It", "With the Clouds", "To Me, Today"],
        "Agust D": ["Intro : Dt sugA", "Agust D", "Skit", "So far away (feat. Suran)", "140503 at Dawn", "Tony Montana", "give it to me", "Interlude : Dream, Reality", "The Last", "724148"],
        "JITB": ["Intro", "Pandora's Box", "MORE", "STOP", "= (Equal Sign)", "Music Box : Reflection", "What if...", "Safety Zone", "Future", "Arson"]
    },
    
    TEAM_PFPS: {
        "Indigo": "https://i.ibb.co/4g9KWg3/team-Indigo.png",
        "Echo": "https://i.ibb.co/7xdY9xCy/Team-Echo.png" ,
        "Agust D": "https://i.ibb.co/BVc11nz9/Team-agustd.png",
        "JITB": "https://i.ibb.co/MDFyXfJp/jitb1.png"
    }
};

const STATE = {
    agentNo: null,
    week: null,
    weeks: [],
    data: null,
    page: 'home',
    charts: {}, // Store chart instances to prevent leaks
    cache: new Map(), // Data caching
    pullStartY: 0 // For pull-to-refresh
};

// ==================== UTILITIES (Sanitize, Toast, Charts) ====================
const $ = id => document.getElementById(id);
const teamColor = team => CONFIG.TEAMS[team]?.color || '#7b2cbf';
const fmt = n => Number(n || 0).toLocaleString();

// 🛡️ HTML Sanitization (Security)
function safe(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// 🔔 Toast Notifications (Better Feedback)
function showToast(msg, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    
    setTimeout(() => el.classList.add('show'), 10);
    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 300);
    }, 3000);
}

// 📊 Chart Manager (Fixes Memory Leaks)
function renderChart(canvasId, config) {
    const ctx = $(canvasId)?.getContext('2d');
    if (!ctx) return;

    // Destroy previous instance if it exists
    if (STATE.charts[canvasId]) {
        STATE.charts[canvasId].destroy();
    }
    // Create new instance
    STATE.charts[canvasId] = new Chart(ctx, config);
}

// 🎨 Premium Avatar Generator (Fixes PFP Visuals)
function getAvatarHTML(team, size = '50px') {
    const url = CONFIG.TEAM_PFPS[team];
    const color = teamColor(team);
    const teamClass = `team-${team.replace(/\s/g, '')}`; // Removes spaces for class
    
    if (url) {
        return `
            <div class="avatar-container ${teamClass}" style="width:${size};height:${size};">
                <img src="${url}" class="avatar-img" alt="${team}" 
                onerror="this.parentElement.innerHTML='<div class=\'avatar-fallback\' style=\'background:${color}\'>${team[0]}</div>'">
            </div>`;
    }
    return `
        <div class="avatar-container ${teamClass}" style="width:${size};height:${size};">
            <div class="avatar-fallback" style="background:linear-gradient(135deg, ${color}, ${color}88)">${team[0]}</div>
        </div>`;
}

// 💀 Skeleton Loading (Better UX)
function getSkeletonHTML(lines = 3) {
    return `
        <div class="card">
            <div class="card-body">
                <div class="skeleton skeleton-title"></div>
                ${'<div class="skeleton skeleton-text"></div>'.repeat(lines)}
            </div>
        </div>`;
}

// ==================== API & DATA ====================
async function api(action, params = {}, forceRefresh = false) {
    const cacheKey = `${action}_${JSON.stringify(params)}`;
    
    // Return Cached Data
    if (!forceRefresh && STATE.cache.has(cacheKey)) {
        const cached = STATE.cache.get(cacheKey);
        if (Date.now() - cached.time < CONFIG.CACHE_DURATION) {
            console.log('📦 Serving from Cache:', action);
            return cached.data;
        }
    }

    const url = new URL(CONFIG.API_URL);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        
        // Save to Cache
        STATE.cache.set(cacheKey, { time: Date.now(), data });
        return data;
    } catch (e) {
        console.error('❌ API Error:', e);
        throw e;
    }
}

// ==================== APP FLOW ====================
function initApp() {
    console.log('🚀 Starting app...');
    
    // Init Pull to Refresh
    initPullToRefresh();

    const saved = localStorage.getItem('spyAgent');
    if (saved) {
        STATE.agentNo = saved;
        loadDashboard();
        return;
    }
    
    $('login-btn')?.addEventListener('click', handleLogin);
    $('find-btn')?.addEventListener('click', handleFind);
}

// 🔍 Fixed Find Agent (Robust Search)
async function handleFind() {
    const input = $('instagram-input')?.value.trim();
    if (!input) return showToast('Enter Instagram username', 'error');
    
    // Sanitize Input: Remove @, lowercase, trim
    const searchUser = input.replace('@', '').toLowerCase();
    
    $('find-result').innerHTML = '<div class="skeleton skeleton-text"></div>'; // Loading state
    
    try {
        // Fetch ALL agents (cached) and filter locally for better matching
        const res = await api('getAllAgents'); 
        const agents = res.agents || [];
        
        const found = agents.find(a => 
            String(a.instagram || '').replace('@', '').toLowerCase().trim() === searchUser
        );
        
        if (found) {
            $('agent-input').value = found.agentNo;
            $('find-result').innerHTML = `<div class="success">✅ Found! Agent ID: ${found.agentNo}</div>`;
            showToast('Agent Found!', 'success');
        } else {
            $('find-result').innerHTML = `<div class="error">❌ @${safe(searchUser)} not found</div>`;
        }
    } catch (e) {
        $('find-result').textContent = 'Connection error';
    }
}

async function handleLogin() {
    const agentNo = $('agent-input')?.value.trim();
    if (!agentNo) return showToast('Enter Agent Number', 'error');
    
    try {
        $('login-btn').textContent = 'Checking...';
        const res = await api('getAllAgents');
        const found = res.agents.find(a => String(a.agentNo) === agentNo);
        
        if (found) {
            localStorage.setItem('spyAgent', agentNo);
            STATE.agentNo = agentNo;
            loadDashboard();
        } else {
            showToast('Agent ID not found', 'error');
        }
    } catch (e) {
        showToast('Login failed', 'error');
    } finally {
        $('login-btn').textContent = 'Login';
    }
}

// ==================== DASHBOARD ====================
async function loadDashboard() {
    $('loading').classList.add('active');
    
    try {
        // Parallel Fetch for Speed
        const [weeksRes] = await Promise.all([api('getAvailableWeeks')]);
        STATE.weeks = weeksRes.weeks || [];
        STATE.week = weeksRes.current || STATE.weeks[0];
        
        // Load User Data
        STATE.data = await api('getAgentData', { agentNo: STATE.agentNo, week: STATE.week });
        
        // Switch UI
        $('login-screen').style.display = 'none';
        $('dashboard-screen').style.display = 'flex';
        $('dashboard-screen').classList.add('active');
        
        setupDashboardUI();
        loadPage('home');
        $('loading').classList.remove('active');
    } catch (e) {
        showToast('Failed to load dashboard', 'error');
        localStorage.removeItem('spyAgent');
        location.reload();
    }
}

function setupDashboardUI() {
    const p = STATE.data?.profile;
    if (!p) return;
    
    // 🎨 Use New Avatar Generator
    const pfpHTML = getAvatarHTML(p.team, '60px');
    
    // Update Profile Elements
    const updateEl = (id, val, isHTML = false) => {
        if ($(id)) isHTML ? $(id).innerHTML = val : $(id).textContent = val;
    };

    updateEl('agent-avatar', pfpHTML, true);
    updateEl('profile-avatar', pfpHTML, true);
    updateEl('agent-name', p.name);
    updateEl('agent-team', p.team);
    if($('agent-team')) $('agent-team').style.color = teamColor(p.team);
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            loadPage(link.dataset.page);
            $('sidebar').classList.remove('open');
        };
    });
    
    $('menu-btn').onclick = () => $('sidebar').classList.add('open');
    $('close-sidebar').onclick = () => $('sidebar').classList.remove('open');
    $('logout-btn').onclick = () => { localStorage.clear(); location.reload(); };
}

// 🔄 Pull to Refresh Implementation
function initPullToRefresh() {
    const content = document.querySelector('.content-area');
    const indicator = document.createElement('div');
    indicator.className = 'ptr-indicator';
    indicator.innerHTML = '<div class="ptr-spinner">↻</div>';
    content.insertBefore(indicator, content.firstChild);

    content.addEventListener('touchstart', e => STATE.pullStartY = e.touches[0].pageY);
    
    content.addEventListener('touchmove', e => {
        const y = e.touches[0].pageY;
        if (content.scrollTop === 0 && y > STATE.pullStartY + 50) {
            indicator.classList.add('active');
        }
    });

    content.addEventListener('touchend', async () => {
        if (indicator.classList.contains('active')) {
            // Perform Refresh
            try {
                await api('getAgentData', { agentNo: STATE.agentNo, week: STATE.week }, true); // Force refresh
                loadPage(STATE.page); // Reload current page
                showToast('Data Refreshed', 'success');
            } catch(e) { showToast('Refresh Failed', 'error'); }
            indicator.classList.remove('active');
        }
    });
}

// ==================== PAGE ROUTER (Consolidated) ====================
async function loadPage(page) {
    STATE.page = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const container = $(`page-${page}`);
    if(!container) return;
    
    container.classList.add('active');
    
    // 🛑 Error Boundary Pattern
    try {
        // Render Skeleton first
        const contentDiv = container.querySelector('.page-content') || container;
        if(contentDiv.innerHTML.trim() === '') contentDiv.innerHTML = getSkeletonHTML(3);

        switch(page) {
            case 'home': await renderHome(); break;
            case 'profile': await renderProfile(); break;
            case 'rankings': await renderRankings(); break;
            case 'goals': await renderGoals(); break;
            case 'team-level': await renderTeamLevel(); break; // Consolidated
            case 'comparison': await renderComparison(); break; // Consolidated
            case 'summary': await renderSummary(); break; // Consolidated
            case 'album2x': await renderAlbum2x(); break;
            // Add other cases as needed
        }
    } catch (e) {
        console.error(`Error loading ${page}:`, e);
        showToast(`Error loading ${page}`, 'error');
        container.innerHTML = `<div class="card"><div class="card-body error">Failed to load content. <button onclick="loadPage('${page}')">Retry</button></div></div>`;
    }
}

// ==================== CONSOLIDATED PAGE RENDERERS ====================

// 1. HOME
async function renderHome() {
    const [summary, rankings] = await Promise.all([
        api('getWeeklySummary', { week: STATE.week }),
        api('getRankings', { week: STATE.week, limit: 5 })
    ]);
    
    const team = STATE.data.profile.team;
    const teamData = summary.teams[team] || {};
    
    $('current-week').textContent = `Week: ${STATE.week}`;
    
    // Example of Sanitized Rendering
    $('home-top-agents').innerHTML = rankings.rankings.map((r, i) => `
        <div class="rank-item">
            <div class="rank-num">${i + 1}</div>
            <div class="rank-info">
                <div class="rank-name">${safe(r.name)}</div>
                <div class="rank-team" style="color:${teamColor(r.team)}">${r.team}</div>
            </div>
            <div class="rank-xp">${fmt(r.totalXP)} XP</div>
        </div>
    `).join('');

    // Render Standings Bar
    const maxXP = Math.max(...Object.values(summary.teams).map(t => t.teamXP));
    $('home-standings').innerHTML = Object.entries(summary.teams)
        .sort((a,b) => b[1].teamXP - a[1].teamXP)
        .map(([name, data]) => `
            <div style="margin-bottom:8px">
                <div style="display:flex;justify-content:space-between;font-size:12px">
                    <span style="color:${teamColor(name)}">${name}</span>
                    <span>${fmt(data.teamXP)} XP</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:${(data.teamXP/maxXP)*100}%; background:${teamColor(name)}"></div></div>
            </div>
        `).join('');
}

// 2. TEAM LEVEL (Consolidated - Removed Duplicates)
async function renderTeamLevel() {
    const container = $('team-level-content');
    const summary = await api('getWeeklySummary', { week: STATE.week });
    
    // Render Chart (Memory Safe)
    const chartContainer = document.createElement('canvas');
    chartContainer.id = 'team-growth-chart';
    
    let html = `<div class="card"><div class="card-header"><h3>📈 Team Levels</h3></div><div class="card-body"><canvas id="team-growth-chart"></canvas></div></div>`;
    
    html += `<div class="stats-grid">` + Object.entries(summary.teams).map(([t, info]) => `
        <div class="card" style="border-top: 3px solid ${teamColor(t)}">
            <div class="card-body" style="text-align:center">
                ${getAvatarHTML(t, '60px')}
                <h3 style="color:${teamColor(t)}">${t}</h3>
                <div style="font-size:32px;font-weight:bold">Lv ${info.level}</div>
                <div>${fmt(info.teamXP)} XP</div>
                <div class="missions-row" style="margin-top:10px;font-size:12px">
                    <span>🎵 ${info.trackGoalPassed?'✅':'❌'}</span>
                    <span>💿 ${info.albumGoalPassed?'✅':'❌'}</span>
                    <span>✨ ${info.album2xPassed?'✅':'❌'}</span>
                </div>
            </div>
        </div>
    `).join('') + `</div>`;
    
    container.innerHTML = html;
    
    // Setup Chart AFTER HTML injection
    const histData = await api('getTeamChartData', { team: STATE.data.profile.team }); // Example
    if(histData.weeks) {
        renderChart('team-growth-chart', {
            type: 'line',
            data: {
                labels: histData.weeks,
                datasets: [{
                    label: 'XP Growth',
                    data: histData.teamXP,
                    borderColor: teamColor(STATE.data.profile.team),
                    tension: 0.4
                }]
            }
        });
    }
}

// 3. COMPARISON (Consolidated)
async function renderComparison() {
    const data = await api('getTeamComparison', { week: STATE.week });
    const teams = data.comparison.sort((a, b) => b.teamXP - a.teamXP);
    
    $('comparison-content').innerHTML = `
        <div class="card">
            <div class="card-header"><h3>⚔️ Battle Standings</h3></div>
            <div class="card-body">
                <table style="width:100%">
                    ${teams.map((t, i) => `
                        <tr style="border-bottom:1px solid var(--border)">
                            <td style="padding:10px 0">#${i+1}</td>
                            <td>
                                <div style="display:flex;align-items:center;gap:8px">
                                    ${getAvatarHTML(t.team, '30px')}
                                    <span style="color:${teamColor(t.team)}">${t.team}</span>
                                </div>
                            </td>
                            <td style="text-align:right;font-weight:bold">${fmt(t.teamXP)}</td>
                            <td style="text-align:right;font-size:12px">
                                ${t.missions.tracks?'✅':''} ${t.missions.albums?'💿':''} ${t.missions.album2x?'✨':''}
                            </td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        </div>
    `;
}

// 4. SUMMARY (Consolidated - Logic for Locked vs Result)
async function renderSummary() {
    const now = new Date();
    const isSunday = now.getDay() === 0;
    
    if (!isSunday) {
        $('summary-content').innerHTML = `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:50px 20px">
                    <div style="font-size:60px">🔒</div>
                    <h2>Results Locked</h2>
                    <p style="color:var(--text-dim)">Results revealed on Sunday 12:00 AM</p>
                </div>
            </div>`;
        return;
    }

    const summary = await api('getWeeklySummary', { week: STATE.week });
    const winner = summary.winner;
    
    $('summary-content').innerHTML = `
        ${winner ? `
            <div class="card" style="border:2px solid ${teamColor(winner)};background:linear-gradient(to bottom right, ${teamColor(winner)}22, transparent)">
                <div class="card-body" style="text-align:center">
                    <h1>🏆</h1>
                    <h2 style="color:${teamColor(winner)}">${winner} WINS!</h2>
                    <p>${fmt(summary.teams[winner].teamXP)} XP</p>
                </div>
            </div>
        ` : ''}
        <div class="card">
            <div class="card-header"><h3>Final Standings</h3></div>
            <div class="card-body">
                ${Object.entries(summary.teams).sort((a,b)=>b[1].teamXP - a[1].teamXP).map(([t, d]) => `
                    <div style="display:flex;justify-content:space-between;padding:10px;border-bottom:1px solid var(--border)">
                        <span style="color:${teamColor(t)}">${t}</span>
                        <span>${fmt(d.teamXP)} XP</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 5. RANKINGS (Using Safe HTML)
async function renderRankings() {
    const data = await api('getRankings', { week: STATE.week, limit: 50 });
    $('rankings-list').innerHTML = data.rankings.map((r, i) => `
        <div class="rank-item ${r.agentNo == STATE.agentNo ? 'highlight' : ''}">
            <div class="rank-num">${i+1}</div>
            <div class="rank-info">
                <div class="rank-name">${safe(r.name)}</div>
                <div class="rank-team" style="color:${teamColor(r.team)}">${r.team}</div>
            </div>
            <div class="rank-xp">${fmt(r.totalXP)}</div>
        </div>
    `).join('');
}

// 6. GOALS (Using Progress Bars)
async function renderGoals() {
    const data = await api('getGoalsProgress', { week: STATE.week });
    const myTeam = STATE.data.profile.team;
    
    const renderSection = (title, goals) => `
        <div class="card"><div class="card-header"><h3>${title}</h3></div><div class="card-body">
            ${Object.entries(goals).map(([key, info]) => {
                const tData = info.teams[myTeam] || { current: 0, percentage: 0 };
                const pct = Math.min(100, tData.percentage);
                return `
                    <div style="margin-bottom:15px">
                        <div style="display:flex;justify-content:space-between;font-size:14px">
                            <span>${key}</span>
                            <span>${fmt(tData.current)} / ${fmt(info.goal)}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${pct}%; background:${pct>=100?'var(--success)':teamColor(myTeam)}"></div>
                        </div>
                    </div>`;
            }).join('')}
        </div></div>`;
        
    $('goals-content').innerHTML = 
        renderSection('🎵 Track Goals', data.trackGoals) + 
        renderSection('💿 Album Goals', data.albumGoals);
}

// 7. ALBUM 2X (Using PFP logic)
async function renderAlbum2x() {
    const container = $('album2x-content');
    const myTeam = STATE.data.profile.team;
    
    // 1. My Progress
    const myTracks = STATE.data.album2xStatus.tracks || {};
    const teamTracks = CONFIG.TEAM_ALBUM_TRACKS[myTeam] || [];
    const passedCount = teamTracks.filter(t => (myTracks[t] || 0) >= 2).length;
    
    let html = `
        <div class="card">
            <div class="card-body" style="text-align:center">
                <h2>${passedCount} / ${teamTracks.length}</h2>
                <p>Tracks Completed (2x Streams)</p>
                <div class="progress-bar"><div class="progress-fill" style="width:${(passedCount/teamTracks.length)*100}%"></div></div>
            </div>
        </div>
        <div class="card"><div class="card-body">
            ${teamTracks.map(t => `
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
                    <span>${t}</span>
                    <span>${(myTracks[t]||0) >= 2 ? '✅' : (myTracks[t]||0)+'/2'}</span>
                </div>
            `).join('')}
        </div></div>
    `;
    
    container.innerHTML = html;
    
    // 2. Team Progress (Async load)
    const teamData = await api('getAlbum2xStatus', { week: STATE.week, team: myTeam });
    const members = teamData.teams[myTeam].members || [];
    
    const teamHTML = `
        <div class="card"><div class="card-header"><h3>👥 Team Status</h3></div><div class="card-body">
            ${members.map(m => `
                <div style="display:flex;justify-content:space-between;padding:5px 0">
                    <span>${safe(m.name)}</span>
                    <span>${m.passed ? '✅' : '❌'}</span>
                </div>
            `).join('')}
        </div></div>`;
        
    container.insertAdjacentHTML('beforeend', teamHTML);
}

// 8. PROFILE (New)
async function renderProfile() {
    const p = STATE.data.profile;
    const stats = STATE.data.stats;
    $('profile-stats').innerHTML = `
        <div class="stat-box"><div class="stat-value">${fmt(stats.totalXP)}</div><div class="stat-label">XP</div></div>
        <div class="stat-box"><div class="stat-value">#${STATE.data.rank}</div><div class="stat-label">Rank</div></div>
        <div class="stat-box"><div class="stat-value">${fmt(stats.trackScrobbles)}</div><div class="stat-label">Tracks</div></div>
    `;
    
    // Load Badges
    const bData = await api('getBadges', { agentNo: STATE.agentNo });
    $('profile-badges').innerHTML = bData.badges.length ? 
        bData.badges.map(b => `<div class="badge"><img src="${b.imageUrl}" title="${b.name}" style="width:50px;height:50px;border-radius:50%"></div>`).join('') : 
        '<p style="text-align:center;color:var(--text-dim)">No badges yet</p>';
}

// Init
document.addEventListener('DOMContentLoaded', initApp);
