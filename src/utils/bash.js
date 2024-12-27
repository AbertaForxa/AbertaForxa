export const bash_commands = [
    'ls',
    'cd',
    'clear',
    'history',
    'git',
    'vim',
    '--help',
];

export const bash_navigation_list = [
    {
        id: 1,
        path: '~',
        type: 2,
        root: true,
        children: [
            { id: 1, name: 'about', type: 2 },
            { id: 2, name: 'works', type: 2 },
            { id: 3, name: 'blog', type: 2 },
        ],
    },
    {
        id: 2,
        path: 'about',
        type: 2,
        root: false,
        children: [
            { id: 1, name: 'test.txt', type: 1 },
            { id: 2, name: 'test2.txt', type: 1 },
        ],
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
        children: [{ id: 1, name: 'test', type: 1 }],
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
