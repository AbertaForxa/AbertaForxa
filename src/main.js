import { Cursor } from './sripts/Cursor.js';
import { InputFocus } from './sripts/InputFocus.js';

document.addEventListener('DOMContentLoaded', function () {
    try {
        new Cursor('commandInput', '.input-line', 'cursor');
    } catch (error) {
        console.error(error.message);
    }

    InputFocus.always_focus_on_command_input();
});
