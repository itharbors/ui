'use strict';

const { convertTreeToList } = require('../dist/utils');
const { deepEqual, equal } = require('assert');

describe('工具函数测试', () => {

    describe('convertTreeToList', () => {
        const illegalList = [
            true, false,
            0, 1, 100,
            null, undefined,
            '', 'abc',
            {}, new ArrayBuffer, new Function,
        ];

        // 非法对象测试
        illegalList.forEach((item) => {
            const str = (item + '').replace(/\n/g, '');
            it(`传入非法对象: ${str}`, () => {
                const list = convertTreeToList(item);
                deepEqual(list, []);
            });
        });

        // 数字内有非法对象
        illegalList.forEach((item) => {
            const str = (item + '').replace(/\n/g, '');
            it(`数组内传入非法对象: ${str}`, () => {
                const list = convertTreeToList([item]);
                deepEqual(list[0], {
                    name: '',
                    fold: false,
                    arrow: false,
                    tab: 0,
                    data: (typeof item === 'object' && item !== null) ? item : {},
                });
            });
        });

        it('传入一个只有 name 的对象', () => {
            const item = {
                name: 'test',
            };
            const list = convertTreeToList([item]);
            deepEqual(list[0], {
                name: 'test',
                fold: false,
                arrow: false,
                tab: 0,
                data: item,
            });
            equal(list.length, 1);
        });

        it('传入一个只有 details 的对象', () => {
            const item = {
                details: {},
            };
            const list = convertTreeToList([item]);
            deepEqual(list[0], {
                name: '',
                fold: false,
                arrow: false,
                tab: 0,
                data: item,
            });
            equal(list.length, 1);
        });

        it('传入一个只有 fold 的对象', () => {
            const item = {
                fold: true,
            };
            const list = convertTreeToList([item]);
            deepEqual(list[0], {
                name: '',
                fold: true,
                arrow: false,
                tab: 0,
                data: item,
            });
            equal(list.length, 1);
        });

        it('传入一个只有 children 的对象', () => {
            const item = {
                children: [],
            };
            const list = convertTreeToList([item]);
            deepEqual(list[0], {
                name: '',
                fold: false,
                arrow: true,
                tab: 0,
                data: item,
            });
            equal(list.length, 1);
        });

        it('传入一个完整的对象', () => {
            const item = {
                name: 'test',
                fold: true,
                details: {},
                children: [],
            };
            const list = convertTreeToList([item]);
            deepEqual(list[0], {
                name: 'test',
                fold: true,
                arrow: true,
                tab: 0,
                data: item,
            });
            equal(list.length, 1);
        });

        it('传入一个带有多级子对象的对象', () => {
            const treeList = [
                {
                    name: 'test0',
                    fold: true,
                    details: {},
                    children: [
                        {
                            name: 'test1',
                            fold: true,
                            details: {},
                            children: [
                                {
                                    name: 'test2',
                                    fold: true,
                                    details: {},
                                    children: [],
                                },
                            ],
                        },
                        {
                            name: 'test3',
                            fold: true,
                            details: {},
                            children: [],
                        },
                    ],
                },
                {
                    name: 'test4',
                    fold: true,
                    details: {},
                    children: [],
                },
            ];
            const list = convertTreeToList(treeList);
            deepEqual(list[0], {
                name: 'test0',
                fold: true,
                arrow: true,
                tab: 0,
                data: treeList[0],
            });
            deepEqual(list[1], {
                name: 'test1',
                fold: true,
                arrow: true,
                tab: 1,
                data: treeList[0].children[0],
            });
            deepEqual(list[2], {
                name: 'test2',
                fold: true,
                arrow: true,
                tab: 2,
                data: treeList[0].children[0].children[0],
            });
            deepEqual(list[3], {
                name: 'test3',
                fold: true,
                arrow: true,
                tab: 1,
                data: treeList[0].children[1],
            });
            deepEqual(list[4], {
                name: 'test4',
                fold: true,
                arrow: true,
                tab: 0,
                data: treeList[1],
            });
            equal(list.length, 5);
        });
    });
});
