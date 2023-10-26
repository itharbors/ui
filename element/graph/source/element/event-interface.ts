'use strict';

import { GraphNodeElement } from './index';
import { LineInfo, NodeInfo } from '../interface';

// ---- Node Private

export interface SelectNodeDetail {
    target: GraphNodeElement;
    clearLines: boolean;
    clearNodes: boolean;
}

export interface UnselectNodeDetail {
    target: GraphNodeElement;
}

export interface ClearSelectNodeDetail {
    
}

export interface MoveNodeDetail {
    node: GraphNodeElement;
}

export interface InterruptMoveNodeDetail {
    
}

export interface InterruptMoveNodeDetail {
    
}

export interface ConnectNodeDetail {
    lineType: string;
    node: string;
    param?: string;
    paramDirection?: 'input' | 'output';
    details?: { [key: string]: any };
}

export interface InterruptConnectNodeDetail {
    
}

// ---- Node Public

export interface NodeAddedDetail {
    node: NodeInfo;
}

export interface NodeRemovedDetail {
    node: NodeInfo;
}

export interface NodeChangedDetail {
    id: string;
    node: NodeInfo;
}

export interface NodePositionChangedDetail {
    moveList: {
        id: string,
        source: { x: number, y: number },
        target: { x: number, y: number },
    }[];
}

export interface NodeSelectedDetail {

}

export interface NodeUnselectedDetail {

}

// ---- Line

export interface SelectLineDetail {
    target: SVGGElement;
}

export interface UnselectLineDetail {
    target: SVGGElement;
}

// ---- Node Public

export interface LineAddedDetail {
    line: LineInfo;
}

export interface LineRemovedDetail {
    line: LineInfo;
}

export interface LineChangedDetail {
    line: LineInfo;
}

export interface LineSelectedDetail {
    line: LineInfo;
}

export interface LineUnselectedDetail {
    line: LineInfo;
}
