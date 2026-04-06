const campSelect = document.getElementById("campSelect");
const campForm = document.getElementById("campRegisterForm");
const CLIENT_CREATE_URL = `${window.location.protocol}//${window.location.hostname}:8000/api/v1/client/create`;

// ── Auth helpers ──────────────────────────────────────────────────────────────
function getAuthInfo() {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('currentUser');
    if (!token || !userId) return null;
    return { token, userId };
}

function initAuthState() {
    const auth = getAuthInfo();
    const loginRequired = document.getElementById('loginRequired');
    const form = document.getElementById('campRegisterForm');
    const accountBanner = document.getElementById('accountBanner');
    const bannerUsername = document.getElementById('bannerUsername');
    const bannerAvatar = document.getElementById('bannerAvatar');

    if (!auth) {
        if (loginRequired) loginRequired.style.display = 'block';
        if (form) form.style.display = 'none';
        return;
    }

    if (accountBanner) accountBanner.style.display = 'flex';
    if (bannerUsername) bannerUsername.textContent = auth.userId;
    const avatarUrl = localStorage.getItem('userAvatarDataURL_' + auth.userId);
    if (bannerAvatar && avatarUrl) {
        bannerAvatar.src = avatarUrl;
        bannerAvatar.style.display = 'block';
    } else if (bannerAvatar) {
        bannerAvatar.style.display = 'none';
    }

    // Pre-fill email if stored
    const emailInput = document.getElementById('email');
    const savedEmail = localStorage.getItem('userEmail_' + auth.userId);
    if (emailInput && savedEmail) emailInput.value = savedEmail;
}

// ── Camp filter ───────────────────────────────────────────────────────────────
function isCampEvent(event) {
    const tag = (event.tag || '').toLowerCase();
    if (tag.includes('camp')) return true;

    const start = new Date(event.starts_at || event.start_date);
    const end = new Date(event.ends_at || event.end_date);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;

    const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return durationDays >= 2;
}

// ── Populate camp dropdown ────────────────────────────────────────────────────
async function populateCampOptions() {
    if (!campSelect) return;

    const urlParams = new URLSearchParams(window.location.search);
    const selectedEventId = urlParams.get('eventId');

    try {
        const allEvents = await window.apiUtils.fetchAllEvents();
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const camps = allEvents
            .filter(event => {
                const startDate = new Date(event.starts_at || event.start_date);
                startDate.setHours(0, 0, 0, 0);
                return startDate >= now && isCampEvent(event);
            })
            .sort((a, b) => new Date(a.starts_at || a.start_date) - new Date(b.starts_at || b.start_date));

        if (camps.length === 0) {
            campSelect.innerHTML = '<option value="" disabled selected>No camps available</option>';
            return;
        }

        campSelect.innerHTML = '<option value="" disabled>Select a camp</option>';

        camps.forEach((camp) => {
            const startDate = new Date(camp.starts_at || camp.start_date);
            const formattedDate = Number.isNaN(startDate.getTime())
                ? ''
                : ` (${startDate.toLocaleDateString()})`;

            const option = document.createElement('option');
            option.value = String(camp.id);
            const campTitle = camp.title_en || camp.title || 'Camp';
            option.textContent = `${campTitle}${formattedDate}`;
            if (selectedEventId && String(camp.id) === String(selectedEventId)) {
                option.selected = true;
            }
            campSelect.appendChild(option);
        });

        if (!selectedEventId) {
            campSelect.selectedIndex = 0;
        }
    } catch (error) {
        console.error('Failed to load camps:', error);
        campSelect.innerHTML = '<option value="" disabled selected>Failed to load camps</option>';
    }
}

populateCampOptions();
initAuthState();

// ── Form submit ───────────────────────────────────────────────────────────────
if (campForm) {
    campForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const auth = getAuthInfo();
        if (!auth) {
            alert('Please sign in to register.');
            return;
        }

        const selectedCampId = campSelect?.value;
        if (!selectedCampId) {
            alert('Please select a camp.');
            return;
        }

        const firstName = document.getElementById('firstName')?.value?.trim() || '';
        const lastName  = document.getElementById('lastName')?.value?.trim()  || '';
        const email     = document.getElementById('email')?.value?.trim()     || '';
        const phone     = document.getElementById('phone')?.value?.trim()     || '';
        const dob       = document.getElementById('dob')?.value               || '';
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'cash';
        const avatar    = localStorage.getItem('userAvatarDataURL_' + auth.userId) || '';

        const clientPayload = {
            calendar_id:    selectedCampId,
            first_name:     firstName,
            last_name:      lastName,
            email,
            phone,
            paid:           false,
            birthday:       dob ? `${dob}T00:00:00Z` : null,
            age:            null,
            user_id:        auth.userId,
            username:       auth.userId,
            avatar,
            payment_method: paymentMethod
        };

        if (paymentMethod === 'card') {
            sessionStorage.setItem('pendingRegistration', JSON.stringify({ type: 'camp', client: clientPayload }));
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
