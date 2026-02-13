const monthYear = document.getElementById("monthYear")
const calendarBody = document.getElementById("calendarBody")
const prevMonth = document.getElementById("prevMonth")
const nextMonth = document.getElementById("nextMonth")

let currentDate = new Date()

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

renderCalendar(currentDate)
