'use strict';

import type { GraphElement } from './graph';
import { registerElement, BaseElement } from '@itharbors/ui-core';
import { queryNode } from '../manager';

type GraphNodeElementData = {
    scale: number;
    // 图类型
    graphType: string;
    // 类型
    type: string;
    // 是否选中
    selected: boolean;
    // 附加描述信息
    details: { [key: string]: any };
    // 节点所在的坐标
    position: { x: number, y: number };

    // 拖拽过程中需要使用的临时变量，拖拽
    moveStartPoint: { x: number, y: number, pageX: number, pageY: number };
};

// export class GraphLineElement extends BaseElement {
   
// }

// 创建一个新的原型对象，继承自 SVGGElement 的原型
const MyCustomSVGElementPrototype = Object.create(SVGGElement.prototype);

// 添加新的方法到原型对象
MyCustomSVGElementPrototype.sayHello = function() {
    console.log("Hello from custom SVG element!");
};

// 注册自定义元素
// document.registerElement('my-custom-svg', {
//     prototype: MyCustomSVGElementPrototype,
//     extends: 'g'
// });
// debugger
// registerElement('graph-line', GraphLineElement);

// 创建一个新的类，继承自 SVGGElement
class MyCustomSVGElement extends SVGGElement {
    constructor() {
      super();
      // 在构造函数中可以进行初始化操作
      // 例如添加子元素、事件监听等
    }
  }

  // @ts-ignore 定义自定义元素
//   customElements.define('v-graph-line', MyCustomSVGElement, { extends: 'g' });
