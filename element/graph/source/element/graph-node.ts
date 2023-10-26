'use strict';

import type { SelectNodeDetail, MoveNodeDetail, InterruptMoveNodeDetail, UnselectNodeDetail, ClearSelectNodeDetail, ConnectNodeDetail, InterruptConnectNodeDetail } from './event-interface';
import type { GraphElement } from './graph';

import { registerElement, BaseElement } from '@itharbors/ui-core';
import { queryNode } from '../manager';

type GraphNodeElementData = {
    scale: number;
    // 图类型
    graphType: string;
    // 类型
    type: string;
    // 是否选中
    selected: boolean;
    // 附加描述信息
    details: { [key: string]: any };
    // 节点所在的坐标
    position: { x: number, y: number };

    // 拖拽过程中需要使用的临时变量，拖拽
    moveStartPoint: { x: number, y: number, pageX: number, pageY: number };
};

export class GraphNodeElement extends BaseElement {
    get HTMLTemplate() {
        return /*html*/``;
    }

    get HTMLStyle() {
        return /*css*/``;
    }

    get defaultData(): GraphNodeElementData {
        return {
            scale: 1,
            graphType: '',
            type: '',
            selected: false,
            details: {},
            position: { x: 0, y: 0 },
            moveStartPoint: { x: 0, y: 0, pageX: 0, pageY: 0, },
        };
    }

    getHost() {
        const $shadom = this.getRootNode() as ShadowRoot;
        return $shadom?.host;
    }

    /**
     * 开始拖拽节点
     * 运行后，节点开始随着鼠标移动
     * 直到执行 stopMove 或者点击一下页面
     */
    startMove() {
        const custom = new CustomEvent<MoveNodeDetail>('move-node', {
            bubbles: false,
            cancelable: false,
            detail: {
                node: this,
            },
        });
        (this.getRootNode() as ShadowRoot).dispatchEvent(custom);
    }

    /**
     * 停止拖拽
     * 在没有开始拖拽的时候执行无效
     */
    stopMove() {
        const custom = new CustomEvent<InterruptMoveNodeDetail>('interrupt-move-node', {
            bubbles: false,
            cancelable: false,
            detail: {},
        });
        (this.getRootNode() as ShadowRoot).dispatchEvent(custom);
    }

    /**
     * 开始连接其他节点
     * 运行后，连接线从起始位置到鼠标位置结束
     * 直到另一个节点上触发 startConnect，或者在空白区域点击
     * @param type 
     * @param param 
     * @param paramDirection 
     * @returns 
     */
    startConnect(type: string, param?: string, paramDirection?: 'input' | 'output', details?: { [key: string]: any }) {
        const uuid = this.data.getAttribute('node-uuid');
        if (!uuid) {
            return;
        }

        const custom = new CustomEvent<ConnectNodeDetail>('connect-node', {
            bubbles: false,
            cancelable: false,
            detail: {
                lineType: type,
                node: uuid,
                param,
                paramDirection,
                details,
            },
        });
        (this.getRootNode() as ShadowRoot).dispatchEvent(custom);
    }

    /**
     * 判断当前是否在连接过程中
     * @returns 
     */
    hasConnect() {
        const $graph = this.getRootNode() as ShadowRoot;
        return ($graph.host as GraphElement).hasConnect();
    }

    /**
     * 停止连接动作
     * 没有开始连接的时候执行无效
     */
    stopConnect() {
        const custom = new CustomEvent<InterruptConnectNodeDetail>('interrupt-connect-node', {
            bubbles: false,
            cancelable: false,
            detail: {},
        });
        (this.getRootNode() as ShadowRoot).dispatchEvent(custom);
    }

    /**
     * 选中当前节点
     */
    select(option: Omit<SelectNodeDetail, 'target'>) {
        const custom = new CustomEvent<SelectNodeDetail>('select-node', {
            bubbles: false,
            cancelable: false,
            detail: {
                target: this,
                clearLines: option.clearLines,
                clearNodes: option.clearNodes,
            },
        });
        (this.getRootNode() as ShadowRoot).dispatchEvent(custom);
    }

    /**
     * 取消选中当前节点
     */
    unselect() {
        const custom = new CustomEvent<UnselectNodeDetail>('unselect-node', {
            bubbles: false,
            cancelable: false,
            detail: {
                target: this,
            },
        });
        (this.getRootNode() as ShadowRoot).dispatchEvent(custom);
    }

    /**
     * 清空所有选中的元素
     */
    clearOtherSelected() {
        const custom = new CustomEvent<ClearSelectNodeDetail>('clear-select-node', {
            bubbles: false,
            cancelable: false,
            detail: {},
        });
        (this.getRootNode() as ShadowRoot).dispatchEvent(custom);
    }

    /**
     * 绑定默认的参数连接事件
     */
    bindDefaultParamEvent() {
        const $paramList = this.querySelectorAll(`v-graph-node-param`);
        Array.prototype.forEach.call($paramList, ($param) => {
            $param.addEventListener('mousedown', (event: MouseEvent) => {
                event.stopPropagation();
                event.preventDefault();

                const name = $param.getAttribute('name');
                if (!name) {
                    return;
                }
                const paramDirection = $param.getAttribute('direction');
                if (paramDirection !== 'input' && paramDirection !== 'output') {
                    return;
                }
                this.startConnect('', name, paramDirection);
            });
        });
    }

    /**
     * 绑定默认的鼠标点击后移动事件
     */
    bindDefaultMoveEvent() {
        // 拖拽移动
        this.addEventListener('mousedown', (event) => {
            event.stopPropagation();
            event.preventDefault();
            if (!this.hasAttribute('selected')) {
                if (!(event as MouseEvent).metaKey && !(event as MouseEvent).ctrlKey) {
                    this.clearOtherSelected();
                }
                const clear = event.metaKey || event.ctrlKey;
                this.select({
                    clearLines: !clear,
                    clearNodes: !clear,
                });
            }
            this.startMove();
        });
    }

    onInit() {
        let inited = false;
        this.data.addPropertyListener('type', (type, legacy) => {
            const graphType = this.data.getProperty('graphType');
            const panel = queryNode(graphType, type);
            const details = this.data.getProperty('details');

            if (panel) {
                this.shadowRoot.innerHTML = `<style>:host > * {transform: translate3d(0, 0, 0);}\n${panel.style}\n</style>\n${panel.template}`;
            }
            inited && panel.onUpdate.call(this, details);
        });

        this.data.addPropertyListener('details', (details) => {
            const type = this.data.getProperty('type');
            const graphType = this.data.getProperty('graphType');
            const panel = queryNode(graphType, type);
            panel.onInit.call(this, details);
            inited = true;
            inited && panel.onUpdate.call(this, details);
        });

        this.data.addPropertyListener('position', (position, legacy) => {
            this.setAttribute('style', `--offset-x: ${position.x}px; --offset-y: ${position.y}px;`);
        });

        this.data.addPropertyListener('selected', (selected, legacy) => {
            if (selected) {
                this.setAttribute('selected', '');
            } else {
                this.removeAttribute('selected');
            }
        });
    }

    onUpdate() {
        const type = this.data.getProperty('type');
        const graphType = this.data.getProperty('graphType');
        const details = this.data.getProperty('details');
        const panel = queryNode(graphType, type);
        panel.onUpdate.call(this, details);
    }
}
registerElement('graph-node', GraphNodeElement);
