var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// node_modules/@itharbors/ui-core/dist/theme.js
var require_theme = __commonJS({
  "node_modules/@itharbors/ui-core/dist/theme.js"() {
    "use strict";
    var $style = document.createElement("style");
    $style.innerHTML = `
body {
    /* \u57FA\u7840\u989C\u8272 */
    --color-default: #fff;
    --color-primary: #1677ff;
    --color-success: #00b578;
    --color-danger: #ff3141;
    --color-wranning: #ff8f1f;

    /* \u57FA\u7840\u989C\u8272\u4F5C\u4E3A\u80CC\u666F\u8272\u7684\u65F6\u5019\uFF0C\u9700\u8981\u4E00\u4E2A\u5BF9\u6BD4\u8272 */
    --color-default-contrast: #333;
    --color-primary-contrast: #fff;
    --color-success-contrast: #fff;
    --color-danger-contrast: #fff;
    --color-wranning-contrast: #fff;

    /* \u57FA\u7840\u989C\u8272\u4F5C\u4E3A\u80CC\u666F\u8272\u7684\u65F6\u5019\uFF0C\u9700\u8981\u4E00\u4E2A\u5BF9\u6BD4\u8272 */
    --color-default-line: #333;
    --color-primary-line: #1677ff;
    --color-success-line: #00b578;
    --color-danger-line: #ff3141;
    --color-wranning-line: #ff8f1f;

    --size-line: 24;
    --size-font: 12;
    --size-radius: 4;

    --anim-duration: 0.3s;
}
`;
    document.head.appendChild($style);
  }
});

// node_modules/@itharbors/ui-core/dist/element.js
var require_element = __commonJS({
  "node_modules/@itharbors/ui-core/dist/element.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseElement = void 0;
    var BaseElement4 = class extends HTMLElement {
      static get observedAttributes() {
        return [];
      }
      get HTMLTemplate() {
        return "";
      }
      get HTMLStyle() {
        return "";
      }
      get defaultData() {
        return {};
      }
      querySelector(selector) {
        return this.shadowRoot.querySelector(selector);
      }
      querySelectorAll(selector) {
        return this.shadowRoot.querySelectorAll(selector);
      }
      getProperty(key) {
        return this.data.getProperty(key);
      }
      setProperty(key, value) {
        return this.data.setProperty(key, value);
      }
      dispatch(eventName, options) {
        const targetOptions = {
          bubbles: true,
          cancelable: true
        };
        if (options) {
          Object.assign(targetOptions, options);
        }
        const event = new CustomEvent(eventName, targetOptions);
        this.dispatchEvent(event);
      }
      initialize() {
        this.shadowRoot.innerHTML = `<style>${this.HTMLStyle}</style>${this.HTMLTemplate}`;
        for (let key in this.defaultData) {
          if (key in this.data.stash) {
            continue;
          }
          this.data.stash[key] = JSON.parse(JSON.stringify(this.defaultData[key]));
        }
        this.onInit();
        if (this.isConnected) {
          this.onMounted();
        }
      }
      onInit() {
      }
      onMounted() {
      }
      onRemoved() {
      }
      constructor() {
        super();
        this.DEBUG = true;
        this.data = new DataManager(this);
        this.attachShadow({ mode: "open" });
        this.initialize();
      }
      attributeChangedCallback(key, legacy, value) {
        this.data.emitAttribute(key, value, legacy);
      }
      connectedCallback() {
        this.onMounted();
      }
      distconnectedCallback() {
        this.onRemoved();
      }
    };
    exports.BaseElement = BaseElement4;
    var DataManager = class {
      constructor(root) {
        this.stash = {};
        this.propertyEventMap = {};
        this.attributeEventMap = {};
        this.root = root;
      }
      touchProperty(key) {
        const legacy = this.getProperty(key);
        this.emitProperty(key, legacy, legacy);
      }
      getProperty(key) {
        return this.stash[key];
      }
      setProperty(key, value) {
        const legacy = this.stash[key];
        if (this.stash[key] === value) {
          return;
        }
        this.stash[key] = value;
        this.emitProperty(key, value, legacy);
      }
      addPropertyListener(key, handle) {
        const list = this.propertyEventMap[key] = this.propertyEventMap[key] || [];
        list.push(handle);
      }
      removePropertyListener(key, handle) {
        const list = this.propertyEventMap[key];
        if (!list) {
          return;
        }
        const index = list.indexOf(handle);
        if (index !== -1) {
          list.splice(index, 1);
        }
      }
      emitProperty(key, value, legacy) {
        const list = this.propertyEventMap[key];
        if (!list) {
          return;
        }
        list.forEach((func) => {
          func.call(this.root, value, legacy);
        });
      }
      touchAttribute(key) {
        const legacy = this.getAttribute(key);
        this.emitAttribute(key, legacy, legacy);
      }
      getAttribute(key) {
        return this.root.getAttribute(key) || "";
      }
      setAttribute(key, value) {
        const legacy = this.getAttribute(key);
        this.root.setAttribute(key, value);
        this.emitAttribute(key, value, legacy);
      }
      addAttributeListener(key, handle) {
        const list = this.attributeEventMap[key] = this.attributeEventMap[key] || [];
        list.push(handle);
      }
      removeAttributeListener(key, handle) {
        const list = this.attributeEventMap[key];
        if (!list) {
          return;
        }
        const index = list.indexOf(handle);
        if (index !== -1) {
          list.splice(index, 1);
        }
      }
      emitAttribute(key, value, legacy) {
        const list = this.attributeEventMap[key];
        if (!list) {
          return;
        }
        list.forEach((func) => {
          func.call(this.root, value, legacy);
        });
      }
    };
  }
});

// node_modules/@itharbors/ui-core/dist/index.js
var require_dist = __commonJS({
  "node_modules/@itharbors/ui-core/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.style = exports.registerElement = exports.CustomElementOption = exports.BaseElement = void 0;
    require_theme();
    var element_js_1 = require_element();
    Object.defineProperty(exports, "BaseElement", { enumerable: true, get: function() {
      return element_js_1.BaseElement;
    } });
    var CustomElementOption = class {
      constructor(elem) {
        this.template = "";
        this.style = "";
        this.attrs = {};
        this.data = {};
        this.methods = {};
        this.element = elem;
      }
    };
    exports.CustomElementOption = CustomElementOption;
    CustomElementOption.attrListenList = [];
    function registerElement4(name, element) {
      window.customElements.define(`v-${name}`, element);
    }
    exports.registerElement = registerElement4;
    exports.style = {
      solid: `
    :host {
        --background-color: var(--color-default);
        --font-color: var(--color-default-contrast);
        --border-color: var(--color-default-line);
    }
    :host([color="primary"]) {
        --background-color: var(--color-primary);
        --font-color: var(--color-primary-contrast);
        --border-color: var(--color-primary-line);
    }
    :host([color="success"]) {
        --background-color: var(--color-success);
        --font-color: var(--color-success-contrast);
        --border-color: var(--color-success-line);
    }
    :host([color="danger"]) {
        --background-color: var(--color-danger);
        --font-color: var(--color-danger-contrast);
        --border-color: var(--color-danger-line);
    }
    :host([color="wranning"]) {
        --background-color: var(--color-wranning);
        --font-color: var(--color-wranning-contrast);
        --border-color: var(--color-wranning-line);
    }
    :host([disabled]) {
        opacity: 0.4;
    }
    :host([disabled]), :host([readonly]) {
        cursor: not-allowed;
    }
    `,
      hollow: `
    :host {
        --background-color: transparent;
        --font-color: var(--color-default-contrast);
        --border-color: var(--color-default-line);
    }
    :host([color="primary"]) {
        --font-color: var(--color-primary);
        --border-color: var(--color-primary-line);
    }
    :host([color="success"]) {
        --font-color: var(--color-success);
        --border-color: var(--color-success-line);
    }
    :host([color="danger"]) {
        --font-color: var(--color-danger);
        --border-color: var(--color-danger-line);
    }
    :host([color="wranning"]) {
        --font-color: var(--color-wranning);
        --border-color: var(--color-wranning-line);
    }
    :host([disabled]) {
        opacity: 0.4;
    }
    :host([disabled]), :host([readonly]) {
        cursor: not-allowed;
    }
    `,
      line: `
    :host {
        display: inline-flex;
    
        --line-height: calc(var(--size-line) * 1px);
        --font-size: calc(var(--size-font) * 1px);
    
        --padding-row: calc((var(--size-line) - var(--size-font)) * 0.8px);
        --padding-column: calc((var(--size-line) - var(--size-font)) * 0.2px);
    }
    `
    };
  }
});

// source/element/graph-node-param.ts
var import_ui_core = __toESM(require_dist());
var GraphNodeParamElement = class extends import_ui_core.BaseElement {
  get HTMLTemplate() {
    return `<slot></slot>`;
  }
  get HTMLStyle() {
    return `:host { display: block; position: relative; }`;
  }
};
(0, import_ui_core.registerElement)("graph-node-param", GraphNodeParamElement);

// source/element/graph-node.ts
var import_ui_core2 = __toESM(require_dist());

// source/event.ts
var EventEmmiter = class {
  constructor() {
    this._handleMap = /* @__PURE__ */ new Map();
  }
  emit(channel, ...args) {
    if (!this._handleMap.has(channel)) {
      this._handleMap.set(channel, []);
    }
    const handlerList = this._handleMap.get(channel);
    Promise.all(handlerList.map((handler) => {
      return handler(...args);
    }));
  }
  addListener(channel, handler) {
    if (!this._handleMap.has(channel)) {
      this._handleMap.set(channel, []);
    }
    const handlerList = this._handleMap.get(channel);
    if (!handlerList.includes(handler)) {
      handlerList.push(handler);
    }
  }
  removeListener(channel, handler) {
    if (!this._handleMap.has(channel)) {
      return;
    }
    const handlerList = this._handleMap.get(channel);
    const index = handlerList.indexOf(handler);
    if (index !== -1) {
      handlerList.splice(index, 1);
    }
  }
};

// source/manager.ts
var eventEmmiter = new EventEmmiter();
var graphTypeMap = /* @__PURE__ */ new Map();
function generateDefaultGraph() {
  return {
    nodeMap: /* @__PURE__ */ new Map(),
    lineMap: /* @__PURE__ */ new Map(),
    graphFilter: {},
    option: {}
  };
}
function registerGraphOption(graphType, option) {
  if (!graphTypeMap.has(graphType)) {
    graphTypeMap.set(graphType, generateDefaultGraph());
  }
  const graphInfo = graphTypeMap.get(graphType);
  graphInfo.option = option;
  eventEmmiter.emit("graph-registered", graphType, option);
}
function queryGraphOption(graphType) {
  if (!graphTypeMap.has(graphType)) {
    graphTypeMap.set(graphType, generateDefaultGraph());
  }
  return graphTypeMap.get(graphType).option;
}
function registerNode(graphType, nodeType, option) {
  if (!graphTypeMap.has(graphType)) {
    graphTypeMap.set(graphType, generateDefaultGraph());
  }
  const graphInfo = graphTypeMap.get(graphType);
  graphInfo.nodeMap.set(nodeType, option);
  eventEmmiter.emit("node-registered", graphType, nodeType, option);
}
function queryNode(graphType, nodeType) {
  const graphInfo = graphTypeMap.get(graphType);
  if (!graphInfo) {
    const defaultGraphInfo = graphTypeMap.get("*");
    return defaultGraphInfo.nodeMap.get(nodeType) || defaultGraphInfo.nodeMap.get("*");
  }
  const nodeTypeOption = graphInfo.nodeMap.get(nodeType);
  if (!nodeTypeOption) {
    const defaultGraphInfo = graphTypeMap.get("*");
    return defaultGraphInfo.nodeMap.get(nodeType) || defaultGraphInfo.nodeMap.get("*");
  }
  return nodeTypeOption;
}
registerNode("*", "unknown", {
  template: `<div>Unknown</div>`,
  style: `div { background: #77777799; color: #eee; padding: 6px 12px; }`,
  onInit() {
  },
  onUpdate() {
  }
});
registerNode("*", "*", queryNode("*", "unknown"));
function registerLine(graphType, lineType, option) {
  if (!graphTypeMap.has(graphType)) {
    graphTypeMap.set(graphType, generateDefaultGraph());
  }
  const graphInfo = graphTypeMap.get(graphType);
  graphInfo.lineMap.set(lineType, option);
  eventEmmiter.emit("node-registered", graphType, lineType, option);
}
function queryLine(graphType, lineType) {
  const graphInfo = graphTypeMap.get(graphType);
  if (!graphInfo) {
    const defaultGraphInfo = graphTypeMap.get("*");
    return defaultGraphInfo.lineMap.get(lineType) || defaultGraphInfo.lineMap.get("*");
  }
  const nodeTypeOption = graphInfo.lineMap.get(lineType);
  if (!nodeTypeOption) {
    const defaultGraphInfo = graphTypeMap.get("*");
    return defaultGraphInfo.lineMap.get(lineType) || defaultGraphInfo.lineMap.get("*");
  }
  return nodeTypeOption;
}
function getAngle(x1, y1, x2, y2) {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const angleRadians = Math.atan2(deltaY, deltaX);
  const angleDegrees = angleRadians * 180 / Math.PI;
  return angleDegrees;
}
registerLine("*", "straight", {
  template: `
<path d=""></path>
<polygon points=""></polygon>
    `,
  style: `
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
        y: data.y1 - rect.height / scale / 2
      };
      const $path2 = $g.querySelector(`path`);
      $path2.setAttribute("d", `M${position.x - 20},${position.y} A20,20 1 1 1 ${position.x},${position.y + 20}`);
      const c1x2 = position.x - 4;
      const c1y2 = position.y - 20;
      const c2x2 = c1x2 + 6;
      const c2y2 = c1y2 - 7;
      const c3x2 = c1x2 - 6;
      const c3y2 = c1y2 - 7;
      const $polygon2 = $g.querySelector(`polygon`);
      $polygon2.setAttribute("points", `${c1x2},${c1y2} ${c2x2},${c2y2} ${c3x2},${c3y2}`);
      $polygon2.setAttribute("style", `transform-origin: ${c1x2}px ${c1y2}px; transform: rotate(${90}deg)`);
      return;
    }
    data.transform(
      !data.line.input.param ? "shortest" : "normal",
      !data.line.output.param ? "shortest" : "normal"
    );
    const ct1x = (data.x2 - data.x1) / 2;
    const ct1y = (data.y2 - data.y1) / 2;
    const angle = getAngle(data.x1, data.y1, data.x2, data.y2);
    const c1x = data.x2 - ct1x;
    const c1y = data.y2 - ct1y;
    const c2x = c1x + 6;
    const c2y = c1y - 7;
    const c3x = c1x - 6;
    const c3y = c1y - 7;
    const $path = $g.querySelector(`path`);
    $path.setAttribute("d", `M${data.x1},${data.y1} L${data.x2},${data.y2}`);
    const $polygon = $g.querySelector(`polygon`);
    $polygon.setAttribute("points", `${c1x},${c1y} ${c2x},${c2y} ${c3x},${c3y}`);
    $polygon.setAttribute("style", `transform-origin: ${c1x}px ${c1y}px; transform: rotate(${angle - 90}deg)`);
  }
});
registerLine("*", "curve", {
  template: `
<path class="stroke" d=""></path>
<path class="background" d=""></path>
    `,
  style: `
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
      !data.line.input.param ? "shortest" : "normal",
      !data.line.output.param ? "shortest" : "normal"
    );
    let cpx1 = 0;
    let cpy1 = 0;
    let cpx2 = 0;
    let cpy2 = 0;
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
    const cm = 100;
    switch (data.r1) {
      case "left":
        if (cpx1 - data.x1 > -cm) {
          cpx1 = data.x1 - cm;
        }
        cpy1 = data.y1;
        break;
      case "right":
        if (cpx1 - data.x1 < cm) {
          cpx1 = data.x1 + cm;
        }
        cpy1 = data.y1;
        break;
      case "down":
        if (cpy1 - data.y1 < cm) {
          cpy1 = data.y1 + cm;
        }
        cpx1 = data.x1;
        break;
      case "up":
        if (cpy1 - data.y1 > -cm) {
          cpy1 = data.y1 - cm;
        }
        cpx1 = data.x1;
        break;
    }
    switch (data.r2) {
      case "left":
        if (cpx2 - data.x2 > -cm) {
          cpx2 = data.x2 - cm;
        }
        cpy2 = data.y2;
        break;
      case "right":
        if (cpx2 - data.x2 < cm) {
          cpx2 = data.x2 + cm;
        }
        cpy2 = data.y2;
        break;
      case "down":
        if (cpy2 - data.y2 < cm) {
          cpy2 = data.y2 + cm;
        }
        cpx2 = data.x2;
        break;
      case "up":
        if (cpy2 - data.y2 > -cm) {
          cpy2 = data.y2 - cm;
        }
        cpx2 = data.x2;
        break;
    }
    const $pathList = $g.querySelectorAll(`path`);
    $pathList[0].setAttribute("d", `M${data.x1},${data.y1} C${cpx1},${cpy1} ${cpx2},${cpy2} ${data.x2},${data.y2}`);
    $pathList[1].setAttribute("d", `M${data.x1},${data.y1} C${cpx1},${cpy1} ${cpx2},${cpy2} ${data.x2},${data.y2}`);
  }
});
registerLine("*", "*", queryLine("*", "curve"));
function registerGraphFilter(graphType, info) {
  if (!graphTypeMap.has(graphType)) {
    graphTypeMap.set(graphType, generateDefaultGraph());
  }
  const graphInfo = graphTypeMap.get(graphType);
  const keys = Object.keys(info);
  keys.forEach((key) => {
    graphInfo.graphFilter[key] = info[key];
  });
}
function queryGraphFliter(graphType, key) {
  const info = graphTypeMap.get(graphType) || graphTypeMap.get("*");
  const filter = info.graphFilter[key] || graphTypeMap.get("*").graphFilter[key];
  return filter;
}
registerGraphFilter("*", {
  lineFilter(nodes, lines, line, input, output) {
    if (input && output && input.type !== output.type) {
      return false;
    }
    return true;
  }
});

// source/element/graph-node.ts
var GraphNodeElement = class extends import_ui_core2.BaseElement {
  get HTMLTemplate() {
    return ``;
  }
  get HTMLStyle() {
    return ``;
  }
  get defaultData() {
    return {
      scale: 1,
      graphType: "",
      type: "",
      selected: false,
      details: {},
      position: { x: 0, y: 0 },
      moveStartPoint: { x: 0, y: 0, pageX: 0, pageY: 0 }
    };
  }
  getHost() {
    const $shadom = this.getRootNode();
    return $shadom == null ? void 0 : $shadom.host;
  }
  startMove() {
    const custom = new CustomEvent("move-node", {
      bubbles: false,
      cancelable: false,
      detail: {
        node: this
      }
    });
    this.getRootNode().dispatchEvent(custom);
  }
  stopMove() {
    const custom = new CustomEvent("interrupt-move-node", {
      bubbles: false,
      cancelable: false,
      detail: {}
    });
    this.getRootNode().dispatchEvent(custom);
  }
  startConnect(type, param, paramDirection, details) {
    const uuid = this.data.getAttribute("node-uuid");
    if (!uuid) {
      return;
    }
    const custom = new CustomEvent("connect-node", {
      bubbles: false,
      cancelable: false,
      detail: {
        lineType: type,
        node: uuid,
        param,
        paramDirection,
        details
      }
    });
    this.getRootNode().dispatchEvent(custom);
  }
  hasConnect() {
    const $graph = this.getRootNode();
    return $graph.host.hasConnect();
  }
  stopConnect() {
    const custom = new CustomEvent("interrupt-connect-node", {
      bubbles: false,
      cancelable: false,
      detail: {}
    });
    this.getRootNode().dispatchEvent(custom);
  }
  select(option) {
    const custom = new CustomEvent("select-node", {
      bubbles: false,
      cancelable: false,
      detail: {
        target: this,
        clearLines: option.clearLines,
        clearNodes: option.clearNodes
      }
    });
    this.getRootNode().dispatchEvent(custom);
  }
  unselect() {
    const custom = new CustomEvent("unselect-node", {
      bubbles: false,
      cancelable: false,
      detail: {
        target: this
      }
    });
    this.getRootNode().dispatchEvent(custom);
  }
  clearOtherSelected() {
    const custom = new CustomEvent("clear-select-node", {
      bubbles: false,
      cancelable: false,
      detail: {}
    });
    this.getRootNode().dispatchEvent(custom);
  }
  bindDefaultParamEvent() {
    const $paramList = this.querySelectorAll(`v-graph-node-param`);
    Array.prototype.forEach.call($paramList, ($param) => {
      $param.addEventListener("mousedown", (event) => {
        event.stopPropagation();
        event.preventDefault();
        const name = $param.getAttribute("name");
        if (!name) {
          return;
        }
        const paramDirection = $param.getAttribute("direction");
        if (paramDirection !== "input" && paramDirection !== "output") {
          return;
        }
        this.startConnect("", name, paramDirection);
      });
    });
  }
  bindDefaultMoveEvent() {
    this.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (!this.hasAttribute("selected")) {
        if (!event.metaKey && !event.ctrlKey) {
          this.clearOtherSelected();
        }
        const clear = event.metaKey || event.ctrlKey;
        this.select({
          clearLines: !clear,
          clearNodes: !clear
        });
      }
      this.startMove();
    });
  }
  onInit() {
    let inited = false;
    this.data.addPropertyListener("type", (type, legacy) => {
      const graphType = this.data.getProperty("graphType");
      const panel = queryNode(graphType, type);
      const details = this.data.getProperty("details");
      if (panel) {
        this.shadowRoot.innerHTML = `<style>:host > * {transform: translate3d(0, 0, 0);}
${panel.style}
</style>
${panel.template}`;
      }
      inited && panel.onUpdate.call(this, details);
    });
    this.data.addPropertyListener("details", (details) => {
      const type = this.data.getProperty("type");
      const graphType = this.data.getProperty("graphType");
      const panel = queryNode(graphType, type);
      panel.onInit.call(this, details);
      inited = true;
      inited && panel.onUpdate.call(this, details);
    });
    this.data.addPropertyListener("position", (position, legacy) => {
      this.setAttribute("style", `--offset-x: ${position.x}px; --offset-y: ${position.y}px;`);
    });
    this.data.addPropertyListener("selected", (selected, legacy) => {
      if (selected) {
        this.setAttribute("selected", "");
      } else {
        this.removeAttribute("selected");
      }
    });
  }
  onUpdate() {
    const type = this.data.getProperty("type");
    const graphType = this.data.getProperty("graphType");
    const details = this.data.getProperty("details");
    const panel = queryNode(graphType, type);
    panel.onUpdate.call(this, details);
  }
};
(0, import_ui_core2.registerElement)("graph-node", GraphNodeElement);

// source/element/graph/index.ts
var import_ui_core3 = __toESM(require_dist());

// source/element/utils.ts
function generateUUID() {
  return "t_" + Date.now() + (Math.random() + "").substring(10);
}
function getParamElementOffset($node, selector) {
  const $param = $node.querySelector(selector);
  if (!$param) {
    return null;
  }
  if ($param.hasAttribute("hidden")) {
    return null;
  }
  const nodeBBound = $node.getBoundingClientRect();
  const paramBBound = $param.getBoundingClientRect();
  return {
    x: paramBBound.width / 2 + paramBBound.x - (nodeBBound.width / 2 + nodeBBound.x),
    y: paramBBound.height / 2 + paramBBound.y - (nodeBBound.height / 2 + nodeBBound.y),
    role: $param.getAttribute("role")
  };
}
function queryParamInfo($root, node, param) {
  const $node = $root.querySelector(`#nodes > v-graph-node[node-uuid="${node}"]`);
  if (!$node) {
    return;
  }
  const $param = $node.querySelector(`v-graph-node-param[name="${param}"]`);
  if (!$param) {
    return;
  }
  return {
    direction: $param.getAttribute("direction"),
    type: $param.getAttribute("type"),
    name: $param.getAttribute("name"),
    role: $param.getAttribute("role")
  };
}
function requestAnimtionFrameThrottling(func) {
  let wait = null;
  const handle = function(...args) {
    return __async(this, null, function* () {
      if (wait) {
        wait = args;
        return;
      }
      wait = args;
      requestAnimationFrame(() => {
        func(...wait);
        wait = null;
      });
    });
  };
  return handle;
}

// source/element/graph/data.ts
var ParamConnectData = class {
  constructor(line, scale, $nodeA, $nodeB, nodeA, nodeB) {
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.r1 = "all";
    this.r2 = "all";
    this.d1 = 1;
    this.d2 = 1;
    this.scale = 1;
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
    return this.$nodeA.getBoundingClientRect();
  }
  getNodeBBoundingClientRect() {
    return this.$nodeB.getBoundingClientRect();
  }
  transform(startType, endType) {
    switch (startType) {
      case "snap":
        snapBorderInput(this, this.$nodeA, this.$nodeB, this.nodeA, this.nodeB, this.scale);
        break;
      case "shortest":
        if (this.$nodeA !== this.$nodeB) {
          shortestInput(this, this.$nodeA, this.$nodeB, this.nodeA, this.nodeB, this.scale);
        }
        break;
    }
    switch (endType) {
      case "snap":
        snapBorderOutput(this, this.$nodeA, this.$nodeB, this.nodeA, this.nodeB, this.scale);
        break;
      case "shortest":
        if (this.$nodeA !== this.$nodeB) {
          shortestOutput(this, this.$nodeA, this.$nodeB, this.nodeA, this.nodeB, this.scale);
        }
        break;
    }
  }
};
function intersect(x1, y1, x2, y2, x3, y3, w, h) {
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
function snapBorderInput(data, $nodeA, $nodeB, nodeA, nodeB, scale) {
  if (!$nodeA || !nodeA || !nodeB) {
    return;
  }
  let r1 = data.r1;
  if (r1 === "all") {
    const xd = data.x1 - data.x2;
    const yd = data.y1 - data.y2;
    const tl = Math.abs(xd / yd);
    if (tl <= 1) {
      r1 = yd <= 0 ? "up" : "down";
    } else {
      r1 = xd <= 0 ? "right" : "left";
    }
  }
  const boundA = $nodeA.getBoundingClientRect();
  switch (r1) {
    case "right":
      data.x1 += boundA.width / 2;
      break;
    case "left":
      data.x1 -= boundA.width / 2;
      break;
    case "up":
      data.y1 += boundA.height / 2;
      break;
    case "down":
      data.y1 -= boundA.height / 2;
      break;
  }
}
function snapBorderOutput(data, $nodeA, $nodeB, nodeA, nodeB, scale) {
  if (!$nodeB || !nodeA || !nodeB) {
    return;
  }
  const boundB = $nodeB.getBoundingClientRect();
  let r2 = data.r2;
  if (r2 === "all") {
    const xd = data.x1 - data.x2;
    const yd = data.y1 - data.y2;
    const tl = Math.abs(xd / yd);
    if (tl <= 1) {
      r2 = yd <= 0 ? "up" : "down";
    } else {
      r2 = xd <= 0 ? "right" : "left";
    }
  }
  switch (r2) {
    case "right":
      data.x2 -= boundB.width / 2;
      break;
    case "left":
      data.x2 += boundB.width / 2;
      break;
    case "up":
      data.y2 -= boundB.height / 2;
      break;
    case "down":
      data.y2 += boundB.height / 2;
      break;
  }
}
function shortestInput(data, $nodeA, $nodeB, nodeA, nodeB, scale = 1) {
  if (!$nodeA || !nodeA || !nodeB) {
    return;
  }
  const boundA = $nodeA.getBoundingClientRect();
  boundA.width /= scale;
  boundA.height /= scale;
  const pa = intersect(data.x1, data.y1, data.x2, data.y2, nodeA.position.x, nodeA.position.y, boundA.width, boundA.height);
  data.x1 = pa[0];
  data.y1 = pa[1];
  data.d1 = pa[2];
}
function shortestOutput(data, $nodeA, $nodeB, nodeA, nodeB, scale = 1) {
  if (!$nodeB || !nodeA || !nodeB) {
    return;
  }
  const boundB = $nodeB.getBoundingClientRect();
  boundB.width /= scale;
  boundB.height /= scale;
  const pb = intersect(data.x2, data.y2, data.x1, data.y1, nodeB.position.x, nodeB.position.y, boundB.width, boundB.height);
  data.x2 = pb[0];
  data.y2 = pb[1];
  data.d2 = pb[2];
}

// source/element/graph/utils.ts
var nodeElementMap = /* @__PURE__ */ new WeakMap();
function resizeCanvas($elem, $canvas, box) {
  $canvas.setAttribute("width", box.width + "");
  $canvas.setAttribute("height", box.height + "");
  const calibration = $elem.data.getProperty("calibration");
  calibration.x = box.width / 2;
  calibration.y = box.height / 2;
  $elem.data.emitProperty("calibration", calibration, calibration);
}
function renderMesh($elem, ctx, box, offset, scale, option) {
  $elem.setAttribute("style", `--background-color: ${option.backgroundColor};`);
  const step = (option.gridSize || 50) * scale;
  ctx.clearRect(0, 0, box.width, box.height);
  if (option.gridColor || option.gridSize) {
    const center = {
      x: Math.round(box.width / 2) + 0.5 + offset.x,
      y: Math.round(box.height / 2) + 0.5 + offset.y
    };
    if (option.showOriginPoint) {
      ctx.beginPath();
      ctx.fillStyle = option.originPointColor || "#ccc";
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
    ctx.strokeStyle = option.originPointColor || "#ccc";
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
    ctx.strokeStyle = option.gridColor || "#666";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}
var refreshFlag = /* @__PURE__ */ new Set();
var renderNodes = requestAnimtionFrameThrottling(_renderNodes);
function _renderNodes($elem, offset, scale) {
  const $nodes = $elem.querySelectorAll("#nodes > v-graph-node");
  const nodes = $elem.data.getProperty("nodes");
  const graphType = $elem.data.getAttribute("type") || "default";
  const $root = $elem.querySelector("#nodes");
  for (let i = 0; i < $nodes.length; i++) {
    const $node = $nodes[i];
    const uuid = $node.getAttribute("node-uuid") || "";
    const node = nodes[uuid];
    refreshFlag.add(uuid);
    if (!node) {
      $node.remove();
    } else {
      $node.data.setAttribute("node-uuid", uuid);
      $node.data.setProperty("scale", Math.floor(scale * 100) / 100);
      $node.data.setProperty("graphType", graphType);
      $node.data.setProperty("type", node.type);
      $node.data.setProperty("position", node.position);
      $node.data.setProperty("details", node.details);
    }
  }
  for (const uuid in nodes) {
    const node = nodes[uuid];
    if (!node || refreshFlag.has(uuid)) {
      continue;
    }
    const $node = document.createElement("v-graph-node");
    nodeElementMap.set(node, $node);
    $root.appendChild($node);
    $node.data.setAttribute("node-uuid", uuid);
    $node.data.setProperty("scale", Math.floor(scale * 100) / 100);
    $node.data.setProperty("graphType", graphType);
    $node.data.setProperty("type", node.type);
    $node.data.setProperty("position", node.position);
    $node.data.setProperty("details", node.details);
    $node.data.addPropertyListener("position", (reOffset) => {
      node.position = reOffset;
      const scale2 = $elem.data.getProperty("scale");
      renderNodes($elem, offset, scale2);
      renderLines($elem, offset, scale2);
    });
  }
  refreshFlag.clear();
}
function renderLine(graphType, $line, line, lines, nodes, scale) {
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
}
var renderLines = requestAnimtionFrameThrottling(_renderLines);
function _renderLines($elem, offset, scale) {
  const $root = $elem.querySelector("#lines");
  if ($root.hasAttribute("hidden")) {
    return;
  }
  const graphType = $elem.data.getAttribute("type") || "default";
  const lines = $elem.data.getProperty("lines");
  const nodes = $elem.data.getProperty("nodes");
  const $lines = $elem.querySelectorAll("#lines > g[line-uuid]");
  const refreshFlag2 = /* @__PURE__ */ new Set();
  for (let i = 0; i < $lines.length; i++) {
    const $line = $lines[i];
    const uuid = $line.getAttribute("line-uuid") || "";
    const line = lines[uuid];
    refreshFlag2.add(uuid);
    if (!line) {
      $line.remove();
    } else {
      $line.setAttribute("line-uuid", uuid);
      renderLine(graphType, $line, line, lines, nodes, scale);
    }
  }
  for (const uuid in lines) {
    const line = lines[uuid];
    if (!line || refreshFlag2.has(uuid)) {
      continue;
    }
    const $line = document.createElementNS("http://www.w3.org/2000/svg", "g");
    $line.setAttribute("line-uuid", uuid);
    const lineAdapter = queryLine(graphType, line.type);
    $line.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const custom = new CustomEvent("select-line", {
        bubbles: false,
        cancelable: false,
        detail: {
          target: $line
        }
      });
      $line.getRootNode().dispatchEvent(custom);
    });
    const $style = $elem.querySelector(`style[line-type="${line.type}"]`);
    if (!$style) {
      const $style2 = document.createElement("style");
      $style2.setAttribute("line-type", line.type);
      $style2.innerHTML = lineAdapter.style;
      $elem.shadowRoot.appendChild($style2);
    }
    $line.setAttribute("type", line.type);
    $line.innerHTML = lineAdapter.template;
    renderLine(graphType, $line, line, lines, nodes, scale);
    $root.appendChild($line);
  }
}
function bindEventListener($elem) {
  function selectLine($g) {
    $g.setAttribute("selected", "");
    $elem.__selectLines__.add($g);
    const lineMap = $elem.getProperty("lines");
    const uuid = $g.getAttribute("line-uuid");
    if (uuid) {
      const line = lineMap[uuid];
      line && $elem.dispatch("line-selected", {
        cancelable: false,
        bubbles: false,
        detail: {
          line
        }
      });
    }
  }
  function unselectLine($g) {
    if ($g.hasAttribute("selected")) {
      $g.removeAttribute("selected");
      $elem.__selectLines__.delete($g);
      const lineMap = $elem.getProperty("lines");
      const uuid = $g.getAttribute("line-uuid");
      if (uuid) {
        const line = lineMap[uuid];
        line && $elem.dispatch("line-unselected", {
          cancelable: false,
          bubbles: false,
          detail: {
            line
          }
        });
      }
    }
  }
  $elem.shadowRoot.addEventListener("contextmenu", (event) => {
    event.stopPropagation();
    event.preventDefault();
  });
  $elem.shadowRoot.addEventListener("select-line", (event) => {
    const cEvent = event;
    if (!event.metaKey && !event.ctrlKey) {
      $elem.clearAllBlockSelected();
      $elem.clearAllLineSelected();
    }
    selectLine(cEvent.detail.target);
  });
  $elem.shadowRoot.addEventListener("unselect-line", (event) => {
    const cEvent = event;
    unselectLine(cEvent.detail.target);
  });
  $elem.shadowRoot.addEventListener("clear-select-line", (event) => {
    $elem.clearAllLineSelected();
  });
  $elem.shadowRoot.addEventListener("select-node", (event) => {
    const cEvent = event;
    const $node = cEvent.detail.target;
    $node.setProperty("selected", true);
    if (cEvent.detail.clearLines) {
      $elem.clearAllLineSelected();
    }
    if (cEvent.detail.clearNodes) {
      $elem.clearAllBlockSelected();
    }
    const nodeMap = $elem.getProperty("nodes");
    const uuid = $node.getAttribute("node-uuid");
    if (uuid) {
      const node = nodeMap[uuid];
      node && $elem.dispatch("node-selected", {
        cancelable: false,
        bubbles: false,
        detail: {
          node
        }
      });
    }
  });
  $elem.shadowRoot.addEventListener("unselect-node", (event) => {
    const cEvent = event;
    const $node = cEvent.detail.target;
    $node.setProperty("selected", false);
    const nodeMap = $elem.getProperty("nodes");
    const uuid = $node.getAttribute("node-uuid");
    if (uuid) {
      const node = nodeMap[uuid];
      node && $elem.dispatch("node-unselected", {
        cancelable: false,
        bubbles: false,
        detail: {
          node
        }
      });
    }
  });
  $elem.shadowRoot.addEventListener("clear-select-node", (event) => {
    $elem.clearAllBlockSelected();
  });
  $elem.addEventListener("mousedown", (event) => {
    if ($elem.hasConnect()) {
      $elem.stopConnect();
      return;
    }
    switch (event.button) {
      case 0: {
        const selectBox = $elem.data.getProperty("selectBox");
        const startPoint = {
          x: event.pageX,
          y: event.pageY
        };
        selectBox.x = event.offsetX;
        selectBox.y = event.offsetY;
        const mousemove = (event2) => {
          const scale = $elem.data.getProperty("scale");
          const point = {
            x: event2.pageX - startPoint.x,
            y: event2.pageY - startPoint.y
          };
          const reSelectBox = {
            x: selectBox.x,
            y: selectBox.y,
            w: point.x,
            h: point.y
          };
          if (reSelectBox.w < 0) {
            reSelectBox.x += reSelectBox.w;
            reSelectBox.w = -reSelectBox.w;
          }
          if (reSelectBox.h < 0) {
            reSelectBox.y += reSelectBox.h;
            reSelectBox.h = -reSelectBox.h;
          }
          $elem.data.setProperty("selectBox", reSelectBox);
        };
        const mouseup = (event2) => {
          if (event2.pageX !== startPoint.x || event2.pageY !== startPoint.y) {
            event2.stopPropagation();
            event2.preventDefault();
          }
          document.removeEventListener("mousemove", mousemove);
          document.removeEventListener("mouseup", mouseup, true);
          const reSelectBox = { x: 0, y: 0, w: 0, h: 0 };
          $elem.data.setProperty("selectBox", reSelectBox);
        };
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup, true);
        break;
      }
      case 1:
      case 2: {
        const offset = $elem.data.getProperty("offset");
        const start = {
          x: offset.x,
          y: offset.y
        };
        const point = {
          x: event.pageX,
          y: event.pageY
        };
        const $root = $elem.querySelector("#lines");
        $root.setAttribute("hidden", "");
        const mousemove = (event2) => {
          start.x = event2.pageX - point.x;
          start.y = event2.pageY - point.y;
          const reOffset = {
            x: offset.x + start.x,
            y: offset.y + start.y
          };
          $elem.data.setProperty("offset", reOffset);
        };
        const mouseup = (event2) => {
          $root.removeAttribute("hidden");
          if (event2.pageX !== point.x || event2.pageY !== point.y) {
            event2.stopPropagation();
            event2.preventDefault();
          }
          document.removeEventListener("mousemove", mousemove);
          document.removeEventListener("mouseup", mouseup, true);
        };
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup, true);
        break;
      }
    }
  });
  $elem.addEventListener("wheel", (event) => {
    event.stopPropagation();
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.05 : -0.05;
    let scale = $elem.data.getProperty("scale");
    scale += delta;
    scale = Math.min(2, Math.max(0.2, scale));
    $elem.data.setProperty("scale", Math.floor(scale * 100) / 100);
  });
  $elem.shadowRoot.addEventListener("move-node", (event) => {
    const cEvent = event;
    const $nodeInfoList = $elem.getSelectedNodeList();
    if ($nodeInfoList.length === 0 && cEvent.detail.node) {
      const nodes = $elem.data.getProperty("nodes");
      const uuid = cEvent.detail.node.getAttribute("node-uuid") || "";
      const node = nodes[uuid];
      if (node) {
        $nodeInfoList.push({
          id: uuid,
          target: node
        });
      }
    }
    let t = false;
    let at = false;
    const $root = $elem.querySelector("#lines");
    $root.setAttribute("hidden", "");
    const scale = $elem.getProperty("scale");
    const mousemove = (event2) => {
      if (!t) {
        const scale2 = $elem.getProperty("scale");
        $nodeInfoList.forEach((info) => {
          const $node = nodeElementMap.get(info.target);
          $node.setAttribute("moving", "");
          const position = $node.getProperty("position");
          const moveStartPoint = $node.getProperty("moveStartPoint");
          moveStartPoint.x = position.x * scale2;
          moveStartPoint.y = position.y * scale2;
          moveStartPoint.pageX = event2.pageX;
          moveStartPoint.pageY = event2.pageY;
        });
        t = true;
      }
      if (at === true) {
        return;
      }
      at = true;
      requestAnimationFrame(() => {
        at = false;
        const scale2 = $elem.getProperty("scale");
        $nodeInfoList.forEach((info) => {
          const $node = nodeElementMap.get(info.target);
          const moveStartPoint = $node.getProperty("moveStartPoint");
          const reOffset = {
            x: (moveStartPoint.x + (event2.pageX - moveStartPoint.pageX)) / scale2,
            y: (moveStartPoint.y + (event2.pageY - moveStartPoint.pageY)) / scale2
          };
          $node.setProperty("position", reOffset);
        });
      });
    };
    const mouseup = (event2) => {
      const scale2 = $elem.getProperty("scale");
      const offset = $elem.getProperty("offset");
      if (t) {
        $nodeInfoList.forEach((info) => {
          const $node = nodeElementMap.get(info.target);
          $node.setAttribute("moving", "");
          const moveStartPoint = $node.getProperty("moveStartPoint");
          const offset2 = {
            x: event2.pageX - moveStartPoint.pageX,
            y: event2.pageY - moveStartPoint.pageY
          };
          const reOffset = {
            x: (moveStartPoint.x + offset2.x) / scale2,
            y: (moveStartPoint.y + offset2.y) / scale2
          };
          $node.setProperty("position", reOffset);
        });
      }
      stopmove();
      const $root2 = $elem.querySelector("#lines");
      $root2.removeAttribute("hidden");
      renderLines($elem, offset, scale2);
    };
    const stopmove = (event2) => {
      const cEvent2 = event2;
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup, true);
      $elem.shadowRoot.removeEventListener("move-node", stopmove);
      $nodeInfoList.forEach((info) => {
        const $node = nodeElementMap.get(info.target);
        $node.removeAttribute("moving");
      });
      const moveList = $nodeInfoList.map((info) => {
        const $node = nodeElementMap.get(info.target);
        const moveStartPoint = $node.getProperty("moveStartPoint");
        const position = $node.getProperty("position");
        return {
          id: $node.getAttribute("node-uuid") || "",
          source: {
            x: moveStartPoint.x / scale,
            y: moveStartPoint.y / scale
          },
          target: position
        };
      });
      $elem.dispatch("node-position-changed", {
        detail: {
          moveList
        }
      });
    };
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup, true);
    $elem.shadowRoot.addEventListener("interrupt-move-node", stopmove);
  });
}

// source/element/graph/index.ts
var HTML = `
<canvas id="meshes"></canvas>
<div id="dom-box">
    <svg id="lines"></svg>
    <div id="nodes"></div>
</div>
<div class="select-box"></div>
`;
var STYLE = `
${import_ui_core3.style.solid}
${import_ui_core3.style.line}
:host {
    --background-color: #1f1f1f;

    display: block;

    border-radius: calc(var(--size-radius) * 1px);
    border: 1px solid var(--border-color);
    box-sizing: border-box;
    background-color: var(--background-color);

    position: relative;
    overflow: hidden;

    --offset-x: 0;
    --offset-y: 0;
}
#meshes {
    width: 100%;
    height: 100%;
    position: absolute;
}
#dom-box {
    position: relative;
    height: 100%;
    width: 100%;
    transform: translate(var(--offset-x), var(--offset-y)) scale(var(--scale));
    will-change: transform;
}
#nodes {

}
#lines {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    overflow: visible;
    transition: opacity 0.3s;
}
#lines[hidden] {
    opacity: 0;
}

v-graph-node {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: center center;
    transform: translateX(0) translateX(var(--offset-x)) translateY(0) translateY(var(--offset-y));
    will-change: transform;
}
v-graph-node[moving] {
    z-index: 999;
}

.select-box {
    position: absolute;
    background: white;
    opacity: 0.3;
    width: 0;
    height: 0;
    top: 0;
    left: 0;
}
`;
var GraphElement = class extends import_ui_core3.BaseElement {
  constructor() {
    super(...arguments);
    this.__selectLines__ = /* @__PURE__ */ new Set();
  }
  static get observedAttributes() {
    return ["type"];
  }
  get HTMLTemplate() {
    return HTML;
  }
  get HTMLStyle() {
    return STYLE;
  }
  get defaultData() {
    return {
      offset: { x: 0, y: 0 },
      calibration: { x: 0, y: 0 },
      selectBox: { x: 0, y: 0, w: 0, h: 0 },
      scale: 1,
      nodes: {},
      lines: {}
    };
  }
  dispatch(eventName, options) {
    const targetOptions = {
      bubbles: false,
      cancelable: false
    };
    if (options) {
      Object.assign(targetOptions, options);
    }
    const event = new CustomEvent(eventName, targetOptions);
    this.dispatchEvent(event);
  }
  convertCoordinate(x, y) {
    const calibration = this.getProperty("calibration");
    const offset = this.getProperty("offset");
    const scale = this.getProperty("scale");
    return {
      x: (x - calibration.x - offset.x) / scale,
      y: (y - calibration.y - offset.y) / scale
    };
  }
  generateNode(type) {
    return {
      type: type || "unknown",
      position: { x: 0, y: 0 },
      details: {}
    };
  }
  addNode(node, id) {
    const uuid = id || generateUUID();
    const nodes = this.getProperty("nodes");
    nodes[uuid] = node;
    requestAnimationFrame(() => {
      this.data.emitProperty("nodes", nodes, nodes);
      this.dispatch("node-added", {
        detail: {
          node
        }
      });
    });
    return uuid;
  }
  removeNode(id) {
    const nodes = this.getProperty("nodes");
    const node = nodes[id];
    if (!node) {
      return;
    }
    delete nodes[id];
    this.data.emitProperty("nodes", nodes, nodes);
    this.dispatch("node-removed", {
      detail: {
        node
      }
    });
    return node;
  }
  setNodeDetai(id, details) {
    const nodes = this.getProperty("nodes");
    const node = nodes[id];
    if (!node) {
      return;
    }
    node.details = details;
    this.dispatch("node-changed", {
      detail: {
        id,
        node
      }
    });
  }
  getNodeDetai(id) {
    const nodes = this.getProperty("nodes");
    const node = nodes[id];
    return node ? node.details : "";
  }
  getNode(id) {
    const nodes = this.data.getProperty("nodes");
    return nodes[id];
  }
  queryNodeElement(id) {
    const $node = this.querySelector(`#nodes > v-graph-node[node-uuid="${id}"]`);
    return $node;
  }
  generateLine(type, details) {
    return {
      type: type || "straight",
      details: details || {},
      input: {
        node: ""
      },
      output: {
        node: ""
      }
    };
  }
  addLine(line, id) {
    const uuid = id || generateUUID();
    setTimeout(() => {
      requestAnimationFrame(() => {
        const lines = this.getProperty("lines");
        const nodes = this.data.getProperty("nodes");
        const graphType = this.data.getAttribute("type") || "default";
        const lineFilter = queryGraphFliter(graphType, "lineFilter");
        const input = queryParamInfo(this, line.input.node, line.input.param);
        const output = queryParamInfo(this, line.output.node, line.output.param);
        if (lineFilter(nodes, lines, line, input, output)) {
          lines[uuid] = line;
          this.data.emitProperty("lines", lines, lines);
          this.dispatch("line-added", {
            detail: {
              line
            }
          });
        }
      });
    }, 20);
    return uuid;
  }
  removeLine(id) {
    const lines = this.getProperty("lines");
    const line = lines[id];
    if (!line) {
      return;
    }
    delete lines[id];
    this.data.emitProperty("lines", lines, lines);
    this.dispatch("line-removed", {
      detail: {
        line
      }
    });
    return line;
  }
  setLineDetail(id, details) {
    const lines = this.getProperty("lines");
    const line = lines[id];
    if (!line) {
      return;
    }
    line.details = details;
    this.dispatch("line-changed", {
      detail: {
        line
      }
    });
  }
  getLineDetails(id) {
    const lines = this.getProperty("lines");
    const line = lines[id];
    return line ? line.details : "";
  }
  getLine(id) {
    const lines = this.data.getProperty("lines");
    return lines ? lines[id] : void 0;
  }
  queryLineElement(id) {
    const $line = this.querySelector(`#lines > g[line-uuid="${id}"]`);
    return $line;
  }
  clear() {
    this.setProperty("nodes", []);
    this.setProperty("lines", []);
  }
  getSelectedNodeList() {
    const nodeList = [];
    const nodes = this.getProperty("nodes");
    for (let id in nodes) {
      const node = nodes[id];
      const $node = nodeElementMap.get(node);
      if ($node && $node.getProperty("selected") === true) {
        nodeList.push({
          id,
          target: node
        });
      }
    }
    return nodeList;
  }
  getSelectedLineList() {
    const lineList = [];
    const lineMap = this.getProperty("lines");
    this.__selectLines__.forEach(($g) => {
      const uuid = $g.getAttribute("line-uuid");
      if (uuid) {
        const line = lineMap[uuid];
        line && lineList.push({
          id: uuid,
          target: line
        });
      }
    });
    return lineList;
  }
  clearAllLineSelected() {
    const lines = this.getProperty("lines");
    this.__selectLines__.forEach(($g) => {
      if ($g.hasAttribute("selected")) {
        $g.removeAttribute("selected");
        this.__selectLines__.delete($g);
        const uuid = $g.getAttribute("line-uuid");
        const custom = new CustomEvent("line-unselected", {
          bubbles: false,
          cancelable: false,
          detail: {
            line: lines[uuid]
          }
        });
        this.shadowRoot.dispatchEvent(custom);
      }
    });
  }
  clearAllBlockSelected() {
    const nodes = this.getProperty("nodes");
    for (let id in nodes) {
      const node = nodes[id];
      const $node = nodeElementMap.get(node);
      if ($node) {
        $node.setProperty("selected", false);
        const node2 = nodes[id];
        $node.dispatch("node-unselected", {
          cancelable: false,
          bubbles: false,
          detail: {
            node: node2
          }
        });
      }
    }
  }
  startConnect(lineType, nodeUUID, paramName, paramDirection, details) {
    const lines = this.data.getProperty("lines");
    const nodes = this.data.getProperty("nodes");
    let line = this.getLine("connect-param-line");
    if (line) {
      this.stopConnect();
      let dt = "output";
      if (paramDirection === "output") {
        dt = "input";
      }
      if (line[dt].__fake) {
        delete line[dt].__fake;
        line[dt].node = nodeUUID;
        line[dt].param = paramName;
        this.dispatch("node-connected", {
          detail: {
            line
          }
        });
      } else {
        this.data.emitProperty("lines", lines, lines);
      }
      return;
    }
    line = this.generateLine(lineType);
    const fake = this.generateNode();
    const calibration = this.data.getProperty("calibration");
    const offset = this.data.getProperty("offset");
    if (paramDirection === "input") {
      line.output.node = nodeUUID;
      line.output.param = paramName;
      const nodeE = nodes[line.output.node];
      if (nodeE) {
        fake.position.x = nodeE.position.x + 1;
        fake.position.y = nodeE.position.y + 1;
      }
      line.input.__fake = fake;
    } else if (paramDirection === "output") {
      line.input.node = nodeUUID;
      line.input.param = paramName;
      const nodeE = nodes[line.input.node];
      if (nodeE) {
        fake.position.x = nodeE.position.x + 1;
        fake.position.y = nodeE.position.y + 1;
      }
      line.output.__fake = fake;
    } else {
      line.input.node = nodeUUID;
      const nodeE = nodes[line.input.node];
      if (nodeE) {
        fake.position.x = nodeE.position.x + 1;
        fake.position.y = nodeE.position.y + 1;
      }
      line.output.__fake = fake;
    }
    lines["connect-param-line"] = line;
    this.data.emitProperty("lines", lines, lines);
    this.__connect__event__ = (event) => {
      const scale = this.data.getProperty("scale");
      fake.position.x = (event.offsetX - calibration.x - offset.x) / scale;
      fake.position.y = (event.offsetY - calibration.y - offset.y) / scale;
      this.data.emitProperty("lines", lines, lines);
    };
    this.addEventListener("mousemove", this.__connect__event__);
  }
  hasConnect() {
    const lines = this.data.getProperty("lines");
    return !!this.getLine("connect-param-line");
  }
  stopConnect() {
    const lines = this.data.getProperty("lines");
    delete lines["connect-param-line"];
    this.data.emitProperty("lines", lines, lines);
    this.removeEventListener("mousemove", this.__connect__event__);
  }
  onInit() {
    bindEventListener(this);
    const $canvas = this.querySelector("canvas");
    const ctx = $canvas.getContext("2d");
    const refresh = requestAnimtionFrameThrottling(() => {
      const box = this.getBoundingClientRect();
      const offset = this.data.getProperty("offset");
      const scale = this.data.getProperty("scale");
      const graphType = this.data.getAttribute("type") || "default";
      const option = queryGraphOption(graphType);
      $domBox.setAttribute("style", `--offset-x: ${offset.x}px; --offset-y: ${offset.y}px; --scale: ${scale};`);
      resizeCanvas(this, $canvas, box);
      renderMesh(this, ctx, box, offset, scale, option);
      renderNodes(this, offset, scale);
      renderLines(this, offset, scale);
    });
    const refreshWithoutData = requestAnimtionFrameThrottling(() => {
      const box = this.getBoundingClientRect();
      const offset = this.data.getProperty("offset");
      const scale = this.data.getProperty("scale");
      const graphType = this.data.getAttribute("type") || "default";
      const option = queryGraphOption(graphType);
      $domBox.setAttribute("style", `--offset-x: ${offset.x}px; --offset-y: ${offset.y}px; --scale: ${scale};`);
      renderMesh(this, ctx, box, offset, scale, option);
    });
    const $domBox = this.querySelector("#dom-box");
    this.data.addPropertyListener("scale", (scale) => {
      refreshWithoutData();
    });
    this.data.addPropertyListener("offset", (offset) => {
      refreshWithoutData();
    });
    eventEmmiter.addListener("node-registered", (graph, type) => {
      const $nodes = this.querySelectorAll("#nodes > v-graph-node");
      const nodes = this.data.getProperty("nodes");
      for (let i = 0; i < $nodes.length; i++) {
        const $node = $nodes[i];
        const uuid = $node.getAttribute("node-uuid") || "";
        const node = nodes[uuid];
        if (node && node.type === type) {
          $node.data.emitProperty("type", node.type, node.type);
        }
      }
    });
    this.data.addPropertyListener("nodes", (nodes) => {
      const offset = this.data.getProperty("offset");
      const scale = this.data.getProperty("scale");
      renderNodes(this, offset, scale);
    });
    this.data.addPropertyListener("lines", (lines) => {
      requestAnimationFrame(() => {
        debugger;
        const offset = this.data.getProperty("offset");
        const scale = this.data.getProperty("scale");
        renderLines(this, offset, scale);
      });
    });
    const $selectBox = this.querySelector(".select-box");
    this.data.addPropertyListener("selectBox", (selectBox) => {
      $selectBox.setAttribute("style", `top: ${selectBox.y}px; left: ${selectBox.x}px; width: ${selectBox.w}px; height: ${selectBox.h}px;`);
      const nodes = this.data.getProperty("nodes");
      if (selectBox.x === 0 && selectBox.y === 0 && selectBox.w === 0 && selectBox.h === 0) {
        return;
      }
      this.clearAllLineSelected();
      const selectBoxBoundingClientRect = $selectBox.getBoundingClientRect();
      for (let key in nodes) {
        const node = nodes[key];
        const $node = nodeElementMap.get(node);
        const nodeBoundingClientRect = $node.getBoundingClientRect();
        if (selectBoxBoundingClientRect.left < nodeBoundingClientRect.right && selectBoxBoundingClientRect.right > nodeBoundingClientRect.left && selectBoxBoundingClientRect.top < nodeBoundingClientRect.bottom && selectBoxBoundingClientRect.bottom > nodeBoundingClientRect.top) {
          $node.setProperty("selected", true);
          continue;
        }
        $node.setProperty("selected", false);
      }
    });
    this.data.addAttributeListener("type", (graphType) => {
      const box = this.getBoundingClientRect();
      const offset = this.data.getProperty("offset");
      const scale = this.data.getProperty("scale");
      const option = queryGraphOption(graphType);
      renderMesh(this, ctx, box, offset, scale, option);
    });
    this.shadowRoot.addEventListener("connect-node", (event) => {
      const cEvent = event;
      const { node, param, paramDirection, lineType, details } = cEvent.detail;
      this.startConnect(lineType, node, param, paramDirection, details);
    });
    requestAnimationFrame(refresh);
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === this) {
          refresh();
        }
      });
    });
    resizeObserver.observe(this);
  }
};
(0, import_ui_core3.registerElement)("graph", GraphElement);

// source/theme/class-diagram.ts
function getAngle2(x1, y1, x2, y2) {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const angleRadians = Math.atan2(deltaY, deltaX);
  const angleDegrees = angleRadians * 180 / Math.PI;
  return angleDegrees;
}
registerGraphOption("class-diagram", {
  backgroundColor: "#2f2f2f"
});
registerLine("class-diagram", "inheritance", {
  template: `
        <path d=""></path>
        <polygon points=""></polygon>
    `,
  style: `
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
      !info.line.input.param ? "shortest" : "normal",
      !info.line.output.param ? "shortest" : "normal"
    );
    const angle = getAngle2(info.x1, info.y1, info.x2, info.y2);
    const a = 10 * Math.cos((180 - angle) * Math.PI / 180);
    const b = 10 * Math.sin((180 - angle) * Math.PI / 180);
    const $path = $g.querySelector(`path`);
    $path.setAttribute("d", `M${info.x1},${info.y1} L${info.x2 + a},${info.y2 - b}`);
    const c1x = info.x2;
    const c1y = info.y2;
    const c2x = c1x + 6;
    const c2y = c1y - 10;
    const c3x = c1x - 6;
    const c3y = c1y - 10;
    const $polygon = $g.querySelector(`polygon`);
    $polygon.setAttribute("points", `${c1x},${c1y} ${c2x},${c2y} ${c3x},${c3y}`);
    $polygon.setAttribute("style", `transform-origin: ${c1x}px ${c1y}px; transform: rotate(${angle - 90}deg)`);
  }
});
registerLine("class-diagram", "realization", {
  template: `
        <path d=""></path>
        <polygon points=""></polygon>
    `,
  style: `
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
      !info.line.input.param ? "shortest" : "normal",
      !info.line.output.param ? "shortest" : "normal"
    );
    const angle = getAngle2(info.x1, info.y1, info.x2, info.y2);
    const c1x = info.x2;
    const c1y = info.y2;
    const c2x = c1x + 6;
    const c2y = c1y - 10;
    const c3x = c1x - 6;
    const c3y = c1y - 10;
    const a = 10 * Math.cos((180 - angle) * Math.PI / 180);
    const b = 10 * Math.sin((180 - angle) * Math.PI / 180);
    const $path = $g.querySelector(`path`);
    $path.setAttribute("d", `M${info.x1},${info.y1} L${info.x2 + a},${info.y2 - b}`);
    const $polygon = $g.querySelector(`polygon`);
    $polygon.setAttribute("points", `${c1x},${c1y} ${c2x},${c2y} ${c3x},${c3y}`);
    $polygon.setAttribute("style", `transform-origin: ${c1x}px ${c1y}px; transform: rotate(${angle - 90}deg)`);
  }
});
registerLine("class-diagram", "association", {
  template: `
        <path d=""></path>
        <polygon points=""></polygon>
    `,
  style: `
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
      !info.line.input.param ? "shortest" : "normal",
      !info.line.output.param ? "shortest" : "normal"
    );
    const angle = getAngle2(info.x1, info.y1, info.x2, info.y2);
    const c1x = info.x2;
    const c1y = info.y2;
    const c2x = c1x + 6;
    const c2y = c1y - 10;
    const c3x = c1x - 6;
    const c3y = c1y - 10;
    const c4x = c1x;
    const c4y = c1y - 6;
    const a = 6 * Math.cos((180 - angle) * Math.PI / 180);
    const b = 6 * Math.sin((180 - angle) * Math.PI / 180);
    const $path = $g.querySelector(`path`);
    $path.setAttribute("d", `M${info.x1},${info.y1} L${info.x2 + a},${info.y2 - b}`);
    const $polygon = $g.querySelector(`polygon`);
    $polygon.setAttribute("points", `${c1x},${c1y} ${c2x},${c2y} ${c4x},${c4y} ${c3x},${c3y}`);
    $polygon.setAttribute("style", `transform-origin: ${c1x}px ${c1y}px; transform: rotate(${angle - 90}deg)`);
  }
});
registerLine("class-diagram", "aggregation", {
  template: `
        <path d=""></path>
        <polygon points=""></polygon>
    `,
  style: `
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
      !info.line.input.param ? "shortest" : "normal",
      !info.line.output.param ? "shortest" : "normal"
    );
    const angle = getAngle2(info.x1, info.y1, info.x2, info.y2);
    const c1x = info.x2;
    const c1y = info.y2;
    const c2x = c1x + 6;
    const c2y = c1y - 10;
    const c3x = c1x - 6;
    const c3y = c1y - 10;
    const c4x = c1x;
    const c4y = c1y - 20;
    const a = 20 * Math.cos((180 - angle) * Math.PI / 180);
    const b = 20 * Math.sin((180 - angle) * Math.PI / 180);
    const $path = $g.querySelector(`path`);
    $path.setAttribute("d", `M${info.x1},${info.y1} L${info.x2 + a},${info.y2 - b}`);
    const $polygon = $g.querySelector(`polygon`);
    $polygon.setAttribute("points", `${c1x},${c1y} ${c2x},${c2y} ${c4x},${c4y} ${c3x},${c3y}`);
    $polygon.setAttribute("style", `transform-origin: ${c1x}px ${c1y}px; transform: rotate(${angle - 90}deg)`);
  }
});
registerLine("class-diagram", "composition", {
  template: `
        <path d=""></path>
        <polygon points=""></polygon>
    `,
  style: `
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
      !info.line.input.param ? "shortest" : "normal",
      !info.line.output.param ? "shortest" : "normal"
    );
    const angle = getAngle2(info.x1, info.y1, info.x2, info.y2);
    const c1x = info.x2;
    const c1y = info.y2;
    const c2x = c1x + 6;
    const c2y = c1y - 10;
    const c3x = c1x - 6;
    const c3y = c1y - 10;
    const c4x = c1x;
    const c4y = c1y - 20;
    const a = 20 * Math.cos((180 - angle) * Math.PI / 180);
    const b = 20 * Math.sin((180 - angle) * Math.PI / 180);
    const $path = $g.querySelector(`path`);
    $path.setAttribute("d", `M${info.x1},${info.y1} L${info.x2 + a},${info.y2 - b}`);
    const $polygon = $g.querySelector(`polygon`);
    $polygon.setAttribute("points", `${c1x},${c1y} ${c2x},${c2y} ${c4x},${c4y} ${c3x},${c3y}`);
    $polygon.setAttribute("style", `transform-origin: ${c1x}px ${c1y}px; transform: rotate(${angle - 90}deg)`);
  }
});
registerLine("class-diagram", "dependency", {
  template: `
        <path d=""></path>
        <polygon points=""></polygon>
    `,
  style: `
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
      !info.line.input.param ? "shortest" : "normal",
      !info.line.output.param ? "shortest" : "normal"
    );
    const angle = getAngle2(info.x1, info.y1, info.x2, info.y2);
    const c1x = info.x2;
    const c1y = info.y2;
    const c2x = c1x + 6;
    const c2y = c1y - 10;
    const c3x = c1x - 6;
    const c3y = c1y - 10;
    const c4x = c1x;
    const c4y = c1y - 6;
    const a = 6 * Math.cos((180 - angle) * Math.PI / 180);
    const b = 6 * Math.sin((180 - angle) * Math.PI / 180);
    const $path = $g.querySelector(`path`);
    $path.setAttribute("d", `M${info.x1},${info.y1} L${info.x2 + a},${info.y2 - b}`);
    const $polygon = $g.querySelector(`polygon`);
    $polygon.setAttribute("points", `${c1x},${c1y} ${c2x},${c2y} ${c4x},${c4y} ${c3x},${c3y}`);
    $polygon.setAttribute("style", `transform-origin: ${c1x}px ${c1y}px; transform: rotate(${angle - 90}deg)`);
  }
});
registerNode("class-diagram", "class-node", {
  template: `
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
  style: `
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
    const $menu = this.querySelector(".menu");
    this.querySelector(".class-name").innerHTML = details.name;
    this.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (event.button === 0) {
        this.startMove();
        return;
      }
      if (this.hasConnect()) {
        this.startConnect("");
        return;
      }
      $menu.removeAttribute("hidden");
      function mousedown(event2) {
        $menu.setAttribute("hidden", "");
        document.removeEventListener("mousedown", mousedown, true);
      }
      document.addEventListener("mousedown", mousedown, true);
    });
    $menu.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      event.preventDefault();
      const type = event.target.innerHTML.toLocaleLowerCase();
      this.startConnect(type);
    });
  },
  onUpdate(details) {
    const updateHTML = (type, list) => {
      if (!Array.isArray(list)) {
        return;
      }
      let HTML2 = ``;
      for (const item of list) {
        HTML2 += `<div>${item}</div>`;
      }
      this.querySelector(`.${type}`).innerHTML = HTML2;
    };
    this.data.addPropertyListener("details", (details2) => {
      updateHTML("property", details2.property);
    });
    updateHTML("property", details.property);
    this.data.addPropertyListener("details", (details2) => {
      updateHTML("function", details2.function);
    });
    updateHTML("function", details.function);
  }
});
