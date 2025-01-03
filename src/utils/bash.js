export const bash_commands = [
    'ls',
    'cd',
    'clear',
    'history',
    'git',
    'vim',
    '--help',
];

export const NavigationType = {
    file: 1,
    directory: 2,
    link: 3,
};

export const TERMINAL_NAVIGATION = [
    {
        path: '~',
        type: NavigationType.directory,
        level: 1,
        children: [
            {
                path: 'about',
                level: 2,
                type: NavigationType.directory,
                children: [
                    { name: 'about', level: 3, type: NavigationType.file },
                ],
            },
            {
                path: 'works',

                level: 2,
                type: NavigationType.directory,
                children: [
                    { name: 'test1', level: 3, type: NavigationType.link },
                    { name: 'test', level: 3, type: NavigationType.link },
                ],
            },
            {
                path: 'blog',
                level: 2,
                type: NavigationType.directory,
                children: [
                    {
                        path: 'programming',
                        level: 3,
                        type: NavigationType.directory,
                        children: [
                            {
                                path: 'javascript',
                                level: 4,
                                type: NavigationType.directory,
                                children: [
                                    {
                                        name: 'javascript',
                                        level: 5,
                                        type: NavigationType.file,
                                    },
                                ],
                            },
                            {
                                path: 'nodejs',
                                level: 4,
                                type: NavigationType.directory,
                                children: [
                                    {
                                        name: 'node',
                                        level: 5,
                                        type: NavigationType.file,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        path: 'algorithms',
                        level: 3,
                        type: NavigationType.directory,
                        children: [],
                    },
                    {
                        path: 'data_structures',
                        level: 3,
                        type: NavigationType.directory,
                        children: [],
                    },
                ],
            },
        ],
    },
];

export const bash_navigation_list = [
    {
        id: 1,
        path: '~',
        type: 2,
        root: true,
        children: [
            { id: 1, path: 'about', type: 2 },
            { id: 2, path: 'works', type: 2 },
            { id: 3, path: 'blog', type: 2 },
        ],
    },
    {
        id: 2,
        path: 'about',
        type: 2,
        root: false,
        children: [{ id: 1, name: 'about', type: 1 }],
    },
    {
        id: 3,
        path: 'works',
        root: false,
        type: 2,
        children: [
            { id: 1, name: 'test1.txt', type: 1 },
            { id: 2, name: 'test2.txt', type: 1 },
        ],
    },
    {
        id: 4,
        path: 'blog',
        type: 2,
        root: false,
        children: [
            {
                id: 1,
                path: 'programming',
                type: 2,
                children: [
                    {
                        id: 1,
                        path: 'javascript',
                        type: 2,
                        children: [{ id: 1, name: 'javascript', type: 1 }],
                    },
                    {
                        id: 2,
                        path: 'nodejs',
                        type: 2,
                        children: [{ id: 1, name: 'node', type: 1 }],
                    },
                ],
            },
            { id: 2, path: 'data_structures', type: 2, children: [] },
            { id: 3, path: 'algorithms', type: 2, children: [] },
        ],
    },
];

export const help_commands_list = [
    {
        name: 'ls',
        description: 'List directory contnets',
        parameters: '[path (optional)]',
    },
    {
        name: 'cd',
        description: 'Change the current directory',
        parameters: '[path]',
    },
    { name: 'clear', description: 'Clear the console', parameters: '' },
    {
        name: 'vim',
        description: 'Open a file in Vim-like modal editor',
        parameters: 'filename',
    },
    {
        name: 'git',
        description: 'Show the github repository of the page',
        parameters: '',
    },
];
