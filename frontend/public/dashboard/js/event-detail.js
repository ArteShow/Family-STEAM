const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:8000/api/v1`;
const CALENDER_API_URL = `${API_BASE_URL}/calender`;
const EVENT_LINKS_API_URL = `${API_BASE_URL}/event-links`;
const FILE_API_URL = `${API_BASE_URL}/file`;

let currentEvent = null;
let currentLanguage = localStorage.getItem('language') || 'en';

async function downloadImagePreview(fileId) {
    try {
        const response = await fetch(`${FILE_API_URL}/download`, {
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

async function loadEventDetail() {
    const params = new URLSearchParams(window.location.search);
    const eventType = params.get('type');
    const eventId = params.get('id');

    if (!eventType || !eventId) {
        document.body.innerHTML = '<p>Invalid event or ID</p>';
        return;
    }

    try {
        const response = await fetch(`${CALENDER_API_URL}/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ calender_entry_id: eventId })
        });

        const data = await response.json();
        currentEvent = data?.calender_entry;

        if (!currentEvent) {
            document.body.innerHTML = '<p>Event not found</p>';
            return;
        }

        displayEventDetail();
        await loadEventLinks(eventId);
    } catch (error) {
        console.error('Error loading event:', error);
        document.body.innerHTML = `<p>Error loading event: ${error.message}</p>`;
    }
}

function displayEventDetail() {
    const lang = currentLanguage;
    const title = currentEvent[`title_${lang}`] || currentEvent.title_en || '';
    const description = currentEvent[`description_${lang}`] || currentEvent.description_en || '';

    document.getElementById('eventTitle').textContent = title;
    document.getElementById('eventDescription').textContent = description;
    document.getElementById('eventLocation').textContent = currentEvent.location || '-';
    document.getElementById('eventPrice').textContent = currentEvent.price || '-';
    document.getElementById('eventTag').textContent = currentEvent.tag || '-';

    // Format dates
    if (currentEvent.starts_at && currentEvent.ends_at) {
        const startDate = new Date(currentEvent.starts_at).toLocaleDateString();
        const endDate = new Date(currentEvent.ends_at).toLocaleDateString();
        document.getElementById('eventDate').textContent = `${startDate} to ${endDate}`;
        document.getElementById('eventCapacity').textContent = currentEvent.amount || '-';
    } else if (currentEvent.starts_at) {
        const startDate = new Date(currentEvent.starts_at).toLocaleDateString();
        document.getElementById('eventDate').textContent = startDate;
        document.getElementById('eventCapacity').textContent = currentEvent.persons || '-';
    }

    // Display images
    displayImages();
}

async function displayImages() {
    const imageIds = currentEvent.image_ids || [];
    const sliderContainer = document.getElementById('eventImageSlider');

    if (imageIds.length === 0) {
        sliderContainer.innerHTML = '<div style="background: #e0e0e0; height: 300px; display: flex; align-items: center; justify-content: center;">No images available</div>';
        return;
    }

    const imageUrls = await Promise.all(
        imageIds.map(downloadImagePreview)
    );

    sliderContainer.innerHTML = imageUrls
        .filter(Boolean)
        .map(url => `<img src="${url}" alt="${currentEvent.title_en}" style="width: 100%; height: auto; display: block;">`)
        .join('');
}

async function loadEventLinks(eventId) {
    try {
        const response = await fetch(`${EVENT_LINKS_API_URL}/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ calender_entry_id: eventId })
        });

        const data = await response.json();
        const links = data?.links || [];

        if (links.length === 0) {
            document.getElementById('linksSection').style.display = 'none';
            return;
        }

        displayEventLinks(links);
    } catch (error) {
        console.error('Error loading event links:', error);
    }
}

function displayEventLinks(links) {
    const lang = currentLanguage;
    const tbody = document.getElementById('eventLinksTable');

    tbody.innerHTML = links.map(link => {
        const linkTitle = link[`title_${lang}`] || link.title_en || '';
        return `
            <tr>
                <td>${linkTitle}</td>
                <td><a href="${link.url}" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-external-link-alt"></i> Open Link
                </a></td>
            </tr>
        `;
    }).join('');

    document.getElementById('linksSection').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', loadEventDetail);
