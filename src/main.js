import { Cursor } from './sripts/Cursor.js';
import { Helper } from './sripts/Helper.js';
import { InputCommands } from './sripts/InputCommands.js';
import { Vim } from './sripts/Vim.js';
import {
    bash_commands,
    help_commands_list,
    TERMINAL_NAVIGATION,
} from './utils/bash.js';

function get_current_node_from_storage() {
    const currentPath = localStorage.getItem('current_path');
    if (!currentPath) return TERMINAL_NAVIGATION[0];
    const { path, level } = JSON.parse(currentPath);

    const foundNode = Helper.find_node_by_path_and_level(
        path,
        level,
        TERMINAL_NAVIGATION[0],
    );
    return foundNode || TERMINAL_NAVIGATION[0];
}

function set_current_node_in_storage(node) {
    localStorage.setItem(
        'current_path',
        JSON.stringify({ path: node.path, level: node.level }),
    );
}

document.addEventListener('DOMContentLoaded', function () {
    try {
        new Cursor('commandInput', '.input-line', 'cursor');
    } catch (error) {
        console.error(error.message);
    }

    Helper.build_tree_with_parents(TERMINAL_NAVIGATION[0]);

    Helper.animate_progress_bar();
    Helper.always_focus_on_command_input();
    const currentNode = get_current_node_from_storage();
    document.getElementById('path').textContent =
        Helper.get_full_path_string(currentNode);

    window.addEventListener(
        'storage',
        function () {
            const current_path = localStorage.getItem('current_path');
            if (!current_path) {
                //InputCommands.set_current_path('~');
                localStorage.setItem(
                    'current_path',
                    JSON.stringify({ path: '~', level: 1 }),
                );
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
                const currentPath = Helper.find_node_by_path_and_level(
                    current_path.path,
                    current_path.level,
                    TERMINAL_NAVIGATION[0],
                );

                const result = currentPath.children.find(
                    (obj) =>
                        obj.path?.includes(splited_command[1]) ||
                        obj.name?.includes(splited_command[1]),
                );
                if (result) {
                    this.textContent = `${splited_command[0]} ${result.path || result.name}`;
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
    const currentNode = get_current_node_from_storage();
    const fullPathString = Helper.get_full_path_string(currentNode);

    const div = `
        <div class="last-command">
            <div class="path-content">
                <span class="user">aberta_forxa</span>
                <span class="path">${fullPathString}</span>
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
            const name = content.path ?? content.name;

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
    const currentPath = Helper.find_node_by_path_and_level(
        currentPathParsed.path,
        currentPathParsed.level,
        TERMINAL_NAVIGATION[0],
    );

    const output = document.getElementById('output');

    if (argument && ['-la', '-l', '-ll'].includes(argument)) {
        const trContent = create_tr_content(currentPath.children);
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

        currentPath.children.forEach((child) => {
            const span = document.createElement('span');
            span.textContent = child.path ?? child.name;
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
    if (!argument) {
        const rootNode = TERMINAL_NAVIGATION[0];
        set_current_node_in_storage(rootNode);
        document.getElementById('path').textContent = rootNode.path;
        return;
    }

    const currentNode = get_current_node_from_storage();
    if (argument.trim() === '..') {
        if (currentNode.parent) {
            set_current_node_in_storage(currentNode.parent);
            document.getElementById('path').textContent =
                Helper.get_full_path_string(currentNode.parent);
        }
        return;
    }

    if (!currentNode.children || currentNode.children.length === 0) return;

    const foundChild = currentNode.children.find((child) => {
        return child.type === 2 && child.path === argument.trim();
    });

    if (!foundChild) return;

    set_current_node_in_storage(foundChild);
    document.getElementById('path').textContent =
        Helper.get_full_path_string(foundChild);
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

    const currentPath = Helper.find_node_by_path_and_level(
        parsedCurrentPath.path,
        parsedCurrentPath.level,
        TERMINAL_NAVIGATION[0],
    );

    const isFileExist = currentPath.children.some(
        (post) => post.name === argument.trim(),
    );

    if (isFileExist) Vim.show_modal(argument);
}
