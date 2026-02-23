document.addEventListener('DOMContentLoaded', () => {
    const contactForms = document.querySelectorAll('form[action="https://api.web3forms.com/submit"]');

    contactForms.forEach(form => {
        form.addEventListener('submit', async function (e) {
            e.preventDefault(); // Prevent default redirection

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.textContent : 'Submit';

            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
            }

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            const formResult = form.querySelector('.form-result');
            if (formResult) {
                formResult.style.color = '';
                formResult.innerHTML = '';
            }

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });

                const result = await response.json();

                if (response.status === 200) {
                    if (formResult) {
                        formResult.style.color = 'green';
                        formResult.innerHTML = 'Message sent successfully!';
                    } else {
                        // Fallback
                        alert('Message sent successfully!');
                    }
                    form.reset();

                    // Clear message after 5 seconds
                    setTimeout(() => {
                        if (formResult) formResult.innerHTML = '';
                    }, 5000);
                } else {
                    console.error(result);
                    if (formResult) {
                        formResult.style.color = 'red';
                        formResult.innerHTML = 'Failed to send message: ' + (result.message || 'Unknown error');
                    } else {
                        alert('Failed to send message: ' + (result.message || 'Unknown error'));
                    }
                }
            } catch (error) {
                console.error(error);
                if (formResult) {
                    formResult.style.color = 'red';
                    formResult.innerHTML = 'An error occurred while sending the message. Please try again later.';
                } else {
                    alert('An error occurred while sending the message. Please try again later.');
                }
            } finally {
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    });
});
