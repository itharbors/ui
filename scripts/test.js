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
        child.on('exit', (code) => {
            resolve(code);
        });
    });
};

const spawnNPXAsync = function(cwd, ...cmd) {
    return new Promise((resolve) => {
        const child = spawn('npx', [...cmd], {
            stdio: [0, 1, 2],
            cwd: cwd,
        });
        child.on('exit', (code) => {
            resolve(code);
        });
    });
};

const exec = async function() {
    const elementDir = join(__dirname, '../element');
    const names = readdirSync(elementDir);

    for (let name of names) {
        const dir = join(elementDir, name);
        console.log(dir);
        const installCode = await spawnNPMAsync(dir, 'install');
        const mochaCode = await spawnNPXAsync(dir, 'mocha');
        if (installCode !== 0 || mochaCode !== 0) {
            process.exit(-1);
        }
    }

};

exec();
