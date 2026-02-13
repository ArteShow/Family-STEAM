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

// Sample events data
const sampleEvents = {
    "1": [
        { title: "Kids Coding Workshop", time: "10:00 AM" },
        { title: "Art & Craft Session", time: "2:00 PM" }
    ],
    "5": [
        { title: "Robot Building Class", time: "3:00 PM" }
    ],
    "10": [
        { title: "Science Experiment Day", time: "11:00 AM" },
        { title: "Movie Night - Animation", time: "6:00 PM" }
    ],
    "15": [
        { title: "Music Lessons", time: "4:00 PM" }
    ],
    "20": [
        { title: "Drama Workshop", time: "2:30 PM" },
        { title: "Snack & Chat", time: "5:00 PM" }
    ],
    "25": [
        { title: "Field Trip - Museum", time: "9:00 AM" }
    ]
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
        cell.textContent = day

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

        // Add click event to show events
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

    // Get events for this day or show "No events"
    const events = sampleEvents[day.toString()] || []
    
    eventsList.innerHTML = ""

    if (events.length === 0) {
        eventsList.innerHTML = '<p style="text-align: center; color: rgb(100, 100, 100);">No events planned for this day.</p>'
    } else {
        events.forEach((event, index) => {
            const eventItem = document.createElement("div")
            eventItem.className = "event-item"
            eventItem.innerHTML = `
                <h3>${event.title}</h3>
                <p>${event.time}</p>
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

renderCalendar(currentDate)
