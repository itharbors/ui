export const data = {
    scale: 1,
    offset: {
        x: 0,
        y: 0,
    },
    nodes: {
        'test-c-1': {
            type: 'test-c',
            position: {
                x: -20,
                y: -60,
            },
            details: {
                label: 'test-c-1',
            },
        },
        'test-c-2': {
            type: 'test-c',
            position: {
                x: 100,
                y: 200,
            },
            details: {
                label: 'test-c-2',
            },
        },
        'test-c-3': {
            type: 'test-c',
            position: {
                x: 170,
                y: -160,
            },
            details: {
                label: 'test-c-3',
            },
        },
        'test-a-1': {
            type: 'test-a',
            position: {
                x: -230.9754901960791,
                y: -263.76470588235316,
            },
            details: {
                label: 'test-a-1',
            },
        },
        'test-a-2': {
            type: 'test-a',
            position: {
                x: 86.00000000000063,
                y: -303.0000000000002,
            },
            details: {
                label: 'test-a-2',
            },
        },
        'test-b-1': {
            type: 'test-b',
            position: {
                x: -230.9754901960791,
                y: -128.1348039215685,
            },
            details: {
                label: 'test-b-1',
            },
        },
        'test-b-2': {
            type: 'test-b',
            position: {
                x: -77.66221033868112,
                y: 176.37990196078474,
            },
            details: {
                label: 'test-b-2',
            },
        },
    },
    lines: {
        line1: {
            type: 'straight',
            details: {},
            input: {
                node: 'test-c-1',
            },
            output: {
                node: 'test-c-2',
            },
        },
        line2: {
            type: 'curve',
            details: {},
            input: {
                node: 'test-a-1',
                param: 'output1',
            },
            output: {
                node: 'test-a-2',
                param: 'input1',
            },
        },
        line3: {
            type: 'curve',
            details: {},
            input: {
                node: 'test-a-1',
                param: 'output2',
            },
            output: {
                node: 'test-b-2',
                param: 'input2',
            },
        },
        line4: {
            type: 'curve',
            details: {},
            input: {
                node: 'test-b-1',
                param: 'output1',
            },
            output: {
                node: 'test-b-2',
                param: 'input1',
            },
        },
    }
};

for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 50; j++) {
        data.nodes[`test-${i}-t-${j}`] =  {
            type: 'test-c',
            position: {
                x: j * 100 - 3000,
                y: i * 60 - 2000,
            },
            details: {
                label: 'test-c-1',
            },
        }
    }
}
