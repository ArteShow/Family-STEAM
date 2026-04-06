// admin_newsletter.js — Admin newsletter functionality
// Depends on: NEWSLETTER_API_URL and apiRequest() defined in admin.js

/* ---------- Load newsletter data ---------------------------------------- */

async function loadNewsletterData() {
    try {
        const [subRes, campRes] = await Promise.all([
            apiRequest(`${NEWSLETTER_API_URL}/subscribers`, { method: 'GET' }),
            apiRequest(`${NEWSLETTER_API_URL}/campaigns`,   { method: 'GET' })
        ]);

        const subData  = await subRes.json();
        const campData = await campRes.json();

        const count = (subData.subscribers || []).length;

        const countEl = document.getElementById('subscriberCountEl');
        if (countEl) countEl.textContent = count;

        const dashCountEl = document.getElementById('newsletter-count');
        if (dashCountEl) dashCountEl.textContent = count + ' subscribers';

        renderCampaignHistory(campData.campaigns || []);
    } catch (err) {
        console.error('Failed to load newsletter data:', err);
    }
}

/* ---------- Render campaign history ------------------------------------- */

function renderCampaignHistory(campaigns) {
    const container = document.getElementById('campaignHistoryContainer');
    if (!container) return;

    if (campaigns.length === 0) {
        container.innerHTML = '<p class="empty-state">No campaigns sent yet.</p>';
        return;
    }

    container.innerHTML = `
        <table class="history-table">
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Heading</th>
                    <th>Recipients</th>
                    <th>Sent At</th>
                </tr>
            </thead>
            <tbody>
                ${campaigns.map(c => `
                    <tr>
                        <td>${escapeHtml(c.subject)}</td>
                        <td title="${escapeHtml(c.heading)}">${escapeHtml(c.heading.slice(0, 50))}${c.heading.length > 50 ? '…' : ''}</td>
                        <td>${c.recipient_count}</td>
                        <td>${new Date(c.sent_at).toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

/* ---------- Send newsletter --------------------------------------------- */

async function handleSendNewsletter(e) {
    e.preventDefault();

    const subject = document.getElementById('newsletterSubject')?.value.trim();
    const heading = document.getElementById('newsletterHeading')?.value.trim();
    const body    = document.getElementById('newsletterBody')?.value.trim();

    if (!subject || !heading || !body) return;

    const btn = document.getElementById('sendNewsletterBtn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    }

    try {
        const res  = await apiRequest(`${NEWSLETTER_API_URL}/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject, heading, body })
        });
        const data = await res.json();
        alert(`Newsletter sent to ${data.sent_count} subscriber${data.sent_count !== 1 ? 's' : ''}!`);
        document.getElementById('newsletterForm')?.reset();
        await loadNewsletterData();
    } catch (err) {
        alert(err.message || 'Failed to send newsletter.');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send to All Subscribers';
        }
    }
}
