'use strict';

const $style = document.createElement('style');
$style.innerHTML = /*css*/`
body {
    /* 基础颜色 */
    --color-default: #fff;
    --color-primary: #1677ff;
    --color-success: #00b578;
    --color-danger: #ff3141;
    --color-wranning: #ff8f1f;

    /* 基础颜色作为背景色的时候，需要一个对比色 */
    --color-default-contrast: #333;
    --color-primary-contrast: #fff;
    --color-success-contrast: #fff;
    --color-danger-contrast: #fff;
    --color-wranning-contrast: #fff;

    /* 基础颜色作为背景色的时候，需要一个对比色 */
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