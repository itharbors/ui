'use strict';

import { LineInfo, NodeInfo, GraphOption } from './interface';
import type { ParamConnectData } from './element/graph/data';
import type { GraphNodeElement } from './element/graph-node';
import { EventEmmiter } from './event';

export const eventEmmiter = new EventEmmiter();

/**
 * Type 管理器
 * 注册一个 type 怎么渲染
 */

interface NodeTypeOption {
    template: string;
    style: string;
    onInit(this: GraphNodeElement, ...args: any[]): void;
    onUpdate(this: GraphNodeElement, ...args: any[]): void;
}

interface LineTypeOption {
    template: string;
    style: string;
    updateSVGPath(
        $path: SVGGElement,
        scale: number,
        data: ParamConnectData,
        line: LineInfo,
        lines: { [key: string]: LineInfo | undefined },
    ): void;
}

interface ParamInfo {
    direction: string | null;
    type: string | null;
    name: string | null;
    role: string | null;
};

interface GraphFliter {
    lineFilter?(
        nodes: { [key: string]: NodeInfo | undefined  },
        lines: { [key: string]: LineInfo | undefined  },
        line: LineInfo,
        input?: ParamInfo,
        output?: ParamInfo,
    ): boolean;
}

interface GraphInfo {
    nodeMap: Map<string, NodeTypeOption>;
    lineMap: Map<string, LineTypeOption>;
    graphFilter: GraphFliter;
    option: GraphOption;
}
const graphTypeMap: Map<string, GraphInfo> = new Map();
function generateDefaultGraph(): GraphInfo {
    return {
        nodeMap: new Map(),
        lineMap: new Map(),
        graphFilter: {},
        option: {},
    }
}

export function registerGraphOption(graphType: string, option: GraphOption) {
    if (!graphTypeMap.has(graphType)) {
        graphTypeMap.set(graphType, generateDefaultGraph());
    }
    const graphInfo = graphTypeMap.get(graphType)!;
    graphInfo.option = option;

    eventEmmiter.emit('graph-registered', graphType, option);
}

export function queryGraphOption(graphType: string) {
    if (!graphTypeMap.has(graphType)) {
        graphTypeMap.set(graphType, generateDefaultGraph());
    }
    return graphTypeMap.get(graphType)!.option;
}

// Node

export function registerNode(graphType: string, nodeType: string, option: NodeTypeOption) {
    if (!graphTypeMap.has(graphType)) {
        graphTypeMap.set(graphType, generateDefaultGraph());
    }
    const graphInfo = graphTypeMap.get(graphType)!;
    graphInfo.nodeMap.set(nodeType, option);

    eventEmmiter.emit('node-registered', graphType, nodeType, option);
}

/**
 * 查询自定义节点信息
 * 如果没有信息，则返回 graphType:* nodeType:* 位置的数据
 * @param graphType 
 * @param nodeType 
 * @returns 
 */
export function queryNode(graphType: string, nodeType: string): NodeTypeOption {
    const graphInfo = graphTypeMap.get(graphType);
    if (!graphInfo) {
        const defaultGraphInfo = graphTypeMap.get('*')!;
        return defaultGraphInfo!.nodeMap.get(nodeType) || defaultGraphInfo!.nodeMap.get('*')!;
    }
    const nodeTypeOption = graphInfo.nodeMap.get(nodeType);
    if (!nodeTypeOption) {
        const defaultGraphInfo = graphTypeMap.get('*')!;
        return defaultGraphInfo!.nodeMap.get(nodeType) || defaultGraphInfo!.nodeMap.get('*')!;
    }
    return nodeTypeOption;
}

registerNode('*', 'unknown', {
    template: /*html*/`<div>Unknown</div>`,
    style: /*css*/`div { background: #77777799; color: #eee; padding: 6px 12px; }`,
    onInit() {},
    onUpdate() {},
});
registerNode('*', '*', queryNode('*', 'unknown'));

// Line

export function registerLine(graphType: string, lineType: string, option: LineTypeOption) {
    if (!graphTypeMap.has(graphType)) {
        graphTypeMap.set(graphType, generateDefaultGraph());
    }
    const graphInfo = graphTypeMap.get(graphType)!;
    graphInfo.lineMap.set(lineType, option);

    eventEmmiter.emit('node-registered', graphType, lineType, option);
}

export function queryLine(graphType: string, lineType: string): LineTypeOption {
    const graphInfo = graphTypeMap.get(graphType);
    if (!graphInfo) {
        const defaultGraphInfo = graphTypeMap.get('*')!;
        return defaultGraphInfo!.lineMap.get(lineType) || defaultGraphInfo!.lineMap.get('*')!;
    }
    const nodeTypeOption = graphInfo.lineMap.get(lineType);
    if (!nodeTypeOption) {
        const defaultGraphInfo = graphTypeMap.get('*')!;
        return defaultGraphInfo!.lineMap.get(lineType) || defaultGraphInfo!.lineMap.get('*')!;
    }
    return nodeTypeOption;
}

function getAngle(x1: number, y1: number, x2: number, y2: number) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const angleRadians = Math.atan2(deltaY, deltaX);
    const angleDegrees = angleRadians * 180 / Math.PI;
    return angleDegrees;
}

registerLine('*', 'straight', {
    template: /*svg*/`
<path d=""></path>
<polygon points=""></polygon>
    `,
// <text dominant-baseline="middle" text-anchor="middle">4</text>
    style: /*css*/`
g[type="straight"] > path, g[type="straight"] > polygon {
    fill: none;
    stroke: #fafafa;
    stroke-width: 2px;
    transition: stroke 0.3s, fill 0.3s;
}
g[type="straight"]:hover > path, g[type="straight"]:hover > polygon, g[type="straight"]:hover > text {
    stroke: #666;
}
g[type="straight"][selected] > path, g[type="straight"][selected] > polygon, g[type="straight"][selected] > text {
    stroke: #666;
}
g[type="straight"] > polygon {
    fill: #fafafa;
}
g[type="straight"]:hover > polygon {
    fill: #666;
}
g[type="straight"][selected] > polygon {
    fill: #666;
}
g[type="straight"] > text {
    fill: #fafafa;
}
    `,
    updateSVGPath($g, scale, data) {
        if (data.nodeA === data.nodeB) {
            const rect = data.getNodeABoundingClientRect();
            const position = {
                x: data.x1 + rect.width / scale / 2,
                y: data.y1 - rect.height / scale / 2,
            }
            const $path = $g.querySelector(`path`)!;
            $path.setAttribute('d', `M${position.x - 20},${position.y} A20,20 1 1 1 ${position.x},${position.y + 20}`);
            const c1x = position.x - 4; // 三角形顶点坐标
            const c1y = position.y - 20;
            const c2x = c1x + 6;
            const c2y = c1y - 7;
            const c3x = c1x - 6;
            const c3y = c1y - 7;
            const $polygon = $g.querySelector(`polygon`)!;
            $polygon.setAttribute('points', `${c1x},${c1y} ${c2x},${c2y} ${c3x},${c3y}`);
            $polygon.setAttribute('style', `transform-origin: ${c1x}px ${c1y}px; transform: rotate(${90}deg)`);

            // const $text = $g.querySelector(`text`)!;
            // $text.setAttribute('x', String(c1x - 4));
            // $text.setAttribute('y', String(c1y - 12));
            return;
        }
        data.transform(
            !data.line.input.param ? 'shortest' : 'normal',
            !data.line.output.param ? 'shortest' : 'normal',
        );
        const ct1x = (data.x2 - data.x1) / 2;
        const ct1y = (data.y2 - data.y1) / 2
        const angle = getAngle(data.x1, data.y1, data.x2, data.y2);
        const c1x = data.x2 - ct1x; // 三角形顶点坐标
        const c1y = data.y2 - ct1y;
        const c2x = c1x + 6;
        const c2y = c1y - 7;
        const c3x = c1x - 6;
        const c3y = c1y - 7;
        const $path = $g.querySelector(`path`)!;
        $path.setAttribute('d', `M${data.x1},${data.y1} L${data.x2},${data.y2}`);

        const $polygon = $g.querySelector(`polygon`)!;
        $polygon.setAttribute('points', `${c1x},${c1y} ${c2x},${c2y} ${c3x},${c3y}`);
        $polygon.setAttribute('style', `transform-origin: ${c1x}px ${c1y}px; transform: rotate(${angle - 90}deg)`);

        // const oAngle = -Math.PI/(180/angle);

        // const xa = -4 * Math.cos(oAngle) - -16 * Math.sin(oAngle);
        // const ya = -4 * Math.sin(oAngle) - -16 * Math.cos(oAngle);

        // const $text = $g.querySelector(`text`)!;
        // $text.setAttribute('x', String(c1x + xa));
        // $text.setAttribute('y', String(c1y + ya));
        // $text.innerHTML = '1';
    },
});

registerLine('*', 'curve', {
    template: /*svg*/`
<path class="stroke" d=""></path>
<path class="background" d=""></path>
    `,
    style: /*css*/`
@keyframes strokeMove {
    from {
        stroke-dashoffset: 360;
    }
    to {
        stroke-dashoffset: 0;
    }
}
g[type="curve"] > path.stroke {
    fill: none;
    stroke: #fafafa;
    stroke-width: 2px;
    stroke-dasharray: 20, 5, 5, 5, 5, 5;
    animation: strokeMove 30s linear infinite;
    transition: stroke 0.3s, fill 0.3s;
}
g[type="curve"] > path.background {
    fill: none;
    stroke: transparent;
    stroke-width: 10px;
}
g[type="curve"][selected] > path.stroke, g[type="curve"]:hover > path.stroke {
    stroke: #666;
}
    `,
    updateSVGPath($g, scale, data) {
        data.transform(
            !data.line.input.param ? 'shortest' : 'normal',
            !data.line.output.param ? 'shortest' : 'normal',
        );
        let cpx1 = 0; // 起始点的控制点上的 x 坐标
        let cpy1 = 0; // 起始点的控制点上的 y 坐标
        let cpx2 = 0; // 终点的控制点上的 x 坐标
        let cpy2 = 0; // 终点的控制点上的 y 坐标

        if (data.d1 === 1) {
            cpx1 = data.x1;
            cpy1 = (data.y1 + data.y2) / 2;
        } else {
            cpx1 = (data.x1 + data.x2) / 2;
            cpy1 = data.y1;
        }
        if (data.d2 === 1) {
            cpx2 = data.x2;
            cpy2 = (data.y1 + data.y2) / 2;
        } else {
            cpx2 = (data.x1 + data.x2) / 2;
            cpy2 = data.y2;
        }

        // 生成曲线的时候，如果是单向曲线，需要预留的最低宽度
        const cm = 100;

        switch (data.r1) {
            case 'left':
                if (cpx1 - data.x1 > -cm) {
                    cpx1 = data.x1 - cm;
                }
                cpy1 = data.y1;
                break;
            case 'right':
                if (cpx1 - data.x1 < cm) {
                    cpx1 = data.x1 + cm;
                }
                cpy1 = data.y1;
                break;
            case 'down':
                if (cpy1 - data.y1 < cm) {
                    cpy1 = data.y1 + cm;
                }
                cpx1 = data.x1;
                break;
            case 'up':
                if (cpy1 - data.y1 > -cm) {
                    cpy1 = data.y1 - cm;
                }
                cpx1 = data.x1;
                break;
        }
        switch (data.r2) {
            case 'left':
                if (cpx2 - data.x2 > -cm) {
                    cpx2 = data.x2 - cm;
                }
                cpy2 = data.y2;
                break;
            case 'right':
                if (cpx2 - data.x2 < cm) {
                    cpx2 = data.x2 + cm;
                }
                cpy2 = data.y2;
                break;
            case 'down':
                if (cpy2 - data.y2 < cm) {
                    cpy2 = data.y2 + cm;
                }
                cpx2 = data.x2;
                break;
            case 'up':
                if (cpy2 - data.y2 > -cm) {
                    cpy2 = data.y2 - cm;
                }
                cpx2 = data.x2;
                break;
        }

        const $pathList = $g.querySelectorAll(`path`)!;
        $pathList[0].setAttribute('d', `M${data.x1},${data.y1} C${cpx1},${cpy1} ${cpx2},${cpy2} ${data.x2},${data.y2}`);
        $pathList[1].setAttribute('d', `M${data.x1},${data.y1} C${cpx1},${cpy1} ${cpx2},${cpy2} ${data.x2},${data.y2}`);
    },
});
registerLine('*', '*', queryLine('*', 'curve'));

// Graph

export function registerGraphFilter(graphType: string, info: GraphFliter) {
    if (!graphTypeMap.has(graphType)) {
        graphTypeMap.set(graphType, generateDefaultGraph());
    }
    const graphInfo = graphTypeMap.get(graphType)!;
    const keys = Object.keys(info) as unknown as (keyof GraphFliter)[];
    keys.forEach((key) => {
        graphInfo.graphFilter[key] = info[key];
    });
}

export function queryGraphFliter(graphType: string, key: keyof GraphFliter) {
    const info = graphTypeMap.get(graphType) || graphTypeMap.get('*');
    const filter = info!.graphFilter[key] || graphTypeMap.get('*')!.graphFilter[key];
    return filter;
}

registerGraphFilter('*', {
    lineFilter(nodes, lines, line, input, output) {
        if (input && output && (input.type !== output.type)) {
            return false;
        }
        return true;
    },
});
