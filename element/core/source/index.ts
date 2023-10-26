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
        --background-color: var(--color-default);
        --font-color: var(--color-default-contrast);
        --border-color: var(--color-default-line);
    }
    :host([color="primary"]) {
        --background-color: var(--color-primary);
        --font-color: var(--color-primary-contrast);
        --border-color: var(--color-primary-line);
    }
    :host([color="success"]) {
        --background-color: var(--color-success);
        --font-color: var(--color-success-contrast);
        --border-color: var(--color-success-line);
    }
    :host([color="danger"]) {
        --background-color: var(--color-danger);
        --font-color: var(--color-danger-contrast);
        --border-color: var(--color-danger-line);
    }
    :host([color="wranning"]) {
        --background-color: var(--color-wranning);
        --font-color: var(--color-wranning-contrast);
        --border-color: var(--color-wranning-line);
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
        --font-color: var(--color-default-contrast);
        --border-color: var(--color-default-line);
    }
    :host([color="primary"]) {
        --font-color: var(--color-primary);
        --border-color: var(--color-primary-line);
    }
    :host([color="success"]) {
        --font-color: var(--color-success);
        --border-color: var(--color-success-line);
    }
    :host([color="danger"]) {
        --font-color: var(--color-danger);
        --border-color: var(--color-danger-line);
    }
    :host([color="wranning"]) {
        --font-color: var(--color-wranning);
        --border-color: var(--color-wranning-line);
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
    
        --line-height: calc(var(--size-line) * 1px);
        --font-size: calc(var(--size-font) * 1px);
    
        --padding-row: calc((var(--size-line) - var(--size-font)) * 0.8px);
        --padding-column: calc((var(--size-line) - var(--size-font)) * 0.2px);
    }
    `,
};
