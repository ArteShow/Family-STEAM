// Shared API utility for all frontend pages
const API_BASE_URL = 'http://localhost:8000/api/v1';
const FILE_API_URL = `${API_BASE_URL}/file`;
const CALENDAR_API_URL = `${API_BASE_URL}/calender`;

// Generic API request with error handling
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
        const response = await fetch(url, mergedOptions);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Fetch all events from calendar service
async function fetchAllEvents() {
    try {
        const response = await apiRequest(`${CALENDAR_API_URL}/getAll`);
        return response.calender_entries || [];
    } catch (error) {
        console.error('Failed to fetch events:', error);
        return [];
    }
}

// Fetch single event by ID
async function fetchEventById(id) {
    try {
        const response = await apiRequest(`${CALENDAR_API_URL}/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ calender_entry_id: id })
        });
        return response.calender_entry;
    } catch (error) {
        console.error('Failed to fetch event:', error);
        return null;
    }
}

// Get upcoming events (next N days)
async function getUpcomingEvents(days = 30) {
    try {
        const allEvents = await fetchAllEvents();
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

        return allEvents.filter(event => {
            const startDate = new Date(event.starts_at || event.start_date);
            startDate.setHours(0, 0, 0, 0);
            return startDate >= now && startDate <= futureDate;
        }).sort((a, b) => new Date(a.starts_at || a.start_date) - new Date(b.starts_at || b.start_date));
    } catch (error) {
        console.error('Failed to get upcoming events:', error);
        return [];
    }
}

// Get image URLs for event
async function getEventImageUrls(imageIds = []) {
    if (!imageIds || imageIds.length === 0) {
        return [];
    }

    try {
        const results = await Promise.allSettled(
            imageIds.slice(0, 3).map(async (imageId) => {
                const response = await fetch(`${FILE_API_URL}/download`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ file_id: imageId })
                });

                if (!response.ok) {
                    throw new Error(`Image fetch failed: ${response.status}`);
                }

                const blob = await response.blob();
                return URL.createObjectURL(blob);
            })
        );

        return results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
    } catch (error) {
        console.error('Failed to get image URLs:', error);
        return [];
    }
}

// Format event data from backend to frontend structure
async function formatEventFromBackend(event) {
    const startDate = event.starts_at || event.start_date;
    const endDate = event.ends_at || event.end_date;
    const tag = event.tag || '';
    const tags = tag ? [tag] : [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationMs = end - start;
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
    const isCamp = tag.toLowerCase().includes('camp') || durationDays >= 2;
    const durationText = durationHours < 24
        ? `${durationHours}h`
        : `${Math.ceil(durationHours / 24)} days`;

    const imageUrls = await getEventImageUrls(event.image_ids);

    return {
        id: event.id,
        title: event.title,
        date: startDate,
        startDate,
        endDate,
        place: event.location || 'TBA',
        price: event.price ? `€${event.price}` : 'TBA',
        duration: durationText,
        persons: event.amount || 'All ages',
        capacity: event.amount || 'All ages',
        tag: tag || 'Event',
        tags,
        description: event.description || 'No description available',
        shortDesc: event.description
            ? event.description.substring(0, 150) + (event.description.length > 150 ? '...' : '')
            : 'No description available',
        images: imageUrls,
        registerUrl: isCamp
            ? `/forms/camp_register.html?eventId=${event.id}`
            : `/forms/event_register.html?eventId=${event.id}`,
        type: isCamp ? 'camp' : 'event',
        tag_names: tags
    };
}

// Get all events and format them
async function getAllFormattedEvents() {
    try {
        const events = await fetchAllEvents();
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // Filter out past events
        const futureEvents = events.filter(event => {
            const eventDate = new Date(event.starts_at || event.start_date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= now;
        });

        const formatted = await Promise.all(
            futureEvents.map(event => formatEventFromBackend(event))
        );

        return formatted.sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
        console.error('Failed to get all formatted events:', error);
        return [];
    }
}

// Get events filtered by tag
async function getEventsByTag(tag) {
    try {
        const events = await getAllFormattedEvents();
        return events.filter(event => event.tag_names && event.tag_names.includes(tag) && event.tag_names.length > 0);
    } catch (error) {
        console.error('Failed to filter events by tag:', error);
        return [];
    }
}

// Get all tags from events
async function getAllTags() {
    try {
        const events = await fetchAllEvents();
        const tagsSet = new Set();
        events.forEach(event => {
            // Backend sends 'tag' as a single string field
            if (event.tag) {
                tagsSet.add(event.tag);
            }
        });
        return Array.from(tagsSet).sort();
    } catch (error) {
        console.error('Failed to fetch tags:', error);
        return [];
    }
}

// Make API utilities available globally
window.apiUtils = {
    fetchAllEvents,
    fetchEventById,
    getUpcomingEvents,
    getEventImageUrls,
    formatEventFromBackend,
    getAllFormattedEvents,
    getEventsByTag,
    getAllTags,
    apiRequest
};
