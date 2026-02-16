const eventForm = document.getElementById("eventRegisterForm");

if (eventForm) {
    eventForm.addEventListener("submit", (event) => {
        event.preventDefault();
        window.location.href = "../index.html";
    });
}
