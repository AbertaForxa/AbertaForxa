import { Cursor } from './sripts/Cursor.js';
import { Helper } from './sripts/Helper.js';
import { InputCommands } from './sripts/InputCommands.js';
import { Vim } from './sripts/Vim.js';
import { bash_commands, help_commands_list } from './utils/bash.js';

document.addEventListener('DOMContentLoaded', function () {
    try {
        new Cursor('commandInput', '.input-line', 'cursor');
    } catch (error) {
        console.error(error.message);
    }

    Helper.animate_progress_bar();
    Helper.always_focus_on_command_input();

    let firstLoad = true;
    if (firstLoad) {
        const current_path = InputCommands.get_current_path();
        const path = document.getElementById('path');
        path.textContent =
            current_path.path === '~'
                ? current_path.path
                : `~/${current_path.path}`;
        firstLoad = false;
    }

    window.addEventListener(
        'storage',
        function () {
            const current_path = localStorage.getItem('current_path');
            if (!current_path) {
                InputCommands.set_current_path('~');
                const path = document.getElementById('path');
                path.textContent = '~';
            }
        },
        false,
    );

    const commandInput = document.getElementById('commandInput');
    commandInput.addEventListener('keydown', function (event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            const splited_command = this.textContent
                .trim()
                .split(' ')
                .filter((c) => c !== '');

            if (splited_command[1]) {
                const current_path = JSON.parse(
                    localStorage.getItem('current_path'),
                );

                const result = current_path.children.find((obj) =>
                    obj.name.includes(splited_command[1]),
                );
                if (result) {
                    this.textContent = `${splited_command[0]} ${result.name}`;
                }
            }
        }

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
    const div = `
        <div class="last-command">
            <div class="path-content">
                <span class="user">aberta_forxa</span>
                <span class="path">${current_path.path === '~' ? current_path.path : `~/${current_path.path}`}</span>
                <span>$</span>
            </div>
            <span>${command}</span>
        </div>

    `;

    const output = document.getElementById('output');
    output.insertAdjacentHTML('beforeend', div);
}

const commands = {
    ls: (executed_command, argument) => execute_ls_command(argument),
    history: () => execute_history_command(),
    clear: () => execute_clear_command(),
    cd: (executed_command, argument) => execute_cd_command(argument),
    '--help': () => execute_help_command(),
    git: () => execute_git_command(),
    vim: (executed_command, argument) =>
        execute_vim_command(executed_command, argument),
};

function execute_command(executed_command, argument) {
    commands[`${executed_command}`](executed_command, argument);
}

function create_tr_content(list) {
    return list
        .map((content) => {
            const permitions =
                content.type === 2 ? 'drwxr-xr-x@' : '-rw-r--r--@';
            const links = '1';
            const owner = 'abertaforxa';
            const group = 'stuff';
            const size = 'xxx';
            const name = content.name;

            return `
            <tr>
                <td>${permitions}</td>
                <td>${links}</td>
                <td>${owner}</td>
                <td>${group}</td>
                <td>${size}</td>
                <td>${name}</td>
            </tr>
        `;
        })
        .join('');
}

function execute_ls_command(argument) {
    const storage_path = localStorage.getItem('current_path');
    const currentPathParsed = JSON.parse(storage_path);

    const output = document.getElementById('output');

    if (argument && ['-la', '-l', '-ll'].includes(argument)) {
        const trContent = create_tr_content(currentPathParsed.children);
        const table = `
            <table>
                <tbody>
                     ${trContent}
                </tbody>
            </table>
        `;

        output.insertAdjacentHTML('beforeend', table);
    } else {
        const container = document.createElement('div');
        container.classList.add('ls-container');

        currentPathParsed.children.forEach((child) => {
            const span = document.createElement('span');
            span.textContent = child.name;
            container.appendChild(span);
        });

        output.appendChild(container);
    }
}

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

function execute_cd_command(argument) {
    if (argument === undefined) {
        InputCommands.set_current_path('~');
        const path = document.getElementById('path');
        path.textContent = '~';
    }
    if (argument) {
        const current_path = JSON.parse(localStorage.getItem('current_path'));
        console.log(current_path);

        current_path.children.forEach((nav) => {
            if (nav.name === argument && nav.type === 2) {
                InputCommands.set_current_path(argument);
                const path = document.getElementById('path');
                path.textContent = '~/' + argument;
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

function execute_git_command() {
    const output = document.getElementById('output');
    const link = `
        <span>Github repo: <a href="https://github.com/AbertaForxa/AbertaForxa" target="__blank">Aberta Froxa</a></span>
    `;
    output.insertAdjacentHTML('beforeend', link);
}

function execute_vim_command(executed_command, argument) {
    const current_path = localStorage.getItem('current_path');
    const parsedCurrentPath = JSON.parse(current_path);

    const isFileExist = parsedCurrentPath.children.some(
        (post) => post.name === argument.trim(),
    );

    if (isFileExist) Vim.show_modal(argument);
    //Vim.show_modal(argument);
}
