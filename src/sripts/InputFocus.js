export class InputFocus {
    static always_focus_on_command_input() {
        document.addEventListener('click', (event) => {
            const contenteditable = document.getElementById('commandInput');

            if (!event.target.closest('#commandInput')) {
                contenteditable.focus();
            }
        });
    }
}
