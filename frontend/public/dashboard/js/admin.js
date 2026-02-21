// Data storage
let shortEvents = JSON.parse(localStorage.getItem('shortEvents')) || [];
let campsEvents = JSON.parse(localStorage.getItem('campsEvents')) || [];

// Delete confirmation state
let pendingDelete = {
    type: null,
    id: null
};

let detailsContext = {
    type: null,
    id: null
};

const AUTH_VERIFY_URL = `${window.location.protocol}//${window.location.hostname}:8000/api/v1/auth/verify`;

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
    renderContent();
    updateCounts();
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
    let modalId;
    if (type === 'short-events') {
        modalId = 'short-events-form-modal';
    } else if (type === 'camps') {
        modalId = 'camps-form-modal';
    }
    
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeForm(type) {
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
}

// Handle Short Event Form Submission
function handleShortEventSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(document.getElementById('shortEventForm'));
    const eventImageFiles = document.getElementById('eventImage').files;
    const images = [];
    
    // Convert images to base64 for storage
    const processImages = async () => {
        for (let file of eventImageFiles) {
            const reader = new FileReader();
            const promise = new Promise((resolve) => {
                reader.onload = (e) => {
                    images.push(e.target.result);
                    resolve();
                };
                reader.readAsDataURL(file);
            });
            await promise;
        }
        
        return {
            id: Date.now(),
            title: formData.get('title'),
            description: formData.get('description'),
            date: formData.get('date'),
            place: formData.get('place'),
            price: formData.get('price'),
            duration: formData.get('duration'),
            persons: formData.get('persons'),
            tag: formData.get('tag'),
            responsibility: formData.get('responsibility'),
            images: images,
            createdAt: new Date().toISOString()
        };
    };
    
    if (eventImageFiles.length > 0) {
        processImages().then(eventData => {
            shortEvents.push(eventData);
            localStorage.setItem('shortEvents', JSON.stringify(shortEvents));
            closeForm('short-events');
            renderShortEvents();
            updateCounts();
        });
    } else {
        const eventData = {
            id: Date.now(),
            title: formData.get('title'),
            description: formData.get('description'),
            date: formData.get('date'),
            place: formData.get('place'),
            price: formData.get('price'),
            duration: formData.get('duration'),
            persons: formData.get('persons'),
            tag: formData.get('tag'),
            responsibility: formData.get('responsibility'),
            images: [],
            createdAt: new Date().toISOString()
        };
        
        shortEvents.push(eventData);
        localStorage.setItem('shortEvents', JSON.stringify(shortEvents));
        closeForm('short-events');
        renderShortEvents();
        updateCounts();
    }
}

// Handle Calendar Event Form Submission
function handleCampsEventSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(document.getElementById('campsEventForm'));
    const eventImageFiles = document.getElementById('campImage').files;
    const images = [];
    
    // Convert images to base64 for storage
    const processImages = async () => {
        for (let file of eventImageFiles) {
            const reader = new FileReader();
            const promise = new Promise((resolve) => {
                reader.onload = (e) => {
                    images.push(e.target.result);
                    resolve();
                };
                reader.readAsDataURL(file);
            });
            await promise;
        }
        
        return {
            id: Date.now(),
            title: formData.get('title'),
            description: formData.get('description'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            place: formData.get('place'),
            price: formData.get('price'),
            capacity: formData.get('capacity'),
            tag: formData.get('tag'),
            images: images,
            createdAt: new Date().toISOString()
        };
    };
    
    if (eventImageFiles.length > 0) {
        processImages().then(eventData => {
            campsEvents.push(eventData);
            localStorage.setItem('campsEvents', JSON.stringify(campsEvents));
            closeForm('camps');
            renderCampsEvents();
            updateCounts();
        });
    } else {
        const eventData = {
            id: Date.now(),
            title: formData.get('title'),
            description: formData.get('description'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            place: formData.get('place'),
            price: formData.get('price'),
            capacity: formData.get('capacity'),
            tag: formData.get('tag'),
            images: [],
            createdAt: new Date().toISOString()
        };
        
        campsEvents.push(eventData);
        localStorage.setItem('campsEvents', JSON.stringify(campsEvents));
        closeForm('camps');
        renderCampsEvents();
        updateCounts();
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
            ${event.images && event.images.length > 0 ? `<img src="${event.images[0]}" alt="${event.title}" class="event-image">` : '<div class="event-image"></div>'}
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
                    <button class="details-btn" onclick="openClientsDetails('short-events', ${event.id})">
                        <i class="fas fa-users"></i> See details
                    </button>
                    <button class="delete-btn" onclick="deleteShortEvent(${event.id})">
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
            ${event.images && event.images.length > 0 ? `<img src="${event.images[0]}" alt="${event.title}" class="event-image">` : '<div class="event-image"></div>'}
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
                    <button class="details-btn" onclick="openClientsDetails('camps', ${event.id})">
                        <i class="fas fa-users"></i> See details
                    </button>
                    <button class="delete-btn" onclick="deleteCampsEvent(${event.id})">
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

function confirmDelete() {
    if (!pendingDelete.type || !pendingDelete.id) return;
    
    if (pendingDelete.type === 'short-events') {
        shortEvents = shortEvents.filter(event => event.id !== pendingDelete.id);
        localStorage.setItem('shortEvents', JSON.stringify(shortEvents));
        renderShortEvents();
    } else if (pendingDelete.type === 'camps') {
        campsEvents = campsEvents.filter(event => event.id !== pendingDelete.id);
        localStorage.setItem('campsEvents', JSON.stringify(campsEvents));
        renderCampsEvents();
    }
    
    cancelDelete();
    updateCounts();
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
                closeClientsDetails();
            }
        });
    }
}

function renderContent() {
    updateCounts();
    renderShortEvents();
    renderCampsEvents();
}

function openClientsDetails(type, id) {
    const modal = document.getElementById('clientsDetailsModal');
    const title = document.getElementById('clientsDetailsTitle');
    const tableHead = document.getElementById('clientsTableHeadRow');
    const tableBody = document.getElementById('clientsTableBody');
    const selectedItem = type === 'short-events'
        ? shortEvents.find(event => event.id === id)
        : campsEvents.find(event => event.id === id);

    if (!modal || !title || !tableHead || !tableBody || !selectedItem) return;

    detailsContext.type = type;
    detailsContext.id = id;
    title.textContent = `${selectedItem.title} - Clients Details`;

    const schema = getDetailsSchema(type);
    const clients = getMockClientsForItem(type, id, selectedItem.title);

    tableHead.innerHTML = schema.map(field => `<th data-col="${field.key}">${field.label}</th>`).join('');

    tableBody.innerHTML = clients.map((client, index) => `
        <tr>
            ${schema.map(field => renderClientCell(field, client, index)).join('')}
        </tr>
    `).join('');

    modal.classList.add('active');
}

function closeClientsDetails() {
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
}

function saveClientsDetails() {
    if (!detailsContext.type || !detailsContext.id) return;

    const rows = Array.from(document.querySelectorAll('#clientsTableBody tr'));
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                void input.checked;
            } else {
                void input.value;
            }
        });
    });

    closeClientsDetails();
}

function getDetailsSchema(type) {
    if (type === 'camps') {
        return [
            { key: 'camp', label: 'Select Camp', inputType: 'text' },
            { key: 'firstName', label: 'First Name', inputType: 'text' },
            { key: 'lastName', label: 'Last Name', inputType: 'text' },
            { key: 'dob', label: 'Date of Birth', inputType: 'date' },
            { key: 'phone', label: 'Phone', inputType: 'text' },
            { key: 'email', label: 'Email', inputType: 'email' },
            { key: 'paid', label: 'Paid', inputType: 'checkbox' },
            { key: 'comment', label: 'Comment', inputType: 'textarea' }
        ];
    }

    return [
        { key: 'firstName', label: 'First Name', inputType: 'text' },
        { key: 'lastName', label: 'Last Name', inputType: 'text' },
        { key: 'phone', label: 'Phone', inputType: 'text' },
        { key: 'email', label: 'Email', inputType: 'email' },
        { key: 'age', label: 'Age', inputType: 'number' },
        { key: 'paid', label: 'Paid', inputType: 'checkbox' },
        { key: 'comment', label: 'Comment', inputType: 'textarea' }
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

function getMockClientsForItem(type, id, itemTitle) {
    const baseSeed = Number(String(id).slice(-3)) || 1;
    const day = String((baseSeed % 28) + 1).padStart(2, '0');
    const month = String(((baseSeed + 3) % 12) + 1).padStart(2, '0');

    if (type === 'camps') {
        return [
            {
                camp: itemTitle || 'Camp Program',
                firstName: `Client C${baseSeed}`,
                lastName: 'Example',
                dob: `2013-${month}-${day}`,
                phone: '+389 70 111 111',
                email: `clientc${baseSeed}@mail.com`,
                paid: false,
                comment: ''
            },
            {
                camp: itemTitle || 'Camp Program',
                firstName: `Client C${baseSeed + 1}`,
                lastName: 'Sample',
                dob: `2012-${month}-${day}`,
                phone: '+389 70 222 222',
                email: `clientc${baseSeed + 1}@mail.com`,
                paid: true,
                comment: 'Paid at desk'
            }
        ];
    }

    return [
        {
            firstName: `Client E${baseSeed}`,
            lastName: 'Example',
            phone: '+389 70 111 111',
            email: `cliente${baseSeed}@mail.com`,
            age: 10,
            paid: false,
            comment: ''
        },
        {
            firstName: `Client E${baseSeed + 1}`,
            lastName: 'Sample',
            phone: '+389 70 222 222',
            email: `cliente${baseSeed + 1}@mail.com`,
            age: 11,
            paid: true,
            comment: 'Paid at desk'
        }
    ];
}

