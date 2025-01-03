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
            const listOfCommands = JSON.parse(storageList);

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
    static set_current_path(currentPath) {
        const foundedPath = InputCommands.find_path(
            currentPath,
            bash_navigation_list,
        );

        if (foundedPath) {
            localStorage.setItem('current_path', JSON.stringify(foundedPath));
        }
    }
}
