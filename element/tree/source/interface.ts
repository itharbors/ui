'use strict';

import type { TreeItemElement } from './element-item';

/**
 * 树形数据中每一个对象的结构
 */
export type TreeItem<T=any> = {
    // 显示在界面上的文本
    name?: string;
    // 是否折叠子元素
    fold?: boolean;
    // 一些可供用户自定义的附加数据
    details?: T;
    // 子元素
    children?: TreeItem<T>[];
}

/**
 * 树形数据传入后，转换成用于渲染的数据
 */
export type TreeItemRenderData<T=any> = {
    // 显示在界面上的文本
    name: string;
    // 是否折叠子元素
    fold: boolean;
    // 是否显示下拉箭头
    arrow: boolean;
    // 缩进层级
    tab: number;
    // 对象原始数据
    data?: TreeItem<T>;
}

export interface DetailChangeFold {
    elem: TreeItemElement;
    fold: boolean;
}

export interface DetailItemDataUpdated {
    elem: TreeItemElement;
    data: TreeItemRenderData;
}
