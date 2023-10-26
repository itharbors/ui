'use strict';

import type { GraphNodeElement } from '../graph-node';
import type { GraphElement } from '../index';
import type { NodeInfo, LineInfo, GraphOption } from '../../interface';
import type { BaseElement } from '@itharbors/ui-core';

import { getParamElementOffset, requestAnimtionFrameThrottling } from '../utils';
import { ParamConnectData } from './data';
import { queryLine } from '../../manager';
import { MoveNodeDetail, SelectLineDetail, UnselectLineDetail, SelectNodeDetail, UnselectNodeDetail, InterruptMoveNodeDetail, LineSelectedDetail, LineUnselectedDetail, NodeSelectedDetail, NodeUnselectedDetail, NodePositionChangedDetail } from '../event-interface';

export const nodeElementMap: WeakMap<NodeInfo, GraphNodeElement> = new WeakMap();

export function resizeCanvas($elem: GraphElement, $canvas: HTMLCanvasElement, box: {width: number, height: number}) {
    $canvas.setAttribute('width', box.width + '');
    $canvas.setAttribute('height', box.height + '');

    const calibration = $elem.data.getProperty('calibration');
    calibration.x = box.width / 2;
    calibration.y = box.height / 2;
    $elem.data.emitProperty('calibration', calibration, calibration);
};

export function renderMesh($elem: GraphElement, ctx: CanvasRenderingContext2D, box: {width: number, height: number}, offset: {x: number, y: number}, scale: number, option: GraphOption) {
    $elem.setAttribute('style', `--background-color: ${option.backgroundColor};`);
    const step = (option.gridSize || 50) * scale;

    ctx.clearRect(0, 0, box.width, box.height);
    if (option.gridColor || option.gridSize) {
        const center = {
            x: Math.round(box.width / 2) + 0.5 + offset.x,
            y: Math.round(box.height / 2) + 0.5 + offset.y,
        };

        if (option.showOriginPoint) {
            ctx.beginPath();
            ctx.fillStyle = option.originPointColor || '#ccc';
            ctx.arc(center.x, center.y, 5 * scale, 0, 2 * Math.PI, true);
            ctx.fill();
            ctx.closePath();
        }

        ctx.beginPath();

        ctx.lineWidth = 1;

        ctx.fill();

        ctx.moveTo(center.x, 0);
        ctx.lineTo(center.x, box.height);

        ctx.moveTo(0, center.y);
        ctx.lineTo(box.width, center.y);

        ctx.closePath();
        ctx.strokeStyle = option.originPointColor || '#ccc';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();

        let x = center.x;
        do {
            x = x - step;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, box.height);
        } while (x > 0);

        x = center.x;
        do {
            x = x + step;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, box.height);
        } while (x < box.width);

        let y = center.y;
        do {
            y = y - step;
            ctx.moveTo(0, y);
            ctx.lineTo(box.width, y);
        } while (y > 0);

        y = center.y;
        do {
            y = y + step;
            ctx.moveTo(0, y);
            ctx.lineTo(box.width, y);
        } while (y < box.height);

        ctx.closePath();
        ctx.strokeStyle =  option.gridColor || '#666';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
};

const refreshFlag = new Set();
export const renderNodes = requestAnimtionFrameThrottling(_renderNodes);
function _renderNodes($elem: GraphElement, offset: {x: number, y: number}, scale: number) {
    const $nodes = $elem.querySelectorAll('#nodes > v-graph-node');
    const nodes = $elem.data.getProperty('nodes');
    const graphType = $elem.data.getAttribute('type') || 'default';

    const $root = $elem.querySelector('#nodes')!;

    // 循环已有的 HTML 节点
    for (let i = 0; i < $nodes.length; i++) {
        const $node = $nodes[i] as BaseElement;
        const uuid = $node.getAttribute('node-uuid') || '';
        const node = nodes[uuid];

        refreshFlag.add(uuid);
        if (!node) {
            // 删除数据不存在的 HTML 节点
            $node.remove();
        } else {
            // 更新已存在的节点内的数据
            $node.data.setAttribute('node-uuid', uuid);
            $node.data.setProperty('scale', Math.floor(scale * 100) / 100);
            $node.data.setProperty('graphType', graphType);
            $node.data.setProperty('type', node.type);
            $node.data.setProperty('position', node.position);
            $node.data.setProperty('details', node.details);
        }
    }

    // 循环 nodes 数据，新增数据的话，创建新节点
    for (const uuid in nodes) {
        const node = nodes[uuid];
        if (!node || refreshFlag.has(uuid)) {
            continue;
        }
        const $node = document.createElement('v-graph-node') as GraphNodeElement;
        // 关联数据
        nodeElementMap.set(node, $node);
        $root.appendChild($node);

        $node.data.setAttribute('node-uuid', uuid);
        $node.data.setProperty('scale', Math.floor(scale * 100) / 100);
        $node.data.setProperty('graphType', graphType);
        $node.data.setProperty('type', node.type);
        $node.data.setProperty('position', node.position);
        $node.data.setProperty('details', node.details);

        $node.data.addPropertyListener('position', (reOffset) => {
            node.position = reOffset;
            const scale = $elem.data.getProperty('scale');
            renderNodes($elem, offset, scale);
            renderLines($elem, offset, scale);
        });
    }
    refreshFlag.clear();
};

export function renderLine(graphType: string, $line: SVGGElement, line: LineInfo, lines: { [key: string]: LineInfo | undefined }, nodes: { [key: string]: NodeInfo | undefined }, scale: number) {
    const nodeA = line.input.__fake || nodes[line.input.node];
    const nodeB = line.output.__fake || nodes[line.output.node];

    if (!nodeA || !nodeB) {
        return;
    }

    const $nodeA = nodeElementMap.get(nodeA);
    const $nodeB = nodeElementMap.get(nodeB);

    const d = new ParamConnectData(line, scale, $nodeA, $nodeB, nodeA, nodeB);

    let flagA = false;
    if ($nodeA && line.input.param) {
        const offset = getParamElementOffset($nodeA, `v-graph-node-param[name="${line.input.param}"]`);
        if (offset) {
            flagA = true;
            d.x1 += offset.x / scale;
            d.y1 += offset.y / scale;
            d.r1 = offset.role;
        }
    }

    let flagB = false;
    if ($nodeB && line.output.param) {
        const offset = getParamElementOffset($nodeB, `v-graph-node-param[name="${line.output.param}"]`);
        if (offset) {
            flagB = true;
            d.x2 += offset.x / scale;
            d.y2 += offset.y / scale;
            d.r2 = offset.role;
        }
    }

    const lineAdapter = queryLine(graphType, line.type);
    lineAdapter.updateSVGPath($line, scale, d, line, lines);
};

export const renderLines = requestAnimtionFrameThrottling(_renderLines);
function _renderLines($elem: GraphElement, offset: {x: number, y: number }, scale: number) {
    const $root = $elem.querySelector('#lines')!;
    if ($root.hasAttribute('hidden')) {
        return;
    }

    const graphType = $elem.data.getAttribute('type') || 'default';
    const lines = $elem.data.getProperty('lines');
    const nodes = $elem.data.getProperty('nodes');
    const $lines = $elem.querySelectorAll('#lines > g[line-uuid]');

    const refreshFlag = new Set();
    for (let i = 0; i < $lines.length; i++) {
        const $line = $lines[i] as SVGPathElement;
        const uuid = $line.getAttribute('line-uuid') || '';
        const line = lines[uuid];

        refreshFlag.add(uuid);
        if (!line) {
            // 删除数据不存在的 HTML 节点
            $line.remove();
        } else {
            // 更新已存在的节点内的数据
            $line.setAttribute('line-uuid', uuid);
            renderLine(graphType, $line, line, lines, nodes, scale);
        }
    }


    // 循环 nodes 数据，新增数据的话，创建新节点
    for (const uuid in lines) {
        const line = lines[uuid];
        if (!line || refreshFlag.has(uuid)) {
            continue;
        }
        const $line = document.createElementNS('http://www.w3.org/2000/svg', 'g') as SVGGElement;
        $line.setAttribute('line-uuid', uuid);
        const lineAdapter = queryLine(graphType, line.type);

        $line.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            const custom = new CustomEvent<SelectLineDetail>('select-line', {
                bubbles: false,
                cancelable: false,
                detail: {
                    target: $line,
                },
            });
            ($line.getRootNode() as ShadowRoot).dispatchEvent(custom);
        });

        const $style = $elem.querySelector(`style[line-type="${line.type}"]`);
        if (!$style) {
            const $style = document.createElement('style');
            $style.setAttribute('line-type', line.type);
            $style.innerHTML = lineAdapter.style;
            $elem.shadowRoot.appendChild($style);
        }

        $line.setAttribute('type', line.type);
        $line.innerHTML = lineAdapter.template;
        renderLine(graphType, $line, line, lines, nodes, scale);
        $root.appendChild($line);
    }
};

export function bindEventListener($elem: GraphElement) {

    function selectLine($g: SVGGElement) {
        $g.setAttribute('selected', '');
        $elem.__selectLines__.add($g);
        const lineMap = $elem.getProperty('lines');
        const uuid = $g.getAttribute('line-uuid');
        if (uuid) {
            const line = lineMap[uuid];
            line && $elem.dispatch<LineSelectedDetail>('line-selected', {
                cancelable: false,
                bubbles: false,
                detail: {
                    line,
                },
            });
        }
    }
    function unselectLine($g: SVGGElement) {
        if ($g.hasAttribute('selected')) {
            $g.removeAttribute('selected');
            $elem.__selectLines__.delete($g);
            const lineMap = $elem.getProperty('lines');
            const uuid = $g.getAttribute('line-uuid');
            if (uuid) {
                const line = lineMap[uuid];
                line && $elem.dispatch<LineUnselectedDetail>('line-unselected', {
                    cancelable: false,
                    bubbles: false,
                    detail: {
                        line,
                    },
                });
            }
        }
    }

    // 阻止右键菜单
    $elem.shadowRoot.addEventListener('contextmenu', (event) => {
        event.stopPropagation();
        event.preventDefault();
    });

    // 处理选中 line 的情况
    $elem.shadowRoot.addEventListener('select-line', (event) => {
        const cEvent = event as CustomEvent<SelectLineDetail>;
        if (!(event as MouseEvent).metaKey && !(event as MouseEvent).ctrlKey) {
            $elem.clearAllBlockSelected();
            $elem.clearAllLineSelected();
        }
        selectLine(cEvent.detail.target);
    });
    $elem.shadowRoot.addEventListener('unselect-line', (event) => {
        const cEvent = event as CustomEvent<UnselectLineDetail>;
        unselectLine(cEvent.detail.target);
    });
    $elem.shadowRoot.addEventListener('clear-select-line', (event) => {
        $elem.clearAllLineSelected();
    });

    // 处理选中 node 的情况
    $elem.shadowRoot.addEventListener('select-node', (event) => {
        const cEvent = event as CustomEvent<SelectNodeDetail>;
        const $node = cEvent.detail.target;
        $node.setProperty('selected', true);

        if (cEvent.detail.clearLines) {
            $elem.clearAllLineSelected();
        }
        if (cEvent.detail.clearNodes) {
            $elem.clearAllBlockSelected();
        }

        const nodeMap = $elem.getProperty('nodes');
        const uuid = $node.getAttribute('node-uuid');
        if (uuid) {
            const node = nodeMap[uuid];
            node && $elem.dispatch<NodeSelectedDetail>('node-selected', {
                cancelable: false,
                bubbles: false,
                detail: {
                    node,
                },
            });
        }
    });
    $elem.shadowRoot.addEventListener('unselect-node', (event) => {
        const cEvent = event as CustomEvent<UnselectNodeDetail>;
        const $node = cEvent.detail.target;
        $node.setProperty('selected', false);

        const nodeMap = $elem.getProperty('nodes');
        const uuid = $node.getAttribute('node-uuid');
        if (uuid) {
            const node = nodeMap[uuid];
            node && $elem.dispatch<NodeUnselectedDetail>('node-unselected', {
                cancelable: false,
                bubbles: false,
                detail: {
                    node,
                },
            });
        }
    });
    $elem.shadowRoot.addEventListener('clear-select-node', (event) => {
        $elem.clearAllBlockSelected();
    });

    $elem.addEventListener('mousedown', (event) => {
        if ($elem.hasConnect()) {
            $elem.stopConnect();
            return;
        }
        switch (event.button) {
            // 框选
            case 0: {
                // event.stopPropagation();
                // event.preventDefault();

                const selectBox = $elem.data.getProperty('selectBox');
                // const offset = $elem.data.getProperty('offset');
                const startPoint = {
                    x: event.pageX,
                    y: event.pageY,
                };
                selectBox.x = event.offsetX;
                selectBox.y = event.offsetY;

                const mousemove = (event: MouseEvent) => {
                    const scale = $elem.data.getProperty('scale');
                    const point = {
                        x: event.pageX - startPoint.x,
                        y: event.pageY - startPoint.y,
                    }

                    const reSelectBox = {
                        x: selectBox.x,
                        y: selectBox.y,
                        w: point.x,
                        h: point.y,
                    };
                    if (reSelectBox.w < 0) {
                        reSelectBox.x += reSelectBox.w;
                        reSelectBox.w = -reSelectBox.w;
                    }
                    if (reSelectBox.h < 0) {
                        reSelectBox.y += reSelectBox.h;
                        reSelectBox.h = -reSelectBox.h;
                    }

                    $elem.data.setProperty('selectBox', reSelectBox);
                }
                const mouseup = (event: MouseEvent) => {
                    if (event.pageX !== startPoint.x || event.pageY !== startPoint.y) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                    document.removeEventListener('mousemove', mousemove);
                    document.removeEventListener('mouseup', mouseup, true);
                    const reSelectBox = { x: 0, y: 0, w: 0, h: 0 };
                    $elem.data.setProperty('selectBox', reSelectBox);
                }
                document.addEventListener('mousemove', mousemove);
                document.addEventListener('mouseup', mouseup, true);
                break;
            }

            // 拖拽移动整个画布
            case 1:
            case 2: {
                // event.stopPropagation();
                // event.preventDefault();

                const offset = $elem.data.getProperty('offset');
                const start = {
                    x: offset.x,
                    y: offset.y,
                };
                const point = {
                    x: event.pageX,
                    y: event.pageY,
                };

                const $root = $elem.querySelector('#lines')!;
                $root.setAttribute('hidden', '');

                const mousemove = (event: MouseEvent) => {
                    start.x = event.pageX - point.x;
                    start.y = event.pageY - point.y;
                    const reOffset = {
                        x: offset.x + start.x,
                        y: offset.y + start.y,
                    };
                    $elem.data.setProperty('offset', reOffset);
                }
                const mouseup = (event: MouseEvent) => {
                    $root.removeAttribute('hidden');
                    if (event.pageX !== point.x || event.pageY !== point.y) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                    document.removeEventListener('mousemove', mousemove);
                    document.removeEventListener('mouseup', mouseup, true);
                }
                document.addEventListener('mousemove', mousemove);
                document.addEventListener('mouseup', mouseup, true);
                break;
            }

        }

    });

    // 鼠标滚轮
    $elem.addEventListener('wheel', (event) => {
        event.stopPropagation();
        event.preventDefault();
        const delta = event.deltaY > 0 ? 0.05 : -0.05;
        let scale = $elem.data.getProperty('scale');
        scale += delta;
        scale = Math.min(2, Math.max(0.2, scale));
        $elem.data.setProperty('scale', Math.floor(scale * 100) / 100);
    });

    // 拖拽节点
    $elem.shadowRoot.addEventListener('move-node', (event) => {
        const cEvent = event as CustomEvent<MoveNodeDetail>;
        const $nodeInfoList = $elem.getSelectedNodeList();

        if ($nodeInfoList.length === 0 && cEvent.detail.node) {
            const nodes = $elem.data.getProperty('nodes');
            const uuid = cEvent.detail.node.getAttribute('node-uuid') || '';
            const node = nodes[uuid];
            if (node) {
                $nodeInfoList.push({
                    id: uuid,
                    target: node,
                });
            }
        }
        
        let t = false;
        let at = false;

        const $root = $elem.querySelector('#lines')!;
        $root.setAttribute('hidden', '');

        const scale = $elem.getProperty('scale');
        const mousemove = (event: MouseEvent) => {
            if (!t) {
                const scale = $elem.getProperty('scale');
                $nodeInfoList.forEach((info) => {
                    const $node = nodeElementMap.get(info.target)!;
                    $node.setAttribute('moving', '');
                    const position = $node.getProperty('position');
                    const moveStartPoint = $node.getProperty('moveStartPoint');
                    moveStartPoint.x = position.x * scale;
                    moveStartPoint.y = position.y * scale;
                    moveStartPoint.pageX = event.pageX;
                    moveStartPoint.pageY = event.pageY;
                });
                t = true;
            }

            if (at === true) {
                return;
            }
            at = true;
            requestAnimationFrame(() => {
                at = false;
                const scale = $elem.getProperty('scale');
                $nodeInfoList.forEach((info) => {
                    const $node = nodeElementMap.get(info.target)!;
                    const moveStartPoint = $node.getProperty('moveStartPoint');
                    const reOffset = {
                        x: (moveStartPoint.x + (event.pageX - moveStartPoint.pageX)) / scale,
                        y: (moveStartPoint.y + (event.pageY - moveStartPoint.pageY)) / scale,
                    };
                    $node.setProperty('position', reOffset);
                });
            });
        }
        const mouseup = (event: MouseEvent) => {
            const scale = $elem.getProperty('scale');
            const offset = $elem.getProperty('offset');
            if (t) {
                $nodeInfoList.forEach((info) => {
                    const $node = nodeElementMap.get(info.target)!;
                    $node.setAttribute('moving', '');
                    const moveStartPoint = $node.getProperty('moveStartPoint');
                    
                    const offset = {
                        x: event.pageX - moveStartPoint.pageX,
                        y: event.pageY - moveStartPoint.pageY,
                    };
                    const reOffset = {
                        x: (moveStartPoint.x + offset.x) / scale,
                        y: (moveStartPoint.y + offset.y) / scale,
                    };
                    $node.setProperty('position', reOffset);
                });
            }
            stopmove();

            const $root = $elem.querySelector('#lines')!;
            $root.removeAttribute('hidden');
            renderLines($elem, offset, scale);
        }
        const stopmove = (event?: Event) => {
            const cEvent = event as CustomEvent<InterruptMoveNodeDetail> | undefined;
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup, true);
            $elem.shadowRoot.removeEventListener('move-node', stopmove);

            $nodeInfoList.forEach((info) => {
                const $node = nodeElementMap.get(info.target)!;
                $node.removeAttribute('moving');
            });
            const moveList = $nodeInfoList.map((info) => {
                const $node = nodeElementMap.get(info.target)!;
                const moveStartPoint = $node.getProperty('moveStartPoint');
                const position = $node.getProperty('position');
                return {
                    id: $node.getAttribute('node-uuid') || '',
                    source: {
                        x: moveStartPoint.x / scale,
                        y: moveStartPoint.y / scale,
                    },
                    target: position,
                }
            });
            $elem.dispatch<NodePositionChangedDetail>('node-position-changed', {
                detail: {
                    moveList,
                }
            });
        };
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup, true);
        $elem.shadowRoot.addEventListener('interrupt-move-node', stopmove);
    });
};
