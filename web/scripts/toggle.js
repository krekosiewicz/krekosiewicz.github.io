// toggle.js
function setupToggle(toggleButtonId, contentId, displayStyle = 'flex') {
    const toggleButton = document.getElementById(toggleButtonId);
    const content = document.getElementById(contentId);
    const allDetails = document.querySelectorAll('.subdirectory');

    toggleButton.addEventListener('click', function() {
        allDetails.forEach(detail => {
            if (detail.id !== contentId) {
                detail.style.display = 'none'; // Hide all other details
            }
        });

        // Toggle the visibility of the clicked detail
        content.style.display = (content.style.display === displayStyle ? 'none' : displayStyle);
    });
}