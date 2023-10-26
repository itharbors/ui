'use strict';

import '../index';
import { BaseElement } from '@itharbors/ui-core';
import { registerLine, registerNode, registerGraphFilter, registerGraphOption } from '../manager';

function getAngle(x1: number, y1: number, x2: number, y2: number) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const angleRadians = Math.atan2(deltaY, deltaX);
    const angleDegrees = angleRadians * 180 / Math.PI;
    return angleDegrees;
}

registerGraphOption('flow-chart', {
    backgroundColor: '#2f2f2f',
});

registerLine('flow-chart', 'curve', {
    template: /*svg*/`
        <path d=""></path>
        <polygon points=""></polygon>
    `,
    style: /*css*/`
        g[type="curve"] > path {
            fill: none;
            stroke: #fafafa;
            stroke-width: 1px;
            transition: stroke 0.3s;
        }
        g[type="curve"] > polygon {
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

// 节点
registerNode('flow-chart', 'node', {
    template: /*html*/`
      <section class="content"></section>
    `,

    style: /*css*/`
      :host {
        background: #2b2b2bcc;
        border: 1px solid #333;
        border-radius: 4px;
        color: #ccc;
        transition: box-shadow 0.2s, border 0.2s;
      }
      :host(:hover) {
        border-color: white;
        box-shadow: 0px 0px 14px 2px white;
      }
      section {
        min-height: 20px;
        border: 1px solid #999;
        border-radius: 4px;
        padding: 4px 10px;
        text-align: center;
      }
    `,

    onInit(details) {
        this.bindDefaultMoveEvent();

        const updateHTML = (HTML: string) => {
            this.querySelector(`.content`)!.innerHTML = HTML;
        }
        this.data.addPropertyListener('details', (details) => {
            updateHTML(details.label);
        });
    },
    onUpdate(details) {
        this.querySelector(`.content`)!.innerHTML = details.label;
    },
});
