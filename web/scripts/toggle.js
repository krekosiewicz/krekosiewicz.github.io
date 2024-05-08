// toggle.js
function setupToggle(toggleButtonId, contentId, displayStyle = 'flex') {
    const toggleButton = document.getElementById(toggleButtonId);
    const content = document.getElementById(contentId);

    if (toggleButton && content) {
        toggleButton.onclick = function() {
            content.style.display = content.style.display === displayStyle ? 'none' : displayStyle;
        };
    } else {
        console.error('Toggle or content element not found!');
    }
}
