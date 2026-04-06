// admin_inbox.js — Admin inbox functionality
// Depends on: MESSAGE_API_URL and apiRequest() defined in admin.js

let inboxThreads = [];
let activeThreadId = null;

/* ---------- Compose modal ------------------------------------------------ */

function showComposeModal() {
    const modal = document.getElementById('composeModal');
    if (modal) modal.style.display = 'flex';
}

function closeComposeModal() {
    const modal = document.getElementById('composeModal');
    if (modal) modal.style.display = 'none';
    const f = (id) => { const el = document.getElementById(id); if (el) el.value = ''; };
    f('composeReceiver');
    f('composeSubject');
    f('composeContent');
}

/* ---------- Load inbox --------------------------------------------------- */

async function loadAdminInbox() {
    try {
        const res = await apiRequest(`${MESSAGE_API_URL}/adminInbox`, { method: 'GET' });
        const data = await res.json();
        inboxThreads = data.threads || [];
        renderInboxThreadsList();
        const countEl = document.getElementById('inbox-count');
        if (countEl) countEl.textContent = inboxThreads.length;
    } catch (err) {
        console.error('Failed to load admin inbox:', err);
        const container = document.getElementById('inboxThreadsList');
        if (container) container.innerHTML = '<p class="empty-state">Failed to load messages.</p>';
    }
}

/* ---------- Render thread list ------------------------------------------ */

function renderInboxThreadsList() {
    const container = document.getElementById('inboxThreadsList');
    if (!container) return;

    if (inboxThreads.length === 0) {
        container.innerHTML = '<p class="empty-state">No messages yet.</p>';
        return;
    }

    container.innerHTML = inboxThreads.map(thread => `
        <div class="thread-item ${thread.thread_id === activeThreadId ? 'active' : ''}"
             onclick="openAdminThread('${escapeHtml(thread.thread_id)}')">
            <div class="thread-item-header">
                <strong>${escapeHtml(thread.receiver_id)}</strong>
                <span class="thread-time">${formatRelativeTime(thread.last_at)}</span>
            </div>
            <div class="thread-subject">${escapeHtml(thread.subject)}</div>
            <div class="thread-preview">${escapeHtml((thread.last_message || '').slice(0, 80))}${(thread.last_message || '').length > 80 ? '…' : ''}</div>
            <span class="thread-msg-count">${thread.message_count} msg${thread.message_count !== 1 ? 's' : ''}</span>
        </div>
    `).join('');
}

/* ---------- Open / render thread ---------------------------------------- */

async function openAdminThread(threadId) {
    activeThreadId = threadId;
    renderInboxThreadsList();

    try {
        const res = await apiRequest(`${MESSAGE_API_URL}/adminThread`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ thread_id: threadId })
        });
        const data = await res.json();
        const messages = data.messages || [];
        const thread = inboxThreads.find(t => t.thread_id === threadId);
        renderAdminThreadView(threadId, thread?.subject || '', thread?.receiver_id || '', messages);
    } catch (err) {
        console.error('Failed to load thread:', err);
    }
}

function renderAdminThreadView(threadId, subject, receiverId, messages) {
    const container = document.getElementById('inboxThreadView');
    if (!container) return;

    const msgsHTML = messages.map(msg => `
        <div class="message-bubble ${msg.sender_id === 'admin' ? 'outgoing' : 'incoming'}">
            <div class="bubble-meta">
                <strong>${escapeHtml(msg.sender_name)}</strong>
                <span>${formatRelativeTime(msg.created_at)}</span>
            </div>
            <div class="bubble-content">${escapeHtml(msg.content)}</div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="thread-view-header">
            <h3>${escapeHtml(subject)}</h3>
            <span class="thread-view-user">with <strong>${escapeHtml(receiverId)}</strong></span>
            <button class="btn-danger btn-sm" onclick="deleteAdminThread('${escapeHtml(threadId)}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
        <div class="thread-messages" id="threadMessages">${msgsHTML}</div>
        <div class="thread-reply-box">
            <textarea id="adminReplyContent" placeholder="Reply…" rows="3"></textarea>
            <button class="btn-primary" onclick="sendAdminReply('${escapeHtml(threadId)}', '${escapeHtml(receiverId)}')">
                <i class="fas fa-reply"></i> Reply
            </button>
        </div>
    `;

    const msgsEl = document.getElementById('threadMessages');
    if (msgsEl) msgsEl.scrollTop = msgsEl.scrollHeight;
}

/* ---------- Send new message -------------------------------------------- */

async function sendAdminMessage() {
    const receiver = document.getElementById('composeReceiver')?.value.trim();
    const subject  = document.getElementById('composeSubject')?.value.trim();
    const content  = document.getElementById('composeContent')?.value.trim();

    if (!receiver || !subject || !content) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        await apiRequest(`${MESSAGE_API_URL}/adminSend`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                receiver_id: receiver,
                receiver_name: receiver,
                subject,
                content,
                thread_id: ''
            })
        });
        closeComposeModal();
        await loadAdminInbox();
    } catch (err) {
        alert(err.message || 'Failed to send message.');
    }
}

/* ---------- Reply to existing thread ------------------------------------ */

async function sendAdminReply(threadId, receiverId) {
    const content = document.getElementById('adminReplyContent')?.value.trim();
    if (!content) return;

    const thread = inboxThreads.find(t => t.thread_id === threadId);

    try {
        await apiRequest(`${MESSAGE_API_URL}/adminSend`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                receiver_id: receiverId || thread?.receiver_id || '',
                receiver_name: receiverId || thread?.receiver_name || '',
                subject: thread?.subject || '',
                content,
                thread_id: threadId
            })
        });
        await openAdminThread(threadId);
    } catch (err) {
        alert(err.message || 'Failed to send reply.');
    }
}

/* ---------- Delete thread ----------------------------------------------- */

async function deleteAdminThread(threadId) {
    if (!confirm('Delete this entire conversation? This cannot be undone.')) return;

    try {
        await apiRequest(`${MESSAGE_API_URL}/adminDelete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ thread_id: threadId })
        });
        activeThreadId = null;
        const viewEl = document.getElementById('inboxThreadView');
        if (viewEl) viewEl.innerHTML = '<div class="thread-placeholder"><i class="fas fa-inbox" style="font-size:3rem;opacity:0.3;"></i><p>Select a conversation</p></div>';
        await loadAdminInbox();
    } catch (err) {
        alert(err.message || 'Failed to delete thread.');
    }
}

/* ---------- Helpers ------------------------------------------------------ */

function formatRelativeTime(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1)   return 'Just now';
    if (mins < 60)  return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)   return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7)   return `${days}d ago`;
    return date.toLocaleDateString();
}
