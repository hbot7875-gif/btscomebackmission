const CONFIG = {
    // YOUR GOOGLE SCRIPT URL
    API_URL: 'https://script.google.com/macros/s/AKfycbx5ArHi5Ws0NxMa9nhORy6bZ7ZYpW4urPIap24tax9H1HLuGQxYRCgTVwDaKOMrZ7JOGA/exec',
    
    // Admin Settings
    ADMIN_AGENT_NO: 'AGENT000',
    
    // End Dates (YYYY-MM-DD)
    WEEK_DATES: {
        'Test Week 1': '2025-11-29',
        'Test Week 2': '2025-12-06',
        'Week 1': '2025-12-13',
        'Week 2': '2025-12-20',
        'Week 3': '2025-12-27',
        'Week 4': '2026-01-03'
    },
    
    // ===== BADGE CONFIGURATION =====
    BADGE_REPO_URL: 'https://raw.githubusercontent.com/hbot7875-gif/btscomebackmission/main/lvl1badges/',
    TOTAL_BADGE_IMAGES: 55,
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
    
    // ===== ALBUM CHALLENGE SETTINGS =====
    ALBUM_CHALLENGE: {
        REQUIRED_STREAMS: 2,
        CHALLENGE_NAME: "2X",
        BADGE_NAME: "2X Master",
        BADGE_DESCRIPTION: "Completed Album 2X Challenge"
    },
    
    // ✅ FIXED: Added "Team " prefix to match your data
    TEAMS: {
        'Team Indigo': { color: '#FFE082', album: 'Indigo' },   
        'Team Echo': { color: '#FAFAFA', album: 'Echo' },       
        'Team Agust D': { color: '#B0BEC5', album: 'Agust D' }, 
        'Team JITB': { color: '#FF4081', album: 'Jack In The Box' }
    },
    
    // ✅ FIXED: Added "Team " prefix
    TEAM_ALBUM_TRACKS: {
        "Team Indigo": ["Yun (with Erykah Badu)", "Still Life (with Anderson .Paak)", "All Day (with Tablo)", "Forg_tful (with Kim Sawol)", "Closer (with Paul Blanco, Mahalia)", "Change pt.2", "Lonely", "Hectic (with Colde)", "Wild Flower (with youjeen)", "No.2 (with parkjiyoon)"],
        "Team Echo": ["Don't Say You Love Me", "Nothing Without Your Love", "Loser (feat. YENA)", "Rope It", "With the Clouds", "To Me, Today"],
        "Team Agust D": ["Intro : Dt sugA", "Agust D", "Skit", "So far away (feat. Suran)", "140503 at Dawn", "Tony Montana", "give it to me", "Interlude : Dream, Reality", "The Last", "724148"],
        "Team JITB": ["Intro", "Pandora's Box", "MORE", "STOP", "= (Equal Sign)", "Music Box : Reflection", "What if...", "Safety Zone", "Future", "Arson"]
    },
    
    // ✅ FIXED: Added "Team " prefix + raw URLs
    TEAM_PFPS: {
        "Team Indigo": "https://raw.githubusercontent.com/hbot7875-gif/btscomebackmission/be0a3cc8ca6b395b4ceb74a1eb01207b9b756b4c/team%20pfps/teamindigo.jpg",
        "Team Echo": "https://raw.githubusercontent.com/hbot7875-gif/btscomebackmission/be0a3cc8ca6b395b4ceb74a1eb01207b9b756b4c/team%20pfps/teamecho.jpg",
        "Team Agust D": "https://raw.githubusercontent.com/hbot7875-gif/btscomebackmission/be0a3cc8ca6b395b4ceb74a1eb01207b9b756b4c/team%20pfps/teamagustd.jpg",
        "Team JITB": "https://raw.githubusercontent.com/hbot7875-gif/btscomebackmission/be0a3cc8ca6b395b4ceb74a1eb01207b9b756b4c/team%20pfps/teamjitb.jpg"
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
    }
};
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
        text: "You will receive missions every week. BTS Comeback is REAL - let's stream like our life depends on it! 💜\n\n🤫 Pro tip: Don't reveal your Agent ID to others - keep the mystery alive!" 
    },
    'goals': { 
        icon: '🎯', 
        title: 'Team Goal Progress', 
        text: "Focus on these tracks. Don't loop one track - variety is key!" 
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
        text: "Bonus XP tasks from HQ. Complete them and send proofs in team gc for extra team XP!" 
    },
     'team-level': { 
        icon: '🚀', 
        title: 'Leveling Up & Winning', 
        text: "To WIN the week, your team must:\n1️⃣ Complete ALL 3 missions (Track + Album + 2X)\n2️⃣ Have the highest XP among eligible teams\n\n🏆 Winner team members all get a Champion Badge!" 
    },
    'rankings': { 
        icon: '🏆', 
        title: 'Friendly Competition', 
        text: "We are one big team. Rankings are just for fun and motivation!\n\n🤫 Remember: Keep your Agent ID secret to make it more mysterious!" 
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
        text: "Chat anonymously with fellow agents. Be kind - we're ONE team! 💜\n\n🤫 Use your codename, NOT your Agent ID - keep your identity secret!",
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
    },
    'drawer': {
        icon: '🎖️',
        title: 'Your Badge Collection',
        text: "Earn badges by:\n• Every 50 XP = 1 Badge 🎖️\n• Complete Album 2X = Special Badge ✨\n• Team Wins Week = Winner Badge 🏆"
    },
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
    Object.entries(params).forEach(([k, v]) => { 
        if (v != null) url.searchParams.set(k, typeof v === 'object' ? JSON.stringify(v) : v); 
    });
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
function preloadDashboardData() {
    // Fire background API calls to cache data
    if (STATE.week) {
        api('getRankings', { week: STATE.week, limit: 50 }).catch(() => {});
        api('getGoalsProgress', { week: STATE.week }).catch(() => {});
        api('getWeeklySummary', { week: STATE.week }).catch(() => {});
    }
}
// ==================== NOTIFICATION SYSTEM (COMPLETE FIX) ====================

// Initialize notification state structure
function initNotificationState() {
    return {
        badges: 0,
        announcements: null,
        playlists: 0,
        missions: 0,
        album2xBadge: {},      // Track per week: { "Test Week 1": true }
        songOfDay: null,       // Date string of last check
        weekResults: [],       // Array of seen week results
        missionIds: []         // Track seen mission IDs
    };
}

// Load saved notification state
function loadNotificationState() {
    try {
        const saved = localStorage.getItem('notificationState_' + STATE.agentNo);
        if (saved) {
            const parsed = JSON.parse(saved);
            
            // Merge with defaults to ensure all properties exist
            STATE.lastChecked = {
                ...initNotificationState(),
                ...parsed.lastChecked
            };
            
            STATE.dismissedPopups = parsed.dismissedPopups || {};
            STATE.shownPopupsThisSession = {};
            
            console.log('📌 Loaded notification state:', STATE.lastChecked);
        } else {
            // First time user - initialize baseline
            initializeNotificationBaseline();
        }
    } catch (e) {
        console.log('Could not load notification state, initializing fresh');
        initializeNotificationBaseline();
    }
}

// Set baseline counts to avoid notification spam on first load
function initializeNotificationBaseline() {
    const currentXP = parseInt(STATE.data?.stats?.totalXP) || 0;
    const album2xPassed = STATE.data?.album2xStatus?.passed || false;
    
    STATE.lastChecked = {
        badges: Math.floor(currentXP / 50),  // Don't notify for existing badges
        announcements: Date.now(),            // Don't notify for old announcements
        playlists: -1,                        // -1 means "not yet initialized"
        missions: -1,                         // -1 means "not yet initialized"
        album2xBadge: album2xPassed ? { [STATE.week]: true } : {},
        songOfDay: null,
        weekResults: Object.keys(STATE.hasSeenResults || {}),
        missionIds: []
    };
    
    STATE.dismissedPopups = {};
    STATE.shownPopupsThisSession = {};
    
    // Save immediately
    saveNotificationState();
    
    console.log('📌 Notification baseline initialized');
}

// Save notification state
function saveNotificationState() {
    try {
        localStorage.setItem('notificationState_' + STATE.agentNo, JSON.stringify({
            lastChecked: STATE.lastChecked,
            dismissedPopups: STATE.dismissedPopups || {}
        }));
    } catch (e) {
        console.log('Could not save notification state');
    }
}

// Generate unique key for notification
function getNotificationKey(notif) {
    if (!notif) return 'unknown_' + Date.now();
    const weekPart = notif.week || STATE.week || '';
    const typePart = notif.type || 'generic';
    const titlePart = (notif.title || '').substring(0, 20);
    return `${typePart}_${titlePart}_${weekPart}`.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
}

// Main notification check function
async function checkNotifications() {
    // Prevent concurrent checks
    if (STATE.isCheckingNotifications) {
        console.log('⏳ Already checking notifications, skipping...');
        return;
    }
    
    // Don't check if not logged in or no data
    if (!STATE.agentNo || !STATE.data) {
        console.log('⚠️ Cannot check notifications - not logged in');
        return;
    }
    
    STATE.isCheckingNotifications = true;
    console.log('🔔 Checking notifications...');
    
    try {
        // Run all checks in PARALLEL for speed
        const results = await Promise.allSettled([
            checkNewBadges(),
            checkNewAnnouncements(),
            checkNewPlaylists(),
            checkNewMissions(),
            checkNewSongOfDay()
        ]);
        
        const notifications = [];
        
        // Collect successful results
        results.forEach((result, index) => {
            const checkNames = ['badges', 'announcements', 'playlists', 'missions', 'sotd'];
            if (result.status === 'fulfilled' && result.value) {
                if (Array.isArray(result.value)) {
                    notifications.push(...result.value.filter(Boolean));
                } else {
                    notifications.push(result.value);
                }
                console.log(`✅ ${checkNames[index]}: found notification`);
            } else if (result.status === 'rejected') {
                console.log(`❌ ${checkNames[index]} check failed:`, result.reason);
            }
        });
        
        // Check week results (sync, no API call needed)
        const resultsNotif = checkWeekResults();
        if (resultsNotif) {
            notifications.push(resultsNotif);
            console.log('✅ Week results notification added');
        }
        
        // Filter out dismissed notifications
        const newNotifications = notifications.filter(n => {
            if (!n) return false;
            const key = getNotificationKey(n);
            const isDismissed = STATE.dismissedPopups?.[key];
            if (isDismissed) console.log(`🔕 Filtered out dismissed: ${key}`);
            return !isDismissed;
        });
        
        // Update state
        STATE.notifications = newNotifications;
        updateNotificationBadge();
        
        console.log(`🔔 Found ${newNotifications.length} new notifications`);
        
        // Show popup logic
        if (newNotifications.length > 0) {
            const highPriorityNew = newNotifications.filter(n => n.priority === 'high');
            const hasUnshownHighPriority = highPriorityNew.some(n => {
                const key = getNotificationKey(n);
                return !STATE.shownPopupsThisSession?.[key];
            });
            
            // Show popup for: high priority OR first time this session
            if (hasUnshownHighPriority || !STATE.hasShownPopupThisSession) {
                showNotificationPopup(newNotifications);
                
                // Track shown popups
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
        // ALWAYS reset the flag
        STATE.isCheckingNotifications = false;
    }
}

// ===== INDIVIDUAL CHECK FUNCTIONS =====

// Check for new XP badges
async function checkNewBadges() {
    try {
        const stats = STATE.data?.stats || {};
        const currentXP = parseInt(stats.totalXP) || 0;
        const currentBadgeCount = Math.floor(currentXP / 50);
        const lastBadgeCount = STATE.lastChecked.badges || 0;
        
        const notifications = [];
        
        // First load check - don't spam
        if (lastBadgeCount === 0 && currentBadgeCount > 0 && !STATE.lastChecked._badgesInitialized) {
            STATE.lastChecked.badges = currentBadgeCount;
            STATE.lastChecked._badgesInitialized = true;
            saveNotificationState();
            return null;
        }
        
        // New badges earned
        if (currentBadgeCount > lastBadgeCount) {
            const newBadges = currentBadgeCount - lastBadgeCount;
            notifications.push({
                type: 'badge',
                icon: '🎖️',
                title: `${newBadges} New Badge${newBadges > 1 ? 's' : ''} Earned!`,
                message: `You reached ${currentBadgeCount * 50} XP!`,
                action: () => loadPage('drawer'),
                actionText: 'View Badges',
                week: STATE.week
            });
            
            STATE.lastChecked.badges = currentBadgeCount;
            saveNotificationState();
        }
        
        // Check for 2X badge (per week)
        const album2xStatus = STATE.data?.album2xStatus || {};
        const album2xKey = STATE.week;
        
        if (album2xStatus.passed && !STATE.lastChecked.album2xBadge?.[album2xKey]) {
            notifications.push({
                type: 'achievement',
                icon: '✨',
                title: `${CONFIG.ALBUM_CHALLENGE.CHALLENGE_NAME} Master!`,
                message: `You completed the Album ${CONFIG.ALBUM_CHALLENGE.CHALLENGE_NAME} Challenge!`,
                action: () => loadPage('drawer'),
                actionText: 'View Badge',
                priority: 'high',
                week: STATE.week
            });
            
            if (!STATE.lastChecked.album2xBadge) STATE.lastChecked.album2xBadge = {};
            STATE.lastChecked.album2xBadge[album2xKey] = true;
            saveNotificationState();
        }
        
        return notifications.length > 0 ? notifications : null;
    } catch (e) {
        console.log('Badge check error:', e);
        return null;
    }
}

// Check for new announcements
async function checkNewAnnouncements() {
    try {
        const data = await api('getAnnouncements', { week: STATE.week });
        const announcements = data.announcements || [];
        
        if (announcements.length === 0) return null;
        
        // Sort by date, newest first
        const sorted = announcements.sort((a, b) => 
            new Date(b.created || 0) - new Date(a.created || 0)
        );
        
        const latest = sorted[0];
        if (!latest || !latest.created) return null;
        
        const latestDate = new Date(latest.created).getTime();
        const lastCheckedDate = STATE.lastChecked.announcements || 0;
        
        if (latestDate > lastCheckedDate) {
            // Update BEFORE returning to prevent re-notification
            STATE.lastChecked.announcements = Date.now();
            saveNotificationState();
            
            return {
                type: 'announcement',
                icon: '📢',
                title: 'New Announcement!',
                message: latest.title || 'New message from HQ',
                action: () => loadPage('announcements'),
                actionText: 'Read Now',
                priority: latest.priority === 'high' ? 'high' : 'normal',
                week: STATE.week
            };
        }
        
        return null;
    } catch (e) {
        console.log('Announcement check error:', e);
        return null;
    }
}

// Check for new playlists
async function checkNewPlaylists() {
    try {
        const data = await api('getPlaylists');
        const playlists = data.playlists || [];
        const currentCount = playlists.length;
        const lastCount = STATE.lastChecked.playlists;
        
        // First initialization
        if (lastCount === -1) {
            STATE.lastChecked.playlists = currentCount;
            saveNotificationState();
            return null;
        }
        
        // New playlists added
        if (currentCount > lastCount) {
            const newCount = currentCount - lastCount;
            
            STATE.lastChecked.playlists = currentCount;
            saveNotificationState();
            
            return {
                type: 'playlist',
                icon: '🎵',
                title: 'New Playlist Added!',
                message: `${newCount} new playlist${newCount > 1 ? 's' : ''} available!`,
                action: () => loadPage('playlists'),
                actionText: 'View Playlists',
                week: STATE.week
            };
        }
        
        return null;
    } catch (e) {
        console.log('Playlist check error:', e);
        return null;
    }
}

// Check for new secret missions
async function checkNewMissions() {
    try {
        const team = STATE.data?.profile?.team;
        if (!team) return null;
        
        const data = await api('getTeamSecretMissions', { 
            team: team, 
            agentNo: STATE.agentNo, 
            week: STATE.week 
        });
        
        const activeMissions = data.active || [];
        const myAssigned = data.myAssigned || [];
        const currentCount = activeMissions.length;
        const lastCount = STATE.lastChecked.missions;
        
        // First initialization
        if (lastCount === -1) {
            STATE.lastChecked.missions = currentCount;
            STATE.lastChecked.missionIds = activeMissions.map(m => m.id);
            saveNotificationState();
            return null;
        }
        
        // Check for personally assigned missions (HIGH PRIORITY)
        if (myAssigned.length > 0) {
            const unseenAssigned = myAssigned.filter(m => 
                !STATE.lastChecked.missionIds?.includes(m.id)
            );
            
            if (unseenAssigned.length > 0) {
                const mission = unseenAssigned[0];
                
                // Track this mission
                if (!STATE.lastChecked.missionIds) STATE.lastChecked.missionIds = [];
                STATE.lastChecked.missionIds.push(mission.id);
                saveNotificationState();
                
                return {
                    type: 'mission',
                    icon: '🎯',
                    title: 'Mission Assigned to YOU!',
                    message: mission.title || 'New classified mission',
                    action: () => loadPage('secret-missions'),
                    actionText: 'View Mission',
                    priority: 'high',
                    week: STATE.week
                };
            }
        }
        
        // Check for new team missions
        if (currentCount > lastCount) {
            STATE.lastChecked.missions = currentCount;
            saveNotificationState();
            
            return {
                type: 'mission',
                icon: '🕵️',
                title: 'New Team Mission!',
                message: 'Your team has a new secret mission!',
                action: () => loadPage('secret-missions'),
                actionText: 'View Missions',
                week: STATE.week
            };
        }
        
        // Update count silently
        STATE.lastChecked.missions = currentCount;
        
        return null;
    } catch (e) {
        console.log('Mission check error:', e);
        return null;
    }
}

// Check for Song of the Day
async function checkNewSongOfDay() {
    try {
        const data = await api('getSongOfDay', {});
        
        if (!data.success || !data.song) return null;
        
        const today = new Date().toDateString();
        const lastCheckedDate = STATE.lastChecked.songOfDay;
        
        // Check if user already answered today
        const storageKey = 'song_answered_' + STATE.agentNo + '_' + today;
        const alreadyAnswered = localStorage.getItem(storageKey);
        
        if (alreadyAnswered) {
            // Already played today, no notification needed
            STATE.lastChecked.songOfDay = today;
            return null;
        }
        
        // New day, new song
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
                week: STATE.week
            };
        }
        
        return null;
    } catch (e) {
        console.log('SOTD check error:', e);
        return null;
    }
}

// Check for completed week results
function checkWeekResults() {
    if (!STATE.weeks || STATE.weeks.length === 0) return null;
    
    // Find completed weeks that user hasn't seen
    const unseenCompletedWeeks = STATE.weeks.filter(week => {
        const completed = isWeekCompleted(week);
        const seen = STATE.hasSeenResults?.[week] || 
                     STATE.lastChecked.weekResults?.includes(week);
        return completed && !seen;
    });
    
    if (unseenCompletedWeeks.length === 0) return null;
    
    // Get the most recent completed week
    const latestCompleted = unseenCompletedWeeks.sort((a, b) => {
        const dateA = new Date(CONFIG.WEEK_DATES[a] || 0);
        const dateB = new Date(CONFIG.WEEK_DATES[b] || 0);
        return dateB - dateA;
    })[0];
    
    if (!latestCompleted) return null;
    
    return {
        type: 'results',
        icon: '🏆',
        title: 'Week Results Ready!',
        message: `${latestCompleted} has ended. See the final standings!`,
        action: () => {
            STATE.week = latestCompleted;
            const weekSelect = $('week-select');
            if (weekSelect) weekSelect.value = latestCompleted;
            markResultsSeen(latestCompleted);
            loadPage('summary');
        },
        actionText: 'View Results',
        priority: 'high',
        week: latestCompleted
    };
}

// ===== UI FUNCTIONS =====

// Update notification badge in header
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

// Show notification popup
function showNotificationPopup(notifications) {
    if (!notifications || notifications.length === 0) return;
    
    // Remove existing popup
    document.querySelectorAll('.notification-popup').forEach(p => p.remove());
    
    // Sort by priority (high first)
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
                <span class="notif-more" onclick="showNotificationCenter()">
                    +${notifications.length - 1} more
                </span>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Animate in
    requestAnimationFrame(() => {
        popup.classList.add('show');
    });
    
    // Auto dismiss (longer for high priority)
    const dismissTime = isHighPriority ? 10000 : 6000;
    setTimeout(() => dismissNotificationPopup(), dismissTime);
}

// Dismiss notification popup
function dismissNotificationPopup() {
    const popup = document.querySelector('.notification-popup');
    if (popup) {
        popup.classList.remove('show');
        popup.classList.add('hide');
        setTimeout(() => popup.remove(), 400);
    }
}

// Handle notification action click
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

// Mark notification as seen
function markNotificationSeen(notif) {
    if (!notif) return;
    
    const key = getNotificationKey(notif);
    
    // Mark as dismissed
    if (!STATE.dismissedPopups) STATE.dismissedPopups = {};
    STATE.dismissedPopups[key] = true;
    
    // Type-specific handling
    switch (notif.type) {
        case 'badge':
        case 'achievement': {
            const currentXP = parseInt(STATE.data?.stats?.totalXP) || 0;
            STATE.lastChecked.badges = Math.floor(currentXP / 50);
            break;
        }
        case 'announcement': {
            STATE.lastChecked.announcements = Date.now();
            break;
        }
        case 'results': {
            if (notif.week) {
                markResultsSeen(notif.week);
                if (!STATE.lastChecked.weekResults) STATE.lastChecked.weekResults = [];
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
    
    // Remove from active notifications
    STATE.notifications = (STATE.notifications || []).filter(n => n !== notif);
    updateNotificationBadge();
}

// Show notification center (all notifications)
function showNotificationCenter() {
    // Remove existing
    document.querySelectorAll('.notification-center').forEach(c => c.remove());
    dismissNotificationPopup();
    
    const notifications = STATE.notifications || [];
    
    const center = document.createElement('div');
    center.className = 'notification-center';
    center.innerHTML = `
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
    
    // Animate in
    requestAnimationFrame(() => {
        center.classList.add('show');
    });
}

// Close notification center
function closeNotificationCenter() {
    const center = document.querySelector('.notification-center');
    if (center) {
        center.classList.remove('show');
        center.classList.add('hide');
        setTimeout(() => center.remove(), 300);
    }
}

// Clear all notifications
function clearAllNotifications() {
    (STATE.notifications || []).forEach(n => markNotificationSeen(n));
    STATE.notifications = [];
    updateNotificationBadge();
    closeNotificationCenter();
    showToast('All notifications cleared', 'success');
}

// ==================== END NOTIFICATION SYSTEM ====================

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
// ==================== ADMIN FUNCTIONS ====================
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
            <button type="button" class="admin-tab" data-tab="assets">Badge Preview</button>
            <button type="button" class="admin-tab" data-tab="history">History</button>
        </div>
        <div class="admin-panel-content" id="admin-panel-body">
            <div id="admin-tab-create" class="admin-tab-content active"></div>
            <div id="admin-tab-active" class="admin-tab-content"></div>
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
            
            // Refresh active missions tab
            setTimeout(() => {
                switchAdminTab('active');
            }, 1500);
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
                </div>
                ${missions.map(m => `
                    <div class="admin-mission-card" style="margin-bottom:10px;">
                        <div style="flex:1;">
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:5px;">
                                <span style="font-size:20px;">${CONFIG.MISSION_TYPES?.[m.type]?.icon || '🎯'}</span>
                                <span style="font-weight:600;color:#fff;">${sanitize(m.title)}</span>
                            </div>
                            <div style="font-size:12px;color:#888;">
                                Teams: ${(m.targetTeams || []).join(', ')} | Goal: ${m.goalTarget || 100}
                            </div>
                        </div>
                        <div style="display:flex;gap:8px;">
                            <button type="button" onclick="adminCompleteMission('${m.id}')" 
                                    style="background:#00aa55;color:#fff;border:none;padding:8px 12px;border-radius:6px;cursor:pointer;font-size:12px;">
                                ✓ Complete
                            </button>
                            <button type="button" onclick="adminCancelMission('${m.id}')" 
                                    style="background:#aa3333;color:#fff;border:none;padding:8px 12px;border-radius:6px;cursor:pointer;font-size:12px;">
                                ✕ Cancel
                            </button>
                        </div>
                    </div>
                `).join('')}
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

// ==================== CLIENT-SIDE ROUTING ====================

/**
 * Route definitions - maps URL hash to internal page names
 */
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
    'song-of-day': 'song-of-day',
    'login': 'login'
};

/**
 * Reverse mapping: page names to URL routes
 */
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
    'login': 'login'
};

/**
 * Router state
 */
const ROUTER = {
    isNavigating: false,
    lastRoute: null,
    initialized: false
};

/**
 * Get current route from URL hash
 */
function getCurrentRoute() {
    const hash = window.location.hash.slice(1); // Remove #
    const path = hash.startsWith('/') ? hash.slice(1) : hash;
    return path.split('?')[0] || 'home';
}

/**
 * Get page name from route
 */
function getPageFromRoute(route) {
    return ROUTES[route] || route || 'home';
}

/**
 * Get route from page name
 */
function getRouteFromPage(pageName) {
    return PAGE_TO_ROUTE[pageName] || pageName || 'home';
}

/**
 * Build full URL with hash
 */
function buildHashUrl(route) {
    return '#/' + (route || 'home');
}

/**
 * Navigate to a route (updates URL and renders page)
 */
function navigateTo(route, options = {}) {
    const { replace = false, skipRender = false } = options;
    
    if (ROUTER.isNavigating) return;
    
    const pageName = getPageFromRoute(route);
    const newUrl = buildHashUrl(route);
    
    // Don't navigate to same route unless forced
    if (!options.force && ROUTER.lastRoute === route && ROUTER.initialized) {
        return;
    }
    
    ROUTER.isNavigating = true;
    ROUTER.lastRoute = route;
    
    // Update browser history
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
    
    // Render the page
    if (!skipRender) {
        renderPageByRoute(pageName);
    }
    
    ROUTER.isNavigating = false;
}

/**
 * Handle browser back/forward buttons
 */
window.addEventListener('popstate', (event) => {
    if (ROUTER.isNavigating) return;
    if (!ROUTER.initialized) return;
    if (!STATE.agentNo) return; // Not logged in
    
    let pageName;
    
    if (event.state && event.state.page) {
        pageName = event.state.page;
        ROUTER.lastRoute = event.state.route;
    } else {
        const route = getCurrentRoute();
        pageName = getPageFromRoute(route);
        ROUTER.lastRoute = route;
    }
    
    // Show back indicator
    showBackIndicator();
    
    // Render the page
    renderPageByRoute(pageName);
});

/**
 * Render page by route (internal use)
 */
async function renderPageByRoute(pageName) {
    // If not logged in, only allow login page
    if (!STATE.agentNo && pageName !== 'login') {
        return;
    }
    
    STATE.page = pageName;
    
    // Update active nav link
    updateActiveNavLink(pageName);
    
    // Close sidebar
    closeSidebar();
    
    // Show the page element
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Create dynamic pages if needed
    const dynamicPages = ['chat', 'playlists', 'gc-links', 'helper-roles', 'song-of-day'];
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
    
    // Scroll to top
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
            case 'song-of-day': await renderSongOfDay(); break;
        }
    } catch (e) {
        console.error('Page render error:', e);
        if (el) el.innerHTML = `<div class="error-page"><h3>Failed to load</h3><p>${sanitize(e.message)}</p><button onclick="loadPage('${pageName}')" class="btn-primary">Retry</button></div>`;
    } finally { 
        loading(false); 
    }
}

/**
 * Show back navigation indicator
 */
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

/**
 * Update active navigation link
 */
function updateActiveNavLink(pageName) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize router after login
 */
function initRouter() {
    const route = getCurrentRoute();
    const pageName = getPageFromRoute(route);
    
    ROUTER.lastRoute = route;
    ROUTER.initialized = true;
    
    // Set initial history state
    history.replaceState(
        { page: pageName, route: route, timestamp: Date.now() },
        '',
        buildHashUrl(route)
    );
    
    console.log('🧭 Router initialized:', { route, pageName });
    
    return pageName;
}

// ==================== PAGE ROUTER (PUBLIC API) ====================

/**
 * Main function to navigate to a page
 * This replaces your existing loadPage function
 */
async function loadPage(page) {
    const route = getRouteFromPage(page);
    
    // If router not initialized yet, just render directly
    if (!ROUTER.initialized) {
        STATE.page = page;
        await renderPageByRoute(page);
        return;
    }
    
    navigateTo(route);
}

/**
 * Go back in history
 */
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
async function showOnlineUsers() {
    const data = await api('getOnlineCount');
    const users = data.users || [];
    
    if (users.length === 0) {
        showToast('No one else online', 'info');
        return;
    }
    
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
            <button onclick="this.closest('.online-popup').remove()" style="
                background:none;
                border:none;
                color:#888;
                font-size:20px;
                cursor:pointer;
            ">×</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
            ${users.map(u => `
                <div style="
                    display:flex;
                    align-items:center;
                    gap:10px;
                    padding:8px 10px;
                    background:rgba(255,255,255,0.05);
                    border-radius:8px;
                ">
                    <span style="width:8px;height:8px;background:#00ff88;border-radius:50%;"></span>
                    <span style="color:${teamColor(u.team)};font-size:13px;">@${sanitize(u.username)}</span>
                    <span style="
                        font-size:9px;
                        color:#888;
                        background:${teamColor(u.team)}22;
                        padding:2px 6px;
                        border-radius:4px;
                        margin-left:auto;
                    ">${sanitize(u.team?.replace('Team ', '') || '')}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add overlay
    const overlay = document.createElement('div');
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
    
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
}

// ==================== INITIALIZATION ====================

function initApp() {
    console.log('🚀 Starting App v5.0 with Routing...');
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
    } else {
        // No saved login - ensure we're on login screen
        // Set URL to login if not already
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

let notificationInterval = null;

async function loadDashboard() {
    console.log('🏠 Loading dashboard...');
    loading(true);

    startHeartbeat();
    updateOnlineCount();
    setInterval(updateOnlineCount, 30000);
    // Clear previous interval
    if (notificationInterval) {
        clearInterval(notificationInterval);
        notificationInterval = null;
    }
    
    try {
        // ⚡ PARALLEL LOAD - All API calls at once!
        const [weeksRes, agentDataRes] = await Promise.all([
            api('getAvailableWeeks'),
            api('getAgentData', { agentNo: STATE.agentNo, week: null }) // Will use current week
        ]);
        
        STATE.weeks = weeksRes.weeks || [];
        STATE.week = weeksRes.current || STATE.weeks[0];
        
        // If we got data with wrong week, refetch (rare case)
        if (agentDataRes.week && agentDataRes.week !== STATE.week) {
            STATE.data = await api('getAgentData', { agentNo: STATE.agentNo, week: STATE.week });
        } else {
            STATE.data = agentDataRes;
        }
        
        if (STATE.data?.lastUpdated) STATE.lastUpdated = STATE.data.lastUpdated;
        
        // Switch screens FIRST (feels faster!)
        $('login-screen').classList.remove('active');
        $('login-screen').style.display = 'none';
        $('dashboard-screen').classList.add('active');
        $('dashboard-screen').style.display = 'flex';
        
        // Setup dashboard
        setupDashboard();
        loadNotificationState();
        
        // Initialize router and load page
        const startPage = initRouter();
        await loadPage(startPage === 'login' ? 'home' : startPage);
        
        // ⚡ Load these in BACKGROUND (don't await!)
        loadAllWeeksData();           // Background
        preloadDashboardData();       // Background
        
        // Delayed notification check
        setTimeout(() => checkNotifications(), 2000);
        notificationInterval = setInterval(() => checkNotifications(), 5 * 60 * 1000);
        
        if (STATE.isAdmin) addAdminIndicator();
        
    } catch (e) {
        console.error('❌ Dashboard error:', e);
        showToast('Error: ' + e.message, 'error');
        
        $('login-screen').classList.add('active');
        $('login-screen').style.display = 'flex';
        $('dashboard-screen').classList.remove('active');
        $('dashboard-screen').style.display = 'none';
    } finally { 
        loading(false); 
    }
}

// ⚡ Make this non-blocking
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
    
    // Setup nav links with routing
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = null;
        link.onclick = e => {
            e.preventDefault(); 
            e.stopPropagation();
            const page = link.dataset.page;
            if (page) {
                loadPage(page); // This now uses the router!
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
        
        if (notificationInterval) {
            clearInterval(notificationInterval);
            notificationInterval = null;
        }
        
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
// ==================== HOME RENDERER ====================
async function renderHome() {
    const selectedWeek = STATE.week;
    const weekEl = $('current-week');
    if (weekEl) weekEl.textContent = `Week: ${selectedWeek}`;
    const guideHtml = renderGuide('home'); 
    
    try {
        const [summary, rankings, goals] = await Promise.all([
            api('getWeeklySummary', { week: selectedWeek }), 
            api('getRankings', { week: selectedWeek, limit: 5 }), 
            api('getGoalsProgress', { week: selectedWeek })
        ]);
        
        if (summary.lastUpdated) { STATE.lastUpdated = summary.lastUpdated; updateTime(); }
        
        const team = STATE.data?.profile?.team;
        const teamData = summary.teams?.[team] || {};
        const myStats = STATE.data?.stats || {};
        const isCompleted = isWeekCompleted(selectedWeek);
        const daysLeft = getDaysRemaining(selectedWeek);
        const agentName = STATE.data?.profile?.name || 'Agent';
        
        // ===== CALCULATE TIP - Find track with lowest progress =====
        const trackGoals = goals.trackGoals || {};
        let lowestTrack = null;
        let lowestProgress = 100;
        
        for (const [trackName, info] of Object.entries(trackGoals)) {
            const tp = info.teams?.[team] || {};
            const current = tp.current || 0;
            const goal = info.goal || 1;
            const progress = (current / goal) * 100;
            
            if (progress < 100 && progress < lowestProgress) {
                lowestProgress = progress;
                lowestTrack = {
                    name: trackName,
                    current: current,
                    goal: goal,
                    needed: Math.max(0, goal - current)
                };
            }
        }
        
        // Tip HTML
        const tipHtml = lowestTrack && !isCompleted ? `
            <div style="
                background: linear-gradient(135deg, #ffd70022, #ff8c0011);
                border: 1px solid #ffd70044;
                border-radius: 12px;
                padding: 12px 15px;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 12px;
            ">
                <span style="font-size:24px;">💡</span>
                <div style="flex:1;">
                    <div style="color:#ffd700;font-size:10px;font-weight:600;text-transform:uppercase;">TIP FOR ${sanitize(team)}</div>
                    <div style="color:#fff;font-size:13px;margin-top:3px;">
                        Focus on <strong style="color:#ffd700;">${sanitize(lowestTrack.name)}</strong> 
                        — need <strong style="color:#00ff88;">${fmt(lowestTrack.needed)}</strong> more streams!
                    </div>
                </div>
            </div>
        ` : '';
        
        const quickStatsEl = document.querySelector('.quick-stats-section');
        if (quickStatsEl) {
            quickStatsEl.innerHTML = guideHtml + tipHtml + `
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
                            <div class="quick-stat"><div class="quick-stat-value">${fmt(myStats.totalXP)}</div><div class="quick-stat-label">XP</div></div>
                            <div class="quick-stat"><div class="quick-stat-value">${fmt(myStats.trackScrobbles || 0)}</div><div class="quick-stat-label">Track Streams</div></div>
                            <div class="quick-stat"><div class="quick-stat-value">${fmt(myStats.albumScrobbles || 0)}</div><div class="quick-stat-label">Album Streams</div></div>
                        </div>
                        <div class="battle-timer ${isCompleted ? 'ended' : ''}">${isCompleted ? '🏆 Week Completed' : (daysLeft <= 1 ? '🚀 Final Day!' : `⏰ ${daysLeft} days left`)}</div>
                        ${isCompleted ? `<div class="results-alert" onclick="loadPage('summary')">🏆 View Final Results →</div>` : ''}
                        ${STATE.lastUpdated ? `<div class="last-updated-mini">Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}
                    </div>
                </div>
            `;
        }
        
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
                    <div class="mission-icon">🎵</div><h3>Track Goals</h3>
                    <div class="mission-status ${teamData.trackGoalPassed ? 'complete' : ''}">${teamData.trackGoalPassed ? '✅ Complete' : '⏳ In Progress'}</div>
                    <div class="goals-list">${trackGoalsList.length ? trackGoalsList.map(g => `<div class="goal-mini ${g.done ? 'done' : ''}"><span class="goal-name">${sanitize(g.name)}</span><span class="goal-progress">${fmt(g.current)}/${fmt(g.goal)} ${g.done ? '✅' : ''}</span></div>`).join('') : '<p class="no-goals">No track goals</p>'}</div>
                </div>
                <div class="mission-card expanded" onclick="loadPage('goals')">
                    <div class="mission-icon">💿</div><h3>Album Goals</h3>
                    <div class="mission-status ${teamData.albumGoalPassed ? 'complete' : ''}">${teamData.albumGoalPassed ? '✅ Complete' : '⏳ In Progress'}</div>
                    <div class="goals-list">${albumGoalsList.length ? albumGoalsList.map(g => `<div class="goal-mini ${g.done ? 'done' : ''}"><span class="goal-name">${sanitize(g.name)}</span><span class="goal-progress">${fmt(g.current)}/${fmt(g.goal)} ${g.done ? '✅' : ''}</span></div>`).join('') : '<p class="no-goals">No album goals</p>'}</div>
                </div>
                <div class="mission-card" onclick="loadPage('album2x')">
                    <div class="mission-icon">✨</div><h3>Album 2X</h3>
                    <div class="mission-subtitle">${sanitize(CONFIG.TEAMS[team]?.album || team)}</div>
                    <div class="mission-status ${album2xStatus.passed ? 'complete' : ''}">${album2xStatus.passed ? '✅ Complete' : '⏳ In Progress'}</div>
                    <div class="mission-progress"><div class="progress-bar"><div class="progress-fill ${album2xStatus.passed ? 'complete' : ''}" style="width:${teamTracks.length ? (tracksCompleted2x/teamTracks.length*100) : 0}%"></div></div><span>${tracksCompleted2x}/${teamTracks.length} tracks</span></div>
                </div>
                <div class="mission-card" onclick="loadPage('song-of-day')" style="background:linear-gradient(135deg, #ff000011, #ff000008);">
                    <div class="mission-icon">🎬</div>
                    <h3>Song of the Day</h3>
                    <div class="mission-status" style="color:#ff0000;">▶️ YouTube</div>
                    <div class="mission-hint">Find the song, earn XP!</div>
                </div>
                <div class="mission-card secret" onclick="loadPage('secret-missions')">
                    <div class="mission-icon">🔒</div><h3>Secret Missions</h3>
                    <div class="mission-status">🕵️ Classified</div><div class="mission-hint">Tap to view team missions</div>
                </div>
                <div class="mission-card" onclick="loadPage('playlists')">
                    <div class="mission-icon">🎵</div><h3>Playlists</h3>
                    <div class="mission-status" style="color:#ff4444;">⚠️ REQUIRED</div><div class="mission-hint">Official streaming playlists</div>
                </div>
                <div class="mission-card" onclick="loadPage('chat')">
                    <div class="mission-icon">💬</div><h3>Secret Comms</h3>
                    <div class="mission-subtitle">HQ Encrypted Channel</div><div class="mission-hint">Tap to join chat</div>
                </div>
                <div class="mission-card" onclick="loadPage('gc-links')">
                    <div class="mission-icon">👥</div><h3>GC Links</h3><div class="mission-hint">Instagram group chats</div>
                </div>
                <div class="mission-card" onclick="loadPage('helper-roles')">
                    <div class="mission-icon">🎖️</div><h3>Helper Roles</h3><div class="mission-hint">Join the Helper Army</div>
                </div>
            `;
        }
        
        const rankList = rankings.rankings || [];
        const topAgentsEl = $('home-top-agents');
        if (topAgentsEl) {
            topAgentsEl.innerHTML = rankList.length ? rankList.slice(0, 5).map((r, i) => `
                <div class="rank-item ${String(r.agentNo) === String(STATE.agentNo) ? 'highlight' : ''}" onclick="loadPage('rankings')">
                    <div class="rank-num">${i+1}</div>
                    <div class="rank-info">
                        <div class="rank-name">${sanitize(r.name)}</div>
                        <div class="rank-team" style="color:${teamColor(r.team)}">${r.team}</div>
                    </div>
                    <div class="rank-xp">${fmt(r.totalXP)} XP</div>
                </div>
            `).join('') : '<p class="empty-text">No data yet</p>';
        }
        
        const sortedTeams = Object.keys(summary.teams || {}).sort((a, b) => (summary.teams[b].teamXP || 0) - (summary.teams[a].teamXP || 0));
        const standingsEl = $('home-standings');
        if (standingsEl) {
            standingsEl.innerHTML = sortedTeams.length ? `
                <div class="standings-header">
                    <span class="standings-badge ${isCompleted ? 'final' : ''}">${isCompleted ? '🏆 Final Standings' : '⏳ Live Battle'}</span>
                </div>
                ${sortedTeams.map((t, i) => {
                    const td = summary.teams[t];
                    return `
                        <div class="standing-item ${t === team ? 'my-team' : ''}" onclick="loadPage('team-level')" style="--team-color:${teamColor(t)}">
                            <div class="standing-rank">${i+1}</div>
                            ${teamPfp(t) ? `<img src="${teamPfp(t)}" class="standing-pfp">` : ''}
                            <div class="standing-info">
                                <div class="standing-name" style="color:${teamColor(t)}">${t}</div>
                                <div class="standing-xp">${fmt(td.teamXP)} XP</div>
                                <div class="standing-members" style="font-size:10px;color:#888;">👥 ${getTeamMemberCount(t)} agents</div>
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
        console.error(e); 
        showToast('Failed to load home', 'error'); 
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
    // Create page container if needed
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
        <!-- Chat Rules (Compact) -->
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
            <!-- Header with Online Count -->
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
                <div 
                    style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 12px;background:rgba(0,255,136,0.1);border-radius:20px;" 
                    onclick="showOnlineUsers()"
                >
                    <span style="width:8px;height:8px;background:#00ff88;border-radius:50%;animation:pulse 2s infinite;"></span>
                    <span style="color:#00ff88;font-size:12px;font-weight:600;">
                        <span id="online-count">0</span> online
                    </span>
                </div>
            </div>
            
            <!-- Messages Container -->
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
            
            <!-- Input Area -->
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
                        transition: all 0.3s;
                    ">Send ➤</button>
                </div>
                <div style="margin-top:6px;display:flex;justify-content:space-between;align-items:center;">
                    <span style="color:#555;font-size:10px;">Press Enter to send</span>
                    <span id="char-count" style="color:#555;font-size:10px;">0/500</span>
                </div>
            </div>
        </div>
    `;
    
    // Setup input handlers
    const input = $('chat-input');
    const charCount = $('char-count');
    
    if (input) {
        // Enter key to send
        input.addEventListener('keypress', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Character counter
        input.addEventListener('input', () => {
            if (charCount) {
                charCount.textContent = `${input.value.length}/500`;
                charCount.style.color = input.value.length > 450 ? '#ff6b6b' : '#555';
            }
        });
        
        // Focus input style
        input.addEventListener('focus', () => {
            input.style.borderColor = '#7b2cbf';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = '#333';
        });
        
        // Focus on input
        input.focus();
    }
    
    // Load messages
    await loadMessages();
    
    // Update online count
    await updateOnlineCount();
    
    // Auto refresh every 5 seconds
    if (chatRefreshInterval) clearInterval(chatRefreshInterval);
    chatRefreshInterval = setInterval(() => {
        loadMessages();
        updateOnlineCount();
    }, 5000);
}

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
                    animation: fadeIn 0.3s ease;
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
        
        // Scroll to bottom
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
    
    // Disable while sending
    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.style.opacity = '0.6';
        sendBtn.innerHTML = '...';
    }
    input.value = '';
    $('char-count').textContent = '0/500';
    
    try {
        const result = await api('sendChatMessage', {
            agentNo: STATE.agentNo,
            message: msg
        });
        
        if (result.success) {
            await loadMessages();
        } else {
            showToast(result.error || 'Failed to send', 'error');
            input.value = msg; // Restore message
        }
    } catch (e) {
        console.error('Send error:', e);
        showToast('Failed to send', 'error');
        input.value = msg; // Restore message
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

// Check for unread messages
async function checkUnreadMessages() {
    const agentNo = localStorage.getItem('spyAgentNo');
    if (!agentNo) return;
    
    try {
        const response = await fetch(`${API_URL}?action=hasUnreadMessages&agentNo=${agentNo}`);
        const data = await response.json();
        
        const dot = document.getElementById('chatUnreadDot');
        const badge = document.getElementById('chatUnreadBadge');
        
        if (data.hasUnread) {
            // Show dot
            if (dot) dot.classList.add('show');
            
            // Show badge with count
            if (badge) {
                badge.textContent = data.count > 99 ? '99+' : data.count;
                badge.classList.add('show');
            }
        } else {
            // Hide indicators
            if (dot) dot.classList.remove('show');
            if (badge) badge.classList.remove('show');
        }
    } catch (e) {
        console.error('Error checking unread:', e);
    }
}

// Mark chat as read when opening Secret Comms
async function markChatRead() {
    const agentNo = localStorage.getItem('spyAgentNo');
    if (!agentNo) return;
    
    try {
        await fetch(`${API_URL}?action=markChatAsRead&agentNo=${agentNo}`);
        
        // Hide the dot/badge immediately
        const dot = document.getElementById('chatUnreadDot');
        const badge = document.getElementById('chatUnreadBadge');
        if (dot) dot.classList.remove('show');
        if (badge) badge.classList.remove('show');
    } catch (e) {
        console.error('Error marking as read:', e);
    }
}

// Start checking for unread messages
function startUnreadCheck() {
    // Check immediately
    checkUnreadMessages();
    
    // Then check every 30 seconds
    if (unreadCheckInterval) clearInterval(unreadCheckInterval);
    unreadCheckInterval = setInterval(checkUnreadMessages, 30000);
}

// Stop checking (when logged out)
function stopUnreadCheck() {
    if (unreadCheckInterval) {
        clearInterval(unreadCheckInterval);
        unreadCheckInterval = null;
    }
}

// ==================== UPDATE YOUR EXISTING FUNCTIONS ====================

// Update your showSecretComms function to mark as read:
function showSecretComms() {
    // Your existing code to show the chat panel...
    showPanel('secretCommsPanel'); // or whatever your function is
    
    // Mark as read when opening
    markChatRead();
    
    // Load messages
    loadChatMessages();
}

// Call this after successful login:
function onLoginSuccess() {
    // Your existing login success code...
    
    // Start checking for unread messages
    startUnreadCheck();
}

// Call this on page load if already logged in:
document.addEventListener('DOMContentLoaded', function() {
    const agentNo = localStorage.getItem('spyAgentNo');
    if (agentNo) {
        startUnreadCheck();
    }
});

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
            console.log('Loaded allWeeksData:', STATE.allWeeksData);
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
    
    // Get agent's team (for winner badge check)
    const agentTeam = STATE.allWeeksData?.agentTeam || team;
    
    if (STATE.allWeeksData?.weeks?.length > 0) {
        console.log('Processing', STATE.allWeeksData.weeks.length, 'weeks for badges');
        
        STATE.allWeeksData.weeks.forEach(weekData => {
            const weekName = weekData.week;
            const weekXP = parseInt(weekData.stats?.totalXP) || 0;
            const weekTracks = parseInt(weekData.stats?.trackScrobbles) || 0;
            const weekAlbums = parseInt(weekData.stats?.albumScrobbles) || 0;
            
            overallXP += weekXP;
            overallTrackStreams += weekTracks;
            overallAlbumStreams += weekAlbums;
            
            if (weekXP > 0) weeksParticipated++;
            
            // ✅ XP badges for this week
            const weekBadges = getLevelBadges(STATE.agentNo, weekXP, weekName);
            allXpBadges = allXpBadges.concat(weekBadges);
            
            // ✅ FIX: Get 2X badge for THIS week's data
            const album2xBadge = getAlbum2xBadgeForWeek(STATE.agentNo, weekData, weekName);
            if (album2xBadge) {
                console.log(`✅ Found 2X badge for ${weekName}:`, album2xBadge);
                allSpecialBadges.push(album2xBadge);
            }
            
            // ✅ FIX: Get winner badge if team won this week
            const winnerBadge = getWinnerBadgeForWeek(STATE.agentNo, weekData, agentTeam);
            if (winnerBadge) {
                console.log(`✅ Found Winner badge for ${weekName}:`, winnerBadge);
                allSpecialBadges.push(winnerBadge);
            }
        });
        
    } else {
        // Fallback to current week only
        console.log('No allWeeksData, using current week only');
        overallXP = parseInt(stats.totalXP) || 0;
        overallTrackStreams = parseInt(stats.trackScrobbles) || 0;
        overallAlbumStreams = parseInt(stats.albumScrobbles) || 0;
        weeksParticipated = overallXP > 0 ? 1 : 0;
        allXpBadges = getLevelBadges(STATE.agentNo, overallXP, STATE.week);
        
        // Current week special badges
        const album2xBadge = getAlbum2xBadgeForWeek(STATE.agentNo, STATE.data, STATE.week);
        if (album2xBadge) allSpecialBadges.push(album2xBadge);
    }
    
    // Remove duplicate special badges (same name + week)
    const seenBadges = new Set();
    const uniqueSpecialBadges = allSpecialBadges.filter(b => {
        const key = `${b.name}_${b.week}`;
        if (seenBadges.has(key)) return false;
        seenBadges.add(key);
        return true;
    });
    
    console.log('=== BADGE SUMMARY ===');
    console.log('Special Badges:', uniqueSpecialBadges.length, uniqueSpecialBadges);
    console.log('XP Badges:', allXpBadges.length);
    
    // Current week stats
    const currentWeekXP = parseInt(stats.totalXP) || 0;
    const currentWeekTracks = parseInt(stats.trackScrobbles) || 0;
    const currentWeekAlbums = parseInt(stats.albumScrobbles) || 0;
    
    // ✅ Special badges first (winner, 2X), then XP badges
    const allBadges = [...uniqueSpecialBadges, ...allXpBadges];
    const totalBadgeCount = allBadges.length;

    console.log('=== DRAWER BADGES DEBUG ===');
    console.log('All Weeks Data:', STATE.allWeeksData);
    console.log('Special Badges:', uniqueSpecialBadges);
    console.log('XP Badges:', allXpBadges.length);
    console.log('Total Badges:', totalBadgeCount);
    
    container.innerHTML = `
        <!-- Agent Profile Card -->
        <div class="card" style="border-color: ${teamColor(team)}; margin-bottom: 20px; overflow: hidden;">
            <div style="
                background: linear-gradient(135deg, ${teamColor(team)}33, transparent);
                padding: 30px;
                text-align: center;
            ">
                <div style="
                    width: 90px;
                    height: 90px;
                    border-radius: 50%;
                    margin: 0 auto 15px;
                    border: 3px solid ${teamColor(team)};
                    overflow: hidden;
                    background: ${teamColor(team)}22;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 36px;
                    box-shadow: 0 0 20px ${teamColor(team)}44;
                ">
                    ${teamPfp(team) ? `<img src="${teamPfp(team)}" style="width:100%;height:100%;object-fit:cover;">` : (profile.name || 'A')[0].toUpperCase()}
                </div>
                <h2 style="color: #fff; margin: 0 0 5px 0; font-size: 20px;">${sanitize(profile.name || 'Agent')}</h2>
                <p style="color: ${teamColor(team)}; margin: 0 0 8px 0; font-weight: 600;">Team ${team}</p>
                <p style="color: #666; margin: 0; font-size: 11px;">Agent ID: ${STATE.agentNo}</p>
                
                ${isAdmin ? `
                    <div style="
                        margin-top: 12px;
                        padding: 6px 14px;
                        background: linear-gradient(135deg, #ffd700, #ff8c00);
                        color: #000;
                        border-radius: 20px;
                        font-size: 11px;
                        font-weight: bold;
                        display: inline-block;
                    ">👑 ADMIN</div>
                ` : ''}
            </div>
        </div>
        
        <!-- ===== OVERALL STATS (ALL WEEKS) ===== -->
        <div class="card" style="margin-bottom: 20px; border-color: #ffd700;">
            <div class="card-header" style="background: rgba(255,215,0,0.05);">
                <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                    🏆 Overall Stats
                    <span style="font-size: 10px; color: #666; font-weight: normal;">(All Weeks Combined)</span>
                </h3>
            </div>
            <div class="card-body">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; text-align: center;">
                    <div style="padding: 18px; background: linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05)); border-radius: 12px; border: 1px solid rgba(255,215,0,0.2);">
                        <div style="font-size: 28px; font-weight: bold; color: #ffd700;">${fmt(overallXP)}</div>
                        <div style="font-size: 10px; color: #888; margin-top: 4px;">Total XP</div>
                    </div>
                    <div style="padding: 18px; background: linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,255,136,0.05)); border-radius: 12px; border: 1px solid rgba(0,255,136,0.2);">
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
        
        <!-- ===== CURRENT WEEK STATS ===== -->
        <div class="card" style="margin-bottom: 20px; border-color: #7b2cbf;">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0;">📊 This Week</h3>
                <span style="
                    padding: 4px 10px;
                    background: rgba(123,44,191,0.2);
                    border-radius: 12px;
                    font-size: 10px;
                    color: #7b2cbf;
                    font-weight: 600;
                ">${STATE.week}</span>
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
                
                <div style="margin-top: 10px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                    <div style="padding: 10px; background: rgba(255,255,255,0.02); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #666; font-size: 11px;">🎵 Tracks</span>
                        <span style="color: #fff; font-weight: 600; font-size: 13px;">${fmt(currentWeekTracks)}</span>
                    </div>
                    <div style="padding: 10px; background: rgba(255,255,255,0.02); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #666; font-size: 11px;">💿 Albums</span>
                        <span style="color: #fff; font-weight: 600; font-size: 13px;">${fmt(currentWeekAlbums)}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- ===== BADGES SECTION (FIXED) ===== -->
        <div class="card" style="margin-bottom: 20px;">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0;">🎖️ Badge Collection</h3>
                <span style="color: #ffd700; font-size: 11px; font-weight: 600;">${totalBadgeCount} earned</span>
            </div>
            <div class="card-body">
                ${allBadges.length > 0 ? `
                    <!-- Show special badges first (winner, 2X) -->
                    ${uniqueSpecialBadges.length > 0 ? `
                        <div style="margin-bottom: 15px;">
                            <div style="color: #888; font-size: 10px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">✨ Special Badges</div>
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(65px, 1fr)); gap: 10px;">
                                ${uniqueSpecialBadges.map(badge => `
                                    <div style="text-align: center;">
                                        <div class="badge-circle holographic" style="
                                            width: 50px;
                                            height: 50px;
                                            margin: 0 auto;
                                            border-radius: 50%;
                                            overflow: hidden;
                                            border: 2px solid ${badge.type === 'winner' ? '#ffd700' : '#7b2cbf'};
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            background: ${badge.type === 'winner' ? 'rgba(255,215,0,0.1)' : 'rgba(123,44,191,0.1)'};
                                        ">
                                            ${badge.imageUrl ? `
                                                <img src="${badge.imageUrl}" style="width:100%;height:100%;object-fit:cover;" 
                                                     onerror="this.style.display='none';this.parentElement.innerHTML='${badge.icon || '🎖️'}';">
                                            ` : `<span style="font-size:22px;">${badge.icon || '🎖️'}</span>`}
                                        </div>
                                        <div style="margin-top: 5px; font-size: 8px; color: ${badge.type === 'winner' ? '#ffd700' : '#7b2cbf'}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                            ${sanitize(badge.name)}
                                        </div>
                                        <div style="font-size: 7px; color: #666;">${sanitize(badge.week)}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- XP Badges -->
                    ${allXpBadges.length > 0 ? `
                        <div>
                            <div style="color: #888; font-size: 10px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">⭐ XP Badges</div>
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(65px, 1fr)); gap: 10px;">
                                ${allXpBadges.slice(0, 12).map(badge => `
                                    <div style="text-align: center;">
                                        <div class="badge-circle holographic" style="
                                            width: 50px;
                                            height: 50px;
                                            margin: 0 auto;
                                            border-radius: 50%;
                                            overflow: hidden;
                                            border: 2px solid #555;
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            background: rgba(123,44,191,0.1);
                                        ">
                                            ${badge.imageUrl ? `
                                                <img src="${badge.imageUrl}" style="width:100%;height:100%;object-fit:cover;" 
                                                     onerror="this.style.display='none';this.parentElement.innerHTML='🎖️';">
                                            ` : `<span style="font-size:22px;">🎖️</span>`}
                                        </div>
                                        <div style="margin-top: 5px; font-size: 8px; color: #888; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${sanitize(badge.name)}</div>
                                        <div style="font-size: 7px; color: #666;">${sanitize(badge.week)}</div>
                                    </div>
                                `).join('')}
                            </div>
                            ${allXpBadges.length > 12 ? `
                                <div style="text-align: center; margin-top: 12px;">
                                    <span style="color: #666; font-size: 11px;">+${allXpBadges.length - 12} more XP badges</span>
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                    
                    <button onclick="loadPage('profile')" class="btn-secondary" style="width: 100%; margin-top: 12px; padding: 10px; font-size: 12px;">
                        View All Badges →
                    </button>
                ` : `
                    <div style="text-align: center; padding: 25px 15px;">
                        <div style="font-size: 36px; margin-bottom: 10px;">🔒</div>
                        <p style="color: #888; margin: 0; font-size: 12px;">Earn <strong style="color: #ffd700;">50 XP</strong> to unlock your first badge!</p>
                    </div>
                `}
            </div>
        </div>
        
        <!-- ===== ALBUM CHALLENGE STATUS ===== -->
        <div class="card" style="border-color: ${album2xStatus.passed ? '#00ff88' : '#7b2cbf'}; margin-bottom: 20px;">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0;">✨ ${CONFIG.ALBUM_CHALLENGE.CHALLENGE_NAME} Challenge</h3>
                <span style="
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: 600;
                    background: ${album2xStatus.passed ? 'rgba(0,255,136,0.1)' : 'rgba(123,44,191,0.1)'};
                    color: ${album2xStatus.passed ? '#00ff88' : '#7b2cbf'};
                ">${album2xStatus.passed ? '✅ Complete' : '⏳ In Progress'}</span>
            </div>
            <div class="card-body" style="text-align: center; padding: 18px;">
                <div style="font-size: 32px; margin-bottom: 8px;">${album2xStatus.passed ? '🎉' : '🎯'}</div>
                <p style="color: #888; margin: 0 0 12px 0; font-size: 12px;">
                    ${album2xStatus.passed 
                        ? `You earned the <strong style="color: #7b2cbf;">${CONFIG.ALBUM_CHALLENGE.BADGE_NAME}</strong> badge!`
                        : `Stream each track ${CONFIG.ALBUM_CHALLENGE.REQUIRED_STREAMS}X to earn a badge!`
                    }
                </p>
                <button onclick="loadPage('album2x')" class="btn-secondary" style="padding: 8px 18px; font-size: 11px;">
                    View Progress →
                </button>
            </div>
        </div>
        
        <!-- ===== QUICK ACTIONS ===== -->
        <div class="card" style="margin-bottom: 20px;">
            <div class="card-header">
                <h3 style="margin: 0;">⚡ Quick Actions</h3>
            </div>
            <div class="card-body" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                <button onclick="loadPage('profile')" class="btn-secondary" style="padding: 12px 8px; font-size: 10px;">
                    👤 Profile
                </button>
                <button onclick="loadPage('rankings')" class="btn-secondary" style="padding: 12px 8px; font-size: 10px;">
                    🏆 Rankings
                </button>
                <button onclick="loadPage('goals')" class="btn-secondary" style="padding: 12px 8px; font-size: 10px;">
                    🎯 Goals
                </button>
                <button onclick="loadPage('secret-missions')" class="btn-secondary" style="padding: 12px 8px; font-size: 10px;">
                    🕵️ Missions
                </button>
                <button onclick="loadPage('playlists')" class="btn-secondary" style="padding: 12px 8px; font-size: 10px;">
                    🎵 Playlists
                </button>
                <button onclick="loadPage('team-level')" class="btn-secondary" style="padding: 12px 8px; font-size: 10px;">
                    📊 Teams
                </button>
            </div>
        </div>
        
        ${isAdmin ? `
            <!-- ===== ADMIN SECTION ===== -->
            <div class="card" style="border-color: #ffd700; margin-bottom: 20px;">
                <div class="card-header" style="background: rgba(255,215,0,0.05);">
                    <h3 style="margin: 0; color: #ffd700;">👑 Admin Controls</h3>
                </div>
                <div class="card-body">
                    <button onclick="showAdminPanel()" class="btn-primary" style="
                        width: 100%; 
                        padding: 14px; 
                        background: linear-gradient(135deg, #ffd700, #ff8c00); 
                        color: #000;
                        font-weight: bold;
                        font-size: 13px;
                    ">
                        🎛️ Open Mission Control
                    </button>
                </div>
            </div>
        ` : ''}
        
        <!-- App Info -->
        <div style="text-align: center; padding: 15px; color: #888; font-size: 10px;">
            <p style="margin: 0;">BTS Spy Battle v5.0</p>
            <p style="margin: 4px 0 0 0;">💜 Fighting! 💜</p>
        </div>
    `;
    
    // Update notification state
    const currentXP = parseInt(stats.totalXP) || 0;
    STATE.lastChecked.badges = Math.floor(currentXP / 50);
    STATE.lastChecked.album2xBadge = album2xStatus.passed || false;
    saveNotificationState();
}
// ==================== PROFILE ====================
async function renderProfile() {
    const container = $('profile-stats');
    if (!container) return;
    
    const stats = STATE.data?.stats || {};
    const album2xStatus = STATE.data?.album2xStatus || {};
    const trackContributions = STATE.data?.trackContributions || {};
    const albumContributions = STATE.data?.albumContributions || {};
    const currentWeekXP = stats.totalXP || 0;
    
    // Get badges for current week
    const xpBadges = getLevelBadges(STATE.agentNo, currentWeekXP, STATE.week);
    const specialBadges = getSpecialBadges(STATE.agentNo, STATE.week);
    const allCurrentBadges = [...specialBadges, ...xpBadges];
    
    container.innerHTML = `
        <div class="stat-box"><div class="stat-value">${fmt(stats.totalXP)}</div><div class="stat-label">XP (${STATE.week})</div></div>
        <div class="stat-box"><div class="stat-value">#${STATE.data?.rank || 'N/A'}</div><div class="stat-label">Rank</div></div>
        <div class="stat-box"><div class="stat-value">#${STATE.data?.teamRank || 'N/A'}</div><div class="stat-label">Team Rank</div></div>
        <div class="stat-box"><div class="stat-value">${fmt(stats.trackScrobbles)}</div><div class="stat-label">Track Streams</div></div>
        <div class="stat-box"><div class="stat-value">${fmt(stats.albumScrobbles)}</div><div class="stat-label">Album Streams</div></div>
        <div class="stat-box"><div class="stat-value">${album2xStatus.passed ? '✅' : '❌'}</div><div class="stat-label">2X Done</div></div>
    `;
    
    // Track contributions
    const tracksContainer = $('profile-tracks');
    if (tracksContainer) {
        tracksContainer.innerHTML = Object.keys(trackContributions).length 
            ? Object.entries(trackContributions)
                .sort((a, b) => b[1] - a[1])
                .map(([t, c]) => `<div class="contrib-item"><span>${sanitize(t)}</span><span>${fmt(c)} streams</span></div>`)
                .join('') 
            : '<p class="empty-text">No track data yet</p>';
    }
    
    // Album contributions
    const albumsContainer = $('profile-albums');
    if (albumsContainer) {
        albumsContainer.innerHTML = Object.keys(albumContributions).length 
            ? Object.entries(albumContributions)
                .sort((a, b) => b[1] - a[1])
                .map(([a, c]) => `<div class="contrib-item"><span>${sanitize(a)}</span><span>${fmt(c)} streams</span></div>`)
                .join('') 
            : '<p class="empty-text">No album data yet</p>';
    }
    
    // Badges
    const badgesContainer = $('profile-badges');
    if (badgesContainer) {
        badgesContainer.innerHTML = allCurrentBadges.length ? `
            <div style="margin-bottom:12px;">
                <span style="color:#888;font-size:12px;">Badges earned in ${STATE.week}</span>
            </div>
            <div class="badges-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(70px,1fr));gap:12px;">
                ${allCurrentBadges.map(b => `
                    <div class="badge-item" style="text-align:center;">
                        <div class="badge-circle holographic" style="width:55px;height:55px;margin:0 auto;">
                            <img src="${b.imageUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.parentElement.innerHTML='${b.icon || '🎖️'}';">
                        </div>
                        <div style="margin-top:6px;font-size:10px;color:${b.type === 'winner' ? '#ffd700' : b.type === 'achievement' ? '#7b2cbf' : '#888'};">
                            ${b.type === 'achievement' ? '✨ ' : b.type === 'winner' ? '🏆 ' : ''}${sanitize(b.name)}
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : `
            <div class="empty-state" style="text-align:center; padding:30px; color:#777;">
                <div style="font-size:40px; margin-bottom:10px;">🔒</div>
                <p style="margin:0;">Earn <strong style="color:#ffd700;">50 XP</strong> to unlock your first badge!</p>
            </div>
        `;
    }
}
// ==================== GOALS ====================
async function renderGoals() {
    const container = $('goals-content');
    const team = STATE.data?.profile?.team;
    try {
        const data = await api('getGoalsProgress', { week: STATE.week });
        if (data.lastUpdated) STATE.lastUpdated = data.lastUpdated;
        
        let html = renderGuide('goals') + `<div class="goals-header"><h2 style="color:#fff;margin:0;">🎯 Team Goal Progress</h2><span class="week-badge">${STATE.week}</span></div><div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated || 'recently')}</div>`;
        
        const trackGoals = data.trackGoals || {};
        if (Object.keys(trackGoals).length) {
            html += `<div class="card"><div class="card-header"><h3>🎵 Track Goals</h3><span class="team-badge" style="background:${teamColor(team)}22;color:${teamColor(team)}">${team}</span></div><div class="card-body">`;
            for (const [track, info] of Object.entries(trackGoals)) {
                const tp = info.teams?.[team] || {};
                const current = tp.current || 0, goal = info.goal || 0;
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
                const current = ap.current || 0, goal = info.goal || 0;
                const done = ap.status === 'Completed' || current >= goal;
                const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
                html += `<div class="goal-item ${done ? 'completed' : ''}"><div class="goal-header"><span class="goal-name">${sanitize(album)}</span><span class="goal-status ${done ? 'complete' : ''}">${fmt(current)}/${fmt(goal)} streams ${done ? '✅' : ''}</span></div><div class="progress-bar"><div class="progress-fill ${done ? 'complete' : ''}" style="width:${pct}%"></div></div></div>`;
            }
            html += '</div></div>';
        }
        container.innerHTML = html || '<div class="card"><div class="card-body"><p class="empty-text">No goals set for this week</p></div></div>';
    } catch (e) { container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load goals</p></div></div>'; }
}

// ==================== ALBUM CHALLENGE (Configurable) ====================
async function renderAlbum2x() {
    const container = $('album2x-content');
    const team = STATE.data?.profile?.team;
    const album2xStatus = STATE.data?.album2xStatus || {};
    const userTracks = album2xStatus.tracks || {};
    const teamTracks = CONFIG.TEAM_ALBUM_TRACKS[team] || [];
    const albumName = CONFIG.TEAMS[team]?.album || team;
    
    // ✅ Use configurable settings
    const REQUIRED = CONFIG.ALBUM_CHALLENGE.REQUIRED_STREAMS;
    const CHALLENGE_NAME = CONFIG.ALBUM_CHALLENGE.CHALLENGE_NAME;
    const BADGE_NAME = CONFIG.ALBUM_CHALLENGE.BADGE_NAME;
    
    // ✅ DEBUG: Log to check what data we're receiving
    console.log('=== ALBUM 2X DEBUG ===');
    console.log('Team:', team);
    console.log('Team Tracks from CONFIG:', teamTracks);
    console.log('User Tracks from API:', JSON.stringify(userTracks));
    console.log('User Track Keys:', Object.keys(userTracks));
    
    // ✅ FIX: Create a normalized lookup map for userTracks
    // This handles numeric keys, string keys, and case differences
    const normalizedUserTracks = {};
    for (const key in userTracks) {
        // Store with multiple key variations
        const strKey = String(key).trim();
        const lowerKey = strKey.toLowerCase();
        normalizedUserTracks[strKey] = userTracks[key];
        normalizedUserTracks[lowerKey] = userTracks[key];
        // If it's numeric, also store as number
        if (!isNaN(key)) {
            normalizedUserTracks[Number(key)] = userTracks[key];
        }
    }
    
    console.log('Normalized User Tracks:', normalizedUserTracks);
    
    let completedCount = 0;
    const trackResults = teamTracks.map(track => {
        // ✅ FIX: Try multiple ways to find the track
        const trackStr = String(track).trim();
        const trackLower = trackStr.toLowerCase();
        
        let count = 0;
        
        // Method 1: Direct lookup in normalized map
        if (normalizedUserTracks[trackStr] !== undefined) {
            count = normalizedUserTracks[trackStr];
        } else if (normalizedUserTracks[trackLower] !== undefined) {
            count = normalizedUserTracks[trackLower];
        } else if (normalizedUserTracks[track] !== undefined) {
            count = normalizedUserTracks[track];
        }
        // Method 2: If track is purely numeric, try number version
        else if (/^\d+$/.test(trackStr)) {
            const numKey = parseInt(trackStr, 10);
            if (normalizedUserTracks[numKey] !== undefined) {
                count = normalizedUserTracks[numKey];
            }
        }
        
        // ✅ Ensure count is a valid number
        count = Number(count) || 0;
        
        const passed = count >= REQUIRED;
        if (passed) completedCount++;
        
        // ✅ DEBUG: Log each track matching result
        console.log(`Track "${track}" (type: ${typeof track}) -> Found count: ${count}, Passed: ${passed}`);
        
        return { name: String(track), count, passed };
    });
    
    const allComplete = completedCount === trackResults.length && trackResults.length > 0;
    const pct = trackResults.length ? Math.round((completedCount / trackResults.length) * 100) : 0;
    
    // Fetch team status
    let teamMembersStatus = [];
    let teamPassed = 0;
    let teamFailed = 0;
    
    try {
        const album2xData = await api('getAlbum2xStatus', { week: STATE.week, team: team });
        const teamData = album2xData.teams?.[team] || {};
        teamMembersStatus = teamData.members || [];
        teamPassed = teamData.passed || 0;
        teamFailed = teamData.failed || 0;
    } catch (e) {
        console.log('Could not fetch team status:', e);
    }
    
    const passedMembers = teamMembersStatus.filter(m => m.passed);
    const failedMembers = teamMembersStatus.filter(m => !m.passed);
    const totalMembers = teamMembersStatus.length;
    const teamAllComplete = failedMembers.length === 0 && totalMembers > 0;
    
    container.innerHTML = `
        <!-- Guide with Important Notice -->
        <div class="card guide-card" style="background: rgba(255, 68, 68, 0.1); border-left: 3px solid #ff6b6b; margin-bottom: 20px;">
            <div class="card-body" style="display: flex; gap: 15px; align-items: flex-start; padding: 15px;">
                <div style="font-size: 24px;">⚠️</div>
                <div>
                    <h4 style="margin: 0 0 5px 0; color: #ff6b6b; font-size: 14px;">TEAM MISSION - Everyone Must Complete!</h4>
                    <p style="margin: 0; color: #aaa; font-size: 13px; line-height: 1.5;">
                        For your team to pass this mission, <strong style="color:#fff;">EVERY agent</strong> must stream each track at least <strong style="color:#ffd700;">${REQUIRED} times</strong>.
                        <br><br>
                        <span style="color:#ffd700;">🎖️ Reward:</span> Complete this to earn a special <strong style="color:#7b2cbf;">${BADGE_NAME} Badge!</strong>
                    </p>
                </div>
            </div>
        </div>
        
        <!-- Your Personal Progress Card -->
        <div class="card" style="border-color:${allComplete ? 'var(--success)' : teamColor(team)}">
            <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
                <h3 style="margin:0;">📊 Your ${CHALLENGE_NAME} Progress</h3>
                <span class="status-badge" style="
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 11px;
                    background: ${allComplete ? 'rgba(0,255,136,0.1)' : 'rgba(255,165,0,0.1)'};
                    color: ${allComplete ? '#00ff88' : '#ffa500'};
                    border: 1px solid ${allComplete ? 'rgba(0,255,136,0.3)' : 'rgba(255,165,0,0.3)'};
                ">${allComplete ? '✅ Complete' : '⏳ In Progress'}</span>
            </div>
            <div class="card-body" style="text-align:center;padding:30px;">
                <div style="font-size:56px;margin-bottom:16px;">${allComplete ? '🎉' : '⏳'}</div>
                <h2 style="color:${teamColor(team)};margin-bottom:8px;">${sanitize(albumName)}</h2>
                <p style="color:var(--text-dim);margin-bottom:20px;">Stream every track at least <strong>${REQUIRED} times</strong></p>
                
                <div style="font-size:48px;font-weight:700;color:${allComplete ? 'var(--success)' : 'var(--purple-glow)'}">${completedCount}/${trackResults.length}</div>
                <p style="color:var(--text-dim);">Tracks completed</p>
                
                <div class="progress-bar" style="margin:20px auto;max-width:300px;height:12px;">
                    <div class="progress-fill ${allComplete ? 'complete' : ''}" style="width:${pct}%;background:${allComplete ? 'var(--success)' : teamColor(team)}"></div>
                </div>
                
                ${allComplete ? `
                    <div style="
                        margin-top: 20px;
                        padding: 15px;
                        background: rgba(0,255,136,0.1);
                        border: 1px solid rgba(0,255,136,0.3);
                        border-radius: 10px;
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                    ">
                        <span style="font-size: 24px;">🎖️</span>
                        <div style="text-align: left;">
                            <div style="color: #00ff88; font-weight: 600; font-size: 14px;">Badge Unlocked!</div>
                            <div style="color: #888; font-size: 11px;">${BADGE_NAME} Badge earned</div>
                        </div>
                    </div>
                ` : `
                    <div style="
                        margin-top: 20px;
                        padding: 12px 20px;
                        background: rgba(123,44,191,0.1);
                        border: 1px solid rgba(123,44,191,0.3);
                        border-radius: 8px;
                        display: inline-block;
                    ">
                        <span style="color: #888; font-size: 12px;">
                            🎖️ Complete all tracks to earn the <span style="color:#7b2cbf;font-weight:600;">${BADGE_NAME} Badge</span>
                        </span>
                    </div>
                `}
            </div>
        </div>
        
        <!-- Track Checklist -->
        <div class="card">
            <div class="card-header"><h3>📋 Your Track Checklist</h3></div>
            <div class="card-body">
                ${trackResults.map((t, i) => `
                    <div class="track-item ${t.passed ? 'passed' : 'pending'}" style="
                        display: flex;
                        align-items: center;
                        padding: 12px;
                        margin-bottom: 8px;
                        background: ${t.passed ? 'rgba(0,255,136,0.05)' : 'rgba(255,255,255,0.02)'};
                        border-left: 3px solid ${t.passed ? 'var(--success)' : 'var(--danger)'};
                        border-radius: 6px;
                    ">
                        <span class="track-num" style="
                            width: 24px;
                            height: 24px;
                            background: ${t.passed ? 'var(--success)' : '#333'};
                            color: ${t.passed ? '#000' : '#888'};
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 11px;
                            font-weight: bold;
                            margin-right: 12px;
                        ">${i + 1}</span>
                        <span class="track-name" style="flex:1;color:#fff;font-size:13px;">${sanitize(t.name)}</span>
                        <span class="track-status" style="
                            padding: 4px 10px;
                            border-radius: 12px;
                            font-size: 11px;
                            font-weight: 600;
                            background: ${t.passed ? 'rgba(0,255,136,0.1)' : 'rgba(255,68,68,0.1)'};
                            color: ${t.passed ? '#00ff88' : '#ff6b6b'};
                        ">${t.count}/${REQUIRED} ${t.passed ? '✅' : ''}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- TEAM STATUS SECTION -->
        <div class="card" style="border-color: ${teamAllComplete ? '#00ff88' : '#ff6b6b'}; margin-top: 20px;">
            <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
                <h3 style="margin:0;">👥 Team ${sanitize(team)} Status</h3>
                <span style="
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 600;
                    background: ${teamAllComplete ? 'rgba(0,255,136,0.1)' : 'rgba(255,68,68,0.1)'};
                    color: ${teamAllComplete ? '#00ff88' : '#ff6b6b'};
                    border: 1px solid ${teamAllComplete ? 'rgba(0,255,136,0.3)' : 'rgba(255,68,68,0.3)'};
                ">${teamAllComplete ? '✅ Team Passed!' : `❌ ${failedMembers.length} Missing`}</span>
            </div>
            <div class="card-body">
                <!-- Team Progress Bar -->
                <div style="margin-bottom: 20px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                        <span style="color:#888;font-size:12px;">Team ${CHALLENGE_NAME} Completion</span>
                        <span style="color:#fff;font-size:12px;font-weight:600;">${teamPassed}/${totalMembers} agents</span>
                    </div>
                    <div class="progress-bar" style="height:10px;">
                        <div class="progress-fill ${teamAllComplete ? 'complete' : ''}" style="
                            width:${totalMembers > 0 ? (teamPassed/totalMembers)*100 : 0}%;
                            background:${teamAllComplete ? '#00ff88' : teamColor(team)};
                        "></div>
                    </div>
                </div>
                
                ${failedMembers.length > 0 ? `
                    <!-- WHO MISSED - IMPORTANT SECTION -->
                    <div style="
                        background: rgba(255,68,68,0.08);
                        border: 1px solid rgba(255,68,68,0.2);
                        border-radius: 12px;
                        padding: 15px;
                        margin-bottom: 15px;
                    ">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                            <span style="font-size:20px;">🚨</span>
                            <div>
                                <div style="color:#ff6b6b;font-weight:600;font-size:14px;">Agents Who Need to Complete ${CHALLENGE_NAME}</div>
                                <div style="color:#888;font-size:11px;">Help remind them! The team needs everyone.</div>
                            </div>
                        </div>
                        
                        <div style="display:flex;flex-wrap:wrap;gap:8px;">
                            ${failedMembers.map(m => `
                                <div style="
                                    display: flex;
                                    align-items: center;
                                    gap: 8px;
                                    padding: 8px 12px;
                                    background: rgba(255,68,68,0.1);
                                    border: 1px solid rgba(255,68,68,0.2);
                                    border-radius: 8px;
                                ">
                                    <span style="font-size:14px;">❌</span>
                                    <span style="color:#fff;font-size:12px;">${sanitize(m.name)}</span>
                                    ${String(m.agentNo) === String(STATE.agentNo) ? `
                                        <span style="
                                            background:#ff6b6b;
                                            color:#000;
                                            padding:2px 6px;
                                            border-radius:4px;
                                            font-size:9px;
                                            font-weight:bold;
                                        ">YOU</span>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                        
                        <div style="
                            margin-top: 12px;
                            padding: 10px;
                            background: rgba(255,165,0,0.1);
                            border-radius: 8px;
                            text-align: center;
                        ">
                            <span style="color:#ffa500;font-size:11px;">
                                💬 Gently remind them in the team GC or Secret Comms!
                            </span>
                        </div>
                    </div>
                ` : ''}
                
                ${passedMembers.length > 0 ? `
                    <!-- Agents Who Completed -->
                    <div style="
                        background: rgba(0,255,136,0.05);
                        border: 1px solid rgba(0,255,136,0.1);
                        border-radius: 12px;
                        padding: 15px;
                    ">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                            <span style="font-size:20px;">🎉</span>
                            <div>
                                <div style="color:#00ff88;font-weight:600;font-size:14px;">Agents Who Completed ${CHALLENGE_NAME}</div>
                                <div style="color:#888;font-size:11px;">${passedMembers.length} agent${passedMembers.length !== 1 ? 's' : ''} done!</div>
                            </div>
                        </div>
                        
                        <div style="display:flex;flex-wrap:wrap;gap:8px;">
                            ${passedMembers.slice(0, 20).map(m => `
                                <div style="
                                    display: flex;
                                    align-items: center;
                                    gap: 6px;
                                    padding: 6px 10px;
                                    background: rgba(0,255,136,0.1);
                                    border: 1px solid rgba(0,255,136,0.15);
                                    border-radius: 6px;
                                ">
                                    <span style="font-size:12px;">✅</span>
                                    <span style="color:#ccc;font-size:11px;">${sanitize(m.name)}</span>
                                    ${String(m.agentNo) === String(STATE.agentNo) ? `
                                        <span style="
                                            background:#00ff88;
                                            color:#000;
                                            padding:2px 6px;
                                            border-radius:4px;
                                            font-size:9px;
                                            font-weight:bold;
                                        ">YOU</span>
                                    ` : ''}
                                </div>
                            `).join('')}
                            ${passedMembers.length > 20 ? `
                                <div style="color:#888;font-size:11px;padding:6px;">
                                    +${passedMembers.length - 20} more...
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
        
        <!-- Team Status Note -->
        <div class="card" style="background: rgba(255,255,255,0.02); margin-top: 15px;">
            <div class="card-body" style="text-align:center;padding:20px;">
                ${teamAllComplete ? `
                    <div style="font-size:40px;margin-bottom:10px;">🎊</div>
                    <p style="color:#00ff88;font-size:14px;font-weight:600;margin:0 0 5px 0;">
                        Amazing! Your entire team completed the ${CHALLENGE_NAME} Challenge!
                    </p>
                    <p style="color:#888;font-size:12px;margin:0;">
                        This mission is PASSED! 🎖️
                    </p>
                ` : `
                    <p style="color:#888;font-size:12px;margin:0;">
                        💜 Help your teammates complete this challenge!<br>
                        <span style="color:#ff6b6b;font-weight:600;">${failedMembers.length} agent${failedMembers.length !== 1 ? 's' : ''}</span> still need${failedMembers.length === 1 ? 's' : ''} to finish for the team to pass.
                    </p>
                `}
            </div>
        </div>
    `;
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
    } catch (e) { container.innerHTML = '<p class="error-text">Failed to load overall rankings</p>'; }
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
            <div class="rankings-header"><span class="week-badge" style="background-color: ${teamColor(myTeam)}">${myTeam} ranking</span></div>
            ${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}
            ${rankingsHtml}
        `;
    } catch (e) { container.innerHTML = '<p class="error-text">Failed to load team rankings.</p>'; }
}

// ==================== TEAM LEVEL ====================
async function renderTeamLevel() {
    const container = $('team-level-content');
    try {
        const summary = await api('getWeeklySummary', { week: STATE.week });
        const teams = summary.teams || {};
        const myTeam = STATE.data?.profile?.team;
        if (summary.lastUpdated) STATE.lastUpdated = summary.lastUpdated;
        const sortedTeams = Object.entries(teams).sort((a, b) => (b[1].teamXP || 0) - (a[1].teamXP || 0));
        const isCompleted = isWeekCompleted(STATE.week);
        
        // Find teams that completed all missions
        const teamsWithAllMissions = sortedTeams.filter(([t, info]) => 
            info.trackGoalPassed && info.albumGoalPassed && info.album2xPassed
        );
        
        // Winner is the team with highest XP that completed ALL missions
        const winnerTeam = teamsWithAllMissions.length > 0 ? teamsWithAllMissions[0][0] : null;
        const leadingTeam = sortedTeams[0]?.[0];
        const leadingHasAllMissions = teamsWithAllMissions.some(([t]) => t === leadingTeam);
        
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
                        <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
                            <span style="font-size: 20px;">1️⃣</span>
                            <div>
                                <div style="color: #fff; font-size: 13px; font-weight: 600;">Complete ALL 3 Missions</div>
                                <div style="color: #888; font-size: 11px; margin-top: 3px;">
                                    🎵 Track Goals + 💿 Album Goals + ✨ Album 2X
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 12px;">
                            <span style="font-size: 20px;">2️⃣</span>
                            <div>
                                <div style="color: #fff; font-size: 13px; font-weight: 600;">Have the Highest XP</div>
                                <div style="color: #888; font-size: 11px; margin-top: 3px;">
                                    Among teams that completed all missions
                                </div>
                            </div>
                        </div>
                    </div>
                    
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
                            <strong>Important:</strong> A team with high XP but incomplete missions <strong>CANNOT</strong> win!
                        </span>
                    </div>
                    
                    ${!isCompleted ? `
                        <div style="margin-top: 15px; text-align: center;">
                            ${winnerTeam ? `
                                <div style="
                                    display: inline-flex;
                                    align-items: center;
                                    gap: 8px;
                                    padding: 8px 16px;
                                    background: rgba(0,255,136,0.1);
                                    border: 1px solid rgba(0,255,136,0.3);
                                    border-radius: 20px;
                                ">
                                    <span style="color: #00ff88; font-size: 12px;">👑 Currently Winning:</span>
                                    <span style="color: ${teamColor(winnerTeam)}; font-weight: 600;">${winnerTeam}</span>
                                </div>
                            ` : leadingTeam ? `
                                <div style="
                                    display: inline-flex;
                                    align-items: center;
                                    gap: 8px;
                                    padding: 8px 16px;
                                    background: rgba(255,165,0,0.1);
                                    border: 1px solid rgba(255,165,0,0.3);
                                    border-radius: 20px;
                                ">
                                    <span style="color: #ffa500; font-size: 12px;">⚡ Leading in XP:</span>
                                    <span style="color: ${teamColor(leadingTeam)}; font-weight: 600;">${leadingTeam}</span>
                                    <span style="color: #888; font-size: 10px;">(needs all missions)</span>
                                </div>
                            ` : `
                                <div style="color: #888; font-size: 12px;">
                                    No team has completed all missions yet
                                </div>
                            `}
                        </div>
                    ` : ''}
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
                <h2>Team Levels</h2>
                <span class="week-badge">${STATE.week}</span>
            </div>
            
            ${STATE.lastUpdated ? `<div class="last-updated-banner">📊 Updated: ${formatLastUpdated(STATE.lastUpdated)}</div>` : ''}
            
            <div class="team-level-grid">
                ${sortedTeams.map(([t, info], index) => { 
                    const isMyTeam = t === myTeam;
                    const hasAllMissions = info.trackGoalPassed && info.albumGoalPassed && info.album2xPassed;
                    const isCurrentWinner = t === winnerTeam;
                    const tColor = teamColor(t);
                    const missions = (info.trackGoalPassed ? 1 : 0) + (info.albumGoalPassed ? 1 : 0) + (info.album2xPassed ? 1 : 0); 
                    
                    return `
                        <div class="team-level-card ${isMyTeam ? 'my-team' : ''}" style="
                            border-color:${tColor};
                            ${isCurrentWinner ? 'box-shadow: 0 0 25px rgba(255,215,0,0.3); border-color: #ffd700;' : ''}
                        ">
                            ${isMyTeam ? '<div class="my-team-badge">Your Team</div>' : ''}
                            ${isCurrentWinner && !isCompleted ? '<div style="position:absolute;top:10px;right:10px;font-size:20px;" title="Currently Winning">👑</div>' : ''}
                            ${!hasAllMissions && index === 0 ? '<div style="position:absolute;top:10px;right:10px;font-size:14px;color:#ffa500;" title="Highest XP but missing missions">⚡</div>' : ''}
                            ${teamPfp(t) ? `<img src="${teamPfp(t)}" class="team-level-pfp" style="border-color:${isCurrentWinner ? '#ffd700' : tColor}">` : ''}
                            <div class="team-level-name" style="color:${tColor}">${t}</div>
                            <div class="team-level-num">${info.level || 1}</div>
                            <div class="team-level-label">LEVEL</div>
                            <div class="team-level-xp">${fmt(info.teamXP)} XP</div>
                            <div class="team-level-missions">
                                <div class="mission-check" title="Track Goals">${info.trackGoalPassed ? '🎵✅' : '🎵❌'}</div>
                                <div class="mission-check" title="Album Goals">${info.albumGoalPassed ? '💿✅' : '💿❌'}</div>
                                <div class="mission-check" title="Album 2X">${info.album2xPassed ? '✨✅' : '✨❌'}</div>
                            </div>
                            <div class="team-level-status ${missions === 3 ? 'complete' : ''}" style="${isCurrentWinner ? 'color:#ffd700;' : ''}">
                                ${isCurrentWinner ? '👑 Winning!' : `${missions}/3 missions`}
                            </div>
                        </div>
                    `; 
                }).join('')}
            </div>
            
            <!-- Mission Status Legend -->
            <div class="card" style="margin-top: 20px; background: rgba(255,255,255,0.02);">
                <div class="card-body" style="padding: 15px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; text-align: center;">
                        <div>
                            <span style="font-size: 18px;">👑</span>
                            <div style="color: #888; font-size: 10px; margin-top: 4px;">Currently Winning</div>
                        </div>
                        <div>
                            <span style="font-size: 18px;">⚡</span>
                            <div style="color: #888; font-size: 10px; margin-top: 4px;">High XP, Missing Missions</div>
                        </div>
                        <div>
                            <span style="font-size: 18px;">✅✅✅</span>
                            <div style="color: #888; font-size: 10px; margin-top: 4px;">All Missions Complete</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (e) { 
        console.error('Team level error:', e);
        container.innerHTML = '<div class="card"><div class="card-body"><p class="error-text">Failed to load team levels</p></div></div>'; 
    }
}

// ==================== COMPARISON ====================
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
                                <div class="progress-bar"><div class="progress-fill" style="width:${(t.teamXP/maxXP)*100}%;background:${teamColor(t.team)}"></div></div>
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
                                                    <div class="progress-bar-small"><div class="progress-fill ${done ? 'complete' : ''}" style="width:${pct}%;background:${teamColor(teamName)}"></div></div>
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
                                                    <div class="progress-bar-small"><div class="progress-fill ${done ? 'complete' : ''}" style="width:${pct}%;background:${teamColor(teamName)}"></div></div>
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

// ==================== SECRET MISSIONS ====================
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
        
        // Update notification state
        STATE.lastChecked.missions = activeMissions.length;
        saveNotificationState();
        
    } catch (e) {
        console.error('Failed to load secret missions:', e);
        container.innerHTML = renderGuide('secret-missions') + '<div class="card"><div class="card-body error-state"><p>Failed to load secret missions.</p><button onclick="renderSecretMissions()" class="btn-secondary">Retry</button></div></div>';
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
                <div class="progress-bar"><div class="progress-fill ${isComplete ? 'complete' : ''}" style="width:${pct}%;background:${teamColor(myTeam)}"></div></div>
                ${isComplete ? `<div class="progress-complete">✅ Mission Complete! +${mission.xpReward || 5} XP</div>` : `<div class="progress-remaining">${goalTarget - myProgress} more streams needed</div>`}
            </div>
            <div class="smc-footer"><span class="smc-reward">⭐ +${mission.xpReward || 5} XP</span></div>
        </div>
    `;
}

// ==================== SONG OF THE DAY (WITH 2 CHANCES - FIXED) ====================
async function renderSongOfDay() {
    // Create page container if needed
    let page = $('page-song-of-day');
    if (!page) {
        const mainContent = document.querySelector('.pages-wrapper') || document.querySelector('main');
        if (mainContent) {
            page = document.createElement('section');
            page.id = 'page-song-of-day';
            page.className = 'page active';
            page.innerHTML = '<div id="song-of-day-content"></div>';
            mainContent.appendChild(page);
        }
    } else {
        page.classList.add('active');
    }
    
    let container = $('song-of-day-content');
    if (!container && page) {
        page.innerHTML = '<div id="song-of-day-content"></div>';
        container = $('song-of-day-content');
    }
    
    if (!container) {
        showToast('Failed to load page', 'error');
        return;
    }
    
    // ✅ GET TODAY'S DATE FOR DISPLAY
    const today = new Date();
    const dateDisplay = today.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const shortDate = today.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
    
    container.innerHTML = `
        <div style="text-align:center;padding:40px;color:#888;">
            <div class="loading-spinner" style="
                width: 40px;
                height: 40px;
                border: 3px solid #333;
                border-top-color: #7b2cbf;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto;
            "></div>
            <p style="margin-top:15px;">Loading today's challenge...</p>
        </div>
        <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
    `;
    
    try {
        // ✅ IMPORTANT: Pass agentNo to get user state from server
        const data = await api('getSongOfDay', { agentNo: STATE.agentNo });
        
        console.log('🎬 Song of Day data:', data);
        
        if (!data || !data.success || !data.song) {
            container.innerHTML = `
                <div class="card" style="text-align:center;padding:40px;">
                    <div style="
                        background: linear-gradient(135deg, #7b2cbf22, #7b2cbf11);
                        border: 1px solid #7b2cbf44;
                        border-radius: 12px;
                        padding: 12px 20px;
                        margin-bottom: 25px;
                        display: inline-block;
                    ">
                        <span style="color: #7b2cbf; font-size: 14px; font-weight: 600;">📅 ${dateDisplay}</span>
                    </div>
                    
                    <div style="font-size:64px;margin-bottom:20px;">🎬</div>
                    <h3 style="color:#fff;margin-bottom:10px;">No Song Today</h3>
                    <p style="color:#888;margin-bottom:20px;">Check back later!</p>
                    <button onclick="loadPage('home')" class="btn-secondary">← Back to Home</button>
                </div>
            `;
            return;
        }
        
        const song = data.song;
        const todayStr = today.toDateString();
        
        // ✅ STORAGE KEYS FOR 2 CHANCES
        const attemptsKey = 'song_attempts_' + STATE.agentNo + '_' + todayStr;
        const correctKey = 'song_correct_' + STATE.agentNo + '_' + todayStr;
        
        // ✅ Get from localStorage first (using let so we can update)
        let attempts = parseInt(localStorage.getItem(attemptsKey) || '0');
        let wasCorrect = localStorage.getItem(correctKey) === 'true';
        
        // ✅ SYNC WITH SERVER STATE - This is the key fix!
        if (data.userAttempts !== undefined) {
            attempts = data.userAttempts;
            localStorage.setItem(attemptsKey, attempts.toString());
            console.log('📊 Synced attempts from server:', attempts);
        }
        if (data.userCorrect !== undefined) {
            wasCorrect = data.userCorrect;
            localStorage.setItem(correctKey, wasCorrect ? 'true' : 'false');
            console.log('📊 Synced correct status from server:', wasCorrect);
        }
        
        const maxAttempts = 2;
        const attemptsRemaining = Math.max(0, maxAttempts - attempts);
        
        // ✅ CHECK IF USER CAN STILL ANSWER
        const canAnswer = !wasCorrect && attempts < maxAttempts;
        
        console.log('🎬 SOTD State:', { attempts, wasCorrect, canAnswer, attemptsRemaining });
        
        container.innerHTML = `
            <!-- ✅ PROMINENT DATE HEADER -->
            <div style="
                background: linear-gradient(135deg, #ff000022, #ff000011);
                border: 1px solid #ff000044;
                border-radius: 16px;
                padding: 20px;
                text-align: center;
                margin-bottom: 20px;
            ">
                <div style="font-size:40px;margin-bottom:10px;">🎬</div>
                <h2 style="color:#fff;margin:0 0 8px 0;">Song of the Day</h2>
                
                <!-- ✅ DATE BADGE -->
                <div style="
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 20px;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 25px;
                    margin-bottom: 10px;
                ">
                    <span style="font-size: 18px;">📅</span>
                    <span style="color: #fff; font-size: 14px; font-weight: 600;">${dateDisplay}</span>
                </div>
                
                <p style="color:#888;margin:0;font-size:12px;">Find the correct YouTube link & earn XP!</p>
            </div>
            
            <!-- Hint Card -->
            <div class="card" style="margin-bottom:20px;">
                <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
                    <h3 style="margin:0;">💡 Today's Hint</h3>
                    <span style="
                        padding: 4px 12px;
                        background: rgba(255,0,0,0.1);
                        border: 1px solid rgba(255,0,0,0.3);
                        border-radius: 12px;
                        color: #ff6b6b;
                        font-size: 11px;
                    ">${shortDate}</span>
                </div>
                <div class="card-body" style="text-align:center;padding:25px;">
                    <div style="
                        font-size: 18px;
                        color: #ffd700;
                        line-height: 1.6;
                        font-style: italic;
                        padding: 15px;
                        background: rgba(255,215,0,0.05);
                        border-radius: 12px;
                        border: 1px dashed rgba(255,215,0,0.3);
                    ">"${sanitize(song.hint || 'No hint available!')}"</div>
                    
                    <div style="
                        margin-top: 15px;
                        padding: 10px 20px;
                        background: rgba(0,255,136,0.1);
                        border-radius: 20px;
                        display: inline-block;
                    ">
                        <span style="color:#00ff88;font-size:14px;">🎁 Reward: +${song.xpReward || 1} XP</span>
                    </div>
                </div>
            </div>
            
            <!-- Answer Section -->
            <div class="card" style="border-color:${!canAnswer ? (wasCorrect ? '#00ff88' : '#ff4444') : '#7b2cbf'};">
                <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
                    <h3 style="margin:0;">${!canAnswer ? '📋 Your Result' : '🔗 Your Answer'}</h3>
                    ${canAnswer ? `
                        <!-- ✅ ATTEMPTS REMAINING BADGE -->
                        <div style="
                            display: flex;
                            align-items: center;
                            gap: 5px;
                            padding: 6px 12px;
                            background: ${attemptsRemaining === 1 ? 'rgba(255,165,0,0.15)' : 'rgba(0,255,136,0.1)'};
                            border: 1px solid ${attemptsRemaining === 1 ? 'rgba(255,165,0,0.4)' : 'rgba(0,255,136,0.3)'};
                            border-radius: 20px;
                        ">
                            <span style="font-size:12px;">🎯</span>
                            <span style="
                                color: ${attemptsRemaining === 1 ? '#ffa500' : '#00ff88'};
                                font-size: 12px;
                                font-weight: 600;
                            ">${attemptsRemaining} ${attemptsRemaining === 1 ? 'Chance' : 'Chances'} Left</span>
                        </div>
                    ` : ''}
                </div>
                <div class="card-body" style="padding:20px;">
                    ${!canAnswer ? `
                        <!-- Already Answered / Out of Attempts -->
                        <div style="text-align:center;padding:20px;">
                            <div style="font-size:64px;margin-bottom:15px;">
                                ${wasCorrect ? '🎉' : '😅'}
                            </div>
                            <div style="
                                color: ${wasCorrect ? '#00ff88' : '#ff4444'};
                                font-size: 24px;
                                font-weight: bold;
                                margin-bottom: 10px;
                            ">
                                ${wasCorrect ? 'Correct!' : 'Out of Attempts!'}
                            </div>
                            <div style="color:#888;font-size:14px;">
                                ${wasCorrect 
                                    ? `You earned +${song.xpReward || 1} XP! 💜` 
                                    : `You used all ${maxAttempts} chances. Better luck tomorrow!`}
                            </div>
                            
                            <!-- ✅ ATTEMPTS USED INDICATOR -->
                            ${!wasCorrect ? `
                                <div style="
                                    margin-top: 15px;
                                    display: flex;
                                    justify-content: center;
                                    gap: 8px;
                                ">
                                    ${Array(maxAttempts).fill(0).map((_, i) => `
                                        <div style="
                                            width: 12px;
                                            height: 12px;
                                            border-radius: 50%;
                                            background: ${i < attempts ? '#ff4444' : '#333'};
                                            border: 1px solid ${i < attempts ? '#ff4444' : '#555'};
                                        "></div>
                                    `).join('')}
                                </div>
                                <div style="color:#666;font-size:11px;margin-top:8px;">
                                    ${attempts}/${maxAttempts} attempts used
                                </div>
                            ` : ''}
                            
                            ${song.title ? `
                                <div style="
                                    margin-top: 20px;
                                    padding: 15px;
                                    background: ${wasCorrect ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.05)'};
                                    border-radius: 12px;
                                    border: 1px solid ${wasCorrect ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.1)'};
                                ">
                                    <div style="color:${wasCorrect ? '#00ff88' : '#fff'};font-size:16px;font-weight:600;">
                                        🎵 ${sanitize(song.title)}
                                    </div>
                                    ${song.artist ? `
                                        <div style="color:#888;font-size:12px;margin-top:5px;">
                                            ${sanitize(song.artist)}
                                        </div>
                                    ` : ''}
                                </div>
                                
                                <!-- Watch on YouTube Button -->
                                ${song.youtubeId ? `
                                    <div style="
                                        margin-top:20px;
                                        padding:15px;
                                        background:rgba(255,0,0,0.1);
                                        border:1px solid rgba(255,0,0,0.3);
                                        border-radius:12px;
                                    ">
                                        <p style="color:#fff;font-size:13px;margin:0 0 12px 0;">
                                            🎬 <strong>Watch the full video</strong> to support BTS!
                                        </p>
                                        <a href="https://youtube.com/watch?v=${song.youtubeId}" 
                                           target="_blank" 
                                           rel="noopener noreferrer"
                                           style="
                                               display:inline-flex;
                                               align-items:center;
                                               gap:8px;
                                               padding:10px 24px;
                                               background:linear-gradient(135deg, #ff0000, #cc0000);
                                               color:#fff;
                                               border-radius:25px;
                                               text-decoration:none;
                                               font-size:14px;
                                               font-weight:600;
                                               box-shadow:0 4px 15px rgba(255,0,0,0.3);
                                           ">
                                            <span>▶️</span>
                                            <span>Watch on YouTube</span>
                                        </a>
                                    </div>
                                ` : ''}
                            ` : ''}
                            
                            <div style="margin-top:20px;color:#666;font-size:12px;">
                                ⏰ New song tomorrow at midnight!
                            </div>
                        </div>
                    ` : `
                        <!-- Submit Answer Form -->
                        
                        <!-- ✅ PREVIOUS ATTEMPT WARNING (if this is 2nd attempt) -->
                        ${attempts === 1 ? `
                            <div style="
                                padding: 12px;
                                background: rgba(255,165,0,0.1);
                                border: 1px solid rgba(255,165,0,0.3);
                                border-radius: 10px;
                                margin-bottom: 15px;
                                display: flex;
                                align-items: center;
                                gap: 10px;
                            ">
                                <span style="font-size:20px;">⚠️</span>
                                <div>
                                    <div style="color:#ffa500;font-size:13px;font-weight:600;">Last Chance!</div>
                                    <div style="color:#888;font-size:11px;">Your first answer was wrong. This is your final attempt!</div>
                                </div>
                            </div>
                        ` : ''}
                        
                        <div style="margin-bottom:15px;">
                            <label style="color:#888;font-size:12px;display:block;margin-bottom:8px;">
                                Paste YouTube Link:
                            </label>
                            <input 
                                type="text" 
                                id="youtube-answer" 
                                placeholder="https://youtube.com/watch?v=..."
                                autocomplete="off"
                                style="
                                    width: 100%;
                                    box-sizing: border-box;
                                    background: #1a1a2e;
                                    border: 1px solid #333;
                                    border-radius: 10px;
                                    padding: 15px;
                                    color: #fff;
                                    font-size: 14px;
                                "
                            >
                        </div>
                        
                        <div style="
                            padding: 12px;
                            background: rgba(255,255,255,0.03);
                            border-radius: 8px;
                            margin-bottom: 15px;
                        ">
                            <div style="color:#888;font-size:11px;line-height:1.6;">
                                ✅ Accepted formats:<br>
                                • youtube.com/watch?v=xxxxx<br>
                                • youtu.be/xxxxx<br>
                                • m.youtube.com/watch?v=xxxxx
                            </div>
                        </div>
                        
                        <button 
                            id="submit-song-btn"
                            onclick="submitSongAnswer()"
                            style="
                                width: 100%;
                                padding: 15px;
                                background: linear-gradient(135deg, #ff0000, #cc0000);
                                border: none;
                                border-radius: 12px;
                                color: #fff;
                                font-size: 16px;
                                font-weight: bold;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 10px;
                            "
                        >
                            <span>▶️</span>
                            <span>Submit Answer</span>
                        </button>
                        
                        <!-- ✅ 2 CHANCES INFO -->
                        <div style="
                            margin-top: 15px;
                            text-align: center;
                            padding: 12px;
                            background: rgba(123,44,191,0.1);
                            border: 1px solid rgba(123,44,191,0.3);
                            border-radius: 10px;
                        ">
                            <div style="display:flex;justify-content:center;gap:6px;margin-bottom:8px;">
                                ${Array(maxAttempts).fill(0).map((_, i) => `
                                    <div style="
                                        width: 10px;
                                        height: 10px;
                                        border-radius: 50%;
                                        background: ${i < attempts ? '#ff4444' : '#7b2cbf'};
                                        border: 1px solid ${i < attempts ? '#ff4444' : '#7b2cbf'};
                                    "></div>
                                `).join('')}
                            </div>
                            <div style="color:#7b2cbf;font-size:12px;">
                                🎯 You have <strong>${attemptsRemaining}</strong> ${attemptsRemaining === 1 ? 'chance' : 'chances'} to guess correctly!
                            </div>
                        </div>
                    `}
                </div>
            </div>
            
            <!-- How to Play -->
            <div class="card" style="background:rgba(255,255,255,0.02);margin-top:20px;">
                <div class="card-body" style="padding:15px;">
                    <div style="color:#888;font-size:12px;line-height:1.8;">
                        <strong style="color:#fff;">📖 How to Play:</strong><br>
                        1️⃣ Read the hint above<br>
                        2️⃣ Find the matching BTS song on YouTube<br>
                        3️⃣ Copy & paste the YouTube link<br>
                        4️⃣ Submit and earn XP if correct! 🎉<br>
                        <span style="color:#00ff88;">💡 You get <strong>2 chances</strong> per day!</span>
                    </div>
                </div>
            </div>
            
            <!-- Back Button -->
            <button onclick="loadPage('home')" class="btn-secondary" style="width:100%;margin-top:20px;padding:15px;">
                ← Back to Home
            </button>
            
            ${STATE.isAdmin ? `
                <!-- Admin Section -->
                <div class="card" style="margin-top:20px;border-color:#ffd700;">
                    <div class="card-header" style="background:rgba(255,215,0,0.05);">
                        <h3 style="margin:0;color:#ffd700;">👑 Admin Controls</h3>
                    </div>
                    <div class="card-body">
                        <button onclick="setTodaysSong()" class="btn-primary" style="
                            width:100%;
                            background:linear-gradient(135deg, #ffd700, #ff8c00);
                            color:#000;
                            margin-bottom:10px;
                        ">
                            🎵 Set Today's Song
                        </button>
                        <button onclick="clearSOTDLocalStorage()" class="btn-secondary" style="width:100%;">
                            🧹 Clear Local Storage (Debug)
                        </button>
                    </div>
                </div>
            ` : ''}
        `;
        
        // Focus input and setup enter key
        if (canAnswer) {
            setTimeout(() => {
                const input = $('youtube-answer');
                if (input) {
                    input.focus();
                    input.addEventListener('keypress', e => {
                        if (e.key === 'Enter') submitSongAnswer();
                    });
                }
            }, 100);
        }
        
        // Update notification state
        STATE.lastChecked.songOfDay = todayStr;
        saveNotificationState();
        
    } catch (e) {
        console.error('Song of day error:', e);
        container.innerHTML = `
            <div class="card" style="text-align:center;padding:40px;">
                <div style="font-size:48px;margin-bottom:15px;">❌</div>
                <h3 style="color:#ff4444;margin-bottom:10px;">Failed to Load</h3>
                <p style="color:#888;margin-bottom:20px;">${sanitize(e.message)}</p>
                <button onclick="renderSongOfDay()" class="btn-primary" style="margin-right:10px;">🔄 Retry</button>
                <button onclick="loadPage('home')" class="btn-secondary">← Back</button>
            </div>
        `;
    }
}

// ==================== DEBUG: Clear SOTD localStorage ====================
function clearSOTDLocalStorage() {
    const today = new Date().toDateString();
    const attemptsKey = 'song_attempts_' + STATE.agentNo + '_' + today;
    const correctKey = 'song_correct_' + STATE.agentNo + '_' + today;
    
    localStorage.removeItem(attemptsKey);
    localStorage.removeItem(correctKey);
    
    showToast('SOTD localStorage cleared!', 'success');
    renderSongOfDay();
}

// Make sure to export
window.clearSOTDLocalStorage = clearSOTDLocalStorage;

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

// ==================== PLAYLISTS ====================
async function renderPlaylists() {
    const container = $('playlists-content');
    if (!container) return;
    
    container.innerHTML = `
        ${renderGuide('playlists')}
        <div class="card">
            <div class="card-header"><h3>🎵 Official Streaming Playlists</h3></div>
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
        const listEl = $('playlists-list');
        
        if (playlists.length) {
            listEl.innerHTML = playlists.map(pl => `
                <div class="playlist-card">
                    <a href="${sanitize(pl.link || pl.url)}" target="_blank" class="playlist-link">
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
        
        STATE.lastChecked.playlists = playlists.length;
        saveNotificationState();
        
    } catch (e) {
        console.error('Failed to load playlists:', e);
        $('playlists-list').innerHTML = '<p style="color:red;">Failed to load playlists</p>';
    }
}

function getPlaylistIcon(platform) {
    const icons = { 
        'spotify': '💚', 
        'apple': '🍎', 
        'youtube': '🔴', 
        'amazon': '📦', 
        'deezer': '🎧',
        'youtube music': '🔴'
    };
    return icons[(platform || '').toLowerCase()] || '🎵';
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

// ==================== MISSING FUNCTION: showChatRules ====================
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

// ==================== CLEANUP CHAT ON PAGE LEAVE ====================
// Add this to the router - call cleanupChat() when leaving chat page
// Already defined in Part 1, ensuring it's called properly

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
window.renderSummary = renderSummary;
window.renderComparison = renderComparison;
window.renderGCLinks = renderGCLinks;
window.renderHelperRoles = renderHelperRoles;

console.log('🎮 BTS Spy Battle v5.0 Loaded');
