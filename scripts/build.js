'use strict';

const { readdirSync } = require('fs');
const { join } = require('path');
const { spawn } = require('child_process');

const spawnNPMAsync = function(cwd, ...cmd) {
    return new Promise((resolve) => {
        const child = spawn('npm', [...cmd], {
            stdio: [0, 1, 2],
            cwd: cwd,
        });
        child.on('exit', () => {
            resolve();
        });
    });
};

const exec = async function() {
    const elementDir = join(__dirname, '../element');
    const names = readdirSync(elementDir);

    for (let name of names) {
        const dir = join(elementDir, name);
        await spawnNPMAsync(dir, 'install');
        await spawnNPMAsync(dir, 'run', 'build');
    }

};

exec();
