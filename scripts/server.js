'use strict';

const PORT = 4000;

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const list = fs.readdirSync(path.join(__dirname, '../element'));
list.forEach((name) => {
    const example = path.join(__dirname, '../element', name, 'example');
    app.use(`/${name}`, express.static(example));
    const bundle = path.join(__dirname, '../element', name, 'bundle');
    app.use(`/${name}`, express.static(bundle));
});

app.listen(PORT, () => {
    console.log(`Static server listening on port ${PORT}!`);
});