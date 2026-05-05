// Data storage
let shortEvents = [];
let campsEvents = [];
let adminTickets = [];

// Delete confirmation state
let pendingDelete = {
    type: null,
    id: null
};

// Edit state
let editingId = null;
let editingType = null; // 'short-events' | 'camps'
let editFormDirty = false;
let editingExistingAttachmentIDs = [];
let editingExistingAttachmentIDsOriginal = [];
let editingExistingImageIDs = [];

let detailsContext = {
    type: null,
    id: null,
	clients: [],
    snapshot: ''
};

const AUTH_VERIFY_URL = `${window.location.origin}/api/v1/auth/verify`;
const API_BASE_URL = `${window.location.origin}/api/v1`;
const CALENDER_API_URL = `${API_BASE_URL}/calender`;
const FILE_API_URL = `${API_BASE_URL}/file`;
const CLIENT_API_URL = `${API_BASE_URL}/client`;
const TICKET_API_URL = `${API_BASE_URL}/ticket`;
const MESSAGE_API_URL = `${API_BASE_URL}/message`;
const NEWSLETTER_API_URL = `${API_BASE_URL}/newsletter`;

window.APP_API_BASE_URL = API_BASE_URL;
window.APP_CALENDER_API_URL = CALENDER_API_URL;
window.APP_FILE_API_URL = FILE_API_URL;
window.APP_CLIENT_API_URL = CLIENT_API_URL;
window.APP_TICKET_API_URL = TICKET_API_URL;
window.APP_MESSAGE_API_URL = MESSAGE_API_URL;
window.APP_NEWSLETTER_API_URL = NEWSLETTER_API_URL;

function getAuthToken() {
    return localStorage.getItem('authToken') || '';
}

function showDashboardMessage(message, type = 'error') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

async function apiRequest(url, options = {}) {
    const token = getAuthToken();
    const headers = {
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {
        let errorText = await response.text();
        try {
            const json = JSON.parse(errorText);
            errorText = json.error || json.message || errorText;
        } catch {}

        if (response.status === 413) {
            errorText = 'Upload failed: file is too large for the server. Try a smaller file or use a different network.';
        }

        throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    return response;
}

function parseDateToISO(dateValue) {
    if (!dateValue) {
        return null;
    }
    return `${dateValue}T00:00:00Z`;
}

function parseNumberFromText(value, fallback = 0) {
    const match = String(value ?? '').match(/\d+/);
    if (!match) {
        return fallback;
    }
    return Number(match[0]);
}

async function downloadImagePreview(fileId) {
    try {
        const response = await apiRequest(`${FILE_API_URL}/download`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ file_id: fileId })
        });

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (_) {
        return null;
    }
}

async function mapCalendarEntryToDashboardEvent(entry) {
    const imageIDs = entry.image_ids || [];
    const images = imageIDs.length > 0
        ? (await Promise.all(imageIDs.map(downloadImagePreview))).filter(Boolean)
        : [];

    const base = {
        id: entry.id,
        title: entry.title_en || entry.title || '',
        description: entry.description_en || entry.description || '',
        title_en: entry.title_en || '',
        title_de: entry.title_de || '',
        title_ru: entry.title_ru || '',
        description_en: entry.description_en || '',
        description_de: entry.description_de || '',
        description_ru: entry.description_ru || '',
        place: entry.location,
        price: entry.price,
        tag: entry.tag,
        images,
        imageIDs,
        createdAt: entry.created_at
    };

    if (entry.ends_at) {
        return {
            ...base,
            startDate: entry.starts_at ? entry.starts_at.slice(0, 10) : '',
            endDate: entry.ends_at ? entry.ends_at.slice(0, 10) : '',
            capacity: entry.amount
        };
    }

    return {
        ...base,
        date: entry.starts_at ? entry.starts_at.slice(0, 10) : '',
        duration: entry.duration || '',
        persons: entry.amount,
        responsibility: entry.responsibility || ''
    };
}

function getSliderId(eventId) {
    return `slider-${String(eventId).replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

function renderImageSlider(eventData) {
    if (!eventData.images || eventData.images.length === 0) {
        return '<div class="event-image"></div>';
    }

    const sliderId = getSliderId(eventData.id);
    const showControls = eventData.images.length > 1;

    return `
        <div class="event-image-slider" id="${sliderId}" data-index="0">
            <div class="event-image-track">
                ${eventData.images.map(image => `<img src="${image}" alt="${eventData.title}" class="event-image">`).join('')}
            </div>
            ${showControls ? `
                <button class="slider-btn prev" onclick="changeImageSlide('${eventData.id}', -1)"><i class="fas fa-chevron-left"></i></button>
                <button class="slider-btn next" onclick="changeImageSlide('${eventData.id}', 1)"><i class="fas fa-chevron-right"></i></button>
            ` : ''}
        </div>
    `;
}

function changeImageSlide(eventId, delta) {
    const slider = document.getElementById(getSliderId(eventId));
    if (!slider) {
        return;
    }

    const track = slider.querySelector('.event-image-track');
    const images = slider.querySelectorAll('.event-image');
    if (!track || images.length <= 1) {
        return;
    }

    const currentIndex = Number(slider.dataset.index || '0');
    const nextIndex = (currentIndex + delta + images.length) % images.length;
    slider.dataset.index = String(nextIndex);
    track.style.transform = `translateX(-${nextIndex * 100}%)`;
}

async function reloadDashboardData() {
    const response = await apiRequest(`${CALENDER_API_URL}/getAll`, {
        method: 'GET'
    });

    const data = await response.json();
    const entries = data?.calender_entries || [];

    const mapped = await Promise.all(entries.map(mapCalendarEntryToDashboardEvent));
    shortEvents = mapped.filter(event => !event.endDate);
    campsEvents = mapped.filter(event => event.endDate);

    // Also refresh ticket count for the dashboard card
    try {
        const ticketRes = await apiRequest(`${TICKET_API_URL}/getAll`, { method: 'GET' });
        const ticketData = await ticketRes.json();
        adminTickets = ticketData.tickets || [];
    } catch (_) {
        // tickets count stays as-is
    }

    // Inbox count
    try {
        const inboxRes = await apiRequest(`${MESSAGE_API_URL}/adminInbox`, { method: 'GET' });
        const inboxData = await inboxRes.json();
        const inboxCountEl = document.getElementById('inbox-count');
        if (inboxCountEl) inboxCountEl.textContent = (inboxData.threads || []).length;
    } catch (_) { /* ignore */ }

    // Newsletter subscriber count
    try {
        const subRes = await apiRequest(`${NEWSLETTER_API_URL}/subscribers`, { method: 'GET' });
        const subData = await subRes.json();
        const newsletterCountEl = document.getElementById('newsletter-count');
        if (newsletterCountEl) newsletterCountEl.textContent = (subData.subscribers || []).length + ' subscribers';
    } catch (_) { /* ignore */ }

    renderContent();
}

async function reloadDashboardDataFromUI() {
    try {
        await reloadDashboardData();
        showDashboardMessage('Dashboard refreshed', 'success');
    } catch (error) {
        showDashboardMessage(error.message || 'Failed to reload dashboard data');
    }
}

async function uploadImagesForEntry(entryId, files) {
    const fileIDs = [];

    for (const file of files) {
        const formData = new FormData();
        formData.append('parent_id', entryId);
        formData.append('file_name', file.name);
        formData.append('file', file);

        const response = await apiRequest(`${FILE_API_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data?.file_id) {
            fileIDs.push(data.file_id);
        }
    }

    return fileIDs;
}

async function uploadAttachmentsForEntry(entryId, files) {
    for (const file of files) {
        const formData = new FormData();
        formData.append('parent_id', entryId);
        formData.append('file_name', file.name);
        formData.append('file', file);
        await apiRequest(`${FILE_API_URL}/upload`, {
            method: 'POST',
            body: formData
        });
    }
}

function decodeJwtPayload(token) {
    try {
        const tokenParts = token.split('.');
        if (tokenParts.length < 2) {
            return null;
        }

        const base64Url = tokenParts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
        const json = atob(padded);
        return JSON.parse(json);
    } catch (_) {
        return null;
    }
}

async function verifyTokenWithBackend(tokenPayload, token) {
    if (!tokenPayload || !tokenPayload.user_id) {
        return false;
    }

    try {
        const response = await fetch(AUTH_VERIFY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                user_id: tokenPayload.user_id
            })
        });

        return response.ok;
    } catch (_) {
        return false;
    }
}

function redirectToLogin() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.replace('../login.html');
}

async function enforceAuthGuard() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        redirectToLogin();
        return false;
    }

    const tokenPayload = decodeJwtPayload(token);
    if (!tokenPayload) {
        redirectToLogin();
        return false;
    }

    const isValid = await verifyTokenWithBackend(tokenPayload, token);
    if (!isValid) {
        redirectToLogin();
        return false;
    }

    try {
        const adminCheck = await fetch(`${TICKET_API_URL}/getAll`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!adminCheck.ok) {
            redirectToLogin();
            return false;
        }
    } catch (_) {
        redirectToLogin();
        return false;
    }

    return true;
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const isAllowed = await enforceAuthGuard();
    if (!isAllowed) {
        return;
    }

    // Warn before leaving if an edit form is open and dirty
    window.addEventListener('beforeunload', (e) => {
        if (editingId && editFormDirty) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    initializeNavigation();
    initializeImageUploads();
    initializeFormInteractions();

    try {
        await reloadDashboardData();
    } catch (error) {
        showDashboardMessage(error.message || 'Failed to load dashboard data');
        renderContent();
    }
});

// Logout handler
function handleLogout(event) {
    event.preventDefault();
    // Clear any authentication data if needed
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    // Redirect to login page
    window.location.href = '../login.html';
}

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = link.getAttribute('data-page');
            
            if (!pageName) return;
            
            navigateTo(pageName);
        });
    });

    initializeAdminMenuToggle();
}

function initializeAdminMenuToggle() {
    const menuToggle = document.getElementById('adminMenuToggle');
    const navMenu = document.querySelector('.admin-nav');

    if (!menuToggle || !navMenu) {
        return;
    }

    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.admin-header')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    // Remove active from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(`${page}-page`);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
    
    // Set active nav link
    const navLink = document.querySelector(`[data-page="${page}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }
    
    // Render content if needed
    if (page === 'short-events') {
        renderShortEvents();
    } else if (page === 'camps') {
        renderCampsEvents();
    } else if (page === 'tickets') {
        reloadTickets();
    } else if (page === 'inbox') {
        loadAdminInbox();
    } else if (page === 'newsletter') {
        loadNewsletterData();
    } else if (page === 'reviews') {
        loadReviewsPage();
    } else if (page === 'dashboard') {
        loadUpcomingEvents();
    }
}

// Form Management
async function showForm(type, prefill) {
    let modalId;
    if (type === 'short-events') {
        modalId = 'short-events-form-modal';
    } else if (type === 'camps') {
        modalId = 'camps-form-modal';
    }

    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (prefill) {
        // Edit mode: fill form fields with existing data
        if (type === 'short-events') {
            document.getElementById('eventTitleEn').value   = prefill.title_en || '';
            document.getElementById('eventTitleDe').value   = prefill.title_de || '';
            document.getElementById('eventTitleRu').value   = prefill.title_ru || '';
            document.getElementById('eventDate').value       = prefill.date || '';
            document.getElementById('eventPlace').value      = prefill.place || '';
            document.getElementById('eventPrice').value      = prefill.price !== undefined ? String(prefill.price) : '';
            document.getElementById('eventDuration').value   = prefill.duration || '';
            document.getElementById('eventPersons').value    = prefill.persons !== undefined ? String(prefill.persons) : '';
            document.getElementById('eventTag').value        = prefill.tag || '';
            document.getElementById('eventResponsibility').value = prefill.responsibility || '';
            document.getElementById('eventDescriptionEn').value  = prefill.description_en || '';
            document.getElementById('eventDescriptionDe').value  = prefill.description_de || '';
            document.getElementById('eventDescriptionRu').value  = prefill.description_ru || '';
            modal.querySelector('.form-header h2').textContent = 'Edit Short Event';
            modal.querySelector('.btn-primary[type="submit"]').textContent = 'Save Changes';
        } else if (type === 'camps') {
            document.getElementById('campTitleEn').value      = prefill.title_en || '';
            document.getElementById('campTitleDe').value      = prefill.title_de || '';
            document.getElementById('campTitleRu').value      = prefill.title_ru || '';
            document.getElementById('campStartDate').value    = prefill.startDate || '';
            document.getElementById('campEndDate').value      = prefill.endDate || '';
            document.getElementById('campLocation').value     = prefill.place || '';
            document.getElementById('campPrice').value        = prefill.price !== undefined ? String(prefill.price) : '';
            document.getElementById('campCapacity').value     = prefill.capacity !== undefined ? String(prefill.capacity) : '';
            document.getElementById('campTag').value          = prefill.tag || '';
            document.getElementById('campDescriptionEn').value = prefill.description_en || '';
            document.getElementById('campDescriptionDe').value = prefill.description_de || '';
            document.getElementById('campDescriptionRu').value = prefill.description_ru || '';
            modal.querySelector('.form-header h2').textContent = 'Edit Camp';
            modal.querySelector('.btn-primary[type="submit"]').textContent = 'Save Changes';
        }
        editFormDirty = false;
        setEditingExistingImageIDs(prefill.imageIDs || []);
        renderExistingImageGallery(type, editingExistingImageIDs);
        const attachments = await fetchAttachmentsForEntry(prefill.id);
        setEditingExistingAttachmentIDs(attachments.map(a => a.id));
        renderExistingAttachmentGallery(type, attachments);
        modal.addEventListener('input', markEditDirty, { once: false });
        modal.addEventListener('change', markEditDirty, { once: false });
    } else {
        // Create mode: reset
        if (type === 'short-events') {
            modal.querySelector('.form-header h2').textContent = 'Create Short Event';
            modal.querySelector('.btn-primary[type="submit"]').textContent = 'Create Event';
        } else if (type === 'camps') {
            modal.querySelector('.form-header h2').textContent = 'Create Camp';
            modal.querySelector('.btn-primary[type="submit"]').textContent = 'Create Camp';
        }
        editFormDirty = false;
        setEditingExistingImageIDs([]);
        renderExistingImageGallery(type, []);
        setEditingExistingAttachmentIDs([]);
        renderExistingAttachmentGallery(type, []);
    }

    modal.classList.add('active');
}

function setEditingExistingAttachmentIDs(attachmentIDs) {
    editingExistingAttachmentIDs = Array.isArray(attachmentIDs) ? [...attachmentIDs] : [];
    editingExistingAttachmentIDsOriginal = [...editingExistingAttachmentIDs];
}

function getExistingImageGalleryElement(type) {
    return document.getElementById(type === 'camps' ? 'campExistingImageGallery' : 'eventExistingImageGallery');
}

async function renderExistingImageGallery(type, imageIDs) {
    const gallery = getExistingImageGalleryElement(type);
    if (!gallery) return;

    gallery.innerHTML = '';

    if (!Array.isArray(imageIDs) || imageIDs.length === 0) {
        gallery.innerHTML = '<p class="existing-images-empty">No uploaded images yet.</p>';
        return;
    }

    const previews = await Promise.all(imageIDs.map(async (fileId) => {
        const url = await downloadImagePreview(fileId);
        return { fileId, url };
    }));

    previews.forEach(({ fileId, url }) => {
        const item = document.createElement('div');
        item.className = 'existing-image-item';
        item.innerHTML = `
            <img src="${url || 'data:image/svg+xml;charset=UTF-8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"80\"><rect width=\"100%\" height=\"100%\" fill=\"%23dde4f2\"/><text x=\"50%\" y=\"50%\" dominant-baseline=\"middle\" text-anchor=\"middle\" fill=\"%2340507a\" font-size=\"12\">Image unavailable</text></svg>'}" alt="Existing image" loading="lazy" />
            <button type="button" class="existing-image-delete" onclick="deleteExistingImage('${type}', '${fileId}')" title="Delete image">&times;</button>
        `;
        gallery.appendChild(item);
    });
}

async function fetchAttachmentsForEntry(entryId) {
    try {
        const response = await apiRequest(`${FILE_API_URL}/list`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ parent_id: entryId })
        });
        const data = await response.json();
        return data.files || [];
    } catch (error) {
        console.error('Failed to fetch attachments:', error);
        return [];
    }
}

function getExistingAttachmentGalleryElement(type) {
    return document.getElementById(type === 'camps' ? 'campExistingAttachmentGallery' : 'eventExistingAttachmentGallery');
}

async function renderExistingAttachmentGallery(type, attachments) {
    const gallery = getExistingAttachmentGalleryElement(type);
    if (!gallery) return;

    gallery.innerHTML = '';

    if (!Array.isArray(attachments) || attachments.length === 0) {
        gallery.innerHTML = '<p class="existing-attachments-empty">No attachments yet.</p>';
        return;
    }

    attachments.forEach(attachment => {
        const item = document.createElement('div');
        item.className = 'existing-attachment-item';
        item.innerHTML = `
            <span class="attachment-name">${attachment.file_name}</span>
            <div class="attachment-actions">
                <button type="button" class="attachment-download" onclick="downloadAttachment('${attachment.id}')" title="Download">&darr;</button>
                <button type="button" class="attachment-delete" onclick="deleteExistingAttachment('${type}', '${attachment.id}')" title="Delete">&times;</button>
            </div>
        `;
        gallery.appendChild(item);
    });
}

async function downloadAttachment(fileId) {
    try {
        const response = await apiRequest(`${FILE_API_URL}/download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file_id: fileId })
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'attachment'; // Could fetch filename, but for now generic
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        showDashboardMessage('Failed to download attachment');
    }
}

async function deleteExistingAttachment(type, fileId) {
    if (!confirm('Delete this attachment from the announcement?')) {
        return;
    }

    try {
        await apiRequest(`${FILE_API_URL}/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file_id: fileId })
        });

        editingExistingAttachmentIDs = editingExistingAttachmentIDs.filter(id => id !== fileId);
        const attachments = await fetchAttachmentsForEntry(editingId);
        renderExistingAttachmentGallery(type, attachments);
        showDashboardMessage('Attachment deleted successfully', 'success');
    } catch (error) {
        showDashboardMessage(error.message || 'Failed to delete attachment');
    }
}

function markEditDirty() {
    editFormDirty = true;
}

function closeForm(type) {
    // If editing and form is dirty, ask for confirmation
    if (editingId && editingType === type && editFormDirty) {
        showDiscardEditModal(type);
        return;
    }
    _doCloseForm(type);
}

function _doCloseForm(type) {
    let modalId, formId, previewContainerId, previewTextId, fileInputId;
    
    if (type === 'short-events') {
        modalId = 'short-events-form-modal';
        formId = 'shortEventForm';
        previewContainerId = 'imagePreviewContainer';
        previewTextId = 'imagePreviewText';
        fileInputId = 'eventImage';
    } else if (type === 'camps') {
        modalId = 'camps-form-modal';
        formId = 'campsEventForm';
        previewContainerId = 'campImagePreviewContainer';
        previewTextId = 'campImagePreviewText';
        fileInputId = 'campImage';
    }
    
    const modal = document.getElementById(modalId);
    const form = document.getElementById(formId);
    
    if (modal) {
        modal.classList.remove('active');
        modal.removeEventListener('input', markEditDirty);
        modal.removeEventListener('change', markEditDirty);
    }
    
    if (form) {
        form.reset();
        const gallery = getExistingImageGalleryElement(type);
        const attachmentGallery = getExistingAttachmentGalleryElement(type);
        
        if (previewContainer) {
            previewContainer.innerHTML = '';
        }
        if (previewText) previewText.style.display = 'block';
        if (gallery) gallery.innerHTML = '';
        if (attachmentGallery) attachmentGallery.innerHTML = '';
        
        // Reset file input
        const fileInput = document.getElementById(fileInputId);
        if (fileInput) fileInput.value = '';
    }

    editingId = null;
    editingType = null;
    editingExistingImageIDs = [];
    editingExistingImageIDsOriginal = [];
    editingExistingAttachmentIDs = [];
    editingExistingAttachmentIDsOriginal = [];
    editFormDirty = false;
}

function showDiscardEditModal(type) {
    const modal = document.getElementById('discardEditModal');
    if (modal) {
        modal._pendingType = type;
        modal.classList.add('active');
    }
}

function closeDiscardEditModal() {
    const modal = document.getElementById('discardEditModal');
    if (modal) modal.classList.remove('active');
}

function confirmDiscardEdit() {
    const modal = document.getElementById('discardEditModal');
    const type = modal ? modal._pendingType : null;
    closeDiscardEditModal();
    if (type) _doCloseForm(type);
}

// Handle Short Event Form Submission
async function handleShortEventSubmit(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('shortEventForm'));
    const imageFiles = Array.from(document.getElementById('eventImage').files || []);
    const attachmentFiles = Array.from(document.getElementById('eventFiles')?.files || []);

    try {
        if (editingId && editingType === 'short-events') {
            // Update existing event
            await apiRequest(`${CALENDER_API_URL}/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    calender_entry_id: editingId,
                    calender_entry: {
                        location:       formData.get('place'),
                        price:          formData.get('price'),
                        tag:            formData.get('tag'),
                        amount:         parseNumberFromText(formData.get('persons'), 0),
                        title_en:       formData.get('title_en'),
                        title_de:       formData.get('title_de') || '',
                        title_ru:       formData.get('title_ru') || '',
                        description_en: formData.get('description_en'),
                        description_de: formData.get('description_de') || '',
                        description_ru: formData.get('description_ru') || '',
                        responsibility: formData.get('responsibility'),
                        starts_at:      parseDateToISO(formData.get('date')),
                        ends_at:        null,
                        duration:       formData.get('duration')
                    }
                })
            });

            if (imageFiles.length > 0) {
                const imageIDs = await uploadImagesForEntry(editingId, imageFiles);
                const updatedImageIDs = [...editingExistingImageIDs, ...imageIDs];
                await apiRequest(`${CALENDER_API_URL}/update-images`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ calender_entry_id: editingId, image_ids: updatedImageIDs })
                });
            } else if (editingExistingImageIDs.length !== editingExistingImageIDsOriginal.length) {
                await apiRequest(`${CALENDER_API_URL}/update-images`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ calender_entry_id: editingId, image_ids: editingExistingImageIDs })
                });
            }

            if (attachmentFiles.length > 0) {
                await uploadAttachmentsForEntry(editingId, attachmentFiles);
            }

            _doCloseForm('short-events');
            await reloadDashboardData();
            showDashboardMessage('Short event updated successfully', 'success');
            return;
        }

        const createResponse = await apiRequest(`${CALENDER_API_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                calender_entry: {
                    location: formData.get('place'),
                    price: formData.get('price'),
                    tag: formData.get('tag'),
                    image_ids: [],
                    amount: parseNumberFromText(formData.get('persons'), 0),
                    title_en: formData.get('title_en'),
                    title_de: formData.get('title_de') || '',
                    title_ru: formData.get('title_ru') || '',
                    description_en: formData.get('description_en'),
                    description_de: formData.get('description_de') || '',
                    description_ru: formData.get('description_ru') || '',
                    responsibility: formData.get('responsibility'),
                    starts_at: parseDateToISO(formData.get('date')),
                    ends_at: null,
                    duration: formData.get('duration')
                }
            })
        });

        const created = await createResponse.json();
        const calenderEntryID = created?.calender_entry_id;
        if (!calenderEntryID) {
            throw new Error('Missing calender entry id in create response');
        }

        if (imageFiles.length > 0) {
            const imageIDs = await uploadImagesForEntry(calenderEntryID, imageFiles);
            await apiRequest(`${CALENDER_API_URL}/update-images`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    calender_entry_id: calenderEntryID,
                    image_ids: imageIDs
                })
            });
        }

        if (attachmentFiles.length > 0) {
            await uploadAttachmentsForEntry(calenderEntryID, attachmentFiles);
        }

        closeForm('short-events');
        await reloadDashboardData();
        showDashboardMessage('Short event created successfully', 'success');
    } catch (error) {
        showDashboardMessage(error.message || 'Failed to create short event');
    }
}

// Handle Calendar Event Form Submission
async function handleCampsEventSubmit(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('campsEventForm'));
    const imageFiles = Array.from(document.getElementById('campImage').files || []);
    const attachmentFiles = Array.from(document.getElementById('campFiles')?.files || []);

    try {
        if (editingId && editingType === 'camps') {
            // Update existing camp
            await apiRequest(`${CALENDER_API_URL}/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    calender_entry_id: editingId,
                    calender_entry: {
                        location:       formData.get('place'),
                        price:          formData.get('price'),
                        tag:            formData.get('tag'),
                        amount:         parseNumberFromText(formData.get('capacity'), 0),
                        title_en:       formData.get('title_en'),
                        title_de:       formData.get('title_de') || '',
                        title_ru:       formData.get('title_ru') || '',
                        description_en: formData.get('description_en'),
                        description_de: formData.get('description_de') || '',
                        description_ru: formData.get('description_ru') || '',
                        responsibility: null,
                        starts_at:      parseDateToISO(formData.get('startDate')),
                        ends_at:        parseDateToISO(formData.get('endDate')),
                        duration:       null
                    }
                })
            });

            if (imageFiles.length > 0) {
                const imageIDs = await uploadImagesForEntry(editingId, imageFiles);
                const updatedImageIDs = [...editingExistingImageIDs, ...imageIDs];
                await apiRequest(`${CALENDER_API_URL}/update-images`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ calender_entry_id: editingId, image_ids: updatedImageIDs })
                });
            } else if (editingExistingImageIDs.length !== editingExistingImageIDsOriginal.length) {
                await apiRequest(`${CALENDER_API_URL}/update-images`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ calender_entry_id: editingId, image_ids: editingExistingImageIDs })
                });
            }

            if (attachmentFiles.length > 0) {
                await uploadAttachmentsForEntry(editingId, attachmentFiles);
            }

            _doCloseForm('camps');
            await reloadDashboardData();
            showDashboardMessage('Camp updated successfully', 'success');
            return;
        }

        const createResponse = await apiRequest(`${CALENDER_API_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                calender_entry: {
                    location: formData.get('place'),
                    price: formData.get('price'),
                    tag: formData.get('tag'),
                    image_ids: [],
                    amount: parseNumberFromText(formData.get('capacity'), 0),
                    title_en: formData.get('title_en'),
                    title_de: formData.get('title_de') || '',
                    title_ru: formData.get('title_ru') || '',
                    description_en: formData.get('description_en'),
                    description_de: formData.get('description_de') || '',
                    description_ru: formData.get('description_ru') || '',
                    responsibility: null,
                    starts_at: parseDateToISO(formData.get('startDate')),
                    ends_at: parseDateToISO(formData.get('endDate')),
                    duration: null
                }
            })
        });

        const created = await createResponse.json();
        const calenderEntryID = created?.calender_entry_id;
        if (!calenderEntryID) {
            throw new Error('Missing calender entry id in create response');
        }

        if (imageFiles.length > 0) {
            const imageIDs = await uploadImagesForEntry(calenderEntryID, imageFiles);
            await apiRequest(`${CALENDER_API_URL}/update-images`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    calender_entry_id: calenderEntryID,
                    image_ids: imageIDs
                })
            });
        }

        if (attachmentFiles.length > 0) {
            await uploadAttachmentsForEntry(calenderEntryID, attachmentFiles);
        }

        closeForm('camps');
        await reloadDashboardData();
        showDashboardMessage('Camp created successfully', 'success');
    } catch (error) {
        showDashboardMessage(error.message || 'Failed to create camp');
    }
}

// Render Short Events
function renderShortEvents() {
    const container = document.getElementById('shortEventsList');
    
    if (shortEvents.length === 0) {
        container.innerHTML = '<p class="empty-state">No short events yet. Create one to get started!</p>';
        return;
    }
    
    container.innerHTML = shortEvents.map(event => `
        <div class="event-card">
            ${renderImageSlider(event)}
            <div class="event-content">
                <h3>${event.title}</h3>
                <div class="event-meta">
                    <i class="fas fa-calendar"></i>
                    ${event.date}
                </div>
                <div class="event-meta">
                    <i class="fas fa-map-marker-alt"></i>
                    ${event.place}
                </div>
                <div class="event-meta">
                    <i class="fas fa-euro-sign"></i>
                    ${event.price}
                </div>
                <div class="event-meta">
                    <i class="fas fa-clock"></i>
                    ${event.duration}
                </div>
                <div class="event-meta">
                    <i class="fas fa-users"></i>
                    ${event.persons}
                </div>
                <div class="event-meta">
                    <i class="fas fa-tag"></i>
                    ${event.tag}
                </div>
                <p class="event-description">${event.description}</p>
                <div class="event-actions">
                    <button class="edit-btn" onclick="editShortEvent('${event.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="details-btn" onclick="openClientsDetails('short-events', '${event.id}')">
                        <i class="fas fa-users"></i> See details
                    </button>
                    <button class="delete-btn" onclick="deleteShortEvent('${event.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Render Calendar Events
function renderCampsEvents() {
    const container = document.getElementById('campsList');
    
    if (campsEvents.length === 0) {
        container.innerHTML = '<p class="empty-state">No camps yet. Create one to get started!</p>';
        return;
    }
    
    container.innerHTML = campsEvents.map(event => `
        <div class="event-card">
            ${renderImageSlider(event)}
            <div class="event-content">
                <h3>${event.title}</h3>
                <div class="event-meta">
                    <i class="fas fa-calendar"></i>
                    ${event.startDate} to ${event.endDate}
                </div>
                <div class="event-meta">
                    <i class="fas fa-map-marker-alt"></i>
                    ${event.place}
                </div>
                <div class="event-meta">
                    <i class="fas fa-euro-sign"></i>
                    ${event.price}
                </div>
                <div class="event-meta">
                    <i class="fas fa-users"></i>
                    ${event.capacity}
                </div>
                <div class="event-meta">
                    <i class="fas fa-tag"></i>
                    ${event.tag}
                </div>
                <p class="event-description">${event.description}</p>
                <div class="event-actions">
                    <button class="edit-btn" onclick="editCampsEvent('${event.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="details-btn" onclick="openClientsDetails('camps', '${event.id}')">
                        <i class="fas fa-users"></i> See details
                    </button>
                    <button class="delete-btn" onclick="deleteCampsEvent('${event.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Delete Functions with Modal Confirmation
function editShortEvent(id) {
    const ev = shortEvents.find(e => e.id === id);
    if (!ev) return;
    editingId = id;
    editingType = 'short-events';
    showForm('short-events', ev);
}

function editCampsEvent(id) {
    const ev = campsEvents.find(e => e.id === id);
    if (!ev) return;
    editingId = id;
    editingType = 'camps';
    showForm('camps', ev);
}

function deleteShortEvent(id) {
    pendingDelete.type = 'short-events';
    pendingDelete.id = id;
    showDeleteModal('short event');
}

function deleteCampsEvent(id) {
    pendingDelete.type = 'camps';
    pendingDelete.id = id;
    showDeleteModal('camp');
}

function showDeleteModal(itemType) {
    const modal = document.getElementById('deleteConfirmModal');
    const message = document.getElementById('deleteMessage');
    message.textContent = `Are you sure you want to delete this ${itemType}? This action cannot be undone.`;
    modal.classList.add('active');
}

function cancelDelete() {
    const modal = document.getElementById('deleteConfirmModal');
    modal.classList.remove('active');
    pendingDelete.type = null;
    pendingDelete.id = null;
}

async function confirmDelete() {
    if (!pendingDelete.type || !pendingDelete.id) return;

    try {
        if (pendingDelete.type === 'ticket') {
            await apiRequest(`${TICKET_API_URL}/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticket_id: pendingDelete.id })
            });
            cancelDelete();
            await reloadTickets();
        } else {
            await apiRequest(`${CALENDER_API_URL}/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ calender_entry_id: pendingDelete.id })
            });
            cancelDelete();
            await reloadDashboardData();
        }
        showDashboardMessage('Deleted successfully', 'success');
    } catch (error) {
        showDashboardMessage(error.message || 'Failed to delete entry');
    }
}

// Update Counts
function updateCounts() {
    document.getElementById('short-events-count').textContent = shortEvents.length;
    document.getElementById('camps-count').textContent = campsEvents.length;
    updateTicketsCount();
}

// Image Upload Handler
function initializeImageUploads() {
    const setupImageUpload = (fileInputId, previewId, previewTextId) => {
        const fileInput = document.getElementById(fileInputId);
        const preview = document.getElementById(previewId);
        const previewText = document.getElementById(previewTextId);
        const uploadArea = fileInput?.parentElement;

        if (!fileInput) return;

        uploadArea?.addEventListener('click', () => fileInput.click());
        
        uploadArea?.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.background = 'rgba(41, 128, 225, 0.2)';
            uploadArea.style.borderColor = 'rgb(41, 128, 225)';
        });
        
        uploadArea?.addEventListener('dragleave', () => {
            uploadArea.style.background = 'rgba(41, 128, 225, 0.05)';
            uploadArea.style.borderColor = 'rgba(24, 37, 110, 0.2)';
        });
        
        uploadArea?.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.background = 'rgba(41, 128, 225, 0.05)';
            uploadArea.style.borderColor = 'rgba(24, 37, 110, 0.2)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                handleImagePreview(fileInputId, previewId, previewTextId);
            }
        });
        
        fileInput.addEventListener('change', () => {
            handleImagePreview(fileInputId, previewId, previewTextId);
        });
    };

    setupImageUpload('eventImage', 'imagePreviewContainer', 'imagePreviewText');
    setupImageUpload('campImage', 'campImagePreviewContainer', 'campImagePreviewText');

    const setupFileAttachmentUpload = (inputId, previewId, textId) => {
        const fileInput = document.getElementById(inputId);
        const previewEl = document.getElementById(previewId);
        const textEl = document.getElementById(textId);
        const uploadArea = fileInput?.parentElement;
        if (!fileInput) return;

        uploadArea?.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', () => {
            previewEl.innerHTML = '';
            if (fileInput.files.length > 0) {
                if (textEl) textEl.style.display = 'none';
                Array.from(fileInput.files).forEach(file => {
                    const item = document.createElement('div');
                    item.className = 'file-preview-item';
                    item.innerHTML = `<i class="fas fa-file"></i> <span>${file.name}</span>`;
                    previewEl.appendChild(item);
                });
            } else {
                if (textEl) textEl.style.display = 'block';
            }
        });
    };

    setupFileAttachmentUpload('eventFiles', 'eventFilesPreview', 'eventFilesText');
    setupFileAttachmentUpload('campFiles', 'campFilesPreview', 'campFilesText');
}

function handleImagePreview(fileInputId, previewId, previewTextId) {
    const fileInput = document.getElementById(fileInputId);
    const previewContainer = document.getElementById(previewId);
    const previewText = document.getElementById(previewTextId);
    
    previewContainer.innerHTML = ''; // Clear previous previews
    
    if (fileInput.files.length > 0) {
        previewText.style.display = 'none';
        
        Array.from(fileInput.files).forEach((file, index) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'preview-img';
                img.alt = `Preview ${index + 1}`;
                previewContainer.appendChild(img);
            };
            
            reader.readAsDataURL(file);
        });
    } else {
        previewText.style.display = 'block';
    }
}

// Form Interactions
function initializeFormInteractions() {
    // Close modal when clicking outside
    document.querySelectorAll('.form-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                let formType;
                if (modal.id.includes('short-events')) {
                    formType = 'short-events';
                } else if (modal.id.includes('camps')) {
                    formType = 'camps';
                }
                if (formType) {
                    closeForm(formType);
                }
            }
        });
    });

    const detailsModal = document.getElementById('clientsDetailsModal');
    if (detailsModal) {
        detailsModal.addEventListener('click', (e) => {
            if (e.target === detailsModal) {
                attemptCloseClientsDetails();
            }
        });
    }

    const discardModal = document.getElementById('discardEditModal');
    if (discardModal) {
        discardModal.addEventListener('click', (e) => {
            if (e.target === discardModal) closeDiscardEditModal();
        });
    }

    const ticketModal = document.getElementById('ticketRespondModal');
    if (ticketModal) {
        ticketModal.addEventListener('click', (e) => {
            if (e.target === ticketModal) {
                closeTicketRespondModal();
            }
        });
    }
}

function renderContent() {
    updateCounts();
    renderShortEvents();
    renderCampsEvents();
}

function updateTicketsCount() {
    const el = document.getElementById('tickets-count');
    if (el) el.textContent = adminTickets.length;
}

function toInputDateString(dateValue) {
    if (!dateValue) {
        return '';
    }

    if (typeof dateValue === 'string') {
        return dateValue.slice(0, 10);
    }

    return new Date(dateValue).toISOString().slice(0, 10);
}

function mapApiClientToModalClient(apiClient) {
    return {
        clientID: apiClient.client_id,
        firstName: apiClient.first_name || '',
        lastName: apiClient.last_name || '',
        phone: apiClient.phone || '',
        email: apiClient.email || '',
        age: apiClient.age ?? '',
        birthday: toInputDateString(apiClient.birthday),
        paid: Boolean(apiClient.paid),
        username: apiClient.username || '',
        avatar: apiClient.avatar || '',
        paymentMethod: apiClient.payment_method || 'cash'
    };
}

async function fetchClientsForEntry(calenderEntryID) {
    const response = await apiRequest(`${CLIENT_API_URL}/list`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            calender_entry_id: calenderEntryID
        })
    });

    const data = await response.json();
    return (data?.clients || []).map(mapApiClientToModalClient);
}

function renderClientsTable(schema, clients) {
    const tableHead = document.getElementById('clientsTableHeadRow');
    const tableBody = document.getElementById('clientsTableBody');

    tableHead.innerHTML = `${schema.map(field => `<th data-col="${field.key}">${field.label}</th>`).join('')}<th>Actions</th>`;

    tableBody.innerHTML = clients.map((client, index) => `
        <tr data-client-id="${client.clientID || ''}">
            ${schema.map(field => renderClientCell(field, client, index)).join('')}
            <td><button class="client-delete-btn" onclick="deleteClientFromModal(${index})"><i class="fas fa-trash"></i> Delete</button></td>
        </tr>
    `).join('');
}

function buildClientsSnapshot() {
    const rows = Array.from(document.querySelectorAll('#clientsTableBody tr'));
    const normalized = rows.map((row) => ({
        clientID: row.getAttribute('data-client-id') || '',
        firstName: row.querySelector('[data-field="firstName"]')?.value ?? '',
        lastName: row.querySelector('[data-field="lastName"]')?.value ?? '',
        phone: row.querySelector('[data-field="phone"]')?.value ?? '',
        email: row.querySelector('[data-field="email"]')?.value ?? '',
        birthday: row.querySelector('[data-field="birthday"]')?.value ?? '',
        age: row.querySelector('[data-field="age"]')?.value ?? '',
        paid: row.querySelector('[data-field="paid"]')?.checked ?? false
    }));

    return JSON.stringify(normalized);
}

function refreshClientsSnapshot() {
    detailsContext.snapshot = buildClientsSnapshot();
}

function hasUnsavedClientsChanges() {
    return buildClientsSnapshot() !== detailsContext.snapshot;
}

function addClientRowToModal() {
    detailsContext.clients.push({
        clientID: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        age: '',
        birthday: '',
        paid: false
    });

    renderClientsTable(getDetailsSchema(detailsContext.type), detailsContext.clients);
}

async function deleteClientFromModal(index) {
    const client = detailsContext.clients[index];
    if (!client) {
        return;
    }

    try {
        if (client.clientID) {
            await apiRequest(`${CLIENT_API_URL}/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    client_id: client.clientID
                })
            });
        }

        detailsContext.clients.splice(index, 1);
        renderClientsTable(getDetailsSchema(detailsContext.type), detailsContext.clients);
        refreshClientsSnapshot();
        showDashboardMessage('Client deleted', 'success');
    } catch (error) {
        showDashboardMessage(error.message || 'Failed to delete client');
    }
}

async function openClientsDetails(type, id) {
    const modal = document.getElementById('clientsDetailsModal');
    const title = document.getElementById('clientsDetailsTitle');
    const selectedItem = type === 'short-events'
        ? shortEvents.find(eventItem => eventItem.id === id)
        : campsEvents.find(eventItem => eventItem.id === id);

    if (!modal || !title || !selectedItem) return;

    detailsContext.type = type;
    detailsContext.id = id;
    title.textContent = `${selectedItem.title} - Clients Details`;

    try {
        detailsContext.clients = await fetchClientsForEntry(id);
    } catch (error) {
        detailsContext.clients = [];
        showDashboardMessage(error.message || 'Failed to load clients');
    }

    renderClientsTable(getDetailsSchema(type), detailsContext.clients);
    refreshClientsSnapshot();
    modal.classList.add('active');
}

function closeClientsDetails(force = false) {
    if (!force && hasUnsavedClientsChanges()) {
        openUnsavedClientsModal();
        return;
    }

    const modal = document.getElementById('clientsDetailsModal');
    const tableHead = document.getElementById('clientsTableHeadRow');
    const tableBody = document.getElementById('clientsTableBody');

    if (modal) {
        modal.classList.remove('active');
    }

    if (tableHead) {
        tableHead.innerHTML = '';
    }

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    detailsContext.type = null;
    detailsContext.id = null;
    detailsContext.clients = [];
    detailsContext.snapshot = '';
}

function attemptCloseClientsDetails() {
    closeClientsDetails(false);
}

function openUnsavedClientsModal() {
    const unsavedModal = document.getElementById('unsavedClientsModal');
    if (unsavedModal) {
        unsavedModal.classList.add('active');
    }
}

function closeUnsavedClientsModal() {
    const unsavedModal = document.getElementById('unsavedClientsModal');
    if (unsavedModal) {
        unsavedModal.classList.remove('active');
    }
}

async function saveAndCloseClientsModal() {
    closeUnsavedClientsModal();
    await saveClientsDetails(true);
}

function discardClientsChangesAndClose() {
    closeUnsavedClientsModal();
    closeClientsDetails(true);
}

async function saveClientsDetails(closeAfterSave = true) {
    if (!detailsContext.type || !detailsContext.id) return;

    const rows = Array.from(document.querySelectorAll('#clientsTableBody tr'));

    try {
        for (const row of rows) {
            const clientID = row.getAttribute('data-client-id') || '';
            const values = {
                firstName: row.querySelector('[data-field="firstName"]')?.value ?? '',
                lastName: row.querySelector('[data-field="lastName"]')?.value ?? '',
                phone: row.querySelector('[data-field="phone"]')?.value ?? '',
                email: row.querySelector('[data-field="email"]')?.value ?? '',
                birthday: row.querySelector('[data-field="birthday"]')?.value ?? '',
                age: row.querySelector('[data-field="age"]')?.value ?? '',
                paid: row.querySelector('[data-field="paid"]')?.checked ?? false
            };

            if (!values.firstName || !values.lastName || !values.email || !values.phone) {
                continue;
            }

            if (!clientID) {
                await apiRequest(`${CLIENT_API_URL}/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        client: {
                            calendar_id: detailsContext.id,
                            first_name: values.firstName,
                            last_name: values.lastName,
                            email: values.email,
                            phone: values.phone,
                            paid: values.paid,
                            birthday: values.birthday ? `${values.birthday}T00:00:00Z` : null,
                            age: values.age === '' ? null : Number(values.age)
                        }
                    })
                });
            } else {
                const updates = [
                    { column: 'first_name', value: values.firstName },
                    { column: 'last_name', value: values.lastName },
                    { column: 'phone', value: values.phone },
                    { column: 'email', value: values.email },
                    { column: 'birthday', value: values.birthday ? `${values.birthday}T00:00:00Z` : '' },
                    { column: 'age', value: values.age === '' ? '0' : String(values.age) },
                    { column: 'paid', value: values.paid ? 'true' : 'false' },
                    { column: 'calendar_id', value: detailsContext.id }
                ];

                for (const update of updates) {
                    await apiRequest(`${CLIENT_API_URL}/update`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            client_id: clientID,
                            column: update.column,
                            value: update.value
                        })
                    });
                }
            }
        }

        detailsContext.clients = await fetchClientsForEntry(detailsContext.id);
        renderClientsTable(getDetailsSchema(detailsContext.type), detailsContext.clients);
        refreshClientsSnapshot();
        showDashboardMessage('Clients saved', 'success');

        if (closeAfterSave) {
            closeClientsDetails(true);
        }
    } catch (error) {
        showDashboardMessage(error.message || 'Failed to save clients');
    }
}

function getDetailsSchema(type) {
    return [
        { key: 'avatar',        label: 'Photo',          inputType: 'avatar' },
        { key: 'username',      label: 'Username',       inputType: 'readonly' },
        { key: 'paymentMethod', label: 'Payment',        inputType: 'payment-badge' },
        { key: 'firstName',     label: 'First Name',     inputType: 'text' },
        { key: 'lastName',      label: 'Last Name',      inputType: 'text' },
        { key: 'birthday',      label: 'Date of Birth',  inputType: 'date' },
        { key: 'phone',         label: 'Phone',          inputType: 'text' },
        { key: 'email',         label: 'Email',          inputType: 'email' },
        { key: 'age',           label: 'Age',            inputType: 'number' },
        { key: 'paid',          label: 'Paid',           inputType: 'checkbox' }
    ];
}

function renderClientCell(field, client, index) {
    const value = client[field.key] ?? '';

    if (field.inputType === 'avatar') {
        const src = escapeHtml(String(value));
        const alt = escapeHtml(client.username || '');
        if (src) {
            return `<td data-col="${field.key}"><img src="${src}" alt="${alt}" class="client-avatar-preview" onerror="this.style.display='none'"></td>`;
        }
        return `<td data-col="${field.key}"><span class="client-avatar-placeholder"><i class="fas fa-user"></i></span></td>`;
    }

    if (field.inputType === 'readonly') {
        return `<td data-col="${field.key}"><span class="readonly-cell">${escapeHtml(String(value)) || '—'}</span></td>`;
    }

    if (field.inputType === 'payment-badge') {
        const isCard = value === 'card';
        const label = isCard ? '✅ Card (Paid)' : '⏳ Cash (On arrival)';
        return `<td data-col="${field.key}"><span class="payment-badge ${escapeHtml(String(value))}">${label}</span></td>`;
    }

    if (field.inputType === 'checkbox') {
        return `<td data-col="${field.key}"><input type="checkbox" ${value ? 'checked' : ''} data-field="${field.key}" data-row="${index}"></td>`;
    }

    if (field.inputType === 'textarea') {
        return `<td data-col="${field.key}"><textarea rows="2" data-field="${field.key}" data-row="${index}">${escapeHtml(String(value))}</textarea></td>`;
    }

    return `<td data-col="${field.key}"><input type="${field.inputType}" value="${escapeHtml(String(value))}" data-field="${field.key}" data-row="${index}"></td>`;
}

function escapeHtml(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function addClientFromModal() {
    addClientRowToModal();
}

// ─── Ticket management ────────────────────────────────────────────────────────

let respondingTicketId = null;

async function reloadTickets() {
    try {
        const response = await apiRequest(`${TICKET_API_URL}/getAll`, { method: 'GET' });
        const data = await response.json();
        adminTickets = data.tickets || [];
        renderAdminTickets();
        updateTicketsCount();
    } catch (error) {
        showDashboardMessage(error.message || 'Failed to load tickets');
    }
}

function renderAdminTickets() {
    const container = document.getElementById('ticketsList');
    if (!container) return;

    if (adminTickets.length === 0) {
        container.innerHTML = '<p class="empty-state">No support tickets yet.</p>';
        return;
    }

    container.innerHTML = adminTickets.map(ticket => {
        const isClosed = ticket.status === 'closed';
        const date = new Date(ticket.created_at).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });

        const responseHtml = ticket.admin_response
            ? `<div class="ticket-admin-response">
                   <div class="ticket-admin-response-label"><i class="fas fa-headset"></i> Admin Response</div>
                   <div class="ticket-admin-response-text">${escapeHtml(ticket.admin_response)}</div>
               </div>`
            : '';

        return `
            <div class="ticket-admin-card ${isClosed ? 'closed' : ''}" id="admin-ticket-${ticket.id}">
                <div class="ticket-admin-header">
                    <span class="ticket-admin-subject">${escapeHtml(ticket.subject)}</span>
                    <span class="ticket-admin-status ${ticket.status}">
                        <i class="fas fa-circle" style="font-size:0.5rem;"></i> ${ticket.status}
                    </span>
                </div>
                <div class="ticket-admin-meta">
                    <i class="fas fa-user"></i> ${escapeHtml(ticket.username || ticket.name)}
                    &nbsp;·&nbsp;
                    <i class="fas fa-envelope"></i> ${escapeHtml(ticket.email || '—')}
                    &nbsp;·&nbsp;
                    <i class="fas fa-calendar"></i> ${date}
                </div>
                <div class="ticket-admin-message">${escapeHtml(ticket.message)}</div>
                ${responseHtml}
                <div class="ticket-admin-actions">
                    <button class="btn-primary" onclick="openTicketRespondModal('${ticket.id}', \`${escapeHtml(ticket.subject)}\`)">
                        <i class="fas fa-reply"></i> Respond
                    </button>
                    <button class="delete-btn" onclick="deleteAdminTicket('${ticket.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function openTicketRespondModal(ticketId, subject) {
    respondingTicketId = ticketId;
    const infoEl = document.getElementById('ticketRespondInfo');
    if (infoEl) {
        infoEl.innerHTML = `<strong>Ticket:</strong> ${escapeHtml(subject)}`;
    }
    const modal = document.getElementById('ticketRespondModal');
    const form = document.getElementById('ticketRespondForm');
    if (form) form.reset();
    if (modal) modal.classList.add('active');
}

function closeTicketRespondModal() {
    respondingTicketId = null;
    const modal = document.getElementById('ticketRespondModal');
    if (modal) modal.classList.remove('active');
}

async function submitTicketResponse(event) {
    event.preventDefault();
    if (!respondingTicketId) return;

    const responseText = document.getElementById('ticketResponseText').value.trim();
    if (!responseText) return;

    try {
        await apiRequest(`${TICKET_API_URL}/respond`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticket_id: respondingTicketId, response: responseText })
        });

        closeTicketRespondModal();
        await reloadTickets();
        showDashboardMessage('Response sent successfully', 'success');
    } catch (error) {
        showDashboardMessage(error.message || 'Failed to send response');
    }
}

function deleteAdminTicket(id) {
    pendingDelete.type = 'ticket';
    pendingDelete.id = id;
    showDeleteModal('support ticket');
}

// Initial load
reloadDashboardData();
loadUpcomingEvents();

function setEditingExistingImageIDs(ids) {
    editingExistingImageIDs = ids;
}

function setEditingExistingAttachmentIDs(ids) {
    editingExistingAttachmentIDs = ids;
    editingExistingAttachmentIDsOriginal = [...ids];
}

async function loadUpcomingEvents() {
    try {
        const res = await apiRequest(`${CALENDER_API_URL}/getAll`, { method: 'GET' });
        const data = await res.json();
        const entries = data.calender_entries || [];
        const now = new Date();
        const upcoming = entries.filter(e => {
            const start = new Date(e.starts_at);
            return start > now;
        }).sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at)).slice(0, 6);
        renderUpcomingEvents(upcoming);
    } catch (error) {
        console.error('Failed to load upcoming events:', error);
        document.getElementById('upcoming-events-list').innerHTML = '<p>Failed to load upcoming events.</p>';
    }
}

function renderUpcomingEvents(events) {
    const container = document.getElementById('upcoming-events-list');
    if (events.length === 0) {
        container.innerHTML = '<p>No upcoming events.</p>';
        return;
    }
    container.innerHTML = events.map(event => {
        const startDate = new Date(event.starts_at).toLocaleDateString();
        const type = event.ends_at ? 'camps' : 'short-events';
        return `
            <div class="upcoming-event-card">
                <h3>${event.title_en || event.title}</h3>
                <p class="event-date">${startDate}</p>
                <p>${event.location}</p>
                <a href="#" class="see-more-btn" onclick="viewEvent('${type}', '${event.id}')">See More</a>
            </div>
        `;
    }).join('');
}

async function viewEvent(type, id) {
    try {
        const res = await apiRequest(`${CALENDER_API_URL}/getByID`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ calender_entry_id: id })
        });
        const data = await res.json();
        const event = data.calender_entry;
        if (!event) return;
        const prefill = await mapCalendarEntryToDashboardEvent(event);
        navigateTo(type);
        setTimeout(() => showForm(type, prefill), 100);
    } catch (error) {
        console.error('Failed to fetch event:', error);
        showDashboardMessage('Failed to load event details');
    }
}

