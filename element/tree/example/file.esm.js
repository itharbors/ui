'use strict';

export function initFileElement($tree) {
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

//     $tree.registerStyle(/*css*/`
// v-tree-item {
//   display: flex;
// }
// v-tree-item > span[ref=name] {
//   flex: 1;
// }
// v-tree-item > span[ref=right] {
//   text-decoration: double;
// }
//     `);

    // $tree.registerUpdateItem(($item, data) => {
    //     const $name = $item.querySelector('[ref=name]');
    //     const $arrow = $item.querySelector('[ref=arrow]');

    //     // 名字
    //     $name.innerHTML = data.name;
    //     // 缩进
    //     $item.setAttribute('style', `--item-tab: ${data.tab}`);
    //     // 箭头
    //     if (data.fold) {
    //         $arrow.setAttribute('fold', '');
    //     } else {
    //         $arrow.removeAttribute('fold');
    //     }
    //     if (data.arrow) {
    //         $arrow.removeAttribute('hidden');
    //     } else {
    //         $arrow.setAttribute('hidden', '');
    //     }

    //     $item.setAttribute('color', data.data.details.black ? 'black' : 'white');
    // });
}
