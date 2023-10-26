'use strict';

import { registerElement, BaseElement } from '@itharbors/ui-core';

export class GraphNodeParamElement extends BaseElement {
    get HTMLTemplate() { return /*html*/`<slot></slot>`; }
    get HTMLStyle() { return /*css*/`:host { display: block; position: relative; }`; }
}

registerElement('graph-node-param', GraphNodeParamElement);
