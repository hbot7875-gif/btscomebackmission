// ==================== MAIN CONFIG ====================
const CONFIG = {
    API_URL: 'https://uspezooqcdrwaqxcqojn.supabase.co/functions/v1/spy-battle-api',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzcGV6b29xY2Ryd2FxeGNxb2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMTk5NTIsImV4cCI6MjA4NTU5NTk1Mn0.4LHNAEys-bg7aDjgEVk6dXw3McZu5VNnK2h0OsvqwPg', 
    
    ADMIN_AGENT_NO: 'AGENT000',

    WEEK_DATES: {
        'Test Week 1': '2025-11-23',  
        'Test Week 2': '2025-11-30',
        'Week 1': '2025-12-07',
        'Week 2': '2025-12-14',
        'Week 3': '2025-12-21',
        'Week 4': '2025-12-28',
        'Week 5': '2026-01-04',
        'Week 6': '2026-01-11',
        'Week 7': '2026-01-18',
        'Week 8': '2026-01-25',
        'Week 9': '2026-02-01',
        'Week 10': '2026-02-08',
        'Week 11': '2026-02-15',
        'Week 12': '2026-02-22',
        'Week 13': '2026-03-01',
        'Week 14': '2026-03-08',
        'Week 15': '2026-03-15',
        'Week 16': '2026-03-22'
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
    ACTIVITY_THRESHOLD: 10, 
    
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

// ==================== ACTIVITY CONFIG (UPDATED) ====================
const ACTIVITY_CONFIG = {
    MAX_ACTIVITIES: 50,
    REFRESH_INTERVAL: 15000,
    SHOW_TYPES: [
        'stream_milestone', 'xp_milestone', 'streak_update', 
        'badge_earned', 'goal_completed', 'album2x_completed', 
        'team_surge', 'rank_change', 'secret_mission'
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
        // ✅ UPDATED: Handles both Success and Failure messages dynamically
        'secret_mission': {
            icon: '🕵️',
            template: (data) => {
                const title = data.title || 'Secret Mission';
                const isFail = title.includes('(Failed)');
                const color = isFail ? '#ff4444' : '#00ff88'; // Red for fail, Green for success
                const action = isFail ? 'failed' : 'completed';
                return `<strong style="color:${teamColor(data.team)}">${data.team}</strong> ${action}: <strong style="color:${color}">${title}</strong>`;
            },
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
        // FIX: Remove the 'Z' or timezone offset from the string so the browser 
        // treats it as "Local Time" (which your backend already calculated as IST)
        const cleanDateStr = dateStr.replace('Z', '').replace(/\.\d+/, '').replace(/\+.*$/, '');
        
        const date = new Date(cleanDateStr);
        
        if (isNaN(date.getTime())) return dateStr;

        // Use simple formatting that reflects the string exactly
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const month = date.toLocaleString('en-US', { month: 'short' });
        const day = date.getDate();

        return `${month} ${day}, ${displayHours}:${minutes} ${ampm}`;
    } catch (e) { 
        return dateStr; 
    }
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
    const startDateStr = CONFIG.WEEK_DATES[selectedWeek];
    if (!startDateStr) return false;
    
    const start = new Date(startDateStr);
    // Week ends 7 days after start
    const end = new Date(start.getTime() + (7 * 24 * 60 * 60 * 1000) - 1);
    
    return new Date() > end;
}

function getDaysRemaining(weekLabel) {
    const startDateStr = CONFIG.WEEK_DATES[weekLabel];
    if (!startDateStr) return 0;
    
    const start = new Date(startDateStr);
    const end = new Date(start.getTime() + (7 * 24 * 60 * 60 * 1000) - 1);
    
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
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
    console.log('📡 Supabase Request:', action, params);

    try {
        const res = await fetch(CONFIG.API_URL, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.SUPABASE_KEY}`
            },
            body: JSON.stringify({
                action,
                agentNo: STATE.agentNo, 
                week: STATE.week,       
                ...params
            })
        });
        
        const data = await res.json();
        
        if (data.error) throw new Error(data.error);

        // Keep your timestamp logic
        if (data.lastUpdated) { 
            STATE.lastUpdated = data.lastUpdated; 
            updateTime(); 
        }
        
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
            checkNewSongOfDay(),
            checkNewSOTDResults(),
            checkNewResultsRelease()
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
        if (!team) return null;
        
        if (!STATE.lastChecked?._initialized) return null;
        
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
        
        // 1. FIRST TIME LOAD: Set baseline, don't notify
        if (isFirstCheck) {
            STATE.lastChecked.missionCount = activeMissions.length;
            STATE.lastChecked.seenMissionIds = activeMissions.map(m => m.id).filter(Boolean);
            STATE.lastChecked.seenCompletedMissionIds = completedMissions.map(m => m.id).filter(Boolean);
            STATE.lastChecked._missionBaselineSet = true;
            saveNotificationState();
            return null;
        }
        
        // 2. CHECK FOR RECENTLY COMPLETED/FAILED MISSIONS
        const seenCompletedIds = STATE.lastChecked.seenCompletedMissionIds || [];
        const newlyCompleted = completedMissions.filter(m => 
            m.id && !seenCompletedIds.includes(m.id)
        );
        
        if (newlyCompleted.length > 0) {
            const mission = newlyCompleted[0];
            
            // LOGIC: Did we pass or fail?
            // If Admin clicked "Fail", progress is usually 0 or less than target.
            // If Admin clicked "Approve", progress is usually set to target.
            const currentProgress = mission.progress?.[team] || 0;
            const target = mission.goalTarget || 1;
            const isFailure = currentProgress < target; // If we didn't hit goal but it's closed
            
            // Update seen list
            STATE.lastChecked.seenCompletedMissionIds = completedMissions.map(m => m.id).filter(Boolean);
            saveNotificationState();
            
            if (isFailure) {
                // ❌ FAILURE NOTIFICATION
                return {
                    type: 'mission_fail', // New type
                    icon: '💀',
                    title: 'Mission Failed',
                    message: `Team ${team} failed: ${mission.title || 'Secret Mission'}. 0 XP awarded.`,
                    action: () => loadPage('secret-missions'),
                    actionText: 'View Details',
                    priority: 'high', // Force popup
                    week: STATE.week,
                    id: `fail_${mission.id}`
                };
            } else {
                // ✅ SUCCESS NOTIFICATION
                const xpAwarded = mission.xpReward || 5;
                return {
                    type: 'mission_complete',
                    icon: '🎉',
                    title: `+${xpAwarded} XP Earned!`,
                    message: `${team} completed: ${mission.title || 'Secret Mission'}`,
                    action: () => loadPage('secret-missions'),
                    actionText: 'View Missions',
                    priority: 'high', // Force popup
                    week: STATE.week,
                    id: `complete_${mission.id}`
                };
            }
        }
        
        // 3. CHECK FOR NEWLY ACTIVE MISSIONS (Standard logic)
        const allCurrentIds = activeMissions.map(m => m.id).filter(Boolean);
        const newMissionIds = allCurrentIds.filter(id => !seenIds.includes(id));
        
        if (newMissionIds.length > 0) {
            // ... (Your existing new mission logic here) ...
            // Just updating ids to keep it clean
            const newAssignedToMe = myAssigned.filter(m => m.id && newMissionIds.includes(m.id));
            
            // Dot indicator
            const dot = document.getElementById('dot-mission');
            if (dot) dot.classList.add('active');

            if (newAssignedToMe.length > 0) {
                const mission = newAssignedToMe[0];
                return {
                    type: 'mission',
                    icon: '🎯',
                    title: 'Mission Assigned to YOU!',
                    message: mission.title || 'New classified mission',
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
                message: newMission?.title || 'Your team has a secret mission!',
                action: () => loadPage('secret-missions'),
                actionText: 'View Missions',
                week: STATE.week,
                id: newMission?.id
            };
        }
        
        return null;
        
    } catch (e) {
        console.error('❌ Mission check error:', e);
        return null;
    }
}
// ======================================================
// ADD THIS NEW FUNCTION TO FRONTEND JS
// ======================================================

async function checkNewResultsRelease() {
    try {
        // 1. Calculate which week to check (The previous week relative to today)
        // If today is in Week 9 dates, we check Week 8.
        if (!STATE.weeks || STATE.weeks.length === 0) return null;
        
        // Find current active week index based on Date (using your existing logic)
        // Or simply use the week preceding the current date-based week
        // Simple Fallback: Check the week currently selected in the UI
        const targetWeek = STATE.week; 

        // 2. Check if we already showed this notification
        const seenKey = `results_seen_v2_${targetWeek}`;
        if (localStorage.getItem(seenKey)) return null;

        // 3. Ask Server: "Is this week released?"
        const data = await api('getWeeklySummary', { week: targetWeek });
        
        // 4. If Released AND Week is actually over
        if (data.resultsReleased === true && isWeekCompleted(targetWeek)) {
            
            // Mark as seen so it doesn't pop up every 3 minutes
            localStorage.setItem(seenKey, 'true');

            // 5. Return the Notification Object
            return {
                type: 'results',
                icon: '🏆',
                title: 'Results Published!',
                message: `The final results for ${targetWeek} are now live. See who won!`,
                priority: 'high', // ⚠️ Forces the Popup
                action: () => {
                    STATE.week = targetWeek;
                    loadPage('summary');
                },
                actionText: 'View Winner',
                id: `release_${targetWeek}`
            };
        }
        return null;

    } catch (e) {
        console.error('Results check failed', e);
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
// ==================== CHECK SOTD RESULTS (MIDNIGHT) ====================
async function checkNewSOTDResults() {
    try {
        // 1. Fetch the latest finalized result from backend
        const data = await api('getLatestSOTDResult');
        
        if (!data.success || !data.result) return null;

        const result = data.result;
        const resultDate = new Date(result.date).toDateString(); // e.g., "Wed Jan 21 2026"
        
        // 2. CHECK: Use RESULT DATE for the key, NOT today's date
        // This fixes the bug where viewing a late result blocks the next one
        const seenKey = 'sotd_result_seen_' + resultDate;
        
        if (localStorage.getItem(seenKey)) {
            return null; // We have already seen THIS SPECIFIC result
        }

        // 3. Logic: Is this result recent enough?
        // We allow results from Today or Yesterday
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const todayStr = today.toDateString();
        const yesterdayStr = yesterday.toDateString();

        const isRelevant = resultDate === todayStr || resultDate === yesterdayStr;

        if (isRelevant) {
            return {
                type: 'sotd_result',
                icon: '🏆',
                title: 'SOTD Results Are In!',
                message: `Winner: ${result.winner} (${result.totalCorrect} correct)`,
                priority: 'high',
                week: STATE.week,
                id: `sotd_res_${resultDate}`, // Unique ID
                action: () => {
                    // FIX: Save using the RESULT date
                    localStorage.setItem(seenKey, 'true'); 
                    showSOTDResultModal(result);
                },
                actionText: 'See Winner'
            };
        }
        
        return null;

    } catch (e) {
        console.error('SOTD Result check failed', e);
        return null;
    }
}
function showSOTDResultModal(result) {
    document.querySelectorAll('.sotd-modal-overlay').forEach(el => el.remove());

    const overlay = document.createElement('div');
    overlay.className = 'sotd-modal-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.9); z-index: 1000000;
        display: flex; align-items: center; justify-content: center;
        backdrop-filter: blur(8px); animation: fadeIn 0.4s ease;
    `;

    const winnerColor = teamColor(result.winner);

    // Helper to get score from result object keys
    const scores = [
        { name: 'Team Indigo', score: result.teamIndigo || 0 },
        { name: 'Team Echo', score: result.teamEcho || 0 },
        { name: 'Team Agust D', score: result.teamAgustD || 0 },
        { name: 'Team JITB', score: result.teamJITB || 0 }
    ].sort((a, b) => b.score - a.score); // Sort highest first

    overlay.innerHTML = `
        <div style="
            background: linear-gradient(145deg, #1a1a2e, #0f0f1f);
            border: 2px solid ${winnerColor};
            border-radius: 20px;
            padding: 25px;
            width: 90%;
            max-width: 380px;
            text-align: center;
            box-shadow: 0 0 50px ${winnerColor}33;
            position: relative;
            overflow: hidden;
            max-height: 90vh;
            overflow-y: auto;
        ">
            <!-- Header -->
            <div style="font-size: 10px; color: #888; letter-spacing: 2px; margin-bottom: 15px;">
                DAILY RESULTS • ${new Date(result.date).toLocaleDateString()}
            </div>

            <!-- Winner Section -->
            <div style="margin-bottom: 20px;">
                <div style="font-size: 40px; margin-bottom: 5px;">👑</div>
                <h2 style="margin: 0; color: #fff; font-size: 22px;">${result.winner}</h2>
                <p style="color: ${winnerColor}; margin: 5px 0 0 0; font-weight: bold; font-size: 12px;">Daily Champion</p>
            </div>

            <!-- Song Reveal -->
            <div style="
                background: rgba(255,255,255,0.05);
                border-radius: 12px;
                padding: 12px;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 12px;
                text-align: left;
            ">
                <div style="font-size: 24px;">🎵</div>
                <div>
                    <div style="color: #fff; font-weight: bold; font-size: 14px;">${result.song}</div>
                    <div style="color: #aaa; font-size: 11px;">${result.artist}</div>
                </div>
            </div>

            <!-- ALL TEAMS SCORES -->
            <div style="margin-bottom: 20px;">
                <div style="font-size: 11px; color: #888; margin-bottom: 8px; text-align: left; text-transform: uppercase;">Team Scores (Correct Answers)</div>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    ${scores.map((t, i) => `
                        <div style="
                            display: flex; justify-content: space-between; align-items: center;
                            padding: 8px 12px;
                            background: ${t.name === result.winner ? winnerColor + '22' : 'rgba(255,255,255,0.03)'};
                            border-left: 3px solid ${teamColor(t.name)};
                            border-radius: 6px;
                        ">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 10px; color: #666; width: 15px;">#${i+1}</span>
                                <span style="color: #fff; font-size: 12px; font-weight: ${t.name === result.winner ? 'bold' : 'normal'}">
                                    ${t.name}
                                </span>
                            </div>
                            <span style="color: #fff; font-weight: bold; font-size: 12px;">${t.score}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Global Stats -->
            <div style="
                display: flex; justify-content: space-between; 
                padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);
                margin-bottom: 20px; font-size: 11px; color: #888;
            ">
                <span>Total Correct: <strong style="color:#00ff88">${result.totalCorrect}</strong></span>
                <span>Total Players: <strong style="color:#fff">${result.totalParticipants}</strong></span>
            </div>

            <button onclick="this.closest('.sotd-modal-overlay').remove()" style="
                background: linear-gradient(135deg, ${winnerColor}, #1a1a2e);
                border: 1px solid ${winnerColor};
                color: #fff;
                padding: 12px 0;
                width: 100%;
                border-radius: 12px;
                font-weight: bold;
                cursor: pointer;
                font-size: 13px;
            ">Close</button>
        </div>
    `;

    document.body.appendChild(overlay);

    // Confetti if user won
    if (STATE.data?.profile?.team === result.winner && typeof confetti === 'function') {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
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
    if (!teamInfo) return false;
    
    // Loose helper to handle "TRUE", "Yes", or true
    const is = (val) => {
        if (val === true || val === 1) return true;
        if (typeof val === 'string') {
            const s = val.toUpperCase();
            return s === 'TRUE' || s === 'YES';
        }
        return false;
    };

    return (
        is(teamInfo.trackGoalPassed) &&
        is(teamInfo.albumGoalPassed) &&
        is(teamInfo.album2xPassed) &&
        is(teamInfo.attendanceConfirmed) &&
        is(teamInfo.policeConfirmed)
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
    const passwordField = document.getElementById('admin-password');
    const password = passwordField?.value;
    const errorEl = document.getElementById('admin-error');
    
    // 1. Validation
    if (!password) {
        if (errorEl) { 
            errorEl.textContent = '❌ Please enter password'; 
            errorEl.classList.add('show'); 
        }
        return;
    }
    
    // UI Feedback
    const btn = document.querySelector('.admin-modal-footer button');
    const originalText = btn ? btn.innerHTML : 'Unlock';
    if(btn) { btn.innerHTML = '⏳ Verifying...'; btn.disabled = true; }

    try {
        // 2. ALWAYS HIT THE SERVER. NO LOCAL BYPASS.
        // The server must generate and save the token in the DB, 
        // otherwise future requests (like approving reports) will fail.
        const result = await api('verifyAdmin', { 
            agentNo: STATE.agentNo, 
            password: password 
        });
        
        if (result.success && result.sessionToken) { 
            // 3. Success: Save the REAL server token
            STATE.isAdmin = true;
            STATE.adminSession = result.sessionToken;
            
            localStorage.setItem('adminSession', result.sessionToken);
            localStorage.setItem('adminExpiry', String(Date.now() + 2 * 60 * 60 * 1000)); // 2 hours
            
            closeAdminModal();
            addAdminIndicator();
            showToast('✅ Access Granted', 'success');
            
            // Open panel after short delay
            setTimeout(() => showAdminPanel(), 100);
        } else {
            throw new Error(result.error || 'Invalid Password');
        }

    } catch (e) { 
        console.error('Admin Auth Failed:', e); 
        if (errorEl) { 
            errorEl.textContent = '❌ ' + (e.message || 'Auth Failed'); 
            errorEl.classList.add('show'); 
        }
    } finally {
        if(btn) { btn.innerHTML = originalText; btn.disabled = false; }
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
            <button type="button" class="admin-tab" data-tab="debug">🔧 Diagnostics</button>
            <button type="button" class="admin-tab" data-tab="system">⚙️ System</button>
            <button type="button" class="admin-tab" data-tab="leaves">🛑 On Leave</button> 
            <button type="button" class="admin-tab" data-tab="assets">Badge Preview</button>
            <button type="button" class="admin-tab" data-tab="history">History</button>
        </div>
        <div class="admin-panel-content" id="admin-panel-body">
            <div id="admin-tab-create" class="admin-tab-content active"></div>
            <div id="admin-tab-active" class="admin-tab-content"></div>
            <div id="admin-tab-confirm" class="admin-tab-content"></div>
            <div id="admin-tab-debug" class="admin-tab-content"></div>
            <div id="admin-tab-system" class="admin-tab-content"></div>
            <div id="admin-tab-leaves" class="admin-tab-content"></div>
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
        case 'debug': 
            renderAdminDebugTab(); 
            break;
        case 'system':
            renderAdminSystemTab();
            break;
        case 'leaves':
            loadLeavesAdmin(); 
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
// ==================== UPDATE: ADMIN MODAL WITH FAIL OPTION ====================

function adminApproveMissionForTeam(missionId, teamName) {
    // Show confirmation modal with BOTH Approve and Fail options
    const modal = document.createElement('div');
    modal.className = 'admin-confirm-modal';
    modal.innerHTML = `
        <style>
            .admin-confirm-modal {
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.9); z-index: 9999999;
                display: flex; align-items: center; justify-content: center; padding: 20px;
            }
            .confirm-box {
                background: linear-gradient(145deg, #1a1a2e, #0f0f1f);
                border: 1px solid rgba(123,44,191,0.5);
                border-radius: 16px; padding: 25px; width: 100%; max-width: 400px; text-align: center;
            }
        </style>
        
        <div class="confirm-box" onclick="event.stopPropagation()">
            <h3 style="color:#fff;margin:0 0 10px;">Manage Team Status</h3>
            <p style="color:#888;font-size:13px;margin-bottom:20px;">
                Action for <strong style="color:${teamColor(teamName)}">${teamName}</strong>
            </p>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                <!-- FAIL BUTTON -->
                <button onclick="executeTeamFailure('${missionId}', '${teamName}'); this.closest('.admin-confirm-modal').remove();" style="
                    padding: 15px;
                    background: rgba(255, 68, 68, 0.1);
                    border: 1px solid #ff4444;
                    border-radius: 8px;
                    color: #ff4444;
                    cursor: pointer;
                    font-weight: bold;
                ">
                    ❌ FAIL TEAM
                    <div style="font-size:9px;font-weight:normal;opacity:0.8;margin-top:4px;">No XP Awarded</div>
                </button>
                
                <!-- APPROVE BUTTON -->
                <button onclick="executeTeamApproval('${missionId}', '${teamName}'); this.closest('.admin-confirm-modal').remove();" style="
                    padding: 15px;
                    background: rgba(0, 255, 136, 0.1);
                    border: 1px solid #00ff88;
                    border-radius: 8px;
                    color: #00ff88;
                    cursor: pointer;
                    font-weight: bold;
                ">
                    ✅ APPROVE
                    <div style="font-size:9px;font-weight:normal;opacity:0.8;margin-top:4px;">Award XP</div>
                </button>
            </div>

            <button onclick="this.closest('.admin-confirm-modal').remove()" style="
                margin-top: 15px; background: none; border: none; color: #888; text-decoration: underline; cursor: pointer; font-size: 12px;
            ">Cancel / Close</button>
        </div>
    `;
    
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
}
window.adminApproveMissionForTeam = adminApproveMissionForTeam;
async function loadLeavesAdmin() {
    const container = document.getElementById('admin-tab-leaves');
    if (!container) return;
    
    container.innerHTML = '<div class="loading-text">⏳ Loading leave records...</div>';
    
    try {
        const res = await api('getAgentsOnLeave', { week: STATE.week });
        const agents = res.agents || [];
        
        if (agents.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:40px;color:#888;">
                    <div style="font-size:32px;margin-bottom:10px;">✅</div>
                    <p>No agents on leave for ${STATE.week}</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div style="margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
                <h4 style="color:#fff;margin:0;">🛑 Agents on Leave (${agents.length})</h4>
                <span class="week-badge">${STATE.week}</span>
            </div>
            
            <div class="leaves-list" style="display:flex; flex-direction:column; gap:8px;">
                ${agents.map(a => `
                    <div style="
                        background: #1a1a2e;
                        border: 1px solid ${teamColor(a.team)}44;
                        border-left: 3px solid ${teamColor(a.team)};
                        padding: 12px;
                        border-radius: 8px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <div>
                            <div style="color:#fff; font-weight:bold; font-size:13px;">${sanitize(a.name)}</div>
                            <div style="color:#888; font-size:11px;">${sanitize(a.agentNo)} • ${sanitize(a.team)}</div>
                            <div style="color:#666; font-size:10px; margin-top:2px;">
                                Applied: ${new Date(a.created_at || a.timestamp || Date.now()).toLocaleDateString()}
                            </div>
                        </div>
                        
                        <button onclick="adminRevokeLeave('${a.agentNo}')" style="
                            background: rgba(255,68,68,0.1);
                            border: 1px solid #ff4444;
                            color: #ff4444;
                            padding: 6px 12px;
                            border-radius: 6px;
                            font-size: 11px;
                            cursor: pointer;
                        ">
                            Revoke
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        
    } catch (e) {
        container.innerHTML = `<p class="error-text">Failed to load leaves: ${e.message}</p>`;
    }
}
async function adminRevokeLeave(targetAgentNo) {
    if (!confirm(`⚠️ Revoke leave for ${targetAgentNo}?\nThey will be required to complete missions.`)) return;
    
    loading(true);
    try {
        const result = await api('cancelLeave', {
            agentNo: targetAgentNo,
            week: STATE.week
        });
        
        if (result.success) {
            showToast('✅ Leave revoked successfully', 'success');
            loadLeavesAdmin(); // Refresh list
        } else {
            showToast('❌ Failed: ' + result.error, 'error');
        }
    } catch (e) {
        showToast('Error: ' + e.message, 'error');
    } finally {
        loading(false);
    }
}
window.adminRevokeLeave = adminRevokeLeave;
// ==================== NEW: EXECUTE FAILURE ====================

async function executeTeamFailure(missionId, teamName) {
    if (!confirm(`⚠️ Confirm FAIL for ${teamName}?\n\nThis will mark the mission as 'Failed' for them and they will receive 0 XP.`)) return;

    loading(true);
    try {
        // We call the API with a specific action for failing
        const res = await api('failTeamMission', { 
            missionId: missionId, 
            team: teamName, 
            agentNo: STATE.agentNo, 
            sessionToken: STATE.adminSession 
        });
        
        if (res.success) { 
            showToast(`🚫 ${teamName} marked as FAILED.`, 'info'); 
            loadActiveTeamMissions(); // Reload the list
        } else { 
            showToast('❌ ' + (res.error || 'Failed to update status'), 'error'); 
        }
    } catch (e) { 
        showToast('❌ Error: ' + e.message, 'error'); 
    } finally { 
        loading(false); 
    }
}

// Export to window so HTML onclick can see it
window.executeTeamFailure = executeTeamFailure;
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
    if (!container) return;
    
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
                    Manually Verify Attendance and Police Reports.<br>
                    <span style="color:#ffa500;">Teams must be "PASS" in all 5 checks to win.</span>
                </p>
            </div>

            <!-- Team Cards -->
            ${Object.entries(teams).map(([teamName, info]) => {
                const eligibility = getTeamEligibilityStatus(info);
                const tColor = teamColor(teamName);
                
                return `
                    <div style="background: linear-gradient(145deg, #1a1a2e, #12121a); border: 1px solid ${tColor}44; border-radius: 12px; padding: 18px; margin-bottom: 12px;">
                        <div style="display:flex;align-items:center;gap:12px;margin-bottom:15px;">
                            ${teamPfp(teamName) ? `<img src="${teamPfp(teamName)}" style="width:40px;height:40px;border-radius:50%;border:2px solid ${tColor};">` : ''}
                            <div style="flex:1;">
                                <div style="color:${tColor};font-weight:600;font-size:15px;">${teamName}</div>
                                <div style="color:#888;font-size:11px;">${fmt(info.teamXP || 0)} XP</div>
                            </div>
                            <div style="padding: 4px 12px; border-radius: 12px; font-size: 11px; background: ${eligibility.allPassed ? 'rgba(0,255,136,0.1)' : 'rgba(255,165,0,0.1)'}; color: ${eligibility.allPassed ? '#00ff88' : '#ffa500'};">
                                ${eligibility.passedCount}/${eligibility.totalChecks} ✓
                            </div>
                        </div>
                        
                        <!-- Mission Grid -->
                        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 15px; text-align: center;">
                            <div style="padding:8px;background:rgba(0,0,0,0.2);border-radius:8px;">
                                <div style="font-size:16px;">${info.trackGoalPassed ? '✅' : '❌'}</div>
                                <div style="font-size:8px;color:#666;margin-top:4px;">Tracks</div>
                            </div>
                            <div style="padding:8px;background:rgba(0,0,0,0.2);border-radius:8px;">
                                <div style="font-size:16px;">${info.albumGoalPassed ? '✅' : '❌'}</div>
                                <div style="font-size:8px;color:#666;margin-top:4px;">Albums</div>
                            </div>
                            <div style="padding:8px;background:rgba(0,0,0,0.2);border-radius:8px;">
                                <div style="font-size:16px;">${info.album2xPassed ? '✅' : '❌'}</div>
                                <div style="font-size:8px;color:#666;margin-top:4px;">2X</div>
                            </div>
                            <div style="padding:8px;background:${info.attendanceConfirmed ? 'rgba(0,255,136,0.05)' : 'rgba(255,68,68,0.05)'};border-radius:8px; border:1px solid ${info.attendanceConfirmed ? '#00ff8833' : '#ff444433'}">
                                <div style="font-size:16px;">${info.attendanceConfirmed ? '✅' : '❌'}</div>
                                <div style="font-size:8px;color:#666;margin-top:4px;">Attend</div>
                            </div>
                            <div style="padding:8px;background:${info.policeConfirmed ? 'rgba(0,255,136,0.05)' : 'rgba(255,68,68,0.05)'};border-radius:8px; border:1px solid ${info.policeConfirmed ? '#00ff8833' : '#ff444433'}">
                                <div style="font-size:16px;">${info.policeConfirmed ? '✅' : '❌'}</div>
                                <div style="font-size:8px;color:#666;margin-top:4px;">Police</div>
                            </div>
                        </div>
                        
                        <!-- Smart Pass/Fail Controls -->
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                            <!-- ATTENDANCE -->
                            <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; border: 1px solid #333;">
                                <div style="color: #888; font-size: 10px; margin-bottom: 8px; text-align: center; font-weight: bold;">ATTENDANCE</div>
                                <div style="display: flex; gap: 5px;">
                                    <button onclick="smartUpdateStatus('${teamName}', 'attendanceConfirmed', true)" 
                                        style="flex: 1; padding: 8px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 10px;
                                        background: ${info.attendanceConfirmed ? '#00ff88' : '#222'}; 
                                        color: ${info.attendanceConfirmed ? '#000' : '#666'};">PASS</button>
                                    <button onclick="smartUpdateStatus('${teamName}', 'attendanceConfirmed', false)" 
                                        style="flex: 1; padding: 8px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 10px;
                                        background: ${info.attendanceConfirmed === false ? '#ff4444' : '#222'}; 
                                        color: ${info.attendanceConfirmed === false ? '#fff' : '#666'};">FAIL</button>
                                </div>
                            </div>

                            <!-- POLICE -->
                            <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; border: 1px solid #333;">
                                <div style="color: #888; font-size: 10px; margin-bottom: 8px; text-align: center; font-weight: bold;">POLICE REPORT</div>
                                <div style="display: flex; gap: 5px;">
                                    <button onclick="smartUpdateStatus('${teamName}', 'policeConfirmed', true)" 
                                        style="flex: 1; padding: 8px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 10px;
                                        background: ${info.policeConfirmed ? '#00ff88' : '#222'}; 
                                        color: ${info.policeConfirmed ? '#000' : '#666'};">PASS</button>
                                    <button onclick="smartUpdateStatus('${teamName}', 'policeConfirmed', false)" 
                                        style="flex: 1; padding: 8px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 10px;
                                        background: ${info.policeConfirmed === false ? '#ff4444' : '#222'}; 
                                        color: ${info.policeConfirmed === false ? '#fff' : '#666'};">FAIL</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        `;
        
    } catch (e) {
        console.error('❌ Error loading week confirmation:', e);
        container.innerHTML = `<div style="text-align:center;padding:40px;"><p style="color:#ff4444;">❌ Error loading data</p></div>`;
    }
}

/**
 * Smart Helper for Pass/Fail buttons
 */
async function smartUpdateStatus(teamName, field, value) {
    // Check session
    if (!STATE.adminSession) {
        showToast('⚠️ Session expired. Please re-authenticate.', 'error');
        showAdminLoginModal();
        return;
    }

    const actionLabel = value ? "PASS" : "FAIL";
    const fieldLabel = field === 'attendanceConfirmed' ? "Attendance" : "Police Report";
    
    if (!confirm(`Set ${teamName} to ${actionLabel} for ${fieldLabel}?`)) return;

    loading(true);
    try {
        console.log('📤 Sending updateTeamStatus:', {
            agentNo: STATE.agentNo,
            week: STATE.week,
            team: teamName,
            field: field,
            value: value,
            hasSession: !!STATE.adminSession
        });

        const result = await api('updateTeamStatus', {
            agentNo: STATE.agentNo,
            sessionToken: STATE.adminSession,
            week: STATE.week,
            team: teamName,
            field: field,
            value: value
        });

        console.log('📥 Result:', result);

        if (result.success) {
            showToast(`✅ ${teamName} ${fieldLabel}: ${actionLabel}`, 'success');
            renderWeekConfirmation(); 
        } else {
            showToast('❌ ' + (result.error || 'Update failed'), 'error');
        }
    } catch (e) {
        console.error('Update error:', e);
        showToast('❌ Update Failed: ' + e.message, 'error');
    } finally {
        loading(false);
    }
}

// Make sure it's available globally
window.smartUpdateStatus = smartUpdateStatus;
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
        .hidden-badges-container {
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        }
        .hidden-badges-container.expanded {
        max-height: 2000px; /* Large enough to fit all badges */
        opacity: 1;
        pointer-events: auto;
        margin-bottom: 15px;
        }
    `;
    document.head.appendChild(style);
}
function ensureStreakCSS() {
    if (document.getElementById('streak-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'streak-styles';
    style.textContent = `
        /* ==================== SPY HUD STREAK ==================== */
        
        @keyframes pulseGlow {
            0%, 100% { opacity: 0.6; box-shadow: 0 0 5px currentColor; }
            50% { opacity: 1; box-shadow: 0 0 12px currentColor; }
        }

        @keyframes scanline {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        .streak-widget {
            background: rgba(10, 10, 15, 0.6); /* Very dark, slight see-through */
            border: 1px solid #333;
            border-left: 3px solid #555; /* Default border color */
            border-radius: 4px; /* Sharper corners for tech look */
            padding: 12px 16px;
            margin-bottom: 20px;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            gap: 15px;
            backdrop-filter: blur(5px);
        }

        /* Status Colors */
        .streak-widget.status-active { border-left-color: #ff6b35; }
        .streak-widget.status-done { border-left-color: #00ff88; }
        .streak-widget.status-zero { border-left-color: #444; }

        /* The "Scanline" effect for active streaks */
        .streak-widget.status-active::after {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 50%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 107, 53, 0.05), transparent);
            animation: scanline 3s linear infinite;
            pointer-events: none;
        }

        /* ==================== ICON BOX ==================== */
        .streak-icon-box {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .streak-widget.status-active .streak-icon-box {
            color: #ff6b35;
            border-color: rgba(255, 107, 53, 0.3);
            box-shadow: 0 0 10px rgba(255, 107, 53, 0.1) inset;
            animation: pulseGlow 4s infinite;
        }

        .streak-widget.status-done .streak-icon-box {
            color: #00ff88;
            border-color: rgba(0, 255, 136, 0.3);
            box-shadow: 0 0 10px rgba(0, 255, 136, 0.1) inset;
        }

        .streak-widget.status-zero .streak-icon-box {
            color: #666;
            font-size: 16px;
        }

        /* ==================== INFO AREA ==================== */
        .streak-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .streak-title-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
        }

        .streak-value {
            font-family: 'Courier New', monospace; /* Tech font */
            font-size: 18px;
            font-weight: 700;
            color: #fff;
            letter-spacing: -0.5px;
        }

        .streak-label {
            font-size: 10px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-left: 6px;
        }

        .streak-freeze {
            font-size: 11px;
            color: #00bfff;
            background: rgba(0, 191, 255, 0.08);
            border: 1px solid rgba(0, 191, 255, 0.2);
            padding: 2px 6px;
            border-radius: 4px;
        }

        /* ==================== THIN BAR ==================== */
        .streak-bar-container {
            width: 100%;
            height: 2px; /* Ultra thin */
            background: #222;
            position: relative;
        }

        .streak-bar-fill {
            height: 100%;
            width: 0%;
            background: #555;
            transition: width 0.5s ease;
            position: relative;
        }

        .streak-widget.status-active .streak-bar-fill { background: #ff6b35; box-shadow: 0 0 5px #ff6b35; }
        .streak-widget.status-done .streak-bar-fill { background: #00ff88; box-shadow: 0 0 5px #00ff88; }

        /* Small text below bar */
        .streak-meta {
            font-size: 9px;
            color: #555;
            margin-top: 4px;
            display: flex;
            justify-content: space-between;
        }
    `;
    document.head.appendChild(style);
}
function ensureActivityCSS() {
    if (document.getElementById('activity-styles')) return;
    const style = document.createElement('style');
    style.id = 'activity-styles';
    style.innerHTML = `
        /* Container for the whole widget */
        .activity-ticker-widget {
            margin-top: 15px;
            background: linear-gradient(90deg, #0f0f1f, #1a1a2e);
            border: 1px solid rgba(123, 44, 191, 0.3);
            border-radius: 12px;
            height: 48px;
            display: flex;
            align-items: center;
            overflow: hidden;
            position: relative;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        /* The "LIVE" badge on the left */
        .activity-label {
            background: rgba(123, 44, 191, 0.15);
            color: #00ff88;
            font-size: 10px;
            font-weight: 800;
            padding: 0 12px;
            height: 100%;
            display: flex;
            align-items: center;
            gap: 6px;
            border-right: 1px solid rgba(123, 44, 191, 0.3);
            z-index: 2;
            white-space: nowrap;
        }

        .live-dot {
            width: 6px; height: 6px;
            background: #00ff88;
            border-radius: 50%;
            animation: blinkLive 2s infinite;
        }

        /* The scrolling track */
        .activity-track-wrapper {
            flex: 1;
            overflow: hidden;
            position: relative;
            height: 100%;
            mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
            -webkit-mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
        }

        .activity-track {
            display: flex;
            align-items: center;
            gap: 60px;
            position: absolute;
            white-space: nowrap;
            height: 100%;
            animation: scrollTicker 120s linear infinite; 
            will-change: transform;
            transform: translate3d(0, 0, 0); 
        }

        /* Individual Items */
        .activity-item {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: #ccc;
            text-shadow: 0 0 2px rgba(255,255,255,0.1);
        }

        .activity-highlight { color: #fff; font-weight: 600; }
        .activity-icon { font-size: 14px; }

        /* Animations */
        @keyframes scrollTicker {
            translateX(containerWidth) { transform: translateX(0); }
            100% { transform: translateX(-100%); }
        }

        @keyframes blinkLive {
            0%, 100% { opacity: 1; box-shadow: 0 0 5px #00ff88; }
            50% { opacity: 0.4; box-shadow: none; }
        }

        /* Pause on Hover */
        .activity-ticker-widget:hover .activity-track {
            animation-play-state: paused;
        }
    `;
    document.head.appendChild(style);
}
// ==================== SMART STREAK SYSTEM (IST LOCKED) ====================

const STREAK_KEY = 'bts_streak_state_v2_';

// 🕒 Helper: Get Current Time in IST (Asia/Kolkata)
function getISTDate() {
    // Create date string for IST
    const istString = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    // Convert back to Date object
    return new Date(istString);
}

function getStreakState() {
    const key = STREAK_KEY + STATE.agentNo;
    const saved = localStorage.getItem(key);
    const defaults = {
        currentStreak: 0,
        longestStreak: 0,
        lastLogDate: null,      
        lastVisitDate: null,    
        freezes: 2,
        freezeResetMonth: getISTDate().getMonth(), // Initialize with IST Month
        todayBaseStreams: -1,   
        todayProgress: 0,
        isCompletedToday: false
    };

    if (!saved) return defaults;
    return { ...defaults, ...JSON.parse(saved) };
}

function saveStreakState(state) {
    const key = STREAK_KEY + STATE.agentNo;
    localStorage.setItem(key, JSON.stringify(state));
}

function initStreakTracker() {
    if (!STATE.agentNo) return;

    let s = getStreakState();

    
    // 🇮🇳 FORCE IST TIME CALCULATION
    const istNow = getISTDate();
    const today = istNow.toDateString(); // e.g., "Mon Jan 26 2026" (IST)
    const currentMonth = istNow.getMonth();

    if (!s.lastVisitDate) {
        console.log("Streak initialized for new session.");
        renderStreakWidget(s);
        return;
    }

    // 1. Monthly Freeze Reset (Based on IST Month)
    if (s.freezeResetMonth !== currentMonth) {
        s.freezes = 2; 
        s.freezeResetMonth = currentMonth;
    }

    // 2. Calculate Days Since Last Log
    let diffDays = 0;
    if (s.lastLogDate) {
        const last = new Date(s.lastLogDate); // This string was saved as IST
        // Set hours to 0 to compare purely dates
        last.setHours(0,0,0,0);
        const now = new Date(today);
        now.setHours(0,0,0,0);
        
        diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    }

    // 3. Logic: Handle Missed Days
    if (s.lastLogDate && diffDays > 1) {
        const missedDays = diffDays - 1; 
        
        if (s.freezes >= missedDays) {
            // SAVED BY FREEZE 🧊
            s.freezes -= missedDays;
            showToast(`❄️ Used ${missedDays} Freeze(s) (IST Timing)`, 'info');
            
            // Set last log to yesterday (IST)
            const yesterday = new Date(istNow);
            yesterday.setDate(yesterday.getDate() - 1);
            s.lastLogDate = yesterday.toDateString(); 
        } else {
            // STREAK LOST 💔
            s.currentStreak = 0;
            s.isCompletedToday = false;
            showToast('💔 Streak reset! Missed a day (IST).', 'error');
        }
    }

    // 4. Initialize Today's Stream Baseline
    const totalCurrentStreams = (parseInt(STATE.data?.stats?.trackScrobbles) || 0) + 
                                (parseInt(STATE.data?.stats?.albumScrobbles) || 0);

    // New Day Check (IST)
    if (s.lastVisitDate !== today) {
        s.todayBaseStreams = totalCurrentStreams; 
        s.todayProgress = 0;
        s.isCompletedToday = false;
    } else {
        if (s.todayBaseStreams === -1) s.todayBaseStreams = totalCurrentStreams;
        s.todayProgress = Math.max(0, totalCurrentStreams - s.todayBaseStreams);
    }

    // 5. CHECK FOR COMPLETION
    if (!s.isCompletedToday && s.todayProgress >= STREAK_CONFIG.ACTIVITY_THRESHOLD) {
        s.currentStreak++;
        if (s.currentStreak > s.longestStreak) s.longestStreak = s.currentStreak;
        s.isCompletedToday = true;
        s.lastLogDate = today; // Lock for IST Today
        
        showToast(`🔥 Streak Increased! ${s.currentStreak} Days`, 'success');
        if (typeof confetti === 'function') confetti({ particleCount: 100, origin: { y: 0.7 } });

        // ✅ SYNC TO BACKEND
        api('updateStreak', { 
            agentNo: STATE.agentNo, 
            streak: JSON.stringify({
                current: s.currentStreak,
                longest: s.longestStreak,
                lastActiveDate: today,
                freezesRemaining: s.freezes,
                freezesUsedThisMonth: 0,
                todayCompleted: true,
                history: [] 
            })
        }).catch(e => console.log("Streak sync fail", e));

    } else if (s.isCompletedToday) {
        // Ensure date is locked
        s.lastLogDate = today;
    }

    // 6. Save & Render
    s.lastVisitDate = today;
    saveStreakState(s);
    renderStreakWidget(s);
}

function renderStreakWidget(s) {
    if (!s) s = getStreakState();

    // 1. Safe Container Check
    let container = document.getElementById('streak-widget-container');
    if (!container) {
        const parent = document.querySelector('.quick-stats-section');
        if (parent) {
            container = document.createElement('div');
            container.id = 'streak-widget-container';
            parent.insertBefore(container, parent.firstChild);
        } else {
            return; 
        }
    }

    const target = STREAK_CONFIG.ACTIVITY_THRESHOLD || 10;

    // --- FIX STARTS HERE ---
    // Logic: If isCompletedToday is true, force visual 100%, otherwise calculate math
    let progressPct = 0;
    let progressDisplay = `${s.todayProgress} / ${target}`;

    if (s.isCompletedToday) {
        progressPct = 100; // Force bar to fill
        progressDisplay = `${target} / ${target}`; // Force text to look complete
    } else {
        progressPct = Math.min(100, (s.todayProgress / target) * 100);
    }
    // --- FIX ENDS HERE ---

    // Determine Styling
    let statusClass = "status-zero";
    let icon = "⭕";
    let mainColor = "#666";
    let statusText = "SYSTEM STANDBY";

    if (s.isCompletedToday) {
        statusClass = "status-done";
        icon = "⚡";
        mainColor = "#00ff88";
        statusText = "GOAL COMPLETE";
    } else if (s.currentStreak > 0) {
        statusClass = "status-active";
        icon = "🔥";
        mainColor = "#ff6b35";
        statusText = "STREAK ACTIVE";
    } else {
        statusClass = "status-zero";
        icon = "📡";
        mainColor = "#888";
        statusText = "NO SIGNAL";
    }

    const html = `
        <div class="streak-widget ${statusClass}">
            <div class="streak-icon-box">${icon}</div>
            <div class="streak-info">
                <div class="streak-title-row">
                    <div>
                        <span class="streak-value" style="color:${mainColor}">${s.currentStreak}</span>
                        <span class="streak-label">DAYS</span>
                    </div>
                    <div class="streak-freeze" title="Streak Freezes">🧊 ${s.freezes}</div>
                </div>
                
                <!-- Bar Container -->
                <div class="streak-bar-container">
                    <div class="streak-bar-fill" style="width: ${progressPct}%;"></div>
                </div>

                <!-- Text Below Bar -->
                <div class="streak-meta">
                    <span style="color:${s.isCompletedToday ? '#00ff88' : '#666'}">
                        ${statusText}
                    </span>
                    <span>${progressDisplay}</span>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}
async function updateActivityFeedUI() {
    const container = document.getElementById('activity-widget-container');
    if (!container) return;

    ensureActivityCSS(); // Load CSS

     try {
        // 1. Fetch Activity Feed
        const response = await api('getActivityFeed', { limit: 15 });
        let activities = response.activities || [];

        // 2. Fetch Urgent Announcements
        try {
            const announcementsData = await api('getAnnouncements', { week: STATE.week });
            const urgentNews = announcementsData.announcements.find(a => a.priority === 'high');

            if (urgentNews) {
                activities.unshift({
                    type: 'priority_alert',
                    data: { title: urgentNews.title, link: urgentNews.link }
                });
            }
        } catch (annError) {
            console.warn("Announcement fetch failed", annError);
        }

        // --- 🔥 FIX START: Handle Empty State ---
        if (activities.length === 0) {
            // Instead of hiding, show a placeholder
            activities.push({
                type: 'system_msg',
                data: { text: 'Waiting for live updates...' } 
            });
        }
        // --- 🔥 FIX END ---

        // 3. Filter and Format Items
        const itemsHtml = activities.map(act => {
            const data = act.data || {};
            let icon = '⚡';
            let text = '';
            let tColor = '#7b2cbf';

            switch (act.type) {
                // --- 🚨 PRIORITY ALERTS ---
                case 'priority_alert':
                    icon = '🗳️';
                    text = `<span style="color:#00d4ff; font-weight:800; text-shadow:0 0 10px #00d4ff;">PRIORITY:</span> ${sanitize(data.title)}`;
                    break;

                // --- 🎯 TEAM GOALS ---
                case 'goal_completed':
                    tColor = teamColor(data.team);
                    icon = data.type === 'album2x' ? '✨' : (data.type === 'album' ? '💿' : '🎵');
                    text = `<strong style="color:${tColor}">${sanitize(data.team)}</strong> completed <span class="activity-highlight">${sanitize(data.goal)}</span>!`;
                    break;

                case 'goal_almost':
                    icon = '🚨';
                    text = `<strong style="color:${teamColor(data.team)}">${sanitize(data.team)}</strong> is at <span style="color:#ff4444; font-weight:bold;">${data.percent}%</span> on ${sanitize(data.goal)}! Push!`;
                    break;

                // --- 👑 WINNERS & LEADERS ---
                case 'sotd_winner':
                    tColor = teamColor(data.team);
                    icon = '🧠';
                    text = `<strong style="color:${tColor}">${sanitize(data.team)}</strong> cracked the code for <span class="activity-highlight">${sanitize(data.song)}</span>!`;
                    break;

                case 'leader_update':
                    tColor = teamColor(data.team);
                    icon = '👑';
                    text = `<strong style="color:${tColor}">${sanitize(data.team)}</strong> is currently leading the battle with ${fmt(data.xp)} XP!`;
                    break;

                // --- 🎖️ BADGES ---
                case 'xp_milestone':
                    icon = '🎖️';
                    text = `<span class="activity-highlight">${sanitize(data.name)}</span> earned <span style="color:#ffd700;">${fmt(data.xp)} XP Badge</span>`;
                    break;

                case 'badge_earned': // Fallback for older events
                    icon = '🎖️';
                    text = `<span class="activity-highlight">${sanitize(data.name)}</span> earned <span style="color:#ffd700;">${sanitize(data.badge)}</span>`;
                    break;

                // --- 🕵️ SECRET MISSIONS ---
                case 'secret_mission':
                    tColor = teamColor(data.team);
                    const isFail = (data.title || '').includes('(Failed)');
                    icon = isFail ? '💀' : '🕵️';
                    text = `<strong style="color:${tColor}">${sanitize(data.team)}</strong> ${isFail ? 'failed' : 'completed'}: <span class="activity-highlight">${sanitize(data.title)}</span>`;
                    break;

                // --- 🔥 STREAKS ---
                case 'streak_update':
                    if (data.streak < 7) return ''; // Only show 1 week+
                    icon = '🔥';
                    text = `<span class="activity-highlight">${sanitize(data.name)}</span> hit a <span style="color:#ff6b35; font-weight:bold;">${data.streak}-day</span> streak!`;
                    break;
                
                // --- 🚀 SURGES ---
                case 'team_surge':
                    tColor = teamColor(data.team);
                    icon = '🚀';
                    text = `<strong style="color:${tColor}">${sanitize(data.team)}</strong> is surging! <span class="activity-highlight">${fmt(data.streams)} streams/hr</span>`;
                    break;

                default: return '';
            }

            if (!text) return '';

            return `
                <div class="activity-item">
                    <span class="activity-icon">${icon}</span>
                    <span>${text}</span>
                </div>
            `;
        }).join('<span style="margin:0 15px; color:#333;">|</span>'); // Separator

        if (!itemsHtml) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = `
            <div class="activity-ticker-widget" onclick="STATE._activeAnnouncementsTab='log'; loadPage('announcements');">
                <div class="activity-label">
                    <div class="live-dot"></div>
                    <span>LIVE FEED</span>
                </div>
                <div class="activity-track-wrapper">
                    <div class="activity-track">
                        ${itemsHtml}
                        <!-- Duplicate for seamless scrolling -->
                        <span style="margin:0 15px; color:#333;">|</span>
                        ${itemsHtml}
                    </div>
                </div>
            </div>
        `;

    } catch (e) {
        console.error("Activity Feed Error:", e);
    }
}
// Export to window
window.updateActivityFeedUI = updateActivityFeedUI;
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
    'attendance': 'attendance'
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
    'attendance': 'attendance'
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
    
    // Hide all pages first
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none'; // Ensure hidden
    });
    
    // ✅ FIX: Added ALL potential pages to this list so they are created dynamically if missing
    const dynamicPages = [
        'chat', 'playlists', 'gc-links', 'helper-roles', 'song-of-day', 'sotd',
        'secret-missions', 'announcements', 'drawer', 'goals', 'rankings', 
        'team-level', 'summary', 'comparison', 'album2x', 'profile', 'namjoon', 
        'streaming-tips', 'guide'
    ];

    dynamicPages.forEach(pName => {
        if (pageName === pName && !$(`page-${pName}`)) {
            const mainContent = document.querySelector('.pages-wrapper') || document.querySelector('main') || document.body;
            if (mainContent) {
                const newPage = document.createElement('section');
                newPage.id = `page-${pName}`;
                newPage.className = 'page';
                // Automatically create the content container ID (e.g., 'secret-missions-content')
                newPage.innerHTML = `<div id="${pName}-content"></div>`;
                mainContent.appendChild(newPage);
            }
        }
    });

    const el = $('page-' + pageName);
    if (el) {
        el.classList.add('active');
        el.style.display = 'block'; // Ensure visible
    }
    
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

    // 1. Get inputs from DOM
    const agentNo = $('agent-input')?.value.trim().toUpperCase();
    const password = $('password-input')?.value.trim(); // Make sure you added this ID to your HTML

    // 2. Simple validation
    if (!agentNo || !password) {
        showResult('Enter Agent ID and Access Key', true);
        return;
    }

    loading(true);
    try {
        // 3. Call Supabase Edge Function to verify password
        // This is much more secure than checking a local list
        const res = await api('loginAgent', { agentNo, password });

        if (res.success) {
            // 4. If successful, save to storage
            localStorage.setItem('spyAgent', res.agent.agent_no);
            STATE.agentNo = res.agent.agent_no;
            
            // 5. Initialize session
            checkAdminStatus();
            loadSeenResults();
            await loadDashboard();
            startUnreadCheck();
            
            showToast(`Authentication Successful. Welcome, ${res.agent.name}.`, 'success');
        } else {
            // Handle "Invalid Password" or "Agent Not Found"
            throw new Error(res.error || 'Access Denied');
        }
    } catch (e) {
        showResult(e.message, true);
    } finally {
        loading(false);
    }
}
async function changeAgentPassword() {
    const oldPassword = prompt("Verify current Access Key:");
    if (!oldPassword) return;
    
    const newPassword = prompt("Enter NEW Access Key (min 4 characters):");
    if (!newPassword || newPassword.length < 4) {
        showToast("Invalid Key: Minimum 4 characters required", "error");
        return;
    }

    loading(true);
    try {
        const res = await api('updatePassword', {
            agentNo: STATE.agentNo,
            oldPassword: oldPassword,
            newPassword: newPassword
        });

        if (res.success) {
            showToast("✅ Access Key updated successfully!", "success");
        } else {
            showToast("❌ " + res.error, "error");
        }
    } catch (e) {
        showToast("System Error: Could not update key", "error");
    } finally {
        loading(false);
    }
}

async function handleFind() {
    if (STATE.isLoading) return;
    const handle = $('instagram-input')?.value.trim().toLowerCase().replace('@', '');
    if (!handle) { showResult('Enter Instagram', true); return; }
    loading(true);
    try {
        // Fetch agents from Supabase
        const res = await api('getAllAgents');
        STATE.allAgents = res.agents || [];
        
        // Match using the new column name 'instagram' provided by the Edge Function
        const found = STATE.allAgents.find(a => 
            String(a.instagram || '').toLowerCase().replace('@','') === handle || 
            String(a.name || '').toLowerCase().includes(handle)
        );

        if (!found) throw new Error('Operative not found in database');
        
        showResult(`Agent ID: <strong>${found.agentNo}</strong>`, false);
        if($('agent-input')) $('agent-input').value = found.agentNo;
    } catch (e) { 
        showResult(e.message, true); 
    } finally { 
        loading(false); 
    }
}
// ==================== LOAD DASHBOARD ====================

let notificationInterval = null;

// ==================== LOAD DASHBOARD (LIVE ONLY) ====================
async function loadDashboard() {
    console.log('🏠 Loading dashboard (Live Data)...');
    
    loading(true);
    startHeartbeat();
    
    try {
        const dashboardData = await api('getDashboardData');

        STATE.weeks = dashboardData.availableWeeks || [];
        STATE.week = dashboardData.week || "Week 9";
        
        STATE.data = {
            agentNo: dashboardData.agent.agentNo,
            week: dashboardData.week,
            profile: dashboardData.agent.profile,
            stats: dashboardData.agent.stats,
            rank: dashboardData.agent.rank,
            teamRank: dashboardData.agent.teamRank,
            trackContributions: dashboardData.agent.trackContributions || {},
            albumContributions: dashboardData.agent.albumContributions || {},
            album2xStatus: dashboardData.agent.album2xStatus || { passed: false, tracks: {} },
            teamInfo: {
                resultsReleased: dashboardData.resultsReleased || false
            }
        };
        
        $('login-screen').classList.remove('active');
        $('login-screen').style.display = 'none';
        $('dashboard-screen').classList.add('active');
        $('dashboard-screen').style.display = 'flex';
        
        setupDashboard(); 

        try {
            const streakRes = await api('getStreakData', { agentNo: STATE.agentNo });
            
            if (streakRes.success && streakRes.streak) {
                const key = STREAK_KEY + STATE.agentNo;
                
                // 🔥 CRITICAL FIX: Ensure Dates match exact format required by initStreakTracker
                // Backend sends YYYY-MM-DD. We need to convert to "Sat Feb 07 2026" format
                const dbDateRaw = streakRes.streak.lastActiveDate; // "2026-02-07"
                
                // Create date object, ensuring we don't shift timezones on the date itself
                let formattedDate = null;
                if(dbDateRaw) {
                    const parts = dbDateRaw.split('-'); // [2026, 02, 07]
                    // Construct date manually to avoid timezone shifts: Year, Month (0-index), Day
                    const d = new Date(parts[0], parts[1] - 1, parts[2]); 
                    formattedDate = d.toDateString(); // "Sat Feb 07 2026"
                }

                const streakState = {
                    currentStreak: streakRes.streak.current,
                    longestStreak: streakRes.streak.longest,
                    lastLogDate: formattedDate, 
                    freezes: streakRes.streak.freezesRemaining,
                    // If last active date is TODAY, mark as completed
                    isCompletedToday: formattedDate === new Date().toDateString(),
                    lastVisitDate: new Date().toDateString()
                };

                // 1. Save to Storage
                localStorage.setItem(key, JSON.stringify(streakState));
                
                // 2. Force Update In-Memory State
                Object.assign(STREAK_STATE, streakState);

                console.log('⚡ Streak synced from DB:', streakState);
                
                // 3. Force UI Refresh Immediately
                renderStreakWidget(streakState); 
            }
        } catch (streakErr) {
            console.warn('⚠️ Streak sync failed:', streakErr);
        }

        const currentPage = ROUTER.initialized ? STATE.page : 'home';
        await loadPage(currentPage); 
        
        setTimeout(() => {
            if (typeof initStreakTracker === 'function') initStreakTracker();
            if (typeof updateActivityFeedUI === 'function') {
                updateActivityFeedUI();
                if (window.activityInterval) clearInterval(window.activityInterval);
                window.activityInterval = setInterval(updateActivityFeedUI, 60000);
            }
            if (typeof setupNotificationChecks === 'function') setupNotificationChecks();
            
            loadAllWeeksData();
            checkNotifications();     
        }, 1000);
        
    } catch (e) {
        console.error('❌ Dashboard Load Error:', e);
        showToast('Connection failed.', 'error');
        $('login-screen').classList.add('active');
        $('dashboard-screen').classList.remove('active');
    } finally { 
        loading(false); 
    }
}
function getISTDate() {
    const istString = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    return new Date(istString);
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
        const newData = await api('getDashboardData', { 
            agentNo: STATE.agentNo, 
            week: select.value 
        });
        
        STATE.week = select.value;
        STATE.data = {
            agentNo: newData.agent?.agentNo,
            week: newData.week,
            profile: newData.agent?.profile,
            stats: newData.agent?.stats,
            rank: newData.agent?.rank,
            teamRank: newData.agent?.teamRank,
            trackContributions: newData.agent?.trackContributions || {},
            albumContributions: newData.agent?.albumContributions || {},
            album2xStatus: newData.agent?.album2xStatus || { passed: false, tracks: {} },
            team: newData.team || {},
            trackGoals: newData.trackGoals || {},
            albumGoals: newData.albumGoals || {},
            onLeave: newData.agent?.onLeave || false
        };
        
        STATE.lastUpdated = newData.lastUpdated;
        updateTime();
        await loadPage(STATE.page);
    } catch (e) { 
        showToast('Failed to load week', 'error'); 
    } finally { 
        loading(false); 
    }
};
    
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
}
    if (isAdminAgent()) addAdminIndicator();
    
    const menuBtn = $('menu-btn');
    if (menuBtn) { menuBtn.onclick = null; menuBtn.onclick = e => { e.preventDefault(); e.stopPropagation(); $('sidebar')?.classList.add('open'); }; }
    
    const closeSidebarBtn = $('close-sidebar');
    if (closeSidebarBtn) { closeSidebarBtn.onclick = null; closeSidebarBtn.onclick = e => { e.preventDefault(); e.stopPropagation(); closeSidebar(); }; }
    
    const logoutBtn = $('logout-btn');
    if (logoutBtn) { logoutBtn.onclick = null; logoutBtn.onclick = e => { e.preventDefault(); e.stopPropagation(); logout(); }; }
    
    updateTime();
}
// ==================== FIX FOR LOGOUT ====================

// 1. Define the missing cleanup function
function cleanupStreakAndActivity() {
    // Clear any streak-related timers if they exist
    if (window.streakInterval) {
        clearInterval(window.streakInterval);
        window.streakInterval = null;
    }
    if (window.activityInterval) {
       clearInterval(window.activityInterval);
       window.activityInterval = null;
    }
    console.log('🧹 Streak and activity timers cleaned up');
}

// 2. Updated Robust Logout Function
async function logout() {
    if (!confirm('Are you sure you want to logout?')) return;

    console.log('👋 Logging out...');

    // 1. Try to notify server (don't let failure stop logout)
    try {
        if (STATE.agentNo) {
            await api('removeOnlineUser', { agentNo: STATE.agentNo });
        }
    } catch (e) {
        console.warn('Offline logout:', e);
    }
    
    // 2. Stop all background processes
    if (typeof stopHeartbeat === 'function') stopHeartbeat();
    if (typeof stopUnreadCheck === 'function') stopUnreadCheck();
    
    if (typeof notificationInterval !== 'undefined' && notificationInterval) {
        clearInterval(notificationInterval);
        notificationInterval = null;
    }

    // 3. Clean up UI specific timers
    cleanupStreakAndActivity();
    
    // 4. Reset State
    STATE.agentNo = null;
    STATE.data = null;
    STATE.isAdmin = false;
    
    if (typeof ROUTER !== 'undefined') {
        ROUTER.initialized = false;
        ROUTER.lastRoute = null;
    }
    
    // 5. Clear Storage
    localStorage.removeItem('spyAgent');
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminExpiry');
    
    // 6. Force Navigation & Reload
    try {
        history.replaceState({ page: 'login', route: 'login' }, '', '#/login');
    } catch (e) {
        window.location.hash = '#/login';
    }
    
    window.location.reload();
}

// 3. Re-bind to window and button
window.logout = logout;
window.cleanupStreakAndActivity = cleanupStreakAndActivity;

// Ensure button listener is attached even if DOM loaded earlier
const btn = document.getElementById('logout-btn');
if (btn) {
    btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        logout();
    };
}
// ==================== START APP ====================
document.addEventListener('DOMContentLoaded', initApp);
async function renderHome() {
    const selectedWeek = STATE.week;
    const weekEl = $('current-week');
    if (weekEl) weekEl.textContent = `Week: ${selectedWeek}`;

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
        
        const quickStatsEl = document.querySelector('.quick-stats-section');
        
        if (quickStatsEl) {
            quickStatsEl.innerHTML = `
                ${btsCountdownHtml}
                ${refreshNotice}
                <div id="streak-widget-container"></div>
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
                <div id="activity-widget-container"></div>
            `;
            
            setTimeout(() => {
                if (typeof startBTSCountdown === 'function') startBTSCountdown();
                if (typeof renderStreakWidget === 'function') renderStreakWidget();
                if (typeof updateActivityFeedUI === 'function') updateActivityFeedUI();
            }, 50);
        }

        const trackGoals = goals.trackGoals || {};
        const albumGoals = goals.albumGoals || {};
        const album2xStatus = STATE.data?.album2xStatus || {};
        const allTeamTracks = (CONFIG.getTeamAlbumTracksForWeek) ? CONFIG.getTeamAlbumTracksForWeek(selectedWeek) : {};
        const teamTracks = allTeamTracks[team] || [];
        const tracksCompleted2x = teamTracks.filter(t => (album2xStatus.tracks?.[t]?.count || album2xStatus.tracks?.[t] || 0) >= (CONFIG.ALBUM_CHALLENGE.REQUIRED_STREAMS || 2)).length;
        const isActuallyComplete = teamTracks.length > 0 && tracksCompleted2x === teamTracks.length;
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
        
        // 4. Render Top Agents
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

                // --- 🔒 SECURITY FIX ---
                let displayName = r.name ? sanitize(r.name) : 'Secret Agent';
                
                // If the name is exactly the Agent ID (e.g. AGENT001), hide it
                if (displayName.toUpperCase().startsWith('AGENT')) {
                    displayName = 'Secret Agent';
                }

                // Always use the Team Name provided by the API
                let displayTeam = r.team ? sanitize(r.team) : 'Unknown';

                return `
                <div class="rank-item ${isMe ? 'highlight' : ''}" 
                     style="border-left: 3px solid ${teamColor(r.team)}; cursor:pointer;"
                     onclick="loadPage('rankings')">
                    <div class="rank-num ${rankClass}">${rankContent}</div>
                    <div class="rank-info">
                        <div class="rank-name">
                            ${displayName}
                            ${isMe ? '<span class="you-badge">YOU</span>' : ''}
                        </div>
                        <div class="rank-team" style="color:${teamColor(r.team)}">
                            ${displayTeam}
                        </div>
                    </div>
                    <div class="rank-xp">${fmt(r.totalXP)} XP</div>
                </div>
                `;
            }).join('') : '<p class="empty-text">No data yet</p>';
        }
        
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
                                <div id="hidden-xp-badges" class="hidden-badges-container" style="display: none;">
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
// ==================== PROFILE (FIXED ORDER: LEAVE & RETIRE AT BOTTOM) ====================
async function renderProfile() {
    const container = $('profile-stats');
    if (!container) return;
    
    const stats = STATE.data?.stats || {};
    const album2xStatus = STATE.data?.album2xStatus || {};
    const trackContributions = STATE.data?.trackContributions || {};
    const albumContributions = STATE.data?.albumContributions || {};
    const currentWeekXP = parseInt(stats.totalXP) || 0;
    
    // Check if user is ALREADY on leave
    const isExempt = STATE.data?.album2xStatus?.passed === true && 
                     Object.values(STATE.data?.album2xStatus?.tracks || {}).some(v => v === 'Exempt');

    // Get badges
    const xpBadges = getLevelBadges(STATE.agentNo, currentWeekXP, STATE.week);
    const specialBadges = getSpecialBadges(STATE.agentNo, STATE.week);
    const currentWeekBadges = [...specialBadges, ...xpBadges];
    
    // --- 1. STATS GRID ONLY ---
    let html = `
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

    // ❌ REMOVED: Leave & Delete from here - moved to bottom

    container.innerHTML = html;

    // --- 2. CONTRIBUTIONS ---
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
    
    // --- 3. BADGES ---
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
        badgesHtml += `
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                <button onclick="loadPage('drawer')" class="btn-secondary" style="width:100%; font-size:13px;">
                    🎒 View Full Badge Collection (All Time) →
                </button>
            </div>
        `;
        
        // ✅ ADD LEAVE & RETIRE HERE (After badges, inside badges container)
        badgesHtml += `
            <!-- DIVIDER -->
            <div style="margin-top: 30px; padding-top: 25px; border-top: 2px dashed rgba(255,255,255,0.1);"></div>
            
            <!-- LEAVE REQUEST CARD -->
            <div style="
                margin-top: 15px;
                padding: 15px;
                border: 1px solid ${isExempt ? '#888' : '#ffa500'};
                border-radius: 10px;
                background: linear-gradient(135deg, ${isExempt ? '#333' : '#ffa50015'}, #0a0a0f);
            ">
                <div style="display:flex; flex-wrap:wrap; gap:15px; align-items:center; justify-content:space-between;">
                    <div style="flex:1; min-width:200px;">
                        <div style="color:${isExempt ? '#ccc' : '#ffa500'}; font-weight:700; font-size:13px; letter-spacing:1px; display:flex; align-items:center; gap:6px;">
                            <span>${isExempt ? '💤' : '📝'}</span> 
                            ${isExempt ? 'STATUS: ON LEAVE' : 'APPLY FOR LEAVE'}
                        </div>
                        <div style="color:#aaa; font-size:11px; margin-top:4px; line-height:1.4;">
                            ${isExempt 
                                ? 'You are exempt from missions this week. No XP awarded.' 
                                : 'Can\'t stream this week? Apply for leave to protect your team stats.'}
                        </div>
                    </div>
                    <div style="flex-shrink:0;">
                        ${!isExempt ? `
                        <button onclick="openLeaveModal()" style="
                            background: rgba(255, 165, 0, 0.1);
                            border: 1px solid #ffa500;
                            color: #ffa500;
                            padding: 10px 16px;
                            border-radius: 8px;
                            font-size: 11px;
                            font-weight: bold;
                            cursor: pointer;
                            white-space: nowrap;
                            transition: all 0.2s;
                        ">APPLY</button>
                        ` : `
                        <button onclick="cancelLeaveRequest()" style="
                            background: rgba(255, 68, 68, 0.15);
                            border: 1px solid #ff4444;
                            color: #ff4444;
                            padding: 10px 16px;
                            border-radius: 8px;
                            font-size: 11px;
                            font-weight: bold;
                            cursor: pointer;
                            white-space: nowrap;
                            transition: all 0.2s;
                        ">CANCEL LEAVE</button>
                        `}
                    </div>
                </div>
            </div>

            <!-- DELETE ACCOUNT BUTTON -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px dashed rgba(255, 68, 68, 0.3); text-align: center;">
                <p style="color: #555; font-size: 10px; margin-bottom: 12px;">
                    Leaving permanently? This action cannot be undone.
                </p>
                <button onclick="promptDeleteAccount()" style="
                    background: transparent; 
                    border: 1px solid #ff4444; 
                    color: #ff4444; 
                    padding: 10px 20px; 
                    border-radius: 8px; 
                    font-size: 11px; 
                    font-weight: bold; 
                    cursor: pointer; 
                    opacity: 0.6; 
                    transition: all 0.3s;
                " onmouseover="this.style.opacity='1'; this.style.background='rgba(255,68,68,0.1)'" 
                   onmouseout="this.style.opacity='0.6'; this.style.background='transparent'">
                    ⚠️ RETIRE FROM MISSION (DELETE ACCOUNT)
                </button>
            </div>
        `;
        
        badgesContainer.innerHTML = badgesHtml;
    }
}
// ==================== DELETE ACCOUNT ====================
function promptDeleteAccount() {
    // Remove any existing modals
    document.querySelectorAll('.spy-modal-overlay').forEach(e => e.remove());

    const modal = document.createElement('div');
    modal.className = 'spy-modal-overlay';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.95); z-index: 100000;
        display: flex; align-items: center; justify-content: center;
        backdrop-filter: blur(8px); animation: fadeIn 0.3s ease;
    `;

    modal.innerHTML = `
        <div style="
            background: linear-gradient(145deg, #2a1a1a, #0a0a0f);
            border: 2px solid #ff4444;
            border-radius: 12px;
            padding: 0;
            width: 90%;
            max-width: 380px;
            box-shadow: 0 0 60px rgba(255, 68, 68, 0.3);
            overflow: hidden;
            font-family: sans-serif;
        ">
            <!-- Header -->
            <div style="
                background: rgba(255, 68, 68, 0.2);
                padding: 18px;
                border-bottom: 1px solid rgba(255, 68, 68, 0.4);
                text-align: center;
            ">
                <div style="font-size: 40px; margin-bottom: 8px;">⚠️</div>
                <div style="color: #ff4444; font-weight: bold; font-size: 16px;">RETIRE FROM MISSION?</div>
            </div>

            <!-- Body -->
            <div style="padding: 20px;">
                <p style="color: #fff; font-size: 13px; margin: 0 0 15px 0; line-height: 1.6; text-align: center;">
                    This action will <strong style="color:#ff4444;">permanently delete</strong> your account and all data.
                </p>

                <div style="background: rgba(255,68,68,0.1); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,68,68,0.3);">
                    <div style="color: #ff6666; font-size: 11px; margin-bottom: 8px; font-weight: bold;">⚠️ THIS WILL DELETE:</div>
                    <ul style="margin: 0; padding-left: 18px; color: #ccc; font-size: 12px; line-height: 1.7;">
                        <li>All your streaming stats & XP</li>
                        <li>Your badges and achievements</li>
                        <li>Your streak history</li>
                        <li>Team contributions data</li>
                        <li>Your Agent profile</li>
                    </ul>
                </div>

                <div style="margin-top: 15px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 6px; text-align: center;">
                    <div style="color: #888; font-size: 11px; margin-bottom: 8px;">Enter your password to confirm:</div>
                    <input type="password" id="deleteConfirmPassword" placeholder="Your password" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #444;
                        border-radius: 6px;
                        background: #1a1a1a;
                        color: #fff;
                        text-align: center;
                        font-size: 14px;
                    ">
                </div>
            </div>

            <!-- Footer -->
            <div style="
                padding: 15px;
                border-top: 1px solid rgba(255,255,255,0.1);
                display: flex;
                gap: 10px;
            ">
                <button onclick="document.querySelector('.spy-modal-overlay').remove()" style="
                    flex: 1; padding: 14px; background: #333; 
                    border: none; color: #fff; 
                    border-radius: 8px; cursor: pointer; font-weight: bold;
                ">Cancel</button>
                
                <button onclick="confirmDeleteAccount()" style="
                    flex: 1; padding: 14px; background: #ff4444; 
                    border: none; color: #fff; font-weight: bold; 
                    border-radius: 8px; cursor: pointer;
                ">DELETE FOREVER</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    setTimeout(() => {
        document.getElementById('deleteConfirmPassword')?.focus();
    }, 100);
}

async function confirmDeleteAccount() {
    const input = document.getElementById('deleteConfirmPassword');
    const password = input?.value?.trim();
    
    if (!password) {
        showToast('❌ Please enter your password', 'error');
        input?.focus();
        return;
    }

    // Close modal
    document.querySelector('.spy-modal-overlay')?.remove();
    
    loading(true);
    try {
        // ✅ FIXED: Call 'deleteAccount' (matches your backend)
        const result = await api('deleteAccount', {
            agentNo: STATE.agentNo,
            password: password  // ✅ Backend expects 'password'
        });

        if (result.success) {
            showToast('👋 Account deleted. Thank you for your service, Agent.', 'success');
            
            // Clear local storage
            localStorage.removeItem('agentNo');
            localStorage.removeItem('agentTeam');
            localStorage.removeItem('agentName');
            
            // Redirect to login after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showToast('❌ ' + (result.error || 'Failed to delete account'), 'error');
        }
    } catch (e) {
        showToast('❌ Network Error', 'error');
        console.error(e);
    } finally {
        loading(false);
    }
}

// Export for global access
window.promptDeleteAccount = promptDeleteAccount;
window.confirmDeleteAccount = confirmDeleteAccount;
// ==================== APPLY LEAVE MODAL ====================

function openLeaveModal() {
    // Remove any existing modals
    document.querySelectorAll('.spy-modal-overlay').forEach(e => e.remove());

    const modal = document.createElement('div');
    modal.className = 'spy-modal-overlay';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.9); z-index: 100000;
        display: flex; align-items: center; justify-content: center;
        backdrop-filter: blur(5px); animation: fadeIn 0.3s ease;
    `;

    modal.innerHTML = `
        <div style="
            background: linear-gradient(145deg, #1a1a2e, #0a0a0f);
            border: 1px solid #ffa500;
            border-radius: 12px;
            padding: 0;
            width: 90%;
            max-width: 350px;
            box-shadow: 0 0 40px rgba(255, 165, 0, 0.15);
            overflow: hidden;
            font-family: sans-serif;
        ">
            <!-- Header -->
            <div style="
                background: rgba(255, 165, 0, 0.15);
                padding: 15px;
                border-bottom: 1px solid rgba(255, 165, 0, 0.3);
                display: flex; align-items: center; gap: 10px;
            ">
                <span style="font-size: 20px;">📝</span>
                <span style="color: #ffa500; font-weight: bold; font-size: 14px;">Confirm Leave Application</span>
            </div>

            <!-- Body -->
            <div style="padding: 20px;">
                <p style="color: #fff; font-size: 13px; margin-top: 0; line-height: 1.5;">
                    You are applying for <strong>Leave</strong> for the current week.
                </p>

                <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 6px; margin: 15px 0;">
                    <div style="color: #aaa; font-size: 11px; margin-bottom: 5px; font-weight:bold;">WHAT THIS MEANS:</div>
                    <ul style="margin: 0; padding-left: 20px; color: #ddd; font-size: 12px; line-height: 1.6;">
                        <li>You become <strong>EXEMPT</strong> from Team 2X Mission.</li>
                        <li>Your team will NOT fail because of you.</li>
                        <li>You will earn <strong>0 XP</strong> this week.</li>
                        <!-- ADDED TIMING NOTE HERE -->
                        <li style="margin-top: 8px; color: #ffa500; list-style-type: none; margin-left: -20px; font-style: italic;">
                            ⚠️ <strong>Note:</strong> System updates hourly. Your status will reflect within 1 hour.
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Footer -->
            <div style="
                padding: 15px;
                border-top: 1px solid rgba(255,255,255,0.1);
                display: flex;
                gap: 10px;
            ">
                <button onclick="document.querySelector('.spy-modal-overlay').remove()" style="
                    flex: 1; padding: 12px; background: transparent; 
                    border: 1px solid #444; color: #aaa; 
                    border-radius: 6px; cursor: pointer;
                ">Cancel</button>
                
                <button onclick="confirmLeaveApplication()" style="
                    flex: 1; padding: 12px; background: #ffa500; 
                    border: none; color: #000; font-weight: bold; 
                    border-radius: 6px; cursor: pointer;
                ">Confirm Apply</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

async function confirmLeaveApplication() {
    // Close modal
    document.querySelector('.spy-modal-overlay').remove();
    
    loading(true);
    try {
        const result = await api('applyLeave', {
            agentNo: STATE.agentNo,
            week: STATE.week
        });

        if (result.success) {
            // ✅ Updated Message
            showToast('✅ Application received! Status will update in ~1 hour.', 'success');
            
            // Reload dashboard to reflect changes (if backend updated immediately)
            setTimeout(() => {
                loadDashboard();
            }, 1000);
        } else {
            showToast('❌ ' + (result.error || 'Failed to update status'), 'error');
        }
    } catch (e) {
        showToast('❌ Network Error', 'error');
        console.error(e);
    } finally {
        loading(false);
    }
}

// Export for global access
window.openLeaveModal = openLeaveModal;
window.confirmLeaveApplication = confirmLeaveApplication;
async function cancelLeaveRequest() {
    if (!confirm("⚠️ REACTIVATE STATUS?\n\nAre you sure you want to cancel your leave?\nYou will be required to complete missions again.")) {
        return;
    }

    loading(true);
    try {
        const result = await api('cancelLeave', {
            agentNo: STATE.agentNo,
            week: STATE.week
        });

        if (result.success) {
            showToast('✅ Welcome back, Agent. Leave cancelled.', 'success');
            setTimeout(() => { loadDashboard(); }, 1000);
        } else {
            showToast('❌ ' + (result.error || 'Failed to cancel'), 'error');
        }
    } catch (e) {
        showToast('❌ Network Error', 'error');
    } finally {
        loading(false);
    }
}
window.cancelLeaveRequest = cancelLeaveRequest;
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
    
    const allTeamTracks = CONFIG.getTeamAlbumTracksForWeek(currentWeek);
    const teamTracks = allTeamTracks[team] || [];
    const albumName = CONFIG.TEAMS[team]?.album || team;
    const currentTeamColor = CONFIG.TEAMS[team]?.color || '#7b2cbf';
    
    // Show loading state
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
        
        // Get user tracks (Backend should send 'Exempt' string if on leave)
        userTracks = album2xData.userTracks || {};
        if (Object.keys(userTracks).length === 0) {
            userTracks = STATE.data?.album2xStatus?.tracks || {};
        }
        
        const teamData = album2xData.teams?.[team] || {};
        const allMembers = teamData.members || [];
        
        passedMembers = allMembers.filter(m => m.passed === true);
        failedMembers = allMembers.filter(m => m.passed !== true);
        totalMembers = allMembers.length;
        
    } catch (e) {
        console.error('API Error:', e);
        userTracks = STATE.data?.album2xStatus?.tracks || {};
    }
    
    // Helper to get count, handling case-sensitivity
    function getTrackCount(trackName) {
        const track = String(trackName).trim();
        if (userTracks[track] !== undefined) return userTracks[track];
        
        const trackLower = track.toLowerCase();
        for (const key in userTracks) {
            if (key.toLowerCase() === trackLower) return userTracks[key];
        }
        // Partial match fallback
        for (const key in userTracks) {
            if (key.toLowerCase().includes(trackLower) || trackLower.includes(key.toLowerCase())) return userTracks[key];
        }
        return 0;
    }
    
    let completedCount = 0;
    let isUserExempt = false; // Flag to track if user is on Ghost Protocol

    const trackResults = teamTracks.map((track, i) => {
        const rawCount = getTrackCount(track);
        const rawString = String(rawCount).toLowerCase();
        
        // 🔥 CHECK FOR EXEMPT STATUS
        if (rawString === 'exempt' || rawString === 'leave') {
            completedCount++;
            isUserExempt = true; // User is exempt
            return { name: track, count: 'Exempt', passed: true };
        }

        const count = Number(rawCount) || 0;
        const passed = count >= REQUIRED;
        if (passed) completedCount++;
        return { name: track, count, passed };
    });
    
    const myPassed = completedCount === trackResults.length && trackResults.length > 0;
    const pct = trackResults.length ? Math.round((completedCount / trackResults.length) * 100) : 0;
    const teamAllComplete = failedMembers.length === 0 && totalMembers > 0;
    
    // === UI LOGIC FOR STATUS ===
    let statusBadgeHTML = '';
    let statusBorderColor = currentTeamColor;
    let mainIcon = myPassed ? '🎉' : '⏳';
    let progressBarColor = myPassed ? '#00ff88' : currentTeamColor;

    if (isUserExempt) {
        // 👻 EXEMPT UI
        statusBadgeHTML = `<span style="padding:4px 12px;border-radius:12px;font-size:11px;
            background:rgba(200, 200, 200, 0.15); color:#e0e0e0; border:1px solid #666;">
            👻 Exempt
        </span>`;
        statusBorderColor = '#666'; 
        mainIcon = '👻';
        progressBarColor = '#888'; // Grey bar for ghost mode
    } else if (myPassed) {
        // ✅ COMPLETE UI
        statusBadgeHTML = `<span style="padding:4px 12px;border-radius:12px;font-size:11px;
            background:rgba(0,255,136,0.1); color:#00ff88;">
            ✅ Complete
        </span>`;
        statusBorderColor = '#00ff88';
    } else {
        // ⏳ IN PROGRESS UI
        statusBadgeHTML = `<span style="padding:4px 12px;border-radius:12px;font-size:11px;
            background:rgba(255,165,0,0.1); color:#ffa500;">
            ⏳ In Progress
        </span>`;
    }
    
    // Render
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
        <div class="card" style="border-color:${statusBorderColor}">
            <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
                <h3 style="margin:0;">📊 Your Progress</h3>
                ${statusBadgeHTML}
            </div>
            <div class="card-body" style="text-align:center;padding:25px;">
                <div style="font-size:50px;margin-bottom:15px;">${mainIcon}</div>
                <div style="font-size:42px;font-weight:700;color:${isUserExempt ? '#ccc' : (myPassed ? '#00ff88' : '#7b2cbf')}">
                    ${completedCount}/${trackResults.length}
                </div>
                <p style="color:#888;margin:5px 0 15px;">tracks completed</p>
                <div style="background:#222;border-radius:10px;height:12px;max-width:280px;margin:0 auto;overflow:hidden;">
                    <div style="height:100%;width:${pct}%;background:${progressBarColor};transition:width 0.3s;"></div>
                </div>
                
                ${isUserExempt ? `
                    <div style="margin-top:20px;padding:12px 20px;background:rgba(255,255,255,0.05);border:1px solid #444;border-radius:10px;display:inline-flex;align-items:center;gap:10px;">
                        <span style="font-size:22px;">🛡️</span>
                        <span style="color:#ccc;font-weight:600;font-size:12px;">Ghost Protocol Active (0 XP)</span>
                    </div>
                ` : myPassed ? `
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
                        background:${t.passed ? (isUserExempt ? 'rgba(100,100,100,0.1)' : 'rgba(0,255,136,0.05)') : 'rgba(255,255,255,0.02)'};
                        border-left:3px solid ${t.passed ? (isUserExempt ? '#888' : '#00ff88') : '#ff6b6b'};border-radius:6px;">
                        <span style="width:22px;height:22px;background:${t.passed ? (isUserExempt ? '#888' : '#00ff88') : '#333'};
                            color:${t.passed ? '#000' : '#666'};border-radius:50%;display:flex;
                            align-items:center;justify-content:center;font-size:10px;font-weight:bold;margin-right:10px;">
                            ${i + 1}
                        </span>
                        <span style="flex:1;color:${isUserExempt ? '#aaa' : '#fff'};font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                            ${sanitize(t.name)}
                        </span>
                        <span style="padding:4px 10px;border-radius:10px;font-size:11px;font-weight:600;margin-left:8px;
                            background:${t.passed ? (isUserExempt ? 'rgba(100,100,100,0.2)' : 'rgba(0,255,136,0.15)') : 'rgba(255,68,68,0.15)'};
                            color:${t.passed ? (isUserExempt ? '#ccc' : '#00ff88') : '#ff6b6b'};">
                            ${t.count === 'Exempt' ? 'Exempt' : `${t.count}/${REQUIRED}`} ${t.passed ? '✓' : ''}
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
                    <p style="color:#888;text-align:center;padding:20px;">Loading team data...</p>
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
                    
                    <!-- FAILED MEMBERS (RED BOX) -->
                    ${failedMembers.length > 0 ? `
                        <div style="background:rgba(255,68,68,0.08);border-radius:10px;padding:12px;margin-bottom:12px;">
                            <div style="color:#ff6b6b;font-size:12px;font-weight:600;margin-bottom:8px;">
                                🚨 Need to Complete (${failedMembers.length})
                            </div>
                            <div style="display:flex;flex-wrap:wrap;gap:6px;max-height:200px;overflow-y:auto;">
                                ${failedMembers.slice(0, 50).map(m => {
                                    let dName = m.name || 'Secret Agent';
                                    if(dName.toUpperCase().startsWith('AGENT')) dName = 'Secret Agent';
                                     return `
                                    <span style="display:inline-flex;align-items:center;gap:5px;padding:5px 10px;
                                        background:rgba(255,68,68,0.1);border-radius:6px;font-size:11px;color:#fff;">
                                        ❌ ${sanitize(dName)}
                                    </span>
                                     `;
                                }).join('')}
                                ${failedMembers.length > 50 ? `<span style="color:#888;font-size:11px;padding:5px;">+${failedMembers.length - 50} more</span>` : ''}
                            </div>
                        </div>
                    ` : ''}

                    <!-- COMPLETED MEMBERS (GREEN BOX - RESTORED) -->
                    ${passedMembers.length > 0 ? `
                        <div style="background:rgba(0, 255, 136, 0.08); border-radius:10px; padding:12px; margin-top:12px;">
                            <div style="color:#00ff88; font-size:12px; font-weight:600; margin-bottom:8px;">
                                ✅ Completed Agents (${passedMembers.length})
                            </div>
                            <div style="display:flex; flex-wrap:wrap; gap:6px; max-height:200px; overflow-y:auto;">
                                ${passedMembers.slice(0, 50).map(m => {
                                    let dName = m.name || 'Secret Agent';
                                    if(dName.toUpperCase().startsWith('AGENT')) dName = 'Secret Agent';
                                    return `
                                    <span style="display:inline-flex; align-items:center; gap:5px; padding:5px 10px;
                                        background:rgba(0, 255, 136, 0.1); border-radius:6px; font-size:11px; color:#fff;">
                                        ✨ ${sanitize(dName)}
                                    </span>
                                    `;
                                }).join('')}
                                ${passedMembers.length > 50 ? `<span style="color:#888;font-size:11px;padding:5px;">+${passedMembers.length - 50} more</span>` : ''}
                            </div>
                        </div>
                    ` : ''}
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
            let rankClass = '';
            let rankContent = i + 1;
            
            if (i === 0) { rankClass = 'rank-1'; rankContent = '🥇'; }
            else if (i === 1) { rankClass = 'rank-2'; rankContent = '🥈'; }
            else if (i === 2) { rankClass = 'rank-3'; rankContent = '🥉'; }

            // 🔒 SECURITY FIX: Hide Agent Numbers
            // If name is missing OR name starts with "AGENT", hide it.
            let displayName = r.name ? sanitize(r.name) : 'Secret Agent';
            if (displayName.toUpperCase().startsWith('AGENT')) {
                displayName = 'Secret Agent';
            }

            return `
            <div class="rank-item ${isMe ? 'highlight' : ''}" style="border-left: 3px solid ${tColor};">
                <div class="rank-num ${rankClass}">${rankContent}</div>
                
                <div class="rank-info">
                    <div class="rank-name">
                        ${displayName}
                        ${isMe ? '<span class="you-badge">YOU</span>' : ''}
                    </div>
                    <div class="rank-team" style="color: ${tColor};">
                        ${r.team ? r.team.replace('Team ', '') : 'Unknown'}
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
        const data = await api('getRankings', { week: STATE.week, limit: 1000 });
        if (data.lastUpdated) STATE.lastUpdated = data.lastUpdated;
        
        const teamMembers = (data.rankings || []).filter(r => 
            r.team && r.team.trim() === myTeam.trim()
        );
        
        teamMembers.sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0));
        
        if (teamMembers.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-icon">👥</div><p>No team data available</p></div>';
            return;
        }

        const rankingsHtml = teamMembers.map((r, i) => {
            const isMe = String(r.agentNo) === String(STATE.agentNo);
            const tColor = teamColor(myTeam);
            let rankClass = '';
            let rankContent = i + 1;
            
            if (i === 0) { rankClass = 'rank-1'; rankContent = '🥇'; }
            else if (i === 1) { rankClass = 'rank-2'; rankContent = '🥈'; }
            else if (i === 2) { rankClass = 'rank-3'; rankContent = '🥉'; }

            // 🔒 SECURITY FIX: Hide Agent Numbers
            let displayName = r.name ? sanitize(r.name) : 'Secret Agent';
            if (displayName.toUpperCase().startsWith('AGENT')) {
                displayName = 'Secret Agent';
            }

            return `
            <div class="rank-item ${isMe ? 'highlight' : ''}" style="border-left: 3px solid ${tColor};">
                <div class="rank-num ${rankClass}">${rankContent}</div>
                
                <div class="rank-info">
                    <div class="rank-name">
                        ${displayName}
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
// ==================== ULTIMATE SUMMARY (ENHANCED) ====================
async function renderSummary() {
    const container = document.getElementById('summary-content'); 
    if (!container) return;
    
    container.style.overflowX = 'hidden';
    container.style.width = '100%';
    
    const selectedWeek = STATE.week;
    const isCompleted = isWeekCompleted(selectedWeek);
    
    // --- 1. LOCKED VIEW ---
    if (!isCompleted) {
        container.innerHTML = `
            <div style="text-align:center; padding:60px 30px; background:rgba(123,44,191,0.05); border:1px solid rgba(123,44,191,0.3); border-radius:16px;">
                <div style="font-size:50px; margin-bottom:20px; filter:grayscale(50%);">⏳</div>
                <h2 style="color:#fff; font-size:18px; margin:0 0 10px;">Mission in Progress</h2>
                <p style="color:#666; font-size:12px; margin:0;">Intel report pending end of week.</p>
            </div>`;
        return;
    }

    // --- 2. ADMIN RELEASE CHECK ---
    const isReleased = STATE.data?.resultsReleased === true || STATE.data?.teamInfo?.resultsReleased === true;
    if (!isReleased) {
        container.innerHTML = `
            <div style="text-align:center; padding:60px 30px; background:rgba(255,165,0,0.03); border:1px solid rgba(255,165,0,0.3); border-radius:16px;">
                <div style="font-size:50px; margin-bottom:20px;">🔒</div>
                <h3 style="color:#fff; font-size:16px; margin:0 0 10px;">Verification in Progress</h3>
                <p style="color:#666; font-size:11px; margin:0; line-height:1.5;">HQ is verifying Attendance & Police Reports.</p>
            </div>`;
        return; 
    }
    
    // Loading State (improved)
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:15px; padding:20px 0;">
            <div style="height:200px; background:linear-gradient(90deg, #1a1a2e 25%, #252540 50%, #1a1a2e 75%); border-radius:16px; animation:shimmer 1.5s infinite;"></div>
            <div style="height:100px; background:linear-gradient(90deg, #1a1a2e 25%, #252540 50%, #1a1a2e 75%); border-radius:12px; animation:shimmer 1.5s infinite;"></div>
        </div>
        <style>@keyframes shimmer{0%{background-position:-200px 0}100%{background-position:200px 0}}</style>
    `;
    
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
        const myTeam = STATE.data?.profile?.team;
        
        const sortedTeams = Object.entries(teams).sort((a, b) => (b[1].teamXP || 0) - (a[1].teamXP || 0));
        const winnerEntry = sortedTeams.find(([t, info]) => info.isWinner === true);
        const winner = winnerEntry ? winnerEntry[0] : null;

        // Math for Stats
        let totalTrackStreams = 0; let totalAlbumStreams = 0;
        const trackStats = []; const albumStats = [];
        Object.entries(trackGoals).forEach(([name, info]) => {
            let t = 0; Object.values(info.teams || {}).forEach(s => t += (s.current || 0));
            totalTrackStreams += t; trackStats.push({ name, total: t });
        });
        Object.entries(albumGoals).forEach(([name, info]) => {
            let t = 0; Object.values(info.teams || {}).forEach(s => t += (s.current || 0));
            totalAlbumStreams += t; albumStats.push({ name, total: t });
        });
        trackStats.sort((a,b) => b.total - a.total);
        albumStats.sort((a,b) => b.total - a.total);

        const dateStr = CONFIG.WEEK_DATES[selectedWeek] ? new Date(CONFIG.WEEK_DATES[selectedWeek]).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

        // --- RENDER HTML ---
        container.innerHTML = `
            <!-- Header Section (Cleaner) -->
            <div style="text-align:center; padding: 25px 0 30px;">
                <div style="color:#7b2cbf; font-size:10px; font-weight:800; letter-spacing:4px; text-transform:uppercase; opacity:0.8;">Post-Action Report</div>
                <h1 style="color:#fff; font-size:28px; font-weight:900; margin:8px 0 0; letter-spacing:1px;">${selectedWeek} RESULTS</h1>
            </div>

            <!-- 🏆 WINNER BANNER (if exists) -->
            ${winner ? `
                <div style="background:linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.05) 100%); border:1px solid rgba(255,215,0,0.3); border-radius:16px; padding:25px; text-align:center; margin-bottom:25px; position:relative; overflow:hidden;">
                    <div style="position:absolute; top:0; left:0; width:100%; height:2px; background:linear-gradient(90deg, transparent, #ffd700, transparent);"></div>
                    <div style="font-size:36px; margin-bottom:10px;">🏆</div>
                    <div style="color:#ffd700; font-size:10px; font-weight:800; letter-spacing:3px; margin-bottom:5px;">MISSION VICTOR</div>
                    <div style="color:#fff; font-size:24px; font-weight:900; text-shadow:0 0 20px rgba(255,215,0,0.3);">${winner}</div>
                </div>
            ` : ''}

            <!-- ⬡ GHOST PROTOCOL (if no winner) -->
            ${!winner ? `
                <div style="background:rgba(255,255,255,0.02); border:1px solid #2a2a3a; border-radius:12px; padding:25px; text-align:center; margin-bottom:25px; position:relative; overflow:hidden;">
                    <div style="position:absolute; top:0; left:0; width:100%; height:2px; background:linear-gradient(90deg, transparent, #ff4444, transparent);"></div>
                    <div style="color:#ff4444; font-weight:800; font-size:11px; letter-spacing:3px; margin-bottom:8px;">⬡ EXTRACTION FAILED</div>
                    <div style="color:#555; font-size:11px; line-height:1.6;">All units fell short of full clearance.<br><span style="color:#777;">Trophy remains secured at HQ.</span></div>
                </div>
            ` : ''}

            <!-- 📸 SHAREABLE POSTER CARD -->
            <div id="shareable-stats-card" style="background:#0a0a0f; border:1px solid #2a2a3a; border-radius:20px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.4); margin:0 auto 25px; box-sizing:border-box;">
                
                <!-- Poster Header -->
                <div style="background:linear-gradient(135deg, #4a1a7a 0%, #7b2cbf 100%); padding:30px 20px; text-align:center;">
                    <div style="color:rgba(255,255,255,0.6); font-size:9px; font-weight:700; letter-spacing:4px; text-transform:uppercase; margin-bottom:8px;">
                        Intelligence Report
                    </div>
                    <div style="color:#fff; font-size:20px; font-weight:900; letter-spacing:1px;">
                        BTS COMEBACK MISSION
                    </div>
                    <div style="margin-top:12px; color:rgba(255,255,255,0.5); font-size:11px; font-family:monospace;">
                        ${dateStr}
                    </div>
                </div>

                <!-- Grand Total Section -->
                <div style="padding:35px 20px; text-align:center; background:linear-gradient(180deg, rgba(123,44,191,0.1) 0%, transparent 100%);">
                    <div style="color:#666; font-size:10px; font-weight:700; letter-spacing:3px; margin-bottom:10px;">WEEKLY MISSION OUTPUT</div>
                    <div style="color:#ffd700; font-size:56px; font-weight:900; line-height:1; text-shadow:0 0 30px rgba(255,215,0,0.3); font-family:'Arial Black',sans-serif;">${fmt(totalTrackStreams + totalAlbumStreams)}</div>
                    <div style="color:#ffd700; font-size:11px; font-weight:700; margin-top:10px; letter-spacing:2px; opacity:0.8;">STREAMS RECORDED</div>
                </div>

                <!-- Divider -->
                <div style="height:1px; background:linear-gradient(90deg, transparent, #333, transparent); margin:0 20px;"></div>

                <!-- Two Column Grid -->
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; padding:25px 20px;">
                    
                    <!-- Track Column -->
                    <div style="min-width:0;">
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:15px; padding-bottom:10px; border-bottom:1px solid #222;">
                            <span style="color:#00ff88; font-size:14px;">🎵</span>
                            <div>
                                <div style="color:#00ff88; font-size:9px; font-weight:800; letter-spacing:1px;">TRACKS</div>
                                <div style="color:#fff; font-size:14px; font-weight:900; font-family:monospace;">${fmt(totalTrackStreams)}</div>
                            </div>
                        </div>
                        ${trackStats.slice(0, 5).map(s => `
                            <div style="margin-bottom:10px;">
                                <div style="color:#888; font-size:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${s.name}</div>
                                <div style="color:#fff; font-size:13px; font-weight:bold; font-family:monospace;">${fmt(s.total)}</div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Album Column -->
                    <div style="min-width:0;">
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:15px; padding-bottom:10px; border-bottom:1px solid #222;">
                            <span style="color:#00d4ff; font-size:14px;">💿</span>
                            <div>
                                <div style="color:#00d4ff; font-size:9px; font-weight:800; letter-spacing:1px;">ALBUMS</div>
                                <div style="color:#fff; font-size:14px; font-weight:900; font-family:monospace;">${fmt(totalAlbumStreams)}</div>
                            </div>
                        </div>
                        ${albumStats.slice(0, 5).map(s => `
                            <div style="margin-bottom:10px;">
                                <div style="color:#888; font-size:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${s.name}</div>
                                <div style="color:#fff; font-size:13px; font-weight:bold; font-family:monospace;">${fmt(s.total)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Footer -->
                <div style="background:#0d0d12; padding:15px; text-align:center; border-top:1px solid #1a1a2a;">
                    <div style="color:#444; font-size:9px; font-weight:700; letter-spacing:3px;">HOPETRACKER</div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:35px;">
                <button onclick="shareStats()" id="share-btn" style="height:50px; border-radius:12px; font-size:12px; font-weight:700; background:linear-gradient(135deg, #7b2cbf, #5a1f99); border:none; color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
                    📸 Save Poster
                </button>
                <button onclick="copyShareText()" style="height:50px; border-radius:12px; font-size:12px; font-weight:700; background:#1a1a2e; border:1px solid #333; color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
                    📋 Copy Caption
                </button>
            </div>

            <!-- Section Divider -->
            <div style="display:flex; align-items:center; gap:15px; margin-bottom:20px;">
                <div style="flex:1; height:1px; background:#222;"></div>
                <div style="color:#555; font-size:9px; font-weight:700; letter-spacing:2px;">TEAM INTEL</div>
                <div style="flex:1; height:1px; background:#222;"></div>
            </div>

            <!-- 📊 TEAM STANDINGS -->
            <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:35px;">
                ${sortedTeams.map(([t, info], i) => {
                    const missionsPassed = info.trackGoalPassed && info.albumGoalPassed && info.album2xPassed;
                    let failures = [];
                    if (!missionsPassed) failures.push("Missions");
                    if (!info.attendanceConfirmed) failures.push("Attendance");
                    if (!info.policeConfirmed) failures.push("Police");
                    const isQualified = failures.length === 0;
                    const isWinner = info.isWinner === true;

                    return `
                        <div style="background:${isWinner ? 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,215,0,0.02))' : '#111118'}; border-radius:14px; padding:16px; display:flex; align-items:center; gap:12px; border:1px solid ${isWinner ? 'rgba(255,215,0,0.3)' : isQualified ? 'rgba(0,255,136,0.15)' : 'rgba(255,68,68,0.1)'};">
                            
                            <!-- Rank -->
                            <div style="width:28px; height:28px; border-radius:8px; background:${i===0?'linear-gradient(135deg,#ffd700,#ffaa00)':i===1?'linear-gradient(135deg,#c0c0c0,#888)':i===2?'linear-gradient(135deg,#cd7f32,#a0522d)':'#222'}; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:12px; color:${i<3?'#000':'#666'};">
                                ${i+1}
                            </div>
                            
                            <!-- Team Info -->
                            <div style="flex:1; min-width:0;">
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <span style="color:${teamColor(t)}; font-weight:800; font-size:14px;">${t}</span>
                                    ${isWinner ? '<span style="font-size:14px;">🏆</span>' : ''}
                                </div>
                                <div style="margin-top:4px;">
                                    ${isQualified ? 
                                        `<span style="color:#00ff88; font-size:9px; font-weight:700; padding:2px 6px; background:rgba(0,255,136,0.1); border-radius:4px;">✓ CLEARED</span>` : 
                                        `<span style="color:#ff6666; font-size:9px; font-weight:600;">${failures.join(' • ')}</span>`
                                    }
                                </div>
                            </div>
                            
                            <!-- XP -->
                            <div style="text-align:right;">
                                <div style="color:#fff; font-size:16px; font-weight:900; font-family:monospace;">${fmt(info.teamXP)}</div>
                                <div style="color:#444; font-size:8px; font-weight:600; letter-spacing:1px;">XP</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Section Divider -->
            <div style="display:flex; align-items:center; gap:15px; margin-bottom:20px;">
                <div style="flex:1; height:1px; background:#222;"></div>
                <div style="color:#555; font-size:9px; font-weight:700; letter-spacing:2px;">ELITE AGENTS</div>
                <div style="flex:1; height:1px; background:#222;"></div>
            </div>

            <!-- 🏆 TOP AGENTS -->
            <div style="background:#111118; border-radius:16px; overflow:hidden; margin-bottom:30px; border:1px solid #1a1a2a;">
                ${topAgents.slice(0, 5).map((agent, i) => `
                    <div style="display:flex; align-items:center; gap:12px; padding:14px 16px; border-bottom:1px solid #1a1a2a;">
                        <div style="font-size:18px; width:28px; text-align:center;">${i===0?'🥇':i===1?'🥈':i===2?'🥉':`<span style="color:#444; font-weight:bold;">${i+1}</span>`}</div>
                        <div style="flex:1; min-width:0;">
                            <div style="color:#fff; font-weight:700; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${sanitize(agent.name || 'Agent')}</div>
                            <div style="color:${teamColor(agent.team)}; font-size:10px; font-weight:600;">${agent.team}</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="color:#fff; font-weight:800; font-size:14px; font-family:monospace;">${fmt(agent.totalXP)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Back Button -->
            <button onclick="loadPage('home')" style="width:100%; height:55px; border-radius:14px; font-weight:700; font-size:13px; letter-spacing:1px; background:#0d0d12; border:1px solid #222; color:#888; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;">
                ← Back to Command Center
            </button>
        `;
        
        markResultsSeen(selectedWeek);
        if (winner && typeof confetti === 'function') confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

    } catch (e) { 
        console.error('Summary error:', e);
        container.innerHTML = `
            <div style="text-align:center; padding:50px 20px;">
                <div style="font-size:40px; margin-bottom:15px;">⚠️</div>
                <h3 style="color:#fff; font-size:16px; margin:0 0 10px;">Data Decryption Failed</h3>
                <button onclick="renderSummary()" style="margin-top:15px; padding:12px 30px; background:#7b2cbf; border:none; border-radius:10px; color:#fff; font-weight:700; cursor:pointer;">Retry</button>
            </div>
        `; 
    }
}
function copyShareText() {
    const week = STATE.week || 'Week';
    const text = `🎵 BTS Comeback Mission ${week} Complete!

💜 We streamed together for BTS!

#BTS #BTSComeback #ARMY`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => showToast('📋 Caption copied!', 'success'))
            .catch(() => fallbackCopyText(text));
    } else {
        fallbackCopyText(text);
    }
}

function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showToast('📋 Caption copied!', 'success');
    } catch (e) {
        showToast('Copy failed', 'error');
    }
    document.body.removeChild(textarea);
}

window.copyShareText = copyShareText;
// ==================== SAVE POSTER TO GALLERY (FIXED) ====================
async function shareStats() {
    const card = document.getElementById('shareable-stats-card');
    if (!card) {
        showToast('Poster not found', 'error');
        return;
    }

    // Get button reference
    const btn = event?.target?.closest('button');
    const originalText = btn?.innerHTML || '';
    
    // Show loading
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '⏳ Generating...';
    }

    try {
        // Check if html2canvas is loaded
        if (typeof html2canvas === 'undefined') {
            throw new Error('html2canvas not loaded');
        }

        // Clone the card to avoid styling issues
        const clone = card.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        clone.style.top = '0';
        clone.style.width = card.offsetWidth + 'px';
        document.body.appendChild(clone);

        // Generate canvas with fixed settings
        const canvas = await html2canvas(clone, {
            backgroundColor: '#0a0a0f',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            width: card.offsetWidth,
            height: card.offsetHeight,
            onclone: function(clonedDoc) {
                // Ensure styles are applied
                const clonedCard = clonedDoc.getElementById('shareable-stats-card');
                if (clonedCard) {
                    clonedCard.style.transform = 'none';
                    clonedCard.style.boxShadow = 'none';
                }
            }
        });

        // Remove clone
        document.body.removeChild(clone);

        // Convert to blob
        canvas.toBlob(async (blob) => {
            if (!blob) {
                showToast('Failed to generate image', 'error');
                return;
            }

            const file = new File([blob], `hopetracker-${STATE.week || 'stats'}.png`, { type: 'image/png' });

            // Try Web Share API (mobile)
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'HopeTracker Stats',
                        text: 'BTS Streaming Stats 💜'
                    });
                    showToast('Shared successfully!', 'success');
                } catch (shareError) {
                    if (shareError.name !== 'AbortError') {
                        downloadFromCanvas(canvas);
                    }
                }
            } else {
                // Fallback: Download
                downloadFromCanvas(canvas);
            }
        }, 'image/png', 1.0);

    } catch (e) {
        console.error('Image generation error:', e);
        
        // Fallback: Open simple version
        openSimpleImage();
        
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }
}

// ==================== DOWNLOAD HELPER ====================
function downloadFromCanvas(canvas) {
    try {
        const link = document.createElement('a');
        link.download = `hopetracker-${STATE.week || 'stats'}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('📥 Image saved!', 'success');
    } catch (e) {
        console.error('Download error:', e);
        openImageInNewTab(canvas);
    }
}

// ==================== OPEN IN NEW TAB ====================
function openImageInNewTab(canvas) {
    try {
        const imageData = canvas.toDataURL('image/png');
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>HopeTracker Stats</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { 
                            background: #000; 
                            min-height: 100vh; 
                            display: flex; 
                            flex-direction: column;
                            align-items: center; 
                            justify-content: center; 
                            padding: 20px;
                            font-family: -apple-system, sans-serif;
                        }
                        img { 
                            max-width: 100%; 
                            height: auto; 
                            border-radius: 16px;
                            box-shadow: 0 10px 40px rgba(123,44,191,0.3);
                        }
                        p { 
                            color: #888; 
                            font-size: 14px; 
                            margin-top: 20px; 
                            text-align: center;
                        }
                        .emoji { font-size: 24px; margin-bottom: 10px; }
                    </style>
                </head>
                <body>
                    <img src="${imageData}" alt="HopeTracker Stats">
                    <p><span class="emoji">📱</span><br>Long-press image to save to gallery</p>
                </body>
                </html>
            `);
            newWindow.document.close();
            showToast('Long-press to save', 'info');
        } else {
            showToast('Popup blocked - check browser settings', 'error');
        }
    } catch (e) {
        console.error('New tab error:', e);
        showToast('Could not open image', 'error');
    }
}

// ==================== SIMPLE FALLBACK ====================
function openSimpleImage() {
    showToast('Opening save option...', 'info');
    
    // Take screenshot instructions
    const modal = document.getElementById('modal-container');
    const modalBody = document.getElementById('modal-body');
    
    if (modal && modalBody) {
        modalBody.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 15px;">📸</div>
                <h3 style="color: #fff; margin-bottom: 15px;">Save Your Stats</h3>
                <p style="color: #aaa; font-size: 13px; line-height: 1.6; margin-bottom: 20px;">
                    Take a screenshot of the stats card above!
                </p>
                <div style="background: #1a1a2e; border-radius: 12px; padding: 15px; text-align: left;">
                    <p style="color: #00ff88; font-size: 12px; margin-bottom: 8px;"><strong>📱 iPhone:</strong> Side + Volume Up</p>
                    <p style="color: #00d4ff; font-size: 12px; margin-bottom: 8px;"><strong>📱 Android:</strong> Power + Volume Down</p>
                    <p style="color: #ffd700; font-size: 12px;"><strong>💻 Desktop:</strong> Scroll to card, use Snipping Tool</p>
                </div>
                <button onclick="closeModal()" class="btn-primary" style="margin-top: 20px; width: 100%;">Got it!</button>
            </div>
        `;
        modal.hidden = false;
    }
}

// ==================== CLOSE MODAL HELPER ====================
function closeModal() {
    const modal = document.getElementById('modal-container');
    if (modal) modal.hidden = true;
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
async function renderSOTD() {
    const container = document.getElementById('sotd-content');
    if (!container) return;

    // ✅ FIX: Mark SOTD notification as seen when page loads
    if (STATE.lastChecked) {
        STATE.lastChecked.songOfDay = new Date().toDateString();
        saveNotificationState();
        
        // Remove from local notification list immediately
        if (STATE.notifications) {
            STATE.notifications = STATE.notifications.filter(n => n.type !== 'sotd');
            updateNotificationBadge();
        }
    }

    // Show loading
    container.innerHTML = `
        <div style="text-align:center;padding:60px 20px;">
            <div style="font-size:40px;margin-bottom:15px;">🎬</div>
            <p style="color:#888;">Loading Song of the Day & Results...</p>
        </div>
    `;

    try {
        // Fetch Current Song AND Latest Results
        const [songData, resultsData] = await Promise.all([
            api('getSongOfDay', { agentNo: STATE.agentNo }),
            api('getLatestSOTDResult').catch(() => ({ success: false }))
        ]);

        const today = new Date();
        const dateDisplay = today.toLocaleDateString('en-US', { 
            weekday: 'long', month: 'long', day: 'numeric' 
        });
        const todayStr = today.toDateString();

        // --- Build Main Content ---
        let html = `
            <div class="card" style="background:linear-gradient(135deg, #ff000015, #ff000008);border-color:#ff000033;margin-bottom:16px;">
                <div class="card-body" style="text-align:center;padding:25px;">
                    <div style="font-size:50px;margin-bottom:12px;">🎬</div>
                    <h2 style="color:#fff;margin:0 0 8px;font-size:20px;">Song of the Day</h2>
                    <div style="display:inline-block;padding:8px 18px;background:rgba(255,255,255,0.1);border-radius:20px;margin-bottom:8px;">
                        <span style="color:#fff;font-size:13px;">📅 ${dateDisplay}</span>
                    </div>
                </div>
            </div>
        `;

        // --- Current Song Logic ---
        if (songData?.success && songData?.song) {
            const song = songData.song;
            const attemptsKey = 'sotd_attempts_' + STATE.agentNo + '_' + todayStr;
            const correctKey = 'sotd_correct_' + STATE.agentNo + '_' + todayStr;
            let attempts = parseInt(localStorage.getItem(attemptsKey) || '0');
            let wasCorrect = localStorage.getItem(correctKey) === 'true';

            const maxAttempts = 2;
            const remaining = Math.max(0, maxAttempts - attempts);
            const canAnswer = !wasCorrect && attempts < maxAttempts;

            // Only show hint if they haven't answered yet
            if (canAnswer) {
                html += `
                    <div class="card" style="margin-bottom:16px;">
                        <div class="card-header"><h3>💡 Today's Hint</h3></div>
                        <div class="card-body" style="text-align:center;padding:25px;">
                            <div style="font-size:18px;color:#ffd700;font-style:italic;padding:18px;background:rgba(255,215,0,0.08);border:1px dashed rgba(255,215,0,0.3);border-radius:12px;line-height:1.6;">
                                "${sanitize(song.hint || 'Listen carefully...')}"
                            </div>
                            <div style="margin-top:15px;padding:10px 20px;background:rgba(0,255,136,0.1);border-radius:20px;display:inline-block;">
                                <span style="color:#00ff88;font-size:14px;font-weight:600;">🎁 +${song.xpReward || 1} XP</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            html += `
                <div class="card" style="border-color:${!canAnswer ? (wasCorrect ? '#00ff88' : '#ff4444') : '#7b2cbf'}; margin-bottom: 25px;">
                    <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
                        <h3 style="margin:0;">${canAnswer ? '🔗 Submit Answer' : '📋 Result'}</h3>
                        ${canAnswer ? `<span style="padding:5px 12px;background:rgba(0,255,136,0.1);border-radius:15px;color:#00ff88;font-size:11px;font-weight:600;">🎯 ${remaining} Left</span>` : ''}
                    </div>
                    <div class="card-body" style="padding:25px;">
                        ${canAnswer ? `
                            <input type="text" id="sotd-answer-input" placeholder="Paste YouTube link here..." style="width:100%;background:#1a1a2e;border:1px solid #444;border-radius:10px;padding:14px;color:#fff;margin-bottom:15px;">
                            <button id="sotd-submit-btn" onclick="submitSOTDAnswer()" style="width:100%;padding:14px;background:linear-gradient(135deg, #ff0000, #cc0000);border:none;border-radius:10px;color:#fff;font-weight:bold;cursor:pointer;">▶️ Submit Answer</button>
                        ` : `
                            <div style="text-align:center;">
                                <div style="font-size:40px;margin-bottom:10px;">${wasCorrect ? '🎉' : '😔'}</div>
                                <div style="color:${wasCorrect ? '#00ff88' : '#ff6b6b'};font-size:18px;font-weight:bold;">${wasCorrect ? 'Correct!' : 'Out of Attempts'}</div>
                                <div style="margin-top:10px;padding:12px;background:rgba(255,255,255,0.05);border-radius:10px;">
                                    <div style="color:#fff;font-weight:bold;">${sanitize(song.title)}</div>
                                </div>

                                <!-- 🔴 YOUTUBE STREAM BOX -->
                                ${song.youtubeId ? `
                                    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                                        <p style="color:#aaa; font-size:12px; margin-bottom:12px;">Now go give it a stream! 💜</p>
                                        <a href="https://www.youtube.com/watch?v=${song.youtubeId}" target="_blank" style="
                                            display: flex; align-items: center; justify-content: center; gap: 10px;
                                            width: 100%; padding: 14px;
                                            background: linear-gradient(135deg, #ff0000, #cc0000);
                                            color: #fff; border-radius: 10px;
                                            text-decoration: none; font-weight: bold; font-size: 14px;
                                            box-shadow: 0 4px 15px rgba(255, 0, 0, 0.4);
                                            transition: transform 0.2s;
                                        " onactive="this.style.transform='scale(0.98)'">
                                            <span style="font-size:18px;">▶️</span> Watch on YouTube
                                        </a>
                                    </div>
                                ` : ''}
                            </div>
                        `}
                    </div>
                </div>
            `;
        }

        // --- Previous Results Section ---
        if (resultsData?.success && resultsData?.result) {
            const res = resultsData.result;
            const resDate = new Date(res.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const winnerColor = teamColor(res.winner);

            // ✅ FIX: Mark Results notification as seen if visible here
            const resultKey = 'sotd_result_seen_' + new Date(res.date).toDateString();
            localStorage.setItem(resultKey, 'true');

            html += `
                <div class="card" style="border: 1px solid rgba(255, 215, 0, 0.3); background: rgba(255, 215, 0, 0.02);">
                    <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                        <h3 style="margin:0; color:#ffd700;">🏆 Previous Results</h3>
                        <span style="font-size:11px; color:#888;">${resDate}</span>
                    </div>
                    <div class="card-body" style="padding: 15px;">
                        <div style="display:flex; align-items:center; gap:12px; margin-bottom:15px; padding:10px; background:rgba(255,255,255,0.03); border-radius:10px;">
                            <div style="font-size:24px;">👑</div>
                            <div style="flex:1;">
                                <div style="font-size:11px; color:#888; text-transform:uppercase;">Daily Winner</div>
                                <div style="color:${winnerColor}; font-weight:bold; font-size:16px;">${res.winner}</div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-size:11px; color:#888;">Song Reveal</div>
                                <div style="color:#fff; font-size:12px; font-weight:600;">${sanitize(res.song)}</div>
                            </div>
                        </div>

                        <!-- Mini Scoreboard -->
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                            ${[
                                { name: 'Indigo', val: res.teamIndigo, color: teamColor('Team Indigo') },
                                { name: 'Echo', val: res.teamEcho, color: teamColor('Team Echo') },
                                { name: 'Agust D', val: res.teamAgustD, color: teamColor('Team Agust D') },
                                { name: 'JITB', val: res.teamJITB, color: teamColor('Team JITB') }
                            ].map(t => `
                                <div style="display:flex; justify-content:space-between; padding:6px 10px; background:rgba(0,0,0,0.2); border-radius:6px; border-left:3px solid ${t.color};">
                                    <span style="font-size:11px; color:#aaa;">${t.name}</span>
                                    <span style="font-size:11px; color:#fff; font-weight:bold;">${t.val || 0}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html + `
            <button onclick="loadPage('home')" class="btn-secondary" style="width:100%;margin-top:16px;padding:14px;">
                ← Back to Home
            </button>
        `;

    } catch (e) {
        console.error('SOTD Error:', e);
        container.innerHTML = `<div class="card"><div class="card-body error-text">Failed to load Song of the Day.</div></div>`;
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
// ==================== ANNOUNCEMENTS (TABBED VERSION) ====================

// Add this helper function to window so HTML can access it
window.toggleJournalistPanel = function() {
    const form = document.getElementById('journalist-form');
    const arrow = document.getElementById('journalist-arrow');
    
    if (!form) return;
    
    // Toggle logic
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        if(arrow) arrow.style.transform = 'rotate(180deg)';
    } else {
        form.style.display = 'none';
        if(arrow) arrow.style.transform = 'rotate(0deg)';
    }
};

async function renderAnnouncements() {
    const container = $('announcements-content');
    if (!container) return;

    // Default tab
    if (!STATE._activeAnnouncementsTab) STATE._activeAnnouncementsTab = 'hq';

    container.innerHTML = `
        ${renderGuide('announcements')}
        <div class="guide-nav" style="margin-bottom: 20px; display: flex; gap: 10px;">
            <button class="guide-nav-btn ${STATE._activeAnnouncementsTab === 'hq' ? 'active' : ''}" 
                    style="flex:1"
                    onclick="STATE._activeAnnouncementsTab='hq'; renderAnnouncements();">📢 HQ News</button>
            <button class="guide-nav-btn ${STATE._activeAnnouncementsTab === 'log' ? 'active' : ''}" 
                    style="flex:1"
                    onclick="STATE._activeAnnouncementsTab='log'; renderAnnouncements();">📜 Mission Log</button>
        </div>
        <div id="announcements-display-area"></div>
    `;

    const displayArea = $('announcements-display-area');

    if (STATE._activeAnnouncementsTab === 'hq') {
        renderHQNews(displayArea);
    } else {
        renderActivityLog(displayArea);
    }
}

// Tab 1: HQ News (Official announcements + Admin Panel)
async function renderHQNews(displayArea) {
    // 1. Admin/Journalist Panel UI (Fixed Toggle)
    const journalistPanelHTML = `
        <div class="card" style="border: 1px solid #00d4ff; background: rgba(0, 212, 255, 0.05); margin-bottom: 20px;">
            <div class="card-header" style="cursor: pointer; display:flex; justify-content:space-between; align-items:center;" 
                 onclick="window.toggleJournalistPanel()">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:18px;">📰</span>
                    <h3 style="color: #00d4ff; margin:0; font-size:14px;">Journalist & Voting Panel</h3>
                </div>
                <span id="journalist-arrow" style="color:#00d4ff; transition: transform 0.3s ease;">▼</span>
            </div>
            
            <div id="journalist-form" class="card-body" style="display: none; padding-top: 15px; border-top: 1px solid rgba(0,212,255,0.1);">
                <select id="news-type" class="form-input" style="width:100%; margin-bottom:10px;">
                    <option value="medium">📰 News Update (Normal)</option>
                    <option value="high">🗳️ Voting Alert (High Priority)</option>
                    <option value="low">💡 Tip / Fun (Low Priority)</option>
                </select>
                
                <input type="text" id="news-title" placeholder="Headline" class="form-input" style="width:100%; margin-bottom:10px;">
                <textarea id="news-message" placeholder="Details/Instructions..." class="form-input" style="width:100%; min-height:80px; margin-bottom:10px;"></textarea>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;">
                    <input type="text" id="news-link" placeholder="Link URL (Optional)" class="form-input">
                    <input type="text" id="news-link-text" placeholder="Button Text (e.g. Vote)" class="form-input">
                </div>
                
                <input type="password" id="news-password" placeholder="🔒 Journalist Password" class="form-input" style="width:100%; margin-bottom:10px; border:1px solid #00d4ff;">
                
                <button onclick="submitJournalistNews()" class="btn-primary" style="width: 100%; background: linear-gradient(135deg, #00d4ff, #0077ff); color: #fff; font-weight:bold; border:none;">
                    📡 Broadcast Update
                </button>
            </div>
        </div>
    `;

    displayArea.innerHTML = journalistPanelHTML + '<div class="loading-text" style="text-align:center; padding:20px;">📡 Accessing HQ Archives...</div>';

    try {
        const data = await api('getAnnouncements', { week: STATE.week });
        const list = data.announcements || [];
        
        // Sort: High priority first, then newest
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        list.sort((a, b) => {
            const pDiff = (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
            if (pDiff !== 0) return pDiff;
            return new Date(b.created || 0) - new Date(a.created || 0);
        });

        if (list.length) {
            const listHTML = list.map(a => `
                <div class="card announcement priority-${a.priority || 'normal'}">
                    <div class="card-body">
                        <div class="announcement-header">
                            ${getPriorityBadge(a.priority)}
                            <span class="announcement-date">${a.created ? formatLastUpdated(a.created) : ''}</span>
                        </div>
                        <h3>${sanitize(a.title)}</h3>
                        <p style="white-space:pre-line;">${sanitize(a.message || a.content || '')}</p>
                        ${a.link ? `<a href="${sanitize(a.link)}" target="_blank" class="announcement-link-btn" style="display:inline-block; margin-top:10px;">${sanitize(a.linkText) || '🔗 Open Link'}</a>` : ''}
                    </div>
                </div>
            `).join('');
            displayArea.innerHTML = journalistPanelHTML + listHTML;
        } else {
            displayArea.innerHTML = journalistPanelHTML + '<div class="card"><div class="card-body" style="text-align:center; color:#888;">No announcements from HQ yet.</div></div>';
        }

        // Update notification state as read
        if (STATE.lastChecked) {
            STATE.lastChecked.announcements = Date.now();
            saveNotificationState();
        }

    } catch (e) {
        console.error(e);
        displayArea.innerHTML = journalistPanelHTML + '<p class="error-text">Failed to load news archives.</p>';
    }
}

// Tab 2: Mission Log (Real-time activity log)
async function renderActivityLog(displayArea) {
    displayArea.innerHTML = '<div class="loading-text" style="text-align:center; padding:20px;">📂 Decrypting Mission Logs...</div>';
    try {
        const response = await api('getActivityFeed', { limit: 50 });
        const activities = response.activities || [];
        
        if (activities.length === 0) {
            displayArea.innerHTML = '<div class="card"><div class="card-body" style="text-align:center; color:#888;">No recent activity recorded in logs.</div></div>';
            return;
        }

        let html = '<div style="display:flex; flex-direction:column; gap:10px;">';
        activities.forEach(act => {
            const data = act.data || {};
            let text = '';
            let icon = '⚡';

            if(act.type === 'goal_completed') { text = `<strong>${data.team}</strong> completed goal: <strong>${data.goal}</strong>!`; icon = '🎯'; }
            else if(act.type === 'streak_update') { text = `<strong>${data.name}</strong> reached a <strong style="color:#ff6b35;">${data.streak}-day</strong> streak!`; icon = '🔥'; }
            else if(act.type === 'secret_mission') { text = `<strong>${data.team}</strong> finished classified task: ${data.title}`; icon = '🕵️'; }
            else if(act.type === 'xp_milestone') { text = `<strong>${data.name}</strong> reached <strong>${data.xp} XP</strong> milestone!`; icon = '⭐'; }
            else if(act.type === 'sotd_winner') { text = `<strong>${data.team}</strong> solved the Song of the Day!`; icon = '🧠'; }
            else if(act.type === 'team_surge') { text = `<strong>${data.team}</strong> is on fire! ${data.streams} streams in the last hour!`; icon = '🚀'; }
            else if(act.type === 'priority_alert') { text = `<strong style="color:#00d4ff;">PRIORITY:</strong> ${data.title}<br>${data.message || ''}`; icon = '🚨'; } // Fixed Priority Alert
            else return;

            html += `
                <div class="card" style="padding:15px; margin:0; border-left:3px solid #7b2cbf; background: rgba(255,255,255,0.02);">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span style="font-size:20px;">${icon}</span>
                        <div style="font-size:13px; color:#ccc; line-height:1.4;">${text}</div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        displayArea.innerHTML = html;
    } catch (e) {
        displayArea.innerHTML = '<p class="error-text">Failed to load mission logs.</p>';
    }
}

// ==================== JOURNALIST ACTION ====================
async function submitJournalistNews() {
    const priority = document.getElementById('news-type').value; // Mapped to priority now
    const title = document.getElementById('news-title').value.trim();
    const message = document.getElementById('news-message').value.trim();
    const link = document.getElementById('news-link').value.trim();
    const linkText = document.getElementById('news-link-text').value.trim();
    const password = document.getElementById('news-password').value.trim();
    
    if (!title || !message || !password) {
        showToast('❌ Fill Title, Message, and Password', 'error');
        return;
    }

    loading(true);
    try {
        // Updated API call to match Backend Interface
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.SUPABASE_KEY}`
            },
            body: JSON.stringify({
                action: 'addAnnouncement',
                password: password,
                priority: priority, // Backend expects 'priority'
                title: title,
                message: message,
                link: link,
                linkText: linkText,
                week: STATE.week || 'all',
                agentNo: STATE.agentNo || 'Unknown'
            })
        });

        const result = await response.json();
        
        if (result.success) {
            showToast('✅ Broadcast Successful!', 'success');
            // Clear inputs
            document.getElementById('news-title').value = '';
            document.getElementById('news-message').value = '';
            document.getElementById('news-link').value = '';
            document.getElementById('news-password').value = '';
            
            // Refresh list
            renderAnnouncements(); 
        } else {
            showToast('❌ ' + (result.error || 'Failed to publish'), 'error');
        }
    } catch (e) {
        console.error(e);
        showToast('❌ Network Error', 'error');
    } finally {
        loading(false);
    }
}

// Make sure these are exported at the bottom of your JS file
window.renderAnnouncements = renderAnnouncements;
window.submitJournalistNews = submitJournalistNews;
// ==================== PLAYLISTS PAGE ====================

// Add helper to window for toggle
window.toggleMakerPanel = function() {
    const form = document.getElementById('maker-form');
    const arrow = document.getElementById('maker-arrow');
    
    if (!form) return;
    
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        if(arrow) arrow.style.transform = 'rotate(180deg)';
    } else {
        form.style.display = 'none';
        if(arrow) arrow.style.transform = 'rotate(0deg)';
    }
};

async function renderPlaylists() {
    const container = $('playlists-content');
    if (!container) return;

    // --- 1. THE PLAYLIST MAKER FORM (UI) ---
    const makerPanelHTML = `
        <div class="card" style="border: 1px solid #ffd700; background: rgba(255, 215, 0, 0.05); margin-bottom: 25px;">
            <div class="card-header" style="cursor: pointer; display:flex; justify-content:space-between; align-items:center;" 
                 onclick="window.toggleMakerPanel()">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:18px;">🎵</span>
                    <div>
                        <h3 style="color: #ffd700; margin:0;">Playlist Maker Panel</h3>
                        <span style="font-size: 10px; color: #888;">(Click to Expand)</span>
                    </div>
                </div>
                <span id="maker-arrow" style="color:#ffd700; transition: transform 0.3s ease;">▼</span>
            </div>
            
            <div id="maker-form" class="card-body" style="display: none; padding-top: 15px; border-top: 1px solid rgba(255,215,0,0.1);">
                <div style="display: grid; gap: 10px;">
                    <input type="text" id="pl-name" placeholder="Playlist Name (e.g. Focus V1)" class="form-input" style="width: 100%;">
                    
                    <input type="text" id="pl-url" placeholder="Playlist Link (URL)" class="form-input" style="width: 100%;">
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <select id="pl-platform" class="form-input">
                            <option value="Spotify">Spotify</option>
                            <option value="Apple Music">Apple Music</option>
                            <option value="YouTube">YouTube</option>
                        </select>
                        
                        <select id="pl-team" class="form-input">
                            <option value="All">All Teams</option>
                            <option value="Team Indigo">Team Indigo</option>
                            <option value="Team Echo">Team Echo</option>
                            <option value="Team Agust D">Team Agust D</option>
                            <option value="Team JITB">Team JITB</option>
                        </select>
                    </div>

                    <input type="password" id="pl-password" placeholder="🔒 Enter Maker Password" class="form-input" style="width: 100%; border-color: #ff4444;">
                    
                    <button onclick="submitNewPlaylist()" class="btn-primary" style="width: 100%; background: linear-gradient(135deg, #ffd700, #ffaa00); color: #000; font-weight: bold; border:none;">
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
        <div class="card" style="background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.3); margin-bottom: 20px;">
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
                const link = pl.link || pl.url || '#'; 
                const name = pl.name || 'Untitled Playlist';
                const platform = pl.platform || 'Spotify';
                const team = pl.team || 'All';
                const type = pl.type || 'Playlist';

                return `
                <div class="playlist-card" style="background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 15px; transition: transform 0.2s;">
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
        
        if (STATE.lastChecked) {
            STATE.lastChecked.playlists = playlists.length;
            saveNotificationState();
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
    
    if (!name || !url || !password) {
        showToast('❌ Please fill all fields', 'error');
        return;
    }

    loading(true);

    try {
        // Use consistent api() wrapper instead of raw fetch
        const result = await api('addPlaylist', {
            password: password,
            name: name,
            url: url,
            platform: platform,
            type: 'Playlist',
            team: team,
            targetWeek: STATE.week || 'Week 1',
            agentNo: STATE.agentNo || 'Unknown'
        });

        if (result.success) {
            showToast('✅ Playlist Added Successfully!', 'success');
            
            // Clear Form
            nameInput.value = '';
            urlInput.value = '';
            passwordInput.value = '';
            
            // Hide Form via helper
            window.toggleMakerPanel();
            
            // Refresh List
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
                <button class="guide-nav-btn" data-section="streaks">⚡ Streaks</button>
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

            <!-- Section 3.5: Daily Streaks -->
            <div class="guide-section" id="guide-streaks">
                <div class="guide-section-header" onclick="toggleGuideSection(this)">
                    <span class="guide-section-icon">⚡</span>
                    <span class="guide-section-title">System Uplink (Streaks)</span>
                    <span class="guide-section-toggle">▼</span>
                </div>
                <div class="guide-section-content">
                    <p class="guide-text">
                        Maintain a stable connection with HQ. Daily activity is required to keep your signal active.
                    </p>
                    
                    <div class="guide-highlight">
                        <div class="guide-highlight-title">🎯 Daily Protocol</div>
                        <div class="guide-highlight-content">
                            Record <strong>10 streams</strong> (Tracks or Albums) within 24 hours.<br>
                            <span style="color:#ffd700;">⏰ Resets daily at 12:00 AM IST (Indian Standard Time).</span>
                        </div>
                    </div>

                    <div class="guide-section-subtitle">📡 Status Indicators</div>
                    <ul class="guide-list">
                        <li><strong>📡 NO SIGNAL:</strong> 0 Day Streak. You are offline.</li>
                        <li><strong>🔥 STREAK ACTIVE:</strong> You are online, but haven't hit today's goal yet.</li>
                        <li><strong>⚡ POWER RESTORED:</strong> Daily goal complete! Streak saved.</li>
                    </ul>

                    <div class="guide-section-subtitle">🧊 Freeze Protocol</div>
                    <p class="guide-text">If you miss a day, the system automatically uses a <strong>Freeze</strong> to save your streak.</p>
                    
                    <ul class="guide-list">
                        <li>Agents receive <strong>2 Freezes</strong> on the 1st of every month.</li>
                        <li>If Freezes = 0 and you miss a day, the signal is lost (Streak 0). 💔</li>
                    </ul>
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
    </div>`;
    
    
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
async function renderAttendance() {
    const container = document.getElementById('attendance-content');
    if (!container) {
        // Create the page section if it doesn't exist
        const main = document.querySelector('.pages-wrapper');
        const page = document.createElement('section');
        page.id = 'page-attendance';
        page.className = 'page';
        page.innerHTML = '<div id="attendance-content"></div>';
        main.appendChild(page);
    }

    const agents = STATE.allAgents || [];
    const teams = ['Team Indigo', 'Team Echo', 'Team Agust D', 'Team JITB'];
    
    let html = `
        <div class="guide-header" style="background: linear-gradient(135deg, #4a1a7a, #2c0b47); margin-bottom: 20px;">
            <h1>📋 Live Attendance List</h1>
            <p>Full roster of active operatives by team</p>
        </div>

        <div class="search-container" style="margin-bottom: 20px;">
            <input type="text" id="attendance-search" placeholder="Search Agent Name or Instagram..." 
                   style="width: 100%; padding: 12px 15px; background: rgba(255,255,255,0.05); border: 1px solid #7b2cbf44; border-radius: 10px; color: #fff;"
                   oninput="filterAttendance()">
        </div>
    `;

    teams.forEach(teamName => {
        const teamMembers = agents.filter(a => a.team === teamName)
                                  .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        const color = teamColor(teamName);

        html += `
            <div class="guide-section attendance-section" data-team="${teamName}">
                <div class="guide-section-header" onclick="toggleGuideSection(this)" style="border-left: 4px solid ${color};">
                    <div style="width: 30px; height: 30px; border-radius: 50%; overflow: hidden; margin-right: 10px;">
                        <img src="${teamPfp(teamName)}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <span class="guide-section-title">${teamName}</span>
                    <span style="font-size: 11px; color: #888; margin-right: 10px;">${teamMembers.length} Agents</span>
                    <span class="guide-section-toggle">▼</span>
                </div>
                <div class="guide-section-content">
                    <div style="display: flex; flex-direction: column; gap: 8px; padding-top: 10px;">
                        ${teamMembers.map(agent => `
                            <div class="agent-roster-item" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px;">
                                <div style="display: flex; flex-direction: column;">
                                    <span style="color: #fff; font-weight: 600; font-size: 13px;">${sanitize(agent.name)}</span>
                                    <span style="color: #888; font-size: 11px;">@${sanitize(agent.instagram || 'No IG Linked')}</span>
                                </div>
                                <div style="text-align: right;">
                                    <span style="font-size: 9px; color: ${color}; background: ${color}22; padding: 3px 8px; border-radius: 10px; font-weight: bold;">ACTIVE</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    });

    document.getElementById('attendance-content').innerHTML = html;
}

// Search/Filter Function
function filterAttendance() {
    const query = document.getElementById('attendance-search').value.toLowerCase();
    const items = document.querySelectorAll('.agent-roster-item');
    
    items.forEach(item => {
        const text = item.innerText.toLowerCase();
        if (text.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });

    // Auto-expand sections if searching
    if (query.length > 1) {
        document.querySelectorAll('.attendance-section').forEach(s => s.classList.add('open'));
    }
}

// Global Exports
window.renderAttendance = renderAttendance;
window.filterAttendance = filterAttendance;
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

// ==================== TOGGLE HIDDEN BADGES (FIXED) ====================
window.toggleHiddenBadges = function(button) {
    const hiddenContainer = document.getElementById('hidden-xp-badges');
    if (!hiddenContainer) return;
    
    // Check current state
    const isHidden = hiddenContainer.style.display === 'none';
    
    if (isHidden) {
        // OPEN
        hiddenContainer.style.display = 'block';
        hiddenContainer.classList.add('expanded');
        button.innerHTML = `↑ Show Less`;
        
        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(10);
    } else {
        // CLOSE
        hiddenContainer.style.display = 'none';
        hiddenContainer.classList.remove('expanded');
        button.innerHTML = `View All Badges →`;
        
        // Scroll button back into view so they don't get lost
        button.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

async function applyForLeave() {
    // Spy-themed confirmation text with TIMING NOTE
    const confirmMsg = 
`⚠️ SYSTEM OVERRIDE: GHOST PROTOCOL

You are about to initiate Inactive Status for this week.

>> CONSEQUENCES:
1. [EXEMPT] You will NOT fail the Team 2X Mission.
2. [ZERO] Your streams will NOT count for goals.
3. [NULL] You will earn 0 XP this week.

>> NOTE:
System synchronization takes up to 1 hour. 
Your status might not change immediately.

>> CONFIRMATION REQUIRED:
Do you wish to proceed?`;

    if (!confirm(confirmMsg)) {
        return;
    }

    loading(true);

    try {
        const result = await api('applyLeave', {
            agentNo: STATE.agentNo,
            week: STATE.week
        });

        if (result.success) {
            // Updated Toast Message
            showToast('✅ Ghost Protocol Activated. Status will update fully within 1 hour.', 'success');
            
            // Reload dashboard to reflect changes where possible
            setTimeout(() => {
                loadDashboard();
            }, 1000);
        } else {
            showToast('❌ ' + (result.error || 'Failed to apply leave'), 'error');
        }
    } catch (e) {
        showToast('❌ Network Error', 'error');
        console.error(e);
    } finally {
        loading(false);
    }
}
window.applyForLeave = applyForLeave;

// ==================== SYNC FUNCTIONALITY ====================

async function handleManualSync() {
    const syncBtn = document.getElementById('syncBtn');
    const floatingBtn = document.getElementById('floatingSyncBtn');
    
    if (STATE.isLoading) return;
    
    // Disable both buttons
    [syncBtn, floatingBtn].forEach(btn => {
        if (btn) {
            btn.disabled = true;
            btn.classList.add('syncing');
        }
    });
    
    if (syncBtn) {
        const textEl = syncBtn.querySelector('.sync-text');
        if (textEl) textEl.textContent = 'Syncing...';
    }
    
    loading(true);
    
    try {
        const res = await api('refreshAgentStats', {
            agentNo: STATE.agentNo,
            week: STATE.currentWeek
        });
        
        if (res.alreadySynced) {
            showToast(res.message || '⏱️ Recently synced. Try again in a few minutes.', 'info');
        } else if (res.success) {
            showToast('✅ Stats updated from Last.fm!', 'success');
            
            // Show stats summary
            if (res.stats) {
                setTimeout(() => {
                    showToast(`📊 ${res.stats.trackScrobbles} tracks | ${res.stats.albumScrobbles} albums`, 'info');
                }, 1500);
            }
            
            // Reload current page data
            await loadDashboard();
            
        } else if (res.error) {
            showToast('⚠️ ' + res.error, 'warning');
        }
    } catch (e) {
        console.error('Sync error:', e);
        showToast('❌ Sync failed: ' + e.message, 'error');
    } finally {
        loading(false);
        
        // Reset buttons
        [syncBtn, floatingBtn].forEach(btn => {
            if (btn) {
                btn.disabled = false;
                btn.classList.remove('syncing');
            }
        });
        
        if (syncBtn) {
            const textEl = syncBtn.querySelector('.sync-text');
            if (textEl) textEl.textContent = 'Sync Stats';
        }
    }
}
// Export to window for button use
window.handleManualSync = handleManualSync;

function renderAdminSystemTab() {
    const container = document.getElementById('admin-tab-system');
    if (!container) return;

    container.innerHTML = `
        <div class="card" style="border-color: #ff4444; background: rgba(255,68,68,0.05);">
            <div class="card-header"><h3>⚙️ Global System Sync</h3></div>
            <div class="card-body" style="padding: 20px; text-align: center;">
                <p style="color: #ccc; font-size: 13px; margin-bottom: 20px;">
                    This will force the backend to fetch Last.fm data for <strong>ALL active agents</strong> for the current week. 
                    <br><br><span style="color: #ff6b6b;">⚠️ This may take 30-60 seconds depending on the number of agents.</span>
                </p>
                <button id="global-sync-btn" onclick="triggerGlobalSync()" class="btn-primary" style="width: 100%; padding: 15px; background: #ff4444;">
                    🚀 Force Global Refresh (All Agents)
                </button>
                <div id="sync-status-output" style="margin-top: 20px; color: #888; font-size: 12px; font-family: monospace;"></div>
            </div>
        </div>
    `;
}

async function triggerGlobalSync() {
    const btn = document.getElementById('global-sync-btn');
    const output = document.getElementById('sync-status-output');
    if (!confirm("Start Global Sync? This processes agents in batches but may still time out if there are many agents.")) return;

    btn.disabled = true;
    btn.innerHTML = "⏳ Syncing all agents...";
    output.innerHTML = "Process started. This takes a while...";

    try {
        const res = await api('runHourlySync', { adminKey: 'BTSSYNC2024' });

        if (res.success) {
            output.innerHTML = `✅ Sync Complete! <br>Synced: ${res.synced} | Failed: ${res.failed}`;
            showToast("Global Sync Complete!", "success");
        } else {
            // 🔥 Fix: Handle missing error property
            output.innerHTML = `❌ Error: ${res.error || 'Server timed out or returned no response.'}`;
        }
    } catch (e) {
        // 🔥 Fix: Catch timeouts properly
        output.innerHTML = `⚠️ The sync is running in the background, but the browser connection timed out. Check the Dashboard in 1 minute.`;
        console.error(e);
    } finally {
        btn.disabled = false;
        btn.innerHTML = "🚀 Force Global Refresh (All Agents)";
    }
}
window.triggerGlobalSync = triggerGlobalSync;
// --- PASSWORD MODAL LOGIC ---

function openPasswordModal() {
    const modal = document.getElementById('password-modal');
    if (modal) modal.style.display = 'flex';
}

function closePasswordModal() {
    const modal = document.getElementById('password-modal');
    if (modal) modal.style.display = 'none';
    document.getElementById('password-form').reset();
}

function togglePasswordVisibility(id, btn) {
    const input = document.getElementById(id);
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
    } else {
        input.type = 'password';
        btn.textContent = '👁️';
    }
}

async function handlePasswordChange(event) {
    event.preventDefault();
    
    const oldPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (newPassword !== confirmPassword) {
        showToast("New passwords do not match!", "error");
        return;
    }

    const btn = document.getElementById('submit-password-btn');
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Updating...';

    try {
        const res = await api('updatePassword', {
            agentNo: STATE.agentNo,
            oldPassword: oldPassword,
            newPassword: newPassword
        });

        if (res.success) {
            showToast("✅ Access Key Updated!", "success");
            closePasswordModal();
        } else {
            showToast(res.error || "Update failed", "error");
        }
    } catch (e) {
        showToast("System error. Try again later.", "error");
    } finally {
        btn.disabled = false;
        btn.querySelector('.btn-text').textContent = 'Update Password';
    }
}

// Make globally available
window.openPasswordModal = openPasswordModal;
window.closePasswordModal = closePasswordModal;
window.handlePasswordChange = handlePasswordChange;
window.togglePasswordVisibility = togglePasswordVisibility;

// ==================== ADMIN DIAGNOSTICS ====================

function renderAdminDebugTab() {
    const container = document.getElementById('admin-tab-debug');
    if (!container) return;

    container.innerHTML = `
        <div class="card" style="border-color: #00d4ff; background: rgba(0, 212, 255, 0.05);">
            <div class="card-header"><h3>🕵️‍♂️ Agent Diagnostics</h3></div>
            <div class="card-body">
                <p style="color:#aaa; font-size:12px; margin-bottom:15px;">
                    Investigate "0 Scrobble" issues. This forces a live fetch from Last.fm and shows exactly what data is being returned.
                </p>
                <div style="display:flex; gap:10px;">
                    <input type="text" id="debug-agent-id" class="form-input" placeholder="Enter AGENT ID (e.g. AGENT001)" style="flex:1;">
                    <button onclick="runAgentDiagnosis()" class="btn-primary" style="background: #00d4ff; color: #000; border:none;">
                        🔍 Analyze
                    </button>
                </div>
            </div>
        </div>
        <div id="debug-results" style="margin-top:20px;"></div>
    `;
}

async function runAgentDiagnosis() {
    const agentInput = document.getElementById('debug-agent-id');
    const resultsDiv = document.getElementById('debug-results');
    const agentNo = agentInput.value.trim().toUpperCase();

    if (!agentNo) {
        showToast("Enter an Agent ID", "error");
        return;
    }

    resultsDiv.innerHTML = '<div class="loading-text">📡 Intercepting Data Stream...</div>';

    try {
        // 1. Fetch Agent Details first to check DB existence
        const agentCheck = await api('getAgentData', { agentNo: agentNo, week: STATE.week });
        
        if (!agentCheck.success) {
            resultsDiv.innerHTML = `<div class="error-state"><p>❌ Agent ${agentNo} not found in Database.</p></div>`;
            return;
        }

        // 2. Force Sync with Last.fm
        const res = await api('refreshAgentStats', { 
            agentNo: agentNo, 
            week: STATE.week 
        });

        // 3. Build Report
        const debug = res.debug || {};
        const stats = res.stats || {};
        const userProfile = agentCheck.agent?.profile || {};

        let reportHTML = `
            <div style="background:#0a0a0f; border:1px solid #333; border-radius:12px; padding:20px; font-family:monospace;">
                
                <!-- ID Card -->
                <div style="border-bottom:1px solid #333; padding-bottom:15px; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="color:#fff; font-weight:bold; font-size:16px;">${agentNo}</div>
                        <div style="color:${teamColor(userProfile.team)}; font-size:12px;">${userProfile.team}</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="color:#888; font-size:10px;">LAST.FM USERNAME</div>
                        <div style="color:#00ff88; font-size:14px;">${(debug.usernames || []).join(', ') || 'NONE LINKED'}</div>
                    </div>
                </div>

                <!-- Status Grid -->
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:20px;">
                    <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px;">
                        <div style="font-size:10px; color:#888;">RAW SCROBBLES (Last.fm)</div>
                        <div style="font-size:18px; color:#fff;">${debug.rawTrackScrobbles ?? '0'}</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px;">
                        <div style="font-size:10px; color:#888;">MATCHED GOALS (DB)</div>
                        <div style="font-size:18px; color:#ffd700;">${stats.trackScrobbles ?? '0'}</div>
                    </div>
                </div>

                <!-- Analysis Log -->
                <div style="font-size:11px; color:#ccc; line-height:1.6;">
                    <div>📅 <strong>Week:</strong> ${debug.week}</div>
                    <div>🕒 <strong>Time Range (Unix):</strong> ${debug.weekRange?.from || '?'} to ${debug.weekRange?.to || '?'}</div>
                    
                    ${debug.fetchErrors ? 
                        `<div style="color:#ff4444; margin-top:10px;">⚠️ <strong>API ERRORS:</strong><br>${debug.fetchErrors.join('<br>')}</div>` 
                        : `<div style="color:#00ff88; margin-top:10px;">✅ Last.fm API Connection Successful</div>`
                    }

                    <div style="margin-top:10px; padding:10px; background:rgba(0,0,0,0.3); border-radius:6px;">
                        <div style="color:#888; margin-bottom:5px;">DIAGNOSIS:</div>
                        ${analyzeIssue(debug, stats)}
                    </div>
                </div>
            </div>
        `;

        resultsDiv.innerHTML = reportHTML;

    } catch (e) {
        resultsDiv.innerHTML = `<div class="error-text">Diagnosis Failed: ${e.message}</div>`;
    }
}

function analyzeIssue(debug, stats) {
    const raw = debug.rawTrackScrobbles || 0;
    const matched = stats.trackScrobbles || 0;

    if (!debug.usernames || debug.usernames.length === 0) 
        return `<span style="color:#ff4444">CRITICAL: No Last.fm username linked in database.</span>`;

    if (debug.fetchErrors && debug.fetchErrors.length > 0)
        return `<span style="color:#ff4444">CRITICAL: Last.fm API Error. Likely invalid username or privacy settings. Check if user is "Private".</span>`;

    if (raw === 0) 
        return `<span style="color:#ffa500">Last.fm reports 0 streams. User might be inactive or scrobbling is disconnected on their end.</span>`;

    if (raw > 0 && matched === 0) 
        return `<span style="color:#ffa500">User is streaming (${raw} tracks), but NONE matched the current Goals. Check if they are streaming the correct songs.</span>`;

    if (raw > matched) 
        return `<span style="color:#00ff88">System Healthy.</span> Filtering applied: ${raw - matched} non-goal streams ignored.`;

    return `<span style="color:#00ff88">System Nominal.</span> Data is syncing correctly.`;
}
// Add this to app.js
function promptDeleteAccount() {
    const password = prompt("⚠️ WARNING: RETIREMENT PROTOCOL\n\nThis action is PERMANENT. All XP, Badges, and Stats will be wiped.\n\nTo confirm, enter your Access Key:");
    
    if (!password) return;

    if (!confirm("🚨 FINAL WARNING 🚨\n\nAre you absolutely sure you want to delete your profile?")) return;

    loading(true);
    
    api('deleteAccount', {
        agentNo: STATE.agentNo,
        password: password
    }).then(res => {
        if (res.success) {
            alert("🛑 AGENT RETIRED.\n\nThank you for your service.");
            logout(); // Reuse your logout function to clear state
        } else {
            showToast("❌ " + res.error, "error");
        }
    }).catch(e => {
        showToast("Error: " + e.message, "error");
    }).finally(() => {
        loading(false);
    });
}

// Export it so HTML can use it
window.promptDeleteAccount = promptDeleteAccount;

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

// Make functions globally available
window.renderSummary = renderSummary;
window.renderWeekConfirmation = renderWeekConfirmation;
window.updateTeamStatus = updateTeamStatus;
window.toggleResultsRelease = toggleResultsRelease;

console.log('🎮 BTS Spy Battle v6.0 Loaded with Voting System 🗳️💜');
