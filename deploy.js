const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 0;
const PUBLIC = __dirname;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
    let filePath = path.join(PUBLIC, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
    });
});

server.listen(PORT, () => {
    const addr = server.address();
    console.log(`Local: http://localhost:${addr.port}`);

    const localtunnel = require('localtunnel');
    localtunnel({ port: addr.port }).then(tunnel => {
        console.log(`\n========================================`);
        console.log(`  PUBLIC URL: ${tunnel.url}`);
        console.log(`  Share this link with anyone!`);
        console.log(`========================================\n`);
    }).catch(err => {
        console.error('Tunnel error:', err.message);
    });
});