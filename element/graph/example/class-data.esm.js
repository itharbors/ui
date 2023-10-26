export const data = {
    scale: 1,
    offset: {
        x: 0,
        y: 0,
    },
    option: {
        type: 'pure',
        meshSize: 0,
        meshColor: '#333',
        backgroundColor: '#333',
    },
    nodes: {
        'test-1': {
            type: 'class-node',
            position: {
                x: 0,
                y: -300,
            },
            details: {
                name: 'GraphElement',
                property: [
                    '+scale: number;',
                    '+option: GraphOption',
                    '+offset: Position;',
                    '+calibration: Position;',
                    '+nodes: Node[];',
                    '+lines: Line[];',
                ],
                function: [
                    '+createNode(nodeInfo): void;',
                    '+createLine(lineInfo): void;',
                    '+startMoveNode(node): void;',
                    '+stopMoveNode(node?): void;',
                    '+startConnect(type, node, param?): void;',
                    '+stopConnect(): void;',
                ],
            },
        },
        'test-2': {
            type: 'class-node',
            position: {
                x: -200,
                y: 80,
            },
            details: {
                name: 'NodeElement',
                property: [
                    '+type: string;',
                    '+details: Object;',
                    '+position: Position;',
                ],
                function: [
                    '+startMove(): void;',
                    '+stopMove(): void;',
                    '+startConnect(type, param?): void;',
                    '+stopConnect(): void;',
                ],
            },
        },
        'test-3': {
            type: 'class-node',
            position: {
                x: 200,
                y: 80,
            },
            details: {
                name: 'LineElement',
                property: [
                    '+type: string;',
                    '+details: Object;',
                    '+input: LineParam;',
                    '+output: LineParam;',
                ],
                function: [],
            },
        },
        'test-4': {
            type: 'class-node',
            position: {
                x: -200,
                y: 380,
            },
            details: {
                name: 'NodeParamElement',
                property: [
                    '+name: string;',
                    '+direction: string;',
                    '+type: string;',
                    '+role: string;',
                ],
                function: [
                    '+startConnect(type): void;',
                    '+stopConnect(): void;',
                ],
            },
        },
        'test-5': {
            type: 'class-node',
            position: {
                x: 120,
                y: 300,
            },
            details: {
                name: 'Inheritance',
                property: [],
                function: [],
            },
        },
        'test-6': {
            type: 'class-node',
            position: {
                x: 120,
                y: 340,
            },
            details: {
                name: 'Realization',
                property: [],
                function: [],
            },
        },
        'test-7': {
            type: 'class-node',
            position: {
                x: 120,
                y: 380,
            },
            details: {
                name: 'Association',
                property: [],
                function: [],
            },
        },
        'test-8': {
            type: 'class-node',
            position: {
                x: 120,
                y: 420,
            },
            details: {
                name: 'Aggregation',
                property: [],
                function: [],
            },
        },
        'test-9': {
            type: 'class-node',
            position: {
                x: 120,
                y: 460,
            },
            details: {
                name: 'Composition',
                property: [],
                function: [],
            },
        },
        'test-10': {
            type: 'class-node',
            position: {
                x: 120,
                y: 500,
            },
            details: {
                name: 'Dependency',
                property: [],
                function: [],
            },
        },
    },
    lines: {
        line1: {
            type: 'composition',
            details: {},
            input: {
                node: 'test-2',
            },
            output: {
                node: 'test-1',
            },
        },
        line2: {
            type: 'composition',
            details: {},
            input: {
                node: 'test-3',
            },
            output: {
                node: 'test-1',
            },
        },
        line3: {
            type: 'composition',
            details: {},
            input: {
                node: 'test-4',
            },
            output: {
                node: 'test-2',
            },
        },
        line4: {
            type: 'inheritance',
            details: {},
            input: {
                node: 'test-5',
            },
            output: {
                node: 'test-4',
            },
        },
        line5: {
            type: 'realization',
            details: {},
            input: {
                node: 'test-6',
            },
            output: {
                node: 'test-4',
            },
        },
        line6: {
            type: 'association',
            details: {},
            input: {
                node: 'test-7',
            },
            output: {
                node: 'test-4',
            },
        },
        line7: {
            type: 'aggregation',
            details: {},
            input: {
                node: 'test-8',
            },
            output: {
                node: 'test-4',
            },
        },
        line8: {
            type: 'composition',
            details: {},
            input: {
                node: 'test-9',
            },
            output: {
                node: 'test-4',
            },
        },
        line9: {
            type: 'dependency',
            details: {},
            input: {
                node: 'test-10',
            },
            output: {
                node: 'test-4',
            },
        },
    },
};
