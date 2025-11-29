// ===== BTS SPY BATTLE - MATCHED TO GAS BACKEND =====

const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbx5ArHi5Ws0NxMa9nhORy6bZ7ZYpW4urPIap24tax9H1HLuGQxYRCgTVwDaKOMrZ7JOGA/exec',
    
    TEAMS: {
        'Indigo': { color: '#4cc9f0', album: 'Indigo' },
        'Echo': { color: '#f72585', album: 'Echo' },
        'Agust D': { color: '#ff9500', album: 'Agust D' },
        'JITB': { color: '#7209b7', album: 'Jack In The Box' }
    },
    
    // From your GAS TEAM_ALBUM_TRACKS
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
    
    TEAM_PFPS: {
        "Indigo": "https://i.ibb.co/4g9KWg3/team-Indigo.png",
        "Echo": "https://i.ibb.co/xwYRSyx/Team-Echo.png",
        "Agust D": "https://i.ibb.co/BVc11nz9/Team-agustd.png",
        "JITB": "https://i.ibb.co/FbdLFwhv/Team-jitb.png"
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
const teamPfp = team => CONFIG.TEAM_PFPS[team] || '';

function loading(show) {
    const el = $('loading');
    if (el) el.classList.toggle('active', show);
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
        el.textContent = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

// ===== API =====
async function api(action, params = {}) {
    const url = new URL(CONFIG.API_URL);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([k, v]) => {
        if (v != null) url.searchParams.set(k, v);
    });
    
    console.log('📡 API:', action, params);
    
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
        
        if (res.result && res.result.includes('Agent Number is:')) {
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
        // Get available weeks
        const weeksRes = await api('getAvailableWeeks');
        STATE.weeks = weeksRes.weeks || [];
        STATE.week = weeksRes.current || STATE.weeks[0];
        
        if (!STATE.week) throw new Error('No weeks available');
        
        // Get agent data - this returns the full structure from your GAS
        STATE.data = await api('getAgentData', {
            agentNo: STATE.agentNo,
            week: STATE.week
        });
        
        console.log('📦 Agent Data:', STATE.data);
        
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
        const pfp = teamPfp(p.team);
        const initial = (p.name || 'A')[0].toUpperCase();
        
        // Sidebar
        const avatar = $('agent-avatar');
        if (avatar) {
            if (pfp) {
                avatar.innerHTML = `<img src="${pfp}" alt="${p.team}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
            } else {
                avatar.textContent = initial;
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
                pAvatar.innerHTML = `<img src="${pfp}" alt="${p.team}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
            } else {
                pAvatar.textContent = initial;
                pAvatar.style.background = color;
            }
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
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
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
        
        console.log('📊 Summary:', summary);
        console.log('🏆 Rankings:', rankings);
        
        const team = STATE.data?.profile?.team;
        
        // From getWeeklySummary response: teams[team].trackGoalPassed, etc.
        const teamData = summary.teams?.[team] || {};
        
        // Mission status
        setStatus('home-track-status', teamData.trackGoalPassed);
        setStatus('home-album-status', teamData.albumGoalPassed);
        setStatus('home-2x-status', teamData.album2xPassed);
        
        // Top agents from getRankings response: rankings[]
        const rankList = rankings.rankings || [];
        $('home-top-agents').innerHTML = rankList.length ? rankList.slice(0, 5).map((r, i) => `
            <div class="rank-item">
                <div class="rank-num">${r.rank || i + 1}</div>
                <div class="rank-info">
                    <div class="rank-name">${r.name || 'Agent'}</div>
                    <div class="rank-team" style="color:${teamColor(r.team)}">${r.team || 'Team'}</div>
                </div>
                <div class="rank-xp">${fmt(r.totalXP)} XP</div>
            </div>
        `).join('') : '<p style="text-align:center;color:var(--text-dim);">No data available</p>';
        
        // Team standings from getWeeklySummary: teams{}
        const teams = summary.teams || {};
        const teamNames = Object.keys(teams);
        
        $('home-standings').innerHTML = teamNames.length ? `
            <div class="stats-grid">
                ${teamNames.map(t => {
                    const td = teams[t];
                    return `
                        <div class="stat-box" style="border-top: 3px solid ${teamColor(t)}">
                            <div style="color:${teamColor(t)};font-weight:600;margin-bottom:8px;">${t}</div>
                            <div class="stat-value">${fmt(td.teamXP)}</div>
                            <div class="stat-label">Level ${td.level || 0}</div>
                            ${td.isWinner ? '<div style="margin-top:8px;">🏆 Winner</div>' : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        ` : '<p>No team data</p>';
        
    } catch (e) {
        console.error('Home error:', e);
        $('home-top-agents').innerHTML = '<p style="color:var(--danger);">Failed to load</p>';
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
    // Data from getAgentData response
    const stats = STATE.data?.stats || {};
    const profile = STATE.data?.profile || {};
    const rank = STATE.data?.rank;
    const teamRank = STATE.data?.teamRank;
    const trackContributions = STATE.data?.trackContributions || {};
    const albumContributions = STATE.data?.albumContributions || {};
    const album2xStatus = STATE.data?.album2xStatus || {};
    const teamInfo = STATE.data?.teamInfo || {};
    
    console.log('👤 Profile data:', STATE.data);
    
    $('profile-stats').innerHTML = `
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
    
    // Track contributions from getAgentData
    $('profile-tracks').innerHTML = Object.keys(trackContributions).length ? 
        Object.entries(trackContributions)
            .sort((a, b) => b[1] - a[1])
            .map(([t, c]) => `
                <div style="display:flex;justify-content:space-between;padding:12px;background:var(--bg-dark);border-radius:8px;margin-bottom:8px;">
                    <span>${t}</span>
                    <span style="font-weight:600;color:var(--purple-glow);">${fmt(c)}</span>
                </div>
            `).join('') 
    : '<p style="color:var(--text-dim);text-align:center;">No track data yet</p>';
    
    // Album contributions from getAgentData
    $('profile-albums').innerHTML = Object.keys(albumContributions).length ?
        Object.entries(albumContributions)
            .sort((a, b) => b[1] - a[1])
            .map(([a, c]) => `
                <div style="display:flex;justify-content:space-between;padding:12px;background:var(--bg-dark);border-radius:8px;margin-bottom:8px;">
                    <span>${a}</span>
                    <span style="font-weight:600;color:var(--purple-glow);">${fmt(c)}</span>
                </div>
            `).join('')
    : '<p style="color:var(--text-dim);text-align:center;">No album data yet</p>';
    
    // Badges
    try {
        const badgesData = await api('getBadges', { agentNo: STATE.agentNo });
        const badges = badgesData.badges || [];
        
        $('profile-badges').innerHTML = badges.length ? `
            <div style="display:flex;flex-wrap:wrap;gap:16px;">
                ${badges.map(b => `
                    <div style="text-align:center;width:80px;">
                        <div style="width:60px;height:60px;border-radius:50%;background:var(--purple-main);margin:0 auto 8px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                            ${b.imageUrl ? `<img src="${b.imageUrl}" style="width:100%;height:100%;object-fit:cover;">` : '🎖️'}
                        </div>
                        <div style="font-size:11px;color:var(--text-dim);">${b.name || 'Badge'}</div>
                    </div>
                `).join('')}
            </div>
        ` : '<p style="color:var(--text-dim);text-align:center;">No badges earned yet</p>';
    } catch (e) {
        $('profile-badges').innerHTML = '<p style="color:var(--text-dim);text-align:center;">No badges yet</p>';
    }
}

// ===== RANKINGS PAGE =====
async function renderRankings() {
    try {
        const data = await api('getRankings', { week: STATE.week, limit: 100 });
        const list = data.rankings || [];
        
        console.log('🏆 Full rankings:', list);
        
        $('rankings-list').innerHTML = list.length ? list.map((r, i) => {
            const isMe = String(r.agentNo) === String(STATE.agentNo);
            return `
                <div class="rank-item ${isMe ? 'highlight' : ''}">
                    <div class="rank-num">${r.rank || i + 1}</div>
                    <div class="rank-info">
                        <div class="rank-name">${r.name}${isMe ? ' (You)' : ''}</div>
                        <div class="rank-team" style="color:${teamColor(r.team)}">${r.team}</div>
                    </div>
                    <div style="text-align:right;">
                        <div class="rank-xp">${fmt(r.totalXP)} XP</div>
                        <div style="font-size:11px;color:var(--text-dim);">${fmt(r.trackScrobbles + r.albumScrobbles)} streams</div>
                    </div>
                </div>
            `;
        }).join('') : '<p style="text-align:center;color:var(--text-dim);">No rankings available</p>';
        
    } catch (e) {
        $('rankings-list').innerHTML = '<p style="color:var(--danger);">Failed to load rankings</p>';
    }
}

// ===== GOALS PAGE =====
async function renderGoals() {
    try {
        // getGoalsProgress returns: { trackGoals: {}, albumGoals: {} }
        const data = await api('getGoalsProgress', { week: STATE.week });
        const team = STATE.data?.profile?.team;
        
        console.log('🎯 Goals data:', data);
        
        let html = '';
        
        // Track goals: trackGoals[track].goal, trackGoals[track].teams[team].current, etc.
        const trackGoals = data.trackGoals || {};
        if (Object.keys(trackGoals).length) {
            html += '<div class="card"><div class="card-header"><h3>🎵 Track Goals</h3></div><div class="card-body">';
            
            for (const [track, info] of Object.entries(trackGoals)) {
                const teamData = info.teams?.[team] || {};
                const current = teamData.current || 0;
                const goal = info.goal || 100;
                const pct = teamData.percentage || 0;
                const status = teamData.status || 'Behind';
                const done = status === 'Completed';
                
                html += `
                    <div style="margin-bottom:16px;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                            <span>${track}</span>
                            <span style="color:${done ? 'var(--success)' : 'var(--text-dim)'}">${fmt(current)}/${fmt(goal)} ${done ? '✅' : ''}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${Math.min(100, pct)}%;${done ? 'background:var(--success);' : ''}"></div>
                        </div>
                        <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">${status} - ${pct.toFixed(1)}%</div>
                    </div>
                `;
            }
            html += '</div></div>';
        }
        
        // Album goals: albumGoals[album].goal, albumGoals[album].teams[team].current, etc.
        const albumGoals = data.albumGoals || {};
        if (Object.keys(albumGoals).length) {
            html += '<div class="card"><div class="card-header"><h3>💿 Album Goals</h3></div><div class="card-body">';
            
            for (const [album, info] of Object.entries(albumGoals)) {
                const teamData = info.teams?.[team] || {};
                const current = teamData.current || 0;
                const goal = info.goal || 100;
                const pct = teamData.percentage || 0;
                const status = teamData.status || 'Behind';
                const done = status === 'Completed';
                
                html += `
                    <div style="margin-bottom:16px;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                            <span>${album}</span>
                            <span style="color:${done ? 'var(--success)' : 'var(--text-dim)'}">${fmt(current)}/${fmt(goal)} ${done ? '✅' : ''}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${Math.min(100, pct)}%;${done ? 'background:var(--success);' : ''}"></div>
                        </div>
                        <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">${status} - ${pct.toFixed(1)}%</div>
                    </div>
                `;
            }
            html += '</div></div>';
        }
        
        $('goals-content').innerHTML = html || '<div class="card"><div class="card-body"><p style="text-align:center;color:var(--text-dim);">No goals data available</p></div></div>';
        
    } catch (e) {
        console.error('Goals error:', e);
        $('goals-content').innerHTML = '<div class="card"><div class="card-body"><p style="color:var(--danger);">Failed to load goals</p></div></div>';
    }
}

// ===== ALBUM 2X PAGE =====
async function renderAlbum2x() {
    const container = $('album2x-content');
    if (!container) return;
    
    const team = STATE.data?.profile?.team;
    
    // Use album2xStatus from getAgentData which contains:
    // { passed: boolean, tracks: { trackName: count } }
    const album2xStatus = STATE.data?.album2xStatus || {};
    const userTracks = album2xStatus.tracks || {};
    const passed = album2xStatus.passed;
    
    // Get team's album tracks from config
    const teamTracks = CONFIG.TEAM_ALBUM_TRACKS[team] || [];
    
    console.log('💿 Album 2X - Team:', team);
    console.log('💿 Album 2X - User tracks:', userTracks);
    console.log('💿 Album 2X - Team tracks:', teamTracks);
    
    if (teamTracks.length === 0) {
        container.innerHTML = `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:40px;">
                    <div style="font-size:48px;margin-bottom:16px;">💿</div>
                    <h3>Album 2X Mission</h3>
                    <p style="color:var(--text-dim);">No album tracks configured for team ${team}</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Calculate status for each track
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
        <!-- Summary Card -->
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
            <div class="card-header"><h3>💿 ${CONFIG.TEAMS[team]?.album || team} Album Tracks</h3></div>
            <div class="card-body">
                ${trackResults.map(t => `
                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        padding:14px 16px;
                        background:var(--bg-dark);
                        border-radius:10px;
                        margin-bottom:10px;
                        border-left:4px solid ${t.passed ? 'var(--success)' : 'var(--danger)'};
                    ">
                        <span style="flex:1;">${t.name}</span>
                        <span style="color:${t.passed ? 'var(--success)' : 'var(--danger)'};">
                            ${t.count}/2 ${t.passed ? '✅' : '❌'}
                        </span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Team Status -->
        <div class="card">
            <div class="card-header"><h3>👥 Team Album 2X Status</h3></div>
            <div class="card-body" id="team-2x-status">Loading team status...</div>
        </div>
    `;
    
    // Load team 2x status
    try {
        const team2xData = await api('getAlbum2xStatus', { week: STATE.week, team: team });
        const teamStatus = team2xData.teams?.[team] || {};
        const members = teamStatus.members || [];
        
        $('team-2x-status').innerHTML = `
            <div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap;">
                <div style="text-align:center;">
                    <div style="font-size:24px;font-weight:bold;color:var(--success);">${teamStatus.passed || 0}</div>
                    <div style="font-size:12px;color:var(--text-dim);">Completed</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:24px;font-weight:bold;color:var(--danger);">${teamStatus.failed || 0}</div>
                    <div style="font-size:12px;color:var(--text-dim);">Incomplete</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:24px;font-weight:bold;">${teamStatus.totalMembers || 0}</div>
                    <div style="font-size:12px;color:var(--text-dim);">Total Members</div>
                </div>
            </div>
            <div style="max-height:200px;overflow-y:auto;">
                ${members.map(m => `
                    <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg-dark);border-radius:6px;margin-bottom:6px;border-left:3px solid ${m.passed ? 'var(--success)' : 'var(--danger)'};">
                        <span>${m.name}</span>
                        <span>${m.passed ? '✅' : '❌'}</span>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (e) {
        $('team-2x-status').innerHTML = '<p style="color:var(--text-dim);">Could not load team status</p>';
    }
}

// ===== TEAM LEVEL PAGE =====
async function renderTeamLevel() {
    const container = $('team-level-content');
    if (!container) return;
    
    try {
        const summary = await api('getWeeklySummary', { week: STATE.week });
        const teams = summary.teams || {};
        
        console.log('📊 Team levels:', teams);
        
        container.innerHTML = `
            <div class="stats-grid">
                ${Object.entries(teams).map(([t, info]) => `
                    <div class="card" style="border-top:3px solid ${teamColor(t)}">
                        <div class="card-body" style="text-align:center;">
                            ${teamPfp(t) ? `<img src="${teamPfp(t)}" style="width:60px;height:60px;border-radius:50%;margin-bottom:12px;">` : ''}
                            <div style="color:${teamColor(t)};font-weight:600;font-size:18px;margin-bottom:12px;">${t}</div>
                            <div style="font-size:48px;font-weight:700;margin-bottom:8px;">Lv ${info.level || 0}</div>
                            <div style="color:var(--text-dim);">${fmt(info.teamXP)} XP</div>
                            <div style="font-size:12px;color:var(--purple-light);margin-top:8px;">${info.levelEmoji || ''} ${info.levelStatus || ''}</div>
                            
                            <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border);text-align:left;font-size:13px;">
                                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                                    <span>Track Goals</span>
                                    <span>${info.trackGoalPassed ? '✅' : '❌'}</span>
                                </div>
                                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                                    <span>Album Goals</span>
                                    <span>${info.albumGoalPassed ? '✅' : '❌'}</span>
                                </div>
                                <div style="display:flex;justify-content:space-between;">
                                    <span>Album 2X</span>
                                    <span>${info.album2xPassed ? '✅' : '❌'}</span>
                                </div>
                            </div>
                            
                            ${info.isWinner ? '<div style="margin-top:12px;font-size:24px;">🏆</div>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
    } catch (e) {
        console.error('Team level error:', e);
        container.innerHTML = '<div class="card"><div class="card-body"><p style="color:var(--danger);">Failed to load team levels</p></div></div>';
    }
}

// ===== TEAM CHARTS PAGE =====
async function renderTeamCharts() {
    try {
        const team = STATE.data?.profile?.team;
        
        // Get team chart data
        const chartData = await api('getTeamChartData', { team: team });
        console.log('📈 Team chart data:', chartData);
        
        // Also get current summary for bar chart
        const summary = await api('getWeeklySummary', { week: STATE.week });
        const teams = summary.teams || {};
        const teamNames = Object.keys(teams);
        
        // Destroy existing charts
        if (STATE.charts.teamXP) STATE.charts.teamXP.destroy();
        if (STATE.charts.teamLevels) STATE.charts.teamLevels.destroy();
        
        // Team XP Bar Chart (all teams comparison)
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
        
        // Your team's XP over weeks (line chart)
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

// ===== AGENT CHARTS PAGE =====
async function renderAgentCharts() {
    try {
        const chartData = await api('getAgentChartData', { agentNo: STATE.agentNo });
        console.log('📈 Agent chart data:', chartData);
        
        const trackContributions = STATE.data?.trackContributions || {};
        const albumContributions = STATE.data?.albumContributions || {};
        
        // Destroy existing
        if (STATE.charts.agentTracks) STATE.charts.agentTracks.destroy();
        if (STATE.charts.agentAlbums) STATE.charts.agentAlbums.destroy();
        
        // Track contributions bar chart
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
                    indexAxis: 'y',
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { beginAtZero: true, ticks: { color: '#888' }, grid: { color: '#2a2a4a' } },
                        y: { ticks: { color: '#888' }, grid: { display: false } }
                    }
                }
            });
        }
        
        // Album pie chart
        const ctx2 = $('chart-agent-albums')?.getContext('2d');
        if (ctx2 && Object.keys(albumContributions).length) {
            STATE.charts.agentAlbums = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(albumContributions),
                    datasets: [{
                        data: Object.values(albumContributions),
                        backgroundColor: ['#7b2cbf', '#9d4edd', '#c77dff', '#4cc9f0', '#f72585', '#ff9500']
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
        console.error('Agent charts error:', e);
    }
}

// ===== COMPARISON PAGE =====
async function renderComparison() {
    try {
        const data = await api('getTeamComparison', { week: STATE.week });
        const comparison = data.comparison || [];
        
        console.log('⚔️ Comparison data:', data);
        
        $('comparison-content').innerHTML = `
            <div class="card">
                <div class="card-body">
                    <div style="overflow-x:auto;">
                        <table style="width:100%;border-collapse:collapse;min-width:500px;">
                            <thead>
                                <tr style="border-bottom:2px solid var(--border);">
                                    <th style="padding:12px;text-align:left;">Team</th>
                                    <th style="padding:12px;text-align:right;">XP</th>
                                    <th style="padding:12px;text-align:right;">Level</th>
                                    <th style="padding:12px;text-align:center;">Tracks</th>
                                    <th style="padding:12px;text-align:center;">Albums</th>
                                    <th style="padding:12px;text-align:center;">2X</th>
                                    <th style="padding:12px;text-align:center;">Winner</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${comparison.map(t => `
                                    <tr style="border-bottom:1px solid var(--border);">
                                        <td style="padding:12px;">
                                            <div style="display:flex;align-items:center;gap:10px;">
                                                ${t.pfp ? `<img src="${t.pfp}" style="width:32px;height:32px;border-radius:50%;">` : ''}
                                                <span style="color:${teamColor(t.team)};font-weight:600;">${t.team}</span>
                                            </div>
                                        </td>
                                        <td style="padding:12px;text-align:right;font-weight:600;">${fmt(t.teamXP)}</td>
                                        <td style="padding:12px;text-align:right;">${t.level}</td>
                                        <td style="padding:12px;text-align:center;">${t.missions?.tracks ? '✅' : '❌'}</td>
                                        <td style="padding:12px;text-align:center;">${t.missions?.albums ? '✅' : '❌'}</td>
                                        <td style="padding:12px;text-align:center;">${t.missions?.album2x ? '✅' : '❌'}</td>
                                        <td style="padding:12px;text-align:center;">${t.winner ? '🏆' : ''}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
    } catch (e) {
        $('comparison-content').innerHTML = '<div class="card"><div class="card-body"><p style="color:var(--danger);">Failed to load comparison</p></div></div>';
    }
}

// ===== SUMMARY PAGE =====
async function renderSummary() {
    const now = new Date();
    const day = now.getDay();
    
    // Lock on non-Sunday (0 = Sunday)
    if (day !== 0) {
        $('summary-content').innerHTML = `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:60px 20px;">
                    <div style="font-size:64px;margin-bottom:20px;">🔒</div>
                    <h2 style="margin-bottom:12px;">Summary Locked</h2>
                    <p style="color:var(--text-dim);">Weekly summary unlocks on <strong>Sunday at 12:00 AM</strong>.</p>
                    <p style="color:var(--purple-light);margin-top:16px;">This week's battle ends Saturday 11:55 PM</p>
                    <div style="margin-top:24px;padding:16px;background:var(--bg-dark);border-radius:12px;">
                        <p style="font-size:14px;color:var(--text-dim);">⏳ Calculating results...</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    try {
        const summary = await api('getWeeklySummary', { week: STATE.week });
        const teams = summary.teams || {};
        const winner = summary.winner;
        
        // Get weekly winners history
        let winnersData = { winners: [] };
        try {
            winnersData = await api('getWeeklyWinners');
        } catch (e) {}
        
        $('summary-content').innerHTML = `
            ${winner ? `
                <div class="card" style="background:linear-gradient(135deg, ${teamColor(winner)}22, var(--bg-card));border:2px solid ${teamColor(winner)};">
                    <div class="card-body" style="text-align:center;padding:40px;">
                        <div style="font-size:72px;margin-bottom:16px;">🏆</div>
                        <h2 style="color:${teamColor(winner)};font-size:28px;margin-bottom:12px;">${winner} WINS!</h2>
                        <p style="font-size:24px;">${fmt(teams[winner]?.teamXP)} XP</p>
                    </div>
                </div>
            ` : ''}
            
            <div class="card">
                <div class="card-header"><h3>📊 Final Standings</h3></div>
                <div class="card-body">
                    <div class="stats-grid">
                        ${Object.entries(teams).sort((a, b) => b[1].teamXP - a[1].teamXP).map(([t, info]) => `
                            <div class="stat-box" style="border-top:3px solid ${teamColor(t)}">
                                <div style="color:${teamColor(t)};font-weight:600;">${t}</div>
                                <div class="stat-value">${fmt(info.teamXP)}</div>
                                <div class="stat-label">Level ${info.level}</div>
                                ${info.isWinner ? '<div style="margin-top:8px;">🏆</div>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            ${winnersData.winners?.length ? `
                <div class="card">
                    <div class="card-header"><h3>🏆 All Week Winners</h3></div>
                    <div class="card-body">
                        ${winnersData.winners.map(w => `
                            <div style="display:flex;justify-content:space-between;padding:12px;background:var(--bg-dark);border-radius:8px;margin-bottom:8px;border-left:3px solid ${teamColor(w.team)};">
                                <span>${w.week}</span>
                                <span style="color:${teamColor(w.team)};font-weight:600;">${w.team} - ${fmt(w.teamXP)} XP</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
        
    } catch (e) {
        $('summary-content').innerHTML = '<div class="card"><div class="card-body"><p style="color:var(--danger);">Failed to load summary</p></div></div>';
    }
}

// ===== DRAWER PAGE =====
async function renderDrawer() {
    const container = $('drawer-content');
    if (!container) return;
    
    try {
        // getBadges returns: { agentNo, badges: [{type, name, imageUrl, weekEarned, description}] }
        const badgesData = await api('getBadges', { agentNo: STATE.agentNo });
        const badges = badgesData.badges || [];
        
        // Get weekly winners for team wins
        let winnersHtml = '';
        try {
            const winnersData = await api('getWeeklyWinners');
            const winners = winnersData.winners || [];
            const myTeam = STATE.data?.profile?.team;
            const myWins = winners.filter(w => w.team === myTeam);
            
            if (myWins.length > 0) {
                winnersHtml = `
                    <div class="card">
                        <div class="card-header"><h3>🏆 Team Wins</h3></div>
                        <div class="card-body">
                            ${myWins.map(w => `
                                <div style="padding:14px;background:var(--bg-dark);border-radius:10px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;border-left:3px solid var(--success);">
                                    <span style="font-weight:600;">${w.week}</span>
                                    <div style="text-align:right;">
                                        <span style="color:var(--success);">🏆 Winner</span>
                                        <div style="font-size:12px;color:var(--text-dim);">${fmt(w.teamXP)} XP</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        } catch (e) {}
        
        container.innerHTML = `
            <div class="card">
                <div class="card-header"><h3>🎖️ My Badges</h3></div>
                <div class="card-body">
                    ${badges.length ? `
                        <div style="display:flex;flex-wrap:wrap;gap:20px;justify-content:center;">
                            ${badges.map(b => `
                                <div style="text-align:center;width:100px;">
                                    <div style="width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg, var(--purple-main), var(--purple-glow));margin:0 auto 10px;display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 0 25px rgba(123,44,191,0.5);">
                                        ${b.imageUrl ? `<img src="${b.imageUrl}" style="width:100%;height:100%;object-fit:cover;">` : '<span style="font-size:32px;">🎖️</span>'}
                                    </div>
                                    <div style="font-size:12px;font-weight:600;">${b.name}</div>
                                    <div style="font-size:10px;color:var(--text-dim);">${b.weekEarned || ''}</div>
                                    ${b.description ? `<div style="font-size:10px;color:var(--purple-light);margin-top:4px;">${b.description}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div style="text-align:center;padding:40px;">
                            <div style="font-size:48px;margin-bottom:16px;">🎖️</div>
                            <p style="color:var(--text-dim);">Complete missions to earn badges!</p>
                        </div>
                    `}
                </div>
            </div>
            
            ${winnersHtml}
        `;
        
    } catch (e) {
        console.error('Drawer error:', e);
        container.innerHTML = '<div class="card"><div class="card-body"><p style="color:var(--danger);">Failed to load drawer</p></div></div>';
    }
}

// ===== ANNOUNCEMENTS PAGE =====
async function renderAnnouncements() {
    try {
        // getAnnouncements returns: { week, announcements: [{id, week, title, message, priority, created}] }
        const data = await api('getAnnouncements', { week: STATE.week });
        const list = data.announcements || [];
        
        console.log('📢 Announcements:', data);
        
        $('announcements-content').innerHTML = list.length ? list.map(a => `
            <div class="card" style="${a.priority === 'high' ? 'border-left:3px solid var(--danger);' : ''}">
                <div class="card-body">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <span style="font-size:11px;color:var(--purple-light);">${a.created ? new Date(a.created).toLocaleDateString() : ''}</span>
                        ${a.priority === 'high' ? '<span style="font-size:10px;background:var(--danger);color:white;padding:2px 8px;border-radius:4px;">IMPORTANT</span>' : ''}
                    </div>
                    <h3 style="margin-bottom:12px;">${a.title}</h3>
                    <p style="color:var(--text-dim);line-height:1.6;">${a.message}</p>
                    ${a.week !== 'all' ? `<div style="font-size:11px;color:var(--text-dim);margin-top:12px;">Week: ${a.week}</div>` : ''}
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
        $('announcements-content').innerHTML = '<div class="card"><div class="card-body"><p style="color:var(--danger);">Failed to load announcements</p></div></div>';
    }
}

// ===== START =====
document.addEventListener('DOMContentLoaded', initApp);
