'use strict';


import type { GraphNodeElement } from './element/graph-node';
import type { GraphElement } from './element/graph';
import type { NodeInfo, LineInfo } from './interface';

type TNodeMap = {
    [key: string]: NodeInfo;
};

type TLineMap = {
    [key: string]: LineInfo;
};

class CustomEvent {

    blocks: TNodeMap;
    lines: TLineMap;

    constructor(blocks: TNodeMap, lines: TLineMap) {
        this.blocks = blocks;
        this.lines = lines;
    }
}

class MouseEvent extends CustomEvent {
    // 点击点在页面的坐标
    pageX = 0;
    pageY = 0;

    // 点击点在 Graph 里的坐标
    graphX = 0;
    graphY = 0;

    constructor(
        blocks: TNodeMap,
        lines: TLineMap,
    ) {
        super(blocks, lines);
    }

    initPagePosition(x: number, y: number) {
        this.pageX = x;
        this.pageY = y;
    }

    initGraphPosition(x: number, y: number) {
        this.graphX = x;
        this.graphY = y;
    }
}

export class GraphMouseEvent extends MouseEvent {
    target: GraphElement;

    constructor(
        blocks: TNodeMap,
        lines: TLineMap,
        target: GraphElement,
    ) {
        super(blocks, lines);
        this.target = target;
    }
}

export class BlockMouseEvent extends MouseEvent {
    block: NodeInfo;
    target: GraphNodeElement;
    constructor(
        blocks: TNodeMap,
        lines: TLineMap,
        target: GraphNodeElement,
        block: NodeInfo,
    ) {
        super(blocks, lines);
        this.block = block;
        this.target = target;
    }
}

export class LineMouseEvent extends MouseEvent {
    target: SVGGElement;
    line: LineInfo;
    constructor(
        blocks: TNodeMap,
        lines: TLineMap,
        target: SVGGElement,
        line: LineInfo,
    ) {
        super(blocks, lines);
        this.line = line;
        this.target = target;
    }
}

export class BlockEvent extends CustomEvent{
    block: NodeInfo;
    target: GraphNodeElement;
    constructor(
        blocks: TNodeMap,
        lines: TLineMap,
        target: GraphNodeElement,
        block: NodeInfo,
    ) {
        super(blocks, lines);
        this.block = block;
        this.target = target;
    }
}

export class LineEvent extends CustomEvent {
    line: LineInfo;
    target: SVGGElement;
    constructor(
        blocks: TNodeMap,
        lines: TLineMap,
        target: SVGGElement,
        line: LineInfo,
    ) {
        super(blocks, lines);
        this.line = line;
        this.target = target;
    }
}

type EventEmmiterType = string;
type EventEmmiterHnadler<T extends any[] = any[]> = (...args: T) => void;

export class EventEmmiter {
    private _handleMap: Map<string, EventEmmiterHnadler[]> = new Map();

    public emit(channel: EventEmmiterType, ...args: any[]) {
        if (!this._handleMap.has(channel)) {
            this._handleMap.set(channel, []);
        }
        const handlerList = this._handleMap.get(channel)!;
        Promise.all(handlerList.map((handler) => {
            return handler(...args);
        }));
    }

    public addListener(channel: EventEmmiterType, handler: EventEmmiterHnadler) {
        if (!this._handleMap.has(channel)) {
            this._handleMap.set(channel, []);
        }
        const handlerList = this._handleMap.get(channel)!;
        if (!handlerList.includes(handler)) {
            handlerList.push(handler);
        }
    }

    public removeListener(channel: EventEmmiterType, handler: EventEmmiterHnadler) {
        if (!this._handleMap.has(channel)) {
            return;
        }
        const handlerList = this._handleMap.get(channel)!;
        const index = handlerList.indexOf(handler);
        if (index !== -1) {
            handlerList.splice(index, 1);
        }
    }
}