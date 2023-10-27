'use strict';

const $style = document.createElement('style');
$style.innerHTML = /*css*/`
body {
    /* 基础颜色 */
    --ui-color-default: #fff;
    --ui-color-primary: #1677ff;
    --ui-color-success: #00b578;
    --ui-color-danger: #ff3141;
    --ui-color-warn: #ff8f1f;

    /* 基础颜色作为背景色的时候，需要一个对比色 */
    --ui-color-default-contrast: #333;
    --ui-color-primary-contrast: #fff;
    --ui-color-success-contrast: #fff;
    --ui-color-danger-contrast: #fff;
    --ui-color-warn-contrast: #fff;

    /* 基础颜色作为背景色的时候，需要一个对比色 */
    --ui-color-default-line: #333;
    --ui-color-primary-line: #1677ff;
    --ui-color-success-line: #00b578;
    --ui-color-danger-line: #ff3141;
    --ui-color-warn-line: #ff8f1f;

    --ui-size-line: 24;
    --ui-size-font: 12;
    --ui-size-radius: 4;

    --ui-anim-duration: 0.3s;
}
`;

document.head.appendChild($style);
