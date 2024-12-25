export class Cursor {
    constructor(
        commandInputId = 'commandInput',
        inputLineSelector = '.input-line',
        cursorId = 'cursor',
    ) {
        this.commandInput = document.getElementById(commandInputId);
        this.inputLine = document.querySelector(inputLineSelector);
        this.cursor = document.getElementById(cursorId);

        if (!this.commandInput || !this.inputLine || !this.cursor) {
            throw new Error('Required dom elements not found');
        }

        this.handleInput = this.handleInput.bind(this);
        this.updateCursorPosition = this.updateCursorPosition.bind(this);
        this.placeCursorAtEnd = this.placeCursorAtEnd.bind(this);

        this.commandInput.addEventListener('input', this.handleInput);
        this.commandInput.addEventListener('keydown', this.placeCursorAtEnd);
        this.commandInput.addEventListener('keyup', this.handleInput);
        this.commandInput.addEventListener('click', this.handleInput);

        window.addEventListener('resize', this.updateCursorPosition);
        this.updateCursorPosition();
    }

    updateCursorPosition(event) {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0).cloneRange();
        range.collapse(false);

        const rect = range.getBoundingClientRect();

        //const inputLine = document.querySelector('.input-line');
        const inputRect = this.inputLine.getBoundingClientRect();

        const cursorTop = rect.top - inputRect.top;
        const cursorLeft = rect.left - inputRect.left;

        //const cursor = document.getElementById('cursor');
        this.cursor.style.top = `${cursorTop}px`;
        this.cursor.style.left = `${cursorLeft}px`;
    }

    placeCursorAtEnd(event) {
        const range = document.createRange();
        const selection = window.getSelection();

        range.selectNodeContents(this.commandInput);
        range.collapse(false);
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
        this.commandInput.focus();
        this.updateCursorPosition();
    }

    handleInput(event) {
        this.updateCursorPosition();
    }
}
