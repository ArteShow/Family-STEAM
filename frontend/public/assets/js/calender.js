const monthYear = document.getElementById("monthYear")
const calendarBody = document.getElementById("calendarBody")
const prevMonth = document.getElementById("prevMonth")
const nextMonth = document.getElementById("nextMonth")
const todayBtn = document.getElementById("todayBtn")
const eventsCard = document.getElementById("eventsCard")
const eventDate = document.getElementById("eventDate")
const eventsList = document.getElementById("eventsList")
const closeBtn = document.getElementById("closeBtn")
const tagFilter = document.getElementById("tagFilter")

let currentDate = new Date()
let allEvents = []
let filteredEvents = []
let selectedTag = ""

function isCampEvent(event) {
    const tag = (event.tag || '').toLowerCase()
    if (tag.includes('camp')) return true
    // Admin-created camps always have ends_at set
    if (event.ends_at) return true

    const start = new Date(event.starts_at || event.start_date)
    const endRaw = event.ends_at || event.end_date || event.starts_at || event.start_date
    const end = new Date(endRaw)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false

    const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return durationDays >= 2
}

function isSameDay(firstDate, secondDate) {
    return firstDate.getFullYear() === secondDate.getFullYear()
        && firstDate.getMonth() === secondDate.getMonth()
        && firstDate.getDate() === secondDate.getDate()
}

function isSameDayOnly(calendarDate, eventDateStr) {
    const eventDate = new Date(eventDateStr)
    return isSameDay(calendarDate, eventDate)
}

function isEventOnDay(event, checkDate) {
    const startDate = new Date(event.starts_at || event.start_date)
    const endDateRaw = event.ends_at || event.end_date || event.starts_at || event.start_date
    const endDate = new Date(endDateRaw)

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        return false
    }
    
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)
    const dayCheck = new Date(checkDate)
    dayCheck.setHours(0, 0, 0, 0)
    
    return dayCheck >= startDate && dayCheck <= endDate
}

function getEventsForDay(date) {
    const events = [];
    
    filteredEvents.forEach(event => {
        if (isEventOnDay(event, date)) {
            events.push(event)
        }
    })
    
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
            cellContent += '<div class="event-tags">'
            if (dayEvents.length === 1) {
                cellContent += '<span class="event-dot"></span>'
            } else {
                cellContent += `<span class="event-dot multiple">${dayEvents.length}</span>`
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
        eventsList.innerHTML = '<p style="text-align: center; color: #40507a; padding: 2rem;">No events planned for this day.</p>'
    } else {
        events.forEach((event) => {
            const eventItem = document.createElement("div")
            eventItem.className = "event-item"
            
            const startDate = new Date(event.starts_at || event.start_date)
            const endDateRaw = event.ends_at || event.end_date || event.starts_at || event.start_date
            const endDate = new Date(endDateRaw)
            const durationMs = endDate - startDate
            const durationHours = Math.ceil(durationMs / (1000 * 60 * 60))
            const normalizedDurationHours = durationHours > 0 ? durationHours : 1
            const durationText = normalizedDurationHours < 24 
                ? `${normalizedDurationHours}h` 
                : `${Math.ceil(durationHours / 24)} days`
            
            const tag = event.tag || 'Event'
            const isCamp = isCampEvent(event)
            const detailsLink = isCamp
                ? `./camps.html?eventId=${encodeURIComponent(event.id)}#camp-${encodeURIComponent(event.id)}`
                : `./short_events.html?eventId=${encodeURIComponent(event.id)}#event-${encodeURIComponent(event.id)}`
            
            const _calLang = localStorage.getItem('preferredLanguage') || 'en';
            const _calTitle = (['en','de','ru'].includes(_calLang) ? event[`title_${_calLang}`] : null) || event.title_en || event.title || '';
            const _calDesc  = (['en','de','ru'].includes(_calLang) ? event[`description_${_calLang}`] : null) || event.description_en || event.description || 'No description';
            const _calDescShort = _calDesc.length > 250 ? _calDesc.substring(0, 250) + '...' : _calDesc;

            eventItem.innerHTML = `
                <div class="event-card-content">
                    <div class="event-header">
                        <h3>${_calTitle}</h3>
                        <span class="event-tag">${tag}</span>
                    </div>
                    <p class="event-description">${_calDescShort}</p>
                </div>
                <button class="see_more_btn" onclick="window.location.href='${detailsLink}'">See Details</button>
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

async function initializeTags() {
    try {
        const tags = await window.apiUtils.getAllTags()
        tagFilter.innerHTML = '<option value="">All Events</option>'
        tags.forEach(tag => {
            const option = document.createElement('option')
            option.value = tag
            option.textContent = tag
            tagFilter.appendChild(option)
        })
    } catch (error) {
        console.error('Error loading tags:', error)
    }
}

tagFilter.addEventListener("change", async (e) => {
    selectedTag = e.target.value
    
    if (selectedTag === "") {
        filteredEvents = [...allEvents]
    } else {
        // Backend returns 'tag' as a single string field
        filteredEvents = allEvents.filter(event => 
            event.tag === selectedTag
        )
    }
    
    renderCalendar(currentDate)
})

async function loadEvents() {
    try {
        allEvents = await window.apiUtils.fetchAllEvents()
        
        filteredEvents = [...allEvents]
        
        await initializeTags()
        renderCalendar(currentDate)
    } catch (error) {
        console.error('Error loading events:', error)
        calendarBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #ff6b6b;">Failed to load events. Please refresh the page.</td></tr>'
    }
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

window.addEventListener('load', () => {
    loadEvents().then(() => {
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
});
