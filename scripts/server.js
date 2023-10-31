'use strict';

const PORT = 4000;

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(`/public`, express.static(path.join(__dirname, './server/public')));

const HTMLPath = path.join(__dirname, './server/index.html');
const navList = [];

// 获取元素列表
const list = fs.readdirSync(path.join(__dirname, '../element'));
list.forEach((name) => {
    const example = path.join(__dirname, '../element', name, 'example');
    app.use(`/${name}`, express.static(example));
    const bundle = path.join(__dirname, '../element', name, 'bundle');
    app.use(`/${name}`, express.static(bundle));

    if (fs.existsSync(example)) {
        const htmlList = fs.readdirSync(example).filter(htmlName => htmlName.endsWith('.html'));

        navList.push({
            name: name,
            list: htmlList.map((htmlName) => {
                return {
                    name: path.basename(htmlName, '.html'),
                    href: `./${name}/${htmlName}`,
                };
            }),
        });
    }

});

// 主页上的参数
app.get('/', (req, res) => {
    let html = fs.readFileSync(HTMLPath, 'utf8');
    let HTML = '';
    navList.forEach((item) => {
        HTML += `<main name="${item.name}">`;
        HTML += `<h2>${item.name}</h2>`;
        item.list.forEach((navItem) => {
            HTML += `<div>`;
            HTML += `<a href="${navItem.href}" target="_blank">${navItem.name}</a>`;
            HTML += `</div>`;
        });
        HTML += `</main>`;
    });
    html = html.replace('{{CONTENT}}', HTML);
    res.send(html);
});

app.listen(PORT, async () => {
    console.log(`Static server listening on port ${PORT}!`);
    const open = await import('open');
    open.default('http://localhost:4000');
});
