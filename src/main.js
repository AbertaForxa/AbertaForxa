import { Cursor } from './sripts/Cursor.js';
import { InputCommands } from './sripts/InputCommands.js';
import { InputFocus } from './sripts/InputFocus.js';
import { bash_commands } from './utils/bash.js';

document.addEventListener('DOMContentLoaded', function () {
    try {
        new Cursor('commandInput', '.input-line', 'cursor');
    } catch (error) {
        console.error(error.message);
    }

    InputFocus.always_focus_on_command_input();

    const commandInput = document.getElementById('commandInput');

    commandInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (this.textContent !== '') {
                const splitedCommand = this.textContent
                    .trim()
                    .split(' ')
                    .filter((c) => c !== '');
                const containBashCommand = bash_commands.some(
                    (c) => splitedCommand[0] === c,
                );

                if (containBashCommand) {
                    if (splitedCommand[0] === 'history') {
                        const list_of_history_commands =
                            InputCommands.get_storage_commands();
                        const output = document.getElementById('output');
                        list_of_history_commands.forEach((command) => {
                            const container = document.createElement('div');

                            const span = document.createElement('span');
                            span.textContent = `${command.id} ${command.command}`;
                            container.appendChild(span);
                            output.appendChild(container);
                        });
                    }

                    if (splitedCommand[0] === 'clear') {
                        const output = document.getElementById('output');
                        output.innerHTML = '';
                    }
                }
                InputCommands.storage_commands(this.textContent);
                this.textContent = '';
            }
        }
    });
});
