export const data = {
    scale: 1,
    offset: {
        x: 0,
        y: 0,
    },
    nodes: {
        'test-1-1': {
            type: 'node',
            position: {
                x: -360,
                y: 0,
            },
            details: {
                label: '设置 Mesh 数据',
            },
        },
        'test-1-2': {
            type: 'node',
            position: {
                x: -120,
                y: 0,
            },
            details: {
                label: '更新 Graph 渲染的缓存数据',
            },
        },
        'test-1-3': {
            type: 'node',
            position: {
                x: 120,
                y: 0,
            },
            details: {
                label: '设置/更新 Nodes 数据',
            },
        },
        'test-1-4': {
            type: 'node',
            position: {
                x: 360,
                y: 0,
            },
            details: {
                label: '设置/更新 Lines 数据',
            },
        },
        'test-2-1': {
            type: 'node',
            position: {
                x: -200,
                y: 200,
            },
            details: {
                label: '重绘 Mesh',
            },
        },
        'test-2-2': {
            type: 'node',
            position: {
                x: 0,
                y: 200,
            },
            details: {
                label: '重绘所有的 Nodes',
            },
        },
        'test-2-3': {
            type: 'node',
            position: {
                x: 200,
                y: 200,
            },
            details: {
                label: '重绘所有的 Lines',
            },
        },
        'test-3-1': {
            type: 'node',
            position: {
                x: -360,
                y: -200,
            },
            details: {
                label: '移动 Graph',
            },
        },
        'test-3-2': {
            type: 'node',
            position: {
                x: -200,
                y: -200,
            },
            details: {
                label: '缩放 Graph',
            },
        },
        'test-3-3': {
            type: 'node',
            position: {
                x: -40,
                y: -200,
            },
            details: {
                label: '设置 Graph 数据',
            },
        },
        'test-3-4': {
            type: 'node',
            position: {
                x: 120,
                y: -200,
            },
            details: {
                label: '移动节点',
            },
        },
        'test-3-5': {
            type: 'node',
            position: {
                x: 280,
                y: -200,
            },
            details: {
                label: '连接节点',
            },
        },
    },
    lines: {
        line1: {
            type: 'curve',
            details: {},
            input: {
                node: 'test-1-1',
            },
            output: {
                node: 'test-2-1',
            },
        },
        line2: {
            type: 'curve',
            details: {},
            input: {
                node: 'test-1-2',
            },
            output: {
                node: 'test-2-1',
            },
        },
        line3: {
            type: 'curve',
            details: {},
            input: {
                node: 'test-1-2',
            },
            output: {
                node: 'test-2-2',
            },
        },
        line4: {
            type: 'curve',
            details: {},
            input: {
                node: 'test-1-2',
            },
            output: {
                node: 'test-2-3',
            },
        },
        line5: {
            type: 'curve',
            details: {},
            input: {
                node: 'test-1-3',
            },
            output: {
                node: 'test-2-2',
            },
        },
        line6: {
            type: 'curve',
            details: {},
            input: {
                node: 'test-1-4',
            },
            output: {
                node: 'test-2-3',
            },
        },
        line7: {
            type: 'curve',
            details: {},
            input: {
                node: 'test-3-1',
            },
            output: {
                node: 'test-1-2',
            },
        },
        line8: {
            type: 'curve',
            details: {},
            input: {
                node: 'test-3-2',
            },
            output: {
                node: 'test-1-2',
            },
        },
        line9: {
            type: 'curve',
            details: {},
            input: {
                node: 'test-3-3',
            },
            output: {
                node: 'test-1-2',
            },
        },
        line10: {
            type: 'curve',
            details: {},
            input: {
                node: 'test-3-4',
            },
            output: {
                node: 'test-1-3',
            },
        },
        line11: {
            type: 'curve',
            details: {},
            input: {
                node: 'test-3-4',
            },
            output: {
                node: 'test-1-4',
            },
        },
        line12: {
            type: 'curve',
            details: {},
            input: {
                node: 'test-3-5',
            },
            output: {
                node: 'test-1-4',
            },
        },
    },
};
