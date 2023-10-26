'use strict';

/**
 * 框架基础元素
 * 其他元素都继承自这个元素，职责包含：
 *   1. 管理定义生命周期函数
 *   2. 数据管理（data、attribute）
 */
export class BaseElement extends HTMLElement {
    protected DEBUG = true;

    /**
     * @description 监听 attribute 修改，需要继承的元素自己重写这个方法
     */
    static get observedAttributes(): string[] {
        return [];
    }

    /**
     * 元素 shadowDOM 内的 HTML
     */
    protected get HTMLTemplate(): string {
        return '';
    };

    /**
     * 元素 shadowDOM 内的 STYLE
     */
    protected get HTMLStyle(): string {
        return '';
    };

    /**
     * 默认数据，这份数据需要完整的给出定义
     * 会在 getProperty 的时候自动识别类型
     */
    get defaultData(): {
        [key: string]: object | number | string | boolean | null;
    } {
        return {};
    }

    querySelector(selector: string) {
        return this.shadowRoot.querySelector(selector);
    }
    
    querySelectorAll(selector: string) {
        return this.shadowRoot.querySelectorAll(selector);
    }

    getProperty<K extends string>(key: K): this['defaultData'][K] {
        return this.data.getProperty(key);
    }

    setProperty(key: string, value: any) {
        return this.data.setProperty(key, value);
    }

    dispatch<T>(eventName: string, options?: EventInit & { detail: T }) {
        const targetOptions = {
            bubbles: true,
            cancelable: true,
        };
        if (options) {
            Object.assign(targetOptions, options);
        }
        const event = new CustomEvent<T>(eventName, targetOptions);
        this.dispatchEvent(event);
    }

    protected initialize() {
        this.shadowRoot.innerHTML = `<style>${this.HTMLStyle}</style>${this.HTMLTemplate}`;
        // for (let key in this.listener.attrs) {
        //     this.data.addAttributeListener(key, this.listener.attrs[key]);
        // }
        for (let key in this.defaultData) {
            if (key in this.data.stash) {
                continue;
            }
            this.data.stash[key] = JSON.parse(JSON.stringify(this.defaultData[key]));
        }
        
        this.onInit();
        if (this.isConnected) {
            this.onMounted();
        }
    }

    protected onInit() {};
    protected onMounted() {};
    protected onRemoved() {};

    public data = new DataManager(this);

    public shadowRoot!: ShadowRoot;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.initialize();
    }

    attributeChangedCallback(key: string, legacy: string, value: string) {
        this.data.emitAttribute(key, value, legacy);
    }

    connectedCallback() {
        this.onMounted();
    }

    distconnectedCallback() {
        this.onRemoved();
    }
}

class DataManager<T extends BaseElement> {
    private root: BaseElement;
    constructor(root: T) {
        this.root = root;
    }

    stash: { [key: string]: any } = {};
    private propertyEventMap: { [key: string]: ((value: any, legacy: any) => void)[]} = {};
    touchProperty(key: string) {
        const legacy = this.getProperty(key);
        this.emitProperty(key, legacy, legacy);
    }
    getProperty<K extends string>(key: K): T['defaultData'][K] {
        return this.stash[key];
    }
    setProperty(key: string, value: any) {
        const legacy = this.stash[key];
        if (this.stash[key] === value) {
            return;
        }
        this.stash[key] = value;
        this.emitProperty(key, value, legacy);
    }
    addPropertyListener(key: string, handle: (value: any, legacy: any) => void) {
        const list = this.propertyEventMap[key] = this.propertyEventMap[key] || [];
        list.push(handle);
    }
    removePropertyListener(key: string, handle: (value: any, legacy: any) => void) {
        const list = this.propertyEventMap[key];
        if (!list) {
            return;
        }
        const index = list.indexOf(handle);
        if (index !== -1) {
            list.splice(index, 1);
        }
    }
    emitProperty(key: string, value: any, legacy: any) {
        const list = this.propertyEventMap[key];
        if (!list) {
            return;
        }
        list.forEach((func) => {
            func.call(this.root, value, legacy);
        });
    }

    private attributeEventMap: { [key: string]: ((value: any, legacy: any) => void)[]} = {};
    touchAttribute(key: string) {
        const legacy = this.getAttribute(key);
        this.emitAttribute(key, legacy, legacy);
    }
    getAttribute(key: string) {
        return this.root.getAttribute(key) || '';
    }
    setAttribute(key: string, value: string) {
        const legacy = this.getAttribute(key);
        this.root.setAttribute(key, value);
        this.emitAttribute(key, value, legacy);
    }
    addAttributeListener(key: string, handle: (value: string, legacy: string) => void) {
        const list = this.attributeEventMap[key] = this.attributeEventMap[key] || [];
        list.push(handle);
    }
    removeAttributeListener(key: string, handle: (value: any, legacy: any) => void) {
        const list = this.attributeEventMap[key];
        if (!list) {
            return;
        }
        const index = list.indexOf(handle);
        if (index !== -1) {
            list.splice(index, 1);
        }
    }
    emitAttribute(key: string, value: string, legacy: string) {
        const list = this.attributeEventMap[key];
        if (!list) {
            return;
        }
        list.forEach((func) => {
            func.call(this.root, value, legacy);
        });
    }

    // setSchema(schema: any) {}
}
