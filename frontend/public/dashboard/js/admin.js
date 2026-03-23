// Data storage
let shortEvents = [];
let campsEvents = [];

// Delete confirmation state
let pendingDelete = {
    type: null,
    id: null
};

let detailsContext = {
    type: null,
    id: null,
	clients: [],
    snapshot: ''
};

let eventEditContext = {
    type: null,
    id: null,
    isEditing: false,
    snapshot: '',
    originalData: null
};

const AUTH_VERIFY_URL = `${window.location.protocol}//${window.location.hostname}:8000/api/v1/auth/verify`;
const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:8000/api/v1`;
const CALENDER_API_URL = `${API_BASE_URL}/calender`;
const FILE_API_URL = `${API_BASE_URL}/file`;
const CLIENT_API_URL = `${API_BASE_URL}/client`;
const EVENT_LINKS_API_URL = `${API_BASE_URL}/event-links`;

let eventLinksContext = {
    eventId: null,
    links: [],
    newLinkCount: 0
};

function getAuthToken() {
    return localStorage.getItem('authToken') || '';
}

function showDashboardMessage(message, type = 'error') {
    const prefix = type === 'success' ? '✅' : '⚠️';
    console.log(`${prefix} ${message}`);
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
        const errorText = await response.text();
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
        title: entry.title_en || entry.title_de || entry.title_ru || '',
        title_en: entry.title_en || '',
        title_de: entry.title_de || '',
        title_ru: entry.title_ru || '',
        description: entry.description_en || entry.description_de || entry.description_ru || '',
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

    return true;
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const isAllowed = await enforceAuthGuard();
    if (!isAllowed) {
        return;
    }

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
    }
}

// Form Management
function showForm(type) {
    openEventForm(type, null);
}

function openEventForm(type, eventData) {
    eventEditContext.type = type;
    eventEditContext.id = eventData?.id || null;
    eventEditContext.isEditing = !!eventData;
    eventEditContext.originalData = eventData || null;

    const isShort = type === 'short-events';
    const modalId = isShort ? 'short-events-form-modal' : 'camps-form-modal';
    const formId = isShort ? 'shortEventForm' : 'campsEventForm';
    const headerText = isShort ? document.getElementById('shortEventFormHeader') : document.getElementById('campFormHeader');
    const submitButton = isShort ? document.getElementById('shortEventFormSubmit') : document.getElementById('campsEventFormSubmit');

    if (headerText) {
        headerText.textContent = eventEditContext.isEditing ? `Edit ${isShort ? 'Short Event' : 'Camp'}` : `Create ${isShort ? 'Short Event' : 'Camp'}`;
    }

    if (submitButton) {
        submitButton.textContent = eventEditContext.isEditing ? 'Save Changes' : (isShort ? 'Create Event' : 'Create Camp');
    }

    if (!eventEditContext.isEditing) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    } else if (eventData) {
        populateEventForm(type, eventData);
    }

    eventEditContext.snapshot = buildEventFormSnapshot(type);

    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function populateEventForm(type, eventData) {
    if (!eventData) return;

    if (type === 'short-events') {
        document.getElementById('eventTitleEn').value = eventData.title_en || eventData.title || '';
        document.getElementById('eventTitleDe').value = eventData.title_de || '';
        document.getElementById('eventTitleRu').value = eventData.title_ru || '';
        document.getElementById('eventDate').value = eventData.date || eventData.startDate || '';
        document.getElementById('eventPlace').value = eventData.place || '';
        document.getElementById('eventPrice').value = eventData.price || '';
        document.getElementById('eventDuration').value = eventData.duration || '';
        document.getElementById('eventPersons').value = eventData.persons || '';
        document.getElementById('eventTag').value = eventData.tag || '';
        document.getElementById('eventResponsibility').value = eventData.responsibility || '';
        document.getElementById('eventDescriptionEn').value = eventData.description_en || eventData.description || '';
        document.getElementById('eventDescriptionDe').value = eventData.description_de || '';
        document.getElementById('eventDescriptionRu').value = eventData.description_ru || '';
    } else {
        document.getElementById('campTitleEn').value = eventData.title_en || eventData.title || '';
        document.getElementById('campTitleDe').value = eventData.title_de || '';
        document.getElementById('campTitleRu').value = eventData.title_ru || '';
        document.getElementById('campStartDate').value = eventData.startDate || '';
        document.getElementById('campEndDate').value = eventData.endDate || '';
        document.getElementById('campLocation').value = eventData.place || '';
        document.getElementById('campPrice').value = eventData.price || '';
        document.getElementById('campCapacity').value = eventData.capacity || '';
        document.getElementById('campTag').value = eventData.tag || '';
        document.getElementById('campDescriptionEn').value = eventData.description_en || eventData.description || '';
        document.getElementById('campDescriptionDe').value = eventData.description_de || '';
        document.getElementById('campDescriptionRu').value = eventData.description_ru || '';
    }

    // Load event links if editing
    if (eventData.id) {
        loadEventLinks(eventData.id, type);
    }
}

function isFormEventType(type) {
    return type === 'short-events' || type === 'camps';
}

function buildEventFormSnapshot(type) {
    if (type !== eventEditContext.type) return '';

    if (type === 'short-events') {
        return JSON.stringify({
            title_en: document.getElementById('eventTitleEn')?.value || '',
            title_de: document.getElementById('eventTitleDe')?.value || '',
            title_ru: document.getElementById('eventTitleRu')?.value || '',
            date: document.getElementById('eventDate')?.value || '',
            place: document.getElementById('eventPlace')?.value || '',
            price: document.getElementById('eventPrice')?.value || '',
            duration: document.getElementById('eventDuration')?.value || '',
            persons: document.getElementById('eventPersons')?.value || '',
            tag: document.getElementById('eventTag')?.value || '',
            responsibility: document.getElementById('eventResponsibility')?.value || '',
            description_en: document.getElementById('eventDescriptionEn')?.value || '',
            description_de: document.getElementById('eventDescriptionDe')?.value || '',
            description_ru: document.getElementById('eventDescriptionRu')?.value || ''
        });
    }

    return JSON.stringify({
        title_en: document.getElementById('campTitleEn')?.value || '',
        title_de: document.getElementById('campTitleDe')?.value || '',
        title_ru: document.getElementById('campTitleRu')?.value || '',
        startDate: document.getElementById('campStartDate')?.value || '',
        endDate: document.getElementById('campEndDate')?.value || '',
        place: document.getElementById('campLocation')?.value || '',
        price: document.getElementById('campPrice')?.value || '',
        capacity: document.getElementById('campCapacity')?.value || '',
        tag: document.getElementById('campTag')?.value || '',
        description_en: document.getElementById('campDescriptionEn')?.value || '',
        description_de: document.getElementById('campDescriptionDe')?.value || '',
        description_ru: document.getElementById('campDescriptionRu')?.value || ''
    });
}

function hasUnsavedEventChanges() {
    if (!isFormEventType(eventEditContext.type)) {
        return false;
    }
    if (!eventEditContext.snapshot) {
        return false;
    }
    return buildEventFormSnapshot(eventEditContext.type) !== eventEditContext.snapshot;
}

function openUnsavedEventModal() {
    const unsavedModal = document.getElementById('unsavedEventModal');
    if (unsavedModal) {
        unsavedModal.classList.add('active');
    }
}

function closeUnsavedEventModal() {
    const unsavedModal = document.getElementById('unsavedEventModal');
    if (unsavedModal) {
        unsavedModal.classList.remove('active');
    }
}

async function saveAndCloseEventModal() {
    closeUnsavedEventModal();
    await saveEventDetails();
}

function discardEventChangesAndClose() {
    closeUnsavedEventModal();
    closeForm(eventEditContext.type, true);
}

async function saveEventDetails() {
    if (eventEditContext.type === 'short-events') {
        await handleShortEventSubmit({ preventDefault: () => {} });
    } else if (eventEditContext.type === 'camps') {
        await handleCampsEventSubmit({ preventDefault: () => {} });
    }
}


function closeForm(type, force = false) {
    if (!force && hasUnsavedEventChanges()) {
        openUnsavedEventModal();
        return;
    }

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
    }
    
    if (form) {
        form.reset();
        const previewContainer = document.getElementById(previewContainerId);
        const previewText = document.getElementById(previewTextId);
        
        if (previewContainer) {
            previewContainer.innerHTML = '';
        }
        if (previewText) previewText.style.display = 'block';
        
        // Reset file input
        const fileInput = document.getElementById(fileInputId);
        if (fileInput) fileInput.value = '';
    }

    if (eventEditContext.type === type) {
        eventEditContext.type = null;
        eventEditContext.id = null;
        eventEditContext.isEditing = false;
        eventEditContext.snapshot = '';
        eventEditContext.originalData = null;
    }
}


// Handle Short Event Form Submission
async function handleShortEventSubmit(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('shortEventForm'));
    const imageFiles = Array.from(document.getElementById('eventImage').files || []);

    const calenderEntry = {
        id: eventEditContext.id,
        location: formData.get('place'),
        price: String(formData.get('price') || '').trim(),
        tag: formData.get('tag'),
        image_ids: eventEditContext.originalData?.imageIDs || [],
        amount: String(formData.get('persons') || '').trim(),
        title_en: formData.get('title_en'),
        title_de: formData.get('title_de'),
        title_ru: formData.get('title_ru'),
        description_en: formData.get('description_en'),
        description_de: formData.get('description_de'),
        description_ru: formData.get('description_ru'),
        responsibility: formData.get('responsibility'),
        starts_at: parseDateToISO(formData.get('date')),
        ends_at: null,
        duration: formData.get('duration')
    };

    try {
        if (eventEditContext.isEditing && eventEditContext.type === 'short-events' && eventEditContext.id) {
            await apiRequest(`${CALENDER_API_URL}/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ calender_entry: calenderEntry })
            });

            if (imageFiles.length > 0) {
                const imageIDs = await uploadImagesForEntry(eventEditContext.id, imageFiles);
                await apiRequest(`${CALENDER_API_URL}/update-images`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        calender_entry_id: eventEditContext.id,
                        image_ids: imageIDs
                    })
                });
            }

            // Save event links
            await saveEventLinks();

            closeForm('short-events', true);
            await reloadDashboardData();
            showDashboardMessage('Short event updated successfully', 'success');
            return;
        }

        const createResponse = await apiRequest(`${CALENDER_API_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ calender_entry: calenderEntry })
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

        // Save event links
        eventLinksContext.eventId = calenderEntryID;
        await saveEventLinks();

        closeForm('short-events', true);
        await reloadDashboardData();
        showDashboardMessage('Short event created successfully', 'success');
    } catch (error) {
        showDashboardMessage(error.message || (eventEditContext.isEditing ? 'Failed to update short event' : 'Failed to create short event'));
    }
}

// Handle Calendar Event Form Submission
async function handleCampsEventSubmit(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('campsEventForm'));
    const imageFiles = Array.from(document.getElementById('campImage').files || []);

    const calenderEntry = {
        id: eventEditContext.id,
        location: formData.get('place'),
        price: String(formData.get('price') || '').trim(),
        tag: formData.get('tag'),
        image_ids: eventEditContext.originalData?.imageIDs || [],
        amount: String(formData.get('capacity') || '').trim(),
        title_en: formData.get('title_en'),
        title_de: formData.get('title_de'),
        title_ru: formData.get('title_ru'),
        description_en: formData.get('description_en'),
        description_de: formData.get('description_de'),
        description_ru: formData.get('description_ru'),
        responsibility: null,
        starts_at: parseDateToISO(formData.get('startDate')),
        ends_at: parseDateToISO(formData.get('endDate')),
        duration: null
    };

    try {
        if (eventEditContext.isEditing && eventEditContext.type === 'camps' && eventEditContext.id) {
            await apiRequest(`${CALENDER_API_URL}/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ calender_entry: calenderEntry })
            });

            if (imageFiles.length > 0) {
                const imageIDs = await uploadImagesForEntry(eventEditContext.id, imageFiles);
                await apiRequest(`${CALENDER_API_URL}/update-images`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        calender_entry_id: eventEditContext.id,
                        image_ids: imageIDs
                    })
                });
            }

            // Save event links
            await saveEventLinks();

            closeForm('camps', true);
            await reloadDashboardData();
            showDashboardMessage('Camp updated successfully', 'success');
            return;
        }

        const createResponse = await apiRequest(`${CALENDER_API_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ calender_entry: calenderEntry })
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

        // Save event links
        eventLinksContext.eventId = calenderEntryID;
        await saveEventLinks();

        closeForm('camps', true);
        await reloadDashboardData();
        showDashboardMessage('Camp created successfully', 'success');
    } catch (error) {
        showDashboardMessage(error.message || (eventEditContext.isEditing ? 'Failed to update camp' : 'Failed to create camp'));
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
                <div class="event-actions">
                    <button class="edit-btn" onclick="editEvent('short-events', '${event.id}')">
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
                <div class="event-actions">
                    <button class="edit-btn" onclick="editEvent('camps', '${event.id}')">
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
        await apiRequest(`${CALENDER_API_URL}/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                calender_entry_id: pendingDelete.id
            })
        });

        cancelDelete();
        await reloadDashboardData();
        showDashboardMessage('Deleted successfully', 'success');
    } catch (error) {
        showDashboardMessage(error.message || 'Failed to delete entry');
    }
}

// Update Counts
function updateCounts() {
    document.getElementById('short-events-count').textContent = shortEvents.length;
    document.getElementById('camps-count').textContent = campsEvents.length;
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
}

function renderContent() {
    updateCounts();
    renderShortEvents();
    renderCampsEvents();
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
        paid: Boolean(apiClient.paid)
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

function getEventById(type, id) {
    if (type === 'short-events') {
        return shortEvents.find(e => e.id === id);
    }
    return campsEvents.find(e => e.id === id);
}

function editEvent(type, id) {
    const eventData = getEventById(type, id);
    if (!eventData) {
        showDashboardMessage('Event not found for editing');
        return;
    }
    openEventForm(type, eventData);
}

function openEventDetailPage(type, id) {
    window.location.href = `event-detail.html?type=${type}&id=${id}`;
}

async function loadEventLinks(eventId, formType = 'short-events') {
    try {
        const response = await apiRequest(`${EVENT_LINKS_API_URL}/get`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ calender_entry_id: eventId })
        });

        const data = await response.json();
        eventLinksContext.eventId = eventId;
        eventLinksContext.links = data?.links || [];
        eventLinksContext.newLinkCount = 0;

        displayEventLinksInForm(formType);
    } catch (error) {
        showDashboardMessage('Failed to load event links');
    }
}

function displayEventLinksInForm(formType = 'short-events') {
    const tableId = formType === 'camps' ? 'campLinksTableBody' : 'eventLinksTableBody';
    const container = document.getElementById(tableId);
    if (!container) return;

    container.innerHTML = eventLinksContext.links.map((link, index) => `
        <tr data-link-id="${link.id}">
            <td><input type="text" placeholder="Title (EN)" value="${link.title_en}" class="link-title-en"></td>
            <td><input type="text" placeholder="Title (DE)" value="${link.title_de}" class="link-title-de"></td>
            <td><input type="text" placeholder="Title (RU)" value="${link.title_ru}" class="link-title-ru"></td>
            <td><input type="url" placeholder="https://..." value="${link.url}" class="link-url"></td>
            <td><button type="button" class="btn-sm-delete" onclick="removeEventLinkRow(${index}, '${formType}')">
                <i class="fas fa-trash"></i>
            </button></td>
        </tr>
    `).join('');
}

function addEventLinkRow(formType = 'short-events') {
    eventLinksContext.links.push({
        id: 'new-' + (++eventLinksContext.newLinkCount),
        title_en: '',
        title_de: '',
        title_ru: '',
        url: ''
    });
    displayEventLinksInForm(formType);
}

function removeEventLinkRow(index, formType = 'short-events') {
    eventLinksContext.links.splice(index, 1);
    displayEventLinksInForm(formType);
}

async function saveEventLinks() {
    if (!eventLinksContext.eventId) return;

    try {
        for (const link of eventLinksContext.links) {
            const titleEn = document.querySelector(`[data-link-id="${link.id}"] .link-title-en`)?.value || '';
            const titleDe = document.querySelector(`[data-link-id="${link.id}"] .link-title-de`)?.value || '';
            const titleRu = document.querySelector(`[data-link-id="${link.id}"] .link-title-ru`)?.value || '';
            const url = document.querySelector(`[data-link-id="${link.id}"] .link-url`)?.value || '';

            if (!titleEn || !url) continue;

            if (link.id.startsWith('new-')) {
                await apiRequest(`${EVENT_LINKS_API_URL}/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        link: {
                            calender_entry_id: eventLinksContext.eventId,
                            title_en: titleEn,
                            title_de: titleDe,
                            title_ru: titleRu,
                            url: url,
                            link_order: eventLinksContext.links.indexOf(link)
                        }
                    })
                });
            } else {
                await apiRequest(`${EVENT_LINKS_API_URL}/update`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        link: {
                            id: link.id,
                            title_en: titleEn,
                            title_de: titleDe,
                            title_ru: titleRu,
                            url: url,
                            link_order: eventLinksContext.links.indexOf(link)
                        }
                    })
                });
            }
        }
        showDashboardMessage('Event links saved successfully', 'success');
    } catch (error) {
        showDashboardMessage('Failed to save event links');
    }
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
        { key: 'firstName', label: 'First Name', inputType: 'text' },
        { key: 'lastName', label: 'Last Name', inputType: 'text' },
        { key: 'birthday', label: 'Date of Birth', inputType: 'date' },
        { key: 'phone', label: 'Phone', inputType: 'text' },
        { key: 'email', label: 'Email', inputType: 'email' },
        { key: 'age', label: 'Age', inputType: 'number' },
        { key: 'paid', label: 'Paid', inputType: 'checkbox' }
    ];
}

function renderClientCell(field, client, index) {
    const value = client[field.key] ?? '';

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

