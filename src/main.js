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
            add_executed_command(this.textContent);
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
                    execute_command(
                        splitedCommand[0].trim(),
                        splitedCommand[1]?.trim(),
                    );
                }
                InputCommands.storage_commands(this.textContent);
                this.textContent = '';
            }
        }
    });
});

function add_executed_command(command) {
    const div = `
        <div class="last-command">
            <div class="path-content">
                <span class="user">aberta_forxa</span>
                <span class="path">~/Desktop</span>
                <span>$</span>
            </div>
            <span>${command}</span>
        </div>

    `;

    const output = document.getElementById('output');
    output.insertAdjacentHTML('beforeend', div);
}

const commands = {
    ls: () => execute_ls_command(),
    history: () => execute_history_command(),
    clear: () => execute_clear_command(),
    cd: (executed_command, argument) =>
        execute_cd_command(executed_command, argument),
};

function execute_command(executed_command, argument) {
    commands[`${executed_command}`](executed_command, argument);
}

function execute_ls_command() {}

function execute_history_command() {
    const list_of_history_commands = InputCommands.get_storage_commands();
    const output = document.getElementById('output');
    if (list_of_history_commands.length > 0) {
        list_of_history_commands.forEach((command) => {
            const container = document.createElement('div');

            const span = document.createElement('span');
            span.textContent = `${command.id} ${command.command}`;
            container.appendChild(span);
            output.appendChild(container);
        });
    }
}

function execute_clear_command() {
    const output = document.getElementById('output');
    output.innerHTML = '';
}

function execute_cat_command() {}

function execute_cd_command(executed_command, argument) {
    console.log(executed_command);
    console.log(argument);
}
