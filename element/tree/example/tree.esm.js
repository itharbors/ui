'use strict';

export function initTreeElement($tree) {
    const treeList = [
        {
            name: 'test-1',
            fold: false,
            details: {},
            children: [
                {
                    name: 'test-1.1',
                    fold: true,
                    details: {},
                    children: [
                    {
                        name: 'test-1.1.1',
                        fold: false,
                        details: {},
                        children: [],
                    },
                    ],
                },
                {
                    name: 'test-1.2',
                    fold: false,
                    details: {},
                    children: [
                    {
                        name: 'test-1.2.1',
                        fold: false,
                        details: {},
                        children: [
                        {
                            name: 'test-1.2.1.1',
                            fold: false,
                            details: {},
                            children: [],
                        },
                        ],
                    },
                    ],
                },
            ],
        },
        {
            name: 'test-2',
            fold: false,
            details: {},
            children: [
                {
                    name: 'test-2.1',
                    fold: false,
                    details: {},
                    children: [
                        {
                            name: 'test-2.1.1',
                            fold: false,
                            details: {},
                            children: [
                                {
                                    name: 'test-2.1.1.1',
                                    fold: false,
                                    details: {},
                                    children: [
                                        {
                                            name: 'test-2.1.1.1.1',
                                            fold: false,
                                            details: {},
                                            children: [
                                                {
                                                    name: 'test-2.1.1.1.1.1',
                                                    fold: false,
                                                    details: {},
                                                    children: [
                                                        {
                                                            name: 'test-2.1.1.1.1.1.1',
                                                            fold: false,
                                                            details: {},
                                                            children: [
                                                                {
                                                                    name: 'test-2.1.1.1.1.1.1.1',
                                                                    fold: false,
                                                                    details: {},
                                                                    children: [
                                                                        {
                                                                            name: 'test-2.1.1.1.1.1.1.1.1',
                                                                            fold: false,
                                                                            details: {},
                                                                            children: [],
                                                                        },
                                                                    ],
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    name: 'test-2.2',
                    fold: true,
                    details: {},
                    children: [
                        {
                            name: 'test-2.2.1',
                            fold: false,
                            details: {},
                            children: [
                                {
                                    name: 'test-2.2.1.1',
                                    fold: false,
                                    details: {},
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ];
    $tree.setTreeData(treeList);
}
