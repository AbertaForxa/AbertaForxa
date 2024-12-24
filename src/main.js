document.addEventListener('DOMContentLoaded', function () {
    const commandInput = document.getElementById('commandInput');
    commandInput.addEventListener('input', updateCursorPosition);
    window.addEventListener('resize', updateCursorPosition);

    updateCursorPosition();
    function updateCursorPosition() {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0).cloneRange();
        range.collapse(false);

        const rect = range.getBoundingClientRect();

        const inputLine = document.querySelector('.input-line');
        const inputRect = inputLine.getBoundingClientRect();

        const cursorTop = rect.top - inputRect.top;
        const cursorLeft = rect.left - inputRect.left;

        const cursor = document.getElementById('cursor');
        cursor.style.top = `${cursorTop}px`;
        cursor.style.left = `${cursorLeft}px`;
    }

    function placeCursorAtEnd() {
        const range = document.createRange();
        const sel = window.getSelection();

        range.selectNodeContents(commandInput);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        commandInput.focus();
        updateCursorPosition();
    }

    function handleInput() {
        updateCursorPosition();
    }

    commandInput.addEventListener('keydown', function () {
        placeCursorAtEnd();
    });

    commandInput.addEventListener('keyup', handleInput);
    commandInput.addEventListener('click', handleInput);
});
