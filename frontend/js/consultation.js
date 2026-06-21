document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all
            faqItems.forEach(i => {
                i.classList.remove('open');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked if it was closed
            if (!isOpen) {
                item.classList.add('open');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Form submission
    const form = document.getElementById('consultation-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            const data = {
                type: 'consultation',
                name: form.querySelector('[name="name"]')?.value || '',
                phone: form.querySelector('[name="phone"]')?.value || '',
                email: form.querySelector('[name="email"]')?.value || '',
                company: form.querySelector('[name="company"]')?.value || '',
                service: form.querySelector('[name="service"]')?.value || '',
                message: form.querySelector('[name="message"]')?.value || ''
            };

            try {
                const apiBase = window.FORMOSA_API_BASE || '';
                const res = await fetch(`${apiBase}/api/consultation`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (res.ok) {
                    btn.textContent = 'Отправлено!';
                    btn.style.background = '#2E7D32';
                    form.reset();
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = '';
                    }, 2000);
                } else {
                    btn.textContent = 'Ошибка';
                    btn.style.background = '#DC3545';
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = '';
                    }, 2000);
                }
            } catch {
                btn.textContent = 'Ошибка сети';
                btn.style.background = '#DC3545';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 2000);
            }
        });
    }
});
