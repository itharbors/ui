'use strict';

import '../index';
import { BaseElement } from '@itharbors/ui-core';
import { registerLine, registerNode, registerGraphOption } from '../manager';

function getAngle(x1: number, y1: number, x2: number, y2: number) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const angleRadians = Math.atan2(deltaY, deltaX);
    const angleDegrees = angleRadians * 180 / Math.PI;
    return angleDegrees;
}

registerGraphOption('class-diagram', {
    backgroundColor: '#2f2f2f',
});

// 继承关系：用一个带空心三角形的实线箭头表示，箭头指向父类
registerLine('class-diagram', 'inheritance', {
    template: /*svg*/`
        <path d=""></path>
        <polygon points=""></polygon>
    `,
    style: /*css*/`
        g[type="inheritance"] > path {
            fill: none;
            stroke: #fafafa;
            stroke-width: 1px;
        }
        g[type="inheritance"] > polygon {
            fill: none;
            stroke: #fafafa;
            stroke-width: 1px;
        }
    `,
    updateSVGPath($g, scale, info) {
        info.transform(
            !info.line.input.param ? 'shortest' : 'normal',
            !info.line.output.param ? 'shortest' : 'normal',
        );
        const angle = getAngle(info.x1, info.y1, info.x2, info.y2);

        const a = 10 * Math.cos((180 - angle) * Math.PI / 180);
        const b = 10 * Math.sin((180 - angle) * Math.PI / 180);

        const $path = $g.querySelector(`path`)!;
        $path.setAttribute('d', `M${info.x1},${info.y1} L${info.x2 + a},${info.y2 - b}`);

        const c1x = info.x2; // 三角形顶点坐标
        const c1y = info.y2;

        const c2x = c1x + 6;
        const c2y = c1y - 10;

        const c3x = c1x - 6;
        const c3y = c1y - 10;

        const $polygon = $g.querySelector(`polygon`)!;
        $polygon.setAttribute('points', `${c1x},${c1y} ${c2x},${c2y} ${c3x},${c3y}`);
        $polygon.setAttribute('style', `transform-origin: ${c1x}px ${c1y}px; transform: rotate(${angle - 90}deg)`);
    },
});

// 实现关系：用一个带空心三角形的虚线箭头表示，箭头指向实现的接口
registerLine('class-diagram', 'realization', {
    template: /*svg*/`
        <path d=""></path>
        <polygon points=""></polygon>
    `,
    style: /*css*/`
        g[type="realization"] > path {
            fill: none;
            stroke: #fafafa;
            stroke-width: 1px;
            stroke-dasharray: 5, 5;
        }
        g[type="realization"] > polygon {
            fill: none;
            stroke: #fafafa;
            stroke-width: 1px;
        }
    `,
    updateSVGPath($g, scale, info) {
        info.transform(
            !info.line.input.param ? 'shortest' : 'normal',
            !info.line.output.param ? 'shortest' : 'normal',
        );
        const angle = getAngle(info.x1, info.y1, info.x2, info.y2);

        const c1x = info.x2; // 三角形顶点坐标
        const c1y = info.y2;

        const c2x = c1x + 6;
        const c2y = c1y - 10;

        const c3x = c1x - 6;
        const c3y = c1y - 10;

        const a = 10 * Math.cos((180 - angle) * Math.PI / 180);
        const b = 10 * Math.sin((180 - angle) * Math.PI / 180);

        const $path = $g.querySelector(`path`)!;
        $path.setAttribute('d', `M${info.x1},${info.y1} L${info.x2 + a},${info.y2 - b}`);

        const $polygon = $g.querySelector(`polygon`)!;
        $polygon.setAttribute('points', `${c1x},${c1y} ${c2x},${c2y} ${c3x},${c3y}`);
        $polygon.setAttribute('style', `transform-origin: ${c1x}px ${c1y}px; transform: rotate(${angle - 90}deg)`);
    },
});

// 关联关系：用一个带实心箭头的实线表示，箭头指向关联的类
registerLine('class-diagram', 'association', {
    template: /*svg*/`
        <path d=""></path>
        <polygon points=""></polygon>
    `,
    style: /*css*/`
        g[type="association"] > path {
            fill: none;
            stroke: #fafafa;
            stroke-width: 1px;
        }
        g[type="association"] > polygon {
            fill: #fafafa;
            stroke: none;
        }
    `,
    updateSVGPath($g, scale, info) {
        info.transform(
            !info.line.input.param ? 'shortest' : 'normal',
            !info.line.output.param ? 'shortest' : 'normal',
        );
        const angle = getAngle(info.x1, info.y1, info.x2, info.y2);
        const c1x = info.x2; // 三角形顶点坐标
        const c1y = info.y2;

        const c2x = c1x + 6;
        const c2y = c1y - 10;

        const c3x = c1x - 6;
        const c3y = c1y - 10;

        const c4x = c1x;
        const c4y = c1y - 6;

        const a = 6 * Math.cos((180 - angle) * Math.PI / 180);
        const b = 6 * Math.sin((180 - angle) * Math.PI / 180);

        const $path = $g.querySelector(`path`)!;
        $path.setAttribute('d', `M${info.x1},${info.y1} L${info.x2 + a},${info.y2 - b}`);

        const $polygon = $g.querySelector(`polygon`)!;
        $polygon.setAttribute('points', `${c1x},${c1y} ${c2x},${c2y} ${c4x},${c4y} ${c3x},${c3y}`);
        $polygon.setAttribute('style', `transform-origin: ${c1x}px ${c1y}px; transform: rotate(${angle - 90}deg)`);
    },
});

// 聚合关系：用一个带空心菱形的实线表示，菱形指向整体，箭头指向局部
registerLine('class-diagram', 'aggregation', {
    template: /*svg*/`
        <path d=""></path>
        <polygon points=""></polygon>
    `,
    style: /*css*/`
        g[type="aggregation"] > path {
            fill: none;
            stroke: #fafafa;
            stroke-width: 1px;
        }
        g[type="aggregation"] > polygon {
            fill: none;
            stroke: #fafafa;
        }
    `,
    updateSVGPath($g, scale, info) {
        info.transform(
            !info.line.input.param ? 'shortest' : 'normal',
            !info.line.output.param ? 'shortest' : 'normal',
        );
        const angle = getAngle(info.x1, info.y1, info.x2, info.y2);
        const c1x = info.x2; // 三角形顶点坐标
        const c1y = info.y2;

        const c2x = c1x + 6;
        const c2y = c1y - 10;

        const c3x = c1x - 6;
        const c3y = c1y - 10;

        const c4x = c1x;
        const c4y = c1y - 20;

        const a = 20 * Math.cos((180 - angle) * Math.PI / 180);
        const b = 20 * Math.sin((180 - angle) * Math.PI / 180);

        const $path = $g.querySelector(`path`)!;
        $path.setAttribute('d', `M${info.x1},${info.y1} L${info.x2 + a},${info.y2 - b}`);

        const $polygon = $g.querySelector(`polygon`)!;
        $polygon.setAttribute('points', `${c1x},${c1y} ${c2x},${c2y} ${c4x},${c4y} ${c3x},${c3y}`);
        $polygon.setAttribute('style', `transform-origin: ${c1x}px ${c1y}px; transform: rotate(${angle - 90}deg)`);
    },
});

// 组合关系：用一个带实心菱形的实线表示，菱形指向整体，箭头指向局部
registerLine('class-diagram', 'composition', {
    template: /*svg*/`
        <path d=""></path>
        <polygon points=""></polygon>
    `,
    style: /*css*/`
        g[type="composition"] > path {
            fill: none;
            stroke: #fafafa;
            stroke-width: 1px;
        }
        g[type="composition"] > polygon {
            fill: #fafafa;
            stroke: none;
        }
    `,
    updateSVGPath($g, scale, info) {
        info.transform(
            !info.line.input.param ? 'shortest' : 'normal',
            !info.line.output.param ? 'shortest' : 'normal',
        );
        const angle = getAngle(info.x1, info.y1, info.x2, info.y2);
        const c1x = info.x2; // 三角形顶点坐标
        const c1y = info.y2;

        const c2x = c1x + 6;
        const c2y = c1y - 10;

        const c3x = c1x - 6;
        const c3y = c1y - 10;

        const c4x = c1x;
        const c4y = c1y - 20;

        const a = 20 * Math.cos((180 - angle) * Math.PI / 180);
        const b = 20 * Math.sin((180 - angle) * Math.PI / 180);

        const $path = $g.querySelector(`path`)!;
        $path.setAttribute('d', `M${info.x1},${info.y1} L${info.x2 + a},${info.y2 - b}`);

        const $polygon = $g.querySelector(`polygon`)!;
        $polygon.setAttribute('points', `${c1x},${c1y} ${c2x},${c2y} ${c4x},${c4y} ${c3x},${c3y}`);
        $polygon.setAttribute('style', `transform-origin: ${c1x}px ${c1y}px; transform: rotate(${angle - 90}deg)`);
    },
});

// 依赖关系：用一个带箭头的虚线表示，箭头指向被依赖的类
registerLine('class-diagram', 'dependency', {
    template: /*svg*/`
        <path d=""></path>
        <polygon points=""></polygon>
    `,
    style: /*css*/`
        g[type="dependency"] > path {
            fill: none;
            stroke: #fafafa;
            stroke-width: 1px;
            stroke-dasharray: 5, 5;
        }
        g[type="dependency"] > polygon {
            fill: #fafafa;
            stroke: none;
        }
    `,
    updateSVGPath($g, scale, info) {
        info.transform(
            !info.line.input.param ? 'shortest' : 'normal',
            !info.line.output.param ? 'shortest' : 'normal',
        );
        const angle = getAngle(info.x1, info.y1, info.x2, info.y2);
        const c1x = info.x2; // 三角形顶点坐标
        const c1y = info.y2;

        const c2x = c1x + 6;
        const c2y = c1y - 10;

        const c3x = c1x - 6;
        const c3y = c1y - 10;

        const c4x = c1x;
        const c4y = c1y - 6;

        const a = 6 * Math.cos((180 - angle) * Math.PI / 180);
        const b = 6 * Math.sin((180 - angle) * Math.PI / 180);

        const $path = $g.querySelector(`path`)!;
        $path.setAttribute('d', `M${info.x1},${info.y1} L${info.x2 + a},${info.y2 - b}`);

        const $polygon = $g.querySelector(`polygon`)!;
        $polygon.setAttribute('points', `${c1x},${c1y} ${c2x},${c2y} ${c4x},${c4y} ${c3x},${c3y}`);
        $polygon.setAttribute('style', `transform-origin: ${c1x}px ${c1y}px; transform: rotate(${angle - 90}deg)`);
    },
});

// 节点
registerNode('class-diagram', 'class-node', {
    template: /*html*/`
        <header class="class-name"></header>
        <section class="property"></section>
        <section class="function"></section>

        <div class="menu" hidden>
            <div>Inheritance</div>
            <div>Realization</div>
            <div>Association</div>
            <div>Aggregation</div>
            <div>Composition</div>
            <div>Dependency</div>
        </div>
    `,

    style: /*css*/`
        :host {
            background: #2b2b2bcc;
            border: 1px solid #333;
            border-radius: 4px;
            color: #ccc;
            transition: box-shadow 0.2s, border 0.2s;
            white-space: nowrap;
        }
        :host(:hover) {
            border-color: white;
            box-shadow: 0px 0px 14px 2px white;
        }
        header {
            background: #227f9b;
            border-radius: 4px 4px 0 0;
            padding: 4px 10px;
            text-align: center;
        }
        section {
            min-height: 20px;
            border-left: 1px solid #666;
            border-right: 1px solid #666;
            border-bottom: 1px solid #666;
            padding: 4px 0;
        }
        section > div {
            padding: 2px 10px;
        }
        .menu {
            position: absolute;
            left: 0;
            top: 0;
            background: #2b2b2bcc;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .menu > div {
            padding: 4px 10px;
            border-bottom: 1px solid #ccc;
        }
        .menu > div:last-child {
            border: none;
        }
    `,

    onInit(details) {
        const $menu = this.querySelector('.menu')!;
        this.querySelector('.class-name')!.innerHTML = details.name;

        this.addEventListener('mousedown', (event) => {
            event.stopPropagation();
            event.preventDefault();

            if (event.button === 0) {
                this.startMove();
                return;
            }

            if (this.hasConnect()) {
                this.startConnect('');
                return;
            }
            $menu.removeAttribute('hidden');
            function mousedown(event: MouseEvent) {
                $menu.setAttribute('hidden', '');
                document.removeEventListener('mousedown', mousedown, true);
            }
            document.addEventListener('mousedown', mousedown, true);
        });

        $menu.addEventListener('mousedown', (event) => {
            event.stopPropagation();
            event.preventDefault();
            const type = (event.target! as HTMLDivElement).innerHTML.toLocaleLowerCase();

            this.startConnect(type);
        });
    },
    onUpdate(details) {
        const updateHTML = (type: string, list: string[]) => {
            if (!Array.isArray(list)) {
                return;
            }
            let HTML = ``;
            for (const item of list) {
            HTML += `<div>${item}</div>`;
            }
            this.querySelector(`.${type}`)!.innerHTML = HTML;
        }
        this.data.addPropertyListener('details', (details) => {
            updateHTML('property', details.property);
        });
        updateHTML('property', details.property);

        this.data.addPropertyListener('details', (details) => {
            updateHTML('function', details.function);
        });
        updateHTML('function', details.function);
    },
});
