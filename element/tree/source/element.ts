'use strict';

import { createElement, style } from '@itharbors/ui-core';

export const TreeElement = createElement('tree', {
    template: /*html*/`
<div>
    <slot></slot>
</div>
    `,

    style: /*css*/`
${style.solid}
${style.line}

:host {
    border-radius: calc(var(--size-radius) * 1px);
    border: 1px solid var(--border-color);
    line-height: var(--line-height);
    height: var(--line-height);
    box-sizing: border-box;
    cursor: pointer;
    background-color: var(--background-color);
}
:host > div {
    border: none;
    outline: none;
    background: none;
    padding: 0;
    flex: 1;
    font-size: var(--font-size);
    line-height: var(--line-height);
    color: var(--font-color);
    margin: 0 var(--padding-row);
}
    `,

    attrs: {},

    data: {},

    methods: {},

    onInit() {

    },

    onMounted() {

    },

    onRemoved() {

    },
});