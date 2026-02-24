const images = [
    "assets/images/slider1.webp",
    "assets/images/slider2.jpg",
    "assets/images/slider3.jpg"
];

let index = 0;
const slider = document.querySelector(".background_slider");

function changeBackground() {
    slider.style.backgroundImage = `url(${images[index]})`;
    index = (index + 1) % images.length;
}

changeBackground(); 
setInterval(changeBackground, 5000); 

const faqItems = document.querySelectorAll(".faq_item");

faqItems.forEach(item => {
    const question = item.querySelector(".faq_question");
    
    question.addEventListener("click", () => {
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains("active")) {
                otherItem.classList.remove("active");
            }
        });
        
        item.classList.toggle("active");
    });
});

async function generateIncomingEvents() {
    const incomingRoot = document.getElementById('incomingRoot');
    
    try {
        // Fetch upcoming events from backend (next 30 days)
        const events = await window.apiUtils.getUpcomingEvents(30);

        if (events.length === 0) {
            incomingRoot.innerHTML = '<p style="text-align: center; padding: 2rem; color: #40507a;">No upcoming events. Check back soon!</p>';
            return;
        }

        // Format events for display
        const formattedEvents = await Promise.all(
            events.slice(0, 2).map(event => window.apiUtils.formatEventFromBackend(event))
        );
        
        // Keep all valid events even when images are missing
        const validEvents = formattedEvents.filter(event => !!event);

        if (validEvents.length === 0) {
            incomingRoot.innerHTML = '<p style="text-align: center; padding: 2rem; color: #40507a;">No upcoming events. Check back soon!</p>';
            return;
        }

        // Build HTML with events
        let html = validEvents.map((event, index) => {
            const imageUrl = (event.images && event.images.length > 0)
                ? event.images[0]
                : 'assets/images/slider1.webp';

            return `
                <div class="incoming_event" style="animation-delay: ${index * 0.1}s;">
                    <div class="event_image_container">
                        <img src="${imageUrl}" alt="${event.title}" onerror="this.src='assets/images/slider1.webp'">
                    </div>
                    <div class="incoming_event_details">
                        <h5>${event.title}</h5>
                        <p class="event_description">${event.shortDesc}</p>
                        <div class="event_footer single">
                            <a href="assets/html/calender.html" class="see_details_btn">See More Details</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add see-more button if there are more events
        if (events.length > 2) {
            html += `
                <div class="incoming_event" style="animation-delay: ${2 * 0.1}s;">
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 2rem; text-align: center; background: rgba(41, 128, 225, 0.08); border-radius: 1rem; border: 2px dashed rgb(41, 128, 225);">
                        <a href="assets/html/calender.html" class="see_details_btn" style="margin: 0;">See All Events →</a>
                    </div>
                </div>
            `;
        }

        incomingRoot.innerHTML = html;
    } catch (error) {
        console.error('Error loading events:', error);
        incomingRoot.innerHTML = '<p style="text-align: center; padding: 2rem; color: #ff6b6b;">Failed to load events</p>';
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', generateIncomingEvents);
} else {
    generateIncomingEvents();
} 