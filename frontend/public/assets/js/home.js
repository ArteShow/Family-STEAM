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

setInterval(changeBackground, 5000); 