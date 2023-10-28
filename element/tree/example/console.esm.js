'use strict';

export function initConsoleElement($tree) {
    const treeList = [];
    let black = false;
    for (let i = 0; i < 1000000; i++) {
        black = !black;
        treeList.push({
            name: `message_${i}`,
            fold: true,
            details: {
            black: black,
            },
        });
    }

    $tree.setTreeData(treeList);
}
