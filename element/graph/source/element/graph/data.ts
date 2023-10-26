'use strict';

import type { PathParamRole, LineInfo, NodeInfo } from '../../interface';

/**
 * 连接点计算方式
 * normal:   默认在元素中心点
 * snap:     吸附到边框
 * shortest: 变换到连线与边框的焦点
 */
type ParamPointType = 'normal' | 'snap' | 'shortest';

export class ParamConnectData {

    // 起始点
    x1: number = 0;
    y1: number = 0;

    // 连线结束点
    x2: number = 0;
    y2: number = 0;

    // 起始点开始的线段的朝向
    r1: PathParamRole = 'all';
    // 终点开始的线段的朝向
    r2: PathParamRole = 'all';

    // 当 r1 为全向的时候，起始点优先以横向还是竖向显示
    d1: 0 | 1 = 1;
    // 当 r2 为全向的时候，终点点优先以横向还是竖向显示
    d2: 0 | 1 = 1;

    line: LineInfo;

    private scale: number = 1;
    private $nodeA?: HTMLElement;
    private $nodeB?: HTMLElement;
    nodeA?: NodeInfo;
    nodeB?: NodeInfo;

    constructor(line: LineInfo, scale: number, $nodeA?: HTMLElement, $nodeB?: HTMLElement, nodeA?: NodeInfo, nodeB?: NodeInfo) {
        this.line = line;
        this.scale = scale;

        this.$nodeA = $nodeA;
        this.$nodeB = $nodeB;
        this.nodeA = nodeA;
        this.nodeB = nodeB;

        if (nodeA) {
            this.x1 = nodeA.position.x;
            this.y1 = nodeA.position.y;

            if ($nodeA) {
                const bound = $nodeA.getBoundingClientRect();
                this.x1 += bound.width / 2 / scale;
                this.y1 += bound.height / 2 / scale;
            }
        }

        if (nodeB) {
            this.x2 = nodeB.position.x;
            this.y2 = nodeB.position.y;

            if ($nodeB) {
                const bound = $nodeB.getBoundingClientRect();
                this.x2 += bound.width / 2 / scale;
                this.y2 += bound.height / 2 / scale;
            }
        }
    }

    getNodeABoundingClientRect() {
        return this.$nodeA!.getBoundingClientRect();
    }

    getNodeBBoundingClientRect() {
        return this.$nodeB!.getBoundingClientRect();
    }

    transform(startType: ParamPointType, endType: ParamPointType) {
        switch(startType) {
            case 'snap':
                snapBorderInput(this, this.$nodeA, this.$nodeB, this.nodeA, this.nodeB, this.scale);
                break;
            case 'shortest':
                if (this.$nodeA !== this.$nodeB) {
                    shortestInput(this, this.$nodeA, this.$nodeB, this.nodeA, this.nodeB, this.scale);
                }
                break;
        }
        switch(endType) {
            case 'snap':
                snapBorderOutput(this, this.$nodeA, this.$nodeB, this.nodeA, this.nodeB, this.scale);
                break;
            case 'shortest':
                if (this.$nodeA !== this.$nodeB) {
                    shortestOutput(this, this.$nodeA, this.$nodeB, this.nodeA, this.nodeB, this.scale);
                }
                break;
        }
    }
}

/**
 * 检测一条线和一个矩形相交的点
 * 返回他们相交的点坐标，以及该点的朝向 [x, y, d];
 * @param x1 线段起始点的 x 坐标
 * @param y1 线段起始点的 y 坐标
 * @param x2 线段终点的 x 坐标
 * @param y2 线段终点的 y 坐标
 * @param x3 矩形的左上角 x 坐标
 * @param y3 矩形的左上角 y 坐标
 * @param w 矩形的宽度
 * @param h 矩形的高度
 * @returns [number, number, 0 | 1];
 */
function intersect(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, w: number, h: number): [number, number, 0 | 1] {
    // 计算矩形的四个顶点坐标
    const x4 = x3 + w;
    const y4 = y3 + h;

    const xa = (y4 - y1) / (y2 - y1) * (x2 - x1) + x1;
    if (xa > x4 || xa < x3) {
        const ya = (x4 - x1) / (x2 - x1) * (y2 - y1) + y1;
        if (x2 > x1) {
            return [x4, ya, 0];
        } else {
            return [x3, y4 - ya + y3, 0];
        }
    } else {
        if (y2 > y1) {
            return [xa, y4, 1];
        } else {
            return [x4 - xa + x3, y3, 1];
        }
    }
}

/**
 * 将起始点吸附到边框
 */
function snapBorderInput(data: ParamConnectData, $nodeA?: HTMLElement, $nodeB?: HTMLElement, nodeA?: NodeInfo, nodeB?: NodeInfo, scale?: number) {
    if (!$nodeA || !nodeA || !nodeB) {
        return;
    }
    let r1 = data.r1;
    if (r1 === 'all') {
        const xd = data.x1 - data.x2;
        const yd = data.y1 - data.y2;
        const tl = Math.abs(xd / yd);
        if (tl <= 1) { // up down
            r1 = yd <= 0 ? 'up' : 'down';
        } else { // left right
            r1 = xd <= 0 ? 'right' : 'left';
        }
    }
    const boundA = $nodeA.getBoundingClientRect();
    switch (r1) {
        case 'right':
            data.x1 += boundA.width / 2;
            break;
        case 'left':
            data.x1 -= boundA.width / 2;
            break;
        case 'up':
            data.y1 += boundA.height / 2;
            break;
        case 'down':
            data.y1 -= boundA.height / 2;
            break;
    }
}

/**
 * 将结束点吸附到边框
 */
function snapBorderOutput(data: ParamConnectData, $nodeA?: HTMLElement, $nodeB?: HTMLElement, nodeA?: NodeInfo, nodeB?: NodeInfo, scale?: number) {
    if (!$nodeB || !nodeA || !nodeB) {
        return;
    }
    const boundB = $nodeB.getBoundingClientRect();
    let r2 = data.r2;
    if (r2 === 'all') {
        const xd = data.x1 - data.x2;
        const yd = data.y1 - data.y2;
        const tl = Math.abs(xd / yd);
        if (tl <= 1) { // up down
            r2 = yd <= 0 ? 'up' : 'down';
        } else { // left right
            r2 = xd <= 0 ? 'right' : 'left';
        }
    }
    switch (r2) {
        case 'right':
            data.x2 -= boundB.width / 2;
            break;
        case 'left':
            data.x2 += boundB.width / 2;
            break;
        case 'up':
            data.y2 -= boundB.height / 2;
            break;
        case 'down':
            data.y2 += boundB.height / 2;
            break;
    }
}

/**
 * 两点连接计算最短连接线上的两个交点
 */
function shortestInput(data: ParamConnectData, $nodeA?: HTMLElement, $nodeB?: HTMLElement, nodeA?: NodeInfo, nodeB?: NodeInfo, scale: number = 1) {
    if (!$nodeA || !nodeA || !nodeB) {
        return;
    }
    const boundA = $nodeA!.getBoundingClientRect();
    boundA.width /= scale;
    boundA.height /= scale;
    const pa = intersect(data.x1, data.y1, data.x2, data.y2, nodeA.position.x, nodeA.position.y, boundA.width, boundA.height)!;
    data.x1 = pa[0];
    data.y1 = pa[1];
    data.d1 = pa[2];
}

/**
 * 两点连接计算最短连接线上的两个交点
 */
function shortestOutput(data: ParamConnectData, $nodeA?: HTMLElement, $nodeB?: HTMLElement, nodeA?: NodeInfo, nodeB?: NodeInfo, scale: number = 1) {
    if (!$nodeB || !nodeA || !nodeB) {
        return;
    }
    const boundB = $nodeB!.getBoundingClientRect();
    boundB.width /= scale;
    boundB.height /= scale;
    const pb = intersect(data.x2, data.y2, data.x1, data.y1, nodeB.position.x, nodeB.position.y, boundB.width, boundB.height)!;
    data.x2 = pb[0];
    data.y2 = pb[1];
    data.d2 = pb[2];
}
