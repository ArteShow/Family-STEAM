const TICKET_API_URL = (() => {
    const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
    const base = isLocalHost
        ? 'http://localhost:8000/api/v1'
        : `${window.location.origin}/api/v1`;
    return `${base}/ticket`;
})();

function switchTab(tab) {
    document.querySelectorAll('.tab_btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab_section').forEach(s => s.classList.remove('active'));

    document.getElementById(`tab_${tab}`).classList.add('active');
    document.getElementById(`section_${tab}`).classList.add('active');
}

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

// ─── Create Ticket ────────────────────────────────────────────────────────────

const ticketForm = document.getElementById('ticketForm');
if (ticketForm) {
    ticketForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        hideMsg('createMsg');

        const name    = document.getElementById('ticketName').value.trim();
        const email   = document.getElementById('ticketEmail').value.trim();
        const subject = document.getElementById('ticketSubject').value.trim();
        const message = document.getElementById('ticketMessage').value.trim();

        if (!name || !email || !subject || !message) {
            showMsg('createMsg', 'Please fill in all fields.', 'error');
            return;
        }

        const btn = ticketForm.querySelector('.submit_btn');
        btn.disabled = true;

        try {
            const res = await fetch(`${TICKET_API_URL}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message })
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `Error ${res.status}`);
            }

            showMsg('createMsg', 'Your ticket has been submitted! We will get back to you soon.', 'success');
            ticketForm.reset();
        } catch (err) {
            showMsg('createMsg', err.message || 'Failed to submit ticket. Please try again.', 'error');
        } finally {
            btn.disabled = false;
        }
    });
}

// ─── My Tickets ──────────────────────────────────────────────────────────────

async function loadMyTickets() {
    const email = document.getElementById('lookupEmail').value.trim();
    hideMsg('lookupMsg');
    const listEl = document.getElementById('myTicketsList');
    listEl.style.display = 'none';
    listEl.innerHTML = '';

    if (!email) {
        showMsg('lookupMsg', 'Please enter your email address.', 'error');
        return;
    }

    try {
        const res = await fetch(`${TICKET_API_URL}/getByEmail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `Error ${res.status}`);
        }

        const data = await res.json();
        const tickets = data.tickets || [];

        if (tickets.length === 0) {
            showMsg('lookupMsg', 'No tickets found for this email address.', 'error');
            return;
        }

        listEl.innerHTML = tickets.map(t => renderTicketCard(t)).join('');
        listEl.style.display = 'flex';
    } catch (err) {
        showMsg('lookupMsg', err.message || 'Failed to load tickets. Please try again.', 'error');
    }
}

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

async function closeMyTicket(id) {
    try {
        const res = await fetch(`${TICKET_API_URL}/close`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticket_id: id })
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `Error ${res.status}`);
        }

        // Refresh the list
        await loadMyTickets();
    } catch (err) {
        showMsg('lookupMsg', err.message || 'Failed to close ticket.', 'error');
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
