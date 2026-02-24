const eventForm = document.getElementById('eventRegisterForm');
const eventSelect = document.getElementById('eventSelect');
const CLIENT_CREATE_URL = `${window.location.protocol}//${window.location.hostname}:8000/api/v1/client/create`;

function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

function isCampEvent(event) {
    const tag = (event.tag || '').toLowerCase();
    if (tag.includes('camp')) return true;

    const start = new Date(event.starts_at || event.start_date);
    const end = new Date(event.ends_at || event.end_date);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;

    const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return durationDays >= 2;
}

async function populateEventOptions() {
    if (!eventSelect || !window.apiUtils) return;

    const selectedEventId = getQueryParam('eventId');

    try {
        const allEvents = await window.apiUtils.fetchAllEvents();
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const events = allEvents
            .filter(event => {
                const startDate = new Date(event.starts_at || event.start_date);
                startDate.setHours(0, 0, 0, 0);
                return startDate >= now && !isCampEvent(event);
            })
            .sort((a, b) => new Date(a.starts_at || a.start_date) - new Date(b.starts_at || b.start_date));

        if (events.length === 0) {
            eventSelect.innerHTML = '<option value="" disabled selected>No events available</option>';
            return;
        }

        eventSelect.innerHTML = '<option value="" disabled>Select an event</option>';

        events.forEach((eventItem) => {
            const startDate = new Date(eventItem.starts_at || eventItem.start_date);
            const formattedDate = Number.isNaN(startDate.getTime())
                ? ''
                : ` (${startDate.toLocaleDateString()})`;

            const option = document.createElement('option');
            option.value = String(eventItem.id);
            option.textContent = `${eventItem.title}${formattedDate}`;
            if (selectedEventId && String(eventItem.id) === String(selectedEventId)) {
                option.selected = true;
            }
            eventSelect.appendChild(option);
        });

        if (!selectedEventId) {
            eventSelect.selectedIndex = 0;
        }
    } catch (error) {
        console.error('Failed to load events:', error);
        eventSelect.innerHTML = '<option value="" disabled selected>Failed to load events</option>';
    }
}

populateEventOptions();

if (eventForm) {
    eventForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const eventId = eventSelect?.value || getQueryParam('eventId');
        if (!eventId) {
            alert('Please select an event.');
            return;
        }

        const firstName = document.getElementById('firstName')?.value?.trim() || '';
        const lastName = document.getElementById('lastName')?.value?.trim() || '';
        const email = document.getElementById('email')?.value?.trim() || '';
        const phone = document.getElementById('phone')?.value?.trim() || '';
        const ageValue = document.getElementById('age')?.value;
        const parsedAge = ageValue ? Number(ageValue) : null;

        try {
            const response = await fetch(CLIENT_CREATE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    client: {
                        calendar_id: eventId,
                        first_name: firstName,
                        last_name: lastName,
                        email,
                        phone,
                        paid: false,
                        birthday: null,
                        age: Number.isFinite(parsedAge) ? parsedAge : null
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Request failed with status ${response.status}`);
            }

            alert('Registration submitted successfully.');
            window.location.href = '../index.html';
        } catch (error) {
            alert(error.message || 'Failed to submit registration. Please try again.');
        }
    });
}
