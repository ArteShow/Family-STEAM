(async function () {
    'use strict';

    const root = document.getElementById('archiveRoot');
    if (!root) return;

    // ── i18n helper ──────────────────────────────────────────────────────────
    function t(key, fallback) {
        return (window.i18n ? window.i18n.t(key) : null) || fallback;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    function formatDisplayDate(isoString) {
        if (!isoString) return '';
        const d = new Date(isoString);
        if (isNaN(d)) return '';
        return d.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function buildDateLabel(startDate, endDate) {
        const startFmt = formatDisplayDate(startDate);
        const endFmt   = endDate ? formatDisplayDate(endDate) : '';
        if (!endFmt || endFmt === startFmt) return startFmt;
        return `${startFmt} \u2013 ${endFmt}`;
    }

    // ── Fetch archived (past) events ──────────────────────────────────────────

    async function getArchivedEvents() {
        const all = await window.apiUtils.fetchAllEvents();
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return all.filter(ev => {
            // An event is "past" when its end (or start, for single-day events) < today
            const endMark = ev.ends_at
                ? new Date(ev.ends_at)
                : new Date(ev.starts_at || ev.start_date);
            endMark.setHours(0, 0, 0, 0);
            return endMark < now;
        });
    }

    // ── Carousel builder (mirrors camps.js pattern exactly) ──────────────────

    function buildCarousel(images, altText) {
        const displayImages = (images && images.length > 0)
            ? images
            : ['../images/slider1.webp'];

        const container = document.createElement('div');
        container.className = 'archive_carousel';
        if (displayImages.length === 1) container.dataset.single = 'true';

        const track = document.createElement('div');
        track.className = 'archive_carousel_track';

        displayImages.forEach(src => {
            const slide = document.createElement('div');
            slide.className = 'archive_carousel_slide';
            const img = document.createElement('img');
            img.src    = src;
            img.alt    = altText;
            img.loading = 'lazy';
            img.onerror = function () { this.src = '../images/slider1.webp'; };
            slide.appendChild(img);
            track.appendChild(slide);
        });

        const leftBtn  = document.createElement('button');
        leftBtn.className  = 'archive_carousel_btn left';
        leftBtn.setAttribute('aria-label', 'Previous');
        leftBtn.innerHTML  = '&#10094;';

        const rightBtn = document.createElement('button');
        rightBtn.className = 'archive_carousel_btn right';
        rightBtn.setAttribute('aria-label', 'Next');
        rightBtn.innerHTML = '&#10095;';

        container.appendChild(leftBtn);
        container.appendChild(track);
        container.appendChild(rightBtn);

        // Carousel state
        let cur = 0;
        const count = displayImages.length;

        function show(idx) {
            cur = (idx + count) % count;
            track.style.transform = `translateX(-${cur * 100}%)`;
        }

        leftBtn.addEventListener('click',  () => show(cur - 1));
        rightBtn.addEventListener('click', () => show(cur + 1));

        // Touch swipe
        let startX = 0, deltaX = 0, dragging = false;
        container.addEventListener('touchstart', e => {
            startX   = e.touches[0].clientX;
            deltaX   = 0;
            dragging = true;
            track.style.transition = 'none';
        }, { passive: true });
        container.addEventListener('touchmove', e => {
            if (!dragging) return;
            deltaX = e.touches[0].clientX - startX;
            track.style.transform = `translateX(calc(-${cur * 100}% + ${deltaX}px))`;
        }, { passive: true });
        container.addEventListener('touchend', () => {
            dragging = false;
            track.style.transition = 'transform 420ms cubic-bezier(.22,.9,.3,1)';
            if (Math.abs(deltaX) > 50) show(deltaX < 0 ? cur + 1 : cur - 1);
            else show(cur);
        });

        return container;
    }

    // ── Render a single archive card ──────────────────────────────────────────

    function renderCard(item, delay) {
        const card = document.createElement('article');
        card.className = 'archive_card';
        card.style.animationDelay = `${delay}ms`;

        // Carousel + badge wrapper
        const carouselWrap = document.createElement('div');
        carouselWrap.style.position = 'relative';

        const carousel = buildCarousel(item.images, item.title);
        carouselWrap.appendChild(carousel);

        const badge = document.createElement('span');
        badge.className = `archive_type_badge ${item.type === 'camp' ? 'badge_camp' : 'badge_event'}`;
        badge.textContent = item.type === 'camp'
            ? t('archive_badge_camp', 'Camp')
            : t('archive_badge_event', 'Event');
        carouselWrap.appendChild(badge);

        card.appendChild(carouselWrap);

        // Body
        const body = document.createElement('div');
        body.className = 'archive_card_body';

        const title = document.createElement('h4');
        title.className   = 'archive_card_title';
        title.textContent = item.title;
        body.appendChild(title);

        const dateLine = document.createElement('p');
        dateLine.className = 'archive_card_date';
        dateLine.innerHTML = `<i class="fa-regular fa-calendar"></i> ${buildDateLabel(item.startDate, item.endDate)}`;
        body.appendChild(dateLine);

        const desc = document.createElement('p');
        desc.className   = 'archive_card_desc';
        desc.textContent = item.shortDesc || item.description || '';
        body.appendChild(desc);

        card.appendChild(body);

        // Actions
        const actions = document.createElement('div');
        actions.className = 'archive_card_actions';

        const calLink = document.createElement('a');
        calLink.className = 'archive_view_cal_btn';
        calLink.href      = `calender.html?date=${encodeURIComponent(item.startDate)}`;
        calLink.textContent = t('camps_view_cal', 'View on Calendar');
        actions.appendChild(calLink);

        // Reviews toggle button
        const reviewsBtn = document.createElement('button');
        reviewsBtn.className = 'archive_reviews_btn';
        reviewsBtn.innerHTML = `<i class="fa-regular fa-star"></i> <span class="rev_btn_label">${t('review_btn', 'Reviews')}</span>`;
        reviewsBtn.addEventListener('click', () => openReviewModal(item.id, item.title));
        actions.appendChild(reviewsBtn);

        card.appendChild(actions);

        return card;
    }

    // ── Filter and render the grid ────────────────────────────────────────────

    let allArchiveData = [];

    function renderCards(filter) {
        root.innerHTML = '';

        const toRender = filter === 'all'
            ? allArchiveData
            : allArchiveData.filter(item => item.type === filter);

        if (toRender.length === 0) {
            const msg = document.createElement('p');
            msg.className   = 'archive_msg';
            msg.textContent = t('archive_no_filter', 'No archived items found for this filter.');
            root.appendChild(msg);
            return;
        }

        toRender.forEach((item, idx) => {
            root.appendChild(renderCard(item, idx * 70));
        });
    }

    // ── Filter button listeners ───────────────────────────────────────────────

    document.querySelectorAll('.filter_btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter_btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCards(btn.dataset.filter || 'all');
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    //  REVIEW SYSTEM
    // ─────────────────────────────────────────────────────────────────────────

    const REVIEW_API = (typeof API_BASE_URL !== 'undefined')
        ? `${API_BASE_URL}/review`
        : `${window.location.origin}/api/v1/review`;

    // Modal state
    let modalCalendarId = '';
    let modalOffset     = 0;
    const MODAL_PAGE    = 20;

    const modal         = document.getElementById('reviewModal');
    const modalTitle    = document.getElementById('reviewModalTitle');
    const reviewList    = document.getElementById('reviewList');
    const reviewFormArea = document.getElementById('reviewFormArea');
    const loadMoreWrap  = document.getElementById('reviewLoadMoreWrap');
    const loadMoreBtn   = document.getElementById('reviewLoadMoreBtn');
    const modalClose    = document.getElementById('reviewModalClose');

    if (!modal) return; // guard if HTML missing

    function openReviewModal(calendarId, eventTitle) {
        modalCalendarId = calendarId;
        modalOffset     = 0;
        if (modalTitle) {
            modalTitle.textContent = eventTitle
                ? `${t('review_btn', 'Reviews')} — ${eventTitle}`
                : t('review_btn', 'Reviews');
        }
        if (reviewList)    reviewList.innerHTML = '';
        if (reviewFormArea) reviewFormArea.innerHTML = '';
        if (loadMoreWrap)  loadMoreWrap.style.display = 'none';

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        loadReviews(true);
        buildFormArea();
    }

    function closeReviewModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        modalCalendarId = '';
    }

    // Close on backdrop click
    modal.addEventListener('click', e => {
        if (e.target === modal) closeReviewModal();
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeReviewModal();
    });

    if (modalClose) modalClose.addEventListener('click', closeReviewModal);
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', () => loadReviews(false));

    // ── Load and render reviews ───────────────────────────────────────────────

    async function loadReviews(reset) {
        if (reset) modalOffset = 0;

        if (reset && reviewList) {
            reviewList.innerHTML = `<p class="review_list_msg">${t('archive_loading', 'Loading\u2026')}</p>`;
        }

        try {
            const token = localStorage.getItem('authToken');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${REVIEW_API}/getByCalendar`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    calendar_id: modalCalendarId,
                    limit: MODAL_PAGE,
                    offset: modalOffset
                })
            });

            if (!res.ok) throw new Error(res.statusText);
            const data = await res.json();

            if (reset && reviewList) reviewList.innerHTML = '';

            const reviews = data.reviews || [];
            const total   = data.total   || 0;

            if (reset && reviews.length === 0) {
                const msg = document.createElement('p');
                msg.className   = 'review_list_msg';
                msg.textContent = t('review_empty', 'No reviews yet. Be the first!');
                reviewList.appendChild(msg);
            } else {
                reviews.forEach(r => reviewList.appendChild(buildReviewCard(r)));
                modalOffset += reviews.length;
            }

            // Show / hide load-more
            if (loadMoreWrap) {
                loadMoreWrap.style.display = (modalOffset < total) ? 'block' : 'none';
            }

        } catch (err) {
            console.error('Review load error:', err);
            if (reviewList) {
                reviewList.innerHTML = `<p class="review_list_msg error">${t('review_load_error', 'Could not load reviews.')}</p>`;
            }
        }
    }

    // ── Build a single review card ────────────────────────────────────────────

    function buildReviewCard(rev) {
        const card = document.createElement('div');
        card.className = 'review_card';

        // Avatar
        if (rev.avatar_url) {
            const img = document.createElement('img');
            img.className = 'review_avatar';
            img.src   = rev.avatar_url;
            img.alt   = rev.username;
            img.onerror = function () { this.replaceWith(buildAvatarPlaceholder(rev.username)); };
            card.appendChild(img);
        } else {
            card.appendChild(buildAvatarPlaceholder(rev.username));
        }

        const body = document.createElement('div');
        body.className = 'review_card_body';

        // Top row: username + date
        const top = document.createElement('div');
        top.className = 'review_card_top';

        const uname = document.createElement('span');
        uname.className   = 'review_card_username';
        uname.textContent = rev.username || 'User';
        top.appendChild(uname);

        const dateStr = document.createElement('span');
        dateStr.className   = 'review_card_date';
        dateStr.textContent = rev.created_at ? formatDisplayDate(rev.created_at) : '';
        top.appendChild(dateStr);

        body.appendChild(top);

        // Stars
        body.appendChild(buildStarDisplay(rev.rating || 0));

        // Text
        const text = document.createElement('p');
        text.className   = 'review_card_text';
        text.textContent = rev.review_text || '';
        body.appendChild(text);

        card.appendChild(body);
        return card;
    }

    function buildAvatarPlaceholder(username) {
        const el = document.createElement('div');
        el.className   = 'review_avatar_placeholder';
        el.textContent = (username || '?')[0].toUpperCase();
        return el;
    }

    function buildStarDisplay(rating) {
        const wrap = document.createElement('div');
        wrap.className = 'review_stars_display';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = i <= rating ? 'fa-solid fa-star' : 'fa-regular fa-star empty';
            wrap.appendChild(star);
        }
        return wrap;
    }

    // ── Build form area (login notice / eligibility / write form) ─────────────

    async function buildFormArea() {
        if (!reviewFormArea) return;
        reviewFormArea.innerHTML = '';

        const token = localStorage.getItem('authToken');
        // currentUser is stored as a plain string (username), not JSON
        const currentUser = localStorage.getItem('currentUser') || null;

        if (!token || !currentUser) {
            // Not logged in
            const notice = document.createElement('p');
            notice.className = 'review_form_notice';
            notice.innerHTML = `${t('review_login_required', 'Please sign in to leave a review.')} <a href="../../user/auth.html">${t('nav_signin', 'Sign In')}</a>`;
            reviewFormArea.appendChild(notice);
            return;
        }

        // Show checking state
        const checking = document.createElement('p');
        checking.className   = 'review_form_notice';
        checking.textContent = t('review_checking', 'Checking eligibility\u2026');
        reviewFormArea.appendChild(checking);

        try {
            const eligRes = await fetch(`${REVIEW_API}/checkEligible`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ calendar_id: modalCalendarId })
            });

            reviewFormArea.innerHTML = '';

            if (!eligRes.ok) {
                const notice = document.createElement('p');
                notice.className   = 'review_form_notice';
                notice.textContent = t('review_load_error', 'Could not verify eligibility. Please try again later.');
                reviewFormArea.appendChild(notice);
                return;
            }

            const eligData = await eligRes.json();

            if (eligData.already_reviewed) {
                const notice = document.createElement('p');
                notice.className   = 'review_form_notice';
                notice.textContent = t('review_already', 'You have already reviewed this event.');
                reviewFormArea.appendChild(notice);
                return;
            }

            if (!eligData.eligible) {
                const notice = document.createElement('p');
                notice.className   = 'review_form_notice';
                notice.textContent = t('review_not_eligible', 'Only participants can leave a review.');
                reviewFormArea.appendChild(notice);
                return;
            }

            // User is eligible — show the write form
            renderWriteForm(token, currentUser);

        } catch (err) {
            console.error('Eligibility check error:', err);
            reviewFormArea.innerHTML = '';
        }
    }

    // ── Render write form ─────────────────────────────────────────────────────

    function renderWriteForm(token, currentUser) {
        if (!reviewFormArea) return;

        const title = document.createElement('p');
        title.className   = 'review_write_title';
        title.textContent = t('review_write_title', 'Write a Review');
        reviewFormArea.appendChild(title);

        // Star input
        let selectedRating = 0;
        const starWrap = document.createElement('div');
        starWrap.className = 'review_star_input';

        for (let i = 1; i <= 5; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.setAttribute('aria-label', `${i} star${i > 1 ? 's' : ''}`);
            btn.innerHTML = '<i class="fa-regular fa-star"></i>';
            btn.dataset.val = String(i);

            btn.addEventListener('mouseenter', () => highlightStars(starWrap, i));
            btn.addEventListener('mouseleave', () => highlightStars(starWrap, selectedRating));
            btn.addEventListener('click', () => {
                selectedRating = i;
                highlightStars(starWrap, selectedRating);
            });

            starWrap.appendChild(btn);
        }
        reviewFormArea.appendChild(starWrap);

        // Textarea
        const textarea = document.createElement('textarea');
        textarea.className   = 'review_textarea';
        textarea.placeholder = t('review_placeholder', 'Share your experience\u2026');
        textarea.maxLength   = 1000;
        reviewFormArea.appendChild(textarea);

        // Submit button
        const submitBtn = document.createElement('button');
        submitBtn.type        = 'button';
        submitBtn.className   = 'review_submit_btn';
        submitBtn.textContent = t('review_submit', 'Submit Review');

        // Feedback area
        const feedback = document.createElement('p');
        feedback.className = 'review_form_feedback';

        submitBtn.addEventListener('click', async () => {
            feedback.className   = 'review_form_feedback';
            feedback.textContent = '';

            if (selectedRating === 0) {
                feedback.className   = 'review_form_feedback error';
                feedback.textContent = t('review_rating_label', 'Please select a star rating.');
                return;
            }
            const text = textarea.value.trim();
            if (!text) {
                feedback.className   = 'review_form_feedback error';
                feedback.textContent = t('review_text_required', 'Please write something before submitting.');
                return;
            }

            submitBtn.disabled    = true;
            submitBtn.textContent = t('review_submitting', 'Submitting\u2026');

            try {
                const avatarURL = '';  // currentUser is a username string; avatar not stored locally
                const res = await fetch(`${REVIEW_API}/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        calendar_id: modalCalendarId,
                        avatar_url:  avatarURL,
                        rating:      selectedRating,
                        review_text: text
                    })
                });

                if (res.status === 409) {
                    feedback.className   = 'review_form_feedback error';
                    feedback.textContent = t('review_already', 'You have already reviewed this event.');
                    submitBtn.disabled    = false;
                    submitBtn.textContent = t('review_submit', 'Submit Review');
                    return;
                }

                if (res.status === 403) {
                    feedback.className   = 'review_form_feedback error';
                    feedback.textContent = t('review_not_eligible', 'Only participants can leave a review.');
                    submitBtn.disabled    = false;
                    submitBtn.textContent = t('review_submit', 'Submit Review');
                    return;
                }

                if (!res.ok) throw new Error(await res.text());

                feedback.className   = 'review_form_feedback success';
                feedback.textContent = t('review_submitted', 'Review submitted!');

                // Remove form area, reload reviews
                reviewFormArea.innerHTML = '';
                reviewFormArea.appendChild(feedback);
                // Re-display "already reviewed" notice
                const notice = document.createElement('p');
                notice.className   = 'review_form_notice';
                notice.textContent = t('review_already', 'You have already reviewed this event.');
                reviewFormArea.appendChild(notice);

                loadReviews(true);

            } catch (err) {
                console.error('Review submit error:', err);
                feedback.className   = 'review_form_feedback error';
                feedback.textContent = t('review_load_error', 'Could not submit review. Please try again.');
                submitBtn.disabled    = false;
                submitBtn.textContent = t('review_submit', 'Submit Review');
            }
        });

        reviewFormArea.appendChild(submitBtn);
        reviewFormArea.appendChild(feedback);
    }

    function highlightStars(starWrap, count) {
        starWrap.querySelectorAll('button').forEach((btn, idx) => {
            const filled = idx < count;
            btn.classList.toggle('filled', filled);
            btn.innerHTML = filled
                ? '<i class="fa-solid fa-star"></i>'
                : '<i class="fa-regular fa-star"></i>';
        });
    }

    // ── Main load ─────────────────────────────────────────────────────────────

    // Show loading message
    const loadingMsg = document.createElement('p');
    loadingMsg.className   = 'archive_msg';
    loadingMsg.textContent = t('archive_loading', 'Loading archive\u2026');
    root.appendChild(loadingMsg);

    try {
        const pastRaw = await getArchivedEvents();

        if (pastRaw.length === 0) {
            root.innerHTML = '';
            const empty = document.createElement('p');
            empty.className   = 'archive_msg';
            empty.textContent = t('archive_empty', 'No past events or camps yet.');
            root.appendChild(empty);
            return;
        }

        // Format all past events in parallel
        const formatted = await Promise.all(
            pastRaw.map(e => window.apiUtils.formatEventFromBackend(e))
        );

        allArchiveData = formatted
            .filter(Boolean)
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate)); // newest first

        root.innerHTML = '';
        renderCards('all');

    } catch (err) {
        console.error('Archive load error:', err);
        root.innerHTML = '';
        const errMsg = document.createElement('p');
        errMsg.className   = 'archive_msg error';
        errMsg.textContent = t('archive_load_error', 'Failed to load archive. Please refresh.');
        root.appendChild(errMsg);
    }
})();
