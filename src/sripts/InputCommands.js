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
}
