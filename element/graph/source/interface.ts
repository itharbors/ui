'use strict';

// 图文件的格式
export interface GraphInfo {
    // 数据版本，为以后数据兼容预留
    version: number;
    // 缩放比例，会传递到 attribute 上
    scale: number;
    // 绘制设置
    option: GraphOption;
    // 节点列表
    nodes: { [uuid: string]: NodeInfo }
    // 线段列表
    lines: { [uuid: string]: LineInfo }
}

// 图配置
export interface GraphOption {
    // 背景颜色
    backgroundColor?: string;

    // 网格尺寸
    gridSize?: number;
    // mesh 颜色
    gridColor?: string;

    // 原点坐标
    showOriginPoint?: boolean;
    // origin 颜色
    originPointColor?: string;
}

// 图里节点的信息
export interface NodeInfo {
    // 节点类型
    type: string;
    // 节点所在的坐标
    position: { x: number, y: number };
    // 附加描述信息
    details: { [key: string]: any };
}

// 图里的线段信息
export interface LineInfo {
    // 线条类型，曲线，直线
    type: string;
    // 附加描述信息
    details: { [key: string]: any };
    // 线段开始连接的节点
    input: {
        node: string;
        param?: string;
        __fake?: NodeInfo;
    };
    // 线段结束连接的节点
    output: {
        node: string;
        param?: string;
        __fake?: NodeInfo;
    };
}

// 选中
export interface SelectNodeInfo {
    id: string;
    target: NodeInfo;
}
export interface SelectLineInfo {
    id: string;
    target: LineInfo;
}

// 曲线生成规则，允许单向或者全向绘制
export type PathParamRole = 'up' | 'down' | 'left' | 'right' | 'all';
