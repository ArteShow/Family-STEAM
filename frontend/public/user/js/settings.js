// --- Auth guard ---
(function () {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.replace('/user/auth.html');
    }
})();

// --- Translations ---
const translations = {
    en: {
        profileTitle: 'Profile',
        langTitle: 'Language',
        waTitle: 'WhatsApp Support',
        waLabel: 'Show WhatsApp contact button',
        waDesc: 'A floating button that lets visitors reach us via WhatsApp.',
        logout: 'Log Out'
    },
    de: {
        profileTitle: 'Profil',
        langTitle: 'Sprache',
        waTitle: 'WhatsApp-Support',
        waLabel: 'WhatsApp-Kontaktschaltfläche anzeigen',
        waDesc: 'Eine schwebende Schaltfläche, um uns per WhatsApp zu erreichen.',
        logout: 'Abmelden'
    },
    ru: {
        profileTitle: 'Профиль',
        langTitle: 'Язык',
        waTitle: 'Поддержка WhatsApp',
        waLabel: 'Показать кнопку WhatsApp',
        waDesc: 'Плавающая кнопка для связи с нами через WhatsApp.',
        logout: 'Выйти'
    }
};

function applyTranslations(lang) {
    const t = translations[lang] || translations.en;

    const profileTitle = document.getElementById('card-title-profile');
    const langTitle = document.getElementById('card-title-lang');
    const waTitle = document.getElementById('card-title-wa');
    const waLabel = document.getElementById('wa-label');
    const waDesc = document.getElementById('wa-desc');
    const logoutBtn = document.getElementById('logout-btn');

    if (profileTitle) profileTitle.childNodes[1].nodeValue = ' ' + t.profileTitle;
    if (langTitle) langTitle.childNodes[1].nodeValue = ' ' + t.langTitle;
    if (waTitle) waTitle.childNodes[1].nodeValue = ' ' + t.waTitle;
    if (waLabel) waLabel.textContent = t.waLabel;
    if (waDesc) waDesc.textContent = t.waDesc;
    if (logoutBtn) logoutBtn.childNodes[logoutBtn.childNodes.length - 1].nodeValue = ' ' + t.logout;

    if (window.i18n) window.i18n.apply(lang);
}

// --- Avatar ---
function getAvatarKey() {
    const user = localStorage.getItem('currentUser') || 'guest';
    return 'userAvatarDataURL_' + user;
}

function handleAvatarUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        showMsg('Please select an image file.', 'error');
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        showMsg('Image must be smaller than 2 MB.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const dataUrl = e.target.result;
        localStorage.setItem(getAvatarKey(), dataUrl);
        const preview = document.getElementById('avatarPreview');
        if (preview) preview.src = dataUrl;
        showMsg('Profile picture updated.', 'success');
    };
    reader.readAsDataURL(file);
}

// --- Language ---
function setLanguage(lang) {
    localStorage.setItem('preferredLanguage', lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    applyTranslations(lang);
    showMsg('Language saved.', 'success');
}

// --- WhatsApp toggle ---
function handleWaToggle(checked) {
    localStorage.setItem('whatsappEnabled', checked ? 'true' : 'false');

    // Update the floating FAB if present in the current DOM
    const fab = document.getElementById('whatsapp-fab');
    if (fab) fab.style.display = checked ? 'flex' : 'none';
}

// --- Logout ---
function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.replace('/index.html');
}

// --- Message helper ---
let msgTimer = null;
function showMsg(text, type) {
    const el = document.getElementById('settingsMsg');
    if (!el) return;
    el.textContent = text;
    el.className = 'settings-msg ' + type;
    el.style.display = 'block';
    clearTimeout(msgTimer);
    msgTimer = setTimeout(() => { el.style.display = 'none'; }, 3000);
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    // Set username
    const username = localStorage.getItem('currentUser') || '';
    const usernameEl = document.getElementById('profileUsername');
    if (usernameEl) usernameEl.textContent = username;

    // Set avatar
    const avatarData = localStorage.getItem(getAvatarKey());
    const avatarPreview = document.getElementById('avatarPreview');
    if (avatarPreview && avatarData) avatarPreview.src = avatarData;

    // Wire avatar input
    const avatarInput = document.getElementById('avatarInput');
    if (avatarInput) avatarInput.addEventListener('change', handleAvatarUpload);

    // Set language
    const lang = localStorage.getItem('preferredLanguage') || 'en';
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
    applyTranslations(lang);

    // Set WhatsApp toggle
    const waToggle = document.getElementById('waToggle');
    const waEnabled = localStorage.getItem('whatsappEnabled');
    if (waToggle) {
        waToggle.checked = waEnabled !== 'false';
        waToggle.addEventListener('change', () => handleWaToggle(waToggle.checked));
    }

    // Wire logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
});
