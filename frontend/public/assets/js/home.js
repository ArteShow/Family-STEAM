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

function generateIncomingEvents() {
    const incomingRoot = document.getElementById('incomingRoot');
    const incomingEvents = getIncomingEvents();

    if (incomingEvents.length === 0) {
        incomingRoot.innerHTML = '<p style="text-align: center; padding: 2rem; color: #40507a;">No upcoming events. Check back soon!</p>';
        return;
    }

    incomingRoot.innerHTML = incomingEvents.slice(0, 4).map((event, index) => {
        const eventDate = new Date(event.date);
        const dateParam = encodeURIComponent(eventDate.toISOString());
        const detailsLink = `assets/html/calender.html?date=${dateParam}`;
        const eventClass = 'incoming_event';

        return `
            <div class="${eventClass}" style="animation-delay: ${index * 0.1}s;">
                <div class="event_image_container">
                    <img src="assets/images/slider1.webp" alt="${event.title}">
                </div>
                <div class="incoming_event_details">
                    <h5>${event.title}</h5>
                    <p class="event_description">${event.shortDesc || event.description?.substring(0, 150) + '...'}</p>
                    <div class="event_footer single">
                        <a href="${detailsLink}" class="see_details_btn">See More Details</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', generateIncomingEvents);
} else {
    generateIncomingEvents();
} 