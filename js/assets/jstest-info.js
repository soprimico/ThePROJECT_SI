
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('form');
    const webhookURL = 'https://discord.com/api/webhooks/1553809421979754527/bvmyNrp1hzq58aP-LwaHziEY9sBs4dDatJ9akwbpCapZpcRnGFn1-2YPN3pHSBF7NxCU';

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.contact-submit');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'PROCESSING...';
        submitBtn.disabled = true;

        // 1. Collect Form Data
        const formData = new FormData(contactForm);
        const formValues = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            category: formData.get('category'),
            message: formData.get('message'),
            authorization: formData.get('authorization') ? '✅ Confirmed' : '❌ Not Confirmed'
        };

        // 2. Fetch User IP and Geolocation with Fallbacks
        let connectionData = {
            ip: 'Detection Failed',
            city: 'N/A',
            region: 'N/A',
            country: 'N/A',
            userAgent: navigator.userAgent
        };

        try {
            // Method A: Try ipapi.co (Detailed Geolocation)
            // We use a timeout to ensure the form doesn't hang forever
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const ipResponse = await fetch('https://ipapi.co/json/', { signal: controller.signal });
            const ipJson = await ipResponse.json();
            
            if (ipJson.ip) {
                connectionData.ip = ipJson.ip;
                connectionData.city = ipJson.city || 'Unknown';
                connectionData.region = ipJson.region || 'Unknown';
                connectionData.country = ipJson.country_name || 'Unknown';
            }
            clearTimeout(timeoutId);
        } catch (err) {
            console.warn('Method A (ipapi.co) failed, trying Method B...', err);
            
            // Method B: Fallback to ipify (Just the IP) if Geolocation fails
            try {
                const ipifyResponse = await fetch('https://api.ipify.org?format=json');
                const ipifyJson = await ipifyResponse.json();
                connectionData.ip = ipifyJson.ip || 'Unknown';
                connectionData.city = 'Location Hidden (API Blocked)';
            } catch (err2) {
                console.error('All IP detection methods failed.');
                connectionData.ip = 'Blocked/Unknown';
            }
        }

        // 3. Construct Discord Webhook Payload
        const payload = {
            username: 'SoPrimico Security Bot',
            avatar_url: 'https://img.icons8.com/fluency/48/null/security-shield.png',
            embeds: [{
                title: '📩 New Contact Request Received',
                description: 'A new inquiry has been submitted via the SoPrimico website.',
                color: 0x00ffcc, // Cyan color for visibility
                timestamp: new Date().toISOString(),
                fields: [
                    { name: '👤 User Information', value: `**Name:** ${formValues.name}\n**Email:** ${formValues.email}`, inline: true },
                    { name: '📂 Category', value: formValues.category.toUpperCase(), inline: true },
                    { name: '📝 Subject', value: formValues.subject, inline: false },
                    { name: '💬 Message', value: formValues.message, inline: false },
                    { name: '🛡️ Security Auth', value: formValues.authorization, inline: true },
                    { name: '🌐 Connection', value: `**IP:** ${connectionData.ip}\n**Location:** ${connectionData.city}, ${connectionData.region}, ${connectionData.country}`, inline: true },
                    { name: '💻 Browser/Device', value: `\`\`\`${connectionData.userAgent}\`\`\``, inline: false }
                ],
                footer: {
                    text: 'SoPrimico Contact System | Encrypted Transmission'
                }
            }]
        };

        // 4. Send Data to Webhook
        try {
            const response = await fetch(webhookURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Your message has been sent successfully. Our team will review it shortly.');
                contactForm.reset();
            } else {
                throw new Error('Webhook response not OK');
            }
        } catch (error) {
            console.error('Transmission Error:', error);
            alert('There was an error sending your message. Please try again.');
        } finally {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });
});
