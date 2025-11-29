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
    charts: {}, // Store chart instances to prevent memory leaks
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

// 🔔 Toast Notifications (Feedback)
function showToast(msg, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = type === 'success' ? '✅ ' + msg : type === 'error' ? '❌ ' + msg : 'ℹ️ ' + msg;
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

    // Destroy previous instance if it exists to prevent memory leak
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
    const teamClass = `team-${team.replace(/\s/g, '')}`; // Removes spaces for class "AgustD"
    
    if (url) {
        return `
            <div class="avatar-container ${teamClass}" style="width:${size};height:${size};min-width:${size};">
                <img src="${url}" class="avatar-img" alt="${team}" 
                onerror="this.parentElement.innerHTML='<div class=\'avatar-fallback\' style=\'background:${color}\'>${team[0]}</div>'">
            </div>`;
    }
    return `
        <div class="avatar-container ${teamClass}" style="width:${size};height:${size};min-width:${size};">
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

// ==================== API & DATA (Caching Included) ====================
async function api(action, params = {}, forceRefresh = false) {
    const cacheKey = `${action}_${JSON.stringify(params)}`;
    
    // Return Cached Data if valid
    if (!forceRefresh && STATE.cache.has(cacheKey)) {
        const cached = STATE.cache.get(cacheKey);
        if (Date.now() - cached.time < CONFIG.CACHE_DURATION) {
            console.log('📦 Serving from Cache:', action);
            return cached.data;
        }
    }

    const url = new URL(CONFIG.API_URL);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([k, v]) => {
        if(v != null) url.searchParams.set(k, v);
    });
    
    try {
        const res = await fetch(url);
        const text = await res.text();
        const data = JSON.parse(text);
        
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
    
    initPullToRefresh(); // Initialize Pull to Refresh

    const saved = localStorage.getItem('spyAgent');
    if (saved) {
        STATE.agentNo = saved;
        loadDashboard();
        return;
    }
    
    $('login-btn')?.addEventListener('click', handleLogin);
    $('find-btn')?.addEventListener('click', handleFind);
}

// 🔍 Fixed Find Agent (Robust Search - Fixes username issue)
async function handleFind() {
    const input = $('instagram-input')?.value.trim();
    if (!input) return showToast('Enter Instagram username', 'error');
    
    // Sanitize Input: Remove @, lowercase, trim
    const searchUser = input.replace('@', '').toLowerCase();
    
    $('find-result').innerHTML = '<div class="skeleton skeleton-text" style="width:100%"></div>';
    
    try {
        // Fetch ALL agents (cached) and filter locally for better matching
        // This fixes issues where API exact match failed
        const res = await api('getAllAgents'); 
        const agents = res.agents || [];
        
        const found = agents.find(a => 
            String(a.instagram || '').replace('@', '').toLowerCase().trim() === searchUser
        );
        
        if (found) {
            $('agent-input').value = found.agentNo;
            $('find-result').innerHTML = `<div class="success" style="color:var(--success)">✅ Found! Agent ID: ${found.agentNo}</div>`;
            showToast('Agent Found!', 'success');
        } else {
            $('find-result').innerHTML = `<div class="error" style="color:var(--danger)">❌ @${safe(searchUser)} not found</div>`;
            showToast('User not found', 'error');
        }
    } catch (e) {
        $('find-result').textContent = 'Connection error';
    }
}

async function handleLogin() {
    const agentNo = $('agent-input')?.value.trim();
    if (!agentNo) return showToast('Enter Agent Number', 'error');
    
    const btn = $('login-btn');
    const originalText = btn.textContent;
    
    try {
        btn.textContent = 'Checking...';
        const res = await api('getAllAgents');
        const found = res.agents.find(a => String(a.agentNo).trim() === agentNo);
        
        if (found) {
            localStorage.setItem('spyAgent', agentNo);
            STATE.agentNo = agentNo;
            loadDashboard();
            showToast(`Welcome, Agent ${agentNo}`, 'success');
        } else {
            showToast('Agent ID not found', 'error');
        }
    } catch (e) {
        showToast('Login failed: ' + e.message, 'error');
    } finally {
        btn.textContent = originalText;
    }
}

// ==================== DASHBOARD ====================
async function loadDashboard() {
    const loadingEl = $('loading');
    if(loadingEl) loadingEl.classList.add('active');
    
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
        
    } catch (e) {
        showToast('Failed to load dashboard', 'error');
        console.error(e);
        localStorage.removeItem('spyAgent');
        location.reload();
    } finally {
        if(loadingEl) loadingEl.classList.remove('active');
    }
}

function setupDashboardUI() {
    const p = STATE.data?.profile;
    if (!p) return;
    
    // 🎨 Use New Avatar Generator
    const pfpHTML = getAvatarHTML(p.team, '60px');
    
    // Update Profile Elements
    const updateEl = (id, val, isHTML = false) => {
        const el = $(id);
        if (el) isHTML ? el.innerHTML = val : el.textContent = val;
    };

    updateEl('agent-avatar', pfpHTML, true);
    updateEl('profile-avatar', pfpHTML, true);
    updateEl('agent-name', p.name);
    updateEl('agent-team', p.team);
    if($('agent-team')) $('agent-team').style.color = teamColor(p.team);
    
    updateEl('profile-name', p.name);
    updateEl('profile-team', p.team);
    if($('profile-team')) $('profile-team').style.color = teamColor(p.team);
    
    // Week Selector
    const select = $('week-select');
    if (select) {
        select.innerHTML = STATE.weeks.map(w => `<option value="${w}" ${w===STATE.week?'selected':''}>${w}</option>`).join('');
        select.onchange = async () => {
            STATE.week = select.value;
            const loadingEl = $('loading');
            if(loadingEl) loadingEl.classList.add('active');
            try {
                STATE.data = await api('getAgentData', { agentNo: STATE.agentNo, week: STATE.week });
                loadPage(STATE.page);
                showToast(`Loaded ${STATE.week}`, 'success');
            } catch(e) { showToast('Failed to change week', 'error'); }
            if(loadingEl) loadingEl.classList.remove('active');
        };
    }

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
    $('logout-btn').onclick = () => { localStorage.removeItem('spyAgent'); location.reload(); };
}

// 🔄 Pull to Refresh Implementation
function initPullToRefresh() {
    const content = document.querySelector('.content-area');
    if (!content) return;

    const indicator = document.createElement('div');
    indicator.className = 'ptr-indicator';
    indicator.innerHTML = '<div class="ptr-spinner">↻</div>';
    content.insertBefore(indicator, content.firstChild);

    content.addEventListener('touchstart', e => {
        if (content.scrollTop === 0) STATE.pullStartY = e.touches[0].pageY;
    });
    
    content.addEventListener('touchmove', e => {
        const y = e.touches[0].pageY;
        if (content.scrollTop === 0 && y > STATE.pullStartY + 60) {
            indicator.classList.add('active');
        }
    });

    content.addEventListener('touchend', async () => {
        if (indicator.classList.contains('active')) {
            // Perform Refresh
            try {
                await api('getAgentData', { agentNo: STATE.agentNo, week: STATE.week }, true); // Force refresh
                loadPage(STATE.page); 
                showToast('Data Refreshed', 'success');
            } catch(e) { showToast('Refresh Failed', 'error'); }
            indicator.classList.remove('active');
        }
    });
}

// ==================== PAGE ROUTER (Centralized & Safe) ====================
async function loadPage(page) {
    STATE.page = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const container = $(`page-${page}`);
    if(!container) return;
    
    container.classList.add('active');
    
    // 🛑 Error Boundary Pattern & Skeleton Loading
    try {
        // If container is empty or we are refreshing, show skeleton
        const contentDiv = container.querySelector('.page-content') || container;
        // Simple check to see if we should show skeleton (if distinct content div exists)
        if(page !== 'home') contentDiv.innerHTML = getSkeletonHTML(3);

        switch(page) {
            case 'home': await renderHome(); break;
            case 'profile': await renderProfile(); break;
            case 'rankings': await renderRankings(); break;
            case 'goals': await renderGoals(); break;
            case 'team-level': await renderTeamLevel(); break;
            case 'comparison': await renderComparison(); break;
            case 'summary': await renderSummary(); break;
            case 'album2x': await renderAlbum2x(); break;
            case 'team-charts': await renderTeamCharts(); break;
            case 'agent-charts': await renderAgentCharts(); break;
            case 'announcements': await renderAnnouncements(); break;
            case 'drawer': await renderDrawer(); break;
        }
    } catch (e) {
        console.error(`Error loading ${page}:`, e);
        showToast(`Error loading ${page}`, 'error');
        container.innerHTML = `<div class="card"><div class="card-body error">Failed to load content. <button onclick="loadPage('${page}')" style="margin-top:10px;padding:5px 10px;">Retry</button></div></div>`;
    }
}

// ==================== CONSOLIDATED PAGE RENDERERS ====================

// 1. HOME
async function renderHome() {
    $('current-week').textContent = 'Week: ' + STATE.week;
    
    const [summary, rankings, goals] = await Promise.all([
        api('getWeeklySummary', { week: STATE.week }),
        api('getRankings', { week: STATE.week, limit: 5 }),
        api('getGoalsProgress', { week: STATE.week })
    ]);
    
    const team = STATE.data.profile.team;
    const teamData = summary.teams[team] || {};
    const myStats = STATE.data.stats || {};

    // Quick Stats
    const statsDiv = $('home-quick-stats') || document.createElement('div');
    statsDiv.id = 'home-quick-stats';
    statsDiv.innerHTML = `
        <div class="card" style="margin-bottom:20px;">
            <div class="card-header"><h3>📊 Your Stats</h3></div>
            <div class="card-body" style="display:flex;gap:10px;justify-content:space-around;text-align:center;">
                <div><div style="font-size:20px;font-weight:bold;color:var(--purple-glow)">${fmt(myStats.totalXP)}</div><div style="font-size:11px;color:var(--text-dim)">XP</div></div>
                <div><div style="font-size:20px;font-weight:bold;color:var(--purple-glow)">#${STATE.data.rank}</div><div style="font-size:11px;color:var(--text-dim)">Rank</div></div>
                <div><div style="font-size:20px;font-weight:bold;color:var(--purple-glow)">${fmt(myStats.trackScrobbles)}</div><div style="font-size:11px;color:var(--text-dim)">Tracks</div></div>
            </div>
        </div>`;
    
    // Insert stats if not present
    const topAgents = $('home-top-agents');
    if(topAgents && !$('home-quick-stats')) topAgents.parentElement.parentElement.insertBefore(statsDiv, topAgents.parentElement.parentElement);

    // Top Agents (Sanitized)
    $('home-top-agents').innerHTML = rankings.rankings.map((r, i) => `
        <div class="rank-item" onclick="loadPage('rankings')">
            <div class="rank-num">${i + 1}</div>
            <div class="rank-info">
                <div class="rank-name">${safe(r.name)}</div>
                <div class="rank-team" style="color:${teamColor(r.team)}">${r.team}</div>
            </div>
            <div class="rank-xp">${fmt(r.totalXP)} XP</div>
        </div>
    `).join('');

    // Standings
    const maxXP = Math.max(...Object.values(summary.teams).map(t => t.teamXP));
    $('home-standings').innerHTML = Object.entries(summary.teams)
        .sort((a,b) => b[1].teamXP - a[1].teamXP)
        .map(([name, data]) => `
            <div style="margin-bottom:8px" onclick="loadPage('comparison')">
                <div style="display:flex;justify-content:space-between;font-size:12px">
                    <span style="color:${teamColor(name)}">${name}</span>
                    <span>${fmt(data.teamXP)} XP</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:${(data.teamXP/maxXP)*100}%; background:${teamColor(name)}"></div></div>
            </div>
        `).join('');
        
    // Missions
    const missionsContainer = document.querySelector('.missions-grid');
    if (missionsContainer) {
        missionsContainer.innerHTML = `
            <div class="mission-card" onclick="loadPage('goals')">
                <div class="mission-icon">🎵</div>
                <h3>Track Goals</h3>
                <div class="mission-status ${teamData.trackGoalPassed ? 'complete' : 'pending'}">${teamData.trackGoalPassed ? '✅ Complete' : '⏳ In Progress'}</div>
            </div>
            <div class="mission-card" onclick="loadPage('goals')">
                <div class="mission-icon">💿</div>
                <h3>Album Goals</h3>
                <div class="mission-status ${teamData.albumGoalPassed ? 'complete' : 'pending'}">${teamData.albumGoalPassed ? '✅ Complete' : '⏳ In Progress'}</div>
            </div>
            <div class="mission-card" onclick="loadPage('album2x')">
                <div class="mission-icon">✨</div>
                <h3>Album 2X</h3>
                <div class="mission-status ${teamData.album2xPassed ? 'complete' : 'pending'}">${teamData.album2xPassed ? '✅ Complete' : '⏳ In Progress'}</div>
            </div>`;
    }
}

// 2. TEAM LEVEL (Merged & Fixed)
async function renderTeamLevel() {
    const container = $('team-level-content');
    const summary = await api('getWeeklySummary', { week: STATE.week });
    const myTeam = STATE.data.profile.team;
    
    // HTML Structure
    let html = `
        <div class="card">
            <div class="card-header"><h3>📈 Team XP Growth</h3></div>
            <div class="card-body"><canvas id="team-growth-chart"></canvas></div>
        </div>
        <div class="stats-grid">`;
    
    // Team Cards
    html += Object.entries(summary.teams).map(([t, info]) => `
        <div class="card" style="border-top: 3px solid ${teamColor(t)}; ${t === myTeam ? 'box-shadow: 0 0 10px '+teamColor(t)+'44' : ''}">
            <div class="card-body" style="text-align:center">
                ${getAvatarHTML(t, '60px')}
                <h3 style="color:${teamColor(t)};margin:10px 0">${t}</h3>
                <div style="font-size:36px;font-weight:bold">Lv ${info.level}</div>
                <div style="color:var(--text-dim)">${fmt(info.teamXP)} XP</div>
                
                <div style="margin-top:15px;padding-top:10px;border-top:1px solid var(--border);text-align:left;font-size:13px">
                    <div style="display:flex;justify-content:space-between"><span>🎵 Tracks</span><span>${info.trackGoalPassed?'✅':'❌'}</span></div>
                    <div style="display:flex;justify-content:space-between"><span>💿 Albums</span><span>${info.albumGoalPassed?'✅':'❌'}</span></div>
                    <div style="display:flex;justify-content:space-between"><span>✨ 2X</span><span>${info.album2xPassed?'✅':'❌'}</span></div>
                </div>
            </div>
        </div>
    `).join('') + `</div>`;
    
    container.innerHTML = html;
    
    // Render Chart (Memory Safe)
    try {
        const histData = await api('getTeamChartData', { team: myTeam }); 
        if(histData.weeks) {
            renderChart('team-growth-chart', {
                type: 'line',
                data: {
                    labels: histData.weeks,
                    datasets: [{
                        label: 'XP Growth',
                        data: histData.teamXP,
                        borderColor: teamColor(myTeam),
                        tension: 0.4
                    }]
                }
            });
        }
    } catch(e) { console.log('Chart data error'); }
}

// 3. COMPARISON (Merged & Cleaned)
async function renderComparison() {
    const data = await api('getTeamComparison', { week: STATE.week });
    const teams = data.comparison.sort((a, b) => b.teamXP - a.teamXP);
    
    $('comparison-content').innerHTML = `
        <div class="card">
            <div class="card-header"><h3>⚔️ Battle Standings</h3></div>
            <div class="card-body">
                <table style="width:100%;border-collapse:collapse">
                    <thead>
                        <tr style="border-bottom:1px solid var(--border);font-size:12px;color:var(--text-dim)">
                            <th style="text-align:left;padding:10px">Team</th>
                            <th style="text-align:right">XP</th>
                            <th style="text-align:center">Missions</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${teams.map((t, i) => `
                        <tr style="border-bottom:1px solid var(--border)">
                            <td style="padding:10px 0">
                                <div style="display:flex;align-items:center;gap:10px">
                                    <span style="width:20px;text-align:center">${i+1}</span>
                                    ${getAvatarHTML(t.team, '30px')}
                                    <span style="color:${teamColor(t.team)}">${t.team}</span>
                                </div>
                            </td>
                            <td style="text-align:right;font-weight:bold">${fmt(t.teamXP)}</td>
                            <td style="text-align:center;font-size:12px">
                                ${t.missions.tracks?'✅':'❌'} ${t.missions.albums?'💿':'❌'} ${t.missions.album2x?'✨':'❌'}
                            </td>
                        </tr>
                    `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// 4. SUMMARY (Merged & "Locked" Logic preserved)
async function renderSummary() {
    const now = new Date();
    const isSunday = now.getDay() === 0;
    
    const container = $('summary-content');
    
    if (!isSunday) {
        container.innerHTML = `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:60px 20px">
                    <div style="font-size:60px;margin-bottom:20px">🔒</div>
                    <h2>Results Locked</h2>
                    <p style="color:var(--text-dim)">Weekly summary unlocks on <br><strong>Sunday 12:00 AM</strong></p>
                    <div style="margin-top:20px;font-size:12px;color:var(--purple-light)">Current Battle Ends: Saturday 11:55 PM</div>
                </div>
            </div>`;
        return;
    }

    const [summary, winnersData] = await Promise.all([
        api('getWeeklySummary', { week: STATE.week }),
        api('getWeeklyWinners')
    ]);
    
    const winner = summary.winner;
    
    container.innerHTML = `
        ${winner ? `
            <div class="card" style="border:2px solid ${teamColor(winner)};background:linear-gradient(135deg, ${teamColor(winner)}22, transparent)">
                <div class="card-body" style="text-align:center;padding:40px">
                    <div style="font-size:60px">🏆</div>
                    <h2 style="color:${teamColor(winner)};margin:10px 0">${winner} WINS!</h2>
                    <div style="font-size:24px;font-weight:bold">${fmt(summary.teams[winner].teamXP)} XP</div>
                </div>
            </div>
        ` : ''}
        
        <div class="card">
            <div class="card-header"><h3>📊 Final Standings</h3></div>
            <div class="card-body">
                ${Object.entries(summary.teams).sort((a,b)=>b[1].teamXP - a[1].teamXP).map(([t, d], i) => `
                    <div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)">
                        <div style="display:flex;gap:10px;align-items:center">
                            <span>#${i+1}</span>
                            ${getAvatarHTML(t, '30px')}
                            <span style="color:${teamColor(t)}">${t}</span>
                        </div>
                        <div style="font-weight:bold">${fmt(d.teamXP)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 5. RANKINGS (Sanitized)
async function renderRankings() {
    const data = await api('getRankings', { week: STATE.week, limit: 100 });
    $('rankings-list').innerHTML = data.rankings.map((r, i) => `
        <div class="rank-item ${r.agentNo == STATE.agentNo ? 'highlight' : ''}">
            <div class="rank-num">${i+1}</div>
            <div class="rank-info">
                <div class="rank-name">${safe(r.name)} ${r.agentNo == STATE.agentNo ? '(You)' : ''}</div>
                <div class="rank-team" style="color:${teamColor(r.team)}">${r.team}</div>
            </div>
            <div class="rank-xp">${fmt(r.totalXP)}</div>
        </div>
    `).join('');
}

// 6. GOALS (Better Progress Bars)
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
                        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px">
                            <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:70%">${key}</span>
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

// 7. ALBUM 2X
async function renderAlbum2x() {
    const container = $('album2x-content');
    const myTeam = STATE.data.profile.team;
    
    // My Progress
    const myTracks = STATE.data.album2xStatus.tracks || {};
    const teamTracks = CONFIG.TEAM_ALBUM_TRACKS[myTeam] || [];
    const passedCount = teamTracks.filter(t => (myTracks[t] || 0) >= 2).length;
    const isComplete = passedCount === teamTracks.length;
    
    container.innerHTML = `
        <div class="card" style="border:2px solid ${isComplete ? 'var(--success)' : 'var(--border)'}">
            <div class="card-body" style="text-align:center;padding:30px">
                <div style="font-size:50px;margin-bottom:10px">${isComplete ? '🎉' : '⏳'}</div>
                <div style="font-size:30px;font-weight:bold">${passedCount} / ${teamTracks.length}</div>
                <p>Tracks Completed (2x Each)</p>
                <div class="progress-bar" style="margin-top:15px">
                    <div class="progress-fill" style="width:${(passedCount/teamTracks.length)*100}%;background:${isComplete?'var(--success)':'var(--purple-main)'}"></div>
                </div>
            </div>
        </div>
        
        <div class="card"><div class="card-body">
            ${teamTracks.map(t => `
                <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">
                    <span style="font-size:13px">${t}</span>
                    <span style="color:${(myTracks[t]||0) >= 2 ? 'var(--success)' : 'var(--danger)'}">
                        ${(myTracks[t]||0)}/2 ${(myTracks[t]||0) >= 2 ? '✅' : ''}
                    </span>
                </div>
            `).join('')}
        </div></div>
        <div class="card"><div class="card-header"><h3>👥 Team Status</h3></div><div class="card-body" id="team-2x-list">Loading...</div></div>
    `;
    
    // Async Load Team Data
    try {
        const teamData = await api('getAlbum2xStatus', { week: STATE.week, team: myTeam });
        const members = teamData.teams[myTeam].members || [];
        $('team-2x-list').innerHTML = members.map(m => `
            <div style="display:flex;justify-content:space-between;padding:5px 0">
                <span>${safe(m.name)}</span>
                <span>${m.passed ? '✅' : '❌'}</span>
            </div>
        `).join('');
    } catch(e) { $('team-2x-list').textContent = 'Failed to load'; }
}

// 8. PROFILE
async function renderProfile() {
    const p = STATE.data.profile;
    const stats = STATE.data.stats;
    $('profile-stats').innerHTML = `
        <div class="stat-box"><div class="stat-value">${fmt(stats.totalXP)}</div><div class="stat-label">Total XP</div></div>
        <div class="stat-box"><div class="stat-value">#${STATE.data.rank}</div><div class="stat-label">Rank</div></div>
        <div class="stat-box"><div class="stat-value">${fmt(stats.trackScrobbles)}</div><div class="stat-label">Tracks</div></div>
        <div class="stat-box"><div class="stat-value">${fmt(stats.albumScrobbles)}</div><div class="stat-label">Albums</div></div>
    `;
    
    // Load Badges
    try {
        const bData = await api('getBadges', { agentNo: STATE.agentNo });
        $('profile-badges').innerHTML = bData.badges.length ? 
            bData.badges.map(b => `<div class="badge" title="${b.name}"><img src="${b.imageUrl || ''}" style="width:50px;height:50px;border-radius:50%;background:var(--purple-main)" onerror="this.style.display='none';this.parentElement.innerText='🎖️'"></div>`).join('') : 
            '<p style="text-align:center;color:var(--text-dim)">No badges yet</p>';
    } catch(e) { $('profile-badges').innerHTML = 'Error loading badges'; }
}

// 9. OTHER PAGES (Charts, Announcements, Drawer)
async function renderTeamCharts() {
    $('chart-team-xp').innerHTML = ''; // Clear previous
    const ctx = $('chart-team-xp').getContext('2d');
    const summary = await api('getWeeklySummary', { week: STATE.week });
    const teams = summary.teams;
    renderChart('chart-team-xp', {
        type: 'bar',
        data: {
            labels: Object.keys(teams),
            datasets: [{
                label: 'XP',
                data: Object.values(teams).map(t => t.teamXP),
                backgroundColor: Object.keys(teams).map(t => teamColor(t))
            }]
        }
    });
}

async function renderAgentCharts() {
    const tracks = STATE.data.trackContributions;
    const ctx = $('chart-agent-tracks').getContext('2d');
    const sorted = Object.entries(tracks).sort((a,b)=>b[1]-a[1]).slice(0,10);
    renderChart('chart-agent-tracks', {
        type: 'bar',
        data: {
            labels: sorted.map(s => s[0].substring(0,15)+'...'),
            datasets: [{ label: 'Streams', data: sorted.map(s => s[1]), backgroundColor: '#7b2cbf' }]
        },
        options: { indexAxis: 'y' }
    });
}

async function renderAnnouncements() {
    const data = await api('getAnnouncements', { week: STATE.week });
    $('announcements-content').innerHTML = data.announcements.map(a => `
        <div class="card" style="${a.priority==='high'?'border-left:3px solid var(--danger)':''}">
            <div class="card-body">
                <h3>${safe(a.title)}</h3>
                <p>${safe(a.message)}</p>
                <div style="font-size:10px;color:var(--text-dim);margin-top:5px">${new Date(a.created).toLocaleDateString()}</div>
            </div>
        </div>
    `).join('') || '<p style="text-align:center">No announcements</p>';
}

async function renderDrawer() {
    // Re-use renderProfile badges logic + Winners logic from Summary
    const winners = await api('getWeeklyWinners');
    const myTeam = STATE.data.profile.team;
    const myWins = winners.winners.filter(w => w.team === myTeam);
    
    $('drawer-content').innerHTML = `
        <div class="card"><div class="card-header"><h3>🏆 Team Wins</h3></div><div class="card-body">
            ${myWins.length ? myWins.map(w => `<div style="padding:5px 0;border-bottom:1px solid var(--border)">${w.week} (${fmt(w.teamXP)} XP)</div>`).join('') : 'No wins yet'}
        </div></div>
    `;
}
