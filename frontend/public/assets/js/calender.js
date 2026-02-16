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

function isSameDay(firstDate, secondDate) {
    return firstDate.getFullYear() === secondDate.getFullYear()
        && firstDate.getMonth() === secondDate.getMonth()
        && firstDate.getDate() === secondDate.getDate()
}

const multiDayEvents = camps.map(camp => ({
    id: camp.id,
    title: camp.title,
    startDate: new Date(camp.startDate),
    endDate: new Date(camp.endDate),
    type: 'camp',
    time: 'All day'
}))

const singleDayEvents = shortEvents.map(event => ({
    id: event.id,
    title: event.title,
    date: new Date(event.date),
    type: 'event',
    time: event.time || event.duration || 'All day'
}))

function getQueryParam(param) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param);
}

function getEventsForDay(date) {
	const events = [];

    singleDayEvents.forEach(event => {
        if (isSameDay(event.date, date)) {
            events.push(event)
        }
    })

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
            
            let eventDetails = `<h3>${event.title}</h3><p>${event.time || 'All day'}</p>`;
            let seeMoreLink = "#";

			if (event.startDate && event.endDate) {
                const startStr = new Date(event.startDate).toLocaleDateString();
                const endStr = new Date(event.endDate).toLocaleDateString();
				eventDetails = `<h3>${event.title}</h3><p>${startStr} - ${endStr}</p>`;
				seeMoreLink = `camps.html#camp-${event.id}`;
			} else if (event.type === 'camp') {
				seeMoreLink = `camps.html#camp-${event.id}`;
			} else if (event.type === 'event') {
				seeMoreLink = `short_events.html#event-${event.id}`;
			}
            
            eventItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
                    <div style="flex-grow: 1;">
                        ${eventDetails}
                    </div>
                    <span class="tag ${tagClass}">${tagText}</span>
                </div>
                <a href="${seeMoreLink}" class="see_more_btn" style="margin-top: 1rem; display: inline-block;">See More</a>
            `
            eventsList.appendChild(eventItem)
        })
    }

    eventsCard.classList.remove("hidden")
    eventsCard.classList.add("show")

    eventsCard.scrollIntoView({ behavior: "smooth", block: "nearest" })
}

closeBtn.addEventListener("click", () => {
    eventsCard.classList.add("hidden")
    eventsCard.classList.remove("show")
})

window.addEventListener('load', () => {
    const dateParam = getQueryParam('date') || getQueryParam('startDate');
    if (!dateParam) return;

    const targetDate = new Date(dateParam);
    if (Number.isNaN(targetDate.getTime())) return;

    currentDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    renderCalendar(currentDate);

    setTimeout(() => {
        showEvents(targetDate.getDate(), targetDate.getMonth(), targetDate.getFullYear());
    }, 100);
});

renderCalendar(currentDate)
