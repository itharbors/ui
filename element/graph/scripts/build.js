'use strict';

const { join } = require('path');
const { spawn } = require('child_process');

const spawnAsync = function(...cmd) {
    return new Promise((resolve) => {
        const child = spawn('npx', [...cmd], {
            stdio: [0, 1, 2],
            cwd: join(__dirname, '..'),
        });
        child.on('exit', () => {
            resolve();
        });
    });
};

const exec = async function() {
    await spawnAsync('tsc');
    await spawnAsync('esbuild', './source/index.js', '--outfile=./bundle/ui-graph.esm.js', '--bundle', '--format=esm', '--platform=node');
    await spawnAsync('esbuild', './source/theme/class-diagram.js', '--outfile=./bundle/class-diagram.esm.js', '--bundle', '--format=esm', '--platform=node');
    await spawnAsync('esbuild', './source/theme/flow-chart.js', '--outfile=./bundle/flow-chart.esm.js', '--bundle', '--format=esm', '--platform=node');
};

exec();
