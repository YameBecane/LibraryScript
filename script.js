// Script Database
const scriptsData = [
    {
        id: 1,
        title: "Quizizz Auto-Answer",
        description: "Enhanced Quizizz experience with auto-answer, skip questions, and smart highlighting.",
        category: "Quizizz",
        scriptUrl: "https://raw.githubusercontent.com/eduscript/quizizz/main/quizizz.user.js",
        installUrl: "https://raw.githubusercontent.com/eduscript/quizizz/main/quizizz.user.js"
    },
    {
        id: 2,
        title: "Khan Academy Helper",
        description: "Show video transcripts, skip intro, and track progress automatically.",
        category: "Khan Academy",
        scriptUrl: "https://raw.githubusercontent.com/eduscript/khan/main/khan.user.js",
        installUrl: "https://raw.githubusercontent.com/eduscript/khan/main/khan.user.js"
    },
    {
        id: 3,
        title: "Redação PR Optimizer",
        description: "Grammar checker, word counter, and essay structure analyzer for Redação PR.",
        category: "Redação PR",
        scriptUrl: "https://raw.githubusercontent.com/eduscript/redacao/main/redacao.user.js",
        installUrl: "https://raw.githubusercontent.com/eduscript/redacao/main/redacao.user.js"
    },
    {
        id: 4,
        title: "Leia Paraná Reader",
        description: "Speed reading mode, dark theme, and text-to-speech integration.",
        category: "Leia Paraná",
        scriptUrl: "https://raw.githubusercontent.com/eduscript/leia/main/leia.user.js",
        installUrl: "https://raw.githubusercontent.com/eduscript/leia/main/leia.user.js"
    },
    {
        id: 5,
        title: "Quizizz Cheat Shield",
        description: "Bypass proctoring and anti-cheat mechanisms on Quizizz.",
        category: "Quizizz",
        scriptUrl: "https://raw.githubusercontent.com/eduscript/quizizz/main/quizizz-shield.user.js",
        installUrl: "https://raw.githubusercontent.com/eduscript/quizizz/main/quizizz-shield.user.js"
    },
    {
        id: 6,
        title: "Khan Academy Solutions",
        description: "Automated hints and step-by-step solutions for math problems.",
        category: "Khan Academy",
        scriptUrl: "https://raw.githubusercontent.com/eduscript/khan/main/khan-solutions.user.js",
        installUrl: "https://raw.githubusercontent.com/eduscript/khan/main/khan-solutions.user.js"
    },
    {
        id: 7,
        title: "Redação PR Pro",
        description: "Advanced statistics, writing tips, and AI-powered suggestions.",
        category: "Redação PR",
        scriptUrl: "https://raw.githubusercontent.com/eduscript/redacao/main/redacao-pro.user.js",
        installUrl: "https://raw.githubusercontent.com/eduscript/redacao/main/redacao-pro.user.js"
    },
    {
        id: 8,
        title: "Leia Paraná Downloader",
        description: "Download books and articles as PDF from Leia Paraná platform.",
        category: "Leia Paraná",
        scriptUrl: "https://raw.githubusercontent.com/eduscript/leia/main/leia-downloader.user.js",
        installUrl: "https://raw.githubusercontent.com/eduscript/leia/main/leia-downloader.user.js"
    }
];

// Global variables
let currentScreen = 'home';
let currentCategory = 'All';
let searchQuery = '';

// Helper: Show Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Helper: Copy to Clipboard
async function copyToClipboard(text, type = 'script') {
    try {
        await navigator.clipboard.writeText(text);
        showToast(`${type === 'script' ? 'Script URL' : 'Link'} copied to clipboard!`);
    } catch (err) {
        showToast('Failed to copy');
    }
}

// Helper: Install Script
function installScript(scriptUrl) {
    if (scriptUrl) {
        window.open(scriptUrl, '_blank');
        showToast('Opening script installation...');
    }
}

// Render Scripts based on filters
function renderScripts() {
    const container = document.getElementById('scripts-container');
    if (!container) return;
    
    let filteredScripts = scriptsData;
    
    // Filter by category
    if (currentCategory !== 'All') {
        filteredScripts = filteredScripts.filter(script => script.category === currentCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
        filteredScripts = filteredScripts.filter(script => 
            script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            script.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    if (filteredScripts.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <p style="color: var(--text-secondary);">No scripts found 🔍</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredScripts.map(script => `
        <div class="script-card" data-category="${script.category}">
            <div class="script-category">${script.category}</div>
            <div class="script-title">${escapeHtml(script.title)}</div>
            <div class="script-description">${escapeHtml(script.description)}</div>
            <div class="script-actions">
                <button class="btn-install" data-url="${script.installUrl}">Install</button>
                <button class="btn-copy" data-url="${script.scriptUrl}">Copy URL</button>
            </div>
        </div>
    `).join('');
    
    // Attach event listeners to new buttons
    document.querySelectorAll('.btn-install').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const url = btn.getAttribute('data-url');
            if (url) installScript(url);
        });
    });
    
    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const url = btn.getAttribute('data-url');
            if (url) copyToClipboard(url, 'script');
        });
    });
}

// Render Categories
function renderCategories() {
    const categories = ['All', ...new Set(scriptsData.map(script => script.category))];
    const container = document.getElementById('categories-container');
    if (!container) return;
    
    container.innerHTML = categories.map(cat => `
        <button class="category-btn ${currentCategory === cat ? 'active' : ''}" data-category="${cat}">
            ${cat}
        </button>
    `).join('');
    
    // Attach event listeners
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.getAttribute('data-category');
            renderCategories();
            renderScripts();
        });
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderScripts();
        });
    }
}

// Screen Navigation
function navigateToScreen(screenId) {
    // Update screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const targetScreen = document.getElementById(`screen-${screenId}`);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    
    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-screen') === screenId) {
            btn.classList.add('active');
        }
    });
    
    currentScreen = screenId;
    
    // Special actions per screen
    if (screenId === 'library') {
        renderCategories();
        renderScripts();
        setupSearch();
    }
}

// Setup Navigation Buttons
function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const screenId = btn.getAttribute('data-screen');
            if (screenId) navigateToScreen(screenId);
        });
    });
    
    // Get started button
    const getStartedBtn = document.querySelector('.btn-get-started');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            navigateToScreen('library');
        });
    }
}

// Escape HTML to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Initialize App
function init() {
    setupNavigation();
    navigateToScreen('home');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
