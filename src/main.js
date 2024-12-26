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
                    execute_command(splitedCommand[0].trim());
                }
                InputCommands.storage_commands(this.textContent);
                this.textContent = '';
            }
        }
    });
});

const commands = {
    ls: () => execute_command(),
    history: () => execute_history_command(),
    clear: () => execute_clear_command(),
};

function execute_command(command) {
    commands[`${command}`]();
}

function execute_ls_command() {}

function execute_history_command() {
    const list_of_history_commands = InputCommands.get_storage_commands();
    const output = document.getElementById('output');
    list_of_history_commands.forEach((command) => {
        const container = document.createElement('div');

        const span = document.createElement('span');
        span.textContent = `${command.id} ${command.command}`;
        container.appendChild(span);
        output.appendChild(container);
    });
}

function execute_clear_command() {
    const output = document.getElementById('output');
    output.innerHTML = '';
}

function execute_cat_command() {}
