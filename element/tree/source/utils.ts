'use strict';

import type { TreeItem, TreeItemRenderData } from './interface';

/**
 * 将一个树形数据，转成一个平级的列表
 * 传入非数组，返回空数组
 * 数组内传入错误数据，会转换成一个空的 item 对象
 * @param tree 
 */
export function convertTreeToList(treeList: TreeItem[]): TreeItemRenderData[] {
    const list: TreeItemRenderData[] = [];
    if (!Array.isArray(treeList)) {
        return list;
    }
    for (let treeItem of treeList) {
        convertItemToRenderDataWithIndex(treeItem, 0, list);
    }
    return list;
}

function convertItemToRenderDataWithIndex(item: TreeItem, index: number, list: TreeItemRenderData[]) {
    if (typeof item !== 'object' || item === null) {
        list.push({
            name: '',
            fold: false,
            tab: index,
            arrow: false,
            data: {},
        });
        return;
    }
    list.push({
        name: item.name || '',
        fold: !!item.fold,
        tab: index,
        arrow: !!item.children,
        data: item,
    });
    item.children && item.children.forEach((item) => {
        convertItemToRenderDataWithIndex(item, index + 1, list);
    });
}
