
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const subject = this.querySelectorAll('input[type="text"]')[1]?.value || '';
        const message = this.querySelector('textarea').value;

        if (!name || !email || !message) {
            alert('Please fill in all required fields');
            return;
        }

        alert('Thank you for your message! We will get back to you soon.');

        this.reset();

        const btn = this.querySelector('.submit_btn');
        const originalText = btn.textContent;
        btn.textContent = 'Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = 'linear-gradient(135deg, rgb(24, 37, 110), rgb(41, 128, 225))';
        }, 2000);
    });
}

const links = document.querySelectorAll('a[href="#"]');
links.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
    });
});
