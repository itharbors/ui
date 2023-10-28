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

    /**
     * 在这个 UI 元素内查询一个内部元素
     * @param selector 
     * @returns 
     */
    deepQuerySelector(selector: string) {
        return this.shadowRoot.querySelector(selector);
    }

    /**
     * 在这个 UI 元素内查询所有符合条件的内部元素
     * @param selector 
     * @returns 
     */
    deepQueryInternalSelectorAll(selector: string) {
        return this.shadowRoot.querySelectorAll(selector);
    }

    /**
     * 获取一个存储的属性
     * @param key 
     * @returns 
     */
    getProperty<K extends keyof this['defaultData']>(key: K): this['defaultData'][K] {
        return this.data.getProperty(key);
    }

    /**
     * 设置一个属性的值
     * @param key 
     * @param value 
     * @returns 
     */
    setProperty<K extends keyof this['defaultData']>(key: K, value: this['defaultData'][K]) {
        return this.data.setProperty(key, value);
    }

    /**
     * 触发一个自定义事件
     * @param eventName 
     * @param options 
     */
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
        
        this.onInit();
        if (this.isConnected) {
            this.onMounted();
        }
    }

    protected onInit() {};
    protected onMounted() {};
    protected onRemoved() {};

    public data = new DataManager(this, this.defaultData);

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

    disconnectedCallback() {
        this.onRemoved();
    }
}

class DataManager<T extends BaseElement> {
    private root: BaseElement;

    public stash: T['defaultData'];

    constructor(root: T, data: T['defaultData']) {
        this.root = root;
        const stash: Partial<T['defaultData']> = {};

        for (let key in data) {
            stash[key] = JSON.parse(JSON.stringify(data[key]));
        }
        this.stash = stash as T['defaultData'];
    }

    private propertyEventMap: Partial<Record<keyof T['defaultData'], ((value: any, legacy: any) => void)[]>> = {};
    touchProperty<K extends keyof T['defaultData']>(key: K) {
        const legacy = this.getProperty(key);
        this.emitProperty(key, legacy, legacy);
    }
    getProperty<K extends keyof T['defaultData']>(key: K): T['defaultData'][K] {
        return this.stash[key];
    }
    setProperty<K extends keyof T['defaultData']>(key: K, value: T['defaultData'][K]) {
        const legacy = this.stash[key];
        if (this.stash[key] === value) {
            return;
        }
        this.stash[key] = value;
        this.emitProperty(key, value, legacy);
    }
    addPropertyListener<K extends keyof T['defaultData']>(key: K, handle: (value: T['defaultData'][K], legacy: T['defaultData'][K]) => void) {
        const list = this.propertyEventMap[key] = this.propertyEventMap[key] || [];
        list.push(handle);
    }
    removePropertyListener<K extends keyof T['defaultData']>(key: K, handle: (value: T['defaultData'][K], legacy: T['defaultData'][K]) => void) {
        const list = this.propertyEventMap[key];
        if (!list) {
            return;
        }
        const index = list.indexOf(handle);
        if (index !== -1) {
            list.splice(index, 1);
        }
    }
    emitProperty<K extends keyof T['defaultData']>(key: K, value: T['defaultData'][K], legacy: T['defaultData'][K]) {
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
