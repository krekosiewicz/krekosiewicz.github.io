export function initVirtualKeyboard() {
    const virtualKeyboardSpace = document.getElementById('virtualKeyboardSpace');

    const virtualKeyboard = document.createElement('div');
    virtualKeyboard.classList.add('virtualKeyboard');

    virtualKeyboard.innerHTML = `
        <button id="arrow-left"><img style="width:100%;height:100%;" src="../assets/arrow-left.svg" alt="Left"></button>
        <button id="arrow-up"><img style="width:100%;height:100%;" src="../assets/arrow-up.svg" alt="Up"></button>
        <button id="arrow-down"><img style="width:100%;height:100%;" src="../assets/arrow-down.svg" alt="Down"></button>
        <button id="arrow-right"><img style="width:100%;height:100%;" src="../assets/arrow-right.svg" alt="Right"></button>
        <button id="spacebar" class="spacebar"><img style="width:100%;height:100%;" src="../assets/space-bar.svg" alt="Space"></button>
    `;

    virtualKeyboardSpace.appendChild(virtualKeyboard);

    let keyIntervals = {};

    function startKeyPress(key) {
        if (keyIntervals[key]) return; // Prevent multiple intervals for the same key

        const event = new KeyboardEvent('keydown', { key });
        document.dispatchEvent(event);

        keyIntervals[key] = setInterval(() => {
            const event = new KeyboardEvent('keydown', { key });
            document.dispatchEvent(event);
        }, 100); // Adjust the interval time as needed
    }

    function stopKeyPress(key) {
        clearInterval(keyIntervals[key]);
        keyIntervals[key] = null;
    }

    document.getElementById('arrow-left').addEventListener('mousedown', () => startKeyPress('ArrowLeft'));
    document.getElementById('arrow-left').addEventListener('mouseup', () => stopKeyPress('ArrowLeft'));
    document.getElementById('arrow-left').addEventListener('mouseleave', () => stopKeyPress('ArrowLeft'));

    document.getElementById('arrow-up').addEventListener('mousedown', () => startKeyPress('ArrowUp'));
    document.getElementById('arrow-up').addEventListener('mouseup', () => stopKeyPress('ArrowUp'));
    document.getElementById('arrow-up').addEventListener('mouseleave', () => stopKeyPress('ArrowUp'));

    document.getElementById('arrow-down').addEventListener('mousedown', () => startKeyPress('ArrowDown'));
    document.getElementById('arrow-down').addEventListener('mouseup', () => stopKeyPress('ArrowDown'));
    document.getElementById('arrow-down').addEventListener('mouseleave', () => stopKeyPress('ArrowDown'));

    document.getElementById('arrow-right').addEventListener('mousedown', () => startKeyPress('ArrowRight'));
    document.getElementById('arrow-right').addEventListener('mouseup', () => stopKeyPress('ArrowRight'));
    document.getElementById('arrow-right').addEventListener('mouseleave', () => stopKeyPress('ArrowRight'));

    document.getElementById('spacebar').addEventListener('mousedown', () => startKeyPress(' '));
    document.getElementById('spacebar').addEventListener('mouseup', () => stopKeyPress(' '));
    document.getElementById('spacebar').addEventListener('mouseleave', () => stopKeyPress(' '));
}
