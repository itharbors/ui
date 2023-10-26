'use strict';

import type { NodeInfo, LineInfo, SelectNodeInfo, SelectLineInfo } from '../../interface';

import { registerElement, BaseElement, style } from '@itharbors/ui-core';
import { generateUUID, queryParamInfo } from '../utils';
import { renderMesh, renderLines, renderNodes, bindEventListener, resizeCanvas, nodeElementMap } from './utils';
import { queryGraphFliter, queryGraphOption, eventEmmiter } from '../../manager';
import {
    ConnectNodeDetail,

    NodeAddedDetail,
    NodeRemovedDetail,
    NodeChangedDetail,

    NodeUnselectedDetail,

    LineAddedDetail,
    LineRemovedDetail,
    LineChangedDetail,

    SelectLineDetail,
    UnselectLineDetail,
    LineUnselectedDetail,
} from '../event-interface';
import { requestAnimtionFrameThrottling } from '../utils';

const HTML = /*html*/`
<canvas id="meshes"></canvas>
<div id="dom-box">
    <svg id="lines"></svg>
    <div id="nodes"></div>
</div>
<div class="select-box"></div>
`;

const STYLE = /*css*/`
${style.solid}
${style.line}
:host {
    --background-color: #1f1f1f;

    display: block;

    border-radius: calc(var(--size-radius) * 1px);
    border: 1px solid var(--border-color);
    box-sizing: border-box;
    background-color: var(--background-color);

    position: relative;
    overflow: hidden;

    --offset-x: 0;
    --offset-y: 0;
}
#meshes {
    width: 100%;
    height: 100%;
    position: absolute;
}
#dom-box {
    position: relative;
    height: 100%;
    width: 100%;
    transform: translate(var(--offset-x), var(--offset-y)) scale(var(--scale));
    will-change: transform;
}
#nodes {

}
#lines {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    overflow: visible;
    transition: opacity 0.3s;
}
#lines[hidden] {
    opacity: 0;
}

v-graph-node {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: center center;
    transform: translateX(0) translateX(var(--offset-x)) translateY(0) translateY(var(--offset-y));
    will-change: transform;
}
v-graph-node[moving] {
    z-index: 999;
}

.select-box {
    position: absolute;
    background: white;
    opacity: 0.3;
    width: 0;
    height: 0;
    top: 0;
    left: 0;
}
`;

export class GraphElement extends BaseElement {
    static get observedAttributes(): string[] {
        return [ 'type' ];
    }

    get HTMLTemplate() {
        return HTML;
    }

    get HTMLStyle() {
        return STYLE;
    }

    get defaultData(): {
        offset: { x: number, y: number, };
        calibration: { x: number, y: number, };
        selectBox: { x: number, y: number, w: number, h: number, };
        scale: number;
        nodes: { [key: string]: NodeInfo | undefined, };
        lines: { [key: string]: LineInfo | undefined, };
    } {
        return {
            // 中心偏移量，记录的是节点坐标系内的偏移量
            offset: { x: 0, y: 0, },
            // 记录节点坐标系与 HTML 坐标系的偏差
            calibration: { x: 0, y: 0, },
            // 框选区域，记录的坐标是 HTML 坐标
            selectBox: { x: 0, y: 0, w: 0, h: 0, },

            // 缩放比例
            scale: 1,

            // 渲染用的节点和线段数据
            nodes: {},
            lines: {},
        };
    }

    __selectLines__: Set<SVGGElement> = new Set;

    dispatch<T>(eventName: string, options?: EventInit & { detail: T }) {
        const targetOptions = {
            bubbles: false,
            cancelable: false,
        };
        if (options) {
            Object.assign(targetOptions, options);
        }
        const event = new CustomEvent<T>(eventName, targetOptions);
        this.dispatchEvent(event);
    }

    /**
     * 坐标转换，传入一个元素上获取的坐标，转换成 graph 内的一个坐标值
     * @param x 
     * @param y 
     * @returns 
     */
    convertCoordinate(x: number, y: number) {
        const calibration = this.getProperty('calibration') as { x: number, y: number, };
        const offset = this.getProperty('offset') as { x: number, y: number, };
        const scale = this.getProperty('scale') as number;

        return {
            x: (x - calibration.x - offset.x) / scale,
            y: (y - calibration.y - offset.y) / scale,
        };
    }

    /**
     * 生成一个空的 node 数据
     * @param type
     */
    generateNode(type?: string): NodeInfo {
        return {
            type: type || 'unknown',
            position: { x: 0, y: 0 },
            details: {},
        };
    }

    /**
     * 添加一个 node 数据
     * @param node
     * @param id
     */
    addNode(node: NodeInfo, id?: string): string | undefined {
        const uuid: string = id || generateUUID();
        const nodes = this.getProperty('nodes') as { [key: string]: NodeInfo | undefined, };
        nodes[uuid] = node;

        requestAnimationFrame(() => {
            this.data.emitProperty('nodes', nodes, nodes);
            this.dispatch<NodeAddedDetail>('node-added', {
                detail: {
                    node,
                },
            });
        });
        return uuid;
    }

    /**
     * 删除一个 Node
     * @param id
     */
    removeNode(id: string) {
        const nodes = this.getProperty('nodes');
        const node = nodes[id];
        if (!node) {
            return;
        }
        delete nodes[id];
        this.data.emitProperty('nodes', nodes, nodes);

        this.dispatch<NodeRemovedDetail>('node-removed', {
            detail: {
                node,
            },
        });

        return node;
    }

    /**
     * 设置一个节点的 details
     * @param id 
     * @param details 
     * @returns 
     */
    setNodeDetai(id: string, details: { [key: string]: any }) {
        const nodes = this.getProperty('nodes');
        const node = nodes[id];
        if (!node) {
            return;
        }
        node.details = details;
        this.dispatch<NodeChangedDetail>('node-changed', {
            detail: {
                id,
                node,
            },
        });
    }

    /**
     * 获取一个节点的 details
     * @param id 
     */
    getNodeDetai(id: string) {
        const nodes = this.getProperty('nodes');
        const node = nodes[id];
        return node ? node.details : '';
    }

    /**
     * 获取一个节点信息
     * @param id
     * @returns
     */
    getNode(id: string) {
        const nodes = this.data.getProperty('nodes');
        return nodes[id];
    }

    /**
     * 查询一个节点的 Element
     * @param id 
     * @returns 
     */
    queryNodeElement(id: string) {
        const $node = this.querySelector(`#nodes > v-graph-node[node-uuid="${id}"]`);
        return $node;
    }

    /**
     * 生成一个空的 line 数据
     * @param type
     */
    generateLine(type?: string, details?: { [key: string]: any }): LineInfo {
        return {
            type: type || 'straight',
            details: details || {},
            input: {
                node: '',
            },
            output: {
                node: '',
            },
        };
    }

    /**
     * 添加一个 line 数据
     * @param line
     * @param id
     */
    addLine(line: LineInfo, id?: string): string | undefined {
        const uuid = id || generateUUID();
        // HACK 连续调用接口会导致报错，添加线段需要在节点绘制完成后才能正常渲染
        setTimeout(() => {
            requestAnimationFrame(() => {
                const lines = this.getProperty('lines') as { [key: string]: LineInfo | undefined  };
                const nodes = this.data.getProperty('nodes');
                const graphType = this.data.getAttribute('type') || 'default';
                const lineFilter = queryGraphFliter(graphType, 'lineFilter');
                const input = queryParamInfo(this, line.input.node, line.input.param);
                const output = queryParamInfo(this, line.output.node, line.output.param);
                if (lineFilter!(nodes, lines, line, input, output)) {
                    lines[uuid] = line;
                    this.data.emitProperty('lines', lines, lines);
                    this.dispatch<LineAddedDetail>('line-added', {
                        detail: {
                            line,
                        },
                    });
                }
            });
        }, 20);
        return uuid;
    }

    /**
     * 删除一条连接线
     * @param id
     */
    removeLine(id: string) {
        const lines = this.getProperty('lines');
        const line = lines[id];
        if (!line) {
            return;
        }
        delete lines[id];
        this.data.emitProperty('lines', lines, lines);

        this.dispatch<LineRemovedDetail>('line-removed', {
            detail: {
                line,
            },
        });
        return line;
    }

    /**
     * 设置一个线段的 details
     * @param id 
     * @returns 
     */
    setLineDetail(id: string, details: { [key: string]: any }) {
        const lines = this.getProperty('lines');
        const line = lines[id];
        if (!line) {
            return;
        }
        line.details = details;
        this.dispatch<LineChangedDetail>('line-changed', {
            detail: {
                line,
            },
        });
    }

    /**
     * 获取一个线段的 details
     * @param id 
     * @returns 
     */
    getLineDetails(id: string) {
        const lines = this.getProperty('lines');
        const line = lines[id];
        return line ? line.details : '';
    }

    /**
     * 获取一个线段
     * @param id
     * @returns
     */
    getLine(id: string) {
        const lines = this.data.getProperty('lines');
        return lines ? lines[id] : undefined;
    }

    /**
     * 查询一个节点的 Element
     * @param id 
     * @returns 
     */
    queryLineElement(id: string) {
        const $line = this.querySelector(`#lines > g[line-uuid="${id}"]`);
        return $line;
    }

    /**
     * 清空数据
     */
    clear() {
        this.setProperty('nodes', []);
        this.setProperty('lines', []);
    }

    /**
     * 获取选中的所有节点
     * @returns 
     */
    getSelectedNodeList(): SelectNodeInfo[] {
        const nodeList: SelectNodeInfo[] = [];
        const nodes = this.getProperty('nodes') as { [key: string]: NodeInfo | undefined, };
        for (let id in nodes) {
            const node = nodes[id]!;
            const $node = nodeElementMap.get(node);
            if ($node && $node.getProperty('selected') === true) {
                nodeList.push({
                    id: id,
                    target: node,
                });
            }
        }
        return nodeList;
    }

    /**
     * 获取选中的所有线段
     * @returns 
     */
    getSelectedLineList(): SelectLineInfo[] {
        const lineList: SelectLineInfo[] = [];
        const lineMap = this.getProperty('lines');
        this.__selectLines__.forEach(($g) => {
            const uuid = $g.getAttribute('line-uuid');
            if (uuid) {
                const line = lineMap[uuid];
                line && lineList.push({
                    id: uuid,
                    target: line
                });
            }
        });
        return lineList;
    }

    /**
     * 清空所选的线段
     */
    clearAllLineSelected() {
        const lines = this.getProperty('lines');
        this.__selectLines__.forEach(($g) => {
            if ($g.hasAttribute('selected')) {
                $g.removeAttribute('selected');
                this.__selectLines__.delete($g);
                const uuid = $g.getAttribute('line-uuid')!;
                const custom = new CustomEvent<LineUnselectedDetail>('line-unselected', {
                    bubbles: false,
                    cancelable: false,
                    detail: {
                        line: lines[uuid]!,
                    },
                });
                this.shadowRoot.dispatchEvent(custom);
            }
        });
    }

    /**
     * 清空所哟选中的节点
     */
    clearAllBlockSelected() {
        const nodes = this.getProperty('nodes') as { [key: string]: NodeInfo | undefined, };
        for (let id in nodes) {
            const node = nodes[id]!;
            const $node = nodeElementMap.get(node);
            if ($node) {
                $node.setProperty('selected', false);
                const node = nodes[id];
                $node.dispatch<NodeUnselectedDetail>('node-unselected', {
                    cancelable: false,
                    bubbles: false,
                    detail: {
                        node,
                    },
                });
            }
        }
    }

    __connect__event__: any;

    /**
     * 开始连接节点/参数
     * @param lineType
     * @param nodeUUID
     * @param paramName
     * @param paramDirection
     * @returns
     */
    startConnect(lineType: LineInfo['type'], nodeUUID: string, paramName?: string, paramDirection?: 'input' | 'output', details?: { [key: string]: any }) {
        const lines = this.data.getProperty('lines') as { [key: string]: LineInfo | undefined, };
        const nodes = this.data.getProperty('nodes') as { [key: string]: NodeInfo | undefined, };
        let line = this.getLine('connect-param-line');
        // 如果已经有线段了，说明是连接第二个点
        if (line) {
            this.stopConnect();
            let dt: 'input' | 'output' = 'output';
            if (paramDirection === 'output') {
                dt = 'input';
            }
            if (line[dt].__fake) {
                delete line[dt].__fake;
                line[dt].node = nodeUUID;
                line[dt].param = paramName;
                this.dispatch('node-connected', {
                    detail: {
                        line,
                    },
                });
            } else {
                this.data.emitProperty('lines', lines, lines);
            }
            return;
        }
        line = this.generateLine(lineType);
        const fake = this.generateNode();
        const calibration = this.data.getProperty('calibration');
        const offset = this.data.getProperty('offset');
        if (paramDirection === 'input') {
            line.output.node = nodeUUID;
            line.output.param = paramName;
            const nodeE = nodes[line.output.node];
            if (nodeE) {
                fake.position.x = nodeE.position.x + 1;
                fake.position.y = nodeE.position.y + 1;
            }
            line.input.__fake = fake
        } else if (paramDirection === 'output') {
            line.input.node = nodeUUID;
            line.input.param = paramName;
            const nodeE = nodes[line.input.node];
            if (nodeE) {
                fake.position.x = nodeE.position.x + 1;
                fake.position.y = nodeE.position.y + 1;
            }
            line.output.__fake = fake;
        } else {
            line.input.node = nodeUUID;
            const nodeE = nodes[line.input.node];
            if (nodeE) {
                fake.position.x = nodeE.position.x + 1;
                fake.position.y = nodeE.position.y + 1;
            }
            line.output.__fake = fake;
        }
        // 绕过线段检查
        lines['connect-param-line'] = line;
        this.data.emitProperty('lines', lines, lines);
        this.__connect__event__ = (event: MouseEvent) => {
            const scale = this.data.getProperty('scale');
            fake.position.x =  (event.offsetX - calibration.x - offset.x) / scale;
            fake.position.y =  (event.offsetY - calibration.y - offset.y) / scale;
            this.data.emitProperty('lines', lines, lines);
        };
        this.addEventListener('mousemove', this.__connect__event__);
    }

    /**
     * 是否正在连接动作中
     * @returns
     */
    hasConnect() {
        const lines = this.data.getProperty('lines');
        return !!this.getLine('connect-param-line');
    }

    /**
     * 中断连接动作
     */
    stopConnect() {
        const lines = this.data.getProperty('lines');
        delete lines['connect-param-line'];
        this.data.emitProperty('lines', lines, lines);
        this.removeEventListener('mousemove', this.__connect__event__);
    }

    onInit() {
        bindEventListener(this);

        // 初始化数据
        const $canvas = this.querySelector('canvas')! as HTMLCanvasElement;
        const ctx = $canvas.getContext('2d')!;

        const refresh = requestAnimtionFrameThrottling(() => {
            const box = this.getBoundingClientRect();
            const offset = this.data.getProperty('offset');
            const scale = this.data.getProperty('scale');
            const graphType = this.data.getAttribute('type') || 'default';
            const option = queryGraphOption(graphType);
            $domBox.setAttribute('style', `--offset-x: ${offset.x}px; --offset-y: ${offset.y}px; --scale: ${scale};`);
            resizeCanvas(this, $canvas, box);
            renderMesh(this, ctx, box, offset, scale, option);
            renderNodes(this, offset, scale);
            renderLines(this, offset, scale);
        });
        const refreshWithoutData = requestAnimtionFrameThrottling(() => {
            const box = this.getBoundingClientRect();
            const offset = this.data.getProperty('offset');
            const scale = this.data.getProperty('scale');
            const graphType = this.data.getAttribute('type') || 'default';
            const option = queryGraphOption(graphType);
            $domBox.setAttribute('style', `--offset-x: ${offset.x}px; --offset-y: ${offset.y}px; --scale: ${scale};`);
            // resizeCanvas(this, $canvas, box);
            renderMesh(this, ctx, box, offset, scale, option);
            // renderNodes(this, offset, scale);
            // renderLines(this, offset, scale);
        });

        const $domBox = this.querySelector('#dom-box')!;
        // 监听 scale 变化
        this.data.addPropertyListener('scale', (scale) => {
            refreshWithoutData();
        });

        // 监听 offset 变化
        this.data.addPropertyListener('offset', (offset) => {
            refreshWithoutData();
        });

        eventEmmiter.addListener('node-registered', (graph, type) => {
            const $nodes = this.querySelectorAll('#nodes > v-graph-node');
            const nodes = this.data.getProperty('nodes');
            // 循环已有的 HTML 节点
            for (let i = 0; i < $nodes.length; i++) {
                const $node = $nodes[i] as BaseElement;
                const uuid = $node.getAttribute('node-uuid') || '';
                const node = nodes[uuid];

                if (node && node.type === type) {
                    // 更新已存在的节点内的数据
                    $node.data.emitProperty('type', node.type, node.type);
                }
            }
        });

        // 监听 nodes 变化
        this.data.addPropertyListener('nodes', (nodes) => {
            const offset = this.data.getProperty('offset');
            const scale = this.data.getProperty('scale');
            renderNodes(this, offset, scale);
        });

        // 监听 lines 变化
        this.data.addPropertyListener('lines', (lines) => {
            requestAnimationFrame(() => {
                debugger;
                const offset = this.data.getProperty('offset');
                const scale = this.data.getProperty('scale');
                renderLines(this, offset, scale);
            });
        });

        // 监听 selectBox 变化，框选检测
        const $selectBox = this.querySelector('.select-box')!;
        this.data.addPropertyListener('selectBox', (selectBox) => {
            // 设置遮罩
            $selectBox.setAttribute('style', `top: ${selectBox.y}px; left: ${selectBox.x}px; width: ${selectBox.w}px; height: ${selectBox.h}px;`);

            const nodes = this.data.getProperty('nodes') as { [key: string]: NodeInfo | undefined, };

            if (
                selectBox.x === 0 &&
                selectBox.y === 0 &&
                selectBox.w === 0 &&
                selectBox.h === 0
            ) {
                return;
            }

            this.clearAllLineSelected();

            const selectBoxBoundingClientRect = $selectBox.getBoundingClientRect();
            for (let key in nodes) {
                const node = nodes[key]!;
                const $node = nodeElementMap.get(node)!;
                const nodeBoundingClientRect = $node.getBoundingClientRect();

                if (
                    selectBoxBoundingClientRect.left < nodeBoundingClientRect.right &&
                    selectBoxBoundingClientRect.right > nodeBoundingClientRect.left &&
                    selectBoxBoundingClientRect.top < nodeBoundingClientRect.bottom &&
                    selectBoxBoundingClientRect.bottom > nodeBoundingClientRect.top
                ) {
                    $node.setProperty('selected', true);
                    continue;
                }
                $node.setProperty('selected', false);
            }
        });

        this.data.addAttributeListener('type', (graphType) => {
            const box = this.getBoundingClientRect();
            const offset = this.data.getProperty('offset');
            const scale = this.data.getProperty('scale');
            const option = queryGraphOption(graphType);
            renderMesh(this, ctx, box, offset, scale, option);
        });

        // 拖拽参数连线
        this.shadowRoot.addEventListener('connect-node', (event) => {
            const cEvent = event as CustomEvent<ConnectNodeDetail>;
            const { node, param, paramDirection, lineType, details } = cEvent.detail;
            this.startConnect(lineType, node, param, paramDirection, details);
        });

        requestAnimationFrame(refresh);

        // 创建 ResizeObserver 实例
        const resizeObserver = new ResizeObserver(entries => {
            // 在尺寸变化时执行的回调函数
            entries.forEach(entry => {
                if (entry.target === this) {
                    refresh();
                }
            });
        });
        // 将 ResizeObserver 添加到要观察的元素上
        resizeObserver.observe(this);
    }
}
registerElement('graph', GraphElement);
