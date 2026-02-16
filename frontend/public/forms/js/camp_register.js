const campOptions = [
    "Creative Robotics Camp",
    "Art + Science Lab",
    "Eco Explorers",
    "Math Makers",
    "Coding for Kids",
    "Junior Inventors"
];

const campSelect = document.getElementById("campSelect");
const campForm = document.getElementById("campRegisterForm");

campOptions.forEach((camp) => {
    const option = document.createElement("option");
    option.value = camp;
    option.textContent = camp;
    campSelect.appendChild(option);
});

if (campForm) {
    campForm.addEventListener("submit", (event) => {
        event.preventDefault();
        window.location.href = "../index.html";
    });
}
