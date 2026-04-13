const CLIENT_CREATE_URL = `${window.location.origin}/api/v1/client/create`;

// ── Load pending registration ─────────────────────────────────────────────────
function loadPending() {
    try {
        const raw = sessionStorage.getItem('pendingRegistration');
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

// ── Capitalize helper ─────────────────────────────────────────────────────────
function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

// ── Format card number input ──────────────────────────────────────────────────
function formatCardNumber(value) {
    return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
}

// ── Format expiry input ───────────────────────────────────────────────────────
function formatExpiry(value) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
}

// ── Init page ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const pending = loadPending();
    const paymentSection  = document.getElementById('paymentSection');
    const noPendingSection = document.getElementById('noPendingSection');
    const successSection  = document.getElementById('successSection');

    if (!pending || !pending.client) {
        if (noPendingSection) noPendingSection.style.display = 'block';
        return;
    }

    if (paymentSection) paymentSection.style.display = 'block';

    // Populate order summary
    const client = pending.client;
    const typeEl = document.getElementById('summaryType');
    const nameEl = document.getElementById('summaryName');
    const emailEl = document.getElementById('summaryEmail');
    const priceEl = document.getElementById('summaryPrice');

    if (typeEl) typeEl.textContent = capitalize(pending.type || '');
    if (nameEl) nameEl.textContent = `${client.first_name || ''} ${client.last_name || ''}`.trim() || '—';
    if (emailEl) emailEl.textContent = client.email || '—';
    if (priceEl) priceEl.textContent = 'Contact us for pricing';

    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            const cursor = e.target.selectionStart;
            e.target.value = formatCardNumber(e.target.value);
            e.target.setSelectionRange(cursor, cursor);
        });
    }

    // Expiry formatting
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', (e) => {
            e.target.value = formatExpiry(e.target.value);
        });
    }

    // Cancel button
    const cancelBtn = document.getElementById('cancelPayBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            sessionStorage.removeItem('pendingRegistration');
            history.back();
        });
    }

    // Payment form submit
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const payNowBtn = document.getElementById('payNowBtn');
            if (payNowBtn) {
                payNowBtn.disabled = true;
                payNowBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            }

            // Build final payload with paid:true
            const finalClient = { ...client, paid: true, payment_method: 'card' };

            try {
                const response = await fetch(CLIENT_CREATE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ client: finalClient })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || `Request failed with status ${response.status}`);
                }

                sessionStorage.removeItem('pendingRegistration');

                if (paymentSection) paymentSection.style.display = 'none';
                if (successSection) successSection.style.display = 'block';

                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 4000);
            } catch (error) {
                if (payNowBtn) {
                    payNowBtn.disabled = false;
                    payNowBtn.innerHTML = '<i class="fas fa-lock"></i> <span>Pay Now</span>';
                }
                alert(error.message || 'Payment failed. Please try again.');
            }
        });
    }
});
