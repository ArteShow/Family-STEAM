// admin_reviews.js — Reviews management for admin dashboard
// Depends on: app-level API URL constants and apiRequest() from admin.js

const REVIEW_API_BASE_URL = window.APP_API_BASE_URL || `${window.location.origin}/api/v1`;
const REVIEW_CALENDER_API_URL = window.APP_CALENDER_API_URL || `${REVIEW_API_BASE_URL}/calender`;
const REVIEW_ADMIN_API = `${REVIEW_API_BASE_URL}/review`;

let adminReviewSelectedCalendarId = '';
let adminReviewSelectedRating = 0;

/* ─────────────────────────────────────────────────────────────
   Entry point – called by navigateTo('reviews') in admin.js
───────────────────────────────────────────────────────────── */
async function loadReviewsPage() {
    adminReviewSelectedCalendarId = '';
    adminReviewSelectedRating = 0;

    await populateEventSelector();
    initAdminStarInput();

    const select = document.getElementById('reviewsEventSelect');
    if (select) {
        // Remove any stale listener before adding a fresh one
        const fresh = select.cloneNode(true);
        select.parentNode.replaceChild(fresh, select);
        fresh.addEventListener('change', () => {
            adminReviewSelectedCalendarId = fresh.value;
            if (adminReviewSelectedCalendarId) {
                loadReviewsForEvent(adminReviewSelectedCalendarId);
                showComposeBox(true);
            } else {
                document.getElementById('reviewsList').innerHTML =
                    '<p class="empty-state">Choose an event above to see its reviews.</p>';
                showComposeBox(false);
            }
        });
    }
}

/* ─────────────────────────────────────────────────────────────
   Populate <select> with all past calendar entries
───────────────────────────────────────────────────────────── */
async function populateEventSelector() {
    const select = document.getElementById('reviewsEventSelect');
    if (!select) return;
    select.innerHTML = '<option value="">— Choose an event —</option>';

    try {
        const res = await apiRequest(`${REVIEW_CALENDER_API_URL}/getAll`, { method: 'GET' });
        const data = await res.json();
        const entries = data.calender_entries || data.entries || data || [];

        // API fields: starts_at / ends_at (may be null for open-ended entries)
        const now = new Date();
        const past = entries.filter(e => {
            const d = new Date(e.ends_at || e.starts_at || '');
            return !isNaN(d) && d < now;
        });

        // Show ALL entries if none qualify as "past" (e.g. all have null ends_at)
        const list = past.length > 0 ? past : entries;

        list.sort((a, b) => {
            const da = new Date(b.ends_at || b.starts_at || b.created_at || '');
            const db = new Date(a.ends_at || a.starts_at || a.created_at || '');
            return da - db;
        });

        if (list.length === 0) {
            const opt = document.createElement('option');
            opt.disabled = true;
            opt.textContent = 'No events found';
            select.appendChild(opt);
            return;
        }

        list.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e.id;
            const title = e.title_en || e.title || e.name || e.id;
            const rawDate = e.ends_at || e.starts_at || '';
            const dateStr = rawDate ? ` (${new Date(rawDate).toLocaleDateString()})` : '';
            opt.textContent = `${title}${dateStr}`;
            select.appendChild(opt);
        });
    } catch (err) {
        console.error('Failed to load events for review selector:', err);
        showDashboardMessage('Could not load events list.', 'error');
    }
}

/* ─────────────────────────────────────────────────────────────
   Load and render reviews for the selected event
───────────────────────────────────────────────────────────── */
async function loadReviewsForEvent(calendarId) {
    const container = document.getElementById('reviewsList');
    if (!container) return;
    container.innerHTML = '<p class="empty-state">Loading…</p>';

    try {
        const res = await fetch(`${REVIEW_ADMIN_API}/getByCalendar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ calendar_id: calendarId, limit: 100, offset: 0 })
        });

        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        renderAdminReviewsList(data.reviews || []);
    } catch (err) {
        console.error('Failed to load reviews:', err);
        container.innerHTML = '<p class="empty-state">Failed to load reviews.</p>';
    }
}

/* ─────────────────────────────────────────────────────────────
   Render reviews table
───────────────────────────────────────────────────────────── */
function renderAdminReviewsList(reviews) {
    const container = document.getElementById('reviewsList');
    if (!container) return;

    if (reviews.length === 0) {
        container.innerHTML = '<p class="empty-state">No reviews for this event yet.</p>';
        return;
    }

    const rows = reviews.map(r => {
        const avatarHtml = buildAdminAvatarHtml(r.username, r.avatar_url);
        const stars = buildAdminStarsHtml(r.rating);
        const date = r.created_at ? new Date(r.created_at).toLocaleDateString() : '—';
        const isAdmin = r.user_id && r.user_id.startsWith('admin:');
        const badge = isAdmin
            ? '<span class="reviews-admin-badge">Admin</span>'
            : '';

        return `
            <div class="reviews-admin-card" data-review-id="${escapeAttr(r.id)}">
                <div class="reviews-admin-card-top">
                    ${avatarHtml}
                    <div class="reviews-admin-meta">
                        <strong>${escapeHtml(r.username)}</strong>
                        ${badge}
                        <span class="reviews-admin-date">${date}</span>
                    </div>
                    <div class="reviews-admin-stars">${stars}</div>
                    <button class="reviews-admin-delete" onclick="confirmDeleteReview('${escapeAttr(r.id)}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
                <p class="reviews-admin-text">${escapeHtml(r.review_text)}</p>
            </div>`;
    }).join('');

    container.innerHTML = `<div class="reviews-admin-grid">${rows}</div>`;
}

/* ─────────────────────────────────────────────────────────────
   Delete a review
───────────────────────────────────────────────────────────── */
function confirmDeleteReview(reviewId) {
    if (!confirm('Delete this review? This cannot be undone.')) return;
    deleteReview(reviewId);
}

async function deleteReview(reviewId) {
    try {
        await apiRequest(`${REVIEW_ADMIN_API}/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ review_id: reviewId })
        });

        showDashboardMessage('Review deleted.', 'success');

        // Remove the card from DOM without a full reload
        const card = document.querySelector(`[data-review-id="${CSS.escape(reviewId)}"]`);
        if (card) card.remove();

        // If list is now empty, show empty state
        const grid = document.querySelector('.reviews-admin-grid');
        if (grid && grid.children.length === 0) {
            document.getElementById('reviewsList').innerHTML =
                '<p class="empty-state">No reviews for this event yet.</p>';
        }
    } catch (err) {
        console.error('Failed to delete review:', err);
        showDashboardMessage('Could not delete review: ' + err.message, 'error');
    }
}

/* ─────────────────────────────────────────────────────────────
   Admin create-review form
───────────────────────────────────────────────────────────── */
function showComposeBox(visible) {
    const box = document.getElementById('reviewsComposeBox');
    if (box) box.style.display = visible ? 'block' : 'none';
}

function initAdminStarInput() {
    const wrap = document.getElementById('adminReviewStars');
    if (!wrap) return;
    wrap.innerHTML = '';
    adminReviewSelectedRating = 0;

    for (let i = 1; i <= 5; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('aria-label', `${i} star${i > 1 ? 's' : ''}`);
        btn.innerHTML = '<i class="fa-regular fa-star"></i>';
        btn.dataset.val = String(i);

        btn.addEventListener('mouseenter', () => highlightAdminStars(wrap, i));
        btn.addEventListener('mouseleave', () => highlightAdminStars(wrap, adminReviewSelectedRating));
        btn.addEventListener('click', () => {
            adminReviewSelectedRating = i;
            highlightAdminStars(wrap, adminReviewSelectedRating);
        });

        wrap.appendChild(btn);
    }
}

function highlightAdminStars(wrap, count) {
    wrap.querySelectorAll('button').forEach((btn, idx) => {
        const filled = idx < count;
        btn.classList.toggle('filled', filled);
        btn.innerHTML = filled
            ? '<i class="fa-solid fa-star"></i>'
            : '<i class="fa-regular fa-star"></i>';
    });
}

async function handleAdminReviewSubmit(event) {
    event.preventDefault();

    const feedback = document.getElementById('adminReviewFeedback');
    const submitBtn = document.getElementById('adminReviewSubmitBtn');
    feedback.textContent = '';
    feedback.className = 'review_form_feedback';

    const displayName = document.getElementById('adminReviewUsername').value.trim();
    const reviewText  = document.getElementById('adminReviewText').value.trim();

    if (!adminReviewSelectedCalendarId) {
        feedback.className = 'review_form_feedback error';
        feedback.textContent = 'Please select an event first.';
        return;
    }

    if (!displayName) {
        feedback.className = 'review_form_feedback error';
        feedback.textContent = 'Display name is required.';
        return;
    }

    if (adminReviewSelectedRating === 0) {
        feedback.className = 'review_form_feedback error';
        feedback.textContent = 'Please select a star rating.';
        return;
    }

    if (!reviewText) {
        feedback.className = 'review_form_feedback error';
        feedback.textContent = 'Review text is required.';
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting…';

    try {
        await apiRequest(`${REVIEW_ADMIN_API}/adminCreate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                calendar_id:      adminReviewSelectedCalendarId,
                display_username: displayName,
                rating:           adminReviewSelectedRating,
                review_text:      reviewText
            })
        });

        feedback.className = 'review_form_feedback success';
        feedback.textContent = 'Review added successfully!';

        // Reset form
        document.getElementById('adminReviewUsername').value = '';
        document.getElementById('adminReviewText').value = '';
        adminReviewSelectedRating = 0;
        initAdminStarInput();

        // Reload list
        await loadReviewsForEvent(adminReviewSelectedCalendarId);
    } catch (err) {
        console.error('Admin review submit error:', err);
        feedback.className = 'review_form_feedback error';
        feedback.textContent = 'Failed to submit review: ' + err.message;
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Review';
    }
}

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */
function buildAdminAvatarHtml(username, avatarUrl) {
    if (avatarUrl) {
        return `<img class="reviews-admin-avatar" src="${escapeAttr(avatarUrl)}" alt="">`;
    }
    const letter = (username || '?').charAt(0).toUpperCase();
    const color  = letterColor(letter);
    return `<div class="reviews-admin-avatar reviews-admin-avatar-letter" style="background:${color};">${letter}</div>`;
}

function buildAdminStarsHtml(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += i <= rating
            ? '<i class="fa-solid fa-star" style="color:#f59e0b;"></i>'
            : '<i class="fa-regular fa-star" style="color:#d1d5db;"></i>';
    }
    return html;
}

const LETTER_COLORS = [
    '#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6',
    '#8b5cf6','#ef4444','#06b6d4','#84cc16','#f97316'
];

function letterColor(letter) {
    const idx = (letter.toUpperCase().charCodeAt(0) - 65 + LETTER_COLORS.length) % LETTER_COLORS.length;
    return LETTER_COLORS[Math.max(0, idx)];
}

function escapeAttr(str) {
    return String(str || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
