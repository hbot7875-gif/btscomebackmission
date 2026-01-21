(function() {
// ==================== MAIN CONFIG ====================
const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbx5ArHi5Ws0NxMa9nhORy6bZ7ZYpW4urPIap24tax9H1HLuGQxYRCgTVwDaKOMrZ7JOGA/exec',
    
    ADMIN_AGENT_NO: 'AGENT000',

    // ==================== WEEK DATES ====================
    WEEK_DATES: {
        'Test Week 1': '2025-11-29',
        'Test Week 2': '2025-12-06',
        'Week 1': '2025-12-13',
        'Week 2': '2025-12-20',
        'Week 3': '2025-12-27',
        'Week 4': '2026-01-03',
        'Week 5': '2026-01-10',
        'Week 6': '2026-01-17',
        'Week 7': '2026-01-24',
        'Week 8': '2026-01-31',
        'Week 9': '2026-02-07',
        'Week 10': '2026-02-14',
        'Week 11': '2026-02-21',
        'Week 12': '2026-02-28',
        'Week 13': '2026-03-07',
        'Week 14': '2026-03-14',
        'Week 15': '2026-03-21',
        'Week 16': '2026-03-28'
    },

    // ==================== BADGE SYSTEM ====================
    BADGE_REPO_URL: 'https://raw.githubusercontent.com/hbot7875-gif/btscomebackmission/main/lvl1badges/',
    TOTAL_BADGE_IMAGES: 60,
    EXCLUDE_BADGES: [],

    get BADGE_POOL() {
        const pool = [];
        for (let i = 1; i <= this.TOTAL_BADGE_IMAGES; i++) {
            if (!this.EXCLUDE_BADGES.includes(i)) {
                pool.push(`${this.BADGE_REPO_URL}BTS%20(${i}).jpg`);
            }
        }
        return pool;
    },

    // ==================== ALBUM CHALLENGE ====================
    ALBUM_CHALLENGE: {
        REQUIRED_STREAMS: 2,
        CHALLENGE_NAME: "2X",
        BADGE_NAME: "2X Master",
        BADGE_DESCRIPTION: "Completed Album 2X Challenge"
    },

    // ==================== TEAMS ====================
    TEAMS: {
        'Team Indigo': { color: '#FFE082', album: 'MOTS: Persona' },
        'Team Echo': { color: '#FAFAFA', album: 'BE' },
        'Team Agust D': { color: '#B0BEC5', album: 'Agust D' }, 
        'Team JITB': { color: '#FF4081', album: 'Jack In The Box' }
    },

    TEAM_PFPS: {
        "Team Indigo": "https://raw.githubusercontent.com/hbot7875-gif/btscomebackmission/be0a3cc8ca6b395b4ceb74a1eb01207b9b756b4c/team%20pfps/teamindigo.jpg",
        "Team Echo": "https://raw.githubusercontent.com/hbot7875-gif/btscomebackmission/be0a3cc8ca6b395b4ceb74a1eb01207b9b756b4c/team%20pfps/teamecho.jpg",
        "Team Agust D": "https://raw.githubusercontent.com/hbot7875-gif/btscomebackmission/be0a3cc8ca6b395b4ceb74a1eb01207b9b756b4c/team%20pfps/teamagustd.jpg",
        "Team JITB": "https://raw.githubusercontent.com/hbot7875-gif/btscomebackmission/be0a3cc8ca6b395b4ceb74a1eb01207b9b756b4c/team%20pfps/teamjitb.jpg"
    },

    // ==================== VERSIONED ALBUM SYSTEM ====================
    ALBUM_VERSIONS: {
        "v1": {
            weeks: ["Week 1", "Week 2", "Week 3", "Week 4", "Test Week 1", "Test Week 2"],
            albums: {
                "Team Indigo": ["Yun (with Erykah Badu)", "Still Life (with Anderson .Paak)", "All Day (with Tablo)", "Forg_tful (with Kim Sawol)", "Closer (with Paul Blanco, Mahalia)", "Change pt.2", "Lonely", "Hectic (with Colde)", "Wild Flower (with youjeen)", "No.2 (with parkjiyoon)"],
                "Team Echo": ["Don't Say You Love Me", "Nothing Without Your Love", "Loser (feat. YENA)", "Rope It", "With the Clouds", "Background", "To Me, Today"],
                "Team Agust D": ["Intro : Dt sugA", "Agust D", "Skit", "So far away (feat. Suran)", "140503 at Dawn", "Tony Montana", "give it to me", "Interlude : Dream, Reality", "The Last", "724148"],
                "Team JITB": ["Intro", "Pandora's Box", "MORE", "STOP", "= (Equal Sign)", "Music Box : Reflection", "What if...", "Safety Zone", "Future", "Arson"]
            }
        },
        "v2": {
            weeks: [],
            albums: {
                "Team Indigo": ["Intro: Persona", "Boy With Luv (feat. Halsey)", "Mikrokosmos", "Make It Right", "HOME", "Jamais Vu", "Dionysus"],
                "Team Echo": ["Life Goes On", "Fly to My Room", "Blue & Grey", "Skit", "Telepathy", "Dis-ease", "Stay", "Dynamite"],
                "Team Agust D": ["Intro : Dt sugA", "Agust D", "Skit", "So far away (feat. Suran)", "140503 at Dawn", "Tony Montana", "give it to me", "Interlude : Dream, Reality", "The Last", "724148"],
                "Team JITB": ["Intro", "Pandora's Box", "MORE", "STOP", "= (Equal Sign)", "Music Box : Reflection", "What if...", "Safety Zone", "Future", "Arson"]
            }
        }
    },

    getTeamAlbumTracksForWeek(weekLabel) {
        if (this.ALBUM_VERSIONS.v1.weeks.includes(weekLabel)) {
            return this.ALBUM_VERSIONS.v1.albums;
        }
        return this.ALBUM_VERSIONS.v2.albums;
    },

    get TEAM_ALBUM_TRACKS() {
        const week = (typeof STATE !== 'undefined' && STATE.week) ? STATE.week : 'Week 5';
        return this.getTeamAlbumTracksForWeek(week);
    },

    // ==================== SECRET MISSIONS ====================
    SECRET_MISSIONS: { 
        xpPerMission: 5, 
        maxMissionsPerTeam: 5, 
        maxTeamBonus: 25 
    },

    MISSION_TYPES: {
        'switch_app': { name: 'Switch App', icon: '🔄', description: 'Switch to YouTube/Apple Music for 1 hour.' },
        'filler_mode': { name: 'Filler Mode', icon: '🧬', description: 'Stream 1 BTS Song + 2 Non-Kpop songs.' },
        'old_songs': { name: 'Old Songs', icon: '🕰️', description: 'Stream tracks older than 2 years.' },
        'stream_party': { name: 'Stream Party', icon: '🎉', description: 'Everyone streams the exact same playlist NOW.' },
        'custom': { name: 'Custom Task', icon: '⭐', description: 'Special instruction from Admin.' }
    },

    // ==================== BTS COMEBACK ====================
    COMEBACK: {
        ALBUM_NAME: "BTS 5th Album",
        RELEASE_DATE: "2026-03-20T13:00:00+09:00",
        SHOW_COUNTDOWN: true,
        BTS_LOGO: "https://raw.githubusercontent.com/hbot7875-gif/btscomebackmission/4f6fef44395ff9ca1609131af105a19db01e4e19/team%20pfps/cover.png",
        ALBUM_COVER: "https://raw.githubusercontent.com/hbot7875-gif/btscomebackmission/4f6fef44395ff9ca1609131af105a19db01e4e19/team%20pfps/cover.png"
    }
};

const STREAK_CONFIG = {
    // Activity requirement
    ACTIVITY_THRESHOLD: 10, // Scrobbles needed per day
    
    // Milestones
    MILESTONES: [3, 7, 14, 21, 30, 50, 100],
    
    // Badges for each milestone
    BADGES: {
        3:   { name: 'Begin',        icon: '🌱', color: '#00ff88' },
        7:   { name: 'Fire ',        icon: '🔥', color: '#ff6b35' },
        14:  { name: 'Not Today',    icon: '⚡', color: '#ffd700' },
        21:  { name: 'Runner',       icon: '💪', color: '#ff4081' },
        30:  { name: 'Mic Drop',     icon: '👑', color: '#9c27b0' },
        50:  { name: 'Mikrokosmos',  icon: '🌟', color: '#00bcd4' },
        100: { name: 'Bulletproof',  icon: '💜', color: '#7b2cbf' }
    },
    
    // Freeze settings
    FREEZE: {
        maxFreezes: 2,
        freezeCostXP: 20,
        monthlyFreeFreeze: 1
    },
    
    // Risk notification
    RISK_HOURS: 4,
    NOTIFY_AT_RISK: true
};

// ==================== STATE ====================

const STREAK_STATE = {
    current: 0,
    longest: 0,
    lastActiveDate: null,
    freezesRemaining: 2,
    freezesUsedThisMonth: 0,
    streakHistory: [],
    isAtRisk: false,
    todayCompleted: false,
    // ✅ NEW FIELDS FOR REAL-TIME TRACKING
    todayStreams: 0, 
    dailyTarget: 10
};

// ==================== ACTIVITY CONFIG ====================
const ACTIVITY_CONFIG = {
    MAX_ACTIVITIES: 50,
    REFRESH_INTERVAL: 15000,
    SHOW_TYPES: [
        'stream_milestone', 
        'xp_milestone', 
        'streak_update', 
        'badge_earned', 
        'goal_completed', 
        'album2x_completed', 
        'team_surge', 
        'rank_change', 
        'secret_mission'
    ],
    
    TYPES: {
        'stream_milestone': {
            icon: '🎵',
            template: (data) => `<strong>${data.name}</strong> hit <strong class="highlight">${data.streams}</strong> streams!`,
            color: '#00ff88'
        },
        'xp_milestone': {
            icon: '⭐',
            template: (data) => `<strong>${data.name}</strong> reached <strong class="highlight">${data.xp} XP</strong>!`,
            color: '#ffd700'
        },
        'streak_update': {
            icon: '🔥',
            template: (data) => `<strong>${data.name}</strong> is on a <strong class="highlight">${data.streak}-day</strong> streak!`,
            color: '#ff6b35'
        },
        'badge_earned': {
            icon: '🎖️',
            template: (data) => `<strong>${data.name}</strong> earned the <strong class="highlight">${data.badge}</strong> badge!`,
            color: '#7b2cbf'
        },
        'goal_completed': {
            icon: '🎯',
            template: (data) => `<strong style="color:${teamColor(data.team)}">${data.team}</strong> completed <strong class="highlight">${data.goal}</strong>!`,
            color: '#00ff88'
        },
        'album2x_completed': {
            icon: '✨',
            template: (data) => `<strong>${data.name}</strong> completed Album 2X!`,
            color: '#c56cf0'
        },
        'team_surge': {
            icon: '⚡',
            template: (data) => `<strong style="color:${teamColor(data.team)}">${data.team}</strong> is on fire! <strong class="highlight">${data.streams}</strong> streams in the last hour!`,
            color: '#ff4081'
        },
        'rank_change': {
            icon: '📈',
            template: (data) => `<strong>${data.name}</strong> moved up to <strong class="highlight">#${data.rank}</strong>!`,
            color: '#4caf50'
        },
        'secret_mission': {
            icon: '🕵️',
            template: (data) => `<strong style="color:${teamColor(data.team)}">${data.team}</strong> completed a secret mission!`,
            color: '#9c27b0'
        }
    }
};

// ==================== ACTIVITY STATE ====================
const ACTIVITY_STATE = {
    activities: [],
    lastFetch: null,
    isLoading: false,
    autoRefreshInterval: null
};

// ==================== BTS COUNTDOWN FUNCTIONS ====================
function renderBTSCountdown() {
    if (!CONFIG.COMEBACK?.SHOW_COUNTDOWN) return '';
    
    const now = new Date().getTime();
    const target = new Date(CONFIG.COMEBACK.RELEASE_DATE).getTime();
    const diff = target - now;
    
    if (diff <= 0) {
        return `
            <div class="bts-countdown-wrap">
                <div class="bts-ticker">
                    <img src="${CONFIG.COMEBACK.BTS_LOGO}" alt="BTS" class="bts-countdown-logo" onerror="this.outerHTML='<span class=\\'bts-countdown-text\\'>BTS</span>'">
                    <div class="bts-released">OUT NOW 🎉</div>
                </div>
                <div class="bts-credit">© BIGHIT MUSIC / HYBE</div>
            </div>
        `;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `
        <div class="bts-countdown-wrap" id="bts-countdown">
            <div class="bts-ticker">
                <img src="${CONFIG.COMEBACK.BTS_LOGO}" alt="BTS" class="bts-countdown-logo" onerror="this.outerHTML='<span class=\\'bts-countdown-text\\'>BTS</span>'">
                <div class="bts-countdown">
                    <div class="bts-time-unit">
                        <span class="bts-number" id="bts-days">${String(days).padStart(2,'0')}</span>
                        <span class="bts-label">d</span>
                    </div>
                    <div class="bts-time-unit">
                        <span class="bts-number" id="bts-hours">${String(hours).padStart(2,'0')}</span>
                        <span class="bts-label">h</span>
                    </div>
                    <div class="bts-time-unit">
                        <span class="bts-number" id="bts-mins">${String(mins).padStart(2,'0')}</span>
                        <span class="bts-label">m</span>
                    </div>
                    <div class="bts-time-unit">
                        <span class="bts-number" id="bts-secs">${String(secs).padStart(2,'0')}</span>
                        <span class="bts-label">s</span>
                    </div>
                </div>
            </div>
            <div class="bts-credit">© BIGHIT MUSIC / HYBE</div>
        </div>
    `;
}

function startBTSCountdown() {
    if (!CONFIG.COMEBACK?.SHOW_COUNTDOWN) return;
    if (window.btsCountdownInterval) clearInterval(window.btsCountdownInterval);

    window.btsCountdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const target = new Date(CONFIG.COMEBACK.RELEASE_DATE).getTime();
        const diff = target - now;
        
        if (diff <= 0) {
            clearInterval(window.btsCountdownInterval);
            const el = document.getElementById('bts-countdown');
            if (el) {
                el.innerHTML = `
                    <div class="bts-ticker">
                        <img src="${CONFIG.COMEBACK.ALBUM_COVER}" alt="BTS" class="bts-logo" onerror="this.outerHTML='<span class=\\'bts-logo-text\\'>BTS</span>'">
                        <div class="bts-released">OUT NOW 🎉</div>
                    </div>
                    <div class="bts-credit">© BIGHIT MUSIC / HYBE</div>
                `;
            }
            return;
        }
        
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        
        const daysEl = document.getElementById('bts-days');
        const hoursEl = document.getElementById('bts-hours');
        const minsEl = document.getElementById('bts-mins');
        const secsEl = document.getElementById('bts-secs');
        
        if (daysEl) daysEl.textContent = String(d).padStart(2,'0');
        if (hoursEl) hoursEl.textContent = String(h).padStart(2,'0');
        if (minsEl) minsEl.textContent = String(m).padStart(2,'0');
        if (secsEl) secsEl.textContent = String(s).padStart(2,'0');
    }, 1000);
}
// ==================== STATE ====================
const STATE = {
    agentNo: null,
    week: null,
    weeks: [],
    data: null,
    allAgents: [],
    allWeeksData: null,
    page: 'home',
    isLoading: false,
    isAdmin: false,
    adminSession: null,
    lastUpdated: null,
    hasSeenResults: {},

    // ===== NOTIFICATION STATE (UPDATED) =====
    notifications: [],
    lastChecked: {
        badges: 0,
        announcements: null,
        playlists: -1,              // -1 = not initialized yet
        missions: -1,               // -1 = not initialized yet
        album2xBadge: {},           // Object: { "Test Week 1": true, "Week 1": true }
        songOfDay: null,            // Date string: "Mon Dec 02 2024"
        weekResults: [],            // Array of seen weeks: ["Test Week 1", "Week 1"]
        missionIds: [],             // Array of seen mission IDs
        _badgesInitialized: false   // Internal flag for first load
    },
    dismissedPopups: {},            // Track dismissed popup keys
    shownPopupsThisSession: {},     // Track shown popups THIS session only
    hasShownPopupThisSession: false,
    isCheckingNotifications: false
};
// ==================== HELPERS ====================
const $ = id => document.getElementById(id);
const teamColor = team => CONFIG.TEAMS[team]?.color || '#7b2cbf';
const teamPfp = team => CONFIG.TEAM_PFPS[team] || '';
const getTeamMemberCount = team => STATE.allAgents?.filter(a => a.team === team).length || 0;

// ==================== PLAYLIST ICON HELPER ====================
function getPlaylistIcon(platform) {
    const icons = { 
        'spotify': '💚', 
        'apple': '🍎', 
        'youtube': '🔴', 
        'amazon': '📦', 
        'deezer': '🎧',
        'youtube music': '🔴',
        'apple music': '🍎'
    };
    return icons[(platform || '').toLowerCase()] || '🎵';
}

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
    document.querySelectorAll('.toast-mini').forEach(t => t.remove());
    
    const colors = {
        success: { bg: 'rgba(0,40,20,0.95)', border: '#00ff88', icon: '✅' },
        error: { bg: 'rgba(40,20,20,0.95)', border: '#ff4444', icon: '⚠️' },
        info: { bg: 'rgba(30,20,40,0.95)', border: '#7b2cbf', icon: 'ℹ️' }
    };
    
    const c = colors[type] || colors.info;
    
    const toast = document.createElement('div');
    toast.className = 'toast-mini';
    toast.innerHTML = `<span>${c.icon}</span><span>${sanitize(msg)}</span>`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        padding: 8px 16px;
        border-radius: 20px;
        background: ${c.bg};
        border: 1px solid ${c.border};
        color: #fff;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        z-index: 9999999;
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        white-space: nowrap;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    // Animate out
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-100px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
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
        const timeStr = STATE.lastUpdated ? formatLastUpdated(STATE.lastUpdated) : 'Unknown';
        el.innerHTML = `
            <span style="font-size:10px;color:#888;">
                ⏰ Updates every hour • Last: ${timeStr}
            </span>
        `;
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
function getPriorityClass(priority) {
    switch ((priority || '').toLowerCase()) {
        case 'high': return 'priority-high';
        case 'medium': return 'priority-medium';
        case 'low': return 'priority-low';
        default: return 'priority-normal';
    }
}

function getPriorityBadge(priority) {
    switch ((priority || '').toLowerCase()) {
        case 'high': 
            return '<span class="priority-badge high">⚠️ IMPORTANT</span>';
        case 'medium': 
            return '<span class="priority-badge medium">📌 NOTICE</span>';
        case 'low': 
            return '<span class="priority-badge low">💡 TIP</span>';
        default: 
            return '';
    }
}

function closeSidebar() {
    const sidebar = $('sidebar');
    if (sidebar) sidebar.classList.remove('open');
}

// ==================== GUIDES ====================
const PAGE_GUIDES = {
    'home': { 
        icon: '🏠', 
        title: 'Welcome to Headquarters!', 
        text: "You will receive missions every week. BTS Comeback is REAL - let's stream like our life depends on it! 💜\n\n🤫 Pro tip: Don't reveal your Agent ID to others - keep the mystery alive!",
        isWarning: false
    },
    'goals': { 
        icon: '🎯', 
        title: 'Team Goal Progress', 
        text: "Focus on these tracks. Don't loop one track - variety is key!",
        isWarning: false
    },
    'album2x': { 
        icon: '🎧', 
        title: `The ${CONFIG.ALBUM_CHALLENGE.CHALLENGE_NAME} Challenge`,
        text: `Listen to every song on this album at least ${CONFIG.ALBUM_CHALLENGE.REQUIRED_STREAMS} times.\n\n⚠️ IMPORTANT: EVERYONE in your team must complete this for the team to pass!\n\n🎖️ Complete this challenge to earn a special badge!`,
        isWarning: false
    },
    'secret-missions': { 
        icon: '🕵️', 
        title: 'Classified Tasks', 
        text: "Bonus XP tasks from HQ. Complete them and send proofs in team gc for extra team XP!",
        isWarning: false
    },
    'team-level': { 
        icon: '🚀', 
        title: 'Leveling Up & Winning', 
        text: "To WIN the week, your team must:\n1️⃣ Complete ALL 3 missions (Track + Album + 2X)\n2️⃣ Have the highest XP among eligible teams\n\n🏆 Winner team members all get a Champion Badge!",
        isWarning: false
    },
    'rankings': { 
        icon: '🏆', 
        title: 'Friendly Competition', 
        text: "We are one big team. Rankings are just for fun and motivation!\n\n🤫 Remember: Keep your Agent ID secret to make it more mysterious!",
        isWarning: false
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
        text: "Important news and updates regarding BTS comeback directly from Admin. Check regularly!",
        isWarning: false
    },
    'chat': {
        icon: '💬',
        title: 'Secret Comms Channel',
        text: "Chat anonymously with fellow agents. Be kind - we're ONE team! 💜\n\n🤫 Use your codename, NOT your Agent ID - keep your identity secret!",
        isWarning: false
    },
    'gc-links': {
        icon: '👥',
        title: 'Instagram Group Chats',
        text: "Connect with your team for mission coordination. Join the GCs below!",
        isWarning: false
    },
    'helper-roles': {
        icon: '🎖️',
        title: 'Helper Army Roles',
        text: "Want to help HQ? Check available roles below. More roles coming based on mission needs!",
        isWarning: false
    },
    'drawer': {
        icon: '🎖️',
        title: 'Your Badge Collection',
        text: "Earn badges by:\n• Every 50 XP = 1 Badge 🎖️\n• Complete Album 2X = Special Badge ✨\n• Team Wins Week = Winner Badge 🏆",
        isWarning: false
    },
    'guide': {
        icon: '📚',
        title: 'Agent Training Manual',
        text: 'Everything you need to know about the BTS Comeback Mission!',
        isWarning: false
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
    
    // 1. Add normal parameters
    Object.entries(params).forEach(([k, v]) => { 
        if (v != null) url.searchParams.set(k, typeof v === 'object' ? JSON.stringify(v) : v); 
    });

    // 2. 🔥 CACHE BUSTER: Forces a fresh request every time
    url.searchParams.set('_t', Date.now()); 

    console.log('📡 API Request:', action, params);

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        
        // 3. Simple fetch (No custom headers to avoid CORS errors)
        const res = await fetch(url.toString(), { 
            signal: controller.signal,
            method: 'GET'
        });
        
        clearTimeout(timeout);
        const text = await res.text();
        
        let data;
        try { 
            data = JSON.parse(text); 
        } catch (e) { 
            console.error("JSON Parse Error:", text);
            throw new Error('Invalid JSON response'); 
        }

        // 4. Update the global Last Updated time immediately
        if (data.lastUpdated) { 
            STATE.lastUpdated = data.lastUpdated; 
            updateTime(); 
        }
        
        if (data.error) throw new Error(data.error);
        return data;

    } catch (e) {
        console.error('API Network Error:', e);
        throw e;
    }
}

// ==================== NOTIFICATION STATE MANAGEMENT ====================

function initNotificationState() {
    return {
        version: NOTIFICATION_SYSTEM_VERSION,
        
        // Badge tracking
        badges: 0,
        album2xBadge: {},
        _badgesInitialized: false,
        
        // Content-based tracking
        seenAnnouncementIds: [],
        lastAnnouncementTimestamp: null,
        
        seenPlaylistIds: [],
        playlistCount: 0,
        
        // ✅ FIXED: Mission tracking with baseline flag
        seenMissionIds: [],
        missionCount: 0,
        _missionBaselineSet: false,  // ✅ THIS IS THE KEY FIX
        
        // Date-based tracking
        songOfDay: null,
        
        // Week results
        weekResults: [],
        
        // System flags
        _initialized: true,
        _initDate: Date.now(),
        _lastMigration: null
    };
}
function loadNotificationState() {
    try {
        const storageKey = 'notificationState_v4_' + STATE.agentNo;
        const legacyKeys = [
            'notificationState_v3_' + STATE.agentNo,
            'notificationState_' + STATE.agentNo
        ];
        
        let saved = localStorage.getItem(storageKey);
        let isLegacy = false;
        let legacyKey = null;
        
        // Try legacy keys if new key not found
        if (!saved) {
            for (const key of legacyKeys) {
                saved = localStorage.getItem(key);
                if (saved) {
                    isLegacy = true;
                    legacyKey = key;
                    break;
                }
            }
        }
        
        if (saved) {
            const parsed = JSON.parse(saved);
            const savedVersion = parsed.lastChecked?.version || 1;
            
            console.log(`📌 Found notification state v${savedVersion}${isLegacy ? ' (legacy)' : ''}`);
            
            STATE.lastChecked = smartMergeState(
                initNotificationState(),
                parsed.lastChecked || {}
            );
            
            STATE.dismissedPopups = parsed.dismissedPopups || {};
            STATE.shownPopupsThisSession = {};
            
            if (savedVersion < NOTIFICATION_SYSTEM_VERSION) {
                migrateNotificationState(savedVersion);
            }
            
            STATE.lastChecked.version = NOTIFICATION_SYSTEM_VERSION;
            
            // Clean up legacy storage
            if (isLegacy && legacyKey) {
                localStorage.removeItem(legacyKey);
                saveNotificationState();
            }
            
        } else {
            console.log('📌 First time user - initializing notification baseline');
            initializeNotificationBaseline();
        }
    } catch (e) {
        console.error('Error loading notification state:', e);
        initializeNotificationBaseline();
    }
}

function smartMergeState(defaults, saved) {
    const merged = { ...defaults };
    
    for (const key in saved) {
        if (saved[key] !== undefined && saved[key] !== null) {
            if (Array.isArray(defaults[key]) && Array.isArray(saved[key])) {
                merged[key] = [...new Set([...saved[key]])];
            } else if (typeof defaults[key] === 'object' && typeof saved[key] === 'object' && !Array.isArray(defaults[key])) {
                merged[key] = { ...defaults[key], ...saved[key] };
            } else {
                merged[key] = saved[key];
            }
        }
    }
    
    return merged;
}

function migrateNotificationState(fromVersion) {
    console.log(`🔄 Migrating notification state from v${fromVersion} to v${NOTIFICATION_SYSTEM_VERSION}`);
    
    const state = STATE.lastChecked;
    
    if (fromVersion < 2) {
        if (typeof state.playlists === 'number' && state.playlists > 0) {
            state.playlistCount = state.playlists;
            state.seenPlaylistIds = [];
        }
        if (typeof state.missions === 'number' && state.missions > 0) {
            state.missionCount = state.missions;
        }
        if (Array.isArray(state.missionIds)) {
            state.seenMissionIds = [...state.missionIds];
        }
        if (state.announcements) {
            state.lastAnnouncementTimestamp = state.announcements;
        }
    }
    
    if (fromVersion < 3) {
        state.seenAnnouncementIds = state.seenAnnouncementIds || [];
        state.seenPlaylistIds = state.seenPlaylistIds || [];
        state.seenMissionIds = state.seenMissionIds || state.missionIds || [];
        state.weekResults = state.weekResults || [];
        state._initialized = true;
        state._badgesInitialized = true;
    }
    
    // v4: Clean up old week results (only keep last 2 weeks)
    if (fromVersion < 4) {
        console.log('  → Cleaning up old week results');
        state.weekResults = cleanupOldWeekResults(state.weekResults);
    }
    
    state._lastMigration = Date.now();
    state._migratedFrom = fromVersion;
    
    saveNotificationState();
    console.log('✅ Migration complete');
}

// Clean up old week results - only keep recent ones
function cleanupOldWeekResults(weekResults) {
    if (!Array.isArray(weekResults)) return [];
    if (!STATE.weeks || STATE.weeks.length === 0) return weekResults;
    
    // Get current week index
    const currentWeekIndex = STATE.weeks.indexOf(STATE.week);
    if (currentWeekIndex === -1) return weekResults;
    
    // Only keep results for current week and 1 previous week
    const recentWeeks = STATE.weeks.slice(Math.max(0, currentWeekIndex - 1), currentWeekIndex + 1);
    
    return weekResults.filter(week => recentWeeks.includes(week));
}

// Get weeks that are relevant for notifications (current and previous only)
function getRelevantWeeksForNotification() {
    if (!STATE.weeks || STATE.weeks.length === 0) return [];
    
    const currentWeekIndex = STATE.weeks.indexOf(STATE.week);
    if (currentWeekIndex === -1) return [STATE.week];
    
    // Only current week and immediately previous week
    const relevant = [];
    if (currentWeekIndex > 0) {
        relevant.push(STATE.weeks[currentWeekIndex - 1]); // Previous week
    }
    relevant.push(STATE.week); // Current week
    
    return relevant;
}

async function initializeNotificationBaseline() {
    console.log('📌 Initializing notification baseline...');
    
    const currentXP = parseInt(STATE.data?.stats?.totalXP) || 0;
    const album2xPassed = STATE.data?.album2xStatus?.passed || false;
    
    STATE.lastChecked = initNotificationState();
    STATE.lastChecked.badges = Math.floor(currentXP / 50);
    STATE.lastChecked._badgesInitialized = true;
    STATE.lastChecked.lastAnnouncementTimestamp = Date.now();
    STATE.lastChecked.songOfDay = new Date().toDateString();
    
    if (album2xPassed && STATE.week) {
        STATE.lastChecked.album2xBadge[STATE.week] = true;
    }
    
    // Mark ALL old weeks as seen (only notify for future results)
    if (STATE.weeks && STATE.weeks.length > 0) {
        const currentWeekIndex = STATE.weeks.indexOf(STATE.week);
        // Mark all weeks before current as "seen"
        STATE.lastChecked.weekResults = STATE.weeks.slice(0, currentWeekIndex);
    }
    
    if (STATE.hasSeenResults) {
        const existingSeen = Object.keys(STATE.hasSeenResults);
        STATE.lastChecked.weekResults = [...new Set([...STATE.lastChecked.weekResults, ...existingSeen])];
    }
    
    STATE.dismissedPopups = {};
    STATE.shownPopupsThisSession = {};
    
    try {
        await setInitialBaselines();
    } catch (e) {
        console.log('Could not fetch initial baselines:', e);
    }
    
    saveNotificationState();
    console.log('✅ Notification baseline initialized');
}

async function setInitialBaselines() {
    const promises = [];
    
    // Playlists baseline
    promises.push(
        api('getPlaylists').then(data => {
            const playlists = data.playlists || [];
            STATE.lastChecked.playlistCount = playlists.length;
            STATE.lastChecked.seenPlaylistIds = playlists.map(p => p.id || p.name).filter(Boolean);
        }).catch(() => {})
    );
    
    // Announcements baseline
    promises.push(
        api('getAnnouncements', { week: STATE.week }).then(data => {
            const announcements = data.announcements || [];
            STATE.lastChecked.seenAnnouncementIds = announcements.map(a => a.id || a.created).filter(Boolean);
            if (announcements.length > 0) {
                const sorted = announcements.sort((a, b) => new Date(b.created || 0) - new Date(a.created || 0));
                STATE.lastChecked.lastAnnouncementTimestamp = new Date(sorted[0].created).getTime();
            }
        }).catch(() => {})
    );
    
    // ✅ FIXED: Missions baseline with flag
    const team = STATE.data?.profile?.team;
    if (team) {
        promises.push(
            api('getTeamSecretMissions', { team, agentNo: STATE.agentNo, week: STATE.week }).then(data => {
                const missions = data.active || [];
                STATE.lastChecked.missionCount = missions.length;
                STATE.lastChecked.seenMissionIds = missions.map(m => m.id).filter(Boolean);
                STATE.lastChecked._missionBaselineSet = true;  // ✅ SET BASELINE FLAG
                console.log('📌 Mission baseline set:', missions.length, 'missions');
            }).catch(() => {
                // Even on error, mark baseline as set to prevent constant notifications
                STATE.lastChecked._missionBaselineSet = true;
            })
        );
    }
    
    await Promise.allSettled(promises);
}

function saveNotificationState() {
    try {
        const storageKey = 'notificationState_v4_' + STATE.agentNo;
        localStorage.setItem(storageKey, JSON.stringify({
            lastChecked: STATE.lastChecked,
            dismissedPopups: STATE.dismissedPopups || {}
        }));
    } catch (e) {
        console.log('Could not save notification state');
    }
}

function getNotificationKey(notif) {
    if (!notif) return 'unknown_' + Date.now();
    
    const parts = [
        notif.type || 'generic',
        notif.week || STATE.week || '',
        notif.id || '',
        (notif.title || '').substring(0, 30)
    ];
    
    return parts.join('_')
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '')
        .toLowerCase();
}

// ==================== MAIN NOTIFICATION CHECK ====================

async function checkNotifications() {
    if (STATE.isCheckingNotifications) {
        return;
    }
    
    if (!STATE.agentNo || !STATE.data) {
        return;
    }
    
    if (!STATE.lastChecked || !STATE.lastChecked._initialized) {
        loadNotificationState();
        return;
    }
    
    STATE.isCheckingNotifications = true;
    console.log('🔔 Checking notifications...');
    
    try {
        const results = await Promise.allSettled([
            checkNewBadges(),
            checkNewAnnouncements(),
            checkNewPlaylists(),
            checkNewMissions(),
            checkNewSongOfDay()
        ]);
        
        const notifications = [];
        const checkNames = ['badges', 'announcements', 'playlists', 'missions', 'sotd'];
        
        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
                if (Array.isArray(result.value)) {
                    notifications.push(...result.value.filter(Boolean));
                } else {
                    notifications.push(result.value);
                }
            }
        });
        
        // Check week results (SMART - only recent weeks)
        const resultsNotif = checkWeekResults();
        if (resultsNotif) {
            notifications.push(resultsNotif);
        }
        
        // Filter out dismissed
        const newNotifications = notifications.filter(n => {
            if (!n) return false;
            const key = getNotificationKey(n);
            return !STATE.dismissedPopups?.[key];
        });
        
        STATE.notifications = newNotifications;
        updateNotificationBadge();
        
        console.log(`🔔 Found ${newNotifications.length} new notifications`);
        
        if (newNotifications.length > 0) {
            const highPriorityNew = newNotifications.filter(n => n.priority === 'high');
            const hasUnshownHighPriority = highPriorityNew.some(n => {
                const key = getNotificationKey(n);
                return !STATE.shownPopupsThisSession?.[key];
            });
            
            if (hasUnshownHighPriority || !STATE.hasShownPopupThisSession) {
                showNotificationPopup(newNotifications);
                
                if (!STATE.shownPopupsThisSession) STATE.shownPopupsThisSession = {};
                newNotifications.forEach(n => {
                    STATE.shownPopupsThisSession[getNotificationKey(n)] = true;
                });
                STATE.hasShownPopupThisSession = true;
            }
        }
        
        
    } catch (e) {
        console.error('❌ Error in checkNotifications:', e);
    } finally {
        STATE.isCheckingNotifications = false;
    }
}

// ==================== INDIVIDUAL CHECK FUNCTIONS ====================

async function checkNewBadges() {
    try {
        const stats = STATE.data?.stats || {};
        const currentXP = parseInt(stats.totalXP) || 0;
        const currentBadgeCount = Math.floor(currentXP / 50);
        const lastBadgeCount = STATE.lastChecked.badges || 0;
        
        const notifications = [];
        
        if (!STATE.lastChecked._badgesInitialized) {
            STATE.lastChecked.badges = currentBadgeCount;
            STATE.lastChecked._badgesInitialized = true;
            saveNotificationState();
            return null;
        }
        
        if (currentBadgeCount > lastBadgeCount) {
            const newBadges = currentBadgeCount - lastBadgeCount;
            
            notifications.push({
                type: 'badge',
                icon: '🎖️',
                title: `${newBadges} New Badge${newBadges > 1 ? 's' : ''} Earned!`,
                message: `You reached ${currentBadgeCount * 50} XP!`,
                action: () => loadPage('drawer'),
                actionText: 'View Badges',
                week: STATE.week,
                id: `badge_${currentBadgeCount}`
            });
            
            STATE.lastChecked.badges = currentBadgeCount;
            saveNotificationState();
        }
        
        const album2xStatus = STATE.data?.album2xStatus || {};
        const album2xKey = STATE.week;
        
        if (album2xStatus.passed && !STATE.lastChecked.album2xBadge?.[album2xKey]) {
            notifications.push({
                type: 'achievement',
                icon: '✨',
                title: `${CONFIG.ALBUM_CHALLENGE?.CHALLENGE_NAME || '2X'} Master!`,
                message: `You completed the Album Challenge!`,
                action: () => loadPage('drawer'),
                actionText: 'View Badge',
                priority: 'high',
                week: STATE.week,
                id: `album2x_${album2xKey}`
            });
            
            if (!STATE.lastChecked.album2xBadge) STATE.lastChecked.album2xBadge = {};
            STATE.lastChecked.album2xBadge[album2xKey] = true;
            saveNotificationState();
        }
        
        return notifications.length > 0 ? notifications : null;
    } catch (e) {
        return null;
    }
}

async function checkNewAnnouncements() {
    try {
        const data = await api('getAnnouncements', { week: STATE.week });
        const announcements = data.announcements || [];
        
        if (announcements.length === 0) return null;
        
        const seenIds = STATE.lastChecked.seenAnnouncementIds || [];
        
        const unseen = announcements.filter(a => {
            const id = a.id || a.created;
            return id && !seenIds.includes(id);
        });
        
        if (unseen.length === 0) return null;
        
        const sorted = unseen.sort((a, b) => 
            new Date(b.created || 0) - new Date(a.created || 0)
        );
        const latest = sorted[0];
        
        STATE.lastChecked.seenAnnouncementIds = announcements
            .map(a => a.id || a.created)
            .filter(Boolean);
        STATE.lastChecked.lastAnnouncementTimestamp = Date.now();
        saveNotificationState();
        
        return {
            type: 'announcement',
            icon: '📢',
            title: 'New Announcement!',
            message: latest.title || 'New message from HQ',
            action: () => loadPage('announcements'),
            actionText: 'Read Now',
            priority: latest.priority === 'high' ? 'high' : 'normal',
            week: STATE.week,
            id: latest.id || latest.created
        };
        
    } catch (e) {
        return null;
    }
}

async function checkNewPlaylists() {
    try {
        const data = await api('getPlaylists');
        const playlists = data.playlists || [];
        
        const seenIds = STATE.lastChecked.seenPlaylistIds || [];
        const lastCount = STATE.lastChecked.playlistCount ?? -1;
        
        if (lastCount === -1 || seenIds.length === 0) {
            STATE.lastChecked.playlistCount = playlists.length;
            STATE.lastChecked.seenPlaylistIds = playlists.map(p => p.id || p.name).filter(Boolean);
            saveNotificationState();
            return null;
        }
        
        const unseen = playlists.filter(p => {
            const id = p.id || p.name;
            return id && !seenIds.includes(id);
        });
        
        if (unseen.length === 0) {
            STATE.lastChecked.playlistCount = playlists.length;
            return null;
        }
        
        STATE.lastChecked.playlistCount = playlists.length;
        STATE.lastChecked.seenPlaylistIds = playlists.map(p => p.id || p.name).filter(Boolean);
        saveNotificationState();
        
        return {
            type: 'playlist',
            icon: '🎵',
            title: 'New Playlist Added!',
            message: `${unseen.length} new playlist${unseen.length > 1 ? 's' : ''} available!`,
            action: () => loadPage('playlists'),
            actionText: 'View Playlists',
            week: STATE.week,
            id: `playlist_${Date.now()}`
        };
        
    } catch (e) {
        return null;
    }
}

async function checkNewMissions() {
    try {
        const team = STATE.data?.profile?.team;
        if (!team) {
            console.log('⚠️ No team assigned, skipping mission check');
            return null;
        }
        
        if (!STATE.lastChecked?._initialized) {
            console.log('⚠️ Notification state not initialized');
            return null;
        }
        
        const data = await api('getTeamSecretMissions', { 
            team: team, 
            agentNo: STATE.agentNo, 
            week: STATE.week 
        });
        
        const activeMissions = data.active || [];
        const completedMissions = data.completed || [];
        const myAssigned = data.myAssigned || [];
        
        const seenIds = STATE.lastChecked.seenMissionIds || [];
        const isFirstCheck = !STATE.lastChecked._missionBaselineSet;
        
        console.log('🔍 Mission check:', {
            active: activeMissions.length,
            completed: completedMissions.length,
            seenIds: seenIds.length,
            isFirstCheck: isFirstCheck
        });
        
        // ============================================================
        // FIRST TIME: Set baseline and DON'T notify
        // ============================================================
        if (isFirstCheck) {
            console.log('🔄 First mission check - setting baseline');
            STATE.lastChecked.missionCount = activeMissions.length;
            STATE.lastChecked.seenMissionIds = activeMissions.map(m => m.id).filter(Boolean);
            STATE.lastChecked.seenCompletedMissionIds = completedMissions.map(m => m.id).filter(Boolean);
            STATE.lastChecked._missionBaselineSet = true;
            saveNotificationState();
            return null;
        }
        
        // ============================================================
        // CHECK FOR NEWLY COMPLETED MISSIONS (XP Award!)
        // ============================================================
        const seenCompletedIds = STATE.lastChecked.seenCompletedMissionIds || [];
        const newlyCompleted = completedMissions.filter(m => 
            m.id && !seenCompletedIds.includes(m.id)
        );
        
        if (newlyCompleted.length > 0) {
            console.log('🎉 Mission completed! Team earned XP');
            
            const mission = newlyCompleted[0];
            const xpAwarded = mission.xpReward || 5;
            
            // Update seen completed
            STATE.lastChecked.seenCompletedMissionIds = completedMissions.map(m => m.id).filter(Boolean);
            saveNotificationState();
            
            // Show celebration notification
            return {
                type: 'mission_complete',
                icon: '🎉',
                title: `+${xpAwarded} XP Earned!`,
                message: `${team} completed: ${mission.title || 'Secret Mission'}`,
                action: () => loadPage('secret-missions'),
                actionText: 'View Missions',
                priority: 'high',
                week: STATE.week,
                id: `complete_${mission.id}`
            };
        }
        
        // ============================================================
        // CHECK FOR NEW MISSIONS (Existing Logic)
        // ============================================================
        const allCurrentIds = activeMissions.map(m => m.id).filter(Boolean);
        const newMissionIds = allCurrentIds.filter(id => !seenIds.includes(id));
        
        if (newMissionIds.length === 0) {
            STATE.lastChecked.missionCount = activeMissions.length;
            return null;
        }
        
        console.log('🔔 Found new mission IDs:', newMissionIds);
        
        // Check for assigned missions (higher priority)
        const newAssignedToMe = myAssigned.filter(m => 
            m.id && newMissionIds.includes(m.id)
        );
        
        // Activate notification dot
        const dot = document.getElementById('dot-mission');
        if (dot) {
            dot.classList.add('active');
            console.log('🔴 Mission notification dot activated');
        }
        
        if (newAssignedToMe.length > 0) {
            const mission = newAssignedToMe[0];
            return {
                type: 'mission',
                icon: '🎯',
                title: 'Mission Assigned to YOU!',
                message: mission.title || mission.briefing || 'New classified mission',
                action: () => loadPage('secret-missions'),
                actionText: 'View Mission',
                priority: 'high',
                week: STATE.week,
                id: mission.id
            };
        }
        
        const newMission = activeMissions.find(m => newMissionIds.includes(m.id));
        return {
            type: 'mission',
            icon: '🕵️',
            title: 'New Team Mission!',
            message: newMission?.title || newMission?.briefing || 'Your team has a secret mission!',
            action: () => loadPage('secret-missions'),
            actionText: 'View Missions',
            week: STATE.week,
            id: newMission?.id
        };
        
    } catch (e) {
        console.error('❌ Mission check error:', e);
        return null;
    }
}
async function checkNewSongOfDay() {
    try {
        const data = await api('getSongOfDay', {});
        
        if (!data.success || !data.song) return null;
        
        const today = new Date().toDateString();
        const lastCheckedDate = STATE.lastChecked.songOfDay;
        
        const storageKey = 'song_answered_' + STATE.agentNo + '_' + today;
        const alreadyAnswered = localStorage.getItem(storageKey);
        
        if (alreadyAnswered) {
            STATE.lastChecked.songOfDay = today;
            return null;
        }
        
        // ✅ NEW CHECK: Explicitly check if we already dismissed this specific ID today
        const notifId = `sotd_${today}`;
        if (lastCheckedDate !== today) {
            return {
                type: 'sotd',
                icon: '🎬',
                title: 'Song of the Day!',
                message: 'New song puzzle - guess it for XP!',
                action: () => {
                    STATE.lastChecked.songOfDay = today;
                    saveNotificationState();
                    loadPage('song-of-day');
                },
                actionText: 'Play Now',
                week: STATE.week,
                id: notifId
            };
        }
        
        return null;
    } catch (e) {
        return null;
    }
}

// SMART Week Results Check - Only notify for RECENT completed weeks
function checkWeekResults() {
    if (!STATE.weeks || STATE.weeks.length === 0) return null;
    
    const seenResults = STATE.lastChecked.weekResults || [];
    const currentWeekIndex = STATE.weeks.indexOf(STATE.week);
    
    if (currentWeekIndex === -1) return null;
    
    // Only check the IMMEDIATELY PREVIOUS week (not old weeks)
    // If we're in Week 3, only check Week 2
    const previousWeekIndex = currentWeekIndex - 1;
    
    if (previousWeekIndex < 0) return null; // No previous week
    
    const previousWeek = STATE.weeks[previousWeekIndex];
    
    // Check if previous week is completed and not seen
    const isCompleted = typeof isWeekCompleted === 'function' ? isWeekCompleted(previousWeek) : false;
    const isSeen = STATE.hasSeenResults?.[previousWeek] || seenResults.includes(previousWeek);
    
    if (!isCompleted || isSeen) return null;
    
    // Only notify for the immediately previous week
    return {
        type: 'results',
        icon: '🏆',
        title: 'Week Results Ready!',
        message: `${previousWeek} has ended. See the final standings!`,
        action: () => {
            STATE.week = previousWeek;
            const weekSelect = document.getElementById('week-select');
            if (weekSelect) weekSelect.value = previousWeek;
            if (typeof markResultsSeen === 'function') markResultsSeen(previousWeek);
            loadPage('summary');
        },
        actionText: 'View Results',
        priority: 'high',
        week: previousWeek,
        id: `results_${previousWeek}`
    };
}

// ==================== NOTIFICATION UI ====================

function updateNotificationBadge() {
    const count = (STATE.notifications || []).length;
    let badge = document.getElementById('notification-badge');
    
    if (count > 0) {
        if (!badge) {
            badge = document.createElement('div');
            badge.id = 'notification-badge';
            badge.className = 'notification-badge';
            badge.onclick = () => showNotificationCenter();
            document.body.appendChild(badge);
        }
        
        badge.innerHTML = `🔔 <span class="badge-count">${count}</span>`;
        badge.style.cssText = `
            position: fixed !important;
            top: 15px !important;
            right: 70px !important;
            z-index: 999999 !important;
            background: linear-gradient(135deg, #ff4444, #cc0000);
            color: #fff;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
            animation: notifPulse 2s infinite;
            border: 1px solid rgba(255,68,68,0.5);
            box-shadow: 0 4px 15px rgba(255,68,68,0.3);
        `;
        badge.style.display = 'flex';
    } else {
        if (badge) badge.style.display = 'none';
    }
}

function showNotificationPopup(notifications) {
    if (!notifications || notifications.length === 0) return;
    
    document.querySelectorAll('.notification-popup').forEach(p => p.remove());
    
    const sorted = [...notifications].sort((a, b) => {
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (b.priority === 'high' && a.priority !== 'high') return 1;
        return 0;
    });
    
    const notif = sorted[0];
    if (!notif) return;
    
    const isHighPriority = notif.priority === 'high';
    
    const popup = document.createElement('div');
    popup.className = 'notification-popup';
    popup.innerHTML = `
        <style>
            .notification-popup {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 999998;
                max-width: 350px;
                background: linear-gradient(145deg, #1a1a2e, #16213e);
                border-radius: 16px;
                border: 1px solid rgba(123, 44, 191, 0.3);
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                overflow: hidden;
                transform: translateX(120%);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            .notification-popup.show { transform: translateX(0); opacity: 1; }
            .notification-popup.hide { transform: translateX(120%); opacity: 0; }
            .notif-popup-content {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                padding: 16px;
            }
            .notif-popup-content.high-priority {
                background: linear-gradient(135deg, rgba(255,68,68,0.1), rgba(255,68,68,0.05));
                border-left: 3px solid #ff4444;
            }
            .notif-popup-icon { font-size: 28px; flex-shrink: 0; }
            .notif-popup-icon.bounce { animation: iconBounce 1s ease infinite; }
            @keyframes iconBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
            .notif-popup-text { flex: 1; min-width: 0; }
            .notif-popup-title { color: #fff; font-weight: bold; font-size: 14px; margin-bottom: 4px; }
            .notif-popup-message { color: #aaa; font-size: 12px; line-height: 1.4; }
            .notif-popup-close {
                background: none;
                border: none;
                color: #666;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            .notif-popup-close:hover { color: #ff4444; }
            .notif-popup-actions {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 16px;
                background: rgba(0,0,0,0.2);
                border-top: 1px solid rgba(255,255,255,0.05);
            }
            .notif-action-btn {
                flex: 1;
                padding: 10px 16px;
                background: linear-gradient(135deg, #7b2cbf, #5a1f99);
                border: none;
                border-radius: 8px;
                color: #fff;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            }
            .notif-action-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(123,44,191,0.4); }
            .notif-action-btn.pulse-btn { animation: btnPulse 2s ease-in-out infinite; }
            @keyframes btnPulse {
                0%, 100% { box-shadow: 0 0 0 rgba(123,44,191,0); }
                50% { box-shadow: 0 0 20px rgba(123,44,191,0.5); }
            }
            .notif-more { color: #7b2cbf; font-size: 12px; cursor: pointer; white-space: nowrap; }
            .notif-more:hover { text-decoration: underline; }
            @keyframes notifPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        </style>
        
        <div class="notif-popup-content ${isHighPriority ? 'high-priority' : ''}">
            <div class="notif-popup-icon ${isHighPriority ? 'bounce' : ''}">${notif.icon || '🔔'}</div>
            <div class="notif-popup-text">
                <div class="notif-popup-title">${sanitize(notif.title || 'Notification')}</div>
                <div class="notif-popup-message">${sanitize(notif.message || '')}</div>
            </div>
            <button class="notif-popup-close" onclick="dismissNotificationPopup()">×</button>
        </div>
        <div class="notif-popup-actions">
            <button class="notif-action-btn ${isHighPriority ? 'pulse-btn' : ''}" onclick="handleNotificationAction(0)">
                ${notif.actionText || 'View'}
            </button>
            ${notifications.length > 1 ? `
                <span class="notif-more" onclick="showNotificationCenter()">+${notifications.length - 1} more</span>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(popup);
    requestAnimationFrame(() => popup.classList.add('show'));
    
    const dismissTime = isHighPriority ? 10000 : 6000;
    setTimeout(() => dismissNotificationPopup(), dismissTime);
}

function dismissNotificationPopup() {
    const popup = document.querySelector('.notification-popup');
    if (popup) {
        popup.classList.remove('show');
        popup.classList.add('hide');
        setTimeout(() => popup.remove(), 400);
    }
}

function handleNotificationAction(index) {
    const notif = STATE.notifications?.[index];
    if (notif) {
        markNotificationSeen(notif);
        dismissNotificationPopup();
        if (typeof notif.action === 'function') {
            notif.action();
        }
    }
}

function markNotificationSeen(notif) {
    if (!notif) return;
    
    const key = getNotificationKey(notif);
    
    if (!STATE.dismissedPopups) STATE.dismissedPopups = {};
    STATE.dismissedPopups[key] = Date.now();
    
    switch (notif.type) {
        case 'badge':
        case 'achievement': {
            const currentXP = parseInt(STATE.data?.stats?.totalXP) || 0;
            STATE.lastChecked.badges = Math.floor(currentXP / 50);
            STATE.lastChecked._badgesInitialized = true;
            break;
        }
        case 'announcement': {
            STATE.lastChecked.lastAnnouncementTimestamp = Date.now();
            if (notif.id && !STATE.lastChecked.seenAnnouncementIds.includes(notif.id)) {
                STATE.lastChecked.seenAnnouncementIds.push(notif.id);
            }
            break;
        }
        case 'mission': {
            if (notif.id && !STATE.lastChecked.seenMissionIds.includes(notif.id)) {
                STATE.lastChecked.seenMissionIds.push(notif.id);
            }
            break;
        }
        case 'results': {
            if (notif.week) {
                if (typeof markResultsSeen === 'function') markResultsSeen(notif.week);
                if (!STATE.lastChecked.weekResults.includes(notif.week)) {
                    STATE.lastChecked.weekResults.push(notif.week);
                }
            }
            break;
        }
        case 'sotd': {
            STATE.lastChecked.songOfDay = new Date().toDateString();
            break;
        }
    }
    
    saveNotificationState();
    STATE.notifications = (STATE.notifications || []).filter(n => n !== notif);
    updateNotificationBadge();
}

function showNotificationCenter() {
    document.querySelectorAll('.notification-center').forEach(c => c.remove());
    dismissNotificationPopup();
    
    const notifications = STATE.notifications || [];
    
    const center = document.createElement('div');
    center.className = 'notification-center';
    center.innerHTML = `
        <style>
            .notification-center {
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                z-index: 999999; opacity: 0; transition: opacity 0.3s;
            }
            .notification-center.show { opacity: 1; }
            .notification-center.hide { opacity: 0; }
            .notif-center-overlay {
                position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.7);
            }
            .notif-center-panel {
                position: absolute; top: 60px; right: 20px;
                width: 360px; max-width: calc(100vw - 40px); max-height: calc(100vh - 100px);
                background: linear-gradient(145deg, #1a1a2e, #0f0f1f);
                border-radius: 16px; border: 1px solid rgba(123,44,191,0.3);
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                overflow: hidden; display: flex; flex-direction: column;
            }
            .notif-center-header {
                display: flex; align-items: center; justify-content: space-between;
                padding: 16px 20px; background: linear-gradient(135deg, #7b2cbf, #5a1f99);
            }
            .notif-center-header h3 { margin: 0; color: #fff; font-size: 16px; }
            .notif-center-header button {
                background: rgba(255,255,255,0.2); border: none; color: #fff;
                width: 28px; height: 28px; border-radius: 50%; font-size: 18px;
                cursor: pointer; display: flex; align-items: center; justify-content: center;
            }
            .notif-center-list { flex: 1; overflow-y: auto; padding: 10px; }
            .notif-center-item {
                display: flex; align-items: center; gap: 12px; padding: 14px;
                background: rgba(255,255,255,0.03); border-radius: 10px;
                margin-bottom: 8px; cursor: pointer; transition: all 0.2s;
            }
            .notif-center-item:hover { background: rgba(123,44,191,0.15); transform: translateX(5px); }
            .notif-center-item.high-priority { background: rgba(255,68,68,0.1); border-left: 3px solid #ff4444; }
            .notif-item-icon { font-size: 24px; flex-shrink: 0; }
            .notif-item-content { flex: 1; min-width: 0; }
            .notif-item-title { color: #fff; font-weight: 600; font-size: 13px; margin-bottom: 3px; }
            .notif-item-message { color: #888; font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .notif-item-arrow { color: #7b2cbf; font-size: 16px; }
            .notif-empty { text-align: center; padding: 40px 20px; }
            .notif-center-footer { padding: 12px; border-top: 1px solid rgba(255,255,255,0.05); }
            .notif-center-footer button {
                width: 100%; padding: 10px; background: transparent;
                border: 1px solid rgba(255,68,68,0.3); border-radius: 8px;
                color: #ff6b6b; font-size: 12px; cursor: pointer;
            }
        </style>
        
        <div class="notif-center-overlay" onclick="closeNotificationCenter()"></div>
        <div class="notif-center-panel">
            <div class="notif-center-header">
                <h3>🔔 Notifications</h3>
                <button onclick="closeNotificationCenter()">×</button>
            </div>
            <div class="notif-center-list">
                ${notifications.length > 0 ? notifications.map((n, i) => `
                    <div class="notif-center-item ${n.priority === 'high' ? 'high-priority' : ''}" 
                         onclick="handleNotificationAction(${i}); closeNotificationCenter();">
                        <span class="notif-item-icon">${n.icon || '🔔'}</span>
                        <div class="notif-item-content">
                            <div class="notif-item-title">${sanitize(n.title || '')}</div>
                            <div class="notif-item-message">${sanitize(n.message || '')}</div>
                        </div>
                        <span class="notif-item-arrow">→</span>
                    </div>
                `).join('') : `
                    <div class="notif-empty">
                        <div style="font-size:48px;margin-bottom:15px;">✨</div>
                        <p style="color:#fff;margin:0;">No new notifications!</p>
                        <p style="font-size:12px;color:#666;margin-top:5px;">You're all caught up.</p>
                    </div>
                `}
            </div>
            ${notifications.length > 0 ? `
                <div class="notif-center-footer">
                    <button onclick="clearAllNotifications()">Clear All</button>
                </div>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(center);
    requestAnimationFrame(() => center.classList.add('show'));
}

function closeNotificationCenter() {
    const center = document.querySelector('.notification-center');
    if (center) {
        center.classList.remove('show');
        center.classList.add('hide');
        setTimeout(() => center.remove(), 300);
    }
}

function clearAllNotifications() {
    (STATE.notifications || []).forEach(n => markNotificationSeen(n));
    STATE.notifications = [];
    updateNotificationBadge();
    closeNotificationCenter();
    showToast('All notifications cleared', 'success');
}
// ==================== BACKGROUND NOTIFICATION CHECKS ====================

/**
 * Set up automatic notification checks
 * Call this once during app initialization
 */
function setupNotificationChecks() {
    console.log('🔔 Setting up notification checks...');
    
    // ✅ Check every 3 minutes
    setInterval(() => {
        console.log('⏰ Periodic notification check...');
        checkNotifications();
    }, 3 * 60 * 1000); // 3 minutes
    
    // ✅ Check when user returns to tab
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            console.log('👁️ Tab visible - checking notifications');
            // Small delay to avoid rapid checks
            setTimeout(() => {
                checkNotifications();
            }, 1000);
        }
    });
    
    // ✅ Check when back online
    window.addEventListener('online', () => {
        console.log('🌐 Back online - checking notifications');
        setTimeout(() => {
            checkNotifications();
        }, 2000);
    });
    
    // ✅ Check on page focus (for PWA)
    window.addEventListener('focus', () => {
        // Debounce - don't check if we just checked
        if (!STATE._lastNotifCheck || Date.now() - STATE._lastNotifCheck > 60000) {
            console.log('🎯 Window focused - checking notifications');
            checkNotifications();
            STATE._lastNotifCheck = Date.now();
        }
    });
    
    console.log('✅ Notification checks initialized');
}

/**
 * Quick mission check (lighter than full checkNotifications)
 * Use this for more frequent checks
 */
async function quickMissionCheck() {
    const team = STATE.data?.profile?.team;
    if (!team) return;
    
    try {
        const data = await api('getTeamSecretMissions', { 
            team, 
            agentNo: STATE.agentNo, 
            week: STATE.week 
        });
        
        const allMissions = [...(data.active || []), ...(data.myAssigned || [])];
        const seenIds = STATE.lastChecked?.seenMissionIds || [];
        const newMissions = allMissions.filter(m => m.id && !seenIds.includes(m.id));
        
        if (newMissions.length > 0) {
            // Activate dot
            const dot = document.getElementById('dot-mission');
            if (dot) dot.classList.add('active');
            
            // Show toast
            showToast(`🔒 ${newMissions.length} new mission${newMissions.length > 1 ? 's' : ''}!`, 'info');
        }
    } catch (e) {
        // Silent fail for quick check
    }
}
// ==================== FIXED BADGE FUNCTIONS ====================

function getLevelBadges(agentNo, totalXP, week = STATE.week) {
    const pool = CONFIG.BADGE_POOL || [];
    if (!pool || pool.length === 0) return [];
    
    const badges = [];
    const xp = parseInt(totalXP) || 0;
    const badgeCount = Math.floor(xp / 50);
    
    for (let level = 1; level <= badgeCount; level++) {
        let seed = 0;
        const str = String(agentNo).toUpperCase();
        for (let i = 0; i < str.length; i++) {
            seed += str.charCodeAt(i);
        }
        seed += (level * 137);
        
        if (week) {
            for (let i = 0; i < week.length; i++) {
                seed += week.charCodeAt(i);
            }
        }
        
        const index = seed % pool.length;
        
        badges.push({ 
            name: `${level * 50} XP`, 
            description: `Earned at ${level * 50} XP`, 
            imageUrl: pool[index], 
            type: 'xp',
            week: week || 'Unknown'
        });
    }
    
    return badges.reverse();
}

// ✅ NEW: Get 2X badge for a SPECIFIC week's data object
function getAlbum2xBadgeForWeek(agentNo, weekData, weekName) {
    const pool = CONFIG.BADGE_POOL || [];
    if (!pool || pool.length === 0) return null;
    
    const album2xStatus = weekData?.album2xStatus || {};
    
    if (album2xStatus.passed) {
        let seed = 0;
        const str = String(agentNo).toUpperCase() + '_ALBUM_' + weekName;
        for (let i = 0; i < str.length; i++) {
            seed += str.charCodeAt(i);
        }
        const index = seed % pool.length;
        
        return {
            name: CONFIG.ALBUM_CHALLENGE.BADGE_NAME,
            description: `${CONFIG.ALBUM_CHALLENGE.BADGE_DESCRIPTION} (${weekName})`,
            imageUrl: pool[index],
            type: 'achievement',
            icon: '✨',
            week: weekName
        };
    }
    
    return null;
}

// ✅ NEW: Get winner badge for a specific week
function getWinnerBadgeForWeek(agentNo, weekData, agentTeam) {
    const pool = CONFIG.BADGE_POOL || [];
    if (!pool || pool.length === 0 || !agentTeam) return null;
    
    const weekName = weekData.week;
    const winner = weekData.winner;
    
    // Only completed weeks can have winners
    if (!isWeekCompleted(weekName)) return null;
    
    // Check if agent's team won this week
    if (winner && winner === agentTeam) {
        let seed = 0;
        const str = String(agentNo).toUpperCase() + '_WINNER_' + weekName;
        for (let i = 0; i < str.length; i++) {
            seed += str.charCodeAt(i);
        }
        const index = seed % pool.length;
        
        return {
            name: '🏆 Champion',
            description: `${agentTeam} won ${weekName}!`,
            imageUrl: pool[index],
            type: 'winner',
            icon: '🏆',
            week: weekName
        };
    }
    
    return null;
}

// Keep original for backward compatibility
function getSpecialBadges(agentNo, week = STATE.week) {
    const badges = [];
    const album2xBadge = getAlbum2xBadgeForWeek(agentNo, STATE.data, week);
    if (album2xBadge) badges.push(album2xBadge);
    return badges;
}

function getAllBadges(agentNo, totalXP, week = STATE.week) {
    const xpBadges = getLevelBadges(agentNo, totalXP, week);
    const specialBadges = getSpecialBadges(agentNo, week);
    return [...specialBadges, ...xpBadges];
}
function isTeamEligibleForWin(teamInfo) {
    return (
        teamInfo.trackGoalPassed === true &&
        teamInfo.albumGoalPassed === true &&
        teamInfo.album2xPassed === true &&
        teamInfo.attendanceConfirmed === true &&
        teamInfo.policeConfirmed === true
    );
}

// Get winner from teams data
function getWeekWinner(teams) {
    const teamEntries = Object.entries(teams || {});
    
    // Filter only eligible teams
    const eligibleTeams = teamEntries.filter(([teamName, info]) => 
        isTeamEligibleForWin(info)
    );
    
    if (eligibleTeams.length === 0) return null;
    
    // Sort by XP (highest first)
    eligibleTeams.sort((a, b) => (b[1].teamXP || 0) - (a[1].teamXP || 0));
    
    return eligibleTeams[0][0]; // Return winning team name
}

// Get team eligibility status details
function getTeamEligibilityStatus(teamInfo) {
    const checks = [
        { key: 'trackGoals', label: '🎵 Track Goals', passed: teamInfo.trackGoalPassed },
        { key: 'albumGoals', label: '💿 Album Goals', passed: teamInfo.albumGoalPassed },
        { key: 'album2x', label: '✨ Album 2X', passed: teamInfo.album2xPassed },
        { key: 'attendance', label: '📋 Attendance', passed: teamInfo.attendanceConfirmed },
        { key: 'police', label: '👮 Police Report', passed: teamInfo.policeConfirmed }
    ];
    
    const passedCount = checks.filter(c => c.passed).length;
    const allPassed = passedCount === checks.length;
    
    return { checks, passedCount, totalChecks: checks.length, allPassed };
}
// ==================== ADMIN FUNCTIONS ====================
const NOTIFICATION_SYSTEM_VERSION = 4;

function isAdminAgent() {
    return String(STATE.agentNo).toUpperCase() === String(CONFIG.ADMIN_AGENT_NO).toUpperCase();
}

function checkAdminStatus() {
    if (!isAdminAgent()) { 
        STATE.isAdmin = false; 
        return; 
    }
    const savedSession = localStorage.getItem('adminSession');
    const savedExpiry = localStorage.getItem('adminExpiry');
    if (savedSession && savedExpiry && Date.now() < parseInt(savedExpiry)) {
        STATE.isAdmin = true;
        STATE.adminSession = savedSession;
        localStorage.setItem('adminExpiry', String(Date.now() + 86400000));
    } else {
        STATE.isAdmin = false;
    }
}

function exitAdminMode() {
    STATE.isAdmin = false;
    STATE.adminSession = null;
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminExpiry');
    document.querySelectorAll('.admin-nav-link').forEach(el => el.remove());
    closeAdminPanel();
    showToast('Admin mode deactivated', 'info');
}

function addAdminIndicator() {
    if (!isAdminAgent()) return;
    document.querySelectorAll('.admin-nav-link').forEach(el => el.remove());
    
    let nav = document.querySelector('.nav-links') || $('sidebar');
    if (!nav) return;
    
    const link = document.createElement('a');
    link.href = '#';
    link.className = 'nav-link admin-nav-link';
    link.style.cssText = 'margin-top:auto; border-top:1px solid rgba(255,255,255,0.1); padding-top:15px;';
    link.innerHTML = '<span class="nav-icon">🎛️</span><span>Admin Panel</span>';
    link.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (STATE.isAdmin) showAdminPanel();
        else showAdminLogin();
        closeSidebar();
    };
    nav.appendChild(link);
}

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
    modal.onclick = function(e) { if (e.target === modal) closeAdminModal(); };
    
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
                <button type="button" onclick="verifyAdminPassword();" class="btn-primary">🔓 Authenticate</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        const pwField = $('admin-password');
        if (pwField) {
            pwField.focus();
            pwField.onkeypress = function(e) {
                if (e.key === 'Enter') { e.preventDefault(); verifyAdminPassword(); }
            };
        }
    }, 150);
}

function closeAdminModal() {
    const modal = $('admin-modal');
    if (modal) modal.remove();
}

async function verifyAdminPassword() {
    const passwordField = $('admin-password');
    const password = passwordField?.value;
    const errorEl = $('admin-error');
    
    if (!password) {
        if (errorEl) { errorEl.textContent = '❌ Please enter password'; errorEl.classList.add('show'); }
        return;
    }
    
    let verified = false;
    
    if (password === CONFIG.ADMIN_PASSWORD) {
        verified = true;
        STATE.adminSession = 'local_' + Date.now();
    } else {
        try {
            const result = await api('verifyAdmin', { agentNo: STATE.agentNo, password });
            if (result.success) { verified = true; STATE.adminSession = result.sessionToken; }
        } catch (e) { console.log('Server verification failed:', e); }
    }

    if (verified) {
        STATE.isAdmin = true;
        localStorage.setItem('adminSession', STATE.adminSession);
        localStorage.setItem('adminExpiry', String(Date.now() + 86400000));
        closeAdminModal();
        addAdminIndicator();
        if (!STATE.week) { 
            try { const w = await api('getAvailableWeeks'); STATE.week = w.current || w.weeks?.[0]; } catch(e) {} 
        }
        showToast('Access Granted', 'success');
        setTimeout(() => showAdminPanel(), 100);
    } else {
        if (errorEl) { errorEl.textContent = '❌ Invalid password'; errorEl.classList.add('show'); }
    }
}

// ==================== ADMIN PANEL FUNCTIONS ====================

function showAdminPanel() {
    if (!STATE.isAdmin) { 
        showToast('Admin access required', 'error'); 
        return; 
    }
    if (!STATE.week) STATE.week = STATE.weeks?.[0] || 'Week 1';
    
    // Remove existing panels
    document.querySelectorAll('.admin-panel').forEach(p => p.remove());

    const panel = document.createElement('div');
    panel.className = 'admin-panel';
    panel.id = 'admin-panel';
    
    panel.innerHTML = `
        <div class="admin-panel-header">
            <div>
                <h3 style="margin:0; color:#fff;">🎛️ Mission Control</h3>
                <p style="margin:5px 0 0; color:#888; font-size:12px;">${STATE.week || 'Current Week'}</p>
            </div>
            <button type="button" id="admin-panel-close-btn" style="background:none; border:none; color:#fff; font-size:28px; cursor:pointer; padding:5px 15px;">×</button>
        </div>
        <div class="admin-panel-tabs" id="admin-tabs-container">
            <button type="button" class="admin-tab active" data-tab="create">Create Mission</button>
            <button type="button" class="admin-tab" data-tab="active">Active</button>
            <button type="button" class="admin-tab" data-tab="confirm">📋 Confirm</button>
            <button type="button" class="admin-tab" data-tab="assets">Badge Preview</button>
            <button type="button" class="admin-tab" data-tab="history">History</button>
        </div>
        <div class="admin-panel-content" id="admin-panel-body">
            <div id="admin-tab-create" class="admin-tab-content active"></div>
            <div id="admin-tab-active" class="admin-tab-content"></div>
            <div id="admin-tab-confirm" class="admin-tab-content"></div>
            <div id="admin-tab-assets" class="admin-tab-content"></div>
            <div id="admin-tab-history" class="admin-tab-content"></div>
        </div>
    `;
    
    document.body.appendChild(panel);
    document.body.style.overflow = 'hidden';
    
    // Close button
    document.getElementById('admin-panel-close-btn').onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeAdminPanel();
    };
    
    // Tab click handlers
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            const tabName = this.dataset.tab;
            console.log('🔄 Switching to tab:', tabName);
            switchAdminTab(tabName);
        };
    });
    
    // Load initial tab content
    renderCreateMissionForm();
    
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

function switchAdminTab(tabName) {
    console.log('📑 Switching tab to:', tabName);
    
    // Update tab buttons
    document.querySelectorAll('.admin-tab').forEach(t => {
        t.classList.remove('active');
        if (t.dataset.tab === tabName) t.classList.add('active');
    });
    
    // Update tab content visibility
    document.querySelectorAll('.admin-tab-content').forEach(c => {
        c.classList.remove('active');
        c.style.display = 'none';
    });
    
    const activeContent = document.getElementById(`admin-tab-${tabName}`);
    if (activeContent) {
        activeContent.classList.add('active');
        activeContent.style.display = 'block';
    }
    
    // Load content based on tab
    switch(tabName) {
        case 'create':
            renderCreateMissionForm();
            break;
        case 'active':
            loadActiveTeamMissions();
            break;
        case 'confirm':                    
            renderWeekConfirmation();
            break;
        case 'assets':
            renderAdminAssets();
            break;
        case 'history':
            loadMissionHistory();
            break;
    }
}

function renderCreateMissionForm() {
    const container = document.getElementById('admin-tab-create');
    if (!container) {
        console.error('❌ Create tab container not found');
        return;
    }
    
    // Get mission types from CONFIG or use defaults
    const missionTypes = CONFIG.MISSION_TYPES || {
        'switch_app': { icon: '📱', name: 'Switch App' },
        'filler': { icon: '🎵', name: 'Filler/Old Songs' },
        'stream': { icon: '▶️', name: 'Stream Target' },
        'custom': { icon: '⭐', name: 'Custom Party' }
    };
    
    const teams = CONFIG.TEAMS || {};
    
    container.innerHTML = `
        <div class="create-mission-form">
            <div class="form-section">
                <h4 style="color:#fff;margin-bottom:15px;">Mission Type</h4>
                <div class="mission-type-grid" id="mission-type-grid">
                    ${Object.entries(missionTypes).map(([key, m], i) => `
                        <div class="mission-type-option ${i === 0 ? 'selected' : ''}" 
                             data-type="${key}" 
                             id="mission-type-${key}">
                            <span style="font-size:24px;">${m.icon}</span>
                            <span style="font-size:12px;margin-top:5px;">${m.name}</span>
                        </div>
                    `).join('')}
                </div>
                <input type="hidden" id="selected-mission-type" value="${Object.keys(missionTypes)[0] || 'switch_app'}">
            </div>
            
            <div class="form-section">
                <h4 style="color:#fff;margin-bottom:15px;">Target Teams</h4>
                <div class="team-checkboxes" id="team-checkboxes">
                    <label class="team-checkbox" style="margin-bottom:10px;">
                        <input type="checkbox" id="select-all-teams"> 
                        <span style="color:#ffd700;font-weight:bold;">Select All Teams</span>
                    </label>
                    ${Object.keys(teams).map(team => `
                        <label class="team-checkbox">
                            <input type="checkbox" name="target-teams" value="${team}"> 
                            <span style="color:${teamColor(team)}">${team}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
            
            <div class="form-section">
                <h4 style="color:#fff;margin-bottom:15px;">Mission Details</h4>
                <input type="text" id="mission-title" class="form-input" placeholder="Mission Title...">
                <textarea id="mission-briefing" class="form-textarea" placeholder="Mission Briefing / Instructions..."></textarea>
                <input type="text" id="target-track" class="form-input" placeholder="Target Track (optional)">
                <div style="display:flex;gap:10px;">
                    <div style="flex:1;">
                        <label style="color:#888;font-size:12px;">Goal Target</label>
                        <input type="number" id="goal-target" class="form-input" value="100" min="1">
                    </div>
                    <div style="flex:1;">
                        <label style="color:#888;font-size:12px;">XP Reward</label>
                        <input type="number" id="xp-reward" class="form-input" value="5" min="1" max="50">
                    </div>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="button" id="deploy-mission-btn" class="btn-primary" style="width:100%;padding:15px;">
                    🚀 Deploy Mission
                </button>
            </div>
            <div id="create-result" style="margin-top:15px;text-align:center;"></div>
        </div>
    `;
    
    // Setup mission type click handlers
    document.querySelectorAll('.mission-type-option').forEach(option => {
        option.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            const type = this.dataset.type;
            console.log('🎯 Selected mission type:', type);
            selectMissionType(type);
        };
    });
    
    // Setup select all teams
    const selectAllCheckbox = document.getElementById('select-all-teams');
    if (selectAllCheckbox) {
        selectAllCheckbox.onchange = function() {
            const isChecked = this.checked;
            document.querySelectorAll('input[name="target-teams"]').forEach(cb => {
                cb.checked = isChecked;
            });
        };
    }
    
    // Setup deploy button
    const deployBtn = document.getElementById('deploy-mission-btn');
    if (deployBtn) {
        deployBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            createTeamMission();
        };
    }
    
    console.log('✅ Create mission form rendered');
}

function selectMissionType(type) {
    console.log('🎯 Selecting mission type:', type);
    
    // Remove selected from all
    document.querySelectorAll('.mission-type-option').forEach(el => {
        el.classList.remove('selected');
        el.style.background = '#12121a';
        el.style.borderColor = '#333';
        el.style.color = '#888';
    });
    
    // Add selected to clicked one
    const selected = document.querySelector(`.mission-type-option[data-type="${type}"]`);
    if (selected) {
        selected.classList.add('selected');
        selected.style.background = 'rgba(123, 44, 191, 0.2)';
        selected.style.borderColor = '#7b2cbf';
        selected.style.color = '#fff';
    }
    
    // Update hidden input
    const hiddenInput = document.getElementById('selected-mission-type');
    if (hiddenInput) {
        hiddenInput.value = type;
        console.log('✅ Mission type set to:', type);
    }
}

function toggleAllTeams(checked) { 
    document.querySelectorAll('input[name="target-teams"]').forEach(cb => {
        cb.checked = checked;
    }); 
}

async function createTeamMission() {
    const type = document.getElementById('selected-mission-type')?.value;
    const title = document.getElementById('mission-title')?.value?.trim();
    const briefing = document.getElementById('mission-briefing')?.value?.trim();
    const targetTrack = document.getElementById('target-track')?.value?.trim();
    const goalTarget = parseInt(document.getElementById('goal-target')?.value) || 100;
    const xpReward = parseInt(document.getElementById('xp-reward')?.value) || 5;
    
    const targetTeams = [];
    document.querySelectorAll('input[name="target-teams"]:checked').forEach(cb => {
        targetTeams.push(cb.value);
    });
    
    console.log('📤 Creating mission:', { type, title, targetTeams, goalTarget });
    
    // Validation
    if (!title) { 
        showCreateResult('❌ Please enter a mission title', true); 
        return; 
    }
    if (targetTeams.length === 0) { 
        showCreateResult('❌ Please select at least one team', true); 
        return; 
    }
    if (!briefing) { 
        showCreateResult('❌ Please enter a mission briefing', true); 
        return; 
    }
    
    loading(true);
    try {
        const res = await api('createTeamMission', { 
            type, 
            title, 
            briefing, 
            targetTeams: JSON.stringify(targetTeams), 
            targetTrack, 
            goalTarget,
            xpReward,
            week: STATE.week, 
            agentNo: STATE.agentNo, 
            sessionToken: STATE.adminSession 
        });
        
        if (res.success) { 
            showCreateResult('✅ Mission Deployed Successfully!', false);
            
            // Clear form
            document.getElementById('mission-title').value = '';
            document.getElementById('mission-briefing').value = '';
            document.getElementById('target-track').value = '';
            document.getElementById('goal-target').value = '100';
            document.getElementById('xp-reward').value = '5';
            document.querySelectorAll('input[name="target-teams"]').forEach(cb => cb.checked = false);
            document.getElementById('select-all-teams').checked = false;
            
            // Switch to active tab
            setTimeout(() => {
                switchAdminTab('active');
            }, 1500);
            
            // ✅ FIXED: Don't reset baseline, just trigger a check
            // The new mission ID won't be in seenMissionIds, so it will notify
            console.log('🔔 New mission created - users will be notified on next check');
            
        } else { 
            showCreateResult('❌ ' + (res.error || 'Failed to create mission'), true); 
        }
    } catch (e) { 
        console.error('Create mission error:', e);
        showCreateResult('❌ ' + e.message, true); 
    } finally { 
        loading(false); 
    }
}
function showCreateResult(msg, isError) {
    const el = document.getElementById('create-result');
    if (el) { 
        el.innerHTML = msg;
        el.style.color = isError ? '#ff4444' : '#00ff88';
        el.style.padding = '15px';
        el.style.borderRadius = '8px';
        el.style.background = isError ? 'rgba(255,68,68,0.1)' : 'rgba(0,255,136,0.1)';
        el.style.border = `1px solid ${isError ? '#ff4444' : '#00ff88'}`;
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            el.innerHTML = '';
            el.style.padding = '0';
            el.style.background = 'transparent';
            el.style.border = 'none';
        }, 5000);
    }
}

async function loadActiveTeamMissions() {
    const container = document.getElementById('admin-tab-active');
    if (!container) {
        console.error('❌ Active tab container not found');
        return;
    }
    
    container.innerHTML = '<div class="loading-text" style="padding:40px;text-align:center;">⏳ Loading active missions...</div>';
    
    try {
        console.log('📥 Loading active missions for week:', STATE.week);
        const res = await api('getTeamMissions', { status: 'active', week: STATE.week });
        const missions = res.missions || [];
        
        console.log('📋 Active missions:', missions.length);
        
        if (missions.length > 0) {
            container.innerHTML = `
                <div style="margin-bottom:15px;">
                    <h4 style="color:#fff;margin:0;">Active Missions (${missions.length})</h4>
                    <p style="color:#888;font-size:11px;margin-top:5px;">Click on a team to approve their completion</p>
                </div>
                ${missions.map(m => renderAdminMissionCard(m)).join('')}
            `;
        } else {
            container.innerHTML = `
                <div style="text-align:center;padding:60px 20px;">
                    <div style="font-size:64px;margin-bottom:20px;">📭</div>
                    <h3 style="color:#fff;margin-bottom:10px;">No Active Missions</h3>
                    <p style="color:#888;margin-bottom:20px;">Create a new mission to get started!</p>
                    <button onclick="switchAdminTab('create')" class="btn-primary">
                        + Create New Mission
                    </button>
                </div>
            `;
        }
    } catch (e) { 
        console.error('❌ Error loading active missions:', e);
        container.innerHTML = `
            <div style="text-align:center;padding:40px;">
                <p style="color:#ff4444;">❌ Error loading missions</p>
                <p style="color:#888;font-size:12px;">${e.message}</p>
                <button onclick="loadActiveTeamMissions()" class="btn-secondary" style="margin-top:15px;">
                    🔄 Retry
                </button>
            </div>
        `; 
    }
}
function renderAdminMissionCard(mission) {
    const targetTeams = mission.targetTeams || [];
    const completedTeams = mission.completedTeams || [];
    const progress = mission.progress || {};
    const missionType = CONFIG.MISSION_TYPES?.[mission.type] || { icon: '🎯', name: 'Mission' };
    
    const allCompleted = targetTeams.length > 0 && targetTeams.every(t => completedTeams.includes(t));
    
    return `
        <div class="admin-mission-card" style="
            background: linear-gradient(145deg, #1a1a2e, #12121a);
            border: 1px solid ${allCompleted ? 'rgba(0,255,136,0.3)' : 'rgba(123,44,191,0.3)'};
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 15px;
        ">
            <!-- Mission Header -->
            <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:15px;">
                <div style="
                    width: 45px;
                    height: 45px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, rgba(123,44,191,0.3), rgba(123,44,191,0.1));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 22px;
                ">${missionType.icon}</div>
                
                <div style="flex:1;">
                    <div style="font-weight:600;color:#fff;font-size:14px;">${sanitize(mission.title)}</div>
                    <div style="color:#888;font-size:11px;margin-top:3px;">
                        ${missionType.name} • Goal: ${mission.goalTarget || 100} • +${mission.xpReward || 5} XP
                    </div>
                    ${mission.briefing ? `
                        <div style="color:#aaa;font-size:11px;margin-top:6px;line-height:1.4;">
                            ${sanitize(mission.briefing).substring(0, 100)}${mission.briefing.length > 100 ? '...' : ''}
                        </div>
                    ` : ''}
                </div>
                
                <div style="
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 10px;
                    background: ${allCompleted ? 'rgba(0,255,136,0.1)' : 'rgba(255,165,0,0.1)'};
                    color: ${allCompleted ? '#00ff88' : '#ffa500'};
                ">${completedTeams.length}/${targetTeams.length} Done</div>
            </div>
            
            <!-- Per-Team Status -->
            <div style="
                background: rgba(0,0,0,0.2);
                border-radius: 10px;
                padding: 12px;
                margin-bottom: 12px;
            ">
                <div style="color:#888;font-size:10px;text-transform:uppercase;margin-bottom:10px;letter-spacing:1px;">
                    Team Status (Click to Approve)
                </div>
                
                <div style="display:flex;flex-wrap:wrap;gap:8px;">
                    ${targetTeams.map(team => {
                        const isCompleted = completedTeams.includes(team);
                        const teamProgress = progress[team] || 0;
                        const progressPct = mission.goalTarget ? Math.min(100, (teamProgress / mission.goalTarget) * 100) : 0;
                        const tColor = teamColor(team);
                        
                        return `
                            <div onclick="${isCompleted ? '' : `adminApproveMissionForTeam('${mission.id}', '${team}')`}" 
                                 style="
                                    flex: 1;
                                    min-width: 140px;
                                    padding: 10px;
                                    background: ${isCompleted ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.03)'};
                                    border: 1px solid ${isCompleted ? 'rgba(0,255,136,0.3)' : tColor + '44'};
                                    border-radius: 8px;
                                    cursor: ${isCompleted ? 'default' : 'pointer'};
                                    transition: all 0.2s;
                                    ${!isCompleted ? 'hover: { background: rgba(123,44,191,0.1); }' : ''}
                                 "
                                 ${!isCompleted ? `onmouseenter="this.style.background='rgba(123,44,191,0.15)';this.style.borderColor='${tColor}';" onmouseleave="this.style.background='rgba(255,255,255,0.03)';this.style.borderColor='${tColor}44';"` : ''}>
                                
                                <!-- Team Name & Status -->
                                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                                    <div style="display:flex;align-items:center;gap:6px;">
                                        ${teamPfp(team) ? `<img src="${teamPfp(team)}" style="width:18px;height:18px;border-radius:50%;">` : ''}
                                        <span style="color:${tColor};font-weight:600;font-size:11px;">${team}</span>
                                    </div>
                                    <span style="font-size:14px;">${isCompleted ? '✅' : '⏳'}</span>
                                </div>
                                
                                <!-- Progress Bar -->
                                <div style="
                                    height: 4px;
                                    background: rgba(255,255,255,0.1);
                                    border-radius: 2px;
                                    overflow: hidden;
                                    margin-bottom: 4px;
                                ">
                                    <div style="
                                        height: 100%;
                                        width: ${progressPct}%;
                                        background: ${isCompleted ? '#00ff88' : tColor};
                                        border-radius: 2px;
                                    "></div>
                                </div>
                                
                                <!-- Progress Text -->
                                <div style="font-size:10px;color:#888;">
                                    ${teamProgress} / ${mission.goalTarget || 100}
                                    ${isCompleted ? '<span style="color:#00ff88;margin-left:5px;">Approved</span>' : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button type="button" onclick="adminRefreshMissionProgress('${mission.id}')" 
                        style="
                            flex: 1;
                            min-width: 100px;
                            background: rgba(0,150,255,0.15);
                            border: 1px solid rgba(0,150,255,0.3);
                            color: #00aaff;
                            padding: 8px 12px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 11px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 5px;
                        ">
                    🔄 Refresh Progress
                </button>
                
                <button type="button" onclick="adminApproveAllTeams('${mission.id}')" 
                        style="
                            flex: 1;
                            min-width: 100px;
                            background: rgba(0,170,85,0.15);
                            border: 1px solid rgba(0,170,85,0.3);
                            color: #00ff88;
                            padding: 8px 12px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 11px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 5px;
                        ">
                    ✓ Approve All
                </button>
                
                <button type="button" onclick="adminCancelMission('${mission.id}')" 
                        style="
                            flex: 1;
                            min-width: 100px;
                            background: rgba(170,51,51,0.15);
                            border: 1px solid rgba(170,51,51,0.3);
                            color: #ff6b6b;
                            padding: 8px 12px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 11px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 5px;
                        ">
                    ✕ Cancel Mission
                </button>
            </div>
        </div>
    `;
}
// Approve mission for a SINGLE team
async function adminApproveMissionForTeam(missionId, teamName) {
    // Show confirmation modal
    const modal = document.createElement('div');
    modal.className = 'admin-confirm-modal';
    modal.innerHTML = `
        <style>
            .admin-confirm-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.9);
                z-index: 9999999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .confirm-box {
                background: linear-gradient(145deg, #1a1a2e, #0f0f1f);
                border: 1px solid rgba(0,255,136,0.3);
                border-radius: 16px;
                padding: 25px;
                max-width: 400px;
                width: 100%;
                text-align: center;
            }
        </style>
        
        <div class="confirm-box" onclick="event.stopPropagation()">
            <div style="font-size:48px;margin-bottom:15px;">✅</div>
            <h3 style="color:#fff;margin:0 0 10px;">Approve Mission?</h3>
            <p style="color:#888;font-size:13px;margin-bottom:20px;">
                Approve mission completion for <strong style="color:${teamColor(teamName)}">${teamName}</strong>?<br>
                <span style="color:#00ff88;">This will award XP to the team.</span>
            </p>
            
            <div style="display:flex;gap:10px;justify-content:center;">
                <button onclick="this.closest('.admin-confirm-modal').remove()" style="
                    padding: 12px 25px;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 8px;
                    color: #888;
                    cursor: pointer;
                    font-size: 13px;
                ">Cancel</button>
                
                <button onclick="executeTeamApproval('${missionId}', '${teamName}'); this.closest('.admin-confirm-modal').remove();" style="
                    padding: 12px 25px;
                    background: linear-gradient(135deg, #00ff88, #00cc6a);
                    border: none;
                    border-radius: 8px;
                    color: #000;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                ">✓ Approve</button>
            </div>
        </div>
    `;
    
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    document.body.appendChild(modal);
}
window.adminApproveMissionForTeam = adminApproveMissionForTeam;
// Execute the approval
async function executeTeamApproval(missionId, teamName) {
    loading(true);
    try {
        const res = await api('completeTeamMission', { 
            missionId: missionId, 
            team: teamName, 
            agentNo: STATE.agentNo, 
            sessionToken: STATE.adminSession 
        });
        
        if (res.success) { 
            showToast(`✅ ${teamName} approved! +${res.xpAwarded || 5} XP`, 'success'); 
            
            // RELOAD MISSIONS
            loadActiveTeamMissions(); 
            
            // FORCE DASHBOARD REFRESH
            // This ensures the next time you click 'Team Level', it gets the +5XP
            if (typeof loadDashboard === 'function') {
                STATE.data = null; // Clear local data cache
            }
            
        } else { 
            showToast('❌ ' + (res.error || 'Failed to approve'), 'error'); 
        }
    } catch (e) { 
        showToast('❌ Error: ' + e.message, 'error'); 
    } finally { 
        loading(false); 
    }
}

// Approve ALL remaining teams
async function adminApproveAllTeams(missionId) {
    if (!confirm('Approve mission for ALL remaining teams? This will award XP to all.')) return;
    
    loading(true);
    try {
        // Get mission details to find remaining teams
        const res = await api('getTeamMissions', { status: 'active', week: STATE.week });
        const mission = (res.missions || []).find(m => m.id === missionId);
        
        if (!mission) {
            showToast('❌ Mission not found', 'error');
            loading(false);
            return;
        }
        
        const targetTeams = mission.targetTeams || [];
        const completedTeams = mission.completedTeams || [];
        const remainingTeams = targetTeams.filter(t => !completedTeams.includes(t));
        
        if (remainingTeams.length === 0) {
            showToast('All teams already approved!', 'info');
            loading(false);
            return;
        }
        
        // Approve each remaining team
        let successCount = 0;
        for (const team of remainingTeams) {
            try {
                const result = await api('completeTeamMission', { 
                    missionId: missionId, 
                    team: team, 
                    agentNo: STATE.agentNo, 
                    sessionToken: STATE.adminSession 
                });
                if (result.success) successCount++;
            } catch (e) {
                console.error(`Failed to approve ${team}:`, e);
            }
        }
        
        showToast(`✅ Approved ${successCount}/${remainingTeams.length} teams`, 'success');
        loadActiveTeamMissions();
        
    } catch (e) { 
        showToast('❌ Error: ' + e.message, 'error'); 
    } finally { 
        loading(false); 
    }
}
window.adminApproveAllTeams = adminApproveAllTeams;

// Refresh mission progress from data
async function adminRefreshMissionProgress(missionId) {
    loading(true);
    try {
        const res = await api('refreshMissionProgress', { 
            missionId: missionId, 
            agentNo: STATE.agentNo, 
            sessionToken: STATE.adminSession 
        });
        
        if (res.success) { 
            showToast('✅ Progress refreshed!', 'success'); 
            loadActiveTeamMissions(); 
        } else { 
            showToast('❌ ' + (res.error || 'Failed to refresh'), 'error'); 
        }
    } catch (e) { 
        showToast('❌ Error: ' + e.message, 'error'); 
    } finally { 
        loading(false); 
    }
}
window.adminRefreshMissionProgress = adminRefreshMissionProgress;
// Keep old function for backward compatibility but improved
async function adminCompleteMission(id) {
    // Show team selection modal instead of prompt
    try {
        const res = await api('getTeamMissions', { status: 'active', week: STATE.week });
        const mission = (res.missions || []).find(m => m.id === id);
        
        if (!mission) {
            showToast('Mission not found', 'error');
            return;
        }
        
        const targetTeams = mission.targetTeams || [];
        const completedTeams = mission.completedTeams || [];
        const remainingTeams = targetTeams.filter(t => !completedTeams.includes(t));
        
        if (remainingTeams.length === 0) {
            showToast('All teams already completed!', 'info');
            return;
        }
        
        // Show selection modal
        const modal = document.createElement('div');
        modal.className = 'admin-team-select-modal';
        modal.innerHTML = `
            <style>
                .admin-team-select-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.9);
                    z-index: 9999999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .team-select-box {
                    background: linear-gradient(145deg, #1a1a2e, #0f0f1f);
                    border: 1px solid rgba(123,44,191,0.3);
                    border-radius: 16px;
                    padding: 25px;
                    max-width: 400px;
                    width: 100%;
                }
                .team-option {
                    padding: 12px 15px;
                    margin: 8px 0;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.2s;
                }
                .team-option:hover {
                    background: rgba(123,44,191,0.15);
                    border-color: rgba(123,44,191,0.4);
                }
            </style>
            
            <div class="team-select-box" onclick="event.stopPropagation()">
                <h3 style="color:#fff;margin:0 0 5px;">Select Team to Approve</h3>
                <p style="color:#888;font-size:12px;margin-bottom:15px;">${sanitize(mission.title)}</p>
                
                ${remainingTeams.map(team => `
                    <div class="team-option" onclick="executeTeamApproval('${id}', '${team}'); this.closest('.admin-team-select-modal').remove();">
                        ${teamPfp(team) ? `<img src="${teamPfp(team)}" style="width:24px;height:24px;border-radius:50%;">` : ''}
                        <span style="color:${teamColor(team)};font-weight:600;">${team}</span>
                        <span style="margin-left:auto;color:#888;font-size:11px;">
                            ${mission.progress?.[team] || 0}/${mission.goalTarget || 100}
                        </span>
                    </div>
                `).join('')}
                
                ${completedTeams.length > 0 ? `
                    <div style="margin-top:15px;padding-top:15px;border-top:1px solid rgba(255,255,255,0.1);">
                        <div style="color:#888;font-size:11px;margin-bottom:8px;">Already Completed:</div>
                        <div style="display:flex;flex-wrap:wrap;gap:6px;">
                            ${completedTeams.map(team => `
                                <span style="
                                    padding: 4px 10px;
                                    background: rgba(0,255,136,0.1);
                                    border: 1px solid rgba(0,255,136,0.3);
                                    border-radius: 12px;
                                    color: #00ff88;
                                    font-size: 10px;
                                ">${team} ✓</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div style="margin-top:20px;display:flex;gap:10px;">
                    <button onclick="this.closest('.admin-team-select-modal').remove()" style="
                        flex: 1;
                        padding: 12px;
                        background: rgba(255,255,255,0.1);
                        border: 1px solid rgba(255,255,255,0.2);
                        border-radius: 8px;
                        color: #888;
                        cursor: pointer;
                    ">Cancel</button>
                    
                    <button onclick="adminApproveAllTeams('${id}'); this.closest('.admin-team-select-modal').remove();" style="
                        flex: 1;
                        padding: 12px;
                        background: linear-gradient(135deg, #00ff88, #00cc6a);
                        border: none;
                        border-radius: 8px;
                        color: #000;
                        cursor: pointer;
                        font-weight: 600;
                    ">Approve All (${remainingTeams.length})</button>
                </div>
            </div>
        `;
        
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
        
        document.body.appendChild(modal);
        
    } catch (e) {
        console.error('Error:', e);
        // Fallback to prompt
        const team = prompt('Enter Team Name to approve:');
        if (team && team.trim()) {
            executeTeamApproval(id, team.trim());
        }
    }
}
async function loadMissionHistory() {
    const container = document.getElementById('admin-tab-history');
    if (!container) {
        console.error('❌ History tab container not found');
        return;
    }
    
    container.innerHTML = '<div class="loading-text" style="padding:40px;text-align:center;">⏳ Loading mission history...</div>';
    
    try {
        console.log('📥 Loading mission history for week:', STATE.week);
        const res = await api('getTeamMissions', { status: 'all', week: STATE.week });
        const allMissions = res.missions || [];
        const missions = allMissions.filter(m => m.status !== 'active');
        
        console.log('📜 History missions:', missions.length);
        
        if (missions.length > 0) {
            container.innerHTML = `
                <div style="margin-bottom:15px;">
                    <h4 style="color:#fff;margin:0;">Mission History (${missions.length})</h4>
                </div>
                ${missions.map(m => `
                    <div style="padding:15px;border-bottom:1px solid #333;display:flex;justify-content:space-between;align-items:center;">
                        <div style="display:flex;align-items:center;gap:10px;">
                            <span style="font-size:20px;">${CONFIG.MISSION_TYPES?.[m.type]?.icon || '🎯'}</span>
                            <div>
                                <div style="color:#fff;font-weight:500;">${sanitize(m.title)}</div>
                                <div style="color:#666;font-size:11px;">Teams: ${(m.targetTeams || []).join(', ')}</div>
                            </div>
                        </div>
                        <span style="padding:4px 12px;border-radius:12px;font-size:11px;text-transform:uppercase;
                                     background:${m.status === 'completed' ? 'rgba(0,255,136,0.1)' : 'rgba(255,68,68,0.1)'};
                                     color:${m.status === 'completed' ? '#00ff88' : '#ff4444'};">
                            ${m.status || 'unknown'}
                        </span>
                    </div>
                `).join('')}
            `;
        } else {
            container.innerHTML = `
                <div style="text-align:center;padding:60px 20px;">
                    <div style="font-size:64px;margin-bottom:20px;">📜</div>
                    <h3 style="color:#fff;margin-bottom:10px;">No Mission History</h3>
                    <p style="color:#888;">Completed and cancelled missions will appear here.</p>
                </div>
            `;
        }
    } catch (e) { 
        console.error('❌ Error loading history:', e);
        container.innerHTML = `
            <div style="text-align:center;padding:40px;">
                <p style="color:#ff4444;">❌ Error loading history</p>
                <p style="color:#888;font-size:12px;">${e.message}</p>
                <button onclick="loadMissionHistory()" class="btn-secondary" style="margin-top:15px;">
                    🔄 Retry
                </button>
            </div>
        `; 
    }
}
// ==================== ADMIN WEEK CONFIRMATION ====================

async function renderWeekConfirmation() {
    const container = document.getElementById('admin-tab-confirm');
    if (!container) {
        console.error('❌ Confirm tab container not found');
        return;
    }
    
    container.innerHTML = '<div class="loading-text" style="padding:40px;text-align:center;">⏳ Loading week status...</div>';
    
    try {
        const summary = await api('getWeeklySummary', { week: STATE.week });
        const teams = summary.teams || {};
        const isCompleted = isWeekCompleted(STATE.week);
        
        container.innerHTML = `
            <div style="margin-bottom:20px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <h4 style="color:#fff;margin:0;">📋 ${STATE.week} Confirmations</h4>
                    <span style="
                        padding: 6px 12px;
                        background: ${isCompleted ? 'rgba(0,255,136,0.1)' : 'rgba(255,165,0,0.1)'};
                        border: 1px solid ${isCompleted ? 'rgba(0,255,136,0.3)' : 'rgba(255,165,0,0.3)'};
                        border-radius: 20px;
                        color: ${isCompleted ? '#00ff88' : '#ffa500'};
                        font-size: 11px;
                    ">${isCompleted ? '✅ Week Ended' : '⏳ In Progress'}</span>
                </div>
                <p style="color:#888;font-size:12px;margin-top:8px;">
                    Confirm attendance and police reports for each team.<br>
                    <span style="color:#ffa500;">Deadline: Sunday 4:00 PM IST</span>
                </p>
            </div>
            
            <!-- Deadline Warning -->
            <div style="
                background: rgba(255,68,68,0.1);
                border: 1px solid rgba(255,68,68,0.3);
                border-radius: 12px;
                padding: 15px;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 12px;
            ">
                <span style="font-size:24px;">⚠️</span>
                <div>
                    <div style="color:#ff6b6b;font-weight:600;font-size:13px;">Important!</div>
                    <div style="color:#ccc;font-size:11px;">
                        Only confirm AFTER you receive reports from Attendance Checkers and Police Agents.
                        Teams without both confirmations are NOT eligible to win.
                    </div>
                </div>
            </div>
            
            <!-- Team Cards -->
            ${Object.entries(teams).map(([teamName, info]) => {
                const eligibility = getTeamEligibilityStatus(info);
                const tColor = teamColor(teamName);
                
                return `
                    <div style="
                        background: linear-gradient(145deg, #1a1a2e, #12121a);
                        border: 1px solid ${tColor}44;
                        border-radius: 12px;
                        padding: 18px;
                        margin-bottom: 12px;
                    ">
                        <!-- Team Header -->
                        <div style="display:flex;align-items:center;gap:12px;margin-bottom:15px;">
                            ${teamPfp(teamName) ? `<img src="${teamPfp(teamName)}" style="width:40px;height:40px;border-radius:50%;border:2px solid ${tColor};">` : ''}
                            <div style="flex:1;">
                                <div style="color:${tColor};font-weight:600;font-size:15px;">${teamName}</div>
                                <div style="color:#888;font-size:11px;">${fmt(info.teamXP || 0)} XP</div>
                            </div>
                            <div style="
                                padding: 4px 12px;
                                border-radius: 12px;
                                font-size: 11px;
                                background: ${eligibility.allPassed ? 'rgba(0,255,136,0.1)' : 'rgba(255,165,0,0.1)'};
                                color: ${eligibility.allPassed ? '#00ff88' : '#ffa500'};
                            ">${eligibility.passedCount}/${eligibility.totalChecks} ✓</div>
                        </div>
                        
                        <!-- Mission Status -->
                        <div style="
                            display: grid;
                            grid-template-columns: repeat(5, 1fr);
                            gap: 6px;
                            margin-bottom: 15px;
                            text-align: center;
                        ">
                            <div style="padding:8px;background:rgba(0,0,0,0.2);border-radius:8px;">
                                <div style="font-size:16px;">${info.trackGoalPassed ? '✅' : '❌'}</div>
                                <div style="font-size:9px;color:#888;margin-top:4px;">Tracks</div>
                            </div>
                            <div style="padding:8px;background:rgba(0,0,0,0.2);border-radius:8px;">
                                <div style="font-size:16px;">${info.albumGoalPassed ? '✅' : '❌'}</div>
                                <div style="font-size:9px;color:#888;margin-top:4px;">Albums</div>
                            </div>
                            <div style="padding:8px;background:rgba(0,0,0,0.2);border-radius:8px;">
                                <div style="font-size:16px;">${info.album2xPassed ? '✅' : '❌'}</div>
                                <div style="font-size:9px;color:#888;margin-top:4px;">2X</div>
                            </div>
                            <div style="padding:8px;background:${info.attendanceConfirmed ? 'rgba(0,255,136,0.1)' : 'rgba(255,165,0,0.1)'};border-radius:8px;border:1px solid ${info.attendanceConfirmed ? 'rgba(0,255,136,0.3)' : 'rgba(255,165,0,0.3)'};">
                                <div style="font-size:16px;">${info.attendanceConfirmed ? '✅' : '⏳'}</div>
                                <div style="font-size:9px;color:#888;margin-top:4px;">Attend</div>
                            </div>
                            <div style="padding:8px;background:${info.policeConfirmed ? 'rgba(0,255,136,0.1)' : 'rgba(255,165,0,0.1)'};border-radius:8px;border:1px solid ${info.policeConfirmed ? 'rgba(0,255,136,0.3)' : 'rgba(255,165,0,0.3)'};">
                                <div style="font-size:16px;">${info.policeConfirmed ? '✅' : '⏳'}</div>
                                <div style="font-size:9px;color:#888;margin-top:4px;">Police</div>
                            </div>
                        </div>
                        
                        <!-- Confirmation Buttons -->
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                            <button onclick="adminConfirmAttendance('${teamName}', ${!info.attendanceConfirmed})" style="
                                padding: 12px;
                                background: ${info.attendanceConfirmed ? 'rgba(0,255,136,0.15)' : 'rgba(123,44,191,0.2)'};
                                border: 1px solid ${info.attendanceConfirmed ? 'rgba(0,255,136,0.4)' : 'rgba(123,44,191,0.4)'};
                                border-radius: 8px;
                                color: ${info.attendanceConfirmed ? '#00ff88' : '#c9a0ff'};
                                font-size: 12px;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 6px;
                            ">
                                <span>📋</span>
                                <span>${info.attendanceConfirmed ? 'Attendance ✓' : 'Confirm Attendance'}</span>
                            </button>
                            
                            <button onclick="adminConfirmPolice('${teamName}', ${!info.policeConfirmed})" style="
                                padding: 12px;
                                background: ${info.policeConfirmed ? 'rgba(0,255,136,0.15)' : 'rgba(123,44,191,0.2)'};
                                border: 1px solid ${info.policeConfirmed ? 'rgba(0,255,136,0.4)' : 'rgba(123,44,191,0.4)'};
                                border-radius: 8px;
                                color: ${info.policeConfirmed ? '#00ff88' : '#c9a0ff'};
                                font-size: 12px;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 6px;
                            ">
                                <span>👮</span>
                                <span>${info.policeConfirmed ? 'Police ✓' : 'Confirm Police'}</span>
                            </button>
                        </div>
                    </div>
                `;
            }).join('')}
            
            <!-- Eligible Teams Summary -->
            <div style="
                margin-top: 20px;
                padding: 15px;
                background: rgba(255,215,0,0.05);
                border: 1px solid rgba(255,215,0,0.2);
                border-radius: 12px;
            ">
                <div style="color:#ffd700;font-weight:600;font-size:13px;margin-bottom:10px;">🏆 Eligible to Win</div>
                ${(() => {
                    const eligible = Object.entries(teams).filter(([t, info]) => isTeamEligibleForWin(info));
                    if (eligible.length === 0) {
                        return '<div style="color:#888;font-size:12px;">No team is fully eligible yet. Confirm attendance and police reports.</div>';
                    }
                    const sorted = eligible.sort((a, b) => (b[1].teamXP || 0) - (a[1].teamXP || 0));
                    const winner = sorted[0][0];
                    return `
                        <div style="display:flex;flex-wrap:wrap;gap:8px;">
                            ${sorted.map(([t, info], i) => `
                                <div style="
                                    display:flex;
                                    align-items:center;
                                    gap:6px;
                                    padding:6px 12px;
                                    background:${i === 0 ? 'rgba(255,215,0,0.15)' : 'rgba(0,255,136,0.1)'};
                                    border:1px solid ${i === 0 ? 'rgba(255,215,0,0.4)' : 'rgba(0,255,136,0.3)'};
                                    border-radius:20px;
                                ">
                                    ${i === 0 ? '<span>👑</span>' : '<span>✓</span>'}
                                    <span style="color:${teamColor(t)};font-weight:600;font-size:12px;">${t}</span>
                                    <span style="color:#888;font-size:10px;">${fmt(info.teamXP)} XP</span>
                                </div>
                            `).join('')}
                        </div>
                        <div style="margin-top:10px;color:#00ff88;font-size:12px;">
                            🏆 Current Winner: <strong>${winner}</strong>
                        </div>
                    `;
                })()}
            </div>
        `;
        
    } catch (e) {
        console.error('❌ Error loading week confirmation:', e);
        container.innerHTML = `
            <div style="text-align:center;padding:40px;">
                <p style="color:#ff4444;">❌ Error loading data</p>
                <button onclick="renderWeekConfirmation()" class="btn-secondary" style="margin-top:15px;">🔄 Retry</button>
            </div>
        `;
    }
}

// Admin action: Confirm Attendance
async function adminConfirmAttendance(teamName, confirm) {
    if (!confirm && !window.confirm(`Remove attendance confirmation for ${teamName}?`)) return;
    
    loading(true);
    try {
        const result = await api('confirmTeamAttendance', {
            week: STATE.week,
            team: teamName,
            confirmed: confirm,
            agentNo: STATE.agentNo,
            sessionToken: STATE.adminSession
        });
        
        if (result.success) {
            showToast(`✅ ${teamName} attendance ${confirm ? 'confirmed' : 'removed'}`, 'success');
            renderWeekConfirmation();
        } else {
            showToast('❌ ' + (result.error || 'Failed'), 'error');
        }
    } catch (e) {
        showToast('❌ Error: ' + e.message, 'error');
    } finally {
        loading(false);
    }
}

// Admin action: Confirm Police
async function adminConfirmPolice(teamName, confirm) {
    if (!confirm && !window.confirm(`Remove police confirmation for ${teamName}?`)) return;
    
    loading(true);
    try {
        const result = await api('confirmTeamPolice', {
            week: STATE.week,
            team: teamName,
            confirmed: confirm,
            agentNo: STATE.agentNo,
            sessionToken: STATE.adminSession
        });
        
        if (result.success) {
            showToast(`✅ ${teamName} police report ${confirm ? 'confirmed' : 'removed'}`, 'success');
            renderWeekConfirmation();
        } else {
            showToast('❌ ' + (result.error || 'Failed'), 'error');
        }
    } catch (e) {
        showToast('❌ Error: ' + e.message, 'error');
    } finally {
        loading(false);
    }
}
async function setTodaysSong() {
    const title = prompt('Song Title:');
    if (!title) return;
    
    const youtubeId = prompt('YouTube Video ID (11 characters):');
    if (!youtubeId) return;
    
    const hint = prompt('Hint for players:');
    const xpReward = prompt('XP Reward (default 1):', '1');
    
    try {
        const result = await api('setSongOfDay', {
            agentNo: STATE.agentNo,
            sessionToken: STATE.adminSession,
            title,
            youtubeId,
            hint,
            xpReward: parseInt(xpReward) || 1
        });
        
        if (result.success) {
            showToast('✅ Song of the day set!', 'success');
        } else {
            showToast('❌ ' + result.error, 'error');
        }
    } catch (e) {
        showToast('Failed to set song', 'error');
    }
}

function renderAdminAssets() {
    const container = document.getElementById('admin-tab-assets');
    if (!container) {
        console.error('❌ Assets tab container not found');
        return;
    }
    
    const badges = CONFIG.BADGE_POOL || [];
    
    console.log('🎖️ Rendering badge pool:', badges.length, 'badges');
    
    if (badges.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:60px 20px;">
                <div style="font-size:64px;margin-bottom:20px;">🎖️</div>
                <h3 style="color:#fff;margin-bottom:10px;">No Badges Configured</h3>
                <p style="color:#888;">Add badge URLs to CONFIG.BADGE_POOL in config.js</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div style="margin-bottom:20px;">
            <h4 style="color:#ffd700;margin-bottom:5px;">🎖️ Badge Pool Preview (${badges.length} badges)</h4>
            <p style="color:#888;font-size:12px;">This is exactly how agents will see their badges. Click any badge to preview full size.</p>
        </div>
        
        <div class="badges-showcase" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:20px;padding:10px;">
            ${badges.map((url, index) => `
                <div class="badge-showcase-item" onclick="previewAsset('${url}', ${index + 1})" 
                     style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:15px 10px;
                            background:linear-gradient(145deg,rgba(26,26,46,0.8),rgba(18,18,26,0.9));
                            border-radius:12px;border:1px solid rgba(123,44,191,0.2);cursor:pointer;transition:all 0.3s;">
                    <div class="badge-circle holographic" style="width:70px;height:70px;">
                        <img src="${url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" 
                             onerror="this.style.display='none';this.parentElement.innerHTML='❓';">
                    </div>
                    <div style="margin-top:10px;font-weight:600;color:#ffd700;font-size:12px;">Level ${index + 1}</div>
                    <div style="font-size:10px;color:#888;margin-top:2px;">Badge #${index + 1}</div>
                </div>
            `).join('')}
        </div>
        
        <div style="margin-top:25px;padding:15px;background:#1a1a2e;border-radius:8px;border:1px solid #333;">
            <h5 style="color:#fff;margin-bottom:10px;">ℹ️ How Badge Assignment Works</h5>
            <ul style="color:#888;font-size:12px;margin:0;padding-left:20px;line-height:1.8;">
                <li>Agents earn 1 badge for every <strong style="color:#ffd700;">100 XP</strong></li>
                <li>Badges have the <strong style="color:#7b2cbf;">holographic spinning effect</strong></li>
                <li>Each agent gets unique badges based on their Agent ID + Level</li>
                <li>Add more badge URLs in <code style="background:#0a0a0f;padding:2px 6px;border-radius:4px;color:#00ff88;">CONFIG.BADGE_POOL</code></li>
            </ul>
        </div>
    `;
    
    // Add hover effect
    container.querySelectorAll('.badge-showcase-item').forEach(item => {
        item.onmouseenter = function() {
            this.style.transform = 'translateY(-5px)';
            this.style.borderColor = 'rgba(255, 215, 0, 0.5)';
            this.style.boxShadow = '0 10px 30px rgba(123, 44, 191, 0.3)';
        };
        item.onmouseleave = function() {
            this.style.transform = 'translateY(0)';
            this.style.borderColor = 'rgba(123, 44, 191, 0.2)';
            this.style.boxShadow = 'none';
        };
    });
}

function previewAsset(url, index) {
    // Remove existing preview
    document.querySelectorAll('.asset-preview-modal').forEach(m => m.remove());
    
    const modal = document.createElement('div');
    modal.className = 'asset-preview-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.95);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 99999999;
        cursor: pointer;
    `;
    
    modal.innerHTML = `
        <style>
            .preview-badge-circle {
                width: 200px;
                height: 200px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                position: relative;
                background: linear-gradient(135deg, #1a1a2e, #2a2a3e);
                padding: 5px;
                box-shadow: 0 0 30px rgba(255, 215, 0, 0.4), 
                            0 0 60px rgba(123, 44, 191, 0.3), 
                            0 0 90px rgba(0, 212, 255, 0.2);
            }
            
            .preview-badge-circle::before {
                content: '';
                position: absolute;
                top: -5px;
                left: -5px;
                right: -5px;
                bottom: -5px;
                border-radius: 50%;
                background: conic-gradient(from 0deg, #ffd700, #ff6b6b, #c56cf0, #7b2cbf, #00d4ff, #00ff88, #ffd700);
                z-index: -1;
                animation: previewHoloSpin 3s linear infinite;
            }
            
            .preview-badge-circle::after {
                content: '';
                position: absolute;
                top: 5px;
                left: 5px;
                right: 5px;
                bottom: 5px;
                border-radius: 50%;
                background: #1a1a2e;
                z-index: -1;
            }
            
            @keyframes previewHoloSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .preview-badge-circle img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
                position: relative;
                z-index: 1;
            }
            
            .preview-glow {
                position: absolute;
                width: 250px;
                height: 250px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(123,44,191,0.3) 0%, transparent 70%);
                animation: previewPulse 2s ease-in-out infinite;
            }
            
            @keyframes previewPulse {
                0%, 100% { transform: scale(1); opacity: 0.5; }
                50% { transform: scale(1.1); opacity: 0.8; }
            }
        </style>
        
        <div class="preview-glow"></div>
        
        <div class="preview-badge-circle">
            <img src="${url}" onerror="this.parentElement.innerHTML='<div style=\\'font-size:60px;\\'>❓</div>'">
        </div>
        
        <div style="margin-top:30px;text-align:center;">
            <div style="color:#ffd700;font-size:28px;font-weight:bold;text-shadow:0 0 20px rgba(255,215,0,0.5);">
                Level ${index} Badge
            </div>
            <div style="color:#888;font-size:14px;margin-top:8px;">
                Badge #${index} from pool
            </div>
            <div style="color:#7b2cbf;font-size:12px;margin-top:5px;">
                ✨ Holographic Edition
            </div>
        </div>
        
        <div style="margin-top:30px;display:flex;gap:15px;">
            <button onclick="event.stopPropagation(); navigatePreview(${index - 1})" 
                    class="btn-secondary" style="padding:12px 20px;${index <= 1 ? 'opacity:0.3;pointer-events:none;' : ''}">
                ← Previous
            </button>
            <button onclick="this.closest('.asset-preview-modal').remove()" 
                    class="btn-primary" style="padding:12px 30px;">
                Close
            </button>
            <button onclick="event.stopPropagation(); navigatePreview(${index + 1})" 
                    class="btn-secondary" style="padding:12px 20px;${index >= (CONFIG.BADGE_POOL?.length || 0) ? 'opacity:0.3;pointer-events:none;' : ''}">
                Next →
            </button>
        </div>
        
        <div style="margin-top:20px;color:#666;font-size:11px;">
            Tap anywhere outside to close
        </div>
    `;
    
    modal.onclick = function(e) {
        if (e.target === modal) modal.remove();
    };
    
    document.body.appendChild(modal);
}

// Navigate between badge previews
function navigatePreview(index) {
    const badges = CONFIG.BADGE_POOL || [];
    if (index < 1 || index > badges.length) return;
    
    const url = badges[index - 1];
    if (url) {
        document.querySelectorAll('.asset-preview-modal').forEach(m => m.remove());
        previewAsset(url, index);
    }
}

async function adminCompleteMission(id) {
    const team = prompt('Enter Team Name to mark as complete (or "all" for all teams):');
    if (!team || !team.trim()) return;
    
    loading(true);
    try {
        const res = await api('completeTeamMission', { 
            missionId: id, 
            team: team.trim(), 
            agentNo: STATE.agentNo, 
            sessionToken: STATE.adminSession 
        });
        
        if (res.success) { 
            showToast('✅ Mission completed for ' + team, 'success'); 
            loadActiveTeamMissions(); 
        } else { 
            showToast('❌ ' + (res.error || 'Failed to complete mission'), 'error'); 
        }
    } catch (e) { 
        showToast('❌ Error: ' + e.message, 'error'); 
    } finally { 
        loading(false); 
    }
}

async function adminCancelMission(id) {
    if (!confirm('Are you sure you want to cancel this mission?')) return;
    
    loading(true);
    try {
        const res = await api('cancelTeamMission', { 
            missionId: id, 
            agentNo: STATE.agentNo, 
            sessionToken: STATE.adminSession 
        });
        
        if (res.success) { 
            showToast('✅ Mission cancelled', 'success'); 
            loadActiveTeamMissions(); 
        } else { 
            showToast('❌ ' + (res.error || 'Failed to cancel mission'), 'error'); 
        }
    } catch (e) { 
        showToast('❌ Error: ' + e.message, 'error'); 
    } finally { 
        loading(false); 
    }
}
// ==================== CSS ====================
function ensureAppCSS() {
    if ($('app-custom-styles')) return;
    const style = document.createElement('style');
    style.id = 'app-custom-styles';
    style.innerHTML = `
        .admin-panel{position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;background:#0a0a0f!important;z-index:999999!important;display:flex!important;flex-direction:column!important}
        .admin-panel-header{background:#1a1a2e;padding:15px;border-bottom:1px solid #333;display:flex;justify-content:space-between;align-items:center}
        .admin-panel-content{flex:1;overflow-y:auto;padding:20px}
        .admin-panel-tabs{display:flex;background:#12121a;padding:10px;gap:10px;overflow-x:auto}
        .admin-tab{padding:8px 16px;border:1px solid #333;border-radius:20px;background:transparent;color:#888;cursor:pointer;white-space:nowrap;transition:all .3s}
        .admin-tab:hover{background:rgba(123,44,191,.2);border-color:#7b2cbf}
        .admin-tab.active{background:#7b2cbf;color:#fff;border-color:#7b2cbf}
        .admin-tab-content{display:none}
        .admin-tab-content.active{display:block}
        .admin-mission-card{background:#1a1a2e;padding:15px;border-radius:8px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center}
        .admin-modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.9);z-index:999998;display:flex;align-items:center;justify-content:center}
        .admin-modal{background:linear-gradient(145deg,#1a1a2e,#0a0a0f);border-radius:16px;width:90%;max-width:400px;border:1px solid #7b2cbf;box-shadow:0 0 50px rgba(123,44,191,.3)}
        .admin-modal-header{display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid #333}
        .admin-modal-header h3{color:#fff;margin:0}
        .admin-modal-close{background:none;border:none;color:#888;font-size:28px;cursor:pointer;padding:0;line-height:1}
        .admin-modal-body{padding:20px}
        .admin-modal-footer{display:flex;gap:10px;padding:20px;border-top:1px solid #333;justify-content:flex-end}
        .terminal-style{background:#0a0a0f;border:1px solid #333;border-radius:8px;padding:15px}
        .terminal-label{color:#888;font-size:12px;display:block;margin-bottom:5px}
        .terminal-input{width:100%;background:transparent;border:1px solid #444;border-radius:4px;padding:10px;color:#fff;font-family:monospace}
        .admin-error{color:#ff4444;text-align:center;padding:10px;display:none}
        .admin-error.show{display:block}
        .create-mission-form{padding:10px 0}
        .form-section{margin-bottom:20px}
        .form-section h4{color:#fff;margin-bottom:10px;font-size:14px}
        .form-input,.form-textarea{width:100%;background:#12121a;border:1px solid #333;border-radius:8px;padding:12px;color:#fff;margin-bottom:10px;font-size:14px}
        .form-textarea{min-height:80px;resize:vertical}
        .mission-type-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
        .mission-type-option{padding:12px;background:#12121a;border:1px solid #333;border-radius:8px;cursor:pointer;text-align:center;color:#888;transition:all .3s}
        .mission-type-option:hover{border-color:#7b2cbf}
        .mission-type-option.selected{background:rgba(123,44,191,.2);border-color:#7b2cbf;color:#fff}
        .team-checkboxes{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:10px}
        .team-checkbox{display:flex;align-items:center;gap:6px;cursor:pointer}
        .form-actions{margin-top:20px}
        .btn-primary{background:linear-gradient(135deg,#7b2cbf,#5a1f99);color:#fff;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;font-weight:600;transition:all .3s}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 5px 20px rgba(123,44,191,.4)}
        .btn-secondary{background:#333;color:#fff;border:none;padding:12px 24px;border-radius:8px;cursor:pointer}
        .loading-text{color:#888;text-align:center;padding:20px}
        .badge-circle{width:70px;height:70px;border-radius:50%;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;background:#1a1a2e;transition:transform .3s,box-shadow .3s}
        .badge-circle.holographic{background:linear-gradient(135deg,#1a1a2e,#2a2a3e);border:none!important;padding:3px}
        .badge-circle.holographic::before{content:'';position:absolute;top:-3px;left:-3px;right:-3px;bottom:-3px;border-radius:50%;background:conic-gradient(from 0deg,#ffd700,#ff6b6b,#c56cf0,#7b2cbf,#00d4ff,#00ff88,#ffd700);z-index:-1;animation:holoSpin 4s linear infinite}
        .badge-circle.holographic::after{content:'';position:absolute;top:3px;left:3px;right:3px;bottom:3px;border-radius:50%;background:#1a1a2e;z-index:-1}
        .badge-circle.holographic{box-shadow:0 0 15px rgba(255,215,0,.4),0 0 30px rgba(123,44,191,.3),0 0 45px rgba(0,212,255,.2)}
        .badge-circle:hover{transform:scale(1.1)}
        @keyframes holoSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        .badge-circle img{width:100%;height:100%;object-fit:cover;border-radius:50%;position:relative;z-index:1}
        .assets-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:15px;padding:10px}
        .asset-chip{position:relative;aspect-ratio:1;border-radius:16px;overflow:hidden;background:linear-gradient(145deg,#1a1a2e,#12121a);border:2px solid rgba(123,44,191,.3);cursor:pointer;transition:all .3s}
        .asset-chip:hover{transform:translateY(-5px) scale(1.05);box-shadow:0 10px 30px rgba(123,44,191,.4)}
        .asset-chip-inner{width:100%;height:100%;border-radius:14px;overflow:hidden;background:#1a1a2e;position:relative}
        .asset-chip img{width:100%;height:100%;object-fit:cover;transition:transform .3s}
        .asset-chip:hover img{transform:scale(1.1)}
        .asset-chip-number{position:absolute;top:8px;left:8px;background:rgba(0,0,0,.8);color:#ffd700;padding:4px 8px;border-radius:10px;font-size:11px;font-weight:bold;z-index:2}
        .badges-showcase{display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:15px;padding:10px}
        .badge-showcase-item{display:flex;flex-direction:column;align-items:center;text-align:center;padding:12px 8px;background:linear-gradient(145deg,rgba(26,26,46,.8),rgba(18,18,26,.9));border-radius:12px;border:1px solid rgba(123,44,191,.2);transition:all .3s}
        .badge-showcase-item:hover{transform:translateY(-5px);border-color:rgba(255,215,0,.5)}
        .badge-name{margin-top:8px;font-weight:600;color:#ffd700;font-size:11px}
        .badge-week{font-size:9px;color:#7b2cbf;margin-top:2px}
        .playlist-card,.gc-card,.role-card{background:linear-gradient(145deg,#1a1a2e,#12121a);border-radius:12px;padding:15px;margin-bottom:10px;border:1px solid rgba(123,44,191,.3);transition:all .3s}
        .playlist-card:hover,.role-card:hover{transform:translateX(5px)}
        .gc-link-btn{display:inline-block;padding:10px 20px;background:linear-gradient(135deg,#7b2cbf,#5a1f99);color:#fff;border-radius:8px;text-decoration:none;font-size:14px;transition:all .3s}
        .gc-link-btn:hover{transform:scale(1.05);box-shadow:0 5px 20px rgba(123,44,191,.4)}
        .toast{position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-100px);padding:8px 16px;border-radius:20px;background:#1a1a2e;color:#fff;display:inline-flex;align-items:center;gap:8px;max-width:fit-content;z-index:9999999;opacity:0;transition:all .3s;font-size:12px;box-shadow:0 4px 15px rgba(0,0,0,0.3)}
        .toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
        .toast-icon{font-size:14px}
        .toast-msg{font-size:12px;white-space:nowrap}
        .toast-success{border:1px solid #00ff88;background:rgba(0,40,20,0.95)}
        .toast-error{border:1px solid #ff4444;background:rgba(40,20,20,0.95)}
        .toast-info{border:1px solid #7b2cbf;background:rgba(30,20,40,0.95)}
    `;
    document.head.appendChild(style);
}
function ensureStreakCSS() {
    if (document.getElementById('streak-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'streak-styles';
    style.textContent = `
        /* ==================== STREAK ANIMATIONS ==================== */
        
        @keyframes fireFlicker {
            0%, 100% { 
                transform: scale(1) rotate(-3deg); 
                filter: brightness(1);
            }
            50% { 
                transform: scale(1.1) rotate(3deg); 
                filter: brightness(1.2);
            }
        }
        
        @keyframes riskPulse {
            0%, 100% { 
                box-shadow: 0 0 0 0 rgba(255, 68, 68, 0);
                border-color: rgba(255, 68, 68, 0.3);
            }
            50% { 
                box-shadow: 0 0 25px 5px rgba(255, 68, 68, 0.3);
                border-color: rgba(255, 68, 68, 0.8);
            }
        }
        
        @keyframes completedGlow {
            0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 136, 0.2); }
            50% { box-shadow: 0 0 20px rgba(0, 255, 136, 0.4); }
        }
        
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounceIn {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        
        @keyframes progressFill {
            from { width: 0%; }
        }
        
        /* ==================== MAIN STREAK WIDGET ==================== */
        
        .streak-widget {
            background: linear-gradient(145deg, #1a1a2e, #0f0f1f);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 24px;
            margin-bottom: 20px;
            position: relative;
            overflow: hidden;
            animation: slideUp 0.4s ease-out;
            transition: all 0.3s ease;
        }
        
        .streak-widget::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #ff6b35, #ffd700, #ff6b35);
            background-size: 200% 100%;
            animation: shimmer 3s linear infinite;
        }
        
        .streak-widget.at-risk {
            border-color: #ff4444;
            animation: slideUp 0.4s ease-out, riskPulse 2s ease-in-out infinite;
        }
        
        .streak-widget.at-risk::before {
            background: linear-gradient(90deg, #ff4444, #ffa500, #ff4444);
            background-size: 200% 100%;
        }
        
        .streak-widget.completed {
            border-color: #00ff88;
            animation: slideUp 0.4s ease-out, completedGlow 3s ease-in-out infinite;
        }
        
        .streak-widget.completed::before {
            background: linear-gradient(90deg, #00ff88, #00ffcc, #00ff88);
            background-size: 200% 100%;
        }
        
        /* ==================== HEADER ==================== */
        
        .streak-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 20px;
        }
        
        .streak-fire-icon {
            font-size: 50px;
            animation: fireFlicker 1.5s ease-in-out infinite;
            filter: drop-shadow(0 0 10px rgba(255, 107, 53, 0.5));
        }
        
        .streak-fire-icon.inactive {
            animation: none;
            filter: grayscale(0.5);
            opacity: 0.6;
        }
        
        .streak-count {
            flex: 1;
        }
        
        .streak-number {
            font-size: 42px;
            font-weight: 800;
            color: #ff6b35;
            line-height: 1;
            text-shadow: 0 0 20px rgba(255, 107, 53, 0.4);
        }
        
        .streak-number.zero {
            color: #888;
            text-shadow: none;
        }
        
        .streak-label {
            color: #888;
            font-size: 13px;
            margin-top: 6px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        /* ==================== STATUS BADGE ==================== */
        
        .streak-status {
            padding: 8px 16px;
            border-radius: 25px;
            font-size: 12px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 6px;
            white-space: nowrap;
        }
        
        .streak-status.done {
            background: rgba(0, 255, 136, 0.15);
            color: #00ff88;
            border: 1px solid rgba(0, 255, 136, 0.3);
        }
        
        .streak-status.risk {
            background: rgba(255, 68, 68, 0.15);
            color: #ff6b6b;
            border: 1px solid rgba(255, 68, 68, 0.3);
            animation: riskPulse 1.5s ease-in-out infinite;
        }
        
        .streak-status.pending {
            background: rgba(255, 165, 0, 0.15);
            color: #ffa500;
            border: 1px solid rgba(255, 165, 0, 0.3);
        }
        
        /* ==================== FREEZE BUTTON ==================== */
        
        .streak-freeze-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            padding: 6px 12px;
            background: rgba(0, 191, 255, 0.1);
            border: 1px solid rgba(0, 191, 255, 0.3);
            border-radius: 20px;
            font-size: 12px;
            color: #00bfff;
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .streak-freeze-btn:hover {
            background: rgba(0, 191, 255, 0.2);
            transform: scale(1.05);
        }
        
        /* ==================== TODAY'S PROGRESS ==================== */
        
        .streak-today-progress {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 14px;
            padding: 16px;
            margin-top: 16px;
        }
        
        .streak-today-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .streak-today-title {
            color: #888;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .streak-today-count {
            display: flex;
            align-items: baseline;
            gap: 4px;
        }
        
        .streak-today-current {
            font-size: 20px;
            font-weight: 800;
            color: #ff6b35;
        }
        
        .streak-today-divider,
        .streak-today-required {
            color: #888;
            font-size: 14px;
        }
        
        .streak-today-bar {
            height: 8px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .streak-today-fill {
            height: 100%;
            background: linear-gradient(90deg, #ffa500, #ff6b35);
            border-radius: 8px;
            transition: width 0.4s ease;
        }
        
        .streak-today-fill.complete {
            background: #00ff88;
        }
        
        /* ==================== MILESTONE PROGRESS ==================== */
        
        .streak-progress {
            margin-top: 20px;
        }
        
        .streak-progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .streak-progress-milestone {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: #aaa;
        }
        
        .streak-progress-milestone .icon {
            font-size: 20px;
        }
        
        .streak-progress-days {
            color: #ffd700;
            font-weight: 700;
            font-size: 13px;
        }
        
        .streak-progress-bar {
            height: 10px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 10px;
            overflow: hidden;
        }
        
        .streak-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #ff6b35, #ffd700);
            border-radius: 10px;
            transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            animation: progressFill 1s ease-out;
        }
        
        /* ==================== STATS ==================== */
        
        .streak-stats {
            display: flex;
            gap: 16px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .streak-stat {
            flex: 1;
            text-align: center;
            padding: 12px 8px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 12px;
            transition: all 0.2s ease;
        }
        
        .streak-stat:hover {
            background: rgba(255, 255, 255, 0.05);
            transform: translateY(-2px);
        }
        
        .streak-stat-value {
            font-size: 22px;
            font-weight: 700;
            color: #fff;
            line-height: 1;
        }
        
        .streak-stat-label {
            font-size: 10px;
            color: #888;
            margin-top: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* ==================== HISTORY DOTS ==================== */
        
        .streak-history {
            display: flex;
            gap: 5px;
            margin-top: 16px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .streak-history-dot {
            width: 14px;
            height: 14px;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.08);
            transition: all 0.2s ease;
            cursor: pointer;
        }
        
        .streak-history-dot:hover {
            transform: scale(1.3);
            z-index: 1;
        }
        
        .streak-history-dot.active {
            background: #ff6b35;
            box-shadow: 0 0 8px rgba(255, 107, 53, 0.5);
        }
        
        .streak-history-dot.today {
            border: 2px solid #ffd700;
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
        }
        
        .streak-history-dot.today.active {
            background: #00ff88;
            border-color: #00ff88;
            box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }
        
        /* ==================== RISK ALERT ==================== */
        
        .streak-risk-alert {
            background: linear-gradient(135deg, rgba(255, 68, 68, 0.15), rgba(255, 68, 68, 0.05));
            border: 1px solid rgba(255, 68, 68, 0.4);
            border-radius: 14px;
            padding: 16px;
            margin-top: 16px;
            display: flex;
            align-items: center;
            gap: 14px;
            animation: riskPulse 2s ease-in-out infinite;
        }
        
        .streak-risk-icon {
            font-size: 28px;
            flex-shrink: 0;
        }
        
        .streak-risk-content {
            flex: 1;
        }
        
        .streak-risk-title {
            color: #ff6b6b;
            font-size: 14px;
            font-weight: 700;
        }
        
        .streak-risk-text {
            color: #888;
            font-size: 12px;
            margin-top: 4px;
        }
        
        .streak-risk-btn {
            background: linear-gradient(135deg, #ff6b6b, #ff4444);
            border: none;
            border-radius: 10px;
            padding: 10px 20px;
            color: white;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
        }
        
        .streak-risk-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 15px rgba(255, 68, 68, 0.4);
        }
        
        /* ==================== INSTRUCTIONS ==================== */
        
        .streak-instructions {
            background: linear-gradient(135deg, rgba(123, 44, 191, 0.15), rgba(123, 44, 191, 0.05));
            border: 1px solid rgba(123, 44, 191, 0.3);
            border-radius: 14px;
            padding: 16px;
            margin-top: 16px;
        }
        
        .streak-instructions-title {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #7b2cbf;
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 12px;
        }
        
        .streak-requirement {
            background: rgba(255, 107, 53, 0.1);
            border: 1px solid rgba(255, 107, 53, 0.3);
            border-radius: 10px;
            padding: 12px 16px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .streak-requirement-number {
            font-size: 24px;
            font-weight: 800;
            color: #ff6b35;
        }
        
        .streak-requirement-text {
            color: #888;
            font-size: 12px;
        }
        
        .streak-instructions-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .streak-instructions-list li {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            color: #aaa;
            font-size: 12px;
            line-height: 1.5;
            margin-bottom: 8px;
        }
        
        .streak-instructions-list li:last-child {
            margin-bottom: 0;
        }
        
        .streak-instructions-list .icon {
            flex-shrink: 0;
            width: 20px;
            text-align: center;
        }
        
        /* ==================== MILESTONE POPUP ==================== */
        
        .streak-milestone-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.92);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
            padding: 20px;
        }
        
        .streak-milestone-card {
            text-align: center;
            padding: 50px 40px;
            max-width: 380px;
            width: 100%;
            animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .streak-milestone-badge-icon {
            font-size: 90px;
            margin-bottom: 20px;
            filter: drop-shadow(0 0 30px currentColor);
        }
        
        .streak-milestone-days {
            font-size: 64px;
            font-weight: 900;
            line-height: 1;
            margin-bottom: 8px;
            text-shadow: 0 0 40px currentColor;
        }
        
        .streak-milestone-subtitle {
            color: #888;
            font-size: 18px;
            text-transform: uppercase;
            letter-spacing: 4px;
            margin-bottom: 30px;
        }
        
        .streak-milestone-badge-box {
            display: inline-block;
            padding: 18px 35px;
            border-radius: 25px;
            margin-bottom: 35px;
        }
        
        .streak-milestone-badge-name {
            font-size: 20px;
            font-weight: 700;
        }
        
        .streak-milestone-close-btn {
            padding: 16px 50px;
            background: linear-gradient(135deg, #7b2cbf, #5a1f99);
            border: none;
            border-radius: 30px;
            color: white;
            font-size: 17px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .streak-milestone-close-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 25px rgba(123, 44, 191, 0.5);
        }
        
        /* ==================== FREEZE POPUP ==================== */
        
        .streak-freeze-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: fadeIn 0.2s ease;
        }
        
        .streak-freeze-card {
            background: linear-gradient(145deg, #1a1a2e, #0f0f1f);
            border: 1px solid rgba(0, 191, 255, 0.3);
            border-radius: 24px;
            padding: 30px;
            max-width: 380px;
            width: 100%;
            animation: slideUp 0.3s ease;
        }
        
        .streak-freeze-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }
        
        .streak-freeze-title {
            color: #00bfff;
            font-size: 20px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .streak-freeze-close {
            background: none;
            border: none;
            color: #888;
            font-size: 28px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            transition: color 0.2s;
        }
        
        .streak-freeze-close:hover {
            color: white;
        }
        
        .streak-freeze-count-box {
            text-align: center;
            padding: 25px;
            background: rgba(0, 191, 255, 0.1);
            border-radius: 18px;
            margin-bottom: 24px;
        }
        
        .streak-freeze-count-number {
            font-size: 56px;
            font-weight: 800;
            color: #00bfff;
            line-height: 1;
            text-shadow: 0 0 30px rgba(0, 191, 255, 0.5);
        }
        
        .streak-freeze-count-label {
            color: #888;
            font-size: 13px;
            margin-top: 8px;
        }
        
        .streak-freeze-info {
            color: #bbb;
            font-size: 14px;
            line-height: 1.7;
            margin-bottom: 24px;
        }
        
        .streak-freeze-info strong {
            color: white;
        }
        
        .streak-freeze-info ul {
            list-style: none;
            padding: 0;
            margin: 15px 0 0 0;
        }
        
        .streak-freeze-info li {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 10px;
            padding-left: 15px;
            position: relative;
        }
        
        .streak-freeze-info li::before {
            content: '•';
            color: #00bfff;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        
        .streak-freeze-buy-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #00bfff, #0088cc);
            border: none;
            border-radius: 14px;
            color: white;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.2s ease;
        }
        
        .streak-freeze-buy-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(0, 191, 255, 0.4);
        }
        
        /* ==================== DEBUG PANEL ==================== */
        
        .streak-debug-panel {
            background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
            border: 2px solid #333;
            border-radius: 16px;
            padding: 20px;
            margin-top: 20px;
            font-family: 'Courier New', monospace;
        }
        
        .streak-debug-title {
            color: #ff6b6b;
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .streak-debug-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .streak-debug-item {
            background: rgba(255, 255, 255, 0.05);
            padding: 10px;
            border-radius: 8px;
        }
        
        .streak-debug-label {
            color: #666;
            font-size: 10px;
            text-transform: uppercase;
        }
        
        .streak-debug-value {
            color: #00ff88;
            font-size: 14px;
            font-weight: 600;
            margin-top: 4px;
        }
        
        .streak-debug-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .streak-debug-btn {
            flex: 1;
            min-width: 100px;
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: white;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .streak-debug-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .streak-debug-btn.danger {
            background: rgba(255, 68, 68, 0.2);
            border-color: rgba(255, 68, 68, 0.4);
            color: #ff6b6b;
        }
        
        .streak-debug-btn.success {
            background: rgba(0, 255, 136, 0.2);
            border-color: rgba(0, 255, 136, 0.4);
            color: #00ff88;
        }
        
        /* ==================== RESPONSIVE ==================== */
        
        @media (max-width: 400px) {
            .streak-widget {
                padding: 18px;
            }
            
            .streak-header {
                gap: 12px;
            }
            
            .streak-fire-icon {
                font-size: 40px;
            }
            
            .streak-number {
                font-size: 36px;
            }
            
            .streak-status {
                padding: 6px 12px;
                font-size: 11px;
            }
            
            .streak-stats {
                gap: 8px;
            }
            
            .streak-stat-value {
                font-size: 18px;
            }
            
            .streak-history-dot {
                width: 12px;
                height: 12px;
            }
            
            .streak-milestone-days {
                font-size: 48px;
            }
            
            .streak-milestone-badge-icon {
                font-size: 70px;
            }
        }
    `;
    
    document.head.appendChild(style);
    console.log('✅ Streak CSS loaded');
}

// ==================== CLIENT-SIDE ROUTING ====================

const ROUTES = {
    '': 'home',
    'home': 'home',
    'profile': 'profile',
    'goals': 'goals',
    'album2x': 'album2x',
    'missions': 'secret-missions',
    'secret-missions': 'secret-missions',
    'team-level': 'team-level',
    'rankings': 'rankings',
    'comparison': 'comparison',
    'playlists': 'playlists',
    'announcements': 'announcements',
    'chat': 'chat',
    'gc-links': 'gc-links',
    'helper-roles': 'helper-roles',
    'drawer': 'drawer',
    'summary': 'summary',
    'sotd': 'sotd',
    'song-of-day': 'sotd',
    'guide': 'guide',
    'namjoon': 'namjoon', 
    'streaming-tips': 'streaming-tips',
    'login': 'login'
};

const PAGE_TO_ROUTE = {
    'home': 'home',
    'profile': 'profile',
    'goals': 'goals',
    'album2x': 'album2x',
    'secret-missions': 'missions',
    'team-level': 'team-level',
    'rankings': 'rankings',
    'comparison': 'comparison',
    'playlists': 'playlists',
    'announcements': 'announcements',
    'chat': 'chat',
    'gc-links': 'gc-links',
    'helper-roles': 'helper-roles',
    'drawer': 'drawer',
    'summary': 'summary',
    'sotd': 'sotd',
    'guide': 'guide',
    'namjoon': 'namjoon',
    'streaming-tips': 'streaming-tips',
    'login': 'login'
};

const ROUTER = {
    isNavigating: false,
    lastRoute: null,
    initialized: false
};

function getCurrentRoute() {
    const hash = window.location.hash.slice(1);
    const path = hash.startsWith('/') ? hash.slice(1) : hash;
    return path.split('?')[0] || 'home';
}

function getPageFromRoute(route) {
    return ROUTES[route] || route || 'home';
}

function getRouteFromPage(pageName) {
    return PAGE_TO_ROUTE[pageName] || pageName || 'home';
}

function buildHashUrl(route) {
    return '#/' + (route || 'home');
}

function navigateTo(route, options = {}) {
    const { replace = false, skipRender = false } = options;
    
    if (ROUTER.isNavigating) return;
    
    const pageName = getPageFromRoute(route);
    const newUrl = buildHashUrl(route);
    
    if (!options.force && ROUTER.lastRoute === route && ROUTER.initialized) {
        return;
    }
    
    ROUTER.isNavigating = true;
    ROUTER.lastRoute = route;
    
    const stateObj = { 
        page: pageName, 
        route: route,
        timestamp: Date.now() 
    };
    
    if (replace) {
        history.replaceState(stateObj, '', newUrl);
    } else {
        history.pushState(stateObj, '', newUrl);
    }
    
    if (!skipRender) {
        renderPageByRoute(pageName);
    }
    
    ROUTER.isNavigating = false;
}

window.addEventListener('popstate', (event) => {
    if (ROUTER.isNavigating) return;
    if (!ROUTER.initialized) return;
    if (!STATE.agentNo) return;
    
    let pageName;
    
    if (event.state && event.state.page) {
        pageName = event.state.page;
        ROUTER.lastRoute = event.state.route;
    } else {
        const route = getCurrentRoute();
        pageName = getPageFromRoute(route);
        ROUTER.lastRoute = route;
    }
    
    showBackIndicator();
    renderPageByRoute(pageName);
});

async function renderPageByRoute(pageName) {
    if (!STATE.agentNo && pageName !== 'login') {
        return;
    }
    
    STATE.page = pageName;
    updateActiveNavLink(pageName);
    closeSidebar();
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    const dynamicPages = ['chat', 'playlists', 'gc-links', 'helper-roles', 'song-of-day', 'sotd'];
    dynamicPages.forEach(pName => {
        if (pageName === pName && !$(`page-${pName}`)) {
            const mainContent = document.querySelector('.pages-wrapper') || document.querySelector('main');
            if (mainContent) {
                const newPage = document.createElement('section');
                newPage.id = `page-${pName}`;
                newPage.className = 'page';
                newPage.innerHTML = `<div id="${pName}-content"></div>`;
                mainContent.appendChild(newPage);
            }
        }
    });

    const el = $('page-' + pageName);
    if (el) el.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    loading(true);
    try {
        switch(pageName) {
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
            case 'playlists': await renderPlaylists(); break;
            case 'gc-links': await renderGCLinks(); break;
            case 'helper-roles': await renderHelperRoles(); break;
            case 'chat': await renderChat(); break;
            case 'sotd': await renderSOTD(); break;
            case 'song-of-day': await renderSOTD(); break; 
            case 'streaming-tips': await renderStreamingTips(); break;
            case 'namjoon': await renderNamjoonBrain(); break;
            case 'guide': await renderGuidePage(); break; 
        }
    } catch (e) {
        console.error('Page render error:', e);
        if (el) el.innerHTML = `<div class="error-page"><h3>Failed to load</h3><p>${sanitize(e.message)}</p><button onclick="loadPage('${pageName}')" class="btn-primary">Retry</button></div>`;
    } finally { 
        loading(false); 
    }
}

function showBackIndicator() {
    let indicator = document.querySelector('.back-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'back-indicator';
        indicator.innerHTML = '◀';
        document.body.appendChild(indicator);
    }
    
    indicator.classList.add('show');
    setTimeout(() => indicator.classList.remove('show'), 300);
}

function updateActiveNavLink(pageName) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });
}

function initRouter() {
    const route = getCurrentRoute();
    const pageName = getPageFromRoute(route);
    
    ROUTER.lastRoute = route;
    ROUTER.initialized = true;
    
    history.replaceState(
        { page: pageName, route: route, timestamp: Date.now() },
        '',
        buildHashUrl(route)
    );
    
    console.log('🧭 Router initialized:', { route, pageName });
    
    return pageName;
}

async function loadPage(page) {
    const route = getRouteFromPage(page);
    
    if (!ROUTER.initialized) {
        STATE.page = page;
        await renderPageByRoute(page);
        return;
    }
    
    navigateTo(route);
}

function goBack() {
    if (window.history.length > 1) {
        history.back();
    } else {
        loadPage('home');
    }
}

function openChat() {
    loadPage('chat');
}

// ==================== INITIALIZATION ====================

function initApp() {
    console.log('🚀 Starting App v5.0 with Routing...');
    ensureAppCSS(); 
    ensureStreakCSS(); 
    ensureNamjoonCSS();
    loading(false);
    setupLoginListeners();
    loadAllAgents();

    const saved = localStorage.getItem('spyAgent');
    if (saved) {
        STATE.agentNo = saved;
        checkAdminStatus();
        loadSeenResults();
        loadDashboard();
        startUnreadCheck();
    } else {
        if (getCurrentRoute() !== 'login' && getCurrentRoute() !== '') {
            history.replaceState({ page: 'login', route: 'login' }, '', '#/login');
        }
    }
}

function loadSeenResults() {
    try {
        const saved = localStorage.getItem('seenResults_' + STATE.agentNo);
        STATE.hasSeenResults = saved ? JSON.parse(saved) : {};
    } catch (e) { STATE.hasSeenResults = {}; }
}

function markResultsSeen(week) {
    STATE.hasSeenResults[week] = true;
    localStorage.setItem('seenResults_' + STATE.agentNo, JSON.stringify(STATE.hasSeenResults));
}

function setupLoginListeners() {
    const loginBtn = $('login-btn');
    const findBtn = $('find-btn');
    const agentInput = $('agent-input');
    const instagramInput = $('instagram-input');
    if (loginBtn) loginBtn.onclick = handleLogin;
    if (findBtn) findBtn.onclick = handleFind;
    if (agentInput) agentInput.onkeypress = e => { if (e.key === 'Enter') handleLogin(); };
    if (instagramInput) instagramInput.onkeypress = e => { if (e.key === 'Enter') handleFind(); };
}

async function loadAllAgents() {
    try { STATE.allAgents = (await api('getAllAgents')).agents || []; } 
    catch (e) { STATE.allAgents = []; }
}

async function handleLogin() {
    if (STATE.isLoading) return;
    const agentInput = $('agent-input');
    const agentNo = agentInput?.value.trim().toUpperCase();
    if (!agentNo) { showResult('Enter Agent Number', true); return; }
    loading(true);
    try {
        if (STATE.allAgents.length === 0) await loadAllAgents();
        const found = STATE.allAgents.find(a => String(a.agentNo).trim().toUpperCase() === agentNo);
        if (!found) throw new Error('Agent not found');
        localStorage.setItem('spyAgent', found.agentNo);
        STATE.agentNo = found.agentNo;
        checkAdminStatus();
        loadSeenResults();
        await loadDashboard();
        startUnreadCheck();
    } catch (e) { showResult(e.message, true); } 
    finally { loading(false); }
}

async function handleFind() {
    if (STATE.isLoading) return;
    const handle = $('instagram-input')?.value.trim().toLowerCase().replace('@', '');
    if (!handle) { showResult('Enter Instagram', true); return; }
    loading(true);
    try {
        if (STATE.allAgents.length === 0) await loadAllAgents();
        const found = STATE.allAgents.find(a => String(a.instagram||a.ig||'').toLowerCase().replace('@','') === handle || String(a.name||'').toLowerCase().includes(handle));
        if (!found) throw new Error('Not found');
        showResult(`Agent ID: <strong>${found.agentNo}</strong>`, false);
        if($('agent-input')) $('agent-input').value = found.agentNo;
    } catch (e) { showResult(e.message, true); } 
    finally { loading(false); }
}

// ==================== LOAD DASHBOARD ====================

let notificationInterval = null;

// ==================== LOAD DASHBOARD ====================
// ==================== LOAD DASHBOARD (LIVE ONLY) ====================
async function loadDashboard() {
    console.log('🏠 Loading dashboard (Live Data)...');
    
    // 1. Always show loading spinner immediately
    loading(true);
    startHeartbeat();
    
    try {
        // 2. Fetch Fresh Data (No Cache Check)
        const dashboardData = await api('getDashboardData', { 
            agentNo: STATE.agentNo, 
            week: ''
        });
        
        console.log("📥 Fresh Data Loaded:", dashboardData.lastUpdated);

        // 3. Update State
        STATE.weeks = dashboardData.availableWeeks || [];
        STATE.week = dashboardData.week || dashboardData.currentWeek || STATE.weeks[0];
        STATE.data = {
            agentNo: dashboardData.agent.agentNo,
            week: dashboardData.week,
            profile: dashboardData.agent.profile,
            stats: dashboardData.agent.stats,
            rank: dashboardData.agent.rank,
            teamRank: dashboardData.agent.teamRank,
            trackContributions: dashboardData.agent.trackContributions,
            albumContributions: dashboardData.agent.albumContributions,
            album2xStatus: dashboardData.agent.album2xStatus,
            teamInfo: {
                level: dashboardData.team.level,
                teamXP: dashboardData.team.teamXP,
                winner: dashboardData.team.isWinner,
                trackGoalPassed: dashboardData.team.missions?.tracksPassed,
                albumGoalPassed: dashboardData.team.missions?.albumsPassed,
                album2xPassed: dashboardData.team.missions?.album2xPassed
            },
            lastUpdated: dashboardData.lastUpdated
        };

        // 4. Switch Screens & Render
        $('login-screen').classList.remove('active');
        $('login-screen').style.display = 'none';
        $('dashboard-screen').classList.add('active');
        $('dashboard-screen').style.display = 'flex';
        
        setupDashboard(); 
        
        // Load initial page
        const currentPage = ROUTER.initialized ? STATE.page : 'home';
        await loadPage(currentPage); 
        
        // 5. Trigger background checks
        setTimeout(() => {
            if (typeof initStreakTracker === 'function') initStreakTracker();
            if (typeof initActivityFeed === 'function') initActivityFeed();
            if (typeof setupNotificationChecks === 'function') setupNotificationChecks();
            
            loadAllWeeksData();
            checkNotifications();

            
            
        }, 1000);
        
    } catch (e) {
        console.error('❌ Dashboard Load Error:', e);
        
        showToast('Connection failed. Please check your internet.', 'error');
        
        // Send back to login if live fetch fails
        $('login-screen').classList.add('active');
        $('login-screen').style.display = 'flex';
        $('dashboard-screen').classList.remove('active');
        
    } finally { 
        loading(false); 
    }
}
// ==================== DATE HELPERS ====================

function getTodayString() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toDateString();
}

function getYesterdayString() {
    const now = new Date();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    return yesterday.toDateString();
}

function calculateDaysMissed(lastActiveDateStr) {
    if (!lastActiveDateStr) return 999;
    
    const lastActive = new Date(lastActiveDateStr);
    const today = new Date();
    
    lastActive.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = today - lastActive;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays - 1);
}

function getHoursUntilMidnight() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    return Math.floor((midnight - now) / (1000 * 60 * 60));
}

// ==================== VALIDATION ====================

function validateStreakStatus() {
    const today = getTodayString();
    const yesterday = getYesterdayString();
    
    if (STREAK_STATE.lastActiveDate === today) {
        STREAK_STATE.todayCompleted = true;
        STREAK_STATE.isAtRisk = false;
        return;
    }
    
    STREAK_STATE.todayCompleted = false;
    
    if (STREAK_STATE.lastActiveDate && 
        STREAK_STATE.lastActiveDate !== today && 
        STREAK_STATE.lastActiveDate !== yesterday) {
        
        const daysMissed = calculateDaysMissed(STREAK_STATE.lastActiveDate);
        console.log(`⚠️ Days missed: ${daysMissed}`);
    }
}

// ==================== HELPER FUNCTIONS ====================

function loadAllWeeksData() {
    api('getAllWeeksStats', { agentNo: STATE.agentNo })
        .then(result => { STATE.allWeeksData = result; })
        .catch(() => { STATE.allWeeksData = null; });
}

function setupDashboard() {
    const p = STATE.data?.profile;
    if (p) {
        const color = teamColor(p.team);
        const pfp = teamPfp(p.team);
        const initial = (p.name || 'A')[0].toUpperCase();
        ['agent', 'profile'].forEach(prefix => {
            const avatar = $(prefix + '-avatar');
            if (avatar) {
                if (pfp) avatar.innerHTML = `<img src="${pfp}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
                else { avatar.textContent = initial; avatar.style.background = color; }
            }
            if ($(prefix + '-name')) $(prefix + '-name').textContent = p.name || 'Agent';
            if ($(prefix + '-team')) { $(prefix + '-team').textContent = p.team || 'Team'; $(prefix + '-team').style.color = color; }
            if ($(prefix + '-id')) $(prefix + '-id').textContent = 'ID: ' + STATE.agentNo;
        });
    }
    
    const select = $('week-select');
    if (select && STATE.weeks.length) {
        select.innerHTML = STATE.weeks.map(w => `<option value="${w}" ${w === STATE.week ? 'selected' : ''}>${w}</option>`).join('');
        select.onchange = async () => {
            loading(true);
            try {
                STATE.data = await api('getAgentData', { agentNo: STATE.agentNo, week: select.value });
                STATE.week = select.value;
                if (STATE.data?.lastUpdated) { STATE.lastUpdated = STATE.data.lastUpdated; updateTime(); }
                await loadPage(STATE.page);
            } catch (e) { showToast('Failed to load week', 'error'); } 
            finally { loading(false); }
        };
    }
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = null;
        link.onclick = e => {
            e.preventDefault(); 
            e.stopPropagation();
            const page = link.dataset.page;
            if (page) {
                loadPage(page);
                closeSidebar();
            }
        };
    });
    
    if (isAdminAgent()) addAdminIndicator();
    
    const menuBtn = $('menu-btn');
    if (menuBtn) { menuBtn.onclick = null; menuBtn.onclick = e => { e.preventDefault(); e.stopPropagation(); $('sidebar')?.classList.add('open'); }; }
    
    const closeSidebarBtn = $('close-sidebar');
    if (closeSidebarBtn) { closeSidebarBtn.onclick = null; closeSidebarBtn.onclick = e => { e.preventDefault(); e.stopPropagation(); closeSidebar(); }; }
    
    const logoutBtn = $('logout-btn');
    if (logoutBtn) { logoutBtn.onclick = null; logoutBtn.onclick = e => { e.preventDefault(); e.stopPropagation(); logout(); }; }
    
    updateTime();
}
async function logout() {
    if (confirm('Logout?')) {
        // Instant offline
        try {
            await api('removeOnlineUser', { agentNo: STATE.agentNo });
        } catch (e) {}
        
        stopHeartbeat();
        stopUnreadCheck();
        
        if (notificationInterval) {
            clearInterval(notificationInterval);
            notificationInterval = null;
        }
        cleanupStreakAndActivity();
        
        STATE.agentNo = null;
        STATE.data = null;
        STATE.isAdmin = false;
        ROUTER.initialized = false;
        ROUTER.lastRoute = null;
        
        localStorage.removeItem('spyAgent');
        localStorage.removeItem('adminSession');
        localStorage.removeItem('adminExpiry');
        
        history.replaceState({ page: 'login', route: 'login' }, '', '#/login');
        
        location.reload();
    }
}
// ==================== START APP ====================
document.addEventListener('DOMContentLoaded', initApp);
// ==================== START APP ====================
document.addEventListener('DOMContentLoaded', initApp);
// ==================== HOME RENDERER ====================
async function renderHome() {
    const selectedWeek = STATE.week;
    const weekEl = $('current-week');
    if (weekEl) weekEl.textContent = `Week: ${selectedWeek}`;

    // Background load all weeks data if missing
    if (!STATE.allWeeksData) {
        api('getAllWeeksStats', { agentNo: STATE.agentNo })
            .then(res => STATE.allWeeksData = res)
            .catch(e => console.log('Could not load all weeks data:', e));
    }

    const btsCountdownHtml = (typeof renderBTSCountdown === 'function') ? renderBTSCountdown() : '';
    
    const refreshNotice = `
        <div style="
            display: flex; align-items: center; gap: 10px; padding: 10px 14px;
            background: rgba(123,44,191,0.08); border: 1px solid rgba(123,44,191,0.15);
            border-radius: 10px; margin-bottom: 16px;
        ">
            <span style="font-size: 14px;">⏰</span>
            <span style="color: #aaa; font-size: 12px;">
                Streams update hourly
                ${STATE.lastUpdated ? ` • Last: ${formatLastUpdated(STATE.lastUpdated)}` : ''}
            </span>
        </div>
    `;

    try {
        // 1. Fetch Data
        const [summary, rankings, goals] = await Promise.all([
            api('getWeeklySummary', { week: selectedWeek }), 
            api('getRankings', { week: selectedWeek, limit: 5 }), 
            api('getGoalsProgress', { week: selectedWeek })
        ]);
        
        if (summary.lastUpdated) { 
            STATE.lastUpdated = summary.lastUpdated; 
            updateTime(); 
        }
        
        const team = STATE.data?.profile?.team;
        const teamData = summary.teams?.[team] || {};
        const myStats = STATE.data?.stats || {};
        const isCompleted = isWeekCompleted(selectedWeek);
        const daysLeft = getDaysRemaining(selectedWeek);
        const agentName = STATE.data?.profile?.name || 'Agent';
        
        // 2. Render Quick Stats Section
        const quickStatsEl = document.querySelector('.quick-stats-section');
        if (quickStatsEl) {
            const streakWidget = (typeof renderStreakWidget === 'function') ? renderStreakWidget() : '';
            const activityWidget = (typeof renderActivityWidget === 'function') ? renderActivityWidget() : '';

            quickStatsEl.innerHTML = `
                ${btsCountdownHtml}
                ${refreshNotice}
                ${streakWidget}
                
                <div class="card quick-stats-card" style="border-color:${teamColor(team)}40;background:linear-gradient(135deg, ${teamColor(team)}11, var(--bg-card));">
                    <div class="card-body">
                        <div class="quick-header">
                            ${teamPfp(team) ? `<img src="${teamPfp(team)}" class="quick-pfp" style="border-color:${teamColor(team)}">` : ''}
                            <div class="quick-info">
                                <div class="quick-name">Welcome, ${sanitize(agentName)}!</div>
                                <div class="quick-team" style="color:${teamColor(team)}">${team} • Rank #${STATE.data?.rank || 'N/A'}</div>
                            </div>
                        </div>
                        <div class="quick-stats-grid">
                            <div class="quick-stat">
                                <div class="quick-stat-value">${fmt(myStats.totalXP)}</div>
                                <div class="quick-stat-label">XP</div>
                            </div>
                            <div class="quick-stat">
                                <div class="quick-stat-value">${fmt(myStats.trackScrobbles || 0)}</div>
                                <div class="quick-stat-label">Tracks</div>
                            </div>
                            <div class="quick-stat">
                                <div class="quick-stat-value">${fmt(myStats.albumScrobbles || 0)}</div>
                                <div class="quick-stat-label">Albums</div>
                            </div>
                        </div>
                        <div class="battle-timer ${isCompleted ? 'ended' : ''}">
                            ${isCompleted ? '🏆 Week Completed' : (daysLeft <= 1 ? '🚀 Final Day!' : `⏰ ${daysLeft} days left`)}
                        </div>
                        ${isCompleted ? `<div class="results-alert" onclick="loadPage('summary')">🏆 View Final Results →</div>` : ''}
                    </div>
                </div>
                ${activityWidget}
            `;
            
            if (typeof startBTSCountdown === 'function') startBTSCountdown();
            if (typeof updateActivityFeedUI === 'function') updateActivityFeedUI();
        }

        // 3. Render Mission Cards
        const trackGoals = goals.trackGoals || {};
        const albumGoals = goals.albumGoals || {};
        const album2xStatus = STATE.data?.album2xStatus || {};
        const allTeamTracks = (CONFIG.getTeamAlbumTracksForWeek) ? CONFIG.getTeamAlbumTracksForWeek(selectedWeek) : {};
        const teamTracks = allTeamTracks[team] || [];
        const tracksCompleted2x = teamTracks.filter(t => (album2xStatus.tracks?.[t] || 0) >= (CONFIG.ALBUM_CHALLENGE?.REQUIRED_STREAMS || 2)).length;

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
                    <div class="mission-status ${teamData.trackGoalPassed ? 'complete' : ''}">
                        ${teamData.trackGoalPassed ? '✅ Complete' : '⏳ In Progress'}
                    </div>
                    <div class="goals-list">
                        ${trackGoalsList.length ? trackGoalsList.map(g => `
                            <div class="goal-mini ${g.done ? 'done' : ''}">
                                <span class="goal-name">${sanitize(g.name)}</span>
                                <span class="goal-progress">${fmt(g.current)}/${fmt(g.goal)} ${g.done ? '✅' : ''}</span>
                            </div>
                        `).join('') : '<p class="no-goals">No track goals</p>'}
                    </div>
                </div>
                
                <div class="mission-card expanded" onclick="loadPage('goals')">
                    <div class="mission-icon">💿</div>
                    <h3>Album Goals</h3>
                    <div class="mission-status ${teamData.albumGoalPassed ? 'complete' : ''}">
                        ${teamData.albumGoalPassed ? '✅ Complete' : '⏳ In Progress'}
                    </div>
                    <div class="goals-list">
                        ${albumGoalsList.length ? albumGoalsList.map(g => `
                            <div class="goal-mini ${g.done ? 'done' : ''}">
                                <span class="goal-name">${sanitize(g.name)}</span>
                                <span class="goal-progress">${fmt(g.current)}/${fmt(g.goal)} ${g.done ? '✅' : ''}</span>
                            </div>
                        `).join('') : '<p class="no-goals">No album goals</p>'}
                    </div>
                </div>
                
                <div class="mission-card" onclick="loadPage('album2x')">
                    <div class="mission-icon">✨</div>
                    <h3>Album 2X</h3>
                    <div class="mission-subtitle">${sanitize(CONFIG.TEAMS[team]?.album || team)}</div>
                    <div class="mission-status ${album2xStatus.passed ? 'complete' : ''}">
                        ${album2xStatus.passed ? '✅ Complete' : '⏳ In Progress'}
                    </div>
                    <div class="mission-progress">
                        <div class="progress-bar">
                            <div class="progress-fill ${album2xStatus.passed ? 'complete' : ''}" 
                                 style="width:${teamTracks.length ? (tracksCompleted2x/teamTracks.length*100) : 0}%"></div>
                        </div>
                        <span>${tracksCompleted2x}/${teamTracks.length} tracks</span>
                    </div>
                </div>
            `;
        }
        
        // 4. Render Top Agents (MEDAL STYLE)
        const rankList = rankings.rankings || [];
        const topAgentsEl = document.getElementById('home-top-agents');
        if (topAgentsEl) {
            topAgentsEl.innerHTML = rankList.length ? rankList.slice(0, 5).map((r, i) => {
                let rankClass = '';
                let rankContent = i + 1;
                if (i === 0) { rankClass = 'rank-1'; rankContent = '🥇'; }
                else if (i === 1) { rankClass = 'rank-2'; rankContent = '🥈'; }
                else if (i === 2) { rankClass = 'rank-3'; rankContent = '🥉'; }
                
                const isMe = String(r.agentNo) === String(STATE.agentNo);

                return `
                <div class="rank-item ${isMe ? 'highlight' : ''}" 
                     style="border-left: 3px solid ${teamColor(r.team)}; cursor:pointer;"
                     onclick="loadPage('rankings')">
                    <div class="rank-num ${rankClass}">${rankContent}</div>
                    <div class="rank-info">
                        <div class="rank-name">
                            ${sanitize(r.name)}
                            ${isMe ? '<span class="you-badge">YOU</span>' : ''}
                        </div>
                        <div class="rank-team" style="color:${teamColor(r.team)}">
                            ${r.team ? r.team.replace('Team ', '') : 'Agent'}
                        </div>
                    </div>
                    <div class="rank-xp">${fmt(r.totalXP)} XP</div>
                </div>
                `;
            }).join('') : '<p class="empty-text">No data yet</p>';
        }
        
        // 5. Render Battle Standings (YOUR PREFERRED STYLE)
        const sortedTeams = Object.keys(summary.teams || {}).sort((a, b) => 
            (summary.teams[b].teamXP || 0) - (summary.teams[a].teamXP || 0)
        );
        
        const standingsEl = document.getElementById('home-standings');
        if (standingsEl) {
            standingsEl.innerHTML = sortedTeams.length ? `
                <div class="standings-header">
                    <span class="standings-badge ${isCompleted ? 'final' : ''}">
                        ${isCompleted ? '🏆 Final Standings' : '⏳ Live Battle'}
                    </span>
                </div>
                ${sortedTeams.map((t, i) => {
                    const td = summary.teams[t];
                    return `
                        <div class="standing-item ${t === team ? 'my-team' : ''}" 
                             onclick="loadPage('team-level')" 
                             style="--team-color:${teamColor(t)}">
                            <div class="standing-rank">${i+1}</div>
                            ${teamPfp(t) ? `<img src="${teamPfp(t)}" class="standing-pfp">` : ''}
                            <div class="standing-info">
                                <div class="standing-name" style="color:${teamColor(t)}">${t}</div>
                                <div class="standing-xp">${fmt(td.teamXP)} XP</div>
                                <div class="standing-members">👥 ${getTeamMemberCount(t)} agents</div>
                            </div>
                            <div class="standing-missions">
                                ${td.trackGoalPassed ? '🎵✅' : '🎵❌'} 
                                ${td.albumGoalPassed ? '💿✅' : '💿❌'} 
                                ${td.album2xPassed ? '✨✅' : '✨❌'}
                            </div>
                        </div>
                    `;
                }).join('')}
                <div class="standings-footer">
                    <button class="btn-secondary" onclick="loadPage('comparison')">View Battle Details →</button>
                </div>
            ` : '<p class="empty-text">No data yet</p>';
        }
        
    } catch (e) { 
        console.error('Error rendering home:', e); 
        // Handle error states
        const topAgentsEl = document.getElementById('home-top-agents');
        if (topAgentsEl) topAgentsEl.innerHTML = '<p class="error-text" style="text-align:center;">Failed to load data. Tap to retry.</p><div style="text-align:center;"><button class="btn-sm btn-secondary" onclick="renderHome()">Retry</button></div>';
        
        const standingsEl = document.getElementById('home-standings');
        if (standingsEl) standingsEl.innerHTML = '<p class="error-text" style="text-align:center;">Failed to load standings.</p>';
        
        showToast('Failed to load home data', 'error'); 
    }
}
// ==================== ONLINE TRACKING ====================

let heartbeatInterval = null;
let onlineCount = 0;

function startHeartbeat() {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    sendHeartbeat();
    heartbeatInterval = setInterval(sendHeartbeat, 30000);
}

async function sendHeartbeat() {
    try {
        await api('heartbeat', { agentNo: STATE.agentNo });
    } catch (e) {
        console.log('Heartbeat failed');
    }
}

async function updateOnlineCount() {
    try {
        const data = await api('getOnlineCount');
        onlineCount = data.online || 0;
        const el = $('online-count');
        if (el) el.textContent = onlineCount;
        return data;
    } catch (e) {
        return { online: 0, users: [] };
    }
}

function stopHeartbeat() {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
}

async function showOnlineUsers() {
    const data = await api('getOnlineCount');
    const users = data.users || [];
    
    if (users.length === 0) {
        showToast('No one else online', 'info');
        return;
    }
    
    // Remove existing popup
    document.querySelectorAll('.online-popup, .online-overlay').forEach(el => el.remove());
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'online-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        z-index: 99998;
    `;
    overlay.onclick = () => {
        overlay.remove();
        popup.remove();
    };
    
    // Create popup
    const popup = document.createElement('div');
    popup.className = 'online-popup';
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #1a1a2e;
        border: 1px solid #7b2cbf;
        border-radius: 16px;
        padding: 20px;
        z-index: 99999;
        max-width: 300px;
        width: 90%;
        max-height: 400px;
        overflow-y: auto;
    `;
    
    popup.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
            <h3 style="margin:0;color:#fff;font-size:16px;">🟢 Online Now (${users.length})</h3>
            <button onclick="this.closest('.online-popup').remove();document.querySelector('.online-overlay')?.remove();" style="
                background:none;
                border:none;
                color:#888;
                font-size:24px;
                cursor:pointer;
                padding:0;
                line-height:1;
            ">×</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
            ${users.map(u => `
                <div style="
                    display:flex;
                    align-items:center;
                    gap:10px;
                    padding:10px 12px;
                    background:rgba(255,255,255,0.05);
                    border-radius:8px;
                    border-left: 3px solid ${teamColor(u.team)};
                ">
                    <span style="width:8px;height:8px;background:#00ff88;border-radius:50%;flex-shrink:0;"></span>
                    <span style="color:#fff;font-size:13px;flex:1;">@${sanitize(u.username)}</span>
                    <span style="
                        font-size:9px;
                        color:${teamColor(u.team)};
                        background:${teamColor(u.team)}22;
                        padding:3px 8px;
                        border-radius:10px;
                    ">${sanitize(u.team?.replace('Team ', '') || '')}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
}

// ==================== CHAT SYSTEM ====================

let chatRefreshInterval = null;

async function renderChat() {
    let container = $('chat-content');
    if (!container) {
        const page = $('page-chat');
        if (page) {
            page.innerHTML = '<div id="chat-content"></div>';
            container = $('chat-content');
        }
    }
    if (!container) return;
    
    const team = STATE.data?.profile?.team;
    const myUsername = STATE.data?.profile?.name || 'Agent';
    
    container.innerHTML = `
        <!-- Chat Rules -->
        <div style="
            background: rgba(255,255,255,0.03);
            border-left: 3px solid #7b2cbf;
            border-radius: 8px;
            padding: 10px 12px;
            margin-bottom: 12px;
        ">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                <span style="font-size:16px;">📋</span>
                <span style="color:#fff;font-size:13px;font-weight:600;">Chat Rules</span>
            </div>
            <div style="color:#888;font-size:11px;line-height:1.6;">
                • Be kind & respectful to all agents 💜<br>
                • Messages auto-delete after 24 hours 🕐<br>
                • Battle related conversations only ⚔️<br>
                • No spam, links, or inappropriate content 🚫
            </div>
        </div>
        
        <!-- Chat Box -->
        <div class="chat-box" style="
            background: #12121a;
            border-radius: 16px;
            border: 1px solid #7b2cbf44;
            overflow: hidden;
            height: calc(100vh - 320px);
            min-height: 350px;
            display: flex;
            flex-direction: column;
        ">
            <!-- Header -->
            <div style="
                background: #7b2cbf22;
                padding: 12px 15px;
                border-bottom: 1px solid #7b2cbf33;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:20px;">🔐</span>
                    <div>
                        <div style="color:#fff;font-weight:600;font-size:14px;">Secret Comms</div>
                        <div style="color:#888;font-size:10px;">All Teams • Encrypted</div>
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:8px;padding:6px 12px;background:rgba(0,255,136,0.1);border-radius:20px;">
                    <span style="width:8px;height:8px;background:#00ff88;border-radius:50%;animation:pulse 2s infinite;"></span>
                    <span style="color:#00ff88;font-size:12px;font-weight:600;">
                        <span id="online-count">0</span> online
                    </span>
                </div>
            </div>
            
            <!-- Messages -->
            <div id="chat-messages" style="
                flex: 1;
                overflow-y: auto;
                padding: 15px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            ">
                <div style="text-align:center;color:#888;">Loading messages...</div>
            </div>
            
            <!-- Input -->
            <div style="
                padding: 12px;
                border-top: 1px solid #7b2cbf33;
                background: #0a0a0f;
            ">
                <div style="display:flex;gap:10px;align-items:center;">
                    <span style="
                        padding: 6px 10px;
                        background: ${teamColor(team)}22;
                        border: 1px solid ${teamColor(team)}44;
                        border-radius: 6px;
                        color: ${teamColor(team)};
                        font-size: 11px;
                        white-space: nowrap;
                    ">@${sanitize(myUsername)}</span>
                    <input 
                        type="text" 
                        id="chat-input" 
                        placeholder="Type message..." 
                        maxlength="500"
                        style="
                            flex: 1;
                            background: #1a1a2e;
                            border: 1px solid #333;
                            border-radius: 8px;
                            padding: 10px 12px;
                            color: #fff;
                            font-size: 14px;
                            outline: none;
                        "
                    >
                    <button id="send-btn" onclick="sendMessage()" style="
                        background: linear-gradient(135deg, #7b2cbf, #5a1f99);
                        border: none;
                        border-radius: 8px;
                        padding: 10px 16px;
                        color: #fff;
                        cursor: pointer;
                        font-size: 13px;
                        display: flex;
                        align-items: center;
                        gap: 5px;
                    ">Send ➤</button>
                </div>
                <div style="margin-top:6px;display:flex;justify-content:space-between;">
                    <span style="color:#555;font-size:10px;">Press Enter to send</span>
                    <span id="char-count" style="color:#555;font-size:10px;">0/500</span>
                </div>
            </div>
        </div>
    `;
    
    // Setup input
    const input = $('chat-input');
    const charCount = $('char-count');
    
    if (input) {
        input.addEventListener('keypress', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        input.addEventListener('input', () => {
            if (charCount) {
                charCount.textContent = `${input.value.length}/500`;
                charCount.style.color = input.value.length > 450 ? '#ff6b6b' : '#555';
            }
        });
        
        input.focus();
    }
    
    // Mark as read
    markChatRead();
    
    // Load messages
    await loadMessages();
    
    // Update online count
    await updateOnlineCount();
    
    // Auto refresh
    if (chatRefreshInterval) clearInterval(chatRefreshInterval);
    chatRefreshInterval = setInterval(() => {
        loadMessages();
        updateOnlineCount();
    }, 5000);
}

// 👇 THIS WAS MISSING!
async function loadMessages() {
    const container = $('chat-messages');
    if (!container) return;
    
    try {
        const data = await api('getChatMessages', { limit: 50 });
        const messages = data.messages || [];
        
        if (messages.length === 0) {
            container.innerHTML = `
                <div style="
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #888;
                    text-align: center;
                    padding: 40px;
                ">
                    <div style="font-size:48px;margin-bottom:15px;">💬</div>
                    <p style="margin:0 0 5px 0;">No messages yet</p>
                    <p style="font-size:12px;color:#666;">Be the first to say hello!</p>
                </div>
            `;
            return;
        }
        
        const myName = (STATE.data?.profile?.name || '').toLowerCase();
        
        container.innerHTML = messages.map(msg => {
            const isMe = msg.username.toLowerCase() === myName;
            return `
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: ${isMe ? 'flex-end' : 'flex-start'};
                    max-width: 85%;
                    ${isMe ? 'margin-left:auto;' : 'margin-right:auto;'}
                ">
                    <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                        <span style="color:${teamColor(msg.team)};font-size:12px;font-weight:600;">
                            @${sanitize(msg.username)}
                        </span>
                        <span style="
                            font-size:9px;
                            color:#888;
                            background:${teamColor(msg.team)}22;
                            padding:2px 6px;
                            border-radius:4px;
                        ">${sanitize(msg.team?.replace('Team ', '') || '')}</span>
                    </div>
                    <div style="
                        background: ${isMe ? 'linear-gradient(135deg, #7b2cbf, #5a1f99)' : 'rgba(255,255,255,0.08)'};
                        padding: 10px 14px;
                        border-radius: ${isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px'};
                        color: #fff;
                        font-size: 14px;
                        line-height: 1.4;
                        word-break: break-word;
                    ">${sanitize(msg.message)}</div>
                    <span style="font-size:9px;color:#555;margin-top:4px;">
                        ${formatTime(msg.timestamp)}
                    </span>
                </div>
            `;
        }).join('');
        
        container.scrollTop = container.scrollHeight;
        
    } catch (e) {
        console.error('Failed to load chat:', e);
        container.innerHTML = `
            <div style="text-align:center;color:#ff6b6b;padding:40px;">
                <p>Failed to load messages</p>
                <button onclick="loadMessages()" class="btn-secondary" style="margin-top:10px;">Retry</button>
            </div>
        `;
    }
}

async function sendMessage() {
    const input = $('chat-input');
    const sendBtn = $('send-btn');
    
    if (!input) return;
    
    const msg = input.value.trim();
    if (!msg) return;
    
    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.style.opacity = '0.6';
        sendBtn.innerHTML = '...';
    }
    input.value = '';
    const charCount = $('char-count');
    if (charCount) charCount.textContent = '0/500';
    
    try {
        const result = await api('sendChatMessage', {
            agentNo: STATE.agentNo,
            message: msg
        });
        
        if (result.success) {
            await loadMessages();
        } else {
            showToast(result.error || 'Failed to send', 'error');
            input.value = msg;
        }
    } catch (e) {
        console.error('Send error:', e);
        showToast('Failed to send', 'error');
        input.value = msg;
    } finally {
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.style.opacity = '1';
            sendBtn.innerHTML = 'Send ➤';
        }
        input.focus();
    }
}

function formatTime(ts) {
    if (!ts) return '';
    try {
        const d = new Date(ts);
        const now = new Date();
        const diff = now - d;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
        if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
        return '';
    }
}

function cleanupChat() {
    if (chatRefreshInterval) {
        clearInterval(chatRefreshInterval);
        chatRefreshInterval = null;
    }
}

function openChat() {
    loadPage('chat');
}

// ==================== CHAT NOTIFICATION SYSTEM ====================

let unreadCheckInterval = null;

async function checkUnreadMessages() {
    if (!STATE.agentNo) return;

    try {
        // Use your existing api() function instead of fetch
        const data = await api('hasUnreadMessages', { agentNo: STATE.agentNo });
        
        const dot = document.getElementById('dot-chat');
        
        if (data.hasUnread) {
            if (dot) dot.classList.add('active');
        } else {
            if (dot) dot.classList.remove('active');
        }
    } catch (e) {
        console.error('Error checking unread:', e);
    }
}

async function markChatRead() {
    if (!STATE.agentNo) return;

    try {
        // Use your existing api() function instead of fetch
        await api('markChatAsRead', { agentNo: STATE.agentNo });
        
        const dot = document.getElementById('dot-chat');
        if (dot) dot.classList.remove('active');
    } catch (e) {
        console.error('Error marking as read:', e);
    }
}

function startUnreadCheck() {
    checkUnreadMessages();
    
    if (unreadCheckInterval) clearInterval(unreadCheckInterval);
    unreadCheckInterval = setInterval(checkUnreadMessages, 30000);
}

function stopUnreadCheck() {
    if (unreadCheckInterval) {
        clearInterval(unreadCheckInterval);
        unreadCheckInterval = null;
    }
}
// ==================== DRAWER (FIXED BADGE SECTION) ====================
async function renderDrawer() {
    const container = $('drawer-content');
    if (!container) return;
    
    const profile = STATE.data?.profile || {};
    const stats = STATE.data?.stats || {};
    const team = profile.team || 'Unknown';
    const isAdmin = isAdminAgent();
    const album2xStatus = STATE.data?.album2xStatus || {};
    
    // ===== ENSURE WE HAVE ALL WEEKS DATA =====
    if (!STATE.allWeeksData) {
        try {
            STATE.allWeeksData = await api('getAllWeeksStats', { agentNo: STATE.agentNo });
        } catch (e) {
            console.log('Could not load all weeks data:', e);
        }
    }
    
    // ===== CALCULATE OVERALL STATS FROM ALL WEEKS =====
    let overallXP = 0;
    let overallTrackStreams = 0;
    let overallAlbumStreams = 0;
    let allXpBadges = [];
    let allSpecialBadges = [];
    let weeksParticipated = 0;
    
    const agentTeam = STATE.allWeeksData?.agentTeam || team;
    
    if (STATE.allWeeksData?.weeks?.length > 0) {
        STATE.allWeeksData.weeks.forEach(weekData => {
            const weekName = weekData.week;
            const weekXP = parseInt(weekData.stats?.totalXP) || 0;
            const weekTracks = parseInt(weekData.stats?.trackScrobbles) || 0;
            const weekAlbums = parseInt(weekData.stats?.albumScrobbles) || 0;
            
            overallXP += weekXP;
            overallTrackStreams += weekTracks;
            overallAlbumStreams += weekAlbums;
            if (weekXP > 0) weeksParticipated++;
            
            allXpBadges = allXpBadges.concat(getLevelBadges(STATE.agentNo, weekXP, weekName));
            
            const album2xBadge = getAlbum2xBadgeForWeek(STATE.agentNo, weekData, weekName);
            if (album2xBadge) allSpecialBadges.push(album2xBadge);
            
            const winnerBadge = getWinnerBadgeForWeek(STATE.agentNo, weekData, agentTeam);
            if (winnerBadge) allSpecialBadges.push(winnerBadge);
        });
    } else {
        overallXP = parseInt(stats.totalXP) || 0;
        overallTrackStreams = parseInt(stats.trackScrobbles) || 0;
        overallAlbumStreams = parseInt(stats.albumScrobbles) || 0;
        weeksParticipated = overallXP > 0 ? 1 : 0;
        allXpBadges = getLevelBadges(STATE.agentNo, overallXP, STATE.week);
        const album2xBadge = getAlbum2xBadgeForWeek(STATE.agentNo, STATE.data, STATE.week);
        if (album2xBadge) allSpecialBadges.push(album2xBadge);
    }
    
    const seenBadges = new Set();
    const uniqueSpecialBadges = allSpecialBadges.filter(b => {
        const key = `${b.name}_${b.week}`;
        if (seenBadges.has(key)) return false;
        seenBadges.add(key);
        return true;
    });
    
    const totalBadgeCount = uniqueSpecialBadges.length + allXpBadges.length;
    const currentWeekXP = parseInt(stats.totalXP) || 0;
    const currentWeekTracks = parseInt(stats.trackScrobbles) || 0;
    const currentWeekAlbums = parseInt(stats.albumScrobbles) || 0;

    // --- LOGIC FOR EXPAND/COLLAPSE ---
    const VISIBLE_LIMIT = 12;
    const visibleXpBadges = allXpBadges.slice(0, VISIBLE_LIMIT);
    const hiddenXpBadges = allXpBadges.slice(VISIBLE_LIMIT);

    container.innerHTML = `
        <!-- Agent Profile Card -->
        <div class="card" style="border-color: ${teamColor(team)}; margin-bottom: 20px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, ${teamColor(team)}33, transparent); padding: 30px; text-align: center;">
                <div style="width: 90px; height: 90px; border-radius: 50%; margin: 0 auto 15px; border: 3px solid ${teamColor(team)}; overflow: hidden; background: ${teamColor(team)}22; display: flex; align-items: center; justify-content: center; font-size: 36px; box-shadow: 0 0 20px ${teamColor(team)}44;">
                    ${teamPfp(team) ? `<img src="${teamPfp(team)}" style="width:100%;height:100%;object-fit:cover;">` : (profile.name || 'A')[0].toUpperCase()}
                </div>
                <h2 style="color: #fff; margin: 0 0 5px 0; font-size: 20px;">${sanitize(profile.name || 'Agent')}</h2>
                <p style="color: ${teamColor(team)}; margin: 0 0 8px 0; font-weight: 600;">Team ${team}</p>
                <p style="color: #666; margin: 0; font-size: 11px;">Agent ID: ${STATE.agentNo}</p>
                ${isAdmin ? `<div style="margin-top: 12px; padding: 6px 14px; background: linear-gradient(135deg, #ffd700, #ff8c00); color: #000; border-radius: 20px; font-size: 11px; font-weight: bold; display: inline-block;">👑 ADMIN</div>` : ''}
            </div>
        </div>
        
        <!-- Overall Stats -->
        <div class="card" style="margin-bottom: 20px; border-color: #ffd700;">
            <div class="card-header" style="background: rgba(255,215,0,0.05);">
                <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">🏆 Overall Stats <span style="font-size: 10px; color: #666;">(All Weeks)</span></h3>
            </div>
            <div class="card-body">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; text-align: center;">
                    <div style="padding: 18px; background: rgba(255,215,0,0.1); border-radius: 12px; border: 1px solid rgba(255,215,0,0.2);">
                        <div style="font-size: 28px; font-weight: bold; color: #ffd700;">${fmt(overallXP)}</div>
                        <div style="font-size: 10px; color: #888; margin-top: 4px;">Total XP</div>
                    </div>
                    <div style="padding: 18px; background: rgba(0,255,136,0.1); border-radius: 12px; border: 1px solid rgba(0,255,136,0.2);">
                        <div style="font-size: 28px; font-weight: bold; color: #00ff88;">${totalBadgeCount}</div>
                        <div style="font-size: 10px; color: #888; margin-top: 4px;">Total Badges</div>
                    </div>
                </div>
                <div style="margin-top: 12px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; text-align: center;">
                    <div style="padding: 12px 8px; background: rgba(255,255,255,0.03); border-radius: 8px;">
                        <div style="font-size: 18px; font-weight: bold; color: #fff;">${fmt(overallTrackStreams)}</div>
                        <div style="font-size: 9px; color: #666; margin-top: 3px;">🎵 Tracks</div>
                    </div>
                    <div style="padding: 12px 8px; background: rgba(255,255,255,0.03); border-radius: 8px;">
                        <div style="font-size: 18px; font-weight: bold; color: #fff;">${fmt(overallAlbumStreams)}</div>
                        <div style="font-size: 9px; color: #666; margin-top: 3px;">💿 Albums</div>
                    </div>
                    <div style="padding: 12px 8px; background: rgba(255,255,255,0.03); border-radius: 8px;">
                        <div style="font-size: 18px; font-weight: bold; color: #fff;">${weeksParticipated}</div>
                        <div style="font-size: 9px; color: #666; margin-top: 3px;">📅 Weeks</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Current Week Stats -->
        <div class="card" style="margin-bottom: 20px; border-color: #7b2cbf;">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0;">📊 This Week</h3>
                <span style="padding: 4px 10px; background: rgba(123,44,191,0.2); border-radius: 12px; font-size: 10px; color: #7b2cbf; font-weight: 600;">${STATE.week}</span>
            </div>
            <div class="card-body">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center;">
                    <div style="padding: 14px 8px; background: rgba(123,44,191,0.1); border-radius: 10px;">
                        <div style="font-size: 20px; font-weight: bold; color: #7b2cbf;">${fmt(currentWeekXP)}</div>
                        <div style="font-size: 9px; color: #888; margin-top: 3px;">XP</div>
                    </div>
                    <div style="padding: 14px 8px; background: rgba(123,44,191,0.1); border-radius: 10px;">
                        <div style="font-size: 20px; font-weight: bold; color: #7b2cbf;">#${STATE.data?.rank || 'N/A'}</div>
                        <div style="font-size: 9px; color: #888; margin-top: 3px;">Overall Rank</div>
                    </div>
                    <div style="padding: 14px 8px; background: rgba(123,44,191,0.1); border-radius: 10px;">
                        <div style="font-size: 20px; font-weight: bold; color: #7b2cbf;">#${STATE.data?.teamRank || 'N/A'}</div>
                        <div style="font-size: 9px; color: #888; margin-top: 3px;">Team Rank</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- ===== BADGE COLLECTION ===== -->
        <div class="card" style="margin-bottom: 20px;">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0;">🎖️ Badge Collection</h3>
                <span style="color: #ffd700; font-size: 11px; font-weight: 600;">${totalBadgeCount} earned</span>
            </div>
            <div class="card-body">
                ${totalBadgeCount > 0 ? `
                    <!-- Special Badges -->
                    ${uniqueSpecialBadges.length > 0 ? `
                        <div style="margin-bottom: 20px;">
                            <div style="color: #888; font-size: 10px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">✨ Special Badges</div>
                            <div class="badge-grid">
                                ${uniqueSpecialBadges.map(b => renderBadgeHTML(b)).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- XP Badges -->
                    ${allXpBadges.length > 0 ? `
                        <div>
                            <div style="color: #888; font-size: 10px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">⭐ XP Badges</div>
                            
                            <!-- Visible Badges -->
                            <div class="badge-grid">
                                ${visibleXpBadges.map(b => renderBadgeHTML(b)).join('')}
                            </div>

                            <!-- Hidden Badges Container -->
                            ${hiddenXpBadges.length > 0 ? `
                                <div id="hidden-xp-badges" class="hidden-badges-container">
                                    <div class="badge-grid" style="margin-top: 10px;">
                                        ${hiddenXpBadges.map(b => renderBadgeHTML(b)).join('')}
                                    </div>
                                </div>
                                
                                <button onclick="toggleHiddenBadges(this)" class="btn-secondary" style="width: 100%; margin-top: 12px; padding: 10px; font-size: 12px; background:rgba(255,255,255,0.05);">
                                    View All Badges →
                                </button>
                            ` : ''}
                        </div>
                    ` : ''}
                ` : `
                    <div style="text-align: center; padding: 25px 15px;">
                        <div style="font-size: 36px; margin-bottom: 10px;">🔒</div>
                        <p style="color: #888; margin: 0; font-size: 12px;">Earn <strong style="color: #ffd700;">50 XP</strong> to unlock your first badge!</p>
                    </div>
                `}
            </div>
        </div>
        
        <!-- Album Challenge Status -->
        <div class="card" style="border-color: ${album2xStatus.passed ? '#00ff88' : '#7b2cbf'}; margin-bottom: 20px;">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0;">✨ ${CONFIG.ALBUM_CHALLENGE.CHALLENGE_NAME} Challenge</h3>
                <span style="padding: 4px 10px; border-radius: 12px; font-size: 10px; font-weight: 600; background: ${album2xStatus.passed ? 'rgba(0,255,136,0.1)' : 'rgba(123,44,191,0.1)'}; color: ${album2xStatus.passed ? '#00ff88' : '#7b2cbf'};">${album2xStatus.passed ? '✅ Complete' : '⏳ In Progress'}</span>
            </div>
            <div class="card-body" style="text-align: center; padding: 18px;">
                <div style="font-size: 32px; margin-bottom: 8px;">${album2xStatus.passed ? '🎉' : '🎯'}</div>
                <p style="color: #888; margin: 0 0 12px 0; font-size: 12px;">
                    ${album2xStatus.passed ? `You earned the <strong style="color: #7b2cbf;">${CONFIG.ALBUM_CHALLENGE.BADGE_NAME}</strong> badge!` : `Stream each track ${CONFIG.ALBUM_CHALLENGE.REQUIRED_STREAMS}X to earn a badge!`}
                </p>
                <button onclick="loadPage('album2x')" class="btn-secondary" style="padding: 8px 18px; font-size: 11px;">View Progress →</button>
            </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="card" style="margin-bottom: 20px;">
            <div class="card-header"><h3 style="margin: 0;">⚡ Quick Actions</h3></div>
            <div class="card-body" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                <button onclick="loadPage('profile')" class="btn-secondary" style="padding: 12px 8px; font-size: 10px;">👤 Profile</button>
                <button onclick="loadPage('rankings')" class="btn-secondary" style="padding: 12px 8px; font-size: 10px;">🏆 Rankings</button>
                <button onclick="loadPage('goals')" class="btn-secondary" style="padding: 12px 8px; font-size: 10px;">🎯 Goals</button>
                <button onclick="loadPage('secret-missions')" class="btn-secondary" style="padding: 12px 8px; font-size: 10px;">🕵️ Missions</button>
                <button onclick="loadPage('playlists')" class="btn-secondary" style="padding: 12px 8px; font-size: 10px;">🎵 Playlists</button>
                <button onclick="loadPage('team-level')" class="btn-secondary" style="padding: 12px 8px; font-size: 10px;">📊 Teams</button>
            </div>
        </div>
        
        ${isAdmin ? `<div class="card" style="border-color: #ffd700; margin-bottom: 20px;"><div class="card-header" style="background: rgba(255,215,0,0.05);"><h3 style="margin: 0; color: #ffd700;">👑 Admin Controls</h3></div><div class="card-body"><button onclick="showAdminPanel()" class="btn-primary" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #ffd700, #ff8c00); color: #000; font-weight: bold; font-size: 13px;">🎛️ Open Mission Control</button></div></div>` : ''}
        
        <div style="text-align: center; padding: 15px; color: #888; font-size: 10px;">
            <p style="margin: 0;">BTS Spy Battle v5.0</p>
            <p style="margin: 4px 0 0 0;">💜 Fighting! 💜</p>
        </div>
    `;
    
    const currentXPStats = parseInt(stats.totalXP) || 0;
    STATE.lastChecked.badges = Math.floor(currentXPStats / 50);
    STATE.lastChecked.album2xBadge = album2xStatus.passed || false;
    saveNotificationState();
}
// ==================== PROFILE (MOBILE FIXED) ====================
async function renderProfile() {
    const container = $('profile-stats');
    if (!container) return;
    
    const stats = STATE.data?.stats || {};
    const album2xStatus = STATE.data?.album2xStatus || {};
    const trackContributions = STATE.data?.trackContributions || {};
    const albumContributions = STATE.data?.albumContributions || {};
    const currentWeekXP = parseInt(stats.totalXP) || 0;
    
    // Get badges for CURRENT WEEK only
    const xpBadges = getLevelBadges(STATE.agentNo, currentWeekXP, STATE.week);
    const specialBadges = getSpecialBadges(STATE.agentNo, STATE.week);
    const currentWeekBadges = [...specialBadges, ...xpBadges];
    
    // Stats Grid
    container.innerHTML = `
        <div class="stat-box">
            <span class="stat-value">${fmt(stats.totalXP)}</span>
            <span class="stat-label">XP (${STATE.week})</span>
        </div>
        <div class="stat-box">
            <span class="stat-value">#${STATE.data?.rank || 'N/A'}</span>
            <span class="stat-label">Rank</span>
        </div>
        <div class="stat-box">
            <span class="stat-value">#${STATE.data?.teamRank || 'N/A'}</span>
            <span class="stat-label">Team Rank</span>
        </div>
        <div class="stat-box">
            <span class="stat-value">${fmt(stats.trackScrobbles)}</span>
            <span class="stat-label">Track Streams</span>
        </div>
        <div class="stat-box">
            <span class="stat-value">${fmt(stats.albumScrobbles)}</span>
            <span class="stat-label">Album Streams</span>
        </div>
        <div class="stat-box">
            <span class="stat-value">${album2xStatus.passed ? '✅' : '❌'}</span>
            <span class="stat-label">2X Done</span>
        </div>
    `;
    
    // Track contributions
    const tracksContainer = $('profile-tracks');
    if (tracksContainer) {
        const trackEntries = Object.entries(trackContributions).sort((a, b) => b[1] - a[1]);
        tracksContainer.innerHTML = trackEntries.length > 0 ? trackEntries.map(([track, count]) => `
            <div class="contrib-item">
                <span>${sanitize(track)}</span>
                <span>${fmt(count)} streams</span>
            </div>
        `).join('') : '<p class="empty-text">No track data yet</p>';
    }
    
    // Album contributions
    const albumsContainer = $('profile-albums');
    if (albumsContainer) {
        const albumEntries = Object.entries(albumContributions).sort((a, b) => b[1] - a[1]);
        albumsContainer.innerHTML = albumEntries.length > 0 ? albumEntries.map(([album, count]) => `
            <div class="contrib-item">
                <span>${sanitize(album)}</span>
                <span>${fmt(count)} streams</span>
            </div>
        `).join('') : '<p class="empty-text">No album data yet</p>';
    }
    
    // Badges Section
    const badgesContainer = $('profile-badges');
    if (badgesContainer) {
        let badgesHtml = '';
        
        if (currentWeekBadges.length > 0) {
            badgesHtml = `
                <div style="margin-bottom:12px;">
                    <span style="color:var(--text-dim);font-size:12px;">Badges earned in ${STATE.week}</span>
                </div>
                <div class="badges-grid">
                    ${currentWeekBadges.map(b => `
                        <div class="badge-item">
                            <div class="badge-icon${b.type === 'achievement' || b.type === 'winner' ? '-lg' : ''}">
                                ${b.imageUrl 
                                    ? `<img src="${b.imageUrl}" onerror="this.parentElement.innerHTML='${b.icon || '🎖️'}';">`
                                    : `<span style="font-size:28px;">${b.icon || '🎖️'}</span>`
                                }
                            </div>
                            <div class="badge-name" style="color:${b.type === 'winner' ? '#ffd700' : b.type === 'achievement' ? 'var(--purple-glow)' : 'var(--text-dim)'};">
                                ${b.type === 'achievement' ? '✨ ' : b.type === 'winner' ? '🏆 ' : ''}${sanitize(b.name)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            badgesHtml = `
                <div style="text-align:center;padding:20px;color:var(--text-dim);">
                    <div style="font-size:30px;margin-bottom:10px;">🔒</div>
                    <p style="margin:0;font-size:12px;">Earn <strong style="color:#ffd700;">50 XP</strong> this week to unlock a badge!</p>
                </div>
            `;
        }

        // ✅ ADDED BUTTON: Link to My Drawer (All-Time)
        badgesHtml += `
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                <button onclick="loadPage('drawer')" class="btn-secondary" style="width:100%; font-size:13px;">
                    🎒 View Full Badge Collection (All Time) →
                </button>
            </div>
        `;

        badgesContainer.innerHTML = badgesHtml;
    }
}
// ==================== GOALS (MOBILE FIXED) ====================
async function renderGoals() {
    const container = $('goals-content');
    const team = STATE.data?.profile?.team;
    
    try {
        const data = await api('getGoalsProgress', { week: STATE.week });
        if (data.lastUpdated) STATE.lastUpdated = data.lastUpdated;
        
        // 1. Declare these variables ONCE here
        const trackGoals = data.trackGoals || {};
        const albumGoals = data.albumGoals || {};
        
        // 3. Add HTML (REMOVED namjoonHTML injection)
        let html = renderGuide('goals') + `
            <div class="goals-header">
                <h2 style="color:#fff;margin:0;">🎯 Team Goal Progress</h2>
                <span class="week-badge">${STATE.week}</span>
            </div>

            <!-- Added a button instead of the full widget to reduce clutter -->
            <div style="margin-bottom: 20px;">
                <button onclick="loadPage('namjoon')" class="btn-secondary" style="width:100%; display:flex; justify-content:center; align-items:center; gap:8px;">
                    <span>🧠</span> Open 148 Protocol Analysis
                </button>
            </div>
            
            <div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated || 'recently')}</div>
        `;
        
        // Track Goals (Removed "const trackGoals =" line to avoid duplicate error)
        if (Object.keys(trackGoals).length) {
            html += `
                <div class="card">
                    <div class="card-header">
                        <h3>🎵 Track Goals</h3>
                        <span class="team-badge" style="background:${teamColor(team)}22;color:${teamColor(team)}">${team}</span>
                    </div>
                    <div class="card-body">
            `;
            
            for (const [track, info] of Object.entries(trackGoals)) {
                const tp = info.teams?.[team] || {};
                const current = tp.current || 0;
                const goal = info.goal || 0;
                const done = tp.status === 'Completed' || current >= goal;
                const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
                
                html += `
                    <div class="goal-item ${done ? 'completed' : ''}">
                        <div class="goal-name">
                            <span class="status-icon">${done ? '✅' : '⏳'}</span>
                            <span>${sanitize(track)}</span>
                        </div>
                        <div class="goal-progress-wrapper">
                            <div class="progress-bar">
                                <div class="progress-fill ${done ? 'complete' : ''}" style="width:${pct}%"></div>
                            </div>
                            <span class="goal-status ${done ? 'complete' : ''}">${fmt(current)}/${fmt(goal)}</span>
                        </div>
                    </div>
                `;
            }
            html += '</div></div>';
        }
        
        // Album Goals (Removed "const albumGoals =" line to avoid duplicate error)
        if (Object.keys(albumGoals).length) {
            html += `
                <div class="card">
                    <div class="card-header">
                        <h3>💿 Album Goals</h3>
                        <span class="team-badge" style="background:${teamColor(team)}22;color:${teamColor(team)}">${team}</span>
                    </div>
                    <div class="card-body">
            `;
            
            for (const [album, info] of Object.entries(albumGoals)) {
                const ap = info.teams?.[team] || {};
                const current = ap.current || 0;
                const goal = info.goal || 0;
                const done = ap.status === 'Completed' || current >= goal;
                const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
                
                html += `
                    <div class="goal-item ${done ? 'completed' : ''}">
                        <div class="goal-name">
                            <span class="status-icon">${done ? '✅' : '⏳'}</span>
                            <span>${sanitize(album)}</span>
                        </div>
                        <div class="goal-progress-wrapper">
                            <div class="progress-bar">
                                <div class="progress-fill ${done ? 'complete' : ''}" style="width:${pct}%"></div>
                            </div>
                            <span class="goal-status ${done ? 'complete' : ''}">${fmt(current)}/${fmt(goal)}</span>
                        </div>
                    </div>
                `;
            }
            html += '</div></div>';
        }
        
        container.innerHTML = html || '<div class="card"><div class="card-body"><p class="empty-text">No goals set for this week</p></div></div>';
        
    } catch (e) { 
        console.error('Goals error:', e);
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load goals</p></div></div>'; 
    }
}
async function renderAlbum2x() {
    const container = $('album2x-content');
    const team = STATE.data?.profile?.team;
    const currentWeek = STATE.week || 'Week 5';
    
    const REQUIRED = CONFIG.ALBUM_CHALLENGE.REQUIRED_STREAMS;
    const CHALLENGE_NAME = CONFIG.ALBUM_CHALLENGE.CHALLENGE_NAME;
    const BADGE_NAME = CONFIG.ALBUM_CHALLENGE.BADGE_NAME;
    
    // Get correct tracks for this week
    const allTeamTracks = CONFIG.getTeamAlbumTracksForWeek(currentWeek);
    const teamTracks = allTeamTracks[team] || [];
    const albumName = CONFIG.TEAMS[team]?.album || team;
    const currentTeamColor = CONFIG.TEAMS[team]?.color || '#7b2cbf';
    
    console.log('=== ALBUM 2X DEBUG ===');
    console.log('Week:', currentWeek, '| Team:', team);
    console.log('Required:', REQUIRED);
    console.log('Team Tracks:', teamTracks);
    
    // Show loading
    container.innerHTML = `
        <div style="text-align:center;padding:40px;">
            <div style="font-size:32px;margin-bottom:10px;">⏳</div>
            <p style="color:#888;">Loading ${CHALLENGE_NAME} Challenge...</p>
        </div>
    `;
    
    let userTracks = {};
    let passedMembers = [];
    let failedMembers = [];
    let totalMembers = 0;
    
    try {
        const album2xData = await api('getAlbum2xStatus', { 
            week: currentWeek, 
            team: team,
            agentNo: STATE.agentNo
        });
        
        console.log('API Response:', album2xData);
        
        // Get user's track data
        userTracks = album2xData.userTracks || {};
        
        // Fallback to STATE.data if needed
        if (Object.keys(userTracks).length === 0) {
            userTracks = STATE.data?.album2xStatus?.tracks || {};
        }
        
        // Get team members (backend now calculates passed correctly!)
        const teamData = album2xData.teams?.[team] || {};
        const allMembers = teamData.members || [];
        
        // ✅ Simple filter - backend already calculated correctly
        passedMembers = allMembers.filter(m => m.passed === true);
        failedMembers = allMembers.filter(m => m.passed !== true);
        totalMembers = allMembers.length;
        
        console.log('Passed:', passedMembers.length);
        console.log('Failed:', failedMembers.length);
        console.log('Total:', totalMembers);
        
    } catch (e) {
        console.error('API Error:', e);
        userTracks = STATE.data?.album2xStatus?.tracks || {};
    }
    
    // Smart track matching
    function getTrackCount(trackName) {
        const track = String(trackName).trim();
        
        // Exact match
        if (userTracks[track] !== undefined) return Number(userTracks[track]) || 0;
        
        // Case-insensitive
        const trackLower = track.toLowerCase();
        for (const key in userTracks) {
            if (key.toLowerCase() === trackLower) {
                return Number(userTracks[key]) || 0;
            }
        }
        
        // Partial match
        for (const key in userTracks) {
            if (key.toLowerCase().includes(trackLower) || trackLower.includes(key.toLowerCase())) {
                return Number(userTracks[key]) || 0;
            }
        }
        
        return 0;
    }
    
    // Calculate YOUR progress
    let completedCount = 0;
    const trackResults = teamTracks.map((track, i) => {
        const count = getTrackCount(track);
        const passed = count >= REQUIRED;
        if (passed) completedCount++;
        return { name: track, count, passed };
    });
    
    const myPassed = completedCount === trackResults.length && trackResults.length > 0;
    const pct = trackResults.length ? Math.round((completedCount / trackResults.length) * 100) : 0;
    const teamAllComplete = failedMembers.length === 0 && totalMembers > 0;
    
    // ✅ RENDER
    container.innerHTML = `
        <!-- Header -->
        <div class="card" style="background:rgba(123,44,191,0.1);border-left:3px solid #7b2cbf;margin-bottom:20px;">
            <div class="card-body" style="display:flex;gap:15px;padding:15px;">
                <div style="font-size:24px;">🎵</div>
                <div>
                    <h4 style="margin:0 0 5px;color:#7b2cbf;font-size:14px;">${CHALLENGE_NAME} Challenge - ${sanitize(albumName)}</h4>
                    <p style="margin:0;color:#aaa;font-size:13px;">
                        Stream each track <strong style="color:#ffd700;">${REQUIRED}x</strong> to complete
                        <span style="color:#666;font-size:11px;display:block;margin-top:4px;">📅 ${sanitize(currentWeek)}</span>
                    </p>
                </div>
            </div>
        </div>
        
        <!-- Your Progress -->
        <div class="card" style="border-color:${myPassed ? '#00ff88' : currentTeamColor}">
            <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
                <h3 style="margin:0;">📊 Your Progress</h3>
                <span style="padding:4px 12px;border-radius:12px;font-size:11px;
                    background:${myPassed ? 'rgba(0,255,136,0.1)' : 'rgba(255,165,0,0.1)'};
                    color:${myPassed ? '#00ff88' : '#ffa500'};">
                    ${myPassed ? '✅ Complete' : '⏳ In Progress'}
                </span>
            </div>
            <div class="card-body" style="text-align:center;padding:25px;">
                <div style="font-size:50px;margin-bottom:15px;">${myPassed ? '🎉' : '⏳'}</div>
                <div style="font-size:42px;font-weight:700;color:${myPassed ? '#00ff88' : '#7b2cbf'}">
                    ${completedCount}/${trackResults.length}
                </div>
                <p style="color:#888;margin:5px 0 15px;">tracks completed</p>
                <div style="background:#222;border-radius:10px;height:12px;max-width:280px;margin:0 auto;overflow:hidden;">
                    <div style="height:100%;width:${pct}%;background:${myPassed ? '#00ff88' : currentTeamColor};transition:width 0.3s;"></div>
                </div>
                ${myPassed ? `
                    <div style="margin-top:20px;padding:12px 20px;background:rgba(0,255,136,0.1);border-radius:10px;display:inline-flex;align-items:center;gap:10px;">
                        <span style="font-size:22px;">🎖️</span>
                        <span style="color:#00ff88;font-weight:600;">${BADGE_NAME} Earned!</span>
                    </div>
                ` : ''}
            </div>
        </div>
        
        <!-- Track List -->
        <div class="card">
            <div class="card-header"><h3>📋 Track Checklist</h3></div>
            <div class="card-body" style="padding:10px;">
                ${trackResults.length === 0 ? `
                    <p style="text-align:center;color:#888;padding:20px;">No tracks configured for ${sanitize(team)}</p>
                ` : trackResults.map((t, i) => `
                    <div style="display:flex;align-items:center;padding:10px 12px;margin-bottom:6px;
                        background:${t.passed ? 'rgba(0,255,136,0.05)' : 'rgba(255,255,255,0.02)'};
                        border-left:3px solid ${t.passed ? '#00ff88' : '#ff6b6b'};border-radius:6px;">
                        <span style="width:22px;height:22px;background:${t.passed ? '#00ff88' : '#333'};
                            color:${t.passed ? '#000' : '#666'};border-radius:50%;display:flex;
                            align-items:center;justify-content:center;font-size:10px;font-weight:bold;margin-right:10px;">
                            ${i + 1}
                        </span>
                        <span style="flex:1;color:#fff;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                            ${sanitize(t.name)}
                        </span>
                        <span style="padding:4px 10px;border-radius:10px;font-size:11px;font-weight:600;margin-left:8px;
                            background:${t.passed ? 'rgba(0,255,136,0.15)' : 'rgba(255,68,68,0.15)'};
                            color:${t.passed ? '#00ff88' : '#ff6b6b'};">
                            ${t.count}/${REQUIRED} ${t.passed ? '✓' : ''}
                        </span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Team Status -->
        <div class="card" style="margin-top:15px;border-color:${teamAllComplete ? '#00ff88' : '#ff6b6b'}">
            <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
                <h3 style="margin:0;">👥 ${sanitize(team)}</h3>
                <span style="padding:4px 12px;border-radius:12px;font-size:11px;
                    background:${teamAllComplete ? 'rgba(0,255,136,0.1)' : 'rgba(255,68,68,0.1)'};
                    color:${teamAllComplete ? '#00ff88' : '#ff6b6b'};">
                    ${totalMembers === 0 ? '⏳ Loading' : teamAllComplete ? '✅ All Passed!' : `❌ ${failedMembers.length} pending`}
                </span>
            </div>
            <div class="card-body">
                ${totalMembers === 0 ? `
                    <p style="color:#888;text-align:center;padding:20px;">
                        <span style="font-size:24px;">📊</span><br><br>
                        Loading team data...
                    </p>
                ` : `
                    <!-- Progress Bar -->
                    <div style="margin-bottom:15px;">
                        <div style="display:flex;justify-content:space-between;font-size:12px;color:#888;margin-bottom:6px;">
                            <span>Team Progress</span>
                            <span style="color:#fff;">${passedMembers.length}/${totalMembers} completed</span>
                        </div>
                        <div style="background:#222;border-radius:8px;height:8px;overflow:hidden;">
                            <div style="height:100%;width:${totalMembers ? (passedMembers.length/totalMembers)*100 : 0}%;background:${teamAllComplete ? '#00ff88' : currentTeamColor};transition:width 0.3s;"></div>
                        </div>
                    </div>
                    
                    ${failedMembers.length > 0 ? `
                        <div style="background:rgba(255,68,68,0.08);border-radius:10px;padding:12px;margin-bottom:12px;">
                            <div style="color:#ff6b6b;font-size:12px;font-weight:600;margin-bottom:8px;">
                                🚨 Need to Complete (${failedMembers.length})
                            </div>
                            <div style="display:flex;flex-wrap:wrap;gap:6px;max-height:200px;overflow-y:auto;">
                                ${failedMembers.slice(0, 50).map(m => `
                                    <span style="display:inline-flex;align-items:center;gap:5px;padding:5px 10px;
                                        background:rgba(255,68,68,0.1);border-radius:6px;font-size:11px;color:#fff;">
                                        ❌ ${sanitize(m.name || m.agentNo)}
                                        ${String(m.agentNo) === String(STATE.agentNo) ? 
                                            '<span style="background:#ff6b6b;color:#000;padding:1px 5px;border-radius:3px;font-size:9px;font-weight:bold;">YOU</span>' : ''}
                                    </span>
                                `).join('')}
                                ${failedMembers.length > 50 ? `<span style="color:#888;font-size:11px;padding:5px;">+${failedMembers.length - 50} more</span>` : ''}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${passedMembers.length > 0 ? `
                        <div style="background:rgba(0,255,136,0.05);border-radius:10px;padding:12px;">
                            <div style="color:#00ff88;font-size:12px;font-weight:600;margin-bottom:8px;">
                                🎉 Completed (${passedMembers.length})
                            </div>
                            <div style="display:flex;flex-wrap:wrap;gap:6px;max-height:200px;overflow-y:auto;">
                                ${passedMembers.slice(0, 50).map(m => `
                                    <span style="display:inline-flex;align-items:center;gap:5px;padding:5px 10px;
                                        background:rgba(0,255,136,0.1);border-radius:6px;font-size:11px;color:#ccc;">
                                        ✅ ${sanitize(m.name || m.agentNo)}
                                        ${String(m.agentNo) === String(STATE.agentNo) ? 
                                            '<span style="background:#00ff88;color:#000;padding:1px 5px;border-radius:3px;font-size:9px;font-weight:bold;">YOU</span>' : ''}
                                    </span>
                                `).join('')}
                                ${passedMembers.length > 50 ? `<span style="color:#888;font-size:11px;padding:5px;">+${passedMembers.length - 50} more</span>` : ''}
                            </div>
                        </div>
                    ` : `
                        <div style="text-align:center;padding:20px;color:#888;">
                            <span style="font-size:32px;">🎯</span>
                            <p style="margin:10px 0 0;">No team members have completed yet.</p>
                            <p style="font-size:11px;color:#666;">Be the first!</p>
                        </div>
                    `}
                `}
            </div>
        </div>
    `;
}
// ==================== RANKINGS ====================

async function renderRankings() {
    const container = document.getElementById('rankings-list');
    if (!container) return;
    
    const myTeam = STATE.data?.profile?.team || 'Team';
    const tColor = teamColor(myTeam);
    
    container.innerHTML = `
        ${renderGuide('rankings')}
        <div class="ranking-tabs" style="display:flex;gap:10px;margin-bottom:20px;">
            <button id="rank-tab-overall" class="filter-btn active" style="flex:1;">🏆 Overall</button>
            <button id="rank-tab-team" class="filter-btn" style="flex:1;border-color:${tColor};color:${tColor};">${sanitize(myTeam)}</button>
        </div>
        <div id="rankings-content-container">
            <div class="loading-skeleton"><div class="skeleton-card"></div><div class="skeleton-card"></div></div>
        </div>
    `;
    
    document.getElementById('rank-tab-overall').onclick = () => switchRankingTab('overall');
    document.getElementById('rank-tab-team').onclick = () => switchRankingTab('team');
    
    // Load initial view
    await renderOverallRankings();
}

async function switchRankingTab(tab) {
    const overallTab = document.getElementById('rank-tab-overall');
    const teamTab = document.getElementById('rank-tab-team');
    const contentContainer = document.getElementById('rankings-content-container');
    
    if (!overallTab || !teamTab || !contentContainer) return;
    
    // Update tabs
    if (tab === 'overall') { 
        overallTab.classList.add('active'); 
        overallTab.style.background = '#9d4edd';
        overallTab.style.color = '#fff';
        
        teamTab.classList.remove('active'); 
        teamTab.style.background = 'transparent';
    } else { 
        overallTab.classList.remove('active'); 
        overallTab.style.background = 'transparent';
        
        teamTab.classList.add('active'); 
        const myTeam = STATE.data?.profile?.team;
        const tColor = teamColor(myTeam);
        teamTab.style.background = tColor + '22'; // low opacity background
    }
    
    contentContainer.innerHTML = `<div class="loading-skeleton"><div class="skeleton-card"></div></div>`;
    loading(true);
    
    try {
        if (tab === 'overall') { 
            await renderOverallRankings(); 
        } else { 
            await renderMyTeamRankings(); 
        }
    } catch (e) {
        console.error(e);
        contentContainer.innerHTML = '<p class="error-text">Failed to load rankings</p>';
    } finally {
        loading(false);
    }
}

async function renderOverallRankings() {
    const container = document.getElementById('rankings-content-container');
    if (!container) return;
    
    try {
        const data = await api('getRankings', { week: STATE.week, limit: 100 });
        if (data.lastUpdated) STATE.lastUpdated = data.lastUpdated;
        
        if (!data.rankings || data.rankings.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-icon">📉</div><p>No ranking data available</p></div>';
            return;
        }

        const rankingsHtml = data.rankings.map((r, i) => {
            const isMe = String(r.agentNo) === String(STATE.agentNo);
            const tColor = teamColor(r.team);
            
            // Determine Rank Class and Content
            let rankClass = '';
            let rankContent = i + 1;
            
            if (i === 0) { rankClass = 'rank-1'; rankContent = '🥇'; }
            else if (i === 1) { rankClass = 'rank-2'; rankContent = '🥈'; }
            else if (i === 2) { rankClass = 'rank-3'; rankContent = '🥉'; }

            return `
            <div class="rank-item ${isMe ? 'highlight' : ''}" style="border-left: 3px solid ${tColor};">
                <div class="rank-num ${rankClass}">${rankContent}</div>
                
                <div class="rank-info">
                    <div class="rank-name">
                        ${sanitize(r.name)}
                        ${isMe ? '<span class="you-badge">YOU</span>' : ''}
                    </div>
                    <div class="rank-team" style="color: ${tColor};">
                        ${r.team ? r.team.replace('Team ', '') : 'Agent'}
                    </div>
                </div>
                
                <div class="rank-xp">${fmt(r.totalXP)} XP</div>
            </div>
            `;
        }).join('');
        
        container.innerHTML = `
            <div class="rankings-header" style="display:flex;justify-content:space-between;padding:0 5px;margin-bottom:10px;">
                <span class="week-badge">${STATE.week}</span>
                <span style="font-size:11px;color:#888;">Top 100</span>
            </div>
            ${STATE.lastUpdated ? `<div class="last-updated-banner" style="font-size:10px;text-align:center;color:#666;margin-bottom:15px;">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}
            <div class="rankings-list">
                ${rankingsHtml}
            </div>
        `;
        
    } catch (e) { 
        console.error('Rankings Error:', e);
        container.innerHTML = '<p class="error-text">Failed to load overall rankings</p>'; 
    }
}

async function renderMyTeamRankings() {
    const container = document.getElementById('rankings-content-container');
    if (!container) return;
    
    const myTeam = STATE.data?.profile?.team;
    if (!myTeam) { 
        container.innerHTML = '<div class="card"><div class="card-body error-text">Could not identify your team.</div></div>'; 
        return; 
    }
    
    try {
        // Fetch ALL rankings to ensure accurate positioning relative to global
        const data = await api('getRankings', { week: STATE.week, limit: 1000 });
        if (data.lastUpdated) STATE.lastUpdated = data.lastUpdated;
        
        // Filter for my team
        const teamMembers = (data.rankings || []).filter(r => 
            r.team && r.team.trim() === myTeam.trim()
        );
        
        // Sort by XP
        teamMembers.sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0));
        
        if (teamMembers.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-icon">👥</div><p>No team data available</p></div>';
            return;
        }

        const rankingsHtml = teamMembers.map((r, i) => {
            const isMe = String(r.agentNo) === String(STATE.agentNo);
            const tColor = teamColor(myTeam);
            
            // Determine Rank Class and Content (Internal Team Rank)
            let rankClass = '';
            let rankContent = i + 1;
            
            if (i === 0) { rankClass = 'rank-1'; rankContent = '🥇'; }
            else if (i === 1) { rankClass = 'rank-2'; rankContent = '🥈'; }
            else if (i === 2) { rankClass = 'rank-3'; rankContent = '🥉'; }

            return `
            <div class="rank-item ${isMe ? 'highlight' : ''}" style="border-left: 3px solid ${tColor};">
                <div class="rank-num ${rankClass}">${rankContent}</div>
                
                <div class="rank-info">
                    <div class="rank-name">
                        ${sanitize(r.name)}
                        ${isMe ? '<span class="you-badge">YOU</span>' : ''}
                    </div>
                    <div class="rank-team" style="color: #aaa;">
                        Global Rank: #${r.rank}
                    </div>
                </div>
                
                <div class="rank-xp">${fmt(r.totalXP)} XP</div>
            </div>
            `;
        }).join('');
        
        container.innerHTML = `
            <div class="rankings-header" style="text-align:center;margin-bottom:15px;">
                <span class="week-badge" style="background-color: ${teamColor(myTeam)}22; color: ${teamColor(myTeam)}; border: 1px solid ${teamColor(myTeam)};">
                    ${myTeam} Leaderboard
                </span>
            </div>
            ${STATE.lastUpdated ? `<div class="last-updated-banner" style="font-size:10px;text-align:center;color:#666;margin-bottom:15px;">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}
            <div class="rankings-list">
                ${rankingsHtml}
            </div>
        `;
        
    } catch (e) { 
        console.error('Team Rankings Error:', e);
        container.innerHTML = `<div class="card"><div class="card-body error-text">Failed to load team rankings: ${e.message}</div></div>`; 
    }
}
// ==================== TEAM LEVEL (FIXED - WINNER ONLY AFTER ADMIN APPROVAL) ====================
async function renderTeamLevel() {
    const container = $('team-level-content');
    if (!container) return;
    
    container.innerHTML = '<div class="loading-skeleton"><div class="skeleton-card"></div></div>';
    
    try {
        const summary = await api('getWeeklySummary', { week: STATE.week });
        const teams = summary.teams || {};
        const myTeam = STATE.data?.profile?.team;
        if (summary.lastUpdated) STATE.lastUpdated = summary.lastUpdated;
        
        const sortedTeams = Object.entries(teams).sort((a, b) => (b[1].teamXP || 0) - (a[1].teamXP || 0));
        const isCompleted = isWeekCompleted(STATE.week);
        
        // ✅ FIXED: Only teams with ADMIN CONFIRMATION are eligible
        const eligibleTeams = sortedTeams.filter(([t, info]) => isTeamEligibleForWin(info));
        
        // ✅ FIXED: Winner ONLY if they have admin confirmations
        const winnerTeam = eligibleTeams.length > 0 ? eligibleTeams[0][0] : null;
        
        // Leading team by XP (may not be eligible)
        const leadingTeam = sortedTeams[0]?.[0];
        const leadingTeamInfo = teams[leadingTeam] || {};
        const leadingStatus = getTeamEligibilityStatus(leadingTeamInfo);
        
        // ✅ Check if ANY team has admin confirmations
        const anyTeamConfirmed = sortedTeams.some(([t, info]) => 
            info.attendanceConfirmed && info.policeConfirmed
        );
        
        // ✅ Check how many teams are waiting for confirmation
        const teamsWaitingConfirmation = sortedTeams.filter(([t, info]) => 
            info.trackGoalPassed && info.albumGoalPassed && info.album2xPassed &&
            (!info.attendanceConfirmed || !info.policeConfirmed)
        );
        
        container.innerHTML = `
            ${renderGuide('team-level')}
            
            <!-- Winner Rules Explanation -->
            <div class="card" style="background: linear-gradient(135deg, rgba(255,215,0,0.08), rgba(123,44,191,0.05)); border-color: rgba(255,215,0,0.3); margin-bottom: 20px;">
                <div class="card-body" style="padding: 20px;">
                    <div style="text-align: center; margin-bottom: 15px;">
                        <div style="font-size: 36px; margin-bottom: 8px;">🏆</div>
                        <h4 style="color: #ffd700; margin: 0; font-size: 16px;">How to Win the Week</h4>
                    </div>
                    
                    <div style="
                        background: rgba(0,0,0,0.2);
                        border-radius: 12px;
                        padding: 15px;
                        margin-bottom: 15px;
                    ">
                        <!-- Requirement 1 -->
                        <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <span style="font-size: 20px;">1️⃣</span>
                            <div>
                                <div style="color: #fff; font-size: 13px; font-weight: 600;">Complete ALL 3 Streaming Missions</div>
                                <div style="color: #888; font-size: 11px; margin-top: 3px;">
                                    🎵 Track Goals + 💿 Album Goals + ✨ Album 2X (100% team)
                                </div>
                            </div>
                        </div>
                        
                        <!-- Requirement 2 -->
                        <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <span style="font-size: 20px;">2️⃣</span>
                            <div>
                                <div style="color: #fff; font-size: 13px; font-weight: 600;">Pass Attendance & Police Check</div>
                                <div style="color: #888; font-size: 11px; margin-top: 3px;">
                                    📋 100% Attendance + 👮 No more than 3 violations
                                </div>
                                <div style="
                                    margin-top: 8px;
                                    padding: 6px 10px;
                                    background: rgba(255,165,0,0.15);
                                    border-radius: 6px;
                                    display: inline-block;
                                ">
                                    <span style="color:#ffa500;font-size:10px;">⏰ Confirmed by Admin after deadline</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Requirement 3 -->
                        <div style="display: flex; align-items: flex-start; gap: 12px;">
                            <span style="font-size: 20px;">3️⃣</span>
                            <div>
                                <div style="color: #fff; font-size: 13px; font-weight: 600;">Have the Highest XP</div>
                                <div style="color: #888; font-size: 11px; margin-top: 3px;">
                                    Among teams that completed all above requirements
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Important Warning -->
                    <div style="
                        background: rgba(255,68,68,0.1);
                        border: 1px solid rgba(255,68,68,0.2);
                        border-radius: 8px;
                        padding: 10px 12px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    ">
                        <span style="font-size: 18px;">⚠️</span>
                        <span style="color: #ff6b6b; font-size: 12px;">
                            <strong>Winner is announced ONLY after Admin confirms attendance & police for eligible teams!</strong>
                        </span>
                    </div>
                    
                    <!-- Current Status -->
                    <div style="margin-top: 15px; text-align: center;">
                        ${renderWinnerStatus(winnerTeam, eligibleTeams, teamsWaitingConfirmation, leadingTeam, leadingStatus, isCompleted, anyTeamConfirmed)}
                    </div>
                </div>
            </div>
            
            <!-- Winner Badge Reward -->
            <div class="card" style="background: rgba(123,44,191,0.05); border-color: rgba(123,44,191,0.2); margin-bottom: 20px;">
                <div class="card-body" style="padding: 15px; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
                        <span style="font-size: 28px;">🎖️</span>
                        <div style="text-align: left;">
                            <div style="color: #fff; font-size: 13px; font-weight: 600;">Winner Reward</div>
                            <div style="color: #888; font-size: 11px;">
                                All members of the winning team get a special <span style="color: #ffd700;">Champion Badge</span>!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="team-level-header">
                <h2>Team Standings</h2>
                <span class="week-badge">${STATE.week}</span>
            </div>
            
            ${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}
            
            <div class="team-level-grid">
                ${sortedTeams.map(([t, info], index) => renderTeamCard(t, info, index, myTeam, winnerTeam, isCompleted)).join('')}
            </div>
            
            <!-- Mission Status Legend -->
            ${renderTeamLevelLegend()}
        `;
        
    } catch (e) { 
        console.error('Team level error:', e);
        container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <p class="error-text">Failed to load team levels</p>
                    <button onclick="renderTeamLevel()" class="btn-secondary" style="margin-top:10px;">🔄 Retry</button>
                </div>
            </div>
        `; 
    }
}

// ✅ NEW: Render winner status based on admin confirmation
function renderWinnerStatus(winnerTeam, eligibleTeams, teamsWaitingConfirmation, leadingTeam, leadingStatus, isCompleted, anyTeamConfirmed) {
    
    // Case 1: We have a winner (fully confirmed by admin)
    if (winnerTeam) {
        return `
            <div style="
                display: inline-flex;
                align-items: center;
                gap: 10px;
                padding: 12px 20px;
                background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.1));
                border: 2px solid rgba(255,215,0,0.5);
                border-radius: 25px;
                animation: winnerGlow 2s ease-in-out infinite;
            ">
                <span style="font-size: 24px;">👑</span>
                <div>
                    <div style="color: #ffd700; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
                        ${isCompleted ? 'Week Winner' : 'Currently Winning'}
                    </div>
                    <div style="color: ${teamColor(winnerTeam)}; font-weight: 700; font-size: 16px;">
                        ${winnerTeam}
                    </div>
                </div>
            </div>
            <style>
                @keyframes winnerGlow {
                    0%, 100% { box-shadow: 0 0 10px rgba(255,215,0,0.3); }
                    50% { box-shadow: 0 0 25px rgba(255,215,0,0.5); }
                }
            </style>
        `;
    }
    
    // Case 2: Teams completed missions but waiting for admin confirmation
    if (teamsWaitingConfirmation.length > 0 && !anyTeamConfirmed) {
        return `
            <div style="
                padding: 15px 20px;
                background: rgba(255,165,0,0.1);
                border: 1px solid rgba(255,165,0,0.3);
                border-radius: 12px;
            ">
                <div style="font-size: 28px; margin-bottom: 8px;">⏳</div>
                <div style="color: #ffa500; font-size: 13px; font-weight: 600;">
                    Awaiting Admin Confirmation
                </div>
                <div style="color: #888; font-size: 11px; margin-top: 5px;">
                    ${teamsWaitingConfirmation.length} team${teamsWaitingConfirmation.length > 1 ? 's' : ''} completed missions.<br>
                    Winner will be announced after attendance & police check.
                </div>
                <div style="
                    margin-top: 10px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    justify-content: center;
                ">
                    ${teamsWaitingConfirmation.map(([t, info]) => `
                        <span style="
                            padding: 4px 10px;
                            background: ${teamColor(t)}22;
                            border: 1px solid ${teamColor(t)}44;
                            border-radius: 12px;
                            color: ${teamColor(t)};
                            font-size: 10px;
                            font-weight: 600;
                        ">${t}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Case 3: No team has completed all missions yet
    if (eligibleTeams.length === 0) {
        return `
            <div style="
                padding: 12px 16px;
                background: rgba(136,136,136,0.1);
                border: 1px solid rgba(136,136,136,0.2);
                border-radius: 12px;
            ">
                <div style="color: #888; font-size: 12px;">
                    🎯 No team is fully eligible yet
                </div>
                ${leadingTeam ? `
                    <div style="margin-top: 8px; color: #666; font-size: 11px;">
                        Leading in XP: <span style="color: ${teamColor(leadingTeam)}; font-weight: 600;">${leadingTeam}</span>
                        <span style="color: #888;">(${leadingStatus.passedCount}/${leadingStatus.totalChecks} requirements)</span>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    return '';
}

// ✅ NEW: Render individual team card
function renderTeamCard(teamName, info, index, myTeam, winnerTeam, isCompleted) {
    const isMyTeam = teamName === myTeam;
    const eligibility = getTeamEligibilityStatus(info);
    const isCurrentWinner = teamName === winnerTeam;
    const tColor = teamColor(teamName);
    
    // Check if team completed missions but waiting for confirmation
    const completedMissions = info.trackGoalPassed && info.albumGoalPassed && info.album2xPassed;
    const awaitingConfirmation = completedMissions && (!info.attendanceConfirmed || !info.policeConfirmed);
    
    return `
        <div class="team-level-card ${isMyTeam ? 'my-team' : ''}" style="
            border-color: ${tColor};
            ${isCurrentWinner ? 'box-shadow: 0 0 25px rgba(255,215,0,0.4); border-color: #ffd700; border-width: 2px;' : ''}
            ${awaitingConfirmation ? 'border-style: dashed;' : ''}
            position: relative;
        ">
            ${isMyTeam ? '<div class="my-team-badge">Your Team</div>' : ''}
            
            <!-- Status Badge -->
            ${isCurrentWinner ? `
                <div style="
                    position: absolute;
                    top: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(135deg, #ffd700, #ffaa00);
                    color: #000;
                    padding: 4px 12px;
                    border-radius: 10px;
                    font-size: 10px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    box-shadow: 0 2px 10px rgba(255,215,0,0.4);
                ">
                    <span>👑</span>
                    <span>${isCompleted ? 'WINNER' : 'WINNING'}</span>
                </div>
            ` : awaitingConfirmation ? `
                <div style="
                    position: absolute;
                    top: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(255,165,0,0.9);
                    color: #000;
                    padding: 4px 10px;
                    border-radius: 10px;
                    font-size: 9px;
                    font-weight: 600;
                    white-space: nowrap;
                ">
                    ⏳ Awaiting Approval
                </div>
            ` : index === 0 && !eligibility.allPassed ? `
                <div style="
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    font-size: 14px;
                " title="Highest XP but missing requirements">⚡</div>
            ` : ''}
            
            <!-- Team PFP -->
            ${teamPfp(teamName) ? `
                <img src="${teamPfp(teamName)}" class="team-level-pfp" style="
                    border-color: ${isCurrentWinner ? '#ffd700' : tColor};
                    ${isCurrentWinner ? 'box-shadow: 0 0 15px rgba(255,215,0,0.4);' : ''}
                ">
            ` : ''}
            
            <!-- Team Name -->
            <div class="team-level-name" style="color: ${tColor}">${teamName}</div>
            
            <!-- Level -->
            <div class="team-level-num">${info.level || 1}</div>
            <div class="team-level-label">LEVEL</div>
            
            <!-- XP -->
            <div class="team-level-xp">${fmt(info.teamXP)} XP</div>
            
            <!-- All 5 Requirements -->
            <div class="team-level-missions" style="
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 4px;
                margin-top: 10px;
                padding: 8px;
                background: rgba(0,0,0,0.2);
                border-radius: 8px;
            ">
                <div class="mission-check" title="Track Goals" style="text-align:center;">
                    <div style="font-size: 14px;">${info.trackGoalPassed ? '✅' : '❌'}</div>
                    <div style="font-size: 8px; color: #666; margin-top: 2px;">🎵</div>
                </div>
                <div class="mission-check" title="Album Goals" style="text-align:center;">
                    <div style="font-size: 14px;">${info.albumGoalPassed ? '✅' : '❌'}</div>
                    <div style="font-size: 8px; color: #666; margin-top: 2px;">💿</div>
                </div>
                <div class="mission-check" title="Album 2X" style="text-align:center;">
                    <div style="font-size: 14px;">${info.album2xPassed ? '✅' : '❌'}</div>
                    <div style="font-size: 8px; color: #666; margin-top: 2px;">✨</div>
                </div>
                <div class="mission-check" title="Attendance (Admin)" style="text-align:center;">
                    <div style="font-size: 14px;">${info.attendanceConfirmed ? '✅' : '⏳'}</div>
                    <div style="font-size: 8px; color: ${info.attendanceConfirmed ? '#00ff88' : '#ffa500'}; margin-top: 2px;">📋</div>
                </div>
                <div class="mission-check" title="Police (Admin)" style="text-align:center;">
                    <div style="font-size: 14px;">${info.policeConfirmed ? '✅' : '⏳'}</div>
                    <div style="font-size: 8px; color: ${info.policeConfirmed ? '#00ff88' : '#ffa500'}; margin-top: 2px;">👮</div>
                </div>
            </div>
            
            <!-- Status Text -->
            <div class="team-level-status" style="
                margin-top: 10px;
                padding: 6px 12px;
                border-radius: 15px;
                font-size: 11px;
                font-weight: 600;
                ${isCurrentWinner ? `
                    background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.1));
                    color: #ffd700;
                    border: 1px solid rgba(255,215,0,0.3);
                ` : eligibility.allPassed ? `
                    background: rgba(0,255,136,0.1);
                    color: #00ff88;
                ` : awaitingConfirmation ? `
                    background: rgba(255,165,0,0.1);
                    color: #ffa500;
                ` : `
                    background: rgba(255,255,255,0.05);
                    color: #888;
                `}
            ">
                ${isCurrentWinner ? '👑 ' + (isCompleted ? 'Winner!' : 'Winning!') : 
                  eligibility.allPassed ? '✅ Fully Eligible' :
                  awaitingConfirmation ? '⏳ Pending Approval' :
                  `${eligibility.passedCount}/${eligibility.totalChecks} Complete`}
            </div>
        </div>
    `;
}

// ✅ NEW: Render legend
function renderTeamLevelLegend() {
    return `
        <div class="card" style="margin-top: 20px; background: rgba(255,255,255,0.02);">
            <div class="card-body" style="padding: 15px;">
                <div style="font-size: 12px; color: #888; margin-bottom: 12px; text-align: center;">
                    Requirement Legend
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); gap: 10px; text-align: center;">
                    <div style="padding: 8px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                        <span style="font-size: 18px;">🎵</span>
                        <div style="color: #888; font-size: 10px; margin-top: 4px;">Track Goals</div>
                    </div>
                    <div style="padding: 8px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                        <span style="font-size: 18px;">💿</span>
                        <div style="color: #888; font-size: 10px; margin-top: 4px;">Album Goals</div>
                    </div>
                    <div style="padding: 8px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                        <span style="font-size: 18px;">✨</span>
                        <div style="color: #888; font-size: 10px; margin-top: 4px;">Album 2X</div>
                    </div>
                    <div style="padding: 8px; background: rgba(255,165,0,0.1); border-radius: 8px; border: 1px dashed rgba(255,165,0,0.3);">
                        <span style="font-size: 18px;">📋</span>
                        <div style="color: #ffa500; font-size: 10px; margin-top: 4px;">Attendance*</div>
                    </div>
                    <div style="padding: 8px; background: rgba(255,165,0,0.1); border-radius: 8px; border: 1px dashed rgba(255,165,0,0.3);">
                        <span style="font-size: 18px;">👮</span>
                        <div style="color: #ffa500; font-size: 10px; margin-top: 4px;">Police*</div>
                    </div>
                </div>
                
                <div style="
                    margin-top: 15px;
                    padding: 10px;
                    background: rgba(255,165,0,0.05);
                    border: 1px solid rgba(255,165,0,0.2);
                    border-radius: 8px;
                    text-align: center;
                ">
                    <span style="color: #ffa500; font-size: 11px;">
                        * Admin confirms after Sunday 4 PM IST deadline
                    </span>
                </div>
                
                <div style="text-align: center; margin-top: 12px; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                    <span style="color: #00ff88; font-size: 11px;">✅ Passed</span>
                    <span style="color: #ffa500; font-size: 11px;">⏳ Pending</span>
                    <span style="color: #ff6b6b; font-size: 11px;">❌ Failed</span>
                </div>
            </div>
        </div>
    `;
}
// ==================== COMPARISON (MOBILE FIXED) ====================
async function renderComparison() {
    const container = $('comparison-content');
    if (!container) return;
    
    try {
        const [comparison, goals, summary] = await Promise.all([
            api('getTeamComparison', { week: STATE.week }), 
            api('getGoalsProgress', { week: STATE.week }), 
            api('getWeeklySummary', { week: STATE.week })
        ]);
        
        if (comparison.lastUpdated) STATE.lastUpdated = comparison.lastUpdated;
        const teams = (comparison.comparison || []).sort((a, b) => (b.teamXP || 0) - (a.teamXP || 0));
        const maxXP = teams[0]?.teamXP || 1;
        const trackGoals = goals.trackGoals || {};
        const albumGoals = goals.albumGoals || {};
        const teamNames = Object.keys(CONFIG.TEAMS);
        
        let html = `
            ${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}
            
            <!-- Battle Standings -->
            <div class="card">
                <div class="card-header"><h3>⚔️ Battle Standings (${STATE.week})</h3></div>
                <div class="card-body">
                    ${teams.map((t, i) => `
                        <div class="comparison-item">
                            <div class="comparison-top-row">
                                <span class="comparison-rank">${i+1}</span>
                                <span class="comparison-name" style="color:${teamColor(t.team)}">${t.team}</span>
                                <span class="comparison-xp">${fmt(t.teamXP)} XP</span>
                            </div>
                            <div class="comparison-bar-container">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width:${(t.teamXP/maxXP)*100}%;background:${teamColor(t.team)}"></div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Track Goals Comparison
        if (Object.keys(trackGoals).length) {
            html += `
                <div class="card">
                    <div class="card-header"><h3>🎵 Track Goals</h3></div>
                    <div class="card-body">
                        ${Object.entries(trackGoals).map(([trackName, info]) => {
                            const goal = info.goal || 0;
                            return `
                                <div class="goal-comparison-block">
                                    <div class="goal-comparison-header">
                                        <span class="goal-track-name">${sanitize(trackName)}</span>
                                        <span class="goal-target">Goal: ${fmt(goal)}</span>
                                    </div>
                                    <div class="goal-team-progress">
                                        ${teamNames.map(teamName => {
                                            const tp = info.teams?.[teamName] || {};
                                            const current = tp.current || 0;
                                            const pct = goal > 0 ? Math.min((current/goal)*100, 100) : 0;
                                            const done = current >= goal;
                                            return `
                                                <div class="team-progress-row">
                                                    <span class="team-name-small" style="color:${teamColor(teamName)}">${teamName.replace('Team ', '')}</span>
                                                    <div class="progress-bar-small">
                                                        <div class="progress-fill ${done ? 'complete' : ''}" style="width:${pct}%;background:${teamColor(teamName)}"></div>
                                                    </div>
                                                    <span class="progress-text ${done ? 'complete' : ''}">${fmt(current)}</span>
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
        
        // Album Goals Comparison
        if (Object.keys(albumGoals).length) {
            html += `
                <div class="card">
                    <div class="card-header"><h3>💿 Album Goals</h3></div>
                    <div class="card-body">
                        ${Object.entries(albumGoals).map(([albumName, info]) => {
                            const goal = info.goal || 0;
                            return `
                                <div class="goal-comparison-block">
                                    <div class="goal-comparison-header">
                                        <span class="goal-track-name">${sanitize(albumName)}</span>
                                        <span class="goal-target">Goal: ${fmt(goal)}</span>
                                    </div>
                                    <div class="goal-team-progress">
                                        ${teamNames.map(teamName => {
                                            const ap = info.teams?.[teamName] || {};
                                            const current = ap.current || 0;
                                            const pct = goal > 0 ? Math.min((current/goal)*100, 100) : 0;
                                            const done = current >= goal;
                                            return `
                                                <div class="team-progress-row">
                                                    <span class="team-name-small" style="color:${teamColor(teamName)}">${teamName.replace('Team ', '')}</span>
                                                    <div class="progress-bar-small">
                                                        <div class="progress-fill ${done ? 'complete' : ''}" style="width:${pct}%;background:${teamColor(teamName)}"></div>
                                                    </div>
                                                    <span class="progress-text ${done ? 'complete' : ''}">${fmt(current)}</span>
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
        
        container.innerHTML = html;
        
    } catch (e) { 
        console.error('Comparison error:', e);
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load comparison</p></div></div>'; 
    }
}
// ==================== SUMMARY (FIXED - MATCHES ORIGINAL THEME) ====================
async function renderSummary() {
    const container = $('summary-content');
    if (!container) return;
    
    const selectedWeek = STATE.week;
    const isCompleted = isWeekCompleted(selectedWeek);
    
    // If week not completed, show locked state
    if (!isCompleted) {
        const days = getDaysRemaining(selectedWeek);
        container.innerHTML = `
            <div class="card">
                <div class="card-body summary-locked">
                    <div class="locked-icon">🔒</div>
                    <h2>Summary Locked</h2>
                    <p>Results for <strong>${selectedWeek}</strong> are not yet final.</p>
                    <div class="countdown-box">
                        <div class="countdown-value">${days}</div>
                        <div class="countdown-label">day${days !== 1 ? 's' : ''} until results</div>
                    </div>
                    <button onclick="loadPage('home')" class="btn-primary">
                        View Live Progress →
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '<div class="loading-skeleton"><div class="skeleton-card"></div></div>';
    
    try {
        const [summary, goals, rankings] = await Promise.all([
            api('getWeeklySummary', { week: selectedWeek }), 
            api('getGoalsProgress', { week: selectedWeek }),
            api('getRankings', { week: selectedWeek, limit: 10 })
        ]);
        
        const teams = summary.teams || {};
        const trackGoals = goals.trackGoals || {};
        const albumGoals = goals.albumGoals || {};
        const topAgents = rankings.rankings || [];
        
        const sorted = Object.entries(teams).sort((a, b) => (b[1].teamXP || 0) - (a[1].teamXP || 0));
        
        // Find winner: team with highest XP that completed ALL missions
        const teamsWithAllMissions = sorted.filter(([t, info]) => 
            info.trackGoalPassed && info.albumGoalPassed && info.album2xPassed
        );
        const winner = teamsWithAllMissions.length > 0 ? teamsWithAllMissions[0][0] : null;
        const myTeam = STATE.data?.profile?.team;
        
        // ===== CALCULATE STREAM TOTALS =====
        let totalTrackStreams = 0;
        let totalAlbumStreams = 0;
        let totalXP = sorted.reduce((sum, [, info]) => sum + (info.teamXP || 0), 0);
        
        const trackStats = [];
        for (const [trackName, info] of Object.entries(trackGoals)) {
            let total = 0;
            const teamData = {};
            for (const teamName of Object.keys(CONFIG.TEAMS)) {
                const streams = info.teams?.[teamName]?.current || 0;
                total += streams;
                teamData[teamName] = streams;
            }
            totalTrackStreams += total;
            trackStats.push({ name: trackName, total, goal: info.goal || 0, teams: teamData });
        }
        trackStats.sort((a, b) => b.total - a.total);
        
        const albumStats = [];
        for (const [albumName, info] of Object.entries(albumGoals)) {
            let total = 0;
            const teamData = {};
            for (const teamName of Object.keys(CONFIG.TEAMS)) {
                const streams = info.teams?.[teamName]?.current || 0;
                total += streams;
                teamData[teamName] = streams;
            }
            totalAlbumStreams += total;
            albumStats.push({ name: albumName, total, goal: info.goal || 0, teams: teamData });
        }
        albumStats.sort((a, b) => b.total - a.total);
        
        const endDate = CONFIG.WEEK_DATES[selectedWeek];
        const dateStr = endDate ? new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
        
        container.innerHTML = `
            <!-- Week Header -->
            <div class="summary-week-header">
                <span class="summary-week-badge">${selectedWeek}</span>
                <h2>Final Results</h2>
                <p class="results-subtitle">🏆 Battle Concluded ${dateStr ? '• ' + dateStr : ''}</p>
            </div>
            
            <!-- ===== WINNER ANNOUNCEMENT ===== -->
            ${winner ? `
                <div class="winner-announcement" style="--team-color: ${teamColor(winner)};">
                    <div class="winner-trophy">🏆</div>
                    <div class="winner-content">
                        ${teamPfp(winner) ? `<img src="${teamPfp(winner)}" class="winner-avatar" alt="${winner}">` : ''}
                        <h2 class="winner-title">${winner}</h2>
                        <p class="winner-subtitle">WEEK CHAMPIONS!</p>
                        <div class="winner-xp">
                            <span class="xp-value">${fmt(teams[winner]?.teamXP)}</span>
                            <span class="xp-label">Total XP</span>
                        </div>
                    </div>
                    ${winner === myTeam ? `
                        <div class="winner-you-badge">🎉 YOUR TEAM WON!</div>
                    ` : ''}
                    <div class="winner-confetti">🎊</div>
                </div>
            ` : `
                <div class="card" style="margin-bottom:20px;">
                    <div class="card-body" style="text-align:center;padding:30px;">
                        <div style="font-size:48px;margin-bottom:10px;">😔</div>
                        <h3 style="color:var(--danger);margin:0;">No Winner This Week</h3>
                        <p style="color:var(--text-dim);margin-top:10px;">No team completed all 3 missions.</p>
                    </div>
                </div>
            `}
            
            <!-- ===== SHAREABLE STREAMS CARD ===== -->
            <div id="shareable-stats-card" class="card" style="margin-bottom:20px;border-color:var(--purple-glow);">
                <div class="card-header" style="background:linear-gradient(135deg, var(--purple-glow), #5a1f99);text-align:center;padding:20px;">
                    <div style="font-size:20px;margin-bottom:5px;">💜 BTS COMEBACK MISSION 💜</div>
                    <div style="color:#fff;font-size:14px;">${selectedWeek} - Total Streams Pulled</div>
                </div>
                <div class="card-body">
                    
                    <!-- Track Streams Section -->
                    <div style="margin-bottom:20px;">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border-color);">
                            <span style="font-size:18px;">🎵</span>
                            <span style="color:var(--success);font-weight:600;font-size:14px;">TRACK STREAMS</span>
                            <span style="margin-left:auto;color:var(--success);font-weight:bold;">${fmt(totalTrackStreams)}</span>
                        </div>
                        
                        ${trackStats.map(track => `
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.03);">
                                <span style="color:#fff;font-size:13px;">${sanitize(track.name)}</span>
                                <span style="color:var(--success);font-weight:600;font-size:14px;">${fmt(track.total)}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Album Streams Section -->
                    <div style="margin-bottom:20px;">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border-color);">
                            <span style="font-size:18px;">💿</span>
                            <span style="color:var(--purple-glow);font-weight:600;font-size:14px;">ALBUM STREAMS</span>
                            <span style="margin-left:auto;color:var(--purple-glow);font-weight:bold;">${fmt(totalAlbumStreams)}</span>
                        </div>
                        
                        ${albumStats.map(album => `
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.03);">
                                <span style="color:#fff;font-size:13px;">${sanitize(album.name)}</span>
                                <span style="color:var(--purple-glow);font-weight:600;font-size:14px;">${fmt(album.total)}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Grand Total -->
                    <div style="background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.3);border-radius:12px;padding:20px;text-align:center;">
                        <div style="color:#ffd700;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;">
                            🔥 Total Streams This Week 🔥
                        </div>
                        <div style="font-size:36px;font-weight:bold;color:#ffd700;">
                            ${fmt(totalTrackStreams + totalAlbumStreams)}
                        </div>
                    </div>
                </div>
                
                <!-- Hashtags Footer -->
                <div style="background:rgba(0,0,0,0.2);padding:10px;text-align:center;border-top:1px solid var(--border-color);">
                    <span style="color:var(--text-dim);font-size:10px;">#BTSComeback #BTSARMY #StreamingMission</span>
                </div>
            </div>
            
            <!-- Share Buttons -->
            <div style="display:flex;gap:10px;margin-bottom:25px;">
                <button onclick="shareStats()" class="btn-primary" style="flex:1;">
                    📸 Screenshot Stats
                </button>
                <button onclick="copyShareText()" class="btn-secondary" style="flex:1;">
                    📋 Copy Caption
                </button>
            </div>
            
            <!-- ===== TEAM STANDINGS ===== -->
            <div class="card standings-card">
                <div class="card-header">
                    <h3>📊 Final Standings</h3>
                </div>
                <div class="card-body standings-list">
                    ${sorted.map(([t, info], i) => {
                        const hasAllMissions = info.trackGoalPassed && info.albumGoalPassed && info.album2xPassed;
                        const isWinner = t === winner;
                        return `
                            <div class="standing-item ${isWinner ? 'is-winner' : ''} ${t === myTeam ? 'my-team' : ''}" style="--team-color: ${teamColor(t)};">
                                <div class="standing-rank">
                                    ${isWinner ? '👑' : i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `<span class="rank-num">${i + 1}</span>`}
                                </div>
                                <div class="standing-team">
                                    ${teamPfp(t) ? `<img src="${teamPfp(t)}" class="standing-avatar" alt="${t}">` : `<div class="standing-avatar-placeholder">${t[0]}</div>`}
                                    <div class="standing-info">
                                        <div class="standing-name">${t} ${t === myTeam ? '(You)' : ''}</div>
                                        <div class="standing-goals">
                                            <span class="goal-badge ${info.trackGoalPassed ? 'passed' : 'failed'}">🎵 ${info.trackGoalPassed ? '✓' : '✗'}</span>
                                            <span class="goal-badge ${info.albumGoalPassed ? 'passed' : 'failed'}">💿 ${info.albumGoalPassed ? '✓' : '✗'}</span>
                                            <span class="goal-badge ${info.album2xPassed ? 'passed' : 'failed'}">✨ ${info.album2xPassed ? '✓' : '✗'}</span>
                                            ${hasAllMissions ? '<span style="color:var(--success);font-size:9px;margin-left:5px;">All Complete!</span>' : ''}
                                        </div>
                                    </div>
                                </div>
                                <div class="standing-xp">
                                    <span class="standing-xp-value">${fmt(info.teamXP)}</span>
                                    <span class="standing-xp-label">XP</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <!-- ===== TRACK DETAILS WITH TEAM BREAKDOWN ===== -->
            <div class="card" style="margin-top:20px;">
                <div class="card-header">
                    <h3>🎵 Track Streams by Team</h3>
                </div>
                <div class="card-body">
                    ${trackStats.map((track, i) => `
                        <div class="goal-item" style="margin-bottom:15px;">
                            <div class="goal-header">
                                <span class="goal-name">
                                    ${i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : i === 2 ? '🥉 ' : ''}${sanitize(track.name)}
                                </span>
                                <span class="goal-status complete">${fmt(track.total)} streams</span>
                            </div>
                            
                            <!-- Team contribution bar -->
                            <div class="progress-bar" style="height:12px;margin:8px 0;">
                                ${Object.entries(track.teams).filter(([,s]) => s > 0).map(([team, streams]) => {
                                    const pct = track.total > 0 ? (streams / track.total) * 100 : 0;
                                    return `<div class="progress-fill" style="width:${pct}%;background:${teamColor(team)};display:inline-block;height:100%;" title="${team}: ${fmt(streams)}"></div>`;
                                }).join('')}
                            </div>
                            
                            <!-- Team labels -->
                            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
                                ${Object.entries(track.teams).filter(([,s]) => s > 0).sort((a,b) => b[1] - a[1]).map(([team, streams]) => `
                                    <span style="font-size:10px;padding:3px 8px;background:${teamColor(team)}22;color:${teamColor(team)};border-radius:10px;">
                                        ${team.replace('Team ', '')}: ${fmt(streams)}
                                    </span>
                                `).join('')}
                            </div>
                            
                            ${track.goal > 0 ? `
                                <div style="margin-top:8px;font-size:10px;color:${track.total >= track.goal ? 'var(--success)' : 'var(--text-dim)'};">
                                    Goal: ${fmt(track.goal)} ${track.total >= track.goal ? '✅ Achieved!' : `(${Math.round((track.total/track.goal)*100)}%)`}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- ===== ALBUM DETAILS WITH TEAM BREAKDOWN ===== -->
            <div class="card" style="margin-top:20px;">
                <div class="card-header">
                    <h3>💿 Album Streams by Team</h3>
                </div>
                <div class="card-body">
                    ${albumStats.map((album, i) => `
                        <div class="goal-item" style="margin-bottom:15px;">
                            <div class="goal-header">
                                <span class="goal-name">
                                    ${i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : i === 2 ? '🥉 ' : ''}${sanitize(album.name)}
                                </span>
                                <span class="goal-status complete">${fmt(album.total)} streams</span>
                            </div>
                            
                            <div class="progress-bar" style="height:12px;margin:8px 0;">
                                ${Object.entries(album.teams).filter(([,s]) => s > 0).map(([team, streams]) => {
                                    const pct = album.total > 0 ? (streams / album.total) * 100 : 0;
                                    return `<div class="progress-fill" style="width:${pct}%;background:${teamColor(team)};display:inline-block;height:100%;"></div>`;
                                }).join('')}
                            </div>
                            
                            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
                                ${Object.entries(album.teams).filter(([,s]) => s > 0).sort((a,b) => b[1] - a[1]).map(([team, streams]) => `
                                    <span style="font-size:10px;padding:3px 8px;background:${teamColor(team)}22;color:${teamColor(team)};border-radius:10px;">
                                        ${team.replace('Team ', '')}: ${fmt(streams)}
                                    </span>
                                `).join('')}
                            </div>
                            
                            ${album.goal > 0 ? `
                                <div style="margin-top:8px;font-size:10px;color:${album.total >= album.goal ? 'var(--success)' : 'var(--text-dim)'};">
                                    Goal: ${fmt(album.goal)} ${album.total >= album.goal ? '✅ Achieved!' : `(${Math.round((album.total/album.goal)*100)}%)`}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- ===== BATTLE STATS ===== -->
            <div class="card stats-overview-card" style="margin-top:20px;">
                <div class="card-header">
                    <h3>📈 Battle Stats</h3>
                </div>
                <div class="card-body">
                    <div class="stats-grid">
                        <div class="stat-box">
                            <div class="stat-icon">🎵</div>
                            <div class="stat-value">${fmt(totalTrackStreams)}</div>
                            <div class="stat-label">Track Streams</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-icon">💿</div>
                            <div class="stat-value">${fmt(totalAlbumStreams)}</div>
                            <div class="stat-label">Album Streams</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-icon">⭐</div>
                            <div class="stat-value">${fmt(totalXP)}</div>
                            <div class="stat-label">Total XP</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-icon">⚔️</div>
                            <div class="stat-value">${sorted.length}</div>
                            <div class="stat-label">Teams</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- ===== TOP AGENTS ===== -->
            ${topAgents.length > 0 ? `
                <div class="card" style="margin-top:20px;">
                    <div class="card-header">
                        <h3>🏆 Top Agents</h3>
                    </div>
                    <div class="card-body">
                        ${topAgents.slice(0, 5).map((agent, i) => `
                            <div class="rank-item ${String(agent.agentNo) === String(STATE.agentNo) ? 'highlight' : ''}">
                                <div class="rank-num">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</div>
                                <div class="rank-info">
                                    <div class="rank-name">${sanitize(agent.name)}${String(agent.agentNo) === String(STATE.agentNo) ? ' (You)' : ''}</div>
                                    <div class="rank-team" style="color:${teamColor(agent.team)}">${agent.team}</div>
                                </div>
                                <div class="rank-xp">${fmt(agent.totalXP)} XP</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <!-- Action Buttons -->
            <div class="summary-actions" style="margin-top:20px;">
                <button onclick="loadPage('rankings')" class="btn-secondary">
                    👥 View Full Rankings
                </button>
                <button onclick="loadPage('home')" class="btn-primary">
                    🏠 Back to Home
                </button>
            </div>
        `;
        
        markResultsSeen(selectedWeek);
        
    } catch (e) { 
        console.error('Summary error:', e);
        container.innerHTML = `
            <div class="card">
                <div class="card-body error-state">
                    <div class="error-icon">😵</div>
                    <h3>Failed to Load Summary</h3>
                    <p>${sanitize(e.message)}</p>
                    <button onclick="renderSummary()" class="btn-primary">Retry</button>
                </div>
            </div>
        `; 
    }
}

// ==================== SHARE FUNCTIONS ====================

function shareStats() {
    const card = document.getElementById('shareable-stats-card');
    if (!card) {
        showToast('Stats card not found', 'error');
        return;
    }
    
    // Scroll to card
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Add highlight effect
    card.style.transition = 'all 0.3s ease';
    card.style.boxShadow = '0 0 30px rgba(123, 44, 191, 0.6), 0 0 60px rgba(123, 44, 191, 0.3)';
    card.style.transform = 'scale(1.01)';
    
    showToast('📸 Screenshot the highlighted card!', 'success');
    
    // Remove highlight after 6 seconds
    setTimeout(() => {
        card.style.boxShadow = '';
        card.style.transform = '';
    }, 6000);
}

function copyShareText() {
    const week = STATE.week || 'This Week';
    
    const shareText = `💜 BTS COMEBACK MISSION 💜

${week} Results are in! 🔥

Our ARMY agents came together and pulled amazing streaming numbers! 

Every stream counts. Join us in supporting BTS! 🎵

#BTSComeback #BTS #BTSARMY #StreamingMission

💜 Fighting! 보라해! 💜`;
    
    navigator.clipboard.writeText(shareText).then(() => {
        showToast('✅ Caption copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('✅ Caption copied!', 'success');
    });
}

// Add to window exports
window.shareStats = shareStats;
window.copyShareText = copyShareText;

async function renderSecretMissions() {
    const container = $('secret-missions-content');
    if (!container) return;
    
    const myTeam = STATE.data?.profile?.team;
    if (!myTeam) {
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Could not identify your team</p></div></div>';
        return;
    }
    
    container.innerHTML = '<div class="loading-skeleton"><div class="skeleton-card"></div></div>';
    
    try {
        const [missionsData, statsData] = await Promise.all([
            api('getTeamSecretMissions', { team: myTeam, agentNo: STATE.agentNo, week: STATE.week })
                .catch(() => ({ active: [], completed: [], myAssigned: [] })), 
            api('getTeamSecretStats', { week: STATE.week })
                .catch(() => ({ teams: {} }))
        ]);
        
        const activeMissions = missionsData.active || [];
        const completedMissions = missionsData.completed || [];
        const myAssigned = missionsData.myAssigned || [];
        const stats = statsData.teams || {};
        const myStats = stats[myTeam] || {};
        
        // Debug logging
        console.log('📋 Missions loaded:', {
            active: activeMissions.length,
            completed: completedMissions.length,
            myAssigned: myAssigned.length
        });
        
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
                    ${activeMissions.length ? activeMissions.map(m => renderSecretMissionCard(m, myTeam, false)).join('') : `<div class="empty-missions"><div class="empty-icon">📭</div><p>No active secret missions</p></div>`}
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
        
        // ============================================================
        // ✅ FIXED: Update notification state with CORRECT field names
        // ============================================================
        
        const allMissionIds = [
            ...activeMissions.map(m => m.id),
            ...myAssigned.map(m => m.id)
        ].filter(Boolean);
        
        console.log('✅ Marking', allMissionIds.length, 'missions as seen:', allMissionIds);
        
        // ✅ FIX 1: Use "missionCount" NOT "missions"
        STATE.lastChecked.missionCount = activeMissions.length;
        
        // ✅ FIX 2: Update seenMissionIds
        STATE.lastChecked.seenMissionIds = allMissionIds;
        
        // ✅ FIX 3: Set baseline flag so future checks know we've loaded before
        STATE.lastChecked._missionBaselineSet = true;
        
        // ✅ Save to localStorage
        saveNotificationState();
        
        // ✅ Verify save
        console.log('💾 Saved notification state:', {
            missionCount: STATE.lastChecked.missionCount,
            seenMissionIds: STATE.lastChecked.seenMissionIds,
            _missionBaselineSet: STATE.lastChecked._missionBaselineSet
        });
        
        // ✅ Remove notification dot
        const missionDot = document.getElementById('dot-mission');
        if (missionDot) {
            missionDot.classList.remove('active');
            console.log('✅ Mission notification dot cleared');
        }
        
        // ✅ Remove mission notifications from queue
        if (STATE.notifications && Array.isArray(STATE.notifications)) {
            const beforeCount = STATE.notifications.length;
            STATE.notifications = STATE.notifications.filter(n => 
                n.type !== 'mission' && n.type !== 'secret_mission'
            );
            const removed = beforeCount - STATE.notifications.length;
            if (removed > 0) {
                console.log(`🗑️ Removed ${removed} mission notifications from queue`);
            }
        }
        
        // ✅ Update notification badge
        updateNotificationBadge();
        
    } catch (e) {
        console.error('Failed to load secret missions:', e);
        container.innerHTML = renderGuide('secret-missions') + `
            <div class="card">
                <div class="card-body error-state">
                    <p>Failed to load secret missions.</p>
                    <button onclick="renderSecretMissions()" class="btn-secondary">Retry</button>
                </div>
            </div>
        `;
    }
}
function renderSecretMissionCard(mission, team, isAssigned = false) {
    if (!mission) {
        console.warn('⚠️ renderSecretMissionCard called with null mission');
        return '';
    }
    
    const missionType = CONFIG.MISSION_TYPES?.[mission.type] || {
        name: 'Secret Mission',
        icon: '🕵️',
        description: 'Complete this mission!'
    };
    
    const teamColorVal = teamColor(team);
    const xpReward = mission.xpReward || CONFIG.SECRET_MISSIONS?.xpPerMission || 5;
    
    // ✅ FIX: Use "briefing" field from backend (your backend sends "briefing", not "description")
    const title = mission.title || missionType.name || 'Secret Mission';
    const description = mission.briefing ||          // ✅ Backend field name
                        mission.description ||        // Fallback
                        mission.instructions || 
                        missionType.description || 
                        'No details available';
    
    // Additional mission info
    const hasGoal = mission.goalType && mission.goalTarget;
    const hasTrack = mission.targetTrack;
    const hasClue = mission.encodedClue;
    
    return `
        <div class="secret-mission-card ${isAssigned ? 'assigned' : ''}" style="
            background: linear-gradient(145deg, #1a1a2e, #0f0f1f);
            border: 1px solid ${isAssigned ? '#ffa500' : 'rgba(156, 39, 176, 0.3)'};
            border-radius: 14px;
            padding: 16px;
            margin-bottom: 12px;
            ${isAssigned ? 'box-shadow: 0 0 15px rgba(255, 165, 0, 0.2);' : ''}
        ">
            <div style="display: flex; align-items: flex-start; gap: 12px;">
                <div style="
                    width: 42px;
                    height: 42px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, ${teamColorVal}33, ${teamColorVal}11);
                    border: 1px solid ${teamColorVal}55;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    flex-shrink: 0;
                ">${missionType.icon}</div>
                
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
                        <span style="
                            color: ${teamColorVal};
                            font-size: 10px;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            font-weight: 600;
                        ">${missionType.name}</span>
                        
                        ${isAssigned ? `
                            <span style="
                                background: rgba(255, 165, 0, 0.2);
                                color: #ffa500;
                                font-size: 9px;
                                padding: 2px 8px;
                                border-radius: 10px;
                                font-weight: 700;
                            ">ASSIGNED TO YOU</span>
                        ` : ''}
                    </div>
                    
                    <!-- Title -->
                    <div style="
                        color: #fff;
                        font-size: 15px;
                        font-weight: 600;
                        margin-bottom: 8px;
                        line-height: 1.3;
                    ">${sanitize(title)}</div>
                    
                    <!-- Briefing/Description -->
                    <div style="
                        color: #aaa;
                        font-size: 13px;
                        line-height: 1.6;
                        white-space: pre-wrap;
                    ">${sanitize(description)}</div>
                    
                    <!-- Goal Progress (if applicable) -->
                    ${hasGoal ? `
                        <div style="
                            margin-top: 12px;
                            padding: 10px;
                            background: rgba(123, 44, 191, 0.1);
                            border-radius: 8px;
                        ">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="color: #888; font-size: 11px;">
                                    ${mission.goalType === 'streams' ? '🎵 Stream Goal' : '🎯 Goal'}
                                </span>
                                <span style="color: #7b2cbf; font-size: 11px; font-weight: 600;">
                                    ${mission.progress?.[team] || 0} / ${mission.goalTarget}
                                </span>
                            </div>
                            <div style="
                                height: 6px;
                                background: rgba(255,255,255,0.1);
                                border-radius: 3px;
                                overflow: hidden;
                            ">
                                <div style="
                                    height: 100%;
                                    width: ${Math.min(100, ((mission.progress?.[team] || 0) / mission.goalTarget) * 100)}%;
                                    background: linear-gradient(90deg, #7b2cbf, #00ff88);
                                    border-radius: 3px;
                                "></div>
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- Target Track (if applicable) -->
                    ${hasTrack ? `
                        <div style="
                            margin-top: 10px;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            color: #888;
                            font-size: 11px;
                        ">
                            <span>🎵</span>
                            <span>Target: <strong style="color: #fff;">${sanitize(mission.targetTrack)}</strong></span>
                        </div>
                    ` : ''}
                    
                    <!-- Encoded Clue (if applicable) -->
                    ${hasClue ? `
                        <div style="
                            margin-top: 10px;
                            padding: 10px;
                            background: rgba(255, 215, 0, 0.1);
                            border: 1px dashed rgba(255, 215, 0, 0.3);
                            border-radius: 8px;
                        ">
                            <div style="color: #ffd700; font-size: 10px; margin-bottom: 4px;">🔐 ENCODED CLUE</div>
                            <div style="color: #fff; font-size: 12px; font-family: monospace;">${sanitize(mission.encodedClue)}</div>
                        </div>
                    ` : ''}
                </div>
                
                <!-- XP Reward Badge -->
                <div style="
                    background: rgba(255, 215, 0, 0.15);
                    border: 1px solid rgba(255, 215, 0, 0.3);
                    border-radius: 10px;
                    padding: 8px 12px;
                    text-align: center;
                    flex-shrink: 0;
                ">
                    <div style="color: #ffd700; font-size: 16px; font-weight: 800;">+${xpReward}</div>
                    <div style="color: #888; font-size: 9px; text-transform: uppercase;">XP</div>
                </div>
            </div>
            
            <!-- Deadline -->
            ${mission.deadline ? `
                <div style="
                    margin-top: 12px;
                    padding-top: 10px;
                    border-top: 1px solid rgba(255,255,255,0.05);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #888;
                    font-size: 11px;
                ">
                    <span>⏰</span>
                    <span>Deadline: ${formatMissionDeadline(mission.deadline)}</span>
                </div>
            ` : ''}
            
            <!-- Complete Button (if assigned) -->
            ${isAssigned && mission.id ? `
                <div style="margin-top: 12px;">
                    <button onclick="markMissionComplete('${mission.id}')" style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, #00ff88, #00cc6a);
                        border: none;
                        border-radius: 10px;
                        color: #000;
                        font-size: 14px;
                        font-weight: 700;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                    ">
                        <span>✅</span>
                        <span>Mark as Complete</span>
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}
async function checkForNewMissionsBackground() {
    const team = STATE.data?.profile?.team;
    if (!team) {
        console.log('⚠️ Cannot check missions: No team assigned');
        return;
    }
    
    // ✅ Check if baseline is set
    const isFirstCheck = !STATE.lastChecked?._missionBaselineSet;
    
    try {
        const data = await api('getTeamSecretMissions', { 
            team, 
            agentNo: STATE.agentNo, 
            week: STATE.week 
        });
        
        const allMissions = [
            ...(data.active || []),
            ...(data.myAssigned || [])
        ];
        
        const allMissionIds = allMissions.map(m => m.id).filter(Boolean);
        
        // ✅ FIRST TIME: Set baseline and DON'T notify
        if (isFirstCheck) {
            console.log('🔄 Background: First mission check - setting baseline (no notification)');
            STATE.lastChecked.missionCount = allMissions.length;
            STATE.lastChecked.seenMissionIds = allMissionIds;
            STATE.lastChecked._missionBaselineSet = true;
            saveNotificationState();
            return; // No notification on first check
        }
        
        // Get previously seen mission IDs
        const seenIds = STATE.lastChecked?.seenMissionIds || [];
        
        // Find NEW missions (IDs we haven't seen before)
        const newMissions = allMissions.filter(m => m.id && !seenIds.includes(m.id));
        
        console.log('🔒 Background mission check:', {
            total: allMissions.length,
            seen: seenIds.length,
            new: newMissions.length,
            baselineSet: STATE.lastChecked._missionBaselineSet
        });
        
        // Only notify if there are NEW missions
        if (newMissions.length > 0) {
            // Show notification dot
            const dot = document.getElementById('dot-mission');
            if (dot) {
                dot.classList.add('active');
                console.log('🔴 Mission notification dot activated');
            }
            
            // Show toast notification
            if (newMissions.length === 1) {
                const mission = newMissions[0];
                const missionType = CONFIG.MISSION_TYPES?.[mission.type] || { icon: '🔒', name: 'Secret Mission' };
                showToast(`${missionType.icon} New Mission: ${mission.title || mission.briefing || missionType.name}`, 'info');
            } else {
                showToast(`🔒 ${newMissions.length} new secret missions available!`, 'info');
            }
            
            // Vibrate on mobile
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
            
            // Add to notification center
            if (STATE.notifications && Array.isArray(STATE.notifications)) {
                newMissions.forEach(mission => {
                    // Check if already in notifications to avoid duplicates
                    const exists = STATE.notifications.some(n => n.id === 'mission_' + mission.id);
                    if (!exists) {
                        const missionType = CONFIG.MISSION_TYPES?.[mission.type] || { icon: '🔒' };
                        STATE.notifications.unshift({
                            id: 'mission_' + mission.id,
                            type: 'secret_mission',
                            icon: missionType.icon,
                            title: 'New Secret Mission!',
                            message: mission.title || mission.briefing || 'A new mission is available',
                            action: () => loadPage('secret-missions'),
                            actionText: 'View Mission',
                            timestamp: Date.now(),
                            read: false
                        });
                    }
                });
                
                if (typeof updateNotificationBadge === 'function') {
                    updateNotificationBadge();
                }
            }
        }
        
        // Update count (but DON'T update seenMissionIds - only when user views page)
        STATE.lastChecked.missionCount = allMissions.length;
        
    } catch (e) {
        console.error('❌ Failed to check for new missions:', e);
    }
}

function formatMissionDeadline(dateStr) {
    if (!dateStr) return 'No deadline';
    try {
        const date = new Date(dateStr);
        const now = new Date();
        const diffHours = Math.floor((date - now) / (1000 * 60 * 60));
        
        if (diffHours < 0) return 'Expired';
        if (diffHours < 1) return 'Less than 1 hour!';
        if (diffHours < 24) return `${diffHours} hours left`;
        
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateStr;
    }
}

// Optional: Mark mission complete function
async function markMissionComplete(missionId) {
    if (!missionId) return;
    if (!confirm('Mark this mission as complete?')) return;
    
    try {
        const result = await api('completeMission', {
            agentNo: STATE.agentNo,
            missionId: missionId,
            week: STATE.week
        });
        
        if (result.success) {
            showToast('✅ Mission completed! XP awarded.', 'success');
            renderSecretMissions(); // Refresh
        } else {
            showToast(result.error || 'Failed to complete mission', 'error');
        }
    } catch (e) {
        showToast('Error: ' + e.message, 'error');
    }
}
window.markMissionComplete = markMissionComplete;
// ==================== SONG OF THE DAY (SOTD) ====================
async function renderSOTD() {
    console.log('🎬 renderSOTD called');
    
    const container = document.getElementById('sotd-content');
    
    if (!container) {
        console.error('❌ sotd-content not found!');
        showToast('Page container not found', 'error');
        return;
    }
    
    // Show loading
    container.innerHTML = `
        <div style="text-align:center;padding:60px 20px;">
            <div style="font-size:40px;margin-bottom:15px;">🎬</div>
            <p style="color:#888;">Loading Song of the Day...</p>
        </div>
    `;
    
    try {
        const data = await api('getSongOfDay', { agentNo: STATE.agentNo });
        console.log('🎬 SOTD API Response:', data);
        
        // Get dates
        const today = new Date();
        const dateDisplay = today.toLocaleDateString('en-US', { 
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
        });
        const todayStr = today.toDateString();
        
        // No song set
        if (!data?.success || !data?.song) {
            container.innerHTML = `
                <div class="card" style="text-align:center;padding:50px 20px;">
                    <div style="font-size:60px;margin-bottom:20px;">🎬</div>
                    <h3 style="color:#fff;margin:0 0 10px;">No Song Today</h3>
                    <p style="color:#888;margin:0 0 5px;">📅 ${dateDisplay}</p>
                    <p style="color:#666;font-size:13px;margin:0 0 25px;">Admin hasn't set today's challenge yet.</p>
                    <button onclick="loadPage('home')" class="btn-secondary">← Back to Home</button>
                </div>
            `;
            return;
        }
        
        const song = data.song;
        
        // Get user's attempt state
        const attemptsKey = 'sotd_attempts_' + STATE.agentNo + '_' + todayStr;
        const correctKey = 'sotd_correct_' + STATE.agentNo + '_' + todayStr;
        
        let attempts = parseInt(localStorage.getItem(attemptsKey) || '0');
        let wasCorrect = localStorage.getItem(correctKey) === 'true';
        
        // Sync with server if available
        if (data.userAttempts !== undefined) {
            attempts = data.userAttempts;
            localStorage.setItem(attemptsKey, String(attempts));
        }
        if (data.userCorrect !== undefined) {
            wasCorrect = data.userCorrect;
            localStorage.setItem(correctKey, wasCorrect ? 'true' : 'false');
        }
        
        const maxAttempts = 2;
        const remaining = Math.max(0, maxAttempts - attempts);
        const canAnswer = !wasCorrect && attempts < maxAttempts;
        
        // Build the page
        container.innerHTML = `
            <!-- Header -->
            <div class="card" style="background:linear-gradient(135deg, #ff000015, #ff000008);border-color:#ff000033;margin-bottom:16px;">
                <div class="card-body" style="text-align:center;padding:25px;">
                    <div style="font-size:50px;margin-bottom:12px;">🎬</div>
                    <h2 style="color:#fff;margin:0 0 8px;font-size:20px;">Song of the Day</h2>
                    <div style="
                        display:inline-block;
                        padding:8px 18px;
                        background:rgba(255,255,255,0.1);
                        border:1px solid rgba(255,255,255,0.2);
                        border-radius:20px;
                        margin-bottom:8px;
                    ">
                        <span style="color:#fff;font-size:13px;">📅 ${dateDisplay}</span>
                    </div>
                    <p style="color:#888;font-size:12px;margin:0;">Guess the BTS song from the hint!</p>
                </div>
            </div>
            
            <!-- Hint -->
            <div class="card" style="margin-bottom:16px;">
                <div class="card-header">
                    <h3 style="margin:0;">💡 Today's Hint</h3>
                </div>
                <div class="card-body" style="text-align:center;padding:25px;">
                    <div style="
                        font-size:18px;
                        color:#ffd700;
                        font-style:italic;
                        padding:18px;
                        background:rgba(255,215,0,0.08);
                        border:1px dashed rgba(255,215,0,0.3);
                        border-radius:12px;
                        line-height:1.6;
                    ">"${sanitize(song.hint || 'Listen carefully...')}"</div>
                    <div style="
                        margin-top:15px;
                        padding:10px 20px;
                        background:rgba(0,255,136,0.1);
                        border-radius:20px;
                        display:inline-block;
                    ">
                        <span style="color:#00ff88;font-size:14px;font-weight:600;">🎁 +${song.xpReward || 1} XP Reward</span>
                    </div>
                </div>
            </div>
            
            <!-- Answer Section -->
            <div class="card" style="border-color:${!canAnswer ? (wasCorrect ? '#00ff88' : '#ff4444') : '#7b2cbf'};">
                <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
                    <h3 style="margin:0;">${canAnswer ? '🔗 Submit Answer' : '📋 Result'}</h3>
                    ${canAnswer ? `
                        <span style="
                            padding:5px 12px;
                            background:${remaining === 1 ? 'rgba(255,165,0,0.15)' : 'rgba(0,255,136,0.1)'};
                            border:1px solid ${remaining === 1 ? 'rgba(255,165,0,0.4)' : 'rgba(0,255,136,0.3)'};
                            border-radius:15px;
                            color:${remaining === 1 ? '#ffa500' : '#00ff88'};
                            font-size:11px;
                            font-weight:600;
                        ">🎯 ${remaining} ${remaining === 1 ? 'Chance' : 'Chances'} Left</span>
                    ` : ''}
                </div>
                <div class="card-body" style="padding:25px;">
                    ${canAnswer ? `
                        <!-- Input Form -->
                        ${attempts === 1 ? `
                            <div style="
                                padding:12px;
                                background:rgba(255,165,0,0.1);
                                border:1px solid rgba(255,165,0,0.3);
                                border-radius:10px;
                                margin-bottom:15px;
                                display:flex;
                                align-items:center;
                                gap:10px;
                            ">
                                <span style="font-size:20px;">⚠️</span>
                                <div>
                                    <div style="color:#ffa500;font-size:13px;font-weight:600;">Last Chance!</div>
                                    <div style="color:#888;font-size:11px;">Your first guess was wrong.</div>
                                </div>
                            </div>
                        ` : ''}
                        
                        <label style="color:#888;font-size:12px;display:block;margin-bottom:8px;">
                            Paste the YouTube link of the song:
                        </label>
                        <input 
                            type="text" 
                            id="sotd-answer-input" 
                            placeholder="https://youtube.com/watch?v=..."
                            autocomplete="off"
                            style="
                                width:100%;
                                box-sizing:border-box;
                                background:#1a1a2e;
                                border:1px solid #444;
                                border-radius:10px;
                                padding:14px;
                                color:#fff;
                                font-size:14px;
                                margin-bottom:15px;
                            "
                        >
                        
                        <button 
                            id="sotd-submit-btn"
                            onclick="submitSOTDAnswer()"
                            style="
                                width:100%;
                                padding:14px;
                                background:linear-gradient(135deg, #ff0000, #cc0000);
                                border:none;
                                border-radius:10px;
                                color:#fff;
                                font-size:15px;
                                font-weight:bold;
                                cursor:pointer;
                            "
                        >▶️ Submit Answer</button>
                        
                        <div style="margin-top:12px;text-align:center;color:#666;font-size:11px;">
                            Accepted: youtube.com/watch?v=... or youtu.be/...
                        </div>
                    ` : `
                        <!-- Result Display -->
                        <div style="text-align:center;">
                            <div style="font-size:60px;margin-bottom:15px;">${wasCorrect ? '🎉' : '😔'}</div>
                            <div style="
                                color:${wasCorrect ? '#00ff88' : '#ff6b6b'};
                                font-size:22px;
                                font-weight:bold;
                                margin-bottom:10px;
                            ">${wasCorrect ? 'Correct! +' + (song.xpReward || 1) + ' XP' : 'Out of Attempts'}</div>
                            <p style="color:#888;font-size:13px;margin:0 0 20px;">
                                ${wasCorrect ? 'Great job! 💜' : 'Better luck tomorrow!'}
                            </p>
                            
                            ${song.title ? `
                                <div style="
                                    padding:15px;
                                    background:rgba(123,44,191,0.1);
                                    border:1px solid rgba(123,44,191,0.3);
                                    border-radius:12px;
                                    margin-bottom:15px;
                                ">
                                    <div style="color:#fff;font-size:16px;font-weight:600;">🎵 ${sanitize(song.title)}</div>
                                    ${song.artist ? `<div style="color:#888;font-size:12px;margin-top:5px;">${sanitize(song.artist)}</div>` : ''}
                                </div>
                            ` : ''}
                            
                            ${song.youtubeId ? `
                                <a href="https://youtube.com/watch?v=${song.youtubeId}" 
                                   target="_blank" 
                                   style="
                                       display:inline-flex;
                                       align-items:center;
                                       gap:8px;
                                       padding:12px 24px;
                                       background:linear-gradient(135deg, #ff0000, #cc0000);
                                       color:#fff;
                                       border-radius:25px;
                                       text-decoration:none;
                                       font-size:14px;
                                       font-weight:600;
                                   ">▶️ Watch on YouTube</a>
                            ` : ''}
                            
                            <p style="color:#666;font-size:11px;margin-top:20px;">⏰ New challenge at midnight!</p>
                        </div>
                    `}
                </div>
            </div>
            
            <!-- Back Button -->
            <button onclick="loadPage('home')" class="btn-secondary" style="width:100%;margin-top:16px;padding:14px;">
                ← Back to Home
            </button>
            
            ${STATE.isAdmin ? `
                <div class="card" style="margin-top:16px;border-color:#ffd700;">
                    <div class="card-header" style="background:rgba(255,215,0,0.05);">
                        <h3 style="margin:0;color:#ffd700;">👑 Admin</h3>
                    </div>
                    <div class="card-body">
                        <button onclick="setTodaysSong()" style="
                            width:100%;
                            padding:12px;
                            background:linear-gradient(135deg, #ffd700, #ff8c00);
                            border:none;
                            border-radius:8px;
                            color:#000;
                            font-weight:bold;
                            cursor:pointer;
                            margin-bottom:8px;
                        ">🎵 Set Today's Song</button>
                        <button onclick="resetSOTDProgress()" class="btn-secondary" style="width:100%;padding:10px;font-size:12px;">
                            🔄 Reset My Progress (Debug)
                        </button>
                    </div>
                </div>
            ` : ''}
        `;
        
        // Setup enter key
        if (canAnswer) {
            setTimeout(() => {
                const input = document.getElementById('sotd-answer-input');
                if (input) {
                    input.focus();
                    input.onkeypress = (e) => {
                        if (e.key === 'Enter') submitSOTDAnswer();
                    };
                }
            }, 100);
        }
        
        // Clear notification dot
        const dot = document.getElementById('dot-sotd');
        if (dot) dot.classList.remove('active');
        
    } catch (e) {
        console.error('❌ SOTD Error:', e);
        container.innerHTML = `
            <div class="card" style="text-align:center;padding:50px 20px;">
                <div style="font-size:50px;margin-bottom:15px;">❌</div>
                <h3 style="color:#ff6b6b;margin:0 0 10px;">Failed to Load</h3>
                <p style="color:#888;margin:0 0 20px;">${sanitize(e.message)}</p>
                <button onclick="renderSOTD()" class="btn-primary" style="margin-right:10px;">🔄 Retry</button>
                <button onclick="loadPage('home')" class="btn-secondary">← Home</button>
            </div>
        `;
    }
}

// ==================== SUBMIT SOTD ANSWER ====================
async function submitSOTDAnswer() {
    const input = document.getElementById('sotd-answer-input');
    const btn = document.getElementById('sotd-submit-btn');
    
    if (!input) return;
    
    const answer = input.value.trim();
    if (!answer) {
        showToast('Please paste a YouTube link!', 'error');
        input.focus();
        return;
    }
    
    const today = new Date().toDateString();
    const attemptsKey = 'sotd_attempts_' + STATE.agentNo + '_' + today;
    const correctKey = 'sotd_correct_' + STATE.agentNo + '_' + today;
    
    // Check if already done
    if (localStorage.getItem(correctKey) === 'true') {
        showToast('Already answered correctly!', 'info');
        renderSOTD();
        return;
    }
    
    const currentAttempts = parseInt(localStorage.getItem(attemptsKey) || '0');
    if (currentAttempts >= 2) {
        showToast('No more attempts today!', 'error');
        renderSOTD();
        return;
    }
    
    // Disable button
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '⏳ Checking...';
        btn.style.opacity = '0.6';
    }
    
    try {
        const result = await api('submitSongAnswer', {
            agentNo: STATE.agentNo,
            answer: answer
        });
        
        console.log('🎬 Submit result:', result);
        
        // Increment attempts
        const newAttempts = currentAttempts + 1;
        localStorage.setItem(attemptsKey, String(newAttempts));
        
        if (result.correct) {
            localStorage.setItem(correctKey, 'true');
            showToast('🎉 Correct! +' + (result.xpAwarded || 1) + ' XP!', 'success');
            if (typeof confetti === 'function') {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }
        } else {
            const left = 2 - newAttempts;
            if (left > 0) {
                showToast(`❌ Wrong! ${left} chance left.`, 'error');
            } else {
                showToast('❌ Wrong! No more chances today.', 'error');
            }
        }
        
        setTimeout(() => renderSOTD(), 1000);
        
    } catch (e) {
        console.error('Submit error:', e);
        showToast('Error: ' + e.message, 'error');
        
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '▶️ Submit Answer';
            btn.style.opacity = '1';
        }
    }
}
window.extractYouTubeId = extractYouTubeId;
window.submitSOTDAnswer = submitSOTDAnswer;    

// ==================== RESET SOTD (DEBUG) ====================
function resetSOTDProgress() {
    const today = new Date().toDateString();
    localStorage.removeItem('sotd_attempts_' + STATE.agentNo + '_' + today);
    localStorage.removeItem('sotd_correct_' + STATE.agentNo + '_' + today);
    showToast('Progress reset!', 'success');
    renderSOTD();
}

// ==================== STREAMING TIPS PAGE ====================
async function renderStreamingTips() {
    const page = document.getElementById('page-streaming-tips');
    if (!page) return;

    // 1. Clear existing content to avoid duplicates
    page.innerHTML = '';

    // 2. Build the HTML structure
    page.innerHTML = `
        <div class="page-header">
            <h1>📚 Streaming Protocols</h1>
            <p class="page-subtitle">Official Spotify Guidelines</p>
        </div>
        
        <div id="tips-container" style="display: flex; flex-direction: column; gap: 15px;">
            
            <!-- Tip 1: Album Streaming -->
            <div class="card" style="border-left: 4px solid #9d4edd;">
                <div class="card-body" style="padding: 20px;">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                        <span style="font-size:24px;">💿</span>
                        <h3 style="margin:0; color:#fff; font-size:16px;">Album Streaming</h3>
                    </div>
                    <p style="color:#ccc; font-size:13px; line-height:1.6; margin-bottom:10px;">
                        Top-to-bottom album streaming reflects <strong>genuine listening behavior</strong> and is strongly recommended.
                    </p>
                    <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px;">
                        <span style="color:#a0a0b8; font-size:12px;">💡 If repeating an album, play other songs or playlists in between.</span>
                    </div>
                </div>
            </div>

            <!-- Tip 2: Artist Looping (Warning) -->
            <div class="card" style="border-left: 4px solid #ff4444; background: linear-gradient(135deg, rgba(255,68,68,0.05), rgba(18,18,31,1));">
                <div class="card-body" style="padding: 20px;">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                        <span style="font-size:24px;">⚠️</span>
                        <h3 style="margin:0; color:#ff6b6b; font-size:16px;">Artist Looping Warning</h3>
                    </div>
                    <p style="color:#ccc; font-size:13px; line-height:1.6; margin-bottom:10px;">
                        Playing the same artist continuously can <strong>reduce recommendations</strong> and lead to stream deletions.
                    </p>
                    <p style="color:#fff; font-size:13px; font-weight:600;">
                        Balanced listening protects BTS' long-term performance.
                    </p>
                </div>
            </div>

            <!-- Tip 3: Reusing Playlists -->
            <div class="card" style="border-left: 4px solid #00d4ff;">
                <div class="card-body" style="padding: 20px;">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                        <span style="font-size:24px;">🔄</span>
                        <h3 style="margin:0; color:#00d4ff; font-size:16px;">Reusing Playlists?</h3>
                    </div>
                    <p style="color:#ccc; font-size:13px; line-height:1.6;">
                        You <strong>can reuse playlists</strong> on different days or even the same day.
                    </p>
                    <p style="color:#a0a0b8; font-size:12px; margin-top:8px;">
                        Just avoid constant repetition and switch between albums and other playlists frequently.
                    </p>
                </div>
            </div>

            <!-- Tip 4: Night Streaming -->
            <div class="card" style="border-left: 4px solid #7b2cbf;">
                <div class="card-body" style="padding: 20px;">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                        <span style="font-size:24px;">🌙</span>
                        <h3 style="margin:0; color:#e0aaff; font-size:16px;">Night Streaming Strategy</h3>
                    </div>
                    <p style="color:#ccc; font-size:13px; line-height:1.6; margin-bottom:10px;">
                        Long playlists are fine at night. If you can't interact for 2-3 hours, <strong>queue 2-3 shorter playlists</strong> instead.
                    </p>
                    <div style="background:rgba(123,44,191,0.2); padding:8px 12px; border-radius:20px; display:inline-block;">
                        <span style="color:#fff; font-size:11px; font-weight:bold;">🚫 Turn Autoplay OFF</span>
                    </div>
                    <span style="color:#888; font-size:11px; margin-left:8px;">to avoid random playback.</span>
                </div>
            </div>

            <!-- Tip 5: Volume -->
            <div class="card" style="border-left: 4px solid #00ff88;">
                <div class="card-body" style="padding: 20px;">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                        <span style="font-size:24px;">🔊</span>
                        <h3 style="margin:0; color:#00ff88; font-size:16px;">Spotify Volume Matters</h3>
                    </div>
                    <p style="color:#ccc; font-size:13px; line-height:1.6; margin-bottom:10px;">
                        Streams should be played at an audible volume. It is recommended to keep Spotify volume at <strong>50% or higher</strong>.
                    </p>
                    <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:10px; margin-top:10px;">
                        <span style="color:#ff6b6b; font-size:11px;">
                            ❌ Muted playback or extremely low volume may be treated as low-quality streams and filtered.
                        </span>
                    </div>
                </div>
            </div>

        </div>
        
        <div style="text-align:center; margin-top:30px; margin-bottom:20px;">
            <button onclick="loadPage('home')" class="btn-primary" style="width:100%;">
                ✅ I Understand
            </button>
        </div>
    `;

    console.log('📚 Streaming Tips page loaded');
}
// ==================== SUBMIT SONG ANSWER (2 CHANCES - FIXED) ====================
async function submitSongAnswer() {
    const input = $('youtube-answer');
    const btn = $('submit-song-btn');
    
    if (!input) {
        console.error('❌ youtube-answer input not found');
        return;
    }
    
    const answer = input.value.trim();
    
    if (!answer) {
        showToast('Please paste a YouTube link!', 'error');
        input.focus();
        return;
    }
    
    // ✅ FIX: Check if agentNo exists
    if (!STATE.agentNo) {
        console.error('❌ STATE.agentNo is missing:', STATE);
        showToast('Session expired. Please refresh the page!', 'error');
        return;
    }
    
    // ✅ DEBUG: Log what we're sending
    console.log('📤 Submitting song answer:', {
        agentNo: STATE.agentNo,
        answer: answer
    });
    
    const today = new Date().toDateString();
    const attemptsKey = 'song_attempts_' + STATE.agentNo + '_' + today;
    const correctKey = 'song_correct_' + STATE.agentNo + '_' + today;
    const maxAttempts = 2;
    
    const currentAttempts = parseInt(localStorage.getItem(attemptsKey) || '0');
    const alreadyCorrect = localStorage.getItem(correctKey) === 'true';
    
    // PRE-CHECK: Already correct?
    if (alreadyCorrect) {
        showToast('You already got it correct today! 🎉', 'info');
        renderSongOfDay();
        return;
    }
    
    // PRE-CHECK: Out of attempts?
    if (currentAttempts >= maxAttempts) {
        showToast('No more chances today! Try tomorrow.', 'error');
        renderSongOfDay();
        return;
    }
    
    // Disable button
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>⏳</span><span>Checking...</span>';
        btn.style.opacity = '0.6';
    }
    
    try {
        // ✅ FIX: Pass BOTH agentNo AND answer to the API
        const result = await api('submitSongAnswer', {
            agentNo: STATE.agentNo,  // ✅ THIS WAS MISSING!
            answer: answer           // ✅ Send full URL, backend extracts ID
        });
        
        console.log('📥 Song answer response:', result);
        
        // Handle error from server
        if (result.error) {
            showToast('Error: ' + result.error, 'error');
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<span>▶️</span><span>Submit Answer</span>';
                btn.style.opacity = '1';
            }
            return;
        }
        
        // Handle already answered from server
        if (result.alreadyAnswered) {
            if (result.attempts !== undefined) {
                localStorage.setItem(attemptsKey, result.attempts.toString());
            }
            if (result.wasCorrect !== undefined) {
                localStorage.setItem(correctKey, result.wasCorrect ? 'true' : 'false');
            }
            showToast(result.wasCorrect ? 'Already answered correctly!' : 'No more chances today!', 'info');
            renderSongOfDay();
            return;
        }
        
        // Increment attempts locally
        const newAttempts = currentAttempts + 1;
        localStorage.setItem(attemptsKey, newAttempts.toString());
        
        if (result.correct) {
            // ✅ CORRECT ANSWER
            localStorage.setItem(correctKey, 'true');
            
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
            
            // Confetti effect
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
            
            showToast('🎉 Correct! +' + (result.xpAwarded || 1) + ' XP!', 'success');
            
        } else {
            // ❌ WRONG ANSWER
            if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
            
            const attemptsLeft = maxAttempts - newAttempts;
            
            if (attemptsLeft > 0) {
                showToast(`❌ Wrong! ${attemptsLeft} chance left!`, 'error');
            } else {
                showToast('❌ Wrong! No more chances today.', 'error');
            }
        }
        
        await renderSongOfDay();
        
    } catch (e) {
        console.error('❌ Submit error:', e);
        
        if (e.name === 'AbortError') {
            showToast('Request timed out. Please try again.', 'error');
        } else {
            showToast('Failed to submit: ' + e.message, 'error');
        }
        
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<span>▶️</span><span>Submit Answer</span>';
            btn.style.opacity = '1';
        }
    }
}

// ==================== HELPER: EXTRACT YOUTUBE ID ====================
function extractYouTubeId(url) {
    if (!url) return null;
    
    // Various YouTube URL patterns
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/ // Just the ID
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    
    return null;
}
// ==================== ANNOUNCEMENTS ====================
async function renderAnnouncements() {
    const container = $('announcements-content');
    if (!container) return;
    
    container.innerHTML = renderGuide('announcements');
    
    try {
        const data = await api('getAnnouncements', { week: STATE.week });
        const list = data.announcements || [];
        
        // Sort by priority and date
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        list.sort((a, b) => {
            const pDiff = (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
            if (pDiff !== 0) return pDiff;
            return new Date(b.created || 0) - new Date(a.created || 0);
        });
        
        container.innerHTML += list.length ? list.map(a => `
            <div class="card announcement ${getPriorityClass(a.priority)}">
                <div class="card-body">
                    <div class="announcement-header">
                        <span class="announcement-date">${a.created ? new Date(a.created).toLocaleDateString() : ''}</span>
                        ${getPriorityBadge(a.priority)}
                    </div>
                    <h3>${sanitize(a.title)}</h3>
                    <p style="white-space:pre-line;">${sanitize(a.message || a.content || '')}</p>
                    ${a.link ? `
                        <a href="${sanitize(a.link)}" target="_blank" class="announcement-link-btn">
                            ${sanitize(a.linkText) || '🔗 Open Link'}
                        </a>
                    ` : ''}
                </div>
            </div>
        `).join('') : `
            <div class="card">
                <div class="card-body" style="text-align:center;padding:40px;">
                    <div style="font-size:48px;margin-bottom:16px;">📢</div>
                    <p style="color:var(--text-dim);">No announcements at this time</p>
                </div>
            </div>
        `;
        
        STATE.lastChecked.announcements = Date.now();
        saveNotificationState();
        
    } catch (e) {
        console.error('Announcements error:', e);
        container.innerHTML += '<div class="card"><div class="card-body"><p class="error-text">Failed to load announcements</p><button onclick="renderAnnouncements()" class="btn-secondary">Retry</button></div></div>';
    }
}
// ==================== PLAYLISTS PAGE ====================

async function renderPlaylists() {
    const container = $('playlists-content');
    if (!container) return;

    // --- 1. THE PLAYLIST MAKER FORM (UI) ---
    const makerPanelHTML = `
        <div class="card" style="border: 1px solid #ffd700; background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(0,0,0,0.2)); margin-bottom: 25px;">
            <div class="card-header" style="cursor: pointer; display:flex; justify-content:space-between; align-items:center;" onclick="document.getElementById('maker-form').style.display = document.getElementById('maker-form').style.display === 'none' ? 'block' : 'none'">
                <div>
                    <h3 style="color: #ffd700; margin:0;">🎵 Playlist Maker Panel</h3>
                    <span style="font-size: 10px; color: #888;">(Click to Expand)</span>
                </div>
                <span style="color:#ffd700;">▼</span>
            </div>
            
            <div id="maker-form" class="card-body" style="display: none; padding-top: 15px;">
                <div style="display: grid; gap: 10px;">
                    <input type="text" id="pl-name" placeholder="Playlist Name (e.g. Focus V1)" class="form-input" style="width: 100%; padding: 12px; background: #0a0a0f; border: 1px solid #333; color: white; border-radius: 8px;">
                    
                    <input type="text" id="pl-url" placeholder="Playlist Link (URL)" class="form-input" style="width: 100%; padding: 12px; background: #0a0a0f; border: 1px solid #333; color: white; border-radius: 8px;">
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <select id="pl-platform" style="padding: 12px; background: #0a0a0f; border: 1px solid #333; color: white; border-radius: 8px;">
                            <option value="Spotify">Spotify</option>
                            <option value="Apple Music">Apple Music</option>
                            <option value="YouTube">YouTube</option>
                        </select>
                        
                        <select id="pl-team" style="padding: 12px; background: #0a0a0f; border: 1px solid #333; color: white; border-radius: 8px;">
                            <option value="All">All Teams</option>
                            <option value="Team Indigo">Team Indigo</option>
                            <option value="Team Echo">Team Echo</option>
                            <option value="Team Agust D">Team Agust D</option>
                            <option value="Team JITB">Team JITB</option>
                        </select>
                    </div>

                    <input type="password" id="pl-password" placeholder="🔒 Enter Maker Password" class="form-input" style="width: 100%; padding: 12px; background: #1a0505; border: 1px solid #ff4444; color: white; border-radius: 8px;">
                    
                    <button onclick="submitNewPlaylist()" class="btn-primary" style="width: 100%; background: #ffd700; color: #000; font-weight: bold; padding: 12px; border:none; border-radius:8px; cursor:pointer;">
                        + Publish Playlist
                    </button>
                </div>
            </div>
        </div>
    `;

    // --- 2. EXISTING CONTENT + LIST CONTAINER ---
    container.innerHTML = `
        ${renderGuide('playlists')}
        ${makerPanelHTML}
        
        <!-- Existing Request System -->
        <div class="card" style="background: linear-gradient(135deg, rgba(0, 255, 136, 0.08), rgba(123, 44, 191, 0.05)); border: 1px solid rgba(0, 255, 136, 0.3); margin-bottom: 20px;">
            <div class="card-header"><h3 style="margin:0;">📝 Request a Playlist</h3></div>
            <div class="card-body" style="padding: 20px; text-align: center;">
                <p style="font-size: 12px; color: #aaa; margin-bottom: 15px;">Not a maker? Request one here!</p>
                <a href="https://forms.gle/hwHMSDxVjNhcLh1U6" target="_blank" class="btn-secondary" style="display:inline-block; padding:10px 20px; text-align:center;">Open Request Form</a>
            </div>
        </div>

        <!-- Official Playlists List -->
        <div class="card">
            <div class="card-header"><h3>🎵 Official Playlists</h3></div>
            <div class="card-body">
                <div id="playlists-list" style="display:flex; flex-direction:column; gap:10px;">
                    <div class="loading-text" style="text-align:center; padding:20px; color:#888;">⏳ Loading...</div>
                </div>
            </div>
        </div>
    `;

    // --- 3. FETCH AND RENDER LIST ---
    try {
        const data = await api('getPlaylists');
        const playlists = data.playlists || [];
        const listEl = $('playlists-list');
        
        if (playlists.length) {
            // Sort: Newest first
            playlists.reverse(); 
            
            listEl.innerHTML = playlists.map(pl => {
                // Ensure we use the correct property names from your backend/excel
                // Excel: Name, Link, Platform, Type, Team
                const link = pl.link || pl.url || '#'; 
                const name = pl.name || 'Untitled Playlist';
                const platform = pl.platform || 'Spotify';
                const team = pl.team || 'All';
                const type = pl.type || 'Playlist';

                return `
                <div class="playlist-card" style="background: linear-gradient(135deg, #1a1a2e, #16213e); border: 1px solid rgba(123, 44, 191, 0.3); border-radius: 12px; padding: 15px;">
                    <a href="${sanitize(link)}" target="_blank" style="display: flex; align-items: center; gap: 15px; text-decoration: none; color: inherit;">
                        <span style="font-size: 24px;">${getPlaylistIcon(platform)}</span>
                        <div style="flex: 1;">
                            <div style="color: #fff; font-size: 14px; font-weight: 600;">${sanitize(name)}</div>
                            <div style="color: #888; font-size: 11px; margin-top: 3px;">
                                ${sanitize(platform)} • ${sanitize(type)} • <span style="color:${teamColor(team)}">${sanitize(team)}</span>
                            </div>
                        </div>
                        <span style="color: #7b2cbf; font-size: 18px;">→</span>
                    </a>
                </div>
            `}).join('');
        } else {
            listEl.innerHTML = `<div style="text-align:center; padding:20px; color:#888;">No playlists found.</div>`;
        }
        
        // Update notification state
        if (typeof STATE !== 'undefined' && STATE.lastChecked) {
            STATE.lastChecked.playlists = playlists.length;
            if (typeof saveNotificationState === 'function') saveNotificationState();
        }

    } catch (e) {
        console.error(e);
        const listEl = $('playlists-list');
        if (listEl) listEl.innerHTML = `<p style="color:red; text-align:center;">Failed to load playlists.</p>`;
    }
}
// ==================== SUBMIT NEW PLAYLIST LOGIC ====================

async function submitNewPlaylist() {
    const nameInput = document.getElementById('pl-name');
    const urlInput = document.getElementById('pl-url');
    const platformInput = document.getElementById('pl-platform');
    const teamInput = document.getElementById('pl-team');
    const passwordInput = document.getElementById('pl-password');
    
    if (!nameInput || !urlInput || !passwordInput) return;

    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    const platform = platformInput.value;
    const team = teamInput.value;
    const password = passwordInput.value.trim();
    
    // 1. Validation
    if (!name || !url || !password) {
        showToast('❌ Please fill all fields (Name, Link, Password)', 'error');
        return;
    }

    // 2. Loading State
    loading(true);

    try {
        // 3. Send POST Request using fetch (API usually defaults to GET)
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'addPlaylist',
                password: password, // The secret password defined in GAS Config
                name: name,
                url: url,
                platform: platform,
                type: 'Playlist',
                team: team,
                targetWeek: STATE.week || 'Week 1',
                agentNo: STATE.agentNo || 'Unknown' // Tracks who added it
            })
        });

        const result = await response.json();

        if (result.success) {
            showToast('✅ Playlist Added Successfully!', 'success');
            
            // Clear Form
            nameInput.value = '';
            urlInput.value = '';
            passwordInput.value = '';
            
            // Hide Form
            const form = document.getElementById('maker-form');
            if (form) form.style.display = 'none';
            
            // Refresh List immediately to show new item
            renderPlaylists();
        } else {
            showToast('❌ ' + (result.error || 'Failed to add'), 'error');
        }

    } catch (e) {
        console.error(e);
        showToast('❌ Network Error', 'error');
    } finally {
        loading(false);
    }
}
// ==================== GC LINKS ====================
async function renderGCLinks() {
    const container = $('gc-links-content');
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
                <p style="color:#888;font-size:13px;">💜 Don't worry if you're not added yet!<br>Just follow the goals displayed and we will add you soon.</p>
            </div>
        </div>
    `;
    
    try {
        const data = await api('getGCLinks');
        const links = data.links || {};
        if (links.team && links.team[team]) $('gc-team-link').href = links.team[team];
        if (links.playlist) $('gc-pl-link').href = links.playlist;
        if (links.main) $('gc-main-link').href = links.main;
    } catch (e) { 
        console.log('Could not load GC links'); 
    }
}

// ==================== HELPER ROLES ====================
async function renderHelperRoles() {
    const container = $('helper-roles-content');
    if (!container) return;
    
    container.innerHTML = `
        ${renderGuide('helper-roles')}
        <div class="card">
            <div class="card-header">
                <h3>🎖️ Helper Army Roles</h3>
                <span style="font-size:12px;color:#888;">Help HQ run the mission!</span>
            </div>
            <div class="card-body" id="roles-list"><div class="loading-text">Loading roles...</div></div>
        </div>
        <div class="card" style="background:linear-gradient(135deg, rgba(123,44,191,0.1), rgba(255,215,0,0.05));border-color:#7b2cbf;">
            <div class="card-body" style="text-align:center;padding:30px;">
                <div style="font-size:40px;margin-bottom:15px;">🚀</div>
                <h4 style="color:#fff;margin-bottom:10px;">Want to Join the Helper Army?</h4>
                <p style="color:#888;font-size:13px;">Contact Admin through Instagram or Secret Comms.<br>More roles will be released depending on the need!</p>
            </div>
        </div>
    `;
    
    try {
        const data = await api('getHelperRoles');
        const roles = data.roles || CONFIG.HELPER_ROLES || [];
        const rolesListEl = $('roles-list');
        
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
                                            👤 ${sanitize(typeof agent === 'string' ? agent : agent.name)}
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
        console.error('Helper roles error:', e);
        $('roles-list').innerHTML = '<p style="color:red;">Failed to load roles</p>'; 
    }
}
// ============================================
// GUIDE PAGE - MOBILE OPTIMIZED, NO HORIZONTAL SCROLL
// ============================================

async function renderGuidePage() {
    const getEl = (id) => document.getElementById(id);
    
    let page = getEl('page-guide');
    
    if (!page) {
        const mainContent = document.querySelector('.pages-wrapper') || 
                           document.querySelector('main') ||
                           document.querySelector('.main-content') ||
                           document.body;
        
        if (!mainContent) {
            console.error('No main content container found');
            return;
        }
        
        page = document.createElement('section');
        page.id = 'page-guide';
        page.className = 'page';
        mainContent.appendChild(page);
    }
    
    let container = getEl('guide-content');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'guide-content';
        page.appendChild(container);
    }
    
    if (!container) {
        console.error('Failed to create guide container');
        return;
    }
    
    // ✅ FIXED: Don't use inline styles - let CSS handle visibility
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.style.display = '';
    });
    
    page.classList.add('active');
    
    const myTeam = (typeof STATE !== 'undefined' && STATE?.data?.profile?.team) 
        ? STATE.data.profile.team 
        : 'Your Team';
    
    const teamAlbum = (typeof CONFIG !== 'undefined' && CONFIG?.TEAMS?.[myTeam]?.album)
        ? CONFIG.TEAMS[myTeam].album
        : 'Team Album';
    
    const safeSanitize = (str) => {
        if (typeof sanitize === 'function') return sanitize(str);
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };
    
    const albumChallengeName = (typeof CONFIG !== 'undefined' && CONFIG?.ALBUM_CHALLENGE?.CHALLENGE_NAME)
        ? CONFIG.ALBUM_CHALLENGE.CHALLENGE_NAME
        : 'Album';
    
    const requiredStreams = (typeof CONFIG !== 'undefined' && CONFIG?.ALBUM_CHALLENGE?.REQUIRED_STREAMS)
        ? CONFIG.ALBUM_CHALLENGE.REQUIRED_STREAMS
        : 3;

    container.innerHTML = `
        <style>
            /* ===== CRITICAL: PREVENT ALL HORIZONTAL SCROLL ===== */
            html, body {
                overflow-x: hidden !important;
                max-width: 100vw !important;
            }
            
            .main-content,
            .pages-wrapper,
            #page-guide {
                overflow-x: hidden !important;
                max-width: 100% !important;
            }
            
            /* ===== GUIDE CONTENT CONTAINER ===== */
            #guide-content {
                width: 100% !important;
                max-width: 100% !important;
                overflow-x: hidden !important;
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
                -webkit-text-size-adjust: 100%;
            }

            #guide-content .guide-page {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 12px !important;
                padding-bottom: 120px !important;
                overflow-x: hidden !important;
                box-sizing: border-box !important;
            }

            #guide-content .guide-page * {
                box-sizing: border-box !important;
                max-width: 100% !important;
                -webkit-tap-highlight-color: transparent;
            }

            /* ===== HEADER ===== */
            #guide-content .guide-header {
                width: 100% !important;
                text-align: left;
                padding: 16px 14px;
                background: linear-gradient(135deg, #7b2cbf, #5a1f99);
                border-radius: 12px;
                margin-bottom: 12px;
                position: relative;
                overflow: hidden;
                box-sizing: border-box !important;
            }

            #guide-content .guide-header::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
                animation: guideShimmer 3s ease-in-out infinite;
                pointer-events: none;
            }

            @keyframes guideShimmer {
                0%, 100% { transform: translate(-10%, -10%); }
                50% { transform: translate(10%, 10%); }
            }

            #guide-content .guide-header h1 {
                color: #fff;
                font-size: 18px;
                margin: 0 0 4px 0;
                position: relative;
                line-height: 1.3;
            }

            #guide-content .guide-header p {
                color: rgba(255,255,255,0.8);
                font-size: 13px;
                margin: 0;
                position: relative;
                line-height: 1.4;
            }

            /* ===== NAVIGATION - HORIZONTAL SCROLL ===== */
            #guide-content .guide-nav {
                width: 100% !important;
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
                padding: 10px;
                background: rgba(123,44,191,0.1);
                border-radius: 12px;
                border: 1px solid rgba(123,44,191,0.2);
                overflow-x: auto;
                overflow-y: hidden;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
                -ms-overflow-style: none;
                box-sizing: border-box !important;
            }

            #guide-content .guide-nav::-webkit-scrollbar {
                display: none;
            }

            #guide-content .guide-nav-btn {
                flex: 0 0 auto;
                padding: 10px 16px;
                min-height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 20px;
                color: #aaa;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                white-space: nowrap;
                touch-action: manipulation;
            }

            #guide-content .guide-nav-btn:active,
            #guide-content .guide-nav-btn.active {
                background: linear-gradient(135deg, #7b2cbf, #5a1f99);
                color: #fff;
                border-color: #7b2cbf;
            }

            /* ===== SECTIONS ===== */
            #guide-content .guide-section {
                width: 100% !important;
                background: linear-gradient(145deg, #1a1a2e, #0f0f1f);
                border-radius: 12px;
                border: 1px solid rgba(123,44,191,0.2);
                margin-bottom: 10px;
                overflow: hidden;
                box-sizing: border-box !important;
            }

            #guide-content .guide-section-header {
                width: 100% !important;
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 14px;
                min-height: 56px;
                background: rgba(123,44,191,0.1);
                cursor: pointer;
                transition: background 0.2s;
                user-select: none;
                touch-action: manipulation;
                -webkit-user-select: none;
                box-sizing: border-box !important;
            }

            #guide-content .guide-section-header:active {
                background: rgba(123,44,191,0.25);
            }

            #guide-content .guide-section-icon {
                font-size: 20px;
                flex-shrink: 0;
            }

            #guide-content .guide-section-title {
                flex: 1;
                color: #fff;
                font-size: 15px;
                font-weight: 600;
                line-height: 1.3;
                word-wrap: break-word;
                overflow-wrap: break-word;
            }

            #guide-content .guide-section-toggle {
                color: #7b2cbf;
                font-size: 14px;
                transition: transform 0.3s ease;
                flex-shrink: 0;
            }

            #guide-content .guide-section.open .guide-section-toggle {
                transform: rotate(180deg);
            }

            #guide-content .guide-section-content {
                width: 100% !important;
                padding: 0;
                max-height: 0;
                overflow: hidden;
                transition: all 0.35s ease;
                box-sizing: border-box !important;
            }

            #guide-content .guide-section.open .guide-section-content {
                padding: 16px;
                max-height: 5000px;
            }

            /* ===== TEXT ===== */
            #guide-content .guide-text {
                color: #ccc;
                font-size: 14px;
                line-height: 1.7;
                margin-bottom: 14px;
                word-wrap: break-word;
                overflow-wrap: break-word;
            }

            #guide-content .guide-text:last-child {
                margin-bottom: 0;
            }

            /* ===== HIGHLIGHT/WARNING/SUCCESS BOXES ===== */
            #guide-content .guide-highlight,
            #guide-content .guide-warning,
            #guide-content .guide-success {
                width: 100% !important;
                padding: 14px;
                border-radius: 0 12px 12px 0;
                margin: 14px 0;
                box-sizing: border-box !important;
            }

            #guide-content .guide-highlight {
                background: rgba(255,215,0,0.08);
                border-left: 4px solid #ffd700;
            }

            #guide-content .guide-highlight-title {
                color: #ffd700;
                font-weight: 600;
                font-size: 13px;
                margin-bottom: 8px;
            }

            #guide-content .guide-highlight-content {
                color: #fff;
                font-size: 13px;
                line-height: 1.8;
                word-wrap: break-word;
                overflow-wrap: break-word;
            }

            #guide-content .guide-warning {
                background: rgba(255,68,68,0.08);
                border-left: 4px solid #ff4444;
            }

            #guide-content .guide-warning-title {
                color: #ff6b6b;
                font-weight: 600;
                font-size: 13px;
                margin-bottom: 8px;
            }

            #guide-content .guide-warning-content {
                color: #fff;
                font-size: 13px;
                line-height: 1.8;
                word-wrap: break-word;
                overflow-wrap: break-word;
            }

            #guide-content .guide-success {
                background: rgba(0,255,136,0.08);
                border-left: 4px solid #00ff88;
            }

            #guide-content .guide-success-title {
                color: #00ff88;
                font-weight: 600;
                font-size: 13px;
                margin-bottom: 8px;
            }

            #guide-content .guide-success-content {
                color: #fff;
                font-size: 13px;
                line-height: 1.8;
                word-wrap: break-word;
                overflow-wrap: break-word;
            }

            /* ===== LISTS ===== */
            #guide-content .guide-list,
            #guide-content .guide-numbered-list {
                width: 100% !important;
                list-style: none;
                padding: 0;
                margin: 14px 0;
                box-sizing: border-box !important;
            }

            #guide-content .guide-list li,
            #guide-content .guide-numbered-list li {
                width: 100% !important;
                color: #ccc;
                font-size: 13px;
                padding: 12px;
                background: rgba(255,255,255,0.03);
                border-radius: 10px;
                margin-bottom: 8px;
                display: flex;
                align-items: flex-start;
                gap: 12px;
                line-height: 1.6;
                word-wrap: break-word;
                overflow-wrap: break-word;
                box-sizing: border-box !important;
            }

            #guide-content .guide-list li::before {
                content: '→';
                color: #7b2cbf;
                font-weight: bold;
                flex-shrink: 0;
            }

            #guide-content .guide-numbered-list {
                counter-reset: guide-counter;
            }

            #guide-content .guide-numbered-list li {
                counter-increment: guide-counter;
            }

            #guide-content .guide-numbered-list li::before {
                content: counter(guide-counter);
                background: linear-gradient(135deg, #7b2cbf, #5a1f99);
                color: #fff;
                width: 24px;
                height: 24px;
                min-width: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: bold;
                flex-shrink: 0;
            }

            /* ===== TEAMS GRID ===== */
            #guide-content .guide-teams-grid {
                width: 100% !important;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin: 14px 0;
                box-sizing: border-box !important;
            }

            #guide-content .guide-team-card {
                width: 100% !important;
                padding: 14px 12px;
                border-radius: 12px;
                text-align: left;
                border: 2px solid;
                box-sizing: border-box !important;
            }

            #guide-content .guide-team-card.indigo {
                background: rgba(75,0,130,0.15);
                border-color: rgba(75,0,130,0.4);
            }

            #guide-content .guide-team-card.echo {
                background: rgba(0,191,255,0.15);
                border-color: rgba(0,191,255,0.4);
            }

            #guide-content .guide-team-card.agustd {
                background: rgba(220,20,60,0.15);
                border-color: rgba(220,20,60,0.4);
            }

            #guide-content .guide-team-card.jitb {
                background: rgba(50,205,50,0.15);
                border-color: rgba(50,205,50,0.4);
            }

            #guide-content .guide-team-name {
                color: #fff;
                font-weight: bold;
                font-size: 12px;
                line-height: 1.3;
            }

            #guide-content .guide-team-album {
                color: #aaa;
                font-size: 11px;
                margin-top: 4px;
            }

            /* ===== GC GRID ===== */
            #guide-content .guide-gc-grid {
                width: 100% !important;
                display: grid;
                gap: 8px;
                margin: 14px 0;
                box-sizing: border-box !important;
            }

            #guide-content .guide-gc-item {
                width: 100% !important;
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 14px 12px;
                background: rgba(255,255,255,0.03);
                border-radius: 10px;
                box-sizing: border-box !important;
            }

            #guide-content .guide-gc-icon {
                font-size: 20px;
                flex-shrink: 0;
            }

            #guide-content .guide-gc-info {
                flex: 1;
                min-width: 0;
            }

            #guide-content .guide-gc-name {
                color: #fff;
                font-weight: 600;
                font-size: 13px;
            }

            #guide-content .guide-gc-desc {
                color: #888;
                font-size: 11px;
                margin-top: 2px;
            }

            /* ===== STEPS ===== */
            #guide-content .guide-steps {
                width: 100% !important;
                margin: 14px 0;
                box-sizing: border-box !important;
            }

            #guide-content .guide-step {
                width: 100% !important;
                display: flex;
                gap: 12px;
                padding: 12px 0;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                box-sizing: border-box !important;
            }

            #guide-content .guide-step:last-child {
                border-bottom: none;
            }

            #guide-content .guide-step-num {
                width: 28px;
                height: 28px;
                min-width: 28px;
                background: linear-gradient(135deg, #7b2cbf, #5a1f99);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-weight: bold;
                font-size: 12px;
                flex-shrink: 0;
            }

            #guide-content .guide-step-content {
                flex: 1;
                min-width: 0;
            }

            #guide-content .guide-step-title {
                color: #fff;
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 4px;
            }

            #guide-content .guide-step-desc {
                color: #888;
                font-size: 12px;
                line-height: 1.5;
                word-wrap: break-word;
                overflow-wrap: break-word;
            }

            /* ===== CROSS CHECK ===== */
            #guide-content .guide-cross-check {
                width: 100% !important;
                margin: 14px 0;
                box-sizing: border-box !important;
            }

            #guide-content .guide-cross-check-item {
                width: 100% !important;
                display: flex;
                align-items: center;
                padding: 10px 12px;
                background: rgba(255,255,255,0.03);
                border-radius: 10px;
                margin-bottom: 8px;
                gap: 10px;
                box-sizing: border-box !important;
            }

            #guide-content .guide-cross-check-from,
            #guide-content .guide-cross-check-to {
                color: #fff;
                font-size: 12px;
                font-weight: 600;
            }

            #guide-content .guide-cross-check-arrow {
                color: #7b2cbf;
                font-size: 14px;
            }

            /* ===== WATERMARK ===== */
            #guide-content .watermark-example {
                width: 100% !important;
                background: rgba(0,0,0,0.3);
                border-radius: 12px;
                padding: 14px;
                margin: 14px 0;
                border: 2px dashed rgba(123,44,191,0.3);
                box-sizing: border-box !important;
            }

            #guide-content .watermark-preview {
                width: 100% !important;
                background: #1a1a1a;
                border-radius: 10px;
                padding: 24px 12px;
                margin-bottom: 10px;
                position: relative;
                box-sizing: border-box !important;
            }

            #guide-content .watermark-text {
                position: absolute;
                top: 8px;
                right: 8px;
                background: rgba(0,0,0,0.7);
                color: #fff;
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 10px;
                font-weight: bold;
            }

            #guide-content .watermark-preview-label {
                color: #666;
                font-size: 11px;
            }

            #guide-content .watermark-instructions {
                color: #aaa;
                font-size: 11px;
                line-height: 1.5;
            }

            /* ===== DEADLINE ===== */
            #guide-content .guide-deadline-box {
                width: 100% !important;
                margin-top: 14px;
                padding: 12px 14px;
                background: rgba(255,165,0,0.1);
                border: 1px solid rgba(255,165,0,0.3);
                border-radius: 10px;
                box-sizing: border-box !important;
            }

            #guide-content .guide-deadline-title {
                color: #ffa500;
                font-size: 12px;
                font-weight: 600;
                margin-bottom: 4px;
            }

            #guide-content .guide-deadline-desc {
                color: #888;
                font-size: 11px;
            }

            /* ===== FINAL ===== */
            #guide-content .guide-final-content {
                width: 100% !important;
                text-align: left;
                padding: 10px 0;
                box-sizing: border-box !important;
            }

            #guide-content .guide-final-emoji {
                font-size: 36px;
                margin-bottom: 10px;
            }

            /* ===== SECTION SUBTITLE ===== */
            #guide-content .guide-section-subtitle {
                color: #fff;
                font-size: 14px;
                font-weight: 600;
                margin: 14px 0 10px 0;
            }

            /* ===== QUICK LINKS ===== */
            #guide-content .guide-quick-links {
                width: 100% !important;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-top: 20px;
                box-sizing: border-box !important;
            }

            #guide-content .guide-quick-link {
                width: 100% !important;
                padding: 18px 10px;
                min-height: 90px;
                background: linear-gradient(145deg, rgba(123,44,191,0.15), rgba(123,44,191,0.08));
                border-radius: 14px;
                border: 1px solid rgba(123,44,191,0.3);
                text-align: center;
                cursor: pointer;
                transition: all 0.2s ease;
                touch-action: manipulation;
                -webkit-user-select: none;
                user-select: none;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-sizing: border-box !important;
            }

            #guide-content .guide-quick-link:active {
                transform: scale(0.95);
                background: rgba(123,44,191,0.3);
            }

            #guide-content .guide-quick-link-icon {
                font-size: 28px;
                margin-bottom: 8px;
                display: block;
            }

            #guide-content .guide-quick-link-text {
                color: #fff;
                font-size: 13px;
                font-weight: 600;
                display: block;
            }

            /* ===== SAFE AREA FOR NOTCHED PHONES ===== */
            @supports (padding-bottom: env(safe-area-inset-bottom)) {
                #guide-content .guide-page {
                    padding-bottom: calc(120px + env(safe-area-inset-bottom)) !important;
                }
            }

            /* ===== LANDSCAPE MODE ===== */
            @media (orientation: landscape) and (max-height: 500px) {
                #guide-content .guide-header {
                    padding: 12px;
                }
                
                #guide-content .guide-header h1 {
                    font-size: 16px;
                }
                
                #guide-content .guide-quick-links {
                    grid-template-columns: repeat(4, 1fr);
                }
                
                #guide-content .guide-quick-link {
                    min-height: 70px;
                    padding: 12px 8px;
                }
            }

            /* ===== VERY SMALL SCREENS ===== */
            @media (max-width: 350px) {
                #guide-content .guide-page {
                    padding: 10px !important;
                    padding-bottom: 100px !important;
                }
                
                #guide-content .guide-header h1 {
                    font-size: 16px;
                }
                
                #guide-content .guide-nav-btn {
                    padding: 8px 12px;
                    font-size: 11px;
                    min-height: 40px;
                }
                
                #guide-content .guide-teams-grid {
                    grid-template-columns: 1fr;
                }
                
                #guide-content .guide-quick-link {
                    min-height: 80px;
                }
            }
        </style>
        
        <div class="guide-page">
            <div class="guide-header">
                <h1>📚 Agent Training Manual</h1>
                <p>Everything you need to know about BTS Comeback Mission</p>
            </div>
            
            <div class="guide-nav" id="guideNav">
                <button class="guide-nav-btn active" data-section="what-is">Mission</button>
                <button class="guide-nav-btn" data-section="teams">Teams</button>
                <button class="guide-nav-btn" data-section="goals">Goals & XP</button>
                <button class="guide-nav-btn" data-section="streaks">🔥 Streaks</button>
                <button class="guide-nav-btn" data-section="winning">How to Win</button>
                <button class="guide-nav-btn" data-section="rules">Rules</button>
                <button class="guide-nav-btn" data-section="attendance">Attendance</button>
            </div>
            
            <!-- Section 1: What Is This Mission? -->
            <div class="guide-section open" id="guide-what-is">
                <div class="guide-section-header" onclick="toggleGuideSection(this)">
                    <span class="guide-section-icon">🎯</span>
                    <span class="guide-section-title">What Is This Mission?</span>
                    <span class="guide-section-toggle">▼</span>
                </div>
                <div class="guide-section-content">
                    <p class="guide-text">
                        This is a <strong style="color:#ffd700;">weekly streaming mission</strong> designed to prepare us for BTS' comeback. Think of it like a game where your team works together to level up! 🚀
                    </p>
                    
                    <div class="guide-highlight">
                        <div class="guide-highlight-title">💡 Every Week, Your Team Works On:</div>
                        <div class="guide-highlight-content">
                            • <strong>Track Goals</strong> - team combined streams for specific songs<br>
                            • <strong>Album Goals</strong> - team combined streams for albums<br>
                            • <strong>${safeSanitize(albumChallengeName)} Rule</strong> - stream your team album ${requiredStreams}X each<br>
                            • <strong>Secret Missions</strong> - special bonus challenges
                        </div>
                    </div>
                    
                    <p class="guide-text">
                        <strong style="color:#00ff88;">Each week = 1 level for your team.</strong><br>
                        Don't worry about the complexity — we have designated helper roles who will support you anytime! 💜
                    </p>
                    
                    <div class="guide-success">
                        <div class="guide-success-title">✅ It's Super Simple Once You Start!</div>
                        <div class="guide-success-content">
                            Read everything patiently. Don't stress about these instructions - you'll always get help whenever you feel stuck!
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Section 2: The 4 Teams -->
            <div class="guide-section" id="guide-teams">
                <div class="guide-section-header" onclick="toggleGuideSection(this)">
                    <span class="guide-section-icon">👥</span>
                    <span class="guide-section-title">The 4 Teams</span>
                    <span class="guide-section-toggle">▼</span>
                </div>
                <div class="guide-section-content">
                    <p class="guide-text">We have 4 teams, each with their own team album to stream:</p>
                    
                    <div class="guide-teams-grid">
                        <div class="guide-team-card indigo">
                            <div class="guide-team-name">🟣 Team Indigo</div>
                            <div class="guide-team-album">Album: Indigo</div>
                        </div>
                        <div class="guide-team-card echo">
                            <div class="guide-team-name">🔵 Team Echo</div>
                            <div class="guide-team-album">Album: Echo</div>
                        </div>
                        <div class="guide-team-card agustd">
                            <div class="guide-team-name">🔴 Team Agust D</div>
                            <div class="guide-team-album">Album: D-Day</div>
                        </div>
                        <div class="guide-team-card jitb">
                            <div class="guide-team-name">🟢 Team JITB</div>
                            <div class="guide-team-album">Album: Jack in the Box</div>
                        </div>
                    </div>
                    
                    <div class="guide-highlight">
                        <div class="guide-highlight-title">🎧 Your Team: ${safeSanitize(myTeam)}</div>
                        <div class="guide-highlight-content">
                            Your team album is <strong style="color:#ffd700;">${safeSanitize(teamAlbum)}</strong>.<br>
                            You must stream this album <strong>top to bottom, ${requiredStreams} times per week</strong>.
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Section 3: Track Goals, Album Goals & XP -->
            <div class="guide-section" id="guide-goals">
                <div class="guide-section-header" onclick="toggleGuideSection(this)">
                    <span class="guide-section-icon">⭐</span>
                    <span class="guide-section-title">Track Goals, Album Goals & XP</span>
                    <span class="guide-section-toggle">▼</span>
                </div>
                <div class="guide-section-content">
                    <p class="guide-text">
                        All teams have same track and album goals. Goals are <strong style="color:#ffd700;">team-based</strong>, not individual. Everyone's streams are added together!
                    </p>
                    
                    <div class="guide-highlight">
                        <div class="guide-highlight-title">📊 Example: Track Goal</div>
                        <div class="guide-highlight-content">
                            If the goal is <strong>2,000 streams</strong> for "Life Goes On":<br>
                            • Every member's scrobbles for that song are combined<br>
                            • If team total reaches 2,000 → <span style="color:#00ff88;">GOAL PASSED ✓</span><br>
                            • If below 2,000 → <span style="color:#ff6b6b;">GOAL FAILED ✗</span><br><br>
                            <em>Same rule applies to album goals!</em>
                        </div>
                    </div>
                    
                    <div class="guide-section-subtitle">💫 How XP Works</div>
                    
                    <ul class="guide-list">
                        <li><strong style="color:#ffd700;">10 streams</strong> from track/album goals = <strong style="color:#00ff88;">1 XP</strong></li>
                        <li>Example: 200 combined scrobbles = 20 XP</li>
                        <li>All team members' XP is combined = <strong>Total Team XP</strong></li>
                        <li>Think of XP as your power level — just like in games! 🎮</li>
                    </ul>
                </div>
            </div>
            <!-- Section 3.5: Daily Streaks (NEW) -->
            <div class="guide-section" id="guide-streaks">
                <div class="guide-section-header" onclick="toggleGuideSection(this)">
                    <span class="guide-section-icon">🔥</span>
                    <span class="guide-section-title">Daily Streaks & Freezes</span>
                    <span class="guide-section-toggle">▼</span>
                </div>
                <div class="guide-section-content">
                    <p class="guide-text">
                        Consistency is power! Maintain a daily streak to earn exclusive badges and show your dedication.
                    </p>
                    
                    <div class="guide-highlight">
                        <div class="guide-highlight-title">🎯 Daily Requirement: 10 Streams</div>
                        <div class="guide-highlight-content">
                            You must record at least <strong>10 streams</strong> (Tracks or Albums) within 24 hours to keep your streak alive.<br>
                            <span style="font-size:11px;opacity:0.8;">(Resets every night at Midnight)</span>
                        </div>
                    </div>

                    <div class="guide-section-subtitle">🧊 How Freezes Work</div>
                    <p class="guide-text">Life happens! If you miss a day, a <strong>Streak Freeze</strong> automatically activates to save your streak.</p>
                    
                    <ul class="guide-list">
                        <li>You get <strong>2 Freezes</strong> automatically on the 1st of every month.</li>
                        <li>If you have 0 freezes and miss a day, your streak resets to 0. 💔</li>
                        <li>Need more? You can buy a freeze for <strong>20 XP</strong> by clicking the 🧊 icon on the home dashboard.</li>
                    </ul>

                    <div class="guide-section-subtitle">🏆 Streak Milestones</div>
                    <div class="guide-gc-grid">
                        <div class="guide-gc-item">
                            <span class="guide-gc-icon">🌱</span>
                            <div class="guide-gc-info"><div class="guide-gc-name">3 Days</div><div class="guide-gc-desc">Begin Badge</div></div>
                        </div>
                        <div class="guide-gc-item">
                            <span class="guide-gc-icon">🔥</span>
                            <div class="guide-gc-info"><div class="guide-gc-name">7 Days</div><div class="guide-gc-desc">Fire Badge</div></div>
                        </div>
                        <div class="guide-gc-item">
                            <span class="guide-gc-icon">💪</span>
                            <div class="guide-gc-info"><div class="guide-gc-name">21 Days</div><div class="guide-gc-desc">Runner Badge</div></div>
                        </div>
                        <div class="guide-gc-item">
                            <span class="guide-gc-icon">💜</span>
                            <div class="guide-gc-info"><div class="guide-gc-name">100 Days</div><div class="guide-gc-desc">Bulletproof Badge</div></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Section 4: How to Win the Week -->
            <div class="guide-section" id="guide-winning">
                <div class="guide-section-header" onclick="toggleGuideSection(this)">
                    <span class="guide-section-icon">🏆</span>
                    <span class="guide-section-title">How to Win the Week</span>
                    <span class="guide-section-toggle">▼</span>
                </div>
                <div class="guide-section-content">
                    <div class="guide-warning">
                        <div class="guide-warning-title">⚠️ IMPORTANT</div>
                        <div class="guide-warning-content">
                            A team with high XP but incomplete requirements <strong>CANNOT</strong> win!
                        </div>
                    </div>
                    
                    <div class="guide-section-subtitle">✅ To Win, Your Team Must:</div>
                    
                    <ol class="guide-numbered-list">
                        <li><strong style="color:#fff;">Complete Track Goals</strong> - All track streaming goals met</li>
                        <li><strong style="color:#fff;">Complete Album Goals</strong> - All album streaming goals met</li>
                        <li><strong style="color:#fff;">Complete ${safeSanitize(albumChallengeName)} Challenge</strong> - EVERY member streams team album ${requiredStreams}X</li>
                        <li><strong style="color:#fff;">100% Attendance</strong> - All members submit Spotify screenshots</li>
                        <li><strong style="color:#fff;">Pass Police Check</strong> - No more than 3 violations</li>
                        <li><strong style="color:#fff;">Highest XP</strong> - Among teams that completed all above!</li>
                    </ol>
                    
                    <div class="guide-success">
                        <div class="guide-success-title">🎖️ Winner Reward</div>
                        <div class="guide-success-content">
                            All members of the winning team get a special <strong style="color:#ffd700;">Champion Badge</strong>! 🏆
                        </div>
                    </div>
                    
                    <div class="guide-deadline-box">
                        <div class="guide-deadline-title">⏰ Deadline: Sunday 4:00 PM IST</div>
                        <div class="guide-deadline-desc">Attendance and Police reports must be confirmed by Admin before results are finalized.</div>
                    </div>
                </div>
            </div>
            
            <!-- Section 5: Important Streaming Rules -->
            <div class="guide-section" id="guide-rules">
                <div class="guide-section-header" onclick="toggleGuideSection(this)">
                    <span class="guide-section-icon">📜</span>
                    <span class="guide-section-title">Important Streaming Rules</span>
                    <span class="guide-section-toggle">▼</span>
                </div>
                <div class="guide-section-content">
                    <div class="guide-warning">
                        <div class="guide-warning-title">⚠️ MUST FOLLOW</div>
                        <div class="guide-warning-content">These rules protect everyone's hard work!</div>
                    </div>
                    
                    <ol class="guide-numbered-list">
                        <li>Stream <strong style="color:#ffd700;">ONLY from the playlists given</strong> — available on HopeTracker or in the Playlist GC</li>
                        <li>Need a custom playlist? Ask the <strong>Playlist Makers</strong></li>
                        <li><strong style="color:#ff6b6b;">NO looping!</strong> Don't repeat the same playlist continuously</li>
                        <li>Every <strong style="color:#ffd700;">Sunday</strong>, you must show your Spotify listening history</li>
                    </ol>
                    
                    <div class="guide-section-subtitle">💬 Group Chats (GCs)</div>
                    
                    <div class="guide-gc-grid">
                        <div class="guide-gc-item">
                            <span class="guide-gc-icon">🌐</span>
                            <div class="guide-gc-info">
                                <div class="guide-gc-name">Main GC</div>
                                <div class="guide-gc-desc">All teams together</div>
                            </div>
                        </div>
                        <div class="guide-gc-item">
                            <span class="guide-gc-icon">💭</span>
                            <div class="guide-gc-info">
                                <div class="guide-gc-name">Discussion GC</div>
                                <div class="guide-gc-desc">Common doubts for all teams</div>
                            </div>
                        </div>
                        <div class="guide-gc-item">
                            <span class="guide-gc-icon">👥</span>
                            <div class="guide-gc-info">
                                <div class="guide-gc-name">Team GCs</div>
                                <div class="guide-gc-desc">Only your team members</div>
                            </div>
                        </div>
                        <div class="guide-gc-item">
                            <span class="guide-gc-icon">🎵</span>
                            <div class="guide-gc-info">
                                <div class="guide-gc-name">Playlist GC</div>
                                <div class="guide-gc-desc">Playlist sharing & requests</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="guide-warning">
                        <div class="guide-warning-title">🚫 GC Rule</div>
                        <div class="guide-warning-content">
                            In ALL GCs, you can <strong>only talk about the battle</strong>. No random chats!
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Section 6: Weekly Attendance & Screenshots -->
            <div class="guide-section" id="guide-attendance">
                <div class="guide-section-header" onclick="toggleGuideSection(this)">
                    <span class="guide-section-icon">📸</span>
                    <span class="guide-section-title">Weekly Attendance & Screenshots</span>
                    <span class="guide-section-toggle">▼</span>
                </div>
                <div class="guide-section-content">
                    <div class="guide-highlight">
                        <div class="guide-highlight-title">⏰ Submission Window</div>
                        <div class="guide-highlight-content">
                            <strong>Saturday 3:00 PM</strong> → <strong>Sunday 3:00 PM</strong> (IST)<br>
                            You have 24 hours — no excuses!
                        </div>
                    </div>
                    
                    <div class="guide-section-subtitle">📱 How To Send Your Screenshots</div>
                    
                    <div class="guide-steps">
                        <div class="guide-step">
                            <div class="guide-step-num">1</div>
                            <div class="guide-step-content">
                                <div class="guide-step-title">Open Spotify</div>
                                <div class="guide-step-desc">Launch the Spotify app on your phone</div>
                            </div>
                        </div>
                        <div class="guide-step">
                            <div class="guide-step-num">2</div>
                            <div class="guide-step-content">
                                <div class="guide-step-title">Go to Your Profile</div>
                                <div class="guide-step-desc">Tap your profile icon (top-left corner)</div>
                            </div>
                        </div>
                        <div class="guide-step">
                            <div class="guide-step-num">3</div>
                            <div class="guide-step-content">
                                <div class="guide-step-title">Open Recents</div>
                                <div class="guide-step-desc">Find and tap on "Recents" or "Recently Played"</div>
                            </div>
                        </div>
                        <div class="guide-step">
                            <div class="guide-step-num">4</div>
                            <div class="guide-step-content">
                                <div class="guide-step-title">Scroll Down & Screenshot</div>
                                <div class="guide-step-desc">Capture history from last Sunday till Saturday</div>
                            </div>
                        </div>
                        <div class="guide-step">
                            <div class="guide-step-num">5</div>
                            <div class="guide-step-content">
                                <div class="guide-step-title">Add Watermark & Send</div>
                                <div class="guide-step-desc">Add your Instagram username, then post in Team GC</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="guide-warning">
                        <div class="guide-warning-title">🏷️ IMPORTANT: Add Watermark!</div>
                        <div class="guide-warning-content">
                            You MUST add your <strong>Instagram username as a watermark</strong> on your screenshots!
                        </div>
                    </div>
                    
                    <div class="watermark-example">
                        <div class="watermark-preview">
                            <div class="watermark-text">@your_username</div>
                            <div class="watermark-preview-label">📱 Your Spotify History Screenshot</div>
                        </div>
                        <div class="watermark-instructions">
                            Add your Instagram username in the corner of each screenshot.
                        </div>
                    </div>
                    
                    <div class="guide-section-subtitle">🔍 Cross-Check System</div>
                    <p class="guide-text">To keep things fair, teams cross-check each other:</p>
                    
                    <div class="guide-cross-check">
                        <div class="guide-cross-check-item">
                            <span class="guide-cross-check-from">🟣 Indigo</span>
                            <span class="guide-cross-check-arrow">→</span>
                            <span class="guide-cross-check-to">🔵 Echo</span>
                        </div>
                        <div class="guide-cross-check-item">
                            <span class="guide-cross-check-from">🔵 Echo</span>
                            <span class="guide-cross-check-arrow">→</span>
                            <span class="guide-cross-check-to">🔴 Agust D</span>
                        </div>
                        <div class="guide-cross-check-item">
                            <span class="guide-cross-check-from">🔴 Agust D</span>
                            <span class="guide-cross-check-arrow">→</span>
                            <span class="guide-cross-check-to">🟢 JITB</span>
                        </div>
                        <div class="guide-cross-check-item">
                            <span class="guide-cross-check-from">🟢 JITB</span>
                            <span class="guide-cross-check-arrow">→</span>
                            <span class="guide-cross-check-to">🟣 Indigo</span>
                        </div>
                    </div>
                    
                    <div class="guide-warning">
                        <div class="guide-warning-title">⚠️ Consequences (After Week 1)</div>
                        <div class="guide-warning-content">
                            • Week 1 is practice — no action taken<br>
                            • <strong>From Week 2:</strong><br>
                            → 3+ members loop/wrong playlists = Streams NOT counted<br>
                            → Not 100% attendance = Team disqualified for week
                        </div>
                    </div>
                    
                    <div class="guide-success">
                        <div class="guide-success-title">💡 Can't Submit On Time?</div>
                        <div class="guide-success-content">
                            Send your screenshots to a teammate or team helper, and they can submit on your behalf!
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Section 7: Final Words -->
            <div class="guide-section" id="guide-final">
                <div class="guide-section-header" onclick="toggleGuideSection(this)">
                    <span class="guide-section-icon">💜</span>
                    <span class="guide-section-title">Final Words</span>
                    <span class="guide-section-toggle">▼</span>
                </div>
                <div class="guide-section-content">
                    <div class="guide-final-content">
                        <div class="guide-final-emoji">💜</div>
                        <p class="guide-text" style="font-size:15px;color:#fff;">
                            <strong>Read everything patiently.</strong><br>
                            Don't stress about all these instructions!
                        </p>
                        <p class="guide-text">
                            It's super simple once you start, and you'll always get help whenever you feel stuck.
                        </p>
                        <p class="guide-text" style="color:#ffd700;font-weight:bold;">
                            Let's work together and make this comeback legendary! 🚀
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="guide-quick-links">
            <div class="guide-quick-link" onclick="handleGuideQuickLink('home')">
                <span class="guide-quick-link-icon">🏠</span>
                <span class="guide-quick-link-text">Dashboard</span>
            </div>
            <div class="guide-quick-link" onclick="handleGuideQuickLink('goals')">
                <span class="guide-quick-link-icon">🎯</span>
                <span class="guide-quick-link-text">Goals</span>
            </div>
            <div class="guide-quick-link" onclick="handleGuideQuickLink('playlists')">
                <span class="guide-quick-link-icon">🎵</span>
                <span class="guide-quick-link-text">Playlists</span>
            </div>
            <div class="guide-quick-link" onclick="handleGuideQuickLink('gc-links')">
                <span class="guide-quick-link-icon">👥</span>
                <span class="guide-quick-link-text">GC Links</span>
            </div>
            <!-- Added correctly without nested div -->
            <div class="guide-quick-link" onclick="handleGuideQuickLink('home')">
                <span class="guide-quick-link-icon">🔥</span>
                <span class="guide-quick-link-text">Check Streak</span>
            </div>
        </div>
`;
    
    // Initialize navigation
    initGuideNav();
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    console.log('✅ Guide page rendered successfully');
}

// ============================================
// HELPER FUNCTIONS FOR GUIDE PAGE
// ============================================

function handleGuideQuickLink(pageName) {
    console.log('Guide quick link clicked:', pageName);
    
    if (navigator.vibrate) navigator.vibrate(10);
    
    // ✅ Clear inline styles before navigating
    document.querySelectorAll('.page').forEach(p => {
        p.style.display = '';
    });
    
    // Try all navigation methods
    if (typeof loadPage === 'function') { loadPage(pageName); return; }
    if (typeof renderPage === 'function') { renderPage(pageName); return; }
    if (typeof navigateTo === 'function') { navigateTo(pageName); return; }
    if (typeof showPage === 'function') { showPage(pageName); return; }
    if (typeof switchPage === 'function') { switchPage(pageName); return; }
    if (window.APP?.loadPage) { window.APP.loadPage(pageName); return; }
    if (window.app?.navigate) { window.app.navigate(pageName); return; }
    
    // Try clicking existing nav
    const btn = document.querySelector(`[data-page="${pageName}"]`);
    if (btn) { btn.click(); return; }
    
    window.location.hash = pageName;
}

function initGuideNav() {
    const navBtns = document.querySelectorAll('#guide-content .guide-nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            if (sectionId) scrollToGuideSection(sectionId);
        });
    });
}

function toggleGuideSection(header) {
    if (!header) return;
    const section = header.parentElement;
    if (!section) return;
    if (navigator.vibrate) navigator.vibrate(10);
    section.classList.toggle('open');
}

function scrollToGuideSection(sectionId) {
    const section = document.getElementById('guide-' + sectionId);
    const navContainer = document.getElementById('guideNav');
    if (!section) return;
    
    if (navigator.vibrate) navigator.vibrate(10);
    
    // Close other sections
    document.querySelectorAll('#guide-content .guide-section').forEach(s => {
        if (s !== section) s.classList.remove('open');
    });
    
    section.classList.add('open');
    
    // Update nav buttons
    document.querySelectorAll('#guide-content .guide-nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-section') === sectionId) {
            btn.classList.add('active');
            if (navContainer) {
                const scrollLeft = btn.offsetLeft - (navContainer.offsetWidth / 2) + (btn.offsetWidth / 2);
                navContainer.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
            }
        }
    });
    
    // Scroll to section
    setTimeout(() => {
        const offset = 70;
        const pos = section.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
    }, 150);
}
window.handleGuideQuickLink = handleGuideQuickLink;
// Guide page functions
window.renderGuidePage = renderGuidePage;
window.toggleGuideSection = toggleGuideSection;
window.scrollToGuideSection = scrollToGuideSection;
// ==================== showChatRules ====================
function showChatRules() {
    const popup = document.createElement('div');
    popup.className = 'chat-rules-popup';
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    popup.innerHTML = `
        <div style="
            background: #1a1a2e;
            border: 1px solid #7b2cbf;
            border-radius: 16px;
            padding: 25px;
            max-width: 400px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
        ">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h3 style="margin:0;color:#fff;">📋 Chat Rules</h3>
                <button onclick="this.closest('.chat-rules-popup').remove()" style="
                    background:none;
                    border:none;
                    color:#888;
                    font-size:24px;
                    cursor:pointer;
                ">×</button>
            </div>
            
            <div style="color:#aaa;font-size:13px;line-height:1.8;">
                <div style="margin-bottom:15px;padding:12px;background:rgba(123,44,191,0.1);border-radius:8px;">
                    <strong style="color:#7b2cbf;">💜 Be Kind & Respectful</strong><br>
                    We're all here for BTS. Treat everyone with kindness.
                </div>
                
                <div style="margin-bottom:15px;padding:12px;background:rgba(255,215,0,0.1);border-radius:8px;">
                    <strong style="color:#ffd700;">⏰ Messages Auto-Delete</strong><br>
                    Messages are deleted after 24 hours. Nothing is permanent!
                </div>
                
                <div style="margin-bottom:15px;padding:12px;background:rgba(0,255,136,0.1);border-radius:8px;">
                    <strong style="color:#00ff88;">⚔️ Battle Conversations Only</strong><br>
                    Keep discussions related to streaming missions.
                </div>
                
                <div style="padding:12px;background:rgba(255,68,68,0.1);border-radius:8px;">
                    <strong style="color:#ff6b6b;">🚫 No Spam or Links</strong><br>
                    No spam, external links, or inappropriate content.
                </div>
            </div>
            
            <button onclick="this.closest('.chat-rules-popup').remove()" class="btn-primary" style="
                width:100%;
                margin-top:20px;
                padding:12px;
            ">
                Got it! 💜
            </button>
        </div>
    `;
    
    document.body.appendChild(popup);
}
// ==================== MISSION NOTIFICATION HELPER ====================

// Function to reset mission notifications (can be called from console)
function resetMissionNotifications() {
    console.log('🔄 Resetting mission notifications...');
    
    if (STATE.lastChecked) {
        STATE.lastChecked.missionCount = -1;
        STATE.lastChecked.seenMissionIds = [];
        saveNotificationState();
        
        // Force check
        setTimeout(() => {
            checkNotifications();
            showToast('🔄 Mission notifications reset!', 'success');
            
            // Show notification dot
            const missionDot = document.getElementById('dot-mission');
            if (missionDot) missionDot.classList.add('active');
        }, 500);
    }
}

// Add to window for console access
window.resetMissionNotifications = resetMissionNotifications;

// Add to createTeamMission function
const originalCreateTeamMission = createTeamMission;
createTeamMission = async function() {
    const result = await originalCreateTeamMission.apply(this, arguments);
    
    // After mission creation, force notification reset
    console.log('🔔 Mission created, forcing notification reset...');
    resetMissionNotifications();
    
    return result;
};

// ==================== RESULTS POPUP ====================
function viewResults(week) {
    markResultsSeen(week);
    dismissResultsUI();
    STATE.week = week;
    const weekSelect = $('week-select');
    if (weekSelect) weekSelect.value = week;
    loadPage('summary');
}

function dismissResults(week) {
    markResultsSeen(week);
    dismissResultsUI();
}

function dismissResultsUI() {
    const popup = $('results-popup');
    const confetti = $('confetti-overlay');
    if (popup) { 
        popup.classList.remove('show'); 
        setTimeout(() => popup.remove(), 500); 
    }
    if (confetti) confetti.remove();
}

// ==================== CLEANUP ON LOGOUT ====================
window.addEventListener('beforeunload', () => {
    stopHeartbeat();
    stopUnreadCheck();
    cleanupChat();
    cleanupStreakAndActivity();
    if (STATE.agentNo) {
        navigator.sendBeacon(CONFIG.API_URL + '?action=removeOnlineUser&agentNo=' + STATE.agentNo);
    }
});
// ==================== HELPER FUNCTIONS FOR DRAWER ====================

// 1. Toggle Function
window.toggleHiddenBadges = function(btn) {
    const container = document.getElementById('hidden-xp-badges');
    if (!container) return;
    
    const isExpanded = container.classList.contains('expanded');
    
    if (isExpanded) {
        container.classList.remove('expanded');
        btn.innerHTML = `View All Badges →`;
        // Optional: Scroll back up slightly
        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        container.classList.add('expanded');
        btn.innerHTML = `↑ Show Less`;
    }
};

// 2. Badge HTML Generator (Helper)
function renderBadgeHTML(badge) {
    const isWinner = badge.type === 'winner';
    const isSpecial = badge.type === 'achievement' || isWinner;
    const color = isWinner ? '#ffd700' : isSpecial ? '#c56cf0' : '#7b2cbf'; // Gold, Pink, Purple
    const bgStyle = isSpecial ? `${color}15` : 'rgba(123,44,191,0.1)';
    const borderStyle = isSpecial ? color : '#555';

    return `
        <div style="text-align: center;">
            <div class="badge-circle holographic" style="
                width: 50px; height: 50px; margin: 0 auto;
                border-radius: 50%; overflow: hidden;
                border: 2px solid ${borderStyle};
                display: flex; align-items: center; justify-content: center;
                background: ${bgStyle};
                transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                ${badge.imageUrl ? `
                    <img src="${badge.imageUrl}" style="width:100%;height:100%;object-fit:cover;" 
                         onerror="this.style.display='none';this.parentElement.innerHTML='${badge.icon || '🎖️'}';">
                ` : `<span style="font-size:22px;">${badge.icon || '🎖️'}</span>`}
            </div>
            <div style="margin-top: 5px; font-size: 8px; color: ${isSpecial ? color : '#888'}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${sanitize(badge.name)}
            </div>
            <div style="font-size: 7px; color: #666;">${sanitize(badge.week)}</div>
        </div>
    `;
}
// ==================== NAMJOON'S BRAIN MODULE ====================

// 1. CSS STYLES
function ensureNamjoonCSS() {
    if (document.getElementById('namjoon-styles')) return;
    const style = document.createElement('style');
    style.id = 'namjoon-styles';
    style.innerHTML = `
        .namjoon-card { background: linear-gradient(135deg, #2c0b47, #1a1a2e); border: 1px solid #7b2cbf; border-radius: 16px; padding: 20px; margin-bottom: 25px; position: relative; overflow: hidden; box-shadow: 0 4px 15px rgba(123, 44, 191, 0.3); }
        .namjoon-card::before { content: '🧠'; position: absolute; top: -20px; right: -20px; font-size: 150px; opacity: 0.05; transform: rotate(20deg); }
        .namjoon-header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; }
        .namjoon-avatar { width: 60px; height: 60px; border-radius: 50%; border: 2px solid #7b2cbf; object-fit: cover; }
        .namjoon-bubble { background: rgba(255,255,255,0.1); border-radius: 0 15px 15px 15px; padding: 10px 15px; font-size: 13px; color: #e0e0e0; line-height: 1.4; position: relative; font-style: italic; }
        .namjoon-stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; text-align: center; }
        .namjoon-stat-box { background: rgba(0,0,0,0.3); border-radius: 10px; padding: 10px 5px; }
        .namjoon-stat-val { font-size: 18px; font-weight: bold; color: #fff; }
        .namjoon-stat-lbl { font-size: 9px; color: #aaa; text-transform: uppercase; }
        .namjoon-todo-list { display: flex; flex-direction: column; gap: 8px; }
        .namjoon-task { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 10px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
        .namjoon-task:hover { background: rgba(255,255,255,0.08); }
        .namjoon-task.checked { background: rgba(0, 255, 136, 0.1); border-color: rgba(0, 255, 136, 0.3); }
        .namjoon-task.checked .task-text { text-decoration: line-through; color: #888; }
        .namjoon-checkbox { width: 20px; height: 20px; border-radius: 6px; border: 2px solid #7b2cbf; display: flex; align-items: center; justify-content: center; color: transparent; }
        .namjoon-task.checked .namjoon-checkbox { background: #00ff88; border-color: #00ff88; color: #000; }
    `;
    document.head.appendChild(style);
}

// 2. PAGE RENDERER (Connects Router to Logic)
async function renderNamjoonBrain() {
    console.log('🧠 Loading Namjoon Brain Page...');
    
    // Create/Get Page
    let page = document.getElementById('page-namjoon');
    if (!page) {
        const main = document.querySelector('.pages-wrapper');
        page = document.createElement('section');
        page.id = 'page-namjoon';
        page.className = 'page';
        page.innerHTML = `<div class="page-header"><h1>🧠 Namjoon's Brain</h1><p class="page-subtitle">Strategic Analysis</p></div><div id="namjoon-content"></div>`;
        main.appendChild(page);
    }

    // Force visibility
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    page.classList.add('active');

    const container = document.getElementById('namjoon-content');
    container.innerHTML = '<div class="loading-skeleton"><div class="skeleton-card large"></div></div>';

    try {
        const team = STATE.data?.profile?.team || 'Unknown';
        const week = STATE.week || 'Week 1';

        // ✅ FETCH BOTH GOALS AND ALBUM 2X DATA
        const [goalsData, album2xData] = await Promise.all([
            api('getGoalsProgress', { week: week }),
            api('getAlbum2xStatus', { week: week, team: team, agentNo: STATE.agentNo })
        ]);
        
        // Render with extra data
        const html = renderNamjoonsBrain(
            team, 
            goalsData.trackGoals || {}, 
            goalsData.albumGoals || {},
            album2xData // Pass the 2x data to the helper
        );
        
        container.innerHTML = html;
        container.innerHTML += `<div style="margin-top:20px"><button onclick="loadPage('goals')" class="btn-secondary" style="width:100%">← Back to Goals</button></div>`;
        
    } catch (e) {
        console.error(e);
        container.innerHTML = `<div class="card"><div class="card-body error-state"><p>Analysis Failed. Network Error.</p><button onclick="renderNamjoonBrain()" class="btn-secondary">Retry</button></div></div>`;
    }
}

// 3. LOGIC HELPER (Calculates Targets + Displays Lagging Members)
function renderNamjoonsBrain(teamName, trackGoals, albumGoals, album2xData) {
    const totalMembers = getTeamMemberCount(teamName) || 1;
    const activeMembersEstimate = Math.ceil(totalMembers * 0.6) || 1;

    // --- 1. Daily Math ---
    const daysLeft = getDaysRemaining(STATE.week);
    const safeDays = daysLeft <= 0 ? 1 : daysLeft;
    const isUrgent = daysLeft <= 1;

    const specificTasks = [];
    let totalStreamsNeeded = 0;

    // --- 2. Analyze Tracks ---
    Object.entries(trackGoals).forEach(([trackName, info]) => {
        const current = info.teams?.[teamName]?.current || 0;
        const goal = info.goal || 0;
        
        if (current < goal) {
            const gap = goal - current;
            const myShare = Math.ceil(gap / activeMembersEstimate) + 1;
            const dailyTarget = Math.ceil(myShare / safeDays);
            
            specificTasks.push({
                id: 'track_' + trackName.replace(/[^a-zA-Z0-9]/g, ''),
                type: '🎵',
                name: trackName,
                total: myShare,
                daily: dailyTarget,
                gap: gap
            });
            totalStreamsNeeded += myShare;
        }
    });

    // --- 3. Analyze Albums ---
    Object.entries(albumGoals).forEach(([albumName, info]) => {
        const current = info.teams?.[teamName]?.current || 0;
        const goal = info.goal || 0;
        
        if (current < goal) {
            const gap = goal - current;
            const myShare = Math.ceil(gap / activeMembersEstimate) + 1;
            const dailyTarget = Math.ceil(myShare / safeDays);
            
            specificTasks.push({
                id: 'album_' + albumName.replace(/[^a-zA-Z0-9]/g, ''),
                type: '💿',
                name: albumName,
                total: myShare,
                daily: dailyTarget,
                gap: gap
            });
            totalStreamsNeeded += myShare;
        }
    });

    specificTasks.sort((a, b) => b.gap - a.gap);

    // --- 4. Process Album 2X Lagging Members (NEW) ---
    let pendingMembersHTML = '';
    const team2xData = album2xData?.teams?.[teamName] || {};
    const members = team2xData.members || [];
    // Filter for members who have NOT passed
    const pendingList = members.filter(m => !m.passed).map(m => m.name || m.agentNo);

    if (pendingList.length > 0) {
        pendingMembersHTML = `
            <div style="background:rgba(255,68,68,0.1); border:1px solid rgba(255,68,68,0.3); border-radius:10px; padding:12px; margin-bottom:15px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="color:#ff6b6b; font-weight:bold; font-size:12px;">🚨 ALBUM 2X INCOMPLETE</span>
                    <span style="background:#ff6b6b; color:white; font-size:10px; padding:2px 6px; border-radius:6px;">${pendingList.length} Left</span>
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:5px;">
                    ${pendingList.map(name => `
                        <span style="font-size:10px; color:#ccc; background:rgba(0,0,0,0.3); padding:3px 8px; border-radius:4px;">
                            ${name}
                        </span>
                    `).join('')}
                </div>
                <div style="font-size:9px; color:#aaa; margin-top:8px; font-style:italic;">
                    *Help them stream or send reminders in GC!
                </div>
            </div>
        `;
    } else if (members.length > 0) {
        pendingMembersHTML = `
            <div style="background:rgba(0,255,136,0.1); border:1px solid rgba(0,255,136,0.3); border-radius:10px; padding:10px; margin-bottom:15px; text-align:center;">
                <span style="color:#00ff88; font-weight:bold; font-size:12px;">✨ TEAM 2X COMPLETE!</span>
            </div>
        `;
    }

    // --- 5. Prepare UI ---
    const todoId = `namjoon_todo_${new Date().toDateString()}`;
    const savedState = JSON.parse(localStorage.getItem(todoId) || '{}');
    const album2xPassed = STATE.data?.album2xStatus?.passed || false;
    
    const tasksHTML = specificTasks.map(task => {
        const dailyText = isUrgent 
            ? `<span style="color:#ff6b6b; font-weight:bold;">⚠️ DUE TODAY</span>` 
            : `<span style="color:#ffd700;">${task.daily}/day</span>`;
        const taskLabel = `${task.type} <strong>${task.name}</strong> <span style="opacity:0.7">x${task.total}</span> — ${dailyText}`;
        return renderNamjoonTask(task.id, taskLabel, savedState[task.id]);
    }).join('');

    const quotes = [
        "No agent left behind. Check the list.",
        "Efficiency is key. Focus on the gaps.",
        "I've identified who needs support.",
        "Teamwork makes the dream work."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const rmImage = "https://raw.githubusercontent.com/hbot7875-gif/btscomebackmission/6c9cf38a7be372187ebd244d19a5e0357d4983c8/team%20pfps/baed0eb48e6ac22807df156ce76d8b4f.jpg";

    return `
        <div class="namjoon-card">
            <div class="namjoon-header">
                <img src="${rmImage}" class="namjoon-avatar" alt="RM">
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <div style="font-weight:bold; color:#fff; font-size:14px;">🧠 The 148 Protocol</div>
                        <button type="button" onclick="window.showProtocolInfo()" style="background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.4);color:#fff;border-radius:50%;width:32px;height:32px;font-size:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:100;pointer-events:auto;">?</button>
                    </div>
                    <div class="namjoon-bubble">${randomQuote}</div>
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="namjoon-stat-grid">
                <div class="namjoon-stat-box">
                    <div class="namjoon-stat-val" style="color:#7b2cbf;">${activeMembersEstimate}</div>
                    <div class="namjoon-stat-lbl">Active Agents</div>
                </div>
                <div class="namjoon-stat-box">
                    <div class="namjoon-stat-val" style="color:${daysLeft <= 2 ? '#ff6b6b' : '#00ff88'};">
                        ${daysLeft}
                    </div>
                    <div class="namjoon-stat-lbl">Days Left</div>
                </div>
                <div class="namjoon-stat-box">
                    <div class="namjoon-stat-val" style="color:#ffd700;">
                        ${totalStreamsNeeded}
                    </div>
                    <div class="namjoon-stat-lbl">My Total Need</div>
                </div>
            </div>

            <!-- 🚨 ALBUM 2X ALERT SECTION -->
            ${pendingMembersHTML}

            <div style="font-size:11px; color:#888; margin-bottom:10px; text-transform:uppercase; letter-spacing:1px; display:flex; justify-content:space-between;">
                <span>📋 Daily Plan</span>
                <span>${new Date().toLocaleDateString()}</span>
            </div>

            <div class="namjoon-todo-list">
                ${specificTasks.length === 0 ? 
                    `<div style="text-align:center; padding:20px; color:#00ff88; background:rgba(0,255,136,0.1); border-radius:10px;">
                        🎉 All Goals Met! Help the members listed above.
                    </div>` 
                    : tasksHTML
                }
                
                ${renderNamjoonTask('task_2x_check', `✨ Complete My Album 2X`, savedState['task_2x_check'] || album2xPassed, album2xPassed)}
                ${renderNamjoonTask('task_proof_daily', `📸 Post Proof in Team GC`, savedState['task_proof_daily'])}
            </div>
        </div>
    `;
}
// Updated Task Renderer Helper
function renderNamjoonTask(id, text, isChecked, forceChecked = false) {
    const checkedClass = (isChecked || forceChecked) ? 'checked' : '';
    const checkMark = (isChecked || forceChecked) ? '✓' : '';
    
    // CHANGE: We pass 'this' so we can manipulate the element immediately
    const clickAction = forceChecked ? '' : `onclick="window.toggleNamjoonTask(this, '${id}')"`;

    return `
        <div class="namjoon-task ${checkedClass}" ${clickAction}>
            <div class="namjoon-checkbox">${checkMark}</div>
            <div class="task-text" style="font-size:13px; color:${isChecked ? '#888' : '#fff'}; flex:1;">
                ${text}
            </div>
        </div>
    `;
}
// Updated Toggle Function (Instant Visual Update + Global Export)
function toggleNamjoonTask(element, taskId) {
    // 1. Safety check
    if (!element) return;

    // 2. Get current state
    const todoId = `namjoon_todo_${new Date().toDateString()}`;
    const savedState = JSON.parse(localStorage.getItem(todoId) || '{}');
    
    // 3. Toggle state
    const newState = !savedState[taskId];
    savedState[taskId] = newState;
    
    // 4. Save
    localStorage.setItem(todoId, JSON.stringify(savedState));
    
    // 5. Vibrate (Mobile)
    if (navigator.vibrate) navigator.vibrate(10);
    
    // 6. INSTANT UI UPDATE (No Reload)
    const checkbox = element.querySelector('.namjoon-checkbox');
    const text = element.querySelector('.task-text');
    
    if (newState) {
        element.classList.add('checked');
        if (checkbox) checkbox.textContent = '✓';
        if (text) text.style.color = '#888';
    } else {
        element.classList.remove('checked');
        if (checkbox) checkbox.textContent = '';
        if (text) text.style.color = '#fff';
    }
}

// 🔥 CRITICAL FIX: Make it visible to the HTML "onclick"
window.toggleNamjoonTask = toggleNamjoonTask;
// ==================== 148 PROTOCOL INFO MODAL ====================
function showProtocolInfo() {
    // Create Modal Elements
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); z-index: 999999;
        display: flex; align-items: center; justify-content: center;
        backdrop-filter: blur(5px); animation: fadeIn 0.3s ease;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
        background: linear-gradient(145deg, #1a1a2e, #0f0f1f);
        border: 1px solid #7b2cbf; border-radius: 16px;
        padding: 0; max-width: 350px; width: 90%;
        box-shadow: 0 0 30px rgba(123, 44, 191, 0.3);
        overflow: hidden;
    `;

    modal.innerHTML = `
        <div style="background: rgba(123,44,191,0.15); padding: 15px; border-bottom: 1px solid rgba(123,44,191,0.3); display: flex; align-items: center; justify-content: space-between;">
            <div style="font-weight: bold; color: #fff; font-family: 'Orbitron', monospace;">🧠 NAMJOON'S LOGIC</div>
            <button id="close-info-btn" style="background: none; border: none; color: #888; font-size: 20px; cursor: pointer;">×</button>
        </div>
        
        <div style="padding: 20px;">
            
            <!-- NEW: EXAMPLE BREAKDOWN -->
            <div style="background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.1); border-radius: 8px; padding: 12px; margin-bottom: 20px;">
                <h4 style="color: #ffd700; font-size: 11px; margin: 0 0 8px 0; text-transform: uppercase;">📖 How to Read:</h4>
                
                <div style="font-size: 13px; color: #fff; font-weight: bold; margin-bottom: 8px;">
                    🎵 DNA <span style="color: #00ff88;">x163</span> — <span style="color: #ffd700;">28/day</span>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 11px;">
                    <div>
                        <span style="color: #00ff88; font-weight: bold;">x163 (Total)</span><br>
                        <span style="color: #aaa;">Your total week's fair share to clear the team gap.</span>
                    </div>
                    <div>
                        <span style="color: #ffd700; font-weight: bold;">28/day (Pace)</span><br>
                        <span style="color: #aaa;">How many you should do <strong>today</strong> to finish on time.</span>
                    </div>
                </div>
            </div>

            <p style="color: #aaa; font-size: 13px; line-height: 1.6; margin-bottom: 15px;">
                Namjoon calculates these numbers based on how many <strong>active agents</strong> are helping and how many <strong>days</strong> are left.
            </p>

            <ul style="padding-left: 20px; margin: 0; color: #ccc; font-size: 12px; line-height: 1.6;">
                <li style="margin-bottom: 10px;">
                    <strong>It's Dynamic:</strong> If the team streams hard today, your numbers for tomorrow will go <strong>DOWN</strong>! 📉
                </li>
                <li style="margin-bottom: 8px;">
                    <strong>Your Checklist:</strong> This is a personal planner. <strong>Tick the box yourself</strong> when you finish your daily goal! ✅
                </li>
            </ul>

            <button onclick="this.closest('.modal-overlay').remove()" style="
                width: 100%; margin-top: 20px; padding: 12px;
                background: linear-gradient(135deg, #7b2cbf, #5a1f99);
                border: none; border-radius: 8px; color: white; font-weight: bold; cursor: pointer;
            ">
                Got it!
            </button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close logic
    document.getElementById('close-info-btn').onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
}
window.showProtocolInfo = showProtocolInfo;

// ==================== EXPORTS & INIT ====================
document.addEventListener('DOMContentLoaded', initApp);

// Export all functions to window for onclick handlers
window.loadPage = loadPage;
window.logout = logout;
window.goBack = goBack;
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
window.loadActiveTeamMissions = loadActiveTeamMissions;
window.loadMissionHistory = loadMissionHistory;
window.renderAdminAssets = renderAdminAssets;
window.navigatePreview = navigatePreview;
window.openChat = openChat;
window.showChatRules = showChatRules;
window.handleNotificationAction = handleNotificationAction;
window.showNotificationCenter = showNotificationCenter;
window.closeNotificationCenter = closeNotificationCenter;
window.clearAllNotifications = clearAllNotifications;
window.checkNotifications = checkNotifications;
window.dismissNotificationPopup = dismissNotificationPopup;
window.sendMessage = sendMessage;
window.loadMessages = loadMessages;
window.showOnlineUsers = showOnlineUsers;
window.startHeartbeat = startHeartbeat;
window.stopHeartbeat = stopHeartbeat;
window.renderSongOfDay = renderSongOfDay;
window.submitSongAnswer = submitSongAnswer;
window.setTodaysSong = setTodaysSong;
window.renderSecretMissions = renderSecretMissions;
window.renderAnnouncements = renderAnnouncements;
window.renderPlaylists = renderPlaylists;
window.submitNewPlaylist = submitNewPlaylist;
window.renderSummary = renderSummary;
window.renderComparison = renderComparison;
window.renderGCLinks = renderGCLinks;
window.renderHelperRoles = renderHelperRoles;
window.shareStats = shareStats;
window.copyShareText = copyShareText;
window.resetMissionNotifications = resetMissionNotifications;
window.showProtocolInfo = showProtocolInfo;


// Guide page functions
window.renderGuidePage = renderGuidePage;
window.toggleGuideSection = toggleGuideSection;
window.scrollToGuideSection = scrollToGuideSection;

// Week confirmation functions
window.renderWeekConfirmation = renderWeekConfirmation;
window.adminConfirmAttendance = adminConfirmAttendance;
window.adminConfirmPolice = adminConfirmPolice;
window.isTeamEligibleForWin = isTeamEligibleForWin;
window.getTeamEligibilityStatus = getTeamEligibilityStatus;
window.getWeekWinner = getWeekWinner;
window.renderNamjoonBrain = renderNamjoonBrain;
window.toggleNamjoonTask = toggleNamjoonTask; 

console.log('🎮 BTS Spy Battle v5.0 Loaded with Voting System 🗳️💜');
})();
