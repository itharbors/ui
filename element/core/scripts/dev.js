'use strict';

const { spawn } = require('child_process');

const spawnAsync = function(...cmd) {
    return new Promise((resolve) => {
        const child = spawn('npx', [...cmd], {
            stdio: [0, 1, 2],
        });
        child.on('exit', () => {
            resolve();
        });
    });
};

const exec = async function() {
    await spawnAsync('tsc', '-w');
};

exec();
