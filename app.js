// ===== BTS SPY BATTLE - COMPLETE APP.JS v5.0 (Full Features) =====

// ==================== CONFIGURATION ====================
const CONFIG = {
    // YOUR GOOGLE SCRIPT URL
    API_URL: 'https://script.google.com/macros/s/AKfycbx5ArHi5Ws0NxMa9nhORy6bZ7ZYpW4urPIap24tax9H1HLuGQxYRCgTVwDaKOMrZ7JOGA/exec',
    
    // Admin Settings
    ADMIN_AGENT_NO: 'AGENT001',
    ADMIN_PASSWORD: 'BTSSPYADMIN2024', 
    
    // End Dates (YYYY-MM-DD)
    WEEK_DATES: {
        'Test Week 1': '2025-11-29',
        'Test Week 2': '2025-12-06',
        'Week 1': '2025-12-13',
        'Week 2': '2025-12-20',
        'Week 3': '2025-12-27',
        'Week 4': '2026-01-03'
    },
    
    // Chat Settings
    CHAT_CHANNEL: 'bts-comeback-mission-hq', 

    // ===== BADGE CONFIGURATION =====
    BADGE_REPO_URL: 'https://raw.githubusercontent.com/hbot7875-gif/btscomebackmission/main/lvl1badges/',
    TOTAL_BADGE_IMAGES: 49,
    EXCLUDE_BADGES: [], // Add badge numbers to exclude: [5, 12, 23]
    
    get BADGE_POOL() {
        const pool = [];
        for (let i = 1; i <= this.TOTAL_BADGE_IMAGES; i++) {
            if (!this.EXCLUDE_BADGES.includes(i)) {
                pool.push(`${this.BADGE_REPO_URL}BTS%20(${i}).jpg`);
            }
        }
        return pool;
    },
    
    TEAMS: {
        'Indigo': { color: '#FFE082', album: 'Indigo' },   
        'Echo': { color: '#FAFAFA', album: 'Echo' },       
        'Agust D': { color: '#B0BEC5', album: 'Agust D' }, 
        'JITB': { color: '#FF4081', album: 'Jack In The Box' }
    },
    
    TEAM_ALBUM_TRACKS: {
        "Indigo": ["Yun (with Erykah Badu)", "Still Life (with Anderson .Paak)", "All Day (with Tablo)", "Forg_tful (with Kim Sawol)", "Closer (with Paul Blanco, Mahalia)", "Change pt.2", "Lonely", "Hectic (with Colde)", "Wild Flower (with youjeen)", "No.2 (with parkjiyoon)"],
        "Echo": ["Don't Say You Love Me", "Nothing Without Your Love", "Loser (feat. YENA)", "Rope It", "With the Clouds", "To Me, Today"],
        "Agust D": ["Intro : Dt sugA", "Agust D", "Skit", "So far away (feat. Suran)", "140503 at Dawn", "Tony Montana", "give it to me", "Interlude : Dream, Reality", "The Last", "724148"],
        "JITB": ["Intro", "Pandora's Box", "MORE", "STOP", "= (Equal Sign)", "Music Box : Reflection", "What if...", "Safety Zone", "Future", "Arson"]
    },
    
    TEAM_PFPS: {
        "Indigo": "https://github.com/hbot7875-gif/btscomebackmission/blob/be0a3cc8ca6b395b4ceb74a1eb01207b9b756b4c/team%20pfps/teamindigo.jpg?raw=true",
        "Echo": "https://github.com/hbot7875-gif/btscomebackmission/blob/be0a3cc8ca6b395b4ceb74a1eb01207b9b756b4c/team%20pfps/teamecho.jpg?raw=true",
        "Agust D": "https://github.com/hbot7875-gif/btscomebackmission/blob/be0a3cc8ca6b395b4ceb74a1eb01207b9b756b4c/team%20pfps/teamagustd.jpg?raw=true",
        "JITB": "https://github.com/hbot7875-gif/btscomebackmission/blob/be0a3cc8ca6b395b4ceb74a1eb01207b9b756b4c/team%20pfps/teamjitb.jpg?raw=true"
    },
    
    // Helper Army Roles
    HELPER_ROLES: [
        { id: 'pl_maker', name: 'Playlist Maker', icon: '🎵', description: 'Creates and maintains streaming playlists' },
        { id: 'goals_maker', name: 'Goals Maker', icon: '🎯', description: 'Sets weekly track and album goals' },
        { id: 'badge_maker', name: 'Badge Maker', icon: '🎖️', description: 'Designs and creates agent badges' },
        { id: 'promoter', name: 'Promoter Agent', icon: '📢', description: 'Recruits new agents and spreads the word' },
        { id: 'police', name: 'Police Agent', icon: '👮', description: 'Monitors rule compliance and reports issues' },
        { id: 'secret_missions', name: 'Secret Missions Maker', icon: '🕵️', description: 'Creates special team missions' },
        { id: 'attendance', name: 'Attendance Taker', icon: '📋', description: 'Tracks agent participation weekly' }
    ],
    
    SECRET_MISSIONS: { xpPerMission: 5, maxMissionsPerTeam: 5, maxTeamBonus: 25 },
    
    MISSION_TYPES: {
        'switch_app': { name: 'Switch App', icon: '🔄', description: 'Switch to YouTube/Apple Music for 1 hour.' },
        'filler_mode': { name: 'Filler Mode', icon: '🧬', description: 'Stream 1 BTS Song + 2 Non-Kpop songs.' },
        'old_songs': { name: 'Old Songs', icon: '🕰️', description: 'Stream tracks older than 2 years.' },
        'stream_party': { name: 'Stream Party', icon: '🎉', description: 'Everyone streams the exact same playlist NOW.' },
        'custom': { name: 'Custom Task', icon: '⭐', description: 'Special instruction from Admin.' }
    }
};

// ==================== STATE ====================
const STATE = {
    agentNo: null,
    week: null,
    weeks: [],
    data: null,
    allAgents: [],
    allWeeksData: null, // For storing all weeks badges/XP
    page: 'home',
    isLoading: false,
    isAdmin: false,
    adminSession: null,
    lastUpdated: null,
    hasSeenResults: {} // Track which week results user has seen
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

function fmt(n) { return Number(n || 0).toLocaleString(); }

function sanitize(str) {
    if (!str) return '';
    return String(str).replace(/[<>\"'&]/g, char => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' })[char] || char);
}

function formatLastUpdated(dateStr) {
    if (!dateStr) return 'Unknown';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) { return dateStr; }
}

function showToast(msg, type = 'info') {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}</span><span class="toast-msg">${sanitize(msg)}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 4000);
}

function showResult(msg, isError) {
    const el = $('find-result');
    if (!el) return;
    el.innerHTML = `<span style="margin-right:8px;">${isError ? '⚠️' : '✅'}</span>${msg}`;
    el.className = `result-box show ${isError ? 'error' : 'success'}`;
    if (!isError) setTimeout(() => el.classList.remove('show'), 8000);
}

function updateTime() {
    const el = $('last-update');
    if (el) {
        if (STATE.lastUpdated) el.textContent = `Updated: ${formatLastUpdated(STATE.lastUpdated)}`;
        else el.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
}

function getDaysRemaining(weekLabel) {
    const endDateStr = CONFIG.WEEK_DATES[weekLabel];
    if (!endDateStr) return 0;
    const end = new Date(endDateStr);
    end.setHours(23, 59, 59, 999);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
}

function isWeekCompleted(selectedWeek) {
    const endDateStr = CONFIG.WEEK_DATES[selectedWeek];
    if (!endDateStr) return false;
    const end = new Date(endDateStr);
    end.setHours(23, 59, 59, 999);
    return new Date() > end;
}

// ==================== GUIDES ====================
const PAGE_GUIDES = {
    'home': { 
        icon: '🏠', 
        title: 'Welcome to Headquarters!', 
        text: "You will receive missions every week. BTS Comeback is REAL - let's stream like our life depends on it! 💜" 
    },
    'goals': { 
        icon: '🎯', 
        title: 'Team Goal Progress', 
        text: "Focus on these tracks. Don't loop one track - variety is key!" 
    },
    'album2x': { 
        icon: '🎧', 
        title: 'The 2X Challenge', 
        text: "Listen to every song on this album at least 2 times." 
    },
    'secret-missions': { 
        icon: '🕵️', 
        title: 'Classified Tasks', 
        text: "Bonus XP tasks from HQ. Complete them for extra team XP!" 
    },
    'team-level': { 
        icon: '🚀', 
        title: 'Leveling Up', 
        text: "Complete Track, Album, and 2X missions to level up your team and earn badges." 
    },
    'rankings': { 
        icon: '🏆', 
        title: 'Friendly Competition', 
        text: "We are one big team. Rankings are just for fun and motivation!" 
    },
    'playlists': {
        icon: '⚠️',
        title: 'DIRECT ORDER FROM HQ',
        text: "USE ONLY THE GIVEN PLAYLISTS! Using other playlists may result in suspension. No exceptions.",
        isWarning: true
    },
    'announcements': {
        icon: '📢',
        title: 'HQ Announcements',
        text: "Important news and updates regarding BTS comeback directly from Admin. Check regularly!"
    },
    'chat': {
        icon: '💬',
        title: 'Secret Comms Channel',
        text: "Chat anonymously with fellow agents. Shy to ask something? Ask here - no judgments! Remember, you were once a baby ARMY too, so help others out. Coordinate missions, share tips, vent if needed. Be kind - we're ONE team! 💜 (Keep personal info private)",
        isWarning: false
    },
    'gc-links': {
        icon: '👥',
        title: 'Instagram Group Chats',
        text: "Connect with your team for mission coordination. Join the GCs below!"
    },
    'helper-roles': {
        icon: '🎖️',
        title: 'Helper Army Roles',
        text: "Want to help HQ? Check available roles below. More roles coming based on mission needs!"
    }
};

function renderGuide(pageName) {
    const guide = PAGE_GUIDES[pageName];
    if (!guide) return '';
    const bgColor = guide.isWarning ? 'rgba(255, 68, 68, 0.1)' : 'rgba(255,255,255,0.03)';
    const borderColor = guide.isWarning ? '#ff4444' : '#7b2cbf';
    return `
        <div class="card guide-card" style="background: ${bgColor}; border-left: 3px solid ${borderColor}; margin-bottom: 20px;">
            <div class="card-body" style="display: flex; gap: 15px; align-items: flex-start; padding: 15px;">
                <div style="font-size: 24px;">${guide.icon}</div>
                <div>
                    <h4 style="margin: 0 0 5px 0; color: ${guide.isWarning ? '#ff4444' : '#fff'}; font-size: 14px;">${guide.title}</h4>
                    <p style="margin: 0; color: #aaa; font-size: 13px; line-height: 1.5; white-space: pre-line;">${guide.text}</p>
                </div>
            </div>
        </div>
    `;
}

// ==================== API ====================
async function api(action, params = {}) {
    const url = new URL(CONFIG.API_URL);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([k, v]) => { if (v != null) url.searchParams.set(k, typeof v === 'object' ? JSON.stringify(v) : v); });
    console.log('📡 API:', action, params);
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch (e) { throw new Error('Invalid JSON response'); }
        if (data.lastUpdated) { STATE.lastUpdated = data.lastUpdated; updateTime(); }
        if (data.error) throw new Error(data.error);
        return data;
    } catch (e) {
        console.error('API Error:', e);
        throw e;
    }
}

// ==================== INITIALIZATION ====================
function initApp() {
    console.log('🚀 Starting App v5.0 (Full Features)...');
    ensureAppCSS(); 
    loading(false);
    setupLoginListeners();
    loadAllAgents();

    const saved = localStorage.getItem('spyAgent');
    if (saved) {
        STATE.agentNo = saved;
        checkAdminStatus();
        loadSeenResults();
        loadDashboard();
    }
}

function loadSeenResults() {
    try {
        const saved = localStorage.getItem('seenResults_' + STATE.agentNo);
        STATE.hasSeenResults = saved ? JSON.parse(saved) : {};
    } catch (e) {
        STATE.hasSeenResults = {};
    }
}

function markResultsSeen(week) {
    STATE.hasSeenResults[week] = true;
    localStorage.setItem('seenResults_' + STATE.agentNo, JSON.stringify(STATE.hasSeenResults));
}

// === APP CSS (CORRECTED) ===
function ensureAppCSS() {
    if (document.getElementById('app-custom-styles')) return;
    const style = document.createElement('style');
    style.id = 'app-custom-styles';
    style.innerHTML = `
        /* === ADMIN PANEL BASE === */
        .admin-panel { 
            position: fixed !important; 
            top: 0 !important; 
            left: 0 !important; 
            width: 100vw !important; 
            height: 100vh !important; 
            background: #0a0a0f !important; 
            z-index: 999999 !important; 
            display: flex !important; 
            flex-direction: column !important;
        }
        .admin-panel-header { background: #1a1a2e; padding: 15px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
        .admin-panel-content { flex: 1; overflow-y: auto; padding: 20px; }
        .admin-panel-tabs { display: flex; background: #12121a; padding: 10px; gap: 10px; overflow-x: auto; }
        .admin-tab { padding: 8px 16px; border: 1px solid #333; border-radius: 20px; background: transparent; color: #888; cursor: pointer; white-space: nowrap; transition: all 0.3s ease; }
        .admin-tab:hover { background: rgba(123, 44, 191, 0.2); border-color: #7b2cbf; }
        .admin-tab.active { background: #7b2cbf; color: #fff; border-color: #7b2cbf; }
        .admin-tab-content { display: none; }
        .admin-tab-content.active { display: block; }
        .admin-mission-card { background: #1a1a2e; padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }

        /* === ADMIN LOGIN MODAL === */
        .admin-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 999998;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .admin-modal {
            background: linear-gradient(145deg, #1a1a2e, #0a0a0f);
            border-radius: 16px;
            width: 90%;
            max-width: 400px;
            border: 1px solid #7b2cbf;
            box-shadow: 0 0 50px rgba(123, 44, 191, 0.3);
        }
        .admin-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #333;
        }
        .admin-modal-header h3 { color: #fff; margin: 0; }
        .admin-modal-close {
            background: none;
            border: none;
            color: #888;
            font-size: 28px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
        .admin-modal-body { padding: 20px; }
        .terminal-style {
            background: #0a0a0f;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 15px;
        }
        .terminal-label { color: #888; font-size: 12px; display: block; margin-bottom: 5px; }
        .terminal-input {
            width: 100%;
            background: transparent;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 10px;
            color: #fff;
            font-family: monospace;
        }
        .admin-error {
            color: #ff4444;
            text-align: center;
            padding: 10px;
            display: none;
        }
        .admin-error.show { display: block; }
        .admin-modal-footer {
            display: flex;
            gap: 10px;
            padding: 20px;
            border-top: 1px solid #333;
            justify-content: flex-end;
        }

        /* === FORM ELEMENTS === */
        .create-mission-form { padding: 10px 0; }
        .form-section { margin-bottom: 20px; }
        .form-section h4 { color: #fff; margin-bottom: 10px; font-size: 14px; }
        .form-input, .form-textarea {
            width: 100%;
            background: #12121a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 12px;
            color: #fff;
            margin-bottom: 10px;
            font-size: 14px;
        }
        .form-textarea { min-height: 80px; resize: vertical; }
        .mission-type-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }
        .mission-type-option {
            padding: 12px;
            background: #12121a;
            border: 1px solid #333;
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
            color: #888;
            transition: all 0.3s;
        }
        .mission-type-option:hover { border-color: #7b2cbf; }
        .mission-type-option.selected {
            background: rgba(123, 44, 191, 0.2);
            border-color: #7b2cbf;
            color: #fff;
        }
        .team-checkboxes {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 10px;
        }
        .team-checkbox {
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
        }
        .form-actions { margin-top: 20px; }

        /* === BUTTONS === */
        .btn-primary {
            background: linear-gradient(135deg, #7b2cbf, #5a1f99);
            color: #fff;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(123, 44, 191, 0.4);
        }
        .btn-secondary {
            background: #333;
            color: #fff;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
        }
        .loading-text {
            color: #888;
            text-align: center;
            padding: 20px;
        }

        /* === HOLOGRAPHIC BADGE RING === */
        .badge-circle {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
            background: #1a1a2e;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .badge-circle.holographic {
            background: linear-gradient(135deg, #1a1a2e, #2a2a3e);
            border: none !important;
            padding: 3px;
        }
        .badge-circle.holographic::before {
            content: '';
            position: absolute;
            top: -3px;
            left: -3px;
            right: -3px;
            bottom: -3px;
            border-radius: 50%;
            background: conic-gradient(from 0deg, #ffd700, #ff6b6b, #c56cf0, #7b2cbf, #00d4ff, #00ff88, #ffd700);
            z-index: -1;
            animation: holoSpin 4s linear infinite;
        }
        .badge-circle.holographic::after {
            content: '';
            position: absolute;
            top: 3px;
            left: 3px;
            right: 3px;
            bottom: 3px;
            border-radius: 50%;
            background: #1a1a2e;
            z-index: -1;
        }
        .badge-circle.holographic {
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.4), 0 0 30px rgba(123, 44, 191, 0.3), 0 0 45px rgba(0, 212, 255, 0.2);
        }
        .badge-circle:hover { transform: scale(1.1); }
        @keyframes holoSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .badge-circle img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
            position: relative;
            z-index: 1;
        }

        /* === ADMIN ASSETS - DATA CHIPS === */
        .assets-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 15px;
            padding: 10px;
        }
        .asset-chip {
            position: relative;
            aspect-ratio: 1;
            border-radius: 16px;
            overflow: hidden;
            background: linear-gradient(145deg, #1a1a2e, #12121a);
            border: 2px solid rgba(123, 44, 191, 0.3);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .asset-chip::before {
            content: '';
            position: absolute;
            top: -3px;
            left: -3px;
            right: -3px;
            bottom: -3px;
            border-radius: 18px;
            background: conic-gradient(from 0deg, #ffd700, #ff6b6b, #c56cf0, #7b2cbf, #00d4ff, #00ff88, #ffd700);
            z-index: -1;
            opacity: 0;
            animation: holoSpin 4s linear infinite;
            transition: opacity 0.3s;
        }
        .asset-chip:hover::before { opacity: 1; }
        .asset-chip-inner {
            width: 100%;
            height: 100%;
            border-radius: 14px;
            overflow: hidden;
            background: #1a1a2e;
            position: relative;
        }
        .asset-chip img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        .asset-chip:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 10px 30px rgba(123, 44, 191, 0.4);
        }
        .asset-chip:hover img { transform: scale(1.1); }
        .asset-chip-number {
            position: absolute;
            top: 8px;
            left: 8px;
            background: rgba(0,0,0,0.8);
            color: #ffd700;
            padding: 4px 8px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: bold;
            z-index: 2;
        }

        /* === BADGES SHOWCASE === */
        .badges-showcase {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
            gap: 15px;
            padding: 10px;
        }
        .badge-showcase-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 12px 8px;
            background: linear-gradient(145deg, rgba(26, 26, 46, 0.8), rgba(18, 18, 26, 0.9));
            border-radius: 12px;
            border: 1px solid rgba(123, 44, 191, 0.2);
            transition: all 0.3s ease;
        }
        .badge-showcase-item:hover {
            transform: translateY(-5px);
            border-color: rgba(255, 215, 0, 0.5);
        }
        .badge-name { margin-top: 8px; font-weight: 600; color: #ffd700; font-size: 11px; }
        .badge-week { font-size: 9px; color: #7b2cbf; margin-top: 2px; }

        /* === PLAYLIST, GC, HELPER ROLES === */
        .playlist-card, .gc-card, .role-card {
            background: linear-gradient(145deg, #1a1a2e, #12121a);
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 10px;
            border: 1px solid rgba(123, 44, 191, 0.3);
            transition: all 0.3s;
        }
        .playlist-card:hover, .role-card:hover { transform: translateX(5px); }
        .gc-link-btn {
            display: inline-block;
            padding: 10px 20px;
            background: linear-gradient(135deg, #7b2cbf, #5a1f99);
            color: #fff;
            border-radius: 8px;
            text-decoration: none;
            font-size: 14px;
            transition: all 0.3s;
        }
        .gc-link-btn:hover { transform: scale(1.05); box-shadow: 0 5px 20px rgba(123, 44, 191, 0.4); }
    `;
    document.head.appendChild(style);
}

// ==================== ADMIN LOGIN (SINGLE VERSION) ====================
function showAdminLogin() {
    if (!isAdminAgent()) { 
        showToast('Access denied.', 'error'); 
        return; 
    }
    
    closeSidebar();
    document.querySelectorAll('.admin-modal-overlay, #admin-modal').forEach(m => m.remove());
    
    const modal = document.createElement('div');
    modal.className = 'admin-modal-overlay';
    modal.id = 'admin-modal';
    
    modal.onclick = function(e) {
        if (e.target === modal) closeAdminModal();
    };
    
    modal.innerHTML = `
        <div class="admin-modal" onclick="event.stopPropagation();">
            <div class="admin-modal-header">
                <h3>🔐 Admin Access</h3>
                <button class="admin-modal-close" type="button" onclick="closeAdminModal();">×</button>
            </div>
            <div class="admin-modal-body">
                <div class="terminal-style">
                    <label class="terminal-label">PASSWORD:</label>
                    <input type="password" id="admin-password" class="terminal-input" autocomplete="off">
                </div>
                <div id="admin-error" class="admin-error"></div>
            </div>
            <div class="admin-modal-footer">
                <button type="button" onclick="verifyAdminPassword();" class="btn-primary">
                    🔓 Authenticate
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        const pwField = document.getElementById('admin-password');
        if (pwField) {
            pwField.focus();
            pwField.onkeypress = function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    verifyAdminPassword();
                }
            };
        }
    }, 150);
}

function closeAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) modal.remove();
}

async function verifyAdminPassword() {
    const passwordField = document.getElementById('admin-password');
    const password = passwordField?.value;
    const errorEl = document.getElementById('admin-error');
    
    if (!password) {
        if (errorEl) {
            errorEl.textContent = '❌ Please enter password';
            errorEl.classList.add('show');
        }
        return;
    }
    
    let verified = false;
    
    if (password === CONFIG.ADMIN_PASSWORD) {
        verified = true;
        STATE.adminSession = 'local_' + Date.now();
    } else {
        try {
            const result = await api('verifyAdmin', { agentNo: STATE.agentNo, password });
            if (result.success) { 
                verified = true; 
                STATE.adminSession = result.sessionToken; 
            }
        } catch (e) {
            console.log('Server verification failed:', e);
        }
    }

    if (verified) {
        STATE.isAdmin = true;
        localStorage.setItem('adminSession', STATE.adminSession);
        localStorage.setItem('adminExpiry', String(Date.now() + 86400000));
        
        closeAdminModal();
        addAdminIndicator();
        
        if (!STATE.week) { 
            try { 
                const w = await api('getAvailableWeeks'); 
                STATE.week = w.current || w.weeks?.[0]; 
            } catch(e) {} 
        }
        
        showToast('Access Granted', 'success');
        setTimeout(() => showAdminPanel(), 100);
        
    } else {
        if (errorEl) { 
            errorEl.textContent = '❌ Invalid password'; 
            errorEl.classList.add('show');
        }
    }
}

// ==================== ADMIN PANEL (SINGLE VERSION) ====================
function showAdminPanel() {
    if (!STATE.isAdmin) {
        showToast('Admin access required', 'error');
        return;
    }
    
    if (!STATE.week) {
        STATE.week = STATE.weeks?.[0] || 'Week 1';
    }
    
    document.querySelectorAll('.admin-panel').forEach(p => p.remove());

    const panel = document.createElement('div');
    panel.className = 'admin-panel';
    panel.id = 'admin-panel';
    
    panel.addEventListener('click', function(e) {
        e.stopPropagation();
    }, true);
    
    panel.innerHTML = `
        <div class="admin-panel-header">
            <div>
                <h3 style="margin:0; color:#fff;">🎛️ Mission Control</h3>
                <p style="margin:5px 0 0; color:#888; font-size:12px;">${STATE.week || 'Current Week'}</p>
            </div>
            <button type="button" id="admin-panel-close-btn" style="background:none; border:none; color:#fff; font-size:28px; cursor:pointer; padding:5px 15px;">×</button>
        </div>
        <div class="admin-panel-tabs">
            <button type="button" class="admin-tab active" data-tab="create">Create Mission</button>
            <button type="button" class="admin-tab" data-tab="active">Active</button>
            <button type="button" class="admin-tab" data-tab="assets">Badge Preview</button>
            <button type="button" class="admin-tab" data-tab="history">History</button>
        </div>
        <div class="admin-panel-content">
            <div id="admin-tab-create" class="admin-tab-content active">${renderCreateMissionForm()}</div>
            <div id="admin-tab-active" class="admin-tab-content"><div class="loading-text">Loading...</div></div>
            <div id="admin-tab-assets" class="admin-tab-content"><div class="loading-text">Loading...</div></div>
            <div id="admin-tab-history" class="admin-tab-content"><div class="loading-text">Loading...</div></div>
        </div>
    `;
    
    document.body.appendChild(panel);
    document.body.style.overflow = 'hidden';
    
    const closeBtn = document.getElementById('admin-panel-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeAdminPanel();
        }, { capture: true });
    }
    
    panel.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const tabName = this.dataset.tab;
            switchAdminTab(tabName);
            if (tabName === 'active') loadActiveTeamMissions();
            if (tabName === 'assets') renderAdminAssets();
            if (tabName === 'history') loadMissionHistory();
        }, { capture: true });
    });
    
    console.log('✅ Admin panel opened');
}

function closeAdminPanel() {
    const panel = document.getElementById('admin-panel');
    if (panel) {
        panel.remove();
        document.body.style.overflow = '';
        console.log('✅ Admin panel closed');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.remove('open');
    }
}

console.log('✅ Fixed CSS & Admin code ready to use');
// ==================== PAGE ROUTER ====================
async function loadPage(page) {
    STATE.page = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Create dynamic pages if they don't exist
    const dynamicPages = ['chat', 'playlists', 'gc-links', 'helper-roles'];
    dynamicPages.forEach(pageName => {
        if (page === pageName && !$(`page-${pageName}`)) {
            const mainContent = document.querySelector('.pages-wrapper') || document.querySelector('main');
            if (mainContent) {
                const newPage = document.createElement('section');
                newPage.id = `page-${pageName}`;
                newPage.className = 'page';
                newPage.innerHTML = `<div id="${pageName}-content"></div>`;
                mainContent.appendChild(newPage);
            }
        }
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
            case 'comparison': await renderComparison(); break;
            case 'summary': await renderSummary(); break;
            case 'drawer': await renderDrawer(); break;
            case 'announcements': await renderAnnouncements(); break;
            case 'secret-missions': await renderSecretMissions(); break;
            case 'chat': await renderChat(); break;
            case 'playlists': await renderPlaylists(); break;
            case 'gc-links': await renderGCLinks(); break;
            case 'helper-roles': await renderHelperRoles(); break;
        }
    } catch (e) {
        if (el) el.innerHTML = `<div class="error-page"><h3>Failed to load</h3><p>${sanitize(e.message)}</p><button onclick="loadPage('${page}')" class="btn-primary">Retry</button></div>`;
    } finally { loading(false); }
}

// ==================== HOME RENDERER ====================
async function renderHome() {
    const selectedWeek = STATE.week;
    $('current-week').textContent = `Week: ${selectedWeek}`;
    const guideHtml = renderGuide('home'); 
    try {
        const [summary, rankings, goals] = await Promise.all([api('getWeeklySummary', { week: selectedWeek }), api('getRankings', { week: selectedWeek, limit: 5 }), api('getGoalsProgress', { week: selectedWeek })]);
        if (summary.lastUpdated) { STATE.lastUpdated = summary.lastUpdated; updateTime(); }
        const team = STATE.data?.profile?.team;
        const teamData = summary.teams?.[team] || {};
        const myStats = STATE.data?.stats || {};
        const isCompleted = isWeekCompleted(selectedWeek);
        const daysLeft = getDaysRemaining(selectedWeek);
        const agentName = STATE.data?.profile?.name || 'Agent';
        
        const quickStatsEl = document.querySelector('.quick-stats-section');
        if (quickStatsEl) {
            quickStatsEl.innerHTML = guideHtml + `
                <div class="card quick-stats-card" style="border-color:${teamColor(team)}40;background:linear-gradient(135deg, ${teamColor(team)}11, var(--bg-card));">
                    <div class="card-body">
                        <div class="quick-header">
                            ${teamPfp(team) ? `<img src="${teamPfp(team)}" class="quick-pfp" style="border-color:${teamColor(team)}">` : ''}
                            <div class="quick-info">
                                <div class="quick-name">Welcome, @${sanitize(agentName)}!</div>
                                <div class="quick-team" style="color:${teamColor(team)}">Team ${team} • Rank #${STATE.data?.rank || 'N/A'}</div>
                            </div>
                        </div>
                        <div class="quick-stats-grid">
                            <div class="quick-stat">
                                <div class="quick-stat-value">${fmt(myStats.totalXP)}</div>
                                <div class="quick-stat-label">XP</div>
                            </div>
                            <div class="quick-stat">
                                <div class="quick-stat-value">${fmt(myStats.trackScrobbles || 0)}</div>
                                <div class="quick-stat-label">Track Streams</div>
                            </div>
                            <div class="quick-stat">
                                <div class="quick-stat-value">${fmt(myStats.albumScrobbles || 0)}</div>
                                <div class="quick-stat-label">Album Streams</div>
                            </div>
                        </div>
                        <div class="battle-timer ${isCompleted ? 'ended' : ''}">
                            ${isCompleted ? '🏆 Week Completed' : (daysLeft <= 1 ? '🚀 Final Day!' : `⏰ ${daysLeft} days left`)}
                        </div>
                        ${isCompleted ? `<div class="results-alert" onclick="loadPage('summary')">🏆 View Final Results →</div>` : ''}
                        ${STATE.lastUpdated ? `<div class="last-updated-mini">Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}
                    </div>
                </div>
            `;
        }
        
        const trackGoals = goals.trackGoals || {};
        const albumGoals = goals.albumGoals || {};
        const album2xStatus = STATE.data?.album2xStatus || {};
        const teamTracks = CONFIG.TEAM_ALBUM_TRACKS[team] || [];
        const tracksCompleted2x = teamTracks.filter(t => (album2xStatus.tracks?.[t] || 0) >= 2).length;
        
        const trackGoalsList = Object.entries(trackGoals).map(([trackName, info]) => {
            const tp = info.teams?.[team] || {};
            return { name: trackName, current: tp.current || 0, goal: info.goal || 0, done: tp.status === 'Completed' || (tp.current || 0) >= (info.goal || 0) };
        });
        const albumGoalsList = Object.entries(albumGoals).map(([albumName, info]) => {
            const ap = info.teams?.[team] || {};
            return { name: albumName, current: ap.current || 0, goal: info.goal || 0, done: ap.status === 'Completed' || (ap.current || 0) >= (info.goal || 0) };
        });

        const missionCardsContainer = document.querySelector('.missions-grid');
        if (missionCardsContainer) {
            missionCardsContainer.innerHTML = `
                <div class="mission-card expanded" onclick="loadPage('goals')">
                    <div class="mission-icon">🎵</div>
                    <h3>Track Goals</h3>
                    <div class="mission-status ${teamData.trackGoalPassed ? 'complete' : ''}">${teamData.trackGoalPassed ? '✅ Complete' : '⏳ In Progress'}</div>
                    <div class="goals-list">${trackGoalsList.length ? trackGoalsList.map(g => `<div class="goal-mini ${g.done ? 'done' : ''}"><span class="goal-name">${sanitize(g.name)}</span><span class="goal-progress">${fmt(g.current)}/${fmt(g.goal)} ${g.done ? '✅' : ''}</span></div>`).join('') : '<p class="no-goals">No track goals</p>'}</div>
                </div>
                <div class="mission-card expanded" onclick="loadPage('goals')">
                    <div class="mission-icon">💿</div>
                    <h3>Album Goals</h3>
                    <div class="mission-status ${teamData.albumGoalPassed ? 'complete' : ''}">${teamData.albumGoalPassed ? '✅ Complete' : '⏳ In Progress'}</div>
                    <div class="goals-list">${albumGoalsList.length ? albumGoalsList.map(g => `<div class="goal-mini ${g.done ? 'done' : ''}"><span class="goal-name">${sanitize(g.name)}</span><span class="goal-progress">${fmt(g.current)}/${fmt(g.goal)} ${g.done ? '✅' : ''}</span></div>`).join('') : '<p class="no-goals">No album goals</p>'}</div>
                </div>
                <div class="mission-card" onclick="loadPage('album2x')">
                    <div class="mission-icon">✨</div>
                    <h3>Album 2X</h3>
                    <div class="mission-subtitle">${sanitize(CONFIG.TEAMS[team]?.album || team)}</div>
                    <div class="mission-status ${album2xStatus.passed ? 'complete' : ''}">${album2xStatus.passed ? '✅ Complete' : '⏳ In Progress'}</div>
                    <div class="mission-progress">
                        <div class="progress-bar"><div class="progress-fill ${album2xStatus.passed ? 'complete' : ''}" style="width:${teamTracks.length ? (tracksCompleted2x/teamTracks.length*100) : 0}%"></div></div>
                        <span>${tracksCompleted2x}/${teamTracks.length} tracks</span>
                    </div>
                </div>
                <div class="mission-card secret" onclick="loadPage('secret-missions')">
                    <div class="mission-icon">🔒</div>
                    <h3>Secret Missions</h3>
                    <div class="mission-status">🕵️ Classified</div>
                    <div class="mission-hint">Tap to view team missions</div>
                </div>
                <div class="mission-card" onclick="loadPage('playlists')">
                    <div class="mission-icon">🎵</div>
                    <h3>Playlists</h3>
                    <div class="mission-status" style="color:#ff4444;">⚠️ REQUIRED</div>
                    <div class="mission-hint">Official streaming playlists</div>
                </div>
                <div class="mission-card" onclick="loadPage('chat')">
                    <div class="mission-icon">💬</div>
                    <h3>Secret Comms</h3>
                    <div class="mission-subtitle">HQ Encrypted Channel</div>
                    <div class="mission-hint">Tap to join chat</div>
                </div>
                <div class="mission-card" onclick="loadPage('gc-links')">
                    <div class="mission-icon">👥</div>
                    <h3>GC Links</h3>
                    <div class="mission-hint">Instagram group chats</div>
                </div>
                <div class="mission-card" onclick="loadPage('helper-roles')">
                    <div class="mission-icon">🎖️</div>
                    <h3>Helper Roles</h3>
                    <div class="mission-hint">Join the Helper Army</div>
                </div>
            `;
        }
        
        const rankList = rankings.rankings || [];
        const topAgentsEl = $('home-top-agents');
        if (topAgentsEl) {
            topAgentsEl.innerHTML = rankList.length ? rankList.slice(0, 5).map((r, i) => `<div class="rank-item ${String(r.agentNo) === String(STATE.agentNo) ? 'highlight' : ''}" onclick="loadPage('rankings')"><div class="rank-num">${i+1}</div><div class="rank-info"><div class="rank-name">${sanitize(r.name)}</div><div class="rank-team" style="color:${teamColor(r.team)}">${r.team}</div></div><div class="rank-xp">${fmt(r.totalXP)} XP</div></div>`).join('') : '<p class="empty-text">No data yet</p>';
        }
        
        const sortedTeams = Object.keys(summary.teams || {}).sort((a, b) => (summary.teams[b].teamXP || 0) - (summary.teams[a].teamXP || 0));
        const standingsEl = $('home-standings');
        if (standingsEl) {
            standingsEl.innerHTML = sortedTeams.length ? `
                <div class="standings-header"><span class="standings-badge ${isCompleted ? 'final' : ''}">${isCompleted ? '🏆 Final Standings' : '⏳ Live Battle'}</span></div>
                ${sortedTeams.map((t, i) => {
                    const td = summary.teams[t];
                    return `<div class="standing-item ${t === team ? 'my-team' : ''}" onclick="loadPage('team-level')" style="--team-color:${teamColor(t)}"><div class="standing-rank">${i+1}</div>${teamPfp(t) ? `<img src="${teamPfp(t)}" class="standing-pfp">` : ''}<div class="standing-info"><div class="standing-name" style="color:${teamColor(t)}">${t}</div><div class="standing-xp">${fmt(td.teamXP)} XP</div></div><div class="standing-missions">${td.trackGoalPassed?'🎵✅':'🎵❌'} ${td.albumGoalPassed?'💿✅':'💿❌'} ${td.album2xPassed?'✨✅':'✨❌'}</div></div>`;
                }).join('')}
                <div class="standings-footer"><button class="btn-secondary" onclick="loadPage('comparison')">View Battle Details →</button></div>
            ` : '<p class="empty-text">No data yet</p>';
        }
    } catch (e) { console.error(e); showToast('Failed to load home', 'error'); }
}

// ==================== DRAWER (All Weeks Badges + XP) ====================
async function renderDrawer() {
    const container = $('drawer-content');
    if (!container) return;
    const profile = STATE.data?.profile || {};
    const isAdmin = String(STATE.agentNo).toUpperCase() === String(CONFIG.ADMIN_AGENT_NO).toUpperCase();
        // Calculate totals from all weeks
    let totalXP = 0;
    let allBadges = [];
    
    if (STATE.allWeeksData && STATE.allWeeksData.weeks && STATE.allWeeksData.weeks.length > 0) {
        STATE.allWeeksData.weeks.forEach(weekData => {
            const weekXP = parseInt(weekData.stats?.totalXP) || 0;
            totalXP += weekXP;
            
            // Generate badges for this week
            const weekBadges = getLevelBadges(STATE.agentNo, weekXP, weekData.week);
            allBadges = allBadges.concat(weekBadges);
        });
    } else {
        // Fallback to current week only
        const stats = STATE.data?.stats || {};
        totalXP = parseInt(stats.totalXP) || 0;
        allBadges = getLevelBadges(STATE.agentNo, totalXP, STATE.week);
    }
    
    const totalBadges = allBadges.length;
    
    container.innerHTML = `
        <div class="card">
            <div class="card-body">
                <div class="drawer-header">
                    ${teamPfp(profile.team) ? `<img src="${teamPfp(profile.team)}" class="drawer-pfp" style="border-color:${teamColor(profile.team)}">` : ''}
                    <div class="drawer-info">
                        <div class="drawer-name">${sanitize(profile.name)}</div>
                        <div class="drawer-team" style="color:${teamColor(profile.team)}">Team ${profile.team}</div>
                        <div class="drawer-id">Agent #${STATE.agentNo}</div>
                    </div>
                </div>
                ${isAdmin ? `<button onclick="showAdminLogin()" class="btn-primary" style="width:100%; margin: 10px 0;">🔐 Access Mission Control</button>` : ''}
                <div class="drawer-stats">
                    <div class="drawer-stat">
                        <span class="value">${fmt(totalXP)}</span>
                        <span class="label">Total XP (All Weeks)</span>
                    </div>
                    <div class="drawer-stat">
                        <span class="value">${totalBadges}</span>
                        <span class="label">Badges (All Weeks)</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3>🎖️ All Badges Collection (${totalBadges})</h3>
            </div>
            <div class="card-body">
                ${allBadges.length ? `
                    <div class="badges-showcase">
                        ${allBadges.map(b => `
                            <div class="badge-showcase-item">
                                <div class="badge-circle holographic">
                                    <img src="${b.imageUrl}" onerror="this.style.display='none';this.parentElement.innerHTML='❓';">
                                </div>
                                <div class="badge-name">${sanitize(b.name)}</div>
                                <div class="badge-week">${sanitize(b.week)}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="empty-state" style="text-align:center; padding:40px; color:#777;">
                        <div style="font-size:60px; margin-bottom:15px;">🔒</div>
                        <h4 style="color:#fff; margin-bottom:8px;">No Badges Yet</h4>
                        <p>Earn <strong style="color:#ffd700;">100 XP</strong> to unlock your first holographic badge!</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

function getLevelBadges(agentNo, totalXP, week = STATE.week) {
    const pool = CONFIG.BADGE_POOL;
    if (!pool || pool.length === 0) return [];
    const xp = parseInt(totalXP) || 0;
    const currentLevel = Math.floor(xp / 100);
    const badges = [];
    for (let level = 1; level <= currentLevel; level++) {
        let seed = 0;
        const str = String(agentNo).toUpperCase();
        for (let i = 0; i < str.length; i++) seed += str.charCodeAt(i);
        seed += (level * 137);
        // Add week-based offset for variety
        if (week) {
            for (let i = 0; i < week.length; i++) seed += week.charCodeAt(i);
        }
        const index = seed % pool.length;
        badges.push({ 
            name: `Level ${level}`, 
            description: `Unlocked at ${level * 100} XP`, 
            imageUrl: pool[index], 
            isLevelBadge: true,
            week: week || 'Unknown'
        });
    }
    return badges.reverse();
}

// ==================== PROFILE (Active Week Badges Only) ====================
async function renderProfile() {
    const stats = STATE.data?.stats || {};
    const album2xStatus = STATE.data?.album2xStatus || {};
    const trackContributions = STATE.data?.trackContributions || {};
    const albumContributions = STATE.data?.albumContributions || {};
    const currentWeekXP = stats.totalXP || 0;
    
    // Only show badges for active/current week
    const currentWeekBadges = getLevelBadges(STATE.agentNo, currentWeekXP, STATE.week);
    
    $('profile-stats').innerHTML = `
        <div class="stat-box"><div class="stat-value">${fmt(stats.totalXP)}</div><div class="stat-label">XP (${STATE.week})</div></div>
        <div class="stat-box"><div class="stat-value">#${STATE.data?.rank || 'N/A'}</div><div class="stat-label">Rank</div></div>
        <div class="stat-box"><div class="stat-value">#${STATE.data?.teamRank || 'N/A'}</div><div class="stat-label">Team Rank</div></div>
        <div class="stat-box"><div class="stat-value">${fmt(stats.trackScrobbles)}</div><div class="stat-label">Track Streams</div></div>
        <div class="stat-box"><div class="stat-value">${fmt(stats.albumScrobbles)}</div><div class="stat-label">Album Streams</div></div>
        <div class="stat-box"><div class="stat-value">${album2xStatus.passed ? '✅' : '❌'}</div><div class="stat-label">2X</div></div>
    `;
    
    $('profile-tracks').innerHTML = Object.keys(trackContributions).length ? Object.entries(trackContributions).sort((a, b) => b[1] - a[1]).map(([t, c]) => `<div class="contrib-item"><span>${sanitize(t)}</span><span>${fmt(c)} streams</span></div>`).join('') : '<p class="empty-text">No track data</p>';
    
    $('profile-albums').innerHTML = Object.keys(albumContributions).length ? Object.entries(albumContributions).sort((a, b) => b[1] - a[1]).map(([a, c]) => `<div class="contrib-item"><span>${sanitize(a)}</span><span>${fmt(c)} streams</span></div>`).join('') : '<p class="empty-text">No album data</p>';
    
    // Badges Earned - Only Active Week
    $('profile-badges').innerHTML = currentWeekBadges.length ? `
        <div style="margin-bottom:10px;"><span style="color:#888;font-size:12px;">Badges earned in ${STATE.week}</span></div>
        <div class="badges-grid">
            ${currentWeekBadges.map(b => `
                <div class="badge-item">
                    <div class="badge-circle holographic" style="width:50px;height:50px;">
                        <img src="${b.imageUrl}" onerror="this.parentElement.innerHTML='🎖️'">
                    </div>
                    <div class="badge-name">${sanitize(b.name)}</div>
                </div>
            `).join('')}
        </div>
    ` : '<p class="empty-text">No badges earned this week yet</p>';
}

// ==================== GOALS (Renamed to Team Goal Progress) ====================
async function renderGoals() {
    const container = $('goals-content');
    const team = STATE.data?.profile?.team;
    try {
        const data = await api('getGoalsProgress', { week: STATE.week });
        if (data.lastUpdated) STATE.lastUpdated = data.lastUpdated;
        
        let html = renderGuide('goals') + `
            <div class="goals-header">
                <h2 style="color:#fff;margin:0;">🎯 Team Goal Progress</h2>
                <span class="week-badge">${STATE.week}</span>
            </div>
            <div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated || 'recently')}</div>
        `;
        
        const trackGoals = data.trackGoals || {};
        if (Object.keys(trackGoals).length) {
            html += `<div class="card"><div class="card-header"><h3>🎵 Track Goals</h3><span class="team-badge" style="background:${teamColor(team)}22;color:${teamColor(team)}">${team}</span></div><div class="card-body">`;
            for (const [track, info] of Object.entries(trackGoals)) {
                const tp = info.teams?.[team] || {};
                const current = tp.current || 0; const goal = info.goal || 0;
                const done = tp.status === 'Completed' || current >= goal;
                const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
                html += `<div class="goal-item ${done ? 'completed' : ''}"><div class="goal-header"><span class="goal-name">${sanitize(track)}</span><span class="goal-status ${done ? 'complete' : ''}">${fmt(current)}/${fmt(goal)} streams ${done ? '✅' : ''}</span></div><div class="progress-bar"><div class="progress-fill ${done ? 'complete' : ''}" style="width:${pct}%"></div></div></div>`;
            }
            html += '</div></div>';
        }
        
        const albumGoals = data.albumGoals || {};
        if (Object.keys(albumGoals).length) {
            html += `<div class="card"><div class="card-header"><h3>💿 Album Goals</h3><span class="team-badge" style="background:${teamColor(team)}22;color:${teamColor(team)}">${team}</span></div><div class="card-body">`;
            for (const [album, info] of Object.entries(albumGoals)) {
                const ap = info.teams?.[team] || {};
                const current = ap.current || 0; const goal = info.goal || 0;
                const done = ap.status === 'Completed' || current >= goal;
                const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
                html += `<div class="goal-item ${done ? 'completed' : ''}"><div class="goal-header"><span class="goal-name">${sanitize(album)}</span><span class="goal-status ${done ? 'complete' : ''}">${fmt(current)}/${fmt(goal)} streams ${done ? '✅' : ''}</span></div><div class="progress-bar"><div class="progress-fill ${done ? 'complete' : ''}" style="width:${pct}%"></div></div></div>`;
            }
            html += '</div></div>';
        }
        
        container.innerHTML = html || '<div class="card"><div class="card-body"><p class="empty-text">No goals set for this week</p></div></div>';
    } catch (e) { container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load goals</p></div></div>'; }
}

// ==================== CHAT (With Rules) ====================
async function renderChat() {
    const container = document.getElementById('chat-content');
    if (!container) return;
    const team = STATE.data?.profile?.team || 'Unknown';
    const name = sanitize(STATE.data?.profile?.name) || 'Agent';
    const color = teamColor(team);
    const chatUrl = `https://tlk.io/${CONFIG.CHAT_CHANNEL}`;
    
    container.innerHTML = `
        ${renderGuide('chat')}
        <div class="card" style="height: calc(100% - 150px); display: flex; flex-direction: column; margin-bottom: 0;">
            <div class="card-header" style="border-bottom: 1px solid var(--border);">
                <h3>💬 Secret Comms Channel</h3>
                <div class="mission-hint">Encrypted Channel • Logged in as <span style="color:${color}">${name}</span></div>
            </div>
            <div class="card-body" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; background: radial-gradient(circle at center, #1a1a2e 0%, #0a0a0f 100%);">
                <div style="font-size: 60px; margin-bottom: 20px; animation: float 3s ease-in-out infinite;">🛰️</div>
                <h2 style="color: var(--text-bright); margin-bottom: 10px;">Secure Link Established</h2>
                <p style="color: var(--text-dim); max-width: 400px; margin-bottom: 30px; font-size: 14px;">
                    To bypass ad-blockers and ensure transmission security, the comms channel must be opened in a secure popup link.
                </p>
                <a href="${chatUrl}" target="_blank" onclick="window.open(this.href, 'bts_chat', 'width=500,height=700'); return false;" class="btn-primary" style="padding: 15px 30px; font-size: 16px; border: 1px solid var(--purple-glow); box-shadow: 0 0 20px rgba(123, 44, 191, 0.3);">
                    🚀 LAUNCH COMMS CHANNEL
                </a>
                <div style="margin-top: 30px; font-size: 11px; color: var(--text-muted);">
                    Status: <span style="color: var(--success);">ONLINE</span> • Encryption: <span style="color: var(--success);">ACTIVE</span>
                </div>
            </div>
        </div>
    `;
}

// ==================== PLAYLISTS ====================
async function renderPlaylists() {
    const container = document.getElementById('playlists-content');
    if (!container) return;
    
    container.innerHTML = `
        ${renderGuide('playlists')}
        <div class="card">
            <div class="card-header">
                <h3>🎵 Official Streaming Playlists</h3>
            </div>
            <div class="card-body">
                <div id="playlists-list" style="display:flex;flex-direction:column;gap:10px;">
                    <div class="loading-text">Loading playlists...</div>
                </div>
            </div>
        </div>
    `;
    
    try {
        const data = await api('getPlaylists');
        const playlists = data.playlists || [];
        
        const listEl = document.getElementById('playlists-list');
        if (playlists.length) {
            listEl.innerHTML = playlists.map(pl => `
                <div class="playlist-card">
                    <a href="${sanitize(pl.link)}" target="_blank" class="playlist-link">
                        <span class="playlist-icon">${getPlaylistIcon(pl.platform)}</span>
                        <div>
                            <div class="playlist-name">${sanitize(pl.name)}</div>
                            <div class="playlist-type">${sanitize(pl.platform || 'Streaming')} • ${sanitize(pl.type || 'Playlist')}</div>
                        </div>
                    </a>
                </div>
            `).join('');
        } else {
            listEl.innerHTML = `
                <div style="text-align:center;padding:40px;color:#888;">
                    <div style="font-size:48px;margin-bottom:15px;">📭</div>
                    <p>No playlists available yet</p>
                    <p style="font-size:12px;">Check back later for official streaming playlists</p>
                </div>
            `;
        }
    } catch (e) {
        document.getElementById('playlists-list').innerHTML = '<p style="color:red;">Failed to load playlists</p>';
    }
}

function getPlaylistIcon(platform) {
    const icons = {
        'spotify': '💚',
        'apple': '🍎',
        'youtube': '🔴',
        'amazon': '📦',
        'deezer': '🎧'
    };
    return icons[(platform || '').toLowerCase()] || '🎵';
}

// ==================== GC LINKS ====================
async function renderGCLinks() {
    const container = document.getElementById('gc-links-content');
    if (!container) return;
    const team = STATE.data?.profile?.team;
    
    container.innerHTML = `
        ${renderGuide('gc-links')}
        
        <div class="gc-card" style="border-color:${teamColor(team)}">
            <h4 style="color:${teamColor(team)}">👥 Team ${team} GC</h4>
            <p>For sending Spotify listening history screenshots every Sunday</p>
            <a href="#" class="gc-link-btn" id="gc-team-link">Join Team GC →</a>
        </div>
        
        <div class="gc-card">
            <h4>🎵 Playlist GC</h4>
            <p>If you need any more playlists or have playlist requests</p>
            <a href="#" class="gc-link-btn" id="gc-pl-link">Join Playlist GC →</a>
        </div>
        
        <div class="gc-card" style="border-color:#7b2cbf;">
            <h4 style="color:#7b2cbf;">🌟 Main BTS Comeback Mission GC</h4>
            <p>For effective communication only regarding the mission - ALL TEAMS</p>
            <a href="#" class="gc-link-btn" id="gc-main-link">Join Main GC →</a>
        </div>
        
        <div class="card" style="background:rgba(255,255,255,0.03);margin-top:20px;">
            <div class="card-body" style="text-align:center;padding:20px;">
                <p style="color:#888;font-size:13px;">
                    💜 Don't worry if you're not added yet!<br>
                    Just follow the goals displayed and we will add you soon.
                </p>
            </div>
        </div>
    `;
    
    // Load actual GC links from backend
    try {
        const data = await api('getGCLinks');
        const links = data.links || {};
        
        if (links.team && links.team[team]) {
            document.getElementById('gc-team-link').href = links.team[team];
        }
        if (links.playlist) {
            document.getElementById('gc-pl-link').href = links.playlist;
        }
        if (links.main) {
            document.getElementById('gc-main-link').href = links.main;
        }
    } catch (e) {
        console.log('Could not load GC links');
    }
}

// ==================== HELPER ROLES ====================
async function renderHelperRoles() {
    const container = document.getElementById('helper-roles-content');
    if (!container) return;
    
    container.innerHTML = `
        ${renderGuide('helper-roles')}
        <div class="card">
            <div class="card-header">
                <h3>🎖️ Helper Army Roles</h3>
                <span style="font-size:12px;color:#888;">Help HQ run the mission!</span>
            </div>
            <div class="card-body" id="roles-list">
                <div class="loading-text">Loading roles...</div>
            </div>
        </div>
        
        <div class="card" style="background:linear-gradient(135deg, rgba(123,44,191,0.1), rgba(255,215,0,0.05));border-color:#7b2cbf;">
            <div class="card-body" style="text-align:center;padding:30px;">
                <div style="font-size:40px;margin-bottom:15px;">🚀</div>
                <h4 style="color:#fff;margin-bottom:10px;">Want to Join the Helper Army?</h4>
                <p style="color:#888;font-size:13px;">
                    Contact Admin through Secret Comms or announcements.<br>
                    More roles will be released depending on the need!
                </p>
            </div>
        </div>
    `;
    
    try {
        const data = await api('getHelperRoles');
        const roles = data.roles || [];
        
        const rolesListEl = document.getElementById('roles-list');
        
        if (roles.length) {
            rolesListEl.innerHTML = roles.map(role => `
                <div class="role-card">
                    <div class="role-icon">${role.icon}</div>
                    <div style="flex:1;">
                        <div class="role-name">${sanitize(role.name)}</div>
                        <div class="role-desc">${sanitize(role.description)}</div>
                        ${role.agents && role.agents.length > 0 ? `
                            <div class="role-agents" style="margin-top:8px;">
                                <span style="color:#7b2cbf;font-size:11px;font-weight:600;">Assigned:</span>
                                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;">
                                    ${role.agents.map(agent => `
                                        <span class="agent-badge" style="background:rgba(123,44,191,0.2);color:#c9a0ff;padding:3px 8px;border-radius:12px;font-size:11px;">
                                            👤 ${sanitize(agent.name)}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                        ` : `
                            <div style="margin-top:8px;font-size:11px;color:#666;">
                                <span style="color:#ffd700;">⭐</span> Position open - Apply now!
                            </div>
                        `}
                    </div>
                </div>
            `).join('');
        } else {
            rolesListEl.innerHTML = '<p style="color:#888;text-align:center;">No roles defined yet</p>';
        }
    } catch (e) {
        document.getElementById('roles-list').innerHTML = '<p style="color:red;">Failed to load roles</p>';
    }
}

// ==================== ANNOUNCEMENTS ====================
async function renderAnnouncements() {
    const container = $('announcements-content');
    container.innerHTML = renderGuide('announcements');
    
    try {
        const data = await api('getAnnouncements', { week: STATE.week });
        const list = data.announcements || [];
        
        container.innerHTML += list.length ? list.map(a => `
            <div class="card announcement ${a.priority === 'high' ? 'urgent' : ''}">
                <div class="card-body">
                    <div class="announcement-header">
                        <span class="announcement-date">${a.created ? new Date(a.created).toLocaleDateString() : ''}</span>
                        ${a.priority === 'high' ? '<span class="urgent-badge">⚠️ IMPORTANT</span>' : ''}
                    </div>
                    <h3>${sanitize(a.title)}</h3>
                    <p>${sanitize(a.message)}</p>
                </div>
            </div>
        `).join('') : `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:40px;">
                    <div style="font-size:48px;margin-bottom:16px;">📢</div>
                    <p style="color:var(--text-dim);">No announcements at this time</p>
                    <p style="color:#666;font-size:12px;margin-top:10px;">Check back for important news from Admin!</p>
                </div>
            </div>
        `;
    } catch (e) { 
        container.innerHTML += '<div class="card"><div class="card-body"><p class="error-text">Failed to load announcements</p></div></div>'; 
    }
}

// ==================== SUMMARY (With Confetti) ====================
async function renderSummary() {
    const container = $('summary-content');
    const selectedWeek = STATE.week;
    const isCompleted = isWeekCompleted(selectedWeek);
    
    if (!isCompleted) {
        const days = getDaysRemaining(selectedWeek);
        container.innerHTML = `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:60px 20px;">
                    <div style="font-size:64px;margin-bottom:20px;">🔒</div>
                    <h2>Summary Locked</h2>
                    <p style="color:var(--text-dim);margin:16px 0;">Results for <strong>${selectedWeek}</strong> are not yet final.</p>
                    <div class="countdown-box">
                        <div class="countdown-value">${days}</div>
                        <div class="countdown-label">day${days !== 1 ? 's' : ''} until results</div>
                    </div>
                    <button onclick="loadPage('home')" class="btn-primary" style="margin-top:20px;">View Live Progress →</button>
                </div>
            </div>
        `;
        return;
    }
    
    try {
        const [summary, winners] = await Promise.all([
            api('getWeeklySummary', { week: selectedWeek }), 
            api('getWeeklyWinners').catch(() => ({ winners: [] }))
        ]);
        
        const teams = summary.teams || {};
        const sorted = Object.entries(teams).sort((a, b) => (b[1].teamXP || 0) - (a[1].teamXP || 0));
        const actualWinner = sorted[0]?.[0] || summary.winner;
        
        container.innerHTML = `
            <div class="summary-week-header">
                <h2>📊 ${selectedWeek} Results</h2>
                <p class="results-date">🏆 Battle Concluded</p>
            </div>
            
            ${actualWinner ? `
                <div class="card winner-card" style="border-color:${teamColor(actualWinner)};background:linear-gradient(135deg, ${teamColor(actualWinner)}22, #0a0a0f);">
                    <div class="card-body" style="text-align:center;padding:40px;">
                        <div style="font-size:80px;margin-bottom:16px;">🏆</div>
                        <h2 style="color:${teamColor(actualWinner)};font-size:28px;">Team ${actualWinner} WINS!</h2>
                        <p style="font-size:36px;color:#ffd700;margin-top:10px;">${fmt(teams[actualWinner]?.teamXP)} XP</p>
                    </div>
                </div>
            ` : ''}
            
            <div class="card">
                <div class="card-header"><h3>📊 Final Standings</h3></div>
                <div class="card-body">
                    ${sorted.map(([t, info], i) => `
                        <div class="final-standing ${i===0?'winner':''}" style="border-left: 4px solid ${teamColor(t)};padding:15px;margin-bottom:10px;background:${i===0 ? teamColor(t)+'11' : 'transparent'};border-radius:8px;">
                            <div style="display:flex;align-items:center;gap:15px;">
                                <span style="font-size:24px;">${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</span>
                                ${teamPfp(t) ? `<img src="${teamPfp(t)}" style="width:40px;height:40px;border-radius:50%;border:2px solid ${teamColor(t)}">` : ''}
                                <div style="flex:1;">
                                    <div style="color:${teamColor(t)};font-weight:600;font-size:16px;">${t}</div>
                                    <div style="color:#888;font-size:12px;">${info.trackGoalPassed?'🎵✅':'🎵❌'} ${info.albumGoalPassed?'💿✅':'💿❌'} ${info.album2xPassed?'✨✅':'✨❌'}</div>
                                </div>
                                <div style="text-align:right;">
                                    <div style="color:#ffd700;font-size:20px;font-weight:bold;">${fmt(info.teamXP)}</div>
                                    <div style="color:#888;font-size:11px;">XP</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
    } catch (e) { 
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load summary</p></div></div>'; 
    }
}

// ==================== RANKINGS ====================
async function renderRankings() {
    const container = $('rankings-list');
    if (!container) return;
    const myTeam = STATE.data?.profile?.team || 'Team';
    const tColor = teamColor(myTeam);
    
    container.innerHTML = `
        ${renderGuide('rankings')}
        <div class="ranking-tabs">
            <button id="rank-tab-overall" class="ranking-tab active">🏆 Overall</button>
            <button id="rank-tab-team" class="ranking-tab" style="--team-color: ${tColor};">${myTeam}</button>
        </div>
        <div id="rankings-content-container">
            <div class="loading-skeleton"><div class="skeleton-card"></div><div class="skeleton-card"></div></div>
        </div>
    `;
    
    $('rank-tab-overall').onclick = () => switchRankingTab('overall');
    $('rank-tab-team').onclick = () => switchRankingTab('team');
    await renderOverallRankings();
}

async function switchRankingTab(tab) {
    const overallTab = $('rank-tab-overall');
    const teamTab = $('rank-tab-team');
    const contentContainer = $('rankings-content-container');
    if (!overallTab || !teamTab || !contentContainer) return;
    
    contentContainer.innerHTML = `<div class="loading-skeleton"><div class="skeleton-card"></div></div>`;
    loading(true);
    
    if (tab === 'overall') { 
        overallTab.classList.add('active'); 
        teamTab.classList.remove('active'); 
        await renderOverallRankings(); 
    } else { 
        overallTab.classList.remove('active'); 
        teamTab.classList.add('active'); 
        await renderMyTeamRankings(); 
    }
    loading(false);
}

async function renderOverallRankings() {
    const container = $('rankings-content-container');
    if (!container) return;
    try {
        const data = await api('getRankings', { week: STATE.week, limit: 100 });
        if (data.lastUpdated) STATE.lastUpdated = data.lastUpdated;
        
        const rankingsHtml = (data.rankings || []).map((r, i) => `
            <div class="rank-item ${String(r.agentNo) === String(STATE.agentNo) ? 'highlight' : ''}">
                <div class="rank-num">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</div>
                <div class="rank-info">
                    <div class="rank-name">${sanitize(r.name)}${String(r.agentNo) === String(STATE.agentNo) ? ' (You)' : ''}</div>
                    <div class="rank-team" style="color:${teamColor(r.team)}">${r.team}</div>
                </div>
                <div class="rank-xp">${fmt(r.totalXP)} XP</div>
            </div>
        `).join('') || '<p class="empty-text">No ranking data yet</p>';
        
        container.innerHTML = `
            <div class="rankings-header"><span class="week-badge">${STATE.week}</span></div>
            ${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}
            ${rankingsHtml}
        `;
    } catch (e) { 
        container.innerHTML = '<p class="error-text">Failed to load overall rankings</p>'; 
    }
}

async function renderMyTeamRankings() {
    const container = $('rankings-content-container');
    if (!container) return;
    const myTeam = STATE.data?.profile?.team;
    if (!myTeam) { container.innerHTML = '<p class="error-text">Could not identify your team.</p>'; return; }
    
    try {
        const data = await api('getTeamRankings', { week: STATE.week, team: myTeam });
        if (data.lastUpdated) STATE.lastUpdated = data.lastUpdated;
        
        const rankingsHtml = (data.rankings || []).map((r, i) => `
            <div class="rank-item ${String(r.agentNo) === String(STATE.agentNo) ? 'highlight' : ''}" style="border-left-color: ${teamColor(myTeam)}">
                <div class="rank-num">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</div>
                <div class="rank-info">
                    <div class="rank-name">${sanitize(r.name)}${String(r.agentNo) === String(STATE.agentNo) ? ' (You)' : ''}</div>
                    <div class="rank-team" style="color:${teamColor(r.team)}">${r.team} Agent</div>
                </div>
                <div class="rank-xp">${fmt(r.totalXP)} XP</div>
            </div>
        `).join('') || '<p class="empty-text">No team ranking data yet</p>';
        
        container.innerHTML = `
            <div class="rankings-header"><span class="week-badge" style="background-color: ${teamColor(myTeam)}">${myTeam} Leaderboard</span></div>
            ${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}
            ${rankingsHtml}
        `;
    } catch (e) { 
        container.innerHTML = '<p class="error-text">Failed to load team rankings.</p>'; 
    }
}

// ==================== OTHER RENDERERS ====================
async function renderAlbum2x() {
    const container = $('album2x-content');
    const team = STATE.data?.profile?.team;
    const album2xStatus = STATE.data?.album2xStatus || {};
    const userTracks = album2xStatus.tracks || {};
    const teamTracks = CONFIG.TEAM_ALBUM_TRACKS[team] || [];
    const albumName = CONFIG.TEAMS[team]?.album || team;
    
    let completedCount = 0;
    const trackResults = teamTracks.map(track => {
        const count = userTracks[track] || 0;
        const passed = count >= 2;
        if (passed) completedCount++;
        return { name: track, count, passed };
    });
    
    const allComplete = completedCount === trackResults.length && trackResults.length > 0;
    const pct = trackResults.length ? Math.round((completedCount / trackResults.length) * 100) : 0;
    
    container.innerHTML = renderGuide('album2x') + `
        <div class="card" style="border-color:${allComplete ? 'var(--success)' : teamColor(team)}">
            <div class="card-body" style="text-align:center;padding:30px;">
                <div style="font-size:56px;margin-bottom:16px;">${allComplete ? '🎉' : '⏳'}</div>
                <h2 style="color:${teamColor(team)};margin-bottom:8px;">${sanitize(albumName)}</h2>
                <p style="color:var(--text-dim);margin-bottom:20px;">Stream every track at least 2 times</p>
                <div style="font-size:48px;font-weight:700;color:${allComplete ? 'var(--success)' : 'var(--purple-glow)'}">${completedCount}/${trackResults.length}</div>
                <p style="color:var(--text-dim);">Tracks completed</p>
                <div class="progress-bar" style="margin:20px auto;max-width:300px;height:12px;">
                    <div class="progress-fill ${allComplete ? 'complete' : ''}" style="width:${pct}%;background:${allComplete ? 'var(--success)' : teamColor(team)}"></div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><h3>📋 Track Checklist</h3></div>
            <div class="card-body">
                ${trackResults.map((t, i) => `
                    <div class="track-item ${t.passed ? 'passed' : 'pending'}" style="border-left-color:${t.passed ? 'var(--success)' : 'var(--danger)'}">
                        <span class="track-num">${i + 1}</span>
                        <span class="track-name">${sanitize(t.name)}</span>
                        <span class="track-status ${t.passed ? 'pass' : 'fail'}">${t.count}/2 ${t.passed ? '✅' : '❌'}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

async function renderTeamLevel() {
    const container = $('team-level-content');
    try {
        const summary = await api('getWeeklySummary', { week: STATE.week });
        const teams = summary.teams || {};
        const myTeam = STATE.data?.profile?.team;
        if (summary.lastUpdated) STATE.lastUpdated = summary.lastUpdated;
        const sortedTeams = Object.entries(teams).sort((a, b) => (b[1].teamXP || 0) - (a[1].teamXP || 0));
        
        container.innerHTML = renderGuide('team-level') + `
            <div class="team-level-header"><h2>Team Levels</h2><span class="week-badge">${STATE.week}</span></div>
            ${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}
            <div class="team-level-grid">
                ${sortedTeams.map(([t, info], index) => { 
                    const isMyTeam = t === myTeam; 
                    const tColor = teamColor(t);
                    const missions = (info.trackGoalPassed ? 1 : 0) + (info.albumGoalPassed ? 1 : 0) + (info.album2xPassed ? 1 : 0); 
                    return `
                        <div class="team-level-card ${isMyTeam ? 'my-team' : ''}" style="border-color:${tColor}">
                            ${isMyTeam ? '<div class="my-team-badge">Your Team</div>' : ''}
                            ${teamPfp(t) ? `<img src="${teamPfp(t)}" class="team-level-pfp" style="border-color:${tColor}">` : ''}
                            <div class="team-level-name" style="color:${tColor}">${t}</div>
                            <div class="team-level-num">${info.level || 1}</div>
                            <div class="team-level-label">LEVEL</div>
                            <div class="team-level-xp">${fmt(info.teamXP)} XP</div>
                            <div class="team-level-missions">
                                <div class="mission-check" title="Track Goals">${info.trackGoalPassed ? '🎵✅' : '🎵❌'}</div>
                                <div class="mission-check" title="Album Goals">${info.albumGoalPassed ? '💿✅' : '💿❌'}</div>
                                <div class="mission-check" title="Album 2X">${info.album2xPassed ? '✨✅' : '✨❌'}</div>
                            </div>
                            <div class="team-level-status ${missions === 3 ? 'complete' : ''}">${missions}/3 missions</div>
                        </div>
                    `; 
                }).join('')}
            </div>
        `;
    } catch (e) { 
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load team levels</p></div></div>'; 
    }
}

async function renderSecretMissions() {
    const container = $('secret-missions-content');
    if (!container) return;
    const myTeam = STATE.data?.profile?.team;
    container.innerHTML = '<div class="loading-skeleton"><div class="skeleton-card"></div></div>';
    
    try {
        const [missionsData, statsData] = await Promise.all([
            api('getTeamSecretMissions', { team: myTeam, agentNo: STATE.agentNo, week: STATE.week }).catch(() => ({ active: [], completed: [], myAssigned: [] })), 
            api('getTeamSecretStats', { week: STATE.week }).catch(() => ({ teams: {} }))
        ]);
        
        const activeMissions = missionsData.active || [];
        const completedMissions = missionsData.completed || [];
        const myAssigned = missionsData.myAssigned || [];
        const stats = statsData.teams || {};
        const myStats = stats[myTeam] || {};
        
        container.innerHTML = renderGuide('secret-missions') + `
            <div class="card secret-header-card" style="border-color:${teamColor(myTeam)}">
                <div class="card-body">
                    <div class="secret-header">
                        ${teamPfp(myTeam) ? `<img src="${teamPfp(myTeam)}" class="secret-team-pfp" style="border-color:${teamColor(myTeam)}">` : ''}
                        <div class="secret-header-info">
                            <div class="secret-team-name" style="color:${teamColor(myTeam)}">Team ${myTeam}</div>
                            <div class="secret-label">SECRET MISSION BONUS</div>
                        </div>
                        <div class="secret-xp-display">
                            <div class="secret-xp-value">+${myStats.secretXP || 0}</div>
                            <div class="secret-xp-max">/ ${CONFIG.SECRET_MISSIONS.maxTeamBonus} max XP</div>
                        </div>
                    </div>
                    <div class="secret-stats-row">
                        <div class="secret-stat"><span class="stat-value">${myStats.completed || 0}</span><span class="stat-label">Completed</span></div>
                        <div class="secret-stat"><span class="stat-value">${activeMissions.length}</span><span class="stat-label">Active</span></div>
                        <div class="secret-stat"><span class="stat-value">${CONFIG.SECRET_MISSIONS.maxMissionsPerTeam}</span><span class="stat-label">Max/Week</span></div>
                    </div>
                </div>
            </div>
            
            ${myAssigned.length ? `
                <div class="card urgent-card">
                    <div class="card-header"><h3>🎯 Your Assigned Missions</h3><span class="urgent-badge">Action Required</span></div>
                    <div class="card-body">${myAssigned.map(m => renderSecretMissionCard(m, myTeam, true)).join('')}</div>
                </div>
            ` : ''}
            
            <div class="card">
                <div class="card-header"><h3>🔒 Active Team Missions</h3></div>
                <div class="card-body">
                    ${activeMissions.length ? activeMissions.map(m => renderSecretMissionCard(m, myTeam, false)).join('') : `
                        <div class="empty-missions">
                            <div class="empty-icon">📭</div>
                            <p>No active secret missions</p>
                        </div>
                    `}
                </div>
            </div>
            
            <div class="card">
                <div class="card-header"><h3>📊 Team Intelligence Report</h3></div>
                <div class="card-body">
                    <div class="intel-grid">
                        ${Object.keys(CONFIG.TEAMS).map(t => { 
                            const tStats = stats[t] || {}; 
                            const isMyTeam = t === myTeam; 
                            return `
                                <div class="intel-card ${isMyTeam ? 'my-team' : ''}" style="border-color:${teamColor(t)}">
                                    ${teamPfp(t) ? `<img src="${teamPfp(t)}" class="intel-pfp">` : ''}
                                    <div class="intel-name" style="color:${teamColor(t)}">${t}</div>
                                    <div class="intel-xp">+${tStats.secretXP || 0} XP</div>
                                    <div class="intel-missions">${tStats.completed || 0}/${CONFIG.SECRET_MISSIONS.maxMissionsPerTeam} missions</div>
                                </div>
                            `; 
                        }).join('')}
                    </div>
                </div>
            </div>
            
            ${completedMissions.length ? `
                <div class="card">
                    <div class="card-header"><h3>✅ Completed Missions</h3></div>
                    <div class="card-body">
                        ${completedMissions.map(m => `
                            <div class="completed-mission">
                                <span class="completed-icon">${CONFIG.MISSION_TYPES[m.type]?.icon || '✅'}</span>
                                <div class="completed-info"><div class="completed-title">${sanitize(m.title)}</div></div>
                                <span class="completed-xp">+${m.xpReward || CONFIG.SECRET_MISSIONS.xpPerMission} XP</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    } catch (e) { 
        container.innerHTML = '<div class="card"><div class="card-body error-state"><p>Failed to load secret missions.</p></div></div>'; 
    }
}

function renderSecretMissionCard(mission, myTeam, isAssigned) {
    const missionInfo = CONFIG.MISSION_TYPES[mission.type] || { icon: '🔒', name: 'Mission' };
    const myProgress = mission.progress?.[myTeam] || 0;
    const goalTarget = mission.goalTarget || 100;
    const pct = Math.min((myProgress / goalTarget) * 100, 100);
    const isComplete = mission.completedTeams?.includes(myTeam);
    
    return `
        <div class="secret-mission-card ${isAssigned ? 'assigned' : ''} ${isComplete ? 'complete' : ''}">
            <div class="smc-stamp">${isAssigned ? '🎯 YOUR MISSION' : '🔒 CLASSIFIED'}</div>
            <div class="smc-header">
                <span class="smc-icon">${missionInfo.icon}</span>
                <div class="smc-title-section">
                    <div class="smc-type">${missionInfo.name}</div>
                    <div class="smc-title">${sanitize(mission.title)}</div>
                </div>
            </div>
            ${mission.assignedAgents?.length ? `
                <div class="smc-agents">
                    <div class="agents-label">Assigned Agents:</div>
                    <div class="agents-list">
                        ${mission.assignedAgents.map(a => `
                            <span class="agent-tag ${String(a.agentNo) === String(STATE.agentNo) ? 'is-me' : ''}" style="color:${teamColor(a.team)}">
                                ${String(a.agentNo) === String(STATE.agentNo) ? '👤 YOU' : `#${a.agentNo}`}
                            </span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            <div class="smc-briefing">${sanitize(mission.briefing || '')}</div>
            ${mission.targetTrack ? `
                <div class="smc-target">
                    <span class="target-label">TARGET:</span>
                    <span class="target-track">${sanitize(mission.targetTrack)}</span>
                    <span class="target-goal">${goalTarget} streams</span>
                </div>
            ` : ''}
            <div class="smc-progress">
                <div class="progress-header"><span>Team Progress</span><span>${myProgress}/${goalTarget}</span></div>
                <div class="progress-bar">
                    <div class="progress-fill ${isComplete ? 'complete' : ''}" style="width:${pct}%;background:${teamColor(myTeam)}"></div>
                </div>
                ${isComplete ? `<div class="progress-complete">✅ Mission Complete! +${mission.xpReward || 5} XP</div>` : `<div class="progress-remaining">${goalTarget - myProgress} more streams needed</div>`}
            </div>
            <div class="smc-footer"><span class="smc-reward">⭐ +${mission.xpReward || 5} XP</span></div>
        </div>
    `;
}

async function renderComparison() {
    const container = $('comparison-content');
    if (!container) return;
    const weekToShow = STATE.week;
    
    try {
        const [comparison, goals, summary] = await Promise.all([
            api('getTeamComparison', { week: weekToShow }), 
            api('getGoalsProgress', { week: weekToShow }), 
            api('getWeeklySummary', { week: weekToShow })
        ]);
        
        if (comparison.lastUpdated) STATE.lastUpdated = comparison.lastUpdated;
        const teams = (comparison.comparison || []).sort((a, b) => (b.teamXP || 0) - (a.teamXP || 0));
        const maxXP = teams[0]?.teamXP || 1;
        const trackGoals = goals.trackGoals || {};
        const albumGoals = goals.albumGoals || {};
        const teamNames = Object.keys(CONFIG.TEAMS);
        
        container.innerHTML = `
            ${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}
            <div class="card">
                <div class="card-header"><h3>⚔️ Battle Standings (${STATE.week})</h3></div>
                <div class="card-body">
                    ${teams.map((t, i) => `
                        <div class="comparison-item">
                            <span class="comparison-rank">${i+1}</span>
                            <span class="comparison-name" style="color:${teamColor(t.team)}">${t.team}</span>
                            <div class="comparison-bar-container">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width:${(t.teamXP/maxXP)*100}%;background:${teamColor(t.team)}"></div>
                                </div>
                            </div>
                            <span class="comparison-xp">${fmt(t.teamXP)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        if (Object.keys(trackGoals).length) {
            container.innerHTML += `
                <div class="card">
                    <div class="card-header"><h3>🎵 Track Goals</h3></div>
                    <div class="card-body comparison-goals-section">
                        ${Object.entries(trackGoals).map(([trackName, info]) => {
                            const goal = info.goal || 0;
                            return `
                                <div class="goal-comparison-block">
                                    <div class="goal-comparison-header">
                                        <span class="goal-track-name">${sanitize(trackName)}</span>
                                        <span class="goal-target">Goal: ${fmt(goal)} streams</span>
                                    </div>
                                    <div class="goal-team-progress">
                                        ${teamNames.map(teamName => {
                                            const tp = info.teams?.[teamName] || {};
                                            const current = tp.current || 0;
                                            const pct = goal > 0 ? Math.min((current/goal)*100, 100) : 0;
                                            const done = current >= goal;
                                            return `
                                                <div class="team-progress-row ${done ? 'complete' : ''}">
                                                    <span class="team-name-small" style="color:${teamColor(teamName)}">${teamName}</span>
                                                    <div class="progress-bar-small">
                                                        <div class="progress-fill ${done ? 'complete' : ''}" style="width:${pct}%;background:${teamColor(teamName)}"></div>
                                                    </div>
                                                    <span class="progress-text">${fmt(current)}/${fmt(goal)}</span>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
        
        if (Object.keys(albumGoals).length) {
            container.innerHTML += `
                <div class="card">
                    <div class="card-header"><h3>💿 Album Goals</h3></div>
                    <div class="card-body comparison-goals-section">
                        ${Object.entries(albumGoals).map(([albumName, info]) => {
                            const goal = info.goal || 0;
                            return `
                                <div class="goal-comparison-block">
                                    <div class="goal-comparison-header">
                                        <span class="goal-track-name">${sanitize(albumName)}</span>
                                        <span class="goal-target">Goal: ${fmt(goal)} streams</span>
                                    </div>
                                    <div class="goal-team-progress">
                                        ${teamNames.map(teamName => {
                                            const ap = info.teams?.[teamName] || {};
                                            const current = ap.current || 0;
                                            const pct = goal > 0 ? Math.min((current/goal)*100, 100) : 0;
                                            const done = current >= goal;
                                            return `
                                                <div class="team-progress-row ${done ? 'complete' : ''}">
                                                    <span class="team-name-small" style="color:${teamColor(teamName)}">${teamName}</span>
                                                    <div class="progress-bar-small">
                                                        <div class="progress-fill ${done ? 'complete' : ''}" style="width:${pct}%;background:${teamColor(teamName)}"></div>
                                                    </div>
                                                    <span class="progress-text">${fmt(current)}/${fmt(goal)}</span>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
    } catch (e) { 
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load comparison</p></div></div>'; 
    }
}
// ==================== MISSING FUNCTIONS - PART 1 ====================

// Check if current agent is admin
function isAdminAgent() {
    return String(STATE.agentNo).toUpperCase() === String(CONFIG.ADMIN_AGENT_NO).toUpperCase();
}

// Check admin status from localStorage
function checkAdminStatus() {
    const session = localStorage.getItem('adminSession');
    const expiry = localStorage.getItem('adminExpiry');
    
    if (session && expiry && Date.now() < parseInt(expiry)) {
        STATE.isAdmin = true;
        STATE.adminSession = session;
        addAdminIndicator();
    } else {
        STATE.isAdmin = false;
        STATE.adminSession = null;
        localStorage.removeItem('adminSession');
        localStorage.removeItem('adminExpiry');
    }
}

// Add admin indicator to UI
function addAdminIndicator() {
    if (!isAdminAgent()) return;
    
    // Remove existing indicator
    document.querySelectorAll('.admin-indicator').forEach(el => el.remove());
    
    const indicator = document.createElement('div');
    indicator.className = 'admin-indicator';
    indicator.innerHTML = `
        <style>
            .admin-indicator {
                position: fixed;
                top: 10px;
                right: 10px;
                background: linear-gradient(135deg, #7b2cbf, #5a1f99);
                color: #fff;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                z-index: 9999;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(123, 44, 191, 0.4);
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .admin-indicator:hover {
                transform: scale(1.05);
            }
        </style>
        <span>🔐</span>
        <span>ADMIN</span>
    `;
    indicator.onclick = () => {
        if (STATE.isAdmin) {
            showAdminPanel();
        } else {
            showAdminLogin();
        }
    };
    document.body.appendChild(indicator);
}

// Setup login form listeners
function setupLoginListeners() {
    const loginForm = $('login-form');
    const findBtn = $('find-btn');
    const agentInput = $('agent-input');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
    
    if (findBtn) {
        findBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
    
    if (agentInput) {
        agentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleLogin();
            }
        });
    }
}

// Handle login
async function handleLogin() {
    const agentInput = $('agent-input');
    const agentNo = agentInput?.value?.trim()?.toUpperCase();
    
    if (!agentNo) {
        showResult('Please enter your Agent ID', true);
        return;
    }
    
    loading(true);
    
    try {
        // Verify agent exists
        const data = await api('getAgentData', { agentNo, week: STATE.week || 'Week 1' });
        
        if (data.error) {
            showResult(data.error, true);
            return;
        }
        
        if (!data.profile) {
            showResult('Agent not found. Check your Agent ID.', true);
            return;
        }
        
        // Save and proceed
        STATE.agentNo = agentNo;
        STATE.data = data;
        localStorage.setItem('spyAgent', agentNo);
        
        checkAdminStatus();
        loadSeenResults();
        showResult(`Welcome, Agent ${data.profile.name}!`, false);
        
        setTimeout(() => loadDashboard(), 500);
        
    } catch (e) {
        console.error('Login error:', e);
        showResult('Connection failed. Try again.', true);
    } finally {
        loading(false);
    }
}

// Load all agents for autocomplete/search
async function loadAllAgents() {
    try {
        const data = await api('getAllAgents');
        STATE.allAgents = data.agents || [];
    } catch (e) {
        console.log('Could not load agents list');
        STATE.allAgents = [];
    }
}

// Load dashboard after login
async function loadDashboard() {
    loading(true);
    
    try {
        // Get available weeks
        const weeksData = await api('getAvailableWeeks');
        STATE.weeks = weeksData.weeks || ['Week 1'];
        STATE.week = weeksData.current || STATE.weeks[0];
        
        // Get agent data for current week
        const agentData = await api('getAgentData', { 
            agentNo: STATE.agentNo, 
            week: STATE.week 
        });
        STATE.data = agentData;
        
        // Load all weeks data for drawer (badges from all weeks)
        await loadAllWeeksData();
        
        // Hide login, show dashboard
        const loginSection = $('login-section');
        const dashboard = $('dashboard');
        
        if (loginSection) loginSection.style.display = 'none';
        if (dashboard) {
            dashboard.style.display = 'block';
            dashboard.classList.add('active');
        }
        
        // Setup navigation
        setupNavigation();
        
        // Setup week selector
        setupWeekSelector();
        
        // Load home page
        await loadPage('home');
        
    } catch (e) {
        console.error('Dashboard load error:', e);
        showToast('Failed to load dashboard', 'error');
    } finally {
        loading(false);
    }
}

// Load data from all weeks for drawer
async function loadAllWeeksData() {
    try {
        const allData = await api('getAgentAllWeeks', { agentNo: STATE.agentNo });
        STATE.allWeeksData = allData;
    } catch (e) {
        console.log('Could not load all weeks data');
        STATE.allWeeksData = null;
    }
}

// Setup navigation handlers
function setupNavigation() {
    // Bottom navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            if (page) {
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                loadPage(page);
            }
        });
    });
    
    // Sidebar menu items
    document.querySelectorAll('.sidebar-menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            if (page) {
                closeSidebar();
                loadPage(page);
            }
        });
    });
    
    // Hamburger menu
    const hamburger = $('hamburger-btn') || document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const sidebar = $('sidebar');
            if (sidebar) sidebar.classList.toggle('open');
        });
    }
    
    // Sidebar close button
    const sidebarClose = $('sidebar-close');
    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }
    
    // Click outside sidebar to close
    document.addEventListener('click', (e) => {
        const sidebar = $('sidebar');
        const hamburger = $('hamburger-btn') || document.querySelector('.hamburger');
        if (sidebar && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !hamburger?.contains(e.target)) {
                closeSidebar();
            }
        }
    });
}

// Setup week selector
function setupWeekSelector() {
    const weekSelector = $('week-selector');
    if (weekSelector) {
        weekSelector.innerHTML = STATE.weeks.map(w => 
            `<option value="${w}" ${w === STATE.week ? 'selected' : ''}>${w}</option>`
        ).join('');
        
        weekSelector.addEventListener('change', async (e) => {
            STATE.week = e.target.value;
            loading(true);
            try {
                const agentData = await api('getAgentData', { 
                    agentNo: STATE.agentNo, 
                    week: STATE.week 
                });
                STATE.data = agentData;
                await loadPage(STATE.page);
            } catch (err) {
                showToast('Failed to switch week', 'error');
            } finally {
                loading(false);
            }
        });
    }
}

// Logout function
function logout() {
    STATE.agentNo = null;
    STATE.data = null;
    STATE.isAdmin = false;
    STATE.adminSession = null;
    STATE.allWeeksData = null;
    
    localStorage.removeItem('spyAgent');
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminExpiry');
    
    // Remove admin indicator
    document.querySelectorAll('.admin-indicator').forEach(el => el.remove());
    
    // Show login, hide dashboard
    const loginSection = $('login-section');
    const dashboard = $('dashboard');
    
    if (loginSection) loginSection.style.display = 'flex';
    if (dashboard) {
        dashboard.style.display = 'none';
        dashboard.classList.remove('active');
    }
    
    // Clear input
    const agentInput = $('agent-input');
    if (agentInput) agentInput.value = '';
    
    showToast('Logged out successfully', 'success');
}

// Exit admin mode
function exitAdminMode() {
    STATE.isAdmin = false;
    STATE.adminSession = null;
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminExpiry');
    
    document.querySelectorAll('.admin-indicator').forEach(el => el.remove());
    closeAdminPanel();
    
    showToast('Admin mode deactivated', 'info');
}

// ==================== ADMIN PANEL FUNCTIONS ====================

// Switch admin tabs
function switchAdminTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Update tab content
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `admin-tab-${tabName}`);
    });
}

// Render create mission form
function renderCreateMissionForm() {
    const teams = Object.keys(CONFIG.TEAMS);
    const missionTypes = CONFIG.MISSION_TYPES;
    
    return `
        <div class="create-mission-form">
            <div class="form-section">
                <h4>Mission Type</h4>
                <div class="mission-type-grid">
                    ${Object.entries(missionTypes).map(([key, info]) => `
                        <div class="mission-type-option" data-type="${key}" onclick="selectMissionType('${key}')">
                            <div style="font-size:24px;">${info.icon}</div>
                            <div style="font-size:12px;margin-top:5px;">${info.name}</div>
                        </div>
                    `).join('')}
                </div>
                <input type="hidden" id="mission-type" value="">
            </div>
            
            <div class="form-section">
                <h4>Mission Title</h4>
                <input type="text" id="mission-title" class="form-input" placeholder="Enter mission title...">
            </div>
            
            <div class="form-section">
                <h4>Briefing / Instructions</h4>
                <textarea id="mission-briefing" class="form-textarea" placeholder="Enter mission details..."></textarea>
            </div>
            
            <div class="form-section">
                <h4>Target Track (Optional)</h4>
                <input type="text" id="mission-target" class="form-input" placeholder="Track name for streaming mission...">
            </div>
            
            <div class="form-section">
                <h4>Goal Target (Streams)</h4>
                <input type="number" id="mission-goal" class="form-input" value="100" min="1">
            </div>
            
            <div class="form-section">
                <h4>XP Reward</h4>
                <input type="number" id="mission-xp" class="form-input" value="5" min="1" max="25">
            </div>
            
            <div class="form-section">
                <h4>Assign to Teams</h4>
                <div class="team-checkboxes">
                    <label class="team-checkbox" onclick="toggleAllTeams(this)">
                        <input type="checkbox" id="team-all" checked>
                        <span>All Teams</span>
                    </label>
                    ${teams.map(t => `
                        <label class="team-checkbox">
                            <input type="checkbox" class="team-check" value="${t}" checked>
                            <span style="color:${teamColor(t)}">${t}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
            
            <div class="form-actions">
                <button type="button" onclick="createTeamMission()" class="btn-primary" style="width:100%;">
                    🚀 Deploy Mission
                </button>
            </div>
        </div>
    `;
}

// Select mission type
function selectMissionType(type) {
    document.querySelectorAll('.mission-type-option').forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.type === type);
    });
    
    const typeInput = document.getElementById('mission-type');
    if (typeInput) typeInput.value = type;
}

// Toggle all teams checkbox
function toggleAllTeams(el) {
    const allCheckbox = el.querySelector('input');
    const isChecked = allCheckbox?.checked;
    
    document.querySelectorAll('.team-check').forEach(cb => {
        cb.checked = isChecked;
    });
}

// Create team mission
async function createTeamMission() {
    const type = document.getElementById('mission-type')?.value;
    const title = document.getElementById('mission-title')?.value?.trim();
    const briefing = document.getElementById('mission-briefing')?.value?.trim();
    const targetTrack = document.getElementById('mission-target')?.value?.trim();
    const goalTarget = parseInt(document.getElementById('mission-goal')?.value) || 100;
    const xpReward = parseInt(document.getElementById('mission-xp')?.value) || 5;
    
    const selectedTeams = [];
    document.querySelectorAll('.team-check:checked').forEach(cb => {
        selectedTeams.push(cb.value);
    });
    
    if (!type) {
        showToast('Please select a mission type', 'error');
        return;
    }
    
    if (!title) {
        showToast('Please enter a mission title', 'error');
        return;
    }
    
    if (selectedTeams.length === 0) {
        showToast('Please select at least one team', 'error');
        return;
    }
    
    loading(true);
    
    try {
        const result = await api('createSecretMission', {
            week: STATE.week,
            type,
            title,
            briefing,
            targetTrack,
            goalTarget,
            xpReward,
            teams: selectedTeams,
            createdBy: STATE.agentNo
        });
        
        if (result.success) {
            showToast('Mission deployed successfully!', 'success');
            
            // Reset form
            document.getElementById('mission-title').value = '';
            document.getElementById('mission-briefing').value = '';
            document.getElementById('mission-target').value = '';
            document.querySelectorAll('.mission-type-option').forEach(opt => opt.classList.remove('selected'));
            document.getElementById('mission-type').value = '';
            
            // Switch to active tab
            switchAdminTab('active');
            loadActiveTeamMissions();
        } else {
            showToast(result.error || 'Failed to create mission', 'error');
        }
    } catch (e) {
        console.error('Create mission error:', e);
        showToast('Failed to create mission', 'error');
    } finally {
        loading(false);
    }
}

// Load active team missions for admin panel
async function loadActiveTeamMissions() {
    const container = document.getElementById('admin-tab-active');
    if (!container) return;
    
    container.innerHTML = '<div class="loading-text">Loading missions...</div>';
    
    try {
        const data = await api('getAdminMissions', { week: STATE.week, status: 'active' });
        const missions = data.missions || [];
        
        if (missions.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:40px;color:#888;">
                    <div style="font-size:48px;margin-bottom:15px;">📭</div>
                    <p>No active missions</p>
                    <button onclick="switchAdminTab('create')" class="btn-primary" style="margin-top:15px;">
                        + Create New Mission
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = missions.map(m => `
            <div class="admin-mission-card">
                <div style="flex:1;">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">
                        <span style="font-size:20px;">${CONFIG.MISSION_TYPES[m.type]?.icon || '🔒'}</span>
                        <span style="color:#fff;font-weight:600;">${sanitize(m.title)}</span>
                    </div>
                    <div style="color:#888;font-size:12px;">
                        Teams: ${(m.teams || []).join(', ')} | Goal: ${m.goalTarget} | XP: ${m.xpReward}
                    </div>
                </div>
                <div style="display:flex;gap:8px;">
                    <button onclick="adminCompleteMission('${m.id}')" class="btn-primary" style="padding:8px 12px;font-size:12px;">
                        ✅ Complete
                    </button>
                    <button onclick="adminCancelMission('${m.id}')" class="btn-secondary" style="padding:8px 12px;font-size:12px;">
                        ❌ Cancel
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (e) {
        container.innerHTML = '<p style="color:red;text-align:center;">Failed to load missions</p>';
    }
}

// Admin complete mission
async function adminCompleteMission(missionId) {
    if (!confirm('Mark this mission as completed for all teams?')) return;
    
    loading(true);
    try {
        const result = await api('completeMission', { 
            missionId, 
            week: STATE.week,
            completedBy: STATE.agentNo 
        });
        
        if (result.success) {
            showToast('Mission completed!', 'success');
            loadActiveTeamMissions();
        } else {
            showToast(result.error || 'Failed to complete mission', 'error');
        }
    } catch (e) {
        showToast('Failed to complete mission', 'error');
    } finally {
        loading(false);
    }
}

// Admin cancel mission
async function adminCancelMission(missionId) {
    if (!confirm('Are you sure you want to cancel this mission?')) return;
    
    loading(true);
    try {
        const result = await api('cancelMission', { 
            missionId, 
            week: STATE.week,
            cancelledBy: STATE.agentNo 
        });
        
        if (result.success) {
            showToast('Mission cancelled', 'success');
            loadActiveTeamMissions();
        } else {
            showToast(result.error || 'Failed to cancel mission', 'error');
        }
    } catch (e) {
        showToast('Failed to cancel mission', 'error');
    } finally {
        loading(false);
    }
}

// Load mission history for admin
async function loadMissionHistory() {
    const container = document.getElementById('admin-tab-history');
    if (!container) return;
    
    container.innerHTML = '<div class="loading-text">Loading history...</div>';
    
    try {
        const data = await api('getAdminMissions', { week: STATE.week, status: 'all' });
        const missions = data.missions || [];
        
        if (missions.length === 0) {
            container.innerHTML = '<p style="color:#888;text-align:center;padding:40px;">No mission history</p>';
            return;
        }
        
        container.innerHTML = missions.map(m => `
            <div class="admin-mission-card" style="opacity:${m.status === 'completed' ? '0.7' : '1'}">
                <div style="flex:1;">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">
                        <span style="font-size:20px;">${CONFIG.MISSION_TYPES[m.type]?.icon || '🔒'}</span>
                        <span style="color:#fff;font-weight:600;">${sanitize(m.title)}</span>
                        <span style="font-size:10px;padding:2px 8px;border-radius:10px;background:${m.status === 'completed' ? '#2ecc71' : m.status === 'cancelled' ? '#e74c3c' : '#7b2cbf'}22;color:${m.status === 'completed' ? '#2ecc71' : m.status === 'cancelled' ? '#e74c3c' : '#7b2cbf'};">
                            ${m.status?.toUpperCase() || 'ACTIVE'}
                        </span>
                    </div>
                    <div style="color:#888;font-size:12px;">
                        Teams: ${(m.teams || []).join(', ')} | XP: ${m.xpReward}
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (e) {
        container.innerHTML = '<p style="color:red;text-align:center;">Failed to load history</p>';
    }
}

// Render admin assets (badge preview)
function renderAdminAssets() {
    const container = document.getElementById('admin-tab-assets');
    if (!container) return;
    
    const pool = CONFIG.BADGE_POOL;
    
    container.innerHTML = `
        <div style="padding:15px 0;">
            <h4 style="color:#fff;margin-bottom:5px;">Badge Pool Preview</h4>
            <p style="color:#888;font-size:12px;margin-bottom:20px;">
                ${pool.length} badges available. Click to preview.
            </p>
            <div class="assets-grid">
                ${pool.map((url, i) => `
                    <div class="asset-chip" onclick="previewAsset('${url}', ${i + 1})">
                        <div class="asset-chip-inner">
                            <div class="asset-chip-number">#${i + 1}</div>
                            <img src="${url}" onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;font-size:24px;\\'>❓</div>'">
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Preview asset in modal
function previewAsset(url, num) {
    // Remove existing preview modal
    document.querySelectorAll('.asset-preview-modal').forEach(m => m.remove());
    
    const modal = document.createElement('div');
    modal.className = 'asset-preview-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    `;
    
    modal.innerHTML = `
        <div style="text-align:center;">
            <div class="badge-circle holographic" style="width:150px;height:150px;margin:0 auto 20px;">
                <img src="${url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">
            </div>
            <p style="color:#ffd700;font-size:18px;margin-bottom:5px;">Badge #${num}</p>
            <p style="color:#888;font-size:12px;margin-bottom:20px;">Level ${num} Badge</p>
            <button onclick="this.closest('.asset-preview-modal').remove()" class="btn-secondary">
                Close
            </button>
        </div>
    `;
    
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    document.body.appendChild(modal);
}

// View week results
function viewResults(week) {
    STATE.week = week;
    loadPage('summary');
}

// Dismiss results notification
function dismissResults(week) {
    markResultsSeen(week);
    const notification = document.querySelector(`.results-notification[data-week="${week}"]`);
    if (notification) notification.remove();
}

// ==================== REFRESH & SYNC ====================

// Refresh current page data
async function refreshData() {
    loading(true);
    try {
        const agentData = await api('getAgentData', { 
            agentNo: STATE.agentNo, 
            week: STATE.week 
        });
        STATE.data = agentData;
        await loadPage(STATE.page);
        showToast('Data refreshed', 'success');
    } catch (e) {
        showToast('Refresh failed', 'error');
    } finally {
        loading(false);
    }
}

// Auto-refresh timer (every 5 minutes)
let refreshInterval = null;

function startAutoRefresh() {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(() => {
        if (STATE.agentNo && document.visibilityState === 'visible') {
            refreshData();
        }
    }, 5 * 60 * 1000); // 5 minutes
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}

// Visibility change handler
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && STATE.agentNo) {
        // Refresh when returning to tab
        refreshData();
    }
});

// ==================== ADDITIONAL EXPORTS ====================

window.handleLogin = handleLogin;
window.refreshData = refreshData;
window.loadDashboard = loadDashboard;

console.log('✅ BTS Spy Battle v5.0 - All functions loaded');

// ==================== EXPORTS & INIT ====================
document.addEventListener('DOMContentLoaded', initApp);

window.loadPage = loadPage;
window.logout = logout;
window.showAdminPanel = showAdminPanel;
window.showAdminLogin = showAdminLogin;
window.closeAdminModal = closeAdminModal;
window.closeAdminPanel = closeAdminPanel;
window.verifyAdminPassword = verifyAdminPassword;
window.exitAdminMode = exitAdminMode;
window.selectMissionType = selectMissionType;
window.toggleAllTeams = toggleAllTeams;
window.createTeamMission = createTeamMission;
window.adminCompleteMission = adminCompleteMission;
window.adminCancelMission = adminCancelMission;
window.switchAdminTab = switchAdminTab;
window.previewAsset = previewAsset;
window.viewResults = viewResults;
window.dismissResults = dismissResults;

console.log('🎮 BTS Spy Battle v5.0 Loaded (Full Features)');
