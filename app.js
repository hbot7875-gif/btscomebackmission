// ===== BTS SPY BATTLE - FIXED FOR YOUR GAS BACKEND =====

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
    
    console.log('📡 API:', action, params);
    
    try {
        const res = await fetch(url);
        const text = await res.text();
        
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('JSON parse error:', text.substring(0, 200));
            throw new Error('Invalid JSON response');
        }
        
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
        
        if (res.result && !res.result.includes('not found') && !res.result.includes('No agent')) {
            const match = res.result.match(/\d+/);
            if (match) {
                $('agent-input').value = match[0];
            }
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
    console.log('🏠 Loading dashboard...');
    loading(true);
    
    try {
        // Get available weeks
        const weeksRes = await api('getAvailableWeeks');
        STATE.weeks = weeksRes.weeks || [];
        STATE.week = weeksRes.current || STATE.weeks[0];
        
        if (!STATE.week) throw new Error('No weeks available');
        
        // Get agent data
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
        const teamData = summary.teams?.[team] || summary[team] || {};
        
        // Mission status
        setStatus('home-track-status', teamData.trackGoalPassed);
        setStatus('home-album-status', teamData.albumGoalPassed);
        setStatus('home-2x-status', teamData.album2xPassed);
        
        // Top agents
        const list = rankings.rankings || rankings.data || [];
        $('home-top-agents').innerHTML = list.length ? list.slice(0, 5).map((r, i) => `
            <div class="rank-item">
                <div class="rank-num">${i + 1}</div>
                <div class="rank-info">
                    <div class="rank-name">${r.name || r.agentName || 'Agent'}</div>
                    <div class="rank-team" style="color:${teamColor(r.team)}">${r.team || 'Team'}</div>
                </div>
                <div class="rank-xp">${fmt(r.totalXP || r.xp || 0)} XP</div>
            </div>
        `).join('') : '<p style="text-align:center;color:var(--text-dim);">No data available</p>';
        
        // Team standings
        const teams = summary.teams || summary;
        const teamNames = ['Indigo', 'Echo', 'Agust D', 'JITB'];
        
        $('home-standings').innerHTML = `
            <div class="stats-grid">
                ${teamNames.filter(t => teams[t]).map(t => `
                    <div class="stat-box" style="border-top: 3px solid ${teamColor(t)}">
                        <div style="color:${teamColor(t)};font-weight:600;margin-bottom:8px;">${t}</div>
                        <div class="stat-value">${fmt(teams[t].teamXP || teams[t].totalXP || teams[t].xp || 0)}</div>
                        <div class="stat-label">Level ${teams[t].level || 0}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
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
    const s = STATE.data?.stats || {};
    const p = STATE.data?.profile || {};
    
    console.log('👤 Profile stats:', s);
    
    $('profile-stats').innerHTML = `
        <div class="stat-box">
            <div class="stat-value">${fmt(s.totalXP || 0)}</div>
            <div class="stat-label">Total XP</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">#${s.rank || s.globalRank || 'N/A'}</div>
            <div class="stat-label">Global Rank</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${fmt(s.totalStreams || s.scrobbles || 0)}</div>
            <div class="stat-label">Streams</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${s.level || 1}</div>
            <div class="stat-label">Level</div>
        </div>
    `;
    
    // Tracks
    const tracks = s.tracks || s.trackStreams || {};
    $('profile-tracks').innerHTML = Object.keys(tracks).length ? 
        Object.entries(tracks).sort((a, b) => b[1] - a[1]).map(([t, c]) => `
            <div style="display:flex;justify-content:space-between;padding:12px;background:var(--bg-dark);border-radius:8px;margin-bottom:8px;">
                <span>${t}</span>
                <span style="font-weight:600;color:var(--purple-glow);">${fmt(c)}</span>
            </div>
        `).join('') 
    : '<p style="color:var(--text-dim);text-align:center;">No track data yet</p>';
    
    // Albums
    const albums = s.albums || s.albumStreams || {};
    $('profile-albums').innerHTML = Object.keys(albums).length ?
        Object.entries(albums).sort((a, b) => b[1] - a[1]).map(([a, c]) => `
            <div style="display:flex;justify-content:space-between;padding:12px;background:var(--bg-dark);border-radius:8px;margin-bottom:8px;">
                <span>${a}</span>
                <span style="font-weight:600;color:var(--purple-glow);">${fmt(c)}</span>
            </div>
        `).join('')
    : '<p style="color:var(--text-dim);text-align:center;">No album data yet</p>';
    
    // Badges - Use correct API endpoint
    try {
        const badgesData = await api('getBadges', { agentNo: STATE.agentNo });
        const badges = badgesData.badges || [];
        
        $('profile-badges').innerHTML = badges.length ? `
            <div style="display:flex;flex-wrap:wrap;gap:16px;">
                ${badges.map(b => `
                    <div style="text-align:center;width:80px;">
                        <div style="width:60px;height:60px;border-radius:50%;background:var(--purple-main);margin:0 auto 8px;display:flex;align-items:center;justify-content:center;font-size:24px;">
                            ${b.icon || '🎖️'}
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
        const list = data.rankings || data.data || [];
        
        console.log('🏆 Full rankings:', list);
        
        $('rankings-list').innerHTML = list.length ? list.map((r, i) => {
            const isMe = String(r.agentNo) === String(STATE.agentNo);
            return `
                <div class="rank-item ${isMe ? 'highlight' : ''}">
                    <div class="rank-num">${i + 1}</div>
                    <div class="rank-info">
                        <div class="rank-name">${r.name || r.agentName || 'Agent'}${isMe ? ' (You)' : ''}</div>
                        <div class="rank-team" style="color:${teamColor(r.team)}">${r.team || 'Team'}</div>
                    </div>
                    <div class="rank-xp">${fmt(r.totalXP || r.xp || 0)} XP</div>
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
        const data = await api('getGoalsProgress', { week: STATE.week });
        const team = STATE.data?.profile?.team;
        
        console.log('🎯 Goals data:', data);
        
        let html = '';
        
        // Track goals
        const trackGoals = data.trackGoals || data.tracks || {};
        if (Object.keys(trackGoals).length) {
            html += '<div class="card"><div class="card-header"><h3>🎵 Track Goals</h3></div><div class="card-body">';
            
            for (const [track, info] of Object.entries(trackGoals)) {
                const current = info.teams?.[team]?.current || info.current || 0;
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
                const current = info.teams?.[team]?.current || info.current || 0;
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
        
        $('goals-content').innerHTML = html || '<div class="card"><div class="card-body"><p style="text-align:center;color:var(--text-dim);">No goals data available</p></div></div>';
        
    } catch (e) {
        console.error('Goals error:', e);
        $('goals-content').innerHTML = '<div class="card"><div class="card-body"><p style="color:var(--danger);">Failed to load goals</p></div></div>';
    }
}

// ===== ALBUM 2X PAGE - FIXED =====
async function renderAlbum2x() {
    const container = $('album2x-content');
    if (!container) return;
    
    const team = STATE.data?.profile?.team;
    const s = STATE.data?.stats || {};
    
    console.log('💿 Album 2X - Team:', team);
    console.log('💿 Album 2X - Stats:', s);
    
    try {
        // FIXED: Use correct API endpoint name with team parameter
        const data = await api('getAlbum2xStatus', { 
            week: STATE.week, 
            team: team 
        });
        
        console.log('💿 Album 2X API Response:', data);
        
        // Handle different response formats
        let tracks = [];
        let members = [];
        
        if (data.tracks) {
            tracks = data.tracks;
        } else if (data.albums) {
            tracks = data.albums;
        } else if (Array.isArray(data)) {
            tracks = data;
        }
        
        if (data.members) {
            members = data.members;
        } else if (data.agents) {
            members = data.agents;
        }
        
        // Get user's track data
        const userTracks = s.tracks || s.trackStreams || s.album2x || {};
        
        console.log('💿 Tracks to check:', tracks);
        console.log('💿 User tracks:', userTracks);
        
        // If we have member-level data from API
        if (members.length > 0) {
            // Find current user in members
            const myData = members.find(m => 
                String(m.agentNo) === String(STATE.agentNo) ||
                String(m.id) === String(STATE.agentNo)
            );
            
            console.log('💿 My data from API:', myData);
            
            if (myData) {
                const completed = myData.completed || myData.passed || myData.tracksCompleted || 0;
                const total = myData.total || myData.totalTracks || tracks.length || 0;
                const trackStatus = myData.tracks || myData.trackStatus || [];
                
                container.innerHTML = `
                    <div class="card" style="border: 2px solid ${completed === total ? 'var(--success)' : 'var(--purple-main)'};">
                        <div class="card-body" style="text-align:center;padding:30px;">
                            <div style="font-size:56px;margin-bottom:16px;">${completed === total ? '🎉' : '⏳'}</div>
                            <div style="font-size:32px;font-weight:700;color:${completed === total ? 'var(--success)' : 'var(--purple-glow)'};">
                                ${completed} / ${total}
                            </div>
                            <p style="color:var(--text-dim);margin:12px 0;">Tracks Completed</p>
                            <div style="background:var(--bg-dark);border-radius:10px;height:16px;overflow:hidden;margin:20px auto;max-width:300px;">
                                <div style="background:${completed === total ? 'var(--success)' : 'var(--purple-main)'};height:100%;width:${total > 0 ? (completed/total*100) : 0}%;"></div>
                            </div>
                        </div>
                    </div>
                    
                    ${trackStatus.length > 0 ? `
                        <div class="card">
                            <div class="card-header"><h3>💿 Track Status</h3></div>
                            <div class="card-body">
                                ${trackStatus.map(t => `
                                    <div style="display:flex;justify-content:space-between;padding:14px;background:var(--bg-dark);border-radius:10px;margin-bottom:10px;border-left:4px solid ${t.passed ? 'var(--success)' : 'var(--danger)'};">
                                        <span>${t.name || t.track}</span>
                                        <span style="color:${t.passed ? 'var(--success)' : 'var(--danger)'};">
                                            ${t.count || 0}/2 ${t.passed ? '✅' : '❌'}
                                        </span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                `;
                return;
            }
        }
        
        // Fallback: Use tracks list and user's stream data
        if (tracks.length > 0) {
            let completed = 0;
            let trackResults = [];
            
            tracks.forEach(t => {
                const trackName = typeof t === 'string' ? t : (t.name || t.track || t.title);
                let count = 0;
                
                // Try to find stream count
                if (userTracks[trackName] !== undefined) {
                    count = Number(userTracks[trackName]) || 0;
                } else {
                    // Try partial match
                    for (const [key, val] of Object.entries(userTracks)) {
                        if (key.toLowerCase().includes(trackName.toLowerCase()) || 
                            trackName.toLowerCase().includes(key.toLowerCase())) {
                            count = Number(val) || 0;
                            break;
                        }
                    }
                }
                
                const passed = count >= 2;
                if (passed) completed++;
                
                trackResults.push({ name: trackName, count, passed });
            });
            
            const total = trackResults.length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            
            container.innerHTML = `
                <div class="card" style="border: 2px solid ${completed === total ? 'var(--success)' : 'var(--purple-main)'};">
                    <div class="card-body" style="text-align:center;padding:30px;">
                        <div style="font-size:56px;margin-bottom:16px;">${completed === total ? '🎉' : '⏳'}</div>
                        <div style="font-size:32px;font-weight:700;color:${completed === total ? 'var(--success)' : 'var(--purple-glow)'};">
                            ${completed} / ${total}
                        </div>
                        <p style="color:var(--text-dim);margin:12px 0;">Tracks Completed (2+ streams each)</p>
                        <div style="background:var(--bg-dark);border-radius:10px;height:16px;overflow:hidden;margin:20px auto;max-width:300px;">
                            <div style="background:${completed === total ? 'var(--success)' : 'linear-gradient(90deg, var(--purple-main), var(--purple-glow))'};height:100%;width:${pct}%;"></div>
                        </div>
                        <p style="color:${completed === total ? 'var(--success)' : 'var(--purple-light)'};">
                            ${completed === total ? 'Mission Complete!' : `${pct}% Complete`}
                        </p>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header"><h3>💿 ${CONFIG.TEAMS[team]?.album || team} - Track Status</h3></div>
                    <div class="card-body">
                        ${trackResults.map(t => `
                            <div style="display:flex;justify-content:space-between;padding:14px;background:var(--bg-dark);border-radius:10px;margin-bottom:10px;border-left:4px solid ${t.passed ? 'var(--success)' : 'var(--danger)'};">
                                <span>${t.name}</span>
                                <span style="color:${t.passed ? 'var(--success)' : 'var(--danger)'};">
                                    ${t.count}/2 ${t.passed ? '✅' : '❌'}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            return;
        }
        
        // No data available
        container.innerHTML = `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:40px;">
                    <div style="font-size:48px;margin-bottom:16px;">💿</div>
                    <h3 style="margin-bottom:12px;">Album 2X Mission</h3>
                    <p style="color:var(--text-dim);">
                        Stream each track in your team album at least 2 times.
                    </p>
                    <p style="color:var(--purple-light);margin-top:12px;">
                        Team: ${team} | Album: ${CONFIG.TEAMS[team]?.album || 'Unknown'}
                    </p>
                </div>
            </div>
        `;
        
    } catch (e) {
        console.error('❌ Album 2X Error:', e);
        container.innerHTML = `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:40px;">
                    <div style="font-size:48px;margin-bottom:16px;">⚠️</div>
                    <p style="color:var(--danger);">Failed to load: ${e.message}</p>
                    <button onclick="renderAlbum2x()" style="margin-top:20px;padding:12px 24px;background:var(--purple-main);border:none;border-radius:8px;color:white;cursor:pointer;">Retry</button>
                </div>
            </div>
        `;
    }
}

// ===== TEAM LEVEL PAGE - FIXED =====
async function renderTeamLevel() {
    const container = $('team-level-content');
    if (!container) return;
    
    try {
        // Use getWeeklySummary which has team data
        const data = await api('getWeeklySummary', { week: STATE.week });
        const teams = data.teams || data;
        const teamNames = ['Indigo', 'Echo', 'Agust D', 'JITB'];
        
        console.log('📊 Team levels data:', teams);
        
        container.innerHTML = `
            <div class="stats-grid">
                ${teamNames.filter(t => teams[t]).map(t => {
                    const info = teams[t];
                    const progress = info.levelProgress || info.progress || 0;
                    
                    return `
                        <div class="card" style="border-top:3px solid ${teamColor(t)}">
                            <div class="card-body" style="text-align:center;">
                                <div style="color:${teamColor(t)};font-weight:600;font-size:18px;margin-bottom:12px;">${t}</div>
                                <div style="font-size:48px;font-weight:700;margin-bottom:8px;">Lv ${info.level || 0}</div>
                                <div style="color:var(--text-dim);">${fmt(info.teamXP || info.xp || 0)} XP</div>
                                <div class="progress-bar" style="margin-top:16px;">
                                    <div class="progress-fill" style="width:${progress}%;background:${teamColor(t)};"></div>
                                </div>
                                <div style="font-size:11px;margin-top:8px;color:var(--text-dim);">${progress}% to next level</div>
                                
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
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
    } catch (e) {
        console.error('Team level error:', e);
        container.innerHTML = '<div class="card"><div class="card-body"><p style="color:var(--danger);">Failed to load team levels</p></div></div>';
    }
}

// ===== TEAM CHARTS - FIXED =====
async function renderTeamCharts() {
    try {
        const summary = await api('getWeeklySummary', { week: STATE.week });
        const teams = summary.teams || summary;
        const teamNames = ['Indigo', 'Echo', 'Agust D', 'JITB'].filter(t => teams[t]);
        
        // Destroy existing charts
        if (STATE.charts.teamXP) STATE.charts.teamXP.destroy();
        if (STATE.charts.teamLevels) STATE.charts.teamLevels.destroy();
        
        // Team XP Bar Chart
        const ctx1 = $('chart-team-xp')?.getContext('2d');
        if (ctx1) {
            STATE.charts.teamXP = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: teamNames,
                    datasets: [{
                        label: 'Team XP',
                        data: teamNames.map(t => teams[t].teamXP || teams[t].xp || 0),
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
        
        // Team Levels Doughnut
        const ctx2 = $('chart-team-levels')?.getContext('2d');
        if (ctx2) {
            STATE.charts.teamLevels = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: teamNames,
                    datasets: [{
                        data: teamNames.map(t => teams[t].level || 0),
                        backgroundColor: teamNames.map(t => teamColor(t))
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#e0e0f0' } },
                        title: { display: true, text: 'Team Levels', color: '#c77dff' }
                    }
                }
            });
        }
        
    } catch (e) {
        console.error('Team charts error:', e);
    }
}

// ===== AGENT CHARTS - FIXED =====
async function renderAgentCharts() {
    try {
        // Use correct API endpoint
        const chartData = await api('getAgentChartData', { agentNo: STATE.agentNo });
        console.log('📈 Agent chart data:', chartData);
        
        const s = STATE.data?.stats || {};
        const tracks = chartData.tracks || s.tracks || s.trackStreams || {};
        const albums = chartData.albums || s.albums || s.albumStreams || {};
        
        // Destroy existing
        if (STATE.charts.agentTracks) STATE.charts.agentTracks.destroy();
        if (STATE.charts.agentAlbums) STATE.charts.agentAlbums.destroy();
        
        // Track chart
        const ctx1 = $('chart-agent-tracks')?.getContext('2d');
        if (ctx1 && Object.keys(tracks).length) {
            const sorted = Object.entries(tracks).sort((a, b) => b[1] - a[1]).slice(0, 10);
            
            STATE.charts.agentTracks = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: sorted.map(([k]) => k.length > 20 ? k.substring(0, 20) + '...' : k),
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
        
        // Album chart
        const ctx2 = $('chart-agent-albums')?.getContext('2d');
        if (ctx2 && Object.keys(albums).length) {
            STATE.charts.agentAlbums = new Chart(ctx2, {
                type: 'pie',
                data: {
                    labels: Object.keys(albums),
                    datasets: [{
                        data: Object.values(albums),
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
        const teams = data.teams || data;
        const teamNames = ['Indigo', 'Echo', 'Agust D', 'JITB'];
        
        console.log('⚔️ Comparison data:', data);
        
        $('comparison-content').innerHTML = `
            <div class="card">
                <div class="card-body">
                    <div style="overflow-x:auto;">
                        <table style="width:100%;border-collapse:collapse;min-width:400px;">
                            <thead>
                                <tr style="border-bottom:2px solid var(--border);">
                                    <th style="padding:12px;text-align:left;">Team</th>
                                    <th style="padding:12px;text-align:right;">XP</th>
                                    <th style="padding:12px;text-align:right;">Level</th>
                                    <th style="padding:12px;text-align:right;">Members</th>
                                    <th style="padding:12px;text-align:center;">2X Done</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${teamNames.filter(t => teams[t]).map(t => {
                                    const info = teams[t];
                                    return `
                                        <tr style="border-bottom:1px solid var(--border);">
                                            <td style="padding:12px;color:${teamColor(t)};font-weight:600;">${t}</td>
                                            <td style="padding:12px;text-align:right;">${fmt(info.totalXP || info.teamXP || 0)}</td>
                                            <td style="padding:12px;text-align:right;">${info.level || 0}</td>
                                            <td style="padding:12px;text-align:right;">${info.members || info.memberCount || 0}</td>
                                            <td style="padding:12px;text-align:center;">${info.completed2x || 0}/${info.members || 0}</td>
                                        </tr>
                                    `;
                                }).join('')}
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
                    <p style="color:var(--text-dim);">Weekly summary unlocks on Sunday at midnight.</p>
                    <p style="color:var(--purple-light);margin-top:16px;">Battle ends Saturday 11:55 PM</p>
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
        
        // Get weekly winners
        let weeklyWinners = [];
        try {
            const winnersData = await api('getWeeklyWinners');
            weeklyWinners = winnersData.winners || [];
        } catch (e) {}
        
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
            
            <div class="card">
                <div class="card-header"><h3>📊 Final Standings</h3></div>
                <div class="card-body">
                    <div class="stats-grid">
                        ${teamNames.filter(t => teams[t]).map(t => `
                            <div class="stat-box" style="border-top:3px solid ${teamColor(t)}">
                                <div style="color:${teamColor(t)};font-weight:600;">${t}</div>
                                <div class="stat-value">${fmt(teams[t].teamXP || teams[t].xp || 0)}</div>
                                <div class="stat-label">Level ${teams[t].level || 0}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            ${weeklyWinners.length > 0 ? `
                <div class="card">
                    <div class="card-header"><h3>🏆 All Week Winners</h3></div>
                    <div class="card-body">
                        ${weeklyWinners.map(w => `
                            <div style="display:flex;justify-content:space-between;padding:12px;background:var(--bg-dark);border-radius:8px;margin-bottom:8px;">
                                <span>${w.week}</span>
                                <span style="color:${teamColor(w.team)};font-weight:600;">${w.team}</span>
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

// ===== DRAWER PAGE - FIXED =====
async function renderDrawer() {
    const container = $('drawer-content');
    if (!container) return;
    
    try {
        // Use correct API endpoint
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
                        <div class="card-header"><h3>🏆 Team Wins</h3></div>
                        <div class="card-body">
                            ${myWins.map(w => `
                                <div style="padding:12px;background:var(--bg-dark);border-radius:8px;margin-bottom:8px;display:flex;justify-content:space-between;">
                                    <span>${w.week}</span>
                                    <span style="color:var(--success);">🏆 Winner</span>
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
                                    <div style="width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg, var(--purple-main), var(--purple-glow));margin:0 auto 10px;display:flex;align-items:center;justify-content:center;font-size:32px;box-shadow:0 0 25px rgba(123,44,191,0.5);">
                                        ${b.icon || '🎖️'}
                                    </div>
                                    <div style="font-size:12px;font-weight:600;">${b.name || 'Badge'}</div>
                                    <div style="font-size:10px;color:var(--text-dim);">${b.date || ''}</div>
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
        const data = await api('getAnnouncements', { week: STATE.week });
        const list = data.announcements || [];
        
        console.log('📢 Announcements:', data);
        
        $('announcements-content').innerHTML = list.length ? list.map(a => `
            <div class="card">
                <div class="card-body">
                    <div style="font-size:11px;color:var(--purple-light);margin-bottom:8px;">${a.date || a.timestamp || ''}</div>
                    <h3 style="margin-bottom:12px;">${a.title || 'Announcement'}</h3>
                    <p style="color:var(--text-dim);line-height:1.6;">${a.content || a.message || ''}</p>
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
