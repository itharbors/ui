'use strict';

const PORT = 4000;

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const HTMLPath = path.join(__dirname, './server/index.html');

// 主页上的参数
app.get('/', (req, res) => {
    const html = fs.readFileSync(HTMLPath, 'utf8');
    res.send(html);
});

const list = fs.readdirSync(path.join(__dirname, '../element'));
list.forEach((name) => {
    const example = path.join(__dirname, '../element', name, 'example');
    app.use(`/${name}`, express.static(example));
    const bundle = path.join(__dirname, '../element', name, 'bundle');
    app.use(`/${name}`, express.static(bundle));
});

app.listen(PORT, async () => {
    console.log(`Static server listening on port ${PORT}!`);
    const open = await import('open');
    open.default('http://localhost:4000');
});
