'use strict';

import type {
    DetailChangeFold,
    DetailItemDataUpdated,
    TreeItem,
    TreeItemRenderData,
} from './interface';

import type {
    TreeItemElement,
} from './element-item';

import {
    BaseElement,
    registerElement,
    style,
} from '@itharbors/ui-core';

import {
    convertTreeToList,
} from './utils';

const HTML = /*html*/`
<style class="custom"></style>
<slot content="content"></slot>
<section class="content"></section>
`;

const STYLE = /*css*/`
${style.solid}
:host {
    display: block;
    border: 1px solid;
    box-sizing: border-box;
    overflow: auto;
    border-radius: calc(var(--ui-size-radius) * 1px);
    border-color: var(--ui-color-default-line);
    color: var(--ui-color-default-contrast);
}
[hidden] {
    display: none;
}
:host > section {
    border: none;
    outline: none;
    background: none;
    padding: 0;
    line-height: var(--item-element-height);
    overflow: hidden;
}
:host v-tree-item {
    line-height: var(--item-element-height);
    height: var(--item-element-height);
    transform: translateY(calc(var(--item-offset-line) * var(--item-offset)))
}
slot {
    display: none;
}
`;

export class TreeElement extends BaseElement {
    get HTMLTemplate() {
        return HTML;
    }

    get HTMLStyle() {
        return STYLE;
    }

    get defaultData(): {
        // 每一行的高度
        lineHeight: number;
        // 滚动的时候每一行的偏移量
        lineOffset: number;
        // 顶部到渲染区域的偏移行数
        offsetLine: number;
        // 现在的区域最多可以显示几行
        maxDisplayLine: number;
        // 用于显示的数据，会比总数据少
        list: TreeItemRenderData[],
        // 将 tree 转换成的列表，包含了所有可能显示的数据
        cacheList: TreeItemRenderData[],
    } {
        return {
            lineHeight: 0,
            lineOffset: 0,
            offsetLine: 0,
            maxDisplayLine: 0,
            list: [],
            cacheList: [],
        };
    }

    private itemArray: TreeItemElement[] = [];
    private $section!: HTMLElement;

    /**
     * 绑定内部事件
     */
    private bindEvent() {

        this.addEventListener('scroll', (event) => {
            event.stopPropagation();
            event.preventDefault();

            const lineHeight = this.getProperty('lineHeight');
            const maxDisplayLine = this.getProperty('maxDisplayLine');
            const list = this.getProperty('list');

            const offsetScroll = this.scrollTop / (this.scrollHeight - this.clientHeight);
            const maxOffsetLine = list.length - maxDisplayLine;

            let offsetLine = Math.round(maxOffsetLine * offsetScroll)// Math.floor(this.scrollTop / lineHeight);
            if (offsetLine > list.length - this.itemArray.length) {
                offsetLine = list.length - this.itemArray.length;
            }
            if (offsetLine < 0) {
                offsetLine = 0;
            }
            this.setProperty('offsetLine', offsetLine);
        });

        this.data.addPropertyListener('offsetLine', (offsetLine) => {
            const lineHeight = this.getProperty('lineHeight');
            const lineOffset = this.getProperty('lineOffset');
            const height = this.$section.style.height;
            this.$section.setAttribute('style', `--item-element-height: ${lineHeight}px; --item-offset: ${lineOffset}px; --item-offset-line: ${offsetLine}; height: ${height};`);
            this.applyItemData();
        });

        this.data.addPropertyListener('lineHeight', (lineHeight) => {
            const offsetLine = this.getProperty('offsetLine');
            const lineOffset = this.getProperty('lineOffset');
            const height = this.$section.style.height;
            this.$section.setAttribute('style', `--item-element-height: ${lineHeight}px; --item-offset: ${lineOffset}px; --item-offset-line: ${offsetLine}; height: ${height};`);
        });

        this.data.addPropertyListener('lineOffset', (lineOffset) => {
            const offsetLine = this.getProperty('offsetLine');
            const lineHeight = this.getProperty('lineHeight');
            const height = this.$section.style.height;
            this.$section.setAttribute('style', `--item-element-height: ${lineHeight}px; --item-offset: ${lineOffset}px; --item-offset-line: ${offsetLine}; height: ${height};`);
        });

        this.data.addPropertyListener('maxDisplayLine', (maxDisplayLine) => {
            const length = maxDisplayLine;
            const $template = this.querySelector('v-tree-item');
            while (this.itemArray.length < length) {
                const $item = $template ? $template.cloneNode(true) as TreeItemElement : document.createElement('v-tree-item') as TreeItemElement;
                this.itemArray.push($item);
                this.$section.appendChild($item);
            }
            while (this.itemArray.length > length) {
                const elem = this.itemArray.pop();
                elem?.remove();
            }
            this.updateContentHeight();
            this.applyItemData()
        });

        this.data.addPropertyListener('list', () => {
            this.updateContentHeight();
            this.applyItemData();
        });

        // item 事件处理
        this.shadowRoot.addEventListener('item-data-updated', (event) => {
            const cEvent = event as CustomEvent<DetailItemDataUpdated>;
            const data = cEvent.detail.data;
            const $elem = cEvent.detail.elem;
            this.updateItem($elem, data);
        });
        this.shadowRoot.addEventListener('change-fold', (event) => {
            const cEvent = event as CustomEvent<DetailChangeFold>;
            const data = cEvent.detail.elem.getProperty('data');
            data.fold = cEvent.detail.fold;
            cEvent.detail.elem.data.touchProperty('data');
            this.updateList();
        });
    }

    /**
     * 更新当前元素可以显示区域内，最多显示的行数
     */
    private updateMaxDisplayLine() {
        const bounding = this.getBoundingClientRect();
        const lineHeight = this.getProperty('lineHeight');
        this.setProperty('maxDisplayLine', Math.ceil(bounding.height / lineHeight));
    }

    /**
     * 更新内部元素的高度
     * 更新后将显示/隐藏滚动条
     */
    private updateContentHeight() {
        const lineHeight = this.getProperty('lineHeight');
        const list = this.getProperty('list');
        let height = lineHeight * list.length;
        let lineOffset = lineHeight;
        let itemHeight = this.itemArray.length * lineHeight;
        if (height > 1000000) {
            lineOffset = (1000000 - itemHeight) / (height - itemHeight) * lineHeight;
            height = 1000000;
        }
        this.setProperty('lineOffset', lineOffset);
        this.$section.style.height = `${height}px`;
    }

    /**
     * 更新用于显示的 list 数据
     * 折叠状态变化的时候会重新生成 list 数组
     */
    private updateList() {
        const cacheList = this.getProperty('cacheList');
        const list: TreeItemRenderData[] = [];
        let tab = 9999;
        for (let item of cacheList) {
            if (item.tab > tab) {
                continue;
            }
            item.fold ? (tab = item.tab) : (tab = 9999);
            list.push(item);
        }
        this.setProperty('list', list);
    }

    /**
     * 将数据应用到所有 item 元素上
     */
    private applyItemDateLock = false;
    private applyItemData() {
        if (this.applyItemDateLock) {
            return;
        }
        this.applyItemDateLock = true;
        requestAnimationFrame(() => {
            this.applyItemDateLock = false;
            const offsetLine = this.getProperty('offsetLine');
            const list = this.getProperty('list');
            this.itemArray.forEach(($item, index) => {
                const data = list[offsetLine + index];
                if (data) {
                    $item.removeAttribute('hidden');
                    data && $item.setProperty('data', data);
                } else {
                    $item.setAttribute('hidden', '');
                }
            });
        });
    }

    /**
     * 默认的更新 Item 元素的函数
     * 执行 registerUpdateItem 可以被替换
     * @param $item 
     * @param data 
     */
    private updateItem($item: TreeItemElement, data: TreeItemRenderData) {
        const $name = $item.root.querySelector('[ref=name]');
        const $arrow = $item.root.querySelector('[ref=arrow]');

        // 名字
        $name && ($name.innerHTML = data.name + '');
        // 缩进
        $item.setAttribute('style', `--item-tab: ${data.tab}`);
        // 箭头
        if ($arrow) {
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
        }
    }

    onInit() {
        this.$section = this.shadowRoot.querySelector('section.content')! as HTMLElement;

        this.setProperty('lineHeight', 24);
        this.bindEvent();
        requestAnimationFrame(() => {
            this.updateContentHeight();
            this.updateMaxDisplayLine();
        });
    }

    onMounted() {

    }

    onRemoved() {

    }

    /**
     * 设置 Tree 数据
     * @param tree 
     */
    public setTreeData(tree: TreeItem[]) {
        const cacheList = convertTreeToList(tree);
        this.setProperty('cacheList', cacheList);
        this.updateList();
    }

    /**
     * 注册自定义的样式
     * 这个样式只影响当前的 tree 元素
     * tree 使用 :host，相信信息参考 shadowDOM 文档
     * @param style 
     */
    public registerStyle(style: string) {
        const $style = this.shadowRoot.querySelector('style.custom')!;
        $style.innerHTML = style;
    }

    /**
     * 注册一个 Item 的更新函数
     * 使用了自定义 item 才会需要定义这个函数
     * @param func 
     */
    public registerUpdateItem(func: ($item: TreeItemElement, data: TreeItemRenderData) => void) {
        this.updateItem = func;
    }
}

registerElement('tree', TreeElement);
