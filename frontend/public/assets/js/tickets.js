const TICKET_API_URL = (() => {
    const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
    const base = isLocalHost
        ? 'http://localhost:8000/api/v1'
        : `${window.location.origin}/api/v1`;
    return `${base}/ticket`;
})();

function getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    if (!token) return {};
    return { 'Authorization': `Bearer ${token}` };
}

function isLoggedIn() {
    return !!localStorage.getItem('authToken');
}

function getCurrentUser() {
    return localStorage.getItem('currentUser') || '';
}

// ─── Tab switching ────────────────────────────────────────────────────────────

function switchTab(tab) {
    document.querySelectorAll('.tab_btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab_section').forEach(s => s.classList.remove('active'));
    document.getElementById(`tab_${tab}`).classList.add('active');
    document.getElementById(`section_${tab}`).classList.add('active');

    if (tab === 'my') loadMyTickets();
}

// ─── Message helper ───────────────────────────────────────────────────────────

function showMsg(elId, text, type) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = text;
    el.className = `form_message ${type}`;
    el.style.display = 'block';
}

function hideMsg(elId) {
    const el = document.getElementById(elId);
    if (el) el.style.display = 'none';
}

// ─── Build Create-ticket section ─────────────────────────────────────────────

function renderCreateSection() {
    const wrap = document.getElementById('createFormWrap');
    if (!wrap) return;

    if (!isLoggedIn()) {
        wrap.innerHTML = `
            <h4>Submit a Support Ticket</h4>
            <p class="form_subtitle">You need to be signed in to create a support ticket.</p>
            <a href="/user/auth.html" class="submit_btn" style="display:inline-flex;align-items:center;gap:.5rem;text-decoration:none;">
                <i class="fas fa-sign-in-alt"></i> Sign In / Register
            </a>
        `;
        return;
    }

    wrap.innerHTML = `
        <h4>Submit a Support Ticket</h4>
        <p class="form_subtitle">Signed in as <strong>${escapeHtml(getCurrentUser())}</strong>. Tell us how we can help.</p>

        <form class="ticket_form" id="ticketForm">
            <div class="form_group">
                <input type="text" id="ticketSubject" placeholder="Subject" required>
            </div>
            <div class="form_group">
                <textarea id="ticketMessage" placeholder="Describe your issue…" rows="6" required></textarea>
            </div>
            <div class="form_group">
                <input type="email" id="ticketEmail" placeholder="Contact email (optional)">
            </div>
            <div id="createMsg" class="form_message" style="display:none;"></div>
            <button type="submit" class="submit_btn">
                <i class="fas fa-paper-plane"></i> Submit Ticket
            </button>
        </form>
    `;

    document.getElementById('ticketForm').addEventListener('submit', handleCreateTicket);
}

// ─── Create Ticket ────────────────────────────────────────────────────────────

async function handleCreateTicket(e) {
    e.preventDefault();
    hideMsg('createMsg');

    const subject = document.getElementById('ticketSubject').value.trim();
    const message = document.getElementById('ticketMessage').value.trim();
    const email   = (document.getElementById('ticketEmail')?.value || '').trim();

    if (!subject || !message) {
        showMsg('createMsg', 'Subject and message are required.', 'error');
        return;
    }

    const btn = document.querySelector('#ticketForm .submit_btn');
    if (btn) btn.disabled = true;

    try {
        const res = await fetch(`${TICKET_API_URL}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ subject, message, email })
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `Error ${res.status}`);
        }

        showMsg('createMsg', 'Your ticket has been submitted! We will get back to you soon.', 'success');
        document.getElementById('ticketForm').reset();
    } catch (err) {
        showMsg('createMsg', err.message || 'Failed to submit ticket. Please try again.', 'error');
    } finally {
        if (btn) btn.disabled = false;
    }
}

// ─── My Tickets ──────────────────────────────────────────────────────────────

function renderMyTicketsHeader() {
    const header = document.getElementById('myTicketsHeader');
    if (!header) return;

    if (!isLoggedIn()) {
        header.innerHTML = `
            <h4>My Tickets</h4>
            <p class="form_subtitle">Please sign in to view your support tickets.</p>
            <a href="/user/auth.html" class="submit_btn" style="display:inline-flex;align-items:center;gap:.5rem;text-decoration:none;">
                <i class="fas fa-sign-in-alt"></i> Sign In / Register
            </a>
        `;
        return;
    }

    header.innerHTML = `
        <h4>My Tickets</h4>
        <p class="form_subtitle">Showing your last 5 tickets or tickets from the past month.</p>
        <div id="lookupMsg" class="form_message" style="display:none;"></div>
    `;
}

async function loadMyTickets() {
    renderMyTicketsHeader();
    if (!isLoggedIn()) return;

    const listEl = document.getElementById('myTicketsList');
    if (listEl) { listEl.style.display = 'none'; listEl.innerHTML = ''; }

    try {
        const res = await fetch(`${TICKET_API_URL}/getByUser`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `Error ${res.status}`);
        }

        const data = await res.json();
        const tickets = data.tickets || [];

        if (tickets.length === 0) {
            showMsg('lookupMsg', 'You have no support tickets yet.', 'error');
            return;
        }

        if (listEl) {
            listEl.innerHTML = tickets.map(t => renderTicketCard(t)).join('');
            listEl.style.display = 'flex';
        }
    } catch (err) {
        showMsg('lookupMsg', err.message || 'Failed to load tickets. Please try again.', 'error');
    }
}

// ─── Ticket card renderer ─────────────────────────────────────────────────────

function renderTicketCard(ticket) {
    const isClosed = ticket.status === 'closed';
    const date = new Date(ticket.created_at).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    const responseHtml = ticket.admin_response
        ? `<div class="ticket_response">
               <div class="ticket_response_label"><i class="fas fa-headset"></i> Admin Response</div>
               <div class="ticket_response_text">${escapeHtml(ticket.admin_response)}</div>
           </div>`
        : '';

    const closeBtn = !isClosed
        ? `<button class="ticket_close_btn" onclick="closeMyTicket('${ticket.id}')">
               <i class="fas fa-times-circle"></i> Close Ticket
           </button>`
        : '';

    return `
        <div class="ticket_card ${isClosed ? 'closed' : ''}" id="ticket-${ticket.id}">
            <div class="ticket_card_header">
                <span class="ticket_subject">${escapeHtml(ticket.subject)}</span>
                <span class="ticket_status ${ticket.status}">
                    <i class="fas fa-circle" style="font-size:0.5rem;"></i> ${ticket.status}
                </span>
            </div>
            <div class="ticket_meta">${date}</div>
            <div class="ticket_message">${escapeHtml(ticket.message)}</div>
            ${responseHtml}
            ${closeBtn}
        </div>
    `;
}

// ─── Close ticket ─────────────────────────────────────────────────────────────

async function closeMyTicket(id) {
    try {
        const res = await fetch(`${TICKET_API_URL}/close`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ ticket_id: id })
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `Error ${res.status}`);
        }

        await loadMyTickets();
    } catch (err) {
        showMsg('lookupMsg', err.message || 'Failed to close ticket.', 'error');
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    renderCreateSection();
    renderMyTicketsHeader();
});
