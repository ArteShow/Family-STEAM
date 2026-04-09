const eventForm = document.getElementById('eventRegisterForm');
const eventSelect = document.getElementById('eventSelect');
const CLIENT_CREATE_URL = `${window.location.protocol}//${window.location.hostname}:8000/api/v1/client/create`;

function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

// ── Auth helpers ──────────────────────────────────────────────────────────────
function decodeJwtPayload(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch (_) {
        return null;
    }
}

function getAuthInfo() {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('currentUser');
    if (!token || !username) return null;
    // Decode JWT to get the real user UUID (stored as user_id in claims)
    const payload = decodeJwtPayload(token);
    const userId = payload && payload.user_id ? payload.user_id : username;
    return { token, userId, username };
}

function initAuthState() {
    const auth = getAuthInfo();
    const loginRequired = document.getElementById('loginRequired');
    const form = document.getElementById('eventRegisterForm');
    const accountBanner = document.getElementById('accountBanner');
    const bannerUsername = document.getElementById('bannerUsername');
    const bannerAvatar = document.getElementById('bannerAvatar');

    if (!auth) {
        if (loginRequired) loginRequired.style.display = 'block';
        if (form) form.style.display = 'none';
        return;
    }

    if (accountBanner) accountBanner.style.display = 'flex';
    if (bannerUsername) bannerUsername.textContent = auth.username;
    const avatarUrl = localStorage.getItem('userAvatarDataURL_' + auth.username);
    if (bannerAvatar && avatarUrl) {
        bannerAvatar.src = avatarUrl;
        bannerAvatar.style.display = 'block';
    } else if (bannerAvatar) {
        bannerAvatar.style.display = 'none';
    }

    // Pre-fill email if stored
    const emailInput = document.getElementById('email');
    const savedEmail = localStorage.getItem('userEmail_' + auth.username);
    if (emailInput && savedEmail) emailInput.value = savedEmail;
}

// ── Event filter ──────────────────────────────────────────────────────────────
function isCampEvent(event) {
    const tag = (event.tag || '').toLowerCase();
    if (tag.includes('camp')) return true;

    const start = new Date(event.starts_at || event.start_date);
    const end = new Date(event.ends_at || event.end_date);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;

    const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return durationDays >= 2;
}

// ── Populate event dropdown ───────────────────────────────────────────────────
async function populateEventOptions() {
    if (!eventSelect || !window.apiUtils) return;

    const selectedEventId = getQueryParam('eventId');

    try {
        const allEvents = await window.apiUtils.fetchAllEvents();
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const events = allEvents
            .filter(event => {
                const startDate = new Date(event.starts_at || event.start_date);
                startDate.setHours(0, 0, 0, 0);
                return startDate >= now && !isCampEvent(event);
            })
            .sort((a, b) => new Date(a.starts_at || a.start_date) - new Date(b.starts_at || b.start_date));

        if (events.length === 0) {
            eventSelect.innerHTML = '<option value="" disabled selected>No events available</option>';
            return;
        }

        eventSelect.innerHTML = '<option value="" disabled>Select an event</option>';

        events.forEach((eventItem) => {
            const startDate = new Date(eventItem.starts_at || eventItem.start_date);
            const formattedDate = Number.isNaN(startDate.getTime())
                ? ''
                : ` (${startDate.toLocaleDateString()})`;

            const option = document.createElement('option');
            option.value = String(eventItem.id);
            const eventTitle = eventItem.title_en || eventItem.title || 'Event';
            option.textContent = `${eventTitle}${formattedDate}`;
            if (selectedEventId && String(eventItem.id) === String(selectedEventId)) {
                option.selected = true;
            }
            eventSelect.appendChild(option);
        });

        if (!selectedEventId) {
            eventSelect.selectedIndex = 0;
        }
    } catch (error) {
        console.error('Failed to load events:', error);
        eventSelect.innerHTML = '<option value="" disabled selected>Failed to load events</option>';
    }
}

populateEventOptions();
initAuthState();

// ── Form submit ───────────────────────────────────────────────────────────────
if (eventForm) {
    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const auth = getAuthInfo();
        if (!auth) {
            alert('Please sign in to register.');
            return;
        }

        const eventId = eventSelect?.value || getQueryParam('eventId');
        if (!eventId) {
            alert('Please select an event.');
            return;
        }

        const firstName = document.getElementById('firstName')?.value?.trim() || '';
        const lastName  = document.getElementById('lastName')?.value?.trim()  || '';
        const email     = document.getElementById('email')?.value?.trim()     || '';
        const phone     = document.getElementById('phone')?.value?.trim()     || '';
        const ageValue  = document.getElementById('age')?.value;
        const parsedAge = ageValue ? Number(ageValue) : null;
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'cash';
        const avatar    = localStorage.getItem('userAvatarDataURL_' + auth.username) || '';

        const clientPayload = {
            calendar_id:    eventId,
            first_name:     firstName,
            last_name:      lastName,
            email,
            phone,
            paid:           false,
            birthday:       null,
            age:            Number.isFinite(parsedAge) ? parsedAge : null,
            user_id:        auth.userId,
            username:       auth.username,
            avatar,
            payment_method: paymentMethod
        };

        if (paymentMethod === 'card') {
            sessionStorage.setItem('pendingRegistration', JSON.stringify({ type: 'event', client: clientPayload }));
            window.location.href = 'payment.html';
            return;
        }

        // Cash: submit directly
        try {
            const response = await fetch(CLIENT_CREATE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ client: clientPayload })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Request failed with status ${response.status}`);
            }

            alert('Registration submitted successfully!');
            window.location.href = '../index.html';
        } catch (error) {
            alert(error.message || 'Failed to submit registration. Please try again.');
        }
    });
}
