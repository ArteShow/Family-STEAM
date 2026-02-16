const monthYear = document.getElementById("monthYear")
const calendarBody = document.getElementById("calendarBody")
const prevMonth = document.getElementById("prevMonth")
const nextMonth = document.getElementById("nextMonth")
const todayBtn = document.getElementById("todayBtn")
const eventsCard = document.getElementById("eventsCard")
const eventDate = document.getElementById("eventDate")
const eventsList = document.getElementById("eventsList")
const closeBtn = document.getElementById("closeBtn")

let currentDate = new Date()

// Multi-day events (camps) and single-day events
const multiDayEvents = [
	{
		id: 1,
		title: 'Summer STEAM Academy',
		startDate: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000),
		endDate: new Date(new Date().getTime() + 17 * 24 * 60 * 60 * 1000),
		type: 'camp',
		time: 'All day'
	},
	{
		id: 2,
		title: 'Winter Art & Design Camp',
		startDate: new Date(new Date().getTime() + 45 * 24 * 60 * 60 * 1000),
		endDate: new Date(new Date().getTime() + 52 * 24 * 60 * 60 * 1000),
		type: 'camp',
		time: 'All day'
	},
	{
		id: 3,
		title: 'Robotics Challenge Camp',
		startDate: new Date(new Date().getTime() + 20 * 24 * 60 * 60 * 1000),
		endDate: new Date(new Date().getTime() + 27 * 24 * 60 * 60 * 1000),
		type: 'camp',
		time: 'All day'
	}
]

const sampleEvents = {
    "1": [
        { title: "Kids Coding Workshop", time: "10:00 AM", type: "event" },
        { title: "Art & Craft Session", time: "2:00 PM", type: "event" }
    ],
    "5": [
        { title: "Robot Building Class", time: "3:00 PM", type: "camp" }
    ],
    "10": [
        { title: "Science Experiment Day", time: "11:00 AM", type: "event" },
        { title: "Movie Night - Animation", time: "6:00 PM", type: "event" }
    ],
    "15": [
        { title: "Music Lessons", time: "4:00 PM", type: "camp" }
    ],
    "20": [
        { title: "Drama Workshop", time: "2:30 PM", type: "event" },
        { title: "Snack & Chat", time: "5:00 PM", type: "event" }
    ],
    "25": [
        { title: "Field Trip - Museum", time: "9:00 AM", type: "camp" }
    ]
}

// Get URL parameters
function getQueryParam(param) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param);
}

// Get all events for a specific day (including multi-day events)
function getEventsForDay(date) {
	const events = [];
	
	// Check single-day events
	const dayStr = date.getDate().toString();
	if (sampleEvents[dayStr]) {
		events.push(...sampleEvents[dayStr]);
	}
	
	// Check multi-day events
	multiDayEvents.forEach(event => {
		const eventStart = new Date(event.startDate);
		const eventEnd = new Date(event.endDate);
		eventStart.setHours(0, 0, 0, 0);
		eventEnd.setHours(0, 0, 0, 0);
		const checkDate = new Date(date);
		checkDate.setHours(0, 0, 0, 0);
		
		if (checkDate >= eventStart && checkDate <= eventEnd) {
			events.push(event);
		}
	});
	
	return events;
}

// Check if a day has any events
function hasDayEvents(date) {
	return getEventsForDay(date).length > 0;
}

function renderCalendar(date) {
    calendarBody.innerHTML = ""

    const year = date.getFullYear()
    const month = date.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const firstDayIndex = (firstDay.getDay() + 6) % 7
    const totalDays = lastDay.getDate()

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    monthYear.textContent = monthNames[month] + " " + year

    let row = document.createElement("tr")

    for (let i = 0; i < firstDayIndex; i++) {
        row.appendChild(document.createElement("td"))
    }

    for (let day = 1; day <= totalDays; day++) {
        const cell = document.createElement("td")
        let cellContent = `<div class="day-number">${day}</div>`

        const dayOfWeek = (new Date(year, month, day).getDay() + 6) % 7

        if (dayOfWeek >= 5) {
            cell.classList.add("weekend")
        }

        const today = new Date()
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            cell.classList.add("today")
        }

        // Get events for this day
        const dayDate = new Date(year, month, day);
        const dayEvents = getEventsForDay(dayDate);
        
        if (dayEvents.length > 0) {
            const eventTypes = new Set(dayEvents.map(e => e.type))
            
            cellContent += '<div class="event-tags">'
            if (eventTypes.has("event")) {
                cellContent += '<span class="tag event-tag">Event</span>'
            }
            if (eventTypes.has("camp")) {
                cellContent += '<span class="tag camp-tag">Camp</span>'
            }
            cellContent += '</div>'
        }

        cell.innerHTML = cellContent

        cell.addEventListener("click", () => {
            showEvents(day, month, year)
        })

        row.appendChild(cell)

        if ((firstDayIndex + day) % 7 === 0) {
            calendarBody.appendChild(row)
            row = document.createElement("tr")
        }
    }

    if (row.children.length > 0) {
        calendarBody.appendChild(row)
    }
}

prevMonth.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1)
    renderCalendar(currentDate)
})

nextMonth.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1)
    renderCalendar(currentDate)
})

todayBtn.addEventListener("click", () => {
    currentDate = new Date()
    renderCalendar(currentDate)
})

function showEvents(day, month, year) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const dateStr = `${monthNames[month]} ${day}, ${year}`
    eventDate.textContent = dateStr

    // Get events for this day
    const dayDate = new Date(year, month, day);
    const events = getEventsForDay(dayDate);
    
    eventsList.innerHTML = ""

    if (events.length === 0) {
        eventsList.innerHTML = '<p style="text-align: center; color: rgb(100, 100, 100);">No events planned for this day.</p>'
    } else {
        events.forEach((event, index) => {
            const eventItem = document.createElement("div")
            eventItem.className = "event-item"
            const tagClass = event.type === "camp" ? "camp-tag" : "event-tag"
            const tagText = event.type.charAt(0).toUpperCase() + event.type.slice(1)
            
            let eventDetails = `<h3>${event.title}</h3><p>${event.time}</p>`;
            
            // Show date range for multi-day events
			if (event.startDate && event.endDate) {
				const startStr = event.startDate.toLocaleDateString();
				const endStr = event.endDate.toLocaleDateString();
				eventDetails = `<h3>${event.title}</h3><p>${startStr} - ${endStr}</p>`;
			}
            
            eventItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        ${eventDetails}
                    </div>
                    <span class="tag ${tagClass}">${tagText}</span>
                </div>
            `
            eventsList.appendChild(eventItem)
        })
    }

    // Show the card with animation
    eventsCard.classList.remove("hidden")
    eventsCard.classList.add("show")

    // Scroll to the card
    eventsCard.scrollIntoView({ behavior: "smooth", block: "nearest" })
}

closeBtn.addEventListener("click", () => {
    eventsCard.classList.add("hidden")
    eventsCard.classList.remove("show")
})

// Handle query parameters from camps page
window.addEventListener('load', () => {
	const campId = getQueryParam('campId');
	const startDateParam = getQueryParam('startDate');
	const endDateParam = getQueryParam('endDate');
	
	if (campId && startDateParam) {
		// Parse the start date and navigate to that date
		const startDate = new Date(startDateParam);
		currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
		renderCalendar(currentDate);
		
		// Automatically show events for the camp's start date
		setTimeout(() => {
			showEvents(startDate.getDate(), startDate.getMonth(), startDate.getFullYear());
		}, 100);
	}
});

renderCalendar(currentDate)
