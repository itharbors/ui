'use strict';

import './theme.js';
import { BaseElement } from './element.js';

export { BaseElement };

export class CustomElementOption {
    template: string = '';
    style: string = '';

    static attrListenList: string[] = [];

    attrs: {
        [key: string]: (this: BaseElement, value: string, legacy: string) => void;
    } = {};

    data: {
        [key: string]: string | number | boolean | object;
    } = {};

    methods: {
        [key: string]: (...args: any[]) => void;
    } = {};

    element: BaseElement;
    constructor(elem: BaseElement) {
        this.element = elem;
    }
}

export function registerElement(name: string, element: typeof BaseElement) {
    window.customElements.define(`v-${name}`, element);
}

export const style = {
    /**
     * 实心样式
     */
    solid: /*css*/`
    :host {
        --background-color: var(--ui-color-default);
        --font-color: var(--ui-color-default-contrast);
        --border-color: var(--ui-color-default-line);
    }
    :host([color="primary"]) {
        --background-color: var(--ui-color-primary);
        --font-color: var(--ui-color-primary-contrast);
        --border-color: var(--ui-color-primary-line);
    }
    :host([color="success"]) {
        --background-color: var(--ui-color-success);
        --font-color: var(--ui-color-success-contrast);
        --border-color: var(--ui-color-success-line);
    }
    :host([color="danger"]) {
        --background-color: var(--ui-color-danger);
        --font-color: var(--ui-color-danger-contrast);
        --border-color: var(--ui-color-danger-line);
    }
    :host([color="warn"]) {
        --background-color: var(--ui-color-warn);
        --font-color: var(--ui-color-warn-contrast);
        --border-color: var(--ui-color-warn-line);
    }
    :host([disabled]) {
        opacity: 0.4;
    }
    :host([disabled]), :host([readonly]) {
        cursor: not-allowed;
    }
    `,

    /**
     * 空心样式
     */
    hollow: /*css*/`
    :host {
        --background-color: transparent;
        --font-color: var(--ui-color-default-contrast);
        --border-color: var(--ui-color-default-line);
    }
    :host([color="primary"]) {
        --font-color: var(--ui-color-primary);
        --border-color: var(--ui-color-primary-line);
    }
    :host([color="success"]) {
        --font-color: var(--ui-color-success);
        --border-color: var(--ui-color-success-line);
    }
    :host([color="danger"]) {
        --font-color: var(--ui-color-danger);
        --border-color: var(--ui-color-danger-line);
    }
    :host([color="warn"]) {
        --font-color: var(--ui-color-warn);
        --border-color: var(--ui-color-warn-line);
    }
    :host([disabled]) {
        opacity: 0.4;
    }
    :host([disabled]), :host([readonly]) {
        cursor: not-allowed;
    }
    `,
    
    line: /*css*/`
    :host {
        display: inline-flex;
    
        --line-height: calc(var(--ui-size-line) * 1px);
        --font-size: calc(var(--ui-size-font) * 1px);
    
        --padding-row: calc((var(--ui-size-line) - var(--ui-size-font)) * 0.8px);
        --padding-column: calc((var(--ui-size-line) - var(--ui-size-font)) * 0.2px);
    }
    `,
};
