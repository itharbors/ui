'use strict';

export function initConsoleElement($tree) {
    const treeList = [];
    let black = false;
    for (let i = 0; i < 1000000; i++) {
        black = !black;
        treeList.push({
            name: `tt_${i}`,
            fold: true,
            details: {
            black: black,
            },
        });
    }

    $tree.setTreeData(treeList);

//     $tree.registerStyle(/*css*/`
// v-tree-item {
//   display: flex;
// }
// v-tree-item[color=black] {
//   background: #ccc;
// }
// v-tree-item > span[ref=name] {
//   flex: 1;
// }
// v-tree-item > span[ref=right] {
//   text-decoration: double;
// }
//     `);

//     $tree.registerUpdateItem(($item, data) => {
//         const $name = $item.querySelector('[ref=name]');
//         const $arrow = $item.querySelector('[ref=arrow]');

//         // 名字
//         $name.innerHTML = data.name;
//         // 缩进
//         $item.setAttribute('style', `--item-tab: ${data.tab}`);
//         // 箭头
//         if (data.fold) {
//             $arrow.setAttribute('fold', '');
//         } else {
//             $arrow.removeAttribute('fold');
//         }
//         if (data.arrow) {
//             $arrow.removeAttribute('hidden');
//         } else {
//             $arrow.setAttribute('hidden', '');
//         }

//         $item.setAttribute('color', data.data.details.black ? 'black' : 'white');
//     });
}
