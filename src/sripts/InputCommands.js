import { bash_navigation_list } from '../utils/bash.js';

export class InputCommands {
    static storage_commands(command) {
        const storageList = localStorage.getItem('commands');
        if (!storageList) {
            const newCommand = [
                {
                    id: 1,
                    command: command,
                },
            ];
            localStorage.setItem('commands', JSON.stringify(newCommand));
        } else {
            const storageCommand = localStorage.getItem('commands');
            const listOfCommands = JSON.parse(storageCommand);

            const newObj = {
                id: listOfCommands.length + 1,
                command: command,
            };

            listOfCommands.push(newObj);
            localStorage.setItem('commands', JSON.stringify(listOfCommands));
        }
    }

    static get_storage_commands() {
        const listOfCommands = localStorage.getItem('commands');
        if (!listOfCommands) return [];

        let commands = JSON.parse(listOfCommands);
        if (commands.length >= 10) {
            commands = commands.slice(Math.max(commands.length - 10, 1));
        }

        return commands;
    }

    static get_current_path() {
        const storage_path = localStorage.getItem('current_path');
        if (!storage_path) return bash_navigation_list[0];

        const path = JSON.parse(storage_path);
        return path;
    }

    static set_current_path(current_path) {
        const path = bash_navigation_list.filter(
            (nav) => nav.path === current_path.trim(),
        );
        localStorage.setItem('current_path', JSON.stringify(path[0]));
    }
}
