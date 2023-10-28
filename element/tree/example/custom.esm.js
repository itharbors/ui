'use strict';

export function initCustomElement($tree) {
    const treeList = [
        {
            name: 'test-1',
            fold: false,
            details: {},
            children: [
                {
                    name: 'test-1.1',
                    fold: false,
                    details: {
                        // 自定义附加数据
                        color: 'green',
                    },
                    children: [],
                },
                {
                    name: 'test-1.2',
                    fold: false,
                    details: {
                        // 自定义附加数据
                        color: 'red',
                    },
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
                    details: {
                        // 自定义附加数据
                        color: 'blue',
                    },
                },
            ],
        },
    ];

    $tree.setTreeData(treeList);

    $tree.registerStyle(/*css*/`
v-tree-item {
    display: flex;
}
v-tree-item[color=green] {
    color: green;
}
v-tree-item[color=red] {
    color: red;
}
v-tree-item[color=blue] {
    color: blue;
}
svg[fold] {
    transform: rotate(-90deg);
}
span[ref=tab] {
    display: inline-block;
    padding-left: calc(var(--item-tab) * 24px);
}
span[ref=name] {
    flex: 1;
}
span[ref=right] {
    cursor: pointer;
}
    `);

    $tree.registerUpdateItem(($item, data) => {
        const $tab = $item.querySelector('[ref=tab]');
        const $name = $item.querySelector('[ref=name]');
        const $arrow = $item.querySelector('[ref=arrow]');
        const $right = $item.querySelector('[ref=right]');

        // 名字
        $name.innerHTML = data.name;
        // 缩进
        $item.setAttribute('style', `--item-tab: ${data.tab}`);
        // 箭头
        if (data.fold) {
            $arrow.setAttribute('fold', '');
        } else {
            $arrow.removeAttribute('fold');
        }
        if (data.arrow) {
            $arrow.removeAttribute('hidden');
        } else {
            $arrow.setAttribute('hidden', '');
        }

        if (data.data.details.color) {
            $right.innerHTML = `<span>${data.data.details.color}<span/>`;
            const $span = $right.querySelector('span');
            $span.addEventListener('click', () => {
                alert(data.data.details.color);
            });
            $item.setAttribute('color', data.data.details.color);
        } else {
            $right.innerHTML = '';
            $item.setAttribute('color', '');
        }
    });
}
