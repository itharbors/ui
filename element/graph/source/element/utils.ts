'use strict';

import type { PathParamRole } from '../interface';

/**
 * 生成一个临时的 ID
 * @returns 
 */
export function generateUUID() {
    return 't_' + Date.now() + (Math.random() + '').substring(10);
}

/**
 * 获取一个 param 元素相对 node 的偏移坐标
 * @param $node 
 * @param selector 
 * @returns 
 */
export function getParamElementOffset($node: HTMLElement, selector: string) {
    const $param = $node.querySelector(selector);
    if (!$param) {
        return null;
    }
    if ($param.hasAttribute('hidden')) {
        return null;
    }
    const nodeBBound = $node.getBoundingClientRect();
    const paramBBound = $param.getBoundingClientRect();
    return {
        x: (paramBBound.width / 2 + paramBBound.x) - (nodeBBound.width / 2 + nodeBBound.x),
        y: (paramBBound.height / 2 + paramBBound.y) - (nodeBBound.height / 2 + nodeBBound.y),
        role: $param.getAttribute('role') as PathParamRole,
    };
}

/**
 * 在元素里找到 param 的一些信息
 * @param $root 
 * @param node 
 * @param param 
 * @returns 
 */
export function queryParamInfo($root: HTMLElement, node: string, param?: string) {
    const $node = $root.querySelector(`#nodes > v-graph-node[node-uuid="${node}"]`);
    if (!$node) {
        return;
    }
    const $param = $node.querySelector(`v-graph-node-param[name="${param}"]`);
    if (!$param) {
        return;
    }
    return {
        direction: $param.getAttribute('direction'),
        type: $param.getAttribute('type'),
        name: $param.getAttribute('name'),
        role: $param.getAttribute('role'),
    };
}

/**
 * 基于 requestAnimtionFrame 的节流
 * @param func 
 * @returns 
 */
// export function requestAnimtionFrameThrottling<T extends (...args: any[]) => any>(func: T): T {
//     let exec = false;
//     let wait: any[] | null = null;

//     const handle = async function(...args: any[]) {
//         if (exec) {
//             wait = args;
//             return;
//         }
//         exec = true;
//         await func(...args);
//         requestAnimationFrame(() => {
//             exec = false;
//             if (wait) {
//                 handle(...wait);
//                 wait = null;
//             }
//         });
//     } as T;

//     return handle;
// }
export function requestAnimtionFrameThrottling<T extends (...args: any[]) => any>(func: T): T {
    let wait: any[] | null = null;

    const handle = async function(...args: any[]) {
        if (wait) {
            wait = args;
            return;
        }
        wait = args;
        requestAnimationFrame(() => {
            func(...wait!);
            wait = null;
        });
    } as T;

    return handle;
}
