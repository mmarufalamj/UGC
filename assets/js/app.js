/**
 * UGC IT Service System - Frontend Logic
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('UGC IT Service System Loaded');

    // Form Validation
    const ticketForm = document.querySelector('form');
    if (ticketForm) {
        ticketForm.addEventListener('submit', function(e) {
            const serviceTypes = document.querySelectorAll('input[name="service_type[]"]:checked');
            if (serviceTypes.length === 0 && ticketForm.id === 'new-ticket-form') {
                e.preventDefault();
                alert('অন্তত একটি সেবার ধরণ নির্বাচন করুন।');
            }
        });
    }

    // Dynamic UI: Toggle item sections based on service type selection
    const hwToggle = document.querySelector('input[value="hardware"]');
    const nwToggle = document.querySelector('input[value="network"]');
    const swToggle = document.querySelector('input[value="software"]');

    function updateSections() {
        // Optional: Add visual highlighting to selected sections
    }

    if (hwToggle) hwToggle.addEventListener('change', updateSections);
    if (nwToggle) nwToggle.addEventListener('change', updateSections);
    if (swToggle) swToggle.addEventListener('change', updateSections);

    // Auto-dismiss alerts
    const alerts = document.querySelectorAll('.bg-green-100, .bg-red-100');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 1s ease';
            setTimeout(() => alert.remove(), 1000);
        }, 5000);
    });
});

/**
 * Update Ticket Status via AJAX (Admin/Officer)
 */
async function updateTicketStatus(ticketId, status) {
    const formData = new FormData();
    formData.append('action', 'update_status');
    formData.append('ticket_id', ticketId);
    formData.append('status', status);

    try {
        const response = await fetch('../api/ticket-actions.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            location.reload();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error updating status:', error);
    }
}
