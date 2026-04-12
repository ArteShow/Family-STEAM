/**
 * ─────────────────────────────────────────────────────────────────────────
 * Language Selector Modal Component
 * Production-ready language selection modal for Family STEAM
 * Shows only on first visit (no language cookie exists)
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * Usage:
 *   LanguageSelector.init()  → Initialize and show if needed
 *   LanguageSelector.show()  → Show modal
 *   LanguageSelector.hide()  → Hide modal
 */

window.LanguageSelector = {
    /**
     * Initialize the language selector
     * Shows modal if no language preference exists
     */
    init: function () {
        if (typeof window === 'undefined') return; // SSR check

        // Check if language cookie already exists
        if (typeof CookieManager !== 'undefined' && CookieManager.exists('family-steam-lang')) {
            if (window.__DEV__) {
                console.log('[LanguageSelector] Language already set, skipping modal.');
            }
            return;
        }

        // Also check localStorage for legacy preference
        if (localStorage.getItem('preferredLanguage') && 
            ['en', 'de', 'ru'].includes(localStorage.getItem('preferredLanguage').toLowerCase())) {
            if (window.__DEV__) {
                console.log('[LanguageSelector] Language already set in localStorage, skipping modal.');
            }
            return;
        }

        if (window.__DEV__) {
            console.log('[LanguageSelector] No language preference found, showing modal.');
        }

        // Create and show modal
        this._createModal();
        this.show();
    },

    /**
     * Create modal DOM structure
     * @private
     */
    _createModal: function () {
        // Check if modal already exists
        if (document.getElementById('language-selector-modal')) {
            return;
        }

        var modal = document.createElement('div');
        modal.id = 'language-selector-modal';
        modal.className = 'language-selector-modal';

        // Get languages from i18n
        var languages = (window.i18n && window.i18n.getSupportedLanguages) ? 
            window.i18n.getSupportedLanguages() : 
            [
                { code: 'en', name: 'English', flag: '🇬🇧' },
                { code: 'de', name: 'Deutsch', flag: '🇦🇹' },
                { code: 'ru', name: 'Русский', flag: '🇷🇺' }
            ];

        var languageButtonsHTML = languages.map(function (lang) {
            return '<button class="lang-selector-btn" data-lang="' + lang.code + '">' +
                '<span class="lang-flag">' + lang.flag + '</span>' +
                '<span class="lang-name">' + lang.name + '</span>' +
                '</button>';
        }).join('');

        modal.innerHTML = `
            <div class="language-selector-backdrop"></div>
            <div class="language-selector-container">
                <div class="language-selector-content">
                    <h2 id="lang-select-title" data-i18n="lang_select_title">Select Your Language</h2>
                    <p id="lang-select-subtitle" data-i18n="lang_select_subtitle">Please choose your preferred language to continue.</p>
                    
                    <div class="language-selector-buttons">
                        ${languageButtonsHTML}
                    </div>

                    <button id="lang-select-confirm" class="lang-selector-confirm-btn" data-i18n="lang_select_confirm" disabled>
                        Continue
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Wire up event listeners
        this._setupEventListeners();
    },

    /**
     * Setup modal event listeners
     * @private
     */
    _setupEventListeners: function () {
        var self = this;
        var selectedLang = null;

        // Language button clicks
        document.querySelectorAll('.lang-selector-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                // Remove active class from all buttons
                document.querySelectorAll('.lang-selector-btn').forEach(function (b) {
                    b.classList.remove('active');
                });

                // Add active class to clicked button
                this.classList.add('active');
                selectedLang = this.getAttribute('data-lang');

                // Enable confirm button
                var confirmBtn = document.getElementById('lang-select-confirm');
                if (confirmBtn) {
                    confirmBtn.disabled = false;
                }

                if (window.__DEV__) {
                    console.log('[LanguageSelector] Selected language:', selectedLang);
                }
            });
        });

        // Confirm button click
        var confirmBtn = document.getElementById('lang-select-confirm');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function () {
                if (selectedLang) {
                    if (window.__DEV__) {
                        console.log('[LanguageSelector] Confirming language:', selectedLang);
                    }
                    window.i18n.changeLanguage(selectedLang);
                    self.hide();
                }
            });
        }

        // Prevent closing by clicking backdrop (user must select a language)
        // This ensures they see the language selections on first visit
    },

    /**
     * Show the modal
     */
    show: function () {
        var modal = document.getElementById('language-selector-modal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('visible');
            if (window.__DEV__) {
                console.log('[LanguageSelector] Modal shown.');
            }
        }
    },

    /**
     * Hide the modal
     */
    hide: function () {
        var modal = document.getElementById('language-selector-modal');
        if (modal) {
            modal.classList.remove('visible');
            setTimeout(function () {
                modal.style.display = 'none';
            }, 300);
            if (window.__DEV__) {
                console.log('[LanguageSelector] Modal hidden.');
            }
        }
    },

    /**
     * Force show modal (for testing)
     */
    forceShow: function () {
        // Clear language preference to allow modal to show
        if (typeof CookieManager !== 'undefined') {
            CookieManager.remove('family-steam-lang');
        }
        localStorage.removeItem('preferredLanguage');
        this.init();
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        if (window.LanguageSelector) {
            window.LanguageSelector.init();
        }
    });
} else {
    // DOM already loaded
    if (window.LanguageSelector) {
        window.LanguageSelector.init();
    }
}
