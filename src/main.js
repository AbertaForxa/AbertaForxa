import { Cursor } from './sripts/Cursor.js';
import { InputCommands } from './sripts/InputCommands.js';
import { InputFocus } from './sripts/InputFocus.js';
import {
    bash_commands,
    bash_navigation_list,
    help_commands_list,
} from './utils/bash.js';

document.addEventListener('DOMContentLoaded', function () {
    try {
        new Cursor('commandInput', '.input-line', 'cursor');
    } catch (error) {
        console.error(error.message);
    }
    let firstLoad = true;
    if (firstLoad) {
        const current_path = InputCommands.get_current_path();
        const path = document.getElementById('path');
        path.textContent = current_path.path;
        firstLoad = false;
    }

    window.addEventListener(
        'storage',
        function () {
            // TODO: Check if storage contains objects
        },
        false,
    );

    InputFocus.always_focus_on_command_input();

    const commandInput = document.getElementById('commandInput');

    commandInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            add_executed_command(this.textContent);
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
    const current_path = InputCommands.get_current_path();
    console.log(current_path);
    const div = `
        <div class="last-command">
            <div class="path-content">
                <span class="user">aberta_forxa</span>
                <span class="path">${current_path.path}</span>
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
    cd: (executed_command, argument) => execute_cd_command(argument),
    '--help': () => execute_help_command(),
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

function execute_cd_command(argument) {
    if (argument === undefined) {
        InputCommands.set_current_path('~');
        const path = document.getElementById('path');
        path.textContent = '~';
    }
    if (argument) {
        bash_navigation_list.forEach((nav) => {
            if (nav.path === argument) {
                InputCommands.set_current_path(argument);
                const path = document.getElementById('path');
                path.textContent = argument;
            }
        });
    }
}

function execute_help_command() {
    const output = document.getElementById('output');
    const div = document.createElement('div');
    div.classList.add('help-commands');

    help_commands_list.forEach((hc) => {
        const name = document.createElement('span');
        const description = document.createElement('span');
        const parameters = document.createElement('span');

        name.textContent = hc.name;
        description.textContent = hc.description;
        parameters.textContent = hc.parameters;

        div.appendChild(name);
        div.appendChild(description);
        div.appendChild(parameters);
    });

    output.appendChild(div);
}
