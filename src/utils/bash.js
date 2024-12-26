export const bash_commands = [
    'ls',
    'cd',
    'echo',
    'touch',
    'mkdir',
    'grep',
    'pwd',
    'cp',
    'mv',
    'clear',
    'history',
];

export const bash_navigation_list = [
    {
        id: 1,
        path: '~',
        type: 2,
    },
    {
        id: 2,
        path: '/about',
        type: 2,
        children: [
            { id: 1, name: 'test.txt', type: 1 },
            { id: 2, name: 'test2.txt', type: 1 },
        ],
    },
    {
        id: 3,
        path: '/works',
        type: 1,
        children: [
            { id: 1, name: 'test1.txt', type: 1 },
            { id: 2, name: 'test2.txt', type: 1 },
        ],
    },
];
