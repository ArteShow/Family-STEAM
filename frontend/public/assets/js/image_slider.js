const images = [
    "assets/images/slider1.jpg",
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