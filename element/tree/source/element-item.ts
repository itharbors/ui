'use strict';

import type {
    TreeItemRenderData,
    DetailChangeFold,
    DetailItemDataUpdated,
} from './interface';

import {
    BaseElement,
    registerElement,
    style,
} from '@itharbors/ui-core';

const HTML = /*html*/`
<slot></slot>
<section>
    <span ref="tab"></span>
    <span ref="arrow"></span>
    <span ref="name"></span>
</section>
`;

const STYLE = /*css*/`
${style.solid}
:host {
    display: block;
    box-sizing: border-box;
}
:host([custom]) > section {
    display: none;
}
[ref=tab] {
    display: inline-block;
    padding-left: calc(var(--item-tab) * 24px);
}
[ref=arrow] {
    position: relative;
    top: 1px;
    display: inline-block;
    cursor: pointer;
}
[ref=arrow][fold] {
    transform: rotate(-90deg);
}
[ref=arrow][hidden] {
    visibility: hidden;
}
[ref=arrow]:before {
    content: '';
    display: inline-block;
    width: calc(var(--item-element-height) / 4);
    height: calc(var(--item-element-height) / 4);
    position: relative;
    top: calc(var(--item-element-height) / -8);
    transform: rotate(-135deg);
    border-left: 2px solid #000;
    border-top: 2px solid #000;
}
`;

export class TreeItemElement extends BaseElement {
    get HTMLTemplate() {
        return HTML;
    }

    get HTMLStyle() {
        return STYLE;
    }

    get defaultData(): {
        // 显示数据
        data: TreeItemRenderData,
    } {
        return {
            data: {
                name: '',
                fold: false,
                arrow: false,
                tab: 0,
                data: undefined
            },
        };
    }

    public root!: HTMLElement | ShadowRoot;

    private bindEvent() {
        const $arrow = this.root.querySelector('[ref=arrow]');

        this.data.addPropertyListener('data', (data) => {
            this.dispatch<DetailItemDataUpdated>('item-data-updated', {
                detail: {
                    elem: this,
                    data
                },
            });
        });

        if ($arrow) {
            $arrow.addEventListener('mousedown', (event) => {
                event.stopPropagation();
                event.preventDefault();
                const data = this.data.getProperty('data');
                this.dispatch<DetailChangeFold>('change-fold', {
                    detail: {
                        elem: this,
                        fold: !data.fold,
                    },
                });
            });
        }
    }

    onInit() {
        if (this.innerHTML) {
            this.setAttribute('custom', '');
            this.root = this;
        } else {
            this.removeAttribute('custom');
            this.root = this.shadowRoot;
        }
        this.bindEvent();
    }

    onMounted() {

    }

    onRemoved() {

    }
}

registerElement('tree-item', TreeItemElement);
