// newsletter.js — Auto-wires all .newsletter_form elements to the subscribe endpoint.
(function () {
    const SUBSCRIBE_URL = `${window.location.origin}/api/v1/newsletter/subscribe`;

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.newsletter_form').forEach(function (form) {
            form.addEventListener('submit', async function (e) {
                e.preventDefault();

                const emailInput = form.querySelector('input[type="email"]');
                const submitBtn  = form.querySelector('button[type="submit"]');
                const email      = emailInput ? emailInput.value.trim() : '';

                if (!email) return;

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = '…';
                }

                try {
                    const res = await fetch(SUBSCRIBE_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });

                    if (res.ok) {
                        if (emailInput) emailInput.value = '';
                        if (submitBtn) submitBtn.textContent = 'Subscribed!';
                        setTimeout(function () {
                            if (submitBtn) {
                                submitBtn.disabled = false;
                                submitBtn.textContent = 'Subscribe';
                            }
                        }, 3000);
                    } else {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = 'Try again';
                        }
                    }
                } catch (_) {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Error';
                    }
                }
            });
        });
    });
})();
